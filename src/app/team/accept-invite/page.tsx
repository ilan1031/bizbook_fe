"use client";

// The link in a team invite email. Opens without signing in: shows who invited
// the person and the role, asks for a password if the account is new, and
// joins the team. The link works once.
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { errorText, inviteApi, type InviteInfo } from "../../../services/teamApi";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?=.{8,})/;

export default function AcceptInvitePage(_props?: any) {
  const [token, setToken] = useState<string | null>(null);
  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [confirm, setConfirm] = useState<any>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [done, setDone] = useState<any>("");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") || "";
    setToken(t);
    if (!t) {
      setError("This invitation link is missing its code. Open the link from the email again.");
      setLoading(false);
      return;
    }
    inviteApi
      .info(t)
      .then((res) => setInfo(res.data || null))
      .catch((e) => setError(errorText(e, "Couldn't open this invitation.")))
      .finally(() => setLoading(false));
  }, []);

  const accept = async () => {
    setError("");
    if (!token) return;
    if (info?.needs_password) {
      if (!PASSWORD_RULE.test(password)) {
        return setError("Password must be at least 8 characters with an uppercase letter, a lowercase letter, a number and a special character.");
      }
      if (password !== confirm) return setError("The two passwords don't match.");
    }
    setSaving(true);
    try {
      const res = await inviteApi.accept(token, info?.needs_password ? password : undefined);
      setDone(res.message || "You've joined the team.");
    } catch (e) {
      setError(errorText(e, "Couldn't accept the invitation."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f6fa", display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const, p: 2 }}>
      <Paper variant="outlined" sx={{ width: "100%", maxWidth: 460, p: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1b7a2f", mb: 2 }}>BizBooks</Typography>
        {loading && (
          <Box sx={{ py: 4, textAlign: "center" as const }}>
            <CircularProgress size={26} />
          </Box>
        )}

        {!loading && done && (
          <Stack spacing={2}>
            <Alert severity="success">{done}</Alert>
            <Button variant="contained" component={Link} href="/organisation/login" sx={{ textTransform: "none" as const }}>
              Go to sign in
            </Button>
          </Stack>
        )}

        {!loading && !done && error && !info && (
          <Stack spacing={2}>
            <Alert severity="error">{error}</Alert>
            <Typography variant="body2" color="text.secondary">
              Ask the person who invited you to send a new invitation.
            </Typography>
          </Stack>
        )}

        {!loading && !done && info && (
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>Join {info.organization_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {info.name ? `Hi ${info.name}. ` : ""}You've been invited to the team as <b>{info.role_name}</b>. You'll sign in as {info.email}.
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {info.needs_password && (
              <>
                <TextField label="Choose a password" type="password" size="small" value={password} onChange={(e) => setPassword((e.target as any).value)} autoComplete="new-password" fullWidth />
                <TextField label="Type it again" type="password" size="small" value={confirm} onChange={(e) => setConfirm((e.target as any).value)} autoComplete="new-password" fullWidth />
                <Typography variant="caption" color="text.secondary">
                  At least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character.
                </Typography>
              </>
            )}
            <Button variant="contained" onClick={accept} disabled={saving} sx={{ textTransform: "none" as const }}>
              {saving ? "Joining..." : info.needs_password ? "Set password and join" : "Join the team"}
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
