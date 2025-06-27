"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const Configure = ({ selectedFile, setSelectedFile }) => {
  const [fileEncoding, setFileEncoding] = useState("utf-8");
  const [fileDelimiter, setFileDelimiter] = useState(",");
  const [autoGenerate, setAutoGenerate] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      const fileExt = file.name.split(".").pop().toLowerCase();
      if (["csv", "xls", "xlsx"].includes(fileExt)) {
        setSelectedFile(file);
      } else {
        alert("Please upload a CSV or Excel file");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload File
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 4,
          mb: 3,
          textAlign: "center",
          border: "2px dashed #ccc",
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "#2196f3",
          },
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <Box>
            <InsertDriveFileIcon
              sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
            />
            <Typography variant="h6">{selectedFile.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        ) : (
          <Box>
            <UploadFileIcon sx={{ fontSize: 60, color: "#2196f3", mb: 2 }} />
            <Typography variant="h6">Drag & Drop or Select a File</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: CSV, XLS, XLSX
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2 }}
          startIcon={selectedFile ? null : <UploadFileIcon />}
        >
          {selectedFile ? "Replace File" : "Browse Files"}
          <input
            type="file"
            hidden
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
          />
        </Button>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              File Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Character Encoding</InputLabel>
                  <Select
                    value={fileEncoding}
                    onChange={(e) => setFileEncoding(e.target.value)}
                    label="Character Encoding"
                  >
                    <MenuItem value="utf-8">UTF-8 (Unicode)</MenuItem>
                    <MenuItem value="ascii">ASCII</MenuItem>
                    <MenuItem value="iso-8859-1">ISO-8859-1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>File Delimiter</InputLabel>
                  <Select
                    value={fileDelimiter}
                    onChange={(e) => setFileDelimiter(e.target.value)}
                    label="File Delimiter"
                  >
                    <MenuItem value=",">Comma (,)</MenuItem>
                    <MenuItem value=";">Semicolon (;)</MenuItem>
                    <MenuItem value="\t">Tab</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                />
              }
              label="Auto-generate IDs for records"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Import Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" gutterBottom>
              • Ensure your file has a header row with column names
            </Typography>
            <Typography variant="body2" gutterBottom>
              • Files should be under 10MB for optimal performance
            </Typography>
            <Typography variant="body2" gutterBottom>
              • You can save import settings for future use
            </Typography>
            <Typography variant="body2" gutterBottom>
              • For Excel files, only the first sheet will be imported
            </Typography>

            <Alert severity="info" sx={{ mt: 2 }}>
              Need help? View our <strong>Import Guide</strong> for detailed
              instructions.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Configure;
