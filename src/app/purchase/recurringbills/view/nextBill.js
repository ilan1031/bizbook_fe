import {
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import formatCurrency from "../../../common/FormatCurrency";

const NextBill = ({ details }) => {
  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ width: "60%", p: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "400",
              fontSize: "23px",
              fontFamily: "'Times New Roman', serif",
            }}
          >
            BILL
          </Typography>

          <Box sx={{ width: "100%", display: "flex", mt: 4 }}>
            <Box
              sx={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                gap: 1.4,
              }}
            >
              {/* <Box>
                <Typography
                variant="body2"
                color="#555555"
                sx={{ fontSize: "12px", fontWeight: "600" }}
                >
                Bill Date
                </Typography>
            </Box> */}
              <Box>
                <Typography
                  variant="body2"
                  color="#555555"
                  sx={{ fontSize: "12px", fontWeight: "600" }}
                >
                  Payment Terms
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="#555555"
                  sx={{ fontSize: "12px", fontWeight: "600" }}
                >
                  Total
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                width: "55%",
                display: "flex",
                flexDirection: "column",
                gap: 1.4,
                fontSize: "13px",
              }}
            >
              {/* <Box>
                {details?.billDate ? new Date(details?.billDate).toLocaleDateString("en-GB") : "--"}
            </Box> */}
              <Box>{details?.payment_terms_label}</Box>
              <Box sx={{ fontWeight: 600 }}>
                {"₹" + formatCurrency(details?.total)}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "40%", p: 2, pt: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "700", color: "#555555", fontSize: "12px" }}
          >
            VENDOR ADDRESS
          </Typography>
          <Box>
            <Typography
              variant="body2"
              color="#206DDC"
              sx={{ py: 1, fontSize: "13px" }}
            >
              {details?.vendor_data?.contact_name || ""}
            </Typography>
            <Typography variant="body2">
              {details?.vendor_data?.billing_address?.address || ""}
            </Typography>
            <Typography variant="body2">
              {details?.vendor_data?.billing_address?.street2 || ""}
            </Typography>
            <Typography variant="body2">
              {details?.vendor_data?.billing_address?.city || ""}
              {details?.vendor_data?.billing_address?.state || ""}
            </Typography>
            <Typography variant="body2">
              {details?.vendor_data?.billing_address?.country || ""} 
              {+details?.vendor_data?.billing_address?.zip || ""}
            </Typography>
            <Typography variant="body2">
              {details?.vendor_data?.mobile || ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          boxShadow: "none",
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#797d8e !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                ITEMS & DESCRIPTION
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  fontWeight: "bold",
                  color: "#797d8e !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                ACCOUNT
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  fontWeight: "bold",
                  color: "#797d8e !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                QUANTITY
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  color: "#797d8e !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                RATE
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  color: "#797d8e !important",
                  backgroundColor: "#f7f7f7 !important",
                }}
              >
                AMOUNT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(details?.line_items) &&
              details?.line_items.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "400",
                        fontSize: "12px",
                        color: "#408dfb !important ",
                      }}
                    >
                      {data.name}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    {data.account}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    {data.quantity}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    ₹{formatCurrency(data.rate)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "black !important ",
                      fontSize: "14px !important",
                      fontWeight: "400 !important",
                    }}
                  >
                    ₹{formatCurrency(data.amount)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={7} textAlign="right" sx={{ pr: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: "600", mt: 1, fontSize: "16px" }}
              >
                Sub Total
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "400",
                  mt: 1,
                  fontSize: "16px",
                  color: "#6C718A",
                }}
              >
                Discount
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: "600", mt: 1, fontSize: "17px" }}
              >
                Total
              </Typography>
            </Grid>
            <Grid item xs={5} textAlign="right">
              <Typography
                variant="body2"
                sx={{ fontWeight: "600", mt: 1, fontSize: "16px" }}
              >
                {formatCurrency(details?.sub_total)}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontWeight: "400",
                  mt: 1,
                  fontSize: "16px",
                  color: "#6C718A",
                }}
              >
                (-) {"₹" + formatCurrency(details?.discount_amount)}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: "600", mt: 1, fontSize: "17px" }}
              >
                {"₹" + formatCurrency(details?.total)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NextBill;
