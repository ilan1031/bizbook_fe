"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import theme from "../../theme";

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const StyledTextField = styled("input")(({ error }) => ({
  height: "35px",
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
  borderRadius: "4px",
  fontSize: "13px",
  backgroundColor: "#fff",
  "&:hover": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&:focus": {
    outline: "none",
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
  "&::placeholder": {
    color: COLORS.textSecondary,
    opacity: 1,
  },
}));

const ProjectSelector = ({ closeDropdown, onSelect, formik }) => {
  const [searchValue, setSearchValue] = useState("");
  const [salespersons, setSalespersons] = useState([]);
  const [filteredSalespersons, setFilteredSalespersons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const { salesperson_id, salesperson_name } = formik.values;

  const organizationId = localStorage.getItem("organization_id");
  // alert(organizationId);

  // Fetch all salespersons
  useEffect(() => {
    if (organizationId) {
      fetchSalespersons();
    }
  }, [organizationId]);

  useEffect(() => {
    if (salesperson_id) {
      onSelect({
        salesperson_id,
        salesperson_name,
      });
    }
  }, [salesperson_id]);

  const fetchSalespersons = async () => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/salesperson/getsalesperson`,
        params: {
          organization_id: organizationId,
        },
        customBaseUrl: config.SO_Base_url,
      });

      const { data } = response.data;

      // Set full list for dropdown use
      const formattedSalespersons = data.map((sp) => ({
        ...sp,
        salesperson_id: sp._id,
      }));

      setSalespersons(formattedSalespersons);
      setFilteredSalespersons(formattedSalespersons);
    } catch (error) {
      console.error("Failed to fetch salesperson data:", error);
      console.error("Failed to fetch salesperson data");
    }
  };

  // Filter salespersons by search value
  useEffect(() => {
    if (!salespersons || salespersons.length === 0) return;

    const results = salespersons.filter((sp) =>
      sp.salesperson_name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredSalespersons(results);
  }, [searchValue, salespersons]);

  const handleAddSalesperson = async () => {
    // alert(handleAddSalesperson);
    if (isEditMode) {
      await handleEditSalesperson();
      return;
    }

    try {
      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        console.error("Organization ID not found");
        return;
      }

      // Log request payload for debugging
      console.log("Adding salesperson with data:", {
        salesperson_name: formData.name,
        salesperson_email: formData.email,
        organization_id: organization_id,
      });

      const response = await apiService({
        method: "POST",
        url: `/api/v1/salesperson/new?organization_id=${organizationId}`,
        data: {
          salesperson_name: formData.name,
          salesperson_email: formData.email,
          organization_id: organization_id,
        },
        customBaseUrl: config.SO_Base_url,
      });

      console.log("API Response:", response);

      // Check if response is successful and contains data
      if (response.data && response.data.status === true) {
        // Extract the newly created salesperson data correctly
        const createdSp = response.data.salespersons;

        if (!createdSp) {
          console.error("No salesperson data returned from API");
          return;
        }

        console.log("Created salesperson:", createdSp);

        // Format the salesperson with consistent ID field
        const formattedSalesperson = {
          ...createdSp,
          salesperson_id: createdSp._id, // Ensure ID is consistent
          salesperson_name: createdSp.salesperson_name,
          salesperson_email: createdSp.salesperson_email,
        };

        // Update the salespersons lists
        setSalespersons((prev) => [...prev, formattedSalesperson]);
        setFilteredSalespersons((prev) => [...prev, formattedSalesperson]);

        // Select the newly created salesperson
        setSelectedSalesperson(formattedSalesperson);
        onSelect(formattedSalesperson);

        // Reset form and close modals
        resetForm();
        setShowAddForm(false);
        handleCloseModal();

        // Refresh the list from API to ensure we have the latest data
        fetchSalespersons();
      } else {
        console.error(
          "Failed to add salesperson:",
          response.data?.message || "Unknown error",
          "Status:",
          response.data?.status
        );
      }
    } catch (err) {
      console.error("Exception when adding salesperson:", err);
      console.error("Error details:", err.response?.data || err.message);
    }
  };

  const handleEditSalesperson = async () => {
    try {
      if (!selectedSalesperson || !selectedSalesperson._id) {
        console.error("No salesperson selected for edit");
        return;
      }

      const response = await apiService({
        method: "PUT",
        url: `/api/v1/salesperson/update/${selectedSalesperson._id}`,
        data: {
          salesperson_name: formData.name,
          salesperson_email: formData.email,
          organization_id: organizationId,
        },
        customBaseUrl: config.SO_Base_url,
      });

      if (response.data.status) {
        setIsEditMode(false);
        resetForm();
        fetchSalespersons();
        handleCloseModal();
      }
    } catch (err) {
      console.error("Failed to update salesperson:", err);
    }
  };

  const handleDeleteSalesperson = async (salespersonId) => {
    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/salesperson/delete/${salespersonId}`,
        customBaseUrl: config.SO_Base_url,
      });

      if (response.data.status) {
        // If the deleted salesperson was selected, clear the selection
        if (selectedSalesperson && selectedSalesperson._id === salespersonId) {
          setSelectedSalesperson(null);
        }
        handleCloseModal();
        window.location.reload(); // Reload the page after delete
      }
    } catch (err) {
      console.error("Failed to delete salesperson:", err);
    }
  };

  const handleSelect = (sp) => {
    setSelectedSalesperson(sp);
    onSelect({
      salesperson_id: sp.salesperson_id,
      salesperson_name: sp.salesperson_name,
    });
    closeDropdown();
  };

  const handleSaveAndSelect = () => {
    if (isEditMode) {
      handleEditSalesperson();
    } else {
      onSelect(selectedSalesperson);
      handleAddSalesperson();
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setShowAddForm(false);
    setIsEditMode(false);
    resetForm();
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
    setIsEditMode(false);
    resetForm();
  };

  const handleEditClick = (sp) => {
    setFormData({
      name: sp.salesperson_name,
      email: sp.salesperson_email,
    });
    setIsEditMode(true);
    setSelectedSalesperson(sp);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    resetForm();
    setIsEditMode(false);
  };

  return (
    <Box sx={{ position: "relative", width: "300px" }}>
      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search Salesperson"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
          sx: {
            fontSize: "13px",
            "& input": {
              fontSize: "13px",
            },
            "&::placeholder": {
              fontSize: "13px",
              opacity: 1,
            },
          },
        }}
      />

      {/* Results List */}
      <List dense sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {filteredSalespersons && filteredSalespersons.length > 0 ? (
          filteredSalespersons.map((sp) => (
            <ListItemButton
              key={sp.salesperson_id}
              onClick={() => handleSelect(sp)}
              sx={{
                padding: "6px 8px",
                fontSize: "13px",
                "&:hover": {
                  borderRadius: "5px",
                  backgroundColor: theme.palette.hover?.background || "",
                  color: theme.palette.hover?.text || "",
                },
              }}
            >
              <ListItemText
                primary={sp.salesperson_name}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "13px",
                    color: "#333",
                    "&:hover": {
                      color: "white",
                    },
                  },
                }}
              />
            </ListItemButton>
          ))
        ) : (
          <Typography
            sx={{ textAlign: "center", p: 1, fontSize: "13px" }}
            color="text.secondary"
          >
            No salespersons found
          </Typography>
        )}
      </List>

      {/* Add New Button */}
      <Button
        onClick={handleOpenModal}
        startIcon={<AddCircleOutlinedIcon sx={{ color: "#1976d2" }} />}
        sx={{
          textTransform: "none",
          color: "#1976d2",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        Add New Salesperson
      </Button>

      {/* Manage Salespersons Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        sx={{ position: "absolute", top: "0px" }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: 500 }}>
              Manage Salespersons
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon sx={{ color: "#999" }} />
            </IconButton>
          </Box>

          {/* Form Section */}
          <Box
            sx={{
              padding: showAddForm ? "16px" : "0",
              backgroundColor: showAddForm ? "#f5f5f5" : "transparent",
            }}
          >
            {showAddForm && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "13px", marginBottom: "4px" }}>
                      Name*
                    </Typography>
                    <StyledTextField
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "13px", marginBottom: "4px" }}>
                      Email*
                    </Typography>
                    <StyledTextField
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleSaveAndSelect()}
                    disabled={!formData.name || !formData.email}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#1976d2",
                      fontSize: "13px",
                      padding: "6px 12px",
                    }}
                  >
                    Save and Select
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      textTransform: "none",
                      fontSize: "13px",
                      padding: "6px 12px",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Search and Add Button */}
          <Box
            sx={{
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search Salesperson"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleAddNewClick}
              sx={{
                textTransform: "none",
                backgroundColor: "#1976d2",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              + New Salesperson
            </Button>
          </Box>

          {/* Table */}
          <Box sx={{ padding: "0 24px 16px 24px" }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: "1px solid #eee" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell
                      padding="checkbox"
                      sx={{ width: "48px" }}
                    ></TableCell>
                    <TableCell
                      sx={{ fontWeight: 500, fontSize: "13px", color: "#666" }}
                    >
                      SALESPERSON NAME
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 500, fontSize: "13px", color: "#666" }}
                    >
                      EMAIL
                    </TableCell>
                    <TableCell sx={{ width: "80px" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSalespersons && filteredSalespersons.length > 0 ? (
                    filteredSalespersons.map((sp) => (
                      <TableRow
                        key={sp.salesperson_id || sp.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f9f9f9",
                          },
                          cursor: "pointer",
                        }}
                        onClick={() => handleSelect(sp)}
                      >
                        <TableCell padding="checkbox">
                          <Radio
                            checked={
                              selectedSalesperson &&
                              selectedSalesperson.salesperson_id === sp._id
                            }
                            onChange={() => handleSelect(sp)}
                            value={sp._id}
                            name="salesperson-select"
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "13px" }}>
                          {sp.salesperson_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "13px" }}>
                          {sp.salesperson_email}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(sp);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSalesperson(sp._id);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                        No salespersons found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProjectSelector;
