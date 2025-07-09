"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Skeleton,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  InputBase,
  InputAdornment,
  ButtonGroup,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import SearchModal from "../../common/searchModal";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useRouter } from "next/navigation";
import apiService from "../../../../src/services/axiosService";
import DotLoader from "../../../components/DotLoader";
import WelcomePage from "./homepage/page";
import config from "../../../../src/services/config";
import CustomizedTable from "../../common/table";
import {
  ChevronRight,
  Download,
  MonitorCog,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../common/export/ExportModal";
import CustomFilterMenu from "../../common/customFilterMenu";
import { useSnackbar } from "../../../components/SnackbarProvider";

const TableSkeleton = () => {
  const columns = [
    { key: "customer_name", label: "CUSTOMER NAME" },
    { key: "recurrence_name", label: "PROFILE NAME" },
    { key: "frequency", label: "FREQUENCY#" },
    { key: "next_invoice_date", label: " NEXT INVOICE DATE" },
    { key: "status_formatted", label: "STATUS" },
    { key: "total_formatted", label: "AMOUNT" },
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

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Active",
    value: "Status.Active",
    key: "Active",
    empty_msg: "There are no active items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Stopped",
    value: "Status.Stopped",
    key: "Stopped invoices",
    empty_msg: "There are no Stopped invoices for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Expired",
    value: "Status.Expired",
    key: "Expired invoices",
    empty_msg: "There are no Expired invoices for this filter",
    column_orientation_type: "wrap",
  },
];

const dummyFavorites = [];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "customer_name", label: "Customer Name", order: "A" },
      { key: "recurrence_name", label: "Profile Name", order: "A" },
      { key: "next_invoice_date", label: "Next Invoice Date", order: "A" },
      { key: "amount", label: "Amount", order: "A" },
    ],
  },
  {
    text: "Import  Recurring Invoices",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export ",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
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
    border: false,
  },
  {
    text: "Configure Online Payments",
    icon: <MonitorCog className="menu-icon" />,
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
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "customer_name", label: "CUSTOMER NAME" },
  { key: "recurrence_name", label: "PROFILE NAME" },
  { key: "recurrence_frequency", label: "FREQUENCY#" },
  { key: "next_invoice_date", label: " NEXT INVOICE DATE" },
  { key: "status", label: "STATUS" },
  { key: "total_formatted", label: "AMOUNT" },
];

