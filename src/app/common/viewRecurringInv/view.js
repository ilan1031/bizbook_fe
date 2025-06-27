"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  IconButton,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Popover,
  MenuItem,
  ListItemText,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OverviewTab from "./overview";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "../../../../src/components/SnackbarProvider";
import apiService from "../../../../src/services/axiosService";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import WarningIcon from "../../../../src/assets/icons/warning-img.png";
import Image from "next/image";
import NextInvoiceTab from "./nextinvoice";
import { Pencil } from "lucide-react";
import RecentActivitiesTab from "./recentactivities";
import config from "../../../../src/services/config";
import PaymentForm from "../payment/PaymentForm";
// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3174F1",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#FAFAFA",
    },
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h5: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          minWidth: "auto",
          padding: "12px 16px",
          fontSize: "14px",
          "&.Mui-selected": {
            color: "#3174F1",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#3174F1",
          height: "3px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "4px",
        },
        outlined: {
          borderColor: "#E0E0E0",
          color: "#616161",
        },
        contained: {
          backgroundColor: "#3174F1",
          color: "white",
          "&:hover": {
            backgroundColor: "#2160D9",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #E0E0E0",
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E0E0E0",
          minHeight: "48px",
          "&.Mui-expanded": {
            minHeight: "48px",
          },
        },
        content: {
          margin: "12px 0",
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#F5F5F5",
          color: "#616161",
          fontWeight: 500,
          fontSize: "12px",
        },
        root: {
          padding: "8px 16px",
          borderBottom: "1px solid #E0E0E0",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#E0E0E0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          border: "1px solid #E0E0E0",
        },
      },
    },
  },
});
const menuItemStyles = {
  "&:hover": {
    backgroundColor: "#4285F4",
    color: "#fff",
    "& .MuiListItemIcon-root": {
      color: "#4285F4",
    },
  },
};
// TabPanel component to handle tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
      style={{ paddingTop: "20px" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function View({
  details: initialDetails,
  moduleKey,
  callViewAPI,
  uniqueId,
  page,
  limit,
  callBack,
  childLoading,
  loading,
  setFilterStatus,
  filterStatus,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromURL = searchParams.get("tab");
  const [tabValue, setTabValue] = useState(
    tabFromURL ? parseInt(tabFromURL) : 0
  );

  const organization_id = localStorage.getItem("organization_id");
  const { showMessage } = useSnackbar();
  const [openDelete, setOpenDelete] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setAnchorEl(null);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    router.push(`?tab=${newValue}`);
  };

  const handleEdit = async () => {
    try {
      if (!organization_id || !uniqueId) {
        showMessage("Missing required data", "error");
        return;
      }

      // Fetch complete recurring invoice data
      const response = await apiService({
        method: "GET",
        url: `/api/v1/RecurringInvoices/individual`,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: uniqueId,
        },
        customBaseUrl: config.SO_Base_url,
      });

      if (response.data && response.data.data) {
        const invoiceData = response.data.data;

        // Store the complete data in localStorage
        localStorage.setItem(
          "recurringInvoiceEditData",
          JSON.stringify({
            ...invoiceData,
            customer_Data: details?.customer_Data,
            profile_name: details?.recurrence_name,
            billing_address: details?.billing_address,
            shipping_address: details?.shipping_address,
            line_items: invoiceData.line_items || [],
            tax_details: {
              tax_type: invoiceData.tax_type,
              tax_percentage: invoiceData.tax_percentage,
              tds_option: invoiceData.tds_option,
              tds_id: invoiceData.tds_id,
              tcs_id: invoiceData.tcs_id,
            },
            payment_details: {
              payment_terms: invoiceData.payment_terms,
              payment_terms_label: invoiceData.payment_terms_label,
              repeat_every: invoiceData.repeat_every,
              recurrence_frequency: invoiceData.recurrence_frequency,
            },
          })
        );

        // Navigate to edit page
        router.push(`/sales/recurringInvoice/edit/${uniqueId}`);
      } else {
        showMessage("Failed to fetch recurring invoice data", "error");
      }
    } catch (error) {
      console.error("Error in handleEdit:", error);
      showMessage("Failed to prepare edit data", "error");
    }
  };

  const handleClose = () => {
    if (moduleKey === "RecurringInvoice") {
      router.push(`/sales/recurringInvoice`);
    }
  };

  const handleApi = (pageValue) => {
    callViewAPI(details?.recurring_invoice_id, pageValue);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePop = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [details, setDetails] = useState(initialDetails);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Update details when props change
  useEffect(() => {
    setDetails(initialDetails);
  }, [initialDetails]);

  const handleStatus = async () => {
    try {
      console.log("1. Current Status Before Change:", details.status);
      console.log("2. Current Details:", details);

      // Determine new status based on current status
      const newStatus = details.status === "active" ? "stopped" : "active";
      const newStatusFormatted = newStatus === "Stopped" ? "Active" : "Stopped";

      console.log("3. New Status to be set:", newStatus);
      console.log("4. New Status Formatted:", newStatusFormatted);

      const response = await apiService({
        method: "PUT",
        url: `/api/v1/RecurringInvoices/individual/update`,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: uniqueId,
        },
        data: {
          status: newStatus,
          status_formatted: newStatusFormatted,
          recurring_invoice: {
            ...details.recurring_invoice,
            status: newStatus,
            status_formatted: newStatusFormatted,
          },
        },
        customBaseUrl: config.SO_Base_url,
      });

      console.log("5. API Response:", response);

      if (response.data) {
        // Update local state immediately
        const updatedDetails = {
          ...details,
          status: newStatus,
          status_formatted: newStatusFormatted,
          recurring_invoice: {
            ...details.recurring_invoice,
            status: newStatus,
            status_formatted: newStatusFormatted,
          },
        };
        console.log("6. Updated Details:", updatedDetails);
        setDetails(updatedDetails);

        // Call the parent's callback to refresh data
        if (callViewAPI) {
          console.log("7. Calling view API to refresh data");
          callViewAPI(uniqueId, page);
        }

        // Show appropriate success message
        showMessage(
          `Recurring invoice ${
            newStatus === "stopped" ? "stopped" : "resumed"
          } successfully`,
          "success"
        );
      }
    } catch (err) {
      console.error("8. Failed to update recurring invoice status:", err);
      showMessage(
        `Failed to ${
          details.status === "active" ? "stop" : "resume"
        } recurring invoice`,
        "error"
      );
    } finally {
      handleClosePop(); // Close the menu after action
    }
  };

  const handleEmail = () => {
    router.push(
      `/common/customerEmail?org_id=${organization_id}&contact_id=${uniqueId}&email_type=${
        moduleKey || "RecurringInvoice"
      }`
    );
  };

  const handleClone = () => {
    if (moduleKey === "RecurringInvoice") {
      router.push(`/sales/recurringInvoice/new?clone_id=${uniqueId}`);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      console.log("Organization ID:", organization_id);
      console.log("Unique ID:", uniqueId);
      console.log("Current Details:", details);

      if (!organization_id || !uniqueId) {
        showMessage("Missing required data", "error");
        return;
      }

      // Fetch the specific recurring invoice data
      const response = await apiService({
        method: "GET",
        url: `/api/v1/RecurringInvoices/individual`,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: uniqueId,
        },
        customBaseUrl: config.SO_Base_url,
      });

      console.log("API Response:", response); // 🔍 Debugging

      const recurringData = response.data.data || response.data;

      if (!recurringData) {
        showMessage("No data received from server", "error");
        return;
      }

      // Prepare the invoice data
      const invoiceData = {
        customer_id: recurringData.customer_id,
        customer_name: recurringData.customer_name,
        customer_Data: details?.customer_Data,
        billing_address:
          recurringData.billing_address || details?.billing_address,
        shipping_address:
          recurringData.shipping_address || details?.shipping_address,
        line_items: recurringData.line_items || [],
        tax_type: recurringData.tax_type,
        tax_percentage: recurringData.tax_percentage,
        tds_option: recurringData.tds_option,
        tds_id: recurringData.tds_id,
        tcs_id: recurringData.tcs_id,
        sub_total: recurringData.sub_total,
        tax_total: recurringData.tax_total,
        total: recurringData.total,
        recurring_invoice_id: uniqueId,
        is_recurring: true,
        date: new Date().toISOString().split("T")[0],
        status: "draft",
        status_formatted: "Draft",
        payment_terms: recurringData.payment_terms,
        payment_terms_label: recurringData.payment_terms_label,
      };

      localStorage.setItem("recurringInvoiceData", JSON.stringify(invoiceData));

      router.push(
        `/sales/invoices/new?recurring_invoice_id=${uniqueId}&type=invoice`
      );
    } catch (error) {
      console.error("Error in handleCreateInvoice:", error);
      showMessage(
        "Error: Failed to load invoice data. Please try again.",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/RecurringInvoices/individual/delete`,
        params: {
          organization_id: organization_id,
          recurring_invoice_id: uniqueId,
        },
        customBaseUrl: config.SO_Base_url,
      });

      if (response.data) {
        showMessage("Recurring invoice deleted successfully", "success");
        setOpenDelete(false);
        router.push("/sales/recurringInvoice");
      }
    } catch (err) {
      console.error("Failed to delete recurring invoice:", err);
      showMessage(
        err.response?.data?.message || "Failed to delete recurring invoice",
        "error"
      );
    }
  };

  const handleRecordPayment = (invoice) => {
    // Create a complete invoice object with customer data
    const completeInvoiceData = {
      ...invoice,
      invoice_id: invoice.invoice_id || invoice.bill_id,
      invoice_number:
        invoice.invoice_number || invoice.bill_number || invoice.details_number,
      customer_name:
        details?.customer_Data?.contact_name || details?.customer_name || "",
      customer_id:
        details?.customer_Data?.customer_id || details?.customer_id || "",
      balance: invoice.total || invoice.amount || 0,
      total: invoice.total || invoice.amount || 0,
      total_formatted:
        invoice.total_formatted || invoice.amount_formatted || "₹0.00",
      // Add additional customer data that might be needed
      company_name: details?.customer_Data?.company_name || "",
      email: details?.customer_Data?.email || "",
      phone: details?.customer_Data?.phone || "",
      address: details?.customer_Data?.address || "",
      date: invoice.date || new Date().toISOString().split("T")[0],
      date_formatted:
        invoice.date_formatted || new Date().toLocaleDateString("en-IN"),
      status: invoice.status || "active",
      status_formatted: invoice.status_formatted || "Active",
    };

    console.log("Payment Data:", completeInvoiceData); // Debug log
    setSelectedInvoice(completeInvoiceData);
    setShowPaymentForm(true);
  };

  // If showing payment form, render it directly
  if (showPaymentForm && selectedInvoice) {
    return (
      <PaymentForm
        invoiceData={selectedInvoice}
        callViewAPI={() => {
          setShowPaymentForm(false);
          if (callViewAPI) {
            callViewAPI(uniqueId, page);
          }
        }}
        onCancel={() => setShowPaymentForm(false)}
      />
    );
  }

  const isNextInvoiceVisible = details?.status === "active";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Customer Profile - {details?.recurrence_name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderLeft: "1px solid #ddd",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
              p: 2,
            }}
          >
            <Typography variant="h6">
              {details?.recurrence_name
                ? details.recurrence_name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : ""}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={handleEdit}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: "40px",
                  height: "32px",
                  padding: "4px 8px",
                  borderColor: "#ddd",
                  "&:hover": {
                    borderColor: "#408dfb",
                    backgroundColor: "#f0f7ff",
                  },
                }}
                className="bulk-update-btn"
              >
                <Pencil width="14px" />
              </Button>
              <Button
                onClick={handleCreateInvoice}
                variant="outlined"
                className="bulk-update-btn"
                sx={{
                  minWidth: "120px",
                  height: "32px",
                  padding: "4px 8px",
                  borderColor: "#ddd",
                  "&:hover": {
                    borderColor: "#408dfb",
                    backgroundColor: "#f0f7ff",
                  },
                }}
              >
                Create Invoice
              </Button>
              <Button
                variant="outlined"
                sx={{
                  minWidth: "40px",
                  height: "32px",
                  padding: "4px 8px",
                  borderColor: "#ddd",
                  "&:hover": {
                    borderColor: "#408dfb",
                    backgroundColor: "#f0f7ff",
                  },
                  "& .MuiButton-endIcon": {
                    marginLeft: "0px",
                  },
                }}
                onClick={handleClick}
                endIcon={
                  <KeyboardArrowDownIcon
                    sx={{ marginLeft: "0px" }}
                    className="button-more-svg"
                  />
                }
                className="bulk-update-btn"
              >
                More
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePop}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    minWidth: "150px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    borderRadius: "4px",
                    marginTop: "4px",
                  },
                }}
              >
                <Box>
                  {console.log(
                    "11. Rendering menu items with status:",
                    details?.status
                  )}
                  {details?.status === "active" ? (
                    <MenuItem
                      sx={{
                        ...menuItemStyles,
                        color: "#ff9800",
                        fontSize: "13px",
                        padding: "8px 16px",
                        "&:hover": {
                          backgroundColor: "#fff3e0",
                          color: "#ff9800",
                        },
                      }}
                      onClick={handleStatus}
                    >
                      <ListItemText className="menu-text" primary="Stop" />
                    </MenuItem>
                  ) : details?.status === "stopped" ? (
                    <MenuItem
                      sx={{
                        ...menuItemStyles,
                        color: "#388a10",
                        fontSize: "13px",
                        padding: "8px 16px",
                        "&:hover": {
                          backgroundColor: "#e8f5e9",
                          color: "#388a10",
                        },
                      }}
                      onClick={handleStatus}
                    >
                      <ListItemText className="menu-text" primary="Resume" />
                    </MenuItem>
                  ) : null}
                  <MenuItem
                    sx={{
                      ...menuItemStyles,
                      fontSize: "13px",
                      padding: "8px 16px",
                    }}
                    onClick={handleClone}
                  >
                    <ListItemText className="menu-text" primary="Clone" />
                  </MenuItem>
                  <MenuItem
                    sx={{
                      ...menuItemStyles,
                      fontSize: "13px",
                      padding: "8px 16px",
                    }}
                    onClick={handleClickOpen}
                  >
                    <ListItemText className="menu-text" primary="Delete" />
                  </MenuItem>
                </Box>
              </Popover>
              <IconButton
                size="small"
                onClick={() => handleClose()}
                sx={{
                  marginLeft: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Dialog
              fullWidth="sm"
              open={openDelete}
              maxWidth="sm"
              sx={{
                "& .MuiPaper-root.MuiDialog-paper": { width: "436px" },
              }}
              onClose={handleDeleteClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogContent sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src={WarningIcon}
                  alt="warning"
                  style={{ width: "30px", height: "30px" }}
                  priority
                />
                <DialogContentText
                  sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
                >
                  Do you want to delete this contact?
                </DialogContentText>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ justifyContent: "flex-start" }}>
                <Button
                  sx={{ ml: 1, width: "20px" }}
                  autoFocus
                  variant="outlined"
                  className="button-submit"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDeleteClose}
                  autoFocus
                  className="bulk-update-btn"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="customer tabs"
              sx={{
                textTransform: "none",
                "& .MuiTabs-flexContainer": {
                  height: "48px",
                },
              }}
            >
              <Tab
                label="Overview"
                id="overview-tab-0"
                aria-controls="overview-tabpanel-0"
                sx={{
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              />
              {isNextInvoiceVisible && (
                <Tab
                  label="Next Invoice"
                  id="nextinvoice-tab-1"
                  aria-controls="nextinvoice-tabpanel-1"
                  sx={{
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                />
              )}
              <Tab
                label="Recent Activities"
                id="recent-tab-2"
                aria-controls="recent-tabpanel-2"
                sx={{
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              />
            </Tabs>
          </Box>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            marginTop: "4px",
            height: "80vh", // Full viewport height
            overflow: "auto", // Enables vertical scrolling
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <OverviewTab
              loading={childLoading}
              details={details}
              page={page}
              limit={limit}
              callBack={handleApi}
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              onRecordPayment={handleRecordPayment}
            />
          </TabPanel>

          {/* Next Invoice Tab - Only show when status is active */}
          {isNextInvoiceVisible && (
            <TabPanel value={tabValue} index={1}>
              <NextInvoiceTab details={details} />
            </TabPanel>
          )}

          {/* Recent Activities Tab */}
          <TabPanel value={tabValue} index={isNextInvoiceVisible ? 2 : 1}>
            <RecentActivitiesTab details={details} />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
