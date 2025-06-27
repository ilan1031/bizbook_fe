"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Divider,
  Select,
  MenuItem,
  Collapse,
  FormControlLabel,
  Checkbox,
  FormControl,
  Grid,
  InputBase,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link as LinkIcon,
  AttachFile,
  Email as EmailIcon,
  Search as SearchIcon,
  AddCircle,
  StrikethroughS,
  FormatListBulleted,
  FormatIndentDecrease,
  ImageOutlined,
} from "@mui/icons-material";
import {
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import { useSearchParams, useRouter } from "next/navigation";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import DotLoader from "../../../components/DotLoader";
import CloseIcon from "@mui/icons-material/Close";
import ContactPersonPopup from "../ContactPersonPopup";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ==================== EMAIL COMPOSER COMPONENT ====================
const EmailComposer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL params and query params
  const recipientId = searchParams.get("contact_id") || "";
  const orgId =
    searchParams.get("org_id") || localStorage.getItem("organization_id") || "";
  const recipientEmail = searchParams.get("email") || "";
  const recipientName = searchParams.get("name") || "";
  const vendorType = searchParams.get("email_type");

  // State for the editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef(null);

  // Form fields
  const [subject, setSubject] = useState("");
  const [fromEmail, setFromEmail] = useState(""); // This will still be set in the background
  const [toRecipient, setToRecipient] = useState(recipientEmail);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [attachDocument, setAttachDocument] = useState(false);
  const [documentType, setDocumentType] = useState(""); // For attaching PO or SO
  const [selectedTo, setSelectedTo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  // UI states
  const [fontSize, setFontSize] = useState("13px");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromEmails, setFromEmails] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recipientDetails, setRecipientDetails] = useState(null);

  // State for contact person emails
  const [contactPersonEmails, setContactPersonEmails] = useState([]);

  // Custom dropdown states
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const [loadingEmail, setLoadingEmail] = useState(true);

  // Filtered contacts based on search query
  const filteredContacts = contactPersonEmails.filter((contact) => {
    const searchTerm = contactSearchQuery.toLowerCase();
    const nameMatch = contact.name?.toLowerCase().includes(searchTerm);
    const emailMatch = contact.email.toLowerCase().includes(searchTerm);
    return nameMatch || emailMatch;
  });

  // Set default values for organization emails
  const setDefaultEmails = () => {
    const defaultEmail = localStorage.getItem("email") || "";
    setFromEmails([{ email: defaultEmail }]);
    setFromEmail(defaultEmail);
  };

  // Set default values for recipient
  const setDefaults = () => {
    // Implementation remains as is
  };

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowContactDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch organization emails and set the default sender email (now hidden from UI)
  useEffect(() => {
    const fetchUserEmails = async () => {
      if (!orgId) return setDefaultEmails();
      setLoadingEmail(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/organization/${orgId}`,
        });
        setFromEmails(response?.data?.data);
        setFromEmail(response?.data?.data?.email); // Set the default from email
        setTimeout(() => {
          setLoadingEmail(false);
        }, 2000);
      } catch (err) {
        setDefaultEmails();
        setLoadingEmail(false);
      }
    };
    fetchUserEmails();
  }, [orgId]);

  // Fetch recipient details and contact person emails
  useEffect(() => {
    const fetchRecipientDetails = async () => {
      if (!(recipientId && orgId)) return setDefaults();
      const endpoint = `/api/v1/contact/${recipientId}?organization_id=${orgId}`;
      try {
        const response = await apiService({
          method: "GET",
          url: endpoint,
        });

        const data = response.data.data;
        setRecipientDetails(data);
        setDocumentType(
          vendorType === "vendor" ? "purchaseorder" : "salesorder"
        );

        // Additionally fetch contact person details to get emails
        try {
          const contactPersonResponse = await apiService({
            method: "GET",
            url: `/api/v1/contact-person/${recipientId}`,
          });

          if (contactPersonResponse?.data?.data) {
            // Check if the response is an array or single object
            const contactData = Array.isArray(contactPersonResponse.data.data)
              ? contactPersonResponse.data.data
              : [contactPersonResponse.data.data];

            // Filter contacts with valid emails
            const validContacts = contactData.filter(
              (contact) => contact.email && EMAIL_REGEX.test(contact.email)
            );

            if (validContacts.length > 0) {
              setContactPersonEmails(validContacts);

              // If we have contacts with emails and no email was set from URL params
              const contact = validContacts.find(
                (contact) => contact.is_primary_contact
              );
              if (contact) {
                setSelectedTo([contact.contact_person_id]);
              }
            }
          }
        } catch (contactError) {
          console.error("Error fetching contact person details:", contactError);
        }
      } catch (error) {
        setDefaults();
      }
    };

    fetchRecipientDetails();
  }, [recipientId, orgId, recipientEmail]);

  // Focus the editor when clicked
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Toggle inline styles (bold, italic, etc.)
  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Toggle block types (alignment)
  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  // Handle font size change
  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };

  // Handle file attachments
  const handleAttachment = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prevAttachments) =>
      prevAttachments ? [...prevAttachments, ...files] : [...files]
    );
  };

  // Check if an email is valid
  const isValidEmail = (email) => {
    return EMAIL_REGEX.test(email);
  };

  // Handle send email
  const handleSend = async () => {
    try {
      // Validate inputs - fromEmail is still required but not visible to user
      if (!fromEmail || !selectedTo || !subject) {
        setError("Recipient and subject are required fields.");
        return;
      }

      // if (!isValidEmail(selectedTo)) {
      //   setError("Please provide a valid recipient email address.");
      //   return;
      // }

      // Validate CC recipients
      if (ccRecipients.length > 0) {
        const invalidCc = ccRecipients.some((email) => !isValidEmail(email));
        if (invalidCc) {
          setError("One or more CC email addresses are invalid.");
          return;
        }
      }

      // Validate BCC recipients
      if (bccRecipients.length > 0) {
        const invalidBcc = bccRecipients.some((email) => !isValidEmail(email));
        if (invalidBcc) {
          setError("One or more BCC email addresses are invalid.");
          return;
        }
      }

      setLoading(true);
      setError("");

      // Get the HTML content from the editor
      const contentState = editorState.getCurrentContent();
      const htmlContent = stateToHTML(contentState);

      // Create form data for attachments
      const formData = new FormData();

      // Add email data - fromEmail is still included even though it's not in the UI
      formData.append("from_email", fromEmail);
      formData.append("to_email", selectedTo
        .map(
          (id) => contactPersonEmails.find((c) => c.contact_person_id === id)?.email
        )
        .join(", "));
      formData.append("subject", subject);
      formData.append("body", htmlContent);
      formData.append("organization_id", orgId);
      formData.append("email_type", vendorType);

      // Add CC and BCC
      if (ccRecipients.length > 0) {
        formData.append("cc_emails", ccRecipients.join(","));
      }

      if (bccRecipients.length > 0) {
        formData.append("bcc_emails", bccRecipients.join(","));
      }

      formData.append("contact_id", recipientId);

      // Document details
      if (attachDocument && documentType) {
        formData.append("order_type", documentType);
        formData.append("attach_document", "true");
      }

      // Attach files
      if (attachments?.length > 0) {
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      // Send using apiService
      const response = await apiService({
        method: "POST",
        url: "/api/v1/email/po-email/send",
        customBaseUrl: config.PO_Base_url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status === true) {
        setSuccess("Email sent successfully!");
        resetForm();
        if (vendorType === "Vendor") {
          window.location.href = `/sales/customer/${recipientId}`;
        } else {
          window.location.href = `/sales/vendor/${recipientId}`;
        }
      } else {
        setError(response.data?.message || "Failed to send email");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to send email"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset the form after sending
  const resetForm = () => {
    setEditorState(EditorState.createEmpty());
    setSubject("");
    setToRecipient("");
    setCcRecipients([]);
    setBccRecipients([]);
    setAttachDocument(false);
    setAttachments([]);
  };

  // Check if a style is active
  const isStyleActive = (style) => {
    return editorState.getCurrentInlineStyle().has(style);
  };

  // Check if a block type is active
  const isBlockActive = (blockType) => {
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const block = editorState.getCurrentContent().getBlockForKey(blockKey);
    return block.getType() === blockType;
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  // Handle closing the popup and updating contacts
  const handleClosePopup = (newContact) => {
    setOpenPopup(false);
    if (newContact) {
      setContactPersonEmails((prevContacts) => [...prevContacts, newContact]);
    }
  };

  const handleSearchChange = (e) => {
    e.stopPropagation();
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
  };

  // Custom styling
  const styles = {
    emailContainer: { maxWidth: 950, margin: 2, marginTop: "90px" },
    emailContainerEditor: { borderRadius: 1, border: "1px solid #eee" },
    header: {
      padding: "16px",
      paddingBottom: "8px",
      fontWeight: "bold",
      fontSize: "18px",
    },
    formGroup: {
      display: "flex",
      padding: "8px 16px",
      borderBottom: "1px solid #e0e0e0",
      alignItems: "center",
    },
    formLabel: {
      width: "55px",
      color: "#666",
      fontSize: "13px",
      fontWeight: 400,
    },
    formControl: {
      flex: 1,
      "& .MuiInputBase-input": { fontSize: "13px", padding: "2px 0" },
    },
    inlineLink: {
      color: "#1976d2",
      fontSize: "13px",
      marginLeft: "8px",
      cursor: "pointer",
      textDecoration: "none",
      fontWeight: 400,
    },
    editorToolbar: {
      padding: "4px 16px",
      borderBottom: "1px solid #dddfe9",
      color: "#000",
      fontWeight: "600",
      backgroundColor: "#f3f4f8",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      flexWrap: "wrap",
      "& .MuiSelect-select": { fontSize: "13px" },
      "& .MuiIconButton-root": { padding: "4px" },
    },
    editorContainer: {
      padding: "16px",
      minHeight: "250px",
      borderBottom: "1px solid #e0e0e0",
    },
    editor: {
      minHeight: "200px",
      cursor: "text",
      fontSize: fontSize,
      fontFamily: '"Inter", "Source Sans Pro", Helvetica, Arial, sans-serif',
    },
    footer: {
      padding: "4px 8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px dashed #eee",
      color: "#408dfb",
    },
    attachmentChip: {
      display: "flex",
      alignItems: "center",
      margin: "8px 0px",
      justifyContent: "space-between",
      padding: "4px 8px",
      backgroundColor: "#f3f8fe !important",
      borderRadius: "4px",
      fontSize: "13px",
      "& .MuiFormControlLabel-label": {
        fontSize: "13px",
      },
      "& .MuiTextField-root": {
        marginLeft: "auto",
        "& .MuiInputBase-root": {
          fontSize: "13px",
          "&:before, &:after": {
            display: "none",
          },
        },
      },
    },
    buttonBar: {
      padding: "16px",
      display: "flex",
      justifyContent: "flex-start",
      gap: "8px",
      "& .MuiButton-root": { fontSize: "13px", padding: "6px 16px" },
    },
    select: { fontSize: "13px", "& .MuiSelect-select": { padding: "2px 0" } },
  };

  const buttonSx = {
    fontWeight: 500,
    color: "#000",
    px: 0.75,
    "&:hover": { background: "transparent" },
  };

  const iconSx = {
    fontSize: "19px",
  };

  const dividerSx = {
    mx: 0.5,
    borderColor: "#e0e0e0",
  };

  const selectSx = {
    minWidth: 70,
    height: 34,
    px: 0.5,
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none !important",
    },
    "& .MuiSelect-select": {
      padding: "4px 8px",
      fontWeight: 600,
      color: "#000",
    },
  };

  return (
    <>
      {!loadingEmail ? (
        <Box
          sx={{
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          {/* Header */}
          <Grid
            container
            sx={{
              pr: 3,
              height: "70px",
              backgroundColor: "white",
              position: "fixed",
              boxShadow: "0px 4px 4px rgba(29, 29, 29, 0.02)",
              borderBottom: "1px solid #eee",
              px: 1, // Horizontal padding
              py: 3, // Vertical padding
              zIndex: 1000,
            }}
          >
            <Grid
              container
              item
              xs={12}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h5"
                sx={{ display: "flex", alignItems: "center" }}
              >
                Email To{" "}
                {recipientDetails?.contact_name ||
                  (vendorType === "vendor" ? "Customer" : "Vendor")}
              </Typography>
            </Grid>
            <Divider />
          </Grid>

          <Box sx={styles.emailContainer}>
            {/* Error and Success Messages */}
            {error && (
              <Box sx={{ ...styles.alert, ...styles.errorAlert }}>{error}</Box>
            )}
            {success && (
              <Box sx={{ ...styles.alert, ...styles.successAlert }}>
                {success}
              </Box>
            )}

            <Box sx={styles.emailContainerEditor}>
              {/* To */}
              <Box sx={styles.formGroup}>
                <Box sx={styles.formLabel}>Send To</Box>
                <Box
                  sx={styles.formControl}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  
                  <FormControl
                    fullWidth
                    variant="standard"
                    sx={{
                      "& .MuiInputBase-root:before, & .MuiInputBase-root:after":
                        {
                          display: "none", // remove underlines
                        },
                    }}
                  >
                    <Select
                      multiple
                      value={selectedTo}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                        >
                          {selected.map((value) => {
                            const contact = contactPersonEmails.find(
                              (c) => c.contact_person_id === value
                            );
                            if (!contact) return null;

                            const name = `${contact.salutation || ""} ${
                                  contact.first_name || ""
                                } ${contact.last_name || ""}`.trim();
                            const email = contact.email;
                            const initialName = `${
                                contact.first_name || ""
                              } ${contact.last_name || ""}`.trim();
                            const initial = initialName[0] || email?.[0];

                            return (
                              <Box
                                key={value}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  px: 1,
                                  py: "3px",
                                  borderRadius: "6px",
                                  backgroundColor: "#f0f2f7",
                                  fontSize: "13px",
                                  gap: "6px",
                                  border: "1px solid #d3d7e2",
                                  '&:hover': {
                                      backgroundColor: "transparent !important",
                                    },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "20%",
                                    backgroundColor: "#dfe3ee",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    border: "1px solid white",
                                    color: "#555",
                                  }}
                                >
                                  {initial.toUpperCase()}
                                </Box>
                                <span>
                                  {name} &lt;{email}&gt;
                                </span>
                                <CloseIcon
                                  sx={{
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    color: "#888",
                                    "&:hover": { color: "#EF5364" },
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation(); // ✅ This is the KEY part for MUI Select
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const updated = selectedTo.filter(
                                      (id) => id !== value
                                    );
                                    setSelectedTo(updated);
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            overflowY: "auto",
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
                                border: "1px solid #F0F0F0",
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
                                  value={searchQuery}
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
                      onChange={(e) => setSelectedTo(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none !important",
                        },
                        "&.MuiInputBase-root": {
                          borderBottom: "none",
                          p: 0,
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "4px",
                        },
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                          padding: "4px 0px",
                        },
                      }}
                    >
                      {contactPersonEmails
  .filter((contact) => {
    const name =`${contact.salutation || ""} ${contact.first_name || ""} ${contact.last_name || ""}`.trim();
    const email = contact.email || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  })
  .map((contact, index) => (
    <MenuItem
      key={index}
      value={contact.contact_person_id}
      sx={{
        fontSize: "13px",
        backgroundColor: selectedTo.includes(contact.contact_person_id)
          ? "#e0f0ff"
          : "inherit",
        "&:hover": {
          backgroundColor: "#e0f0ff",
        },
      }}
    >
      {`${contact.salutation || ""} ${contact.first_name || ""} ${contact.last_name || ""}`.trim()}
      {contact.email && ` (${contact.email})`}
    </MenuItem>
  ))}

                      <MenuItem
                        disableRipple
                        disableTouchRipple
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent Select from closing
                          handleOpenPopup();
                        }}
                        sx={{
                          p: 0,
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            cursor: "pointer",
                            backgroundColor: "#f7f7f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            color: "#408dfb",
                            width: "100%",
                          }}
                        >
                          <AddCircle
                            sx={{ mr: 0.5, fontSize: "18px", color: "#408dfb" }}
                          />
                          <Typography sx={{ fontSize: "13px" }}>
                            Add Contact Person
                          </Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Box
                    onClick={() => setShowCc(!showCc)}
                    sx={styles.inlineLink}
                  >
                    Cc
                  </Box>
                  <Box
                    onClick={() => setShowBcc(!showBcc)}
                    sx={styles.inlineLink}
                  >
                    Bcc
                  </Box>
                </Box>
                <ContactPersonPopup
                    open={openPopup}
                    onClose={handleClosePopup}
                    contact_id={recipientDetails.contact_id}
                    isPrimary={false}
                  />
              </Box>

              {/* Cc */}
              <Collapse in={showCc}>
                <Box sx={styles.formGroup}>
                  <Box sx={styles.formLabel}>Cc</Box>
                  <Box sx={styles.formControl}>
                    <TextField
                      fullWidth
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      value={ccRecipients.join(", ")}
                      onChange={(e) =>
                        setCcRecipients(
                          e.target.value
                            .split(",")
                            .map((email) => email.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="Cc email addresses (comma separated)"
                    />
                  </Box>
                </Box>
              </Collapse>

              {/* Bcc */}
              <Collapse in={showBcc}>
                <Box sx={styles.formGroup}>
                  <Box sx={styles.formLabel}>Bcc</Box>
                  <Box sx={styles.formControl}>
                    <TextField
                      fullWidth
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      value={bccRecipients.join(", ")}
                      onChange={(e) =>
                        setBccRecipients(
                          e.target.value
                            .split(",")
                            .map((email) => email.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="Bcc email addresses (comma separated)"
                    />
                  </Box>
                </Box>
              </Collapse>

              {/* Subject */}
              <Box sx={styles.formGroup}>
                <Box sx={styles.formLabel}>Subject</Box>
                <Box sx={styles.formControl}>
                  <TextField
                    fullWidth
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Box>
              </Box>

              {/* Formatting toolbar */}
              <Box sx={styles.editorToolbar}>
                {/** Bold */}
                <IconButton
                  size="small"
                  onClick={() => toggleInlineStyle("BOLD")}
                  sx={buttonSx}
                >
                  <FormatBold sx={iconSx} />
                </IconButton>

                {/** Italic */}
                <IconButton
                  size="small"
                  onClick={() => toggleInlineStyle("ITALIC")}
                  sx={buttonSx}
                >
                  <FormatItalic sx={iconSx} />
                </IconButton>

                {/** Underline */}
                <IconButton
                  size="small"
                  onClick={() => toggleInlineStyle("UNDERLINE")}
                  sx={buttonSx}
                >
                  <FormatUnderlined sx={iconSx} />
                </IconButton>

                {/** Strikethrough */}
                <IconButton
                  size="small"
                  onClick={() => toggleInlineStyle("STRIKETHROUGH")}
                  sx={buttonSx}
                >
                  <StrikethroughS sx={iconSx} />
                </IconButton>

                <Divider orientation="vertical" flexItem sx={dividerSx} />

                {/** Font Size */}
                <Select
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  size="small"
                  sx={selectSx}
                >
                  {["12px", "13px", "14px", "16px", "18px", "20px"].map(
                    (size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    )
                  )}
                </Select>

                <Divider orientation="vertical" flexItem sx={dividerSx} />

                {/** Bullet List */}
                <IconButton
                  size="small"
                  onClick={() => toggleBlockType("unordered-list-item")}
                  sx={buttonSx}
                >
                  <FormatListBulleted sx={iconSx} />
                </IconButton>

                {/** Indent */}
                <IconButton
                  size="small"
                  onClick={() => toggleBlockType("blockquote")}
                  sx={buttonSx}
                >
                  <FormatIndentDecrease sx={iconSx} />
                </IconButton>

                <Divider orientation="vertical" flexItem sx={dividerSx} />

                {/** Link */}
                <IconButton size="small" sx={buttonSx}>
                  <LinkIcon sx={iconSx} />
                </IconButton>

                {/** Image */}
                <IconButton size="small" sx={buttonSx}>
                  <ImageOutlined sx={iconSx} />
                </IconButton>
              </Box>

              {/* Text editor */}
              <Box sx={styles.editorContainer} onClick={focusEditor}>
                <Box sx={styles.editor}>
                  <Editor
                    ref={editorRef}
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleKeyCommand}
                    placeholder="Compose your email here..."
                    customStyleMap={{
                      BOLD: { fontWeight: "bold" },
                      ITALIC: { fontStyle: "italic" },
                      UNDERLINE: { textDecoration: "underline" },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Attachments Option */}
            <Box sx={styles.attachmentChip}>
              <FormControlLabel
                sx={{ fontSize: "13px" }}
                control={
                  <Checkbox
                    checked={attachDocument}
                    size="small"
                    onChange={(e) => setAttachDocument(e.target.checked)}
                  />
                }
                label={`Attach ${
                  vendorType === "vendor" ? "Sales Order" : "Purchase Order"
                } PDF`}
              />
            </Box>

            {/* File Attachments */}
            {attachments && attachments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {attachments.map((file, index) => (
                  <Box key={index} sx={styles.attachmentChip}>
                    <Typography sx={{ fontSize: "13px" }}>
                      {file.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setAttachments(
                          attachments.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      &times;
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* Add more attachments */}
            <Box sx={styles.footer} >
                <Button
                  component="label"
                  startIcon={<AttachFile fontSize="15px" />}
                  sx={{ fontSize: "12px",textTransform: "none" }}
                >
                  Attachments
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleAttachment}
                  />
                </Button>
                
            </Box>
            
            <Box sx={styles.formGroup}></Box>
            {/* Action buttons */}
            <Box sx={styles.buttonBar}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                sx={{ textTransform: "none" }}
                onClick={handleSend}
                className="button-submitadd"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{ textTransform: "none" }}
                className="bulk-update-btn"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box my={3}>
          <DotLoader />
        </Box>
      )}
    </>
  );
};

// ==================== EMAIL PAGE COMPONENT ====================
// This page will receive the type and id from the URL
const EmailPage = () => {
  return (
    <Box
      sx={{ padding: "0px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}
    >
      <EmailComposer />
    </Box>
  );
};

// ==================== SEND EMAIL BUTTON COMPONENT ====================
// This button can be placed on vendor or vendor detail pages
// Example usage: <SendEmailButton type="vendor" id="123" email="vendor@example.com" name="John Doe" />
const SendEmailButton = ({ type, id, email, name }) => {
  const router = useRouter();
  const orgId = localStorage.getItem("organization_id") || "";

  const handleClick = () => {
    // Construct the URL with all necessary parameters
    const url = `/email/${type}/${id}?org_id=${encodeURIComponent(
      orgId
    )}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;

    // Navigate to the email composer page
    router.push(url);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<EmailIcon />}
      onClick={handleClick}
      size="small"
      sx={{ textTransform: "none" }}
    >
      Send Email
    </Button>
  );
};

// Export all components
// export { EmailComposer, SendEmailButton };
export default EmailPage;
