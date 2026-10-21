"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import dayjs from "dayjs";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";

const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Money is compared in whole paise so 0.1 + 0.2 style float errors can't make
// a balanced entry look unbalanced.
const toPaise = (value) => Math.round(Number(value || 0) * 100);
const isValidAmount = (value) =>
  value === "" || /^\d+(\.\d{0,2})?$/.test(String(value).trim());

const emptyLine = () => ({ account: null, debit: "", credit: "" });

const headerCellSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#6c718a",
  textTransform: "uppercase",
  bgcolor: "#f6f6fa",
};

export default function JournalEntriesPage() {
  const { showMessage } = useSnackbar();
  const [orgId, setOrgId] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setOrgId(localStorage.getItem("organization_id"));
  }, []);

  const loadJournals = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await apiService({
        method: "GET",
        url: "/api/v1/manual-journals",
        params: { org_id: orgId, limit: 200 },
      });
      setJournals(res.data?.data || []);
    } catch (error) {
      showMessage(error?.message || "Couldn't load journal entries", "error");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  const loadAccounts = useCallback(async () => {
    if (!orgId) return;
    try {
      const res = await apiService({
        method: "GET",
        url: "/api/v1/COA/get-coa-list",
        params: { org_id: orgId },
      });
      const options = (res.data?.data || []).flatMap((group) =>
        (group.accounts || []).map((acc) => ({
          account_id: acc.account_id,
          account_name: acc.account_name,
          group: group._id,
        }))
      );
      options.sort(
        (a, b) =>
          a.group.localeCompare(b.group) ||
          a.account_name.localeCompare(b.account_name)
      );
      setAccounts(options);
    } catch (error) {
      showMessage("Couldn't load the chart of accounts", "error");
    }
  }, [orgId]);

  useEffect(() => {
    loadJournals();
    loadAccounts();
  }, [loadJournals, loadAccounts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiService({
        method: "DELETE",
        url: `/api/v1/manual-journals/${deleteTarget.journal_id}`,
        params: { org_id: orgId },
      });
      showMessage("Journal entry deleted");
      setDeleteTarget(null);
      loadJournals();
    } catch (error) {
      showMessage(error?.message || "Couldn't delete the journal entry", "error");
    } finally {
      setDeleting(false);
    }
  };

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
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>
            Accountant
          </Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
            Journal Entries
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          New Journal
        </Button>
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontSize: "13px", color: "#6c718a", mb: 2 }}>
          Manual journals record adjustments that don&apos;t come from an invoice,
          bill or expense, such as owner capital, depreciation or corrections.
          Debits must always equal credits.
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerCellSx, width: 40 }} />
                <TableCell sx={headerCellSx}>Date</TableCell>
                <TableCell sx={headerCellSx}>Journal #</TableCell>
                <TableCell sx={headerCellSx}>Reference</TableCell>
                <TableCell sx={headerCellSx}>Notes</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Amount
                </TableCell>
                <TableCell sx={{ ...headerCellSx, width: 56 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : journals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: "14px", mb: 1.5 }}>
                      No manual journal entries yet.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setFormOpen(true)}
                      sx={{ textTransform: "none" }}
                    >
                      Create your first journal
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                journals.map((journal) => {
                  const isOpen = expanded === journal.journal_id;
                  return (
                    <React.Fragment key={journal.journal_id}>
                      <TableRow
                        hover
                        sx={{ cursor: "pointer", "& td": { fontSize: "13px" } }}
                        onClick={() =>
                          setExpanded(isOpen ? null : journal.journal_id)
                        }
                      >
                        <TableCell>
                          <IconButton size="small" aria-label="Show lines">
                            {isOpen ? (
                              <KeyboardArrowUpIcon fontSize="small" />
                            ) : (
                              <KeyboardArrowDownIcon fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{journal.journal_date_formatted}</TableCell>
                        <TableCell sx={{ color: "primary.main", fontWeight: 500 }}>
                          {journal.journal_id}
                        </TableCell>
                        <TableCell>{journal.reference_number || "—"}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 260,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {journal.notes || "—"}
                        </TableCell>
                        <TableCell align="right">
                          {formatINR(journal.total_amount)}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(journal);
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, border: isOpen ? undefined : 0 }}>
                          <Collapse in={isOpen} unmountOnExit>
                            <Box sx={{ px: 7, py: 1.5, bgcolor: "#fbfbfd" }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={headerCellSx}>Account</TableCell>
                                    <TableCell sx={headerCellSx} align="right">
                                      Debit
                                    </TableCell>
                                    <TableCell sx={headerCellSx} align="right">
                                      Credit
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {journal.line_items.map((line, i) => (
                                    <TableRow key={i} sx={{ "& td": { fontSize: "13px" } }}>
                                      <TableCell>{line.coa_account_name}</TableCell>
                                      <TableCell align="right">
                                        {line.creditOrDebit === "Debit"
                                          ? formatINR(line.amount)
                                          : ""}
                                      </TableCell>
                                      <TableCell align="right">
                                        {line.creditOrDebit === "Credit"
                                          ? formatINR(line.amount)
                                          : ""}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <JournalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        accounts={accounts}
        orgId={orgId}
        onCreated={() => {
          setFormOpen(false);
          showMessage("Journal entry created");
          loadJournals();
        }}
      />

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle sx={{ fontSize: "16px" }}>Delete journal entry?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px" }}>
            {deleteTarget?.journal_id} for {formatINR(deleteTarget?.total_amount)} will
            be removed and your reports will no longer include it. This can&apos;t be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
            sx={{ textTransform: "none" }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function JournalForm({ open, onClose, accounts, orgId, onCreated }) {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([emptyLine(), emptyLine()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setDate(dayjs().format("YYYY-MM-DD"));
      setReference("");
      setNotes("");
      setLines([emptyLine(), emptyLine()]);
      setError("");
    }
  }, [open]);

  const updateLine = (index, changes) =>
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...changes } : l)));

  const totals = useMemo(() => {
    const debit = lines.reduce((s, l) => s + toPaise(l.debit), 0);
    const credit = lines.reduce((s, l) => s + toPaise(l.credit), 0);
    return { debit, credit, difference: debit - credit };
  }, [lines]);

  const filledLines = lines.filter((l) => l.account || l.debit || l.credit);
  const problems = [];
  if (!date) problems.push("Pick a date.");
  if (filledLines.length < 2) problems.push("Add at least two lines.");
  filledLines.forEach((l) => {
    const n = lines.indexOf(l) + 1;
    if (!l.account) problems.push(`Line ${n}: choose an account.`);
    if (!toPaise(l.debit) && !toPaise(l.credit))
      problems.push(`Line ${n}: enter a debit or a credit amount.`);
  });
  if (lines.some((l) => !isValidAmount(l.debit) || !isValidAmount(l.credit)))
    problems.push("Amounts must be numbers with at most 2 decimals.");
  if (totals.debit !== totals.credit)
    problems.push("Total debits must equal total credits.");

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await apiService({
        method: "POST",
        url: "/api/v1/manual-journals",
        params: { org_id: orgId },
        data: {
          journal_date: date,
          reference_number: reference,
          notes,
          line_items: filledLines.map((l) => ({
            coa_account_id: l.account.account_id,
            creditOrDebit: toPaise(l.debit) > 0 ? "Debit" : "Credit",
            amount: toPaise(l.debit) > 0 ? l.debit : l.credit,
          })),
        },
      });
      onCreated();
    } catch (err) {
      setError(err?.message || "Couldn't save the journal entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>New Journal</Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            label="Date"
            type="date"
            size="small"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reference #"
            size="small"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            inputProps={{ maxLength: 100 }}
          />
        </Box>
        <TextField
          label="Notes"
          size="small"
          fullWidth
          multiline
          minRows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          inputProps={{ maxLength: 1000 }}
          sx={{ mb: 2 }}
        />

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Account</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 160 }} align="right">
                Debit
              </TableCell>
              <TableCell sx={{ ...headerCellSx, width: 160 }} align="right">
                Credit
              </TableCell>
              <TableCell sx={{ ...headerCellSx, width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line, index) => (
              <TableRow key={index}>
                <TableCell sx={{ py: 1 }}>
                  <Autocomplete
                    size="small"
                    options={accounts}
                    groupBy={(o) => o.group}
                    getOptionLabel={(o) => o.account_name}
                    isOptionEqualToValue={(o, v) => o.account_id === v.account_id}
                    value={line.account}
                    onChange={(_, value) => updateLine(index, { account: value })}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select an account" />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <TextField
                    size="small"
                    placeholder="0.00"
                    value={line.debit}
                    error={!isValidAmount(line.debit)}
                    onChange={(e) =>
                      updateLine(index, { debit: e.target.value, credit: "" })
                    }
                    inputProps={{ inputMode: "decimal", style: { textAlign: "right" } }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <TextField
                    size="small"
                    placeholder="0.00"
                    value={line.credit}
                    error={!isValidAmount(line.credit)}
                    onChange={(e) =>
                      updateLine(index, { credit: e.target.value, debit: "" })
                    }
                    inputProps={{ inputMode: "decimal", style: { textAlign: "right" } }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <IconButton
                    size="small"
                    aria-label="Remove line"
                    disabled={lines.length <= 2}
                    onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setLines((prev) => [...prev, emptyLine()])}
                  sx={{ textTransform: "none" }}
                >
                  Add line
                </Button>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {formatINR(totals.debit / 100)}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {formatINR(totals.credit / 100)}
              </TableCell>
              <TableCell />
            </TableRow>
            {totals.difference !== 0 && (
              <TableRow>
                <TableCell align="right" sx={{ color: "error.main", fontSize: "13px" }}>
                  Difference
                </TableCell>
                <TableCell
                  colSpan={2}
                  align="right"
                  sx={{ color: "error.main", fontWeight: 600 }}
                >
                  {formatINR(Math.abs(totals.difference) / 100)}{" "}
                  {totals.difference > 0 ? "more debit" : "more credit"}
                </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5, justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>
          {problems[0] || "Ready to save."}
        </Typography>
        <Box>
          <Button onClick={onClose} sx={{ textTransform: "none", mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || problems.length > 0}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
