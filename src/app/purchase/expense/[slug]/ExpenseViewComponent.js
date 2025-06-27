"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  DialogActions,
} from "@mui/material";
import Button from "../../../common/btn/Button";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";
import CommentsDrawer from "../../../common/commentAndHistory/CommentsDrawer";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { usePathname, useRouter } from "next/navigation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Image from "next/image";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import formatCurrency from "../../../common/FormatCurrency";
import html2pdf from "html2pdf.js";
import { useSnackbar } from "../../../../components/SnackbarProvider";

// Header Skeleton Component
const HeaderSkeleton = () => {
  return (
    <Box
      sx={{
        mb: 2,
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        zIndex: 10,
      }}
    >
      {/* First header row */}
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
          <Skeleton variant="text" width={150} height={30} animation="wave" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
              animation="wave"
            />
            <Skeleton variant="text" width={120} height={24} animation="wave" />
          </Box>

          <Skeleton
            variant="circular"
            width={24}
            height={24}
            animation="wave"
          />
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
          {/* Edit button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              paddingRight: 2,
              borderRight: "1px solid #ddd",
            }}
          >
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
              animation="wave"
            />
            <Skeleton variant="text" width={40} height={24} animation="wave" />
          </Box>

          {/* Make Recurring button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              py: 1.4,
              px: 2,
              borderRight: "1px solid #ddd",
            }}
          >
            <Skeleton variant="text" width={100} height={24} animation="wave" />
          </Box>

          {/* Print button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRight: "1px solid #ddd",
              paddingRight: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 1 }}
              animation="wave"
            />
            <Skeleton variant="text" width={40} height={24} animation="wave" />
          </Box>

          {/* More options */}
          <Box
            sx={{
              p: 1,
              borderRight: "1px solid #ddd",
            }}
          >
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              animation="wave"
            />
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
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation="wave"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Middle Content Skeleton Component
const MiddleContentSkeleton = () => {
  return (
    <Box sx={{ px: 2, pb: 2 }}>
      {/* Overall Container */}
      <Box sx={{ display: "flex", pl: 2 }}>
        {/* Left Container */}
        <Box sx={{ width: "60%" }}>
          {/* Expense Amount */}
          <Box>
            <Skeleton
              variant="text"
              width={100}
              height={20}
              animation="wave"
              sx={{ mb: 0.5 }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 1,
                mb: 0.5,
                ml: -0.2,
              }}
            >
              <Skeleton
                variant="text"
                width={120}
                height={30}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width={80}
                height={20}
                animation="wave"
              />
            </Box>
            <Skeleton
              variant="text"
              width={100}
              height={20}
              animation="wave"
              sx={{ mb: 0.5 }}
            />
          </Box>

          {/* Type of Expense */}
          <Box>
            <Skeleton
              variant="rectangular"
              width={150}
              height={30}
              animation="wave"
              sx={{ my: 3, borderRadius: 1 }}
            />
          </Box>

          {/* The Details */}
          <Box>
            {/* Ref # */}
            <Box sx={{ mb: 3 }}>
              <Skeleton
                variant="text"
                width={60}
                height={20}
                animation="wave"
                sx={{ mb: 0.2 }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={20}
                animation="wave"
              />
            </Box>

            {/* Paid Through */}
            <Box sx={{ mb: 3 }}>
              <Skeleton
                variant="text"
                width={90}
                height={20}
                animation="wave"
                sx={{ mb: 0.2 }}
              />
              <Skeleton
                variant="text"
                width={120}
                height={20}
                animation="wave"
              />
            </Box>

            {/* Paid To */}
            <Box sx={{ mb: 3 }}>
              <Skeleton
                variant="text"
                width={70}
                height={20}
                animation="wave"
                sx={{ mb: 0.2 }}
              />
              <Skeleton
                variant="text"
                width={140}
                height={20}
                animation="wave"
              />
            </Box>

            {/* Customer Name */}
            <Box sx={{ mb: 3 }}>
              <Skeleton
                variant="text"
                width={110}
                height={20}
                animation="wave"
                sx={{ mb: 0.2 }}
              />
              <Skeleton
                variant="text"
                width={150}
                height={20}
                animation="wave"
              />
            </Box>

            {/* Tax */}
            <Box sx={{ mb: 3 }}>
              <Skeleton
                variant="text"
                width={50}
                height={20}
                animation="wave"
                sx={{ mb: 0.2 }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={20}
                animation="wave"
              />
            </Box>
          </Box>
        </Box>

        {/* Right Container */}
        <Box sx={{ width: "50%", mx: 0.5, mb: 10, display: "flex" }}>
          <Skeleton
            variant="rectangular"
            width={250}
            height={350}
            animation="wave"
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

// Bill Section Skeleton Component
const BillSectionSkeleton = () => {
  return (
    <Box
      sx={{
        px: 2,
        mb: 6,
        boxShadow: "none !important",
        border: "2px solid #f9f9fb",
      }}
    >
      <Box sx={{ px: 2, paddingTop: 2 }}>
        <Skeleton variant="text" width={70} height={24} animation="wave" />
        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="text"
            width={240}
            height={20}
            animation="wave"
            sx={{ mr: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={40}
            height={20}
            animation="wave"
            sx={{ borderRadius: 1 }}
          />
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
        <Skeleton variant="text" width={50} height={30} animation="wave" />
      </Box>

      <TableContainer sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="33%">
                <Skeleton
                  variant="text"
                  width={80}
                  height={24}
                  animation="wave"
                />
              </TableCell>
              <TableCell width="33%" align="right">
                <Skeleton
                  variant="text"
                  width={60}
                  height={24}
                  animation="wave"
                />
              </TableCell>
              <TableCell width="33%" align="right">
                <Skeleton
                  variant="text"
                  width={60}
                  height={24}
                  animation="wave"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{ borderBottom: index === 2 ? "1px solid #ddd" : "none" }}
                >
                  <Skeleton
                    variant="text"
                    width={120}
                    height={24}
                    animation="wave"
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ borderBottom: index === 2 ? "1px solid #ddd" : "none" }}
                >
                  <Skeleton
                    variant="text"
                    width={80}
                    height={24}
                    animation="wave"
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ borderBottom: index === 2 ? "1px solid #ddd" : "none" }}
                >
                  <Skeleton
                    variant="text"
                    width={80}
                    height={24}
                    animation="wave"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ExpenseViewComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPDFView, setShowPDFView] = useState(false);
  const [expense_ID, setExpense_ID] = useState("");
  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { showMessage } = useSnackbar();
  const [journalId, setJournalId] = useState("");

  const INDIAN_STATES = [
    { code: "AN", name: "Andaman and Nicobar Islands" },
    { code: "AD", name: "Andhra Pradesh" },
    { code: "AR", name: "Arunachal Pradesh" },
    { code: "AS", name: "Assam" },
    { code: "BR", name: "Bihar" },
    { code: "CH", name: "Chandigarh" },
    { code: "CG", name: "Chhattisgarh" },
    { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
    { code: "DD", name: "Daman and Diu" },
    { code: "DL", name: "Delhi" },
    { code: "FC", name: "Foreign Country" },
    { code: "GA", name: "Goa" },
    { code: "GJ", name: "Gujarat" },
    { code: "HR", name: "Haryana" },
    { code: "HP", name: "Himachal Pradesh" },
    { code: "JK", name: "Jammu and Kashmir" },
    { code: "JH", name: "Jharkhand" },
    { code: "KA", name: "Karnataka" },
    { code: "KL", name: "Kerala" },
    { code: "LA", name: "Ladakh" },
    { code: "LD", name: "Lakshadweep" },
    { code: "MP", name: "Madhya Pradesh" },
    { code: "MH", name: "Maharashtra" },
    { code: "MN", name: "Manipur" },
    { code: "ML", name: "Meghalaya" },
    { code: "MZ", name: "Mizoram" },
    { code: "NL", name: "Nagaland" },
    { code: "OD", name: "Odisha" },
    { code: "OT", name: "Other Territory" },
    { code: "PY", name: "Puducherry" },
    { code: "PB", name: "Punjab" },
    { code: "RJ", name: "Rajasthan" },
    { code: "SK", name: "Sikkim" },
    { code: "TN", name: "Tamil Nadu" },
    { code: "TS", name: "Telangana" },
    { code: "TR", name: "Tripura" },
    { code: "UP", name: "Uttar Pradesh" },
    { code: "UK", name: "Uttarakhand" },
    { code: "WB", name: "West Bengal" },
  ];

  const supplierState = INDIAN_STATES.find(
    (state) => state.code === expense.source_of_supply
  );

  const destinationState = INDIAN_STATES.find(
    (state) => state.code === expense.destination_of_supply
  );

  const tableview = () => {
    router.push("/purchase/expense");
  };

  const toggleMoreOptions = () => {
    setIsMoreOptions((prev) => !prev);
  };
  const handleClose = () => {
    // setIsDeleteDialogOpen(false);
    setIsMoreOptions(false);
  };

  // Add these handler functions
  const handleClone = () => {
    alert(expense.unique_EX_id);
    router.push(`/purchase/expense/newexpense?clone_id=${expense.unique_EX_id}`);
  };
  const handleDeleteConfirm = async () => {
    try {
      let params = {
        url: `/api/v1/expense/delete-expense?org_id=${org_id}&expense_id=${expense_ID}&journal_id=${expense?.journal_id}`,
        method: "post",
      };
      let response = await apiService(params);
      // console.log("response", response);
      if (response.statusCode == 200) {
        setIsDeleteDialogOpen(false);
        showMessage(response.data.message, "success");
        router.push("/purchase/expense");
      } else {
        showMessage(response.data.message, "error");
      }
    } catch (error) {
      console.log("Something went wrong", error);
      showMessage("Something went wrong", "error");
    }
  };
  const handleDeleteClick = () => {
    setIsMoreOptions(false);
    setIsDeleteDialogOpen(true);
  };
  const generatePDF = () => {
    setIsPdfGenerating(true);

    // Small delay to ensure any UI updates are rendered
    setTimeout(() => {
      try {
        const elementId = expense.documents
          ? "pdf-view-container"
          : "pdf-view-no-bill";
        const element = document.getElementById(elementId);

        if (!element) {
          console.error("PDF view element not found");
          setIsPdfGenerating(false);
          return;
        }

        const options = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `Expense-${expense.unique_EX_id || "document"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait",
          },
        };

        html2pdf()
          .from(element)
          .set(options)
          .save()
          .then(() => {
            console.log("PDF generation complete");
            setIsPdfGenerating(false);
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
            setIsPdfGenerating(false);
          });
      } catch (error) {
        console.error("Error in PDF generation process:", error);
        setIsPdfGenerating(false);
      }
    }, 200);
  };

  const pathname = usePathname();
  let org_id = localStorage.getItem("organization_id");

  useEffect(() => {
    let ex_id = pathname.split("/")[3];
    setExpense_ID(ex_id);
    getExpenseDetail(ex_id, org_id);
  }, [pathname]);

  const getExpenseDetail = async (ex_id, org_id) => {
    setLoading(true);
    try {
      let params = {
        url: `/api/v1/expense/get-individual-expense?org_id=${org_id}&expense_id=${ex_id}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };

      // Add artificial delay of 800ms to demonstrate the skeleton (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await apiService(params);
      if (response.statusCode === 200) {
        setExpense(response.data.data);

        getJournals(response.data.data.journal_id);
        // console.log(response.data.data.journal_id, "responsesss");

        console.log(response.data.data, "this is the expense details");
      }
    } catch (error) {
      console.log("getExpenseDetail error", error);
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
            Expense Details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => setDrawerOpen(true)}
          >
            <IconButton size="13px">
              <CommentIcon fontSize="13px" />
            </IconButton>
            <Box>Comments & History</Box>
          </Box>
          <CommentsDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            module={"Expense"}
          />

          <Box onClick={tableview}>
            <IconButton size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
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
                  borderRadius: 1,
                },
              }}
              onClick={handleClone}
            >
              Clone
            </MenuItem>

            <MenuItem
              sx={{
                fontSize: "13px",
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: 1,
                  fontSize: "13px",
                },
              }}
              onClick={() => {
                handleDeleteClick();
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              sx={{
                fontSize: "13px",
                "&:hover": {
                  backgroundColor: "#408dfb",
                  color: "white",
                  borderRadius: 1,
                  fontSize: "13px",
                },
              }}
            >
              View Journal
            </MenuItem>
          </Menu>
        )}
      </Box>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            size="small"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="primary"
            // variant="outlined"
            size="small"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
              const Expense_ID = pathname.split("/")[3];
              // Navigate to create bill page with bill_id as query parameter

              router.push(
                `/purchase/expense/newexpense/${
                  expense.type === "expense" ? "recordExpense" : "recordMileage"
                }?expense_id=${Expense_ID}`
              );
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
              py: 1.4,
              px: 2,
              borderRight: "1px solid #ddd",
              cursor: "pointer",
              fontWeight: "400",
              fontSize: "13px",
              "&:hover": {
                color: "#408dfb",
              },
            }}
          >
            <Box>Make Recurring</Box>
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
              <PrintIcon style={{ fontSize: "16px" }} fontSize="small" />
            </IconButton>
            <Box>Print</Box>
          </Box>

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

  const MiddleContent = () => (
    <Box sx={{ px: 2, pb: 2 }}>
      {/*Overall Container*/}
      <Box id={"pdf-view-container"} sx={{ display: "flex", pl: 2 }}>
        {/*Left Container*/}

        <Box id={"pdf-view-no-bill"} sx={{ width: "60%" }}>
          {/*Expense Amount*/}

          <Box>
            <Typography
              sx={{
                fontWeight: "300",
                fontSize: "13px",
                color: "#6C718A",
                mb: 0.5,
              }}
            >
              Expense Amount
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 1,
                mb: 0.5,
                ml: -0.2,
              }}
            >
              <Typography
                sx={{ fontWeight: "400", fontSize: "20px", color: "#F7525A" }}
              >
                {formatCurrency(expense.tot_amount) === "₹0.00"
                  ? "₹0.00"
                  : "₹" + formatCurrency(expense.tot_amount)}
              </Typography>
              <Typography
                sx={{ fontWeight: "300", fontSize: "12px", color: "#6C718A" }}
              >
                on {new Date(expense.date).toLocaleDateString("en-GB")}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: "400",
                fontSize: "13px",
                color:
                  expense.status === 0
                    ? "#33495F"
                    : expense.status === 1
                    ? "#a696a4"
                    : expense.status === 2
                    ? "#f770af"
                    : expense.status === 3
                    ? "#3fcbe1"
                    : "#33495F",
                mb: 0.5,
              }}
            >
              {expense.status === 0
                ? "NON-BILLABLE"
                : expense.status === 1
                ? "UNBILLED"
                : expense.status === 2
                ? "INVOICED"
                : expense.status === 3
                ? "REIMBURSED"
                : "NON-BILLABLE"}
            </Typography>
          </Box>

          {/* Type of Expense */}

          <Box>
            <Typography
              sx={{
                fontWeight: "400",
                fontSize: "12px",
                color: "#343A40",
                bgcolor: "#c5e3ec",
                minWidth: "120px",
                maxWidth: "150px",
                textAlign: "center",
                my: 3,
              }}
            >
              {expense.lineItems?.[0]?.account_id}
            </Typography>
          </Box>

          {expense.type === "mileage" && (
            <Box>
              <Typography
                sx={{
                  fontWeight: "400",
                  fontSize: "12px",
                  color: "#343A40",
                  bgcolor: "#c5e3ec",
                  minWidth: "120px",
                  maxWidth: "150px",
                  textAlign: "center",
                  my: 3,
                }}
              >
                Fuel / Mileage Expenses
              </Typography>
            </Box>
          )}

          {/*The Details*/}

          <Box>
            {expense.invoice_number && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Ref #
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense.invoice_number}
                </Typography>
              </Box>
            )}
            {expense.paid_through_account_name && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Paid Through
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense.paid_through_account_name}
                </Typography>
              </Box>
            )}
            {expense.vendor_id?.contact_name && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Paid To
                </Typography>
                <Typography
                  sx={{ color: "#57b0fc", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense.vendor_id?.contact_name}
                </Typography>
              </Box>
            )}

            {expense.customer_id?.contact_name && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Customer Name
                </Typography>
                <Typography
                  sx={{ color: "#57b0fc", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense.customer_id?.contact_name}
                </Typography>
              </Box>
            )}

            {expense?.employee_name && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Employee
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense?.employee_name}
                </Typography>
              </Box>
            )}

            {expense.distance && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Distance
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "13px",
                    fontWeight: "400",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                  }}
                >
                  <Box> {expense.distance}</Box>
                  <Box
                    sx={{
                      fontWeight: "400",
                      fontSize: "11px",
                      color: "#6C718A",
                    }}
                  >
                    Rate per km = ₹10.00
                  </Box>
                </Typography>
              </Box>
            )}

            {expense.expense_tax_percent && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Tax
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense.expense_tax_percent}
                </Typography>
              </Box>
            )}

            {expense.expense_tax_amount && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Tax Amount
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  ₹ {formatCurrency(expense.expense_tax_amount)} ({" "}
                  {expense.inclusive_exclusive} )
                </Typography>
              </Box>
            )}

            {expense.gst_treatment && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  GST Treatment
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense.gst_treatment}
                </Typography>
              </Box>
            )}

            {expense.vendor_gst_no && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  GSTIN / UIN
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {expense.vendor_gst_no}
                </Typography>
              </Box>
            )}

            {expense.source_of_supply && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Source of Supply
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {supplierState.name}
                </Typography>
              </Box>
            )}

            {expense.destination_of_supply && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#6C718A",
                    fontSize: "13px",
                    fontWeight: "300",
                    mb: 0.2,
                  }}
                >
                  Destination of Supply
                </Typography>
                <Typography
                  sx={{ color: "#000000", fontSize: "13px", fontWeight: "400" }}
                >
                  {destinationState.name}
                </Typography>
              </Box>
            )}

            {expense.status === 3 && (
              <Box>
                <Typography
                  sx={{ color: "#57b0fc", fontSize: "13px", fontWeight: "400" }}
                >
                  View Invoice Details
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/*Right Container*/}

        <Box
          sx={{
            width: "50%",
            mx: 0.5,
            mb: 10,
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "350px",
              width: "250px",
              border: "2px dotted #d7d5e2",
              borderRadius: "7px",
              bgcolor: "white",
              "&:hover": {
                borderColor: "#408dfb",
              },
            }}
          >
            {/*Image*/}

            <Box
              sx={{
                borderRadius: "7px",
                overflow: "hidden",
                mb: 3,
                height: "50px",
              }}
            >
              <Image src="/Moon.jpg" alt="Moon Image" width={50} height={50} />
            </Box>

            {/*Text 1*/}

            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "500" }}>
                Drag or Drop your Receipts
              </Typography>
            </Box>

            {/*Text 2*/}

            <Box>
              <Typography
                sx={{ fontSize: "11px", fontWeight: "400", color: "#6C718A" }}
              >
                Maximum file size allowed is 10MB
              </Typography>
            </Box>

            {/*Input Field*/}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                padding: "4px", // Add padding for better spacing
                borderRadius: "8px",
                bgcolor: "#f1f1fa",
                mt: 3,
                width: "200px",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                startIcon={
                  <FileUploadOutlinedIcon
                    sx={{ color: "#8d91a6 !important" }}
                  />
                }
                component="label"
                size="small"
                sx={{
                  color: "#2e3b44 !important",
                  border: "none",
                  fontSize: "13px !important",
                  fontWeight: "200 !important",
                }}
              >
                Upload File
                <input
                  type="file"
                  name="documents"
                  hidden
                  accept=".pdf, .jpeg, .jpg, .png"
                  // onChange={handleFileUpload}
                />
              </Button>

              <IconButton size="small">
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

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
      sx={{ borderLeft: "1px solid #ddd", height: "90vh", overflowY: "auto" }}
    >
      {loading ? (
        <>
          <HeaderSkeleton />
          <MiddleContentSkeleton />
          <BillSectionSkeleton />
        </>
      ) : (
        <>
          <Header />
          <MiddleContent />
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
    </Box>
  );
};

export default ExpenseViewComponent;
