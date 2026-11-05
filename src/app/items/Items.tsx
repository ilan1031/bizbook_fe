"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ListItemButton,
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

const Items = ({ formik }: any) => {
  const theme = useTheme();

  // States only for UI control, not duplicating formik data
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<any>("");
  // Discount is a % of the sub total or a ₹ amount (formik discount_type).
  const selectedSymbol = formik.values.discount_type === "amount" ? "₹" : "%";
  const [symbolAnchorEl, setSymbolAnchorEl] = useState<any>(null);
  const [isChallan, setIsChallan] = useState<boolean>(false);

  // States for item selection only (not duplicating form data)
  const [allItems, setAllItems] = useState<any>([]);
  const [filteredItems, setFilteredItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // States for bulk add dialog only
  const [bulkDialogOpen, setBulkDialogOpen] = useState<boolean>(false);
  const [selectedBulkItems, setSelectedBulkItems] = useState<any>([]);
  const [bulkSearchQuery, setBulkSearchQuery] = useState<any>("");
  const [bulkFilteredItems, setBulkFilteredItems] = useState<any>([]);

  // UI-only modal states
  const [open, setOpen] = useState<boolean>(false);
  const [openTcs, setOpenTcs] = useState<boolean>(false);
  const [isTcsPopoverOpen, setIsTcsPopoverOpen] = useState<boolean>(false);
  const [tcsPopoverAnchorEl, setTcsPopoverAnchorEl] = useState<any>(null);
  // References for UI interaction
  const inputRef = useRef<any>(null);
  const bulkInputRef = useRef<any>(null);

  // Open/close handlers for modals (UI only)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenTcs = () => setOpenTcs(true);
  const handleCloseTcs = () => setOpenTcs(false);

  const handleTdsOptionChange = (event) => {
    const selectedId = (event.target as any).value;
    const list = formik.values.tax_type === "TCS" ? tcsOptions : tdsOptions;
    const selected = list.find((opt) => opt.id === selectedId);

    if (selected) {
      // The totals follow in the effect below, from the new values.
      formik.setFieldValue("tds_option", selected.name);
      formik.setFieldValue("tax_percentage", selected.rate);
    }
  };

  const handleTaxMethodChange = (event) => {
    const method = (event.target as any).value;
    formik.setFieldValue("tax_type", method);
    formik.setFieldValue("tdsOrTcs", method);
    formik.setFieldValue("tax_percentage", "");
    formik.setFieldValue("tds_option", "");
  };
  // Recalculate whenever anything the totals depend on changes. This runs
  // after the change is in formik.values, so it never uses stale values.
  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.items,
    formik.values.commission,
    formik.values.adjustment,
    formik.values.discount_percent,
    formik.values.discount_type,
    formik.values.tax_percentage,
    formik.values.tax_type,
  ]);

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
  // TCS a vendor collects (added to what's owed to them).
  const tcsOptions = [
    { id: "tcs_goods", name: "Sale of Goods", rate: 0.1, section: "206C(1H)" },
    { id: "tcs_scrap", name: "Scrap", rate: 1, section: "206C(1)" },
    { id: "tcs_motor_vehicle", name: "Motor Vehicle", rate: 1, section: "206C(1F)" },
    { id: "tcs_forest", name: "Forest Produce", rate: 2.5, section: "206C(1)" },
    { id: "tcs_minerals", name: "Minerals", rate: 1, section: "206C(1)" },
  ];
  const GST_RATES = [0, 5, 12, 18, 28];

  const [searchTerm, setSearchTerm] = useState<any>("");

  const filteredOptions = useMemo(() => {
    return tdsOptions.filter((option) =>
      option.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tdsOptions]);
  const handleDiscountChange = (event) => {
    const value = (event.target as any).value;
    if (!/^\d*\.?\d{0,2}$/.test(value)) return;
    formik.setFieldValue("discount_percent", value);
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

  const [expenseAccOpen, setExpenseAccOpen] = useState<boolean>(false);
  const [expenseAccAnchorEl, setExpenseAccAnchorEl] = useState<any>(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState<any>(null);
  const [expenseAccSearchTerm, setExpenseAccSearchTerm] = useState<any>("");
  const [expenseAccCategories, setExpenseAccCategories] = useState<any>([]);

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
    setExpenseAccSearchTerm((e.target as any).value);
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
   * Calculate totals and update formik. Money is rounded to 2 decimals;
   * GST is charged per line on the line's share of the discounted value;
   * TDS/TCS is worked out on the value before GST. The server recomputes
   * the same figures when the bill is saved.
   */
  const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
  const calculateTotals = () => {
    const v = formik.values;
    const items = v.items || [];

    const subtotal = r2(items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0));
    const discountInput = parseFloat(v.discount_percent) || 0;
    const discountAmount = r2(
      v.discount_type === "amount"
        ? Math.min(discountInput, subtotal)
        : (subtotal * discountInput) / 100
    );
    const taxableAmount = subtotal - discountAmount;

    let gst = 0;
    items.forEach((item) => {
      const amount = parseFloat(item.amount) || 0;
      const share = subtotal ? (amount / subtotal) * discountAmount : 0;
      gst += ((amount - share) * (Number(item.gst_rate) || 0)) / 100;
    });
    gst = r2(gst);

    const taxPercentage = parseFloat(v.tax_percentage) || 0;
    const taxAmount = r2((taxableAmount * taxPercentage) / 100);
    const adjustment = parseFloat(v.adjustment) || 0;
    const finalTotal = r2(
      taxableAmount + gst + (v.tax_type === "TCS" ? taxAmount : -taxAmount) + adjustment
    );

    const set = (field, value) => {
      if (formik.values[field] !== value) formik.setFieldValue(field, value, false);
    };
    set("sub_total", subtotal);
    set("subtotal", subtotal);
    set("discount_amount", discountAmount);
    set("gst_total", gst);
    set("taxAmount", taxAmount);
    set("tax_amount", taxAmount);
    set("tax_total_formatted", taxAmount.toFixed(2));
    set("total", finalTotal);
    set("total_amount", finalTotal); // For compatibility
  };

  const handleSymbolMenuClose = () => {
    setSymbolAnchorEl(null);
  };

  const handleSymbolSelect = (symbol) => {
    formik.setFieldValue("discount_type", symbol === "₹" ? "amount" : "%");
    handleSymbolMenuClose();
  };
  const handleSymbolMenuOpen = (event) => {
    setSymbolAnchorEl(event.currentTarget);
  };

  const calculateDiscount = () => (Number(formik.values.discount_amount) || 0).toFixed(2);
  const handleSearchChange = (e, isBulk = false) => {
    const query = (e.target as any).value;
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
      // Purchases use the item's cost price; the selling price is only a
      // fallback for items without one.
      const rate = parseFloat(item.purchase_rate) || parseFloat(item.rate) || 0;
      const line = currentItems[selectedItemIndex];

      // Update the specific item
      currentItems[selectedItemIndex] = {
        ...line,
        item_id: item.item_id || item._id || "",
        details: item.name,
        rate: rate,
        sku: item.sku || "",
        item_name: item.name,
        hsn_or_sac: item.hsn_or_sac || "",
        gst_rate: item.is_taxable === false ? 0 : Number(item.gst_rate ?? item.intra_state_tax_rate ?? 0) || 0,
        account_id: line.account_id || item.purchase_account_id_coa || "",
        account_name: line.account_name || "",
        amount: r2(quantity * rate),
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
      tax: "",
      gst_rate: 0,
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

    updatedItems[index] = { ...updatedItems[index], quantity: value, amount: r2(quantity * rate) };

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

    updatedItems[index] = { ...updatedItems[index], rate: value, amount: r2(quantity * rate) };

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
      item_id: item.item_id || item._id || "",
      details: item.name,
      quantity: item.quantity,
      rate: parseFloat(item.purchase_rate) || item.rate || 0,
      tax: "",
      gst_rate: item.is_taxable === false ? 0 : Number(item.gst_rate) || 0,
      amount: r2(item.quantity * (parseFloat(item.purchase_rate) || item.rate || 0)),
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
                    fontWeight: "700" as const,
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
                    fontWeight: "bold" as const,
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
                      display: "flex" as const,
                      alignItems: "center" as const,
                      cursor: "pointer" as const,
                      color: "#3a86ff",
                    }}
                    // onClick={handleOpenBulkDialog}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: "18px", mr: 1 }} />
                    <Typography
                      sx={{
                        textTransform: "none" as const,
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
                    fontWeight: "bold" as const,
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
                    fontWeight: "bold" as const,
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
                    fontWeight: "bold" as const,
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
                    fontWeight: "bold" as const,
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                    bgcolor: "white !important",
                  }}
                >
                  RATE
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: "12%",
                    fontSize: "12px !important",
                    fontWeight: "bold" as const,
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                    borderRight: "1px solid #E0E0E0",
                    bgcolor: "white !important",
                  }}
                >
                  TAX
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: "12px !important",
                    fontWeight: "bold" as const,
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
                        display: "flex" as const,
                        alignItems: "center" as const,
                        cursor: "pointer" as const,
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
                    <Box sx={{ position: "relative" as const, width: "200px" }}>
                      <Box
                        onClick={(e) => handleExpenseAccClick(e, index)}
                        sx={{
                          display: "flex" as const,
                          alignItems: "center" as const,
                          height: "35px",
                          width: "200px",
                          justifyContent: "space-between" as const,
                          border:
                            formik.touched.items?.[index]?.account_name &&
                            Boolean(
                              (formik.errors.items as any)?.[index]?.account_name
                            )
                              ? "1px solid #d32f2f"
                              : "1px solid #c4c4c4",
                          borderRadius: "7px",
                          padding: "8px 14px",
                          cursor: "pointer" as const,
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
                              : "#aaa" as const,
                            textAlign: "left" as const,
                            width: "100%",
                            overflow: "hidden" as const,
                            textOverflow: "ellipsis" as const,
                            whiteSpace: "nowrap" as const,
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
                            overflow: "auto" as const,
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
                                  textAlign: "center" as const,
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
                                        fontWeight: "600" as const,
                                        p: 1,
                                        backgroundColor:
                                          COLORS?.bgLight || "#f5f5f5",
                                        position: "sticky" as const,
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
                                            overflow: "hidden" as const,
                                            textOverflow: "ellipsis" as const,
                                            whiteSpace: "nowrap" as const,
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
                        handleQuantityChange(index, (e.target as any).value);
                      }}
                      name={`items[${index}].quantity`}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" as const, fontSize: "14px" },
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
                        handleRateChange(index, (e.target as any).value);
                      }}
                      name={`items[${index}].rate`}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center" as const, fontSize: "14px" },
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
                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    {/* GST on the line: input tax credit */}
                    <Select
                      size="small"
                      value={Number(item.gst_rate) || 0}
                      onChange={(e) => {
                        const updatedItems = [...formik.values.items];
                        const rate = Number((e.target as any).value) || 0;
                        updatedItems[index] = { ...updatedItems[index], gst_rate: rate, tax: rate ? `GST ${rate}%` : "" };
                        formik.setFieldValue("items", updatedItems);
                      }}
                      name={`items[${index}].gst_rate`}
                      variant="outlined"
                      inputProps={{ "data-testid": `tax-select-${index}` }}
                      sx={{
                        minWidth: "100px",
                        "& .MuiSelect-select": { fontSize: "13px" },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                    >
                      {GST_RATES.map((rate) => (
                        <MenuItem key={rate} value={rate} sx={{ fontSize: "14px" }}>
                          {rate ? `GST ${rate}%` : "No GST"}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold" as const, fontSize: "14px", py: 1.5 }}
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

        {/* <Box sx={{ display: "flex" as const, justifyContent: "space-between" as const, gap: 15 }}>
          <Box sx={{ display: "flex" as const, gap: 2, mb: 4, height: "40px" }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              data-testid="add-row-button"
              sx={{
                borderRadius: "6px",
                fontSize: "13px",
                textTransform: "none" as const,
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
                textTransform: "none" as const,
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
              sx={{ display: "flex" as const, justifyContent: "space-between" as const, mb: 2 }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: "600" as const }}>
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
                display: "flex" as const,
                alignItems: "center" as const,
                justifyContent: "space-between" as const,
              }}
            >
              <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
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
                      <span style={{ fontSize: "14px", fontWeight: "400" as const }}>
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
                      <span style={{ fontSize: "14px", fontWeight: "400" as const }}>
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
                    fontWeight: "400" as const,
                    width: "200px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      fontWeight: "400" as const,
                    },
                    "& .MuiSelect-select": {
                      fontSize: "14px",
                      fontWeight: "400" as const,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ddd",
                    },
                  }}
                  renderValue={(selected: any) => {
                    if (!selected) {
                      <span style={{ fontSize: "14px", fontWeight: "400" as const }}>
                        Select a Tax
                      </span>;
                    }
                    const selectedOption = tdsOptions.find(
                      (option) => option.value === parseFloat(selected)
                    );
                    return (
                      <span style={{ fontSize: "14px", fontWeight: "400" as const }}>
                        {selectedOption?.label} [{selected}%]
                      </span>
                    );
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontSize: "14px", fontWeight: "400" as const }}
                  >
                    Select a Tax
                  </MenuItem>
                  {tdsOptions.map((option) => (
                    <MenuItem
                      key={option.label}
                      value={option.value.toString()}
                      sx={{ fontSize: "14px", fontWeight: "400" as const }}
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
                display: "flex" as const,
                alignItems: "center" as const,
                mb: 2,
                justifyContent: "space-between" as const,
              }}
            >
              <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
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
                  value={formik.values.adjustment ?? ""}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // Ensure non-negative value
                    const value = Math.max(0, parseFloat((e.target as any).value) || 0);
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

            <Box sx={{ display: "flex" as const, justifyContent: "space-between" as const }}>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "16px", fontWeight: "600" as const }}
              >
                Total ( ₹ )
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "16px", fontWeight: "600" as const }}
                data-testid="total-value"
              >
                {formik.values.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box> */}

        {/*Customer Notes*/}

        {/* <Box sx={{ display: "flex" as const }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "14px", fontWeight: "500" as const, mb: 1 }}
            >
              Customer Notes
            </Typography>
            <TextField
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              value={formik.values.notes ?? ""}
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
        <Box sx={{ display: "flex" as const, flexDirection: "column" as const, gap: 3 }}>
          {/* Main content with top row and split layout */}
          <Box sx={{ display: "flex" as const, gap: 3 }}>
            {/* Left side with buttons and customer notes */}
            <Box
              sx={{
                flex: "0 0 auto",
                width: "50%",
                display: "flex" as const,
                flexDirection: "column" as const,
                gap: 3,
              }}
            >
              {/* Top action buttons */}
              <Box sx={{ display: "flex" as const, gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                  data-testid="add-row-button"
                  sx={{
                    borderRadius: "6px",
                    fontSize: "13px",
                    textTransform: "none" as const,
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
                    textTransform: "none" as const,
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
                  display: "flex" as const,
                  flexDirection: "column" as const,
                  justifyContent: "flex-end" as const,
                }}
              >
                {/* Customer Notes section */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400" as const,
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
                  display: "flex" as const,
                  justifyContent: "space-between" as const,
                  alignItems: "center" as const,
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" as const }}>
                  Sub Total
                </Typography>
                <Typography variant="body2">
                  {formik.values.sub_total?.toFixed(2) || "0.00"}
                </Typography>
              </Box>

              {/* Discount */}
              <Box
                sx={{
                  display: "flex" as const,
                  justifyContent: "space-between" as const,
                  alignItems: "center" as const,
                  mb: 2,
                }}
              >
                <Typography variant="body2">Discount</Typography>
                <Box
                  sx={{
                    display: "flex" as const,
                    alignItems: "center" as const,
                    border: "1px solid #cbd5e1",
                    borderRadius: "7px",
                    overflow: "hidden" as const,
                    bgcolor: "white",
                  }}
                >
                  <TextField
                    type={selectedSymbol === "%" ? "number" : "text"}
                    placeholder="0"
                    value={formik.values.discount_percent ?? ""}
                    onChange={handleDiscountChange}
                    variant="outlined"
                    inputProps={{
                      style: {
                        textAlign: "right" as const,
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

              {/* GST (input tax credit) from the lines */}
              {Number(formik.values.gst_total) > 0 && (
                <Box
                  sx={{
                    display: "flex" as const,
                    justifyContent: "space-between" as const,
                    alignItems: "center" as const,
                    mb: 2,
                  }}
                >
                  <Typography variant="body2">GST</Typography>
                  <Typography variant="body2">
                    + {Number(formik.values.gst_total).toFixed(2)}
                  </Typography>
                </Box>
              )}

              {!isChallan &&
                (formik.values.tax_type === "TDS" ? (
                  <>
                    {/* TDS/TCS Section */}
                    <Box
                      sx={{
                        display: "flex" as const,
                        alignItems: "center" as const,
                        justifyContent: "space-between" as const,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
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
                          sx={{ display: "flex" as const, alignItems: "center" as const, ml: 2 }}
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
                                display: "flex" as const,
                                alignItems: "center" as const,
                                justifyContent: "space-between" as const,
                              },
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 250, // Limit dropdown height
                                  overflowY: "auto" as const, // Add scrollbar if needed
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
                          fontWeight: "bold" as const,
                        }}
                      >
                        {formik.values.tax_type === "TDS" ? "- " : "+ "}
                        {formik.values.tax_total_formatted || "0.00"}
                      </Typography>
                    </Box>

                    {/* Adjustment Section */}
                    <Box
                      sx={{
                        display: "flex" as const,
                        justifyContent: "space-between" as const,
                        alignItems: "center" as const,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                        <Box sx={{ border: "1px dashed #cbd5e1", borderRadius: 1, px: 1.5, py: 0.5, fontSize: 13, color: "#475569" }}>Adjustment</Box>
                      </Box>
                      <TextField
                        size="small"
                        value={formik.values.adjustment ?? ""}
                        placeholder="0"
                        onChange={(e) => {
                          // Keep what's typed ("-", "1.") so signs and decimals can be entered.
                          if (/^-?\d*\.?\d{0,2}$/.test((e.target as any).value)) formik.setFieldValue("adjustment", (e.target as any).value);
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
                      <IconButton aria-label="Help" onClick={() => window.dispatchEvent(new Event("bizbooks:help"))} size="small">
                        <HelpOutlineIcon
                          fontSize="small"
                          sx={{ color: "#94a3b8" }}
                        />
                      </IconButton>
                      <Typography variant="body2">
                        {(parseFloat(formik.values.adjustment) || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    {/* Adjustment Section */}
                    <Box
                      sx={{
                        display: "flex" as const,
                        justifyContent: "space-between" as const,
                        alignItems: "center" as const,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                        <Box sx={{ border: "1px dashed #cbd5e1", borderRadius: 1, px: 1.5, py: 0.5, fontSize: 13, color: "#475569" }}>Adjustment</Box>
                      </Box>
                      <TextField
                        size="small"
                        value={formik.values.adjustment ?? ""}
                        placeholder="0"
                        onChange={(e) => {
                          // Keep what's typed ("-", "1.") so signs and decimals can be entered.
                          if (/^-?\d*\.?\d{0,2}$/.test((e.target as any).value)) formik.setFieldValue("adjustment", (e.target as any).value);
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
                      <IconButton aria-label="Help" onClick={() => window.dispatchEvent(new Event("bizbooks:help"))} size="small" sx={{ ml: 0.5 }}>
                        <HelpOutlineIcon
                          fontSize="small"
                          sx={{ color: "#94a3b8" }}
                        />
                      </IconButton>
                      <Typography variant="body2">
                        {(parseFloat(formik.values.adjustment) || 0).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* TDS/TCS Section */}
                    <Box
                      sx={{
                        display: "flex" as const,
                        alignItems: "center" as const,
                        justifyContent: "space-between" as const,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex" as const,
                          alignItems: "center" as const,
                          justifyContent: "space-between" as const,
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
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

                          {/* TCS rates when TCS is selected */}
                          {formik.values.tax_type === "TCS" && (
                            <>
                              <Select
                                value={
                                  formik.values.tds_option
                                    ? tcsOptions.find(
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
                                  width: "180px",
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
                                {tcsOptions.map((option) => (
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
                                      cursor: "default" as const,
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
                    display: "flex" as const,
                    justifyContent: "space-between" as const,
                    alignItems: "center" as const,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex" as const, alignItems: "center" as const }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={formik.values.adjustment_description || ""}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "adjustment_description",
                          (e.target as any).value
                        )
                      }
                      placeholder="Adjustment"
                      sx={{
                        color: "#475569",
                        bgcolor: "white",
                        border: "none",
                        fontSize: "12px !important",
                        textTransform: "none" as const,
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
                    value={formik.values.adjustment ?? ""}
                    placeholder="0"
                    onChange={(e) => {
                      if (/^-?\d*\.?\d{0,2}$/.test((e.target as any).value)) formik.setFieldValue("adjustment", (e.target as any).value);
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
                  <IconButton aria-label="Help" onClick={() => window.dispatchEvent(new Event("bizbooks:help"))} size="small">
                    <HelpOutlineIcon
                      fontSize="small"
                      sx={{ color: "#94a3b8" }}
                    />
                  </IconButton>
                  <Typography variant="body2">
                    {(parseFloat(formik.values.adjustment) || 0).toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Total */}
              <Box
                sx={{
                  display: "flex" as const,
                  justifyContent: "space-between" as const,
                  alignItems: "center" as const,
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
            display: "flex" as const,
            flexDirection: "column" as const,
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
          <Box sx={{ display: "flex" as const, justifyContent: "center" as const, p: 3 }}>
            <CircularProgress size={24} sx={{ color: "#3a86ff" }} />
          </Box>
        ) : (
          // Wrapped List and footer button in a flex container
          <Box sx={{ display: "flex" as const, flexDirection: "column" as const, flexGrow: 1 }}>
            {/* Changed List to have flex-grow but with fixed height */}
            <List sx={{ maxHeight: "250px", overflowY: "auto" as const, flexGrow: 1 }}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <React.Fragment key={item.id || `item-${idx}`}>
                    <ListItemButton
                      onClick={() => handleSelectItem(item)}
                      sx={{
                        py: 1.5,
                        fontSize: "14px",
                        fontWeight: "400" as const,
                        cursor: "pointer" as const,
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
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Box
                  sx={{
                    p: 2,
                    textAlign: "center" as const,
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
                  display: "flex" as const,
                  alignItems: "center" as const,
                  "&:hover": { bgcolor: "#ededf7" },
                }}
              >
                <AddOutlinedIcon
                  fontSize="small"
                  sx={{
                    color: "#408dfb",
                    ml: 2,
                    fontSize: "18px",
                    fontWeight: "900" as const,
                  }}
                />
                <Typography
                  onClick={handleOpen}
                  data-testid="add-new-item-button"
                  sx={{
                    color: "#408dfb",
                    p: 1.5,
                    fontSize: "13px",
                    fontWeight: "400" as const,
                    cursor: "pointer" as const,
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
              position: "absolute" as const,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              height: "100vh",
              overflowY: "scroll" as const,
              paddingLeft: "100px",
              width: "60%",
            }}
          >
            <Button
              onClick={handleClose}
              sx={{ position: "absolute" as const, top: 10, right: 10, color: "RED" }}
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
        <DialogTitle sx={{ fontSize: "16px", fontWeight: "500" as const, pb: 1 }}>
          Add Items in Bulk
          <IconButton
            aria-label="close"
            onClick={handleCloseBulkDialog}
            sx={{ position: "absolute" as const, right: 8, top: 8, color: "#888" }}
            data-testid="close-bulk-dialog"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: "flex" as const, gap: 3 }}>
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
                  overflow: "auto" as const,
                  borderRight: "1px solid #eee",
                  borderLeft: "1px solid #eee",
                  borderTop: "1px solid #eee",
                  borderRadius: "4px",
                }}
              >
                {bulkFilteredItems.length > 0 ? (
                  bulkFilteredItems.map((item, index) => (
                    <React.Fragment key={item.id || `bulk-item-${index}`}>
                      <ListItemButton
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
                      </ListItemButton>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center" as const,
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
                sx={{ display: "flex" as const, justifyContent: "space-between" as const, mb: 2 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: "15px", fontWeight: "500" as const }}
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
              <List sx={{ maxHeight: "400px", overflow: "auto" as const }}>
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
                    <Box sx={{ display: "flex" as const, alignItems: "center" as const, ml: 2 }}>
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
              textTransform: "none" as const,
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
              textTransform: "none" as const,
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
