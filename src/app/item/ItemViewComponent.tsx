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
import StockHistory from "../../components/inventory/StockHistory";
import { usePermissions } from "../../services/PermissionProvider";
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";

const ItemViewComponent = ({ itemId: propItemId }: any) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
        let itemData: any = null;
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
        // Only ever store one item; never the list the server returned.
        setItem(itemData || null);
      } catch (err) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    if (propItemId) fetchItem();
  }, [propItemId]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);
  // The stock history tab: for items that track inventory, for users who can see stock.
  const perms = usePermissions();
  const showStockHistory = Boolean(item?.track_inventory) && Boolean(perms?.isSuperadmin || perms?.can?.("inventory", "view"));
  const handleMenuClick = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  // Items are addressed by their item_id everywhere in the API.
  const handleEdit = () => {
    handleMenuClose();
    const editId = item?.item_id;
    if (editId) {
      router.push(`/item/edit/${editId}`);
    } else {
      showMessage("This item can't be edited.", "error");
    }
  };
  const handleDelete = async () => {
    handleMenuClose();
    const deleteId = item?.item_id;
    if (!deleteId) {
      showMessage("No valid item_id found for deletion.", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const organization_id = localStorage.getItem("organization_id");
      // The server takes the owner from the sign-in token.
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/items/${deleteId}`,
        params: { organization_id },
      });
      if (response.data?.status) {
        showMessage("Item deleted successfully!", "success");
        router.push("/items/itemtable");
      } else {
        showMessage(response.data?.message || "Failed to delete item.", "error");
      }
    } catch (err) {
      showMessage(err?.message || "Failed to delete item.", "error");
    }
  };

  const handleClone = () => {
    handleMenuClose();
    if (!item?.item_id) {
      showMessage("No item data to clone.", "error");
      return;
    }
    router.push(`/common/newitem?clone=${encodeURIComponent(item.item_id)}`);
  };
  const isInactive = item?.status === "inactive";
  const handleMarkAsInactive = async () => {
    handleMenuClose();
    const newStatus = isInactive ? "active" : "inactive";
    try {
      const organization_id = localStorage.getItem("organization_id");
      await apiService({
        method: "PUT",
        url: `/api/v1/item/${item.item_id}`,
        params: { organization_id },
        data: { status: newStatus },
      });
      setItem((prev) => ({ ...prev, status: newStatus }));
      showMessage(`Item marked as ${newStatus}.`, "success");
    } catch (err) {
      showMessage(err?.message || "Couldn't change the item's status.", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex" as const, justifyContent: "center" as const, alignItems: "center" as const, height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!item) {
    return (
      <Box sx={{ p: 3, textAlign: "center" as const }}>
        <Typography variant="h6" color="text.secondary">
          No item data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "calc(100vh - 64px)", overflow: "auto" as const, display: "flex" as const, flexDirection: "column" as const }}>
      {/* Header */}
      <Paper sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex" as const, alignItems: "center" as const, px: 1, py: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, flex: 1, color: "#222" }} noWrap>
            {item?.item_name || item?.name || ""}
          </Typography>
          <IconButton onClick={handleEdit}><EditIcon /></IconButton>
          <IconButton onClick={handleMenuClick}><MoreVertIcon /></IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { width: 200, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px" } }}>
            <MenuItem onClick={handleClone}>Clone Item</MenuItem>
            <MenuItem onClick={handleMarkAsInactive}>{isInactive ? "Mark as Active" : "Mark as Inactive"}</MenuItem>
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
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 0.5 }}>
                <Typography variant="body2">Overview</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
          <Tab
            label={
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 0.5 }}>
                <Typography variant="body2">Transactions</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
          <Tab
            label={
              <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 0.5 }}>
                <Typography variant="body2">History</Typography>
              </Box>
            }
            sx={{ minHeight: 40, py: 0.5 }}
          />
          {showStockHistory && (
            <Tab
              label={
                <Box sx={{ display: "flex" as const, alignItems: "center" as const, gap: 0.5 }}>
                  <Typography variant="body2">Stock history</Typography>
                </Box>
              }
              sx={{ minHeight: 40, py: 0.5 }}
            />
          )}
        </Tabs>
      </Paper>
      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: "auto" as const }}>
        {activeTab === 0 && (
          <ItemOverview data={item} />
        )}
        {activeTab === 1 && (
          <ItemTransactions itemId={item.item_id || item._id} organizationId={localStorage.getItem("organization_id")} />
        )}
        {activeTab === 2 && (
          <ItemHistory itemId={item.item_id || item._id} organizationId={localStorage.getItem("organization_id")} />
        )}
        {activeTab === 3 && showStockHistory && (
          <StockHistory {...({} as any)} itemId={item.item_id || item._id} organizationId={localStorage.getItem("organization_id")} />
        )}
      </Box>
    </Box>
  );
};

export default ItemViewComponent; 