"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Button,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff, Delete } from "@mui/icons-material";

const commonStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#bbbbbb",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    fontSize: "12px",
  },
};

const BankDetailsForm = ({ formik }) => {
  const [showAccountNumbers, setShowAccountNumbers] = useState({});

  useEffect(() => {
    // Initialize with at least one bank if array is empty
    if (
      !formik.values.bank_details ||
      formik.values.bank_details.length === 0
    ) {
      formik.setFieldValue("bank_details", [
        {
          bank_name: "",
          account_number: "",
          is_primary_account: true,
          account_name: "",
          ifsc_code: "",
          branch: "",
          micr_code: "",
          swift_code: "",
          iban: "",
        },
      ]);
    }
  }, []);

  const togglePasswordVisibility = (index) => {
    setShowAccountNumbers({
      ...showAccountNumbers,
      [index]: !showAccountNumbers[index],
    });
  };

  const addBank = () => {
    const newBankDetails = [
      ...formik.values.bank_details,
      {
        bank_name: "",
        account_number: "",
        is_primary_account: false,
        account_name: "",
        ifsc_code: "",
        branch: "",
        micr_code: "",
        swift_code: "",
        iban: "",
      },
    ];
    formik.setFieldValue("bank_details", newBankDetails);
  };

  const removeBank = (index) => {
    if (formik.values.bank_details.length > 1) {
      const updatedBanks = formik.values.bank_details.filter(
        (_, i) => i !== index
      );

      // If we're removing the primary account, make the first one primary
      if (
        formik.values.bank_details[index].is_primary_account &&
        updatedBanks.length > 0
      ) {
        updatedBanks[0].is_primary_account = true;
      }

      formik.setFieldValue("bank_details", updatedBanks);
    }
  };

  return (
    <Box sx={{ maxWidth: 350, margin: "auto", p: 2,mb:"50px", borderRadius: 2 }}>
      {formik.values.bank_details &&
        formik.values.bank_details.map((bank, index) => (
          <Grid
            container
            spacing={1}
            key={index}
            sx={{ mb: 1, position: "relative" }}
          >
            {formik.values.bank_details.length > 1 && (
              <IconButton
                onClick={() => removeBank(index)}
                sx={{ position: "absolute", right: -180, mt: 1, color: "red" }}
                size="small"
              >
                <Delete fontSize="small" />
              </IconButton>
            )}

            {/* Account Holder Name */}
            <Grid
              item
              xs={7}
              sx={{
                display: "flex",
                marginTop: "5px",
                fontSize: "13px",
                alignItems: "center",
              }}
            >
              <label>Account Holder Name</label>
            </Grid>
            <Grid item xs={5}>
              <TextField
                name={`bank_details[${index}].account_name`}
                variant="outlined"
                value={bank.account_name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(value)) {
                    // Only letters and spaces
                    formik.setFieldValue(
                      `bank_details[${index}].account_name`,
                      value
                    );
                  }
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.bank_details?.[index]?.account_name &&
                  Boolean(formik.errors.bank_details?.[index]?.account_name)
                }
                helperText={
                  formik.touched.bank_details?.[index]?.account_name &&
                  formik.errors.bank_details?.[index]?.account_name
                }
                size="small"
                style={{ width: 300 }}
                sx={commonStyles}
                fullWidth
                multiline
              />
            </Grid>

            {/* Bank Name */}
            <Grid
              item
              xs={7}
              sx={{
                display: "flex",
                marginTop: "5px",
                fontSize: "13px",
                alignItems: "center",
              }}
            >
              <label>Bank Name</label>
            </Grid>
            <Grid item xs={5}>
              <TextField
                name={`bank_details[${index}].bank_name`}
                variant="outlined"
                value={bank.bank_name || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.bank_details?.[index]?.bank_name &&
                  Boolean(formik.errors.bank_details?.[index]?.bank_name)
                }
                helperText={
                  formik.touched.bank_details?.[index]?.bank_name &&
                  formik.errors.bank_details?.[index]?.bank_name
                }
                size="small"
                style={{ width: 300 }}
                sx={commonStyles}
                fullWidth
                multiline
              />
            </Grid>

            {/* Account Number */}
            <Grid
              item
              xs={7}
              sx={{
                display: "flex",
                marginTop: "5px",
                fontSize: "13px",
                alignItems: "center",
                color: "red",
              }}
            >
              <label>Account Number*</label>
            </Grid>
            <Grid item xs={5}>
              <TextField
                name={`bank_details[${index}].account_number`}
                variant="outlined"
                value={bank.account_number || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  formik.setFieldValue(
                    `bank_details[${index}].account_number`,
                    value
                  );
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.bank_details?.[index]?.account_number &&
                  Boolean(formik.errors.bank_details?.[index]?.account_number)
                }
                helperText={
                  formik.touched.bank_details?.[index]?.account_number &&
                  formik.errors.bank_details?.[index]?.account_number
                }
                size="small"
                style={{ width: 300 }}
                sx={commonStyles}
                fullWidth
                multiline
                type={showAccountNumbers[index] ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility(index)}
                        size="small"
                      >
                        {showAccountNumbers[index] ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Re-enter Account Number */}
            <Grid
              item
              xs={7}
              sx={{
                display: "flex",
                marginTop: "5px",
                fontSize: "13px",
                alignItems: "center",
                color: "red",
              }}
            >
              <label>Re-enter Account Number *</label>
            </Grid>
            <Grid item xs={5}>
              <TextField
                name={`bank_details[${index}].confirm_account_number`}
                variant="outlined"
                value={bank.confirm_account_number || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Only numbers
                  formik.setFieldValue(
                    `bank_details[${index}].confirm_account_number`,
                    value
                  );
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.bank_details?.[index]
                    ?.confirm_account_number &&
                  (Boolean(
                    formik.errors.bank_details?.[index]?.confirm_account_number
                  ) ||
                    bank.confirm_account_number !== bank.account_number)
                }
                helperText={
                  formik.touched.bank_details?.[index]
                    ?.confirm_account_number &&
                  (formik.errors.bank_details?.[index]
                    ?.confirm_account_number ||
                    (bank.confirm_account_number !== bank.account_number
                      ? "Account numbers don't match"
                      : ""))
                }
                size="small"
                style={{ width: 300 }}
                sx={commonStyles}
                fullWidth
                multiline
                type={showAccountNumbers[index] ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility(index)}
                        size="small"
                      >
                        {showAccountNumbers[index] ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* IFSC Code */}
            <Grid
              item
              xs={7}
              sx={{
                display: "flex",
                marginTop: "5px",
                fontSize: "13px",
                alignItems: "center",
                color: "red",
              }}
            >
              <label>IFSC*</label>
            </Grid>
            <Grid item xs={5}>
              <TextField
                name={`bank_details[${index}].ifsc_code`}
                variant="outlined"
                value={bank.ifsc_code || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.bank_details?.[index]?.ifsc_code &&
                  Boolean(formik.errors.bank_details?.[index]?.ifsc_code)
                }
                helperText={
                  formik.touched.bank_details?.[index]?.ifsc_code &&
                  formik.errors.bank_details?.[index]?.ifsc_code
                }
                size="small"
                style={{ width: 300 }}
                sx={commonStyles}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        ))}

      <Button
        variant="text"
        onClick={addBank}
        sx={{
          mt: 1,
          textTransform: "none",
          color: "#1976d2",
          fontWeight: "normal",
          fontSize: "14px",
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
          marginBottom: "80px",
        }}
      >
        + Add New Bank
      </Button>
    </Box>
  );
};

export default BankDetailsForm;
