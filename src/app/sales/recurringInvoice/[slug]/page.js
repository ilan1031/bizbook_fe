"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  ListAlt,
} from "@mui/icons-material";
import InvoiceViewComponent from "../../../../../src/app/sales/invoices/InvoiceViewComponent";
import CustomFilterMenu from "../../../common/customFilterMenu";
import apiService from "../../../../../src/services/axiosService";
import config from "../../../../../src/services/config";
import SearchModal from "../../../common/searchModal";
import { useParams, useRouter } from "next/navigation";
import SalesSideTable from "../../../../../src/app/common/SalesSideTable";
import DotLoader from "../../../../components/DotLoader";
import RecordPayment from "../../../common/payment/PaymentForm";
import {
  ChevronRight,
  Download,
  MonitorCog,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../../common/export/ExportModal";
import CustomProfileView from "../../../common/viewRecurringInv/view";
import { useSnackbar } from "../../../../components/SnackbarProvider";

const dummyFavorites = [];
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

const RecurringInvoice = () => {
  const [customerList, setQuoteList] = useState([]);
  const [selectedType, setSelectedType] = useState("All Recurring Invoices");
  const [selectedKey, setSelectedKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [loadingView, setLoadingView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [visibleView, setVisibleView] = useState(true);
  const router = useRouter();
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const page = useRef(1);
  const limit = useRef(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const { showMessage } = useSnackbar();
  const [selectedValue, setSelectedValue] = useState(null);
  const viewPage = useRef(1);
  const viewLimit = useRef(3);

  const slug = params.slug;
  let submenuCloseTimeout = useRef(null);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("A");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleExportModalOpen = () => {
    setExportModalOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalOpen(false);
  };
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
  const allSelected =
    invoiceList.length > 0 && selected.length === invoiceList.length;

  const someSelected = selected.length > 0 && !allSelected;

  const handleRowClick = (row) => {
    router.push(`/sales/recurringInvoice/${row.recurringinvoice_id}`);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(invoiceList.map((row) => row._id));
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

  const handleSelectRow = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleFilterStatus = (value) => {
    console.log(value, "status value");
    setFilterStatus(value);
    getInvoiceData(uniqueId, viewPage.current, viewLimit.current, value);
  };

  const handleSelect = (type, value, key) => {
    setSelectedType(type);
    setSelectedKey(key);
    fetchInvoiceList(value, sortColumn, sortOrder);
    page.current = 1;
    limit.current = 10;
    setFilterBy(value);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (slug) {
      console.log("Fetching data for slug:", slug);
      fetchInvoiceList(filterBy, sortColumn, sortOrder);
      setUniqueId(slug);
      getInvoice(slug, viewPage.current, viewLimit.current, filterStatus);
    }
  }, [slug, filterBy]);

  const getInvoice = (id) => {
    getInvoiceData(id, viewPage.current, viewLimit.current, filterStatus);
  };

  // const tableAPI = () => {
  //   fetchInvoiceList(filterBy);
  //   getInvoice(slug);
  //   setVisibleView(true);
  // };

  const callViewAPI = (id, pageNo) => {
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
    viewPage.current = pageNo;
    getInvoiceData(id, pageNo, viewLimit.current, filterStatus);
  };

  const organization_id = localStorage.getItem("organization_id");

  const fetchInvoiceList = async (
    filterValue = "",
    sort_column,
    sort_order
  ) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/RecurringInvoices/getall`,
        params: {
          filter: filterValue,
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

      const data = response.data.recurring_invoices || [];

      const formattedData = data.map((invoice) => {
        let frequencyDisplay = "N/A";
        if (invoice.recurrence_frequency) {
          const frequency = invoice.recurrence_frequency.toLowerCase();
          const repeatEvery = invoice.repeat_every || 1;

          switch (frequency) {
            case "week":
              if (repeatEvery === 1) {
                frequencyDisplay = "Weekly";
              } else {
                frequencyDisplay = `Every ${repeatEvery} weeks`;
              }
              break;
            case "month":
              if (repeatEvery === 1) {
                frequencyDisplay = "Monthly";
              } else {
                frequencyDisplay = `Every ${repeatEvery} months`;
              }
              break;
            case "year":
              if (repeatEvery === 1) {
                frequencyDisplay = "Yearly";
              } else {
                frequencyDisplay = `Every ${repeatEvery} years`;
              }
              break;
            default:
              frequencyDisplay = "N/A";
          }
        }

        return {
          ...invoice,
          recurringinvoice_id: invoice.recurring_invoice_id || invoice._id,
          customer_name: invoice.customer_name || "N/A",
          profile_name: invoice.recurring_number || "N/A",
          frequency: frequencyDisplay,
          next_invoice_date: invoice.next_invoice_date_formatted || "N/A",
          status_formatted: invoice.status_formatted || "N/A",
          total_formatted: invoice.total_formatted || "₹0.00",
          date_formatted: invoice.date_formatted || "N/A",
          reference_number: invoice.reference_number || "",
          recurrence_status: invoice.recurrence_status || "N/A",
        };
      });

      setInvoiceList(formattedData);
      setTotalCount(response.data.totalCount || 0);
      setHasMore(response.data.page_context?.has_more_page || false);
    } catch (error) {
      console.error(
        "Error fetching recurring invoice list:",
        error.response?.data || error.message
      );
      setInvoiceList([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceData = async (id, page, limit, filterValue) => {
    setLoadingView(true);
    setInvoiceData([]);
    try {
      console.log("Fetching invoice data for ID:", id);
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/RecurringInvoices/individual/${id.trim()}`,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: id,
          page: page,
          limit: limit,
          filter_status: filterValue,
          sort_column: "created_time",
          sort_order: "D",
        },
      });

      if (!response.data) {
        console.error("No data received from API");
        throw new Error("No data received from the server");
      }

      const invoiceData = response.data?.data || response.data;

      if (!invoiceData) {
        console.error("Invalid data format received from server");
        throw new Error("Invalid data format received from server");
      }

      // Format frequency display
      let frequencyDisplay = "N/A";
      if (invoiceData.recurrence_frequency) {
        const frequency = invoiceData.recurrence_frequency.toLowerCase();
        const repeatEvery = invoiceData.repeat_every || 1;

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

      // Format the data to match the expected structure
      const formattedData = {
        ...invoiceData,
        data: invoiceData.data || {},

        contact_name: invoiceData.customer_name || "N/A",
        contact_id: invoiceData.recurring_invoice_id || invoiceData._id,
        company_name: invoiceData.customer_name || "N/A",
        email: invoiceData.customer_email || "",
        phone: invoiceData.customer_phone || "",
        mobile: invoiceData.customer_mobile || "",
        notes: invoiceData.notes || "",
        status: invoiceData.status,
        status_formatted: invoiceData.status_formatted,
        contact_persons: invoiceData.contact_persons || [],
        billing_address: invoiceData.billing_address || null,
        shipping_address: invoiceData.shipping_address || null,
        additional_address: invoiceData.additional_address || [],
        gst_no: invoiceData.gst_no || "",
        place_of_contact: invoiceData.place_of_contact || "",
        currency_code: invoiceData.currency_code || "INR",
        customer_sub_type: invoiceData.customer_sub_type || "Business",
        gst_treatment:
          invoiceData.gst_treatment || "Registered Business - Regular",
        pan_no: invoiceData.pan_no || "",
        tax_preference: invoiceData.tax_preference || "Taxable",
        portal_status_formatted:
          invoiceData.portal_status_formatted || "Disabled",
        language_code: invoiceData.language_code || "English",
        website: invoiceData.website || "",
        department: invoiceData.department || "",
        designation: invoiceData.designation || "",
        opening_balance_amount: invoiceData.opening_balance_amount || "0",
        outstanding_receivable_amount:
          invoiceData.outstanding_receivable_amount || "0",
        unused_credits_receivable_amount:
          invoiceData.unused_credits_receivable_amount || "0",
        payment_terms_label:
          invoiceData.payment_terms_label || "Due on receipt",
        createdAt: invoiceData.createdAt || new Date().toISOString(),
        profile_name: invoiceData.recurring_number || "N/A",
        recurrence_frequency: frequencyDisplay,
        repeat_every: invoiceData.repeat_every || 1,
        next_invoice_date: invoiceData.next_invoice_date || "N/A",
        total: invoiceData.total || "0",
        total_formatted: invoiceData.total_formatted || "₹0.00",
        recurrence_status: invoiceData.recurrence_status || "N/A",
        line_items: invoiceData.line_items || [],
        sub_total: invoiceData.sub_total || 0,
        sub_total_formatted: invoiceData.sub_total_formatted || "₹0.00",
        adjustment: invoiceData.adjustment || 0,
        terms: invoiceData.terms || "",
        reference_number: invoiceData.reference_number || "",
        order_number: invoiceData.order_number || "",
        payment_terms: invoiceData.payment_terms || "",
        tds_id: invoiceData.tds_id || "",
        tcs_id: invoiceData.tcs_id || "",
        tax_percentage: invoiceData.tax_percentage || 0,
        page_context: response.data.page_context || {
          has_more_page: false,
          total_count: 0,
        },
        total_count: response.data.total_count || 0,
      };

      setInvoiceData(formattedData);
    } catch (error) {
      console.error("Error fetching recurring invoice data:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setInvoiceData(null);
    } finally {
      setLoadingView(false);
    }
  };

  // const callBackAPI = () => {
  //   getInvoiceData(slug);
  //   fetchInvoiceList();
  // };

  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const columns = [
    { key: "customer_name", label: "CUSTOMER NAME" },
    { key: "profile_name", label: "PROFILE NAME" },
    { key: "recurrence_frequency", label: "FREQUENCY#" },
    { key: "next_invoice_date", label: " NEXT INVOICE DATE" },
    { key: "status", label: "STATUS" },
    { key: "total_formatted", label: "AMOUNT" },
  ];

  const handleDelete = async (id) => {
    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/RecurringInvoices/${id}`,
        params: {
          organization_id: organization_id,
        },
        customBaseUrl: config.SO_Base_url,
      });

      if (response.data && response.data.status) {
        showMessage("Recurring invoice deleted successfully", "success");
        router.push("/sales/recurringInvoice");
      } else {
        throw new Error(
          response.data?.message || "Failed to delete recurring invoice"
        );
      }
    } catch (error) {
      console.error("Error deleting recurring invoice:", error);
      showMessage(
        error.response?.data?.message || "Failed to delete recurring invoice",
        "error"
      );
    }
  };

  const handleEdit = (id) => {
    router.push(`/sales/recurringInvoice/edit/${id}`);
  };

  const handleClone = async (id) => {
    try {
      const response = await apiService({
        method: "POST",
        url: `/api/v1/RecurringInvoices/clone/${id}`,
        params: {
          organization_id: organization_id,
        },
        customBaseUrl: config.SO_Base_url,
      });

      if (response.data && response.data.data) {
        const newInvoiceId = response.data.data.recurringinvoice_id;
        showMessage("Recurring invoice cloned successfully", "success");
        router.push(`/sales/recurringInvoice/${newInvoiceId}`);
      } else {
        throw new Error(
          response.data?.message || "Failed to clone recurring invoice"
        );
      }
    } catch (error) {
      console.error("Error cloning recurring invoice:", error);
      showMessage(
        error.response?.data?.message || "Failed to clone recurring invoice",
        "error"
      );
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedInvoiceId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoiceId) {
      handleDelete(selectedInvoiceId);
      setDeleteDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedInvoiceId(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "90vh",
          overflow: "hidden",
        }}
      >
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
                fontWeight: 600,
                fontSize: "15px",
                textTransform: "none",
              }}
            >
              {selectedType.length > 10
                ? `${selectedType.slice(0, 10)}...`
                : selectedType}
            </Button>
            {/* Custom Filter Menu */}
            <CustomFilterMenu
              anchorEl={anchorEl}
              handleClose={() => setAnchorEl(null)}
              favoritesData={favorites}
              filtersData={filters}
              onSelect={handleSelect}
              onFavoriteToggle={(filter) => {
                const updatedFilters = filters.map((f) =>
                  f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
                );
                setFilters(updatedFilters);
                const updatedFavorites = updatedFilters.filter(
                  (f) => f.isFavorite
                );
                setFavorites(updatedFavorites);
              }}
              selectedType={selectedType}
            />
            <Box>
              <IconButton
                className="button-icon"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover":{
                    backgroundColor: "primary.main",
                  }
                }}
                onClick={() => router.push("/sales/recurringInvoice/new")}
              >
                <AddOutlined className="button-svg" />
              </IconButton>
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
                      color: menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                      borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
                      "& .menu-icon": {
                        color:
                          menuAnchorEl && item.submenu && "menu.text.normal !important",
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
            </Box>
          </Toolbar>
          <Divider />
          <SalesSideTable
            staticData={invoiceList}
            selected={selected}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            allSelected={allSelected}
            someSelected={someSelected}
            selectedType={selectedKey}
            onRowClick={handleRowClick}
            uniqueId={uniqueId}
            getData={getInvoice}
            loading={loading}
            module="recurring_invoice"
            callBackAPI={handleFetchTable}
            page={page.current}
            limit={limitSet}
            limitValue={limit.current}
            hasMore={hasMore}
            totalCount={totalCount}
            setFilterStatus={handleFilterStatus}
            filterStatus={filterStatus}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {loadingView ? (
            <CircularProgress />
          ) : invoiceData ? (
            <CustomProfileView
              details={invoiceData}
              moduleKey="RecurringInvoice"
              uniqueId={slug}
              callViewAPI={callViewAPI}
              onDelete={() => handleDeleteClick(slug)}
              onEdit={() => handleEdit(slug)}
              onClone={() => handleClone(slug)}
              page={viewPage.current}
              limit={viewLimit.current}
              setFilterStatus={handleFilterStatus}
              filterStatus={filterStatus}
              totalCount={invoiceData?.total_count || 0}
              hasMore={invoiceData?.page_context?.has_more_page || false}
            />
          ) : (
            <Box sx={{ my: 12, textAlign: "center" }}>
              {" "}
              There are no {selectedType}
            </Box>
          )}
        </Box>
      </Box>
      <SearchModal
        open={openSearchDialog}
        onClose={handleCloseSearchDialog}
        onSearch={(searchData) => console.log("Search:", searchData)}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Recurring Invoice
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this recurring invoice? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary" variant="contained" >
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="outlined" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecurringInvoice;
