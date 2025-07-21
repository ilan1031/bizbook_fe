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
  Delete,
  Package,
  TrendingUp,
  Clock,
  Copy,
  Edit as EditIcon,
  Close as CloseIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ItemOverview from "../common/itemDetail/overview";
import ItemTransactions from "../common/itemDetail/transactions";
import ItemHistory from "../common/itemDetail/history";

const staticData = {
  item_name: "chair",
  item_type: "Sales and Purchase Items",
  hsn_code: "444444",
  created_source: "User",
  tax_preference: "Taxable",
  cost_price: "₹800.00",
  purchase_account: "Cost of Goods Sold",
  selling_price: "₹1,000.00",
  sales_account: "Sales"
};

const ItemViewComponent = ({ data, callViewAPI, organizationData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    console.log("Tab changed to:", newValue);
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

  const handleClone = () => {
    handleMenuClose();
    console.log("Clone item:", data?.item_id || data?._id);
  };

  const handleMarkAsInactive = () => {
    handleMenuClose();
    console.log("Mark as inactive:", data?.item_id || data?._id);
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
    <Box sx={{ height: "100vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", px: 4, py: 3, borderBottom: "1px solid #eee" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, flex: 1, color: "#222" }} noWrap>
            {data?.item_name || data?.name || ""}
          </Typography>
          <IconButton onClick={handleEdit}><EditIcon /></IconButton>
          <IconButton onClick={handleMenuClick}><MoreVert /></IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { width: 200, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px" } }}>
            <MenuItem onClick={() => { handleMenuClose(); handleClone(); }}>Clone Item</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); handleMarkAsInactive(); }}>Mark as Inactive</MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); handleDelete(); }} sx={{ color: "error.main" }}>Delete</MenuItem>
          </Menu>
          <IconButton onClick={() => router.push("/item")}> <CloseIcon /> </IconButton>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ px: 2, minHeight: 48 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Package size={8} />
                <Typography variant="body2">Overview</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TrendingUp size={8} />
                <Typography variant="body2">Transactions</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Clock size={8} />
                <Typography variant="body2">History</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {console.log("Current activeTab:", activeTab)}
        {activeTab === 0 && (
          <>
            {console.log("Rendering ItemOverview with data:", data || staticData)}
            <ItemOverview 
              data={data || staticData} 
              onEdit={handleEdit}
            />
          </>
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