"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import SortIcon from "@mui/icons-material/Sort";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import Image from "next/image";
import PaymentReceived from "../../../../assets/payment-received.png";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../../../common/btn/Button";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import StarIcon from "@mui/icons-material/Star";

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

// Default filters data
const dummyDefaultFilters = [
  {
    id: 1,
    label: "All Payments",
    isFavorite: false,
    value: "all",
  },
  {
    id: 2,
    label: "Retainer Payments",
    isFavorite: false,
    value: "retainer",
  },
  {
    id: 3,
    label: "Invoice Payments",
    isFavorite: false,
    value: "invoice",
  },
  {
    id: 4,
    label: "Advance Payments",
    isFavorite: false,
    value: "advance",
  },
];

// Favorites array (empty initially)
const dummyFavorites = [];

// Menu items with icons
const menuItems = [
  {
    text: "Sort by",
    icon: <SortIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Import Quotes",
    icon: <FileUploadIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Export Quotes",
    icon: <FileDownloadIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Export Current View",
    icon: <FileDownloadIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Preferences",
    icon: <SettingsIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAltIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Refresh List",
    icon: <RefreshIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Reset Column Width",
    icon: (
      <FormatLineSpacingIcon color="primary" style={{ fontSize: "20px" }} />
    ),
  },
];

// Table columns configuration
const columns = [
  { key: "date", label: "DATE" },
  { key: "quoteNumber", label: "QUOTE NUMBER" },
  { key: "referenceNumber", label: "REFERENCE NUMBER" },
  { key: "customerName", label: "CUSTOMER NAME" },
  { key: "status", label: "STATUS" },
  { key: "amount", label: "AMOUNT" },
];

// Example static data for table rows
const staticData = [
  {
    key: "1",
    date: "2023-01-01",
    quoteNumber: "A12345",
    referenceNumber: "REF12345",
    customerName: "Ram",
    company: "",
    email: "abcde@zylker.com",
    phone: "+91-9870322457",
    placeOfSupply: "",
    amount: "₹16.50",
    amountBCY: "₹0.00",
    gstTreatment: "Registered Business - Regular",
    unusedCredits: "₹0.00",
    status: "Active",
  },
  {
    key: "2",
    date: "2023-01-02",
    quoteNumber: "B67890",
    referenceNumber: "REF67890",
    customerName: "Ganesh",
    company: "",
    email: "abcco@zylker.com",
    phone: "+1-5417543010",
    placeOfSupply: "",
    amount: "₹170",
    amountBCY: "₹1,706",
    gstTreatment: "Registered Business - Regular",
    unusedCredits: "₹0.00",
    status: "InActive",
  },
  {
    key: "3",
    date: "2023-01-03",
    quoteNumber: "C24680",
    referenceNumber: "REF24680",
    customerName: "Ethan",
    company: "ABC & Co.",
    email: "",
    phone: "",
    placeOfSupply: "",
    amount: "₹1.50",
    amountBCY: "₹10.00",
    gstTreatment: "Registered Business - Regular",
    unusedCredits: "₹0.00",
    status: "Active",
  },
];

const SelectionToolbar = ({ selectedCount, onClearSelection }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        bgcolor: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
        px: 2,
        py: 1,
      }}
    >
      <Button
        variant="text"
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: "#333",
          mr: 1,
          border: "1px solid #ddd",
          bgcolor: "white",
          "&:hover": { bgcolor: "#f8f8f8" },
        }}
      >
        Mark As Sent
      </Button>

      <Button
        variant="text"
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: "#333",
          mr: 1,
          border: "1px solid #ddd",
          bgcolor: "white",
          "&:hover": { bgcolor: "#f8f8f8" },
        }}
      >
        Associate with Sales Orders
      </Button>

      <IconButton
        size="small"
        sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}
      >
        <FileDownloadIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}
      >
        <FileUploadIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}
      >
        {/* <ReceiptIcon fontSize="small" /> */}
      </IconButton>

      <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
        <Button
          variant="outlined"
          size="small"
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            textTransform: "none",
            borderColor: "#ddd",
            color: "#333",
            mr: 1,
            paddingLeft: "8px",
            bgcolor: "white",
            "&:hover": { bgcolor: "#f8f8f8" },
          }}
        >
          Send
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none",
            borderColor: "#ddd",
            color: "#333",
            mr: 1,
            bgcolor: "white",
            "&:hover": { bgcolor: "#f8f8f8" },
          }}
        >
          Bulk Update
        </Button>

        <IconButton
          size="small"
          sx={{ bgcolor: "white", border: "1px solid #ddd" }}
        >
          <MoreVertIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "primary.main",
            fontWeight: 500,
            "& .dot": {
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              mr: 1,
            },
          }}
        >
          <span className="dot"></span>
          <Typography variant="body2" fontWeight={500}>
            {selectedCount} Invoice(s) Selected
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

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

const PaymentReceivedHomePage = () => {
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
            {selectedFilter} Received Payments
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
            onClick={() =>
              router.push("/sales/paymentsReceived/newPaymentReceived")
            }
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
        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            No Payments received, yet
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "15px" }}>
            Payments will be added once your customers pay for their invoices.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            sx={{ px: 3 }}
            // onClick={handleUnpaidInvoices}
          >
            GO TO UNPAID INVOICES
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Typography
            sx={{
              color: "#4285f4",
              fontSize: "14px",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            // onClick={handleImportPayments}
          >
            Import Payments
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Payment Lifecycle Section */}
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
            Life cycle of a Customer Payment
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Image
              src={PaymentReceived}
              alt="PaymentReceived Workflow"
              priority
              width={1200}
              height={250}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
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
            In the Payments Received module, you can:
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
                Automatically charge your customer&apos;s card for recurring
                invoices
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Configure payment gateways to receive online payments{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "#4285f4",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Learn More
                </Typography>
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Record payments manually
              </Typography>
            </CheckedItem>

            <CheckedItem>
              <CheckCircleOutlineIcon sx={{ color: "#4285f4", mr: 2 }} />
              <Typography sx={{ fontSize: "14px", textAlign: "left" }}>
                Send payment receipts to your customers
              </Typography>
            </CheckedItem>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentReceivedHomePage;
