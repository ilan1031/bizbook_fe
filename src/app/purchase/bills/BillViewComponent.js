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
  TextField,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import CommentIcon from "@mui/icons-material/Comment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CommentsDrawer from "../../common/commentAndHistory/CommentsDrawer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { usePathname, useRouter } from "next/navigation";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import { useSnackbar } from "../../../components/SnackbarProvider";
import html2pdf from "html2pdf.js";
import formatCurrency from "../../common/FormatCurrency";

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
  padding: theme.spacing(3),
  margin: "0 auto",
}));

const handleVoidBill = async (reason) => {
  try {
    // Get bill_id from the URL path
    const bill_ID = pathname.split("/")[3];
    const org_id = localStorage.getItem("organization_id");

    // Call API to update status to void
    const response = await apiService({
      method: "POST",
      url: `api/v1/bills/update-status-void?org_id=${org_id}&bill_id=${bill_ID}&status=void&reason=${encodeURIComponent(
        reason
      )}`,
      customBaseUrl: config.PO_Base_url,
    });

    // Check response structure correctly
    if (response && (response.success || response.statusCode === 200)) {
      // Update local state to reflect status change with gray color styling
      setBillDetail((prevState) => ({
        ...prevState,
        status: 2,
        status_type: "VOID",
      }));

      // Close the menu
      handleClose();

      // Refresh the bill details to show the updated status
      getIndividualBill(bill_ID, org_id);

      // Show success message
      showMessage("Bill status has been updated to Void", "success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      // More detailed error handling based on response structure
      const errorMessage =
        response?.message ||
        response?.data?.message ||
        "Failed to update status";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error voiding bill:", error);
    showMessage(
      `Failed to void bill: ${error.message || "Please try again"}`,
      "error"
    );
  }
};
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Update the MenuItem for Void to use openModal
<MenuItem
  sx={{
    fontSize: "13px",
    "&:hover": {
      backgroundColor: "#408dfb",
      color: "white",
      borderRadius: 2,
    },
  }}
  onClick={() => {
    openModal(
      "Void Bill",
      "Are you sure you want to void this bill?",
      () => {}, // This will be replaced by the function passed to onConfirm
      "Void Bill"
    );
    handleClose(); // Close the more options menu
  }}
>
  Void
</MenuItem>;

// Now we need to update the StatusActionModal component to handle the void action

const StatusActionModal = ({
  open,
  onClose,
  onConfirm,
  title,
  actionType,
  confirmButtonText = "Confirm",
}) => {
  const [reason, setReason] = useState("");

  // Get appropriate prompt based on action type
  const getPromptText = () => {
    if (actionType === "void") {
      return "Enter a reason for marking this transaction as Void.";
    } else if (actionType === "draft") {
      return "Enter a reason for converting this bill to Draft.";
    } else if (actionType === "open") {
      return "Enter a reason for converting this bill to Open.";
    } else {
      return "Enter a reason for this action.";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          position: "fixed",
          top: "8.5%",
          left: "50%",
          transform: "translateX(-50%)",
          m: 0,
          width: "450px",
          maxWidth: "95%",
          borderRadius: "4px",
          p: 0,
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>{getPromptText()}</Box>

        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onConfirm(reason);
              setReason("");
            }}
          >
            {confirmButtonText}
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              setReason("");
            }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Dialog>
  );
};

// Skeleton components for loading states
const SkeletonHeader = () => (
  <Box sx={{ mb: 2 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        height: "64px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Skeleton variant="text" width={150} height={32} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton variant="rectangular" width={100} height={32} />
        <Skeleton variant="rectangular" width={150} height={32} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Box>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        backgroundColor: "#f8f8f8",
        borderTop: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
        marginBottom: 4,
        height: "48px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={80}
            height={32}
            sx={{ mx: 1 }}
          />
        ))}
      </Box>
      <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
    </Box>
  </Box>
);

const SkeletonCredits = () => (
  <Box>
    <Paper sx={{ p: 0, boxShadow: "none", border: "1px solid #ddd", m: 2 }}>
      <Box
        sx={{ p: 1.5, display: "flex", alignItems: "center", height: "50px" }}
      >
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ ml: 2 }}
        />
      </Box>
    </Paper>
    <Paper sx={{ p: 0, boxShadow: "none", border: "1px solid #ddd", m: 2 }}>
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Skeleton variant="text" width={150} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Paper>
  </Box>
);

