"use client";
import React, { useState, useEffect, cache } from "react";
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
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
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
import ToggleOnIcon from "@mui/icons-material/ToggleOn"; // Added import
import ToggleOffIcon from "@mui/icons-material/ToggleOff"; // Added import
import CommentsDrawer from "../../../common/commentAndHistory/CommentsDrawer";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ArrowDropDown,
  AutoAwesome,
  IosShare,
  PersonPinCircleOutlined,
} from "@mui/icons-material";

import apiService from "../../../../services/axiosService";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import config from "../../../../services/config";
import Image from "next/image";
import html2pdf from "html2pdf.js";
import WarningIcon from "@mui/icons-material/Warning";
import RefundContent from "./Refund";

const ViewComponent = (payData, journalId) => {
  console.log(payData,"payData");

  const [loading, setLoading] = useState<boolean>(true);
  const [isAttachFiles, setIsAttachFiles] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isMoreOptions, setIsMoreOptions] = useState<boolean>(false);
  const router = useRouter();
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  const [isRecordOpen, setIsRecordOpen] = useState<boolean>(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const [payments, setPayment_id] = useState<any>({});
  const [paymentsReceived, setpaymentsReceived] = useState<any>({});
  const [isSendOpen, setIsSendOpen] = useState<boolean>(false);
  const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);
  const [isConvert, setIsConvert] = useState<boolean>(false);
  const [isRefundMode, setIsRefundMode] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDropdownOpenMode, setIsDropdownOpenMode] = useState<boolean>(false);

  // State management for delete functionality
  // Delete dialog state
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [showCannotDeleteDialog, setShowCannotDeleteDialog] = useState<boolean>(false);
  const [paymentToDelete, setPaymentToDelete] = useState<any>(null);
  const MapData = payData.payData;
  const payment_id = MapData.payment_id;
  const pathname = usePathname()!;
  const { showMessage } = useSnackbar();

  // Move these state declarations after MapData is defined
  const [selectedValue, setSelectedValue] = useState(
    MapData?.account_name || "Petty Cash"
  );
  const [selectedValueMode, setSelectedValueMode] = useState(
    MapData?.payment_mode || "Cash"
  );

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleSave = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsRefundMode(false);
    }, 2000);
  };
  const paymentModes = [
    "Cash",
    "Bank Remittance",
    "Credit Card",
    "Bank Transfer",
    "Cheque",
    "UPI",
  ];

  // Function to toggle the dropdown menu

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

  const tableview = () => {
    router.push("/sales/paymentsReceived");
  };

  const toggleMoreOptions = () => {
    setIsMoreOptions((prev) => !prev);
  };

  // Handle opening the delete confirmation dialog
  const handleClickOpen = (payment_id) => {
    setIsMoreOptions(false);
    setPaymentToDelete(payment_id);
    setOpenDelete(true);
  };
  // Handle closing the delete confirmation dialog
  const handleDeleteClose = () => {
    setOpenDelete(false);
    setPaymentToDelete(null);
  };
  // Handle general close for all dialogs
  const handleClose = () => {
    setIsMoreOptions(false);
    setIsSendOpen(false);
    setIsReminderOpen(false);
    setIsPdfOpen(false);
    setIsRecordOpen(false);
    setIsConvert(false);
    setOpenDelete(false);
    setPaymentToDelete(null);
  };

  const handleSendOpen = () => {
    setIsSendOpen(true);
  };
  const handleReminderOpen = () => {
    setIsReminderOpen(true);
  };
  const handleRecordOpen = () => {
    setIsRecordOpen(true);
  };
  const handleConvert = () => {
    setIsConvert(true);
  };
  const organization_id = localStorage.getItem("organization_id");

  // Handle the actual deletion of payment
  const handleDeletePayment = async () => {
    console.log(payment_id, "payment_id");

    if (!payment_id) {
      console.log("No payment ID");
      return;
    }
    setOpenDelete(false);

    try {
      const orgId = localStorage.getItem("organization_id");

      const response = await apiService({
        method: "DELETE",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/payment?organization_id=${orgId}&payment_id=${payment_id}`,
      });

      console.log("Delete response:", response?.data);

      if (response?.data.status) {
        showMessage("Payment deleted successfully", "success");
        setOpenDelete(false);
        console.log("Vaada Vaada Thambi");
      } else {
        showMessage(response?.data?.message || "Delete failed", "error");
      }

      router.push("/sales/paymentsReceived");
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("Unexpected error occurred.", "error");
    } finally {
      setIsDeleting(false);
      setOpenDelete(false); // Close the dialog
    }
  };

  const handleEditClick = () => {
    router.push(
      `/sales/paymentsReceived/newPaymentReceived?paymentId=${payment_id}`
    );
    return;
  };

  const handleSendEmail = () => {
    router.push(`/sales/paymentsReceived/${payment_id}/email`);
  };

  const handlePdfOpen = () => {
    setIsPdfOpen(true);
  };

  const generatePDF = () => {
    if (!MapData) return;

    setIsPdfGenerating(true);

    try {
      const element = document.getElementById("pdf-view-container");

      if (!element) {
        console.error("PDF view element not found");
        setIsPdfGenerating(false);
        return;
      }

      // Create a clone to avoid modifying original DOM
      const elementClone = element.cloneNode(true);

      // Create a temporary container for the clone
      const tempContainer = document.createElement("div");
      tempContainer.appendChild(elementClone);
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      // Configure PDF options
      const options = {
        filename: `Payment_Received-${MapData.payment_id || "receipt"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
      };

      // Generate and download PDF using the clone
      html2pdf()
        .from(elementClone)
        .set(options)
        .save()
        .then(() => {
          console.log("PDF generation complete");
          // Clean up
          document.body.removeChild(tempContainer);
          setIsPdfGenerating(false);
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          // Clean up on error
          document.body.removeChild(tempContainer);
          setIsPdfGenerating(false);
        });
    } catch (error) {
      console.error("Error in PDF generation process:", error);
      setIsPdfGenerating(false);
    }
  };

  useEffect(() => {
    console.log("Payment Received Data for View Component", payData.data);
  }, []);

  useEffect(() => {
    let payment_id = pathname.split("/")[3];
    setPayment_id(payment_id);
    getPaymentDetail(payment_id, organization_id);
    console.log(pathname, "pathname");
    getJournals();
  }, [pathname]);

  const getPaymentDetail = async (payment_id, organization_id) => {
    setLoading(true);
    try {
      let params = {
        url: `/api/v1/payment/individual?organization_id=${organization_id}&payment_id=${payment_id}`,
        method: "GET",
        customBaseUrl: config.SO_Base_url,
      };

      // Add artificial delay of 800ms to demonstrate the skeleton (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await apiService(params);
      console.log(response, "////////////");
      if (response.statusCode === 200) {
        setpaymentsReceived(response.data.data);

        console.log(response.data.data, "this is the payment details");
      }
    } catch (error) {
      console.log("getPaymentDetail error", error);
    } finally {
      setLoading(false);
    }
  };

  // Move formatAmount function here, outside of any component
  const formatAmount = (amount) => {
    return (
      amount?.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "0.00"
    );
  };

  //Get Journals
  const [items, setItems] = useState<any>([]);

  const getJournals = async () => {
  const orgId = localStorage.getItem("organization_id");
  console.log(MapData,"payData.journalId")
    setLoading(true);
    try {
      const params = {
        url: `/api/v1/get-individual-journal?journal_id=${payData.journalId}&org_id=${orgId}`,
        method: "GET",
      };
      await new Promise((resolve) => setTimeout(resolve, 800)); // Artificial delay for skeleton
      const response = await apiService(params);
      if (response?.data?.data?.line_items) {
        setItems(response.data.data.line_items);
      }
      console.log(response.data.data.line_items, "response");
    } catch (error) {
      console.error("Error fetching journals:", error);
      showMessage("Failed to fetch journals", "error");
    } finally {
      setLoading(false);
    }
  };



  const Header = (_props?: any) => (
    <Box
      sx={{
        mb: 2,
        position: "sticky" as const,
        top: 0,
        backgroundColor: "white",
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: "flex" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          p: 2,
        }}
      >
        <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
          <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: "bold" as const }}>
            {MapData.payment_id}
          </Typography>
        </Box>

        <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 2 }}>
          <Box
            sx={{
              display: "flex" as const,
              alignItems: "center" as const,
              borderRight: "1px solid #ddd",
              paddingRight: 2,
              cursor: "pointer" as const,
            }}
            onClick={isAttachFilesToggle}
          >
            <IconButton size="small">
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <Box>Upload Files</Box>
          </Box>

          <Menu
            open={isAttachFiles}
            onClose={() => setIsAttachFiles(false)}
            sx={{
              position: "absolute" as const,
              zIndex: 10,
              borderRadius: 2,
            }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 115, left: 1125 }}
          >
            <Paper sx={{ width: "320px" }} elevation={0}>
              <Box
                sx={{
                  display: "flex" as const,
                  justifyContent: "space-between" as const,
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
                    alignItems: "center" as const,
                    display: "flex" as const,
                    justifyContent: "center" as const,
                  }}
                >
                  No Files Attached
                </Typography>
              ) : (
                <Box sx={{ mt: 1, maxHeight: "150px", overflowY: "auto" as const }}>
                  {files.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex" as const,
                        justifyContent: "space-between" as const,
                        alignItems: "center" as const,
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
                    display: "flex" as const,
                    alignItems: "center" as const,
                    cursor: "pointer" as const,
                    width: "100%",
                    justifyContent: "center" as const,
                    padding: "10px",
                  }}
                >
                  <CloudUploadIcon sx={{ mr: 1 }} /> Upload your Files
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  style={{ display: "none" as const }}
                  onChange={handleFileChange}
                />
              </MenuItem>

              <Typography
                color="textSecondary"
                sx={{ fontSize: "12px", mt: 1, pb: 1, textAlign: "center" as const }}
              >
                You can upload a maximum of 5 files, 10MB each
              </Typography>
            </Paper>
          </Menu>

          <Box
            sx={{ display: "flex" as const, alignItems: "center" as const, cursor: "pointer" as const }}
            onClick={() => setDrawerOpen(true)}
          >
            <IconButton size="small">
              <CommentIcon fontSize="small" />
            </IconButton>
            <Box>Payment History</Box>
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
              anchorPosition={{ top: 185, left: 890 }}
              elevation={3}
              sx={{ borderRadius: 2, fontSize: "13px" }}
            >
              {MapData.payment_status !== "refunded" && (
                <MenuItem
                  onClick={() => {
                    setIsRefundMode(true);
                    handleClose();
                  }}
                  sx={{
                    fontSize: "13px",
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: 2,
                      fontSize: "13px",
                    },
                  }}
                >
                  Refund
                </MenuItem>
              )}

              <MenuItem
                onClick={() => handleClickOpen(payment_id.payment_id)}
                disabled={isDeleting}
                sx={{
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  "& svg": { color: "#408dfb" },
                  "&:hover svg": { color: "white" },
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
      </Box>
      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        fullWidth
        open={openDelete}
        maxWidth="sm"
        onClose={handleDeleteClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            width: "436px",
            position: "absolute" as const,
            top: 0,
            margin: "16px",
          },
        }}
      >
        <DialogContent sx={{ display: "flex" as const, alignItems: "center" as const }}>
          <WarningIcon sx={{ color: "#ff9800", fontSize: 30 }} />
          <DialogContentText sx={{ ml: 1, fontSize: "12px", color: "#212529" }}>
            Quote will be deleted permanently and cannot be retrieved later. Are
            you sure you want to go ahead?
          </DialogContentText>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ justifyContent: "flex-start" as const }}>
          <Button
            sx={{ ml: 1, width: "20px" }}
            variant="outlined"
            onClick={handleDeletePayment}
            disabled={isDeleting}
            autoFocus
            className="button-submit"
          >
            {isDeleting ? "Deleting..." : "Delete it"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteClose}
            className="bulk-update-btn"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Second Header */}
      <Box
        sx={{
          display: "flex" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          mb: 2,
          position: "sticky" as const,
          backgroundColor: "#f8f8f8",
          zIndex: 10,
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
          marginBottom: 4,
        }}
      >
        <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
          <Box
            sx={{
              display: "flex" as const,
              alignItems: "center" as const,
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer" as const,
              "&:hover": {
                color: "#408dfb",
              },
            }}
            onClick={() => {
              const Payment_id = pathname.split("/")[3];
              router.push(
                `/sales/paymentsReceived/newPaymentReceived/${
                  paymentsReceived.is_advance_payment === true
                    ? "customerAdvance"
                    : "invoicePayment"
                }?payment_id=${Payment_id}`
              );
              //  console.log(paymentsReceived,"//sxvasdvas///")
            }}
          >
            <IconButton size="small">
              <EditIcon
                fontSize={"13px" as any}
                sx={{
                  "&:hover": {
                    color: "#408dfb",
                  },
                }}
              />
            </IconButton>
            Edit
          </Box>
          {/* Send Email */}
          <Box
            sx={{
              display: "flex" as const,
              alignItems: "center" as const,
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer" as const,
              "&:hover": {
                color: "#408dfb",
              },
            }}
            onClick={handleSendEmail}
          >
            <IconButton
              size="small"
              sx={{
                "&:hover": {
                  color: "#408dfb",
                },
              }}
            >
              <MailOutlineOutlinedIcon fontSize="small" />
            </IconButton>
            <Box>Email</Box>
          </Box>

          {/* PDF/Print */}
          <Box
            sx={{
              display: "flex" as const,
              alignItems: "center" as const,
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer" as const,
              "&:hover": {
                color: "#408dfb",
              },
            }}
            onClick={handlePdfOpen}
          >
            <IconButton
              size="small"
              sx={{
                "&:hover": {
                  color: "#408dfb",
                },
              }}
            >
              <PictureAsPdfIcon fontSize="small" />
            </IconButton>
            <Box>PDF/Print</Box>
          </Box>

          <Menu
            open={isPdfOpen}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 180, left: 790 }}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem
              onClick={() => {
                generatePDF();
                handleClose();
              }}
              sx={{
                width: "110px",
                textAlign: "center" as const,
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: 2,
                },
              }}
            >
              PDF
            </MenuItem>

            <MenuItem
              onClick={handleClose}
              sx={{
                width: "110px",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: 2,
                },
              }}
            >
              Print
            </MenuItem>
          </Menu>

          <Box
            sx={{
              p: 1,
              borderRight: "1px solid #ddd",
              backgroundColor: "transparent",
              cursor: "pointer" as const,
            }}
          >
            <IconButton
              size="small"
              sx={{
                "&:hover": {
                  color: "#408dfb",
                },
              }}
            >
              <MoreVertIcon fontSize="small" onClick={toggleMoreOptions} />
            </IconButton>
          </Box>
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

  const MainContent = (_props?: any) => {
    return (
      <>
        <Paper
          id="pdf-view-container"
          elevation={3}
          sx={{
            maxWidth: 800,
            mx: "auto",
            p: 3,
            px: 7,
            bgcolor: "white",
            mb: 6,
            fontFamily: "serif" as const,
          }}
        >
          {/*The Organization Details*/}
          <Box sx={{ p: 3, pl: 3, pt: 5 }}>
            <Typography
              sx={{
                color: "#333333",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: "serif" as const,
                mb: 1,
              }}
            >
              {MapData.organization.org_name}
            </Typography>
            <Typography
              sx={{
                color: "#999999",
                fontSize: "14.5px",
                lineHeight: 1.5,
                fontFamily: "serif" as const,
              }}
            >
              {MapData.organization.first_street}
            </Typography>
            <Typography
              sx={{
                color: "#999999",
                fontSize: "14.5px",
                fontFamily: "serif" as const,
                lineHeight: 1.5,
              }}
            >
              {MapData.organization.city}
            </Typography>
            <Typography
              sx={{
                color: "#999999",
                fontSize: "14.5px",
                fontFamily: "serif" as const,
                lineHeight: 1.5,
              }}
            >
              {MapData.organization.country}
            </Typography>
            <Typography
              sx={{
                color: "#999999",
                fontSize: "14.5px",
                fontFamily: "serif" as const,
                lineHeight: 1.5,
              }}
            >
              {MapData.organization.phone}
            </Typography>
            <Typography
              sx={{ color: "#999999", fontFamily: "serif" as const, fontSize: "14.5px" }}
            >
              {MapData.organization.gst_in}
            </Typography>
            <Typography
              sx={{
                color: "#999999",
                fontFamily: "serif" as const,
                fontSize: "14.5px",
                mb: 2,
              }}
            >
              {MapData.organization.email}
            </Typography>
          </Box>

          <Divider />

          {/* Payment Title */}
          <Typography
            sx={{
              textAlign: "center" as const,
              fontWeight: 400,
              fontFamily: "serif" as const,
              fontSize: "17.3333px",
              my: 3,
            }}
          >
            PAYMENTS RECEIPT
          </Typography>

          {/* Payment Details Section */}
          <Box sx={{ display: "flex" as const, flexWrap: "wrap" as const, mb: 4, mt: 5 }}>
            <Box sx={{ flex: "1 1 75%", pr: 2 }}>
              <Box sx={{ display: "flex" as const, mb: 1.5 }}>
                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    width: 180,
                  }}
                >
                  Payment#
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    fontWeight: 600,
                  }}
                >
                  {MapData.payment_id}
                </Typography>
              </Box>

              <Box sx={{ display: "flex" as const, mb: 1.5 }}>
                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    width: 180,
                  }}
                >
                  Payment Date
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    fontWeight: 600,
                  }}
                >
                  {new Date(MapData.payment_date).toLocaleDateString("en-GB")}
                </Typography>
              </Box>

              <Box sx={{ display: "flex" as const, mb: 1.5 }}>
                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    width: 180,
                  }}
                >
                  Reference Number
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    fontWeight: 600,
                  }}
                >
                  {MapData.reference_number}
                </Typography>
              </Box>

              {/* <Box sx={{ display: "flex" as const, mb: 1.5 }}>
                    <Typography
                      sx={{ color: "#777", fontSize: "0.9rem", width: 180 }}
                    >
                      Paid To
                    </Typography>
                    <Typography
                      sx={{
                        color: "#408dfb",
                        fontSize: "0.9rem",
                        cursor: "pointer" as const,
                      }}
                    >
                      {thePayment.payment.contact_id.contact_name}
                    </Typography>
                    
                  </Box> */}

              <Box sx={{ display: "flex" as const, mb: 1.5 }}>
                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    width: 180,
                  }}
                >
                  Payment Mode
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "14.6667px",
                    fontFamily: "serif" as const,
                    fontWeight: 600,
                  }}
                >
                  {MapData?.payment_mode || "Cash"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: "0 0 auto", width: 170 }}>
              <Box
                sx={{
                  display: "flex" as const,
                  flexDirection: "column" as const,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#7CB342",
                    color: "white",
                    p: 2,
                    textAlign: "center" as const,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "400" as const,
                      fontSize: "14.6667px",
                      fontFamily: "serif" as const,
                    }}
                  >
                    Amount Received
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "21.333px",
                      fontWeight: 400,
                      fontFamily: "serif" as const,
                    }}
                  >
                    ₹{formatAmount(MapData.amount)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Received From */}
          <Box sx={{ mt: 2, display: "flex" as const, justifyContent: "space-between" as const }}>
            <Box
              sx={{
                display: "flex" as const,
                flexDirection: "column" as const,
                alignItems: "start" as const,
              }}
            >
              <Typography
                sx={{
                  color: "#777",
                  fontSize: "14.6667px",
                  fontFamily: "serif" as const,
                  fontWeight: "600" as const,
                  mb: 1,
                }}
              >
                Received From
              </Typography>
              <Typography
                sx={{
                  color: "#1B4C91",
                  fontWeight: 600,
                  fontSize: "16px",
                  fontFamily: "serif" as const,
                  mt: 1.5,
                  mb: 0.5,
                }}
              >
                {MapData?.customer_name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex" as const,
                flexDirection: "column" as const,
                alignItems: "end" as const,
              }}
            >
              <Typography
                sx={{
                  fontSize: "14.6667px",
                  fontWeight: "400" as const,
                  color: "#777777",
                  fontFamily: "serif" as const,
                }}
              >
                Authorized Signature
              </Typography>
              <Typography sx={{ color: "#ededed", mt: 3 }}>
                _______________________
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ color: "ededed", mt: 9 }} />

          {/* Payment For Section */}

          <>
            <Box>
              <Typography
                sx={{
                  color: "#333333",
                  fontWeight: 400,
                  fontSize: "20px",
                  fontFamily: "serif" as const,
                  mb: 1.5,
                  mt: 5,
                }}
              >
                Payment for
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "1px solid #f0f0f0" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: "#333333 !important",
                          fontWeight: "400 !important" as const,
                          fontSize: "14.6667px !important",
                          fontFamily: "serif" as const,
                          p: 1.5,
                        }}
                      >
                        Invoice Number
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: "#333333 !important",
                          fontWeight: "400 !important" as const,
                          fontSize: "14.6667px !important",
                          fontFamily: "serif" as const,
                          p: 1.5,
                        }}
                      >
                        Invoice Date
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: "#333333 !important",
                          fontWeight: "400 !important" as const,
                          fontSize: "14.6667px !important",
                          fontFamily: "serif" as const,
                          p: 1.5,
                        }}
                      >
                        Invoice Amount
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: "#333333 !important",
                          fontWeight: "400 !important" as const,
                          fontSize: "14.6667px !important",
                          fontFamily: "serif" as const,
                          p: 1.5,
                        }}
                      >
                        Payment Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MapData.invoices.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            fontSize: "14.6667px !important",
                            fontFamily: "serif" as const,
                            p: 1.5,
                            color: "#408dfb !important",
                          }}
                        >
                          {data.invoice_number}
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "14.6667px !important", p: 1.5 }}
                        >
                          {new Date(data.date).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "14.6667px !important",
                            fontFamily: "serif" as const,
                            p: 1.5,
                            textAlign: "right" as const,
                            pr: 8,
                          }}
                        >
                          ₹{formatAmount(MapData.amount)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "14.6667px !important",
                            fontFamily: "serif" as const,
                            p: 1.5,
                            textAlign: "right" as const,
                            pr: 8,
                          }}
                        >
                          ₹{formatAmount(MapData.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        </Paper>
      </>
    );
  };

  const BillSection = (_props?: any) => (
    <Paper
      elevation={0}
      sx={{ px: 2, mb: 6, boxShadow: "none", border: "2px solid #f9f9fb" }}
    >
      <Box sx={{ px: 2, paddingTop: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "600" as const, fontSize: "13px" }}
        >
          Journal
        </Typography>
        <Box
          sx={{
            mt: 1,
            fontSize: "12px",
            color: "#666",
            display: "flex" as const,
            alignItems: "center" as const,
            fontWeight: "400" as const,
          }}
        >
          Account is displayed in your base currency.
          <Box
            sx={{
              ml: 1,
              backgroundColor: "green",
              color: "white",
              textTransform: "none" as const,
              "&:hover": { backgroundColor: "darkgreen" },
              padding: "2px 10px",
              fontSize: "9px",
              fontWeight: "600" as const,
            }}
          >
            INR
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          display: "flex" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "600" as const, fontSize: "16px" }}
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
                sx={{ fontWeight: "600" as const, color: "#6C718A", fontSize: "12px" }}
              >
                ACCOUNT
              </TableCell>
              <TableCell
                width="33%"
                align="right"
                sx={{ fontWeight: "600" as const, color: "#6C718A", fontSize: "12px" }}
              >
                DEBIT
              </TableCell>
              <TableCell
                width="33%"
                align="right"
                sx={{ fontWeight: "600" as const, color: "#6C718A", fontSize: "12px" }}
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
                    fontWeight: "400" as const,
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
                  fontWeight: "600" as const,
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
                  fontWeight: "600" as const,
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

  return (
    <Box
      sx={{
        borderLeft: "1px solid #ddd",
        height: "90vh",
        overflowY: "auto" as const,
      }}
    >
      {isRefundMode ? (
        <RefundContent
          customer={MapData.customer_name}
          payData={MapData}
          onSave={handleSave}
          onCancel={() => setIsRefundMode(false)}
        />
      ) : (
        <>
          <Header />
          <MainContent />
          <BillSection />
        </>
      )}
    </Box>
  );
};

export default ViewComponent;
