"use client";
import React, { useEffect, useState, useRef } from "react";
import SearchModal from "../../common/searchModal";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Toolbar,
  Typography,
  Skeleton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  ListAlt,
} from "@mui/icons-material";
import Button from "../../common/btn/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExportModal from "../../common/export/ExportModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpAndSupport from "../../common/helpAndSupport/HelpAndSupport";
import CustomizedTable from "../../common/table";
import apiService from "../../../../src/services/axiosService";
import config from "../../../../src/services/config";
import DotLoader from "../../../components/DotLoader";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentmadeHomePage from "./homepage/page";

// TableSkeleton component for loading state
const TableSkeleton = () => {
  const columns = [
    { key: "date", label: "DATE" },
    { key: "payment_id", label: "PAYMENT#" },
    { key: "reference_number", label: "REFERENCE#" },
    { key: "vendor_name", label: "VENDOR NAME" },
    { key: "bill_numbers", label: "BILL NO" },
    { key: "payment_mode", label: "MODE" },
    { key: "amount_formatted", label: "AMOUNT" },
    { key: "paid_through_account_id", label: "Paid Through Account" },
  ];
  return (
    <Box sx={{ width: "100%", p: 1 }}>
      {/* Header Row */}
      <Box sx={{ display: "flex", mb: 1 }}>
        <Skeleton variant="rectangular" width={28} height={24} sx={{ mr: 1 }} />
        {columns.map((column, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={`${100 / (columns.length + 1)}%`}
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
          {columns.map((column, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / (columns.length + 1)}%`}
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

const paymentMadeOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Payments",
    value: "Status.All",
    key: "All Payments",
    empty_msg: "There are no Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "Advanced Payments",
    value: "Status.Advanced",
    key: "Advanced",
    empty_msg: "There are no Advanced Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Bill Payments",
    value: "Status.Inactive",
    key: "Inactive",
    empty_msg: "There are no Bill Payments",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Pay Via Check",
    value: "Status.Payviacheck",
    key: "Payviacheck",
    empty_msg: "There are no Bill Payviacheck",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "To Be Printed Checks",
    value: "Status.Printed",
    key: "Printed",
    empty_msg: "There are no Printed Checks",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Uncleared Checks",
    value: "Status.Uncleared",
    key: "Uncleared",
    empty_msg: "There are no Uncleared Checks",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Cleared Checks",
    value: "Status.Cleared",
    key: "Cleared",
    empty_msg: "There are no Cleared Checks",
    column_orientation_type: "wrap",
  },
  {
    id: "8",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Void Checks",
    value: "Status.Void",
    key: "Void",
    empty_msg: "There are no Void Checks",
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

const columns = [
  { key: "date_formatted", label: "DATE" },
  { key: "payment_id", label: "PAYMENT#" },
  { key: "reference_number", label: "REFERENCE#" },
  { key: "vendor_name", label: "VENDOR NAME" },
  { key: "bill_numbers", label: "BILL#" },
  { key: "payment_mode", label: "MODE" },
  { key: "amount_formatted", label: "AMOUNT" },
  { key: "paid_through_account_id", label: "Paid Through Account" },
  { key: "status_formatted", label: "STATUS" },
];

function PaymentMade() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState("All Payments");
  const [paymentMadeStatusOptions, setpaymentMadeStatusOptions] =
    useState(paymentMadeOptions);
  const [selectedStatus, setSelectedStatus] = useState(
    paymentMadeStatusOptions[0]
  );
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [error, setError] = useState(null);
  const [welcomePg, setWelcomePg] = useState(false);
  const [filteredBillDataDetails, setFilteredBillDataDetails] = useState([]);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [totalRows, setTotalRows] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paymentList, setPurchaseOrderList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const router = useRouter();
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("vendor_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  const favoriteOptions = paymentMadeStatusOptions.filter(
    (opt) => opt.is_favorite
  );
  const defaultOptions = paymentMadeStatusOptions.filter(
    (opt) => !opt.is_favorite
  );

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      getPaymentMade(filterBy, sortColumn, sortOrder);
    };

    fetchData();
  }, [page, rowsPerPage]);

  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);

  const handleSettingsClose = () => setSettingsAnchorEl(null);
  const handleOpenHelp = () => {
    setIsHelpOpen(true);
  };
  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRowClick = (row) => {
    router.push(`/purchase/paymentmade/${row.payment_id}`);
  };
  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);
  const handleSearch = (searchData) => {
    console.log("Search:", searchData);
    handleCloseSearchDialog();
  };

  useEffect(() => {
    getPaymentMade(filterBy, sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    getPaymentMade(filterBy, sortCol, sortOrd);
  };

  const getPaymentMade = async (filter, sort_column, sort_order) => {
    setLoading(true);
    // setError(null);
    const organization_id = localStorage.getItem("organization_id");
    try {
      const response = await apiService({
        method: "GET",
        params: {
          organization_id: organization_id,
          page: page.current,
          limit: limit.current,
          per_page: rowsPerPage,
          sort_column: sort_column,
          sort_order: sort_order,
          filter: filter,
        },
        url: `/api/v1/payments/getall`,
        customBaseUrl: config.PO_Base_url,
        file: false,
      });
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      const data = response.data.data;
      if (filter === "Status.All" && (!data || data.length === 0)) {
        setWelcomePg(true);
      } else {
        setWelcomePg(false);
      }
      setFilteredBillDataDetails(data);
      setPurchaseOrderList(data);
      setTotalCount(response.data.pagination.totalCount);
      setHasMore(response.data.pagination.hasNextPage);
      setPurchaseOrderList(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    getPaymentMade(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    getPaymentMade(filterBy, sortColumn, sortOrder);
  };

  const handleMenuItemClick = (item) => {
    if (item === "Refresh List") {
      getPaymentMade(filterBy, sortColumn, sortOrder);
    } else if (item === "Export Payments") {
      setOpen(true);
    }
    setMenuAnchorEl(null);
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    getPaymentMade(status.value, sortColumn, sortOrder);
    page.current = 1;
    limit.current = 10;
    setAnchorEl(null);
  };

  const allSelected =
    selected.length === paymentList.length && paymentList.length !== 0;
  const someSelected =
    selected.length > 0 && selected.length < paymentList.length;
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(paymentList.map((row) => row._id));
    }
  };

  const handleSelect = (id, event) => {
    if (event) {
      event.stopPropagation();
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setpaymentMadeStatusOptions(
      paymentMadeStatusOptions.map((option) =>
        option.id === id
          ? { ...option, is_favorite: !option.is_favorite }
          : option
      )
    );
  };

  const handleNewCustomView = () => {
    setAnchorEl(null);
  };

  // Status management functions
  const getStatusColor = (status) => {
    // Ensure status is a string and handle null/undefined
    const statusStr = String(status || "").toLowerCase();
    switch (statusStr) {
      case "draft":
      case "1":
        return "#94a5a6";
      case "paid":
      case "2":
        return "#1fcd6d";
      case "void":
      case "3":
        return "#474747";
      default:
        return "#474747";
    }
  };

  const getStatusText = (status) => {
    // Ensure status is a string and handle null/undefined
    const statusStr = String(status || "").toLowerCase();
    switch (statusStr) {
      case "draft":
      case "1":
        return "Draft";
      case "paid":
      case "2":
        return "Paid";
      case "void":
      case "3":
        return "Void";
      default:
        return "Draft";
    }
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      const org_id = localStorage.getItem("organization_id");

      if (!org_id || !paymentId) {
        console.error("Organization or Payment ID is missing");
        return;
      }

      const response = await apiService({
        method: "PUT",
        url: `/api/v1/payments/status?organization_id=${org_id}&payment_id=${paymentId}`,
        data: {
          status: newStatus,
          status_formatted: getStatusText(newStatus)
        },
        customBaseUrl: config.PO_Base_url,
      });

      if (response.statusCode === 200 || response.statusCode === true) {
        console.log(`Payment status updated to ${getStatusText(newStatus)}`);
        // Refresh payment list
        getPaymentMade(filterBy, sortColumn, sortOrder);
      } else {
        console.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <>
      {loading && dotsAndSkeleton === 0 ? (
        <DotLoader />
      ) : (
        <Grid container>
          <Grid bgcolor="white" item xs={12}>
            {welcomePg ? (
              <></>
            ) : (
              <>
                <Toolbar
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: "white",
                  }}
                >
                  <Box
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      color="black"
                      style={{
                        fontWeight: 500,
                        fontSize: "22px",
                        textTransform: "none",
                      }}
                    >
                      {selectedType}
                    </Typography>
                    <KeyboardArrowDownIcon />
                  </Box>

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
                                color: selectedStatus.id === option.id
                                    ? "menu.text.normal"
                                    : "menu.text.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                "&:hover": {
                                  backgroundColor: "primary.main",
                                  "& .MuiTypography-root":{
                                    color: "menu.text.normal",
                                  }
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight:
                                    selectedStatus.id === option.id ? 500 : 400,
                                  color: selectedStatus.id === option.id
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
                                  fontSize="small" sx={{ color: '#f3cf00' }}
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
                                color: selectedStatus.id === option.id
                                    ? "menu.text.normal"
                                    : "menu.text.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1,
                                "&:hover": {
                                  backgroundColor: "primary.main", // Hover effect color
                                  "& .MuiTypography-root":{
                                    color: "menu.text.normal",
                                  }
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

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box sx={{ mr: 0.5 }}>
                      <Button
                        variant="contained"
                        className="button-submit"
                        startIcon={<AddOutlined />}
                        onClick={() =>
                          router.push("/purchase/paymentmade/create")
                        }
                      >
                        New
                      </Button>
                    </Box>

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
                        sx: {
                          width: "200px",
                          height: "210px",
                          fontSize: "11px",
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                          borderRadius: "8px",
                          mt: 1,
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
                            color: menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                            borderRadius:
                              menuAnchorEl && item.submenu ? "5px" : "",
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
                            borderBottom: item.border
                              ? "1px solid #ddd"
                              : "none",
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
                            {item.hasArrow && (
                              <ChevronRight className="menu-icon" />
                            )}
                          </Box>
                          {/* Submenu */}
                          {item.submenu && (
                            <Menu
                              anchorEl={submenuAnchorEl}
                              open={Boolean(
                                submenuAnchorEl &&
                                  submenuAnchorEl.textContent.includes(
                                    item.text
                                  )
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
                                  submenuCloseTimeout.current = setTimeout(
                                    () => {
                                      setSubmenuAnchorEl(null);
                                    },
                                    200
                                  );
                                },
                                sx: {
                                  ml: "-195px",
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
                                    getPaymentMade(
                                      filterBy,
                                      subItem.key,
                                      subItem.order
                                    ); // default order
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
                                      getPaymentMade(
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
                    <ExportModal
                      open={open}
                      moduleName="Payment"
                      onClose={handleClose}
                    />
                    <IconButton
                      onClick={handleOpenHelp}
                      sx={{
                        backgroundColor: "#ff9800",
                        color: "white",
                        borderRadius: 1,
                        "&:hover": { backgroundColor: "#e68900" },
                        height: "35px",
                        width: "35px",
                      }}
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                    <HelpAndSupport
                      open={isHelpOpen}
                      onClose={handleCloseHelp}
                    />
                  </Box>
                </Toolbar>

                <Divider />

                {/* Error message display */}
                {error && (
                  <Box sx={{ p: 2, color: "error.main", textAlign: "center" }}>
                    <Typography color="error">{error}</Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() =>
                        getPaymentMade(filterBy, sortColumn, sortOrder)
                      }
                    >
                      Retry
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Use the skeleton loader when loading */}
            {welcomePg ? (
              <PaymentmadeHomePage />
            ) : loading ? (
              dotsAndSkeleton > 0 && <TableSkeleton columns={columns} />
            ) : (
              <>
                {!loading && (
                  <CustomizedTable
                    columns={columns}
                    staticData={filteredBillDataDetails}
                    hasMore={hasMore} // pagination key
                    totalCount={totalCount} // pagination key
                    selected={selected}
                    handleSelectAll={handleSelectAll}
                    handleSelectRow={handleSelect}
                    handleSelect={handleSelect}
                    allSelected={allSelected}
                    settingsAnchorEl={settingsAnchorEl}
                    handleSettingsClick={handleSettingsClick}
                    handleSettingsClose={handleSettingsClose}
                    selectedMenuItem={selectedMenuItem}
                    onRowClick={handleRowClick}
                    setSelectedMenuItem={setSelectedMenuItem}
                    handleOpenSearchDialog={handleOpenSearchDialog}
                    value="vendor_payment"
                    callBackAPI={handleFetchTable}
                    selectedType={selectedType}
                    someSelected={someSelected}
                    page={page.current}
                    limit={limitSet}
                    limitValue={limit.current}
                    loading={loading}
                    sortColumn={sortColumn} //sortby
                    sortOrder={sortOrder} //sortby
                    handleSort={handleSort} //sortby
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    handleStatusChange={handleStatusChange}
                  />
                )}
              </>
            )}
          </Grid>
          <SearchModal
            open={openSearchDialog}
            onClose={handleCloseSearchDialog}
            onSearch={handleSearch}
          />
        </Grid>
      )}
    </>
  );
}

export default PaymentMade;
