// // "use client";
// // import React, { useState } from 'react';
// // import { 
// //   Box, 
// //   TextField, 
// //   Typography, 
// //   Button, 
// //   InputAdornment, 
// //   Paper, 
// //   List,
// //   ListItemText
// // } from '@mui/material';
// // import SearchIcon from '@mui/icons-material/Search';
// // import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
// // import ProjectCreation from"../projectcreation/page";
// // const ProjectSelector = () => {
// //   const [searchValue, setSearchValue] = useState('');
// //   const [projects] = useState([]); // Keeping projects array

// //   const handleSearchChange = (event) => {
// //     setSearchValue(event.target.value);
// //   };

// //   const handleAddNew = () => {
// //     console.log('Add new project');
// //     // Implement add new project functionality
// //   };

// //   return (
// //     <Box sx={{ position: 'relative', width: '100%', maxWidth: 340 }}>
// //       <Paper
// //         elevation={3}
// //         sx={{
// //           borderRadius: '16px',
// //           boxShadow: '3',
// //           overflow: 'hidden',
// //         }}
// //       >
// //         {/* Search Input */}
// //         <Box sx={{ padding: '8px' }}>
// //           <TextField
// //             fullWidth
// //             size="small"
// //             placeholder="Search"
// //             value={searchValue}
// //             onChange={handleSearchChange}
// //             variant="outlined"
// //             InputProps={{
// //               startAdornment: (
// //                 <InputAdornment position="start">
// //                   <SearchIcon sx={{ color: '#757575', fontSize: 20 }} />
// //                 </InputAdornment>
// //               ),
// //               sx: {
// //                 borderRadius: '4px',
// //                 fontSize: '14px',
// //               }
// //             }}
// //           />
// //         </Box>

// //         {/* Results Area */}
// //         <Box
// //           sx={{
// //             maxHeight: '200px',
// //             overflowY: 'auto',
// //             padding: '8px 16px',
// //             borderTop: '1px solid #f0f0f0',
// //           }}
// //         >
// //           {projects.length === 0 ? (
// //             <Typography
// //               sx={{
// //                 color: '#757575',
// //                 padding: '3px 0',
// //                 textAlign: 'center',
// //                 fontSize: '14px'
// //               }}
// //             >
// //               NO RESULTS FOUND
// //             </Typography>
// //           ) : (
// //             <List dense disablePadding>
// //               {projects.map((project) => (
// //                 <ListItemText key={project.id} primary={project.name} />
// //               ))}
// //             </List>
// //           )}
// //         </Box>

// //         {/* Add New Button */}
// //         <Box
// //           sx={{
// //             borderTop: '1px solid #f0f0f0',
// //             padding: '3px',
// //           }}
// //         >
// //           <Button
// //             startIcon={<AddCircleOutlinedIcon sx={{ color: '#2196f3' }} />}
// //             onClick={handleAddNew}
// //             sx={{
// //               textTransform: 'none',
// //               color: '#2196f3',
// //               justifyContent: 'flex-start',
// //               padding: '8px',
// //               width: '100%',
// //               '&:hover': {
// //                 backgroundColor: 'rgba(33, 150, 243, 0.04)',
// //               },
// //             }}
// //           >
// //             Add New
// //           </Button>
// //         </Box>
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default ProjectSelector;
// "use client";
// import React from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   Button,
//   InputAdornment,
//   Paper,
//   List,
//   ListItemText,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
// import { useRouter } from "next/navigation"; // Import useRouter for navigation

// const ProjectSelector = () => {
//   const [searchValue, setSearchValue] = React.useState("");
//   const [projects] = React.useState([]); // Keeping projects array
//   const router = useRouter(); // Initialize useRouter

//   // Handle search input change
//   const handleSearchChange = (event) => {
//     setSearchValue(event.target.value);
//   };

//   // Handle "Add New" button click
//   const handleAddNew = () => {
//     router.push("/common/projectcreation"); // Navigate to the /projectcreation route
//   };

//   return (
//     <Box sx={{ position: "relative", width: "100%", maxWidth: 340 }}>
//       <Paper
//         elevation={3}
//         sx={{
//           borderRadius: "16px",
//           boxShadow: "3",
//           overflow: "hidden",
//         }}
//       >
//         {/* Search Input */}
//         <Box sx={{ padding: "8px" }}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search"
//             value={searchValue}
//             onChange={handleSearchChange}
//             variant="outlined"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: "#757575", fontSize: 20 }} />
//                 </InputAdornment>
//               ),
//               sx: {
//                 borderRadius: "4px",
//                 fontSize: "14px",
//               },
//             }}
//           />
//         </Box>

//         {/* Results Area */}
//         <Box
//           sx={{
//             maxHeight: "200px",
//             overflowY: "auto",
//             padding: "8px 16px",
//             borderTop: "1px solid #f0f0f0",
//           }}
//         >
//           {projects.length === 0 ? (
//             <Typography
//               sx={{
//                 color: "#757575",
//                 padding: "3px 0",
//                 textAlign: "center",
//                 fontSize: "14px",
//               }}
//             >
//               NO RESULTS FOUND
//             </Typography>
//           ) : (
//             <List dense disablePadding>
//               {projects.map((project) => (
//                 <ListItemText key={project.id} primary={project.name} />
//               ))}
//             </List>
//           )}
//         </Box>

