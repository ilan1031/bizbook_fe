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
import ItemTable from "../../itemTable";
import CustomerDropDown from "../../../common/CustomerDropDown";
import Customize from "../../../common/customizeautogeneration/page";
import ProjectSelector from "../../../common/salespersondropdown/ProjectSelector";
import { Modal } from "@mui/material";
import apiService from "../../../../../src/services/axiosService";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useSnackbar } from "../../../../../src/components/SnackbarProvider";
import { useRouter, useSearchParams } from "next/navigation";
import config from "../../../../../src/services/config";
import TaxPreferencesPopover from "../../../common/gstTreatment/TaxPreferencesPopover";
import GSTIn from "../../../common/gstIN/TaxInformationManager";
import EmailCommunications from "../../../common/emailcommunication/EmailCommunications";
import AddressDropdown from "../../../common/ship_bill_address/AddressManagement";
import BillingAddress from "../../../common/BillingAddressForm";

const validationSchema = Yup.object({
  customer_id: Yup.string().required("Customer is required"),
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
  template_id: Yup.string(),
  date: Yup.date().required("Invoice date is required"),
  payment_terms: Yup.number(),
  payment_terms_label: Yup.string(),
  due_date: Yup.date(),
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
  status: Yup.string().oneOf(["draft", "sent"]),
  status_formatted: Yup.string(),
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
  const [invoiceNumber, setInvoiceNumber] = useState("INV-000001");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [taxType, setTaxType] = useState("tds");
  const [quantity, setQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [addressType, setAddressType] = useState("");
  const [address, setAddress] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [anchorElSales, setAnchorElSales] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [invoiceId, setInvoiceId] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const quote_id = searchParams.get("quote_id");
  const invoice_id = searchParams.get("invoice_id");
  const deliverychallan_id = searchParams.get("deliverychallan_id");
  const salesorder_id = searchParams.get("salesorder_id");
  const [quotesData, setQuotesData] = useState(null);
  const [invoicesData, setInvoicesData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [challanData, setChallanData] = useState(null);
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
  const contact_id = searchParams.get("contact_id");
  const [showRefNo, setShowRefNo] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState([]);
  useEffect(() => {
    if (contact_id) {
      fetchContactData(contact_id);
    }
  }, [contact_id]);

  const handleSalespersonSelect = (salesperson) => {
    alert(salesperson);
    setSelectedSalesperson(salesperson);
    formik.setFieldValue("salesperson_id", salesperson.salesperson_id);
    formik.setFieldValue("salesperson_name", salesperson.salesperson_name);
    handleCloseDropdown();
  };

  const handleClickBA = (event, value) => {
    if (value === "edit") {
      setAddress("edit");
      setAddressType("billing");
      setAddressData(customerData?.billing_address);
      setAnchorElBilling(event.currentTarget); // Open Billing Address Popover
    } else if (value === "add") {
      alert(value);
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
      alert(value);
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
    fetchInvoiceId();

    // Fetch quotes data if quote_id exists
    if (quote_id) {
      getQuotesData(quote_id);
    }
    if (invoice_id) {
      getInvoiceData(invoice_id);
    }
    if (salesorder_id) {
      getSalesData(salesorder_id);
    }
    if (deliverychallan_id) {
      getChallanData(deliverychallan_id);
    }

    // Set initial dates using a consistent format
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    formik.setFieldValue("date", formattedToday);
    formik.setFieldValue("date_formatted", formatDate(formattedToday));

    // Set due date to a fixed date for initial render
    // formik.setFieldValue("due_date", formattedToday);
    // formik.setFieldValue("due_date_formatted", formatDate(formattedToday));
  }, []);

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
          if (data?.reference_number) {
            setShowRefNo(true);
          }
          // Set formik values
          formik.setValues({
            ...formik.values,
            customer_id: quotesData.customer_id,
            customer_name: quotesData.customer_name,
            reference_number: quotesData.reference_number || "",
            invoice_number: invoiceId,
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
            terms: quotesData.terms || "",
            notes: quotesData.notes || "",
            salesperson_name: quotesData.salesperson_name || "",
            gst_treatment: data.gst_treatment || "",
            gst_no: data.gst_no || "",
            place_of_supply: data.place_of_contact || "",
            payment_terms_label: data.payment_terms_label || "",
            payment_terms: data.payment_terms || "",
            discount_amount_formatted:
              quotesData.discount_amount_formatted || "",
            discount_amount: quotesData.discount_amount || "",
            tax_type: quotesData.tax_type || "",
            tds_option: quotesData.tds_option || "",
            adjustment: quotesData.adjustment || "",
            discount_percent: parseInt(quotesData.discount_percent) || 0,
            tax_total: quotesData.tax_total || "",
            tax_total_formatted: quotesData.tax_total_formatted || "",
            tax_percentage: quotesData.tax_percentage || 0,
          });
          setSelectedSalesperson(quotesData.salesperson || "");
          setSelectedProject(quotesData.project || "");
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          showMessage("Failed to fetch customer data", "error");
        }
      };

      fetchAndSetCustomerData();
    }
  }, [quotesData]);

  useEffect(() => {
    if (invoicesData && Object.keys(invoicesData).length > 0) {
      // Set customer data from quotes
      const fetchAndSetCustomerData = async () => {
        try {
          const response = await apiService({
            method: "GET",
            url: `/api/v1/contact/${invoicesData.customer_id}`,
            params: {
              organization_id: organization_id,
            },
            file: false,
          });

          const { data } = response.data;
          setCustomerData(data);
          setSelectedCustomer(data);
          if (data?.reference_number) {
            setShowRefNo(true);
          }
          // Set formik values
          formik.setValues({
            ...formik.values,
            customer_id: invoicesData.customer_id,
            customer_name: invoicesData.customer_name,
            reference_number: invoicesData.reference_number || "",
            invoice_number: invoiceId,
            billing_address: invoicesData.billing_address || {},
            shipping_address: invoicesData.shipping_address || {},
            line_items: invoicesData.line_items.map((item) => ({
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
            sub_total: invoicesData.sub_total || 0,
            sub_total_formatted: invoicesData.sub_total_formatted || "₹0.00",
            total_amount: invoicesData.total || 0,
            total_amount_formatted: invoicesData.total_formatted || "₹0.00",
            adjustment: invoicesData.adjustment || 0,
            terms: invoicesData.terms || "",
            notes: invoicesData.notes || "",
            salesperson_name: invoicesData.salesperson_name || "",
            gst_treatment: data.gst_treatment || "",
            gst_no: data.gst_no || "",
            place_of_supply: data.place_of_contact || "",
            payment_terms_label: data.payment_terms_label || "",
            payment_terms: data.payment_terms || "",
            discount_amount_formatted:
              invoicesData.discount_amount_formatted || "",
            discount_amount: invoicesData.discount_amount || "",
            tax_type: invoicesData.tax_type || "",
            tds_option: invoicesData.tds_option || "",
            adjustment: invoicesData.adjustment || "",
            discount_percent: parseInt(invoicesData.discount_percent) || 0,
            tax_total: invoicesData.tax_total || "",
            tax_total_formatted: invoicesData.tax_total_formatted || "",
            tax_percentage: invoicesData.tax_percentage || 0,
          });
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          showMessage("Failed to fetch customer data", "error");
        }
      };

      fetchAndSetCustomerData();
    }
  }, [invoicesData]);

  useEffect(() => {
    const savedData = localStorage.getItem("recurringInvoiceData");
    if (savedData) {
      try {
        const invoiceData = JSON.parse(savedData);
        console.log("Found recurring invoice data:", invoiceData);

        // Set customer info
        setCustomerData(invoiceData.customer_Data || {});
        setSelectedCustomer({
          contact_name: invoiceData.customer_name,
          customer_id: invoiceData.customer_id,
        });

        // Set form values using Formik
        formik.setValues({
          ...formik.values,
          customer_id: invoiceData.customer_id,
          customer_name: invoiceData.customer_name,
          billing_address: invoiceData.billing_address || {},
          shipping_address: invoiceData.shipping_address || {},
          line_items: invoiceData.line_items || [],
          tax_type: invoiceData.tax_type || "",
          tax_percentage: invoiceData.tax_percentage || 0,
          tds_option: invoiceData.tds_option || "",
          tcs_id: invoiceData.tcs_id || "",
          sub_total: invoiceData.sub_total || 0,
          tax_total: invoiceData.tax_total || 0,
          total: invoiceData.total || 0,
          payment_terms: invoiceData.payment_terms || "",
          payment_terms_label: invoiceData.payment_terms_label || "",
          date: invoiceData.date || new Date().toISOString().split("T")[0],
          salesperson_name: invoiceData.salesperson_name || "",
          salesperson_id: invoiceData.salesperson_id || "",
          reference_number: invoiceData.reference_number || "",
          notes: invoiceData.notes || "",
          terms: invoiceData.terms || "",
          place_of_supply: invoiceData.place_of_supply || "",
          gst_treatment: invoiceData.gst_treatment || "",
          gst_no: invoiceData.gst_no || "",
          discount_percent: invoiceData.discount_percent || 0,
          discount_amount: invoiceData.discount_amount || 0,
          adjustment: invoiceData.adjustment || 0,
        });

        // Remove data after use
        localStorage.removeItem("recurringInvoiceData");
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (salesData && Object.keys(salesData).length > 0) {
      // Set customer data from quotes
      const fetchAndSetCustomerData = async () => {
        try {
          const response = await apiService({
            method: "GET",
            url: `/api/v1/contact/${salesData.customer_id}`,
            params: {
              organization_id: organization_id,
            },
            file: false,
          });

          const { data } = response.data;
          setCustomerData(data);
          if (data?.reference_number) {
            setShowRefNo(true);
          }
          setSelectedCustomer(data);
          // Set formik values
          formik.setValues({
            ...formik.values,
            customer_id: salesData.customer_id,
            customer_name: salesData.customer_name,
            reference_number: salesData.salesorder_number || "",
            invoice_number: invoiceId,
            billing_address: salesData.billing_address || {},
            shipping_address: salesData.shipping_address || {},
            line_items: salesData.line_items.map((item) => ({
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
            sub_total: salesData.sub_total || 0,
            sub_total_formatted: salesData.sub_total_formatted || "₹0.00",
            total_amount: salesData.total || 0,
            total_amount_formatted: salesData.total_formatted || "₹0.00",
            adjustment: salesData.adjustment || 0,
            terms: salesData.terms || "",
            notes: salesData.notes || "",
            salesperson_name: salesData.salesperson_name || "",
            gst_treatment: data.gst_treatment || "",
            gst_no: data.gst_no || "",
            place_of_supply: data.place_of_contact || "",
            payment_terms_label: data.payment_terms_label || "",
            payment_terms: data.payment_terms || "",
            discount_amount_formatted:
              salesData.discount_amount_formatted || "",
            discount_amount: salesData.discount_amount || "",
            tax_type: salesData.tax_type || "",
            tds_option: salesData.tds_option || "",
            adjustment: salesData.adjustment || "",
            discount_percent: parseInt(salesData.discount_percent) || 0,
            tax_total: salesData.tax_total || "",
            tax_total_formatted: salesData.tax_total_formatted || "",
            tax_percentage: salesData.tax_percentage || 0,
          });
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          showMessage("Failed to fetch customer data", "error");
        }
      };

      fetchAndSetCustomerData();
    }
  }, [salesData]);

  useEffect(() => {
    if (challanData && Object.keys(challanData).length > 0) {
      // Set customer data from quotes
      const fetchAndSetCustomerData = async () => {
        try {
          const response = await apiService({
            method: "GET",
            url: `/api/v1/contact/${challanData.customer_id}`,
            params: {
              organization_id: organization_id,
            },
            file: false,
          });

          const { data } = response.data;
          setCustomerData(data);
          setSelectedCustomer(data);
          if (challanData?.reference_number) {
            setShowRefNo(true);
          }
          // Set formik values
          formik.setValues({
            ...formik.values,
            customer_id: challanData.customer_id,
            customer_name: challanData.customer_name,
            reference_number: challanData.deliverychallan_number || "",
            invoice_number: invoiceId,
            billing_address: challanData.billing_address || {},
            shipping_address: challanData.shipping_address || {},
            line_items: challanData.line_items.map((item) => ({
              line_item_id: item.line_item_id,
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
            due_date: challanData.expiry_date || "",
            due_date_formatted: challanData.expiry_date_formatted || "",
            date_formatted: challanData.date_formatted || "",
            date: challanData.date || "",
            sub_total: challanData.sub_total || 0,
            sub_total_formatted: challanData.sub_total_formatted || "₹0.00",
            total_amount: challanData.total || 0,
            total_amount_formatted: challanData.total_formatted || "₹0.00",
            adjustment: challanData.adjustment || 0,
            terms: challanData.terms || "",
            notes: challanData.notes || "",

            salesperson_name: challanData.salesperson_name || "",
            gst_treatment: data.gst_treatment || "",
            gst_no: data.gst_no || "",
            place_of_supply: data.place_of_contact || "",
            payment_terms_label: data.payment_terms_label || "",
            payment_terms: data.payment_terms || "",
            discount_amount_formatted:
              challanData.discount_amount_formatted || "",
            discount_amount: challanData.discount_amount || "",
            tax_type: challanData.tax_type || "",
            tds_option: challanData.tds_option || "",
            adjustment: challanData.adjustment || "",
            discount_percent: parseInt(challanData.discount_percent) || 0,
            tax_total: challanData.tax_total || "",
            tax_total_formatted: challanData.tax_total_formatted || "",
            tax_percentage: challanData.tax_percentage || 0,
          });
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          showMessage("Failed to fetch customer data", "error");
        }
      };

      fetchAndSetCustomerData();
    }
  }, [challanData]);

  const getQuotesData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/estimates/${id}?organization_id=${organization_id}`,
      });
      if (response.data && response.data.estimate) {
        setQuotesData(response.data.estimate);
      }
    } catch (error) {
      console.error("Error fetching quotes data:", error);
      showMessage("Failed to fetch quote data", "error");
    }
  };

  const getInvoiceData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/invoices/${id}?organization_id=${organization_id}`,
      });
      if (response.data && response.data.invoice) {
        setInvoicesData(response.data.invoice);
      }
    } catch (error) {
      console.error("Error fetching invoices data:", error);
      showMessage("Failed to fetch invoice data", "error");
    }
  };

  const getSalesData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/sales-order/${id}?organization_id=${organization_id}`,
      });
      if (response.data && response.data.data) {
        setSalesData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching quotes data:", error);
      showMessage("Failed to fetch salesOrder data", "error");
    }
  };

  const getChallanData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/delivery-challans/${id}?organization_id=${organization_id}`,
      });
      if (response.data && response.data.data) {
        setChallanData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching quotes data:", error);
      showMessage("Failed to fetch salesOrder data", "error");
    }
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

      borderRadius: "4px",
      ...commonInteractionStyles["& .MuiOutlinedInput-root"], // Spread common interactions
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

  const formLabelStyle = {
    fontSize: "13px",
    minWidth: "120px",
    whiteSpace: "nowrap",
    color: "error.main", // Red color for required fields
  };

  const formLabelBlackStyle = {
    ...formLabelStyle,
    color: "text.primary", // Using theme's primary text color
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

  const StyledTextField = styled("input")(({ error }) => ({
    height: "35px",
    width: "100%",
    padding: "6px 12px",
    border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
    borderRadius: "7px", // Changed from 4px to 7px
    fontSize: "14px", // 13px
    backgroundColor: "#fff",
    "&:hover": {
      borderColor: COLORS.primary,
      boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
    },
    "&:focus": {
      outline: "none",
      borderColor: COLORS.primary,
      boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
    },
    "&::placeholder": {
      color: COLORS.textSecondary,
      opacity: 1,
    },
  }));

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
      invoice_number: invoiceId || "",
      date: new Date().toISOString().split("T")[0],
      date_formatted: formatDate(new Date().toISOString().split("T")[0]),
      due_date: "",
      due_date_formatted: "",
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
      discount_amount: 0,
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
      payment_terms: 0,
      payment_terms_label: "Due On Receipt",
      status: "",
      status_formatted: "",
      general: [],
      place_of_supply: "",
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
      throw new Error("Organization ID not found");
    }

    // Format dates consistently
    const formattedDate = values.date
      ? dayjs(values.date).format("YYYY-MM-DD")
      : "";
    const formattedDueDate = values.due_date
      ? dayjs(values.due_date).format("YYYY-MM-DD")
      : "";

    // Prepare data for backend
    const requestData = {
      customer_id: customerData?.contact_id,
      customer_name: customerData?.contact_name,
      invoice_number: values.invoice_number,
      date: formattedDate,
      date_formatted: values.date_formatted,
      organization_id: organization_id,
      due_date: formattedDueDate,
      due_date_formatted: values.due_date_formatted,
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
      total: values.total_amount || 0,
      total_formatted: values.total_amount_formatted,
      adjustment: parseFloat(values.adjustment) || 0,
      status: values.status,
      discount_percent: values.discount_percent,
      discount_amount_formatted: values.discount_amount_formatted,
      discount_amount: values.discount_amount,
      status_formatted: values.status_formatted,
      place_of_supply: values.place_of_supply,
      gst_treatment: values.gst_treatment,
      reference_number: values.reference_number,
      tds_id: values.tds_id,
      payment_terms: values.payment_terms,
      payment_terms_label: values.payment_terms_label,
      tcs_id: values.tcs_id,
      tax_percentage: values.tax_percentage,
      documents: values.documents || null,
    };

    console.log("Request Data:", requestData);

    // Determine the correct API endpoint
    let url;
    if (quote_id) {
      url = `/api/v1/estimates/convert?organization_id=${organization_id}&quote_id=${quote_id}`;
    } else if (salesorder_id) {
      url = `/api/v1/salesorders/convert-to-invoice?organization_id=${organization_id}&salesorder_id=${salesorder_id}`;
    } else if (deliverychallan_id) {
      url = `/api/v1/deliverychallans/convert-to-invoice?organization_id=${organization_id}&deliverychallan_id=${deliverychallan_id}`;
    } else {
      url = `/api/v1/invoices?org_id=${organization_id}`;
    }

    const params = {
      method: "POST",
      url: url,
      data: requestData,
      customBaseUrl: config.SO_Base_url,
      file: deliverychallan_id ? false : true,
    };

    console.log("API Request Parameters:", params);

    // Make the API call
    const response = await apiService(params);
    
    console.log("API Response:", response);

    // Check if the response indicates success
    // Handle different response structures
    const isSuccess = response?.data?.success || response?.data?.status;
    const responseData = response?.data?.data;
    const message = response?.data?.message;

    if (isSuccess) {
      // Show success message
      showMessage(message || "Invoice created successfully", "success");
      
      console.log("Invoice created successfully:", responseData);

      // Handle navigation based on the source and status
      try {
        let invoiceId;
        
        // Extract invoice ID from different possible response structures
        if (responseData?.invoice?.invoice_id) {
          invoiceId = responseData.invoice.invoice_id;
        } else if (responseData?.invoice_id) {
          invoiceId = responseData.invoice_id;
        } else if (responseData?._id) {
          invoiceId = responseData._id;
        }

        console.log("Extracted Invoice ID:", invoiceId);
        console.log("Status:", status);

        // Navigate based on the source and status
        if (quote_id) {
          if (status === "draft") {
            router.push(`/sales/quotes/${quote_id}`);
          } else {
            if (invoiceId) {
              router.push(`/sales/invoices/${invoiceId}/email`);
            } else {
              router.push(`/sales/invoices`);
            }
          }
        } else if (salesorder_id || deliverychallan_id) {
          if (status === "draft") {
            if (invoiceId) {
              router.push(`/sales/invoices/${invoiceId}`);
            } else {
              router.push(`/sales/invoices`);
            }
          } else {
            if (invoiceId) {
              router.push(`/sales/invoices/${invoiceId}/email`);
            } else {
              router.push(`/sales/invoices`);
            }
          }
        } else {
          // Regular invoice creation
          if (status === "draft") {
            if (invoiceId) {
              router.push(`/sales/invoices/${invoiceId}`);
            } else {
              router.push(`/sales/invoices`);
            }
          } else {
            if (invoiceId) {
              router.push(`/sales/invoices/${invoiceId}/email`);
            } else {
              router.push(`/sales/invoices`);
            }
          }
        }
      } catch (navigationError) {
        console.error("Navigation error:", navigationError);
        // Fallback navigation
        router.push("/sales/invoices");
      }
    } else {
      // Handle API error response
      const errorMessage = message || "Failed to create invoice";
      console.error("API returned error:", errorMessage);
      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error("Error creating invoice:", error);
    
    // Extract meaningful error message
    let errorMessage = "Failed to create invoice";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    // Show error message
    showMessage(errorMessage, "error");
    
    // Log detailed error for debugging
    console.error("Detailed error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
  } finally {
    setSubmitting(false);
  }
},
  });
  // Add this useEffect after the other useEffect hooks
  useEffect(() => {
    const fromTally = localStorage.getItem("fromTally");
    setIsZoho(fromTally === "true");
  }, []);

  // Handle Save as Draft
  const handleSaveAsDraft = () => {
    setOpenAlert(true); // Show validation errors if any
    formik.setFieldValue("status", "draft");
    formik.setFieldValue("status_formatted", "Draft");
    setStatus("draft");
    formik.handleSubmit(); // Trigger form submission
  };

  // Handle Save and Send
  const handleSaveAndSend = () => {
    setOpenAlert(true); // Show validation errors if any
    formik.setFieldValue("status", "send");
    formik.setFieldValue("status_formatted", "Send");
    setStatus("sent");
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
    const invoiceDate = formik.values.date;
    if (date && invoiceDate && new Date(date) <= new Date(invoiceDate)) {
      formik.setFieldError("due_date", "Due date must be after invoice date");
      return;
    }
    formik.setFieldValue("due_date", date);
    formik.setFieldValue("due_date_formatted", formatDate(date));
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

      // Totals
      sub_total: formik.values.sub_total,
      tax_total: formik.values.tax_total,
      total: formik.values.total,
      adjustment: formik.values.adjustment,

      // Additional info
      notes: formik.values.notes,
      terms: formik.values.terms,
      reference_number: formik.values.reference_number,
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
            <InsertDriveFileOutlinedIcon sx={{ fontSize: "inherit", mr: 1 }} />
            New Invoice
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
                    sx: { width: "460px", height: "250px", overflow: "none" },
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
              Invoice#*
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
            <TextField
              fullWidth
              id="invoice_number"
              name="invoice_number"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              disabled
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
              <Customize invoiceeId={invoiceId} />{" "}
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
                disabled
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

        {/* Date Fields */}
        <Grid
          container
          sx={{
            px: 2,
            pt: 3,
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              justifyContent: "space-between",
              gap: 2,
            }}
          > */}
          {/* Invoice Date */}
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ ...formLabelStyle }}>
              Invoice Date*
            </Typography>
            <TextField
              fullWidth
              id="date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={handleInvoiceDateChange}
              onBlur={formik.handleBlur}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              sx={{ ...commonInputStyle, ml: 5 }}
            />
          </Grid>
          {/* Due Date */}
          <Grid
            item
            sx={{ display: "flex", alignItems: "center", gap: 1, mr: 50 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ ...formLabelStyle, color: "black" }}
            >
              Due Date
            </Typography>
            <TextField
              fullWidth
              id="dueDate"
              name="dueDate"
              type="date"
              value={formik.values.due_date}
              onChange={handleDueDateChange}
              placeholder="dd/MM/yyyy"
              sx={{
                ...commonInputStyle,
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  cursor: "pointer",
                },
                '& input[type="date"]::-webkit-datetime-edit': {
                  color: formik.values.due_date ? "inherit" : "#666",
                },
              }}
              inputProps={{
                min: formik.values.date, // Set minimum date to invoice date
                style: {
                  colorScheme: "light dark",
                },
              }}
            />
          </Grid>
          {/* </Grid> */}
        </Grid>

        {/* Terms - Dropdown with Search */}
        <Grid
          item
          sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1, my: 2 }}
        >
          <Typography variant="subtitle2" sx={{ ...formLabelStyle }}>
            Terms
          </Typography>
          <Select
            id="payment_terms"
            name="payment_terms"
            value={formik.values.payment_terms_label}
            // sx={{ width: "240px", fontSize: "13px", borderRadius: "4px" }}
            size="small"
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
              ml: 5,
              borderRadius: "4px",
              fontSize: "13px",
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
            {/* <ListSubheader
              sx={{
                position: "sticky",
                top: 0,
                bgcolor: "white",
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
                <Search fontSize="small" sx={{ mr: 1, color: "gray", py: 2 }} />
                <TextField
                  fullWidth
                  placeholder="Search..."
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                />
              </Box>
            </ListSubheader> */}

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
                  "&:hover": { bgcolor: "#408dfb", color: "white" },
                  fontSize: "13px",
                }}
              >
                {term}
              </MenuItem>
            ))}

            {/* Sticky Footer */}
            {/* <ListSubheader
              sx={{
                position: "sticky",
                bottom: 0,
                bgcolor: "white",
                zIndex: 1,
                borderTop: "1px solid #ddd",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", px: 4, py: 1 }}>
                <IconButton size="small" sx={{ color: "#408dfb" }}>
                  <Settings />
                </IconButton>

                <Typography variant="body1" sx={{ ml: 1, color: "#408dfb" }}>
                  Configure Terms
                </Typography>
              </Box>
            </ListSubheader> */}
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
                sx={{
                  "& input::placeholder": {
                    fontSize: "13px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "13px",
                    transition: "color 0.2s ease-in-out",
                  },
                  "&:hover .MuiInputBase-input": {
                    color: "white",
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
              }}
            >
              <ProjectSelector
                closeDropdown={handleCloseDropdown}
                formik={formik}
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
                selectedPerson
              />
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
                "&:hover": commonTextareaStyle["&:hover"],
                "&:focus-within": commonTextareaStyle["&:focus"],
              }}
            >
              <TextareaAutosize
                id="subject"
                placeholder="Let your customer know what this invoice is for"
                minRows={2}
                style={{
                  ...commonTextareaInputStyle,
                  minWidth: "320px",
                  maxHeight: "350px",
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <SectionDivider sx={{ my: 4 }} />
        {/* Item Table Section */}
        <Box sx={{}}>
          <ItemTable formik={formik} />
        </Box>
      </Box>
      {/* Terms & Conditions and File Attachments */}
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
              style={{
                ...commonTextareaInputStyle,
                minWidth: "358px",
                maxHeight: "350px",
              }}
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
              Invoice.
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
                variant="outlined"
                sx={{
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
                  marginRight: "8px",
                }}
                onClick={handleSaveAndSend}
                type="button"
                disabled={formik.isSubmitting}
              >
                Save and Send
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
                <Button
                  variant="text"
                  sx={{
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
    </Box>
  );
};
export default InvoiceCreationPage;
