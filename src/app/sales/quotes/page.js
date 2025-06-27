"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Skeleton,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  InputBase,
  InputAdornment,
  ListItemIcon,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import CustomizedTable from "../../common/table";
import SearchModal from "../../common/searchModal";
import WelcomePage from "./homepage/page";
import { useRouter } from "next/navigation";
import config from "../../../../src/services/config";
import apiService from "../../../../src/services/axiosService";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import DotLoader from "../../../components/DotLoader";
import ExportModal from "../../common/export/ExportModal";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import CustomFilterMenu from "../../common/customFilterMenu";
import QuotesHomePage from "./homepage/page";

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All",
    value: "Status.All",
    key: "Quotes",
    empty_msg: "There are no items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Draft",
    value: "Status.Draft",
    key: "Drafted Quotes",
    empty_msg: "There are no draft items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Pending Approval",
    value: "Status.PendingApproval",
    key: "Pending Approval quotes",
    empty_msg: "There are no pending approval items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Approved",
    value: "Status.Approved",
    key: "Approved quotes",
    empty_msg: "There are no approved items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Sent",
    value: "Status.Sent",
    key: "Sent quotes",
    empty_msg: "There are no sent items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Customer Viewed",
    value: "Status.CustomerViewed",
    key: "Customer Viewed quotes",
    empty_msg: "There are no customer viewed items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    isFavorite: false,
    label: "Accepted",
    value: "Status.Accepted",
    key: "Accepted quotes",
    empty_msg: "There are no accepted items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "8",
    isFavorite: false,
    label: "Invoiced",
    value: "Status.Invoiced",
    key: "Invoiced quotes",
    empty_msg: "There are no invoiced items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "9",
    isFavorite: false,
    label: "Declined",
    value: "Status.Declined",
    key: "Declined quotes",
    empty_msg: "There are no declined items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "10",
    isFavorite: false,
    label: "Expired",
    value: "Status.Expired",
    key: "Expired quotes",
    empty_msg: "There are no expired items for this filter",
    column_orientation_type: "wrap",
  },
];

const TableSkeleton = () => {
  const columns = [
    { key: "date_formatted", label: "DATE" },
    { key: "account_name", label: "EXPENSE ACCOUNT" },
    { key: "invoice_number", label: "REFERENCE#" },
    { key: "vendor_name", label: "VENDOR NAME" },
    { key: "paid_through_account_id", label: "PAID THROUGH" },
    { key: "client_name", label: "CUSTOMER NAME" },
    { key: "status_text", label: "STATUS" },
    { key: "amount_formatted", label: "AMOUNT" },
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

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [];

// Updated menuItems with icons
const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "date", label: "Date", order: "D" },
      { key: "estimate_number", label: "Quote Number", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "total", label: "Amount", order: "D" },
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "updateAt", label: "Last Modified Time", order: "D" },
    ],
  },
  {
    text: "Import Quotes",
    icon: <Download className="menu-icon" />,
    route: "/import-files",
    query: { type: "quote" },
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Quotes",
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
  // { text: "Import Debit Notes", icon: <ReceiptIcon className="menu-icon" /> },
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
  // { text: "Configure Online Payments", icon: <PaymentIcon className="menu-icon" /> },
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
  { key: "date_formatted", label: "DATE" },
  { key: "estimate_number", label: "QUOTE NUMBER" },
  // { key: "reference_number", label: "REFERENCE NUMBER" },
  { key: "customer_name", label: "CUSTOMER NAME" },
  { key: "status_formatted", label: "QUOTE STATUS" },
  { key: "total_formatted", label: "TOTAL" },
  // { key: "receivablesBCY", label: "RECEIVABLES (BCY)" },
];

