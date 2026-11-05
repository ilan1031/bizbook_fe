"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  PanelLeftOpen as RiMenuUnfold3Line,
  PanelLeftClose as RiMenuFold3Line,
  ChevronDown as FaChevronDown,
  Lock as CiLock,
  LogOut as IoMdLogOut,
} from "lucide-react";
import ChangePasswordDialog from "./ChangePasswordDialog";
import apiService, { portalGet, clearPortalSession, portalLoginPath } from "../portalApi";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Badge,
  MenuItem,
  Menu,
} from "@mui/material";

import { CalculatorIcon, Home } from "lucide-react";

const SidebarContainer = styled(Box, { shouldForwardProp: (prop) => prop !== "collapsedWidth" })<{ collapsedWidth?: any }>(({ collapsedWidth }) => ({
  width: collapsedWidth ? "60px" : "240px",
  backgroundColor: "#f7f7fe",
  borderRight: "1px solid #e0e0e0",
  overflow: "hidden" as const,
  position: "relative" as const,
  fontFamily: "sans-serif" as const,
  padding: "16px 2px 0px 10px",
  transition: "width 0.3s ease",
}));

const SidebarContent = styled(Box)({
  height: "calc(98.7vh - 70px)",
  overflowY: "auto" as const,
  "&::-webkit-scrollbar": {
    width: "2px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "4px",
  },
});

const MenuItemButton = styled(ListItemButton)<{ active?: any; hovered?: any; collapsed?: any }>(
  ({ active, hovered, collapsed }) => ({
    display: "flex" as const,
    alignItems: "center" as const,
    padding: collapsed ? "9px 0" : "9px 16px",
    borderRadius: "8px",
    backgroundColor: active
      ? "#408dfb"
      : active && hovered
      ? "#408dfb"
      : "transparent",
    color: active ? "#fff" : "#000",
    "& svg":{
        stroke: active && collapsed && "#408dfb !important"
    },
    "&:hover": {
      backgroundColor: active && !collapsed ? "#408dfb" : "",
      "& svg":{
        stroke: active && collapsed && "#408dfb !important"
      }
    },
    "& .MuiTypography-root": {
      fontSize: "14px",
      fontWeight: active ? 600 : 500,
      color: active ? "#fff" : "#000",
    },
    justifyContent: collapsed ? "center" : "flex-start",
    marginBottom: "2px",
  })
);

const NotificationBadge = styled(Badge)({
  "& .MuiBadge-badge": {
    right: -2,
    top: 5,
    border: "2px solid #fff",
    backgroundColor: "#ff4d4f",
  },
});

