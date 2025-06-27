"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Grid, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VendorSelection from "./VendorSelection";
import BillDetails from "./BillDetails";
import { useRouter, useSearchParams } from "next/navigation";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// Sample data for vendors
const paymentTerms = [
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due on Receipt",
  "Due end of the month",
  "Due end of the next month",
  "Custom",
];

const BillHeader = ({
  formik,
  isEditMode,
  billUniqueId,
  toggleMode,
  isZoho,
}) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const searchParams = useSearchParams();
  const recurringBillId = searchParams.get("recurring_bill_id");
  const router = useRouter();

  // Effect to initialize the selected vendor when in edit mode
  useEffect(() => {
    if (isEditMode && formik.values.vendor_id && formik.values.vendorName) {
      // If we have vendor details in formik, set it as the selected vendor
      setSelectedVendor({
        _id: formik.values.vendor_id,
        contact_name: formik.values.vendorName,
        billing_address: formik.values.billing_address || {},
      });
    }
  }, [isEditMode, formik.values.vendor_id, formik.values.vendorName]);

  useEffect(() => {
    if (recurringBillId) {
      // If we have vendor details in formik, set it as the selected vendor
      setSelectedVendor({
        _id: formik.values.vendor_id,
        contact_name: formik.values.vendorName,
        billing_address: formik.values.billing_address || {},
      });
    }
  }, [recurringBillId, formik.values.vendor_id, formik.values.vendorName]);

  // Handle vendor selection
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    formik.setFieldValue("vendorName", vendor.contact_name);
    formik.setFieldValue("vendor_id", vendor._id);
    formik.setFieldValue("billing_address", vendor.billing_address);

    // If vendor has preferred payment terms, set them
    if (vendor.contactDetails?.paymentTerms) {
      formik.setFieldValue("paymentTerms", vendor.contactDetails.paymentTerms);
    }
  };

  // Handle clearing selected vendor
  const handleClearVendor = () => {
    setSelectedVendor(null);
    formik.setFieldValue("vendorName", "");
    formik.setFieldValue("vendor_id", "");
  };

  return (
    <Paper elevation={0} sx={{ p: 0, mb: 3 }}>
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isEditMode ? "Edit" : "New"} Bill
          </Typography>
        </Box>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={toggleMode}
          >
            {isZoho ? (
              <ToggleOnIcon sx={{ color: "#336699", fontSize: 32 }} />
            ) : (
              <ToggleOffIcon sx={{ color: "#888", fontSize: 32 }} />
            )}
            <Typography
              variant="body1"
              // lineHeight: "32px",
              sx={{
                ml: 1,
                color: "#333",
                fontSize: "14px",
                lineHeight: "32px",
                fontWeight: "bold",
              }}
            >
              {"Zoho"}
            </Typography>
          </div>

          <IconButton
            aria-label="Close"
            sx={{ color: "red" }}
            onClick={() => router.back()}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              borderRadius: 1,
              "&:hover": { backgroundColor: "#e68900" },
              fontSize: "13px",
              width: "31px",
              fontWeight: 800,
            }}
          >
            ?
          </IconButton>
        </div>
        {/* <Box>
          <IconButton onClick={() => router.push('/purchase/bills')}>
            <CloseIcon />
          </IconButton>
        </Box> */}
      </Box>
      {/* Form content */}
      <Box>
        {/* Vendor Selection Component */}
        <Grid item xs={12}>
          <VendorSelection
            formik={formik}
            onVendorSelect={handleVendorSelect}
            selectedVendor={selectedVendor}
            onClearVendor={handleClearVendor}
          />
        </Grid>
        {/* Bill Details Component */}

        <BillDetails
          formik={formik}
          paymentTerms={paymentTerms}
          billNumber={billUniqueId}
        />
      </Box>
    </Paper>
  );
};

export default BillHeader;
