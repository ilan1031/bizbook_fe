"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  InputAdornment,
  Tooltip,
  IconButton,
  TableBody,
  TableCell,
  Paper,
  FormHelperText,
  ListItemText,
  Autocomplete,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Divider,
  Modal,
  Popper,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import PaymentTermsConfig from "./configurePaymentTerms/PaymentTermsConfig";

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

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

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

// MenuItem styles
const menuItemStyles = {
  fontSize: "13px",
  margin: "2px",
  borderRadius: "5px",
  "&:hover": {
    backgroundColor: "#408dfb",
    color: "white",
  },
};

const labelStyles = {
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
};
const StyledPopper = styled(Popper)({
  "& .MuiAutocomplete-paper": {
    maxHeight: 200,
    overflowY: "auto",
    margin: 0, // optional: remove extra spacing
    padding: 0,
  },
  "& .MuiAutocomplete-listbox": {
    maxHeight: "unset", // prevent double scroll by removing inner height limit
    padding: 0,
  },
});

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
];

const fieldVisibility = {
  "Registered Business - Regular": [
    "GSTIN/UIN",
    "Business Legal Name",
    "Business Trade Name",
    "Place of Supply",
  ],
  "Registered Business - Composition": [
    "GSTIN/UIN",
    "Business Legal Name",
    "Business Trade Name",
    "Place of Supply",
  ],
  "Unregistered Business": ["Place of Supply"],
  Consumer: ["Place of Supply"],
  Overseas: [], // Hide all fields
  "Special Economic Zone": [
    "GSTIN/UIN",
    "Business Legal Name",
    "Business Trade Name",
    "Place of Supply",
  ],
  "Deemed Export": [
    "GSTIN/UIN",
    "Business Legal Name",
    "Business Trade Name",
    "Place of Supply",
  ],
  "Tax Deductor": [
    "GSTIN/UIN",
    "Business Legal Name",
    "Business Trade Name",
    "Place of Supply",
  ],
  "SEZ Developer": [
    "GSTIN/UIN",
    "Business Legal Name",
    "Business Trade Name",
    "Place of Supply",
  ],
};

