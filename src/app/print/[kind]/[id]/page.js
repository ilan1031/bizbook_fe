"use client";

// Print / save-as-PDF view of an invoice or quote in the organisation's
// template: /print/invoice/<invoice_id> or /print/quote/<quote_id>.
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Stack } from "@mui/material";
import apiService from "../../../../services/axiosService";
import DocumentTemplate, { toTemplateDoc } from "../../../common/templates/DocumentTemplate";

const SOURCES = {
  invoice: { url: (id) => `api/v1/invoices/${id}`, key: "invoice", back: (id) => `/sales/invoices/${id}` },
  quote: { url: (id) => `api/v1/estimates/${id}`, key: "estimate", back: (id) => `/sales/quotes/${id}` },
};

export default function PrintDocumentPage() {
  const { kind, id } = useParams();
  const router = useRouter();
  const [state, setState] = useState({ loading: true });
  const source = SOURCES[kind];

  useEffect(() => {
    if (!source) return;
    const orgId = localStorage.getItem("organization_id");
    (async () => {
      try {
        const [docRes, tplRes] = await Promise.all([
          apiService({ method: "GET", url: source.url(id), params: { organization_id: orgId } }),
          apiService({ method: "GET", url: "api/v1/org/templates", params: { organization_id: orgId } }),
        ]);
        const raw = docRes.data[source.key];
        let customer = {};
        if (raw?.customer_id) {
          try {
            const c = await apiService({ method: "GET", url: `api/v1/contact/${raw.customer_id}`, params: { organization_id: orgId } });
            customer = c.data.data || {};
          } catch {
            customer = {};
          }
        }
        setState({
          loading: false,
          doc: toTemplateDoc(kind, raw || {}),
          org: docRes.data.organization || {},
          customer,
          settings: tplRes.data.data[kind],
        });
      } catch (e) {
        setState({ loading: false, error: e?.message || "Couldn't load the document." });
      }
    })();
  }, [id, kind, source]);

  if (!source) return <Alert severity="error" sx={{ m: 3 }}>Unknown document type.</Alert>;
  if (state.loading) return <CircularProgress sx={{ m: 4 }} size={24} />;
  if (state.error) return <Alert severity="error" sx={{ m: 3 }}>{state.error}</Alert>;

  return (
    <Box sx={{ bgcolor: "#eef0f4", minHeight: "100%", py: 2, "@media print": { bgcolor: "#fff", py: 0 } }}>
      <style>{`@media print { @page { size: A4; margin: 0; } body * { visibility: hidden; } .doc-template, .doc-template * { visibility: visible; } .doc-template { position: absolute; left: 0; top: 0; } }`}</style>
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2, "@media print": { display: "none" } }}>
        <Button variant="outlined" onClick={() => router.push(source.back(id))}>
          Back
        </Button>
        <Button variant="contained" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </Stack>
      {state.settings?.style === "standard" && (
        <Alert severity="info" sx={{ maxWidth: 700, mx: "auto", mb: 2, "@media print": { display: "none" } }}>
          This organisation uses the standard layout; showing the detailed layout here. Change it under Invoice &amp;
          Quote Templates.
        </Alert>
      )}
      <Box sx={{ boxShadow: 2, width: "fit-content", mx: "auto", "@media print": { boxShadow: "none" } }}>
        <DocumentTemplate doc={state.doc} org={state.org} customer={state.customer} settings={state.settings} />
      </Box>
    </Box>
  );
}
