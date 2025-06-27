"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Configure from "./import-pages/Configure/Configure";
import MapFields from "./import-pages/MapFields/MapFields";
import Preview from "./import-pages/Preview/Preview";
import apiService from "../../services/axiosService";
import config from "../../services/config";
import { useSnackbar } from "../../components/SnackbarProvider";

const steps = ["Configure", "Map Fields", "Preview"];
const UploadPreview = () => {
  // State management without localStorage
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [columnMappings, setColumnMappings] = useState({});
  const [previewData, setPreviewData] = useState([]);

  const [importInProgress, setImportInProgress] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const searchParams = useSearchParams();
  const router = useRouter();
  const { showMessage } = useSnackbar();

  // Get file type from URL parameters
  const fileType = searchParams.get("type");

  // Check if a row is empty (all values are empty, null, or undefined)
  const isRowEmpty = (row) => {
    if (!row) return true;
    return row.every(
      (cell) => cell === null || cell === undefined || cell === ""
    );
  };

  // Function to process the uploaded file
  const processFile = (file) => {
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;

      try {
        if (fileExt === "csv") {
          const text = data;
          const rows = text.split("\n").map((row) => row.split(","));
          const fileHeaders = rows[0].map((header) => header.trim());

          // Filter out empty rows
          const fileData = rows.slice(1).filter((row) => !isRowEmpty(row));

          setHeaders(fileHeaders);
          setTableData(fileData);
        } else if (fileExt === "xls" || fileExt === "xlsx") {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const fileHeaders = json[0];
          // Filter out empty rows
          const fileData = json.slice(1).filter((row) => !isRowEmpty(row));

          setHeaders(fileHeaders);
          setTableData(fileData);
        } else {
          showMessage(
            "Unsupported file format. Please upload a CSV or Excel file.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error processing file:", error);
        showMessage(
          "Error processing file. Please check the format and try again.",
          "error"
        );
      }
    };

    if (fileExt === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // Handler for file uploads
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  // Function to handle preview data received from Preview component
  const handlePreviewDataGenerated = (data) => {
    setPreviewData(data);
    console.log("Preview data in parent:", data);
  };

  // Function to handle API call for importing data
  const handleImportData = async (updateExisting, skipErrors, dataToImport) => {
    if (!fileType) {
      showMessage("File type parameter is missing", "error");
      return;
    }

    setImportInProgress(true);
    setImportError(null);

    try {
      // Prepare the data for API
      const importData = {
        fileType: fileType,
        mappings: columnMappings,
        data: dataToImport || previewData, // Use the data passed from Preview component
        updateExisting: updateExisting,
        skipErrors: skipErrors,
      };
      let org_id = localStorage.getItem("organization_id");
      let baseURL = config.PO_Base_url;
      if (fileType === "customers") {
        baseURL = config.apiBaseUrl;
      } else if (fileType === "quote") {
        baseURL = config.SO_Base_url;
      }
      // Call your API service
      const params = {
        url: `api/v1/import/${fileType}?org_id=${org_id}`,
        method: "POST",
        data: importData.data,
        customBaseUrl: baseURL,
      };

      const response = await apiService(params);
      if (response.statusCode == 200) {
        showMessage(response.data.message, "success");
        if (fileType === "bills") {
          router.push("purchase/bills");
        } else if (fileType === "purchase-order") {
          router.push("purchase/purchaseorder");
        } else if (fileType === "customers") {
          router.push("sales/customer");
        } else if (fileType === "quote") {
          router.push("sales/quotes");
        }
        setImportSuccess(true);
        setImportInProgress(false);
      }
      // if (response.statusCode === 200) {
      //   setImportSuccess(true);
      //   showMessage("Import completed successfully!", "success");
      //   setActiveStep(steps.length); // Move to completion step
      // } else {
      //   throw new Error(response.message || "Import failed");
      // }

      // Mock successful response for demonstration
      // setTimeout(() => {
      //   setImportSuccess(true);
      //   showMessage("Import completed successfully!", "success");
      //   setActiveStep(steps.length); // Move to completion step
      //   setImportInProgress(false);
      // }, 2000);
    } catch (error) {
      console.error("Import error:", error);
      setImportError(error.message || "An error occurred during import");
      showMessage(error.message || "Import failed. Please try again.", "error");
      setImportInProgress(false);
    }
  };

  // Show notification helper
  // const showMessage = (message, severity = "info") => {
  //   setSnackbarMessage(message);
  //   setSnackbarSeverity(severity);
  //   setShowSnackbar(true);
  // };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  // Validate if we can proceed to the next step
  const validateStep = (step) => {
    switch (step) {
      case 0: // Configure step
        return !!selectedFile;
      case 1: // Map Fields step
        // Check if all required mappings are done
        return true; // This will be handled in the MapFields component
      case 2: // Preview step
        return true;
      default:
        return true;
    }
  };

  //  ============STEPPER FUNCTIONS START===========//
  const isStepOptional = (step) => {
    return false; // No optional steps in this workflow
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const nextStep = activeStep + 1;

    // If this is the final step and we're moving to completion
    if (nextStep === steps.length) {
      // Here you would typically call your API to process the import
      console.log("Starting import process with mappings:", columnMappings);

      // Get the options from the Preview component
      // These would typically be passed up from the Preview component
      const updateExisting = true; // Default value, should be passed from Preview
      const skipErrors = false; // Default value, should be passed from Preview

      // Call the import function
      handleImportData(updateExisting, skipErrors);
    } else {
      // Just move to the next step
      setActiveStep(nextStep);
    }

    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    // Clear all state
    setActiveStep(0);
    setSelectedFile(null);
    setHeaders([]);
    setTableData([]);
    setColumnMappings({});
    setPreviewData([]);
    setImportSuccess(false);
    setImportError(null);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Configure
            selectedFile={selectedFile}
            setSelectedFile={(file) => {
              setSelectedFile(file);
              processFile(file);
            }}
          />
        );
      case 1:
        return <MapFields headers={headers} setMappings={setColumnMappings} />;
      case 2:
        return (
          <Preview
            tableData={tableData}
            headers={headers}
            mappings={columnMappings}
            onPreviewDataGenerated={handlePreviewDataGenerated}
            onImport={(updateExisting, skipErrors, importData) => {
              handleImportData(updateExisting, skipErrors, importData);
            }}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  //==========STEPPER FUNCTION END=======//

  // Calculate non-empty rows for display
  const nonEmptyTableDataCount = tableData.filter(
    (row) => !isRowEmpty(row)
  ).length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Import Data
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <React.Fragment>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              {importInProgress ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                >
                  <CircularProgress size={50} />
                  <Typography variant="h6">
                    Processing your import...
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    This may take a moment depending on the size of your data.
                  </Typography>
                </Box>
              ) : importError ? (
                <Box>
                  <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    Import Failed
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {importError}
                  </Typography>
                  <Button variant="contained" onClick={handleReset}>
                    Try Again
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Import Completed Successfully!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Your data has been imported into the system.
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Button variant="contained" onClick={handleReset}>
                      Import Another File
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // Navigate to the main page for the imported data type
                        router.push(`/${fileType}`);
                      }}
                    >
                      View Imported Data
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 3, mb: 3 }}>{renderStepContent(activeStep)}</Box>
            {activeStep === 0 && tableData.length > 0 && (
              <Paper elevation={2} sx={{ mt: 4, overflow: "auto" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ p: 2, background: "#f5f5f5" }}
                >
                  File Preview
                  {nonEmptyTableDataCount !== tableData.length &&
                    ` (${
                      tableData.length - nonEmptyTableDataCount
                    } empty rows will be ignored)`}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {headers.map((head, idx) => (
                        <TableCell
                          key={idx}
                          sx={{ fontWeight: 600, background: "#f9fafb" }}
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData
                      .filter((row) => !isRowEmpty(row))
                      .slice(0, 5)
                      .map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((_, colIndex) => (
                            <TableCell key={colIndex}>
                              {row[colIndex] || ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {nonEmptyTableDataCount > 5 && (
                  <Box
                    sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
                  >
                    Showing 5 of {nonEmptyTableDataCount} rows
                  </Box>
                )}
              </Paper>
            )}

            <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !selectedFile) || importInProgress
                }
              >
                {activeStep === steps.length - 1 ? "Finish Import" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
};

export default UploadPreview;
