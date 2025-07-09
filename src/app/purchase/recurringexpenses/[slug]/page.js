"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Typography,
  ListItemText,
  ListItemIcon,
  Skeleton,
  Button,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SideBarTable from "../../SideBarList";
import { usePathname, useRouter } from "next/navigation";
import RecurringExpenseViewComponent from "./RecurringExpenseViewComponent";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RecurringExpense from "../createrecurringexpense/page";

// SideBarSkeleton component for the sidebar list items
const SideBarSkeleton = () => {
  const recurringExpenseListColumns = [
    { width: "40%" }, // Expense description
    { width: "30%" }, // Amount
    { width: "30%" }, // Date
  ];

  return (
    <Box sx={{ width: "100%", p: 1, overflowY: "auto" }}>
      {/* Generate 10 skeleton rows */}
      {[...Array(10)].map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ p: 1, mb: 1 }}>
          {/* First row in each item */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            {recurringExpenseListColumns.map((col, colIndex) => (
              <Skeleton
                key={colIndex}
                variant="text"
                width={col.width}
                height={24}
                animation="wave"
              />
            ))}
          </Box>

          {/* Second row in each item */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
            <Skeleton variant="text" width="25%" height={20} animation="wave" />
          </Box>

          {/* Third row in each item */}
          <Skeleton variant="text" width="40%" height={18} animation="wave" />
          <Divider sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );
};

const recurringExpenseStatusOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no Recurring Expenses",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "ACTIVE",
    value: "Status.Active",
    key: "Active",
    empty_msg: "There are no Active Recurring Expenses",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "STOPPED",
    value: "Status.Stopped",
    key: "Stopped",
    empty_msg: "There are no Stopped Recurring Expenses",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "EXPIRED",
    value: "Status.Expired",
    key: "Expired",
    empty_msg: "There are no Expired Recurring Expenses",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Billable",
    value: "Status.Billable",
    key: "Billable",
    empty_msg: "There are no Billable Recurring Expenses",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Non-Billable",
    value: "Status.NonBillable",
    key: "Non-Billable",
    empty_msg: "There are no Non-Billable Recurring Expenses",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "start_date", label: "Start Date", order: "D" },
      { key: "profile_name", label: "Profile Name", order: "D" },
      { key: "account_name", label: "Expense Account", order: "D" },
      { key: "total", label: "Amount", order: "D" },
    ],
  },
  {
    text: "Import Recurring Expense",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Recurring Expense",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Export Current View",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAltIcon className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const Page = () => {
  // Status and filter state
  const [statusOptions, setStatusOptions] = useState(
    recurringExpenseStatusOptions
  );
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

  // Data state
  const [recurringExpenseList, setRecurringExpenseList] = useState([]);
  const [filteredRecurringExpenses, setFilteredRecurringExpenses] = useState(
    []
  );

  // Menu anchor states
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);

  // Loading and UI states
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);

  // Pagination, sorting and filtering refs
  const page = useRef(1);
  const limit = useRef(10);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const submenuCloseTimeout = useRef(null);
  const [sortColumn, setSortColumn] = useState("profile_name");
  const [sortOrder, setSortOrder] = useState("D");
  const [filterBy, setFilterBy] = useState("Status.All");

  // Router
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchRecurringExpenseList(filterBy, sortColumn, sortOrder);
  }, []);

  // Effect to sync selected row with URL changes
  useEffect(() => {
    const activeID = pathname.split("/")[3];
    if (activeID && filteredRecurringExpenses.length > 0) {
      const updatedArray = filteredRecurringExpenses.map((item) => ({
        ...item,
        isActive: item.recurring_expense_id === activeID,
      }));
      setFilteredRecurringExpenses(updatedArray);
    }
  }, [pathname]);

  const fetchRecurringExpenseList = async (
    filterValue = "Status.All",
    sort_column = "createdAt",
    sort_order = "D"
  ) => {
    setLoading(true);
    let organization_id = localStorage.getItem("organization_id");

    try {
      // Add a short delay to demonstrate the skeleton loader (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: page.current,
          per_page: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current,
          orgId: organization_id,
        },
        url: `/api/v1/recurring-expense/recurring-expense-list`,
        customBaseUrl: config.PO_Base_url,
        file: false,
      });

      const data = response.data.recurringExpense || [];
      setDotsAndSkeleton(dotsAndSkeleton + 1);

      // Apply active state based on current URL
      const activeID = pathname.split("/")[3];
      const dataWithActiveState = data.map((item) => ({
        ...item,
        isActive: item.recurring_expense_id === activeID,
      }));

      setRecurringExpenseList(dataWithActiveState);
      setFilteredRecurringExpenses(dataWithActiveState);
      setTotalCount(response.data.totalCount || 0);
      setHasMore(response.data.page_context?.has_more_page || false);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch recurring expense list:", error);
      setLoading(false);
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchRecurringExpenseList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchRecurringExpenseList(filterBy, sortColumn, sortOrder);
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setFilterBy(status.value);
    page.current = 1;
    limit.current = 10;
    fetchRecurringExpenseList(status.value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const toggleFavorite = (id) => {
    const updatedOptions = statusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setStatusOptions(updatedOptions);
  };

  const handleNewCustomView = () => {
    setAnchorEl(null);
  };

  const handleSelectRow = (key) => {
    // Update the filtered array with active states
    const updatedArray = filteredRecurringExpenses.map((item) => ({
      ...item,
      isActive: item.recurring_expense_id === key.recurring_expense_id,
    }));

    setFilteredRecurringExpenses(updatedArray);
    setSelectedValue(key);
    router.push(`/purchase/recurringexpenses/${key.recurring_expense_id}`);
  };

  const handleRowClick = (row) => {
    // Update the filtered array with active states
    const updatedArray = filteredRecurringExpenses.map((item) => ({
      ...item,
      isActive: item.recurring_expense_id === row.recurring_expense_id,
    }));

    setFilteredRecurringExpenses(updatedArray);
    setSelectedValue(row);
    router.push(`/purchase/recurringexpenses/${row.recurring_expense_id}`);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    console.log("Selected menu item:", item);
    if (item === "Export Recurring Expense" || item === "Export Current View") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchRecurringExpenseList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchRecurringExpenseList(filterBy, sortCol, sortOrd);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Filtered options for the sidebar menu
  const favoriteOptions = statusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = statusOptions.filter((opt) => !opt.is_favorite);

  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%", height: "90vh" }}>
        <Box
          sx={{
            width: "340px",
            backgroundColor: "white",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRight: "1px solid #e0e0e0",
          }}
        >
          {/* SideBarHeader */}
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 16px",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
              borderBottom: "1px solid #e0e0e0",
              minHeight: "56px",
            }}
          >
            <Typography
              onClick={handleDropdownClick}
              style={{
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {selectedStatus.title.length > 15
                ? `${selectedStatus.title.slice(0, 15)}...`
                : selectedStatus.title}
              <KeyboardArrowDownIcon
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontSize: "24px",
                  marginLeft: "4px",
                }}
              />
            </Typography>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: 250,
                  // height: "360px",
                  marginLeft: "-10px",
                  maxHeight: 500,
                  overflowY: "auto", // Scrollable content
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Smooth shadow
                  borderRadius: "8px",
                  mt: 1,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                  "& .MuiList-root": {
                    padding: "0px",
                  },
                },
              }}
            >
              <Box
                sx={{
                  maxHeight: "310px", // Limit scroll height
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                }}
              >
                {favoriteOptions.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "black",
                        px: 2,
                        py: 1,
                      }}
                    >
                      FAVORITES
                    </Typography>
                    <Divider />
                    {favoriteOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        onClick={() => handleSelectStatus(option)}
                        sx={{
                          backgroundColor:
                            selectedStatus.id === option.id
                              ? "primary.main"
                              : "transparent",
                          color:
                            selectedStatus.id === option.id
                              ? "menu.text.normal"
                              : "menu.text.default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "primary.main",
                            "& .MuiTypography-root": {
                              color: "menu.text.normal",
                            },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              selectedStatus.id === option.id ? 500 : 400,
                            color:
                              selectedStatus.id === option.id
                                ? "menu.text.normal"
                                : "menu.text.default",
                          }}
                        >
                          {option.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(option.id, e)}
                          sx={{ padding: 0 }}
                        >
                          <StarIcon
                            fontSize="small"
                            sx={{ color: "#f3cf00" }}
                          />
                        </IconButton>
                      </MenuItem>
                    ))}
                    {favoriteOptions.length > 0 &&
                      defaultOptions.length > 0 && <Divider />}
                  </>
                )}

                {defaultOptions.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "black",
                        px: 2,
                        py: 1,
                      }}
                    >
                      DEFAULT FILTERS
                    </Typography>
                    <Divider />
                    {defaultOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        onClick={() => handleSelectStatus(option)}
                        sx={{
                          backgroundColor:
                            selectedStatus.id === option.id
                              ? "primary.main"
                              : "transparent",
                          color:
                            selectedStatus.id === option.id
                              ? "menu.text.normal"
                              : "menu.text.default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "primary.main", // Hover effect color
                            "& .MuiTypography-root": {
                              color: "menu.text.normal",
                            },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              selectedStatus.id === option.id ? 500 : 400,
                            color:
                              selectedStatus.id === option.id
                                ? "menu.text.normal"
                                : "menu.text.default",
                          }}
                        >
                          {option.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(option.id, e)}
                          sx={{ padding: 0 }}
                        >
                          {option.is_favorite ? (
                            <StarIcon
                              sx={{
                                fontSize: 18,
                                color: "#4285F4",
                              }}
                            />
                          ) : (
                            <StarBorderIcon
                              sx={{
                                fontSize: 18,
                                color: "#888",
                              }}
                            />
                          )}
                        </IconButton>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Box>

              {/* New Custom View Fixed at Bottom */}
              <Divider />
              <MenuItem
                onClick={handleNewCustomView}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "white", // Ensure it stays on top
                  zIndex: 1,
                  "&:hover": {
                    backgroundColor: "#E6F1FF",
                  },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "primary.main",
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                >
                  <AddIcon
                    sx={{
                      fontSize: 10,
                      color: "menu.text.normal",
                    }}
                  />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "primary.main",
                  }}
                >
                  New Custom View
                </Typography>
              </MenuItem>
            </Menu>

            <Box>
            <Button
                    variant="contained"
                    size="small"
                    sx={{
                      width: "30px",
                      height: "30px",
                      minWidth: "20px", // ensures the button doesn't expand due to internal padding
                      padding: 0, // removes internal padding
                      marginRight:"10px",
                      borderRadius:"5px"
                    }}
                    onClick={() => router.push("/purchase/recurringexpenses/createrecurringexpense")}
                  >
                    <AddOutlined sx={{ fontSize: "16px" }} />{" "}
                    {/* optional: scale icon */}
                  </Button>

              <IconButton
                className="more-icon"
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon className="button-more-svg" />
              </IconButton>

              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: "10px",
                    ml: "-170px",
                    borderRadius: "8px",
                    padding: "4px",
                    fontSize: "13px",
                    minWidth: "210px",
                    "& .MuiList-root": {
                      padding: "4px",
                    },
                  },
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onMouseEnter={(e) => {
                      if (item.submenu) {
                        setSubmenuAnchorEl(e.currentTarget);
                      } else {
                        setSubmenuAnchorEl(null);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.submenu) {
                        submenuCloseTimeout.current = setTimeout(() => {
                          if (!submenuHover) {
                            setSubmenuAnchorEl(null);
                          }
                        }, 200);
                      }
                    }}
                    onClick={() => {
                      if (!item.submenu) handleMenuItemClick(item.text);
                    }}
                    sx={{
                      borderRadius: "6px",
                      fontSize: "13px",
                      paddingRight: "20px",
                      margin: "1px 0",
                      padding: "8px 8px",
                      width: "auto",
                      color: "black",
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor:
                        menuAnchorEl && item.submenu
                          ? "primary.main"
                          : "transparent",
                      color:
                        menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                      "& .menu-icon": {
                        color:
                          menuAnchorEl &&
                          item.submenu &&
                          "menu.text.normal !important",
                      },
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "menu.text.normal",
                        "& .menu-icon": {
                          color: "menu.text.normal !important",
                        },
                      },
                      borderBottom: item.border ? "1px solid #ddd" : "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {item.icon && (
                          <ListItemIcon sx={{ minWidth: "28px" }}>
                            {item.icon}
                          </ListItemIcon>
                        )}
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: item.hasArrow ? 500 : 400,
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                      {item.hasArrow && <ChevronRight className="menu-icon" />}
                    </Box>

                    {/* Submenu for sorting options */}
                    {item.submenu && (
                      <Menu
                        anchorEl={submenuAnchorEl}
                        open={Boolean(
                          submenuAnchorEl &&
                            submenuAnchorEl.textContent.includes(item.text)
                        )}
                        onClose={() => setSubmenuAnchorEl(null)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        PaperProps={{
                          onMouseEnter: () => {
                            clearTimeout(submenuCloseTimeout.current);
                            setSubmenuHover(true);
                          },
                          onMouseLeave: () => {
                            setSubmenuHover(false);
                            submenuCloseTimeout.current = setTimeout(() => {
                              setSubmenuAnchorEl(null);
                            }, 200);
                          },
                          sx: {
                            ml: 1,
                            fontSize: "12px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
                            minWidth: "180px",
                          },
                        }}
                      >
                        {item.submenu.map((subItem) => (
                          <MenuItem
                            key={subItem.key}
                            onClick={() => {
                              setSubmenuAnchorEl(null);
                              setMenuAnchorEl(null);
                              setSortColumn(subItem.key);
                              fetchRecurringExpenseList(
                                filterBy,
                                subItem.key,
                                subItem.order
                              );
                            }}
                            selected={sortColumn === subItem.key}
                            sx={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 1,
                              padding: "8px 16px",
                              "&:hover": {
                                backgroundColor: "primary.main !important",
                                color: "menu.text.default",
                                "& .sort-icon": {
                                  color: "menu.text.default",
                                },
                              },
                              backgroundColor:
                                sortColumn === subItem.key
                                  ? "primary.main !important"
                                  : "transparent",
                              color:
                                sortColumn === subItem.key
                                  ? "menu.text.default !important"
                                  : "",
                              fontWeight:
                                sortColumn === subItem.key ? 600 : 400,
                            }}
                          >
                            <Typography sx={{ fontSize: "12px" }}>
                              {subItem.label}
                            </Typography>

                            <Box
                              onClick={(e) => {
                                e.stopPropagation();
                                const newOrder =
                                  subItem.order === "D" ? "A" : "D";
                                subItem.order = newOrder;
                                setSortOrder(newOrder);
                                setSortColumn(subItem.key);
                                setSubmenuAnchorEl(null);
                                setMenuAnchorEl(null);
                                fetchRecurringExpenseList(
                                  filterBy,
                                  subItem.key,
                                  newOrder
                                );
                              }}
                              sx={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {subItem.order === "D" ? (
                                <ArrowDownward
                                  fontSize="inherit"
                                  className="sort-icon"
                                />
                              ) : (
                                <ArrowUpward
                                  fontSize="inherit"
                                  className="sort-icon"
                                />
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>

          {/* Sidebar content with skeleton loading state */}
          <Box
            sx={{
              overflowY: "auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading ? (
              <SideBarSkeleton />
            ) : (
              <SideBarTable
                staticData={filteredRecurringExpenses}
                handleSelectRow={handleSelectRow}
                onRowClick={handleRowClick}
                type={"RecurringExpense"}
                setSelectedValue={setSelectedValue}
                // Additional props for pagination if needed
                hasMore={hasMore}
                totalCount={totalCount}
                loadMore={() => {
                  if (hasMore) {
                    page.current += 1;
                    fetchRecurringExpenseList(filterBy, sortColumn, sortOrder);
                  }
                }}
              />
            )}
          </Box>
        </Box>

        {/* View Component */}
        <Box sx={{ flexGrow: 1 }}>
          <RecurringExpenseViewComponent />
        </Box>
        {/* <Box sx={{ flexGrow: 1 }}>
          <RecurringExpense  journalId={journalId}/>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Page;
