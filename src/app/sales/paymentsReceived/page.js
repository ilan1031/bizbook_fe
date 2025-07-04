"use client";
import { useState, useRef, useEffect } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Skeleton,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  InputBase,
  InputAdornment,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import SortIcon from "@mui/icons-material/Sort";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PaymentIcon from "@mui/icons-material/Payment";
import RefreshIcon from "@mui/icons-material/Refresh";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import CustomizedTable from "../../common/table";
import SearchModal from "../../common/searchModal";
import { useRouter } from "next/navigation";
import apiService from "../../../../src/services/axiosService";
import config from "../../../../src/services/config";
import DotLoader from "../../../components/DotLoader";
import CustomFilterMenu from "../../common/customFilterMenu";
import PaymentReceivedHomePage from "./homepage/page";
import {
    
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../common/export/ExportModal";

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All Payments",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no items for this filter",
    column_orientation_type: "wrap",
  },
   
  {
    id: "2",
    isFavorite: false,
    label: "Invoice Payments",
    value: "invoice",
    key: "invoice payments",
    empty_msg: "There are no draft items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Customer Advance",
    value: "advance",
    key: "customer advance",
    empty_msg: "There are no draft items for this filter",
    column_orientation_type: "wrap",
  },
]
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
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "updateAt", label: "Last Modified Time", order: "D" },
      { key: "date", label: "Date", order: "D" },
      { key: "payment_id", label: "Payment#", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "payment_mode", label: "Mode", order: "D" },
      { key: "amount", label: "Amount", order: "D" },
      { key: "unused_amount", label: "Unused Amount", order: "D" },
    ],
  },
  {
    text: "Import payments",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export payments",
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
];

const columns = [
  { key: "date", label: "DATE" },
  { key: "quoteNumber", label: "QUOTE NUMBER" },
  { key: "referenceNumber", label: "REFERENCE NUMBER" },
  { key: "customerName", label: "CUSTOMER NAME" },
  { key: "status", label: "STATUS" },
  { key: "amount", label: "AMOUNT" },
  // { key: "receivablesBCY", label: "RECEIVABLES (BCY)" },
];

// Example static data for table rows
const staticData = [
  {
    key: "1",
    date: "2023-01-01",
    quoteNumber: "A12345",
    referenceNumber: "REF12345",
    customerName: "Ram",
    company: "",
    email: "abcde@zylker.com",
    phone: "+91-9870322457",
    placeOfSupply: "",
    amount: "₹16.50",
    amountBCY: "₹0.00",
    gstTreatment: "Registered Business - Regular",
    unusedCredits: "₹0.00",
    status: "Active",
  },
  {
    key: "2",
    date: "2023-01-02",
    quoteNumber: "B67890",
    referenceNumber: "REF67890",
    customerName: "Ganesh",
    company: "",
    email: "abcco@zylker.com",
    phone: "+1-5417543010",
    placeOfSupply: "",
    amount: "₹170",
    amountBCY: "₹1,706",
    gstTreatment: "Registered Business - Regular",
    unusedCredits: "₹0.00",
    status: "InActive",
  },
  {
    key: "3",
    date: "2023-01-03",
    quoteNumber: "C24680",
    referenceNumber: "REF24680",
    customerName: "Ethan",
    company: "ABC & Co.",
    email: "",
    phone: "",
    placeOfSupply: "",
    amount: "₹1.50",
    amountBCY: "₹10.00",
    gstTreatment: "Registered Business - Regular",
    unusedCredits: "₹0.00",
    status: "Active",
  },
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
        Associate with payment received
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
            {selectedCount} Invoice(s) Selected
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

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

// Only modify the Customer component to include the SelectionToolbar
const Customer = () => {
  // Existing state variables and functions
  // const [customerList, setCustomerList] = useState(staticData);
  const [selectedType, setSelectedType] = useState("All Received Payments");
  const [selectedKey, setSelectedKey] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [welcomePg, setWelcomPg] = useState(false);
  const [paymentReceivedList, setPaymentReceivedList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const router = useRouter();
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const [open, setOpen] = useState(false);

  // Compute whether all rows are selected
  const allSelected =
    paymentReceivedList.length > 0 &&
    selected.length === paymentReceivedList.length;
  // Compute whether some rows are selected but not all
  const someSelected = selected.length > 0 && !allSelected;

  const handleRowClick = (customer) => {
    router.push(`paymentsReceived/${customer.payment_id}`);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(paymentReceivedList.map((row) => row.id));
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
    setAnchorEl(null);
    setSelectedKey(key);
    page.current = 1;
    limit.current = 10;
    fetchPaymentReceivedList(value, sortColumn, sortOrder);
    setFilterBy(value);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    console.log("Selected menu item:", item);
    setMenuAnchorEl(null);
    if (item === "Export payments") {
      setOpen(true);
    }else if (item === "Refresh List") {
      fetchSalesOrderList(filterBy, sortColumn, sortOrder);
    }
  };

  useEffect(() => {
    fetchPaymentReceivedList(filterBy, sortColumn, sortOrder);
  }, []);

  const organization_id = localStorage.getItem("organization_id");

  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchPaymentReceivedList(filterBy, sortCol, sortOrd);
  };

  const fetchPaymentReceivedList = async (filter, sort_column, sort_order) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          page: page.current,
          organization_id: organization_id,
          per_page: limit.current,
          filter: filter,
          limit: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
        },
        url: `/api/v1/payment/getPaymentsReceived`,
        customBaseUrl: config.SO_Base_url,
      });

      console.log(response.data, "response data for Payment Received List");
      const data = response.data.payments;

      if (filter === "all" && data.length === 0) {
        setWelcomPg(true);
      }
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      setPaymentReceivedList(data);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payment received list:", error);
      setLoading(false);
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchPaymentReceivedList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchPaymentReceivedList(filterBy, sortColumn, sortOrder);
  };

  return (
    <>
      {loading && dotsAndSkeleton === 0 ? (
        <DotLoader />
      ) : (
        <Grid container>
          <Grid bgcolor="white" items md={12}>
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
                    <Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddOutlined />}
                        sx={{ mr: 1 }}
                        onClick={() =>
                          router.push(
                            "/sales/paymentsReceived/newPaymentReceived"
                          )
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
                            height: "280px",
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
                                      fetchPaymentReceivedList(
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
                                        fetchPaymentReceivedList(
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
                        moduleName="Payment Received"
                        onClose={()=>setOpen(false)}
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
                  dotsAndSkeleton > 1 && <TableSkeleton columns={columns} />
                ) : (
                  <CustomizedTable
                    columns={columns}
                    staticData={paymentReceivedList}
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
                    value="customer_payment"
                    callBackAPI={handleFetchTable}
                    hasMore={hasMore}
                    selectedType={selectedKey}
                    someSelected={someSelected}
                    page={page.current}
                    totalCount={totalCount}
                    limit={limitSet}
                    limitValue={limit.current}
                    loading={loading}
                    sortColumn={sortColumn} //sortby
                    sortOrder={sortOrder} //sortby
                    handleSort={handleSort} //sortby
                  />
                )}
              </>
            ) : (
              <PaymentReceivedHomePage />
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
