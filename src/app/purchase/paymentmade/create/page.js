"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";

import CreateBillPayment from "./billPayment/paymentMade/page";
import VendorAdvance from "./vendorAdvance/page";
import { useSearchParams } from "next/navigation";
import config from "../../../../services/config";
import apiService from "../../../../services/axiosService";
import ReceiptIcon from "@mui/icons-material/Receipt";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`expense-tabpanel-${index}`}
      aria-labelledby={`expense-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// Custom theme that matches your requirements
const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#408DFB", // Blue indicator color
          height: 3,
          top: 0, // Positions the indicator at the top
          borderRadius: "3px 3px 0 0", // Rounded edges on the left and right sides
          width: "calc(100% - 16px)", // Adjusted width for rounded look
          margin: "0 8px", // To keep space on left & right
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none", // Prevents text from being uppercase
          fontWeight: 500, // Medium font weight
          fontSize: "14px",
          minWidth: "auto",
          padding: "12px 16px",
          "&.Mui-selected": {
            color: "#000", // Active tab color
          },
          "&:not(.Mui-selected)": {
            color: "#408DFB", // Inactive tab text color
          },
        },
      },
    },
  },
});

export default function ExpenseTabs() {
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("paymentId");
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (payment_id) {
      let orgID = localStorage.getItem("organization_id");
      getPaymentData(payment_id, orgID);
    }
  }, [payment_id]);

  const getPaymentData = async (payment_id, ORG_ID) => {
    try {
      let params = {
        url: `api/v1/payments/allpayment?payment_id=${payment_id}&organization_id=${ORG_ID}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      let response = await apiService(params);
      if (response.statusCode == 200) {
        let formType = response.data.data.payment;
        console.log("formType", formType);
        if (formType.payment_type === "VendorAdvance") {
          setValue(1);
        }
      }
    } catch (error) {
      console.log("getPaymentData error", error);
      showMessage("Something went wrong", "error");
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
        }}
      >
        {payment_id ? (
          <>
            {value == 1 ? (
              <>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ReceiptIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Edit Vendor Advance</Typography>
                  </Box>
                  <VendorAdvance />
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ReceiptIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Edit Payment Made</Typography>
                  </Box>
                  <CreateBillPayment />
                </Box>
              </>
            )}
          </>
        ) : (
          <>
            <Box
              sx={{
                backgroundColor: "#ffffff",
                width: "100%",
                paddingLeft: "20px",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="expense tabs"
                sx={{
                  minHeight: "48px",
                  pt: 3,
                  "& .MuiTabs-flexContainer": {
                    gap: 0,
                  },
                  "& .MuiTabs-indicator": {
                    top: 0,
                    bottom: "auto",
                  },
                }}
                TabIndicatorProps={{
                  style: {
                    top: 0,
                    bottom: "auto",
                    marginLeft: 0,
                  },
                }}
              >
                <Tab
                  label="Bill Payment"
                  id="expense-tab-0"
                  sx={{
                    // borderRight: "1px solid #e0e0e0",
                    color: value === 0 ? "black" : "#408DFB",
                    fontWeight: value === 0 ? "500" : "400",
                    backgroundColor: value === 0 ? "#f9f9fb" : "transparent",
                    borderBottom: value === 0 ? "none" : "1px solid #e0e0e0",
                    // borderTop: "3px solid transparent",
                    // borderLeft: "2px solid #e0e0e0",

                    "&:hover": {
                      color: "black",
                    },
                    textTransform: "none",
                    fontSize: "0.95rem",
                    minHeight: "48px",
                    padding: "12px 16px",
                  }}
                />
                <Tab
                  label="Vendor Advance"
                  id="expense-tab-1"
                  sx={{
                    color: value === 1 ? "black" : "#408DFB",
                    fontWeight: value === 1 ? "500" : "400",
                    // borderRight: "1px solid #e0e0e0",
                    // borderLeft: "1px solid #e0e0e0",
                    backgroundColor: value === 1 ? "#f9f9fb" : "transparent",
                    borderBottom: value === 1 ? "none" : "1px solid #e0e0e0",
                    borderTop: "3px solid transparent",
                    "&:hover": {
                      color: "black",
                    },
                    textTransform: "none",
                    fontSize: "0.95rem",
                    minHeight: "48px",
                    padding: "12px 16px",
                  }}
                />
              </Tabs>
            </Box>

            <Box sx={{ borderTop: "1px solid #e0e0e0" }}>
              <TabPanel value={value} index={0}>
                <Box>
                  <CreateBillPayment />
                </Box>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Box>
                  <VendorAdvance />
                </Box>
              </TabPanel>
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}
