"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  Container,
  styled,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  InputBase,
  InputAdornment,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import DeliveryChallan from "../../../../assets/deliverychallan.png";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../../../common/btn/Button";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import StarIcon from "@mui/icons-material/Star";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  MonitorCog,
  Upload,
} from "lucide-react";

// Custom styled components
const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  borderBottom: "1px solid #eaeaea",
  position: "sticky",
  top: 0,
  backgroundColor: "#f8f9fa",
  zIndex: 100,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "4px",
  padding: "8px 16px",
}));

const OutlinedButton = styled(StyledButton)(({ theme }) => ({
  border: "1px solid #d0d0d0",
  color: "#555",
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const CheckedItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  margin: "16px 0",
}));

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All",
    value: "Status.All",
    key: "Delivery Challan",
    empty_msg: "There are no Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Draft",
    value: "Status.Draft",
    key: "Delivery Challan Draft",
    empty_msg: "There are no Draft Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Open",
    value: "Status.Open",
    key: "Delivery Challan Open",
    empty_msg: "There are no Open Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Delivered",
    value: "Status.Delivered",
    key: "Delivery Challan Delivered",
    empty_msg: "There are no Delivered Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Returned",
    value: "Status.Returned",
    key: "Delivery Challan Returned",
    empty_msg: "There are no Returned Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Partially Invoiced",
    value: "Status.PartiallyInvoiced",
    key: "Delivery Challan Partially Invoiced",
    empty_msg: "There are no Partially Invoiced Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Invoiced",
    value: "Status.Invoiced",
    key: "Delivery Challan Invoiced",
    empty_msg: "There are no Invoiced Delivery Challan",
    column_orientation_type: "wrap",
  },
];

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [];

// Updated menuItems with icons
const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
  },
  {
    text: "Export Delivery Challans",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAltIcon className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "date", label: "DATE" },
  { key: "deliverychallan_number", label: "DELIVERY CHALLAN#" },
  // { key: "reference_number", label: "REFERENCE#" },
  { key: "customer_name", label: "CUSTOMER NAME" },
  { key: "status_formatted", label: "Status" },
  { key: "invoiced_status_formatted", label: "INVOICE STATUS" },
  { key: "total_formatted", label: "AMOUNT" },
];

