"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Snackbar,
  TextareaAutosize,
  Button,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import VendorForm from "../../vendor/createvendor/page";
import Invoice from "../../../items/Items";
import VendorSelector from "../vendorField/VendorSelector";
import CustomerSelector from "../customerField/CustomerSelector";
import apiService from "../../../../services/axiosService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import config from "../../../../services/config";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { useRouter } from "next/navigation";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Link from "next/link";
import { KeyboardArrowDown } from "@mui/icons-material";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// Validation schema
const PurchaseOrderSchema = Yup.object().shape({
  vendor_id: Yup.string().required("Vendor is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        quantity: Yup.number().required("Quantity is required"),
        rate: Yup.number().required("Rate is required"),
      })
    )
    .required("Items are required"),
});

const PurchaseOrderForm = () => {
  // State variables
  const { showMessage } = useSnackbar();
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [addressType, setAddressType] = useState("Organization");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [editingOrgName, setEditingOrgName] = useState(false);
  const [formValues, setFormValues] = useState(null); // Reference to current form values
  const formikRef = useRef(null); // Reference to formik instance
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Organization state
  const [organizationData, setOrganizationData] = useState(null);
  const [organization_id, setOrganizationId] = useState(null);
  const [poUniqueId, setPoUniqueId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null); // For file preview
  // Additional address states
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [additionalAddresses, setAdditionalAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [files, setFiles] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [newAddress, setNewAddress] = useState({
    addressName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const paymentTerms = [
    "Due On Receipt",
    "Net 30",
    "Net 45",
    "Net 60",
    "Due on Receipt",
    "Due end of the Month",
    "Due end of the next month",
    "Custom",
  ];
  const shipmentPreferences = [
    "Standard Shipping",
    "Express Shipping",
    "Overnight",
  ];
  const router = useRouter();

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

  // Fetch organization data on component mount
  useEffect(() => {
    fetchOrganizationData();
    getUniqueId();
  }, []);
  // Update organization data in formik when it's loaded
  useEffect(() => {
    if (organizationData && formikRef.current) {
      // Only update organization-related fields without touching other values
      const currentValues = formikRef.current.values;
      if (addressType === "Organization") {
        formikRef.current.setValues({
          ...currentValues,
          organizationName: organizationData.org_name || "",
          organizationUserRole: organizationData.user_role || "",
          organizationPlanName: organizationData.plan_name || "",
          organizationCity: organizationData.city || "",
          organizationCountry: organizationData.country || "",
          organizationFirst_street: organizationData.first_street || "",
          organizationGst_in: organizationData.gst_in || "",
          organizationOrg_name: organizationData.org_name || "",
          organizationPhone: organizationData.phone || "",
          organizationState: organizationData.state || "",
        });
      }
    }
  }, [organizationData, addressType]);
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
    // formik.setFieldValue("documents", selectedFile);
    setFiles([selectedFile]); // Replace any previous files
    console.log(selectedFile, "=======selectedFile==+++");
  };
  // Remove selected file
  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
  };
  // Fetch organization data from backend
  const fetchOrganizationData = async () => {
    setLoading(true);
    try {
      const params = {
        url: "api/v1/org/get-organisation",
        method: "POST",
        data: { page: 1 },
      };

      const response = await apiService(params);

      // Log full response for debugging
      console.log("Full API Response:", response);

      if (
        response?.data?.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const organization = response.data.data[0];

        setOrganizationData(organization);
        setOrganizationId(organization.id || organization._id);

        console.log("Organization data fetched successfully:", organization);
      } else {
        console.warn("No organization data found in the response.");
        showMessage(
          "No organization data found. Please create an organization first.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching organization data:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });

      showMessage(
        error.response?.data?.message ||
          "Error fetching organization data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const getUniqueId = async () => {
    try {
      const params = {
        url: "api/v1/common/get-unique-id",
        method: "POST",
        data: { module: "purchaseOrder" },
        customBaseUrl: config.apiBaseUrl,
      };
      const response = await apiService(params);
      if (response.statusCode == 200) {
        setPoUniqueId(response.data.data);
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
  // Event handlers
  const handleCustomerClickAway = () => {
    setCustomerDropdownOpen(false);
  };
  const handleNewVendor = () => {
    setShowVendorForm(true);
  };
  const handleAddressTypeChange = async (event, formik) => {
    const newAddressType = event.target.value;
    setAddressType(newAddressType);
    formik.setFieldValue("addressType", newAddressType);
    if (newAddressType === "Organization") {
      if (!organizationData) {
        await fetchOrganizationData();
      } else {
        // Update organization fields in formik
        formik.setValues({
          ...formik.values,
          organizationName: organizationData.org_name || "",
          organizationUserRole: organizationData.user_role || "",
          organizationPlanName: organizationData.plan_name || "",
        });
      }
    }
  };
  const handleBackFromVendorForm = () => {
    setShowVendorForm(false);
  };
  // Additional address handlers
  const handleOpenAddressDialog = () => {
    setOpenAddressDialog(true);
  };
  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
    // Reset new address form
    setNewAddress({
      addressName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddAddress = () => {
    const newAddressList = [
      ...additionalAddresses,
      { ...newAddress, id: Date.now() },
    ];
    setAdditionalAddresses(newAddressList);
    setSelectedAddress(newAddress);
    handleCloseAddressDialog();
  };
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };
  const handleStartEditOrgName = () => {
    setEditingOrgName(true);
  };
  const handleStopEditOrgName = () => {
    setEditingOrgName(false);
  };
  const handleUpdateOrgName = (formik, newName) => {
    formik.setFieldValue("organizationName", newName);
    setEditingOrgName(false);
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [isZoho, setIsZoho] = useState(true);

  // Add useEffect to initialize the mode state
  useEffect(() => {
    // Initialize fromTally flag if it doesn't exist
    if (!localStorage.getItem("fromTally")) {
      localStorage.setItem("fromTally", "false");
    }
  }, []);

  const toggleMode = () => {
    console.log("[toggleMode] Current isZoho:", isZoho);
    const newIsZoho = !isZoho;
    console.log("[toggleMode] Switching to:", newIsZoho ? "Zoho" : "Tally");
    setIsZoho(newIsZoho);
    localStorage.setItem("fromTally", (!newIsZoho).toString());

    // Access formik instance via ref
    if (formikRef.current) {
      const formik = formikRef.current;
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
        isStatus: "PurchaseOrder",
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
        // Totals
        sub_total: formik.values.sub_total,
        tax_total: formik.values.tax_total,
        total: formik.values.total,
        adjustment: formik.values.adjustment,
        // Additional info
        notes: formik.values.notes,
        terms: formik.values.terms,
        reference_number: formik.values.reference_number,
        purchase_number: formik.values.purchase_number,
      };
      localStorage.setItem("sharedFormData", JSON.stringify(formData));
    }

    // Navigate to the appropriate page
    if (newIsZoho) {
      router.push("/purchase/purchaseorder/create");
    } else {
      router.push("/tally/voucher?isStatus=PurchaseOrder");
    }
  };
  // Form submission handler with API integration
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!organization_id) {
      showMessage(
        "Organization ID is missing. Please refresh the page and try again.",
        "error"
      );
      setSubmitting(false);
      return;
    }
    try {
      setLoading(true);
      console.log("Form submitted with values:", values);
      console.log(`Form submission timestamp: ${new Date().toISOString()}`);
      // Prepare data for API submission
      const purchaseOrderData = {
        vendor_id: values.vendor_id,
        purchaseOrderNumber: values.purchase_number,
        reference_number: values.referenceNumber || "",
        date: values.date,
        delivery_date: values.deliveryDate || null,
        payment_terms: values.paymentTerm || "Due On Receipt",
        shipment_preference: values.shipmentPreference || "",
        terms_and_conditions: values.termsAndConditions || "",

        // Address information based on selected type
        address_type: values.addressType,
        organization_name:
          values.addressType === "Organization" ? values.organizationName : "",
        customer_id:
          values.addressType === "Customer" ? values.customer_id : "",

        // Additional address if selected
        delivery_address: selectedAddress
          ? {
              name: selectedAddress.addressName,
              street: selectedAddress.street,
              city: selectedAddress.city,
              state: selectedAddress.state,
              zip_code: selectedAddress.zipCode,
              country: selectedAddress.country,
            }
          : null,

        // Items array
        items: values.items.map((item) => ({
          item_id: item.item_id,
          details: item.details || "",
          quantity: item.quantity,
          rate: item.rate,
          tax: item.tax || "",
          amount: item.amount,
          sku: item.sku || "",
          item_name: item.itemName || "",
        })),

        // Financial details
        subtotal: values.subtotal || 0,
        discount: values.discount || 0,
        tds_tcs: values.tdsOrTcs || "TDS",
        commission: values.commission || 0,
        tax_category: values.taxCategory || "",
        tax_amount: values.taxAmount || 0,
        adjustment: values.adjustment || 0,
        total: values.total || 0,
        notes: values.notes || "",
        status: values.status || 0,
        documents: files[0],
      };

      const organization_id = localStorage.getItem("organization_id");
      const params = {
        method: "POST",
        url: `api/v1/purchaseorders/createpurchaseorder?org_id=${organization_id}`,
        customBaseUrl: config.PO_Base_url,
        data: purchaseOrderData,
        file: true,
      };
      const response = await apiService(params);
      showMessage("Purchase Order created successfully!", "success");
      resetForm();
      router.push(
        "/purchase/purchaseorder/" + response.data.data.purchase_number
      );
    } catch (error) {
      console.error("Error creating purchase order:", error);
      let errorMessage = "Failed to create purchase order. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      showMessage(errorMessage, "error");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {showVendorForm ? (
        <Box>
          <VendorForm />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBackFromVendorForm}
              sx={{
                textTransform: "none",
                fontSize: "14px",
                borderRadius: "4px",
                padding: "6px 16px",
              }}
            >
              Back to Purchase Order
            </Button>
          </Box>
        </Box>
      ) : (
        <Formik
          initialValues={{
            org_id: `${organization_id}`,
            vendor_id: "",
            vendorName: "",
            purchaseOrderNumber: `${poUniqueId}`,
            reference_number: "",
            date: today,
            deliveryDate: null,
            paymentTerm: "Due On Receipt",
            shipmentPreference: "",
            termsAndConditions: "",
            organizationName: organizationData?.org_name || "",
            organizationUserRole: organizationData?.user_role || "",
            organizationPlanName: organizationData?.plan_name || "",
            organizationCity: organizationData?.city || "",
            organizationCountry: organizationData?.country || "",
            organizationFirst_street: organizationData?.first_street || "",
            organizationGst_in: organizationData?.gst_in || "",
            organizationOrg_name: organizationData?.org_name || "",
            organizationPhone: organizationData?.phone || "",
            organizationState: organizationData?.state || "",
            addressType: "Organization",
            customer_id: "",
            organizationUserRole: organizationData?.user_role || "",
            organizationPlanName: organizationData?.plan_name || "",
            items: [
              {
                item_id: Date.now(),
                details: "",
                quantity: 1.0,
                rate: 0.0,
                tax: "",
                amount: 0.0,
                sku: "",
                itemName: "",
              },
            ],
            subtotal: 0,
            discount: 0,
            tdsOrTcs: "TDS",
            commission: 2,
            taxCategory: "Commission or Brokerage",
            taxAmount: 0,
            adjustment: 0,
            total: 0,
            notes: "Looking forward for your business.",
            status: 0,
            documents: "",
          }}
          innerRef={formikRef}
          validationSchema={PurchaseOrderSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => {
            // Store current form values for debugging
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              setFormValues(formik.values);
            }, []);
            return (
              <Form>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    mb: 6,
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "left",
                      px: 3,
                      py: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "18px",
                        // ,mb:2
                      }}
                    >
                      <Box component="span" sx={{ mr: 2, mt: "5px" }}>
                        <ShoppingBagOutlinedIcon />
                      </Box>
                      New Purchase Order
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
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
                          variant="body1"
                          // lineHeight: "32px",
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
                        onClick={() => router.back()}
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#f9f9fb",
                      px: 3,
                      py: 4,
                    }}
                  >
                    <VendorSelector formik={formik} />

                    {/* Show error only if touched and error exists */}
                    {formik.touched.vendor_id && formik.errors.vendor_id && (
                      <Typography
                        color="error"
                        sx={{ fontSize: "14px", mt: 1, ml: 18 }}
                      >
                        {formik.errors.vendor_id}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ mb: 3, py: 2 }}>
                    {/* Delivery Address */}
                    <Box sx={{ px: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            width: "140px",
                            fontSize: "14px",
                            color: "#666666",
                            mt: 1,
                          }}
                        >
                          Delivery Address
                        </Typography>

                        <Box sx={{ flex: 1 }}>
                          <RadioGroup
                            row
                            value={addressType}
                            onChange={(e) => handleAddressTypeChange(e, formik)}
                            sx={{ mb: 1 }}
                          >
                            <FormControlLabel
                              value="Organization"
                              control={<Radio size="small" color="primary" />}
                              label={
                                <Typography sx={{ fontSize: "14px" }}>
                                  Organization
                                </Typography>
                              }
                            />
                            <FormControlLabel
                              value="Customer"
                              control={<Radio size="small" color="primary" />}
                              label={
                                <Typography sx={{ fontSize: "14px" }}>
                                  Customer
                                </Typography>
                              }
                            />
                          </RadioGroup>

                          {addressType === "Organization" ? (
                            <>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {editingOrgName ? (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    value={formik.values.organizationName}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        "organizationName",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() => handleStopEditOrgName()}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleUpdateOrgName(
                                          formik,
                                          e.target.value
                                        );
                                      }
                                    }}
                                    autoFocus
                                    sx={{ width: "350px" }}
                                  />
                                ) : (
                                  <>
                                    <TextField
                                      // variant="outlined"
                                      fullWidth
                                      size="small"
                                      value={
                                        formik.values.organizationName ||
                                        organizationData?.org_name ||
                                        ""
                                      }
                                      disabled
                                      sx={{
                                        width: "350px",
                                        height: "35px",
                                        border: "none",
                                      }}
                                    />
                                    <IconButton
                                      onClick={handleStartEditOrgName}
                                      sx={{ ml: "10px" }}
                                    >
                                      <EditOutlinedIcon
                                        sx={{ fontSize: "20px", color: "gray" }}
                                      />
                                    </IconButton>
                                  </>
                                )}
                              </Box>
                              {formik.touched.organizationName &&
                                formik.errors.organizationName && (
                                  <Typography
                                    color="error"
                                    sx={{ fontSize: "12px", ml: 1 }}
                                  >
                                    {formik.errors.organizationName}
                                  </Typography>
                                )}

                              {/* Display organization details */}
                              <>
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mt: 1,
                                    m: 1,
                                  }}
                                >
                                  {formik.values.organizationOrg_name}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mt: 1,
                                    m: 1,
                                  }}
                                >
                                  {formik.values.organizationFirst_street}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mt: 1,
                                    m: 1,
                                  }}
                                >
                                  {formik.values.organizationCity} ,{" "}
                                  {formik.values.organizationState}
                                </Typography>

                                <Typography
                                  sx={{ fontSize: "14px", color: "#666", m: 1 }}
                                >
                                  {formik.values.organizationPhone}
                                </Typography>
                              </>

                              {/* Change destination button */}
                              {/* <Typography
                                onClick={handleOpenAddressDialog}
                                sx={{
                                  fontSize: "14px",
                                  color: "#3f82f7",
                                  mt: 2,
                                  cursor: "pointer",
                                }}
                              >
                                Change destination to deliver
                              </Typography> */}

                              {/* Selected additional address */}
                              {selectedAddress && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    p: 2,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                    width: "350px",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {selectedAddress.addressName}
                                  </Typography>
                                  <Typography sx={{ fontSize: "13px" }}>
                                    {selectedAddress.street}
                                  </Typography>
                                  <Typography sx={{ fontSize: "13px" }}>
                                    {selectedAddress.city},{" "}
                                    {selectedAddress.state}{" "}
                                    {selectedAddress.zipCode}
                                  </Typography>
                                  <Typography sx={{ fontSize: "13px" }}>
                                    {selectedAddress.country}
                                  </Typography>
                                </Box>
                              )}

                              {/* List of additional addresses */}
                              {additionalAddresses.length > 0 &&
                                !selectedAddress && (
                                  <Box sx={{ mt: 2, width: "350px" }}>
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        mb: 1,
                                      }}
                                    >
                                      Select Delivery Address:
                                    </Typography>
                                    <List
                                      sx={{
                                        maxHeight: "200px",
                                        overflow: "auto",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {additionalAddresses.map((address) => (
                                        <ListItem
                                          key={address.id}
                                          button
                                          onClick={() =>
                                            handleSelectAddress(address)
                                          }
                                          divider
                                        >
                                          <ListItemText
                                            primary={address.addressName}
                                            secondary={`${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`}
                                            primaryTypographyProps={{
                                              fontSize: "14px",
                                              fontWeight: "bold",
                                            }}
                                            secondaryTypographyProps={{
                                              fontSize: "13px",
                                            }}
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>
                                )}
                            </>
                          ) : (
                            <ClickAwayListener
                              onClickAway={handleCustomerClickAway}
                            >
                              <Box
                                sx={{ position: "relative", width: "350px" }}
                              >
                                <CustomerSelector formik={formik} />
                              </Box>
                            </ClickAwayListener>
                          )}
                        </Box>
                      </Box>

                      {/* Purchase Order Number */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Typography
                          sx={{
                            width: "140px",
                            fontSize: "13px",
                            color: "#666666",
                          }}
                        >
                          Purchase Order#
                        </Typography>
                        <Field name="purchase_number">
                          {({ field }) => (
                            <TextField
                              {...field}
                              value={poUniqueId || ""}
                              variant="outlined"
                              size="small"
                              fullWidth
                              disabled
                              sx={{
                                width: "400px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "13px",
                                  borderRadius: "4px",
                                },
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000", // Makes text black even when disabled
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton size="small">
                                      <SettingsIcon fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              error={
                                formik.touched.purchaseOrderNumber &&
                                Boolean(formik.errors.purchaseOrderNumber)
                              }
                              helperText={
                                formik.touched.purchaseOrderNumber &&
                                formik.errors.purchaseOrderNumber
                              }
                            />
                          )}
                        </Field>
                      </Box>

                      {/* Reference Number */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Typography
                          sx={{
                            width: "140px",
                            fontSize: "13px",
                          }}
                        >
                          Reference#
                        </Typography>
                        <Field name="referenceNumber">
                          {({ field }) => (
                            <TextField
                              {...field}
                              placeholder="Enter reference number"
                              variant="outlined"
                              size="small"
                              sx={{
                                width: "400px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "13px",
                                  borderRadius: "4px",
                                },
                              }}
                            />
                          )}
                        </Field>
                      </Box>

                      {/* Date */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Typography
                          sx={{
                            width: "140px",
                            fontSize: "13px",
                          }}
                        >
                          Date
                        </Typography>
                        <Field name="date">
                          {({ field }) => (
                            <TextField
                              {...field}
                              placeholder="dd/MM/yyyy"
                              variant="outlined"
                              size="small"
                              type="date"
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
                              sx={{
                                width: "400px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "13px",
                                  borderRadius: "4px",
                                },
                              }}
                              error={
                                formik.touched.date &&
                                Boolean(formik.errors.date)
                              }
                              helperText={
                                formik.touched.date && formik.errors.date
                              }
                            />
                          )}
                        </Field>
                      </Box>

                      {/* Delivery Date and Payment Terms */}
                      <Box sx={{ display: "flex", mb: 2 }}>
                        <Typography
                          sx={{
                            width: "140px",
                            fontSize: "13px",
                            mt: 1,
                          }}
                        >
                          Delivery Date
                        </Typography>
                        <Field name="deliveryDate">
                          {({ field }) => (
                            <TextField
                              {...field}
                              placeholder="dd/MM/yyyy"
                              variant="outlined"
                              size="small"
                              type="date"
                              value={field.value || ""}
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
                              sx={{
                                width: "400px",
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "13px",
                                  borderRadius: "4px",
                                },
                              }}
                            />
                          )}
                        </Field>
                        <Box
                          sx={{ display: "flex", ml: 4, alignItems: "center" }}
                        >
                          <Typography
                            sx={{
                              width: "140px",
                              fontSize: "13px",
                            }}
                          >
                            Payment Terms
                          </Typography>
                          <Field name="paymentTerm">
                            {({ field }) => (
                              <FormControl sx={{ width: "240px" }} size="small">
                                <Select
                                  {...field}
                                  sx={{
                                    fontSize: "13px",
                                    borderRadius: "4px",
                                  }}
                                  error={
                                    formik.touched.paymentTerm &&
                                    Boolean(formik.errors.paymentTerm)
                                  }
                                  IconComponent={KeyboardArrowDown}
                                >
                                  {paymentTerms.map((term) => (
                                    <MenuItem
                                      key={term}
                                      value={term}
                                      sx={{ fontSize: "13px" }}
                                    >
                                      {term}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {formik.touched.paymentTerm &&
                                  formik.errors.paymentTerm && (
                                    <Typography
                                      color="error"
                                      sx={{ fontSize: "12px", ml: 1 }}
                                    >
                                      {formik.errors.paymentTerm}
                                    </Typography>
                                  )}
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                      </Box>

                      {/* Shipment Preference */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Typography
                          sx={{
                            width: "140px",
                            fontSize: "13px",
                          }}
                        >
                          Shipment Preference
                        </Typography>
                        <Field name="shipmentPreference">
                          {({ field }) => (
                            <FormControl sx={{ width: "400px" }} size="small">
                              <Select
                                {...field}
                                displayEmpty
                                sx={{
                                  fontSize: "13px",
                                  borderRadius: "4px",
                                }}
                                renderValue={(selected) => {
                                  if (!selected) {
                                    return (
                                      <span style={{ color: "#999" }}>
                                        Choose the shipment preference or type
                                        to add
                                      </span>
                                    );
                                  }
                                  return selected;
                                }}
                                IconComponent={KeyboardArrowDown}
                              >
                                {shipmentPreferences.map((pref) => (
                                  <MenuItem
                                    key={pref}
                                    value={pref}
                                    sx={{ fontSize: "13px" }}
                                  >
                                    {pref}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                    </Box>

                    {/* Items Section */}
                    <Box fullWidth sx={{ mt: 0, width: "80%" }}>
                      <Invoice formik={formik} />

                      {formik.touched.items && formik.errors.items && (
                        <Typography
                          color="error"
                          sx={{ fontSize: "12px", mt: 0.5, ml: 2 }}
                        >
                          {formik.errors.items}
                        </Typography>
                      )}
                    </Box>

                    {/*Bottom Notes and etc*/}

                    {/*Bottom notes New*/}
                    <Box>
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          alignItems: "center",
                          backgroundColor: "#f9f9fb",
                        }}
                      >
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
                              name="notes"
                              value={formik.values.notes}
                              onChange={formik.handleChange}
                              id="notes"
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
                          <Box sx={{ width: "40%" }}>
                            <Box>
                              <Typography variant="body1" gutterBottom>
                                Attach File(s) to Quote
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
                                  display: "block",
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
                                      {files[0].name}
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
                      </Grid>
                    </Box>

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
                          <span
                            style={{ fontWeight: "bold", fontSize: "0.875rem" }}
                          >
                            Additional Fields:{" "}
                          </span>
                          Start adding custom fields for your quotes by going to
                          <span
                            style={{ fontWeight: "700", fontSize: "0.875rem" }}
                          ></span>{" "}
                          Settings{" "}
                          <span
                            style={{ fontWeight: "700", fontSize: "0.875rem" }}
                          >
                            ➔
                          </span>{" "}
                          Sales{" "}
                          <span
                            style={{ fontWeight: "700", fontSize: "0.875rem" }}
                          >
                            ➔
                          </span>{" "}
                          Quotes.
                        </Typography>
                      </Grid>
                    </Box>

                    {/* Action Buttons */}

                    <Paper
                      elevation={2}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        position: "fixed",
                        bottom: 0,
                        width: "100%",
                      }}
                    >
                      {/* <Button
                        variant="outlined"
                        type="button"
                      >
                        Save as Draft
                      </Button> */}
                      <Button
                        variant="contained"
                        type="submit"
                        disableElevation
                        color="primary"
                      >
                        Save and Send
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => router.push("/purchase/purchaseorder")}
                      >
                        Cancel
                      </Button>
                    </Paper>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      )}

      {/* Address Dialog */}
      <Dialog
        open={openAddressDialog}
        onClose={handleCloseAddressDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
            Add New Delivery Address
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseAddressDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="addressName"
                label="Address Name"
                placeholder="e.g. Headquarters, Warehouse, etc."
                fullWidth
                value={newAddress.addressName}
                onChange={handleNewAddressChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="street"
                label="Street Address"
                placeholder="Street address, building, etc."
                fullWidth
                value={newAddress.street}
                onChange={handleNewAddressChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="city"
                label="City"
                fullWidth
                value={newAddress.city}
                onChange={handleNewAddressChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="state"
                label="State/Province"
                fullWidth
                value={newAddress.state}
                onChange={handleNewAddressChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="zipCode"
                label="Postal/Zip Code"
                fullWidth
                value={newAddress.zipCode}
                onChange={handleNewAddressChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="country"
                label="Country"
                fullWidth
                value={newAddress.country}
                onChange={handleNewAddressChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseAddressDialog}
            sx={{
              textTransform: "none",
              fontSize: "14px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAddress}
            variant="contained"
            color="primary"
            disabled={
              !newAddress.addressName ||
              !newAddress.street ||
              !newAddress.city ||
              !newAddress.country
            }
            sx={{
              textTransform: "none",
              fontSize: "14px",
            }}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderForm;
