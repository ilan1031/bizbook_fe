"use client";
import { useEffect, useState, useRef } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  ListAlt,
} from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import SearchModal from "../../common/searchModal";
import CustomizedTable from "../../common/table";
import { useRouter } from "next/navigation";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import Button from "../../common/btn/Button";
import HelpAndSupport from "../../common/helpAndSupport/HelpAndSupport";
import ExportModal from "../../common/export/ExportModal";
import PurchaseOrderHomepage from "./homepage/page";
import DotLoader from "../../../components/DotLoader";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";

const purchaseStatusOptions = [
  {
    id: "1",
    default_customview_id: "23756000000057003",
    is_favorite: true,
    title: "All Purchase",
    value: "Status.All",
    key: "1",
    empty_msg: "There are no Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "23756790000000506",
    is_favorite: false,
    title: "Purchase Issued",
    value: "Status.Issued",
    key: "2",
    empty_msg: "There are no Purchase Issued Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "237567900000057006",
    is_favorite: false,
    title: "Purchase Closed",
    value: "Status.Closed",
    key: "3",
    empty_msg: "There are no overdue Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "237567900000057006",
    is_favorite: false,
    title: "Pending Approval",
    value: "Status.Pending",
    key: "4",
    empty_msg: "There are no Pending Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "237567900000057006",
    is_favorite: false,
    title: "Billed",
    value: "Status.Billed",
    key: "5",
    empty_msg: "There are no Billed Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "237567900000057006",
    is_favorite: false,
    title: "Partially Billed",
    value: "Status.Partially",
    key: "6",
    empty_msg: "There are no Partially Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    default_customview_id: "237567900000057006",
    is_favorite: false,
    title: "Canceled",
    value: "Status.Canceled",
    key: "7",
    empty_msg: "There are no Canceled Customers",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    iconPosition: "right",
    border: true,
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "date", label: "DATE", order: "D" },
      { key: "purchase_number", label: "Purchase Orde#", order: "D" },
      {
        key: "contact_name",
        label: "Vendor Name",
        order: "D",
      },
      { key: "total", label: "Amount", order: "D" },
      { key: "due_date", label: "Delivery Date", order: "D" },
      { key: "updatedAt", label: "Last Modified Time", order: "D" },
    ],
  },
  {
    text: "Import Purchase Orders",
    icon: <Download className="menu-icon" />,
    route: "/import-files",
    query: { type: "purchase-order" },
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Purchase Orders",
    icon: <Upload className="menu-icon" />,
    route: "/import-files",
    query: { type: "purchase-order" },
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Export Current View",
    icon: <Upload className="menu-icon" />,
    route: "/import-files",
    query: { type: "purchase-order" },
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    route: "/import-files",
    query: { type: "purchase-order" },
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAlt className="menu-icon" />,
    route: "/import-files",
    query: { type: "purchase-order" },
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

const columns = [
  { key: "date", label: "DATE" },
  { key: "purchase_number", label: "PURCHASE ORDER#" },
  { key: "reference_number", label: "REFERENCE#" },
  { key: "vendor_name", label: "VENDOR NAME" },
  { key: "status_type", label: "STATUS" },
  { key: "company_name", label: "COMPANY NAME" },
  { key: "total", label: "AMOUNT" },
  { key: "due_date", label: "DELIVERY DATE" },
];

// TableSkeleton component for loading state
const TableSkeleton = () => {
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

const PurchaseOrderList = () => {
  const [selectedType, setSelectedType] = useState("All Purchase");
  const [statusOptions, setStatusOptions] = useState(purchaseStatusOptions);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [purchaseOrderList, setPurchaseOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [theFilteredArray, setTheFilteredArray] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [totalRows, setTotalRows] = useState(0); // Total items in database
  const [sortField, setSortField] = useState("");
  const [open, setOpen] = useState(false); // State for ExportModal
  const [welcomePg, setWelcomePg] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const router = useRouter();
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("contact_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  // Group options by favorite status
  const favoriteOptions = statusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = statusOptions.filter((opt) => !opt.is_favorite);

  useEffect(() => {
    // Load favorites from localStorage
    try {
      const savedStatusOptions = localStorage.getItem("purchaseStatusOptions");
      if (savedStatusOptions) {
        setStatusOptions(JSON.parse(savedStatusOptions));
      }
    } catch (error) {
      console.error("Error loading status options from localStorage:", error);
      // Fall back to default options
    }

    const fetchData = async () => {
      try {
        // Add the 300ms delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 300));
        await getPurchaseOrder(filterBy, sortColumn, sortOrder);
      } catch (error) {
        setError("Failed to fetch purchase orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
  };

  const handleCloseHelp = () => {
    setIsHelpOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPurchaseOrder(filterBy, sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    getPurchaseOrder(filterBy, sortCol, sortOrd);
  };

  const getPurchaseOrder = async (filter, sort_column, sort_order) => {
    setLoading(true);
    const organization_id = localStorage.getItem("organization_id");
    try {
      if (!organization_id) {
        throw new Error("Organization ID not found in localStorage");
      }
      const response = await apiService({
        method: "GET",
        url: `/api/v1/purchaseorder/purchaseorders`,
        customBaseUrl: config.PO_Base_url,
        params: {
          org_id: organization_id,
          page: page.current,
          limit: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          filter_by: filter,
          // filter: filter,
        },
      });

      const data = response.data.data;

      if (filter === "Status.All" && (!data || data.length === 0)) {
        setWelcomePg(true);
      } else {
        setWelcomePg(false);
      }
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      setPurchaseOrderList(data);
      setTheFilteredArray(data);
      setTotalCount(response.data.pagination.totalCount);
      setTotalRows(response.data.pagination?.totalCount);
      setHasMore(response.data.pagination?.hasNextPage);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id, event) => {
    if (event) {
      event.stopPropagation();
    }

    const updatedOptions = statusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setStatusOptions(updatedOptions);

    // Save to localStorage
    try {
      localStorage.setItem(
        "purchaseStatusOptions",
        JSON.stringify(updatedOptions)
      );
    } catch (error) {
      console.error("Error saving status options to localStorage:", error);
    }
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setSelectedType(status.title);
    setFilterBy(status.value);
    getPurchaseOrder(status.value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewCustomView = (event) => {
    event.stopPropagation();
    console.log("Creating new custom view");
    setAnchorEl(null);
    // Implement new custom view functionality here
  };

  const handleMenuItemClick = (item) => {
    console.log("item handleMenuItemClick-------", item);
    const OrgId = localStorage.getItem("organization_id");

    if (item.route === "/import-files") {
      router.push(`/import-files?type=purchase-order&organization_id=${OrgId}`);
    }
    // Implement specific actions based on menu item
    if (item.text === "Export Purchase Orders") {
      setOpen(true);
    } else if (item.text === "Refresh List") {
      getPurchaseOrder(filterBy, sortColumn, sortOrder);
      
    }
    setMenuAnchorEl(null);
  };

  const allSelected =
    selected.length === purchaseOrderList.length &&
    purchaseOrderList.length !== 0;

  const handleRowClick = (customer) => {
    if (customer && customer.purchase_number) {
      router.push(`/purchase/purchaseorder/${customer.purchase_number}`);
    } else {
      console.error("Invalid purchase order data", customer);
    }
  };

  const someSelected =
    selected.length > 0 && selected.length < purchaseOrderList.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(purchaseOrderList.map((row) => row._id));
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

  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);

  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);

  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleSearch = (searchData) => {
    console.log("Search:", searchData);
    // Implement search functionality here
    handleCloseSearchDialog();
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    getPurchaseOrder(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    getPurchaseOrder(filterBy, sortColumn, sortOrder);
  };

  // Handle sorting
  // const handleSort = (field) => {
  //   const isAsc = sortField === field && sortOrder === "asc";
  //   setSortField(field);
  //   setSortOrder(isAsc ? "desc" : "asc");
  // };

  return (
    <>
      {loading && dotsAndSkeleton === 0 ? (
        <DotLoader />
      ) : (
        <Grid container>
          <Grid item xs={12} bgcolor="white">
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
                        startIcon={<AddOutlined />}
                        onClick={() =>
                          router.push("/purchase/purchaseorder/create")
                        }
                        size="small"
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
                          height: "275px",
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
                            if (!item.submenu) handleMenuItemClick(item);
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
                                    getPurchaseOrder(
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
                                      getPurchaseOrder(
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
                      moduleName="Purchase Order"
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
              </>
            )}

            {/* Error message display
        {error && (
          <Box sx={{ p: 2, color: "error.main", textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => getPurchaseOrder()}
            >
              Retry
            </Button>
          </Box>
        )} */}

            {/* Table with loading skeleton */}
            {welcomePg ? (
              <PurchaseOrderHomepage />
            ) : loading ? (
              dotsAndSkeleton > 0 && <TableSkeleton columns={columns} />
            ) : (
              <>
                <CustomizedTable
                  columns={columns}
                  staticData={theFilteredArray}
                  hasMore={hasMore} // pagination key
                  totalCount={totalCount} // pagination key
                  selected={selected}
                  handleSelectAll={handleSelectAll}
                  handleSelectRow={handleSelect}
                  allSelected={allSelected}
                  settingsAnchorEl={settingsAnchorEl}
                  handleSettingsClick={handleSettingsClick}
                  handleSettingsClose={handleSettingsClose}
                  selectedMenuItem={selectedMenuItem}
                  onRowClick={handleRowClick}
                  setSelectedMenuItem={setSelectedMenuItem}
                  handleOpenSearchDialog={handleOpenSearchDialog}
                  value="purchaseorder"
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
                />
              </>
              // )
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
};

export default PurchaseOrderList;
