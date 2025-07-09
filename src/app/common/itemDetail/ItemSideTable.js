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
import DotLoader from "../../../components/DotLoader";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Settings,
} from "lucide-react";

export default function ItemSideTable({
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

  const handleRowClick = (row) => {
    let id;
    if (module === "item") {
      id = row.item_id || row._id;
    } else {
      id = row._id;
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
      status === "active" ||
      status === "available" ||
      status === "in_stock"
    ) {
      return "#22b378";
    } else if (
      status === "draft" ||
      status === "pending"
    ) {
      return "#408dfb";
    } else if (
      status === "inactive" ||
      status === "discontinued" ||
      status === "out_of_stock"
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
                staticData.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      backgroundColor:
                        item.item_id === selectedId ||
                        item._id === selectedId
                          ? "#ededed"
                          : selected.includes(item._id)
                          ? "#e3f2fd"
                          : "transparent",
                      borderLeft: (theme) =>
                        selected.includes(item._id)
                          ? `3px solid ${theme.palette.primary.main}`
                          : "none",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(item._id)}
                        onChange={() => handleSelectRow(item._id)}
                        size="small"
                        sx={{ ml: 0.5 }}
                      />
                    </TableCell>
                    <TableCell
                      scope="row"
                      sx={{ verticalAlign: "top" }}
                      onClick={() => handleRowClick(item)}
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
                            {item.item_name || item.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 400,
                              color: "#757575",
                              fontSize: "12px",
                            }}
                          >
                            {item.item_code || item.code} • {item.category_name || item.category}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 400,
                              color: "#757575",
                              fontSize: "12px",
                            }}
                          >
                            {item.description && item.description.length > 50
                              ? `${item.description.substring(0, 50)}...`
                              : item.description}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: getColor(item.status),
                              fontSize: "12px",
                              mt: 1,
                              textTransform: "uppercase",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.status_formatted || item.status}
                          </Typography>
                        </Box>
                        <Box>
                          <div style={{ float: "right", textAlign: "right" }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#222",
                                fontWeight: 700,
                                fontSize: "14px",
                                textTransform: "uppercase",
                              }}
                            >
                              {item.rate_formatted || item.rate || "₹0.00"}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "13px",
                                color: "#4C526C",
                                mb: 0.7,
                              }}
                            >
                              Stock: {item.stock_quantity || item.quantity || 0}
                            </Typography>
                            {item.unit && (
                              <Typography
                                sx={{
                                  fontWeight: 360,
                                  fontSize: "12px",
                                  color: "#4C526C",
                                  whiteSpace: "nowrap",
                                  display: "block",
                                }}
                              >
                                Unit: {item.unit}
                              </Typography>
                            )}
                          </div>
                        </Box>
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
            height: "84px",
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 1,
            boxShadow: "0px -1px 4px rgba(0,0,0,0.05)",
          }}
        >
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
              width: "220px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
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