"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Divider,
  Paper,
  Chip,
  Dialog,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function AddItemsInBulkDialog({
  open,
  onClose,
  itemList,
  formik,
  initialSelectedItems = [],
}) {
  const [items, setItems] = useState(
    itemList.map((item) => ({
      ...item,
      selected: initialSelectedItems.some(
        (selected) => selected.id === item.id
      ),
    }))
  );
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Update items when itemList or initialSelectedItems changes
  useEffect(() => {
    setItems(
      itemList.map((item) => ({
        ...item,
        selected: initialSelectedItems.some(
          (selected) => selected.id === item.id
        ),
      }))
    );
  }, [itemList, initialSelectedItems]);

  // Initialize quantities from initialSelectedItems
  useEffect(() => {
    const initialQuantities = {};
    initialSelectedItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [initialSelectedItems]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle item selection
  const handleSelectItem = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );

    // Initialize quantity when selecting an item
    if (!quantities[id]) {
      setQuantities({
        ...quantities,
        [id]: 1,
      });
    }
  };

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: Math.max(1, Math.floor(value)), // Ensure whole numbers
    });
  };

  // Handle increment/decrement quantity
  const handleQuantityAdjust = (id, increment) => {
    const currentValue = quantities[id] || 0;
    const newValue = increment
      ? currentValue + 1
      : Math.max(1, currentValue - 1);
    setQuantities({
      ...quantities,
      [id]: newValue,
    });
  };

  // Get selected items
  const selectedItems = items.filter((item) => item.selected);

  // Calculate total quantity as whole number
  const totalQuantity = selectedItems.reduce((sum, item) => {
    return sum + (quantities[item.id] || 1);
  }, 0);

  // Handle bulk item
  const handleAddBulkItems = () => {
    if (selectedItems.length === 0) return;

    // Remove items with empty item_id
    const filteredItems = formik.values.line_items.filter(
      (item) => item.item_id
    );

    // Convert existing items to a Set for quick lookup
    const existingItemIds = new Set(filteredItems.map((item) => item.item_id));

    // Create new items and filter out duplicates
    const newItems = selectedItems
      .filter((item) => item.id && !existingItemIds.has(item.id)) // Exclude duplicates and empty ids
      .map((item) => ({
        item_id: item.id,
        quantity: quantities[item.id],
        rate: item.rate || 0,
        amount: quantities[item.id] * (item.rate || 0),
        name: item.name,
      }));

    // Update formik with the cleaned list
    formik.setFieldValue("line_items", [...filteredItems, ...newItems]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "4px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          m: 2,
          // height: '590px' // Increased overall container height
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={2}
        sx={{ height: "60px" }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "medium",
            color: "#000",
            fontSize: "18px",
          }}
        >
          Add Items in Bulk
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#ff0000",
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Content Container */}
      <Box sx={{ display: "flex", height: "450px" }}>
        {" "}
        {/* Increased height */}
        {/* Left Panel - Items List */}
        <Box
          sx={{
            width: "55%",
            borderRight: "1px solid #e0e0e0",
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            fullWidth
            placeholder="Type to search or scan the barcode of the item"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                // borderRadius: '4px',
                border: "1px solid #80b2f8",
                fontSize: "14px",
              },
              // border:"1px solid #80b2f8",
            }}
          />

          {/* Items List */}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            {filteredItems.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                onClick={() => handleSelectItem(item.id)}
                sx={{
                  mb: 1,
                  backgroundColor: item.selected ? "#f5f5f5" : "white",
                  borderRadius: "4px",
                  position: "relative",
                  p: 1.5,
                  cursor: "pointer",
                  height: "65px", // Reduced the individual item height
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    "& .itemText": {
                      color: "#2196f3",
                    },
                    "& .rateText": {
                      color: "#2196f3",
                    },
                    "& .stockText": {
                      color: "#2196f3",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      className="itemText"
                      variant="body1"
                      sx={{
                        fontSize: "14px",
                        fontWeight: item.selected ? "medium" : "normal",
                        color: item.selected ? "#4382ff" : "inherit",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      className="rateText"
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: item.selected ? "#4382ff" : "text.secondary",
                      }}
                    >
                      Rate: {item.rate}
                    </Typography>
                  </Box>

                  {item.stock && (
                    <Box textAlign="right" sx={{ minWidth: "120px" }}>
                      <Typography
                        className="stockText"
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          color: item.selected ? "#2196f3" : "text.secondary",
                        }}
                      >
                        Stock on Hand
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          color: item.selected ? "#2196f3" : "#4caf50",
                        }}
                        className="stockText"
                      >
                        {item.stock.amount} {item.stock.unit}
                      </Typography>
                    </Box>
                  )}

                  {item.selected && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 16, // Added padding
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 1, // Added padding around the icon
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          color: "#22dd2e",
                          fontSize: "22px",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
        {/* Right Panel - Selected Items */}
        <Box sx={{ width: "55%", display: "flex", flexDirection: "column" }}>
          <Box
            px={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            my={1}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontSize: "16px" }}>
                Selected Items
              </Typography>
              {/* <Chip
                label={selectedItems.length}
                size="small"
                sx={{
                  ml: 1,
                  borderRadius: '50%',
                  height: '15px',
                  width: '15px',
                  backgroundColor: 'none !important',
                  "& .MuiChip-root":{
                    backgroundColor:"transaparent !important"
                  },
                  color: '#757575'
                }}
              /> */}
              <Box sx={{ mx: 2 }}>{selectedItems.length}</Box>
            </Box>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              Total Quantity: {totalQuantity}
            </Typography>
          </Box>
          <Divider />

          {/* Selected Items List */}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1, // Reduced vertical padding
                    pl: 1,
                    pr: 2,
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="body1" sx={{ fontSize: "14px" }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityAdjust(item.id, false)}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        width: "28px",
                        height: "28px",
                        padding: 0,
                        color: "#2196f3",
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      value={quantities[item.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      variant="outlined"
                      size="small"
                      inputProps={{
                        style: {
                          textAlign: "center",
                          padding: "2px",
                          width: "30px",
                          border: "0px",
                        },
                      }}
                      sx={{ mx: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityAdjust(item.id, true)}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        width: "28px",
                        height: "28px",
                        padding: 0,
                        color: "#2196f3",
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 6,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ fontSize: "14px" }}
                >
                  Click the item names from the left pane to select them
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />

          {/* Buttons */}
          <Box
            sx={{ m: 2, display: "flex", justifyContent: "flex-start", gap: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleAddBulkItems}
              color="primary"
              disabled={selectedItems.length === 0}
              sx={{ textTransform: "none", borderRadius: "4px" }}
            >
              Add Items
            </Button>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: "4px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
