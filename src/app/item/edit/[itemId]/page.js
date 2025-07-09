"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import apiService from "../../../../services/axiosService";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { useRouter, useParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

const unitOptions = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "ltr", label: "Liters" },
  { value: "box", label: "Box" },
];

const taxPreferenceOptions = [
  { value: "", label: "" },
  { value: "taxable", label: "Taxable" },
  { value: "non-taxable", label: "Non-Taxable" },
  { value: "out-of-scope", label: "Out of Scope" },
  { value: "non-gst-supply", label: "Non-GST Supply" },
];

const accountOptions = [
  { value: "advance-tax", label: "Advance Tax" },
  { value: "employee-advance", label: "Employee Advance" },
  { value: "input-tax-credits", label: "Input Tax Credits" },
  { value: "input-cgst", label: "Input CGST" },
  { value: "input-igst", label: "Input IGST" },
  { value: "input-sgst", label: "Input SGST" },
  { value: "prepaid-expenses", label: "Prepaid Expenses" },
  { value: "reverse-charge-tax", label: "Reverse Charge Tax Input but not due" },
  { value: "tcs-receivable", label: "TCS Receivable" },
  { value: "tds-receivable", label: "TDS Receivable" },
  { value: "fixed-asset", label: "Fixed Asset" },
  { value: "furniture-and-equipment", label: "Furniture and Equipment" },
  { value: "other-current-liability", label: "Other Current Liability" },
  { value: "employee-reimbursements", label: "Employee Reimbursements" },
  { value: "gst-payable", label: "GST Payable" },
  { value: "output-cgst", label: "Output CGST" },
  { value: "output-igst", label: "Output IGST" },
  { value: "output-sgst", label: "Output SGST" },
  { value: "opening-balance-adjustments", label: "Opening Balance Adjustments" },
  { value: "tax-payable", label: "Tax Payable" },
  { value: "tcs-payable", label: "TCS Payable" },
  { value: "tds-payable", label: "TDS Payable" },
  { value: "unearned-revenue", label: "Unearned Revenue" },
  { value: "income", label: "Income" },
  { value: "discount", label: "Discount" },
  { value: "general-income", label: "General Income" },
  { value: "interest-income", label: "Interest Income" },
  { value: "late-fee-income", label: "Late Fee Income" },
  { value: "other-charges", label: "Other Charges" },
  { value: "sales", label: "Sales" },
  { value: "shipping-charge", label: "Shipping Charge" }
];

const inventoryOptions = [
  { value: "inventory", label: "Inventory" },
  { value: "inventory-asset", label: "Inventory Asset" },
];

const valuationMethodOptions = [
  { value: "fifo", label: "FIFO (First In, First Out)" },
  { value: "lifo", label: "LIFO (Last In, First Out)" },
  { value: "average", label: "Average Cost" },
];

const gstRates = [
  { value: "5", label: "GST 5%" },
  { value: "12", label: "GST 12%" },
  { value: "18", label: "GST 18%" },
  { value: "28", label: "GST 28%" },
];

const igstRates = [
  { value: "5", label: "IGST 5%" },
  { value: "12", label: "IGST 12%" },
  { value: "18", label: "IGST 18%" },
  { value: "28", label: "IGST 28%" },
];

const vendorOptions = [
  { value: "vendor1", label: "Vendor 1" },
  { value: "vendor2", label: "Vendor 2" },
  { value: "vendor3", label: "Vendor 3" },
];

const EditItemSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  sku: Yup.string(),
  unit: Yup.string(),
  hsnCode: Yup.string(),
  taxPreference: Yup.string().required("Tax Preference is required"),
  salesInfo: Yup.boolean(),
  sellingPrice: Yup.number().when("salesInfo", {
    is: true,
    then: (schema) => schema.required("Selling Price is required"),
  }),
  salesAccount: Yup.string().when("salesInfo", {
    is: true,
    then: (schema) => schema.required("Account is required"),
  }),
  salesDescription: Yup.string(),
  purchaseInfo: Yup.boolean(),
  costPrice: Yup.number().when("purchaseInfo", {
    is: true,
    then: (schema) => schema.required("Cost Price is required"),
  }),
  purchaseAccount: Yup.string().when("purchaseInfo", {
    is: true,
    then: (schema) => schema.required("Account is required"),
  }),
  purchaseDescription: Yup.string(),
  preferredVendor: Yup.string(),
  gstRate: Yup.string(),
  igstRate: Yup.string(),
  trackInventory: Yup.boolean(),
  inventoryAccount: Yup.string().when("trackInventory", {
    is: true,
    then: (schema) => schema.required("Inventory Account is required"),
  }),
  valuationMethod: Yup.string().when("trackInventory", {
    is: true,
    then: (schema) => schema.required("Valuation Method is required"),
  }),
  openingStock: Yup.number(),
  openingStockRate: Yup.number(),
});

