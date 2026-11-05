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
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { useRouter, useSearchParams } from "next/navigation";
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

// What a purchase of the item is booked to: cost of goods or an expense.
const purchaseAccountOptions = [
  { value: "cost-of-goods-sold", label: "Cost of Goods Sold" },
  { value: "job-costing", label: "Job Costing" },
  { value: "labor", label: "Labor" },
  { value: "materials", label: "Materials" },
  { value: "subcontractor", label: "Subcontractor" },
  { value: "advertising-and-marketing", label: "Advertising And Marketing" },
  { value: "office-supplies", label: "Office Supplies" },
  { value: "printing-and-stationery", label: "Printing and Stationery" },
  { value: "repairs-and-maintenance", label: "Repairs and Maintenance" },
  { value: "travel-expense", label: "Travel Expense" },
  { value: "it-and-internet-expenses", label: "IT and Internet Expenses" },
  { value: "other-expenses", label: "Other Expenses" },
];

const NewItemSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  sku: Yup.string(),
  unit: Yup.string(),
  hsnCode: Yup.string(),
  taxPreference: Yup.string().required("Tax Preference is required"),
  salesInfo: Yup.boolean(),
  sellingPrice: Yup.number()
    .typeError("Enter a number")
    .min(0, "Selling Price can't be negative")
    .when("salesInfo", {
      is: true,
      then: (schema) => schema.required("Selling Price is required"),
    }),
  salesAccount: Yup.string().when("salesInfo", {
    is: true,
    then: (schema) => schema.required("Account is required"),
  }),
  salesDescription: Yup.string(),
  purchaseInfo: Yup.boolean(),
  costPrice: Yup.number()
    .typeError("Enter a number")
    .min(0, "Cost Price can't be negative")
    .when("purchaseInfo", {
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
  // Blank means no reorder level (0).
  reorderLevel: Yup.number()
    .transform((v, original) => (original === "" ? undefined : v))
    .typeError("Enter a number")
    .min(0, "Reorder level can't be negative"),
});

