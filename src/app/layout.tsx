"use client";

import { useState, useEffect } from "react";
import { Box, CssBaseline, CircularProgress, Drawer } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import { SnackbarProvider } from "../components/SnackbarProvider";
import { styled } from "@mui/material/styles";
import AuthGuard from "../services/AuthGuard";
import { PermissionProvider } from "../services/PermissionProvider";
import RbacButtonGuard from "../services/RbacButtonGuard";
import { HelpHost } from "./common/helpAndSupport/HelpAndSupport";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "./theme"; // adjust path if needed

export default function RootLayout({ children }: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname()!;
  const showSidebar = !pathname.startsWith("/tally");
  useEffect(() => {
    // Set a timeout to remove the loading state after 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };
  // On a phone or small tablet the sidebar is a slide-out menu, opened from the
  // top bar and closed again when a page is chosen.
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenu(false);
  }, [pathname]);

  // Define paths where Sidebar, Navbar, and Footer should be hidden
  // The customer portal (/portal/...) has its own layout and sign-in.
  const isPortal = pathname.startsWith("/portal");
  const hideLayout =
    isPortal ||
    ["/organisation", "/organisation/organisationsetuppage", "/organisation/login", "/organization-list", "/team/accept-invite"].includes(pathname);
  
  return (
    <html lang="en">
  <body>
    {/* Collects emotion styles during SSR and injects them into <head>, so
        the server and client render the same tree (no hydration mismatch). */}
    <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
    <PermissionProvider>
      <RbacButtonGuard />
      {!hideLayout && <HelpHost />}
      <CssBaseline />
      {/* One fixed-height shell: the window itself never scrolls, only the
          content area below. (Before, the navbar plus a 90vh content box was
          taller than the window, so the page showed two scrollbars.) */}
      <Box sx={{ display: "flex" as const, flexDirection: "column" as const, height: "100vh", overflow: "hidden" as const }}>
        {!hideLayout && showSidebar && <Navbar onMenuClick={() => setMobileMenu(true)} />}

        <Box sx={{ display: "flex" as const, flexGrow: 1, minHeight: 0 }}>
          {!hideLayout && showSidebar && (
            <Drawer
              open={mobileMenu}
              onClose={() => setMobileMenu(false)}
              sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: 260, bgcolor: "primary.main" } }}
            >
              <Sidebar collapsed={false} toggleSidebar={() => setMobileMenu(false)} />
            </Drawer>
          )}
          {!hideLayout && showSidebar && (
            <Box
              sx={{
                display: { xs: "none", md: "block" },
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
              minWidth: 0,
              minHeight: 0,
              overflow: "auto" as const,
              background:"white"
            }}
          >
            <SnackbarProvider>
              {isPortal ? children : <AuthGuard>{children}</AuthGuard>}
            </SnackbarProvider>
          </Box>
        </Box>
      </Box>
    </PermissionProvider>
    </ThemeProvider>
    </AppRouterCacheProvider>
  </body>
</html>

  );
}
