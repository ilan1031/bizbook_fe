"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import apiService from "../../services/axiosService";
import config from "../../services/config";
import { useRouter } from "next/navigation";
import DownloadPDFReceivable from "./DownloadPDFReceivable.js";
import DownloadPDFPayable from "./DownloadPDFPayables.js";
import { green } from "@mui/material/colors";
import { ArrowBigDown, ArrowBigUp, TrendingDown } from "lucide-react";
import { TrendingUp } from "@mui/icons-material";

// Complete dashboard with Flexbox layout
const Dashboard = () => {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [view, setView] = useState("accrual");
  const [receivablesData, setReceivablesData] = useState();
  const [payablesData, setPayablesData] = useState();
  const [billsData, setBillsData] = useState({
    total: 0,
    current: 0,
    overdue: 0,
    loading: true,
  });
  const [invoicesData, setInvoicesData] = useState({
    total: 0,
    current: 0,
    overdue: 0,
    loading: true,
  });
  const [expensesData, setExpensesData] = useState({
    fuelMileageExpenses: 0,
    costOfGoodsSold: 0,
    otherExpenses: 0,
    totalExpenses: 0,
    loading: true,
  });
  const getBarWidth = (amount) => {
    if (totalExpenses === 0) return 0;
    return (amount / totalExpenses) * 100;
  };
  const {
    costOfGoodsSold,
    fuelMileageExpenses,
    otherExpenses,
    totalExpenses,
    loading,
  } = expensesData;

  const getPercentage = (amount) => {
    if (totalExpenses === 0) return 0;
    return (amount / totalExpenses) * 100;
  };

  const expenseCategories = [
    {
      name: "Cost of Goods Sold",
      amount: costOfGoodsSold,
      color: "#1de9b6",
      percentage: getPercentage(costOfGoodsSold),
    },
    {
      name: "Fuel/Mileage Expenses",
      amount: fuelMileageExpenses,
      color: "#ff9800",
      percentage: getPercentage(fuelMileageExpenses),
    },
    {
      name: "Other Expenses",
      amount: otherExpenses,
      color: "#e91e63",
      percentage: getPercentage(otherExpenses),
    },
  ];
  // Animation states
  const [animatedMonths, setAnimatedMonths] = useState([]);
  const [donutPercentage, setDonutPercentage] = useState(0);
  const [legendOpacity, setLegendOpacity] = useState(0);
  const [userName, setUserName] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };
  // Data for the bar chart
  const months = [
    { name: "Apr", year: "2024", income: 10, expense: 8 },
    { name: "May", year: "2024", income: 15, expense: 10 },
    { name: "Jun", year: "2024", income: 20, expense: 15 },
    { name: "Jul", year: "2024", income: 25, expense: 22 },
    { name: "Aug", year: "2024", income: 15, expense: 12 },
    { name: "Sep", year: "2024", income: 30, expense: 25 },
    { name: "Oct", year: "2024", income: 20, expense: 15 },
    { name: "Nov", year: "2024", income: 25, expense: 20 },
    { name: "Dec", year: "2024", income: 35, expense: 28 },
    { name: "Jan", year: "2025", income: 40, expense: 30 },
    { name: "Feb", year: "2025", income: 45, expense: 35 },
    { name: "Mar", year: "2025", income: 70, expense: 250 },
  ];
  // Find max value for scaling
  const maxValue = Math.max(
    ...months.map((month) => Math.max(month.income, month.expense))
  );
  // Animation for the bar chart
  useEffect(() => {
    // Initialize with zero values
    setAnimatedMonths(
      months.map((month) => ({ ...month, income: 0, expense: 0 }))
    );
    let userName = localStorage.getItem("user_name");
    userName ? setUserName(userName) : setUserName("");
    // Delay before starting animation
    const initialDelay = 500;

    const timeout = setTimeout(() => {
      // Animate each month's data one by one
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex >= months.length) {
          clearInterval(interval);
          // After all bars are animated, fade in the legend
          setTimeout(() => {
            setLegendOpacity(1);
          }, 200);
          return;
        }

        setAnimatedMonths((prevMonths) => {
          return prevMonths.map((month, index) => {
            if (index <= currentIndex) {
              // Gradually update the values
              return {
                ...month,
                income: months[index].income,
                expense: months[index].expense,
              };
            }
            return month;
          });
        });

        currentIndex++;
      }, 100); // Animate each bar with 100ms interval

      return () => {
        clearInterval(interval);
      };
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  // Animation for the donut chart
  useEffect(() => {
    const initialDelay = 1000;
    const animationDuration = 1500;

    const timeout = setTimeout(() => {
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        setDonutPercentage(progress * 100);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  // Fetch bills data from API
  useEffect(() => {
    const fetchBillsData = async () => {
      try {
        const organisation_id = localStorage.getItem("organization_id") || "1"; // Fallback value

        const response = await apiService({
          method: "GET",
          url: `api/v1/bills/get-bills?org_id=${organisation_id}`,
          customBaseUrl: config.PO_Base_url,
        });
        // Based on your response structure
        const bills = response.data.data; // Access the 'data' array inside the response

        // Calculate totals based on API response
        let totalAmount = 0;
        let totalAmountPaid = 0; // Sum of all "amount" fields

        if (Array.isArray(bills) && bills.length > 0) {
          bills.forEach((bill) => {
            const totals = parseFloat(bill.totals || 0);
            const amount = parseFloat(bill.amount || 0);

            // Exclude "DRAFT" status from calculations
            if (bill.status_type !== "DRAFT") {
              // Add to total amount (sum of all "totals")
              totalAmount += totals;

              // Add to total amount paid (sum of all "amount")
              totalAmountPaid += amount;
            }
          });
        }

        // Calculate based on your logic:
        // total = sum of all "totals"
        // current = total - totalAmountPaid (totals - amount)
        // overdue = total - current
        const currentAmount = totalAmount - totalAmountPaid;
        const overdueAmount = totalAmount - currentAmount;

        setBillsData({
          total: totalAmount,
          current: currentAmount,
          overdue: overdueAmount,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching bills data:", error);
        setBillsData({
          total: 0,
          current: 0,
          overdue: 0,
          loading: false,
        });
      }
    };

    fetchBillsData();
  }, []);
  // useEffect for fetching invoice data
  useEffect(() => {
    const fetchInvoicesData = async () => {
      try {
        const organisation_id =
          localStorage.getItem("organization_id") || "100000";

        const response = await apiService({
          method: "GET",
          url: `api/v1/invoices?organization_id=${organisation_id}`,
          customBaseUrl: config.PO_Base_url,
        });

        const invoices = response.data.invoices || response.data;

        let totalAmount = 0;
        let totalAmountPaid = 0; // Sum of all paid amounts

        if (Array.isArray(invoices) && invoices.length > 0) {
          invoices.forEach((invoice) => {
            const total = parseFloat(invoice.total || 0);
            const paidAmount = parseFloat(
              invoice.balance || invoice.amount_paid || 0
            ); // Adjust field name as per your API response

            // Exclude "draft" from calculations
            if (invoice.status !== "draft") {
              // Add to total amount (sum of all "total")
              totalAmount += total;

              // Add to total amount paid
              totalAmountPaid += paidAmount;
            }
          });
        }

        // Calculate based on mathematical logic:
        // total = sum of all "total" (excluding drafts)
        // current = total - totalAmountPaid (total - paid amount)
        // overdue = total - current
        const currentAmount = totalAmount - totalAmountPaid;
        const overdueAmount = totalAmount - currentAmount;

        setInvoicesData({
          total: totalAmount,
          current: currentAmount,
          overdue: overdueAmount,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching invoices data:", error);
        setInvoicesData({
          total: 0,
          current: 0,
          overdue: 0,
          loading: false,
        });
      }
    };

    fetchInvoicesData();
  }, []);

  // useEffect for fetching expense data
  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        const organisation_id =
          localStorage.getItem("organization_id") || "100000";

        const response = await apiService({
          method: "GET",
          url: `api/v1/expense/get-expense?org_id=${organisation_id}&page=1&limit=10&per_page=10&sort_column=vendor_name&sort_order=D&filter=Status.All`,
          customBaseUrl: config.PO_Base_url,
        });

        const expenses =
          response.data.data || response.data.expenses || response.data;

        let fuelMileageTotal = 0;
        let costOfGoodsTotal = 0;
        let otherExpensesTotal = 0;

        if (Array.isArray(expenses) && expenses.length > 0) {
          expenses.forEach((expense) => {
            const amount = parseFloat(expense.amount || 0);
            const accountName = expense.account_name || "";

            if (accountName.includes("Fuel/Mileage Expenses")) {
              fuelMileageTotal += amount;
            } else if (accountName.includes("Cost of Goods Sold")) {
              costOfGoodsTotal += amount;
            } else if (accountName.includes("Other Expenses")) {
              otherExpensesTotal += amount;
            }
          });
        }

        const totalExpenses =
          fuelMileageTotal + costOfGoodsTotal + otherExpensesTotal;

        setExpensesData({
          fuelMileageExpenses: fuelMileageTotal,
          costOfGoodsSold: costOfGoodsTotal,
          otherExpenses: otherExpensesTotal,
          totalExpenses: totalExpenses,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching expenses data:", error);
        setExpensesData({
          fuelMileageExpenses: 0,
          costOfGoodsSold: 0,
          otherExpenses: 0,
          totalExpenses: 0,
          loading: false,
        });
      }
    };

    fetchExpensesData();
  }, []);

  useEffect(() => {
    const fetchReceivable = async () => {
      try {
        const org_id = localStorage.getItem("organization_id");

        const response = await apiService({
          method: "GET",
          url: `/api/v1/kpi/get-receivables?org_id=${org_id}`,
        });

        console.log(response.data.data, "Response for the receivables");
        setReceivablesData(response.data.data);
      } catch (error) {
        console.log(error, "Error in Fetching Reports for the receivables");
      }
    };

    const fetchPayables = async () => {
      try {
        const org_id = localStorage.getItem("organization_id");

        const response = await apiService({
          method: "GET",
          url: `/api/v1/kpi/get-payable?org_id=${org_id}`,
        });
        console.log(response.data.data, "Response for the payables");
        setPayablesData(response.data.data);
      } catch (error) {
        console.log(error, "Error in Fetching Reports for the payables");
      }
    };

    fetchReceivable();
    fetchPayables();
  }, []);

  // Helper function to calculate donut chart percentage
  const getDonutPercentage = () => {
    if (expensesData.totalExpenses === 0) return 0;
    // You can calculate based on the highest category or total
    return (expensesData.costOfGoodsSold / expensesData.totalExpenses) * 100;
  };
  // Format currency
  const formatCurrency = (amount) => {
    return `₹ ${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  // Calculate progress percentage for the LinearProgress
  const getProgressPercentage = () => {
    if (billsData.total === 0) return 0;
    return (billsData.current / billsData.total) * 100;
  };
  // Calculate progress percentage for the LinearProgress
  const getInvoiceProgressPercentage = () => {
    if (invoicesData.total === 0) return 0;
    return (invoicesData.current / invoicesData.total) * 100;
  };
  // Create conic gradient for the donut chart
  const getConicGradient = () => {
    if (totalExpenses === 0) return "conic-gradient(#f5f5f5 0deg 360deg)";

    let currentAngle = 0;
    let gradientString = "conic-gradient(";

    expenseCategories.forEach((category, index) => {
      const angle = (category.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      if (index > 0) gradientString += ", ";
      gradientString += `${category.color} ${startAngle}deg ${endAngle}deg`;

      currentAngle += angle;
    });

    gradientString += ")";
    return gradientString;
  };

  const profitLoss = invoicesData.total - billsData.total - totalExpenses;

  return (
    <Box>
      <Box
        sx={{
          backgroundImage: 'url("/BgImg1.jpg")',
          backgroundRepeat: "repeat-x",
        }}
      >
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ minHeight: "60px" }}>
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Box
                component="div"
                sx={{
                  border: "1px solid #ebeaf2",
                  p: 1,
                  backgroundColor: "white",
                  borderRadius: 2,
                  mr: 2,
                  px: 1.2,
                }}
              >
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  <HomeWorkOutlinedIcon fontSize="small" />
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "18px", fontWeight: "500" }}
                >
                  Hello, {userName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "13px", color: "#666" }}
                >
                  {userName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 1.5 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "15px",
                minHeight: "48px",
                py: 1,
              },
              "& .Mui-selected": {
                fontWeight: "400",
                color: "text.primary !important",
              },
              "& .MuiTabs-indicator": {
                height: "3px",
                backgroundColor: "#2196f3 !important",
              },
            }}
          >
            <Tab label="Dashboard" sx={{ ml: 2 }} iconPosition="start" />
            <Box sx={{ flexGrow: 1 }} />
          </Tabs>
        </Box>
      </Box>

      {/* Main Content - Using Flexbox */}
      <Box
        sx={{ mt: 3, ml: 3, display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Row 1: Receivables and Payables */}
        <Box sx={{ display: "flex", gap: 3, width: "95%" }}>
          {/* Receivables Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "18px", fontWeight: "medium" }}
              >
                Total Receivables
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DownloadPDFReceivable data={receivablesData} />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => router.push("/sales/invoices/new")}
                  startIcon={<AddIcon />}
                  sx={{
                    color: "#2196f3",
                    borderColor: "#2196f3",
                    textTransform: "none",
                    fontSize: "13px",
                    p: "2px 8px",
                    minWidth: "60px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  New
                </Button>
              </Box>
            </Box>

            <Box sx={{ px: 3, py: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  mb: 1,
                  cursor: "pointer",
                  // color: "primary.main",
                  // textDecoration: "underline",
                }}
                onClick={() => router.push("/common/totalReceivables")}
              >
                Total Invoice Amount {formatCurrency(invoicesData.total)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getInvoiceProgressPercentage()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#f5f5f5",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#FFC107",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  flex: 1,
                  px: 3,
                  py: 2,
                  borderTop: "1px solid #e0e0e0",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "12px",
                    color: "#42a5f5",
                    fontWeight: "medium",
                  }}
                >
                  {/* CURRENT */}
                  RECEIVED
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" }}>
                  {formatCurrency(invoicesData.current)}
                </Typography>
              </Box>
              <Box
                sx={{ flex: 1, px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "12px",
                    color: "#f44336",
                    fontWeight: "medium",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  OVERDUE
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" }}>
                  {formatCurrency(invoicesData.overdue)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Payables Card - Updated with Dynamic Data */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "18px", fontWeight: "medium" }}
              >
                Total Payables
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DownloadPDFPayable data={payablesData} />
                <Button
                  variant="outlined"
                  onClick={() => router.push("/purchase/bills/create")}
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{
                    borderColor: "#2196f3",
                    color: "#2196f3",
                    textTransform: "none",
                    fontSize: "13px",
                    p: "2px 8px",
                    minWidth: "60px",
                  }}
                >
                  New
                </Button>
              </Box>
            </Box>

            <Box sx={{ px: 3, py: 2 }}>
              {billsData.loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "14px", mb: 1, cursor: "pointer" }}
                    onClick={() => router.push("/common/totalPayabale")}
                  >
                    Total Bill Amount {formatCurrency(billsData.total)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage()}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#2196f3",
                      },
                    }}
                  />
                </>
              )}
            </Box>

            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  flex: 1,
                  px: 3,
                  py: 2,
                  borderTop: "1px solid #e0e0e0",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "12px",
                    color: "#42a5f5",
                    fontWeight: "medium",
                  }}
                >
                  {/* CURRENT */}
                  PAID
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" }}>
                  {billsData.loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    formatCurrency(billsData.current)
                  )}
                </Typography>
              </Box>
              <Box
                sx={{ flex: 1, px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "12px",
                    color: "#f44336",
                    fontWeight: "medium",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  OVERDUE
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" }}>
                  {billsData.loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    formatCurrency(billsData.overdue)
                  )}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Profit & Loss - Updated with Dynamic Data */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "18px", fontWeight: "medium", py: 1.3 }}
              >
                Profit & Loss
              </Typography>
            </Box>

            {/*Total Invoice Amount*/}

            <Box sx={{ px: 3, pt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pb: 1.5,
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "15px" }}>
                  Total Receivables
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "#42a5f5" }}>
                  {formatCurrency(invoicesData.total)}
                </Typography>
              </Box>

              <Box
                sx={{
                  pb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "15px" }}>
                  Total Payables
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "#f44336" }}>
                  {formatCurrency(billsData.total)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pb: 1.5,
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "15px" }}>Total Expense</Typography>
                <Typography sx={{ fontSize: "15px", color: "#f44336" }}>
                  {formatCurrency(totalExpenses)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid #e0e0e0",
                  py: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: profitLoss >= 0 ? "green" : "red",
                  }}
                >
                  {profitLoss >= 0 ? (
                    <>
                      <span>Profit</span>
                      <TrendingUp
                        className="text-green-600"
                        style={{ marginTop: "10px" }}
                      />
                    </>
                  ) : (
                    <>
                      <span>Loss</span>
                      <TrendingDown
                        className="text-red-600"
                        style={{ marginTop: "10px" }}
                      />
                    </>
                  )}
                </Typography>
                <Typography
                  sx={{ fontWeight: "700", fontSize: "16px" }}
                  variant="h6"
                >
                  {formatCurrency(profitLoss)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Row 2: Charts - Using Flexbox */}
        <Box sx={{ display: "flex", gap: 3.2, width: "62.5%", mb: 2 }}>
          {/* Income and Expense Chart */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e0e0e0",
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "16px", fontWeight: "medium" }}
              >
                Income and Expense
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#2196f3",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  This Fiscal Year <KeyboardArrowDownIcon fontSize="small" />
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                  sx={{
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      mx: 0.5,
                      textTransform: "none",
                      fontSize: "12px",
                      py: 0.5,
                      px: 1.5,
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#f5f5f5 !important",
                      color: "text.primary",
                      fontWeight: "medium",
                    },
                  }}
                >
                  {/* <ToggleButton value="accrual">Accrual</ToggleButton> */}
                  {/* <ToggleButton value="cash">Cash</ToggleButton> */}
                </ToggleButtonGroup>
              </Box>

              {/* Professional chart area with fixed container height */}

              <Box sx={{ height: 200, position: "relative", mb: 4 }}>
                {/*The Overlay*/}

                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(255, 255, 255, 0.8)", // semi-transparent white
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(2px)", // optional blur effect
                  }}
                ></Box>

                {/* Y-axis labels - positioned proportionally within the fixed height */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pr: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontSize: "10px" }}
                  >
                    250 K
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontSize: "10px" }}
                  >
                    200 K
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontSize: "10px" }}
                  >
                    150 K
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontSize: "10px" }}
                  >
                    100 K
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontSize: "10px" }}
                  >
                    50 K
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontSize: "10px" }}
                  >
                    0
                  </Typography>
                </Box>

                {/* Chart drawing area - always extends from top to bottom of container */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 40,
                    right: 0,
                    top: 0,
                    bottom: 20,
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {animatedMonths.map((month, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      {/* Income bar - height is percentage of available vertical space */}
                      <Box
                        sx={{
                          width: 8,
                          height: `${(month.income / maxValue) * 100}%`,
                          backgroundColor: "#4CAF50",
                          position: "absolute",
                          bottom: 0,
                          left: "calc(50% - 10px)",
                          borderRadius: "2px 2px 0 0",
                          transition: "height 0.5s ease-out", // Smoother transition
                        }}
                      />

                      {/* Expense bar - height is percentage of available vertical space */}
                      <Box
                        sx={{
                          width: 8,
                          height: `${(month.expense / maxValue) * 100}%`,
                          backgroundColor: "#FF5722",
                          position: "absolute",
                          bottom: 0,
                          left: "calc(50% + 2px)",
                          borderRadius: "2px 2px 0 0",
                          transition: "height 0.5s ease-out", // Smoother transition
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* X-axis labels - always positioned at the bottom */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 40,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                  }}
                >
                  {months.map((month, index) => (
                    <Box key={index} sx={{ flex: 1, textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "9px",
                          color: "#666",
                          display: "block",
                        }}
                      >
                        {month.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "9px",
                          color: "#666",
                          display: "block",
                        }}
                      >
                        {month.year}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Horizontal grid lines for better readability */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 40,
                    right: 0,
                    top: 0,
                    bottom: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pointerEvents: "none",
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <Box
                      key={line}
                      sx={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: line === 5 ? "transparent" : "#f0f0f0",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Legend and totals */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: legendOpacity,
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 1,
                        bgcolor: "#4CAF50",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "13px" }}>
                      Income
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 1,
                        bgcolor: "#FF5722",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "13px" }}>
                      Expense
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", color: "#4CAF50" }}
                    >
                      Total Income
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: "18px", fontWeight: "medium" }}
                    >
                      {formatCurrency(invoicesData.total)}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", color: "#FF5722" }}
                    >
                      Total Expenses
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: "18px", fontWeight: "medium" }}
                    >
                      {formatCurrency(totalExpenses)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontSize: "11px",
                  color: "#666",
                  display: "block",
                  mt: 1,
                }}
              >
                * Income and expense values displayed are exclusive of taxes.
              </Typography>
            </Box>
          </Paper>

          {/* Top Expenses Chart */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
              width: "500px",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e0e0e0",
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "16px", fontWeight: "medium" }}
              >
                Top Expenses
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#2196f3",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  This Fiscal Year <KeyboardArrowDownIcon fontSize="small" />
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "370px",
              }}
            >
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                <>
                  {/* Donut Chart with Color Segments */}
                  <Box
                    sx={{
                      position: "relative",
                      width: 200,
                      height: 200,
                      mb: 3,
                    }}
                  >
                    {/* The donut with multi-color segments */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        background: getConicGradient(),
                        transform: "rotate(-90deg)", // Start from top
                        transition: "background 0.8s ease-out",
                      }}
                    />

                    {/* The inner circle (to create the donut hole) */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60%",
                        height: "60%",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          color: "#666",
                          textAlign: "center",
                        }}
                      >
                        TOP EXPENSES
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#333",
                          mt: 0.5,
                        }}
                      >
                        {formatCurrency(totalExpenses)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Legend with all categories */}
                  <Box sx={{ width: "100%", maxWidth: 300 }}>
                    {expenseCategories.map((category, index) => (
                      <Box
                        key={category.name}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1.5,
                          opacity: 1,
                          transition: "opacity 0.5s ease-in-out",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 1,
                              bgcolor: category.color,
                              mr: 1.5,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              color: "#333",
                            }}
                          >
                            {category.name}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            {formatCurrency(category.amount)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "12px", color: "#666" }}
                          >
                            {category.percentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                    {/* Total Section */}
                    <Box
                      sx={{
                        pt: 2,
                        mt: 2,
                        borderTop: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        Total Expenses
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#1976d2",
                        }}
                      >
                        {formatCurrency(totalExpenses)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
