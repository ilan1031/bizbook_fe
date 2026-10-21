"use client";

// Superadmin screen: approve sign-ups, activate/deactivate users, set which
// pages and actions each user gets, and manage the IP addresses (devices)
// each user may sign in from.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
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
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import dayjs from "dayjs";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";

const ACTIONS = ["view", "create", "edit", "delete"];
const STATUS_COLORS = { pending: "warning", active: "success", inactive: "default" };
const headerCellSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#6c718a",
  textTransform: "uppercase",
  bgcolor: "#f6f6fa",
};
const fmt = (d) => (d ? dayjs(d).format("DD-MM-YYYY HH:mm") : "—");

export default function UsersAccessPage() {
  const { showMessage } = useSnackbar();
  const [tab, setTab] = useState("pending");
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({});
  const [catalog, setCatalog] = useState([]);
  const [sms, setSms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [smsDialog, setSmsDialog] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService({
        method: "GET",
        url: "api/v1/admin/users",
        params: tab === "all" ? {} : { status: tab },
      });
      setUsers(res.data.data || []);
      setCounts(res.data.counts || {});
      setCatalog(res.data.catalog || []);
      setSms(res.data.sms || null);
    } catch (error) {
      showMessage(error?.message || "Couldn't load users", "error");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
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
      if (res.data.sms && !res.data.sms.ok) text += ` (SMS not sent: ${res.data.sms.error})`;
      showMessage(text, res.data.sms && !res.data.sms.ok ? "warning" : "success");
      await load();
      return res.data.data;
    } catch (error) {
      showMessage(error?.message || "Couldn't save", "error");
      return null;
    }
  };

  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  return (
    <Box sx={{ bgcolor: "#f6f6fa", minHeight: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>
            Superadmin
          </Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Users &amp; Access</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {sms && (
            <Chip
              size="small"
              icon={<SmsOutlinedIcon />}
              color={sms.provider === "console" ? "default" : sms.configured ? "success" : "warning"}
              label={
                sms.provider === "console"
                  ? "SMS: log only (no provider set)"
                  : `SMS: ${sms.provider}${sms.configured ? "" : " (not configured)"}`
              }
            />
          )}
          <Button size="small" variant="outlined" onClick={() => setSmsDialog(true)} sx={{ textTransform: "none" }}>
            Send test SMS
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab value="pending" label={`Pending approval (${counts.pending || 0})`} sx={{ textTransform: "none" }} />
          <Tab value="active" label={`Active (${counts.active || 0})`} sx={{ textTransform: "none" }} />
          <Tab value="inactive" label={`Inactive (${counts.inactive || 0})`} sx={{ textTransform: "none" }} />
          <Tab value="all" label={`All (${total})`} sx={{ textTransform: "none" }} />
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
                <TableCell sx={headerCellSx}>Last sign-in</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: "#6c718a" }}>
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
                        <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>
                          {u.company_name || "—"} · joined {dayjs(u.createdAt).format("DD-MM-YYYY")}
                        </Typography>
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
                      <TableCell>{fmt(u.last_login_at)}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {!isSuper && (
                          <>
                            {u.status !== "active" ? (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  update(u, { status: "active" }, u.status === "pending" ? "User approved" : "User activated")
                                }
                                sx={{ textTransform: "none", mr: 1 }}
                              >
                                {u.status === "pending" ? "Approve" : "Activate"}
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => update(u, { status: "inactive" }, "User deactivated")}
                                sx={{ textTransform: "none", mr: 1 }}
                              >
                                Deactivate
                              </Button>
                            )}
                            <Button size="small" variant="outlined" onClick={() => setEditing(u)} sx={{ textTransform: "none" }}>
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

      <TestSmsDialog open={smsDialog} onClose={() => setSmsDialog(false)} />
    </Box>
  );
}

