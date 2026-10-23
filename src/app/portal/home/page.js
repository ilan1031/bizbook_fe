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
import Image from "next/image";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import Footer from "../components/Footer"
import apiService, { portalGet, savePortalSession, clearPortalSession, portalLoginPath, decodeJwt } from "../portalApi";


const Home = () => {

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
        console.log("the Response dashboard detail page", response);
        setUserDetails(response.data.data);

        // setLoading(false);
      } catch (error) {
        console.log(error, "Error in getting dashboard Detail page");
      }
    };
    fetchOrg();
  }, []);



  return (
    <Box sx={{overflowY:"auto"}}>
      {/* Name */}
      <Box
        sx={{
          fontSize: "19px",
          fontWeight: "300",
          bgcolor: "#fafafa",
          px: 4,
          py: 3,
        }}
      >
        Hello {userDetails.first_name}!
      </Box>

      {/*Balance Summary*/}

      <Box sx={{ px: 4, py: 3 }}>
        <Box sx={{ fontSize: "17px", fontWeight: "400", mb: 2 }}>
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
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "15px",
                      fontWeight: "500",
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
                      fontWeight: "500",
                    }}
                  >
                    Available Credits
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#f9f9fb !important",
                      fontSize: "15px",
                      fontWeight: "500",
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
                      fontWeight: "400",
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
                      fontWeight: "400",
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
                      fontWeight: "400",
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
              display: "flex",
              overflow: "hidden",
              alignItems: "center",
            }}
          >
            <Box sx={{ height: "100%" }}>
              <Image src="/PostBox.jpg" alt="Logo" width={150} height={100} />
            </Box>
            <Box>
              <Box
                sx={{ fontWeight: "600", fontSize: "16px", color: "#212529" }}
              >
                The most recent payment that you&apos;ve made
              </Box>
              <Box
                sx={{ fontWeight: "600", fontSize: "16px", color: "#212529" }}
              >
                towards an invoice will be displayed here.
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "90%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/*My Details*/}

          <Box sx={{ width: "49%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mt: 4, mb: 1.5, fontSize: "17px" }}>My Details</Box>
              <Box
                sx={{
                  color: "#2485E8",
                  fontWeight: "400",
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
                display: "flex",
                overflow: "hidden",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  fontWeight: "600",
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
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ mt: 4, mb: 1.5, fontSize: "17px" }}>
                Shared Documents
              </Box>
              <Box
                sx={{
                  color: "#2485E8",
                  fontWeight: "400",
                  fontsize: "15px",
                  display: "flex",
                  alignItems: "center",
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
                overflow: "hidden",
                alignItems: "center",
                 display: "flex",
                 justifyContent: "center",
                 flexDirection:"column",
                 pt:3,
                 pb:6,
              }}
            >
              {/*Message Logo*/}

                <Box>
                  <Image
                    src="/MessagesLogo.jpg"
                    alt="Message Logo"
                    width={120}
                    height={100}
                  />
                </Box>

              <Box sx={{width:"60%", textAlign:"center", fontSize:"14px", fontWeight:"400"}}>
                  Documents that are shared between you and SNS Company will appear here.
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
