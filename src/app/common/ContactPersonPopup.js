"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import apiService from "../../../src/services/axiosService";
import { useSnackbar } from "../../../src/components/SnackbarProvider";

const ContactPersonPopup = ({
  open,
  onClose,
  initialData,
  contact_id,
  primary,
}) => {
  // State for notification
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const {showMessage} = useSnackbar();

  // Get organization_id from props or localStorage
  const organization_id = localStorage.getItem("organization_id");

  // Define Yup validation schema with field names matching API requirements
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string()
      .test('is-10-digits', 'Work Phone must be exactly 10 digits', value => {
        if (!value) return true; // optional field
        return /^\d{10}$/.test(value);
      }),
    mobile: Yup.string()
      .test('is-10-digits', 'Mobile number must be exactly 10 digits', value => {
        if (!value) return true; // optional field
        return /^\d{10}$/.test(value);
      }),
  });
  // Map the initialData to match API field names if provided
  const mapInitialData = () => {
    if (!initialData) {
      return {
        salutation: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        mobile: "",
        skype: "",
        designation: "",
        department: "",
        portal_access: false,
        is_added_in_portal:false,
        can_invite:false,
        organization_id: organization_id,
        is_primary_contact: primary,
      };
    }

    // If initialData is provided but uses different field names, map them
    return {
      contact_person_id: initialData.contact_person_id || "",
      salutation: initialData.salutation || initialData.salutation || "",
      first_name: initialData.first_name || initialData.firstName || "",
      last_name: initialData.last_name || initialData.lastName || "",
      email: initialData.email || "",
      phone: initialData.phone || initialData.workPhone || "",
      mobile: initialData.mobile || "",
      skype: initialData.skype || "",
      designation: initialData.designation || "",
      department: initialData.department || "",
      portal_access:initialData.portal_access,
      is_added_in_portal:initialData.is_added_in_portal,
      can_invite:initialData.can_invite,
      organization_id: organization_id,
      is_primary_contact: primary,
    };
  };

  useEffect(()=> {
    const value = mapInitialData();
  },[])

  // Initialize Formik with mapped initialData
  const formik = useFormik({
    initialValues: mapInitialData(),
    validationSchema,
    validate: (values) => {
      // Fields to check (excluding salutation & portal_access)
      const requiredFields = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "mobile",
        "skype",
        "designation",
        "department",
      ];

      // Check if at least one required field has a value
      const hasRequiredField = requiredFields.some(
        (field) => values[field].trim() !== ""
      );

      if (!hasRequiredField) {
        setOpenAlert(true);
        return {
          general:
            <span>  No contact information found. Please fill the necessary fields and try again.</span>,
        };
      }
    },
    onSubmit: async (values) => {
      try {
        const res = await apiService({
          method: initialData ? "PUT":"POST",
          url: initialData?  `/api/v1/contact-person/${initialData?.contact_person_id}` : "/api/v1/contact-person",
          params: initialData ? {} : {
            organization_id: organization_id,
            contact_id: contact_id,
          },
          data: JSON.stringify(values),
        });
        const data = res.data.data;
        showMessage("Contact person's information has been saved","success");

        setTimeout(() => {
          onClose(data);
        }, 1000);
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to save contact person"
        showMessage(errorMsg,"error");
      }
    },
  });


  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const salutations = [
    { value: "Mr.", label: "Mr." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Ms.", label: "Ms." },
    { value: "Miss", label: "Miss" },
    { value: "Dr.", label: "Dr." },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            width: "100%",
            // maxWidth: "700px",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
            background: "#f9f9fb",
          }}
        >
          <Typography fontSize={"16px"} fontWeight={500} variant="h6">
            {initialData ? "Edit Contact Person" : "Add Contact Person"}
          </Typography>
          <IconButton edge="end" onClick={()=>onClose(null)} aria-label="close">
            <CloseIcon className="close-icon" fill="#fe4242" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit} sx={{ fontSize: "13px" }}>
          <DialogContent sx={{ pt: 3 }}>
            {openAlert && formik.errors.general && (
              <Alert
                severity="error"
                icon={false}
                sx={{ fontSize: "13px", mb: 2 }}
                onClose={() => setOpenAlert(false)}
                slotProps={{
                  closeButton: { sx: { color: "#fe4242" } }, // Change close icon color
                }}
              >
                •  {formik.errors.general}
              </Alert>
            )}
            {/* Name Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Typography variant="body1" sx={{ fontSize: "13px", mt: 1 }}>
                  Name
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <TextField
                      select
                      fullWidth
                      name="salutation"
                      id="salutation"
                      value={formik.values.salutation}
                      onChange={formik.handleChange}
                      placeholder="Salutation"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ sx: { fontSize: "13px" } }}
                      InputProps={{ sx: { fontSize: "13px" } }}
                      error={
                        formik.touched.salutation &&
                        Boolean(formik.errors.salutation)
                      }
                      helperText={
                        formik.touched.salutation && formik.errors.salutation
                      }
                    >
                      {salutations.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name="first_name"
                      value={formik.values.first_name}
                      onChange={formik.handleChange}
                      placeholder="First Name"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ sx: { fontSize: "13px" } }}
                      InputProps={{ sx: { fontSize: "13px" } }}
                      error={
                        formik.touched.first_name &&
                        Boolean(formik.errors.first_name)
                      }
                      helperText={
                        formik.touched.first_name && formik.errors.first_name
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name="last_name"
                      value={formik.values.last_name}
                      onChange={formik.handleChange}
                      placeholder="Last Name"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ sx: { fontSize: "13px" } }}
                      InputProps={{ sx: { fontSize: "13px" } }}
                      error={
                        formik.touched.last_name &&
                        Boolean(formik.errors.last_name)
                      }
                      helperText={
                        formik.touched.last_name && formik.errors.last_name
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Email Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Typography variant="body1" sx={{ fontSize: "13px", mt: 1 }}>
                  Email Address
                </Typography>
              </Grid>
              <Grid item xs={7.5}>
                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ sx: { fontSize: "13px" } }}
                  InputProps={{ sx: { fontSize: "13px" } }}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
            </Grid>

            {/* Phone Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Typography variant="body1" sx={{ fontSize: "13px", mt: 1 }}>
                  Phone
                </Typography>
              </Grid>
              <Grid item xs={7.5}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      placeholder="Work Phone"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ sx: { fontSize: "13px" } }}
                      InputProps={{ sx: { fontSize: "13px" } }}
                      error={
                        formik.touched.phone && Boolean(formik.errors.phone)
                      }
                      helperText={formik.touched.phone && formik.errors.phone}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      placeholder="Mobile"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ sx: { fontSize: "13px" } }}
                      InputProps={{ sx: { fontSize: "13px" } }}
                      error={
                        formik.touched.mobile && Boolean(formik.errors.mobile)
                      }
                      helperText={formik.touched.mobile && formik.errors.mobile}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Skype Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Typography variant="body1" sx={{ fontSize: "13px", mt: 1 }}>
                  Skype Name/Number
                </Typography>
              </Grid>
              <Grid item xs={7.5}>
                <TextField
                  fullWidth
                  name="skype"
                  value={formik.values.skype}
                  onChange={formik.handleChange}
                  placeholder="Skype Name/Number"
                  variant="outlined"
                  InputLabelProps={{ sx: { fontSize: "13px" } }}
                  size="small"
                  InputProps={{
                    sx: { fontSize: "13px" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="#00AFF0"
                        >
                          <path d="M12.069 18.874c-4.023 0-5.82-1.979-5.82-3.464 0-.765.561-1.296 1.333-1.296 1.723 0 1.273 2.477 4.487 2.477 1.641 0 2.55-.895 2.55-1.811 0-.551-.269-1.16-1.354-1.429l-3.576-.895c-2.88-.724-3.403-2.286-3.403-3.751 0-3.047 2.861-4.191 5.549-4.191 2.471 0 5.393 1.373 5.393 3.199 0 .784-.688 1.24-1.453 1.24-1.469 0-1.198-2.037-4.164-2.037-1.469 0-2.292.664-2.292 1.617s1.153 1.258 2.157 1.487l2.637.587c2.891.649 3.624 2.346 3.624 3.944 0 2.476-1.902 4.324-5.722 4.324m11.084-4.882l-.029.135-.044-.24c.015.045.044.074.059.12.12-.675.181-1.363.181-2.052 0-1.529-.301-3.012-.898-4.42-.569-1.348-1.395-2.562-2.427-3.596-1.049-1.033-2.247-1.856-3.595-2.426-1.318-.631-2.801-.93-4.328-.93-.72 0-1.444.07-2.143.204l.119.06-.239-.033.119-.025C8.91.274 7.829 0 6.731 0c-3.728 0-6.731 3.022-6.731 6.731 0 1.113.276 2.18.778 3.113l-.033-.135.029.136c-.015-.045-.044-.075-.059-.119-1.355 7.803 6.858 14.516 13.89 12.52.359.045.72.074 1.079.074 3.728 0 6.75-3.022 6.75-6.731 0-1.113-.285-2.18-.778-3.112" />
                        </svg>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Other Details Section */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Typography variant="body1" sx={{ fontSize: "13px", mt: 1 }}>
                  Other Details
                </Typography>
              </Grid>
              <Grid item xs={7.5}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="designation"
                      value={formik.values.designation}
                      onChange={formik.handleChange}
                      placeholder="Designation"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ sx: { fontSize: "13px" } }}
                      InputProps={{ sx: { fontSize: "13px" } }}
                      error={
                        formik.touched.designation &&
                        Boolean(formik.errors.designation)
                      }
                      helperText={
                        formik.touched.designation && formik.errors.designation
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="department"
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      placeholder="Department"
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ sx: { fontSize: "13px" } }}
                      InputProps={{ sx: { fontSize: "13px" } }}
                      error={
                        formik.touched.department &&
                        Boolean(formik.errors.department)
                      }
                      helperText={
                        formik.touched.department && formik.errors.department
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Portal Access Checkbox */}
            <Grid
              container
              spacing={2}
              sx={{ mb: 3, borderTop: "1px dashed #e0e0e0", my: 2 }}
            >
              <Grid item xs={12}>
                <Box>
                  <FormControlLabel
                    sx={{ display: "flex", fontSize: 13 }}
                    control={
                      <Checkbox
                        name="can_invite"
                        checked={formik.values.can_invite}
                        onChange={formik.handleChange}
                        color="primary"
                        icon={
                          <CheckBoxOutlineBlankIcon sx={{ fontSize: 18 }} />
                        } // Unchecked icon
                        checkedIcon={<CheckBoxIcon sx={{ fontSize: 18 }} />} // Checked icon
                      />
                    }
                    label={
                      <Box sx={{ fontSize: 13 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Enable portal access
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          This customer will be able to see all their
                          transactions with your organization by logging in to
                          the portal using their email address.{" "}
                          <Link href="#" underline="hover" color="primary">
                            Learn More
                          </Link>
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions
            sx={{
              p: 2,
              pt: 3,
              justifyContent: "flex-start",
              gap: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              className="button-submitadd"
              color="primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              className="bulk-update-btn"
              onClick={()=>onClose(null)}
              sx={{ marginLeft: "auto" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactPersonPopup;
