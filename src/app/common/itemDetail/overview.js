"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";

const sections = [
  {
    title: null,
    fields: [
      { key: "item_type", label: "Item Type", apiKeys: ["type", "item_type", "category"] },
      { key: "unit", label: "Unit", apiKeys: ["unit", "unit_name"] },
      { key: "created_source", label: "Created Source", apiKeys: ["created_source", "source"] },
      { key: "tax_preference", label: "Tax Preference", apiKeys: ["tax_preference", "tax_treatment", "tax_type"] },
      { key: "inventory_account", label: "Inventory Account", apiKeys: ["inventory_account", "inventory_account_name"] },
      { key: "inventory_valuation_method", label: "Inventory Valuation Method", apiKeys: ["inventory_valuation_method", "valuation_method"] },
    ],
  },
  {
    title: "Purchase Information",
    fields: [
      { key: "cost_price", label: "Cost Price", isCurrency: true, apiKeys: ["cost_price", "purchase_rate", "purchase_price"] },
      { key: "purchase_account", label: "Purchase Account", apiKeys: ["purchase_account", "purchase_account_name"] },
      { key: "purchase_description", label: "Description", apiKeys: ["purchase_description", "description"] },
      { key: "preferred_vendor", label: "Preferred Vendor", apiKeys: ["preferred_vendor", "vendor_name"] },
    ],
  },
  {
    title: "Sales Information",
    fields: [
      { key: "selling_price", label: "Selling Price", isCurrency: true, apiKeys: ["selling_price", "rate", "sales_price"] },
      { key: "sales_account", label: "Sales Account", apiKeys: ["sales_account", "account_name", "sales_account_name"] },
      { key: "sales_description", label: "Description", apiKeys: ["sales_description", "description"] },
    ],
  },
];

const ItemOverview = ({ data: propData, itemId, organizationId, forceRefresh = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use prop data if provided, otherwise fetch from API
  useEffect(() => {
    console.log("ItemOverview - propData:", propData);
    console.log("ItemOverview - itemId:", itemId);
    console.log("ItemOverview - organizationId:", organizationId);
    
    // If propData is provided, use it directly
    if (propData) {
      console.log("ItemOverview - Using propData:", propData);
      setData(propData);
      setLoading(false);
      setError(null);
      return;
    }

    // Only fetch from API if propData is not provided
    if (!itemId || !organizationId) {
      setLoading(false);
      setError("Missing item ID or organization ID");
      return;
    }

    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("ItemOverview - Fetching from /item/singleitems/", itemId);
        const response = await apiService({
          method: "GET",
          url: `/api/v1/item/singleitems/${itemId}`,
          params: { organization_id: organizationId },
        });
        console.log("ItemOverview - API response:", response);
        if (response && response.data && response.data.data && response.data.data.item_details) {
          setData(response.data.data.item_details);
          console.log("ItemOverview - Set data to item_details:", response.data.data.item_details);
        } else {
          setData(null);
          setError("No item details found in response");
          console.log("ItemOverview - No item_details in response:", response);
        }
      } catch (err) {
        setError("Failed to load item details");
        setData(null);
        console.error("ItemOverview - Error fetching item details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [propData, itemId, organizationId, forceRefresh]); // Added propData to dependencies

  const formatCurrency = (value) =>
    value != null && value !== "-" && value !== ""
      ? `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
      : "-";

  // Helper function to get field value with fallbacks
  const getFieldValue = (field, data) => {
    if (!data) return null;
    
    // Try the primary key first
    if (data[field.key] !== undefined && data[field.key] !== null && data[field.key] !== "") {
      return data[field.key];
    }
    
    // Try alternative API keys
    if (field.apiKeys) {
      for (const apiKey of field.apiKeys) {
        if (data[apiKey] !== undefined && data[apiKey] !== null && data[apiKey] !== "") {
          return data[apiKey];
        }
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 0, pt: 3, pr: 6 }}>
        <Typography color="error" sx={{ fontSize: 15, mb: 2 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 0, pt: 3, pr: 6 }}>
        <Typography color="text.secondary" sx={{ fontSize: 15, mb: 2 }}>
          No item data found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, pt: 3, pr: 6,ml:2}}>
      {sections.map((section, idx) => {
        const fieldsWithData = section.fields.filter(
          (field) => getFieldValue(field, data) !== null
        );
        return (
          <Box key={idx} sx={{ mb: 4 }}>
            {section.title && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: idx === 0 ? 0 : 2 }}>
                  {section.title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {fieldsWithData.length > 0 ? (
                fieldsWithData.map((field) => {
                  const value = getFieldValue(field, data);
                  return (
                    <Box key={field.key} sx={{ display: "flex", alignItems: "center", py: 0.5 }}>
                      <Typography 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: 15, 
                          fontWeight: 500,
                          minWidth: "200px",
                          mr: 2
                        }}
                      >
                        {field.label}
                      </Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 400 }}>
                        {field.isCurrency
                          ? formatCurrency(value)
                          : value}
                      </Typography>
                    </Box>
                  );
                })
              ) : section.title ? (
                <Box>
                  <Typography color="text.secondary" sx={{ fontSize: 15, mb: 2 }}>
                    {section.title === "Purchase Information"
                      ? "No purchase information provided."
                      : section.title === "Sales Information"
                      ? "No sales information provided."
                      : "No information provided."}
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ItemOverview; 