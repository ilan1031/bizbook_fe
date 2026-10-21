"use client";

import React from "react";
import { Box } from "@mui/material";
import { STATUS_STYLES } from "./creditConfig";

export default function StatusChip({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.open;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1,
        py: 0.25,
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        color: s.color,
        bgcolor: s.bg,
      }}
    >
      {s.label}
    </Box>
  );
}
