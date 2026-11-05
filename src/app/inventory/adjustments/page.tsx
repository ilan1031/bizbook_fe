"use client";

// Inventory adjustments: stock counted up or down, each with its journal.
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
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
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { usePageAccess } from "../../../components/inventory/usePageAccess";
import { fmtDate, fmtMoney } from "../../../components/inventory/format";
import { currentOrgId, errorMessage, inventoryApi, type AdjustmentListRow, type Pagination } from "../../../services/inventoryApi";
import { useSnackbar } from "../../../components/SnackbarProvider";

const EMPTY: Pagination = { currentPage: 1, totalPages: 1, totalRecords: 0, recordsPerPage: 25 };

export default function AdjustmentsListPage(_props?: any) {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const org = currentOrgId();
  const canCreate = usePageAccess("inventoryAdjustments", "create");
  const [rows, setRows] = useState<AdjustmentListRow[]>([]);
  const [pagination, setPagination] = useState<Pagination>(EMPTY);
  const [search, setSearch] = useState<any>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const load = useCallback(async () => {
    if (!org) return;
    setLoading(true);
    try {
      const res = await inventoryApi.listAdjustments(org, search.trim(), page);
      setRows(res.data);
      setPagination(res.pagination);
    } catch (e) {
      showMessage(errorMessage(e, "Couldn't load adjustments."), "error");
    } finally {
      setLoading(false);
    }
  }, [org, search, page, showMessage]);

  useEffect(() => {
    load();
  }, [load]);

  if (!org) return <Alert severity="warning">Choose an organisation first.</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Inventory Adjustments</Typography>
          <Typography variant="body2" color="text.secondary">Count stock up or down, or change its value.</Typography>
        </Box>
        {canCreate && (
          <Button variant="contained" onClick={() => router.push("/inventory/adjustments/new")}>New Adjustment</Button>
        )}
      </Stack>

      <TextField
        size="small"
        placeholder="Search by number, reason or reference"
        value={search}
        onChange={(e) => {
          setSearch((e.target as any).value);
          setPage(1);
        }}
        sx={{ minWidth: 320, mb: 2 }}
      />

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Inventory adjustments">
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Account</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Value change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={22} /></TableCell></TableRow>
            )}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    {search ? "No adjustments match your search." : "No adjustments yet."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((r) => (
                <TableRow key={r._id} hover sx={{ cursor: "pointer" as const }} onClick={() => router.push(`/inventory/adjustments/${r._id}`)}>
                  <TableCell>{r.adjustment_number}</TableCell>
                  <TableCell>{fmtDate(r.date)}</TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell>{r.account_name}</TableCell>
                  <TableCell align="right">{r.line_count}</TableCell>
                  <TableCell align="right" sx={{ color: r.total_value < 0 ? "error.main" : "success.main" }}>
                    {r.total_value < 0 ? "-" : "+"}{fmtMoney(Math.abs(r.total_value))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1} sx={{ mt: 2 }}>
        <IconButton size="small" disabled={pagination.currentPage <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
          <NavigateBeforeIcon />
        </IconButton>
        <Typography variant="body2">{pagination.currentPage} / {pagination.totalPages}</Typography>
        <IconButton size="small" disabled={pagination.currentPage >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
          <NavigateNextIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
