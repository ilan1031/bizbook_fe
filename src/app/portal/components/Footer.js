"use client";
import { Box, Typography, Button } from "@mui/material";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, { useState, useEffect } from "react";
import apiService, { portalGet, savePortalSession, clearPortalSession, portalLoginPath, decodeJwt } from "../portalApi";

const Footer = () => {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchOrg = async () => {
      const client_id = portalGet("clientId");
      const org_id = portalGet("orgId");

      // setLoading(true);
      try {
        console.log(org_id, "org_id");
        const response = await apiService({
          method: "GET",
          url: `/api/v1/contact/${client_id}?organization_id=${org_id}`,
        });
        console.log("the Response Footer page", response);
        setUserDetails(response.data.data);

        // setLoading(false);
      } catch (error) {
        console.log(error, "Error in getting Footer page");
      }
    };
    fetchOrg();
  }, []);

  return (
    <Box sx={{ width: "100%", bgcolor: "#f8f9fa", p: 4, display: "flex" }}>
      {/*Organization Details*/}
      <Box sx={{ width: "35%" }}>
        <Typography
          sx={{ color: "#212529", fontSize: "20px", fontWeight: "600" }}
        >
          {userDetails?.organization?.org_name}
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "13px", color: "#212529" }}
        >
          {userDetails?.organization?.state}
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "13px", color: "#212529" }}
        >
          {userDetails?.organization?.country}
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "13px", color: "#212529" }}
        >
          {userDetails?.organization?.gst_in}
        </Typography>
        <Typography
          sx={{ fontWeight: "400", fontSize: "13px", color: "#212529" }}
        >
          manoj.r.ihub@snsgroups.com
        </Typography>
      </Box>

      {/*Client Details*/}
      <Box sx={{ display: "flex", alignItems: "center", width: "35%" }}>
        <PersonPinIcon sx={{ color: "#dbdbdb !important", fontSize: "55px" }} />
        <Box>
          <Typography
            sx={{ fontSize: "15px", fontWeight: "400", color: "#212529" }}
          >
            {userDetails?.organization?.org_name}
          </Typography>
          <Typography
            sx={{ fontSize: "12px", fontWeight: "400", color: "#5D678A" }}
          >
            manoj.r.ihub@snsgroups.com
          </Typography>
        </Box>
      </Box>

      {/*Mail Button*/}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            bgcolor: "#408DFB",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "400",
            width: "120px",
            borderRadius: "4px",
            p: 1,
            justifyContent: "center",
            alignItems: "center",
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
