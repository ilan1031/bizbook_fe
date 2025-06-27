"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiService from "../../../../../../services/axiosService";
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
import { useRouter } from "next/navigation";
import config from "../../../../../../services/config";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useSnackbar } from "../../../../../../components/SnackbarProvider";

// Validation schema
const validationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  payment_mode: Yup.string().required("Payment mode is required"),
  paid_through_account_id: Yup.string().required(
    "Paid through account is required"
  ),
  reference_number: Yup.string().required("Reference number is required"),
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

const StyledSelect = styled(Select)({
  height: "35px",
  "& .MuiSelect-select": {
    padding: "6px 12px",
    fontSize: "14px",
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

// Common styles
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

// BillingTable Component
const BillingTable = ({
  vendorBills,
  onBillPaymentChange,
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

  const handleAmountChange = (index, amount) => {
    if (onBillPaymentChange) {
      onBillPaymentChange(index, parseFloat(amount) || 0);
    }
  };

  const handlePayInFull = (index) => {
    if (onPayInFullClick) {
      onPayInFullClick(index);
    }
  };

  // If no bills are available, show message
  if (!vendorBills || vendorBills.length === 0) {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body2" sx={{ color: "gray", textAlign: "center" }}>
          No bills available for this vendor
        </Typography>
      </Box>
    );
  }

  // Calculate total amount due
  const totalDue = vendorBills.reduce(
    (sum, bill) => sum + (bill.total || 0),
    0
  );
  // Calculate total applied
  const totalApplied = vendorBills.reduce(
    (sum, bill) => sum + (bill.amount_applied || 0),
    0
  );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Bill#
              </TableCell>
              <TableCell sx={{ fontSize: "13px", fontWeight: "bold" }}>
                PO#
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                Bill Amount
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                Amount Due
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                Payment
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendorBills.map((bill, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "13px" }}>
                  {new Date(bill.date || today).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ color: "gray" }}
                  >
                    Due Date:{" "}
                    {bill.due_date
                      ? new Date(bill.due_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: "13px" }}>
                  {bill.billNumber || "N/A"}
                </TableCell>
                <TableCell sx={{ fontSize: "13px" }}>
                  {bill.poNumber || "N/A"}
                </TableCell>
                <TableCell sx={{ fontSize: "13px", textAlign: "right" }}>
                  {formatCurrency(bill.total || 0)}
                </TableCell>
                <TableCell sx={{ fontSize: "13px", textAlign: "right" }}>
                  {formatCurrency(bill.total || 0)}
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
                      value={bill.amount_applied || 0}
                      disabled={isBillable}
                      onChange={(e) =>
                        handleAmountChange(index, e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                        },
                      }}
                    />
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handlePayInFull(index)}
                      disabled={isBillable}
                      sx={{
                        fontSize: "11px",
                        textTransform: "none",
                        color: COLORS.primary,
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Pay in Full
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
          backgroundColor: "#f9f9f9",
          p: 2,
          borderRadius: "4px",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Total :
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              {formatCurrency(totalApplied)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Amount Paid:
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              {formatCurrency(totalPaymentAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "13px" }}>
              Amount used for Payments:
            </Typography>
            <Typography sx={{ fontSize: "13px" }}>
              {formatCurrency(totalApplied)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "13px" }}>Amount Refunded:</Typography>
            <Typography sx={{ fontSize: "13px" }}>
              {formatCurrency(0)}
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
const CreateBillPayment = () => {
  const { showMessage } = useSnackbar();
  const today = new Date().toISOString().split("T")[0];
  // Vendor states
  const [vendors, setVendors] = useState([]);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  // Bills states
  const [vendorBills, setVendorBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isBillable, setIsBillable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const allPaymentModes = [
    "Bank Remittance",
    "Bank Transfer",
    "Cash",
    "Cheque",
    "Credit Card",
    "UPI",
  ];

  const depositeOptions = [
    "Advance Tax",
    "Employee Advance",
    "Prepaid Expenses",
    "TDS Receivable",
    "TCS Receivable",
    "Reverse Charge Tax Inputbut not due",
    "Input Tax Credits",
    "Input IGST",
    "Input CGST",
    "Input SGST",
  ];

  const [paymentTermsSearch, setPaymentTermsSearch] = useState("");
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState(false);
  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState(false);

  // Filter terms based on search
  const filteredTerms = allPaymentModes.filter((term) =>
    term.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );

  // Handle search change
  const handlePaymentSearchChange = (e) => {
    e.stopPropagation();
    setPaymentTermsSearch(e.target.value);
  };

  // File upload handling
  const [anchorEl, setAnchorEl] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 5) {
      showMessage("You can upload a maximum of 5 files.", "error");
      return;
    }

    const validFiles = selectedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    if (validFiles.length !== selectedFiles.length) {
      setAlertMessage(
        "Some files exceed the 10MB size limit and were not added."
      );
      setAlertType("warning");
      setShowAlert(true);
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);

  const allPaidThroughOptions = [
    { label: "Petty Cash", group: "Cash" },
    { label: "Undeposited Funds", group: "Cash" },
    { label: "Employee Reimbursements", group: "Other Current Liability" },
    { label: "TDS Payable", group: "Other Current Liability" },
    { label: "Capital Stock", group: "Equity" },
    { label: "Distributions", group: "Equity" },
    { label: "Dividends Paid", group: "Equity" },
    { label: "Drawings", group: "Equity" },
    { label: "Investments", group: "Equity" },
    { label: "Opening Balance Offset", group: "Equity" },
    { label: "Owner's Equity", group: "Equity" },
    { label: "Employee Advance", group: "Other Current Asset" },
    { label: "TDS Receivable", group: "Other Current Asset" },
  ];

  // Filter options based on search input
  const filteredOptions = allPaidThroughOptions.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Process options to group them
  const groupedOptions = filteredOptions.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
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
    formik.setFieldValue("paid_through_account_id", value);
    handleClose();
  };

  const organization_id =
    typeof window !== "undefined"
      ? localStorage.getItem("organization_id")
      : null;

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/vendors?organization_id=${organization_id}`,
        });
        setVendors(response.data.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        showMessage("Failed to fetch vendors", "error");
      } finally {
        setLoading(false);
      }
    };

    if (organization_id) {
      fetchVendors();
    }
  }, [organization_id]);

  // Filter vendors based on vendor search query
  const filteredVendors = vendors.filter((vendor) =>
    vendor.contact_name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  );

  // Helper function to sort bills by due date (oldest first)
  const sortBillsByDueDate = (bills) => {
    return [...bills].sort((a, b) => {
      const dateA = new Date(a.due_date || a.date);
      const dateB = new Date(b.due_date || b.date);
      return dateA - dateB;
    });
  };

  // Distribute payment amount across bills (oldest first)
  const distributePaymentAmount = (bills, totalPayment) => {
    let remainingPayment = totalPayment;

    // Create a deep copy and sort by due date
    const sortedBills = sortBillsByDueDate(bills).map((bill) => ({
      ...bill,
      amount_applied: 0, // Reset amount applied
    }));

    // Distribute payment to bills (oldest first)
    for (let i = 0; i < sortedBills.length; i++) {
      const bill = sortedBills[i];
      const billAmountDue = bill.total || 0;
      if (remainingPayment <= 0) break;
      // Calculate amount to apply to this bill
      const amountToApply = Math.min(remainingPayment, billAmountDue);
      // Update bill
      bill.amount_applied = amountToApply;
      // Reduce remaining payment
      remainingPayment -= amountToApply;
    }
    return sortedBills;
  };

  // Fetch vendor bills when a vendor is selected
  const fetchVendorBills = async (vendorId) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/bills/vendor-summary?vendor_id=${vendorId}&org_id=${organization_id}`,
        customBaseUrl: config.PO_Base_url,
      });
      const responseData = response?.data?.data;
      if (Array.isArray(responseData)) {
        // Sort by due date and add amount_applied field
        const bills = responseData.map((bill) => ({
          ...bill,
          billNumber: bill.billNumber || "N/A",
          poNumber: bill.poNumber || "N/A",
          date: bill.date || today,
          due_date: bill.due_date || bill.date || today,
          total: parseFloat(bill.total || 0),
          subtotal: parseFloat(bill.subtotal || 0),
          amount_applied: 0, // Initialize this field as required
          bill_id: bill._id || bill.id, // Ensure we have the bill_id
        }));

        // Sort bills by due date (oldest first)
        const sortedBills = sortBillsByDueDate(bills);
        setVendorBills(sortedBills);
        // Calculate the total of the `total` field
        const totalAmount = sortedBills.reduce(
          (sum, bill) => sum + bill.total,
          0
        );
        setTotalAmount(totalAmount);
      } else {
        setVendorBills([]);
        setTotalAmount(0);
      }
    } catch (error) {
      showMessage("Failed to fetch vendor bills", "error");
      setVendorBills([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle amount change in a specific bill
  const handleBillPaymentChange = (index, amount) => {
    setVendorBills((prevBills) => {
      const updatedBills = [...prevBills];
      updatedBills[index].amount_applied = amount;
      const totalApplied = updatedBills.reduce(
        (sum, bill) => sum + (bill.amount_applied || 0),
        0
      );
      formik.setFieldValue("amount", totalApplied);
      return updatedBills;
    });
  };
  // Handle "Pay in Full" for a specific bill
  const handlePayInFullClick = (index) => {
    setVendorBills((prevBills) => {
      const updatedBills = [...prevBills];
      const billAmount = updatedBills[index].total || 0;
      updatedBills[index].amount_applied = billAmount;
      const totalApplied = updatedBills.reduce(
        (sum, bill) => sum + (bill.amount_applied || 0),
        0
      );
      formik.setFieldValue("amount", totalApplied);
      return updatedBills;
    });
  };
  // Handle payment amount changes
  const handlePaymentAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    formik.setFieldValue("amount", newAmount);
    if (isBillable) {
      const updatedBills = distributePaymentAmount(vendorBills, newAmount);
      setVendorBills(updatedBills);
    }
  };
  // Handle "Pay full amount" checkbox change
  useEffect(() => {
    if (isBillable && vendorBills.length > 0) {
      const paymentAmount = parseFloat(formik.values.amount) || totalAmount;
      const updatedBills = distributePaymentAmount(vendorBills, paymentAmount);
      setVendorBills(updatedBills);
    }
  }, [isBillable, totalAmount]);

  const formik = useFormik({
    initialValues: {
      payment_id: "",
      organization_id: organization_id || "",
      contact_id: "",
      payment_mode: "", // Default value
      payment_type: "vendor",
      description: "",
      date: today,
      reference_number: "",
      amount: "",
      paid_through_account_id: "",
      bills: [],
      is_advance_payment: false,
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        // Total payment amount validation
        const totalApplied = vendorBills.reduce(
          (sum, bill) => sum + (bill.amount_applied || 0),
          0
        );

        if (totalApplied > parseFloat(values.amount)) {
          showMessage(
            "Payment amount is less than the total amount applied to bills",
            "error"
          );
          return;
        }
        // Prepare bills data for submission
        const billsData = vendorBills
          .filter((bill) => bill.amount_applied > 0)
          .map((bill) => ({
            bill_id: bill.bill_id || bill._id,
            billNumber: bill.billNumber || "N/A",
            amount_applied: bill.amount_applied,
            total_payment_amount: bill.total || 0,
          }));

        // Check if any bills are selected
        if (billsData.length === 0 && !values.is_advance_payment) {
          showMessage(
            "Please select at least one bill to pay or save as advance payment",
            "warn"
          );
          return;
        }

        // Combine all form data
        const paymentData = {
          ...values,
          contact_id: selectedVendor?._id,
          bills: billsData,
          documents: files.map((file) => ({
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            uploaded_on: new Date(),
          })),
        };

        // First make the payment
        const paymentResponse = await apiService({
          method: "POST",
          url: `/api/v1/payments/made?organization_id=${organization_id}`,
          customBaseUrl: config.PO_Base_url,
          data: paymentData,
        });
        if (paymentResponse.data && billsData.length > 0) {
          const paymentId =
            paymentResponse.data?.data?.payment_id || values.payment_id;
          // Then apply the payment to each bill
          for (const bill of billsData) {
            if (bill.amount_applied > 0) {
              await apiService({
                method: "PUT",
                url: `/api/v1/bills/apply-payment?org_id=${organization_id}&bill_id=${bill.bill_id}`,
                customBaseUrl: config.PO_Base_url,
                data: {
                  amount_applied: bill.amount_applied,
                  payment_id: paymentId,
                },
              });
            }
          }
        }

        showMessage("Payment successfully processed!", "success");
        // Reset form after short delay
        setTimeout(() => {
          resetForm();
          setSelectedVendor(null);
          setVendorBills([]);
          setFiles([]);
          setIsBillable(false);
          setShowAlert(false);
          router.push("/purchase/paymentmade"); // 👈 Corrected route path
        }, 500);
      } catch (error) {
        showMessage("Failed to process payment. Please try again.", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 1200, p: 2, mb: "100px" }}>
      {showAlert && (
        <Alert
          severity={alertType}
          sx={{ mb: 2 }}
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
           
            {/* vendorname */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{ width: "140px", fontSize: "13px", color: "#dc3545" }}
              >
                Vendor Name*
              </Typography>
              <ClickAwayListener
                onClickAway={() => setVendorDropdownOpen(false)}
              >
                <Box sx={{ position: "relative", width: "400px" }}>
                  <Box
                    onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
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
                    <KeyboardArrowDownIcon fontSize="small" />
                  </Box>

                  {vendorDropdownOpen && (
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
                        ) : filteredVendors.length > 0 ? (
                          filteredVendors.map((vendor) => (
                            <Box
                              key={vendor._id}
                              onClick={() => {
                                setSelectedVendor(vendor);
                                setVendorDropdownOpen(false);
                                formik.setFieldValue("contact_id", vendor._id);
                                fetchVendorBills(vendor._id);
                              }}
                              sx={{
                                display: "flex",
                                fontSize: "13px",
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

            {/* Payment # */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{
                  width: "140px",
                  fontSize: "13px",
                  color: "red",
                }}
              >
                Payment # *
              </Typography>

              <Box>
                <TextField
                  id="payment_id"
                  name="payment_id"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.payment_id}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "400px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "4px",
                    },
                    borderRadius: "4px",
                    backgroundColor: "#f9f9f9",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc",
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
                />
              </Box>
            </Box>

            {/*  Payment Made */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{
                  width: "140px",
                  fontSize: "13px",
                  color: "red",
                }}
              >
                Payment Made *
              </Typography>

              <Box>
                <TextField
                  id="amount"
                  name="amount"
                  type="number"
                  onChange={handlePaymentAmountChange}
                  value={formik.values.amount}
                  variant="outlined"
                  size="small"
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  sx={{
                    width: "400px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "4px",
                    },
                    borderRadius: "4px",
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          color="textSecondary"
                          sx={{ fontSize: "13px" }}
                        >
                          ₹
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                {totalAmount > 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isBillable}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsBillable(checked);

                          if (checked) {
                            // If checked, use total amount and distribute to bills
                            formik.setFieldValue("amount", totalAmount);
                          } else {
                            // If unchecked, reset bill amounts but keep total
                            setVendorBills((prevBills) =>
                              prevBills.map((bill) => ({
                                ...bill,
                                amount_applied: 0,
                              }))
                            );
                          }
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
                    label={`Pay full amount (₹${totalAmount.toLocaleString(
                      "en-IN",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )})`}
                    sx={{
                      ml: 1,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "13px",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Payment Date */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography
                sx={{ width: "140px", fontSize: "13px", color: "red" }}
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
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                sx={{
                  width: "400px",
                  "& .MuiOutlinedInput-root": {
                    fontSize: "13px",
                    borderRadius: "4px",
                  },
                  borderRadius: "4px",
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

            {/* Payment Mode */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="body1"
                sx={{ width: "140px", fontSize: "13px", color: "red" }}
              >
                Payment Mode *
              </Typography>

              <Grid item xs={5}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={commonStyles}
                  style={{ width: 400 }}
                  error={
                    formik.touched.payment_mode &&
                    Boolean(formik.errors.payment_mode)
                  }
                >
                  <StyledSelect
                    name="payment_mode"
                    value={formik.values.payment_mode || ""}
                    onChange={formik.handleChange}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{ fontSize: "13px" }}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography
                            sx={{ color: "#757575", fontSize: "13px" }}
                          >
                            Cash
                          </Typography>
                        );
                      }
                      return selected;
                    }}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 300 } },
                      MenuListProps: { style: { padding: "0" } },
                    }}
                    onOpen={() => setIsPaymentTermsOpen(true)}
                    onClose={() => {
                      setIsPaymentTermsOpen(false);
                      setPaymentTermsSearch(""); // clear search on close
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
                      >
                        <TextField
                          autoFocus
                          placeholder="Search"
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={(e) => e.stopPropagation()}
                          value={paymentTermsSearch}
                          onChange={handlePaymentSearchChange}
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

                    {/* Filtered Options */}
                    {filteredTerms.length > 0 ? (
                      filteredTerms.map((term) => (
                        <MenuItem
                          key={term}
                          value={term}
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

                    <Divider sx={{ my: 1 }} />

                    {/* Configure Terms Button */}
                    <Button
                      fullWidth
                      sx={{
                        fontSize: "13px",
                        color: "#408dfb",
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 20px",
                        paddingBottom: "15px",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f0f7ff" },
                        borderRadius: "4px",
                        justifyContent: "flex-start",
                      }}
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
                  {formik.touched.payment_mode &&
                    formik.errors.payment_mode && (
                      <Typography
                        sx={{ color: "error.main", fontSize: "11px", mt: 0.5 }}
                      >
                        {formik.errors.payment_mode}
                      </Typography>
                    )}
                </FormControl>
              </Grid>
            </Box>

            {/* Paid Through */}
            <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  width: "140px",
                  fontSize: "13px",
                  color: "red",
                  paddingTop: "10px",
                }}
              >
                Paid Through *
              </Typography>
              <FormControl
                fullWidth
                size="small"
                sx={{ width: "400px" }}
                error={
                  formik.touched.paid_through_account_id &&
                  Boolean(formik.errors.paid_through_account_id)
                }
              >
                <StyledSelect
                  name="paid_through_account_id"
                  value={formik.values.paid_through_account_id || ""}
                  onChange={formik.handleChange}
                  IconComponent={KeyboardArrowDownIcon}
                  displayEmpty
                  open={isOpen}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  renderValue={(selected) =>
                    selected ? (
                      <Typography sx={{ fontSize: "13px", color: "#000" }}>
                        {selected}
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "#aaa", fontSize: "13px" }}>
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
                    Object.entries(groupedOptions).map(([group, items]) => (
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
                            onClick={() => handleSelection(item.label)}
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
                              ...(formik.values.paid_through_account_id ===
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
                    ))
                  ) : (
                    <MenuItem disabled sx={{ fontSize: "13px", opacity: 0.6 }}>
                      No results found
                    </MenuItem>
                  )}

                  <Divider sx={{ my: 1 }} />

                  {/* Configure Accounts Button */}
                  <MenuItem
                    sx={{
                      fontSize: "13px",
                      color: "#408dfb",
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 16px",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f0f7ff" },
                      borderRadius: "4px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                  >
                    <SettingsOutlinedIcon
                      sx={{ fontSize: "16px", mr: "10px" }}
                    />
                    Configure Accounts
                  </MenuItem>
                </StyledSelect>
                {formik.touched.paid_through_account_id &&
                  formik.errors.paid_through_account_id && (
                    <Typography
                      sx={{ color: "error.main", fontSize: "11px", mt: 0.5 }}
                    >
                      {formik.errors.paid_through_account_id}
                    </Typography>
                  )}
              </FormControl>
            </Box>

            {/* Reference Number */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{
                  width: "140px",
                  fontSize: "13px",
                  color: "red",
                }}
              >
                Reference# *
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
                  width: "400px",
                  "& .MuiOutlinedInput-root": {
                    fontSize: "13px",
                    borderRadius: "4px",
                  },
                  borderRadius: "4px",
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <SettingsIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Bills Table Section */}
            <Box sx={{ width: "100%", mt: 4, mb: 4 }}>
              {/* Custom Billing Table Component */}
              <BillingTable
                vendorBills={vendorBills}
                onBillPaymentChange={handleBillPaymentChange}
                onPayInFullClick={handlePayInFullClick}
                isBillable={isBillable}
                totalPaymentAmount={parseFloat(formik.values.amount) || 0}
              />
            </Box>

            {/* Notes Section */}
            <Box mb={3}>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}
              >
                Notes (Internal use. Not visible to vendor)
              </Typography>

              <TextField
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                multiline
                fullWidth
                variant="outlined"
                sx={{
                  width: "800px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "5px",
                    minHeight: "80px",
                    alignItems: "flex-start", // ensures text starts from the top
                    "&:hover fieldset": {
                      borderColor: "#408dfb",
                    },
                    "& textarea": {
                      height: "100% !important",
                      padding: "12px",
                      boxSizing: "border-box",
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
                sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}
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
                  width: "171px",
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
                  onClick={handleFileInputClick}
                  disableElevation
                  size="small"
                  sx={{
                    textTransform: "none",
                    borderRadius: 1,
                    padding: "6px 16px",
                    color: "text.primary",
                    backgroundColor: "background.paper",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      borderColor: "#408dfb",
                    },
                  }}
                >
                  Upload File
                </Button>

                <IconButton
                  onClick={handleArrowClick}
                  sx={{
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: 1,
                    height: 36,
                    width: 36,
                    color: "gray",
                    backgroundColor: "background.paper",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      borderColor: "rgba(0, 0, 0, 0.12)",
                    },
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
                    onClick={handleFileInputClick}
                    sx={{
                      fontSize: "13px",
                      "&:hover": { backgroundColor: "#408dfb", color: "white" },
                    }}
                  >
                    Attach From Desktop
                  </MenuItem>
                  <MenuItem
                    onClick={handleMenuClose}
                    sx={{
                      fontSize: "13px",
                      "&:hover": { backgroundColor: "#408dfb", color: "white" },
                    }}
                  >
                    Attach From Documents
                  </MenuItem>
                  <MenuItem
                    onClick={handleMenuClose}
                    sx={{
                      fontSize: "13px",
                      "&:hover": { backgroundColor: "#408dfb", color: "white" },
                    }}
                  >
                    Attach From Cloud
                  </MenuItem>
                </Menu>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </Box>

              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                You can upload a maximum of 5 files, 10MB each
              </Typography>

              {files.length > 0 && (
                <Box mt={2}>
                  {files.map((file, index) => (
                    <Box key={index} my={1} display="flex" alignItems="center">
                      <Typography variant="body2">{file.name}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

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
                  Start adding custom fields for your payments made by going to{" "}
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
              disabled={formik.isSubmitting || !selectedVendor}
              sx={{
                textTransform: "none",
                backgroundColor: "#408dfb",
                color: "white",
                borderRadius: "5px",
                px: 2,
                py: 0.75,
                fontWeight: 400,
                fontSize: "14px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#a5c7f9",
                  color: "white",
                },
              }}
              onClick={() => {
                // Set is_advance_payment to false for final submission
                formik.setFieldValue("is_advance_payment", false);
                formik.handleSubmit();
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.back()}
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
            >
              Cancel
            </Button>
          </Paper>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateBillPayment;