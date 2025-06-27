// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Dialog,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Popover,
//   ClickAwayListener,
//   Grow,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import SettingsIcon from "@mui/icons-material/Settings";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function TaxInformationManager({
//   anchorEl,
//   open,
//   onClose,
//   customerData,
//   onUpdate,
// }) {
//   const [popperOpen, setPopperOpen] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [taxInfos, setTaxInfos] = useState([]);
//   const [formData, setFormData] = useState({
//     gstin: "",
//     placeOfSupply: "",
//     businessLegalName: "",
//     businessTradeName: "",
//   });
//   const anchorRef = useRef(null);

//   // Load data from localStorage on component mount
//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem("taxInfos"));
//     if (storedData) {
//       setTaxInfos(storedData);
//     }
//   }, []);

//   // Toggle Popper Open/Close
//   const handlePopperToggle = () => {
//     setPopperOpen((prevOpen) => !prevOpen);
//   };

//   // Close Popper when clicking outside
//   const handlePopperClose = (event) => {
//     if (anchorRef.current && anchorRef.current.contains(event.target)) {
//       return;
//     }
//     setPopperOpen(false);
//   };

//   // Handle Dialog Open/Close
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setIsAdding(false);
//   };

//   // Add New Tax Information
//   const handleAddNew = () => {
//     setIsAdding(true);
//   };

//   // Cancel Adding New Tax Information
//   const handleCancel = () => {
//     setIsAdding(false);
//     setFormData({
//       gstin: "",
//       placeOfSupply: "",
//       businessLegalName: "",
//       businessTradeName: "",
//     });
//   };

//   // Save and Select New Tax Information
//   const handleSaveAndSelect = () => {
//     // Prevent empty data from being saved
//     if (
//       formData.gstin.trim() === "" ||
//       formData.placeOfSupply.trim() === "" ||
//       formData.businessLegalName.trim() === "" ||
//       formData.businessTradeName.trim() === ""
//     ) {
//       alert("Please fill in all fields before saving.");
//       return;
//     }

//     const updatedTaxInfos = [...taxInfos, formData];
//     setTaxInfos(updatedTaxInfos);

//     // Save to localStorage
//     localStorage.setItem("taxInfos", JSON.stringify(updatedTaxInfos));

//     // Reset form and state
//     setIsAdding(false);
//     setFormData({
//       gstin: "",
//       placeOfSupply: "",
//       businessLegalName: "",
//       businessTradeName: "",
//     });
//   };

//   // Handle Form Field Changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Delete a row from the table
//   const handleDelete = (index) => {
//     const updatedTaxInfos = taxInfos.filter((_, i) => i !== index);
//     setTaxInfos(updatedTaxInfos);
//     localStorage.setItem("taxInfos", JSON.stringify(updatedTaxInfos)); // Update localStorage
//   };

//   return (
//     <Popover
//       open={open}
//       anchorEl={anchorEl}
//       onClose={onClose}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "left",
//       }}
//       transformOrigin={{
//         vertical: "top",
//         horizontal: "left",
//       }}
//     >
//       <Box
//         sx={{
//           padding: "16px",
//           width: "250px",
//           maxHeight: "300px",
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           backgroundColor: "#ffffff",
//         }}
//       >
//         {/* Scrollable Content Section */}
//         <Box
//           sx={{
//             flex: 1,
//             maxHeight: "250px",
//             overflowY: "auto",
//             scrollbarWidth: "thin",
//             "&::-webkit-scrollbar": {
//               width: "6px",
//             },
//             "&::-webkit-scrollbar-thumb": {
//               backgroundColor: "#bdc3c7",
//               borderRadius: "4px",
//             },
//           }}
//         >
//           {taxInfos.length > 0 ? (
//             taxInfos.map((info, index) => (
//               <Box key={index} sx={{ mb: 1 }}>
//                 <Typography sx={{ color: "#333", fontWeight: 500 }}>
//                   {info.gstin} - {info.placeOfSupply}
//                 </Typography>
//               </Box>
//             ))
//           ) : (
//             <Typography sx={{ color: "#888", fontSize: "14px" }}>
//               No Tax Information had been added
//             </Typography>
//           )}
//         </Box>

//         {/* Footer Section */}
//         <Box
//           sx={{
//             mt: 2,
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               color: "#3498db",
//               cursor: "pointer",
//             }}
//             onClick={handlePopperToggle}
//             ref={anchorRef}
//           >
//             <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
//               Manage Tax Informations
//             </Typography>
//             <SettingsIcon sx={{ ml: 1, fontSize: "20px" }} />
//           </Box>
//         </Box>
//       </Box>
//     </Popover>

//   );
// }
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Popover,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TaxInformationManager({
  anchorEl,
  open,
  onClose,
  customerData,
  onUpdate,
}) {
  const [popperOpen, setPopperOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Controls the Add New Tax Information Dialog
  const [taxInfos, setTaxInfos] = useState([]);
  const [formData, setFormData] = useState({
    gstin: "",
    placeOfSupply: "",
    businessLegalName: "",
    businessTradeName: "",
  });
  const anchorRef = useRef(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("taxInfos"));
    if (storedData) {
      setTaxInfos(storedData);
    }
  }, []);

  // Toggle Popper Open/Close
  const handlePopperToggle = () => {
    setPopperOpen((prevOpen) => !prevOpen);
  };

  // Close Popper when clicking outside
  const handlePopperClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setPopperOpen(false);
  };

  // Handle Dialog Open/Close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsAdding(false);
  };

  // Add New Tax Information
  const handleAddNew = () => {
    setIsAdding(true); // Open the Add New Tax Information Dialog
  };

  // Cancel Adding New Tax Information
  const handleCancel = () => {
    setIsAdding(false);
    setFormData({
      gstin: "",
      placeOfSupply: "",
      businessLegalName: "",
      businessTradeName: "",
    });
  };

  // Save and Select New Tax Information
  const handleSaveAndSelect = () => {
    // Prevent empty data from being saved
    if (
      formData.gstin.trim() === "" ||
      formData.placeOfSupply.trim() === "" ||
      formData.businessLegalName.trim() === "" ||
      formData.businessTradeName.trim() === ""
    ) {
      alert("Please fill in all fields before saving.");
      return;
    }

    const updatedTaxInfos = [...taxInfos, formData];
    setTaxInfos(updatedTaxInfos);

    // Save to localStorage
    localStorage.setItem("taxInfos", JSON.stringify(updatedTaxInfos));

    // Reset form and state
    setIsAdding(false);
    setFormData({
      gstin: "",
      placeOfSupply: "",
      businessLegalName: "",
      businessTradeName: "",
    });
  };

  // Handle Form Field Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Delete a row from the table
  const handleDelete = (index) => {
    const updatedTaxInfos = taxInfos.filter((_, i) => i !== index);
    setTaxInfos(updatedTaxInfos);
    localStorage.setItem("taxInfos", JSON.stringify(updatedTaxInfos)); // Update localStorage
  };

  return (
    <>
      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            padding: "16px",
            width: "250px",
            maxHeight: "300px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Scrollable Content Section */}
          <Box
            sx={{
              flex: 1,
              maxHeight: "250px",
              overflowY: "auto",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdc3c7",
                borderRadius: "4px",
              },
            }}
          >
            {taxInfos.length > 0 ? (
              taxInfos.map((info, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography sx={{ color: "#333", fontWeight: 500 }}>
                    {info.gstin} - {info.placeOfSupply}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "#888", fontSize: "14px" }}>
                No Tax Information had been added
              </Typography>
            )}
          </Box>

          {/* Footer Section */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#3498db",
                cursor: "pointer",
              }}
              onClick={handlePopperToggle}
              ref={anchorRef}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                Manage Tax Informations
              </Typography>
              <SettingsIcon sx={{ ml: 1, fontSize: "20px" }} />
            </Box>
          </Box>
        </Box>
      </Popover>

      {/* Popper */}
      <Dialog
        open={popperOpen} // Use the same state as Popper's open state
        onClose={() => setPopperOpen(false)} // Close the dialog when needed
        maxWidth="md" // Control the width of the dialog
        fullWidth // Make the dialog span the full width
      >
        <Box>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#333",
                fontWeight: 500,
                fontSize: "18px",
              }}
            >
              Manage Tax Informations
            </Typography>
            <IconButton
              onClick={() => setPopperOpen(false)} // Close the dialog
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 2 }}>
            {/* Add New Tax Information Button */}
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3498db",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#2980b9",
                },
              }}
              onClick={handleAddNew} // Open the Add New Tax Information Dialog
            >
              Add New Tax Information
            </Button>

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: "none" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "14px",
                        p: 1.5,
                      }}
                    >
                      GSTIN
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "14px",
                        p: 1.5,
                      }}
                    >
                      PLACE OF SUPPLY
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "14px",
                        p: 1.5,
                      }}
                    >
                      BUSINESS LEGAL NAME
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "14px",
                        p: 1.5,
                      }}
                    >
                      BUSINESS TRADE NAME
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 500,
                        fontSize: "14px",
                        p: 1.5,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxInfos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ p: 6 }}>
                        <Typography sx={{ color: "#888", fontSize: "14px" }}>
                          No Tax Information had been added
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    taxInfos.map((info, index) => (
                      <TableRow key={index}>
                        <TableCell>{info.gstin}</TableCell>
                        <TableCell>{info.placeOfSupply}</TableCell>
                        <TableCell>{info.businessLegalName}</TableCell>
                        <TableCell>{info.businessTradeName}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            sx={{ color: "#3498db" }}
                            onClick={() =>
                              alert("Edit functionality not implemented yet.")
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#e74c3c" }}
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Dialog>

      {/* Add New Tax Information Dialog */}
      <Dialog open={isAdding} onClose={handleCancel} maxWidth="md" fullWidth>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#333",
              fontWeight: 500,
              fontSize: "18px",
            }}
          >
            Add New Tax Information
          </Typography>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "#f9f9f9",
              borderRadius: "4px",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ width: "32%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    sx={{ color: "#e74c3c", fontWeight: 500, fontSize: "14px" }}
                  >
                    GSTIN / UIN*
                  </Typography>
                  <InfoOutlinedIcon
                    sx={{ ml: 0.5, fontSize: "16px", color: "#999" }}
                  />
                </Box>
                <TextField
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "#fff" }}
                />
                <Typography
                  sx={{
                    color: "#3498db",
                    fontSize: "12px",
                    mt: 0.5,
                    cursor: "pointer",
                  }}
                >
                  Validate
                </Typography>
              </Box>
              <Box sx={{ width: "32%" }}>
                <Typography
                  sx={{
                    color: "#e74c3c",
                    fontWeight: 500,
                    fontSize: "14px",
                    mb: 1,
                  }}
                >
                  Place of Supply*
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="placeOfSupply"
                    value={formData.placeOfSupply}
                    onChange={handleChange}
                    sx={{ bgcolor: "#fff" }}
                    IconComponent={KeyboardArrowDownIcon}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                    <MenuItem value="Karnataka">Karnataka</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: "32%" }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "14px",
                    mb: 1,
                  }}
                >
                  Business Legal Name
                </Typography>
                <TextField
                  name="businessLegalName"
                  value={formData.businessLegalName}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "#fff" }}
                />
              </Box>
              <Box sx={{ width: "32%" }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "14px",
                    mb: 1,
                  }}
                >
                  Business Trade Name
                </Typography>
                <TextField
                  name="businessTradeName"
                  value={formData.businessTradeName}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "#fff" }}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#3498db",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#2980b9",
                  },
                }}
                onClick={handleSaveAndSelect}
              >
                Save and Select
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#ddd",
                  color: "#333",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#ccc",
                    bgcolor: "#f5f5f5",
                  },
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Paper>

          {/* Table below form */}
          <TableContainer component={Paper} sx={{ mt: 3, boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#666",
                      fontWeight: 500,
                      fontSize: "14px",
                      p: 1.5,
                    }}
                  >
                    GSTIN
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#666",
                      fontWeight: 500,
                      fontSize: "14px",
                      p: 1.5,
                    }}
                  >
                    PLACE OF SUPPLY
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#666",
                      fontWeight: 500,
                      fontSize: "14px",
                      p: 1.5,
                    }}
                  >
                    BUSINESS LEGAL NAME
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#666",
                      fontWeight: 500,
                      fontSize: "14px",
                      p: 1.5,
                    }}
                  >
                    BUSINESS TRADE NAME
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#666",
                      fontWeight: 500,
                      fontSize: "14px",
                      p: 1.5,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxInfos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ p: 6 }}>
                      <Typography sx={{ color: "#888", fontSize: "14px" }}>
                        No Tax Information had been added
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  taxInfos.map((info, index) => (
                    <TableRow key={index}>
                      <TableCell>{info.gstin}</TableCell>
                      <TableCell>{info.placeOfSupply}</TableCell>
                      <TableCell>{info.businessLegalName}</TableCell>
                      <TableCell>{info.businessTradeName}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          sx={{ color: "#3498db" }}
                          onClick={() =>
                            alert("Edit functionality not implemented yet.")
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#e74c3c" }}
                          onClick={() => handleDelete(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>
    </>
  );
}
