"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
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
  Alert,
  TextareaAutosize,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import apiService from "../../../../../services/axiosService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import config from "../../../../../services/config";
import { useSnackbar } from "../../../../../components/SnackbarProvider";
import VendorSelector from "../../vendorField/VendorSelector";
import CustomerSelector from "../../customerField/CustomerSelector";
import Invoice from "../../../../items/Items";

const PurchaseOrderSchema = Yup.object().shape({
  vendor_id: Yup.string().required("Vendor is required"),
  purchase_number: Yup.string().required("PO Number is required"),
  date: Yup.date().required("Date is required"),
  deliveryDate: Yup.date(),
  paymentTerm: Yup.string(),
  shipmentPreference: Yup.string(),
  termsAndConditions: Yup.string(),
  organizationName: Yup.string().when("addressType", {
    is: "Organization",
    then: () => Yup.string(),
  }),
});

const EditPurchaseOrderForm = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const formikRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);
  const [organizationData, setOrganizationData] = useState(null);
  const [organization_id, setOrganizationId] = useState(null);
  const [addressType, setAddressType] = useState("Organization");
  const [additionalAddresses, setAdditionalAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [PurchaseID, setPurchaseID] = useState("");
  const [editingOrgName, setEditingOrgName] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [newAddress, setNewAddress] = useState({
    addressName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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

  useEffect(() => {
    // Get purchase order ID from URL
    let po_id = pathname.split("/")[4];
    let org_id = localStorage.getItem("organization_id");
    setPurchaseID(po_id);
    setOrganizationId(org_id);
    fetchData(org_id, po_id);
    fetchOrganizationData();
  }, [pathname]);

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
  };

  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
  };

  const fetchData = async (ORG_ID, PO_ID) => {
    try {
      const poResponse = await apiService({
        method: "GET",
        url: `api/v1/purchase-orders/get-individual-purchase-order?org_id=${ORG_ID}&po_id=${PO_ID}`,
        customBaseUrl: config.PO_Base_url,
      });

      const poData = transformPurchaseOrderData(poResponse.data.data);
      setInitialValues(poData);
      setAddressType(poData.addressType || "Organization");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      showMessage("Error loading purchase order data", "error");
    }
  };

  const transformPurchaseOrderData = (apiData) => ({
    vendor_id: apiData.vendor_id,
    vendorName: apiData.vendor_id?.contact_name,
    purchase_number: apiData.purchase_number,
    referenceNumber: apiData.reference_number,
    date: apiData.date?.split("T")[0] || new Date().toISOString().split("T")[0],
    deliveryDate: apiData.due_date?.split("T")[0] || "",
    paymentTerm: apiData.payment_terms || "Due On Receipt",
    shipmentPreference: apiData.shipment_preference || "",
    termsAndConditions: apiData.terms_and_conditions || "",
    organizationName: apiData.organization_name || "",
    addressType: apiData.address_type || "Organization",
    customer_id: apiData.customer_id || "",
    organizationUserRole: apiData.organization_user_role || "",
    organizationPlanName: apiData.organization_plan_name || "",
    items: apiData.items?.map((item) => ({
      item_id: item.item_id || Date.now(),
      details: item.details || "",
      quantity: item.quantity || 1,
      rate: item.rate || 0,
      tax: item.tax || "",
      amount: item.amount || 0,
      sku: item.sku || "",
      itemName: item.item_name || "",
    })) || [
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
    subtotal: apiData.subtotal || 0,
    discount: apiData.discount || 0,
    tdsOrTcs: apiData.tds_tcs || "TDS",
    commission: apiData.commission || 2,
    taxCategory: apiData.tax_category || "Commission or Brokerage",
    taxAmount: apiData.tax_amount || 0,
    adjustment: apiData.adjustment || 0,
    total: apiData.total || 0,
    notes: apiData.notes || "Looking forward for your business.",
    status: apiData.status || 0,
  });

  // Fetch organization data from backend
  const fetchOrganizationData = async () => {
    try {
      const params = {
        url: "api/v1/org/get-organisation",
        method: "POST",
        data: { page: 1 },
      };
      const response = await apiService(params);

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const orgData = response.data.data[0];
        console.log("Organization API Response:", orgData);

        // Store the organization data
        setOrganizationData(orgData);
        setOrganizationId(orgData.id || orgData._id);

        // If formik is available, update the values
        if (formikRef.current && addressType === "Organization") {
          const currentValues = formikRef.current.values;

          // Construct a clean object with all required fields
          const organizationFields = {
            organizationName: orgData.org_name || "",
            organizationCity: orgData.city || "",
            organizationCountry: orgData.country || "",
            organizationFirst_street: orgData.first_street || "",
            organizationGst_in: orgData.gst_in || "",
            organizationOrg_name: orgData.org_name || "",
            organizationPhone: orgData.phone || "",
            organizationState: orgData.state || "",
            organizationUserRole: orgData.user_role || "",
            organizationPlanName: orgData.plan_name || "",
            organizationZipCode: orgData.zipCode || orgData.zip_code || "",
          };

          console.log("Setting organization fields:", organizationFields);

          // Update the formik values
          formikRef.current.setValues({
            ...currentValues,
            ...organizationFields,
          });
        }
      } else {
        console.error("No organization data found");
        showMessage(
          "No organization data found. Please create an organization first.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
      showMessage(
        "Error fetching organization data. Please try again.",
        "error"
      );
    }
  };

  // Update organization data in formik when it's loaded
  useEffect(() => {
    if (organizationData && formikRef.current) {
      console.log("Organization Data:", organizationData);

      // Only update organization-related fields without touching other values
      const currentValues = formikRef.current.values;
      if (addressType === "Organization") {
        // Log what's being set in formik values
        console.log("Setting organization values in formik:", {
          organizationName: organizationData.org_name || "",
          organizationCity: organizationData.city || "",
          organizationState: organizationData.state || "",
          organizationFirst_street: organizationData.first_street || "",
          organizationPhone: organizationData.phone || "",
        });

        formikRef.current.setValues({
          ...currentValues,
          organizationName: organizationData.org_name || "",
          organizationCity: organizationData.city || "",
          organizationCountry: organizationData.country || "",
          organizationFirst_street: organizationData.first_street || "",
          organizationGst_in: organizationData.gst_in || "",
          organizationOrg_name: organizationData.org_name || "",
          organizationPhone: organizationData.phone || "",
          organizationState: organizationData.state || "",
          organizationUserRole: organizationData.user_role || "",
          organizationPlanName: organizationData.plan_name || "",
          organizationZipCode:
            organizationData.zipCode || organizationData.zip_code || "",
        });
      }
    }
  }, [organizationData, addressType]);

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
      const org_id = localStorage.getItem("organization_id");

      // Prepare data for API submission
      const purchaseOrderData = {
        vendor_id: values.vendor_id,
        purchase_number: values.purchase_number,
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

      // Create FormData to support file upload
      const formData = new FormData();

      // Append all PO data fields
      Object.keys(purchaseOrderData).forEach((key) => {
        if (
          purchaseOrderData[key] !== undefined &&
          purchaseOrderData[key] !== null
        ) {
          if (
            typeof purchaseOrderData[key] === "object" &&
            !Array.isArray(purchaseOrderData[key])
          ) {
            // For nested objects like delivery_address
            formData.append(key, JSON.stringify(purchaseOrderData[key]));
          } else if (Array.isArray(purchaseOrderData[key])) {
            // For arrays like items
            formData.append(key, JSON.stringify(purchaseOrderData[key]));
          } else {
            // Regular fields
            formData.append(key, purchaseOrderData[key]);
          }
        }
      });

      // Append file if exists
      if (files.length > 0) {
        formData.append("documents", files[0]); // assuming only one file allowed
      }

      await apiService({
        method: "PUT",
        url: `api/v1/purchase-orders/update-individual-purchase-order?org_id=${org_id}&po_id=${PurchaseID}`,
        customBaseUrl: config.PO_Base_url,
        data: purchaseOrderData,
        file: true,
      });

      showMessage("Purchase order updated successfully!", "success");
      router.push(`/purchase/purchaseorder/${PurchaseID}`);
    } catch (error) {
      console.error("Update error:", error);
      showMessage(
        error.response?.data?.message || "Failed to update purchase order",
        "error"
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Style constants
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

  const commonTextareaStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "7px",
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

  // Event handlers
  const handleCustomerClickAway = () => {
    setCustomerDropdownOpen(false);
  };

  const handleAddressTypeChange = async (event, formik) => {
    const newAddressType = event.target.value;
    setAddressType(newAddressType);
    formik.setFieldValue("addressType", newAddressType);

    if (newAddressType === "Organization") {
      if (!organizationData) {
        await fetchOrganizationData();
      } else {
        console.log("Updating organization fields in formik", organizationData);
        // Update organization fields in formik
        formik.setValues({
          ...formik.values,
          organizationName: organizationData.org_name || "",
          organizationCity: organizationData.city || "",
          organizationCountry: organizationData.country || "",
          organizationFirst_street: organizationData.first_street || "",
          organizationGst_in: organizationData.gst_in || "",
          organizationOrg_name: organizationData.org_name || "",
          organizationPhone: organizationData.phone || "",
          organizationState: organizationData.state || "",
          organizationUserRole: organizationData.user_role || "",
          organizationPlanName: organizationData.plan_name || "",
          organizationZipCode:
            organizationData.zipCode || organizationData.zip_code || "",
        });
      }
    }
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

  if (loading || !initialValues) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading purchase order data...</Typography>
      </Box>
    );
  }

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

      <Formik
        initialValues={initialValues}
        innerRef={formikRef}
        validationSchema={PurchaseOrderSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => {
          // Store current form values for debugging
          useEffect(() => {
            console.log("Current formik values:", formik.values);
            setFormValues(formik.values);
          }, [formik.values]);

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
                    }}
                  >
                    <Box component="span" sx={{ mr: 2, mt: "5px" }}>
                      <ShoppingBagOutlinedIcon />
                    </Box>
                    Edit Purchase Order
                  </Typography>
                  <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => router.push("/purchase/purchaseorder")}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor: "#f9f9fb",
                    px: 3,
                    py: 4,
                  }}
                >
                  <VendorSelector
                    formik={formik}
                    initialValue={initialValues.vendor_id}
                  />
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
                            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={
                                      formik.values.organizationName ||
                                      organizationData?.org_name ||
                                      ""
                                    }
                                    disabled
                                    sx={{ width: "350px" }}
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
                            <Box sx={{ mt: 2, ml: 1 }}>
                              {/* Street address */}
                              {formik.values.organizationFirst_street && (
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mb: 0.5,
                                  }}
                                >
                                  {formik.values.organizationFirst_street}
                                </Typography>
                              )}

                              {/* City, State */}
                              {(formik.values.organizationCity ||
                                formik.values.organizationState) && (
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mb: 0.5,
                                  }}
                                >
                                  {[
                                    formik.values.organizationCity,
                                    formik.values.organizationState,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </Typography>
                              )}

                              {/* Country */}
                              {formik.values.organizationCountry && (
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mb: 0.5,
                                  }}
                                >
                                  {formik.values.organizationCountry}
                                </Typography>
                              )}

                              {/* Phone */}
                              {formik.values.organizationPhone && (
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mb: 0.5,
                                  }}
                                >
                                  Phone: {formik.values.organizationPhone}
                                </Typography>
                              )}

                              {/* GST Information if available */}
                              {formik.values.organizationGst_in && (
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#666",
                                    mb: 0.5,
                                  }}
                                >
                                  GST: {formik.values.organizationGst_in}
                                </Typography>
                              )}
                            </Box>

                            {/* Change destination button */}
                            <Typography
                              onClick={handleOpenAddressDialog}
                              sx={{
                                fontSize: "14px",
                                color: "#3f82f7",
                                mt: 2,
                                cursor: "pointer",
                              }}
                            >
                              Change destination to deliver
                            </Typography>

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
                            <Box sx={{ position: "relative", width: "350px" }}>
                              <CustomerSelector
                                formik={formik}
                                initialValue={initialValues.customer_id}
                              />
                            </Box>
                          </ClickAwayListener>
                        )}
                      </Box>
                    </Box>

                    {/* Purchase Order Number */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        sx={{
                          width: "140px",
                          fontSize: "13px",
                          color: "#666666",
                        }}
                      >
                        Purchase Order#
                      </Typography>

                      <TextField
                        fullWidth
                        size="small"
                        value={formik.values.purchase_number}
                        disabled
                        onChange={(e) =>
                          formik.setFieldValue(
                            "purchase_number",
                            e.target.value
                          )
                        }
                        onBlur={formik.handleBlur}
                        sx={{
                          width: "400px",
                          "& .MuiOutlinedInput-root": {
                            fontSize: "13px",
                            borderRadius: "4px",
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
                          formik.touched.purchase_number &&
                          Boolean(formik.errors.purchase_number)
                        }
                        helperText={
                          formik.touched.purchase_number &&
                          formik.errors.purchase_number
                        }
                      />
                    </Box>

                    {/* Reference Number */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                            sx={{
                              width: "400px",
                              "& .MuiOutlinedInput-root": {
                                fontSize: "13px",
                                borderRadius: "4px",
                              },
                            }}
                            error={
                              formik.touched.date && Boolean(formik.errors.date)
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
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                                      Choose the shipment preference or type to
                                      add
                                    </span>
                                  );
                                }
                                return selected;
                              }}
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
                  <Box fullWidth sx={{ mt: 0, width: "100%" }}>
                    <Invoice
                      formik={formik}
                      initialItems={initialValues.items}
                    />
                  </Box>

                  {/*Bottom Notes and etc*/}

                  {/*Bottom notes New*/}
                  <Box>
                    <Grid
                      container
                      spacing={2}
                      sx={{ alignItems: "center", backgroundColor: "#f9f9fb" }}
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
                      {/* File Attachments */}
                      <Grid item xs={5}>
                        <Box sx={{ width: "100%" }}>
                          <Typography variant="body1" gutterBottom>
                            Attach File(s) to Quote
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              padding: "8px",
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
                                accept=".pdf, .jpeg, .jpg, .png"
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
                      zIndex: "1000000",
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
                      onClick={()=>formik.setFieldValue("status",0)}
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

export default EditPurchaseOrderForm;
