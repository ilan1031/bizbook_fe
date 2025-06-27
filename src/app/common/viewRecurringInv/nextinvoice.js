"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// Main invoice container
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  padding: 0,
  borderRadius: 0,
  border: "1px solid #000",
  boxShadow: "none",
  position: "relative",
  overflow: "hidden",
}));

// "ACTIVE" corner ribbon styling
const StatusCornerRibbon = styled(Box)(({ theme }) => ({
  zIndex: 1,
  backgroundColor: "#22c55e", // Tailwind's green-500
  position: "absolute",
  color: "white",
  padding: "4px 0", // tighter padding vertically
  transform: "rotate(-45deg)",
  transformOrigin: "top left",
  top: "65px",
  left: "-75px",
  whiteSpace: "nowrap",
  fontWeight: 600,
  fontSize: "12px",
  width: "120px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  borderRadius: "2px",
  display: "flex",
  justifyContent: "center",
}));

// Regular table cells
const BorderedCell = styled(TableCell)({
  border: "none",
  padding: "1px 5px",
  fontSize: "10.6667px",
  lineHeight: "17.0667px",
});

const TableBorderCell = styled(TableCell)({
  borderTop: "1px solid #000",
  borderBottom: " 1px solid #000",
  borderRight: " 1px solid #000",
  fontSize: " 10.6667px",
  fontWeight: "400",
});

// Table header cells
const HeaderCell = styled(TableCell)({
  fontWeight: "bold",
  padding: "0px",
  fontSize: "10.6667px",
  backgroundColor: "#fff",
});

// Item table header cells
const ItemHeaderCell = styled(TableCell)({
  borderTop: "1px solid #000",
  borderBottom: " 1px solid #000",
  borderRight: " 1px solid #000",
  padding: "5px 7px 2px",
  fontWeight: "bold",
  fontSize: "10px",
  backgroundColor: "#fff",
});

// Summary table cells (no borders)
const SummaryCell = styled(TableCell)({
  padding: "4px 8px",
  fontSize: "12px",
  border: "none",
  lineHeight: "17.0667px",
});

