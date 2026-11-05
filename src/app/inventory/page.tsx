"use client";

// Stock summary: what is on hand for every tracked item, its reorder level,
// average cost and stock value, with search, filters, CSV export and the
// setting for selling beyond stock.
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSnackbar } from "../../components/SnackbarProvider";
import { usePageAccess } from "../../components/inventory/usePageAccess";
import {
  currentOrgId,
  errorMessage,
  inventoryApi,
  valuationLabel,
  type Pagination,
  type SellPolicy,
  type StockRow,
  type SummaryResponse,
} from "../../services/inventoryApi";
import { STATUS_COLOR, downloadCsv, fmtMoney, fmtQty } from "../../components/inventory/format";

type Filter = "all" | "low" | "out";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All items" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

const EMPTY_PAGE: Pagination = { currentPage: 1, totalPages: 1, totalRecords: 0, recordsPerPage: 25 };

export default function StockSummaryPage(_props?: any) {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const org = currentOrgId();
  const canEditPolicy = usePageAccess("items", "edit");
  const canAdjust = usePageAccess("inventoryAdjustments", "create");

  const [rows, setRows] = useState<StockRow[]>([]);
  const [totals, setTotals] = useState<SummaryResponse["totals"]>({ items: 0, stock_value: 0, low_stock: 0 });
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGE);
  const [search, setSearch] = useState<any>("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<any>("");
  const [policy, setPolicy] = useState<SellPolicy>("warn");
  const [exporting, setExporting] = useState<boolean>(false);

  const load = useCallback(async () => {
    if (!org) return;
    setLoading(true);
    setLoadError("");
    try {
      const res = await inventoryApi.summary(org, { search, filter, page });
      setRows(res.data);
      setTotals(res.totals);
      setPagination(res.pagination);
    } catch (e) {
      setLoadError(errorMessage(e, "Couldn't load stock."));
    } finally {
      setLoading(false);
    }
  }, [org, search, filter, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!org) return;
    inventoryApi
      .getSettings(org)
      .then((res) => setPolicy(res.data.sell_policy))
      .catch(() => setPolicy("warn"));
  }, [org]);

  const changePolicy = async (value: SellPolicy) => {
    try {
      const res = await inventoryApi.saveSettings(org, value);
      setPolicy(res.data.sell_policy);
      showMessage(
        value === "block" ? "Selling beyond stock is now blocked." : "Selling beyond stock now shows a warning.",
        "success"
      );
    } catch (e) {
      showMessage(errorMessage(e, "Couldn't save the setting."), "error");
    }
  };

  // Exports every row matching the current search and filter, not just this page.
  const exportCsv = async () => {
    setExporting(true);
    try {
      const all = await inventoryApi.summary(org, { search, filter, page: 1, limit: 5000 });
      downloadCsv(
        "stock-summary.csv",
        ["Item", "SKU", "Unit", "On hand", "Reorder level", "Average cost", "Stock value", "Status"],
        all.data.map((r) => [r.name, r.sku, r.unit, r.stock_qty, r.reorder_level, r.avg_cost, r.stock_value, r.status_label])
      );
    } catch (e) {
      showMessage(errorMessage(e, "Couldn't export the stock summary."), "error");
    } finally {
      setExporting(false);
    }
  };

  if (!org) {
    return <Alert severity="warning">Choose an organisation to see its stock.</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Stock Summary</Typography>
          <Typography variant="body2" color="text.secondary">Stock on hand for tracked items, at average cost, FIFO or LIFO.</Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Selling beyond stock"
            value={policy}
            disabled={!canEditPolicy}
            onChange={(e) => changePolicy((e.target as any).value as SellPolicy)}
            sx={{ minWidth: 220 }}
            helperText={canEditPolicy ? undefined : "Only users who can edit items change this."}
          >
            <MenuItem value="warn">Warn and allow</MenuItem>
            <MenuItem value="block">Block the sale</MenuItem>
          </TextField>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCsv} disabled={exporting}>
            Export CSV
          </Button>
          {canAdjust && (
            <Button variant="contained" onClick={() => router.push("/inventory/adjustments/new")}>
              New Adjustment
            </Button>
          )}
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">Tracked items</Typography>
            <Typography variant="h6">{totals.items}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">Stock value</Typography>
            <Typography variant="h6">{fmtMoney(totals.stock_value)}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">At or below reorder level</Typography>
            <Typography variant="h6" color={totals.low_stock ? "warning.main" : "inherit"}>{totals.low_stock}</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by name or SKU"
          value={search}
          onChange={(e) => {
            setSearch((e.target as any).value);
            setPage(1);
          }}
          sx={{ minWidth: 280 }}
        />
        <TextField
          select
          size="small"
          label="Show"
          value={filter}
          onChange={(e) => {
            setFilter((e.target as any).value as Filter);
            setPage(1);
          }}
          sx={{ minWidth: 180 }}
        >
          {FILTERS.map((f) => (
            <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Stock summary">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">On hand</TableCell>
              <TableCell align="right">Reorder level</TableCell>
              <TableCell align="right">Average cost</TableCell>
              <TableCell align="right">Stock value</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center"><CircularProgress size={22} /></TableCell>
              </TableRow>
            )}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    {search || filter !== "all"
                      ? "No items match these filters."
                      : "No tracked items yet. Turn on Track Inventory for a goods item to see its stock here."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((r) => (
                <TableRow key={r._id} hover sx={{ cursor: "pointer" as const }} onClick={() => router.push(`/item/${r.item_id}`)}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{r.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {valuationLabel(r.valuation_method)}
                    </Typography>
                  </TableCell>
                  <TableCell>{r.sku || "-"}</TableCell>
                  <TableCell align="right">{fmtQty(r.stock_qty)} {r.unit}</TableCell>
                  <TableCell align="right">{r.reorder_level ? fmtQty(r.reorder_level) : "-"}</TableCell>
                  <TableCell align="right">{fmtMoney(r.avg_cost)}</TableCell>
                  <TableCell align="right">{fmtMoney(r.stock_value)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={r.status_label} color={STATUS_COLOR[r.status]} variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1} sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {pagination.totalRecords} item{pagination.totalRecords === 1 ? "" : "s"}
        </Typography>
        <Tooltip title="Previous page">
          <span>
            <IconButton size="small" disabled={pagination.currentPage <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
              <NavigateBeforeIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body2">{pagination.currentPage} / {pagination.totalPages}</Typography>
        <Tooltip title="Next page">
          <span>
            <IconButton size="small" disabled={pagination.currentPage >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
              <NavigateNextIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
}
