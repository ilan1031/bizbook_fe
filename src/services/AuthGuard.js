"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isTokenValid } from "./auth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const PUBLIC_ROUTES = ["/organisation", "/organisation/login"];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("token");

      // No token
      if (!token) {
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.replace("/organisation/login");
          return;
        }
        setLoading(false);
        return;
      }

      // Token exists — validate it
      const valid = await isTokenValid();

      if (!valid) {
        localStorage.removeItem("token");
        console.log("Token removed and consoled here");
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.replace("/organisation/login");
          return;
        }
        setLoading(false);
        return;
      }

      // Token is valid
      if (PUBLIC_ROUTES.includes(pathname) || pathname === "/") {
        router.replace("/home");
        return;
      }

      setLoading(false);
    };

    verifyAccess();
  }, [pathname]);

  if (loading) {
    return <Box></Box>;
  }

  return children;
}
