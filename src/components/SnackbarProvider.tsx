"use client";
import { createContext, useContext, useState } from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

// Create Context
interface SnackbarContextValue {
  showMessage: (msg: string, type?: string) => void;
}

// No default value (as before): useSnackbar() is only meaningful under the provider.
const SnackbarContext = createContext<SnackbarContextValue>(undefined as unknown as SnackbarContextValue);

// Snackbar Provider Component
export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<any>("");
  const [severity, setSeverity] = useState<string>("success");

  // Show Snackbar Function
  const showMessage = (msg: string, type = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      {/* MUI Snackbar Component */}
      <Snackbar
        open={open}
        // Errors stay up long enough to read; other messages go after 3s.
        autoHideDuration={severity === "error" ? 8000 : 3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity as AlertColor}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

// Custom Hook to Use Snackbar
export const useSnackbar = () => useContext(SnackbarContext);
