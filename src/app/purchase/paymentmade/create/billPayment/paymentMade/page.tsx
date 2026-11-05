"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
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
import { useRouter, useSearchParams } from "next/navigation";
import config from "../../../../../../services/config";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useSnackbar } from "../../../../../../components/SnackbarProvider";

// Validation schema
const validationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  payment_mode: Yup.string().required("Payment mode is required"),
  // payment_id: Yup.string().required("Payment id is required"),
  paid_through_account_id: Yup.string().required(
    "Paid through account is required"
  ),
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
}: any) => {
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
    const roundedAmount = parseFloat(parseFloat(amount).toFixed(2)) || 0;
    if (onBillPaymentChange) {
      onBillPaymentChange(index, roundedAmount);
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
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important" as const,
                    bgcolor: "white !important",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important" as const,
                    bgcolor: "white !important",
                  }}
                >
                  Bill#
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important" as const,
                    textAlign: "right" as const,
                    bgcolor: "white !important",
                  }}
                >
                  Bill Amount
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important" as const,
                    textAlign: "right" as const,
                    bgcolor: "white !important",
                  }}
                >
                  Amount Due
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px !important",
                    fontWeight: "400 !important" as const,
                    textAlign: "right" as const,
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
                      display: "flex" as const,
                      alignItems: "center" as const,
                      justifyContent: "center" as const,
                      fontSize: "17px",
                      fontWeight: 400,
                    }}
                  >
                    There are no bills for this vendor.
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
      <Box
        sx={{
          mt: 3,
          textAlign: "right" as const,
          color: "#206DDC",
          fontSize: "12px",
          fontWeight: "400" as const,
        }}
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
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "600" as const,
                  borderBottom: "2px solid #dee2e6",
                  padding: "12px 16px",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "600" as const,
                  borderBottom: "2px solid #dee2e6",
                  padding: "12px 16px",
                }}
              >
                Bill#
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "600" as const,
                  textAlign: "right" as const,
                  borderBottom: "2px solid #dee2e6",
                  padding: "12px 16px",
                }}
              >
                Bill Amount
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "600" as const,
                  textAlign: "right" as const,
                  borderBottom: "2px solid #dee2e6",
                  padding: "12px 16px",
                }}
              >
                Amount Due
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "13px",
                  fontWeight: "600" as const,
                  textAlign: "right" as const,
                  borderBottom: "2px solid #dee2e6",
                  padding: "12px 16px",
                }}
              >
                Payment
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vendorBills.map((bill, index) => (
              <TableRow
                key={index}
                sx={{
                  height: "60px",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                  borderBottom: "1px solid #e9ecef",
                }}
              >
                <TableCell
                  sx={{
                    fontSize: "13px",
                    padding: "12px 16px",
                    verticalAlign: "top" as const,
                  }}
                >
                  {new Date(bill.date || today).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      color: "#6c757d",
                      fontSize: "11px",
                      mt: 0.5,
                    }}
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
                <TableCell
                  sx={{
                    fontSize: "13px",
                    padding: "12px 16px",
                  }}
                >
                  {bill.billNumber || "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px",
                    textAlign: "right" as const,
                    padding: "12px 16px",
                  }}
                >
                  ₹{formatCurrency(bill.total || 0)}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px",
                    textAlign: "right" as const,
                    padding: "12px 16px",
                  }}
                >
                  ₹{formatCurrency(bill.due_amt || 0)}
                </TableCell>

                <TableCell
                  sx={{
                    width: "25%",
                    padding: "12px 16px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex" as const,
                      flexDirection: "column" as const,
                      alignItems: "flex-end" as const,
                      gap: 1,
                    }}
                  >
                    <TextField
                      type="number"
                      size="small"
                      variant="outlined"
                      value={parseFloat(bill.amount_applied || 0).toFixed(2)}
                      disabled={isBillable}
                      onChange={(e) =>
                        handleAmountChange(index, (e.target as any).value)
                      }
                      // A bill can't be paid more than what's still due on it.
                      error={Number(bill.amount_applied || 0) > Number(bill.due_amt || 0)}
                      helperText={
                        Number(bill.amount_applied || 0) > Number(bill.due_amt || 0)
                          ? `Can't exceed the ₹${formatCurrency(bill.due_amt || 0)} due`
                          : ""
                      }
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                          borderRadius: "6px",
                          height: "36px",
                        },
                        "& input": {
                          textAlign: "right" as const,
                          padding: "8px 12px",
                        },
                      }}
                    />

                    <Button
                      variant={"text" as any}
                      size="small"
                      onClick={() => handlePayInFull(index)}
                      disabled={isBillable}
                      sx={{
                        color: "#206DDC",
                        fontSize: "11px",
                        fontWeight: "400" as const,
                        textAlign: "right" as const,
                        minHeight: "auto",
                        padding: "2px 4px",
                        "&:hover": {
                          backgroundColor: "rgba(32, 109, 220, 0.08)",
                        },
                      }}
                    >
                      Pay in Full
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            <TableRow
              sx={{
                backgroundColor: "#f8f9fa",
                borderTop: "2px solid #dee2e6",
              }}
            >
              <TableCell
                colSpan={4}
                sx={{
                  padding: "12px 16px",
                  borderBottom: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex" as const,
                    justifyContent: "flex-end" as const,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "600" as const,
                    }}
                  >
                    Total:
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  padding: "12px 16px",
                  borderBottom: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex" as const,
                    justifyContent: "flex-end" as const,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "600" as const,
                      color: "#206DDC",
                    }}
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
          display: "flex" as const,
          justifyContent: "flex-end" as const,
          mt: 2,
          mb: 4,
          p: 2,
          borderRadius: "7px",
        }}
      >
        <Box
          sx={{ width: "50%", bgcolor: "#fef4ea", p: 2, borderRadius: "9px" }}
        >
          <Box sx={{ display: "flex" as const, justifyContent: "space-between" as const, mb: 1 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" as const }}>
              Amount Paid:
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" as const }}>
              ₹{formatCurrency(totalPaymentAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" as const, justifyContent: "space-between" as const, mb: 1 }}>
            <Typography sx={{ fontSize: "13px" }}>
              Amount used for Payments:
            </Typography>
            <Typography sx={{ fontSize: "13px" }}>
              ₹{formatCurrency(totalApplied)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" as const, justifyContent: "space-between" as const, mb: 1 }}>
            <Typography sx={{ fontSize: "13px" }}>Amount Refunded:</Typography>
            <Typography sx={{ fontSize: "13px" }}>
              ₹ {formatCurrency(0)}
            </Typography>
          </Box>

          {totalPaymentAmount > totalApplied && (
            <Box
              sx={{
                display: "flex" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                <WarningAmberIcon
                  sx={{ color: COLORS.warning, fontSize: 18, mr: 0.5 }}
                />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold" as const,
                    color: COLORS.warning,
                  }}
                >
                  Amount in Excess:
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold" as const,
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
                display: "flex" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                <WarningAmberIcon
                  sx={{ color: COLORS.error, fontSize: 18, mr: 0.5 }}
                />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold" as const,
                    color: COLORS.error,
                  }}
                >
                  Payment Amount Insufficient:
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold" as const,
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
const CreateBillPayment = (_props?: any) => {
  const { showMessage } = useSnackbar();
  const today = new Date().toISOString().split("T")[0];
  // Vendor states
  const [vendors, setVendors] = useState<any>([]);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState<any>("");
  // Bills states
  const [vendorBills, setVendorBills] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isBillable, setIsBillable] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<any>("");
  const [alertType, setAlertType] = useState<string>("info");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const payment_id = searchParams.get("paymentId");
  const [paymentUniqueId,setPaymentUniqueId] = useState<any>(null);
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

  const [paymentTermsSearch, setPaymentTermsSearch] = useState<any>("");
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState<boolean>(false);
  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState<boolean>(false);

  // Filter terms based on search
  const filteredTerms = allPaymentModes.filter((term) =>
    term.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );

  // Handle search change
  const handlePaymentSearchChange = (e) => {
    e.stopPropagation();
    setPaymentTermsSearch((e.target as any).value);
  };

  // File upload handling
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [files, setFiles] = useState<any>([]);
  const fileInputRef = useRef<any>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);

  const handleArrowClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(()=>{
      getUniqueId();
    },[])
  
    const getUniqueId = async () => {
      try {
        const params = {
          url: "api/v1/common/get-unique-id",
          method: "POST",
          data: { module: "payment_made" },
          customBaseUrl: config.apiBaseUrl,
        };
        const response = await apiService(params);
        if (response.statusCode == 200) {
          setPaymentUniqueId(response.data.data);
          formik.setFieldValue("payment_id",response.data.data)
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
        showMessage(
          "Error fetching organization data. Please try again.",
          "error"
        );
      } finally {
      }
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
  const [searchValue, setSearchValue] = useState<any>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchInputRef = useRef<any>(null);

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

  // Handle file uploads
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
    // formik.setFieldValue("documents", selectedFile); // Update Formik field
    console.log(selectedFile, "=======selectedFile==+++");
  };

  // Remove selected file
  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
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
        // "Record Payment" on a bill: start with its vendor and that bill.
        const presetVendor = searchParams.get("vendor_id");
        if (presetVendor && !payment_id) {
          const vendor = (response.data.data || []).find((v) => String(v._id) === String(presetVendor));
          if (vendor) {
            setSelectedVendor(vendor);
            formik.setFieldValue("contact_id", vendor._id);
            fetchVendorBills(vendor._id, { preselectBillId: searchParams.get("bill_id") });
          }
        }
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
    if (payment_id) {
      // console.log("payment_id----", payment_id);
      getPaymentData(payment_id);
    }
  }, [organization_id, payment_id]);
  const getPaymentData = async (payment_id) => {
    // Editing: the bills come with what this payment applied to each.
    try {
      let params = {
        url: `api/v1/payments/allpayment?payment_id=${payment_id}&organization_id=${organization_id}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      let response = await apiService(params);
      if (response.statusCode == 200) {
        let paymentData = response.data.data.payment;
        const vendor = paymentData.contact_id;
        if (vendor) {
          setSelectedVendor(vendor);
        }

        // Set form values
        formik.setValues({
          payment_id: paymentData.payment_id,
          organization_id: organization_id || "",
          contact_id: paymentData.contact_id._id,
          payment_mode: paymentData.payment_mode || "cash",
          // The type of a saved payment doesn't change on edit.
          payment_type: paymentData.payment_type || "BillPayment",
          paid_through_account_name: paymentData.paid_through_account_name || "",
          description: paymentData.description || "",
          date: new Date(paymentData.date).toISOString().split("T")[0],
          reference_number: paymentData.reference_number || "",
          amount: paymentData.amount || 0,
          paid_through_account_id: paymentData.paid_through_account_id || "",
          bills: [] as any[],
          is_advance_payment: paymentData.is_advance_payment || false,
          documents: files[0],
        });

        // Fetch vendor bills after setting the form values
        await fetchVendorBills(paymentData.contact_id._id);

        // If this is a billable payment, set the flag
        // console.log("paymentData.bills.length", paymentData.bills);
        // if (paymentData.bills.length > 0) {
        //   setIsBillable(true);
        // }
      }
    } catch (error) {
      console.log("getPaymentData error", error);
      showMessage("Something went wrong", "error");
    }
  };

  // Filter vendors based on vendor search query
  const filteredVendors = vendors.filter((vendor) =>
    vendor.contact_name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  );

  // Helper function to sort bills by due date (oldest first)
  const sortBillsByDueDate = (bills) => {
    return [...bills].sort((a, b) => {
      const dateA = new Date(a.due_date || a.date);
      const dateB = new Date(b.due_date || b.date);
      return (dateA as any) - (dateB as any);
    });
  };

  // Distribute payment amount across bills (oldest first)
  const distributePaymentAmount = (bills, totalPayment) => {
    let remainingPayment = parseFloat(totalPayment || 0);

    // Create a deep copy and sort by due date
    const sortedBills = sortBillsByDueDate(bills).map((bill) => ({
      ...bill,
      amount_applied: 0, // Reset amount applied
    }));

    // Distribute payment to bills (oldest first)
    for (let i = 0; i < sortedBills.length; i++) {
      const bill = sortedBills[i];
      console.log(bill.due_amt, "amount");
      const billAmountDue = bill.due_amt || 0;
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
  const fetchVendorBills = async (vendorId, { preselectBillId } = {} as any) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/bills/vendor-summary?vendor_id=${vendorId}&org_id=${organization_id}${
          payment_id ? `&payment_id=${encodeURIComponent(payment_id)}` : ""
        }`,
        customBaseUrl: config.PO_Base_url,
      });
      // console.log("response-----", response);
      const responseData = response?.data?.data;
      if (Array.isArray(responseData)) {
        // Sort by due date and add amount_applied field
        const bills = responseData.map((bill) => {
          // When editing, what this payment already applied is available
          // to it again, so it counts towards the amount due.
          const appliedHere = payment_id ? parseFloat(bill.applied_in_payment || 0) : 0;
          const due = Math.round((parseFloat(bill.due_amt || 0) + appliedHere) * 100) / 100;
          const preselect = preselectBillId && String(bill.id || bill._id) === String(preselectBillId);
          return {
            ...bill,
            billNumber: bill.billNumber || "N/A",
            poNumber: bill.poNumber || "N/A",
            date: bill.date || today,
            due_date: bill.due_date || bill.date || today,
            total: parseFloat(bill.total || 0),
            due_amt: due,
            amount_applied: preselect ? due : appliedHere,
            bill_id: bill._id || bill.id, // Ensure we have the bill_id
          };
        });
        if (preselectBillId) {
          const applied = bills.reduce((sum, b) => sum + (b.amount_applied || 0), 0);
          if (applied > 0) formik.setFieldValue("amount", applied);
        }
        // console.log(payment_id, "payment_id");
        // Sort bills by due date (oldest first)
        const sortedBills = sortBillsByDueDate(bills);
        setVendorBills(sortedBills);
        // Calculate the total of the `total` field
        const totalAmount = sortedBills.reduce(
          (sum, bill) => sum + bill.due_amt,
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
      updatedBills[index] = { ...updatedBills[index], amount_applied: amount };
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
      // console.log("prevBills", prevBills);
      const updatedBills = [...prevBills];
      // Pay what's still due, not the bill's original total.
      const billAmount = updatedBills[index].due_amt || 0;
      updatedBills[index] = { ...updatedBills[index], amount_applied: billAmount };
      const totalApplied = updatedBills.reduce(
        (sum, bill) => sum + (bill.amount_applied || 0),
        0
      );
      formik.setFieldValue("amount", totalApplied);
      return updatedBills;
    });
  };
  // Handle payment amount changes
  const handlePaymentAmountChange = (value) => {
    const newAmount = parseFloat(value) || 0;
    formik.setFieldValue("amount", newAmount);
    const updatedBills = distributePaymentAmount(vendorBills, newAmount);
    setVendorBills(updatedBills);
  };
  // Handle "Pay full amount" checkbox change
  useEffect(() => {
    if (isBillable && vendorBills.length > 0) {
      const paymentAmount = parseFloat(formik.values.amount) || totalAmount;
      const updatedBills = distributePaymentAmount(vendorBills, paymentAmount);
      setVendorBills(updatedBills);
    }
  }, [isBillable, totalAmount]);

  const submitLock = useRef<boolean>(false);
  const formik = useFormik<any>({
    initialValues: {
      payment_id: "",
      organization_id: organization_id || "",
      contact_id: "",
      payment_mode: "Cash",
      payment_type: "BillPayment",
      description: "",
      date: today,
      reference_number: "",
      amount: "",
      paid_through_account_id: "Petty Cash",
      paid_through_account_name:"",
      bills: [] as any[],
      is_advance_payment: false,
      documents: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        // Total payment amount validation
        // console.log("object", values);
        // return;
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
        const overpaid = vendorBills.find(
          (bill) => Number(bill.amount_applied || 0) > Number(bill.due_amt || 0)
        );
        if (overpaid) {
          showMessage(
            `Bill ${overpaid.billNumber} has only ₹${Number(overpaid.due_amt || 0).toFixed(2)} due. Reduce the amount applied to it.`,
            "error"
          );
          return;
        }
        if (submitLock.current) return;
        submitLock.current = true;
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
        };

        // Add document if files exist
        if (files && files.length > 0 && files[0].name) {
          paymentData.documents = files[0].name;
        }

        let params = {
          method: payment_id ? "PUT" : "POST",
          url: payment_id
            ? `/api/v1/payments/update?organization_id=${organization_id}&payment_id=${payment_id}`
            : `/api/v1/payments/made?organization_id=${organization_id}`,
          customBaseUrl: config.PO_Base_url,
          data: paymentData,
          file: true,
        };
        // The server saves the payment and applies it to the bills in one
        // step (and, on edit, takes the old amounts back first).
        const paymentResponse = await apiService(params);
        const savedPaymentId = payment_id || paymentResponse.data?.data?.payment_id;
        if (!savedPaymentId) {
          throw new Error(paymentResponse.data?.message || "The payment couldn't be saved.");
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
          router.push(`/purchase/paymentmade/${savedPaymentId}`);
        }, 500);
      } catch (error) {
        showMessage(error?.message || "The payment couldn't be saved.", "error");
      } finally {
        submitLock.current = false;
        setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      {/* {showAlert && (
      <Alert
        severity={alertType as any}
        sx={{ mb: 2 }}
        onClose={() => setShowAlert(false)}
      >
        {alertMessage}
      </Alert>
    )} */}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 10 }}>
              {/* vendorname */}
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 2, py: 2 }}>
                <Typography
                  sx={{ width: "160px", fontSize: "13px", color: "#d62134" }}
                >
                  Vendor Name*
                </Typography>
                <ClickAwayListener
                  onClickAway={() => setVendorDropdownOpen(false)}
                >
                  <Box sx={{ position: "relative" as const, width: "350px" }}>
                    <Box
                      onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                      sx={{
                        display: "flex" as const,
                        alignItems: "center" as const,
                        height: "35px",
                        justifyContent: "space-between" as const,
                        border: "1px solid #c4c4c4",
                        borderRadius: "7px",
                        padding: "8px 14px",
                        cursor: "pointer" as const,
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
                      <KeyboardArrowDownIcon
                        fontSize="small"
                        sx={{
                          transform: vendorDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                          fontSize: "22px",
                          marginRight: "-10px",
                        }}
                      />
                    </Box>

                    {vendorDropdownOpen && (
                      <Paper
                        elevation={3}
                        sx={{
                          position: "absolute" as const,
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
                            onChange={(e) =>
                              setVendorSearchQuery((e.target as any).value)
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

                        <Box sx={{ maxHeight: "300px", overflowY: "auto" as const }}>
                          {loading ? (
                            <Box sx={{ p: 2, textAlign: "center" as const }}>
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
                                  formik.setFieldValue(
                                    "contact_id",
                                    vendor._id
                                  );
                                  fetchVendorBills(vendor._id);
                                }}
                                sx={{
                                  display: "flex" as const,
                                  fontSize: "13px",
                                  alignItems: "center" as const,
                                  borderRadius: "5px",
                                  margin: "5px",
                                  p: 1.2,
                                  cursor: "pointer" as const,
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
                                    display: "flex" as const,
                                    alignItems: "center" as const,
                                    justifyContent: "center" as const,
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
                                      fontWeight: "medium" as const,
                                    }}
                                  >
                                    {vendor.contact_name}
                                  </Typography>
                                  {vendor.email && (
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "darkgray",
                                        textOverflow: "ellipsis" as const,
                                        overflow: "hidden" as const,
                                        whiteSpace: "nowrap" as const,
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
                            <Box sx={{ p: 2, textAlign: "center" as const }}>
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
                              display: "flex" as const,
                              alignItems: "center" as const,
                              p: 1.5,
                              borderTop: "1px solid #eee",
                              cursor: "pointer" as const,
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
              {selectedVendor && (
                <>
                  {/*  Payment # */}
                  {/* <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        minWidth: "160px",
                        whiteSpace: "nowrap" as const,
                        color: "#d62134",
                      }}
                    >
                      Payment # *
                    </Typography>
                    <TextField
                      id="payment_id"
                      name="payment_id"
                      type="text"
                      disabled
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.payment_id}
                      variant="outlined"
                      size="small"
                      error={
                        formik.touched.payment_id &&
                        Boolean((formik.errors.payment_id as any))
                      }
                      // helperText={formik.touched.payment_id && (formik.errors.payment_id as any)}
                      sx={{
                        width: "350px",
                        height: "35px",
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
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000", // Makes text black even when disabled
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <SettingsIcon
                                fontSize="small"
                                sx={{ marginRight: "-12px" }}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {formik.touched.payment_id && (formik.errors.payment_id as any) && (
                    <Typography
                      sx={{
                        ml: "160px",
                        mt: -2,
                        mb: 1,
                        fontSize: "0.75rem",
                        color: COLORS.error,
                      }}
                    >
                      {(formik.errors.payment_id as any)}
                    </Typography>
                  )} */}

                  {/*   Payment Made * */}
                  <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        minWidth: "160px",
                        whiteSpace: "nowrap" as const,
                        color: "#d62134",
                      }}
                    >
                      Payment Made *
                    </Typography>
                    <TextField
                      id="amount"
                      name="amount"
                      type="text"
                      onChange={(e) => {
                        let value = (e.target as any).value;

                        // Allow only digits and decimal point
                        if (!/^\d*\.?\d{0,2}$/.test(value)) return;

                        // Enforce max length of 15 characters
                        if (value.length > 15) return;

                        // Allow only numbers and one decimal point
                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                          formik.setFieldValue("amount", value);
                          handlePaymentAmountChange(value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseFloat((e.target as any).value);
                        if (!isNaN(value)) {
                          formik.setFieldValue("amount", value.toFixed(2));
                        }
                      }}
                      value={formik.values.amount}
                      variant="outlined"
                      size="small"
                      sx={{
                        width: "350px",
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                          borderRadius: "7px",
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
                      error={
                        formik.touched.amount && Boolean((formik.errors.amount as any))
                      }
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
                  </Box>
                  {formik.touched.amount && (formik.errors.amount as any) && (
                    <Typography
                      sx={{
                        ml: "160px",
                        mt: -2,
                        mb: 1,
                        fontSize: "0.75rem",
                        color: COLORS.error,
                      }}
                    >
                      {(formik.errors.amount as any)}
                    </Typography>
                  )}

                  {/* Payment Date */}
                  <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 2 }}>
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
                      error={formik.touched.date && Boolean((formik.errors.date as any))}
                      helperText={formik.touched.date && (formik.errors.date as any)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputRef={(ref) => {
                        // Capture the input ref to trigger click programmatically
                        if (ref) {
                          ref.onclick = () =>
                            ref.showPicker && (ref as any).showPicker(); // For modern browsers
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

                  {/* Payment Mode */}
                  <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                    <Typography
                      variant="body1"
                      sx={{
                        width: "160px",
                        fontSize: "13px",
                        marginTop: "-10px",
                      }}
                    >
                      Payment Mode *
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
                          renderValue={(selected: any) => {
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
                            sx={{ cursor: "default" as const, p: 0 }}
                          >
                            <Box
                              sx={{
                                p: 0.75,
                                position: "sticky" as const,
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
                                  setPaymentTermsSearch((e.target as any).value)
                                } // Update search value
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

                          <Divider sx={{ my: 1 }} />

                          {/* Configure Terms Button */}
                          <Button
                            fullWidth
                            sx={{
                              fontSize: "13px",
                              color: "#408dfb",
                              display: "flex" as const,
                              alignItems: "center" as const,
                              padding: "5px 20px",
                              paddingBottom: "15px",
                              cursor: "pointer" as const,
                              "&:hover": { backgroundColor: "#f0f7ff" },
                              borderRadius: "4px",
                              justifyContent: "flex-start" as const,
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
                      </FormControl>
                    </Grid>
                  </Box>

                  {/* Paid Through */}
                  <Box mb={2} sx={{ display: "flex" as const, alignItems: "center" as const }}>
                    <Typography
                      sx={{
                        width: "160px",
                        fontSize: "13px",
                        color: "#d62134",
                        mt: "-10px",
                      }}
                    >
                      Paid Through *
                    </Typography>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "350px" }}
                      error={
                        formik.touched.paid_through_account_id &&
                        Boolean((formik.errors.paid_through_account_id as any))
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
                        renderValue={(selected: any) =>
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
                          sx={{ cursor: "default" as const, p: 0 }}
                        >
                          <Box
                            sx={{
                              p: 0.75,
                              position: "sticky" as const,
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
                              onChange={(e) => setSearchValue((e.target as any).value)}
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
                          Object.entries(groupedOptions).flatMap(
                            ([group, items]) => [
                                <ListSubheader key={`group-${group}`}
                                  sx={{
                                    fontSize: "13px",
                                    color: "gray",
                                    backgroundColor: "#f7f7f7",
                                    lineHeight: "28px",
                                    padding: "0 16px",
                                  }}
                                >
                                  {group}
                                </ListSubheader>,
                                ...(items as any[]).map((item: any) => (
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
                                      ...(formik.values
                                        .paid_through_account_id === item.label
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
                                )),
                            ]
                          )
                        ) : (
                          <MenuItem
                            disabled
                            sx={{ fontSize: "13px", opacity: 0.6 }}
                          >
                            No results found
                          </MenuItem>
                        )}

                        <Divider sx={{ my: 1 }} />

                        {/* Configure Accounts Button */}
                        <MenuItem
                          sx={{
                            fontSize: "13px",
                            color: "#408dfb",
                            display: "flex" as const,
                            alignItems: "center" as const,
                            padding: "6px 16px",
                            cursor: "pointer" as const,
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
                        (formik.errors.paid_through_account_id as any) && (
                          <Typography
                            sx={{
                              color: "error.main",
                              fontSize: "11px",
                              m: 1,
                            }}
                          >
                            {(formik.errors.paid_through_account_id as any)}
                          </Typography>
                        )}
                    </FormControl>
                  </Box>

                  {/* Reference Number */}
                  <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 2 }}>
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
                        Boolean((formik.errors.reference_number as any))
                      }
                      helperText={
                        formik.touched.reference_number &&
                        (formik.errors.reference_number as any)
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
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <SettingsIcon
                                fontSize="small"
                                sx={{ marginRight: "-12px" }}
                              />
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
                      sx={{
                        fontWeight: "400 !important" as const,
                        color: "black",
                        fontSize: "13px",
                      }}
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
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "7px",
                          minHeight: "80px",
                          alignItems: "flex-start" as const,
                          "&:hover fieldset": {
                            borderColor: "#408dfb",
                          },
                          "& textarea": {
                            height: "100% !important",
                            padding: 0,
                            boxSizing: "border-box" as const,
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Attachments Section */}
                  <Grid item xs={5}>
                    <Box sx={{ width: "40%" }}>
                      <Box>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontSize: "12PX" }}
                        >
                          Attachments
                        </Typography>
                        <Box
                          sx={{
                            display: "flex" as const,
                            alignItems: "center" as const,
                            mb: 1,
                            padding: "8px", // Add padding for better spacing
                            borderRadius: "8px",
                          }}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<FileUploadOutlinedIcon />}
                            component="label"
                            size="small"
                            sx={{
                              color: "black",
                              border: "2px dotted #d6d6dc",
                            }}
                          >
                            Upload File
                            <input
                              type="file"
                              name="documents"
                              hidden
                              // ref={formik.values.documents}
                              accept=".pdf, .jpeg, .jpg, .png" // Allowed file types
                              onChange={handleFileUpload}
                            />
                          </Button>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            // display: "block" as const,
                            fontSize: "12px",
                            width: "100%",
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
                              <Typography variant="body2">
                                {files.name}
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
                    </Box>
                  </Grid>

                  {/* Additional Fields Section */}
                  <Box
                    mt={4}
                    sx={{ display: "flex" as const, width: "1000px", color: "gray" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 550, color: "gray", width: "150px" }}
                    >
                      Additional Fields:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex" as const,
                        alignItems: "center" as const,
                        flexWrap: "wrap" as const,
                        width: "1000px",
                        fontSize: "13px",
                      }}
                    >
                      <Typography variant="body2" component="span">
                        Start adding custom fields for your payments made by
                        going to{" "}
                      </Typography>
                      <Link {...({} as any)}
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
                          verticalAlign: "middle" as const,
                        }}
                      />
                      <Link {...({} as any)}
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
                          verticalAlign: "middle" as const,
                        }}
                      />
                      <Link {...({} as any)}
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
              display: "flex" as const,
              alignItems: "center" as const,
              gap: 2,
              p: 2,
              marginTop: "20px",
              position: "fixed" as const,
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
                textTransform: "none" as const,
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
                textTransform: "none" as const,
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
