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
import { billStatusBlock } from "../../common/docLock";

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  color: "white",
  "&:hover": {
    backgroundColor: "#3e8e41",
  },
  textTransform: "none" as const,
  padding: "2px 10px",
}));

// Main container with scrolling
const ScrollableContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(3),
  margin: "0 auto",
}));

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const billMoney = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// The lines between Sub Total and Total on a bill, from what was saved.
const billTotalRows = (b = {} as any) => {
  const rows = [["Sub Total", billMoney(b.sub_total ?? b.subtotal)]];
  if (Number(b.discount_amount)) rows.push(["Discount", `(-) ${billMoney(b.discount_amount)}`]);
  if (Number(b.cgst_total)) rows.push(["CGST", billMoney(b.cgst_total)]);
  if (Number(b.sgst_total)) rows.push(["SGST", billMoney(b.sgst_total)]);
  if (Number(b.igst_total)) rows.push(["IGST", billMoney(b.igst_total)]);
  const tax = Number(b.tax_amount ?? b.taxAmount);
  if (tax) {
    const tcs = b.tax_type === "TCS";
    const pct = Number(b.tax_percentage) ? ` (${Number(b.tax_percentage)}%)` : "";
    rows.push([`${tcs ? "TCS" : "TDS"}${pct}`, `${tcs ? "(+)" : "(-)"} ${billMoney(tax)}`]);
  }
  const adj = Number(b.adjustment);
  if (adj) rows.push(["Adjustment", `${adj < 0 ? "(-)" : "(+)"} ${billMoney(Math.abs(adj))}`]);
  return rows;
};

// Now we need to update the StatusActionModal component to handle the void action

const StatusActionModal = ({
  open,
  onClose,
  onConfirm,
  title,
  actionType,
  confirmButtonText = "Confirm",
}: any) => {
  const [reason, setReason] = useState<any>("");

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
          position: "fixed" as const,
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
          onChange={(e) => setReason((e.target as any).value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />

        <Box sx={{ display: "flex" as const, gap: 1 }}>
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
const SkeletonHeader = (_props?: any) => (
  <Box sx={{ mb: 2 }}>
    <Box
      sx={{
        display: "flex" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        p: 2,
        height: "64px",
      }}
    >
      <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
        <Skeleton variant={"text" as any} width={150} height={32} />
      </Box>
      <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 2 }}>
        <Skeleton variant={"rectangular" as any} width={100} height={32} />
        <Skeleton variant={"rectangular" as any} width={150} height={32} />
        <Skeleton variant={"circular" as any} width={24} height={24} />
      </Box>
    </Box>

    <Box
      sx={{
        display: "flex" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        mb: 2,
        backgroundColor: "#f8f8f8",
        borderTop: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
        marginBottom: 4,
        height: "48px",
      }}
    >
      <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant={"rectangular" as any}
            width={80}
            height={32}
            sx={{ mx: 1 }}
          />
        ))}
      </Box>
      <Skeleton variant={"circular" as any} width={24} height={24} sx={{ mr: 2 }} />
    </Box>
  </Box>
);

const SkeletonCredits = (_props?: any) => (
  <Box>
    <Paper sx={{ p: 0, boxShadow: "none", border: "1px solid #ddd", m: 2 }}>
      <Box
        sx={{ p: 1.5, display: "flex" as const, alignItems: "center" as const, height: "50px" }}
      >
        <Skeleton variant={"circular" as any} width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant={"text" as any} width="70%" height={24} />
        <Skeleton
          variant={"rectangular" as any}
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
          display: "flex" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
        }}
      >
        <Skeleton variant={"text" as any} width={150} height={24} />
        <Skeleton variant={"circular" as any} width={24} height={24} />
      </Box>
    </Paper>
  </Box>
);