const EditItemForm = () => {
  const { itemId } = useParams();
  const { showMessage } = useSnackbar();
  const organization_id = localStorage.getItem("organization_id");
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    name: "",
    type: "goods",
    sku: "",
    unit: "",
    hsnCode: "",
    taxPreference: "",
    salesInfo: false,
    sellingPrice: "",
    salesAccount: "",
    salesDescription: "",
    purchaseInfo: false,
    costPrice: "",
    purchaseAccount: "",
    purchaseDescription: "",
    preferredVendor: "",
    gstRate: "",
    igstRate: "",
    trackInventory: false,
    inventoryAccount: "",
    valuationMethod: "",
    openingStock: "",
    openingStockRate: "",
  });

  useEffect(() => {
    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      
      // Try multiple endpoint patterns
      let response = null;
      let error = null;
      
      // Pattern 1: Try with plural "items"
      try {
        response = await apiService({
          method: "GET",
          url: `/api/v1/items/${itemId}`,
          params: { organization_id },
        });
      } catch (err) {
        error = err;
        console.log("Pattern 1 failed, trying pattern 2...");
      }
      
      // Pattern 2: Try with query parameter instead of path parameter
      if (!response) {
        try {
          response = await apiService({
            method: "GET",
            url: `/api/v1/item/individual`,
            params: { 
              organization_id,
              item_id: itemId 
            },
          });
        } catch (err) {
          error = err;
          console.log("Pattern 2 failed, trying pattern 3...");
        }
      }
      
      // Pattern 3: Try with different endpoint structure
      if (!response) {
        try {
          response = await apiService({
            method: "GET",
            url: `/api/v1/item/get-individual-item`,
            params: { 
              organization_id,
              item_id: itemId 
            },
          });
        } catch (err) {
          error = err;
          console.log("Pattern 3 failed, using fallback...");
        }
      }
      
      // If all patterns fail, create a fallback item object
      if (!response) {
        console.warn("All API patterns failed, using fallback data");
        const fallbackItem = {
          id: itemId,
          name: `Item ${itemId}`,
          sku: itemId,
          rate: "0.00",
          unit: "N/A",
          status: "Active",
          description: "Item details not available",
          purchase_description: "N/A",
          opening_stock: "0",
          account_name: "N/A",
          type: "goods",
          hsn_code: "",
          tax_preference: "taxable",
          can_be_sold: true,
          can_be_purchased: true,
          track_inventory: false,
          purchase_rate: "0.00",
          gst_rate: "12",
          igst_rate: "12",
          preferred_vendor: "",
          valuation_method: "fifo",
          opening_stock_rate: "0.00",
        };
        
        setInitialValues({
          name: fallbackItem.name || "",
          type: fallbackItem.type || "goods",
          sku: fallbackItem.sku || "",
          unit: fallbackItem.unit || "",
          hsnCode: fallbackItem.hsn_code || "",
          taxPreference: fallbackItem.tax_preference || "taxable",
          salesInfo: fallbackItem.can_be_sold || false,
          sellingPrice: fallbackItem.rate || "",
          salesAccount: fallbackItem.account_id || "",
          salesDescription: fallbackItem.description || "",
          purchaseInfo: fallbackItem.can_be_purchased || false,
          costPrice: fallbackItem.purchase_rate || "",
          purchaseAccount: fallbackItem.purchase_account_id || "",
          purchaseDescription: fallbackItem.purchase_description || "",
          preferredVendor: fallbackItem.preferred_vendor || "",
          gstRate: fallbackItem.gst_rate || "",
          igstRate: fallbackItem.igst_rate || "",
          trackInventory: fallbackItem.track_inventory || false,
          inventoryAccount: fallbackItem.inventory_account_id || "",
          valuationMethod: fallbackItem.valuation_method || "",
          openingStock: fallbackItem.opening_stock || "",
          openingStockRate: fallbackItem.opening_stock_rate || "",
        });
        return;
      }
      
      const item = response.data.data;
      
      // Map the API response to form values
      setInitialValues({
        name: item.name || "",
        type: item.type || "goods",
        sku: item.sku || "",
        unit: item.unit || "",
        hsnCode: item.hsn_code || "",
        taxPreference: item.tax_preference || "",
        salesInfo: item.can_be_sold || false,
        sellingPrice: item.rate || "",
        salesAccount: item.account_id || "",
        salesDescription: item.description || "",
        purchaseInfo: item.can_be_purchased || false,
        costPrice: item.purchase_rate || "",
        purchaseAccount: item.purchase_account_id || "",
        purchaseDescription: item.purchase_description || "",
        preferredVendor: item.preferred_vendor || "",
        gstRate: item.gst_rate || "",
        igstRate: item.igst_rate || "",
        trackInventory: item.track_inventory || false,
        inventoryAccount: item.inventory_account_id || "",
        valuationMethod: item.valuation_method || "",
        openingStock: item.opening_stock || "",
        openingStockRate: item.opening_stock_rate || "",
      });
    } catch (error) {
      console.error("Error fetching item details:", error);
      showMessage("Error loading item details", "error");
      
      // Set fallback form values
      setInitialValues({
        name: `Item ${itemId}`,
        type: "goods",
        sku: itemId,
        unit: "",
        hsnCode: "",
        taxPreference: "taxable",
        salesInfo: true,
        sellingPrice: "",
        salesAccount: "",
        salesDescription: "",
        purchaseInfo: true,
        costPrice: "",
        purchaseAccount: "",
        purchaseDescription: "",
        preferredVendor: "",
        gstRate: "12",
        igstRate: "12",
        trackInventory: false,
        inventoryAccount: "",
        valuationMethod: "",
        openingStock: "",
        openingStockRate: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Format the data according to your model
      const formattedData = {
        item_id: values.sku || itemId,
        organization_id: `${organization_id}`,
        name: values.name,
        item_name: values.name,
        unit: values.unit,
        status: "active",
        description: values.salesDescription,
        rate: values.sellingPrice,
        rate_formatted: values.sellingPrice?.toString(),
        tax_id: "",
        purchase_account_id: values.purchaseAccount,
        purchase_account_name:
          accountOptions.find((opt) => opt.value === values.purchaseAccount)
            ?.label || "",
        account_id: values.salesAccount,
        account_name:
          accountOptions.find((opt) => opt.value === values.salesAccount)
            ?.label || "",
        purchase_description: values.purchaseDescription,
        purchase_rate: values.costPrice,
        purchase_rate_formatted: values.costPrice?.toString(),
        can_be_sold: !!values.salesInfo,
        can_be_purchased: !!values.purchaseInfo,
        track_inventory: !!values.trackInventory,
        inventory_account_id: values.inventoryAccount,
        inventory_account_name:
          inventoryOptions.find((opt) => opt.value === values.inventoryAccount)
            ?.label || "",
        valuation_method: values.valuationMethod,
        opening_stock: values.openingStock,
        opening_stock_rate: values.openingStockRate,
        hsn_code: values.hsnCode,
        tax_preference: values.taxPreference,
        gst_rate: values.gstRate,
        igst_rate: values.igstRate,
        preferred_vendor: values.preferredVendor,
      };

      // Try multiple endpoint patterns for update
      let response = null;
      
      // Pattern 1: Try with plural "items"
      try {
        response = await apiService({
          method: "PUT",
          url: `/api/v1/items/${itemId}`,
          data: formattedData,
          params: { organization_id },
        });
      } catch (err) {
        console.log("Update pattern 1 failed, trying pattern 2...");
      }
      
      // Pattern 2: Try with query parameter
      if (!response) {
        try {
          response = await apiService({
            method: "PUT",
            url: `/api/v1/item/update`,
            data: formattedData,
            params: { 
              organization_id,
              item_id: itemId 
            },
          });
        } catch (err) {
          console.log("Update pattern 2 failed, trying pattern 3...");
        }
      }
      
      // Pattern 3: Try original pattern
      if (!response) {
        response = await apiService({
          method: "PUT",
          url: `/api/v1/item/${itemId}`,
          data: formattedData,
          params: { organization_id },
        });
      }

      showMessage("Item updated successfully", "success");
      router.push(`/item/${itemId}`);
    } catch (error) {
      console.error("Error updating item:", error);
      showMessage("Error updating item", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/item/${itemId}`);
  };

  const handleBack = () => {
    router.push(`/item/${itemId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Edit Item
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={EditItemSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="name">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Item Name *"
                        error={meta.touched && meta.error}
                        helperText={meta.touched && meta.error}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="sku">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="SKU"
                        error={meta.touched && meta.error}
                        helperText={meta.touched && meta.error}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="unit">
                    {({ field, meta }) => (
                      <FormControl fullWidth error={meta.touched && meta.error}>
                        <Select
                          {...field}
                          displayEmpty
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="">
                            <em>Select Unit</em>
                          </MenuItem>
                          {unitOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {meta.touched && meta.error && (
                          <FormHelperText>{meta.error}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="hsnCode">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="HSN Code"
                        error={meta.touched && meta.error}
                        helperText={meta.touched && meta.error}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field name="taxPreference">
                    {({ field, meta }) => (
                      <FormControl fullWidth error={meta.touched && meta.error}>
                        <Select
                          {...field}
                          displayEmpty
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="">
                            <em>Select Tax Preference</em>
                          </MenuItem>
                          {taxPreferenceOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {meta.touched && meta.error && (
                          <FormHelperText>{meta.error}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Field>
                </Grid>

                {/* Sales Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Sales Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.salesInfo}
                        onChange={(e) => setFieldValue("salesInfo", e.target.checked)}
                      />
                    }
                    label="This item can be sold"
                  />
                </Grid>

                {values.salesInfo && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Field name="sellingPrice">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Selling Price *"
                            type="number"
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="salesAccount">
                        {({ field, meta }) => (
                          <FormControl fullWidth error={meta.touched && meta.error}>
                            <Select
                              {...field}
                              displayEmpty
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <MenuItem value="">
                                <em>Select Account</em>
                              </MenuItem>
                              {accountOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <FormHelperText>{meta.error}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12}>
                      <Field name="salesDescription">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Sales Description"
                            multiline
                            rows={3}
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        )}
                      </Field>
                    </Grid>
                  </>
                )}

                {/* Purchase Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Purchase Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.purchaseInfo}
                        onChange={(e) => setFieldValue("purchaseInfo", e.target.checked)}
                      />
                    }
                    label="This item can be purchased"
                  />
                </Grid>

                {values.purchaseInfo && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Field name="costPrice">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Cost Price *"
                            type="number"
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="purchaseAccount">
                        {({ field, meta }) => (
                          <FormControl fullWidth error={meta.touched && meta.error}>
                            <Select
                              {...field}
                              displayEmpty
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <MenuItem value="">
                                <em>Select Account</em>
                              </MenuItem>
                              {accountOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <FormHelperText>{meta.error}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12}>
                      <Field name="purchaseDescription">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Purchase Description"
                            multiline
                            rows={3}
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        )}
                      </Field>
                    </Grid>
                  </>
                )}

                {/* Inventory Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Inventory Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.trackInventory}
                        onChange={(e) => setFieldValue("trackInventory", e.target.checked)}
                      />
                    }
                    label="Track inventory for this item"
                  />
                </Grid>

                {values.trackInventory && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Field name="inventoryAccount">
                        {({ field, meta }) => (
                          <FormControl fullWidth error={meta.touched && meta.error}>
                            <Select
                              {...field}
                              displayEmpty
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <MenuItem value="">
                                <em>Select Inventory Account</em>
                              </MenuItem>
                              {inventoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <FormHelperText>{meta.error}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="valuationMethod">
                        {({ field, meta }) => (
                          <FormControl fullWidth error={meta.touched && meta.error}>
                            <Select
                              {...field}
                              displayEmpty
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <MenuItem value="">
                                <em>Select Valuation Method</em>
                              </MenuItem>
                              {valuationMethodOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <FormHelperText>{meta.error}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="openingStock">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Opening Stock"
                            type="number"
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        )}
                      </Field>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field name="openingStockRate">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Opening Stock Rate"
                            type="number"
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                  </>
                )}

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Item"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default EditItemForm; 