const NewItemForm = ({ onClose } = {} as any) => {
  const { showMessage } = useSnackbar();
  const organization_id = localStorage.getItem("organization_id");
  const checkType = localStorage.getItem("addItem");
  const router = useRouter();
  const searchParams = useSearchParams()!;

  // State for initial values
  const [initialValues, setInitialValues] = useState<any>({
    type: "goods",
    name: "",
    sku: "",
    unit: "",
    hsnCode: "",
    taxPreference: "taxable",
    salesInfo: true,
    sellingPrice: "",
    salesAccount: "sales",
    salesDescription: "",
    purchaseInfo: true,
    costPrice: "",
    purchaseAccount: "cost-of-goods-sold",
    purchaseDescription: "",
    preferredVendor: "",
    gstRate: "18",
    igstRate: "18",
    trackInventory: false,
    inventoryAccount: "",
    valuationMethod: "",
    openingStock: "",
    openingStockRate: "",
    reorderLevel: "",
  });

  // The organisation's vendors, for "Preferred Vendor".
  const [vendorOptions, setVendorOptions] = useState<any>([]);
  useEffect(() => {
    if (!organization_id) return;
    apiService({ method: "GET", url: `/api/v1/vendors?organization_id=${organization_id}` })
      .then((res) =>
        setVendorOptions(
          (res.data?.data || []).map((v) => ({ value: String(v._id), label: v.contact_name }))
        )
      )
      .catch(() => setVendorOptions([]));
  }, [organization_id]);

  // CLONE LOGIC: ?clone=<item_id> prefills the form from that item.
  const cloneId = searchParams.get("clone");
  useEffect(() => {
    if (!cloneId) return;
    apiService({
      method: "GET",
      url: `/api/v1/item/singleitems/${encodeURIComponent(cloneId)}`,
      params: { organization_id },
    })
      .then((res) => {
        const item = res.data?.data?.item_details || {};
        setInitialValues((prev) => ({
          ...prev,
          // Copy the item, but the name and SKU must be new.
          type: item.item_type || prev.type,
          name: "",
          sku: "",
          unit: item.unit || "",
          hsnCode: item.hsn_or_sac || "",
          taxPreference: item.is_taxable === false ? "non-taxable" : "taxable",
          sellingPrice: item.rate ?? "",
          salesAccount: item.account_id || prev.salesAccount,
          salesDescription: item.description || "",
          costPrice: item.purchase_rate ?? "",
          purchaseAccount: item.purchase_account_id || prev.purchaseAccount,
          purchaseDescription: item.purchase_description || "",
          preferredVendor: item.preferred_vendor_id || "",
          gstRate: item.gst_rate != null ? String(item.gst_rate) : prev.gstRate,
          igstRate: item.igst_rate != null ? String(item.igst_rate) : prev.igstRate,
          salesInfo: item.can_be_sold !== false,
          purchaseInfo: item.can_be_purchased !== false,
        }));
      })
      .catch((err) => {
        showMessage(err?.message || "Failed to load item for cloning", "error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloneId]);

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Format the data according to your model
      const formattedData = {
        item_id: values.sku || Date.now().toString(),
        organization_id: `${organization_id}`,
        name: values.name,
        item_name: values.name,
        unit: values.unit,
        status: "active",
        description: values.salesDescription,
        rate: values.sellingPrice,
        rate_formatted: values.sellingPrice?.toString(),
        tax_id: "",
        // item_tax_preferences: [],
        purchase_account_id: values.purchaseAccount,
        purchase_account_name:
          purchaseAccountOptions.find((opt) => opt.value === values.purchaseAccount)
            ?.label || "",
        preferred_vendor_id: values.preferredVendor || "",
        preferred_vendor_name:
          vendorOptions.find((opt) => opt.value === values.preferredVendor)?.label || "",
        igst_rate: values.taxPreference === "taxable" ? Number(values.igstRate) || 0 : 0,
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
        // Stock at or below this quantity is flagged as low stock.
        reorder_level: values.reorderLevel === "" || values.reorderLevel == null ? 0 : Number(values.reorderLevel) || 0,
        item_type: values.type,
        item_type_formatted: values.type === "goods" ? "Goods" : "Service",
        is_taxable: values.taxPreference === "taxable",
        sku: values.sku,
        hsn_or_sac: values.hsnCode,
        // GST charged on sales (split CGST+SGST or IGST by place of supply)
        gst_rate: values.taxPreference === "taxable" ? Number(values.gstRate) || 0 : 0,
        tags: [] as any[],
      };

      // Submit the data
      await apiService({
        method: "POST",
        url: "/api/v1/items/newitems",
        data: formattedData,
      });

      showMessage("Item has been created successfully!", "success");
      // setOpenSuccessDialog(true);
      resetForm();
      // Opened as a page: go back to the list. Opened in a dialog: close it.
      if (onClose) {
        onClose();
      } else {
        localStorage.removeItem("addItem");
        router.push("/items/itemtable");
      }
    } catch (error) {
      showMessage(error?.message || "Error submitting the form", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () =>{
      console.log(checkType);
    localStorage.removeItem("addItem");
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }

  return (
    <Box sx={{ maxWidth: "1300px", mx: "auto", }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          // borderRadius: 1,
        }}
      >
        <Box sx={{display:"flex" as const,justifyContent:"space-between" as const,alignItems:"center" as const}}>
        <Typography variant="h6" sx={{ mt: 3, mb: 5,fontSize:"23px",fontWeight:"400 !important" as const }}>
          New Item
        </Typography>
        <Button
              onClick={() => (onClose ? onClose() : router.back())}
              aria-label="Close"
              sx={{ mt: 3,mb: 5, color: "RED" }}
              data-testid="close-new-item-modal"
            >
              <CloseIcon />
            </Button>
        </Box>
        

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={NewItemSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Type Selection */}
                <Grid
                  item
                  xs={12}
                  sx={{ backgroundColor: "#fafafa", p: 0, borderRadius: 1 }}
                >
                  <Box sx={{display:"flex" as const,alignItems:"center" as const, pb:1,}}>
                  <Box
                    sx={{
                      display: "flex" as const,
                      alignItems: "center" as const,
                      width: "140px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mr: 1, fontWeight: "400" as const, fontSize: "13px" }}
                    >
                      Type
                    </Typography>
                    <Tooltip title="Select if this is a physical product (Goods) or a service you provide">
                      <IconButton aria-label="Help" onClick={() => window.dispatchEvent(new Event("bizbooks:help"))} size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: "flex" as const, alignItems: "center" as const}}>
                    <RadioGroup
                      row
                      name="type"
                      value={values.type}
                      onChange={(e) => {
                        const newType = (e.target as any).value;
                        setFieldValue("type", newType);
                        if (newType === "service" && values.trackInventory) {
                          setFieldValue("trackInventory", false);
                        }
                      }}
                    >
                      <FormControlLabel
                        value="goods"
                        control={<Radio color="primary" />}
                        sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
                        label="Goods"
                      />
                      <FormControlLabel
                        value="service"
                        control={<Radio color="primary" />}
                        sx={{ "& .MuiFormControlLabel-label": { fontSize: "13px" } }}
                        label="Service"
                      />
                    </RadioGroup>
                  </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4.5}>
                      {/* Name Field */}
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex" as const,
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "error.main",
                            fontSize: "13px",
                            fontWeight: "500" as const,
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                          }}
                        >
                          Name*
                        </Typography>
                        <TextField
                          fullWidth
                          name="name"
                          // placeholder="Enter item name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && !!(errors.name as any)}
                          helperText={touched.name && (errors.name as any)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                          }}
                        />
                      </Box>

                      {/* SKU Field */}
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex" as const,
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            // fontWeight: "bold" as const,
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                            fontSize:"13px",
                            fontWeight:"400" as const
                          }}
                        >
                          SKU
                        </Typography>
                        <TextField
                          fullWidth
                          name="sku"
                          // placeholder="Enter SKU"
                          value={values.sku}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.sku && !!(errors.sku as any)}
                          helperText={touched.sku && (errors.sku as any)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                          }}
                        />
                      </Box>

                      {/* Unit Field */}
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex" as const,
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            // fontWeight: "bold" as const,
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                          }}
                        >
                          Unit
                        </Typography>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                          }}
                          error={touched.unit && !!(errors.unit as any)}
                        >
                          <Select
                            name="unit"
                            value={values.unit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            displayEmpty
                            variant="outlined"
                          >
                            <MenuItem disabled value="">
                              <em></em>
                            </MenuItem>
                            {unitOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {touched.unit && (errors.unit as any)}
                          </FormHelperText>
                        </FormControl>
                      </Box>

                      {/* HSN Code Field */}
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex" as const,
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            // fontWeight: "bold" as const,
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                            fontWeight:"400" as const,
                            fontSize:"13px",
                          }}
                        >
                          {values.type === "goods" ? "HSN Code" : "SAC"}
                        </Typography>
                        <Box sx={{ position: "relative" as const, width: "100%" }}>
                          <TextField
                            fullWidth
                            name="hsnCode"
                            placeholder={values.type === "goods" ? "" : ""}
                            value={values.hsnCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.hsnCode && !!(errors.hsnCode as any)}
                            helperText={touched.hsnCode && (errors.hsnCode as any)}
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                            }}
                          />
                          <IconButton
                            sx={{
                              position: "absolute" as const,
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                            size="small"
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Tax Preference */}
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex" as const,
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "error.main",
                            // fontWeight: "bold" as const,
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                            fontWeight:"400" as const,
                            fontSize:"13px",
                          }}
                        >
                          Tax Preference*
                        </Typography>
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                          }}
                          error={
                            touched.taxPreference && !!(errors.taxPreference as any)
                          }
                        >
                          <Select
                            name="taxPreference"
                            value={values.taxPreference}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            displayEmpty
                            variant="outlined"
                          >
                            {taxPreferenceOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {touched.taxPreference && (errors.taxPreference as any)}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    </Grid>

                    {/* Image Upload */}
                    <Grid item xs={12} md={5}>
                      <Box
                        sx={{
                          border: "1px dashed #ccc",
                          borderRadius: 1,
                          p: 3,
                          display: "flex" as const,
                          flexDirection: "column" as const,
                          alignItems: "center" as const,
                          justifyContent: "center" as const,
                          height: "70%",
                          width: "300px",
                          minHeight: { xs: 150, md: 220 },
                        }}
                      >
                        <CloudUploadIcon
                          sx={{ fontSize: 36, color: "text.secondary", mb: 1 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ textAlign: "center" as const,fontSize:"13px" }}
                        >
                          Drag image(s) here or
                        </Typography>
                        <Button
                          variant={"text" as any}
                          component="label"
                          size="small"
                          sx={{ color: "primary.main", fontWeight:"500" as const,fontSize:"12PX" }}
                        >
                          Browse images
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              console.log(e.currentTarget.files![0]);
                            }}
                          />
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={{ xs: 2, md: 4 }}>
                    {/* Sales Information Section */}
                    <Grid item xs={12} md={5}>
                      <Box
                        sx={{ display: "flex" as const, alignItems: "center" as const, mb: 1 }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.salesInfo}
                              onChange={(e) => {
                                setFieldValue("salesInfo", e.target.checked);
                              }}
                              name="salesInfo"
                              color="primary"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle1"
                              // sx={{ fontWeight: "bold" as const }}
                            >
                              Sales Information
                            </Typography>
                          }
                        />
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            mb: 2,
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: { xs: 1, sm: 0 },
                              width: { xs: "100%", sm: "200px" },
                              color: values.salesInfo
                                ? "error.main"
                                : "text.disabled",
                              fontWeight:"400" as const,
                              fontSize:"13px",
                            }}
                          >
                            Selling Price*
                          </Typography>
                          <TextField
                            fullWidth
                            name="sellingPrice"
                            // placeholder="0.00"
                            value={values.sellingPrice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              values.salesInfo &&
                              touched.sellingPrice &&
                              !!(errors.sellingPrice as any)
                            }
                            helperText={
                              values.salesInfo &&
                              touched.sellingPrice &&
                              (errors.sellingPrice as any)
                            }
                            type="number"
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                              "& .MuiTypography-root": { fontSize: "13px" }
                            }}
                            disabled={!values.salesInfo}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment  position="start">
                                  INR
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            mb: 2,
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: { xs: 1, sm: 0 },
                              width: { xs: "100%", sm: "200px" },
                              color: values.salesInfo
                                ? "error.main"
                                : "text.disabled",
                                fontWeight:"400" as const,
                                fontSize:"13px",
                            }}
                          >
                            Account*
                          </Typography>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                            }}
                            error={
                              values.salesInfo &&
                              touched.salesAccount &&
                              !!(errors.salesAccount as any)
                            }
                          >
                            <Select
                              name="salesAccount"
                              value={values.salesAccount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              variant="outlined"
                              disabled={!values.salesInfo}
                            >
                              {accountOptions
                                .map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                              {values.salesInfo &&
                                touched.salesAccount &&
                                (errors.salesAccount as any)}
                            </FormHelperText>
                          </FormControl>
                        </Box>

                        <Box
                          sx={{
                            mb: 2,
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: { xs: 1, sm: 0 },
                              width: { xs: "100%", sm: "200px" },
                              color: values.salesInfo
                                ? "text.primary"
                                : "text.disabled",
                                fontWeight:"400" as const,
                                fontSize:"13px",
                            }}
                          >
                            Description
                          </Typography>
                          <TextField
                            fullWidth
                            name="salesDescription"
                            // placeholder="Enter description (optional)"
                            value={values.salesDescription}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            multiline
                            rows={2}
                            variant="outlined"
                            size="small"
                            disabled={!values.salesInfo}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Purchase Information Section */}
                    <Grid item xs={12} md={5}>
                      <Box
                        sx={{ display: "flex" as const, alignItems: "center" as const, mb: 2 }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.purchaseInfo}
                              onChange={(e) => {
                                setFieldValue("purchaseInfo", e.target.checked);
                              }}
                              name="purchaseInfo"
                              color="primary"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle1"
                              // sx={{ fontWeight: "bold" as const }}
                            >
                              Purchase Information
                            </Typography>
                          }
                        />
                      </Box>

                      <Box sx={{ ml: 3 }}>
                        <Box
                          sx={{
                            mb: 2,
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: { xs: 1, sm: 0 },
                              width: { xs: "100%", sm: "200px" },
                              color: values.purchaseInfo
                                ? "error.main"
                                : "text.disabled",
                                fontWeight:"400" as const,
                                fontSize:"13px",
                            }}
                          >
                            Cost Price*
                          </Typography>
                          <TextField
                            fullWidth
                            name="costPrice"
                            // placeholder="0.00"
                            value={values.costPrice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              values.purchaseInfo &&
                              touched.costPrice &&
                              !!(errors.costPrice as any)
                            }
                            helperText={
                              values.purchaseInfo &&
                              touched.costPrice &&
                              (errors.costPrice as any)
                            }
                            type="number"
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                              "& .MuiTypography-root": { fontSize: "13px" }
                            }}
                            disabled={!values.purchaseInfo}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  INR
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            mb: 2,
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: { xs: 1, sm: 0 },
                              width: { xs: "100%", sm: "200px" },
                              color: values.purchaseInfo
                                ? "error.main"
                                : "text.disabled",
                                fontWeight:"400" as const,
                                fontSize:"13px",
                            }}
                          >
                            Account*
                          </Typography>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                            }}
                            error={
                              values.purchaseInfo &&
                              touched.purchaseAccount &&
                              !!(errors.purchaseAccount as any)
                            }
                          >
                            <Select
                              name="purchaseAccount"
                              value={values.purchaseAccount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              variant="outlined"
                              disabled={!values.purchaseInfo}
                            >
                              {purchaseAccountOptions
                                .map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                              {values.purchaseInfo &&
                                touched.purchaseAccount &&
                                (errors.purchaseAccount as any)}
                            </FormHelperText>
                          </FormControl>
                        </Box>

                        <Box
                          sx={{
                            mb: 2,
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: { xs: 1, sm: 0 },
                              width: { xs: "100%", sm: "200px" },
                              color: values.purchaseInfo
                                ? "text.primary"
                                : "text.disabled",
                                fontWeight:"400" as const,
                                fontSize:"13px",
                            }}
                          >
                            Description
                          </Typography>
                          <TextField
                            fullWidth
                            name="purchaseDescription"
                            // placeholder="Enter description (optional)"
                            value={values.purchaseDescription}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            multiline
                            rows={2}
                            variant="outlined"
                            size="small"
                            disabled={!values.purchaseInfo}
                          />
                        </Box>

                        <Box
                          sx={{
                            mb: 2,
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: { xs: 1, sm: 0 },
                              width: { xs: "100%", sm: "200px" },
                              color: values.purchaseInfo
                                ? "text.primary"
                                : "text.disabled",
                                fontWeight:"400" as const,
                                fontSize:"13px",
                            }}
                          >
                            Preferred Vendor
                          </Typography>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                            }}
                          >
                            <Select
                              name="preferredVendor"
                              value={values.preferredVendor}
                              onChange={handleChange}
                              displayEmpty
                              variant="outlined"
                              disabled={!values.purchaseInfo}
                            >
                              <MenuItem disabled value="">
                                <em></em>
                              </MenuItem>
                              {vendorOptions.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* GST/IGST Rates */}
                {values.taxPreference === "taxable" && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Default Tax Rates
                    </Typography>
                    <Grid
                      container
                      spacing={2}
                      sx={{ display: "flex" as const, flexDirection: "column" as const }}
                    >
                      <Grid item xs={12} sm={5}>
                        <Box
                          sx={{
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              width: { xs: "100%", sm: "250px" },
                              mb: { xs: 1, sm: 0 },
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                              fontWeight:"400" as const,
                              fontSize:"13px",
                            }}
                          >
                            Intra State Tax Rate
                          </Typography>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                              
                            }}
                          >
                            <Select
                              name="gstRate"
                              value={values.gstRate}
                              onChange={handleChange}
                              displayEmpty
                              variant="outlined"
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "35px",
                                },
                                "& .MuiSelect-select": {
                                  fontSize: "13px", // Adjust the font size of the selected value
                                  fontWeight: "400" as const,
                                },
                              }}
                            >
                              {gstRates.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                  sx={{fontWeight:"400" as const,
                                    fontSize:"13px",}}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <Box
                          sx={{
                            display: "flex" as const,
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            // mb: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              // fontWeight: "bold" as const,
                              width: { xs: "100%", sm: "250px" },
                              mb: { xs: 1, sm: 0 },
                              fontWeight:"400" as const,
                              fontSize:"13px",
                            }}
                          >
                            Inter State Tax Rate
                          </Typography>
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                              fontSize:"13PX"
                            }}
                          >
                            <Select
                              name="igstRate"
                              value={values.igstRate}
                              onChange={handleChange}
                              displayEmpty
                              variant="outlined"
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "35px",
                                },
                                "& .MuiSelect-select": {
                                  fontSize: "13px", // Adjust the font size of the selected value
                                  fontWeight: "400" as const,
                                },
                              }}
                            >
                              {igstRates.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  sx={{fontWeight:"400" as const,
                                    fontSize:"13px",}}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Inventory Tracking Section - Only show if type is goods */}
                {values.type === "goods" && (
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex" as const, mb: 0 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.trackInventory}
                            onChange={(e) => {
                              setFieldValue("trackInventory", e.target.checked);
                            }}
                            name="trackInventory"
                            color="primary"
                            sx={{
                              transform: "scale(0.9)",
                            }}
                          />
                        }
                        label={
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "400" as const, fontSize:"13px",mt:0.5 }}
                          >
                            Track Inventory for this item
                          </Typography>
                        }
                      />
                      <Tooltip title="Track quantity and value of this item in inventory">
                        <IconButton aria-label="Help" onClick={() => window.dispatchEvent(new Event("bizbooks:help"))} size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {values.trackInventory && (
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize:"13px " }}
                        >
                          You cannot enable/disable inventory tracking once
                          youve created transactions for this item
                        </Typography>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Box
                                sx={{
                                  display: "flex" as const,
                                  flexDirection: { xs: "column", sm: "row" },
                                  alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                  },
                                  mb: 2,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    mb: { xs: 1, sm: 0 },
                                    width: { xs: "100%", sm: "220px" },
                                    color: "error.main",
                                    // fontWeight: "bold" as const,
                                    fontSize:"13px"
                                  }}
                                >
                                  Inventory Account*
                                </Typography>
                                <FormControl
                                  fullWidth
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "35px",
                                    },
                                  }}
                                  error={
                                    touched.inventoryAccount &&
                                    !!(errors.inventoryAccount as any)
                                  }
                                >
                                  <Select
                                    name="inventoryAccount"
                                    value={values.inventoryAccount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    displayEmpty
                                    variant="outlined"
                                  >
                                    <MenuItem disabled value="">
                                      <em></em>
                                    </MenuItem>
                                    {inventoryOptions.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>
                                    {touched.inventoryAccount &&
                                      (errors.inventoryAccount as any)}
                                  </FormHelperText>
                                </FormControl>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={4} mr={3}>
                              <Box
                                sx={{
                                  display: "flex" as const,
                                  flexDirection: { xs: "column", sm: "row" },
                                  alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                  },
                                  // mb: 2,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    mb: { xs: 1, sm: 0 },
                                    width: { xs: "100%", sm: "220px" },
                                    color: "error.main",
                                    // fontWeight: "bold" as const,
                                    fontSize:"13px"
                                  }}
                                >
                                  Valuation Method*
                                </Typography>
                                <FormControl
                                  fullWidth
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "35px",
                                    },
                                  }}
                                  error={
                                    touched.valuationMethod &&
                                    !!(errors.valuationMethod as any)
                                  }
                                >
                                  <Select
                                    name="valuationMethod"
                                    value={values.valuationMethod}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    displayEmpty
                                    variant="outlined"
                                  >
                                    <MenuItem disabled value="">
                                      <em></em>
                                    </MenuItem>
                                    {valuationMethodOptions.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>
                                    {touched.valuationMethod &&
                                      (errors.valuationMethod as any)}
                                  </FormHelperText>
                                </FormControl>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <Box
                                sx={{
                                  display: "flex" as const,
                                  flexDirection: { xs: "column", sm: "row" },
                                  alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                  },
                                  mb: 2,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    mb: { xs: 1, sm: 0 },
                                    width: { xs: "100%", sm: "220px" },
                                    // fontWeight: "bold" as const,
                                    fontSize:"13px"
                                  }}
                                >
                                  Opening Stock
                                </Typography>
                                <TextField
                                  fullWidth
                                  name="openingStock"
                                  placeholder="0"
                                  value={values.openingStock}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.openingStock &&
                                    !!(errors.openingStock as any)
                                  }
                                  helperText={
                                    touched.openingStock && (errors.openingStock as any)
                                  }
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "35px",
                                    },
                                  }}
                                />
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <Box
                                sx={{
                                  display: "flex" as const,
                                  flexDirection: { xs: "column", sm: "row" },
                                  alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                  },
                                  mb: 2,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    mb: { xs: 1, sm: 0 },
                                    width: { xs: "100%", sm: "220px" },
                                    // fontWeight: "bold" as const,
                                    fontSize:"13px"
                                  }}
                                >
                                  Opening Stock Rate
                                </Typography>
                                <TextField
                                  fullWidth
                                  name="openingStockRate"
                                  placeholder="0.00"
                                  value={values.openingStockRate}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.openingStockRate &&
                                    !!(errors.openingStockRate as any)
                                  }
                                  helperText={
                                    touched.openingStockRate &&
                                    (errors.openingStockRate as any)
                                  }
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "35px",
                                    },
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        INR
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: "flex" as const, flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: { xs: 1, sm: 0 }, width: { xs: "100%", sm: "220px" }, fontSize: "13px" }}>
                                  Reorder Level
                                </Typography>
                                <TextField
                                  fullWidth
                                  name="reorderLevel"
                                  placeholder="0"
                                  value={values.reorderLevel}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.reorderLevel && !!(errors.reorderLevel as any)}
                                  helperText={touched.reorderLevel && (errors.reorderLevel as any)}
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  sx={{ "& .MuiInputBase-root": { height: "35px" } }}
                                  inputProps={{ "aria-label": "Reorder level" }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </>
                    )}
                  </Grid>
                )}

                {/* Form Actions */}

                <Paper
                  elevation={0}
                  sx={{
                    display: "flex" as const,
                    flexWrap: "wrap" as const,
                    gap: 2,
                    mt: 2,
                    bgcolor: "white",
                    width: "100%",
                    p:1.5,
                    pl:3,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      textTransform: "none" as const,
                      backgroundColor: "#408dfb",
                      color: "white",
                      borderRadius: "5px",
                      px: 2,
                      py: 0.75,
                      fontWeight: 400,
                      fontSize: "14px",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                        boxShadow: "none",
                      },
                    }}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      textTransform: "none" as const,
                      borderColor: "#ddd",
                      color: "#333",
                      borderRadius: "5px",
                      px: 2,
                      py: 0.75,
                      fontWeight: 400,
                      fontSize: "14px",
                      "&:hover": {
                        borderColor: "#bbb",
                        backgroundColor: "#f8f8f8",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Paper>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default NewItemForm;