const SkeletonPDFToggle = (_props?: any) => (
  <Box
    sx={{
      display: "flex" as const,
      justifyContent: "flex-end" as const,
      alignItems: "center" as const,
      mb: 2,
      py: 1,
    }}
  >
    <Skeleton variant={"text" as any} width={100} height={24} sx={{ mr: 1 }} />
    <Skeleton variant={"rectangular" as any} width={40} height={24} />
  </Box>
);

const SkeletonBillView = (_props?: any) => (
  <Paper elevation={4} sx={{ p: 4, mb: 2, width: "8.27in" }}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Skeleton variant={"text" as any} width="80%" height={32} sx={{ mt: 2 }} />
        <Skeleton variant={"text" as any} width="60%" height={24} />
        <Skeleton variant={"text" as any} width="70%" height={24} />

        <Box sx={{ mt: 4 }}>
          <Skeleton variant={"text" as any} width="40%" height={24} />
          <Skeleton variant={"text" as any} width="60%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant={"text" as any} width="50%" height={24} />
          <Skeleton variant={"text" as any} width="40%" height={24} />
        </Box>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: "right" as const }}>
        <Skeleton
          variant={"text" as any}
          width="60%"
          height={40}
          sx={{ ml: "auto", mt: 2 }}
        />
        <Skeleton variant={"text" as any} width="40%" height={24} sx={{ ml: "auto" }} />

        <Box sx={{ mt: 2 }}>
          <Skeleton
            variant={"text" as any}
            width="30%"
            height={24}
            sx={{ ml: "auto" }}
          />
          <Skeleton
            variant={"text" as any}
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
                  variant={"text" as any}
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
                  variant={"text" as any}
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

    <Skeleton variant={"rectangular" as any} width="100%" height={200} sx={{ mt: 4 }} />

    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <Box sx={{ display: "flex" as const, justifyContent: "flex-end" as const }}>
          <Box sx={{ width: "70%" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box
                key={i}
                sx={{ display: "flex" as const, justifyContent: "space-between" as const, my: 1 }}
              >
                <Skeleton variant={"text" as any} width="40%" height={24} />
                <Skeleton variant={"text" as any} width="30%" height={24} />
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

const SkeletonBillSection = (_props?: any) => (
  <Paper sx={{ px: 2, mb: 6, boxShadow: "none", border: "2px solid #f9f9fb" }}>
    <Box sx={{ px: 2, paddingTop: 2 }}>
      <Skeleton variant={"text" as any} width={100} height={32} />
      <Skeleton variant={"text" as any} width="60%" height={24} sx={{ mt: 1 }} />
    </Box>

    <Box
      sx={{
        p: 2,
        display: "flex" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
      }}
    >
      <Skeleton variant={"text" as any} width={100} height={32} />
    </Box>

    <TableContainer sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow>
            {[1, 2, 3].map((i) => (
              <TableCell key={i}>
                <Skeleton variant={"text" as any} width="80%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2].map((row) => (
            <TableRow key={row}>
              {[1, 2, 3].map((cell) => (
                <TableCell key={cell}>
                  <Skeleton variant={"text" as any} width="80%" height={24} />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Skeleton variant={"text" as any} width="0%" height={24} />
            </TableCell>
            <TableCell>
              <Skeleton variant={"text" as any} width="80%" height={24} />
            </TableCell>
            <TableCell>
              <Skeleton variant={"text" as any} width="80%" height={24} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const BillManagementApp = ({ journalId }: any) => {
  console.log("🔍 BillManagementApp received journalId:", journalId);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const { showMessage } = useSnackbar();
  const [modalConfig, setModalConfig] = useState<any>({
    open: false,
    title: "",
    message: "",
    confirmAction: null,
    confirmButtonText: "Confirm",
  });
  const [showPDFView, setShowPDFView] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<boolean>(false);
  const [isMoreOptions, setIsMoreOptions] = useState<boolean>(false);
  const [isAttachFiles, setIsAttachFiles] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [billDetail, setBillDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  // Set when the bill can't be loaded (not found, another organisation's...).
  const [loadError, setLoadError] = useState<any>("");
  const pathname = usePathname()!;
  const router = useRouter();
  const [isZoho, setIsZoho] = useState<boolean>(false);

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
        const statusBadgeElements = element.querySelectorAll<HTMLElement>("*");
        const hiddenElements: any[] = [];

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

  // Opens Payments Made with this bill's vendor and the bill picked.
  const handleRecordPayment = () => {
    const vendorId = billDetail.vendor_id?._id || billDetail.vendor_id;
    router.push(
      `/purchase/paymentmade/create?vendor_id=${encodeURIComponent(vendorId || "")}&bill_id=${encodeURIComponent(billDetail._id || "")}`
    );
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
      if (response.statusCode === 200 && response.data?.data) {
        setBillDetail(response.data.data);
        setLoadError("");
      } else {
        setLoadError("Bill not found.");
      }
    } catch (error) {
      setLoadError(error?.message || "This bill couldn't be loaded.");
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
  const PDFView = (_props?: any) => (
    <Paper
      id="pdf-view-container"
      elevation={4}
      sx={{
        p: 4,
        position: "relative" as const,
        mb: 2,
        width: "8.27in",
        overflow: "hidden" as const,
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
          position: "absolute" as const,
          color: "white",
          padding: "6px",
          transform: "rotate(-45deg)",
          transformOrigin: "center",
          top: "30px",
          left: "-40px",
          whiteSpace: "nowrap" as const,
          fontWeight: "small" as const,
          width: "170px",
          textAlign: "center" as const,
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
                fontWeight: "600 !important" as const,
                color: "black",
                fontSize: "14px !important",
              }}
            >
              {billDetail.organization?.org_name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                // fontWeight: "600 !important" as const,
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
                // fontWeight: "400 !important" as const,
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {billDetail.organization.country}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                // fontWeight: "400 !important" as const,
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {billDetail.organization.phone}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400 !important" as const,
                fontSize: "12px",
                color: "#333333",
              }}
            >
              {billDetail.vendor_id?.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "400 !important" as const,
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
                  fontFamily: "'Times New Roman', serif" as const,
                  fontSize: "14px",
                  fontWeight: "400" as const,
                }}
              >
                Bill From
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif" as const,
                  color: "#206DDC",
                  fontSize: "400",
                  fontWeight: "12px" as const,
                  mt: 1,
                }}
              >
                {billDetail.vendor_id?.contact_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif" as const,
                  color: "#333333",
                  fontSize: "400",
                  fontWeight: "12px" as const,
                }}
              >
                {billDetail.vendor_id?.billing_address?.city || ""}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Times New Roman', serif" as const,
                  color: "#333333",
                  fontSize: "400",
                  fontWeight: "12px" as const,
                }}
              >
                GTIN: {billDetail.vendor_id?.gst_no}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" as const }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "400" as const,
              fontSize: "28px",
              mt: 2,
              fontFamily: "'Times New Roman', serif" as const,
            }}
          >
            BILL
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333333",
              fontFamily: "'Times New Roman', serif" as const,
              fontWeight: "600" as const,
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
                fontFamily: "'Times New Roman', serif" as const,
                fontWeight: "600" as const,
                fontSize: "12px",
              }}
            >
              Balance Due
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#333333",
                fontFamily: "'Times New Roman', serif" as const,
                fontWeight: "600" as const,
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
                    fontFamily: "'Times New Roman', serif" as const,
                    fontWeight: "400" as const,
                    fontSize: "14px",
                    pb: 1,
                  }}
                >
                  Order Number :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif" as const,
                    fontWeight: "400" as const,
                    fontSize: "14px",
                    pb: 1,
                  }}
                >
                  Bill Date :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif" as const,
                    fontWeight: "400" as const,
                    fontSize: "14px",
                    pb: 1,
                  }}
                >
                  Due Date :
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Times New Roman', serif" as const,
                    fontWeight: "400" as const,
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
                  sx={{ fontWeight: "400" as const, fontSize: "12px", pb: 1.3 }}
                >
                  {billDetail.orderNumber || "—"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400" as const, fontSize: "12px", pb: 1.3 }}
                >
                  {" "}
                  {new Date(billDetail.billDate).toLocaleDateString("en-GB")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400" as const, fontSize: "12px", pb: 1.3 }}
                >
                  {new Date(billDetail.due_date).toLocaleDateString("en-GB")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "400" as const, fontSize: "12px", pb: 1.3 }}
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
                  fontWeight: "bold" as const,
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold" as const,
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                ITEMS & DESCRIPTION
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold" as const,
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                QUANTITY
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold" as const,
                  color: "white !important",
                  backgroundColor: "#3c3d3a !important",
                }}
              >
                RATE
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold" as const,
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
                      fontWeight: "400 !important" as const,
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "400" as const, color: "black !important " }}
                    >
                      {data.details}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important" as const,
                    }}
                  >
                    {data.quantity}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important" as const,
                    }}
                  >
                    ₹{formatCurrency(data.rate)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important" as const,
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
                {[
                  ...billTotalRows(billDetail),
                  ["Total", billMoney(billDetail.total)],
                  ["Payment Made", `(-) ${billMoney(Number(billDetail.payment_made || 0) + Number(billDetail.vendor_credits_applied || 0))}`],
                  ["Balance Due", billMoney(billDetail.due_amt ?? billDetail.total)],
                ].map(([label, value]) => (
                  <React.Fragment key={label}>
                    <Grid item xs={6} textAlign="right" sx={{ pr: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" as const, mt: 1, fontSize: "13px" }}>
                        {label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right" sx={{ pr: 1.5 }}>
                      <Typography variant="body2" sx={{ mt: 1, fontSize: "13px" }}>
                        {value}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
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
  const NormalView = (_props?: any) => (
    <Box>
      <Paper
        elevation={4}
        sx={{ p: 3, position: "relative" as const, mb: 2, width: "8.27in" }}
      >
        <Box
          sx={{
            display: "flex" as const,
            justifyContent: "space-between" as const,
            width: "100%",
          }}
        >
          <Box sx={{ width: "60%", p: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "400" as const,
                fontSize: "23px",
                fontFamily: "'Times New Roman', serif" as const,
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
                fontWeight: "400" as const,
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
                textAlign: "center" as const,
                p: 0.5,
                fontSize: "11px",
                fontWeight: "400" as const,
                width: 100,
                mt: 1,
              }}
            >
              {billDetail.status_type}
            </Box>

            <Box sx={{ width: "100%", display: "flex" as const, mt: 4 }}>
              <Box
                sx={{
                  width: "45%",
                  display: "flex" as const,
                  flexDirection: "column" as const,
                  gap: 1.4,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" as const }}
                  >
                    Order Number
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" as const }}
                  >
                    Bill Date
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" as const }}
                  >
                    Due Date
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" as const }}
                  >
                    Payment Terms
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="#555555"
                    sx={{ fontSize: "12px", fontWeight: "600" as const }}
                  >
                    Total
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "55%",
                  display: "flex" as const,
                  flexDirection: "column" as const,
                  gap: 1,
                  fontSize: "13px",
                }}
              >
                {/* Empty values show a dash so every value stays on its label's row. */}
                <Box>{billDetail.orderNumber || "—"}</Box>
                <Box>
                  {billDetail.billDate ? new Date(billDetail.billDate).toLocaleDateString("en-GB") : "—"}
                </Box>
                <Box>
                  {billDetail.due_date ? new Date(billDetail.due_date).toLocaleDateString("en-GB") : "—"}
                </Box>
                <Box>{billDetail.paymentTerms || "—"}</Box>
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
                fontWeight: "bold" as const,
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
                {billDetail.organization?.org_name}
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
              sx={{ fontWeight: "700" as const, color: "#555555", fontSize: "12px" }}
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
                    fontWeight: "bold" as const,
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold" as const,
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  ITEMS & DESCRIPTION
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold" as const,
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  QUANTITY
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold" as const,
                    color: "#797d8e !important",
                    backgroundColor: "#f7f7f7 !important",
                  }}
                >
                  RATE
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold" as const,
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
                        fontWeight: "400 !important" as const,
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "400" as const, color: "black !important " }}
                      >
                        {data.details}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "black !important ",
                        fontSize: "14px !important",
                        fontWeight: "400 !important" as const,
                      }}
                    >
                      {data.quantity}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "black !important ",
                        fontSize: "14px !important",
                        fontWeight: "400 !important" as const,
                      }}
                    >
                      ₹{formatCurrency(data.rate)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "black !important ",
                        fontSize: "14px !important",
                        fontWeight: "400 !important" as const,
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
              {billTotalRows(billDetail).map(([label, value], i) => (
                <React.Fragment key={label}>
                  <Grid item xs={7} textAlign="right" sx={{ pr: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: i === 0 ? "600" : "400", mt: 1, fontSize: "14px", color: i === 0 ? undefined : "#6C718A" }}
                    >
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} textAlign="right" sx={{ pr: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: i === 0 ? "600" : "400", mt: 1, fontSize: "14px", color: i === 0 ? undefined : "#6C718A" }}
                    >
                      {value}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={7} textAlign="right" sx={{ pr: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "600" as const, mt: 1, fontSize: "14px" }}>
                  Total
                </Typography>
              </Grid>
              <Grid item xs={5} textAlign="right" sx={{ pr: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: "600" as const, mt: 1, fontSize: "14px" }}>
                  {billMoney(billDetail.total)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  const [items, setItems] = useState<any>([]);

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

  const BillSection = (_props?: any) => (
    <Paper
      id="journal-section"
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
            color: "#666",
            display: "flex" as const,
            alignItems: "center" as const,
            fontSize: "12px",
            fontWeight: "400" as const,
          }}
        >
          Account is displayed in your base currency.
          <Box {...({} as any)}
            variant="contained"
            size="small"
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
          Bill
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

  // Credits Applied Section Component
  const CreditsAppliedSection = (_props?: any) => (
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
            display: "flex" as const,
            alignItems: "center" as const,
            height: "50px",
            borderRadius: "2px",
          }}
        >
          <InfoOutlinedIcon sx={{ color: "#5C6BC0", mr: 1 }} />
          <Typography component="div" variant="body2" sx={{ display: "flex" as const }}>
            <Typography sx={{ fontWeight: "600" as const, fontSize: "12px", pr: 1 }}>
              WHAT&apos;S NEXT?
            </Typography>
            <Typography sx={{ fontWeight: "400" as const, fontSize: "13px" }}>
              {billDetail.status_type === "PAID"
                ? "This bill is paid."
                : billDetail.status_type === "VOID"
                ? "This bill is void."
                : billDetail.status_type === "DRAFT"
                ? "This bill is a draft. Convert it to open to record a payment."
                : "This bill is in the open status. You can now record payment for this bill."}
            </Typography>
          </Typography>
          {["OPEN", "PARTIALLY PAID"].includes(billDetail.status_type) && Number(billDetail.due_amt ?? billDetail.total) > 0 && (
            <Button
              variant="contained"
              size="small"
              sx={{ fontSize: "11px", ml: 2 }}
              onClick={handleRecordPayment}
            >
              Record Payment
            </Button>
          )}
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
              display: "flex" as const,
              justifyContent: "space-between" as const,
              alignItems: "center" as const,
              cursor: "pointer" as const,
              fontSize: "13PX",
            }}
            onClick={toggleSection}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "600" as const,
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
                            fontWeight: "600 !important" as const,
                            fontSize: "13px !important",
                            backgroundColor: "white !important",
                            color: "#6C718A !important",
                          }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "600 !important" as const,
                            fontSize: "13px !important",
                            backgroundColor: "white !important",
                            color: "#6C718A !important",
                          }}
                        >
                          Purchase#
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "600 !important" as const,
                            fontSize: "13px !important",
                            backgroundColor: "white !important",
                            color: "#6C718A !important",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "600 !important" as const,
                            fontSize: "13px !important",
                            backgroundColor: "white !important",
                            color: "#6C718A !important",
                          }}
                        >
                          total
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "600 !important" as const,
                            fontSize: "13px !important",
                            backgroundColor: "white !important",
                            color: "#6C718A !important",
                          }}
                        >
                          Due date
                        </TableCell>
                        {/* <TableCell
                         sx={{
                           fontWeight: "600 !important" as const,
                           fontSize: "13px !important",
                           backgroundColor: "white !important",
                           color: "#6C718A !important",
                         }}
                       ></TableCell> */}
                      </TableRow>
                    </TableHead>
                    {billDetail.purchase_orders.length &&
                      billDetail.purchase_orders.map((data, idx) => {
                        return (
                          <React.Fragment key={idx}>
                            <TableBody>
                              <TableRow sx={{ height: 30 }}>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "400 !important" as const,
                                    fontSize: "13px !important",
                                  }}
                                >
                                  {formatDate(data.po_ref_id?.date)}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "#408dfb !important",
                                    fontWeight: "400 !important" as const,
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
                                    fontWeight: "400 !important" as const,
                                    fontSize: "13px !important",
                                  }}
                                >
                                  {data.po_ref_id?.status_type}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "400 !important" as const,
                                    fontSize: "13px !important",
                                  }}
                                >
                                  {"₹" + formatCurrency(data.po_ref_id?.total)}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "400 !important" as const,
                                    fontSize: "13px !important",
                                  }}
                                >
                                  {formatDate(data.po_ref_id?.due_date)}
                                </TableCell>
                                {/* <TableCell
                         align="left"
                         sx={{
                           color: "black !important",
                           fontWeight: "400 !important" as const,
                           fontSize: "13px !important",
                         }}
                       >
                         ₹ 45,000
                       </TableCell>
                       <TableCell align="right">
                         <Box
                           sx={{
                             display: "flex" as const,
                             gap: 2,
                             justifyContent: "flex-end" as const,
                           }}
                         >
                           <Box
                             sx={{
                               display: "flex" as const,
                               alignItems: "center" as const,
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
                          </React.Fragment>
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
          height: "64px",
        }}
      >
        <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
          <Typography
            variant="subtitle1"
            sx={{ mr: 1, fontWeight: "500" as const, fontSize: "18px" }}
          >
            {billDetail.bill_number}
          </Typography>
        </Box>

        <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 2 }}>
          <div data-rbac-feature="tally"
            style={{ display: "flex" as const, alignItems: "center" as const, cursor: "pointer" as const }}
            onClick={toggleMode}
          >
            {isZoho ? (
              <ToggleOff sx={{ color: "#888", fontSize: 32 }} />
            ) : (
              <ToggleOn sx={{ color: "#336699", fontSize: 32 }} />
            )}
            <Typography
              variant="body1"
              sx={{ ml: 1, color: "#333", fontWeight: "bold" as const }}
            >
              Biz
            </Typography>
          </div>
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
              <AttachFileIcon fontSize={"13px" as any} />
            </IconButton>
            <Box>Attach Files</Box>
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
            <Paper elevation={0} sx={{ width: "300px" }}>
              <Box
                sx={{
                  display: "flex" as const,
                  justifyContent: "space-between" as const,
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
                    alignItems: "center" as const,
                    display: "flex" as const,
                    justifyContent: "center" as const,
                    fontWeight: "500" as const,
                    fontSize: "13px",
                    color: "#212529",
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
                    fontSize: "13px",
                    fontWeight: "500" as const,
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
            <IconButton size={"13px" as any}>
              <CommentIcon fontSize={"13px" as any} />
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
                  display: billDetail.status_type === "VOID" ? "none" : undefined,
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
              <MenuItem onClick={() => router.push(`/purchase/recurringbills/newRecurringBill?bill_id=${encodeURIComponent(billDetail.bill_number || "")}`)}
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
              <MenuItem onClick={() => router.push(`/purchase/vendorcredits/new?contact_id=${encodeURIComponent(billDetail.vendor_id?._id || billDetail.vendor_id || "")}&reference=${encodeURIComponent(billDetail.bill_number || "")}`)}
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
              <MenuItem onClick={() => { handleClose?.(); document.getElementById("journal-section")?.scrollIntoView({ behavior: "smooth" }); }}
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
              fontWeight: "400" as const,
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
              display: "flex" as const,
              alignItems: "center" as const,
              p: 1,
              borderRight: "1px solid #ddd",
              paddingRight: 2,
              cursor: "pointer" as const,
              fontWeight: "400" as const,
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
              display: "flex" as const,
              alignItems: "center" as const,
              p: 1,
              borderRight: "1px solid #ddd",
              paddingRight: 2,
              cursor: "pointer" as const,
              fontWeight: "400" as const,
              fontSize: "13px",
              "&:hover": {
                color: "#408dfb",
              },
            }}
          >
            <IconButton aria-label="Print" onClick={() => window.print()}
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
                cursor: "pointer" as const,
                fontWeight: "400" as const,
                fontSize: "13px",
              }}
            >
              <Tooltip title={billStatusBlock(billDetail, "DRAFT") ?? ""}>
<span>
<Button
 disabled={Boolean(billStatusBlock(billDetail, "DRAFT"))}
                sx={{
                  p: 1,
                  color: "black",
                  fontSize: "13px",
                  fontWeight: "400" as const,
                  textTransform: "none" as const,
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
</span>
</Tooltip>
            </Box>
          )}
          {/* Rendered for every status: Void (open / partially paid bills)
              opens this modal too. */}
          <StatusActionModal
            open={modalConfig.open}
            onClose={closeModal}
            onConfirm={(reason) => {
              if (modalConfig.confirmAction) {
                modalConfig.confirmAction(reason);
              }
              closeModal();
            }}
            title={modalConfig.title}
            message={modalConfig.message}
            confirmButtonText={modalConfig.confirmButtonText}
            actionType={modalConfig.actionType}
          />
          <Box
            sx={{
              p: 1,
              fontSize: "10px",
              borderRight: "1px solid #ddd",
              backgroundColor: "transparent",
              cursor: "pointer" as const,
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
              
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // PDF Toggle - sticky under the header
  const PDFToggle = (_props?: any) => (
    <Box
      sx={{
        display: "flex" as const,
        justifyContent: "flex-end" as const,
        alignItems: "center" as const,
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

  if (!loading && (loadError || !billDetail?.bill_number)) {
    return (
      <Paper elevation={0} sx={{ width: "100%", borderLeft: "1px solid #ddd", p: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Bill not found
        </Typography>
        <Typography variant="body2" sx={{ color: "#6C718A", mb: 2 }}>
          {loadError || "This bill doesn't exist in this organization."}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => router.push("/purchase/bills")}>
          Back to Bills
        </Button>
      </Paper>
    );
  }

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
              display: "flex" as const,
              flexDirection: "column" as const,
              alignItems: "center" as const,
            }}
          >
            <Box
              sx={{
                width: "8.27in",
                display: "flex" as const,
                justifyContent: "flex-end" as const,
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
              display: "flex" as const,
              flexDirection: "column" as const,
              alignItems: "center" as const,
            }}
          >
            <Box
              sx={{
                width: "8.27in",
                display: "flex" as const,
                justifyContent: "flex-end" as const,
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
            position: "fixed" as const,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex" as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
          }}
        >
          <Typography variant="h6">Generating PDF...</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default BillManagementApp;
