"use client";
import { useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  InputBase,
  InputAdornment,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { AddOutlined } from "@mui/icons-material";
import SortIcon from "@mui/icons-material/Sort";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PaymentIcon from "@mui/icons-material/Payment";
import RefreshIcon from "@mui/icons-material/Refresh";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import CustomizedTable from "../../common/table";
import SearchModal from "../../common/searchModal";
import { useRouter } from "next/navigation";
import WelcomePage from "./homepage/page";
// import CustomFilterMenu from "../../common/filterDropDown";
// Updated dummyDefaultFilters with improved structure
const dummyDefaultFilters = [
  { id: 1, label: "All", isFavorite: false },
  { id: 2, label: "Draft", isFavorite: false },
  // { id: 3, label: 'Locked', isFavorite: false },
  { id: 2, label: "Pending Approval", isFavorite: false },
  { id: 3, label: "Approved", isFavorite: false },
  { id: 4, label: "Sent", isFavorite: false },
  { id: 5, label: "Customer Viewed", isFavorite: false },
  { id: 6, label: "Accepted", isFavorite: false },
  { id: 7, label: "Invoiced", isFavorite: false },
  { id: 8, label: "Declined", isFavorite: false },
  { id: 9, label: "Expired", isFavorite: false },
  // { id: 10, label: 'Payment Initiated', isFavorite: false },
  // { id: 11, label: 'Paid', isFavorite: false },
  // { id: 12, label: 'Void', isFavorite: false },
  // { id: 13, label: 'Debit Note', isFavorite: false },
  // { id: 14, label: 'Write Off', isFavorite: false },
];

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [];

// Updated menuItems with icons
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
  // { text: "Import Debit Notes", icon: <ReceiptIcon color="primary" style={{ fontSize: "20px" }} /> },
  {
    text: "Preferences",
    icon: <SettingsIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAltIcon color="primary" style={{ fontSize: "20px" }} />,
  },
  // { text: "Configure Online Payments", icon: <PaymentIcon color="primary" style={{ fontSize: "20px" }} /> },
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

const columns = [
  { key: "date", label: "DATE" },
  { key: "quoteNumber", label: "QUOTE NUMBER" },
  { key: "referenceNumber", label: "REFERENCE NUMBER" },
  { key: "customerName", label: "CUSTOMER NAME" },
  { key: "status", label: "STATUS" },
  { key: "amount", label: "AMOUNT" },
  // { key: "receivablesBCY", label: "RECEIVABLES (BCY)" },
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
        bgcolor: "#f5f5f5", // Grey background
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
        <ReceiptIcon fontSize="small" />
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
  const [filters, setFilters] = useState(filtersData);
  const [favorites, setFavorites] = useState(favoritesData);

  const handleToggleFavorite = (filter) => {
    const updatedFilters = filters.map((f) =>
      f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
    );

    setFilters(updatedFilters);

    // Update favorites
    const updatedFilter = updatedFilters.find((f) => f.id === filter.id);
    if (updatedFilter.isFavorite) {
      setFavorites([...favorites, updatedFilter]);
    } else {
      setFavorites(favorites.filter((f) => f.id !== filter.id));
    }

    onFavoriteToggle(filter);
  };

  const handleFilterSelect = (filter) => {
    onSelect(filter.label);
    handleClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: "220px",
          maxHeight: "400px", // Set a fixed max height for better UI
          display: "flex",
          flexDirection: "column",
        },
      }}
      MenuListProps={{
        style: {
          padding: 0, // Remove default padding
          flexGrow: 1, // Allow content to grow and push footer to the bottom
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
          sx={{
            border: " 1px solid #ddd",
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

      {/* Favorites Section */}
      {favorites.length > 0 && (
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
            {favorites.map((filter) => (
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

      {/* All Filters Section */}
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
        {filters.map((filter) => (
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
              {filter.isFavorite ? (
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

// Only modify the Customer component to include the SelectionToolbar
const Customer = () => {
  // Existing state variables and functions
  const [customerList, setCustomerList] = useState(staticData);
  const [selectedType, setSelectedType] = useState("All Credit notes");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const router = useRouter();

  // Compute whether all rows are selected
  const allSelected =
    customerList.length > 0 && selected.length === customerList.length;
  // Compute whether some rows are selected but not all
  const someSelected = selected.length > 0 && !allSelected;

  const handleRowClick = (customer) => {
    router.push(`/sales/quotes/${customer.key}`);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(customerList.map((row) => row.key));
    }
  };

  // Handle individual row checkbox
  const handleSelectRow = (id, event) => {
    // Prevent row click event when clicking on the checkbox
    if (event) {
      event.stopPropagation();
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelected([]);
  };

  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const handleSelect = (type) => {
    setSelectedType(type);
    setAnchorEl(null);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    console.log("Selected menu item:", item);
    setMenuAnchorEl(null);
  };

  return (
    <Grid container>
      <Grid bgcolor="white" items md={12}>
        <WelcomePage />

        {/* {selected.length > 0 ? (
          // Show selection toolbar when items are selected
          <SelectionToolbar 
            selectedCount={selected.length} 
            onClearSelection={handleClearSelection}
          />
        ) : (
          // Show regular toolbar when no items are selected
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
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={
                <KeyboardArrowDownIcon color="primary" sx={{ fontWeight: 600 }} />
              }
              color="black"
              style={{
                fontWeight: 700,
                fontSize: "large",
                textTransform: "none",
              }}
            >
              {selectedType}
            </Button>
            <CustomFilterMenu
              anchorEl={anchorEl}
              handleClose={() => setAnchorEl(null)}
              favoritesData={favorites}
              filtersData={filters}
              onSelect={handleSelect}
              onFavoriteToggle={(filter) => {
                const updatedFilters = filters.map((f) =>
                  f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
                );
                setFilters(updatedFilters);

                const updatedFilter = updatedFilters.find((f) => f.id === filter.id);
                if (updatedFilter.isFavorite) {
                  setFavorites([...favorites, updatedFilter]);
                } else {
                  setFavorites(favorites.filter((f) => f.id !== filter.id));
                }
              }}
              selectedType={selectedType}
            />
            <Box>
              <Button
                variant="contained"
                className="button-submit"
                startIcon={<AddOutlined />}
                sx={{ mr: 1 }}
                onClick={() => router.push("/sales/creditNotes/new")}
              >
                New
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
                  style: {
                    width: "220px",
                    maxHeight: "400px",
                  },
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => handleMenuItemClick(item.text)}
                    sx={{
                      py: 1,
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "14px",
                        color: "#333",
                      }}
                    />
                    {item.text === "Sort by" && (
                      <KeyboardArrowDownIcon
                        color="primary"
                        sx={{ ml: 1, fontSize: "18px" }}
                      />
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
                  width: "31px",
                  fontWeight: 800,
                }}
              >
                ?
              </IconButton>
            </Box>
          </Toolbar>
        )}
        <Divider />
        {customerList.length > 0 ? (
          <CustomizedTable
            columns={columns}
            staticData={customerList}
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
            value="creditnote"
            someSelected={someSelected} // Pass this additional prop
          />
        ) : (
          <></>
        )} */}
      </Grid>
      <SearchModal
        open={openSearchDialog}
        onClose={handleCloseSearchDialog}
        onSearch={(searchData) => console.log("Search:", searchData)}
      />
    </Grid>
  );
};
export default Customer;
