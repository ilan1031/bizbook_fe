"use client";

import React, { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import apiService from "../portalApi";

const EMPTY = { current_password: "", new_password: "", confirm: "" };

export default function ChangePasswordDialog({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const close = () => {
    setForm(EMPTY);
    setMsg(null);
    onClose();
  };

  const save = async () => {
    if (form.new_password !== form.confirm) {
      setMsg({ type: "error", text: "The new passwords don't match." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await apiService({
        method: "POST",
        url: "/api/v1/client/change-password",
        data: { current_password: form.current_password, new_password: form.new_password },
      });
      setForm(EMPTY);
      setMsg({ type: "success", text: "Password changed." });
    } catch (e) {
      setMsg({ type: "error", text: e?.message || "Couldn't change the password." });
    } finally {
      setBusy(false);
    }
  };

  const field = (key, label, autoComplete) => (
    <TextField
      type="password"
      size="small"
      label={label}
      autoComplete={autoComplete}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
    />
  );

  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
      <DialogTitle>Change password</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {msg && <Alert severity={msg.type}>{msg.text}</Alert>}
          {field("current_password", "Current password", "current-password")}
          {field("new_password", "New password", "new-password")}
          {field("confirm", "Confirm new password", "new-password")}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Close</Button>
        <Button variant="contained" onClick={save} disabled={busy || !form.current_password || !form.new_password}>
          {busy ? "Saving..." : "Change password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
