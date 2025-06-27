"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
  Box,
  Autocomplete,
  Divider,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Country data
import countriesList from "country-list";
import { State } from "country-state-city";
import apiService from "../../../src/services/axiosService";
import { useSnackbar } from "../../../src/components/SnackbarProvider";

const countries = countriesList.getData().map((c) => ({
  code: c.code,
  label: c.name,
}));

const BillingAddressForm = ({
  open,
  onClose,
  editData,
  title,
  address,
  contactId,
}) => {
  const [formData, setFormData] = useState({
    attention: address === "edit" ? editData?.attention : "",
    country: address === "edit" ? editData?.country : "",
    country_code: address === "edit" ? editData?.country_code : "",
    address: address === "edit" ? editData?.address : "",
    street2: address === "edit" ? editData?.street2 : "",
    city: address === "edit" ? editData?.city : "",
    state: address === "edit" ? editData?.state : "",
    state_code: address === "edit" ? editData?.state_code : "",
    zip: address === "edit" ? editData?.zip : "",
    phone: address === "edit" ? editData?.phone : "",
    fax: address === "edit" ? editData?.fax : "",
  });

  const [stateOptions, setStateOptions] = useState([]);
  const { showMessage } = useSnackbar();
  const organization_id = localStorage.getItem("organization_id");
  const theme = useTheme();
console.log(address,"-=-=-=-=-=")
  useEffect(() => {
    if (formData.country_code) {
      const states = State.getStatesOfCountry(formData.country_code);
      setStateOptions(
        states.map((s) => ({
          code: s.isoCode,
          label: s.name,
        }))
      );
    } else {
      setStateOptions([]);
    }
  }, [formData.country_code]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      let organization_id = localStorage.getItem("organization_id");
      let formattedData = {};

      // Get country and state names from codes
      const allCountries = countries;
      const selectedCountry = allCountries.find(
        (c) => c.isoCode === formData.country_code
      );

      const allStates = State.getStatesOfCountry(formData.country_code);
      const selectedState = allStates.find(
        (s) => s.isoCode === formData.state_code
      );

      // Add country and state names into formData
      const updatedFormData = {
        ...formData,
        country: selectedCountry?.name || formData.country,
        state: selectedState?.name || formData.state,
      };

      if (address === "add") {
        formattedData =
          title === "Billing Address"
            ? { billing_address: updatedFormData }
            : title === "Shipping Address"
            ? { shipping_address: updatedFormData }
            : { additional_address: updatedFormData };
      } else {
        // For edit, send plain formData without billing/shipping key
        formattedData = updatedFormData;
      }

      let apiUrl = `/api/v1/contacts/address?organization_id=${organization_id}&contact_id=${contactId}`;
      
      if (address === "edit") {
        apiUrl += `&address_id=${editData.address_id}`; // Append address_id when editing
      }
      // API Call
      const response = await apiService({
        method: address === "add" ? "POST" : "PUT",
        url: apiUrl,
        data: formattedData,
      });
      showMessage(
        `Address ${address === "edit" ? "updated" : "added"} successfully!`,
        "success"
      );
      onClose();
    } catch (error) {
      // setErrorSnackbar({
      //   open: true,
      //   message: error.message || "Failed to create address. Please try again.",
      // });
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#f0f0f0"
      >
        <Typography variant="body2" sx={{ pl: 1, fontSize: "13px" }}>
          {title}
        </Typography>
        <IconButton sx={{ pr: 1 }} onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box> */}
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Attention Field */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            gutterBottom
          >
            Attentions
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="attention"
            name="attention"
            value={formData.attention}
            onChange={handleChange}
            InputProps={{
              sx: { fontSize: "13px" },
            }}
            InputLabelProps={{ sx: { fontSize: "13px" } }}
          />
        </Grid>

        {/* Country Autocomplete */}
        <Grid item xs={12}>

          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "13px" }}
              gutterBottom
            >
              Country/Region
            </Typography>

            <Autocomplete
              options={countries}
              size="small"
              getOptionLabel={(option) => option.label}
              value={
                countries.find((c) => c.code === formData.country_code) || null
              }
              onChange={(e, newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  country_code: newValue?.code || "",
                  country: newValue?.label || "",
                  state: "",
                  state_code: "",
                }))
              }
              sx={{
                fontSize: "12px",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Country"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ mt: 0 }}
                  InputLabelProps={{
                    sx: { fontSize: "13px" },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    fontSize: "13px",
                    padding: "6px 12px",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.hover?.background || "#408dfb",
                      color: theme.palette.hover?.text || "white",
                      borderRadius: "5px",
                      margin: "2px 10px",
                    },
                  }}
                >
                  {option.label}
                </Box>
              )}
            />
          </Grid>
        </Grid>

        {/* Address Section */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            gutterBottom
          >
            Address Details
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="address"
            name="address"
            placeholder="Address Line 1"
            value={formData.address}
            onChange={handleChange}
            multiline
            sx={{ mb: 1 }}
            InputProps={{
              sx: { fontSize: "13px" },
            }}
            InputLabelProps={{ sx: { fontSize: "13px" } }}
          />
          <TextField
            fullWidth
            size="small"
            id="street2"
            name="street2"
            placeholder="Address Line 2"
            value={formData.street2}
            onChange={handleChange}
            multiline
            InputProps={{
              sx: { fontSize: "13px" },
            }}
            InputLabelProps={{ sx: { fontSize: "13px" } }}
          />
        </Grid>

        {/* City and State */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            gutterBottom
          >
            City
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            multiline
            InputProps={{
              sx: { fontSize: "13px" },
            }}
            InputLabelProps={{ sx: { fontSize: "13px" } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            gutterBottom
          >
            State/Province
          </Typography>
          <Autocomplete
            options={stateOptions}
            size="small"
            sx={{ marginTop: 0 }}
            getOptionLabel={(option) => option.label}
            value={
              stateOptions.find((s) => s.code === formData.state_code) || null
            }
            onChange={(e, newValue) =>
              setFormData((prev) => ({
                ...prev,
                state_code: newValue?.code || "",
                state: newValue?.label || "", // Optional for name
              }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search State"
                variant="outlined"
                fullWidth
                sx={{ marginTop: 0, height: "30px" }}
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                margin="normal"
                disabled={!formData.country}
              />
            )}
          />
        </Grid>

        {/* Postal Code */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            gutterBottom
          >
            Pin Code
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            InputProps={{
              sx: { fontSize: "13px" },
            }}
            InputLabelProps={{ sx: { fontSize: "13px" } }}
          />
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            gutterBottom
          >
            Phone Number
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            InputProps={{
              sx: { fontSize: "13px" },
            }}
            InputLabelProps={{ sx: { fontSize: "13px" } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: "13px" }}
            gutterBottom
          >
            Fax Number
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="fax"
            name="fax"
            value={formData.fax}
            onChange={handleChange}
            InputProps={{
              sx: { fontSize: "13px" },
            }}
            InputLabelProps={{ sx: { fontSize: "13px" } }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Divider />

          <Button
            variant="contained"
            className="button-submit"
            sx={{ mr: 1, my: 2 }}
            onClick={handleSubmit}
          >
            Save
          </Button>
          <Button
            onClick={onClose}
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default BillingAddressForm;
