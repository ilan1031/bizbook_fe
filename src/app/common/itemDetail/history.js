"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { fetchItemHistory, formatDateTime } from "../../../utils/api";
import apiService from "../../../services/axiosService";

const ItemHistory = ({ itemId, organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (itemId && organizationId) {
      fetchHistory();
    }
  }, [itemId, organizationId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("ItemHistory - Fetching from /item/singleitems/", itemId);
      const response = await apiService({
        method: "GET",
        url: `/api/v1/item/singleitems/${itemId}`,
        params: { organization_id: organizationId },
      });
      console.log("ItemHistory - API response:", response);
      if (response && response.data && response.data.data && response.data.data.item_details) {
        const comments = response.data.data.item_details.comments || [];
        setHistory(comments);
        console.log("ItemHistory - Set history to comments:", comments);
      } else {
        setHistory([]);
        setError("No comments found in response");
        console.log("ItemHistory - No comments in response:", response);
      }
    } catch (err) {
      setError("Failed to load history");
      setHistory([]);
      console.error("ItemHistory - Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackHistory = () => {
    return [
      { 
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        action: "Marked as Active", 
        user: "SHREENEVIKHA N SNSIHUB",
        details: "Item status was changed to Active"
      },
      { 
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        action: "Marked as Inactive", 
        user: "SHREENEVIKHA N SNSIHUB",
        details: "Item status was changed to Inactive"
      },
      { 
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        action: "Created", 
        user: "SHREENEVIKHA N SNSIHUB",
        details: "Item was created in the system"
      },
      { 
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        action: "Price Updated", 
        user: "SHREENEVIKHA N SNSIHUB",
        details: "Item selling price was updated to ₹500.00"
      },
      { 
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        action: "Stock Updated", 
        user: "SHREENEVIKHA N SNSIHUB",
        details: "Item opening stock was set to 100 units"
      }
    ];
  };

  return (
    <Box sx={{ p: 0, pt: 3, pr: 6 ,ml:2}}>
      <Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>
        ) : history.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              No comments found for this item.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DATE</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>COMMENT</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>BY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontSize: 15 }}>{row.date_formatted || row.date || "-"}</TableCell>
                    <TableCell sx={{ fontSize: 15 }}>{row.description}</TableCell>
                    <TableCell sx={{ fontSize: 15 }}>{row.commented_by || row.commented_by_id || "-"}</TableCell>
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

export default ItemHistory; 