import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  FormControl,
  Select,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import DotLoader from "../../../components/DotLoader";
import PaymentForm from "../payment/PaymentForm";

const Overview = ({
  details,
  page,
  limit,
  callBack,
  loading,
  onRecordPayment,
  setFilterStatus,
  filterStatus,
}) => {
  const router = useRouter();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(limit);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const totalCount = details?.invoice_pagination?.total || 0;
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startItem = totalCount === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalCount);
  const showPagination = totalCount > limit;
  const [showCount, setShowCount] = useState(false);

  // Format date from API format to display format (YYYY-MM-DD to DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  useEffect(() => {
    console.log(details, "Details in Overview component");
  },[]);

  // Format currency number to Indian Rupee format
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Use data from props
  const companyName =
    details?.customer_Data?.company_name || details?.company_name || "";
  const customerName =
    details?.customer_Data?.contact_name || details?.customer_name || "";
  const email = details?.customer_Data?.email || details?.email || "";
  const profileStatus = details?.status_formatted || "Active";
  const startDate = formatDate(details?.start_date) || "19/05/2025";
  const endDate = details?.end_date || "Never Expires";
  const paymentTerms = "Net 30"; // Assuming default value
  const orderNumber = details?.reference_number || "ORD-1234";
  const invoiceAmount = details?.total_formatted || "₹200.00";
  const nextInvoiceDate = details?.next_invoice_date_formatted || "19/05/2025";
  const recurringPeriod =
    details?.recurrence_frequency === "week" ? "Weekly" : "Daily";

  // Child bills data
  const childInvoices = details?.invoices_for_customer || [];

  // const salesPersonName = details?.
  const createdInvoice = details?.manually_created_invoice_count || 0;

  // Use the correct customer ID for routing
  const customerId =
    details?.customer_Data?.contact_id || details?.customer_id || "";

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    handleMenuClose();
  };
  const handleChangePage = (newPage) => {
    callBack(newPage);
  };

  // Update the status display logic
  const getStatusColor = (status) => {
    console.log("1. Getting status color for:", status);
    if (!status) return "#757575";
    const statusLower = status.toLowerCase();
    console.log("2. Status lower case:", statusLower);
    switch (statusLower) {
      case "active":
        return "#388a10";
      case "stopped":
        return "#ff9800";
      case "draft":
        return "#757575";
      default:
        return "#757575";
    }
  };

  const getStatusText = (status) => {
    console.log("3. Getting status text for:", status);
    if (!status) return "Unknown";
    const statusLower = status.toLowerCase();
    console.log("4. Status lower case for text:", statusLower);
    switch (statusLower) {
      case "active":
        return "Active";
      case "stopped":
        return "Stopped";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  const handleChangeLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setRowsPerPage(newLimit);
    callBack(1); // reset to first page when changing limit
  };

  return (
    <Grid className="details" container spacing={3}>
      {/* Left panel with vendor details */}
      <Grid className="details-info" item xs={12} md={4}>
        <Card variant="outlined" sx={{ mb: 3, border: 0, background: "none" }}>
          <Typography
            sx={{
              textTransform: "uppercase",
              fontSize: "13px",
              fontWeight: 600,
              mb: 1,
            }}
          >
            {companyName}
          </Typography> 
           <hr style={{ marginBottom: "5px" }} /> 
          <Box sx={{ display: "flex", mb: 1, mt: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 50,
                mr: 2,
                bgcolor: "#f5f5f5",
                color: "#888",
                fontSize: "14px",
              }}
              variant="rounded"
            ></Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                onClick={() => router.push(`/sales/customer/${customerId}`)}
                sx={{
                  fontSize: "13px",
                  mb: 0.5,
                  fontWeight: 500,
                  color: "#1976d2",
                }}
              >
                {customerName}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "13px",
                  mb: 0.5,
                  fontWeight: 500,
                  color: "#888",
                }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{}}>
            <Typography
              variant="body1"
              sx={{
                textTransform: "uppercase",
                fontSize: "13px",
                fontWeight: 300,
              }}
            >
              DETAILS
            </Typography>
            {/* <Divider sx={{ my: 1 }} /> */}
            <hr />
            {/* Details list */}
            <Box sx={{ mt: 1.5 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px" }}
                  >
                    Profile Status:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: getStatusColor(profileStatus),
                        color: "white",
                        px: 1,
                        py: 0.3,
                        fontSize: "11px",
                        fontWeight: 600,
                        borderRadius: 0.5,
                        textTransform: "capitalize",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      {profileStatus}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px" }}
                  >
                    Start Date:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {startDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px" }}
                  >
                    End Date:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {endDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px" }}
                  >
                    Order Number:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {orderNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px" }}
                  >
                    manually created invoices:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {createdInvoice}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px" }}
                  >
                    Salesperson:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {details?.sales_person_name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "13px" }}
                  >
                    Payment Terms:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {paymentTerms}
                  </Typography>
                </Grid>
                <Box
                  sx={{
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.2px",
                    mt: 2,
                    backgroundColor: "#F6F6F6",
                    borderRadius: "4px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.2px",
                      width: "270px",
                      padding: "10px 10px",
                      border: "1px solid rgb(211, 209, 209)",
                      borderRadius: "5px",
                    }}
                  >
                    Recurring invoice preference has been set to Create Invoices
                    as Drafts
                  </Typography>
                </Box>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontSize: "13px", mt: 1 }}>
                    Address
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ fontSize: "14px", mt: 1 }}>
                  Billing Address
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {details?.billing_address ? (
                    <>
                      {details.billing_address.attention && (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "13px", color: "#6c718a" }}
                        >
                          {details.billing_address.attention}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: "#6c718a" }}
                      >
                        {details.billing_address.address || ""}
                      </Typography>
                      {details.billing_address.street2 && (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "13px", color: "#6c718a" }}
                        >
                          {details.billing_address.street2}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: "#6c718a" }}
                      >
                        {details.billing_address.city},{" "}
                        {details.billing_address.state} -{" "}
                        {details.billing_address.zip}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: "#6c718a" }}
                      >
                        {details.billing_address.country}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", color: "#6c718a" }}
                    >
                      N/A
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" sx={{ fontSize: "14px", mt: 1 }}>
                  Shipping Address
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {details?.shipping_address ? (
                    <>
                      {details.shipping_address.attention && (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "13px", color: "#6c718a" }}
                        >
                          {details.shipping_address.attention}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: "#6c718a" }}
                      >
                        {details.shipping_address.address}
                      </Typography>
                      {details.shipping_address.street2 && (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "13px", color: "#6c718a" }}
                        >
                          {details.shipping_address.street2}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: "#6c718a" }}
                      >
                        {details.shipping_address.city},{" "}
                        {details.shipping_address.state} -{" "}
                        {details.shipping_address.zip}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "13px", color: "#6c718a" }}
                      >
                        {details.shipping_address.country}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", color: "#6c718a" }}
                    >
                      N/A
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ fontSize: "14px", mt: 1.5 }}>
                  Customer Notes
                </Typography>
              </Grid>
              <hr />
              <Grid item>
                <Typography variant="body2" sx={{ fontSize: "14px", mt: 1.5 }}>
                  Thanks for your business.
                </Typography>
              </Grid>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* Right panel with bill details */}
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              paddingX: "50px",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "12px", textAlign: "center" }}
            >
              invoice Amount
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mt: 0.5, textAlign: "center" }}
            >
              {invoiceAmount}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "12px", textAlign: "center" }}
            >
              Next Invoice Date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                textAlign: "center",
                mt: 0.5,
                color: "#1b6de0",
              }}
            >
              {nextInvoiceDate}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "12px", textAlign: "center", mt: 0.5 }}
            >
              Recurring Period
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, textAlign: "center" }}
            >
              {recurringPeriod}
            </Typography>
          </Box>
        </Box>

        {/* Child Invoices section with dropdown menu */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mb: 2,
            }}
            onClick={handleMenuOpen}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, mr: 1, textTransform: "capitalize" }}
            >
              {filterStatus} Child Bills
            </Typography>
            <KeyboardArrowDownIcon
              sx={{ color: "#1b6de0", fontWeight: 500, fontSize: "16px" }}
            />
          </Box>

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: 1 }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              onClick={() => handleFilterChange("all")}
              sx={{
                bgcolor: filterStatus === "all" ? "#1976d2" : "transparent",
                color: filterStatus === "all" ? "white" : "black",
                width: 180,
                "&:hover": {
                  bgcolor: filterStatus === "all" ? "#1565c0" : "#f5f5f5",
                },
              }}
            >
              All
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("unpaid")}
              sx={{
                bgcolor: filterStatus === "unpaid" ? "#1976d2" : "transparent",
                color: filterStatus === "unpaid" ? "white" : "black",
                width: 180,
                "&:hover": {
                  bgcolor: filterStatus === "unpaid" ? "#1565c0" : "#f5f5f5",
                },
              }}
            >
              Unpaid
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("paid")}
              sx={{
                bgcolor: filterStatus === "paid" ? "#1976d2" : "transparent",
                color: filterStatus === "paid" ? "white" : "black",
                width: 180,
                "&:hover": {
                  bgcolor: filterStatus === "paid" ? "#1565c0" : "#f5f5f5",
                },
              }}
            >
              Paid
            </MenuItem>
          </Menu>

          <Box>
            {!loading &&
              childInvoices?.length > 0 &&
              childInvoices.map((bill, index) => (
                <Box
                  key={bill.bill_id || index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    pb: 2,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5, color: "#21263c" }}
                    >
                      {bill.customer_id || bill.contact_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5, color: "#21263c" }}
                    >
                      {details?.customer_name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        color="#1b6de0"
                        onClick={() =>
                          router.push(`/sales/invoices/${bill?.invoice_id}`)
                        }
                        sx={{ fontSize: "13px", mr: 1, cursor: "pointer" }}
                      >
                        Go to Invoice
                      </Typography>
                      <Divider orientation="vertical" flexItem />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, fontSize: "13px", color: "#6c718a" }}
                      >
                        {formatDate(bill.date)}
                      </Typography>
                    </Box>
                    {/* <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", color: "#6c718a", mt: 0.5 }}
                    >
                      {bill.reference_number || orderNumber}
                    </Typography> */}
                    {/* <Typography
                      variant="body2"
                      sx={{
                        fontSize: "12px",
                        color: "#6c718a",
                        mt: 1,
                        fontStyle: "italic",
                      }}
                    >
                      Manually Added
                    </Typography> */}
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                  <Typography
  variant="body2"
  sx={{ fontWeight: 500, mb: 0.5 }}
