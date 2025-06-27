"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

const Preview = ({
  tableData = [],
  headers = [],
  mappings = {},
  onImport,
  onPreviewDataGenerated,
}) => {
  const [previewData, setPreviewData] = useState([]);
  const [validationResults, setValidationResults] = useState({
    valid: 0,
    invalid: 0,
    warnings: 0,
  });
  const [isValidating, setIsValidating] = useState(true);
  const [updateExisting, setUpdateExisting] = useState(true);
  const [skipErrors, setSkipErrors] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Get the mapped columns for preview
  const getMappedColumnName = (fileHeader) => {
    const entry = Object.entries(mappings).find(
      ([_, value]) => value === fileHeader
    );
    return entry ? entry[0] : null;
  };

  // Check if a row is empty (all values are empty, null, or undefined)
  const isRowEmpty = (row) => {
    if (!row) return true;
    return row.every(
      (cell) => cell === null || cell === undefined || cell === ""
    );
  };

  // Get mapped data for display, filtering out empty rows
  const getMappedData = () => {
    // Create an array of mapped data, ignoring empty rows
    return tableData
      .filter((row) => !isRowEmpty(row))
      .map((row, rowIndex) => {
        const mappedRow = {};
        headers.forEach((header, colIndex) => {
          const dbField = getMappedColumnName(header);
          if (dbField) {
            mappedRow[dbField] = row[colIndex];
          }
        });
        return mappedRow;
      });
  };

  // Simulate validation
  const validateData = (mappedData) => {
    setIsValidating(true);
    // Simulate async validation
    setTimeout(() => {
      const dataLength = mappedData.length;
      const results = {
        valid: Math.floor(dataLength * 0.8),
        invalid: Math.floor(dataLength * 0.1),
        warnings: Math.floor(dataLength * 0.1),
      };

      setValidationResults(results);
      setIsValidating(false);
    }, 1500);
  };

  // Handle direct import from this component
  const handleImport = () => {
    setIsImporting(true);

    // Call the parent component's import handler with our options and data
    if (onImport) {
      onImport(updateExisting, skipErrors, previewData);
    }

    setIsImporting(false);
  };

  useEffect(() => {
    // Set the mapped preview data
    const mappedData = getMappedData();
    const filteredData = mappedData.filter((row) =>
      Object.values(row).some(
        (value) => value !== null && value !== undefined && value !== ""
      )
    );
    console.log("filteredData", filteredData);
    setPreviewData(filteredData);

    // Share the preview data with parent component
    if (onPreviewDataGenerated) {
      onPreviewDataGenerated(filteredData);
    }

    // Run validation
    validateData(filteredData);
  }, [tableData, headers, mappings]);

  // Get db column labels from mappings
  const getDbColumnLabels = () => {
    const dbFields = Object.keys(mappings).filter((key) => mappings[key]);

    // This should be replaced with your actual DB column definitions
    const dbColumnLabels = {
      // name: "Name",
      // email: "Email",
      // phone: "Phone Number",
      // address: "Address",
      // city: "City",
      // state: "State",
      // zipcode: "Zip Code",
      // country: "Country",
      // company: "Company",
    };

    return dbFields.map((field) => dbColumnLabels[field] || field);
  };

  const dbColumnLabels = getDbColumnLabels();
  const nonEmptyTableDataCount = tableData.filter(
    (row) => !isRowEmpty(row)
  ).length;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Preview & Import
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ mb: 3, overflow: "auto" }}>
            <Box
              sx={{
                p: 2,
                background: "#f5f5f5",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="subtitle1">Data Preview</Typography>
              <Typography variant="body2" color="text.secondary">
                Showing {Math.min(10, previewData.length)} of{" "}
                {previewData.length}{" "}
                {/* rows {nonEmptyTableDataCount !== tableData.length && `(${tableData.length - nonEmptyTableDataCount} empty row ignored)`} */}
              </Typography>
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: 50 }}>#</TableCell>
                  {dbColumnLabels.map((label, idx) => (
                    <TableCell
                      key={idx}
                      sx={{ fontWeight: 600, background: "#f9fafb" }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.slice(0, 10).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{rowIndex + 1}</TableCell>
                    {Object.keys(mappings)
                      .filter((key) => mappings[key])
                      .map((dbField, colIndex) => (
                        <TableCell key={colIndex}>
                          {row[dbField] || ""}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Import Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {isValidating ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={4}
              >
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Validating data...
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">Total Records:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {previewData.length}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon
                      color="success"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">Valid Records:</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {validationResults.valid}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Box display="flex" alignItems="center">
                    <ErrorIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">Invalid Records:</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="error.main"
                    fontWeight="bold"
                  >
                    {validationResults.invalid}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box display="flex" alignItems="center">
                    <WarningIcon
                      color="warning"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">Warnings:</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="warning.main"
                    fontWeight="bold"
                  >
                    {validationResults.warnings}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={updateExisting}
                      onChange={(e) => setUpdateExisting(e.target.checked)}
                    />
                  }
                  label="Update existing records"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={skipErrors}
                      onChange={(e) => setSkipErrors(e.target.checked)}
                    />
                  }
                  label="Skip rows with errors"
                />
              </>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Import Options
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Ready to import {previewData.length} records</strong>
              </Typography>
              <Typography variant="body2">
                Click &quot;Finish&quot; to complete the import process.
              </Typography>
            </Alert>

            {validationResults.invalid > 0 && !skipErrors && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You have {validationResults.invalid} invalid records. Consider
                enabling &quot;Skip rows with errors&quot; to proceed.
              </Alert>
            )}

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleImport}
                disabled={isImporting || isValidating}
                fullWidth
              >
                {isImporting ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{ mr: 1 }}
                      color="inherit"
                    />
                    Importing...
                  </>
                ) : (
                  "Import Now"
                )}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: This action cannot be undone. Please ensure your data
              mappings are correct before proceeding.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Preview;
