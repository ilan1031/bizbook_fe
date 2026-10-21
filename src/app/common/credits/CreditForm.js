"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { CREDIT_KINDS, formatINR, headerCellSx, isValidAmount, toPaise } from "./creditConfig";

const emptyLine = (account = null) => ({ item_id: "", name: "", quantity: "1", rate: "", account });

// Create a credit, or edit one (`creditNumber`) that hasn't been used yet.
export default function CreditForm({ kind, creditNumber = null }) {
  const cfg = CREDIT_KINDS[kind];
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [orgId, setOrgId] = useState(null);
  const [lookups, setLookups] = useState(null);
  const [contact, setContact] = useState(null);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([emptyLine()]);
  const [existingStatus, setExistingStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setOrgId(localStorage.getItem("organization_id"));
  }, []);

  // Lookups first, then (when editing) the credit itself.
  useEffect(() => {
    if (!orgId) return;
    (async () => {
      try {
        const res = await apiService({ method: "GET", url: `${cfg.api}/lookups`, params: { org_id: orgId } });
        const data = res.data?.data;
        const lineAccounts = data.accounts.filter((a) => cfg.lineAccountTypes.includes(a.account_type));
        const defaultAccount = lineAccounts.find((a) => a.account_id === data.default_account_id) || null;
        setLookups({ ...data, lineAccounts, defaultAccount });

        if (!creditNumber) {
          setLines([emptyLine(defaultAccount)]);
          return;
        }
        const cr = (await apiService({ method: "GET", url: `${cfg.api}/${creditNumber}`, params: { org_id: orgId } }))
          .data?.data;
        if (cr.applications?.length || cr.refunds?.length || cr.status === "void") {
          setLoadError(`This ${cfg.single.toLowerCase()} has been used or voided, so it can't be edited.`);
          return;
        }
        setExistingStatus(cr.status);
        setContact(data.contacts.find((c) => c.id === cr.contact_id) || { id: cr.contact_id, name: cr.contact_name });
        setDate(dayjs(cr.date).format("YYYY-MM-DD"));
        setReference(cr.reference_number || "");
        setNotes(cr.notes || "");
        setLines(
          cr.line_items.map((l) => ({
            item_id: l.item_id,
            name: l.name,
            quantity: String(l.quantity),
            rate: String(l.rate),
            account: data.accounts.find((a) => a.account_id === l.account_id) || null,
          }))
        );
      } catch (err) {
        setLoadError(err?.message || "Couldn't load the form");
      }
    })();
  }, [orgId, creditNumber, cfg]);

  const updateLine = (index, changes) =>
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...changes } : l)));

  const lineAmount = (l) => Math.round(Number(l.quantity || 0) * toPaise(l.rate));
  const totalPaise = useMemo(() => lines.reduce((s, l) => s + lineAmount(l), 0), [lines]);

  const problems = [];
  if (!contact) problems.push(`Choose a ${cfg.contactLabel.toLowerCase()}.`);
  if (!date) problems.push("Pick a date.");
  lines.forEach((l, i) => {
    const n = i + 1;
    if (!l.name.trim()) problems.push(`Line ${n}: enter an item or description.`);
    if (!(Number(l.quantity) > 0)) problems.push(`Line ${n}: quantity must be more than 0.`);
    if (!isValidAmount(l.rate) || !(toPaise(l.rate) > 0)) problems.push(`Line ${n}: enter a rate.`);
    if (!l.account) problems.push(`Line ${n}: choose an account.`);
  });

  const save = async (status) => {
    setError("");
    setSaving(true);
    try {
      const payload = {
        contact_id: contact.id,
        date,
        reference_number: reference,
        notes,
        status,
        line_items: lines.map((l) => ({
          item_id: l.item_id,
          name: l.name.trim(),
          quantity: Number(l.quantity),
          rate: Number(l.rate),
          account_id: l.account.account_id,
        })),
      };
      const res = creditNumber
        ? await apiService({ method: "PUT", url: `${cfg.api}/${creditNumber}`, params: { org_id: orgId }, data: payload })
        : await apiService({ method: "POST", url: cfg.api, params: { org_id: orgId }, data: payload });
      const saved = res.data?.data;
      showMessage(`${cfg.single} ${saved.credit_number} saved`);
      router.push(`${cfg.base}/${saved.credit_number}`);
    } catch (err) {
      setError(err?.message || `Couldn't save the ${cfg.single.toLowerCase()}`);
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
        <Button onClick={() => router.push(cfg.base)} sx={{ textTransform: "none" }}>
          Back to {cfg.title}
        </Button>
      </Box>
    );
  }
  if (!lookups) {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f6f6fa", minHeight: "100%", pb: 10 }}>
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0", px: 3, py: 1.5 }}>
        <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>{cfg.title}</Typography>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          {creditNumber ? `Edit ${creditNumber}` : `New ${cfg.single}`}
        </Typography>
      </Box>

      <Box sx={{ p: 3, maxWidth: 1100 }}>
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <Autocomplete
              size="small"
              options={lookups.contacts}
              getOptionLabel={(o) => o.name || ""}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              value={contact}
              onChange={(_, v) => setContact(v)}
              renderOption={({ key, ...props }, o) => (
                <li key={o.id} {...props}>
                  <Box>
                    <Typography sx={{ fontSize: "14px" }}>{o.name}</Typography>
                    {(o.company_name || o.email) && (
                      <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>
                        {[o.company_name, o.email].filter(Boolean).join(" · ")}
                      </Typography>
                    )}
                  </Box>
                </li>
              )}
              renderInput={(params) => <TextField {...params} label={`${cfg.contactLabel} *`} />}
              noOptionsText={`No ${cfg.contactLabel.toLowerCase()}s yet`}
            />
            <TextField
              label="Date *"
              type="date"
              size="small"
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
            <TextField
              label="Reason / notes"
              size="small"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              inputProps={{ maxLength: 2000 }}
            />
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ mb: 3, overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Item / description</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 220 }}>Account</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 90 }} align="right">
                  Qty
                </TableCell>
                <TableCell sx={{ ...headerCellSx, width: 130 }} align="right">
                  Rate
                </TableCell>
                <TableCell sx={{ ...headerCellSx, width: 130 }} align="right">
                  Amount
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
                      freeSolo
                      options={lookups.items}
                      getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
                      inputValue={line.name}
                      onInputChange={(_, v, reason) => {
                        if (reason === "input") updateLine(index, { name: v, item_id: "" });
                      }}
                      onChange={(_, v) => {
                        if (v && typeof v === "object") {
                          updateLine(index, {
                            name: v.name,
                            item_id: v.item_id,
                            rate: v.rate ? String(v.rate) : line.rate,
                          });
                        }
                      }}
                      renderOption={({ key, ...props }, o) => (
                        <li key={o.item_id || o.name} {...props}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 2 }}>
                            <span>{o.name}</span>
                            {o.rate ? <span style={{ color: "#6c718a" }}>{formatINR(o.rate)}</span> : null}
                          </Box>
                        </li>
                      )}
                      renderInput={(params) => <TextField {...params} placeholder="Type or pick an item" />}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Autocomplete
                      size="small"
                      options={lookups.lineAccounts}
                      getOptionLabel={(o) => o.account_name}
                      isOptionEqualToValue={(o, v) => o.account_id === v.account_id}
                      value={line.account}
                      onChange={(_, v) => updateLine(index, { account: v })}
                      renderInput={(params) => <TextField {...params} placeholder="Account" />}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      size="small"
                      value={line.quantity}
                      onChange={(e) => updateLine(index, { quantity: e.target.value })}
                      inputProps={{ inputMode: "decimal", style: { textAlign: "right" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <TextField
                      size="small"
                      placeholder="0.00"
                      value={line.rate}
                      error={!isValidAmount(line.rate)}
                      onChange={(e) => updateLine(index, { rate: e.target.value })}
                      inputProps={{ inputMode: "decimal", style: { textAlign: "right" } }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "13px" }}>
                    {formatINR(lineAmount(line) / 100)}
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <IconButton
                      data-rbac-ignore
                      size="small"
                      aria-label="Remove line"
                      disabled={lines.length <= 1}
                      onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}>
                  <Button
                    data-rbac-ignore
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setLines((prev) => [...prev, emptyLine(lookups.defaultAccount)])}
                    sx={{ textTransform: "none" }}
                  >
                    Add line
                  </Button>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: "14px" }}>
                  {formatINR(totalPaise / 100)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Box
        data-rbac-ignore
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1,
          zIndex: 10,
        }}
      >
        <Typography sx={{ fontSize: "12px", color: "#6c718a", mr: "auto", pl: { md: "240px" } }}>
          {problems[0] || "Ready to save."}
        </Typography>
        <Button onClick={() => router.back()} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        {(!creditNumber || existingStatus === "draft") && (
          <Button
            variant="outlined"
            disabled={saving || problems.length > 0}
            onClick={() => save("draft")}
            sx={{ textTransform: "none" }}
          >
            Save as draft
          </Button>
        )}
        <Button
          variant="contained"
          disabled={saving || problems.length > 0}
          onClick={() => save("open")}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {saving ? "Saving…" : creditNumber && existingStatus === "open" ? "Save" : "Save as open"}
        </Button>
      </Box>
    </Box>
  );
}
