"use client";

// Create or edit a custom role: its pages and actions from the same grid the
// superadmin uses. Only what the organisation admin has can be ticked; the
// server checks the same rule.
import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { errorText, teamApi, type GridPage, type PagePermissions, type TeamAction, type TeamRole } from "../../services/teamApi";

const ACTIONS: TeamAction[] = ["view", "create", "edit", "delete", "convert"];
const ACTION_LABELS: Record<TeamAction, string> = { view: "View", create: "Create", edit: "Edit", delete: "Delete", convert: "Convert" };

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  orgId: string;
  grid: GridPage[];
  ceiling: PagePermissions;
  role: TeamRole | null;
  onSaved: (message: string) => void;
}

// Ticking a write action also gives View; removing View removes the page.
const withAction = (perms: PagePermissions, page: string, action: TeamAction, on: boolean): PagePermissions => {
  const current = new Set(perms[page] || []);
  if (on) {
    current.add(action);
    current.add("view");
  } else if (action === "view") {
    current.clear();
  } else {
    current.delete(action);
  }
  const next = { ...perms };
  const list = ACTIONS.filter((a) => current.has(a));
  if (list.length) next[page] = list;
  else delete next[page];
  return next;
};

export default function RoleDialog({ open, onClose, orgId, grid, ceiling, role, onSaved }: RoleDialogProps) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [perms, setPerms] = useState<PagePermissions>(role?.permissions || {});
  const [error, setError] = useState<any>("");
  const [saving, setSaving] = useState<boolean>(false);

  // A fresh form each time the dialog opens for a different role.
  const openKey = `${open}-${role?.id || "new"}`;
  const [lastKey, setLastKey] = useState(openKey);
  if (openKey !== lastKey) {
    setLastKey(openKey);
    setName(role?.name || "");
    setDescription(role?.description || "");
    setPerms(role?.permissions || {});
    setError("");
  }

  const groups = useMemo(() => {
    const out: Record<string, GridPage[]> = {};
    for (const page of grid) (out[page.group] = out[page.group] || []).push(page);
    return Object.entries(out);
  }, [grid]);

  const save = async () => {
    setError("");
    if (!name.trim()) return setError("Enter a name for the role.");
    if (!Object.keys(perms).length) return setError("Tick at least one page this role can use.");
    setSaving(true);
    try {
      if (role) await teamApi.updateRole(orgId, role.id, { name: name.trim(), description: description.trim(), permissions: perms });
      else await teamApi.createRole(orgId, { name: name.trim(), description: description.trim(), permissions: perms });
      onSaved(role ? "Role updated" : "Role created");
      onClose();
    } catch (e) {
      setError(errorText(e, "Couldn't save the role."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>{role ? `Edit role: ${role.name}` : "New role"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Role name"
            size="small"
            value={name}
            onChange={(e) => setName((e.target as any).value)}
            inputProps={{ maxLength: 60 }}
            required
            fullWidth
          />
          <TextField
            label="What is it for? (optional)"
            size="small"
            value={description}
            onChange={(e) => setDescription((e.target as any).value)}
            inputProps={{ maxLength: 200 }}
            fullWidth
          />
          <Typography variant="body2" color="text.secondary">
            Pages and actions this role can use. You can only give what your own account has.
          </Typography>
          <Box sx={{ maxHeight: 420, overflow: "auto" as const, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Page or feature</TableCell>
                  {ACTIONS.map((a) => (
                    <TableCell key={a} align="center" sx={{ fontWeight: 600 }}>
                      {ACTION_LABELS[a]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map(([group, pages]) => (
                  <React.Fragment key={group}>
                    <TableRow>
                      <TableCell colSpan={ACTIONS.length + 1} sx={{ bgcolor: "#f6f6fa", fontSize: 12, fontWeight: 700, color: "#4C526C" }}>
                        {group}
                      </TableCell>
                    </TableRow>
                    {pages.map((page) => {
                      const allowedHere = (ceiling[page.key] || []).length > 0;
                      return (
                        <TableRow key={page.key} hover>
                          <TableCell sx={{ color: allowedHere ? "inherit" : "#9a9db0" }}>
                            {page.label}
                            {!allowedHere && (
                              <Typography component="span" variant="caption" sx={{ display: "block" as const, color: "#9a9db0" }}>
                                Not on your account
                              </Typography>
                            )}
                          </TableCell>
                          {ACTIONS.map((a) => {
                            const offered = page.actions.includes(a);
                            const yours = (ceiling[page.key] || []).includes(a);
                            const checked = (perms[page.key] || []).includes(a);
                            if (!offered) return <TableCell key={a} align="center">—</TableCell>;
                            const box = (
                              <Checkbox
                                size="small"
                                checked={checked}
                                disabled={!yours || saving}
                                onChange={(e) => setPerms((p) => withAction(p, page.key, a, e.target.checked))}
                                inputProps={{ "aria-label": `${ACTION_LABELS[a]} ${page.label}` }}
                              />
                            );
                            return (
                              <TableCell key={a} align="center" sx={{ py: 0 }}>
                                {yours ? box : <Tooltip title="Your account doesn't have this">{<span>{box}</span>}</Tooltip>}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving} sx={{ textTransform: "none" as const }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={saving} sx={{ textTransform: "none" as const }}>
          {saving ? "Saving..." : role ? "Save role" : "Create role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
