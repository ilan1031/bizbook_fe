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
  cursor: "pointer" as const,
  display: "flex" as const,
  alignItems: "center" as const,
  padding: "0 8px",
  position: "relative" as const,
  "&:hover": {
    textDecoration: "underline" as const,
  },
}));

const MenuDropdown = styled(Paper)(({ theme }) => ({
  position: "absolute" as const,
  top: "100%",
  right: 0,
  zIndex: 1000,
  width: "200px",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  overflow: "hidden" as const,
}));

const MenuItem = styled(Box)<{ selected?: any }>(({ theme, selected }) => ({
  padding: "8px 16px",
  fontSize: "0.9rem",
  cursor: "pointer" as const,
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
  fontWeight: "bold" as const,
}));

const SubMenu = styled(Box)(({ theme }) => ({
  padding: "8px 16px 8px 24px",
  fontSize: "0.9rem",
  cursor: "pointer" as const,
  "&:hover": {
    backgroundColor: "#F5F5F5",
  },
}));

const Navbar = ({ onMenuItemClick }: any) => {
  const router = useRouter();
  const [printMenuOpen, setPrintMenuOpen] = useState<boolean>(false);
  const [goToDialogOpen, setGoToDialogOpen] = useState<boolean>(false);
  const printMenuRef = useRef<any>(null);

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
      window.print();
    }
  };

  const handleGoToOptionClick = (option) => {
    setGoToDialogOpen(false);
    if (option === "Order Vouchers") {
      router.push("/tally/voucher");
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
        <Box sx={{ display: "flex" as const, flexDirection: "column" as const, mr: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold" as const,
              lineHeight: 1.1,
            }}
          >
            TallyPrime
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: "bold" as const,
              letterSpacing: "0.1em" as const,
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
            fontWeight: "bold" as const,
            mr: 2,
          }}
        >
          MANAGE
        </Typography>

        <Box sx={{ display: "flex" as const, flexGrow: 1, justifyContent: "space-between" as const }}>
          {navItems.map((item) => (
            <NavButton
              key={item.key}
              onClick={() => handleNavClick(item.label)}
              ref={item.label === "Print" ? printMenuRef : null}
            >
              <Typography component="span" sx={{ textDecoration: "underline" as const, mr: 0.5 }}>
                {item.key}
              </Typography>
              : {item.label}

              {item.label === "Print" && printMenuOpen && (
                <MenuDropdown>
                  <MenuHeader>REPORTS</MenuHeader>
                  <MenuItem
                    onClick={() => handlePrintOptionClick("current")}
                    sx={{ display: "flex" as const, justifyContent: "space-between" as const }}
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
          <DialogTitle sx={{ bgcolor: "#3B71C6", color: "white", fontWeight: "bold" as const }}>
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