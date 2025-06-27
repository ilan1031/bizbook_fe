"use client";

import React from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import { Box, Typography, Paper, Grid } from "@mui/material";

const KeyboardShortcut = ({ keyChar, action, onClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        borderRight: "1px solid #E0E0E0",
        cursor: onClick ? "pointer" : "default", // ✅ Make clickable if onClick exists
      }}
      onClick={onClick} // ✅ Handle click event
    >
      <Box sx={{ display: "flex", alignItems: "center", px: 1.5, py: 0.5 }}>
        <Typography
          variant="body2"
          component="span"
          sx={{
            fontWeight: "bold",
            color: "#1976D2",
            mr: 0.5,
          }}
        >
          {keyChar}:
        </Typography>
        <Typography variant="body2" component="span">
          {action}
        </Typography>
      </Box>
    </Box>
  );
};

const KeyboardShortcutsFooter = () => {
  const router = useRouter(); // ✅ Initialize router

  const shortcuts = [
    { keyChar: "Q", action: "Quit" },
    { keyChar: "", action: "" },
    { keyChar: "", action: "" },
    { keyChar: "A", action: "Accept", onClick: () => router.push("/tally/confirm") }, // ✅ Navigate to Confirm page
    { keyChar: "", action: "" },
    { keyChar: "", action: "" },
    { keyChar: "D", action: "Delete" },
    { keyChar: "X", action: "Cancel Vch" },
    { keyChar: "", action: "" },
  ];

  return (
    <Paper
      elevation={1}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderRadius: 0,
      }}
    >
      <Grid container sx={{ height: "28px" }}>
        {shortcuts.map((shortcut, index) => (
          <Grid
            item
            xs
            key={index}
            sx={{
              height: "100%",
              borderLeft: index === 0 ? "none" : "1px solid #E0E0E0",
            }}
          >
            <KeyboardShortcut
              keyChar={shortcut.keyChar}
              action={shortcut.action}
              onClick={shortcut.onClick} // ✅ Pass onClick handler
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default KeyboardShortcutsFooter;
