"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import apiService from "../../../../services/axiosService"; // Import your custom API service
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
  DialogContent,
  Popper,
  Modal,
  DialogActions,
  ListItemSecondaryAction,
} from "@mui/material";
// import { useFormik } from "formik";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NightlightIcon from "@mui/icons-material/Nightlight";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ for App Router
import config from "../../../../services/config";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import Image from "next/image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useHotkeys } from "react-hotkeys-hook";
import VendorSelect from "../../expense/newexpense/recordExpense/VendorSelect";
import TableExpenses from "../../expense/newexpense/recordExpense/TableExpenses";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// Custom Styles
const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const StyledTextField = styled("input")(({ error }) => ({
  height: "35px",
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
  borderRadius: "7px",
  fontSize: "14px",
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

  /* Add these lines directly to the component styling */
  "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  /* For Firefox */
  "-moz-appearance": "textfield",
}));

const commonTextareaStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "7px",
  padding: "6px 12px",
  fontFamily: "inherit",
  fontSize: "13px",
  resize: "vertical",
  minHeight: "60px",
  maxHeight: "120px",
  lineHeight: "1.6",
  width: "100%",
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
};

const StyledTextarea = styled("textarea")({
  ...commonTextareaStyle,
});

const formLabelStyle = {
  fontSize: "13px",
  minWidth: "160px",
  whiteSpace: "nowrap",
  color: "#d62134",
};

