"use client";

// Portal sign-in needs to know which business the customer belongs to.
// Invitation links go straight to /portal/<organisation id>/login; this page
// sends returning customers there, or asks for the organisation ID.
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { portalGet } from "../portalApi";

export default function PortalLoginPicker() {
  const router = useRouter();
  const [orgId, setOrgId] = useState("");

  useEffect(() => {
    const known = portalGet("orgId");
    if (known) router.replace(`/portal/${known}/login`);
  }, [router]);

  const go = (e) => {
    e.preventDefault();
    const id = orgId.trim();
    if (id) router.push(`/portal/${encodeURIComponent(id)}/login`);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f7f7fe", p: 2 }}>
      <Paper component="form" onSubmit={go} sx={{ p: 4, width: 380, maxWidth: "100%" }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Customer portal
        </Typography>
        <Typography color="text.secondary" fontSize={14} mb={3}>
          Use the sign-in link from your invitation email, or enter the organisation ID it shows.
        </Typography>
        <TextField label="Organisation ID" size="small" fullWidth value={orgId} onChange={(e) => setOrgId(e.target.value)} />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={!orgId.trim()}>
          Continue
        </Button>
      </Paper>
    </Box>
  );
}