// const INDIAN_STATES = [
//   "Andaman and Nicobar Islands",
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chandigarh",
//   "Chhattisgarh",
//   "Dadra and Nagar Haveli",
//   "Daman and Diu",
//   "Delhi",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jammu and Kashmir",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Lakshadweep",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Puducherry",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
// ];
const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AD", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "DN", name: "Dadra and Nagar Haveli" },
  { code: "DD", name: "Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LD", name: "Lakshadweep" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
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
const OtherDetailsVendor = ({ formik }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  // const [gst_treatment, setGstTreatment] = useState("");
  // const [gst_no, setGstNo] = useState("");
  const [visibleFields, setVisibleFields] = useState([]);
  // const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [error, setError] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [search, setSearch] = useState("");
  const [newTerm, setNewTerm] = useState({ name: "", days: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [currencySearch, setCurrencySearch] = useState("");
  const [paymentTermsSearch, setPaymentTermsSearch] = useState("");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isPaymentTermsOpen, setIsPaymentTermsOpen] = useState(false);

  // State management for form values
  const [formValues, setFormValues] = useState({
    currency_code: "INR- Indian Rupee",
    currency_symbol: "₹",
    currency_code_short: "INR",
    opening_balance_amount: "",
    opening_balance_amount_formatted: "",
  });

  // Currency mapping
  const currencySymbols = {
    "INR- Indian Rupee": "₹",
    "AED- UAE Dirham": "د.إ",
    "AFN- Afghan Afghani": "؋",
    "AUD- Australian Dollar": "$",
    "BND- Brunei Dollar": "$",
    "CAD- Canadian Dollar": "$",
    "CNY- Yuan Renminbi": "¥",
    "GBP- Pound Sterling": "£",
    "JPY- Japanese Yen": "¥",
    "SAR- Saudi Riyal": "ر.س",
    "USD- US Dollar": "$",
    "EUR- Euro": "€",
    "ZAR- South African Rand": "R",
  };

  // Updated handleCurrencyChange
  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    const shortCode = selectedCurrency.split("-")[0].trim(); // e.g., "AED"
    const symbol = currencySymbols[selectedCurrency] || "";

    // Update formik values
    formik.setFieldValue("currency_code", shortCode);
    formik.setFieldValue("currency_symbol", symbol);
    formik.setFieldValue("currency_id", selectedCurrency);

    // Update local state
    setFormValues((prev) => ({
      ...prev,
      currency_code: shortCode,
      currency_symbol: symbol,
      currency_id: selectedCurrency,
      currency_code_short: shortCode, // ✅ Add this line
    }));
  };

  // State and Handlers (place inside your component)

  const [isPaymentTermsModalOpen, setIsPaymentTermsModalOpen] = useState(false);

  const allTerms = [
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    "Due On Receipt",
    "Due end of the month",
    "Due end of the next month",
  ];

  // Added inside the component
  const handleGSTChange = (event) => {
    const selectedOption = event.target.value;
    setVisibleFields(fieldVisibility[selectedOption] || []);
    formik.setFieldValue("gst_treatment", selectedOption);
  };
  const handleSearchChange = (e) => {
    e.stopPropagation();
    setSearch(e.target.value);
  };
  const handleSearchKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      handleClose();
    }
  };
  // For GST dropdown only control its search/open behavior
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setSearch("");
  };
  const handleClose = () => {
    setOpen(false);
    setSearch("");
  };

  const filteredCurrencies = Object.keys(currencySymbols).filter((currency) =>
    currency.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const filteredTerms = allTerms.filter((term) =>
    term.toLowerCase().includes(paymentTermsSearch.toLowerCase())
  );

  // Currency search
  const handleCurrencySearchChange = (e) => {
    e.stopPropagation();
    setCurrencySearch(e.target.value);
  };

  const handleCurrencySearchKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      setIsCurrencyOpen(false);
      setCurrencySearch("");
    }
  };

  // Payment terms search
  const handlePaymentSearchChange = (e) => {
    e.stopPropagation();
    setPaymentTermsSearch(e.target.value);
  };

  const handlePaymentSearchKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      setIsPaymentTermsOpen(false);
      setPaymentTermsSearch("");
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(
        (option) =>
          option.label.toLowerCase().includes(search.toLowerCase()) ||
          (option.desc &&
            option.desc.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredOptions(filtered);
    }
  }, [search]);

  useEffect(() => {
    // Replace with actual implementation or remove if not needed
    const getTaxExemptions = () => {
      // Implementation here
      console.log("Getting tax exemptions...");
    };

    getTaxExemptions();
  }, []);

  // Form field component to reduce repetition
  const FormField = ({
    label,
    name,
    // type = "text",
    children,
    tooltip,
    ...props
  }) => (
    <>
      <Grid
        item
        xs={15}
        sm={3}
        md={2}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Typography component="label" sx={labelStyles}>
          {label}
          {tooltip && (
            <Tooltip title={tooltip} arrow>
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <InfoIcon fontSize="small" color="action" />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
      </Grid>
      <Grid item xs={7} sm={9} md={10}>
        {children}
      </Grid>
    </>
  );

  return (
    <Box maxWidth="md" sx={{ margin: 0 }}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* GST Treatment Field */}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} mt={2}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  color: "#d6141d",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                GST Treatment*
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl Width size="small" sx={{ ...commonStyles }}>
                <Select
                  displayEmpty
                  value={formik.values.gst_treatment || ""}
                  name="gst_treatment"
                  onChange={handleGSTChange}
                  error={
                    formik.touched.gst_treatment &&
                    Boolean(formik.errors.gst_treatment)
                  }
                  helperText={
                    formik.touched.gst_treatment && formik.errors.gst_treatment
                  }
                  IconComponent={ArrowDropDownIcon}
                  renderValue={(selected) =>
                    selected || "Select a GST treatment"
                  }
                  onOpen={handleOpen}
                  onClose={handleClose}
                  open={open}
                  MenuProps={{
                    autoFocus: false,
                    disableAutoFocusItem: true,
                    disableEnforceFocus: true,
                    sx: {
                      top: "12px",
                    },
                    PaperProps: {
                      sx: {
                        maxHeight: "250px",
                        maxWidth: "350px",
                        "& .MuiMenuItem-root": {
                          fontSize: "13px",
                          alignItems: "flex-start",
                          whiteSpace: "normal",
                          paddingY: "6px",
                          "&:hover": {
                            backgroundColor: "#408DFB !important",
                            color: "#fff !important",
                            "& .MuiTypography-root": {
                              color: "#fff !important",
                            },
                          },
                        },
                      },
                    },
                    MenuListProps: {
                      autoFocusItem: false,
                      subheader: (
                        <Box
                          sx={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "white",
                            zIndex: 1,
                            padding: "8px",
                            borderBottom: "1px solid #F0F0F0",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <SearchIcon
                              sx={{
                                fontSize: "18px",
                                color: "#888",
                                marginLeft: "5px",
                                marginRight: "5px",
                                width: "15px",
                              }}
                              width={"15px"}
                            />
                            <InputBase
                              placeholder="Search"
                              value={search}
                              onChange={handleSearchChange}
                              onKeyDown={handleSearchKeyDown}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                              fullWidth
                              sx={{
                                fontSize: "13px",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                              inputProps={{
                                "aria-label": "search",
                                onKeyDown: (e) => e.stopPropagation(),
                              }}
                            />
                          </Box>
                        </Box>
                      ),
                    },
                  }}
                  sx={{
                    fontSize: "13px",
                    minWidth: "350px",
                    height: "38px",
                    paddingX: "10px",
                    paddingY: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <MenuItem
                        key={index}
                        value={option.label}
                        onClick={() => {
                          handleGSTChange({
                            target: { value: option.label },
                          });
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography fontSize="13px" fontWeight="600">
                              {option.label}
                            </Typography>
                          }
                          secondary={
                            <Typography fontSize="12px" color="text.secondary">
                              {option.desc}
                            </Typography>
                          }
                        />
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <Typography fontSize="12px" color="text.secondary">
                        No results found
                      </Typography>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* GSTIN/UIN */}
            {visibleFields.includes("GSTIN/UIN") && (
              <>
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      color: "#d6141d",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    GSTIN / UIN*
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    id="gst_no"
                    name="gst_no"
                    value={formik.values.gst_no || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.gst_no && Boolean(formik.errors.gst_no)
                    }
                    helperText={formik.touched.gst_no && formik.errors.gst_no}
                    size="small"
                    style={{ width: 350 }}
                    InputLabelProps={{
                      sx: { fontSize: "13px" },
                    }}
                    InputProps={{
                      sx: { fontSize: "13px" },
                    }}
                  />
                </Grid>
              </>
            )}

            {/* Place of Supply */}
            {visibleFields.includes("Place of Supply") && (
              <>
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      color: "#d6141d",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Place of Supply*
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <FormControl Width size="small" sx={{ ...commonStyles }}>
                    <Autocomplete
                      options={INDIAN_STATES}
                      size="small"
                      getOptionLabel={(option) =>
                        `[${option.code}] - ${option.name}`
                      }
                      value={
                        INDIAN_STATES.find(
                          (state) =>
                            state.name === formik.values.place_of_contact
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "place_of_contact",
                          newValue ? newValue.name : ""
                        );
                        formik.setFieldValue(
                          "place_of_contact_formatted",
                          newValue ? newValue.code : ""
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search"
                          variant="outlined"
                          error={
                            formik.touched.place_of_contact &&
                            Boolean(formik.errors.place_of_contact)
                          }
                          helperText={
                            formik.touched.place_of_contact
                              ? formik.errors.place_of_contact
                              : ""
                          }
                          InputLabelProps={{
                            shrink: false,
                            sx: { fontSize: "13px" },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{ fontSize: "13px", padding: "6px 12px" }}
                        >
                          [{option.code}] - {option.name}
                        </li>
                      )}
                      sx={{ width: 350 }}
                      PopperComponent={StyledPopper}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            {/* PAN */}
            <Grid item xs={12} sm={4}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  // color: "#d6141d",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                PAN
                <Tooltip title="Permanent Account Number" arrow>
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <TextField
                name="pan_no"
                variant="outlined"
                value={formik.values.pan_no || ""}
                onChange={formik.handleChange}
                error={formik.touched.pan_no && Boolean(formik.errors.pan_no)}
                helperText={formik.touched.pan_no && formik.errors.pan_no}
                size="small"
                style={{ width: 350,fontSize:"13px" }}
              />
            </Grid>

            {/* MSME Registered Field */}

            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                MSME Registered?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="msme_registered"
                    checked={
                      formik.values.msme_registered === "registered" || false
                    }
                    onChange={(e) => {
                      // Set string value instead of boolean
                      formik.setFieldValue(
                        "msme_registered",
                        e.target.checked ? "registered" : "not_registered"
                      );
                    }}
                    size="small"
                  />
                }
                label={
                  <Typography sx={{ fontSize: "13px" }}>
                    This vendor is MSME registered
                  </Typography>
                }
                sx={commonStyles}
              />
            </Grid>

            {/* Conditional MSME/Udyam Registration Type Field */}
            {formik.values.msme_registered === "registered" && (
              <>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "13px", color: "#d6141d", width: "150px" }}
                  >
                    MSME/Udyam Registration Type{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={commonStyles}
                    style={{ width: 350 }}
                    error={
                      formik.touched.msme_type &&
                      Boolean(formik.errors.msme_type)
                    }
                  >
                    <StyledSelect
                      name="msme_type"
                      value={formik.values.msme_type || ""}
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
                              Select the Registration Type
                            </Typography>
                          );
                        }
                        return selected;
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                        MenuListProps: {
                          style: { padding: "0" },
                        },
                      }}
                    >
                      {/* Search field inside the dropdown */}
                      <Box
                        sx={{
                          p: 1,
                          position: "sticky",
                          top: 0,
                          bgcolor: "background.paper",
                          zIndex: 1,
                        }}
                      >
                        <TextField
                          fontSize="12px"
                          autoFocus
                          placeholder="Search"
                          variant="outlined"
                          size="small"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box sx={{ color: "#757575" }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                  </svg>
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const searchText = e.target.value.toLowerCase();
                            document
                              .querySelectorAll("[data-msme-type-item]")
                              .forEach((item) => {
                                const text = item.textContent.toLowerCase();
                                item.style.display = text.includes(searchText)
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
                      <Divider />

                      {/* Menu items */}
                      <MenuItem
                        value="Micro"
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                            color: "white",
                          },
                        }}
                        data-msme-type-item="true"
                      >
                        Micro
                      </MenuItem>
                      <MenuItem
                        value="Small"
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                            color: "white",
                          },
                        }}
                        data-msme-type-item="true"
                      >
                        Small
                      </MenuItem>
                      <MenuItem
                        value="Medium"
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                            color: "white",
                          },
                        }}
                        data-msme-type-item="true"
                      >
                        Medium
                      </MenuItem>
                    </StyledSelect>
                    {formik.touched.msme_type && formik.errors.msme_type && (
                      <FormHelperText error>
                        {formik.errors.msme_type}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Conditional MSME/Udyam Registration Number Field */}
            {formik.values.msme_registered === "registered" && (
              <>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "13px", color: "#d6141d",width:"150px" }}
                  >
                    MSME/Udyam Registration Number{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="msme_number"
                    variant="outlined"
                    value={formik.values.msme_number || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.msme_number &&
                      Boolean(formik.errors.msme_number)
                    }
                    helperText={
                      formik.touched.msme_number && formik.errors.msme_number
                    }
                    size="small"
                    style={{ width: 350 }}
                    placeholder="Enter the Registration Number (UDYAM-XX-00-0000000)"
                    sx={commonStyles}
                    fullWidth
                  />
                </Grid>
              </>
            )}

            {/* Currency Field */}
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                Currency
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl
                fullWidth
                size="small"
                sx={commonStyles}
                style={{ width: 350, fontSize: "13px" }}
              >
                <Select
                  name="currency_code"
                  value={formik.values.currency_code}
                  onChange={handleCurrencyChange}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    fontSize: "13px",
                    margin: "2px",
                    borderRadius: "5px",
                    // "&:hover": {
                    //   backgroundColor: "#408dfb",
                    //   color: "white",
                    // },
                  }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography sx={{ fontSize: "13px" }}>
                          Select Currency
                        </Typography>
                      );
                    }
                    return selected;
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                    MenuListProps: {
                      style: { padding: "0" },
                    },
                  }}
                  onOpen={() => setIsCurrencyOpen(true)}
                  onClose={() => {
                    setIsCurrencyOpen(false);
                    setCurrencySearch(""); // reset
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
                        value={currencySearch}
                        onChange={handleCurrencySearchChange}
                        onKeyDown={handleCurrencySearchKeyDown}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ color: "#757575", mr: -0.5 }}>
                                <SearchIcon
                                  sx={{ fontSize: "16px", marginTop: "5px" }}
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

                  <Divider />

                  {/* Filtered Currency Items */}
                  {filteredCurrencies.map((currency) => (
                    <MenuItem
                      key={currency}
                      value={currency}
                      sx={{
                        fontSize: "13px",
                        margin: "2px",
                        borderRadius: "5px",
                        "&:hover": {
                          backgroundColor: "#408dfb",
                          color: "white",
                        },
                      }}
                      data-currency-item="true"
                    >
                      {currency} ({currencySymbols[currency]})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Opening Balance Field */}
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                Opening Balance
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <TextField
                name="opening_balance_amount"
                style={{ width: 350 }}
                fullWidth
                variant="outlined"
                value={formik.values.opening_balance_amount || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    // Allows only numbers and a single decimal point
                    formik.setFieldValue("opening_balance_amount", value);
                  }
                }}
                onBlur={formik.values.opening_balance_amount}
                error={
                  formik.touched.opening_balance_amount &&
                  Boolean(formik.errors.opening_balance_amount)
                }
                helperText={
                  formik.touched.opening_balance_amount &&
                  formik.errors.opening_balance_amount
                }
                size="small"
                sx={commonStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        component="div"
                        sx={{
                          bgcolor: "#f5f5f5",
                          p: "4px 8px",
                          borderRight: "1px solid #ccc",
                          marginLeft: "-14px",
                          fontSize: "13px",
                          minWidth: "40px",
                          textAlign: "center",
                        }}
                      >
                        {formValues.currency_code_short}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Payment Terms Field - New Addition */}

            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                Payment Terms
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl
                fullWidth
                size="small"
                sx={commonStyles}
                style={{ width: 350 }}
              >
                <StyledSelect
                  name="payment_terms"
                  value={formik.values.payment_terms || ""}
                  onChange={formik.handleChange}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{ fontSize: "13px" }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography sx={{ color: "#757575", fontSize: "13px" }}>
                          Due On Receipt
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
                    setPaymentTermsSearch(""); // reset
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
                        onKeyDown={handlePaymentSearchKeyDown}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ color: "#757575", mr: -0.5 }}>
                                <SearchIcon
                                  sx={{ fontSize: "16px", marginTop: "5px" }}
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

                  {/* Filtered Dropdown Items */}
                  {filteredTerms.map((term) => (
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
                      data-payment-term-item="true"
                    >
                      {term}
                    </MenuItem>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  {/* Configure Terms Button */}
                  <Button
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
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaymentTermsModalOpen(true);
                    }}
                  >
                    <SettingsOutlinedIcon
                      sx={{ fontSize: "16px", marginRight: "10px" }}
                    />
                    Configure Terms
                  </Button>
                </StyledSelect>
              </FormControl>

              {/* Modal for Payment Terms Config */}
              <Modal
                open={isPaymentTermsModalOpen}
                onClose={() => setIsPaymentTermsModalOpen(false)}
              >
                <PaymentTermsConfig />
              </Modal>
            </Grid>

            {/* TDS Field */}
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                TDS
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl
                fullWidth
                size="small"
                sx={commonStyles}
                style={{ width: 350, fontSize: "13px" }}
              >
                <StyledSelect
                  name="tax_name"
                  value={formik.values.tax_name || ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Extract the percentage from the tax name
                    const value = e.target.value;
                    if (value) {
                      const percentageMatch = value.match(/\[(\d+(\.\d+)?)%\]/);
                      if (percentageMatch && percentageMatch[1]) {
                        formik.setFieldValue(
                          "tax_percentage",
                          percentageMatch[1]
                        );
                      }
                      // Also set the formatted tax name
                      formik.setFieldValue("tax_name_formatted", value);
                    }
                  }}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{ fontSize: "13px" }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography sx={{ color: "#757575", fontSize: "13px" }}>
                          Select a Tax
                        </Typography>
                      );
                    }
                    return selected;
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                    MenuListProps: {
                      style: { padding: "0" },
                    },
                  }}
                >
                  {/* Search field inside the dropdown */}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ color: "#757575", mr: -0.5 }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        // Filter items based on search text
                        const searchText = e.target.value.toLowerCase();
                        document
                          .querySelectorAll("[data-tax-item]")
                          .forEach((item) => {
                            const text = item.textContent.toLowerCase();
                            item.style.display = text.includes(searchText)
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
                  <Divider />

                  {/* Menu items */}

                  <MenuItem
                    value="Commission or Brokerage [2%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Commission or Brokerage [2%]
                  </MenuItem>
                  <MenuItem
                    value="Commission or Brokerage (Reduced) [3.75%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Commission or Brokerage (Reduced) [3.75%]
                  </MenuItem>
                  <MenuItem
                    value="Dividend [10%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Dividend [10%]
                  </MenuItem>
                  <MenuItem
                    value="Dividend (Reduced) [7.5%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Dividend (Reduced) [7.5%]
                  </MenuItem>
                  <MenuItem
                    value="Other Interest than securities [10%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Other Interest than securities [10%]
                  </MenuItem>
                  <MenuItem
                    value="Other Interest than securities (Reduced) [7.5%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Other Interest than securities (Reduced) [7.5%]
                  </MenuItem>
                  <MenuItem
                    value="Payment of contractors for Others [2%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Payment of contractors for Others [2%]
                  </MenuItem>
                  <MenuItem
                    value="Payment of contractors for Others (Reduced) [1.5%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Payment of contractors for Others (Reduced) [1.5%]
                  </MenuItem>
                  <MenuItem
                    value="Payment of contractors HUF/Indiv [1%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Payment of contractors HUF/Indiv [1%]
                  </MenuItem>
                  <MenuItem
                    value="Payment of contractors HUF/Indiv (Reduced) [0.75%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Payment of contractors HUF/Indiv (Reduced) [0.75%]
                  </MenuItem>
                  <MenuItem
                    value="Professional Fees [10%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Professional Fees [10%]
                  </MenuItem>
                  <MenuItem
                    value="Professional Fees (Reduced) [7.5%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Professional Fees (Reduced) [7.5%]
                  </MenuItem>
                  <MenuItem
                    value="Rent on land or furniture etc [10%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Rent on land or furniture etc [10%]
                  </MenuItem>
                  <MenuItem
                    value="Rent on land or furniture etc (Reduced) [7.5%]"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Rent on land or furniture etc (Reduced) [7.5%]
                  </MenuItem>
                  <MenuItem
                    value="Technical Fees (2%) [2%]"
                    sx={{
                      fontSize: "12px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-tax-item="true"
                  >
                    Technical Fees (2%) [2%]
                  </MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>

            {/* Enable Portal Field */}
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                Enable Portal?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_portal_enabled"
                    checked={formik.values.is_portal_enabled || false}
                    onChange={formik.handleChange}
                    size="small"
                  />
                }
                label={
                  <Typography sx={{ fontSize: "13px" }}>
                    Allow portal access for this vendor
                  </Typography>
                }
                sx={commonStyles}
              />
            </Grid>

            {/* Portal Language Field */}
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                Portal Language
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl
                fullWidth
                size="small"
                sx={commonStyles}
                style={{ width: 350 }}
              >
                <StyledSelect
                  name="language_code"
                  value={formik.values.language_code || ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Set the formatted language code as well
                    formik.setFieldValue(
                      "language_code_formatted",
                      e.target.value
                    );
                  }}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{ fontSize: "13px" }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography sx={{ color: "#757575", fontSize: "13px" }}>
                          English
                        </Typography>
                      );
                    }
                    return selected;
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                    MenuListProps: {
                      style: { padding: "0" },
                    },
                  }}
                >
                  {/* Search field inside the dropdown */}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ color: "#757575", mr: -0.5 }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        // Filter items based on search text
                        const searchText = e.target.value.toLowerCase();
                        document
                          .querySelectorAll("[data-language-item]")
                          .forEach((item) => {
                            const text = item.textContent.toLowerCase();
                            item.style.display = text.includes(searchText)
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
                  <Divider />

                  {/* Menu items */}
                  <MenuItem
                    value="English"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-language-item="true"
                  >
                    English
                  </MenuItem>
                  <MenuItem
                    value="Hindi"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-language-item="true"
                  >
                    Hindi
                  </MenuItem>
                  <MenuItem
                    value="Spanish"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-language-item="true"
                  >
                    Spanish
                  </MenuItem>
                  <MenuItem
                    value="French"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-language-item="true"
                  >
                    French
                  </MenuItem>
                  <MenuItem
                    value="German"
                    sx={{
                      fontSize: "13px",
                      margin: "2px",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                      },
                    }}
                    data-language-item="true"
                  >
                    German
                  </MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>

            {/* Documents Field */}
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                Documents
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    textTransform: "none",
                    borderColor: "#ddd",
                    color: "#555",
                    fontSize: "13px",
                    height: "36px",
                    "&:hover": {
                      borderColor: "#bbb",
                      bgcolor: "#f9f9f9",
                    },
                  }}
                >
                  Upload File
                </Button>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#777",
                    mt: 1,
                    fontSize: "11px",
                  }}
                >
                  You can upload a maximum of 10 files, 10MB each
                </Typography>
              </Box>
            </Grid>

            {/* Additional Details - Hidden initially */}
            {showMoreDetails && (
              <>
                {/* Website URL Field */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" sx={{ fontSize: "13px" }}>
                    Website URL
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <StyledTextField
                    name="website"
                    fullWidth
                    variant="outlined"
                    value={formik.values.website || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.website && Boolean(formik.errors.website)
                    }
                    helperText={formik.touched.website && formik.errors.website}
                    size="small"
                    sx={commonStyles}
                    style={{ width: 350 }}
                    placeholder="ex: www.zyker.com"
                    multiline
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanguageIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Department Field */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" sx={{ fontSize: "13px" }}>
                    Department
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <StyledTextField
                    name="department"
                    fullWidth
                    variant="outlined"
                    value={formik.values.department || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.department &&
                      Boolean(formik.errors.department)
                    }
                    helperText={
                      formik.touched.department && formik.errors.department
                    }
                    size="small"
                    sx={commonStyles}
                    style={{ width: 350 }}
                    multiline
                  />
                </Grid>

                {/* Designation Field */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" sx={{ fontSize: "13px" }}>
                    Designation
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <StyledTextField
                    name="designation"
                    fullWidth
                    variant="outlined"
                    value={formik.values.designation || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.designation &&
                      Boolean(formik.errors.designation)
                    }
                    helperText={
                      formik.touched.designation && formik.errors.designation
                    }
                    size="small"
                    sx={commonStyles}
                    style={{ width: 350 }}
                    multiline
                  />
                </Grid>

                {/* Twitter Field */}

                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" sx={{ fontSize: "13px" }}>
                    Twitter
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <StyledTextField
                    name="twitter"
                    fullWidth
                    variant="outlined"
                    value={formik.values.twitter || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.twitter && Boolean(formik.errors.twitter)
                    }
                    helperText={formik.touched.twitter && formik.errors.twitter}
                    size="small"
                    sx={commonStyles}
                    style={{ width: 350 }}
                    multiline
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box
                            component="span"
                            sx={{ fontSize: "16px", fontWeight: "bold" }}
                          >
                            𝕏
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#777",
                      mt: -1,
                      mb: 2,
                      fontSize: "11px",
                    }}
                  >
                    http://www.twitter.com/
                  </Typography>
                </Grid>

                {/* Skype Name/Number Field */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" sx={{ fontSize: "13px" }}>
                    Skype Name/Number
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <StyledTextField
                    name="skype"
                    fullWidth
                    variant="outlined"
                    value={formik.values.skype || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.skype && Boolean(formik.errors.skype)}
                    helperText={formik.touched.skype && formik.errors.skype}
                    size="small"
                    style={{ width: 350 }}
                    sx={commonStyles}
                    multiline
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: "#00aff0", fontWeight: "bold" }}>
                            S
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Facebook Field */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" sx={{ fontSize: "13px" }}>
                    Facebook
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <StyledTextField
                    name="facebook"
                    fullWidth
                    variant="outlined"
                    value={formik.values.facebook || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.facebook && Boolean(formik.errors.facebook)
                    }
                    helperText={
                      formik.touched.facebook && formik.errors.facebook
                    }
                    size="small"
                    sx={commonStyles}
                    style={{ width: 350 }}
                    multiline
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FacebookIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#777",
                      mt: -1,
                      mb: 2,
                      fontSize: "11px",
                    }}
                  >
                    http://www.facebook.com/
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
          {/* Add/Remove More Details Button */}
          <Box sx={{ mt: 2, mb: 10 }}>
            <Button
              variant="text"
              startIcon={showMoreDetails ? <RemoveIcon /> : <AddIcon />}
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              sx={{
                color: "#0077ff",
                textTransform: "none",
                fontWeight: "normal",
                fontSize: "13px",
                p: 0,
              }}
            >
              {showMoreDetails ? "Hide additional details" : "Add more details"}
            </Button>
          </Box>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OtherDetailsVendor;
