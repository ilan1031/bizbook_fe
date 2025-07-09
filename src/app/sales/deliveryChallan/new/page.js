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
  FormControl,
  TextareaAutosize,
  Popover,
  Select,
  MenuItem,
  Alert,
  Toolbar,
  FormHelperText,
  Modal,
  ListSubheader,
  Autocomplete,
  styled,
  Popper,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import ItemTable from "../../itemTable";
import CustomerDropDown from "../../../common/CustomerDropDown";
import Customize from "../../../common/customizeautogeneration/page";
import EditIcon from "@mui/icons-material/Edit";
import apiService from "../../../../../src/services/axiosService";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import config from "../../../../../src/services/config";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useSnackbar } from "../../../../../src/components/SnackbarProvider";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import TaxPreferencesPopover from "../../../common/gstTreatment/TaxPreferencesPopover";
import GSTIn from "../../../common/gstIN/TaxInformationManager";
import BillingAddress from "../../../common/BillingAddressForm";
import AddressDropdown from "../../../common/ship_bill_address/AddressManagement";
import { Search } from "lucide-react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const DeliveryChallanCreationPage = () => {
  const [challanItems, setChallanItems] = useState([
    { id: 1, quantity: 1.0, rate: 0.0, amount: 0.0 },
  ]);
  const [deliveryChallanNumber, setDeliveryChallanNumber] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [taxType, setTaxType] = useState("tds");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElProject, setAnchorElProject] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [anchorElSales, setAnchorElSales] = useState(null);
  const [itemMenuAnchorEl, setItemMenuAnchorEl] = useState(null);
  const itemMenuOpen = Boolean(itemMenuAnchorEl);
  const [customerData, setCustomerData] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [deliveryChallanId, setDeliveryChallanId] = useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [address,setAddress] = useState("");
  const [addressData, setAddressData] = useState(null);
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const organizationId = localStorage.getItem("organization_id");
  const clone_id = searchParams.get("clone_id");
  const contact_id = searchParams.get("contact_id");
  const [anchorElEdit, setAnchorElEdit] = React.useState(null);
  const [anchorElGSTIN, setAnchorElGSTIN] = React.useState(null);
  const [openGSTIN, setOpenGSTIN] = useState(false);
  const [anchorElBilling, setAnchorElBilling] = useState(null); // For Billing Address Popover
  const [anchorElShipping, setAnchorElShipping] = useState(null); // For Shipping Address Popover
  const [status, setStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRefNo, setShowRefNo] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState([]);
  //SHIPPING AND BILLING
  const handleClickBA = (event, value) => {
    if (value === "edit") {
      setAddress("edit");
      setAddressType("billing");
      setAddressData(customerData?.billing_address);
      setAnchorElBilling(event.currentTarget); // Open Billing Address Popover
    } else if (value === "add") {
      setAddress("add");
      setAddressType("billing");
      setAddressData(null); // Clear existing data for new address
      setAddressModalOpen(true); // Open Modal for New Address
    }
  };

  const handleClickSA = (event, value) => {
    if (value === "edit") {
      setAddress("edit");
      setAddressType("shipping");
      setAddressData(customerData?.shipping_address);
      setAnchorElShipping(event.currentTarget); // Open Shipping Address Popover
    } else if (value === "add") {
      setAddress("add");
      setAddressType("shipping");
      setAddressData(null); // Clear existing data for new address
      setAddressModalOpen(true); // Open Modal for New Address
    }
  };

  //GST TREATMENT
  const handleEditClick = (event) => {
    setAnchorElEdit(event.currentTarget);
  };

  const handleCloseEdit = () => {
    setAnchorElEdit(null);
  };

  const handleUpdateEdit = (updatedData) => {
    // Update customerData with new GST Treatment and GSTIN if provided
    setCustomerData((prev) => ({
      ...prev,
      ...(updatedData.gst_treatment && { gst_treatment: updatedData.gst_treatment }),
      ...(updatedData.gst_no && { gst_no: updatedData.gst_no }),
    }));
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
    // Update customerData with new GSTIN
    setCustomerData((prev) => ({
      ...prev,
      ...(updatedData.gst_no && { gst_no: updatedData.gst_no }),
    }));
    handleCloseGSTIN();
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (clone_id) {
      // First fetch the new delivery challan ID
      fetchDeliveryChallanId().then(() => {
        // Then fetch the data to clone
        fetchData();
      });
    } else {
      fetchDeliveryChallanId();
    }
  }, []);

  const fetchDeliveryChallanId = async () => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/deliveryunique-id`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });

      if (response.data.status) {
        const { data } = response.data;
        setDeliveryChallanNumber(data);
        setDeliveryChallanId(data);
      } else {
        showMessage(
          response.data.message || "Failed to fetch challan ID",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching delivery challan ID:", error);
      showMessage(
        error.response?.data?.message || "Failed to fetch delivery challan ID",
        "error"
      );
    }
  };

  const fetchData = async () => {
  try {
    // Clone mode - fetch delivery challan to clone
    const response = await apiService({
      method: "GET",
      url: `/api/v1/delivery-challans/${clone_id}`,
      params: {
        organization_id: organizationId,
      },
      customBaseUrl: config.SO_Base_url,
    });

    // Check if response and data exist
    if (!response?.data?.data) {
      showMessage("Failed to fetch delivery challan details", "error");
      return;
    }

    const challanData = response.data.data;

    // Set line items state with proper data mapping first
    if (challanData.line_items && challanData.line_items.length > 0) {
      const mappedLineItems = challanData.line_items.map((item, index) => ({
        id: index + 1,
        item_id: item.item_id || "",
        name: item.name || "",
        description: item.description || "",
        quantity: parseFloat(item.quantity) || 1,
        rate: parseFloat(item.rate) || 0,
        amount: parseFloat(item.item_total) || 0,
        discount: parseFloat(item.discount) || 0,
        tax_percentage: parseFloat(item.tax_percentage) || 0,
        unit: item.unit || "",
        item_total: parseFloat(item.item_total) || 0,
      }));
      setChallanItems(mappedLineItems);
    } else {
      // Set default empty item if no items exist
      setChallanItems([
        {
          id: 1,
          item_id: "",
          name: "",
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
          discount: 0,
          tax_percentage: 0,
          unit: "",
          item_total: 0,
        },
      ]);
    }
    
    if (challanData?.reference_number) {
      setShowRefNo(true);
    }
    
    // Set form data with cloned values
    formik.setValues({
      customer_id: challanData.customer_id || "",
      customer_name: challanData.customer_name || "",
      reference_number: challanData.reference_number || "",
      date: challanData.date || "",
      date_formatted: challanData.date_formatted || "",
      expiry_date: challanData.expiry_date || "",
      expiry_date_formatted: challanData.expiry_date_formatted || "",
      billing_address: challanData.billing_address || "",
      shipping_address: challanData.shipping_address || "",
      line_items: challanData.line_items?.map((item) => ({
        item_id: item.item_id || "",
        name: item.name || "",
        description: item.description || "",
        quantity: parseFloat(item.quantity) || 1,
        rate: parseFloat(item.rate) || 0,
        discount: parseFloat(item.discount) || 0,
        tax_percentage: parseFloat(item.tax_percentage) || 0,
        unit: item.unit || "",
        amount: parseFloat(item.item_total) || 0,
        item_total: parseFloat(item.item_total) || 0,
      })) || [
        {
          item_id: "",
          name: "",
          description: "",
          quantity: 1,
          rate: 0,
          discount: 0,
          tax_percentage: 0,
          unit: "",
          amount: 0,
          item_total: 0,
        },
      ],
      tax_type: challanData.tax_type || "TDS",
      tax_percentage: parseFloat(challanData.tax_percentage) || 0,
      discount_percent: parseFloat(challanData.discount_percent) || 0,
      discount_amount_formatted: challanData.discount_amount_formatted || "",
      discount_amount: challanData.discount_amount || "",
      tds_option: challanData.tds_option || "",
      tds_id: challanData.tds_id || "",
      tcs_id: challanData.tcs_id || "",
      sub_total: parseFloat(challanData.sub_total) || 0,
      sub_total_formatted: challanData.sub_total_formatted || "₹0.00",
      tax_total: parseFloat(challanData.tax_total) || 0,
      tax_total_formatted: challanData.tax_total_formatted || "₹0.00",
      total: parseFloat(challanData.total) || 0,
      total_formatted: challanData.total_formatted || "₹0.00",
      adjustment: parseFloat(challanData.adjustment) || 0,
      adjustment_description:
        challanData.adjustment_description || "Adjustment",
      status: "draft",
      place_of_supply: challanData.place_of_supply || "",
      place_of_supply_formatted: challanData.place_of_supply_formatted || "",
      gst_treatment: challanData.gst_treatment || "",
      challan_type: challanData.challan_type || 0,
      challan_type_formatted:
        challanData.challan_type_formatted || "Due On Receipt",
      gst_no: challanData.gst_no || "",
      terms: challanData.terms || "",
      notes: challanData.notes || "",
      status_formatted: "Draft",
      general: [],
    });

    // Handle customer data WITHOUT creating infinite loop
    if (challanData.customer_id) {
      try {
        const customerResponse = await apiService({
          method: "GET",
          url: `/api/v1/contact/${challanData.customer_id}`,
          params: { organization_id: organization_id },
          file: false,
        });
        const customerData = customerResponse.data.data;
        
        // Set customer data directly without calling other functions
        setCustomerData(customerData);
        setSelectedCustomer({
          contact_id: customerData.contact_id,
          contact_name: customerData.contact_name,
          gst_treatment: customerData.gst_treatment,
          place_of_contact: customerData.place_of_contact,
          place_of_contact_formatted: customerData.place_of_contact_formatted,
        });
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
        showMessage("Failed to fetch customer data", "error");
      }
    }

  } catch (error) {
    console.error("Error fetching delivery challan data:", error);
    if (error.response && error.response.status === 404) {
      showMessage("Delivery challan not found", "error");
    } else if (error.response && error.response.status === 500) {
      showMessage(
        "Server error occurred while fetching delivery challan",
        "error"
      );
    } else {
      showMessage("Failed to fetch delivery challan data", "error");
    }
  }
};

  // const contactId = searchParams.get("contact_id");
  // useEffect(() => {
  //   if (contact_id) {
  //     fetchCustomerData(contact_id);
  //   }
  // }, [contactId]);

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

  const open = Boolean(anchorEl);

  const COLORS = {
    primary: "#408dfb",
    secondary: "#86b7fe",
    error: "#d32f2f",
    textPrimary: "#212121",
    textSecondary: "#666666",
  };

  const commonInteractionStyles = {
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        border: ".1px solid #408dfb",
        boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
      },
    },
  };

  const commonInputStyle = {
    height: "35px",
    backgroundColor: "#fff",
    "& .MuiInputBase-input": {
      fontSize: "0.875rem",
      padding: "6px 12px",
    },
    "& .MuiOutlinedInput-root": {
      height: "35px",
      borderRadius: "4px",
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
    fontSize: "13px",
    minWidth: "120px",
    whiteSpace: "nowrap",
    color: "error.main",
  };

  const formLabelBlackStyle = {
    ...formLabelStyle,
    color: "text.primary",
  };

  const commonButtonStyle = {
    ...formLabelBlackStyle,
    fontFamily: "inherit",
    textTransform: "none",
    padding: "6px 10px",
    lineHeight: 1.5,
    borderRadius: "7px",
    bgcolor: "rgba(71, 71, 71, 0.07)",
    borderColor: "rgba(78, 78, 78, 0.15)",
    "&:hover": {
      bgcolor: "rgba(71, 71, 71, 0.1)",
      borderColor: "rgba(24, 13, 13, 0.2)",
    },
    minWidth: "auto",
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

  const commonIconStyle = {
    fontSize: "1.2rem",
    color: "text.secondary",
  };

  const formControlStyle = {
    combinedWithButton: {
      width: "calc(100% - 40px)",
      height: "35px",
      backgroundColor: "#fff",
      "& .MuiOutlinedInput-root": {
        ...commonInputStyle["& .MuiOutlinedInput-root"],
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
  console.log(data, "data");
  setSelectedCustomer(data);
  await formik.setFieldValue("customer_id", data.contact_id);
  await formik.setFieldValue("gst_treatment", data.gst_treatment || "");
  await formik.setFieldValue("place_of_supply", data.place_of_contact || "");
  await formik.setFieldValue(
    "place_of_supply_formatted",
    data.place_of_contact_formatted || ""
  );
  
  // Only fetch customer data if we don't already have it
  if (!customerData || customerData.contact_id !== data.contact_id) {
    // Create a separate function to avoid circular calls
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${data.contact_id}`,
        params: { organization_id: organization_id },
        file: false,
      });
      const { data: customerResponse } = response.data;
      setCustomerData(customerResponse);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      showMessage("Failed to fetch customer data", "error");
    }
  }
  
  handleClose();
  formik.validateForm();
};


  const fetchCustomerData = async (uniqueId) => {
  if (!uniqueId) return;
  try {
    const response = await apiService({
      method: "GET",
      url: `/api/v1/contact/${uniqueId}`,
      params: { organization_id: organization_id },
      file: false,
    });
    const { data } = response.data;

    setCustomerData(data);
    
    // Set form values directly instead of calling handleCustomerChange
    await formik.setFieldValue("customer_id", data.contact_id);
    await formik.setFieldValue("gst_treatment", data.gst_treatment || "");
    await formik.setFieldValue("place_of_supply", data.place_of_contact || "");
    await formik.setFieldValue(
      "place_of_supply_formatted",
      data.place_of_contact_formatted || ""
    );
    
    // Set selected customer if it's not already set with the same ID
    if (!selectedCustomer || selectedCustomer.contact_id !== data.contact_id) {
      setSelectedCustomer({
        contact_id: data.contact_id,
        contact_name: data.contact_name,
        gst_treatment: data.gst_treatment,
        place_of_contact: data.place_of_contact,
        place_of_contact_formatted: data.place_of_contact_formatted,
      });
    }
    
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    showMessage("Failed to fetch customer data", "error");
  }
};

  const fetchCustomerDataOnly = async (uniqueId) => {
  if (!uniqueId) return null;
  try {
    const response = await apiService({
      method: "GET",
      url: `/api/v1/contact/${uniqueId}`,
      params: { organization_id: organization_id },
      file: false,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    showMessage("Failed to fetch customer data", "error");
    return null;
  }
};

const updateCustomerData = async (data) => {
  setCustomerData(data);
  setSelectedCustomer({
    contact_id: data.contact_id,
    contact_name: data.contact_name,
    gst_treatment: data.gst_treatment,
    place_of_contact: data.place_of_contact,
    place_of_contact_formatted: data.place_of_contact_formatted,
  });
  
  await formik.setFieldValue("customer_id", data.contact_id);
  await formik.setFieldValue("gst_treatment", data.gst_treatment || "");
  await formik.setFieldValue("place_of_supply", data.place_of_contact || "");
  await formik.setFieldValue(
    "place_of_supply_formatted",
    data.place_of_contact_formatted || ""
  );
};
const handleCustomerChangeFixed = async (data) => {
  console.log(data, "data");
  
  // If we already have this customer data, just update the form
  if (customerData && customerData.contact_id === data.contact_id) {
    await updateCustomerData(customerData);
  } else {
    // Fetch fresh data only if needed
    const freshCustomerData = await fetchCustomerDataOnly(data.contact_id);
    if (freshCustomerData) {
      await updateCustomerData(freshCustomerData);
    }
  }
  
  handleClose();
  formik.validateForm();
};

// Fixed fetchData function for clone mode
const fetchDataFixed = async () => {
  try {
    // Clone mode - fetch delivery challan to clone
    const response = await apiService({
      method: "GET",
      url: `/api/v1/delivery-challans/${clone_id}`,
      params: {
        organization_id: organizationId,
      },
      customBaseUrl: config.SO_Base_url,
    });

    if (!response?.data?.data) {
      showMessage("Failed to fetch delivery challan details", "error");
      return;
    }

    const challanData = response.data.data;

    // Set line items state with proper data mapping first
    if (challanData.line_items && challanData.line_items.length > 0) {
      const mappedLineItems = challanData.line_items.map((item, index) => ({
        id: index + 1,
        item_id: item.item_id || "",
        name: item.name || "",
        description: item.description || "",
        quantity: parseFloat(item.quantity) || 1,
        rate: parseFloat(item.rate) || 0,
        amount: parseFloat(item.amount) || 0,
        discount: parseFloat(item.discount) || 0,
        tax_percentage: parseFloat(item.tax_percentage) || 0,
        unit: item.unit || "",
        item_total: parseFloat(item.item_total) || 0,
      }));
      setChallanItems(mappedLineItems);
    }

    if (challanData?.reference_number) {
      setShowRefNo(true);
    }

    // Set form data with cloned values
    formik.setValues({
      // ... all your form values
    });

    // Handle customer data WITHOUT creating infinite loop
    if (challanData.customer_id) {
      // Fetch customer data only
      const customerData = await fetchCustomerDataOnly(challanData.customer_id);
      if (customerData) {
        // Update customer data and form fields directly
        setCustomerData(customerData);
        setSelectedCustomer({
          contact_id: customerData.contact_id,
          contact_name: customerData.contact_name,
          gst_treatment: customerData.gst_treatment,
          place_of_contact: customerData.place_of_contact,
          place_of_contact_formatted: customerData.place_of_contact_formatted,
        });
      }
    }

  } catch (error) {
    console.error("Error fetching delivery challan data:", error);
    // ... error handling
  }
};
  const handleChallanDateChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue("date", date);
    formik.setFieldValue("date_formatted", formatDate(date));
  };

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      customer_name: "",
      reference_number: "",
      deliverychallan_number: deliveryChallanId,

      invoices: [],
      invoice_ids: [],
      salesorders: [],
      date: new Date().toISOString().split("T")[0],
      date_formatted: formatDate(new Date().toISOString().split("T")[0]),
      expiry_date: "",
      expiry_date_formatted: "",
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
      place_of_supply_formatted: "",
      gst_treatment: "",
      challan_type: 0,
      challan_type_formatted: "",
      gst_no: "",
      terms: "",
      notes: "",
      status_formatted: "Draft",
      general: [],
      documents: null,
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        const errors = [];
        if (!customerData?.contact_id) {
          errors.push("Please select a customer");
        }

        if (
          customerData?.gst_treatment !== "Overseas" &&
          !values.place_of_supply
        ) {
          errors.push("Please select Place of supply");
        }

        const hasValidLineItems = values.line_items.some(
          (item) =>
            item.item_id && item.name && item.quantity > 0 && item.rate > 0
        );
        if (!hasValidLineItems) {
          errors.push("Please add at least one line item");
        }

        if (!values.tds_option && !values.tax_type) {
          errors.push("Please select TCS/TDS option");
        }

        if (!values.challan_type) {
          errors.push("Please select Challan type");
        }

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

        const requestData = {
          customer_id: customerData?.contact_id,
          customer_name: customerData?.contact_name,
          deliverychallan_number: deliveryChallanId,
          reference_number: values.reference_number,
          challan_type_formatted: values.challan_type_formatted,
          challan_type: values.challan_type,
          invoices: [],
          invoice_ids: [],
          salesorders: [],
          date: values.date,
          date_formatted: values.date_formatted,
          expiry_date: values.expiry_date,
          expiry_date_formatted: values.expiry_date_formatted,
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
          total_formatted: values.total_formatted,
          adjustment: parseFloat(values.adjustment) || 0,
          adjustment_description: values.adjustment_description || "Adjustment",
          status: values.status,
          status_formatted: values.status_formatted,
          place_of_supply: values.place_of_supply,
          place_of_supply_formatted: values.place_of_supply_formatted,
          gst_treatment: values.gst_treatment,
          tds_id: values.tds_id,
          challan_type: values.challan_type,
          challan_type_formatted: values.challan_type_formatted,
          tcs_id: values.tcs_id,
          discount_percent: values.discount_percent,
          discount_amount_formatted: values.discount_amount_formatted,
          discount_amount: values.discount_amount,
          documents: values.documents,
        };

        const response = await apiService({
          method: "POST",
          url: `/api/v1/deliverychallans?organization_id=${organization_id}`,
          data: requestData,
          customBaseUrl: config.SO_Base_url,
          file: true,
        });
        console.log(response.data, "response.data");
        if (response.data.status) {
          showMessage("Delivery challan created successfully", "success");
          router.push(
            `/sales/deliveryChallan/${response.data.deliverychallan.deliverychallan_id}`
          );
        } else {
          showMessage(
            response.data.message || "Failed to create DeliveryChallan",
            "error"
          );
        }
      } catch (error) {
        console.error("Error creating DeliveryChallan:", error);
        showMessage("Failed to create DeliveryChallan", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSaveAsDraft = () => {
    setOpenAlert(true);
    formik.setFieldValue("status", "draft");
    formik.setFieldValue("status_formatted", "Draft");
    setStatus("draft");
    formik.handleSubmit();
  };

  const [isZoho, setIsZoho] = useState(true);

  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    router.push("/tally/voucher");
  };

  const handleCloseAddressModal = () => {
    setAddressModalOpen(false);
    setAddressType("");
    setAddressData(null);
    fetchCustomerData(customerData?.contact_id);
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
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px",
        }}
      >
        <Box>
          <Typography variant="h6" component="h1">
            New Delivery Challan
          </Typography>
        </Box>
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
                sx={{ ml: 1, color: "#333", fontWeight: "bold" }}
              >
                {"Zoho"}
              </Typography>
            </div>

            <IconButton
              aria-label="Close"
              sx={{ color: "red" }}
              onClick={() => router.back()}
            >
              <CloseIcon sx={{ fontSize: 28 }} />
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
      </Toolbar>
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
                <Grid item sx={formLabelStyle}>
                  <Typography variant="subtitle2" sx={formLabelStyle}>
                    Customer Name*
                  </Typography>
                </Grid>

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

                  <IconButton sx={searchButtonStyle}>
                    <SearchOutlinedIcon fontSize="medium" />
                  </IconButton>

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

            {customerData !== null && (
              <Grid container>
                <Grid item xs={1.8}></Grid>
                <Grid item xs={8}>
                  <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
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
                            onClick={(e) => handleClickBA(e, "edit")} // Trigger Popover for Edit
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
                              onClick={(e) => handleClickBA(e, "add")} // Trigger New Address
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <AddressDropdown
                          addressType="billing"
                          onClose={() => setAnchorElBilling(null)}
                          customerData={customerData}
                          setAddressData={setAddressData}
                        />
                      </Popover>
                    </Box>
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
                            onClick={(e) => handleClickSA(e, "edit")} // Trigger Popover for Edit
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
                              onClick={(e) => handleClickSA(e, "add")} // Trigger New Address
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <AddressDropdown
                          addressType="shipping"
                          onClose={() => setAnchorElShipping(null)}
                          customerData={customerData}
                          setAddressData={setAddressData}
                        />
                      </Popover>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}

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
            {/* GST TREATMENT */}
            {customerData !== null && customerData?.gst_treatment !== "" && (
              <Grid container>
                <Grid item xs={1.8}></Grid>
                <Grid item xs={8}>
                  <Box sx={{ my: 2, fontSize: "13px" }}>
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
                        {customerData?.gst_treatment && (
                          <IconButton
                            size="small"
                            sx={{
                              p: 0.5,
                              height: "fit-content",
                              color: "#757575",
                            }}
                            onClick={handleEditClick}
                          >
                            <EditIcon sx={{ fontSize: "16px" }} />
                          </IconButton>
                        )}
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
          </Grid>
          {customerData !== null &&
            customerData.gst_treatment !== "Overseas" && (
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
                    }}
                  >
                    <Grid item sx={formLabelStyle}>
                      <Typography variant="subtitle2" sx={formLabelStyle}>
                        Place of supply*
                      </Typography>
                    </Grid>

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
                          renderOption={(props, option, { selected }) => (
                            <li
                              {...props}
                              style={{
                                fontSize: "13px",
                                padding: "6px 12px",
                                borderRadius: "5px",
                                margin: "1px 10px",
                                backgroundColor: selected ? "#408dfb" : "white",
                                color: selected ? "white" : "black",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#408dfb";
                                e.currentTarget.style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = selected
                                  ? "#408dfb"
                                  : "white";
                                e.currentTarget.style.color = selected
                                  ? "white"
                                  : "black";
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
            <Grid
              container
              sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
            >
              <Grid item sx={formLabelStyle}>
                <Typography variant="subtitle2" sx={formLabelStyle}>
                  Delivery Challan#*
                </Typography>
              </Grid>
              <Grid
                item
                sx={{ display: "flex", width: "320px", flexShrink: 0 }}
              >
                <TextField
                  fullWidth
                  id="deliveryChallanId"
                  value={deliveryChallanId}
                  disabled
                  onChange={(e) => setDeliveryChallanId(e.target.value)}
                  sx={{
                    ...commonInputStyle,
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000", // Makes text black even when disabled
                    },
                  }}
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
                  <Customize deliveryChallanId={deliveryChallanId} />
                </Box>
              </Modal>
            </Grid>
            {showRefNo && (
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
                    value={formik.values.reference_number}
                    onChange={formik.handleChange}
                    disabled
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
            <Grid container sx={{ px: 2, pt: 2, gap: 4 }}>
              <Grid
                item
                xs={12}
                md={5}
                sx={{ display: "flex", ...formRowStyle, flexWrap: "nowrap" }}
              >
                <Grid item sx={formLabelStyle}>
                  <Typography variant="subtitle2" sx={formLabelStyle}>
                    Delivery Challan <br /> Date*
                  </Typography>
                </Grid>
                <Grid
                  item
                  sx={{ display: "flex", width: "320px", flexShrink: 0 }}
                >
                  <TextField
                    fullWidth
                    id="deliveryChallanDate"
                    value={formik.values.date}
                    type="date"
                    onChange={handleChallanDateChange}
                    sx={commonInputStyle}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* challan type */}
            <Grid container sx={{ px: 2, pt: 2, gap: 4 }}>
              {/* Challan Type */}
              <Grid
                item
                xs={12}
                md={5}
                sx={{ display: "flex", ...formRowStyle, flexWrap: "nowrap" }}
              >
                {/* Label */}
                <Grid item sx={formLabelStyle}>
                  <Typography variant="subtitle2" sx={formLabelStyle}>
                    Challan Type*
                  </Typography>
                </Grid>
                {/* Custom Dropdown */}
                <Grid
                  item
                  sx={{ display: "flex", width: "320px", flexShrink: 0 }}
                >
                  <Box sx={{ position: "relative", width: "100%" }}>
                    {/* Dropdown Header */}
                    <Box
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                      }}
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        fontSize: "13px",
                        p: 1,
                        px: 1,
                        py: 0.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        bgcolor: "white",
                        borderColor: dropdownOpen ? "#408dfb" : "#ccc",
                        borderBottomLeftRadius: dropdownOpen ? 0 : "4px",
                        borderBottomRightRadius: dropdownOpen ? 0 : "4px",
                      }}
                    >
                      <Typography
                        color={
                          formik.values.challan_type
                            ? "textPrimary"
                            : "text.secondary"
                        }
                        sx={{
                          fontSize: "13px",
                        }}
                      >
                        {formik.values.challan_type ||
                          "Choose a proper challan type."}
                      </Typography>
                      {dropdownOpen ? (
                        <KeyboardArrowUp color="primary" />
                      ) : (
                        <KeyboardArrowDown color="action" />
                      )}
                    </Box>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <Paper
                        elevation={3}
                        sx={{
                          position: "absolute",
                          width: "100%",
                          zIndex: 1000,
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                          overflow: "hidden",
                          borderTop: "none",
                          fontSize: "13px",
                        }}
                      >
                        {/* Search Box */}
                        <Box sx={{ p: 0.5, borderBottom: "1px  #eee" }}>
                          <TextField
                            fullWidth
                            placeholder="Search"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ fontSize: "13px" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search
                                    sx={{
                                      color: "text.secondary",
                                      border: "0.4px #408dfb",
                                    }}
                                  />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: "8px",
                                height: "30",
                                fontSize: "12px",
                                paddingY: 0,
                              },
                            }}
                            inputProps={{
                              sx: {
                                paddingY: 1.3,
                              },
                            }}
                          />
                        </Box>

                        {/* Options List */}
                        <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                          {[
                            "Supply of Liquid Gas",
                            "Job Work",
                            "Supply on Approval",
                            "Others",
                          ]
                            .filter((option) =>
                              option
                                .toLowerCase()
                                .includes(searchTerm?.toLowerCase() || "")
                            )
                            .map((option) => (
                              <Box
                                key={option}
                                onClick={() => {
                                  formik.setFieldValue(
                                    "challan_type_formatted",
                                    option
                                  );
                                  formik.setFieldValue("challan_type", option);
                                  setDropdownOpen(false);
                                }}
                                sx={{
                                  p: 1,
                                  margin: "1px 10px",
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: "#408dfb",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  bgcolor:
                                    formik.values.challan_type === option
                                      ? "#e6f0ff"
                                      : "transparent",
                                  borderBottom: "1px solid #f0f0f0",
                                }}
                              >
                                {option}
                              </Box>
                            ))}
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <SectionDivider sx={{ my: 2 }} />
            <Grid container>
              <Grid item xs={12}>
                <ItemTable formik={formik} />
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
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

            <Grid item xs={5}>
              <Typography variant="body2" gutterBottom>
                Attach File(s) to Delivery Challan
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
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              pt: 2,
              height: "70px",
              width: "100%",
              position: "sticky",
              top: 0,
              pb: 14,
              borderTop: "1px solid #ddd",
              bgcolor: "white",
              alignItems: "center",
            }}
          ></Box>
        </Box>
      </form>
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
          display: "flex",
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{
                // ...commonButtonStyle,
                marginRight: "8px",
              }}
              onClick={handleSaveAsDraft}
              type="button"
            >
              Save as Draft
            </Button>

            <Button variant="outlined" onClick={() => router.back()}>
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
                  ml: 20,
                }}
              >
                Change
              </Button>
            </Typography>
          </Grid>
        </Grid>
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
            address={address}
            title={
              addressType === "billing" ? "Billing Address" : "Shipping Address"
            }
            contactId={customerData?.contact_id}
          />
        </Box>
      </Modal>
    </>
  );
};

export default DeliveryChallanCreationPage;
