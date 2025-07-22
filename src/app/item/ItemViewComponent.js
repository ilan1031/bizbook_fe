"use client";
import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Delete,
  Package,
  TrendingUp,
  Clock,
  Copy,
} from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import ItemOverview from "../common/itemDetail/overview";
import ItemTransactions from "../common/itemDetail/transactions";
import ItemHistory from "../common/itemDetail/history";
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";

const ItemViewComponent = ({ itemId: propItemId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showMessage } = useSnackbar();

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const organization_id = localStorage.getItem("organization_id");
        let response = await apiService({
          method: "GET",
          url: `/api/v1/item/getitems`,
          params: {
            organization_id,
            item_id: propItemId,
          },
        });
        let itemData = null;
        if (response?.data?.data && Array.isArray(response.data.data)) {
          itemData = response.data.data.find(
            (itm) =>
              itm._id === propItemId ||
              itm.item_id === propItemId ||
              itm.id === propItemId ||
              itm._id === String(propItemId) ||
              itm.item_id === String(propItemId) ||
              itm.id === String(propItemId)
          );
        }
        setItem(itemData || response?.data?.data || null);
      } catch (err) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    if (propItemId) fetchItem();
  }, [propItemId]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  const handleMenuClick = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const handleEdit = () => {
    handleMenuClose();
    const editId = item?._id || item?.item_id || item?.id;
    console.log('Navigating to edit page with ID:', editId);
    if (editId) {
      router.push(`/item/edit/${editId}`);
    } else {
      alert('No valid item ID found for editing.');
    }
  };
  const handleDelete = async () => {
    handleMenuClose();
    const deleteId = item?.item_id; // Use only item_id as per backend
    if (!deleteId) {
      showMessage("No valid item_id found for deletion.", "error");
      return;
    }
    const admin_id = localStorage.getItem("admin_id");
    if (!admin_id) {
      showMessage("No admin_id found. Please log in again.", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const organization_id = localStorage.getItem("organization_id");
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/items/${deleteId}`, // Corrected endpoint
        params: { organization_id, admin_id },
      });
      if (response.data?.status) {
        showMessage("Item deleted successfully!", "success");
        router.push("/item");
      } else {
        showMessage(response.data?.message || "Failed to delete item.", "error");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to delete item.", "error");
    }
  };

  const handleClone = async () => {
    handleMenuClose();
    if (!item) {
      showMessage("No item data to clone.", "error");
      return;
    }
    // Remove unique fields
    const { _id, item_id, id, ...cloneData } = item;
    // Optionally, clear or modify other fields as needed
    localStorage.setItem("clonedItemData", JSON.stringify(cloneData));
    router.push("/common/newitem");
  };
  const handleMarkAsInactive = () => {
    handleMenuClose();
    // Implement mark as inactive logic here
    alert("Mark as inactive: " + (item?.item_id || item?._id));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!item) {
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
        <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, flex: 1, color: "#222" }} noWrap>
            {item?.item_name || item?.name || ""}
          </Typography>
          <IconButton onClick={handleEdit}><EditIcon /></IconButton>
          <IconButton onClick={handleMenuClick}><MoreVertIcon /></IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { width: 200, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px" } }}>
            <MenuItem onClick={handleClone}>Clone Item</MenuItem>
            <MenuItem onClick={handleMarkAsInactive}>Mark as Inactive</MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>Delete</MenuItem>
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
                <Typography variant="body2">Overview</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2">Transactions</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2">History</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
        </Tabs>
      </Paper>
      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {activeTab === 0 && (
          <ItemOverview data={item} />
        )}
        {activeTab === 1 && (
          <ItemTransactions itemId={item.item_id || item._id} organizationId={localStorage.getItem("organization_id")} />
        )}
        {activeTab === 2 && (
          <ItemHistory itemId={item.item_id || item._id} organizationId={localStorage.getItem("organization_id")} />
        )}
      </Box>
    </Box>
  );
};

export default ItemViewComponent; 