const SelectionToolbar = ({ selectedCount, onClearSelection }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "5px",
        bgcolor: "#ffffff", // Grey background
        borderBottom: "1px solid #e0e0e0",
        px: 2,
        py: 1,
      }}
    >
      <Button
        variant="text"
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: "#333",
          mr: 1,
          border: "1px solid #ddd",
          bgcolor: "#f5f5f5",
          "&:hover": { bgcolor: "#f5f5f5" },
        }}
      >
        Mark As Sent
      </Button>

      <Button
        variant="text"
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: "#333",
          mr: 1,
          border: "1px solid #ddd",
          bgcolor: "#f5f5f5",
          "&:hover": { bgcolor: "#f5f5f5" },
        }}
      >
        Associate with Sales Orders
      </Button>

      <ButtonGroup
        sx={{
          bgcolor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: 1,
          overflow: "hidden",
          height: 28, // Reduce height
        }}
      >
        <IconButton sx={{ p: 2, height: 24, width: 24 }}>
          <PictureAsPdfRoundedIcon fontSize="small" />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton sx={{ p: 2, height: 24, width: 24 }}>
          <FolderZipOutlinedIcon fontSize="small" />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton sx={{ p: 2, height: 24, width: 24 }}>
          <LocalPrintshopOutlinedIcon fontSize="small" />
        </IconButton>
      </ButtonGroup>

      <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
        <Button
          variant="outlined"
          size="small"
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            textTransform: "none",
            borderColor: "#ddd",
            color: "#333",
            mr: 1,
            paddingLeft: "8px",
            bgcolor: "#f5f5f5",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Send
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none",
            borderColor: "#ddd",
            color: "#333",
            mr: 1,
            bgcolor: "#f5f5f5",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Bulk Update
        </Button>

        <IconButton
          size="small"
          sx={{ bgcolor: "#f5f5f5", border: "1px solid #ddd" }}
        >
          <MoreVertIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "black",
            fontWeight: 500,
            "& .dot": {
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              mr: 1,
            },
          }}
        >
          <span className="dot"></span>
          <Typography variant="body2" fontWeight={500}>
            {selectedCount} Invoice(s) Selected
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const RecurringInvoicePage = () => {
  const [recurringinvoiceList, setRecurringInvoiceList] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedKey, setSelectedKey] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [filterBy, setFilterBy] = useState("Status.All");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [welcomePg, setWelcomePg] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const [open, setOpen] = useState(false);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("A");
  let submenuCloseTimeout = useRef(null);
  const { showMessage } = useSnackbar();

  // Add export modal state and handlers
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleExportModalOpen = () => {
    setExportModalOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalOpen(false);
  };

  // Compute whether all rows are selected
  const allSelected =
    selected.length === recurringinvoiceList.length &&
    recurringinvoiceList.length !== 0;
  // Compute whether some rows are selected but not all
  const someSelected =
    selected.length > 0 && selected.length < recurringinvoiceList.length;

  const handleRowClick = (invoice) => {
    router.push(`/sales/recurringInvoice/${invoice.recurringinvoice_id}`);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(recurringinvoiceList.map((row) => row._id));
    }
  };

  // Handle individual row checkbox
  const handleSelectRow = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelected([]);
  };

  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const handleSelect = (type, value, key) => {
    let displayType = type;
    if (value === "Status.All") {
      displayType = "All";
    } else if (value === "Status.Expired") {
      displayType = "Expired";
    } else if (value === "Status.Active") {
      displayType = "Active";
    } else if (value === "Status.Stopped") {
      displayType = "Stopped";
    }
    
    setSelectedType(displayType);
    setSelectedKey(key);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchInvoiceList(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    console.log("Selected menu item:", item);
    if (item === "Export ") {
      handleExportModalOpen();
    } else if (item === "Refresh List") {
      refreshList();
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    refreshList();
  }, [filterBy]);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchInvoiceList(filterBy, sortCol, sortOrd);
  };

  const organization_id = localStorage.getItem("organization_id");
  const fetchInvoiceList = async (filterValue, sort_column, sort_order) => {
    setLoading(true);
    try {
      let filterParam = filterValue;
      if (filterValue === "Status.All") filterParam = "";
      if (filterValue === "Status.Expired") filterParam = "Status.Expired";
      
      const response = await apiService({
        method: "GET",
        url: `/api/v1/RecurringInvoices/getall`,
        params: {
          filter: filterParam,
          page: page.current,
          per_page: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current,
          organization_id: organization_id,
        },
        customBaseUrl: config.SO_Base_url,
      });

      if (!response.data) {
        throw new Error("No data received from the server");
      }

      // Get the data from the response
      const data = response.data.recurring_invoices || [];
      const totalCount = response.data.totalCount || 0;
      const hasMore = response.data.page_context?.has_more_page || false;

      // Format the data to match the table columns
      const formattedData = data.map((invoice) => {
        // Format the frequency display
        let frequencyDisplay = "N/A";
        if (invoice.recurrence_frequency) {
          const frequency = invoice.recurrence_frequency.toLowerCase();
          const repeatEvery = invoice.repeat_every || 1;

          switch (frequency) {
            case "week":
              frequencyDisplay =
                repeatEvery === 1 ? "Weekly" : `Every ${repeatEvery} weeks`;
              break;
            case "month":
              frequencyDisplay =
                repeatEvery === 1 ? "Monthly" : `Every ${repeatEvery} months`;
              break;
            case "year":
              frequencyDisplay =
                repeatEvery === 1 ? "Yearly" : `Every ${repeatEvery} years`;
              break;
            case "day":
              frequencyDisplay =
                repeatEvery === 1 ? "Daily" : `Every ${repeatEvery} days`;
              break;
            default:
              frequencyDisplay = "N/A";
          }
        }

        // Ensure we have all required fields
        const formattedInvoice = {
          ...invoice,
          recurringinvoice_id: invoice.recurring_invoice_id || invoice._id,
          customer_name: invoice.customer_name || "N/A",
          recurrence_name:
            invoice.recurrence_name || invoice.profile_name || "N/A",
          frequency: frequencyDisplay,
          next_invoice_date: invoice.next_invoice_date_formatted || "N/A",
          status_formatted: invoice.status_formatted || "N/A",
          total_formatted: invoice.total_formatted || "₹0.00",
          date_formatted: invoice.date_formatted || "N/A",
          reference_number: invoice.reference_number || "",
          recurrence_status: invoice.recurrence_status || "N/A",
        };

        return formattedInvoice;
      });

      
      if (formattedData.length === 0 && filterParam === "") {
        setWelcomePg(true);
      } else {
        setWelcomePg(false);
      }

      setDotsAndSkeleton(dotsAndSkeleton + 1);
      setRecurringInvoiceList(formattedData);
      setTotalCount(totalCount);
      setHasMore(hasMore);
    } catch (error) {
      console.error("Failed to fetch recurring invoice list:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to fetch recurring invoice list",
        "error"
      );
      setRecurringInvoiceList([]);
      setTotalCount(0);
      setHasMore(false);
      setWelcomePg(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
  };

  const refreshList = () => {
    page.current = 1;
    limit.current = 10;
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
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
                {selected.length > 0 ? (
                  <SelectionToolbar
                    selectedCount={selected.length}
                    onClearSelection={handleClearSelection}
                  />
                ) : (
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
                    <Button
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      endIcon={
                        <KeyboardArrowDownIcon
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        />
                      }
                      color="black"
                      style={{
                        fontWeight: 700,
                        fontSize: "large",
                        textTransform: "none",
                      }}
                    >
                      {selectedType} Recurring Invoices
                    </Button>
                    <CustomFilterMenu
                      anchorEl={anchorEl}
                      handleClose={() => setAnchorEl(null)}
                      favoritesData={favorites}
                      filtersData={filters}
                      onSelect={handleSelect}
                      onFavoriteToggle={(filter) => {
                        const updatedFilters = filters.map((f) =>
                          f.id === filter.id
                            ? { ...f, isFavorite: !f.isFavorite }
                            : f
                        );
                        setFilters(updatedFilters);

                        const updatedFilter = updatedFilters.find(
                          (f) => f.id === filter.id
                        );
                        if (updatedFilter.isFavorite) {
                          setFavorites([...favorites, updatedFilter]);
                        } else {
                          setFavorites(
                            favorites.filter((f) => f.id !== filter.id)
                          );
                        }
                      }}
                      selectedType={selectedType}
                    />
                    <Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddOutlined />}
                        sx={{ mr: 1 }}
                        onClick={() =>
                          router.push("/sales/recurringInvoice/new")
                        }
                      >
                        New
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
                          sx: {
                            width: "200px",
                            height: "350px",
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
                              color:
                                menuAnchorEl && item.submenu ? "menu.text.normal" : "",
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
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
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
                                    boxShadow:
                                      "0px 2px 8px rgba(0, 0, 0, 0.15)",
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
                                      fetchInvoiceList(
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
                                        fetchInvoiceList(
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
                        open={exportModalOpen}
                        moduleName="Recurring Invoices"
                        onClose={handleExportModalClose}
                      />
                      <IconButton
                        sx={{
                          backgroundColor: "#ff9800",
                          color: "white",
                          borderRadius: 1,
                          "&:hover": { backgroundColor: "#e68900" },
                          fontSize: "13px",
                          width: "31px",
                          fontWeight: 800,
                        }}
                      >
                        ?
                      </IconButton>
                    </Box>
                  </Toolbar>
                )}
                <Divider />
              </>
            )}
            {welcomePg ? (
              <WelcomePage />
            ) : (
              <>
                {loading ? (
                  dotsAndSkeleton > 1 && <TableSkeleton columns={columns} />
                ) : (
                  <CustomizedTable
                    columns={columns}
                    staticData={recurringinvoiceList}
                    hasMore={hasMore} // pagination key
                    totalCount={totalCount} // pagination key
                    selected={selected}
                    handleSelectAll={handleSelectAll}
                    handleSelectRow={handleSelectRow}
                    allSelected={allSelected}
                    settingsAnchorEl={settingsAnchorEl}
                    handleSettingsClick={handleSettingsClick}
                    handleSettingsClose={handleSettingsClose}
                    selectedMenuItem={selectedMenuItem}
                    onRowClick={handleRowClick}
                    setSelectedMenuItem={setSelectedMenuItem}
                    handleOpenSearchDialog={handleOpenSearchDialog}
                    value="recurring_invoice"
                    callBackAPI={handleFetchTable} // pagination key
                    selectedType={selectedKey}
                    someSelected={someSelected}
                    page={page.current} // pagination key
                    limit={limitSet} // pagination key
                    limitValue={limit.current} // pagination key
                    loading={loading}
                    sortColumn={sortColumn} //sortby
                    sortOrder={sortOrder} //sortby
                    handleSort={handleSort} //sortby
                  />
                )}
              </>
            )}
          </Grid>
          <SearchModal
            open={openSearchDialog}
            onClose={handleCloseSearchDialog}
            onSearch={(searchData) => console.log("Search:", searchData)}
          />
        </Grid>
      )}
    </>
  );
};

export default RecurringInvoicePage;
