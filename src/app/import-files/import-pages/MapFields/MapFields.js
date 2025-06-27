'use client'
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";

const MapFields = ({ headers = [], setMappings }) => {
  const searchParams = useSearchParams();
  const fileType = searchParams.get("type");
  const orgID = searchParams.get("organization_id");
  const [dbColumns, setDbColumns] = useState([]);
  useEffect(() => {
    // console.log(fileType, orgID, "orgID");
    getDatabaseColumns(fileType);
  }, [fileType, orgID]);

  const getDatabaseColumns = async (FILE_TYPE) => {
    console.log(FILE_TYPE, "FILE_TYPE");
    try {
      let baseURL = config.PO_Base_url;
      if (FILE_TYPE === "customers") {
        baseURL = config.apiBaseUrl;
      } else if (FILE_TYPE === "quote") {
        baseURL = config.SO_Base_url;
      }
      let params = {
        url: `api/v1/import/get-column?moduleName=${FILE_TYPE}`,
        method: "GET",
        customBaseUrl: baseURL,
      };
      let resposne = await apiService(params);
      console.log("resposne----config", resposne);
      if (resposne.statusCode == 200) {
        genarateTheColumns(resposne.data.data);
      }
    } catch (error) {
      console.log("getDatabaseColumns error", error);
    }
  };
  const genarateTheColumns = (data) => {
    try {
      let dbColumnsFormating = data.map((field) => {
        // Convert snake_case or camelCase to readable label
        const label = field
          .replace(/_/g, " ") // snake_case to space
          .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to space
          .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words

        // Custom replacements for Mongo fields
        const formattedLabel =
          field === "_id" ? "Id" : field === "__v" ? "Version" : label;

        return {
          id: field,
          label: formattedLabel,
          required: false, // change to true for specific fields if needed
        };
      });
      setDbColumns(dbColumnsFormating);
      // console.log(dbColumns, "-------DB columns");
    } catch (error) {
      console.log(error, "Something went wrong...");
    }
  };
  // State to store the mappings
  const [columnMappings, setColumnMappings] = useState({});
  const [missingRequiredFields, setMissingRequiredFields] = useState([]);

  // Initialize mappings with empty values
  useEffect(() => {
    const initialMappings = {};
    dbColumns.forEach((column) => {
      initialMappings[column.id] = "";
    });
    setColumnMappings(initialMappings);
  }, []);

  // Function to handle mapping change
  const handleMappingChange = (dbColumnId, fileColumnValue) => {
    setColumnMappings((prev) => ({
      ...prev,
      [dbColumnId]: fileColumnValue,
    }));
  };

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[_\s\-]+/g, "") // remove underscores, dashes, spaces
      .trim();

  const autoMapColumns = () => {
    const newMappings = { ...columnMappings };

    dbColumns.forEach((dbColumn) => {
      const dbLabelNormalized = normalize(dbColumn.label);

      // Try exact match
      let match = headers.find(
        (header) => normalize(header) === dbLabelNormalized
      );

      // Try partial match
      if (!match) {
        match = headers.find((header) =>
          normalize(header).includes(dbLabelNormalized)
        );
      }

      // Try reverse partial match
      if (!match) {
        match = headers.find((header) =>
          dbLabelNormalized.includes(normalize(header))
        );
      }

      // If a match is found, map it
      if (match) {
        newMappings[dbColumn.id] = match;
      }
    });

    setColumnMappings(newMappings);
  };

  // Validate required fields
  useEffect(() => {
    const missing = dbColumns
      .filter((col) => col.required && !columnMappings[col.id])
      .map((col) => col.label);

    setMissingRequiredFields(missing);

    // Update parent component with mappings
    if (setMappings) {
      setMappings(columnMappings);
    }
  }, [columnMappings]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Map Fields</Typography>
        <Button
          variant="outlined"
          startIcon={<SwapHorizIcon />}
          onClick={autoMapColumns}
        >
          Auto-map Fields
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Match your file columns with our system fields. Required fields are
        marked with an asterisk (*).
      </Typography>

      {missingRequiredFields.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          The following required fields are not mapped:{" "}
          {missingRequiredFields.join(", ")}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={5}>
            <Typography variant="subtitle2" fontWeight="bold">
              Database Field
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="subtitle2" fontWeight="bold">
              File Column
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {dbColumns.map((column) => (
          <Grid
            container
            spacing={2}
            key={column.id}
            sx={{ mb: 2 }}
            alignItems="center"
          >
            <Grid item xs={5}>
              <Box display="flex" alignItems="center">
                <Typography>
                  {column.label}{" "}
                  {column.required && <span style={{ color: "red" }}>*</span>}
                </Typography>
                {column.required && (
                  <Tooltip title="This field is required for import">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" color="info" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
            <Grid item xs={7}>
              <FormControl fullWidth size="small">
                <InputLabel>Select File Column</InputLabel>
                <Select
                  value={columnMappings[column.id] || ""}
                  onChange={(e) =>
                    handleMappingChange(column.id, e.target.value)
                  }
                  label="Select File Column"
                  error={column.required && !columnMappings[column.id]}
                >
                  <MenuItem value="">
                    <em>-- Do not import --</em>
                  </MenuItem>
                  {headers.map((header, index) => (
                    <MenuItem key={index} value={header}>
                      {header}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        ))}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
        <Typography variant="body2">
          <b>💡 Tips</b>
        </Typography>
        <Typography variant="body2" gutterBottom>
          • Click &quot;Auto-map Fields&quot; to automatically match similar
          columns
          <br />
          • Required fields must be mapped to proceed
          <br />• You can leave optional fields unmapped if your file
          doesn&apos;t contain them
        </Typography>
      </Paper>
    </Box>
  );
};

export default MapFields;
