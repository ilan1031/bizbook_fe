"use client";
import React, { useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useRouter, useSearchParams } from "next/navigation";

// Define keyframes for the confetti animation
const confettiFall = keyframes`
  0% {
    transform: translateY(-0px);
    opacity: 1;
  }
  90% {
    transform: translateY(500px);
    opacity: 1;
  }
  100% {
    transform: translateY(500px);
    opacity: 0;
  }
`;

const WelcomeScreen = () => {
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(true);
  const [confettiElements, setConfettiElements] = useState([]);
  const router = useRouter();

  // Generate confetti elements
  useEffect(() => {
    const colors = ["#ff416c", "#4facfe", "#43e97b", "#fa709a", "#667eea"];
    const newConfettiElements = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${4 + Math.random() * 2}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setConfettiElements(newConfettiElements);
  }, []);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    router.push("/home");
  };
 

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f5f5f7",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: 1 }}>
              <img
                src="/Bizbooks-icon.png"
                alt="Bizbooks"
                width="24"
                height="24"
              />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Hello
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, color: "#757575" }}>
              !
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#757575" }}>
            Expires: 16-6-2023
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
            "& .Mui-selected": { color: "#2d62ed !important" },
            "& .MuiTabs-indicator": { backgroundColor: "#2d62ed" },
          }}
        >
          <Tab label="Dashboard" />
          <Tab label="Getting Started" />
          <Tab label="Announcements" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3, flex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome to Bizbooks
        </Typography>
        <Typography variant="body1" sx={{ color: "#757575", mb: 3 }}>
          The easy-to-use accounting software designed for small businesses.
        </Typography>

        {/* Card */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 2,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                OVER 5 MILLION BUSINESSES TRUST Bizbooks
              </Typography>
              <Box>
                <img
                  src="/biz-trust-badge.png"
                  alt="Trusted"
                  width="80"
                  height="40"
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    sx={{
                      color: "#2d62ed",
                      "&.Mui-checked": { color: "#2d62ed" },
                    }}
                  />
                }
                label={
                  <Typography variant="body1">
                    Live Webinar: Introduction to Bizbooks
                  </Typography>
                }
              />
              <Box sx={{ ml: "auto" }}>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#2d62ed",
                    color: "#2d62ed",
                    "&:hover": { borderColor: "#1a48c9", color: "#1a48c9" },
                  }}
                >
                  View Live Webinar
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Progress Section */}
          <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Let`s get you started
            </Typography>
            <Typography variant="body2" sx={{ color: "#757575" }}>
              0% Completed
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={0}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#e0e0e0",
              "& .MuiLinearProgress-bar": { backgroundColor: "#2d62ed" },
            }}
          />
        </Box>

        {/* Setup Steps */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#2d62ed",
                      "&.Mui-checked": { color: "#2d62ed" },
                    }}
                  />
                }
                label={
                  <Typography variant="body1">
                    Add organization details
                  </Typography>
                }
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#2d62ed",
                      "&.Mui-checked": { color: "#2d62ed" },
                    }}
                  />
                }
                label={
                  <Typography variant="body1">
                    Create your first invoice
                  </Typography>
                }
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#2d62ed",
                      "&.Mui-checked": { color: "#2d62ed" },
                    }}
                  />
                }
                label={
                  <Typography variant="body1">
                    Connect to Bizbooks to auto-populate them
                  </Typography>
                }
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#2d62ed",
                      "&.Mui-checked": { color: "#2d62ed" },
                    }}
                  />
                }
                label={
                  <Typography variant="body1">
                    Add your contacts to provide access to your employees and
                    accountants
                  </Typography>
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Welcome Dialog */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          },
        }}
      >
        {/* Background with confetti effect */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            backgroundColor: "white",
            zIndex: 0,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Confetti container */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {/* Dynamically generated confetti pieces */}
            {confettiElements.map((confetti, index) => (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: confetti.left,
                  width: "10px",
                  height: "10px",
                  backgroundColor: confetti.color,
                  borderRadius: "2px",
                  zIndex: 1,
                  animation: `${confettiFall} ${confetti.duration} linear forwards ${confetti.delay}`,
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 6, mb: 2, position: "relative", zIndex: 3 }}>
          <Avatar
            sx={{
              bgcolor: "#6f42c1",
              width: 64,
              height: 64,
              fontSize: 32,
              margin: "0 auto",
            }}
          >
            h
          </Avatar>
        </Box>
        <DialogTitle sx={{ pb: 0, position: "relative", zIndex: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Welcome aboard !
          </Typography>
          <Box
            sx={{
              width: "40px",
              height: "4px",
              bgcolor: "#2d62ed",
              margin: "16px auto",
              borderRadius: "2px",
            }}
          />
        </DialogTitle>
        <DialogContent sx={{ position: "relative", zIndex: 3 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Thank you for choosing Bizbooks. Before you start, we&apos;d love to show
            you around and help you navigate the app.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            flexDirection: "column",
            pb: 3,
            position: "relative",
            zIndex: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#2d62ed",
              color: "white",
              textTransform: "none",
              borderRadius: "4px",
              py: 1,
              px: 3,
              mb: 2,
              "&:hover": {
                bgcolor: "#1a48c9",
              },
            }}
            onClick={handleModalClose}
          >
            Show Me Around
          </Button>
          <Button
            variant="text"
            sx={{
              color: "#757575",
              textTransform: "none",
              "&:hover": {
                bgcolor: "transparent",
                color: "#424242",
              },
            }}
            onClick={handleModalClose}
          >
            No thanks, I&apos;ll explore it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WelcomeScreen;
