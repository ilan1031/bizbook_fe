"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { usePermissions } from "../../../services/PermissionProvider";
import StatusChip from "./StatusChip";
import { CREDIT_KINDS, formatINR, headerCellSx, isValidAmount, toPaise } from "./creditConfig";

const fmtDate = (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "—");

export default function CreditView({ kind, creditNumber }: any) {
  const cfg = CREDIT_KINDS[kind];
  const router = useRouter();
  const perms = usePermissions();
  const { showMessage } = useSnackbar();
  const [orgId, setOrgId] = useState<any>(null);
  const [credit, setCredit] = useState<any>(null);
  const [error, setError] = useState<any>("");
  const [dialog, setDialog] = useState<any>(null); // "apply" | "refund" | "void" | "delete"
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    setOrgId(localStorage.getItem("organization_id"));
  }, []);

  const load = useCallback(async () => {
    if (!orgId) return;
    try {
      const res = await apiService({ method: "GET", url: `${cfg.api}/${creditNumber}`, params: { org_id: orgId } });
      setCredit(res.data?.data);
    } catch (err) {
      setError(err?.message || `Couldn't load the ${cfg.single.toLowerCase()}`);
    }
  }, [orgId, creditNumber, cfg]);

  useEffect(() => {
    load();
  }, [load]);

  const can = (action) => perms?.can(cfg.pageKey, action);
  const isUsed = credit && (credit.applications.length > 0 || credit.refunds.length > 0);

  const setStatus = async (status) => {
    setBusy(true);
    try {
      await apiService({ method: "PUT", url: `${cfg.api}/${creditNumber}/status`, params: { org_id: orgId }, data: { status } });
      showMessage(status === "void" ? `${cfg.single} voided` : `${cfg.single} marked ${status}`);
      setDialog(null);
      load();
    } catch (err) {
      showMessage(err?.message || "Couldn't change the status", "error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await apiService({ method: "DELETE", url: `${cfg.api}/${creditNumber}`, params: { org_id: orgId } });
      showMessage(`${cfg.single} deleted`);
      router.push(cfg.base);
    } catch (err) {
      showMessage(err?.message || "Couldn't delete it", "error");
      setBusy(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => router.push(cfg.base)} sx={{ textTransform: "none" as const }}>
          Back to {cfg.title}
        </Button>
      </Box>
    );
  }
  if (!credit) {
    return (
      <Box sx={{ p: 6, textAlign: "center" as const }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const actions: any[] = [];
  if (credit.status === "open" && can("edit")) {
    actions.push(
      <Button key="apply" variant="contained" onClick={() => setDialog("apply")} sx={{ textTransform: "none" as const, fontWeight: 600 }}>
        Apply to {cfg.documentsLabel}
      </Button>,
      <Button key="refund" variant="outlined" onClick={() => setDialog("refund")} sx={{ textTransform: "none" as const }}>
        Record refund
      </Button>
    );
  }
  if (credit.status === "draft" && can("edit")) {
    actions.push(
      <Button key="open" variant="contained" disabled={busy} onClick={() => setStatus("open")} sx={{ textTransform: "none" as const, fontWeight: 600 }}>
        Mark as open
      </Button>
    );
  }
  if (!isUsed && credit.status !== "void" && can("edit")) {
    actions.push(
      <Button key="edit" variant="outlined" onClick={() => router.push(`${cfg.base}/edit/${creditNumber}`)} sx={{ textTransform: "none" as const }}>
        Edit
      </Button>
    );
  }
  if (!isUsed && credit.status !== "void" && can("delete")) {
    actions.push(
      <Button key="void" color="warning" onClick={() => setDialog("void")} sx={{ textTransform: "none" as const }}>
        Void
      </Button>
    );
  }
  if (!isUsed && can("delete")) {
    actions.push(
      <Button key="delete" color="error" onClick={() => setDialog("delete")} sx={{ textTransform: "none" as const }}>
        Delete
      </Button>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f6f6fa", minHeight: "100%" }}>
      <Box
        data-rbac-ignore
        sx={{
          position: "sticky" as const,
          top: 0,
          zIndex: 5,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 1.5,
          display: "flex" as const,
          alignItems: "center" as const,
          justifyContent: "space-between" as const,
          flexWrap: "wrap" as const,
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1.5 }}>
          <Button onClick={() => router.push(cfg.base)} sx={{ minWidth: 0, p: 0.5 }} aria-label="Back">
            <ArrowBackIcon fontSize="small" />
          </Button>
          <Box>
            <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#4C526C" }}>{cfg.title}</Typography>
            <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>{credit.credit_number}</Typography>
              <StatusChip status={credit.status} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex" as const, gap: 1, flexWrap: "wrap" as const }}>{actions}</Box>
      </Box>

      <Box sx={{ p: 3, maxWidth: 1100 }}>
        {credit.status === "draft" && (
          <Alert severity="info" sx={{ mb: 2 }}>
            This is a draft. It isn&apos;t in your books until you mark it as open.
          </Alert>
        )}
        {credit.status === "void" && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This {cfg.single.toLowerCase()} is void and isn&apos;t counted in your books.
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "grid" as const, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
            <Field label={cfg.contactLabel} value={credit.contact_name} />
            <Field label="Date" value={fmtDate(credit.date)} />
            <Field label="Reference #" value={credit.reference_number || "—"} />
            <Field label="Credit remaining" value={formatINR(credit.balance)} strong />
          </Box>
          {credit.notes && (
            <Typography sx={{ fontSize: "13px", color: "#4C526C", mt: 2 }}>{credit.notes}</Typography>
          )}
        </Paper>

        <Paper variant="outlined" sx={{ mb: 3, overflowX: "auto" as const }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Item / description</TableCell>
                <TableCell sx={headerCellSx}>Account</TableCell>
                <TableCell sx={headerCellSx} align="right">Qty</TableCell>
                <TableCell sx={headerCellSx} align="right">Rate</TableCell>
                <TableCell sx={headerCellSx} align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {credit.line_items.map((l, i) => (
                <TableRow key={i} sx={{ "& td": { fontSize: "13px" } }}>
                  <TableCell>{l.name}</TableCell>
                  <TableCell>{l.account_name}</TableCell>
                  <TableCell align="right">{l.quantity}</TableCell>
                  <TableCell align="right">{formatINR(l.rate)}</TableCell>
                  <TableCell align="right">{formatINR(l.amount)}</TableCell>
                </TableRow>
              ))}
              {Number(credit.gst_total) > 0 && (
                <>
                  <TableRow sx={{ "& td": { fontSize: "13px" } }}>
                    <TableCell colSpan={4} align="right">Taxable value</TableCell>
                    <TableCell align="right">{formatINR(credit.sub_total)}</TableCell>
                  </TableRow>
                  {[
                    ["CGST", credit.cgst_total],
                    ["SGST", credit.sgst_total],
                    ["IGST", credit.igst_total],
                  ]
                    .filter(([, v]) => Number(v) > 0)
                    .map(([k, v]) => (
                      <TableRow key={k} sx={{ "& td": { fontSize: "13px" } }}>
                        <TableCell colSpan={4} align="right">{k}</TableCell>
                        <TableCell align="right">{formatINR(v)}</TableCell>
                      </TableRow>
                    ))}
                </>
              )}
              <TableRow sx={{ "& td": { fontSize: "13px", fontWeight: 600 } }}>
                <TableCell colSpan={4} align="right">Total</TableCell>
                <TableCell align="right">{formatINR(credit.total)}</TableCell>
              </TableRow>
              <TableRow sx={{ "& td": { fontSize: "13px", border: 0 } }}>
                <TableCell colSpan={4} align="right">Credit remaining</TableCell>
                <TableCell align="right">{formatINR(credit.balance)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        {credit.applications.length > 0 && (
          <Section title={`Applied to ${cfg.documentsLabel}`}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>Date</TableCell>
                  <TableCell sx={headerCellSx}>{cfg.documentLabel} #</TableCell>
                  <TableCell sx={headerCellSx} align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {credit.applications.map((a, i) => (
                  <TableRow key={i} sx={{ "& td": { fontSize: "13px" } }}>
                    <TableCell>{fmtDate(a.date)}</TableCell>
                    <TableCell>{a.document_number}</TableCell>
                    <TableCell align="right">{formatINR(a.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        )}

        {credit.refunds.length > 0 && (
          <Section title="Refunds">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>Date</TableCell>
                  <TableCell sx={headerCellSx}>Account</TableCell>
                  <TableCell sx={headerCellSx}>Mode</TableCell>
                  <TableCell sx={headerCellSx}>Reference</TableCell>
                  <TableCell sx={headerCellSx} align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {credit.refunds.map((r, i) => (
                  <TableRow key={i} sx={{ "& td": { fontSize: "13px" } }}>
                    <TableCell>{fmtDate(r.date)}</TableCell>
                    <TableCell>{r.account_name}</TableCell>
                    <TableCell>{r.mode || "—"}</TableCell>
                    <TableCell>{r.reference_number || "—"}</TableCell>
                    <TableCell align="right">{formatINR(r.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
        )}

        {credit.journals?.length > 0 && (
          <Section title="Journal entries">
            {credit.journals.map((j) => (
              <Box key={j.journal_id} sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "12px", color: "#6c718a", mb: 0.5 }}>
                  {j.journal_id} · {j.type} · {fmtDate(j.journal_date)}
                  {j.posting_status && j.posting_status !== "posted" ? ` · not posted (${j.posting_status})` : ""}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerCellSx}>Account</TableCell>
                      <TableCell sx={headerCellSx} align="right">Debit</TableCell>
                      <TableCell sx={headerCellSx} align="right">Credit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {j.line_items.map((l, i) => (
                      <TableRow key={i} sx={{ "& td": { fontSize: "13px" } }}>
                        <TableCell>{l.coa_account_name}</TableCell>
                        <TableCell align="right">{l.creditOrDebit === "Debit" ? formatINR(l.amount) : ""}</TableCell>
                        <TableCell align="right">{l.creditOrDebit === "Credit" ? formatINR(l.amount) : ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ))}
          </Section>
        )}
      </Box>

      {dialog === "apply" && (
        <ApplyDialog cfg={cfg} credit={credit} orgId={orgId} onClose={() => setDialog(null)} onDone={() => { setDialog(null); load(); }} />
      )}
      {dialog === "refund" && (
        <RefundDialog cfg={cfg} credit={credit} orgId={orgId} onClose={() => setDialog(null)} onDone={() => { setDialog(null); load(); }} />
      )}
      <Dialog open={dialog === "void" || dialog === "delete"} onClose={() => setDialog(null)}>
        <DialogTitle sx={{ fontSize: "16px" }}>
          {dialog === "void" ? `Void ${credit.credit_number}?` : `Delete ${credit.credit_number}?`}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px" }}>
            {dialog === "void"
              ? "It stays on record but is removed from your books. You can't apply or refund a void credit."
              : "It and its journal entry will be removed permanently. This can't be undone."}
          </Typography>
        </DialogContent>
        <DialogActions data-rbac-ignore>
          <Button onClick={() => setDialog(null)} sx={{ textTransform: "none" as const }}>
            Cancel
          </Button>
          <Button
            color={dialog === "void" ? "warning" : "error"}
            variant="contained"
            disabled={busy}
            onClick={() => (dialog === "void" ? setStatus("void") : remove())}
            sx={{ textTransform: "none" as const }}
          >
            {dialog === "void" ? "Void" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Field({ label, value, strong }: any) {
  return (
    <Box>
      <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>{label}</Typography>
      <Typography sx={{ fontSize: "14px", fontWeight: strong ? 700 : 500 }}>{value}</Typography>
    </Box>
  );
}

function Section({ title, children }: any) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}>{title}</Typography>
      {children}
    </Paper>
  );
}

function ApplyDialog({ cfg, credit, orgId, onClose, onDone }: any) {
  const { showMessage } = useSnackbar();
  const [docs, setDocs] = useState<any>(null);
  const [amounts, setAmounts] = useState<any>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService({
          method: "GET",
          url: `${cfg.api}/${credit.credit_number}/open-documents`,
          params: { org_id: orgId },
        });
        setDocs(res.data?.data || []);
      } catch (err) {
        setError(err?.message || `Couldn't load ${cfg.documentsLabel}`);
        setDocs([]);
      }
    })();
  }, [cfg, credit.credit_number, orgId]);

  const totalPaise = useMemo(
    () => Object.values(amounts).reduce((s: any, v) => s + (isValidAmount(v) ? toPaise(v) : 0), 0),
    [amounts]
  );
  const available = toPaise(credit.balance);
  const problems: any[] = [];
  if (Object.values(amounts).some((v) => !isValidAmount(v))) problems.push("Amounts must be numbers with at most 2 decimals.");
  (docs || []).forEach((d) => {
    if (toPaise(amounts[d.document_id]) > toPaise(d.balance)) problems.push(`${d.document_number} has only ${formatINR(d.balance)} due.`);
  });
  if ((totalPaise as number) > available) problems.push(`Only ${formatINR(credit.balance)} of credit is left.`);
  if (totalPaise === 0) problems.push("Enter an amount against at least one row.");

  // Fill rows top to bottom with what's left of the credit.
  const autoFill = () => {
    let left = available;
    const next: any = {};
    for (const d of docs || []) {
      const take = Math.min(left, toPaise(d.balance));
      if (take > 0) next[d.document_id] = (take / 100).toFixed(2);
      left -= take;
    }
    setAmounts(next);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await apiService({
        method: "POST",
        url: `${cfg.api}/${credit.credit_number}/apply`,
        params: { org_id: orgId },
        data: {
          applications: Object.entries(amounts)
            .filter(([, v]) => toPaise(v) > 0)
            .map(([document_id, v]) => ({ document_id, amount: Number(v) })),
        },
      });
      showMessage(`Credit applied to ${cfg.documentsLabel}`);
      onDone();
    } catch (err) {
      setError(err?.message || "Couldn't apply the credit");
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: "16px" }}>
        Apply {credit.credit_number} to {cfg.documentsLabel}
        <Typography sx={{ fontSize: "13px", color: "#6c718a" }}>
          {credit.contact_name} · credit left {formatINR(credit.balance)}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {docs === null ? (
          <Box sx={{ py: 4, textAlign: "center" as const }}>
            <CircularProgress size={24} />
          </Box>
        ) : docs.length === 0 ? (
          <Typography sx={{ fontSize: "14px", py: 2 }}>
            {credit.contact_name} has no open {cfg.documentsLabel}.
          </Typography>
        ) : (
          <>
            <Box sx={{ textAlign: "right" as const, mb: 1 }}>
              <Button size="small" onClick={autoFill} sx={{ textTransform: "none" as const }}>
                Fill automatically
              </Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>{cfg.documentLabel} #</TableCell>
                  <TableCell sx={headerCellSx}>Date</TableCell>
                  <TableCell sx={headerCellSx} align="right">Total</TableCell>
                  <TableCell sx={headerCellSx} align="right">Due</TableCell>
                  <TableCell sx={{ ...headerCellSx, width: 150 }} align="right">Apply</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {docs.map((d) => (
                  <TableRow key={d.document_id} sx={{ "& td": { fontSize: "13px" } }}>
                    <TableCell>{d.document_number}</TableCell>
                    <TableCell>{fmtDate(d.date)}</TableCell>
                    <TableCell align="right">{formatINR(d.total)}</TableCell>
                    <TableCell align="right">{formatINR(d.balance)}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="0.00"
                        value={amounts[d.document_id] || ""}
                        error={!isValidAmount(amounts[d.document_id] || "")}
                        onChange={(e) => setAmounts((p) => ({ ...p, [d.document_id]: (e.target as any).value }))}
                        inputProps={{ inputMode: "decimal", style: { textAlign: "right" as const } }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ "& td": { fontSize: "13px", fontWeight: 600, border: 0 } }}>
                  <TableCell colSpan={4} align="right">Total applied</TableCell>
                  <TableCell align="right">{formatINR((totalPaise as number) / 100)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions data-rbac-ignore sx={{ px: 3, justifyContent: "space-between" as const }}>
        <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>{docs?.length ? problems[0] || "Ready to apply." : ""}</Typography>
        <Box>
          <Button onClick={onClose} sx={{ textTransform: "none" as const, mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving || !docs?.length || problems.length > 0}
            onClick={save}
            sx={{ textTransform: "none" as const, fontWeight: 600 }}
          >
            {saving ? "Applying…" : "Apply credit"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function RefundDialog({ cfg, credit, orgId, onClose, onDone }: any) {
  const { showMessage } = useSnackbar();
  const [accounts, setAccounts] = useState<any>([]);
  const [amount, setAmount] = useState(String(credit.balance));
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [account, setAccount] = useState<any>(null);
  const [mode, setMode] = useState("Bank Transfer");
  const [reference, setReference] = useState<any>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService({ method: "GET", url: `${cfg.api}/lookups`, params: { org_id: orgId } });
        setAccounts((res.data?.data?.accounts || []).filter((a) => ["cash", "bank"].includes(a.account_type)));
      } catch (err) {
        setError("Couldn't load cash and bank accounts");
      }
    })();
  }, [cfg, orgId]);

  const problems: any[] = [];
  if (!isValidAmount(amount) || !(toPaise(amount) > 0)) problems.push("Enter the refund amount.");
  else if (toPaise(amount) > toPaise(credit.balance)) problems.push(`Only ${formatINR(credit.balance)} is left to refund.`);
  if (!date) problems.push("Pick a date.");
  if (!account) problems.push("Choose the cash or bank account.");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await apiService({
        method: "POST",
        url: `${cfg.api}/${credit.credit_number}/refund`,
        params: { org_id: orgId },
        data: { amount: Number(amount), date, account_id: account.account_id, mode, reference_number: reference },
      });
      showMessage("Refund recorded");
      onDone();
    } catch (err) {
      setError(err?.message || "Couldn't record the refund");
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: "16px" }}>
        Record refund for {credit.credit_number}
        <Typography sx={{ fontSize: "13px", color: "#6c718a" }}>{cfg.refundHint}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "grid" as const, gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Amount *"
            size="small"
            value={amount}
            error={!isValidAmount(amount)}
            onChange={(e) => setAmount((e.target as any).value)}
            inputProps={{ inputMode: "decimal" }}
          />
          <TextField
            label="Date *"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate((e.target as any).value)}
            InputLabelProps={{ shrink: true }}
          />
          <Autocomplete
            size="small"
            options={accounts}
            getOptionLabel={(o) => o.account_name}
            isOptionEqualToValue={(o, v) => o.account_id === v.account_id}
            value={account}
            onChange={(_, v) => setAccount(v)}
            renderInput={(params) => <TextField {...params} label={cfg === CREDIT_KINDS.sales ? "Paid from *" : "Deposited to *"} />}
          />
          <Autocomplete
            size="small"
            options={["Bank Transfer", "Cash", "Cheque", "UPI", "Credit Card"]}
            value={mode}
            onChange={(_, v) => setMode(v || "")}
            renderInput={(params) => <TextField {...params} label="Mode" />}
          />
          <TextField
            label="Reference #"
            size="small"
            value={reference}
            onChange={(e) => setReference((e.target as any).value)}
            inputProps={{ maxLength: 100 }}
            sx={{ gridColumn: "1 / -1" }}
          />
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions data-rbac-ignore sx={{ px: 3, justifyContent: "space-between" as const }}>
        <Typography sx={{ fontSize: "12px", color: "#6c718a" }}>{problems[0] || "Ready to save."}</Typography>
        <Box>
          <Button onClick={onClose} sx={{ textTransform: "none" as const, mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving || problems.length > 0}
            onClick={save}
            sx={{ textTransform: "none" as const, fontWeight: 600 }}
          >
            {saving ? "Saving…" : "Record refund"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
