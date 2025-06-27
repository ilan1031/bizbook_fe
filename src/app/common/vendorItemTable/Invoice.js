// pages/invoice.js

"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
  Popover,
  CircularProgress,
  Modal,
  InputLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import RemoveIcon from "@mui/icons-material/Remove";
import HelpIcon from "@mui/icons-material/Help";
import NewItemForm from "../newitem/page";
import TCSModal from "../tcsModal";
import config from "../../../services/config"

const Invoice = () => {
  // State for items table
  const [items, setItems] = useState([
    {
      id: 1,
      details: "",
      quantity: 1.0,
      rate: 0.0,
      tax: null,
      amount: 0.0,
      sku: "",
      itemName: "",
    },
  ]);

  // State for item selection
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // State for bulk add dialog
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedBulkItems, setSelectedBulkItems] = useState([]);
  const [bulkSearchQuery, setBulkSearchQuery] = useState("");
  const [bulkFilteredItems, setBulkFilteredItems] = useState([]);

  // State for dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // State for totals
  const [subtotal, setSubtotal] = useState(0);
  const [taxType, setTaxType] = useState("TDS");
  const [taxPercentage, setTaxPercentage] = useState(null);
  const [taxAmount, setTaxAmount] = useState(0);
  const [credit, setCredit] = useState(0);
  const [total, setTotal] = useState(0);

  //popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //TCS POPUP
  const [openTcs, setOpenTcs] = useState(false);
  const handleOpenTcs = () => setOpenTcs(true);
  const handleCloseTcs = () => setOpenTcs(false);

  const [taxPreference, setTaxPreference] = useState("one");
  const [lineItemTax, setLineItemTax] = useState("");

  // State for customer notes
  const [customerNotes, setCustomerNotes] = useState(
    "Looking forward for your business."
  );

  // TDS options
  const tdsOptions = [
    { label: "Commission or Brokerage", value: 2 },
    { label: "Commission or Brokerage (Reduced)", value: 3.75 },
    { label: "Dividend", value: 10 },
    { label: "Dividend (Reduced)", value: 7.5 },
    { label: "Other Interest than securities", value: 10 },
    { label: "Other Interest than securities (Reduced)", value: 7.5 },
    { label: "Payment of contractors for Others", value: 2 },
    { label: "Payment of contractors for Others (Reduced)", value: 1.5 },
    { label: "Payment of contractors HUF/Indiv", value: 1 },
    { label: "Payment of contractors HUF/Indiv (Reduced)", value: 0.75 },
    { label: "Professional Fees", value: 10 },
    { label: "Professional Fees (Reduced)", value: 7.5 },
    { label: "Rent on land or furniture etc", value: 10 },
    { label: "Rent on land or furniture etc (Reduced)", value: 7.5 },
    { label: "Technical Fees (2%)", value: 2 },
  ];

  const accountOptions = [
    { value: "sales", label: "Sales" },
    { value: "cost-of-goods-sold", label: "Cost of Goods Sold" },
    { value: "other-current-asset", label: "Other Current Asset" },
    { value: "advance-tax", label: "Advance Tax" },
    { value: "employee-advance", label: "Employee Advance" },
    { value: "input-tax-credits", label: "Input Tax Credits" },
    { value: "input-cgst", label: "Input CGST" },
    { value: "input-igst", label: "Input IGST" },
    { value: "input-sgst", label: "Input SGST" },
    { value: "prepaid-expenses", label: "Prepaid Expenses" },
    {
      value: "reverse-charge-tax",
      label: "Reverse Charge Tax Input but not due",
    },
    { value: "tcs-receivable", label: "TCS Receivable" },
    { value: "tds-receivable", label: "TDS Receivable" },
    { value: "fixed-asset", label: "Fixed Asset" },
    { value: "furniture-equipment", label: "Furniture and Equipment" },
    { value: "other-current-liability", label: "Other Current Liability" },
    { value: "employee-reimbursements", label: "Employee Reimbursements" },
    { value: "gst-payable", label: "GST Payable" },
    { value: "output-cgst", label: "Output CGST" },
    { value: "output-igst", label: "Output IGST" },
    { value: "output-sgst", label: "Output SGST" },
    {
      value: "opening-balance-adjustments",
      label: "Opening Balance Adjustments",
    },
    { value: "tax-payable", label: "Tax Payable" },
    { value: "tcs-payable", label: "TCS Payable" },
    { value: "tds-payable", label: "TDS Payable" },
    { value: "unearned-revenue", label: "Unearned Revenue" },
    { value: "income", label: "Income" },
    { value: "discount", label: "Discount" },
    { value: "general-income", label: "General Income" },
    { value: "interest-income", label: "Interest Income" },
    { value: "late-fee-income", label: "Late Fee Income" },
    { value: "other-charges", label: "Other Charges" },
    { value: "shipping-charge", label: "Shipping Charge" },
  ];

  const taxPreferenceOptions = [
    { value: "taxable", label: "Taxable" },
    { value: "non-taxable", label: "Non-Taxable" },
    { value: "out-of-scope", label: "Out of Scope" },
    { value: "non-gst-supply", label: "Non-GST Supply" },
  ];
  // References
  const inputRef = useRef(null);
  const bulkInputRef = useRef(null);

  const organization_id = localStorage.getItem("organization_id");

  // Fetch items from API - Only called when needed, not on mount
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.SO_Base_url}/api/v1/item/itemdetails?organization_id=${organization_id}`
      );
      console.log("API Response:", response.data);

      // Extract the "msg" array correctly
      const fetchedItems = response.data?.msg || [];

      // Update all states
      setAllItems(fetchedItems);
      setFilteredItems(fetchedItems);
      setBulkFilteredItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0);
    setSubtotal(itemsTotal);

    // Calculate tax amount if tax percentage is selected
    let taxAmt = 0;
    if (taxPercentage !== null) {
      taxAmt = (itemsTotal * taxPercentage) / 100;
    }
    setTaxAmount(taxAmt);

    // Calculate final total
    const creditValue = parseFloat(credit) || 0;
    setTotal(itemsTotal - taxAmt + creditValue);
  };

  // Filter items based on search query
  const handleSearchChange = (e, isBulk = false) => {
    const query = e.target.value;
    if (isBulk) {
      setBulkSearchQuery(query);
      setBulkFilteredItems(
        allItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            (item.sku && item.sku.toLowerCase().includes(query.toLowerCase()))
        )
      );
    } else {
      setSearchQuery(query);
      setFilteredItems(
        allItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            (item.sku && item.sku.toLowerCase().includes(query.toLowerCase()))
        )
      );
    }
  };

  // Open item dropdown - Fetch items ONLY when dropdown is opened
  const handleItemClick = async (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemIndex(index);
    setSearchQuery("");

    // Only fetch items when dropdown is opened
    await fetchItems();
  };

  // Close item dropdown
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedItemIndex(null);
    setSearchQuery("");
  };

  // Select item from dropdown
  const handleSelectItem = (item) => {
    if (selectedItemIndex !== null) {
      const updatedItems = [...items];
      updatedItems[selectedItemIndex] = {
        ...updatedItems[selectedItemIndex],
        details: item.name,
        rate: item.rate || 0,
        sku: item.sku || "",
        itemName: item.name,
        amount: updatedItems[selectedItemIndex].quantity * (item.rate || 0),
      };
      setItems(updatedItems);
      handleClosePopover();

      // Calculate totals after updating items
      setTimeout(() => calculateTotals(), 0);
    }
  };

  // Add new row
  const handleAddRow = () => {
    const newItem = {
      id: items.length + 1,
      details: "",
      quantity: 1.0,
      rate: 0.0,
      tax: null,
      amount: 0.0,
      sku: "",
      itemName: "",
    };
    setItems([...items, newItem]);
  };

  // Delete row
  const handleDeleteRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    // Calculate totals after deleting item
    setTimeout(() => calculateTotals(), 0);
  };

  // Handle quantity change
  const handleQuantityChange = (index, value) => {
    const updatedItems = [...items];
    const quantity = parseFloat(value) || 0;
    updatedItems[index].quantity = quantity;
    updatedItems[index].amount = quantity * updatedItems[index].rate;
    setItems(updatedItems);
  };

  // Handle rate change
  const handleRateChange = (index, value) => {
    const updatedItems = [...items];
    const rate = parseFloat(value) || 0;
    updatedItems[index].rate = rate;
    updatedItems[index].amount = updatedItems[index].quantity * rate;
    setItems(updatedItems);
  };

  // Open bulk add dialog
  const handleOpenBulkDialog = async () => {
    setBulkDialogOpen(true);
    setSelectedBulkItems([]);
    setBulkSearchQuery("");

    // Fetch items when bulk dialog is opened
    await fetchItems();
  };

  // Close bulk add dialog
  const handleCloseBulkDialog = () => {
    setBulkDialogOpen(false);
    setSelectedBulkItems([]);
  };

  // Toggle item selection in bulk dialog
  const toggleBulkItemSelection = (item) => {
    // Check if the item is already selected
    const existingItem = selectedBulkItems.find((i) => i.sku === item.sku);

    if (existingItem) {
      // If the item is already selected, remove it from the selected items
      setSelectedBulkItems(selectedBulkItems.filter((i) => i.sku !== item.sku));
    } else {
      // If the item is not selected, add it to the selected items with a default quantity of 1
      setSelectedBulkItems([...selectedBulkItems, { ...item, quantity: 1 }]);
    }
  };

  // Change quantity in bulk selection
  const handleBulkQuantityChange = (id, increment) => {
    const updatedItems = selectedBulkItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + increment);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setSelectedBulkItems(updatedItems);
  };

  // Remove item from bulk selection
  const handleRemoveBulkItem = (id) => {
    setSelectedBulkItems(selectedBulkItems.filter((item) => item.id !== id));
  };

  // Add bulk items to invoice
  const handleAddBulkItems = () => {
    if (selectedBulkItems.length === 0) return;

    const newItems = selectedBulkItems.map((item) => ({
      id: Date.now() + selectedBulkItems.indexOf(item), // Ensure unique IDs
      details: item.name,
      quantity: item.quantity,
      rate: item.rate || 0,
      tax: null,
      amount: item.quantity * (item.rate || 0),
      sku: item.sku || "",
      itemName: item.name,
    }));

    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    handleCloseBulkDialog();

    // Calculate totals after adding bulk items
    setTimeout(() => calculateTotals(), 0);
  };

  // Handle tax type change
  const handleTaxTypeChange = (event) => {
    setTaxType(event.target.value);
    setTaxPercentage(null);

    // Recalculate totals when tax type changes
    setTimeout(() => calculateTotals(), 0);
  };

  // Handle tax percentage change
  const handleTaxPercentageChange = (event) => {
    setTaxPercentage(parseFloat(event.target.value));

    // Recalculate totals when tax percentage changes
    setTimeout(() => calculateTotals(), 0);
  };

  // Handle credit change
  const handleCreditChange = (event) => {
    const value = Math.max(0, parseFloat(event.target.value) || 0);
    setCredit(value);

    // Recalculate totals when credit changes
    setTimeout(() => calculateTotals(), 0);
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, width: "50%" }}>
          {/* Primary Select */}
          <FormControl sx={{ width: "50%" }}>
            <Select
              size="small"
              name="taxPreference"
              value={taxPreference}
              onChange={(e) => setTaxPreference(e.target.value)}
              variant="outlined"
            >
              <MenuItem disabled>
                <em>Default</em>
              </MenuItem>
              <MenuItem value="one">At Transaction Level</MenuItem>
              <MenuItem value="two">At Line Item Level</MenuItem>
            </Select>
          </FormControl>

          {/* Conditional Second Select */}
          {taxPreference === "two" && (
            <FormControl sx={{ width: "50%" }}>
              <Select
                size="small"
                name="lineItemTax"
                value={lineItemTax}
                onChange={(e) => setLineItemTax(e.target.value)}
                variant="outlined"
                defaultValue="gst"
              >
                <MenuItem value="gst">Select Discount Accountant</MenuItem>
                <MenuItem value="vat">VAT</MenuItem>
                <MenuItem value="service_tax">Service Tax</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{ fontSize: "16px", fontWeight: "500", mb: 2 }}
        >
          Item Table
          <Button
            sx={{
              float: "right",
              textTransform: "none",
              borderRadius: "3px",
              color: "#3a86ff",
              backgroundColor: "rgba(58, 134, 255, 0.1)",
            }}
            startIcon={<AddIcon />}
          >
            Bulk Actions
          </Button>
        </Typography>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "none",
            mb: 2,
          }}
        >
          <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell
                  sx={{
                    width: "35%",
                    fontSize: "12px",
                    borderRight: "1px solid #E0E0E0",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                  }}
                >
                  ITEM DETAILS
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                  }}
                >
                  QUANTITY
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                  }}
                >
                  Account
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                  }}
                >
                  RATE{" "}
                  <InfoIcon
                    fontSize="small"
                    sx={{ ml: 0.5, fontSize: 14, color: "#3a86ff" }}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                  }}
                >
                  TAX{" "}
                  <InfoIcon
                    fontSize="small"
                    sx={{ ml: 0.5, fontSize: 14, color: "#3a86ff" }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    borderRight: "1px solid #E0E0E0",
                    py: 1.5,
                  }}
                >
                  Customer
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                  }}
                >
                  AMOUNT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: "40px",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id} sx={{ borderBottom: "1px solid #ddd" }}>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      py: 1.5,
                      borderRight: "1px solid #E0E0E0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={(e) => handleItemClick(e, index)}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          mr: 1,
                          width: "24px",
                          height: "24px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "4px",
                        }}
                      ></Box>
                      {item.details ? (
                        <Typography sx={{ fontSize: "14px" }}>
                          {item.details}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "#888", fontSize: "14px" }}>
                          Type or click to select an item.
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <TextField
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center", fontSize: "14px" },
                      }}
                      variant="outlined"
                      sx={{ width: "60px" }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <Select
                      name="salesAccount"
                      // value={values.salesAccount}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      // displayEmpty
                      // variant="outlined"
                      // disabled={!values.salesInfo}
                    >
                      <MenuItem value="sales">Sales</MenuItem>
                      {accountOptions
                        .filter((opt) => opt.value !== "sales")
                        .map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <TextField
                      value={item.rate}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center", fontSize: "14px" },
                      }}
                      variant="standard"
                      sx={{ width: "80px" }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <Select
                      value={item.tax || ""}
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].tax = e.target.value;
                        setItems(updatedItems);
                      }}
                      // displayEmpty
                      variant="standard"
                      sx={{ minWidth: 120, fontSize: "14px" }}
                      renderValue={(selected) =>
                        !selected ? "Select a Tax" : selected
                      }
                    >
                      <MenuItem value="">Select a Tax</MenuItem>
                      <MenuItem value="GST 5%">GST 5%</MenuItem>
                      <MenuItem value="GST 12%">GST 12%</MenuItem>
                      <MenuItem value="GST 18%">GST 18%</MenuItem>
                      <MenuItem value="GST 28%">GST 28%</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      py: 1.5,
                      borderRight: "1px solid #E0E0E0",
                    }}
                  >
                    <Select
                      name="taxPreference"
                      // value={values.taxPreference}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      // displayEmpty
                      // variant="outlined"
                    >
                      {taxPreferenceOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", fontSize: "14px", py: 1.5 }}
                  >
                    {item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1.5 }}>
                    <IconButton
                      size="small"
                      sx={{ color: "#888" }}
                      onClick={() => handleDeleteRow(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            sx={{
              borderRadius: "4px",
              fontSize: "13px",
              textTransform: "none",
              backgroundColor: "#f0f0f0",
              border: "none",
              color: "#444",
              px: 2,
              "&:hover": {
                backgroundColor: "#e0e0e0",
                border: "none",
              },
            }}
          >
            Add New Row
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenBulkDialog}
            sx={{
              borderRadius: "4px",
              fontSize: "13px",
              textTransform: "none",
              backgroundColor: "#f0f0f0",
              border: "none",
              color: "#444",
              px: 2,
              "&:hover": {
                backgroundColor: "#e0e0e0",
                border: "none",
              },
            }}
          >
            Add Items in Bulk
          </Button>
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "14px", fontWeight: "500", mb: 1 }}
            >
              Customer Notes
            </Typography>
            <TextField
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              sx={{
                fontSize: "14px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  fontSize: "14px",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              ml: 4,
              bgcolor: "#f9f9f9",
              p: 3,
              borderRadius: "4px",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography sx={{ fontSize: "14px" }}>Sub Total</Typography>
              <Typography sx={{ fontSize: "14px" }}>
                {subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <RadioGroup row value={taxType} onChange={handleTaxTypeChange}>
                <FormControlLabel
                  value="TDS"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#3a86ff",
                        "&.Mui-checked": { color: "#3a86ff" },
                      }}
                    />
                  }
                  label="TDS"
                  sx={{ mr: 3 }}
                />
                <FormControlLabel
                  value="TCS"
                  onClick={handleOpenTcs}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#3a86ff",
                        "&.Mui-checked": { color: "#3a86ff" },
                      }}
                    />
                  }
                  label="TCS"
                  sx={{ fontSize: "14px" }}
                />
                <Modal open={openTcs} onClose={handleCloseTcs}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "background.paper",
                      p: 4,
                      boxShadow: 24,
                      borderRadius: 2,
                      height: "800px",
                      overflowY: "scroll",
                    }}
                  >
                    <Button onClick={handleCloseTcs}>close</Button>
                    <TCSModal />
                  </Box>
                </Modal>
              </RadioGroup>
              <Select
                // fullWidth
                value={taxPercentage || ""}
                onChange={handleTaxPercentageChange}
                displayEmpty
                sx={{
                  mt: 1,
                  fontSize: "14px",
                  width: "50%",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ddd",
                  },
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return "Select a Tax";
                  }
                  const selectedOption = tdsOptions.find(
                    (option) => option.value === selected
                  );
                  return `${selectedOption?.label} [${selected}%]`;
                }}
              >
                <MenuItem value="" sx={{ fontSize: "14px" }}>
                  Select a Tax
                </MenuItem>
                {tdsOptions.map((option) => (
                  <MenuItem
                    key={option.label}
                    value={option.value}
                    sx={{ fontSize: "14px" }}
                  >
                    {option.label} [{option.value}%]
                  </MenuItem>
                ))}
              </Select>

              <Typography
                sx={{ fontSize: "14px", color: "red", marginLeft: "73px" }}
              >
                {" "}
                {taxAmount.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{
                  mr: 2,
                  fontSize: "14px",
                  border: "1px dashed #ddd ",
                  padding: "7px",
                  width: "30%",
                }}
              >
                credit
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={credit}
                onChange={handleCreditChange}
                inputProps={{
                  min: 0,
                  style: { fontSize: "14px", width: "50%" },
                }}
                sx={{
                  flex: 1,
                  width: "20%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ddd",
                    border: "1px dashed #ddd",
                    width: "50%",
                  },
                }}
              />
              <HelpIcon sx={{ ml: 2, color: "#3a86ff", fontSize: "18px" }} />
              <Typography sx={{ fontSize: "14px" }}>
                {credit > 0 ? credit : "0.00"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "16px", fontWeight: "800" }}
              >
                Total ( ₹ )
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "16px", fontWeight: "800" }}
              >
                {total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Item Selection Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: { width: "380px" },
          sx: { borderRadius: "4px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Type or click to select an item."
            fullWidth
            value={searchQuery}
            onChange={(e) => handleSearchChange(e)}
            autoFocus
            inputRef={inputRef}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "14px",
              },
            }}
          />
        </Box>
        <Divider />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} sx={{ color: "#3a86ff" }} />
          </Box>
        ) : (
          <List sx={{ maxHeight: "450px", overflowY: "auto" }}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <React.Fragment key={item.id || item.sku || `item-${idx}`}>
                  <ListItem
                    button
                    onClick={() => handleSelectItem(item)}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText
                      primary={item.name || "Unnamed Item"}
                      secondary={`SKU: ${item.sku || "-"} | Rate: ₹${
                        item.rate || "0"
                      }`}
                      primaryTypographyProps={{ fontSize: "14px" }}
                      secondaryTypographyProps={{ fontSize: "12px" }}
                    />
                  </ListItem>
                  <Divider />
                  {/* <Button >Add New Item</Button> */}
                </React.Fragment>
              ))
            ) : (
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  color: "gray",
                  fontSize: "14px",
                }}
              >
                No items found
              </Box>
            )}
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Button variant="contained" onClick={handleOpen}>
                Add New Item
              </Button>
            </Box>

            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  p: 4,
                  boxShadow: 24,
                  borderRadius: 2,
                  height: "800px",
                  overflowY: "scroll",
                }}
              >
                <Button onClick={handleClose}>close</Button>
                <NewItemForm />
              </Box>
            </Modal>
          </List>
        )}
      </Popover>

      {/* Bulk Add Dialog */}
      <Dialog
        open={bulkDialogOpen}
        onClose={handleCloseBulkDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "6px" },
        }}
      >
        <DialogTitle sx={{ fontSize: "16px", fontWeight: "500", pb: 1 }}>
          Add Items in Bulk
          <IconButton
            aria-label="close"
            onClick={handleCloseBulkDialog}
            sx={{ position: "absolute", right: 8, top: 8, color: "#888" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Left side - Item selection */}
            <Box sx={{ flex: 1 }}>
              <TextField
                placeholder="Type to search or scan the barcode of the item"
                fullWidth
                value={bulkSearchQuery}
                onChange={(e) => handleSearchChange(e, true)}
                inputRef={bulkInputRef}
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                }}
              />
              <List
                sx={{
                  maxHeight: "400px",
                  overflow: "auto",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                }}
              >
                {bulkFilteredItems.length > 0 ? (
                  bulkFilteredItems.map((item, index) => (
                    <React.Fragment
                      key={item.id || item.sku || `bulk-item-${index}`}
                    >
                      <ListItem
                        button
                        onClick={() => toggleBulkItemSelection(item)}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemIcon>
                          {selectedBulkItems.some(
                            (i) => i.sku === item.sku
                          ) && <CheckCircleIcon sx={{ color: "#4caf50" }} />}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name || "Unnamed Item"}
                          secondary={`SKU: ${item.sku || "-"} | Rate: ₹${
                            item.rate || "0"
                          }`}
                          primaryTypographyProps={{ fontSize: "14px" }}
                          secondaryTypographyProps={{ fontSize: "12px" }}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      color: "gray",
                      fontSize: "14px",
                    }}
                  >
                    No items available
                  </Box>
                )}
              </List>
            </Box>

            {/* Right side - Selected items */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: "15px", fontWeight: "500" }}
                >
                  Selected Items{" "}
                  <span
                    style={{
                      backgroundColor: "#e0e0e0",
                      borderRadius: "50%",
                      padding: "2px 8px",
                      fontSize: "14px",
                    }}
                  >
                    {selectedBulkItems.length}
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "14px", color: "#555" }}
                >
                  Total Quantity:{" "}
                  {selectedBulkItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </Typography>
              </Box>
              <List sx={{ maxHeight: "400px", overflow: "auto" }}>
                {selectedBulkItems.map((item, index) => (
                  <ListItem
                    key={item.id || item.sku || `selected-item-${index}`}
                    sx={{
                      mb: 1,
                      bgcolor: "#f5f5f5",
                      borderRadius: "4px",
                      py: 1,
                    }}
                  >
                    <ListItemText
                      primary={`[${item.sku || "-"}] ${item.name}`}
                      primaryTypographyProps={{ fontSize: "14px" }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleBulkQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                        sx={{ color: "#666" }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 1, fontSize: "14px" }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleBulkQuantityChange(item.id, 1)}
                        sx={{ color: "#666" }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveBulkItem(item.id)}
                        sx={{ ml: 1 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseBulkDialog}
            sx={{ textTransform: "none", fontSize: "14px", color: "#555" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddBulkItems}
            disabled={selectedBulkItems.length === 0}
            sx={{
              bgcolor: "#ff9800",
              "&:hover": { bgcolor: "#f57c00" },
              textTransform: "none",
              fontSize: "14px",
              borderRadius: "4px",
            }}
          >
            Add Items
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoice;
