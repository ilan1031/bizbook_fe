"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import apiService from "../../../../../services/axiosService";
import {
  Box,
  Typography,
  ClickAwayListener,
  Popover,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputAdornment,
  ListSubheader,
  List,
  Button,
  Paper,
  Grid,
  IconButton,
  Divider,
  Dialog,
  ListItem,
  ListItemText,
  Checkbox,
  DialogTitle,
  Modal,
  Menu,
  Link,
  DialogContent,
  InputLabel,
  DialogActions,
  ListItemSecondaryAction,
} from "@mui/material";
import { useFormik } from "formik";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadIcon from "@mui/icons-material/Upload";
import { useRouter, useSearchParams } from "next/navigation";
import config from "../../../../../services/config";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSnackbar } from "../../../../../components/SnackbarProvider";
import PaymentTermsConfig from "../../../../common/otherdetailsvendor/configurePaymentTerms/PaymentTermsConfig";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Define styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontSize: "13px",
    borderRadius: "7px",
    height: "35px",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#408dfb",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#408dfb",
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: "13px",
  borderRadius: "7px",
  height: "35px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#408dfb",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#408dfb",
  },
}));

// Common styles
const commonStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "7px",
    backgroundColor: "#fff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#408dfb",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#408dfb",
    },
  },
};

// Form label style
const formLabelStyle = {
  width: "160px",
  fontSize: "13px",
  color: "#d62134",
};

// Define validation schema
const validationSchema = Yup.object({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  date: Yup.date().required("Date is required"),
  payment_mode: Yup.string().required("Payment mode is required"),
  // customer_id: Yup.string().required("Customer is required"),
});
const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};
// Payment mode options
const paymentModes = [
  "Cash",
  "Check",
  "Credit Card",
  "Bank Transfer",
  "PayPal",
  "Stripe",
  "Google Pay",
  "Apple Pay",
  "Venmo",
  "Other",
];