const TaxInvoiceTemplate = ({ details, callBack, loading }) => {
  // Log details for debugging if needed
  useEffect(() => {
    console.log("Details received:", details);
  }, [details]);

  // If loading is true, show a loading indicator
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If details are not available yet, show a placeholder message
  if (!details) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">No invoice data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "0px 38.4px 0px 52.8px",
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        maxWidth: "800px",
        margin: "0 auto",
        mt: 1,
        overflow: "hidden",
        boxShadow: "1px 1px 5px 1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          // backgroundColor: "#4CAF50",
          // color: "white",
          py: 1,
          px: 4,
          mb: 2,
          width: "max-content",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        <StatusCornerRibbon>{details?.status_formatted}</StatusCornerRibbon>
      </Box>

      <StyledPaper id="tax-invoice-template">
        {/* Company Header Section */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #000",
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}
            >
              {details?.organization_details?.org_name || "bizbooks"}
            </Typography>
            <Typography sx={{ fontSize: "10.6667px", color: "#000" }}>
              {details?.organization_details?.state || "Tamil Nadu"}
            </Typography>
            <Typography sx={{ fontSize: "10.6667px", color: "#000" }}>
              {details?.organization_details?.country || "India"}
            </Typography>
            <Typography sx={{ fontSize: "10.6667px", color: "#000" }}>
              {details?.organization_details?.email ||
                "accounts@bizbooks@example.com"}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "29.3333px",
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              TAX INVOICE
            </Typography>
          </Box>
        </Box>

        {/* Invoice Details Table */}
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "50%", borderRight: "1px solid #000" }}>
            <Table size="small" sx={{ tableLayout: "fixed" }}>
              <TableBody>
                <TableRow>
                  <BorderedCell
                    sx={{
                      width: "40%",
                      fontWeight: "bold",
                      borderLeft: "none",
                      borderTop: "none",
                      fontSize: "10.6667px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      #
                    </Typography>
                  </BorderedCell>
                  <BorderedCell
                    sx={{
                      width: "60%",
                      borderRight: "none",
                      borderTop: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                        width: "100px",
                        fontWeight: "600",
                      }}
                    >
                      : Will be generated automatically
                    </Typography>
                  </BorderedCell>
                </TableRow>
                <TableRow>
                  <BorderedCell
                    sx={{
                      width: "40%",
                      fontWeight: "bold",
                      borderLeft: "none",
                      borderTop: "none",
                      fontSize: "10.6667px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      Invoice Date
                    </Typography>
                  </BorderedCell>
                  <BorderedCell
                    sx={{
                      width: "60%",
                      borderRight: "none",
                      borderTop: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      : {details.start_date_formatted || "28-05-2022"}
                    </Typography>
                  </BorderedCell>
                </TableRow>
                <TableRow>
                  <BorderedCell
                    sx={{
                      fontWeight: "bold",
                      borderLeft: "none",
                      fontSize: "10.6667px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      Terms
                    </Typography>
                  </BorderedCell>
                  <BorderedCell sx={{ borderRight: "none" }}>
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      : Net 15
                    </Typography>
                  </BorderedCell>
                </TableRow>
                <TableRow>
                  <BorderedCell
                    sx={{
                      fontWeight: "bold",
                      borderLeft: "none",
                      fontSize: "10.6667px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      Due Date
                    </Typography>{" "}
                  </BorderedCell>
                  <BorderedCell sx={{ borderRight: "none" }}>
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      : {details.next_invoice_date_formatted || "10-06-2022"}
                    </Typography>
                  </BorderedCell>
                </TableRow>
                <TableRow>
                  <BorderedCell
                    sx={{
                      fontWeight: "bold",
                      borderLeft: "none",
                      borderBottom: "none",
                      fontSize: "10.6667px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      PO #
                    </Typography>{" "}
                  </BorderedCell>
                  <BorderedCell
                    sx={{ borderRight: "none", borderBottom: "none" }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      : {details.reference_number || "ord#999"}
                    </Typography>
                  </BorderedCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box sx={{ width: "50%" }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{ border: "none", height: "115px" }}
                  ></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>

        {/* Bill To Section */}
        <Box sx={{ borderTop: "1px solid #000" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <HeaderCell sx={{ pl: 2, borderBottom: "1px solid #000" }}>
                  Bill To
                </HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    padding: "10px 5px 10px 10px",
                    height: "40px",
                    verticalAlign: "top",
                    border: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "12px",
                      color: "#1B4C91",
                    }}
                  >
                    {details.customer_name || "BHARATHI G"}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Items Table */}
        <Table size="small" sx={{ borderTop: "1px solid #000" }}>
          <TableHead>
            <TableRow>
              <ItemHeaderCell align="center" sx={{ width: "5%" }}>
                #
              </ItemHeaderCell>
              <ItemHeaderCell sx={{ width: "44.3%" }}>
                Item & Description
              </ItemHeaderCell>
              <ItemHeaderCell align="center" sx={{ width: "15%" }}>
                Qty
              </ItemHeaderCell>
              <ItemHeaderCell align="center" sx={{ width: "15%" }}>
                Rate
              </ItemHeaderCell>
              <ItemHeaderCell align="right" sx={{ width: "20%" }}>
                Amount
              </ItemHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Array.isArray(details.line_items) && details.line_items.length > 0
              ? details.line_items
              : Array.isArray(details.items)
              ? details.items
              : []
            ).map((item, index) => (
              <TableRow key={item.id || index}>
                <TableBorderCell align="center">
                  <Typography sx={{ fontSize: "10.6667px" }}>
                    {index + 1}
                  </Typography>
                </TableBorderCell>
                <TableBorderCell>
                  <Typography sx={{ fontSize: "10.6667px" }}>
                    {item.item_name || item.name || ""}
                  </Typography>
                </TableBorderCell>
                <TableBorderCell align="center">
                  <Typography sx={{ fontSize: "10.6667px" }}>
                    {item.quantity}
                  </Typography>
                </TableBorderCell>
                <TableBorderCell align="center">
                  <Typography sx={{ fontSize: "10.6667px" }}>
                    {item.rate}
                  </Typography>
                </TableBorderCell>
                <TableBorderCell align="right">
                  <Typography sx={{ fontSize: "10.6667px" }}>
                    {item.item_total_formatted || item.amount || ""}
                  </Typography>
                </TableBorderCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer Section with Totals and Notes */}
        <Box sx={{ display: "flex" }}>
          {/* Left Section - Notes */}
          <Box sx={{ width: "50%", borderRight: "1px solid #000", p: 2 }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "10.6667px", color: "#000" }}
            >
              Total in Words:
            </Typography>
            <Typography
              sx={{
                fontSize: "10.6667px",
                fontStyle: "italic",
                color: "#000",
                mb: 2,
              }}
            >
              {details?.total_text}
            </Typography>

            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "12px",
                color: "#000",
                mt: 3,
              }}
            >
              Notes:
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#0000FF" }}>
              {details.notes || "Thanks for your business."}
            </Typography>
          </Box>

          {/* Right Section - Totals */}
          <Box sx={{ width: "50%" }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <SummaryCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      {" "}
                      Sub Total
                    </Typography>
                  </SummaryCell>
                  <SummaryCell align="right">
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      {details.sub_total_formatted || "7,500.00"}
                    </Typography>
                  </SummaryCell>
                </TableRow>
                <TableRow>
                  <SummaryCell sx={{ textAlign: "right" }}>
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      Discount
                    </Typography>
                  </SummaryCell>
                  <SummaryCell align="right" sx={{ color: "#000" }}>
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      {" "}
                      (-) {details.discount || "0.00"}
                    </Typography>
                  </SummaryCell>
                </TableRow>
                <TableRow>
                  <SummaryCell sx={{ textAlign: "right" }}>
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      {" "}
                      Amount Withheld
                    </Typography>
                  </SummaryCell>
                  <SummaryCell align="right" sx={{ color: "#FF0000" }}>
                    <Typography
                      sx={{
                        fontSize: "10.6667px",
                      }}
                    >
                      (-) {details.amountWithheld || "0.00"}
                    </Typography>
                  </SummaryCell>
                </TableRow>
                <TableRow>
                  <SummaryCell sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
                      <Typography
                        sx={{
                          fontSize: "10.6667px",
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </Typography>
                    </Typography>
                  </SummaryCell>
                  <SummaryCell align="right">
                    <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
                      <Typography
                        sx={{
                          fontSize: "10.6667px",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{details.total || "0.00"}
                      </Typography>
                    </Typography>
                  </SummaryCell>
                </TableRow>
                <TableRow>
                  <SummaryCell sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      <Typography
                        sx={{
                          fontSize: "10.6667px",
                          fontWeight: "bold",
                        }}
                      >
                        Balance Due
                      </Typography>
                    </Typography>
                  </SummaryCell>
                  <SummaryCell align="right">
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      <Typography
                        sx={{
                          fontSize: "10.6667px",
                          fontWeight: "bold",
                        }}
                      >
                        {details.balance_formatted || "0.00"}
                      </Typography>
                    </Typography>
                  </SummaryCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Signature section */}
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "center",
                // mt: 3,
              }}
            >
              <Typography sx={{ fontSize: "11px", textAlign: "center", mb: 4 }}>
                Authorized Signature
              </Typography>
              {/* <Divider sx={{ width: "50%", borderColor: "#000" }} /> */}
            </Box>
          </Box>
        </Box>
      </StyledPaper>

      {/* Bottom section with buttons */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: "12px", color: "#757575" }}>
          PDF Template: `Spreadsheet Template` Change ( View sample PDF )
        </Typography>
        {callBack && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => callBack(details)}
            sx={{
              backgroundColor: "#4285F4",
              color: "white",
              textTransform: "none",
              borderRadius: "4px",
              px: 2,
            }}
          >
            Back to Editing
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TaxInvoiceTemplate;
