"use client";
import React, { useEffect, useState, useCallback } from "react";
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
  DialogActions,
  ListItemIcon,
  Chip,
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import formatCurrency from "../../../common/FormatCurrency";
import html2pdf from "html2pdf.js";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateAccountPopup from "../create/page";

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
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Skeleton
            variant="text"
            width={120}
            height={20}
            animation="wave"
            sx={{ mb: 0.5 }}
          />
          <Skeleton variant="text" width={180} height={28} animation="wave" />
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
      </Box>
    </Box>
  );
};

// Middle Content Skeleton Component
const MiddleContentSkeleton = () => {
  return (
    <Box sx={{ px: 2, pb: 4 }}>
      {/* Closing Balance Section */}
      <Box sx={{ mb: 4 }}>
        <Skeleton
          variant="text"
          width={120}
          height={20}
          animation="wave"
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
          <Skeleton variant="text" width={80} height={32} animation="wave" />
          <Skeleton variant="text" width={40} height={24} animation="wave" />
        </Box>
        <Skeleton
          variant="text"
          width={300}
          height={20}
          animation="wave"
          sx={{ mb: 0.5 }}
        />
        <Skeleton variant="text" width={250} height={20} animation="wave" />
      </Box>

      {/* Divider */}
      <Box sx={{ borderBottom: "1px dashed #ddd", mb: 4 }} />
    </Box>
  );
};

// Recent Transactions Skeleton Component
const RecentTransactionsSkeleton = () => {
  return (
    <Box sx={{ px: 2, mb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Skeleton variant="text" width={160} height={28} animation="wave" />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            variant="rectangular"
            width={50}
            height={32}
            animation="wave"
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={50}
            height={32}
            animation="wave"
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="15%">
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  animation="wave"
                />
              </TableCell>
              <TableCell width="25%">
                <Skeleton
                  variant="text"
                  width={140}
                  height={20}
                  animation="wave"
                />
              </TableCell>
              <TableCell width="20%">
                <Skeleton
                  variant="text"
                  width={50}
                  height={20}
                  animation="wave"
                />
              </TableCell>
              <TableCell width="20%" align="right">
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  animation="wave"
                />
              </TableCell>
              <TableCell width="20%" align="right">
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  animation="wave"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton
                    variant="text"
                    width={80}
                    height={20}
                    animation="wave"
                  />
                </TableCell>
                <TableCell>
                  <Skeleton
                    variant="text"
                    width={120}
                    height={20}
                    animation="wave"
                  />
                </TableCell>
                <TableCell>
                  <Skeleton
                    variant="text"
                    width={100}
                    height={20}
                    animation="wave"
                  />
                </TableCell>
                <TableCell align="right">
                  <Skeleton
                    variant="text"
                    width={80}
                    height={20}
                    animation="wave"
                  />
                </TableCell>
                <TableCell align="right">
                  <Skeleton
                    variant="text"
                    width={80}
                    height={20}
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

const COAviewComponent = () => {
  // State management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [coaData, setCoaData] = useState({}); // Updated: Store complete COA object
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("FCY");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const { showMessage } = useSnackbar();

  // Create
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [editAccountId, setEditAccountId] = useState(null);

  const handleCreateAccount = (id) => {
    setEditAccountId(id); // Set the ID for editing
    setCreateAccountOpen(true); // Open the dialog
  };

  const handleCloseCreateAccount = () => {
    setCreateAccountOpen(false);
  };

  // Computed values
  const isMenuOpen = Boolean(anchorEl);
  const orgId = localStorage.getItem("organization_id");
  const accountId = pathname.split("/")[3];

  // Event handlers
  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const handleTableView = useCallback(() => {
    router.push("/finance/chart-of-accounts");
  }, [router]);

  const handleEdit = useCallback(() => {
    router.push(`/finance/chart-of-accounts/edit/${accountId}`);
  }, [router, accountId]);

  const handleMenuToggle = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
  }, []);

  const handleMarkInactive = useCallback(() => {
    handleMenuClose();
    showMessage("Account marked as inactive", "success");
  }, [handleMenuClose, showMessage]);

  const handleDelete = useCallback(() => {
    handleMenuClose();
    setIsDeleteDialogOpen(true);
  }, [handleMenuClose]);

  const confirmDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    showMessage("Account deleted successfully", "success");
    handleTableView();
  }, [showMessage, handleTableView]);

  // API functions
  const getIndividualAccount = async (account_id, orgId) => {
    if (!account_id || !orgId) return;
    setLoading(true);
    try {
      const params = {
        url: `/api/v1/COA/get-coa-transaction?org_id=${orgId}&COA_ID=${account_id}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };

      // Simulate API delay for skeleton demonstration
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await apiService(params);
      if (response.statusCode === 200 || response.status === true) {
        const transactionHistory =
          response.data?.transaction_history ||
          response.transaction_history ||
          [];
        const totalAmt =
          response.data?.total_amount || response.total_amount || 0;

        // Updated: Extract complete COA object
        const coaObject = response.data?.COA || response.COA || {};

        setAccountData(transactionHistory);
        setTotalAmount(totalAmt);
        setCoaData(coaObject); // Updated: Store complete COA object

        console.log(response, "response");
        console.log(transactionHistory, "Transaction history loaded");
        console.log(coaObject, "COA object loaded"); // Updated: Log COA object
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      showMessage("Failed to load account details", "error");
    } finally {
      setLoading(false);
    }
  };
  // Effects
  useEffect(() => {
    if (accountId && orgId) {
      getIndividualAccount(accountId, orgId);
    }
  }, [accountId, orgId]);
  const generatePDF = useCallback(() => {
    setIsPdfGenerating(true);

    setTimeout(() => {
      try {
        const element = document.getElementById("pdf-view-container");

        if (!element) {
          console.error("PDF view element not found");
          setIsPdfGenerating(false);
          showMessage("Failed to generate PDF", "error");
          return;
        }

        const options = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `${coaData.account_name || "Account"}-${
            new Date().toISOString().split("T")[0]
          }.pdf`,
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
            showMessage("PDF generated successfully", "success");
            setIsPdfGenerating(false);
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
            showMessage("Failed to generate PDF", "error");
            setIsPdfGenerating(false);
          });
      } catch (error) {
        console.error("Error in PDF generation process:", error);
        showMessage("Failed to generate PDF", "error");
        setIsPdfGenerating(false);
      }
    }, 200);
  }, [coaData.account_name]); // Updated: Use coaData.account_name

  // Component sections
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
        {/* Updated Header Section */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "400",
              fontSize: "13px",
              color: "#6C718A",
              mt: "20px",
            }}
          >
            {coaData.account_type_formatted || "Account Type"}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "600",
              fontSize: "20px",
              color: "#000",
              mb: "20px",
            }}
          >
            {coaData.account_name || "Account Name"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleDrawerToggle}
          >
            <IconButton size="small">
              <AttachFileIcon sx={{ fontSize: "16px", color: "#408dfb" }} />
            </IconButton>
            <Typography sx={{ fontSize: "14px", color: "#408dfb" }}>
              Upload files
            </Typography>
          </Box>

          <IconButton size="small" onClick={handleTableView}>
            <CloseIcon fontSize="small" />
          </IconButton>
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* Edit Button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderRight: "1px solid #ddd",
              cursor: "pointer",
              fontWeight: 400,
              fontSize: "13px",
              color: "#6C718A",
              "&:hover": {
                color: "#408dfb",
                backgroundColor: "#f5f8ff",
              },
              minHeight: "40px",
            }}
            onClick={() => handleCreateAccount(accountId)}
          >
            <EditIcon sx={{ fontSize: "16px", mr: 0.5 }} />
            Edit
          </Box>
          {/* Create Popup Dialog */}
          <CreateAccountPopup
            open={createAccountOpen}
            onClose={handleCloseCreateAccount}
            accountId={editAccountId}
          />
          {/* More Options Menu */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minHeight: "40px",
            }}
          >
            <IconButton
              size="small"
              onClick={handleMenuToggle}
              sx={{
                color: "#6C718A",
                "&:hover": {
                  backgroundColor: "#f5f8ff",
                  color: "#408dfb",
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  minWidth: 180,
                  borderRadius: "10px",
                  paddingY: 0.5,
                  ml: "40%",
                  mt: "10%",
                  border: "1px lightgray solid",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {/* Print PDF */}
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  generatePDF();
                }}
                sx={{
                  fontSize: "13px",
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: "5px",
                    margin: "1px 1px",
                  },
                }}
              >
                <ListItemIcon>
                  <PrintIcon fontSize="small" sx={{ color: "#757575" }} />
                </ListItemIcon>
                <Typography variant="body2">Print PDF</Typography>
              </MenuItem>

              {/* Mark as Inactive */}
              <MenuItem
                onClick={handleMarkInactive}
                sx={{
                  fontSize: "13px",
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: "5px",
                    margin: "1px 1px",
                  },
                }}
              >
                <ListItemIcon>
                  <RemoveCircleOutlineIcon
                    fontSize="small"
                    sx={{ color: "#757575" }}
                  />
                </ListItemIcon>
                <Typography variant="body2">Mark as Inactive</Typography>
              </MenuItem>

              {/* Delete */}
              <MenuItem
                onClick={handleDelete}
                sx={{
                  fontSize: "13px",
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#408dfb",
                    color: "white",
                    borderRadius: "5px",
                    margin: "1px 1px",
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" sx={{ color: "#757575" }} />
                </ListItemIcon>
                <Typography variant="body2">Delete</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const MiddleContent = () => (
    <Box id="pdf-view-container" sx={{ px: 2, pb: 4 }}>
      {/* Closing Balance */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontWeight: "400",
            fontSize: "14px",
            color: "#6C718A",
            mb: 1,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          CLOSING BALANCE
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "24px",
              color: "#408dfb",
              display: "flex",
            }}
          >
            ₹{totalAmount || "0.00"}{" "}
            <Typography sx={{ fontSize: "14px", mt: "10px", ml: "5px" }}>
              (Dr)
            </Typography>
          </Typography>
        </Box>
        {/* Updated Description Section */}
        <Box sx={{ display: "flex", fontStyle: "italic" }}>
          <Typography sx={{ fontSize: "14px", color: "#000", mb: 1, mr: 1 }}>
            Description:
          </Typography>
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: "14px",
              color: "#6C718A",
              lineHeight: 1.6,
            }}
          >
            {coaData.description || "No description available"}
          </Typography>
        </Box>
      </Box>

      {/* Dashed Divider */}
      <Box
        sx={{
          borderBottom: "1px dashed #ddd",
          mb: 4,
          width: "100%",
        }}
      />
    </Box>
  );

  const RecentTransactions = () => (
    <Box sx={{ px: 2, mb: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "18px", color: "#000" }}
        >
          Recent Transactions
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            border: "1px solid #408dfb",
            borderRadius: "6px",
            overflow: "hidden",
            height: "28px",
          }}
        >
          <Chip
            label="FCY"
            onClick={() => handlePeriodChange("FCY")}
            sx={{
              borderRadius: 0,
              borderRight: "1px solid #408dfb",
              backgroundColor:
                selectedPeriod === "FCY" ? "#408dfb" : "transparent",
              color: selectedPeriod === "FCY" ? "white" : "#408dfb",
              fontSize: "12px",
              height: "26px",
              px: 1.5,
              "&:hover": {
                backgroundColor:
                  selectedPeriod === "FCY" ? "#357abd" : "#f0f7ff",
              },
            }}
          />
          <Chip
            label="BCY"
            onClick={() => handlePeriodChange("BCY")}
            sx={{
              borderRadius: 0,
              backgroundColor:
                selectedPeriod === "BCY" ? "#408dfb" : "transparent",
              color: selectedPeriod === "BCY" ? "white" : "#408dfb",
              fontSize: "12px",
              height: "26px",
              px: 1.5,
              "&:hover": {
                backgroundColor:
                  selectedPeriod === "BCY" ? "#357abd" : "#f0f7ff",
              },
            }}
          />
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead
            sx={{
              borderTop: "1px solid lightgray",
              borderBottom: "1px solid lightgray",
            }}
          >
            <TableRow>
              <TableCell
                width="15%"
                sx={{
                  fontWeight: "600",
                  color: "#6C718A",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "none",
                  pb: 1,
                }}
              >
                DATE
              </TableCell>
              <TableCell
                width="25%"
                sx={{
                  fontWeight: "600",
                  color: "#6C718A",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "none",
                  pb: 1,
                }}
              >
                TRANSACTION DETAILS
              </TableCell>
              <TableCell
                width="20%"
                sx={{
                  fontWeight: "600",
                  color: "#6C718A",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "none",
                  pb: 1,
                }}
              >
                TYPE
              </TableCell>
              <TableCell
                width="20%"
                align="right"
                sx={{
                  fontWeight: "600",
                  color: "#6C718A",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "none",
                  pb: 1,
                }}
              >
                DEBIT
              </TableCell>
              <TableCell
                width="20%"
                align="right"
                sx={{
                  fontWeight: "600",
                  color: "#6C718A",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  border: "none",
                  pb: 1,
                }}
              >
                CREDIT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!Array.isArray(accountData) || accountData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    py: 4,
                    fontSize: "12px",
                    color: "#6C718A",
                  }}
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              accountData.map((transaction, index) => (
                <TableRow
                  key={transaction.journal_obj_id || index}
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  <TableCell
                    sx={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#000",
                      border: "none",
                      py: 2,
                    }}
                  >
                    {transaction.journal_date_formatted}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#000",
                      border: "none",
                      py: 2,
                    }}
                  >
                    {transaction.customer_name ||
                      transaction.vendor_name ||
                      "--"}
                  </TableCell>  

                  <TableCell
                    sx={{
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#000",
                      border: "none",
                      py: 2,
                    }}
                  >
                    {transaction.type}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#000",
                      border: "none",
                      py: 2,
                    }}
                  >
                    {transaction.creditOrDebit === "Debit"
                      ? transaction.amount_formatted
                      : ""}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#000",
                      border: "none",
                      py: 2,
                    }}
                  >
                    {transaction.creditOrDebit === "Credit"
                      ? transaction.amount_formatted
                      : ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box
      sx={{ borderLeft: "1px solid #ddd", height: "90vh", overflowY: "auto" }}
    >
      {loading ? (
        <>
          <HeaderSkeleton />
          <MiddleContentSkeleton />
          <RecentTransactionsSkeleton />
        </>
      ) : (
        <>
          <Header />
          <MiddleContent />
          <RecentTransactions />
        </>
      )}

      {/* Comments Drawer */}
      <CommentsDrawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        module={"COA"}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div">
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this account? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#ddd",
              color: "#6C718A",
              "&:hover": {
                borderColor: "#408dfb",
                backgroundColor: "#f5f8ff",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Delete
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
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #408dfb",
              animation: "spin 1s linear infinite",
              mb: 2,
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
          <Typography variant="h6" sx={{ color: "#408dfb", fontWeight: 500 }}>
            Generating PDF...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default COAviewComponent;
