"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
  Popover,
  RadioGroup,
  Radio,
  Autocomplete,
  styled,
  Popper,
  ListSubheader,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import apiService from "../../../services/axiosService";
import { Search, Settings } from "lucide-react";
import { useSnackbar } from "../../../components/SnackbarProvider";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

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
const StyledListbox = styled("ul")({
  "& li": {
    fontSize: "13px",
    padding: "6px 12px",
    borderRadius: "5px",
    margin: "2px 4px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#408dfb",
      color: "white",
    },
  },
});
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

const OtherDetailsCustomer = ({ formik }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [visibleFields, setVisibleFields] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [taxOption, setTaxOption] = useState([]);
  const [files, setFiles] = useState([]);
  const { showMessage } = useSnackbar();
  const [previewFile, setPreviewFile] = useState([]);
  const theme = useTheme();

  const handleOpenFileList = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFileList = () => {
    setAnchorEl(null);
  };

  const openFileList = Boolean(anchorEl);
  const idPop = openFileList ? "simple-popover" : undefined;

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

  const gstTreatment = formik.values.gst_treatment;

  useEffect(() => {
    if (gstTreatment) {
      setVisibleFields(fieldVisibility[gstTreatment] || []);
    }
  }, [gstTreatment]);

  useEffect(() => {
    getTaxExemptions();
  }, []);

  const getTaxExemptions = async () => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      const response = await apiService({
        method: "GET",
        url: `/api/v1/taxes?organization_id=${organization_id}&type=customer`,
      });
      const data = response.data.data.map((item) => ({
        exemption_id: item.tax_exemption_id,
        exemption_code: item.tax_exemption_code,
      }));
      setTaxOption(data);
    } catch (err) {
      console.error("Failed to fetch tax exemptions:", err);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setSearch("");
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
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

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      showMessage(`"${selectedFile.name}" exceeds the 5MB limit.`, "error");
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
    formik.setFieldValue("documents", selectedFile);
  };

  const removeFile = () => {
    // formik.setFieldValue("profile_image", null);
    // setAnchorEl(null);

    setFiles([]);
    setAnchorEl(null);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
  };

  const handleGSTChange = (event) => {
    const selectedOption = event.target.value;
    setVisibleFields(fieldVisibility[selectedOption] || []);
    formik.setFieldValue("gst_treatment", selectedOption);
  };

  const commonStyles = {
    fontSize: "13px",
    "& .MuiInputBase-root": {
      fontSize: "13px",
      height: "36px",
    },
    "& .MuiFormLabel-root": {
      fontSize: "13px",
    },
    "& .MuiFormHelperText-root": {
      fontSize: "11px",
    },
    mb: 2,
  };

  // Handler to add new exemption code to dropdown if not present
  const handleExemptionBlurOrEnter = (event, value) => {
    if (!value) return;
    // Check if value is already present
    const exists = taxOption.some(
      (option) => option.exemption_code.toLowerCase() === value.toLowerCase()
    );
    if (!exists) {
      // Add new value to dropdown
      const newOption = {
        exemption_id: "", // No id for custom
        exemption_code: value.toUpperCase(),
      };
      setTaxOption((prev) => [...prev, newOption]);
    }
  };

  return (
    <Box maxWidth="lg" sx={{ margin: 0 }}>
      <Paper elevation={0} sx={{ padding: "33px" }}>
        <Grid container spacing={2}>
          {/* GST Treatment */}
          <Grid container spacing={2}>
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
                            borderRadius: "5px",
                            backgroundColor:
                              theme.palette.hover?.background || "",
                            color: theme.palette.hover?.text || "",
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

            {/* Business Legal Name */}
            {visibleFields.includes("Business Legal Name") && (
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
                    Business Legal Name*
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="legal_name"
                    variant="outlined"
                    value={formik.values.legal_name || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.legal_name &&
                      Boolean(formik.errors.legal_name)
                    }
                    helperText={
                      formik.touched.legal_name && formik.errors?.legal_name
                    }
                    size="small"
                    style={{ width: 350 }}
                  />
                </Grid>
              </>
            )}

            {/* Business Trade Name */}
            {visibleFields.includes("Business Trade Name") && (
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
                    Business Trade Name*
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="trader_name"
                    variant="outlined"
                    value={formik.values.trader_name || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.trader_name &&
                      Boolean(formik.errors.trader_name)
                    }
                    helperText={
                      formik.touched.trader_name && formik.errors?.trader_name
                    }
                    size="small"
                    style={{ width: 350 }}
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
                        <MenuItem
                          {...props}
                          sx={{
                            fontSize: "13px",
                            padding: "6px 12px",
                            "&:hover": {
                              backgroundColor: "#408dfb",
                              borderRadius: "5px",
                              margin: "2px",
                            },
                          }}
                        >
                          [{option.code}] - {option.name}
                        </MenuItem>
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
                style={{ width: 350 }}
              />
            </Grid>

            {/* Tax Preference */}
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
                Tax Preference*
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <RadioGroup
                row
                name="is_taxable"
                value={formik.values.is_taxable ? "Taxable" : "Tax Exempt"}
                onChange={(event) => {
                  const isTaxable = event.target.value === "Taxable";
                  formik.setFieldValue("is_taxable", isTaxable);
                  if (isTaxable) {
                    formik.setFieldValue("tax_exemption_code", "");
                  }
                }}
              >
                <FormControlLabel
                  value="Taxable"
                  control={
                    <Radio sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }} />
                  }
                  label={
                    <Typography sx={{ fontSize: "14px" }}>Taxable</Typography>
                  }
                />
                <FormControlLabel
                  value="Tax Exempt"
                  control={
                    <Radio sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }} />
                  }
                  label={
                    <Typography sx={{ fontSize: "14px" }}>
                      Tax Exempt
                    </Typography>
                  }
                />
              </RadioGroup>
            </Grid>

            {/* Exemption Reason (Conditional) */}
            {!formik.values.is_taxable && (
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
                    Exemption Reason*
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <Autocomplete
                    name="tax_exemption_code"
                    options={taxOption}
                    getOptionLabel={(option) => option.exemption_code}
                    value={
                      taxOption.find(
                        (option) =>
                          option.exemption_code ===
                          formik.values.tax_exemption_code
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        formik.setFieldValue(
                          "tax_exemption_code",
                          newValue.exemption_code
                        );
                        formik.setFieldValue(
                          "tax_exemption_id",
                          newValue.exemption_id
                        );
                        // Add to dropdown if not present
                        handleExemptionBlurOrEnter(
                          event,
                          newValue.exemption_code
                        );
                      } else {
                        formik.setFieldValue("tax_exemption_code", "");
                        formik.setFieldValue("tax_exemption_id", "");
                      }
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (!newInputValue) {
                        formik.setFieldValue("tax_exemption_code", "");
                        formik.setFieldValue("tax_exemption_id", "");
                      } else if (
                        !taxOption.some(
                          (option) => option.exemption_code === newInputValue
                        )
                      ) {
                        formik.setFieldValue(
                          "tax_exemption_code",
                          newInputValue.toUpperCase()
                        );
                        formik.setFieldValue("tax_exemption_id", "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        error={
                          formik.touched.tax_exemption_code &&
                          Boolean(formik.errors.tax_exemption_code)
                        }
                        helperText={
                          formik.touched.tax_exemption_code &&
                          formik.errors.tax_exemption_code
                        }
                        size="small"
                        style={{ width: 350 }}
                        onBlur={(e) => {
                          handleExemptionBlurOrEnter(
                            e,
                            formik.values.tax_exemption_code
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleExemptionBlurOrEnter(
                              e,
                              formik.values.tax_exemption_code
                            );
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            {/* Currency */}
            <Grid item xs={12} sm={4}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Currency
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl fullWidth size="small" sx={{ ...commonStyles }}>
                <Select
                  name="currency_code"
                  disabled
                  value={formik.values.currency_code || ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    const currencySymbols = {
                      "INR- Indian Rupee": "₹",
                      "USD- US Dollar": "$",
                      "EUR- Euro": "€",
                      "GBP- British Pound": "£",
                    };
                    const symbol = currencySymbols[e.target.value] || "";
                    formik.setFieldValue("currency_symbol", symbol);
                  }}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    fontSize: "13px",
                    background: "#eeeeee",
                    width: "350px",
                    "&hover": {
                      borderRadius: "5px",
                      backgroundColor: theme.palette.hover?.background || "",
                      color: theme.palette.hover?.text || "",
                    },
                  }}
                >
                  <MenuItem value="INR- Indian Rupee">
                    INR- Indian Rupee
                  </MenuItem>
                  <MenuItem value="USD- US Dollar">USD- US Dollar</MenuItem>
                  <MenuItem value="EUR- Euro">EUR- Euro</MenuItem>
                  <MenuItem value="GBP- British Pound">
                    GBP- British Pound
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Opening Balance */}
            <Grid item xs={12} sm={4}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
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
                  if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                    formik.handleChange(e);
                    const formattedValue = value
                      ? `${formik.values.currency_symbol || ""}${parseFloat(
                          value
                        ).toFixed(2)}`
                      : "";
                    formik.setFieldValue(
                      "opening_balance_amount_formatted",
                      formattedValue
                    );
                  }
                }}
                onBlur={formik.handleBlur}
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
                        sx={{
                          bgcolor: "#f5f5f5",
                          p: "4px 8px",
                          borderRight: "1px solid #ccc",
                          marginLeft: "-14px",
                          fontSize: "13px",
                        }}
                      >
                        {formik.values.currency_code
                          ? formik.values.currency_code.split("-")[0]
                          : "INR"}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Payment Terms */}
            <Grid item xs={12} sm={4}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Payment Terms
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl fullWidth size="small" sx={commonStyles}>
                <Select
                  id="payment_terms"
                  name="payment_terms"
                  value={formik.values.payment_terms_label}
                  onChange={(e) => {
                    // Store the display value in payment_terms

                    // Set the payment_terms_label as well
                    formik.setFieldValue("payment_terms_label", e.target.value);

                    // Also set the numeric value for payment_terms_id
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
                    formik.setFieldValue("payment_terms_id", numericValue);
                    formik.setFieldValue("payment_terms", numericValue);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.payment_terms &&
                    Boolean(formik.errors.payment_terms)
                  }
                  displayEmpty
                  sx={{
                    width: "350px",
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
                  {/* Sticky Search Box */}
                  <ListSubheader
                    sx={{
                      position: "sticky",
                      top: 0,
                      bgcolor: "white",
                      zIndex: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Search
                        fontSize="small"
                        style={{
                          marginRight: "2px",
                          color: "gray",
                          py: 2,
                          width: "16px",
                        }}
                      />
                      <TextField
                        fullWidth
                        placeholder="Search..."
                        variant="standard"
                        sx={{ fontSize: "13px" }}
                        InputProps={{
                          disableUnderline: true,
                          fontSize: "12px",
                        }}
                      />
                    </Box>
                  </ListSubheader>

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
                      sx={{
                        
                        "&:hover": {
                          borderRadius: "5px",
                          backgroundColor:
                            theme.palette.hover?.background || "",
                          color: theme.palette.hover?.text || "",
                        },
                      }}
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
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 4,
                        py: 1,
                      }}
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
            </Grid>

            {/* Enable Portal? */}
            <Grid item xs={12} sm={4}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Enable Portal?
                <Tooltip title="Allow customer to access their portal" arrow>
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-6}>
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
                    Allow portal access for this customer
                  </Typography>
                }
                sx={commonStyles}
              />
            </Grid>

            {/* Portal Language */}
            <Grid item xs={12} sm={4}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Portal Language
                <Tooltip title="Default language for vendor portal" arrow>
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <FormControl fullWidth size="small" sx={commonStyles}>
                <Select
                  name="language_code"
                  value={formik.values.language_code || ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue(
                      "language_code_formatted",
                      e.target.value
                    );
                  }}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{ fontSize: "13px", width: "350px" }}
                >
                  {["English", "Hindi", "Spanish", "French", "German"].map(
                    (lang) => (
                      <MenuItem
                        key={lang}
                        value={lang}
                        sx={{
                          fontSize: "13px",
                          "&:hover": {
                            borderRadius: "5px",                             
                            backgroundColor:theme.palette.hover?.background || "",
                            color: theme.palette.hover?.text || "",
                          },
                        }}
                      >
                        {lang}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Documents */}
            <Grid item xs={12} sm={4}>
              <Typography
                component="label"
                sx={{
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Documents
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} ml={20} mt={-5}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* File Upload Button */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon sx={{ fontSize: "16px" }} />}
                    endIcon={<ArrowDropDownIcon sx={{ fontSize: "16px" }} />}
                    sx={{
                      textTransform: "none",
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: "1px dashed #ddd",
                      color: "#555",
                      height: "31px",
                      padding: "2px 10px",
                      "&:hover": {
                        color: "#408dfb",
                      },
                    }}
                  >
                    Upload File
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>
                  {formik.values.documents &&
                    formik.values.documents !== null && (
                      <>
                        <IconButton
                          onClick={handleOpenFileList}
                          sx={{
                            ml: 1,
                            backgroundColor: "#408dfb",
                            color: "#fff",
                            borderRadius: "20%",
                            fontSize: "12px",
                            "&:hover": {
                              backgroundColor: "#408dfb", // keep same on hover
                              color: "#fff", // prevent text/icon from turning white or changing
                            },
                          }}
                        >
                          <AttachFileOutlinedIcon sx={{ fontSize: "15px" }} />1
                        </IconButton>

                        {/* Popover to display file details */}
                        <Popover
                          id={idPop}
                          open={openFileList}
                          anchorEl={anchorEl}
                          onClose={handleCloseFileList}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                        >
                          <List
                            dense
                            sx={{
                              width: "100%",
                              bgcolor: "background.paper",
                              marginTop: "8px",
                              borderRadius: "8px",
                            }}
                          >
                            {files.length > 0 && (
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                }}
                              >
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Selected File:
                                </Typography>

                                {/* Display file preview if it's an image */}
                                {previewFile && (
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
                                )}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                    // padding: "8px", // Add padding for better spacing
                                    // borderRadius: "8px",
                                  }}
                                >
                                  <Typography variant="body2">
                                    {files[0].name}
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
                          </List>
                        </Popover>
                      </>
                    )}
                </Box>
                {/* File Upload Instructions */}
                <Typography sx={{ fontSize: "11px", color: "#777" }}>
                  You can upload a maximum of 1 file, 5MB each
                </Typography>
              </Box>
            </Grid>

            {/* Show More Details (Conditional Fields) */}
            {showMoreDetails && (
              <>
                {/* Website URL */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Website URL
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
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
                    style={{ width: 350 }}
                    placeholder="ex: www.zyker.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanguageIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* Department */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Department
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="department"
                    fullWidth
                    variant="outlined"
                    value={formik.values.department || ""}
                    onChange={formik.handleChange}
                    size="small"
                    style={{ width: 350 }}
                    sx={commonStyles}
                  />
                </Grid>

                {/* Designation */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Designation
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="designation"
                    fullWidth
                    variant="outlined"
                    value={formik.values.designation || ""}
                    onChange={formik.handleChange}
                    size="small"
                    style={{ width: 350 }}
                    sx={commonStyles}
                  />
                </Grid>

                {/* Twitter */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Twitter
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="twitter"
                    fullWidth
                    variant="outlined"
                    value={formik.values.twitter || ""}
                    onChange={formik.handleChange}
                    size="small"
                    style={{ width: 350 }}
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
                    sx={{
                      display: "block",
                      color: "#777",
                      fontSize: "11px",
                    }}
                  >
                    http://www.twitter.com/
                  </Typography>
                </Grid>

                {/* Skype Name/Number */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Skype Name/Number
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="skype"
                    fullWidth
                    variant="outlined"
                    value={formik.values.skype || ""}
                    onChange={formik.handleChange}
                    size="small"
                    style={{ width: 350 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: "#00AFF0", fontWeight: "bold" }}>
                            S
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Facebook */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Facebook
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} ml={20} mt={-5}>
                  <TextField
                    name="facebook"
                    fullWidth
                    variant="outlined"
                    value={formik.values.facebook || ""}
                    onChange={formik.handleChange}
                    size="small"
                    style={{ width: 350 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FacebookIcon color="primary" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography
                    sx={{
                      display: "block",
                      color: "#777",

                      fontSize: "11px",
                    }}
                  >
                    http://www.facebook.com/
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="text"
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              sx={{
                color: "#0077FF",
                textTransform: "none",
                fontWeight: "normal",
                fontSize: "13px",
              }}
            >
              {showMoreDetails ? "Remove more details" : "Add more details"}
            </Button>
          </Box>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OtherDetailsCustomer;
