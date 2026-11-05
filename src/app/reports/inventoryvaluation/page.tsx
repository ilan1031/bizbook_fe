"use client";

// Inventory valuation: quantity and value of every tracked item on a given
// day (today by default), at average cost or FIFO.
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ReportsMenuButton, ShareReportButton } from "../ReportControls";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { downloadCsv, fmtMoney, fmtQty, todayIso } from "../../../components/inventory/format";
import { currentOrgId, errorMessage, inventoryApi, valuationLabel, type ValuationResponse } from "../../../services/inventoryApi";

export default function InventoryValuationPage(_props?: any) {
  const org = currentOrgId();
  const { showMessage } = useSnackbar();
  const [asOf, setAsOf] = useState<string>(todayIso());
  const [report, setReport] = useState<ValuationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    if (!org || !asOf) return;
    let active = true;
    setLoading(true);
    setError("");
    inventoryApi
      .valuation(org, asOf)
      .then((res) => {
        if (active) setReport(res);
      })
      .catch((e: unknown) => {
        if (active) setError(errorMessage(e, "Couldn't load the valuation."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [org, asOf]);

  const exportCsv = () => {
    if (!report) return;
    downloadCsv(
      `inventory-valuation-${report.as_of}.csv`,
      ["Item", "SKU", "Valuation", "Quantity", "Average cost", "Value"],
      report.data.map((r) => [r.name, r.sku, valuationLabel(r.valuation_method), r.qty, r.avg_cost, r.value])
    );
    showMessage("Valuation exported", "success");
  };

  if (!org) return <Alert severity="warning">Choose an organisation first.</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Inventory Valuation</Typography>
          <Typography variant="body2" color="text.secondary">What the stock on hand is worth on a given day.</Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="As of"
            type="date"
            size="small"
            value={asOf}
            onChange={(e) => setAsOf((e.target as any).value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCsv} disabled={!report || report.data.length === 0}>
            Export CSV
          </Button>
          <ShareReportButton />
          <ReportsMenuButton />
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Inventory valuation">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Valuation</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Average cost</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && report && report.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>No stock movements up to this date.</Typography>
                </TableCell>
              </TableRow>
            )}
            {report?.data.map((r) => (
              <TableRow key={r._id} hover>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.sku || "-"}</TableCell>
                <TableCell>{valuationLabel(r.valuation_method)}</TableCell>
                <TableCell align="right">{fmtQty(r.qty)}</TableCell>
                <TableCell align="right">{fmtMoney(r.avg_cost)}</TableCell>
                <TableCell align="right">{fmtMoney(r.value)}</TableCell>
              </TableRow>
            ))}
            {report && report.data.length > 0 && (
              <TableRow>
                <TableCell colSpan={5} align="right"><strong>Total stock value</strong></TableCell>
                <TableCell align="right"><strong>{report.totals.value_formatted}</strong></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {report && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" as const, mt: 1 }}>
          LIFO items are valued at average cost. Stock as of {report.as_of}.
        </Typography>
      )}
    </Box>
  );
}
