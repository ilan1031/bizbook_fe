"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  FormHelperText,
  Divider,
  MenuItem,
  styled,
  Button,
  Select,
  FormControl,
  FormControlLabel,
  Checkbox,
  Paper,
  ListSubheader,
  Grid,
  Alert,
  TextField,
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useFormik } from "formik";
import * as Yup from "yup";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VendorSelect from "../../purchaseorder/vendorField/VendorSelector";
import TableAndTotal from "./TableAndTotal";
import { Settings } from "lucide-react";
import config from "../../../../services/config";
import apiService from "../../../../services/axiosService";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { useRouter, useSearchParams } from "next/navigation";

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
  height: "35px",
  width: "350px", // Changed from 36px to 35px
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

const allPaymentTerms = [
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due on Receipt",
  "Due end of the month",
  "Due end of the next month",
  "Custom",
];

const today = new Date().toISOString().split("T")[0];

const RepeatEveryTerms = [
  { label: "Week", value: 1, key: "weeks" },
  { label: "2 Weeks", value: 2, key: "weeks" },
  { label: "Month", value: 1, key: "months" },
  { label: "2 Months", value: 2, key: "months" },
  { label: "3 Months", value: 3, key: "months" },
  { label: "6 Months", value: 6, key: "months" },
  { label: "Year", value: 1, key: "years" },
  { label: "2 Years", value: 2, key: "years" },
  { label: "3 Years", value: 3, key: "years" },
  { label: "Custom", value: 0, key: "custom" },
];

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
      boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`, // 4D = 30% opacity
    },
  },
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
    ...commonInteractionStyles["& .MuiOutlinedInput-root"], // Spread common interactions
  },
};

const NewRecurringBill = () => {
  const [openAlert, setOpenAlert] = React.useState(false);
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const searchParams = useSearchParams();
  const [recurringData, setRecurringData] = useState(null);

  const recurring_bill_id = searchParams.get("recurring_bill_id");
  const [showPopup, setShowPopup] = useState(false);

  const validationSchema = Yup.object().shape({
    Vendor_name: Yup.string().notRequired(),

    start_date: Yup.string().required("Start date is required"),

    recurrence_name: Yup.string().required("Profile name is required"),

    is_expired: Yup.boolean(),

    end_date: Yup.string().when("is_expired", {
      is: false,
      then: () =>
        Yup.string().required("End date is required if never expires"),
      otherwise: () => Yup.string().notRequired(),
    }),

    discount_percent: Yup.number().notRequired(),

    discount_account: Yup.string().when("discount_percent", {
      is: (val) => val > 0,
      then: (schema) =>
        schema.required(
          "Discount account is required when discount is applied"
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    line_items: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Item name is required"),
          account: Yup.string().required("Account is required"),
          item_id: Yup.string().notRequired(),
          quantity: Yup.number()
            .required()
            .min(1, "Quantity must be at least 1"),
          rate: Yup.number().required("Rate is required"),
          tax: Yup.string().notRequired(),
          discount: Yup.number().notRequired(),
          amount: Yup.number().notRequired(),
        })
      )
      .min(1, "At least one line item is required"),
  });

  const validateBillDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const billDate = new Date(date);

    return billDate <= today ? undefined : "Bill date cannot be in the future";
  };

  const formik = useFormik({
    initialValues: {
      vendorName: "",
      vendor_id: "",
      discount_level: "At Transaction Level",
      discount_account: "",
      recurrence_name: "",
      repeat_every: 1,
      recurrence_frequency: "weeks",
      repeat_value: "Week",
      custom_repeat_count: "",
      custom_repeat_frequency: "days",
      start_date: today,
      billing_address: {},
      end_date: "",
      is_expired: false,
      notes: "",
      tax_type: "TDS",
      line_items: [
        {
          item_id: "",
          name: "",
          account: "",
          quantity: 1,
          rate: 0,
          tax: "",
          discount: 0,
          amount: 0,
        },
      ],
      payment_terms: 15,
      payment_terms_label: "Net 15",
      tax_amount: 0,
      adjustment_description: "Adjustment",
      adjustment: 0,
      source_of_supply: "",
      sub_total: 0.0,
      discount_percent: 0.0,
      discount_amount: 0.0,
      tax_percentage: "",
      total: 0.0,
      tds_option: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        const errors = [];
        setOpenAlert(true);
        // Validate customer selection
        if (!values.vendor_id) {
          errors.push("Please select a vendor");
        }

        // Validate invoice date
        if (!values.recurrence_name) {
          errors.push("Recurring Bill name is missing");
        }

        if (!values.repeat_value) {
          errors.push("Please select a repeat every");
        }

        // If there are validation errors, update the general errors and stop submission
        if (errors.length > 0) {
          await setFieldValue("general", errors);
          setSubmitting(false);
          return;
        }

        const org_id = localStorage.getItem("organization_id");
        if (!org_id) {
          console.error("Organization ID not found");
          return;
        }
        // Prepare data for backend
        const requestData = {
          ...values,
          status: 0,
        };
        const response = await apiService({
          method: recurring_bill_id ? "PUT" : "POST",
          url: recurring_bill_id
            ? `/api/v1/recurring-bill/${recurring_bill_id}?org_id=${org_id}`
            : `/api/v1/recurring-bill/create?org_id=${org_id}`,
          data: requestData,
          customBaseUrl: config.PO_Base_url,
        }); 

        if(response.data.recurring_bill_id){
        const path_id = response.data.recurring_bill_id
        showMessage("Recurring Bill has been created", "success");
        router.push(`/purchase/recurringbills/${path_id}`);
      }


        if (recurring_bill_id) {
          showMessage("Recurring Bill has been updated", "success");
          router.push(`/purchase/recurringbills/${recurring_bill_id}`);
        } 


      } catch (error) {
        console.error("Error creating invoice:", error);
        showMessage(
          error.response?.data?.message || "Failed to create invoice",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleNeverExpiresChange = (event) => {
    const isChecked = event.target.checked;

    formik.setFieldValue("is_expired", isChecked);

    if (isChecked) {
      formik.setFieldValue("end_date", "");
      formik.setFieldError("end_date", undefined);
    }
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    const startDate = formik.values.start_date;

    if (
      selectedDate &&
      startDate &&
      new Date(selectedDate) <= new Date(startDate)
    ) {
      formik.setFieldError("end_date", "End date must be after start date");
      return;
    }

    // Update end_date
    formik.setFieldValue("end_date", selectedDate);

    // Uncheck the "Never Expires" checkbox
    formik.setFieldValue("is_expired", false);
  };

  useEffect(() => {
    const org_id = localStorage.getItem("organization_id");
    const fetchRecurringBill = async () => {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/recurring-bill/${recurring_bill_id}?org_id=${org_id}&filter_status=all&page=1&limit=1`,
        customBaseUrl: config.PO_Base_url,
      });

      // console.log(response.data.data, "the data of the bill id");detail.vendor_datadetail.vendor_data
      const detail = response.data.data;
      if (response.data.data) {
        formik.setFieldValue("vendorName", detail.vendor_data.contact_name);
        formik.setFieldValue("vendor_id", detail.vendor_id);
        formik.setFieldValue("recurrence_name", detail.recurrence_name);
        formik.setFieldValue("repeat_every", detail.repeat_every);
        formik.setFieldValue(
          "recurrence_frequency",
          detail.recurrence_frequency
        );
        formik.setFieldValue("repeat_value", detail.repeat_value);
        formik.setFieldValue("start_date", detail.start_date);
        formik.setFieldValue("is_expired", detail.is_expired);
        formik.setFieldValue("end_date", detail.end_date);

        formik.setFieldValue("payment_terms_label", detail.payment_terms_label);
        formik.setFieldValue("notes", detail.notes);
        formik.setFieldValue("line_items", detail.line_items);
        formik.setFieldValue("sub_total", detail.sub_total);
        formik.setFieldValue("total", detail.total);
        formik.setFieldValue("adjustment", detail.adjustment);
        formik.setFieldValue("tax_type", detail.tax_type);
        formik.setFieldValue("tds_option", detail.tds_option);
        formik.setFieldValue("discount_percent", detail.discount_percent);
        formik.setFieldValue("tax_percentage", detail.tax_percentage);
        formik.setFieldValue("discount_account", detail.discount_account);
        formik.setFieldValue(
          "custom_repeat_frequency",
          detail.custom_repeat_frequency
        );
        formik.setFieldValue("custom_repeat_count", detail.custom_repeat_count);
        setRecurringData(detail.vendor_data);
      }
    };

    if (recurring_bill_id) {
      fetchRecurringBill();
    }
  }, []);

  return (
    <Box>
      <Box sx={{ overflowY: "auto", mb: 12 }}>
        {/* Header section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ReceiptIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {recurring_bill_id ? "Edit" : "New"} Recurring Bill
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={() => {
                router.push("/purchase/recurringbills");
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/*Vendor Selection*/}
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
        <Box sx={{ bgcolor: "#f8f8f8", p: 3 }}>
          <VendorSelect
            formik={formik}
            RB={true}
            initialValue={recurringData?.vendor_data}
            details={recurringData}
          />
        </Box>

        {/*Below the Vendor Section*/}

        <Box sx={{ pl: 3, pt: 3, width: "80%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              sx={{ fontSize: "14px", color: "#d6141d", width: "160px" }}
            >
              Profile Name*
            </Typography>
            <StyledTextField
              name="recurrence_name"
              value={formik.values.recurrence_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{ width: "350px" }}
              error={
                formik.touched.recurrence_name &&
                Boolean(formik.errors.recurrence_name)
              }
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
          {formik.touched.recurrence_name && formik.errors.recurrence_name && (
            <FormHelperText
              error
              sx={{ ml: "160px", mt: -1, mb: 1, fontSize: "0.75rem" }}
            >
              {formik.errors.recurrence_name}
            </FormHelperText>
          )}

          {/*Repeat Every*/}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 20 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{ fontSize: "14px", width: "160px", color: "#d6141d" }}
              >
                Repeat Every*
              </Typography>
              <FormControl sx={{ width: "220px" }}>
                <StyledSelect
                  name="repeat_value"
                  value={formik.values.repeat_value}
                  onBlur={formik.handleBlur}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    fontSize: "14px", // 13px
                  }}
                >
                  {RepeatEveryTerms.map((term) => (
                    <MenuItem
                      key={term}
                      onClick={() => {
                        if (term.key === "custom") {
                          formik.setFieldValue("recurrence_frequency", "days");
                          formik.setFieldValue("repeat_every", 1);
                        } else {
                          formik.setFieldValue(
                            "recurrence_frequency",
                            term.key
                          );
                          formik.setFieldValue("repeat_every", term.value);
                        }
                        formik.setFieldValue("repeat_value", term.label);

                        if (term.label === "Custom") {
                          formik.setFieldValue("custom_repeat_count", "1");
                          formik.setFieldValue(
                            "custom_repeat_frequency",
                            "days"
                          );
                        } else {
                          formik.setFieldValue("custom_repeat_count", "");
                          formik.setFieldValue("custom_repeat_frequency", "");
                        }
                      }}
                      value={term.label}
                      sx={{ fontSize: "14px" }} // 13px
                    >
                      {term.label}
                    </MenuItem>
                  ))}
                  <Divider />
                </StyledSelect>
              </FormControl>
            </Box>

            {formik.values.repeat_value === "Custom" && (
              <>
                <Box>
                  <StyledTextField
                    name="custom_repeat_count"
                    value={formik.values.custom_repeat_count}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "custom_repeat_count",
                        event.target.value
                      );
                      formik.setFieldValue("repeat_every", event.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    sx={{ width: "70px" }}
                    error={
                      formik.touched.custom_repeat_count &&
                      Boolean(formik.errors.custom_repeat_count)
                    }
                  />
                </Box>

                <Box sx={{ ml: -16 }}>
                  <StyledSelect
                    name="custom_repeat_frequency"
                    value={formik.values.custom_repeat_frequency}
                    onBlur={formik.handleBlur}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      fontSize: "14px",
                      width: "150px",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        formik.setFieldValue("recurrence_frequency", "days");
                        formik.setFieldValue("custom_repeat_frequency", "days");
                      }}
                      value={"days"}
                      sx={{ fontSize: "14px" }}
                    >
                      Day(s)
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        formik.setFieldValue("recurrence_frequency", "weeks");
                        formik.setFieldValue(
                          "custom_repeat_frequency",
                          "weeks"
                        );
                      }}
                      value={"weeks"}
                      sx={{ fontSize: "14px" }}
                    >
                      Week(s)
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        formik.setFieldValue("recurrence_frequency", "months");
                        formik.setFieldValue(
                          "custom_repeat_frequency",
                          "months"
                        );
                      }}
                      value={"months"}
                      sx={{ fontSize: "14px" }}
                    >
                      Month(s)
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        formik.setFieldValue("recurrence_frequency", "years");
                        formik.setFieldValue(
                          "custom_repeat_frequency",
                          "years"
                        );
                      }}
                      value={"years"}
                      sx={{ fontSize: "14px" }}
                    >
                      Year(s)
                    </MenuItem>

                    <Divider />
                  </StyledSelect>
                </Box>
              </>
            )}
          </Box>

          {/* Start Date */}

          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "14px", width: "160px" }}>
                  Start On
                </Typography>
                <StyledTextField
                  type="date"
                  name="start_date"
                  value={formik.values.start_date}
                  onClick={() => {
                    // fallback in case ref wasn't ready
                    const input = document.querySelector(
                      'input[name="start_date"]'
                    );
                    if (input && input.showPicker) input.showPicker();
                  }}
                  inputRef={(ref) => {
                    if (ref) {
                      ref.onclick = () => ref.showPicker && ref.showPicker();
                    }
                  }}
                  onChange={(e) => {
                    formik.handleChange(e);
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
                  error={
                    formik.touched.start_date &&
                    Boolean(formik.errors.start_date)
                  }
                />
              </Box>
              {formik.touched.start_date && formik.errors.start_date && (
                <FormHelperText
                  error
                  sx={{ ml: "160px", mt: -1, mb: 1, fontSize: "0.75rem" }}
                >
                  {formik.errors.start_date}
                </FormHelperText>
              )}
            </Box>

            {/* End Date */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "14px", width: "100px" }}>
                  Ends On
                </Typography>
                <StyledTextField
                  type="date"
                  name="end_date"
                  value={formik.values.end_date}
                  onClick={() => {
                    // Correct input selector for end_date
                    const input = document.querySelector(
                      'input[name="end_date"]'
                    );
                    if (input && input.showPicker) input.showPicker();
                  }}
                  inputRef={(ref) => {
                    // Trigger the picker even if clicked directly on input
                    if (ref) {
                      ref.onclick = () => ref.showPicker && ref.showPicker();
                    }
                  }}
                  onChange={handleEndDateChange}
                  min={formik.values.start_date}
                  placeholder="DD/MM/YYYY"
                  sx={{
                    width: "150px",
                    "& input": {
                      cursor: "pointer",
                      "&::placeholder": {
                        color: "#978195",
                        fontWeight: "normal",
                      },
                    },
                  }}
                  error={
                    formik.touched.end_date && Boolean(formik.errors.end_date)
                  }
                />
              </Box>
              {formik.touched.end_date && formik.errors.end_date && (
                <FormHelperText
                  error
                  sx={{ ml: "100px", mt: -1, mb: 1, fontSize: "0.75rem" }}
                >
                  {formik.errors.end_date}
                </FormHelperText>
              )}
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_expired"
                    checked={formik.values.is_expired}
                    onChange={handleNeverExpiresChange}
                    size="small"
                  />
                }
                label={
                  <Typography sx={{ fontSize: "14px" }}>
                    Never Expires
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/*Payment Terms*/}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: "14px", width: "160px" }}>
              Payment Terms
            </Typography>
            <FormControl sx={{ width: "220px" }}>
              <Select
                id="payment_terms"
                name="payment_terms"
                value={formik.values.payment_terms_label}
                onChange={(e) => {
                  // Store the display value in payment_terms

                  // Set the payment_terms_label as well
                  formik.setFieldValue("payment_terms_label", e.target.value);

                  // Also set the numeric value for payment_terms
                  let numericValue = 0;
                  switch (e.target.value) {
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
                  formik.setFieldValue("payment_terms", numericValue);
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.payment_terms &&
                  Boolean(formik.errors.payment_terms)
                }
                displayEmpty
                sx={{
                  ...commonInputStyle,
                  width: "350px",
                  borderRadius: "7px",
                }}
                renderValue={(selected) => selected || "Search"}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "13px",
                      },
                      maxHeight: 250,
                      overflowY: "auto",
                    },
                  },
                }}
              >
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
                    position: "sticky",
                    bottom: 0,
                    bgcolor: "white",
                    zIndex: 1,
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", px: 4, py: 1 }}
                  >
                    <IconButton size="small" sx={{ color: "#408dfb" }}>
                      <Settings width="18px" />
                    </IconButton>

                    <Typography
                      variant="body1"
                      sx={{
                        ml: 1,
                        color: "#408dfb",
                        fontSize: "14px !important",
                      }}
                    >
                      Configure Terms
                    </Typography>
                  </Box>
                </ListSubheader>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 8 }} />
        </Box>

        <Box sx={{ width: "87%" }}>
          {/* <ItemTable formik={formik} /> */}
          <TableAndTotal formik={formik} />
        </Box>

        {/*Notes*/}

        <Paper
          elevation={0}
          sx={{
            p: 1,
            backgroundColor: "#f9f9fb",
            mb: 3,
            borderTop: "2px solid #ebebeb",
            borderBottom: "2px solid #ebebeb",
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 1.5,
              ml: 0.2,
              alignItems: "center",
              gap: 2.5,
              px: 5,
            }}
          >
            <Box sx={{ width: "70%", ml: 2 }}>
              <Typography variant="subtitle1" sx={{ color: "black", pl: 0.5 }}>
                Notes
              </Typography>
              <textarea
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                style={{
                  width: "100%",
                  minHeight: "60px",
                  maxHeight: "150px",
                  padding: "8px 12px",
                  border: "1px solid #c4c4c4",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", pl: 0.5 }}
              >
                It will not be shown in PDF
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/*Action Button*/}

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
        }}
      >
        <Button
          variant="contained"
          disableElevation
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
          }}
          color="primary"
          type="button"
          onClick={formik.handleSubmit}
        >
          Save
        </Button>

        <Button
          variant="outlined"
          onClick={() => router.push("/purchase/recurringbills")}
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
    </Box>
  );
};

export default NewRecurringBill;
