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
  CircularProgress,
  Menu,
  Tooltip,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";
import config from "../../services/config";
import DotLoader from "../../components/DotLoader";
import { ChevronLeftIcon, ChevronRightIcon, Settings } from "lucide-react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function userManagementInterface({
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
  const fileStorage = module === "Customer" ? "uploads/customers/" : "";
  const handleRowClick = (row) => {
    setSelectedId(row.contact_id);
    getData(row.contact_id);
    onRowClick(row);
  };
  useEffect(() => {
    setSelectedId(uniqueId);
  }, [uniqueId]);

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

  const showPagination = totalCount > 10;
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            bgcolor: "transparent",
            height: showPagination ? "540px" : "620px",
          }}
        >
          <Table>
            <TableBody>
              {!loading &&
                staticData.map((user) => (
                  <TableRow
                    key={user.contact_id}
                    onClick={() => handleRowClick(user)}
                    sx={{
                      backgroundColor:
                        user.contact_id === selectedId
                          ? "#ededed"
                          : "transparent",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(user.contact_id)}
                        onChange={() => handleSelectRow(user.contact_id)}
                        size="small"
                        sx={{ ml: 0.5 }}
                      />
                    </TableCell>
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
                              fontWeight: 600,
                              fontSize: "13px",
                              color: theme.palette.text.primary,
                            }}
                          >
                            {user.contact_name}
                          </Typography>
                          <Typography
                            variant="bottom"
                            sx={{
                              fontWeight: 400,
                              color: "#757575",
                              fontSize: "12px",
                            }}
                          >
                            {user.outstanding_receivable_amount_formatted }
                          </Typography>
                          {user.documents === "" || !user.documents ? (
                            <></>
                          ) : (
                            <>
                              <Tooltip title="Download received bill from vendor">
                                <IconButton sx={{ ml: 1 }} size="small">
                                  <a
                                    style={{ color: "#408dfb" }}
                                    href={
                                      config.SO_Base_url +
                                      fileStorage +
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
                        </Box>

                        {user.status === "inactive" && (
                          <div style={{ position: "relative", top: "18px" }}>
                            <Typography
                              variant="bottom"
                              sx={{
                                color: "#757575",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                              }}
                            >
                              {user.status}
                            </Typography>
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
