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
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  Search,
  Settings,
  Settings2,
  ShoppingCart,
  Weight,
} from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import ItemTable from "../../itemTable";
import CustomerDropDown from "../../../common/CustomerDropDown";
import Customize from "../../../common/customizeautogeneration/page";
import ProjectSelector from "../../../common/salespersondropdown/ProjectSelector";
import { Modal } from "@mui/material";
import apiService from "../../../../../src/services/axiosService";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { useRouter, useSearchParams } from "next/navigation";
import config from "../../../../services/config";
import EmailCommunications from "../../../common/emailcommunication/EmailCommunications";
import TaxPreferencesPopover from "../../../common/gstTreatment/TaxPreferencesPopover";
import GSTIn from "../../../common/gstIN/TaxInformationManager";
import AddressDropdown from "../../../common/ship_bill_address/AddressManagement";
import BillingAddress from "../../../common/BillingAddressForm";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const SalesOrderCreation = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [anchorElSales, setAnchorElSales] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [salesOrderNumber, setSalesOrderNumber] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const quote_id = searchParams.get("quote_id");
  const clone_id = searchParams.get("clone_id");
  const [quotesData, setQuotesData] = useState([]);
  const { showMessage } = useSnackbar();
  const dropdownRef = useRef(null);
  const anchorRef = useRef(null);
  const [status, setStatus] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [address,setAddress] = useState("");
  const [addressType, setAddressType] = useState("");
  const [showRefNo, setShowRefNo] = useState(false);
  const [anchorElEdit, setAnchorElEdit] = React.useState(null);
  const [anchorElGSTIN, setAnchorElGSTIN] = React.useState(null);
  const [openGSTIN, setOpenGSTIN] = useState(false);
  const [anchorElBilling, setAnchorElBilling] = useState(null); // For Billing Address Popover
  const [anchorElShipping, setAnchorElShipping] = useState(null); // For Shipping Address Popover
  const contact_id = searchParams.get("contact_id");
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState([]);
  const theme = useTheme();

  const [salesPersons, setSalesPersons] = useState([]);
  const [openSalespersonModal, setOpenSalespersonModal] = useState(false);
  useEffect(() => {
    if (contact_id) {
      fetchContactData(contact_id);
    }
  }, [contact_id]);

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
      setAddressData(null);
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
  const handleCloseAddressModal = () => {
    setAddressModalOpen(false);
    setAddressType("");
    setAddressData(null);
    fetchCustomerData(customerData?.contact_id);
  };
  const handleAddressUpdate = (newAddressData) => {
    if (newAddressData) {
      const updatedCustomerData = { ...customerData };
      if (!updatedCustomerData.additional_address) {
        updatedCustomerData.additional_address = [];
      }
      updatedCustomerData.additional_address.push(newAddressData);
      setCustomerData(updatedCustomerData);
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
    fetchSalesOrderId();

    // Fetch quotes data if quote_id exists
    if (quote_id) {
      getQuotesData(quote_id);
    }

    if (clone_id) {
      getSalesOrder(clone_id);
    }

    // Load shared data from localStorage if it exists
    const sharedData = localStorage.getItem("sharedFormData");
    if (sharedData) {
      try {
        const data = JSON.parse(sharedData);
        console.log("[SalesOrderCreation] Loading shared data:", data);

        // Update formik values with shared data
        formik.setValues({
          ...formik.values,
          customer_id: data.customer_id || "",
          customer_name: data.customer_name || "",
          billing_address: data.billing_address || "",
          shipping_address: data.shipping_address || "",
          gst_treatment: data.gst_treatment || "",
          place_of_supply: data.place_of_supply || "",
          gst_no: data.gst_no || "",
          line_items: data.line_items || [],
          date: data.date || "",
          date_formatted: data.date_formatted || "",
          expiry_date: data.expiry_date || "",
          expiry_date_formatted: data.expiry_date_formatted || "",
          tax_type: data.tax_type || "",
          tax_percentage: data.tax_percentage || 0,
          discount_percent: data.discount_percent || 0,
          discount_amount: data.discount_amount || 0,
          tds_id: data.tds_id || "",
          tcs_id: data.tcs_id || "",
          payment_terms: data.payment_terms || "",
          payment_terms_label: data.payment_terms_label || "",
          sub_total: data.sub_total || 0,
          tax_total: data.tax_total || 0,
          total: data.total || 0,
          adjustment: data.adjustment || 0,
          adjustment_description: data.adjustment_description || "Adjustment",
          notes: data.notes || "",
          terms: data.terms || "",
          reference_number: data.reference_number || "",
        });

        // Update customer data
        // if (data.customer_id) {
        //   setCustomerData({
        //     contact_id: data.customer_id,

        //     contact_name: data.customer_name,
        //     billing_address: data.billing_address,
        //     shipping_address: data.shipping_address,
        //     gst_treatment: data.gst_treatment,
        //     place_of_supply: data.place_of_supply,
        //     gst_no: data.gst_no,
        //   });
        // }
        if (data.customer_id) {
          fetchAndSetCustomer(data.customer_id).then((updatedData) => {
            if (updatedData) {
              setCustomerData({
                contact_id: data.customer_id,
                contact_name: data.customer_name,
                billing_address: data.billing_address,
                shipping_address: data.shipping_address,
                gst_treatment: data.gst_treatment,
                place_of_supply: data.place_of_supply,
                gst_no: data.gst_no,
              });
              handleCustomerChange(updatedData);
            }
          });
        }

        // Update salesperson if available
        if (data.salesperson) {
          setSelectedSalesperson(data.salesperson);
        }

        // Clear the shared data after loading
        localStorage.removeItem("sharedFormData");
      } catch (error) {
        console.error("[SalesOrderCreation] Error loading shared data:", error);
      }
    }

    // Set initial dates using a consistent format
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    formik.setFieldValue("date", formattedToday);
    formik.setFieldValue("date_formatted", formatDate(formattedToday));

    // Set due date to a fixed date for initial render
    // formik.setFieldValue("shipment_date", formattedToday);
    // formik.setFieldValue("shipment_date_formatted", formatDate(formattedToday));
  }, []);

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
      setSalesOrderNumber(data.salesorder_id);
      if (data?.reference_number) {
        setShowRefNo(true);
      }
      formik.setValues({
        ...formik.values,
        ...data,
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        reference_number: data.reference_number || "",
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
      });
      fetchAndSetCustomer(data.customer_id);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
    }
  };

  const fetchAndSetCustomer = async (id) => {
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

      // Add 'selected: true' to both billing and shipping addresses
      const updatedData = {
        ...data,
        billing_address: {
          ...data.billing_address,
          selected: true,
        },
        shipping_address: {
          ...data.shipping_address,
          selected: true,
        },
      };

      setCustomerData(updatedData);
      setSelectedCustomer(updatedData);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      showMessage("Failed to fetch customer data", "error");
    }
  };

  useEffect(() => {
    if (quotesData && Object.keys(quotesData).length > 0) {
      // Set customer data from quotes
      const fetchAndSetCustomerData = async () => {
        try {
          const response = await apiService({
            method: "GET",
            url: `/api/v1/contact/${quotesData.customer_id}`,
            params: {
              organization_id: organization_id,
            },
            file: false,
          });

          const { data } = response.data;
          setCustomerData(data);
          setSelectedCustomer(data);
          // Set formik values
          console.log(quotesData.tax_total, "quotesData.tax_total");

          formik.setValues({
            ...formik.values,
            customer_id: quotesData.customer_id,
            customer_name: quotesData.customer_name,
            reference_number: quotesData.estimate_number || "",
            salesorder_number: salesOrderNumber,
            billing_address: quotesData.billing_address || {},
            shipping_address: quotesData.shipping_address || {},
            line_items: quotesData.line_items.map((item) => ({
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
            sub_total: quotesData.sub_total || 0,
            sub_total_formatted: quotesData.sub_total_formatted || "₹0.00",
            total_amount: quotesData.total || 0,
            total_amount_formatted: quotesData.total_formatted || "₹0.00",
            adjustment: quotesData.adjustment || 0,
            adjustment_description: quotesData.adjustment_description || "Adjustment",
            terms: quotesData.terms || "",
            notes: quotesData.notes || "",
            salesperson_name: quotesData.salesperson_name || "",
            gst_treatment: data.gst_treatment || "",
            gst_no: data.gst_no || "",
            place_of_supply: data.place_of_contact || "",
            place_of_supply_formatted: data.place_of_contact_formatted || "",
            payment_terms_label: data.payment_terms_label || "",
            payment_terms: data.payment_terms || "",
            discount_amount_formatted:
              quotesData.discount_amount_formatted || "",
            discount_amount: quotesData.discount_amount || "",
            tax_type: quotesData.tax_type || "",
            tds_option: quotesData.tds_option || "",
            discount_percent: parseInt(quotesData.discount_percent) || 0,
            tax_total: quotesData.tax_total ?? 0,
            tax_total_formatted: quotesData.tax_total_formatted || "",
            tax_percentage: quotesData.tax_percentage || 0,
          });
          console.log(formik.values.tax_total);
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          showMessage("Failed to fetch customer data", "error");
        }
      };

      fetchAndSetCustomerData();
    }
  }, [quotesData]);

  const getQuotesData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/estimates/${id}?organization_id=${organization_id}`,
      });
      if (response.data && response.data.estimate) {
        if (response?.data?.estimate) {
          setShowRefNo(true);
        }
        setQuotesData(response.data.estimate);
      }
    } catch (error) {
      console.error("Error fetching quotes data:", error);
      showMessage("Failed to fetch quote data", "error");
    }
  };

  const fetchSalesOrderId = async () => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/sales/unique-id`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });

      if (response.data.status) {
        const { data } = response.data;
        setSalesOrderNumber(data);
      } else {
        showMessage(
          response.data.message || "Failed to fetch salesorder ID",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching salesorder ID:", error);
      showMessage(
        error.response?.data?.message || "Failed to fetch salesorder ID",
        "error"
      );
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
      fontSize: "13px",
      padding: "5px 30px 5px 8px",
      Weight: "400",
    },
    "& .MuiOutlinedInput-root": {
      height: "35px",
      borderRadius: "4px",
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
    fontSize: "13px",
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
    fontSize: "13px",
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
    borderRadius: "4px",
    // padding: "6px 12px",
    fontFamily: "inherit",
    fontSize: "13px",
    resize: "vertical",
    // minHeight: "200",
    lineHeight: "1.6",
    padding: "5px 2px",
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
        borderRadius: "4px",
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

  const handleSalespersonSelect = (salesperson) => {
    setSelectedSalesperson(salesperson);
    formik.setFieldValue("salesperson_id", salesperson.salesperson_id);
    formik.setFieldValue("salesperson_name", salesperson.salesperson_name);
    handleCloseDropdown();
  };

  // const handleSalespersonChange = (event) => {
  //   setSelectedSalesperson(event.target.value);
  // };

  // const handleProjectChange = (event) => {
  //   setSelectedProject(event.target.value);
  // };

  // const handleTaxTypeChange = (event) => {
  //   setTaxType(event.target.value);
  // };

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
      order_status: "draft",
      order_status_formatted: "Draft",
      paid_status: "",
      paid_status_formatted: "",
      invoiced_status: "",
      invoiced_status_formatted: "",
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
      salesperson_id: "",
      salesperson_name: "",
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

        if (!values.payment_terms_label) {
          errors.push("Please select terms");
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
          adjustment_description:values.adjustment_description,
          discount_percent: values.discount_percent,
          discount_amount_formatted: values.discount_amount_formatted,
          discount_amount: values.discount_amount,
          status: values.status,
          status_formatted: values.status_formatted,
          invoiced_status: values.invoiced_status,
          invoiced_status_formatted: values.invoiced_status_formatted,
          order_status: values.order_status,
          order_status_formatted: values.order_status_formatted,
          paid_status: values.paid_status,
          paid_status_formatted: values.paid_status_formatted,
          place_of_supply: values.place_of_supply,
          place_of_supply_formatted: values.place_of_supply_formatted,
          gst_treatment: values.gst_treatment,
          tds_id: values.tds_id,
          payment_terms: values.payment_terms,
          payment_terms_label: values.payment_terms_label,
          tcs_id: values.tcs_id,
          tax_percentage: values.tax_percentage,
          salesperson_id: formik.values.salesperson_id,
          salesperson_name: formik.values.salesperson_name,
          documents: values.documents,
        };
        let url;
        if (quote_id) {
          url = `/api/v1/estimates/convert-to-salesorder?organization_id=${organization_id}&quote_id=${quote_id}`;
        } else {
          url = `/api/v1/salesorders?organization_id=${organization_id}`;
        }

        const response = await apiService({
          method: "POST",
          url: url,
          data: requestData,
          customBaseUrl: config.SO_Base_url,
          file: true,
        });

        showMessage("Sales Order has been created", "success");
        if (status === "draft") {
          router.push(
            `/sales/salesOrder/${response?.data?.data?.salesorder_id}`
          );
        } else {
          router.push(
            `/sales/salesOrder/${response?.data?.data?.salesorder_id}/email`
          );
        }
      } catch (error) {
        console.error("Error creating invoice:", error);
        showMessage(
          error.response?.data?.message || "Failed to create invoice",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle Save as Draft
  const handleSaveAsDraft = () => {
    setOpenAlert(true); // Show validation errors if any
    formik.setFieldValue("status", "draft");
    formik.setFieldValue("status_formatted", "Draft");
    formik.setFieldValue("order_status_formatted", "Draft");
    formik.setFieldValue("order_status", "draft");
    formik.setFieldValue("invoiced_status_formatted", "");
    formik.setFieldValue("invoiced_status", "");
    formik.setFieldValue("paid_status_formatted", "");
    formik.setFieldValue("paid_status", "");
    setStatus("draft");
    formik.handleSubmit(); // Trigger form submission
  };

  // Handle Save and Send
  const handleSaveAndSend = () => {
    setOpenAlert(true); // Show validation errors if any
    formik.setFieldValue("status", "draft");
    formik.setFieldValue("status_formatted", "Draft");
    formik.setFieldValue("order_status_formatted", "Draft");
    formik.setFieldValue("order_status", "draft");
    formik.setFieldValue("invoiced_status_formatted", "");
    formik.setFieldValue("invoiced_status", "");
    formik.setFieldValue("paid_status_formatted", "");
    formik.setFieldValue("paid_status", "");
    setStatus("send");
    formik.handleSubmit(); // Trigger form submission
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
    console.log("[toggleMode] Current isZoho state:", isZoho);
    const fromTally = localStorage.getItem("fromTally");
    console.log("[toggleMode] Current fromTally value:", fromTally);

    // Toggle the mode first
    setIsZoho(!isZoho);

    // If we're switching to Tally mode
    if (isZoho) {
      const formData = {
        // Customer data
        customer_id: formik.values.customer_id,
        customer_name: formik.values.customer_name,
        billing_address: formik.values.billing_address,
        shipping_address: formik.values.shipping_address,
        gst_treatment: formik.values.gst_treatment,
        place_of_supply: formik.values.place_of_supply,
        gst_no: formik.values.gst_no,

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
        adjustment_description: formik.values.adjustment_description,

        // Additional info
        notes: formik.values.notes,
        terms: formik.values.terms,
        reference_number: formik.values.reference_number,

        // Salesperson
        salesperson: selectedSalesperson,
        salesperson_id: formik.values.salesperson_id,
        salesperson_name: formik.values.salesperson_name,

        // Add organization_id to shared data
        organization_id: organization_id,
      };

      // Set the fromTally flag and save data
      localStorage.setItem("fromTally", "true");
      localStorage.setItem("sharedFormData", JSON.stringify(formData));

      // Navigate to Tally
      router.push("/tally/voucher");
    } else {
      // If we're switching back to Zoho mode
      localStorage.setItem("fromTally", "false");
      localStorage.removeItem("sharedFormData");
    }
  };

  // Handle due date change
  const handleDueDateChange = (event) => {
    const date = event.target.value;
    const orderDate = formik.values.date;

    if (date && orderDate && new Date(date) <= new Date(orderDate)) {
      formik.setFieldError(
        "shipment_date",
        "Shipment date must be after sales order date"
      );
      return;
    }

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
    <Box
      sx={{
        overflowX: "hidden",
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
            New Sales Order
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
              <IconButton
                size="small"
                sx={{
                  height: "35px",
                  width: "40px",
                  marginRight: 1,
                  borderRadius: "0 7px 7px 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText || "white",
                  border: "1px solid",
                  borderColor: theme.palette.primary.main,
                  borderLeft: "none",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.primary.navbar ||
                      theme.palette.primary.dark ||
                      theme.palette.primary.main,
                    borderColor:
                      theme.palette.primary.navbar ||
                      theme.palette.primary.dark ||
                      theme.palette.primary.main,
                  },
                }}
              >
                <SearchIcon fontSize="small" />
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
                      onClose={() => {
                        setAnchorElShipping(null); // Close the dropdown
                        fetchCustomerData(customerData?.contact_id); // Fetch customer data
                      }}
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
                        (state) => state.name === formik.values.place_of_supply
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
                    renderOption={(props, option, { selected }) => (
                      <li
                        {...props}
                        style={{
                          fontSize: "13px",
                          padding: "6px 12px",
                          borderRadius: "5px",
                          backgroundColor: selected ? "#408dfb" : "transparent",
                          color: selected ? "#fff" : "#000",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            theme.palette.hover?.background || "#408dfb";
                          e.currentTarget.style.color =
                            theme.palette.hover?.text || "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = selected
                            ? "#408dfb"
                            : "transparent";
                          e.currentTarget.style.color = selected
                            ? "#fff"
                            : "#000";
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
          <Grid item sx={{ display: "flex", width: "350px", flexShrink: 0 }}>
            <TextField
              fullWidth
              id="salesorder_number"
              name="salesorder_number"
              value={salesOrderNumber}
              disabled
              onChange={(e) => setSalesOrderNumber(e.target.value)}
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
                fontSize: "13px",
              }}
            >
              <Customize invoiceeId={salesOrderNumber} />{" "}
              {/* Display Customize component inside the modal */}
            </Box>
          </Modal>
        </Grid>

        {/* ordernumber */}
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
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <TextField
                fullWidth
                id="reference_number"
                name="reference_number"
                disabled
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
          <Grid item sx={{ display: "flex", width: "350px", flexShrink: 0 }}>
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
          <Grid item sx={{ display: "flex", width: "350px", flexShrink: 0 }}>
            <TextField
              fullWidth
              id="shipmentDate"
              type="date"
              value={formik.values.shipment_date}
              onChange={handleDueDateChange}
              placeholder="dd/MM/yyyy"
              sx={commonInputStyle}
              inputProps={{
                min: formik.values.date, // Set minimum date to order date
              }}
            />
          </Grid>
        </Grid>

        {/* Terms - Dropdown with Search */}
        <Grid
          container
          sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
        >
          <Grid item sx={formLabelStyle}>
            <Typography variant="subtitle2" sx={formLabelStyle}>
              Payment Terms*
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "350px", flexShrink: 0 }}>
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
                width: "350px",
                ml: 0.5,
                borderRadius: "4px",
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
                      // marginLeft:"10px",
                    }}
                  />
                  <TextField
                    fullWidth
                    placeholder="Search..."
                    variant="standard"
                    sx={{ fontSize: "15px", marginLeft: "10px" }}
                    InputProps={{ disableUnderline: true, fontSize: "13px" }}
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
                selected={formik.values.yourFieldName === term} // Optional, if using Menu directly
                sx={{
                  backgroundColor:
                    formik.values.yourFieldName === term
                      ? theme.palette.hover?.background || "#408dfb"
                      : "transparent",
                  color:
                    formik.values.yourFieldName === term
                      ? theme.palette.hover?.text || "white"
                      : "inherit",
                  borderRadius: formik.values.yourFieldName === term ? "5px" : "0px",
                  "&:hover": {
                    backgroundColor: theme.palette.hover?.background || "#408dfb",
                    color: theme.palette.hover?.text || "white",
                    borderRadius: "5px",
                  },
                }}
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
                <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
                  <IconButton size="small" sx={{ color: "#408dfb" }}>
                    <Settings width="15px" />
                  </IconButton>

                  <Typography
                    variant="body1"
                    sx={{
                      // ml: 1,
                      color: "#408dfb",
                      fontSize: "13px !important",
                    }}
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
          sx={{ px: 2, pb: 3, ...formRowStyle, flexWrap: "nowrap" }}
        >
          {/* Delivery Method Label */}
          <Grid item sx={formLabelBlackStyle}>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Delivery Method
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "350px", flexShrink: 0 }}>
            <Autocomplete
              freeSolo
              options={["Online", "In Person", "Courier", "Express Delivery"]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select a delivery method or type to add"
                  sx={{
                    ...commonInputStyle,
                    width: "350px",
                    "& .MuiOutlinedInput-root": {
                      height: "35px",
                      fontSize: "13px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#408dfb",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "7px 14px",
                    },
                  }}
                />
              )}
              PopperComponent={(props) => (
                <Popper {...props} style={{ width: "320px", fontSize: "13px" }}>
                  {props.children}
                </Popper>
              )}
              renderOption={(props, option, { selected }) => (
                <li
                  {...props}
                  style={{
                    fontSize: "13px",
                    padding: "6px 12px",
                    backgroundColor: selected ? "#408dfb" : "inherit",
                    color: selected ? "#fff" : "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#408dfb";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = selected
                      ? "#408dfb"
                      : "inherit";
                    e.currentTarget.style.color = selected ? "#fff" : "inherit";
                  }}
                >
                  {option}
                </li>
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
              width: "390px",
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
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "13px",
                    "&::placeholder": {
                      fontSize: "13px",
                      opacity: 1,
                    },
                  },
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <KeyboardArrowDownOutlinedIcon
                        sx={{ fontSize: "18px" }}
                      />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    fontSize: "13px",
                  },
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
                fontSize: "13px",
              }}
            >
              <ProjectSelector
                closeDropdown={handleCloseDropdown}
                onSelect={(selectedPerson) => {
                  setSelectedSalesperson(selectedPerson);
                  formik.setFieldValue(
                    "salesperson_id",
                    selectedPerson.salesperson_id
                  );
                  formik.setFieldValue(
                    "salesperson_name",
                    selectedPerson.salesperson_name
                  );
                }}
                formik={formik}
              />
            </Box>
          </Popper>
        </Grid>

        <SectionDivider sx={{ my: 4 }} />

        {/* Subject */}

        <Grid container sx={{ ...formRowStyle, px: 2, mb: 2 }}>
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
                minWidth: "350px",
                "&:hover": commonTextareaStyle["&:hover"],
                "&:focus-within": commonTextareaStyle["&:focus"],
              }}
            >
              <TextareaAutosize
                id="subject"
                placeholder="Let your customer know what this invoice is for"
                minRows={1}
                style={{ ...commonTextareaInputStyle, fontSize: "13px" }}
              />
            </Box>
          </Grid>
        </Grid>
        <SectionDivider sx={{ my: 2 }} />
        {/* Item Table Section */}
        <Box sx={{ py: 1 }}>
          <ItemTable formik={formik} />
        </Box>
      </Box>

      {/* Terms & Conditions and File Attachments */}
      <Grid container spacing={2} sx={{ mb: 2, alignItems: "center" }}>
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
          <Typography
            variant="body2"
            gutterBottom
            sx={{ fontSize: "12px", marginBottom: "10px" }}
          >
            Attach File(s) to Quote
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.3 }}>
            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faUpload} />}
              endIcon={<KeyboardArrowDownIcon />}
              component="label"
              sx={{
                alignSelf: "flex-start",
                // borderColor: "#cbd5e1",
                // color: "#475569",
                // bgcolor: "#fff",
                // textTransform: "none",
                // borderStyle: "dashed",
                height: "36px",
                px: 2,
                fontSize: "13px",
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
                  <IconButton size="small" onClick={removeFile} sx={{ ml: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
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
            sx={{ fontWeight: "medium", fontSize: "13px" }}
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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "13px" }}
          >
            Configure payment gateways and receive payments online.{" "}
            <Typography
              component="span"
              color="primary"
              sx={{ cursor: "pointer", fontSize: "14px" }}
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
            )}
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
          <Grid container sx={{ ml: 0, mr: 2 }}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "13px" }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  color: "#6C718A",
                }}
              >
                Additional Fields:{" "}
              </span>
              Start adding custom fields for your invoice by going to
              <span
                style={{ fontWeight: "700", fontSize: "0.875rem" }}
              ></span>{" "}
              Settings{" "}
              <span style={{ fontWeight: "700", fontSize: "0.875rem" }}>➔</span>{" "}
              Sales{" "}
              <span style={{ fontWeight: "700", fontSize: "0.875rem" }}>➔</span>{" "}
              SalesOrder
            </Typography>
          </Grid>
        </Box>

        {/* Bottom Action Bar */}
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
          <Grid item xs={8}>
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
              Save as Draft
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
              sx={
                {
                  // ...commonButtonStyle,
                }
              }
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
            onClose={(newData) => {
              handleAddressUpdate(newData);
              handleCloseAddressModal();
            }}
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
    </Box>
  );
};
export default SalesOrderCreation;
