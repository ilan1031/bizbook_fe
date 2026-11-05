"use client";

// Superadmin screen: approve sign-ups, activate/deactivate users, set which
// pages and actions each user gets, and manage the IP addresses (devices)
// each user may sign in from.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Switch,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import dayjs from "dayjs";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";

const ACTIONS = ["view", "create", "edit", "delete", "convert"];
const ACTION_LABELS = { view: "View", create: "Create", edit: "Edit", delete: "Delete", convert: "Convert" };
const STATUS_COLORS = { pending: "warning", active: "success", inactive: "default" };
const headerCellSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#6c718a",
  textTransform: "uppercase" as const,
  bgcolor: "#f6f6fa",
};
const fmt = (d) => (d ? dayjs(d).format("DD-MM-YYYY HH:mm") : "—");
const usageText = (used, limit) => `${used ?? 0}${Number.isInteger(limit) ? ` (${limit})` : ""}`;

// Whether account email (sign-in codes, approvals) is working, from the last
// real send the server made. "Not tested" until something has been sent.
type MailTone = "default" | "success" | "warning" | "error";
const mailStatus = (mail: any): { label: string; color: MailTone; title: string } | null => {
  if (!mail) return null;
  if (!mail.configured) {
    return { label: "Mail not set up", color: "warning", title: "EMAIL_USER and EMAIL_PASS aren't set, so no emails (sign-in codes included) go out." };
  }
  const health = mail.health;
  const via = mail.target ? ` via ${mail.target}` : "";
  if (!health) {
    return { label: "Mail not tested yet", color: "default", title: `Emails go out${via}. Send a test email to check.` };
  }
  const when = health.checked_at ? ` at ${fmt(health.checked_at)}` : "";
  if (health.ok) return { label: "Mail working", color: "success", title: `Last email sent OK${when}${via}.` };
  return { label: "Mail failing", color: "error", title: `Last email failed${when}${via}: ${health.error || "unknown error"}` };
};

// Create limits the superadmin sets per user; empty means no limit.
const LIMIT_FIELDS = [
  ["per_day", "New records per day"],
  ["per_month", "New records per month"],
  ["per_year", "New records per year"],
  ["max_organizations", "Organisations allowed"],
];
const limitError = (v) => (v === "" || (/^\d+$/.test(v) && Number(v) <= 1000000) ? "" : "Whole number, or empty");

