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
    label: "Draft",
    value: "Status.Draft",
    key: "Draft ",
    empty_msg: "There are no draft items for this filter",
    column_orientation_type: "wrap",
  },
  // {
  //   id: "3",
  //   isFavorite: false,
  //   label: "Locked",
  //   value: "Status.Locked",
  //   key: "Locked invoices",
  //   empty_msg: "There are no locked items for this filter",
  //   column_orientation_type: "wrap",
  // },
  // {
  //   id: "4",
  //   isFavorite: false,
  //   label: "Pending Approval",
  //   value: "Status.Pending",
  //   key: "Pending Approval invoices",
  //   empty_msg: "There are no pending approval items for this filter",
  //   column_orientation_type: "wrap",
  // },
  {
    id: "5",
    isFavorite: false,
    label: "Approved",
    value: "Status.Approved",
    key: "Approved invoices",
    empty_msg: "There are no approved items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Customer Viewed",
    value: "Status.Viewed",
    key: "Customer Viewed invoices",
    empty_msg: "There are no customer viewed items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    isFavorite: false,
    label: "Partially Paid",
    value: "Status.Partially_Paid",
    key: "Partially Paid invoices",
    empty_msg: "There are no partially paid items for this filter",
    column_orientation_type: "wrap",
  },
  // {
  //   id: "8",
  //   isFavorite: false,
  //   label: "Unpaid",
  //   value: "Status.Unpaid",
  //   key: "Unpaid invoices",
  //   empty_msg: "There are no unpaid items for this filter",
  //   column_orientation_type: "wrap",
  // },
  // {
  //   id: "9",
  //   isFavorite: false,
  //   label: "Overdue",
  //   value: "Status.Overdue",
  //   key: "Overdue invoices",
  //   empty_msg: "There are no overdue items for this filter",
  //   column_orientation_type: "wrap",
  // },
  // {
  //   id: "10",
  //   isFavorite: false,
  //   label: "Payment Initiated",
  //   value: "Status.PaymentInitiated",
  //   key: "Payment Initiated invoices",
  //   empty_msg: "There are no payment initiated items for this filter",
  //   column_orientation_type: "wrap",
  // },
  {
    id: "11",
    isFavorite: false,
    label: "Paid",
    value: "Status.Paid",
    key: "Paid invoices",
    empty_msg: "There are no paid items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "12",
    isFavorite: false,
    label: "Void",
    value: "Status.Void",
    key: "Void invoices",
    empty_msg: "There are no void items for this filter",
    column_orientation_type: "wrap",
  },
  // {
  //   id: "13",
  //   isFavorite: false,
  //   label: "Debit Note",
  //   value: "Status.DebitNote",
  //   key: "Debit Note invoices",
  //   empty_msg: "There are no debit note items for this filter",
  //   column_orientation_type: "wrap",
  // },
  // {
  //   id: "14",
  //   isFavorite: false,
  //   label: "Write Off",
  //   value: "Status.WriteOff",
  //   key: "Write Off invoices",
  //   empty_msg: "There are no write off items for this filter",
  //   column_orientation_type: "wrap",
  // },
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
      { key: "date", label: "Date", order: "D" },
      { key: "invoice_number", label: "Invoice#", order: "D" },
      { key: "reference_number", label: "Order Number", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "due_date", label: "Due Date", order: "D" },
      { key: "total", label: "Invoice Amount", order: "D" },
      { key: "balance", label: "Balance", order: "D" },
    ],
  },
  {
    text: "Import Invoices",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Invoices",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export as E-way Bill",
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
    text: "Import Debit Notes",
    icon: <Download className="menu-icon" />,
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
  { key: "date_formatted", label: "DATE" },
  { key: "invoice_number", label: "INVOICE#" },
  { key: "reference_number", label: "ORDER NUMBER" },
  { key: "customer_name", label: "CUSTOMER NAME" },
  { key: "status_formatted", label: "STATUS" },
  { key: "due_date_formatted", label: "DUE DATE" },
  { key: "total_formatted", label: "AMOUNT" },
  { key: "balance_formatted", label: "BALANCE DUE" },
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

// Updated Customer component
const Customer = () => {
  const [invoiceList, setInvoiceList] = useState([]);
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
  const [welcomePg, setWelcomPg] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const [open, setOpen] = useState(false);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  // Compute whether all rows are selected
  const allSelected =
    selected.length === invoiceList.length && invoiceList.length !== 0;
  // Compute whether some rows are selected but not all
  const someSelected =
    selected.length > 0 && selected.length < invoiceList.length;
  const handleRowClick = (customer) => {
    router.push(`/sales/invoices/${customer.invoice_id}`);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(invoiceList.map((row) => row._id));
    }
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
    fetchInvoiceList(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    console.log("Selected menu item:", item);
    if (item === "Export Invoices") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchInvoiceList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchInvoiceList(filterBy, sortCol, sortOrd);
  };

  const organization_id = localStorage.getItem("organization_id");
  const fetchInvoiceList = async (filterValue, sort_column, sort_order) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          filter_by: filterValue,
          page: page.current,
          per_page: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current,
          organization_id: organization_id,
        },
        url: `/api/v1/invoices`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      // method: "GET",
      // url: `/api/v1/invoices?organization_id=${organization_id}&page=1&limit=25&sort_column=created_time&sort_order=D`,
      // customBaseUrl: config.SO_Base_url,
      // file: false,

      const data = response.data.invoices;

      if (filterValue === "Status.All" && data.length === 0) {
        setWelcomPg(true);
      }
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      setInvoiceList(data);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
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
                      color="primary"
                      style={{
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      {selectedType} Invoices
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
                        onClick={() => router.push("/sales/invoices/new")}
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
                                menuAnchorEl && item.submenu
                                  ? "menu.text.normal"
                                  : "",
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
                                        backgroundColor:
                                          "primary.main !important",
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
                        open={open}
                        moduleName="Invoices"
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
            {/* Use the CustomizedTable component with updated props */}
            {!welcomePg ? (
              <>
                {loading ? (
                  dotsAndSkeleton > 1 && <TableSkeleton columns={columns} />
                ) : (
                  <CustomizedTable
                    columns={columns}
                    staticData={invoiceList}
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
                    value="invoice"
                    callBackAPI={handleFetchTable} // pagination key
                    selectedType={selectedKey}
                    someSelected={someSelected} // Pass this additional prop
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
            ) : (
              <WelcomePage />
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

export default Customer;
