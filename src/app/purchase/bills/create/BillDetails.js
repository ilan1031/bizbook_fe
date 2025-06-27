"use client";
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  Divider,
  FormHelperText,
  Tooltip,
  styled,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Select } from "@mui/material";

// Define COLORS object for consistent coloring
const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

// Common Interaction Styles
const commonInteractionStyles = {
  "&:hover": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&:focus": {
    outline: "none",
    borderColor: COLORS.primary,
    border: ".1px solid #408dfb",
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
};

// Form Label Style
const formLabelStyle = {
  fontSize: "14px", // 13px
  minWidth: "120px",
  whiteSpace: "nowrap",
  color: COLORS.error, // Red color for required fields
};

// Form Label Black Style
const formLabelBlackStyle = {
  fontSize: "14px", // 13px
  minWidth: "120px",
  whiteSpace: "nowrap",
  color: COLORS.textPrimary,
};

// Common textarea styles
const commonTextareaStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "7px",
  padding: "6px 12px",
  fontFamily: "inherit",
  fontSize: "14px", // 13px
  resize: "vertical",
  minHeight: "60px",
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
};

// Custom styled components for consistent field heights and styling
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

const StyledTextarea = styled("textarea")({
  ...commonTextareaStyle,
});

// Form row style
const formRowStyle = {
  display: "flex",
  alignItems: "center",
  mb: 2,
};