const SelectionToolbar = ({ selectedCount, onClearSelection }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        bgcolor: "#f5f5f5", // Grey background
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
          bgcolor: "white",
          "&:hover": { bgcolor: "#f8f8f8" },
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
          bgcolor: "white",
          "&:hover": { bgcolor: "#f8f8f8" },
        }}
      >
        Associate with Sales Orders
      </Button>

      <IconButton
        size="small"
        sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}
      >
        <FileDownloadIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}
      >
        <FileUploadIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}
      >
        <ReceiptIcon fontSize="small" />
      </IconButton>

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
            bgcolor: "white",
            "&:hover": { bgcolor: "#f8f8f8" },
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
            bgcolor: "white",
            "&:hover": { bgcolor: "#f8f8f8" },
          }}
        >
          Bulk Update
        </Button>

        <IconButton
          size="small"
          sx={{ bgcolor: "white", border: "1px solid #ddd" }}
        >
          <MoreVertIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "primary.main",
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
            {selectedCount} Quote(s) Selected
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Only modify the Customer component to include the SelectionToolbar
const Quotes = () => {
  // Existing state variables and functions
  const [quoteList, setQuoteList] = useState([]);
  const [selectedType, setSelectedType] = useState("All Quotes");
  const [selectedKey, setSelectedKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [welcomePg, setWelcomPg] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isZoho, setIsZoho] = useState(true);
  const [open, setOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  // Compute whether all rows are selected
  const allSelected =
    quoteList.length > 0 && selected.length === quoteList.length;
  // Compute whether some rows are selected but not all
  const someSelected = selected.length > 0 && !allSelected;

  const handleRowClick = (customer) => {
    router.push(`/sales/quotes/${customer.quote_id}`);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(quoteList.map((row) => row._id));
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchQuoteList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchQuoteList(filterBy, sortColumn, sortOrder);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle individual row checkbox
  const handleSelectRow = (id, event) => {
    // Prevent row click event when clicking on the checkbox
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
    setSelectedType(type);
    setSelectedKey(key);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchQuoteList(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    console.log("Selected menu item:", item);
    const OrgId = localStorage.getItem("organization_id");
    if (item.route === "/import-files") {
      router.push(`/import-files?type=quote&organization_id=${OrgId}`);
    }
    if (item.text === "Export Quotes") {
      setOpen(true);
    } else if (item.text === "Refresh List") {
      fetchQuoteList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    router.push("/tally/creation");
  };

  useEffect(() => {
    fetchQuoteList(filterBy, sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchQuoteList(filterBy, sortCol, sortOrd);
  };

  const organization_id = localStorage.getItem("organization_id");
  const fetchQuoteList = async (filterValue = "", sort_column, sort_order) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: page.current,
          per_page: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current,
          organization_id: organization_id,
        },
        url: `/api/v1/estimates`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      const data = response.data.estimates;
      if (filterValue === "Status.All" && data.length === 0) {
        setWelcomPg(true);
      }
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      setQuoteList(data);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
      setLoading(false);
    }
  };
  return (
    <>
      {loading && dotsAndSkeleton === 0 ? (
        <DotLoader />
      ) : (
        <Grid container>
          <Grid
            bgcolor="white"
            items
            md={12}
            sx={{ height: "100vh", overflow: "hidden" }}
          >
            {welcomePg ? (
              <></>
            ) : (
              <>
                {selected.length > 0 ? (
                  // Show selection toolbar when items are selected
                  <SelectionToolbar
                    selectedCount={selected.length}
                    onClearSelection={handleClearSelection}
                  />
                ) : (
                  // Show regular toolbar when no items are selected
                  <Toolbar
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0px",
                      position: "sticky",
                      top: 0,
                      zIndex: 1000,
                      overflowY: "hidden",
                      backgroundColor: "white",
                      height: "64px",
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
                      {selectedType}
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          height: "32px",
                          padding: "0 8px",
                        }}
                        onClick={toggleMode}
                      >
                        {isZoho ? (
                          <ToggleOnIcon
                            sx={{ color: "#336699", fontSize: 32 }}
                          />
                        ) : (
                          <ToggleOffIcon sx={{ color: "#888", fontSize: 32 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            ml: 1,
                            color: "#333",
                            fontSize: "14px",
                            fontWeight: "bold",
                            // lineHeight: "32px",
                          }}
                        >
                          {"Zoho"}
                        </Typography>
                      </div>
                      <Button
                        variant="contained"
                        // className="button-submit"
                        size="small"
                        startIcon={<AddOutlined />}
                        sx={{ mr: 1 }}
                        onClick={() => router.push("/sales/quotes/new")}
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
                            width: "190px",
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
                                      fetchQuoteList(
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
                                        fetchQuoteList(
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
                        moduleName="Quotes"
                        onClose={handleClose}
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
            {/* Use the existing CustomizedTable component with updated props */}
            {!welcomePg ? (
              <>
                {loading ? (
                  dotsAndSkeleton > 0 && <TableSkeleton columns={columns} />
                ) : (
                  <CustomizedTable
                    columns={columns}
                    staticData={quoteList}
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
                    value="estimate"
                    selectedType={selectedKey}
                    someSelected={someSelected} // Pass this additional prop
                    callBackAPI={handleFetchTable} // pagination key
                    page={page.current} // pagination key
                    limit={limitSet} // pagination key
                    limitValue={limit.current} // pagination key
                    hasMore={hasMore} // pagination key
                    totalCount={totalCount} // pagination key
                    loading={loading}
                    sortColumn={sortColumn} //sortby
                    sortOrder={sortOrder} //sortby
                    handleSort={handleSort} //sortby
                  />
                )}
              </>
            ) : (
              <QuotesHomePage />
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
export default Quotes;
