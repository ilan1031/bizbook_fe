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
  InputAdornment,
  FormControlLabel,
  Checkbox,
  FormControl,
  Grid,
  ListSubheader,
  InputBase,
  Paper,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link as LinkIcon,
  AttachFile,
  AddCircle,
  StrikethroughS,
  FormatListBulleted,
  FormatIndentDecrease,
  ImageOutlined,
} from "@mui/icons-material";
import {
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  Modifier,
} from "draft-js";
import { convertFromHTML } from "draft-convert";
import { stateToHTML } from "draft-js-export-html";

import "draft-js/dist/Draft.css";
import { useParams, usePathname, useRouter } from "next/navigation";
import apiService from "../../services/axiosService";
import config from "../../services/config";
import { useSnackbar } from "../../../src/components/SnackbarProvider";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DotLoader from "../../components/DotLoader";
import { stateFromHTML } from "draft-js-import-html";
import ContactPersonPopup from "../common/ContactPersonPopup";

const EmailComposer = () => {
  const pathname = usePathname();
  const params = useParams();
  const uniqueId = params.slug;
  const { showMessage } = useSnackbar();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef(null);
  const [subject, setSubject] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [selectedTo, setSelectedTo] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [attachPdf, setAttachPdf] = useState(false);
  const [fontSize, setFontSize] = useState("13px");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [emailData, setEmailData] = useState(null);
  const [fromEmails, setFromEmails] = useState([]);
  const [toContacts, setToContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [organization_id, setOrganizationId] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [attachDocument, setAttachDocument] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const orgId = localStorage.getItem("organization_id") || "";
      setOrganizationId(orgId);
    }
  }, []);

  useEffect(() => {
    if (organization_id) {
      getEmailDetails();
    }
  }, [pathname, organization_id]);

  const getPathEntity = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[2];
  };

  const handleCancel = () => {
    const entityTypeSegment = getPathEntity();
    if (entityTypeSegment === "salesOrder") {
      router.push(`/sales/salesOrder/${uniqueId}`);
    } else if (entityTypeSegment === "purchaseorder") {
      router.push(`/purchase/purchaseorder/${uniqueId}`);
    } else if (entityTypeSegment === "quotes") {
      router.push(`/sales/quotes/${uniqueId}`);
    } else if (entityTypeSegment === "invoices") {
      router.push(`/sales/invoices/${uniqueId}`);
    } else if (
      entityTypeSegment === "payment" ||
      entityTypeSegment === "paymentmade"
    ) {
      router.push(`/purchase/paymentmade/${uniqueId}`);
    }
  };

  // Custom block style for blue background title
  const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === "header-two") {
      return "custom-header-two";
    }
    return "";
  };

  // Custom decorator for red-colored text
  const RedTextDecorator = (props) => {
    return <span style={{ color: "red" }}>{props.children}</span>;
  };

  const decorators = [
    {
      strategy: (contentBlock, callback, contentState) => {
        contentBlock.findStyleRanges(
          (character) => character.getStyle().has("RED"),
          callback
        );
      },
      component: RedTextDecorator,
    },
  ];

  const compositeDecorator = new CompositeDecorator(decorators);

  useEffect(() => {
    setEditorState(EditorState.createEmpty(compositeDecorator));
  }, []);

  // Custom HTML to Draft.js conversion
  const customConvertFromHTML = (html) =>
    convertFromHTML({
      htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === "a" && node.href) {
          return createEntity("LINK", "MUTABLE", { url: node.href });
        }
        return null;
      },
      htmlToBlock: (nodeName) => {
        if (nodeName === "h2") {
          return "header-two"; // Maps <h2> to Draft.js 'header-two' block type
        }
        return null;
      },
      htmlToStyle: (nodeName, node, currentStyle) => {
        if (nodeName === "b" || nodeName === "strong") {
          return currentStyle.add("BOLD"); // Maps <b> or <strong> to 'BOLD'
        }
        if (nodeName === "i" || nodeName === "em") {
          return currentStyle.add("ITALIC"); // Maps <i> or <em> to 'ITALIC'
        }
        if (node.style && node.style.color === "red") {
          return currentStyle.add("RED"); // Maps red-colored text to 'RED'
        }
        return currentStyle;
      },
    })(html);

  const getEmailDetails = async () => {
    try {
      setLoading(true);
      const entityTypeSegment = getPathEntity();
      let url, customBaseUrl;

      if (entityTypeSegment === "salesOrder") {
        url = `/api/v1/salesorders/${uniqueId}/email?organization_id=${organization_id}`;
        customBaseUrl = config.SO_Base_url;
      } else if (entityTypeSegment === "purchaseorder") {
        url = `/api/v1/purchase-orders/email/${uniqueId}?org_id=${organization_id}`;
        customBaseUrl = config.PO_Base_url;
      } else if (
        entityTypeSegment === "payment" ||
        entityTypeSegment === "paymentmade"
      ) {
        url = `/api/v1/payment-email/${uniqueId}?organization_id=${organization_id}`;
        customBaseUrl = config.PO_Base_url;
      } else if (entityTypeSegment === "quotes") {
        url = `/api/v1/estimate/${uniqueId}/email?organization_id=${organization_id}`;
        customBaseUrl = config.SO_Base_url;
      } else if (entityTypeSegment === "invoices") {
        url = `/api/v1/invoice/${uniqueId}/email?organization_id=${organization_id}`;
        customBaseUrl = config.SO_Base_url;
      }

      if (url) {
        const response = await apiService({
          method: "GET",
          url: url,
          customBaseUrl: customBaseUrl,
          file: false,
        });
        const emailDetails = response.data.data;

        setEmailData(emailDetails);
        // Populate email fields
        setSubject(emailDetails.subject || "");
        setFromEmail(emailDetails.from_email || "");
        setToContacts(emailDetails.to_contact || []);

        // Set contacts if available
        if (
          emailDetails.contact_persons &&
          emailDetails.contact_persons.length > 0
        ) {
          setToContacts(emailDetails.contact_persons);
          // Set default recipient if available
          if (emailDetails.default_recipient) {
            setSelectedTo([emailDetails.default_recipient]);
          }
        }

        // Generate Email Body Using the HTML Template
        const htmlContent = generateEmailBody(emailDetails);
        // Convert HTML to Draft.js ContentState
        const contentState = customConvertFromHTML(htmlContent);
        // Set the converted content in the Draft.js editor
        setEditorState(EditorState.createWithContent(contentState));

        // Set status for later use in status updates
        if (emailDetails.status) {
          setStatus(emailDetails.status);
        }
      }

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      showMessage("Error fetching email details. Please try again.", "error");
      setLoading(false);
    }
  };

  const generateEmailBody = (data) => {
    if (!data) return "";

    const entityType = data.entity_type || getPathEntity();

    const orderType =
      entityType === "salesorder" || entityType === "salesOrder"
        ? "Sales Order"
        : entityType === "purchaseorder"
        ? "Purchase Order"
        : entityType === "quotes"
        ? "Quote"
        : entityType === "payment" || entityType === "paymentmade"
        ? "Payment Made"
        : "Invoice";

    // Special case for Payment Made template matching the image
    if (orderType === "Payment Made") {
      const recipientName = data.customer_name || data.vendor_name || "Ram";
      const senderName = fromEmail.split("@")[0] || "Bharathi G";
      const companyName = data.organization_name || "SNSIHUB";
      const paymentAmount =
        data.amount_formatted || data.total_formatted || "₹10,900.00";
      const invoiceNumber = data.invoice_number || data.reference_number || "";
      const vendorBalance = data.vendor_opening_balance || "12012";
      const paymentDate = data.date_formatted || "16/04/2025";

      return `
      <div style="font-family: Arial, sans-serif; padding: 0; margin: 0;">
  <!-- Header -->
  <div style="background-color: #4798f7; color: white; text-align: center; padding: 15px 0; margin-bottom: 20px;">
    <h2 style="margin: 0;">Payment Made</h2>
  </div>

  <!-- Message -->
  <div style="padding: 10px 20px;">
  <div><p>Hi ${recipientName},</p>
    <p style="width: 500px;">
    We have made the payment for your invoice(s).<br>
    It's been a pleasure doing business with you. We look forward to working with you again.
</p>

    </div>
    <!-- Payment Box -->
   <div style="border: 1px solid #e0e0e0; background-color: #fffff8; border-radius: 5px; padding: 20px;">
  <div style="text-align: center;">
    <h3 style="margin: 10px 0; font-weight: bold;">Payment Made - ${paymentAmount}</h3>
    <h3 style="margin: 10px 0; font-weight: bold;">   Payment Date - ${paymentDate}</h3>
  </div>
</div>


    <!-- Footer -->
    <p style="margin: 0;">Regards,</p>
    <p style="margin: 0;">${senderName}</p>
    <p style="margin: 0;">${companyName}</p>
  </div>
</div>

      `;
    } else if (orderType === "Quote" || orderType === "Invoice") {
      // Existing template for Quote/Invoice
      const recipientName =
        data.customer_name || data.vendor_name || "Customer";
      const senderName = fromEmail.split("@")[0] || "Your Name";
      const companyName = data.organization_name || "Your Company";
      const orderNumber =
        data.estimate_number ||
        data.invoice_number ||
        data.payment_number ||
        data.payment_id ||
        "PAY-000000";
      const orderDate = data.date_formatted || "01/01/2025";
      const totalAmount =
        data.total_formatted || data.amount_formatted || "₹0.00";
      const body = `Thank you for contacting us, Please find the ${orderType.toLowerCase()} details below`;
      const dueDate = data.due_date
        ? `<tr>
            <td style="width: 40%; text-align: right; padding-right: 10px; font-weight: bold;">Due Date</td>
            <td>${data.due_date}</td>
          </tr>`
        : "";
      const buttonName =
        // orderType === "Invoice"? "PAY NOW":
        orderType === "Payment" ? "VIEW PAYMENT" : "VIEW QUOTE";

      return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <!-- Greeting -->
        <p style="line-height: 1.6;">Dear ${recipientName},</p></br>
         <!-- Message -->
        <p style="font-size: 25px;margin-left:"12px">${body}</p></br>
        <p style="font-size: 25px; font-weight: bold;"><strong> ${orderType} # : ${orderNumber}</strong></p></br>
        <!-- Horizontal Line -->
        <p style="border-top: 2px solid black; margin: 10px 0;">-----------------------------------------------------------------------------------------------</p>
        <!-- Key Information -->
        <p style="font-size: 25px;"><strong>${orderType} Date </strong>: ${orderDate}</p>
        <p style="font-size: 25px;margin-left:"12px"><strong> ${orderType} Amount </strong>: ${totalAmount}</p>
        <!-- Horizontal Line -->
        <p style="border-top: 2px solid black; margin: 10px 0;">-----------------------------------------------------------------------------------------------</p></br>
        <!-- Closing Message -->
        <p>Assuring you of our best services at all times.</p></br>
        <!-- Closing -->
        <p>Regards,</p>
          <p> ${companyName}</p>
      </div>
      `;
    } else {
      // Existing template for other document types
      const orderNumber =
        data.salesorder_number ||
        data.invoice_number ||
        data.purchaseorder_number ||
        data.estimate_number ||
        data.file_name_without_extension ||
        data.payment_id ||
        "PO-003";
      const orderDate =
        data.date_formatted || data.order_date || data.date || "05/07/2017";
      const amount =
        data.total_formatted ||
        data.amount_formatted ||
        data.amount ||
        data.total ||
        "₹239.95(in INR)";
      const recipientName = data.customer_name || data.vendor_name || "David";
      const senderName = fromEmail.split("@")[0] || "Your Name";
      const companyName = data.organization_name || "Your Company";

      return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <!-- Greeting -->
        <p style="line-height: 1.6;">Dear ${recipientName},</p></br>

        <!-- Message -->
        <p>Thanks for your interest in our services. Please find our ${orderType.toLowerCase()} attached with this mail.</p></br>
        <p> An overview of the ${orderType.toLowerCase()} is available below for your reference:</p>

        <!-- Horizontal Line -->
        <p style="border-top: 2px solid black; margin: 10px 0;">-----------------------------------------------------------------------------------------------</p></br>

        <!-- Order Details -->
        <p style="font-size: 25px; font-weight: bold;"><strong>${orderType} # : ${orderNumber}</strong></p></br>

        <!-- Horizontal Line -->
        <p style="border-top: 2px solid black; margin: 10px 0;">-----------------------------------------------------------------------------------------------</p>

        <!-- Key Information -->
        <p style="font-size: 25px;"><strong>Order Date </strong>: ${orderDate}</p>
        <p style="font-size: 25px;"><strong> Amount </strong>: ${amount}</p>

        <!-- Horizontal Line -->
        <p style="border-top: 2px solid black; margin: 10px 0;">-----------------------------------------------------------------------------------------------</p></br>

        <!-- Closing Message -->
        <p>Assuring you of our best services at all times.</p></br>

        <!-- Closing -->
        <p>Regards,</p></br>
          <p> ${senderName}</p>
          <p> ${companyName}</p>
      </div>
      `;
    }
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };

  const handleAttachment = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prevAttachments) =>
      prevAttachments ? [...prevAttachments, ...files] : [...files]
    );
  };

  const handleSend = async () => {
    try {
      const contentState = editorState.getCurrentContent();
      const entityTypeSegment = getPathEntity();
      const htmlContent = stateToHTML(contentState);
      const orderId = uniqueId;

      // Check if "to" field is populated
      if (!selectedTo.length) {
        showMessage("Please select at least one recipient", "error");
        return;
      }

      // Find the selected contact to get its contact_id
      const selectedContact = toContacts.find(
        (c) => c.contact_person_id === selectedTo[0]
      );
      const contactId =
        selectedContact?.contact_id ||
        emailData?.customer_id ||
        emailData?.vendor_id ||
        "";

      // Prepare the email payload
      const emailPayload = {
        from_email: fromEmail,
        to_email: selectedTo
          .map(
            (id) => toContacts.find((c) => c.contact_person_id === id)?.email
          )
          .filter(Boolean) // Filter out any undefined emails
          .join(", "),
        cc_emails: ccRecipients,
        bcc_emails: bccRecipients,
        subject: subject,
        body: htmlContent,
        orderId: orderId,
        order_type: entityTypeSegment,
        organization_id: organization_id, // Ensure organization_id is included
        attach_pdf: attachPdf,
        email_type: "",
        customer_id: contactId, // Use the contact_id from selected contact
        contact_id: contactId, // Add explicit contact_id field
      };

      // Check if we have a valid "to" email after filtering
      if (!emailPayload.to_email) {
        showMessage("No valid recipient email addresses found", "error");
        return;
      }

      setIsEmailSending(true);
      let url, customBaseUrl;

      // Determine the correct URL and email type based on entity type
      if (
        entityTypeSegment === "salesOrder" ||
        entityTypeSegment === "invoices" ||
        entityTypeSegment === "quotes"
      ) {
        url = `/api/v1/email/send?organization_id=${organization_id}`;
        customBaseUrl = config.SO_Base_url;
        if (entityTypeSegment === "salesOrder") {
          emailPayload.email_type = "Sales Order Notification";
        } else if (entityTypeSegment === "invoices") {
          emailPayload.email_type = "Invoice Notification";
        } else if (entityTypeSegment === "quotes") {
          emailPayload.email_type = "Quotes Notification";
        }
      } else if (
        entityTypeSegment === "purchaseorder" ||
        entityTypeSegment === "payment" ||
        entityTypeSegment === "paymentmade"
      ) {
        url = `/api/v1/email/po-email/send?organization_id=${organization_id}`;
        customBaseUrl = config.PO_Base_url;
        emailPayload.email_type =
          entityTypeSegment === "payment" || entityTypeSegment === "paymentmade"
            ? "Payment Notification"
            : "Purchase Order Notification";
      }

      // Send the email
      const response = await apiService({
        method: "POST",
        url: url,
        customBaseUrl: customBaseUrl,
        file: false,
        data: emailPayload,
      });

      if (response.data.status) {
        showMessage("Email sent successfully!", "success");
        setIsEmailSending(false);

        // Handle status updates if needed
        if (entityTypeSegment === "salesOrder") {
          if (status === "draft") {
            handleStatusUpdate(uniqueId);
          } else {
            router.push(`/sales/salesOrder/${uniqueId}`);
          }
        } else if (entityTypeSegment === "purchaseorder") {
          router.push(`/purchase/purchaseorder/${uniqueId}`);
        } else if (
          entityTypeSegment === "payment" ||
          entityTypeSegment === "paymentmade"
        ) {
          // Use appropriate route for payments
          router.push(`/purchase/payment/${uniqueId}`);
        } else if (entityTypeSegment === "quotes") {
          if (status === "draft") {
            handleStatusUpdate(uniqueId);
          } else {
            router.push(`/sales/quotes/${uniqueId}`);
          }
        } else if (entityTypeSegment === "invoices") {
          if (status === "draft") {
            handleInvoiceStatusUpdate(uniqueId);
          } else {
            router.push(`/sales/invoices/${uniqueId}`);
          }
        }
      } else {
        showMessage(`Failed to send email: ${response.data.message}`, "error");
        setIsEmailSending(false);
      }
    } catch (error) {
      setIsEmailSending(false);
      showMessage(
        `Error sending email: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`,
        "error"
      );
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      let formattedData = {};
      formattedData.status = "open";
      formattedData.status_formatted = "Open";
      formattedData.order_status = "confirmed";
      formattedData.order_status_formatted = "Confirmed";
      formattedData.invoiced_status = "not-invoiced";
      formattedData.invoiced_status_formatted = "Not Invoiced";
      formattedData.paid_status = "unpaid";
      formattedData.paid_status_formatted = "Unpaid";
      const entityTypeSegment = getPathEntity();
      let url;
      if(entityTypeSegment === "quotes"){
        formattedData.status = "sent";
      formattedData.status_formatted = "Sent";
url =`/api/v1/estimate/status?organization_id=${organization_id}&quote_id=${id}`;
      }else{
        url =`/api/v1/sales-order/status?organization_id=${organization_id}&salesorder_id=${id}`;
      }
      const response = await apiService({
        method: "PUT",
        customBaseUrl: config.SO_Base_url,
        url: url,
        data: formattedData,
      });
      const data = response.data.status;
      if (data === true && entityTypeSegment === "quotes") { 
        router.push(`/sales/quotes/${id}`);
      }else {
        router.push(`/sales/salesOrder/${id}`);
      }
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleInvoiceStatusUpdate = async (id) => {
    try {
      let formattedData = {};
      formattedData.status = "sent";
      formattedData.status_formatted = "Sent";
      const response = await apiService({
        method: "PUT",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/invoices/status?organization_id=${organization_id}&invoice_id=${id}`,
        data: formattedData,
      });
      const data = response.data.status;
      if (data === true) {
        router.push(`/sales/invoices/${id}`);
      }
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  // Add a function to handle payment status update if needed
  const handlePaymentStatusUpdate = async (id) => {
    try {
      let formattedData = {};
      formattedData.status = "sent";
      formattedData.status_formatted = "Sent";
      const response = await apiService({
        method: "PUT",
        customBaseUrl: config.PO_Base_url,
        url: `/api/v1/payment-status/${id}?organization_id=${organization_id}`,
        data: formattedData,
      });
      const data = response.data.status;
      if (data === true) {
        router.push(`/purchase/payment/${id}`);
      }
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

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
      marginLeft: 2,
      cursor: "pointer",
      color: "#408dfb",
      fontSize: "13px",
      "&:hover": {
        textDecoration: "underline",
      },
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
    },
    buttonBar: {
      display: "flex",
      gap: "10px",
      marginTop: "20px",
    },
    "custom-header-two": {
      backgroundColor: "#408dfb", // Blue background
      color: "white", // White text
      textAlign: "center", // Center align
      padding: "12px", // Add padding
      margin: "0", // Remove default margin
    },
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

  // Handle opening the popup
  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  // Handle closing the popup and updating contacts
  const handleClosePopup = (newContact) => {
    setOpenPopup(false);
    if (newContact) {
      setToContacts((prevContacts) => [...prevContacts, newContact]);
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

  return (
    <>
      {!loading ? (
        <Box sx={{ overflow: "hidden", backgroundColor: "#fff" }}>
          {/* Header */}
          <Grid
            container
            sx={{
              pr: 3,
              height: "70px",
              position: "fixed",
              backgroundColor: "white",
              boxShadow: "0px 4px 4px rgba(29, 29, 29, 0.02)",
              borderBottom: "1px solid #eee",
              px: 3,
              py: 1,
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
                {emailData?.customer_name || emailData?.vendor_name || ""}
              </Typography>
            </Grid>
            <Divider />
          </Grid>
          <Grid>
            <Box sx={styles.emailContainer}>
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
                              {email.contact_name || email.user_name || ""} (
                              {email.email})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            color: 'black',               // <-- This affects the input text color
                          },
                        }}
                        value={fromEmail}
                        color="black"
                        disabled
                        sx={{
                          '& .MuiInputBase-input.Mui-disabled': {
                            color: 'black',              // <-- Ensures disabled text is black
                            WebkitTextFillColor: 'black', // <-- Fix for Safari
                          },
                        }}
                        onChange={(e) => setFromEmail(e.target.value)}
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
                        open={openSelect}
                        onOpen={() => setOpenSelect(true)}
                        onClose={() => setOpenSelect(false)}
                        value={selectedTo}
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                            }}
                          >
                            {selected.map((value) => {
                              const contact = toContacts.find(
                                (c) => c.contact_person_id === value
                              );
                              if (!contact) return null;

                              const name = contact.contact_name?.trim()
                                ? contact.contact_name
                                : `${contact.salutation || ""} ${
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
                                    "&:hover": {
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
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
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
                        onChange={(e) => {
                          setSelectedTo(e.target.value);
                          setOpenSelect(false); // ✨ CLOSE the Select after a choice is made
                        }}
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
                        {toContacts
                          .filter((contact) => {
                            const name =
                              contact.contact_name ||
                              `${contact.salutation || ""} ${
                                contact.first_name || ""
                              } ${contact.last_name || ""}`.trim();
                            const email = contact.email || "";
                            return (
                              name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              email
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            );
                          })
                          .map((contact, index) => (
                            <MenuItem
                              key={index}
                              value={contact.contact_person_id}
                              sx={{
                                fontSize: "13px",
                                backgroundColor: selectedTo.includes(
                                  contact.contact_person_id
                                )
                                  ? "#e0f0ff"
                                  : "inherit",
                                "&:hover": {
                                  backgroundColor: "#e0f0ff",
                                },
                              }}
                            >
                              {contact.contact_name ||
                                `${contact.salutation || ""} ${
                                  contact.first_name || ""
                                } ${contact.last_name || ""}`.trim()}
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
                              sx={{
                                mr: 0.5,
                                fontSize: "18px",
                                color: "#408dfb",
                              }}
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
                    contact_id={emailData?.customer_id || emailData?.vendor_id}
                    organization_id={organization_id}
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
                            e.target.value.split(", ").filter(Boolean)
                          )
                        }
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
                            e.target.value.split(", ").filter(Boolean)
                          )
                        }
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
                      placeholder="Start typing here..."
                      blockStyleFn={blockStyleFn}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Attachments */}
              {/* {attachPdf && (
                <Box sx={styles.attachmentChip}>
                  <FormControlLabel
                    sx={{ fontSize: "13px" }}
                    control={
                      <Checkbox
                        checked={attachPdf}
                        size="small"
                        onChange={(e) => setAttachPdf(e.target.checked)}
                      />
                    }
                    label={`Attach ${
                      getPathEntity() === "salesOrder"
                        ? "Sales"
                        : getPathEntity() === "invoices"
                        ? "Invoice"
                        : getPathEntity() === "payment" ||
                          getPathEntity() === "paymentmade"
                        ? "Payment"
                        : getPathEntity() === "quotes"
                        ? "Quote"
                        : "Purchase"
                    } PDF`}
                  />
                  <TextField
                    value={
                      emailData?.file_name ||
                      `${getPathEntity()}-${uniqueId}.pdf`
                    }
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#f44336"
                          >
                            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm12 6V9c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1zm-2-3h1v1h-1V9zm0 2h1v1h-1v-1z" />
                          </svg>
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                </Box>
              )} */}

              {/* Additional attachments */}
              {/* {attachments && attachments.length > 0 && (
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
              )} */}

              {/* Attachments Option */}
              <Box sx={styles.attachmentChip}>
                {/* <FormControlLabel
                  sx={{ fontSize: "13px", "& .MuiFormControlLabel-root .MuiFormControlLabel-label .MuiFormControlLabel-roo":{fontSize: "13px !important"} }}
                  control={
                    <Checkbox
                      checked={attachDocument}
                      size="small"
                      // onChange={(e) => {
                      //   setAttachDocument(e.target.checked);
                      //   setAttachPdf(e.target.checked); // Sync both checkboxes
                      // }}
                    />
                  }
                  label={`Attach ${
                    getPathEntity() === "salesOrder"
                      ? "Sales Order"
                      : getPathEntity() === "invoices"
                      ? "Invoice"
                      : getPathEntity() === "payment" ||
                        getPathEntity() === "paymentmade"
                      ? "Payment Made"
                      : getPathEntity() === "quotes"
                      ? "Quote"
                      : "Purchase Order"
                  } PDF`}
                /> */}
                <FormControlLabel
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "13px",
                    },
                  }}
                  control={<Checkbox checked={attachDocument} size="small" />}
                  label={`Attach ${
                    getPathEntity() === "salesOrder"
                      ? "Sales Order"
                      : getPathEntity() === "invoices"
                      ? "Invoice"
                      : getPathEntity() === "payment" ||
                        getPathEntity() === "paymentmade"
                      ? "Payment Made"
                      : getPathEntity() === "quotes"
                      ? "Quote"
                      : getPathEntity() === "paymentsReceived"
                      ? "Payment Receipt"
                      : "Purchase Order"
                  } PDF`}
                />
              </Box>

              {/* Add more attachments */}
              <Box sx={styles.footer}>
                <Button
                  component="label"
                  startIcon={<AttachFile fontSize="15px" />}
                  sx={{ fontSize: "12px", textTransform: "none" }}
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
              <Box sx={{ color: "white", mt: 2 }}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    mr: 2,
                    color: selectedTo.length === 0 ? "black !important" : "white !important", // This sets the text color to white
                    background: selectedTo.length === 0 ? "#ddd !important" : "", // This sets the text color to white
                    "& .MuiButton-root.Mui-disabled": {
                      color: "black !important",
                      background:"#ddd !important"
                    },
                  }}
                  className="button-submitadd"
                  onClick={handleSend}
                  disabled={
                    isEmailSending || selectedTo.length === 0 || !subject
                  }
                >
                  {isEmailSending ? "Sending..." : "Send"}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ textTransform: "none" }}
                  className="bulk-update-btn"
                  onClick={() => handleCancel()}
                  disabled={isEmailSending}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
            {isEmailSending && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  zIndex: 9999,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DotLoader />
              </Box>
            )}
          </Grid>
        </Box>
      ) : (
        <Box my={3}>
          <DotLoader />
        </Box>
      )}
      {/* email ---button
      
      <div style="text-align: center; margin-top: 20px;">
              <a href="#" style="background-color: #2ecc71; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
              ${buttonName}
              </a>
            </div> */}
    </>
  );
};

export default EmailComposer;
