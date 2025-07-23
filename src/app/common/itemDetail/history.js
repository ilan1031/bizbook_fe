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
    
  };

  return (
    <Box sx={{ p: 0, pt: 3, pr: 9, ml: 2 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : history.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography color="text.secondary">
            No comments found for this item.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ backgroundColor: 'transparent' }}>
          <Table sx={{ backgroundColor: 'transparent' }}>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '12px', 
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #eee',
                    pb: 2
                  }}
                >
                  DATE
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '12px', 
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #eee',
                    pb: 2
                  
                  }}
                >
                  DETAILS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row, idx) => (
                <TableRow 
                  key={idx} 
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  <TableCell 
                    sx={{ 
                      fontSize: '13px',
                      color: '#666',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #f5f5f5',
                      py: 2,
                      fontWeight: 500
                    }}
                  >
                    {row.date_formatted || row.date || "-"}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontSize: '13px',
                      color: '#333',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #f5f5f5',
                      py: 2
                    }}
                  >
                    <Box>
                      <Box component="span" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {/* Format description to show action like "marked as active" instead of "Item updated. Changes: status: inactive → active" */}
                        {row.description?.includes('status:') && row.description?.includes('→') 
                          ? `marked as ${row.description.split('→')[1]?.trim()}` 
                          : row.description}
                      </Box>
                      {(row.commented_by || row.commented_by_id) && (
                        <Box component="span" sx={{ color: '#888', ml: 1, fontStyle: 'italic' }}>
                          - {row.commented_by || row.commented_by_id}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ItemHistory;