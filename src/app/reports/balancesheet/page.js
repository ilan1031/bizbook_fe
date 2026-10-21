"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import dayjs from "dayjs";
import apiService from "../../../services/axiosService";

// Accounting style: negatives in brackets.
const formatINR = (amount) => {
  const value = Number(amount || 0);
  const text = `₹${Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  return value < 0 ? `(${text})` : text;
};

const cellSx = { fontSize: "13px", borderBottom: "1px solid #f0f0f4" };

// `flat` skips the group's own heading and subtotal, for sections that only
// have one group of the same name (e.g. Equity).
function GroupRows({ group, flat }) {
  if (group.accounts.length === 0) return null;
  return (
    <>
      {!flat && (
        <TableRow>
          <TableCell colSpan={2} sx={{ ...cellSx, fontWeight: 600, pl: 3, pt: 1.5 }}>
            {group.title}
          </TableCell>
        </TableRow>
      )}
      {group.accounts.map((account) => (
        <TableRow key={account.account_id} hover>
          <TableCell sx={{ ...cellSx, pl: flat ? 3 : 5 }}>
            {account.computed ? (
              <Tooltip title="Calculated from your income and expense accounts">
                <span style={{ fontStyle: "italic" }}>{account.account_name}</span>
              </Tooltip>
            ) : (
              account.account_name
            )}
          </TableCell>
          <TableCell sx={cellSx} align="right">
            {formatINR(account.amount)}
          </TableCell>
        </TableRow>
      ))}
      {!flat && (
        <TableRow>
          <TableCell sx={{ ...cellSx, pl: 3, fontWeight: 600 }}>
            Total {group.title}
          </TableCell>
          <TableCell sx={{ ...cellSx, fontWeight: 600 }} align="right">
            {formatINR(group.total)}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function SectionRows({ title, groups, total, totalLabel }) {
  const hasAccounts = groups.some((g) => g.accounts.length > 0);
  const flat = groups.length === 1 && groups[0].title === title;
  return (
    <>
      <TableRow>
        <TableCell
          colSpan={2}
          sx={{ ...cellSx, fontWeight: 700, fontSize: "14px", bgcolor: "#f6f6fa", pt: 2 }}
        >
          {title}
        </TableCell>
      </TableRow>
      {hasAccounts ? (
        groups.map((g) => <GroupRows key={g.key} group={g} flat={flat} />)
      ) : (
        <TableRow>
          <TableCell colSpan={2} sx={{ ...cellSx, pl: 5, color: "#9a9db0" }}>
            No balances
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell sx={{ ...cellSx, fontWeight: 700 }}>{totalLabel}</TableCell>
        <TableCell sx={{ ...cellSx, fontWeight: 700 }} align="right">
          {formatINR(total)}
        </TableCell>
      </TableRow>
    </>
  );
}

export default function BalanceSheetPage() {
  const [orgId, setOrgId] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [asOf, setAsOf] = useState(dayjs().format("YYYY-MM-DD"));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setOrgId(localStorage.getItem("organization_id"));
  }, []);

  const runReport = useCallback(
    async (date) => {
      if (!orgId) return;
      setLoading(true);
      setError("");
      try {
        const res = await apiService({
          method: "GET",
          url: "/api/v1/reports/balance-sheet",
          params: { org_id: orgId, as_of: date },
        });
        setReport(res.data?.data || null);
      } catch (err) {
        setReport(null);
        setError(err?.message || "Couldn't generate the balance sheet");
      } finally {
        setLoading(false);
      }
    },
    [orgId]
  );

  useEffect(() => {
    if (!orgId) return;
    runReport(asOf);
    apiService({ method: "GET", url: `/api/v1/organization/${orgId}` })
      .then((res) => setOrgName(res.data?.data?.org_name || ""))
      .catch(() => {});
    // Only on first load; later runs come from the "Run Report" button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const checks = report?.checks;
  const sections = report?.sections;

  return (
    <Box sx={{ bgcolor: "#f6f6fa", minHeight: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          "@media print": { display: "none" },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>
            Reports
          </Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>Balance Sheet</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <TextField
            label="As of"
            type="date"
            size="small"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            onClick={() => runReport(asOf)}
            disabled={loading || !asOf}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Run Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintOutlinedIcon />}
            onClick={() => window.print()}
            disabled={!report}
            sx={{ textTransform: "none" }}
          >
            Print
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Paper variant="outlined" sx={{ width: "100%", maxWidth: 820, p: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            {orgName && (
              <Typography sx={{ fontSize: "13px", color: "#6c718a", textTransform: "uppercase" }}>
                {orgName}
              </Typography>
            )}
            <Typography sx={{ fontSize: "22px", fontWeight: 600 }}>Balance Sheet</Typography>
            {report && (
              <Typography sx={{ fontSize: "13px", color: "#4C526C" }}>
                As of {dayjs(report.as_of).format("DD-MM-YYYY")}
              </Typography>
            )}
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {!loading && error && <Alert severity="error">{error}</Alert>}

          {!loading && report && (
            <>
              {/* Integrity checks */}
              {!checks.has_chart_of_accounts && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  This organization has no chart of accounts, so balances can&apos;t be
                  classified.
                </Alert>
              )}
              {!checks.is_balanced && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  The balance sheet doesn&apos;t balance: assets differ from liabilities +
                  equity by {formatINR(report.totals.difference)}. See the details below.
                </Alert>
              )}
              {checks.unbalanced_journals.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {checks.unbalanced_journals.length} journal
                  {checks.unbalanced_journals.length === 1 ? " has" : "s have"} debits
                  that don&apos;t equal credits:{" "}
                  {checks.unbalanced_journals
                    .map((j) => `${j.journal_id} (${j.type}, ${formatINR(j.difference)})`)
                    .join(", ")}
                </Alert>
              )}
              {checks.unclassified_accounts.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Some entries use accounts that aren&apos;t in your chart of accounts and
                  aren&apos;t shown above:{" "}
                  {checks.unclassified_accounts
                    .map((a) => `${a.account_name} (${formatINR(a.debit_balance)} Dr)`)
                    .join(", ")}
                </Alert>
              )}

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontSize: "12px", fontWeight: 600, color: "#6c718a" }}
                    >
                      ACCOUNT
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: "12px", fontWeight: 600, color: "#6c718a" }}
                    >
                      AMOUNT
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <SectionRows
                    title="Assets"
                    groups={sections.assets}
                    total={report.totals.assets}
                    totalLabel="Total Assets"
                  />
                  <SectionRows
                    title="Liabilities"
                    groups={sections.liabilities}
                    total={report.totals.liabilities}
                    totalLabel="Total Liabilities"
                  />
                  <SectionRows
                    title="Equity"
                    groups={sections.equity}
                    total={report.totals.equity}
                    totalLabel="Total Equity"
                  />
                  <TableRow>
                    <TableCell
                      sx={{ fontSize: "14px", fontWeight: 700, borderTop: "2px solid #4C526C" }}
                    >
                      Total Liabilities &amp; Equity
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: "14px", fontWeight: 700, borderTop: "2px solid #4C526C" }}
                    >
                      {formatINR(report.totals.liabilities_and_equity)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {checks.is_balanced && (
                <Typography
                  sx={{ fontSize: "12px", color: "primary.main", mt: 2, textAlign: "right" }}
                >
                  ✓ Assets equal liabilities + equity ({checks.journal_count} journal
                  {checks.journal_count === 1 ? "" : "s"} included)
                </Typography>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
