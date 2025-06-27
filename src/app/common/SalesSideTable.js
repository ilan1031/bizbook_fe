


"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  ThemeProvider,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import DotLoader from "../../components/DotLoader";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Mail,
  Settings,
} from "lucide-react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import config from "../../../src/services/config";

export default function SalesSideTable({
  selected,
  handleSelectRow,
  handleSelectAll,
  allSelected,
  staticData,
  onRowClick,
  selectedType,
  uniqueId,
  getData,
  loading,
  module,
  hasMore,
  totalCount,
  page,
  limit,
  limitValue,
  callBackAPI,
}) {
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState(uniqueId);
  const [rowsPerPage, setRowsPerPage] = useState(limitValue);
  const [showCount, setShowCount] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const fileStorage =
    module === "SO"
      ? "uploads/salesOrder/"
      : module === "quote"
      ? "uploads/quotation/"
      : module === "invoice"
      ? "uploads/invoice/"
      :module === "deliveryChallan"
      ? "uploads/deliveryChallan/"
      :module === "recurring_invoice"
      ?"uploads/recurringInvoice/"
      : "uploads/";
  const handleRowClick = (row) => {
    let id;
    if (module === "invoice") {
      id = row.invoice_id;
    } else if (module === "quote") {
      id = row.quote_id;
    } else if (module === "PR") {
      id = row.payment_id;
    } else {
      id = row.salesorder_id;
    }
    setSelectedId(id);
    getData(id);
    onRowClick(row);
  };
  useEffect(() => {
    setSelectedId(uniqueId);
  }, [uniqueId]);

  const getColor = (status) => {
    if (
      status === "closed" ||
      status === "partially paid" ||
      status === "paid" ||
      status === "invoiced" ||
      status === "accepted" ||
      status === "delivered" ||
      status === "active"
    ) {
      return "#22b378";
    } else if (
      status === "sent" ||
      status === "confirmed" ||
      status === "open"
    ) {
      return "#408dfb";
    } else if (
      status === "declined" ||
      status === "overdue" ||
      status === "stopped"
    ) {
      return "#F76831";
    } else {
      return "#879697";
    }
  };
  const handleChangePage = (newPage) => {
    callBackAPI(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    limit(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    handleClose();
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startItem = totalCount === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalCount);

  const showPagination = totalCount > limit;
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            bgcolor: "transparent",
            height: showPagination ? "540px" : "600px",
          }}
        >
          <Table>
            <TableBody>
              {!loading &&
                staticData.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      backgroundColor:
                        user.quote_id === selectedId ||
                        user.invoice_id === selectedId ||
                        user.salesorder_id === selectedId ||
                        user.payment_id === selectedId ||
                        user.recurring_invoice_id === selectedId ||
                        user.deliverychallan_id === selectedId
                          ? "#ededed"
                          : selected.includes(user._id)
                          ? "#e3f2fd"
                          : "transparent",
                      borderLeft: (theme) =>
                        selected.includes(user._id)
                          ? `3px solid ${theme.palette.primary.main}`
                          : "none",
                      
                    }}
                  >
                    {module !== "deliveryChallan" && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(user._id)}
                          onChange={() => handleSelectRow(user._id)}
                          size="small"
                          sx={{ ml: 0.5 }}
                        />
                      </TableCell>
                    )}

                    <TableCell
                      scope="row"
                      sx={{ verticalAlign: "top" }}
                      onClick={() => handleRowClick(user)}
                    >
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
                              fontWeight: 600,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                            }}
                          >
                            {user.customer_name}
                          </Typography>
                          <Typography
                            variant="bottom"
                            sx={{
                              fontWeight: 400,
                              color: "#757575",
                              fontSize: "12px",
                            }}
                          >
                            {user.estimate_number ||
                              user.invoice_number ||
                              user.payment_id ||
                              user.salesorder_number ||
                              user.deliverychallan_number}{" "}
                            {!module === "PR" && (
                              <>
                                {" "}
                                <span style={{ fontSize: "15px" }}>
                                  &#8226;
                                </span>{" "}
                              </>
                            )}
                            {module === "PR" ? "" : user?.recurrence_name}
                            {module !== "PR" && user.recurrence_name && <> </>}
                          </Typography>
                          {module === "PR" && (
                            <Typography
                              variant="bottom"
                              sx={{
                                fontWeight: 400,
                                color: "#757575",
                                fontSize: "12px",
                              }}
                            >
                              {user?.date_formatted}
                            </Typography>
                          )}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color:
                                  module === "PR"
                                    ? "#21263C"
                                    : module === "SO"
                                    ? getColor(user?.order_status)
                                    : getColor(user?.status),
                                fontSize: "12px",
                                mt: 1,
                                textTransform: "uppercase",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {module === "SO" ? (
                                <>
                                  {user?.order_status_formatted}
                                  {user?.is_emailed && (
                                    <>
                                      <Tooltip
                                        title="Sales Order sent via mail"
                                        placement="right"
                                        arrow
                                      >
                                        <EmailOutlinedIcon
                                          style={{
                                            color: "#6C718A",
                                            fontSize: "15px",
                                            marginLeft: "5px",
                                          }}
                                        />
                                      </Tooltip>
                                    </>
                                  )}
                                </>
                              ) : module === "PR" ? (
                                <>{user.payment_mode}</>
                              ) : module === "invoice" &&
                                (user?.status === "overdue" ||
                                  user?.status === "sent") ? (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  {user?.due_days}
                                  <Mail
                                    width="15px"
                                    color="#6C718A"
                                    style={{ marginLeft: "5px" }}
                                  />
                                </Box>
                              ) : (
                                user?.status_formatted
                              )}
                            </Typography>

                            <Box sx={{ mt: 1 }}>
                              {(Array.isArray(user.documents) && user.documents.length > 0) ||
                              (!Array.isArray(user.documents) && user.documents) ? (
                                <Tooltip title={`Download received ${module} from customer`}>
                                  <IconButton sx={{ ml: 1 }} size="small">
                                    <a
                                      style={{ color: "#408dfb" }}
                                      href={config.SO_Base_url + fileStorage + user.documents}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <CloudDownloadIcon style={{ fontSize: "20px" }} fontSize="small" />
                                    </a>
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </Box>
                          </Box>
                        </Box>

                        {(user.total || user.amount) && (
                          <div style={{ float: "right", textAlign: "right" }}>
                            <Typography
                              variant="bottom"
                              sx={{
                                color: "#222",
                                fontWeight: 700,
                                fontSize: "14px",
                                textTransform: "uppercase",
                              }}
                            >
                              {user.total_formatted ||
                                user.amount_formatted ||
                                user.total_amount_formatted?.toFixed(2)}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "13px",
                                color: "#4C526C",
                                mb: 0.7,
                              }}
                            >
                              {user.recurrence_frequency}
                            </Typography>
                            {user.status !== "Expired" && (
                              <Box sx={{ textAlign: "right", mt: 0.5 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 360,
                                    fontSize: "12px",
                                    color: "#4C526C",
                                    whiteSpace: "nowrap", // Ensures it stays on one line
                                    display: "block",
                                  }}
                                >
                                  {user.next_invoice_date_next_sentence}
                                </Typography>
                              </Box>
                            )}
                          </div>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && staticData.length === 0 && (
                <TableRow>
                  <TableCell
                    sx={{ textAlign: "center", borderBottom: "none" }}
                    colSpan={8}
                  >
                    <Typography variant="subtitle2" sx={{ padding: "25px" }}>
                      There are no {selectedType}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {loading && <DotLoader />}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {showPagination && !loading && (
        <Box
          sx={{
            p: 2,
            height: "84px", // or match actual height
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff", // to avoid bleed-through
            zIndex: 1,
            boxShadow: "0px -1px 4px rgba(0,0,0,0.05)",
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

          {/* Pagination Controls - Right Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "220px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {/* Items Per Page Selector */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "4px 12px",
                cursor: "pointer",
                backgroundColor: "#f5f7fa",
                color: "#838195",
                "& svg": {
                  color: "#838195",
                },
                "&:hover": {
                  color: "#2485e8",
                  "& svg": {
                    color: "#2485e8",
                  },
                },
              }}
              onClick={handleClick}
            >
              <Settings width="16px" style={{ marginRight: "5px" }} />
              <Typography variant="body2" sx={{ fontSize: "14px" }}>
                {rowsPerPage} per page
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{ dense: true }}
              PaperProps={{
                sx: {
                  mt: 1,
                  width: 150,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                },
              }}
            >
              {[10, 25, 50, 100, 200].map((value) => (
                <MenuItem
                  key={value}
                  selected={rowsPerPage === value}
                  onClick={() => handleChangeRowsPerPage({ target: { value } })}
                >
                  {value} per page
                </MenuItem>
              ))}
            </Menu>

            <Divider orientation="vertical" flexItem />
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
                disabled={!hasMore}
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
        </Box>
      )}
    </ThemeProvider>
  );
}
