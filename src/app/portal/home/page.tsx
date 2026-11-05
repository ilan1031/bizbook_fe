"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
import Footer from "../components/Footer"
import apiService, { portalGet } from "../portalApi";


const Home = (_props?: any) => {

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
    <Box sx={{overflowY:"auto" as const}}>
      {/* Name */}
      <Box
        sx={{
          fontSize: "19px",
          fontWeight: "300" as const,
          bgcolor: "#fafafa",
          px: 4,
          py: 3,
        }}
      >
        Hello {userDetails.first_name}!
      </Box>

      {/*Balance Summary*/}

      <Box sx={{ px: 4, py: 3 }}>
        <Box sx={{ fontSize: "17px", fontWeight: "400" as const, mb: 2 }}>
          Balance Summary
        </Box>

        {/*Table Section*/}
        <Box>
          <TableContainer
            component={Box}
            sx={{
              border: "1px solid #d1e1ec",
              borderRadius: "10px",
              width: "85%",
              overflow: "hidden" as const,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "15px",
                      fontWeight: "500" as const,
                    }}
                  >
                    {" "}
                    Currency
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "15px",
                      fontWeight: "500" as const,
                    }}
                  >
                    Available Credits
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "15px",
                      fontWeight: "500" as const,
                    }}
                  >
                    Balance Payable
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "13px",
                      fontWeight: "400" as const,
                      borderBottom: "none",
                    }}
                  >
                    INR- Indian Rupee
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "13px",
                      fontWeight: "400" as const,
                      borderBottom: "none",
                    }}
                  >
                    ₹0.00
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "13px",
                      fontWeight: "400" as const,
                      borderBottom: "none",
                    }}
                  >
                    ₹0.00
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/*Last Payment Made*/}
        <Box sx={{ width: "90%" }}>
          <Box sx={{ mt: 4, mb: 1.5, fontSize: "17px" }}>Last Payment Made</Box>

          <Box
            sx={{
              width: "49%",
              border: "1px solid #dddddd",
              borderRadius: "10px",
              display: "flex" as const,
              overflow: "hidden" as const,
              alignItems: "center" as const,
            }}
          >
            <Box sx={{ height: "100%" }}>
              <Box sx={{ width: 150, display: "flex" as const, justifyContent: "center" as const }}>
                <PaymentsOutlinedIcon sx={{ fontSize: 64, color: "#9fb4cc" }} />
              </Box>
            </Box>
            <Box>
              <Box
                sx={{ fontWeight: "600" as const, fontSize: "16px", color: "#212529" }}
              >
                The most recent payment that you&apos;ve made
              </Box>
              <Box
                sx={{ fontWeight: "600" as const, fontSize: "16px", color: "#212529" }}
              >
                towards an invoice will be displayed here.
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "90%",
            display: "flex" as const,
            justifyContent: "space-between" as const,
          }}
        >
          {/*My Details*/}

          <Box sx={{ width: "49%" }}>
            <Box
              sx={{
                display: "flex" as const,
                justifyContent: "space-between" as const,
              }}
            >
              <Box sx={{ mt: 4, mb: 1.5, fontSize: "17px" }}>My Details</Box>
              <Box
                sx={{
                  color: "#2485E8",
                  fontWeight: "400" as const,
                  fontsize: "15px",
                  mt: 4,
                  mb: 1.5,
                }}
              >
                View More
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid #dddddd",
                borderRadius: "10px",
                display: "flex" as const,
                overflow: "hidden" as const,
                alignItems: "center" as const,
              }}
            >
              <Box
                sx={{
                  fontWeight: "600" as const,
                  fontSize: "16px",
                  color: "#212529",
                  p: 2,
                }}
              >
                Hari
              </Box>
            </Box>
          </Box>

          {/*Shared Documents*/}
          <Box sx={{ width: "49%" }}>
            <Box
              sx={{
                display: "flex" as const,
                justifyContent: "space-between" as const,
              }}
            >
              <Box sx={{ mt: 4, mb: 1.5, fontSize: "17px" }}>
                Shared Documents
              </Box>
              <Box
                sx={{
                  color: "#2485E8",
                  fontWeight: "400" as const,
                  fontsize: "15px",
                  display: "flex" as const,
                  alignItems: "center" as const,
                  mt: 4,
                  mb: 1.5,
                }}
              >
                <InfoOutlineIcon sx={{ color: "#212529 !important", mr: 1 }} />{" "}
                Upload Documents
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid #dddddd",
                borderRadius: "10px",
                overflow: "hidden" as const,
                alignItems: "center" as const,
                 display: "flex" as const,
                 justifyContent: "center" as const,
                 flexDirection:"column" as const,
                 pt:3,
                 pb:6,
              }}
            >
              {/*Message Logo*/}

                <Box>
                  <ForumOutlinedIcon sx={{ fontSize: 80, color: "#9fb4cc" }} />
                </Box>

              <Box sx={{width:"60%", textAlign:"center" as const, fontSize:"14px", fontWeight:"400" as const}}>
                  Documents that are shared between you and {userDetails?.organization?.org_name || "the business"} will appear here.
              </Box>


            </Box>


          </Box>
        </Box>


      </Box>

      <Footer />

    </Box>
  );
};

export default Home;