const StyledSelect = styled(Select)({
  height: "35px",
  width: "100%",
  "& .MuiSelect-select": {
    padding: "6px 12px",
    fontSize: "14px", // 13px
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "7px", // Changed from default to 7px
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    border: ".1px solid #408dfb",
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
});
// Payment mode options
const paymentModes = [
  { label: "Week", value: 1, frequency: "week" },
  { label: "2 Weeks", value: 2, frequency: "week" },
  { label: "Month", value: 1, frequency: "month" },
  { label: "2 Months", value: 2, frequency: "month" },
  { label: "3 Months", value: 3, frequency: "month" },
  { label: "6 Months", value: 6, frequency: "month" },
  { label: "Year", value: 1, frequency: "year" },
  { label: "2 Years", value: 2, frequency: "year" },
  { label: "3 Years", value: 3, frequency: "year" },
  { label: "Custom", value: null, frequency: "custom" },
];
const RecurringExpense = () => {
  const [expenseAccSearchTerm, setExpenseAccSearchTerm] = useState("");
  const [expenseAccAnchorEl, setExpenseAccAnchorEl] = useState(null);
  const expenseAccOpen = Boolean(expenseAccAnchorEl);
  const [paidThrAccAnchorEl, setPaidThrAccAnchorEl] = useState(null);
  const paidThrAccOpen = Boolean(paidThrAccAnchorEl);
  const [currenyAnchorEl, setCurrencyAnchorEl] = useState(null);
  const currencyOpen = Boolean(currenyAnchorEl);
  const { showMessage } = useSnackbar();
  const [previewFile, setPreviewFile] = useState(null);
  const [files, setFiles] = useState([]);
  const searchParams = useSearchParams();
  const recurringexpense_id = searchParams.get("recurringexpense_id");
  const router = useRouter();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isBillable, setIsBillable] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [vendors, setVendors] = useState([]);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const dateRef = useRef();
  const [paymentTermsSearch, setPaymentTermsSearch] = useState("");
  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState(false);
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(null);

  // Filter customers based on customer search query
  const filteredCustomers = customers.filter((customer) =>
    customer.contact_name
      .toLowerCase()
      .includes(customerSearchQuery.toLowerCase())
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Filter payment modes based on search
  const filteredPaymentModes = paymentModes.filter((mode) =>
    (mode.label || "").toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );

  // const handleDropdownToggle = () => {
  //   setProjectDropdownOpen((prev) => !prev);
  // };

  // const handleProjectSelection = (project) => {
  //   setSelectedProject(project);
  //   setProjectDropdownOpen(false);
  // };
  // Fetch customers from API

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/customers?organization_id=${organization_id}`,
        });
        // console.log(response.data, "customer data");
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
  }, [organization_id]);
  // Filter vendors based on vendor search query
  const filteredVendors = vendors.filter((vendor) =>
    vendor.contact_name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  );

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/vendors?organization_id=${organization_id}`,
        });
        // console.log(response.data, "vendor data");
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
  }, [organization_id]);

  // Account options by category
  const expenseAccCategories = [
    {
      category: "Cost Of Goods Sold",
      options: [
        "Cost of Goods Sold",
        "Job Costing",
        "Labor",
        "Materials",
        "Subcontractor",
      ],
    },
    {
      category: "Expense",
      options: [
        "Advertising And Marketing",
        "Automobile Expense",
        "Bad Debt",
        "Bank Fees and Charges",
        "Consultant Expense",
        "Depreciation And Amortisation",
        "Depreciation Expense",
        "IT and Internet Expenses",
        "Janitorial Expense",
        "Lodging",
        "Meals and Entertainment",
        "Merchandise",
        "Office Supplies",
        "Other Expenses",
        "Postage",
        "Printing and Stationery",
        "Purchase Discounts",
        "Raw Materials And Consumables",
        "Rent Expense",
        "Repairs and Maintenance",
        "Salaries and Employee Wages",
        "Telephone Expense",
        "Transportation Expense",
        "Travel Expense",
      ],
    },
    {
      category: "Long Term Liability",
      options: ["Construction Loans", "Mortgages"],
    },
    {
      category: "Other Current Liability",
      options: [
        "Employee Reimbursements",
        "Tax Payable",
        "TCS Payable",
        "TDS Payable",
      ],
    },
    {
      category: "Fixed Asset",
      options: ["Furniture and Equipment"],
    },
    {
      category: "Other Current Asset",
      options: [
        "Advance Tax",
        "Employee Advance",
        "Prepaid Expenses",
        "TCS Receivable",
        "TDS Receivable",
      ],
    },
  ];

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

  const [gstin, setGstin] = useState("");
  const [gstTreatment, setGstTreatment] = useState(
    "Registered Business - Regular"
  );
  const [isPermanent, setIsPermanent] = useState(true);
  // Options array with labels and descriptions
  const options = [
    {
      label: "Registered Business - Regular",
      desc: "Business registered under GST",
    },
    {
      label: "Registered Business - Composition",
      desc: "Business under composition scheme",
    },
    {
      label: "Unregistered Business",
      desc: "Business not registered under GST",
    },
    {
      label: "Consumer",
      desc: "Individual consumer or end user",
    },
    {
      label: "Overseas",
      desc: "Business or individual located outside India",
    },
    {
      label: "Special Economic Zone",
      desc: "Business operating in SEZ",
    },
    {
      label: "Deemed Export",
      desc: "Supplies to export oriented units",
    },
    {
      label: "Non-GST Supply",
      desc: "Transactions with supplies that do not attract GST",
    },
    {
      label: "Out Of Scope",
      desc: "Transactions that do not come under the ambit of GST",
    },
    {
      label: "Tax Deductor",
      desc: "Departments of the State/Central government, governmental agencies or local authorities",
    },
    {
      label: "SEZ Developer",
      desc: "A person/organisation who owns at least 26% of the equity in creating business units in a Special Economic Zone (SEZ)",
    },
  ];

  const handleGstinChange = (event) => {
    setGstin(event.target.value);
    formik.setFieldValue("gst_no", event.target.value);
  };

  const handleGstTreatmentChange = (event) => {
    setGstTreatment(event.target.value);
    formik.setFieldValue("gst_treatment", event.target.value);
    if (
      event.target.value === "Out Of Scope" ||
      event.target.value === "Non-GST Supply"
    ) {
      formik.setFieldValue("expense_tax_percent", "");
      formik.setFieldValue("gst_no", "");
      formik.setFieldValue("expense_tax_amount", "");
      formik.setFieldValue("tot_amount_with_tax", formik.values.tot_amount);
      formik.setFieldValue("inclusive_exclusive", "");
    } else if (event.target.value === "Registered Business - Composition") {
      formik.setFieldValue("expense_tax_percent", "");
      formik.setFieldValue("expense_tax_amount", "");
      formik.setFieldValue("tot_amount_with_tax", formik.values.tot_amount);
      formik.setFieldValue("inclusive_exclusive", "");
    } else if (
      event.target.value === "Unregistered Business" ||
      event.target.value === "Consumer"
    ) {
      formik.setFieldValue("gst_no", "");
    } else {
      formik.setFieldValue("inclusive_exclusive", "exclusive");
    }
  };

  const handlePermanentChange = (event) => {
    setIsPermanent(event.target.checked);
  };

  const handleGetTaxpayerDetails = () => {
    console.log("Getting taxpayer details for GSTIN:", gstin);
  };

  const handleUpdate = () => {
    onUpdate &&
      onUpdate({
        gst_treatment: gstTreatment,
        gst_no: gstin,
      });
    onClose();
  };

  const paidThroughAccCategory = [
    {
      category: "Cash",
      options: ["Petty Cash", "Undeposited Funds"],
    },
    {
      category: "Other Current Asset",
      options: [
        "Advance Tax",
        "Employee Advance",
        "Prepaid Expenses",
        "TCS Receivable",
        "TDS Receivable",
      ],
    },
    {
      category: "Fixed Asset",
      options: ["Furniture and Equipment"],
    },
    {
      category: "Other Current Liability",
      options: ["Employee Reimbursements", "TCS Payable", "TDS Payable"],
    },
    {
      category: "Long Term Liability",
      options: ["Construction Loans", "Mortgages"],
    },
    {
      category: "Equity",
      options: [
        "Capital Stock",
        "Distributions",
        "Dividends Paid",
        "Drawings",
        "Investments",
        "Opening Balance Offset",
        "Owner's Equity",
      ],
    },
  ];

  const currency = [
    {
      id: "AED",
      name: "UAE Dirham",
    },
    {
      id: "AUD",
      name: "Australian Dollar",
    },
    {
      id: "BND",
      name: "Brunei Dollar",
    },
    {
      id: "CAD",
      name: "Canadian Dollar",
    },
    {
      id: "CNY",
      name: "Yuan Renminbi",
    },
    {
      id: "EUR",
      name: "Euro",
    },
    {
      id: "GBP",
      name: "Pound Sterling",
    },
    {
      id: "INR",
      name: "Indian Rupee",
    },
    {
      id: "JPY",
      name: "Japanese Yen",
    },
    {
      id: "SAR",
      name: "Saudi Riyal",
    },
    {
      id: "USD",
      name: "United States Dollar",
    },
    {
      id: "ZAR",
      name: "South African Rand",
    },
  ];

  // Filter options based on search term
  const filteredExpenseAccOptions = expenseAccCategories
    .map((group) => ({
      category: group.category,
      options: group.options.filter((option) =>
        option.toLowerCase().includes(expenseAccSearchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.options.length > 0);

  // Validation schema
  const validationSchema = Yup.object().shape({
    profile_name: Yup.string().required("Name is required"),
    // repeat_every: Yup.string().required("Repeat Every is required"),
    expense_account: Yup.string().required("Expense account is required"),
    tot_amount: Yup.number().required("Amount is required"),
    // account_id: Yup.string().required("Expense Account id Every is required"),
    paid_through_account_id: Yup.string().required(
      "Paid through account is required"
    ),
    gst_treatment: Yup.string().required("GST treatment is required"),
    // HSN code validation (if entered, must be 4, 6, or 8 digits)
    // hsn_code: Yup.string()
    //   .matches(/^\d{4}(\d{2})?(\d{2})?$/, "HSN code must be 4, 6, or 8 digits")
    //   .notRequired(), // Not required but must match pattern if provided

    // // SAC code validation (must be 6 digits and start with '99')
    // sac_code: Yup.string()
    //   .matches(/^99\d{4}$/, "SAC code must be 6 digits and start with '99'")
    //   .notRequired(), // Not required but must match pattern if provided

    expense_tax_percent: Yup.string().when("gst_treatment", {
      is: (value) =>
        ![
          "Registered Business - Composition",
          "Non-GST Supply",
          "Out Of Scope",
        ].includes(value),
      then: (schema) => schema.required("Tax percentage is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    customer_id: Yup.string().required("Customer is required"),
    // Conditional validation for gst_no
    gst_no: Yup.string().when("gst_treatment", {
      is: (value) =>
        ![
          "Unregistered Business",
          "Non-GST Supply",
          "Out Of Scope",
          "Consumer",
        ].includes(value),
      then: (schema) =>
        schema
          .required("GST number is required")
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid GST Number format"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      start_date: today,
      end_date: "",
      next_expense_date: "",
      repeat_every: "", // numeric value (e.g., 2)
      recurrence_frequency: "", // time unit (e.g., "months")
      recurrence_frequency_formatted: "", // e.g., "Every 2 Months"
      profile_name: "",
      account_id: "",
      amount: "",
      tot_amount: "",
      tot_amount_with_tax: "",
      base_amount: "",
      paid_through_account_id: "",
      customer_id: "",
      vendor_id: "",
      vendor_Name: "",
      customer_Name: "",
      invoice_number: "",
      currency_id: "INR",
      currency_name: "Indian Rupee",
      form_status: 0,
      status: "active", // 0 - Nothing, 1 - UnBilled, 2 - Invoiced , 3 - Reimbursed
      type: "expense",
      is_Billable: false,
      document: null,
      destination_of_supply: "",
      source_of_supply: "",
      expense_type: "",
      inclusive_exclusive: "exclusive",
      hsn_code: "",
      sac_code: "",
      gst_treatment: "Registered Business - Regular",
      gst_no: "",
      reverse_charge: false,
      expense_tax_percent: "",
      expense_tax_amount: "",
      never_expires: false, // Add this to initial values if not already present
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      const { resetForm, setSubmitting } = formikHelpers;
      const shouldReload = formikHelpers.shouldReload ?? false;

      console.log("Form Values:", JSON.stringify(values, null, 2));

      try {
        const organization_id = localStorage.getItem("organization_id");
        // return;
        let url = recurringexpense_id
          ? `/api/v1/recurring-expense/update-recurring-expense?org_id=${organization_id}&recurring_expense_id=${recurringexpense_id}`
          : `/api/v1/recurring-expense/create-recurring-expense?org_id=${organization_id}`;
        let params = {
          method: "POST",
          url: url,
          customBaseUrl: config.PO_Base_url,
          data: values,
        };
        const response = await apiService(params);

        console.log("API Response:", response.data);

        showMessage(
          `Form ${recurringexpense_id ? "updated" : "submitted"} successfully!`,
          "success"
        );
        resetForm();

        recurringexpense_id
          ? router.push(`/purchase/recurringexpenses/${recurringexpense_id}`)
          : router.push(
              "/purchase/recurringexpenses/" +
                response.data.data.recurring_expense_id
            );
      } catch (error) {
        console.error("Error submitting form:", error);
        showMessage("Failed to submit the form. Please try again.", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });
  useHotkeys(
    "alt+s",
    (event) => {
      event.preventDefault(); // Prevent default browser behavior
      formik.handleSubmit(false);
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"], // Enable even in form elements
      keyup: false, // Trigger on keydown, not keyup
    }
  );

  useHotkeys(
    "alt+n",
    (event) => {
      event.preventDefault();
      formik.handleSubmit(true);
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );
  const [nextRecurringDate, setNextRecurringDate] = useState("");
  const calculateNextDate = (
    startDateStr,
    repeatEvery,
    recurrenceFrequency
  ) => {
    if (!startDateStr || !repeatEvery || !recurrenceFrequency) return "";

    const date = new Date(startDateStr);
    const repeat = parseInt(repeatEvery, 10);
    const freq = recurrenceFrequency.toLowerCase();

    // Clone date to avoid mutating input
    const newDate = new Date(date.getTime());

    switch (freq) {
      case "week":
      case "weeks":
        newDate.setDate(newDate.getDate() + 7 * repeat);
        break;

      case "month":
      case "months":
        const originalDay = newDate.getDate();
        newDate.setMonth(newDate.getMonth() + repeat);

        // Fix edge case: if month rolled over (e.g. Jan 31 + 1 month = March 2)
        if (newDate.getDate() < originalDay) {
          newDate.setDate(0); // Set to last day of previous month
        }
        break;

      case "year":
      case "years":
        const originalMonth = newDate.getMonth();
        newDate.setFullYear(newDate.getFullYear() + repeat);

        // Handle Feb 29 for leap years
        if (
          originalMonth === 1 &&
          date.getDate() === 29 &&
          newDate.getMonth() === 1 &&
          newDate.getDate() < 29
        ) {
          newDate.setDate(28);
        }
        break;

      default:
        return ""; // Custom or invalid
    }

    // Return formatted date: DD/MM/YYYY
    return newDate.toLocaleDateString("en-GB");
  };

  useEffect(() => {
    if (
      // formik.values.never_expires &&
      formik.values.start_date &&
      formik.values.recurrence_frequency &&
      formik.values.repeat_every
    ) {
      const date = calculateNextDate(
        formik.values.start_date,
        formik.values.repeat_every,
        formik.values.recurrence_frequency
      );
      setNextRecurringDate(date);
      formik.setFieldValue("next_expense_date", date);
    } else {
      setNextRecurringDate("");
      formik.setFieldValue("next_expense_date", "");
    }
  }, [
    // formik.values.never_expires,
    formik.values.start_date,
    formik.values.repeat_every,
    formik.values.recurrence_frequency,
  ]);

  const mode1 = paymentModes[1]; // example: { label: "2 Weeks", value: 2, frequency: "weeks" }

  const nextDate = calculateNextDate(
    "2025-05-17",
    mode1.value,
    mode1.frequency
  );

  const singlePageView = () => {
    formik.setFieldValue("tot_amount", amount);
    formik.setFieldValue("form_status", 0);

    const entered_amount = parseFloat(newLineItem.amount);
    const match = formik.values.expense_tax_percent.match(/\[(\d+)%\]/);
    const entered_percent = match ? parseFloat(match[1]) : 0;
    const inclusive_exclusive = formik.values.inclusive_exclusive;

    if (entered_amount && (entered_percent || entered_percent === 0)) {
      console.log("Running CalculateTax function");
      CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
    } else {
      console.log("the required data is not available for calculate task");
    }
  };
  const [showPopup, setShowPopup] = useState(false);
  // Custom dropdown handlers
  const handleExpenseAccClick = (event) => {
    setExpenseAccAnchorEl(event.currentTarget);
  };

  const handleExpenseAccClose = () => {
    setExpenseAccAnchorEl(null);
    setExpenseAccSearchTerm("");
  };

  const handleExpenseAccSelect = (option) => {
    formik.setFieldValue("expense_account", option);
    handleExpenseAccClose();
  };

  const handleExpenseAccSearch = (e) => {
    setExpenseAccSearchTerm(e.target.value);
  };

  const handlePaidThroughAccClick = (event) => {
    setPaidThrAccAnchorEl(event.currentTarget);
  };

  const handlePaidThroughAccClose = () => {
    setPaidThrAccAnchorEl(null);
  };

  const handlePaidThroughAccSelect = (option) => {
    formik.setFieldValue("paid_through_account_id", option);
    handlePaidThroughAccClose();
  };

  const handleCurrencyClick = (event) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  const handleCurrencyClose = () => {
    setCurrencyAnchorEl(null);
  };

  const handleCurrencySelect = (option) => {
    formik.setFieldValue("currency_id", option.id);
    formik.setFieldValue("currency_name", option.name);
    handleCurrencyClose();
  };

  const amountChange = (e) => {
    const raw = e.target.value;
    // allow only up to 2 decimals
    if (!/^\d*\.?\d{0,2}$/.test(raw) || raw.length > 15) return;

    formik.setFieldValue("tot_amount", raw);

    const entered_amount = parseFloat(value);
    const amt = parseFloat(raw) || 0;
    const match = formik.values.expense_tax_percent?.match(/\[(\d+)%\]/);
    const pct = match ? parseFloat(match[1]) : 0;
    const inclusive_exclusive = formik.values.inclusive_exclusive;

    CalculateTax(amt, pct, mode);
    if (entered_amount && (entered_percent || entered_percent === 0)) {
      console.log("Running CalculateTax function");
      CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
    } else {
      console.log("the required data is not available for calculate task");
    }
  };

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
    formik.setFieldValue("document", selectedFile); // Update Formik field
  };

  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
  };

  useEffect(() => {
    console.log(recurringexpense_id, "----------recurringexpense_id");
    if (recurringexpense_id) {
      fetchExpenseData(recurringexpense_id);
    }
  }, [recurringexpense_id]);
  const fetchExpenseData = async (REG_EX_ID) => {
    try {
      let org_id = localStorage.getItem("organization_id");
      const response = await apiService({
        method: "GET",
        url: `/api/v1/recurring-expense/get-individual-recurring-expense?org_id=${org_id}&recurring_expense_id=${REG_EX_ID}`,
        customBaseUrl: config.PO_Base_url,
      });

      let output = response.data.data;
      if (response.statusCode == 200) {
        console.log(output, "edit expense Details");

        // formik.setFieldValue("form_status", output.form_status);
        formik.setFieldValue(
          "start_date",
          new Date(output.start_date).toISOString().split("T")[0]
        );
        formik.setFieldValue(
          "end_date",
          output.end_date
            ? new Date(output.end_date).toISOString().split("T")[0]
            : ""
        );
        // formik.setFieldValue(
        //   "next_expense_date",
        //   new Date(output.next_expense_date).toISOString().split("T")[0]
        // );
        formik.setFieldValue("tot_amount", output.total);
        formik.setFieldValue("expense_tax_percent", output.expense_tax_percent);
        formik.setFieldValue("expense_tax_amount", output.expense_tax_amount);
        // formik.setFieldValue("tot_amount", tot_amount);
        formik.setFieldValue(
          "paid_through_account_id",
          output.paid_through_account_name
        );
        formik.setFieldValue("vendor_id", output.vendor_id._id);
        formik.setFieldValue("vendor_Name", output.vendor_id.contact_name);
        formik.setFieldValue("repeat_every", output.repeat_every);
        formik.setFieldValue(
          "recurrence_frequency",
          output.recurrence_frequency
        );
        formik.setFieldValue(
          "recurrence_frequency_formatted",
          output.recurrence_frequency_formatted
        );

        formik.setFieldValue("profile_name", output.profile_name);
        formik.setFieldValue("hsn_code", output.hsn_code);
        formik.setFieldValue("sac_code", output.sac_code);
        formik.setFieldValue("gst_treatment", output.gst_treatment);
        formik.setFieldValue("gst_no", output.gst_no);
        formik.setFieldValue("description", output.description);
        formik.setFieldValue("customer_id", output.customer_id._id);
        setSelectedVendor(output.vendor_id);
        setSelectedCustomer(output.customer_id);
        // setPaymentTermsSearch(output.recurrence_frequency_formatted);
        formik.setFieldValue("customer_Name", output.customer_id.contact_name);
        formik.setFieldValue("invoice_number", output.invoice_number);
        // formik.setFieldValue("amount", output.total);
        formik.setFieldValue("expense_account", output.account_name);
        formik.setFieldValue("source_of_supply", output.source_of_supply);
        formik.setFieldValue(
          "destination_of_supply",
          output.destination_of_supply
        );
      }
    } catch (error) {
      showMessage("Error fetching expense data for Edit Bill.", "error");
    }
  };

  // const TaxEntered = (e) => {
  //   formik.handleChange(e);
  //   formik.setFieldValue("expense_tax_percent", e.target.value);

  //   const percent = e.target.value.match(/\[(\d+)%\]/);
  //   const entered_percent = percent ? parseFloat(percent[1]) : 0;
  //   const entered_amount = parseFloat(formik.values.tot_amount) || 0;
  //   const inclusive_exclusive = formik.values.inclusive_exclusive;

  //   if (entered_amount && (entered_percent || entered_percent === 0)) {
  //     console.log("Running CalculateTax function");
  //     CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
  //   } else {
  //     console.log("the required data is not available for calculate task");
  //   }
  // };
  const TaxEntered = (e) => {
    const val = e.target.value;
    formik.setFieldValue("expense_tax_percent", e.target.value);

    const percent = e.target.value.match(/\[(\d+)%\]/);
    // const amt = parseFloat(formik.values.amount) || 0;
    // const match = val.match(/\[(\d+)%\]/);
    // const pct = match ? parseFloat(match[1]) : 0;
    const entered_percent = percent ? parseFloat(percent[1]) : 0;
    const entered_amount = parseFloat(formik.values.tot_amount) || 0;
    const inclusive_exclusive = formik.values.inclusive_exclusive;

    // CalculateTax(amt, pct, mode);
    if (entered_amount && (entered_percent || entered_percent === 0)) {
      console.log("Running CalculateTax function");
      CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
    } else {
      console.log("the required data is not available for calculate task");
    }
  };

  const CalculateTax = (
    entered_amount,
    entered_percent,
    inclusive_exclusive
  ) => {
    if (entered_amount && (entered_percent || entered_percent === 0)) {
      if (inclusive_exclusive === "inclusive") {
        // Inclusive: tot_amount already includes tax
        const baseAmount = (
          entered_amount /
          (1 + entered_percent / 100)
        ).toFixed(2);
        const taxAmount = (entered_amount - baseAmount).toFixed(2);

        formik.setFieldValue("base_amount", baseAmount);
        formik.setFieldValue("expense_tax_amount", taxAmount);
        formik.setFieldValue("tot_amount_with_tax", entered_amount.toFixed(2));

        console.log("Inclusive Tax Calc:");
        console.log("Base Amount:", baseAmount);
        console.log("Tax Amount:", taxAmount);
      }

      if (inclusive_exclusive === "exclusive") {
        // Exclusive: tot_amount doesn't include tax yet
        const taxAmount = ((entered_percent / 100) * entered_amount).toFixed(2);
        const totalWithTax = (entered_amount + parseFloat(taxAmount)).toFixed(
          2
        );

        formik.setFieldValue("expense_tax_amount", taxAmount);
        formik.setFieldValue("tot_amount_with_tax", totalWithTax);

        console.log("Exclusive Tax Calc:");
        console.log("Tax Amount:", taxAmount);
        console.log("Total with Tax:", totalWithTax);
      }
    }
  };

  const handleInclusiveExclusiveChange = (e) => {
    const { value } = e.target;

    // Update Formik value
    formik.setFieldValue("inclusive_exclusive", value);

    console.log("Selected option:", value);

    const entered_amount = parseFloat(formik.values.tot_amount) || 0;
    const match = formik.values.expense_tax_percent.match(/\[(\d+)%\]/);
    const entered_percent = match ? parseFloat(match[1]) : 0;
    const inclusive_exclusive = value; // Use the selected value

    if (entered_amount && (entered_percent || entered_percent === 0)) {
      console.log("Running CalculateTax function");
      CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
    } else {
      console.log("the required data is not available for calculate task");
    }
  };
  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format: yyyy-mm-dd
  }, []);
  return (
    <Box sx={{ pl: 2.5 }}>
      {/* {recurringexpense_id && (
        <Box
          sx={{
            width: "100%",
            fontSize: "22px",
            fontWeight: "400",
            py: 2,
          }}
        >
          Edit Recurring Expense
        </Box>
      )} */}
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "left",
          // px: 3,
          py: 2,
        }}
      >
        {/* <> */}
        {recurringexpense_id ? (
          <>
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
                <ReceiptLongIcon />
              </Box>
              Edit Recurring Expense
            </Typography>
          </>
        ) : (
          <>
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
                <ReceiptLongIcon />
              </Box>
              New Recurring Expense
            </Typography>
          </>
        )}
        {/* </> */}
        {/* <Typography
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
            <ReceiptLongIcon />
          </Box>
          
          New Recurring Expense
        </Typography> */}
        <IconButton
          aria-label="close"
          size="small"
          onClick={() => {
            router.push(`/purchase/recurringexpenses`);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ width: "100%", mb: 10, mt: recurringexpense_id ? 0 : 2 }}>
        <Box sx={{ position: "relative", py: 2, pt: 1 }}>
          <Box>
            {/* {formik.values.form_status === 0 && ( */}
            <>
              {/* Profile Name */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 1 }}>
      <Typography
        sx={{
          width: "160px",
          fontSize: "13px",
          color: "#d62134",
        }}
      >
        Profile Name *
      </Typography>

      <TextField
        id="profile_name"
        name="profile_name"
        type="text"
        onChange={(e) => {
          const value = e.target.value;
          const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
          formik.setFieldValue("profile_name", onlyLetters);
        }}
        value={formik.values.profile_name}
        variant="outlined"
        size="small"
        error={
          formik.touched.profile_name &&
          Boolean(formik.errors.profile_name)
        }
        helperText={
          formik.touched.profile_name && formik.errors.profile_name
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

      {/* Info icon and popup inline */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "12px",
          position: "relative",
        }}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <InfoOutlinedIcon
          sx={{ fontSize: "22px", color: "gray", cursor: "pointer" }}
        />

        {showPopup && (
          <Box
            sx={{
              marginLeft: "10px",
              fontSize: "12px",
              color: "gray",
              padding: "6px 10px",
              backgroundColor: "lightgray",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Here Give the Identified Name
          </Box>
        )}
      </Box>
    </Box>
              {/* Repeat Every */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                    mb: 2,
                    color: "#d62134",
                  }}
                >
                  Repeat Every *
                </Typography>

                <Grid item xs={5}>
                  <FormControl fullWidth size="small" style={{ width: 400 }}>
                    <StyledSelect
                      name="repeat_every"
                      value={formik.values.repeat_every}
                      onChange={(e) => {
                        const [value, frequency] = e.target.value.split("-");

                        const selectedMode = paymentModes.find(
                          (mode) =>
                            mode.value?.toString() === value &&
                            mode.frequency === frequency
                        );

                        if (selectedMode) {
                          formik.setFieldValue(
                            "repeat_every",
                            parseInt(selectedMode.value)
                          );
                          formik.setFieldValue(
                            "recurrence_frequency",
                            selectedMode.frequency
                          );
                          formik.setFieldValue(
                            "recurrence_frequency_formatted",
                            `Every ${selectedMode.value} ${
                              selectedMode.frequency.charAt(0).toUpperCase() +
                              selectedMode.frequency.slice(1)
                            }${selectedMode.value > 1 ? "s" : ""}`
                          );
                        }
                      }}
                      onBlur={formik.handleBlur}
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{
                        fontSize: "13px",
                        width: "350px",
                        color: "gray",
                        svg: { fontSize: "22px" },
                      }}
                      displayEmpty
                      renderValue={() => {
                        const selected = paymentModes.find(
                          (mode) =>
                            mode.value === formik.values.repeat_every &&
                            mode.frequency ===
                              formik.values.recurrence_frequency
                        );
                        return selected ? (
                          selected.label
                        ) : (
                          <Typography
                            sx={{ color: "#757575", fontSize: "13px" }}
                          >
                            Select a value
                          </Typography>
                        );
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
                            autoFocus
                            placeholder="Search"
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={(e) => e.stopPropagation()}
                            value={paymentTermsSearch}
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

                      {/* Dropdown Options */}
                      {filteredPaymentModes.length > 0 ? (
                        filteredPaymentModes.map((mode) => (
                          <MenuItem
                            key={`${mode.value}-${mode.frequency}`}
                            value={`${mode.value}-${mode.frequency}`} // Use both as a key
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
                            {mode.label}
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

                    {/* Validation Error */}
                    {formik.touched.repeat_every &&
                      formik.errors.repeat_every && (
                        <Typography
                          sx={{
                            mt: 0.5,
                            ml: 1,
                            fontSize: "0.75rem",
                            color: "#d32f2f",
                          }}
                        >
                          {formik.errors.repeat_every}
                        </Typography>
                      )}
                  </FormControl>
                </Grid>
              </Box>

              {/*Start Date */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  mt: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    minWidth: "160px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Start Date
                </Typography>
                <Box>
                  <TextField
                    id="start_date"
                    name="start_date"
                    type="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.start_date}
                    placeholder="dd/MM/yyyy"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      inputProps: {
                        // Remove min date restriction to allow any date
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputRef={(ref) => {
                      if (ref) {
                        ref.onclick = () => ref.showPicker && ref.showPicker();
                      }
                    }}
                    error={
                      formik.touched.start_date &&
                      Boolean(formik.errors.start_date)
                    }
                    helperText={
                      formik.touched.start_date && formik.errors.start_date
                    }
                    sx={{
                      width: "350px",
                      height: "35px",
                      color: "gray",
                      "& .MuiOutlinedInput-root": {
                        fontSize: "13px",
                        borderRadius: "7px",
                        color: "gray",
                      },
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
                  {/* Updated display logic - now shows whenever nextRecurringDate exists */}
                  <Box>
                    {nextRecurringDate && (
                      <Typography
                        sx={{ fontSize: "13px", color: "gray", mt: 1 }}
                      >
                        The recurring expense will be created on:{" "}
                        {nextRecurringDate}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Ends On */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      minWidth: "160px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Ends On
                  </Typography>
                  <TextField
                    id="end_date"
                    name="end_date"
                    type="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.end_date}
                    placeholder="dd/MM/yyyy"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        min: formik.values.start_date || todayStr, // Set min date to start date or today
                      },
                    }}
                    inputRef={(ref) => {
                      if (ref) {
                        ref.onclick = () => ref.showPicker && ref.showPicker();
                      }
                    }}
                    disabled={formik.values.never_expires}
                    sx={{
                      width: "350px",
                      height: "35px",
                      color: "gray",
                      backgroundColor: formik.values.never_expires
                        ? "#f5f5f5"
                        : "#fff",
                      "& .MuiOutlinedInput-root": {
                        fontSize: "13px",
                        color: "gray",
                        borderRadius: "7px",
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
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: "10px",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.never_expires}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsBoxOpen(checked);
                          formik.setFieldValue("never_expires", checked);
                          if (checked) {
                            formik.setFieldValue("end_date", ""); // Optionally clear the date
                          }
                        }}
                        sx={{
                          margin: "10px",
                          p: 0,
                          "& .MuiSvgIcon-root": {
                            fontSize: 17,
                          },
                          marginLeft: "160px",
                        }}
                      />
                    }
                    label="Never Expires"
                    sx={{
                      ml: 1,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "13px",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Expense Account* */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      minWidth: "160px",
                      whiteSpace: "nowrap",
                      color: "#d62134",
                    }}
                  >
                    Expense Account*
                  </Typography>

                  {/* Custom dropdown trigger */}
                  <Box sx={{ position: "relative", width: "350px" }}>
                    <Box
                      onClick={handleExpenseAccClick}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "35px",
                        width: "350px",
                        justifyContent: "space-between",
                        border:
                          formik.touched.expense_account &&
                          Boolean(formik.errors.expense_account)
                            ? "1px solid #d32f2f"
                            : "1px solid #c4c4c4",
                        borderRadius: "7px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        backgroundColor: "white",
                        color: "gray",
                        "&:hover": {
                          borderColor: "#408dfb",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: formik.values.expense_account
                            ? "gray"
                            : "#aaa",
                        }}
                      >
                        {formik.values.expense_account ||
                          "Select expense account"}
                      </Typography>
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: "22px", marginRight: "-10px" }}
                      />
                    </Box>
                  </Box>

                  {/* Expense Account Option */}
                  <Popper
                    open={expenseAccOpen}
                    anchorEl={expenseAccAnchorEl}
                    placement="bottom-start"
                    style={{ width: "350px", zIndex: 1 }}
                  >
                    <ClickAwayListener onClickAway={handleExpenseAccClose}>
                      <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
                        <Box>
                          <TextField
                            autoFocus
                            placeholder="Search account..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={(e) => e.stopPropagation()}
                            value={expenseAccSearchTerm}
                            onChange={handleExpenseAccSearch}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon
                                    sx={{
                                      fontSize: "16px",
                                      color: "#757575",
                                    }}
                                  />
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
                          {filteredExpenseAccOptions.length === 0 ? (
                            <Box sx={{ p: 1 }}>No options found</Box>
                          ) : (
                            filteredExpenseAccOptions.map(
                              (group, groupIndex) => (
                                <Box key={groupIndex} sx={{ mb: 1 }}>
                                  <Typography
                                    sx={{
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      p: 1,
                                      backgroundColor: COLORS.bgLight,
                                    }}
                                  >
                                    {group.category}
                                  </Typography>

                                  {group.options.map((option, index) => (
                                    <Box
                                      key={`${groupIndex}-${index}`}
                                      sx={{
                                        p: 1,
                                        pl: 2,
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        "&:hover": {
                                          backgroundColor: "#408dfb",
                                          color: "white",
                                          borderRadius: "5px",
                                          marginRight: "4px",
                                          marginLeft: "4px",
                                        },
                                      }}
                                      onClick={() =>
                                        handleExpenseAccSelect(option)
                                      }
                                    >
                                      {option}
                                    </Box>
                                  ))}
                                </Box>
                              )
                            )
                          )}
                        </Box>
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                </Box>
              </Box>
              {/* Amount */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <Typography sx={{ ...formLabelStyle }}>Amount*</Typography>
                  <Box
                    sx={{
                      border: 1,
                      width: "50px",
                      borderColor:
                        formik.touched.tot_amount && formik.errors.tot_amount
                          ? "error.main"
                          : "#c4c4c4",
                      height: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: "7px",
                      borderBottomLeftRadius: "7px",
                      borderRight: "0px",
                    }}
                  >
                    INR
                  </Box>
                  <StyledTextField
                    name="tot_amount"
                    placeholder="Amount"
                    type="number"
                    min="0"
                    value={formik.values.tot_amount}
                    onChange={amountChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tot_amount &&
                      Boolean(formik.errors.tot_amount)
                    }
                    helperText={
                      formik.touched.tot_amount && formik.errors.tot_amount
                    }
                    sx={{
                      width: "300px",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      "& input": {
                        "&::placeholder": {
                          color: "#978195",
                          fontWeight: "normal",
                        },
                        "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                          {
                            WebkitAppearance: "none !important",
                            margin: 0,
                          },
                      },
                    }}
                  />
                </Box>

                {formik.touched.tot_amount && formik.errors.tot_amount && (
                  <Typography
                    sx={{
                      ml: "160px",
                      mt: -1,
                      mb: 1,
                      fontSize: "0.75rem",
                      color: COLORS.error,
                    }}
                  >
                    {formik.errors.tot_amount}
                  </Typography>
                )}
              </Box>
            </>
            {/* // )} */}
          </Box>
        </Box>

        {/* <Divider sx={{ mb: 4, width: "100%" }} /> */}

        {/* Content Below Paid Through */}
        <Box sx={{ width: "60%" }}>
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Box>
              <Typography sx={{ ...formLabelStyle }}>Paid Through*</Typography>
            </Box>

            <Box sx={{ position: "relative", width: "350px" }}>
              <Box
                onClick={handlePaidThroughAccClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "35px",
                  width: "350px",
                  justifyContent: "space-between",
                  border:
                    formik.touched.paid_through_account_id &&
                    Boolean(formik.errors.paid_through_account_id)
                      ? "1px solid #d32f2f"
                      : "1px solid #c4c4c4",
                  borderRadius: "7px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  backgroundColor: "white",
                  color: "gray",
                  "&:hover": {
                    borderColor: "#408dfb",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: formik.values.paid_through_account_id
                      ? "gray"
                      : "#aaa",
                  }}
                >
                  {formik.values.paid_through_account_id || "Select an account"}
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{ fontSize: "22px", marginRight: "-10px" }}
                />
              </Box>
            </Box>

            <Popper
              open={paidThrAccOpen}
              anchorEl={paidThrAccAnchorEl}
              placement="bottom-start"
              style={{ width: "350px", zIndex: 1 }}
            >
              <ClickAwayListener onClickAway={handlePaidThroughAccClose}>
                <Paper sx={{ maxHeight: 300, overflow: "auto", width: "100%" }}>
                  <Box sx={{ p: 1 }}>
                    {/* Search Box */}
                    <TextField
                      placeholder="Search account"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "13px",
                        },
                      }}
                    />

                    {/* Filtered Results */}
                    {paidThroughAccCategory
                      .map((group) => ({
                        category: group.category,
                        options: group.options.filter((option) =>
                          option
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        ),
                      }))
                      .filter((group) => group.options.length > 0)
                      .map((group, groupIndex) => (
                        <Box key={groupIndex} sx={{ mb: 1 }}>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: "600",
                              p: 1,
                              backgroundColor: COLORS.bgLight,
                            }}
                          >
                            {group.category}
                          </Typography>

                          {group.options.map((option, index) => (
                            <Box
                              key={`${groupIndex}-${index}`}
                              sx={{
                                p: 1,
                                pl: 2,
                                fontSize: "13px",
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "#408dfb",
                                  color: "white",
                                  borderRadius: "5px",
                                  marginRight: "4px",
                                  marginLeft: "4px",
                                },
                              }}
                              onClick={() => handlePaidThroughAccSelect(option)}
                            >
                              {option}
                            </Box>
                          ))}
                        </Box>
                      ))}
                  </Box>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>
          {formik.touched.paid_through_account_id &&
            formik.errors.paid_through_account_id && (
              <Typography
                sx={{
                  fontSize: "13px",
                  color: COLORS.error,
                  mt: -2,
                  mb: 2,
                  pl: "160px",
                }}
              >
                {formik.errors.paid_through_account_id}
              </Typography>
            )}

          {/* The Currency */}

          {formik.values.form_status === 1 && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      minWidth: "160px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Currency
                  </Typography>
                </Box>

                <StyledTextField
                  readOnly
                  value={
                    formik.values.currency_id &&
                    `${formik.values.currency_id} - ${formik.values.currency_name}`
                  }
                  onClick={handleCurrencyClick}
                  name="currency_id"
                  error={
                    formik.touched.currency_id &&
                    Boolean(formik.errors.currency_id)
                  }
                  sx={{ width: "350px", cursor: "pointer" }}
                />
                <Popper
                  open={currencyOpen}
                  anchorEl={currenyAnchorEl}
                  placement="bottom-start"
                  style={{ width: "350px", zIndex: 1 }}
                >
                  <ClickAwayListener onClickAway={handleCurrencyClose}>
                    <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
                      <Box sx={{ p: 1 }}>
                        {currency.map((group, groupIndex) => (
                          <Box key={groupIndex} sx={{ mb: 1 }}>
                            <Box
                              key={groupIndex}
                              sx={{
                                p: 1,
                                pl: 2,
                                fontSize: "13px",
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: COLORS.hoverBg,
                                },
                              }}
                              onClick={() => handleCurrencySelect(group)}
                            >
                              {group.id} - {group.name}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </Box>
            </>
          )}

          {/* Expense Type  Selection */}

          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ width: "160px", fontSize: "13px" }}>
                <Box sx={{ width: "140px" }}>Expense Type*</Box>
              </Typography>
              <Box>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="expense_type"
                    value={formik.values.expense_type}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="goods"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            transform: "scale(0.75)",
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "13px" }}>Goods</Typography>
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          marginLeft: "4px",
                        },
                        alignItems: "center",
                        marginY: "1px",
                      }}
                    />
                    <FormControlLabel
                      value="services"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            transform: "scale(0.75)",
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "13px" }}>
                          Services
                        </Typography>
                      }
                      sx={{
                        ".MuiFormControlLabel-label": {
                          marginLeft: "4px",
                        },
                        alignItems: "center",
                        marginY: "1px",
                      }}
                    />
                  </RadioGroup>
                </FormControl>
                {formik.touched.expense_type && formik.errors.expense_type && (
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: "0.75rem",
                      color: COLORS.error,
                    }}
                  >
                    {formik.errors.expense_type}
                  </Typography>
                )}
              </Box>
            </Box>

            {formik.values.gst_treatment !== "Non-GST Supply" &&
              formik.values.gst_treatment !== "Out Of Scope" && (
                <>
                  {formik.values.expense_type === "goods" && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        sx={{
                          width: "160px",
                          fontSize: "13px",
                        }}
                      >
                        HSN Code
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center">
                          <TextField
                            placeholder="HSN Code"
                            size="small"
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
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#409dfb", // on focus
                                },
                            }}
                            value={formik.values.hsn_code || ""}
                            onChange={(e) =>
                              formik.setFieldValue("hsn_code", e.target.value)
                            }
                          />
                        </Box>
                        {formik.touched.hsn_code && formik.errors.hsn_code && (
                          <Typography
                            sx={{
                              mt: 1,

                              mb: 1,
                              fontSize: "0.75rem",
                              color: COLORS.error,
                            }}
                          >
                            {formik.errors.hsn_code}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  {formik.values.expense_type === "services" && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        sx={{
                          width: "160px",
                          fontSize: "13px",
                        }}
                      >
                        SAC Code
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center">
                          <TextField
                            placeholder="SAC Code"
                            size="small"
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
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#409dfb", // on focus
                                },
                            }}
                            value={formik.values.sac_code || ""}
                            onChange={(e) =>
                              formik.setFieldValue("sac_code", e.target.value)
                            }
                          />
                        </Box>
                        {formik.touched.sac_code && formik.errors.sac_code && (
                          <Typography
                            sx={{
                              mt: 1,
                              mb: 1,
                              fontSize: "0.75rem",
                              color: COLORS.error,
                            }}
                          >
                            {formik.errors.sac_code}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </>
              )}
          </>

          {/* The Vendor */}

          <Box sx={{ mb: 2 }}>
            {/* Vendor Selection */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ width: "160px", fontSize: "13px" }}>
                Vendor
              </Typography>

              <ClickAwayListener
                onClickAway={() => setVendorDropdownOpen(false)}
              >
                <Box sx={{ position: "relative", width: "440px" }}>
                  <Box
                    onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "35px",
                      width: "390px",
                      justifyContent: "space-between",
                      border: "1px solid #c4c4c4",
                      borderRadius: "7px",
                      padding: "8px 14px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      color: "gray",
                      "&:hover": {
                        borderColor: "#408dfb",
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* <Box
                          sx={{
                            marginLeft: "5px",
                            width: "10px",
                            height: "10px",
                            marginRight: "20px",
                            borderLeft: "5px solid transparent",
                            borderRight: "5px solid transparent",
                            borderTop: "5px solid #666",
                            transform: vendorDropdownOpen
                              ? "rotate(180deg)"
                              : "none",
                            "&:hover": {
                              borderColor: "#408dfb",
                            },
                          }}
                        /> */}
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

                  {vendorDropdownOpen && (
                    <Paper
                      elevation={3}
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "390px",
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
                              borderRadius: "7px",
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

                                // Update Formik value for vendor_id
                                formik.setFieldValue("vendor_id", vendor._id);
                                formik.setFieldValue(
                                  "vendor_Name",
                                  vendor.vendor_Name
                                );
                              }}
                              sx={{
                                display: "flex",
                                fontSize: "13px",
                                margin: "2px",
                                alignItems: "center",
                                borderRadius: "5px",
                                margin: "5px",
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
          </Box>

          {/* GST Treatment Dropdown */}

          <Box sx={{ display: "flex", mb: 3 }}>
            <Typography
              sx={{
                width: "160px",
                fontSize: "13px", // Increased font size for the label
                color: "#d62134",
                fontWeight: 500,
                mb: 1,
                mt: 1,
              }}
            >
              GST Treatment*
            </Typography>
            <FormControl fullWidth size="small" sx={{ width: "350px" }}>
              <Select
                value={gstTreatment}
                IconComponent={KeyboardArrowDownIcon}
                onChange={handleGstTreatmentChange}
                renderValue={(selected) => selected} // <-- Only display label
                sx={{
                  borderRadius: "7px",
                  fontSize: "13px",
                  height: "36px",
                  backgroundColor: "white",
                  overflow: "hidden",
                  "& .MuiOutlinedInput-input": {
                    padding: "8px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  },
                }}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      overflowY: "auto",
                      width: "280px",
                    },
                  },
                }}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option.label}
                    sx={{
                      minHeight: "32px",
                      padding: "4px 12px",
                      "& .MuiTypography-root": {
                        fontSize: "12px",
                      },
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                        borderRadius: "5px",
                        marginRight: "4px",
                        marginLeft: "4px",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "340px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: "12px",
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#666",
                          fontSize: "10px",
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {option.desc}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* GSTIN Input Field */}
          {formik.values.gst_treatment !== "Non-GST Supply" &&
            formik.values.gst_treatment !== "Out Of Scope" &&
            formik.values.gst_treatment !== "Unregistered Business" &&
            formik.values.gst_treatment !== "Consumer" && (
              <>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{
                      width: "160px",
                      fontSize: "13px",
                      color: "#d62134",
                      fontWeight: 500,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Vendor GSTIN
                    <Typography component="span" color="#d62134">
                      *
                    </Typography>
                  </Typography>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        width: "350px",
                      }}
                    >
                      <FormControl
                        error={
                          formik.touched.gst_no && Boolean(formik.errors.gst_no)
                        }
                        sx={{ width: "350px" }}
                      >
                        <TextField
                          name="gst_no"
                          value={formik.values.gst_no || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter GST Number"
                          fullWidth
                          size="small"
                          error={
                            formik.touched.gst_no &&
                            Boolean(formik.errors.gst_no)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "7px",
                              fontSize: "12px",
                              height: "32px",
                              "& fieldset": {
                                borderColor:
                                  formik.touched.gst_no && formik.errors.gst_no
                                    ? "error.main"
                                    : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor:
                                  formik.touched.gst_no && formik.errors.gst_no
                                    ? "error.main"
                                    : "#aaa",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor:
                                  formik.touched.gst_no && formik.errors.gst_no
                                    ? "error.main"
                                    : "#1976d2",
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "6px 8px",
                              lineHeight: "1.2",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            },
                            "& .MuiFormHelperText-root": {
                              fontSize: "11px",
                              marginLeft: "4px",
                              marginTop: "1px",
                            },
                          }}
                        />
                      </FormControl>
                      {formik.touched.gst_no && formik.errors.gst_no && (
                        <Typography
                          sx={{
                            mb: 1,
                            fontSize: "0.75rem",
                            color: COLORS.error,
                          }}
                        >
                          {formik.errors.gst_no}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
            )}

          {/* Source of Supply */}
          {formik.values.gst_treatment !== "Overseas" &&
            formik.values.gst_treatment !== "Out Of Scope" && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    width: "160px",
                    fontSize: "13px",

                    // color: "#e53c1d",
                  }}
                >
                  Source of Supply
                </Typography>
                <Grid item xs={5}>
                  <FormControl
                    fullWidth
                    size="small"
                    // sx={commonStyles}
                    style={{ width: 350, fontSize: "13px" }}
                  >
                    <StyledSelect
                      displayEmpty
                      IconComponent={KeyboardArrowDownIcon}
                      name="source_of_supply"
                      value={formik.values.source_of_supply || ""}
                      onChange={formik.handleChange}
                      sx={{
                        fontSize: "13px",
                        "& svg": {
                          fontSize: "22px", // You can change this to 16px, 24px, etc.
                        },
                      }}
                      renderValue={(selected) => {
                        if (!selected) return "";
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
                </Grid>
              </Box>
            )}

          {/* Destination of Supply*/}
          {formik.values.gst_treatment !== "Out Of Scope" && (
            <Box sx={{ display: "flex", alignItems: "center", mt: "20px" }}>
              <Typography
                variant="body1"
                sx={{
                  width: "160px",
                  fontSize: "13px",

                  // color: "#e53c1d",
                }}
              >
                Destination of Supply
              </Typography>
              <Grid item xs={5}>
                <FormControl
                  fullWidth
                  size="small"
                  // sx={commonStyles}
                  style={{ width: 350, fontSize: "13px" }}
                >
                  <StyledSelect
                    displayEmpty
                    // IconComponent={ArrowDropDownIcon}
                    name="destination_of_supply"
                    value={formik.values.destination_of_supply || ""}
                    onChange={formik.handleChange}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      fontSize: "13px",
                      "& svg": {
                        fontSize: "22px",
                      },
                    }}
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
              </Grid>
            </Box>
          )}

          {/* Reverse Charge */}

          {formik.values.gst_treatment !== "Non-GST Supply" &&
            formik.values.gst_treatment !== "Out Of Scope" &&
            formik.values.gst_treatment !==
              "Registered Business - Composition" && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    mt: "20px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ width: "150px", fontSize: "13px" }}
                  >
                    Reverse Charge
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.reverse_charge}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsBoxOpen(checked);
                          formik.setFieldValue("reverse_charge", checked);
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
                          color: "#d62134",
                        }}
                      >
                        Tax*
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <FormControl
                        fullWidth
                        size="small"
                        // sx={commonStyles}
                        style={{ width: 350, fontSize: "13px" }}
                        error={
                          formik.touched.expense_tax_percent &&
                          Boolean(formik.errors.expense_tax_percent)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderColor:
                              formik.touched.expense_tax_percent &&
                              formik.errors.expense_tax_percent
                                ? "error.main"
                                : "inherit",
                          },
                        }}
                      >
                        <StyledSelect
                          name="expense_tax_percent"
                          value={formik.values.expense_tax_percent || ""}
                          onChange={TaxEntered}
                          IconComponent={KeyboardArrowDownIcon}
                          sx={{
                            fontSize: "13px",
                            "& .MuiSelect-select": {
                              fontSize: "13px",
                            },
                          }}
                          displayEmpty
                          renderValue={(selected) => {
                            return (
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  color: selected ? "inherit" : "#757575",
                                }}
                              >
                                {selected || "Select a Tax"}
                              </Typography>
                            );
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
                                const searchText = e.target.value.toLowerCase();
                                document
                                  .querySelectorAll("[data-tax-item]")
                                  .forEach((item) => {
                                    const text = item.textContent.toLowerCase();
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
                                  "&.Mui-selected": {
                                    fontSize: "13px", // Selected item font size
                                    backgroundColor: "#e3f2fd", // Optional: subtle highlight
                                    fontWeight: "bold", // Optional: make it stand out
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

                          {[
                            "IGST0 [0%]",
                            "IGST5 [5%]",
                            "IGST12 [12%]",
                            "IGST18 [18%]",
                            "IGST28 [28%]",
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
                                  backgroundColor: "#408dfb",
                                  color: "white",
                                },
                                "&.Mui-selected": {
                                  fontSize: "13px", // Selected item font size
                                  backgroundColor: "#e3f2fd", // Optional: subtle highlight
                                  fontWeight: "bold", // Optional: make it stand out
                                },
                              }}
                            >
                              {item}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                      {formik.touched.expense_tax_percent &&
                        formik.errors.expense_tax_percent && (
                          <Typography
                            sx={{
                              mb: 1,
                              fontSize: "0.75rem",
                              color: COLORS.error,
                            }}
                          >
                            {formik.errors.expense_tax_percent}
                          </Typography>
                        )}
                      {formik.values.expense_tax_percent && (
                        <Box>
                          <Box
                            sx={{
                              color: "#6C718A",
                              fontSize: "12px",
                              fontWeight: "400",
                              ml: 0.5,
                              mt: 1,
                            }}
                          >
                            Tax Amount = {formik.values.expense_tax_amount} INR
                          </Box>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Box>

                {/* The Amount is */}

                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <Typography sx={{ width: "160px", fontSize: "13px" }}>
                    <Box sx={{ width: "140px" }}>Amount is</Box>
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="inclusive_exclusive"
                      value={formik.values.inclusive_exclusive}
                      onChange={(e) => handleInclusiveExclusiveChange(e)}
                    >
                      <FormControlLabel
                        value="inclusive"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              transform: "scale(0.75)",
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: "13px" }}>
                            Tax Inclusive
                          </Typography>
                        }
                        sx={{
                          ".MuiFormControlLabel-label": {
                            marginLeft: "4px",
                          },
                          alignItems: "center",
                          marginY: "1px",
                        }}
                      />
                      <FormControlLabel
                        value="exclusive"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              transform: "scale(0.75)",
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: "13px" }}>
                            Tax Exclusive
                          </Typography>
                        }
                        sx={{
                          ".MuiFormControlLabel-label": {
                            marginLeft: "4px",
                          },
                          alignItems: "center",
                          marginY: "1px",
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </>
            )}

          {/* The Table Component View */}

          {formik.values.form_status === 1 && (
            <>
              {/* Single Expense View */}

              {!recurringexpense_id && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    my: 2,
                    mt: 5,
                    width: "25%",
                  }}
                  onClick={() => singlePageView()}
                >
                  <KeyboardArrowLeftIcon
                    sx={{
                      color: "#408dfb",
                      fontSize: "22px",
                      fontWeight: "400",
                      ml: -1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      minWidth: "160px",
                      whiteSpace: "nowrap",
                      color: "#408dfb",
                      cursor: "pointer",
                    }}
                  >
                    Back to single expense view
                  </Typography>
                </Box>
              )}

              {/*Table Section for The Expenses*/}

              <Box sx={{ mb: 2, mt: recurringexpense_id ? 6 : 2 }}>
                <TableExpenses
                  formik={formik}
                  expenseAccCategories={expenseAccCategories}
                  CalculateTax={CalculateTax}
                />
              </Box>
            </>
          )}

          {formik.values.form_status === 1 && <Divider sx={{ my: 4 }} />}

          {/* The Invoices */}

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Typography
              sx={{
                fontSize: "13px",
                minWidth: "160px",
                whiteSpace: "nowrap",
              }}
            >
              Invoice#
            </Typography>
            <StyledTextField
              name="invoice_number"
              value={formik.values.invoice_number}
              onChange={formik.handleChange}
              error={
                formik.touched.invoice_number &&
                Boolean(formik.errors.invoice_number)
              }
              sx={{
                width: "350px",
                "& input": {
                  "&::placeholder": {
                    color: "#978195",
                    fontWeight: "normal",
                  },
                },
              }}
            />
          </Box>
          {formik.touched.invoice_number && formik.errors.invoice_number && (
            <Typography
              sx={{
                ml: "160px",
                mt: -1,
                mb: 1,
                fontSize: "0.75rem",
                color: COLORS.error,
              }}
            >
              {formik.errors.invoice_number}
            </Typography>
          )}

          {/* The Notes */}

          {formik.values.form_status === 0 && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    minWidth: "160px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Notes
                </Typography>
                <StyledTextarea
                  name="description"
                  placeholder="Max. 500 characters"
                  value={formik.values.description}
                  onChange={(e) => {
                    // Ensure that the text length does not exceed 500 characters
                    if (e.target.value.length <= 500) {
                      formik.handleChange(e);
                    }
                  }}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  sx={{
                    width: "350px",
                  }}
                />
              </Box>
              {formik.touched.description && formik.errors.description && (
                <Typography
                  sx={{
                    ml: "160px",
                    mt: -1,
                    mb: 1,
                    fontSize: "0.75rem",
                    color: COLORS.error,
                  }}
                >
                  {formik.errors.description}
                </Typography>
              )}
            </>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Customer Name Section */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: "160px", fontSize: "13px" }}>
              Customer Name
            </Typography>
            <ClickAwayListener
              onClickAway={() => setCustomerDropdownOpen(false)}
            >
              <Box sx={{ position: "relative", width: "390px" }}>
                <Box
                  onClick={() => setCustomerDropdownOpen(!customerDropdownOpen)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "35px",
                    justifyContent: "space-between",
                    border: "1px solid #c4c4c4",
                    border:
                      formik.touched.customer_id &&
                      Boolean(formik.errors.customer_id)
                        ? "1px solid #d32f2f"
                        : "1px solid #c4c4c4",
                    borderRadius: "7px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    "&:hover": { borderColor: "#408dfb" },
                  }}
                >
                  <Typography sx={{ fontSize: "13px", color: "#666" }}>
                    {formik.values.customer_id && selectedCustomer
                      ? selectedCustomer.contact_name
                      : "Select a Customer"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* <Box
                      sx={{
                        marginLeft: "5px",
                        width: "10px",
                        height: "10px",
                        marginRight: "20px",
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: "5px solid #666",
                        transform: customerDropdownOpen
                          ? "rotate(180deg)"
                          : "none",
                      }}
                    /> */}
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "22px",
                        color: "gray",
                        marginRight: "11px",
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

                {/* DROPDOWN */}
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
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
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
                          onClick={() => {
                            setSelectedCustomer(customer);
                            formik.setFieldValue("customer_id", customer._id);
                            formik.setFieldValue(
                              "customer_name",
                              customer.contact_name
                            );
                            setCustomerDropdownOpen(false);
                          }}
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

            {/* Show Billable Checkbox only if a customer is selected */}

            {/* {selectedCustomer && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isBillable}
                    onChange={(e) => setIsBillable(e.target.checked)}
                    sx={{
                      margin: "10px",
                      p: 0, // optional: removes extra padding
                      "& .MuiSvgIcon-root": {
                        fontSize: 17, // size of the checkbox icon itself
                      },
                    }}
                  />
                }
                label="billable"
                sx={{
                  ml: 2,
                  "& .MuiFormControlLabel-label": {
                    fontSize: "13px",
                  },
                }}
              />
            )} */}
          </Box>
          {formik.touched.customer_id && formik.errors.customer_id && (
            <Typography
              sx={{
                ml: "160px",
                mt: -1,
                mb: 1,
                fontSize: "0.75rem",
                color: COLORS.error,
              }}
            >
              {formik.errors.customer_id}
            </Typography>
          )}

          {/* {selectedCustomer && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ width: "160px", fontSize: "13px" }}>
                    Projects
                  </Typography>
                  <ClickAwayListener
                    onClickAway={() => setProjectDropdownOpen(false)}
                  >
                    <Box sx={{ position: "relative", width: "390px" }}>
                      <Box
                        onClick={handleDropdownToggle}
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
                          {selectedProject
                            ? selectedProject.contact_name
                            : "Select a Project"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              marginLeft: "5px",
                              width: "10px",
                              height: "10px",
                              marginRight: "20px",
                              borderLeft: "5px solid transparent",
                              borderRight: "5px solid transparent",
                              borderTop: "5px solid #666",
                              transform: projectDropdownOpen
                                ? "rotate(180deg)"
                                : "none",
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

            
                      {projectDropdownOpen && (
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
                              value={projectSearchQuery}
                              onChange={(e) =>
                                setProjectSearchQuery(e.target.value)
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
                          <Box
                              onClick={() =>
                                handleProjectSelection({
                                  contact_name: "Sample Project",
                                })
                              }
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
        
                            </Box>
                          </Box>
                        </Paper>
                      )}
                    </Box>
                  </ClickAwayListener>
                </Box>
              )} */}

          {/* Show Mark up by input if billable is checked */}

          {/* {selectedCustomer && isBillable && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ width: "160px", fontSize: "13px" }}>
                Mark up by
              </Typography>
              <TextField
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                sx={{
                  width: "150px",
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
          )} */}

          {formik.values.form_status === 0 && (
            <>
              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    minWidth: "160px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Reporting Tags
                </Typography>
                <Box sx={{ display: "flex", gap: 1, cursor: "pointer" }}>
                  <LocalOfferIcon sx={{ color: "#408dfb", fontSize: "18px" }} />
                  <Typography sx={{ color: "#408dfb", fontSize: "13px" }}>
                    Associate Tags
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {/* Submit Action Button */}

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
              // ml: recurringexpense_id ? -2.5 : -4.5,
            }}
          >
            <Button
              onClick={() => formik.handleSubmit(true)}
              variant="contained"
              disableElevation
              color="primary"
              type="button"
            >
              Save <span style={{ fontSize: "10px" }}>(Alt+S)</span>
            </Button>

            <Link
              href="/purchase/recurringexpenses"
              passHref
              style={{ textDecoration: "none" }}
            >
              <Button variant="outlined">Cancel</Button>
            </Link>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default RecurringExpense;
