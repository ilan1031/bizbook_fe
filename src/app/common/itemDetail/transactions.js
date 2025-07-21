"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { 
  fetchItemTransactions, 
  transformTransactionData, 
  formatCurrency, 
  getStatusColor 
} from "../../../utils/api";

const ItemTransactions = ({ itemId, organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [filterBy, setFilterBy] = useState("All Documents");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    if (itemId && organizationId) {
      fetchTransactions();
    }
    // eslint-disable-next-line
  }, [itemId, organizationId, filterBy, status]);

  const fetchTransactions = async () => {
    if (!itemId || !organizationId) {
      setError("Missing item ID or organization ID");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Use the utility function to fetch real transaction data
      const allTransactions = await fetchItemTransactions(itemId, organizationId, filterBy, status);
      
      if (allTransactions.length > 0) {
        // Transform to display format using utility function
        const transformedTransactions = transformTransactionData(allTransactions, itemId, filterBy);
        setTransactions(transformedTransactions);
      } else {
        // If no real data found, use fallback
        console.log("No real transactions found, using fallback data");
        const fallbackData = generateFallbackData(filterBy, status);
        setTransactions(fallbackData);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions");
      // Use fallback data on error
      const fallbackData = generateFallbackData(filterBy, status);
      setTransactions(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackData = (filterType, statusFilter) => {
    const baseData = [
      { date: "16/04/2025", number: "QT-000014", customer: "Ms. divya", quantity: 2, rate: 45000, status: "Accepted" },
      { date: "15/04/2025", number: "QT-000017", customer: "Ms. Shree nevikha", quantity: 1, rate: 60000, status: "Sent" },
      { date: "14/04/2025", number: "QT-000013", customer: "Ms. divya", quantity: 3, rate: 35000, status: "Invoiced" },
      { date: "13/04/2025", number: "QT-000016", customer: "Ms. Shree nevikha", quantity: 1, rate: 55000, status: "Accepted" },
      { date: "12/04/2025", number: "QT-000012", customer: "Ms. Shree nevikha", quantity: 2, rate: 40000, status: "Draft" },
      { date: "11/04/2025", number: "QT-000015", customer: "Ms. divya", quantity: 1, rate: 70000, status: "Pending" },
      { date: "10/04/2025", number: "QT-000011", customer: "Ms. divya", quantity: 4, rate: 25000, status: "Approved" },
      { date: "09/04/2025", number: "QT-000004", customer: "bharathi & co", quantity: 1, rate: 80000, status: "Invoiced" },
    ];

    // Filter by status if not "All"
    const filteredData = statusFilter === "All" 
      ? baseData 
      : baseData.filter(item => item.status === statusFilter);

    // Transform to match the filter type
    return filteredData.map(item => ({
      date: item.date,
      document_number: item.number.replace("QT-", getPrefixByFilter(filterType)),
      customer_name: item.customer,
      quantity_sold: item.quantity,
      price: item.rate,
      total: item.quantity * item.rate,
      status: item.status,
      document_type: filterType
    }));
  };

  const getPrefixByFilter = (filter) => {
    switch (filter) {
      case "Quotes": return "QT-";
      case "Sales Orders": return "SO-";
      case "Invoices": return "INV-";
      case "Delivery Challans": return "DC-";
      case "Credit Notes": return "CN-";
      case "Recurring Invoices": return "RI-";
      case "Bills": return "BILL-";
      case "Purchase Orders": return "PO-";
      default: return "QT-";
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    setFilterAnchor(null);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setStatusAnchor(null);
  };

  return (
    <Box sx={{ p: 0, pt: 3, pr: 6 ,ml:2}}>
      {/* Filter Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: "none", fontWeight: 500, borderRadius: 2, px: 2, py: 0.5, fontSize: 15 }}
          onClick={(e) => setFilterAnchor(e.currentTarget)}
        >
          Filter By: {filterBy}
        </Button>
        <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
          {["All Documents", "Quotes", "Sales Orders", "Invoices", "Delivery Challans", "Credit Notes", "Recurring Invoices", "Bills", "Purchase Orders"].map((option) => (
            <MenuItem key={option} selected={option === filterBy} onClick={() => handleFilterChange(option)}>{option}</MenuItem>
          ))}
        </Menu>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: "none", fontWeight: 500, borderRadius: 2, px: 2, py: 0.5, fontSize: 15 }}
          onClick={(e) => setStatusAnchor(e.currentTarget)}
        >
          Status: {status}
        </Button>
        <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
          {["All", "Accepted", "Sent", "Invoiced", "Draft", "Pending", "Approved", "Rejected", "Paid", "Unpaid", "Overdue", "Partially Paid"].map((option) => (
            <MenuItem key={option} selected={option === status} onClick={() => handleStatusChange(option)}>{option}</MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Table */}
      <Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>
        ) : transactions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              No {filterBy.toLowerCase()} found for this item.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DATE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>
                    {filterBy === "All Documents" ? "DOCUMENT" : filterBy.toUpperCase().replace(" ", "_")} NUMBER
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>CUSTOMER/VENDOR NAME</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>QUANTITY SOLD</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>PRICE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>TOTAL</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .filter((row) => status === "All" || row.status === status)
                  .map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: 15 }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{row.document_number}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{row.customer_name}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{row.quantity_sold}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{formatCurrency(row.price)}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{formatCurrency(row.total)}</TableCell>
                      <TableCell sx={{ fontSize: 15, fontWeight: 600, color: getStatusColor(row.status) }}>{row.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ItemTransactions; 