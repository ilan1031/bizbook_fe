"use client";

// Opened from the reset email: /portal/reset-password?token=...
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import apiService, { portalLoginPath } from "../portalApi";

export default function PortalResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMsg({ type: "error", text: "The passwords don't match." });
    setBusy(true);
    setMsg(null);
    try {
      const r = await apiService({ method: "POST", url: "/api/v1/client/reset-password", data: { token, password } });
      setDone(true);
      setMsg({ type: "success", text: r.data?.message || "Password updated." });
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Couldn't reset the password." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f7f7fe", p: 2 }}>
      <Paper component="form" onSubmit={submit} sx={{ p: 4, width: 400, maxWidth: "100%" }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Choose a new password
        </Typography>
        <Stack spacing={2}>
          {msg && <Alert severity={msg.type}>{msg.text}</Alert>}
          {!token && <Alert severity="error">This link is missing its token. Open the link from the email again.</Alert>}
          {!done && (
            <>
              <TextField
                type="password"
                size="small"
                label="New password"
                autoComplete="new-password"
                helperText="At least 8 characters, with an uppercase letter, a number and a special character."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                type="password"
                size="small"
                label="Confirm new password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <Button type="submit" variant="contained" disabled={busy || !token || !password}>
                {busy ? "Saving..." : "Save password"}
              </Button>
            </>
          )}
          <Button onClick={() => router.push(portalLoginPath())}>Back to sign in</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
