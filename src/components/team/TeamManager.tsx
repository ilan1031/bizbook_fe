"use client";

// Settings > Users & Roles: the organisation's team, its roles and its history.
// The organisation admin manages it here; the server checks every change.
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import dayjs from "dayjs";
import { useSnackbar } from "../SnackbarProvider";
import InviteDialog from "./InviteDialog";
import RoleDialog from "./RoleDialog";
import {
  errorText,
  teamApi,
  type AuditRow,
  type TeamMember,
  type TeamOverview,
  type TeamRole,
} from "../../services/teamApi";

const headerSx = { fontSize: 12, fontWeight: 600, color: "#6c718a", textTransform: "uppercase" as const, bgcolor: "#f6f6fa" };
const fmt = (d?: string | null) => (d ? dayjs(d).format("DD-MM-YYYY HH:mm") : "—");

const ACTION_TEXT: Record<string, string> = {
  member_invited: "Invited",
  invite_resent: "Sent the invite again",
  invite_accepted: "Accepted the invite",
  invite_cancelled: "Cancelled an invite",
  member_removed: "Removed a member",
  role_changed: "Changed a role",
  member_disabled: "Turned a member off",
  member_enabled: "Turned a member on",
  role_created: "Created a role",
  role_updated: "Changed a role",
  role_deleted: "Deleted a role",
  switch_changed: "Changed Team users",
  limit_changed: "Changed the member limit",
};

function StatusChip({ member }: { member: TeamMember }) {
  if (member.status === "active") return <Chip size="small" color="success" variant="outlined" label="Active" />;
  if (member.status === "disabled") return <Chip size="small" variant="outlined" label="Turned off" />;
  if (member.invite_expired) return <Chip size="small" color="error" variant="outlined" label="Invite expired" />;
  return <Chip size="small" color="warning" variant="outlined" label="Invite sent" />;
}

