"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Stack,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Close, EditOutlined } from "@mui/icons-material";
import BillingAddressForm from "../BillingAddressForm";

export default function AddressManagement({
  onClose,
  customerData,
  addressData,
  setAddressData,
  onAddressUpdate, // Add this prop to handle updates in parent
}) {
  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [title, setTitle] = useState("");
  const [addressType, setAddressType] = useState("");
  const [editData, seteditData] = useState(null);

  useEffect(() => {
    const defaultAddresses = customerData?.additional_address;
    setAddresses(defaultAddresses);
  }, [customerData]);

  const handleOpenDialog = () => {
    setTitle("New Address"); // Set default title for new address
    setAddressType("add"); // Set type to 'add' for new address
    seteditData(null); // Clear any existing edit data
    setDialogOpen(true);
  };

  const handleDialogClose = (newAddressData) => {
    if (newAddressData) {
      // Update the addresses list based on the address type
      if (addressType === "add") {
        // For new additional address
        setAddresses(prev => [...(prev || []), newAddressData]);
        
        // Update the customer data
        const updatedCustomerData = { ...customerData };
        if (!updatedCustomerData.additional_address) {
          updatedCustomerData.additional_address = [];
        }
        updatedCustomerData.additional_address.push(newAddressData);
        
        // Notify parent component of the update
        onAddressUpdate?.(updatedCustomerData);
      } else if (addressType === "edit") {
        // For editing existing address
        const updatedAddresses = addresses.map(addr => 
          addr.address_id === newAddressData.address_id ? newAddressData : addr
        );
        setAddresses(updatedAddresses);
        
        // Update the customer data
        const updatedCustomerData = { ...customerData };
        updatedCustomerData.additional_address = updatedAddresses;
        
        // Notify parent component of the update
        onAddressUpdate?.(updatedCustomerData);
      }
    }
    
    // Reset states
    setDialogOpen(false);
    seteditData(null);
    setAddressType("");
    setTitle("");
  };

  const handleEdit = (address, value, title) => {
    seteditData(address);
    setAddressType(value);
    setTitle(title);
    setDialogOpen(true);
  };

  const isEditable = (addressToCheck) => {
    if (addressType === "billing" && customerData?.billing_address === addressToCheck) {
      return true;
    }
    if (addressType === "shipping" && customerData?.shipping_address === addressToCheck) {
      return true;
    }
    console.log(addressData, "addressDataaddressData");
    return addressData?.address_id === addressToCheck?.address_id;
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Direct Popover-like Container */}
      <Paper
        elevation={3}
        sx={{
          width: 330,
          maxHeight: 400,
          position: "relative",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Address Cards - Limited to scrollable container */}
        <Box sx={{ maxHeight: "350px", overflow: "auto", pb: 1, pt: 1, px: 1 }}>
          <Stack spacing={1}>
            {customerData?.billing_address && (
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "white",
                  transition: "background-color 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    bgcolor: "#408dfb",
                    color: "white !important",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    {customerData?.billing_address.attention}
                  </Typography>
                  {isEditable(customerData?.billing_address) && (
                    <IconButton
                      size="small"
                      sx={{ p: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(
                          customerData?.billing_address,
                          "edit",
                          "Billing Address"
                        );
                      }}
                    >
                      <EditIcon sx={{ fontSize: 18, color: "#ffffff" }} />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="body2">
                  {customerData?.billing_address.address}
                </Typography>
                <Typography variant="body2">
                  {customerData?.billing_address.street2}
                </Typography>
                <Typography variant="body2">
                  {customerData?.billing_address.city},{" "}
                  {customerData?.billing_address.state}
                </Typography>
                <Typography variant="body2">
                  {customerData?.billing_address.country},{" "}
                  {customerData?.billing_address.zip}
                </Typography>
                <Typography variant="body2">
                  {customerData?.billing_address.phone}{" "}
                  {customerData?.billing_address.fax &&
                    "Fax Number : " + customerData?.billing_address.fax}
                </Typography>
                <Typography variant="body2">
                  GSTIN: {customerData?.gstin}
                </Typography>
                <Typography variant="body2">
                  Place of Supply: {customerData?.place_of_contact}
                </Typography>
              </Paper>
            )}
            {customerData?.shipping_address && (
              <Paper
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: "white",
                transition: "background-color 0.3s",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  bgcolor: "#408dfb",
                  color: "white !important",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
                >
                  <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    {customerData?.shipping_address.attention}
                  </Typography>
                  {isEditable(customerData?.shipping_address) && (
                    <IconButton
                      size="small"
                      sx={{ p: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(
                          customerData?.shipping_address,
                          "edit",
                          "Shipping Address"
                        );
                      }}
                    >
                      <EditIcon sx={{ fontSize: 18, color: "#ffffff" }} />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="body2" >
                  {customerData?.shipping_address.address}
                </Typography>
                <Typography variant="body2" >
                  {customerData?.shipping_address.street2}
                </Typography>
                <Typography variant="body2" >
                  {customerData?.shipping_address.city},{" "}
                  {customerData?.shipping_address.state}
                </Typography>
                <Typography variant="body2" >
                  {customerData?.shipping_address.country},{" "}
                  {customerData?.shipping_address.zip}
                </Typography>
                <Typography variant="body2" >
                  {customerData?.shipping_address.phone}{" "}
                  {customerData?.shipping_address.fax &&
                    "Fax Number : " + customerData?.shipping_address.fax}
                </Typography>
                <Typography variant="body2" >
                  GSTIN: {customerData?.gstin}
                </Typography>
                <Typography variant="body2" >
                  Place of Supply: {customerData?.place_of_contact}
                </Typography>
              </Paper>
            )}
            {addresses.map((address, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "white",
                  
                  transition: "background-color 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    bgcolor: "#408dfb",
                    color: "white !important",
                  },
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="subtitle1">
                  {address.attention}
                  </Typography>
                  {isEditable(address) && (
                    <IconButton
                      size="small"
                      sx={{ p: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(address, "edit", "Additional Address");
                      }}
                    >
                      <EditIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="body2" >
                  {address.address}
                </Typography>
                <Typography variant="body2" >
                  {address.street2}
                </Typography>
                <Typography variant="body2" >
                  {address.city}, {address.state}
                </Typography>
                <Typography variant="body2" >
                  {address.country}, {address.zip}
                </Typography>
                <Typography variant="body2" >
                  {address.phone} {address.fax && "Fax Number : " + address.fax}
                </Typography>
                <Typography variant="body2" >
                  GSTIN: {customerData?.gstin}
                </Typography>
                <Typography variant="body2" >
                  Place of Supply: {customerData?.place_of_contact}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Add New Address Button */}
        <Box sx={{ p: 1, borderTop: "1px solid #e0e0e0" }}>
          <Button
            variant="text"
            startIcon={<AddCircleIcon />}
            onClick={handleOpenDialog}
            sx={{
              color: "#1976d2",
              textTransform: "none",
              justifyContent: "flex-start",
              pl: 0.5,
              width: "100%",
            }}
          >
            New address
          </Button>
        </Box>
      </Paper>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            width: "500px", // Set your custom width here
            maxWidth: "90%", // Optional for responsiveness
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 14px",
            backgroundColor: "#f9f9fb",
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ color: "red" }}
          >
            <Close />
          </IconButton>
        </Box>
        <BillingAddressForm
          onClose={() => setDialogOpen(false)}
          open={dialogOpen}
          editData={editData}
          address={addressType}
          title={title}
          contactId={customerData?.contact_id}
        />
      </Dialog>
    </Box>
  );
}
