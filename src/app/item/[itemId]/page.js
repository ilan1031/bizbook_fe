"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Checkbox,
  CircularProgress,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter, useParams } from "next/navigation";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import {
  ChevronRight,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";
import { useSnackbar } from "../../../components/SnackbarProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import ItemOverview from "../../common/itemDetail/overview";
import ItemTransactions from "../../common/itemDetail/transactions";
import ItemHistory from "../../common/itemDetail/history";
import ItemViewComponent from "../ItemViewComponent";

const ITEM_LIST_LIMIT = 50;

const itemOptions = [
  { id: "all-items", is_favorite: true, title: "All Items", value: "Status.All" },
  { id: "active-items", is_favorite: true, title: "Active Items", value: "Status.Active" },
  { id: "inactive-items", is_favorite: false, title: "Inactive Items", value: "Status.Inactive" },
  { id: "low-stock-items", is_favorite: false, title: "Low Stock Items", value: "Status.LowStock" },
];
const menuItems = [
  { text: "Import Items", icon: <FileUploadIcon sx={{ fontSize: 14, color: "#408dfb" }} /> },
  { text: "Export Items", icon: <FileDownloadIcon sx={{ fontSize: 14, color: "#408dfb" }} /> },
  { text: "Preferences", icon: <SettingsIcon sx={{ fontSize: 14, color: "#408dfb" }} /> },
  { text: "Refresh List", icon: <RefreshIcon sx={{ fontSize: 14, color: "#408dfb" }} /> },
  { text: "Reset Column Width", icon: <SwapHorizIcon sx={{ fontSize: 14, color: "#408dfb" }} /> },
];

const ItemSplitView = () => {
  const { itemId } = useParams();
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(itemId || null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [leftMenuAnchor, setLeftMenuAnchor] = useState(null);
  const [rightMenuAnchor, setRightMenuAnchor] = useState(null);
  const [search, setSearch] = useState("");
  // Add filter/menu state
  const [itemStatusOptions, setItemStatusOptions] = useState(itemOptions);
  const [selectedStatus, setSelectedStatus] = useState(itemOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // Debug: Check if organization_id is available
  useEffect(() => {
    const organization_id = localStorage.getItem("organization_id");
    console.log("Organization ID from localStorage:", organization_id);
    console.log("Current URL:", window.location.href);
    console.log("Current pathname:", window.location.pathname);
    
    if (!organization_id) {
      console.error("No organization_id found in localStorage!");
      showMessage("Error: Organization ID not found", "error");
    }
    
    // Test API connectivity
    const testAPI = async () => {
      try {
        const res = await apiService({
          method: "GET",
          url: `/api/v1/item/getitems?organization_id=${organization_id}&page=1&limit=1`,
        });
        console.log("API test successful:", res);
      } catch (err) {
        console.error("API test failed:", err);
      }
    };
    
    if (organization_id) {
      testAPI();
    }
  }, []);

  // Update selectedId when itemId changes
  useEffect(() => {
    console.log("URL itemId parameter:", itemId);
    console.log("itemId type:", typeof itemId);
    console.log("itemId === 'undefined':", itemId === 'undefined');
    
    if (itemId && itemId !== 'undefined') {
      console.log("Setting selectedId to:", itemId);
      setSelectedId(itemId);
    } else {
      console.log("Invalid itemId, not setting selectedId");
    }
  }, [itemId]);

  // Fetch item list
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const organization_id = localStorage.getItem("organization_id");
        console.log("Fetching items with organization_id:", organization_id);
        
        let queryParams = `organization_id=${organization_id}&page=1&limit=${ITEM_LIST_LIMIT}`;
        if (selectedStatus.value !== "Status.All") {
          const status = selectedStatus.value.replace("Status.", "");
          queryParams += `&status=${status.toLowerCase()}`;
        }
        
        console.log("API URL:", `/api/v1/item/getitems?${queryParams}`);
        
        const res = await apiService({
          method: "GET",
          url: `/api/v1/item/getitems?${queryParams}`,
        });
        
        console.log("API Response:", res);
        const itemsData = res.data.data || [];
        console.log("Fetched items list:", itemsData);
        
        // Debug: Log the first item structure
        if (itemsData.length > 0) {
          console.log("First item structure:", itemsData[0]);
          console.log("Available ID fields in first item:", {
            _id: itemsData[0]._id,
            id: itemsData[0].id,
            item_id: itemsData[0].item_id,
            itemId: itemsData[0].itemId,
            ItemId: itemsData[0].ItemId
          });
        }
        
        setItems(itemsData);
      } catch (err) {
        console.error("Error fetching items list:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []); // Remove selectedStatus dependency for initial load

  // Handle status changes
  useEffect(() => {
    if (selectedStatus.value !== "Status.All") {
      const fetchItemsByStatus = async () => {
        setLoading(true);
        try {
          const organization_id = localStorage.getItem("organization_id");
          const status = selectedStatus.value.replace("Status.", "");
          const queryParams = `organization_id=${organization_id}&page=1&limit=${ITEM_LIST_LIMIT}&status=${status.toLowerCase()}`;
          
          console.log("Fetching items by status:", status);
          console.log("API URL:", `/api/v1/item/getitems?${queryParams}`);
          
          const res = await apiService({
            method: "GET",
            url: `/api/v1/item/getitems?${queryParams}`,
          });
          const itemsData = res.data.data || [];
          console.log("Fetched items by status:", itemsData);
          setItems(itemsData);
        } catch (err) {
          console.error("Error fetching items by status:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchItemsByStatus();
    }
  }, [selectedStatus]);

  // Fetch selected item details
  useEffect(() => {
    if (!selectedId) {
      setItem(null);
      return;
    }
    const fetchItem = async () => {
      setLoading(true);
      try {
        const organization_id = localStorage.getItem("organization_id");
        const response = await apiService({
          method: "GET",
          url: `/api/v1/item/singleitems/${selectedId}`, // selectedId is item_id
          params: { organization_id },
        });
        // Extract item_details and estimates
        const itemData = response?.data?.data?.item_details || null;
        const estimatesData = response?.data?.data?.estimates || [];
        setItem(itemData);
        // setEstimates(estimatesData); // if you want to use estimates
      } catch (err) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [selectedId]);

  // Handle item selection
  const handleSelectItem = (id) => {
    console.log("Selecting item with ID:", id);
    if (id && id !== selectedId) {
    setSelectedId(id);
    router.push(`/item/${id}`);
    }
  };

  // Handle item creation
  const handleCreateItem = async (itemData) => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      const response = await apiService({
        method: "POST",
        url: `/api/v1/items/newitems`,
        data: {
          ...itemData,
          organization_id
        }
      });
      console.log("Item created successfully:", response.data);
      showMessage("Item created successfully", "success");
      // Refresh the items list
      // You can add logic here to refresh the list
    } catch (err) {
      console.error("Error creating item:", err);
      showMessage("Failed to create item", "error");
    }
  };

  // Handle item update
  const handleUpdateItem = async (itemId, itemData) => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      const response = await apiService({
        method: "PUT",
        url: `/api/v1/item/${itemId}`,
        data: {
          ...itemData,
          organization_id
        }
      });
      console.log("Item updated successfully:", response.data);
      showMessage("Item updated successfully", "success");
      // Refresh the current item data
      setItem(response.data.data || response.data);
    } catch (err) {
      console.error("Error updating item:", err);
      showMessage("Failed to update item", "error");
    }
  };

  // Top left menu
  const handleLeftMenuOpen = (e) => setLeftMenuAnchor(e.currentTarget);
  const handleLeftMenuClose = () => setLeftMenuAnchor(null);

  // Top right menu
  const handleRightMenuOpen = (e) => setRightMenuAnchor(e.currentTarget);
  const handleRightMenuClose = () => setRightMenuAnchor(null);

  // Tab change
  const handleTabChange = (e, v) => setTab(v);

  // Filter/menu handlers
  const handleSelectStatus = (option) => {
    setSelectedStatus(option);
    setAnchorEl(null);
  };
  const toggleFavorite = (optionId, e) => {
    e.stopPropagation();
    setItemStatusOptions((prev) => prev.map((opt) =>
      opt.id === optionId ? { ...opt, is_favorite: !opt.is_favorite } : opt
    ));
  };

  // Search filter
  const filteredItems = items.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Render ---
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fff" }}>
      {/* Left Panel */}
      <Box sx={{ width: 340, borderRight: "1px solid #eee", display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 2, borderBottom: "1px solid #eee" }}>
          {/* Left Side - Filter Dropdown */}
          <Box onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Typography color="black" style={{ fontWeight: 700, fontSize: "large", textTransform: "none" }}>
              {selectedStatus.title}
            </Typography>
            <KeyboardArrowDownIcon />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 3,
              sx: {
                width: 250,
                marginLeft: "-10px",
                maxHeight: 500,
                overflowY: "auto",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                mt: 1,
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "& .MuiList-root": {
                  padding: "0px",
                },
              },
            }}
          >
            <Box
              sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
              }}
            >
              {itemStatusOptions.filter(opt => opt.is_favorite).length > 0 && (
                <>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "black", px: 2, py: 1 }}>
                    FAVORITES
                  </Typography>
                  <Divider />
                  {itemStatusOptions.filter(opt => opt.is_favorite).map((option) => (
                    <MenuItem
                      key={option.id}
                      onClick={() => handleSelectStatus(option)}
                      sx={{
                        fontSize: "13px",
                        backgroundColor: selectedStatus.id === option.id ? "#E6F1FF" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "#408dfb",
                          color: "white",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: selectedStatus.id === option.id ? 600 : 400,
                          color: selectedStatus.id === option.id ? "#4285F4" : "inherit",
                        }}
                      >
                        {option.title}
                      </Typography>
                      <IconButton size="small" onClick={(e) => toggleFavorite(option.id, e)} sx={{ padding: 0 }}>
                        <StarIcon sx={{ fontSize: 18, color: "orange" }} />
                      </IconButton>
                    </MenuItem>
                  ))}
                  {itemStatusOptions.filter(opt => !opt.is_favorite).length > 0 && itemStatusOptions.filter(opt => opt.is_favorite).length > 0 && <Divider />}
                </>
              )}
              {itemStatusOptions.filter(opt => !opt.is_favorite).length > 0 && (
                <>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "black", px: 2, py: 1 }}>
                    DEFAULT FILTERS
                  </Typography>
                  <Divider />
                  {itemStatusOptions.filter(opt => !opt.is_favorite).map((option) => (
                    <MenuItem
                      key={option.id}
                      onClick={() => handleSelectStatus(option)}
                      sx={{
                        fontSize: "13px",
                        backgroundColor: selectedStatus.id === option.id ? "#E6F1FF" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "#408dfb",
                          color: "white",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: selectedStatus.id === option.id ? 600 : 400,
                          color: selectedStatus.id === option.id ? "#4285F4" : "inherit",
                        }}
                      >
                        {option.title}
                      </Typography>
                      <IconButton size="small" onClick={(e) => toggleFavorite(option.id, e)} sx={{ padding: 0 }}>
                        {option.is_favorite ? (
                          <StarIcon sx={{ fontSize: 18, color: "#4285F4" }} />
                        ) : (
                          <StarBorderIcon sx={{ fontSize: 18, color: "#888" }} />
                        )}
                      </IconButton>
                    </MenuItem>
                  ))}
                </>
              )}
            </Box>
            <Divider />
            <MenuItem
              onClick={() => router.push("/common/newitem")}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                position: "sticky",
                bottom: 0,
                backgroundColor: "white",
                zIndex: 1,
                "&:hover": {
                  backgroundColor: "#E6F1FF",
                },
              }}
            >
              <IconButton
                size="small"
                sx={{
                  backgroundColor: "#4285F4",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  marginRight: 1,
                }}
              >
                <AddIcon sx={{ fontSize: 14, color: "white" }} />
              </IconButton>
              <Typography sx={{ fontSize: "13px", color: "#4285F4" }}>
                New Custom View
              </Typography>
            </MenuItem>
          </Menu>
          
          {/* Right Side - Menu and Add Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={() => router.push("/common/newitem")}>
              <AddIcon />
            </IconButton>
            <IconButton size="small" onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
            <Menu 
              anchorEl={menuAnchorEl} 
              open={Boolean(menuAnchorEl)} 
              onClose={() => setMenuAnchorEl(null)}
              PaperProps={{
                sx: {
                  width: "200px",
                  fontSize: "12px",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                  borderRadius: "8px",
                  mt: 1,
                },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  sx={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 1,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#E6F1FF",
                    },
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 400 }}>
                    {item.text}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
         
          </Box>
        </Box>
      
        {/* Item List */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress size={28} /></Box>
          ) : (
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {filteredItems.map((itm) => {
                  const itemId = itm.item_id; // Always use item_id
                  return (
                  <tr
                      key={itemId}
                    style={{
                        background: itemId === selectedId ? "#f5f7fa" : "#fff",
                      cursor: "pointer",
                    }}
                                            onClick={() => handleSelectItem(itemId)}
                  >
                    <td style={{ width: 36, padding: 0, textAlign: "center" }}>
                      <Checkbox
                        checked={false}
                        sx={{ p: 0.5 }}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-label": "select item" }}
                      />
                    </td>
                    <td style={{ padding: "10px 0 10px 0", fontWeight: 500, fontSize: 15, color: "#222" }}>
                      {itm.item_name || itm.name}
                    </td>
                    <td style={{ padding: "10px 16px 10px 0", textAlign: "right", fontWeight: 500, fontSize: 15, color: "#222" }}>
                      ₹{Number(itm.rate || itm.rate_formatted || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </Box>
          )}
        </Box>
      </Box>
      {/* Right Panel: ItemViewComponent */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <ItemViewComponent itemId={selectedId} item={item} />
      </Box>
    </Box>
  );
};

export default ItemSplitView;