const CustomFilterMenu = ({
  anchorEl,
  handleClose,
  favoritesData,
  filtersData,
  onSelect,
  onFavoriteToggle,
  selectedType,
}) => {
  // Keep the original filters data intact - never modify it
  const [filters] = useState(filtersData);
  const [favoriteIds, setFavoriteIds] = useState(
    new Set(favoritesData.map((fav) => fav.id))
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleFavorite = (filter) => {
    const newFavoriteIds = new Set(favoriteIds);

    if (favoriteIds.has(filter.id)) {
      // Remove from favorites
      newFavoriteIds.delete(filter.id);
    } else {
      // Add to favorites
      newFavoriteIds.add(filter.id);
    }

    setFavoriteIds(newFavoriteIds);
    onFavoriteToggle(filter);
  };

  const handleFilterSelect = (filter) => {
    onSelect(filter.label);
    handleClose();
  };

  // ALWAYS show ALL filters in Default Filters section (regardless of favorite status)
  const filteredDefaultFilters = filters.filter((filter) =>
    filter.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show ONLY favorited filters in Favorites section
  const filteredFavorites = filters.filter(
    (filter) =>
      favoriteIds.has(filter.id) &&
      filter.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to check if a filter is favorite
  const isFavorite = (filterId) => favoriteIds.has(filterId);

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: "220px",
          maxHeight: "400px",
          display: "flex",
          flexDirection: "column",
        },
      }}
      MenuListProps={{
        style: {
          padding: 0,
          flexGrow: 1,
        },
      }}
    >
      {/* Sticky Search Input */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          p: 1.5,
        }}
      >
        <InputBase
          placeholder="Search..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            border: "1px solid #ddd",
            px: 1,
            py: 0.5,
            fontSize: "0.75rem",
            "&:hover": { borderColor: "#1976d2" },
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "#aaa" }} />
            </InputAdornment>
          }
        />
      </Box>

      {/* Favorites Section - Only show if there are favorites */}
      {filteredFavorites.length > 0 && (
        <>
          <Typography
            variant="subtitle2"
            sx={{
              p: 1,
              pl: 1.5,
              color: "#666",
              fontSize: "0.75rem",
              backgroundColor: "#f9f9f9",
            }}
          >
            FAVORITES
          </Typography>
          <List disablePadding sx={{ maxHeight: "150px", overflow: "auto" }}>
            {filteredFavorites.map((filter) => (
              <ListItem
                key={`fav-${filter.id}`}
                dense
                button
                onClick={() => handleFilterSelect(filter)}
                sx={{
                  py: 0.5,
                  pl: 1.5,
                  backgroundColor:
                    selectedType === filter.label ? "#f0f7ff" : "inherit",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <ListItemText
                  primary={filter.label}
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    color: selectedType === filter.label ? "#1976d2" : "#444",
                    fontWeight:
                      selectedType === filter.label ? "bold" : "normal",
                  }}
                />
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(filter);
                  }}
                  sx={{ padding: "2px" }}
                >
                  <StarIcon fontSize="small" sx={{ color: "#f3cf00" }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </>
      )}

      {/* All Filters Section - Always shows all filters */}
      <Typography
        variant="subtitle2"
        sx={{
          p: 1,
          pl: 1.5,
          color: "#666",
          fontSize: "0.75rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        DEFAULT FILTERS
      </Typography>
      <List disablePadding sx={{ flexGrow: 1, overflow: "auto" }}>
        {filteredDefaultFilters.map((filter) => (
          <ListItem
            key={filter.id}
            dense
            button
            onClick={() => handleFilterSelect(filter)}
            sx={{
              py: 0.5,
              pl: 1.5,
              backgroundColor:
                selectedType === filter.label ? "#f0f7ff" : "inherit",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemText
              primary={filter.label}
              primaryTypographyProps={{
                fontSize: "0.85rem",
                color: selectedType === filter.label ? "#1976d2" : "#444",
                fontWeight: selectedType === filter.label ? "bold" : "normal",
              }}
            />
            <IconButton
              edge="end"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(filter);
              }}
              sx={{ padding: "2px" }}
            >
              {isFavorite(filter.id) ? (
                <StarIcon fontSize="small" sx={{ color: "#f3cf00" }} />
              ) : (
                <StarBorderIcon fontSize="small" sx={{ color: "#aaa" }} />
              )}
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Sticky Footer with "+ New Custom View" Button */}
      <ListItem
        button
        alignItems="center"
        sx={{
          py: 1.5,
          px: 2,
          position: "sticky",
          bottom: 0,
          borderTop: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          zIndex: 10,
        }}
      >
        <IconButton
          size="small"
          sx={{
            mr: 2,
            bgcolor: "#e3f2fd",
            color: "#1976d2",
            "&:hover": {
              bgcolor: "#bbdefb",
            },
          }}
        >
          <AddCircleOutlinedIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="subtitle2" color="primary">
          New Custom View
        </Typography>
      </ListItem>
    </Menu>
  );
};

const DeliveryChallanPage = () => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const router = useRouter();

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleMoreMenuClick = (event) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null);
  };

  const handleFilterSelect = (filterLabel) => {
    setSelectedFilter(filterLabel);
  };

  const handleFavoriteToggle = (filter) => {
    const updatedFilters = filters.map((f) =>
      f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
    );
    setFilters(updatedFilters);

    if (filter.isFavorite) {
      setFavorites(favorites.filter((f) => f.id !== filter.id));
    } else {
      setFavorites([...favorites, { ...filter, isFavorite: true }]);
    }
  };

  const handleMenuItemClick = (menuItem) => {
    console.log(`Clicked: ${menuItem.text}`);
    handleMoreMenuClose();
    // Add specific functionality for each menu item here
  };

  return (
    <Box>
      <StyledHeader>
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          onClick={handleFilterClick}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {selectedFilter} Delivery Challans
          </Typography>
          <IconButton>
            <KeyboardArrowDownIcon color="primary" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mx: 1 }}
            onClick={() => router.push("/sales/deliveryChallan/new")}
          >
            New
          </Button>
          <IconButton sx={{ color: "#555" }} onClick={handleMoreMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              borderRadius: 1,
              "&:hover": { backgroundColor: "#e68900" },
              fontSize: "13px",
              width: "31px",
              fontWeight: 800,
            }}
          >
            ?
          </IconButton>
        </Box>
      </StyledHeader>

      {/* Filter Dropdown Menu */}
      <CustomFilterMenu
        anchorEl={filterAnchorEl}
        handleClose={handleFilterClose}
        favoritesData={favorites}
        filtersData={filters}
        onSelect={handleFilterSelect}
        onFavoriteToggle={handleFavoriteToggle}
        selectedType={selectedFilter}
      />

      {/* More Options Menu */}
      <Menu
        anchorEl={moreMenuAnchorEl}
        open={Boolean(moreMenuAnchorEl)}
        onClose={handleMoreMenuClose}
        PaperProps={{
          style: {
            width: "200px",
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMenuItemClick(item)}
            sx={{
              py: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              {item.icon}
            </Box>
            <Typography variant="body2">{item.text}</Typography>
          </MenuItem>
        ))}
      </Menu>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Deliver Goods effectively!
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            Create, customize and print professional Delivery Challans
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            sx={{ px: 3 }}
            onClick={() => router.push("/sales/deliveryChallan/new")}
          >
            CREATE DELIVERY CHALLAN
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Expense Chart Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 6,
              fontWeight: 500,
            }}
          >
            Life cycle of a Delivery Challan
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Image
              src={DeliveryChallan}
              alt="Delivery Challan Workflow"
              priority
              width={1400} // Adjust the width
              height={450} // Adjust the height accordingly
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Features List */}
        <Box
          sx={{
            mb: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
            In the Delivery Challan module, you can:
          </Typography>
          <Box
            sx={{
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Create delivery challans to accompany your goods when they are
                in transit.
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Convert a delivery challan into an invoice to charge your
                customers.
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Mark your delivery challan as returned or record partial
                returns.
              </Typography>
            </CheckedItem>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DeliveryChallanPage;
