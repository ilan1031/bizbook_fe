"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Container,
  Button,
  Popper,
  styled,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Radio,
  RadioGroup,
  FormControlLabel,
  ListSubheader,
  Popover,
  Snackbar,
  Alert,
  Toolbar,
  FormHelperText,
  Autocomplete,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { MoreVerticalIcon, Search, Settings } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import ItemTable from "../../../itemTable";
import CustomerDropDown from "../../../../common/CustomerDropDown";
import Customize from "../../../../common/customizeautogeneration/page";
import ProjectSelector from "../../../../common/salespersondropdown/ProjectSelector";
import { Modal } from "@mui/material";
import apiService from "../../../../../../src/services/axiosService";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useSnackbar } from "../../../../../../src/components/SnackbarProvider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import config from "../../../../../../src/services/config";
import TaxPreferencesPopover from "../../../../common/gstTreatment/TaxPreferencesPopover";
import GSTIn from "../../../../common/gstIN/TaxInformationManager";
import EmailCommunications from "../../../../common/emailcommunication/EmailCommunications";
import AddressDropdown from "../../../../common/ship_bill_address/AddressManagement";
import BillingAddress from "../../../../common/BillingAddressForm";
import LoopIcon from "@mui/icons-material/Loop";
const validationSchema = Yup.object({
  customer_id: Yup.string().required("Customer is required"),
  customer_name: Yup.string().required("Customer name is required"),
  unprocessed_payment_amount_formatted: Yup.string(),
  unprocessed_payment_amount: Yup.number(),
  invoice_number: Yup.string().required("Invoice number is required"),
  place_of_supply: Yup.string().when("gst_treatment", {
    is: (val) => val && val !== "overseas",
    then: () => Yup.string().required("Place of Supply is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  is_reverse_charge_applied: Yup.boolean(),
  gst_treatment: Yup.string(),
  gst_no: Yup.string(),
  cfdi_usage: Yup.string(),
  reference_number: Yup.string(),
  recurrence_name: Yup.string().required("Name is required"),
  order_number: Yup.string(),
  template_id: Yup.string(),
  date: Yup.date().required("Start date is required"),
  payment_terms: Yup.number(),
  end_date: Yup.date().when("never_expires", {
    is: false,
    then: () => Yup.date().required("End date is required"),
    otherwise: () => Yup.date().nullable(),
  }),
  repeat_every: Yup.string().required("Repeat frequency is required"),
  never_expires: Yup.boolean(),
  discount: Yup.number(),
  is_discount_before_tax: Yup.boolean(),
  discount_type: Yup.string(),
  is_inclusive_tax: Yup.boolean(),
  exchange_rate: Yup.number(),
  location_id: Yup.string(),
  recurring_invoice_id: Yup.string(),
  invoiced_estimate_id: Yup.string(),
  salesperson_name: Yup.string(),
  custom_fields: Yup.array().of(
    Yup.object().shape({
      customfield_id: Yup.string(),
      value: Yup.string(),
    })
  ),
  line_items: Yup.array()
    .of(
      Yup.object().shape({
        item_id: Yup.string(),
        project_id: Yup.string(),
        time_entry_ids: Yup.array().of(Yup.string()),
        product_type: Yup.string(),
        hsn_or_sac: Yup.number(),
        sat_item_key_code: Yup.number(),
        unitkey_code: Yup.string(),
        location_id: Yup.string(),
        expense_id: Yup.string(),
        bill_id: Yup.string(),
        bill_item_id: Yup.string(),
        expense_receipt_name: Yup.string(),
        name: Yup.string().required("Item name is required"),
        description: Yup.string(),
        item_order: Yup.number(),
        bcy_rate: Yup.number(),
        rate: Yup.number()
          .required("Rate is required")
          .min(0, "Rate must be positive"),
        quantity: Yup.number()
          .required("Quantity is required")
          .min(0, "Quantity must be positive"),
        unit: Yup.string(),
        discount_amount: Yup.number(),
        discount: Yup.number(),
        tags: Yup.array().of(
          Yup.object().shape({
            tag_id: Yup.string(),
            tag_option_id: Yup.string(),
          })
        ),
        tax_id: Yup.string(),
        tds_tax_id: Yup.string(),
        tax_name: Yup.string(),
        tax_type: Yup.string(),
        tax_percentage: Yup.number(),
        tax_treatment_code: Yup.string(),
        header_name: Yup.string(),
        salesorder_item_id: Yup.string(),
      })
    )
    .min(1, "At least one item is required"),
  payment_options: Yup.object().shape({
    payment_gateways: Yup.array().of(
      Yup.object().shape({
        configured: Yup.boolean(),
        additional_field1: Yup.string(),
        gateway_name: Yup.string(),
      })
    ),
  }),
  allow_partial_payments: Yup.boolean(),
  custom_body: Yup.string(),
  custom_subject: Yup.string(),
  notes: Yup.string(),
  terms: Yup.string(),
  shipping_charge: Yup.number(),
  adjustment: Yup.number(),
  adjustment_description: Yup.string(),
  reason: Yup.string(),
  tax_authority_id: Yup.string(),
  tax_exemption_id: Yup.string(),
  billing_address_id: Yup.string(),
  shipping_address_id: Yup.string(),
  avatax_use_code: Yup.string(),
  avatax_exempt_no: Yup.string(),
  tax_id: Yup.string(),
  expense_id: Yup.string(),
  salesorder_item_id: Yup.string(),
  avatax_tax_code: Yup.string(),
  time_entry_ids: Yup.array().of(Yup.string()),
  status: Yup.string().oneOf(["draft", "sent", "active"], "Invalid status"),
  status_formatted: Yup.string(),
  recurrence_frequency: Yup.string(),
  repeat_every: Yup.number(),
});
const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AD", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "DN", name: "Dadra and Nagar Haveli" },
  { code: "DD", name: "Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LD", name: "Lakshadweep" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PY", name: "Puducherry" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
];
const StyledPopper = styled(Popper)({
  "& .MuiAutocomplete-paper": {
    maxHeight: 200,
    overflowY: "auto",
    margin: 0, // optional: remove extra spacing
    padding: 0,
  },
  "& .MuiAutocomplete-listbox": {
    maxHeight: "unset", // prevent double scroll by removing inner height limit
    padding: 0,
  },
});
const commonStyles = {
  fontSize: "13px",
  "& .MuiInputBase-root": {
    fontSize: "13px",
    height: "36px",
  },
  "& .MuiFormLabel-root": {
    fontSize: "13px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "11px",
  },
  // mb: 2,
};
const InvoiceCreationPage = () => {
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, quantity: 1.0, rate: 0.0, amount: 0.0 },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [addressType, setAddressType] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [anchorElSales, setAnchorElSales] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [invoiceId, setInvoiceId] = useState("");
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const dropdownRef = useRef(null);
  const anchorRef = useRef(null);
  const [status, setStatus] = useState("");
  const [anchorElEdit, setAnchorElEdit] = React.useState(null);
  const [anchorElGSTIN, setAnchorElGSTIN] = React.useState(null);
  const [openGSTIN, setOpenGSTIN] = useState(false);
  const [anchorElBilling, setAnchorElBilling] = useState(null); // For Billing Address Popover
  const [anchorElShipping, setAnchorElShipping] = useState(null); // For Shipping Address Popover
  const [isZoho, setIsZoho] = useState(false);
  const params = useParams();
  const recurring_invoice_id = params.slug;

  useEffect(() => {
    if (recurring_invoice_id) {
      fetchRecurringInvoiceData(recurring_invoice_id);
    }
  }, [recurring_invoice_id]);

  const fetchRecurringInvoiceData = async (id) => {
    try {
      const organization_id = localStorage.getItem("organization_id");

      if (!organization_id) {
        showMessage("Organization ID not found", "error");
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/RecurringInvoices/individual`,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: id,
        },
        customBaseUrl: config.SO_Base_url,
      });


      if (response.data && response.data.data) {
        const invoiceData = response.data.data;
        console.log("Fetched Recurring Invoice Data:", invoiceData);

        // Set customer data
        if (invoiceData.customer_id) {
          try {
            const customerResponse = await apiService({
              method: "GET",
              url: `/api/v1/contact/${invoiceData.customer_id}`,
              params: {
                organization_id: organization_id,
              },
              file: false,
            });

            const { data: customerData } = customerResponse.data;
            setCustomerData(customerData);
            setSelectedCustomer(customerData);
          } catch (error) {
            console.error("Error fetching customer data:", error);
            showMessage("Failed to fetch customer data", "error");
          }
        }

        // Set salesperson data if available
        if (invoiceData.salesperson_id) {
          try {
            const salespersonResponse = await apiService({
              method: "GET",
              url: `/api/v1/salesperson/${invoiceData.salesperson_id}`,
              params: {
                organization_id: organization_id,
              },
              file: false,
            });

            const { data: salespersonData } = salespersonResponse.data;
            setSelectedSalesperson(salespersonData);
          } catch (error) {
            console.error("Error fetching salesperson data:", error);
          }
        }

        // Set formik initial values with proper field mapping
        formik.setValues({
          customer_id: invoiceData.customer_id || "",
          customer_name: invoiceData.customer_name || "",
          invoice_number: invoiceData.invoice_number || "",
          reference_number: invoiceData.reference_number || "",
          recurrence_name: invoiceData.recurrence_name || "",
          order_number: invoiceData.order_number || "",
          date: invoiceData.start_date || invoiceData.date || "",
          date_formatted:
            invoiceData.start_date_formatted ||
            invoiceData.date_formatted ||
            "",
          end_date: invoiceData.end_date || invoiceData.end_date || "",
          end_date_formatted:
            invoiceData.end_date_formatted ||
            invoiceData.end_date_formatted ||
            "",
          billing_address: invoiceData.billing_address || {},
          shipping_address: invoiceData.shipping_address || {},
          line_items: invoiceData.line_items.map((item) => ({
            item_id: item.item_id,
            name: item.name,
            description: item.description || "",
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount || 0,
            amount: item.quantity * item.rate,
            unit: item.unit || "",
            tax_percentage: item.tax_percentage || 0,
          })),
          tax_type: invoiceData.tax_type || "TDS",
          discount_percent: invoiceData.discount_percent || 0,
          discount_amount_formatted:
            invoiceData.discount_amount_formatted || "",
          discount_amount: invoiceData.discount_amount || "",
          tds_option: invoiceData.tds_option || "",
          tds_id: invoiceData.tds_id || "",
          tcs_id: invoiceData.tcs_id || "",
          sub_total: invoiceData.sub_total || 0,
          sub_total_formatted: invoiceData.sub_total_formatted || "₹0.00",
          tax_total: invoiceData.tax_total || 0,
          tax_total_formatted: invoiceData.tax_total_formatted || "₹0.00",
          total_amount: invoiceData.total || 0,
          total_amount_formatted: invoiceData.total_formatted || "₹0.00",
          adjustment: invoiceData.adjustment || 0,
          payment_terms: invoiceData.payment_terms || 0,
          payment_terms_label:
            invoiceData.payment_terms_label || "Due On Receipt",
          repeat_every: invoiceData.repeat_every,
          repeat_value: invoiceData.repeat_value,
          recurrence_frequency: invoiceData.recurrence_frequency,
          status: invoiceData.status || "",
          status_formatted: invoiceData.status_formatted || "",
          general: [],
          place_of_supply: invoiceData.place_of_supply || "",
          place_of_supply_formatted:
            invoiceData.place_of_supply_formatted || "",
          gst_treatment: invoiceData.gst_treatment || "",
          gst_no: invoiceData.gst_no || "",
          terms: invoiceData.terms || "",
          notes: invoiceData.notes || "",
          salesperson_name: invoiceData.salesperson_name || "",
          tax_percentage: invoiceData.tax_percentage || 0,
          never_expires: invoiceData.never_expires || false,
        });

      } else {
        showMessage("Failed to fetch recurring invoice data", "error");
      }
    } catch (error) {
      console.error("Error fetching recurring invoice data:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to fetch recurring invoice data",
        "error"
      );
    }
  };

  const handleClickBA = (event, value) => {
    if (value === "edit") {
      setAddressType("billing");
      setAddressData(customerData?.billing_address);
      setAnchorElBilling(event.currentTarget); // Open Billing Address Popover
    } else if (value === "add") {
      setAddressType("billing");
      setAddressData(null); // Clear existing data for new address
      setAddressModalOpen(true); // Open Modal for New Address
    }
  };

  const handleClickSA = (event, value) => {
    if (value === "edit") {
      setAddressType("shipping");
      setAddressData(customerData?.shipping_address);
      setAnchorElShipping(event.currentTarget); // Open Shipping Address Popover
    } else if (value === "add") {
      setAddressType("shipping");
      setAddressData(null); // Clear existing data for new address
      setAddressModalOpen(true); // Open Modal for New Address
    }
  };
  const handleCloseAddressModal = () => {
    setAddressModalOpen(false);
    setAddressType("");
    setAddressData(null);
    fetchCustomerData(customerData?.contact_id);
  };

  //GST TREATMENT
  const handleEditClick = (event) => {
    setAnchorElEdit(event.currentTarget);
  };

  const handleCloseEdit = () => {
    setAnchorElEdit(null);
  };

  const handleUpdateEdit = (updatedData) => {
    onUpdateGST && onUpdateGST(updatedData);
    handleCloseEdit();
  };

  const openEdit = Boolean(anchorElEdit);

  //GSTIN
  const handleGSTINClick = (event) => {
    event.stopPropagation();
    setAnchorElGSTIN(event.currentTarget);
    setOpenGSTIN(true);
  };

  const handleCloseGSTIN = () => {
    setAnchorElGSTIN(null);
    setOpenGSTIN(false);
  };

  const handleUpdateGSTIN = (updatedData) => {
    onUpdateGSTIN && onUpdateGSTIN(updatedData);
    handleCloseGSTIN();
  };
  // Format date helper function
  const formatDate = (date) => {
    if (!date) return "";
    try {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "";
    }
  };

  const handleOpenDropdown = (event) => {
    setAnchorElSales(event.currentTarget);
    setOpenDropdown((prev) => !prev); // Toggle dropdown
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };
  const handleRowClick = (customer) => {
    router.push(`/sales/invoices/${customer.key}`);
  };
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSettingsClick = () => {
    setOpenModal(true);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // Theme Constants
  const COLORS = {
    primary: "#408dfb",
    secondary: "#86b7fe",
    error: "#d32f2f",
    textPrimary: "#212121",
    textSecondary: "#666666",
  };

  // Common Interaction Styles
  const commonInteractionStyles = {
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        border: ".1px solid #408dfb",
        boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`, // 4D = 30% opacity
      },
    },
  };

  // Consolidated Common Input Style
  const commonInputStyle = {
    height: "35px",
    backgroundColor: "#fff",
    "& .MuiInputBase-input": {
      fontSize: "0.875rem",
      padding: "6px 12px",
    },
    "& .MuiOutlinedInput-root": {
      height: "35px",
      borderRadius: "7px",
      ...commonInteractionStyles["& .MuiOutlinedInput-root"], // Spread common interactions
    },
  };

  const helperTextStyle = {
    color: "text.secondary",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 1,
  };
  const commonTextareaInputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "vertical",
    background: "transparent",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    paddingTop: "5px",
    paddingLeft: "12px",
    marginBottom: "-5px",
    paddingBottom: "5px",
  };

  const formLabelStyle = {
    fontSize: "0.875rem",
    minWidth: "120px",
    whiteSpace: "nowrap",
    color: "error.main", // Red color for required fields
  };

  const formLabelBlackStyle = {
    ...formLabelStyle,
    color: "text.primary", // Using theme's primary text color
  };

  // Common Button Styles
  const commonButtonStyle = {
    ...formLabelBlackStyle, // Match formLabelBlackStyle
    fontFamily: "inherit",
    textTransform: "none",
    padding: "6px 10px", // Consistent padding
    lineHeight: 1.5,
    borderRadius: "7px",
    bgcolor: "rgba(71, 71, 71, 0.07)",
    borderColor: "rgba(78, 78, 78, 0.15)",
    "&:hover": {
      bgcolor: "rgba(71, 71, 71, 0.1)",
      borderColor: "rgba(24, 13, 13, 0.2)",
    },
    minWidth: "auto", // Allow width to fit content
  };

  // Common textarea styles
  const commonTextareaStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "7px",
    // padding: "6px 12px",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    resize: "vertical",
    minHeight: "auto",
    lineHeight: "1.6",
    width: "100%",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#408dfb",
      boxShadow: "0 0 0 .7px #86b7fe",
    },
    "&:focus": {
      outline: "none",
      borderColor: "#408dfb",
      boxShadow: "0 0 0 0.2rem rgba(97, 160, 255, 0.3)",
    },
    "&::placeholder": {
      color: "#66686b",
      opacity: 1,
    },
    "&::-webkit-resizer": {
      display: "none",
    },
  };

  const menuItemStyle = {
    fontSize: "0.875rem",
    color: "#666666",
    fontStyle: "normal",
  };

  const searchButtonStyle = {
    height: "35px",
    width: "40px",
    borderRadius: "0 7px 7px 0",
    backgroundColor: "#408dfb",
    color: "white",
    border: "1px solid",
    borderColor: "primary.main",
    borderLeft: "none",
    "&:hover": {
      backgroundColor: "primary.dark",
      borderColor: "primary.dark",
    },
  };
  const terms = {
    borderLeft: "none",
    "&:hover": {
      backgroundColor: "primary.dark",
      borderColor: "primary.dark",
    },
  };

  // Common Icon Styles
  const commonIconStyle = {
    fontSize: "1.2rem", // 16px
    color: "text.secondary",
  };

  // Form Control Style using Common Interactions
  const formControlStyle = {
    combinedWithButton: {
      width: "calc(100% - 40px)",
      height: "35px",
      backgroundColor: "#fff",
      "& .MuiOutlinedInput-root": {
        ...commonInputStyle["& .MuiOutlinedInput-root"], // Inherit base styles
        borderRadius: "7px",
        "& input": {
          color: "#66686b",
          cursor: "pointer",
          "&::placeholder": {
            color: "#66686b",
            fontSize: "0.92rem",
            opacity: 1,
          },
          '&:not([value=""])': {
            color: "inherit",
          },
        },
      },
    },
  };

  const formRowStyle = {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { md: "center" },
    gap: { xs: 0, md: 6 },
  };

  const SectionDivider = ({ sx }) => (
    <Box
      sx={{
        borderBottom: 0.5,
        borderColor: "divider",
        width: "100%",
        opacity: 0.5,
        my: 2,
        ...sx,
        ml: { xs: 2, md: 2 },
      }}
    />
  );

  const addNewRow = () => {
    const newItem = {
      id: quoteItems.length + 1,
      quantity: 1.0,
      rate: 0.0,
      amount: 0.0,
    };
    setQuoteItems([...quoteItems, newItem]);
  };

  const removeRow = (id) => {
    setQuoteItems(quoteItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = quoteItems.map((item) => {
      if (item.id === id) {
        const quantity = parseFloat(newQuantity) || 0;
        return { ...item, quantity, amount: quantity * item.rate };
      }
      return item;
    });
    setQuoteItems(updatedItems);
  };

  const handleRateChange = (id, newRate) => {
    const updatedItems = quoteItems.map((item) => {
      if (item.id === id) {
        const rate = parseFloat(newRate) || 0;
        return { ...item, rate, amount: item.quantity * rate };
      }
      return item;
    });
    setQuoteItems(updatedItems);
  };

  const handleCustomerChange = async (data) => {
    setSelectedCustomer(data);
    await formik.setFieldValue("customer_id", data.contact_id);
    await formik.setFieldValue("gst_treatment", data.gst_treatment || "");
    await formik.setFieldValue("gst_no", data.gst_no || "");
    await formik.setFieldValue("currency_id", data.currency_id || "");
    await formik.setFieldValue("contact_persons", data.contact_persons || []);
    await formik.setFieldValue("place_of_supply", data.place_of_contact || "");

    await formik.setFieldValue(
      "billing_address_id",
      data.billing_address?.address_id || ""
    );
    await formik.setFieldValue(
      "shipping_address_id",
      data.shipping_address?.address_id || ""
    );
    fetchCustomerData(data.contact_id);
    handleClose();
    formik.validateForm(); // Trigger validation after setting values
  };
  const fetchInvoiceId = async () => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        showMessage("Organization ID not found", "error");
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/invoice-id?organization_id=${organization_id}`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });

      console.log("Invoice ID Response:", response); // Debug log

      if (response.data.status) {
        const { data } = response.data;
        setInvoiceId(data);
      } else {
        showMessage(
          response.data.message || "Failed to fetch invoice ID",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching invoice ID:", error);
      showMessage(
        error.response?.data?.message || "Failed to fetch invoice ID",
        "error"
      );
    }
  };
  const fetchCustomerData = async (uniqueId) => {
    if (!uniqueId) return;

    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${uniqueId}`,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });

      const { data } = response.data;
      setCustomerData(data);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      showMessage("Failed to fetch customer data", "error");
    }
  };

  const fetchContactData = async (uniqueId) => {
    if (!uniqueId) return;

    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${uniqueId}`,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });

      const { data } = response.data;
      setCustomerData(data);
      handleCustomerChange(data);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      showMessage("Failed to fetch customer data", "error");
    }
  };

  const handleSalespersonChange = (event) => {
    setSelectedSalesperson(event.target.value);
  };
  const handleSalespersonSelect = (salesperson) => {
    alert(salesperson);
    setSelectedSalesperson(salesperson);
    formik.setFieldValue("salesperson_id", salesperson.salesperson_id);
    formik.setFieldValue("salesperson_name", salesperson.salesperson_name);
    handleCloseDropdown();
  };

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleTaxTypeChange = (event) => {
    setTaxType(event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      customer_name: "",
      reference_number: "",
      invoice_number: "",
      profile_name: "",
      date: "",
      date_formatted: "",
      end_date: "",
      end_date_formatted: "",
      never_expires: false,
      billing_address: "",
      shipping_address: "",
      place_of_supply: "",
      line_items: [
        {
          item_id: "",
          name: "",
          quantity: 1,
          rate: 0,
          discount: 0,
          amount: 0,
        },
      ],
      tax_type: "TDS",
      tax_percentage: 0,
      discount_percent: 0,
      discount_amount_formatted: "",
      discount_amount: "",
      tds_option: "",
      tds_id: "",
      tcs_id: "",
      sub_total: 0,
      sub_total_formatted: "₹0.00",
      tax_total: 0,
      tax_total_formatted: "₹0.00",
      total_amount: 0,
      total_amount_formatted: "₹0.00",
      repeat_every: 1,
      repeat_value: "Week",
      recurrence_frequency: "week",
      recurrence_name: "",
      adjustment: 0,
      total: 0,
      total_formatted: "₹0.00",
      adjustment: 0,
      status: "draft",
      place_of_supply: "",
      gst_treatment: "",
      payment_terms: 0,
      payment_terms_label: "Due On Receipt",
      gst_no: "",
      terms: "",
      notes: "",
      status_formatted: "Draft",
      general: [],
      order_number: "",
      salesperson_name: "",
    },
    validationSchema: Yup.object().shape({
      invoice_number: Yup.string().required("Invoice number is required"),
      status: Yup.string().oneOf(["draft", "sent", "active"], "Invalid status"),
      // Add other validation rules as needed
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("Form submission started");
        const errors = [];

        // Validate customer selection
        if (!customerData?.contact_id) {
          errors.push("Please select a customer");
        }

        // Validate place of supply if GST treatment is not Overseas
        if (
          customerData?.gst_treatment !== "Overseas" &&
          !values.place_of_supply
        ) {
          errors.push("Please select Place of supply");
        }

        // Validate line items
        const hasValidLineItems = values.line_items.some(
          (item) =>
            item.item_id && item.name && item.quantity > 0 && item.rate > 0
        );
        if (!hasValidLineItems) {
          errors.push("Please add at least one line item");
        }

        // If there are validation errors, update the general errors and stop submission
        if (errors.length > 0) {
          await formik.setFieldValue("general", errors);
          setSubmitting(false);
          return;
        }

        const organization_id = localStorage.getItem("organization_id");
        if (!organization_id) {
          console.error("Organization ID not found");
          return;
        }

        // Format dates
        const formattedDate = values.date
          ? dayjs(values.date).format("YYYY-MM-DD")
          : "";
        const formattedDueDate = values.end_date
          ? dayjs(values.end_date).format("YYYY-MM-DD")
          : "";

        // Calculate next invoice date
        const nextInvoiceDate = calculateNextInvoiceDate(
          formattedDate,
          values.repeat_value
        );

        // Prepare request data
        const requestData = {
          customer_id: customerData?.contact_id,
          customer_name: customerData?.contact_name,
          invoice_number: values.invoice_number,
          reference_number: values.reference_number,
          recurrence_name: values.recurrence_name,
          order_number: values.order_number,
          date: formattedDate,
          date_formatted: values.date_formatted,
          organization_id: organization_id,
          end_date: formattedDueDate,
          end_date_formatted: values.end_date_formatted,
          billing_address: customerData?.billing_address,
          shipping_address: customerData?.shipping_address,
          place_of_supply: values.place_of_supply,
          line_items: values.line_items.map((item) => ({
            ...item,
            item_total:
              item.quantity * item.rate * (1 - (item.discount || 0) / 100),
            item_id: item.item_id,
            name: item.name,
            quantity: parseFloat(item.quantity) || 0,
            rate: parseFloat(item.rate) || 0,
            discount: parseFloat(item.discount) || 0,
            amount: parseFloat(item.amount) || 0,
          })),
          tax_type: values.tax_type,
          tax_percentage: parseFloat(values.tax_percentage) || 0,
          tds_option: values.tds_option,
          sub_total: parseFloat(values.sub_total) || 0,
          sub_total_formatted: values.sub_total_formatted,
          tax_total: parseFloat(values.tax_total) || 0,
          tax_total_formatted: values.tax_total_formatted,
          total: parseFloat(values.total_amount) || 0,
          total_formatted: values.total_amount_formatted,
          adjustment: parseFloat(values.adjustment) || 0,
          status: values.status,
          status_formatted: values.status_formatted,
          place_of_supply: values.place_of_supply,
          gst_treatment: values.gst_treatment,
          tds_id: values.tds_id,
          payment_terms: values.payment_terms,
          payment_terms_label: values.payment_terms_label,
          repeat_every: values.repeat_every,
          recurrence_frequency: values.recurrence_frequency,
          tcs_id: values.tcs_id,
          tax_percentage: values.tax_percentage,
          recurring_invoice: {
            start_date: formattedDate,
            end_date: formattedDueDate,
            repeat_every: values.repeat_every,
            recurrence_frequency: values.recurrence_frequency,
            never_expires: values.never_expires || false,
            payment_terms: values.payment_terms,
            payment_terms_label: values.payment_terms_label,
            next_invoice_date: nextInvoiceDate,
          },
          total_amount: parseFloat(values.total_amount) || 0,
          total_amount_formatted: values.total_amount_formatted,
          calculated_total: parseFloat(values.total_amount) || 0,
          calculated_total_formatted: values.total_amount_formatted,
          terms: values.terms,
          repeat_value: values.repeat_value,
          
        };

        console.log("=== SENDING UPDATE REQUEST ===");
        console.log(
          "Request URL:",
          `${config.SO_Base_url}/api/v1/RecurringInvoices/individual/update`
        );
        console.log("Request Data:", requestData);

        // Make API call for update
        const response = await apiService({
          method: "PUT",
          url: `/api/v1/RecurringInvoices/individual/update`,
          data: requestData,
          params: {
            organization_id: organization_id,
            recurring_invoice_id: recurring_invoice_id,
          },
          customBaseUrl: config.SO_Base_url,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          validateStatus: null,
        });

        console.log("=== API RESPONSE ===");
        console.log("Response:", response);

        if (
          response?.statusCode === 200 ||
          response?.data?.message?.toLowerCase().includes("success")
        ) {
          console.log("13. Update successful");
          // Update generated invoices and their payment records
          const updateResult = await updateGeneratedInvoicesAndPayments(requestData);
          showMessage("Recurring invoice and related records updated successfully!", "success");
          setTimeout(() => {
            router.push(`/sales/recurringInvoice/${recurring_invoice_id}`);
          }, 1000);
        } else {
          console.log("13. Update failed:", response?.data);
          showMessage(
            response?.data?.message || "Failed to update recurring invoice",
            "error"
          );
        }
      } catch (error) {
        console.error("=== ERROR IN UPDATE ===");
        console.error("Error:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          showMessage(
            error.response.data?.message ||
              "Failed to update recurring invoice",
            "error"
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
          showMessage("No response received from server", "error");
        } else {
          console.error("Error setting up request:", error.message);
          showMessage("Error setting up request", "error");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fix the error prop in TextField components
  const renderTextField = (props) => {
    const { error, ...rest } = props;
    return (
      <TextField {...rest} error={Boolean(error)} helperText={error || ""} />
    );
  };

  // Update the profile name TextField to use the new renderTextField
  <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
    {renderTextField({
      fullWidth: true,
      id: "profile_name",
      name: "profile_name",
      value: formik.values.profile_name || "",
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      error: formik.touched.profile_name && formik.errors.profile_name,
      sx: {
        ...commonInputStyle,
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#000",
        },
      },
    })}
  </Grid>;

  // ... existing code ...

  // Update the handleSave function to use formik's submit
  const handleSave = async () => {
    try {
      console.log("=== SAVE PROCESS STARTED ===");
      console.log("1. Current form values:", formik.values);
      console.log("2. Customer data:", customerData);
      console.log("3. Recurring invoice ID:", recurring_invoice_id);

      // Auto-generate invoice number if empty
      let invoiceNumber = formik.values.invoice_number;
      if (!invoiceNumber) {
        const organization_id = localStorage.getItem("organization_id");
        try {
          const response = await apiService({
            method: "GET",
            url: `/api/v1/invoice-id?organization_id=${organization_id}`,
            customBaseUrl: config.SO_Base_url,
            file: false,
          });

          if (response.data.status) {
            invoiceNumber = response.data.data;
            await formik.setFieldValue("invoice_number", invoiceNumber);
            console.log("4. Auto-generated invoice number:", invoiceNumber);
          }
        } catch (error) {
          console.error("Error generating invoice number:", error);
          showMessage("Failed to generate invoice number", "error");
          return;
        }
      }

      // Validate required fields
      const errors = [];

      // Customer validation
      if (!customerData?.contact_id) {
        errors.push("Please select a customer");
      }

      // Invoice number validation
      if (!invoiceNumber) {
        errors.push("Invoice number is required");
      }

      // Date validation
      if (!formik.values.date) {
        errors.push("Start date is required");
      }

      // Line items validation
      if (!formik.values.line_items || formik.values.line_items.length === 0) {
        errors.push("Please add at least one line item");
      }

      // Repeat value validation
      if (!formik.values.repeat_value) {
        errors.push("Repeat frequency is required");
      }

      console.log("5. Validation errors:", errors);

      if (errors.length > 0) {
        console.log("6. Validation failed, showing errors");
        await formik.setFieldValue("general", errors);
        setOpenAlert(true);
        return;
      }

      const organization_id = localStorage.getItem("organization_id");
      console.log("7. Organization ID:", organization_id);

      if (!organization_id) {
        console.error("Organization ID not found");
        showMessage("Organization ID not found", "error");
        return;
      }

      // Format dates
      const formattedDate = formik.values.date
        ? dayjs(formik.values.date).format("YYYY-MM-DD")
        : "";
      const formattedDueDate = formik.values.end_date
        ? dayjs(formik.values.end_date).format("YYYY-MM-DD")
        : "";

      console.log("8. Formatted dates:", { formattedDate, formattedDueDate });

      // Calculate next invoice date
      const nextInvoiceDate = calculateNextInvoiceDate(
        formattedDate,
        formik.values.repeat_value
      );

      console.log("9. Next invoice date:", nextInvoiceDate);

      // Prepare request data
      const requestData = {
        customer_id: customerData?.contact_id,
        customer_name: customerData?.contact_name,
        invoice_number: invoiceNumber, // Use the validated invoice number
        reference_number: formik.values.reference_number,
        profile_name: formik.values.profile_name,
        recurrence_name: formik.values.profile_name,
        order_number: formik.values.order_number,
        date: formattedDate,
        date_formatted: formik.values.date_formatted,
        organization_id: organization_id,
        end_date: formattedDueDate,
        end_date_formatted: formik.values.end_date_formatted,
        billing_address: customerData?.billing_address,
        shipping_address: customerData?.shipping_address,
        place_of_supply: formik.values.place_of_supply,
        line_items: formik.values.line_items.map((item) => ({
          ...item,
          item_total:
            item.quantity * item.rate * (1 - (item.discount || 0) / 100),
          item_id: item.item_id,
          name: item.name,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.rate) || 0,
          discount: parseFloat(item.discount) || 0,
          amount: parseFloat(item.amount) || 0,
        })),
        tax_type: formik.values.tax_type,
        tax_percentage: parseFloat(formik.values.tax_percentage) || 0,
        tds_option: formik.values.tds_option,
        sub_total: parseFloat(formik.values.sub_total) || 0,
        sub_total_formatted: formik.values.sub_total_formatted,
        tax_total: parseFloat(formik.values.tax_total) || 0,
        tax_total_formatted: formik.values.tax_total_formatted,
        total: parseFloat(formik.values.total_amount) || 0,
        total_formatted: formik.values.total_amount_formatted,
        adjustment: parseFloat(formik.values.adjustment) || 0,
        status: "draft",
        status_formatted: "Draft",
        place_of_supply: formik.values.place_of_supply,
        gst_treatment: formik.values.gst_treatment,
        tds_id: formik.values.tds_id,
        payment_terms: formik.values.payment_terms,
        payment_terms_label: formik.values.payment_terms_label,
        repeat_every: formik.values.repeat_every,
        recurrence_frequency: formik.values.recurrence_frequency,
        tcs_id: formik.values.tcs_id,
        tax_percentage: formik.values.tax_percentage,
        recurring_invoice: {
          start_date: formattedDate,
          end_date: formattedDueDate,
          repeat_every: formik.values.repeat_every,
          recurrence_frequency: formik.values.recurrence_frequency,
          never_expires: formik.values.never_expires || false,
          payment_terms: formik.values.payment_terms,
          payment_terms_label: formik.values.payment_terms_label,
          next_invoice_date: nextInvoiceDate,
        },
        total_amount: parseFloat(formik.values.total_amount) || 0,
        total_amount_formatted: formik.values.total_amount_formatted,
        calculated_total: parseFloat(formik.values.total_amount) || 0,
        calculated_total_formatted: formik.values.total_amount_formatted,
        terms: formik.values.terms,
        repeat_value: formik.values.repeat_value,
        
      };

      console.log("10. Request data prepared:", requestData);

      // Make API call for update
      console.log("11. Making API call...");
      console.log(
        "API URL:",
        `${config.SO_Base_url}/api/v1/RecurringInvoices/individual/update`
      );
      console.log("Request params:", {
        organization_id: organization_id,
        recurring_invoice_id: recurring_invoice_id,
      });

      const response = await apiService({
        method: "PUT",
        url: `/api/v1/RecurringInvoices/individual/update`,
        data: requestData,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: recurring_invoice_id,
        },
        customBaseUrl: config.SO_Base_url,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: null,
      });

      console.log("12. API Response received:", response);

      // Check for success based on statusCode or message
      if (
        response?.statusCode === 200 ||
        response?.data?.message?.toLowerCase().includes("success")
      ) {
        console.log("13. Update successful");
        // Update generated invoices and their payment records
        const updateResult = await updateGeneratedInvoicesAndPayments(requestData);
        showMessage("Recurring invoice and related records updated successfully!", "success");
        setTimeout(() => {
          router.push(`/sales/recurringInvoice/${recurring_invoice_id}`);
        }, 1000);
      } else {
        console.log("13. Update failed:", response?.data);
        showMessage(
          response?.data?.message || "Failed to update recurring invoice",
          "error"
        );
      }
    } catch (error) {
      console.error("=== ERROR IN UPDATE ===");
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        showMessage(
          error.response.data?.message || "Failed to update recurring invoice",
          "error"
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        showMessage("No response received from server", "error");
      } else {
        console.error("Error setting up request:", error.message);
        showMessage("Error setting up request", "error");
      }
    }
  };

  // Update the save button to ensure it's properly connected
  <Button
    variant="contained"
    sx={{
      marginRight: "8px",
    }}
    onClick={() => {
      console.log("Save button clicked");
      handleSave();
    }}
    type="button"
    disabled={formik.isSubmitting}
  >
    {formik.isSubmitting ? "Saving..." : "Save"}
  </Button>;

  // ... existing code ...

  // Update the handleSaveAndSend function to use formik's submit
  const handleSaveAndSend = async () => {
    try {
      console.log("Starting save and send process...");
      setOpenAlert(true);

      // Validate required fields
      const errors = [];
      if (!customerData?.contact_id) {
        errors.push("Please select a customer");
      }
      if (!formik.values.invoice_number) {
        errors.push("Invoice number is required");
      }
      if (!formik.values.date) {
        errors.push("Invoice date is required");
      }
      if (formik.values.line_items.length === 0) {
        errors.push("Please add at least one line item");
      }

      if (errors.length > 0) {
        await formik.setFieldValue("general", errors);
        return;
      }

      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        console.error("Organization ID not found");
        return;
      }

      // Format dates
      const formattedDate = formik.values.date
        ? dayjs(formik.values.date).format("YYYY-MM-DD")
        : "";
      const formattedDueDate = formik.values.end_date
        ? dayjs(formik.values.end_date).format("YYYY-MM-DD")
        : "";

      // Calculate next invoice date
      const nextInvoiceDate = calculateNextInvoiceDate(
        formattedDate,
        formik.values.repeat_value
      );

      // Prepare request data
      const requestData = {
        ...formik.values,
        customer_id: customerData?.contact_id,
        customer_name: customerData?.contact_name,
        date: formattedDate,
        end_date: formattedDueDate,
        status: "active",
        status_formatted: "Active",
        recurring_invoice: {
          start_date: formattedDate,
          end_date: formattedDueDate,
          repeat_every: formik.values.repeat_every,
          recurrence_frequency: formik.values.recurrence_frequency,
          never_expires: formik.values.never_expires || false,
          payment_terms: formik.values.payment_terms,
          payment_terms_label: formik.values.payment_terms_label,
          next_invoice_date: nextInvoiceDate,
        },
      };

      console.log("=== SENDING UPDATE REQUEST ===");
      console.log(
        "Request URL:",
        `${config.SO_Base_url}/api/v1/RecurringInvoices/individual/update`
      );
      console.log("Request Data:", requestData);

      // Make API call for update
      const response = await apiService({
        method: "PUT",
        url: `/api/v1/RecurringInvoices/individual/update`,
        data: requestData,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: recurring_invoice_id,
        },
        customBaseUrl: config.SO_Base_url,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: null,
      });

      console.log("=== API RESPONSE ===");
      console.log("Response:", response);

      if (
        response?.statusCode === 200 ||
        response?.data?.message?.toLowerCase().includes("success")
      ) {
        console.log("13. Update successful");
        // Update generated invoices and their payment records
        const updateResult = await updateGeneratedInvoicesAndPayments(requestData);
        showMessage("Recurring invoice and related records updated successfully!", "success");
        setTimeout(() => {
          router.push(`/sales/recurringInvoice/${recurring_invoice_id}`);
        }, 1000);
      } else {
        console.log("13. Update failed:", response?.data);
        showMessage(
          response?.data?.message || "Failed to update recurring invoice",
          "error"
        );
      }
    } catch (error) {
      console.error("=== ERROR IN UPDATE ===");
      console.error("Error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        showMessage(
          error.response.data?.message || "Failed to update recurring invoice",
          "error"
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        showMessage("No response received from server", "error");
      } else {
        console.error("Error setting up request:", error.message);
        showMessage("Error setting up request", "error");
      }
    }
  };

  // Handle Save as Draft
  const handleSaveAsDraft = () => {
    console.log("handleSaveAsDraft called");
    setOpenAlert(true); // Show validation errors if any
    formik.setFieldValue("status", "draft");
    formik.setFieldValue("status_formatted", "Draft");
    setStatus("draft");
    console.log("Form values before submission:", formik.values);
    formik.handleSubmit(); // Trigger form submission
  };

  // Handle invoice date change
  const handleInvoiceDateChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue("date", date);
    formik.setFieldValue("date_formatted", formatDate(date));
  };

  // Handle due date change
  const handleDueDateChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue("never_expires",false)
    formik.setFieldValue("end_date", date);
    formik.setFieldValue("end_date_formatted", formatDate(date));
  };

  const toggleMode = () => {
    console.log("[toggleMode] Current isZoho:", isZoho);
    const newIsZoho = !isZoho;
    console.log("[toggleMode] Switching to:", newIsZoho ? "Zoho" : "Tally");

    setIsZoho(newIsZoho);
    localStorage.setItem("fromTally", (!newIsZoho).toString());

    // Save form data to localStorage
    const formData = {
      // Customer data
      customer_id: formik.values.customer_id,
      customer_name: formik.values.customer_name,
      billing_address: formik.values.billing_address,
      shipping_address: formik.values.shipping_address,
      gst_treatment: formik.values.gst_treatment,
      place_of_supply: formik.values.place_of_supply,
      place_of_supply_formatted: formik.values.place_of_supply_formatted,

      gst_no: formik.values.gst_no,
      isStatus: "Invoice",

      // Line items
      line_items: formik.values.line_items,

      // Dates
      date: formik.values.date,
      date_formatted: formik.values.date_formatted,
      expiry_date: formik.values.expiry_date,
      expiry_date_formatted: formik.values.expiry_date_formatted,

      // Tax and payment info
      tax_type: formik.values.tax_type,
      tax_percentage: formik.values.tax_percentage,
      discount_percent: formik.values.discount_percent,
      discount_amount: formik.values.discount_amount,
      tds_id: formik.values.tds_id,
      tcs_id: formik.values.tcs_id,
      payment_terms: formik.values.payment_terms,
      payment_terms_label: formik.values.payment_terms_label,
      repeat_every: formik.values.repeat_every,

      // Totals
      sub_total: formik.values.sub_total,
      tax_total: formik.values.tax_total,
      total: formik.values.total,
      adjustment: formik.values.adjustment,

      // Additional info
      notes: formik.values.notes,
      terms: formik.values.terms,
      reference_number: formik.values.reference_number,
      profile_name: formik.values.profile_name,
      recurrence_name: formik.values.recurrence_name,
      order_number: formik.values.order_number,
      invoice_number: formik.values.invoice_number,
      // Project and salesperson
      project: selectedProject,
      salesperson: selectedSalesperson,
    };

    localStorage.setItem("sharedFormData", JSON.stringify(formData));

    // Navigate to the appropriate page
    if (newIsZoho) {
      router.push("/sales/invoices/new");
    } else {
      router.push("/tally/voucher?isStatus=Invoice");
    }
  };

  const handleBack = () => {
    localStorage.removeItem("quote_id");
    localStorage.removeItem("customer_id");
    router.push("/sales/invoices");
  };

  // Add this function to calculate next invoice date
  const calculateNextInvoiceDate = (startDate, repeatEvery) => {
    // Parse the start date
    const [year, month, day] = startDate.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-based in JavaScript Date

    switch (repeatEvery) {
      case "Week":
        // Add 7 days
        date.setDate(date.getDate() + 7);
        break;
      case "2 Weeks":
        // Add 14 days
        date.setDate(date.getDate() + 14);
        break;
      case "Month":
        // Add one month while preserving the day
        date.setMonth(date.getMonth() + 1);
        break;
      case "2 Months":
        // Add two months while preserving the day
        date.setMonth(date.getMonth() + 2);
        break;
      case "3 Months":
        // Add three months while preserving the day
        date.setMonth(date.getMonth() + 3);
        break;
      case "6 Months":
        // Add six months while preserving the day
        date.setMonth(date.getMonth() + 6);
        break;
      case "Year":
        // Add one year while preserving the month and day
        date.setFullYear(date.getFullYear() + 1);
        break;
      case "2 Years":
        // Add two years while preserving the month and day
        date.setFullYear(date.getFullYear() + 2);
        break;
      case "3 Years":
        // Add three years while preserving the month and day
        date.setFullYear(date.getFullYear() + 3);
        break;
      default:
        return null;
    }

    // Format the date as YYYY-MM-DD
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
    const nextDay = String(date.getDate()).padStart(2, "0");

    return `${nextYear}-${nextMonth}-${nextDay}`;
  };

  // Add this function to convert repeat_every string to number
  const getRepeatEveryValue = (repeatEvery) => {
    switch (repeatEvery) {
      case "Week":
        return 7;
      case "2 Weeks":
        return 14;
      case "Month":
        return 30;
      case "2 Months":
        return 60;
      case "3 Months":
        return 90;
      case "6 Months":
        return 180;
      case "Year":
        return 365;
      case "2 Years":
        return 730;
      case "3 Years":
        return 1095;
      default:
        return 0;
    }
  };

  const RepeatEveryTerms = [
    { label: "Week", value: 1, key: "week" },
    { label: "2 Weeks", value: 2, key: "week" },
    { label: "Month", value: 1, key: "month" },
    { label: "2 Months", value: 2, key: "month" },
    { label: "3 Months", value: 3, key: "month" },
    { label: "6 Months", value: 6, key: "month" },
    { label: "Year", value: 1, key: "year" },
    { label: "2 Years", value: 2, key: "year" },
    { label: "3 Years", value: 3, key: "year" },
    { label: "Custom", value: 0, key: "custom" },
  ];

  // Function to fetch and update generated invoices and their payment records
  const updateGeneratedInvoicesAndPayments = async (recurringInvoiceData) => {
    try {
      // Removed: setPaymentUpdateStatus(prev => ({ ...prev, isUpdating: true }));
      
      const organization_id = localStorage.getItem("organization_id");
      
      console.log("🔍 Searching for generated invoices for recurring invoice:", recurring_invoice_id);
      
      // First, fetch all generated invoices for this recurring invoice
      console.log("🔍 Making API call to fetch generated invoices...");
      console.log("🔍 API URL:", `${config.SO_Base_url}/api/v1/invoices`);
      console.log("🔍 Params:", {
        organization_id: organization_id,
        recurring_invoice_id: recurring_invoice_id,
        page: 1,
        limit: 1000,
      });
      
      const invoicesResponse = await apiService({
        method: "GET",
        url: `/api/v1/invoices`,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: recurring_invoice_id,
          page: 1,
          limit: 1000, // Get all invoices
        },
        customBaseUrl: config.SO_Base_url,
      });

      console.log("📋 Invoices API Response:", invoicesResponse);
      console.log("📋 Response data:", invoicesResponse.data);
      console.log("📋 Response status:", invoicesResponse.status);
      console.log("📋 Response statusCode:", invoicesResponse.statusCode);

      if (!invoicesResponse.data) {
        console.log("❌ No response data received");
        return { success: false, error: "No response data", total: 0, updated: 0, failed: 0 };
      }

      if (!invoicesResponse.data.invoices) {
        console.log("❌ No invoices array in response");
        console.log("📋 Available keys in response:", Object.keys(invoicesResponse.data));
        return { success: true, total: 0, updated: 0, failed: 0 };
      }

      const generatedInvoices = invoicesResponse.data.invoices;
      console.log("✅ Found generated invoices:", generatedInvoices.length);

      let updatedInvoices = 0;
      let failedInvoices = 0;
      let totalPayments = 0;
      let updatedPayments = 0;
      let failedPayments = 0;

      // Update each generated invoice
      for (const invoice of generatedInvoices) {
        try {
          console.log(`🔄 Updating invoice: ${invoice.invoice_number}`);
          
          // Prepare updated invoice data
          const invoiceUpdateData = {
            customer_id: recurringInvoiceData.customer_id,
            customer_name: recurringInvoiceData.customer_name,
            billing_address: recurringInvoiceData.billing_address,
            shipping_address: recurringInvoiceData.shipping_address,
            line_items: recurringInvoiceData.line_items,
            tax_type: recurringInvoiceData.tax_type,
            tax_percentage: recurringInvoiceData.tax_percentage,
            tds_option: recurringInvoiceData.tds_option,
            tds_id: recurringInvoiceData.tds_id,
            tcs_id: recurringInvoiceData.tcs_id,
            sub_total: recurringInvoiceData.sub_total,
            tax_total: recurringInvoiceData.tax_total,
            total: recurringInvoiceData.total,
            payment_terms: recurringInvoiceData.payment_terms,
            payment_terms_label: recurringInvoiceData.payment_terms_label,
            place_of_supply: recurringInvoiceData.place_of_supply,
            gst_treatment: recurringInvoiceData.gst_treatment,
            reference_number: recurringInvoiceData.reference_number,
            order_number: recurringInvoiceData.order_number,
            // Keep the original invoice date and number
            date: invoice.date,
            invoice_number: invoice.invoice_number,
            status: invoice.status, // Keep original status
          };

          // Update the invoice
          console.log(`📝 Updating invoice ${invoice.invoice_number} with data:`, invoiceUpdateData);
          
          const updateResponse = await apiService({
            method: "PATCH",
            url: `/api/v1/invoices`,
            data: invoiceUpdateData,
            params: {
              organization_id: organization_id,
              invoice_id: invoice.invoice_id,
            },
            customBaseUrl: config.SO_Base_url,
          });

          console.log(`📋 Invoice update response:`, updateResponse);

          if (updateResponse.data && (updateResponse.data.status || updateResponse.statusCode === 200)) {
            updatedInvoices++;
            console.log(`✅ Updated invoice ${invoice.invoice_number}`);

            // Now update payment records for this invoice
            console.log(`🔍 Searching for payments for invoice: ${invoice.invoice_id}`);
            
            const paymentsResponse = await apiService({
              method: "GET",
              url: `/api/v1/payment/getPaymentsReceived`,
              params: {
                organization_id: organization_id,
                invoice_id: invoice.invoice_id,
                page: 1,
                limit: 1000,
              },
              customBaseUrl: config.SO_Base_url,
            });

            console.log(`💰 Payments API Response:`, paymentsResponse);

            if (paymentsResponse.data && paymentsResponse.data.payments) {
              const payments = paymentsResponse.data.payments;
              totalPayments += payments.length;
              console.log(`💰 Found ${payments.length} payments for invoice ${invoice.invoice_number}`);

              for (const payment of payments) {
                try {
                  console.log(`🔄 Updating payment: ${payment.payment_number}`);
                  
                  // Update payment record with new invoice data
                  const updatedPaymentData = {
                    customer_id: recurringInvoiceData.customer_id,
                    customer_name: recurringInvoiceData.customer_name,
                    amount: payment.amount,
                    payment_mode: payment.payment_mode,
                    deposite_to: payment.deposite_to,
                    reference_number: payment.reference_number,
                    date: payment.date,
                    description: payment.description,
                    // Update the invoice reference in payment
                    invoices: [{
                      invoice_id: invoice.invoice_id,
                      invoice_number: invoice.invoice_number,
                      amount: payment.amount,
                      balance: 0, // Assuming full payment
                    }],
                  };

                  console.log(`📝 Payment update data:`, updatedPaymentData);

                  const paymentUpdateResponse = await apiService({
                    method: "PUT",
                    url: `/api/v1/payment/individual/update`,
                    data: updatedPaymentData,
                    params: {
                      organization_id: organization_id,
                      payment_id: payment.payment_id,
                    },
                    customBaseUrl: config.SO_Base_url,
                  });

                  console.log(`📋 Payment update response:`, paymentUpdateResponse);

                  if (paymentUpdateResponse.data && (paymentUpdateResponse.data.status || paymentUpdateResponse.statusCode === 200)) {
                    updatedPayments++;
                    console.log(`✅ Updated payment ${payment.payment_number}`);
                  } else {
                    failedPayments++;
                    console.error(`❌ Failed to update payment ${payment.payment_number}:`, paymentUpdateResponse);
                  }
                } catch (paymentError) {
                  failedPayments++;
                  console.error(`💥 Error updating payment ${payment.payment_number}:`, paymentError);
                }
              }
            } else {
              console.log(`ℹ️ No payments found for invoice ${invoice.invoice_number}`);
            }
          } else {
            failedInvoices++;
            console.error(`Failed to update invoice ${invoice.invoice_number}`);
          }
        } catch (invoiceError) {
          failedInvoices++;
          console.error(`Error updating invoice ${invoice.invoice_number}:`, invoiceError);
        }
      }

      const result = {
        success: true,
        total: generatedInvoices.length,
        updated: updatedInvoices,
        failed: failedInvoices,
        totalPayments,
        updatedPayments,
        failedPayments,
      };

      console.log("Update result:", result);
      return result;

    } catch (error) {
      console.error("Error updating generated invoices and payments:", error);
      return {
        success: false,
        error: error.message,
        total: 0,
        updated: 0,
        failed: 0,
        totalPayments: 0,
        updatedPayments: 0,
        failedPayments: 0,
      };
    } // Removed: finally block with setPaymentUpdateStatus
  };

  return (
    <Box sx={{ overflowX: "hidden", backgroundColor: "#f6f6f6" }}>
      {/* Header */}
      <Grid
        container
        sx={{
          pr: 3,
          height: "70px",
          width: "100%",
          backgroundColor: "white",
          boxShadow: "0px 4px 4px rgba(29, 29, 29, 0.02)",
          px: 3,
          py: 1,
        }}
      >
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <LoopIcon size="3.5em" sx={{ fontSize: "inherit", mr: 1 }} />
            Edit Recurring Invoice
          </Typography>
          <Box>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={toggleMode}
              >
                {isZoho ? (
                  <ToggleOnIcon sx={{ color: "#336699", fontSize: 32 }} />
                ) : (
                  <ToggleOffIcon sx={{ color: "#888", fontSize: 32 }} />
                )}
                <Typography
                  variant="body1"
                  sx={{
                    ml: 1,
                    color: "#333",
                    fontSize: "14px",
                    lineHeight: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {"Zoho"}
                </Typography>
              </div>

              <IconButton
                aria-label="Close"
                sx={{ color: "red" }}
                onClick={handleBack}
              >
                <CloseIcon />
              </IconButton>
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
            </div>
          </Box>
        </Grid>
      </Grid>

      {/* Add this after the header section and before the customer name section */}
      <Grid sx={{ m: 2 }} xs={12}>
        {openAlert &&
          formik.values.general &&
          formik.values.general.length > 0 && (
            <Alert
              severity="error"
              icon={false}
              sx={{
                fontSize: "13px",
                mb: 2,
                "& ul": { margin: 0, paddingLeft: 2, listStyleType: "none" },
                "& li": { marginBottom: "4px" },
              }}
              onClose={() => {
                setOpenAlert(false);
                formik.setFieldValue("general", []);
              }}
              slotProps={{ closeButton: { sx: { color: "#fe4242" } } }}
            >
              <ul>
                {formik.values.general.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </Alert>
          )}
      </Grid>

      {/* Customer Name Section */}
      <Grid container spacing={2}>
        {/* Customer Name Section */}
        <Grid item xs={12}>
          <Grid
            container
            sx={{ px: 2, pb: 3, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
          >
            {/* Label */}
            <Grid item sx={formLabelStyle}>
              <Typography variant="subtitle2" sx={formLabelStyle}>
                Customer Name*
              </Typography>
            </Grid>

            {/* Combined Input + Search */}
            <Grid item sx={{ display: "flex", width: "500px", flexShrink: 0 }}>
              <FormControl
                sx={{
                  ...formControlStyle.combinedWithButton,
                  "& .MuiOutlinedInput-root": {
                    ...formControlStyle.combinedWithButton[
                      "& .MuiOutlinedInput-root"
                    ],
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              >
                <TextField
                  value={selectedCustomer?.contact_name || ""}
                  onClick={handleOpen}
                  placeholder="Select or add customer"
                  InputProps={{
                    sx: { fontSize: "13px" },
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <KeyboardArrowDownOutlinedIcon sx={commonIconStyle} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: "13px" } }}
                />

                {/* Customer Dropdown */}
                <Popover
                  id="customer-dropdown"
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  PaperProps={{
                    sx: { width: "435px", height: "300px", overflow: "none" },
                  }}
                >
                  <CustomerDropDown
                    onClose={handleClose}
                    open={open}
                    handleCustomerChange={handleCustomerChange}
                  />
                </Popover>
              </FormControl>

              {/* Search Button */}
              <IconButton sx={searchButtonStyle}>
                <SearchOutlinedIcon fontSize="medium" />
              </IconButton>

              {/* Currency Button - Only Visible if Currency Exists */}
              {customerData?.currency_code && (
                <Box sx={{ ml: 1 }}>
                  <IconButton
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      px: 2,
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#222",
                      backgroundColor: "#f5f5f5",
                      cursor: "default",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                    disableRipple
                  >
                    {customerData.currency_code.split("-")[0].trim()}
                  </IconButton>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Billing & Shipping Address */}
        {customerData !== null && (
          <Grid container>
            <Grid item xs={1.8}></Grid>
            <Grid item xs={8}>
              <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
                {/* Billing Address */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontSize: "14px",
                      color: "#4c526c",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Billing Address{" "}
                    {customerData?.billing_address && (
                      <IconButton
                        size="small"
                        sx={{ p: 0.5, height: "fit-content", color: "#757575" }}
                        onClick={(e) => handleClickBA(e, "edit")}
                      >
                        {/* <EditIcon sx={{ fontSize: "16px" }} /> */}
                      </IconButton>
                    )}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2.5,
                    }}
                  >
                    {customerData?.billing_address ? (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          color: "#363636",
                          lineHeight: 1.5,
                        }}
                      >
                        {[
                          customerData?.billing_address?.attention,
                          customerData?.billing_address?.address,
                          customerData?.billing_address?.street2,
                          customerData?.billing_address?.city,
                          [
                            customerData?.billing_address?.state,
                            customerData?.billing_address?.zip,
                          ]
                            .filter(Boolean)
                            .join(" "),
                          customerData?.billing_address?.country,
                          customerData?.billing_address?.phone
                            ? `Phone ${customerData?.billing_address?.phone}`
                            : null,
                          customerData?.billing_address?.fax
                            ? `Fax Number ${customerData?.billing_address?.fax}`
                            : null,
                        ]
                          .filter(Boolean)
                          .map((line, index) => (
                            <div
                              key={index}
                              style={{
                                fontWeight: index === 0 ? "600" : "400",
                              }}
                            >
                              {line}
                            </div>
                          ))}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          color: "#363636",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{ color: "#408dfb", cursor: "pointer" }}
                          onClick={(e) => handleClickBA(e, "add")}
                        >
                          + New Address
                        </span>
                      </Typography>
                    )}
                  </Box>
                  {/* Popover for Billing Address (Edit Icon Only) */}
                  <Popover
                    open={Boolean(anchorElBilling)}
                    anchorEl={anchorElBilling}
                    onClose={() => setAnchorElBilling(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <AddressDropdown
                      onClose={() => setAnchorElBilling(null)}
                      customerData={customerData}
                      setAddressData={setAddressData}
                      addressData={customerData?.billing_address}
                    />
                  </Popover>
                </Box>

                {/* Shipping Address */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontSize: "14px",
                      color: "#4c526c",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Shipping Address{" "}
                    {customerData?.shipping_address && (
                      <IconButton
                        size="small"
                        sx={{ p: 0.5, height: "fit-content", color: "#757575" }}
                        onClick={(e) => handleClickSA(e, "edit")}
                      >
                        {/* <EditIcon sx={{ fontSize: "16px" }} /> */}
                      </IconButton>
                    )}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2.5,
                    }}
                  >
                    {customerData?.shipping_address ? (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          color: "#363636",
                          lineHeight: 1.5,
                        }}
                      >
                        {[
                          customerData?.shipping_address?.attention,
                          customerData?.shipping_address?.address,
                          customerData?.shipping_address?.street2,
                          customerData?.shipping_address?.city,
                          [
                            customerData?.shipping_address?.state,
                            customerData?.shipping_address?.zip,
                          ]
                            .filter(Boolean)
                            .join(" "),
                          customerData?.shipping_address?.country,
                          customerData?.shipping_address?.phone
                            ? `Phone ${customerData?.shipping_address?.phone}`
                            : null,
                          customerData?.shipping_address?.fax
                            ? `Fax Number ${customerData?.shipping_address?.fax}`
                            : null,
                        ]
                          .filter(Boolean)
                          .map((line, index) => (
                            <div
                              key={index}
                              style={{
                                fontWeight: index === 0 ? "bold" : "400",
                              }}
                            >
                              {line}
                            </div>
                          ))}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          color: "#363636",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{ color: "#408dfb", cursor: "pointer" }}
                          onClick={(e) => handleClickSA(e, "add")}
                        >
                          + New Address
                        </span>
                      </Typography>
                    )}
                  </Box>
                  {/* Popover for Shipping Address (Edit Icon Only) */}
                  <Popover
                    open={Boolean(anchorElShipping)}
                    anchorEl={anchorElShipping}
                    onClose={() => setAnchorElShipping(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <AddressDropdown
                      onClose={() => setAnchorElShipping(null)}
                      customerData={customerData}
                      setAddressData={setAddressData}
                      addressData={customerData?.shipping_address}
                    />
                  </Popover>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Remarks */}
        {customerData !== null && customerData?.notes !== "" && (
          <Grid container>
            <Grid item xs={1.8}></Grid>
            <Grid item xs={8}>
              <Box sx={{ my: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "14px",
                    color: "#4c526c",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  Remarks
                </Typography>
                <Typography variant="bottom" sx={{ fontSize: "13px" }}>
                  {customerData?.notes || "No remarks available"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* GST Treatment */}
        {customerData !== null && customerData?.gst_treatment !== "" && (
          <Grid container>
            <Grid item xs={1.8}></Grid>
            <Grid item xs={8}>
              <Box sx={{ my: 2, fontSize: "13px" }}>
                <Typography variant="body2" color="#4c526c">
                  GST Treatment:
                  <Typography
                    component="span"
                    sx={{ color: "#000", cursor: "pointer", fontSize: "13px" }}
                  >
                    {customerData?.gst_treatment}
                    {customerData?.gst_treatment && (
                      <IconButton
                        size="small"
                        sx={{ p: 0.5, height: "fit-content", color: "#757575" }}
                        onClick={handleEditClick}
                      >
                        <EditIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    )}
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* GSTIN Section */}
        {customerData !== null && customerData?.gst_treatment !== "" && (
          <Grid container>
            <Grid item xs={1.8}></Grid>
            <Grid item xs={8}>
              <Box sx={{ fontSize: "13px" }}>
                <Typography variant="body3" color="#4c526c">
                  GSTIN:
                  <Typography
                    component="span"
                    sx={{ color: "#000", cursor: "pointer", fontSize: "13px" }}
                  >
                    {customerData?.gst_no || "Not provided"}
                    <IconButton
                      size="small"
                      sx={{ p: 0.5, height: "fit-content", color: "#757575" }}
                      onClick={handleGSTINClick}
                    >
                      <EditIcon sx={{ fontSize: "16px" }} />
                    </IconButton>
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Tax Preferences Popover */}
        <TaxPreferencesPopover
          anchorEl={anchorElEdit}
          open={openEdit}
          onClose={handleCloseEdit}
          customerData={customerData}
          onUpdate={handleUpdateEdit}
        />

        {/* GSTIN Popover */}
        <GSTIn
          anchorEl={anchorElGSTIN}
          open={openGSTIN}
          onClose={handleCloseGSTIN}
          customerData={customerData}
          onUpdate={handleUpdateGSTIN}
        />

        {/* Place of Supply Section */}
        {customerData !== null && customerData.gst_treatment !== "Overseas" && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid
                container
                sx={{
                  px: 2,
                  pb: 3,
                  pt: 4,
                  ...formRowStyle,
                  flexWrap: "nowrap",
                  ml: 2,
                }}
              >
                {/* Label */}
                <Grid item sx={formLabelStyle}>
                  <Typography variant="subtitle2" sx={formLabelStyle}>
                    Place of supply*
                  </Typography>
                </Grid>

                {/* Combined Input + Search */}
                <Grid
                  item
                  sx={{ display: "flex", width: "450px", flexShrink: 0 }}
                >
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{ width: 320, ...commonStyles }}
                    error={Boolean(
                      formik.touched.place_of_supply &&
                        formik.errors.place_of_supply
                    )}
                  >
                    <Autocomplete
                      options={INDIAN_STATES}
                      size="small"
                      getOptionLabel={(option) =>
                        `[${option.code}] - ${option.name}`
                      }
                      // value={ INDIAN_STATES.find(
                      //   (state) =>
                      //     state.name === formik.values.place_of_supply
                      // ) ||selectedCustomer?.place_of_supply || ""}

                      value={
                        INDIAN_STATES.find(
                          (state) =>
                            state.name === formik.values.place_of_supply
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        console.log(newValue, "newValuenewValuenewValue");

                        formik.setFieldValue(
                          "place_of_supply",
                          newValue ? newValue.name : ""
                        );
                        formik.setFieldValue(
                          "place_of_supply_formatted",
                          newValue ? newValue.code : ""
                        );
                      }}
                      onBlur={formik.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: false,
                            sx: { fontSize: "13px" },
                          }}
                          sx={{ width: "320px" }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: "7px", // <-- Apply here
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{ fontSize: "13px", padding: "6px 12px" }}
                        >
                          [{option.code}] - {option.name}
                        </li>
                      )}
                      sx={{ width: 350 }}
                      PopperComponent={StyledPopper}
                    />

                    {formik.touched.place_of_supply &&
                      formik.errors.place_of_supply && (
                        <FormHelperText error>
                          {formik.errors.place_of_supply}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Box
        sx={{
          pr: 22,
          width: "100%",
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* profile name  */}
        <Grid
          container
          sx={{ px: 2, pt: 2, ...formRowStyle, flexWrap: "nowrap" }}
        >
          <Grid item sx={formLabelStyle}>
            <Typography variant="subtitle2" sx={formLabelStyle}>
              Profile Name *
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
            <TextField
              fullWidth
              id="recurrence_name"
              name="recurrence_name"
              value={formik.values.recurrence_name || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(
                formik.touched.recurrence_name && formik.errors.recurrence_name
              )}
              helperText={
                formik.touched.recurrence_name && formik.errors.recurrence_name
                  ? formik.errors.recurrence_name
                  : ""
              }
              sx={{
                ...commonInputStyle,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000",
                },
              }}
            />
          </Grid>
        </Grid>
        {/* order number */}
        <Grid
          container
          sx={{ px: 2, pt: 2, ...formRowStyle, flexWrap: "nowrap" }}
        >
          <Grid item sx={formLabelBlackStyle}>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Order Number
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
            <TextField
              fullWidth
              id="reference_number"
              name="reference_number"
              value={formik.values.reference_number || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(
                formik.touched.reference_number &&
                  formik.errors.reference_number
              )}
              helperText={
                formik.touched.reference_number &&
                formik.errors.reference_number
                  ? formik.errors.reference_number
                  : ""
              }
              sx={{
                ...commonInputStyle,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000",
                },
              }}
            />
          </Grid>
        </Grid>

        {/* REPEAT EVERY */}
        <Grid
          item
          sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1, my: 2 }}
        >
          <Typography variant="subtitle2" sx={{ ...formLabelStyle }}>
            Repeat Every*
          </Typography>
          <FormControl sx={{ width: "220px" }}>
            <Select
              id="repeat_every"
              name="repeat_every"
              value={formik.values.repeat_value}
              onBlur={formik.handleBlur}
              error={
                formik.touched.repeat_every &&
                Boolean(formik.errors.repeat_every)
              }
              displayEmpty
              sx={{
                ...commonInputStyle,
                width: "320px",
                ml: 5,
                borderRadius: "7px",
              }}
              renderValue={(selected) => selected || "Search"}
              MenuProps={{
                PaperProps: {
                  sx: {
                    "& .MuiMenuItem-root": {
                      fontSize: "13px",
                    },
                    maxHeight: 250,
                    overflowY: "auto",
                  },
                },
              }}
            >
              {RepeatEveryTerms.map((term) => (
                <MenuItem
                  key={term.label}
                  onClick={() => {
                    // Set the frequency type (week, month, year)
                    formik.setFieldValue("recurrence_frequency", term.key);
                    // Set the numeric value (1, 2, 3, etc.)
                    formik.setFieldValue("repeat_every", term.value);
                    // Set the display value (Week, 2 Weeks, Month, etc.)
                    formik.setFieldValue("repeat_value", term.label);
                  }}
                  value={term.label}
                  sx={{ fontSize: "14px" }}
                >
                  {term.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Date Fields */}
        <Grid container sx={{ px: 2, pt: 2, display: "flex" }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              justifyContent: "space-between",
            }}
          >
            {/* Invoice Date */}
            <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle2" sx={{ ...formLabelBlackStyle }}>
                Start On
              </Typography>
              <TextField
                fullWidth
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={handleInvoiceDateChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.date && formik.errors.date)}
                helperText={
                  formik.touched.date && formik.errors.date
                    ? formik.errors.date
                    : ""
                }
                sx={{ ...commonInputStyle, width: "320px", mr: 8, ml: 5 }}
              />
            </Grid>
            {/* Due Date */}
            <Grid
              item
              sx={{ display: "flex", alignItems: "center", gap: 3, mr: 50 }}
            >
              {/* Ends On Date Field */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "0.875rem",
                    minWidth: "90px",
                    whiteSpace: "nowrap",
                    color: "error.main",
                    color: "black",
                    whiteSpace: "nowrap",
                  }}
                >
                  Ends On
                </Typography>
                <TextField
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formik.values.end_date}
                  onChange={handleDueDateChange}
                  placeholder="dd/MM/yyyy"
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.touched.end_date && formik.errors.end_date
                  )}
                  helperText={
                    formik.touched.end_date && formik.errors.end_date
                      ? formik.errors.end_date
                      : ""
                  }
                  sx={{
                    ...commonInputStyle,
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      cursor: "pointer",
                    },
                    '& input[type="date"]::-webkit-datetime-edit': {
                      color: formik.values.end_date ? "inherit" : "#666",
                    },
                  }}
                  inputProps={{
                    min: formik.values.date,
                    style: {
                      colorScheme: "light dark",
                    },
                  }}
                />
              </Box>

              {/* Never Expires Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    id="never_expires"
                    name="never_expires"
                    size="small"
                    checked={formik.values.never_expires || false}
                    onChange={(e) => {
                      // Clear the date when checkbox is checked
                      if (e.target.checked) {
                        formik.setFieldValue("end_date", "");
                      }
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                  />
                }
                label="Never expires"
                sx={{
                  marginLeft: "auto",
                  whiteSpace: "nowrap",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "14px",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Terms - Dropdown with Search */}
        <Grid
          item
          sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1, my: 2 }}
        >
          <Typography variant="subtitle2" sx={{ ...formLabelBlackStyle }}>
            Payment Terms
          </Typography>
          <Select
            id="payment_terms"
            name="payment_terms"
            value={formik.values.payment_terms_label}
            onChange={(e) => {
              // Store the display value in payment_terms
              formik.setFieldValue("payment_terms_label", e.target.value);

              // Also set the numeric value for payment_terms_id
              let numericValue = 0;
              switch (e.target.value) {
                case "Due On Receipt":
                  numericValue = 0;
                  break;
                case "Net 15":
                  numericValue = 15;
                  break;
                case "Net 30":
                  numericValue = 30;
                  break;
                case "Net 45":
                  numericValue = 45;
                  break;
                case "Net 60":
                  numericValue = 60;
                  break;
                default:
                  numericValue = 0;
              }
              formik.setFieldValue("payment_terms_id", numericValue);
              formik.setFieldValue("payment_terms", numericValue);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.payment_terms &&
              Boolean(formik.errors.payment_terms)
            }
            displayEmpty
            sx={{
              ...commonInputStyle,
              width: "320px",
              borderRadius: "7px",
              ml: 5,
              fontSize: "14px",
            }}
            renderValue={(selected) => selected || "Search"}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 250,
                  overflowY: "auto",
                },
              },
            }}
          >
            {/* Dropdown Options */}
            {[
              "Net 15",
              "Net 30",
              "Net 45",
              "Net 60",
              "Due On Receipt",
              "Due end of the month",
              "Due end of next month",
              "Custom",
            ].map((term) => (
              <MenuItem
                key={term}
                value={term}
                sx={{
                  fontSize: "14px",
                  "&:hover": {
                    bgcolor: "#408dfb",
                    color: "white",
                    fontSize: "14px",
                  },
                }}
              >
                {term}
              </MenuItem>
            ))}

            <MenuItem>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <IconButton size="small" sx={{ color: "#408dfb" }}>
                  <Settings size={18} />
                </IconButton>

                <Typography
                  variant="body1"
                  sx={{ ml: 1, color: "#408dfb", fontSize: "14px" }}
                >
                  Configure Terms
                </Typography>
              </Box>
            </MenuItem>
          </Select>
        </Grid>

        <SectionDivider sx={{ my: 4 }} />

        <Grid container sx={{ px: 2, flexWrap: "nowrap" }}>
          {/* Salesperson Label */}
          <Grid item sx={formLabelBlackStyle}>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Salesperson
            </Typography>
          </Grid>

          {/* Salesperson Input Field */}
          <Grid
            item
            sx={{
              display: "flex",
              width: "360px",
              flexShrink: 0,
              ml: 6,
            }}
          >
            <FormControl sx={formControlStyle.combinedWithButton}>
              <TextField
                ref={anchorRef}
                value={selectedSalesperson?.salesperson_name || ""}
                onClick={handleOpenDropdown}
                placeholder="Select or Add Salesperson"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <KeyboardArrowDownOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>

          {/* Popper (Dropdown under input) */}
          <Popper
            open={openDropdown}
            anchorEl={anchorElSales}
            placement="bottom-start"
            sx={{ zIndex: 1300, width: "360px" }}
          >
            <Box
              ref={dropdownRef}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 3,
                p: 2,
                borderRadius: 1,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <ProjectSelector
                closeDropdown={handleCloseDropdown}
                onSelect={(selectedPerson) => {
                  setSelectedSalesperson(selectedPerson);
                  formik.setFieldValue(
                    "salesperson_id",
                    selectedPerson?.salesperson_id
                  );
                  formik.setFieldValue(
                    "salesperson_name",
                    selectedPerson?.salesperson_name
                  );
                }}
                formik={formik}
              />
            </Box>
          </Popper>
        </Grid>
        <Grid
          container
          sx={{ px: 2, pt: 2, ...formRowStyle, flexWrap: "nowrap" }}
        >
          <Grid item sx={formLabelBlackStyle}>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Associate Project(s){" "}
            </Typography>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Hours{" "}
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
            <Grid item sx={formLabelBlackStyle}>
              <Typography variant="body2" sx={{color:"#6C718A", fontStyle: "italic"}}>
                There are no active projects for this customer.{" "}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <SectionDivider sx={{ my: 4 }} />

        {/* Subject */}

        <Grid container sx={{ ...formRowStyle, px: 2, mb: 3 }}>
          <Grid item xs={12} md={5} sx={formRowStyle}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pr: 6.19,
                position: "sticky",
                gap: 0,
                mb: { xs: 1, md: 0 },
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  ...formLabelBlackStyle,
                  mr: -8,
                }}
              >
                Subject
              </Typography>
              <FontAwesomeIcon icon={faInfoCircle} sx={commonIconStyle} />
            </Box>
            <Box
              sx={{
                ...commonTextareaStyle,
                minWidth: "318px",
                "&:hover": commonTextareaStyle["&:hover"],
                "&:focus-within": commonTextareaStyle["&:focus"],
              }}
            >
              <TextareaAutosize
                id="subject"
                placeholder="Let your customer know what this invoice is for"
                minRows={1}
                style={{ ...commonTextareaInputStyle,  minHeight:"50px", maxHeight:"200px" }}
              />
            </Box>
          </Grid>
        </Grid>
        <SectionDivider sx={{ my: 4 }} />
        {/* Item Table Section */}
        <Box sx={{ py: 4 }}>
          <ItemTable formik={formik} />
        </Box>
      </Box>

      {/* Terms & Conditions and File Attachments */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        {/* Terms & Conditions */}
        <Grid item xs={8} sx={{ ml: 2, mt:2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              ...formLabelBlackStyle,
            }}
          >
            Terms & Conditions
          </Typography>
          <Box
            sx={{
              ...commonTextareaStyle,
              minWidth: "318px",
              "&:hover": commonTextareaStyle["&:hover"],
              "&:focus-within": commonTextareaStyle["&:focus"],
            }}
          >
            <TextareaAutosize
              id="terms"
              name="terms"
              value={formik.values.terms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.terms && Boolean(formik.errors.terms)}
              minRows={3}
              placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
              style={{ ...commonTextareaInputStyle }}
            />
          </Box>
        </Grid> 

        
      </Grid>
      {/* <SectionDivider sx={{ my: 4 }} /> */}

      <Box sx={{ backgroundColor: "white", pt: 3, px: 3 }}>
        {/* Payment Gateway Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            component="span"
            sx={{ fontWeight: "medium" }}
          >
            Want to get paid faster?
          </Typography>
          <Box component="span" sx={{ display: "inline-flex", ml: 1 }}>
            {/* {["/mastercard-icon.png", "/visa-icon.png"].map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt="Card"
                  sx={{ height: 20, width: 20, mx: 0.5 }}
                />
              ))} */}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Configure payment gateways and receive payments online.{" "}
            <Typography
              component="span"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              Set up Payment Gateway
            </Typography>
          </Typography>
        </Box>

        <Grid container>
          <Grid item xs={12}>
            {customerData && customerData?.contact_id && (
              <EmailCommunications
                formik={formik}
                contactId={customerData?.contact_id}
              />
            )}{" "}
          </Grid>
        </Grid>

        {/* Custom Fields Section */}
        <Box
          sx={{
            pt: 2,
            height: "70px",
            width: "100%",
            position: "sticky",
            top: 0,
            pb: 14,
            borderTop: "1px solid #ddd",
            // boxShadow: "0px -4px 2px rgba(59, 59, 59, 0.03)",
            bgcolor: "white",
            alignItems: "center",
          }}
        >
          <Grid container sx={{ ml: 2, mr: 2 }}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.875rem" }}
            >
              <span style={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Preferences :{" "}
              </span>
              Create Invoices as Drafts
            </Typography>
          </Grid>
        </Box>

        {/* <Divider sx={{ my: 2 }} /> */}

        {/* Bottom Action Bar */}
        <Box
          sx={{
            height: "70px",
            width: "100%",
            position: "fixed",
            bottom: 0,
            zIndex: 1000,
            boxShadow: "0px -4px 5px rgba(0, 0, 0, 0.06)",
            bgcolor: "white",
            alignItems: "center",
            padding: "0 16px",
            ml: -3,
            display: "flex",
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <Button
                variant="contained"
                sx={{
                  marginRight: "8px",
                }}
                onClick={() => {
                  console.log("Save button clicked");
                  handleSave();
                }}
                type="button"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                <span style={formLabelBlackStyle}>Template:</span>
                <span style={{ ...formLabelBlackStyle, color: "gray" }}>
                  {" "}
                  `Spreadsheet Template`{" "}
                </span>
                {/* <Button
                  variant="text"
                  sx={{
                    ...formLabelBlackStyle,
                    color: "rgb(29, 127, 207)",
                    textTransform: "none",
                    ml: -4,
                  }}
                >
                  Change
                </Button> */}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Modal
        open={addressModalOpen}
        onClose={handleCloseAddressModal}
        aria-labelledby="address-modal-title"
        aria-describedby="address-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <BillingAddress
            onClose={handleCloseAddressModal}
            open={addressModalOpen}
            editData={addressData}
            address={addressType}
            title={
              addressType === "billing" ? "Billing Address" : "Shipping Address"
            }
            contactId={customerData?.contact_id}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default InvoiceCreationPage;
