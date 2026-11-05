import { CloseReportButton, ReportsMenuButton, ShareReportButton } from "../ReportControls";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Button,
  IconButton,
  Menu,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import ShareIcon from "@mui/icons-material/Share";
import {  Settings2 } from "lucide-react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const AccountTransactions = ({ 
  accountName = "Cost of Goods Sold",
  accountType = "Cost of Goods Sold",
  fromDate = "01/04/2025",
  toDate = "31/03/2026",
  organizationName = "IHUB",
  reportBasis = "Accrual",
  onClose 
}: any) => {
  const [exportAnchorEl, setExportAnchorEl] = useState<any>(null);
  const exportMenuOpen = Boolean(exportAnchorEl);
  const [dateValue, setDateValue] = useState("This Month");
  const [dateAnchorEl, setDateAnchorEl] = useState<any>(null);
  const dateMenuOpen = Boolean(dateAnchorEl);
  const [reportBasisState, setReportBasisState] = useState(reportBasis);
  const [reportBasisAnchorEl, setReportBasisAnchorEl] = useState<any>(null);
  const reportBasisMenuOpen = Boolean(reportBasisAnchorEl);

  // Sample transaction data - replace with your API data
  const [transactionData, setTransactionData] = useState<any>({
    openingBalance: 0.00,
    transactions: [
      {
        date: "15/04/2025",
        account: "Cost of Goods Sold",
        transactionDetails: "harish and co",
        transactionType: "Bill",
        transactionNumber: "Bill - 007",
        reference: "order - 007",
        debit: 55.00,
        credit: 0,
        amount: "55.00 Dr"
      },
      {
        date: "16/04/2025",
        account: "Cost of Goods Sold",
        transactionDetails: "harish and co",
        transactionType: "Bill",
        transactionNumber: "Bill - 005",
        reference: "order - 0005",
        debit: 200000.00,
        credit: 0,
        amount: "2,00,000.00 Dr"
      },
      {
        date: "17/04/2025",
        account: "Cost of Goods Sold",
        transactionDetails: "harish and co",
        transactionType: "Bill",
        transactionNumber: "Bill - 003",
        reference: "Order - 01",
        debit: 55000.00,
        credit: 0,
        amount: "55,000.00 Dr"
      },
      {
        date: "29/04/2025",
        account: "Cost of Goods Sold",
        transactionDetails: "Bharathi & co",
        transactionType: "Bill",
        transactionNumber: "w242",
        reference: "325",
        debit: 200000.00,
        credit: 0,
        amount: "2,00,000.00 Dr"
      },
      {
        date: "16/06/2025",
        account: "Cost of Goods Sold",
        transactionDetails: "Bharathi & co",
        transactionType: "Bill",
        transactionNumber: "Bill -009",
        reference: "",
        debit: 200000.00,
        credit: 0,
        amount: "2,00,000.00 Dr"
      }
    ],
    totalDebits: 655055.00,
    totalCredits: 0.00,
    closingBalance: 655055.00
  });

  const handleClose = () => {
    setDateAnchorEl(null);
    setExportAnchorEl(null);
    setReportBasisAnchorEl(null);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const formatAmount = (amount) => {
    if (amount === 0) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatAmountSimple = (amount) => {
    if (amount === 0) return "";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Box>
      {/* Sticky Header */}
      <Box sx={{ position: "sticky" as const, top: 0, bgcolor: "white", zIndex: 9 }}>
        <Box
          sx={{
            display: "flex" as const,
            alignItems: "center" as const,
            p: 2,
            justifyContent: "space-between" as const,
          }}
        >
          {/* Left Box */}
          <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 2 }}>
            <Box
              sx={{
                display: "flex" as const,
                alignItems: "center" as const,
                justifyContent: "center" as const,
                backgroundColor: "#e9e9e9",
                padding: "4px",
                borderRadius: "6px",
                width: "30px",
                height: "30px",
              }}
            >
              <ReportsMenuButton />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "12px", fontWeight: "500" as const, color: "#4C526C" }}
              >
                Accountant
              </Typography>
              <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                <Typography sx={{ fontSize: "15px", fontWeight: "600" as const }}>
                  {accountName}
                </Typography>
                <Typography
                  sx={{ ml: 1, fontSize: "12px", fontWeight: "400" as const }}
                >
                  • From {fromDate} To {toDate}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Box */}
          <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 2 }}>
            

            <Box
              display="flex"
              alignItems="center"
              border={1}
              borderColor="grey.400"
              borderRadius={1}
              overflow="hidden"
              width="fit-content"
              sx={{ borderRadius: "6px" }}
            >
              <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
                <IconButton aria-label="Reload report" onClick={() => window.location.reload()} size="small">
                  <ReplayIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>
              <Box width="1px" height="24px" bgcolor="grey.400" />
              <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
                <ShareReportButton />
              </Box>
            </Box>

            <Button
              variant="outlined"
              size="small"
              sx={{
                bgcolor: "#f5f5f5",
                fontSize: "13px",
                fontWeight: "400" as const,
                color: "black",
                borderColor: "#dddddd",
              }}
              onClick={handleExportClick}
            >
              Export
            </Button>

            {/* Export Menu */}
            <Menu
              anchorEl={exportAnchorEl}
              open={exportMenuOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box
                sx={{
                  color: "#838195",
                  fontSize: "12px",
                  fontWeight: "600" as const,
                  p: 1,
                  width: "200px",
                }}
              >
                EXPORT AS
              </Box>
              <MenuItem onClick={() => window.print()}>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight: 400,
                  }}
                  primary="PDF"
                />
              </MenuItem>
            </Menu>

            <IconButton
              size="small"
              sx={{
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Divider />
      </Box>

      {/* Filters Section */}
      <Box sx={{ borderBottom: "1px solid #dddddd", boxShadow: 6 }}>
        <Box sx={{ p: 2, display: "flex" as const, alignItems: "center" as const }}>
          <FilterAltOutlinedIcon sx={{ fontSize: "20px", color: "#495569" }} />
          <Typography sx={{ fontSize: "13px", fontWeight: "400" as const }}>
            Filters :
          </Typography>

          {/* Date Range */}
          <Box
            sx={{
              display: "flex" as const,
              border: "1px solid #dddddd",
              borderRadius: "6px",
              py: 0.5,
              px: 1,
              bgcolor: "#f6f6fa",
              ml: 1,
              alignItems: "center" as const,
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: "400" as const }}>
              Date Range :
            </Typography>
            <Box
              sx={{
                ml: 1,
                cursor: "pointer" as const,
                display: "flex" as const,
                alignItems: "center" as const,
                fontSize: "13px",
                fontWeight: "400" as const,
              }}
              onClick={(event) => setDateAnchorEl(event.currentTarget)}
            >
              {dateValue}
              {dateAnchorEl ? (
                <KeyboardArrowUpOutlinedIcon sx={{ fontSize: "20px" }} />
              ) : (
                <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px" }} />
              )}
            </Box>
          </Box>

          {/* Report Basis */}
          <Box
            sx={{
              display: "flex" as const,
              border: "1px solid #dddddd",
              borderRadius: "6px",
              py: 0.5,
              px: 1,
              bgcolor: "#f6f6fa",
              ml: 1,
              alignItems: "center" as const,
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: "400" as const }}>
              Report Basis :
            </Typography>
            <Box
              sx={{
                ml: 1,
                cursor: "pointer" as const,
                display: "flex" as const,
                alignItems: "center" as const,
                fontSize: "13px",
                fontWeight: "400" as const,
              }}
              onClick={(event) => setReportBasisAnchorEl(event.currentTarget)}
            >
              {reportBasisState}
              {reportBasisAnchorEl ? (
                <KeyboardArrowUpOutlinedIcon sx={{ fontSize: "20px" }} />
              ) : (
                <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px" }} />
              )}
            </Box>
          </Box>

          <Button onClick={() => window.location.reload()}
            variant="contained"
            size="small"
            sx={{ ml: 3, borderRadius: "6px", zIndex: 0 }}
          >
            Run Report
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          bgcolor: "#f4f4f9",
          p: 4,
          overflowY: "auto" as const,
          display: "flex" as const,
          justifyContent: "center" as const,
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "6px",
            width: "100%",
            minWidth: "1000px",
          }}
        >
          <Box sx={{ width: "95%", margin: "0 auto" }}>
            {/* Header */}
            <Box sx={{ textAlign: "center" as const, py: 3 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400" as const,
                  color: "#666666",
                  fontFamily: "Arial, sans-serif" as const,
                }}
              >
                {organizationName?.toUpperCase()}
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "600" as const,
                  my: 1,
                  color: "#000000",
                  fontFamily: "Arial, sans-serif" as const,
                }}
              >
                Account Transactions
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400" as const,
                  color: "#666666",
                  mb: 1,
                  fontFamily: "Arial, sans-serif" as const,
                }}
              >
                Basis : {reportBasisState}
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "600" as const,
                  color: "#000000",
                  my: 1,
                  fontFamily: "Arial, sans-serif" as const,
                }}
              >
                {accountType}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400" as const,
                  color: "#666666",
                  fontFamily: "Arial, sans-serif" as const,
                }}
              >
                From {fromDate} To {toDate}
              </Typography>
            </Box>

            {/* Group By and Customize Controls */}
            <Box
              sx={{
                display: "flex" as const,
                justifyContent: "flex-end" as const,
                alignItems: "center" as const,
                gap: 2,
                mb: 2,
                px: 2,
              }}
            >
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1 }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: "400" as const, color: "#666" }}
                >
                  Group By :
                </Typography>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: "600" as const, color: "#000" }}
                >
                  None
                </Typography>
                <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "16px" }} />
              </Box>
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 1 }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: "400" as const, color: "#666" }}
                >
                  Customize Report Columns
                </Typography>
                <Box
                  sx={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    bgcolor: "#2196f3",
                    color: "white",
                    fontSize: "10px",
                    display: "flex" as const,
                    alignItems: "center" as const,
                    justifyContent: "center" as const,
                    fontWeight: "600" as const,
                  }}
                >
                  9
                </Box>
              </Box>
            </Box>

            {/* Transactions Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      DATE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      ACCOUNT
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      TRANSACTION DETAILS
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      TRANSACTION TYPE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      TRANSACTION#
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      REFERENCE#
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    >
                      DEBIT
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    >
                      CREDIT
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600" as const,
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    >
                      AMOUNT
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Opening Balance */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      As On {fromDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      Opening Balance
                    </TableCell>
                    <TableCell
                      colSpan={5}
                      sx={{ border: "1px solid #dee2e6", py: 1 }}
                    />
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    />
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                        fontWeight: "600" as const,
                      }}
                    >
                      {formatAmount(transactionData.openingBalance)}
                    </TableCell>
                  </TableRow>

                  {/* Transactions */}
                  {transactionData.transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                        }}
                      >
                        {transaction.date}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                        }}
                      >
                        {transaction.account}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#2196f3",
                          border: "1px solid #dee2e6",
                          py: 1,
                          cursor: "pointer" as const,
                          textDecoration: "underline" as const,
                        }}
                      >
                        {transaction.transactionDetails}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                        }}
                      >
                        {transaction.transactionType}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                        }}
                      >
                        {transaction.transactionNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                        }}
                      >
                        {transaction.reference}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                          textAlign: "right" as const,
                        }}
                      >
                        {transaction.debit > 0 ? formatAmountSimple(transaction.debit) : ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                          textAlign: "right" as const,
                        }}
                      >
                        {transaction.credit > 0 ? formatAmountSimple(transaction.credit) : ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "13px",
                          color: "#000",
                          border: "1px solid #dee2e6",
                          py: 1,
                          textAlign: "right" as const,
                        }}
                      >
                        {transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Total Debits and Credits */}
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell
                      colSpan={6}
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600" as const,
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      Total Debits and Credits ({fromDate} - {toDate})
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600" as const,
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    >
                      ₹{formatAmountSimple(transactionData.totalDebits)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600" as const,
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    >
                      {formatAmount(transactionData.totalCredits)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    />
                  </TableRow>

                  {/* Closing Balance */}
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      As On {toDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                      }}
                    >
                      Closing Balance
                    </TableCell>
                    <TableCell
                      colSpan={5}
                      sx={{ border: "1px solid #dee2e6", py: 1 }}
                    />
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                        fontWeight: "600" as const,
                      }}
                    >
                      ₹{formatAmountSimple(transactionData.closingBalance)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "13px",
                        color: "#000",
                        border: "1px solid #dee2e6",
                        py: 1,
                        textAlign: "right" as const,
                      }}
                    />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountTransactions;