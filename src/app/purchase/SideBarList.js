"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  ThemeProvider,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import config from "../../services/config";
import { usePathname } from "next/navigation";
import formatCurrency from "../common/FormatCurrency";
import SpeedIcon from "@mui/icons-material/Speed";

export default function UserManagementInterface({
  handleSelectRow,
  staticData,
  selected,
  onRowClick,
  selectedType,
  setSelectedValue,
  uniqueId,
  type,
}) {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    console.log(staticData, "staticData");
    console.log("Current type:", type);
    setLoading(false);

    const timer = setTimeout(() => {
      const activeID = pathname.split("/")[3];
      // console.log(staticData, "staticData Received", type);
      let fetchType =
        type === "PurchaseOrder"
          ? "purchase_number"
          : type === "Bills"
          ? "bill_number"
          : type === "Expense"
          ? "unique_EX_id"
          : type === "RecurringExpense"
          ? "recurring_expense_id"
          : type === "Payment"
          ? "payment_id"
          : type === "chartOfAccounts"
          ? "account_id"
          : type === "RecurringBills"
          ? "recurring_bill_id"
          : type === "PaymentMade"
          ? "payment_id"
          : "";
      console.log(activeID, "activeID", fetchType, "fetchType", "#####");
      // Ensure we create a new array to avoid mutating state
      const newArray = staticData.map((item) => ({
        ...item,
        isActive: item[`${fetchType}`] === activeID ? true : false,
      }));
      console.log(newArray, "newArray");
      setData(newArray);
      setLoading(false);
    }, 200); // 200ms delay

    return () => clearTimeout(timer);
  }, [staticData, pathname, type]);

  const handleRowClick = (row) => {
    console.log(row, "skdfkshfksjdfgk");
    handleSelectRow(row);
    setSelectedValue(row);
    onRowClick(row);
  };

  // Skeleton rows for loading state
  const SkeletonRows = () =>
    Array(3)
      .fill(0)
      .map((_, index) => (
        <TableRow key={index}>
          <TableCell scope="row" sx={{ verticalAlign: "top" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Skeleton
                  variant="text"
                  width={120}
                  height={24}
                  sx={{ mb: 0.5 }}
                />
                <Skeleton
                  variant="text"
                  width={180}
                  height={20}
                  sx={{ mb: 0.5 }}
                />
                <Skeleton variant="text" width={60} height={16} />
              </Box>
              <Skeleton variant="text" width={60} height={24} />
            </Box>
          </TableCell>
        </TableRow>
      ));

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            bgcolor: "transparent",
            // width: "320px",
            // borderRight: "1px solid #000",
          }}
        >
          <Table>
            <TableBody>
              {loading ? (
                <SkeletonRows />
              ) : (
                <>
                  {data.map((user) => (
                    <TableRow
                      key={user._id}
                      onClick={() => handleRowClick(user)}
                      sx={{
                        cursor: "pointer",
                        background: user.isActive == true ? "lightgray" : "#fff",
                        "&:hover": {
                          backgroundColor: user.isActive
                            ? "#f5f5f5"
                            : "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell scope="row" sx={{ verticalAlign: "top" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 550,
                                fontSize: "14px",
                                color: "#21263C",
                                mb: 0.5,
                              }}
                            >
                              {type === "PurchaseOrder" ? (
                                user.contact_name
                              ) : type === "Payment" ? (
                                user.contact_id?.first_name
                              ) : type === "RecurringExpense" ? (
                                user.profile_name
                              ) : type === "chartOfAccounts" ? (
                                user.account_name
                              ) : type === "Expense" ? (
                                user.type === "mileage" ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    Fuel/Mileage Expenses
                                    <SpeedIcon
                                      sx={{
                                        fontSize: "20px",
                                        color: "#9a9a9f",
                                      }}
                                    />
                                  </Box>
                                ) : (
                                  user.account_name
                                )
                              ) : (
                                user.vendor_name
                              )}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#4C526C",
                                fontWeight: 400,
                                mb: 0.5,
                                fontSize: "13px",
                              }}
                            >
                              {type === "PurchaseOrder" ? (
                                <>{user.purchase_number + " • " + user.date}</>
                              ) : type === "RecurringExpense" ? (
                                <> {user.account_name}</>
                              ) : type === "chartOfAccounts" ? (
                                <> {user.account_type_formatted}</>
                              ) : type === "Expense" ? (
                                <>{user.date}</>
                              ) : type === "Payment" ? (
                                <>
                                  {user.date}
                                  {user.payment_mode
                                    ? " • " + user.payment_mode
                                    : ""}
                                </>
                              ) : type === "RecurringBills" ? (
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "150px", // adjust based on layout
                                  }}
                                  title={user?.recurrence_name}
                                >
                                  {user.recurrence_name}
                                </div>
                              ) : (
                                <>
                                  {user.bill_number +
                                    " • " +
                                    new Date(
                                      user.created_time
                                    ).toLocaleDateString("en-GB")}
                                </>
                              )}
                            </Typography>
                            <Typography
                              variant="bottom"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                color:
                                  // Payment Made status colors - HIGHEST PRIORITY
                                  (type === "PaymentMade" || type === "Payment") && (user.status === "draft" || user.status === 1)
                                    ? (() => { console.log("Draft color applied"); return "#94a5a6"; })()
                                    : (type === "PaymentMade" || type === "Payment") && (user.status === "paid" || user.status === 2)
                                    ? (() => { console.log("Paid color applied - GREEN"); return "#1fcd6d"; })()
                                    : (type === "PaymentMade" || type === "Payment") && (user.status === "void" || user.status === 3)
                                    ? (() => { console.log("Void color applied"); return "#474747"; })()
                                    // Other status colors - LOWER PRIORITY
                                    : user.status_type === "OPEN"
                                    ? "#408dfb"
                                    : user.status_type === "VOID"
                                    ? "#d3d3d3"
                                    : user.status_type === "DRAFT"
                                    ? "#808080"
                                    : user.status === 1
                                    ? "#a696a4"
                                    : user.status === 2
                                    ? (() => { console.log("General status 2 - RED applied"); return "#f85275"; })()
                                    : user.status === 3
                                    ? "#3fcbe1"
                                    : user.status === "Active"
                                    ? "#22c1c6"
                                    : user.status === "Stopped"
                                    ? "#f76831"
                                    : user.status === "Expired"
                                    ? "#879697"
                                    : user.status === "active"
                                    ? "#388a10"
                                    : user.status === "stopped"
                                    ? "#fba800"
                                    : "#408dfb",
                              }}
                            >
                              {type === "PurchaseOrder"
                                ? user.status_type
                                : type === "RecurringBills"
                                ? user.status
                                : type === "RecurringExpense"
                                ? user.status
                                : type === "Expense"
                                ? user.status === 3
                                  ? "REIMBURSED"
                                  : user.status === 1
                                  ? "UNBILLED"
                                  : user.status === 2
                                  ? "INVOICED"
                                  : ""
                                : (type === "PaymentMade" || type === "Payment")
                                ? (() => {
                                    console.log("Payment type detected, status:", user.status, "type:", typeof user.status);
                                    if (user.status === "draft" || user.status === 1) return "DRAFT";
                                    if (user.status === "paid" || user.status === 2) return "PAID";
                                    if (user.status === "void" || user.status === 3) return "VOID";
                                    return "DRAFT";
                                  })()
                                : user.status_type}
                              {type === "PurchaseOrder" ? (
                                <></>
                              ) : type === "Payment" ? (
                                <>
                                </>
                              ) : (
                                <>
                                  {user.documents === "" || !user.documents ? (
                                    <></>
                                  ) : (
                                    <>
                                      <Tooltip title="Download received bill from vendor">
                                        <IconButton sx={{ ml: 1 }} size="small">
                                          <a
                                            style={{ color: "#408dfb" }}
                                            href={
                                              config.PO_Base_url +
                                              "uploads/" +
                                              user.documents
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <CloudDownloadIcon
                                              style={{ fontSize: "20px" }}
                                              fontSize="small"
                                            />
                                          </a>
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                </>
                              )}
                            </Typography>
                          </Box>

                          <div style={{ float: "right", textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "15px",
                                color: "#21263C",
                              }}
                            >
                              {type === "Expense"
                                ? user.tot_amount
                                : type === "RecurringExpense"
                                ? user.total_formatted
                                : type === "Payment"
                                ? `₹${parseFloat(user.amount || 0).toFixed(2)}`
                                : user.total}
                            </Typography>

                            {type === "RecurringBills" && (
                              <>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "13px",
                                    color: "#4C526C",
                                  }}
                                >
                                  {user.recurrence_frequency}
                                </Typography>

                                {user.status !== "Expired" && (
                                  <Typography
                                    sx={{
                                      fontWeight: 400,
                                      fontSize: "13px",
                                      color: "#4C526C",
                                      mt: 0.5,
                                    }}
                                  >
                                    Next Bill on {user.next_bill_date}
                                  </Typography>
                                )}
                              </>
                            )}
                            {type === "RecurringExpense" && (
                              <>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "13px",
                                    color: "#4C526C",
                                  }}
                                >
                                  {user.recurrence_frequency_formatted}
                                </Typography>

                                {user.status !== "Expired" && (
                                  <Typography
                                    sx={{
                                      fontWeight: 400,
                                      fontSize: "13px",
                                      color: "#4C526C",
                                    }}
                                  >
                                    Next expense date{" "}
                                    {user.next_expense_date_formatted}
                                  </Typography>
                                )}
                              </>
                            )}
                          </div>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell
                        sx={{ textAlign: "center", borderBottom: "none" }}
                        colSpan={8}
                      >
                        {loading ? (
                          <Typography
                            variant="subtitle2"
                            sx={{ padding: "25px" }}
                          >
                            There are no {selectedType}
                          </Typography>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
}
