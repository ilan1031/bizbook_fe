"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import apiService from "../../../../../src/services/axiosService";
import config from "../../../../services/config";

const RefundContent = ({ customer, payment, onCancel, onSave, payData }) => {
  console.log("Debug - Full PayData:", payData);
  console.log("Debug - Customer prop:", customer);
  console.log("Debug - Payment prop:", payment);

  const [selectedValue, setSelectedValue] = useState(
    payData?.deposite_to || payment?.account_name || "Petty Cash"
  );
  const [selectedValueMode, setSelectedValueMode] = useState(
    payData?.payment_mode || payment?.payment_mode || "Cash"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenMode, setIsDropdownOpenMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refundDate, setRefundDate] = useState(dayjs());
  const [referenceNumber, setReferenceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [refundType, setRefundType] = useState("Excess Amount Refund");
  const [refundAmount, setRefundAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showMessage, setShowMessage] = useState(false);

  // Calculate amounts with better fallbacks
  const totalAmountReceived = parseFloat(
    payData?.amount ||
      payment?.amount ||
      payData?.total_amount ||
      payment?.total_amount ||
      0
  );

  const amountAppliedToInvoices = parseFloat(
    payData?.amount_applied || // directly from payData
      payment?.amount_applied || // directly from payment
      payData?.amount_applied?.toString()?.replace(/[^0-9.-]+/g, "") || // handle formatted string
      payment?.amount_applied?.toString()?.replace(/[^0-9.-]+/g, "") ||
      0
  );

  const previouslyRefundedAmount = parseFloat(
    payData?.refund_amount || // new refund field
      payment?.refund_amount ||
      payData?.refunded_amount || // fallback
      payment?.refunded_amount ||
      0
  );

  // Calculate excess amount properly
  const excessAmount = Math.max(
    0,
    totalAmountReceived - amountAppliedToInvoices - previouslyRefundedAmount
  );

  // Check if payment is already fully refunded
  const isFullyRefunded =
    payData?.payment_status === "refunded" ||
    payment?.payment_status === "refunded" ||
    previouslyRefundedAmount >= totalAmountReceived;

  // Update refund amount when refund type changes or component mounts
  useEffect(() => {
    let newAmount = "0.00";
    if (refundType === "Full Amount Refund") {
      // For full amount refund, use the remaining amount
      const remainingAmount = totalAmountReceived - previouslyRefundedAmount;
      newAmount = remainingAmount > 0 ? remainingAmount.toFixed(2) : "0.00";
    } else if (refundType === "Excess Amount Refund") {
      // For excess amount refund, use the unapplied amount
      newAmount = excessAmount > 0 ? excessAmount.toFixed(2) : "0.00";
    }
    setRefundAmount(newAmount);
  }, [refundType, totalAmountReceived, excessAmount, previouslyRefundedAmount]);

  // If payment is fully refunded, show message and disable refund
  useEffect(() => {
    if (isFullyRefunded) {
      displayMessage("This payment has already been fully refunded", "warning");
    }
  }, [isFullyRefunded]);

  const handleRefundTypeChange = (e) => {
    const newType = e.target.value;
    setRefundType(newType);
  };

  const handleRefundAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setRefundAmount(value);
    }
  };

  const paymentModes = [
    "Cash",
    "Bank Remittance",
    "Credit Card",
    "Bank Transfer",
    "Cheque",
    "UPI",
  ];

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleToggleDropdownMode = () => {
    setIsDropdownOpenMode(!isDropdownOpenMode);
  };

  const filteredOptions = paymentModes.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayMessage = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Check if payment is already fully refunded
      if (isFullyRefunded) {
        displayMessage("This payment has already been fully refunded", "error");
        return;
      }

      const paymentId = payData?.payment_id || payment?.payment_id;
      const orgId = localStorage.getItem("organization_id");

      if (!paymentId) {
        displayMessage("Payment ID is missing", "error");
        return;
      }

      if (!orgId) {
        displayMessage("Organization ID is missing", "error");
        return;
      }

      const amount = parseFloat(refundAmount || "0");

      if (isNaN(amount) || amount <= 0) {
        displayMessage(
          "Please enter a valid refund amount greater than 0",
          "error"
        );
        return;
      }

      // Validate refund amount based on type
      if (refundType === "Full Amount Refund") {
        const remainingAmount = totalAmountReceived - previouslyRefundedAmount;
        if (amount > remainingAmount) {
          displayMessage(
            `Full amount refund cannot exceed remaining amount of ₹${remainingAmount.toFixed(
              2
            )}`,
            "error"
          );
          return;
        }
      } else if (refundType === "Excess Amount Refund") {
        if (amount > excessAmount) {
          displayMessage(
            `Excess amount refund cannot exceed ₹${excessAmount.toFixed(
              2
            )} (Total - Applied - Previously Refunded)`,
            "error"
          );
          return;
        }
      }

      if (!refundDate) {
        displayMessage("Please select a refund date", "error");
        return;
      }

      if (!selectedValue) {
        displayMessage("Please select a from account", "error");
        return;
      }

      // Prepare journal entries for the refund
      const journalEntries = {
        debit: [
          {
            account_name: "Accounts Receivable",
            amount: amount,
            description: `Refund for payment ${paymentId} - ${
              description || "Customer requested refund"
            }`,
          },
        ],
        credit: [
          {
            account_name: selectedValue, // From Account
            amount: amount,
            description: `Refund for payment ${paymentId} - ${
              description || "Customer requested refund"
            }`,
          },
        ],
      };

      // Call the backend API with query parameters
      const response = await apiService({
        method: "POST",
        url: `/api/v1/payment/refund`,
        params: {
          payment_id: paymentId,
          organization_id: orgId,
          refund_reason: description || "Customer requested refund",
          refund_date: refundDate.format("YYYY-MM-DD"),
          payment_mode: selectedValueMode,
          reference_number: referenceNumber || "",
          from_account: selectedValue,
          refund_type: refundType,
          refund_amount: amount,
          journal_entries: journalEntries,
        },
        customBaseUrl: config.SO_Base_url,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("API Response:", response);

      if (response?.data?.status) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          if (onSave) {
            onSave({
              payment_id: paymentId,
              organization_id: orgId,
              refund_reason: description || "Customer requested refund",
              refund_date: refundDate.format("YYYY-MM-DD"),
              payment_mode: selectedValueMode,
              reference_number: referenceNumber || "",
              from_account: selectedValue,
              refund_type: refundType,
              refund_amount: amount,
              updated_invoices: response?.data?.data?.updated_invoices || [],
              journal_entries: journalEntries,
              payment_status:
                amount >= totalAmountReceived - previouslyRefundedAmount
                  ? "refunded"
                  : "partially_refunded",
            });
          }
        }, 3000);
      } else {
        displayMessage(
          response?.data?.message ||
            "Already processed refund for this payment",
          "error"
        );
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      let errorMessage = "Already processed refund for this payment";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          errorMessage;
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      displayMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Get customer name from available sources
  const getCustomerName = () => {
    console.log("=== Customer Name Debug ===");
    console.log("payData:", payData);
    console.log("payment:", payment);
    console.log("customer:", customer);

    // First try to get customer name from payData
    if (payData?.customer?.name) return payData.customer.name;
    if (payData?.customer_name) return payData.customer_name;
    if (payData?.customer?.customer_name) return payData.customer.customer_name;
    if (payData?.customer?.display_name) return payData.customer.display_name;
    if (payData?.customer_details?.name) return payData.customer_details.name;
    if (payData?.customer_details?.customer_name)
      return payData.customer_details.customer_name;
    if (payData?.customer_details?.display_name)
      return payData.customer_details.display_name;

    // Then try from payment object
    if (payment?.customer?.name) return payment.customer.name;
    if (payment?.customer_name) return payment.customer_name;
    if (payment?.customer?.customer_name) return payment.customer.customer_name;
    if (payment?.customer?.display_name) return payment.customer.display_name;

    // Then try from customer prop
    if (customer?.name) return customer.name;
    if (customer?.customer_name) return customer.customer_name;
    if (customer?.display_name) return customer.display_name;

    // Try to get from billing information
    if (payData?.bill_to?.name) return payData.bill_to.name;
    if (payData?.bill_to?.customer_name) return payData.bill_to.customer_name;
    if (payment?.bill_to?.name) return payment.bill_to.name;

    // Try to get from contact information
    if (payData?.contact_name) return payData.contact_name;
    if (payment?.contact_name) return payment.contact_name;
    if (customer?.contact_name) return customer.contact_name;

    // If we have a customer ID but no name, try to format it nicely
    if (payData?.customer_id) {
      return `${payData.customer_id}`;
    }
    if (payment?.customer_id) {
      return `${payment.customer_id}`;
    }
    if (customer?.id) {
      return `${customer.id}`;
    }

    return "";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        mx: "auto",
        p: 0,
        bgcolor: "white",
        mb: 0,
        boxShadow: "none",
      }}
    >
      <Box sx={{ pt: 2, pb: 0, px: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: "500",
            borderBottom: "1px solid #e0e0e0",
            pb: 1,
          }}
        >
          Refund
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="div"
              sx={{
                width: 46,
                mr: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccountBoxIcon fontSize="large" sx={{ color: "#9e9e9e" }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Customer Id
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: 500, mt: 0.25 }}
              >
                {getCustomerName()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Conditional UI based on payment_mode */}
        {selectedValueMode === "Cheque" ? (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
              backgroundColor: "#f9f9f9",
              borderRadius: 1,
              p: 2,
              mb: 3,
            }}
          >
            {/* Refund Type and Amount Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Refund Type */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ width: 140, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Refund Type
                  </Typography>
                </Box>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={refundType}
                  onChange={handleRefundTypeChange}
                  variant="outlined"
                  sx={{
                    width: "250px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                >
                  <MenuItem value="Excess Amount Refund">
                    Excess Amount Refund
                  </MenuItem>
                  <MenuItem value="Full Amount Refund">
                    Full Amount Refund
                  </MenuItem>
                </TextField>
              </Box>

              {/* Amount */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: 140 }}>
                  <Typography variant="body2" color="#d32f2f">
                    Amount*
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={refundAmount}
                  onChange={handleRefundAmountChange}
                  variant="outlined"
                  type="text"
                  disabled={refundType === "Full Amount Refund"}
                  placeholder="0.00"
                  sx={{
                    width: "250px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Info Box */}
            <Box
              sx={{
                border: "1px dashed #ccc",
                p: 2,
                borderRadius: 1,
                width: "330px",
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total Amount Received: ₹
                {totalAmountReceived.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amount Applied to Invoices: ₹
                {amountAppliedToInvoices.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Previously Refunded Amount: ₹
                {previouslyRefundedAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Excess Amount: ₹
                {excessAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              p: 2,
              bgcolor: "#f7f7f7",
              borderRadius: 1,
            }}
          >
            <Box sx={{ width: 140 }}>
              <Typography variant="body2" color="text.secondary">
                Total Refund Amount
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                bgcolor: "#fff",
                height: 40,
                px: 2,
                width: 250,
                fontSize: "0.875rem",
                color: "text.primary",
              }}
            >
              <Box component="span" sx={{ mr: 1, color: "text.secondary" }}>
                INR
              </Box>
              <Box component="span" sx={{ mx: 1, color: "divider" }}>
                |
              </Box>
              <Box component="span" sx={{ fontWeight: 500 }}>
                {totalAmountReceived.toFixed(2)}
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box sx={{ width: 140 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ color: "#d32f2f" }}
                >
                  Refunded On*
                </Typography>
              </Box>
              <DatePicker
                value={refundDate}
                defaultValue={dayjs()}
                format="DD/MM/YYYY"
                onChange={(newDate) => setRefundDate(newDate)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: false,
                    sx: {
                      width: "250px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#e0e0e0" },
                      },
                    },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ width: 140 }}>
              <Typography variant="body2" color="text.secondary">
                Payment Mode
              </Typography>
            </Box>
            <Box sx={{ width: 330, position: "relative" }}>
              <TextField
                fullWidth
                size="small"
                value={selectedValueMode}
                onClick={handleToggleDropdownMode}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <ArrowDropDownIcon style={{ color: "#e0e0e0" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#e0e0e0" },
                    "&.Mui-focused fieldset": { borderColor: "#e0e0e0" },
                    color: "#333",
                  },
                }}
              />
              {isDropdownOpenMode && (
                <Paper
                  sx={{
                    position: "absolute",
                    width: "100%",
                    boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    mt: 0.5,
                    p: 1,
                  }}
                >
                  <TextField
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                  {filteredOptions.map((option) => (
                    <MenuItem
                      key={option}
                      onClick={() => {
                        setSelectedValueMode(option);
                        setIsDropdownOpenMode(false);
                      }}
                      sx={{
                        bgcolor:
                          selectedValueMode === option
                            ? "#3399ff"
                            : "transparent",
                        color: selectedValueMode === option ? "white" : "black",
                        "&:hover": { bgcolor: "#3399ff", color: "white" },
                      }}
                    >
                      {option}
                      {selectedValueMode === option && (
                        <CheckIcon
                          fontSize="small"
                          sx={{ ml: "auto", color: "white" }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ width: 140 }}>
              <Typography variant="body2" color="text.secondary">
                Reference#
              </Typography>
            </Box>
            <TextField
              size="small"
              variant="outlined"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              sx={{
                width: "250px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ width: 140 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ color: "#d32f2f" }}
              >
                From Account*
              </Typography>
            </Box>
            <Box sx={{ width: 330, position: "relative" }}>
              <TextField
                select
                fullWidth
                size="small"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                variant="outlined"
                SelectProps={{
                  onOpen: () => setIsDropdownOpen(true),
                  onClose: () => setIsDropdownOpen(false),
                  IconComponent: () => (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <ArrowDropDownIcon style={{ color: "#1976d2" }} />
                    </Box>
                  ),
                  MenuProps: {
                    PaperProps: { style: { display: "none" } },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#1976d2" },
                  },
                }}
              >
                <MenuItem value="Petty Cash">Petty Cash</MenuItem>
                <MenuItem value="Undeposited Funds">Undeposited Funds</MenuItem>
                <MenuItem value="Zoho Payroll - Bank Account">
                  Zoho Payroll - Bank Account
                </MenuItem>
              </TextField>
              {isDropdownOpen && (
                <Paper
                  sx={{
                    position: "absolute",
                    width: "100%",
                    boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    mt: 0.5,
                    p: 1,
                    maxHeight: 300,
                    overflowY: "auto",
                    backgroundColor: "#fff",
                  }}
                >
                  <TextField
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Typography
                    sx={{ px: 2, py: 1, fontWeight: 500, color: "#8e8e93" }}
                  >
                    Cash
                  </Typography>
                  <MenuItem
                    onClick={() => {
                      setSelectedValue("Petty Cash");
                      setIsDropdownOpen(false);
                    }}
                    sx={{
                      bgcolor:
                        selectedValue === "Petty Cash"
                          ? "#3399ff"
                          : "transparent",
                      color:
                        selectedValue === "Petty Cash" ? "white" : "inherit",
                      "&:hover": { bgcolor: "#3399ff", color: "white" },
                    }}
                  >
                    Petty Cash
                    {selectedValue === "Petty Cash" && (
                      <CheckIcon
                        fontSize="small"
                        sx={{ ml: "auto", color: "white" }}
                      />
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedValue("Undeposited Funds");
                      setIsDropdownOpen(false);
                    }}
                    sx={{
                      bgcolor:
                        selectedValue === "Undeposited Funds"
                          ? "#3399ff"
                          : "transparent",
                      color:
                        selectedValue === "Undeposited Funds"
                          ? "white"
                          : "inherit",
                      "&:hover": { bgcolor: "#3399ff", color: "white" },
                    }}
                  >
                    Undeposited Funds
                    {selectedValue === "Undeposited Funds" && (
                      <CheckIcon
                        fontSize="small"
                        sx={{ ml: "auto", color: "white" }}
                      />
                    )}
                  </MenuItem>
                  <Typography
                    sx={{ px: 2, py: 1, fontWeight: 500, color: "#8e8e93" }}
                  >
                    Bank
                  </Typography>
                  <MenuItem
                    onClick={() => {
                      setSelectedValue("Zoho Payroll - Bank Account");
                      setIsDropdownOpen(false);
                    }}
                    sx={{
                      bgcolor:
                        selectedValue === "Zoho Payroll - Bank Account"
                          ? "#3399ff"
                          : "transparent",
                      color:
                        selectedValue === "Zoho Payroll - Bank Account"
                          ? "white"
                          : "inherit",
                      "&:hover": { bgcolor: "#3399ff", color: "white" },
                    }}
                  >
                    Zoho Payroll - Bank Account
                    {selectedValue === "Zoho Payroll - Bank Account" && (
                      <CheckIcon
                        fontSize="small"
                        sx={{ ml: "auto", color: "white" }}
                      />
                    )}
                  </MenuItem>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", mb: 3 }}>
          <Box sx={{ width: 140 }}>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
          </Box>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter refund description (optional)"
            sx={{
              width: "250px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
              },
            }}
          />
        </Box>
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isLoading}
            sx={{
              bgcolor: "#2196f3",
              color: "white",
              mr: 2,
              textTransform: "none",
              borderRadius: 1,
              px: 3,
              py: 0.7,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "#1976d2" },
              "&:disabled": { bgcolor: "#e0e0e0" },
            }}
          >
            {isLoading ? "Processing..." : "Save"}
          </Button>
          <Button
            variant="outlined"
            disabled={isLoading}
            sx={{
              color: "#000",
              borderColor: "#e0e0e0",
              textTransform: "none",
              borderRadius: 1,
              px: 3,
              fontSize: "0.875rem",
              "&:hover": { borderColor: "#bdbdbd" },
            }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Box>
            {showSuccess && (
              <Paper
                elevation={3}
                sx={{
                  position: "fixed",
                  top: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 9999,
                  p: 1.5,
                  bgcolor: "#ffffff",
                  color: "green",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  maxWidth: "max-content",
                  borderRadius: 2,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ mr: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: "green" }} />
                </Box>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  The refund information for this payment has been saved.
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity={message.type}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RefundContent;