const SkeletonPDFToggle = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      mb: 2,
      py: 1,
    }}
  >
    <Skeleton variant="text" width={100} height={24} sx={{ mr: 1 }} />
    <Skeleton variant="rectangular" width={40} height={24} />
  </Box>
);

const SkeletonBillView = () => (
  <Paper elevation={4} sx={{ p: 4, mb: 2, width: "8.27in" }}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Skeleton variant="text" width="80%" height={32} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="70%" height={24} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="50%" height={24} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: "right" }}>
        <Skeleton
          variant="text"
          width="60%"
          height={40}
          sx={{ ml: "auto", mt: 2 }}
        />
        <Skeleton variant="text" width="40%" height={24} sx={{ ml: "auto" }} />

        <Box sx={{ mt: 2 }}>
          <Skeleton
            variant="text"
            width="30%"
            height={24}
            sx={{ ml: "auto" }}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={32}
            sx={{ ml: "auto" }}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item xs={6}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  width="90%"
                  height={24}
                  sx={{ ml: "auto", my: 1 }}
                />
              ))}
            </Grid>
            <Grid item xs={6}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  width="80%"
                  height={24}
                  sx={{ ml: "auto", my: 1 }}
                />
              ))}
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>

    <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 4 }} />

    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ width: "70%" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box
                key={i}
                sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
              >
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="30%" height={24} />
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

