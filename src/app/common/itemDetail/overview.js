"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Edit, Package, DollarSign, Inventory, Category, Code } from "lucide-react";

const ItemOverview = ({ data, onEdit }) => {
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No item data available
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "available":
      case "in_stock":
        return "success";
      case "draft":
      case "pending":
        return "warning";
      case "inactive":
      case "discontinued":
      case "out_of_stock":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            {data.item_name || data.name || "Item Name"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={data.status_formatted || data.status || "Active"}
              color={getStatusColor(data.status)}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Item Code: {data.item_code || data.code || "N/A"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            icon={<Edit size={16} />}
            label="Edit"
            variant="outlined"
            onClick={onEdit}
            sx={{ cursor: "pointer" }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Package size={20} />
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: "40%" }}>Item Name</TableCell>
                    <TableCell>{data.item_name || data.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Item Code</TableCell>
                    <TableCell>{data.item_code || data.code || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell>{data.category_name || data.category || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell>
                      {data.description || "No description available"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                    <TableCell>{data.unit || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell>
                      <Chip
                        label={data.status_formatted || data.status || "Active"}
                        color={getStatusColor(data.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Pricing & Stock */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <DollarSign size={20} />
              Pricing & Stock
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: "40%" }}>Rate</TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        {data.rate_formatted || data.rate || "₹0.00"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Stock Quantity</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Inventory size={16} />
                        <Typography variant="h6" color="text.primary">
                          {data.stock_quantity || data.quantity || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Reorder Level</TableCell>
                    <TableCell>{data.reorder_level || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Tax Rate</TableCell>
                    <TableCell>{data.tax_rate ? `${data.tax_rate}%` : "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>HSN Code</TableCell>
                    <TableCell>{data.hsn_code || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                    <TableCell>{data.sku || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Additional Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Code size={20} />
              Additional Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: "40%" }}>Created Date</TableCell>
                        <TableCell>{data.created_at_formatted || data.createdAt || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Last Modified</TableCell>
                        <TableCell>{data.updated_at_formatted || data.updatedAt || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
                        <TableCell>{data.created_by || "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: "40%" }}>Brand</TableCell>
                        <TableCell>{data.brand || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Model</TableCell>
                        <TableCell>{data.model || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Weight</TableCell>
                        <TableCell>{data.weight ? `${data.weight} ${data.weight_unit || 'kg'}` : "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemOverview; 