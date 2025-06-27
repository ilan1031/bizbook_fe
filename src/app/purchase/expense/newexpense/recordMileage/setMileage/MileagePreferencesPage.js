"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormLabel,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  InputAdornment,
  Container,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Divider } from "antd";

const expenseCategories = [
  "Office Supplies",
  "Advertising And Marketing",
  "Bank Fees and Charges",
  "Credit Card Charges",
  "Travel Expense",
  "Telephone Expense",
  "Automobile Expense",
  "IT and Internet Expenses",
  "Rent Expense",
  "Janitorial Expense",
  "Postage",
  "Bad Debt",
  "Printing and Stationery",
  "Salaries and Employee Wages",
  "Meals and Entertainment",
  "Depreciation Expense",
  "Consultant Expense",
  "Repairs and Maintenance",
  "Other Expenses",
  "Lodging",
  "Purchase Discounts",
  "Raw Materials And Consumables",
  "Merchandise",
  "Transportation Expense",
  "Depreciation And Amortisation",
  "Contract Assets",
  "Fuel/Mileage Expense",
];

const MileagePreferencesPage = () => {
  const [mileageCategory, setMileageCategory] = useState("fuel");
  const [unit, setUnit] = useState("km");
  const [associateEmployees, setAssociateEmployees] = useState(false);
  // const [mileageCategory, setMileageCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] =
    useState(expenseCategories);

  const handleSearchChange = (event) => {
    const keyword = event.target.value.toLowerCase();
    setSearch(keyword);
    setFilteredCategories(
      expenseCategories.filter((category) =>
        category.toLowerCase().includes(keyword)
      )
    );
  };

  useEffect(() => {
    setFilteredCategories(expenseCategories);
  }, []);

  const [mileageRates, setMileageRates] = useState([
    { startDate: "", rate: "" },
  ]);

  const handleAddMileageRate = () => {
    setMileageRates([...mileageRates, { startDate: "", rate: "" }]);
  };

  const handleMileageRateChange = (index, field, value) => {
    const updatedRates = [...mileageRates];
    updatedRates[index][field] = value;
    setMileageRates(updatedRates);
  };

  const handleSave = () => {
    console.log({
      mileageCategory,
      unit,
      associateEmployees,
      mileageRates,
    });
    alert("Mileage preferences saved!");
  };

  return (
    <Container maxWidth="md" sx={{ py: 0, width: "700px" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography sx={{ color: "error.main", mb: 2, fontSize: "20px" }}>
          Set your mileage preferences
        </Typography>

        {/* Associate Employees */}
        <Box mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={associateEmployees}
                onChange={(e) => setAssociateEmployees(e.target.checked)}
                sx={{
                  marginLeft: "10px",
                  marginRight: "10px",
                  p: 0, // optional: removes extra padding
                  "& .MuiSvgIcon-root": {
                    fontSize: 18, // size of the checkbox icon itself
                  },
                }}
              />
            }
            label="Associate employees to expenses"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "13px",
              },
            }}
          />
        </Box>
        <Divider sx={{ my: 4 }} />

        {/* Mileage Category */}
        <Box mt={4} mb={2}>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
            Mileage Preference
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={3}>
            <Typography
              id="mileage-category-label"
              sx={{ fontSize: "13px", color: "text.primary", width: "140px" }}
            >
              Default Mileage Category
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <Select
                value={mileageCategory}
                onChange={(e) => setMileageCategory(e.target.value)}
                labelId="mileage-category-label"
                id="mileage-category-select"
                displayEmpty
                renderValue={(selected) =>
                  selected ? (
                    selected
                  ) : (
                    <span style={{ color: "#aaa" }}>Select a category</span>
                  )
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      paddingTop: 0,
                    },
                  },
                  MenuListProps: {
                    style: { padding: 0 },
                    subheader: (
                      <Box
                        sx={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "white",
                          zIndex: 1,
                          padding: "8px",
                          borderBottom: "1px solid #F0F0F0",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TextField
                          autoFocus
                          placeholder="Search"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={search}
                          onChange={handleSearchChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box sx={{ color: "#757575", mr: -0.5 }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                  </svg>
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: "36px",
                              fontSize: "13px",
                            },
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Box>
                    ),
                  },
                }}
                sx={{
                  fontSize: "14px",
                  height: "40px",
                }}
              >
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <Typography fontSize="12px" color="text.secondary">
                      No categories found
                    </Typography>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Unit Selection */}
        <Grid container spacing={1} alignItems="center" mb={3}>
          <Grid item xs={4}>
            <FormLabel
              id="unit-selection-label"
              sx={{ fontSize: "13px", color: "text.primary" }}
            >
              Default Unit
            </FormLabel>
          </Grid>
          <Grid item xs={4}>
            <RadioGroup
              row
              aria-labelledby="unit-selection-label"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <FormControlLabel
                value="km"
                control={<Radio size="small" />}
                label="Km"
              />
              <FormControlLabel
                value="mile"
                control={<Radio size="small" />}
                label="Mile"
              />
            </RadioGroup>
          </Grid>
        </Grid>

        {/* Mileage Rates Header */}
        <Box mt={3} mb={2}>
          <Typography
            variant="subtitle1"
            sx={{
              textTransform: "uppercase",
              fontWeight: "medium",
              fontSize: "0.75rem",
              mb: 1,
            }}
          >
            Mileage Rates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize:"13px" }}>
          Any mileage expense recorded on or after the start date will
           have the corresponding mileage rate. You can create a default
            rate (created without specifying a date), 
            which will be applicable for mileage expenses recorded before
             the initial start date.
          </Typography>
        </Box>

        {/* Headers */}
        <Grid container spacing={1} sx={{ mb: 1, backgroundColor:"#f7f7fa",width:"650px",borderBottom:"1px solid #e5e5e5",borderTop:"1px solid #e5e5e5",marginLeft:"-32px"}}>
        
          <Grid item xs={5}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "13px",
                fontWeight: "medium",
                color: "text.secondary",
                marginLeft:"30px",
              }}
            >
              START DATE
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "13px",

                fontWeight: "medium",
                color: "text.secondary",
              }}
            >
              MILEAGE RATE
            </Typography>
          </Grid>
        </Grid>

        {/* Dynamic Rate Fields */}
        {mileageRates.map((rate, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
            <Grid item xs={5}>
              <TextField
                placeholder="dd/MM/yyyy"
                value={rate.startDate}
                onChange={(e) =>
                  handleMileageRateChange(index, "startDate", e.target.value)
                }
                fullWidth
                size="small"
                inputProps={{
                  "aria-label": "Start date",
                  "data-testid": `start-date-${index}`,
                }}
                sx={{
                  fontSize:"13px",
                  width:"180px",
                  "& .MuiOutlinedInput-root": {
                    height: "36px",
                    fontSize: "13px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                placeholder="e.g. 5.00"
                value={rate.rate}
                onChange={(e) =>
                  handleMileageRateChange(index, "rate", e.target.value)
                }
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ fontSize: '13px' }}>INR</span>
                    </InputAdornment>
                  ),
                  
                }}
                inputProps={{
                  "aria-label": "Mileage rate",
                  "data-testid": `mileage-rate-${index}`,
                }}
                sx={{
                  fontSize:"13px",
                  width:"180px",
                  "& .MuiOutlinedInput-root": {
                    height: "36px",
                    fontSize: "13px",
                  },
                }}
              />
            </Grid>
          </Grid>
        ))}

        {/* Add Button */}
        <Box mt={2}>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddMileageRate}
          >
            Add Mileage Rate
          </Button>
        </Box>

        {/* Actions */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              minWidth: "80px",
              fontSize: "0.875rem",
              fontWeight: "medium",
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              minWidth: "80px",
              fontSize: "0.875rem",
              fontWeight: "medium",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MileagePreferencesPage;