function ManageUserDialog({ user, catalog, onClose, onSave, onRemoveIp }) {
  const [status, setStatus] = useState(user.status || "pending");
  const [ipLimit, setIpLimit] = useState(String(user.ip_limit ?? 2));
  const [perms, setPerms] = useState(() => ({ ...(user.permissions || {}) }));
  const [saving, setSaving] = useState(false);

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
  const allOn = (page) => page.actions.every((a) => has(page.key, a));
  const setEveryPage = (actions) =>
    setPerms(() => {
      const next = {};
      catalog.forEach((p) => {
        const a = p.actions.filter((x) => actions.includes(x));
        if (a.length) next[p.key] = a;
      });
      return next;
    });

  const limitNum = Number(ipLimit);
  const limitValid = Number.isInteger(limitNum) && limitNum >= 0 && limitNum <= 50;

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Account status</InputLabel>
            <Select label="Account status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="pending">Pending (can&apos;t sign in)</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive (can&apos;t sign in)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Device (IP) limit"
            value={ipLimit}
            onChange={(e) => setIpLimit(e.target.value.replace(/[^\d]/g, ""))}
            error={!limitValid}
            helperText={limitValid ? "How many IP addresses this user may sign in from" : "0 to 50"}
            sx={{ width: 220 }}
          />
        </Box>

        <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}>
          Approved IP addresses ({(user.allowed_ips || []).length} / {user.ip_limit ?? 2})
        </Typography>
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
                  <TableCell sx={{ fontFamily: "monospace" }}>{ip.ip}</TableCell>
                  <TableCell>{fmt(ip.added_at)}</TableCell>
                  <TableCell>{fmt(ip.last_login_at)}</TableCell>
                  <TableCell sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>Pages and actions</Typography>
          <Box>
            <Button size="small" onClick={() => setEveryPage(["view"])} sx={{ textTransform: "none" }}>
              View all pages
            </Button>
            <Button size="small" onClick={() => setEveryPage(ACTIONS)} sx={{ textTransform: "none" }}>
              Full access
            </Button>
            <Button size="small" color="error" onClick={() => setPerms({})} sx={{ textTransform: "none" }}>
              Clear
            </Button>
          </Box>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Page</TableCell>
              {ACTIONS.map((a) => (
                <TableCell key={a} sx={headerCellSx} align="center">
                  {a}
                </TableCell>
              ))}
              <TableCell sx={headerCellSx} align="center">
                All
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map(([group, pages]) => (
              <React.Fragment key={group}>
                <TableRow>
                  <TableCell colSpan={6} sx={{ fontSize: "12px", fontWeight: 700, color: "#4C526C", pt: 1.5 }}>
                    {group}
                  </TableCell>
                </TableRow>
                {pages.map((page) => (
                  <TableRow key={page.key} hover>
                    <TableCell sx={{ fontSize: "13px", pl: 3 }}>{page.label}</TableCell>
                    {ACTIONS.map((a) => (
                      <TableCell key={a} align="center" sx={{ py: 0 }}>
                        {page.actions.includes(a) ? (
                          <Checkbox
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
                    <TableCell align="center" sx={{ py: 0 }}>
                      <Checkbox
                        size="small"
                        checked={allOn(page)}
                        indeterminate={!allOn(page) && (perms[page.key] || []).length > 0}
                        onChange={() => setPage(page.key, allOn(page) ? [] : [...page.actions])}
                        inputProps={{ "aria-label": `${page.label} all` }}
                      />
                    </TableCell>
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
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving || !limitValid}
          onClick={async () => {
            setSaving(true);
            await onSave({ status, ip_limit: limitNum, permissions: perms });
            setSaving(false);
          }}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TestSmsDialog({ open, onClose }) {
  const { showMessage } = useSnackbar();
  const [mobile, setMobile] = useState("");
  const [sending, setSending] = useState(false);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: "16px" }}>Send a test SMS</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={sending || mobile.replace(/\D/g, "").length < 10}
          onClick={async () => {
            setSending(true);
            try {
              const res = await apiService({ method: "POST", url: "api/v1/admin/sms/test", data: { mobile } });
              showMessage(res.data.message, "success");
              onClose();
            } catch (error) {
              showMessage(error?.message || "Test SMS failed", "error");
            } finally {
              setSending(false);
            }
          }}
          sx={{ textTransform: "none" }}
        >
          {sending ? "Sending…" : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
