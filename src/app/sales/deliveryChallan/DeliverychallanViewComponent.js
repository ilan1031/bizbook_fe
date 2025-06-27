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
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CommentIcon from "@mui/icons-material/Comment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CommentsDrawer from "../../common/commentAndHistory/CommentsDrawer";
import { useRouter } from "next/navigation";
import html2pdf from "html2pdf.js";
import WarningIcon from "@mui/icons-material/Warning";
import { useSnackbar } from "../../../components/SnackbarProvider";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import Image from "next/image";
import { EllipsisVertical, FileMinus2, FileText, Pencil } from "lucide-react";
import { ArrowDropDown } from "@mui/icons-material";

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

const DeliveryChallanViewComponent = ({ data, callViewAPI , organizationData }) => {
  const [expandedSection, setExpandedSection] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isAttachFiles, setIsAttachFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPDFView, setShowPDFView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { showMessage } = useSnackbar();
  const [dataState, setDataState] = useState(data);
  const [expandedInvoiceSection, setExpandedInvoiceSection] = useState(false);
  const [isInvoicedAlertOpen, setIsInvoicedAlertOpen] = useState(false);

  const toggleInvoiceSection = () => {
    setExpandedInvoiceSection((prev) => !prev);
  };

  const handleInvoice = (id) => {
    router.push(`/sales/invoices/${id}`);
  };

  const handleConvertInvoice = () => {
    router.push(
      `/sales/invoices/new?deliverychallan_id=${data.deliverychallan_id}`
    );
  };

  // Add this component before your return statement
  const InvoiceSection = () => (
    <Box>
      {data?.invoices?.length > 0 && (
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
          filename: `DC-${data.quote_id || "document"}.pdf`,
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
            // Optionally, call the callback API if needed
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
  const handleClickOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const router = useRouter();

  const tableview = () => {
    router.push("/sales/deliveryChallan");
  };
  const handleChallan = () => {
    router.push(
      `/sales/deliveryChallan/new?clone_id=${data.deliverychallan_id}`
    );
  };

  const handleEditClick = () => {
    if (data?.deliverychallan_id) {
      router.push(`/sales/deliveryChallan/edit/${data.deliverychallan_id}`);
    } else {
      console.error("Delivery Challan ID not found");
    }
  };

  const handleDelete = async () => {
    try {
      // Check if the delivery challan is invoiced
      if (data?.invoiced_status === "invoiced") {
        setIsInvoicedAlertOpen(true); // Show the alert popup
        setOpenDelete(false); // Ensure the delete confirmation dialog is closed
        return; // Exit the function early
      }

      // Retrieve organization_id from local storage or props
      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        throw new Error("Organization ID is missing. Please log in again.");
      }

      // Validate deliverychallan_id
      if (!data?.deliverychallan_id) {
        throw new Error("Delivery Challan ID is missing.");
      }

      // Make the DELETE API call
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/deliverychallans?organization_id=${organization_id}&deliverychallan_id=${data.deliverychallan_id}`,
        customBaseUrl: config.SO_Base_url,
      });

      // Handle success response
      const dataSales = response.data;
      showMessage(
        dataSales.message || "Challan deleted successfully","success");
      setOpenDelete(false);

      // Call the callback API to refresh the parent view
      if (callViewAPI) {
        callViewAPI();
      }
      router.push("/sales/deliveryChallan");
    } catch (err) {
      console.error("Failed to delete challan:", err);
      // Display user-friendly error messages
      if (err.message.includes("Organization ID")) {
        showMessage(
          "Failed to delete challan due to missing organization ID.",
          "error"
        );
      } else if (err.message.includes("Delivery Challan ID")) {
        showMessage(
          "Failed to delete challan due to missing delivery challan ID.",
          "error"
        );
      } else if (err?.response?.status === 404) {
        showMessage("Challan not found.", "error");
      } else if (err?.response?.status === 500) {
        showMessage("Server error occurred. Please try again later.", "error");
      } else {
        showMessage("An unexpected error occurred. Please try again.", "error");
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const organization_id = localStorage.getItem("organization_id");

      if (!data?.deliverychallan_id) {
        throw new Error("Delivery challan ID not found");
      }

      const response = await apiService({
        method: "PUT",
        url: `/api/v1/deliverychallan/status`,
        params: {
          organization_id: organization_id,
          deliverychallan_id: data?.deliverychallan_id,
        },
        data: {
          status: newStatus,
          status_formatted:
            newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
          invoiced_status: data?.invoiced_status,
        },
        customBaseUrl: config.SO_Base_url,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.status) {
        setDataState((prev) => ({
          ...prev,
          status: newStatus,
          status_formatted:
            newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        }));
        showMessage(`Status updated to ${newStatus} successfully`, "success");
        callViewAPI(data?.deliverychallan_id);
      } else {
        throw new Error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      if (error?.response?.status === 500) {
        showMessage("Server error. Please try again later.", "error");
      } else if (error?.response?.data?.message) {
        showMessage(error.response.data.message, "error");
      } else {
        showMessage(error.message || "Failed to update status", "error");
      }
    }
  };

  const getBgColor = () => {
    switch (dataState?.status) {
      case "draft":
        return "#94a5a6"; // Grey
      case "delivered":
        return "#1fcd6d"; // Green
      case "open":
        return "#2098FF"; // Blue
      case "returned":
        return "#3D2821"; // Red
      default:
        return "#94a5a6";
    }
  };

  // PDF View Component

  const ActionButton = () => {
    const getButtonConfig = () => {
      switch (dataState?.status) {
        case "draft":
          return {
            text: "Convert to Open",
            nextStatus: "open",
            color: "#2098FF", // link-style color
          };
        case "open":
          return {
            text: "Mark as Delivered",
            nextStatus: "delivered",
            color: "#2098FF",
          };
        default:
          return null;
      }
    };

    const buttonConfig = getButtonConfig();
    if (!buttonConfig) return null;

    return (
      <Button
        variant="text" // ← link-style button
        onClick={() => handleStatusChange(buttonConfig.nextStatus)}
        disableRipple
        sx={{
          color: "#222",
          fontWeight: 500,
          fontSize: "13px",
          textTransform: "none",
          minWidth: "auto",
          padding: 0,
          background: "none",
          boxShadow: "none",
          "&:hover": {
            background: "transparent",
            textDecoration: "none",
            color: buttonConfig.color,
          },
        }}
      >
        {buttonConfig.text}
      </Button>
    );
  };

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
          backgroundColor: getBgColor(),
        }}
      >
        {dataState?.status_formatted}
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
              {/* divya.s.ihub@snsgroups.com */}
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
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "black",
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "13px",
                    fontWeight:600
                  }}
                >
                  Deliver To
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "13px",
                  }}
                >
                  {data?.place_of_supply}

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
            {" "}
            DELIVERY CHALLAN
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
            # {data?.deliverychallan_number}
          </Typography>

          <Box sx={{ mt: 5 }}>
            <Grid container spacing={1}>
              <Grid item xs={7} textAlign="right">
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Times New Roman', serif" }}
                >
                  Challan Date :
                </Typography>
                <Typography
                  variant="body2"
                  mt={1}
                  sx={{ fontFamily: "'Times New Roman', serif" }}
                >
                  Challan Type:
                </Typography>
              </Grid>
              <Grid item xs={5} textAlign="right">
                <Typography variant="body2">{data?.date_formatted}</Typography>
                <Typography variant="body2" sx={{ fontSize: "13px" }} mt={1}>
                  {data?.challan_type_formatted}
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

      <Grid container spacing={2} sx={{ mt: 1, mr: 3 }}>
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
                      {data?.adjustment_description || "Adjustment"}
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
                    sx={{ fontFamily: "'Times New Roman', serif", mt: 3 }}
                  >
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="right" sx={{ pr: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif", mt: 1 }}
                  >
                    ₹{parseFloat(data?.sub_total|| 0).toFixed(2)}

                    {/* {data?.sub_total} */}
                  </Typography>
                  {data?.adjustment !== 0 && (
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Times New Roman', serif", mt: 2 }}
                    >
                      {data?.adjustment}
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
                        ? `(-)${data?.tax_total}`
                        : data?.tax_total}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Times New Roman', serif", mt: 3 }}
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
        <Box sx={{ mt: 8 }}></Box>
        <Box sx={{ mt: 5 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontFamily: "'Times New Roman', serif", pb: 1 }}
          >
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
      sx={{ px: 2, mb: 6, boxShadow: "none", border: "2px solid #f9f9fb" }}
    >
      {/* <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Journal
        </Typography>
        <Box
          sx={{
            mt: 2,
            fontSize: "0.875rem",
            color: "#666",
            display: "flex",
            alignItems: "center",
          }}
        >
          Account is displayed in your base currency.
          <Box
            variant="contained"
            size="small"
            sx={{
              ml: 1,
              backgroundColor: "green",
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: "darkgreen" },
              padding: "2px 10px",
            }}
          >
            INR
          </Box>
        </Box>
      </Box> */}

      {/*Table Section */}
      {/* <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          DeliveryChallan
        </Typography>
      </Box> */}
      {/* 
      <TableContainer sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ background: "none !important" }}>
            <TableRow>
              <TableCell width="33%" sx={{ fontWeight: "bold", color: "grey" }}>
                ACCOUNT
              </TableCell>
              <TableCell
                width="33%"
                align="right"
                sx={{ fontWeight: "bold !important", color: "grey" }}
              >
                DEBIT
              </TableCell>
              <TableCell
                width="33%"
                align="right"
                sx={{ fontWeight: "bold !important", color: "grey" }}
              >
                CREDIT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                Accounts Receivable
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                0.00
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                0.00
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>Output IGST</TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                0.00
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                0.00
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>Sales</TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                0.00
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: "none" }}>
                0.00
              </TableCell>
            </TableRow>

            {/* Total */}
      {/* <TableRow sx={{ borderTop: "1px solid #ddd" }}>
              <TableCell sx={{ borderBottom: "none" }}></TableCell>
              <TableCell
                align="right"
                sx={{
                  borderBottom: "none",
                  color: "black !important",
                  fontWeight: "bold !important",
                }}
              >
                0.00
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  borderBottom: "none",
                  color: "black !important",
                  fontWeight: "bold !important",
                }}
              >
                0.00
              </TableCell>
            </TableRow> */}
      {/* </TableBody>
        </Table>
      </TableContainer> */}
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
            // border: "1px solid #ddd",
            m: 4,
            borderRadius: 2,
          }}
        ></Paper>
      )}
      {data?.status === "paid" && (
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
              p: 2,
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
              <Box sx={{}}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ height: 20 }}>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Payment#
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Reference#
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Payment Mode
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem !important",
                            backgroundColor: "white !important",
                          }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem !important",
                            backgroundColor: "white !important",
                          }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ height: 20 }}>
                        {/* Reduced row height */}
                        <TableCell
                          align="left"
                          sx={{ color: "black !important" }}
                        >
                          12/01/2025
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ color: "black !important" }}
                        >
                          PR0001
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ color: "black !important" }}
                        >
                          SO-00001
                        </TableCell>
                        <TableCell align="left" sx={{ color: "black" }}>
                          <span style={{ fontSize: "15px" }}>&#8226;</span> Cash
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ color: "black !important" }}
                        >
                          ₹ 45,000
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "#408dfb !important",
                              }}
                            >
                              <IconButton
                                size="small"
                                sx={{ color: "inherit" }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <Box sx={{ fontSize: 14 }}>Edit</Box>
                            </Box>
                            <Box>
                              <IconButton size="small">
                                <DeleteOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
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
            {data?.deliverychallan_number}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  data?.status === "delivered"
                    ? 700
                    : data?.status === "returned"
                    ? 700
                    : 900,
              }}
              elevation={3}
              sx={{ borderRadius: 2 }}
              PaperProps={{
                sx: {
                  width: "130px",
                  fontSize: "11px",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                  borderRadius: "8px",
                  mt: 1,
                },
              }}
            >
              {dataState?.status === "delivered" && (
                <MenuItem
                  onClick={() => {
                    handleStatusChange("open");
                    setDrawerOpen(false);
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
                  Revert to Open
                </MenuItem>
              )}
              {dataState?.status === "open" && (
                <MenuItem
                  onClick={() => {
                    handleStatusChange("returned");
                    setDrawerOpen(false);
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
                  Mark as Returned
                </MenuItem>
              )}
              {dataState?.status !== "returned" && (
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
                    borderBottom: "none",
                  }}
                  onClick={handleConvertInvoice}
                >
                  Convert to Invoice
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
                Add e-way Bill Details
              </MenuItem> */}

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
                onClick={handleChallan}
              >
                Clone
              </MenuItem>

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
            </Menu>
          )}
        </Box>
        <Dialog
          fullWidth="sm"
          open={openDelete}
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root.MuiDialog-paper": { 
              width: "436px",
               position: "absolute", // Ensure absolute positioning
              top: 0, // Position at the top of the screen
              margin: "16px", },
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
              Challan will be deleted permanently and cannot be retrieved later.
              Are you sure you want to go ahead?
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ justifyContent: "flex-start" }}>
            <Button
              sx={{ ml: 1}}
              autoFocus
              variant="contained"
              size="small"
              // className="button-submit"
              onClick={handleDelete}
            >
              Delete it
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
        {/* New Invoiced Alert Dialog */}
        <Dialog
          fullWidth="sm"
          open={isInvoicedAlertOpen}
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root.MuiDialog-paper": {
               width: "436px" ,
               position: "absolute", // Ensure absolute positioning
               top: 0, // Position at the top of the screen
               margin: "16px", },
          }}
          onClose={() => {
            setIsInvoicedAlertOpen(false);
            setOpenDelete(false); // Ensure the delete confirmation dialog is closed
          }}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ color: "red", width: "30px", height: "30px" }} />
            <DialogContentText
              sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
            >
              Delivery Challans that are converted to invoice cannot be deleted.
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setIsInvoicedAlertOpen(false);
                setOpenDelete(false); // Ensure the delete confirmation dialog is closed
              }}
              autoFocus
              className="bulk-update-btn"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Second Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // mb: 2,
          position: "sticky",
          backgroundColor: "#f9f9fb",
          zIndex: 10,
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
          // marginBottom: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {data?.status !== "delivered" && data?.status !== "returned" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  paddingRight: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#2098FF", // sets color for both text and icon
                  },
                  "&:hover svg": {
                    color: "#2098FF", // makes sure the SVG icon gets colored
                  },
                }}
                onClick={handleEditClick}
              >
                <IconButton size="small">
                  <Pencil width="16px" />
                </IconButton>
                <Box>Edit</Box>
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
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
          >
            <FileText width="16px" />
            <Box mx={0.5}>Pdf/Print</Box>
            <ArrowDropDown />
          </Box>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
            anchorReference="anchorPosition"
            anchorPosition={{
              top: 177,
              left:
                data?.status !== "delivered"
                  ? 680
                  : data?.status === "returned"
                  ? 660
                  : 600,
            }}
            elevation={3}
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
                setMenuAnchorEl(null);
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
              Print
            </MenuItem>
          </Menu>
          <Divider orientation="vertical" flexItem />

          {/*Status handler */}
          {data?.status !== "delivered" && data?.status !== "returned" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  paddingRight: 1,
                  cursor: "pointer",
                }}
                onClick={handleReminderOpen}
              >
                <ActionButton />
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}

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
        </Box>
      </Box>
    </Box>
  );

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
        <InvoiceSection />
        {data?.status !== "draft" && (
          <Box
            sx={{
              position: "relative",
              left: "100px",
              my: "10px",
              mt: data?.status !== "draft" ? 5 : "",
            }}
          >
            Invoice Status :{" "}
            <span
              style={{
                textTransform: "uppercase",
                color:
                  data?.invoiced_status === "not_invoiced"
                    ? "#879697"
                    : "#22B378",
              }}
            >
              {data?.invoiced_status_formatted}
            </span>
          </Box>
        )}
        <Box
          sx={{
            width: "8.27in", // Proper "width", not "Width"
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PDFView />
        </Box>

        <BillSection />

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

export default DeliveryChallanViewComponent;
