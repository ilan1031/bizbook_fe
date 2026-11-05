"use client";

// Superadmin: every organisation's team (linked from Users & Access).
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AdminTeams from "../../../components/team/AdminTeams";

export default function AdminTeamsPage(_props?: any) {
  return (
    <Box sx={{ bgcolor: "#f6f6fa", minHeight: "100%" }}>
      <Box sx={{ position: "sticky" as const, top: 0, zIndex: 5, bgcolor: "white", borderBottom: "1px solid #e0e0e0", px: 3, py: 1.5, display: "flex" as const, alignItems: "center" as const, justifyContent: "space-between" as const, gap: 1 }}>
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>Superadmin</Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Teams</Typography>
        </Box>
        <Button size="small" variant="outlined" href="/admin/users" sx={{ textTransform: "none" as const }}>
          Back to Users &amp; Access
        </Button>
      </Box>
      <Box sx={{ p: 3 }}>
        <AdminTeams />
      </Box>
    </Box>
  );
}
