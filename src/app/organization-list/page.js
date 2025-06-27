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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BusinessIcon from "@mui/icons-material/Business";
import Button from "../common/btn/Button";
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";
import { useRouter } from "next/navigation";
const OrganizationPage = () => {
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { showMessage } = useSnackbar();
  const [orgData, setOrgData] = useState([]);
  const [adminData, setAdminData] = useState({});
  const router = useRouter();
  useEffect(() => {
    getOrg();
    getUserData();
  }, []);
  const handleSetDefault = async () => {
    let params = {
      url: `api/v1/organization/update-default-status?org_id=${menuOpenIndex}`,
      method: "POST",
    };
    let res = await apiService(params);
    if (res.statusCode == 200) {
      showMessage(res.data.message, "success");
      localStorage.setItem("organization_id", res.data.data);
      getOrg();
    } else {
      showMessage(res.data.message, "error");
    }
    setAnchorEl(null);
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
        <Typography component="span" color="#3b82f6" sx={{ cursor: "pointer" }}>
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
              sx={{ textTransform: "none" }}
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
                      <>
                        <Paper
                          elevation={0}
                          sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            position: "relative",
                          }}
                        >
                          {/* DEFAULT Ribbon */}
                          {data.org_type == "default" ? (
                            <>
                              <Chip
                                label="DEFAULT"
                                size="small"
                                sx={{
                                  position: "absolute",
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
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  backgroundColor: "#f3f4f6",
                                  borderRadius: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <BusinessIcon
                                  sx={{ color: "#9ca3af", fontSize: 32 }}
                                />
                              </Box>
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
                                {data.org_type == "default" ? (
                                  <>
                                    <Button
                                      variant="outlined"
                                      fontSize="12px"
                                      onClick={() => router.push("/home")}
                                    >
                                      Go to Organization
                                    </Button>
                                  </>
                                ) : (
                                  <></>
                                )}

                                <IconButton
                                  aria-expanded={open ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={(event) => {
                                    setAnchorEl(event.currentTarget);
                                    setMenuOpenIndex(data._id); // if needed
                                  }}
                                  size="small"
                                  id="long-menu"
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  id="long-menu"
                                  MenuListProps={{
                                    "aria-labelledby": "long-button",
                                  }}
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={() => setAnchorEl(null)}
                                >
                                  <MenuItem onClick={() => handleSetDefault()}>
                                    Set as default
                                  </MenuItem>
                                  {/* <MenuItem>View</MenuItem> */}
                                </Menu>
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </>
                    );
                  })}
              </>
            )}
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default OrganizationPage;
