"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Box,
  Divider,
  Typography,
  ListItemText,
  ListItemIcon,
  Skeleton,
  TablePagination,
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
import PaymentViewComponent from "./PaymentViewComponent";
import { ChevronRight, Download, Settings, Upload } from "lucide-react";

const paymentStatusOptions = [
  {
    id: "1",
    is_favorite: true,
    title: "All Payments",
    value: "Status.All",
    key: "All Payments",
    empty_msg: "There are no Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    is_favorite: true,
    title: "Advance Payments",
    value: "Status.Inactive",
    key: "Advance Payments",
    empty_msg: "There are no Advance Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    is_favorite: false,
    title: "Billable Payments",
    value: "Status.Active",
    key: "Billable Payments",
    empty_msg: "There are no Billable Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    is_favorite: false,
    title: "Paid via Check",
    value: "Status.Inactive",
    key: "Paid via Check",
    empty_msg: "There are no Paid via Check",
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
      { key: "date", label: "Date", order: "D" },
      { key: "payment_id", label: "Payment#", order: "D" },
      {
        key: "vendor_name",
        label: "Vendor Name",
        order: "D",
      },
      { key: "payment_mode", label: "Mode", order: "D" },
      { key: "amount", label: "Amount", order: "D" },
      { key: "unused_amount", label: "Unused Amount", order: "D" },
    ],
  },
  {
    text: "Import Payments",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Payments",
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
];

// Define the expected columns for the payment table
const paymentTableColumns = [
  { key: "created_time", label: "DATE" },
  { key: "payment_number", label: "PAYMENT #" },
  { key: "reference_number", label: "REFERENCE" },
  { key: "vendor_name", label: "VENDOR NAME" },
  { key: "payment_mode", label: "PAYMENT MODE" },
  { key: "status_type", label: "STATUS" },
  { key: "amount", label: "AMOUNT" },
];

