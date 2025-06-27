"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Divider,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Tooltip,
  Toolbar,
  FormControlLabel,
  FormControl,
  InputLabel,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MobileIcon from "@mui/icons-material/PhoneIphoneOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddressFormClient from "../address/Address";
import OtherDetailsCustomer from "../otherdetailscustomer/OtherDetailsCustomer";
import ContactPersonTable from "../contactperson/ContactPersonTable";
import { useRouter } from "next/navigation";
import apiService from "../../../../src/services/axiosService";
import { useSnackbar } from "../../../../src/components/SnackbarProvider";

// TabPanel component for handling tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const CustomerForm = () => {
  const [tabValue, setTabValue] = useState(0);
  const [displayNameOptions, setDisplayNameOptions] = useState([]);
  const [open, setOpen] = useState(true); // State to manage popup visibility
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize default values for the contact persons array
  const organization_id = localStorage.getItem("organization_id");

  // Update display name options dynamically
  const updateDisplayNameOptions = () => {
    const { first_name, last_name, contact_salutation, company_name } =
      formik.values;
    let options = [];
    if (contact_salutation && first_name && last_name) {
      options.push(`${contact_salutation} ${first_name} ${last_name}`);
    }
    if (first_name && last_name) {
      options.push(`${first_name} ${last_name}`);
    }
    if (first_name) {
      options.push(first_name);
    }
    if (last_name) {
      options.push(last_name);
    }
    if (company_name) {
      options.push(company_name);
    }
    setDisplayNameOptions([...new Set(options)]); // Remove duplicates
  };

  // Form validation schema
  const validationSchema = Yup.object({
    contact_name: Yup.string().required("Display name is required"),
    email: Yup.string().email("Invalid email address"),
    phone: Yup.string().matches(
      /^\d{10}$/,
      "Phone number must be exactly 10 digits"
    ),
    mobile: Yup.string().matches(
      /^\d{10}$/,
      "Mobile number must be exactly 10 digits"
    ),
    gst_treatment: Yup.string().required("GST Treatment is required"),
  });

  const { showMessage } = useSnackbar();

  const defaultContactPerson = {
    salutation: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    phone_formatted: "",
    mobile: "",
    mobile_formatted: "",
    mobile_country_code: "",
    mobile_code_formatted: "",
    department: "",
    designation: "",
    skype: "",
    fax: "",
    zcrm_contact_id: "",
    is_from_crm: false,
    is_portal_mfa_enabled: false,
    is_added_in_portal: false,
    can_invite: false,
    is_primary_contact: false,
    is_portal_invitation_accepted: false,
    is_sms_enabled_for_cp: false,
    photo_url: "",
    communication_preference: {
      is_email_enabled: false,
    },
  };

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      // Primary details
      admin_id: "",
      contact_name: "",
      gst_treatment: "",
      profile_image: null,
      company_name: "",
      is_bulk_export_exist: false,
      contact_tax_information: "",
      first_name: "",
      last_name: "",
      designation: "",
      department: "",
      website: "",
      is_bcy_only_contact: false,
      is_credit_limit_migration_completed: false,
      language_code: "",
      language_code_formatted: "",
      contact_salutation: "",
      email: "",
      phone: "",
      mobile: "",
      invited_by: "",
      portal_status: "",
      portal_status_formatted: "",
      is_client_review_asked: false,
      has_transaction: false,
      contact_type: "Customer", // Setting default as vendor
      customer_sub_type: "Business",
      customer_sub_type_formatted: "",
      owner_id: "",
      owner_name: "",
      source: "",
      source_formatted: "",
      twitter: "",
      facebook: "",
      is_crm_customer: false,
      is_linked_with_zohocrm: false,
      is_gapps_customer: false,
      primary_contact_id: "",
      zcrm_account_id: "",
      zcrm_contact_id: "",
      crm_owner_id: "",
      payment_terms: 0, // Changed to number type
      payment_terms_label: "",
      payment_terms_id: "",
      credit_limit_exceeded_amount: 0,
      credit_limit_exceeded_amount_formatted: "",
      currency_id: "",
      currency_code: "INR- Indian Rupee",
      currency_symbol: "",
      price_precision: 0,
      exchange_rate: 1.0,
      can_show_customer_ob: true,
      opening_balance_amount: 0,
      opening_balance_amount_formatted: "",
      outstanding_receivable_amount: 0,
      outstanding_payable_amount: 0,
      unused_credits_receivable_amount: 0,
      unused_retainer_payments: 0,
      status: "active",
      status_formatted: "Active",
      payment_reminder_enabled: false,
      is_sms_enabled: false,
      is_portal_enabled: false,
      is_consent_agreed: false,
      consent_date: "",
      is_client_review_settings_enabled: false,
      is_taxable: true,
      tax_exemption_code: "",
      tax_id: "",
      tds_tax_id: "",
      tax_name: "",
      tax_name_formatted: "",
      tax_percentage: "",
      country_code: "",
      country_code_formatted: "",
      place_of_contact: "",
      gst_no: "",
      pan_no: "",
      trader_name: "",
      legal_name: "",
      vat_reg_no: "",
      tax_treatment: "",
      contact_category: "",
      sales_channel: "",
      portal_receipt_count: 0,
      notes: "",
      created_time: "",
      created_by_name: "",
      deleted_at: null,
      billing_address: {},
      shipping_address: {},
      // Contact persons tab
      contact_persons: [defaultContactPerson],
      // Bank details tab
      bank_details: [
        {
          bank_name: "",
          account_number: "",
          is_primary_account: true,
          account_name: "",
          ifsc_code: "",
          branch: "",
          micr_code: "",
          swift_code: "",
          iban: "",
        },
      ],
      // Remarks tab
      notes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        // Format the current date for created_time
        const currentDate = new Date().toISOString();
        // Convert payment_terms value to a number based on selection
        let paymentTermsValue = 0;
        switch (values.payment_terms) {
          case "Due On Receipt":
            paymentTermsValue = 0;
            break;
          case "Net 15":
            paymentTermsValue = 15;
            break;
          case "Net 30":
            paymentTermsValue = 30;
            break;
          case "Net 45":
            paymentTermsValue = 45;
            break;
          case "Net 60":
            paymentTermsValue = 60;
            break;
          default:
            paymentTermsValue = 0;
        }
        const formattedData = {
          ...values,
          portal_status: formik.values.is_portal_enabled
            ? "enabled"
            : "disabled",
          portal_status_formatted: formik.values.is_portal_enabled
            ? "Enabled"
            : "Disabled",
          can_invite: formik.values.is_portal_enabled ? true : false,
          contact_type: "Customer",
          created_time: currentDate,
          organization_id: organization_id,
          payment_terms: paymentTermsValue,
          contact_persons: Array.isArray(values.contact_persons)
            ? values.contact_persons
            : [],
          billing_address: Object.keys(values.billing_address).length
            ? values.billing_address
            : {},
          shipping_address: Object.keys(values.shipping_address).length
            ? values.shipping_address
            : {},
        };
        // Make API call
        const response = await apiService({
          method: "POST",
          url: "/api/v1/contact",
          data: JSON.stringify(formattedData),
        });
        showMessage("Customer created successfully", "success");
        formik.resetForm();
        const data = response.data.data;
        router.push(`/sales/customer/${data.contact_id}`);
      } catch (error) {
        showMessage("Something went wrong", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get customer data in edit mode
  useEffect(() => {
    updateDisplayNameOptions();
  }, [
    formik.values.first_name,
    formik.values.last_name,
    formik.values.contact_salutation,
    formik.values.company_name,
  ]);

  useEffect(() => {
    if (
      formik.values.first_name ||
      formik.values.last_name ||
      formik.values.email ||
      formik.values.phone
    ) {
      // Make a copy of the contact_persons array to avoid mutation issues
      const updatedContactPersons = [
        ...(Array.isArray(formik.values.contact_persons)
          ? formik.values.contact_persons
          : [defaultContactPerson]),
      ];
      // If there's no first contact person, create one
      if (updatedContactPersons.length === 0) {
        updatedContactPersons.push({ ...defaultContactPerson });
      }
      // Update the first contact person with primary contact info
      updatedContactPersons[0] = {
        ...updatedContactPersons[0],
        salutation:
          formik.values.contact_salutation ||
          updatedContactPersons[0].salutation,
        first_name:
          formik.values.first_name || updatedContactPersons[0].first_name,
        last_name:
          formik.values.last_name || updatedContactPersons[0].last_name,
        email: formik.values.email || updatedContactPersons[0].email,
        phone: formik.values.phone || updatedContactPersons[0].phone,
        mobile: formik.values.mobile || updatedContactPersons[0].mobile,
        is_primary_contact: true,
        can_invite: formik.values.is_portal_enabled ? true : false,
      };
      // Update the contact_persons array
      formik.setFieldValue("contact_persons", updatedContactPersons);
    }
  }, [
    formik.values.contact_salutation,
    formik.values.first_name,
    formik.values.last_name,
    formik.values.email,
    formik.values.phone,
    formik.values.mobile,
    formik.values.is_portal_enabled,
  ]);

  const handleCancel = () => {
    setOpen(false); // Close the popup when Cancel is clicked
  };

  const handleClose = () => {
    setOpen(false); // Close the popup when Close icon is clicked
  };

  return (
    <>
      {/* Conditional Rendering of the Entire Popup */}
      {open && (
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {/* Toolbar with Close Icon */}
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
            }}
          >
            <Box>
              <Typography variant="h6" component="h1">
                New Customer
              </Typography>
            </Box>
            <Box>
              <IconButton
                sx={{
                  color: "red",
                  fontSize: "8px",
                  fontWeight: 800,
                }}
                onClick={handleClose} // Call handleClose when clicked
                disabled={isSubmitting}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Toolbar>
          <Divider />
          <form onSubmit={formik.handleSubmit}>
            <Container maxWidth="md" sx={{ mt: 2, px: 2, ml: 1 }}>
              <Grid container spacing={2}>
                {/* Customer Type */}
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    {/* Label */}
                    <Grid item xs={2.1}>
                      <Typography variant="subtitle2">Customer Type</Typography>
                    </Grid>
                    {/* Combined Input + Search */}
                    <Grid
                      item
                      sx={{
                        display: "flex",
                      }}
                    >
                      <RadioGroup
                        row
                        name="customer_sub_type"
                        value={formik.values.customer_sub_type}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel
                          value="Business"
                          control={
                            <Radio
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "14px" }}>
                              Business
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value="Individual"
                          control={
                            <Radio
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: "14px" }}>
                              Individual
                            </Typography>
                          }
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Primary Contact Section */}
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2.1}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ fontSize: "13px" }}>
                          Primary Contact
                        </Typography>
                        <Tooltip title="Primary contact information">
                          <InfoOutlinedIcon
                            fontSize="small"
                            sx={{
                              ml: 0.5,
                              color: "text.secondary",
                              fontSize: "16px",
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={9}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormControl size="small" sx={{ width: "110px" }}>
                          <InputLabel
                            id="salutation-label"
                            sx={{ fontSize: "13px" }}
                          >
                            Salutation
                          </InputLabel>
                          <Select
                            labelId="salutation-label"
                            id="contact_salutation"
                            name="contact_salutation"
                            value={formik.values.contact_salutation}
                            onChange={(e) => {
                              formik.handleChange(e);
                            }}
                            error={
                              formik.touched.contact_salutation &&
                              Boolean(formik.errors.contact_salutation)
                            }
                            label="Salutation"
                            sx={{ fontSize: "13px" }}
                          >
                            <MenuItem value="Mr.">Mr.</MenuItem>
                            <MenuItem value="Mrs.">Mrs.</MenuItem>
                            <MenuItem value="Ms.">Ms.</MenuItem>
                            <MenuItem value="Dr.">Dr.</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          size="small"
                          id="first_name"
                          name="first_name"
                          label="First Name"
                          value={formik.values.first_name}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          error={
                            formik.touched.first_name &&
                            Boolean(formik.errors.first_name)
                          }
                          helperText={
                            formik.touched.first_name &&
                            formik.errors.first_name
                          }
                          InputLabelProps={{ sx: { fontSize: "13px" } }}
                          InputProps={{ sx: { fontSize: "13px" } }}
                        />
                        <TextField
                          size="small"
                          id="last_name"
                          name="last_name"
                          label="Last Name"
                          value={formik.values.last_name}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          error={
                            formik.touched.last_name &&
                            Boolean(formik.errors.last_name)
                          }
                          helperText={
                            formik.touched.last_name && formik.errors.last_name
                          }
                          InputLabelProps={{ sx: { fontSize: "13px" } }}
                          InputProps={{ sx: { fontSize: "13px" } }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Company Name */}
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2.1}>
                      <Typography variant="body1" sx={{ fontSize: "13px" }}>
                        Company Name
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        id="company_name"
                        name="company_name"
                        label="Company Name"
                        value={formik.values.company_name}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.company_name &&
                          Boolean(formik.errors.company_name)
                        }
                        helperText={
                          formik.touched.company_name &&
                          formik.errors.company_name
                        }
                        InputLabelProps={{ sx: { fontSize: "13px" } }}
                        InputProps={{ sx: { fontSize: "13px" } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Display Name */}
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2.1}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "13px", color: "#d6141d" }}
                        >
                          Display Name*
                        </Typography>
                        <Tooltip title="Name displayed on documents">
                          <InfoOutlinedIcon
                            fontSize="small"
                            sx={{
                              ml: 0.5,
                              color: "text.secondary",
                              fontSize: "16px",
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={5}>
                      <FormControl fullWidth size="small">
                        <Select
                          id="contact_name"
                          name="contact_name"
                          value={formik.values.contact_name}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.contact_name &&
                            Boolean(formik.errors.contact_name)
                          }
                          displayEmpty
                          sx={{ fontSize: "13px" }}
                          renderValue={(selected) => {
                            if (!selected) {
                              return (
                                <span style={{ color: "#888" }}>
                                  Select or type to add
                                </span>
                              );
                            }
                            return selected;
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                "& .MuiMenuItem-root": {
                                  fontSize: "13px", // Control font size for all MenuItems
                                },
                              },
                            },
                          }}
                        >
                          {/* Default Option */}
                          <MenuItem value="" disabled>
                            Select or type to add
                          </MenuItem>
                          {/* Dynamically Added Options */}
                          {displayNameOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Email Address */}
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2.1}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ fontSize: "13px" }}>
                          Email Address
                        </Typography>
                        <Tooltip title="Email for communication">
                          <InfoOutlinedIcon
                            fontSize="small"
                            sx={{
                              ml: 0.5,
                              color: "text.secondary",
                              fontSize: "16px",
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon
                                fontSize="small"
                                sx={{ fontSize: "18px" }}
                              />
                            </InputAdornment>
                          ),
                          sx: { fontSize: "13px" },
                        }}
                        InputLabelProps={{ sx: { fontSize: "13px" } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* Phone Numbers */}
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2.1}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ fontSize: "13px" }}>
                          Phone
                        </Typography>
                        <Tooltip title="Contact phone numbers">
                          <InfoOutlinedIcon
                            fontSize="small"
                            sx={{
                              ml: 0.5,
                              color: "text.secondary",
                              fontSize: "16px",
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={5}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          size="small"
                          id="phone"
                          name="phone"
                          placeholder="Work Phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon
                                  fontSize="small"
                                  sx={{ fontSize: "18px" }}
                                />
                              </InputAdornment>
                            ),
                            sx: { fontSize: "13px" },
                          }}
                          sx={{ flex: 1 }}
                          error={
                            formik.touched.phone && Boolean(formik.errors.phone)
                          }
                          helperText={
                            formik.touched.phone && formik.errors.phone
                          }
                        />
                        <TextField
                          size="small"
                          id="mobile"
                          name="mobile"
                          placeholder="Mobile"
                          value={formik.values.mobile}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.mobile &&
                            Boolean(formik.errors.mobile)
                          }
                          helperText={
                            formik.touched.mobile && formik.errors.mobile
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MobileIcon
                                  fontSize="small"
                                  sx={{ fontSize: "18px" }}
                                />
                              </InputAdornment>
                            ),
                            sx: { fontSize: "13px" },
                          }}
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* Tabs Section */}
              <Box sx={{ width: "100%", mt: 5 }}>
                <Box
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    mb: 3,
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="customer details tabs"
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: "#1976d2",
                        height: "3px",
                      },
                    }}
                    sx={{
                      "& .MuiTab-root": {
                        fontSize: "13px",
                        fontWeight: "normal",
                        textTransform: "none",
                        minWidth: "auto",
                        py: 1,
                        px: 2,
                      },
                    }}
                  >
                    <Tab
                      label="Other Details"
                      sx={{
                        fontWeight: tabValue === 0 ? "bold" : "normal",
                        borderBottom:
                          tabValue === 0 ? "3px solid #1976d2" : "none",
                      }}
                    />
                    <Tab
                      label="Address"
                      sx={{
                        fontWeight: tabValue === 1 ? "bold" : "normal",
                      }}
                    />
                    <Tab
                      label="Contact Persons"
                      sx={{
                        fontWeight: tabValue === 2 ? "bold" : "normal",
                      }}
                    />
                    <Tab
                      label="Custom Fields"
                      sx={{
                        fontWeight: tabValue === 3 ? "bold" : "normal",
                      }}
                    />
                    <Tab
                      label="Reporting Tags"
                      sx={{
                        fontWeight: tabValue === 4 ? "bold" : "normal",
                      }}
                    />
                    <Tab
                      label="Remarks"
                      sx={{
                        fontWeight: tabValue === 5 ? "bold" : "normal",
                      }}
                    />
                  </Tabs>
                </Box>
                {/* Other Details Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Grid sx={{ margin: -4 }}>
                    <OtherDetailsCustomer formik={formik} />
                  </Grid>
                </TabPanel>
                {/* Address Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Grid sx={{ margin: -3 }}>
                    <AddressFormClient formik={formik} />
                  </Grid>
                </TabPanel>
                {/* Contact Persons Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Grid sx={{ margin: -3 }}>
                    <ContactPersonTable formik={formik} />
                  </Grid>
                </TabPanel>
                {/* Custom Fields Tab */}
                <TabPanel value={tabValue} index={3}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      textAlign: "center",
                      margin: "30px",
                    }}
                  >
                    Start adding custom fields for your Customers and customers
                    by going to Settings Preferences Customers and customers.
                    You can also refine the address format of your Customers and
                    customers from there.
                  </Typography>
                </TabPanel>
                {/* Reporting Tags Tab */}
                <TabPanel value={tabValue} index={4}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      textAlign: "center",
                      margin: "30px",
                    }}
                  >
                    You`ve not created any Reporting Tags. Start creating
                    reporting tags by going to More Settings Reporting Tags
                  </Typography>
                </TabPanel>
                {/* Remarks Tab */}
                <TabPanel value={tabValue} index={5}>
                  <Grid>
                    <Typography sx={{ display: "flex", fontSize: "13px" }}>
                      <Typography
                        sx={{
                          fontWeight: 550,
                          fontSize: "13px",
                          mr: 1,
                        }}
                      >
                        Remarks
                      </Typography>
                      (For Internal Use)
                    </Typography>
                    {/* Input Box */}
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        sx={{ width: "700px" }}
                        variant="outlined"
                        size="small"
                        multiline
                        rows={3}
                        name="notes"
                        value={formik.values.notes}
                        onChange={formik.handleChange}
                      />
                    </Box>
                  </Grid>
                </TabPanel>
              </Box>
            </Container>
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                width: "100%",
                backgroundColor: "#fff",
                p: 2,
                display: "flex",
                gap: 2,
                boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ textTransform: "none" }}
                className="button-submitadd"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{ textTransform: "none" }}
                onClick={handleClose}
                className="bulk-update-btn"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
};

export default CustomerForm;
