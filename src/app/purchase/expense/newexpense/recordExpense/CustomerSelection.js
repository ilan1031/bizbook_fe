"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  FormHelperText,
  Paper,
  Popper,
  ClickAwayListener,
  Button,
  styled,
} from "@mui/material";
import apiService from "../../../../../services/axiosService";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { InputBase } from "@mui/material";
import config from "../../../../../services/config";
import { useTheme } from "@mui/material/styles";


const SearchInput = styled(InputBase)({
  width: "100%",
  padding: "8px 12px",
  fontSize: "13px",
  "& input": {
    padding: "0",
  },
});

const VendorSelect = ({ formik }) => {
  const [responseData, setResponseData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const theme = useTheme();

  const apiCall = async () => {
    try {
      const organization_id = localStorage.getItem("organization_id");
      let params = {
        method: "GET",
        url: `/api/v1/customers?organization_id=${organization_id}`,
      };
      let response = await apiService(params);

      if (response && response.data && response.data.data) {
        setResponseData(response.data.data);
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };
  const handleVendorDropdownToggle = (event) => {
    if (!isDataLoaded) {
      apiCall();
    }
    setAnchorEl(event.currentTarget);
    setVendorDropdownOpen(!vendorDropdownOpen);
  };

  const filteredVendors = responseData.filter(
    (vendor) =>
      vendor.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearVendor = (e) => {
    e.stopPropagation();
    formik.setFieldValue("customer_id", "");
    formik.setFieldValue("customer_Name", "");
    setCurrentVendor(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleVendorSelect = (vendor) => {
    formik.setFieldValue("customer_id", vendor._id);
    formik.setFieldValue("customer_Name", vendor.contact_name);
    setVendorDropdownOpen(false);
    setSearchTerm("");
    setCurrentVendor(vendor);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", Width: "100%" }}>
        <Typography sx={{ fontSize: "13px", minWidth: "160px" }}>
          Customer Name
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: `1px solid #c4c4c4`,
            borderRadius: "7px",
            height: "35px",
            position: "relative",
            backgroundColor: "white",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#408dfb",
              boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
            },
          }}
          onClick={handleVendorDropdownToggle}
        >
          <Box
            sx={{
              flex: 1,
              pl: 2,
              display: "flex",
              minWidth: "350px",
              alignItems: "center",
            }}
          >
            { formik.values.customer_Name ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontSize: "14px" }}>
                    {formik.values.customer_Name}
                  </Typography>
                  <IconButton size="small" onClick={handleClearVendor}>
                    <CancelIcon sx={{ fontSize: "1.1rem", color: "red" }} />
                  </IconButton>
                </Box>
              ) : (
                <Typography sx={{ color: "#66686b", fontSize: "13px" }}>
                  Select or add a Customer
                </Typography>
              )
            }
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            
            <IconButton
              sx={{
                height: "35px",
                width: "40px",
                borderRadius: "0 7px 7px 0",
                backgroundColor: "#408dfb",
                color: "white",
                border: "1px solid",
                borderColor: "#408dfb",
                borderLeft: "none",
                "&:hover": {
                  backgroundColor: "#3a7fe1",
                  borderColor: "#3a7fe1",
                },
              }}
            >
              <SearchIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>

          <Popper
            open={vendorDropdownOpen}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ width: anchorEl?.offsetWidth, zIndex: 10 }}
          >
            <ClickAwayListener onClickAway={() => setVendorDropdownOpen(false)}>
              <Paper
                elevation={3}
                sx={{
                  width: "100%",
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                }}
              >
                {/* Search Bar */}
                <Box sx={{ p: 1, borderBottom: "1px solid #eee" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      borderRadius: "7px",
                    }}
                  >
                    <SearchIcon sx={{ color: "#66686b", fontSize: "1.1rem" }} />
                    <SearchInput
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </Box>
                </Box>

                {/* Customer List */}
                
                <Box sx={{ mb: 5.5 }}>
                  {filteredVendors.map((vendor) => (
                    <MenuItem
                      key={vendor._id}
                      onClick={() => handleVendorSelect(vendor)}
                      sx={{
                        fontSize: "14px",
                        color: "#66686b",
                        fontStyle: "normal",
                        padding: "10px 16px",
                        borderBottom: "1px solid #eee",
                        "&:hover": { bgcolor: "#f0f7ff" },
                        maxWidth: "380px",
                        overflow: "hidden",
                      }}
                      style={{ fontSize: "13px" }}
                    >
                      {/* Vendor Item with Avatar and Details */}
                      <Box sx={{ display: "flex", width: "100%" }}>
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#eeeeee",
                            color: "#4d90fe",
                            marginTop: "2px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1.5,
                            fontSize: "14px",
                          }}
                        >
                          {vendor.contact_name?.charAt(0) || "V"}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{ fontWeight: "bold", fontSize: "13px" }}
                          >
                            {vendor.contact_name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#66686b",
                                fontSize: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <EmailOutlinedIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                              />{" "}
                              {vendor.email}
                            </Typography>
                            {vendor.company_name && (
                              <>
                                <Box
                                  component="span"
                                  sx={{ mx: 0.5, color: "#66686b" }}
                                >
                                  |
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#66686b",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {vendor.company_name}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Box>

                {/* New Vendor Option */}

                <Box
                  sx={{
                    fontSize: "14px",
                    color: "#66686b",
                    fontStyle: "normal",
                    padding: "10px 16px",
                    borderBottom: "1px solid #eee",
                    "&:hover": { bgcolor: "#f0f7ff" },
                    color: "#408dfb",
                    position: "fixed",
                    bottom: 0,
                    bgcolor: "white",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AddIcon sx={{ mr: 1, fontSize: "1.1rem" }} />
                    <Typography sx={{ fontSize: "14px" }}>
                      New Vendor
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>
      </Box>
    </Box>
  );
};

export default VendorSelect;
