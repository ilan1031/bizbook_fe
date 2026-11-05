"use client";

import React, { useState } from "react";
import { ListItemButton,
  Box,
  TextField,
  Avatar,
  Typography,
  Paper,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";

const SearchComponent = (_props?: any) => {
  const [searchValue, setSearchValue] = useState<any>("");
  const [activeIndex, setActiveIndex] = useState<any>(null); // Declare state

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 550,
        margin: "0 auto",
        padding: 2,
        backgroundColor: "ffffff",
        boxShadow: 3,
        borderRadius: 2,
        position: "relative" as const,
        display: "flex" as const,
        flexDirection: "column" as const,
      }}
    >
      {/* Sticky Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          mb: 1,
          backgroundColor: "#fff",
          borderRadius: 2,
          position: "sticky" as const,
          top: 0,
          zIndex: 10,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue((e.target as any).value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 1.5,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          overflow: "hidden" as const,
          display: "flex" as const,
          flexDirection: "column" as const,
        }}
      >
        {/* Scrollable list area - with height constraint */}
        <Box sx={{ overflowY: "auto" as const, maxHeight: "300px" }}>
  <List sx={{ width: "100%", padding: 0 }}>
    {[
      { name: "Abielan", email: "noreply@abielan.in", avatar: "A" },
      { name: "Sample User", email: "", avatar: "A" },
    ].map((user, index) => (
      <ListItem
        key={index}
        alignItems="center"
        onClick={() => setActiveIndex(index)} // Set active index
        sx={{
          py: 1.5,
          px: 2,
          transition: "background-color 0.3s ease",
          bgcolor: activeIndex === index ? "#f0f0f0" : "transparent", // Light grey when selected
          "&:hover": { bgcolor: "#1976d2", color: "white" }, // Blue on hover
          cursor: "pointer" as const,
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "white", color: "#1976d2", width: 40, height: 40 }}>
            {user.avatar}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1">{user.name}</Typography>
          {user.email && (
            <Box sx={{ display: "flex" as const, alignItems: "center" as const, mt: 0.5 }}>
              <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">{user.email}</Typography>
            </Box>
          )}
        </Box>
      </ListItem>
    ))}
  </List>
</Box>

        {/* Sticky New Customer button with hover effect */}
        <ListItemButton onClick={() => window.open("/sales/customer/create", "_blank")}
          alignItems="center"
          sx={{
            py: 1.5,
            px: 2,
            position: "sticky" as const,
            bottom: 0,
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "#fff",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            zIndex: 10,
          }}
        >
          <IconButton
            size="small"
            sx={{
              mr: 2,
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              transition: "background-color 0.3s ease",
              "&:hover": {
                bgcolor: "#bbdefb",
              },
            }}
          >
            <AddCircleOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography variant="body1" color="primary">
            New Customer
          </Typography>
        </ListItemButton>
      </Paper>
    </Box>
  );
};

export default SearchComponent;
// "use client";
// import React, { useState } from 'react';
// import { 
//   Box, 
//   TextField, 
//   Typography, 
//   Button, 
//   InputAdornment, 
//   Paper, 
//   List,
//   ListItemText
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

// const ProjectSelector = (_props?: any) => {
//   const [searchValue, setSearchValue] = useState<any>('');
//   const [projects] = useState<any>([]); // Keeping projects array

//   const handleSearchChange = (event) => {
//     setSearchValue((event.target as any).value);
//   };

//   const handleAddNew = () => {
//     console.log('Add new project');
//     // Implement add new project functionality
//   };

//   return (
//     <Box sx={{ position: 'relative' as const, width: '100%', maxWidth: 340 }}>
//       <Paper
//         elevation={3}
//         sx={{
//           borderRadius: '16px',
//           boxShadow: '3',
//           overflow: 'hidden' as const,
//         }}
//       >
//         {/* Search Input */}
//         <Box sx={{ padding: '8px' }}>
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
//                   <SearchIcon sx={{ color: '#757575', fontSize: 20 }} />
//                 </InputAdornment>
//               ),
//               sx: {
//                 borderRadius: '4px',
//                 fontSize: '14px',
//               }
//             }}
//           />
//         </Box>

//         {/* Results Area */}
//         <Box
//           sx={{
//             maxHeight: '200px',
//             overflowY: 'auto' as const,
//             padding: '8px 16px',
//             borderTop: '1px solid #f0f0f0',
//           }}
//         >
//           {projects.length === 0 ? (
//             <Typography
//               sx={{
//                 color: '#757575',
//                 padding: '3px 0',
//                 textAlign: 'center' as const,
//                 fontSize: '14px'
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
//             borderTop: '1px solid #f0f0f0',
//             padding: '3px',
//           }}
//         >
//           <Button
//             startIcon={<AddCircleOutlinedIcon sx={{ color: '#2196f3' }} />}
//             onClick={handleAddNew}
//             sx={{
//               textTransform: 'none' as const,
//               color: '#2196f3',
//               justifyContent: 'flex-start' as const,
//               padding: '8px',
//               width: '100%',
//               '&:hover': {
//                 backgroundColor: 'rgba(33, 150, 243, 0.04)',
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
