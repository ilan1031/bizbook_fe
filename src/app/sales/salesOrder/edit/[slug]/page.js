"use client";
import React, { useState, useRef, useEffect } from "react";
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
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
  ListSubheader,
  Popover,
  Alert,
  FormHelperText,
  Autocomplete,
  Paper,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Search, Settings, ShoppingCart } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import ItemTable from "../../../itemTable";
import CustomerDropDown from "../../../../common/CustomerDropDown";
import Customize from "../../../../common/customizeautogeneration/page";
import ProjectSelector from "../../../../common/salespersondropdown/ProjectSelector";
import { Modal } from "@mui/material";
import apiService from "../../../../../services/axiosService";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useSnackbar } from "../../../../../components/SnackbarProvider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import config from "../../../../../services/config";

const SalesOrderCreation = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [openAlert, setOpenAlert] = React.useState(false);

  // const [openManageSalesModal, setOpenManageSalesModal] = useState(false); // New state for modal
  const [openDropdown, setOpenDropdown] = useState(false);
  const [anchorElSales, setAnchorElSales] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [salesOrderNumber, setSalesOrderNumber] = useState("");
    const [files, setFiles] = useState([]);
    const [previewFile, setPreviewFile] = useState([]);
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const dropdownRef = useRef(null);
  const anchorRef = useRef(null);
  const params = useParams();
  const uniqueId = params.slug;

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

  useEffect(() => {
    if (uniqueId) {
      getSalesOrder(uniqueId);
    }
  }, [uniqueId]);

  const getSalesOrder = async (uniqueId) => {
    if (!uniqueId) return; // Early exit if uniqueId is missing
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/sales-order/${uniqueId}`,
        customBaseUrl: config.SO_Base_url,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });
      const { data } = response.data;
      setSalesOrderNumber(data.salesorder_number);
      formik.setValues({
        ...formik.values,
        ...data,
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        reference_number: data.reference_number || "",
        salesorder_number: data.salesorder_number,
        billing_address: data.billing_address || {},
        shipping_address: data.shipping_address || {},
        line_items: data.line_items.map((item) => ({
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
        sub_total: data.sub_total || 0,
        sub_total_formatted: data.sub_total_formatted || "₹0.00",
        total_amount: data.total || 0,
        total_amount_formatted: data.total_formatted || "₹0.00",
        adjustment: data.adjustment || 0,
        adjustment_description: data.adjustment_description || "Adjustment",
        terms: data.terms || "",
        notes: data.notes || "",
        salesperson_name: data.salesperson_name || "",
        status: data.status || "",
        status_formatted: data.status_formatted || "",
        gst_treatment: data.gst_treatment || "",
        gst_no: data.gst_no || "",
        place_of_supply: data.place_of_supply || "",
        place_of_supply_formatted: data.place_of_supply_formatted || "",
        payment_terms_label: data.payment_terms_label || "",
        payment_terms: data.payment_terms || "",
        discount_amount_formatted: data.discount_amount_formatted || "",
        discount_amount: data.discount_amount || "",
        tax_type: data.tax_type || "",
        tds_option: data.tds_option || "",
        discount_percent: parseInt(data.discount_percent) || 0,
        tax_total: data.tax_total ?? 0,
        tax_total_formatted: data.tax_total_formatted || "",
        tax_percentage: data.tax_percentage || 0,
        documents: data.documents,
      });
      fetchAndSetCustomerData(data.customer_id);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    }
  };
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
  const fetchAndSetCustomerData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${id}`,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });

      const { data } = response.data;
      setCustomerData(data);
      setSelectedCustomer(data);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      showMessage("Failed to fetch customer data", "error");
    }
  };

  const handleOpenDropdown = (event) => {
    setAnchorElSales(event.currentTarget);
    setOpenDropdown((prev) => !prev); // Toggle dropdown
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
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

  const handleCustomerChange = async (data) => {
    setSelectedCustomer(data);
    await formik.setFieldValue("customer_id", data.contact_id);
    await formik.setFieldValue("gst_treatment", data.gst_treatment || "");
    await formik.setFieldValue("gst_no", data.gst_no || "");
    await formik.setFieldValue("currency_id", data.currency_id || "");
    await formik.setFieldValue("place_of_supply", data.place_of_contact || "");
    await formik.setFieldValue(
      "place_of_supply_formatted",
      data.place_of_contact_formatted || ""
    );
    await formik.setFieldValue("contact_persons", data.contact_persons || []);
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

  const isImage = (filename) => /\.(jpg|jpeg|png)$/i.test(filename);

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      customer_name: "",
      salesorder_number: salesOrderNumber || "",
      date: new Date().toISOString().split("T")[0],
      date_formatted: formatDate(new Date().toISOString().split("T")[0]),
      shipment_date: "",
      shipment_date_formatted: "",
      billing_address: "",
      shipping_address: "",
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
      adjustment: 0,
      adjustment_description:"Adjustment",
      payment_terms: 0,
      payment_terms_label: "Due On Receipt",
      status: "draft",
      status_formatted: "Draft",
      general: [],
      place_of_supply: "",
      place_of_supply_formatted: "",
      gst_treatment: "",
      gst_no: "",
      reference_number: "",
      terms: "",
      notes: "",
      salesperson_name: "",
      tax_percentage: 0,
      documents: null,
    },
    // validationSchema,
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

        // Validate invoice date
        if (!values.date) {
          errors.push("Please select an invoice date");
        }

        // Validate line items and TCS/TDS option
        const hasValidLineItems = values.line_items.some(
          (item) => item.name && item.quantity > 0 && item.rate > 0
        );
        if (!hasValidLineItems) {
          errors.push("Please add at least one item");
        }

        // Validate TCS/TDS option
        if (!values.tax_type) {
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

        // Format dates consistently
        const formattedDate = values.date
          ? dayjs(values.date).format("YYYY-MM-DD")
          : "";
        const formattedDueDate = values.shipment_date
          ? dayjs(values.shipment_date).format("YYYY-MM-DD")
          : "";

        // Prepare data for backend
        const requestData = {
          customer_id: customerData?.contact_id,
          customer_name: customerData?.contact_name,
          salesorder_number: salesOrderNumber,
          reference_number: values.reference_number,
          date: formattedDate,
          date_formatted: values.date_formatted,
          organization_id: organization_id,
          shipment_date: formattedDueDate,
          shipment_date_formatted: values.shipment_date_formatted,
          billing_address: customerData?.billing_address,
          shipping_address: customerData?.shipping_address,
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
          adjustment_description: values.adjustment_description,
          status: values.status,
          discount_percent: values.discount_percent,
          discount_amount_formatted: values.discount_amount_formatted,
          discount_amount: values.discount_amount,
          status_formatted: values.status_formatted,
          place_of_supply: values.place_of_supply,
          place_of_supply_formatted: values.place_of_supply_formatted,
          gst_treatment: values.gst_treatment,
          tds_id: values.tds_id,
          payment_terms: values.payment_terms,
          payment_terms_label: values.payment_terms_label,
          tcs_id: values.tcs_id,
          tax_percentage: values.tax_percentage,
          documents: values.documents,
        };

        let url;
        url = `/api/v1/salesorders?organization_id=${organization_id}&salesorder_id=${uniqueId}`;

        const response = await apiService({
          method: "PUT",
          url: url,
          data: requestData,
          customBaseUrl: config.SO_Base_url,
          file: true,
        });

        showMessage("Sales Order has been created", "success"); 
        router.push(`/sales/salesOrder/${uniqueId}`);
      } catch (error) {
        console.error("Error creating salesOrder:", error);
        showMessage(
          error.response?.data?.message || "Failed to create salesOrder",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle Save as Draft
  const handleSaveAsDraft = () => {
    setOpenAlert(true);
    formik.handleSubmit(); // Trigger form submission
  };

  // Handle Save and Send
  const handleSaveAndSend = () => {
    setOpenAlert(true);
    formik.handleSubmit(); // Trigger form submission
  };

  // Handle due date change
  const handleDueDateChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue("shipment_date", date);
    formik.setFieldValue("shipment_date_formatted", formatDate(date));
  };

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
          backgroundColor: "#f6f6f6",
        }}
      >
        {/* Header */}
        <Grid
          container
          sx={{
            pr: 3,
            height: "70px",
            width: "100%",
            backgroundColor: "white",
            boxShadow: "0px 4px 4px rgba(29, 29, 29, 0.02)",
            px: 3, // Horizontal padding
            py: 1, // Vertical padding
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
              <ShoppingCart style={{ marginRight: "9px" }} />
              Edit Sales Order
            </Typography>
            <IconButton aria-label="Close" onClick={() => router.back()}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Add this after the header section and before the customer name section */}
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

        {/* Customer Name Section */}
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
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      sx: { width: "500px", height: "300px", overflow: "none" },
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
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
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
                              <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                  fontSize: "13px",
                                  color: "#363636",
                                  lineHeight: 1.5,
                                  fontWeight: index === 0 ? 600 : 400,
                                }}
                              >
                                {line}
                              </Typography>
                            ))}
                        </Box>
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
                      {/* <Popover
                id={id}
                open={open}
                anchorEl={anchorElBA}
                onClose={handleCloseBA}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: { width: "390px", overflow: "none" },
                }}
              >
                <BillingAddress
                  onClose={handleCloseBA}
                  open={open}
                  editData={details?.billing_address}
                  address={address}
                  title="Billing Address"
                  contactId={details?.contact_id}
                />
              </Popover> */}
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
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
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
                              <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                  fontSize: "13px",
                                  color: "#363636",
                                  lineHeight: 1.5,
                                  fontWeight: index === 0 ? 600 : 400,
                                }}
                              >
                                {line}
                              </Typography>
                            ))}
                        </Box>
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
                      {/* <Popover
                id={id}
                open={open}
                anchorEl={anchorElBA}
                onClose={handleCloseBA}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: { width: "390px", overflow: "none" },
                }}
              >
                <BillingAddress
                  onClose={handleCloseBA}
                  open={open}
                  editData={details?.billing_address}
                  address={address}
                  title="Billing Address"
                  contactId={details?.contact_id}
                />
              </Popover> */}
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
                    <Typography variant="bottom" color="#4c526c" fontSize={12}>
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
        {customerData !== null && customerData.gst_treatment !== "Overseas" && (
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

        <Box
          sx={{
            pr: 22,
            width: "100%",
            backgroundColor: "white",
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* invoice Number Field */}
          <Grid
            container
            sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
          >
            <Grid item sx={formLabelStyle}>
              <Typography variant="subtitle2" sx={formLabelStyle}>
                Sales Order#*
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <TextField
                fullWidth
                id="salesorder_number"
                name="salesorder_number"
                value={salesOrderNumber}
                onChange={(e) => setSalesOrderNumber(e.target.value)}
                sx={{
                  ...commonInputStyle,
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000", // Makes text black even when disabled
                  },
                }}
                disabled
                InputProps={{
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
                <Customize invoiceeId={salesOrderNumber} />{" "}
                {/* Display Customize component inside the modal */}
              </Box>
            </Modal>
          </Grid>

          {/* ordernumber */}
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

          <Grid
            container
            sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
          >
            <Grid item sx={formLabelStyle}>
              <Typography variant="subtitle2" sx={formLabelStyle}>
                Sales Order Date*
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <TextField
                fullWidth
                id="date"
                name="date"
                type="date"
                value={formik.values.date || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.date && formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                sx={commonInputStyle}
              />
            </Grid>
          </Grid>

          <Grid
            container
            sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
          >
            <Grid item sx={formLabelStyle}>
              <Typography
                variant="subtitle2"
                sx={{
                  ...formLabelBlackStyle,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                Expected Shipment
                <span>Date</span>
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <TextField
                fullWidth
                id="shipment_date"
                name="shipment_date"
                type="date"
                value={formik.values.shipment_date || ""}
                onChange={handleDueDateChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.shipment_date && formik.errors.shipment_date
                )}
                helperText={
                  formik.touched.shipment_date && formik.errors.shipment_date
                }
                sx={commonInputStyle}
              />
            </Grid>
          </Grid>

          {/* Terms - Dropdown with Search */}
          <Grid
            container
            sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
          >
            <Grid item sx={formLabelStyle}>
              <Typography variant="subtitle2" sx={{ ...formLabelBlackStyle }}>
                Payment Terms
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <Select
                id="payment_terms"
                name="payment_terms"
                value={formik.values.payment_terms_label}
                onChange={(e) => {
                  // Store the display value in payment_terms

                  // Set the payment_terms_label as well
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
                  ml: 0.5,
                  borderRadius: "7px",
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
                {/* Sticky Search Box */}
                <ListSubheader
                  sx={{
                    position: "sticky",
                    top: 0,
                    bgcolor: "white",
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Search
                      fontSize="small"
                      style={{
                        marginRight: "2px",
                        color: "gray",
                        py: 2,
                        width: "16px",
                      }}
                    />
                    <TextField
                      fullWidth
                      placeholder="Search..."
                      variant="standard"
                      sx={{ fontSize: "12px" }}
                      InputProps={{ disableUnderline: true, fontSize: "12px" }}
                    />
                  </Box>
                </ListSubheader>

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
                    sx={{ "&:hover": { bgcolor: "#408dfb", color: "white" } }}
                  >
                    {term}
                  </MenuItem>
                ))}

                {/* Sticky Footer */}
                <ListSubheader
                  sx={{
                    position: "sticky",
                    bottom: 0,
                    bgcolor: "white",
                    zIndex: 1,
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", px: 4, py: 1 }}
                  >
                    <IconButton size="small" sx={{ color: "#408dfb" }}>
                      <Settings />
                    </IconButton>

                    <Typography
                      variant="body1"
                      sx={{ ml: 1, color: "#408dfb" }}
                    >
                      Configure Terms
                    </Typography>
                  </Box>
                </ListSubheader>
              </Select>
            </Grid>
          </Grid>

          <SectionDivider sx={{ my: 4 }} />
          <Grid
            container
            sx={{ px: 2, pb: 2, ...formRowStyle, flexWrap: "nowrap" }}
          >
            {/* Delivery Method Label */}
            <Grid item sx={formLabelBlackStyle}>
              <Typography variant="subtitle2" sx={formLabelBlackStyle}>
                Delivery Method
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <Autocomplete
                freeSolo
                options={["Online", "In Person", "Courier", "Express Delivery"]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select a delivery method or type to add"
                    sx={{
                      ...commonInputStyle,
                      width: "320px",
                      "& .MuiOutlinedInput-root": {
                        height: "35px",
                        fontSize: "13px",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#408dfb",
                          borderWidth: "1px",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "7px 14px",
                      },
                    }}
                  />
                )}
                PopperComponent={(props) => (
                  <Popper {...props} style={{ width: "320px" }}>
                    {props.children}
                  </Popper>
                )}
              />
            </Grid>
          </Grid>

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
                  value={selectedSalesperson || ""}
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
                <ProjectSelector closeDropdown={handleCloseDropdown} formik={formik} />
              </Box>
            </Popper>
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
                  style={{ ...commonTextareaInputStyle }}
                />
              </Box>
            </Grid>
          </Grid>
          <SectionDivider sx={{ my: 4 }} />
          {/* Item Table Section */}
          <Box sx={{ py: 4 }}>
            <ItemTable formik={formik} />
          </Box>
          {/* <Grid container sx={{ px: 2, pt: 2 }}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Item Table
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  startIcon={
                    <DocumentScannerOutlinedIcon sx={{ fontSize: "1rem" }} />
                  }
                  variant="text"
                  sx={{ color: "#408dfb", textTransform: "none", mr: 1 }}
                >
                  Scan Item
                </Button>
                <Button
                  startIcon={<AddCircleSharpIcon sx={{ fontSize: "1rem" }} />}
                  variant="text"
                  sx={{ color: "#408dfb", textTransform: "none", mr: 1 }}
                >
                  Bulk Actions
                </Button>
              </Box>
            </Box>
            <Table
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
                mb: 2,
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell
                    sx={{
                      py: 1.5,
                      px: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    ITEM DETAILS
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      py: 1.5,
                      px: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    QUANTITY
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      py: 1.5,
                      px: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    RATE
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      py: 1.5,
                      px: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    AMOUNT
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      py: 1.5,
                      px: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "50px",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quoteItems.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ p: 0, borderBottom: "1px solid #e0e0e0" }}>
                      <TextField
                        fullWidth
                        placeholder="Type or click to select an item."
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            "& fieldset": { border: "none" },
                            "&:hover fieldset": { border: "none" },
                            "&.Mui-focused fieldset": { border: "none" },
                          },
                          input: { padding: "12px 14px", fontSize: "0.875rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ p: 0, borderBottom: "1px solid #e0e0e0" }}
                    >
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center", fontSize: "0.875rem" },
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            "& fieldset": { border: "none" },
                            "&:hover fieldset": { border: "none" },
                            "&.Mui-focused fieldset": { border: "none" },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ p: 0, borderBottom: "1px solid #e0e0e0" }}
                    >
                      <TextField
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleRateChange(item.id, e.target.value)
                        }
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center", fontSize: "0.875rem" },
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            "& fieldset": { border: "none" },
                            "&:hover fieldset": { border: "none" },
                            "&.Mui-focused fieldset": { border: "none" },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 2,
                        borderBottom: "1px solid #e0e0e0",
                        color: "#333",
                        fontSize: "0.875rem",
                      }}
                    >
                      {item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ p: 1, borderBottom: "1px solid #e0e0e0" }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <IconButton size="small" sx={{ color: "#999", p: 0.5 }}>
                          <MoreVerticalIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeRow(item.id)}
                          sx={{ color: "#f44336", p: 0.5 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#f5f5f5",
                  color: "black",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  borderRadius: "4px",
                  boxShadow: "none",
                  px: 2,
                  py: 0.5,
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
                onClick={addNewRow}
              >
                <AddCircleSharpIcon sx={{ mr: 1, color: "#408dfb" }} /> Add New
                Row
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#f5f5f5",
                  color: "black",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  borderRadius: "4px",
                  boxShadow: "none",
                  px: 2,
                  py: 0.5,
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Add Items in Bulk
              </Button>
            </Box>
          </Grid>
        </Grid> */}
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
                component="label"
                startIcon={<FontAwesomeIcon icon={faUpload} />}
                sx={{
                  alignSelf: "flex-start",
                  // borderColor: "#cbd5e1",
                  // color: "#475569",
                  // bgcolor: "#fff",
                  textTransform: "none",
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
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
                {previewFile &&  (
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
                  <IconButton size="small" onClick={removeFile} sx={{ ml: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
            {typeof formik.values.documents === "string" && isImage(formik.values.documents) &&
            <Box sx={{ mb: 1 }}>
                    <img
                      src={`${config.SO_Base_url}/uploads/salesOrder/${formik.values.documents}`}
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

          {/* Custom Fields Section */}
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
                Start adding custom fields for your invoice by going to
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
                Invoice.
              </Typography>
            </Grid>
          </Box>
        </Box>
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
          }}
        >
          <Grid container alignItems="center">
            <Grid item xs={9}>
              <Button
                variant="outlined"
                sx={{
                  // ...commonButtonStyle,
                  marginRight: "8px",
                }}
                onClick={handleSaveAsDraft}
                type="button"
                disabled={formik.isSubmitting}
              >
                Save
              </Button>
              <Button
                variant="contained"
                sx={{
                  // ...commonButtonStyle,
                  marginRight: "8px",
                  // color: "white",
                  // bgcolor: "#408dfb",
                  // boxShadow: "none",
                  // "&:hover": {
                  //   bgcolor: "#408dfb",
                  //   boxShadow: "none",
                  // },
                }}
                onClick={handleSaveAndSend}
                type="button"
                disabled={formik.isSubmitting}
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
              <Typography
                sx={{ fontSize: "12px", fontWeight: "600" }}
                variant="body1"
              >
                Total amount : {formik.values.total_amount_formatted}
              </Typography>
              <Typography
                sx={{ fontSize: "11px", color: "#6c718a" }}
                variant="bottom"
              >
                Total Quantity:{" "}
                {formik.values.line_items.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                )}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default SalesOrderCreation;
