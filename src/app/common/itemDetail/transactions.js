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
  Tabs,
  Tab,
} from "@mui/material";
import { 
  fetchItemTransactions, 
  transformTransactionData, 
  formatCurrency, 
  getStatusColor 
} from "../../../utils/api";
import apiService from "../../../services/axiosService";

const moduleTabs = [
  { key: "estimates", label: "Estimates" },
  { key: "salesorders", label: "Sales Orders" },
  { key: "invoices", label: "Invoices" },
  // Add more modules as needed
];

const TransactionTable = ({ data }) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DATE</TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DOCUMENT NUMBER</TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>CUSTOMER/VENDOR NAME</TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>QUANTITY</TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>PRICE</TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>TOTAL</TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>STATUS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx} hover>
            <TableCell sx={{ fontSize: 15 }}>{row.date_formatted || row.date}</TableCell>
            <TableCell sx={{ fontSize: 15 }}>{row.estimate_number || row.invoice_number || row.salesorder_number || row.document_number}</TableCell>
            <TableCell sx={{ fontSize: 15 }}>{row.customer_name || row.vendor_name}</TableCell>
            <TableCell sx={{ fontSize: 15 }}>{row.quantity || row.quantity_sold}</TableCell>
            <TableCell sx={{ fontSize: 15 }}>{formatCurrency(row.price || row.rate)}</TableCell>
            <TableCell sx={{ fontSize: 15 }}>{(row.item_total_formatted || row.total)}</TableCell>
            <TableCell sx={{ fontSize: 15, fontWeight: 600, color: getStatusColor(row.status || row.status_formatted) }}>{row.status || row.status_formatted}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const ItemTransactions = ({ itemId, organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState({});
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (itemId && organizationId) {
      fetchModules();
    }
  }, [itemId, organizationId]);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("ItemTransactions - Fetching from /item/singleitems/", itemId);
      const response = await apiService({
        method: "GET",
        url: `/api/v1/item/singleitems/${itemId}`,
        params: { organization_id: organizationId },
      });
      console.log("ItemTransactions - API response:", response);
      if (response && response.data && response.data.data) {
        setModules(response.data.data);
        console.log("ItemTransactions - Set modules:", response.data.data);
      } else {
        setModules({});
        setError("No transaction modules found in response");
        console.log("ItemTransactions - No modules in response:", response);
      }
    } catch (err) {
      setError("Failed to load transactions");
      setModules({});
      console.error("ItemTransactions - Error fetching modules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => setTab(newValue);

  // Only show tabs for modules with data
  const availableTabs = moduleTabs.filter(
    (mod) => Array.isArray(modules[mod.key]) && modules[mod.key].length > 0
  );

  return (
    <Box sx={{ p: 0, pt: 3, pr: 6, ml: 2 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>
      ) : availableTabs.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            No transactions found for this item.
          </Typography>
        </Box>
      ) : (
        <>
          <Tabs value={tab} onChange={handleTabChange}>
            {availableTabs.map((mod, idx) => (
              <Tab key={mod.key} label={mod.label} />
            ))}
          </Tabs>
          {availableTabs.map((mod, idx) =>
            tab === idx && (
              <TransactionTable data={modules[mod.key]} key={mod.key} />
            )
          )}
        </>
      )}
    </Box>
  );
};

export default ItemTransactions; 