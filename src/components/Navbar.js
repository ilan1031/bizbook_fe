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
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false); // This is for the organization drawer
  const [profileOpen, setProfileOpen] = useState(false); // Add this new state for profile popover

  // const [open, setOpen] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [orgData, setOrgData] = useState([]);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openProfile = Boolean(anchorEl);
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
    let userName = localStorage.getItem("user_name");
    userName ? setUserName(userName) : setUserName("");
  }, []);
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
          <IconButton size="small" sx={{ color: "menu.text.normal", mr: 3 }}>
            <Update fontSize="small" />
          </IconButton>
          {/* Search Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "menu.text.normal",
              border: "1px solid menu.text.normal",
              borderRadius: "6px",
              px: 1,
              width: 300,
            }}
          >
            <Search fontSize="small" sx={{ color: "#94a3b8" }} />
            <InputBase
              placeholder="Search in Customers ( / )"
              sx={{
                color: "menu.text.default",
                ml: 1,
                fontSize: 14,
                flex: 1,
              }}
            />
          </Box>
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
              {userName.length > 10 ? `${userName.slice(0, 10)}...` : userName}{" "}
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
                  <a onClick={() => router.push("/organization-list")}>
                    Manage
                  </a>
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
                {orgData.length &&
                  orgData.map((data) => {
                    return (
                      <>
                        <Box
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
                      </>
                    );
                  })}
              </Box>
            </Drawer>
            {/* </Paper>
            </Popper> */}
          </Box>
          {/* Add Button */}
          <Button
            onClick={() => setSidebarOpen(true)}
            sx={{
              minWidth: 0,
              width: 32,
              height: 32,
              borderRadius: "6px",
              backgroundColor: "primary.main",
              color: "menu.text.normal",
              fontSize: 20,
              mr: 1.5,
              "&:hover": { backgroundColor: "primary.main" },
            }}
          >
            +
          </Button>
          <Button
            onClick={() => router.push("/bot")}
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
          {/* Icons */}
          <IconButton size="small" sx={{ color: "menu.text.normal" }}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "menu.text.normal" }}>
            <SettingsOutlinedIcon />
          </IconButton>
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
              <ListItemButton onClick={handleProfileClose}>
                <ListItemText primary="Profile" />
              </ListItemButton>
              <ListItemButton onClick={handleProfileClose}>
                <ListItemText primary="My account" />
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
          <IconButton size="small" sx={{ color: "menu.text.normal" }}>
            <AppsIcon />
          </IconButton>
        </Box>
        {/* Sidebar Drawer */}
        <Drawer
          anchor="right"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 400,
              backgroundColor: "#1a1f36",
              color: "white",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Add New Record</Typography>
              <IconButton
                onClick={() => setSidebarOpen(false)}
                sx={{ color: "white" }}
              >
                <Close />
              </IconButton>
            </Box>
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              sx={textFieldStyles}
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              multiline
              rows={3}
              sx={textFieldStyles}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              sx={textFieldStyles}
            />
            <Select
              fullWidth
              defaultValue="category"
              margin="dense"
              sx={{
                ...textFieldStyles,
                "& .MuiSelect-select": { color: "white" },
              }}
            >
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="books">Books</MenuItem>
              <MenuItem value="reports">Reports</MenuItem>
            </Select>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#4f46e5",
                "&:hover": { backgroundColor: "#3730a3" },
              }}
            >
              Save
            </Button>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
// Common input style
const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#3a3f51" },
    "&:hover fieldset": { borderColor: "#4f46e5" },
    "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiOutlinedInput-input": { color: "white" },
};
