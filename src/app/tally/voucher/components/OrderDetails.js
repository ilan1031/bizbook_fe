import React from "react";
import { Box, Typography, TextField, Divider } from "@mui/material";

const OrderDetails = ({
  onVehicleNumberEnter,
  orderDetails,
  onOrderDetailsChange,
}) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.target.name === "vehicleNumber") {
      onVehicleNumberEnter(orderDetails.vehicleNumber);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      height: "24px",
      fontSize: "14px",
      borderColor: "white",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "#ccc",
      },
      "&:hover fieldset": {
        borderColor: "#999",
      },
      "&.Mui-focused": {
        backgroundColor: "#fff8e1",
        "& fieldset": {
          borderColor: "#1976d2",
        },
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "2px 8px",
    },
    width: "220px",
  };

  const labelStyle = {
    fontSize: "14px",
    color: "#000",
    marginRight: "8px",
    minWidth: "160px",
    display: "inline-block",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  };

  const headingStyle = {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "16px",
    textDecoration: "underline",
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "30px",
        left: "0",
        right: "240px",
        bottom: "0",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid black",
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
          width: "550px",
        }}
      >
        {/* Order Details Section */}
        <Box sx={{ marginBottom: "16px" }}>
          <Typography variant="subtitle1" sx={headingStyle}>
            Order Details
          </Typography>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Mode/Terms of Payment:</Typography>
            <TextField
              size="small"
              value={orderDetails.paymentMode || ""}
              onChange={(e) =>
                onOrderDetailsChange("paymentMode", e.target.value)
              }
              sx={inputStyle}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Other References:</Typography>
            <TextField
              size="small"
              value={orderDetails.otherReferences || ""}
              onChange={(e) =>
                onOrderDetailsChange("otherReferences", e.target.value)
              }
              sx={inputStyle}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Terms of Delivery:</Typography>
            <TextField
              size="small"
              value={orderDetails.termsOfDelivery || ""}
              onChange={(e) =>
                onOrderDetailsChange("termsOfDelivery", e.target.value)
              }
              sx={inputStyle}
            />
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ margin: "16px 0" }} />

        {/* Dispatch Details Section */}
        <Box>
          <Typography variant="subtitle1" sx={headingStyle}>
            Dispatch Details
          </Typography>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Dispatch through:</Typography>
            <TextField
              size="small"
              value={orderDetails.dispatchThrough || ""}
              onChange={(e) =>
                onOrderDetailsChange("dispatchThrough", e.target.value)
              }
              sx={inputStyle}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Destination:</Typography>
            <TextField
              size="small"
              value={orderDetails.destination || ""}
              onChange={(e) =>
                onOrderDetailsChange("destination", e.target.value)
              }
              sx={inputStyle}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Carrier Name/Agent:</Typography>
            <TextField
              size="small"
              value={orderDetails.carrierName || ""}
              onChange={(e) =>
                onOrderDetailsChange("carrierName", e.target.value)
              }
              sx={inputStyle}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Bill of Lading/LR-RR No.:</Typography>
            <TextField
              size="small"
              value={orderDetails.billNumber || ""}
              onChange={(e) =>
                onOrderDetailsChange("billNumber", e.target.value)
              }
              sx={inputStyle}
            />
            <Typography sx={{ marginLeft: "8px" }}>Date:</Typography>
            <TextField
              size="small"
              type="date"
              value={orderDetails.billDate || ""}
              onChange={(e) => onOrderDetailsChange("billDate", e.target.value)}
              sx={{ ...inputStyle, width: "130px", marginLeft: "8px" }}
            />
          </Box>
          <Box sx={rowStyle}>
            <Typography sx={labelStyle}>Motor Vehicle No.:</Typography>
            <TextField
              size="small"
              name="vehicleNumber"
              value={orderDetails.vehicleNumber || ""}
              onChange={(e) =>
                onOrderDetailsChange("vehicleNumber", e.target.value)
              }
              onKeyPress={handleKeyPress}
              sx={inputStyle}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderDetails;
