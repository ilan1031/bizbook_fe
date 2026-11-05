"use client";

// Invite someone to the team: name, email and a role. The server creates the
// account (or links an existing one) and emails the invite link.
import React, { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { errorText, teamApi, type TeamRole } from "../../services/teamApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  orgId: string;
  roles: TeamRole[];
  onInvited: (message: string) => void;
}

export default function InviteDialog({ open, onClose, orgId, roles, onInvited }: InviteDialogProps) {
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [roleId, setRoleId] = useState<string>("sales");
  const [error, setError] = useState<any>("");
  const [saving, setSaving] = useState<boolean>(false);

  const reset = () => {
    setName("");
    setEmail("");
    setRoleId("sales");
    setError("");
  };

  const submit = async () => {
    setError("");
    if (!name.trim()) return setError("Enter the person's name.");
    if (!EMAIL_RE.test(email.trim())) return setError("Enter a valid email address.");
    if (!roleId) return setError("Choose a role.");
    setSaving(true);
    try {
      const res = await teamApi.invite(orgId, { name: name.trim(), email: email.trim(), role_id: roleId });
      onInvited(res.message || "Invitation sent");
      reset();
      onClose();
    } catch (e) {
      setError(errorText(e, "Couldn't send the invitation."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : () => { reset(); onClose(); }}
      fullWidth
      maxWidth="sm"
      TransitionProps={{ onExited: reset }}
    >
      <DialogTitle>Invite a team member</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Name" size="small" value={name} onChange={(e) => setName((e.target as any).value)} inputProps={{ maxLength: 80 }} required fullWidth />
          <TextField
            label="Email"
            size="small"
            type="email"
            value={email}
            onChange={(e) => setEmail((e.target as any).value)}
            inputProps={{ maxLength: 254 }}
            required
            fullWidth
            helperText="They get a link by email to join. The link works once, for 24 hours."
          />
          <TextField label="Role" size="small" select value={roleId} onChange={(e) => setRoleId((e.target as any).value)} fullWidth>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
                {r.preset ? "" : " (custom)"}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { reset(); onClose(); }} disabled={saving} sx={{ textTransform: "none" as const }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={saving} sx={{ textTransform: "none" as const }}>
          {saving ? "Sending..." : "Send invitation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
