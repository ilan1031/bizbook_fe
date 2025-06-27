import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Divider,
  Checkbox,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import moment from "moment";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import DotLoader from "../../../components/DotLoader";
import { useSnackbar } from "../../../components/SnackbarProvider";

export default function ExportModal({ open, onClose, moduleName }) {
  const [module, setModule] = useState(moduleName || "Sales Orders");
  const [status, setStatus] = useState("All");
  const [exportOption, setExportOption] = useState("All Sales Orders");
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [exportTemplate, setExportTemplate] = useState("");
  const [decimalFormat, setDecimalFormat] = useState("12345678.9");
  const [fileFormat, setFileFormat] = useState("CSV (Comma Separated Value)");
  const [includePII, setIncludePII] = useState(false);
  const [password, setPassword] = useState("");
  const [pageLoad, setPageLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const organization_id = localStorage.getItem("organization_id");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const { showMessage } = useSnackbar();

  // Map frontend modules to backend entity names
  const moduleToEntityMap = {
    "Recurring Expense": "Recurring Expense",
    "Sales Orders": "salesorder",
    "Purchase Orders": "purchaseorder",
    "Payment Received": "paymentreceived",
    Expenses: "Expense",
    Quotes: "quotes",
    Invoices: "invoices",
    "Recurring Invoices": "recurringinvoices",
    Payment: "Payment",
    "Invoice Payments": "invoicepayments",
    "Delivery Challans": "deliverychallan",
    Bills: "bill",
    "Bill Payments": "billpayments",
    "Vendor Credits": "vendorcredits",
    "Items" : "items",
    "Customers" : "customers",
    "Vendors" : "vendors",
    "Recurring Bills" : "recurringBills"
  };

  // Categorize modules by their API endpoint
  const salesModules = [
    "Sales Orders",
    "Quotes",
    "Invoices",
    "Invoice Payments",
    "Delivery Challans",
    "Recurring Invoices",
    "Payment Received",
  ];

  const purchaseModules = [
    "Recurring Expense",
    "Purchase Orders",
    "Expenses",
    "Bills",
    "Bill Payments",
    "Payment",
    "Vendor Credits",
    "Recurring Bills",
  ];

  const othersModule = ["Customers", "Vendors", "Items"];

  // Map file format selections to accepted format strings
  const fileFormatMap = {
    "CSV (Comma Separated Value)": "csv",
    "XLS (Microsoft Excel 1997-2004 Compatible)": "xls",
    "XLSX (Microsoft Excel)": "xlsx",
  };

  // Update modal title based on selected module
  const getModalTitle = () => {
    return `Export ${module}`;
  };

  // Get filter criteria options based on selected module
  const getFilterCriteriaOptions = () => {
    if (module === "Sales Orders") {
      return ["date"];
    } else if (module === "Purchase Orders") {
      return ["date"];
    } else if (module === "Payment Received") {
      return ["date"];
    } else if (module === "Expense") {
      return ["date"];
    } else if (module === "Bills") {
      return ["billDate"];
    } else if (module === "Payment") {
      return ["date"];
    } else if (module === "Invoices") {
      return ["date"];
    } else if (module === "Recurring Invoices") {
      return ["dat e"];
    } else if (module === "Quotes") {
      return ["date"];
    } else if (module === "Delivery Challans") {
      return ["date"];
    } else if (module === "Recurring Expense") {
      return ["date"];
    }
    // Default fallback
    return ["date"];
  };

  // Determine which API endpoint to use based on the selected module
  const getApiEndpoint = () => {
    if (salesModules.includes(module)) {
      return "/api/v1/sales/export";
    } else if (purchaseModules.includes(module)) {
      return "/api/v1/purchase/export";
    } else if (othersModule.includes(module)) {
      return "/api/v1/common/export";
    }
    // Default fallback
    return "/api/v1/sales/export";
  };

  // Determine which base URL to use based on the selected module
  const getBaseUrl = () => {
    if (salesModules.includes(module)) {
      return config.SO_Base_url;
    } else if (purchaseModules.includes(module)) {
      return config.PO_Base_url;
    } else if (othersModule.includes(module)) {
      return config.apiBaseUrl;
    }
    // Default fallback
    return config.SO_Base_url;
  };

  // Update filter criteria when module changes
  useEffect(() => {
    const options = getFilterCriteriaOptions();
    if (options.length > 0) {
      setFilterCriteria(options[0]);
    }
  }, [module]);

  const handleExportOptionChange = (event) => {
    setExportOption(event.target.value);
  };

  const handleModuleMenuOpen = () => {
    setModuleMenuOpen(true);
  };

  const handleModuleMenuClose = () => {
    setModuleMenuOpen(false);
  };

  const handleStatusMenuOpen = () => {
    setStatusMenuOpen(true);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuOpen(false);
  };

  const handleStatusSelect = (value) => {
    setStatus(value);
    setStatusMenuOpen(false);
  };

  const handleModuleSelect = (value) => {
    setPageLoad(true);
    setModule(value);
    setModuleMenuOpen(false);

    // Reset export option to default when module changes
    if (value === "Sales Orders") {
      setExportOption("All Sales Orders");
    } else if (value === "Purchase Orders") {
      setExportOption("All Purchase Orders");
    } else if (value === "Expenses") {
      setExportOption("All Expenses");
    } else {
      setExportOption(`All ${value}`);
    }
    setTimeout(() => {
      setPageLoad(false);
    }, 2000);
  };

  const handleFilterCriteriaChange = (event) => {
    setFilterCriteria(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleExport = async () => {
    // Validate required fields
    if (!module) {
      showMessage("Please select a module to export", "error");
      return;
    }

    if (exportOption === "Specific Period" && (!fromDate || !toDate)) {
      showMessage(
        "Please select a date range for specific period export",
        "error"
      );
      return;
    }

    const isOneDateMissing = Boolean(fromDate) !== Boolean(toDate);
    if (isOneDateMissing) {
      showMessage("Please select a valid date range", "error");
      return;
    }

    try {
      setLoading(true);

      // Determine which API endpoint and base URL to use
      const apiEndpoint = getApiEndpoint();
      const baseUrl = getBaseUrl();

      // Prepare the export request payload
      const payload = {
        entity: moduleToEntityMap[module],
        accept: fileFormatMap[fileFormat],
        status: status.toLowerCase(), // Default to all statuses
        organization_id: organization_id,
      };

      // Add date range if specific period is selected
      if (exportOption === "Specific Period") {
        // Format dates to YYYY-MM-DD
        payload.from_date = moment(fromDate).format("YYYY-MM-DD");
        payload.to_date = moment(toDate).format("YYYY-MM-DD");
        payload.column_name = filterCriteria; // Add the filter criteria
      }

      // Special handling for Invoices, Quotes, and Recurring Invoices
      if (["Invoices", "Quotes", "Recurring Invoices"].includes(module)) {
        payload.status = status.toLowerCase();
        if (fromDate?.trim() !== "" && toDate?.trim() !== "") {
          payload.from_date = moment(fromDate).format("YYYY-MM-DD");
          payload.to_date = moment(toDate).format("YYYY-MM-DD");
          payload.column_name = filterCriteria;
        }
      }

      console.log("Making export request:", { apiEndpoint, baseUrl, payload });

      // Make the API request
      const response = await apiService({
        method: "post",
        url: apiEndpoint,
        data: payload,
        responseType: "blob", // Important for file download
        customBaseUrl: baseUrl,
        file: false,
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;

      // Determine file extension based on format
      const fileExtension = fileFormatMap[fileFormat];
      link.setAttribute(
        "download",
        `${module.replace(/\s+/g, "_")}_export.${fileExtension}`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Close the modal after successful export
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      setSnackbar({
        open: true,
        message: `Export failed: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {pageLoad ? (
          <Box sx={{ height: "300px", py: 2 }}>
            <DotLoader />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                backgroundColor: "#f9f9fb",
                py: 1.4,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#3a3a3a", fontWeight: 500, fontSize: "18px" }}
              >
                {getModalTitle()}
              </Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon sx={{ color: "#EF5364" }} />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: 3, pt: 1.5 }}>
              <Alert
                severity="info"
                icon={
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#2684FF",
                    }}
                  >
                    <InfoIcon fontSize="15px" />
                  </Box>
                }
                sx={{
                  mb: 3,
                  backgroundColor: "#F0F7FF",
                  color: "#333",
                  border: "none",
                  borderRadius: 1,
                  "& .MuiAlert-message": { fontSize: "12px" },
                }}
              >
                You can export your data from Zoho Books in CSV, XLS or XLSX
                format.
              </Alert>

              <Box sx={{ mb: 3 }}>
                <Typography
                  component="label"
                  htmlFor="module-select"
                  sx={{
                    display: "block",
                    mb: 1,
                    color: "#f44",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Module
                  <span style={{ color: "#f44", marginLeft: "2px" }}>*</span>
                </Typography>

                <Box sx={{ position: "relative" }}>
                  <FormControl fullWidth>
                    <Select
                      id="module-select"
                      value={module}
                      open={moduleMenuOpen}
                      onOpen={handleModuleMenuOpen}
                      onClose={handleModuleMenuClose}
                      IconComponent={ExpandMoreIcon}
                      sx={{
                        width: "300px",
                        borderRadius: "6px",
                        height: "40px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#aaa",
                        },
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                        },
                      }}
                      renderValue={(value) => (
                        <Typography sx={{ fontSize: "13px" }}>
                          {value}
                        </Typography>
                      )}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            overflowY: "hidden",
                          },
                        },
                      }}
                    >
                      <Box sx={{ p: 1 }}>
                        <TextField
                          placeholder="Search"
                          size="small"
                          fullWidth
                          sx={{ mb: 1 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon
                                  fontSize="small"
                                  sx={{ color: "#aaa" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Box sx={{ maxHeight: "187px", overflow: "auto" }}>
                        {/* Sales section */}
                        <Typography
                          sx={{
                            px: 2,
                            py: 0.5,
                            color: "#011",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Sales
                        </Typography>
                        <MenuItem
                          value="Quotes"
                          onClick={() => handleModuleSelect("Quotes")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Quotes"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Quotes
                          {module === "Quotes" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Sales Orders"
                          onClick={() => handleModuleSelect("Sales Orders")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Sales Orders"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Sales Orders
                          {module === "Sales Orders" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Recurring Invoices"
                          onClick={() =>
                            handleModuleSelect("Recurring Invoices")
                          }
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Recurring Invoices"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Recurring Invoices
                          {module === "Recurring Invoices" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Invoices"
                          onClick={() => handleModuleSelect("Invoices")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Invoices"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Invoices
                          {module === "Invoices" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Payment Received"
                          onClick={() => handleModuleSelect("Payment Received")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Payment Received"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Payment Received
                          {module === "Payment Received" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Delivery Challans"
                          onClick={() =>
                            handleModuleSelect("Delivery Challans")
                          }
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Delivery Challans"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Delivery Challans
                          {module === "Delivery Challans" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>

                        {/* Purchase section */}
                        <Typography
                          sx={{
                            px: 2,
                            py: 0.5,
                            color: "#000",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Purchase
                        </Typography>
                        <MenuItem
                          value="Expenses"
                          onClick={() => handleModuleSelect("Expenses")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Expenses"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Expenses
                          {module === "Expenses" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Payment"
                          onClick={() => handleModuleSelect("Payment")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Payment"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Payment
                          {module === "Payment" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Purchase Orders"
                          onClick={() => handleModuleSelect("Purchase Orders")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Purchase Orders"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Purchase Orders
                          {module === "Purchase Orders" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Bills"
                          onClick={() => handleModuleSelect("Bills")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Bills"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Bills
                          {module === "Bills" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <Typography
                          sx={{
                            px: 2,
                            py: 0.5,
                            color: "#000",
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Others
                        </Typography>
                        <MenuItem
                          value="Customers"
                          onClick={() => handleModuleSelect("Customers")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Customers"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Customers
                          {module === "Customers" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Vendors"
                          onClick={() => handleModuleSelect("Vendors")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Vendors"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Vendors
                          {module === "Vendors" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                        <MenuItem
                          value="Items"
                          onClick={() => handleModuleSelect("Items")}
                          sx={{
                            fontSize: "13px",
                            py: 0.8, // Decreased height
                            "&:hover": {
                              backgroundColor: "#4285f4",
                              color: "white",
                            },
                            ...(module === "Items"
                              ? {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                }
                              : {}),
                          }}
                        >
                          Items
                          {module === "Items" && (
                            <Box sx={{ ml: "auto" }}>
                              <CheckIcon fontSize="small" />
                            </Box>
                          )}
                        </MenuItem>
                      </Box>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              {(module === "Invoices" ||
                module === "Quotes" ||
                module === "Recurring Invoices") && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    component="label"
                    htmlFor="module-select"
                    sx={{
                      display: "block",
                      mb: 1,
                      color: "#f44",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    Select Status
                    <span style={{ color: "#f44", marginLeft: "2px" }}>*</span>
                  </Typography>

                  <Box sx={{ position: "relative" }}>
                    <FormControl fullWidth>
                      <Select
                        id="module-select"
                        value={status}
                        open={statusMenuOpen}
                        onOpen={handleStatusMenuOpen}
                        onClose={handleStatusMenuClose}
                        IconComponent={ExpandMoreIcon}
                        sx={{
                          width: "300px",
                          borderRadius: "6px",
                          height: "40px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#ccc",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#aaa",
                          },
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                          },
                        }}
                        renderValue={(value) => (
                          <Typography sx={{ fontSize: "13px" }}>
                            {value}
                          </Typography>
                        )}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              overflowY: "hidden",
                            },
                          },
                        }}
                      >
                        <Box sx={{ p: 1 }}>
                          <TextField
                            placeholder="Search"
                            size="small"
                            fullWidth
                            sx={{ mb: 1 }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon
                                    fontSize="small"
                                    sx={{ color: "#aaa" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Box sx={{ maxHeight: "187px", overflow: "auto" }}>
                          <MenuItem
                            value="All"
                            onClick={() => handleStatusSelect("All")}
                            sx={{
                              fontSize: "13px",
                              py: 0.8, // Decreased height
                              "&:hover": {
                                backgroundColor: "#4285f4",
                                color: "white",
                              },
                              ...(status === "All"
                                ? {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  }
                                : {}),
                            }}
                          >
                            All
                            {status === "All" && (
                              <Box sx={{ ml: "auto" }}>
                                <CheckIcon fontSize="small" />
                              </Box>
                            )}
                          </MenuItem>
                          {(module === "Invoices" ||
                            module === "Quotes" ||
                            module === "Recurring Invoices") && (
                            <>
                              <MenuItem
                                value="Draft"
                                onClick={() => handleStatusSelect("Draft")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Draft"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Draft
                                {status === "Draft" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Pending Approval"
                                onClick={() =>
                                  handleStatusSelect("Pending Approval")
                                }
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Pending Approval"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Pending Approval
                                {status === "Pending Approval" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Approved"
                                onClick={() => handleStatusSelect("Approved")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Approved"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Approved
                                {status === "Approved" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Sent"
                                onClick={() => handleStatusSelect("Sent")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Sent"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Sent
                                {status === "Sent" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                            </>
                          )}
                          {module === "Quotes" && (
                            <>
                              <MenuItem
                                value="Invoiced"
                                onClick={() => handleStatusSelect("Invoiced")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Invoiced"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Invoiced
                                {status === "Invoiced" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Accepted"
                                onClick={() => handleStatusSelect("Accepted")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Accepted"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Accepted
                                {status === "Accepted" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Expired"
                                onClick={() => handleStatusSelect("Expired")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Expired"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Expired
                                {status === "Expired" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                            </>
                          )}
                          {(module === "Invoices" || module === "Quotes") && (
                            <MenuItem
                              value="Rejected"
                              onClick={() => handleStatusSelect("Rejected")}
                              sx={{
                                fontSize: "13px",
                                py: 0.8, // Decreased height
                                "&:hover": {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                },
                                ...(status === "Rejected"
                                  ? {
                                      backgroundColor: "#4285f4",
                                      color: "white",
                                    }
                                  : {}),
                              }}
                            >
                              Rejected
                              {status === "Rejected" && (
                                <Box sx={{ ml: "auto" }}>
                                  <CheckIcon fontSize="small" />
                                </Box>
                              )}
                            </MenuItem>
                          )}
                          {module === "Quotes" && (
                            <MenuItem
                              value="Declined"
                              onClick={() => handleStatusSelect("Declined")}
                              sx={{
                                fontSize: "13px",
                                py: 0.8, // Decreased height
                                "&:hover": {
                                  backgroundColor: "#4285f4",
                                  color: "white",
                                },
                                ...(status === "Declined"
                                  ? {
                                      backgroundColor: "#4285f4",
                                      color: "white",
                                    }
                                  : {}),
                              }}
                            >
                              Declined
                              {status === "Declined" && (
                                <Box sx={{ ml: "auto" }}>
                                  <CheckIcon fontSize="small" />
                                </Box>
                              )}
                            </MenuItem>
                          )}

                          {module === "Invoices" && (
                            <>
                              <MenuItem
                                value="Paid"
                                onClick={() => handleStatusSelect("Paid")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Paid"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Paid
                                {status === "Paid" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Overdue"
                                onClick={() => handleStatusSelect("Overdue")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Overdue"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Overdue
                                {status === "Overdue" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Void"
                                onClick={() => handleStatusSelect("Void")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Void"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Void
                                {status === "Void" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                              <MenuItem
                                value="Unpaid"
                                onClick={() => handleStatusSelect("Unpaid")}
                                sx={{
                                  fontSize: "13px",
                                  py: 0.8, // Decreased height
                                  "&:hover": {
                                    backgroundColor: "#4285f4",
                                    color: "white",
                                  },
                                  ...(status === "Unpaid"
                                    ? {
                                        backgroundColor: "#4285f4",
                                        color: "white",
                                      }
                                    : {}),
                                }}
                              >
                                Unpaid
                                {status === "Unpaid" && (
                                  <Box sx={{ ml: "auto" }}>
                                    <CheckIcon fontSize="small" />
                                  </Box>
                                )}
                              </MenuItem>
                            </>
                          )}
                        </Box>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              )}

              {module !== "Invoices" && module !== "Quotes" && (
                <>
                  <Box sx={{ mb: 3, ml: 0.5 }}>
                    <RadioGroup
                      value={exportOption}
                      onChange={handleExportOptionChange}
                    >
                      <FormControlLabel
                        value={`All ${module}`}
                        control={
                          <Radio
                            size="small"
                            sx={{
                              color: "#4285f4",
                              "&.Mui-checked": {
                                color: "#4285f4",
                              },
                              p: 0.5,
                              mr: 1,
                              marginLeft: "5px",
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: "13px", color: "#333" }}>
                            All {module}
                          </Typography>
                        }
                        sx={{ mb: 1 }}
                      />
                      <FormControlLabel
                        value="Specific Period"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              color: "#4285f4",
                              "&.Mui-checked": {
                                color: "#4285f4",
                              },
                              p: 0.5,
                              mr: 1,
                              marginLeft: "5px",
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: "13px", color: "#333" }}>
                            Specific Period
                          </Typography>
                        }
                      />
                    </RadioGroup>
                  </Box>
                </>
              )}

              {/* Date range fields for Specific Period */}
              {exportOption === "Specific Period" && (
                <>
                  <Box
                    sx={{
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <TextField
                      placeholder="dd/MM/yyyy"
                      value={fromDate}
                      type="date"
                      onChange={(e) => setFromDate(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          "& fieldset": {
                            borderColor: "#ccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#aaa",
                          },
                        },
                      }}
                    />
                    <Box sx={{ color: "#666" }}>-</Box>
                    <TextField
                      placeholder="dd/MM/yyyy"
                      value={toDate}
                      type="date"
                      onChange={(e) => setToDate(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          "& fieldset": {
                            borderColor: "#ccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#aaa",
                          },
                        },
                      }}
                    />
                  </Box>

                  {module !== "Customers" &&
                    module !== "Vendors" &&
                    module !== "Items" && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          sx={{
                            mb: 1,
                            fontSize: "13px",
                            color: "#f44",
                            fontWeight: 500,
                          }}
                        >
                          Filter Criteria
                          <span style={{ color: "#f44", marginLeft: "2px" }}>
                            *
                          </span>
                        </Typography>
                        <RadioGroup
                          value={filterCriteria}
                          onChange={handleFilterCriteriaChange}
                        >
                          {getFilterCriteriaOptions().map((option) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={
                                <Radio
                                  size="small"
                                  sx={{
                                    color: "#4285f4",
                                    "&.Mui-checked": {
                                      color: "#4285f4",
                                    },
                                    p: 0.5,
                                    mr: 1,
                                    marginLeft: "5px",
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  sx={{ fontSize: "13px", color: "#333" }}
                                >
                                  {option}
                                </Typography>
                              }
                            />
                          ))}
                        </RadioGroup>
                      </Box>
                    )}
                  {/* Filter Criteria section - only shown for Specific Period */}
                </>
              )}

              {(module === "Invoices" || module === "Quotes") && (
                <>
                  <Typography
                    component="label"
                    htmlFor="module-select"
                    sx={{
                      display: "block",
                      mb: 1,
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    Date Range
                  </Typography>
                  <Box
                    sx={{
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <TextField
                      placeholder="dd/MM/yyyy"
                      value={fromDate}
                      type="date"
                      onChange={(e) => setFromDate(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          "& fieldset": {
                            borderColor: "#ccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#aaa",
                          },
                        },
                      }}
                    />
                    <Box sx={{ color: "#666" }}>-</Box>
                    <TextField
                      placeholder="dd/MM/yyyy"
                      value={toDate}
                      type="date"
                      onChange={(e) => setToDate(e.target.value)}
                      sx={{
                        color: "#aaa",
                        "& .MuiOutlinedInput-root": {
                          height: "40px",
                          "& fieldset": {
                            borderColor: "#ccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#aaa",
                          },
                        },
                      }}
                    />
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    mb: 1,
                    fontSize: "13px",
                    color: "#f44",
                    fontWeight: 500,
                  }}
                >
                  Export File Format
                  <span style={{ color: "#f44", marginLeft: "2px" }}>*</span>
                </Typography>
                <RadioGroup
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                >
                  <FormControlLabel
                    value="CSV (Comma Separated Value)"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#4285f4",
                          "&.Mui-checked": {
                            color: "#4285f4",
                          },
                          p: 0.5,
                          mr: 1,
                          marginLeft: "5px",
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "13px", color: "#333" }}>
                        CSV (Comma Separated Value)
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    value="XLS (Microsoft Excel 1997-2004 Compatible)"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#4285f4",
                          "&.Mui-checked": {
                            color: "#4285f4",
                          },
                          p: 0.5,
                          mr: 1,
                          marginLeft: "5px",
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "13px", color: "#333" }}>
                        XLS (Microsoft Excel 1997-2004 Compatible)
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    value="XLSX (Microsoft Excel)"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#4285f4",
                          "&.Mui-checked": {
                            color: "#4285f4",
                          },
                          p: 0.5,
                          mr: 1,
                          marginLeft: "5px",
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "13px", color: "#333" }}>
                        XLSX (Microsoft Excel)
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>

              <Box sx={{ color: "#666", fontSize: "13px", mb: 3 }}>
                <Typography component="div" sx={{ fontSize: "13px" }}>
                  <span style={{ fontWeight: 500 }}>Note:</span>
                  <span style={{ marginLeft: "4px", color: "#6c718a" }}>
                    You can export only the first 25,000 rows. If you have more
                    rows, please initiate a backup for the data in your Zoho
                    Books organization, and download it.
                  </span>
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    position: "relative",
                  }}
                  onClick={handleExport}
                  disabled={loading}
                  className="button-submitadd"
                >
                  {loading ? (
                    <>
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ position: "absolute" }}
                      />
                      <span style={{ visibility: "hidden" }}>Export</span>
                    </>
                  ) : (
                    "Export"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={onClose}
                  className="bulk-update-btn"
                  sx={{
                    color: "#333",
                    textTransform: "none",
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </>
  );
}
