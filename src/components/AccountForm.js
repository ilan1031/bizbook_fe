// 2. AccountForm.js - Separate form component
"use client";
import React, { useEffect } from "react";
import {
  Select,
  MenuItem,
  Typography,
  Button,
  Box,
  styled,
  DialogActions,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import { useSnackbar } from "../../../components/SnackbarProvider";

// Styling
const COLORS = {
  primary: "#408dfb",
  error: "#F8D7DA",
  textPrimary: "#333333",
  borderColor: "#c4c4c4",
};

const formLabelStyle = {
  fontSize: "13px",
  minWidth: "160px",
  whiteSpace: "nowrap",
};

const StyledTextField = styled("input")(({ error }) => ({
  height: "35px",
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
  borderRadius: "7px",
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
  "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "-moz-appearance": "textfield",
}));

const StyledTextArea = styled("textarea")(({ error }) => ({
  width: "100%",
  minHeight: "100px",
  padding: "6px 12px",
  border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
  borderRadius: "7px",
  fontSize: "13px",
  backgroundColor: "#fff",
  resize: "vertical",
  fontFamily: "inherit",
  "&:hover": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&:focus": {
    outline: "none",
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
}));

export const AccountForm = ({
  accountTypes,
  selectedAccountTypeInfo,
  setSelectedAccountTypeInfo,
  accountData,
  isEdit,
  onSuccess,
  onClose,
  accountId,
  loading,
  setLoading,
}) => {
  const { showMessage } = useSnackbar();
  const orgId = localStorage.getItem("organization_id");

  const validationSchema = Yup.object().shape({
    account_type_formatted: Yup.string().required("Account Type is required"),
    account_name: Yup.string().required("Account Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      account_type: "",
      account_type_formatted: "",
      account_name: "",
      account_code: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setLoading(true);
      try {
        const params = {
          method: "POST",
          url: accountId
            ? `/api/v1/COA/edit-coa?org_id=${orgId}&COA_ID=${accountId}`
            : `/api/v1/COA/add-coa?org_id=${orgId}`,
          data: values,
          customBaseUrl: config.PO_Base_url,
        };

        const response = await apiService(params);
        if (response.statusCode === 200 || response.statusCode === 201) {
          showMessage(
            accountId
              ? "Account successfully updated"
              : "Account successfully created"
          );
          resetForm();
          if (onSuccess) onSuccess();
          onClose();
        } else {
          showMessage("Failed to save account", "error");
        }
      } catch (error) {
        console.error("API Error:", error);
        showMessage("API submission failed", "error");
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  // Load account data into form when editing
  useEffect(() => {
    if (accountData) {
      formik.setValues({
        account_type: accountData.account_type || "",
        account_type_formatted: accountData.account_type_formatted || "",
        account_name: accountData.account_name || "",
        account_code: accountData.account_code || "",
        description: accountData.description || "",
      });
    }
  }, [accountData]);

  const handleAccountTypeChange = (event) => {
    const formattedType = event.target.value;
    const selected = accountTypes.find(
      (type) => type.account_formatted_type === formattedType
    );

    if (selected) {
      formik.setFieldValue("account_type", selected.account_type || "");
      formik.setFieldValue("account_type_formatted", formattedType);
      setSelectedAccountTypeInfo({
        title: selected.account_type_formatted || "Account Type",
        description: selected.description || "No description available",
        examples: selected.examples || [],
      });
    } else {
      formik.setFieldValue("account_type", "");
      formik.setFieldValue("account_type_formatted", "");
      setSelectedAccountTypeInfo({
        account_type_formatted: "Select an Account Type",
        description: "here show that Description",
        examples: [],
      });
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Left Side */}
        <Box sx={{ flex: 1 }}>
          {/* Account Type */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ ...formLabelStyle, color: "#d62134" }}>
              Account Type*
            </Typography>
            <Box>
              <Select
                value={formik.values.account_type_formatted}
                onChange={handleAccountTypeChange}
                error={
                  formik.touched.account_type_formatted &&
                  Boolean(formik.errors.account_type_formatted)
                }
                displayEmpty
                disabled={isEdit}
                size="small"
                fullWidth
                sx={{
                  height: "35px",
                  width: "350px",
                  fontSize: "13px",
                  borderRadius: "7px",
                  backgroundColor: isEdit ? "#f5f5f5" : "",
                  color: "black",
                }}
              >
                <MenuItem value="" disabled>
                  {loading ? "Loading..." : "Select account type"}
                </MenuItem>
                {accountTypes.map((type, index) => (
                  <MenuItem
                    key={index}
                    value={type.account_formatted_type || ""}
                    sx={{ fontSize: "13px" }}
                  >
                    {type.account_formatted_type}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          {formik.touched.account_type_formatted &&
            formik.errors.account_type_formatted && (
              <Typography
                sx={{
                  ml: "165px",
                  mt: "-5px",
                  fontSize: "0.75rem",
                  color: COLORS.error,
                  mb: "10px",
                }}
              >
                {formik.errors.account_type_formatted}
              </Typography>
            )}

          {/* Account Name */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ ...formLabelStyle, color: "#d62134" }}>
              Account Name*
            </Typography>
            <StyledTextField
              type="text"
              name="account_name"
              value={formik.values.account_name}
              onChange={formik.handleChange}
              error={
                formik.touched.account_name &&
                Boolean(formik.errors.account_name)
              }
              placeholder="Enter account name"
              style={{ width: "350px" }}
            />
          </Box>
          {formik.touched.account_name && formik.errors.account_name && (
            <Typography
              sx={{
                ml: "165px",
                mt: "-5px",
                fontSize: "0.75rem",
                color: COLORS.error,
                mb: "10px",
              }}
            >
              {formik.errors.account_name}
            </Typography>
          )}

          {/* Account Code */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={formLabelStyle}>Account Code</Typography>
            <StyledTextField
              name="account_code"
              value={formik.values.account_code}
              onChange={formik.handleChange}
              style={{ width: "350px" }}
              placeholder="Enter account code"
            />
          </Box>

          {/* Description */}
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Typography sx={{ ...formLabelStyle, mt: 1 }}>
              Description
            </Typography>
            <StyledTextArea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Max. 500 characters"
              maxLength={500}
              style={{ width: "350px" }}
            />
          </Box>
        </Box>

        {/* Right Info Box */}
        <Box
          sx={{
            width: "280px",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            height: "135px",
            p: 2,
            color: "white",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "16px",
              left: "-10px",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: "10px solid #1e293b",
            },
          }}
        >
          <Typography sx={{ fontSize: "13px", mb: 1, fontWeight: 550 }}>
            {selectedAccountTypeInfo.title}
          </Typography>
          <Typography sx={{ fontSize: "13px", mb: 1 }}>
            {selectedAccountTypeInfo.description}
          </Typography>
          {selectedAccountTypeInfo.examples?.length > 0 && (
            <Box>
              {selectedAccountTypeInfo.examples.map((example, idx) => (
                <Typography key={idx} sx={{ fontSize: "13px", ml: 2 }}>
                  • {example}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <DialogActions
        sx={{
          py: 1,
          pb: 2,
          justifyContent: "flex-start",
          ml: 2,
          borderTop: "1px solid #eeeeee",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {isEdit ? "Update" : "Save"}
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
      </DialogActions>
    </form>
  );
};
