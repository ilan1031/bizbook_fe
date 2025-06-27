"use client";

import { useState, useEffect } from "react";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import { SnackbarProvider } from "../components/SnackbarProvider";
import { styled } from "@mui/material/styles";
import AuthGuard from "../services/AuthGuard";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // adjust path if needed

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/tally");
  useEffect(() => {
    // Set a timeout to remove the loading state after 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  // Define paths where Sidebar, Navbar, and Footer should be hidden
  const hideLayout = [
    "/organisation",
    "/organisation/organisationsetuppage",
    "/organisation/login",
    "/organization-list",
  ].includes(pathname);
  
  return (
    <html lang="en">
  <body>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {!hideLayout && showSidebar && <Navbar />}

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {!hideLayout && showSidebar && (
            <Box
              sx={{
                width: collapsed ? 60 : 240,
                transition: "width 0.3s ease",
                bgcolor: "primary.main", // or use a custom value
                borderRight: "1px solid #e2e8f0",
              }}
            >
              <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            </Box>
          )}

          <Box
            sx={{
              flexGrow: 1,
              transition: "margin-left 0.3s ease",
              overflow: "auto",
              maxHeight: pathname.startsWith("/tally") ? "none" : hideLayout ? "none" : "90vh",
              background:"white"
            }}
          >
            <SnackbarProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </SnackbarProvider>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  </body>
</html>

  );
}
