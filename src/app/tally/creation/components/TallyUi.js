"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CompanyInfoPanel from "../components/CompanyInfoPanel";
import FunctionKeysPanel from "../components/FunctionKeyPanel";
import GatewayMenu from "../components/GatewayMenu";
import MasterCreationDialog from "../components/MasterCreationDialog";
import VoucherDialog from "../components/VoucherDialog";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

const TallyUi = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Group");
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [isZoho, setIsZoho] = useState(true);

  const mastersData = {
    accounting: {
      title: "Accounting Masters",
      items: ["Group", "Ledger", "Currency", "Voucher Type"],
    },
    inventory: {
      title: "Inventory Masters",
      items: [
        "Stock Group",
        "Stock Category",
        "Stock Item",
        "Unit",
        "Location",
      ],
    },
    payroll: {
      title: "Payroll Masters",
      items: [
        "Employee Group",
        "Employee",
        "Units (Work)",
        "Attendance/Production Type",
        "Pay Heads",
        "Payroll Voucher Type",
      ],
    },
    statutory: {
      title: "Statutory Masters",
      items: ["GST Registration", "GST Classification"],
    },
    statutoryDetails: {
      title: "Statutory Details",
      items: ["Company GST Details", "PAN/CIN Details"],
    },
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item === "Voucher Type") {
      router.push("/vouchertype");
      handleCloseDialog();
    }
  };

  const handleVouchersClick = () => {
    router.push("/tally/voucher");
  };

  const handleOpenVoucherDialog = () => {
    setVoucherDialogOpen(true);
  };

  const handleCloseVoucherDialog = () => {
    setVoucherDialogOpen(false);
  };

  const handleOrderVouchersClick = () => {
    router.push("/voucher");
    handleCloseVoucherDialog();
  };

  const handleFunctionKeyClick = (key) => {
    if (key === "F10") {
      router.push("/voucher");
    }
  };

  const toggleMode = () => {
    // Save current form data to localStorage
    // Since this is the Tally creation page, we don't have form data to save
    // We'll just set a flag to indicate we're coming from Tally
    localStorage.setItem("fromTally", "true");

    setIsZoho((prev) => !prev);
    router.push("/sales/quotes");
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 64px)",
          backgroundColor: "#e6f2ff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar with Gateway of Tally text, toggle, and close button */}
        <Box
          sx={{
            width: "100%",
            height: "28px",
            backgroundColor: "#336699",
            display: "flex",
            alignItems: "center",
            padding: "4px 10px",
            justifyContent: "space-between",
            fontSize: "12px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: "white",
              lineHeight: "18px",
            }}
          >
            Gateway of Tally
          </Typography>
          <div
            style={{
              textAlign: "center",
              flex: 1,
              color: "white",
              fontSize: "12px",
              lineHeight: "18px",
            }}
          >
            iHub
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                height: "18px",
              }}
              onClick={toggleMode}
            >
              <span
                style={{
                  marginLeft: "5px",
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "12px",
                  lineHeight: "18px",
                }}
              >
                {"Tally"}
              </span>
              {isZoho ? (
                <ToggleOffIcon
                  style={{ color: "gray", fontSize: "18px", height: "18px" }}
                />
              ) : (
                <ToggleOnIcon
                  style={{ color: "white", fontSize: "18px", height: "18px" }}
                />
              )}
            </div>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              ✕
            </Typography>
          </div>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
          }}
        >
          <CompanyInfoPanel />

          <GatewayMenu
            onCreateClick={handleOpenDialog}
            onVouchersClick={handleVouchersClick}
          />

          <FunctionKeysPanel onFunctionKeyClick={handleFunctionKeyClick} />
        </Box>
      </Box>

      {/* Master Creation Dialog */}
      <MasterCreationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        mastersData={mastersData}
        selectedItem={selectedItem}
        onItemClick={handleItemClick}
      />

      {/* Voucher Dialog (for Other Vouchers) */}
      <VoucherDialog
        open={voucherDialogOpen}
        onClose={handleCloseVoucherDialog}
        onOrderVouchersClick={handleOrderVouchersClick}
      />
    </>
  );
};

export default TallyUi;