// Main component
const CustomerAdvance = () => {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  // Customer states
  const searchInputRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentTermsSearch, setPaymentTermsSearch] = useState("");
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState(false);
  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("payment_id");

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [openGstDialog, setOpenGstDialog] = useState(false);
  const [openPanDialog, setOpenPanDialog] = useState(false);
  const [gstTreatment, setGstTreatment] = useState(
    "Registered Business - Composition"
  );
  const [gstin, setGstin] = useState("33AAACB2902M1Z0");
  const [makePermanent, setMakePermanent] = useState(false);
  const [panNumber, setPanNumber] = useState("");
  const [paymentDataCustomerId, setPaymentDataCustomerId] = useState(null);

  const gstinRequiredLabels = [
    "Registered Business - Regular",
    "Registered Business - Composition",
    "Special Economic Zone",
    "Deemed Export",
    "Tax Deductor",
    "SEZ Developer",
  ];

  const options = [
    {
      label: "Registered Business - Regular",
      desc: "Business registered under GST",
    },
    {
      label: "Registered Business - Composition",
      desc: "Business that is registered under the Composition Scheme in GST",
    },
    {
      label: "Unregistered Business",
      desc: "Business that has not been registered under GST",
    },
    { label: "Consumer", desc: "A customer who is a regular consumer" },
    {
      label: "Overseas",
      desc: "Persons with whom you do import or export of supplies outside India",
    },
    {
      label: "Special Economic Zone",
      desc: "Business (Unit) located in an SEZ of India or a SEZ Developer",
    },
    {
      label: "Deemed Export",
      desc: "Supply of goods to an Export Oriented Unit or against Export Promotion schemes",
    },
    {
      label: "Tax Deductor",
      desc: "Government departments, agencies or authorities",
    },
    {
      label: "SEZ Developer",
      desc: "Owns at least 26% of equity in SEZ units",
    },
  ];

  // Filter payment modes based on search
  const filteredPaymentModes = paymentModes.filter((mode) =>
    mode.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );

  const selectCustId = (customer) => {
    setSelectedCustomer(customer);

    console.log(customer.contact_id, "The Selected Customer");
    formik.setFieldValue("customer_id", customer.contact_id);
    formik.setFieldValue("customer_name", customer.contact_name);

    setCustomerDropdownOpen(false);
  };

  // Handle dropdown opening and closing
  const handleOpen = () => {
    setIsOpen(true);
    setSearchValue("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue("");
    setOpen(false);
    setMakePermanent(false);
  };
  const shouldShowGstin = gstinRequiredLabels.includes(gstTreatment);

  const handleClickPanOpen = () => {
    setPanNumber(selectedCustomer?.pan_no || "");
    setOpenPanDialog(true);
  };

  const handleClosePanDialog = () => setOpenPanDialog(false);
  const handleCloseGstDialog = () => setOpenGstDialog(false);

  const handlePanChange = (e) => setPanNumber(e.target.value.toUpperCase());
  const handleGstTreatmentChange = (e) => setGstTreatment(e.target.value);
  const handleGstinChange = (e) => setGstin(e.target.value);

  const handleGetTaxpayerDetails = () => {
    console.log("Getting taxpayer details for GSTIN:", gstin);
  };

  const handlePanUpdate = () => {
    console.log("Updated PAN:", panNumber);
    console.log("Make permanent:", makePermanent);
    handleClosePanDialog();
  };

  const handleGstUpdate = () => {
    console.log("Updated GST Treatment:", gstTreatment);
    console.log("GSTIN:", gstin);
    console.log("Make permanent:", makePermanent);
    handleCloseGstDialog();
  };
  // Handle selection
  const handleSelection = (value) => {
    formik.setFieldValue("deposite_to", value);
    handleClose();
  };

  const organization_id =
    typeof window !== "undefined"
      ? localStorage.getItem("organization_id")
      : null;

  // Filter customers based on customer search query
  const filteredCustomers = customers.filter((customer) =>
    customer.contact_name
      .toLowerCase()
      .includes(customerSearchQuery.toLowerCase())
  );
  const INDIAN_STATES = [
    { code: "AN", name: "Andaman and Nicobar Islands" },
    { code: "AD", name: "Andhra Pradesh" },
    { code: "AR", name: "Arunachal Pradesh" },
    { code: "AS", name: "Assam" },
    { code: "BR", name: "Bihar" },
    { code: "CH", name: "Chandigarh" },
    { code: "CG", name: "Chhattisgarh" },
    { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "DD", name: "Daman and Diu" },
    { code: "DL", name: "Delhi" },
    { code: "FC", name: "Foreign Country" },
    { code: "GA", name: "Goa" },
    { code: "GJ", name: "Gujarat" },
    { code: "HR", name: "Haryana" },
    { code: "HP", name: "Himachal Pradesh" },
    { code: "JK", name: "Jammu and Kashmir" },
    { code: "JH", name: "Jharkhand" },
    { code: "KA", name: "Karnataka" },
    { code: "KL", name: "Kerala" },
    { code: "LA", name: "Ladakh" },
    { code: "LD", name: "Lakshadweep" },
    { code: "MP", name: "Madhya Pradesh" },
    { code: "MH", name: "Maharashtra" },
    { code: "MN", name: "Manipur" },
    { code: "ML", name: "Meghalaya" },
    { code: "MZ", name: "Mizoram" },
    { code: "NL", name: "Nagaland" },
    { code: "OD", name: "Odisha" },
    { code: "OT", name: "Other Territory" },
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

  const filteredStates = INDIAN_STATES.filter((state) =>
    `${state.code} - ${state.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const TAX_OPTIONS = [
    "IGST0 [0%]",
    "IGST5 [5%]",
    "IGST12 [12%]",
    "IGST18 [18%]",
    "IGST28 [28%]",
  ];

  const handleTaxChange = (e) => {
    const selectedTax = e.target.value;
    formik.setFieldValue("tax_account_name", selectedTax);
    // Add logic to calculate expense_tax_amount if needed
  };

  // Search filtering function
  const handleTaxSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    document.querySelectorAll("[data-tax-item]").forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchText) ? "block" : "none";
    });
  };

  // Account options for paid through
  const allPaidThroughOptions = [
    { label: "Petty Cash", group: "Cash" },
    { label: "Undeposited Funds", group: "Cash" },
    { label: "Employee Reimbursements", group: "Other Current Liability" },
    { label: "Opening Balance Adjustments", group: "Other Current Liability" },
    { label: "TDS Payable", group: "Other Current Liability" },
    { label: "TCS Payable", group: "Other Current Liability" },
  ];

  // Filter options based on search input
  const filteredOptions = allPaidThroughOptions.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Process options to group them
  const groupedOptions = filteredOptions.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const [anchorEl, setAnchorEl] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleArrowClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
    handleMenuClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first selected file

    if (!selectedFile) return;

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showMessage(`"${selectedFile.name}" exceeds the 10MB limit.`, "error");
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      showMessage(
        `"${selectedFile.name}" is not a valid file type. Allowed types: PDF, JPEG, PNG.`,
        "error"
      );
      return;
    }

    // Set preview for images
    if (selectedFile.type.startsWith("image/")) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewFile(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      setPreviewFile(null); // No preview for non-image files
    }

    // Set the selected file
    setFiles([selectedFile]); // Replace any previous files
    formik.setFieldValue("documents", selectedFile); // Update Formik field
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Initialize form with values that match model fields
  const formik = useFormik({
    initialValues: {
      payment_id: "",
      payment_number: "",
      payment_link_id: "",
      created_time: "",
      updated_time: "",
      payment_number_prefix: "",
      payment_number_suffix: "",
      deposite_to: "Petty Cash",
      documents: [],
      customer_id: "",
      place_of_supply: "",
      customer_name: "",
      is_portal_enabled: false,
      payment_mode: "Cash",
      card_type: "",
      card_type_formatted: "",
      date: today,
      date_formatted: "",
      offline_created_date_with_time: "",
      offline_created_date_with_time_formatted: "",
      is_pre_gst: false,
      account_id: "",
      account_name: "",
      account_type: "",
      account_type_formatted: "",
      customer_advance_account_id: "",
      customer_advance_account_name: "",
      currency_id: "",
      currency_symbol: "",
      currency_code: "",
      exchange_rate: 1,
      exchange_rate_formatted: "",
      amount: "",
      amount_formatted: "",
      unused_amount: 0,
      unused_amount_formatted: "",
      bank_charges: 0.0,
      bank_charges_formatted: "₹0.00",
      tax_account_id: "",
      is_client_review_settings_enabled: false,
      tax_account_name: "",
      tax_amount_withheld: 0.0,
      tax_amount_withheld_formatted: "₹0.00",
      description: "",
      product_description: "",
      reference_number: "",
      online_transaction_id: "",
      payment_gateway: "",
      payment_gateway_formatted: "",
      settlement_status: "",
      settlement_status_formatted: "",
      tds_type: "",
      tds_tax_id: "",
      invoices: [],
      payment_status: "",
      payment_status_formatted: "",
      payment_refunds: [],
      comments: [],
      last_four_digits: "",
      template_id: "",
      template_name: "",
      page_width: "",
      page_height: "",
      orientation: "",
      template_type: "",
      template_type_formatted: "",
      attachment_name: "",
      can_send_in_mail: true,
      can_send_payment_sms: true,
      is_payment_details_required: true,
      custom_fields: [],
      custom_field_hash: {},
      imported_transactions: [],
      price_precision: 2,
      balance_due_amount: 0,
      is_advance_payment: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      console.log("Formik submit working", formik.values);

      if (!values.customer_id) {
        showMessage("Please select a customer", "error");
        setSubmitting(false);
        return;
      }

      try {
        const submitValues = {
          ...values,
          organization_id: organization_id,
          payment_id: payment_id,
          is_advance_payment: true,
        };

        submitValues.date_formatted = formatDate(values.date);

        const params = {
          method: payment_id ? "PUT" : "POST",
          url: payment_id
            ? `/api/v1/payment/individual/update?organization_id=${organization_id}&payment_id=${payment_id}`
            : `/api/v1/payment/customerpayments?organization_id=${organization_id}`,
          data: submitValues,
          customBaseUrl: config.SO_Base_url,
        };

        const response = await apiService(params);
        console.log(response, "response");
        if (response.statusCode === 200) {
          showMessage(
            `Customer advance ${
              payment_id ? "updated" : "created"
            } successfully!`,
            "success"
          );
          resetForm();
          payment_id
            ? router.push(`/sales/paymentsReceived/${payment_id}`)
            : router.push(`/sales/paymentsReceived`);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        if (error.status === false) {
          showMessage(`Failed to submit: ${error.message}`, "error");
        } else {
          showMessage(
            "Failed to submit the payment. Please try again.",
            "error"
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/customers?organization_id=${organization_id}`,
        });
        console.log(response.data, "customer data");
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (organization_id) {
      fetchCustomers();
    }

    if (payment_id) {
      getPaymentData();
    }
  }, [organization_id, payment_id]);

  const getPaymentData = async () => {
    setLoading(true);
    try {
      let params = {
        url: `/api/v1/payment/individual?organization_id=${organization_id}&payment_id=${payment_id}`,
        method: "GET",
        customBaseUrl: config.SO_Base_url,
      };
      let response = await apiService(params);
      if (response.statusCode === 200) {
        let paymentData = response.data.data;
        if (paymentData.customer_id) {
          setPaymentDataCustomerId(paymentData.customer_id);
        }

        // Set form values
        formik.setValues({
          payment_id: paymentData.payment_id || "",
          payment_number: paymentData.payment_number || "",
          payment_link_id: paymentData.payment_link_id || "",
          created_time: paymentData.created_time || "",
          updated_time: paymentData.updated_time || "",
          deposite_to: paymentData.deposite_to || "Petty Cash",
          payment_number_prefix: paymentData.payment_number_prefix || "",
          payment_number_suffix: paymentData.payment_number_suffix || "",
          documents: paymentData.documents || [],
          customer_id: paymentData.customer_id || "",
          customer_name: paymentData.customer_name || "",
          is_portal_enabled: paymentData.is_portal_enabled || false,
          payment_mode: paymentData.payment_mode || "Cash",
          card_type: paymentData.card_type || "",
          card_type_formatted: paymentData.card_type_formatted || "",
          date: paymentData.date
            ? new Date(paymentData.date).toISOString().split("T")[0]
            : today,
          date_formatted: paymentData.date_formatted || "",
          reference_number: paymentData.reference_number || "",
          amount: paymentData.amount || 0,
          amount_formatted: paymentData.amount_formatted || "",
          paid_through_account_id: paymentData.paid_through_account_id || "",
          account_id: paymentData.account_id || "",
          account_name: paymentData.account_name || "",
          account_type: paymentData.account_type || "",
          account_type_formatted: paymentData.account_type_formatted || "",
          customer_advance_account_id:
            paymentData.customer_advance_account_id || "",
          customer_advance_account_name:
            paymentData.customer_advance_account_name || "",
          currency_id: paymentData.currency_id || "",
          currency_symbol: paymentData.currency_symbol || "",
          currency_code: paymentData.currency_code || "",
          place_of_supply: paymentData.place_of_supply || "",
          exchange_rate: paymentData.exchange_rate || 1,
          exchange_rate_formatted: paymentData.exchange_rate_formatted || "",
          unused_amount: paymentData.unused_amount || 0,
          unused_amount_formatted: paymentData.unused_amount_formatted || "",
          bank_charges: paymentData.bank_charges || 0.0,
          tax_account_id: paymentData.tax_account_id || "",
          tax_account_name: paymentData.tax_account_name || "",
          tax_amount_withheld: paymentData.tax_amount_withheld || 0.0,
          tax_amount_withheld_formatted:
            paymentData.tax_amount_withheld_formatted || "₹0.00",
          description: paymentData.description || "",
          product_description: paymentData.product_description || "",
          online_transaction_id: paymentData.online_transaction_id || "",
          payment_gateway: paymentData.payment_gateway || "",
          payment_status: paymentData.payment_status || "",
          payment_status_formatted: paymentData.payment_status_formatted || "",
          template_id: paymentData.template_id || "",
          template_name: paymentData.template_name || "",
          page_width: paymentData.page_width || "",
          page_height: paymentData.page_height || "",
          orientation: paymentData.orientation || "",
          template_type: paymentData.template_type || "",
          template_type_formatted: paymentData.template_type_formatted || "",
          attachment_name: paymentData.attachment_name || "",
          can_send_in_mail: paymentData.can_send_in_mail !== false,
          can_send_payment_sms: paymentData.can_send_payment_sms !== false,
          is_payment_details_required:
            paymentData.is_payment_details_required !== false,
          custom_fields: paymentData.custom_fields || [],
          custom_field_hash: paymentData.custom_field_hash || {},
          imported_transactions: paymentData.imported_transactions || [],
          price_precision: paymentData.price_precision || 2,
          balance_due_amount: paymentData.balance_due_amount || 0,
          is_advance_payment: true,
        });
      }
    } catch (error) {
      console.log("getPaymentData error", error);
      showMessage("Something went wrong while fetching payment data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentDataCustomerId && customers.length > 0) {
      const customer = customers.find(
        (c) => c.contact_id === paymentDataCustomerId
      );
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  }, [paymentDataCustomerId, customers]);

  return (
    <Box sx={{ mx: "auto", mb: 10, ml: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {payment_id && (
            <Box
              sx={{
                width: "100%",
                fontSize: "22px",
                fontWeight: "400",
                py: 2,
              }}
            >
              Edit Customer Advance
            </Box>
          )}
          {/* {!payment_id && (
            <Box
              sx={{
                width: "100%",
                fontSize: "22px",
                fontWeight: "400",
                py: 2,
              }}
            >
              New Customer Advance
            </Box>
          )} */}

          {/* Customer Name Section */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              sx={{ width: "160px", fontSize: "13px", color: "#d62134" }}
            >
              Customer Name *
            </Typography>
            <Box>
              <ClickAwayListener
                onClickAway={() => setCustomerDropdownOpen(false)}
              >
                <Box sx={{ position: "relative", width: "390px" }}>
                  <Box
                    onClick={() =>
                      setCustomerDropdownOpen(!customerDropdownOpen)
                    }
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "35px",
                      justifyContent: "space-between",
                      border: "1px solid #c4c4c4",
                      borderRadius: "7px",
                      padding: "8px 14px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      "&:hover": { borderColor: "#408dfb" },
                    }}
                  >
                    <Typography sx={{ fontSize: "13px", color: "#666" }}>
                      {selectedCustomer
                        ? selectedCustomer.contact_name
                        : "Select a Customer"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <KeyboardArrowDownIcon
                        sx={{
                          fontSize: "22px",
                          color: "gray",
                          marginRight: "10px",
                        }}
                      />

                      <IconButton
                        size="small"
                        sx={{
                          height: "35px",
                          width: "40px",
                          marginRight: -2,
                          borderRadius: "0 7px 7px 0",
                          backgroundColor: "#408dfb",
                          color: "white",
                          border: "1px solid",
                          borderColor: "#408dfb",
                          borderLeft: "none",
                          "&:hover": {
                            backgroundColor: "#3a7fe1",
                            borderColor: "#3a7fe1",
                          },
                        }}
                      >
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Customer Dropdown */}
                  {customerDropdownOpen && (
                    <Paper
                      elevation={3}
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        borderRadius: "4px",
                        mt: 0.5,
                        zIndex: 1000,
                      }}
                    >
                      <Box sx={{ p: 1 }}>
                        <TextField
                          placeholder="Search"
                          size="small"
                          fullWidth
                          value={customerSearchQuery}
                          onChange={(e) =>
                            setCustomerSearchQuery(e.target.value)
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontSize: "13px",
                              borderRadius: "4px",
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                        {filteredCustomers.map((customer) => (
                          <Box
                            key={customer._id}
                            onClick={() => selectCustId(customer)}
                            sx={{
                              display: "flex",
                              fontSize: "13px",
                              margin: "5px",
                              alignItems: "center",
                              borderRadius: "5px",
                              p: 1.2,
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: "#ddd",
                                color: "#666",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1.5,
                                fontSize: "14px",
                              }}
                            >
                              {customer.contact_name.charAt(0).toUpperCase()}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "medium",
                                }}
                              >
                                {customer.contact_name}
                              </Typography>
                              {customer.email && (
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "lightgray",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    maxWidth: "250px",
                                  }}
                                >
                                  {customer.email}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>
            </Box>
          </Box>

          {/* Rest of the form */}
          {(selectedCustomer || payment_id) && (
            <>
              <Box>
                {/* PAN View */}
                <Box sx={{ mt: 1, marginLeft: "160px", mb: "40px" }}>
                  <Typography sx={{ fontSize: "13px", color: "#666" }}>
                    PAN:{" "}
                    <Box
                      component="span"
                      sx={{
                        color: selectedCustomer?.pan_no ? "#408dfb" : "gray",
                        fontWeight: selectedCustomer?.pan_no ? 500 : 400,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={handleClickPanOpen}
                    >
                      {selectedCustomer?.pan_no || "Not Available"}
                    </Box>
                  </Typography>
                </Box>
                {/* PAN Dialog */}
                <Dialog
                  open={openPanDialog}
                  onClose={handleClosePanDialog}
                  hideBackdrop
                  PaperProps={{
                    sx: {
                      width: "300px",
                      position: "absolute",
                      top: "25%",
                      left: "33.5%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#fff",
                      border: "1px solid lightgray",
                      borderRadius: "6px",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <DialogTitle
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      padding: "10px 16px",
                      pb: 0,
                      fontWeight: 500,
                    }}
                  >
                    {selectedCustomer?.pan_no ? "Update PAN" : "Add PAN"}
                    <IconButton onClick={handleClosePanDialog} size="small">
                      <CloseIcon sx={{ fontSize: "18px", color: "red" }} />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent dividers sx={{ padding: "16px" }}>
                    <TextField
                      value={panNumber}
                      onChange={handlePanChange}
                      fullWidth
                      size="small"
                      placeholder="Enter PAN number"
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                          fontSize: "13px",
                          height: "36px",
                        },
                        "& .MuiInputBase-input": {
                          padding: "8px",
                        },
                      }}
                    />
                    <FormControlLabel
                      sx={{ mt: 2 }}
                      control={
                        <InfoOutlinedIcon
                          sx={{
                            fontSize: "18px",
                            color: "gray",
                            margin: "5px",
                            mt: "-10px",
                          }}
                        />
                      }
                      label={
                        <Typography
                          fontSize="13px"
                          sx={{ fontSize: "13px", color: "gray" }}
                        >
                          This PAN will be updated in contact and further
                          transactions.
                        </Typography>
                      }
                    />
                  </DialogContent>
                  <DialogActions
                    sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}
                  >
                    <Button
                      variant="contained"
                      onClick={handlePanUpdate}
                    >
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
              {/* GST Treatment View */}
              <Box sx={{ display: "flex" }}>
                <Box sx={{ mt: 1, marginLeft: "160px", mb: "40px" }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: selectedCustomer?.gst_treatment ? "#666" : "gray",
                    }}
                  >
                    GST Treatment:{" "}
                    <Box
                      component="span"
                      sx={{ color: "black", fontWeight: 500 }}
                    >
                      {selectedCustomer?.gst_treatment || "Not Available"}
                    </Box>
                  </Typography>
                </Box>
                <Box
                  onClick={() => setOpenGstDialog(true)}
                  sx={{ cursor: "pointer" }}
                >
                  <EditOutlinedIcon
                    sx={{
                      fontSize: "17px",
                      color: "#408dfb",
                      mt: "10px",
                      ml: "5px",
                    }}
                  />
                </Box>
              </Box>
              {/* GST Dialog */}
              <Dialog
                open={openGstDialog}
                onClose={handleCloseGstDialog}
                hideBackdrop
                PaperProps={{
                  sx: {
                    width: "360px",
                    position: "absolute",
                    top: "23%",
                    left: "37%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    border: "0.5px solid lightgray",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    pb: 0,
                  }}
                >
                  Configure Tax Preferences
                  <IconButton onClick={handleCloseGstDialog} size="small">
                    <CloseIcon sx={{ fontSize: "18px", color: "red" }} />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ padding: "16px" }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 500, mb: 1 }}>
                    GST Treatment
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={gstTreatment}
                      onChange={handleGstTreatmentChange}
                      sx={{
                        height: "36px",
                        fontSize: "13px",
                        borderRadius: "4px",
                      }}
                      displayEmpty
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 200, width: 280 } },
                      }}
                      renderValue={(selected) => selected}
                    >
                      {options.map((option, index) => (
                        <MenuItem key={index} value={option.label}>
                          <Typography fontSize="12px" fontWeight={500}>
                            {option.label}
                          </Typography>
                          <Typography fontSize="10px" color="#666">
                            {option.desc}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {shouldShowGstin && (
                    <Box sx={{ mt: 3 }}>
                      <Typography fontSize="13px" fontWeight={500} mb={1}>
                        GSTIN <span style={{ color: "#f44336" }}>*</span>
                      </Typography>
                      <TextField
                        value={gstin}
                        onChange={handleGstinChange}
                        fullWidth
                        size="small"
                      />
                      <Button
                        onClick={handleGetTaxpayerDetails}
                        sx={{
                          mt: 1,
                          fontSize: "13px",
                          textTransform: "none",
                          color: "#1976d2",
                        }}
                      >
                        Get Taxpayer details
                      </Button>
                    </Box>
                  )}

                  <FormControlLabel
                    sx={{ mt: 2 }}
                    control={
                      <Checkbox
                        checked={makePermanent}
                        onChange={(e) => setMakePermanent(e.target.checked)}
                        sx={{ transform: "scale(0.8)", padding: "4px" }}
                      />
                    }
                    label={
                      <Typography fontSize="13px">
                        Use these settings for all future transactions of this
                        customer.
                      </Typography>
                    }
                  />
                </DialogContent>
                <DialogActions
                  sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}
                >
                  <Button
                    variant="contained"
                    onClick={handleGstUpdate}
                    type="primary"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={handleCloseGstDialog}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
              {/* Place of Supply */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                    marginTop: "-20px",
                    color: "#d62134",
                  }}
                >
                  Place of Supply *
                </Typography>
                <Grid item xs={5}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={commonStyles}
                    style={{ width: 350, fontSize: "13px" }}
                    error={
                      formik.touched.place_of_supply &&
                      Boolean(formik.errors.place_of_supply)
                    }
                  >
                    <StyledSelect
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      name="place_of_supply"
                      value={formik.values.place_of_supply || ""}
                      onChange={formik.handleChange}
                      sx={{ fontSize: "13px", svg: { fontSize: "22px" } }}
                      renderValue={(selected) => {
                        if (!selected) return "Select";
                        const selectedState = INDIAN_STATES.find(
                          (s) => s.code === selected
                        );
                        return selectedState
                          ? `[${selectedState.code}] - ${selectedState.name}`
                          : selected;
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300, width: 320 },
                        },
                      }}
                    >
                      <MenuItem
                        disableRipple
                        disableTouchRipple
                        sx={{ cursor: "default", p: 0 }}
                      >
                        <Box
                          sx={{
                            p: 0.75,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                            width: "100%",
                          }}
                        >
                          <TextField
                            autoFocus
                            placeholder="Search..."
                            size="small"
                            fullWidth
                            value={searchTerm}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Box sx={{ color: "#757575", mr: -0.5 }}>
                                    <SearchIcon
                                      sx={{ fontSize: "16px", mt: "5px" }}
                                    />
                                  </Box>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              fontSize: "13px",
                              "& .MuiOutlinedInput-root": {
                                minHeight: "30px",
                                "& input": {
                                  padding: "4px 8px",
                                  fontSize: "13px",
                                },
                                "& fieldset": {
                                  borderColor: "#e0e0e0",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#408dfb",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#408dfb",
                                },
                              },
                            }}
                          />
                        </Box>
                      </MenuItem>

                      {filteredStates.length === 0 && (
                        <MenuItem disabled>No states found</MenuItem>
                      )}

                      {filteredStates.map((state) => (
                        <MenuItem
                          key={state.code}
                          value={state.code}
                          sx={{
                            fontSize: "13px",
                            margin: "2px",
                            borderRadius: "5px",
                            "&:hover": {
                              backgroundColor: "#408dfb",
                              color: "white",
                            },
                          }}
                        >
                          [{state.code}] - {state.name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                  {formik.touched.place_of_supply &&
                    formik.errors.place_of_supply && (
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: COLORS.error,
                          mt: -2,
                          mb: 2,
                        }}
                      >
                        {formik.errors.place_of_supply}
                      </Typography>
                    )}
                </Grid>
              </Box>
              {/* Description of Supply  */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                    marginTop: "-50px",
                  }}
                >
                  Description of Supply
                </Typography>
                <Box>
                  <TextField
                    id="description"
                    name="description"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    variant="outlined"
                    size="small"
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    sx={{
                      width: "350px",
                      padding: 0,
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-root": {
                        fontSize: "13px",
                        borderRadius: "7px",
                        height: "60px",
                        padding: 0,
                        "& input": {
                          padding: "0px !important", // Remove all internal padding
                          height: "100% !important", // Fill parent height
                          margin: 1,
                          paddingTopTop: -1,
                          mt: 0,
                          boxSizing: "border-box",
                        },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#409dfb",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#409dfb",
                      },
                    }}
                  />

                  <Typography
                    sx={{ fontSize: "11px", color: "gray", margin: "5px" }}
                  >
                    Will be displayed on the Payment Voucher
                  </Typography>
                </Box>
              </Box>

              {/* Amount  */}
              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Typography
                  sx={{
                    ...formLabelStyle,
                    color:
                      formik.touched.amount && formik.errors.amount
                        ? "error.main"
                        : "#333333",
                    minWidth: "150px", // Ensures label aligns well
                  }}
                >
                  Amount Received*
                </Typography>

                {/* INR Prefix Box */}
                <Box
                  sx={{
                    border: 1,
                    width: "50px",
                    height: "35px",
                    borderColor:
                      formik.touched.amount && formik.errors.amount
                        ? "error.main"
                        : "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: "6px",
                    borderBottomLeftRadius: "6px",
                    borderRight: "none",
                    backgroundColor: "#f9f9f9",
                    fontSize: "14px",
                  }}
                >
                  INR
                </Box>

                {/* Input Field */}
                <StyledTextField
                  name="amount"
                  placeholder="Amount"
                  type="number"
                  min="0"
                  value={formik.values.amount || ""}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  sx={{
                    width: "300px",
                    height: "35px",
                    "& .MuiOutlinedInput-root": {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      fontSize: "14px",
                      "& fieldset": {
                        borderColor:
                          formik.touched.amount && formik.errors.amount
                            ? "error.main"
                            : "#ccc",
                      },
                      "&:hover fieldset": {
                        borderColor:
                          formik.touched.amount && formik.errors.amount
                            ? "error.main"
                            : "#999",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                    "& input": {
                      padding: "8px 12px",
                      "&::placeholder": {
                        color: "#aaa",
                        fontWeight: 400,
                      },
                      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                        {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                    },
                  }}
                />
              </Box>

              {formik.touched.amount && formik.errors.amount && (
                <Typography
                  sx={{
                    ml: "160px",
                    mt: -1,
                    mb: 1,
                    fontSize: "0.75rem",
                    color: COLORS.error,
                  }}
                >
                  {formik.errors.amount}
                </Typography>
              )}
              {/* Bank Charges */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                  }}
                >
                  Bank Charges (if any)
                </Typography>

                <TextField
                  id="bank_charges"
                  name="bank_charges"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.bank_charges || ""}
                  variant="outlined"
                  size="small"
                  error={
                    formik.touched.bank_charges &&
                    Boolean(formik.errors.bank_charges)
                  }
                  helperText={
                    formik.touched.bank_charges && formik.errors.bank_charges
                  }
                  sx={{
                    width: "350px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "7px",
                    },
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc", // default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on focus
                    },
                  }}
                />
              </Box>
              {/* Tax */}
              <Box sx={{ mt: 2 }}>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "13px",
                        width: "160px",
                      }}
                    >
                      Tax*
                    </Typography>
                  </Grid>

                  <Grid item xs={5}>
                    <FormControl
                      fullWidth
                      size="small"
                      style={{ width: 350, fontSize: "13px" }}
                      error={
                        formik.touched.tax_account_name &&
                        Boolean(formik.errors.tax_account_name)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderColor:
                            formik.touched.tax_account_name &&
                            formik.errors.tax_account_name
                              ? "error.main"
                              : "inherit",
                        },
                      }}
                    >
                      <StyledSelect
                        name="tax_account_name"
                        value={formik.values.tax_account_name || ""}
                        onChange={handleTaxChange}
                        IconComponent={KeyboardArrowDownIcon}
                        displayEmpty
                        renderValue={(selected) => (
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: selected ? "inherit" : "#757575",
                            }}
                          >
                            {selected || "Select a Tax"}
                          </Typography>
                        )}
                        MenuProps={{
                          PaperProps: { style: { maxHeight: 300 } },
                          MenuListProps: { style: { padding: "0" } },
                        }}
                        sx={{
                          fontSize: "13px",
                          "& .MuiSelect-select": { fontSize: "13px" },
                        }}
                      >
                        <Box
                          sx={{
                            p: 0.75,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            autoFocus
                            placeholder="Search"
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleTaxSearch}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Box sx={{ color: "#757575", mr: -0.5 }}>
                                    <SearchIcon sx={{ fontSize: "16px" }} />
                                  </Box>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                minHeight: "30px",
                                "& input": {
                                  padding: "4px 8px",
                                  fontSize: "13px",
                                },
                                "& fieldset": {
                                  borderColor: COLORS.borderColor,
                                },
                                "&:hover fieldset": {
                                  borderColor: COLORS.primary,
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: COLORS.primary,
                                },
                              },
                            }}
                          />
                        </Box>

                        {TAX_OPTIONS.map((item, idx) => (
                          <MenuItem
                            key={idx}
                            value={item}
                            data-tax-item
                            sx={{
                              fontSize: "13px",
                              margin: "2px",
                              borderRadius: "5px",
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                              "&.Mui-selected": {
                                fontSize: "13px",
                                backgroundColor: "#e3f2fd",
                                fontWeight: "bold",
                              },
                            }}
                          >
                            {item}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Payment Date */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 2 }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                    color: "#d62134",
                  }}
                >
                  Payment Date *
                </Typography>
                <TextField
                  id="date"
                  name="date"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                  placeholder="dd/MM/yyyy"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={(ref) => {
                    // Capture the input ref to trigger click programmatically
                    if (ref) {
                      ref.onclick = () => ref.showPicker && ref.showPicker();
                    }
                  }}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  sx={{
                    width: "350px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "7px",
                    },
                    borderRadius: "7px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb",
                    },
                  }}
                />
              </Box>
              {/* Payment #*/}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    minWidth: "160px",
                    whiteSpace: "nowrap",
                    color: "#d62134",
                  }}
                >
                  Payment # *
                </Typography>
                <TextField
                  id="payment_id"
                  name="payment_id"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.payment_id}
                  variant="outlined"
                  size="small"
                  error={
                    formik.touched.payment_id &&
                    Boolean(formik.errors.payment_id)
                  }
                  // helperText={formik.touched.payment_id && formik.errors.payment_id}
                  sx={{
                    width: "350px",
                    height: "35px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "7px",
                    },
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc", // default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on focus
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <SettingsIcon
                            fontSize="small"
                            sx={{ marginRight: "-12px" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {formik.touched.payment_id && formik.errors.payment_id && (
                <Typography
                  sx={{
                    ml: "160px",
                    mt: -2,
                    mb: 1,
                    fontSize: "0.75rem",
                    color: COLORS.error,
                  }}
                >
                  {formik.errors.payment_id}
                </Typography>
              )}

              {/* Payment Mode */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                  }}
                >
                  Payment Mode *
                </Typography>

                <Grid item xs={5}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={commonStyles}
                    style={{ width: 400 }}
                  >
                    <StyledSelect
                      name="payment_mode"
                      value={formik.values.payment_mode || ""}
                      onChange={formik.handleChange}
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{
                        fontSize: "13px",
                        width: "350px",
                        svg: { fontSize: "22px" },
                      }}
                      displayEmpty
                      error={
                        formik.touched.payment_mode &&
                        Boolean(formik.errors.payment_mode)
                      }
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <Typography
                              sx={{ color: "#757575", fontSize: "13px" }}
                            ></Typography>
                          );
                        }
                        return selected;
                      }}
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 300 } },
                        MenuListProps: { style: { padding: "0" } },
                      }}
                      onOpen={() => setIsPaymentTermsOpen(true)}
                      onClose={() => {
                        setIsPaymentTermsOpen(false);
                        setPaymentTermsSearch("");
                      }}
                    >
                      {/* Search Field */}
                      <MenuItem
                        disableRipple
                        disableTouchRipple
                        sx={{ cursor: "default", p: 0 }}
                      >
                        <Box
                          sx={{
                            p: 0.75,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                            width: "100%",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <TextField
                            autoFocus
                            placeholder="Search"
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={(e) => e.stopPropagation()}
                            value={paymentTermsSearch}
                            onChange={(e) =>
                              setPaymentTermsSearch(e.target.value)
                            } // Update search value
                            onKeyDown={(e) => {
                              if (e.key === "Escape") handleClose();
                              e.stopPropagation();
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Box sx={{ color: "#757575", mr: -0.5 }}>
                                    <SearchIcon
                                      sx={{ fontSize: "16px", mt: "5px" }}
                                    />
                                  </Box>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                minHeight: "30px",
                                "& input": {
                                  padding: "4px 8px",
                                  fontSize: "13px",
                                },
                                "& fieldset": {
                                  borderColor: "#e0e0e0",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#408dfb",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#408dfb",
                                },
                              },
                            }}
                          />
                        </Box>
                      </MenuItem>

                      {/* Filtered Options */}
                      {filteredPaymentModes.length > 0 ? (
                        filteredPaymentModes.map((mode) => (
                          <MenuItem
                            key={mode}
                            value={mode}
                            sx={{
                              fontSize: "13px",
                              margin: "2px",
                              borderRadius: "5px",
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                          >
                            {mode}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem
                          disabled
                          sx={{ fontSize: "13px", opacity: 0.6 }}
                        >
                          No results found
                        </MenuItem>
                      )}

                      <Divider sx={{ my: 1 }} />

                      {/* Configure Terms Button */}
                      <Button
                        fullWidth
                        sx={{
                          fontSize: "13px",
                          color: "#408dfb",
                          display: "flex",
                          alignItems: "center",
                          padding: "5px 20px",
                          paddingBottom: "15px",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f0f7ff" },
                          borderRadius: "4px",
                          justifyContent: "flex-start",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPaymentTermsModalOpen(true);
                        }}
                      >
                        <SettingsOutlinedIcon
                          sx={{ fontSize: "16px", mr: "10px" }}
                        />
                        Configure Terms
                      </Button>
                    </StyledSelect>
                  </FormControl>

                  {/* Payment Terms Modal */}
                  <Modal
                    open={isPaymentTermsModalOpen}
                    onClose={() => setIsPaymentTermsModalOpen(false)}
                  >
                    <PaymentTermsConfig />
                  </Modal>
                </Grid>
              </Box>

              {/* Deposite To */}
              <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                    color: "#d62134",
                    mt: "-10px",
                  }}
                >
                  Deposit To *
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ width: "350px" }}
                  error={
                    formik.touched.deposite_to &&
                    Boolean(formik.errors.deposite_to)
                  }
                >
                  <StyledSelect
                    name="deposite_to"
                    value={formik.values.deposite_to || ""}
                    onChange={formik.handleChange}
                    IconComponent={KeyboardArrowDownIcon}
                    displayEmpty
                    open={isOpen}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    renderValue={(selected) =>
                      selected ? (
                        <Typography sx={{ fontSize: "13px", color: "#000" }}>
                          {selected}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "#aaa", fontSize: "13px" }}>
                          Select an account
                        </Typography>
                      )
                    }
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 300 } },
                      MenuListProps: { style: { padding: "0" } },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                    sx={{
                      fontSize: "13px",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      svg: { fontSize: "22px" },
                    }}
                  >
                    {/* Search Box */}
                    <MenuItem
                      disableRipple
                      disableTouchRipple
                      sx={{ cursor: "default", p: 0 }}
                    >
                      <Box
                        sx={{
                          p: 0.75,
                          position: "sticky",
                          top: 0,
                          bgcolor: "background.paper",
                          zIndex: 1,
                          width: "100%",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TextField
                          inputRef={searchInputRef}
                          placeholder="Search"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") handleClose();
                            // Prevent event bubbling to avoid closing the dropdown
                            e.stopPropagation();
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking the search field
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              minHeight: "30px",
                              "& input": {
                                padding: "4px 8px",
                                fontSize: "13px",
                              },
                            },
                          }}
                        />
                      </Box>
                    </MenuItem>

                    {/* Display grouped options */}
                    {Object.keys(groupedOptions).length > 0 ? (
                      Object.entries(groupedOptions).map(([group, items]) => (
                        <React.Fragment key={group}>
                          <ListSubheader
                            sx={{
                              fontSize: "13px",
                              color: "gray",
                              backgroundColor: "#f7f7f7",
                              lineHeight: "28px",
                              padding: "0 16px",
                            }}
                          >
                            {group}
                          </ListSubheader>
                          {items.map((item) => (
                            <MenuItem
                              key={item.label}
                              value={item.label}
                              onClick={() => handleSelection(item.label)}
                              sx={{
                                fontSize: "13px",
                                borderRadius: "5px",
                                margin: "2px",
                                padding: "6px 16px",
                                "&:hover": {
                                  backgroundColor: "#408dfb",
                                  color: "white",
                                },
                                // Highlight selected item
                                ...(formik.values.deposite_to === item.label
                                  ? {
                                      backgroundColor: "#eaf1ff",
                                      "&:hover": {
                                        backgroundColor: "#408dfb",
                                        color: "white",
                                      },
                                    }
                                  : {}),
                              }}
                            >
                              {item.label}
                            </MenuItem>
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <MenuItem
                        disabled
                        sx={{ fontSize: "13px", opacity: 0.6 }}
                      >
                        No results found
                      </MenuItem>
                    )}
                  </StyledSelect>
                  {formik.touched.deposite_to && formik.errors.deposite_to && (
                    <Typography
                      sx={{
                        color: "error.main",
                        fontSize: "11px",
                        m: 1,
                      }}
                    >
                      {formik.errors.deposite_to}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {/* Reference Number */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                  }}
                >
                  Reference#
                </Typography>
                <TextField
                  id="reference_number"
                  name="reference_number"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.reference_number}
                  variant="outlined"
                  size="small"
                  error={
                    formik.touched.reference_number &&
                    Boolean(formik.errors.reference_number)
                  }
                  helperText={
                    formik.touched.reference_number &&
                    formik.errors.reference_number
                  }
                  sx={{
                    width: "350px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "7px",
                    },
                    borderRadius: "7px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc", // default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on focus
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 5, mt: 5 }} />

              {/* Notes Section */}
              <Box mb={3}>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}
                >
                  Notes (Internal use. Not visible to vendor)
                </Typography>

                <TextField
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  multiline
                  fullWidth
                  variant="outlined"
                  sx={{
                    padding: 0,
                    fontSize: "13px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px",
                      height: "80px",
                      padding: 0,
                      alignItems: "flex-start",
                      "&:hover fieldset": {
                        borderColor: "#408dfb",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#408dfb",
                      },
                      "& textarea": {
                        padding: "0px !important", // fully remove textarea padding
                        margin: 1,
                        height: "100% !important",
                        fontSize: "13px",
                        lineHeight: 1.4,
                        boxSizing: "border-box",
                        resize: "none",
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc",
                    },
                  }}
                />
              </Box>

              {/* Attachments Section */}
              <Box mb={2}>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}
                >
                  Attachments
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={1}
                  sx={{
                    border: "1px dashed  rgba(0, 0, 0, 0.12)",
                    width: "180px",
                    borderRadius: "4px",
                    "&:hover": { border: "1px dashed  #408dfb" },
                  }}
                >
                  <Button
                    startIcon={
                      <UploadIcon
                        sx={{
                          color: "gray",
                          "&:hover": {
                            borderColor: "#408dfb",
                          },
                        }}
                      />
                    }
                    onClick={handleFileInputClick}
                    disableElevation
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderRadius: 1,
                      padding: "6px 16px",
                    }}
                  >
                    Upload File
                  </Button>

                  <IconButton
                    onClick={handleArrowClick}
                    sx={{
                      borderRadius: 1,
                      height: 36,
                      width: 36,
                      fontSize: "22px",
                    }}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                      marginLeft: "-130px",
                      marginTop: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    <MenuItem
                      onClick={handleFileInputClick}
                      sx={{
                        fontSize: "13px",
                        "&:hover": {
                          backgroundColor: "#408dfb",
                          color: "white",
                        },
                      }}
                    >
                      Attach From Desktop
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        fontSize: "13px",
                        "&:hover": {
                          backgroundColor: "#408dfb",
                          color: "white",
                        },
                      }}
                    >
                      Attach From Documents
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        fontSize: "13px",
                        "&:hover": {
                          backgroundColor: "#408dfb",
                          color: "white",
                        },
                      }}
                    >
                      {" "}
                      Attach From Cloud
                    </MenuItem>
                  </Menu>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    style={{ display: "none" }}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  />
                </Box>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  You can upload a maximum of 5 files, 10MB each
                </Typography>

                {files.length > 0 && (
                  <Box mt={2}>
                    {files.map((file, index) => (
                      <Box
                        key={index}
                        my={1}
                        display="flex"
                        alignItems="center"
                      >
                        <Typography variant="body2">{file.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Additional Fields Section */}
              <Box
                mt={4}
                sx={{ display: "flex", width: "1000px", color: "gray" }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 550, color: "gray", width: "150px" }}
                >
                  Additional Fields:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "1000px",
                    fontSize: "13px",
                  }}
                >
                  <Typography variant="body2" component="span">
                    Start adding custom fields for your payments made by going
                    to{" "}
                  </Typography>
                  <Link
                    href="#settings"
                    underline="none"
                    component="span"
                    sx={{ color: "gray", ml: "10px" }}
                  >
                    Settings
                  </Link>
                  <ArrowForwardIcon
                    fontSize="small"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      mx: 0.6,
                      verticalAlign: "middle",
                    }}
                  />
                  <Link
                    href="#purchases"
                    underline="none"
                    component="span"
                    sx={{ color: "gray" }}
                  >
                    Purchases
                  </Link>
                  <ArrowForwardIcon
                    fontSize="small"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      mx: 0.6,
                      verticalAlign: "middle",
                    }}
                  />
                  <Link
                    href="#payments"
                    underline="none"
                    component="span"
                    sx={{ color: "gray" }}
                  >
                    Payments Made
                  </Link>
                  <Typography variant="body2" component="span">
                    .
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Grid>

        {/* Action Buttons */}
        <Paper
          elevation={2}
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            marginTop: "20px",
            position: "fixed",
            left: "15%",
            bottom: 0,
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            disableElevation
            disabled={formik.isSubmitting || !selectedCustomer}
            // sx={{
            //   textTransform: "none",
            //   backgroundColor: "#408dfb",
            //   color: "white",
            //   borderRadius: "5px",
            //   px: 2,
            //   py: 0.75,
            //   fontWeight: 400,
            //   fontSize: "14px",
            //   boxShadow: "none",
            //   "&:hover": {
            //     backgroundColor: "#1565c0",
            //     boxShadow: "none",
            //   },
            // }}
            color="primary"
            onClick={() => {
              // Set is_advance_payment to false for final submission
              formik.setFieldValue("is_advance_payment", true);
              formik.handleSubmit();
            }}
          >
            Save
          </Button>
            <Button
              variant="outlined"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
        </Paper>
      </Grid>
    </Box>
  );
};

export default CustomerAdvance;
