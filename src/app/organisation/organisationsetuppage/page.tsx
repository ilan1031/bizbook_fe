"use client";
import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Divider,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useRouter } from "next/navigation";
import * as Yup from "yup"; // Import Yup
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";

const OrganisationSetup = (_props?: any) => {
  const { showMessage } = useSnackbar();
  const [formData, setFormData] = useState<any>({
    organizationName: "",
    industry_name: "",
    first_street: "",
    second_street: "",
    country: "India",
    country_code: "",
    city: "",
    gst_in: "",
    state: "",
    currency: "INR",
    timeZone: "IST",
  });
  const [errors, setErrors] = useState<any>({});
  const [isGstRegistered, setIsGstRegistered] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const submittingRef = useRef<boolean>(false);
  const [showAddressFields, setShowAddressFields] = useState<boolean>(false);
  const router = useRouter();

  // All 28 states and 8 union territories of India.
  const states = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi (NCT)",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Define Yup Validation Schema
  const validationSchema = Yup.object().shape({
    organizationName: Yup.string()
      .required("Organization Name is required.")
      .trim(),
    state: Yup.string().required("State/Union Territory is required.").trim(),
    currency: Yup.string().required("Currency is required.").trim(),
    timeZone: Yup.string().required("Time Zone is required.").trim(),
    country_code: Yup.string()
      .trim()
      .test("pin", "PIN code must be 6 digits.", (v) => !v || /^\d{6}$/.test(v)),
  });
  // GSTIN: state code, PAN, entity number, "Z", check character.
  const GSTIN_RE = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleOpen = async (e) => {
    e.preventDefault();
    // One organisation per click, even on a double click.
    if (submittingRef.current) return;
    const newErrors: any = {};
    try {
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (validationErrors) {
      (validationErrors.inner || []).forEach((error) => {
        if (!newErrors[error.path]) newErrors[error.path] = error.message;
      });
    }
    const gstIn = isGstRegistered ? String(formData.gst_in || "").trim().toUpperCase() : "";
    if (isGstRegistered && !GSTIN_RE.test(gstIn)) {
      newErrors.gst_in = gstIn ? "Enter a valid 15-character GSTIN, e.g. 33ABCDE1234F1Z5." : "GSTIN is required when the business is registered for GST.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const response = await apiService({
        method: "POST",
        url: "/api/v1/org/create-organisation",
        data: { ...formData, gst_in: gstIn },
      });
      if (response.statusCode == 200) {
        showMessage(response.data.message, "success");
        localStorage.setItem(
          "organization_id",
          response.data.data.organization_id
        );
        router.push("/home");
        return; // keep the button disabled while leaving the page
      }
    } catch (error) {
      // e.g. the organisation limit set by the administrator (429)
      showMessage(error?.message || "Couldn't create the organisation. Please try again.", "error");
    }
    submittingRef.current = false;
    setSubmitting(false);
  };

  return (
    <Box sx={{ position: "relative" as const, bgcolor: "#f3f8fe", py: 4 }}>
      <Container
        sx={{
          py: 4,
          boxShadow: 3,
          borderRadius: 2,
          width: "45%",
          bgcolor: "white",
        }}
      >
        {/* Header with logo */}
        <Box sx={{ display: "flex" as const, mb: 3 }}>
          <Box
            component="img"
            src="/books-logo.jpg"
            alt="Bizbooks Logo"
            style={{ height: 30 }}
          />
          <Typography
            variant="caption"
            sx={{ ml: 1, alignSelf: "flex-end" as const, color: "#546e7a" }}
          >
            Bizbooks is your end-to-end online accounting software.
          </Typography>
        </Box>
        <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />
        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{ p: 4, borderRadius: 1, backgroundColor: "white", mb: 4 }}
        >
          <Box sx={{ textAlign: "center" as const, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Set up your organization profile
            </Typography>
            <Box
              sx={{
                width: "50px",
                height: "4px",
                backgroundColor: "#2196f3",
                borderRadius: "2px",
                margin: "10px auto 0",
              }}
            />
          </Box>
          {/* Organizational Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#757575",
                fontSize: "0.75rem",
                mb: 2,
                letterSpacing: "0.5px" as const,
              }}
            >
              ORGANIZATIONAL DETAILS
            </Typography>
            <Grid container spacing={3}>
              {/* Organization Name */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                    }}
                  >
                    Organization Name
                  </Typography>
                  <Typography variant="caption" sx={{ color: "red", ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Iris Institution"
                  size="small"
                  variant="outlined"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  error={!!(errors.organizationName as any)}
                  helperText={
                    (errors.organizationName as any) && (
                      <Typography variant="caption" color="error">
                        {(errors.organizationName as any)}
                      </Typography>
                    )
                  }
                  sx={{
                    fontSize: "14px",
                    "& .MuiOutlinedInput-root": {
                      animation: (errors.organizationName as any)
                        ? "blink 1s infinite"
                        : "none",
                      fontSize: "14px",
                    },
                  }}
                />
              </Grid>
              {/* Industry */}
              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  sx={{ mb: 0.5, display: "block" as const }}
                >
                  Industry
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    displayEmpty
                    variant="outlined"
                    name="industry_name"
                    value={formData.industry_name}
                    onChange={handleChange}
                    renderValue={(selected: any) => {
                      if (!selected) {
                        return (
                          <span style={{ fontSize: "14px", color: "#aaa" }}>
                            Select industry
                          </span>
                        );
                      }
                      return selected;
                    }}
                    sx={{ fontSize: "14px" }}
                  >
                    <MenuItem value="" sx={{ fontSize: "14px" }}>
                      Select industry
                    </MenuItem>
                    <MenuItem value="IT" sx={{ fontSize: "14px" }}>
                      Information Technology
                    </MenuItem>
                    <MenuItem value="Manufacturing" sx={{ fontSize: "14px" }}>
                      Manufacturing
                    </MenuItem>
                    <MenuItem value="Retail" sx={{ fontSize: "14px" }}>
                      Retail
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Organization Location */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  sx={{ mb: 0.5, display: "block" as const }}
                >
                  Organization Location*
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ fontSize: "14px" }}
                  >
                    <MenuItem value="India" sx={{ fontSize: "14px" }}>
                      India
                    </MenuItem>
                    <MenuItem value="US" sx={{ fontSize: "14px" }}>
                      United States
                    </MenuItem>
                    <MenuItem value="UK" sx={{ fontSize: "14px" }}>
                      United Kingdom
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* State/Union Territory */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                    }}
                  >
                    State/Union Territory
                  </Typography>
                  <Typography variant="caption" sx={{ color: "red", ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!(errors.state as any)}
                    sx={{ fontSize: "14px" }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: "14px" }}>
                      Select State
                    </MenuItem>
                    {states.map((s) => (
                      <MenuItem key={s} value={s} sx={{ fontSize: "14px" }}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                  {(errors.state as any) && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ fontSize: "12px", pl: 2 }}
                    >
                      {(errors.state as any)}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              {/* Checkbox to Show Address Fields */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={showAddressFields}
                      onChange={() => setShowAddressFields(!showAddressFields)}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      Add Organization Address
                    </Typography>
                  }
                />
              </Grid>
              {/* Address Fields - Show only when checkbox is checked */}
              {showAddressFields && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="caption">Street 1</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter Street 1"
                      size="small"
                      variant="outlined"
                      name="first_street"
                      value={formData.first_street}
                      onChange={handleChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">Street 2</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter Street 2"
                      size="small"
                      variant="outlined"
                      name="second_street"
                      value={formData.second_street}
                      onChange={handleChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption">City</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter City"
                      size="small"
                      variant="outlined"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption">ZIP/Postal Code</Typography>
                    <TextField
                      fullWidth
                      placeholder="ZIP/Postal Code"
                      size="small"
                      variant="outlined"
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
          {/* Regional Settings Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#757575",
                fontSize: "0.75rem",
                mb: 2,
                letterSpacing: "0.5px" as const,
              }}
            >
              REGIONAL SETTINGS
            </Typography>
            <Grid container spacing={3}>
              {/* Currency */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                    }}
                  >
                    Currency
                  </Typography>
                  <Typography variant="caption" sx={{ color: "red", ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!(errors.currency as any)}
                    sx={{ fontSize: "14px" }}
                  >
                    <MenuItem value="INR" sx={{ fontSize: "14px" }}>
                      INR - Indian Rupee
                    </MenuItem>
                    <MenuItem value="USD" sx={{ fontSize: "14px" }}>
                      USD - US Dollar
                    </MenuItem>
                    <MenuItem value="EUR" sx={{ fontSize: "14px" }}>
                      EUR - Euro
                    </MenuItem>
                  </Select>
                  {(errors.currency as any) && (
                    <Typography variant="caption" color="error">
                      {(errors.currency as any)}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              {/* Time Zone */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                    }}
                  >
                    Time Zone
                  </Typography>
                  <Typography variant="caption" sx={{ color: "red", ml: 0.5 }}>
                    *
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    name="timeZone"
                    value={formData.timeZone}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!(errors.timeZone as any)}
                    sx={{ fontSize: "14px" }}
                  >
                    <MenuItem value="IST" sx={{ fontSize: "14px" }}>
                      (GMT +5:30) India Standard Time (Asia/Kolkata)
                    </MenuItem>
                    <MenuItem value="PST" sx={{ fontSize: "14px" }}>
                      (GMT -8:00) Pacific Standard Time
                    </MenuItem>
                    <MenuItem value="EST" sx={{ fontSize: "14px" }}>
                      (GMT -5:00) Eastern Standard Time
                    </MenuItem>
                  </Select>
                  {(errors.timeZone as any) && (
                    <Typography variant="caption" color="error">
                      {(errors.timeZone as any)}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          {/* GST Registration Section */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex" as const,
                alignItems: "center" as const,
                gap: 2,
              }}
            >
              <Typography variant="body2">
                Is this business registered for GST?
              </Typography>
              <Switch
                checked={isGstRegistered}
                onChange={() => setIsGstRegistered(!isGstRegistered)}
                color="primary"
                size="small"
              />
            </Box>
            {/* Show input field when switch is ON */}
            {isGstRegistered && (
              <TextField
                fullWidth
                size="small"
                margin="normal"
                name="gst_in"
                placeholder="Enter your GSTIN"
                variant="outlined"
                value={formData.gst_in}
                onChange={handleChange}
                error={Boolean((errors.gst_in as any))}
                helperText={(errors.gst_in as any) || ""}
                inputProps={{ maxLength: 15 }}
                // required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "14px",
                  },
                }}
              />
            )}
          </Box>
          {/* Notes Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Note:
            </Typography>
            <List dense disablePadding>
              <ListItem sx={{ alignItems: "flex-start" as const, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <FiberManualRecordIcon
                    sx={{ fontSize: 8, color: "#616161", mt: 1 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      You can update some of these preferences from Settings
                      anytime.
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem sx={{ alignItems: "flex-start" as const, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <FiberManualRecordIcon
                    sx={{ fontSize: 8, color: "#616161", mt: 1 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      The language you select on this page will be the default
                      language for the following features even if you change the
                      language later:
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <Grid container spacing={2} sx={{ pl: 3, mt: 1 }}>
              <Grid item xs={6}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#ff9800",
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Chart of Accounts
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#ff9800",
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Email Templates
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#ff9800",
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Template Customizations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#ff9800",
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Payment Modes
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* Bottom Actions */}
          <Box
            sx={{
              display: "flex" as const,
              justifyContent: "space-between" as const,
              alignItems: "center" as const,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              disabled={submitting}
              sx={{
                textTransform: "none" as const,
                fontWeight: 500,
                boxShadow: "none",
                px: 3,
              }}
            >
              Get Started
            </Button>
            <Typography
              variant="body2"
              sx={{ color: "#1976d2", cursor: "pointer" as const }}
            >
              Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrganisationSetup;
