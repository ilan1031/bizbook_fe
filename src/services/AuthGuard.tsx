"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import { usePermissions } from "./PermissionProvider";
import { endSession, isSessionEndingResponse, SIGN_OUT_REASONS, signOutReason } from "./axiosService";

// Loading the account failed. Only a rejected token ends the session; a
// rate limit (429), a server error or a network problem keeps the user
// signed in and offers a retry.
const sessionRejected = (error) =>
  Boolean(error) && isSessionEndingResponse(error.httpStatus, error);

const PUBLIC_ROUTES = ["/organisation", "/organisation/login", "/team/accept-invite"];
// Pages anyone may open, signed in or not (a signed-in person can still follow an invite link).
const OPEN_TO_ANYONE = ["/team/accept-invite"];

function Notice({ icon: Icon, title, text, action }: any) {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        textAlign: "center" as const,
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

export default function AuthGuard({ children }: any) {
  const router = useRouter();
  const pathname = usePathname()!;
  const perms = usePermissions();
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const hasToken = Boolean(currentToken);
  // Permissions belong to a token; after login/logout they're stale until
  // reloaded for the new one.
  const stale = hasToken && perms.token !== currentToken;
  // The browser's storage is only known after the first render, so anything
  // that depends on it waits for the mount (server and first client markup match).
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
      if (!perms.error || sessionRejected(perms.error)) endSession(perms.error?.code);
      return;
    }
    // Signed in: leave the login/sign-up pages.
    if ((isPublic && !OPEN_TO_ANYONE.includes(pathname)) || pathname === "/") {
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

  // Temporary failure: try again on its own after a while.
  const temporaryError = hasToken && !stale && !perms.loading && !perms.me && perms.error && !sessionRejected(perms.error);
  useEffect(() => {
    if (!temporaryError) return undefined;
    const timer = setTimeout(() => perms.reload(), perms.error?.httpStatus === 429 ? 60000 : 15000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temporaryError, perms.error]);

  if (!hasToken) {
    if (isPublic) return children;
    if (!mounted) return <Box />;
    // Signed out (or never signed in): say why, and offer the sign-in page
    // while the redirect to it runs.
    const reason = signOutReason();
    const why = reason ? SIGN_OUT_REASONS[reason] : undefined;
    return (
      <Notice
        icon={LockOutlinedIcon}
        title={why ? "You've been signed out" : "Sign in to continue"}
        text={why || "Sign in with your account to open this page."}
        action={
          <Button variant="contained" onClick={() => router.replace("/organisation/login")} sx={{ textTransform: "none" as const }}>
            Sign in
          </Button>
        }
      />
    );
  }
  // On the login page, keep showing it until the redirect happens.
  if (OPEN_TO_ANYONE.includes(pathname)) return children;
  if (isPublic) return stale || perms.loading || !perms.me ? children : <Box />;
  if (temporaryError) {
    const tooMany = perms.error?.httpStatus === 429;
    return (
      <Notice
        icon={tooMany ? HourglassEmptyOutlinedIcon : CloudOffOutlinedIcon}
        title={tooMany ? "Too many requests" : "Couldn't load your account"}
        text={
          tooMany
            ? "Too many requests were made in a short time. You're still signed in; this page will try again in a minute."
            : `${perms.error?.message || "The server didn't respond."} You're still signed in.`
        }
        action={
          <Button variant="contained" onClick={() => perms.reload()} sx={{ textTransform: "none" as const }}>
            Try again
          </Button>
        }
      />
    );
  }
  if (stale || perms.loading || !perms.me) return <Box />;

  if (!perms.isSuperadmin && !perms.hasAnyPage && !pathname.startsWith("/organisation")) {
    return (
      <Notice
        icon={HourglassEmptyOutlinedIcon}
        title="No pages assigned yet"
        text="Your account is active, but an administrator hasn't given you access to any pages. Once they do, they'll appear in the menu on the left."
        action={
          <Button variant="outlined" onClick={() => endSession()} sx={{ textTransform: "none" as const }}>
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
            <Button variant="contained" onClick={() => router.push(first)} sx={{ textTransform: "none" as const }}>
              Go to my pages
            </Button>
          ) : null
        }
      />
    );
  }

  return children;
}
