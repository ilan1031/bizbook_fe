"use client";

// One inventory adjustment: its lines, the stock it moved and the journal it
// posted. Deleting it reverses both.
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { usePageAccess } from "../../../../components/inventory/usePageAccess";
import { fmtDate, fmtMoney, fmtQty } from "../../../../components/inventory/format";
import {
  currentOrgId,
  errorMessage,
  inventoryApi,
  type AdjustmentDetail,
} from "../../../../services/inventoryApi";

export default function AdjustmentViewPage(_props?: any) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = String(params?.id ?? "");
  const org = currentOrgId();
  const { showMessage } = useSnackbar();
  const canDelete = usePageAccess("inventoryAdjustments", "delete");

  const [adj, setAdj] = useState<AdjustmentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>("");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!org || !id) return;
    let active = true;
    setLoading(true);
    inventoryApi
      .getAdjustment(org, id)
      .then((res) => {
        if (active) setAdj(res.data);
      })
      .catch((e: unknown) => {
        if (active) setError(errorMessage(e, "Couldn't load this adjustment."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [org, id]);

  const remove = async () => {
    setDeleting(true);
    try {
      const res = await inventoryApi.deleteAdjustment(org, id);
      showMessage(res.message || "Adjustment deleted", "success");
      router.push("/inventory/adjustments");
    } catch (e) {
      showMessage(errorMessage(e, "Couldn't delete the adjustment."), "error");
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: "center" as const }}><CircularProgress /></Box>;
  if (error || !adj) return <Alert severity="error" sx={{ m: 3 }}>{error || "Adjustment not found."}</Alert>;

  return (
    <Box sx={{ p: 3, maxWidth: 1100 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>{adj.adjustment_number}</Typography>
          <Typography variant="body2" color="text.secondary">
            {fmtDate(adj.date)} · {adj.reason}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => router.push("/inventory/adjustments")}>Back to adjustments</Button>
          {canDelete && (
            <Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>Delete</Button>
          )}
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mb: 2.5 }}>
        <Typography variant="body2"><strong>Account:</strong> {adj.account_name || "-"}</Typography>
        {adj.reference_number && <Typography variant="body2"><strong>Reference:</strong> {adj.reference_number}</Typography>}
        {adj.notes && <Typography variant="body2"><strong>Notes:</strong> {adj.notes}</Typography>}
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Net change in stock value:</strong>{" "}
          <span style={{ color: adj.total_value < 0 ? "#d32f2f" : "#2e7d32" }}>
            {adj.total_value < 0 ? "-" : "+"}{fmtMoney(Math.abs(adj.total_value))}
          </span>
        </Typography>
      </Paper>

      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Items</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small" aria-label="Adjusted items">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Quantity change</TableCell>
              <TableCell align="right">Value change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adj.lines.map((l) => (
              <TableRow key={`${l.item_ref}-${l.item_id}`}>
                <TableCell>{l.item_name}</TableCell>
                <TableCell align="right">{l.mode === "quantity" ? `${l.qty_change > 0 ? "+" : ""}${fmtQty(l.qty_change)}` : "-"}</TableCell>
                <TableCell align="right">{fmtMoney(l.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Journal</Typography>
      {adj.journal_lines.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No journal: the stock value didn&apos;t change.</Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="Adjustment journal">
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adj.journal_lines.map((l, i) => (
                <TableRow key={`${l.coa_account_id}-${i}`}>
                  <TableCell>{l.coa_account_name}</TableCell>
                  <TableCell align="right">{l.creditOrDebit === "Debit" ? fmtMoney(l.amount) : ""}</TableCell>
                  <TableCell align="right">{l.creditOrDebit === "Credit" ? fmtMoney(l.amount) : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)}>
        <DialogTitle>Delete {adj.adjustment_number}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Its stock movements and journal entry are reversed and removed. This can&apos;t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>Keep it</Button>
          <Button color="error" variant="contained" onClick={remove} disabled={deleting}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
