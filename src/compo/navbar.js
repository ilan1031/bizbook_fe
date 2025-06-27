"use client";

import React, { useState, useRef, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const NavButton = styled(Box)(({ theme }) => ({
  color: "white",
  fontSize: "0.9rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  position: "relative",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const MenuDropdown = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  right: 0,
  zIndex: 1000,
  width: "200px",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  overflow: "hidden",
}));

const MenuItem = styled(Box)(({ theme, selected }) => ({
  padding: "8px 16px",
  fontSize: "0.9rem",
  cursor: "pointer",
  backgroundColor: selected ? "#FFD700" : "transparent",
  "&:hover": {
    backgroundColor: selected ? "#FFD700" : "#F5F5F5",
  },
}));

const MenuHeader = styled(Box)(({ theme }) => ({
  padding: "8px 16px",
  fontSize: "0.8rem",
  backgroundColor: "#F0F0F0",
  color: "#666",
  fontWeight: "bold",
}));

const SubMenu = styled(Box)(({ theme }) => ({
  padding: "8px 16px 8px 24px",
  fontSize: "0.9rem",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#F5F5F5",
  },
}));

const Navbar = ({ onMenuItemClick }) => {
  const router = useRouter();
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const [goToDialogOpen, setGoToDialogOpen] = useState(false);
  const printMenuRef = useRef(null);

  const navItems = [
    { key: "K", label: "Company" },
    { key: "Y", label: "Data" },
    { key: "Z", label: "Exchange" },
    { key: "G", label: "Go To" },
    { key: "O", label: "Import" },
    { key: "E", label: "Export" },
    { key: "M", label: "Share" },
    { key: "P", label: "Print" },
    { key: "F1", label: "Help" },
  ];

  const handleNavClick = (label) => {
    if (label.toLowerCase() === "go to") {
      setGoToDialogOpen(true);
    } else if (label.toLowerCase() === "print") {
      setPrintMenuOpen(true);
    } else if (onMenuItemClick) {
      onMenuItemClick(label.toLowerCase());
    }
  };

  const handlePrintOptionClick = (option) => {
    setPrintMenuOpen(false);
    if (option === "current") {
      router.push("/print");
    }
  };

  const handleGoToOptionClick = (option) => {
    setGoToDialogOpen(false);
    if (option === "Order Vouchers") {
      router.push("/goto");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (printMenuRef.current && !printMenuRef.current.contains(event.target)) {
        setPrintMenuOpen(false);
      }
    };

    if (printMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [printMenuOpen]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976D2", height: 60 }}>
      <Toolbar sx={{ height: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", mr: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              lineHeight: 1.1,
            }}
          >
            TallyPrime
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: "bold",
              letterSpacing: "0.1em",
            }}
          >
            EDU
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8rem",
            color: "#A9CCED",
            fontWeight: "bold",
            mr: 2,
          }}
        >
          MANAGE
        </Typography>

        <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
          {navItems.map((item) => (
            <NavButton
              key={item.key}
              onClick={() => handleNavClick(item.label)}
              ref={item.label === "Print" ? printMenuRef : null}
            >
              <Typography component="span" sx={{ textDecoration: "underline", mr: 0.5 }}>
                {item.key}
              </Typography>
              : {item.label}

              {item.label === "Print" && printMenuOpen && (
                <MenuDropdown>
                  <MenuHeader>REPORTS</MenuHeader>
                  <MenuItem
                    onClick={() => handlePrintOptionClick("current")}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Current</span>
                    <span>Ctrl+P</span>
                  </MenuItem>
                  <MenuItem selected={true} onClick={() => handlePrintOptionClick("others")}>
                    Others
                  </MenuItem>
                  <SubMenu onClick={() => handlePrintOptionClick("configuration")}>
                    Configuration
                  </SubMenu>
                </MenuDropdown>
              )}
            </NavButton>
          ))}
        </Box>

        {/* Go To Dialog */}
        <Dialog open={goToDialogOpen} onClose={() => setGoToDialogOpen(false)}>
          <DialogTitle sx={{ bgcolor: "#3B71C6", color: "white", fontWeight: "bold" }}>
            Go To
          </DialogTitle>
          <DialogContent>
            <Box>
              <MenuItem onClick={() => handleGoToOptionClick("Order Vouchers")}>
                Order Vouchers
              </MenuItem>
              {/* Add more options as needed */}
            </Box>
          </DialogContent>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;