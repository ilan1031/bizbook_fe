"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  // Button,
  Tab,
  Tabs,
  StyledTextField,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  Modal,
  Paper,
  styled,
  TextField,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HelpIcon from "@mui/icons-material/Help";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../../../common/btn/Button";
import AddressFormClient from "../../../common/address/Address";
import OtherDetails from "../../../common/otherdetailsvendor/OtherDetailsVendor";
import ContactPersonTable from "../../../common/contactperson/ContactPersonTable";
import BankDetailsForm from "../../../common/bankdetails/BankDetails";
import apiService from "../../../../services/axiosService";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
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

const VendorForm = () => {
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clone_id = searchParams.get("clone_id");
  const [customerData, setCustomerData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [displayNameOptions, setDisplayNameOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [gstin, setGstin] = useState("");
  const [customFieldsData, setCustomFieldsData] = useState([]);
  const [reportingTags, setReportingTags] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (clone_id) {
      fetchContact(clone_id);
    }
  }, [clone_id]);

  const fetchContact = async (clone_id) => {
    if (!clone_id) return;
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${clone_id}`,
        params: {
          organization_id: organization_id,
        },
        file: false,
      });
      const { data } = response.data;
      setCustomerData(data);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      showMessage("Failed to fetch vendor data for cloning", "error");
    }
  };

  useEffect(() => {
    if (customerData && Object.keys(customerData).length > 0) {
      // Create a deep copy of the customer data
      const clonedData = JSON.parse(JSON.stringify(customerData));

      // Remove fields that should not be cloned
      const fieldsToRemove = [
        "_id",
        "contact_id",
        "created_time",
        "created_by_name",
        "deleted_at",
      ];
      fieldsToRemove.forEach((field) => delete clonedData[field]);

      // Handle contact persons
      const sanitizedContactPersons = Array.isArray(clonedData.contact_persons)
        ? clonedData.contact_persons.map((person) => ({
            ...person,
            contact_person_id: "",
            contact_id: "",
            _id: undefined,
            is_primary_contact: person.is_primary_contact || false,
          }))
        : [];

      // Handle bank details
      const sanitizedBankDetails = Array.isArray(clonedData.bank_details)
        ? clonedData.bank_details.map((bank) => ({
            ...bank,
            _id: undefined,
            is_primary_account: bank.is_primary_account || false,
          }))
        : [];

      // Update form with cloned data
      formik.setValues({
        ...formik.initialValues, // Start with initial values
        ...clonedData, // Override with cloned data
        contact_persons: sanitizedContactPersons,
        bank_details: sanitizedBankDetails,
        contact_id: "", // Clear contact_id
        _id: undefined, // Clear _id
        status: "active", // Set default status
        status_formatted: "Active",
        created_time: "", // Clear creation time
        created_by_name: "", // Clear creator name
        deleted_at: null, // Clear deletion time
      });

      // Update display name options
      const newOptions = [
        clonedData.contact_name,
        clonedData.company_name,
        `${clonedData.first_name} ${clonedData.last_name}`.trim(),
        clonedData.first_name,
        clonedData.last_name,
      ].filter(Boolean); // Remove empty strings

      setDisplayNameOptions([...new Set(newOptions)]); // Remove duplicates
    }
  }, [customerData]);

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

  // Initialize default values for the contact persons array
  const organization_id = localStorage.getItem("organization_id") || "";
  console.log(organization_id, "*****************");

  const defaultContactPerson = {
    contact_person_id: "",
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
    portal_access: false,
    is_portal_invitation_accepted: false,
    is_sms_enabled_for_cp: false,
    photo_url: "",
    communication_preference: {
      is_email_enabled: false,
    },
  };

  const fieldVisibility = {
    "Registered Business - Regular": [
      "gst_no",
      "business_legal_name",
      "business_trade_name",
      "place_of_contact",
    ],
    "Registered Business - Composition": [
      "gst_no",
      "business_legal_name",
      "business_trade_name",
      "place_of_contact",
    ],
    "Unregistered Business": ["place_of_contact"],
    Consumer: ["place_of_contact"],
    Overseas: [],
    "Special Economic Zone": [
      "gst_no",
      "business_legal_name",
      "business_trade_name",
      "place_of_contact",
    ],
    "Deemed Export": [
      "gst_no",
      "business_legal_name",
      "business_trade_name",
      "place_of_contact",
    ],
    "Tax Deductor": [
      "gst_no",
      "business_legal_name",
      "business_trade_name",
      "place_of_contact",
    ],
    "SEZ Developer": [
      "gst_no",
      "business_legal_name",
      "business_trade_name",
      "place_of_contact",
    ],
  };

  // const gstRegex =
  //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  // Form validation schema
  const validationSchema = Yup.object({
    // Only require primary contact and display name
    // contact_salutation: Yup.string().required("Salutation is required"),
    // first_name: Yup.string().required("First Name is required"),
    // last_name: Yup.string().required("Last name is required"),
    contact_name: Yup.string().required("Display name is required"),
    // Other fields are optional
    company_name: Yup.string().required("Company name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    phone: Yup.string().matches(
      /^\d{10}$/,
      "Phone number must be exactly 10 digits"
    ),
    // mobile: Yup.string()
    // .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    // .required("Mobile number is required"),
    gst_no: Yup.string().when("gst_treatment", (gst_treatment, schema) => {
      if (
        fieldVisibility[gst_treatment]?.includes("gst_no") &&
        formik.values.gst_treatment !== ""
      ) {
        return schema
          .required("GST number is required")
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid GST number format"
          );
      }
      return schema.notRequired();
    }),
    gst_treatment: Yup.string().required("GST Treatment is required"),



    place_of_contact: Yup.string().when(
      "gst_treatment",
      (gst_treatment, schema) => {
        if (formik.values.gst_treatment !== "") {
          return fieldVisibility[gst_treatment]?.includes("place_of_contact")
            ? schema.required("Place of contact is required")
            : schema.notRequired();
        }
        return schema.notRequired();
      }
    ),
    pan_no: Yup.string().matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN format (e.g., ABCDE1234F)"
    ),
    //   .required("PAN is required"),

    msme_type: Yup.string().when("msme_registered", {
      is: "registered",
      then: (schema) =>
        schema.required("MSME/Udyam Registration Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    msme_number: Yup.string().when("msme_registered", {
      is: "registered",
      then: (schema) =>
        schema
          .required("MSME/Udyam Registration Number is required")
          .matches(
            /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/,
            "Registration Number must be in format UDYAM-XX-00-0000000"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    place_of_contact: Yup.string().when(
      "gst_treatment",
      (gst_treatment, schema) => {
        if (formik.values.gst_treatment !== "") {
          return fieldVisibility[gst_treatment]?.includes("place_of_contact")
            ? schema.required("Place of contact is required")
            : schema.notRequired();
        }
        return schema.notRequired();
      }
    ),
  });

  // Close notification
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Function to fetch vendor details from GSTN
  // const handleFetchDetails = async () => {
  //   if (!gstin || !gstin.match(gstRegex)) {
  //     setNotification({
  //       open: true,
  //       message: "Please enter a valid GSTIN",
  //       severity: "error",
  //     });
  //     return;
  //   }

  //   try {
  //     // Show loading state
  //     setIsSubmitting(true);

  //     // Make API call to fetch vendor details
  //     const response = await apiService({
  //       method: "GET",
  //       url: `/api/v1/gstn/vendor/${gstin}`,
  //     });

  //     console.log("GSTN Response:", response);

  //     // If successful, update the form with the fetched details
  //     if (response.data) {
  //       const vendorData = response.data;

  //       // Update form values with fetched data
  //       formik.setValues({
  //         ...formik.values,
  //         company_name: vendorData.legal_name || vendorData.trade_name || "",
  //         contact_name: vendorData.trade_name || vendorData.legal_name || "",
  //         // gst_no: gstin,
  //         trader_name: vendorData.trade_name || "",
  //         legal_name: vendorData.legal_name || "",
  //         billing_address: {
  //           ...formik.values.billing_address,
  //           address: vendorData.address?.line1 || "",
  //           street2: vendorData.address?.line2 || "",
  //           city: vendorData.address?.city || "",
  //           state: vendorData.address?.state || "",
  //           zip: vendorData.address?.pincode || "",
  //           country: "India",
  //         },
  //       });

  //       // Also update display name options
  //       setDisplayNameOptions(
  //         [vendorData.trade_name || "", vendorData.legal_name || ""].filter(
  //           Boolean
  //         )
  //       );

  //       // Show success notification
  //       showMessage("Vendor created successfully!", "success");
  //     } else {
  //       throw new Error("No data received from GSTN");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching vendor details:", error);

  //     // Show error notification
  //     showMessage("Failed to create Vendor. Please try again.", "error");
  //   } finally {
  //     setIsSubmitting(false);
  //     handleClose();
  //   }
  // };

  // Initialize formik with all form fields
  const formik = useFormik({
    initialValues: {
      // Primary details
      admin_id: "",
      contact_name: "",
      gst_treatment: "",
      profile_image: [
        {
          file_name: "",
          source: "",
          file_type: "",
          file_size: "",
          uploaded_on: "",
          uploaded_by: "",
        },
      ],
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
      contact_type: "Vendor", // Setting default as vendor
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
      currency_code: "",
      currency_symbol: "",
      price_precision: 0,
      exchange_rate: 1.0,
      can_show_customer_ob: true,
      currency_code_short: "",
      opening_balance_amount: "",
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
      is_taxable: false,
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
      msme_registered: "not_registered",
      msme_type: "",
      msme_number: "",

      billing_address: {
        attention: "",
        address: "",
        city: "",
        state: "",
        state_code: "",
        street2: "",
        zip: "",
        country: "",
        country_code: "",
        phone: "",
        fax: "",
      },
      shipping_address: {
        attention: "",
        address: "",
        city: "",
        state: "",
        state_code: "",
        street2: "",
        zip: "",
        country: "",
        country_code: "",
        phone: "",
        fax: "",
      },

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

      // Custom fields
      custom_fields: {},

      // Reporting tags
      reporting_tags: [],

      // Remarks tab
      remarks: "",
    },
    validationSchema,
    onSubmit: async (values,) => {
      try {
        setIsSubmitting(true);
        console.log("Form Values:", values);

        // Format the current date for created_time
        const currentDate = new Date().toISOString();

        // Prepare formatted data for submission
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

        // Convert msme_type to proper string format if it's a boolean
        const msmeValue =
          typeof values.msme_registered === "boolean"
            ? values.msme_registered
              ? "registered"
              : "not_registered"
            : values.msme_registered || "not_registered";

        const formattedData = {
          ...values,
          contact_type: "Vendor",
          created_time: currentDate,
          organization_id: organization_id,
          // Fix type conversion issues
          payment_terms: paymentTermsValue,
          msme_registered: msmeValue,
          // Ensure contact_persons is at least an empty array if it's undefined
          contact_persons: Array.isArray(values.contact_persons)
            ? values.contact_persons
            : [],
          // Ensure bank_details is at least an empty array if it's undefined
          bank_details: Array.isArray(values.bank_details)
            ? values.bank_details
            : [],
          // Include custom fields and reporting tags
          custom_fields: values.custom_fields || {},
          reporting_tags: values.reporting_tags || [],
        };

        // Make API call
        const response = await apiService({
          method: "POST",
          url: "/api/v1/contact",
          data: JSON.stringify(formattedData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // console.log("API Response:-------", response);
        // return
        if (response.statusCode == 200) {
          router.push("/purchase/vendor/" + response.data.data.contact_id);
          showMessage("Vendor created successfully!", "success");
        } else {
          showMessage("Cannot add vendor.", "error");
        }
      } catch (error) {
        console.error("Error saving vendor details:", error);

        // Show error notification
        showMessage("Failed to create Vendor. Please try again.", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Fix: Ensure displayNameOptions updates properly
  useEffect(() => {
    const { first_name, last_name, company_name } = formik.values;
    let newOptions = [];

    if (first_name && last_name) {
      newOptions.push(`${first_name} ${last_name}`);
    }
    if (first_name) {
      newOptions.push(first_name);
    }
    if (last_name) {
      newOptions.push(last_name);
    }
    if (company_name) {
      newOptions.push(company_name);
    }

    setDisplayNameOptions([...new Set(newOptions)]); // Remove duplicates
  }, [
    formik.values.first_name,
    formik.values.last_name,
    formik.values.company_name,
  ]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Set primary contact details to first contact person when they're filled out
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
  ]);

  // Load custom fields and reporting tags on component mount
  useEffect(() => {
    const fetchCustomData = async () => {
      try {
        // Fetch custom fields
        const customFieldsResponse = await apiService({
          method: "GET",
          url: `/api/v1/custom-fields?entity_type=vendor&organization_id=${organization_id}`,
        });

        if (customFieldsResponse.data) {
          setCustomFieldsData(customFieldsResponse.data);
        }

        // Fetch reporting tags
        const reportingTagsResponse = await apiService({
          method: "GET",
          url: `/api/v1/reporting-tags?organization_id=${organization_id}`,
        });

        if (reportingTagsResponse.data) {
          setReportingTags(reportingTagsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching custom data:", error);
      }
    };

    fetchCustomData();
  }, [organization_id]);

  return (
    <Container maxWidth="md" sx={{ mt: 2, px: 2, ml: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "left",
          mb: 1,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontSize: "24px", fontWeight: "500" }}
        >
          New Vendor
        </Typography>
        {/* <IconButton>
          <HelpIcon sx={{ color: "orange" }} />
        </IconButton> */}
      </Box>

      {/* Fetch Vendor Details Link */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          cursor: "pointer",
          color: "#1976d2",
        }}
        onClick={handleOpen}
      >
        <Typography
          sx={{
            textTransform: "none",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Fetch Vendor Details From GSTN
        </Typography>
        <KeyboardArrowRightIcon fontSize="small" />
      </Box>

      {/* Fetch from GSTN Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="gstn-modal-title"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: "auto",
            p: 3,
            outline: "none",
            borderRadius: "4px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              id="gstn-modal-title"
              variant="h6"
              sx={{ fontSize: "18px" }}
            >
              Fetch From GSTN
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#E53935",
                width: "100px",
              }}
            >
              GSTIN/UIN*
            </Typography>
            <StyledTextField
              sx={{ flex: 1, mr: 2 }}
              // value={gstin}
              // onChange={(e) => setGstin(e.target.value)}
              placeholder="Enter GSTIN/UIN"
              size="small"
            />
            <Button
              variant="contained"
              sx={{ bgcolor: "#4285F4", textTransform: "none", px: 2 }}
            >
              Fetch Vendor Details
            </Button>
          </Box>
        </Paper>
      </Modal>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
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
                  <FormControl size="small" sx={{ width: "150px" }}>
                    <StyledSelect
                      labelId="salutation-label"
                      id="contact_salutation"
                      name="contact_salutation"
                      value={formik.values.contact_salutation || ""}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.contact_salutation &&
                        Boolean(formik.errors.contact_salutation)
                      }
                      sx={{
                        fontSize: "13px !important",
                        color: "gray",
                        width: "150px",
                        paddingTop: "5px",
                      }}
                      IconComponent={KeyboardArrowDownIcon}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) return "Salutation";
                        return selected;
                      }}
                    >
                      <MenuItem
                        value="Mr."
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                          },
                        }}
                      >
                        Mr.
                      </MenuItem>
                      <MenuItem
                        value="Mrs."
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                          },
                        }}
                      >
                        Mrs.
                      </MenuItem>
                      <MenuItem
                        value="Ms."
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                          },
                        }}
                      >
                        Ms.
                      </MenuItem>
                      <MenuItem
                        value="Miss."
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                          },
                        }}
                      >
                        Miss.
                      </MenuItem>
                      <MenuItem
                        value="Dr."
                        sx={{
                          fontSize: "13px",
                          margin: "2px",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                          },
                        }}
                      >
                        Dr.
                      </MenuItem>
                    </StyledSelect>
                  </FormControl>

                  <TextField
                    size="small"
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                    value={formik.values.first_name || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.first_name &&
                      Boolean(formik.errors.first_name)
                    }
                    helperText={
                      formik.touched.first_name && formik.errors.first_name
                    }
                    InputProps={{ sx: { fontSize: "13px", width: "150px" } }}
                  />

                  <TextField
                    size="small"
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                    value={formik.values.last_name || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.last_name &&
                      Boolean(formik.errors.last_name)
                    }
                    helperText={
                      formik.touched.last_name && formik.errors.last_name
                    }
                    InputProps={{ sx: { fontSize: "13px", width: "150px" } }}
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
                  placeholder="Company Name"
                  value={formik.values.company_name || ""}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.company_name &&
                    Boolean(formik.errors.company_name)
                  }
                  helperText={
                    formik.touched.company_name && formik.errors.company_name
                  }
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
                    sx={{ fontSize: "13px", color: "#D0312D" }}
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
                  <StyledSelect
                    id="contact_name"
                    name="contact_name"
                    value={formik.values.contact_name || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.contact_name &&
                      Boolean(formik.errors.contact_name)
                    }
                    helperText={
                      formik.touched.contact_name && formik.errors.contact_name
                    }
                    IconComponent={KeyboardArrowDownIcon}
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
                  >
                    {/* Default Option */}

                    {/* Dynamically Added Options */}
                    {displayNameOptions.map((option, index) => (
                      <MenuItem
                        key={index}
                        value={option}
                        sx={{
                          fontSize: "13px",
                          "&:hover": {
                            backgroundColor: "#408dfb",
                            color: "white",
                            margin: "5px",
                            borderRadius: "5px",
                          },
                        }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

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
                  value={formik.values.email || ""}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" sx={{ fontSize: "18px" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      height: "35px",
                      padding: "6px 12px",
                      borderRadius: "7px",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                      "&:hover": {
                        borderColor: COLORS.primary,
                        boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
                      },
                      "&:focus-within": {
                        outline: "none",
                        borderColor: COLORS.primary,
                        boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
                      },
                      "&::placeholder": {
                        color: COLORS.textSecondary,
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

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
                    value={formik.values.phone || ""}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
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
                  />

                  <TextField
                    size="small"
                    id="mobile"
                    name="mobile"
                    placeholder="Mobile"
                    value={formik.values.mobile || ""}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.mobile && Boolean(formik.errors.mobile)
                    }
                    helperText={formik.touched.mobile && formik.errors.mobile}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneAndroidOutlinedIcon
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
              aria-label="vendor details tabs"
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
                  borderBottom: tabValue === 0 ? "3px solid #1976d2" : "none",
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
                label="Bank Details"
                sx={{
                  fontWeight: tabValue === 3 ? "bold" : "normal",
                }}
              />
              <Tab
                label="Custom Fields"
                sx={{
                  fontWeight: tabValue === 4 ? "bold" : "normal",
                }}
              />
              <Tab
                label="Reporting Tags"
                sx={{
                  fontWeight: tabValue === 5 ? "bold" : "normal",
                }}
              />
              <Tab
                label="Remarks"
                sx={{
                  fontWeight: tabValue === 6 ? "bold" : "normal",
                }}
              />
            </Tabs>
          </Box>

          {/* Other Details Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid sx={{ margin: -4 }}>
              <OtherDetails formik={formik} />
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

          {/* Bank Details Tab */}
          <TabPanel value={tabValue} index={3}>
            {/* Show either the text + button OR the form */}
            {!showForm ? (
              <>
                <Typography
                  sx={{ marginTop: 4, marginLeft: 20, fontSize: "15px" }}
                >
                  Add your vendors bank details and make payments.
                </Typography>

                {/* Button to Show Form */}
                <Box
                  variant="text"
                  onClick={() => setShowForm(true)}
                  sx={{
                    mt: 2,
                    mb: "50px",
                    textTransform: "none",
                    color: "#408dfb",
                    fontWeight: "normal",
                    textAlign: "center",
                    marginLeft: "-17%",
                    fontSize: "14px",
                    "&:hover": {
                      backgroundColor: "",
                      // textDecoration: "underline",
                    },
                  }}
                >
                  + Add Bank Account
                </Box>
              </>
            ) : (
              <Grid sx={{ marginLeft: -60 }}>
                <BankDetailsForm formik={formik} />
              </Grid>
            )}
          </TabPanel>

          {/* Custom Fields Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography
              sx={{ fontSize: "13px", textAlign: "center", margin: "30px" }}
            >
              Start adding custom fields for your Customers and Vendors by going
              to Settings Preferences Customers and Vendors. You can also refine
              the address format of your Customers and Vendors from there.
            </Typography>
          </TabPanel>

          {/* Reporting Tags Tab */}
          <TabPanel value={tabValue} index={5}>
            <Typography
              sx={{ fontSize: "13px", textAlign: "center", margin: "30px" }}
            >
              Youve not created any Reporting Tags. Start creating reporting
              tags by going to More Settings Reporting Tags
            </Typography>
          </TabPanel>

          {/* Remarks Tab */}
          <TabPanel value={tabValue} index={6}>
            <Grid>
              <Typography sx={{ display: "flex", fontSize: "13px" }}>
                <Typography sx={{ fontWeight: 550, fontSize: "13px", mr: 1 }}>
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
                  id="notes"
                  multiline
                  rows={3}
                  name="notes"
                  value={formik.values.notes || ""}
                  onChange={formik.handleChange}
                />
              </Box>
            </Grid>
          </TabPanel>
        </Box>
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
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outlined"
            sx={{ textTransform: "none" }}
            disabled={isSubmitting}
            onClick={() => router.push("/purchase/vendor")}
          >
            Cancel
          </Button>
        </Paper>
      </form>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VendorForm;
