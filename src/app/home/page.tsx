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
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import apiService from "../../services/axiosService";
import config from "../../services/config";
import { useRouter } from "next/navigation";
import DownloadPDFReceivable from "./DownloadPDFReceivable";
import DownloadPDFPayable from "./DownloadPDFPayables";
import { green } from "@mui/material/colors";
import { ArrowBigDown, ArrowBigUp, TrendingDown } from "lucide-react";
import { TrendingUp } from "@mui/icons-material";
import { usePermissions } from "../../services/PermissionProvider";

// The organisation being worked in, or null when none is chosen (a new user
// before setup, or a bad value in storage). Calls that need one are skipped.
const currentOrgId = () => {
  const v = typeof window !== "undefined" ? localStorage.getItem("organization_id") : null;
  return /^\d+$/.test(String(v || "")) ? v : null;
};

// Fiscal years run 1 April - 31 March. offset 0 = this one, -1 = the last one.
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PERIODS = [
  { key: "this", label: "This Fiscal Year", offset: 0 },
  { key: "last", label: "Previous Fiscal Year", offset: -1 },
];
const pad2 = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const fiscalYear = (offset = 0) => {
  const now = new Date();
  const startYear = (now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1) + offset;
  const start = new Date(startYear, 3, 1);
  const end = new Date(startYear + 1, 2, 31);
  return { start, end: end > now ? now : end };
};
// Months of a fiscal year up to today: [{ name, year, from, to }]
const fiscalMonths = (offset = 0) => {
  const { start, end } = fiscalYear(offset);
  const out: any[] = [];
  for (let d = new Date(start); d <= end; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    out.push({ name: MONTH_NAMES[d.getMonth()], year: String(d.getFullYear()), from: ymd(d), to: ymd(last > end ? end : last) });
  }
  return out;
};
const compactAmount = (n) => {
  const v = Math.abs(n);
  if (v >= 1e7) return `${(n / 1e7).toFixed(1).replace(/\.0$/, "")} Cr`;
  if (v >= 1e5) return `${(n / 1e5).toFixed(1).replace(/\.0$/, "")} L`;
  if (v >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")} K`;
  return String(Math.round(n));
};

function PeriodPicker({ value, onChange }: any) {
  const [anchor, setAnchor] = useState<any>(null);
  const current = PERIODS.find((p) => p.key === value) || PERIODS[0];
  return (
    <>
      <Typography
        variant="body2"
        role="button"
        aria-haspopup="menu"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ color: "#2196f3", fontSize: "13px", display: "flex" as const, alignItems: "center" as const, cursor: "pointer" as const }}
      >
        {current.label} <KeyboardArrowDownIcon fontSize="small" />
      </Typography>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {PERIODS.map((p) => (
          <MenuItem
            key={p.key}
            selected={p.key === value}
            onClick={() => {
              setAnchor(null);
              onChange(p.key);
            }}
          >
            {p.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// Complete dashboard with Flexbox layout
const Dashboard = (_props?: any) => {
  const perms = usePermissions();
  const router = useRouter();
  const [value, setValue] = useState<number>(0);
  const [view, setView] = useState<string>("accrual");
  const [receivablesData, setReceivablesData] = useState();
  const [payablesData, setPayablesData] = useState();
  const [billsData, setBillsData] = useState<any>({
    total: 0,
    current: 0,
    overdue: 0,
    loading: true,
  });
  const [invoicesData, setInvoicesData] = useState<any>({
    total: 0,
    current: 0,
    overdue: 0,
    loading: true,
  });
  const [expensesData, setExpensesData] = useState<any>({
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
  const [animatedMonths, setAnimatedMonths] = useState<any>([]);
  const [donutPercentage, setDonutPercentage] = useState<number>(0);
  const [legendOpacity, setLegendOpacity] = useState<number>(0);
  const [userName, setUserName] = useState<any>("");
  const [orgName, setOrgName] = useState<any>("");
  const [hasOrg, setHasOrg] = useState<boolean>(true);
  useEffect(() => {
    const orgId = currentOrgId();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasOrg(Boolean(orgId));
    if (!orgId) return;
    apiService({ method: "POST", url: "api/v1/org/get-organisation" })
      .then((res) => {
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setOrgName(list.find((o) => String(o.organization_id) === String(orgId))?.org_name || "");
      })
      .catch(() => {});
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };
  // Income and Expense card: this organisation's P&L, month by month, for
  // the chosen fiscal year (income and expenses exclude taxes).
  const [incomePeriod, setIncomePeriod] = useState<string>("this");
  const [months, setMonths] = useState(() => fiscalMonths(0).map((m) => ({ ...m, income: 0, expense: 0 })));
  const [incomeTotals, setIncomeTotals] = useState<any>({ income: 0, expense: 0, loading: true });
  useEffect(() => {
    let userName = localStorage.getItem("user_name");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    userName ? setUserName(userName) : setUserName("");
    setLegendOpacity(1);
  }, []);
  useEffect(() => {
    const orgId = currentOrgId();
    const list = fiscalMonths(PERIODS.find((p) => p.key === incomePeriod)?.offset || 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMonths(list.map((m) => ({ ...m, income: 0, expense: 0 })));
    setAnimatedMonths(list.map((m) => ({ ...m, income: 0, expense: 0 })));
    if (!perms?.me || !orgId || !perms.can("profitAndLoss", "view")) {
      setIncomeTotals({ income: 0, expense: 0, loading: false });
      return;
    }
    let cancelled = false;
    setIncomeTotals((t) => ({ ...t, loading: true }));
    // One request for the whole year, bucketed by month on the server (it used
    // to be one request per month).
    apiService({
      method: "GET",
      url: `api/v1/reports/profit-loss/bill-invoice/monthly?organization_id=${orgId}&from=${list[0].from}&to=${list[list.length - 1].to}`,
    })
      .then((res) => res.data?.data?.months || {})
      .catch(() => ({}))
      .then((monthSummaries) => {
      if (cancelled) return;
      const rows = list.map((m) => {
        const sm = monthSummaries[m.from.slice(0, 7)] || {};
        return {
          ...m,
          income: Number(sm.operatingIncome) || 0,
          expense: (Number(sm.costOfGoodsSold) || 0) + (Number(sm.operatingExpenses) || 0),
        };
      });
      setMonths(rows);
      setAnimatedMonths(rows);
      setIncomeTotals({
        income: rows.reduce((s, r) => s + r.income, 0),
        expense: rows.reduce((s, r) => s + r.expense, 0),
        loading: false,
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perms?.me, incomePeriod]);
  // Scale: the largest month, rounded up to a tidy number.
  const rawMax = Math.max(0, ...months.map((month) => Math.max(month.income, month.expense)));
  const maxValue = (() => {
    if (rawMax <= 0) return 100;
    const p = Math.pow(10, Math.floor(Math.log10(rawMax)));
    return Math.ceil(rawMax / p) * p;
  })();
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
  // Profit & loss card: this financial year (from 1 April) from the P&L report.
  const [pnl, setPnl] = useState<any>({ income: 0, cogs: 0, expenses: 0, net: 0, loading: true });
  useEffect(() => {
    if (!perms?.me) return;
    if (!perms.can("profitAndLoss", "view") || !currentOrgId()) {
      setPnl({ income: 0, cogs: 0, expenses: 0, net: 0, loading: false, hidden: true });
      return;
    }
    const now = new Date();
    const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    const pad = (n) => String(n).padStart(2, "0");
    const from = `${fyStartYear}-04-01`;
    const to = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    apiService({
      method: "GET",
      url: `api/v1/reports/profit-loss/bill-invoice?organization_id=${localStorage.getItem("organization_id")}&from=${from}&to=${to}`,
    })
      .then((res) => {
        const sm = res.data?.data?.summary || {};
        setPnl({
          income: Number(sm.operatingIncome) || 0,
          cogs: Number(sm.costOfGoodsSold) || 0,
          expenses: Number(sm.operatingExpenses) || 0,
          net: Number(sm.netProfitLoss) || 0,
          loading: false,
        });
      })
      .catch(() => setPnl({ income: 0, cogs: 0, expenses: 0, net: 0, loading: false }));
  }, [perms?.me]);

  // Receivables and payables cards: totals of unpaid invoices and bills,
  // split into current and overdue, computed by the server over all records.
  useEffect(() => {
    const empty = { total: 0, current: 0, overdue: 0, loading: false };
    const canInvoices = perms?.can("invoices", "view");
    const canBills = perms?.can("bills", "view");
    if (!perms?.me || (!canInvoices && !canBills) || !currentOrgId()) {
      setInvoicesData(empty);
      setBillsData(empty);
      return;
    }
    const fetchSummary = async () => {
      try {
        const orgId = localStorage.getItem("organization_id");
        const response = await apiService({
          method: "GET",
          url: `api/v1/kpi/summary?org_id=${orgId}`,
        });
        const { receivables, payables } = response.data?.data || {};
        setInvoicesData(canInvoices && receivables ? { ...receivables, loading: false } : empty);
        setBillsData(canBills && payables ? { ...payables, loading: false } : empty);
      } catch (error) {
        setInvoicesData(empty);
        setBillsData(empty);
      }
    };
    fetchSummary();
  }, [perms?.me]);

  // useEffect for fetching expense data
  const [expensePeriod, setExpensePeriod] = useState<string>("this");
  useEffect(() => {
    const fetchExpensesData = async () => {
      // Skip sections this user may not view (the server would refuse them).
      if (!perms?.can("expenses", "view") || !currentOrgId()) {
        setExpensesData({fuelMileageExpenses: 0, costOfGoodsSold: 0, otherExpenses: 0, totalExpenses: 0, loading: false,});
        return;
      }
      try {
        const organisation_id = currentOrgId();
        // All of the period's expenses, a page at a time.
        const { start, end } = fiscalYear(PERIODS.find((p) => p.key === expensePeriod)?.offset || 0);
        const startDay = ymd(start);
        const endDay = ymd(end);
        let all: any[] = [];
        for (let page = 1; page <= 20; page++) {
          const response = await apiService({
            method: "GET",
            url: `api/v1/expense/get-expense?org_id=${organisation_id}&page=${page}&limit=200&per_page=200&sort_column=vendor_name&sort_order=D&filter=Status.All`,
            customBaseUrl: config.PO_Base_url,
          });
          const rows = response.data.data || response.data.expenses || response.data;
          if (!Array.isArray(rows) || !rows.length) break;
          all = all.concat(rows);
          if (rows.length < 200) break;
        }
        const inPeriod = (e) => {
          const raw = e.date || e.expense_date || e.createdAt;
          if (!raw) return true;
          const s = String(raw);
          const m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
          const day = m ? `${m[3]}-${m[2]}-${m[1]}` : s.slice(0, 10);
          return day >= startDay && day <= endDay;
        };
        const expenses = all.filter(inPeriod);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perms?.me, expensePeriod]);

  useEffect(() => {
    if (!currentOrgId()) return;
    const fetchReceivable = async () => {
      try {
        const org_id = currentOrgId();

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
        const org_id = currentOrgId();

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

  const profitLoss = pnl.net;

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
            <Box sx={{ display: "flex" as const, alignItems: "center" as const, mr: 2 }}>
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
                  sx={{ fontSize: "18px", fontWeight: "500" as const }}
                >
                  Hello, {userName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "13px", color: "#666" }}
                >
                  {orgName}
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
                textTransform: "none" as const,
                fontSize: "15px",
                minHeight: "48px",
                py: 1,
              },
              "& .Mui-selected": {
                fontWeight: "400" as const,
                color: "text.primary !important",
              },
              "& .MuiTabs-indicator": {
                height: "3px",
                backgroundColor: "#2196f3 !important",
              },
            }}
          >
            <Tab label="Dashboard" sx={{ ml: 2 }} iconPosition="start" />
          </Tabs>
        </Box>
      </Box>

      {/* Main Content - Using Flexbox */}
      <Box
        sx={{ mt: 3, ml: 3, display: "flex" as const, flexDirection: "column" as const, gap: 3 }}
      >
        {!hasOrg && (
          <Alert
            severity="info"
            sx={{ width: "95%" }}
            action={
              <Button color="inherit" size="small" onClick={() => router.push("/organisation/organisationsetuppage")}>
                Set up organisation
              </Button>
            }
          >
            No organisation is selected yet. Create your organisation (or choose one from the organisation list) to see its figures here.
          </Alert>
        )}
        {/* Row 1: Receivables and Payables */}
        <Box sx={{ display: "flex" as const, gap: 3, width: "95%" }}>
          {/* Receivables Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden" as const,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "18px", fontWeight: "medium" as const }}
              >
                Total Receivables
              </Typography>

              <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1 }}>
                <DownloadPDFReceivable data={receivablesData} />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => router.push("/sales/invoices/new")}
                  startIcon={<AddIcon />}
                  sx={{
                    color: "#2196f3",
                    borderColor: "#2196f3",
                    textTransform: "none" as const,
                    fontSize: "13px",
                    p: "2px 8px",
                    minWidth: "60px",
                    display: "flex" as const,
                    alignItems: "center" as const,
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
                  cursor: "pointer" as const,
                  // color: "primary.main",
                  // textDecoration: "underline" as const,
                }}
                onClick={() => router.push("/common/totalReceivables")}
              >
                Total Unpaid Invoices {formatCurrency(invoicesData.total)}
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

            <Box sx={{ display: "flex" as const }}>
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
                    fontWeight: "medium" as const,
                  }}
                >
                  CURRENT
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" as const }}>
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
                    fontWeight: "medium" as const,
                    display: "flex" as const,
                    alignItems: "center" as const,
                  }}
                >
                  OVERDUE
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" as const }}>
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
              overflow: "hidden" as const,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "18px", fontWeight: "medium" as const }}
              >
                Total Payables
              </Typography>

              <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1 }}>
                <DownloadPDFPayable data={payablesData} />
                <Button
                  variant="outlined"
                  onClick={() => router.push("/purchase/bills/create")}
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{
                    borderColor: "#2196f3",
                    color: "#2196f3",
                    textTransform: "none" as const,
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
                <Box sx={{ display: "flex" as const, justifyContent: "center" as const, py: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "14px", mb: 1, cursor: "pointer" as const }}
                    onClick={() => router.push("/common/totalPayabale")}
                  >
                    Total Unpaid Bills {formatCurrency(billsData.total)}
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

            <Box sx={{ display: "flex" as const }}>
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
                    fontWeight: "medium" as const,
                  }}
                >
                  CURRENT
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" as const }}>
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
                    fontWeight: "medium" as const,
                    display: "flex" as const,
                    alignItems: "center" as const,
                  }}
                >
                  OVERDUE
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "medium" as const }}>
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
              overflow: "hidden" as const,
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "18px", fontWeight: "medium" as const, py: 1.3 }}
              >
                Profit & Loss <span style={{ fontSize: 12, color: "#64748b" }}>(this financial year)</span>
              </Typography>
            </Box>

            {/*Total Invoice Amount*/}

            <Box sx={{ px: 3, pt: 1 }}>
              <Box
                sx={{
                  display: "flex" as const,
                  alignItems: "center" as const,
                  pb: 1.5,
                  justifyContent: "space-between" as const,
                }}
              >
                <Typography sx={{ fontSize: "15px" }}>
                  Income
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "#42a5f5" }}>
                  {formatCurrency(pnl.income)}
                </Typography>
              </Box>

              <Box
                sx={{
                  pb: 1.5,
                  display: "flex" as const,
                  alignItems: "center" as const,
                  justifyContent: "space-between" as const,
                }}
              >
                <Typography sx={{ fontSize: "15px" }}>
                  Cost of Goods Sold
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "#f44336" }}>
                  {formatCurrency(pnl.cogs)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex" as const,
                  alignItems: "center" as const,
                  pb: 1.5,
                  justifyContent: "space-between" as const,
                }}
              >
                <Typography sx={{ fontSize: "15px" }}>Expenses</Typography>
                <Typography sx={{ fontSize: "15px", color: "#f44336" }}>
                  {formatCurrency(pnl.expenses)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex" as const,
                  alignItems: "center" as const,
                  justifyContent: "space-between" as const,
                  borderTop: "1px solid #e0e0e0",
                  py: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "800" as const,
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
                  sx={{ fontWeight: "700" as const, fontSize: "16px" }}
                  variant="h6"
                >
                  {formatCurrency(profitLoss)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Row 2: Charts - Using Flexbox */}
        <Box sx={{ display: "flex" as const, gap: 3.2, width: "62.5%", mb: 2 }}>
          {/* Income and Expense Chart */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden" as const,
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                borderBottom: "1px solid #e0e0e0",
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "16px", fontWeight: "medium" as const }}
              >
                Income and Expense
              </Typography>
              <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                <PeriodPicker value={incomePeriod} onChange={setIncomePeriod} />
              </Box>
            </Box>

            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex" as const, justifyContent: "center" as const, mb: 2 }}>
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
                      textTransform: "none" as const,
                      fontSize: "12px",
                      py: 0.5,
                      px: 1.5,
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#f5f5f5 !important",
                      color: "text.primary",
                      fontWeight: "medium" as const,
                    },
                  }}
                >
                  {/* <ToggleButton value="accrual">Accrual</ToggleButton> */}
                  {/* <ToggleButton value="cash">Cash</ToggleButton> */}
                </ToggleButtonGroup>
              </Box>

              {/* Professional chart area with fixed container height */}

              <Box sx={{ height: 200, position: "relative" as const, mb: 4 }}>

                {/* Y-axis labels - positioned proportionally within the fixed height */}
                <Box
                  sx={{
                    position: "absolute" as const,
                    left: 0,
                    top: 0,
                    bottom: 20,
                    display: "flex" as const,
                    flexDirection: "column" as const,
                    justifyContent: "space-between" as const,
                    pr: 1,
                  }}
                >
                  {[5, 4, 3, 2, 1, 0].map((step) => (
                    <Typography key={step} variant="caption" sx={{ color: "#666", fontSize: "10px" }}>
                      {compactAmount((maxValue * step) / 5)}
                    </Typography>
                  ))}
                </Box>

                {/* Chart drawing area - always extends from top to bottom of container */}
                <Box
                  sx={{
                    position: "absolute" as const,
                    left: 40,
                    right: 0,
                    top: 0,
                    bottom: 20,
                    display: "flex" as const,
                    alignItems: "flex-end" as const,
                  }}
                >
                  {animatedMonths.map((month, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        alignItems: "center" as const,
                        height: "100%",
                        position: "relative" as const,
                      }}
                    >
                      {/* Income bar - height is percentage of available vertical space */}
                      <Box
                        sx={{
                          width: 8,
                          height: `${(month.income / maxValue) * 100}%`,
                          backgroundColor: "#4CAF50",
                          position: "absolute" as const,
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
                          position: "absolute" as const,
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
                    position: "absolute" as const,
                    left: 40,
                    right: 0,
                    bottom: 0,
                    display: "flex" as const,
                  }}
                >
                  {months.map((month, index) => (
                    <Box key={index} sx={{ flex: 1, textAlign: "center" as const }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "9px",
                          color: "#666",
                          display: "block" as const,
                        }}
                      >
                        {month.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "9px",
                          color: "#666",
                          display: "block" as const,
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
                    position: "absolute" as const,
                    left: 40,
                    right: 0,
                    top: 0,
                    bottom: 20,
                    display: "flex" as const,
                    flexDirection: "column" as const,
                    justifyContent: "space-between" as const,
                    pointerEvents: "none" as const,
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
                  display: "flex" as const,
                  justifyContent: "space-between" as const,
                  opacity: legendOpacity,
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex" as const, alignItems: "center" as const, mb: 1 }}>
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
                  <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
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
                      sx={{ fontSize: "18px", fontWeight: "medium" as const }}
                    >
                      {formatCurrency(incomeTotals.income)}
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
                      sx={{ fontSize: "18px", fontWeight: "medium" as const }}
                    >
                      {formatCurrency(incomeTotals.expense)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontSize: "11px",
                  color: "#666",
                  display: "block" as const,
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
              overflow: "hidden" as const,
              width: "500px",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex" as const,
                justifyContent: "space-between" as const,
                alignItems: "center" as const,
                borderBottom: "1px solid #e0e0e0",
                bgcolor: "#f9f9fb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "16px", fontWeight: "medium" as const }}
              >
                Top Expenses
              </Typography>
              <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                <PeriodPicker value={expensePeriod} onChange={setExpensePeriod} />
              </Box>
            </Box>

            <Box
              sx={{
                p: 3,
                display: "flex" as const,
                flexDirection: "column" as const,
                justifyContent: "center" as const,
                alignItems: "center" as const,
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
                      position: "relative" as const,
                      width: 200,
                      height: 200,
                      mb: 3,
                    }}
                  >
                    {/* The donut with multi-color segments */}
                    <Box
                      sx={{
                        position: "absolute" as const,
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
                        position: "absolute" as const,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60%",
                        height: "60%",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex" as const,
                        flexDirection: "column" as const,
                        justifyContent: "center" as const,
                        alignItems: "center" as const,
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "10px",
                          fontWeight: "bold" as const,
                          textTransform: "uppercase" as const,
                          color: "#666",
                          textAlign: "center" as const,
                        }}
                      >
                        TOP EXPENSES
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold" as const,
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
                          display: "flex" as const,
                          justifyContent: "space-between" as const,
                          alignItems: "center" as const,
                          mb: 1.5,
                          opacity: 1,
                          transition: "opacity 0.5s ease-in-out",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex" as const,
                            alignItems: "center" as const,
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
                        <Box sx={{ textAlign: "right" as const }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              fontWeight: "bold" as const,
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
                        display: "flex" as const,
                        justifyContent: "space-between" as const,
                        alignItems: "center" as const,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold" as const,
                          color: "#333",
                        }}
                      >
                        Total Expenses
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold" as const,
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
