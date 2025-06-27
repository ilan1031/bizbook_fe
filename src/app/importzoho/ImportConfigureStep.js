// components/ImportConfigureStep.js
"use client";
import React, { useState, useCallback } from "react";
import { useImport } from "../../context/ImportContext";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Link,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDropzone } from "react-dropzone";
import apiService from "../../../src/services/axiosService";
import config from "../../services/config";

const ImportConfigureStep = () => {
  const {
    activeStep,
    setActiveStep,
    entityType,
    setEntityType,
    encoding,
    setEncoding,
    autoGenerateNumbers,
    setAutoGenerateNumbers,
    linkRelatedEntities,
    setLinkRelatedEntities,
    mapAddresses,
    setMapAddresses,
    uploadedFile,
    setUploadedFile,
    setFileName,
    setFileSize,
    setAvailableFields,
    setMappedFields,
    setUnmappedFields,
    setImportId,
  } = useImport();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);

  // Dropzone configuration
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      console.log("File selected:", file);

      // Check file type
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/csv",
        "text/comma-separated-values",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (
        !validTypes.includes(file.type) &&
        !file.name.endsWith(".csv") &&
        !file.name.endsWith(".xls") &&
        !file.name.endsWith(".xlsx") &&
        !file.name.endsWith(".tsv")
      ) {
        setFileError(
          "Invalid file type. Please upload a CSV, TSV, or XLS file."
        );
        return;
      }

      // Check file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        setFileError("File is too large. Maximum size is 25MB.");
        return;
      }

      setUploadedFile(file);
      setFileName(file.name);
      setFileSize(file.size);
      setFileError(null);
    },
    [setUploadedFile, setFileName, setFileSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "text/tab-separated-values": [".tsv"],
    },
    multiple: false,
  });

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("File selected via input:", file);
      onDrop([file]);
    }
  };

  const handleEncodingChange = (event) => {
    setEncoding(event.target.value);
  };

  // For debugging and development purposes - skips the API call during development
  const handleSkipToNext = () => {
    console.log("Skipping to next step");
    // Set some dummy data for development
    setAvailableFields(["field1", "field2", "field3"]);
    setMappedFields({ Column1: "field1", Column2: "field2" });
    setUnmappedFields(["Column3", "Column4"]);
    setImportId("dev-import-id");

    // Move to next step
    setActiveStep(1);
  };

  const handleNextClick = async () => {
    if (!uploadedFile) {
      setFileError("Please select a file to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Processing file:", uploadedFile);

    try {
      // For development/testing - you can enable this and comment out the API call below
      // to skip the actual API call during development
      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_SKIP_API === "true"
      ) {
        handleSkipToNext();
        setLoading(false);
        return;
      }
      // console.log("uploadedFile", uploadedFile, entityType);
      // return;
      // Prepare form data
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("entity", entityType);
      formData.append("organization_id", "100021"); // Using the organization ID from your requirements

      // Call the API using your existing apiService
      const response = await apiService({
        method: "post",
        url: "/api/v1/import/preview",
        customBaseUrl: config.PO_Base_url,
        data: formData,
        file: true, // This will use the imageAxiosInstance with multipart/form-data content type
      });

      console.log("API response:", response);

      if (response.data.status === "OK" || response.statusCode === 200) {
        const data = response.data.data || response.data;

        // Save the mapping and available fields
        setAvailableFields(data.availableFields || []);
        setMappedFields(data.mapping || {});
        setUnmappedFields(data.unmappedFields || []);
        setImportId(data.importId || "temp-import-id");

        // Move to next step
        setActiveStep(1);
      } else {
        setError(
          response.data.message || "Failed to upload file. Please try again."
        );
      }
    } catch (err) {
      console.log("Error in file upload:", err);

      if (err.message && err.message.includes("No token provided")) {
        setError(
          "Authentication token is missing. Please login and try again."
        );
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }

      // For development purposes, move to next step anyway
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock data instead because of error");
        handleSkipToNext();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset or close the import flow
    window.history.back();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        width: "100%",
        py: 1,
        position: "relative",
        borderRadius: 1,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <Paper elevation={0}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" component="h1">
            {entityType === "expense"
              ? "Expenses"
              : entityType === "purchaseorder"
              ? "Purchase Orders"
              : "Bills"}{" "}
            - Select File
          </Typography>
          <IconButton aria-label="close" onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ width: "100%", px: 2, py: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step key="configure">
              <StepLabel>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#1976d2",
                  }}
                >
                  Configure
                </Typography>
              </StepLabel>
            </Step>
            <Step key="map-fields">
              <StepLabel>
                <Typography sx={{ color: "#9e9e9e" }}>Map Fields</Typography>
              </StepLabel>
            </Step>
            <Step key="preview">
              <StepLabel>
                <Typography sx={{ color: "#9e9e9e" }}>Preview</Typography>
              </StepLabel>
            </Step>
          </Stepper>

          {/* Entity Type Selection */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Entity Type
            </Typography>
            <InfoOutlinedIcon fontSize="small" color="action" />
            <Box sx={{ flexGrow: 1 }} />
            <Select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              displayEmpty
              sx={{
                minWidth: 250,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
              }}
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="purchaseorder">Purchase Order</MenuItem>
              <MenuItem value="bill">Bill</MenuItem>
            </Select>
          </Box>

          {/* File Upload Area */}
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              mb: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 40, color: "#9e9e9e", mb: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {isDragActive
                ? "Drop the file here"
                : "Drag and drop file to import"}
            </Typography>

            <Button
              variant="contained"
              component="label"
              sx={{
                mb: 2,
                textTransform: "none",
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Choose File
              <input
                type="file"
                accept=".csv,.xls,.xlsx,.tsv"
                hidden
                onChange={handleFileSelect}
              />
            </Button>

            <Typography variant="body2" color="text.secondary">
              Maximum File Size: 25 MB • File Format: CSV or TSV or XLS
            </Typography>
          </Paper>

          {fileError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {fileError}
            </Alert>
          )}

          {uploadedFile && (
            <Alert severity="success" sx={{ mb: 3 }}>
              File selected: {uploadedFile.name} (
              {(uploadedFile.size / 1024).toFixed(2)} KB)
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2">
              Download a{" "}
              <Link href="#" underline="hover">
                sample csv file
              </Link>{" "}
              or{" "}
              <Link href="#" underline="hover">
                sample xls file
              </Link>{" "}
              and compare it to your import file to ensure you have the file
              perfect for the import.
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Character Encoding
            </Typography>
            <InfoOutlinedIcon fontSize="small" color="action" />
            <Box sx={{ flexGrow: 1 }} />
            <Select
              value={encoding}
              onChange={handleEncodingChange}
              displayEmpty
              sx={{
                minWidth: 250,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
              }}
            >
              <MenuItem value="UTF-8 (Unicode)">UTF-8 (Unicode)</MenuItem>
              <MenuItem value="ASCII">ASCII</MenuItem>
              <MenuItem value="ISO-8859-1">ISO-8859-1</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoGenerateNumbers}
                  onChange={(e) => setAutoGenerateNumbers(e.target.checked)}
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  {entityType === "expense"
                    ? "Auto-generate Expense Numbers"
                    : entityType === "purchaseorder"
                    ? "Auto-generate PO Numbers"
                    : "Auto-generate Bill Numbers"}
                </Typography>
              }
            />
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {entityType === "expense"
                  ? "Expense"
                  : entityType === "purchaseorder"
                  ? "Purchase Order"
                  : "Bill"}{" "}
                numbers will be generated automatically according to your
                settings. Any numbers in the import file will be ignored.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={linkRelatedEntities}
                  onChange={(e) => setLinkRelatedEntities(e.target.checked)}
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  {entityType === "expense"
                    ? "Link Expenses to their corresponding Purchase Orders."
                    : entityType === "purchaseorder"
                    ? "Link Purchase Orders to their corresponding Sales Orders."
                    : "Link Bills to their corresponding Purchase Orders."}
                </Typography>
              }
            />
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" color="text.secondary">
                If you enable this option, you must map the related field with
                the appropriate column containing the reference number in the
                next page.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mapAddresses}
                  onChange={(e) => setMapAddresses(e.target.checked)}
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  Map the addresses in the import file to their corresponding
                  record in the system.
                </Typography>
              }
            />
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" color="text.secondary">
                If you enable this option, the names from the import file will
                be used to check if the same entity already exists in the
                system. If it exists, the address from the import will be mapped
                to their record. If it does not exist, a new record will be
                created using the corresponding address from the import file.
              </Typography>
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#f9f9f9",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LightbulbOutlinedIcon sx={{ color: "#f9a825", mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Page Tips
              </Typography>
            </Box>

            <Box component="ul" sx={{ pl: 2, mb: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Import data with the details of Tax Treatment by referring these{" "}
                <Link href="#" underline="hover">
                  accepted formats
                </Link>
                .
              </Typography>

              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                You can download the{" "}
                <Link href="#" underline="hover">
                  sample file
                </Link>{" "}
                to get detailed information about the data fields used while
                importing.
              </Typography>

              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                If you have files in other formats, you can convert it to an
                accepted file format using any online/offline converter.
              </Typography>

              <Typography component="li" variant="body2">
                You can configure your import settings and save them for future
                too!
              </Typography>
            </Box>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ textTransform: "none" }}
              onClick={handleNextClick}
              disabled={loading || !uploadedFile}
            >
              {loading ? "Processing..." : "Next"}
            </Button>

            {/* Development/Debug button - display only in development */}
            {process.env.NODE_ENV === "development" && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSkipToNext}
                sx={{ ml: 2, mr: "auto", textTransform: "none" }}
              >
                Dev: Skip to Next
              </Button>
            )}

            <Button
              variant="text"
              color="inherit"
              sx={{ textTransform: "none" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ImportConfigureStep;
