"use client";
import React, { useState, useEffect } from "react";
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
  Switch,
  Button,
  Divider,
  IconButton,
  Collapse,
  Tooltip,
  Menu,
  MenuItem,
  Popper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeSharpIcon from "@mui/icons-material/AutoAwesomeSharp";
import CommentsDrawer from "../../common/commentAndHistory/CommentsDrawer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import IosShareSharpIcon from "@mui/icons-material/IosShareSharp";
import AlarmOffRoundedIcon from "@mui/icons-material/AlarmOffRounded";
import PriceChangeRoundedIcon from "@mui/icons-material/PriceChangeRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import BrowserUpdatedOutlinedIcon from "@mui/icons-material/BrowserUpdatedOutlined";
import FolderDeleteOutlinedIcon from "@mui/icons-material/FolderDeleteOutlined";
import { useRouter } from "next/navigation";
import html2pdf from "html2pdf.js";
import {
  Ban,
  BookCopy,
  ClockArrowDown,
  EllipsisVertical,
  FilePen,
  FileText,
  Mail,
  MailCheck,
  Pencil,
  Printer,
  Trash,
  RefreshCcw,
} from "lucide-react";
import { ArrowDropDown, ToggleOff, ToggleOn } from "@mui/icons-material";
import apiService from "../../../../src/services/axiosService";
import config from "../../../../src/services/config";
import { useSnackbar } from "../../../../src/components/SnackbarProvider";
import WarningIcon from "../../../../src/assets/icons/warning-img.png";
import Image from "next/image";
import { el } from "date-fns/locale";
import LoopIcon from "@mui/icons-material/Loop";
import { useParams } from "react-router-dom";

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  color: "white",
  "&:hover": {
    backgroundColor: "#3e8e41",
  },
  textTransform: "none",
  padding: "2px 10px",
}));
const SectionDivider = ({ sx }) => (
  <Box
    sx={{
      borderBottom: 0.5,
      borderColor: "divider",

      opacity: 1.5,
    }}
  />
);

// Main container with scrolling
const ScrollableContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  overflow: "auto",
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: "0 auto",
}));

