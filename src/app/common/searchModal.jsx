"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const searchOptions = [
  "Customers",
  "Items",
  "Inventory Adjustments",
  "Banking",
  "Quotes",
  "Sales Orders",
  "Delivery Challans",
  "Invoices",
  "Payments Received",
  "Recurring Invoices",
  "Credit Notes",
  "Vendors",
  "Expenses",
  "Recurring Expenses",
  "Purchase Orders",
  "Bills",
  "Payments Made",
  "Recurring Bills",
  "Vendor Credits",
  "Projects",
  "Timesheet",
  "Journals",
  "Chart of Accounts",
  "Profit and Loss",
  "Balance Sheet",
  "Documents",
  "Tasks",
];
const filterOptions = [
  "Default Filters",
  "All Customers",
  "Active Customers",
  "CRM Customers",
  "Duplicate Customers",
  "Inactive Customers",
  "Customer Portal Enabled",
  "Customer Portal Disabled",
  "Overdue Customers",
  "Unpaid Customers",
];

const statusOptions = ["All", "Active", "Inactive"];
const customerTypeOptions = ["Business", "Individual"];

const customListboxProps = {
  sx: {
    // For Autocomplete options
    "& .MuiAutocomplete-option:hover": {
      backgroundColor: "#E7F3FF",
      color: "#4285F4",
    },
    "& .MuiAutocomplete-option[aria-selected='true']": {
      backgroundColor: "#4285F4",
      color: "#fff",
    },
    "& .MuiAutocomplete-option[aria-selected='true']:hover": {
      backgroundColor: "#4285F4",
      color: "#fff",
    },
  },
};

const customMenuProps = {
  PaperProps: {
    sx: {
      // For Select menu items
      "& .MuiMenuItem-root:hover": {
        backgroundColor: "#E7F3FF",
        color: "#4285F4",
      },
      "& .Mui-selected": {
        backgroundColor: "#4285F4",
        color: "#FFFFFF",
      },
      "& .Mui-selected:hover": {
        backgroundColor: "#4285F4",
        color: "#FFFFFF",
      },
    },
  },
};
const searchModal = ({ open, onClose, onSearch }) => {
  // “Search” & “Filter” as Autocomplete
  const [searchValue, setSearchValue] = useState(searchOptions[0]); // default
  const [filterValue, setFilterValue] = useState(filterOptions[1]); // e.g. “All Customers”

  // Left side fields
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("All"); // default
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Right side fields
  const [customerType, setCustomerType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  // Called when user clicks “Search” in the dialog
  const handleSearch = () => {
    const searchData = {
      searchValue,
      filterValue,
    };
    onSearch(searchData);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper" // allow scrolling while top row stays sticky
    >
      {/* STICKY HEADER: includes Search/Filter + close icon */}
      <DialogTitle
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 10,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side: “Search” & “Filter” Autocompletes */}
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Search Autocomplete */}
            <Box sx={{ width: 250 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Search
              </Typography>
              <Autocomplete
                size="small"
                value={searchValue}
                onChange={(event, newValue) => setSearchValue(newValue)}
                options={searchOptions}
                popupIcon={<KeyboardArrowDownIcon />}
                ListboxProps={customListboxProps} // apply blue hover style
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Filter Autocomplete */}
            <Box sx={{ width: 250 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Filter
              </Typography>
              <Autocomplete
                size="small"
                value={filterValue}
                onChange={(event, newValue) => setFilterValue(newValue)}
                options={filterOptions}
                popupIcon={<KeyboardArrowDownIcon />}
                ListboxProps={customListboxProps}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Filter"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Right side: “X” icon */}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* SCROLLABLE CONTENT: 2 columns for other fields */}
      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* LEFT COLUMN: 6 fields */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
          >
            <TextField
              label="Display Name"
              size="small"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <TextField
              label="Company Name"
              size="small"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <TextField
              label="Last Name"
              size="small"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            {/* Status: a Select with custom hover color */}
            <FormControl size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                MenuProps={customMenuProps} // same blue hover styling
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Address"
              size="small"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label="Notes"
              size="small"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>

          {/* RIGHT COLUMN: 5 fields */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
          >
            {/* Customer Type: a Select with “Business”, “Individual” */}
            <FormControl size="small">
              <InputLabel>Customer Type</InputLabel>
              <Select
                label="Customer Type"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                MenuProps={customMenuProps}
              >
                {customerTypeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="First Name"
              size="small"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Phone"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              label="PAN"
              size="small"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* FOOTER BUTTONS: “Search” (blue), “Cancel” (gray) */}
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default searchModal;