// A temporary sign-in code that couldn't be emailed: shown to the superadmin to
// pass on. It expires after 5 minutes and works once.
function WaitingCode({ item, onCopied }: { item: any; onCopied: () => void }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.code);
      onCopied();
    } catch {
      // Clipboard blocked: the code is on screen to read out.
    }
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
      {item.email && <Typography sx={{ fontSize: "13px" }}>{item.email}</Typography>}
      <Box
        component="span"
        data-testid="waiting-code"
        sx={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 700, letterSpacing: "0.2em", bgcolor: "#fff", border: "1px dashed #b26a00", borderRadius: 1, px: 1 }}
      >
        {item.code}
      </Box>
      <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>expires {dayjs(item.expires_at).format("HH:mm")}</Typography>
      <Tooltip title="Copy the code">
        <IconButton size="small" onClick={copy} aria-label="Copy sign-in code">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function UsersAccessPage(_props?: any) {
  const { showMessage } = useSnackbar();
  const [tab, setTab] = useState<string>("pending");
  const [users, setUsers] = useState<any>([]);
  const [counts, setCounts] = useState<any>({});
  const [catalog, setCatalog] = useState<any>([]);
  const [mail, setMail] = useState<any>(null);
  // Codes that couldn't be emailed and are waiting to be passed on (any tab).
  const [waitingCodes, setWaitingCodes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<any>(null);
  const [mailDialog, setMailDialog] = useState<boolean>(false);
  // The user whose one-time sign-in code is being made (the code itself lives only in that dialog).
  const [codeFor, setCodeFor] = useState<any>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await apiService({
        method: "GET",
        url: "api/v1/admin/users",
        params: tab === "all" ? {} : { status: tab },
      });
      setUsers(res.data.data || []);
      setCounts(res.data.counts || {});
      setCatalog(res.data.catalog || []);
      setMail(res.data.email || null);
      setWaitingCodes(res.data.pending_codes || []);
    } catch (error) {
      if (!silent) showMessage(error?.message || "Couldn't load users", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [tab]);

  // A code appears here the moment someone's email fails, so look again
  // every few seconds while the page is open and visible.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load(true);
    }, 8000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    // Fetch the list when the tab changes (load sets the loading state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const update = async (user, changes, successText) => {
    try {
      const res = await apiService({
        method: "PATCH",
        url: `api/v1/admin/users/${user._id}`,
        data: changes,
      });
      let text = successText || "Saved";
      if (res.data.email && !res.data.email.ok) text += ` (approval email not sent: ${res.data.email.error})`;
      else if (res.data.email?.ok) text += " - approval email sent to the user";
      showMessage(text, res.data.email && !res.data.email.ok ? "warning" : "success");
      await load();
      return res.data.data;
    } catch (error) {
      showMessage(error?.message || "Couldn't save", "error");
      return null;
    }
  };

  const total = Object.values(counts).reduce((s, n: any) => s + n, 0);
  const mailChip = mailStatus(mail);

  return (
    <Box sx={{ bgcolor: "#f6f6fa", minHeight: "100%" }}>
      <Box
        sx={{
          position: "sticky" as const,
          top: 0,
          zIndex: 5,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 1.5,
          display: "flex" as const,
          alignItems: "center" as const,
          justifyContent: "space-between" as const,
          flexWrap: "wrap" as const,
          gap: 1,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>
            Superadmin
          </Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Users &amp; Access</Typography>
        </Box>
        <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1 }}>
          {mailChip && (
            <Tooltip title={mailChip.title}>
              <Chip
                size="small"
                icon={<MailOutlineIcon />}
                color={mailChip.color}
                label={mail.configured ? `${mailChip.label} · ${mail.from}` : mailChip.label}
              />
            </Tooltip>
          )}
          <Button size="small" variant="outlined" href="/admin/teams" sx={{ textTransform: "none" as const }}>
            Teams
          </Button>
          <Button size="small" variant="outlined" onClick={() => setMailDialog(true)} sx={{ textTransform: "none" as const }}>
            Send test email
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {waitingCodes.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 0.5 }}>
              {waitingCodes.length === 1 ? "Someone is waiting" : `${waitingCodes.length} people are waiting`} for a sign-in code:
              the email didn&apos;t go out. Tell them the code.
            </Typography>
            {waitingCodes.map((c) => (
              <WaitingCode key={c.user_id} item={c} onCopied={() => showMessage("Code copied", "success")} />
            ))}
          </Alert>
        )}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab value="pending" label={`Pending approval (${counts.pending || 0})`} sx={{ textTransform: "none" as const }} />
          <Tab value="active" label={`Active (${counts.active || 0})`} sx={{ textTransform: "none" as const }} />
          <Tab value="inactive" label={`Inactive (${counts.inactive || 0})`} sx={{ textTransform: "none" as const }} />
          <Tab value="all" label={`All (${total})`} sx={{ textTransform: "none" as const }} />
        </Tabs>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>User</TableCell>
                <TableCell sx={headerCellSx}>Mobile</TableCell>
                <TableCell sx={headerCellSx}>Status</TableCell>
                <TableCell sx={headerCellSx}>Pages</TableCell>
                <TableCell sx={headerCellSx}>Devices</TableCell>
                <TableCell sx={headerCellSx}>Created (day · month · year)</TableCell>
                <TableCell sx={headerCellSx}>Last sign-in</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5, color: "#6c718a" }}>
                    No users here.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => {
                  const isSuper = u.role === "superadmin";
                  const pageCount = Object.keys(u.permissions || {}).length;
                  return (
                    <TableRow key={u._id} hover sx={{ "& td": { fontSize: "13px" } }}>
                      <TableCell>
                        <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>{u.email}</Typography>
                        {u.pending_sign_in_code && (
                          <WaitingCode item={{ ...u.pending_sign_in_code, email: "" }} onCopied={() => showMessage("Code copied", "success")} />
                        )}
                        <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>
                          {u.company_name || "—"} · joined {dayjs(u.createdAt).format("DD-MM-YYYY")}
                        </Typography>
                        {!isSuper && mailChip && (
                          <Tooltip title={mailChip.title}>
                            <Chip
                              size="small"
                              variant="outlined"
                              icon={<MailOutlineIcon />}
                              color={mailChip.color}
                              label={mailChip.label}
                              sx={{ mt: 0.5, height: 20, fontSize: "11px" }}
                            />
                          </Tooltip>
                        )}
                        {lastCodeLine(u) && (
                          <Typography sx={{ fontSize: "11px", color: "#6c718a", mt: 0.5 }}>{lastCodeLine(u)}</Typography>
                        )}
                      </TableCell>
                      <TableCell>{u.mobile}</TableCell>
                      <TableCell>
                        {isSuper ? (
                          <Chip size="small" color="primary" label="Superadmin" />
                        ) : (
                          <Chip size="small" color={STATUS_COLORS[u.status] || "default"} label={u.status || "pending"} />
                        )}
                      </TableCell>
                      <TableCell>{isSuper ? "All" : pageCount}</TableCell>
                      <TableCell>
                        {isSuper ? "Any" : `${(u.allowed_ips || []).length} / ${u.ip_limit ?? 2}`}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" as const }}>
                        {isSuper ? (
                          "No limit"
                        ) : (
                          <Tooltip title="Records created today / this month / this year (limit in brackets)">
                            <span>
                              {usageText(u.usage?.day, u.limits?.per_day)} · {usageText(u.usage?.month, u.limits?.per_month)} ·{" "}
                              {usageText(u.usage?.year, u.limits?.per_year)}
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{fmt(u.last_login_at)}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" as const }}>
                        {!isSuper && (
                          <>
                            {u.status !== "active" ? (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  update(u, { status: "active" }, u.status === "pending" ? "User approved" : "User activated")
                                }
                                sx={{ textTransform: "none" as const, mr: 1 }}
                              >
                                {u.status === "pending" ? "Approve" : "Activate"}
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => update(u, { status: "inactive" }, "User deactivated")}
                                sx={{ textTransform: "none" as const, mr: 1 }}
                              >
                                Deactivate
                              </Button>
                            )}
                            <Tooltip title={u.status === "active" ? "A one-time code for their next sign-in, when email isn't arriving" : "Approve this account first"}>
                              <span>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<VpnKeyOutlinedIcon />}
                                  disabled={u.status !== "active"}
                                  onClick={() => setCodeFor(u)}
                                  sx={{ textTransform: "none" as const, mr: 1 }}
                                >
                                  Sign-in code
                                </Button>
                              </span>
                            </Tooltip>
                            <Button size="small" variant="outlined" onClick={() => setEditing(u)} sx={{ textTransform: "none" as const }}>
                              Manage
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography sx={{ fontSize: "12px", color: "#6c718a", mt: 1.5 }}>
          New sign-ups can&apos;t sign in until you approve them, and they see nothing until you give
          them pages. Each user may sign in from up to their device limit of IP addresses; remove an
          old one to let them use a new device.
        </Typography>
      </Box>

      {editing && (
        <ManageUserDialog
          user={editing}
          catalog={catalog}
          onClose={() => setEditing(null)}
          onSave={async (changes) => {
            const saved = await update(editing, changes, "Access updated");
            if (saved) setEditing(null);
          }}
          onRemoveIp={async (ip) => {
            try {
              const res = await apiService({
                method: "DELETE",
                url: `api/v1/admin/users/${editing._id}/ips/${ip._id}`,
              });
              showMessage(`Removed ${ip.ip}`, "success");
              setEditing(res.data.data);
              load();
            } catch (error) {
              showMessage(error?.message || "Couldn't remove IP", "error");
            }
          }}
        />
      )}

      {codeFor && <SignInCodeDialog user={codeFor} onClose={() => setCodeFor(null)} onIssued={load} />}

      <TestEmailDialog open={mailDialog} onClose={() => setMailDialog(false)} onDone={load} />
    </Box>
  );
}

function ManageUserDialog({ user, catalog, onClose, onSave, onRemoveIp }: any) {
  const [status, setStatus] = useState(user.status || "pending");
  const [ipLimit, setIpLimit] = useState(String(user.ip_limit ?? 2));
  const [perms, setPerms] = useState(() => ({ ...(user.permissions || {}) }));
  const [limits, setLimits] = useState(() =>
    Object.fromEntries(LIMIT_FIELDS.map(([k]) => [k, Number.isInteger(user.limits?.[k]) ? String(user.limits[k]) : ""]))
  );
  const [saving, setSaving] = useState<boolean>(false);

  const groups = useMemo(() => {
    const map = new Map();
    catalog.forEach((p) => map.set(p.group, [...(map.get(p.group) || []), p]));
    return [...map.entries()];
  }, [catalog]);

  const has = (key, action) => (perms[key] || []).includes(action);
  const setPage = (key, actions) =>
    setPerms((prev) => {
      const next = { ...prev };
      if (actions.length) next[key] = actions;
      else delete next[key];
      return next;
    });
  const toggle = (page, action) => {
    let current = perms[page.key] || [];
    if (current.includes(action)) {
      // Removing "view" removes everything for the page.
      current = action === "view" ? [] : current.filter((a) => a !== action);
    } else {
      // Any action needs "view".
      current = [...new Set(["view", ...current, action])];
    }
    setPage(page.key, ACTIONS.filter((a) => current.includes(a) && page.actions.includes(a)));
  };
  const setEveryPage = (actions) =>
    setPerms(() => {
      const next: any = {};
      catalog.forEach((p) => {
        const a = p.actions.filter((x) => actions.includes(x));
        if (a.length) next[p.key] = a;
      });
      return next;
    });

  const limitNum = Number(ipLimit);
  const limitValid =
    Number.isInteger(limitNum) && limitNum >= 0 && limitNum <= 50 && LIMIT_FIELDS.every(([k]) => !limitError(limits[k]));

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex" as const, alignItems: "center" as const, justifyContent: "space-between" as const }}>
        <Box>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Manage access</Typography>
          <Typography sx={{ fontSize: "13px", color: "#6c718a" }}>
            {user.email} · {user.company_name || "—"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex" as const, gap: 2, flexWrap: "wrap" as const, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Account status</InputLabel>
            <Select label="Account status" value={status} onChange={(e) => setStatus((e.target as any).value)}>
              <MenuItem value="pending">Pending (can&apos;t sign in)</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive (can&apos;t sign in)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Device (IP) limit"
            value={ipLimit}
            onChange={(e) => setIpLimit((e.target as any).value.replace(/[^\d]/g, ""))}
            error={!limitValid}
            helperText={limitValid ? "How many IP addresses this user may sign in from" : "0 to 50"}
            sx={{ width: 220 }}
          />
        </Box>

        <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 0.5 }}>Create limits</Typography>
        <Typography sx={{ fontSize: "12px", color: "#6c718a", mb: 1.5 }}>
          How many new records (customers, invoices, bills, items, imports...) this user may create, and how many
          organisations they may have. Leave empty for no limit. So far: {user.usage?.day ?? 0} today,{" "}
          {user.usage?.month ?? 0} this month, {user.usage?.year ?? 0} this year, {user.usage?.organizations ?? 0}{" "}
          organisation(s).
        </Typography>
        <Box sx={{ display: "grid" as const, gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 1.5, mb: 3 }}>
          {LIMIT_FIELDS.map(([key, label]) => (
            <TextField
              key={key}
              size="small"
              label={label}
              placeholder="No limit"
              value={limits[key]}
              onChange={(e) => setLimits({ ...limits, [key]: (e.target as any).value.replace(/[^\d]/g, "") })}
              error={Boolean(limitError(limits[key]))}
              helperText={limitError(limits[key]) || " "}
            />
          ))}
        </Box>

        <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}>
          Approved IP addresses ({(user.allowed_ips || []).length} / {user.ip_limit ?? 2})
        </Typography>
        {user.last_blocked_ip?.ip && (
          <Alert severity="info" sx={{ mb: 1.5 }}>
            Last sign-in turned away from <b style={{ fontFamily: "monospace" }}>{user.last_blocked_ip.ip}</b> ({fmt(user.last_blocked_ip.at)}) because the
            limit was full. Remove an address below, or raise the limit above, then ask them to sign in again.
          </Alert>
        )}
        {(user.allowed_ips || []).length === 0 ? (
          <Typography sx={{ fontSize: "13px", color: "#6c718a", mb: 3 }}>
            None yet - the first IP is recorded when the user signs up or signs in.
          </Typography>
        ) : (
          <Table size="small" sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>IP address</TableCell>
                <TableCell sx={headerCellSx}>Added</TableCell>
                <TableCell sx={headerCellSx}>Last sign-in</TableCell>
                <TableCell sx={headerCellSx}>Browser</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {user.allowed_ips.map((ip) => (
                <TableRow key={ip._id} sx={{ "& td": { fontSize: "13px" } }}>
                  <TableCell sx={{ fontFamily: "monospace" as const }}>{ip.ip}</TableCell>
                  <TableCell>{fmt(ip.added_at)}</TableCell>
                  <TableCell>{fmt(ip.last_login_at)}</TableCell>
                  <TableCell sx={{ maxWidth: 220, overflow: "hidden" as const, textOverflow: "ellipsis" as const, whiteSpace: "nowrap" as const }}>
                    <Tooltip title={ip.user_agent || ""}>
                      <span>{ip.user_agent || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Remove this IP">
                      <IconButton size="small" onClick={() => onRemoveIp(ip)} aria-label={`Remove ${ip.ip}`}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box sx={{ display: "flex" as const, alignItems: "center" as const, justifyContent: "space-between" as const, mb: 1 }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>Pages and actions</Typography>
          <Box>
            <Button size="small" onClick={() => setEveryPage(["view"])} sx={{ textTransform: "none" as const }}>
              View all pages
            </Button>
            <Button size="small" onClick={() => setEveryPage(ACTIONS)} sx={{ textTransform: "none" as const }}>
              Full access
            </Button>
            <Button size="small" color="error" onClick={() => setPerms({})} sx={{ textTransform: "none" as const }}>
              Clear
            </Button>
          </Box>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Page</TableCell>
              <TableCell sx={headerCellSx} align="center">
                Page on
              </TableCell>
              {ACTIONS.map((a) => (
                <TableCell key={a} sx={headerCellSx} align="center">
                  {ACTION_LABELS[a]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map(([group, pages]) => (
              <React.Fragment key={group}>
                <TableRow>
                  <TableCell colSpan={ACTIONS.length + 2} sx={{ fontSize: "12px", fontWeight: 700, color: "#4C526C", pt: 1.5 }}>
                    {group}
                  </TableCell>
                </TableRow>
                {pages.map((page) => (
                  <TableRow key={page.key} hover>
                    <TableCell sx={{ fontSize: "13px", pl: 3 }}>
                      {page.label}
                      {page.group === "Features" && page.apiOnly && page.key !== "customerPortal" && page.key !== "teamUsers" && (
                        <Typography component="span" sx={{ display: "block" as const, fontSize: "11px", color: "#6c718a" }}>
                          Shown in other screens; off hides it everywhere
                        </Typography>
                      )}
                      {page.key === "teamUsers" && (
                        <Typography component="span" sx={{ display: "block" as const, fontSize: "11px", color: "#6c718a" }}>
                          Off: the admin can&apos;t invite or manage the team. Limits are on the Teams page.
                        </Typography>
                      )}
                      {page.key === "customerPortal" && (
                        <Typography component="span" sx={{ display: "block" as const, fontSize: "11px", color: "#6c718a" }}>
                          Off: their customers can&apos;t use the portal
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0 }}>
                      {/* Page on gives everything; off removes the page. */}
                      <Switch
                        size="small"
                        color="success"
                        checked={(perms[page.key] || []).length > 0}
                        onChange={() => setPage(page.key, (perms[page.key] || []).length ? [] : [...page.actions])}
                        inputProps={{ "aria-label": `${page.label} on` }}
                      />
                    </TableCell>
                    {ACTIONS.map((a) => (
                      <TableCell key={a} align="center" sx={{ py: 0 }}>
                        {page.actions.includes(a) ? (
                          <Switch
                            size="small"
                            checked={has(page.key, a)}
                            onChange={() => toggle(page, a)}
                            inputProps={{ "aria-label": `${page.label} ${a}` }}
                          />
                        ) : (
                          <Typography sx={{ color: "#c0c3d0", fontSize: "12px" }}>—</Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {status !== "active" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This user can&apos;t sign in while their account is {status}. Permissions are kept for
            when you activate them.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" as const }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving || !limitValid}
          onClick={async () => {
            setSaving(true);
            await onSave({
              status,
              ip_limit: limitNum,
              permissions: perms,
              limits: Object.fromEntries(LIMIT_FIELDS.map(([k]) => [k, limits[k] === "" ? null : Number(limits[k])])),
            });
            setSaving(false);
          }}
          sx={{ textTransform: "none" as const, fontWeight: 600 }}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// The last sign-in code the server recorded for this user (who and when, never the code).
const lastCodeLine = (u) => {
  const entries = (u.sign_in_code_log || []).filter((e) => e.action === "issued");
  const last = entries[entries.length - 1];
  return last ? `Last sign-in code: by ${last.by_email || "superadmin"} at ${fmt(last.at)}` : "";
};

// A one-time sign-in code for one user, for when their email isn't arriving.
// The code is shown here once; it is never kept after this dialog closes.
function SignInCodeDialog({ user, onClose, onIssued }: any) {
  const { showMessage } = useSnackbar();
  const [issued, setIssued] = useState<any>(null); // { code, expires_at }, in this dialog only
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const create = async () => {
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      const res = await apiService({ method: "POST", url: `api/v1/admin/users/${user._id}/sign-in-code`, data: {} });
      setIssued({ code: res.data.data.code, expires_at: res.data.data.expires_at });
      onIssued?.();
    } catch (e) {
      setIssued(null);
      setError(e?.message || "Couldn't create a sign-in code");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(issued.code);
      setCopied(true);
    } catch {
      showMessage("Couldn't copy. Select the code and copy it by hand.", "warning");
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: "16px" }}>Sign-in code for {user.email}</DialogTitle>
      <DialogContent>
        {!issued ? (
          <Typography sx={{ fontSize: "13px", color: "#6c718a", mt: 0.5 }}>
            Use this when their sign-in email isn&apos;t arriving. The code is asked for at their next sign-in
            instead of the emailed one, works once, and expires in 5 minutes. It&apos;s shown only once, here.
          </Typography>
        ) : (
          <Box sx={{ textAlign: "center" as const, py: 2 }}>
            <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>Share this code with {user.email}</Typography>
            <Typography
              data-testid="signin-code"
              sx={{ fontFamily: "monospace" as const, fontSize: "34px", fontWeight: 700, letterSpacing: "8px", my: 1 }}
            >
              {issued.code}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#4C526C" }}>
              Expires at {dayjs(issued.expires_at).format("HH:mm")} · works once · shown only once
            </Typography>
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={copy}
              sx={{ textTransform: "none" as const, mt: 1.5 }}
            >
              {copied ? "Copied" : "Copy code"}
            </Button>
            <Typography role="status" sx={{ fontSize: "12px", color: "#6c718a", mt: 1.5 }}>
              Closing this window hides the code for good. Creating another code replaces this one.
            </Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 1.5 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" as const }}>
          {issued ? "Done" : "Cancel"}
        </Button>
        <Button variant="contained" disabled={busy} onClick={create} sx={{ textTransform: "none" as const }}>
          {busy ? "Creating…" : issued ? "Create a new code" : "Create code"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TestEmailDialog({ open, onClose, onDone }: any) {
  const { showMessage } = useSnackbar();
  const [email, setEmail] = useState<any>("");
  const [sending, setSending] = useState<boolean>(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: "16px" }}>Send a test email</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "13px", color: "#6c718a", mt: 0.5 }}>
          If this arrives, sign-in codes, sign-up alerts and approval emails will too.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Email address"
          value={email}
          onChange={(e) => setEmail((e.target as any).value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" as const }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={sending || !valid}
          onClick={async () => {
            setSending(true);
            try {
              const res = await apiService({ method: "POST", url: "api/v1/admin/email/test", data: { email: email.trim() } });
              showMessage(res.data.message, res.data.channel === "console" ? "warning" : "success");
              onClose();
            } catch (error) {
              // The reason (and where mail was sent) comes from the server's message.
              showMessage(error?.message || "Test email failed", "error");
            } finally {
              setSending(false);
              onDone?.();
            }
          }}
          sx={{ textTransform: "none" as const }}
        >
          {sending ? "Sending…" : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
