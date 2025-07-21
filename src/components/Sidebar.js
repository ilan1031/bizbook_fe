"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import "../styles/globals.css";

// MUI imports
// Demo
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Badge,
  Typography,
  Collapse,
} from "@mui/material";

// MUI icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardIcon from "@mui/icons-material/Keyboard";

// Custom styled components using theme
const SidebarContainer = styled(Box)(({ theme, collapsedWidth }) => ({
  width: collapsedWidth ? "60px" : "240px",
  backgroundColor: theme.palette.background.default,
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  position: "relative",
  fontFamily: "sans-serif",
  padding: "16px 2px 0px 10px",
  transition: "width 0.3s ease",
  "&::-webkit-scrollbar": {
    width: "0.5px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "4px",
  },
}));

const SidebarContent = styled(Box)({
  height: "calc(98.7vh - 70px)",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "2px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "4px",
  },
});

const MenuItemButton = styled(ListItemButton)(
  ({
    theme,
    active,
    activesubitem,
    hovered,
    parentofactivesubitem,
    collapsed,
  }) => ({
    display: "flex",
    alignItems: "center",
    padding: collapsed ? "9px 0" : "9px 16px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    backgroundColor:
      active || parentofactivesubitem
        ? theme.palette.menu.active
        : activesubitem
        ? theme.palette.menu.active
        : hovered
        ? theme.palette.menu.hover
        : "transparent",
    color:
      active || parentofactivesubitem
        ? theme.palette.menu.text.active
        : activesubitem
        ? theme.palette.primary.main
        : theme.palette.menu.text.default,
    "&:hover": {
      backgroundColor:
        active || parentofactivesubitem
          ? theme.palette.menu.active
          : activesubitem
          ? theme.palette.menu.active
          : theme.palette.menu.hover,
    },
    "& .MuiTypography-root": {
      fontSize: "13.5px",
      fontWeight: 500,
    },
    justifyContent: collapsed ? "center" : "flex-start",
    marginBottom: "2px",
  })
);

const SubMenuItemButton = styled(ListItemButton)(
  ({ theme, active, hovered, collapsed }) => ({
    display: "flex",
    alignItems: "center",
    padding: collapsed ? "9px 0" : "9px 9px 10px 32px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    backgroundColor: active
      ? theme.palette.primary.main
      : hovered
      ? theme.palette.menu.hover
      : "transparent",
    color: active
      ? theme.palette.menu.text.normal
      : theme.palette.menu.text.default,
    "&:hover": {
      backgroundColor: active
        ? theme.palette.primary.main
        : theme.palette.menu.hover,
    },
    justifyContent: collapsed ? "center" : "space-between",
    "& .MuiTypography-root": {
      fontSize: "13px",
      fontWeight: 400,
    },
    marginBottom: "1px",
  })
);

const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -2,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    backgroundColor: theme.palette.menu.collapse.background,
  },
}));

const ToggleButtonContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50px",
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 10,
}));

const ShortcutContainer = styled(Box)(({ theme }) => ({
  padding: "6px 10px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "6px",
  marginTop: "15px",
  marginBottom: "15px",
  border: `1px solid ${theme.palette.divider}`,
}));

const ShortcutKey = styled(Box)(({ theme }) => ({
  display: "inline-block",
  padding: "1px 4px",
  backgroundColor: theme.palette.action.hover,
  borderRadius: "4px",
  fontSize: "10px",
  fontWeight: "bold",
  marginRight: "4px",
  color: theme.palette.text.primary,
}));

const ShortcutItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
  fontSize: "11px",
  color: theme.palette.text.secondary,
}));

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(true);

  // Define shortcuts for Purchase submenu items with full set of shortcuts
  const shortcuts = {
    // Main section shortcuts
    vendor: { keys: "Alt+Shift+V", path: "/purchase/vendor", label: "Vendors" },
    expenses: {
      keys: "Alt+Shift+E",
      path: "/purchase/expense",
      label: "Expenses",
    },
    recurringExpenses: {
      keys: "Alt+Shift+R",
      path: "/purchase/recurringexpenses",
      label: "Recurring Expenses",
    },
    purchaseOrder: {
      keys: "Alt+Shift+P",
      path: "/purchase/purchaseorder",
      label: "Purchase Orders",
    },
    bills: { keys: "Alt+Shift+B", path: "/purchase/bills", label: "Bills" },
    paymentMade: {
      keys: "Alt+Shift+M",
      path: "/purchase/paymentmade/homepage",
      label: "Payment Made",
    },
    recurringBills: {
      keys: "Alt+Shift+R",
      path: "/purchase/recurringbills",
      label: "Recurring Bills",
    },
    vendorCredits: {
      keys: "Alt+Shift+C",
      path: "/purchase/vendorcredits/homepage",
      label: "Vendor Credits",
    },

    // Creation shortcuts
    createVendor: {
      keys: "Alt+Shift+VC",
      path: "/purchase/vendor/createvendor",
      label: "Create Vendor",
    },
    createPurchaseOrder: {
      keys: "Alt+Shift+PC",
      path: "/purchase/purchaseorder/create",
      label: "Create Purchase Order",
    },
    createBill: {
      keys: "Alt+Shift+BC",
      path: "/purchase/bills/create",
      label: "Create Bill",
    },
  };

  // Define parent-child relationships for routes
  const routeRelationships = {
    "/sales": [
      "/sales/customer",
      "/sales/quotes",
      "/sales/salesOrders",
      "/sales/deliveryChallan",
      "/sales/invoices",
      "/sales/paymentsReceived",
      "/sales/recurringInvoice",
      "/sales/recurring",
      "/sales/credit",
    ],
    "/purchase": [
      "/purchase/vendor",
      "/purchase/expense/homepage",
      "/purchase/recurringexpenses",
      "/purchase/purchaseorder",
      "/purchase/bills",
      "/purchase/paymentmade",
      "/purchase/recurringbills",
      "/purchase/vendorcredits/homepage",
    ],
    "/time": ["/time/timesheets", "/time/projects"],
    "/accountant": ["/accountant/chart", "/accountant/journals"],
    "/reports": [
      "/reports/profitandloss",
      "/reports/balancesheet",
      "/reports/journalreport"
    ],
    "/items/itemtable": [
      "/item",
      "/items/itemtable",
      "/common/newitem"
    ],
  };

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenSubmenu(menu);
      return;
    }

    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  // Toggle shortcuts panel
  const toggleShortcuts = () => {
    setShowShortcuts(!showShortcuts);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.shiftKey) {
        switch (e.key.toUpperCase()) {
          case "V": // Vendor Credits
            e.preventDefault();
            router.push("/purchase/vendor/createvendor");
            break;
          case "E": // Expenses
            e.preventDefault();
            router.push(shortcuts.expenses.path);
            break;
          case "R": // Recurring Bills
            e.preventDefault();
            router.push("/purchase/recurringbills");
            break;
          case "P": // Purchase Order
            e.preventDefault();
            router.push("/purchase/purchaseorder/create");
            break;
          case "B": // Bills
            e.preventDefault();
            router.push("/purchase/bills/create");
            break;
          case "M": // Payment Made
            e.preventDefault();
            router.push("/purchase/paymentmade/homepage");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  // Check if a route is active
  const isActive = (route) => {
    if (pathname === route) return true;

    // Check if any child route is active
    if (routeRelationships[route]) {
      // For direct child routes
      if (routeRelationships[route].includes(pathname)) return true;

      // For deeper nested routes (e.g., /purchase/expense/homepage)
      for (const childRoute of routeRelationships[route]) {
        if (pathname.startsWith(childRoute)) return true;
      }
    }

    return false;
  };

  // Check if a submenu item is active
  const isSubmenuActive = (route) =>
    pathname === route || pathname.startsWith(route + "/");

  // Check if parent should be highlighted because a child is active
  const isParentOfActiveSubitem = (route) => {
    // Direct route match should not trigger parent styling
    if (pathname === route) return false;

    // Check if any child routes are active
    return (
      routeRelationships[route]?.some(
        (childRoute) =>
          pathname === childRoute || pathname.startsWith(childRoute + "/")
      ) || false
    );
  };

  // Handle plus icon click - now with creation paths
  const handlePlusClick = (path, e) => {
    e.stopPropagation();
    e.preventDefault();
    // Map paths to their creation paths
    const creationPaths = {
      "/purchase/vendor": "/purchase/vendor/createvendor",
      "/purchase/purchaseorder": "/purchase/purchaseorder/create",
      "/purchase/bills": "/purchase/bills/create",
      "/purchase/expense": "/purchase/expense/newexpense",
      "/purchase/paymentmade": "/purchase/paymentmade/create",
      "/purchase/recurringexpenses":
        "/purchase/recurringexpenses/createrecurringexpense",
      "/sales/customer": "/sales/customer/create",
      "/sales/invoices": "/sales/invoices/new",
      "/sales/salesOrder": "/sales/salesOrder/new",
      "/sales/paymentsReceived":"/sales/paymentsReceived/newPaymentReceived",
      "/sales/recurringInvoice":"/sales/recurringInvoice/new",
      "/sales/deliveryChallan": "/sales/deliveryChallan/new",
      "/sales/quotes": "/sales/quotes/new",
      "/purchase/recurringbills": "/purchase/recurringbills/newRecurringBill",
    };

    if (creationPaths[path]) {
      router.push(creationPaths[path]);
    } else {
      console.log(`Add new item in ${path}`);
    }
  };

  // Auto-open the submenu if a submenu item is active
  useEffect(() => {
    // Find which parent menu should be open based on current path
    for (const [parent, children] of Object.entries(routeRelationships)) {
      if (children.some((child) => pathname.startsWith(child))) {
        const menuKey = parent.slice(1); // Remove the leading slash
        const normalizedKey = menuKey === "time" ? "timeTracking" : menuKey;
        setOpenSubmenu(normalizedKey);
        break;
      }
    }
  }, [pathname]);

  // Renders submenu items
  const renderSubmenuItems = (items) => {
    if (collapsed) return null;

    return items.map(({ path, label, hasNotification }) => {
      const isSubItemActive = isSubmenuActive(path);
      const isHovered = hoveredItem === path;

      return (
        <Link
          href={path}
          key={path}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <SubMenuItemButton
            active={isSubItemActive ? 1 : 0}
            hovered={isHovered ? 1 : 0}
            collapsed={collapsed ? 1 : 0}
            onMouseEnter={() => setHoveredItem(path)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {hasNotification ? (
                    <>
                      {label}
                      <Box
                        sx={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: isSubItemActive
                            ? "white"
                            : (theme) => theme.palette.menu.collapse.background,
                          ml: 1,
                        }}
                      />
                    </>
                  ) : (
                    label
                  )}
                </Box>
              }
              sx={{
                margin: 0,
                display: collapsed ? "none" : "block",
              }}
            />
            <AddCircleIcon
              sx={{
                fontSize: 18,
                color: isSubItemActive ? "white" : "primary.main",
                opacity: isHovered || isSubItemActive ? 1 : 0,
                transition: "opacity 0.2s ease",
                display: collapsed ? "none" : "block",
                marginLeft: "8px",
              }}
              onClick={(e) => handlePlusClick(path, e)}
            />
          </SubMenuItemButton>
        </Link>
      );
    });
  };

  // Main menu item renderer
  const renderMenuItem = (path, label, Icon, hasNotification = false) => {
    const isItemActive = isActive(path);
    const isParentOfActive = isParentOfActiveSubitem(path);
    const isHovered = hoveredItem === path;
    const isExpandable = [
      "/sales",
      "/purchase",
      "/time",
      "/accountant",
      "/reports",
    ].includes(path);
    const hasActiveSubitem = isExpandable && isParentOfActive;

    if (isExpandable) {
      const menuKey = path.slice(1); // Remove the leading slash
      const normalizedKey = menuKey === "time" ? "timeTracking" : menuKey;
      return renderExpandableMenuItem(
        path,
        label,
        Icon,
        normalizedKey,
        hasNotification
      );
    }

    return (
      <Tooltip title={collapsed ? label : ""} placement="right" arrow>
        <Link
          href={path}
          style={{ textDecoration: "none", color: "inherit" }}
          passHref
        >
          <MenuItemButton
            component="div"
            active={isItemActive ? 1 : 0}
            activesubitem={hasActiveSubitem ? 1 : 0}
            parentofactivesubitem={isParentOfActive ? 1 : 0}
            hovered={isHovered ? 1 : 0}
            collapsed={collapsed ? 1 : 0}
            onMouseEnter={() => setHoveredItem(path)}
            onMouseLeave={() => setHoveredItem(null)}
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
                  <Icon
                    sx={{
                      width: 20,
                      height: 20,
                      color:
                        isItemActive || isParentOfActive
                          ? "menu.text.active"
                          : "menu.text.default",
                    }}
                  />
                </NotificationBadge>
              ) : (
                <Icon
                  sx={{
                    width: 20,
                    height: 20,
                    color:
                      isItemActive || isParentOfActive
                        ? "menu.text.active"
                        : "menu.text.default",
                  }}
                />
              )}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={
                  hasNotification && !collapsed ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {label}
                      {!isItemActive && (
                        <Box
                          sx={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "menu.collapse.background",
                            ml: 1,
                          }}
                        />
                      )}
                    </Box>
                  ) : (
                    label
                  )
                }
                sx={{ margin: 0, flexGrow: 1 }}
              />
            )}
            {!collapsed &&
              isExpandable &&
              (isItemActive ||
              openSubmenu ===
                (path === "/time" ? "timeTracking" : path.slice(1)) ? (
                <KeyboardArrowDownIcon
                  sx={{
                    width: 16,
                    height: 16,
                    color:
                      isItemActive || isParentOfActive
                        ? "menu.text.normal"
                        : "menu.text.default",
                  }}
                />
              ) : (
                <KeyboardArrowRightIcon
                  sx={{
                    width: 16,
                    height: 16,
                    color:
                      isItemActive || isParentOfActive
                        ? "menu.text.normal"
                        : "menu.text.default",
                  }}
                />
              ))}
          </MenuItemButton>
        </Link>
      </Tooltip>
    );
  };

  // Expandable menu item renderer
  const renderExpandableMenuItem = (
    path,
    label,
    Icon,
    menuKey,
    hasNotification = false
  ) => {
    const isItemActive = isActive(path);
    const isParentOfActive = isParentOfActiveSubitem(path);
    const isHovered = hoveredItem === path;
    const isOpen = openSubmenu === menuKey;

    return (
      <>
        <Tooltip title={collapsed ? label : ""} placement="right" arrow>
          <MenuItemButton
            active={isItemActive && !isParentOfActive ? 1 : 0}
            activesubitem={0}
            parentofactivesubitem={isParentOfActive ? 1 : 0}
            hovered={isHovered ? 1 : 0}
            collapsed={collapsed ? 1 : 0}
            onClick={() => toggleSubmenu(menuKey)}
            onMouseEnter={() => setHoveredItem(path)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? "auto" : "auto",
                mr: collapsed ? 0 : 1,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <Icon
                sx={{
                  width: 20,
                  height: 20,
                  color:
                    isItemActive && !isParentOfActive
                      ? "menu.text.normal"
                      : isParentOfActive || isOpen
                      ? "primary.main"
                      : "menu.text.default",
                }}
              />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={label}
                sx={{
                  margin: 0,
                  flexGrow: 1,
                  color:
                    isItemActive && !isParentOfActive
                      ? "menu.text.normal"
                      : isParentOfActive || isOpen
                      ? "primary.main"
                      : "menu.text.default",
                }}
              />
            )}
            {!collapsed &&
              (isOpen ? (
                <KeyboardArrowDownIcon
                  sx={{
                    width: 16,
                    height: 16,
                    color:
                      isItemActive && !isParentOfActive
                        ? "menu.text.normal"
                        : isParentOfActive || isOpen
                        ? "primary.main"
                        : "menu.text.default",
                  }}
                />
              ) : (
                <KeyboardArrowRightIcon
                  sx={{
                    width: 16,
                    height: 16,
                    color:
                      isItemActive && !isParentOfActive
                        ? "menu.text.normal"
                        : isParentOfActive || isOpen
                        ? "primary.main"
                        : "menu.text.default",
                  }}
                />
              ))}
          </MenuItemButton>
        </Tooltip>

        {isOpen && !collapsed && (
          <List sx={{ py: 0 }}>
            {menuKey === "sales" &&
              renderSubmenuItems([
                { path: "/sales/customer", label: "Customers" },
                { path: "/sales/quotes", label: "Quotes" },
                { path: "/sales/salesOrder", label: "Sales Orders" },
                { path: "/sales/deliveryChallan", label: "Delivery Challans" },
                { path: "/sales/invoices", label: "Invoices" },
                { path: "/sales/paymentsReceived", label: "Payments Received" },
                {
                  path: "/sales/recurringInvoice",
                  label: "Recurring Invoices",
                },
                { path: "/sales/creditNotes", label: "Credit Notes" },
              ])}
            {menuKey === "purchase" &&
              renderSubmenuItems([
                { path: "/purchase/vendor", label: "Vendors" },
                { path: "/purchase/expense", label: "Expenses" },
                {
                  path: "/purchase/recurringexpenses",
                  label: "Recurring Expenses",
                },
                { path: "/purchase/purchaseorder", label: "Purchase Orders" },
                { path: "/purchase/bills", label: "Bills" },
                {
                  path: "/purchase/paymentmade",
                  label: "Payment Made",
                },
                {
                  path: "/purchase/recurringbills",
                  label: "Recurring Bills",
                },
                {
                  path: "/purchase/vendorcredits/homepage",
                  label: "Vendor Credits",
                },
              ])}
            {menuKey === "timeTracking" &&
              renderSubmenuItems([
                { path: "/time/timesheets", label: "Timesheets" },
                { path: "/time/projects", label: "Projects" },
              ])}
            {menuKey === "accountant" &&
              renderSubmenuItems([
                { path: "/accountant/chartOfAccounts", label: "Chart of Accounts" },
                { path: "/accountant/journals", label: "Journal Entries" },
              ])}
            {menuKey === "reports" &&
              renderSubmenuItems([
                { path: "/reports/profitandloss", label: "Profit and Loss" },
                { path: "/reports/balancesheet", label: "Balance Sheet" },
                { path: "/reports/journalreport", label: "Journal Report" },
              ])}
          </List>
        )}
      </>
    );
  };

  // Render shortcut list
  const renderShortcutsList = () => {
    if (collapsed) return null;

    // Get only purchase-related shortcuts (filter out duplicates)
    const purchaseShortcuts = [
      shortcuts.vendor,
      shortcuts.expenses,
      shortcuts.recurringExpenses,
      shortcuts.purchaseOrder,
      shortcuts.bills,
      shortcuts.paymentMade,
      shortcuts.recurringBills,
      shortcuts.vendorCredits,
      // Creation shortcuts
      {
        keys: "Alt+Shift+P",
        path: "/purchase/purchaseorder/create",
        label: "Create Purchase Order",
      },
      {
        keys: "Alt+Shift+B",
        path: "/purchase/bills/create",
        label: "Create Bill",
      },
      {
        keys: "Alt+Shift+V",
        path: "/purchase/vendor/createvendor",
        label: "Create Vendor",
      },
    ];

    // Remove duplicates based on keys
    const uniqueShortcuts = [];
    const seenKeys = new Set();

    purchaseShortcuts.forEach((shortcut) => {
      if (!seenKeys.has(shortcut.keys) || shortcut.keys === "Alt+Shift+VC") {
        if (
          shortcut.keys === "Alt+Shift+VC" &&
          shortcut.path.includes("createvendor")
        ) {
          // For VC, prioritize the createvendor label
          uniqueShortcuts.push(shortcut);
        } else if (!seenKeys.has(shortcut.keys)) {
          uniqueShortcuts.push(shortcut);
          seenKeys.add(shortcut.keys);
        }
      }
    });

    return (
      <ShortcutContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "500",
              color: "primary.main",
            }}
          >
            KEYBOARD SHORTCUTS
          </Typography>
          <IconButton size="small" onClick={toggleShortcuts}>
            {showShortcuts ? (
              <KeyboardArrowDownIcon fontSize="13px" />
            ) : (
              <KeyboardArrowRightIcon fontSize="13px" />
            )}
          </IconButton>
        </Box>

        <Collapse in={showShortcuts}>
          <Box sx={{ mt: 1 }}>
            {uniqueShortcuts.map((shortcut, index) => (
              <ShortcutItem key={index}>
                <span style={{ fontSize: "13px" }}>{shortcut.label}</span>
                <ShortcutKey style={{ fontSize: "13px" }}>
                  {shortcut.keys}
                </ShortcutKey>
              </ShortcutItem>
            ))}
          </Box>
        </Collapse>
      </ShortcutContainer>
    );
  };

  return (
    <SidebarContainer collapsedWidth={collapsed}>
      <SidebarContent>
        <List
          sx={{ display: "flex", flexDirection: "column", gap: "10px", p: 0 }}
        >
          {renderMenuItem("/home", "Home", HomeOutlinedIcon)}
          {renderMenuItem("/items/itemtable", "Items", Inventory2OutlinedIcon)}
          {renderMenuItem("/banking", "Banking", AccountBalanceOutlinedIcon)}
          {renderMenuItem("/sales", "Sales", ShoppingCartOutlinedIcon)}
          {renderMenuItem("/purchase", "Purchase", ShoppingBagOutlinedIcon)}
          {renderMenuItem("/time", "Time Tracking", AccessTimeOutlinedIcon)}
          {renderMenuItem(
            "/accountant",
            "Accountant",
            PersonOutlineOutlinedIcon
          )}
          {renderMenuItem("/reports", "Reports", AssessmentOutlinedIcon)}
          {renderMenuItem("/documents", "Documents", DescriptionOutlinedIcon)}
          {renderMenuItem("/payroll", "Payroll", PaymentsOutlinedIcon)}
          {renderMenuItem(
            "/configure",
            "Configure Features list",
            SettingsOutlinedIcon
          )}

          {/* Shortcuts section */}
          {/* {!collapsed && renderShortcutsList()} */}

          <IconButton onClick={toggleSidebar} size="small">
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </List>
      </SidebarContent>

      {/* Toggle button at bottom */}
    </SidebarContainer>
  );
};

export default Sidebar;
