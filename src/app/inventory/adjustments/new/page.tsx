"use client";

// New inventory adjustment: pick items, count them up or down (or change
// their value), choose the account it is booked to, and save. Stock and the
// journal are posted by the server, which also checks every line.
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
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
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { fmtQty, todayIso } from "../../../../components/inventory/format";
import {
  currentOrgId,
  errorMessage,
  inventoryApi,
  type AdjustmentInput,
  type AdjustmentInputLine,
  type AdjustmentMode,
  type LookupAccount,
  type LookupItem,
} from "../../../../services/inventoryApi";

interface DraftLine {
  key: number;
  item_id: string;
  mode: AdjustmentMode;
  amount: string; // quantity change, or value change in rupees (may be negative)
  rate: string; // unit cost for stock coming in (optional)
}

const blankLine = (key: number): DraftLine => ({ key, item_id: "", mode: "quantity", amount: "", rate: "" });

export default function NewAdjustmentPage(_props?: any) {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const org = currentOrgId();

  const [items, setItems] = useState<LookupItem[]>([]);
  const [accounts, setAccounts] = useState<LookupAccount[]>([]);
  const [date, setDate] = useState<string>(todayIso());
  const [reason, setReason] = useState<any>("");
  const [reference, setReference] = useState<any>("");
  const [accountId, setAccountId] = useState<any>("");
  const [notes, setNotes] = useState<any>("");
  const [lines, setLines] = useState<DraftLine[]>([blankLine(1)]);
  const [nextKey, setNextKey] = useState<number>(2);
  const [saving, setSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<any>("");

  useEffect(() => {
    if (!org) return;
    inventoryApi
      .lookups(org)
      .then((res) => {
        setItems(res.items);
        setAccounts(res.accounts);
      })
      .catch((e: unknown) => setFormError(errorMessage(e, "Couldn't load items and accounts.")));
  }, [org]);

  const updateLine = (key: number, patch: Partial<DraftLine>) =>
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const removeLine = (key: number) => setLines((ls) => (ls.length > 1 ? ls.filter((l) => l.key !== key) : ls));
  const addLine = () => {
    setLines((ls) => [...ls, blankLine(nextKey)]);
    setNextKey((k) => k + 1);
  };

  const itemById = (id: string): LookupItem | undefined => items.find((i) => i.item_id === id);

  // Checks the obvious mistakes here; the server checks every line again.
  const validate = (): string => {
    if (!date) return "Pick the date of the adjustment.";
    if (!reason.trim()) return "Enter a reason for the adjustment.";
    if (!accountId) return "Choose the account this adjustment is booked to.";
    const filled = lines.filter((l) => l.item_id || l.amount !== "");
    if (!filled.length) return "Add at least one item.";
    for (const [i, l] of filled.entries()) {
      const n = i + 1;
      if (!l.item_id) return `Line ${n}: choose an item.`;
      if (l.amount.trim() === "" || !Number.isFinite(Number(l.amount)) || Number(l.amount) === 0) {
        return l.mode === "quantity" ? `Line ${n}: enter the quantity change (not zero).` : `Line ${n}: enter the value change (not zero).`;
      }
      if (l.rate !== "" && (!Number.isFinite(Number(l.rate)) || Number(l.rate) < 0)) return `Line ${n}: the unit cost can't be negative.`;
    }
    const ids = filled.map((l) => l.item_id);
    if (new Set(ids).size !== ids.length) return "An item is listed twice. Combine those lines.";
    return "";
  };

  const save = async () => {
    if (saving) return;
    const problem = validate();
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError("");
    const body: AdjustmentInput = {
      date,
      reason: reason.trim(),
      reference_number: reference.trim(),
      notes: notes.trim(),
      account_id: accountId,
      line_items: lines
        .filter((l) => l.item_id)
        .map((l): AdjustmentInputLine =>
          l.mode === "quantity"
            ? { item_id: l.item_id, mode: "quantity", qty_change: Number(l.amount), rate: l.rate === "" ? null : Number(l.rate) }
            : { item_id: l.item_id, mode: "value", value_change: Number(l.amount) }
        ),
    };
    setSaving(true);
    try {
      const res = await inventoryApi.createAdjustment(org, body);
      showMessage("Adjustment saved. Stock and the journal are updated.", "success");
      router.push(`/inventory/adjustments/${res.data._id}`);
    } catch (e) {
      const message = errorMessage(e, "Couldn't save the adjustment.");
      setFormError(message);
      showMessage(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!org) return <Alert severity="warning">Choose an organisation first.</Alert>;

  return (
    <Box sx={{ p: 3, maxWidth: 1100 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>New Inventory Adjustment</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Stock counted up or down, or a change in value, booked to an account.
      </Typography>

      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

      <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField label="Date" type="date" size="small" fullWidth required value={date} onChange={(e) => setDate((e.target as any).value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Reference #" size="small" fullWidth value={reference} onChange={(e) => setReference((e.target as any).value)} inputProps={{ maxLength: 100 }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Adjustment account"
              size="small"
              fullWidth
              required
              value={accountId}
              onChange={(e) => setAccountId((e.target as any).value)}
              helperText="Where the other side of the entry goes, e.g. Cost of Goods Sold"
            >
              {accounts.map((a) => (
                <MenuItem key={a.account_id} value={a.account_id}>{a.account_name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Reason" size="small" fullWidth required value={reason} onChange={(e) => setReason((e.target as any).value)} inputProps={{ maxLength: 200 }} placeholder="e.g. Stock count, damaged goods" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Notes" size="small" fullWidth value={notes} onChange={(e) => setNotes((e.target as any).value)} inputProps={{ maxLength: 2000 }} />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small" aria-label="Adjustment lines">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 240 }}>Item</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Change</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Amount</TableCell>
              <TableCell sx={{ minWidth: 130 }}>Unit cost (stock in)</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((l, idx) => {
              const item = itemById(l.item_id);
              return (
                <TableRow key={l.key}>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={l.item_id}
                      onChange={(e) => updateLine(l.key, { item_id: (e.target as any).value })}
                      inputProps={{ "aria-label": `Item for line ${idx + 1}` }}
                      helperText={item ? `On hand: ${fmtQty(item.stock_qty)} ${item.unit}`.trim() : " "}
                    >
                      {items.map((i) => (
                        <MenuItem key={i.item_id} value={i.item_id}>{i.name}{i.sku ? ` (${i.sku})` : ""}</MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={l.mode}
                      onChange={(e) => updateLine(l.key, { mode: (e.target as any).value as AdjustmentMode })}
                      inputProps={{ "aria-label": `Change type for line ${idx + 1}` }}
                    >
                      <MenuItem value="quantity">Quantity</MenuItem>
                      <MenuItem value="value">Stock value</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      value={l.amount}
                      onChange={(e) => updateLine(l.key, { amount: (e.target as any).value })}
                      placeholder={l.mode === "quantity" ? "e.g. -3 or 5" : "e.g. -150 or 250"}
                      inputProps={{ "aria-label": `Amount for line ${idx + 1}`, step: l.mode === "quantity" ? "0.0001" : "0.01" }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      disabled={l.mode !== "quantity"}
                      value={l.rate}
                      onChange={(e) => updateLine(l.key, { rate: (e.target as any).value })}
                      placeholder={item ? `Current ${item.avg_cost}` : "Current cost"}
                      inputProps={{ "aria-label": `Unit cost for line ${idx + 1}`, min: 0, step: "0.01" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton aria-label={`Remove line ${idx + 1}`} onClick={() => removeLine(l.key)} disabled={lines.length === 1}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button startIcon={<AddIcon />} onClick={addLine} sx={{ mb: 3 }}>Add item</Button>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Quantity lines add or take out stock at its cost; leave the unit cost blank to use the item&apos;s current cost.
        Stock value lines change what the stock is worth without changing the quantity.
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={save} disabled={saving}>Save adjustment</Button>
        <Button variant={"text" as any} onClick={() => router.push("/inventory/adjustments")} disabled={saving}>Cancel</Button>
      </Stack>
    </Box>
  );
}
