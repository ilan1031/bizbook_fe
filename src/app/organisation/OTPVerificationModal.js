"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
const OTPVerificationModal = ({ open, onClose, phoneNumber, onVerify }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(37); // Starting timer at 37s as shown in the image
  const router = useRouter(); // Initialize router

  React.useEffect(() => {
    let interval;
    if (open && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [open, timer]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      // Assuming OTP is 6 digits
      router.push("/organisation/zohoBooksSetup"); // Redirect to OrgDetails page
    } else {
      alert("Invalid OTP! Please enter a valid OTP.");
    }
  };

  const handleResend = () => {
    // Reset timer and resend OTP logic
    setTimer(37);
    // Your OTP resend logic here
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 3, position: "relative" }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="h2"
          fontWeight="bold"
          textAlign="center"
          mt={2}
          mb={3}
        >
          OTP Verification
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={2}
        >
          We&apos;ll send a code to {phoneNumber}{" "}
          <IconButton
            size="small"
            sx={{ p: 0, ml: 0.5, verticalAlign: "middle" }}
          >
            <EditNoteOutlinedIcon fontSize="small" />
          </IconButton>
        </Typography>

        <TextField
          fullWidth
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          variant="outlined"
          sx={{ mb: 2 }}
          inputProps={{
            sx: { textAlign: "center" },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleVerify}
          sx={{
            bgcolor: "#f9b700",
            color: "black",
            "&:hover": { bgcolor: "#eaa700" },
            textTransform: "none",
            fontWeight: "bold",
            mb: 2,
            py: 1.5,
          }}
        >
          Verify
        </Button>

        <Typography
          variant="body2"
          color="primary"
          textAlign="center"
          sx={{
            cursor: timer === 0 ? "pointer" : "default",
            opacity: timer === 0 ? 1 : 0.6,
          }}
          onClick={timer === 0 ? handleResend : undefined}
        >
          {timer === 0 ? "Resend OTP" : `Resend in ${timer}s`}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationModal;
