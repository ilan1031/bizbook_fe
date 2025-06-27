"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Divider,
  Avatar,
  Link,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Popover,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import ContactPersonPopup from "../../common/ContactPersonPopup";
import BillingAddress from "../BillingAddressForm";
import ContactPersonList from "../contactperson/contactPersonList";
import { useRouter } from "next/navigation";
import apiService from "../../../../src/services/axiosService";
import { useSnackbar } from "../../../../src/components/SnackbarProvider";
import { EmailComposer } from "../customerEmail/page";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageIcon from "@mui/icons-material/Language";
import { Close } from "@mui/icons-material";
import AnimatedBarChart from "../../../components/AnimatedBarChart";
import config from "../../../services/config";
import { Settings } from "lucide-react";
import DotLoader from "../../../components/DotLoader";
// import { Link } from 'react-router-dom';

const Overview = ({ details, callAPI, moduleKey }) => {
  const [isContactPersonPopupOpen, setContactPersonPopupOpen] =
    React.useState(false);
  const [editingContact, setEditingContact] = React.useState(null);
  const [selectedContact, setSelectedContact] = React.useState(null);
  const [taxDialogOpen, setTaxDialogOpen] = React.useState(false);
  const [anchorElBA, setAnchorElBA] = React.useState(null);
  const [anchorElSA, setAnchorElSA] = React.useState(null);
  const [anchorElAA, setAnchorElAA] = React.useState(null);
  const [address, setAddress] = useState("");
  const { showMessage } = useSnackbar();
  const [contactMenuAnchorEl, setContactMenuAnchorEl] = React.useState(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("organization_id") || "";
    }
    return "";
  });

  // Simulated income data for bar chart
  const [incomeData, setIncomeData] = useState([
    { name: "Sep", value: 3200 },
    { name: "Oct", value: 4100 },
    { name: "Nov", value: 2900 },
    { name: "Dec", value: 5000 },
    { name: "Jan", value: 3800 },
    { name: "Feb", value: 4500 },
    { name: "Mar", value: 5200 },
  ]);

  // Added state for customer details
  const [customerDetailsData, setCustomerDetailsData] = useState([]);

  useEffect(() => {
    // Fetch additional customer details if details and contact_id are available
    if (details?.contact_id) {
      fetchCustomerDetails(details.contact_id);
    }
  }, [details?.contact_id]);

  const fetchCustomerDetails = async (contactId) => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/vendors/comments?contact_id=${contactId}&organization_id=${organizationId}`,
      });
      const data = response.data;

      // Update customerDetailsData with the fetched data
      prepareCustomerDetailsData(data);
    } catch (err) {
      console.error("Failed to fetch customer details:", err);
    }
  };

  const INDIAN_STATES = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
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

  const prepareCustomerDetailsData = (data) => {
    // Build the data array with the fields we want to display
    const detailsArray = [
      {
        id: "customerType",
        label: "Customer Type",
        value: data?.customer_sub_type || details?.customer_sub_type,
        editable: true,
        type: "select",
        options: ["Business", "Individual"],
      },
      {
        id: "defaultCurrency",
        label: "Default Currency",
        value: data?.currency_code || details?.currency_code || "INR",
        editable: false,
      },
      {
        id: "gstTreatment",
        label: "GST Treatment",
        value:
          data?.gst_treatment ||
          details?.gst_treatment ||
          "Registered Business - Regular",
        editable: true,
        type: "select",
        options: [
          "Registered Business - Regular",
          "Registered Business - Composition",
          "Unregistered Business",
          "Consumer",
          "Overseas",
          "Special Economic Zone",
          "Deemed Export",
        ],
      },
      {
        id: "gstin",
        label: "GSTIN",
        value: data?.gst_no || details?.gst_no || "",
        editable: true,
        type: "text",
        isPending: !(data?.gst_no || details?.gst_no),
      },
      {
        id: "placeOfSupply",
        label: "Place of Supply",
        value: data?.place_of_contact || details?.place_of_contact || "",
        editable: true,
        type: "select",
        options: INDIAN_STATES,
        isPending: !(data?.place_of_contact || details?.place_of_contact),
      },
      {
        id: "pan",
        label: "PAN",
        value: data?.pan_no || details?.pan_no || "Not specified",
        editable: true,
        type: "text",
        display: !!(data?.pan_no || details?.pan_no),
      },

      {
        id: "taxPreference",
        label: "Tax Preference",
        value: data?.tax_preference || "Taxable",
        editable: true,
        type: "dialog",
      },
      {
        id: "portalStatus",
        label: "Portal Status",
        value:
          data?.portal_status_formatted ||
          details?.portal_status_formatted ||
          "Disabled",
        isDisabled:
          (data?.portal_status_formatted ||
            details?.portal_status_formatted) === "Disabled",
        isEnabled:
          (data?.portal_status_formatted ||
            details?.portal_status_formatted) === "Enabled",
        hasSettings: true,
        type: "text",
      },
      {
        id: "portalLanguage",
        label: "Portal Language",
        value: data?.language_code || "English",
        editable: true,
        type: "select",
        options: ["English", "Hindi", "French", "Spanish", "German"],
        display: !!data?.language_code,
      },
      {
        id: "website",
        label: "Website",
        value: data?.website || details?.website || "",
        editable: true,
        type: "text",
        isLink: true,
        icon: <LanguageIcon sx={{ fontSize: 16, mr: 0.5 }} />,
        display: !!(data?.website || details?.website),
      },
      {
        id: "twitter",
        label: "Twitter",
        value: data?.twitter || "",
        editable: true,
        type: "text",
        isLink: true,
        icon: <TwitterIcon sx={{ fontSize: 16, mr: 0.5 }} />,
        display: !!data?.twitter,
      },
      {
        id: "facebook",
        label: "Facebook",
        value: data?.facebook || "",
        editable: true,
        type: "text",
        isLink: true,
        icon: <FacebookIcon sx={{ fontSize: 16, mr: 0.5 }} />,
        display: !!data?.facebook,
      },
      {
        id: "department",
        label: "Department",
        value: data?.department || details?.department || "",
        editable: true,
        type: "text",
        display: !!(data?.department || details?.department),
      },
      {
        id: "designation",
        label: "Designation",
        value: data?.designation || details?.designation || "",
        editable: true,
        type: "text",
        display: !!(data?.designation || details?.designation),
      },
      {
        id: "source",
        label: "Source",
        value: data?.source || details?.source || "User",
        editable: false,
      },
    ];

    // Filter out items that have display: false
    const filteredDetails = detailsArray.filter(
      (item) => item.display === undefined || item.display === true
    );

    setCustomerDetailsData(filteredDetails);
  };

  const handleUpdateCustomerDetail = async (id, value) => {
    try {
      // alert(openingBalance, "balance");
      // Get the vendorId from details
      const vendorId = details?.contact_id;

      if (!vendorId) {
        showMessage("Contact ID is missing", "error");
        return;
      }

      // Map the id to the actual field name in the API
      const fieldMapping = {
        customerType: "contact_sub_type",
        customerSubType: "contact_sub_type",
        defaultCurrency: "currency_code",
        gstTreatment: "gst_treatment",
        gstin: "gst_no",
        placeOfSupply: "place_of_contact",
        pan: "pan_no",
        taxPreference: "tax_preference",
        portalStatus: "portal_status",
        portalLanguage: "language_code",
        website: "website",
        twitter: "twitter",
        facebook: "facebook",
        department: "department",
        designation: "designation",
      };

      const fieldName = fieldMapping[id] || id;
      // Prepare the update data
      const updateData = {
        [fieldName]: value,
        // opening_balance_amount: openingBalance,
      };

      const response = await apiService({
        method: "PUT",
        url: `/api/v1/contact?contact_id=${vendorId}&organization_id=${organizationId}`,
        data: updateData,
      });

      if (response.data) {
        showMessage(`${id} updated successfully`, "success");

        // Update local state immediately
        setCustomerDetailsData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, value: value } : item
          )
        );

        // If the field is part of the main details object, update that as well

        // Update the parent component's state if needed
        if (typeof callAPI === "function") {
          callAPI(vendorId);
        }
      }
    } catch (err) {
      console.error(`Failed to update ${id}:`, err);
      showMessage(`Failed to update ${id}`, "error");
    }
  };

  const handleInviteToPortal = async (data) => {
    let inviteData = data ? data : details;
    if (!inviteData?.email) {
      showMessage("No email address available for this contact", "error");
      return;
    }

    // Set loading state
    setInviteLoading(true);

    try {
      const response = await apiService({
        method: "POST",
        url: "/api/v1/email/invite-portal",
        customBaseUrl: config.PO_Base_url,
        data: {
          contactId: inviteData.contact_id,
          contact_person_id: inviteData?.contact_person_id,
          email: inviteData.email,
          name: inviteData.contact_name,
          organizationId: organizationId,
          companyName: inviteData.company_name || "Our Company",
        },
      });

      // Clear loading state
      setInviteLoading(false);

      // Check response structure correctly
      if (response?.data?.status === true) {
        showMessage(
          response?.data?.message || "Portal invitation sent successfully",
          "success"
        );

        // Update the UI to reflect the new status
        const updatedDetails = customerDetailsData.map((item) => {
          if (item.id === "portalStatus") {
            return { ...item, value: "Invited" };
          }
          return item;
        });

        setCustomerDetailsData(updatedDetails);
        callAPI(details?.contact_id);
        // Optionally refresh data if needed
        // fetchContactDetails();
      } else {
        // Handle API success but business logic failure
        showMessage(
          response?.data?.message || "Failed to send invitation",
          "error"
        );
      }
    } catch (error) {
      // Clear loading state
      setInviteLoading(false);

      console.error("Invite to portal error:", error);

      // Properly extract error message from response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";

      showMessage(`Failed to send invitation: ${errorMessage}`, "error");
    }
  };

  const handleAdd = () => {
    setIsPrimary(true);
    setEditingContact(null);
    setContactPersonPopupOpen(true);
  };

  const handleClickBA = (event, value) => {
    setAddress(value);
    setAnchorElBA(event.currentTarget);
  };

  const handleCloseBA = () => {
    callAPI(details?.contact_id);
    setAnchorElBA(null);
  };

  const handleClickSA = (event, value) => {
    setAddress(value);
    setAnchorElSA(event.currentTarget);
  };

  const handleCloseSA = () => {
    callAPI(details?.contact_id);
    setAnchorElSA(null);
  };

  const handleClickAA = (event, value) => {
    setAddress(value);
    setAnchorElAA(event.currentTarget);
  };

  const handleCloseAA = () => {
    callAPI(details?.contact_id);
    setAnchorElAA(null);
  };

  const handleOpenContactMenu = (event, contact) => {
    event.stopPropagation();
    setContactMenuAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleCloseContactMenu = () => {
    setContactMenuAnchorEl(null);
    setSelectedContact(null);
  };
  const [popupOpen, setpopupOpen] = useState(false);
  const [originalOpeningBalance, setOriginalOpeningBalance] = useState("");
  const [openingBalance, setOpeningBalance] = useState(
    details?.opening_balance_amount
  );

  const handleOpen = () => {
    // This should set the balance first
    setpopupOpen(true);
    // console.log("details**++++**ascascascsa", details.opening_balance_amount);
  };

  const handleClose = () => {
    setpopupOpen(false);
  };

  // const handleSave = () => {
  //   if (openingBalance !== originalOpeningBalance) {
  //     handleFieldUpdate("opening_balance_amount", openingBalance);
  //   }
  //   handleClose();
  // };

  const handleMakeAsPrimary = async (contactPerson) => {
    if (!contactPerson || !contactPerson?.contact_person_id) {
      showAlert("Contact person information is missing", "error");
      return;
    }

    try {
      const response = await apiService({
        method: "PUT",
        url: `/api/v1/contact-person/${contactPerson?.contact_person_id}/make-primary`,
        data: {
          organization_id: organizationId,
          contact_id: details?.contact_id,
        },
      });

      if (response.status) {
        showAlert("Contact set as primary successfully", "success");
        callAPI(details?.contact_id);
      } else {
        showAlert("Failed to set contact as primary", "error");
      }
    } catch (error) {
      console.error("Make primary error:", error);
      showAlert(
        "Failed to set contact as primary: " +
          (error.message || "Unknown error"),
        "error"
      );
    }
  };

  const handleMenuOption = (action) => {
    if (!selectedContact) return;
    switch (action) {
      case "edit":
        handleOpenContactPersonPopup(selectedContact);
        break;
      case "delete":
        handleDelete(selectedContact?.contact_person_id);
        break;
      case "primary":
        handleMakeAsPrimary(selectedContact);
        break;
      case "email":
        handleSendEmail(selectedContact);
        break;
      default:
        break;
    }
    handleCloseContactMenu();
  };

  const handleSendEmail = (contactPerson) => {
    if (!contactPerson || !contactPerson.email) {
      showAlert("No email address available for this contact", "error");
      return;
    }

    // Navigate to email composer or open email dialog
    window.location.href = `/common/customerEmail?org_id=${organizationId}&contact_id=${
      details?.contact_id
    }&email_type=${moduleKey || "Customer"}&recipient=${contactPerson.email}`;
  };

  const open = Boolean(anchorElBA);
  const id = open ? "simple-popover" : undefined;

  const openSA = Boolean(anchorElSA);
  const idSA = open ? "simple-popover" : undefined;

  const openAA = Boolean(anchorElAA);
  const idAA = open ? "simple-popover" : undefined;

  const handleOpenContactPersonPopup = (contactToEdit = null) => {
    setEditingContact(contactToEdit);
    setContactPersonPopupOpen(true);
  };

  const handleCloseContactPersonPopup = (id) => {
    setContactPersonPopupOpen(false);
    setEditingContact(null);
    callAPI(id);
  };

  const handleTaxPreferenceClick = () => setTaxDialogOpen(true);
  const handleTaxDialogClose = () => setTaxDialogOpen(false);
  const handleRowHover = (id) => setHoveredRow(id);
  const handleRowLeave = () => setHoveredRow(null);
  const [editingRow, setEditingRow] = React.useState(null);
  const [hoveredRow, setHoveredRow] = React.useState(null);
  const [editValues, setEditValues] = React.useState({});

  const handleEditClick = (row) => {
    setEditingRow(row.id);
    setEditValues({ [row.id]: row.value });
  };

  const handleEditChange = (event, rowId) => {
    setEditValues({ ...editValues, [rowId]: event.target.value });
  };

  const handleEditSave = (rowId) => {
    // Update the value in the backend
    handleUpdateCustomerDetail(rowId, editValues[rowId]);
    setEditingRow(null);
  };

  const handleEditCancel = () => {
    setEditingRow(null);
    setEditValues({});
  };

  // Add this function to your component
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString; // Return original string if formatting fails
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService({
        method: "DELETE",
        url: `/api/v1/contact-person/${id}`,
      });
      showMessage("Contact Person's information has been deleted", "success");
      refreshView();
    } catch (err) {
      console.error("Failed to delete contact person:", err);
    }
  };

  const refreshView = () => {
    if (moduleKey === "Customer") {
      window.location.href = `/sales/customer/${details?.contact_id}`;
    } else {
      window.location.href = `/sales/vendor/${details?.contact_id}`;
    }
  };

  const menuItemStyles = {
    "&:hover": {
      backgroundColor: "#4285F4",
      color: "#fff",
      "& .MuiListItemIcon-root": {
        color: "#4285F4",
      },
    },
  };

  return (
    <Grid className="details" container spacing={3}>
      {/* Customer Details Section */}

      <Grid className="details-info" item xs={12} md={4}>
        <Card variant="outlined" sx={{ mb: 3, border: 0, background: "none" }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            {details?.company_name}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {/* <Box sx={{ display: "flex", mb: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: 2,
                bgcolor: "#E0E0E0",
                fontSize: "14px",
              }}
              variant="rounded"
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "13px", mb: 0.5, fontWeight: 600 }}
              >
                {details?.contact_name}
              </Typography>
              {details?.email && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  {details?.email}
                </Typography>
              )}
              {details?.designation && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  {details?.designation}
                </Typography>
              )}
              {details?.department && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  {details?.department}
                </Typography>
              )}
              {details?.phone && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <LocalPhoneOutlinedIcon className="button-more-svg" sx />
                  {details?.phone}
                </Typography>
              )}
              {details?.mobile && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <PhoneAndroidIcon className="button-more-svg" sx />
                  {details?.mobile}
                </Typography>
              )}

              {!details?.invited_by ? (
                <>
                  <Link
                    href="#"
                    color="#408dfb"
                    underline="hover"
                    sx={{ fontSize: "13px", fontWeight: 300 }}
                    onClick={handleInviteToPortal}
                  >
                    {inviteLoading ? "Sending invite..." : "Invite to Portal"}
                  </Link>
                  <Link
                    href={`/common/customerEmail?org_id=${
                      localStorage.getItem("organization_id") || ""
                    }&contact_id=${details?.contact_id || ""}&email_type=${
                      moduleKey || "Customer"
                    }`}
                    color="#408dfb"
                    underline="hover"
                    sx={{
                      fontSize: "13px",
                      fontWeight: 300,
                      marginLeft: "20px",
                    }}
                  >
                    Send Email
                  </Link>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fd9134c2",
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "11px",
                    }}
                  >
                    Portal invitation not accepted
                  </Typography>
                  <Link
                    href="#"
                    color="#408dfb"
                    underline="hover"
                    sx={{ fontSize: "13px", fontWeight: 300 }}
                    onClick={handleInviteToPortal}
                  >
                    Re-invite
                  </Link>
                  <Link
                    href={`/common/customerEmail?org_id=${organizationId}&contact_id=${details?.contact_id || ""}&email_type=${
                      moduleKey || "Customer"
                    }`}
                    color="#408dfb"
                    underline="hover"
                    sx={{ fontSize: "13px", fontWeight: 300, marginLeft: "10px" }}
                  >
                    Send Email
                  </Link>
                </>
              )}
            </Box>
            <IconButton
              size="small"
              sx={{ p: 0.5, color: "#757575", height: "fit-content" }}
            >
              <Settings color= "#6c718a" width="16px" />
            </IconButton>
          </Box> */}
          {details?.contact_persons.length !== 0 ? (
            (() => {
              const primaryContact = details.contact_persons.find(
                (contact) => contact.is_primary_contact
              );
              return (
                <Box
                  key={primaryContact?.contact_person_id}
                  sx={{ display: "flex", mb: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      mr: 2,
                      bgcolor: "#E0E0E0",
                      fontSize: "14px",
                    }}
                    variant="rounded"
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "13px", mb: 0.5, fontWeight: 600 }}
                    >
                      {primaryContact?.salutation} {primaryContact?.first_name}{" "}
                      {primaryContact?.last_name}
                    </Typography>
                    {primaryContact?.email && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#363636",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "13px",
                        }}
                      >
                        {primaryContact?.email}
                      </Typography>
                    )}
                    {primaryContact?.designation && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#363636",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "13px",
                        }}
                      >
                        {primaryContact?.designation}
                      </Typography>
                    )}
                    {primaryContact?.department && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#363636",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "13px",
                        }}
                      >
                        {primaryContact?.department}
                      </Typography>
                    )}
                    {primaryContact?.phone && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#363636",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "13px",
                        }}
                      >
                        <LocalPhoneOutlinedIcon
                          className="button-more-svg"
                          sx
                        />
                        {primaryContact?.phone}
                      </Typography>
                    )}
                    {primaryContact?.mobile && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#363636",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "13px",
                        }}
                      >
                        <PhoneAndroidIcon className="button-more-svg" sx />
                        {primaryContact?.mobile}
                      </Typography>
                    )}

                    {primaryContact?.is_added_in_portal &&
                      !primaryContact?.is_portal_invitation_accepted && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#fd9134c2",
                            mb: 0.5,
                            display: "flex",
                            alignItems: "center",
                            fontSize: "11px",
                          }}
                        >
                          Portal invitation not accepted
                        </Typography>
                      )}

                    {!primaryContact?.is_added_in_portal &&
                    !primaryContact?.can_invite ? (
                      <Link
                        href="#"
                        color="#408dfb"
                        underline="hover"
                        sx={{ fontSize: "13px", fontWeight: 300 }}
                        onClick={() => handleInviteToPortal(primaryContact)}
                      >
                        {inviteLoading ? <DotLoader /> : "Invite to Portal"}
                      </Link>
                    ) : !primaryContact?.is_added_in_portal &&
                      primaryContact?.can_invite &&
                      !primaryContact?.is_portal_invitation_accepted ? (
                      <Link
                        href="#"
                        color="#408dfb"
                        underline="hover"
                        sx={{ fontSize: "13px", fontWeight: 300 }}
                      >
                        Re-invite
                      </Link>
                    ) : (
                      <Link
                        href="#"
                        color="#408dfb"
                        underline="hover"
                        sx={{ fontSize: "13px", fontWeight: 300 }}
                      >
                        Resend Portal Link
                      </Link>
                    )}

                    {!inviteLoading && (
                      <>
                        <span style={{ color: "#ddd" }}> | </span>
                        <Link
                          href={`/common/customerEmail?org_id=${
                            localStorage.getItem("organization_id") || ""
                          }&contact_id=${
                            details?.contact_id || ""
                          }&email_type=${moduleKey || "Customer"}`}
                          color="#408dfb"
                          underline="hover"
                          sx={{
                            fontSize: "13px",
                            fontWeight: 300,
                            // marginLeft: "20px",
                          }}
                        >
                          Send Email
                        </Link>
                      </>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    sx={{ p: 0.5, color: "#757575", height: "fit-content" }}
                    onClick={(e) => handleOpenContactMenu(e, primaryContact)}
                  >
                    <SettingsIcon className="button-more-svg" />
                  </IconButton>
                  <Menu
                    anchorEl={contactMenuAnchorEl}
                    open={Boolean(contactMenuAnchorEl)}
                    onClose={handleCloseContactMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem
                      sx={menuItemStyles}
                      onClick={() => handleMenuOption("edit")}
                    >
                      <ListItemText className="menu-text" primary="Edit" />
                    </MenuItem>
                    <MenuItem
                      sx={menuItemStyles}
                      onClick={() => handleMenuOption("delete")}
                    >
                      <ListItemText className="menu-text" primary="Delete" />
                    </MenuItem>
                  </Menu>
                </Box>
              );
            })()
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#757575", fontSize: "13px" }}
            >
              There is no primary contact information.{" "}
              <span
                onClick={handleAdd}
                style={{
                  color: "#4285F4",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Add New
              </span>
            </Typography>
          )}
        </Card>

        {/* Remarks Section */}
        {details?.notes && (
          <Accordion
            defaultExpanded
            sx={{ border: 0, boxShadow: "none", background: "none" }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon color="primary" sx={{ fontSize: "18px" }} />
              }
              sx={{ p: 0 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "13px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#444444",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                REMARKS
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", marginTop: "10px" }}
              >
                {details?.notes}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Address Section */}
        <Accordion
          defaultExpanded
          sx={{ mb: 1, border: 0, boxShadow: "none", background: "none" }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon color="primary" sx={{ fontSize: "18px" }} />
            }
            sx={{ p: 0 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#444444",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              ADDRESS
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontSize: "13px", fontWeight: 500 }}
            >
              Billing Address
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}
            >
              {details?.billing_address ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "13px", color: "#363636", lineHeight: 1.5 }}
                  >
                    {[
                      details?.billing_address?.attention,
                      details?.billing_address?.address,
                      details?.billing_address?.street2,
                      details?.billing_address?.city,
                      [
                        details?.billing_address?.state,
                        details?.billing_address?.zip,
                      ]
                        .filter(Boolean)
                        .join(" "), // state + zip in one line
                      details?.billing_address?.country,
                      details?.billing_address?.phone
                        ? `Phone ${details?.billing_address?.phone}`
                        : null,
                      details?.billing_address?.fax
                        ? `Fax Number ${details?.billing_address?.fax}`
                        : null,
                    ]
                      .filter(Boolean) // Remove empty, null, undefined
                      .map((line, index) => (
                        <div
                          key={index}
                          style={{ fontWeight: index === 0 ? "bold" : "400" }}
                        >
                          {line}
                        </div>
                      ))}
                  </Typography>

                  <IconButton
                    size="small"
                    sx={{ p: 0.5, height: "fit-content", color: "#757575" }}
                    onClick={(e) => handleClickBA(e, "edit")}
                  >
                    <EditIcon sx={{ fontSize: "16px" }} />
                  </IconButton>
                </>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontSize: "13px", color: "#363636", lineHeight: 1.5 }}
                >
                  No Billing Address -{" "}
                  <span
                    style={{ color: "#408dfb", cursor: "pointer" }}
                    onClick={(e) => handleClickBA(e, "add")}
                  >
                    + New Address
                  </span>
                </Typography>
              )}
              <Popover
                id={id}
                open={open}
                anchorEl={anchorElBA}
                onClose={handleCloseBA}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: { width: "390px", overflow: "none" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4px 14px",
                    backgroundColor: "#f9f9fb",
                  }}
                >
                  <Typography fontSize={"14px"} variant="body1">
                    Billing Address
                  </Typography>
                  <IconButton onClick={handleCloseBA} sx={{ color: "red" }}>
                    <Close />
                  </IconButton>
                </Box>
                <BillingAddress
                  onClose={handleCloseBA}
                  open={open}
                  editData={details?.billing_address}
                  address={address}
                  title="Billing Address"
                  contactId={details?.contact_id}
                />
              </Popover>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontSize: "13px", fontWeight: 500 }}
            >
              Shipping Address
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}
            >
              {details?.shipping_address ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "13px", color: "#363636", lineHeight: 1.5 }}
                  >
                    {[
                      details?.shipping_address?.attention,
                      details?.shipping_address?.address,
                      details?.shipping_address?.street2,
                      details?.shipping_address?.city,
                      [
                        details?.shipping_address?.state,
                        details?.shipping_address?.zip,
                      ]
                        .filter(Boolean)
                        .join(" "), // state + zip in one line
                      details?.shipping_address?.country,
                      details?.shipping_address?.phone
                        ? `Phone ${details?.shipping_address?.phone}`
                        : null,
                      details?.shipping_address?.fax
                        ? `Fax Number ${details?.shipping_address?.fax}`
                        : null,
                    ]
                      .filter(Boolean) // Remove empty, null, undefined
                      .map((line, index) => (
                        <div
                          key={index}
                          style={{ fontWeight: index === 0 ? "bold" : "400" }}
                        >
                          {line}
                        </div>
                      ))}
                  </Typography>

                  <IconButton
                    size="small"
                    sx={{ p: 0.5, height: "fit-content", color: "#757575" }}
                    onClick={(e) => handleClickSA(e, "edit")}
                  >
                    <EditIcon sx={{ fontSize: "16px" }} />
                  </IconButton>
                </>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontSize: "13px", color: "#363636", lineHeight: 1.5 }}
                >
                  No Shipping Address -{" "}
                  <span
                    style={{ color: "#408dfb", cursor: "pointer" }}
                    onClick={(e) => handleClickSA(e, "add")}
                  >
                    + New Address
                  </span>
                </Typography>
              )}
              <Popover
                id={idSA}
                open={openSA}
                anchorEl={anchorElSA}
                onClose={handleCloseSA}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: { width: "390px", overflow: "none" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4px 14px",
                    backgroundColor: "#f9f9fb",
                  }}
                >
                  <Typography fontSize={"14px"} variant="body1">
                    Shipping Address
                  </Typography>
                  <IconButton onClick={handleCloseSA} sx={{ color: "red" }}>
                    <Close />
                  </IconButton>
                </Box>
                <BillingAddress
                  onClose={handleCloseSA}
                  open={openSA}
                  editData={details?.shipping_address}
                  address={address}
                  title="Shipping Address"
                  contactId={details?.contact_id}
                />
              </Popover>
            </Box>
            {details?.additional_address?.length > 0 && (
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontSize: "13px", fontWeight: 500 }}
              >
                Additional Address
              </Typography>
            )}
            <Box sx={{ mb: 1 }}>
              {details?.additional_address?.length > 0 ? (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {details?.additional_address?.map((addAddress, idx) => {
                      return (
                        <>
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{
                              fontSize: "13px",
                              color: "#363636",
                              lineHeight: 1.5,
                              marginBottom: "8px",
                            }}
                          >
                            {[
                              addAddress?.attention,
                              addAddress?.address,
                              addAddress?.street2,
                              addAddress?.city,
                              [addAddress?.state, addAddress?.zip]
                                .filter(Boolean)
                                .join(" "), // state + zip
                              addAddress?.country,
                              addAddress?.phone
                                ? `Phone: ${addAddress?.phone}`
                                : null,
                              addAddress?.fax
                                ? `Fax Number: ${addAddress?.fax}`
                                : null,
                            ]
                              .filter(Boolean)
                              .map((line, index) => (
                                <div
                                  key={index}
                                  style={{
                                    fontWeight: index === 0 ? "bold" : "400",
                                  }}
                                >
                                  {line}
                                </div>
                              ))}
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{
                              p: 0.5,
                              height: "fit-content",
                              color: "#757575",
                            }}
                            onClick={(e) => handleClickAA(e, "edit")}
                          >
                            <EditIcon sx={{ fontSize: "16px" }} />
                          </IconButton>
                          <Popover
                            id={idAA}
                            open={openAA}
                            anchorEl={anchorElAA}
                            onClose={handleCloseAA}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            PaperProps={{
                              sx: { width: "390px", overflow: "none" },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "4px 14px",
                                backgroundColor: "#F9F9FB",
                              }}
                            >
                              <Typography fontSize={"14px"} variant="body1">
                                Additional Address
                              </Typography>
                              <IconButton
                                onClick={handleCloseAA}
                                sx={{ color: "red" }}
                              >
                                <Close />
                              </IconButton>
                            </Box>
                            <BillingAddress
                              onClose={handleCloseAA}
                              open={open}
                              editData={addAddress}
                              address={address}
                              title="Additional Address"
                              contactId={details?.contact_id}
                            />
                          </Popover>
                        </>
                      );
                    })}
                  </Box>
                  {details?.additional_address?.length <= 2 && (
                    <Link
                      href="#"
                      color="primary"
                      underline="none"
                      sx={{ mt: 2, display: "block", fontSize: "13px" }}
                      onClick={(e) => handleClickAA(e, "add")}
                    >
                      Add additional address
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="#"
                    color="primary"
                    underline="none"
                    sx={{ mt: 2, display: "block", fontSize: "13px" }}
                    onClick={(e) => handleClickAA(e, "add")}
                  >
                    Add additional address
                  </Link>
                  <Popover
                    id={idAA}
                    open={openAA}
                    anchorEl={anchorElAA}
                    onClose={handleCloseAA}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      sx: { width: "390px", overflow: "none" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 14px",
                        backgroundColor: "#F9F9FB",
                      }}
                    >
                      <Typography fontSize={"14px"} variant="body1">
                        Additional Address
                      </Typography>
                      <IconButton onClick={handleCloseAA} sx={{ color: "red" }}>
                        <Close />
                      </IconButton>
                    </Box>
                    <BillingAddress
                      onClose={handleCloseAA}
                      open={open}
                      editData={null}
                      address={address}
                      title="Additional Address"
                      contactId={details?.contact_id}
                    />
                  </Popover>
                </>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Other Details Section - Updated with dynamic data */}
        <Accordion
          defaultExpanded
          sx={{ border: 0, boxShadow: "none", background: "none" }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon color="primary" sx={{ fontSize: "18px" }} />
            }
            sx={{
              p: 0,
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
              minHeight: "48px",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#444444",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              OTHER DETAILS
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            {customerDetailsData.map((row) => (
              <Grid
                container
                key={row.id}
                onMouseEnter={() => handleRowHover(row.id)}
                onMouseLeave={handleRowLeave}
                sx={{
                  py: 1.5,
                  borderBottom: "1px solid rgba(224, 224, 224, 0.3)",

                  position: "relative",
                }}
              >
                <Grid item xs={5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#757575",
                      fontSize: "13px",
                      p: 1,
                    }}
                  >
                    {row.label}
                  </Typography>
                </Grid>

                <Grid item xs={7}>
                  {editingRow === row.id ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {row.type === "select" ? (
                        <Select
                          value={editValues[row.id] || ""}
                          onChange={(e) => handleEditChange(e, row.id)}
                          size="small"
                          fullWidth
                          sx={{
                            fontSize: "12px",
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2196f3",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2196f3",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2196f3",
                            },
                            height: "36px",
                          }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                marginTop: 6,
                                maxHeight: 200,
                                width: 150,
                                overflowY: "auto",
                              },
                            },
                          }}
                          IconComponent="false"
                          endAdornment={
                            <Box
                              sx={{
                                display: "flex",
                                position: "absolute",
                                right: 8, // Adjust the right position to avoid overlap
                                top: "50%",
                                transform: "translateY(-50%)", // Center vertically
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleEditSave(row.id)}
                                sx={{
                                  padding: "2px",
                                  background: "#22b378",
                                  color: "white",
                                  borderRadius: "13%",
                                  marginRight: "4px", // Add spacing between buttons
                                  "&:hover": {
                                    background: "#22b378",
                                    color: "white",
                                  },
                                }}
                              >
                                <CheckIcon
                                  sx={{ fontSize: "14px", color: "white" }}
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={handleEditCancel}
                                sx={{
                                  padding: "2px",
                                  background: "#feedee",
                                  borderRadius: "13%",
                                  "&:hover": {
                                    background: "#f7525a",
                                    color: "white",
                                  },
                                }}
                              >
                                <CloseIcon
                                  sx={{
                                    fontSize: "14px",
                                    color: "#f7525a",
                                    "&:hover": {
                                      color: "white",
                                    },
                                  }}
                                />
                              </IconButton>
                            </Box>
                          }
                        >
                          {row.options &&
                            row.options.map((option) => (
                              <MenuItem
                                key={option}
                                value={option}
                                sx={{ fontSize: "13px" }}
                              >
                                {option}
                              </MenuItem>
                            ))}
                        </Select>
                      ) : (
                        <TextField
                          value={editValues[row.id] || ""}
                          onChange={(e) => handleEditChange(e, row.id)}
                          size="small"
                          fullWidth
                          variant="outlined"
                          sx={{
                            fontSize: "12px",
                            ".MuiOutlinedInput-root": {
                              fontSize: "13px",
                              height: "36px",
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditSave(row.id)}
                                  sx={{ padding: "2px" }}
                                >
                                  <CheckIcon
                                    sx={{
                                      fontSize: "18px",
                                      color: "#4caf50",
                                    }}
                                  />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={handleEditCancel}
                                  sx={{ padding: "2px" }}
                                >
                                  <CloseIcon
                                    sx={{
                                      fontSize: "18px",
                                      color: "#f44336",
                                    }}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        p: 1,
                        "&:hover": {
                          bgcolor: row.editable ? "#f1f1fa" : "inherit",
                        },
                      }}
                    >
                      {row.isDisabled && (
                        <FiberManualRecordIcon
                          sx={{
                            fontSize: "8px",
                            color: "#F7525A",
                            mr: 0.5,
                            display: "inline-flex",
                            verticalAlign: "middle",
                          }}
                        />
                      )}

                      {row.isEnabled && (
                        <FiberManualRecordIcon
                          sx={{
                            fontSize: "8px",
                            color: "#22B378",
                            mr: 0.5,
                            display: "inline-flex",
                            verticalAlign: "middle",
                          }}
                        />
                      )}

                      {row.isLink ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {row.icon}
                          <Link
                            href={
                              row.value.startsWith("http")
                                ? row.value
                                : `https://${row.value}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              fontSize: "13px",
                              color: "#1976d2",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {row.value}
                          </Link>
                        </Box>
                      ) : (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "13px",
                              color: row.isPending
                                ? "#666666"
                                : row.value === "Enabled"
                                ? "#22B378"
                                : row.value === "Disabled"
                                ? "#F7525A"
                                : "#212121",
                              fontWeight: 500,
                            }}
                          >
                            {row.value !== "" ? row.value : "Yet to be updated"}
                          </Typography>
                          {row.hasSettings && hoveredRow === row.id && (
                            <Typography
                              variant="bottom"
                              size="small"
                              sx={{
                                position: "absolute",
                                right: -8,
                                // padding: "4px",
                                color: "#666666",
                              }}
                              title="Configure the customer portal access"
                            >
                              <SettingsIcon sx={{ fontSize: "16px" }} />
                            </Typography>
                          )}
                        </>
                      )}

                      {/* Show edit icon on hover for editable rows */}
                      {row.editable && hoveredRow === row.id && (
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            right: -8,
                            color: "#666666",
                          }}
                          onClick={() =>
                            row.type === "dialog"
                              ? handleTaxPreferenceClick()
                              : handleEditClick(row)
                          }
                        >
                          <EditIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                      )}

                      {/* Show settings icon for portal status */}
                    </Box>
                  )}
                </Grid>
              </Grid>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Tax Information Section */}
        <Accordion sx={{ border: 0, boxShadow: "none", background: "none" }}>
          <AccordionSummary
            expandIcon={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* <AddIcon
                  sx={{
                    fontSize: "16px",
                    color: "#2196f3",
                    mr: 0.5,
                  }}
                /> */}
                <ExpandMoreIcon color="primary" sx={{ fontSize: "18px" }} />
              </Box>
            }
            sx={{ p: 0 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#444444",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              TAX INFORMATION
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {details?.gst_no && (
              <Grid
                container
                sx={{
                  py: 1.5,
                  position: "relative",
                }}
              >
                <Grid item xs={5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#757575",
                      fontSize: "13px",
                    }}
                  >
                    GSTIN / UIN
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  {details?.gst_no}
                </Grid>
              </Grid>
            )}
            {details?.place_of_contact && (
              <Grid
                container
                sx={{
                  py: 1.5,
                  position: "relative",
                }}
              >
                <Grid item xs={5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#757575",
                      fontSize: "13px",
                    }}
                  >
                    Place of Supply
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  {details?.place_of_contact}
                </Grid>
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Contact Persons Section */}
        <Accordion sx={{ border: 0, boxShadow: "none", background: "none" }}>
          <AccordionSummary
            expandIcon={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AddIcon
                  sx={{
                    fontSize: "16px",
                    color: "#2196f3",
                    mr: 0.5,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion toggle
                    handleOpenContactPersonPopup();
                  }}
                />
                <ExpandMoreIcon color="primary" sx={{ fontSize: "18px" }} />
              </Box>
            }
            sx={{ p: 0 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#444444",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              CONTACT PERSON
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <ContactPersonList
              contactPersons={details?.contact_persons}
              handleDelete={handleDelete}
              handleOpenMenu={handleOpenContactMenu}
              handleInvite={handleInviteToPortal}
              handleAPI={callAPI}
            />
          </AccordionDetails>
        </Accordion>

        {/* Menu for Contact Person actions */}
        {/* <Menu
          id="contact-menu"
          anchorEl={contactMenuAnchorEl}
          keepMounted
          open={Boolean(contactMenuAnchorEl)}
          onClose={handleCloseContactMenu}
          PaperProps={{
            sx: {
              border: '1px solid #e0e0e0',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
              width: '180px',
              maxHeight: '200px',
              borderRadius: '4px',
              mt: 1,
            },
          }}
        >
          <MenuItem onClick={() => handleMenuOption('edit')} sx={menuItemStyles}>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" primaryTypographyProps={{ fontSize: '13px' }} />
          </MenuItem>
          
          <MenuItem onClick={() => handleMenuOption('primary')} sx={menuItemStyles}>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <CheckIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Make Primary" primaryTypographyProps={{ fontSize: '13px' }} />
          </MenuItem>
          
          <MenuItem onClick={() => handleMenuOption('email')} sx={menuItemStyles}>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Send Email" primaryTypographyProps={{ fontSize: '13px' }} />
          </MenuItem>
          
          <MenuItem onClick={() => handleMenuOption('delete')} sx={menuItemStyles}>
            <ListItemIcon sx={{ minWidth: '30px', color: '#f44336' }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" primaryTypographyProps={{ fontSize: '13px', color: '#f44336' }} />
          </MenuItem>
        </Menu> */}

        {/* Record Info Section */}
        <Accordion sx={{ border: 0, boxShadow: "none", background: "none" }}>
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon color="primary" sx={{ fontSize: "18px" }} />
            }
            sx={{ p: 0 }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#444444",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              RECORD INFO
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              {moduleKey === "Customer" ? "Customer ID" : "Vendor ID"}:{" "}
              {details?.contact_id} <br />
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", marginTop: "10px" }}
            >
              Created on: {formatDate(details?.createdAt)}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Contact Person Popup */}
        {isContactPersonPopupOpen && (
          <ContactPersonPopup
            open={isContactPersonPopupOpen}
            onClose={() => handleCloseContactPersonPopup(details?.contact_id)}
            initialData={editingContact}
            contact_id={details?.contact_id}
            primary={isPrimary}
          />
        )}
      </Grid>

      {/* Financials and Other Sections */}
      <Grid item xs={12} md={8}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#363636",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            You can request your contact to directly update the GSTIN by sending
            an email.
            <Link
              href={`/common/customerEmail?org_id=${
                localStorage.getItem("organization_id") || ""
              }&contact_id=${details?.contact_id || ""}&email_type=${
                moduleKey || "Customer"
              }`}
              color="#408dfb"
              underline="hover"
              sx={{
                fontSize: "13px",
                fontWeight: 300,
                // marginLeft: "20px",
              }}
            >
              Send Email
            </Link>
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#757575",
              fontSize: "13px",
              mb: 0.5,
            }}
          >
            Payment due period
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "13px",
              pl: 0.7,
            }}
          >
            {details?.payment_terms_label}
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {moduleKey === "Customer" ? "Receivables" : "Payables"}
          </Typography>
          <TableContainer sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "12px", fontWeight: 500 }}>
                    CURRENCY
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    OUTSTANDING RECEIVABLES
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    UNUSED CREDITS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontSize: "13px" }}>
                    INR- Indian Rupee
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "13px" }}>
                    
                    {moduleKey === "Customer"
                      ? details?.total_receivable_amount_formatted
                      : details?.total_payable_amount_formatted}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "13px" }}>
                    ₹
                    {moduleKey === "Customer"
                      ? details?.unused_credits_receivable_amount
                      : details?.unused_retainer_payments}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Link
            href="#"
            color="primary"
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              handleOpen();
            }}
            sx={{
              mt: 1,
              display: "block",
              fontSize: "13px",
              pl: 2,
            }}
          >
            Enter Opening Balances
          </Link>

          <Dialog
            open={popupOpen}
            onClose={handleClose}
            hideBackdrop
            disableScrollLock
            PaperProps={{
              sx: {
                position: "fixed",
                top: "420px",
                left: "850px",
                width: "400px",
                height: details?.opening_balance_amount ? "270px" : "220px",
                borderRadius: 1,
                boxShadow: 3,
                zIndex: 100,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography sx={{ fontSize: "17px" }} fontWeight="500">
                Edit Opening Balance
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: "#d62134" }}>
                <CloseIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            </Box>

            <DialogContent
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Opening Balance Input */}
              <Box sx={{ mb: 2, display: "flex" }}>
                <Typography
                  component="label"
                  htmlFor="opening_balance_amount"
                  sx={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "text.primary",
                    display: "block",
                    mb: 1,
                    width: "180px",
                  }}
                >
                  Opening Balance
                </Typography>
                <TextField
                  id="opening_balance_amount"
                  fullWidth
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ width: "250px", fontSize: "12px" }}
                  inputProps={{ sx: { py: 0.6 } }}
                />
              </Box>

              {/* Outstanding Balance - show only if exists */}
              {details?.opening_balance_amount ? (
                <Box sx={{ mb: 2, display: "flex" }}>
                  <Typography
                    component="label"
                    htmlFor="outstanding_balance_amount"
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "text.primary",
                      display: "block",
                      mb: 1,
                      width: "180px",
                    }}
                  >
                    Outstanding Opening Balance
                  </Typography>
                  <Typography sx={{ width: "250px", fontSize: "12px" }}>
                    {details?.opening_balance_amount}
                  </Typography>
                </Box>
              ) : null}

              <Box sx={{ flexGrow: 2 }} />
              <Divider sx={{ width: "100%" }} />
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={async () => {
                    await handleUpdateCustomerDetail(
                      "opening_balance_amount",
                      openingBalance
                    );
                    handleClose();
                  }}
                  sx={{
                    bgcolor: "#4285f4",
                    fontSize: "12px",
                    padding: "5px",
                    "&:hover": {
                      bgcolor: "#3367d6",
                    },
                    textTransform: "none",
                    mt: "12px",
                  }}
                >
                  Save
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Income{" "}
              <span style={{ color: "#757575", fontSize: "12px" }}>
                {" "}
                This chart is displayed in the organizations base currency.
              </span>
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                size="small"
                sx={{
                  mr: 1,
                  fontSize: "12px",
                  color: "#363636",
                  padding: "4px 8px",
                }}
                endIcon={<ArrowDropDownIcon />}
              >
                Last 6 Months
              </Button>
              <Button
                size="small"
                sx={{
                  fontSize: "12px",
                  color: "#363636",
                  padding: "4px 8px",
                }}
                endIcon={<ArrowDropDownIcon />}
              >
                Accrual
              </Button>
            </Box>
          </Box>

          {/* Use the animated bar chart component */}
          <AnimatedBarChart data={incomeData} />

          <Typography
            variant="body2"
            sx={{
              fontSize: "13px",
            }}
          >
            Total Income (Last 6 Months) -{" "}
            <span style={{ fontWeight: "bold" }}>₹0.00</span>
          </Typography>
        </Box>
      </Grid>

      {/* Tax Preference Dialog */}
      <Dialog
        open={taxDialogOpen}
        onClose={handleTaxDialogClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "4px",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#f44336",
            }}
          >
            Configure Tax Preferences
          </Typography>
          <IconButton size="small" onClick={handleTaxDialogClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 2 }}>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: "14px",
                color: "#f44336",
                "&.Mui-focused": { color: "#f44336" },
              }}
            >
              Tax Preference*
            </FormLabel>
            <RadioGroup
              defaultValue="Taxable"
              name="tax-preference-group"
              sx={{ flexDirection: "row", mt: 1 }}
            >
              <FormControlLabel
                value="Taxable"
                control={
                  <Radio
                    sx={{
                      color: "#2196f3",
                      "&.Mui-checked": {
                        color: "#2196f3",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "14px" }}>Taxable</Typography>
                }
              />
              <FormControlLabel
                value="Tax Exempt"
                control={
                  <Radio
                    sx={{
                      color: "#2196f3",
                      "&.Mui-checked": {
                        color: "#2196f3",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "14px" }}>Tax Exempt</Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            borderTop: "1px solid rgba(224, 224, 224, 0.5)",
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#2196f3",
              textTransform: "none",
              mr: 1,
              "&:hover": {
                bgcolor: "#1976d2",
              },
            }}
            onClick={handleTaxDialogClose}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#757575",
              borderColor: "#757575",
              textTransform: "none",
              "&:hover": {
                borderColor: "#363636",
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            onClick={handleTaxDialogClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      {/* <Snackbar 
        open={alertOpen} 
        autoHideDuration={5000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar> */}
    </Grid>
  );
};

export default Overview;
