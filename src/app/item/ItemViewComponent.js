"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Download,
  Share,
  Eye,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ItemOverview from "../common/itemDetail/overview";
import ItemTransactions from "../common/itemDetail/transactions";
import ItemHistory from "../common/itemDetail/history";

const ItemViewComponent = ({ data, callViewAPI, organizationData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (data?.item_id || data?._id) {
      router.push(`/item/edit/${data.item_id || data._id}`);
    }
  };

  const handleDelete = () => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Handle delete logic
      console.log("Delete item:", data?.item_id || data?._id);
    }
  };

  const handleDownload = () => {
    handleMenuClose();
    // Handle download logic
    console.log("Download item data");
  };

  const handleShare = () => {
    handleMenuClose();
    // Handle share logic
    console.log("Share item");
  };

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

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No item data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {data.item_name || data.name || "Item Details"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Chip
                label={data.status_formatted || data.status || "Active"}
                color={getStatusColor(data.status)}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Item Code: {data.item_code || data.code || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Category: {data.category_name || data.category || "N/A"}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {data.description || "No description available"}
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Edit size={16} />}
              onClick={handleEdit}
              size="small"
            >
              Edit
            </Button>
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  width: 200,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                },
              }}
            >
              <MenuItem onClick={handleClone}>
                <Copy size={16} style={{ marginRight: 8 }} />
                Clone Item
              </MenuItem>
              <MenuItem onClick={handleMarkAsInactive}>
                <Copy size={16} style={{ marginRight: 8 }} />
                Mark as Inactive
              </MenuItem>
           
              <Divider />
              <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                <Delete size={16} style={{ marginRight: 8 }} />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ px: 3 }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Package size={16} />
                Overview
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp size={16} />
                Transactions
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Clock size={16} />
                History
              </Box>
            }
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {activeTab === 0 && (
          <ItemOverview 
            data={data} 
            onEdit={handleEdit}
          />
        )}
        {activeTab === 1 && (
          <ItemTransactions 
            itemId={data.item_id || data._id}
            organizationId={organizationData?.organization_id}
          />
        )}
        {activeTab === 2 && (
          <ItemHistory 
            itemId={data.item_id || data._id}
            organizationId={organizationData?.organization_id}
          />
        )}
      </Box>
    </Box>
  );
};

export default ItemViewComponent; 