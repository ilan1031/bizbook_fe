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
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import DotLoader from "../../../../components/DotLoader";

const Overview = ({
  details,
  page,
  limit,
  callBack,
  loading,
  setFilterStatus,
  filterStatus,
}) => {
  const router = useRouter();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(limit);
  const totalCount = details?.bill_pagination?.total;
  console.log(totalCount, "totalCounttotalCount**_*___");
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



  // Format currency number to Indian Rupee format
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Use data from props
  const vendorName = details?.vendor_data?.contact_name || "Mr. Srikanth E";
  const profileStatus = details?.status_type || "active";
  const startDate = formatDate(details?.start_date) || "17/05/2025";
  const endDate = details?.end_date
    ? formatDate(details?.end_date)
    : "Never Expires";
  const paymentTerms = details?.payment_terms_label || "Net 30";
  const billAmount = formatCurrency(details?.total) || "₹85,705.81";
  const nextBillDate = formatDate(details?.next_bill_date) || "--";
  let recurringPeriod = "";
  const freqMap = {
    days: "Day",
    weeks: "Week",
    months: "Month",
    years: "Year",
  };

  const unit = freqMap[details?.recurrence_frequency];

  if (details?.repeat_every === 1) {
    // Singular form
    recurringPeriod = `${unit}ly`; // e.g., Daily, Weekly, Monthly
  } else {
    // Plural form with count
    recurringPeriod = `Every ${details?.repeat_every} ${unit}s`; // e.g., Every 2 Weeks
  }

  // Child bills data
  const childBills = details?.bills_for_vendor;

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

  const getBgColor = (status) => {
    switch (status) {
      case "expired":
        return "#6c757d";
      case "active":
        return "#388a10";
      case "stopped":
        return "#eb6100";
      default:
        return "#f44336";
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Grid className="details" container spacing={3}>
        {/* Left panel with vendor details */}
        <Grid className="details-info" item xs={12} md={4}>
          <Card
            variant="outlined"
            sx={{ mb: 3, border: 0, background: "none" }}
          >
            <Box sx={{ display: "flex", mb: 1 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
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
                  onClick={() =>
                    router.push(`/purchase/vendor/${details?.vendor_id?._id}`)
                  }
                  sx={{
                    fontSize: "14px",
                    mb: 0.5,
                    fontWeight: 500,
                    color: "#1976d2",
                  }}
                >
                  {vendorName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  textTransform: "uppercase",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                DETAILS
              </Typography>
              <Divider sx={{ my: 1 }} />

              {/* Details list */}
              <Box sx={{ mt: 2 }}>
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
                          bgcolor: getBgColor(profileStatus),
                          color: "white",
                          px: 1,
                          py: 0.3,
                          fontSize: "10px",
                          fontWeight: 600,
                          borderRadius: 0.5,
                          textTransform: "capitalize",
                          
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
                      Payment Terms:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontSize: "13px" }}>
                      {paymentTerms}
                    </Typography>
                  </Grid>
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
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "12px", textAlign: "center" }}
              >
                Bill Amount
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, mt: 0.5, textAlign: "center" }}
              >
                {billAmount}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "12px", textAlign: "center" }}
              >
                Next Bill Date
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
                {nextBillDate}
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

          {/* Child Bills section with dropdown menu */}
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
                    bgcolor: filterStatus === "all" ? "#1565c0" : "",
                  },
                }}
              >
                All
              </MenuItem>
              <MenuItem
                onClick={() => handleFilterChange("unpaid")}
                sx={{
                  bgcolor:
                    filterStatus === "unpaid" ? "#1976d2" : "transparent",
                  color: filterStatus === "unpaid" ? "white" : "black",
                  width: 180,
                  "&:hover": {
                    bgcolor: filterStatus === "unpaid" ? "#1565c0" : "",
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
                    bgcolor: filterStatus === "paid" ? "#1565c0" : "",
                  },
                }}
              >
                Paid
              </MenuItem>
            </Menu>

            <Box>
              {!loading &&
                childBills?.length > 0 &&
                childBills?.map((bill) => (
                  <Box
                    key={bill.bill_number}
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
                        {bill?.vendor_id?.contact_name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="body2"
                          color="#1b6de0"
                          onClick={() =>
                            router.push(`/purchase/bills/${bill.bill_number}`)
                          }
                          sx={{ fontSize: "13px", mr: 1, cursor: "pointer" }}
                        >
                          Go to Bill
                        </Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontSize: "13px", color: "#6c718a" }}
                        >
                          {formatDate(bill.billDate)}
                        </Typography>
                      </Box>
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
                        }).format(bill.total)}
                      </Typography>

                      <Typography
                        variant="bottom"
                        sx={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          color:
                            bill.status_type === "OPEN" ? "#408dfb" : "#666",
                        }}
                      >
                        {bill.status_type}
                      </Typography>
                      {/* <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
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
                          }}
                        >
                          Record Payment
                        </Button>
                      </Box> */}
                    </Box>
                  </Box>
                ))}
              {loading && <DotLoader />}
              {childBills?.length === 0 && (
                <Box sx={{ marginTop: "70px" }}>
                  <Typography
                    mt="9"
                    textAlign={"center"}
                    variant="body2"
                    color="#6c718a"
                  >
                    Recurring bills for this profile will begin from{" "}
                    {nextBillDate}
                  </Typography>
                </Box>
              )}
              {showPagination && (
                <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // width:"93px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                    }}
                  >
                    {/* Page Navigation */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        backgroundColor: "white",
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
                          height: "100%",
                        }}
                      >
                        <ChevronLeftIcon width="15px" />
                      </IconButton>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "normal",
                          color: "#000",
                          fontSize: "14px",
                        }}
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
                          cursor:
                            page >= totalPages ? "not-allowed" : "pointer",
                          height: "100%",
                        }}
                      >
                        <ChevronRightIcon width="15px" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;





