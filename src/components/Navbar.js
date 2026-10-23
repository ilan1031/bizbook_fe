"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  InputBase,
  Divider,
  Popper,
  Paper,
  Avatar,
  useTheme,
  Popover,
  ListItemButton,
  List,
  ListItemText,
} from "@mui/material";
import {
  Search,
  Menu,
  Close,
  Notifications,
  Settings,
  ArrowDropDown,
  Update,
  Assistant,
} from "@mui/icons-material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import UpdateIcon from "@mui/icons-material/Update";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import AppsIcon from "@mui/icons-material/Apps";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiService from "../services/axiosService";
import { usePermissions } from "../services/PermissionProvider";
import {
  AppsMenu,
  GlobalSearch,
  NotificationsMenu,
  QuickCreateMenu,
  RefreshButton,
  SettingsMenu,
} from "./navbar/TopBarMenus";
const Navbar = () => {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false); // This is for the organization drawer
  const [profileOpen, setProfileOpen] = useState(false); // Add this new state for profile popover

  // const [open, setOpen] = useState(false);
  const router = useRouter();
  const perms = usePermissions();
  const [userName, setUserName] = useState("");
  const [orgData, setOrgData] = useState([]);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openProfile = Boolean(anchorEl);
  const getOrg = async () => {
    try {
      let params = {
        url: "api/v1/org/get-organisation",
        method: "POST",
      };
      let response = await apiService(params);
      //   console.log("response", response);
      if (response.statusCode == 200) {
        setOrgData(response.data.data);
      }
    } catch (error) {
      console.log("getOrg error", error);
    }
  };
  const toggleDrawer = (newOpen) => () => {
    getOrg();
    setOpen(newOpen);
  };
  const handleOrgClose = () => {
    setOrgDropdownOpen(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    // Browser-only values, read after the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserName(localStorage.getItem("user_name") || "");
    getOrg();
  }, []);
  // The org button shows the organisation being worked in, not the user.
  const currentOrgId = typeof window !== "undefined" ? localStorage.getItem("organization_id") : null;
  const currentOrgName =
    (Array.isArray(orgData) && orgData.find((o) => String(o.organization_id) === String(currentOrgId))?.org_name) ||
    userName;
  const switchOrg = (orgId) => {
    if (String(orgId) === String(currentOrgId)) return setOpen(false);
    localStorage.setItem("organization_id", orgId);
    // A full reload, so every page and cache starts over in the new organisation.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/home");
  };

  // Update the avatar click handler
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
    setProfileOpen(false);
  };

  // Add logout handler
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Or if you want to clear specific items:
    // localStorage.removeItem("user_name");
    // localStorage.removeItem("token");
    // localStorage.removeItem("user_id");

    handleProfileClose();

    // Redirect to login page or home page
    router.push("/organisation/login"); // Update this path according to your login route
  };
  return (
    <AppBar
      data-rbac-ignore
      position="static"
      sx={(theme) => ({
        background: `linear-gradient(
        180deg,
        ${theme.palette.primary.main} 0%,
        ${theme.palette.primary.main} 100%
      )`,
        boxShadow: "none",
      })}
    >
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", p: "6px" }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <MenuBookIcon
            sx={{ fontSize: 22, mr: 1, color: "menu.text.normal" }}
          />
          <Typography
            color="menu.text.normal"
            variant="h6"
            fontSize={18}
            fontWeight={500}
          >
            Books
          </Typography>
        </Box>
        {/* Center - Refresh & Search */}
        <Box display="flex" alignItems="center" flex={1} ml={6}>
          <RefreshButton />
          {perms?.can("globalSearch") && <GlobalSearch />}
        </Box>
        {/* Right Side Controls */}
        <Box display="flex" alignItems="center" ml={4}>
          <Box>
            {/* Org Dropdown */}
            <Button
              onClick={toggleDrawer(true)}
              sx={{
                color: "menu.text.normal",
                fontSize: 14,
                cursor: "pointer",
                mr: 1,
                display: "flex",
                alignItems: "center",
                fontWeight: "800",
              }}
            >
              {currentOrgName.length > 18 ? `${currentOrgName.slice(0, 18)}...` : currentOrgName}{" "}
              <ArrowDropDown />
            </Button>
            {/* <Popper
              open={orgDropdownOpen}
              anchorEl={anchorEl}
              placement="bottom-start"
              style={{ zIndex: 1300 }}
            >
              <Paper
                sx={{
                  width: 350,
                  mt: 1,
                  boxShadow: 5,
                  borderRadius: 2,
                  backgroundColor: "white",
                  color: "#1a1f36",
                  overflow: "hidden",
                }}
              > */}
            <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                py={1.5}
              >
                <Typography fontWeight={600}>Organizations</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Button
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setOpen(false);
                      router.push("/organization-list");
                    }}
                  >
                    Manage
                  </Button>
                  <IconButton
                    onClick={toggleDrawer(false)}
                    size="small"
                    sx={{ color: "#475569" }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
              <Box px={2} py={1}>
                <Typography variant="subtitle2" color="#64748b" mb={1}>
                  My Organizations
                </Typography>
                {orgData.length > 0 &&
                  orgData.map((data) => {
                    return (
                      <React.Fragment key={data.organization_id}>
                        <Box
                          onClick={() => switchOrg(data.organization_id)}
                          display="flex"
                          alignItems="center"
                          p={1}
                          sx={{
                            borderRadius: 1,
                            backgroundColor: "#f8fafc",
                            cursor: "pointer",
                            border: "1px solid #e2e8f0",
                            transition: "0.2s",
                            "&:hover": {
                              backgroundColor: "#f1f5f9",
                            },
                          }}
                          mb={1}
                        >
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "6px",
                              backgroundColor: "#e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#334155",
                              mr: 2,
                            }}
                          >
                            <GroupOutlinedIcon fontSize="small" />
                          </Box>
                          <Box flex={1}>
                            <Typography fontSize={14} fontWeight={500}>
                              {data.org_name}
                            </Typography>
                            <Typography
                              fontSize={12}
                              color="#94a3b8"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              Organization ID: {data.organization_id} • Free
                            </Typography>
                          </Box>
                          {/* <Box sx={{ ml: 1 }}>
                    <img
                      src="/checkmark.svg"
                      width={18}
                      height={18}
                      alt="selected"
                    />
                  </Box> */}
                        </Box>
                      </React.Fragment>
                    );
                  })}
              </Box>
            </Drawer>
            {/* </Paper>
            </Popper> */}
          </Box>
          {perms?.can("quickCreate") && <QuickCreateMenu />}
          {perms?.canAccessPath("/bot") && (
            <Button
              data-rbac-ignore
              onClick={() => router.push("/bot")}
              aria-label="AI assistant"
              sx={{
                color: "menu.text.normal",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Assistant />
            </Button>
          )}
          {/* Icons */}
          {perms?.can("notifications") && <NotificationsMenu />}
          <SettingsMenu />
          {/* Avatar */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              color: "menu.text.default",
              bgcolor: "menu.text.normal",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: 2,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={handleAvatarClick}
            // onClick={handleClick}
          >
            {userName.slice(0, 1)}
          </Box>

          {/* <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            PaperProps={{
              sx: { mt: 1, minWidth: 150, borderRadius: 2 },
            }}
          >
            <List dense>
              {["Profile", "My account", "Logout"].map((text) => (
                <ListItemButton key={text} onClick={handleClose}>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
            </List>
          </Popover> */}

          <Popover
            open={profileOpen} // Updated state variable
            anchorEl={anchorEl}
            onClose={handleProfileClose} // Updated handler
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            PaperProps={{
              sx: { mt: 1, minWidth: 150, borderRadius: 2 },
            }}
          >
            <List dense>
              <ListItemButton
                onClick={() => {
                  handleProfileClose();
                  router.push("/profile");
                }}
              >
                <ListItemText primary="My profile" secondary={userName || null} />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  handleProfileClose();
                  router.push("/organization-list");
                }}
              >
                <ListItemText primary="Organizations" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Popover>

          {/* <Avatar
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              color: "menu.text.default",
              bgcolor: "menu.text.normal",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: 2,
              fontWeight: 600,
            }}
          >{userName.slice(0, 1)}</Avatar>*/}
          <AppsMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
