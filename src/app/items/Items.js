"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  ListSubheader,
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
  InputAdornment,
  Select,
  Popover,
  CircularProgress,
  Popper,
  Modal,
  TextareaAutosize,
  Menu,
  ClickAwayListener,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import RemoveIcon from "@mui/icons-material/Remove";
import HelpIcon from "@mui/icons-material/Help";
import NewItemForm from "../common/newitem/page";
import TCSModal from "../common/tcsModal";
import apiService from "../../services/axiosService";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Grid } from "lucide-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const Items = ({ formik }) => {
  const theme = useTheme();

  // States only for UI control, not duplicating formik data
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("%");
  const [symbolAnchorEl, setSymbolAnchorEl] = useState(null);
  const [isChallan, setIsChallan] = useState(false);

  // States for item selection only (not duplicating form data)
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // States for bulk add dialog only
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedBulkItems, setSelectedBulkItems] = useState([]);
  const [bulkSearchQuery, setBulkSearchQuery] = useState("");
  const [bulkFilteredItems, setBulkFilteredItems] = useState([]);

  // UI-only modal states
  const [open, setOpen] = useState(false);
  const [openTcs, setOpenTcs] = useState(false);
  const [isTcsPopoverOpen, setIsTcsPopoverOpen] = useState(false);
  const [tcsPopoverAnchorEl, setTcsPopoverAnchorEl] = useState(null);
  // References for UI interaction
  const inputRef = useRef(null);
  const bulkInputRef = useRef(null);

  // Open/close handlers for modals (UI only)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenTcs = () => setOpenTcs(true);
  const handleCloseTcs = () => setOpenTcs(false);

  const handleManageTaxClick = (event) => {
    event.stopPropagation(); // Prevent the Select from opening/closing
    setOpenTaxModal(true);
  };

  const handleTdsOptionChange = (event) => {
    const selectedId = event.target.value;
    const selected = tdsOptions.find((opt) => opt.id === selectedId);

    if (selected) {
      // Set the full TDS option details
      formik.setFieldValue("tds_option", selected.name);
      formik.setFieldValue("tax_percentage", selected.rate);

      // Calculate totals to update tax and final amount
      calculateTotals();
    }
  };

  const handleTaxMethodChange = (event) => {
    const method = event.target.value;
    formik.setFieldValue("tax_type", method);
    formik.setFieldValue("tax_percentage", "");
    formik.setFieldValue("tds_option", "");
    calculateTotals();
  };
  // Calculate totals whenever items, tax, or credit changes
  useEffect(() => {
    calculateTotals();
  }, [formik.values.items, formik.values.commission, formik.values.adjustment]);

  // TDS options

  const tdsOptions = [
    {
      id: "commission_brokerage",
      name: "Commission or Brokerage",
      rate: 2,
      section: "Section 194 H",
    },
    {
      id: "commission_brokerage_reduced",
      name: "Commission or Brokerage (Reduced)",
      rate: 3.75,
      section: "Section 194 H",
    },
    { id: "dividend", name: "Dividend", rate: 10, section: "Section 194" },
    {
      id: "dividend_reduced",
      name: "Dividend (Reduced)",
      rate: 7.5,
      section: "Section 194",
    },
    {
      id: "interest",
      name: "Other Interest than securities",
      rate: 10,
      section: "Section 194 A",
    },
    {
      id: "interest_reduced",
      name: "Other Interest than securities (Reduced)",
      rate: 7.5,
      section: "Section 194 A",
    },
    {
      id: "contractor_others",
      name: "Payment of contractors for Others",
      rate: 2,
      section: "Section 194 C",
    },
    {
      id: "contractor_others_reduced",
      name: "Payment of contractors for Others (Reduced)",
      rate: 1.5,
      section: "Section 194 C",
    },
    {
      id: "contractor_individual",
      name: "Payment of contractors HUF/Indiv",
      rate: 1,
      section: "Section 194 C",
    },
    {
      id: "contractor_individual_reduced",
      name: "Payment of contractors HUF/Indiv (Reduced)",
      rate: 0.75,
      section: "Section 194 C",
    },
    {
      id: "professional",
      name: "Professional Fees",
      rate: 10,
      section: "Section 194 J",
    },
    {
      id: "professional_reduced",
      name: "Professional Fees (Reduced)",
      rate: 7.5,
      section: "Section 194 J",
    },
    {
      id: "rent",
      name: "Rent on land or furniture etc",
      rate: 10,
      section: "Section 194 I",
    },
    {
      id: "rent_reduced",
      name: "Rent on land or furniture etc (Reduced)",
      rate: 7.5,
      section: "Section 194 I",
    },
    {
      id: "technical",
      name: "Technical Fees",
      rate: 2,
      section: "Section 194 C",
    },
  ];
  // const tcsOptions = [
  //   { id: 'sample', name: 'sample', rate: 20, nature: '206C(6CA)' }
  // ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    return tdsOptions.filter((option) =>
      option.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tdsOptions]);
  const handleDiscountChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("discount_percent", value);
    calculateTotals();
  };

  const organization_id = localStorage.getItem("organization_id");

  const fetchItems = async () => {
    // Only fetch if we don't already have items
    if (allItems.length > 0) return;

    setLoading(true);
    try {
      if (!organization_id) {
        console.error("Organization ID not found in local storage");
        return;
      }

      const response = await apiService({
        method: "GET",
        url: `/api/v1/item/item/details?organization_id=${organization_id}`,
      });

      // Extract the items correctly based on your API response structure
      const fetchedItems = response.data?.message || [];

      // Make sure each item has an id property if it's missing
      const itemsWithIds = fetchedItems.map((item) => ({
        ...item,
        id:
          item.id ||
          `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      // Update UI states for dropdown
      setAllItems(itemsWithIds);
      setFilteredItems(itemsWithIds);
      setBulkFilteredItems(itemsWithIds);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const [expenseAccOpen, setExpenseAccOpen] = useState(false);
  const [expenseAccAnchorEl, setExpenseAccAnchorEl] = useState(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState(null);
  const [expenseAccSearchTerm, setExpenseAccSearchTerm] = useState("");
  const [expenseAccCategories, setExpenseAccCategories] = useState([]);

  // Fetch COA List on organization change
  useEffect(() => {
    const fetchCOAList = async () => {
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/COA/get-coa-list?org_id=${organization_id}`,
        });

        if (response.statusCode === 200) {
          console.log("Fetched COA list", response.data.data);
          setExpenseAccCategories(response.data.data);
        } else {
          console.warn("Unexpected response status:", response.statusCode);
        }
      } catch (error) {
        console.error("Error fetching COA list:", error);
      }
    };

    if (organization_id) {
      fetchCOAList();
    }
  }, [organization_id, apiService]);

  // Filtered expense accounts based on search term
  const filteredExpenseAccOptions = expenseAccCategories
    .map((group) => ({
      category: group._id,
      options: group.accounts.filter((acc) =>
        acc.account_name
          .toLowerCase()
          .includes(expenseAccSearchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.options.length > 0);

  // Handle dropdown open for specific row
  const handleExpenseAccClick = (event, index) => {
    setExpenseAccOpen(true);
    setExpenseAccAnchorEl(event.currentTarget);
    setSelectedLineIndex(index);
    setExpenseAccSearchTerm(""); // Clear search term when opening
  };

  // Handle search input inside dropdown
  const handleExpenseAccSearch = (e) => {
    setExpenseAccSearchTerm(e.target.value);
  };

  // Close the dropdown
  const handleExpenseAccClose = () => {
    setExpenseAccOpen(false);
    setExpenseAccAnchorEl(null);
    setSelectedLineIndex(null);
    setExpenseAccSearchTerm(""); // Reset search
  };

  // Handle account selection - FIXED VERSION
  const handleExpenseAccSelect = (option) => {
    console.log("Selected option:", option); // Debug log
    console.log("Selected line index:", selectedLineIndex); // Debug log

    if (selectedLineIndex === null) {
      console.warn("No line index selected");
      return;
    }

    // Create a deep copy of the current items
    const currentLineItems = formik.values.items || [];
    const updateditems = [...currentLineItems];

    // Ensure the line item exists at the selected index
    if (!updateditems[selectedLineIndex]) {
      updateditems[selectedLineIndex] = {};
    }

    // Update the specific line item
    updateditems[selectedLineIndex] = {
      ...updateditems[selectedLineIndex],
      account_name: option.account_name,
      account_id: option.account_id,
    };

    console.log("Updated line items:", updateditems); // Debug log

    // Update formik values
    formik.setFieldValue("items", updateditems);

    // Force formik to trigger validation and update
    formik.setFieldTouched(`items.${selectedLineIndex}.account_name`, true);

    // Close the dropdown
    handleExpenseAccClose();
  };
  /**
   * Calculate totals and update formik
   */
  const calculateTotals = () => {
    const items = formik.values.items || [];

    // Sum of item amounts
    const subtotal = items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    formik.setFieldValue("sub_total", subtotal);

    // Apply discount
    const discountPercent = parseFloat(formik.values.discount_percent) || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    formik.setFieldValue("discount_amount", discountAmount);

    // Calculate taxable amount after discount
    let taxableAmount = subtotal - discountAmount;

    // Apply TDS or TCS
    const taxType = formik.values.tax_type;
    const taxPercentage = parseFloat(formik.values.tax_percentage) || 0;
    console.log(formik.values.tax_percentage, "pre%");
    const taxAmount = (taxableAmount * taxPercentage) / 100;

    // Set tax amount and format it
    formik.setFieldValue("taxAmount", taxAmount);
    // console.log(taxAmount,"taxAmounttaxAmounttaxAmountformattedd")
    formik.setFieldValue("tax_total_formatted", taxAmount.toFixed(2));

    // Adjust taxable amount based on tax type
    if (taxType === "TDS") {
      taxableAmount -= taxAmount; // TDS: deduct
    } else if (taxType === "TCS") {
      taxableAmount += taxAmount; // TCS: add
    }

    // Apply adjustment
    const adjustment = parseFloat(formik.values.adjustment) || 0;
    const finalTotal = taxableAmount + adjustment;

    // Set final total
    formik.setFieldValue("total", finalTotal);
    formik.setFieldValue("total_amount", finalTotal); // For compatibility
  };

  const handleSymbolMenuClose = () => {
    setSymbolAnchorEl(null);
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    handleSymbolMenuClose();
  };
  const handleSymbolMenuOpen = (event) => {
    setSymbolAnchorEl(event.currentTarget);
  };

  const calculateDiscount = () => {
    const subtotal = parseFloat(formik.values.sub_total) || 0;
    const discountValue = parseFloat(formik.values.discount_percent) || 0;
    const discountAmount = (subtotal * discountValue) / 100;
    return `${discountAmount.toFixed(2)}`;
  };
  const handleSearchChange = (e, isBulk = false) => {
    const query = e.target.value;
    if (isBulk) {
      setBulkSearchQuery(query);
      setBulkFilteredItems(
        allItems.filter(
          (item) =>
            (item.name &&
              item.name.toLowerCase().includes(query.toLowerCase())) ||
            (item.sku && item.sku.toLowerCase().includes(query.toLowerCase()))
        )
      );
    } else {
      setSearchQuery(query);
      setFilteredItems(
        allItems.filter(
          (item) =>
            (item.name &&
              item.name.toLowerCase().includes(query.toLowerCase())) ||
            (item.sku && item.sku.toLowerCase().includes(query.toLowerCase()))
        )
      );
    }
  };

  const handleItemClick = async (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemIndex(index);
    setSearchQuery("");

    // Only fetch items when dropdown is opened
    await fetchItems();
  };

  /* Close item dropdown*/
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedItemIndex(null);
    setSearchQuery("");
  };

  /* Select item from dropdown and update formik*/
  const handleSelectItem = (item) => {
    if (selectedItemIndex !== null) {
      // Get current items from formik
      const currentItems = [...formik.values.items];
      const quantity =
        parseFloat(currentItems[selectedItemIndex].quantity) || 1;
      const rate = parseFloat(item.rate) || 0;

      // Update the specific item
      currentItems[selectedItemIndex] = {
        ...currentItems[selectedItemIndex],
        details: item.name,
        rate: rate,
        sku: item.sku || "",
        item_name: item.name,
        amount: quantity * rate,
      };

      // Update formik with the new items array
      formik.setFieldValue("items", currentItems);
      handleClosePopover();
    }
  };

  //  Add new row to formik items
  const handleAddRow = () => {
    const newItem = {
      id: Date.now(),
      details: "",
      quantity: 1.0,
      rate: 0.0,
      tax: null,
      amount: 0.0,
      sku: "",
      item_name: "",
    };
    // Update formik directly with the new item added
    formik.setFieldValue("items", [...formik.values.items, newItem]);
  };

  const handleDeleteRow = (index) => {
    const updatedItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", updatedItems);
  };

  /**
   * Handle quantity change and update formik
   * @param {number} index - Index of the item
   * @param {string|number} value - New quantity value
   */
  const handleQuantityChange = (index, value) => {
    const updatedItems = [...formik.values.items];
    const quantity = parseFloat(value) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;

    updatedItems[index].quantity = quantity;
    updatedItems[index].amount = quantity * rate;

    // Update formik directly
    formik.setFieldValue("items", updatedItems);
  };

  /**
   * Handle rate change and update formik
   * @param {number} index - Index of the item
   * @param {string|number} value - New rate value
   */
  const handleRateChange = (index, value) => {
    const updatedItems = [...formik.values.items];
    const rate = parseFloat(value) || 0;
    const quantity = parseFloat(updatedItems[index].quantity) || 0;

    updatedItems[index].rate = rate;
    updatedItems[index].amount = quantity * rate;

    // Update formik directly
    formik.setFieldValue("items", updatedItems);
  };

  /**
   * Open bulk add dialog and fetch items if needed
   */
  const handleOpenBulkDialog = async () => {
    setBulkDialogOpen(true);
    setSelectedBulkItems([]);
    setBulkSearchQuery("");

    // Fetch items when bulk dialog is opened
    await fetchItems();
  };

  /**
   * Close bulk add dialog
   */
  const handleCloseBulkDialog = () => {
    setBulkDialogOpen(false);
    setSelectedBulkItems([]);
  };

  /**
   * Toggle item selection in bulk dialog
   * @param {Object} item - Item to toggle
   */
  const toggleBulkItemSelection = (item) => {
    // Use ID for item identification instead of SKU
    const existingItem = selectedBulkItems.find((i) => i.id === item.id);

    if (existingItem) {
      setSelectedBulkItems(selectedBulkItems.filter((i) => i.id !== item.id));
    } else {
      // Create a new object with unique id for this selection instance
      const newSelectedItem = {
        ...item,
        quantity: 1,
        selected_id: `selected-${item.id}-${Date.now()}`,
      };
      setSelectedBulkItems([...selectedBulkItems, newSelectedItem]);
    }
  };

  /**
   * Change quantity for a specific selected bulk item
   * @param {string} selected_id - Unique identifier for the selected item
   * @param {number} increment - Amount to increment (positive or negative)
   */
  const handleBulkQuantityChange = (selected_id, increment) => {
    const updatedItems = selectedBulkItems.map((item) => {
      if (item.selected_id === selected_id) {
        const newQuantity = Math.max(1, item.quantity + increment);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setSelectedBulkItems(updatedItems);
  };

  /**
   * Remove item from bulk selection
   * @param {string} selected_id - Unique identifier for the selected item
   */
  const handleRemoveBulkItem = (selected_id) => {
    setSelectedBulkItems(
      selectedBulkItems.filter((item) => item.selected_id !== selected_id)
    );
  };

  /**
   * Add bulk items to formik
   */
  const handleAddBulkItems = () => {
    if (selectedBulkItems.length === 0) return;

    const newItems = selectedBulkItems.map((item) => ({
      id: Date.now() + Math.random(), // Ensure unique IDs
      details: item.name,
      quantity: item.quantity,
      rate: item.rate || 0,
      tax: null,
      amount: item.quantity * (item.rate || 0),
      sku: item.sku || "",
      item_name: item.name,
    }));

    // Update formik with the combined items
    formik.setFieldValue("items", [...formik.values.items, ...newItems]);
    handleCloseBulkDialog();
  };

  // Return the component JSX with formik integration
  return (
    <Box sx={{}}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: "none",
            mb: 2,
          }}
        >
          <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell
                  colSpan={4}
                  sx={{
                    width: "45%",
                    fontSize: "14px !important",
                    fontWeight: "700",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    borderRight: "none",
                    py: 1.5,
                  }}
                >
                  Item Table
                </TableCell>
                <TableCell
                  align="right"
                  colSpan={2}
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                    borderBottom: "1px solid #ddd",
                    borderLeft: "none",
                    py: 1.5,
                    width: "150px",
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "#3a86ff",
                    }}
                    // onClick={handleOpenBulkDialog}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: "18px", mr: 1 }} />
                    <Typography
                      sx={{
                        textTransform: "none",
                        fontWeight: 400,
                        fontSize: "13px",
                      }}
                    >
                      Bulk Actions
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell
                  sx={{
                    width: "35%",
                    fontSize: "12px !important",
                    borderRight: "1px solid #E0E0E0",
                    fontWeight: "bold",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    bgcolor: "white !important",
                    py: 1.5,
                  }}
                >
                  ITEM DETAILS
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "12px !important",
                    fontWeight: "bold",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                    bgcolor: "white !important",
                  }}
                >
                  ACCOUNT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                    fontSize: "12px !important",
                    fontWeight: "bold",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                    bgcolor: "white !important",
                  }}
                >
                  QUANTITY
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                    fontSize: "12px !important",
                    fontWeight: "bold",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                    bgcolor: "white !important",
                  }}
                >
                  RATE
                </TableCell>
                {/* <TableCell
                  align="center"
                  sx={{
                    fontSize: "12px !important",
                    fontWeight: "bold",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                    bgcolor: "white !important",
                  }}
                >
                  TAX
                </TableCell> */}
                <TableCell
                  align="right"
                  sx={{
                    fontSize: "12px !important",
                    fontWeight: "bold",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    bgcolor: "white !important",
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
                    bgcolor: "white !important",
                    py: 1.5,
                  }}
                ></TableCell>
              </TableRow>
              {formik.values.items.map((item, index) => (
                <TableRow
                  key={item.id || `item-${index}`}
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  {/* ITEM COLUMN */}
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
                      data-testid={`item-select-${index}`}
                    >
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

                  {/* EXPENSE ACCOUNT COLUMN */}
                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <Box sx={{ position: "relative", width: "200px" }}>
                      <Box
                        onClick={(e) => handleExpenseAccClick(e, index)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "35px",
                          width: "200px",
                          justifyContent: "space-between",
                          border:
                            formik.touched.items?.[index]?.account_name &&
                            Boolean(
                              formik.errors.items?.[index]?.account_name
                            )
                              ? "1px solid #d32f2f"
                              : "1px solid #c4c4c4",
                          borderRadius: "7px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          backgroundColor: "white",
                          color: "gray",
                          "&:hover": { borderColor: "#408dfb" },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: formik.values.items?.[index]
                              ?.account_name
                              ? "#333" // Changed from "gray" to darker color for better visibility
                              : "#aaa",
                            textAlign: "left",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formik.values.items?.[index]?.account_name ||
                            "Select expense account"}
                        </Typography>
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: "22px",
                            marginRight: "-10px",
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Popper for dropdown - Only show for the selected row */}
                  {selectedLineIndex === index && (
                    <Popper
                      open={expenseAccOpen}
                      anchorEl={expenseAccAnchorEl}
                      placement="bottom-start"
                      style={{ width: "350px", zIndex: 1300 }} // Increased z-index
                      modifiers={[
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "viewport",
                          },
                        },
                      ]}
                    >
                      <ClickAwayListener onClickAway={handleExpenseAccClose}>
                        <Paper
                          sx={{
                            maxHeight: 300,
                            overflow: "auto",
                            boxShadow: 3,
                          }}
                        >
                          <Box>
                            <TextField
                              placeholder="Search account..."
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoFocus // Add autofocus for better UX
                              onClick={(e) => e.stopPropagation()}
                              value={expenseAccSearchTerm}
                              onChange={handleExpenseAccSearch}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon
                                      sx={{
                                        fontSize: "16px",
                                        color: "#757575",
                                      }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  minHeight: "30px",
                                  "& input": {
                                    padding: "4px 8px",
                                    fontSize: "13px",
                                  },
                                  "& fieldset": { borderColor: "#e0e0e0" },
                                  "&:hover fieldset": {
                                    borderColor: "#408dfb",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#408dfb",
                                  },
                                },
                              }}
                            />

                            {filteredExpenseAccOptions.length === 0 ? (
                              <Box
                                sx={{
                                  p: 2,
                                  textAlign: "center",
                                  color: "#666",
                                }}
                              >
                                No options found
                              </Box>
                            ) : (
                              filteredExpenseAccOptions.map(
                                (group, groupIndex) => (
                                  <Box
                                    key={`${group.category}-${groupIndex}`}
                                    sx={{ mb: 1 }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        p: 1,
                                        backgroundColor:
                                          COLORS?.bgLight || "#f5f5f5",
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                      }}
                                    >
                                      {group.category}
                                    </Typography>
                                    {group.options.map(
                                      (option, optionIndex) => (
                                        <MenuItem
                                          key={`${option.account_id}-${optionIndex}`}
                                          onClick={() =>
                                            handleExpenseAccSelect(option)
                                          }
                                          sx={{
                                            fontSize: "13px",
                                            color: "#66686b",
                                            py: 1,
                                            px: 2,
                                            "&:hover": {
                                              borderRadius: "5px",
                                              backgroundColor:
                                                theme?.palette?.hover
                                                  ?.background || "#f5f5f5",
                                              color:
                                                theme?.palette?.hover?.text ||
                                                "#000",
                                            },
                                            maxWidth: "380px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {option.account_name}
                                        </MenuItem>
                                      )
                                    )}
                                  </Box>
                                )
                              )
                            )}
                          </Box>
                        </Paper>
                      </ClickAwayListener>
                    </Popper>
                  )}

                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <TextField
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        // Using both formik's handleChange and our custom handler
                        formik.handleChange(e);
                        handleQuantityChange(index, e.target.value);
                      }}
                      name={`items[${index}].quantity`}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center", fontSize: "14px" },
                        "data-testid": `quantity-input-${index}`,
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                          fontSize: "12px",
                          border: "none", // Removes the border
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Removes the outline border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Prevents border on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Prevents border on focus
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <TextField
                      size="small"
                      value={item.rate}
                      onChange={(e) => {
                        // Using both formik's handleChange and our custom handler
                        formik.handleChange(e);
                        handleRateChange(index, e.target.value);
                      }}
                      name={`items[${index}].rate`}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center", fontSize: "14px" },
                        "data-testid": `rate-input-${index}`,
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                          fontSize: "12px",
                          border: "none", // Removes the border
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Removes the outline border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Prevents border on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Prevents border on focus
                        },
                      }}
                    />
                  </TableCell>
                  {/* <TableCell
                    align="center"
                    sx={{
                      py: 1.5,
                      borderRight: "1px solid #E0E0E0",
                    }}
                  >
                    <Select
                      size="small"
                      value={item.tax || ""}
                      onChange={(e) => {
                        formik.handleChange(e);
                        // Also update our local copy
                        const updatedItems = [...formik.values.items];
                        updatedItems[index].tax = e.target.value;
                        formik.setFieldValue("items", updatedItems);
                      }}
                      name={`items[${index}].tax`}
                      variant="outlined"
                      inputProps={{
                        "data-testid": `tax-select-${index}`,
                      }}
                      sx={{
                        minWidth: "120px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                          border: "none",
                        },
                        "& .MuiSelect-select": {
                          fontSize: "13px", // Ensure text inside select is 12px
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Removes the outline border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Prevents border on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Prevents border on focus
                        },
                      }}
                      renderValue={(selected) =>
                        !selected ? "Select a Tax" : selected
                      }
                    >
                      <MenuItem
                        sx={{ fontSize: "14px", fontWeight: "400" }}
                        value=""
                      >
                        Select a Tax
                      </MenuItem>
                      <MenuItem
                        sx={{ fontSize: "14px", fontWeight: "400" }}
                        value="GST 5%"
                      >
                        GST 5%
                      </MenuItem>
                      <MenuItem
                        sx={{ fontSize: "14px", fontWeight: "400" }}
                        value="GST 12%"
                      >
                        GST 12%
                      </MenuItem>
                      <MenuItem
                        sx={{ fontSize: "14px", fontWeight: "400" }}
                        value="GST 18%"
                      >
                        GST 18%
                      </MenuItem>
                      <MenuItem
                        sx={{ fontSize: "14px", fontWeight: "400" }}
                        value="GST 28%"
                      >
                        GST 28%
                      </MenuItem>
                    </Select>
                  </TableCell> */}
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", fontSize: "14px", py: 1.5 }}
                    data-testid={`amount-value-${index}`}
                  >
                    {parseFloat(item.amount).toFixed(2)}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1.5 }}>
                    <IconButton
                      size="small"
                      sx={{ color: "#888" }}
                      onClick={() => handleDeleteRow(index)}
                      data-testid={`delete-item-${index}`}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <Box sx={{ display: "flex", justifyContent: "space-between", gap: 15 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 4, height: "40px" }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              data-testid="add-row-button"
              sx={{
                borderRadius: "6px",
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
              data-testid="add-bulk-button"
              sx={{
                borderRadius: "6px",
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
            <Box>
              <Typography variant="subtitle2">Customer Notes</Typography>
              <TextareaAutosize
                name="notes"
                id="notes"
                minRows={6}
                placeholder="Customer Notes mail content"
              />
            </Box>

          <Box
            sx={{
              flex: 1,
              ml: 4,
              bgcolor: "#f9f9f9",
              p: 3,
              borderRadius: "6px",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                Sub Total
              </Typography>
              <Typography
                sx={{ fontSize: "14px" }}
                data-testid="subtotal-value"
              >
                {formik.values.subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <RadioGroup
                  row
                  value={formik.values.tdsOrTcs}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Reset tax percentage when changing tax type
                    formik.setFieldValue("commission", null);
                  }}
                  name="tdsOrTcs"
                >
                  <FormControlLabel
                    value="TDS"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#3a86ff",
                          "&.Mui-checked": { color: "#3a86ff" },
                        }}
                        data-testid="tds-radio"
                      />
                    }
                    label={
                      <span style={{ fontSize: "14px", fontWeight: "400" }}>
                        TDS
                      </span>
                    }
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
                        data-testid="tcs-radio"
                      />
                    }
                    label={
                      <span style={{ fontSize: "14px", fontWeight: "400" }}>
                        TCS
                      </span>
                    }
                    sx={{ fontSize: "14px" }}
                  />
                </RadioGroup>
                <Select
                  value={formik.values.commission || ""}
                  onChange={formik.handleChange}
                  name="commission"
                  displayEmpty
                  data-testid="tax-category-select"
                  sx={{
                    ml: 2,
                    fontSize: "14px",
                    height: "36px",
                    fontWeight: "400",
                    width: "200px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      fontWeight: "400",
                    },
                    "& .MuiSelect-select": {
                      fontSize: "14px",
                      fontWeight: "400",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ddd",
                    },
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      <span style={{ fontSize: "14px", fontWeight: "400" }}>
                        Select a Tax
                      </span>;
                    }
                    const selectedOption = tdsOptions.find(
                      (option) => option.value === parseFloat(selected)
                    );
                    return (
                      <span style={{ fontSize: "14px", fontWeight: "400" }}>
                        {selectedOption?.label} [{selected}%]
                      </span>
                    );
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontSize: "14px", fontWeight: "400" }}
                  >
                    Select a Tax
                  </MenuItem>
                  {tdsOptions.map((option) => (
                    <MenuItem
                      key={option.label}
                      value={option.value.toString()}
                      sx={{ fontSize: "14px", fontWeight: "400" }}
                    >
                      {option.label} [{option.value}%]
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Typography
                sx={{ fontSize: "14px", color: "red" }}
                data-testid="tax-amount"
              >
                - {formik.values.taxAmount.toFixed(2)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    mr: 2,
                    fontSize: "14px",
                    border: "1px dashed #ddd",
                    padding: "7px",
                    width: "60px",
                    height: "36px",
                  }}
                >
                  credit
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  value={formik.values.adjustment}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Ensure non-negative value
                    const value = Math.max(0, parseFloat(e.target.value) || 0);
                    formik.setFieldValue("adjustment", value);
                  }}
                  name="adjustment"
                  inputProps={{
                    min: 0,
                    style: { fontSize: "14px" },
                    "data-testid": "adjustment-input",
                  }}
                  sx={{
                    width: "120px",
                    height: "36px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ddd",
                      border: "1px dashed #ddd",
                    },
                  }}
                />
                <HelpIcon sx={{ ml: 2, color: "#3a86ff", fontSize: "18px" }} />
              </Box>
              <Typography
                sx={{ fontSize: "14px" }}
                data-testid="adjustment-value"
              >
                {formik.values.adjustment > 0
                  ? formik.values.adjustment.toFixed(2)
                  : "0.00"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "16px", fontWeight: "600" }}
              >
                Total ( ₹ )
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "16px", fontWeight: "600" }}
                data-testid="total-value"
              >
                {formik.values.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box> */}

        {/*Customer Notes*/}

        {/* <Box sx={{ display: "flex" }}>
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
              value={formik.values.notes}
              onChange={formik.handleChange}
              name="notes"
              data-testid="customer-notes"
              sx={{
                fontSize: "14px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  fontSize: "14px",
                },
              }}
            />
          </Box>
        </Box> */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Main content with top row and split layout */}
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Left side with buttons and customer notes */}
            <Box
              sx={{
                flex: "0 0 auto",
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Top action buttons */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                  data-testid="add-row-button"
                  sx={{
                    borderRadius: "6px",
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
                  data-testid="add-bulk-button"
                  sx={{
                    borderRadius: "6px",
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
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {/* Customer Notes section */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      mb: 1,
                    }}
                  >
                    Customer Notes
                  </Typography>
                  <TextField
                    multiline
                    fullWidth
                    minRows={2} // Reduced from 5 to 3
                    maxRows={3} // Reduced from 8 to 5
                    placeholder="Will be displayed on purchase order"
                    variant="outlined"
                    name="customerNotes"
                    value={formik?.values?.customerNotes || ""}
                    onChange={formik?.handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "14px",
                        borderRadius: "2px",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
            {/* Calculation section - Right side, starting parallel to buttons */}
            <Box
              sx={{ width: "55%", bgcolor: "#f1f5f9", p: 3, borderRadius: 1 }}
            >
              {/* Sub Total */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Sub Total
                </Typography>
                <Typography variant="body2">
                  {formik.values.sub_total?.toFixed(2) || "0.00"}
                </Typography>
              </Box>

              {/* Discount */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2">Discount</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #cbd5e1",
                    borderRadius: "7px",
                    overflow: "hidden",
                    bgcolor: "white",
                  }}
                >
                  <TextField
                    type={selectedSymbol === "%" ? "number" : "text"}
                    placeholder="0"
                    value={formik.values.discount_percent}
                    onChange={handleDiscountChange}
                    variant="outlined"
                    inputProps={{
                      style: {
                        textAlign: "right",
                        fontSize: "14px",
                        padding: "8px 12px",
                        width: "80px",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "7px",
                        paddingRight: 0,
                      },
                      "& .MuiInputBase-input": {
                        height: "auto",
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleSymbolMenuOpen}
                    sx={{
                      // bgcolor: "#f0f0f0",
                      px: 1,
                      borderLeft: "1px solid #ddd",
                      height: "100%",
                      borderRadius: 0,
                    }}
                  >
                    {selectedSymbol}
                  </IconButton>
                </Box>

                <Typography variant="body2">{calculateDiscount()}</Typography>
              </Box>

              {!isChallan &&
                (formik.values.tax_type === "TDS" ? (
                  <>
                    {/* TDS/TCS Section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <RadioGroup
                          row
                          name="tax_type"
                          value={formik.values.tax_type || "TDS"}
                          onChange={handleTaxMethodChange}
                        >
                          <FormControlLabel
                            value="TDS"
                            control={
                              <Radio
                                size="small"
                                sx={{
                                  color: "#3b82f6",
                                  padding: "4px",
                                  "&.Mui-checked": { color: "#3b82f6" },
                                }}
                              />
                            }
                            label={<Typography variant="body2">TDS</Typography>}
                            sx={{ mr: 2 }}
                          />
                          <FormControlLabel
                            value="TCS"
                            control={
                              <Radio
                                size="small"
                                sx={{
                                  color: "#3b82f6",
                                  padding: "4px",
                                  "&.Mui-checked": { color: "#3b82f6" },
                                }}
                              />
                            }
                            label={<Typography variant="body2">TCS</Typography>}
                            onClick={handleOpenTcs}
                          />
                        </RadioGroup>
                        <Box
                          sx={{ display: "flex", alignItems: "center", ml: 2 }}
                        >
                          <Select
                            value={
                              formik.values.tds_option
                                ? tdsOptions.find(
                                    (opt) =>
                                      opt.name === formik.values.tds_option
                                  )?.id || ""
                                : ""
                            }
                            onChange={handleTdsOptionChange}
                            displayEmpty
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{
                              height: "35px",
                              fontSize: "13px",
                              width: "180px",
                              backgroundColor: "white",
                              ml: 2,
                              "& .MuiSelect-select": {
                                py: 1,
                                px: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              },
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 250, // Limit dropdown height
                                  overflowY: "auto", // Add scrollbar if needed
                                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)", // Optional: add a subtle shadow
                                  "& .MuiMenuItem-root": {
                                    fontSize: "13px",
                                    py: 1,
                                    px: 2,
                                  },
                                },
                              },
                            }}
                          >
                            <MenuItem
                              value=""
                              disabled
                              sx={{ color: "#838195" }}
                            >
                              Select a Tax
                            </MenuItem>
                            {tdsOptions.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name} [{option.rate}%]
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            formik.values.tax_type === "TDS" ? "red" : "green",
                          fontWeight: "bold",
                        }}
                      >
                        {formik.values.tax_type === "TDS" ? "- " : "+ "}
                        {formik.values.tax_total_formatted || "0.00"}
                      </Typography>
                    </Box>

                    {/* Adjustment Section */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#cbd5e1",
                            color: "#475569",
                            bgcolor: "white",
                            textTransform: "none",
                            borderStyle: "dashed",
                            height: "36px",
                            px: 2,
                            borderRadius: "7px",
                            maxWidth: 150,
                          }}
                        >
                          Adjustment
                        </Button>
                      </Box>
                      <TextField
                        size="small"
                        value={formik.values.adjustment || "0"}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          formik.setFieldValue("adjustment", value);
                          calculateTotals();
                        }}
                        sx={{
                          width: "120px",
                          ml: 2.3,
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "white",
                            height: "36px",
                            fontSize: "13px !important",
                            borderRadius: "7px",
                          },
                        }}
                      />
                      <IconButton size="small">
                        <HelpOutlineIcon
                          fontSize="small"
                          sx={{ color: "#94a3b8" }}
                        />
                      </IconButton>
                      <Typography variant="body2">
                        {(formik.values.adjustment || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {/* Adjustment Section */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#cbd5e1",
                            color: "#475569",
                            bgcolor: "white",
                            textTransform: "none",
                            borderStyle: "dashed",
                            height: "36px",
                            px: 2,
                            borderRadius: "7px",
                            maxWidth: 150,
                          }}
                        >
                          Adjustment
                        </Button>
                      </Box>
                      <TextField
                        size="small"
                        value={formik.values.adjustment || "0"}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          formik.setFieldValue("adjustment", value);
                          calculateTotals();
                        }}
                        sx={{
                          width: "120px",
                          ml: 2.3,
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "white",
                            height: "36px",
                            fontSize: "13px !important",
                            borderRadius: "7px",
                          },
                        }}
                      />
                      <IconButton size="small" sx={{ ml: 0.5 }}>
                        <HelpOutlineIcon
                          fontSize="small"
                          sx={{ color: "#94a3b8" }}
                        />
                      </IconButton>
                      <Typography variant="body2">
                        {(formik.values.adjustment || 0).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* TDS/TCS Section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <RadioGroup
                            row
                            name="tax_type"
                            value={formik.values.tax_type || "TDS"}
                            onChange={(e) => {
                              const method = e.target.value;
                              formik.setFieldValue("tax_type", method);
                              formik.setFieldValue("tds_option", "");
                              formik.setFieldValue("tax_percentage", "");
                              calculateTotals();
                            }}
                          >
                            <FormControlLabel
                              value="TDS"
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#3b82f6",
                                    "&.Mui-checked": { color: "#3b82f6" },
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2">TDS</Typography>
                              }
                              sx={{ mr: 2 }}
                            />
                            <FormControlLabel
                              value="TCS"
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#3b82f6",
                                    "&.Mui-checked": { color: "#3b82f6" },
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2">TCS</Typography>
                              }
                              onClick={handleOpenTcs}
                            />
                          </RadioGroup>

                          {/* Show TDS Select Only When TDS is Selected */}
                          {formik.values.tax_type === "TDS" && (
                            <>
                              <Select
                                value={
                                  formik.values.tds_option
                                    ? tdsOptions.find(
                                        (opt) =>
                                          opt.name === formik.values.tds_option
                                      )?.id || ""
                                    : ""
                                }
                                onChange={handleTdsOptionChange}
                                displayEmpty
                                IconComponent={KeyboardArrowDownIcon}
                                sx={{
                                  height: "30px",
                                  fontSize: "13px",
                                  width: "10px",
                                  backgroundColor: "white",
                                  ml: 2,
                                }}
                              >
                                <MenuItem
                                  value=""
                                  disabled
                                  sx={{ color: "#838195" }}
                                >
                                  Select a Tax
                                </MenuItem>
                                {tdsOptions.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.name} [{option.rate}%]
                                  </MenuItem>
                                ))}
                              </Select>

                              {/* Show Selected TDS Option in Textbox */}
                              {formik.values.tds_option && (
                                <TextField
                                  size="small"
                                  value={`${formik.values.tds_option} [${formik.values.tax_percentage}%]`}
                                  InputProps={{ readOnly: true }}
                                  variant="outlined"
                                  sx={{
                                    width: "200px",
                                    ml: 2,
                                    bgcolor: "#f9f9f9",
                                    "& .MuiInputBase-input": {
                                      cursor: "default",
                                    },
                                  }}
                                />
                              )}
                            </>
                          )}
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        {formik.values.tax_type === "TDS" ? "- " : "+ "}
                        {formik.values.tax_total_formatted || "0.00"}
                      </Typography>
                    </Box>
                  </>
                ))}

              {isChallan && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={formik.values.adjustment_description || ""}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "adjustment_description",
                          e.target.value
                        )
                      }
                      placeholder="Adjustment"
                      sx={{
                        color: "#475569",
                        bgcolor: "white",
                        border: "none",
                        fontSize: "12px !important",
                        textTransform: "none",
                        height: "36px",
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "white",
                          fontSize: "13px !important",
                          border: "1px dashed #cbd5e1",
                          height: "36px",
                          borderRadius: "7px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "0 !important",
                        },
                        borderRadius: "7px",
                        maxWidth: 150,
                      }}
                    />
                  </Box>
                  <TextField
                    size="small"
                    value={formik.values.adjustment || "0"}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      formik.setFieldValue("adjustment", value);
                      calculateTotals();
                    }}
                    sx={{
                      width: "120px",
                      ml: 2.3,
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        height: "36px",
                        fontSize: "13px !important",
                        borderRadius: "7px",
                      },
                    }}
                  />
                  <IconButton size="small">
                    <HelpOutlineIcon
                      fontSize="small"
                      sx={{ color: "#94a3b8" }}
                    />
                  </IconButton>
                  <Typography variant="body2">
                    {(formik.values.adjustment || 0).toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Total */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Total ( ₹ )</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {formik.values.total_amount?.toFixed(2) ||
                    formik.values.total?.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Item Selection Popover */}
      <Popover
        elevation={3}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: { width: "380px" },
          sx: {
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            // Added display flex and flex direction to create proper layout structure
            display: "flex",
            flexDirection: "column",
          },
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
            data-testid="item-search-input"
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
          // Wrapped List and footer button in a flex container
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Changed List to have flex-grow but with fixed height */}
            <List sx={{ maxHeight: "250px", overflowY: "auto", flexGrow: 1 }}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <React.Fragment key={item.id || `item-${idx}`}>
                    <ListItem
                      button
                      onClick={() => handleSelectItem(item)}
                      sx={{
                        py: 1.5,
                        fontSize: "14px",
                        fontWeight: "400",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "#408dfb",
                          "& .MuiTypography-root": { color: "white" },
                          borderRadius: 3,
                        },
                      }}
                      data-testid={`item-option-${idx}`}
                    >
                      <ListItemText
                        sx={{
                          "&:hover": {
                            bgcolor: "#408dfb",
                            "& .MuiTypography-root": { color: "white" },
                            borderRadius: 3,
                          },
                        }}
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
                  No items found
                </Box>
              )}
            </List>

            {/* Footer button now sits outside the List but still inside the flex container */}
            <Paper
              elevation={3}
              sx={{
                borderTop: "1px solid rgba(0,0,0,0.08)",
                backgroundColor: "white",
                mt: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { bgcolor: "#ededf7" },
                }}
              >
                <AddOutlinedIcon
                  fontSize="small"
                  sx={{
                    color: "#408dfb",
                    ml: 2,
                    fontSize: "18px",
                    fontWeight: "900",
                  }}
                />
                <Typography
                  onClick={handleOpen}
                  data-testid="add-new-item-button"
                  sx={{
                    color: "#408dfb",
                    p: 1.5,
                    fontSize: "13px",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Add New Item
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              height: "100vh",
              overflowY: "scroll",
              paddingLeft: "100px",
              width: "60%",
            }}
          >
            <Button
              onClick={handleClose}
              sx={{ position: "absolute", top: 10, right: 10, color: "RED" }}
              data-testid="close-new-item-modal"
            >
              <CloseIcon />
            </Button>
            <Box>
              <NewItemForm />
            </Box>
          </Box>
        </Modal>
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
            data-testid="close-bulk-dialog"
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
                data-testid="bulk-search-input"
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
                  borderRight: "1px solid #eee",
                  borderLeft: "1px solid #eee",
                  borderTop: "1px solid #eee",
                  borderRadius: "4px",
                }}
              >
                {bulkFilteredItems.length > 0 ? (
                  bulkFilteredItems.map((item, index) => (
                    <React.Fragment key={item.id || `bulk-item-${index}`}>
                      <ListItem
                        button
                        onClick={() => toggleBulkItemSelection(item)}
                        sx={{ py: 1.5 }}
                        data-testid={`bulk-item-${index}`}
                      >
                        <ListItemIcon>
                          {selectedBulkItems.some((i) => i.id === item.id) && (
                            <CheckCircleIcon sx={{ color: "#4caf50" }} />
                          )}
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
                    data-testid="selected-items-count"
                  >
                    {selectedBulkItems.length}
                  </span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "14px", color: "#555" }}
                  data-testid="total-quantity"
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
                    key={item.selected_id || `selected-item-${index}`}
                    sx={{
                      mb: 1,
                      bgcolor: "#f5f5f5",
                      borderRadius: "4px",
                      py: 1,
                    }}
                    data-testid={`selected-bulk-item-${index}`}
                  >
                    <ListItemText
                      primary={`[${item.sku || "-"}] ${item.name}`}
                      primaryTypographyProps={{ fontSize: "14px" }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleBulkQuantityChange(item.selected_id, -1)
                        }
                        disabled={item.quantity <= 1}
                        sx={{ color: "#666" }}
                        data-testid={`decrease-quantity-${index}`}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{ mx: 1, fontSize: "14px" }}
                        data-testid={`item-quantity-${index}`}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleBulkQuantityChange(item.selected_id, 1)
                        }
                        sx={{ color: "#666" }}
                        data-testid={`increase-quantity-${index}`}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveBulkItem(item.selected_id)}
                        sx={{ ml: 1 }}
                        data-testid={`remove-bulk-item-${index}`}
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
            sx={{
              textTransform: "none",
              borderColor: "#ddd",
              color: "#333",
              borderRadius: "5px",
              px: 2,
              py: 0.75,
              fontWeight: 400,
              fontSize: "14px",
              "&:hover": {
                borderColor: "#bbb",
                backgroundColor: "#f8f8f8",
              },
            }}
            data-testid="cancel-bulk-add"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddBulkItems}
            disabled={selectedBulkItems.length === 0}
            data-testid="confirm-bulk-add"
            sx={{
              textTransform: "none",
              backgroundColor: "#408dfb",
              color: "white",
              borderRadius: "5px",
              px: 2,
              py: 0.75,
              fontWeight: 400,
              fontSize: "14px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#1565c0",
                boxShadow: "none",
              },
            }}
          >
            Add Items
          </Button>
        </DialogActions>
      </Dialog>

      {/* TCS Modal */}
      {openTcs && <TCSModal open={openTcs} handleClose={handleCloseTcs} />}
    </Box>
  );
};

export default Items;
