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

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ItemHistory = ({ itemId, organizationId }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (itemId) {
      fetchHistory();
    }
  }, [itemId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with real API call
      const mockHistory = [
        { date: "26/02/2025 09:25 AM", details: "marked as active - SHREENEVIKHA N SNSIHUB" },
        { date: "26/02/2025 09:25 AM", details: "marked as inactive - SHREENEVIKHA N SNSIHUB" },
        { date: "22/02/2025 02:39 PM", details: "created by - SHREENEVIKHA N SNSIHUB" },
      ];
      setHistory(mockHistory);
    } catch (err) {
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0, pt: 3, pr: 6 }}>
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
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#888" }}>DETAILS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((row, idx) => {
                  // Split details into action and user if possible
                  let action = row.details;
                  let user = "";
                  if (row.details.includes(" - ")) {
                    [action, user] = row.details.split(" - ");
                  }
                  return (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontSize: 15 }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: 15 }}>
                        <span style={{ fontWeight: 600 }}>{action}</span>
                        {user && (
                          <span style={{ fontStyle: "italic", color: "#888", marginLeft: 4 }}> - {user}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ItemHistory; 