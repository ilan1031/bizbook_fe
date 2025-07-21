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
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Alert from "@mui/material/Alert";
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
      console.log("EDIT PAGE - Fetching item details for ID:", itemId);
      console.log("EDIT PAGE - Organization ID:", organization_id);
      
      let response = null;
      
              // Try getitems endpoint first (more reliable)
      try {
          console.log("EDIT PAGE - Trying getitems with item_id filter:", itemId);
          const admin_id = localStorage.getItem("admin_id") || organization_id;
        response = await apiService({
          method: "GET",
            url: `/api/v1/item/getitems`,
            params: { 
              organization_id,
              admin_id: admin_id,
              item_id: itemId 
            },
          });
        console.log("EDIT PAGE - getitems endpoint response:", response.data);
        
        // Extract the specific item from the list
        if (response?.data?.data && Array.isArray(response.data.data)) {
          console.log("EDIT PAGE - Items in response:", response.data.data.length);
          const itemFromList = response.data.data.find(item => {
            const itemIdFromItem = item._id || item.item_id || item.id;
            const matches = itemIdFromItem === itemId || itemIdFromItem === itemId.toString();
            console.log("EDIT PAGE - Checking item:", itemIdFromItem, "against:", itemId, "matches:", matches);
            return matches;
          });
          if (itemFromList) {
            console.log("EDIT PAGE - Found item from getitems list:", itemFromList);
            response = { data: { data: itemFromList } };
          } else {
            console.log("EDIT PAGE - Item not found in getitems response");
          }
        } else {
          console.log("EDIT PAGE - No data array in getitems response");
        }
      } catch (err) {
        console.log("EDIT PAGE - getitems endpoint failed:", err.message);
      }
      
      // Fallback: Try singleitems endpoint
      if (!response || !response.data) {
        try {
          const admin_id = localStorage.getItem("admin_id") || organization_id;
          response = await apiService({
            method: "GET",
            url: `/api/v1/item/singleitems/${itemId}`,
            params: { 
              organization_id,
              admin_id: admin_id
            },
          });
          console.log("EDIT PAGE - singleitems endpoint success:", response.data);
        } catch (err) {
          console.log("EDIT PAGE - singleitems endpoint failed:", err.message);
        }
      }
      
      // Fallback: Try with different endpoint patterns
      if (!response || !response.data) {
        try {
          const admin_id = localStorage.getItem("admin_id") || organization_id;
          response = await apiService({
            method: "GET",
            url: `/api/v1/item/${itemId}`,
            params: { 
              organization_id,
              admin_id: admin_id
            },
          });
          console.log("EDIT PAGE - item/{id} endpoint success:", response.data);
        } catch (err) {
          console.log("EDIT PAGE - item/{id} endpoint failed:", err.message);
        }
      }
      
      if (!response || !response.data) {
        try {
          response = await apiService({
            method: "GET",
            url: `/api/v1/items/${itemId}`,
            params: { organization_id },
          });
          console.log("EDIT PAGE - items/{id} endpoint success:", response.data);
        } catch (err) {
          console.log("EDIT PAGE - items/{id} endpoint failed:", err.message);
        }
      }
      
      // Final fallback: Try to get item from the items list without filtering
      if (!response || !response.data) {
        try {
          const allItemsResponse = await apiService({
            method: "GET",
            url: `/api/v1/item/getitems`,
            params: { 
              organization_id,
              page: 1,
              limit: 100
            },
          });
          console.log("EDIT PAGE - All items response:", allItemsResponse.data);
          
          if (allItemsResponse?.data?.data && Array.isArray(allItemsResponse.data.data)) {
            const itemFromAllList = allItemsResponse.data.data.find(item => {
              const itemId = item._id || item.item_id || item.id;
              return itemId === itemId || itemId === itemId.toString();
            });
            if (itemFromAllList) {
              console.log("EDIT PAGE - Found item from all items list:", itemFromAllList);
              response = { data: { data: itemFromAllList } };
            }
          }
        } catch (err) {
          console.log("EDIT PAGE - All items fallback failed:", err.message);
        }
      }
      
              // If all patterns fail, create a fallback item object based on creation structure
        if (!response) {
          console.warn("All API patterns failed, using fallback data");
          const fallbackItem = {
            id: itemId,
            name: `Item ${itemId}`,
            item_name: `Item ${itemId}`,
            sku: itemId,
            item_id: itemId,
            rate: "0.00",
            rate_formatted: "0.00",
            unit: "pcs",
            status: "active",
            description: "Item details not available",
            purchase_description: "N/A",
            opening_stock: "0",
            account_id: "sales",
            purchase_account_id: "cost-of-goods-sold",
            item_type: "goods",
            type: "goods",
            hsn_or_sac: "",
            hsn_code: "",
            is_taxable: true,
            tax_preference: "taxable",
            can_be_sold: true,
            can_be_purchased: true,
            track_inventory: false,
            purchase_rate: "0.00",
            purchase_rate_formatted: "0.00",
            gst_rate: "12",
            igst_rate: "12",
            preferred_vendor: "",
            valuation_method: "fifo",
            opening_stock_rate: "0.00",
          };
          
          setInitialValues({
            // Basic Information - based on creation format
            name: fallbackItem.name || "",
            type: fallbackItem.item_type || fallbackItem.type || "goods",
            sku: fallbackItem.sku || fallbackItem.item_id || "",
            unit: fallbackItem.unit || "",
            hsnCode: fallbackItem.hsn_or_sac || fallbackItem.hsn_code || "",
            taxPreference: fallbackItem.is_taxable ? "taxable" : (fallbackItem.tax_preference || "taxable"),
            
            // Sales Information - based on creation format
            salesInfo: fallbackItem.can_be_sold !== false,
            sellingPrice: fallbackItem.rate || fallbackItem.rate_formatted || "",
            salesAccount: fallbackItem.account_id || "sales",
            salesDescription: fallbackItem.description || "",
            
            // Purchase Information - based on creation format
            purchaseInfo: fallbackItem.can_be_purchased !== false,
            costPrice: fallbackItem.purchase_rate || fallbackItem.purchase_rate_formatted || "",
            purchaseAccount: fallbackItem.purchase_account_id || "cost-of-goods-sold",
            purchaseDescription: fallbackItem.purchase_description || "",
            preferredVendor: fallbackItem.preferred_vendor || "",
            
            // Tax Information
            gstRate: fallbackItem.gst_rate || "12",
            igstRate: fallbackItem.igst_rate || "12",
            
            // Inventory Information
            trackInventory: fallbackItem.track_inventory || false,
            inventoryAccount: fallbackItem.inventory_account_id || "",
            valuationMethod: fallbackItem.valuation_method || "",
            openingStock: fallbackItem.opening_stock || "",
            openingStockRate: fallbackItem.opening_stock_rate || "",
          });
          return;
        }
      
      // Extract item data from response
      const item = response.data?.data || response.data || response;
      console.log("EDIT PAGE - Extracted item data:", item);
      console.log("EDIT PAGE - Item keys:", Object.keys(item || {}));
      
      // Map the API response to form values based on creation structure
      const mappedValues = {
        // Basic Information - based on creation format
        name: item.name || item.item_name || "",
        type: item.item_type || item.type || "goods",
        sku: item.sku || item.item_id || "",
        unit: item.unit || "",
        hsnCode: item.hsn_or_sac || item.hsn_code || "",
        taxPreference: item.is_taxable ? "taxable" : (item.tax_preference || "taxable"),
        
        // Sales Information - based on creation format
        salesInfo: item.can_be_sold !== false, // Default to true if not explicitly false
        sellingPrice: item.rate || item.rate_formatted || "",
        salesAccount: item.account_id || "sales",
        salesDescription: item.description || "",
        
        // Purchase Information - based on creation format
        purchaseInfo: item.can_be_purchased !== false, // Default to true if not explicitly false
        costPrice: item.purchase_rate || item.purchase_rate_formatted || "",
        purchaseAccount: item.purchase_account_id || "cost-of-goods-sold",
        purchaseDescription: item.purchase_description || "",
        preferredVendor: item.preferred_vendor || "",
        
        // Tax Information
        gstRate: item.gst_rate || "12",
        igstRate: item.igst_rate || "12",
        
        // Inventory Information
        trackInventory: item.track_inventory || false,
        inventoryAccount: item.inventory_account_id || "",
        valuationMethod: item.valuation_method || "",
        openingStock: item.opening_stock || "",
        openingStockRate: item.opening_stock_rate || "",
      };
      
      console.log("EDIT PAGE - Mapped form values:", mappedValues);
      setInitialValues(mappedValues);
    } catch (error) {
      console.error("Error fetching item details:", error);
      showMessage("Error loading item details", "error");
      
      // Set fallback form values based on creation structure
      setInitialValues({
        // Basic Information - based on creation format
        name: `Item ${itemId}`,
        type: "goods",
        sku: itemId,
        unit: "pcs",
        hsnCode: "",
        taxPreference: "taxable",
        
        // Sales Information - based on creation format
        salesInfo: true,
        sellingPrice: "",
        salesAccount: "sales",
        salesDescription: "",
        
        // Purchase Information - based on creation format
        purchaseInfo: true,
        costPrice: "",
        purchaseAccount: "cost-of-goods-sold",
        purchaseDescription: "",
        preferredVendor: "",
        
        // Tax Information
        gstRate: "12",
        igstRate: "12",
        
        // Inventory Information
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
      console.log("Submitting form values:", values);
      
      // Format the data according to your backend model
      const formattedData = {
        item_id: itemId, // Use the actual item ID from URL
        admin_id: localStorage.getItem("admin_id") || organization_id,
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

      console.log("Formatted data for update:", formattedData);

      // Use the correct endpoint based on your backend route: router.put("/item/:id", ...)
      console.log("EDIT PAGE - Attempting update with data:", formattedData);
      console.log("EDIT PAGE - Item ID:", itemId);
      console.log("EDIT PAGE - Organization ID:", organization_id);
      
      // Use the item_id from the form data if available, otherwise use the URL parameter
      const updateItemId = formattedData.item_id || itemId;
      console.log("EDIT PAGE - Using item ID for update:", updateItemId);
      
      try {
        // Get admin_id from localStorage or use organization_id as fallback
        const admin_id = localStorage.getItem("admin_id") || organization_id;
        
        const response = await apiService({
            method: "PUT",
          url: `/api/v1/item/${updateItemId}`,
            data: formattedData,
            params: { 
              organization_id,
            admin_id: admin_id
            },
          });
        
        console.log("EDIT PAGE - Update successful:", response.data);
        
        if (response.data.status) {
          showMessage("Item updated successfully!", "success");
          router.push(`/item/${updateItemId}`);
        } else {
          showMessage(response.data.message || "Failed to update item", "error");
        }
        } catch (err) {
        console.error("EDIT PAGE - Update error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText
        });
        
        // Show specific error message
        const errorMessage = err.response?.data?.message || err.message || "Failed to update item";
        showMessage(errorMessage, "error");
      }
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

  // Create a test item for testing purposes
  const createTestItem = async () => {
    try {
      const testItemData = {
        item_id: `test-${Date.now()}`,
        organization_id: organization_id,
        name: "Test Item",
        item_name: "Test Item",
        unit: "pcs",
        status: "active",
        description: "Test item for editing",
        rate: 100,
        rate_formatted: "100",
        tax_id: "",
        purchase_account_id: "cost-of-goods-sold",
        purchase_account_name: "Cost of Goods Sold",
        account_id: "sales",
        account_name: "Sales",
        purchase_description: "Test purchase description",
        purchase_rate: 80,
        purchase_rate_formatted: "80",
        can_be_sold: true,
        can_be_purchased: true,
        track_inventory: false,
        item_type: "goods",
        item_type_formatted: "Goods",
        is_taxable: true,
        sku: `SKU-${Date.now()}`,
        hsn_or_sac: "12345678",
        tags: [],
      };

      const response = await apiService({
        method: "POST",
        url: "/api/v1/items/newitems",
        data: testItemData,
      });

      console.log("Test item created:", response.data);
      showMessage("Test item created successfully!", "success");
      
      // Navigate to the new item's edit page
      const newItemId = response.data.data?._id || response.data.data?.item_id;
      if (newItemId) {
        router.push(`/item/edit/${newItemId}`);
      }
    } catch (error) {
      console.error("Error creating test item:", error);
      showMessage("Failed to create test item", "error");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // If no item data is found, show option to create test item
  if (!initialValues.name) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          Item Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The item with ID "{itemId}" was not found in the database.
        </Typography>
        
        {/* Show available items */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Items in Database:
          </Typography>
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                const response = await apiService({
                  method: "GET",
                  url: `/api/v1/item/getitems`,
                  params: { 
                    organization_id,
                    page: 1,
                    limit: 10
                  },
                });
                console.log("Available items:", response.data.data);
                showMessage(`Found ${response.data.data?.length || 0} items`, "info");
                
                // Show first few items in console
                if (response.data.data?.length > 0) {
                  console.log("First 3 items:", response.data.data.slice(0, 3));
                  console.log("Item IDs:", response.data.data.slice(0, 3).map(item => ({
                    name: item.item_name || item.name,
                    _id: item._id,
                    item_id: item.item_id,
                    id: item.id
                  })));
                  
                  // Show clickable links to edit existing items
                  const firstItem = response.data.data[0];
                  const firstItemId = firstItem._id || firstItem.item_id || firstItem.id;
                  if (firstItemId) {
                    console.log(`To test editing, go to: http://localhost:3000/item/edit/${firstItemId}`);
                    showMessage(`Click here to edit first item: ${firstItem.item_name || firstItem.name}`, "info");
                  }
                } else {
                  console.log("No items found in database");
                  showMessage("No items found. Create a test item first.", "warning");
                }
              } catch (err) {
                console.error("Error fetching items:", err);
                showMessage("Error fetching items", "error");
              }
            }}
            sx={{ mb: 2 }}
          >
            Check Available Items
          </Button>
        </Box>
        
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={createTestItem}
            startIcon={<AddIcon />}
          >
            Create Test Item
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/item")}
          >
            Back to Items List
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/common/newitem")}
          >
            Create New Item
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" component="h1">
          Edit Item
        </Typography>
        <Button
          onClick={handleBack}
          sx={{ color: "red" }}
        >
          <CloseIcon />
        </Button>
      </Box>
      


      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={EditItemSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
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
                  <Box sx={{display:"flex",alignItems:"center", pb:1,}}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "140px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mr: 1, fontWeight: "400", fontSize: "13px" }}
                    >
                      Type
                    </Typography>
                    <Tooltip title="Select if this is a physical product (Goods) or a service you provide">
                      <IconButton size="small">
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center"}}>
                    <RadioGroup
                      row
                      name="type"
                      value={values.type}
                      onChange={(e) => {
                        const newType = e.target.value;
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
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "error.main",
                            fontSize: "13px",
                            fontWeight: "500",
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
                          error={touched.name && !!errors.name}
                          helperText={touched.name && errors.name}
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
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            // fontWeight: "bold",
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                            fontSize:"13px",
                            fontWeight:"400"
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
                          error={touched.sku && !!errors.sku}
                          helperText={touched.sku && errors.sku}
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
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            // fontWeight: "bold",
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
                          error={touched.unit && !!errors.unit}
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
                            {touched.unit && errors.unit}
                          </FormHelperText>
                        </FormControl>
                      </Box>

                      {/* HSN Code Field */}
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            // fontWeight: "bold",
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                            fontWeight:"400",
                            fontSize:"13px",
                          }}
                        >
                          {values.type === "goods" ? "HSN Code" : "SAC"}
                        </Typography>
                        <Box sx={{ position: "relative", width: "100%" }}>
                          <TextField
                            fullWidth
                            name="hsnCode"
                            placeholder={values.type === "goods" ? "" : ""}
                            value={values.hsnCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.hsnCode && !!errors.hsnCode}
                            helperText={touched.hsnCode && errors.hsnCode}
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
                              position: "absolute",
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
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "error.main",
                            // fontWeight: "bold",
                            width: { xs: "100%", sm: "200px" },
                            mb: { xs: 1, sm: 0 },
                            fontWeight:"400",
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
                            touched.taxPreference && !!errors.taxPreference
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
                            {touched.taxPreference && errors.taxPreference}
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
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
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
                          sx={{ textAlign: "center",fontSize:"13px" }}
                        >
                          Drag image(s) here or
                        </Typography>
                        <Button
                          variant="text"
                          component="label"
                          size="small"
                          sx={{ color: "primary.main", fontWeight:"500",fontSize:"12PX" }}
                        >
                          Browse images
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              console.log(e.currentTarget.files[0]);
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
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
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
                              // sx={{ fontWeight: "bold" }}
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
                            display: "flex",
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
                              fontWeight:"400",
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
                              !!errors.sellingPrice
                            }
                            helperText={
                              values.salesInfo &&
                              touched.sellingPrice &&
                              errors.sellingPrice
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
                            display: "flex",
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
                                fontWeight:"400",
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
                              !!errors.salesAccount
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
                              <MenuItem value="sales"></MenuItem>
                              {accountOptions
                                .filter((opt) => opt.value !== "sales")
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
                                errors.salesAccount}
                            </FormHelperText>
                          </FormControl>
                        </Box>

                        <Box
                          sx={{
                            mb: 2,
                            display: "flex",
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
                                fontWeight:"400",
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
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
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
                              // sx={{ fontWeight: "bold" }}
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
                            display: "flex",
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
                                fontWeight:"400",
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
                              !!errors.costPrice
                            }
                            helperText={
                              values.purchaseInfo &&
                              touched.costPrice &&
                              errors.costPrice
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
                            display: "flex",
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
                                fontWeight:"400",
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
                              !!errors.purchaseAccount
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
                              <MenuItem value="cost-of-goods-sold"></MenuItem>
                              {accountOptions
                                .filter(
                                  (opt) => opt.value !== "cost-of-goods-sold"
                                )
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
                                errors.purchaseAccount}
                            </FormHelperText>
                          </FormControl>
                        </Box>

                        <Box
                          sx={{
                            mb: 2,
                            display: "flex",
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
                                fontWeight:"400",
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
                            display: "flex",
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
                                fontWeight:"400",
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
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Grid item xs={12} sm={5}>
                        <Box
                          sx={{
                            display: "flex",
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
                              fontWeight:"400",
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
                                  fontWeight: "400",
                                },
                              }}
                            >
                              {gstRates.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                  sx={{fontWeight:"400",
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
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            // mb: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              // fontWeight: "bold",
                              width: { xs: "100%", sm: "250px" },
                              mb: { xs: 1, sm: 0 },
                              fontWeight:"400",
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
                                  fontWeight: "400",
                                },
                              }}
                            >
                              {igstRates.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  sx={{fontWeight:"400",
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
                    <Box sx={{ display: "flex", mb: 0 }}>
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
                            sx={{ fontWeight: "400", fontSize:"13px",mt:0.5 }}
                          >
                            Track Inventory for this item
                          </Typography>
                        }
                      />
                      <Tooltip title="Track quantity and value of this item in inventory">
                        <IconButton size="small">
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
                                  display: "flex",
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
                                    // fontWeight: "bold",
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
                                    !!errors.inventoryAccount
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
                                      errors.inventoryAccount}
                                  </FormHelperText>
                                </FormControl>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={4} mr={3}>
                              <Box
                                sx={{
                                  display: "flex",
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
                                    // fontWeight: "bold",
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
                                    !!errors.valuationMethod
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
                                      errors.valuationMethod}
                                  </FormHelperText>
                                </FormControl>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <Box
                                sx={{
                                  display: "flex",
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
                                    // fontWeight: "bold",
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
                                    !!errors.openingStock
                                  }
                                  helperText={
                                    touched.openingStock && errors.openingStock
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
                                  display: "flex",
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
                                    // fontWeight: "bold",
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
                                    !!errors.openingStockRate
                                  }
                                  helperText={
                                    touched.openingStockRate &&
                                    errors.openingStockRate
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
                    display: "flex",
                    flexWrap: "wrap",
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
                      textTransform: "none",
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
                      textTransform: "none",
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
      </Paper>
    </Box>
  );
};

export default EditItemForm;
