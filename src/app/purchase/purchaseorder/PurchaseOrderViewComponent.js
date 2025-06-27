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
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useRouter, useSearchParams } from "next/navigation";
import Button, { BUTTON_COLORS, BUTTON_SIZES } from "../../common/btn/Button";
import { usePathname } from "next/navigation";
import apiService from "../../../services/axiosService";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import ToggleOnIcon from "@mui/icons-material/ToggleOn"; // Added import
import ToggleOffIcon from "@mui/icons-material/ToggleOff"; // Added import
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CircularProgress } from "@mui/material";

import config from "../../../services/config";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CommentIcon from "@mui/icons-material/Comment";
import html2pdf from "html2pdf.js";
import CloseIcon from "@mui/icons-material/Close";
import formatCurrency from "../../common/FormatCurrency";
import {
  ArrowDropDown,
  AutoAwesome,
  DeleteOutline,
  IosShare,
} from "@mui/icons-material";
import { useSnackbar } from "../../../components/SnackbarProvider";
import {
  BadgeCheck,
  FileMinus2,
  FileText,
  Image,
  Mail,
  Pencil,
  Printer,
} from "lucide-react";
import CommentsDrawer from "../../common/commentAndHistory/CommentsDrawer";

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  p: 1,
  paddingRight: 2,
  color: "#222",
  cursor: "pointer",
  "&:hover": {
    color: "#2098FF",
  },
  "&:hover svg": {
    color: "#2098FF",
  },
};

const hoverColor = {
  color: "#2098FF",
  "& svg": { color: "#2098FF" },
};

const iconButtonStyle = {
  color: "rgba(0, 0, 0, 0.87)",
  fontSize: "13px",
  mx: 2,
  "&:hover": {
    color: "#2098FF",
    background: "transparent",
  },
};

const menuItemStyle = {
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
};

const menuPaperProps = {
  sx: {
    width: "190px",
    fontSize: "11px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
    mt: 1,
  },
};

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

