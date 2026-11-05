"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton,
  Divider,
  Container,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BusinessIcon from "@mui/icons-material/Business";
import Button from "../common/btn/Button";
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";
import { useRouter } from "next/navigation";
import { LOGO_ACCEPT, saveOrgLogo, uploadOrgLogo } from "../common/OrgLogoField";
const OrganizationPage = (_props?: any) => {
  const [menuOpenIndex, setMenuOpenIndex] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const { showMessage } = useSnackbar();
  const [orgData, setOrgData] = useState<any>([]);
  const [adminData, setAdminData] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    getOrg();
    getUserData();
  }, []);
  const handleSetDefault = async () => {
    const org = orgData.find((o) => o._id === menuOpenIndex);
    setAnchorEl(null);
    if (!org) return;
    try {
      const res = await apiService({
        url: `api/v1/organization/update-default-status?organization_id=${org.organization_id}`,
        method: "POST",
      });
      showMessage(res.data?.message || "Default organisation updated", "success");
      getOrg();
    } catch (error) {
      showMessage(error?.message || "Couldn't set the default organisation.", "error");
    }
  };
  // Switch to this organisation (like the org switcher in the top bar).
  const goToOrganization = (org) => {
    localStorage.setItem("organization_id", org.organization_id);
    window.location.href = "/home";
  };
  // Logos are printed on the organisation's invoices and quotes.
  const setLogo = (organizationId, logo) =>
    setOrgData((list) => list.map((o) => (o.organization_id === organizationId ? { ...o, logo } : o)));
  const onLogoFile = async (org, e) => {
    const file = e.target.files?.[0];
    (e.target as any).value = "";
    const logo = await uploadOrgLogo(org.organization_id, file, showMessage);
    if (logo !== null) setLogo(org.organization_id, logo);
  };
  const handleRemoveLogo = async () => {
    const org = orgData.find((o) => o._id === menuOpenIndex);
    setAnchorEl(null);
    if (!org) return;
    try {
      setLogo(org.organization_id, await saveOrgLogo(org.organization_id, ""));
      showMessage("Logo removed", "success");
    } catch (e) {
      showMessage(e?.message || "Couldn't remove the logo.", "error");
    }
  };
  const getOrg = async () => {
    try {
      let params = {
        url: "api/v1/org/get-organisation",
        method: "POST",
      };
      let response = await apiService(params);
      //   console.log("response", response);
      if (response.statusCode == 200) {
        setOrgData(response.data.data);
      }
    } catch (error) {
      console.log("getOrg error", error);
    }
  };
  const getUserData = async () => {
    try {
      let params = {
        url: "api/v1/user/get-admin",
        method: "POST",
      };
      let res = await apiService(params);
      if (res.statusCode == 200) {
        setAdminData(res.data.data);
      }
    } catch (error) {
      console.log("Something went wrong..!");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: { xs: 2, md: 2 } }}>
      {/* Top bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <BusinessIcon sx={{ color: "#2563eb" }} />
          <Typography variant="h6" fontWeight={600}>
            Books
          </Typography>
        </Box>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "#ea580c",
            color: "white",
            display: "flex" as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          S
        </Box>
      </Box>

      {/* Info Alert */}
      {/* <Box
        bgcolor="#f9fafb"
        p={2}
        borderRadius={2}
        mb={3}
        fontSize={14}
        color="gray"
      >
        📋 If you have a Zoho Invoice organization, migrate to Zoho Books to
        experience end-to-end accounting.{" "}
        <Typography component="span" color="#3b82f6" sx={{ cursor: "pointer" as const }}>
          View Organization
        </Typography>
      </Box> */}

      {/* Content */}
      <Container>
        <Box>
          <Typography
            variant="body1"
            fontWeight={500}
            color="text.primary"
            mb={0.5}
          >
            Hi, {adminData.company_name}!
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            You are a part of the following organizations. Go to the
            organization which you wish to access now.
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              component="div"
              variant="body1"
              fontWeight={600}
              mb={2}
              display="flex"
              alignItems="center"
            >
              My Organizations{" "}
              <Chip
                label={orgData.length}
                size="small"
                sx={{ ml: 1, backgroundColor: "#f3f4f6", fontWeight: 500 }}
              />
            </Typography>

            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: "none" as const }}
              fontSize="12px"
              onClick={() => router.push("/organisation/organisationsetuppage")}
            >
              New Organization
            </Button>
          </Box>
          <Container maxWidth="md">
            {/* Org Card */}
            {orgData.length == 0 ? (
              <>
                <Typography variant="body1" fontWeight={600}>
                  There is no organization
                </Typography>
              </>
            ) : (
              <>
                {orgData.length &&
                  orgData.map((data, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            position: "relative" as const,
                          }}
                        >
                          {/* DEFAULT Ribbon */}
                          {data.org_type == "default" ? (
                            <>
                              <Chip
                                label="DEFAULT"
                                size="small"
                                sx={{
                                  position: "absolute" as const,
                                  top: -10,
                                  left: -10,
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  fontWeight: 600,
                                  fontSize: 10,
                                  px: 1,
                                  zIndex: 1,
                                }}
                              />
                            </>
                          ) : (
                            <></>
                          )}

                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <Tooltip title={data.logo ? "Change logo" : "Upload logo"}>
                                <Box
                                  component="label"
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: "#f3f4f6",
                                    borderRadius: 2,
                                    display: "flex" as const,
                                    alignItems: "center" as const,
                                    justifyContent: "center" as const,
                                    cursor: "pointer" as const,
                                    overflow: "hidden" as const,
                                  }}
                                >
                                  {data.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={data.logo} alt={`${data.org_name} logo`} style={{ maxWidth: 56, maxHeight: 56 }} />
                                  ) : (
                                    <BusinessIcon
                                      sx={{ color: "#9ca3af", fontSize: 32 }}
                                    />
                                  )}
                                  <input hidden type="file" accept={LOGO_ACCEPT} onChange={(e) => onLogoFile(data, e)} />
                                </Box>
                              </Tooltip>
                            </Grid>

                            <Grid item xs>
                              <Typography fontWeight={600}>
                                {data.org_name}
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                Organization created on{" "}
                                {formatDate(data.account_created_date)}
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                Organization ID:{" "}
                                <Box component="span" fontWeight={600}>
                                  {data.organization_id}
                                </Box>
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                Edition:{" "}
                                <Box component="span" fontWeight={600}>
                                  {data.country}
                                </Box>
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                You are an admin in this organization
                              </Typography>
                            </Grid>

                            <Grid item>
                              <Box display="flex" gap={1}>
                                <Button
                                  variant="outlined"
                                  fontSize="12px"
                                  onClick={() => goToOrganization(data)}
                                >
                                  Go to Organization
                                </Button>

                                <IconButton
                                  aria-label={`More actions for ${data.org_name}`}
                                  aria-expanded={open && menuOpenIndex === data._id ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={(event) => {
                                    setAnchorEl(event.currentTarget);
                                    setMenuOpenIndex(data._id);
                                  }}
                                  size="small"
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </React.Fragment>
                    );
                  })}
              </>
            )}
          </Container>
        </Box>
      </Container>
      {/* One menu for every card's ⋮ */}
      <Menu id="org-actions-menu" anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleSetDefault()}>Set as default</MenuItem>
        {orgData.find((o) => o._id === menuOpenIndex)?.logo && (
          <MenuItem onClick={handleRemoveLogo}>Remove logo</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default OrganizationPage;