// TableSkeleton component for the table view
const TableSkeleton = () => {
  return (
    <Box sx={{ width: "100%", p: 1 }}>
      {/* Header Row */}
      <Box sx={{ display: "flex", mb: 1 }}>
        <Skeleton variant="rectangular" width={28} height={24} sx={{ mr: 1 }} />
        {paymentTableColumns.map((column, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={`${100 / (paymentTableColumns.length + 1)}%`}
            height={40}
            sx={{ mr: 1 }}
          />
        ))}
      </Box>

      {/* Data Rows - Generate 5 skeleton rows */}
      {[...Array(5)].map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex", mb: 1 }}>
          <Skeleton
            variant="rectangular"
            width={28}
            height={24}
            sx={{ mr: 1 }}
          />
          {paymentTableColumns.map((column, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / (paymentTableColumns.length + 1)}%`}
              height={40}
              sx={{ mr: 1 }}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

// SideBarSkeleton component for the sidebar list items
const SideBarSkeleton = () => {
  const paymentListColumns = [
    { width: "40%" }, // Payment number/ID
    { width: "30%" }, // Amount
    { width: "30%" }, // Date
  ];

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      {/* Generate 10 skeleton rows */}
      {[...Array(10)].map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ p: 1, mb: 1 }}>
          {/* First row in each item */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            {paymentListColumns.map((col, colIndex) => (
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

// ContentSkeleton component for the main content area
const ContentSkeleton = () => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Header section */}
      <Box sx={{ mb: 3 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Main content sections */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* First section */}
        <Box>
          <Skeleton variant="text" width="30%" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={120} />
        </Box>

        {/* Second section */}
        <Box>
          <Skeleton variant="text" width="35%" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={180} />
        </Box>

        {/* Third section */}
        <Box>
          <Skeleton variant="text" width="25%" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={150} />
        </Box>
      </Box>
    </Box>
  );
};

const Page = () => {
  const [statusOptions, setStatusOptions] = useState(paymentStatusOptions);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [paymentList, setPaymentList] = useState([]);
  const [theFilteredArray, setTheFilteredArray] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(null);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("vendor_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const [filterBy, setFilterBy] = useState("Status.All");

  useEffect(() => {
    getPayments(filterBy, sortColumn, sortOrder);
  }, []);

  const getPayments = async (filter, sort_column, sort_order) => {
    setLoading(true);
    let OrgId = localStorage.getItem("organization_id");
    let params = {
      method: "GET",
      url: `api/v1/payments/getall?organization_id=${OrgId}`,
      customBaseUrl: config.PO_Base_url,
      params: {
        page: page.current,
        limit: limit.current,
        sort_column: sort_column,
        sort_order: sort_order,
        filter: filter,
      },
    };
    try {
      // Add a short delay to show the skeleton loader (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await apiService(params);
      if (response.statusCode === 200) {
        const payments = response.data.data;
        setPaymentList(payments);
        setTheFilteredArray(payments);
        console.log(payments, "The Payment Data we Received");
      }
    } catch (error) {
      console.error("Error fetching Payments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setAnchorEl(null);

    if (paymentList && paymentList.length > 0) {
      let filtered = [];

      switch (status.title) {
        case "All Payments":
          filtered = [...paymentList];
          break;
        case "Advance Payments":
          filtered = paymentList.filter(
            (expense) => expense.status_type === "Advance Payments"
          );
          break;
        case "Billable Payments":
          filtered = paymentList.filter(
            (expense) => expense.status_type === "Billable Payments"
          );
          break;
        case "Paid via Check":
          filtered = paymentList.filter(
            (expense) => expense.status_type === "Paid via Check"
          );
          break;
        default:
          filtered = [...paymentList];
      }

      setTheFilteredArray(filtered);
    }
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
    const activeID = pathname.split("/")[3];

    // Ensure we create a new array to avoid mutating state
    const newArray = theFilteredArray.map((item) => ({
      ...item,
      isActive: item.bill_number === activeID ? true : item.isActive,
    }));

    router.push(`/purchase/paymentmade/${key.payment_id}`);
  };

  const handleRowClick = (row) => {
    return;
  };

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
          }}
        >
          {/* SideBarHeader */}
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
              borderBottom: "1px solid #e0e0e0",
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
                  fontSize: "30px",
                  marginLeft: "1px",
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
                  marginRight: "10px",
                  borderRadius: "5px",
                }}
                onClick={() => router.push("/purchase/paymentmade/create")}
              >
                <AddOutlined sx={{ fontSize: "16px" }} />{" "}
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
                      setSubmenuAnchorEl(null);
                    }}
                    onClick={() => {
                      if (!item.submenu) handleMenuItemClick(item.text);
                    }}
                    sx={{
                      backgroundColor:
                        menuAnchorEl && item.submenu
                          ? "primary.main"
                          : "transparent",
                      color:
                        menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                      borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
                      "& .menu-icon": {
                        color:
                          menuAnchorEl &&
                          item.submenu &&
                          "menu.text.normal !important",
                      },
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "menu.text.normal",
                        borderRadius: "5px",
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
                        {item.icon}
                        <Typography
                          sx={{
                            ml: item.iconPosition === "right" ? 0 : 2,
                            fontSize: "13px",
                            fontWeight: item.hasArrow ? 500 : 400,
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                      {item.hasArrow && <ChevronRight className="menu-icon" />}
                    </Box>
                    {/* Submenu */}
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
                            ml: "",
                            fontSize: "12px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
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
                              getPayments(filterBy, subItem.key, subItem.order); // default order
                            }}
                            selected={sortColumn === subItem.key}
                            sx={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 1,
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
                                subItem.order = newOrder; // mutate local config or handle externally
                                setSortOrder(newOrder);
                                setSortColumn(subItem.key);
                                setSubmenuAnchorEl(null);
                                setMenuAnchorEl(null);
                                getPayments(filterBy, subItem.key, newOrder);
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
          <Box sx={{ overflowY: "auto" }}>
            {loading ? (
              <SideBarSkeleton />
            ) : (
              <SideBarTable
                staticData={theFilteredArray}
                handleSelectRow={handleSelectRow}
                onRowClick={handleRowClick}
                type={"Payment"}
                setSelectedValue={setSelectedValue}
              />
            )}
          </Box>
        </Box>

        {/* Main content with skeleton loading state */}
        <Box sx={{ flexGrow: 1 }}>
          {loading ? <ContentSkeleton /> : <PaymentViewComponent />}
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
