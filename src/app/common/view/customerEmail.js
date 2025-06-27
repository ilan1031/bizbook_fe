"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  TextField,
  Paper,
  Button,
  IconButton,
  Typography,
  Divider,
  Chip,
  Tooltip,
  Select,
  MenuItem,
  Collapse,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Link as LinkIcon,
  AttachFile,
  ExpandMore,
  ExpandLess,
  Email as EmailIcon,
} from "@mui/icons-material";
import {
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import config from "../../../services/config";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ==================== EMAIL COMPOSER COMPONENT ====================
const EmailComposer = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Get values from URL params and query params
  const recipientType = params.type || "customer"; // 'customer' or 'vendor'
  const recipientId = params.id || "";
  const orgId = searchParams.get("org_id") || localStorage.getItem("organization_id") || "";
  const recipientEmail = searchParams.get("email") || "";
  const recipientName = searchParams.get("name") || "";
  
  console.log(orgId,"-*/*-*/*-*//*--");
  
  
  // State for the editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef(null);

  // Form fields
  const [subject, setSubject] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [toRecipient, setToRecipient] = useState(recipientEmail);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [attachDocument, setAttachDocument] = useState(false);
  const [documentType, setDocumentType] = useState(""); // For attaching PO or SO

  // UI states
  const [fontSize, setFontSize] = useState("16px");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromEmails, setFromEmails] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get user emails on component mount
  useEffect(() => {
    // Fetch user's email addresses from your API or use a default
    const fetchUserEmails = async () => {
      try {
        // Replace with your API call
        // const response = await axios.get(`/api/v1/user/emails?organization_id=${orgId}`);
        // setFromEmails(response.data.data);
        
        // For now, use a placeholder
        setFromEmails([
          { email: "user@example.com", user_name: "Current User" },
          { email: "admin@example.com", user_name: "Admin" }
        ]);
        setFromEmail("user@example.com");
      } catch (error) {
        console.error("Error fetching user emails:", error);
      }
    };

    // Get recipient details if available
    const fetchRecipientDetails = async () => {
      try {
        if (recipientId) {
          // Replace with your API call
          // const endpoint = recipientType === 'customer' 
          //   ? `/api/v1/customers/${recipientId}?organization_id=${orgId}`
          //   : `/api/v1/vendors/${recipientId}?organization_id=${orgId}`;
          // const response = await axios.get(endpoint);
          // const data = response.data.data;   
          
          // If we have recipient email from URL params, use it
          // Otherwise use email from API response
          if (!toRecipient && recipientEmail) {
            setToRecipient(recipientEmail);
          }   
          
          // Set appropriate subject based on recipient type
          const subjectPrefix = recipientType === 'customer' ? 'Information for Customer' : 'Information for Vendor';
          setSubject(`${subjectPrefix} - ${recipientName || recipientId}`);
          
          // Set document type based on recipient
          setDocumentType(recipientType === 'customer' ? 'salesorder' : 'purchaseorder');
        }
      } catch (error) {
        console.error(`Error fetching ${recipientType} details:`, error);
      }
    };

    // Generate default email body
    const generateDefaultEmailBody = () => {
      const greeting = `Dear ${recipientName || 'Valued Partner'},`;
      const closing = `
Best regards,
[Your Name]
[Company Name]`;
      
      const contentState = ContentState.createFromText(`${greeting}\n\n\n${closing}`);
      setEditorState(EditorState.createWithContent(contentState));
    };

    fetchUserEmails();
    fetchRecipientDetails();
    generateDefaultEmailBody();
  }, [orgId, recipientId, recipientType, recipientEmail, recipientName, toRecipient]);

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
      // Validate inputs
      if (!fromEmail || !toRecipient || !subject) {
        setError("From email, recipient, and subject are required fields.");
        return;
      }

      if (!isValidEmail(fromEmail) || !isValidEmail(toRecipient)) {
        setError("Please provide valid email addresses.");
        return;
      }

      setLoading(true);
      setError("");

      // Get the HTML content from the editor
      const contentState = editorState.getCurrentContent();
      const htmlContent = stateToHTML(contentState);

      // Create form data for attachments
      const formData = new FormData();
      
      // Add email data
      formData.append("from_email", fromEmail);
      formData.append("to_email", toRecipient);
      formData.append("subject", subject);
      formData.append("body", htmlContent);
      formData.append("organization_id", orgId);
      
      // Add CC and BCC recipients if any
      if (ccRecipients.length > 0) {
        formData.append("cc_emails", ccRecipients.join(","));
      }
      
      if (bccRecipients.length > 0) {
        formData.append("bcc_emails", bccRecipients.join(","));
      }

      // Add recipient info
      if (recipientType === "customer") {
        formData.append("customer_id", recipientId);
      } else if (recipientType === "vendor") {
        formData.append("vendor_id", recipientId);
      }

      // Set order type if attaching a document
      if (attachDocument && documentType) {
        formData.append("order_type", documentType);
        formData.append("attach_document", "true");
      }

      // Add attachments
      if (attachments && attachments.length > 0) {
        attachments.forEach((file, index) => {
          formData.append(`attachments`, file);
        });
      }

      // Send the request
      const response = await axios.post(
        `${config.SO_Base_url}/api/v1/email/po-email/send`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setSuccess("Email sent successfully!");
        // Optionally navigate back
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        setError(response.data.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError(error.response?.data?.message || error.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
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

  // Custom styling
  const styles = {
    emailContainer: {
      maxWidth: 800,
      margin: 2,
      my: 3,
      marginTop: "80px", // Added to accommodate fixed header
    },
    emailContainerEditor: {
      borderRadius: 1,
      border: "1px solid #eee",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
    },
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
      "& .MuiInputBase-input": {
        fontSize: "13px",
        padding: "2px 0",
      },
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
      padding: "8px 16px",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      flexWrap: "wrap",
      "& .MuiSelect-select": {
        fontSize: "13px",
      },
      "& .MuiIconButton-root": {
        padding: "4px",
      },
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
    },
    footer: {
      padding: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
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
      "& .MuiButton-root": {
        fontSize: "13px",
        padding: "6px 16px",
      },
    },
    select: {
      fontSize: "13px",
      "& .MuiSelect-select": {
        padding: "2px 0",
      },
    },
    alert: {
      padding: "10px 16px",
      borderRadius: "4px",
      marginBottom: "16px",
      fontSize: "14px",
    },
    errorAlert: {
      backgroundColor: "#ffebee",
      color: "#c62828",
    },
    successAlert: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },
  };

  return (
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
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "white",
          boxShadow: "0px 4px 4px rgba(29, 29, 29, 0.02)",
          borderBottom: "1px solid #eee",
          px: 3, // Horizontal padding
          py: 1, // Vertical padding
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
            Email To {recipientName || recipientType === "customer" ? "Customer" : "Vendor"}
          </Typography>
        </Grid>
        <Divider />
      </Grid>

      <Box sx={styles.emailContainer}>
        {/* Error and Success Messages */}
        {error && (
          <Box sx={{...styles.alert, ...styles.errorAlert}}>
            {error}
          </Box>
        )}
        {success && (
          <Box sx={{...styles.alert, ...styles.successAlert}}>
            {success}
          </Box>
        )}

        <Box sx={styles.emailContainerEditor}>
          {/* From */}
          <Box sx={styles.formGroup}>
            <Box sx={styles.formLabel}>From</Box>
            <Box sx={styles.formControl}>
              {fromEmails && fromEmails.length > 0 ? (
                <FormControl fullWidth variant="standard">
                  <Select
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    disableUnderline
                    sx={styles.select}
                  >
                    {fromEmails.map((email, index) => (
                      <MenuItem key={index} value={email.email}>
                        {email.user_name || ""} ({email.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="Your email address"
                />
              )}
            </Box>
          </Box>

          {/* To */}
          <Box sx={styles.formGroup}>
            <Box sx={styles.formLabel}>Send To</Box>
            <Box
              sx={styles.formControl}
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                fullWidth
                variant="standard"
                InputProps={{ disableUnderline: true }}
                value={toRecipient}
                onChange={(e) => setToRecipient(e.target.value)}
                placeholder="Recipient email address"
              />
              <Box onClick={() => setShowCc(!showCc)} sx={styles.inlineLink}>
                Cc
              </Box>
              <Box onClick={() => setShowBcc(!showBcc)} sx={styles.inlineLink}>
                Bcc
              </Box>
            </Box>
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
                    setCcRecipients(e.target.value.split(",").map(email => email.trim()).filter(Boolean))
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
                    setBccRecipients(e.target.value.split(",").map(email => email.trim()).filter(Boolean))
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
                placeholder="Email subject"
              />
            </Box>
          </Box>

          {/* Formatting toolbar */}
          <Box sx={styles.editorToolbar}>
            <Select
              value={fontSize}
              onChange={handleFontSizeChange}
              size="small"
              sx={{ minWidth: 70, height: 34 }}
            >
              <MenuItem value="12px">12px</MenuItem>
              <MenuItem value="13px">13px</MenuItem>
              <MenuItem value="14px">14px</MenuItem>
              <MenuItem value="16px">16px</MenuItem>
              <MenuItem value="18px">18px</MenuItem>
              <MenuItem value="20px">20px</MenuItem>
            </Select>

            <IconButton
              size="small"
              onClick={() => toggleInlineStyle("BOLD")}
              color={isStyleActive("BOLD") ? "primary" : "default"}
            >
              <FormatBold />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => toggleInlineStyle("ITALIC")}
              color={isStyleActive("ITALIC") ? "primary" : "default"}
            >
              <FormatItalic />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => toggleInlineStyle("UNDERLINE")}
              color={isStyleActive("UNDERLINE") ? "primary" : "default"}
            >
              <FormatUnderlined />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => toggleBlockType("left-align")}
              color={isBlockActive("left-align") ? "primary" : "default"}
            >
              <FormatAlignLeft />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => toggleBlockType("center-align")}
              color={isBlockActive("center-align") ? "primary" : "default"}
            >
              <FormatAlignCenter />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => toggleBlockType("right-align")}
              color={isBlockActive("right-align") ? "primary" : "default"}
            >
              <FormatAlignRight />
            </IconButton>

            <IconButton size="small">
              <LinkIcon />
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
                  BOLD: { fontWeight: 'bold' },
                  ITALIC: { fontStyle: 'italic' },
                  UNDERLINE: { textDecoration: 'underline' },
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
            label={`Attach ${recipientType === "customer" ? "Sales Order" : "Purchase Order"} PDF`}
          />
        </Box>

        {/* File Attachments */}
        {attachments && attachments.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {attachments.map((file, index) => (
              <Box key={index} sx={styles.attachmentChip}>
                <Typography sx={{ fontSize: "13px" }}>{file.name}</Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setAttachments(attachments.filter((_, i) => i !== index));
                  }}
                >
                  &times;
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Add more attachments */}
        <Box sx={styles.footer}>
          <Box>
            <Button
              component="label"
              startIcon={<AttachFile />}
              sx={{ fontSize: "12px" }}
            >
              Add Attachments
              <input type="file" hidden multiple onChange={handleAttachment} />
            </Button>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={styles.buttonBar}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// ==================== EMAIL PAGE COMPONENT ====================
// This page will receive the type and id from the URL
const EmailPage = () => {
  return (
    <Box sx={{ padding: "0px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <EmailComposer />
    </Box>
  );
};

// ==================== SEND EMAIL BUTTON COMPONENT ====================
// This button can be placed on customer or vendor detail pages
// Example usage: <SendEmailButton type="customer" id="123" email="customer@example.com" name="John Doe" />
const SendEmailButton = ({ type, id, email, name }) => {
  const router = useRouter();
  const orgId = localStorage.getItem("organization_id") || "";
  
  const handleClick = () => {
    // Construct the URL with all necessary parameters
    const url = `/email/${type}/${id}?org_id=${encodeURIComponent(orgId)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    
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
export { EmailComposer, SendEmailButton };
export default EmailPage;