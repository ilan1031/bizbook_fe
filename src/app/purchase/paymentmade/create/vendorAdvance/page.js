"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import apiService from "../../../../../services/axiosService";
import CloseIcon from "@mui/icons-material/Close";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

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
import PaymentTermsConfig from "../../../../common/otherdetailsvendor/configurePaymentTerms/PaymentTermsConfig";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSnackbar } from "../../../../../components/SnackbarProvider";

// Validation schema - updated according to model fields
const validationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  amount: Yup.number().required("Amount is required").min(0, "Minimum is 0"),
  payment_id: Yup.string().required("Payment id is required"),
  // paid_through_account_id: Yup.string().required(
  //   "Paid through account is required"
  // ),
  payment_mode: Yup.string().required("Payment mode is required"),
  source_of_supply: Yup.string().required("Source of Supply is required"),
  destination_of_supply: Yup.string().required(
    "Destination of Supply is required"
  ),
});

const COLORS = {
  primary: "#187c19",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const StyledSelect = styled(Select)({
  height: "35px",
  "& .MuiSelect-select": {
    padding: "6px 12px",
    fontSize: "14px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "7px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    border: ".1px solid #187c19",
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
});

// Common styles
const commonStyles = {
  fontSize: "13px",
  "& .MuiInputBase-root": {
    fontSize: "13px",
    minHeight: "36px",
  },
  "& .MuiFormLabel-root": {
    fontSize: "13px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "11px",
  },
  mb: 2,
};

// Main component
const VendorAdvance = () => {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  // Vendor states
  const [vendors, setVendors] = useState([]);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const { showMessage } = useSnackbar();
  // Payment mode options
  const paymentModeOptions = ["Cash", "Card", "Bank Transfer", "UPI", "Other"];
  // Payment mode options
  const DepositToOptions = [
    "Advance Tax",
    "Employee Advance",
    "Prepaid Expenses",
    "TDS Receivable",
    "TCS Receivable",
    "Reverse Charge Tax Input but not due",
    " Input Tax Credits",
    "Input IGST",
    "Input CGST",
    "Input SGST",
  ];
  // Account options for paid through
  const allPaidThroughOptions = [
    { label: "Petty Cash", group: "Cash" },
    { label: "Undeposited Funds", group: "Cash" },
    { label: "Employee Reimbursements", group: "Other Current Liability" },
    { label: "TDS Payable", group: "Other Current Liability" },
    { label: "Capital Stock", group: "Equity" },
    { label: "Distributions", group: "Equity" },
    { label: "Dividends Paid", group: "Equity" },
    { label: "Drawings", group: "Equity" },
    { label: "Investments", group: "Equity" },
    { label: "Opening Balance Offset", group: "Equity" },
    { label: "Owner's Equity", group: "Equity" },
    { label: "Employee Advance", group: "Other Current Asset" },
    { label: "TDS Receivable", group: "Other Current Asset" },
  ];
  const DEPOSIT_OPTIONS = [
    "Advance Tax",
    "Employee Advance",
    "Prepaid Expenses",
    "TDS Receivable",
    "TCS Receivable",
    "Reverse Charge Tax Inputbut not due",
    "Input Tax Credits",
    "Input IGST",
    "Input CGST",
    "Input SGST",
  ];
  const TDS_OPTIONS = [
    "Commission or Brokerage [2%]",
    "Commission or Brokerage (Reduced) [3.75%]",
    "Dividend [10%]",
    "Dividend (Reduced) [7.5%]",
    "Other Interest than securities [10%]",
    "Other Interest than securities (Reduced) [7.5%]",
    "Payment of contractors for Others [2%]",
    "Payment of contractors for Others (Reduced) [1.5%]",
    "Payment of contractors HUF/Indiv [1%]",
    "Payment of contractors HUF/Indiv (Reduced) [0.75%]",
    "Professional Fees [10%]",
    "Professional Fees (Reduced) [7.5%]",
    "Rent on land or furniture etc [10%]",
    "Rent on land or furniture etc (Reduced) [7.5%]",
    "Technical Fees (2%) [2%]",
  ];
  // Filtering logic
  const getFilteredTDSOptions = (searchValue) => {
    const terms = searchValue
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);
    return TDS_OPTIONS.filter((item) =>
      terms.every((term) => item.toLowerCase().includes(term))
    );
  };
  // Callback on selection
  const handleTDSSelection = (value) => {
    formik.setFieldValue("is_tds_amount_in_percent", value);
  };
  const [paymentTermsSearch, setPaymentTermsSearch] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState(false);
  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("paymentId");
  const filteredTerms = TDS_OPTIONS.filter((term) =>
    term.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );
  // Filter payment modes based on search
  const filteredPaymentModes = paymentModeOptions.filter((mode) =>
    mode.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );
  // Filter payment modes based on search
  const filtereddeposite = DEPOSIT_OPTIONS.filter((item) =>
    item.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );
    const [paymentUniqueId,setPaymentUniqueId] = useState(null);
  // Handle search change
  const handlePaymentSearchChange = (e) => {
    e.stopPropagation();
    setPaymentTermsSearch(e.target.value);
  };
  // Optional: close dropdown when pressing ESC
  const handlePaymentSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsPaymentTermsOpen(false);
    }
  };

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

  // Focus on search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

   useEffect(()=>{
      getUniqueId();
    },[])
    
  const getUniqueId = async () => {
    try {
      const params = {
        url: "api/v1/common/get-unique-id",
        method: "POST",
        data: { module: "payment_made" },
        customBaseUrl: config.apiBaseUrl,
      };
      const response = await apiService(params);
      if (response.statusCode == 200) {
        setPaymentUniqueId(response.data.data);
        formik.setFieldValue("payment_id",response.data.data)
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
      showMessage(
        "Error fetching organization data. Please try again.",
        "error"
      );
    } finally {
    }
  };

  // Handle dropdown opening and closing
  const handleOpen = () => {
    setIsOpen(true);
    setSearchValue("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  // Handle selection
  const handleSelection = (value) => {
    console.log(value,"value")
    formik.setFieldValue("paid_through_account_id", value);
    handleClose();
  };

  const organization_id =
    typeof window !== "undefined"
      ? localStorage.getItem("organization_id")
      : null;

  // Filter vendors based on vendor search query
  const filteredVendors = vendors.filter((vendor) =>
    vendor.contact_name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  );

  // Handle file uploads
  const handleFileUpload = (e) => {
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
    // formik.setFieldValue("documents", selectedFile); // Update Formik field
    console.log(selectedFile, "=======selectedFile==+++");
  };

  // Remove selected file
  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
  };

  // Combine all form data
  const paymentData = {
    // ...values,
    contact_id: selectedVendor?._id,
  };

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/vendors?organization_id=${organization_id}`,
        });
        setVendors(response.data.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    if (organization_id) {
      fetchVendors();
    }
    if (payment_id) {
      getPaymentData(payment_id);
    }
  }, [organization_id, payment_id]);

  const getPaymentData = async (payment_id) => {
    try {
      let params = {
        url: `api/v1/payments/allpayment?payment_id=${payment_id}&organization_id=${organization_id}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      let response = await apiService(params);
      if (response.statusCode == 200) {
        let paymentData = response.data.data.payment;
        const vendor = paymentData.contact_id;
        if (vendor) {
          setSelectedVendor(vendor);
        }
        formik.setValues({
          payment_id: paymentData.payment_id,
          organization_id: organization_id || "",
          contact_id: paymentData.contact_id._id,
          payment_mode: paymentData.payment_mode || "cash",
          payment_type: "VendorAdvance",
          description: paymentData.description || "",
          date: new Date(paymentData.date).toISOString().split("T")[0],
          reference_number: paymentData.reference_number || "",
          amount: paymentData.amount || 0,
          paid_through_account_id: paymentData.paid_through_account_id || "",
          is_advance_payment: paymentData.is_advance_payment || false,
          gst_treatment: paymentData.gst_treatment,
          source_of_supply: paymentData.source_of_supply,
          destination_of_supply: paymentData.destination_of_supply,
          reverse_charge_tax: paymentData.reverse_charge_tax,
          is_tds_amount_in_percent: paymentData.is_tds_amount_in_percent,
          reverse_charge_tax: paymentData.reverse_charge_tax,
          documents: files[0],
        });
      }
    } catch (error) {
      showMessage("Something went wrong", "error");
    }
  };

  // Initialize form with values that match model fields
  // Update to the formik initialization and onSubmit in the VendorAdvance component

  // Remove admin_id from the initial values
  const formik = useFormik({
    initialValues: {
      organization_id: organization_id,
      contact_id: "", // This will be set when a vendor is selected
      payment_mode: "Cash", // Default value
      description: "", // Notes field
      date: today,
      payment_id: "",
      reference_number: "",
      description_of_supply: "",
      amount: "",
      paid_through_account_id: "Petty Cash",
      paid_through_account_name: "",
      is_tds_amount_in_percent: "",
      is_advance_payment: true, // Since this is for vendor advances
      // We will NOT set admin_id here - it should come from the server
      gst_treatment: "",
      source_of_supply: "",
      destination_of_supply: "",
      reverse_charge_tax: "",
      payment_type: "VendorAdvance",
      custom_fields: [],
      documents: "",
      deposite_to_id:"",
      deposite_to: "Prepaid Expenses",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      // console.log("ascascascascasc",values)
      if (!values.contact_id) {
        showMessage("Please select a vendor", "error");
        setSubmitting(false);
        return;
      }

      
      try {
        // Remove admin_id if it exists in the values
        const submitValues = { ...values };
        if (submitValues.admin_id !== undefined) {
          delete submitValues.admin_id;
        }
        // submitValues.documents = files[0].name;

        const params = {
          method: payment_id ? "PUT" : "POST",
          url: payment_id
            ? `/api/v1/payments/update?organization_id=${organization_id}&payment_id=${payment_id}`
            : `/api/v1/payments/made?organization_id=${organization_id}`,
          data: submitValues,
          customBaseUrl: config.PO_Base_url,
          file: true,
        };
        console.log(submitValues, "submitValuessubmitValuessubmitValues");

        const response = await apiService(params);
        if (response.statusCode == 200) {
          showMessage("Payment submitted successfully!", "success");
          router.push(`/purchase/paymentmade/${response.data.data.payment_id}`);
          resetForm();
          setSelectedVendor(null);
        }
      } catch (error) {
        console.log(error,"error")
        if (error.status == false) {
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

  const [anchorEl, setAnchorEl] = useState(null);

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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = INDIAN_STATES.filter((state) =>
    `${state.code} - ${state.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ mx: "auto", mb: 10 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Vendor Selection */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{ width: "160px", fontSize: "13px", color: "#d62134" }}
              >
                Vendor Name*
              </Typography>

              <ClickAwayListener
                onClickAway={() => setVendorDropdownOpen(false)}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "350px",
                    borderRadius: "7px",
                  }}
                >
                  <Box
                    onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
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
                      color: "gray",
                      "&:hover": {
                        borderColor: "#187c19",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: selectedVendor ? "gray" : "#aaa",
                      }}
                    >
                      {selectedVendor
                        ? selectedVendor.contact_name
                        : "Select a Vendor"}
                    </Typography>
                    <KeyboardArrowDownIcon
                      fontSize="small"
                      sx={{
                        transform: vendorDropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        fontSize: "22px",
                        marginRight: "-8px",
                      }}
                    />
                  </Box>

                  {vendorDropdownOpen && (
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
                          value={vendorSearchQuery}
                          onChange={(e) => setVendorSearchQuery(e.target.value)}
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
                        {loading ? (
                          <Box sx={{ p: 2, textAlign: "center" }}>
                            <Typography sx={{ fontSize: "13px" }}>
                              Loading...
                            </Typography>
                          </Box>
                        ) : filteredVendors.length > 0 ? (
                          filteredVendors.map((vendor) => (
                            <Box
                              key={vendor._id}
                              onClick={() => {
                                setSelectedVendor(vendor);
                                setVendorDropdownOpen(false);
                                formik.setFieldValue("contact_id", vendor._id);
                                fetchVendorBills(vendor._id);
                              }}
                              sx={{
                                display: "flex",
                                fontSize: "13px",
                                alignItems: "center",
                                borderRadius: "5px",
                                margin: "5px",
                                p: 1.2,
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "#187c19",
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
                                {vendor.contact_name.charAt(0).toUpperCase()}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: "medium",
                                  }}
                                >
                                  {vendor.contact_name}
                                </Typography>
                                {vendor.email && (
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      color: "darkgray",
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      maxWidth: "250px",
                                    }}
                                  >
                                    {vendor.email}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Box sx={{ p: 2, textAlign: "center" }}>
                            <Typography sx={{ fontSize: "13px" }}>
                              No vendors found
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box>
                        <Box
                          onClick={() =>
                            router.push("/purchase/vendor/createvendor")
                          }
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 1.5,
                            borderTop: "1px solid #eee",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          <AddIcon
                            sx={{ fontSize: "16px", color: "#4d90fe", mr: 1 }}
                          />
                          <Typography
                            sx={{ fontSize: "13px", color: "#4d90fe" }}
                          >
                            New Vendor
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>
            </Box>
            {/* Conditional rendering of the rest of the form fields */}
            {selectedVendor && (
              <>
                {/* Source of Supply */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      width: "160px",
                      fontSize: "13px",
                      marginTop: "-20px",
                      color: "#d62134",
                    }}
                  >
                    Source of Supply *
                  </Typography>
                  <Grid item xs={5}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={commonStyles}
                      style={{ width: 350, fontSize: "13px" }}
                    >
                      <StyledSelect
                        displayEmpty
                        IconComponent={KeyboardArrowDownIcon}
                        name="source_of_supply"
                        value={formik.values.source_of_supply || ""}
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
                                    borderColor: "#187c19",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#187c19",
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
                                backgroundColor: "#187c19",
                                color: "white",
                              },
                            }}
                          >
                            [{state.code}] - {state.name}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </FormControl>
                    {formik.touched.source_of_supply &&
                      formik.errors.source_of_supply && (
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: COLORS.error,
                            mt: -2,
                            mb: 2,
                          }}
                        >
                          {formik.errors.source_of_supply}
                        </Typography>
                      )}
                  </Grid>
                </Box>
                {/* Destination of Supply*/}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      width: "160px",
                      fontSize: "13px",
                      marginTop: "-20px",
                      color: "#d62134",
                    }}
                  >
                    Destination of Supply*
                  </Typography>
                  <Grid item xs={5}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={commonStyles}
                      style={{ width: 350, fontSize: "13px" }}
                    >
                      <StyledSelect
                        displayEmpty
                        IconComponent={KeyboardArrowDownIcon}
                        name="destination_of_supply"
                        value={formik.values.destination_of_supply || ""}
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
                                    borderColor: "#187c19",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#187c19",
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
                                backgroundColor: "#187c19",
                                color: "white",
                              },
                            }}
                          >
                            [{state.code}] - {state.name}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </FormControl>
                    {formik.touched.destination_of_supply &&
                      formik.errors.destination_of_supply && (
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: COLORS.error,
                            mt: -2,
                            mb: 2,
                          }}
                        >
                          {formik.errors.destination_of_supply}
                        </Typography>
                      )}
                  </Grid>
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
                    disabled
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
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000", // Makes text black even when disabled
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
                      id="description_of_supply"
                      name="description_of_supply"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.description_of_supply}
                      variant="outlined"
                      size="small"
                      error={
                        formik.touched.description_of_supply &&
                        Boolean(formik.errors.description_of_supply)
                      }
                      helperText={
                        formik.touched.description_of_supply &&
                        formik.errors.description_of_supply
                      }
                      sx={{
                        width: "350px",
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                          borderRadius: "7px",
                          height: "60px",
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
                    <Typography
                      sx={{ fontSize: "11px", color: "gray", margin: "5px" }}
                    >
                      Will be displayed on the Payment Voucher
                    </Typography>
                  </Box>
                </Box>
                {/*  Payment Made (Amount) */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      minWidth: "160px",
                      whiteSpace: "nowrap",
                      color: "#d62134",
                    }}
                  >
                    Payment Made *
                  </Typography>
                  <TextField
                    id="amount"
                    name="amount"
                    type="text"
                    onChange={(e) => {
                      let value = e.target.value;

                      // Allow only digits and decimal point
                      if (!/^\d*\.?\d{0,2}$/.test(value)) return;

                      // Enforce max length of 15 characters
                      if (value.length > 15) return;

                      // Allow only numbers and one decimal point
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        formik.setFieldValue("amount", value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        formik.setFieldValue("amount", value.toFixed(2));
                      }
                    }}
                    value={formik.values.amount}
                    variant="outlined"
                    size="small"
                    error={
                      formik.touched.amount && Boolean(formik.errors.amount)
                    }
                    // helperText={formik.touched.amount && formik.errors.amount}
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            color="textSecondary"
                            sx={{ fontSize: "13px" }}
                          >
                            ₹
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                {formik.touched.amount && formik.errors.amount && (
                  <Typography
                    sx={{
                      ml: "160px",
                      mt: -2,
                      mb: 1,
                      fontSize: "0.75rem",
                      color: COLORS.error,
                    }}
                  >
                    {formik.errors.amount}
                  </Typography>
                )}

                <Box>
                  {/* Reverse Charge */}
                  {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ width: "150px", fontSize: "13px" }}
                    >
                      Reverse Charge
                    </Typography>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isBoxOpen}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setIsBoxOpen(checked);

                            const amount = "10000.00"; // you can dynamically fetch this amount if needed
                            if (checked) {
                              formik.setFieldValue(
                                "payment_made",
                                `₹${amount}`
                              );
                            } else {
                              formik.setFieldValue("payment_made", "");
                              formik.setFieldValue("tax_name", "");
                              formik.setFieldValue("tax_percentage", "");
                              formik.setFieldValue("tax_name_formatted", "");
                            }
                          }}
                          sx={{
                            margin: "10px",
                            p: 0,
                            "& .MuiSvgIcon-root": {
                              fontSize: 17,
                            },
                          }}
                        />
                      }
                      label="This transaction is applicable for reverse charge"
                      sx={{
                        ml: 1,
                        "& .MuiFormControlLabel-label": {
                          fontSize: "13px",
                        },
                      }}
                    />
                  </Box> */}

                  {/* Tax Field — shown only when isBoxOpen is true */}
                  {isBoxOpen && (
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "13px", width: "150px" }}
                        >
                          Tax
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={commonStyles}
                          style={{ width: 400, fontSize: "13px" }}
                        >
                          <StyledSelect
                            name="reverse_charge_tax"
                            value={formik.values.reverse_charge_tax || ""}
                            onChange={(e) => {
                              formik.handleChange(e);
                              // Store the selected tax value directly
                              formik.setFieldValue(
                                "reverse_charge_tax",
                                e.target.value
                              );
                            }}
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{ fontSize: "13px", svg: { fontSize: "22px" } }}
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return (
                                  <Typography
                                    sx={{ color: "#757575", fontSize: "13px" }}
                                  >
                                    Select a Tax
                                  </Typography>
                                );
                              }
                              return selected;
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: { maxHeight: 300 },
                              },
                              MenuListProps: {
                                style: { padding: "0" },
                              },
                            }}
                          >
                            {/* Search input at the TOP */}
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
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Box sx={{ color: "#757575", mr: -0.5 }}>
                                        <SearchIcon sx={{ fontSize: "16px" }} />
                                      </Box>
                                    </InputAdornment>
                                  ),
                                }}
                                onChange={(e) => {
                                  const searchText =
                                    e.target.value.toLowerCase();
                                  document
                                    .querySelectorAll("[data-tax-item]")
                                    .forEach((item) => {
                                      const text =
                                        item.textContent.toLowerCase();
                                      item.style.display = text.includes(
                                        searchText
                                      )
                                        ? "block"
                                        : "none";
                                    });
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

                            {/* Menu items */}
                            {[
                              "IGST0 [0%]",
                              "IGST12 [12%]",
                              "IGST18 [18%]",
                              "IGST28 [28%]",
                              "IGST5 [5%]",
                            ].map((item, idx) => (
                              <MenuItem
                                key={idx}
                                value={item}
                                data-tax-item="true"
                                sx={{
                                  fontSize: "13px",
                                  margin: "2px",
                                  borderRadius: "5px",
                                  "&:hover": {
                                    backgroundColor: "#187c19",
                                    color: "white",
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
                  )}

                  {/* TDS Field */}
                  <Grid container alignItems="center">
                    <Grid item>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "13px", width: "160px" }}
                      >
                        TDS
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={commonStyles}
                        style={{ width: 350, fontSize: "13px" }}
                      >
                        <StyledSelect
                          name="is_tds_amount_in_percent"
                          value={formik.values.is_tds_amount_in_percent || ""}
                          onChange={(e) => handleTDSSelection(e.target.value)}
                          IconComponent={KeyboardArrowDownIcon}
                          sx={{ fontSize: "13px", svg: { fontSize: "22px" } }}
                          displayEmpty
                          renderValue={(selected) =>
                            !selected ? (
                              <Typography
                                sx={{ color: "#757575", fontSize: "13px" }}
                              >
                                Select a TDS Rate
                              </Typography>
                            ) : (
                              selected
                            )
                          }
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 300 } },
                            MenuListProps: { style: { padding: 0 } },
                          }}
                        >
                          {/* Search Box */}
                          <Box
                            sx={{
                              p: 0.75,
                              position: "sticky",
                              top: 0,
                              bgcolor: "background.paper",
                              zIndex: 1,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <TextField
                              autoFocus
                              placeholder="Search terms"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={paymentTermsSearch}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setPaymentTermsSearch(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Escape") handleClose();
                                e.stopPropagation();
                              }}
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

                          {/* Filtered TDS Rate Items */}
                          {filteredTerms.length > 0 ? (
                            filteredTerms.map((item, idx) => (
                              <MenuItem
                                key={idx}
                                value={item}
                                data-tax-item="true"
                                sx={{
                                  fontSize: "13px",
                                  margin: "2px",
                                  borderRadius: "5px",
                                  "&:hover": {
                                    backgroundColor: "#187c19",
                                    color: "white",
                                  },
                                }}
                              >
                                {item}
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
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Payment Date */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
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
                          ref.onclick = () =>
                            ref.showPicker && ref.showPicker(); // For modern browsers
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
                                >
                                  Cash
                                </Typography>
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
                                      borderColor: "#187c19",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#187c19",
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
                                    backgroundColor: "#187c19",
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
                              color: "#187c19",
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

                  {/* Paid Through */}
                  <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        width: "160px",
                        fontSize: "13px",
                        color: "#d62134",
                        paddingTop: "10px",
                      }}
                    >
                      Paid Through *
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ width: "350px" }}>
                      <StyledSelect
                        name="paid_through_account_id"
                        value={formik.values.paid_through_account_id || ""}
                        onChange={formik.handleChange}
                        IconComponent={KeyboardArrowDownIcon}
                        displayEmpty
                        open={isOpen}
                        onOpen={handleOpen}
                        onClose={handleClose}
                        error={
                          formik.touched.paid_through_account_id &&
                          Boolean(formik.errors.paid_through_account_id)
                        }
                        renderValue={(selected) =>
                          selected ? (
                            <Typography
                              sx={{ fontSize: "13px", color: "#000" }}
                            >
                              {selected}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{ color: "#aaa", fontSize: "13px" }}
                            >
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
                          Object.entries(groupedOptions).map(
                            ([group, items]) => (
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
                                        backgroundColor: "#187c19",
                                        color: "white",
                                      },
                                      // Highlight selected item
                                      ...(formik.values
                                        .paid_through_account_id === item.label
                                        ? {
                                            backgroundColor: "#eaf1ff",
                                            "&:hover": {
                                              backgroundColor: "#187c19",
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
                            )
                          )
                        ) : (
                          <MenuItem
                            disabled
                            sx={{ fontSize: "13px", opacity: 0.6 }}
                          >
                            No results found
                          </MenuItem>
                        )}

                        <Divider sx={{ my: 1 }} />

                        {/* Configure Accounts Button */}
                        <MenuItem
                          sx={{
                            fontSize: "13px",
                            color: "#187c19",
                            display: "flex",
                            alignItems: "center",
                            padding: "6px 16px",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f0f7ff" },
                            borderRadius: "4px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Set modal for account config
                            // setIsPaidThroughModalOpen(true);
                            handleClose();
                          }}
                        >
                          <SettingsOutlinedIcon
                            sx={{ fontSize: "16px", mr: "10px" }}
                          />
                          Configure Accounts
                        </MenuItem>
                      </StyledSelect>
                      {formik.touched.paid_through_account_id &&
                        formik.errors.paid_through_account_id && (
                          <Typography color="error" variant="caption">
                            {formik.errors.paid_through_account_id}
                          </Typography>
                        )}
                    </FormControl>
                  </Box>
                  {/* Deposit To */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        width: "160px",
                        fontSize: "13px",
                      }}
                    >
                      Deposit To
                    </Typography>

                    <Grid item xs={5}>
                      <FormControl fullWidth size="small" sx={{ width: 350 }}>
                        <StyledSelect
                          name="deposite_to"
                          value={formik.values.deposite_to || ""}
                          onChange={formik.handleChange}
                          onOpen={() => setIsPaymentTermsOpen(true)}
                          onClose={() => {
                            setIsPaymentTermsOpen(false);
                            setPaymentTermsSearch("");
                          }}
                          IconComponent={KeyboardArrowDownIcon}
                          sx={{
                            fontSize: "13px",
                            svg: { fontSize: "22px" },
                          }}
                          displayEmpty
                          error={
                            formik.touched.deposite_to &&
                            Boolean(formik.errors.deposite_to)
                          }
                          renderValue={(selected) =>
                            !selected ? (
                              <Typography
                                sx={{ color: "#757575", fontSize: "13px" }}
                              >
                                Select Deposit To
                              </Typography>
                            ) : (
                              selected
                            )
                          }
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 300 } },
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
                                value={paymentTermsSearch}
                                onChange={(e) =>
                                  setPaymentTermsSearch(e.target.value)
                                }
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === "Escape")
                                    setIsPaymentTermsOpen(false);
                                  e.stopPropagation();
                                }}
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
                                      borderColor: "#187c19",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#187c19",
                                    },
                                  },
                                }}
                              />
                            </Box>
                          </MenuItem>

                          {/* Filtered Deposit Options */}
                          {filtereddeposite.length > 0 ? (
                            filtereddeposite.map((item, idx) => (
                              <MenuItem
                                key={idx}
                                value={item}
                                sx={{
                                  fontSize: "13px",
                                  margin: "2px",
                                  borderRadius: "5px",
                                  "&:hover": {
                                    backgroundColor: "#187c19",
                                    color: "white",
                                  },
                                }}
                              >
                                {item}
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
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                  </Box>
                  {/* Reference Number */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                </Box>

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
                        alignItems: "flex-start", // ensures text starts from the top
                        "&:hover fieldset": {
                          borderColor: "#187c19",
                        },
                        "& textarea": {
                          height: "100% !important",
                          fontSize: "13px",
                          padding: "0px",
                          boxSizing: "border-box",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Attachments Section */}
                <Grid item xs={5}>
                  <Box sx={{ width: "100%" }}>
                    <Box>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: "12PX" }}
                      >
                        Attachments
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          padding: "8px", // Add padding for better spacing
                          borderRadius: "8px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<FileUploadOutlinedIcon />}
                          component="label"
                          size="small"
                          sx={{
                            color: "black",
                            border: "2px dotted #d6d6dc",
                            width:"150PX"
                          }}
                        >
                          Upload File
                          <input
                            type="file"
                            name="documents"
                            hidden
                            // ref={formik.values.documents}
                            accept=".pdf, .jpeg, .jpg, .png" // Allowed file types
                            onChange={handleFileUpload}
                          />
                        </Button>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          // display: "block",
                          fontSize: "12px",
                          width: "100%",
                        }}
                      >
                        You can upload a maximum of 5 files, 10MB each
                      </Typography>

                      {/* List of uploaded files */}
                      {files.length > 0 && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 1,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            Selected File:
                          </Typography>

                          {/* Display file preview if it's an image */}
                          {previewFile && (
                            <Box sx={{ mb: 1 }}>
                              <img
                                src={previewFile}
                                alt="Preview"
                                style={{
                                  width: "150px",
                                  height: "auto",
                                  marginBottom: "8px",
                                }}
                              />
                            </Box>
                          )}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              // padding: "8px", // Add padding for better spacing
                              // borderRadius: "8px",
                            }}
                          >
                            <Typography variant="body2">
                              {files.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={removeFile}
                              sx={{ ml: 1 }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>

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
              type="submit"
              disableElevation
              disabled={formik.isSubmitting || !selectedVendor}
              sx={{
                textTransform: "none",
                backgroundColor: "#187c19",
                color: "white",
                borderRadius: "5px",
                px: 2,
                py: 0.75,
                fontWeight: 400,
                fontSize: "14px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow: "none",
                },
              }}
              color="primary"
              onClick={() => {
                // Set is_advance_payment to false for final submission
                formik.setFieldValue("is_advance_payment", false);
                formik.handleSubmit();
              }}
            >
              Save
            </Button>
            <Link style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                sx={{
                  textTransform: "none",
                  borderColor: "#ddd",
                  color: "#333",
                  borderRadius: "5px",
                  px: 2,
                  py: 0.75,
                  fontWeight: 400,
                  fontSize: "14px",
                  "&:hover": {
                    borderColor: "#bbb",
                    backgroundColor: "#f8f8f8",
                  },
                }}
              >
                Cancel
              </Button>
            </Link>
          </Paper>
        </Grid>
      </form>
    </Box>
  );
};

export default VendorAdvance;
