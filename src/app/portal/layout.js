"use client";

// Customer portal shell: its own sidebar and sign-in, separate from the
// business app (see portalApi.js for the session keys).
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { portalGet, portalLoginPath } from "./portalApi";

const isPublic = (path) =>
  path === "/portal" || path.endsWith("/login") || path.startsWith("/portal/create-password") || path.startsWith("/portal/reset-password");

export default function PortalLayout({ children }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const signedIn = Boolean(portalGet("token"));
    if (pathname === "/portal") {
      router.replace(signedIn ? "/portal/home" : portalLoginPath());
      return;
    }
    if (!signedIn && !isPublic(pathname)) {
      router.replace(portalLoginPath());
      return;
    }
    // Browser-only check, done after the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  if (isPublic(pathname)) return children;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ width: collapsed ? 60 : 240, transition: "width 0.3s ease", background: "#f7f7fe", borderRight: "1px solid #e2e8f0" }}>
        <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed((c) => !c)} />
      </Box>
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>{children}</Box>
    </Box>
  );
}
