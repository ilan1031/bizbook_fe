"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import { usePermissions } from "./PermissionProvider";
import { endSession } from "./axiosService";

const PUBLIC_ROUTES = ["/organisation", "/organisation/login"];

function Notice({ icon: Icon, title, text, action }) {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        gap: 1.5,
      }}
    >
      <Icon sx={{ fontSize: 48, color: "#9a9db0" }} />
      <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>{title}</Typography>
      <Typography sx={{ fontSize: "14px", color: "#6c718a", maxWidth: 460 }}>{text}</Typography>
      {action}
    </Box>
  );
}

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const perms = usePermissions();
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const hasToken = Boolean(currentToken);
  // Permissions belong to a token; after login/logout they're stale until
  // reloaded for the new one.
  const stale = hasToken && perms.token !== currentToken;

  useEffect(() => {
    if (!hasToken) {
      if (!isPublic) router.replace("/organisation/login");
      return;
    }
    if (stale) {
      if (!perms.loading) perms.reload();
      return;
    }
    if (perms.loading) return;
    if (!perms.me) {
      // This token was rejected (expired, account deactivated, IP removed, ...).
      endSession(perms.error?.code);
      return;
    }
    // Signed in: leave the login/sign-up pages.
    if (isPublic || pathname === "/") {
      router.replace(perms.firstAllowedRoute() || "/home");
      return;
    }
    // Landing on the dashboard without access to it: go to the first page
    // this user has instead.
    if (pathname === "/home" && !perms.canAccessPath("/home")) {
      const first = perms.firstAllowedRoute();
      if (first && first !== "/home") router.replace(first);
    }
  }, [pathname, currentToken, stale, perms.loading, perms.me]);

  if (!hasToken) return isPublic ? children : <Box />;
  // On the login page, keep showing it until the redirect happens.
  if (isPublic) return stale || perms.loading || !perms.me ? children : <Box />;
  if (stale || perms.loading || !perms.me) return <Box />;

  if (!perms.isSuperadmin && !perms.hasAnyPage && !pathname.startsWith("/organisation")) {
    return (
      <Notice
        icon={HourglassEmptyOutlinedIcon}
        title="No pages assigned yet"
        text="Your account is active, but an administrator hasn't given you access to any pages. Once they do, they'll appear in the menu on the left."
        action={
          <Button variant="outlined" onClick={() => endSession()} sx={{ textTransform: "none" }}>
            Sign out
          </Button>
        }
      />
    );
  }

  if (!perms.canAccessPath(pathname)) {
    const first = perms.firstAllowedRoute();
    return (
      <Notice
        icon={LockOutlinedIcon}
        title="You don't have access to this page"
        text="Ask your administrator if you need it."
        action={
          first ? (
            <Button variant="contained" onClick={() => router.push(first)} sx={{ textTransform: "none" }}>
              Go to my pages
            </Button>
          ) : null
        }
      />
    );
  }

  return children;
}
