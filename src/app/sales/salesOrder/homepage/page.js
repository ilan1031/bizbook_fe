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
import SalesOrder from "../../../../../src/assets/salesorder.png";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import StarIcon from "@mui/icons-material/Star";
import Button from "../../../common/btn/Button";
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

const GreenButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: "#00b373",
  color: "white",
  "&:hover": {
    backgroundColor: "#009c65",
  },
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
    isFavorite: true,
    label: "All",
    value: "Status.All",
    key: "Sales Order",
    empty_msg: "There are no Sales Order",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Draft",
    value: "Status.Draft",
    key: "Sales order Draft",
    empty_msg: "There are no Draft Sales Order",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Confirmed",
    value: "Status.Confirmed",
    key: "Sales order Confirmed",
    empty_msg: "There are no confirmed Sales Order",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Invoiced",
    value: "Status.Invoiced",
    key: "Sales order Invoiced",
    empty_msg: "There are no invoiced Sales Order",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Closed",
    value: "Status.Closed",
    key: "Sales order Closed",
    empty_msg: "There are no closed Sales Order",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Void",
    value: "Status.Void",
    key: "Sales order Void",
    empty_msg: "There are no void Sales Order",
    column_orientation_type: "wrap",
  },
];

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [
  {
    id: "1",
    isFavorite: true,
    label: "All",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no Sales Order",
    column_orientation_type: "wrap",
  },
];

// Updated menuItems with icons
const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "date", label: "Date", order: "D" },
      { key: "salesorder_number", label: "Sales Orde#", order: "D" },
      { key: "reference_number", label: "Reference#", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "total", label: "Amount", order: "D" },
    ],
  },
  {
    text: "Import Sales Orders",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Sales Orders",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Export Current View",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  // { text: "Import Debit Notes", icon: <ReceiptIcon className="menu-icon" /> },
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
  // { text: "Configure Online Payments", icon: <PaymentIcon className="menu-icon" /> },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "date_formatted", label: "DATE" },
  { key: "salesorder_number", label: "SALES ORDER#" },
  { key: "reference_number", label: "REFERENCE#" },
  { key: "customer_name", label: "CUSTOMER NAME" },
  { key: "order_status_formatted", label: "ORDER STATUS" },
  { key: "company_name", label: "COMPANY NAME" },
  { key: "invoiced_status_formatted", label: "INVOICED" },
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
const SalesOrderHomePage = () => {
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
            {selectedFilter} Sales Order
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
            onClick={() => router.push("/sales/salesOrder/new")}
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

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Expense Management Section */}
        <Paper
          elevation={1}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 6,
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
            mt: 5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ position: "relative", mb: 2 }}>
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#e0f7e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  margin: "30px",
                }}
              >
                <PlayCircleIcon sx={{ color: "#00b373", fontSize: "32px" }} />
              </Box>
            </Box>
            <Box sx={{ borderLeft: "2px solid #00b373", pl: 2 }}>
              <Box sx={{ mr: 2 }}>
                <Typography
                  component="div"
                  sx={{ fontSize: "13px", fontWeight: 500, color: "#555" }}
                >
                  <Box
                    component="img"
                    src="https://books.zoho.in/ogp.png"
                    alt="Biz Books"
                    width={60}
                    height={30}
                    sx={{ verticalAlign: "middle" }}
                  />
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "14px", color: "#555" }}>
                How to create a Sales Order
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Start Managing Your Sales Activities!
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            Create, customize and send professional Sales Orders.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 4 }}
            onClick={() => router.push("/sales/salesOrder/new")}
          >
            CREATE SALES ORDER
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
            Life cycle of a Sales Order
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Image
              src={SalesOrder}
              alt="Sales Order Workflow"
              priority
              width={1000} // Adjust the width
              height={450} // Adjust the height accordingly
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Features List */}
        <Box
          sx={{
            mb: 5,
            mt: 10,
            marginLeft: "30%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
            In the Sales Orders module, you can:
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
                Create sales orders to follow up an quote or customer request.
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Convert the sales order into a purchase order if you are low on
                stock.
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Convert the sales order into an invoice if the sale goes
                through.
              </Typography>
            </CheckedItem>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SalesOrderHomePage;
