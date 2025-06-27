"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Toolbar,
  AppBar,
  IconButton,
  Stack,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import { ArrowBigRight, Banknote, RefreshCcwDot } from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ARAgingReport = () => {
  // State management
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("All Time");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

  // Fetch invoices data
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const organisation_id =
        localStorage.getItem("organization_id") || "100000"; // Fallback value
      const response = await apiService({
        method: "GET",
        url: `api/v1/invoices?organization_id=${organisation_id}`,
        customBaseUrl: config.PO_Base_url, // Adjust baseUrl as needed
      });

      // Based on your response structure - adjust path as needed
      const invoices = response.data.invoices || response.data; // Access the invoices array

      // Filter out invoices with status 'draft'
      const filteredInvoices = invoices.filter(
        (invoice) => invoice.status !== "draft"
      );

      setInvoices(filteredInvoices);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to fetch invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Date filtering utility functions
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWithinDays = (dateString, days) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays >= 0;
  };

  const isThisWeek = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6)); // Saturday
    return date >= startOfWeek && date <= endOfWeek;
  };

  // Filter invoices based on date and status
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // Apply date filter
    if (dateFilter === "Today") {
      filtered = filtered.filter((invoice) => isToday(invoice.created_time));
    } else if (dateFilter === "Last 7 Days") {
      filtered = filtered.filter((invoice) =>
        isWithinDays(invoice.created_time, 7)
      );
    } else if (dateFilter === "Last 30 Days") {
      filtered = filtered.filter((invoice) =>
        isWithinDays(invoice.created_time, 30)
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    return filtered;
  }, [invoices, dateFilter, statusFilter]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalAmount = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.total || 0),
      0
    );
    const totalBalance = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.balance || 0),
      0
    );
    const paidAmount = totalAmount - totalBalance;

    return { totalAmount, totalBalance, paidAmount };
  }, [filteredInvoices]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "partially paid":
        return "warning";
      default:
        return "default";
    }
  };

  // Export to PDF using jsPDF
  const exportToPDF = async () => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  try {
    // Dynamic import for Next.js compatibility
    const { jsPDF } = await import("jspdf");
    const { autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setTextColor(25, 118, 210); // Blue color
    doc.text("AR Aging Details by Invoice", 20, 20);

    // Generated on date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Applied filters
    doc.setFontSize(12);
    doc.setTextColor(0);

    // Table headers and data
    const tableHeaders = [
      "Date",
      "Transaction#",
      "Status", 
      "Customer Name",
      "Amount",
      "Paid",
      "Balance Due",
    ];

    // Prepare table data with corrected paid calculation
    const tableData = filteredInvoices.map((invoice) => {
      const totalAmount = parseFloat(invoice.total) || 0;
      const balanceDue = parseFloat(invoice.balance) || 0;
      const paidAmount = totalAmount - balanceDue; // Amount - Balance Due = Paid
      
      return [
        invoice.date_formatted ||
          (invoice.created_time
            ? new Date(invoice.created_time).toLocaleDateString()
            : "N/A"),
        invoice.invoice_number || "N/A",
        invoice.status_formatted || invoice.status || "N/A",
        invoice.customer_name || "N/A",
        formatCurrency(totalAmount),
        formatCurrency(paidAmount),
        formatCurrency(balanceDue),
      ];
    });

    // Calculate totals
    const totalAmount = filteredInvoices.reduce(
      (sum, invoice) => sum + (parseFloat(invoice.total) || 0),
      0
    );
    const totalBalance = filteredInvoices.reduce(
      (sum, invoice) => sum + (parseFloat(invoice.balance) || 0),
      0
    );
    const totalPaid = totalAmount - totalBalance; // Total Amount - Total Balance = Total Paid

    // Add total row
    tableData.push([
      "Total",
      "",
      "",
      "",
      formatCurrency(totalAmount),
      formatCurrency(totalPaid),
      formatCurrency(totalBalance),
    ]);

    // Generate table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 249, 249],
      },
      columnStyles: {
        4: { halign: "right" }, // Amount column
        5: { halign: "right" }, // Paid column
        6: { halign: "right" }, // Balance Due column
      },
      didParseCell: function (data) {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [236, 240, 241];
        }
      },
    });
    // Save the PDF
    const fileName = `AR_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    console.log("PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please check the console for details.");
  }
};

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <Box sx={{ width: "100%", bgcolor: "background.default" }}>
      <Box position="static" sx={{ height: "40px", alignItems: "center" }}>
        <Toolbar>
          <TodayIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "13px" }}
          >
            Receivable Invoice
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "13px" }}>
            As of {new Date().toLocaleDateString()}
          </Typography>
        </Toolbar>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Filters */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap="15px"
              sx={{ flexWrap: "wrap" }}
            >
              <Grid sx={{ display: "flex", gap: "20px" }}>
                <FormControl
                  size="small"
                  sx={{ minWidth: 180, height: "40px", fontSize: "13px" }}
                >
                  <InputLabel sx={{ fontSize: "14px" }}>Date Filter</InputLabel>
                  <Select
                    value={dateFilter}
                    label="Date Filter"
                    onChange={(e) => setDateFilter(e.target.value)}
                    sx={{ fontSize: "13px" }}
                  >
                    <MenuItem value="Today" sx={{ fontSize: "13px" }}>
                      Today
                    </MenuItem>
                    <MenuItem value="Last 7 Days" sx={{ fontSize: "13px" }}>
                      Last 7 Days
                    </MenuItem>
                    <MenuItem value="Last 30 Days" sx={{ fontSize: "13px" }}>
                      Last 30 Days
                    </MenuItem>
                    <MenuItem value="All Time" sx={{ fontSize: "13px" }}>
                      All Time
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel sx={{ fontSize: "14px" }}>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ fontSize: "13px" }}
                  >
                    <MenuItem value="All" sx={{ fontSize: "13px" }}>
                      All Status
                    </MenuItem>
                    <MenuItem value="paid" sx={{ fontSize: "13px" }}>
                      Paid
                    </MenuItem>
                    <MenuItem value="partially paid" sx={{ fontSize: "13px" }}>
                      Partially Paid
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ display: "flex", gap: "20px" }}>
                <IconButton
                  onClick={fetchInvoices}
                  color="success"
                  size="small"
                  sx={{
                    height: 30,
                    width: 30,
                  }}
                >
                  <RefreshCcwDot size={18} />
                </IconButton>

                <Button
                  color="success"
                  size="small"
                  startIcon={<GetAppIcon />}
                  onClick={exportToPDF}
                  disabled={filteredInvoices.length === 0}
                  sx={{
                    minWidth: 120,
                    height: 35,
                    border: "1px solid green",
                    fontSize: "13px",
                  }}
                >
                  Export PDF
                </Button>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Totals */}
            <Grid sx={{ mb: 2 }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 0.5 } }}>
                <Grid
                  container
                  spacing={2}
                  sx={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="primary"
                        sx={{ fontSize: "18px", mb: 0.5 }}
                      >
                        {filteredInvoices.length}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Total Invoices
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="primary"
                        sx={{ fontSize: "18px", mb: 0.5 }}
                      >
                        {formatCurrency(totals.paidAmount)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Paid Amount
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="success.main"
                        sx={{
                          fontSize: "18px",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowBigRight
                          style={{
                            height: "30px",
                            marginRight: "10px",
                            rotate: "55deg",
                          }}
                        />
                        {formatCurrency(totals.totalAmount)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Total Outstanding Receivables
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="warning.main"
                        sx={{ fontSize: "18px", mb: 0.5 }}
                      >
                        {formatCurrency(totals.totalBalance)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Overdue Invoice
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>

            {/* Data Table */}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer
                sx={{
                  maxHeight: 600,
                  borderRadius: 2,
                  border: "1px solid #eee",
                }}
              >
                <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f9f9f9", height: 36 }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                        Transaction#
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                        Customer Name
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, fontSize: "13px" }}
                        align="right"
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, fontSize: "13px" }}
                        align="right"
                      >
                        Balance Due
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredInvoices
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((invoice) => (
                        <TableRow key={invoice._id} hover sx={{ height: 40 }}>
                          <TableCell sx={{ fontSize: "13px" }}>
                            {invoice.date_formatted ||
                              new Date(
                                invoice.created_time
                              ).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }}>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() =>
                                router.push(
                                  `/sales/invoices/${invoice.invoice_id}`
                                )
                              }
                              sx={{
                                textTransform: "none",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#1976d2",
                                padding: 0,
                                minWidth: "auto",
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {invoice.invoice_number}
                            </Button>
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }}>
                            Invoice
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{ color: "green", fontSize: "13PX" }}
                            >
                              {invoice.status_formatted}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }}>
                            {invoice.customer_name}
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }} align="right">
                            {formatCurrency(invoice.total || 0)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }} align="right">
                            {formatCurrency(invoice.balance || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredInvoices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ARAgingReport;
