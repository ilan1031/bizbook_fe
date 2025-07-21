"use client";
import { useEffect, useState } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Grid,
  Typography,
  ButtonGroup,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { AddOutlined } from "@mui/icons-material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";

import { useRouter } from "next/navigation";

import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";
import Button from "../common/btn/Button";
import CustomizedTable from "../common/table";
import SearchModal from "../common/searchModal";

const itemOptions = [
  {
    id: "all-items",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Items",
    value: "Status.All",
    key: "All Items",
    empty_msg: "There are no Items",
    column_orientation_type: "wrap",
  },
  {
    id: "active-items",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "Active Items",
    value: "Status.Active",
    key: "Active Items",
    empty_msg: "There are no active Items",
    column_orientation_type: "wrap",
  },
  {
    id: "inactive-items",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Inactive Items",
    value: "Status.Inactive",
    key: "Inactive Items",
    empty_msg: "There are no inactive Items",
    column_orientation_type: "wrap",
  },
  {
    id: "low-stock-items",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Low Stock Items",
    value: "Status.LowStock",
    key: "Low Stock Items",
    empty_msg: "There are no low stock Items",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  { text: "Sort by", icon: null, hasArrow: true },
  {
    text: "Import Items",
    icon: (
      <FileUploadIcon
        className="menu-icon"
        sx={{ fontSize: 14, color: "#408dfb" }}
      />
    ),
    hasArrow: false,
    primary: false,
  },
  {
    text: "Export Items",
    icon: (
      <FileDownloadIcon
        className="menu-icon"
        sx={{ fontSize: 14, color: "#408dfb" }}
      />
    ),
    hasArrow: false,
    primary: true,
  },
  {
    text: "Export Current View",
    icon: (
      <FileDownloadIcon
        className="menu-icon"
        sx={{ fontSize: 14, color: "#408dfb" }}
      />
    ),
    hasArrow: false,
    primary: false,
  },
  {
    text: "Preferences",
    icon: (
      <SettingsIcon
        className="menu-icon"
        sx={{ fontSize: 14, color: "#408dfb" }}
      />
    ),
    hasArrow: false,
    primary: false,
  },
  {
    text: "Refresh List",
    icon: (
      <RefreshIcon
        className="menu-icon"
        sx={{ fontSize: 14, color: "#408dfb" }}
      />
    ),
    hasArrow: false,
    primary: false,
  },
  {
    text: "Reset Column Width",
    icon: (
      <SwapHorizIcon
        className="menu-icon"
        sx={{ fontSize: 14, color: "#408dfb" }}
      />
    ),
    hasArrow: false,
    primary: false,
  },
];

const columns = [
  { key: "name", label: "NAME" },
  { key: "sku", label: "SKU" },
  { key: "purchase_description", label: "PURCHASE DESCRIPTION" },
  { key: "rate", label: "RATE" },
  { key: "description", label: "DESCRIPTION" },
  { key: "opening_stock", label: "OPENING STOCK" },
  { key: "unit", label: "UNIT" },
  { key: "account_name", label: "ACCOUNT NAME" },
];

const ItemsTable = () => {
  const [selectedType, setSelectedType] = useState("All Items");
  const [itemStatusOptions, setItemStatusOptions] = useState(itemOptions);
  const [selectedStatus, setSelectedStatus] = useState(itemOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [itemsList, setItemsList] = useState([]);
  const router = useRouter();
  const allSelected =
    selected.length === itemsList.length && itemsList.length !== 0;
  const { showMessage } = useSnackbar();
  const [welcomePg, setWelcomPg] = useState(false);

  const handleRowClick = (item) => {
    // Debug: Log the entire item to see its structure
    console.log("MAIN PAGE - Row clicked - Full item data:", item);
    console.log("MAIN PAGE - All item keys:", Object.keys(item));
    
    // Try different possible ID fields - check all possible variations
    const possibleIdFields = ['_id', 'item_id', 'id', 'itemId', 'ItemId'];
    let itemId = null;
    
    for (const field of possibleIdFields) {
      if (item[field]) {
        itemId = item[field];
        console.log(`MAIN PAGE - Found ID in field '${field}':`, itemId);
        break;
      }
    }
    
    console.log("MAIN PAGE - Final extracted itemId:", itemId);
    
    if (itemId) {
      console.log("MAIN PAGE - Navigating to item:", itemId, "from item data:", item);
      router.push(`/item/${itemId}`);
    } else {
      console.error("MAIN PAGE - No ID found in item:", item);
      console.log("MAIN PAGE - All item fields:", Object.keys(item));
      
      // Temporary fallback: use item name as ID for testing
      const fallbackId = item.item_name || item.name || item.ItemName || item.itemName;
      if (fallbackId) {
        console.log("MAIN PAGE - Using fallback ID (item name):", fallbackId);
        router.push(`/item/${fallbackId}`);
      } else {
        showMessage("Error: Item ID not found", "error");
      }
    }
  };

  const handleSelectAll = () => {
    setSelected(allSelected ? [] : itemsList.map((row) => row._id || row.item_id || row.id));
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClickCreate = () => {
    localStorage.setItem("addItem", "page");
    router.push("/common/newitem");
  };

  const handleSelect = (type, value) => {
    setSelectedType(type);
    setFilterBy(value);
    setSelected([]); // Clear selections when filter changes
    fetchItemsList(value);
    setAnchorEl(null);
  };

  const handleSelectStatus = (option) => {
    setSelectedStatus(option);
    handleSelect(option.title, option.value);
  };

  const toggleFavorite = (optionId, e) => {
    e.stopPropagation();
    const updatedOptions = itemStatusOptions.map((option) =>
      option.id === optionId
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setItemStatusOptions(updatedOptions);
  };

  const handleNewCustomView = () => {
    // Implement new custom view logic
    showMessage("Create New Custom View", "info");
  };

  const handleOpenSearchDialog = () => {
    setOpenSearchDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setOpenSearchDialog(false);
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  useEffect(() => {
    console.log("Initial load - fetching items with filterBy:", filterBy);
    fetchItemsList(filterBy);
  }, []);

  const fetchItemsList = async (filterValue) => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      console.log("Fetching items with organization_id:", organization_id);
      
      if (!organization_id) {
        console.error("No organization_id found!");
        showMessage("Error: Organization ID not found", "error");
        return;
      }
      
      // Build query parameters based on filter
      let queryParams = `organization_id=${organization_id}&page=1&limit=50&sortBy=createdAt&order=desc`;
      
      // Add status filter if not "All"
      if (filterValue && filterValue !== "Status.All") {
        const status = filterValue.replace("Status.", "");
        queryParams += `&status=${status.toLowerCase()}`;
      }
      
      console.log("API URL:", `api/v1/item/getitems?${queryParams}`);
      
      const response = await apiService({
        method: "GET",
        url: `api/v1/item/getitems?${queryParams}`,
        file: false,
      });
      
      const data = response.data.data || [];
      
      // Debug: Log the first item to understand the data structure
      if (data.length > 0) {
        console.log("First item structure:", data[0]);
        console.log("Available ID fields:", {
          _id: data[0]._id,
          id: data[0].id,
          item_id: data[0].item_id,
          itemId: data[0].itemId
        });
        console.log("All item IDs for debugging:", data.map(item => ({
          name: item.item_name || item.name,
          _id: item._id,
          id: item.id,
          item_id: item.item_id
        })));
        
        // Test: Log what happens when we try to extract ID from first item
        const testItem = data[0];
        const possibleIdFields = ['_id', 'item_id', 'id', 'itemId', 'ItemId'];
        let foundId = null;
        for (const field of possibleIdFields) {
          if (testItem[field]) {
            foundId = testItem[field];
            console.log(`Found ID in field '${field}':`, foundId);
            break;
          }
        }
        if (!foundId) {
          console.log("No ID found in any field for first item");
        }
      }

      if (filterValue === "Status.All" && data.length === 0) {
        setWelcomPg(true);
      } else {
        setWelcomPg(false);
      }
      
      setItemsList(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      showMessage("Error fetching items", "error");
      setItemsList([]);
      setWelcomPg(true);
    }
  };

  const favoriteOptions = itemStatusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = itemStatusOptions.filter((opt) => !opt.is_favorite);

  return (
    <Grid container>
      <Grid bgcolor="white" item md={12}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "white",
          }}
        >
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {selected.length > 0 && (
              <>
                <ButtonGroup
                  variant="contained"
                  aria-label="Basic button group"
                  className="group-btn"
                  sx={{ mr: 1 }}
                >
                  <Button className="bulk-update-btn">
                    <MailOutlineIcon className="bulk-update-btn-icon" />
                  </Button>
                  <Button className="bulk-update-btn">
                    <PrintOutlinedIcon className="bulk-update-btn-icon" />
                  </Button>
                </ButtonGroup>
                <Button
                  variant="contained"
                  className="bulk-update-btn"
                  sx={{ mr: 1 }}
                >
                  Bulk Update
                </Button>

                <IconButton
                  className="more-icon"
                  onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                >
                  <MoreVertIcon className="button-more-svg" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={() => setMenuAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      width: "200px",
                      height: "300px",
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {item.icon}
                          <Typography
                            sx={{
                              ml: 2,
                              fontSize: "0.875rem",
                              fontWeight: item.hasArrow ? 500 : 400,
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Box>
                        {item.hasArrow && (
                          <KeyboardArrowRightIcon sx={{ color: "#9e9e9e" }} />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "#408dfb",
                    borderRadius: "50%",
                    ml: 1,
                  }}
                />
                <Typography sx={{ ml: 1, fontWeight: 600, fontSize: "16px" }}>
                  {selected.length}
                </Typography>
                <Typography sx={{ ml: 1, fontWeight: 500, fontSize: "13px" }}>
                  Item(s) Selected
                </Typography>
              </>
            )}
            {selected.length === 0 && (
              <>
                <Box
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    color="black"
                    style={{
                      fontWeight: 700,
                      fontSize: "large",
                      textTransform: "none",
                    }}
                  >
                    {selectedType}
                  </Typography>
                  <KeyboardArrowDownIcon />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      width: 250,
                      // height: "260px",
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
                      // maxHeight: "250px",
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
                    {favoriteOptions.length > 0 && (
                      <>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "black",
                            px: 2,
                            py: 1,
                          }}
                        >
                          FAVORITES
                        </Typography>
                        <Divider />
                        {favoriteOptions.map((option) => (
                          <MenuItem
                            key={option.id}
                            onClick={() => handleSelectStatus(option)}
                            sx={{
                              fontSize: "13px",
                              backgroundColor:
                                selectedStatus.id === option.id
                                  ? "#E6F1FF"
                                  : "transparent",
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
                                fontWeight:
                                  selectedStatus.id === option.id ? 600 : 400,
                                color:
                                  selectedStatus.id === option.id
                                    ? "#4285F4"
                                    : "inherit",
                              }}
                            >
                              {option.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => toggleFavorite(option.id, e)}
                              sx={{ padding: 0 }}
                            >
                              <StarIcon
                                sx={{
                                  fontSize: 18,
                                  color: "orange",
                                }}
                              />
                            </IconButton>
                          </MenuItem>
                        ))}
                        {defaultOptions.length > 0 &&
                          favoriteOptions.length > 0 && <Divider />}
                      </>
                    )}

                    {defaultOptions.length > 0 && (
                      <>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "black",
                            px: 2,
                            py: 1,
                          }}
                        >
                          DEFAULT FILTERS
                        </Typography>
                        <Divider />
                        {defaultOptions.map((option) => (
                          <MenuItem
                            key={option.id}
                            onClick={() => handleSelectStatus(option)}
                            sx={{
                              fontSize: "13px",
                              backgroundColor:
                                selectedStatus.id === option.id
                                  ? "#E6F1FF"
                                  : "transparent",
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
                                fontWeight:
                                  selectedStatus.id === option.id ? 600 : 400,
                                color:
                                  selectedStatus.id === option.id
                                    ? "#4285F4"
                                    : "inherit",
                              }}
                            >
                              {option.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => toggleFavorite(option.id, e)}
                              sx={{ padding: 0 }}
                            >
                              {option.is_favorite ? (
                                <StarIcon
                                  sx={{
                                    fontSize: 18,
                                    color: "#4285F4",
                                  }}
                                />
                              ) : (
                                <StarBorderIcon
                                  sx={{
                                    fontSize: 18,
                                    color: "#888",
                                  }}
                                />
                              )}
                            </IconButton>
                          </MenuItem>
                        ))}
                      </>
                    )}
                  </Box>

                  <Divider />
                  <MenuItem
                    onClick={handleNewCustomView}
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
                      <AddIcon
                        sx={{
                          fontSize: 14,
                          color: "white",
                        }}
                      />
                    </IconButton>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#4285F4",
                      }}
                    >
                      New Custom View
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Right Side */}
          {!selected.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box sx={{ mr: 0.5 }}>
                <Button
                  variant="contained"
                  className="button-submit"
                  startIcon={<AddOutlined />}
                  onClick={() => handleClickCreate()}
                >
                  New
                </Button>
              </Box>
              <IconButton
                className="more-icon"
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon className="button-more-svg" />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                PaperProps={{
                  sx: {
                    width: "200px",
                    height: "300px",
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
                        backgroundColor: "#4285F4",
                        color: "white",
                      },
                    }}
                  >
                    {item.icon}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        ml: 2,
                        fontSize: "0.875rem",
                        fontWeight: item.hasArrow ? 500 : 400,
                      }}
                    >
                      {item.text}
                    </Typography>

                    {item.hasArrow && (
                      <KeyboardArrowRightIcon sx={{ color: "#9e9e9e" }} />
                    )}
                  </MenuItem>
                ))}
              </Menu>
              <IconButton
                sx={{
                  backgroundColor: "#ff9800",
                  color: "white",
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#e68900" },
                  fontSize: "13px",
                  height: "35px",
                  width: "35px",
                  fontWeight: 800,
                }}
              >
                ?
              </IconButton>
            </Box>
          )}
        </Toolbar>
        <Divider />
        {/*Full-width Table*/}
        {!welcomePg ? (
          <>
           
            <CustomizedTable
              columns={columns}
              staticData={itemsList}
              selected={selected}
              handleSelectAll={handleSelectAll}
              handleSelectRow={handleSelectRow}
              allSelected={allSelected}
              settingsAnchorEl={settingsAnchorEl}
              handleSettingsClick={handleSettingsClick}
              handleSettingsClose={handleSettingsClose}
              selectedMenuItem={selectedMenuItem}
              onRowClick={handleRowClick}
              setSelectedMenuItem={setSelectedMenuItem}
              handleOpenSearchDialog={handleOpenSearchDialog}
              selectedType={selectedType}
              value="item"
            />
            {console.log("MAIN PAGE - Rendering CustomizedTable with onRowClick:", handleRowClick)}
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", my: 4 }}>
            No items found. Click the New button to create one.
          </Typography>
        )}
      </Grid>
      <SearchModal
        open={openSearchDialog}
        onClose={handleCloseSearchDialog}
        onSearch={(searchData) => console.log("Search:", searchData)}
      />
    </Grid>
  );
};

export default ItemsTable;
