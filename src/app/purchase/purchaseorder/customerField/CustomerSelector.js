"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  ClickAwayListener,
  Dialog,
  DialogContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import apiService from "../../../../services/axiosService";
import CustomerForm from "../../../sales/customer/create/page";
import Button from "../../../common/btn/Button";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const CustomerSelector = ({ details, callAPI, formik }) => {
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);

  const organization_id = localStorage.getItem("organization_id");

  // Set selected customer if details are provided
  useEffect(() => {
    if (details) {
      setSelectedCustomer({
        id: details.contact_id,
        name: details.contact_name || details.customer_name,
        email: details.contact_email || details.primary_email,
      });
    }
  }, [details]);

  // Fetch Customers from API
  useEffect(() => {
    if (customerDropdownOpen) {
      fetchCustomers();
    }
  }, [customerDropdownOpen]);

  // Fetch customers with search query
  useEffect(() => {
    if (customerDropdownOpen && searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        fetchCustomers();
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Properly format the URL without line breaks
      let url = `api/v1/customers?filter_by=Status.All&page=1&per_page=50&sort_column=contact_name&sort_order=A&organization_id=${organization_id}`;

      if (searchQuery.trim()) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }

      const response = await apiService({
        method: "GET",
        url: url,
      });

      // Check if response has data and proper structure
      if (response.data && response.data.data) {
        setCustomers(response.data.data);
      } else {
        console.log("Customer data structure:", response);
        setCustomers([]); // Clear or initialize customers
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]); // Clear customers on error
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleClickAway = () => {
    setCustomerDropdownOpen(false);
  };

  const handleNewCustomer = () => {
    setShowCustomerForm(true);
    setCustomerDropdownOpen(false);
  };

  const handleSelectCustomer = (customer) => {
    formik.setFieldValue("customer_id", customer._id);
    formik.setFieldValue("addressType", "Customer");
    setSelectedCustomer(customer);
    setCustomerDropdownOpen(false);
    // Call API with the new customer ID
    if (callAPI && customer?.id) {
      callAPI(customer.id);
    }
  };

  const handleBackFromCustomerForm = () => {
    setShowCustomerForm(false);
  };

  const handleCustomerCreated = (newCustomer) => {
    if (newCustomer) {
      setSelectedCustomer(newCustomer);
      if (callAPI && newCustomer?.id) {
        callAPI(newCustomer.id);
      }
    }
    setShowCustomerForm(false);
    fetchCustomers();
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (customerDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [customerDropdownOpen]);

  // Extract first letter for avatar display
  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Get display data with fallbacks for potentially missing properties
  const getDisplayData = (customer) => {
    return {
      name:
        customer.name ||
        customer.contact_name ||
        customer.customer_name ||
        "Unnamed Customer",
      email:
        customer.email ||
        customer.contact_email ||
        customer.primary_email ||
        "",
      id:
        customer.id ||
        customer.customer_id ||
        customer.contact_id ||
        `temp-${Math.random()}`,
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: "relative", width: "400px" }}>
          <Box
            onClick={() => setCustomerDropdownOpen(!customerDropdownOpen)}
            sx={{
              display: "flex",
              alignItems: "center",
              height: "35px",
              justifyContent: "space-between",
              border: "1px solid #c4c4c4",
              borderRadius: "4px",
              padding: "8px 14px",
              cursor: "pointer",
              backgroundColor: "white",
              "&:hover": {
                borderColor: "#666",
              },
            }}
          >
            <Typography sx={{ fontSize: "13px", color: "#666" }}>
              {selectedCustomer
                ? getDisplayData(selectedCustomer).name
                : "Select a Customer"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <KeyboardArrowDown
                sx={{
                  marginLeft: "5px",
                  marginRight: "20px",
                  fontSize: "20px",
                  color: "#666",
                  transform: customerDropdownOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease-in-out",
                }}
              />

              <Box>
                <IconButton
                  size="small"
                  sx={{
                    height: "35px",
                    width: "40px",
                    marginRight: -2,
                    borderRadius: "0 7px 7px 0",
                    backgroundColor: " #408dfb",
                    color: "white",
                    border: "1px solid",
                    borderColor: " #408dfb",
                    borderLeft: "none",
                    "&:hover": {
                      backgroundColor: "#3a7fe1", // Slightly darker
                      borderColor: "#3a7fe1",
                    },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {customerDropdownOpen && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                borderRadius: "4px",
                mt: 0.5,
                zIndex: 1000,
              }}
            >
              <Box sx={{ p: 1 }}>
                <TextField
                  inputRef={searchInputRef}
                  placeholder="Search"
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "4px",
                    },
                  }}
                />
              </Box>

              <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {loading ? (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography sx={{ fontSize: "13px" }}>
                      Loading...
                    </Typography>
                  </Box>
                ) : customers.length > 0 ? (
                  customers.map((customer, index) => {
                    const displayData = getDisplayData(customer);
                    return (
                      <Box
                        key={displayData.id}
                        onClick={() => handleSelectCustomer(customer)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "5px",
                          margin: "5px",
                          p: 1.2,
                          cursor: "pointer",
                          backgroundColor:
                            index === 0 ? "#4d90fe" : "transparent",
                          color: index === 0 ? "white" : "inherit",
                          "&:hover": {
                            backgroundColor:
                              index === 0 ? "#4d90fe" : "#f5f5f5",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            backgroundColor: index === 0 ? "#fff" : "#ddd",
                            color: index === 0 ? "#4d90fe" : "#666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1.5,
                            fontSize: "14px",
                          }}
                        >
                          {getInitial(displayData.name)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            sx={{ fontSize: "13px", fontWeight: "medium" }}
                          >
                            {displayData.name}
                          </Typography>
                          {displayData.email && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-block",
                                  width: "16px",
                                  height: "16px",
                                  mr: 0.5,
                                  "& svg": {
                                    width: "16px",
                                    height: "16px",
                                    fill: index === 0 ? "white" : "#666",
                                  },
                                }}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  color: index === 0 ? "white" : "#666",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  maxWidth: "250px",
                                }}
                              >
                                {displayData.email}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography sx={{ fontSize: "13px" }}>
                      No customers found
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box>
                <Box
                  onClick={handleNewCustomer}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderTop: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <AddIcon sx={{ fontSize: "16px", color: "#4d90fe", mr: 1 }} />
                  <Typography sx={{ fontSize: "13px", color: "#4d90fe" }}>
                    New Customer
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Full-page dialog for CustomerForm */}
          {showCustomerForm && (
            <Dialog
              open={showCustomerForm}
              onClose={handleBackFromCustomerForm}
              fullScreen
              sx={{
                "& .MuiDialog-paper": {
                  margin: 0,
                  width: "100%",
                  maxWidth: "100%",
                  height: "100%",
                  maxHeight: "none",
                  overflow: "hidden",
                },
              }}
            >
              <DialogContent sx={{ padding: 0 }}>
                <CustomerForm
                  onCustomerCreated={handleCustomerCreated}
                  onCancel={handleBackFromCustomerForm}
                />
              </DialogContent>
            </Dialog>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default CustomerSelector;