const SkeletonBillSection = () => (
  <Paper sx={{ px: 2, mb: 6, boxShadow: "none", border: "2px solid #f9f9fb" }}>
    <Box sx={{ px: 2, paddingTop: 2 }}>
      <Skeleton variant="text" width={100} height={32} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
    </Box>

    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Skeleton variant="text" width={100} height={32} />
    </Box>

    <TableContainer sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow>
            {[1, 2, 3].map((i) => (
              <TableCell key={i}>
                <Skeleton variant="text" width="80%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2].map((row) => (
            <TableRow key={row}>
              {[1, 2, 3].map((cell) => (
                <TableCell key={cell}>
                  <Skeleton variant="text" width="80%" height={24} />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Skeleton variant="text" width="0%" height={24} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="80%" height={24} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="80%" height={24} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const BillManagementApp = ({ journalId }) => {
  console.log("🔍 BillManagementApp received journalId:", journalId);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { showMessage } = useSnackbar();
  const [modalConfig, setModalConfig] = useState({
    open: false,
    title: "",
    message: "",
    confirmAction: null,
    confirmButtonText: "Confirm",
  });
  const [showPDFView, setShowPDFView] = useState(false);
  const [expandedSection, setExpandedSection] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isAttachFiles, setIsAttachFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [billDetail, setBillDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [isZoho, setIsZoho] = useState(false);

  const toggleMode = () => {
    setIsZoho((prev) => !prev);
    localStorage.setItem("billId", billDetail.bill_number);
    router.push("/tally/preview?isStatus=Bill");
  };
  // PDF generation function
  const generatePDF = () => {
    setIsPdfGenerating(true);

    // Force the PDF view to be visible first
    const currentShowPDFView = showPDFView;
    setShowPDFView(true);

    // Wait for the view to render before trying to generate PDF
    setTimeout(() => {
      try {
        // Get the element
        const element = document.getElementById("pdf-view-container");

        if (!element) {
          console.error("PDF view element not found");
          setIsPdfGenerating(false);
          return;
        }

        // Get the status badge element and temporarily hide it
        const statusBadgeElements = element.querySelectorAll("*");
        const hiddenElements = [];

        for (let i = 0; i < statusBadgeElements.length; i++) {
          const el = statusBadgeElements[i];
          if (
            el.textContent &&
            el.textContent.trim() === billDetail.status_type
          ) {
            // Save original display style
            hiddenElements.push({
              element: el,
              originalDisplay: el.style.display,
            });
            // Hide the element
            el.style.display = "none";
          }
        }

        // Basic options for html2pdf
        const options = {
          filename: `Bill-${billDetail.bill_number || "document"}.pdf`,
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

            // Restore display of hidden elements
            hiddenElements.forEach((item) => {
              item.element.style.display = item.originalDisplay;
            });

            // Restore original view state
            if (!currentShowPDFView) {
              setShowPDFView(currentShowPDFView);
            }
            setIsPdfGenerating(false);
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);

            // Restore display of hidden elements
            hiddenElements.forEach((item) => {
              item.element.style.display = item.originalDisplay;
            });

            setIsPdfGenerating(false);
            if (!currentShowPDFView) {
              setShowPDFView(currentShowPDFView);
            }
          });
      } catch (error) {
        console.error("Error in PDF generation process:", error);
        setIsPdfGenerating(false);
        if (!currentShowPDFView) {
          setShowPDFView(currentShowPDFView);
        }
      }
    }, 500);
  };

  const handleClone = () => {
    const bill_ID = pathname.split("/")[3];
    alert(bill_ID);
    router.push(`/purchase/bills/create?clone_id=${bill_ID}`);
  };

  const handleVoidBill = async (reason) => {
    try {
      // Get bill_id from the URL path
      const bill_ID = pathname.split("/")[3];
      const org_id = localStorage.getItem("organization_id");

      // Call API to update status to void
      const response = await apiService({
        method: "POST",
        url: `api/v1/bills/update-status-void?org_id=${org_id}&bill_id=${bill_ID}&status=void&reason=${encodeURIComponent(
          reason
        )}`,
        customBaseUrl: config.PO_Base_url,
      });

      // Check response structure correctly
      if (response && (response.success || response.statusCode === 200)) {
        // Update local state to reflect status change with gray color styling
        setBillDetail((prevState) => ({
          ...prevState,
          status: 2,
          status_type: "VOID",
        }));

        // Close the menu
        handleClose();

        // Refresh the bill details to show the updated status
        getIndividualBill(bill_ID, org_id);

        // Show success message
        showMessage("Bill status has been updated to Void", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // More detailed error handling based on response structure
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          "Failed to update status";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error voiding bill:", error);
      showMessage(
        `Failed to void bill: ${error.message || "Please try again"}`,
        "error"
      );
    }
  };

  // Modified handler for Convert to Draft
  const handleConvertToDraft = async () => {
    try {
      // Get bill_id from the URL path
      const bill_ID = pathname.split("/")[3];
      const org_id = localStorage.getItem("organization_id");

      // Call API to update status to draft
      const response = await apiService({
        method: "POST",
        url: `api/v1/bills/update-status-draft?org_id=${org_id}&bill_id=${bill_ID}&status=draft`,
        customBaseUrl: config.PO_Base_url,
      });

      // Check response structure correctly
      if (response && (response.success || response.statusCode === 200)) {
        // Update local state to reflect status change
        setBillDetail((prevState) => ({
          ...prevState,
          status: 1,
          status_type: "DRAFT",
        }));

        // Close the menu if needed
        if (typeof handleClose === "function") {
          handleClose();
        }

        // Refresh the bill details to show the updated status
        getIndividualBill(bill_ID, org_id);

        // Show success message
        showMessage("Bill status has been updated to Draft", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // More detailed error handling based on response structure
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          "Failed to update status";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error converting bill to draft:", error);
      showMessage(
        `Failed to convert bill to draft: ${
          error.message || "Please try again"
        }`,
        "error"
      );
    }
  };

  // Modified handler for Convert to Open
  const handleConvertToOpen = async () => {
    try {
      // Get bill_id from the URL path
      const bill_ID = pathname.split("/")[3];
      const org_id = localStorage.getItem("organization_id");

      // Call API to update status to open
      const response = await apiService({
        method: "POST",
        url: `api/v1/bills/update-status-from-draft?org_id=${org_id}&bill_id=${bill_ID}&status=open`,
        customBaseUrl: config.PO_Base_url,
      });

      // Check response structure correctly
      if (response && (response.success || response.statusCode === 200)) {
        // Update local state to reflect status change
        setBillDetail((prevState) => ({
          ...prevState,
          status: 0,
          status_type: "OPEN",
        }));

        // Close the menu if needed
        if (typeof handleClose === "function") {
          handleClose();
        }

        // Refresh the bill details to show the updated status
        getIndividualBill(bill_ID, org_id);

        // Show success message
        showMessage("Bill status has been updated to Open", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // More detailed error handling based on response structure
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          "Failed to update status";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error converting bill to open:", error);
      showMessage(
        `Failed to convert bill to open: ${
          error.message || "Please try again"
        }`,
        "error"
      );
    }
  };

  // Placeholder for record payment function
  const handleRecordPayment = () => {
    console.log("Record Payment");
    showMessage("Payment recorded successfully", "success");
  };

  const handleDeleteBill = async () => {
    try {
      // Get bill_id from the URL path
      const bill_ID = pathname.split("/")[3];
      const org_id = localStorage.getItem("organization_id");

      const response = await apiService({
        method: "DELETE",
        url: `api/v1/bills/delete-individual-bill?org_id=${org_id}&bill_id=${bill_ID}&journal_id=${journalId}`,
        customBaseUrl: config.PO_Base_url,
      });

      // Check response structure correctly
      if (
        response &&
        (response.statusCode === 201 || response.statusCode === 200)
      ) {
        if (typeof handleClose === "function") {
          handleClose();
        }
        router.push(`/purchase/bills`);
        showMessage("Bill deleted successfully", "success");
      } else {
        // More detailed error handling based on response structure
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          "Failed to delete bill";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      showMessage(
        `Failed to delete bill: ${error.message || "Please try again"}`,
        "error"
      );
    }
  };

  // Function to open modal with proper configuration
  const openModal = (
    title,
    message,
    confirmAction,
    confirmButtonText = "Confirm",
    actionType = ""
  ) => {
    setModalConfig({
      open: true,
      title,
      message,
      confirmAction,
      confirmButtonText,
      actionType,
    });
  };

  // Function to close modal
  const closeModal = () => {
    setModalConfig({ ...modalConfig, open: false });
  };

  useEffect(() => {
    let bill_ID = pathname.split("/")[3];
    let org_id = localStorage.getItem("organization_id");
    console.log("caascasc", bill_ID, org_id);
    getIndividualBill(bill_ID, org_id);
  }, [pathname]);

  const getIndividualBill = async (BILL_ID, ORG_ID) => {
    setLoading(true);
    let params = {
      url: `api/v1/bills/get-individual-bill?org_id=${ORG_ID}&bill_id=${BILL_ID}`,
      method: "GET",
      customBaseUrl: config.PO_Base_url,
    };
    try {
      // Add artificial delay for skeleton loading demonstration (200ms)
      await new Promise((resolve) => setTimeout(resolve, 200));

      const response = await apiService(params);
      if (response.statusCode === 200) {
        setBillDetail(response.data.data);
        console.log("getPurchaseOrderDetail", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching purchase orders", error);
    } finally {
      setLoading(false);
    }
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
    router.push("/purchase/bills");
  };

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
          backgroundColor:
            billDetail.status === 0
              ? "#408dfb"
              : billDetail.status === 1
              ? "#d3d3d3"
              : billDetail.status === 2
              ? "#808080"
              : "#408dfb",
          position: "absolute",
          color: "white",
          padding: "6px",
          transform: "rotate(-45deg)",
          transformOrigin: "center",
          top: "30px",
          left: "-40px",
          whiteSpace: "nowrap",
          fontWeight: "small",
          width: "170px",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        {" "}
        {billDetail.status_type}{" "}
      </Box>

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
              {billDetail.organization.org_name}
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
                billDetail.organization?.city +
                  " " +
                  " " +
                  billDetail.organization?.state
                //  + " "+billDetail.organization.zip
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
              {billDetail.organization.country}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                // fontWeight: "400 !important",
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {billDetail.organization.phone}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400 !important",
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {billDetail.vendor_id?.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400 !important",
                fontSize: "12px",
                color: "#333333",
              }}
            >
              GSTIN: {billDetail.vendor_id?.gst_no}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "black",
                  fontFamily: "'Times New Roman', serif",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Bill From
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "#206DDC",
                  fontSize: "400",
                  fontWeight: "12px",
                  mt: 1,
                }}
              >
                {billDetail.vendor_id?.contact_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "#333333",
                  fontSize: "400",
                  fontWeight: "12px",
                }}
              >
                {billDetail.vendor_id?.billing_address?.city || ""}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif",
                  color: "#333333",
                  fontSize: "400",
                  fontWeight: "12px",
                }}
              >
                GTIN: {billDetail.vendor_id?.gst_no}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "400",
              fontSize: "28px",
              mt: 2,
              fontFamily: "'Times New Roman', serif",
            }}
          >
            BILL
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333333",
              fontFamily: "'Times New Roman', serif",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Bill# {billDetail.bill_number}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#333333",
                fontFamily: "'Times New Roman', serif",
                fontWeight: "600",
                fontSize: "12px",
              }}
            >
              Balance Due
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#333333",
                fontFamily: "'Times New Roman', serif",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {"₹" + formatCurrency(billDetail.total)}
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item xs={6} textAlign="right">
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontWeight: "400",
                    fontSize: "14px",
                    pb: 1,
                  }}
                >
                  Order Number :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontWeight: "400",
                    fontSize: "14px",
                    pb: 1,
                  }}
                >
                  Bill Date :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontWeight: "400",
                    fontSize: "14px",
                    pb: 1,
                  }}
                >
                  Due Date :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif",
                    fontWeight: "400",
                    fontSize: "14px",
                    pb: 1,
                  }}
                >
                  Terms :
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400", fontSize: "12px", pb: 1.3 }}
                >
                  {billDetail.orderNumber}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400", fontSize: "12px", pb: 1.3 }}
                >
                  {" "}
                  {new Date(billDetail.billDate).toLocaleDateString("en-GB")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400", fontSize: "12px", pb: 1.3 }}
                >
                  {new Date(billDetail.due_date).toLocaleDateString("en-GB")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400", fontSize: "12px", pb: 1.3 }}
                >
                  {billDetail.paymentTerms}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          boxShadow: "none",
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5", p: 1 }}>
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
            {Array.isArray(billDetail.items) &&
              billDetail.items.map((data, index) => (
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
                      sx={{ fontWeight: "400", color: "black !important " }}
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

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={6} textAlign="right" sx={{ pr: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mt: 1, fontSize: "13px" }}
                  >
                    Sub Total
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mt: 1, fontSize: "13px" }}
                  >
                    Discount
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mt: 1, fontSize: "13px" }}
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mt: 1, fontSize: "13px" }}
                  >
                    Payment Made
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mt: 1, fontSize: "13px" }}
                  >
                    Balance Due
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right" sx={{ pr: 1.5 }}>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: "13px" }}>
                    {"₹" + formatCurrency(billDetail.subtotal)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: "13px" }}>
                    (-) {"₹" + formatCurrency(billDetail.taxAmount)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: "13px" }}>
                    {"₹" + formatCurrency(billDetail.total)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: "13px" }}>
                    (-) ₹ 0.00
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: "13px" }}>
                    {"₹" + formatCurrency(billDetail.total)}
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
              BILL
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
              Bill# {billDetail.bill_number}
            </Typography>
            <Box
              sx={{
                color: "white",
                backgroundColor:
                  billDetail.status === 0
                    ? "#408dfb"
                    : billDetail.status === 1
                    ? "#d3d3d3"
                    : billDetail.status === 2
                    ? "#808080"
                    : "#408dfb",
                textAlign: "center",
                p: 0.5,
                fontSize: "11px",
                fontWeight: "400",
                width: 100,
                mt: 1,
              }}
            >
              {billDetail.status_type}
            </Box>

            <Box sx={{ width: "100%", display: "flex", mt: 4 }}>
              <Box
                sx={{
                  width: "45%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.4,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" }}
                  >
                    Order Number
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" }}
                  >
                    Bill Date
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" }}
                  >
                    Due Date
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" }}
                  >
                    Payment Terms
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" }}
                  >
                    Total
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "55%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  fontSize: "13px",
                }}
              >
                <Box>{billDetail.orderNumber}</Box>
                <Box>
                  {new Date(billDetail.billDate).toLocaleDateString("en-GB")}
                </Box>
                <Box>
                  {new Date(billDetail.due_date).toLocaleDateString("en-GB")}
                </Box>
                <Box>{billDetail.paymentTerms}</Box>
                <Box>{"₹" + formatCurrency(billDetail.total)}</Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: "40%", p: 2, pt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mr: 1,
                mb: 1,
                fontWeight: "bold",
                color: "#685555",
                fontSize: "12px",
              }}
            >
              DELIVERY ADDRESS (To)
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ color: "#408dfb " }}>
                {/* {purchaseOrder.vendor_id.company_name} */}
              </Typography>
              <Typography
                variant="body2"
                sx={{ pb: 1, color: "#408dfc", fontSize: "12px" }}
              >
                {billDetail.organization.org_name}
              </Typography>
              <Typography variant="body2">
                {billDetail.organization.first_street}
              </Typography>
              <Typography variant="body2">
                {billDetail.organization.second_street}
              </Typography>
              <Typography variant="body2">
                {
                  billDetail.organization.city +
                    " ," +
                    " " +
                    billDetail.organization.state
                  //  + " "+billDetail.organization.zip
                }
              </Typography>
              <Typography variant="body2">
                {billDetail.organization.country}
              </Typography>
              <Typography variant="body2">
                {billDetail.organization.phone}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "40%", p: 2, pt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "700", color: "#555555", fontSize: "12px" }}
            >
              VENDOR ADDRESS (From)
            </Typography>
            <Box>
              <Typography
                variant="body2"
                color="#206DDC"
                sx={{ py: 1, fontSize: "13px" }}
              >
                {billDetail.vendor_id?.contact_name || ""}
              </Typography>
              <Typography variant="body2">
                {billDetail.vendor_id?.billing_address?.address || ""}
              </Typography>
              <Typography variant="body2">
                {billDetail.vendor_id?.billing_address?.street2 || ""}
              </Typography>
              <Typography variant="body2">
                {billDetail.vendor_id?.billing_address?.city ||
                  "" + "," + billDetail.vendor_id?.billing_address?.state ||
                  ""}
              </Typography>
              <Typography variant="body2">
                {billDetail.vendor_id?.billing_address?.country ||
                  "" + " - " + billDetail.vendor_id?.billing_address?.zip ||
                  ""}
              </Typography>
              <Typography variant="body2">
                {billDetail.vendor_id?.mobile || ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            mt: 4,
            boxShadow: "none",
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
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
              {Array.isArray(billDetail.items) &&
                billDetail.items.map((data, index) => (
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
                        sx={{ fontWeight: "400", color: "black !important " }}
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

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={7} textAlign="right" sx={{ pr: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }}
                >
                  Sub Total
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "400",
                    mt: 1,
                    fontSize: "14px",
                    color: "#6C718A",
                  }}
                >
                  Discount
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "400",
                    mt: 1,
                    fontSize: "14px",
                    color: "#6C718A",
                  }}
                >
                  Adjustment
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }}
                >
                  Total
                </Typography>
              </Grid>
              <Grid item xs={5} textAlign="right" sx={{ pr: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }}
                >
                  {"₹" + formatCurrency(billDetail.subtotal)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontWeight: "400",
                    mt: 1,
                    fontSize: "14px",
                    color: "#6C718A",
                  }}
                >
                  (-) {"₹" + formatCurrency(billDetail.taxAmount)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontWeight: "400",
                    mt: 1,
                    fontSize: "14px",
                    color: "#6C718A",
                  }}
                >
                  (-) {"₹" + formatCurrency(billDetail.adjustment)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "600", mt: 1, fontSize: "14px" }}
                >
                  {"₹" + formatCurrency(billDetail.total)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  const [items, setItems] = useState([]);

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
      console.log(response, "responseresponse------");
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
      console.log(journalId, "orgIdorgId");
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
          Bill
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

  // Credits Applied Section Component
  const CreditsAppliedSection = () => (
    <Box>
      <Paper
        sx={{
          p: 0,
          boxShadow: "none",
          border: "1px solid #ddd",
          m: 2,
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
          <InfoOutlinedIcon sx={{ color: "#5C6BC0", mr: 1 }} />
          <Typography variant="body2" sx={{ display: "flex" }}>
            <Typography sx={{ fontWeight: "600", fontSize: "12px", pr: 1 }}>
              WHAT&apos;S NEXT?
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "13px" }}>
              This bill is in the open status. You can now record payment for
              this bill.
            </Typography>
          </Typography>
          {/* <Button
            variant="contained"
            // color="primary"
            size="small"
            sx={{fontSize:"11px"}}
          >
            Record Payment
          </Button> */}
        </Box>
      </Paper>
      {billDetail.purchase_orders && billDetail.purchase_orders.length ? (
        <Paper
          sx={{
            p: 0,
            boxShadow: "none",
            border: "1px solid #ddd",
            m: 2,
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
              sx={{
                fontWeight: "600",
                fontSize: "13PX",
                color: "#21263C",
              }}
            >
              Purchase Order History
              <Typography
                component="span"
                sx={{ ml: 1, fontSize: "0.8rem", color: "#408dfb" }}
              >
                {billDetail.purchase_orders.length}
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
                      <TableRow>
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
                          Purchase#
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
                          total
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "600 !important",
                            fontSize: "13px !important",
                            backgroundColor: "white !important",
                            color: "#6C718A !important",
                          }}
                        >
                          Due date
                        </TableCell>
                        {/* <TableCell
                         sx={{
                           fontWeight: "600 !important",
                           fontSize: "13px !important",
                           backgroundColor: "white !important",
                           color: "#6C718A !important",
                         }}
                       ></TableCell> */}
                      </TableRow>
                    </TableHead>
                    {billDetail.purchase_orders.length &&
                      billDetail.purchase_orders.map((data) => {
                        return (
                          <>
                            <TableBody>
                              <TableRow sx={{ height: 30 }}>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "400 !important",
                                    fontSize: "13px !important",
                                  }}
                                >
                                  {formatDate(data.po_ref_id?.date)}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "#408dfb !important",
                                    fontWeight: "400 !important",
                                    fontSize: "13px !important",
                                  }}
                                >
                                  <a
                                    onClick={() =>
                                      router.push(
                                        `/purchase/purchaseorder/${data.po_ref_id?.purchase_number}`
                                      )
                                    }
                                  >
                                    {data.po_ref_id?.purchase_number}
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
                                  {data.po_ref_id?.status_type}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "400 !important",
                                    fontSize: "13px !important",
                                  }}
                                >
                                  {"₹" + formatCurrency(data.po_ref_id?.total)}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "400 !important",
                                    fontSize: "13px !important",
                                  }}
                                >
                                  {formatDate(data.po_ref_id?.due_date)}
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
      ) : (
        <></>
      )}
    </Box>
  );

  // App Header - fixed at the top
  const bill_ID = pathname.split("/")[3];
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
          height: "64px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ mr: 1, fontWeight: "500", fontSize: "18px" }}
          >
            {billDetail.bill_number}
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
              <AttachFileIcon fontSize="13px" />
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
            <Paper elevation={0} sx={{ width: "300px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1.5,
                  px: 1.5,
                  backgroundColor: "#f8f8f8",
                }}
              >
                <Typography fontWeight="500" fontSize="14px">
                  Attachmentss
                </Typography>
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
                    height: "50px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "500",
                    fontSize: "13px",
                    color: "#212529",
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
                    fontSize: "13px",
                    fontWeight: "500",
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
            <IconButton size="13px">
              <CommentIcon fontSize="13px" />
            </IconButton>
            <Box>Comments & History</Box>
          </Box>
          {drawerOpen ? (
            <>
              <CommentsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                module={"Bills"}
                ID={bill_ID}
              />
            </>
          ) : (
            <></>
          )}

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
              anchorPosition={{ top: 185, left: 820 }}
              elevation={3}
              sx={{ borderRadius: 2, fontSize: "13px" }}
            >
              <MenuItem
                sx={{
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: 2,
                  },
                }}
                onClick={() => {
                  openModal(
                    "Void Bill",
                    "",
                    handleVoidBill,
                    "Void Bill",
                    "void"
                  );
                  handleClose();
                }}
              >
                Void
              </MenuItem>

              <MenuItem
                sx={{
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: 2,
                    fontSize: "13px",
                  },
                  borderBottom: "1px solid #ddd",
                }}
              >
                Expected Payment Date
              </MenuItem>
              <MenuItem
                onClick={handleClone}
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
                Clone
              </MenuItem>
              <MenuItem
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
                Make Recurring
              </MenuItem>
              <MenuItem
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
                Create Vendor Credits
              </MenuItem>
              <MenuItem
                sx={{
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: 2,
                    fontSize: "13px",
                  },
                  borderBottom: "1px solid #ddd !important",
                }}
              >
                View Journal
              </MenuItem>
              <MenuItem
                onClick={handleDeleteBill}
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
              fontWeight: "400",
              fontSize: "13px",
              "&:hover": {
                color: "#408dfb",
              },
            }}
            onClick={() => {
              // Get bill_id from the URL
              const bill_ID = pathname.split("/")[3];
              // Navigate to create bill page with bill_id as query parameter
              router.push(`/purchase/bills/create?bill_id=${bill_ID}`);
            }}
          >
            <IconButton size="small">
              <EditIcon
                fontSize="small"
                sx={{
                  color: "",
                  "&:hover": {
                    color: "#408dfb",
                  },
                }}
              />
            </IconButton>
            Edit
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRight: "1px solid #ddd",
              paddingRight: 2,
              cursor: "pointer",
              fontWeight: "400",
              fontSize: "13px",
              "&:hover": {
                color: "#408dfb",
              },
            }}
            onClick={generatePDF}
          >
            <IconButton
              size="small"
              sx={{
                color: "",
                "&:hover": {
                  color: "#408dfb",
                },
              }}
            >
              <PictureAsPdfIcon style={{ fontSize: "16px" }} fontSize="small" />
            </IconButton>
            <Box>PDF</Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRight: "1px solid #ddd",
              paddingRight: 2,
              cursor: "pointer",
              fontWeight: "400",
              fontSize: "13px",
              "&:hover": {
                color: "#408dfb",
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                color: "",
                "&:hover": {
                  color: "#408dfb",
                },
              }}
            >
              <PrintIcon style={{ fontSize: "16px" }} fontSize="small" />
            </IconButton>
            <Box>Print</Box>
          </Box>
          {(billDetail.status === 1 || billDetail.status === 2) && (
            <Box
              sx={{
                p: 1,
                borderRight: "1px solid #ddd",
                paddingRight: 2,
                cursor: "pointer",
                fontWeight: "400",
                fontSize: "13px",
              }}
            >
              <Button
                sx={{
                  p: 1,
                  color: "black",
                  fontSize: "13px",
                  fontWeight: "400",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    color: "#408dfb",
                    boxShadow: "none", // Ensures no shadow appears on hover
                  },
                  "&.MuiButtonBase-root": {
                    border: "none",
                    outline: "none",
                  },
                }}
                disableRipple
                onClick={() => {
                  if (billDetail.status === 2) {
                    openModal(
                      "Convert Bill to Draft",
                      "Are you sure you want to convert this bill to draft?",
                      handleConvertToDraft,
                      "Convert to Draft"
                    );
                  } else if (billDetail.status === 1) {
                    // Open modal for Convert to Open
                    openModal(
                      "Convert Bill to Open",
                      "Are you sure you want to convert this bill to open?",
                      handleConvertToOpen,
                      "Convert to Open"
                    );
                  }
                }}
              >
                {billDetail.status === 2
                  ? "Convert to Draft"
                  : billDetail.status === 1
                  ? "Convert to Open"
                  : ""}
              </Button>
              <StatusActionModal
                open={modalConfig.open}
                onClose={closeModal}
                onConfirm={() => {
                  if (modalConfig.confirmAction) {
                    modalConfig.confirmAction();
                  }
                  closeModal();
                }}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmButtonText={modalConfig.confirmButtonText}
                actionType={modalConfig.actionType}
              />
            </Box>
          )}
          <Box
            sx={{
              p: 1,
              fontSize: "10px",
              borderRight: "1px solid #ddd",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            <IconButton
              size="small"
              sx={{
                color: "",
                "&:hover": {
                  color: "#408dfb",
                },
              }}
            >
              <MoreVertIcon fontSize="small" onClick={toggleMoreOptions} />
            </IconButton>
          </Box>
          <Box></Box>
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

  // PDF Toggle - sticky under the header
  const PDFToggle = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        mb: 2,
        top: "48px",
        backgroundColor: "white",
        zIndex: 9,
        py: 1,
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
  );

  return (
    <Paper elevation={0} sx={{ width: "100%", borderLeft: "1px solid #ddd" }}>
      {loading ? (
        // Skeleton Loading UI
        <>
          <SkeletonHeader />
          <SkeletonCredits />
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
              <SkeletonPDFToggle />
            </Box>
            <SkeletonBillView />
          </Box>
          <SkeletonBillSection />
        </>
      ) : (
        // Actual Content
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
            {/* {showPDFView ? <PDFView /> : <NormalView />} */}
            <div style={{ display: showPDFView ? "block" : "none" }}>
              <PDFView />
            </div>
            {!showPDFView && <NormalView />}
          </Box>
          <BillSection />
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
    </Paper>
  );
};

export default BillManagementApp;
