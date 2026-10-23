"use client";

// The organisation's logo, printed on invoices and quotes. Saved on the
// organisation itself (PUT /organization/:id), so every template uses it.
import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";

export const MAX_LOGO_BYTES = 300 * 1024;
export const LOGO_ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp";

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });

// Saves `logo` ("" removes it) and returns it.
export const saveOrgLogo = async (organizationId, logo) => {
  await apiService({ method: "PUT", url: `api/v1/organization/${organizationId}`, data: { logo } });
  return logo;
};

// Reads the picked file and saves it; returns the new logo, or null if
// nothing was saved (a message has already been shown).
export const uploadOrgLogo = async (organizationId, file, showMessage) => {
  if (!file) return null;
  if (file.size > MAX_LOGO_BYTES) {
    showMessage?.("The logo must be under 300 KB.", "error");
    return null;
  }
  try {
    const logo = await saveOrgLogo(organizationId, await readAsDataUrl(file));
    showMessage?.("Logo saved", "success");
    return logo;
  } catch (e) {
    showMessage?.(e?.message || "Couldn't save the logo.", "error");
    return null;
  }
};

export default function OrgLogoField({ organizationId, logo, onChange, disabled }) {
  const { showMessage } = useSnackbar() || {};
  const [busy, setBusy] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setBusy(true);
    const saved = await uploadOrgLogo(organizationId, file, showMessage);
    setBusy(false);
    if (saved !== null) onChange?.(saved);
  };

  const remove = async () => {
    setBusy(true);
    try {
      onChange?.(await saveOrgLogo(organizationId, ""));
      showMessage?.("Logo removed", "success");
    } catch (err) {
      showMessage?.(err?.message || "Couldn't remove the logo.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 120,
          height: 60,
          border: "1px dashed #c4c4c4",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fafafa",
          flexShrink: 0,
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Organisation logo" style={{ maxWidth: 110, maxHeight: 52 }} />
        ) : (
          <Typography fontSize={12} color="text.secondary">
            No logo
          </Typography>
        )}
      </Box>
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" component="label" size="small" disabled={disabled || busy || !organizationId}>
            {logo ? "Change logo" : "Upload logo"}
            <input hidden type="file" accept={LOGO_ACCEPT} onChange={onFile} />
          </Button>
          {logo && (
            <Button size="small" color="error" onClick={remove} disabled={disabled || busy}>
              Remove
            </Button>
          )}
        </Stack>
        <Typography fontSize={11.5} color="text.secondary">
          PNG, JPG, SVG or WebP, under 300 KB.
        </Typography>
      </Stack>
    </Stack>
  );
}
