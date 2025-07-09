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
  Chip,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

const ItemTransactions = ({ itemId, organizationId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const tabLabels = ["Sales", "Purchases", "Stock Movements", "All"];

  useEffect(() => {
    if (itemId) {
      fetchTransactions();
    }
  }, [itemId, activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would be replaced with actual API call
      // const response = await apiService({
      //   method: "GET",
      //   url: `/api/v1/items/${itemId}/transactions`,
      //   params: { 
      //     organization_id: organizationId,
      //     type: activeTab === 3 ? "all" : tabLabels[activeTab].toLowerCase()
      //   },
      // });

      // Mock data for demonstration
      const mockTransactions = [
        {
          id: 1,
          type: "sale",
          date: "2024-01-15",
          reference: "INV-001",
          quantity: 10,
          amount: 15000,
          customer: "ABC Company",
          status: "completed",
        },
        {
          id: 2,
          type: "purchase",
          date: "2024-01-10",
          reference: "PO-001",
          quantity: 50,
          amount: 50000,
          vendor: "XYZ Suppliers",
          status: "completed",
        },
        {
          id: 3,
          type: "stock_adjustment",
          date: "2024-01-08",
          reference: "ADJ-001",
          quantity: -5,
          amount: 0,
          reason: "Damaged goods",
          status: "completed",
        },
        {
          id: 4,
          type: "sale",
          date: "2024-01-05",
          reference: "INV-002",
          quantity: 5,
          amount: 7500,
          customer: "DEF Corp",
          status: "pending",
        },
      ];

      // Filter based on active tab
      let filteredTransactions = mockTransactions;
      if (activeTab === 0) { // Sales
        filteredTransactions = mockTransactions.filter(t => t.type === "sale");
      } else if (activeTab === 1) { // Purchases
        filteredTransactions = mockTransactions.filter(t => t.type === "purchase");
      } else if (activeTab === 2) { // Stock Movements
        filteredTransactions = mockTransactions.filter(t => t.type === "stock_adjustment");
      }

      setTransactions(filteredTransactions);
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "sale":
        return <TrendingUp size={16} color="#22b378" />;
      case "purchase":
        return <TrendingDown size={16} color="#408dfb" />;
      case "stock_adjustment":
        return <Package size={16} color="#f76831" />;
      default:
        return <Package size={16} />;
    }
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case "sale":
        return "Sale";
      case "purchase":
        return "Purchase";
      case "stock_adjustment":
        return "Stock Adjustment";
      default:
        return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return "success";
      case "pending":
      case "draft":
        return "warning";
      case "cancelled":
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Transaction History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View all transactions related to this item
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={label}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {label}
                  {index < 3 && (
                    <Chip
                      label={
                        transactions.filter(t => 
                          index === 0 ? t.type === "sale" :
                          index === 1 ? t.type === "purchase" :
                          t.type === "stock_adjustment"
                        ).length
                      }
                      size="small"
                      sx={{ minWidth: 20, height: 20, fontSize: "0.75rem" }}
                    />
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Transactions Table */}
      <Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Party</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getTransactionIcon(transaction.type)}
                        <Typography variant="body2">
                          {getTransactionTypeLabel(transaction.type)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Calendar size={14} />
                        <Typography variant="body2">
                          {formatDate(transaction.date)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {transaction.reference}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: transaction.quantity > 0 ? "success.main" : "error.main",
                          fontWeight: 600,
                        }}
                      >
                        {transaction.quantity > 0 ? "+" : ""}{transaction.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <DollarSign size={14} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatAmount(transaction.amount)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.customer || transaction.vendor || transaction.reason || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        color={getStatusColor(transaction.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Package size={48} color="#ccc" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No transactions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no {tabLabels[activeTab].toLowerCase()} transactions for this item.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {transactions.filter(t => t.type === "sale").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sales
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {transactions.filter(t => t.type === "purchase").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Purchases
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {formatAmount(transactions.reduce((sum, t) => sum + (t.amount || 0), 0))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {transactions.reduce((sum, t) => sum + (t.quantity || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net Quantity
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ItemTransactions; 