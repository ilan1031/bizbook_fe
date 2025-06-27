"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Button,
  Popper,
  FormControl,
  TextareaAutosize,
  Popover,
  Select,
  MenuItem,
  Alert,
  Toolbar,
  FormHelperText,
  CircularProgress,
  styled,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import ItemTable from "../../../itemTable";
import CustomerDropDown from "../../../../common/CustomerDropDown";
import { Modal } from "@mui/material";
import Customize from "../../../../common/customizeautogeneration/page";
import ProjectSelector from "../../../../common/salespersondropdown/ProjectSelector";
import NewProject from "../../../../common/newproject/ProjectSelector";
import EditIcon from "@mui/icons-material/Edit";
import apiService from "../../../../../../src/services/axiosService";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import config from "../../../../../../src/services/config";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useSnackbar } from "../../../../../../src/components/SnackbarProvider";
import { useRouter } from "next/navigation";

const QuoteEditPage = () => {
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, quantity: 1.0, rate: 0.0, amount: 0.0 },
  ]);
  const [quoteNumber, setQuoteNumber] = useState("QT-000004");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [taxType, setTaxType] = useState("tds");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElProject, setAnchorElProject] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openProjectDropdown, setOpenProjectDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [anchorElSales, setAnchorElSales] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const [itemMenuAnchorEl, setItemMenuAnchorEl] = useState(null);
  const itemMenuOpen = Boolean(itemMenuAnchorEl);
  const [customerData, setCustomerData] = useState(null);
  const organization_id = localStorage.getItem("organization_id");
  const [estimateId, setEstimateId] = useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const [loading, setLoading] = useState(true);
  const [isZoho, setIsZoho] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState([]);
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
  // Move fetchCustomerData function here, before useEffect
  const fetchCustomerData = async (uniqueId) => {
    if (!uniqueId) return; // Early exit if uniqueId is missing

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
    }
  };

  // Initialize formik first to fix the linter error
  const formik = useFormik({
    initialValues: {
      customer_id: "",
      customer_name: "",
      reference_number: "",
      invoices: [],
      invoice_ids: [],
      salesorders: [],
      date: "",
      date_formatted: "",
      expiry_date: "",
      expiry_date_formatted: "",
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
          description:"",
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
      total: 0,
      total_formatted: "₹0.00",
      adjustment: 0,
      adjustment_description: "Adjustment",
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
      documents: null,
      salesperson_id: "",
      salesperson_name: "",
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        
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

        // Validate TCS/TDS option
        if (!values.tds_option && !values.tax_type) {
          errors.push("Please select TCS/TDS option");
        }

        // If there are validation errors, update the general errors and stop submission
        if (errors.length > 0) {
          await setFieldValue("general", errors);
          setSubmitting(false);
          return;
        }

        const organization_id = localStorage.getItem("organization_id");
        if (!organization_id) {
          console.error("Organization ID not found");
          return;
        }

        // Prepare data for backend
        const requestData = {
          customer_id: customerData?.contact_id,
          customer_name: customerData?.contact_name,
          estimate_number: estimateId,
          reference_number: values.reference_number,
          payment_terms: customerData?.payment_terms,
          payment_terms_label: customerData?.payment_terms_label,
          invoices: [],
          invoice_ids: [],
          salesorders: [],
          date: values.date,
          date_formatted: values.date_formatted,
          expiry_date: values.expiry_date,
          expiry_date_formatted: values.expiry_date_formatted,
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
          total_formatted: values.total_formatted,
          adjustment: parseFloat(values.adjustment) || 0,
          adjustment_description:values.adjustment_description,
          status: values.status,
          status_formatted: values.status_formatted,
          place_of_supply: values.place_of_supply,
          gst_treatment: values.gst_treatment,
          tds_id: values.tds_id,
          payment_terms: values.payment_terms,
          payment_terms_label: values.payment_terms_label,
          tcs_id: values.tcs_id,
          discount_percent: values.discount_percent,
          discount_amount_formatted: values.discount_amount_formatted,
          discount_amount: values.discount_amount,
          documents: values.documents,
          salesperson_id: formik.values.salesperson_id,
          salesperson_name: formik.values.salesperson_name,
        };

        // Make API call for update
        const response = await apiService({
          method: "PUT",
          url: `/api/v1/estimates/${slug}`,
          customBaseUrl: config.SO_Base_url,
          params: {
            organization_id: organization_id,
          },
          data: requestData,
          validateStatus: null,
          file: true, 
        });

        if (response?.data?.status) {
          showMessage("Quote updated successfully", "success");
          router.push("/sales/quotes");
        } else {
          showMessage(
            response?.data?.message || "Failed to update quote",
            "error"
          );
          console.error("Update failed:", response?.data);
        }
      } catch (error) {
        console.error("Error updating quote:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          showMessage(
            error.response.data?.message || "Failed to update quote",
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
    },
  });

  // Fetch quote data when component mounts
  useEffect(() => {
    const fetchQuoteData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add validation for slug
        if (!slug) {
          console.error("No quote ID provided in URL");
          setError("No quote ID provided");
          setLoading(false);
          return;
        }

        console.log("Fetching quote data for slug:", slug);
        console.log("Organization ID:", organization_id);

        const response = await apiService({
          method: "GET",
          url: `/api/v1/estimates/${slug}`,
          params: {
            organization_id: organization_id,
          },
          customBaseUrl: config.SO_Base_url,
        });

        console.log("API Response:", response);

        if (response.data && response.data.estimate) {
          const quoteData = response.data.estimate;
          console.log("Fetched quote data:", quoteData);

          // Check quote status
          setQuoteStatus(quoteData.status);
          if (
            quoteData.status === "accepted" ||
            quoteData.status === "invoiced"
          ) {
            setShowStatusPopup(true);
            setLoading(false);
            return;
          }

          // Set form values
          formik.setValues({
            customer_id: quoteData.customer_id || "",
            customer_name: quoteData.customer_name || "",
            reference_number: quoteData.reference_number || "",
            date: quoteData.date || "",
            date_formatted: quoteData.date_formatted || "",
            expiry_date: quoteData.expiry_date || "",
            expiry_date_formatted: quoteData.expiry_date_formatted || "",
            billing_address: quoteData.billing_address || "",
            shipping_address: quoteData.shipping_address || "",
            place_of_supply: quoteData.place_of_supply || "",
            line_items: quoteData.line_items || [],
            line_items: quoteData.line_items.map((item) => ({
              ...item,
              amount:item.item_total,
            })),
            tax_type: quoteData.tax_type || "TDS",
            tax_percentage: quoteData.tax_percentage || 0,
            discount_percent: quoteData.discount_percent || 0,
            discount_amount_formatted:
              quoteData.discount_amount_formatted || "",
            discount_amount: quoteData.discount_amount || "",
            tds_option: quoteData.tds_option || "",
            tds_id: quoteData.tds_id || "",
            tcs_id: quoteData.tcs_id || "",
            sub_total: quoteData.sub_total || 0,
            sub_total_formatted: quoteData.sub_total_formatted || "₹0.00",
            tax_total: quoteData.tax_total || 0,
            tax_total_formatted: quoteData.tax_total_formatted || "₹0.00",
            total_amount: quoteData.total || 0,
            total: quoteData.total || 0,
            total_formatted: quoteData.total_formatted || "₹0.00",
            adjustment: quoteData.adjustment || 0,
            status: quoteData.status || "draft",
            place_of_supply: quoteData.place_of_supply || "",
            gst_treatment: quoteData.gst_treatment || "",
            payment_terms: quoteData.payment_terms || 0,
            payment_terms_label:
              quoteData.payment_terms_label || "Due On Receipt",
            gst_no: quoteData.gst_no || "",
            terms: quoteData.terms || "",
            notes: quoteData.notes || "",
            status_formatted: quoteData.status_formatted || "Draft",
            general: [],
            documents: quoteData.documents || null,
            salesperson_id: quoteData.salesperson_id,
            salesperson_name: quoteData.salesperson_name,
            adjustment_description: quoteData.adjustment_description ? quoteData.adjustment_description : "Ajustment",
          });

          // Set other state values
          setEstimateId(
            quoteData.quote_number || quoteData.estimate_number || ""
          );
          setSelectedSalesperson(quoteData.salesperson || "");
          setSelectedProject(quoteData.project || "");

          // Set customer data
          if (quoteData.customer_id) {
            await fetchCustomerData(quoteData.customer_id);
          }

          // Set selected customer
          if (quoteData.customer_name) {
            setSelectedCustomer({
              contact_id: quoteData.customer_id,
              contact_name: quoteData.customer_name,
              gst_treatment: quoteData.gst_treatment,
              place_of_contact: quoteData.place_of_supply,
            });
          }

          // Set line items
          if (quoteData.line_items && quoteData.line_items.length > 0) {
            setQuoteItems(
              quoteData.line_items.map((item, index) => ({
                id: index + 1,
                quantity: item.quantity || 1.0,
                rate: item.rate || 0.0,
                amount: item.amount || 0.0,
                name: item.name || "",
                item_id: item.item_id || "",
                discount: item.discount || 0,
              }))
            );
          }
        } else {
          setError("No data received from the server");
          console.error("Invalid response format:", response);
          showMessage(
            "Failed to fetch quote data: Invalid response format",
            "error"
          );
        }
      } catch (error) {
        console.error("Error fetching quote data:", error);
        if (error.response && error.response.status === 404) {
          setError("Quote not found");
          showMessage("Quote not found", "error");
        } else if (error.response && error.response.status === 500) {
          setError("Server error occurred while fetching quote");
          showMessage("Server error occurred while fetching quote", "error");
        } else {
          setError(error.message || "Failed to fetch quote data");
          showMessage("Failed to fetch quote data", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug && organization_id) {
      fetchQuoteData();
    } else {
      console.error("Missing required parameters:", { slug, organization_id });
      setError("Missing required parameters");
      setLoading(false);
    }
  }, [slug, organization_id]);

  // Add loading and error state UI
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (showStatusPopup) {
    return (
      <Box sx={{ position: "relative", height: "100vh" }}>
        {/* Edit Quote Box */}
        <Box
          sx={{
            position: "absolute",
            top: 2,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            borderBottom: "4px solid #ddd",
            padding: "10px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="h1" sx={{ fontSize: "18px" }}>
            Edit Quote
          </Typography>
          <IconButton
            size="small"
            onClick={() => router.push("/sales/quotes")}
            sx={{ color: "red" }}
          >
            <CloseIcon />
          </IconButton>
          {/* <IconButton
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
              </IconButton> */}
        </Box>

        {/* Warning Banner */}
        <Box
          sx={{
            position: "absolute",
            top: "55px", // Position below the Edit Quote box
            left: 0,
            right: 0,
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "15px 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: "14px" }}>
            You are not allowed to edit an accepted quote. Enable this option in
            Settings to edit this.
          </Typography>
        </Box>

        {/* Blurred Content */}
        <Box
          sx={{
            filter: "blur(4px)",
            pointerEvents: "none",
            opacity: 0.5,
            pt: "96px", // Add padding to account for both boxes
          }}
        >
          {/* Your existing form content */}
          <form>{/* ... existing form content ... */}</form>
        </Box>
      </Box>
    );
  }

  // Handler for opening the Menu
  const handleItemMenuOpen = (event) => {
    setItemMenuAnchorEl(event.currentTarget);
  };

  // Handler for closing the Menu
  const handleItemMenuClose = () => {
    setItemMenuAnchorEl(null);
  };
  const handleOpenDropdown = (event) => {
    setAnchorElSales(event.currentTarget);
    setOpenDropdown((prev) => !prev); // Toggle dropdown
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };

  // const [openPopover, setOpenPopover] = useState(false);
  const handleRowClick = (customer) => {
    router.push(`/sales/quotes/${customer.key}`);
  };
  const handleOpen = (event) => {
    console.log("event", event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSettingsClick = () => {
    setOpenModal(true);
  };
  //    const handleOpenManageSalesModal = () => setOpenManageSalesModal(true);
  // const handleCloseManageSalesModal = () => setOpenManageSalesModal(false);
  //newproject popover
  const handlePopoverOpen = () => {
    // setOpenPopover(true);
    setAnchorElProject(event.currentTarget);
  };

  const handlePopoverClose = () => {
    // setOpenPopover(false);
    setAnchorElProject(null);
  };
  const openPopover = Boolean(anchorElProject);
  const idProject = openPopover ? "project-popover" : undefined;

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
      ...commonInteractionStyles["& .MuiOutlinedInput-root"],
    },
  };

  const helperTextStyle = {
    color: "text.secondary",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 1,
  };

  const formLabelStyle = {
    fontSize: "0.875rem",
    minWidth: "120px",
    whiteSpace: "nowrap",
    color: "error.main",
  };

  const formLabelBlackStyle = {
    ...formLabelStyle,
    color: "text.primary",
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
    await formik.setFieldValue("place_of_supply", data.place_of_contact || "");
    fetchCustomerData(data.contact_id);
    handleClose();
    formik.validateForm(); // Trigger validation after setting values
  };

  const handleSalespersonChange = (event) => {
    setSelectedSalesperson(event.target.value);
  };

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleTaxTypeChange = (event) => {
    setTaxType(event.target.value);
  };

  // Handle quote date change
  const handleQuoteDateChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue("date", date);
    formik.setFieldValue("date_formatted", formatDate(date));
  };

  // Handle expiry date change
  const handleExpiryDateChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue("expiry_date", date);
    formik.setFieldValue("expiry_date_formatted", formatDate(date));
  };

  // Format date helper function
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle Save as Draft
  const handleSave = async () => {
    try {
      console.log("Starting save process...");
      setOpenAlert(true); // Show validation errors if any
      formik.setFieldValue("status", "draft");
      formik.setFieldValue("status_formatted", "Draft");

      // Validate form before submission
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        console.log("Form validation errors:", errors);
        return;
      }

      // Prepare data for backend
      const requestData = {
        customer_id: customerData?.contact_id,
        customer_name: customerData?.contact_name,
        estimate_number: estimateId,
        reference_number: formik.values.reference_number,
        payment_terms: customerData?.payment_terms,
        payment_terms_label: customerData?.payment_terms_label,
        invoices: [],
        invoice_ids: [],
        salesorders: [],
        date: formik.values.date,
        date_formatted: formik.values.date_formatted,
        expiry_date: formik.values.expiry_date,
        expiry_date_formatted: formik.values.expiry_date_formatted,
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
        total: parseFloat(formik.values.total) || 0,
        total_formatted: formik.values.total_formatted,
        adjustment: parseFloat(formik.values.adjustment) || 0,
        adjustment_description: formik.values.adjustment_description,
        status: "draft",
        status_formatted: "Draft",
        place_of_supply: formik.values.place_of_supply,
        gst_treatment: formik.values.gst_treatment,
        tds_id: formik.values.tds_id,
        payment_terms: formik.values.payment_terms,
        payment_terms_label: formik.values.payment_terms_label,
        tcs_id: formik.values.tcs_id,
        discount_percent: formik.values.discount_percent,
        discount_amount_formatted: formik.values.discount_amount_formatted,
        discount_amount: formik.values.discount_amount,
        documents: formik.values.documents,
        salesperson_id: formik.values.salesperson_id,
        salesperson_name: formik.values.salesperson_name,
      };

      // Make API call for update
      const response = await apiService({
        method: "PUT",
        url: `/api/v1/estimates/${slug}`, // `slug` is the quote_id
        customBaseUrl: config.SO_Base_url,
        params: {
          organization_id: organization_id, // Ensure this is correctly set
        },
        data: requestData,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: null, // Accept all status codes
      });

      console.log("API Response received:", response);

      if (response?.data?.status) {
        console.log("Update successful");
        showMessage("Quote updated successfully", "success");
        router.push(`/sales/quotes/${slug}`);
      } else {
        console.log("Update failed:", response?.data);
        showMessage(
          response?.data?.message || "Failed to update quote",
          "error"
        );
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        showMessage(
          error.response.data?.message || "Failed to update quote",
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

  // Handle Save and Send
  const handleSaveAndSend = async () => {
    try {

      setOpenAlert(true); // Show validation errors if any
      formik.setFieldValue("status", "sent");
      formik.setFieldValue("status_formatted", "Sent");

      // Validate form before submission
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        return;
      }

      // Prepare data for backend
      const requestData = {
        customer_id: customerData?.contact_id,
        customer_name: customerData?.contact_name,
        estimate_number: estimateId,
        reference_number: formik.values.reference_number,
        payment_terms: customerData?.payment_terms,
        payment_terms_label: customerData?.payment_terms_label,
        invoices: [],
        invoice_ids: [],
        salesorders: [],
        date: formik.values.date,
        date_formatted: formik.values.date_formatted,
        expiry_date: formik.values.expiry_date,
        expiry_date_formatted: formik.values.expiry_date_formatted,
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
        total: parseFloat(formik.values.total) || 0,
        total_formatted: formik.values.total_formatted,
        adjustment: parseFloat(formik.values.adjustment) || 0,
        adjustment_description:formik.values.adjustment_description,
        status: "sent",
        status_formatted: "Sent",
        place_of_supply: formik.values.place_of_supply,
        gst_treatment: formik.values.gst_treatment,
        tds_id: formik.values.tds_id,
        payment_terms: formik.values.payment_terms,
        payment_terms_label: formik.values.payment_terms_label,
        tcs_id: formik.values.tcs_id,
        discount_percent: formik.values.discount_percent,
        discount_amount_formatted: formik.values.discount_amount_formatted,
        discount_amount: formik.values.discount_amount,
        documents: formik.values.documents,
        salesperson_id: formik.values.salesperson_id,
        salesperson_name: formik.values.salesperson_name,
      };

      // Make API call for update
      const response = await apiService({
        method: "PUT",
        url: `api/v1/estimates/${slug}`,
        params: {
          organization_id: organization_id,
        },
        data: requestData,
        validateStatus: null, 
        file: true,
      });

      if (response?.data?.status) {
        showMessage("Quote updated and sent successfully", "success");
        router.push(`/sales/quotes/${slug}`);
      } else {
        showMessage(
          response?.data?.message || "Failed to update and send quote",
          "error"
        );
        console.error("Update failed:", response?.data);
      }
    } catch (error) {
      console.error("Error updating quote:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        showMessage(
          error.response.data?.message || "Failed to update and send quote",
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

  // const toggleMode = () => {
  //   setIsZoho((prev) => !prev);
  //   router.push("/tally/voucher"); // Navigate on toggle
  // };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];

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

  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#ffffff",
        }}
      >
        {/* Header */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px",
          }}
        >
          <Box>
            <Typography variant="h6" component="h1">
              Edit Quote
            </Typography>
          </Box>
          <Box>
            {" "}
            {/* Right Section - Toggle & Close Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                // onClick={toggleMode}
              >
                {/* {isZoho ? (
                <ToggleOnIcon sx={{ color: "#336699", fontSize: 32 }} /> // Visible color
              ) : (
                <ToggleOffIcon sx={{ color: "#888", fontSize: 32 }} /> // Visible color
              )} */}
                {/* <Typography
                variant="body1"
                sx={{ ml: 1, color: "#333", fontWeight: "bold" }}
              >
                {"Zoho"}
              </Typography> */}
              </div>

              {/* Close Button */}
              <IconButton
                aria-label="Close"
                sx={{ color: "red" }}
                onClick={() => router.back()}
              >
                <CloseIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </div>
          </Box>
        </Toolbar>
        {/* <Divider /> */}
        <Grid
          sx={{
            m: 2,
          }}
          xs={12}
        >
          {openAlert &&
            formik.values.general &&
            formik.values.general.length > 0 && (
              <Alert
                severity="error"
                icon={false}
                sx={{
                  fontSize: "13px",
                  mb: 2,
                  "& ul": {
                    margin: 0,
                    paddingLeft: 2,
                    listStyleType: "none",
                  },
                  "& li": {
                    marginBottom: "4px",
                  },
                }}
                onClose={() => {
                  setOpenAlert(false);
                  formik.setFieldValue("general", []);
                }}
                slotProps={{
                  closeButton: { sx: { color: "#fe4242" } },
                }}
              >
                <ul>
                  {formik.values.general.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </Alert>
            )}
        </Grid>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit(e);
          }}
          sx={{
            overflowY: "auto",
            backgroundColor: "#f6f6f6",
          }}
        >
          <Box
            sx={{
              overflowX: "hidden",
              backgroundColor: "#f6f6f6",
            }}
          >
            <Grid container spacing={2}>
              {/* Customer Name Section */}
              <Grid item xs={12}>
                <Grid
                  container
                  sx={{
                    px: 2,
                    pb: 3,
                    pt: 4,
                    ...formRowStyle,
                    flexWrap: "nowrap",
                  }}
                >
                  {/* Label */}
                  <Grid item sx={formLabelStyle}>
                    <Typography variant="subtitle2" sx={formLabelStyle}>
                      Customer Name*
                    </Typography>
                  </Grid>

                  {/* Combined Input + Search */}
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      width: "500px",
                      flexShrink: 0,
                    }}
                  >
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
                              <KeyboardArrowDownOutlinedIcon
                                sx={commonIconStyle}
                              />
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        PaperProps={{
                          sx: {
                            width: "500px",
                            height: "300px",
                            overflow: "none",
                          },
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
                              sx={{
                                p: 0.5,
                                height: "fit-content",
                                color: "#757575",
                              }}
                              // onClick={(e) => handleClickBA(e, "edit")}
                            >
                              <EditIcon sx={{ fontSize: "16px" }} />
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
                            <>
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
                                    .join(" "), // state + zip in one line
                                  customerData?.billing_address?.country,
                                  customerData?.billing_address?.phone
                                    ? `Phone ${customerData?.billing_address?.phone}`
                                    : null,
                                  customerData?.billing_address?.fax
                                    ? `Fax Number ${customerData?.billing_address?.fax}`
                                    : null,
                                ]
                                  .filter(Boolean) // Remove empty, null, undefined
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
                            </>
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
                              sx={{
                                p: 0.5,
                                height: "fit-content",
                                color: "#757575",
                              }}
                              // onClick={(e) => handleClickBA(e, "edit")}
                            >
                              <EditIcon sx={{ fontSize: "16px" }} />
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
                            <>
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
                                    .join(" "), // state + zip in one line
                                  customerData?.shipping_address?.country,
                                  customerData?.shipping_address?.phone
                                    ? `Phone ${customerData?.shipping_address?.phone}`
                                    : null,
                                  customerData?.shipping_address?.fax
                                    ? `Fax Number ${customerData?.shipping_address?.fax}`
                                    : null,
                                ]
                                  .filter(Boolean) // Remove empty, null, undefined
                                  .map((line, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        fontWeight:
                                          index === 0 ? "bold" : "400",
                                      }}
                                    >
                                      {line}
                                    </div>
                                  ))}
                              </Typography>
                            </>
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
                    <Box sx={{ my: 2 }}>
                      <Typography variant="body2" color="#4c526c">
                        GST Treatment:{" "}
                        <Typography
                          component="span"
                          sx={{
                            color: "#000",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          {customerData?.gst_treatment}
                        </Typography>
                      </Typography>
                      {customerData?.gst_no && (
                        <Typography
                          variant="bottom"
                          color="#4c526c"
                          fontSize={12}
                        >
                          GSTIN:{" "}
                          <span style={{ color: "#000" }}>
                            {customerData?.gst_no}
                          </span>
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>
            {customerData !== null &&
              customerData.gst_treatment !== "Overseas" && (
                <Grid container spacing={2}>
                  {/* Place of supply Section */}
                  <Grid item xs={12}>
                    <Grid
                      container
                      sx={{
                        px: 2,
                        pb: 3,
                        pt: 4,
                        ...formRowStyle,
                        flexWrap: "nowrap",
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
                        sx={{
                          display: "flex",
                          width: "500px",
                          flexShrink: 0,
                        }}
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
                              />
                            )}
                            renderOption={(props, option) => (
                              <li
                                {...props}
                                style={{
                                  fontSize: "13px",
                                  padding: "6px 12px",
                                }}
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

            <Box
              sx={{
                pr: 22,
                width: "100%",
                backgroundColor: "white",
                borderBottom: "1px solid #ddd",
              }}
            >
              {/* Quote Number Field */}
              <Grid
                container
                sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
              >
                <Grid item sx={formLabelStyle}>
                  <Typography variant="subtitle2" sx={formLabelStyle}>
                    Quote#*
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{ display: "flex", width: "320px", flexShrink: 0 }}
                >
                  <TextField
                    fullWidth
                    id="estimateId"
                    value={estimateId}
                    disabled
                    onChange={(e) => setEstimateId(e.target.value)}
                    sx={{
                      ...commonInputStyle,
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000", // Makes text black even when disabled
                      },
                    }}
                    InputProps={{
                      // readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            // onClick={handleSettingsClick}
                            sx={{ color: "primary.main", p: 0 }}
                          >
                            <SettingsOutlinedIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Customize estimateId={estimateId} />{" "}
                    {/* Display Customize component inside the modal */}
                  </Box>
                </Modal>
              </Grid>

              {/* Reference Field */}
              {formik.values.reference_number && (
                <Grid
                  container
                  sx={{ px: 2, pt: 2, ...formRowStyle, flexWrap: "nowrap" }}
                >
                  <Grid item sx={formLabelBlackStyle}>
                    <Typography variant="subtitle2" sx={formLabelBlackStyle}>
                      Reference#
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{ display: "flex", width: "320px", flexShrink: 0 }}
                  >
                    <TextField
                      fullWidth
                      id="reference_number"
                      name="reference_number"
                      disabled
                      value={formik.values.reference_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.reference_number &&
                        Boolean(formik.errors.reference_number)
                      }
                      helperText={
                        formik.touched.reference_number &&
                        formik.errors.reference_number
                      }
                      sx={{
                        ...commonInputStyle,
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000", // Makes text black even when disabled
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Date Fields */}
              <Grid container sx={{ px: 2, pt: 2, gap: 4 }}>
                {/* Quote Date */}
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{ display: "flex", ...formRowStyle, flexWrap: "nowrap" }}
                >
                  <Grid item sx={formLabelStyle}>
                    <Typography variant="subtitle2" sx={formLabelStyle}>
                      Quote Date*
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{ display: "flex", width: "320px", flexShrink: 0 }}
                  >
                    <TextField
                      fullWidth
                      id="quoteDate"
                      value={formik.values.date}
                      type="date"
                      onChange={handleQuoteDateChange}
                      sx={commonInputStyle}
                    />
                  </Grid>
                </Grid>

                {/* Expiry Date */}
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{ display: "flex", ...formRowStyle, flexWrap: "nowrap" }}
                >
                  <Grid item sx={formLabelBlackStyle}>
                    <Typography variant="subtitle2" sx={formLabelBlackStyle}>
                      Expiry Date
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{ display: "flex", width: "320px", flexShrink: 0 }}
                  >
                    <TextField
                      fullWidth
                      id="expiryDate"
                      type="date"
                      value={formik.values.expiry_date}
                      onChange={handleExpiryDateChange}
                      placeholder="dd/MM/yyyy"
                      sx={commonInputStyle}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <SectionDivider sx={{ my: 4 }} />

              {/* Salesperson */}
              <Grid container sx={{ px: 2, my: 2, flexWrap: "nowrap" }}>
                {/* Salesperson Label */}
                <Grid item sx={formLabelBlackStyle}>
                  <Typography variant="subtitle2" sx={formLabelBlackStyle}>
                    Salesperson
                  </Typography>
                </Grid>

                {/* Salesperson Input Field */}
                <Grid
                  item
                  sx={{ display: "flex", width: "360px", flexShrink: 0, ml: 6 }}
                >
                  <FormControl sx={formControlStyle.combinedWithButton}>
                    <TextField
                      value={selectedSalesperson?.salesperson_name  || formik.values.salesperson_name}
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
                    sx={{
                      bgcolor: "background.paper",
                      boxShadow: 3,
                      p: 2,
                      borderRadius: 1,
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    <ProjectSelector closeDropdown={handleCloseDropdown} formik={formik} onSelect={(selectedPerson) => {
                    setSelectedSalesperson(selectedPerson);
                    formik.setFieldValue(
                      "salesperson_id",
                      selectedPerson?.salesperson_id
                    );
                    formik.setFieldValue(
                      "salesperson_name",
                      selectedPerson?.salesperson_name
                    );
                  }}/>
                  </Box>
                </Popper>
              </Grid>

              {/* Project Name */}
              {/* <Grid container sx={{ px: 2, flexWrap: "nowrap" }}> */}
              {/* Project Name Label */}
              {/* <Grid item sx={formLabelBlackStyle}>
                <Typography variant="subtitle2" sx={formLabelBlackStyle}>
                  Project Name
                </Typography>
              </Grid> */}

              {/* Project Input Field */}
              {/* <Grid
                item
                sx={{ display: "flex", width: "360px", flexShrink: 0, ml: 6 }}
              >
                <FormControl sx={formControlStyle.combinedWithButton}>
                  <TextField
                    value={selectedProject || ""}
                    onClick={(event) => {
                      setAnchorElProject(event.currentTarget); // Set anchor element for Popper
                      setOpenProjectDropdown((prevOpen) => !prevOpen); // Toggle Popper state
                    }}
                    disabled={!formik.values.customer_id}
                    placeholder="Select a project"
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
              </Grid> */}
              {/* Popper (Dropdown under input) */}
              {/* <Popper
                open={openProjectDropdown}
                anchorEl={anchorElProject} // Anchor to the TextField
                placement="bottom-start" // Position below the input field
                sx={{ zIndex: 1300, width: "360px" }} // Match the width of the input field
              > */}
              {/* Content for the Popper */}
              {/* <NewProject
                  closeDropdown={() => setOpenProjectDropdown(false)}
                /> */}
              {/* </Popper>
            </Grid> */}

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
                      placeholder="Let your customer know what this Quote is for"
                      minRows={1}
                      style={{ ...commonTextareaInputStyle }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <SectionDivider sx={{ my: 4 }} />
              <Grid container>
                <Grid item xs={12}>
                  <ItemTable formik={formik} />
                </Grid>
              </Grid>
            </Box>

            {/* Terms & Conditions and File Attachments */}
            <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
              {/* Terms & Conditions */}
              <Grid item xs={6} sx={{ ml: 2 }}>
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
                    id="termsConditions"
                    minRows={3}
                    placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                    style={commonTextareaInputStyle}
                  />
                </Box>
              </Grid>

              {/* Vertical Divider */}
              <Grid item>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: "rgba(78, 78, 78, 0.14)",
                    height: "140px",
                    mt: 1,
                  }}
                />
              </Grid>

              {/* File Attachments */}
              <Grid item xs={5}>
                <Typography variant="body2" gutterBottom>
                  Attach File(s) to Quote
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FontAwesomeIcon icon={faUpload} />}
                    component="label"
                    sx={{
                      alignSelf: "flex-start",
                      // borderColor: "#cbd5e1",
                      // color: "#475569",
                      // bgcolor: "#fff",
                      // textTransform: "none",
                      borderStyle: "dashed",
                      height: "36px",
                      px: 2,
                    }}
                  >
                    Upload File
                    <input
                      type="file"
                      name="documents"
                      hidden
                      accept=".pdf, .jpeg, .jpg, .png" // Allowed file types
                      onChange={handleFileUpload}
                    />
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    You can upload a maximum of 5 files, 10MB each
                  </Typography>
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
                        <Typography variant="body2">{files[0].name}</Typography>
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
                  {typeof formik.values.documents === "string" &&
                              <Box sx={{ mb: 1 }}>
                                      <img
                                        src={`${config.SO_Base_url}/uploads/invoice/${formik.values.documents}`}
                                        alt="Preview"
                                        style={{
                                          width: "150px",
                                          height: "auto",
                                          marginBottom: "8px",
                                        }}
                                      />
                                    </Box>
                                    }
                </Box>
              </Grid>
            </Grid>

            {/* Additional Fields */}
            <Box
              sx={{
                pt: 2,
                height: "70px",
                width: "100%",
                position: "sticky",
                top: 0,
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
                    Additional Fields:{" "}
                  </span>
                  Start adding custom fields for your quotes by going to
                  <span
                    style={{ fontWeight: "700", fontSize: "0.875rem" }}
                  ></span>{" "}
                  Settings{" "}
                  <span style={{ fontWeight: "700", fontSize: "0.875rem" }}>
                    ➔
                  </span>{" "}
                  Sales{" "}
                  <span style={{ fontWeight: "700", fontSize: "0.875rem" }}>
                    ➔
                  </span>{" "}
                  Quotes.
                </Typography>
              </Grid>
            </Box>
          </Box>
        </form>
        {/* Action Buttons */}
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
            display: "flex",
            borderTop: "1px solid #ddd",
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <Button
                variant="contained"
                sx={{
                  // ...commonButtonStyle,
                  marginRight: "8px",
                  // color: "white",
                  // boxShadow: "none",
                  // backgroundColor: "#408dfb",
                  // bgcolor: "#408dfb",
                  // "&:hover": {
                  //   bgcolor: "#408dfb",
                  //   boxShadow: "none",
                  // },
                }}
                onClick={handleSave}
                type="button"
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{
                  // ...commonButtonStyle,
                  marginRight: "8px",
                  // color: "black",
                  // boxShadow: "none",
                }}
                onClick={handleSaveAndSend}
                type="button"
              >
                Save and Send
              </Button>
              <Button
                variant="outlined"
                sx={{
                  // ...commonButtonStyle,
                }}
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
                <Button
                  variant="text"
                  sx={{
                    ...formLabelBlackStyle,
                    color: "rgb(29, 127, 207)",
                    textTransform: "none",
                    ml: -4,
                  }}
                >
                  Change
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default QuoteEditPage;
