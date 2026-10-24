"use client";

// The signed-in user's own account: details, approved devices and password.
import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import apiService from "../../services/axiosService";
import { usePermissions } from "../../services/PermissionProvider";

const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-");
const MAX_IMAGE_SIZE = 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const readImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Couldn't preview this image."));
    };
    reader.onerror = () => reject(new Error("Couldn't read this image."));
    reader.readAsDataURL(file);
  });

function Section({ title, children, action }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontSize={17}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Paper>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ company_name: "", mobile: "", country: "", state: "", profile_image: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [organization, setOrganization] = useState(null);
  const [organizationForm, setOrganizationForm] = useState({});
  const [organizationSaving, setOrganizationSaving] = useState(false);
  const [organizationSaved, setOrganizationSaved] = useState("");
  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwBusy, setPwBusy] = useState(false);
  const me = usePermissions()?.me;

  const load = async () => {
    try {
      const res = await apiService({ method: "GET", url: "api/v1/user/profile" });
      const p = res.data?.data;
      setProfile(p);
      setForm({
        company_name: p.company_name || "",
        mobile: p.mobile || "",
        country: p.country || "",
        state: p.state || "",
        profile_image: p.profile_image || "",
      });
      const organizationId = localStorage.getItem("organization_id");
      if (organizationId) {
        const orgRes = await apiService({
          method: "GET",
          url: `api/v1/organization/${encodeURIComponent(organizationId)}`,
        });
        const org = orgRes.data?.data;
        setOrganization(org);
        setOrganizationForm({
          org_name: org.org_name || "",
          email: org.email || "",
          phone: org.phone || "",
          country: org.country || "",
          state: org.state || "",
          city: org.city || "",
          first_street: org.first_street || "",
          second_street: org.second_street || "",
          zip: org.zip || "",
          gst_in: org.gst_in || "",
          industry_type: org.industry_type || org.industry_name || "",
          org_image: org.org_image || "",
        });
      } else {
        setOrganization(null);
        setOrganizationForm({});
      }
    } catch (e) {
      setError(e?.message || "Couldn't load your profile.");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setSaved("");
    setError("");
    try {
      await apiService({ method: "PATCH", url: "api/v1/user/profile", data: form });
      window.dispatchEvent(new CustomEvent("profile-image-updated", { detail: form.profile_image }));
      setSaved("Profile saved.");
      await load();
    } catch (e) {
      setError(e?.message || "Couldn't save the profile.");
    } finally {
      setSaving(false);
    }
  };

  const saveOrganization = async () => {
    if (!organization?.organization_id) return;
    setOrganizationSaving(true);
    setOrganizationSaved("");
    setError("");
    try {
      await apiService({
        method: "PUT",
        url: `api/v1/organization/${encodeURIComponent(organization.organization_id)}`,
        data: organizationForm,
      });
      window.dispatchEvent(
        new CustomEvent("organization-image-updated", {
          detail: { organization_id: organization.organization_id, org_image: organizationForm.org_image },
        })
      );
      setOrganizationSaved("Organization saved.");
      await load();
    } catch (e) {
      setError(e?.message || "Couldn't save the organization.");
    } finally {
      setOrganizationSaving(false);
    }
  };

  const handleImageChange = async (event, setter, fieldName, label) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setError(`${label} must be a PNG, JPG or WebP image.`);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError(`${label} must be smaller than 1 MB.`);
      return;
    }
    setError("");
    try {
      const image = await readImage(file);
      setter((current) => ({ ...current, [fieldName]: image }));
    } catch (e) {
      setError(e?.message || `Couldn't read the ${label.toLowerCase()}.`);
    }
  };

  const changePassword = async () => {
    setPwMsg(null);
    if (pw.new_password !== pw.confirm) {
      setPwMsg({ type: "error", text: "The new passwords don't match." });
      return;
    }
    setPwBusy(true);
    try {
      await apiService({
        method: "POST",
        url: "api/v1/user/change-password",
        data: { current_password: pw.current_password, new_password: pw.new_password },
      });
      setPw({ current_password: "", new_password: "", confirm: "" });
      setPwMsg({ type: "success", text: "Password changed. Use the new one next time you sign in." });
    } catch (e) {
      setPwMsg({ type: "error", text: e?.message || "Couldn't change the password." });
    } finally {
      setPwBusy(false);
    }
  };

  if (!profile) {
    return (
      <Box sx={{ p: 4 }}>
        {error ? <Alert severity="error">{error}</Alert> : <CircularProgress size={24} />}
      </Box>
    );
  }

  const field = (key, label) => (
    <TextField
      label={label}
      size="small"
      fullWidth
      value={form[key] || ""}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
    />
  );

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Typography variant="h5" fontSize={22} fontWeight={600} mb={0.5}>
        My profile
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <Typography color="text.secondary">{profile.email}</Typography>
        <Chip size="small" label={profile.role === "superadmin" ? "Superadmin" : "User"} />
        <Chip size="small" color={profile.status === "active" ? "success" : "default"} label={profile.status} />
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Section
        title="Details"
        action={
          <Button variant="contained" size="small" onClick={saveProfile} disabled={saving} sx={{ textTransform: "none" }}>
            {saving ? "Saving..." : "Save"}
          </Button>
        }
      >
        {saved && <Alert severity="success" sx={{ mb: 2 }}>{saved}</Alert>}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          {field("company_name", "Company name")}
          {field("mobile", "Mobile")}
          {field("country", "Country")}
          {field("state", "State")}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography fontSize={13} color="text.secondary">
          Member since {fmt(profile.created_at)} · Last sign-in {fmt(profile.last_login_at)}
        </Typography>
      </Section>

      <Section
        title="Profile photo"
        action={
          <Button variant="contained" size="small" onClick={saveProfile} disabled={saving} sx={{ textTransform: "none" }}>
            {saving ? "Saving..." : "Save"}
          </Button>
        }
      >
        {saved && <Alert severity="success" sx={{ mb: 2 }}>{saved}</Alert>}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <Avatar src={form.profile_image || undefined} alt="Profile photo" sx={{ width: 88, height: 88 }} />
          <Stack direction="row" spacing={1}>
            <Button component="label" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />} sx={{ textTransform: "none" }}>
              Choose photo
              <input
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => handleImageChange(event, setForm, "profile_image", "Profile photo")}
              />
            </Button>
            {form.profile_image && (
              <Button onClick={() => setForm((current) => ({ ...current, profile_image: "" }))} sx={{ textTransform: "none" }}>
                Remove
              </Button>
            )}
          </Stack>
          <Typography fontSize={13} color="text.secondary">PNG, JPG or WebP, up to 1 MB.</Typography>
        </Stack>
      </Section>

      <Section
        title="Organization"
        action={
          organization && (
            <Button
              variant="contained"
              size="small"
              onClick={saveOrganization}
              disabled={organizationSaving}
              sx={{ textTransform: "none" }}
            >
              {organizationSaving ? "Saving..." : "Save"}
            </Button>
          )
        }
      >
        {!organization ? (
          <Alert severity="info">Choose an organization to edit its details and logo.</Alert>
        ) : (
          <>
            {organizationSaved && <Alert severity="success" sx={{ mb: 2 }}>{organizationSaved}</Alert>}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={3}>
              <Avatar
                variant="rounded"
                src={organizationForm.org_image || undefined}
                alt="Organization logo"
                sx={{ width: 88, height: 88 }}
              >
                {(organizationForm.org_name || "O").slice(0, 1)}
              </Avatar>
              <Stack direction="row" spacing={1}>
                <Button component="label" variant="outlined" startIcon={<PhotoCameraOutlinedIcon />} sx={{ textTransform: "none" }}>
                  Choose logo
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => handleImageChange(event, setOrganizationForm, "org_image", "Organization logo")}
                  />
                </Button>
                {organizationForm.org_image && (
                  <Button
                    onClick={() => setOrganizationForm((current) => ({ ...current, org_image: "" }))}
                    sx={{ textTransform: "none" }}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
              <Typography fontSize={13} color="text.secondary">PNG, JPG or WebP, up to 1 MB.</Typography>
            </Stack>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              {[
                ["org_name", "Organization name"],
                ["email", "Business email"],
                ["phone", "Phone"],
                ["country", "Country"],
                ["state", "State"],
                ["city", "City"],
                ["first_street", "Address line 1"],
                ["second_street", "Address line 2"],
                ["zip", "Postal code"],
                ["gst_in", "GSTIN"],
                ["industry_type", "Industry"],
              ].map(([key, label]) => (
                <TextField
                  key={key}
                  label={label}
                  size="small"
                  fullWidth
                  value={organizationForm[key] || ""}
                  onChange={(event) =>
                    setOrganizationForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              ))}
            </Box>
          </>
        )}
      </Section>

      {me && !me.is_superadmin && (
        <Section title="Usage and limits">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>New records</TableCell>
                <TableCell align="right">Created</TableCell>
                <TableCell align="right">Limit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ["Today", "day", "per_day"],
                ["This month", "month", "per_month"],
                ["This year", "year", "per_year"],
              ].map(([label, used, limit]) => (
                <TableRow key={used}>
                  <TableCell>{label}</TableCell>
                  <TableCell align="right">{me.usage?.[used] ?? 0}</TableCell>
                  <TableCell align="right">{Number.isInteger(me.limits?.[limit]) ? me.limits[limit] : "No limit"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography fontSize={13} color="text.secondary" mt={1.5}>
            Organisations allowed:{" "}
            {Number.isInteger(me.limits?.max_organizations) ? me.limits.max_organizations : "no limit"}. Ask your
            administrator if you need more.
          </Typography>
        </Section>
      )}

      <Section title={`Approved devices (${profile.devices.length} of ${profile.ip_limit})`}>
        <Typography fontSize={13} color="text.secondary" mb={1.5}>
          {profile.role === "superadmin"
            ? "The superadmin can sign in from any device, so no addresses are kept."
            : `You can sign in from up to ${profile.ip_limit} IP addresses. Ask your administrator to remove one you no longer use.`}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>IP address</TableCell>
              <TableCell>Browser</TableCell>
              <TableCell>Added</TableCell>
              <TableCell>Last sign-in</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profile.devices.map((d) => (
              <TableRow key={d.ip}>
                <TableCell>{d.ip}</TableCell>
                <TableCell sx={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.user_agent || "-"}
                </TableCell>
                <TableCell>{fmt(d.added_at)}</TableCell>
                <TableCell>{fmt(d.last_login_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Change password">
        {pwMsg && <Alert severity={pwMsg.type} sx={{ mb: 2 }}>{pwMsg.text}</Alert>}
        <Stack spacing={2} sx={{ maxWidth: 380 }}>
          <TextField
            type="password"
            size="small"
            label="Current password"
            autoComplete="current-password"
            value={pw.current_password}
            onChange={(e) => setPw({ ...pw, current_password: e.target.value })}
          />
          <TextField
            type="password"
            size="small"
            label="New password"
            autoComplete="new-password"
            helperText="At least 8 characters, with an uppercase letter, a number and a special character."
            value={pw.new_password}
            onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
          />
          <TextField
            type="password"
            size="small"
            label="Confirm new password"
            autoComplete="new-password"
            value={pw.confirm}
            onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
          />
          <Box>
            <Button
              variant="contained"
              onClick={changePassword}
              disabled={pwBusy || !pw.current_password || !pw.new_password}
              sx={{ textTransform: "none" }}
            >
              {pwBusy ? "Changing..." : "Change password"}
            </Button>
          </Box>
        </Stack>
      </Section>
    </Box>
  );
}
