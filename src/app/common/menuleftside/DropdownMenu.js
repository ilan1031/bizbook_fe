
"use client";
// import React, { useState } from 'react';
// import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Paper, Divider, Menu, MenuItem } from '@mui/material';
// import { ArrowForwardIos, FileDownloadOutlined, FileUploadOutlined, SettingsOutlined, EditOutlined, PaymentOutlined, RefreshOutlined, WidthNormalOutlined } from '@mui/icons-material';

// const menuItems = [
//   { icon: <FileUploadOutlined />, text: "Import Invoices" },
//   { icon: <FileDownloadOutlined />, text: "Export Invoices" },
//   { icon: <FileDownloadOutlined />, text: "Export Current View" },
//   { divider: true },
//   { icon: <SettingsOutlined />, text: "Preferences" },
//   { icon: <EditOutlined />, text: "Manage Custom Fields" },
//   { icon: <PaymentOutlined />, text: "Configure Online Payments" },
//   { divider: true },
//   { icon: <RefreshOutlined />, text: "Refresh List" },
//   { icon: <WidthNormalOutlined />, text: "Reset Column Width" }
// ];

// const sortOptions = ["Date", "Invoice#", "Order Number", "Customer Name", "Due Date", "Invoice Amount", "Balance", "Created Time", "Last Modified Time"];

// const DropdownMenu = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedSort, setSelectedSort] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = (option) => {
//     setSelectedSort(option);
//     setAnchorEl(null);
//   };

//   return (
//     <Paper elevation={2} sx={{ width: 250, maxHeight: 400, overflowY: 'auto', borderRadius: 1, backgroundColor: 'white', color: 'black' }}>
//       <Box 
//         sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center', 
//           px: 2, 
//           py: 1, 
//           borderBottom: '1px solid #f0f0f0',
//           cursor: 'pointer',
//           '&:hover': { backgroundColor: '#408dfb', color: 'white' } 
//         }}
//         onClick={handleClick}
//       >
//         <Typography variant="body1">Sort by</Typography>
//         <ArrowForwardIos sx={{ fontSize: 16 }} />
//       </Box>
//       <Menu 
//         anchorEl={anchorEl} 
//         open={open} 
//         onClose={() => handleClose(selectedSort)} 
//         anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         {sortOptions.map((option, index) => (
//           <MenuItem 
//             key={index} 
//             onClick={() => handleClose(option)} 
//             sx={{ backgroundColor: selectedSort === option ? '#408dfb' : 'inherit', color: selectedSort === option ? 'white' : 'black', '&:hover': { backgroundColor: '#408dfb', color: 'white' } }}
//           >
//             {option}
//           </MenuItem>
//         ))}
//       </Menu>
//       <List sx={{ py: 0 }}>
//         {menuItems.map((item, index) => 
//           item.divider ? <Divider key={index} /> : (
//             <ListItem 
//               key={index} 
//               button 
//               sx={{ py: 1, '&:hover': { backgroundColor: '#408dfb', color: 'white' } }}
//             >
//               <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14 }} />
//             </ListItem>
//           )
//         )}
//       </List>
//     </Paper>
//   );
// };

// export default DropdownMenu;
import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Paper, Divider, Menu, MenuItem } from '@mui/material';
import { ArrowForwardIos, FileDownloadOutlined, FileUploadOutlined, SettingsOutlined, EditOutlined, PaymentOutlined, RefreshOutlined, WidthNormalOutlined } from '@mui/icons-material';

const menuItems = [
  { icon: <FileUploadOutlined />, text: "Import Invoices" },
  { icon: <FileDownloadOutlined />, text: "Export Invoices" },
  { icon: <FileDownloadOutlined />, text: "Export Current View" },
  { divider: true },
  { icon: <SettingsOutlined />, text: "Preferences" },
  { icon: <EditOutlined />, text: "Manage Custom Fields" },
  { icon: <PaymentOutlined />, text: "Configure Online Payments" },
  { divider: true },
  { icon: <RefreshOutlined />, text: "Refresh List" },
  { icon: <WidthNormalOutlined />, text: "Reset Column Width" }
];

const sortOptions = ["Date", "Invoice#", "Order Number", "Customer Name", "Due Date", "Invoice Amount", "Balance", "Created Time", "Last Modified Time"];

const DropdownMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setSelectedSort(option);
    setAnchorEl(null);
  };

  return (
    <Paper elevation={2} sx={{ width: 250, maxHeight: 400, overflowY: 'auto', borderRadius: 1, backgroundColor: 'white', color: 'black' }}>
      <Box 
        sx={{ 
          display: 'flex',  
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 2, 
          py: 1, 
          borderBottom: '1px solid #f0f0f0',
          cursor: 'pointer',
          backgroundColor: 'white',
          color: 'black',
          '&:hover': { backgroundColor: '#408dfb', color: 'white' } 
        }}
        onClick={handleClick}
      >
        <Typography variant="body1">Sort by</Typography>
        <ArrowForwardIos sx={{ fontSize: 16 }} />
      </Box>
      <Menu 
        anchorEl={anchorEl} 
        open={open} 
        onClose={() => handleClose(selectedSort)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {sortOptions.map((option, index) => (
          <MenuItem 
            key={index} 
            onClick={() => handleClose(option)} 
            sx={{ backgroundColor: selectedSort === option ? '#F0F0F0	' : 'inherit', color: 'black', '&:hover': { backgroundColor: '#408dfb', color: 'white' } }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <List sx={{ py: 0 }}>
        {menuItems.map((item, index) => 
          item.divider ? <Divider key={index} /> : (
            <ListItem 
              key={index} 
              button 
              sx={{ py: 1, '&:hover': { backgroundColor: '#408dfb', color: 'white' } }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItem>
          )
        )}
      </List>
    </Paper>
  );
};

export default DropdownMenu;