const InvoiceView = ({
  data,
  callRecordPay,
  callViewAPI,
  organizationData,
  journalId
}) => {
  const [expandedSection, setExpandedSection] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isAttachFiles, setIsAttachFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPDFView, setShowPDFView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [organization_id, setOrganizationId] = useState("");
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [isZoho, setIsZoho] = useState(false);

  useEffect(() => {
    // Access localStorage only on client side
    if (typeof window !== "undefined") {
      setOrganizationId(localStorage.getItem("organization_id") || "");
    }
  }, []);

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/invoices?org_id=${organization_id}&invoice_id=${data.invoice_id}`,
        customBaseUrl: config.SO_Base_url,
      });
      const dataInvoice = response.data;
      showMessage(dataInvoice.message, "success");
      setOpenDelete(false);
      router.push(`/sales/invoices`);
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      showMessage(err.message, "error");
    }
  };

  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    localStorage.setItem("invoiceId", data?.invoice_id);
    router.push("/tally/preview?isStatus=Invoice");
  };

  const generatePDF = () => {
    setIsPdfGenerating(true); // Show loading state
    setShowPDFView(true);
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
          filename: `Invoice-${data.quote_id || "document"}.pdf`,
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

  const togglePDFView = () => {
    setShowPDFView(!showPDFView);
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

  const handleSendOpen = () => {
    setIsSendOpen(true);
  };

  const handleReminderOpen = () => {
    setIsReminderOpen(true);
  };

  const handlePdfOpen = () => {
    setIsPdfOpen(true);
  };

  const handleRecordOpen = () => {
    setIsRecordOpen(true);
  };

  const handleInvoice = () => {
    router.push(`/sales/invoices/new?invoice_id=${data.invoice_id}`);
  };

  const handleRecurringInvoice = () => {
    router.push(`/sales/recurringInvoice/new?invoice_id=${data.invoice_id}`);
  };

  const handleEditClick = () => {
    if (data?.invoice_id) {
      router.push(`/sales/invoices/edit/${data.invoice_id}`);
    } else {
      console.error("Invoice ID not found");
    }
  };

  const getBgColor = () => {
    if (data?.status === "draft") {
      return "#94a5a6";
    } else if (
      data?.status === "closed" ||
      data?.status === "partially paid" ||
      data?.status === "paid"
    ) {
      return "#1fcd6d";
    } else if (data?.status === "confirmed" || data?.status === "sent") {
      return "#2098FF";
    } else if (data?.status === "void") {
      return "#474747";
    } else if (data?.status === "overdue") {
      return "#F59D00";
    }
  };

  const tableview = () => {
    router.push("/sales/invoices");
  };

  // PDF View Component
  const PDFView = () => (
    <Box>
      <Paper
        elevation={4}
        id="pdf-view-container" // Add this ID to ensure the element can be queried
        sx={{
          p: 4,
          position: "relative",
          mb: 2,
          width: "8.27in",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            backgroundColor: getBgColor(),
            position: "absolute",
            color: "white",
            padding: "6px",
            transform: "rotate(-45deg)",
            transformOrigin: "center",
            top: "19px",
            left: "-30px",
            whiteSpace: "nowrap",
            // fontSize:"10px !important",
            fontWeight: "small",
            width: "132px",
            textAlign: "center",
          }}
        >
          {" "}
          {data?.status_formatted}{" "}
        </Box>

        <Grid container spacing={2}>
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
                {organizationData?.city}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.state}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.country}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                {organizationData?.phone}
              </Typography>
              {data?.billing_address && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "black",
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                      mb: 0,
                      fontWeight: 600,
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
                    {data?.billing_address?.attention}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.billing_address?.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.billing_address?.street2}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.billing_address?.city}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.billing_address?.zip} {data?.billing_address?.state}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.billing_address?.country}
                  </Typography>
                </Box>
              )}
              {data?.shipping_address && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "black",
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                      mb: 0,
                      fontWeight: 600,
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
                    {data?.shipping_address?.attention}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.shipping_address?.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.shipping_address?.street2}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.shipping_address?.city}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.shipping_address?.zip}{" "}
                    {data?.shipping_address?.state}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "13px",
                    }}
                  >
                    {data?.shipping_address?.country}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mt: 2,
                fontFamily: "'Times New Roman', serif",
              }}
            >
              TAX INVOICE
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "black",
                fontFamily: "'Times New Roman', serif",
                fontWeight: "600",
                mt: 1,
              }}
            >
              # {data?.invoice_number}
            </Typography>
            <Box sx={{ mt: 5 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} textAlign="right">
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontWeight: "600",
                    }}
                  >
                    Balance Due
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={1}
                    sx={{
                      fontFamily: "'Times New Roman', serif",
                      fontWeight: "600",
                    }}
                  >
                    {data?.balance_formatted}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Grid container>
                <Grid item xs={7} textAlign="right">
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif" }}
                  >
                    Invoice Date :
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={1}
                    sx={{ fontFamily: "'Times New Roman', serif" }}
                  >
                    Terms :
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={1}
                    sx={{ fontFamily: "'Times New Roman', serif" }}
                  >
                    Due Date :
                  </Typography>
                </Grid>
                <Grid item xs={5} textAlign="right">
                  <Typography variant="body2">
                    {data?.date_formatted}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {data?.payment_terms_label}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {data?.due_date_formatted}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 1, ml: 7 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontFamily: "'Times New Roman', serif",
                }}
              >
                Place of Supply : {data?.place_of_supply}
              </Typography>
            </Box>
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
            <TableBody>{renderTableContent()}</TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} sx={{ mt: 2, mr: 2 }}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Grid container justifyContent="flex-end">
              <Grid item xs={8}>
                <Grid container>
                  <Grid item xs={8} textAlign="right" sx={{ pr: 5 }}>
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
                    {data?.discount_amount !== 0 && (
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                      >
                        Discount
                      </Typography>
                    )}
                    {data?.tax_total !== 0 && (
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                      >
                        Amount Withheld(Section 194 H)
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                    >
                      Total
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right" sx={{ pr: 5 }}>
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
                        ₹{parseFloat(data?.adjustment || 0).toFixed(2)}
                        {/* {data?.adjustment} */}
                      </Typography>
                    )}
                    {data?.discount_amount !== 0 && (
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                      >
                        {data?.discount_amount_formatted}
                      </Typography>
                    )}
                    {data?.tax_total !== 0 && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Times New Roman', serif",
                          my: 3.7,
                          color: data?.tax_type === "TDS" ? "red" : "",
                        }}
                      >
                        {data?.tax_type === "TDS"
                          ? `(-)${data?.tax_total_formatted}`
                          : data?.tax_total}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
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
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: "'Times New Roman', serif", pb: 1 }}
            >
              Notes
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: "'Times New Roman', serif", pb: 1 }}
            >
              Thanks for your business
            </Typography>
          </Box>
          <Box sx={{ mt: 5 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: "'Times New Roman', serif", pb: 1 }}
            >
              Authorized Signature _______________
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: "13px", color: "#757575" }}>
          PDF Template: `Spreadsheet Template` Change ( View sample PDF )
        </Typography>
      </Box>
    </Box>
  );
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getJournals = async (journal_id) => {
    if (!journal_id) return;
    setLoading(true);
    try {
      let orgId = localStorage.getItem("organization_id");
      const params = {
        url: `/api/v1/get-individual-journal?journal_id=${journal_id}&org_id=${orgId}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };

      await new Promise((resolve) => setTimeout(resolve, 800));
      const response = await apiService(params);

      if (response?.data?.data?.line_items) {
        setItems(response.data.data.line_items);
      }
      console.log(response, "responseresponse");
    } catch (error) {
      console.error("Error fetching journal:", error);
      showMessage("Failed to load journal", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (journalId) {
      getJournals(journalId);
      console.log(journalId,"orgIdorgId")
    }
  }, [journalId]);

  const BillSection = () => (
    <Paper
      elevation={0}
      sx={{ px: 2, mb: 6, boxShadow: "none", border: "2px solid #f9f9fb" }}
    >
      <Box sx={{ px: 2, paddingTop: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "600", fontSize: "13px" }}
        >
          Journal
        </Typography>
        <Box
          sx={{
            mt: 1,
            fontSize: "12px",
            color: "#666",
            display: "flex",
            alignItems: "center",
            fontWeight: "400",
          }}
        >
          Account is displayed in your base currency.
          <Box
            sx={{
              ml: 1,
              backgroundColor: "green",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "darkgreen" },
              padding: "2px 10px",
              fontSize: "9px",
              fontWeight: "600",
            }}
          >
            INR
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "600", fontSize: "16px" }}
        >
          Invoice
        </Typography>
      </Box>

      <TableContainer sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                width="33%"
                sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
              >
                ACCOUNT
              </TableCell>
              <TableCell
                width="33%"
                align="right"
                sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
              >
                DEBIT
              </TableCell>
              <TableCell
                width="33%"
                align="right"
                sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
              >
                CREDIT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "black !important",
                  }}
                >
                  {item.coa_account_name}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ borderBottom: "none", color: "black !important" }}
                >
                  {item.creditOrDebit === "Debit"
                    ? item.amount_formatted
                    : "0.00"}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ borderBottom: "none", color: "black !important" }}
                >
                  {item.creditOrDebit === "Credit"
                    ? item.amount_formatted
                    : "0.00"}
                </TableCell>
              </TableRow>
            ))}

            {/* Total Row */}
            <TableRow sx={{ borderTop: "1px solid #ddd" }}>
              <TableCell></TableCell>
              <TableCell
                align="right"
                sx={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "black !important",
                }}
              >
                {items
                  .filter((item) => item.creditOrDebit === "Debit")
                  .reduce((sum, item) => sum + Number(item.amount || 0), 0)
                  .toFixed(2)}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "black !important",
                }}
              >
                {items
                  .filter((item) => item.creditOrDebit === "Credit")
                  .reduce((sum, item) => sum + Number(item.amount || 0), 0)
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
  const handleSO = (id) => {
    router.push(`/sales/salesOrder/${id}`);
  };
  const handlePaymentReceived = (id) => {
    router.push(`/sales/paymentsReceived/${id}`);
  };
  // Credits Applied Section Component
  const CreditsAppliedSection = () => (
    <Box>
      {data?.status === "draft" && (
        <Paper
          sx={{
            p: 0,
            boxShadow: "none",
            border: "1px solid #ddd",
            margin: "24px",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <AutoAwesomeSharpIcon sx={{ color: "#5C6BC0", mr: 1 }} />
            <Typography variant="caption">
              <strong>WHAT`S NEXT?</strong> Send this Invoice to your customer
              or mark it as Sent.
            </Typography>
            <Button
              size="small"
              className="button-submitadd"
              variant="contained"
              sx={{
                ml: 2,
                width: "95px !important",
                boxShadow: "none",
                textTransform: "none",
                height: "28px",
                fontSize: "12px !important",
              }}
              onClick={() =>
                router.push(`/sales/invoices/${data?.invoice_id}/email`)
              }
            >
              Send Invoice
            </Button>
            <Button
              size="small"
              sx={{
                width: "95px !important",
                fontSize: "12px !important",
                color: "#353839",
                ml: 2,
                textTransform: "none",
                border: "1px solid #ddd",
                bgcolor: "white",
                "&:hover": { bgcolor: "#f8f8f8" },
              }}
              onClick={() => handleStatus("sent")}
            >
              Mark As Sent
            </Button>
          </Box>
        </Paper>
      )}
      {(data?.status === "sent" || data?.status === "overdue") && (
        <Paper
          sx={{
            p: 0,
            boxShadow: "none",
            border: "1px solid #ddd",
            margin: "24px",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <AutoAwesomeSharpIcon sx={{ color: "#5C6BC0", mr: 1 }} />
            <Typography variant="caption">
              <strong>WHAT`S NEXT?</strong>{" "}
              {data?.status === "sent"
                ? "Invoice has been sent. Record payment for it as soon as you receive payment."
                : "Payment is overdue. Send a payment reminder or record payment."}{" "}
              <span style={{ color: "#408dfb", cursor: "pointer" }}>
                Learn More
              </span>
            </Typography>
            <Button
              size="small"
              className="button-submitadd"
              variant="contained"
              sx={{
                ml: 2,
                width: "115px !important",
                boxShadow: "none",
                textTransform: "none",
                height: "28px",
                fontSize: "12px !important",
              }}
              onClick={() => callRecordPay()}
            >
              Record Payment
            </Button>
          </Box>
        </Paper>
      )}
      {data?.status === "partially paid" && (
        <Paper
          sx={{
            p: 0,
            boxShadow: "none",
            border: "1px solid #ddd",
            margin: "24px",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <AutoAwesomeSharpIcon sx={{ color: "#5C6BC0", mr: 1 }} />
            <Typography variant="caption">
              <strong>WHAT`S NEXT?</strong> Invoice has been partially paid.
              Record payment for it as soon as you receive the full payment.{" "}
              <span style={{ color: "#408dfb", cursor: "pointer" }}>
                Learn More
              </span>
            </Typography>
            <Button
              size="small"
              className="button-submitadd"
              variant="contained"
              sx={{
                ml: 2,
                width: "115px !important",
                boxShadow: "none",
                textTransform: "none",
                height: "28px",
                fontSize: "12px !important",
              }}
              onClick={() => callRecordPay()}
            >
              Record Payment
            </Button>
          </Box>
        </Paper>
      )}
      {(data?.status === "paid" || data?.status === "partially paid") && (
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
              Payment Received
              <Typography
                component="span"
                sx={{ ml: 1, fontSize: "12px", color: "#408dfb" }}
              >
                {data?.payments?.length}
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
                          Payment#
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Reference#
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Payment Mode
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
                        {/* <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem !important",
                            backgroundColor: "white !important",
                          }}
                        ></TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.payments?.map((row) => (
                        <>
                          <TableRow sx={{ height: 20 }}>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.date}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "#408dfb !important" }}
                              onClick={() =>
                                handlePaymentReceived(row?.payment_id)
                              }
                            >
                              {row?.payment_id}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.refrence_number}
                            </TableCell>
                            <TableCell align="left" sx={{ color: "black" }}>
                              <span style={{ fontSize: "15px", color: "#999" }}>
                                •{" "}
                              </span>{" "}
                              {row?.payment_mode}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.amount}
                            </TableCell>
                            {/* <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "#408dfb !important",
                              }}
                            >
                              <IconButton size="small" sx={{ color: "inherit" }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <Box sx={{ fontSize: 14 }}>Edit</Box>
                            </Box>
                            <IconButton size="small">
                              <DeleteOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Box>
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

      {data?.salesorders?.length !== 0 && (
        <Paper
          sx={{
            p: 0,
            boxShadow: "none",
            border: "1px solid #ddd",
            margin: "24px",
            borderRadius: 1,
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
              Associated sales orders
              <Typography
                component="span"
                sx={{ ml: 1, fontSize: "12px", color: "#408dfb" }}
              >
                {data?.salesorders?.length}
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
              <Box sx={{}}>
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
                          Sales Order#
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
                          Shipment Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.salesorders?.map((row) => (
                        <>
                          <TableRow sx={{ height: 20 }}>
                            {/* Reduced row height */}
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.date_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "#408dfb !important" }}
                              onClick={() => handleSO(row.salesorder_id)}
                            >
                              {row?.salesorder_number}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "#879697 !important" }}
                            >
                              {row?.status_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "black !important" }}
                            >
                              {row?.shipment_date_formatted}
                            </TableCell>
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
            {data?.invoice_number}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={toggleMode}
          >
            {isZoho ? (
              <ToggleOff sx={{ color: "#888", fontSize: 32 }} />
            ) : (
              <ToggleOn sx={{ color: "#336699", fontSize: 32 }} />
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
            module={"Invoice"}
          />

          <Box onClick={tableview}>
            <IconButton size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {isMoreOptions && (
            <Menu
              open={isMoreOptions}
              onClose={handleClose}
              anchorReference="anchorPosition"
              anchorPosition={{
                top: 177,
                left:
                  data?.status === "void"
                    ? 800
                    : data?.status === "draft"
                    ? 990
                    : 850,
              }}
              elevation={3}
              sx={{ borderRadius: 2 }}
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
              {data?.status === "draft" && (
                <>
                  <MenuItem
                    sx={{
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      "& svg": {
                        color: "#408dfb",
                      },
                      "&:hover svg": {
                        color: "white",
                      },
                      "&:hover": {
                        backgroundColor: "#408dfb",
                        color: "white",
                        borderRadius: "6px",
                        "& .menu-icon": {
                          color: "white !important",
                        },
                      },
                    }}
                    onClick={() => handleStatus("sent")}
                  >
                    <MailCheck width="13px" style={{ marginRight: "10px" }} />
                    Mark as Sent
                  </MenuItem>
                  <SectionDivider sx={{ my: 4 }} />
                </>
              )}

              <MenuItem
                sx={{
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  "& svg": {
                    color: "#408dfb",
                  },
                  "&:hover svg": {
                    color: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: "6px",
                    "& .menu-icon": {
                      color: "white !important",
                    },
                  },
                }}
                onClick={handleRecurringInvoice}
              >
                <RefreshCcw width="13px" style={{ marginRight: "10px" }} />
                Make Recurring
              </MenuItem>

              {/* <MenuItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: 2,
                  },
                }}
              >
                Create Credit Note
              </MenuItem> */}

              <MenuItem
                sx={{
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  "& svg": {
                    color: "#408dfb",
                  },
                  "&:hover svg": {
                    color: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: "6px",
                    "& .menu-icon": {
                      color: "white !important",
                    },
                  },
                }}
                onClick={handleInvoice}
              >
                <BookCopy width="13px" style={{ marginRight: "10px" }} />
                Clone
              </MenuItem>
              {data?.status === "void" && (
                <MenuItem
                  sx={{
                    backgroundColor: "transparent",
                    fontSize: "14px",
                    "& svg": {
                      color: "#408dfb",
                    },
                    "&:hover svg": {
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: "6px",
                      "& .menu-icon": {
                        color: "white !important",
                      },
                    },
                  }}
                  onClick={() => handleStatus("draft")}
                >
                  <Ban width="13px" style={{ marginRight: "10px" }} />
                  Convert to Draft
                </MenuItem>
              )}

              {data?.status !== "paid" && data?.status !== "void" && (
                <MenuItem
                  sx={{
                    backgroundColor: "transparent",
                    fontSize: "14px",
                    "& svg": {
                      color: "#408dfb",
                    },
                    "&:hover svg": {
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: "6px",
                      "& .menu-icon": {
                        color: "white !important",
                      },
                    },
                  }}
                  onClick={() => handleStatus("void")}
                >
                  <Ban width="13px" style={{ marginRight: "10px" }} />
                  Void
                </MenuItem>
              )}

              {/* <MenuItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: 2,
                  },
                }}
              >
                View Journal
              </MenuItem> */}
              <MenuItem
                sx={{
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  "& svg": {
                    color: "#408dfb",
                  },
                  "&:hover svg": {
                    color: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: "6px",
                    "& .menu-icon": {
                      color: "white !important",
                    },
                  },
                }}
                onClick={() => {
                  setOpenDelete(true);
                  handleClose();
                }}
              >
                <Trash width="13px" style={{ marginRight: "10px" }} />
                Delete
              </MenuItem>
              {/* <MenuItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: 2,
                  },
                }}
              >
                Invoice Reference
              </MenuItem> */}
            </Menu>
          )}
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
          {data?.status !== "void" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  paddingRight: 2,
                  cursor: "pointer",
                  "& svg": {
                    color: "#222",
                  },
                  "&:hover": {
                    color: "#2098FF", // sets color for both text and icon
                  },
                  "&:hover svg": {
                    color: "#2098FF", // makes sure the SVG icon gets colored
                  },
                }}
                onClick={handleEditClick}
              >
                <Pencil width="14px" style={{ marginRight: "4px" }} /> Edit
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          {/* Send */}
          {data?.status !== "void" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  paddingRight: 2,
                  cursor: "pointer",
                  color: "#222",
                  "& svg": {
                    color: "#222",
                  },
                  "&:hover": {
                    color: "#2098FF", // sets color for both text and icon
                  },
                  "&:hover svg": {
                    color: "#2098FF", // makes sure the SVG icon gets colored
                  },
                }}
                onClick={() =>
                  router.push(`/sales/invoices/${data?.invoice_id}/email`)
                }
              >
                <IconButton size="small">
                  <Mail width="16px" />
                </IconButton>
                <Box>Send</Box>
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          {/*Reminder */}

          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={handleReminderOpen}
          >
            <IconButton size="small">
              <IosShareSharpIcon fontSize="small" />
            </IconButton>
            <Box>Share</Box>
          </Box> */}

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
            anchorPosition={{
              top: 177,
              left: data?.status === "void" ? 587 : 740,
            }}
            elevation={3}
            sx={{ borderRadius: 2 }}
            PaperProps={{
              sx: {
                width: "100px",
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
                fontSize: "14px",
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
              <FileText width="13px" style={{ marginRight: "5px" }} />
              PDF
            </MenuItem>

            <MenuItem
              onClick={handleClose}
              sx={{
                backgroundColor: "transparent",
                fontSize: "14px",
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
              <Printer width="13px" style={{ marginRight: "5px" }} />
              Print
            </MenuItem>
            {/* <MenuItem
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: 2,
                },
              }}
            >
              <InsertDriveFileOutlinedIcon
                fontSize="small"
                sx={{ marginRight: 1 }}
              />
              Print Delivery Note
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: 2,
                },
              }}
            >
              <FileOpenOutlinedIcon fontSize="small" sx={{ marginRight: 1 }} />
              Print Packing Slip
            </MenuItem> */}
          </Menu>
          {data?.status === "void" && (
            <>
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
                onClick={() => handleStatus("draft")}
              >
                <FilePen width="16px" style={{ marginRight: 3 }} />
                Convert to Draft
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}
          {/*Record Payment */}
          {data?.status !== "paid" && data?.status !== "void" && (
            <>
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
                onClick={() => callRecordPay()}
              >
                <ClockArrowDown width="16px" style={{ marginRight: 3 }} />
                Record Payment
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          <Box
            sx={{
              p: 1,
              borderRight: "1px solid #ddd",
              backgroundColor: "transparent",
              borderRight: "1px solid #ddd",
              cursor: "pointer",
              "& svg": {
                color: "#222",
              },
              "&:hover": {
                color: "#2098FF", // sets color for both text and icon
              },
              "&:hover svg": {
                color: "#2098FF", // makes sure the SVG icon gets colored
              },
            }}
            onClick={toggleMoreOptions}
          >
            <EllipsisVertical
              width="20px"
              style={{
                marginRight: "3px",
                marginLeft: "3px",
                fontWeight: "700",
              }}
            />
          </Box>
          <Box></Box>
        </Box>
      </Box>
    </Box>
  );

  // Fix for the DOM nesting issue - replace div inside tbody with TableRow and TableCell
  const renderTableContent = () => {
    if (data?.line_items?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <Typography>No items found</Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    return data?.line_items?.map((row, index) => (
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
          ₹{parseFloat(row?.item_total || 0).toFixed(2)}
          {/* {row?.item_total} */}
        </TableCell>
      </TableRow>
    ));
  };

  const handleStatus = async (value) => {
    try {
      let formattedData = {};
      if (value === "sent") {
        formattedData.status = "sent";
        formattedData.status_formatted = "Sent";
      } else if (value === "void") {
        formattedData.status = "void";
        formattedData.status_formatted = "Void";
      } else if (value === "draft") {
        formattedData.status = "draft";
        formattedData.status_formatted = "Draft";
      }

      const response = await apiService({
        method: "PUT",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/invoices/status?organization_id=${organization_id}&invoice_id=${data?.invoice_id}`,
        data: formattedData,
      });

      const message = response.data.message;
      showMessage(message, "success");

      // Update the local state dynamically
      callViewAPI(data.invoice_id);
    } catch (err) {
      console.error("API Error:", err);
      showMessage(err.message || "An unexpected error occurred.", "error");
    }
  };

  return (
    <>
      <Paper sx={{ borderLeft: "1px solid #ddd" }}>
        <Header />
        <Box
          sx={{
            height: "80vh", // Full viewport height
            overflow: "auto", // Enables vertical scrolling
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <CreditsAppliedSection />

          <Box
            sx={{
              Width: "8.27in",
              margin: "auto",
              marginTop:
                data?.status === "void" && data?.salesorders.length === 0
                  ? "25px"
                  : "",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PDFView />
          </Box>

          <BillSection />

          <Dialog
            fullWidth="sm"
            open={openDelete}
            maxWidth="sm"
            sx={{
              "& .MuiPaper-root.MuiDialog-paper": {
                width: "436px",
                top: 0,
                position: "absolute",
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
                Invoice will be deleted permanently and cannot be retrieved
                later. Are you sure you want to go ahead?
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ justifyContent: "flex-start" }}>
              <Button
                size="small"
                sx={{ ml: 1, width: "85px", fontSize: "13px" }}
                autoFocus
                variant="contained"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleDeleteClose}
                autoFocus
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
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
        </Box>
      </Paper>
    </>
  );
};

export default InvoiceView;