>
  {new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(bill.total_formatted.replace(/[^0-9.]/g, '')) || 0)}
</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "12px",
                        textTransform: "uppercase",
                        color:
                          bill.status_formatted === "active"
                            ? "#408dfb"
                            : "#666",
                      }}
                    >
                      {bill.status_formatted}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#4285f4",
                          color: "white",
                          fontSize: "12px",
                          py: 0.5,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#3367d6",
                          },
                        }}
                        onClick={() => onRecordPayment(bill)}
                      >
                        Record Payment
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}

            {loading && <DotLoader />}

            {childInvoices?.length === 0 && (
              <Box sx={{ marginTop: "70px" }}>
                <Typography
                  mt="9"
                  textAlign={"center"}
                  variant="body2"
                  color="#6c718a"
                >
                  Recurring Invoice for this profile will begin from{" "}
                  {nextInvoiceDate}
                </Typography>
              </Box>
            )}

            {showPagination && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Total Count with View toggle */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#21263c", pl: 0.8, mb: 0.5 }}
                  >
                    Total Count:{" "}
                    {showCount ? (
                      totalCount
                    ) : (
                      <span
                        style={{ color: "#206ddc", cursor: "pointer" }}
                        onClick={() => setShowCount(true)}
                      >
                        View
                      </span>
                    )}
                  </Typography>
                </Box>

                {/* Page Navigation */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                >
                  <IconButton
                    disabled={page === 1}
                    onClick={() => handleChangePage(page - 1)}
                    size="small"
                    sx={{
                      color: page === 1 ? "#ccc" : "#408dfb",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      borderRadius: 0,
                    }}
                  >
                    <ChevronLeftIcon width="15px" />
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "normal", color: "#000", px: 1 }}
                  >
                    {startItem} - {endItem}
                  </Typography>
                  <IconButton
                    disabled={!details?.bill_pagination?.has_more_page}
                    onClick={() => handleChangePage(page + 1)}
                    size="small"
                    sx={{
                      color: page >= totalPages ? "#ccc" : "#408dfb",
                      borderRadius: 0,
                      cursor: page >= totalPages ? "not-allowed" : "pointer",
                      height: "100%",
                    }}
                  >
                    <ChevronRightIcon width="15px" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Overview;
