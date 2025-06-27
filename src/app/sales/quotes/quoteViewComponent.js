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
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
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
import CommentsDrawer from "../../common/commentAndHistory/CommentsDrawer";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import FolderDeleteOutlinedIcon from "@mui/icons-material/FolderDeleteOutlined";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  BookCopy,
  EllipsisVertical,
  FileCheck2,
  FileMinus,
  FileMinus2,
  FileText,
  FileX2,
  Mail,
  MailCheck,
  Pencil,
  Printer,
  Repeat,
  ShoppingCart,
  Trash,
} from "lucide-react";
import { ArrowDropDown, IosShare, Shuffle } from "@mui/icons-material";
import { useSnackbar } from "../../../components/SnackbarProvider";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import SettingsIcon from "@mui/icons-material/Settings";
import Image from "next/image";
import WarningIcon from "@mui/icons-material/Warning";
import html2pdf from "html2pdf.js";
import theme from "../../theme";

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

const QuotesView = ({ data, callViewAPI,organizationData }) => {
  const [expandedSection, setExpandedSection] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isAttachFiles, setIsAttachFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showMessage } = useSnackbar();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPDFView, setShowPDFView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showCannotDeleteDialog, setShowCannotDeleteDialog] = useState(false); // For the "cannot delete" dialog
  const [dataState, setData] = useState(data); // Rename `data` to `dataState` for clarity
  const router = useRouter();
  const [isConvert, setIsConvert] = useState(false);
  const [showConvertWarning, setShowConvertWarning] = useState(false);
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
          filename: `Quote-${data.quote_id || "document"}.pdf`,
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
            if (callViewAPI) {
              callViewAPI();
            }
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
    setIsMoreOptions(false);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleConvert = () => {
    setIsConvert(true);
  };

  const handleEditClick = () => {
    router.push(`/sales/quotes/edit/${data.quote_id}`);
  };
  const handleInvoice = (id) => {
    router.push(`/sales/invoices/${id}`);
  };
  // convert to invoice
  const handleConvertInvoice = () => {
    router.push(`/sales/invoices/new?quote_id=${data.quote_id}`);
  };

  const handleConvertSO = () => {
    if (data?.status !== "accepted") {
      setShowConvertWarning(true); // Show the warning dialog
      return;
    }
    router.push(`/sales/salesOrder/new?quote_id=${data.quote_id}`);
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

  const tableview = () => {
    router.push("/sales/quotes");
  };
  const [isZoho, setIsZoho] = useState(true);
  // const navigate = useNavigate(); // Initialize navigation

  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    localStorage.setItem("quoteId", data?.quote_id);
    router.push("/tally/preview?isStatus=Quote"); // Navigate on toggle
  };

  const getBgColor = () => {
    if (data?.status === "draft") {
      return "#94a5a6"; // Grey
    } else if (data?.status === "accepted" || data?.status === "invoiced") {
      return "#28a745"; // Green
    } else if (data?.status === "declined") {
      return "#f59d00"; // Orange
    } else if (data?.status === "sent") {
      return "#2098FF"; // Blue
    }
  };

  const organization_id = localStorage.getItem("organization_id");

  const handleStatus = async (value) => {
    try {
      setIsMoreOptions(false);
      let formattedData = {};
      if (value === 1) {
        formattedData.status = "sent";
        formattedData.status_formatted = "Sent";
      } else if (value === 3) {
        formattedData.status = "accepted";
        formattedData.status_formatted = "Accepted";
      } else if (value === 4) {
        formattedData.status = "declined";
        formattedData.status_formatted = "Declined";
      }

      const response = await apiService({
        method: "PUT",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/estimate/status?organization_id=${organization_id}&quote_id=${dataState?.quote_id}`,
        data: formattedData,
      });

      const message = response.data.message;
      showMessage(message, "success");
      callViewAPI(data?.quote_id);

      // Update the local state dynamically
      setData((prevData) => ({
        ...prevData,
        status: formattedData.status,
        status_formatted: formattedData.status_formatted,
      }));
    } catch (err) {
      console.error("API Error:", err);
      showMessage(err.message || "An unexpected error occurred.", "error");
    }
  };

  // PDF View Component
  const PDFView = () => (
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
          top: "15px",
          left: "-30px",
          whiteSpace: "nowrap",
          fontWeight: "small",
          width: "120px",
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
              sx={{ fontSize: "13px", fontFamily: "'Times New Roman', serif" }}
            >
              {organizationData?.state}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "13px", fontFamily: "'Times New Roman', serif" }}
            >
              {organizationData?.country}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "13px", fontFamily: "'Times New Roman', serif" }}
            >
              {organizationData?.phone}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "13px", fontFamily: "'Times New Roman', serif" }}
            >
               {organizationData?.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "13px", fontFamily: "'Times New Roman', serif" }}
            >
              GSTIN:  {organizationData?.gst_in}
            </Typography>
            {data?.billing_address && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "black",
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "13px",
                    mb: 2,
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
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "black",
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "13px",
                    mb: 2,
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
                  {data?.shipping_address?.zip} {data?.shipping_address?.state}
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
            QUOTE
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "black", fontFamily: "'Times New Roman', serif" }}
          >
            Quote# {data?.estimate_number}
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Grid container spacing={1}>
              <Grid item xs={9} textAlign="right">
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Times New Roman', serif" }}
                >
                  Order Date :
                </Typography>
                <Typography
                  variant="body2"
                  mt={1}
                  sx={{ fontFamily: "'Times New Roman', serif" }}
                >
                  Expiry Date :
                </Typography>
                {data?.reference_number && (
                  <Typography
                    variant="body2"
                    mt={1}
                    sx={{ fontFamily: "'Times New Roman', serif" }}
                  >
                    Ref# :
                  </Typography>
                )}
              </Grid>
              <Grid item xs={3} textAlign="left">
                <Typography variant="body2">{data?.date_formatted}</Typography>
                <Typography variant="body2" mt={1}>
                  {data?.expiry_date_formatted}
                </Typography>
                {data?.reference_number && (
                  <Typography variant="body2" mt={1}>
                    {data?.reference_number}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 1, ml: 7 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", fontFamily: "'Times New Roman', serif" }}
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
        <Table sx={{ width: 680, boxShadow: "none" }}>
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
                    ₹{parseFloat(row?.item_total || 0).toFixed(2)}
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
          <Grid
            container
            justifyContent="space-around"
            sx={{ justifyContent: "flex-end", pr: 3 }}
          >
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={10} textAlign="right" sx={{ pr: 3 }}>
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
                      ₹{parseFloat(data?.adjustment || 0).toFixed(2)}

                      {/* {data?.adjustment?.toFixed(2)} */}
                    </Typography>
                  )}
                  {data?.discount_amount_formatted !== 0 && (
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
                        ? `(-)${data?.tax_total?.toFixed(2)}`
                        : data?.tax_total?.toFixed(2)}
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
          <Typography variant="subtitle2" sx={{ pb: 1 }}>
            Authorized Signature _______________
          </Typography>
        </Box>
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
          {" "}
          {data?.status_formatted}{" "}
        </Box>
      </Box>
    </Paper>
  );

  const BillSection = () => (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        position: "relative",
        mb: 2,
        boxShadow: "none",
      }}
    >
      <Typography
        sx={{
          px: 2,
          mb: 6,
          fontSize: "13px",
          textAlign: "right",
          marginRight: "85px",
        }}
      >
        PDF Template : `Standard Template`{" "}
        <span style={{ color: "#408dfb" }}> Change</span>
      </Typography>
    </Paper>
  );

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
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              padding: "6px",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <AutoAwesomeIcon sx={{ color: "#5C6BC0", mr: 1 }} />
            <Typography variant="body2" fontSize="13px">
              <strong>WHAT`S NEXT?</strong> Go ahead and email this quote to
              your customer or simply mark it as sent.
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
                router.push(`/sales/quotes/${data?.quote_id}/email`)
              }
            >
              Send Quote
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
              onClick={() => handleStatus(1)}
            >
              Mark As Sent
            </Button>
          </Box>
        </Paper>
      )}
      {(data?.status === "sent" || data?.status === "accepted") && (
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
              padding: "6px",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <AutoAwesomeIcon sx={{ color: "#5C6BC0", mr: 1 }} />
            <Typography variant="body2" fontSize="13px">
              <strong>WHAT`S NEXT?</strong> Convert this quote to an invoice or
              a sales order.
            </Typography>
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
                top: 245,
                left: 1040,
              }}
              sx={{ borderRadius: 2 }}
              PaperProps={{
                sx: {
                  width: "150px",
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
                    borderRadius: "5px",
                    backgroundColor: theme.palette.hover?.background || "",
                    color: theme.palette.hover?.text || "",
                  },
                }}
              >
                Convert to Invoice
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsConvert(false);
                  handleConvertSO(); // Trigger PDF generation
                }}
                sx={{
                  backgroundColor: "transparent",
                  fontSize: "12px",
                  "&:hover": {
                    borderRadius: "5px",
                    backgroundColor: theme.palette.hover?.background || "",
                    color: theme.palette.hover?.text || "",
                  },
                }}
              >
                Convert to Sales Order
              </MenuItem>
            </Menu>
          </Box>
        </Paper>
      )}
      {data?.invoices.length !== 0 && (
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
                              sx={{ color: "#408dfb !important" }}
                              onClick={() => handleInvoice(row.invoice_id)}
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
            {data?.estimate_number}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Toggle Button */}
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={toggleMode}
          >
            {isZoho ? (
              <ToggleOnIcon sx={{ color: "#336699", fontSize: 32 }} /> // Visible color
            ) : (
              <ToggleOffIcon sx={{ color: "#888", fontSize: 32 }} /> // Visible color
            )}
            <Typography
              variant="body1"
              sx={{ ml: 1, color: "#333", fontWeight: "bold" }}
            >
            {"Zoho"}
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
            module={"Quote"}
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
                left: data?.status === "invoiced" ? 990 : 950,
              }}
              elevation={3}
              sx={{ borderRadius: 2 }}
              PaperProps={{
                sx: {
                  width: "170px",
                  fontSize: "11px",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                  borderRadius: "8px",
                  mt: 1,
                },
              }}
            >
              {data?.status === "draft" && (
                <MenuItem
                  onClick={() => handleStatus(1)}
                  sx={{
                    fontSize: "14px",
                    "& svg": { color: "#408dfb" },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.hover?.background || "#408dfb",
                      color: theme.palette.hover?.text || "white",
                      borderRadius: "6px",
                      "& svg": { color: theme.palette.hover?.text || "white" },
                    },
                  }}
                >
                  <MailCheck width="13px" style={{ marginRight: "10px" }} />
                  Mark as Sent
                </MenuItem>
              )}

              {(data?.status === "sent" || data?.status === "declined") && (
                <MenuItem
                  onClick={() => handleStatus(3)}
                  sx={{
                    fontSize: "14px",
                    "& svg": { color: "#408dfb" },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.hover?.background || "#408dfb",
                      color: theme.palette.hover?.text || "white",
                      borderRadius: "6px",
                      "& svg": { color: theme.palette.hover?.text || "white" },
                    },
                  }}
                >
                  <FileCheck2 width="13px" style={{ marginRight: "10px" }} />
                  Mark as Accepted
                </MenuItem>
              )}

              {(data?.status === "sent" || data?.status === "accepted") && (
                <MenuItem
                  onClick={() => handleStatus(4)}
                  sx={{
                    fontSize: "14px",
                    "& svg": { color: "#408dfb" },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.hover?.background || "#408dfb",
                      color: theme.palette.hover?.text || "white",
                      borderRadius: "6px",
                      "& svg": { color: theme.palette.hover?.text || "white" },
                    },
                  }}
                >
                  <FileX2 width="13px" style={{ marginRight: "10px" }} />
                  Mark as Declined
                </MenuItem>
              )}

              <MenuItem
                onClick={handleClone}
                sx={{
                  fontSize: "14px",
                  "& svg": { color: "#408dfb" },
                  "&:hover": {
                    backgroundColor:
                      theme.palette.hover?.background || "#408dfb",
                    color: theme.palette.hover?.text || "white",
                    borderRadius: "6px",
                    "& svg": { color: theme.palette.hover?.text || "white" },
                  },
                }}
              >
                <BookCopy width="13px" style={{ marginRight: "10px" }} />
                Clone
              </MenuItem>

              <MenuItem
                onClick={handleClickOpen}
                disabled={isDeleting}
                sx={{
                  fontSize: "14px",
                  "& svg": { color: "#408dfb" },
                  "&:hover": {
                    backgroundColor:
                      theme.palette.hover?.background || "#408dfb",
                    color: theme.palette.hover?.text || "white",
                    borderRadius: "6px",
                    "& svg": { color: theme.palette.hover?.text || "white" },
                  },
                }}
              >
                <Trash width="13px" style={{ marginRight: "10px" }} />
                Delete
              </MenuItem>
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

          {/* Send */}
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
            onClick={() => router.push(`/sales/quotes/${data?.quote_id}/email`)}
          >
            <IconButton size="small">
              <Mail width="16px" />
            </IconButton>
            <Box>Send</Box>
          </Box>
          <Divider orientation="vertical" flexItem />

          {/* <Menu
            open={isSendOpen}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 170, left: 600 }}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem
              onClick={() =>
                router.push(`/sales/quotes/${data?.quote_id}/email`)
              }
              sx={{
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: 2,
                },
              }}
            >
              <MailOutlineOutlinedIcon
                fontSize="13px"
                sx={{ marginRight: 1 }}
              />
              Send Email
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
              <QuestionAnswerRoundedIcon
                fontSize="13px"
                sx={{ marginRight: 1 }}
              />
              Send SMS
            </MenuItem>
          </Menu> */}

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
              <IosShare fontSize="13px" />
            </IconButton>
            <Box>Share</Box>
          </Box> */}
          {/*pdf */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              paddingRight: 0,
              cursor: "pointer",
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
            anchorPosition={{ top: 177, left: 740 }}
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
          </Menu>

          {/*Convert */}
          {data.invoices.length === 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  paddingRight: 0,
                  // borderRight: "1px solid #ddd",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#2098FF", // sets color for both text and icon
                  },
                  "&:hover svg": {
                    color: "#2098FF", // makes sure the SVG icon gets colored
                  },
                }}
                onClick={handleRecordOpen}
              >
                <Repeat width="14px" />
                <Box mx={0.5}>Convert</Box>
                <ArrowDropDown />
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  // borderRight: "1px solid #ddd",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#2098FF", // sets color for both text and icon
                  },
                  "&:hover svg": {
                    color: "#2098FF", // makes sure the SVG icon gets colored
                  },
                }}
                onClick={handleConvertInvoice}
              >
                <FileMinus width="13px" style={{ marginRight: "5px" }} />
                Convert to Invoice
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          <Menu
            open={isRecordOpen}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 177, left: 845 }}
            elevation={3}
            sx={{ borderRadius: 2 }}
            PaperProps={{
              sx: {
                width: "220px",
                fontSize: "11px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setIsRecordOpen(false);
                handleConvertInvoice(); // Trigger PDF generation
              }}
              sx={{
                backgroundColor: "transparent",
                fontSize: "13px",
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
            >
              <FileMinus width="18px" style={{ marginRight: "10px" }} />
              Convert to Invoice
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsRecordOpen(false);
                handleConvertSO(); // Trigger PDF generation
              }}
              sx={{
                backgroundColor: "transparent",
                fontSize: "13px",
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
            >
              <ShoppingCart width="18px" style={{ marginRight: "10px" }} />
              Convert to Sales Order
            </MenuItem>
          </Menu>

          <Box
            sx={{
              p: 1,
              borderRight: "1px solid #ddd",
              backgroundColor: "transparent",
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
          <Divider orientation="vertical" flexItem />
          <Box></Box>
        </Box>

        {/* <Box>
          <Box sx={{ borderLeft: "1px solid #ddd" }}>
            <Box
              sx={{
                p: 1,
                paddingRight: 1,
              }}
            >
              <IconButton size="small">
                <QuestionAnswerRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box> */}
      </Box>
    </Box>
  );

  // Add these handler functions
  const handleClone = () => {
    router.push(`/sales/quotes/new?clone_id=${data.quote_id}`);
  };

  const handleDelete = async () => {
    try {
      if (data?.status === "invoiced") {
        // Show the "cannot delete" dialog
        setShowCannotDeleteDialog(true);
        return;
      }

      setIsDeleting(true);
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/estimates/${data.quote_id}`,
        params: {
          organization_id: data.organization_id,
        },
        customBaseUrl: config.SO_Base_url,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.status) {
        showMessage("Quote deleted successfully", "success");
        setOpenDelete(false);
        if (callViewAPI) {
          callViewAPI();
        }
        router.push("/sales/quotes");
      } else {
        showMessage(
          response?.data?.message || "Failed to delete quote",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
      showMessage("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      handleClose();
      setOpenDelete(false);
    }
  };

  return (
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
              data?.status === "declined" && data?.salesorders.length === 0
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          fullWidth="sm"
          open={openDelete}
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root.MuiDialog-paper": {
              width: "436px",
              position: "absolute", // Ensure absolute positioning
              top: 0, // Position at the top of the screen
              margin: "16px",
            },
          }}
          onClose={handleDeleteClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ color: "#ff9800", fontSize: 30 }} />
            <DialogContentText
              sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
            >
              Quote will be deleted permanently and cannot be retrieved later.
              Are you sure you want to go ahead?
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ justifyContent: "flex-start" }}>
            <Button
              sx={{ ml: 1, width: "80px" }}
              autoFocus
              size="small"
              variant="contained"
              // className="button-submit"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
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
          open={showCannotDeleteDialog}
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root.MuiDialog-paper": {
              width: "436px",
              position: "absolute", // Ensure absolute positioning
              top: 0, // Position at the top of the screen
              margin: "16px",
            },
          }}
          onClose={() => setShowCannotDeleteDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ color: "red", fontSize: 30 }} />
            <DialogContentText
              sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
            >
              These quotes cannot be deleted as retainer invoice or invoices
              have been created for them.
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ justifyContent: "flex-start" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowCannotDeleteDialog(false)}
              autoFocus
              className="bulk-update-btn"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth="sm"
          open={showConvertWarning}
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root.MuiDialog-paper": {
              width: "436px",
              position: "absolute", // Ensure absolute positioning
              top: 0, // Position at the top of the screen
              margin: "16px",
            },
          }}
          onClose={() => setShowConvertWarning(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ color: "#ff9800", fontSize: 30 }} />
            <DialogContentText
              sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
            >
              Please note that only an accepted Quote can be converted to a
              Sales Order.
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ justifyContent: "flex-start" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowConvertWarning(false)}
              autoFocus
              className="bulk-update-btn"
            >
              OK
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
  );
};

export default QuotesView;
