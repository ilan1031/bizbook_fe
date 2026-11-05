"use client";
import { Box, Typography, Button } from "@mui/material";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, { useState, useEffect } from "react";
import apiService, { portalGet } from "../portalApi";

const Footer = (_props?: any) => {
  const [userDetails, setUserDetails] = useState<any>({});

  useEffect(() => {
    const fetchOrg = async () => {
      const client_id = portalGet("clientId");
      const org_id = portalGet("orgId");

      // setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/contact/${client_id}?organization_id=${org_id}`,
        });
        setUserDetails(response.data.data);

        // setLoading(false);
      } catch (error) {
        setUserDetails({});
      }
    };
    fetchOrg();
  }, []);

  return (
    <Box sx={{ width: "100%", bgcolor: "#f8f9fa", p: 4, display: "flex" as const }}>
      {/*Organization Details*/}
      <Box sx={{ width: "35%" }}>
        <Typography
          sx={{ color: "#212529", fontSize: "20px", fontWeight: "600" as const }}
        >
          {userDetails?.organization?.org_name}
        </Typography>
        <Typography
          sx={{ fontWeight: "400" as const, fontSize: "13px", color: "#212529" }}
        >
          {userDetails?.organization?.state}
        </Typography>
        <Typography
          sx={{ fontWeight: "400" as const, fontSize: "13px", color: "#212529" }}
        >
          {userDetails?.organization?.country}
        </Typography>
        <Typography
          sx={{ fontWeight: "400" as const, fontSize: "13px", color: "#212529" }}
        >
          {userDetails?.organization?.gst_in}
        </Typography>
        <Typography
          sx={{ fontWeight: "400" as const, fontSize: "13px", color: "#212529" }}
        >
          {userDetails?.organization?.email || userDetails?.admin_email || ""}
        </Typography>
      </Box>

      {/*Client Details*/}
      <Box sx={{ display: "flex" as const, alignItems: "center" as const, width: "35%" }}>
        <PersonPinIcon sx={{ color: "#dbdbdb !important", fontSize: "55px" }} />
        <Box>
          <Typography
            sx={{ fontSize: "15px", fontWeight: "400" as const, color: "#212529" }}
          >
            {userDetails?.contact_name || userDetails?.company_name || ""}
          </Typography>
          <Typography
            sx={{ fontSize: "12px", fontWeight: "400" as const, color: "#5D678A" }}
          >
            {userDetails?.email || userDetails?.contact_persons?.[0]?.email || ""}
          </Typography>
        </Box>
      </Box>

      {/*Mail Button*/}
      <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
        <Box
          sx={{
            display: "flex" as const,
            bgcolor: "#408DFB",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "400" as const,
            width: "120px",
            borderRadius: "4px",
            p: 1,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            gap: 0.8,
          }}
        >
          <EmailOutlinedIcon sx={{ fontSize: "20px" }} />
          Send Mail
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
