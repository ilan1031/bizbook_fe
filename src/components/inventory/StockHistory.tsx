"use client";

// The stock history of one item: every movement with the document it came
// from, and the balance after it. Shown as a tab on the item page.
import React, { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { errorMessage, inventoryApi, valuationLabel, type LedgerResponse, type LedgerRow } from "../../services/inventoryApi";
import { SOURCE_LABEL, fmtDate, fmtMoney, fmtQty } from "./format";

interface StockHistoryProps {
  itemId: string;
  organizationId: string;
}

export default function StockHistory({ itemId, organizationId }: StockHistoryProps) {
  const [data, setData] = useState<LedgerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    if (!itemId || !organizationId) return;
    let active = true;
    setLoading(true);
    setError("");
    inventoryApi
      .ledger(organizationId, itemId)
      .then((res) => {
        if (active) setData(res);
      })
      .catch((e: unknown) => {
        if (active) setError(errorMessage(e, "Couldn't load the stock history."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [itemId, organizationId]);

  if (loading) return <Box sx={{ p: 4, textAlign: "center" as const }}><CircularProgress size={28} /></Box>;
  if (error) return <Alert severity="info" sx={{ m: 2 }}>{error}</Alert>;
  if (!data) return null;

  const rows: LedgerRow[] = data.data;
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 2 }}>
        <Typography variant="body2"><strong>On hand:</strong> {fmtQty(data.item.stock_qty)} {data.item.unit}</Typography>
        <Typography variant="body2"><strong>Stock value:</strong> {fmtMoney(data.item.stock_value)}</Typography>
        <Typography variant="body2"><strong>Average cost:</strong> {fmtMoney(data.item.avg_cost)}</Typography>
        <Typography variant="body2"><strong>Valuation:</strong> {valuationLabel(data.item.valuation_method)}</Typography>
      </Stack>
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No stock movements yet.</Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="Stock history">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Document</TableCell>
                <TableCell>Party</TableCell>
                <TableCell align="right">In / out</TableCell>
                <TableCell align="right">Unit cost</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Balance qty</TableCell>
                <TableCell align="right">Balance value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{fmtDate(r.date)}</TableCell>
                  <TableCell>
                    {SOURCE_LABEL[r.source_type]}
                    {r.source_number ? ` ${r.source_number}` : ""}
                  </TableCell>
                  <TableCell>{r.party_name || "-"}</TableCell>
                  <TableCell align="right" sx={{ color: r.qty < 0 ? "error.main" : r.qty > 0 ? "success.main" : "text.primary" }}>
                    {r.qty === 0 ? "-" : `${r.qty > 0 ? "+" : ""}${fmtQty(r.qty)}`}
                  </TableCell>
                  <TableCell align="right">{r.qty === 0 ? "-" : fmtMoney(r.rate)}</TableCell>
                  <TableCell align="right">{fmtMoney(r.value)}</TableCell>
                  <TableCell align="right">{fmtQty(r.running_qty)}</TableCell>
                  <TableCell align="right">{fmtMoney(r.running_value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
