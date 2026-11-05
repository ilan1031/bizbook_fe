"use client";

// Settings > Invoice & Quote Templates: what invoices and quotes look like
// for this organisation (on their pages, in PDFs and when printed), with a
// live preview. The logo and name in the header are the organisation's own.
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
import OrgLogoField from "../../common/OrgLogoField";

export default function TemplatesPage(_props?: any) {
  const perms = usePermissions();
  const { showMessage } = useSnackbar() || {};
  const canEdit = Boolean(perms?.can("templates", "edit"));
  const [kind, setKind] = useState<string>("invoice");
  const [templates, setTemplates] = useState<any>(null);
  const [org, setOrg] = useState<any>({});
  const [error, setError] = useState<any>("");
  const [saving, setSaving] = useState<boolean>(false);

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

  // Same limits as the server (docTemplateController); longer text is
  // flagged here and refused on save rather than silently cut.
  const LIMITS = { title: 60, subtitle: 80, tagline: 200, terms: 3000, note: 1000, signatory: 100, footer: 300 };
  const text = (key, labelText, props = {} as any) => {
    const max = LIMITS[key];
    const len = String(s[key] ?? "").length;
    const over = max && len > max;
    const hint = max ? `${len}/${max}${over ? ` - at most ${max} characters` : ""}` : null;
    return (
      <TextField
        size="small"
        label={labelText}
        value={s[key] ?? ""}
        onChange={(e) => set({ [key]: (e.target as any).value })}
        disabled={!canEdit}
        {...props}
        error={Boolean(over) || props.error}
        helperText={
          props.helperText || hint ? (
            <>
              {props.helperText}
              {props.helperText && hint ? " · " : ""}
              {hint}
            </>
          ) : undefined
        }
      />
    );
  };
  const toggle = (key, labelText) => (
    <FormControlLabel
      control={<Switch size="small" checked={s[key] !== false} onChange={(e) => set({ [key]: e.target.checked })} disabled={!canEdit} />}
      label={<Typography fontSize={13}>{labelText}</Typography>}
    />
  );

  return (
    <Box sx={{ p: 3, display: "flex" as const, gap: 3, alignItems: "flex-start" as const, flexWrap: "wrap" as const }}>
      <Paper variant="outlined" sx={{ p: 2.5, width: 380, flexShrink: 0 }}>
        <Typography variant="h6" fontSize={18} fontWeight={600}>
          Invoice & Quote Templates
        </Typography>
        <Typography fontSize={13} color="text.secondary" mb={1.5}>
          Used on invoice and quote pages, their PDFs and printouts.
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
          <TextField select size="small" label="Layout" value={s.style} onChange={(e) => set({ style: (e.target as any).value })} disabled={!canEdit}>
            <MenuItem value="detailed">Detailed GST layout</MenuItem>
            <MenuItem value="standard">Standard (the app&apos;s built-in layout)</MenuItem>
          </TextField>
          {text("title", "Title", { helperText: kind === "invoice" ? "e.g. TAX INVOICE or PROFORMA INVOICE" : "e.g. QUOTATION" })}
          {text("subtitle", "Subtitle", { helperText: "e.g. NOT A TAX INVOICE" })}
          {text("tagline", "Company tagline")}
          <Stack direction="row" spacing={1} alignItems="center">
            {text("accent", "Accent colour", { sx: { flex: 1 } })}
            <input type="color" value={s.accent} onChange={(e) => set({ accent: (e.target as any).value })} disabled={!canEdit} aria-label="Pick accent colour" />
          </Stack>
          <Divider />
          <Typography fontSize={13} fontWeight={600}>
            {org.org_name || "Organisation"} logo
          </Typography>
          <OrgLogoField
            organizationId={org.organization_id}
            logo={org.logo}
            onChange={(logo) => setOrg((o) => ({ ...o, logo }))}
            disabled={!canEdit}
          />
          <Typography fontSize={11.5} color="text.secondary">
            The organisation&apos;s logo and name head every invoice and quote. It&apos;s saved straight away.
          </Typography>
          {s.logo && !org.logo && canEdit && (
            <Alert severity="info" action={<Button size="small" onClick={() => set({ logo: "" })}>Remove</Button>}>
              Showing the logo saved on this template earlier. Upload one for the organisation, or remove it and save.
            </Alert>
          )}
          <Divider />
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
            <TextField
              key={key}
              size="small"
              label={l}
              value={s.bank?.[key] || ""}
              onChange={(e) => setBank({ [key]: (e.target as any).value })}
              disabled={!canEdit}
              inputProps={{ maxLength: { account_no: 40, ifsc: 20 }[key] || 100 }}
            />
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
      <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" as const, bgcolor: "#eef0f4", p: 2, borderRadius: 1 }}>
        <Typography fontSize={12} color="text.secondary" mb={1}>
          Preview with sample data
        </Typography>
        {s.style === "standard" ? (
          <Alert severity="info">The standard layout uses the app&apos;s built-in layout on the invoice and quote pages.</Alert>
        ) : (
          <Box sx={{ boxShadow: 2, width: "fit-content", mx: "auto" }}>
            <DocumentTemplate doc={sample} org={org} customer={{}} settings={s} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
