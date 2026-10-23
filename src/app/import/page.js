"use client";

// Import Data: pick what to import; the upload, mapping and preview happen
// in /import-files, which posts the rows to the matching backend importer.
import React from "react";
import { useRouter } from "next/navigation";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { usePermissions } from "../../services/PermissionProvider";

// [type for /import-files, label, what it creates, page whose "create" it needs]
const TARGETS = [
  ["customers", "Customers", "Names, contact details and GST numbers", "customers", PeopleOutlineIcon],
  ["vendors", "Vendors", "Suppliers you buy from", "vendors", StorefrontOutlinedIcon],
  ["items", "Items", "Goods and services with rates and HSN/SAC", "items", Inventory2OutlinedIcon],
  ["quote", "Quotes", "Estimates with their line items", "quotes", RequestQuoteOutlinedIcon],
  ["purchase-order", "Purchase Orders", "Orders placed with vendors", "purchaseOrders", ShoppingCartOutlinedIcon],
  ["bills", "Bills", "Vendor bills with their line items", "bills", ReceiptLongOutlinedIcon],
];

export default function ImportHubPage() {
  const router = useRouter();
  const perms = usePermissions();
  const available = TARGETS.filter(([, , , page]) => perms?.can(page, "create"));

  return (
    <Box sx={{ p: 3, maxWidth: 960 }}>
      <Typography variant="h5" fontSize={22} fontWeight={600}>
        Import data
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Upload a CSV or Excel file, match its columns to BizBooks fields, check the preview and import. Records whose
        name already exists are skipped.
      </Typography>
      {available.length === 0 ? (
        <Typography color="text.secondary">
          You can import into pages where you&apos;re allowed to create records. Ask your administrator to switch one on.
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
          {available.map(([type, label, hint, , Icon]) => (
            <Card key={type} variant="outlined">
              <CardActionArea
                onClick={() =>
                  router.push(`/import-files?type=${type}&organization_id=${localStorage.getItem("organization_id")}`)
                }
              >
                <CardContent>
                  <Icon color="primary" />
                  <Typography fontWeight={600} mt={1}>
                    {label}
                  </Typography>
                  <Typography fontSize={13} color="text.secondary">
                    {hint}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