const BillDetails = ({ formik, paymentTerms,billNumber }) => {
  // Make sure paymentTerms includes "Custom" option
  const allPaymentTerms = paymentTerms;

  // Function to get last day of a month
  const getLastDayOfMonth = (date, monthsToAdd = 0) => {
    const newDate = new Date(date);
    // Move to the first day of the target month (+1 month)
    newDate.setMonth(newDate.getMonth() + monthsToAdd + 1);
    // Set to day 0 which gives last day of previous month
    newDate.setDate(0);
    return newDate.toISOString().split("T")[0];
  };

  // Function to calculate due date based on bill date and payment terms
  const calculateDueDate = (billDate, terms) => {
    if (!billDate) return "";

    // For "Due on Receipt", just return bill date directly
    if (terms === "Due on Receipt") {
      return billDate;
    }

    const date = new Date(billDate);

    switch (terms) {
      case "Net 15":
        date.setDate(date.getDate() + 15);
        break;
      case "Net 30":
        date.setDate(date.getDate() + 30);
        break;
      case "Net 45":
        date.setDate(date.getDate() + 45);
        break;
      case "Net 60":
        date.setDate(date.getDate() + 60);
        break;
      case "Due end of the month":
        // Set to the last day of the current month
        return getLastDayOfMonth(billDate, 0);
      case "Due end of the next month":
        // Set to the last day of the next month
        return getLastDayOfMonth(billDate, 1);
      case "Custom":
        // If terms is custom, return current due date
        return formik.values.dueDate;
      default:
        // If no valid term is selected, return current due date
        return formik.values.dueDate;
    }

    return date.toISOString().split("T")[0];
  };

  // Validate bill date - remove future date restriction
  const validateBillDate = (date) => {
    if (!date) return undefined;
    return undefined; // Allow any date
  };

  // Validate due date is after bill date
  const validateDueDate = (dueDate, billDate) => {
    if (!dueDate || !billDate) return undefined;

    const due = new Date(dueDate);
    const bill = new Date(billDate);
    due.setHours(0, 0, 0, 0);
    bill.setHours(0, 0, 0, 0);

    if (due < bill) {
      return "Due date must be after bill date";
    }
    return undefined;
  };

  // Get minimum due date (bill date)
  const getMinDueDate = (billDate) => {
    if (!billDate) {
      // If no bill date, use today as minimum
      return new Date().toISOString().split("T")[0];
    }
    // Use the exact bill date as minimum
    return billDate;
  };

  // Handle payment terms change
  const handlePaymentTermsChange = (e) => {
    // Handle the change normally
    formik.handleChange(e);

    // Update due date based on new payment terms
    if (formik.values.billDate) {
      // Calculate new due date based on bill date and selected payment terms
      const newDueDate = calculateDueDate(
        formik.values.billDate,
        e.target.value
      );
      formik.setFieldValue("dueDate", newDueDate);
    }
  };

  // Handle due date change - detect if we should set payment terms to Custom
  const handleDueDateChange = (e) => {
    const selectedDate = e.target.value;
    const billDate = formik.values.billDate;

    // Only allow dates from bill date onwards
    if (selectedDate && billDate) {
      const selected = new Date(selectedDate);
      const bill = new Date(billDate);
      selected.setHours(0, 0, 0, 0);
      bill.setHours(0, 0, 0, 0);

      if (selected < bill) {
        // If selected date is before bill date, don't update
        return;
      }
    }

    // Update the formik value
    formik.handleChange(e);

    // Then check if we should update payment terms
    if (selectedDate && billDate) {
      // Test each payment term to see if any matches the selected date
      let matchFound = false;
      const possibleTerms = [
        "Net 15",
        "Net 30",
        "Net 45",
        "Net 60",
        "Due on Receipt",
        "Due end of the month",
        "Due end of the next month",
      ];

      for (const term of possibleTerms) {
        const calculatedDate = calculateDueDate(billDate, term);
        if (calculatedDate === selectedDate) {
          formik.setFieldValue("paymentTerms", term);
          matchFound = true;
          break;
        }
      }

      // If no matching term found, set to Custom
      if (!matchFound) {
        formik.setFieldValue("paymentTerms", "Custom");
      }
    } else if (!selectedDate && billDate) {
      // If due date is cleared but bill date exists
      formik.setFieldValue("paymentTerms", "Custom");
    }
  };

  // Update due date when bill date changes
  useEffect(() => {
    // Skip if we don't have bill date or payment terms
    if (!formik.values.billDate || !formik.values.paymentTerms) {
      return;
    }

    // Skip if payment terms is "Custom" (allow manual setting)
    if (formik.values.paymentTerms === "Custom") {
      return;
    }

    // Calculate due date based on current bill date and payment terms
    const newDueDate = calculateDueDate(
      formik.values.billDate,
      formik.values.paymentTerms
    );
    formik.setFieldValue("dueDate", newDueDate);
  }, [formik.values.billDate, formik.values.paymentTerms]); // Added paymentTerms to dependencies

  return (
    <Box sx={{ width: "100%", p:3 }}>
      {/* Bill Number row */}
      <Box sx={formRowStyle}>
        <Typography sx={{ ...formLabelStyle, width: "140px" }}>
          Bill#*
        </Typography>
        <StyledTextField
          name="bill_number"
          value={billNumber}
          onChange={formik.handleChange}
          disabled
          onBlur={formik.handleBlur}
          sx={{ width: "350px"}}
          error={formik.touched.bill_number && Boolean(formik.errors.bill_number)}
        />
      </Box>
      {formik.touched.bill_number && formik.errors.bill_number && (
        <FormHelperText
          error
          sx={{ ml: "140px", mt: -1, mb: 1, fontSize: "0.75rem" }}
        >
          {formik.errors.bill_number}
        </FormHelperText>
      )}

      {/* Order Number row */}
      <Box sx={formRowStyle}>
        <Typography sx={{ ...formLabelBlackStyle, width: "140px" }}>
          Order Number
        </Typography>
        <StyledTextField
          name="orderNumber"
          value={formik.values.orderNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{ width: "350px" }}
        />
      </Box>

      {/* Bill Date row */}
      <Box sx={formRowStyle}>
        <Typography sx={{ ...formLabelStyle, width: "140px" }}>
          Bill Date*
        </Typography>
        <StyledTextField
          type="date"
          name="billDate"
          value={formik.values.billDate}
          onClick={(e) => {
            const input = e.currentTarget.querySelector("input");
            if (input && input.showPicker) input.showPicker();
          }}
          inputRef={(ref) => {
            if (ref) {
              ref.onclick = () => ref.showPicker && ref.showPicker();
            }
          }}
          onChange={(e) => {
            formik.handleChange(e);
            const error = validateBillDate(e.target.value);
            if (error) {
              formik.setFieldError("billDate", error);
            } else {
              formik.setFieldError("billDate", undefined);
            }
          }}
          onBlur={formik.handleBlur}
          placeholder="DD/MM/YYYY"
          sx={{
            width: "350px",
            "& input": {
              cursor: "pointer",
              "&::placeholder": {
                color: "#978195",
                fontWeight: "normal",
              },
            },
          }}
          error={formik.touched.billDate && Boolean(formik.errors.billDate)}
        />
      </Box>
      {formik.touched.billDate && formik.errors.billDate && (
        <FormHelperText
          error
          sx={{ ml: "140px", mt: -1, mb: 1, fontSize: "0.75rem" }}
        >
          {formik.errors.billDate}
        </FormHelperText>
      )}

      {/* Due Date and Payment Terms row */}
      <Box sx={{ ...formRowStyle, mb: 4 }}>
        <Typography sx={{ ...formLabelBlackStyle, width: "140px" }}>
          Due Date
        </Typography>
        <StyledTextField
          type="date"
          name="dueDate"
          value={formik.values.dueDate}
          onChange={handleDueDateChange}
          onBlur={formik.handleBlur}
          sx={{
            width: "350px",
            mr: 8,
            "& input": {
              cursor: "pointer",
              "&::-webkit-calendar-picker-indicator": {
                cursor: "pointer",
                opacity: formik.values.billDate ? 1 : 0.5,
              },
              "&::-webkit-datetime-edit": {
                color: formik.values.billDate ? "#333" : "#999",
              },
              "&::-webkit-datetime-edit-fields-wrapper": {
                color: formik.values.billDate ? "#333" : "#999",
              },
              "&::-webkit-datetime-edit-text": {
                color: formik.values.billDate ? "#333" : "#999",
              },
              "&::-webkit-datetime-edit-year-field": {
                color: formik.values.billDate ? "#333" : "#999",
              },
              "&::-webkit-datetime-edit-month-field": {
                color: formik.values.billDate ? "#333" : "#999",
              },
              "&::-webkit-datetime-edit-day-field": {
                color: formik.values.billDate ? "#333" : "#999",
              },
              "&::-webkit-inner-spin-button": {
                display: "none",
              },
              "&::-webkit-clear-button": {
                display: "none",
              },
              "&::-webkit-calendar-picker-indicator:hover": {
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
              },
            },
            "& input[type='date']::-webkit-calendar-picker-indicator": {
              filter: formik.values.billDate ? "none" : "grayscale(100%)",
            },
          }}
          inputProps={{
            min: getMinDueDate(formik.values.billDate),
            max: "2099-12-31",
            style: {
              color: formik.values.billDate ? "#333" : "#999",
              backgroundColor: formik.values.billDate ? "#fff" : "#f5f5f5",
            },
          }}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />

        <Typography sx={{ ...formLabelBlackStyle, width: "130px" }}>
          Payment Terms
        </Typography>
        <FormControl sx={{ width: "220px" }}>
          <StyledSelect
            name="paymentTerms"
            value={formik.values.paymentTerms || "Custom"}
            onChange={handlePaymentTermsChange}
            onBlur={formik.handleBlur}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              fontSize: "14px", // 13px
            }}
          >
            {allPaymentTerms.map((term) => (
              <MenuItem
                key={term}
                value={term}
                sx={{ fontSize: "14px" }} // 13px
              >
                {term}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem sx={{ fontSize: "14px" }}>
              {" "}
              {/* 13px */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                }}
              >
                <Box sx={{ marginRight: "8px" }}>⚙️</Box>
                Configure Terms
              </Box>
            </MenuItem>
          </StyledSelect>
        </FormControl>
      </Box>

      <Divider />

      {/* Subject row */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "flex-start", mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "140px",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              pr: 1,
              whiteSpace: "nowrap",
              color: COLORS.textPrimary,
            }}
          >
            Subject
          </Typography>
          <Tooltip title="Add a subject to your bill">
            <IconButton size="small">
              <InfoIcon
                sx={{ fontSize: "14px", color: COLORS.textSecondary }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <StyledTextarea
          name="subject"
          placeholder="Enter a subject within 250 characters"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{
            width: "350px",
            minHeight: "60px",
            maxHeight: "150px",
          }}
        />
      </Box>
    </Box>
  );
};

export default BillDetails;
