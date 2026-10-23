"use client";

// Small controls shared by the report headers.
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IconButton, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import { usePermissions } from "../../services/PermissionProvider";
import { useSnackbar } from "../../components/SnackbarProvider";

const REPORTS = [
  ["Profit and Loss", "/reports/profitandloss"],
  ["Balance Sheet", "/reports/balancesheet"],
  ["Journal Report", "/reports/journalreport"],
];

// Switch between the reports the user may open.
export function ReportsMenuButton() {
  const router = useRouter();
  const perms = usePermissions();
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <Tooltip title="All reports">
        <IconButton aria-label="All reports" size="small" sx={{ color: "#333", padding: "2px" }} onClick={(e) => setAnchor(e.currentTarget)}>
          <MenuIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {REPORTS.filter(([, href]) => perms?.canAccessPath(href)).map(([label, href]) => (
          <MenuItem
            key={href}
            dense
            onClick={() => {
              setAnchor(null);
              router.push(href);
            }}
          >
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// Copies a link to this report (with its current filters) to the clipboard.
export function ShareReportButton() {
  const { showMessage } = useSnackbar() || {};
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showMessage?.("Link to this report copied", "success");
    } catch {
      showMessage?.("Couldn't copy the link", "error");
    }
  };
  return (
    <Tooltip title="Copy link">
      <IconButton aria-label="Copy link to report" size="small" onClick={share}>
        <ShareIcon sx={{ fontSize: "16px" }} />
      </IconButton>
    </Tooltip>
  );
}

export function CloseReportButton() {
  const router = useRouter();
  return (
    <Tooltip title="Close report">
      <IconButton
        aria-label="Close report"
        size="small"
        onClick={() => (window.history.length > 1 ? router.back() : router.push("/home"))}
        sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.04)" } }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
