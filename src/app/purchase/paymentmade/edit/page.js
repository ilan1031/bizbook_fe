"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiService from "../../../../services/axiosService";
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
import config from "../../../../services/config";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useSnackbar } from "../../../../components/SnackbarProvider";

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
const EditBillPayment = ({ params }) => {
  const paymentId = params?.id;
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
  const [initialLoad, setInitialLoad] = useState(true);
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
  const [existingFiles, setExistingFiles] = useState([]);
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

  // Fetch payment details when component mounts
  useEffect(() => {
    if (paymentId && organization_id) {
      const fetchPaymentDetails = async () => {
        setLoading(true);
        try {
          // Fetch payment details
          const paymentResponse = await apiService({
            method: "GET",
            url: `/api/v1/payments/made/${paymentId}?organization_id=${organization_id}`,
            customBaseUrl: config.PO_Base_url,
          });

          const paymentData = paymentResponse.data.data;

          // Find and set the vendor
          const vendor = vendors.find((v) => v._id === paymentData.contact_id);
          if (vendor) {
            setSelectedVendor(vendor);
          }

          // Fetch vendor bills
          await fetchVendorBills(paymentData.contact_id);

          // Set form values
          formik.setValues({
            payment_id: paymentData.payment_id || "",
            organization_id: organization_id || "",
            contact_id: paymentData.contact_id || "",
            payment_mode: paymentData.payment_mode || "",
            payment_type: paymentData.payment_type || "vendor",
            description: paymentData.description || "",
            date: paymentData.date || today,
            reference_number: paymentData.reference_number || "",
            amount: paymentData.amount || "",
            paid_through_account_id: paymentData.paid_through_account_id || "",
            bills: paymentData.bills || [],
            is_advance_payment: paymentData.is_advance_payment || false,
          });

          // Set existing files
          if (paymentData.documents && paymentData.documents.length > 0) {
            setExistingFiles(paymentData.documents);
          }

          // Set applied amounts for bills
          if (paymentData.bills && paymentData.bills.length > 0) {
            setVendorBills((prevBills) => {
              return prevBills.map((bill) => {
                const appliedBill = paymentData.bills.find(
                  (b) => b.bill_id === bill._id
                );
                return {
                  ...bill,
                  amount_applied: appliedBill ? appliedBill.amount_applied : 0,
                };
              });
            });
          }
        } catch (error) {
          console.error("Error fetching payment details:", error);
          showMessage("Failed to load payment details", "error");
          router.push("/purchase/paymentmade");
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      };

      fetchPaymentDetails();
    }
  }, [paymentId, organization_id, vendors.length]);

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
          documents: [
            ...existingFiles,
            ...files.map((file) => ({
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
              uploaded_on: new Date(),
            })),
          ],
        };

        // Update the payment
        await apiService({
          method: "PUT",
          url: `/api/v1/payments/made/${paymentId}?organization_id=${organization_id}`,
          customBaseUrl: config.PO_Base_url,
          data: paymentData,
        });

        if (billsData.length > 0) {
          // First remove all existing bill applications
          await apiService({
            method: "DELETE",
            url: `/api/v1/payments/made/${paymentId}/bills?organization_id=${organization_id}`,
            customBaseUrl: config.PO_Base_url,
          });

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

        showMessage("Payment successfully updated!", "success");
        // Redirect after short delay
        setTimeout(() => {
          router.push("/purchase/paymentmade");
        }, 500);
      } catch (error) {
        showMessage("Failed to update payment. Please try again.", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle file deletion
  const handleDeleteFile = (index, isExisting) => {
    if (isExisting) {
      setExistingFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Typography>Loading payment details...</Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
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
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default EditBillPayment;
