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
  Button,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import formatCurrency from "../../../common/FormatCurrency";

// Import your images
import WalletImg from "../../../../assets/recurring_expense_3-removebg-preview.png";
import RepeatImg from "../../../../assets/recurring_expense_1-removebg-preview.png";
import NotesImg from "../../../../assets/recurring_expenese_2-removebg-preview.png";
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

const RecurringExpenseViewComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { showMessage } = useSnackbar();
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPDFView, setShowPDFView] = useState(false);
  const [recurringExpense_ID, setRecurringExpense_ID] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recurringExpense, setRecurringExpense] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [orgId, setOrgId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMoreOptions(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMoreOptions(false);
  };

  const tableview = () => {
    router.push("/purchase/recurringexpenses");
  };

  const toggleMoreOptions = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMoreOptions((prev) => !prev);
  };

  const handleStatus = async (ex_id, STATUS) => {
    try {
      setLoading(true);

      const params = {
        url: `/api/v1/recurring-expense/update-recurring-status?org_id=${org_id}&recurring_expense_id=${ex_id}`,
        method: "POST",
        customBaseUrl: config.PO_Base_url,
        data: {
          status: STATUS,
        },
      };
      const response = await apiService(params);
      console.log(response, "-----response");

      if (response.statusCode === 200) {
        // Refresh the data after stopping the recurring expense
        getRecurringExpenseDetail(ex_id, orgId);
        showMessage(`Recurring expense has been ${STATUS}`, "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showMessage("Something went wrong", "error");
      }
    } catch (error) {
      console.log("Error stopping recurring expense:", error);
      // setError("An error occurred while stopping the recurring expense");
      showMessage("Something went wrong", "error");
    } finally {
      setLoading(false);
      handleClose();
    }
  };
  const handleDeleteRecurringExpense = async (RE_ID) => {
    try {
      setLoading(true);

      const params = {
        url: `/api/v1/recurring-expense/delete-recurring-expense?org_id=${org_id}&recurring_expense_id=${RE_ID}`,
        method: "POST",
        customBaseUrl: config.PO_Base_url,
        data: {
          is_deleted: true,
        },
      };
      const response = await apiService(params);
      if (response.statusCode === 200) {
        // Refresh the data after stopping the recurring expense
        // getRecurringExpenseDetail(RE_ID, orgId);
        showMessage(`Recurring expense has been deleted`, "success");
        router.push("/purchase/recurringexpenses");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      } else {
        showMessage("Something went wrong", "error");
      }
    } catch (error) {
      console.log("Error stopping recurring expense:", error);
      // setError("An error occurred while stopping the recurring expense");
      showMessage("Something went wrong", "error");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

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

        // Get status elements that should be hidden in PDF
        const hiddenElements = [];
        const statusElements = element.querySelectorAll("*");

        for (let i = 0; i < statusElements.length; i++) {
          const el = statusElements[i];
          if (
            el.textContent &&
            el.textContent.trim() === recurringExpense?.status
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

        // Import html2pdf dynamically to avoid SSR issues
        import("html2pdf.js")
          .then((html2pdfModule) => {
            const html2pdf = html2pdfModule.default || html2pdfModule;

            // Basic options for html2pdf
            const options = {
              filename: `RecurringExpense-${
                recurringExpense?.name || "document"
              }.pdf`,
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
                setIsPdfGenerating(false);

                // Restore display of hidden elements
                hiddenElements.forEach((item) => {
                  item.element.style.display = item.originalDisplay;
                });

                if (!currentShowPDFView) {
                  setShowPDFView(currentShowPDFView);
                }
              });
          })
          .catch((error) => {
            console.error("Error loading html2pdf library:", error);
            setIsPdfGenerating(false);
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

  let org_id = localStorage.getItem("organization_id");

  const getRecurringExpenseDetail = async (ex_id, org_id) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        url: `/api/v1/recurring-expense/get-individual-recurring-expense?org_id=${org_id}&recurring_expense_id=${ex_id}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };

      const response = await apiService(params);
      // console.log("response+++++++++++++++++", response);
      if (response.statusCode === 200) {
        setRecurringExpense(response.data.data);
        // console.log("Recurring expense details:", response.data.data);
      } else {
        setError("Failed to fetch recurring expense details");
      }
    } catch (error) {
      console.error("Error fetching recurring expense details:", error);
      setError("An error occurred while fetching recurring expense details");
    } finally {
      setLoading(false);
    }
  };

  // Load recurring expense details on component mount
  useEffect(() => {
    const org_id = localStorage.getItem("organization_id");
    if (!org_id || !pathname) return;

    const ex_id = pathname.split("/")[3];
    if (ex_id) {
      getRecurringExpenseDetail(ex_id, org_id);
      setRecurringExpense_ID(ex_id);
    }
    setOrgId(org_id);
  }, [pathname]);

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
            sx={{ mr: 1, fontWeight: "550", fontSize: "18px" }}
          >
            {recurringExpense?.profile_name || ""}
          </Typography>

          <Box>
            <Box
              variant="subtitle1"
              sx={{
                mr: 1,
                fontWeight: "550",
                fontSize: "12px",
                color: "white",
                backgroundColor:
                  recurringExpense?.status_formatted == "ACTIVE"
                    ? "#388a10"
                    : "#fba800",
                padding: "2px 5px",
              }}
            >
              {recurringExpense?.status_formatted || ""}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                router.push(
                  `/purchase/recurringexpenses/createrecurringexpense?recurringexpense_id=${recurringExpense_ID}`
                );
              }}
            >
              Edit
            </Button>
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
            <Button onClick={toggleMoreOptions} variant="outlined" size="small">
              More <ArrowDropDownIcon sx={{ fontSize: "15px", mt: "-2px" }} />
            </Button>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={isMoreOptions}
            onClose={handleClose}
            elevation={3}
            sx={{ borderRadius: 2, fontSize: "13px", left: 1400, top: 100 }}
          >
            {recurringExpense && recurringExpense.status === "active" ? (
              <>
                <MenuItem
                  sx={{
                    fontSize: "13px",
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: 2,
                    },
                  }}
                  onClick={() => handleStatus(recurringExpense_ID, "stopped")}
                >
                  Stop
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  sx={{
                    fontSize: "13px",
                    "&:hover": {
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: 2,
                    },
                  }}
                  onClick={() => handleStatus(recurringExpense_ID, "active")}
                >
                  Resume
                </MenuItem>
              </>
            )}
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
              onClick={() => {
                router.push(`/purchase/expense/newexpense`);
                handleClose();
              }}
            >
              Create Expense
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
              onClick={() => handleDeleteRecurringExpense(recurringExpense_ID)}
            >
              Delete
            </MenuItem>
          </Menu>

          <Box onClick={tableview}>
            <IconButton size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Tabs Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          position: "sticky",
          backgroundColor: "#f8f8f8",
          zIndex: 10,
          marginBottom: 4,
        }}
      >
        <Box sx={{ width: "100%" }}>
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
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "14px",
                  px: 3,
                  py: 1.4,
                },
                "& .Mui-selected": {
                  color: "#000",
                  fontWeight: "500",
                },
              }}
            >
              <Tab label="Overview" />
              <Tab label="All Expenses" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {tabValue === 0 && (
                  <OverviewSection recurringExpense={recurringExpense} />
                )}
                {tabValue === 1 && (
                  <BillSection recurringExpense={recurringExpense_ID} />
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
  const OverviewSection = ({ recurringExpense }) => {
    if (!recurringExpense) return null;

    return (
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
        id="pdf-view-container"
      >
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Top section with recurringexpense amount, repeats, and next recurringexpense date */}
            <Box sx={{ width: "100%", display: "flex", gap: 3 }}>
              <Box sx={{ display: "flex" }}>
                <Image src={WalletImg} alt="Wallet" width={60} height={60} />
                <Box sx={{ margin: "10px" }}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 550 }}>
                    {recurringExpense.total_formatted
                      ? recurringExpense.total_formatted
                      : `₹ ${formatCurrency(recurringExpense.total || 0)}`}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "gray" }}>
                    Expense Amount
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", ml: 5 }}>
                <Image src={RepeatImg} alt="Repeat" width={95} height={70} />
                <Box sx={{ marginTop: "10px" }}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 550 }}>
                    {recurringExpense.recurrence_frequency_formatted ||
                      recurringExpense.recurrence_frequency ||
                      "Monthly"}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "gray" }}>
                    Repeats
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", ml: 5 }}>
                <Image src={NotesImg} alt="Notes" width={80} height={60} />
                <Box sx={{ marginTop: "10px" }}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 550 }}>
                    {recurringExpense.next_expense_date
                      ? recurringExpense.next_expense_date_formatted
                      : "-"}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "gray" }}>
                    Next Expense Date
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Middle section with recurringexpense details in 2 columns */}
            <Box
              sx={{
                display: "flex",
                borderBottom: "1px solid #e0e0e0",
                paddingBottom: 2,
              }}
            >
              {/* Left column */}
              <Box sx={{ display: "flex" }}>
                <Box sx={{ mb: 2, margin: "20px" }}>
                  <Typography sx={{ fontSize: "13px", color: "gray", mb: 0.5 }}>
                    Expense Account
                  </Typography>
                  <Typography sx={{ fontSize: "13px" }}>
                    {recurringExpense.account_name || ""}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, margin: "20px" }}>
                  <Typography sx={{ fontSize: "13px", color: "gray", mb: 0.5 }}>
                    Paid Through
                  </Typography>
                  <Typography sx={{ fontSize: "13px" }}>
                    {recurringExpense.paid_through_account_name || ""}
                  </Typography>
                </Box>
              </Box>

              {/* Right column with vertical orange line separator */}

              <Box
                sx={{
                  borderLeft: "3px solid orange",
                  pl: 2,
                  flex: 1,
                  mt: 2.5,
                  ml: 5,
                  height: "50px",
                }}
              >

                <Box sx={{ mb: 1, display: "flex", ml: 2 }}>
                  <Typography sx={{ fontSize: "13px", color: "gray", mb: 0.5 }}>
                    Start On
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "black",
                      fontWeight: 550,
                      ml: 3,
                    }}
                  >
                    {recurringExpense.start_date_formatted
                      ? new Date(
                          recurringExpense.start_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, display: "flex", ml: 2 }}>
                  <Typography sx={{ fontSize: "13px", color: "gray", mb: 0.5 }}>
                    Ends On
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "black",
                      fontWeight: 550,
                      ml: 3,
                    }}
                  >
                    {recurringExpense.end_date
                      ? new Date(recurringExpense.end_date).toLocaleDateString()
                      : "Until Stopped"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Other details section */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                OTHER DETAILS
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    width: "150px",
                  }}
                >
                  Payable To
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  {recurringExpense.customer_id?.contact_name || ""}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    width: "150px",
                  }}
                >
                  GST Treatment
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  {recurringExpense.gst_treatment ||
                    "Registered Business - Regular"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    width: "150px",
                  }}
                >
                  GST IN/UIN
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  {recurringExpense.gst_no || ""}
                </Typography>
              </Box>

              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    width: "150px",
                  }}
                >
                  Source of Supply
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  {recurringExpense.source_of_supply || "-"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    width: "150px",
                  }}
                >
                  Desination of Supply
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  {recurringExpense.destination_of_supply || "-"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    width: "150px",
                  }}
                >
                  Tax Amount
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  {recurringExpense.expense_tax_amount || "-"}
                </Typography>
              </Box>
            </Box>

            {/* History section */}
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  mb: 2,
                }}
              >
                HISTORY
              </Typography>

              {recurringExpense.comments &&
              recurringExpense.comments.length > 0 ? (
                recurringExpense.comments.map((historyItem, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Typography
                      sx={{ fontSize: "13px", color: "gray", width: "140px" }}
                    >
                      {historyItem.date + " " + historyItem.time}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mr: 1,
                        border: "1px solid #ccc",
                        borderRadius: "50%",
                        padding: "4px",
                      }}
                    >
                      <EditNoteOutlinedIcon
                        sx={{ fontSize: "23px", color: "orange" }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "14px" }}>
                        {historyItem.description || `Recurring expense updated`}
                      </Typography>
                      <Typography sx={{ fontSize: "13px", color: "gray" }}>
                        by {historyItem.comment_type || "System user"}
                      </Typography>
                      {historyItem.expense_id && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            router.push(
                              `/purchase/expenses/${historyItem.expense_id}`
                            )
                          }
                        >
                          <VisibilityOutlinedIcon
                            sx={{ fontSize: "15px", color: "#408dfb" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#408dfb",
                              ml: 0.5,
                            }}
                          >
                            View the expense
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))
              ) : (
                // Default history items when API doesn't provide history data
                <>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Typography
                      sx={{ fontSize: "13px", color: "gray", width: "140px" }}
                    >
                      {new Date(
                        recurringExpense.created_at || new Date()
                      ).toLocaleString()}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mr: 1,
                        border: "1px solid #ccc",
                        borderRadius: "50%",
                        padding: "2px",
                      }}
                    >
                      <EditNoteOutlinedIcon
                        sx={{ fontSize: "22px", color: "orange" }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "14px" }}>
                        Recurring expense created for
                        {recurringExpense.total_formatted ||
                          `₹${formatCurrency(recurringExpense.total || 0)}`}
                      </Typography>
                      <Typography sx={{ fontSize: "13px", color: "gray" }}>
                        by {recurringExpense.created_by || "System user"}
                      </Typography>
                    </Box>
                  </Box>

                  {recurringExpense.last_expense_id && (
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Typography
                        sx={{ fontSize: "13px", color: "gray", width: "140px" }}
                      >
                        {new Date(
                          recurringExpense.last_expense_date || new Date()
                        ).toLocaleString()}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mr: 1,
                          border: "1px solid #ccc",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                      >
                        <EditNoteOutlinedIcon
                          sx={{ fontSize: "20px", color: "orange" }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "14px" }}>
                          Expense Created for
                          {recurringExpense.amount_formatted ||
                            `₹${formatCurrency(recurringExpense.amount || 0)}`}
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: "gray" }}>
                          by {recurringExpense.created_by || "System user"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            router.push(
                              `/purchase/expenses/${recurringExpense.last_expense_id}`
                            )
                          }
                        >
                          <VisibilityOutlinedIcon
                            sx={{ fontSize: "15px", color: "#408dfb" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#408dfb",
                              ml: 0.5,
                            }}
                          >
                            View the expense
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };
  const BillSection = ({ recurringExpense }) => {
    const [childExpense, setChildExpense] = useState([]);
    useEffect(() => {
      console.log("its working when call", recurringExpense);
      if (recurringExpense) {
        getChildRecurring(recurringExpense);
      }
    }, [recurringExpense]);
    const getChildRecurring = async (RE_ID) => {
      try {
        let params = {
          url: `/api/v1/recurring-expense/get-recurring-expense-child?org_id=${org_id}&recurring_expense_id=${RE_ID}`,
          method: "GET",
          customBaseUrl: config.PO_Base_url,
        };
        let response = await apiService(params);
        if (response.statusCode == 200) {
          console.log(response.data.data);
          setChildExpense(response.data.data);
        }
      } catch (error) {
        console.log(error, "getChildRecurring error");
      }
    };
    return (
      <Box
        sx={{
          px: 2,
          mb: 6,
          boxShadow: "none !important",
          border: "2px solid #f9f9fb",
        }}
      >
        <TableContainer sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  // width="33%"
                  sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
                >
                  Date
                </TableCell>
                <TableCell
                  // width="33%"
                  // align="right"
                  sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
                >
                  Expense #
                </TableCell>

                <TableCell
                  // width="33%"
                  // align="right"
                  sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
                >
                  Status
                </TableCell>
                <TableCell
                  // width="33%"
                  // align="right"
                  sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
                >
                  Paid Through
                </TableCell>
                <TableCell
                  // width="33%"
                  // align="right"
                  sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
                >
                  Amount
                </TableCell>
                <TableCell
                  // width="33%"
                  // align="right"
                  sx={{ fontWeight: "600", color: "#6C718A", fontSize: "12px" }}
                >
                  Tax Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {childExpense &&
                childExpense.length &&
                childExpense.map((data) => (
                  <>
                    <TableRow
                      key={data._id}
                      hover
                      onClick={() =>
                        router.push(`/purchase/expense/${data.expense_number}`)
                      }
                    >
                      <TableCell
                        // align="right"
                        sx={{ borderBottom: "none", color: "black !important" }}
                      >
                        {new Date(data.date).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#408dfb !important",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                          
                        }}
                      >
                        {data.expense_number}
                      </TableCell>

                      <TableCell
                        // align="right"
                        sx={{ borderBottom: "none", color: "black !important" }}
                      >
                        {data.status === 0
                          ? "NON-BILLABLE"
                          : data.status === 1
                          ? "UNBILLED"
                          : data.status === 2
                          ? "INVOICED"
                          : data.status === 3
                          ? "REIMBURSED"
                          : "NON-BILLABLE"}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "black !important",
                        }}
                      >
                        {data.paid_through}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "black !important",
                        }}
                      >
                        ₹{formatCurrency(data.amount)}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "black !important",
                        }}
                      >
                        {formatCurrency(data.tax_amount)}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box
      sx={{ borderLeft: "1px solid #ddd", height: "90vh", overflowY: "auto" }}
    >
      {loading ? (
        <>
          <HeaderSkeleton />
          <MiddleContentSkeleton />
          {/* <BillSectionSkeleton /> */}
        </>
      ) : (
        <>
          <Header />
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

export default RecurringExpenseViewComponent;