export default function TeamManager({ orgId }: { orgId: string }) {
  const { showMessage } = useSnackbar();
  const [overview, setOverview] = useState<TeamOverview | null>(null);
  const [history, setHistory] = useState<AuditRow[]>([]);
  const [loadError, setLoadError] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<any>("");
  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const [roleEdit, setRoleEdit] = useState<{ open: boolean; role: TeamRole | null }>({ open: false, role: null });
  const [removing, setRemoving] = useState<TeamMember | null>(null);

  const load = useCallback(async () => {
    // The team and its history load separately: a failed history must not keep
    // the team list from showing the latest changes (e.g. a removed person).
    try {
      const o = await teamApi.overview(orgId);
      setOverview(o.data || null);
      setLoadError("");
    } catch (e) {
      setLoadError(errorText(e, "Couldn't load the team."));
    }
    try {
      const a = await teamApi.audit(orgId);
      setHistory(a.data || []);
    } catch {
      // The history is shown as it was; the team list above is what matters.
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId) load();
  }, [orgId, load]);

  // One action at a time; a failure is shown and the list is reloaded anyway.
  const run = async (key: string, action: () => Promise<{ message?: string; email?: { ok: boolean; error?: string } }>, fallback: string) => {
    setBusy(key);
    try {
      const res = await action();
      if (res.email && !res.email.ok) showMessage(res.message || `${fallback}, but the email couldn't be sent.`, "warning");
      else showMessage(res.message || "Saved", "success");
    } catch (e) {
      showMessage(errorText(e, fallback), "error");
    } finally {
      setBusy("");
      await load();
    }
  };

  if (!orgId) return <Alert severity="warning">Choose an organisation first.</Alert>;
  if (loading && !overview) {
    return (
      <Box sx={{ p: 6, textAlign: "center" as const }}>
        <CircularProgress size={28} />
      </Box>
    );
  }
  if (loadError && !overview) return <Alert severity="error">{loadError}</Alert>;
  if (!overview) return null;

  const full = overview.seats_used >= overview.limit;
  const roles = overview.roles;
  const roleName = (id: string) => roles.find((r) => r.id === id)?.name || "Role removed";

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2, flexWrap: "wrap" as const, gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Staff &amp; Roles</Typography>
          <Typography variant="body2" color="text.secondary">
            Add staff to work in {overview.organization.name}. Each person gets a role, and can never do more than you can.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" label={`${overview.seats_used} of ${overview.limit} team members`} color={full ? "warning" : "default"} />
          <Tooltip title={full ? "Your team is full. Remove someone or ask the superadmin to raise the limit." : ""}>
            <span>
              <Button variant="contained" onClick={() => setInviteOpen(true)} disabled={full} sx={{ textTransform: "none" as const }}>
                Add staff
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                <TableCell key={h} sx={headerSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {overview.members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#6c718a" }}>
                  No staff yet. Click "Add staff" to invite someone.
                </TableCell>
              </TableRow>
            )}
            {overview.members.map((m) => {
              const pending = m.status === "invited";
              return (
                <TableRow key={m._id} hover>
                  <TableCell>{m.name || "—"}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell sx={{ minWidth: 170 }}>
                    <TextField
                      select
                      size="small"
                      variant="standard"
                      value={m.role_id}
                      disabled={busy === m._id}
                      onChange={(e) =>
                        run(m._id, () => teamApi.updateMember(orgId, m._id, { role_id: (e.target as any).value }), "Couldn't change the role")
                      }
                      inputProps={{ "aria-label": `Role for ${m.email}` }}
                      sx={{ minWidth: 150 }}
                    >
                      {roles.map((r) => (
                        <MenuItem key={r.id} value={r.id}>
                          {r.name}
                        </MenuItem>
                      ))}
                      {!roles.some((r) => r.id === m.role_id) && <MenuItem value={m.role_id}>{roleName(m.role_id)}</MenuItem>}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <StatusChip member={m} />
                    {pending && <Typography variant="caption" sx={{ display: "block" as const, color: "#6c718a" }}>Link valid until {fmt(m.invite_expires_at)}</Typography>}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {pending ? (
                        <Button size="small" variant="outlined" startIcon={<SendOutlinedIcon />} disabled={busy === m._id} onClick={() => run(m._id, () => teamApi.resend(orgId, m._id), "Couldn't send the invite")} sx={{ textTransform: "none" as const }}>
                          Send again
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color={m.status === "disabled" ? "success" : "warning"}
                          disabled={busy === m._id}
                          onClick={() =>
                            run(m._id, () => teamApi.updateMember(orgId, m._id, { status: m.status === "disabled" ? "active" : "disabled" }), "Couldn't change access")
                          }
                          sx={{ textTransform: "none" as const }}
                        >
                          {m.status === "disabled" ? "Turn on" : "Turn off"}
                        </Button>
                      )}
                      <Tooltip title="Remove from the team">
                        <IconButton size="small" aria-label={`Remove ${m.email}`} onClick={() => setRemoving(m)} disabled={busy === m._id}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight={600}>Roles</Typography>
        <Button size="small" variant="outlined" onClick={() => setRoleEdit({ open: true, role: null })} sx={{ textTransform: "none" as const }}>
          New role
        </Button>
      </Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Role", "What it is for", "Members", ""].map((h, i) => (
                <TableCell key={`${h}-${i}`} sx={headerSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>
                  {r.name} {r.preset && <Chip size="small" label="Built-in" variant="outlined" sx={{ ml: 1 }} />}
                </TableCell>
                <TableCell>{r.description || "—"}</TableCell>
                <TableCell>{r.members ?? 0}</TableCell>
                <TableCell align="right">
                  {!r.preset && (
                    <>
                      <IconButton size="small" aria-label={`Edit ${r.name}`} onClick={() => setRoleEdit({ open: true, role: r })}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={`Delete ${r.name}`}
                        disabled={(r.members ?? 0) > 0}
                        onClick={() => run(r.id, () => teamApi.deleteRole(orgId, r.id), "Couldn't delete the role")}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>History</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {["When", "Who", "What", "Person or role", "Details"].map((h) => (
                <TableCell key={h} sx={headerSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#6c718a" }}>
                  Nothing has changed yet.
                </TableCell>
              </TableRow>
            )}
            {history.map((h) => (
              <TableRow key={h._id}>
                <TableCell sx={{ whiteSpace: "nowrap" as const }}>{fmt(h.at)}</TableCell>
                <TableCell>{h.actor}</TableCell>
                <TableCell>{ACTION_TEXT[h.action] || h.action}</TableCell>
                <TableCell>{h.target_name ? `${h.target_name} (${h.target})` : h.target || "—"}</TableCell>
                <TableCell>{h.details || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        orgId={orgId}
        roles={roles}
        onInvited={(message) => {
          showMessage(message, "success");
          load();
        }}
      />
      <RoleDialog
        open={roleEdit.open}
        onClose={() => setRoleEdit({ open: false, role: null })}
        orgId={orgId}
        grid={overview.grid}
        ceiling={overview.ceiling}
        role={roleEdit.role}
        onSaved={(message) => {
          showMessage(message, "success");
          load();
        }}
      />
      <Dialog open={Boolean(removing)} onClose={() => setRemoving(null)}>
        <DialogTitle>{removing?.status === "invited" ? "Cancel this invite?" : "Remove from the team?"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {removing?.status === "invited"
              ? `${removing?.email} won't be able to use the invite link any more.`
              : `${removing?.email} will be signed out and lose access to ${overview.organization.name}. They can be invited again later.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoving(null)} sx={{ textTransform: "none" as const }}>Keep</Button>
          <Button
            color="error"
            variant="contained"
            sx={{ textTransform: "none" as const }}
            onClick={() => {
              const m = removing;
              setRemoving(null);
              if (!m) return;
              // Take the row off the list now; run() reloads the team, and puts
              // it back if the removal was refused.
              setOverview((prev) => (prev ? { ...prev, members: prev.members.filter((x) => x._id !== m._id) } : prev));
              run(m._id, () => teamApi.remove(orgId, m._id), "Couldn't remove");
            }}
          >
            {removing?.status === "invited" ? "Cancel invite" : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
