"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  IconButton,
  Collapse,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  Skeleton,
  Popover,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CommentIcon from "@mui/icons-material/Comment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PrintIcon from "@mui/icons-material/Print";
import { ArrowDropDown, AutoAwesome, IosShare } from "@mui/icons-material";
import {
  BadgeCheck,
  FileMinus2,
  FileText,
  Mail,
  Pencil,
  Printer,
} from "lucide-react";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";
import config from "../../../services/config";
import WarningIcon from "../../../assets/icons/warning-img.png";
import Image from "next/image";
import html2pdf from "html2pdf.js";
import CommentsDrawer from "../../common/commentAndHistory/CommentsDrawer";
import { useRouter } from "next/navigation";

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  color: "white",
  "&:hover": {
    backgroundColor: "#3e8e41",
  },
  textTransform: "none",
  padding: "2px 10px",
}));

// Main container with scrolling
const ScrollableContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  overflow: "auto",
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: "0 auto",
}));

const SalesView = ({ data, organizationData, callViewAPI, loading }) => {
  const [expandedSection, setExpandedSection] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isAttachFiles, setIsAttachFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isConvert, setIsConvert] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isZoho, setIsZoho] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPDFView, setShowPDFView] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [openCancelItems, setOpenCancelItems] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLineItemId, setSelectedLineItemId] = useState(null);
  const [lineItemAnchorPosition, setLineItemAnchorPosition] = useState(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceAnchorPosition, setInvoiceAnchorPosition] = useState(null);
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const handleConfirmDeleteOpen = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDelete(false);
  };

  const handleCancelItems = () => {
    setOpenCancelItems(true);
    handleClose(); // Close the menu
  };

  const handleCancelItemsClose = () => {
    setOpenCancelItems(false);
  };

  const generatePDF = () => {
    setIsPdfGenerating(true); // Show loading state
    setShowPDFView(true); // Ensure the PDF view container is rendered

    // Wait for the DOM to update
    setTimeout(() => {
      try {
        const element = document.getElementById("pdf-view-container");
        if (!element) {
          console.error("PDF view element not found");
          setIsPdfGenerating(false);
          return;
        }

        // Hide elements you don't want in the PDF (e.g., buttons, icons)
        const hiddenElements = [];
        const statusBadgeElements = element.querySelectorAll("*");
        statusBadgeElements.forEach((el) => {
          if (el.textContent && el.textContent.trim() === "Some Status Text") {
            hiddenElements.push({
              element: el,
              originalDisplay: el.style.display,
            });
            el.style.display = "none";
          }
        });

        // PDF options
        const options = {
          filename: `SO-${data.salesorder_id || "document"}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // Generate and download the PDF
        html2pdf()
          .from(element)
          .set(options)
          .save()
          .then(() => {
            console.log("PDF generation complete");
            // Restore hidden elements
            hiddenElements.forEach((item) => {
              item.element.style.display = item.originalDisplay;
            });
            setIsPdfGenerating(false); // Hide loading state
            setShowPDFView(false); // Hide the PDF view container after generation
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
            // Restore hidden elements in case of error
            hiddenElements.forEach((item) => {
              item.element.style.display = item.originalDisplay;
            });
            setIsPdfGenerating(false); // Hide loading state
            setShowPDFView(false); // Hide the PDF view container after error
          });
      } catch (error) {
        console.error("Error in PDF generation process:", error);
        setIsPdfGenerating(false); // Hide loading state
        setShowPDFView(false); // Hide the PDF view container after error
      }
    }, 500); // Small delay to ensure the DOM updates
  };

  const handleClickOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const togglePDFView = () => {
    setShowPDFView(!showPDFView);
  };

  const handleInvoice = (id) => {
    router.push(`/sales/invoices/${id}`);
  };

  // convert to invoice
  const handleConvertInvoice = () => {
    router.push(`/sales/invoices/new?salesorder_id=${data.salesorder_id}`);
  };

  const fetchInvoiceId = async () => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        showMessage("Organization ID not found", "error");
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/invoice-id?organization_id=${organization_id}`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });

      console.log("Invoice ID Response:", response); // Debug log

      if (response.data.status) {
        const { data } = response.data;
        setInvoiceId(data);
      } else {
        showMessage(
          response.data.message || "Failed to fetch invoice ID",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching invoice ID:", error);
      showMessage(
        error.response?.data?.message || "Failed to fetch invoice ID",
        "error"
      );
    }
  };

  const handleInstantInvoice = async () => {
    try {
      const payload = {
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        reference_number: data.salesorder_number || "",
        billing_address: data.billing_address || {},
        shipping_address: data.shipping_address || {},
        line_items: data.line_items.map((item) => ({
          item_id: item.item_id,
          name: item.name,
          description: item.description || "",
          quantity: item.quantity,
          rate: item.rate,
          discount: item.discount || 0,
          amount: item.quantity * item.rate,
          unit: item.unit || "",
          tax_percentage: item.tax_percentage || 0,
        })),
        sub_total: data.sub_total || 0,
        sub_total_formatted: data.sub_total_formatted || "₹0.00",
        total_amount: data.total || 0,
        total_amount_formatted: data.total_formatted || "₹0.00",
        adjustment: data.adjustment || 0,
        terms: data.terms || "",
        notes: data.notes || "",
        salesperson_name: data.salesperson_name || "",
        gst_treatment: data.gst_treatment || "",
        gst_no: data.gst_no || "",
        place_of_supply: data.place_of_contact || "", // Verify if this is correct
        payment_terms_label: data.payment_terms_label || "",
        payment_terms: data.payment_terms || "",
        discount_amount_formatted: data.discount_amount_formatted || "",
        discount_amount: data.discount_amount || 0,
        tax_type: data.tax_type || "",
        tds_option: data.tds_option || "",
        discount_percent: parseInt(data.discount_percent) || 0,
        tax_total: data.tax_total || 0,
        tax_total_formatted: data.tax_total_formatted || "₹0.00",
        tax_percentage: data.tax_percentage || 0,
      };

      const organization_id = localStorage.getItem("organization_id");
      const salesorder_id = data.salesorder_id;

      const response = await apiService({
        method: "POST",
        url: `/api/v1/salesorders/convert-to-invoice?organization_id=${organization_id}&salesorder_id=${salesorder_id}`,
        data: payload,
        customBaseUrl: config.SO_Base_url,
      });

      const { invoice_id } = response.data; // Assuming API returns an invoice ID

      showMessage("Invoice created successfully!", "success");
      callViewAPI(data.salesorder_id);
    } catch (error) {
      console.error("Error creating instant invoice:", error);
      showMessage(
        error?.response?.data?.message ||
          "Failed to create invoice. Please try again.",
        "error"
      );
    }
  };

  const toggleSection = () => {
    setExpandedSection((prev) => !prev);
  };

  const toggleMoreOptions = () => {
    setIsMoreOptions((prev) => !prev);
  };

  const handleClose = () => {
    setIsMoreOptions(false);
    setIsSendOpen(false);
    setIsReminderOpen(false);
    setIsPdfOpen(false);
    setIsRecordOpen(false);
    setIsConvert(false);
  };

  const isAttachFilesToggle = () => {
    setIsAttachFiles((prev) => !prev);
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = () => {
    setIsConvert(true);
  };

  const handlePdfOpen = () => {
    setIsPdfOpen(true);
  };

  // Toggle handler for Zoho/Tally
  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    localStorage.setItem("salesOrderId", data?.salesorder_id);
    router.push("/tally/preview?isStatus=SalesOrder");
  };

  const getBgColor = () => {
    if (data?.order_status === "draft") {
      return "#94a5a6";
    } else if (
      data?.order_status === "closed" ||
      data?.order_status === "invoiced"
    ) {
      return "#1fcd6d";
    } else if (data?.order_status === "confirmed") {
      return "#2098FF";
    } else if (data?.order_status === "void") {
      return "#474747";
    } else {
      return "#474747";
    }
  };

  const getFontColor = () => {
    if (data?.paid_status === "paid" || data?.invoiced_status === "invoiced") {
      return "#57B729"; // Green color for paid status
    } else if (
      data?.paid_status === "unpaid" ||
      data?.invoiced_status === "uninvoiced"
    ) {
      return "#FF0000"; // Red color for unpaid status
    }
    return "#fff"; // Default color (white) for any other status
  };
  const getWhatsNext = () => {
    if (data?.order_status === "draft") {
      return "Go ahead and email this quote to your customer or simply mark it as sent.";
    } else if (data?.order_status === "confirmed") {
      return "Convert the sales order into packages, shipments, or invoices.";
    }
  };
  const organization_id = localStorage.getItem("organization_id");
  const handleStatus = async (value) => {
    try {
      let formattedData = {};
      if (value === 1) {
        formattedData.status = "open";
        formattedData.status_formatted = "Open";
        formattedData.order_status = "confirmed";
        formattedData.order_status_formatted = "Confirmed";
        formattedData.invoiced_status = "not-invoiced";
        formattedData.invoiced_status_formatted = "Not Invoiced";
        formattedData.paid_status = "unpaid";
        formattedData.paid_status_formatted = "Unpaid";
      } else if (value === 3) {
        formattedData.status = "void";
        formattedData.status_formatted = "Void";
        formattedData.order_status = "void";
        formattedData.order_status_formatted = "Void";
      }
      const response = await apiService({
        method: "PUT",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/sales-order/status?organization_id=${organization_id}&salesorder_id=${data?.salesorder_id}`,
        data: formattedData,
      });
      const message = response.data.message;
      showMessage(message, "success");
      window.location.href = `/sales/salesOrder/${data.salesorder_id}`;
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/salesorders?organization_id=${organization_id}&salesorder_id=${data.salesorder_id}`,
        customBaseUrl: config.SO_Base_url,
      });

      const dataResponse = response.data;
      showMessage(dataResponse.message, "success");
      setOpenDelete(false);
      router.push(`/sales/orders`);
    } catch (err) {
      console.error("Failed to delete sales order:", err);
      showMessage(err.message || "Error deleting sales order", "error");
    }
  };

  const handleLineItemMenuClick = (event, item, index) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setLineItemAnchorPosition({ top: rect.bottom, left: rect.left });
    setSelectedLineItemId(
      item.id || `${item.name}-${item.quantity}-${item.rate}-${index}`
    ); // Use index as part of composite key for uniqueness
  };

  const handleLineItemMenuClose = () => {
    setSelectedLineItemId(null);
    setLineItemAnchorPosition(null);
  };

  const handleInvoiceMenuClick = (event, row) => {
    event.stopPropagation();

    if (!row.invoice_id) {
      showMessage("Invoice ID not found", "error");
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setInvoiceAnchorPosition({ top: rect.bottom, left: rect.left });
    setSelectedInvoiceId(row.invoice_id);
  };

  const handleInvoiceMenuClose = () => {
    setSelectedInvoiceId(null);
    setInvoiceAnchorPosition(null);
  };

  const handleEmailItem = async (row) => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        showMessage("Organization ID not found", "error");
        return;
      }

      const response = await apiService({
        method: "POST",
        url: `/api/v1/invoices/email/${row.invoice_id}?organization_id=${organization_id}`,
        customBaseUrl: config.SO_Base_url,
        data: { invoice_id: row.invoice_id },
      });

      if (response.data.status) {
        showMessage(
          response.data.message || "Invoice emailed successfully!",
          "success"
        );
      } else {
        showMessage(
          response.data.message || "Failed to email invoice",
          "error"
        );
      }
    } catch (error) {
      console.error("Error emailing invoice:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to email invoice. Please try again.",
        "error"
      );
    } finally {
      handleInvoiceMenuClose();
    }
  };

  const handlePdfItem = async (row) => {
    try {
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "8.27in";

      tempContainer.innerHTML = `
        <div style="padding: 30px; font-family: 'Times New Roman', serif;">
          <h1 style="text-align: center; margin-bottom: 20px;">Invoice</h1>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <p><strong>Invoice #:</strong> ${row.invoice_number}</p>
              <p><strong>Date:</strong> ${row.date_formatted}</p>
              <p><strong>Due Date:</strong> ${row.due_date_formatted}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Amount:</strong> ${row.total_formatted}</p>
              <p><strong>Balance Due:</strong> ${row.balance_formatted}</p>
              <p><strong>Status:</strong> ${row.status_formatted}</p>
            </div>
          </div>
          ${
            row.line_items
              ? `
            <h3>Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Qty</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Rate</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${row.line_items
                  .map(
                    (item) => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.rate}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.item_total}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : ""
          }
        </div>
      `;

      document.body.appendChild(tempContainer);

      const options = {
        filename: `Invoice-${row.invoice_number || "document"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Generate and download the PDF
      await html2pdf().from(tempContainer).set(options).save();

      showMessage("PDF generated and downloaded!", "success");
    } catch (error) {
      console.error("Error generating single invoice PDF:", error);
      showMessage("Failed to generate PDF. Please try again.", "error");
    } finally {
      // Clean up the temporary container
      if (tempContainer && document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
      handleInvoiceMenuClose(); // Close the popover
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedInvoiceId) {
      showMessage("No invoice selected.", "error");
      return;
    }

    const organization_id = localStorage.getItem("organization_id");

    if (!organization_id) {
      showMessage("Organization ID not found.", "error");
      return;
    }

    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/invoices/${selectedInvoiceId}?organization_id=${organization_id}`,
        customBaseUrl: config.SO_Base_url,
      });

      showMessage("Invoice deleted successfully!", "success");
      callViewAPI(data.salesorder_id); // Refresh view
    } catch (error) {
      console.error("Error deleting invoice:", error);
      showMessage(
        error.response?.data?.message || "Failed to delete invoice.",
        "error"
      );
    } finally {
      handleInvoiceMenuClose();
    }
  };

  const handlePrintItem = async (row) => {
    try {
      // Reuse the PDF generation logic but trigger print instead of save
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px"; // Position off-screen
      tempContainer.style.width = "8.27in"; // A4 width for consistency

      // Generate simplified HTML content for the single invoice row
      // Ensure this matches the structure in handlePdfItem
      tempContainer.innerHTML = `
        <div style="padding: 30px; font-family: 'Times New Roman', serif;">
          <h1 style="text-align: center; margin-bottom: 20px;">Invoice</h1>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <p><strong>Invoice #:</strong> ${row.invoice_number}</p>
              <p><strong>Date:</strong> ${row.date_formatted}</p>
              <p><strong>Due Date:</strong> ${row.due_date_formatted}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Amount:</strong> ${row.total_formatted}</p>
              <p><strong>Balance Due:</strong> ${row.balance_formatted}</p>
              <p><strong>Status:</strong> ${row.status_formatted}</p>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(tempContainer);

      const options = {
        filename: `Invoice-${row.invoice_number || "document"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      const pdfBlob = await html2pdf()
        .from(tempContainer)
        .set(options)
        .output("blob");

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          URL.revokeObjectURL(pdfUrl); // Clean up the blob URL
        };
      } else {
        showMessage("Please allow pop-ups to print the PDF.", "warning");
        URL.revokeObjectURL(pdfUrl); // Clean up the blob URL
      }

      showMessage("Preparing PDF for printing!", "success");
    } catch (error) {
      console.error("Error generating single invoice PDF for printing:", error);
      showMessage(
        "Failed to prepare PDF for printing. Please try again.",
        "error"
      );
    } finally {
      // Clean up the temporary container
      if (tempContainer && document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
      handleInvoiceMenuClose(); // Close the popover
    }
  };

  // PDF View Component
  const NormalView = () => (
    <Paper
      elevation={4}
      id="pdf-view-container"
      sx={{
        position: "relative",
        mb: 2,
        boxShadow: "none",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Grid container display={"flex"}>
        <Grid item xs={6}>
          <Box sx={{ mt: 4, ml: 7, fontSize: "12px" }}>
            <Typography
              // variant="h4"
              sx={{
                fontWeight: "bold",
                mt: 2,
                fontFamily: "'Times New Roman', serif",
                fontSize: "23PX",
              }}
            >
              SALES ORDER
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontFamily: "'Times New Roman', serif",
                fontSize: "13PX",
              }}
            >
              Sales Order# {data?.salesorder_number}
            </Typography>
            {data?.order_status_formatted === "Draft" && (
              <Typography
                sx={{
                  color: "white",
                  fontFamily: "'Times New Roman', serif",
                  fontSize: "13PX",
                  width: "55px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  backgroundColor: getBgColor(),
                  mt: 2,
                }}
              >
                {data?.order_status_formatted}
              </Typography>
            )}
          </Box>
          {data?.order_status_formatted !== "Draft" && (
            <Box sx={{ mt: 4, ml: 7, fontSize: "12px" }}>
              <Typography sx={{ fontSize: "14px", color: "#555555" }}>
                Status
              </Typography>
              <Box sx={{ borderLeft: "3px solid orange", mt: 1, pl: 2 }}>
                <Table>
                  <TableHead sx={{ display: "flex" }}>
                    <TableRow
                      sx={{
                        width: "100px",
                        fontSize: "13px",
                        fontWeight: "500",
                        p: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                        Order
                      </Typography>
                    </TableRow>
                    <TableRow
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        p: 0.5,
                        color: "white",
                        backgroundColor: getBgColor(),
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      {data?.order_status_formatted}
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ display: "flex" }}>
                    <TableRow
                      sx={{
                        width: "100px",
                        fontSize: "13px",
                        fontWeight: "500",
                        p: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                        Invoice
                      </Typography>
                    </TableRow>
                    <TableRow
                      sx={{
                        width: "100px",
                        fontSize: "13px",
                        fontWeight: "400",
                        color: getFontColor(),
                        p: 0.5,
                      }}
                    >
                      {data?.invoiced_status_formatted}
                    </TableRow>
                  </TableBody>
                  <TableBody sx={{ display: "flex" }}>
                    <TableRow
                      sx={{
                        width: "100px",
                        fontSize: "13px",
                        fontWeight: "500",
                        p: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                        Payment
                      </Typography>
                    </TableRow>
                    <TableRow
                      sx={{
                        width: "100px",
                        fontSize: "13px",
                        fontWeight: "500",
                        p: 0.5,
                        color: getFontColor(),
                      }}
                    >
                      {data?.paid_status_formatted}
                    </TableRow>
                  </TableBody>
                  <TableBody sx={{ display: "flex" }}>
                    <TableRow
                      sx={{
                        width: "100px",
                        fontSize: "13px",
                        fontWeight: "500",

                        p: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                        Shipment
                      </Typography>
                    </TableRow>
                    <TableRow
                      sx={{
                        width: "100px",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#EB6100",
                        p: 0.5,
                      }}
                    >
                      Pending
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 4, ml: 7, fontSize: "12px" }}>
            <Table>
              <TableHead sx={{ display: "flex" }}>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#555555",
                    }}
                  >
                    Reference#
                  </Typography>
                </TableRow>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  {data?.reference_number || "-"}
                </TableRow>
              </TableHead>
              <TableBody sx={{ display: "flex" }}>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#555555",
                    }}
                  >
                    Order Date
                  </Typography>
                </TableRow>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  {data?.date_formatted}
                </TableRow>
              </TableBody>
              <TableBody sx={{ display: "flex" }}>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#555555",
                    }}
                  >
                    Expected Shipment Date
                  </Typography>
                </TableRow>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  {data?.shipment_date_formatted}
                </TableRow>
              </TableBody>
              <TableBody sx={{ display: "flex" }}>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#555555",
                    }}
                  >
                    Payment Terms
                  </Typography>
                </TableRow>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  {data?.payment_terms_label}
                </TableRow>
              </TableBody>
              <TableBody sx={{ display: "flex" }}>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#555555",
                    }}
                  >
                    Delivery Method
                  </Typography>
                </TableRow>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  {data?.invoiced_status_formatted}
                </TableRow>
              </TableBody>
              <TableBody sx={{ display: "flex" }}>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#555555",
                    }}
                  >
                    Salesperson
                  </Typography>
                </TableRow>
                <TableRow
                  sx={{
                    width: "150px",
                    fontSize: "13px",
                    fontWeight: "500",
                    p: 0.5,
                  }}
                >
                  {data?.salesperson_name}
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Grid item textAlign="left" sx={{ mt: 5, ml: 20 }}>
            <Typography variant="body2" fontSize="13px">
              BILLING ADDRESS
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "15px",
                color: "#408dfb",
                mb: 1,
              }}
            >
              {data?.customer_name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.billing_address?.attention}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.billing_address?.address}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.billing_address?.street2}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.billing_address?.city} {data.billing_address?.city && ","}{" "}
              {data.billing_address?.state}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.billing_address?.country}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.billing_address?.phone}
            </Typography>
          </Grid>
          <Grid item textAlign="left" sx={{ mt: 5, ml: 20 }}>
            <Typography variant="body2" fontSize="13px">
              SHIPPING ADDRESS
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.shipping_address?.attention}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.shipping_address?.address}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.shipping_address?.street2}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.shipping_address?.city} {data.shipping_address?.city && ","}{" "}
              {data.shipping_address?.state}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.shipping_address?.country}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Times New Roman', serif",
                fontSize: "13px",
              }}
            >
              {data.shipping_address?.phone}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", borderRadius: "0px", mt: 4, ml: 7 }}
      >
        <Table sx={{ width: 670, boxShadow: "none" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "black !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "black !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                Item & Description
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "black !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                Qty
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "black !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                Rate
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "black !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.line_items?.map((row, index) => (
              <>
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        color: "#333",
                      }}
                    >
                      {row?.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        color: "#333",
                      }}
                    >
                      {row?.description}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      color: "#333",
                    }}
                  >
                    {row?.quantity}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      color: "#333",
                    }}
                  >
                    ₹{parseFloat(row?.rate || 0).toFixed(2)}
                    {/* {row?.rate} */}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      color: "#333",
                    }}
                  >
                    ₹{parseFloat(row?.item_total|| 0).toFixed(2)}
                    {/* {row?.item_total} */}
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ mt: 2, mr: 2 }}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Grid container sx={{ ml: 6 }}>
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={10} textAlign="right" sx={{ pr: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif", mt: 1 }}
                  >
                    Sub Total
                  </Typography>
                  {data?.adjustment !== 0 && (
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                    >
                      Adjustment
                    </Typography>
                  )}
                  {data?.tax_total !== 0 && (
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                    >
                      Withheld(Section 194H)
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                  >
                    Discount
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                  >
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={2} textAlign="right">
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif", mt: 1 }}
                  >
                    {data?.sub_total_formatted}
                  </Typography>
                  {data?.adjustment !== 0 && (
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                    >
                     ₹{parseFloat(data.adjustment || 0).toFixed(2)}
                    </Typography>
                  )}
                  {data?.tax_total !== 0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        mt: 2,
                        color: data?.tax_type === "TDS" ? "red" : "",
                      }}
                    >
                      {data?.tax_type === "TDS"
                        ? `(-)${data?.tax_total?.toFixed(2)}`
                        : data?.tax_total?.toFixed(2)}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      mt: 2,
                      textAlign: "right",
                    }}
                  >
                    {data?.discount_amount_formatted}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      mt: 2,
                      textAlign: "right",
                    }}
                  >
                    {data?.total_formatted}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box>
        <Box sx={{ mt: 8 }}>
          <Typography variant="subtitle2" sx={{ pb: 1 }}>
            More Information
          </Typography>
          <Table>
            <TableHead sx={{ display: "flex" }}>
              <TableRow>
                <Typography
                  sx={{ fontSize: "13px", color: "#555555", width: "100px" }}
                >
                  Salesperson:
                </Typography>
              </TableRow>
              <TableRow>
                <Typography sx={{ fontSize: "14px" }}>
                  {data?.salesperson_name}
                </Typography>
              </TableRow>
            </TableHead>
          </Table>
        </Box>
      </Box>
    </Paper>
  );

  const PDFView = () => (
    <Box>
      <Paper
        elevation={4}
        sx={{
          position: "relative",
          mb: 2,
          p:4,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Status Watermark */}
        <Box
          sx={{
            zIndex: 1,
            backgroundColor: getBgColor(),
            position: "absolute",
            color: "white",
            padding: "6px",
            transform: "rotate(-45deg)",
            transformOrigin: "center",
            top: "15px",
            left: "-30px",
            whiteSpace: "nowrap",
            fontWeight: "small",
            width: "120px",
            textAlign: "center",
          }}
        >
          {data?.order_status_formatted}
        </Box>

        <Grid container spacing={2}>
          {/* Left Section - Company & Address Info */}
          <Grid item xs={6}>
            <Box sx={{ mt: 4, ml: 7, fontSize: "12px" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold !important",
                  color: "black",
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.org_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.city}{" "}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.state}{" "}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.country}{" "}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.phone}{" "}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                GTIN: 35AAACI1681G1ZS
              </Typography>

              {/* Bill To */}
              {data.billing_address && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "black",
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                      mb: 0,
                      fontWeight:600
                    }}
                  >
                    Bill To
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.billing_address?.attention}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.billing_address?.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.billing_address?.street2}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.billing_address?.city}{" "}
                    {data.billing_address?.city && ","}{" "}
                    {data.billing_address?.state}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.billing_address?.country}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.billing_address?.phone}
                  </Typography>
                </Box>
              )}

              {/* Ship To */}
              {data.shipping_address && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "black",
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                      mb: 0,
                      fontWeight:600
                    }}
                  >
                    Ship To
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.shipping_address?.attention}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.shipping_address?.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.shipping_address?.street2}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.shipping_address?.city},{" "}
                    {data.shipping_address?.state}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.shipping_address?.country} -{" "}
                    {data.shipping_address?.zip}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data.shipping_address?.phone}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Section - Order Title & Meta Data */}
          <Grid item xs={6} sx={{ textAlign: "right", position: "relative" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mt: 2,
                fontFamily: "'Times New Roman', serif",
              }}
            >
              SALES ORDER
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "black", fontFamily: "'Times New Roman', serif" }}
            >
              Sales Order# {data?.salesorder_number}
            </Typography>

            <Box sx={{ mt: 5 }}>
              <Grid container spacing={1}>
                <Grid item xs={7} textAlign="right">
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif" }}
                  >
                    Order Date :
                  </Typography>
                  {data.reference_number && (
                    <Typography
                      variant="body2"
                      mt={1}
                      sx={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      Ref# :
                    </Typography>
                  )}
                  {/* <br/> */}
                </Grid>
                <Grid item xs={5} textAlign="right">
                  <Typography variant="body2">
                    {new Date(data.date).toLocaleDateString("en-GB")}
                  </Typography>
                  {data.reference_number && (
                    <Typography variant="body2" mt={1}>
                      {data.reference_number}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Place of Supply */}
          {data.place_of_supply && (
            <Grid item xs={12}>
              <Box sx={{ mt: 1, ml: 7 }}>
                <Typography
                  sx={{ color: "#1B4C91", fontSize: "13px", fontWeight: "600" }}
                >
                  {data.place_of_supply
                    ? "Place of Supply : " + data.place_of_supply
                    : ""}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Line Items Table */}
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", borderRadius: "0px", mt: 4, ml: 7 }}
        >
          <Table sx={{ width: 690, boxShadow: "none" }}>
            <TableHead sx={{ height: "45PX" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    color: "white !important",
                    backgroundColor: "#3c3d3a !important",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    color: "white !important",
                    backgroundColor: "#3c3d3a !important",
                  }}
                >
                  Item & Description
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    color: "white !important",
                    backgroundColor: "#3c3d3a !important",
                  }}
                >
                  Qty
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    color: "white !important",
                    backgroundColor: "#3c3d3a !important",
                  }}
                >
                  Rate
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    color: "white !important",
                    backgroundColor: "#3c3d3a !important",
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data.line_items) &&
                data?.line_items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Times New Roman', serif",
                          color: "#333",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        color: "#333",
                      }}
                    >
                      {item.quantity}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        color: "#333",
                      }}
                    >
                      ₹{parseFloat(item?.rate || 0).toFixed(2)}
                      {/* {item.rate} */}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontFamily: "'Times New Roman', serif",
                        color: "#333",
                      }}
                    >
                      {data.total_formatted}
                    </TableCell>
                    {/* <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(event) => handleInvoiceMenuClick(event, row)}
                        sx={{
                          padding: "2px",
                          "&:hover": {
                            backgroundColor: "rgba(64, 141, 251, 0.08)",
                          },
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <Popover
                        anchorPosition={invoiceAnchorPosition}
                        anchorReference="anchorPosition"
                        open={Boolean(
                          invoiceAnchorPosition && selectedInvoiceId
                        )}
                        onClose={handleInvoiceMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        PaperProps={{
                          sx: {
                            width: "160px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
                            mt: 0.5,
                            overflow: "hidden",
                          },
                        }}
                      >
                        <Box sx={{ py: 0.5 }}>
                          <MenuItem
                            sx={{
                              fontSize: "13px",
                              py: 1.5,
                              px: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                            onClick={handleLineItemMenuClose}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                            Delete
                          </MenuItem>
                          <MenuItem
                            sx={{
                              fontSize: "13px",
                              py: 1.5,
                              px: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                            onClick={() => {
                              handleEmailItem(item);
                              handleLineItemMenuClose();
                            }}
                          >
                            <MailOutlineIcon fontSize="small" />
                            Email
                          </MenuItem>
                          <MenuItem
                            sx={{
                              fontSize: "13px",
                              py: 1.5,
                              px: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                            onClick={handleLineItemMenuClose}
                          >
                            <PrintIcon fontSize="small" />
                            Print
                          </MenuItem>
                          <MenuItem
                            sx={{
                              fontSize: "13px",
                              py: 1.5,
                              px: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              "&:hover": {
                                backgroundColor: "#408dfb",
                                color: "white",
                              },
                            }}
                            onClick={() => {
                              handlePdfItem(item);
                              handleLineItemMenuClose();
                            }}
                          >
                            <PictureAsPdfIcon fontSize="small" />
                            PDF
                          </MenuItem>
                        </Box>
                      </Popover>
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals Section */}
        <Grid container spacing={2}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={6} textAlign="right" sx={{ pl: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "13px" }}
                >
                  Sub Total
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400", mt: 1, fontSize: "13px" }}
                  color="textSecondary"
                >
                  Discount
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400", mt: 1, fontSize: "13px" }}
                  color="textSecondary"
                >
                  Adjustment
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "13px" }}
                >
                  Total
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right" sx={{ pr: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "13px" }}
                >
                  {data.sub_total_formatted}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontWeight: "400", mt: 1, fontSize: "13px" }}
                >
                  (-) {data.discount_amount_formatted}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontWeight: "400", mt: 1, fontSize: "13px" }}
                >
                  (-) ₹{parseFloat(data.adjustment || 0).toFixed(2)}
                </Typography>
                <Divider sx={{ fontWeight: "600", mt: 1, fontSize: "13px" }} />
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  {data.total_formatted}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Authorized Signature */}
        <Box sx={{ mt: 8, ml: 7 }}>
          <Typography variant="subtitle2" sx={{ pb: 1 }}>
            Authorized Signature _______________
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

  const BillSection = () => (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ ml: 10 }}>
        <Typography
          sx={{
            fontSize: "16px",
            marginRight: "85px",
            fontWeight: "600",
            mb: 3,
          }}
        >
          More Information
        </Typography>
        <span style={{ fontWeight: "600", fontSize: "14px" }}>
          {" "}
          Salesperson
        </span>
        <span style={{ color: "#408dfb" }}> {data.salesperson_name}</span>
      </Box>
      <Box>
        <Typography
          sx={{
            px: 2,
            mb: 6,
            fontSize: "13px",
            textAlign: "right",
            marginRight: "85px",
          }}
        >
          PDF Template :`Standard Template`{" "}
          <span style={{ color: "#408dfb" }}> Change</span>
        </Typography>
      </Box>
    </Paper>
  );

  // Credits Applied Section Component
  const CreditsAppliedSection = () => (
    <Box>
      {data?.order_status !== "closed" && (
        <Paper
          sx={{
            p: 0,
            boxShadow: "none",
            border: "1px solid #ddd",
            margin: "24px",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              padding: "8px",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <AutoAwesome
              width="15px !important"
              sx={{
                color: "#5C6BC0",
                mr: 1,
                width: "20px !important",
                marginTop: "-4px",
              }}
            />
            {/* <Image
                         src={GilterIcon}
                         alt="gilter"
                         style={{width:"30px", height: "30px"}}
                         priority
                       /> */}
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              <span style={{ fontWeight: "600" }}>WHAT`S NEXT? </span>
              {getWhatsNext()}
            </Typography>
            {data?.order_status === "confirmed" ? (
              <>
                <Button
                  className="button-submitadd"
                  variant="contained"
                  endIcon={<ArrowDropDown />}
                  sx={{
                    ml: 2,
                    width: "75px !important",
                    boxShadow: "none",
                    textTransform: "none",
                    height: "28px",
                    fontSize: "11px !important",
                  }}
                  onClick={handleConvert}
                >
                  Convert
                </Button>
                <Menu
                  open={isConvert}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  elevation={3}
                  anchorPosition={{
                    top: 250,
                    left: 1100,
                  }}
                  sx={{ borderRadius: 2 }}
                  PaperProps={{
                    sx: {
                      width: "120px",
                      fontSize: "11px",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                      borderRadius: "8px",
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setIsConvert(false);
                      handleConvertInvoice(); // Trigger PDF generation
                    }}
                    sx={{
                      backgroundColor: "transparent",
                      fontSize: "12px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                        borderRadius: "6px",
                        "& .menu-icon": {
                          color: "white !important",
                        },
                      },
                    }}
                  >
                    Convert Invoice
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsConvert(false);
                      handleInstantInvoice();
                    }}
                    sx={{
                      backgroundColor: "transparent",
                      fontSize: "12px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                        borderRadius: "6px",
                        "& .menu-icon": {
                          color: "white !important",
                        },
                      },
                    }}
                  >
                    Instant Invoice
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{
                    ml: 2,
                    background: "#408dfb",
                    boxShadow: "none",
                    fontSize: "12px",
                    textTransform: "none",
                  }}
                >
                  Send Sales Order
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  sx={{
                    ml: 2,
                    boxShadow: "none",
                    fontSize: "12px",
                    color: "#333",
                    borderColor: "#ccc",
                    textTransform: "none",
                  }}
                  onClick={() => handleStatus(1)}
                >
                  Mark as Confirmed
                </Button>
              </>
            )}
          </Box>
        </Paper>
      )}
      {data?.order_status && data?.invoices.length !== 0 && (
        <Paper
          sx={{
            p: 0,
            boxShadow: "none",
            border: "1px solid #ddd",
            margin: "24px",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={toggleSection}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", fontSize: "13px", ml: 1 }}
            >
              Invoices
              <Typography
                component="span"
                sx={{ ml: 1, fontSize: "12px", color: "#408dfb" }}
              >
                {data?.invoices?.length}
              </Typography>
            </Typography>
            {expandedSection ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
          </Box>

          <Collapse in={expandedSection} timeout={2000}>
            <Box
              sx={{
                px: 2,
                transition:
                  "opacity 1.5s ease-in-out, transform 1.5s ease-in-out",
              }}
            >
              <Divider />
              <Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ height: 20 }}>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Invoice#
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Due Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Balance Due
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.invoices?.map((row) => (
                        <>
                          <TableRow sx={{ height: 20 }}>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.date_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                color: "#408dfb !important",
                                cursor: "pointer",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => handleInvoice(row.invoice_id)} // Pass the row object here
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {row?.invoice_number && (
                                  <FileMinus2
                                    width="16px"
                                    style={{ marginRight: "2px" }}
                                  />
                                )}
                                {row?.invoice_number}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              {row?.status_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.due_date_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.total_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.balance_formatted}
                            </TableCell>
                            {/* <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={(event) =>
                                  handleInvoiceMenuClick(event, row)
                                }
                                sx={{ padding: "2px" }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                              <Popover
                                anchorPosition={invoiceAnchorPosition}
                                anchorReference="anchorPosition"
                                open={
                                  selectedInvoiceId === row.invoice_id &&
                                  Boolean(invoiceAnchorPosition)
                                }
                                onClose={handleInvoiceMenuClose}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                PaperProps={{
                                  sx: {
                                    width: "160px",
                                    boxShadow:
                                      "0px 4px 12px rgba(0, 0, 0, 0.15)",
                                    borderRadius: "8px",
                                    mt: 0.5,
                                    overflow: "hidden",
                                  },
                                }}
                              >
                                <Box sx={{ py: 0.5 }}>
                                  <MenuItem
                                    sx={{
                                      fontSize: "13px",
                                      py: 1.5,
                                      px: 2,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      "&:hover": {
                                        backgroundColor: "#408dfb",
                                        color: "white",
                                      },
                                    }}
                                    onClick={handleDeleteItem}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                    Delete
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      fontSize: "13px",
                                      py: 1.5,
                                      px: 2,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      "&:hover": {
                                        backgroundColor: "#408dfb",
                                        color: "white",
                                      },
                                    }}
                                    onClick={() => {
                                      handleEmailItem(row);
                                    }}
                                  >
                                    <MailOutlineIcon fontSize="small" />
                                    Email
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      fontSize: "13px",
                                      py: 1.5,
                                      px: 2,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      "&:hover": {
                                        backgroundColor: "#408dfb",
                                        color: "white",
                                      },
                                    }}
                                    onClick={handlePrintItem}
                                  >
                                    <PrintIcon fontSize="small" />
                                    Print
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      fontSize: "13px",
                                      py: 1.5,
                                      px: 2,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      "&:hover": {
                                        backgroundColor: "#408dfb",
                                        color: "white",
                                      },
                                    }}
                                    onClick={() => {
                                      handlePdfItem(row);
                                    }}
                                  >
                                    <PictureAsPdfIcon fontSize="small" />
                                    PDF
                                  </MenuItem>
                                </Box>
                              </Popover>
                            </TableCell> */}
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Collapse>
        </Paper>
      )}
    </Box>
  );

  // App Header - fixed at the top
  const Header = () => (
    <Box
      sx={{
        // mb: 2,
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: "bold" }}>
            {data?.salesorder_number}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Toggle Button */}
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={toggleMode}
          >
            {isZoho ? (
              <ToggleOnIcon sx={{ color: "#336699", fontSize: 32 }} />
            ) : (
              <ToggleOffIcon sx={{ color: "#888", fontSize: 32 }} />
            )}
            <Typography
              variant="body1"
              sx={{ ml: 1, color: "#333", fontWeight: "bold" }}
            >
              Zoho
            </Typography>
          </div>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid #ddd",
              paddingRight: 2,
              cursor: "pointer",
            }}
            onClick={isAttachFilesToggle}
          >
            <IconButton size="small">
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <Box>Attach Files</Box>
          </Box>

          <Menu
            open={isAttachFiles}
            onClose={() => setIsAttachFiles(false)}
            sx={{
              position: "absolute",
              zIndex: 10,
              borderRadius: 2,
            }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 115, left: 1125 }}
          >
            <Paper sx={{ width: "320px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  px: 1.5,
                  backgroundColor: "#f8f8f8",
                }}
              >
                <Typography fontWeight="bold">Attachments</Typography>
                <IconButton
                  size="small"
                  onClick={() => setIsAttachFiles(false)}
                  sx={{ color: "red" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {files.length === 0 ? (
                <Typography
                  textAlign="center"
                  sx={{
                    borderBottom: "1px solid #ddd",
                    borderTop: "1px solid #ddd",
                    py: 1,
                    height: "70px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  No Files Attached
                </Typography>
              ) : (
                <Box sx={{ mt: 1, maxHeight: "150px", overflowY: "auto" }}>
                  {files.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body2">{file.name}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <MenuItem
                sx={{
                  mt: 2,
                  border: "1px dashed #408dfb",
                  borderRadius: 1,
                  m: 2,
                }}
              >
                <label
                  htmlFor="file-upload"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    width: "100%",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  <CloudUploadIcon sx={{ mr: 1 }} /> Upload your Files
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </MenuItem>

              <Typography
                color="textSecondary"
                sx={{ fontSize: "12px", mt: 1, pb: 1, textAlign: "center" }}
              >
                You can upload a maximum of 5 files, 10MB each
              </Typography>
            </Paper>
          </Menu>

          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => setDrawerOpen(true)}
          >
            <IconButton size="small">
              <CommentIcon fontSize="small" />
            </IconButton>
            <Box>Comments & History</Box>
          </Box>

          <CommentsDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            module={"Sales_order"}
          />

          <Box>
            <IconButton size="small" onClick={() => router.back()}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Second Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // mb: 2,
          position: "sticky",
          backgroundColor: "#f8f8f8",
          zIndex: 10,
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
          // marginBottom: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {data?.order_status !== "void" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  paddingRight: 2,
                  color: "#222",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#2098FF", // sets color for both text and icon
                  },
                  "&:hover svg": {
                    color: "#2098FF", // makes sure the SVG icon gets colored
                  },
                }}
                onClick={() =>
                  router.push(`/sales/salesOrder/edit/${data?.salesorder_id}`)
                }
              >
                <Pencil
                  width="16px"
                  height={"12px"}
                  style={{ marginRight: "4px" }}
                />{" "}
                Edit
              </Box>
              <Divider orientation="vertical" flexItem />

              {/* Send */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  paddingRight: 2,
                  cursor: "pointer",
                  color: "#222",
                  "&:hover": {
                    color: "#2098FF", // sets color for both text and icon
                  },
                  "&:hover svg": {
                    color: "#2098FF", // makes sure the SVG icon gets colored
                  },
                }}
                onClick={() =>
                  router.push(`/sales/salesOrder/${data?.salesorder_id}/email`)
                }
              >
                <IconButton size="small">
                  <Mail width="16px" />
                </IconButton>
                <Box>Email</Box>
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          {/*pdf */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              pr: 0,
              cursor: "pointer",
              color: "#222", // default color
              "&:hover": {
                color: "#2098FF", // sets color for both text and icon
              },
              "&:hover svg": {
                color: "#2098FF", // makes sure the SVG icon gets colored
              },
            }}
            onClick={handlePdfOpen}
          >
            <FileText width="16px" />
            <Box mx={0.5}>Pdf/Print</Box>
            <ArrowDropDown />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Menu
            open={isPdfOpen}
            onClose={handleClose}
            anchorReference="anchorPosition"
            elevation={3}
            anchorPosition={{
              top: 177,
              left: data?.status === "void" ? 600 : 750,
            }}
            sx={{ borderRadius: 2 }}
            PaperProps={{
              sx: {
                width: "90px",
                fontSize: "11px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setIsPdfOpen(false);
                generatePDF(); // Trigger PDF generation
              }}
              sx={{
                backgroundColor: "transparent",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: "6px",
                  "& .menu-icon": {
                    color: "white !important",
                  },
                },
              }}
            >
              <FileText width="13px" style={{ marginRight: 3 }} />
              PDF
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              sx={{
                backgroundColor: "transparent",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: "6px",
                  "& .menu-icon": {
                    color: "white !important",
                  },
                },
              }}
            >
              <Printer width="13px" style={{ marginRight: 3 }} />
              Print
            </MenuItem>
          </Menu>

          {/*Convert */}
          {data.order_status === "draft" ? (
            <IconButton
              size="small"
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: "14px",
                mx: 2,
                "&:hover": {
                  color: "#2098FF",
                  background: "transparent",
                },
              }}
              onClick={() => handleStatus(1)}
            >
              <BadgeCheck width="18px" style={{ marginRight: "4px" }} /> Mark as
              Confirmed
            </IconButton>
          ) : data.order_status === "confirmed" ? (
            <IconButton
              size="small"
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: "13px",
                mx: 2,
                "&:hover": {
                  color: "#2098FF",
                  background: "transparent",
                },
              }}
              onClick={handleConvertInvoice}
            >
              <FileMinus2 width="16px" style={{ marginRight: "4px" }} />
              Convert to Invoice
            </IconButton>
          ) : (
            <></>
          )}
          <Divider orientation="vertical" flexItem />
          <Box
            sx={{
              p: 1,
              backgroundColor: "transparent",
              cursor: "pointer",
              "&:hover": {
                color: "#2098FF", // sets color for both text and icon
              },
              "&:hover svg": {
                color: "#2098FF", // makes sure the SVG icon gets colored
              },
            }}
          >
            <IconButton size="small">
              <MoreVertIcon fontSize="small" onClick={toggleMoreOptions} />
            </IconButton>
            {isMoreOptions && (
              <Menu
                open={isMoreOptions}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={{
                  top: 177,
                  left:
                    data?.status === "void"
                      ? 690
                      : data?.status === "draft"
                      ? 1030
                      : data?.order_status === "confirmed"
                      ? 1030
                      : 850,
                }}
                elevation={3}
                sx={{ borderRadius: 2, fontSize: "13px !important" }}
                PaperProps={{
                  sx: {
                    width: "190px",
                    fontSize: "11px",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px",
                    mt: 1,
                  },
                }}
              >
                {data?.order_status === "draft" && (
                  <MenuItem
                    sx={{
                      backgroundColor: "transparent",
                      fontSize: "12px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                        borderRadius: "6px",
                        "& .menu-icon": {
                          color: "white !important",
                        },
                      },
                    }}
                    onClick={handleConvertInvoice}
                  >
                    Convert to Invoice
                  </MenuItem>
                )}

                <MenuItem
                  sx={{
                    backgroundColor: "transparent",
                    fontSize: "12px",
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: "6px",
                      "& .menu-icon": {
                        color: "white !important",
                      },
                    },
                  }}
                >
                  Convert to Purchase Order
                </MenuItem>

                {(data?.order_status === "confirmed" ||
                  data?.order_status === "closed") && (
                  <MenuItem
                    sx={{
                      backgroundColor: "transparent",
                      fontSize: "12px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                        borderRadius: "6px",
                        "& .menu-icon": {
                          color: "white !important",
                        },
                      },
                    }}
                    onClick={handleCancelItems}
                  >
                    Cancel Items
                  </MenuItem>
                )}

                {data?.order_status !== "draft" &&
                  data?.order_status !== "void" && (
                    <MenuItem
                      sx={{
                        backgroundColor: "transparent",
                        fontSize: "12px",
                        "&:hover": {
                          backgroundColor: "#408dfb",
                          color: "white",
                          borderRadius: "6px",
                          "& .menu-icon": {
                            color: "white !important",
                          },
                        },
                      }}
                      onClick={() => handleStatus(3)}
                    >
                      Void
                    </MenuItem>
                  )}

                <MenuItem
                  sx={{
                    backgroundColor: "transparent",
                    fontSize: "12px",
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: "6px",
                      "& .menu-icon": {
                        color: "white !important",
                      },
                    },
                  }}
                  onClick={() =>
                    router.push(
                      `/sales/salesOrder/new?clone_id=${data?.salesorder_id}`
                    )
                  }
                >
                  Clone
                </MenuItem>
                {data?.order_status !== "closed" && (
                  <MenuItem
                    onClick={handleClickOpen}
                    sx={{
                      backgroundColor: "transparent",
                      fontSize: "12px",
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                        borderRadius: "6px",
                        "& .menu-icon": {
                          color: "white !important",
                        },
                      },
                    }}
                  >
                    Delete
                  </MenuItem>
                )}
              </Menu>
            )}
          </Box>
          <Divider orientation="vertical" flexItem />
          <Dialog
            fullWidth="sm"
            open={openDelete}
            maxWidth="sm"
            sx={{
              "& .MuiPaper-root.MuiDialog-paper": {
                width: "436px",
                position: "absolute",
                top: 0,
              },
            }}
            onClose={handleDeleteClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogContent sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src={WarningIcon}
                alt="warning"
                style={{ width: "30px", height: "30px" }}
                priority
              />
              <DialogContentText
                sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
              >
                Sales Order will be deleted permanently and cannot be retrieved
                later. Are you sure you want to go ahead?
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ justifyContent: "flex-start" }}>
              <Button
                sx={{ ml: 1, width: "20px" }}
                autoFocus
                variant="outlined"
                className="button-submit"
                onClick={handleDelete}
              >
                Delete it
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleDeleteClose}
                autoFocus
                className="bulk-update-btn"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            fullWidth="sm"
            open={confirmDelete}
            maxWidth="sm"
            sx={{
              "& .MuiPaper-root.MuiDialog-paper": {
                width: "436px",
                position: "absolute", // Ensure absolute positioning
                top: 0, // Position at the top of the screen
              },
            }}
            onClose={handleConfirmDeleteClose}
          >
            <DialogContent sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src={WarningIcon}
                alt="warning"
                style={{ width: "30px", height: "30px", color: "red" }}
                priority
              />

              <DialogContentText sx={{ fontSize: "12px", color: "#212529" }}>
                You cannot undo this action. Proceed?
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ justifyContent: "flex-start" }}>
              <Button
                autoFocus
                variant="contained"
                onClick={() => {
                  handleDelete(); // Perform the delete operation
                  handleConfirmDeleteClose(); // Close the second dialog
                }}
              >
                Proceed
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleConfirmDeleteClose}
                autoFocus
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );

  const PDFToggle = () => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: 9,
        // mt: 1,
        mb: 1,
        px: 2,
      }}
    >
      {/* Left side: Bill Status */}
      <Box sx={{ display: "flex", alignItems: "center", minHeight: "24px" }}>
        {/* Received Status */}
        {data?.status !== "void" && data?.status !== "draft" && showPDFView ? (
          <Typography variant="body2" sx={{ color: "black", pr: 2 }}>
            Invoice Status:{" "}
            <span style={{ color: "green" }}>
              {data.invoiced_status_formatted}
            </span>
          </Typography>
        ) : (
          <Box sx={{ width: "150px" }} /> // spacing placeholder
        )}

        {/* Billed Status - only when status is exactly 'billed' */}
        {data?.billed_status === "billed" && (
          <Typography variant="body2" sx={{ color: "black" }}>
            Billed Status:{" "}
            <span style={{ color: "blue" }}>
              {data.billed_status_formatted}
            </span>
          </Typography>
        )}
      </Box>

      {/* Right side: PDF Toggle */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Show PDF View
        </Typography>
        <Switch
          checked={showPDFView}
          onChange={togglePDFView}
          inputProps={{ "aria-label": "toggle PDF view" }}
        />
      </Box>
    </Box>
  );

  return (
    <Paper>
      {loading ? (
        <>
          <Box
            sx={{
              Width: "8.27in",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "8.27in",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Skeleton variant="text" width={100} sx={{ mr: 1 }} />
                  <Skeleton
                    variant="rectangular"
                    width={40}
                    height={20}
                    sx={{ borderRadius: 10 }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Header />
          <Box
            sx={{
              height: "76vh",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {data?.status !== "void" && <CreditsAppliedSection />}
            <Box
              sx={{
                Width: "8.27in",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "8.27in",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <PDFToggle />
              </Box>
              {showPDFView ?  <PDFView />  : <NormalView />}
            </Box>
          </Box>
        </>
      )}
      {/* PDF Generation Loading Overlay */}
      {isPdfGenerating && (
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
          <Typography variant="h6">Generating PDF...</Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        fullWidth="sm"
        open={openDelete}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            width: "436px",
            position: "absolute",
            top: 0,
          },
        }}
        onClose={handleDeleteClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src={WarningIcon}
            alt="warning"
            style={{ width: "30px", height: "30px" }}
            priority
          />
          <DialogContentText sx={{ ml: 1, fontSize: "12px", color: "#212529" }}>
            Sales Order will be deleted permanently and cannot be retrieved
            later. Are you sure you want to go ahead?
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <Button
            sx={{ ml: 1, width: "20px" }}
            autoFocus
            variant="outlined"
            className="button-submit"
            onClick={handleDelete}
          >
            Delete it
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteClose}
            autoFocus
            className="bulk-update-btn"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Items Warning Dialog */}
      <Dialog
        fullWidth="sm"
        open={openCancelItems}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            width: "436px",
            position: "absolute",
            top: 0,
          },
        }}
        onClose={handleCancelItemsClose}
        aria-labelledby="cancel-items-dialog-title"
      >
        <DialogContent sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src={WarningIcon}
            alt="warning"
            style={{ width: "30px", height: "30px" }}
            priority
          />
          <DialogContentText sx={{ ml: 1, fontSize: "12px", color: "#212529" }}>
            There are no Item(s) available to be cancelled in the Sales
            Order(s).
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCancelItemsClose}
            autoFocus
            className="bulk-update-btn"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SalesView;