const Sidebar = ({ collapsed, toggleSidebar }: any) => {
  const pathname = usePathname()!;
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>({});
  const [passwordOpen, setPasswordOpen] = useState<boolean>(false);
  const router = useRouter();

  const isActive = (route) => pathname === route;

  useEffect(() => {
    const fetchOrg = async () => {
      const client_id = portalGet("clientId");
      const org_id = portalGet("orgId");

      // setLoading(true);
      try {
        console.log(org_id, "org_id");
        const response = await apiService({
          method: "GET",
          url: `/api/v1/contact/${client_id}?organization_id=${org_id}`,
        });
        console.log("the Response sidebar detail page", response);
        setUserDetails(response.data.data);

        // setLoading(false);
      } catch (error) {
        console.log(error, "Error in getting Sidebar Detail page");
      }
    };
    fetchOrg();
  }, []);

  const renderMenuItem = (path, label, Icon, hasNotification = false) => {
    const isItemActive = isActive(path);
    const isHovered = hoveredItem === path;

    console.log(isItemActive, "isItemActive");

    return (
      <Tooltip title={collapsed ? label : ""} placement="right" arrow>
          <MenuItemButton {...({} as any)}
            onClick={() => router.push(path)}
            active={isItemActive ? 1 : 0}
            hovered={isHovered ? 1 : 0}
            collapsed={collapsed ? 1 : 0}
            onMouseEnter={() => setHoveredItem(path)}
            onMouseLeave={() => setHoveredItem(null)}
            sx={{
              width:collapsed ? "35px" : "auto",
              height:collapsed ? "35px" : "auto",
              backgroundColor: isItemActive && collapsed && isHovered && "#ededf7" || isItemActive && collapsed && !isHovered && "#ededf7 !important"
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? "auto" : "auto",
                mr: collapsed ? 0 : 1,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              {hasNotification ? (
                <NotificationBadge badgeContent=" " variant="dot">
                  <Icon width="15px" color={isItemActive && !collapsed ? "#fff" :  isItemActive && collapsed  ? "#408dfb" : "#333"} />
                </NotificationBadge>
              ) : (
                <Icon width="15px" color={isItemActive ? "#fff" : "#333"} />
              )}
            </ListItemIcon>

            {!collapsed && (
              <ListItemText
                primary={label}
                sx={{
                  margin: 0,
                  flexGrow: 1,
                }}
              />
            )}
          </MenuItemButton>
      </Tooltip>
    );
  };

  return (
    <SidebarContainer {...({} as any)} collapsedWidth={collapsed} sx={
      {
        p:0
      }
    }>
      <SidebarContent >
        <List sx={{ display: "flex" as const, flexDirection: "column" as const, gap: "10px",pt:0 }}>
          <Box
            sx={{
              display: "flex" as const,
              alignItems: "center" as const,
              justifyContent: collapsed ? "center" : "start",
              gap: 2,
              bgcolor: "#ededf7",
              p: collapsed ? 1.5 : 2,
              borderRadius: 1.5,
            }}
          >
            {collapsed && (
              <RiMenuUnfold3Line
                style={{ fontSize: "20px" }}
                onClick={toggleSidebar}
              />
            )}

            {!collapsed && (
              <>
                <RiMenuFold3Line
                  style={{ fontSize: "20px" }}
                  onClick={toggleSidebar}
                />
                <Box sx={{ fontSize: "15px" }}>
                  {userDetails?.organization?.org_name.slice(0, 15)}

                  {userDetails?.organization?.org_name.length > 15 && <>...</>}
                </Box>
              </>
            )}
          </Box>

          {!collapsed && (
            <Box
              sx={{ width: "100%", display: "flex" as const, justifyContent: "center" as const ,p:1.5}}
            >
              <Box
                sx={{
                  bgcolor: "#ededf7",
                  height: 150,
                  width: 187,
                  borderRadius: 2,
                  my: 1,
                  display: "flex" as const,
                  flexDirection: "column" as const,
                  justifyContent: "center" as const,
                  alignItems: "center" as const,
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    fontSize: "15px",
                    fontWeight: "500" as const,
                    color: "white",
                    bgcolor: "#408dfb",
                    width: "40px",
                    height: "40px",
                    borderRadius: 2,
                    display: "flex" as const,
                    justifyContent: "center" as const,
                    alignItems: "center" as const,
                  }}
                >
                  {userDetails.first_name?.slice(0, 2).toUpperCase()}
                </Box>

                {/*Name*/}
                <Box
                  sx={{ fontSize: "15px", fontWeight: "500" as const, display: "flex" as const }}
                >
                  {userDetails.first_name}
                  <FaChevronDown
                    style={{
                      paddingLeft: "8px",
                      paddingTop: "3px",
                      fontSize: "20px",
                      cursor: "pointer" as const,
                    }}
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                    }}
                  />
                </Box>

                <Box
                  sx={{ color: "#878895", fontSize: "12px", fontWeight: "400" as const }}
                >
                  {userDetails.email?.slice(0, 18)}
                  {userDetails?.email?.length > 18 && <>...</>}
                </Box>
              </Box>
            </Box>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            onClose={() => {
              setAnchorEl(null);
            }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setPasswordOpen(true);
              }}
            >
              <CiLock style={{ paddingRight: "5px", fontSize: "25px" }} />{" "}
              Change Password
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                const loginPath = portalLoginPath();
                clearPortalSession();
                router.replace(loginPath);
              }}
              sx={{ color: "#dc3545" }}
            >
              <IoMdLogOut style={{ paddingRight: "5px", fontSize: "25px" }} />{" "}
              Log Out
            </MenuItem>
          </Menu>
          <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />

          {collapsed && (
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "500" as const,
                color: "white",
                bgcolor: "#408dfb",
                width: "40px",
                height: "40px",
                borderRadius: 2,
                display: "flex" as const,
                justifyContent: "center" as const,
                alignItems: "center" as const,
                marginLeft: "9px"
              }}
            >
              {userDetails.first_name?.slice(0, 2).toUpperCase()}
            </Box>
          )}

          {/*List Of Items*/}
          <Box sx={{p:1.5}}>
            {renderMenuItem("/portal/home", "Home", Home)}
            {renderMenuItem("/portal/quotes", "Quotes", CalculatorIcon)}
          </Box>
        </List>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
