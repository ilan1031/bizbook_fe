"use client";
import React, { useEffect, useState } from "react";
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
  Divider,
  IconButton,
  Collapse,
  Tooltip,
  Menu,
  MenuItem,
  Popper,
  Skeleton,
  CircularProgress,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CommentsDrawer from "../../../common/commentAndHistory/CommentsDrawer";
import EditIcon from "@mui/icons-material/Edit";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import { usePathname } from "next/navigation";
import html2pdf from "html2pdf.js";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import formatCurrency from "../../../common/FormatCurrency";
import { DeleteOutline } from "@mui/icons-material";
import { FileText } from "lucide-react";

const PaymentViewComponent = (data) => {
  const [isAttachFiles, setIsAttachFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [poId, setPoId] = useState("");
  // const [thePayment, setThePayment] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedFileToDelete, setSelectedFileToDelete] = useState(null);
  const [thePayment, setThePayment] = useState({
    payment: {
      payment_id: "",
      documents: "", // could be string or array depending on backend
    },
  });
  const [journalId, setJournalId] = useState("");

  const handleOpenConfirmationDialog = (file) => {
    setSelectedFileToDelete(file);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmDialog(false);
  };

  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      if (pathParts.length >= 4) {
        const id = pathParts[3];
        setPoId(id);
        console.log("PO ID set:", id);

        // Fetch PO details when we have the poId
        if (id) {
          // You can call your fetch function here
          // fetchPODetails(id);
        }
      }
    }
  }, [pathname]);

  const handleConfirmDelete = async () => {
    try {
      const org_id = localStorage.getItem("organization_id");
      const payment_id = thePayment?.payment?.payment_id; // Use correct payment ID from state

      if (!org_id || !payment_id) {
        showMessage("Organization or Payment ID is missing", "error");
        return;
      }

      await apiService({
        method: "POST",
        url: `/api/v1/payments/remove-document?organization_id=${org_id}&payment_id=${payment_id}`,
        // No need to send file name in body
      });

      // Show success message
      showMessage("Document deleted successfully", "success");

      // Update local state
      setThePayment((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          documents: "", // Clear the document field
        },
      }));
    } catch (error) {
      console.error("Error deleting document:", error);
      showMessage("Failed to delete document", "error");
    } finally {
      handleCloseConfirmationDialog();
    }
  };

  useEffect(() => {
    let org_id = localStorage.getItem("organization_id");
    const pa_id = pathname.split("/")[3];
    setPaymentId(pa_id);
    getPaymentDetails(pa_id, org_id);
  }, [pathname]);

  const getPaymentDetails = async (pa_id, org_id) => {
    setLoading(true);
    try {
      let params = {
        url: `api/v1/payments/allpayment?payment_id=${pa_id}&organization_id=${org_id}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      const response = await apiService(params);

      if (response.statusCode === 200 || response.statusCode === true) {
        setThePayment(response.data.data);
        getJournals(response.data.data.payment.journal_id);
        console.log(response.data.data.payment.journal_id, "responsess");
        console.log("Payment details:", response.data.data);
        console.log("Payment status:", response.data.data.payment.status);
        console.log("Status type:", typeof response.data.data.payment.status);
      }
    } catch (error) {
      console.log("Error in Fetching the Individual Payment Details", error);
    } finally {
      setLoading(false);
    }
  };

  const [items, setItems] = useState([]);

  const getJournals = async (journal_id) => {
    const orgId = localStorage.getItem("organization_id");
    if (!journal_id) return;
    setLoading(true);
    try {
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
    router.push("/purchase/paymentmade");
  };

  const toggleMoreOptions = () => {
    setIsMoreOptions((prev) => !prev);
  };

  const handleClose = () => {
    setIsMoreOptions(false);
    setIsPdfOpen(false);
  };

  const handleEditClick = () => {
    router.push(`/purchase/paymentmade/create?paymentId=${paymentId}`);
    return;
  };

  const handlePdfOpen = () => {
    setIsPdfOpen(true);
  };

  // const paymentId =data

  const handleSendEmail = () => {
    router.push(`/purchase/paymentmade/${poId}/email`);
  };

  const handleDeletePayment = async () => {
    const paymentId = thePayment.payment.payment_id;
    const orgId = localStorage.getItem("organization_id");

    if (!paymentId || !orgId) {
      showMessage("Missing payment ID or organization ID", "error");
      return;
    }

    try {
      let params = {
        url: `api/v1/payments/delete?payment_id=${paymentId}&organization_id=${orgId}`,
        method: "DELETE",
        customBaseUrl: config.PO_Base_url,
      };

      const response = await apiService(params);

      if (response.statusCode === 200 || response.statusCode === true) {
        showMessage("Payment deleted successfully", "success");
        // Navigate back to payments list after successful deletion
        router.push("/purchase/paymentmade");
      } else {
        showMessage("Failed to delete payment", "error");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleFileChanges = async (event) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    // Validate number of files
    if (selectedFiles.length > 5) {
      showMessage("You can upload a maximum of 5 files", "error");
      event.target.value = "";
      return;
    }

    // Validate file size (max 10MB each)
    for (let file of selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        showMessage(`File "${file.name}" exceeds 10MB limit`, "error");
        event.target.value = "";
        return;
      }
    }

    try {
      // Show loading state
      setIsUploading(true);

      const org_id = localStorage.getItem("organization_id");
      const payment_id = thePayment?.payment?.payment_id;

      if (!org_id || !payment_id) {
        throw new Error("Organization or Payment ID missing");
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Add files to FormData
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("documents", selectedFiles[i]);
      }

      // Call the API to update payment with files
      const response = await apiService({
        method: "PUT",
        url: `/api/v1/payments/update?organization_id=${org_id}&payment_id=${payment_id}`,
        data: formData,
        file: true,
      });

      // Check response success - be more explicit about the check
      if (
        response &&
        (response.success === true ||
          response.status === 200 ||
          response.statusCode === 200)
      ) {
        // Update the local state with new documents
        // The backend returns the complete updated payment object with all documents
        setThePayment((prevPayment) => ({
          ...prevPayment,
          payment: {
            ...prevPayment.payment,
            // Use the documents array returned from the backend
            // This contains all documents (existing + newly uploaded) as filenames
            documents:
              response.data?.documents ||
              response.documents ||
              prevPayment.payment?.documents ||
              [],
          },
        }));

        // Show success message with a slight delay to ensure state updates
        setTimeout(() => {
          showMessage("Files uploaded successfully!", "success");
        }, 400);

        // Close the attachment menu after a short delay
        setTimeout(() => {
          setIsAttachFiles(false);
        }, 1500);
      } else {
        // Handle API response that indicates failure
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          response?.error ||
          "Upload failed";
        showMessage(errorMessage, "error");
      }
    } catch (error) {
      console.error("File upload error:", error);

      // More detailed error handling
      let errorMessage = "Failed to upload files. Please try again.";

      if (error.response) {
        // API responded with error status
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          errorMessage;
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message;
      }

      showMessage(errorMessage, "error");
    } finally {
      // Hide loading state
      setIsUploading(false);

      // Clear the file input
      event.target.value = "";
    }
  };

  const generatePDF = () => {
    if (!thePayment) return;

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
        filename: `Payment-${thePayment.payment.payment_id || "receipt"}.pdf`,
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

  // Status management functions
  const getStatusColor = (status) => {
    // Ensure status is a string and handle null/undefined
    const statusStr = String(status || "").toLowerCase();
    switch (statusStr) {
      case "draft":
      case "1":
        return "#94a5a6";
      case "paid":
      case "2":
        return "#1fcd6d";
      case "void":
      case "3":
        return "#474747";
      default:
        return "#474747";
    }
  };

  const getStatusText = (status) => {
    // Ensure status is a string and handle null/undefined
    const statusStr = String(status || "").toLowerCase();
    switch (statusStr) {
      case "draft":
      case "1":
        return "Draft";
      case "paid":
      case "2":
        return "Paid";
      case "void":
      case "3":
        return "Void";
      default:
        return "Draft";
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const org_id = localStorage.getItem("organization_id");
      const payment_id = thePayment?.payment?.payment_id;

      if (!org_id || !payment_id) {
        showMessage("Organization or Payment ID is missing", "error");
        return;
      }

      const response = await apiService({
        method: "PUT",
        url: `/api/v1/payments/status?organization_id=${org_id}&payment_id=${payment_id}`,
        data: {
          status: newStatus,
          status_formatted: getStatusText(newStatus)
        },
        customBaseUrl: config.PO_Base_url,
      });

      if (response.statusCode === 200 || response.statusCode === true) {
        showMessage(`Payment status updated to ${getStatusText(newStatus)}`, "success");
        // Refresh payment details
        getPaymentDetails(paymentId, org_id);
      } else {
        showMessage("Failed to update payment status", "error");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      showMessage("Failed to update payment status", "error");
    }
  };

  const Header = () => (
    <Box
      sx={{
        mb: 2,
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
            {loading ? "" : thePayment?.payment?.payment_id}
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
            <Box>Upload Files</Box>
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
            <Paper elevation={0} sx={{ width: "320px" }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.5,
                  px: 1.5,
                  backgroundColor: "#f8f8f8",
                }}
              >
                <Typography fontWeight="400" fontSize="13px">
                  Attachments
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setIsAttachFiles(false)}
                  sx={{ color: "red" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Attached Files List */}
              {thePayment?.payment?.documents ? (
                // Case 1: Documents exist (either as a string or array)
                typeof thePayment.payment.documents === "string" ? (
                  // Single file (string case)
                  <Box sx={{ mt: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        borderBottom: "1px solid #ddd",
                        ml: 1,
                        mr: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {thePayment.payment.documents.split("/").pop() ||
                          "Untitled"}
                      </Typography>
                      <Box display="flex" gap={1}>
                        {/* View File */}
                        <IconButton
                          size="small"
                          component="a"
                          href={
                            config.PO_Base_url +
                            "uploads/" +
                            thePayment.payment.documents
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText fontSize="small" />
                        </IconButton>
                        {/* Delete File */}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleOpenConfirmationDialog(
                              thePayment.payment.documents
                            )
                          }
                          sx={{ color: "error.main" }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  // Multiple files (array case)
                  <Box sx={{ mt: 1, maxHeight: "150px", overflowY: "auto" }}>
                    {thePayment.payment.documents.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          borderBottom: "1px solid #ddd",
                          ml: 1,
                          mr: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {file.filename || file.name || "Untitled"}
                        </Typography>
                        <Box display="flex" gap={1}>
                          {/* View File */}
                          <IconButton
                            size="small"
                            component="a"
                            href={`${config.FILE_BASE_URL}/${
                              file.filepath || file.path
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText fontSize="small" />
                          </IconButton>
                          {/* Delete File */}
                          <IconButton
                            size="small"
                            onClick={() => handleOpenConfirmationDialog(file)}
                            sx={{ color: "error.main" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )
              ) : (
                // Case 2: No documents (show upload option)
                <>
                  <Typography
                    textAlign="center"
                    sx={{
                      borderTop: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                      py: 1,
                      height: "60px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    No Files Attached
                  </Typography>

                  {/* Upload New File */}
                  <MenuItem
                    sx={{
                      mt: 2,
                      border: "1px dashed #408dfb",
                      borderRadius: 1,
                      m: 2,
                      opacity: isUploading ? 0.6 : 1,
                      pointerEvents: isUploading ? "none" : "auto",
                    }}
                  >
                    <label
                      htmlFor="file-upload"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: isUploading ? "not-allowed" : "pointer",
                        width: "100%",
                        justifyContent: "center",
                        padding: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {isUploading ? (
                        <>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <CloudUploadIcon sx={{ mr: 1 }} /> Upload your Files
                        </>
                      )}
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileChanges}
                      disabled={isUploading}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" // Add accepted file types
                    />
                  </MenuItem>
                  <Typography
                    color="textSecondary"
                    sx={{
                      fontSize: "10px",
                      pb: 1,
                      textAlign: "center",
                    }}
                  >
                    You can upload a maximum of 5 files, 10MB each
                  </Typography>
                </>
              )}
            </Paper>
          </Menu>

          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
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
              {(String(thePayment?.payment?.status || "").toLowerCase() === "paid" || 
                String(thePayment?.payment?.status || "") === "2") && (
                <MenuItem
                  onClick={() => {
                    handleStatusChange("void");
                    handleClose();
                  }}
                  sx={{
                    fontSize: "13px",
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: 2,
                    },
                  }}
                >
                  Void
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  handleDeletePayment();
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
          mb: 2,
          position: "sticky",
          backgroundColor: "#f8f8f8",
          zIndex: 10,
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
          marginBottom: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer",
              "&:hover": {
                color: "#408dfb",
              },
            }}
            onClick={handleEditClick}
          >
            <IconButton size="small">
              <EditIcon
                fontSize="13px"
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
              display: "flex",
              alignItems: "center",
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer",
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
          {/* Status change buttons based on current status */}
          {(String(thePayment?.payment?.status || "").toLowerCase() === "draft" || 
            String(thePayment?.payment?.status || "") === "1") && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                paddingRight: 2,
                borderRight: "1px solid #ddd",
                cursor: "pointer",
                "&:hover": {
                  color: "#408dfb",
                },
              }}
              onClick={() => handleStatusChange("paid")}
            >
              <IconButton
                size="small"
                sx={{
                  "&:hover": {
                    color: "#408dfb",
                  },
                }}
              >
              </IconButton>
              <Box>Mark as Paid</Box>
            </Box>
          )}

         

          {(String(thePayment?.payment?.status || "").toLowerCase() === "void" || 
            String(thePayment?.payment?.status || "") === "3") && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                paddingRight: 2,
                borderRight: "1px solid #ddd",
                cursor: "pointer",
                "&:hover": {
                  color: "#408dfb",
                },
              }}
              onClick={() => handleStatusChange("draft")}
            >
              <IconButton
                size="small"
                sx={{
                  "&:hover": {
                    color: "#408dfb",
                  },
                }}
              >
              </IconButton>
              <Box>Convert to Draft</Box>
            </Box>
          )}
          {/* PDF/Print */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer",
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
                textAlign: "center",
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
              cursor: "pointer",
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

        <Box>
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
        </Box>
      </Box>
    </Box>
  );

  const MainContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Typography>Loading payment details...</Typography>
        </Box>
      );
    }

    if (!thePayment) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Typography>Payment details not found</Typography>
        </Box>
      );
    }

    // Format amount display
    const formatAmount = (amount) => {
      return typeof formatCurrency === "function"
        ? formatCurrency(amount)
        : amount?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) ||
            "0.00";
    };

    // Calculate total payment amount
    const totalAmount = thePayment.payment.bills.reduce((total, bill) => {
      return total + (bill.amount || 0);
    }, 0);

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
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/*The Organization Details*/}
          <Box sx={{ p: 3, pl: 3, pt: 5 }}>
            <Typography
              sx={{
                color: "#333333",
                fontWeight: 600,
                fontSize: "20px",
                mb: 1,
              }}
            >
              {thePayment.organization.data?.org_name}
            </Typography>
            <Typography
              sx={{ color: "#999999", fontSize: "15px", lineHeight: 1.5 }}
            >
              {thePayment.organization.data?.first_street}
            </Typography>
            <Typography
              sx={{ color: "#999999", fontSize: "15px", lineHeight: 1.5 }}
            >
              {thePayment.organization?.data?.city}
            </Typography>
            <Typography
              sx={{ color: "#999999", fontSize: "15px", lineHeight: 1.5 }}
            >
              {thePayment.organization?.data?.country}
            </Typography>
            <Typography
              sx={{ color: "#999999", fontSize: "15px", lineHeight: 1.5 }}
            >
              {thePayment.organization?.data?.phone}
            </Typography>
            <Typography sx={{ color: "#999999", fontSize: "15px" }}>
              {thePayment.organization?.data?.gst_in}
            </Typography>
            <Typography sx={{ color: "#999999", fontSize: "15px", mb: 2 }}>
              {thePayment.organization?.data?.email}
            </Typography>
          </Box>

          <Divider />

          {/* Payment Title */}
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: 400,
              fontSize: "18px",
              my: 3,
            }}
          >
            PAYMENTS MADE
          </Typography>

          {/* Diagonal Status Banner */}
          {thePayment?.payment?.status && (
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                left: "-20px",
                backgroundColor: getStatusColor(thePayment.payment.status),
                color: "white",
                padding: "5px 5px",
                fontSize: "14px",
                fontWeight: "700",
                textTransform: "uppercase",
                transform: "rotate(-45deg)",
                transformOrigin: "center",
                zIndex: 1000,
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                letterSpacing: "1px",
                minWidth: "120px",
                textAlign: "center",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              {getStatusText(thePayment.payment.status)}
            </Box>
          )}
          
         

          {/* Payment Details Section */}
          <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4 }}>
            <Box sx={{ flex: "1 1 75%", pr: 2 }}>
              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography
                  sx={{ color: "#777", fontSize: "0.9rem", width: 180 }}
                >
                  Payment#
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {thePayment.payment.payment_id}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography
                  sx={{ color: "#777", fontSize: "0.9rem", width: 180 }}
                >
                  Payment Date
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {new Date(thePayment.payment.createdAt).toLocaleDateString(
                    "en-GB"
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography
                  sx={{ color: "#777", fontSize: "0.9rem", width: 180 }}
                >
                  Reference Number
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {thePayment.payment.reference_number}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography
                  sx={{ color: "#777", fontSize: "0.9rem", width: 180 }}
                >
                  Paid To
                </Typography>
                <Typography
                  sx={{
                    color: "#408dfb",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  {thePayment.payment.contact_id.contact_name}
                </Typography>
                {/* <Typography
                  sx={{
                    color: "#408dfb",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  {thePayment.payment.contact_id.billing_address.address}
                </Typography> */}
                {/* <Typography
                  sx={{
                    color: "#408dfb",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  {thePayment.payment.contact_id.billing_address.city}
                </Typography> */}
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography
                  sx={{ color: "#777", fontSize: "0.9rem", width: 180 }}
                >
                  Payment Mode
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {thePayment.payment.payment_mode}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography
                  sx={{ color: "#777", fontSize: "0.9rem", width: 180 }}
                >
                  Paid Through
                </Typography>
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {thePayment.payment.paid_through_account_id}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: "0 0 auto", width: 170 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#7CB342",
                    color: "white",
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "15px", fontWeight: "400" }}>
                    Amount Paid
                  </Typography>
                  <Typography sx={{ fontSize: "21px", fontWeight: 400 }}>
                    ₹
                    {formatAmount(
                      totalAmount || thePayment.payment.amount || 4500
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Paid To Section */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: "#777", fontSize: "0.9rem", mb: 3 }}>
              Paid To
            </Typography>
            <Typography
              sx={{
                color: "#333333",
                fontWeight: 600,
                fontSize: "16px",
                mb: 0.5,
              }}
            >
              {thePayment.payment.contact_id?.contact_name}
            </Typography>
            <Typography sx={{ color: "#333333", fontSize: "14px" }}>
              {thePayment.payment.contact_id?.billing_address?.address +
                thePayment.payment.contact_id.billing_address?.street2}
            </Typography>
            <Typography sx={{ color: "#333333", fontSize: "14px" }}>
              {thePayment.payment.contact_id.billing_address?.city}
            </Typography>
            <Typography sx={{ color: "#333333", fontSize: "14px" }}>
              {thePayment.payment.contact_id.billing_address?.state}
            </Typography>
            <Typography sx={{ color: "#333333", fontSize: "14px" }}>
              {thePayment.payment.contact_id.billing_address?.country}
            </Typography>
            <Typography sx={{ color: "#333333", fontSize: "14px" }}>
              {thePayment.payment.contact_id.billing_address?.zip}
            </Typography>
            <Typography sx={{ color: "#333333", fontSize: "14px", mb: 3 }}>
              {thePayment.payment.contact_id.gst_no}
            </Typography>
          </Box>

          {/* Payment For Section */}
          {thePayment.payment.payment_type === "VendorAdvance" ? (
            <>
              <Typography
                sx={{
                  color: "#333333",
                  fontSize: "14px",
                  mb: 3,
                  textAlign: "end",
                }}
              >
                Over payment: ₹{formatAmount(thePayment.payment.amount || 0)}
              </Typography>
            </>
          ) : (
            <>
              <Box>
                <Typography
                  sx={{
                    color: "#333333",
                    fontWeight: 400,
                    fontSize: "18px",
                    mb: 1.5,
                    mt: 3,
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
                            fontWeight: "400 !important",
                            fontSize: "14px !important",
                            p: 1.5,
                          }}
                        >
                          Bill Number
                        </TableCell>
                        {/* <TableCell
                      sx={{
                        bgcolor: "#f5f5f5",
                        color: "#333333 !important",
                        fontWeight: "400 !important",
                        fontSize: "14px !important",
                        p: 1.5,
                      }}
                    >
                      Bill Date
                    </TableCell> */}
                        <TableCell
                          sx={{
                            bgcolor: "#f5f5f5",
                            color: "#333333 !important",
                            fontWeight: "400 !important",
                            fontSize: "14px !important",
                            p: 1.5,
                          }}
                        >
                          Bill Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            bgcolor: "#f5f5f5",
                            color: "#333333 !important",
                            fontWeight: "400 !important",
                            fontSize: "14px !important",
                            p: 1.5,
                          }}
                        >
                          Payment Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {thePayment.payment.bills.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              fontSize: "14px !important",
                              p: 1.5,
                              color: "#408dfb !important",
                            }}
                          >
                            {data.billNumber}
                          </TableCell>
                          {/* <TableCell sx={{ fontSize: "14px !important", p: 1.5 }}>
                        {new Date(data.createdAt).toLocaleDateString("en-GB")}
                      </TableCell> */}
                          <TableCell
                            sx={{ fontSize: "14px !important", p: 1.5 }}
                          >
                            ₹{formatAmount(data.total_payment_amount || 4500)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: "14px !important", p: 1.5 }}
                          >
                            ₹{formatAmount(data.amount_applied || 4500)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </Paper>
      </>
    );
  };

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
            fontSize: "0.875rem",
            color: "#666",
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: "400",
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

  return (
    <Box
      sx={{
        borderLeft: "1px solid #ddd",
        height: "90vh",
        overflowY: "auto",
      }}
    >
      <Header />
      <MainContent />
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
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmationDialog}
        maxWidth="xs"
        sx={{ marginTop: "-500px" }}
      >
        <DialogContent>
          <Typography sx={{ fontSize: "13px" }}>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>
            <Typography
              sx={{ fontSize: "12px", margin: "3.25px 3.25px 3.25px 0px" }}
            >
              Cancel
            </Typography>
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            <Typography
              sx={{ fontSize: "12px", margin: "3.25px 3.25px 3.25px 0px" }}
            >
              Delete
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentViewComponent;