//         {/* Add New Button */}
//         <Box
//           sx={{
//             borderTop: "1px solid #f0f0f0",
//             padding: "3px",
//           }}
//         >
//           <Button
//             startIcon={<AddCircleOutlinedIcon sx={{ color: "#2196f3" }} />}
//             onClick={handleAddNew} // Navigate to /projectcreation
//             sx={{
//               textTransform: "none",
//               color: "#2196f3",
//               justifyContent: "flex-start",
//               padding: "8px",
//               width: "100%",
//               "&:hover": {
//                 backgroundColor: "rgba(33, 150, 243, 0.04)",
//               },
//             }}
//           >
//             Add New
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default ProjectSelector;
"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItemText,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const ProjectSelector = () => {
  const [searchValue, setSearchValue] = useState("");
  const [projects] = useState([]); // Keeping projects array
  const [openNewProject, setOpenNewProject] = useState(false);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Handle "Add New" button click
  const handleAddNew = () => {
    setOpenNewProject(true);
  };

  // Custom styled TextField for reduced size
  const SmallTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      padding: "4px 8px", // Reduced padding
      fontSize: "0.8rem", // Reduced font size
      height: "32px", // Reduced height
    },
  });

  // Custom styled TextField for description with corner stripes
  const DescriptionTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px", // Rounded border
      "& fieldset": {
        borderColor: "#c4c4c4", // Light grey border
      },
      "&:hover fieldset": {
        borderColor: "#a0a0a0", // Slightly darker on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2", // Blue on focus
      },
    },
  });

  return (
    <>
      <Box sx={{ position: "relative", width: "100%", maxWidth: 340 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: "16px",
            boxShadow: "3",
            overflow: "hidden",
          }}
        >
          {/* Search Input */}
          <Box sx={{ padding: "8px" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#757575", fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "4px",
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          {/* Results Area */}
          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              padding: "8px 16px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {projects.length === 0 ? (
              <Typography
                sx={{
                  color: "#757575",
                  padding: "3px 0",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                NO RESULTS FOUND
              </Typography>
            ) : (
              <List dense disablePadding>
                {projects.map((project) => (
                  <ListItemText key={project.id} primary={project.name} />
                ))}
              </List>
            )}
          </Box>

          {/* Add New Button */}
          <Box
            sx={{
              borderTop: "1px solid #f0f0f0",
              padding: "3px",
            }}
          >
            <Button
              startIcon={<AddCircleOutlinedIcon sx={{ color: "#2196f3" }} />}
              onClick={handleAddNew} // Open dialog instead of navigating
              sx={{
                textTransform: "none",
                color: "#2196f3",
                justifyContent: "flex-start",
                padding: "8px",
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.04)",
                },
              }}
            >
              Add New
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* New Project Dialog */}
      <Dialog open={openNewProject} onClose={() => setOpenNewProject(false)} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h7" component="div" sx={{ fontWeight: 400 }}>
            New Project
          </Typography>
          <IconButton onClick={() => setOpenNewProject(false)}>
            <CloseIcon sx={{ color: "red" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Project Details */}
            {/* Project Name */}
            <Box sx={{ display: "flex", alignItems: "center", width: "550px" }}>
              <Box sx={{ width: "200px", display: "flex", alignItems: "center" }}>
                <Typography sx={{ color: "#f44336" }}>Project Name *</Typography>
              </Box>
              <SmallTextField variant="outlined" fullWidth size="small" />
            </Box>
            {/* Project Code */}
            <Box sx={{ display: "flex", alignItems: "center", width: "550px" }}>
              <Box sx={{ width: "200px", display: "flex", alignItems: "center" }}>
                <Typography>Project Code</Typography>
              </Box>
              <SmallTextField variant="outlined" fullWidth size="small" />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "550px",
              }}
            >
              {/* Customer Name */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "200px" }}>
                  <Typography sx={{ color: "#f44336" }}>
                    Customer Name *
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    defaultValue="ABC Electronics"
                    displayEmpty
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton edge="end" size="small">
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="ABC Electronics">ABC Electronics</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {/* Billing Method */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{ width: "200px", display: "flex", alignItems: "center" }}
                >
                  <Typography sx={{ color: "#f44336" }}>
                    Billing Method *
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select defaultValue="Fixed Cost for Project" displayEmpty>
                    <MenuItem value="Fixed Cost for Project">
                      Fixed Cost for Project
                    </MenuItem>
                    <MenuItem value="Hourly Rate">Hourly Rate</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {/* Total Project Cost */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{ width: "146px", display: "flex", alignItems: "center" }}
                >
                  <Typography sx={{ color: "#f44336" }}>
                    Total Project Cost *
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flex: 1 }}>
                  <Box
                    sx={{
                      width: "50px",
                      border: "1px solid #c4c4c4",
                      borderRight: "none",
                      borderRadius: "4px 0 0 4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Typography>INR</Typography>
                  </Box>
                  <SmallTextField variant="outlined" size="small" fullWidth />
                </Box>
              </Box>
              {/* Description */}
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box sx={{ width: "200px", mt: 1 }}>
                  <Typography>Description</Typography>
                </Box>
                <DescriptionTextField
                  variant="outlined"
                  fullWidth
                  placeholder="Max. 2000 characters"
                />
              </Box>
            </Box>

            {/* Budget Section */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 500, mb: 2 }}
              >
                Budget
              </Typography>
              {/* Cost Budget */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  width: "550px",
                }}
              >
                <Box
                  sx={{ width: "150px", display: "flex", alignItems: "center" }}
                >
                  <Typography>Cost Budget</Typography>
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: "#757575",
                      ml: 0.5,
                      width: "16px",
                      height: "16px",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flex: 1 }}>
                  <Box
                    sx={{
                      width: "50px",
                      border: "1px solid #c4c4c4",
                      borderRight: "none",
                      borderRadius: "4px 0 0 4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Typography>INR</Typography>
                  </Box>
                  <SmallTextField variant="outlined" size="small" fullWidth />
                </Box>
              </Box>
              {/* Revenue Budget */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  width: "550px",
                }}
              >
                <Box
                  sx={{ width: "150px", display: "flex", alignItems: "center" }}
                >
                  <Typography>Revenue Budget</Typography>
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: "#757575",
                      ml: 0.5,
                      width: "16px",
                      height: "16px",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flex: 1 }}>
                  <Box
                    sx={{
                      width: "50px",
                      border: "1px solid #c4c4c4",
                      borderRight: "none",
                      borderRadius: "4px 0 0 4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Typography>INR</Typography>
                  </Box>
                  <SmallTextField variant="outlined" size="small" fullWidth />
                </Box>
              </Box>
              <Button
                sx={{
                  color: "#1976d2",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  p: 0,
                  mb: 2,
                }}
              >
                Add budget for project hours
              </Button>
            </Box>

            {/* Users Section */}
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 500, mb: 2 }}
              >
                Users
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, width: "800px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell
                        align="center"
                        sx={{ width: "50px", borderRight: "1px solid #ddd" }}
                      >
                        S.NO
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                        USER
                      </TableCell>
                      <TableCell>EMAIL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{ borderRight: "1px solid #ddd" }}
                      >
                        1
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                        ILANTHALIR S SNISHUB
                      </TableCell>
                      <TableCell>ilan.s.hub@msgroups.com</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                startIcon={<AddCircleRoundedIcon />}
                sx={{
                  color: "#1976d2",
                  backgroundColor: "#f0f0f0", // Light grey background
                  textTransform: "none",
                  fontSize: "0.875rem",
                  p: 1,
                  borderRadius: 1.5,
                  mb: 3,
                  "&:hover": {
                    backgroundColor: "#e0e0e0", // Slightly darker grey on hover
                  },
                }}
              >
                Add User
              </Button>
            </Box>

            <Divider />

            {/* Project Tasks Section */}
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 500, mb: 2 }}
              >
                Project Tasks
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mb: 2,
                  width: "800px",
                  position: "relative",
                }}
              >
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell
                          align="center"
                          sx={{ width: "50px", borderRight: "1px solid #ddd" }}
                        >
                          S.NO
                        </TableCell>
                        <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                          TASK NAME
                        </TableCell>
                        <TableCell>DESCRIPTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ borderRight: "1px solid #ddd" }}
                        >
                          1
                        </TableCell>
                        <TableCell
                          sx={{ color: "#1976d2", borderRight: "1px solid #ddd" }}
                        >
                          Task Name
                        </TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Delete Icon next to the second row description but outside the table */}
                <Box sx={{ position: "absolute", right: -30, top: 45 }}>
                  <IconButton size="small">
                    <DeleteOutlineIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Box>
              <Button
                startIcon={<AddCircleRoundedIcon />}
                sx={{
                  color: "#1976d2",
                  backgroundColor: "#f0f0f0", // Light grey background
                  textTransform: "none",
                  fontSize: "0.875rem",
                  p: 1,
                  borderRadius: 1.5,
                  mb: 3,
                  "&:hover": {
                    backgroundColor: "#e0e0e0", // Slightly darker grey on hover
                  },
                }}
              >
                Add Project Task
              </Button>
            </Box>

            {/* Checkbox */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Checkbox size="small" />
              <Typography variant="body2">
                Add to the watchlist on my dashboard
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #e0e0e0",
            justifyContent: "left",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              px: 2,
            }}
          >
            Save and Select
          </Button>
          <Button
            variant="text"
            onClick={() => setOpenNewProject(false)}
            sx={{
              color: "#000",
              textTransform: "none",
              borderRadius: "4px",
              px: 2,
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectSelector;