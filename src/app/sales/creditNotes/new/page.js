"use client";

import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import InvoiceItemTable from "../../itemTable";


const QuoteCreationPage = () => {
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, quantity: 1.0, rate: 0.0, amount: 0.0 },
  ]);
  const [quoteNumber, setQuoteNumber] = useState("QT-000004");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [taxType, setTaxType] = useState("tds");
  const router = useRouter();
  const handleRowClick = (customer) => {
    router.push(`/sales/quotes/${customer.key}`);
  };

  // Theme Constants
  const COLORS = {
    primary: "#408dfb",
    secondary: "#86b7fe",
    error: "#d32f2f",
    textPrimary: "#212121",
    textSecondary: "#666666",
  };

  // Common Interaction Styles
  const commonInteractionStyles = {
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: COLORS.primary,
        border: ".1px solid #408dfb",
        boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`, // 4D = 30% opacity
      },
    },
  };

  // Consolidated Common Input Style
  const commonInputStyle = {
    height: "35px",
    backgroundColor: "#fff",
    "& .MuiInputBase-input": {
      fontSize: "0.875rem",
      padding: "6px 12px",
    },
    "& .MuiOutlinedInput-root": {
      height: "35px",
      borderRadius: "7px",
      ...commonInteractionStyles["& .MuiOutlinedInput-root"],
    },
  };

  const helperTextStyle = {
    color: "text.secondary",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 1,
  };

  const formLabelStyle = {
    fontSize: "0.875rem",
    minWidth: "120px",
    whiteSpace: "nowrap",
    color: "error.main", // Red color for required fields
  };

  const formLabelBlackStyle = {
    ...formLabelStyle,
    color: "text.primary", // Using theme's primary text color
  };

  // Common Button Styles
  const commonButtonStyle = {
    ...formLabelBlackStyle, // Match formLabelBlackStyle
    fontFamily: "inherit",
    textTransform: "none",padding: "6px 10px", // Consistent padding
    lineHeight: 1.5,borderRadius: "7px",
    bgcolor: "rgba(71, 71, 71, 0.07)",
    borderColor: "rgba(78, 78, 78, 0.15)",
    "&:hover": {
      bgcolor: "rgba(71, 71, 71, 0.1)",
      borderColor: "rgba(24, 13, 13, 0.2)",
    }, minWidth: "auto", // Allow width to fit content
  };

  // Common textarea styles
  const commonTextareaStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "7px",
    // padding: "6px 12px",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    resize: "vertical",
    minHeight: "auto",
    lineHeight: "1.6",
    width: "100%",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#408dfb",
      boxShadow: "0 0 0 .7px #86b7fe",
    },
    "&:focus": {
      outline: "none",
      borderColor: "#408dfb",
      boxShadow: "0 0 0 0.2rem rgba(97, 160, 255, 0.3)",
    },
    "&::placeholder": {
      color: "#66686b",
      opacity: 1,
    },
    "&::-webkit-resizer": {
      display: "none",
    },
  };

  const commonTextareaInputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "vertical",
    background: "transparent",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    paddingTop: "5px",
    paddingLeft: "12px",
    marginBottom: "-5px",
    paddingBottom: "5px"
  };
  const menuItemStyle = {
    fontSize: "0.875rem",
    color: "#666666",
    fontStyle: "normal",
  };

  const searchButtonStyle = {
    height: "35px",
    width: "40px",
    borderRadius: "0 7px 7px 0",
    backgroundColor: "#408dfb",
    color: "white",
    border: "1px solid",
    borderColor: "primary.main",
    borderLeft: "none",
    "&:hover": {
      backgroundColor: "primary.dark",
      borderColor: "primary.dark",
    },
  };

  // Common Icon Styles
  const commonIconStyle = {
    fontSize: "1.2rem", // 16px
    color: "text.secondary",
  };

  // Form Control Style using Common Interactions
  const formControlStyle = {
    combinedWithButton: {
      width: "calc(100% - 40px)",
      height: "35px",
      backgroundColor: "#fff",
      "& .MuiOutlinedInput-root": {
        ...commonInputStyle["& .MuiOutlinedInput-root"], // Inherit base styles
        borderRadius: "7px",
        "& input": {
          color: "#66686b",
          cursor: "pointer",
          "&::placeholder": {
            color: "#66686b",
            fontSize: "0.92rem",
            opacity: 1,
          },
          '&:not([value=""])': {
            color: "inherit",
          },
        },
      },
    },
  };

  const formRowStyle = {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { md: "center" },
    gap: { xs: 0, md: 6 },
  };

  const SectionDivider = ({ sx }) => (
    <Box
      sx={{
        borderBottom: 0.5,
        borderColor: "divider",
        width: "100%",
        opacity: 0.5,
        my: 2,
        ...sx,
        ml: { xs: 2, md: 2 },
      }}
    />
  );

  const addNewRow = () => {
    const newItem = {
      id: quoteItems.length + 1,
      quantity: 1.0,
      rate: 0.0,
      amount: 0.0,
    };
    setQuoteItems([...quoteItems, newItem]);
  };

  const removeRow = (id) => {
    setQuoteItems(quoteItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = quoteItems.map((item) => {
      if (item.id === id) {
        const quantity = parseFloat(newQuantity) || 0;
        return { ...item, quantity, amount: quantity * item.rate };
      }
      return item;
    });
    setQuoteItems(updatedItems);
  };

  const handleRateChange = (id, newRate) => {
    const updatedItems = quoteItems.map((item) => {
      if (item.id === id) {
        const rate = parseFloat(newRate) || 0;
        return { ...item, rate, amount: item.quantity * rate };
      }
      return item;
    });
    setQuoteItems(updatedItems);
  };

  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
  };

  const handleSalespersonChange = (event) => {
    setSelectedSalesperson(event.target.value);
  };

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleTaxTypeChange = (event) => {
    setTaxType(event.target.value);
  };

  return (
    <Box
      sx={{
        overflowX: "hidden",
        // maxHeight: "90vh",
        // overflowY: "auto",
        backgroundColor: "#f6f6f6",
      }}
    >
      <form
     sx={{// maxHeight: "90vh",
        overflowY: "auto",}}
    >
      {/* Header */}
      <Grid
        container
        sx={{
          pr: 3,
          height: "70px",
          width: "100%",
          backgroundColor: "white",
          boxShadow: "0px 4px 4px rgba(29, 29, 29, 0.02)",
          px: 3, // Horizontal padding
          py: 1, // Vertical padding
        }}
      >
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">New creditNotes</Typography>
          <IconButton aria-label="Close" sx={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Customer Name Section */}
      <Grid
        container
        sx={{ px: 2, pb: 4, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
      >
        {/* Label */}
        <Grid item sx={formLabelStyle}>
          <Typography variant="subtitle2" sx={formLabelStyle}>
            Customer Name*
          </Typography>
        </Grid>

        {/* Combined Input + Search */}
        <Grid
          item
          sx={{
            display: "flex",
            width: "500px",
            flexShrink: 0,
          }}
        >
          <FormControl
            sx={{
              ...formControlStyle.combinedWithButton,
              "& .MuiOutlinedInput-root": {
                ...formControlStyle.combinedWithButton[
                  "& .MuiOutlinedInput-root"
                ],
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            }}
          >
            <TextField
              value={selectedCustomer || ""}
              placeholder="Select or add customer"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <KeyboardArrowDownOutlinedIcon sx={commonIconStyle} />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <IconButton sx={searchButtonStyle}>
            <SearchOutlinedIcon fontSize="medium" />
          </IconButton>
        </Grid>
      </Grid>

      <Box
        sx={{
          pr: 22,
          width: "100%",
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Quote Number Field */}
        <Grid
          container
          sx={{ px: 2, pt: 4, ...formRowStyle, flexWrap: "nowrap" }}
        >
          <Grid item sx={formLabelStyle}>
            <Typography variant="subtitle2" sx={formLabelStyle}>
              Quote#*
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
            <TextField
              fullWidth
              id="quoteNumber"
              value={quoteNumber}
              sx={commonInputStyle}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton sx={{ color: "primary.main", p: 0 }}>
                      <SettingsOutlinedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Reference Field */}
        <Grid
          container
          sx={{ px: 2, pt: 2, ...formRowStyle, flexWrap: "nowrap" }}
        >
          <Grid item sx={formLabelBlackStyle}>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Reference#
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
            <TextField fullWidth id="reference" sx={commonInputStyle} />
          </Grid>
        </Grid>

        {/* Date Fields */}
        <Grid container sx={{ px: 2, pt: 2, gap: 4 }}>
          {/* Quote Date */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", ...formRowStyle, flexWrap: "nowrap" }}
          >
            <Grid item sx={formLabelStyle}>
              <Typography variant="subtitle2" sx={formLabelStyle}>
                Quote Date*
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <TextField
                fullWidth
                id="quoteDate"
                value="05/03/2025"
                sx={commonInputStyle}
              />
            </Grid>
          </Grid>

          {/* Expiry Date */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", ...formRowStyle, flexWrap: "nowrap" }}
          >
            <Grid item sx={formLabelBlackStyle}>
              <Typography variant="subtitle2" sx={formLabelBlackStyle}>
                Expiry Date
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", width: "320px", flexShrink: 0 }}>
              <TextField
                fullWidth
                id="expiryDate"
                placeholder="dd/MM/yyyy"
                sx={commonInputStyle}
              />
            </Grid>
          </Grid>
        </Grid>
        <SectionDivider sx={{ my: 4 }} />

        {/* Salesperson */}
        <Grid container sx={{ px: 2, ...formRowStyle, flexWrap: "nowrap" }}>
          <Grid item sx={formLabelBlackStyle}>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Salesperson
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "360px", flexShrink: 0 }}>
            <FormControl sx={formControlStyle.combinedWithButton}>
              <TextField
                value={selectedCustomer || ""}
                placeholder="Select or Add Salesperson"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <KeyboardArrowDownOutlinedIcon sx={commonIconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Project Name */}
        <Grid
          container
          sx={{ px: 2, pt: 2, ...formRowStyle, flexWrap: "nowrap" }}
        >
          <Grid item sx={formLabelBlackStyle}>
            <Typography variant="subtitle2" sx={formLabelBlackStyle}>
              Project Name
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", width: "360px", flexShrink: 0 }}>
            <FormControl sx={formControlStyle.combinedWithButton}>
              <TextField
                value={selectedCustomer || ""}
                placeholder="Select a project"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <KeyboardArrowDownOutlinedIcon sx={commonIconStyle} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        <SectionDivider sx={{ my: 4 }} />
         {/* Subject */}
         <Grid container sx={{ ...formRowStyle, px: 2, mb: 3 }}>
          <Grid item xs={12} md={5} sx={formRowStyle}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pr: 6.19,
                position: "sticky",
                gap: 0,
                mb: { xs: 1, md: 0 },position: 'relative',
                zIndex: 1        
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  ...formLabelBlackStyle,
                  mr: -8,
                }}
              >
                Subject
              </Typography>
              <FontAwesomeIcon icon={faInfoCircle} sx={commonIconStyle} />
            </Box>
            <Box
              sx={{
                ...commonTextareaStyle,
                minWidth: "318px",
                "&:hover": commonTextareaStyle["&:hover"],
                "&:focus-within": commonTextareaStyle["&:focus"],
              }}
            >
              <TextareaAutosize
              id="subject"
                placeholder="Let your customer know what this Quote is for"
                minRows={1}
                style={{...commonTextareaInputStyle}}
              />
            </Box>
          </Grid>
        </Grid>

        <SectionDivider sx={{ my: 4 }} />
        <Box >
        <InvoiceItemTable />
      </Box>
      
      </Box>

      

      {/* Terms & Conditions and File Attachments */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        {/* Terms & Conditions */}
        <Grid item xs={6} sx={{ ml: 2 }}>
          <Typography variant="subtitle2"
                sx={{
                  ...formLabelBlackStyle,
                }}>Terms & Conditions</Typography>
                <Box
              sx={{
                ...commonTextareaStyle,
                minWidth: "318px",
                "&:hover": commonTextareaStyle["&:hover"],
                "&:focus-within": commonTextareaStyle["&:focus"],
              }}
            >
          <TextareaAutosize
            id="termsConditions"
            minRows={3}
            placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
            style={commonTextareaInputStyle}
          /></Box>
        </Grid>

        {/* Vertical Divider */}
        <Grid item>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: "rgba(78, 78, 78, 0.14)",
              height: "140px",
              mt: 1,
            }}
          />
        </Grid>

        {/* File Attachments */}
        <Grid item xs={5}>
          <Typography variant="body2" gutterBottom>
            Attach File(s) to Quote
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faUpload} />}
              sx={{ alignSelf: "flex-start",borderColor: '#cbd5e1', 
                color: '#475569',bgcolor: '#fff', 
                textTransform: 'none',
                borderStyle: 'dashed',
                height: '36px',
                px: 2 }}
            >
              Upload File
            </Button>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              You can upload a maximum of 5 files, 10MB each
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Additional Fields */}
      <Box
        sx={{
          pt: 2,
          height: "70px",
          width: "100%",
          position: "sticky",
          top: 0,borderTop:"1px solid #ddd",
          // boxShadow: "0px -4px 2px rgba(59, 59, 59, 0.03)",
          bgcolor: "white",
          alignItems: "center",
        }}
      >
        <Grid container sx={{ ml: 2, mr: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary",fontSize: "0.875rem", }}>
            <span style={{ fontWeight: "bold",fontSize: "0.875rem", }}>Additional Fields: </span>
            Start adding custom fields for your quotes by going to 
            <span style={{ fontWeight: "700",fontSize: "0.875rem", }}></span> Settings{" "}
            <span style={{ fontWeight: "700",fontSize: "0.875rem", }}>➔</span> Sales{" "}
            <span style={{ fontWeight: "700",fontSize: "0.875rem", }}>➔</span> Quotes.
          </Typography>
        </Grid>
      </Box>
      </form>

      {/* Action Buttons */}
      <Box
        sx={{
          // position: "Absolute",
          height: "70px",
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0px -4px 5px rgba(0, 0, 0, 0.06)",
          bgcolor: "white",
          alignItems: "center",
          padding: "0 16px",
          display: "flex",
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Button
              variant="outlined"
              sx={{
                ...commonButtonStyle,
                marginRight: "8px", // Individual override
              }}
              onClick={handleRowClick}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              sx={{
                ...commonButtonStyle,
                marginRight: "8px",
                color: "white",
                bgcolor: "#408dfb",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#408dfb",
                  boxShadow: "none",
                },
              }}
            >
              Save and Send
            </Button>
            <Button
              variant="outlined"
              sx={{
                ...commonButtonStyle,
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              <span style={formLabelBlackStyle}>
                Template:
              </span>
              <span style={{ ...formLabelBlackStyle,color: "gray" }}> &apos;Spreadsheet Template&apos; </span>
              <Button
                variant="text"
                sx={{  ...formLabelBlackStyle,color: "rgb(29, 127, 207)", textTransform: "none",ml:-4 }}
              >
                Change
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default QuoteCreationPage;
