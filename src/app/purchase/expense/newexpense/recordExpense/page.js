"use client";
import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  Popper,
  Checkbox,
  Paper,
  ClickAwayListener,
  styled,
  Divider,
  IconButton,
  MenuItem,
  InputAdornment,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import VendorSelect from "./VendorSelect";
import CustomerSelect from "./CustomerSelection";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Link from "next/link";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import TableExp from "./TableExpenses";
import Image from "next/image";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSnackbar } from "../../../../../components/SnackbarProvider";
import CloseIcon from "@mui/icons-material/Close";
import config from "../../../../../services/config";
import apiService from "../../../../../services/axiosService";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "@mui/material/styles";

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
  fontSize: "13px",
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
    fontSize: "13px", // 13px
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

const RecordExpense = () => {
  const theme = useTheme();
  const [expenseAccSearchTerm, setExpenseAccSearchTerm] = useState("");
  const [expenseAccAnchorEl, setExpenseAccAnchorEl] = useState(null);
  const [expenseAccCategories, setExpenseAccCategories] = useState([]);
  const [paidThroughAccCategory, setPaidThroughAccCategory] = useState([]);
  const expenseAccOpen = Boolean(expenseAccAnchorEl);
  const [paidThrAccAnchorEl, setPaidThrAccAnchorEl] = useState(null);
  const paidThrAccOpen = Boolean(paidThrAccAnchorEl);
  const [currenyAnchorEl, setCurrencyAnchorEl] = useState(null);
  const currencyOpen = Boolean(currenyAnchorEl);
  const { showMessage } = useSnackbar();
  const [previewFile, setPreviewFile] = useState(null);
  const [files, setFiles] = useState([]);
  const searchParams = useSearchParams();
  const expense_id = searchParams.get("expense_id");
  const clone_id = searchParams.get("clone_id");
  const router = useRouter();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isBillable, setIsBillable] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const dateRef = useRef();

  // Filter customers based on customer search query
  const filteredCustomers = customers.filter((customer) =>
    customer.contact_name
      .toLowerCase()
      .includes(customerSearchQuery.toLowerCase())
  );
  const [searchQuery, setSearchQuery] = useState("");

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
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    if (organization_id) {
      fetchCustomers();
      get_COA_api();
      get_COA_paid_through();
    }
  }, [organization_id]);

  const get_COA_api = async () => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/COA/get-coa-list?org_id=${organization_id}`,
      });
      if (response.statusCode == 200) {
        // console.log(response.data.data, "response.data.data");
        setExpenseAccCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching get_COA_api:", error);
    } finally {
      setLoading(false);
    }
  };

  const get_COA_paid_through = async () => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/COA/get-coa-paid-through-account?org_id=${organization_id}`,
      });
      if (response.statusCode == 200) {
        // console.log(response.data.data, "response.data.data");
        setPaidThroughAccCategory(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching get_COA_api:", error);
    } finally {
      setLoading(false);
    }
  };

  // Account options by category
  // const expenseAccCategories = [
  //   {
  //     category: "Cost Of Goods Sold",
  //     options: [
  //       "Cost of Goods Sold",
  //       "Job Costing",
  //       "Labor",
  //       "Materials",
  //       "Subcontractor",
  //     ],
  //   },
  //   {
  //     category: "Expense",
  //     options: [
  //       "Advertising And Marketing",
  //       "Automobile Expense",
  //       "Bad Debt",
  //       "Bank Fees and Charges",
  //       "Consultant Expense",
  //       "Depreciation And Amortisation",
  //       "Depreciation Expense",
  //       "IT and Internet Expenses",
  //       "Janitorial Expense",
  //       "Lodging",
  //       "Meals and Entertainment",
  //       "Merchandise",
  //       "Office Supplies",
  //       "Other Expenses",
  //       "Postage",
  //       "Printing and Stationery",
  //       "Purchase Discounts",
  //       "Raw Materials And Consumables",
  //       "Rent Expense",
  //       "Repairs and Maintenance",
  //       "Salaries and Employee Wages",
  //       "Telephone Expense",
  //       "Transportation Expense",
  //       "Travel Expense",
  //     ],
  //   },
  //   {
  //     category: "Long Term Liability",
  //     options: ["Construction Loans", "Mortgages"],
  //   },
  //   {
  //     category: "Other Current Liability",
  //     options: [
  //       "Employee Reimbursements",
  //       "Tax Payable",
  //       "TCS Payable",
  //       "TDS Payable",
  //     ],
  //   },
  //   {
  //     category: "Fixed Asset",
  //     options: ["Furniture and Equipment"],
  //   },
  //   {
  //     category: "Other Current Asset",
  //     options: [
  //       "Advance Tax",
  //       "Employee Advance",
  //       "Prepaid Expenses",
  //       "TCS Receivable",
  //       "TDS Receivable",
  //     ],
  //   },
  // ];

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

  // const [gstin, setGstin] = useState(customerData?.gst_no || "");
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
    formik.setFieldValue("vendor_gst_no", event.target.value);
  };

  const handleGstTreatmentChange = (event) => {
    setGstTreatment(event.target.value);
    formik.setFieldValue("gst_treatment", event.target.value);
    if (
      event.target.value === "Out Of Scope" ||
      event.target.value === "Non-GST Supply"
    ) {
      formik.setFieldValue("expense_tax_percent", "");
      formik.setFieldValue("vendor_gst_no", "");
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
      formik.setFieldValue("vendor_gst_no", "");
    } else {
      formik.setFieldValue("inclusive_exclusive", "exclusive");
    }
  };

  const handlePermanentChange = (event) => {
    setIsPermanent(event.target.checked);
  };

  // const handleGetTaxpayerDetails = () => {
  // };

  // const handleUpdate = () => {
  //   onUpdate &&
  //     onUpdate({
  //       gst_treatment: gstTreatment,
  //       gst_no: gstin,
  //     });
  //   onClose();
  // };
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
      category: group._id,
      options: group.accounts.filter((acc) =>
        acc.account_name
          .toLowerCase()
          .includes(expenseAccSearchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.options.length > 0);
  // Validation schema
  const validationSchema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    lineItems: Yup.array().of(
      Yup.object().shape({
        account_id: Yup.string().required("Expense account is required"),
        amount: Yup.number().required("Amount is required"),
      })
    ),
    tot_amount: Yup.number().required("Total amount is required"),
    // paid_through_account_id: Yup.string().required(
    //   "Paid through account is required"
    // ),
    expense_type: Yup.string().required("Expense type is required"),

    gst_treatment: Yup.string().required("GST treatment is required"),

    // HSN code validation (if entered, must be 4, 6, or 8 digits)
    hsn_code: Yup.string()
      .matches(/^\d{4}(\d{2})?(\d{2})?$/, "HSN code must be 4, 6, or 8 digits")
      .notRequired(), // Not required but must match pattern if provided

    // SAC code validation (must be 6 digits and start with '99')
    sac_code: Yup.string()
      .matches(/^99\d{4}$/, "SAC code must be 6 digits and start with '99'")
      .notRequired(), // Not required but must match pattern if provided

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

    // Conditional validation for vendor_gst_no
    vendor_gst_no: Yup.string().when("gst_treatment", {
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
      date: today,
      lineItems: [
        {
          line_item_id: "",
          account_id: "",
          account_name: "",
          description: "",
          amount: "",
        },
      ],
      tot_amount: "",
      tot_amount_with_tax: "",
      base_amount: "",
      paid_through_account_id: "",
      paid_through_account_name: "",
      customer_id: "",
      vendor_id: "",
      vendor_Name: null,
      customer_Name: null,
      invoice_number: "",
      currency_id: "INR",
      currency_name: "Indian Rupee",
      form_status: 0,
      status: 0, // 0 - Nothing, 1 - UnBilled, 2 - Invoiced , 3 - Reimbursed
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
      vendor_gst_no: "",
      reverse_charge: false,
      expense_tax_percent: "",
      expense_tax_amount: "",
    },
    validationSchema,
    onSubmit: async (
      values,
      { resetForm, setSubmitting, shouldReload = false }
    ) => {
      try {
        console.log(validationSchema, "validationSchema");
        const organization_id = localStorage.getItem("organization_id");
        const params = {
          method: expense_id ? "PUT" : "POST",
          url: expense_id
            ? `api/v1/expense/update-expense?orgId=${organization_id}&expense_id=${expense_id}`
            : `api/v1/expense/create-expense?org_id=${organization_id}`,
          data: values,
          customBaseUrl: config.PO_Base_url,
          file: true,
        };

        const response = await apiService(params);
        if (response.statusCode == 201 || response.statusCode == 200) {
          showMessage(
            `Form ${expense_id ? "updated" : "submitted"}  successfully!`,
            "success"
          );
          resetForm();
          expense_id
            ? router.push(`/purchase/expense/${expense_id}`)
            : router.push(
                `/purchase/expense/${response.data.data.unique_EX_id}`
              );
        } else {
          showMessage(`Cannot create expense`, "error");
        }
      } catch (error) {
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

  // Custom dropdown handlers
  const handleExpenseAccClick = (event) => {
    // console.log(event, "event");
    setExpenseAccAnchorEl(event.currentTarget);
  };

  const handleExpenseAccClose = () => {
    setExpenseAccAnchorEl(null);
    setExpenseAccSearchTerm("");
  };

  const handleExpenseAccSelect = (option) => {
    console.log(option, "option sacascas");
    formik.setFieldValue("lineItems[0].account_name", option.account_name);
    formik.setFieldValue("lineItems[0].account_id", option.account_id);
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
    formik.setFieldValue("paid_through_account_id", option.account_id);
    formik.setFieldValue("paid_through_account_name", option.account_name);
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

  const singlePageView = () => {
    let newLineItem = formik.values.lineItems[0];
    formik.setFieldValue("lineItems", [newLineItem]);
    formik.setFieldValue("tot_amount", newLineItem.amount);
    formik.setFieldValue("form_status", 0);

    const entered_amount = parseFloat(newLineItem.amount);
    const match = formik.values.expense_tax_percent.match(/\[(\d+)%\]/);
    const entered_percent = match ? parseFloat(match[1]) : 0;
    const inclusive_exclusive = formik.values.inclusive_exclusive;

    if (entered_amount && (entered_percent || entered_percent === 0)) {
      CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
    } else {
      console.log("the required data is not available for calculate task");
    }
  };

  const amountChange = (e) => {
    let value = e.target.value;

    // Allow only digits and decimal point
    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

    // Enforce max length of 15 characters
    if (value.length > 15) return;
    formik.setFieldValue("lineItems[0].amount", value);
    formik.setFieldValue("tot_amount", value);

    const entered_amount = parseFloat(value);
    const match = formik.values.expense_tax_percent.match(/\[(\d+)%\]/);
    const entered_percent = match ? parseFloat(match[1]) : 0;
    const inclusive_exclusive = formik.values.inclusive_exclusive;

    if (entered_amount && (entered_percent || entered_percent === 0)) {
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
    if (clone_id || expense_id) {
      fetchExpenseData();
    }
  }, []);

  const fetchExpenseData = async () => {
    try {
      let org_id = localStorage.getItem("organization_id");
      const idToFetch = clone_id || expense_id;
      const response = await apiService({
        method: "GET",
        url: `/api/v1/expense/get-individual-expense?org_id=${org_id}&expense_id=${idToFetch}`,
        customBaseUrl: config.PO_Base_url,
      });

      const output = response.data.data;
      console.log(output,"++++++++++++getingggg++++++++++++");
      
      if (response.statusCode === 200) {
        console.log(
          output,
          clone_id ? "clone expense data" : "edit expense data"
        );

        formik.setFieldValue("form_status", output.form_status);
        formik.setFieldValue("date", new Date().toISOString().split("T")[0]); // use today for clone
        formik.setFieldValue("tot_amount", output.tot_amount);
        formik.setFieldValue(
          "paid_through_account_id",
          output.paid_through_account_id
        );
        formik.setFieldValue("vendor_id", output.vendor_id?._id || "");
        formik.setFieldValue(
          "vendor_Name",
          output.vendor_id?.contact_name || ""
        );
        formik.setFieldValue("vendor_gst_no", output?.vendor_gst_no || "");
        formik.setFieldValue("customer_id", output.customer_id?._id || "");
        formik.setFieldValue(
          "customer_Name",
          output.customer_id?.contact_name || ""
        );
        formik.setFieldValue(
          "invoice_number",
          clone_id ? "" : output.invoice_number
        ); // clear for clone
        formik.setFieldValue("lineItems", output.lineItems || []);
        setSelectedCustomer(output.customer_id);
        formik.setFieldValue("expense_type", output.expense_type);
        formik.setFieldValue("hsn_code", output.hsn_code);
        formik.setFieldValue("sac_code", output.sac_code);
        formik.setFieldValue("source_of_supply", output.source_of_supply);
        formik.setFieldValue(
          "destination_of_supply",
          output.destination_of_supply
        );
        formik.setFieldValue("expense_tax_percent", output.expense_tax_percent);
        formik.setFieldValue("expense_tax_amount", output.expense_tax_amount);
        formik.setFieldValue("inclusive_exclusive", output.inclusive_exclusive);
        formik.setFieldValue("currency_id", output.currency_id);
        formik.setFieldValue("currency_name", output.currency_name);
        const firstAmount = output.lineItems?.[0]?.amount || "";
        formik.setFieldValue("lineItems[0].amount", firstAmount);
        formik.setFieldValue("tot_amount", firstAmount);

        // Attach document if any
        if (output.document) {
          setPreviewFile(output.document); // assuming this is a URL or base64
          setFiles([output.document]);
          formik.setFieldValue("document", output.document);
        }
      }
    } catch (error) {
      showMessage(
        `Error fetching expense data for ${clone_id ? "clone" : "edit"}.`,
        "error"
      );
    }
  };

  const TaxEntered = (e) => {
    formik.handleChange(e);
    formik.setFieldValue("expense_tax_percent", e.target.value);

    const percent = e.target.value.match(/\[(\d+)%\]/);
    const entered_percent = percent ? parseFloat(percent[1]) : 0;
    const entered_amount = parseFloat(formik.values.tot_amount) || 0;
    const inclusive_exclusive = formik.values.inclusive_exclusive;

    if (entered_amount && (entered_percent || entered_percent === 0)) {
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
        formik.setFieldValue("tot_amount_with_tax", entered_amount); // already inclusive
      }

      if (inclusive_exclusive === "exclusive") {
        // Exclusive: tot_amount doesn't include tax yet
        const taxAmount = ((entered_percent / 100) * entered_amount).toFixed(2);
        const totalWithTax = (entered_amount + parseFloat(taxAmount)).toFixed(
          2
        );
        formik.setFieldValue("expense_tax_amount", taxAmount);
        formik.setFieldValue("tot_amount_with_tax", totalWithTaxAmt);
        formik.setFieldValue("base_amount", 0);

      }
    }
  };

  const handleInclusiveExclusiveChange = (e) => {
    const { value } = e.target;

    // Update Formik value
    formik.setFieldValue("inclusive_exclusive", value);
    const entered_amount = parseFloat(formik.values.tot_amount) || 0;
    const match = formik.values.expense_tax_percent.match(/\[(\d+)%\]/);
    const entered_percent = match ? parseFloat(match[1]) : 0;
    const inclusive_exclusive = value; // Use the selected value

    if (entered_amount && (entered_percent || entered_percent === 0)) {
      CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
    } else {
      console.log("the required data is not available for calculate task");
    }
  };

  return (
    <Box sx={{ pl: 2.5 }}>
      {expense_id && (
        <Box sx={{ width: "100%", fontSize: "22px", fontWeight: "400", py: 2 }}>
          Edit Expense
        </Box>
      )}
      {/*Left Side*/}

      <Box sx={{ width: "100%", mb: 10, mt: expense_id ? 0 : 7 }}>
        {/* Date Section */}
        <Box sx={{ position: "relative", py: 2, pt: 3 }}>
          <Box>
            {/* Date Field */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  minWidth: "160px",

                  color: "#d62134",
                }}
              >
                Date*
              </Typography>
              <TextField
                id="date"
                name="date"
                type="date"
                inputRef={dateRef}
                onClick={() => dateRef.current.showPicker()} // Open calendar on field click
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
                placeholder="dd/MM/yyyy"
                variant="outlined"
                size="small"
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                sx={{
                  width: "350px",
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
              />
            </Box>
            {/* {formik.touched.date && formik.errors.date && (
              <Typography
                sx={{
                  ml: "160px",
                  mt: -2,
                  mb: 1,
                  fontSize: "0.75rem",
                  color: COLORS.error,
                }}
              >
                {formik.errors.date}
              </Typography>
            )} */}

            {/* Expense Account Section */}

            {formik.values.form_status === 0 && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ ...formLabelStyle }}>
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
                          formik.touched.lineItems?.[0]?.account_name &&
                          Boolean(formik.errors.lineItems?.[0]?.account_name)
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
                          color: formik.values.lineItems?.[0]?.account_name
                            ? "gray"
                            : "#aaa",
                        }}
                      >
                        {formik.values.lineItems?.[0]?.account_name ||
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
                                    sx={{ fontSize: "16px", color: "#757575" }}
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
                                    <MenuItem
                                      key={`${option.account_id}`}
                                      onClick={() =>
                                        handleExpenseAccSelect(option)
                                      }
                                      sx={{
                                        fontSize: "13px",
                                        color: "#66686b",
                                        "&:hover": {
                                          borderRadius: "5px",
                                          backgroundColor:
                                            theme.palette.hover?.background ||
                                            "",
                                          color:
                                            theme.palette.hover?.text || "",
                                        },
                                        maxWidth: "380px",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {option.account_name}
                                    </MenuItem>
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

                {/* The Icon for the Multiple Accounts */}

                <Box
                  onClick={() => {
                    formik.setFieldValue("form_status", 1);
                  }}
                  sx={{
                    marginLeft: "160px",
                    fontSize: "13px",
                    color: "#408dfb",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginTop: -1.5,
                    gap: 1,
                    width: "80px",
                  }}
                >
                  <DoneAllIcon sx={{ fontSize: 20, color: "#408dfb" }} />{" "}
                  Itemize
                </Box>
                {formik.touched.lineItems?.[0]?.account_id &&
                  formik.errors.lineItems?.[0]?.account_id && (
                    <Typography
                      sx={{
                        ml: "160px",
                        mt: 1,
                        mb: 1,
                        fontSize: "0.75rem",
                        color: COLORS.error,
                      }}
                    >
                      {formik.errors.lineItems[0].account_id}
                    </Typography>
                  )}

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
                    name="lineItems[0].amount"
                    placeholder="Amount"
                    type="number"
                    min="0"
                    value={formik.values.lineItems[0].amount}
                    onChange={(e) => amountChange(e)}
                    error={
                      formik.touched.lineItems?.[0]?.amount &&
                      Boolean(formik.errors.lineItems?.[0]?.amount)
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
                        /* Remove spinner arrows */
                        "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                          {
                            "-webkit-appearance": "none !important",
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
              </>
            )}
          </Box>

          {/*File Upload*/}
          <Box
            sx={{
              mx: 0.5,
              mb: 10,
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              zIndex: 1,
              right: 130,
              top: 40,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "350px",
                width: "250px",
                border: "2px dotted #d7d5e2",
                borderRadius: "7px",
                bgcolor: "white",
                "&:hover": {
                  borderColor: "#408dfb",
                },
              }}
            >
              {/*Image*/}

              {!previewFile && (
                <Box
                  sx={{
                    borderRadius: "7px",
                    overflow: "hidden",
                    mb: 3,
                    height: "50px",
                  }}
                >
                  <Image
                    src="/Moon.jpg"
                    alt="Moon Image"
                    width={50}
                    height={50}
                  />
                </Box>
              )}

              {/*Text 1*/}

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500" }}>
                  Drag or Drop your Receipts
                </Typography>
              </Box>

              {/*Text 2*/}

              <Box>
                <Typography
                  sx={{ fontSize: "11px", fontWeight: "400", color: "#6C718A" }}
                >
                  Maximum file size allowed is 10MB
                </Typography>
              </Box>

              {/*Input Field*/}

              <Box
                sx={{
                  marginTop: "25px",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <input
                  type="file"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <Button
                  variant="outlined"
                  // component="span"
                  endIcon={
                    <KeyboardArrowDownIcon
                      sx={{ marginRight: "10px", fontSize: "22px" }}
                    />
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "none",
                    fontSize: "13px",
                    color: "black",
                    border: "none",
                    padding: "4px 12px",
                    bgcolor: "#f1f1fa",
                    borderRadius: "8px",
                    zIndex: 1,
                    pointerEvents: "none", // Ensures click passes through to input
                    "&:hover": {
                      borderColor: "#408dfb",
                      bgcolor: "#e0e0f0",
                    },
                  }}
                >
                  <FileUploadOutlinedIcon
                    sx={{
                      color: "#2e3b44 !important",
                      border: "none",
                      fontSize: "13px !important",
                      fontWeight: "200 !important",
                    }}
                  />
                  UPLOAD FILE
                </Button>
              </Box>
              {/* <label htmlFor="upload_image" style={{ marginTop: "25px" }}>
                <Button
                  component="span"
                  variant="outlined"
                  endIcon={
                    <KeyboardArrowDownIcon sx={{ marginRight: "10px" }} />
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "none",
                    fontSize: "13px",
                    color: "black",
                    border: "none",
                    padding: "4px 12px",
                    bgcolor: "#f1f1fa",
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "#408dfb",
                      bgcolor: "#e0e0f0",
                    },
                  }}
                >
                  <FileUploadOutlinedIcon
                    sx={{
                      color: "#2e3b44 !important",
                      border: "none",
                      fontSize: "13px !important",
                      fontWeight: "200 !important",
                    }}
                  />
                  UPLOAD FILE
                </Button>
              </label> */}

              {/* List of uploaded files */}
              {files.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1,
                    // border: "1px solid #ccc",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: previewFile ? "column" : "row",
                    alignItems: previewFile ? "flex-start" : "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      mb: previewFile ? 1 : 0,
                      ml: 0.5,
                      mr: 1,
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Selected File :
                  </Typography>

                  {/* Display file preview if it's an image */}
                  {previewFile && (
                    <Box sx={{ mb: 1 }}>
                      <img
                        src={previewFile}
                        alt="Preview"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginTop: "30px",
                          marginBottom: "20px",
                        }}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#6C718A",
                      }}
                    >
                      {files[0].name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={removeFile}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon sx={{ fontSize: "15px", color: "#e8611d" }} />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
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
                    formik.touched.paid_through_account_name &&
                    Boolean(formik.errors.paid_through_account_name)
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
                    color: formik.values.paid_through_account_name
                      ? "gray"
                      : "#aaa",
                  }}
                >
                  {formik.values.paid_through_account_name || "Select an account"}
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
                        category: group._id,
                        options: group.accounts.filter((acc) =>
                          acc.account_name
                            .toLowerCase()
                            .includes(expenseAccSearchTerm.toLowerCase())
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
                            <MenuItem
                              key={`${option.account_id}`}
                              onClick={() => handlePaidThroughAccSelect(option)}
                              sx={{
                                fontSize: "13px",
                                color: "#66686b",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.hover?.background || "",
                                  color: theme.palette.hover?.text || "",
                                },
                                maxWidth: "380px",
                                overflow: "hidden",
                              }}
                            >
                              {option.account_name}
                            </MenuItem>
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
                      fontSize: "13px",
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
              <Typography
                sx={{ width: "160px", fontSize: "13px", color: "#d62134" }}
              >
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
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#409dfb", // on focus
                            },
                          }}
                          value={formik.values.hsn_code || ""}
                          onChange={(e) =>
                            formik.setFieldValue("hsn_code", e.target.value)
                          }
                        />
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
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#409dfb", // on focus
                            },
                          }}
                          value={formik.values.sac_code || ""}
                          onChange={(e) =>
                            formik.setFieldValue("sac_code", e.target.value)
                          }
                        />
                      </Box>
                    </Box>
                  )}
                </>
              )}
          </>

          {/* The Vendor */}

          <Box sx={{ mb: 2 }}>
            <VendorSelect formik={formik} />
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
                    selected={gstTreatment === option.label} // Highlight selected option
                    sx={{
                      fontSize: "13px",
                      maxWidth: "380px",
                      overflow: "hidden",
                      "&.Mui-selected": {
                        backgroundColor:
                          theme.palette.hover?.background || "#187C19",
                        color: theme.palette.hover?.text || "white",
                        borderRadius: "5px",
                        margin: "1px 10px",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.hover?.background || "#187C19",
                          color: theme.palette.hover?.text || "white",
                        },
                      },
                      "&:hover": {
                        backgroundColor:
                          theme.palette.hover?.background || "#187C19",
                        color: theme.palette.hover?.text || "white",
                        borderRadius: "5px",
                        margin: "1px 10px",
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
                          formik.touched.vendor_gst_no &&
                          Boolean(formik.errors.vendor_gst_no)
                        }
                        sx={{ width: "350px" }}
                      >
                        <TextField
                          name="vendor_gst_no"
                          value={formik.values.vendor_gst_no || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter GST Number"
                          fullWidth
                          size="small"
                          error={
                            formik.touched.vendor_gst_no &&
                            Boolean(formik.errors.vendor_gst_no)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "7px",
                              fontSize: "12px",
                              height: "32px",
                              "& fieldset": {
                                borderColor:
                                  formik.touched.vendor_gst_no &&
                                  formik.errors.vendor_gst_no
                                    ? "error.main"
                                    : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor:
                                  formik.touched.vendor_gst_no &&
                                  formik.errors.vendor_gst_no
                                    ? "error.main"
                                    : "#aaa",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor:
                                  formik.touched.vendor_gst_no &&
                                  formik.errors.vendor_gst_no
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
                      {formik.touched.vendor_gst_no &&
                        formik.errors.vendor_gst_no && (
                          <Typography
                            sx={{
                              mb: 1,
                              fontSize: "0.75rem",
                              color: COLORS.error,
                            }}
                          >
                            {formik.errors.vendor_gst_no}
                          </Typography>
                        )}
                    </Box>
                  </Box>

                  <Button
                    // onClick={handleGetTaxpayerDetails}
                    // variant="text"
                    // size="small"
                    sx={{
                      mt: 1,
                      p: 0,
                      textTransform: "none",
                      color: "#1976d2",
                      fontSize: "13px",
                      ml: "20px",
                      fontWeight: "normal",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Get Taxpayer details
                  </Button>
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
                              backgroundColor:
                                theme.palette.hover?.background || "#187C19",
                              color: theme.palette.hover?.text || "white",
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
                          color: "#66686b",
                          "&:hover": {
                            borderRadius: "5px",
                            margin: "1px 10px",
                            backgroundColor:
                              theme.palette.hover?.background || "",
                            color: theme.palette.hover?.text || "",
                          },
                          maxWidth: "380px",
                          overflow: "hidden",
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
                          onChange={(e) => TaxEntered(e)}
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
                                color: "#66686b",
                                "&:hover": {
                                  borderRadius: "5px",
                                  margin: "1px 10px",
                                  backgroundColor:
                                    theme.palette.hover?.background || "",
                                  color: theme.palette.hover?.text || "",
                                },
                                maxWidth: "380px",
                                overflow: "hidden",
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
                        <Box
                          sx={{
                            color: "#6C718A",
                            fontSize: "12px",
                            fontWeight: "400",
                            ml: 0.5,
                            mt: "10px",
                          }}
                        >
                          Tax Amount = {formik.values.expense_tax_amount} INR
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

              {!expense_id && (
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
                      fontSize: "13px",
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

              <Box sx={{ mb: 2, mt: expense_id ? 6 : 2 }}>
                <TableExp
                  formik={formik}
                  expenseAccCategories={filteredExpenseAccOptions}
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
                  name="lineItems[0].description"
                  placeholder="Max. 500 characters"
                  value={formik.values.lineItems[0].description}
                  onChange={(e) => {
                    // Ensure that the text length does not exceed 500 characters
                    if (e.target.value.length <= 500) {
                      formik.handleChange(e);
                    }
                  }}
                  error={
                    formik.touched.lineItems?.[0]?.description &&
                    Boolean(formik.errors.lineItems?.[0]?.description)
                  }
                  sx={{
                    width: "350px",
                  }}
                />
              </Box>
              {formik.touched.lineItems?.[0]?.description &&
                formik.errors.lineItems?.[0]?.description && (
                  <Typography
                    sx={{
                      ml: "160px",
                      mt: -1,
                      mb: 1,
                      fontSize: "0.75rem",
                      color: COLORS.error,
                    }}
                  >
                    {formik.errors.lineItems?.[0]?.description}
                  </Typography>
                )}
            </>
          )}

          <Divider sx={{ my: 4 }} />

          {/* The Customer */}

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
                    borderRadius: "7px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    "&:hover": {
                      borderColor:
                        theme.palette.primary.navbar ||
                        theme.palette.primary.dark ||
                        theme.palette.primary.main,
                    },
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
                              backgroundColor:
                                theme.palette.hover?.background || "#187C19",
                              color: theme.palette.hover?.text || "white",
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
            // elevation={2}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              position: "fixed",
              bottom: 0,
              width: "100%",
              ml: expense_id ? -2.5 : -4.5,
            }}
          >
            {/* <Button
              onClick={() => formik.handleSubmit()}
              variant="outlined"
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
              type="button"
              // onClick={handleSaveAsDraft}
            >
              Save <span style={{ fontSize: "10px" }}>(Alt+S)</span>
            </Button> */}{" "}
            <Button
              onClick={() => formik.handleSubmit()}
              variant="contained"
              disableElevation
              color="primary"
              type="button"
            >
              Save as Open <span style={{ fontSize: "10px" }}>(alt+n)</span>
            </Button>
            <Link
              href="/purchase/bills"
              passHref
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="outlined"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
            </Link>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default RecordExpense;
