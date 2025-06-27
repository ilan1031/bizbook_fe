"use client";
import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Create Context
const SnackbarContext = createContext();

// Snackbar Provider Component
export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // Show Snackbar Function
  const showMessage = (msg, type = "success") => {
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
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
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
