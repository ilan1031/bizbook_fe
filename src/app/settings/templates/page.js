"use client";

// Settings > Invoice & Quote Templates: what printed invoices and quotes look
// like for this organisation, with a live preview.
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import apiService from "../../../services/axiosService";
import { usePermissions } from "../../../services/PermissionProvider";
import { useSnackbar } from "../../../components/SnackbarProvider";
import DocumentTemplate, { SAMPLE_DOC } from "../../common/templates/DocumentTemplate";

const MAX_LOGO_BYTES = 300 * 1024;

export default function TemplatesPage() {
  const perms = usePermissions();
  const { showMessage } = useSnackbar() || {};
  const canEdit = Boolean(perms?.can("templates", "edit"));
  const [kind, setKind] = useState("invoice");
  const [templates, setTemplates] = useState(null);
  const [org, setOrg] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const orgId = localStorage.getItem("organization_id");
    (async () => {
      try {
        const [t, o] = await Promise.all([
          apiService({ method: "GET", url: "api/v1/org/templates", params: { organization_id: orgId } }),
          apiService({ method: "POST", url: "api/v1/org/get-organisation" }),
        ]);
        setTemplates(t.data.data);
        setOrg((o.data.data || []).find((x) => String(x.organization_id) === String(orgId)) || {});
      } catch (e) {
        setError(e?.message || "Couldn't load the templates.");
      }
    })();
  }, []);

  const s = templates?.[kind];
  const set = (patch) => setTemplates((t) => ({ ...t, [kind]: { ...t[kind], ...patch } }));
  const setBank = (patch) => set({ bank: { ...s.bank, ...patch } });
  const sample = useMemo(() => SAMPLE_DOC(kind), [kind]);

  const onLogo = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) return showMessage?.("The logo must be under 300 KB.", "error");
    const reader = new FileReader();
    reader.onload = () => set({ logo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    try {
      const r = await apiService({
        method: "PUT",
        url: `api/v1/org/templates/${kind}`,
        params: { organization_id: localStorage.getItem("organization_id") },
        data: s,
      });
      set(r.data.data);
      showMessage?.(`${kind === "invoice" ? "Invoice" : "Quote"} template saved`, "success");
    } catch (e) {
      showMessage?.(e?.message || "Couldn't save the template.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  if (!templates) return <CircularProgress sx={{ m: 4 }} size={24} />;

  const text = (key, labelText, props = {}) => (
    <TextField size="small" label={labelText} value={s[key] ?? ""} onChange={(e) => set({ [key]: e.target.value })} disabled={!canEdit} {...props} />
  );
  const toggle = (key, labelText) => (
    <FormControlLabel
      control={<Switch size="small" checked={s[key] !== false} onChange={(e) => set({ [key]: e.target.checked })} disabled={!canEdit} />}
      label={<Typography fontSize={13}>{labelText}</Typography>}
    />
  );

  return (
    <Box sx={{ p: 3, display: "flex", gap: 3, alignItems: "flex-start", flexWrap: "wrap" }}>
      <Paper variant="outlined" sx={{ p: 2.5, width: 380, flexShrink: 0 }}>
        <Typography variant="h6" fontSize={18} fontWeight={600}>
          Invoice & Quote Templates
        </Typography>
        <Typography fontSize={13} color="text.secondary" mb={1.5}>
          Used when you print or save a PDF of an invoice or quote.
        </Typography>
        <Tabs value={kind} onChange={(_, v) => setKind(v)} sx={{ mb: 2 }}>
          <Tab value="invoice" label="Invoice" />
          <Tab value="quote" label="Quote" />
        </Tabs>
        {!canEdit && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You can view the templates. Ask your administrator for edit access to change them.
          </Alert>
        )}
        <Stack spacing={1.5}>
          <TextField select size="small" label="Layout" value={s.style} onChange={(e) => set({ style: e.target.value })} disabled={!canEdit}>
            <MenuItem value="terranova">Detailed GST layout (Terranova)</MenuItem>
            <MenuItem value="standard">Standard (the app&apos;s built-in PDF)</MenuItem>
          </TextField>
          {text("title", "Title", { helperText: kind === "invoice" ? "e.g. TAX INVOICE or PROFORMA INVOICE" : "e.g. QUOTATION" })}
          {text("subtitle", "Subtitle", { helperText: "e.g. NOT A TAX INVOICE" })}
          {text("tagline", "Company tagline")}
          <Stack direction="row" spacing={1} alignItems="center">
            {text("accent", "Accent colour", { sx: { flex: 1 } })}
            <input type="color" value={s.accent} onChange={(e) => set({ accent: e.target.value })} disabled={!canEdit} aria-label="Pick accent colour" />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" component="label" size="small" disabled={!canEdit}>
              {s.logo ? "Change logo" : "Upload logo"}
              <input hidden type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={onLogo} />
            </Button>
            {s.logo && (
              <Button size="small" color="error" onClick={() => set({ logo: "" })} disabled={!canEdit}>
                Remove logo
              </Button>
            )}
          </Stack>
          {text("advance_percent", "Advance payable (%)", { type: "number", inputProps: { min: 0, max: 100 } })}
          <Divider />
          {toggle("show_ship_to", "Show Ship To")}
          {toggle("show_supply_details", "Show supply details")}
          {toggle("show_hsn_summary", "Show HSN tax summary")}
          {toggle("show_amount_in_words", "Show amount in words")}
          <Divider />
          <Typography fontSize={13} fontWeight={600}>
            Bank details
          </Typography>
          {[
            ["account_name", "Account name"],
            ["bank", "Bank"],
            ["account_no", "Account number"],
            ["ifsc", "IFSC"],
            ["branch", "Branch"],
            ["upi", "UPI ID"],
          ].map(([key, l]) => (
            <TextField key={key} size="small" label={l} value={s.bank?.[key] || ""} onChange={(e) => setBank({ [key]: e.target.value })} disabled={!canEdit} />
          ))}
          <Divider />
          {text("terms", "Terms (one per line)", { multiline: true, minRows: 3 })}
          {text("note", "Note", { multiline: true, minRows: 2 })}
          {text("signatory", "Signatory name")}
          {text("footer", "Footer")}
          {canEdit && (
            <Button variant="contained" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save template"}
            </Button>
          )}
        </Stack>
      </Paper>
      <Box sx={{ flex: 1, minWidth: 0, overflow: "auto", bgcolor: "#eef0f4", p: 2, borderRadius: 1 }}>
        <Typography fontSize={12} color="text.secondary" mb={1}>
          Preview with sample data
        </Typography>
        {s.style === "standard" ? (
          <Alert severity="info">The standard layout uses the app&apos;s built-in PDF on the invoice and quote pages.</Alert>
        ) : (
          <Box sx={{ boxShadow: 2, width: "fit-content", mx: "auto" }}>
            <DocumentTemplate doc={sample} org={org} customer={{}} settings={s} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
