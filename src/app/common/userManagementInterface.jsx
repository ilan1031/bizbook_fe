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
} from "@mui/material";

export default function userManagementInterface({
  selected,
  handleSelectRow,
  staticData,
  onRowClick,
  selectedType,
  uniqueId,
  getCustomer,
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState(uniqueId);

  const handleRowClick = (row) => {
    setSelectedId(row.contact_id);
    getCustomer(row.contact_id);
    onRowClick(row);
  };

  useEffect(() => {
    setSelectedId(uniqueId);
  }, [uniqueId]);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            bgcolor: "transparent",
          }}
        >
          <Table>
            <TableBody>
              {staticData.map((user) => (
                <TableRow
                  key={user.contact_id}
                  onClick={() => handleRowClick(user)}
                  sx={{
                    backgroundColor:
                      user.contact_id === selectedId
                        ? "#f8f8f8"
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
                          {user.outstanding_receivable_amount_formatted}
                        </Typography>
                      </Box>
                      {user.status && (
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
              {staticData.length === 0 && (
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
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
}
