"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  Autocomplete,
  TextField,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Button,
  Popover,
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
  Radio,
  RadioGroup,
  FormControlLabel,
  ListSubheader,
  Alert,
  FormHelperText,
  Divider,
  Popper,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Search, Settings } from "lucide-react";
import CustomerDropDown from "../../../../common/CustomerDropDown";
import Customize from "../../../../common/customizeautogeneration/page";
import BillingAddress from "../../../../common/BillingAddressForm";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import config from "../../../../../services/config";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import InvoiceItemTable from "../../../itemTable";
import { useSnackbar } from "../../../../../components/SnackbarProvider";
import apiService from "../../../../../services/axiosService";
import ProjectSelector from "../../../../common/salespersondropdown/ProjectSelector";
import { invoiceStatusBlock } from "../../../../common/docLock";

// Payment terms the form offers. A document keeps its own terms; a customer's
// default is used only when it is one of these, else "Due On Receipt".
const TERMS_OPTIONS = ["Net 15", "Net 30", "Net 45", "Net 60", "Due On Receipt", "Due end of the month", "Due end of next month", "Custom"];
const termsLabel = (...candidates) => candidates.find((t) => TERMS_OPTIONS.includes(t)) || "Due On Receipt";
const termsDays = (label) => ({ "Net 15": 15, "Net 30": 30, "Net 45": 45, "Net 60": 60 })[label] || 0;


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
    overflowY: "auto" as const,
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
const InvoiceEditPage = (_props?: any) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [addressData, setAddressData] = useState<any>(null);
  const [addressType, setAddressType] = useState<any>("");
  const [address, setAddress] = useState<any>("");
  const [customerData, setCustomerData] = useState<any>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [anchorElSales, setAnchorElSales] = useState<any>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<any>("");
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const organization_id = localStorage.getItem("organization_id");
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const dropdownRef = useRef<any>(null);

  const [invoiceNumber, setInvoiceNumber] = useState<string>("INV-000001");
  const [selectedCustomer, setSelectedCustomer] = useState<any>("");
  // const [selectedSalesperson, setSelectedSalesperson] = useState<any>("");
  const [selectedProject, setSelectedProject] = useState<any>("");
  const [taxType, setTaxType] = useState<string>("tds");
  const [quantity, setQuantity] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0.0);
  const [files, setFiles] = useState<any>([]);
  const [previewFile, setPreviewFile] = useState<any>([]);
  // const [anchorEl, setAnchorEl] = React.useState<any>(null);
  // const [openModal, setOpenModal] = useState<boolean>(false);
  // const [customerData, setCustomerData] = useState<any>(null);
  // const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  // const [openManageSalesModal, setOpenManageSalesModal] = useState<boolean>(false); // New state for modal
  // const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  // const [anchorElSales, setAnchorElSales] = useState<any>(null);
  // const [selectedSalesperson, setSelectedSalesperson] = useState<any>("");
  // const organization_id = localStorage.getItem("organization_id");
  const [invoiceId, setInvoiceId] = useState<any>("");
  // const router = useRouter();
  const searchParams = useSearchParams()!;
  // const invoice_id = searchParams.get("invoice_id");
  const params = useParams()!;
  const invoice_id = params.slug;
  const salesorder_id = searchParams.get("salesorder_id");
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);
  // const { showMessage } = useSnackbar();
  // const dropdownRef = useRef<any>(null);
  const anchorRef = useRef<any>(null);

  // Format date helper function
  //   const formatDate = (date) => {
  //     if (!date) return "";
  //     try {
  //       // Check if date is already in DD/MM/YYYY format
  //       if (date.includes("/")) {
  //         const [day, month, year] = date.split("/");
  //         return `${year}-${month}-${day}`;
  //       }
  //       // If date is in YYYY-MM-DD format
  //       const [year, month, day] = date.split("-");
  //       return `${day}/${month}/${year}`;
  //     } catch (error) {
  //       return "";
  //     }
  //   };

  // Convert date from DD/MM/YYYY to YYYY-MM-DD for input fields
  const formatDate = (date) => {
    if (!date) return "";
    try {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "";
    }
  };
  const convertDateForInput = (formattedDate) => {
    if (!formattedDate) return "";
    try {
      const [day, month, year] = formattedDate.split("/");
      return `${year}-${month}-${day}`;
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    //   fetchInvoiceId();

    // Fetch quotes data if quote_id exists
    if (invoice_id) {
      getInvoiceData(invoice_id);
    }

    // Set initial dates using a consistent format
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    // formik.setFieldValue("date", formattedToday);
    // formik.setFieldValue("date_formatted", formatDate(formattedToday));

    // Set due date to a fixed date for initial render
    // formik.setFieldValue("due_date", formattedToday);
    // formik.setFieldValue("due_date_formatted", formatDate(formattedToday));
  }, []);

  //   useEffect(() => {
  //     if (initialData) {
  //       // If we have customer data in initialData, fetch the full customer details
  //       if (initialData.customer_id) {
  //         fetchCustomerData(initialData.customer_id);
  //       }

  //       // Set initial form values from initialData
  //       const formValues = {
  //         customer_id: initialData.customer_id || "",
  //         customer_name: initialData.customer_name || "",
  //         invoice_number: initialData.invoice_number || "",
  //         date: convertDateForInput(initialData.date_formatted) || new Date().toISOString().split("T")[0],
  //         date_formatted: initialData.date_formatted || formatDate(new Date().toISOString().split("T")[0]),
  //         due_date: convertDateForInput(initialData.due_date_formatted) || "",
  //         due_date_formatted: initialData.due_date_formatted || "",
  //         billing_address: initialData.billing_address || {},
  //         shipping_address: initialData.shipping_address || {},
  //         line_items: initialData.line_items || [
  //           {
  //             item_id: "",
  //             name: "",
  //             quantity: 1,
  //             rate: 0,
  //             discount: 0,
  //             amount: 0,
  //           },
  //         ],
  //         tax_type: initialData.tax_type || "TDS",
  //         discount_percent: initialData.discount_percent || 0,
  //         discount_amount_formatted: initialData.discount_amount_formatted || "",
  //         discount_amount: initialData.discount_amount || "",
  //         tds_option: initialData.tds_option || "",
  //         tds_id: initialData.tds_id || "",
  //         tcs_id: initialData.tcs_id || "",
  //         sub_total: initialData.sub_total || 0,
  //         sub_total_formatted: initialData.sub_total_formatted || "₹0.00",
  //         tax_total: initialData.tax_total || 0,
  //         tax_total_formatted: initialData.tax_total_formatted || "₹0.00",
  //         total_amount: initialData.total || 0,
  //         total_amount_formatted: initialData.total_formatted || "₹0.00",
  //         adjustment: initialData.adjustment || 0,
  //         payment_terms: initialData.payment_terms || 0,
  //         payment_terms_label: initialData.payment_terms_label || "Due On Receipt",
  //         status: initialData.status || "",
  //         status_formatted: initialData.status_formatted || "",
  //         general: [],
  //         place_of_supply: initialData.place_of_supply || "",
  //         gst_treatment: initialData.gst_treatment || "",
  //         gst_no: initialData.gst_no || "",
  //         reference_number: initialData.reference_number || "",
  //         terms: initialData.terms || "",
  //         notes: initialData.notes || "",
  //         salesperson_name: initialData.salesperson_name || "",
  //         tax_percentage: initialData.tax_percentage || 0,
  //       };

  //       formik.setValues(formValues);
  //       setSelectedSalesperson(initialData.salesperson_name || "");
  //     }
  //   }, [initialData]);

  useEffect(() => {
    if (invoiceData && Object.keys(invoiceData).length > 0) {
      // Set customer data from quotes
      const fetchAndSetCustomerData = async () => {
        try {
          const response = await apiService({
            method: "GET",
            url: `/api/v1/contact/${invoiceData.customer_id}`,
            params: {
              organization_id: organization_id,
            },
            file: false,
          });

          const { data } = response.data;
          setCustomerData(data);
          setSelectedCustomer(data);

          console.log(data, "The customer data");

          // Set formik values
          formik.setValues({
            ...formik.values,
            customer_id: invoiceData.customer_id,
            customer_name: invoiceData.customer_name,
            reference_number: invoiceData.reference_number || "",
            invoice_number: invoiceData.invoice_number,
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
              gst_rate: Number(item.gst_rate) || 0,
            })),
            sub_total: invoiceData.sub_total || 0,
            sub_total_formatted: invoiceData.sub_total_formatted || "₹0.00",
            total_amount: invoiceData.total || 0,
            total_amount_formatted: invoiceData.total_formatted || "₹0.00",
            terms: invoiceData.terms || "",
            notes: invoiceData.notes || "",
            subject_content: invoiceData.subject_content || "",
            salesperson_name: invoiceData.salesperson_name || "",
            gst_treatment: data.gst_treatment || "",
            gst_no: data.gst_no || "", 
            place_of_supply: invoiceData.place_of_supply || data.place_of_contact || "",
            payment_terms_label: termsLabel(invoiceData.payment_terms_label, data.payment_terms_label),
            payment_terms: termsDays(termsLabel(invoiceData.payment_terms_label, data.payment_terms_label)),
            discount_amount_formatted:
              invoiceData.discount_amount_formatted || "",
            discount_amount: invoiceData.discount_amount || "",
            tax_type: invoiceData.tax_type || "TDS",
            tds_option: invoiceData.tds_option || "",
            adjustment: invoiceData.adjustment || "",
            discount_percent: parseInt(invoiceData.discount_percent) || 0,
            tax_total: invoiceData.tax_total || "",
            tax_total_formatted: invoiceData.tax_total_formatted || "",
            tax_percentage: invoiceData.tax_percentage || 0,
            documents: invoiceData.documents,
            date: invoiceData.date,
            date_formatted: invoiceData.date_formatted,
            due_date_formatted: invoiceData.due_date_formatted,
            due_date: invoiceData.due_date,
          });
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          showMessage("Failed to fetch customer data", "error");
        }
      };

      fetchAndSetCustomerData();
    }
  }, [invoiceData]);

  const getInvoiceData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/invoices/${id}?organization_id=${organization_id}`,
      });

      console.log("Customer data fetched for invoice:", response);
      // Debug log
      if (response.data && response.data.invoice) {
        setInvoiceData(response.data.invoice);
      }
    } catch (error) {
      console.error("Error fetching invoices data:", error);
      showMessage("Failed to fetch invoice data", "error");
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

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRowClick = (customer) => {
    router.push(`/sales/invoices/${customer.key}`);
  };

  const handleSettingsClick = () => {
    setOpenModal(true);
  };

  const open = Boolean(anchorEl);

  const handleOpenDropdown = (event) => {
    setAnchorElSales(event.currentTarget);
    setOpenDropdown((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };

  const handleCustomerChange = async (data) => {
    setSelectedCustomer(data);
    await formik.setFieldValue("customer_id", data.contact_id);
    await formik.setFieldValue("gst_treatment", data.gst_treatment || "");
    await formik.setFieldValue("gst_no", data.gst_no || "");
    await formik.setFieldValue("currency_id", data.currency_id || "");
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

      // Update formik values with customer data
      // formik.setFieldValue("customer_id", data.contact_id);
      // formik.setFieldValue("gst_treatment", data.gst_treatment || "");
      // formik.setFieldValue("gst_no", data.gst_no || "");
      // formik.setFieldValue("currency_id", data.currency_id || "");
      // formik.setFieldValue("contact_persons", data.contact_persons || []);
      // formik.setFieldValue(
      //   "billing_address_id",
      //   data.billing_address?.address_id || ""
      // );
      // formik.setFieldValue(
      //   "shipping_address_id",
      //   data.shipping_address?.address_id || ""
      // );
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      showMessage("Failed to fetch customer data", "error");
    }
  };
  const handleSalespersonChange = (event) => {
    setSelectedSalesperson((event.target as any).value);
  };

  const handleProjectChange = (event) => {
    setSelectedProject((event.target as any).value);
  };

  const handleTaxTypeChange = (event) => {
    setTaxType((event.target as any).value);
  };
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
        boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
      },
    },
  };
  const commonIconStyle = {
    fontSize: "1.2rem", // 16px
    color: "text.secondary",
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

  const formLabelStyle = {
    fontSize: "0.875rem",
    minWidth: "120px",
    whiteSpace: "nowrap" as const,
    color: "error.main",
  };

  const formLabelBlackStyle = {
    ...formLabelStyle,
    color: "text.primary",
  };

  // Common Button Styles
  const commonButtonStyle = {
    ...formLabelBlackStyle,
    fontFamily: "inherit" as const,
    textTransform: "none" as const,
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

  // Common textarea styles
  const commonTextareaStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontFamily: "inherit" as const,
    fontSize: "0.875rem",
    resize: "vertical" as const,
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
      display: "none" as const,
    },
  };

  const commonTextareaInputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "vertical" as const,
    background: "transparent",
    fontFamily: "inherit" as const,
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
          cursor: "pointer" as const,
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
    display: "flex" as const,
    flexDirection: { xs: "column", md: "row" },
    alignItems: { md: "center" },
    gap: { xs: 0, md: 6 },
  };

  const SectionDivider = ({ sx }: any) => (
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

  const handleClickBA = (_event, value) => {
    if (value === "add") {
      setAddress("add");
      setAddressType("billing");
      setAddressData(null); // Clear existing data for new address
      setAddressModalOpen(true);
    }
  };

  const handleClickSA = (_event, value) => {
    if (value === "add") {
      setAddress("add");
      setAddressType("shipping");
      setAddressData(null); // Clear existing data for new address
      setAddressModalOpen(true);
    }
  };

  const handleCloseAddressModal = () => {
    setAddressModalOpen(false);
    setAddressType("");
    setAddressData(null);
    if (customerData?.contact_id) fetchCustomerData(customerData.contact_id);
  };

  // Handle invoice date change
  const handleInvoiceDateChange = (event) => {
    const date = (event.target as any).value;
    formik.setFieldValue("date", date);
    formik.setFieldValue("date_formatted", formatDate(date));
  };

  // Handle due date change
  const handleDueDateChange = (event) => {
    const date = (event.target as any).value;
    formik.setFieldValue("due_date", date);
    formik.setFieldValue("due_date_formatted", formatDate(date));
  };

  const formik = useFormik<any>({
    initialValues: {
      customer_id: "",
      customer_name: "",
      date: "",
      date_formatted: "",
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
      payment_terms: 0,
      payment_terms_label: "Due On Receipt",
      status: "",
      status_formatted: "",
      general: [] as any[],
      place_of_supply: "",
      gst_treatment: "",
      gst_no: "",
      reference_number: "",
      invoice_number: "",
      terms: "",
      notes: "",
      salesperson_name: "",
      tax_percentage: 0,
      documents: null,
    },
    // validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        // return (console.log(values, "Form values before submission"))
        const errors: any[] = [];

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
          (item) => item.name && Number(item.quantity) > 0 && Number(item.rate) > 0
        );
        if (!hasValidLineItems) {
          errors.push("Please add at least one item");
        }
        values.line_items.forEach((item, i) => {
          if (!item.name && !item.item_id) return;
          const qty = Number(item.quantity);
          if (!Number.isFinite(qty) || qty <= 0) errors.push(`Line ${i + 1} (${item.name}): quantity must be more than 0`);
          else if (qty > 1000000) errors.push(`Line ${i + 1} (${item.name}): quantity can't be more than 10,00,000`);
        });
        if (values.due_date && values.date && dayjs(values.due_date).isBefore(dayjs(values.date), "day")) {
          errors.push("Due date can't be before the invoice date");
        }

        // Validate TCS/TDS option
        if (!values.tax_type) {
          errors.push("Please select TCS/TDS option");
        }

        if (!values.payment_terms_label) {
          errors.push("Please select terms");
        }

        // If there are validation errors, update the general errors and stop submission
        if ((errors.length as any) > 0) {
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
          tds_option: values.tds_option,
          sub_total: parseFloat(values.sub_total) || 0,
          sub_total_formatted: values.sub_total_formatted,
          tax_total: parseFloat(values.tax_total) || 0,
          tax_total_formatted: values.tax_total_formatted,
          total: parseFloat(values.total_amount) || 0,
          total_formatted: values.total_amount_formatted,
          adjustment: parseFloat(values.adjustment) || 0,
          status: values.status,
          discount_percent: values.discount_percent,
          discount_amount_formatted: values.discount_amount_formatted,
          discount_amount: values.discount_amount,
          status_formatted: values.status_formatted,
          place_of_supply: values.place_of_supply,
          gst_treatment: values.gst_treatment,
          tds_id: values.tds_id,
          payment_terms: values.payment_terms,
          payment_terms_label: values.payment_terms_label,
          tcs_id: values.tcs_id,
          tax_percentage: values.tax_percentage,
          documents: values.documents,
          notes: values.notes || "",
          subject_content: values.subject_content || "",
          terms: values.terms || "",
        };

        let url;
        if (invoice_id) {
          url = `/api/v1/invoices?organization_id=${organization_id}&invoice_id=${invoice_id}`;
        } else if (salesorder_id) {
          url = `/api/v1/salesorders/convert-to-invoice?organization_id=${organization_id}&salesorder_id=${salesorder_id}`;
        } else {
          url = `/api/v1/invoices?organization_id=${organization_id}`;
        }

        const response = await apiService({
          method: "PATCH",
          url: url,
          data: requestData,
          customBaseUrl: config.SO_Base_url,
          file: true,
        });

        showMessage(response?.data?.message || "Invoice saved", "success");
        if (invoice_id) {
          router.push(`/sales/invoices/${invoice_id}`);
        } else {
          router.push(`/sales/invoices/${response?.data?.invoice?.invoice_id}`);
        }
      } catch (error) {
        // apiService rejects with the server's JSON body.
        const message = error?.message || "Failed to save the invoice";
        showMessage(message, "error");
        await setFieldValue("general", [message]);
        setOpenAlert(true);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Save keeps the status of an invoice that has been sent or paid: it can't go back to draft.
  const handleSaveAsDraft = () => {
    setOpenAlert(true);
    if (invoiceStatusBlock(invoiceData, "draft")) {
      formik.setFieldValue("status", invoiceData?.status);
      formik.setFieldValue("status_formatted", invoiceData?.status_formatted);
    } else {
      formik.setFieldValue("status", "draft");
      formik.setFieldValue("status_formatted", "Draft");
    }
    formik.handleSubmit();
  };

  // Handle Save and Send
  const handleSaveAndSend = () => {
    setOpenAlert(true);
    formik.setFieldValue("status", "sent");
    formik.setFieldValue("status_formatted", "Sent");
    formik.handleSubmit();
  };

  const handleBack = () => {
    router.push(`/sales/invoices/${invoice_id}`);
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
        overflowX: "hidden" as const,
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
            sx={{ display: "flex" as const, alignItems: "center" as const }}
          >
            <InsertDriveFileOutlinedIcon sx={{ fontSize: "inherit", mr: 1 }} />
            Edit Invoice
          </Typography>
          <IconButton
            aria-label="Close"
            sx={{ color: "red" }}
            onClick={handleBack}
          >
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
              flexWrap: "nowrap" as const,
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
                display: "flex" as const,
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
                    sx: { width: "500px", height: "300px", overflow: "none" as const },
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
              <IconButton aria-label="Choose customer" onClick={handleOpen} sx={searchButtonStyle}>
                <SearchOutlinedIcon fontSize="medium" />
              </IconButton>

              {/* Currency Button - Only Visible if Currency Exists */}
              {customerData?.currency_code && (
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ border: "1px solid #ccc", borderRadius: "4px", px: 2, py: 0.75, fontSize: "13px", fontWeight: 600, color: "#222", backgroundColor: "#f5f5f5" }}>{customerData.currency_code.split("-")[0].trim()}</Box>
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
              <Box sx={{ display: "flex" as const, gap: 4, mt: 2 }}>
                {/* Billing Address */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontSize: "14px",
                      color: "#4c526c",
                      fontWeight: 500,
                      textTransform: "uppercase" as const,
                    }}
                  >
                    Billing Address{" "}
                    {null}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex" as const,
                      justifyContent: "space-between" as const,
                      mb: 2.5,
                    }}
                  >
                    {customerData?.billing_address ? (
                      <Box
                        sx={{
                          display: "flex" as const,
                          flexDirection: "column" as const,
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
                          style={{ color: "#408dfb", cursor: "pointer" as const }}
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
                  sx: { width: "390px", overflow: "none" as const },
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
                      textTransform: "uppercase" as const,
                    }}
                  >
                    Shipping Address{" "}
                    {null}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex" as const,
                      justifyContent: "space-between" as const,
                      mb: 2.5,
                    }}
                  >
                    {customerData?.shipping_address ? (
                      <Box
                        sx={{
                          display: "flex" as const,
                          flexDirection: "column" as const,
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
                          style={{ color: "#408dfb", cursor: "pointer" as const }}
                          onClick={(e) => handleClickSA(e, "add")}
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
                  sx: { width: "390px", overflow: "none" as const },
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
                    textTransform: "uppercase" as const,
                  }}
                >
                  Remarks
                </Typography>
                <Typography variant={"bottom" as any} sx={{ fontSize: "13px" }}>
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
                      cursor: "pointer" as const,
                      fontSize: "13px",
                    }}
                  >
                    {customerData?.gst_treatment}
                  </Typography>
                </Typography>
                {customerData?.gst_no && (
                  <Typography variant={"bottom" as any} color="#4c526c" fontSize={12}>
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
                flexWrap: "nowrap" as const,
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
                  display: "flex" as const,
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
                      (formik.errors.place_of_supply as any)
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
                    renderOption={({ key, ...props }, option) => (
                      <li
                        key={key} {...props}
                        style={{ fontSize: "13px", padding: "6px 12px" }}
                      >
                        [{option.code}] - {option.name}
                      </li>
                    )}
                    sx={{ width: 350 }}
                    PopperComponent={StyledPopper}
                  />

                  {formik.touched.place_of_supply &&
                    (formik.errors.place_of_supply as any) && (
                      <FormHelperText error>
                        {(formik.errors.place_of_supply as any)}
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
          sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" as const }}
        >
          <Grid item sx={formLabelStyle}>
            <Typography variant="subtitle2" sx={formLabelStyle}>
              Invoice#*
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex" as const, width: "320px", flexShrink: 0 }}>
            <TextField
              fullWidth
              id="invoice_number"
              name="invoice_number"
              value={formik.values.invoice_number || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
                    
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                position: "absolute" as const,
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Customize invoiceeId={invoiceId} />{" "}
              {/* Display Customize component inside the modal */}
            </Box>
          </Modal>
          <Modal open={addressModalOpen} onClose={handleCloseAddressModal}>
            <Box
              sx={{
                position: "absolute" as const,
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
        </Grid>

        {/* ordernumber */}
        {formik.values.reference_number && (
          <Grid
            container
            sx={{ px: 2, pt: 2, ...formRowStyle, flexWrap: "nowrap" as const }}
          >
            <Grid item sx={formLabelBlackStyle}>
              <Typography variant="subtitle2" sx={formLabelBlackStyle}>
                Order Number
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex" as const, width: "320px", flexShrink: 0 }}>
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
                    (formik.errors.reference_number as any)
                )}
                helperText={
                  formik.touched.reference_number &&
                  (formik.errors.reference_number as any)
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
        <Grid container sx={{ px: 2, pt: 2, display: "flex" as const }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex" as const,
              flexWrap: "nowrap" as const,
              justifyContent: "space-between" as const,
              gap: 2,
            }}
          >
            {/* Invoice Date */}
            <Grid item sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1 }}>
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
                error={formik.touched.date && Boolean((formik.errors.date as any))}
                helperText={formik.touched.date && (formik.errors.date as any)}
                sx={{ ...commonInputStyle, width: "120px", ml: 5 }}
              />
            </Grid>
            {/* Due Date */}
            <Grid
              item
              sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1, mr: 50 }}
            >
              <Typography
                variant="subtitle2"
                sx={{ ...formLabelStyle, color: "black" }}
              >
                Due Date
              </Typography>
              <TextField
                fullWidth
                id="due_date"
                name="due_date"
                type="date"
                value={formik.values.due_date}
                onChange={handleDueDateChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.due_date && Boolean((formik.errors.due_date as any))
                }
                helperText={formik.touched.due_date && (formik.errors.due_date as any)}
                sx={{ ...commonInputStyle, width: "120px" }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Terms - Dropdown with Search */}
        <Grid
          item
          sx={{ ml: 2, display: "flex" as const, alignItems: "center" as const, gap: 1, my: 2 }}
        >
          <Typography variant="subtitle2" sx={{ ...formLabelStyle }}>
            Terms
          </Typography>
          <Select
            id="payment_terms"
            name="payment_terms"
            value={formik.values.payment_terms_label}
            onChange={(e) => {
              // Store the display value in payment_terms

              // Set the payment_terms_label as well
              formik.setFieldValue("payment_terms_label", (e.target as any).value);

              // Also set the numeric value for payment_terms_id
              let numericValue = 0;
              switch ((e.target as any).value) {
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
              Boolean((formik.errors.payment_terms as any))
            }
            displayEmpty
            sx={{ ...commonInputStyle, width: "180px", ml: 5 }}
            renderValue={(selected: any) => selected || "Search"}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 250,
                  overflowY: "auto" as const,
                },
              },
            }}
          >
            {/* Sticky Search Box */}
            <ListSubheader
              sx={{
                position: "sticky" as const,
                top: 0,
                bgcolor: "white",
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, px: 2 }}>
                <Search {...({} as any)} fontSize="small" sx={{ mr: 1, color: "gray", py: 2 }} />
                <TextField
                  fullWidth
                  placeholder="Search..."
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
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
                position: "sticky" as const,
                bottom: 0,
                bgcolor: "white",
                zIndex: 1,
                borderTop: "1px solid #ddd",
              }}
            >
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, px: 4, py: 1 }}>
                <IconButton size="small" sx={{ color: "#408dfb" }}>
                  <Settings />
                </IconButton>

                <Typography variant="body1" sx={{ ml: 1, color: "#408dfb" }}>
                  Configure Terms
                </Typography>
              </Box>
            </ListSubheader>
          </Select>
        </Grid>

        <SectionDivider sx={{ my: 4 }} />

        <Grid container sx={{ px: 2, flexWrap: "nowrap" as const }}>
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
              display: "flex" as const,
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
                overflowY: "auto" as const,
              }}
            >
              <ProjectSelector
                closeDropdown={handleCloseDropdown}
                formik={formik}
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
                display: "flex" as const,
                alignItems: "center" as const,
                pr: 6.19,
                gap: 0,
                mb: { xs: 1, md: 0 },
                position: "relative" as const,
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
              <FontAwesomeIcon icon={faInfoCircle} {...({ sx: commonIconStyle } as any)} />
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
                name="subject_content"
                value={formik.values.subject_content || ""}
                onChange={formik.handleChange}
                placeholder="Let your customer know what this invoice is for"
                minRows={1}
                style={{
                  ...commonTextareaInputStyle,
                  minWidth: "358px",
                  maxHeight: "350px",
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <SectionDivider sx={{ my: 4 }} />
        {/* Item Table Section */}
        <Box sx={{ py: 4 }}>
          <InvoiceItemTable formik={formik} />
        </Box>
      </Box>

      {/* Terms & Conditions and File Attachments */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" as const }}>
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
              aria-invalid={formik.touched.terms && Boolean((formik.errors.terms as any))}
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
          <Box sx={{ display: "flex" as const, flexDirection: "column" as const, gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<FontAwesomeIcon icon={faUpload} />}
              sx={{
                alignSelf: "flex-start" as const,
                textTransform: "none" as const,
                borderStyle: "dashed" as const,
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
                      src={previewFile as any}
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
                    display: "flex" as const,
                    alignItems: "center" as const,
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
            {typeof formik.values.documents === "string" && /\.(png|jpe?g|gif|webp)$/i.test(formik.values.documents) && (
              <Box sx={{ mb: 1 }}>
                <img
                  src={`${config.SO_Base_url}uploads/invoice/${formik.values.documents}`}
                  alt="Preview"
                  style={{
                    width: "150px",
                    height: "auto",
                    marginBottom: "8px",
                  }}
                />
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
            sx={{ fontWeight: "medium" as const }}
          >
            Want to get paid faster?
          </Typography>
          <Box component="span" sx={{ display: "inline-flex" as const, ml: 1 }}>
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
              sx={{ cursor: "pointer" as const }}
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
            position: "sticky" as const,
            top: 0,
            pb: 14,
            borderTop: "1px solid #ddd",
            // boxShadow: "0px -4px 2px rgba(59, 59, 59, 0.03)",
            bgcolor: "white",
            alignItems: "center" as const,
          }}
        >
          <Grid container sx={{ ml: 2, mr: 2 }}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.875rem" }}
            >
              <span style={{ fontWeight: "bold" as const, fontSize: "0.875rem" }}>
                Additional Fields:{" "}
              </span>
              Start adding custom fields for your invoice by going to
              <span
                style={{ fontWeight: "700" as const, fontSize: "0.875rem" }}
              ></span>{" "}
              Settings{" "}
              <span style={{ fontWeight: "700" as const, fontSize: "0.875rem" }}>➔</span>{" "}
              Sales{" "}
              <span style={{ fontWeight: "700" as const, fontSize: "0.875rem" }}>➔</span>{" "}
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
            position: "fixed" as const,
            bottom: 0,
            zIndex: 1000,
            boxShadow: "0px -4px 5px rgba(0, 0, 0, 0.06)",
            bgcolor: "white",
            alignItems: "center" as const,
            padding: "0 16px",
            ml: -3,
            display: "flex" as const,
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
                Save
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
                
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
export default InvoiceEditPage;
