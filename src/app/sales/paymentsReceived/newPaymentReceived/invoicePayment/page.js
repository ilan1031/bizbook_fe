"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiService from "../../../../../services/axiosService";
import {
  Box,
  Typography,
  ClickAwayListener,
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
  Modal,
  Menu,
  Link,
  DialogContent,
  DialogActions,
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Autocomplete,
  TableRow,
  Alert,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadIcon from "@mui/icons-material/Upload";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useRouter, useSearchParams } from "next/navigation";
import config from "../../../../../services/config";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useSnackbar } from "../../../../../components/SnackbarProvider";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { CheckBox } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SettingsApplications, SettingsOutlined } from "@mui/icons-material";
import CustomerForm from "../../../../sales/customer/create/page";

// Validation schema
const validationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  // payment_mode: Yup.string().required("Payment mode is required"),
  // payment_id: Yup.string().required("Payment id is required"),
  // deposite_to: Yup.string().required("Paid through account is required"),
  amount: Yup.number().required("Amount is required").min(0, "Minimum is 0"),
});

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
  warning: "#FFA500",
};
const commonStyles = {
  fontSize: "13px",
  "& .MuiInputBase-root": {
    fontSize: "13px",
    minHeight: "36px",
  },
  "& .MuiFormLabel-root": {
    fontSize: "13px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "11px",
  },
  mb: 2,
};
const StyledSelect = styled(Select)({
  height: "35px",
  "& .MuiSelect-select": {
    padding: "6px 12px",
    fontSize: "13px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "7px",
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
const formLabelStyle = {
  fontSize: "13px",
  minWidth: "160px",
  whiteSpace: "nowrap",
  color: "#d62134",
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
// InvoiceTable Component
const InvoiceTable = ({
  customerInvoice,
  onInvoicePaymentChange,
  isBillable,
  totalPaymentAmount,
  onPayInFullClick,
}) => {
  const today = new Date().toISOString().split("T")[0];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace(/^₹/, "");
  };

  const parseNumber = (val) => {
    if (!val) return 0;
    const cleaned = typeof val === "string" ? val.replace(/[₹,]/g, "") : val;
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleAmountChange = (index, amount) => {
    const roundedAmount = parseFloat(parseFloat(amount).toFixed(2)) || 0;
    if (onInvoicePaymentChange) {
      onInvoicePaymentChange(index, roundedAmount);
    }
  };

  const handleClearAppliedAmount = () => {
    if (customerInvoice && customerInvoice.length > 0) {
      const cleared = customerInvoice.map((inv) => ({
        ...inv,
        amount_applied: 0,
      }));

      // Pass the cleared invoices to the parent component
      customerInvoice.forEach((_, index) => {
        onInvoicePaymentChange(index, 0);
      });
    }
  };

  const handlePayInFull = (index) => {
    if (onPayInFullClick) {
      onPayInFullClick(index);
    }
  };

  // If no invoices are available, show message
  if (!customerInvoice || customerInvoice.length === 0) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <TableContainer
          component={Box}
          sx={{
            mt: 3,
            boxShadow: "none !important",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            borderRight: "none ! important",
            borderLeft: "none !important",
          }}
        >
          <Table
            sx={{ minWidth: 650, boxShadow: "none !important" }}
            size="small"
          >
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important",
                    bgcolor: "white !important",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important",
                    bgcolor: "white !important",
                  }}
                >
                  Invoice Number
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important",
                    bgcolor: "white !important",
                  }}
                >
                  Invoice Amount
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important",
                    textAlign: "right",
                    bgcolor: "white !important",
                  }}
                >
                  Amount Due
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important",
                    textAlign: "right",
                    bgcolor: "white !important",
                  }}
                >
                  Payment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ height: "150px" }}>
                <TableCell colSpan={6} sx={{ padding: 0 }}>
                  <Box
                    sx={{
                      height: "150px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "17px",
                      fontWeight: 400,
                    }}
                  >
                    There are no invoices for this customer.
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // Calculate total amount due
  const totalDue = customerInvoice.reduce(
    (sum, invoice) => sum + (Number(invoice.invoice_due_amount) || 0),
    0
  );

  const totalApplied = customerInvoice.reduce(
    (sum, invoice) => sum + (invoice.amount_applied || 0),
    0
  );

  return (
    <>
      <Box
        sx={{ mt: 3, textAlign: "right", color: "#206DDC", cursor: "pointer" }}
        onClick={handleClearAppliedAmount}
      >
        Clear Applied Amount
      </Box>

      <TableContainer
        component={Box}
        sx={{
          boxShadow: "none !important",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          borderRight: "none ! important",
          borderLeft: "none !important",
        }}
      >
        <Table
          sx={{ minWidth: 650, boxShadow: "none !important" }}
          size="small"
        >
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "13px !important",
                  fontWeight: "400 !important",
                  bgcolor: "white !important",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px !important",
                  fontWeight: "400 !important",
                  bgcolor: "white !important",
                }}
              >
                Invoice Number
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px !important",
                  fontWeight: "400 !important",
                  bgcolor: "white !important",
                }}
              >
                Invoice Amount
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px !important",
                  fontWeight: "400 !important",
                  textAlign: "right",
                  bgcolor: "white !important",
                  marginRight: "200px !important",
                }}
              >
                Amount Due
              </TableCell>
              <TableCell></TableCell>
              <TableCell
                sx={{
                  fontSize: "13px !important",
                  fontWeight: "400 !important",
                  textAlign: "right",
                  bgcolor: "white !important",
                  marginLeft: "100px !important",
                }}
              >
                Payment
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customerInvoice.map((invoice, index) => (
              <TableRow key={index} sx={{ height: "60px !important" }}>
                <TableCell sx={{ fontSize: "13px" }}>
                  {invoice.invoice_date}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ color: "gray" }}
                  >
                    Due Date: {invoice.invoice_due_date}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: "13px" }}>
                  {invoice.invoice_number || "N/A"}
                </TableCell>
                <TableCell sx={{ fontSize: "13px" }}>
                  ₹{formatCurrency(parseNumber(invoice.invoice_amount))}
                </TableCell>
                <TableCell sx={{ fontSize: "13px", textAlign: "right" }}>
                  ₹{formatCurrency(parseNumber(invoice.invoice_due_amount))}
                </TableCell>
                <TableCell sx={{ fontSize: "13px", textAlign: "right" }}>
                  {/* {invoice.balance_formatted} */}
                </TableCell>
                <TableCell sx={{ width: "25%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <TextField
                      type="number"
                      size="small"
                      variant="outlined"
                      value={parseFloat(invoice.amount_applied || 0).toFixed(2)}
                      disabled={isBillable}
                      onChange={(e) =>
                        handleAmountChange(index, e.target.value)
                      }
                      sx={{
                        width: "100%",
                        textAlign: "right",
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                          borderRadius: "7px",
                        },
                        "& input": {
                          textAlign: "right",
                        },
                      }}
                    />

                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handlePayInFull(index)}
                      disabled={isBillable}
                      sx={{
                        color: "#206DDC",
                        fontSize: "12px",
                        fontWeight: "400",
                        textAlign: "right",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Pay in Full
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={5} sx={{ padding: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    my: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "400 !important",
                      marginRight: "-100px",
                    }}
                  >
                    Total :
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    my: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "400 !important" }}
                  >
                    ₹ {formatCurrency(totalApplied)}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          mb: 4,
          p: 2,
          borderRadius: "7px",
        }}
      >
        <Box
          sx={{ width: "50%", bgcolor: "#fef4ea", p: 2, borderRadius: "9px" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Amount Paid:
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              ₹{formatCurrency(totalPaymentAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "13px" }}>
              Amount used for Payments:
            </Typography>
            <Typography sx={{ fontSize: "13px" }}>
              ₹{formatCurrency(totalApplied)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "13px" }}>Amount Refunded:</Typography>
            <Typography sx={{ fontSize: "13px" }}>
              ₹ {formatCurrency(0)}
            </Typography>
          </Box>

          {totalPaymentAmount > totalApplied && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WarningAmberIcon
                  sx={{ color: COLORS.warning, fontSize: 18, mr: 0.5 }}
                />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: COLORS.warning,
                  }}
                >
                  Amount in Excess:
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: COLORS.warning,
                }}
              >
                ₹ {formatCurrency(totalPaymentAmount - totalApplied)}
              </Typography>
            </Box>
          )}

          {totalPaymentAmount < totalApplied && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WarningAmberIcon
                  sx={{ color: COLORS.error, fontSize: 18, mr: 0.5 }}
                />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: COLORS.error,
                  }}
                >
                  Payment Amount Insufficient:
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: COLORS.error,
                }}
              >
                ₹ {formatCurrency(totalApplied - totalPaymentAmount)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
// Main component
const CreateInvoicePayment = () => {
  const { showMessage } = useSnackbar();
  const today = new Date().toISOString().split("T")[0];
  const [customers, setCustomers] = useState([]);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [makePermanent, setMakePermanent] = useState(false);

  const filteredCustomers = customers.filter((customer) =>
    customer.contact_name
      .toLowerCase()
      .includes(customerSearchQuery.toLowerCase())
  );

  // Invoices states
  const [customerInvoice, setCustomerInvoices] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isBillable, setIsBillable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("payment_id");
  const [paymentNumber, setPaymentNumber] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [paymentDataCustomerId, setPaymentDataCustomerId] = useState(null);

  const allPaidThroughOptions = [
    { label: "Petty Cash", group: "Cash" },
    { label: "Undeposited Funds", group: "Cash" },
    { label: "Employee Reimbursements", group: "Other Current Liability" },
    { label: "Opening Balance Adjustments", group: "Other Current Liability" },
    { label: "TDS Payable", group: "Other Current Liability" },
    { label: "TCS Payable", group: "Other Current Liability" },
  ];
  const allPaymentModes = [
    "Bank Remittance",
    "Bank Transfer",
    "Cash",
    "Cheque",
    "Credit Card",
    "UPI",
  ];
  const allTdsOptions = [
    "Advance Tax",
    "Employee Advance",
    "Input Tax Credits",
    "Input CGST",
    "Input IGST",
    "Input SGST",
    "Prepaid Expenses",
    "Reverse Charge Tax Input but not due",
    "TCS Receivable",
    "TDS Receivable",
  ];
  const [tdsSearch, setTdsSearch] = useState("");
  const [isTdsOpen, setIsTdsOpen] = useState(false);
  const filteredTdsOptions = allTdsOptions.filter((option) =>
    option.toLowerCase().includes(tdsSearch.toLowerCase())
  );
  const [paymentTermsSearch, setPaymentTermsSearch] = useState("");
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState(false);
  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState(false);
  // Filter terms based on search
  const filteredTerms = allPaymentModes.filter((term) =>
    term.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );

  //pan
  const [panNumber, setPanNumber] = useState("");
  const [openPanDialog, setOpenPanDialog] = useState(false);

  const handleClickPanOpen = () => {
    setPanNumber(selectedCustomer?.pan_no || "");
    setOpenPanDialog(true);
  };
  const handleClosePanDialog = () => setOpenPanDialog(false);
  const handlePanChange = (e) => setPanNumber(e.target.value.toUpperCase());
  const handlePanUpdate = () => {
    console.log("Updated PAN:", panNumber);
    console.log("Make permanent:", makePermanent);
    handleClosePanDialog();
  };

  // File upload handling
  const [anchorEl, setAnchorEl] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleArrowClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
    handleMenuClose();
  };

  const handleFileChange = (e) => {
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
    formik.setFieldValue("documents", selectedFile); // Update Formik field
  };

  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
  };

  // Focus on search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Filter options based on search input
  const filteredOptions = allPaidThroughOptions.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Group options by category
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (!acc[option.group]) {
      acc[option.group] = [];
    }
    acc[option.group].push(option);
    return acc;
  }, {});

  // Focus on search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle dropdown opening and closing
  const handleOpen = () => {
    setIsOpen(true);
    setSearchValue("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  // Handle selection
  const handleSelection = (value) => {
    formik.setFieldValue("deposite_to", value);
    handleClose();
  };

  const organization_id =
    typeof window !== "undefined"
      ? localStorage.getItem("organization_id")
      : null;

  // Fetch customers from API
  // Fetch customers when organization_id is available
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
        showMessage("Failed to fetch customers", "error");
      } finally {
        setLoading(false);
      }
    };

    if (organization_id) {
      fetchCustomers();
    }
    if (payment_id) {
      getPaymentData(payment_id);
    }
  }, [organization_id, payment_id]);
  // Get display data with fallbacks for potentially missing properties
  const getDisplayData = (customer) => {
    return {
      name:
        customer.name ||
        customer.contact_name ||
        customer.customer_name ||
        "Unnamed Customer",
      email:
        customer.email ||
        customer.contact_email ||
        customer.primary_email ||
        "",
      id:
        customer.id ||
        customer.customer_id ||
        customer.contact_id ||
        `temp-${Math.random()}`,
    };
  };

  // Extract first letter for avatar display
  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const handleNewCustomer = () => {
    setShowCustomerForm(true);
    setCustomerDropdownOpen(false);
  };

  const handleSelectCustomer = (customer) => {
    formik.setFieldValue("customer_id", customer.contact_id);
    formik.setFieldValue("contact_id", customer.contact_id);
    formik.setFieldValue("customer_name", customer.contact_name);
    formik.setFieldValue("addressType", "Customer");
    setSelectedCustomer(customer);
    setCustomerDropdownOpen(false);
    fetchCustomerInvoices(customer.contact_id);
  };

  const handleBackFromCustomerForm = () => {
    setShowCustomerForm(false);
  };

  const handleCustomerCreated = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    setSelectedCustomer(newCustomer);
    formik.setFieldValue("customer_id", newCustomer.contact_id);
    formik.setFieldValue("contact_id", newCustomer.contact_id);
    formik.setFieldValue("customer_name", newCustomer.contact_name);
    setShowCustomerForm(false);
  };

  useEffect(() => {
    fetchPaymentId();
  }, []);

  const fetchPaymentId = async () => {
    try {
      if (!organization_id) {
        showMessage("Organization ID not found", "error");
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/payment/id`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });

      if (response.data.status) {
        const { data } = response.data;
        setPaymentNumber(data);
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

  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          console.log("Razorpay script loaded successfully");
          resolve(true);
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadRazorpay();
    }
  }, []);

  useEffect(() => {
    if (payment_id) {
      getPaymentData(payment_id);
    }
  }, [payment_id]);
  // Fetch payment data for editing
  const getPaymentData = async (payment_id) => {
    try {
      setLoading(true);
      let organization_id = localStorage.getItem("organization_id");
      let params = {
        url: `/api/v1/payment/individual?organization_id=${organization_id}&payment_id=${payment_id}`,
        method: "GET",
        customBaseUrl: config.SO_Base_url,
      };
      let response = await apiService(params);

      if (response.statusCode === 200) {
        let paymentData = response.data.data;
        if (paymentData.customer_id) {
          setPaymentDataCustomerId(paymentData.customer_id);
        }

        // Set form values from the payment data
        formik.setValues({
          customer_id: paymentData.customer_id || "",
          contact_id: paymentData.contact_id || "",
          customer_name: paymentData.customer_name || "",
          amount: paymentData.amount || 0,
          payment_number: paymentData.payment_number || "",
          date: new Date(paymentData.date || today).toISOString().split("T")[0],
          payment_mode: paymentData.payment_mode || "Cash",
          deposite_to: paymentData.deposite_to || "Petty Cash",
          reference_number: paymentData.reference_number || "",
          bank_charges: paymentData.bank_charges || "",
          invoices: paymentData.invoices || [],
          description: paymentData.description || "",
          tax_type: paymentData.tax_type || "",
          is_taxable: paymentData.is_taxable || "No Tax deducted",
          // Add other fields as needed
        });

        // If there are invoices in the payment data, update the invoice list
        if (paymentData.invoices && paymentData.invoices.length > 0) {
          const mappedInvoices = paymentData.invoices.map((invoice) => ({
            invoice_id: invoice.invoice_id,
            invoice_number: invoice.invoice_number,
            invoice_date: invoice.date || "",
            invoice_amount: invoice.total || 0,
            invoice_due_amount: invoice.balance + invoice.amount_applied || 0,
            amount_applied: invoice.amount_applied || 0,
            balance: invoice.balance || 0,
            tax_amount_withheld: invoice.tax_amount_withheld || 0,
          }));
          setInvoiceList(mappedInvoices);
        }
      }
    } catch (error) {
      console.log("Error fetching payment data", error);
      showMessage("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentDataCustomerId && customers.length > 0) {
      const customer = customers.find(
        (c) => c.contact_id === paymentDataCustomerId
      );
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
    // setPan
  }, [paymentDataCustomerId, customers]);
  // Helper function to sort invoices by due date (oldest first)
  const sortInvoicesByDueDate = (invoices) => {
    return [...invoices].sort((a, b) => {
      const dateA = new Date(
        a.due_date || a.invoice_due_date || a.date || a.invoice_date
      );
      const dateB = new Date(
        b.due_date || b.invoice_due_date || b.date || b.invoice_date
      );
      return dateA - dateB;
    });
  };
  // Function to distribute payment amount among invoices
  const distributePaymentAmount = (invoices, amount) => {
    let remainingAmount = parseFloat(amount || 0);
    const updatedInvoices = [...invoices];

    // Sort invoices by due date (oldest first)
    updatedInvoices.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    for (let i = 0; i < updatedInvoices.length; i++) {
      if (remainingAmount <= 0) {
        updatedInvoices[i].amount_applied = 0;
        continue;
      }

      const invoice = updatedInvoices[i];
      const dueAmount = parseFloat(invoice.invoice_due_amount || 0);

      if (remainingAmount >= dueAmount) {
        updatedInvoices[i].amount_applied = dueAmount;
        remainingAmount -= dueAmount;
      } else {
        updatedInvoices[i].amount_applied = remainingAmount;
        remainingAmount = 0;
      }
    }

    return updatedInvoices;
  };

  const handleClickAway = () => {
    setCustomerDropdownOpen(false);
  };

  // Fetch Customer invoices when a Customer is selected
  const fetchCustomerInvoices = async (customerId) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/invoice/summary/list?organization_id=${organization_id}&customer_id=${customerId}`,
        customBaseUrl: config.SO_Base_url,
      });

      if (response.statusCode === 200) {
        let invoices = response.data.data.map((inv) => ({
          ...inv,
          amount_applied: 0,
        }));

        // If we're in edit mode and already have invoices, merge with existing applied amounts
        if (
          payment_id &&
          formik.values.invoices &&
          formik.values.invoices.length > 0
        ) {
          invoices = invoices.map((invoice) => {
            const existingInvoice = formik.values.invoices.find(
              (i) => i.invoice_id === invoice.invoice_id
            );
            if (existingInvoice) {
              return {
                ...invoice,
                amount_applied: existingInvoice.amount_applied || 0,
              };
            }
            return invoice;
          });
        }

        setInvoiceList(invoices);

        // If edit mode, distribute the remaining amount
        if (payment_id && parseFloat(formik.values.amount) > 0) {
          const updatedInvoices = distributePaymentAmount(
            invoices,
            parseFloat(formik.values.amount)
          );
          setInvoiceList(updatedInvoices);
        }
      } else {
        setInvoiceList([]);
      }
    } catch (error) {
      showMessage("Failed to load invoices", "error");
      setInvoiceList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoicePaymentChange = (index, amount) => {
    setInvoiceList((prevInvoices) => {
      if (index < 0 || index >= prevInvoices.length) return prevInvoices;
      const updatedInvoices = [...prevInvoices];
      updatedInvoices[index] = {
        ...updatedInvoices[index],
        amount_applied: amount,
      };
      const totalApplied = updatedInvoices.reduce(
        (sum, invoice) => sum + parseFloat(invoice.amount_applied || 0),
        0
      );
      formik.setFieldValue("amount", totalApplied);
      return updatedInvoices;
    });
  };

  // Updated Pay In Full click handler for individual invoices
  const handlePayInFullClick = (index) => {
    setInvoiceList((prevInvoices) => {
      if (index < 0 || index >= prevInvoices.length) return prevInvoices;
      const updatedInvoices = [...prevInvoices];
      const invoiceAmount =
        parseFloat(updatedInvoices[index]?.invoice_due_amount) || 0;
      updatedInvoices[index] = {
        ...updatedInvoices[index],
        amount_applied: invoiceAmount,
      };
      const totalApplied = updatedInvoices.reduce(
        (sum, invoice) => sum + parseFloat(invoice.amount_applied || 0),
        0
      );
      formik.setFieldValue("amount", totalApplied);
      return updatedInvoices;
    });
  };

  // Updated checkbox handler to auto-fill all invoice payments
  const handleMakePermanentChange = (e) => {
    const isChecked = e.target.checked;
    setMakePermanent(isChecked);

    if (isChecked) {
      // Get total outstanding amount to set in the "Amount Received" field
      const outstandingAmount =
        selectedCustomer?.outstanding_receivable_amount || 0;
      formik.setFieldValue("amount", outstandingAmount);

      // Fill each invoice's "Payment" field with its corresponding "Amount Due" value
      if (invoiceList && invoiceList.length > 0) {
        const updatedInvoices = invoiceList.map((invoice) => ({
          ...invoice,
          amount_applied: parseFloat(invoice.invoice_due_amount) || 0,
        }));

        setInvoiceList(updatedInvoices);
      }
    }
  };
  // Handle payment amount changes
  const handlePaymentAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    formik.setFieldValue("amount", newAmount);
    if (isBillable) {
      const updatedInvoices = distributePaymentAmount(
        customerInvoice,
        newAmount
      );
      setCustomerInvoices(updatedInvoices);
    }
  };
  // Handle "Pay full amount" checkbox change
  useEffect(() => {
    if (isBillable && customerInvoice.length > 0) {
      // const paymentAmount = parseFloat(formik.values.amount) || totalAmount;
      const paymentAmount =
        formik.values.amount !== ""
          ? parseFloat(formik.values.amount) || 0
          : totalAmount;
      const updatedInvoices = distributePaymentAmount(
        customerInvoice,
        paymentAmount
      );
      setCustomerInvoices(updatedInvoices);
    }
  }, [isBillable, totalAmount]);

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

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      formType:"Invoice Payment",
      payment_id: "",
      payment_number: "",
      payment_link_id: "",
      created_time: "",
      updated_time: "",
      payment_number_prefix: "",
      payment_number_suffix: "",
      deposite_to: "",
      documents: [],
      customer_id: "",
      customer_name: "",
      place_of_supply: "",
      is_portal_enabled: false,
      payment_mode: "Cash",
      card_type: "",
      card_type_formatted: "",
      date: today,
      date_formatted: "",
      offline_created_date_with_time: "",
      offline_created_date_with_time_formatted: "",
      is_pre_gst: false,
      account_id: "",
      account_name: "",
      account_type: "",
      account_type_formatted: "",
      customer_advance_account_id: "",
      customer_advance_account_name: "",
      currency_id: "",
      currency_symbol: "",
      currency_code: "",
      exchange_rate: 1,
      exchange_rate_formatted: "",
      amount: 0,
      amount_formatted: "",
      unused_amount: 0,
      unused_amount_formatted: "",
      bank_charges: 0.0,
      bank_charges_formatted: "₹0.00",
      tax_account_id: "",
      is_client_review_settings_enabled: false,
      tax_account_name: "",
      tax_amount_withheld: 0.0,
      tax_amount_withheld_formatted: "₹0.00",
      description: "",
      product_description: "",
      reference_number: "",
      online_transaction_id: "",
      payment_gateway: "",
      payment_gateway_formatted: "",
      settlement_status: "",
      settlement_status_formatted: "",
      tds_type: "",
      tds_tax_id: "",
      payment_status: "",
      payment_status_formatted: "",
      payment_refunds: [],
      comments: [],
      last_four_digits: "",
      template_id: "",
      template_name: "",
      page_width: "",
      page_height: "",
      orientation: "",
      template_type: "",
      template_type_formatted: "",
      attachment_name: "",
      can_send_in_mail: true,
      can_send_payment_sms: true,
      is_payment_details_required: true,
      custom_fields: [],
      custom_field_hash: {},
      imported_transactions: [],
      price_precision: 2,
      balance_due_amount: 0,
      invoices: [
        {
          invoice_id: "",
          invoice_number: "",
          date: "",
          date_formatted: "",
          invoice_amount: 0,
          amount_applied: 0,
          amount_applied_formatted: 0,
          tax_amount_withheld_formatted: "",
          tax_amount_withheld: 0,
          balance: 0,
          balance_formatted: "",
          total: 0,
          total_formatted: "",
        },
      ],
      documents: null,
      
    },
    validationSchema,
    // In the formik onSubmit handler, update it like this:
    // Frontend Form Submit Handler - Following Reference Pattern
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const totalApplied = invoiceList.reduce(
          (sum, invoice) => sum + (invoice.amount_applied || 0),
          0
        );

        if (totalApplied > parseFloat(values.amount)) {
          showMessage(
            "Payment amount is less than applied to invoices",
            "error"
          );
          setSubmitting(false);
          return;
        }

        const invoicesData = invoiceList
          .filter((invoice) => invoice.amount_applied > 0)
          .map((invoice) => ({
            invoice_id: invoice.invoice_id,
            invoice_number: invoice.invoice_number,
            invoice_date: invoice.invoice_date,
            invoice_due_date: invoice.invoice_due_date,
            invoice_amount: invoice.invoice_amount,
            invoice_due_amount: invoice.invoice_due_amount,
            amount_applied: invoice.amount_applied,
            balance: invoice.invoice_due_amount - invoice.amount_applied,
            tax_amount_withheld: invoice.tax_amount_withheld || 0,
            amount_applied_formatted: `₹${invoice.amount_applied.toFixed(2)}`,
            tax_amount_withheld_formatted: invoice.tax_amount_withheld
              ? `₹${invoice.tax_amount_withheld.toFixed(2)}`
              : "",
            total: invoice.invoice_amount,
            total_formatted: `₹${invoice?.invoice_amount?.toFixed(2)}`,
            balance_formatted: `₹${(
              invoice.invoice_due_amount - invoice.amount_applied
            ).toFixed(2)}`,
          }));

        const paymentData = {
          ...values,
          organization_id,
          contact_id: selectedCustomer?._id,
          customer_name:
            selectedCustomer?.contact_name || selectedCustomer?.name,
          invoices: invoicesData,
          date_formatted: formatDate(values.date),
          amount_formatted: `₹${values.amount.toFixed(2)}`,
          unused_amount_formatted: 0,
          currency_id: "INR",
          currency_symbol: "₹",
          currency_code: "INR",
          exchange_rate: 1.0,
          exchange_rate_formatted: "₹1.00",
          created_time: new Date().toISOString(),
          updated_time: new Date().toISOString(),
        };

        // If it's an update operation, handle differently
        if (payment_id) {
          const params = {
            method: "PUT",
            url: `/api/v1/payment/individual/update?organization_id=${organization_id}&payment_id=${payment_id}`,
            data: paymentData,
            customBaseUrl: config.SO_Base_url,
          };
          const response = await apiService(params);

          if (response.statusCode === 200) {
            showMessage("Payment updated successfully!", "success");
            router.push(`/sales/paymentsReceived`);
            resetForm();
            setSelectedCustomer(null);
          } else {
            throw new Error("Failed to update payment.");
          }
          return;
        }

        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          showMessage(
            "Payment gateway is loading. Please try again.",
            "warning"
          );
          setSubmitting(false);
          return;
        }
        const orderParams = {
          method: "POST",
          url: `/api/v1/payment/customerpayments?organization_id=${organization_id}`,
          data: paymentData,
          customBaseUrl: config.SO_Base_url,
          file: true,
        };

        const orderResponse = await apiService(orderParams);

        if (orderResponse.statusCode !== 200) {
          throw new Error("Failed to create Razorpay order");
        }

        console.log("Order created:", orderResponse);

        const {
          order,
          payment_id: generatedPaymentId,
          key,
        } = orderResponse.data;

        console.log(
          orderResponse.data.payment_id,
          "orderResponse.dataorderResponse.data"
        );

        // Step 2: Open Razorpay payment gateway (following reference pattern)
        const options = {
          key: key, // Your Razorpay key
          amount: order.amount,
          currency: order.currency,
          name: "Your Company Name",
          description: "Customer Payment",
          order_id: order.id,
          handler: async (response) => {
            try {
              console.log("Payment response from Razorpay:", response);

              // Ensure we're sending the correct payload structure (following reference)
              const verificationPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentData: {
                  ...paymentData,
                  payment_id: generatedPaymentId,
                },
              };

              console.log("Sending verification payload:", verificationPayload);

              // Step 3: Verify payment (following reference pattern)
              const verifyParams = {
                method: "POST",
                url: `/api/v1/payment/verify-payment?organization_id=${organization_id}`,
                data: verificationPayload,
                customBaseUrl: config.SO_Base_url,
              };

              const verifyResponse = await apiService(verifyParams);

              console.log("Verification response:", verifyResponse.data);

              if (verifyResponse.statusCode === 201) {
                showMessage(
                  verifyResponse.data.message ||
                    "Payment completed and recorded successfully!",
                  "success"
                );
                router.push(`/sales/paymentsReceived`);
                resetForm();
                setSelectedCustomer(null);
              } else {
                throw new Error("Failed to verify payment");
              }
            } catch (verifyError) {
              console.error("Payment verification failed:", verifyError);
              console.error("Error response:", verifyError.response?.data);
              showMessage(
                "Payment verification failed. Please contact support.",
                "error"
              );
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name:
              selectedCustomer?.contact_name || selectedCustomer?.name || "",
            email: selectedCustomer?.email || "",
            contact: selectedCustomer?.phone || "",
          },
          notes: {
            payment_id: generatedPaymentId,
            customer_id: selectedCustomer?._id || "",
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: () => {
              alert("Payment modal closed", orderResponse.data.payment_id);
              showMessage("Payment cancelled by user", "warning");
              setSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);

        // Handle payment failures (following reference pattern)
        rzp.on("payment.failed", (response) => {
          console.error("Payment failed:", response.error);
          showMessage(`Payment failed: ${response.error.description}`, "error");
          setSubmitting(false);
        });

        rzp.open();
      } catch (error) {
        console.error("Payment initiation failed:", error);
        showMessage("Failed to initiate payment. Please try again.", "error");
        setSubmitting(false);
      }
    },
    // Add this useEffect to your component to load Razorpay script
  });

  return (
    <Box>
      {loading && payment_id ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Typography>Loading payment data...</Typography>
        </Box>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Box sx={{ mb: 10, ml: 2 }}>
                {/* Title based on edit/create mode */}
                {payment_id && (
                  <Box
                    sx={{
                      width: "100%",
                      fontSize: "22px",
                      fontWeight: "400",
                      py: 2,
                    }}
                  >
                    Edit Invoice Payment
                  </Box>
                )}

                {/* customername */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    sx={{ width: "160px", fontSize: "13px", color: "#d62134" }}
                  >
                    Customer Name *
                  </Typography>

                  <ClickAwayListener onClickAway={handleClickAway}>
                    <Box sx={{ position: "relative", width: "400px" }}>
                      <Box
                        onClick={() =>
                          setCustomerDropdownOpen(!customerDropdownOpen)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "35px",
                          justifyContent: "space-between",
                          border: "1px solid #c4c4c4",
                          borderRadius: "4px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          backgroundColor: "white",
                          "&:hover": {
                            borderColor: "#666",
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: "13px", color: "#666" }}>
                          {selectedCustomer
                            ? selectedCustomer.contact_name
                            : "Select a Customer"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <KeyboardArrowDown
                            sx={{
                              marginLeft: "5px",
                              marginRight: "20px",
                              fontSize: "20px",
                              color: "#666",
                              transform: customerDropdownOpen
                                ? "rotate(180deg)"
                                : "none",
                              transition: "transform 0.2s ease-in-out",
                            }}
                          />

                          <Box>
                            <IconButton
                              size="small"
                              sx={{
                                height: "35px",
                                width: "40px",
                                marginRight: -2,
                                borderRadius: "0 7px 7px 0",
                                backgroundColor: " #408dfb",
                                color: "white",
                                border: "1px solid",
                                borderColor: " #408dfb",
                                borderLeft: "none",
                                "&:hover": {
                                  backgroundColor: "#3a7fe1", // Slightly darker
                                  borderColor: "#3a7fe1",
                                },
                              }}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

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
                              inputRef={searchInputRef}
                              placeholder="Search"
                              size="small"
                              fullWidth
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
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
                            {loading ? (
                              <Box sx={{ p: 2, textAlign: "center" }}>
                                <Typography sx={{ fontSize: "13px" }}>
                                  Loading...
                                </Typography>
                              </Box>
                            ) : customers.length > 0 ? (
                              customers.map((customer, index) => {
                                const displayData = getDisplayData(customer);
                                return (
                                  <Box
                                  key={customer._id}
                                  onClick={() => {
                                    handleSelectCustomer(customer);
                                    formik.setFieldValue("customer_id", customer.contact_id);
                                    formik.setFieldValue("customer_name", customer.contact_name);
                                  }}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "5px",
                                    margin: "5px",
                                    p: 1.2,
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                    color: "inherit",
                                    transition: "background-color 0.2s ease, color 0.2s ease",
                                
                                    "&:hover": {
                                      backgroundColor: "#408dfb",
                                      color: "white",
                                
                                      "& svg": {
                                        fill: "white",
                                      },
                                
                                      "& .customer-email": {
                                        color: "white",
                                      },
                                
                                      "& .customer-avatar": {
                                        backgroundColor: "#fff",
                                        color: "#408dfb",
                                      },
                                    },
                                  }}
                                >
                                  <Box
                                    className="customer-avatar"
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
                                      fontSize: "13px",
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    {getInitial(displayData.name)}
                                  </Box>
                                
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: "medium",
                                      }}
                                    >
                                      {displayData.name}
                                    </Typography>
                                    {displayData.email && (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          mt: 0.5,
                                        }}
                                      >
                                        <Box
                                          component="span"
                                          sx={{
                                            display: "inline-block",
                                            width: "16px",
                                            height: "16px",
                                            mr: 0.5,
                                            "& svg": {
                                              width: "16px",
                                              height: "16px",
                                              fill: "#666",
                                              transition: "fill 0.2s ease",
                                            },
                                          }}
                                        >
                                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                          </svg>
                                        </Box>
                                        <Typography
                                          className="customer-email"
                                          sx={{
                                            fontSize: "12px",
                                            color: "#666",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            maxWidth: "250px",
                                            transition: "color 0.2s ease",
                                          }}
                                        >
                                          {displayData.email}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                                
                                );
                              })
                            ) : (
                              <Box sx={{ p: 2, textAlign: "center" }}>
                                <Typography sx={{ fontSize: "13px" }}>
                                  No customers found
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Box>
                            <Box
                              onClick={handleNewCustomer}
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
                                sx={{
                                  fontSize: "16px",
                                  color: "#4d90fe",
                                  mr: 1,
                                }}
                              />
                              <Typography
                                sx={{ fontSize: "13px", color: "#4d90fe" }}
                              >
                                New Customer
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      )}

                      {/* Full-page dialog for CustomerForm */}
                      {showCustomerForm && (
                        <Dialog
                          open={showCustomerForm}
                          onClose={handleBackFromCustomerForm}
                          fullScreen
                          sx={{
                            "& .MuiDialog-paper": {
                              margin: 0,
                              width: "100%",
                              maxWidth: "100%",
                              height: "100%",
                              maxHeight: "none",
                              overflow: "hidden",
                            },
                          }}
                        >
                          <DialogContent sx={{ padding: 0 }}>
                            <CustomerForm
                              onCustomerCreated={handleCustomerCreated}
                              onCancel={handleBackFromCustomerForm}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </Box>
                  </ClickAwayListener>
                </Box>

                {selectedCustomer && (
                  <>
                    <Box>
                      {/* PAN View */}
                      <Box sx={{ mt: 1, marginLeft: "160px", mb: "40px" }}>
                        <Typography sx={{ fontSize: "13px", color: "" }}>
                          PAN:{" "}
                          <Box
                            component="span"
                            sx={{
                              color: selectedCustomer?.pan_no
                                ? "#408dfb"
                                : "gray",
                              fontWeight: selectedCustomer?.pan_no ? 500 : 400,
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            onClick={handleClickPanOpen}
                          >
                            {selectedCustomer?.pan_no || "Not Available"}
                          </Box>
                        </Typography>
                      </Box>

                      {/* PAN Dialog */}
                      <Dialog
                        open={openPanDialog}
                        onClose={handleClosePanDialog}
                        hideBackdrop
                        PaperProps={{
                          sx: {
                            width: "300px",
                            position: "absolute",
                            top: "25%",
                            left: "33.5%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#fff",
                            border: "1px solid lightgray",
                            borderRadius: "6px",
                            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        <DialogTitle
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "14px",
                            padding: "10px 16px",
                            pb: 0,
                            fontWeight: 500,
                          }}
                        >
                          {selectedCustomer?.pan_no ? "Update PAN" : "Add PAN"}
                          <IconButton
                            onClick={handleClosePanDialog}
                            size="small"
                          >
                            <CloseIcon
                              sx={{ fontSize: "18px", color: "red" }}
                            />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent dividers sx={{ padding: "16px" }}>
                          <TextField
                            value={panNumber}
                            onChange={handlePanChange}
                            fullWidth
                            size="small"
                            placeholder="Enter PAN number"
                            inputProps={{ maxLength: 10 }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "4px",
                                fontSize: "13px",
                                height: "36px",
                              },
                              "& .MuiInputBase-input": {
                                padding: "8px",
                              },
                            }}
                          />
                          <FormControlLabel
                            sx={{ mt: 2 }}
                            control={
                              <InfoOutlinedIcon
                                sx={{
                                  fontSize: "18px",
                                  color: "gray",
                                  margin: "5px",
                                  mt: "-10px",
                                }}
                              />
                            }
                            label={
                              <Typography
                                fontSize="13px"
                                sx={{ fontSize: "13px", color: "gray" }}
                              >
                                This PAN will be updated in contact and further
                                transactions.
                              </Typography>
                            }
                          />
                        </DialogContent>
                        <DialogActions
                          sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}
                        >
                          <Button
                            variant="contained"
                            onClick={handlePanUpdate}
                            size="small"
                          >
                            Save
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                    {/* AMOUNT */}
                    <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                      <Typography sx={{ ...formLabelStyle }}>
                        Amount Received *
                      </Typography>
                      <Box
                        sx={{
                          border: 1,
                          width: "50px",
                          borderColor:
                            formik.touched.amount && formik.errors.amount
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
                        name="amount"
                        placeholder="Amount"
                        type="number"
                        min="0"
                        value={formik.values.amount}
                        onChange={(e) => {
                          formik.handleChange(e);

                          // If amount is manually changed, update the invoice list using the distribute function
                          if (invoiceList && invoiceList.length > 0) {
                            const updatedInvoices = distributePaymentAmount(
                              invoiceList,
                              parseFloat(e.target.value) || 0
                            );
                            setInvoiceList(updatedInvoices);
                          }
                        }}
                        error={
                          formik.touched.amount && Boolean(formik.errors.amount)
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

                    {/* Error Message */}
                    {formik.touched.amount && formik.errors.amount && (
                      <Typography
                        sx={{
                          ml: "160px",
                          mt: -1,
                          mb: 1,
                          fontSize: "0.75rem",
                          color: COLORS.error,
                        }}
                      >
                        {formik.errors.amount}
                      </Typography>
                    )}

                    {/* Checkbox - Updated handler */}
                    <Box sx={{ display: "flex", marginLeft: "160px", mb: 2 }}>
                      <Checkbox
                        checked={makePermanent}
                        onChange={handleMakePermanentChange}
                        sx={{
                          transform: "scale(0.8)",
                          padding: "4px",
                          marginTop: "-6px",
                        }}
                      />
                      <Typography sx={{ fontSize: "13px" }}>
                        Received full amount (
                        {
                          selectedCustomer?.outstanding_receivable_amount_formatted
                        }
                        )
                      </Typography>
                    </Box>

                    {/* Bank Charges */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        sx={{
                          width: "160px",
                          fontSize: "13px",
                        }}
                      >
                        Bank Charges (if any)
                      </Typography>

                      <TextField
                        id="bank_charges"
                        name="bank_charges"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.bank_charges}
                        variant="outlined"
                        size="small"
                        error={
                          formik.touched.bank_charges &&
                          Boolean(formik.errors.bank_charges)
                        }
                        helperText={
                          formik.touched.bank_charges &&
                          formik.errors.bank_charges
                        }
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
                    {/* Payment Date */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        sx={{
                          width: "160px",
                          fontSize: "13px",
                          color: "#d62134",
                        }}
                      >
                        Payment Date *
                      </Typography>
                      <TextField
                        id="date"
                        name="date"
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.date}
                        placeholder="dd/MM/yyyy"
                        variant="outlined"
                        size="small"
                        error={
                          formik.touched.date && Boolean(formik.errors.date)
                        }
                        helperText={formik.touched.date && formik.errors.date}
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
                    {/*  Payment # */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          minWidth: "160px",
                          whiteSpace: "nowrap",
                          color: "#d62134",
                        }}
                      >
                        Payment # *
                      </Typography>
                      <TextField
                        name="payment_number"
                        value={paymentNumber}
                        disabled
                        onChange={(e) => setPaymentNumber(e.target.value)}
                        onBlur={formik.handleBlur}
                        size="small"
                        error={
                          formik.touched.payment_number &&
                          Boolean(formik.errors.payment_number)
                        }
                        helperText={
                          formik.touched.payment_number &&
                          formik.errors.payment_number
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end" disabled>
                                <SettingsOutlined
                                  fontSize="small"
                                  color="#1B6DE0"
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                    {formik.touched.payment_id && formik.errors.payment_id && (
                      <Typography
                        sx={{
                          ml: "160px",
                          mt: -2,
                          mb: 1,
                          fontSize: "0.75rem",
                          color: COLORS.error,
                        }}
                      >
                        {formik.errors.payment_id}
                      </Typography>
                    )}
                    {/* Payment Mode */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body1"
                        sx={{
                          width: "160px",
                          fontSize: "13px",
                          marginTop: "-10px",
                        }}
                      >
                        Payment Mode
                      </Typography>

                      <Grid item xs={5}>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={commonStyles}
                          style={{ width: 350 }}
                        >
                          <StyledSelect
                            name="payment_mode"
                            value={formik.values.payment_mode || ""}
                            onChange={formik.handleChange}
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{ fontSize: "13px", svg: { fontSize: "22px" } }}
                            displayEmpty
                            renderValue={(selected) => {
                              return (
                                selected || (
                                  <Typography
                                    sx={{ color: "#757575", fontSize: "13px" }}
                                  >
                                    Cash
                                  </Typography>
                                )
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
                            {/* Search Field */}
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
                                  value={paymentTermsSearch} // The search value state
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    setPaymentTermsSearch(e.target.value)
                                  } // Update search value
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Box
                                          sx={{ color: "#757575", mr: -0.5 }}
                                        >
                                          <SearchIcon
                                            sx={{ fontSize: "16px", mt: "5px" }}
                                          />
                                        </Box>
                                      </InputAdornment>
                                    ),
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") handleClose();
                                    e.stopPropagation();
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

                            {/* Filtered Options */}
                            {filteredTerms.length > 0 ? (
                              filteredTerms.map((term) => (
                                <MenuItem
                                  key={term}
                                  value={term}
                                  onClick={() => {
                                    setPaymentTermsSearch(term); // Set the search value to the selected term
                                    formik.setFieldValue("payment_term", term); // Set selected term in the form
                                    handleClose(); // Optional: close dropdown on selection
                                  }}
                                  sx={{
                                    fontSize: "13px",
                                    margin: "2px",
                                    borderRadius: "5px",
                                    "&:hover": {
                                      backgroundColor: "#408dfb",
                                      color: "white",
                                    },
                                    ...(formik.values.payment_term === term
                                      ? {
                                          backgroundColor: "#eaf1ff",
                                          "&:hover": {
                                            backgroundColor: "#408dfb",
                                            color: "white",
                                          },
                                        }
                                      : {}),
                                  }}
                                >
                                  {term}
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

                            <Divider />

                            {/* Configure Terms Button */}
                            <Button
                              fullWidth
                              // sx={{
                              //   display: "flex",
                              //   alignItems: "center",
                              //   justifyContent: "flex-start",
                              // }}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsPaymentTermsModalOpen(true);
                              }}
                            >
                              <SettingsOutlinedIcon
                                sx={{ fontSize: "16px", mr: "10px" }}
                              />
                              Configure Terms
                            </Button>
                          </StyledSelect>
                        </FormControl>
                      </Grid>
                    </Box>

                    {/* Deposite To */}
                    <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{
                          width: "160px",
                          fontSize: "13px",
                          color: "#d62134",
                          mt: "-10px",
                        }}
                      >
                        Deposit To *
                      </Typography>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "350px" }}
                        error={
                          formik.touched.deposite_to &&
                          Boolean(formik.errors.deposite_to)
                        }
                      >
                        <StyledSelect
                          name="deposite_to"
                          value={formik.values.deposite_to || ""}
                          onChange={formik.handleChange}
                          IconComponent={KeyboardArrowDownIcon}
                          displayEmpty
                          open={isOpen}
                          onOpen={handleOpen}
                          onClose={handleClose}
                          renderValue={(selected) =>
                            selected ? (
                              <Typography
                                sx={{ fontSize: "13px", color: "#000" }}
                              >
                                {selected}
                              </Typography>
                            ) : (
                              <Typography
                                sx={{ color: "#aaa", fontSize: "13px" }}
                              >
                                Select an account
                              </Typography>
                            )
                          }
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 300 } },
                            MenuListProps: { style: { padding: "0" } },
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left",
                            },
                          }}
                          sx={{
                            fontSize: "13px",
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            svg: { fontSize: "22px" },
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
                                inputRef={searchInputRef}
                                placeholder="Search"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Escape") handleClose();
                                  // Prevent event bubbling to avoid closing the dropdown
                                  e.stopPropagation();
                                }}
                                onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking the search field
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    minHeight: "30px",
                                    "& input": {
                                      padding: "4px 8px",
                                      fontSize: "13px",
                                    },
                                  },
                                }}
                              />
                            </Box>
                          </MenuItem>

                          {/* Display grouped options */}
                          {Object.keys(groupedOptions).length > 0 ? (
                            Object.entries(groupedOptions).map(
                              ([group, items]) => (
                                <React.Fragment key={group}>
                                  <ListSubheader
                                    sx={{
                                      fontSize: "13px",
                                      color: "gray",
                                      backgroundColor: "#f7f7f7",
                                      lineHeight: "28px",
                                      padding: "0 16px",
                                    }}
                                  >
                                    {group}
                                  </ListSubheader>
                                  {items.map((item) => (
                                    <MenuItem
                                      key={item.label}
                                      value={item.label}
                                      onClick={() =>
                                        handleSelection(item.label)
                                      }
                                      sx={{
                                        fontSize: "13px",
                                        borderRadius: "5px",
                                        margin: "2px",
                                        padding: "6px 16px",
                                        "&:hover": {
                                          backgroundColor: "#408dfb",
                                          color: "white",
                                        },
                                        // Highlight selected item
                                        ...(formik.values.deposite_to ===
                                        item.label
                                          ? {
                                              backgroundColor: "#eaf1ff",
                                              "&:hover": {
                                                backgroundColor: "#408dfb",
                                                color: "white",
                                              },
                                            }
                                          : {}),
                                      }}
                                    >
                                      {item.label}
                                    </MenuItem>
                                  ))}
                                </React.Fragment>
                              )
                            )
                          ) : (
                            <MenuItem
                              disabled
                              sx={{ fontSize: "13px", opacity: 0.6 }}
                            >
                              No results found
                            </MenuItem>
                          )}
                        </StyledSelect>
                        {formik.touched.deposite_to &&
                          formik.errors.deposite_to && (
                            <Typography
                              sx={{
                                color: "error.main",
                                fontSize: "11px",
                                m: 1,
                              }}
                            >
                              {formik.errors.deposite_to}
                            </Typography>
                          )}
                      </FormControl>
                    </Box>

                    {/* Reference Number */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography
                        sx={{
                          width: "160px",
                          fontSize: "13px",
                        }}
                      >
                        Reference#
                      </Typography>

                      <TextField
                        id="reference_number"
                        name="reference_number"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.reference_number}
                        variant="outlined"
                        size="small"
                        error={
                          formik.touched.reference_number &&
                          Boolean(formik.errors.reference_number)
                        }
                        helperText={
                          formik.touched.reference_number &&
                          formik.errors.reference_number
                        }
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

                    {/* Tax deducted? */}
                    <Grid item xs={12} sm={4}>
                      <Typography
                        component="label"
                        sx={{
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          mt: "30px",
                        }}
                      >
                        Tax deducted?
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={8} ml={20} mt={-3.5} mb={5}>
                      <RadioGroup
                        row
                        name="is_taxable"
                        value={formik.values.is_taxable}
                        onChange={(event) => {
                          const value = event.target.value;
                          formik.setFieldValue("is_taxable", value);
                          if (value !== "Yes, TDS (Income Tax)") {
                            formik.setFieldValue("tax_type", "");
                            formik.setFieldValue("tax_exemption_id", "");
                          }
                        }}
                      >
                        <FormControlLabel
                          value="No Tax deducted"
                          control={
                            <Radio
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "13px" }}>
                              No Tax deducted
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="Yes, TDS (Income Tax)"
                          control={
                            <Radio
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "13px" }}>
                              Yes, TDS (Income Tax)
                            </Typography>
                          }
                        />
                      </RadioGroup>
                    </Grid>

                    {/* TDS Tax Account (Conditional) */}
                    {formik.values.is_taxable === "Yes, TDS (Income Tax)" && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <Typography
                            component="label"
                            sx={{
                              fontSize: "13px",
                              color: "#d6141d",
                              display: "flex",
                              alignItems: "center",
                              mt: "-10px",
                            }}
                          >
                            TDS Tax Account *
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={8} ml={20} mt={-5}>
                          <FormControl
                            fullWidth
                            size="small"
                            style={{ width: 350, marginTop: "15px" }}
                          >
                            <StyledSelect
                              name="tax_type"
                              value={formik.values.tax_type || ""}
                              onChange={formik.handleChange}
                              IconComponent={KeyboardArrowDownIcon}
                              displayEmpty
                              onOpen={() => setIsTdsOpen(true)}
                              onClose={() => {
                                setIsTdsOpen(false);
                                setTdsSearch("");
                              }}
                              renderValue={(selected) =>
                                selected || (
                                  <Typography
                                    sx={{ color: "#757575", fontSize: "13px" }}
                                  >
                                    Select TDS Tax Account
                                  </Typography>
                                )
                              }
                              MenuProps={{
                                PaperProps: { style: { maxHeight: 300 } },
                                MenuListProps: { style: { padding: "0" } },
                              }}
                              sx={{
                                fontSize: "13px",
                                svg: { fontSize: "22px" },
                              }}
                            >
                              {/* Search Input */}
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
                                    value={tdsSearch}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      setTdsSearch(e.target.value)
                                    }
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <SearchIcon
                                            sx={{
                                              fontSize: "16px",
                                              mt: "5px",
                                              color: "#757575",
                                            }}
                                          />
                                        </InputAdornment>
                                      ),
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Escape")
                                        setIsTdsOpen(false);
                                      e.stopPropagation();
                                    }}
                                    sx={{
                                      marginTop: "5px",
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

                              {/* Filtered Options */}
                              {filteredTdsOptions.length > 0 ? (
                                filteredTdsOptions.map((option) => (
                                  <MenuItem
                                    key={option}
                                    value={option}
                                    onClick={() => {
                                      formik.setFieldValue("tax_type", option);
                                      setTdsSearch(option);
                                      setIsTdsOpen(false);
                                    }}
                                    sx={{
                                      marginTop: "20px",
                                      fontSize: "13px",
                                      margin: "2px",
                                      borderRadius: "5px",
                                      "&:hover": {
                                        backgroundColor: "#408dfb",
                                        color: "white",
                                      },
                                      ...(formik.values.tax_type === option
                                        ? {
                                            backgroundColor: "#eaf1ff",
                                            "&:hover": {
                                              backgroundColor: "#408dfb",
                                              color: "white",
                                            },
                                          }
                                        : {}),
                                    }}
                                  >
                                    {option}
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
                          </FormControl>
                        </Grid>
                      </>
                    )}

                    {/* Invoices Table Section */}
                    <Box sx={{ width: "100%", mt: 4, mb: 4 }}>
                      {/* Custom Billing Table Component */}
                      <InvoiceTable
                        customerInvoice={invoiceList}
                        onInvoicePaymentChange={handleInvoicePaymentChange}
                        onPayInFullClick={handlePayInFullClick}
                        isBillable={isBillable}
                        totalPaymentAmount={
                          parseFloat(formik.values.amount) || 0
                        }
                      />
                    </Box>
                    {/* Notes Section */}
                    <Box mb={3}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{
                          fontWeight: "400 !important",
                          color: "black",
                          fontSize: "13px",
                        }}
                      >
                        Notes (Internal use. Not visible to customer)
                      </Typography>

                      <TextField
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        multiline
                        fullWidth
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "7px",
                            minHeight: "80px",
                            alignItems: "flex-start",
                            "&:hover fieldset": {
                              borderColor: "#408dfb",
                            },
                            "& textarea": {
                              height: "100% !important",
                              padding: 0,
                              boxSizing: "border-box",
                              fontSize: "13px",
                              paddingTop: "0px", // corrected
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Attachments Section */}
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{
                          fontWeight: 400,
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Attachments
                      </Typography>

                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={1}
                        sx={{
                          border: "1px dashed  rgba(0, 0, 0, 0.12)",
                          width: "180px",
                          borderRadius: "4px",
                          "&:hover": { border: "1px dashed  #408dfb" },
                        }}
                      >
                        <Button
                          startIcon={
                            <UploadIcon
                              sx={{
                                color: "gray",
                                "&:hover": {
                                  borderColor: "#408dfb",
                                },
                              }}
                            />
                          }
                          component="label"
                          disableElevation
                          size="small"
                          sx={{
                            textTransform: "none",
                            borderRadius: 1,
                            padding: "6px 16px",
                            // color: "text.primary",
                            // backgroundColor: "background.paper",
                            // "&:hover": {
                            //   backgroundColor: "action.hover",
                            //   borderColor: "#408dfb",
                            // },
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

                        <IconButton
                          onClick={handleArrowClick}
                          sx={{
                            borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                            borderRadius: 1,
                            height: 36,
                            width: 36,
                            // color: "gray",
                            // backgroundColor: "background.paper",
                            // "&:hover": {
                            //   backgroundColor: "action.hover",
                            //   borderColor: "rgba(0, 0, 0, 0.12)",
                            // },
                          }}
                        >
                          <KeyboardArrowDownIcon />
                        </IconButton>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          sx={{
                            marginLeft: "-130px",
                            marginTop: "10px",
                            marginBottom: "20px",
                          }}
                        >
                          <MenuItem
                            onClick={handleFileUpload}
                            sx={{
                              fontSize: "13px",
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                          >
                            Attach From Desktops
                          </MenuItem>
                          <MenuItem
                            onClick={handleMenuClose}
                            sx={{
                              fontSize: "13px",
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                          >
                            Attach From Documents
                          </MenuItem>
                          <MenuItem
                            onClick={handleMenuClose}
                            sx={{
                              fontSize: "13px",
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                          >
                            Attach From Cloud
                          </MenuItem>
                        </Menu>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        You can upload a maximum of 5 files, 10MB each
                      </Typography>

                      {/* {files.length > 0 && (
                      <Box mt={2}>
                        {files.map((file, index) => (
                          <Box
                            key={index}
                            my={1}
                            display="flex"
                            alignItems="center"
                          >
                            <Typography variant="body2">{file.name}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )} */}
                    </Box>
                    {previewFile && (
                      <Box sx={{ display: "flex", gap: 3 }}>
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
                        <Box>
                          <Box onClick={removeFile}>
                            <IconButton size="small" sx={{ mt: 1 }}>
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {/* Additional Fields Section */}
                    <Box
                      mt={4}
                      sx={{ display: "flex", width: "1000px", color: "gray" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 550, color: "gray", width: "150px" }}
                      >
                        Additional Fields:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          width: "1000px",
                          fontSize: "13px",
                        }}
                      >
                        <Typography variant="body2" component="span">
                          Start adding custom fields for your payments made by
                          going to{" "}
                        </Typography>
                        <Link
                          href="#settings"
                          underline="none"
                          component="span"
                          sx={{ color: "gray", ml: "10px" }}
                        >
                          Settings
                        </Link>
                        <ArrowForwardIcon
                          fontSize="small"
                          sx={{
                            fontSize: "20px",
                            fontWeight: 600,
                            mx: 0.6,
                            verticalAlign: "middle",
                          }}
                        />
                        <Link
                          href="#purchases"
                          underline="none"
                          component="span"
                          sx={{ color: "gray" }}
                        >
                          Purchases
                        </Link>
                        <ArrowForwardIcon
                          fontSize="small"
                          sx={{
                            fontSize: "20px",
                            fontWeight: 600,
                            mx: 0.6,
                            verticalAlign: "middle",
                          }}
                        />
                        <Link
                          href="#payments"
                          underline="none"
                          component="span"
                          sx={{ color: "gray" }}
                        >
                          Payments Made
                        </Link>
                        <Typography variant="body2" component="span">
                          .
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                marginTop: "20px",
                position: "fixed",
                left: "15%",
                bottom: 0,
                width: "100%",
                zIndex: 1000,
                backgroundColor: "white",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disableElevation
                disabled={formik.isSubmitting || !selectedCustomer}
                onClick={() => {
                  // Set is_advance_payment to false for final submission
                  formik.setFieldValue("is_advance_payment", false);
                  formik.handleSubmit();
                }}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={() => router.back()}>
                Cancel
              </Button>
            </Paper>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default CreateInvoicePayment;
