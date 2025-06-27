"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
  Select,
  MenuItem,
  Menu,
  InputAdornment,
  Grid,
  Popover,
  Autocomplete,
  Dialog,
  DialogContent,
  Modal,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TCStax from "../../../common/Tax/TCStax";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import apiService from "../../../../services/axiosService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TaxModal from "../../../common/Tax/TcsModal";
import AddItemsInBulkDialog from "../../../common/Addbulkitems/page";
import { usePathname } from "next/navigation";

export default function InvoiceItemTable({ formik }) {
  const [symbolAnchorEl, setSymbolAnchorEl] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState("%");
  const [isTcsPopoverOpen, setIsTcsPopoverOpen] = useState(false);
  const [tcsPopoverAnchorEl, setTcsPopoverAnchorEl] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [isChallan, setIsChallan] = useState(false);
  const options = [...filteredItems, { id: "add_new", name: "Add New Item" }];
  const pathname = usePathname();
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
  const tcsOptions = [
    { id: "sample", name: "sample", rate: 20, nature: "206C(6CA)" },
  ];

  const getPathEntity = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[2];
  };

  useEffect(() => {
    const value = getPathEntity();
    if (value === "deliveryChallan") {
      setIsChallan(true);
    }
  }, [pathname]);

  const handleSymbolMenuClose = () => {
    setSymbolAnchorEl(null);
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    handleSymbolMenuClose();
  };

  const fetchItemList = async () => {
    if (allItems.length > 0) return;
    try {
      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        console.error("Organization ID not found in local storage");
        return;
      }
      const response = await apiService({
        method: "GET",
        url: `/api/v1/item/item/details?organization_id=${organization_id}`,
      });
      const fetchedItems = response.data?.message || [];
      const itemsWithIds = fetchedItems.map((item) => ({
        ...item,
        id:
          item._id ||
          `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));
      setAllItems(itemsWithIds);
      setFilteredItems(itemsWithIds);
    } catch (error) {
      console.error("Error fetching items:", error);
      setFilteredItems([]);
    }
  };

  useEffect(() => {
    fetchItemList();
  }, []);
  // console.log(formik.values.discount_percent, "discount_percent");

  const handleClose = () => {
    fetchItemList();
    setOpenItemDialog(false);
  };

  useEffect(() => {
    if (!formik.values.line_items) {
      formik.setFieldValue("line_items", [
        {
          item_id: "",
          name: "",
          description: "",
          quantity: 1,
          tax: "",
          rate: 0,
          discount: 0,
          amount: 0,
          sku: "",
        },
      ]);
    }

    if (!formik.values.tax_type) {
      formik.setFieldValue("tax_type", "TDS");
    }
  }, []);

  const commonInputFieldStyle = {
    width: "80px",
    "& .MuiOutlinedInput-root": {
      height: "36px",
      backgroundColor: "white",
    },
    "& .MuiOutlinedInput-input": {
      textAlign: "right",
      p: "8px 12px",
    },
  };

  const handleSelectItem = (newValue, index) => {
    if (newValue && newValue.id !== "add_new") {
      const currentItems = [...formik.values.line_items];
      const quantity = parseFloat(currentItems[index].quantity) || 1;
      const rate = parseFloat(newValue.rate) || 0;
      const amount = quantity * rate;

      currentItems[index] = {
        ...currentItems[index],
        item_id: newValue.id,
        name: newValue.name,
        rate: rate,
        amount: amount,
      };

      formik.setFieldValue("line_items", currentItems);
      calculateTotals();
    }
  };

  const calculateTotals = () => {
    const items = formik.values.line_items || [];

    // Calculate subtotal from line items
    const subTotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const amount = quantity * rate;
      return sum + amount;
    }, 0);

    // Set subtotal values
    formik.setFieldValue("sub_total", subTotal);
    formik.setFieldValue("sub_total_formatted", `₹${subTotal.toFixed(2)}`);

    // Calculate discount on subtotal
    const discountPercentage = parseFloat(formik.values.discount_percent) || 0;
    const discountAmount = (subTotal * discountPercentage) / 100;
    const subTotalAfterDiscount = subTotal - discountAmount;

    // Set discount values
    // formik.setFieldValue('discount_percent', discountPercentage);
    formik.setFieldValue("discount_amount", discountAmount);
    formik.setFieldValue(
      "discount_amount_formatted",
      `₹${discountAmount.toFixed(2)}`
    );

    // Calculate tax amount based on TDS/TCS selection
    const taxPercentage = parseFloat(formik.values.tax_percentage) || 0;
    const taxAmount = (subTotalAfterDiscount * taxPercentage) / 100;

    // Set tax amount values
    formik.setFieldValue("tax_total", taxAmount);
    formik.setFieldValue("tax_total_formatted", `₹${taxAmount.toFixed(2)}`);

    // Calculate total with adjustment
    const adjustment = parseFloat(formik.values.adjustment) || 0;
    let total;

    if (formik.values.tax_type === "TCS") {
      // For TCS, add tax amount
      total = subTotalAfterDiscount + taxAmount + adjustment;
    } else {
      // For TDS, subtract tax amount
      total = subTotalAfterDiscount - taxAmount + adjustment;
    }

    // Set all total values in formik
    formik.setFieldValue("total", total);
    formik.setFieldValue("total_formatted", `₹${total.toFixed(2)}`);
    formik.setFieldValue("total_amount", total);
    formik.setFieldValue("total_amount_formatted", `₹${total.toFixed(2)}`);

    // Set tax IDs based on selection
    if (formik.values.tax_type === "TDS") {
      formik.setFieldValue("tds_id", formik.values.tds_option);
      formik.setFieldValue("tcs_id", "");
    } else {
      formik.setFieldValue("tcs_id", formik.values.tds_option);
      formik.setFieldValue("tds_id", "");
    }
  };

  const handleTaxMethodChange = (event) => {
    const method = event.target.value;
    formik.setFieldValue("tax_type", method);
    formik.setFieldValue("tax_percentage", "");
    formik.setFieldValue("tds_option", "");
    calculateTotals();
  };

  const handleTdsOptionChange = (event) => {
    const selectedId = event.target.value;
    const options = formik.values.tax_type === "TDS" ? tdsOptions : tcsOptions;
    const selected = options.find((opt) => opt.id === selectedId);

    if (selected) {
      formik.setFieldValue("tds_option", selectedId);
      formik.setFieldValue("tax_percentage", selected.rate);
      calculateTotals();
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...formik.values.line_items];
    const quantity = parseFloat(value) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    const amount = quantity * rate;

    updatedItems[index] = {
      ...updatedItems[index],
      quantity: quantity,
      amount: amount,
    };

    formik.setFieldValue("line_items", updatedItems);
    calculateTotals();
  };

  const handleRateChange = (index, value) => {
    const updatedItems = [...formik.values.line_items];
    const rate = parseFloat(value) || 0;
    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const amount = quantity * rate;

    updatedItems[index] = {
      ...updatedItems[index],
      rate: rate,
      amount: amount,
    };

    formik.setFieldValue("line_items", updatedItems);
    calculateTotals();
  };

  const handleDiscountChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("discount_percent", value);
    calculateTotals();
  };

  const addNewRow = () => {
    const newLineItems = [...formik.values.line_items];
    newLineItems.push({
      item_id: "",
      name: "",
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      tax_percentage: 0,
      unit: "",
    });
    formik.setFieldValue("line_items", newLineItems);
  };

  const removeRow = (index) => {
    if (formik.values.line_items.length > 1) {
      const newLineItems = formik.values.line_items.filter(
        (_, i) => i !== index
      );
      formik.setFieldValue("line_items", newLineItems);
    }
  };

  const calculateDiscount = () => {
    const subtotal = parseFloat(formik.values.sub_total) || 0;
    const discountValue = parseFloat(formik.values.discount_percent) || 0;
    const discountAmount = (subtotal * discountValue) / 100;
    return `${discountAmount.toFixed(2)}`;
  };

  const calculateItemTotal = (item) => {
    if (!item) return "0.00";
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discount = parseFloat(item.discount) || 0;
    const amount = quantity * rate * (1 - discount / 100);
    item.amount = amount; // Update the item's amount
    return amount.toFixed(2);
  };

  const InvoiceRow = ({ item, canDelete, index }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e2e8f0",
        "& > div:not(:last-child)": {
          borderRight: "1px solid #e2e8f0",
        },
      }}
    >
      <Box sx={{ flex: 4, p: 2, color: "#94a3b8" }}>
        <Autocomplete
          options={options}
          value={formik.values.line_items[index]}
          getOptionLabel={(option) => option.name || ""}
          onChange={(_, newValue) => {
            if (newValue?.id === "add_new") {
              setOpenItemDialog(true);
            } else {
              handleSelectItem(newValue, index);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={
                formik.touched.line_items?.[index]?.name &&
                Boolean(formik.errors.line_items?.[index]?.name)
              }
              helperText={
                formik.touched.line_items?.[index]?.name &&
                formik.errors.line_items?.[index]?.name
              }
              placeholder="Type or click to select an item"
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#86b7fe",
                    boxShadow: "0 0 0 2px rgba(97, 160, 255, 0.3)",
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d32f2f",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#475569",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                },
                "& .MuiFormHelperText-root": {
                  color: "#d32f2f",
                  marginLeft: 0,
                  fontSize: "0.75rem",
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            if (option.id === "add_new") {
              return (
                <MenuItem {...props} key="add_new">
                  <Divider />
                  <Button
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      justifyContent: "flex-start",
                      color: "#2196f3",
                      textTransform: "none",
                      fontSize: "14px",
                    }}
                    onClick={() => setOpenItemDialog(true)}
                  >
                    Add New Item
                  </Button>
                </MenuItem>
              );
            }
            return (
              <MenuItem {...props} key={option.id}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "medium", color: "inherit" }}
                  >
                    {option.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "inherit" }}>
                    Rate: ₹{option.rate}
                  </Typography>
                </Box>
              </MenuItem>
            );
          }}
        />
        {/* <CustomDialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}> */}
        {/* <CreateNewItem onClose={() => setOpenItemDialog(false)} />
         */}
        {/* </CustomDialog> */}
        <Modal open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
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
              paddingLeft: "50px",
              width: "60%",
            }}
          >
            {/* <Button
    onClick={handleClose}
    sx={{ position: "absolute", top: 10, right: 10, color: "RED" }}
    data-testid="close-new-item-modal"
  >
    <CloseIcon />
  </Button> */}
            {/* <Box>
              <AddItemsInBulkDialog onClose={handleClose} />
            </Box> */}
          </Box>
        </Modal>
      </Box>
      <Box sx={{ flex: 1, p: 2, textAlign: "center" }}>
        <TextField
          size="small"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(index, e.target.value)}
          error={
            formik.touched.line_items?.[index]?.quantity &&
            Boolean(formik.errors.line_items?.[index]?.quantity)
          }
          helperText={
            formik.touched.line_items?.[index]?.quantity &&
            formik.errors.line_items?.[index]?.quantity
          }
          variant="outlined"
          sx={{
            ...commonInputFieldStyle,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
          InputProps={{
            inputProps: { style: { textAlign: "right" } },
          }}
        />
      </Box>
      <Box sx={{ flex: 1, p: 2, textAlign: "center" }}>
        <TextField
          size="small"
          value={item.rate}
          onChange={(e) => handleRateChange(index, e.target.value)}
          error={
            formik.touched.line_items?.[index]?.rate &&
            Boolean(formik.errors.line_items?.[index]?.rate)
          }
          helperText={
            formik.touched.line_items?.[index]?.rate &&
            formik.errors.line_items?.[index]?.rate
          }
          sx={{
            ...commonInputFieldStyle,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
          InputProps={{
            inputProps: { style: { textAlign: "right" } },
          }}
        />
      </Box>
      <Box sx={{ flex: 1, p: 2, textAlign: "right", fontWeight: 500 }}>
        {calculateItemTotal(item)}
      </Box>
      <Box sx={{ width: "40px", display: "flex", justifyContent: "center" }}>
        {canDelete && (
          <IconButton size="small" onClick={() => removeRow(index)}>
            <CloseIcon fontSize="small" sx={{ color: "#ef4444" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  // Update useEffect to trigger calculations when values change
  useEffect(() => {
    calculateTotals();
  }, [
    formik.values.line_items,
    formik.values.tax_percentage,
    formik.values.tax_type,
    formik.values.adjustment,
    formik.values.discount_percent,
  ]);

  const handleManageTaxClick = (event) => {
    event.stopPropagation(); // Prevent the Select from opening/closing
    setOpenTaxModal(true);
  };

  return (
    <Box
      sx={{
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        p: 2,
        mr: 17,
        ml: 1,
      }}
    >
      {/* Item Table */}
      <Box
        sx={{
          borderRadius: "4px",
          mb: 2,
          backgroundColor: "#fff",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e2e8f0",
            borderTop: "1px solid #e2e8f0",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "16px", p: 2 }}>
            Item Table
          </Typography>
          <Button
            variant="text"
            startIcon={<CheckCircleOutlineIcon sx={{ color: "#3b82f6" }} />}
            sx={{
              color: "#3b82f6",
              textTransform: "none",
              fontWeight: 400,
              p: 2,
            }}
          >
            Bulk Actions
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid #E2E8F0",
            "& > div:not(:last-child)": { borderRight: ".5px solid #E2E8F0" },
            mt: -2,
          }}
        >
          <Box
            sx={{
              flex: 4,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            ITEM DETAILS
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              textAlign: "center",
            }}
          >
            QUANTITY
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            RATE
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                ml: 0.5,
                border: "1px solid #CBD5E1",
                p: 0.2,
                borderRadius: 0.5,
                fontSize: "11px",
                lineHeight: 1,
              }}
            >
              ₹
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              textAlign: "center",
            }}
          >
            AMOUNT
          </Box>
          <Box sx={{ width: "40px" }}></Box>
        </Box>

        {/* Table Rows */}
        {formik.values.line_items.map((item, index) => (
          <InvoiceRow
            key={index}
            item={item}
            index={index}
            canDelete={
              formik.values.line_items.length > 1 ||
              index === formik.values.line_items.length - 1
            }
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
        {/* Left Column - Buttons and Notes */}
        <Box
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Buttons Row */}
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#f0f4ff",
                borderRadius: "7px",
                position: "relative",
              }}
            >
              <Button
                variant="text"
                startIcon={<AddCircleOutlinedIcon sx={{ color: "#3b82f6" }} />}
                onClick={() => addNewRow()}
                sx={{
                  color: "black",
                  textTransform: "none",
                  fontWeight: 400,
                }}
              >
                Add New Row
              </Button>
              <IconButton
                size="small"
                sx={{
                  ml: -1,
                }}
              >
                <KeyboardArrowDownIcon
                  sx={{ color: "#3b82f6", fontSize: "18px" }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
        {/* Right Column - Summary Section */}
        {/* Right Column - Summary Section */}
        <Box sx={{ width: "55%", bgcolor: "#f1f5f9", p: 3, borderRadius: 1 }}>
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
            <Typography variant="body2">{formik.values.sub_total}</Typography>
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
            <Grid
              item
              sx={{
                Width: "50%",
                bgcolor: "white",
                borderRadius: "7px",
              }}
            >
              <TextField
                type={selectedSymbol === "%" ? "number" : "text"}
                placeholder="0"
                value={formik.values.discount_percent}
                onChange={handleDiscountChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        // onClick={handleSymbolMenuOpen}
                        sx={{
                          bgcolor: "action.hover",
                          px: 1,
                          borderLeft: "1px solid",
                          borderColor: "divider",
                          height: "100%",
                          borderRadius: 0,
                        }}
                      >
                        {selectedSymbol}
                        {/* <ArrowDropDown fontSize="small" /> */}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    pr: 0,
                    height: 36,
                    borderRadius: "7px", // Added border radius
                    "& input": {
                      textAlign: "right",
                      pr: 1,
                      fontSize: "0.875rem",
                      py: 0.5,
                      width: "60px", // Constrain input width
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    pl: 1,
                    height: 36,
                    borderRadius: "7px", // Ensure radius applies
                    overflow: "hidden", // Keep radius intact
                  },
                }}
              />
              <Menu
                anchorEl={symbolAnchorEl}
                open={Boolean(symbolAnchorEl)}
                onClose={handleSymbolMenuClose}
              >
                <MenuItem onClick={() => handleSymbolSelect("%")}>
                  % Percentage
                </MenuItem>
                <MenuItem onClick={() => handleSymbolSelect("₹")}>
                  ₹ Rupee
                </MenuItem>
              </Menu>
            </Grid>
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
                      />
                    </RadioGroup>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 8 }}>
                      <Select
                        value={formik.values.tds_option || ""}
                        onChange={handleTdsOptionChange}
                        displayEmpty
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                          height: "35px",
                          fontSize: "13px",
                          width: "180px",
                          backgroundColor: "white",
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              width: "250px",
                              top: "25px",
                              fontSize: "13px",
                              "& .MuiMenuItem-root": {
                                padding: "8px 16px",
                                "&:hover": {
                                  backgroundColor: "#f0f4ff",
                                },
                              },
                              "& .MuiPopover-paper.MuiMenu-paper": {
                                top: "200px",
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="" disabled sx={{ color: "#838195" }}>
                          Select a Tax
                        </MenuItem>
                        {(formik.values.tax_type === "TDS"
                          ? tdsOptions
                          : tcsOptions
                        ).map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name} [{option.rate}%]
                          </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem
                          onClick={handleManageTaxClick}
                          sx={{
                            color: "#3b82f6",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                            Manage {formik.values.tax_type}
                          </Box>
                        </MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  <Typography variant="body2">
                    {formik.values.tax_type === "TDS" ? "- " : " "}
                    {formik.values.tax_total_formatted}
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
                  <IconButton size="small" sx={{}}>
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
                      />
                    </RadioGroup>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 8 }}>
                      <Select
                        value={formik.values.tds_option || ""}
                        onChange={handleTdsOptionChange}
                        displayEmpty
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                          height: "35px",
                          fontSize: "13px",
                          width: "150px",
                          backgroundColor: "white",
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              width: "20px",
                              "& .MuiMenuItem-root": {
                                padding: "8px 16px",
                                "&:hover": {
                                  backgroundColor: "#f0f4ff",
                                },
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select {formik.values.tax_type}
                        </MenuItem>
                        {(formik.values.tax_type === "TDS"
                          ? tdsOptions
                          : tcsOptions
                        ).map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name} [{option.rate}%]
                          </MenuItem>
                        ))}
                        <Divider />
                        <MenuItem
                          onClick={handleManageTaxClick}
                          sx={{
                            color: "#3b82f6",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                            Manage {formik.values.tax_type}
                          </Box>
                        </MenuItem>
                      </Select>
                    </Box>
                  </Box>
                  <Typography variant="body2">
                    {formik.values.tax_type === "TDS" ? "- " : "+ "}
                    {formik.values.tax_total_formatted}
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
                  onChange={(e) => {
                    const value = e.target.value || "";
                    formik.setFieldValue("adjustment_description", value);
                  }}
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
                    "&:hover": {
                      border: "none",
                    },
                    borderRadius: "7px",
                    maxWidth: 150,
                  }}
                >
                  Adjustment
                </TextField>
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
              <IconButton size="small" sx={{}}>
                <HelpOutlineIcon fontSize="small" sx={{ color: "#94a3b8" }} />
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

        {/* TCS Popover */}
        <Popover
          open={isTcsPopoverOpen}
          anchorEl={tcsPopoverAnchorEl}
          onClose={() => {
            setIsTcsPopoverOpen(false);
            setTcsPopoverAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <TCStax />
        </Popover>

        <Dialog
          open={openTaxModal}
          onClose={() => setOpenTaxModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            <TaxModal
              onClose={() => setOpenTaxModal(false)}
              taxType={formik.values.tax_type}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
