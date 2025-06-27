"use client";
import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import Invoice from "../../../items/Items";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const BillDetails = ({ formik, files, setFiles }) => {
  const { showMessage } = useSnackbar();
  const router = useRouter();
  // Handle file uploads
  const [previewFile, setPreviewFile] = useState(null); // For file preview

  // Handle file uploads
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showMessage(`"${selectedFile.name}" exceeds the 10MB limit.`, "error");
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      showMessage(
        `"${selectedFile.name}" is not a valid file type. Allowed types: PDF, JPEG, PNG.`,
        "error"
      );
      return;
    }

    // Set preview for images
    if (selectedFile.type.startsWith("image/")) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewFile(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      setPreviewFile(null); // No preview for non-image files
    }

    // Set the selected file
    setFiles([selectedFile]); // Replace any previous files
    formik.setFieldValue("documents", selectedFile); // Update Formik field
  };

  // Remove selected file
  const removeFile = () => {
    setFiles([]);
    setPreviewFile(null);
    formik.setFieldValue("documents", null);
  };

  // Custom functions to handle form submission
  const handleSaveAsDraft = () => {
    // Set the status and submit the form
    formik.setFieldValue("status", 1);
    formik.setFieldValue("status_type", "DRAFT");

    // Submit after a short delay to ensure values are set
    setTimeout(() => {
      console.log("Submitting form as draft with values:", formik.values);
      formik.handleSubmit();
    }, 100);
  };

  const handleSaveAsOpen = () => {
    // Set the status and submit the form
    formik.setFieldValue("status", 0);
    formik.setFieldValue("status_type", "OPEN");
    // Submit after a short delay to ensure values are set
    setTimeout(() => {
      console.log("Submitting form as open with values:", formik.values);
      formik.handleSubmit();
    }, 100);
  };

  return (
    <Paper elevation={0}>
      {/* Invoice component - passing formik directly */}
      <Box sx={{ width: "80%" }}>
        <Invoice formik={formik} />
      </Box>

      {/* File Upload Section */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          backgroundColor: "#f9f9fb",
          mb: 3,
          borderTop: "2px solid #ebebeb",
          borderBottom: "2px solid #ebebeb",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 1.5,
            ml: 0.2,
            alignItems: "center",
            gap: 2.5,
            px: 5,
          }}
        >
          {/* Notes */}

          <Box sx={{ width: "50%", ml: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "black", pl: 0.5 }}>
              Notes
            </Typography>
            <textarea
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              style={{
                width: "100%",
                minHeight: "60px",
                maxHeight: "150px",
                padding: "8px 12px",
                border: "1px solid #c4c4c4",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", pl: 0.5 }}
            >
              It will not be shown in PDF
            </Typography>
          </Box>

          {/* Vertical Divider */}

          <Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: "rgba(78, 78, 78, 0.14)",
                height: "140px",
                mt: 1,
              }}
            />
          </Box>

          {/* File Upload */}
          <Box sx={{ width: "40%" }}>
            <Box>
              <Typography variant="body1" gutterBottom>
                Attach File(s) to Quote
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  padding: "8px", // Add padding for better spacing
                  borderRadius: "8px",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<FileUploadOutlinedIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                  component="label"
                  size="small"
                >
                  Upload File
                  <input
                    type="file"
                    name="documents"
                    hidden
                    // ref={formik.values.documents}
                    accept=".pdf, .jpeg, .jpg, .png" // Allowed file types
                    onChange={handleFileUpload}
                  />
                </Button>
                {/* <IconButton size="small">
                  <KeyboardArrowDownIcon />
                </IconButton> */}
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block" }}
              >
                You can upload a maximum of 5 files, 10MB each
              </Typography>

              {/* List of uploaded files */}
              {files.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Selected File:
                  </Typography>

                  {/* Display file preview if it's an image */}
                  {previewFile && (
                    <Box sx={{ mb: 1 }}>
                      <img
                        src={previewFile}
                        alt="Preview"
                        style={{
                          width: "150px",
                          height: "auto",
                          marginBottom: "8px",
                        }}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      // padding: "8px", // Add padding for better spacing
                      // borderRadius: "8px",
                    }}
                  >
                    <Typography variant="body2">{files[0].name}</Typography>
                    <IconButton
                      size="small"
                      onClick={removeFile}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Additional Fields */}
      <Box sx={{ mb: 15, px: 3.5 }}>
        <Typography variant="body2" sx={{ color: "#666", fontSize: "14px" }}>
          <Box component="span" sx={{ fontWeight: 500, color: "black" }}>
            Additional Fields:
          </Box>
          {" Start adding custom fields for your payments made by going to "}
          <Box component="span" sx={{ fontWeight: 500 }}>
            Settings
          </Box>
          <ArrowForwardIcon
            size={14}
            style={{ margin: "0 4px", verticalAlign: "middle" }}
          />
          <Box component="span" sx={{ fontWeight: 500 }}>
            Purchases
          </Box>
          <ArrowForwardIcon
            size={14}
            style={{ margin: "0 4px", verticalAlign: "middle" }}
          />
          <Box component="span" sx={{ fontWeight: 500 }}>
            Bills
          </Box>
          .
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        <Button
          variant="outlined"
          // sx={{
          //   textTransform: "none",
          //   borderColor: "#ddd",
          //   color: "#333",
          //   borderRadius: "5px",
          //   px: 2,
          //   py: 0.75,
          //   fontWeight: 400,
          //   fontSize: "14px",
          //   "&:hover": {
          //     borderColor: "#bbb",
          //     backgroundColor: "#f8f8f8",
          //   },
          // }}
          type="button"
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          // sx={{
          //   textTransform: "none",
          //   backgroundColor: "#408dfb",
          //   color: "white",
          //   borderRadius: "5px",
          //   px: 2,
          //   py: 0.75,
          //   fontWeight: 400,
          //   fontSize: "14px",
          //   boxShadow: "none",
          //   "&:hover": {
          //     backgroundColor: "#1565c0",
          //     boxShadow: "none",
          //   },
          // }}
          color="primary"
          type="button"
          onClick={handleSaveAsOpen}
        >
          Save as Open
        </Button>

        <Link
          href="/purchase/bills"
          passHref
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/purchase/bills")}
            // sx={{
            //   textTransform: "none",
            //   borderColor: "#ddd",
            //   color: "#333",
            //   borderRadius: "5px",
            //   px: 2,
            //   py: 0.75,
            //   fontWeight: 400,
            //   fontSize: "14px",
            //   "&:hover": {
            //     borderColor: "#bbb",
            //     backgroundColor: "#f8f8f8",
            //   },
            // }}
          >
            Cancel
          </Button>
        </Link>
      </Paper>
    </Paper>
  );
};

export default BillDetails;
