"use client";

// Superadmin: every organisation's team. Turn Team users on or off for its
// admin, set the member limit, see members and invites, change roles, turn
// members off, resend or cancel invites, and remove people.
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
} from "@mui/material";
import dayjs from "dayjs";
import { useSnackbar } from "../SnackbarProvider";
import { adminTeamApi, errorText, type AdminTeam, type TeamMember } from "../../services/teamApi";

const headerSx = { fontSize: 12, fontWeight: 600, color: "#6c718a", textTransform: "uppercase" as const, bgcolor: "#f6f6fa" };
const fmt = (d?: string | null) => (d ? dayjs(d).format("DD-MM-YYYY HH:mm") : "—");

function MemberStatus({ member }: { member: TeamMember }) {
  if (member.status === "active") return <Chip size="small" color="success" variant="outlined" label="Active" />;
  if (member.status === "disabled") return <Chip size="small" variant="outlined" label="Turned off" />;
  if (member.invite_expired) return <Chip size="small" color="error" variant="outlined" label="Invite expired" />;
  return <Chip size="small" color="warning" variant="outlined" label={`Invite until ${fmt(member.invite_expires_at)}`} />;
}

export default function AdminTeams(_props?: any) {
  const { showMessage } = useSnackbar();
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>("");
  const [limits, setLimits] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<any>("");

  const load = useCallback(async () => {
    try {
      const res = await adminTeamApi.list(page);
      setTeams(res.data || []);
      setPages(Math.max(1, res.pages || 1));
      setTotal(res.total || 0);
      setError("");
    } catch (e) {
      setError(errorText(e, "Couldn't load the teams."));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

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

  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: "center" as const }}>
        <CircularProgress size={28} />
      </Box>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (teams.length === 0) return <Typography color="text.secondary">No organisations yet.</Typography>;

  return (
    <Stack spacing={3}>
      {teams.map((t) => (
        <Paper key={t._id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography fontWeight={600}>{t.org_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Organisation {t.organization_id} · admin {t.owner?.email || "—"}
                {t.owner && t.owner.status !== "active" && t.owner.role !== "superadmin" ? ` (${t.owner.status})` : ""}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Stack direction="row" alignItems="center">
                <Typography variant="body2">Team users</Typography>
                <Switch
                  size="small"
                  color="success"
                  checked={t.team_switch}
                  disabled={busy === `sw-${t.organization_id}`}
                  onChange={(e) =>
                    run(`sw-${t.organization_id}`, () => adminTeamApi.updateTeam(t.organization_id, { team_users: e.target.checked }), "Couldn't change the switch")
                  }
                  inputProps={{ "aria-label": `Team users for ${t.org_name}` }}
                />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                {(() => {
                  const limitText = limits[t.organization_id] ?? String(t.limit);
                  const limitOk = /^\d+$/.test(limitText.trim()) && Number(limitText) <= 500;
                  return (
                    <>
                      <TextField
                        size="small"
                        label="Max members"
                        type="number"
                        value={limitText}
                        onChange={(e) => setLimits((prev) => ({ ...prev, [t.organization_id]: (e.target as any).value }))}
                        inputProps={{ min: 0, max: 500 }}
                        error={!limitOk}
                        helperText={limitOk ? " " : "Enter a whole number from 0 to 500 (it can't be empty)"}
                        sx={{ width: 130 }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: "none" as const }}
                        disabled={!limitOk || busy === `lim-${t.organization_id}`}
                        onClick={() => {
                          run(`lim-${t.organization_id}`, () => adminTeamApi.updateTeam(t.organization_id, { team_max_members: Number(limitText.trim()) }), "Couldn't save the limit");
                        }}
                      >
                        Save limit
                      </Button>
                    </>
                  );
                })()}
              </Stack>
              <Chip size="small" label={`${t.seats_used} of ${t.limit} used`} />
            </Stack>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                    <TableCell key={h} sx={headerSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {t.members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: "#6c718a" }}>
                      No team members.
                    </TableCell>
                  </TableRow>
                )}
                {t.members.map((m) => {
                  const pending = m.status === "invited";
                  return (
                    <TableRow key={m._id}>
                      <TableCell>{m.name || "—"}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <TextField
                          select
                          size="small"
                          variant="standard"
                          value={m.role_id}
                          disabled={busy === m._id}
                          onChange={(e) => run(m._id, () => adminTeamApi.updateMember(m._id, { role_id: (e.target as any).value }), "Couldn't change the role")}
                          inputProps={{ "aria-label": `Role for ${m.email}` }}
                          sx={{ minWidth: 140 }}
                        >
                          {t.roles.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                              {r.name}
                            </MenuItem>
                          ))}
                          {!t.roles.some((r) => r.id === m.role_id) && <MenuItem value={m.role_id}>{m.role_name}</MenuItem>}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <MemberStatus member={m} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {pending ? (
                            <Button size="small" variant="outlined" sx={{ textTransform: "none" as const }} disabled={busy === m._id} onClick={() => run(m._id, () => adminTeamApi.resend(m._id), "Couldn't reset the invite")}>
                              Reset invite
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: "none" as const }}
                              disabled={busy === m._id}
                              onClick={() => run(m._id, () => adminTeamApi.updateMember(m._id, { status: m.status === "disabled" ? "active" : "disabled" }), "Couldn't change access")}
                            >
                              {m.status === "disabled" ? "Turn on" : "Turn off"}
                            </Button>
                          )}
                          <Button
                            size="small"
                            color="error"
                            variant={"text" as any}
                            sx={{ textTransform: "none" as const }}
                            disabled={busy === m._id}
                            onClick={() => run(m._id, () => adminTeamApi.remove(m._id), pending ? "Couldn't cancel the invite" : "Couldn't remove")}
                          >
                            {pending ? "Cancel invite" : "Remove"}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
      {pages > 1 && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          <Typography variant="body2" color="text.secondary">
            {total} organisations, newest first
          </Typography>
          <Pagination size="small" count={pages} page={page} onChange={(_e, next) => setPage(next)} />
        </Stack>
      )}
    </Stack>
  );
}