const BillManagementApp = () => {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const pathname = usePathname();
  const { showMessage } = useSnackbar();
  const [Purchase_ID, setPurchase_ID] = useState("");
  let org_id = localStorage.getItem("organization_id");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedFileToDelete, setSelectedFileToDelete] = useState(null);

  const handleOpenConfirmationDialog = (file) => {
    setSelectedFileToDelete(file);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    let po_id = pathname.split("/")[3];
    setPurchase_ID(po_id);
    getPurchaseOrderDetail(po_id, org_id);
  }, [pathname]);

  const handleConfirmDelete = async () => {
    try {
      const org_id = localStorage.getItem("organization_id");
      const po_id = purchaseOrder.purchase_number;

      await apiService({
        method: "POST",
        url: `/api/v1/purchase-orders/remove-document?org_id=${org_id}&po_id=${po_id}`,
        data: {
          file_name: selectedFileToDelete.filename || selectedFileToDelete.name,
        },
      });

      // Update local state or refetch PO data
      showMessage("Document deleted successfully", "success");

      // Optionally refetch purchase order or update state
      setPurchaseOrder((prev) => {
        if (Array.isArray(prev.documents)) {
          return {
            ...prev,
            documents: prev.documents.filter(
              (doc) =>
                doc.filename !== selectedFileToDelete.filename &&
                doc.name !== selectedFileToDelete.name
            ),
          };
        } else {
          return {
            ...prev,
            documents: "",
          };
        }
      });
    } catch (error) {
      showMessage("Failed to delete document", "error");
      console.error("Error deleting document:", error);
    } finally {
      handleCloseConfirmationDialog();
    }
  };

  const getPurchaseOrderDetail = async (PO_ID, ORG_ID) => {
    setLoading(true);
    try {
      let params = {
        url: `api/v1/purchase-orders/get-individual-purchase-order?org_id=${ORG_ID}&po_id=${PO_ID}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      // Add artificial delay of 200ms
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await apiService(params);
      if (response.statusCode === 200) {
        setPurchaseOrder(response.data.data);
      }
    } catch (error) {
      console.log("getPurchaseOrderDetail error", error);
    } finally {
      setLoading(false);
    }
  };

  const [showPDFView, setShowPDFView] = useState(false);
  const [expandedSection, setExpandedSection] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isAttachFiles, setIsAttachFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [isZoho, setIsZoho] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  // Add this state to your component
  const [isUploading, setIsUploading] = useState(false);

  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    localStorage.setItem("purchaseId", purchaseOrder.purchase_number);
    router.push("/tally/preview?isStatus=PurchaseOrder");
  };
  // Improved PDF generation function
  const generatePDF = () => {
    setIsPdfGenerating(true);
    const currentShowPDFView = showPDFView;
    setShowPDFView(true);
    setTimeout(() => {
      try {
        const element = document.getElementById("pdf-view-container");
        if (!element) {
          console.error("PDF view element not found");
          setIsPdfGenerating(false);
          setShowPDFView(currentShowPDFView);
          return;
        }
        const elementClone = element.cloneNode(true);
        // Create a temporary container for the clone
        const tempContainer = document.createElement("div");
        tempContainer.appendChild(elementClone);
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        document.body.appendChild(tempContainer);
        // Find and modify status elements in the clone
        try {
          const rotatedElements = elementClone.querySelectorAll(
            '[style*="transform: rotate(-45deg)"]'
          );
          rotatedElements.forEach((el) => (el.style.display = "none"));
          // Hide status color elements - improving selectors
          const statusElements = elementClone.querySelectorAll(
            'div[style*="backgroundColor"]'
          );
          statusElements.forEach((el) => {
            const style = el.getAttribute("style");
            if (
              style &&
              (style.includes("#408dfb") ||
                style.includes("#1fcd6d") ||
                style.includes("#d3d3d3") ||
                style.includes("#808080"))
            ) {
              el.style.display = "none";
            }
          });

          // Remove any specific status text elements if needed
          if (purchaseOrder && purchaseOrder.status_type) {
            const textNodes = [];
            const walk = document.createTreeWalker(
              elementClone,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );

            let node;
            while ((node = walk.nextNode())) {
              if (
                node.textContent.trim() === purchaseOrder.status_type ||
                node.textContent.trim() === "OPEN" ||
                node.textContent.trim() === "DRAFT" ||
                node.textContent.trim() === "VOID"
              ) {
                textNodes.push(node);
              }
            }

            // Hide parent elements of matching text nodes
            textNodes.forEach((textNode) => {
              if (textNode.parentNode) {
                textNode.parentNode.style.display = "none";
              }
            });
          }
        } catch (err) {
          console.error("Error modifying clone:", err);
          // Continue anyway, since hiding elements is optional
        }

        // Configure PDF options
        const options = {
          filename: `PurchaseOrder-${
            purchaseOrder.purchase_number || "document"
          }.pdf`,
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
            // Restore original view state after a short delay
            setTimeout(() => {
              setShowPDFView(currentShowPDFView);
              setIsPdfGenerating(false);
            }, 100);
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
            // Clean up on error
            document.body.removeChild(tempContainer);
            setIsPdfGenerating(false);
            setShowPDFView(currentShowPDFView);
          });
      } catch (error) {
        console.error("Error in PDF generation process:", error);
        setIsPdfGenerating(false);
        setShowPDFView(currentShowPDFView);
      }
    }, 1000); // Increased timeout to ensure rendering is complete
  };
  const handleDeletePayment = async () => {
    try {
      const org_id = localStorage.getItem("organization_id");
      const response = await apiService({
        method: "DELETE",
        url: `api/v1/purchase-orders/delete-individual-purchase-order?org_id=${org_id}&po_id=${Purchase_ID}`,
        customBaseUrl: config.PO_Base_url,
      });

      if (response && (response.success || response.statusCode === 200)) {
        showMessage("Purchase Order deleted successfully", "success");

        setTimeout(() => {
          router.push(`/purchase/purchaseorder`);
        }, 1000);
      } else {
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          "Failed to delete Purchase Order";
        throw new Error(errorMessage);
      }
    } catch (err) {
      showMessage(err.message || "Failed to delete Purchase Order", "error");
    }
  };
  // File upload handler function
  const handleFileChanges = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    // Validate file count (max 5 files)
    if (files.length > 5) {
      showMessage("You can upload a maximum of 5 files", "error");
      event.target.value = ""; // Clear the input
      return;
    }
    // Validate file size (max 10MB each)
    for (let file of files) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB in bytes
        showMessage(`File "${file.name}" exceeds 10MB limit`, "error");
        event.target.value = ""; // Clear the input
        return;
      }
    }
    try {
      // Show loading state
      setIsUploading(true);
      // Create FormData for file upload
      const formData = new FormData();
      // Add files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append("documents", files[i]);
      }
      // Add other purchase order data if needed
      formData.append("po_id", Purchase_ID);
      formData.append("org_id", org_id);
      // Call the API to update purchase order with files
      const response = await apiService({
        method: "PUT",
        url: `api/v1/purchase-orders/update-individual-purchase-order?org_id=${org_id}&po_id=${Purchase_ID}`,
        customBaseUrl: config.PO_Base_url,
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
        // Update the local state with the new documents
        setPurchaseOrder((prevOrder) => ({
          ...prevOrder,
          documents: response.data?.documents ||
            response.documents || [
              ...(prevOrder.documents || []),
              ...Array.from(files),
            ],
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
          response?.message || response?.error || "Upload failed";
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

  const togglePDFView = () => {
    setShowPDFView(!showPDFView);
  };

  const handleSendOpen = () => {
    setIsSendOpen(true);
  };

  const handlePdfOpen = () => {
    setIsPdfOpen(true);
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
    setIsPdfOpen(false);
  };

  const isAttachFilesToggle = () => {
    setIsAttachFiles((prev) => !prev);
  };

  const handleClickOpen = () => {
    setOpenDelete(true);
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const router = useRouter();

  const tableview = () => {
    router.push("/purchase/bills");
  };

  const getBgColor = () => {
    if (purchaseOrder?.order_status === "draft") {
      return "#94a5a6";
    } else if (
      purchaseOrder?.order_status === "closed" ||
      purchaseOrder?.order_status === "invoiced"
    ) {
      return "#1fcd6d";
    } else if (purchaseOrder?.order_status === "issued") {
      return "#2098FF";
    } else if (purchaseOrder?.order_status === "canceld") {
      return "#474747";
    } else {
      return "#474747";
    }
  };

  const getWhatsNext = () => {
    if (purchaseOrder?.order_status === "issued" || purchaseOrder?.status_type === "ISSUED") {
      return "Convert this to a bill to complete your purchase.";
    } else if (purchaseOrder?.order_status === "reopen") {
      return "Send this purchase order to your vendor or mark it as issued.";
    }
  };

  const organization_id = localStorage.getItem("organization_id");
  const handlePurchaseStatus = async (selectedStatus) => {
    try {
      let formattedData = {};

      switch (selectedStatus) {
        case 0: // OPEN
          formattedData.status = 0;
          break;
        case 1: // DRAFT
          formattedData.status = 1;
          break;
        case 2: // VOID
          formattedData.status = 2;
          break;
        case 3: // PAID
          formattedData.status = 3;
          break;
        case 4: // CANCELED
          formattedData.status = 4;
          break;
        case 5: // RE-OPEN
          formattedData.status = 5;
          break;
        case 6: // RECEIVED
          formattedData.status = 6;
          break;
        case 7: // BILLED
          formattedData.status = 7;
          break;
        case 8: // UNDO-MARK AS RECEIVED
          formattedData.status = 8;
          break;
        case 9: // ISSUED
          formattedData.status = 9;
          break;
        default:
          console.error("Invalid status selected");
          return;
      }
      const response = await apiService({
        method: "PUT",
        customBaseUrl: config.PO_Base_url,
        url: `/api/v1/purchase-orders/update-status?org_id=${organization_id}&po_id=${Purchase_ID}`,
        data: formattedData,
      });
      const message = response.data.message;
      showMessage(message, "success");
      getPurchaseOrderDetail(Purchase_ID);
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleEditClick = () => {
    // Navigate to the edit page with the purchase_id
    router.push(`/purchase/purchaseorder/edit/${Purchase_ID}`);
  };
  const handleConvert = async (PO_ID) => {
    console.log(org_id, PO_ID, "handleConvert");
    router.push(`/purchase/bills/create?purchase_id=${PO_ID}`);
    // let params = {
    //   url: `api/v1/purchase-orders/update-bill?org_id=${org_id}&po_id=${PO_ID}`,
    //   method: "POST",
    //   customBaseUrl: config.PO_Base_url,
    // };
    // let response = await apiService(params);
    // console.log("response", response);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const handleBillRoute = (data) => {
    router.push(`/purchase/bills/${data}`);
  };

  // Skeleton loaders for different sections
  const HeaderSkeleton = () => (
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
          <Skeleton variant="text" width={150} height={30} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={30}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={150}
            height={30}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton variant="circular" width={30} height={30} />
        </Box>
      </Box>

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
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton
            variant="rectangular"
            width={80}
            height={30}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={80}
            height={30}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={30}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={30}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={40}
            height={30}
            sx={{ borderRadius: 1 }}
          />
        </Box>
        <Skeleton variant="circular" width={30} height={30} />
      </Box>
    </Box>
  );

  const CreditsAppliedSectionSkeleton = () => (
    <Box>
      <Paper
        sx={{
          p: 0,
          boxShadow: "none",
          border: "1px solid #ddd",
          m: 6,
          borderRadius: 2,
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            sx={{ ml: 2, borderRadius: 1 }}
          />
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 0,
          boxShadow: "none",
          border: "1px solid #ddd",
          m: 6,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton variant="text" width={100} height={30} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </Paper>
    </Box>
  );

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
    </TableRow>
  );

  const PDFViewSkeleton = () => (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        position: "relative",
        mb: 2,
        width: "8.27in",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", top: 15, left: -30, zIndex: 1 }}>
        <Skeleton
          variant="rectangular"
          width={120}
          height={30}
          sx={{ transform: "rotate(-45deg)" }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ mt: 4, ml: 7 }}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />

            <Box sx={{ mt: 4 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Skeleton
            variant="text"
            width="70%"
            height={40}
            sx={{ ml: "auto" }}
          />
          <Skeleton variant="text" width="40%" sx={{ ml: "auto" }} />

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item xs={6} textAlign="right">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ mt: 4, boxShadow: "none", border: "1px solid #ddd" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={6} textAlign="right" sx={{ pr: 2 }}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8 }}>
        <Skeleton variant="text" width={200} />
      </Box>
    </Paper>
  );

  const NormalViewSkeleton = () => (
    <Box>
      <Paper
        elevation={4}
        sx={{ p: 3, position: "relative", mb: 2, width: "8.27in" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ width: "60%", p: 2 }}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="50%" />
            <Skeleton
              variant="rectangular"
              width={50}
              height={24}
              sx={{ mt: 1 }}
            />

            <Box sx={{ width: "100%", display: "flex", mt: 4 }}>
              <Box sx={{ width: "45%" }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} variant="text" width="90%" />
                ))}
              </Box>
              <Box sx={{ width: "55%" }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} variant="text" width="80%" />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: "40%", p: 2, pt: 3 }}>
            <Skeleton variant="text" width="80%" height={24} />
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <Skeleton key={item} variant="text" width="90%" />
            ))}
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ mt: 4, boxShadow: "none", border: "1px solid #ddd" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {[1, 2, 3, 4, 5].map((item) => (
                  <TableCell key={item}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRowSkeleton key={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={7} textAlign="right" sx={{ pr: 2 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Divider sx={{ my: 1 }} />
                <Skeleton variant="text" />
              </Grid>
              <Grid item xs={5} textAlign="right">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Divider sx={{ my: 1 }} />
                <Skeleton variant="text" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  // PDF View Component
  const PDFView = () => (
    <Paper
      id="pdf-view-container"
      elevation={4}
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
          backgroundColor: "#408dfb ",
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
        {purchaseOrder.status_type}
      </Box>

      {/* <Box
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
        {purchaseOrder?.order_status_formatted}
      </Box> */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ mt: 4, ml: 7 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "600 !important",
                color: "black",
                fontSize: "14px !important",
              }}
            >
              {purchaseOrder.organization.org_name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                // fontWeight: "600 !important",
                color: "black",
                fontSize: "12px !important",
              }}
            >
              {
                purchaseOrder.organization.city +
                  " " +
                  " " +
                  purchaseOrder.organization.state
                //  + " "+purchaseOrder.organization.zip
              }
            </Typography>
            <Typography
              variant="body2"
              sx={{
                // fontWeight: "400 !important",
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {purchaseOrder.organization.country}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                // fontWeight: "400 !important",
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {purchaseOrder.organization.phone}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400 !important",
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {purchaseOrder.vendor_id.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400 !important",
                fontSize: "12px",
                color: "#333333",
              }}
            >
              GSTIN: {purchaseOrder.vendor_id.gst_no}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                {purchaseOrder.vendor_id?.contact_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                {purchaseOrder.vendor_id?.billing_address?.city}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                GTIN: {purchaseOrder.vendor_id?.gst_no}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Box></Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "400",
              mt: 2,
              fontFamily: "'Times New Roman', serif",
              fontSize: "28px",
            }}
          >
            PURCHASE ORDER
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "black",
              fontFamily: "'Times New Roman', serif",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {purchaseOrder.purchase_number}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item xs={6} textAlign="right">
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Order Number :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Bill Date :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Due Date :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  Terms :
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "400" }}
                >
                  {purchaseOrder.purchase_order_number || "-"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "400" }}
                >
                  {purchaseOrder.created_time &&
                    new Date(purchaseOrder.created_time).toLocaleDateString(
                      "en-GB"
                    )}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "400" }}
                >
                  {purchaseOrder.due_date &&
                    new Date(purchaseOrder.due_date).toLocaleDateString(
                      "en-GB"
                    )}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "400" }}
                >
                  {purchaseOrder.payment_terms}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "12px", fontWeight: "400" }}
                >
                  {purchaseOrder.payment_terms_label}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ mt: 4, boxShadow: "none", border: "1px solid #ddd" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                ITEMS & DESCRIPTION
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                QUANTITY
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                RATE
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                AMOUNT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(purchaseOrder.items) &&
              purchaseOrder.items.map((data, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px !important",
                        fontWeight: "400 !important",
                        color: "#408dfb ",
                      }}
                    >
                      {data.details}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    {data.quantity}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    ₹{formatCurrency(data.rate)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    ₹{formatCurrency(data.amount)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ mt: 2}}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={8}>
              <Grid container>
                <Grid item  textAlign="right" sx={{ pr: 1,ml:6 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      mt: 1,
                      fontSize: "12px !important",
                    }}
                  >
                    Sub Total
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "400",
                      mt: 1,
                      fontSize: "12px !important",
                    }}
                  >
                    Discount
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      mt: 1,
                      fontSize: "12px !important",
                    }}
                  >
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontSize: "12px !important" }}
                  >
                    ₹{formatCurrency(purchaseOrder.total)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontSize: "12px !important" }}
                  >
                    (-) ₹{formatCurrency(purchaseOrder.tax_amount)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontSize: "12px !important" }}
                  >
                    ₹{formatCurrency(purchaseOrder.total)}
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
            sx={{ pb: 1, fontSize: "14px", fontWeight: "400" }}
          >
            Authorized Signature _______________
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  // Normal View Component (when PDF view is off)
  const NormalView = () => (
    <Box>
      <Paper
        elevation={4}
        sx={{ p: 3, position: "relative", mb: 2, width: "8.27in" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ width: "60%", p: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "400",
                fontSize: "23px",
                fontFamily: "'Times New Roman', serif",
              }}
            >
              PURCHASE ORDER
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                mr: 1,
                color: "black",
                fontSize: "13px",
                fontWeight: "400",
              }}
            >
              {purchaseOrder.purchase_number}
            </Typography>
            {/* <Box
              sx={{
                color: "white",
                backgroundColor: getBgColor(),
                textAlign: "center",
                p: 0.5,
                fontSize: "0.75rem",
                width: 65,
                mt: 1,
              }}
            >
              {purchaseOrder.order_status_formatted}
            </Box> */}

            <Box sx={{ width: "100%", display: "flex", mt: 4 }}>
              <Box
                sx={{
                  width: "45%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mr: 1,
                      color: "#666",
                      fontSize: "13px",
                      fontWeight: "400",
                    }}
                  >
                    Reference#
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mr: 1,
                      color: "#666",
                      fontSize: "13px",
                      fontWeight: "400",
                    }}
                  >
                    Order Date
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mr: 1,
                      color: "#666",
                      fontSize: "13px",
                      fontWeight: "400",
                    }}
                  >
                    Delivery Date
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mr: 1,
                      color: "#666",
                      fontSize: "13px",
                      fontWeight: "400",
                    }}
                  >
                    Payment Terms
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "55%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box>{purchaseOrder.purchase_order_number || "-"}</Box>
                <Box>
                  {purchaseOrder.created_time &&
                    new Date(purchaseOrder.created_time).toLocaleDateString(
                      "en-GB"
                    )}
                </Box>
                <Box>
                  {purchaseOrder.due_date &&
                    new Date(purchaseOrder.due_date).toLocaleDateString(
                      "en-GB"
                    )}
                </Box>
                <Box>{purchaseOrder.payment_terms}</Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: "40%", p: 2, pt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mr: 1, mb: 1, fontWeight: "bold", color: "#685555" }}
            >
              ORG ADDRESS(To)
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ color: "#408dfb " }}>
                {/* {purchaseOrder.vendor_id.company_name} */}
              </Typography>
              <Typography variant="body2" sx={{ pb: 1, color: "#408dfc" }}>
                {purchaseOrder.organization?.org_name}
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.organization?.first_street}
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.organization?.second_street}
              </Typography>
              <Typography variant="body2">
                {
                  purchaseOrder.organization?.city +
                    " ," +
                    " " +
                    purchaseOrder.organization?.state
                  //  + " "+purchaseOrder.organization.zip
                }
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.organization?.country}
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.organization?.phone}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "40%", p: 2, pt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mr: 1, mb: 1, fontWeight: "bold", color: "#685555" }}
            >
              VENDOR ADDRESS (From)
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ color: "#408dfb " }}>
                {/* {purchaseOrder.vendor_id.company_name} */}
              </Typography>
              <Typography variant="body2" sx={{ pb: 1, color: "#408dfc" }}>
                {purchaseOrder.vendor_id?.contact_name || " "}
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.vendor_id?.billing_address?.address || " "}
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.vendor_id?.billing_address?.street2 || ""}
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.vendor_id?.billing_address?.city ||
                  " " + purchaseOrder.vendor_id?.billing_address?.state ||
                  " "}
              </Typography>
              <Typography variant="body2">
                {purchaseOrder.vendor_id?.billing_address?.country ||
                  "" + purchaseOrder.vendor_id?.billing_address?.zip ||
                  ""}
              </Typography>
              <Typography variant="body2">
                {/* {purchaseOrder.vendor_id?.mobile || ""} */}
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ mt: 4, boxShadow: "none", border: "1px solid #ddd" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  ITEMS & DESCRIPTION
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  QUANTITY
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  RATE
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  AMOUNT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(purchaseOrder.items) &&
                purchaseOrder.items.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell
                      align="center"
                      sx={{
                        color: "black !important ",
                        fontSize: "14px !important",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "500",
                          color: "#408dfb ",
                          fontSize: "14px !important",
                        }}
                      >
                        {data.details}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "black !important ",
                        fontSize: "14px !important",
                      }}
                    >
                      {data.quantity}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "black !important ",
                        fontSize: "14px !important",
                      }}
                    >
                      ₹{formatCurrency(data.rate)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "black !important ",
                        fontSize: "14px !important",
                      }}
                    >
                      ₹{formatCurrency(data.amount)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={7} textAlign="right" sx={{ pr: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }}
                >
                  Sub Total
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400", mt: 1, fontSize: "14px" }}
                  color="textSecondary"
                >
                  Discount
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }}
                >
                  Total
                </Typography>
              </Grid>
              <Grid item xs={5} textAlign="right">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }}
                >
                  ₹{formatCurrency(purchaseOrder.total)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontWeight: "400", mt: 1, fontSize: "14px" }}
                >
                  (-) ₹{formatCurrency(purchaseOrder.tax_amount)}
                </Typography>
                <Divider sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }} />
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  ₹{formatCurrency(purchaseOrder.total)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  // Credits Applied Section Component
  const CreditsAppliedSection = () => (
    <Box>
      {purchaseOrder.status == 0 ? (
        <>
          <Paper
            sx={{
              p: 0,
              boxShadow: "none",
              border: "1px solid #ddd",
              m: 2,
              // borderRadius: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                height: "50px",
                borderRadius: "2px",
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
              <Typography variant="body2" sx={{ display: "flex" }}>
                <Typography variant="body2" sx={{ fontSize: "12px" }}>
                  <span style={{ fontWeight: "600" }}>WHAT`S NEXT? </span>
                  {getWhatsNext()}
                </Typography>
              </Typography>
              {(purchaseOrder?.status_type === "DRAFT") && (
                <Box
                  sx={{
                    ml: 2,
                    width: "100px",
                    height: "30px",
                    textTransform: "none",
                    fontWeight: "400",
                    textAlign: "center",
                    alignContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    cursor: "pointer",
                    // p: 1,
                    bgcolor: "#f2f4f7",
                    border: "1px solid gray",
                    borderRadius: "4px",
                    color: "black",
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                  onClick={() => handlePurchaseStatus(9)} // Mark as Issued
                >
                  Mark as Issued
                </Box>
              )}

              {(purchaseOrder?.order_status === "issued" ||
                purchaseOrder?.status_type === "ISSUED") && (
                  <Box
                    sx={{
                      ml: 2,
                      width: "120px",
                      height: "30px",
                      textTransform: "none",
                      fontSize: "12px",
                      fontWeight: "400",
                      textAlign: "center",
                      alignContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      // p: 1,
                      bgcolor: "#408dfb",
                      borderRadius: "4px",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#3272d1",
                      },
                    }}
                    onClick={() => handleConvert(purchaseOrder.purchase_number)} // Convert to Bill
                  >
                    Convert Bill
                  </Box>
                )}
            </Box>
          </Paper>
        </>
      ) : (
        <>
          <Paper
            sx={{
              p: 0,
              boxShadow: "none",
              border: "1px solid #ddd",
              m: 2,
              // borderRadius: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "13PX",
              }}
              onClick={toggleSection}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "600", fontSize: "13PX", color: "#21263C" }}
              >
                Bills
                <Typography
                  component="span"
                  sx={{ ml: 1, fontSize: "0.8rem", color: "#408dfb" }}
                >
                  1
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
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: "600 !important",
                              fontSize: "13px !important",
                              backgroundColor: "white !important",
                              color: "#6C718A !important",
                            }}
                          >
                            Bills#
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "600 !important",
                              fontSize: "13px !important",
                              backgroundColor: "white !important",
                              color: "#6C718A !important",
                            }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "600 !important",
                              fontSize: "13px !important",
                              backgroundColor: "white !important",
                              color: "#6C718A !important",
                            }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "600 !important",
                              fontSize: "13px !important",
                              backgroundColor: "white !important",
                              color: "#6C718A !important",
                            }}
                          >
                            Due Date
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "600 !important",
                              fontSize: "13px !important",
                              backgroundColor: "white !important",
                              color: "#6C718A !important",
                            }}
                          >
                            Amount
                          </TableCell>
                          {/* <TableCell
                            sx={{
                              fontWeight: "600 !important",
                              fontSize: "13px !important",
                              backgroundColor: "white !important",
                              color: "#6C718A !important",
                            }}
                          >
                            Balance Due
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "600 !important",
                              fontSize: "13px !important",
                              backgroundColor: "white !important",
                              color: "#6C718A !important",
                            }}
                          ></TableCell> */}
                        </TableRow>
                      </TableHead>
                      {purchaseOrder.bills.length &&
                        purchaseOrder.bills.map((data) => {
                          return (
                            <>
                              <TableBody>
                                <TableRow sx={{ height: 30 }}>
                                  {/* Reduced row height */}
                                  <TableCell
                                    align="left"
                                    sx={{
                                      color: "#4691fb !important",
                                      fontWeight: "400 !important",
                                      fontSize: "13px !important",
                                    }}
                                  >
                                    <a
                                      onClick={() =>
                                        router.push(
                                          `/purchase/bills/${data.bill_ref_id?.bill_number}`
                                        )
                                      }
                                    >
                                      {data.bill_ref_id?.bill_number}
                                    </a>
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{
                                      color: "black !important",
                                      fontWeight: "400 !important",
                                      fontSize: "13px !important",
                                    }}
                                  >
                                    {formatDate(data.bill_ref_id?.billDate)}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{
                                      color: "#69c5a3 !important",
                                      fontWeight: "400 !important",
                                      fontSize: "13px !important",
                                    }}
                                  >
                                    {data.bill_ref_id?.status_type}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{
                                      color: "black !important",
                                      fontWeight: "400 !important",
                                      fontSize: "13px !important",
                                    }}
                                  >
                                    {formatDate(data.bill_ref_id?.due_date)}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    sx={{ color: "black" }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          color: "black !important",
                                          fontWeight: "400 !important",
                                          fontSize: "13px !important",
                                        }}
                                      >
                                        {"₹" +
                                          formatCurrency(
                                            data.bill_ref_id?.total
                                          )}
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  {/* <TableCell
                                    align="left"
                                    sx={{
                                      color: "black !important",
                                      fontWeight: "400 !important",
                                      fontSize: "13px !important",
                                    }}
                                  >
                                    ₹ 45,000
                                  </TableCell> */}
                                  {/* <TableCell align="right">
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
                                  </TableCell> */}
                                </TableRow>
                              </TableBody>
                            </>
                          );
                        })}
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        </>
      )}
    </Box>
  );

  // App Header - fixed at the top
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
            {purchaseOrder?.purchase_number}
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
            <Box>
              <Typography sx={{ fontSize: "13px" }}>Attach Files</Typography>
            </Box>
          </Box>

          {/* Attachments Menu */}
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
              {!purchaseOrder.documents ||
              (Array.isArray(purchaseOrder.documents) &&
                purchaseOrder.documents.length === 0) ? (
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

                  {/* Upload New File - Only show when no documents */}
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
              ) : (
                <Box sx={{ mt: 1, maxHeight: "150px", overflowY: "auto" }}>
                  {Array.isArray(purchaseOrder.documents) ? (
                    purchaseOrder.documents.map((file, index) => (
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
                    ))
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body2" fontSize="13px">
                        {purchaseOrder.documents ||
                          purchaseOrder.documents.name ||
                          "Document"}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          component="a"
                          href={`${config.FILE_BASE_URL}/${
                            purchaseOrder.documents.filepath ||
                            purchaseOrder.documents.path
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleOpenConfirmationDialog(
                              purchaseOrder.documents
                            )
                          }
                          sx={{ color: "error.main" }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>
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
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
                Comments & History
              </Typography>
            </Box>
          </Box>

          <CommentsDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            module={"Purchase_order"}
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
          position: "sticky",
          backgroundColor: "#f8f8f8",
          zIndex: 10,
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Conditional Buttons based on status */}
          {purchaseOrder?.order_status !== "canceled" && (
            <>
              {/* Edit */}
              <Box sx={buttonStyle} onClick={handleEditClick}>
                <Pencil
                  width="16px"
                  height="12px"
                  style={{ marginRight: "4px" }}
                />
                Edit
              </Box>
              <Divider orientation="vertical" flexItem />

              {/* Email */}
              <Box
                sx={buttonStyle}
                onClick={() =>
                  router.push(`/purchase/purchaseorder/${Purchase_ID}/email`)
                }
              >
                <IconButton size="small">
                  <Mail width="16px" />
                </IconButton>
                <Box>Send Email</Box>
              </Box>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          {/* PDF/Print Dropdown (always visible for canceled, conditionally for others) */}
          {(purchaseOrder?.order_status === "canceled" ||
            purchaseOrder?.order_status !== "canceled") && (
            <>
              <Box sx={buttonStyle} onClick={handlePdfOpen}>
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
                  left: purchaseOrder?.order_status === "canceled" ? 600 : 750,
                }}
                PaperProps={menuPaperProps}
              >
                <MenuItem
                  onClick={() => {
                    setIsPdfOpen(false);
                    generatePDF();
                  }}
                  sx={menuItemStyle}
                >
                  <FileText width="13px" style={{ marginRight: 3 }} />
                  PDF
                </MenuItem>

                {purchaseOrder?.order_status !== "canceled" && (
                  <MenuItem onClick={handleClose} sx={menuItemStyle}>
                    <Printer width="13px" style={{ marginRight: 3 }} />
                    Print
                  </MenuItem>
                )}
              </Menu>
            </>
          )}

          {/* Status-specific Action Buttons */}
          {purchaseOrder?.status_type === "DRAFT" && (
            <IconButton
              sx={iconButtonStyle}
              onClick={() => handlePurchaseStatus(9)}
            >
              <BadgeCheck width="18px" style={{ marginRight: "4px" }} /> Mark as
              Issued
            </IconButton>
          )}

          {(purchaseOrder?.order_status === "issued" || purchaseOrder?.status_type === "ISSUED")  && (
            <IconButton
              sx={iconButtonStyle}
              onClick={() => handleConvert(purchaseOrder.purchase_number)}
            >
              <FileMinus2 width="16px" style={{ marginRight: "4px" }} />
              Convert to Bill
            </IconButton>
          )}

          {/* More Options */}
          <Divider orientation="vertical" flexItem />
          <Box sx={{ p: 1, cursor: "pointer", "&:hover": hoverColor }}>
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
                    purchaseOrder?.order_status === "canceled"
                      ? 690
                      : ["draft", "issued"].includes(
                          purchaseOrder?.order_status
                        )
                      ? 900
                      : 890,
                }}
                PaperProps={menuPaperProps}
              >
                {purchaseOrder?.order_status !== "canceled" ? (
                  <>
                    <MenuItem sx={menuItemStyle}>
                      Expected Delivery Date
                    </MenuItem>
                    <MenuItem sx={menuItemStyle}>Cancel Items</MenuItem>
                    <MenuItem
                      sx={menuItemStyle}
                      onClick={() => handlePurchaseStatus(4)}
                    >
                      Mark as Canceled
                    </MenuItem>
                    <MenuItem
                      sx={{
                        ...menuItemStyle,
                        backgroundColor: "rgba(66, 133, 244, 0.1)",
                      }}
                    >
                      Clone
                    </MenuItem>
                    <MenuItem sx={menuItemStyle} onClick={handleDeletePayment}>
                      Delete
                    </MenuItem>
                    <MenuItem
                      sx={menuItemStyle}
                      onClick={() =>
                        purchaseOrder?.received_status === "received"
                          ? handlePurchaseStatus(8)
                          : handlePurchaseStatus(6)
                      }
                    >
                      {purchaseOrder?.received_status === "received"
                        ? "Undo Marked Received"
                        : "Mark as Received"}
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      sx={{
                        ...menuItemStyle,
                        backgroundColor: "rgba(66, 133, 244, 0.1)",
                      }}
                    >
                      Clone
                    </MenuItem>
                    <MenuItem
                      sx={menuItemStyle}
                      onClick={() => handlePurchaseStatus(5)}
                    >
                      Reopen
                    </MenuItem>
                    <MenuItem sx={menuItemStyle} onClick={handleDeletePayment}>
                      Delete
                    </MenuItem>
                  </>
                )}
              </Menu>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // PDF Toggle - sticky under the header
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
      {/* Left side: Bill Status - with flex-grow to push toggle to right */}
      <Box sx={{ flex: 1 }}>
        {/* Only show the status Box if there's any status data to display */}
        {(purchaseOrder?.received_status &&
          purchaseOrder?.received_status !== "undo-mark-as-received") ||
        purchaseOrder?.billed_status === "billed" ? (
          <Box
            sx={{ display: "flex", alignItems: "center", minHeight: "24px" }}
          >
            {/* Received Status */}
            {purchaseOrder?.received_status &&
              purchaseOrder?.received_status !== "undo-mark-as-received" && (
                <Typography variant="body2" sx={{ color: "black", pr: 2 }}>
                  Receive Status:{" "}
                  <span style={{ color: "green" }}>
                    {purchaseOrder.received_status_formatted}
                  </span>
                </Typography>
              )}

            {/* Billed Status - only when status is exactly 'billed' */}
            {purchaseOrder?.billed_status === "billed" && (
              <Typography variant="body2" sx={{ color: "black" }}>
                Billed Status:{" "}
                <span style={{ color: "blue" }}>
                  {purchaseOrder.billed_status_formatted}
                </span>
              </Typography>
            )}
          </Box>
        ) : null}
      </Box>

      {/* Right side: PDF Toggle - always stays in right corner */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0, // Prevents shrinking
        }}
      >
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
    <Paper sx={{ borderLeft: "1px solid #ddd" }}>
      {loading ? (
        <>
          <HeaderSkeleton />
          <CreditsAppliedSectionSkeleton />
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
                <Skeleton variant="text" width={120} />
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
            {showPDFView ? <PDFViewSkeleton /> : <NormalViewSkeleton />}
          </Box>
        </>
      ) : (
        <>
          <Header />
          <CreditsAppliedSection />
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
            {showPDFView ? <PDFView /> : <NormalView />}
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
          <Button onClick={handleCloseConfirmationDialog} variant="contained">
            Cancel
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
    </Paper>
  );
};

export default BillManagementApp;
