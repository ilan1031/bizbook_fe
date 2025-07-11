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

const statusColor = (status) => {
  if (!status) return "inherit";
  const s = status.toLowerCase();
  if (s === "accepted") return "#22b378";
  if (s === "sent") return "#408dfb";
  if (s === "invoiced") return "#f76831";
  return "#888";
};

const formatCurrency = (value) =>
  value != null ? `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-";

const ItemTransactions = ({ itemId, organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [filterBy, setFilterBy] = useState("Quotes");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    if (itemId) {
      fetchTransactions();
    }
    // eslint-disable-next-line
  }, [itemId, filterBy, status]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with real API call
      const mockTransactions = [
        { date: "16/04/2025", quote_number: "QT-000014", customer_name: "Ms. divya", quantity_sold: 1, price: 60000, total: 60000, status: "Accepted" },
        { date: "16/04/2025", quote_number: "QT-000017", customer_name: "Ms. Shree nevikha", quantity_sold: 1, price: 60000, total: 60000, status: "Sent" },
        { date: "16/04/2025", quote_number: "QT-000013", customer_name: "Ms. divya", quantity_sold: 1, price: 60000, total: 60000, status: "Invoiced" },
        { date: "16/04/2025", quote_number: "QT-000016", customer_name: "Ms. Shree nevikha", quantity_sold: 1, price: 60000, total: 60000, status: "Accepted" },
        { date: "16/04/2025", quote_number: "QT-000012", customer_name: "Ms. Shree nevikha", quantity_sold: 1, price: 60000, total: 60000, status: "Accepted" },
        { date: "16/04/2025", quote_number: "QT-000015", customer_name: "Ms. divya", quantity_sold: 1, price: 60000, total: 60000, status: "Sent" },
        { date: "16/04/2025", quote_number: "QT-000011", customer_name: "Ms. divya", quantity_sold: 1, price: 60000, total: 60000, status: "Accepted" },
        { date: "26/03/2025", quote_number: "QT-000004", customer_name: "bharathi & co", quantity_sold: 1, price: 60000, total: 60000, status: "Invoiced" },
      ];
      setTransactions(mockTransactions);
    } catch (err) {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0, pt: 3, pr: 6 }}>
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
          {["Quotes", "Sales Orders", "Invoices", "Delivery Challans", "Credit Notes", "Recurring Invoices"].map((option) => (
            <MenuItem key={option} selected={option === filterBy} onClick={() => { setFilterBy(option); setFilterAnchor(null); }}>{option}</MenuItem>
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
          {["All", "Accepted", "Sent", "Invoiced"].map((option) => (
            <MenuItem key={option} selected={option === status} onClick={() => { setStatus(option); setStatusAnchor(null); }}>{option}</MenuItem>
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
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DATE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>QUOTE NUMBER</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>CUSTOMER NAME</TableCell>
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
                      <TableCell sx={{ fontSize: 15 }}>{row.quote_number}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{row.customer_name}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{row.quantity_sold}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{formatCurrency(row.price)}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>{formatCurrency(row.total)}</TableCell>
                      <TableCell sx={{ fontSize: 15, fontWeight: 600, color: statusColor(row.status) }}>{row.status}</TableCell>
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