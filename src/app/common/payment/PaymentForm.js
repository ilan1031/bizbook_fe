"use client";
import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Checkbox,
  InputAdornment,
  Divider,
  IconButton,
  styled,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Grid,
  Modal,
  Alert,
  FormControl,
  ListSubheader,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PaymentIcon from "@mui/icons-material/Payment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { SearchIcon, Settings } from "lucide-react";
import dayjs from "dayjs";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { SettingsApplications, SettingsOutlined } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PaymentTermsConfig from "../otherdetailsvendor/configurePaymentTerms/PaymentTermsConfig";

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

const StyledSelect = styled(Select)({
  height: "35px", // Changed from 36px to 35px
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
// Common styles
const commonStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "7px",
    backgroundColor: "#fff",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#408dfb",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#408dfb",
    },
  },
};

export default function PaymentForm({ callViewAPI, onCancel, invoiceData }) {
  // File Upload State
  const searchInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [paymentNumber, setPaymentNumber] = useState("");
  const organization_id = localStorage.getItem("organization_id");
  const [openAlert, setOpenAlert] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [sendThankYouEmail, setSendThankYouEmail] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [paymentTermsSearch, setPaymentTermsSearch] = useState("");
  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState(false);
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState(false);

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
  // Payment mode options
  const paymentModes = [
    "Cash",
    "Check",
    "Credit Card",
    "Bank Transfer",
    "PayPal",
    "Stripe",
    "Google Pay",
    "Apple Pay",
    "Venmo",
    "Other",
  ];

  // Filter payment modes based on search
  const filteredPaymentModes = paymentModes.filter((mode) =>
    mode.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );
  // Account options for paid through
  const allPaidThroughOptions = [
    { label: "Petty Cash", group: "Cash" },
    { label: "Undeposited Funds", group: "Cash" },
    { label: "Employee Reimbursements", group: "Other Current Liability" },
    { label: "Opening Balance Adjustments", group: "Other Current Liability" },
    { label: "TDS Payable", group: "Other Current Liability" },
    { label: "TCS Payable", group: "Other Current Liability" },
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

  useEffect(() => {
    fetchPaymentId();
  }, []);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Check if customer_id exists and is valid
        if (
          !invoiceData?.customer_id ||
          typeof invoiceData.customer_id !== "string"
        ) {
          console.error("Invalid or missing customer_id");
          return;
        }

        const response = await apiService({
          method: "GET",
          url: `/api/v1/contact-person/${invoiceData.customer_id}`,
          file: false, // Include if required by your apiService
        });

        // Check if response and data exist
        if (!response?.data) {
          throw new Error("Invalid API response structure");
        }
        if (response.data.statusCode == 200 || response.data.success == true) {
          // Ensure data is an array before processing
          const contactData = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          setContacts(contactData);
          const allEmails = contactData
            .map((contact) => contact?.email)
            .filter(
              (email) => typeof email === "string" && email.includes("@")
            ); // Basic email validation
          setSelectedEmails(allEmails);
        } else {
          console.error(
            "API request failed:",
            response.data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        // Use your snackbar to show error to user
        showMessage(
          error.response?.data?.message || "Failed to load contacts",
          "error"
        );
      }
    };

    // Only fetch if customer_id exists
    if (invoiceData?.customer_id) {
      fetchContacts();
    }
  }, [invoiceData?.customer_id, showMessage]); // Add showMessage to dependencies if it's stable

  const handleEmailSelection = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // const sendThankYou = async () => {
  //   if (!sendThankYouEmail || selectedEmails.length === 0) return;

  //   try {
  //     const emailPayload = {
  //       from_email: "bharathi.g.ihub@snsgroups.com", // Default from email
  //       to_email: selectedEmails.join(","),
  //       cc_emails: [],
  //       bcc_emails: [],
  //       attach_pdf: false,
  //       contact_id: invoiceData.customer_id,
  //       customer_id: invoiceData.customer_id,
  //       email_type: "Payment Receipt",
  //       orderId: paymentNumber,
  //       order_type: "payment",
  //       organization_id: localStorage.getItem("organization_id"),
  //       subject: `Payment Received by bizbooks`,
  //       body: `
  //         <p>Dear ${formik.values.customer_name},</p>
  //         <p>Thank you for your payment. It was a pleasure doing business with you. We look
  //         forward to work together again!</p>

  //         <p><strong>Payment Received:</strong> ₹${parseFloat(
  //           formik.values.amount
  //         ).toFixed(2)}</p>

  //         <p><strong>Invoice No:</strong> ${
  //           invoiceData?.invoice_number || "N/A"
  //         }</p>
  //         <p><strong>Payment Date:</strong> ${dayjs(formik.values.date).format(
  //           "DD/MM/YYYY"
  //         )}</p>

  //         <p>Regards,<br>
  //         ${formik.values.customer_name}<br>
  //         bizbooks</p>
  //       `,
  //     };

  //     await apiService({
  //       method: "POST",
  //       url: `/api/v1/email/send?organization_id=${localStorage.getItem(
  //         "organization_id"
  //       )}`,
  //       data: emailPayload,
  //       customBaseUrl: config.SO_Base_url,
  //     });
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //   }
  // };

  const sendThankYou = async () => {
    if (!sendThankYouEmail || selectedEmails.length === 0) return;
    try {
      const emailPayload = {
        from_email: "bharathi.g.ihub@snsgroups.com",
        to_email: selectedEmails.join(","),
        cc_emails: [],
        bcc_emails: [],
        attach_pdf: false,
        contact_id: invoiceData.customer_id,
        customer_id: invoiceData.customer_id,
        email_type: "Payment Receipt",
        orderId: paymentNumber,
        order_type: "payment",
        organization_id: localStorage.getItem("organization_id"),
        subject: `Payment Received by bizbooks`,
        // Add dynamic fields for the email template
        recipient_name: formik.values.customer_name,
        sender_name: formik.values.customer_name,
        company_name: "bizbooks",
        invoice_number: invoiceData?.invoice_number || "",
        payment_date: dayjs(formik.values.date).format("DD/MM/YYYY"),
        amount: parseFloat(formik.values.amount).toFixed(2),
        currency: "INR", // Assuming INR as the currency
      };

      await apiService({
        method: "POST",
        url: `/api/v1/email/send?organization_id=${localStorage.getItem(
          "organization_id"
        )}`,
        data: emailPayload,
        customBaseUrl: config.SO_Base_url,
      });

      showMessage("Thank you email sent successfully!", "success");
    } catch (error) {
      console.error("Error sending email:", error);
      showMessage("Failed to send thank you email", "error");
    }
  };

  // Modify the handleSubmit function to include email sending
  // const handleSubmit = async () => {
  //   setOpenAlert(true);
  //   try {
  //     await formik.handleSubmit();
  //     // Only send email if payment was successful
  //     await sendThankYou();
  //   } catch (error) {
  //     console.error("Error in submission:", error);
  //   }
  // };

  const handleSubmit = async () => {
    setOpenAlert(true);
    try {
      await formik.handleSubmit(); // Submit payment data
      await sendThankYou(); // Send thank you email
    } catch (error) {
      console.error("Error in submission:", error);
      showMessage("Error submitting payment", "error");
    }
  };
  // Initial values
  const initialValues = {
    customer_name: invoiceData?.customer_name || "",
    customer_id: invoiceData?.customer_id || "",
    invoices: [{ invoice_id: "", amount_applied: "", tax_amount_withheld: "" }],
    payment_number: paymentNumber,
    amount: (invoiceData?.balance || 0).toFixed(2),
    amount_formatted: "",
    exchange_rate: 1,
    date: dayjs(),
    payment_mode: "",
    account_id: "121212",
    account_name: "",
    account_type: "",
    account_type_formatted: "",
    email_thank_you: false,
    email_address: [],
    email_checkbox: true,
    amount_Withheld: "",
    tax_deducted: "",
    tds_tax_account: "",
    bank_charges: "",
    bank_charges_formatted: "",
    reference_number: "",
    documents: [],
    notes: "",
  };

  // Handle File Upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Validate file count and size
    const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);
    if (validFiles.length + uploadedFiles.length > MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    // Update state with new files
    setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  // Remove Uploaded File
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const [moduleMenuOpen, setModuleMenuOpen] = useState(false);
  const handleModuleMenuOpen = () => {
    setModuleMenuOpen(true);
  };

  const handleModuleMenuClose = () => {
    setModuleMenuOpen(false);
  };

  // Form submission handler
  // const handleSubmit = () => {
  //   setOpenAlert(true);
  //   formik.handleSubmit();
  // };

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

  const formik = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        const errors = [];

        if (!values.customer_name && !values.customer_id) {
          errors.push("Please select customer name");
        }

        if (!paymentNumber) {
          errors.push("Please enter payment number");
        }

        if (!values.amount) {
          errors.push("Please enter amount received");
        }

        if (!values.date) {
          errors.push("Please enter payment date");
        }

        if (!values.account_name) {
          errors.push("Please select deposit to");
        }

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

        const requestData = {
          customer_id: values?.customer_id,
          payment_number: paymentNumber,
          invoices: [
            {
              invoice_id: invoiceData?.invoice_id,
              amount_applied: values?.amount,
              tax_amount_withheld: values?.amount_Withheld,
            },
          ],
          reference_number: values.reference_number,
          amount: values.amount,
          amount_formatted: values.amount_formatted,
          exchange_rate: values.exchange_rate,
          tax_account_id: values.tax_account,
          tds_tax_account: values.tds_tax_account,
          account_name: values.account_name,
          account_id: values.account_id,
          account_type: "cash",
          account_type_formatted: "Cash",
          date: dayjs(values.date).format("YYYY-MM-DD"),
          date_formatted: dayjs(values.date).format("DD/MM/YYYY"),
          payment_mode: values.payment_mode,
          bank_charges: values.bank_charges,
          bank_charges_formatted: values.bank_charges_formatted,
          description: values?.notes,
          is_advance_payment: false,
          documents: [],
        };

        const response = await apiService({
          method: "POST",
          url: `/api/v1/payment/customerpayments?organization_id=${organization_id}`,
          data: requestData,
          customBaseUrl: config.SO_Base_url,
        });
        if (response.data.status) {
          showMessage(response?.data.message, "success");
        }
        callViewAPI();
      } catch (error) {
        console.error("Error creating DeliveryChallan:", error);
        // showMessage("Failed to create DeliveryChallan", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });
  const handleTdsAccount = (value) => {
    setModuleMenuOpen(false);
    formik.setFieldValue("tds_tax_account", value);
  };

  return (
    <Paper sx={{ borderLeft: "1px solid #ddd" }}>
      <Grid sx={{ m: 2 }} xs={12}>
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              p: 2,
              pb: 2.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{ mr: 1, fontWeight: "bold" }}
              >
                {formik.values.customer_name
                  ? `Payment for ${invoiceData?.invoice_number || ""}`
                  : `Payment for Invoice ${invoiceData?.invoice_number || ""}`}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            flexGrow: 1,
            overflowY: "auto",
            padding: "24px",
            paddingBottom: "80px",
            height: "80vh",
          }}
        >
          {/* Customer Name */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ width: "170px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#d32f2f",
                  textAlign: "left",
                  mt: "8px",
                  fontWeight: 500,
                }}
              >
                Customer Name*
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <StyledTextField
                name="customer_name"
                value={formik.values.customer_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="small"
                error={
                  formik.touched.customer_name &&
                  Boolean(formik.errors.customer_name)
                }
                helperText={
                  formik.touched.customer_name && formik.errors.customer_name
                }
                sx={{
                  width: "280px",
                  "& .MuiOutlinedInput-root": {
                    height: "38px",
                    fontSize: "13px",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "10px",
                    marginTop: "2px",
                  },
                }}
              />
            </Box>
          </Box>
          {/* Payment # */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ width: "170px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#d32f2f",
                  textAlign: "left",
                  mt: "8px",
                  fontWeight: 500,
                }}
              >
                Payment #*
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
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
                  formik.touched.payment_number && formik.errors.payment_number
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" disabled>
                        <SettingsOutlined fontSize="small" color="#1B6DE0" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "280px",
                  "& .MuiOutlinedInput-root": {
                    height: "38px",
                    fontSize: "13px",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000", // Ensures disabled text appears black
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "10px",
                    marginTop: "2px",
                  },
                }}
              />
            </Box>
          </Box>
          {/* Amount Received and Bank Charges */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ width: "170px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#d32f2f",
                  textAlign: "left",
                  mt: "8px",
                  fontWeight: 500,
                }}
              >
                Amount Received (INR)*
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: "flex", gap: "20px" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <StyledTextField
                  name="amount"
                  value={formik.values.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("amount", value);
                    formik.setFieldValue(
                      "amount_formatted",
                      `₹${parseInt(value).toFixed(2)}`
                    );
                  }}
                  onBlur={formik.handleBlur}
                  size="small"
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  sx={{
                    width: "280px",
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                      fontSize: "13px",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "right",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "10px",
                      marginTop: "2px",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#555",
                    textAlign: "left",
                    mt: "8px",
                    width: "170px",
                    fontWeight: 500,
                  }}
                >
                  Bank Charges (if any)
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <StyledTextField
                  name="bank_charges"
                  value={formik.values.bank_charges}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("bank_charges", value);
                    formik.setFieldValue(
                      "bank_charges_formatted",
                      `₹${parseInt(value).toFixed(2)}`
                    );
                  }}
                  size="small"
                  sx={{
                    width: "280px",
                    "& .MuiInputBase-input": {
                      textAlign: "right",
                    },
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                      fontSize: "13px",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
          {/* Tax Deducted Section */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ width: "170px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#555",
                  textAlign: "left",
                  mt: "8px",
                  fontWeight: 500,
                }}
              >
                Tax deducted?
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <RadioGroup
                row
                name="tax_deducted"
                value={formik.values.tax_deducted}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="No Tax deducted"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                        color: "#408dfb",
                        "&.Mui-checked": {
                          color: "#408dfb",
                        },
                        padding: "4px",
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "13px" }}>
                      No Tax deducted
                    </Typography>
                  }
                  sx={{ marginRight: "16px" }}
                />
                <FormControlLabel
                  value="Yes, TDS (Income Tax)"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                        color: "#408dfb",
                        "&.Mui-checked": {
                          color: "#408dfb",
                        },
                        padding: "4px",
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "13px" }}>
                      Yes, TDS (Income Tax)
                    </Typography>
                  }
                />
              </RadioGroup>
            </Box>
          </Box>
          {/* Conditionally Rendered Fields */}
          {formik.values.tax_deducted === "Yes, TDS (Income Tax)" && (
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box sx={{ width: "170px" }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#d32f2f",
                    textAlign: "left",
                    mt: "8px",
                    fontWeight: 500,
                  }}
                >
                  Amount Withheld*
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex", gap: "20px" }}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  <StyledTextField
                    name="amountWithheld" // Keep as is
                    value={formik.values.amountWithheld} // Change to match the name attribute
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="small"
                    error={
                      formik.touched.amount_Withheld &&
                      Boolean(formik.errors.amount_Withheld)
                    }
                    helperText={
                      formik.touched.amount_Withheld &&
                      formik.errors.amount_Withheld
                    }
                    sx={{
                      width: "280px",
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                      },
                      "& .MuiOutlinedInput-root": {
                        height: "38px",
                        fontSize: "13px",
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: "10px",
                        marginTop: "2px",
                      },
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#d32f2f",
                    textAlign: "left",
                    mt: "8px",
                    width: "170px",
                    fontWeight: 500,
                  }}
                >
                  TDS Tax Account*
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  <StyledSelect
                    id="module-select"
                    open={moduleMenuOpen}
                    onOpen={handleModuleMenuOpen}
                    onClose={handleModuleMenuClose}
                    value={formik.values.tds_tax_account}
                    onBlur={formik.handleBlur}
                    renderValue={(value) => (
                      <Typography sx={{ fontSize: "13px" }}>{value}</Typography>
                    )}
                    sx={{
                      width: "280px",
                      height: "38px",
                      fontSize: "13px",
                      "& .MuiSelect-select": {
                        paddingY: "4px",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          overflowY: "hidden",
                        },
                      },
                    }}
                  >
                    <Box sx={{ p: 1 }}>
                      <TextField
                        placeholder="Search"
                        size="small"
                        fullWidth
                        sx={{ mb: 1, fontSize: "13px" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon width="13px" sx={{ color: "#aaa" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box sx={{ maxHeight: "187px", overflow: "auto" }}>
                      {[
                        "Advance Tax",
                        "Employee Advance",
                        "Input Tax Credits",
                        "Input CGST",
                        "Input IGST",
                        "Input SGST",
                        "Prepaid Expenses",
                        "Reverse Charge Tax Input but not due",
                        "TCS Receivables",
                        "TDS Receivables",
                      ].map((item) => (
                        <MenuItem
                          key={item}
                          value={item}
                          onClick={() => handleTdsAccount(item)}
                          sx={{
                            fontSize: "13px",
                            py: 0.8,
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                          }}
                        >
                          {item}
                        </MenuItem>
                      ))}
                    </Box>
                  </StyledSelect>
                  {formik.touched.tds_tax_account &&
                    formik.errors.tds_tax_account && (
                      <Typography
                        color="error"
                        sx={{ fontSize: "10px", marginTop: "2px" }}
                      >
                        {formik.errors.tds_tax_account}
                      </Typography>
                    )}
                </Box>
              </Box>
            </Box>
          )}
          <Divider sx={{ marginY: "8px" }} />
          {/* Payment Date */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ width: "170px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#d32f2f",
                  textAlign: "left",
                  mt: "8px",
                  fontWeight: 500,
                }}
              >
                Payment Date*
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: "flex", gap: "20px" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <StyledTextField
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={(e) => {
                    formik.setFieldValue("date", e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  size="small"
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  sx={{
                    width: "280px",
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                      fontSize: "13px",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "10px",
                      marginTop: "2px",
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    width: "170px",
                    fontSize: "13px",
                  }}
                >
                  Payment Mode *
                </Typography>

                <Grid item xs={5}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={commonStyles}
                    style={{ width: 400 }}
                  >
                    <StyledSelect
                      name="payment_mode"
                      value={formik.values.payment_mode || ""}
                      onChange={formik.handleChange}
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{
                        fontSize: "13px",
                        width: "280px",
                        svg: { fontSize: "22px" },
                      }}
                      displayEmpty
                      error={
                        formik.touched.payment_mode &&
                        Boolean(formik.errors.payment_mode)
                      }
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <Typography
                              sx={{ color: "#757575", fontSize: "13px" }}
                            ></Typography>
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
                        setPaymentTermsSearch("");
                      }}
                    >
                      {/* Search Field */}
                      <MenuItem
                        disableRipple
                        disableTouchRipple
                        sx={{ cursor: "default", p: 0, fontSize: "13px" }}
                      >
                        <Box
                          sx={{
                            p: 0.75,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                            width: "100%",
                            fontSize: "13px",
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
                            } // Update search value
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

                      {/* Filtered Options */}
                      {filteredPaymentModes.length > 0 ? (
                        filteredPaymentModes.map((mode) => (
                          <MenuItem
                            key={mode}
                            value={mode}
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
                            {mode}
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
                    </StyledSelect>
                  </FormControl>

                  {/* Payment Terms Modal */}
                  <Modal
                    open={isPaymentTermsModalOpen}
                    onClose={() => setIsPaymentTermsModalOpen(false)}
                  >
                    <PaymentTermsConfig />
                  </Modal>
                </Grid>
              </Box>
            </Box>
          </Box>
          {/* Deposit To and Reference# */}
          <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                width: "170px",
                fontSize: "13px",
                color: "#d62134",
              }}
            >
              Deposit To *
            </Typography>
            <FormControl
              fullWidth
              size="small"
              sx={{ width: "350px" }}
              error={
                formik.touched.account_name &&
                Boolean(formik.errors.account_name)
              }
            >
              <StyledSelect
                name="account_name"
                value={formik.values.account_name || ""}
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
                  svg: { fontSize: "22px" },
                  width: "280px",
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
                          onClick={() => {
                            formik.setFieldValue("account_name", item.label);
                            handleClose();
                          }}
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
                            ...(formik.values.account_name === item.label
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
              </StyledSelect>
              {formik.touched.account_name && formik.errors.account_name && (
                <Typography
                  sx={{
                    color: "error.main",
                    fontSize: "11px",
                    m: 1,
                  }}
                >
                  {formik.errors.account_name}
                </Typography>
              )}
            </FormControl>
          </Box>
          {/* Notes */}
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box sx={{ width: "170px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#555",
                  textAlign: "left",
                  mt: "8px",
                  fontWeight: 500,
                }}
              >
                Notes
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <StyledTextField
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                multiline
                rows={3}
                sx={{
                  fontSize: "13px",
                  width: "100%",
                  maxWidth: "500px",
                }}
              />
            </Box>
          </Box>
          <Divider sx={{ marginY: "8px" }} />
          {/* Attachments Section */}
          <Box sx={{ marginTop: "13px" }}>
            <Box sx={{ width: "145px" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#555",
                  textAlign: "left",
                  mt: "4px",
                }}
              >
                Attachments
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon sx={{ fontSize: "16px" }} />}
                  endIcon={<ArrowDropDownIcon sx={{ fontSize: "16px" }} />}
                  sx={{
                    textTransform: "none",
                    fontSize: "13px",
                    borderColor: "#ddd",
                    border: "1px dashed #ddd",
                    color: "#555",
                    height: "28px",
                    padding: "2px 10px",
                  }}
                >
                  Upload File
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>
              <Typography sx={{ fontSize: "11px", color: "#777" }}>
                You can upload a maximum of 5 files, 5MB each
              </Typography>
              {uploadedFiles.length > 0 && (
                <List
                  dense
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    marginTop: "8px",
                  }}
                >
                  {uploadedFiles.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => removeFile(index)}
                        >
                          <DeleteIcon
                            sx={{ fontSize: "16px", color: "#d32f2f" }}
                          />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
          <>
            <Divider sx={{ marginY: "8px" }} />

            <Box sx={{ marginTop: "13px" }}>
              <Box sx={{ width: "145px" }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#555",
                    textAlign: "left",
                    mt: "4px",
                  }}
                >
                  Email Thank You Note
                </Typography>
              </Box>

              <Box sx={{ flex: 1, mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sendThankYouEmail}
                      onChange={(e) => setSendThankYouEmail(e.target.checked)}
                      size="small"
                      sx={{
                        color: COLORS.primary,
                        "&.Mui-checked": {
                          color: COLORS.primary,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "13px" }}>
                      Email a `Thank you` note for this payment
                    </Typography>
                  }
                />

                {sendThankYouEmail && (
                  <Box sx={{ mt: 2, ml: 2 }}>
                    <Typography sx={{ fontSize: "13px", mb: 1 }}>
                      Select recipients:
                    </Typography>

                    {contacts.filter((c) => c?.email).length > 0 ? (
                      <List
                        dense
                        sx={{ width: "100%", bgcolor: "background.paper" }}
                      >
                        {contacts
                          .filter((c) => c?.email) // Safely check for email
                          .map((contact, index) => (
                            <ListItem key={`${contact.email}-${index}`} dense>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedEmails.includes(
                                      contact.email
                                    )}
                                    onChange={() =>
                                      handleEmailSelection(contact.email)
                                    }
                                    size="small"
                                    sx={{
                                      color: COLORS.primary,
                                      "&.Mui-checked": {
                                        color: COLORS.primary,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography sx={{ fontSize: "13px" }}>
                                      {contact.first_name} ({contact.email})
                                    </Typography>
                                    <Typography
                                      sx={{ fontSize: "11px", color: "#777" }}
                                    >
                                      {contact.designation}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <Typography sx={{ fontSize: "12px", color: "#777" }}>
                        {contacts.length > 0
                          ? "No contacts with valid email addresses"
                          : "No contacts found for this customer"}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </>
        </Box>
        {/* Fixed Footer */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "flex-start",
            gap: 2,
            zIndex: 10,
            px: 2,
            py: 1,
            boxShadow: "0 -2px 4px -1px rgba(0,0,0,0.2)",
          }}
        >
          {/* Record Payment Button */}
          <Button
            type="button"
            variant="contained"
            className="button-submit"
            // disabled={isSubmitting}
            sx={{
              width: "13%",
            }}
            onClick={handleSubmit}
          >
            Record Payment
          </Button>
          {/* Cancel Button */}
          <Button
            variant="outlined"
            className="bulk-update-btn"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
