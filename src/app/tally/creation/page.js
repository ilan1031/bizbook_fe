// // 'use client';

// // import {
// //   Box,
// //   Typography,
// //   Paper,
// //   Dialog,
// //   DialogContent,
// //   TextField,
// //   List,
// //   ListItemButton,
// //   ListItemText,
// //   ListSubheader,
// //   Button,
// //   IconButton
// // } from '@mui/material';
// // import { useRouter } from 'next/navigation'; // Import useRouter for navigation in Next.js
// // import Navbar from "../../components/navbar"; // Import Navbar component
// // import { styled } from '@mui/material/styles';
// // import CloseIcon from '@mui/icons-material/Close';
// // import React, { useState } from 'react';

// // // Styled Dialog
// // const BootstrapDialog = styled(Dialog)(({ theme }) => ({
// //   '& .MuiDialogContent-root': {
// //       padding: theme.spacing(2),
// //   },
// //   '& .MuiDialogActions-root': {
// //       padding: theme.spacing(1),
// //   },
// // }));

// // function BootstrapDialogTitle(props) {
// //   const { children, onClose, ...other } = props;

// //   return (
// //       <Box sx={{ m: 0, p: 2, bgcolor: '#3b71c6', color: 'white', fontWeight: 'bold' }} {...other}>
// //           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
// //               {children}
// //           </Typography>
// //           {onClose ? (
// //               <IconButton
// //                   aria-label="close"
// //                   onClick={onClose}
// //                   sx={{
// //                       position: 'absolute',
// //                       right: 8,
// //                       top: 8,
// //                       color: 'white',
// //                   }}
// //               >
// //                   <CloseIcon />
// //               </IconButton>
// //           ) : null}
// //       </Box>
// //   );
// // }

// // const TallyUi = () => {
// //   const router = useRouter(); // Hook for navigation in Next.js
// //   const [openDialog, setOpenDialog] = useState(false);
// //   const [selectedItem, setSelectedItem] = useState('Group');

// //   // Data structure for the master lists
// //   const mastersData = {
// //       accounting: {
// //           title: 'Accounting Masters',
// //           items: ['Group', 'Ledger', 'Currency', 'Voucher Type']
// //       },
// //       inventory: {
// //           title: 'Inventory Masters',
// //           items: ['Stock Group', 'Stock Category', 'Stock Item', 'Unit', 'Location']
// //       },
// //       payroll: {
// //           title: 'Payroll Masters',
// //           items: ['Employee Group', 'Employee', 'Units (Work)', 'Attendance/Production Type', 'Pay Heads', 'Payroll Voucher Type']
// //       },
// //       statutory: {
// //           title: 'Statutory Masters',
// //           items: ['GST Registration', 'GST Classification']
// //       },
// //       statutoryDetails: {
// //           title: 'Statutory Details',
// //           items: ['Company GST Details', 'PAN/CIN Details']
// //       }
// //   };

// //   const handleOpenDialog = () => {
// //       setOpenDialog(true);
// //   };

// //   const handleCloseDialog = () => {
// //       setOpenDialog(false);
// //   };

// //   const handleItemClick = (item) => {
// //       setSelectedItem(item);
// //       if (item === 'Voucher Type') {
// //           // Navigate to /goto when "Voucher Type" is clicked
// //           router.push('/vouchertype');
// //           handleCloseDialog(); // Close the dialog after navigation

    
// //       }

      
// //   };

  

// //   return (
// //       <>
// //           <Navbar />
// //           <Box sx={{
// //               width: '100%',
// //               height: 'calc(100vh - 64px)', // Adjust based on your navbar height
// //               backgroundColor: '#e6f2ff',
// //               position: 'relative',
// //               display: 'flex',
// //               flexDirection: 'column'
// //           }}>
// //               {/* Top bar with Gateway of Tally text and close button */}
// //               <Box sx={{
// //                   width: '100%',
// //                   height: '30px',
// //                   backgroundColor: '#e6f2ff',
// //                   borderBottom: '1px solid #a0a0a0',
// //                   display: 'flex',
// //                   alignItems: 'center',
// //                   paddingLeft: '8px',
// //                   paddingRight: '8px',
// //                   justifyContent: 'space-between'
// //               }}>
// //                   <Typography sx={{
// //                       fontSize: '14px',
// //                       fontWeight: 'bold',
// //                       color: '#000'
// //                   }}>
// //                       Gateway of Tally
// //                   </Typography>
// //                   <Typography sx={{
// //                       fontSize: '16px',
// //                       fontWeight: 'bold',
// //                       cursor: 'pointer'
// //                   }}>
// //                       ✕
// //                   </Typography>
// //               </Box>
// //               {/* Main content area */}
// //               <Box sx={{
// //                   flex: 1,
// //                   display: 'flex',
// //                   position: 'relative'
// //               }}>
// //                   {/* Left side - Company Info Panel */}
// //                   <Box sx={{
// //                       width: '50%',
// //                       height: '100%',
// //                       backgroundColor: 'white',
// //                       border: '1px solid #ccc',
// //                       borderTop: 'none',
// //                       borderRight: 'none',
// //                       display: 'flex',
// //                       flexDirection: 'column'
// //                   }}>
// //                       {/* Current Period and Date Section */}
// //                       <Box sx={{
// //                           display: 'flex',
// //                           borderBottom: '1px solid #ccc',
// //                           padding: '8px 16px',
// //                           backgroundColor: 'white'
// //                       }}>
// //                           <Box sx={{ flex: 1 }}>
// //                               <Typography sx={{
// //                                   fontSize: '12px',
// //                                   color: '#0066cc',
// //                                   fontWeight: 'bold'
// //                               }}>
// //                                   CURRENT PERIOD
// //                               </Typography>
// //                               <Typography sx={{ fontSize: '14px' }}>
// //                                   1-Apr-24 to 31-Mar-25
// //                               </Typography>
// //                           </Box>
// //                           <Box sx={{ flex: 1, textAlign: 'right' }}>
// //                               <Typography sx={{
// //                                   fontSize: '12px',
// //                                   color: '#0066cc',
// //                                   fontWeight: 'bold'
// //                               }}>
// //                                   CURRENT DATE
// //                               </Typography>
// //                               <Typography sx={{ fontSize: '14px' }}>
// //                                   Monday, 1-Apr-2024
// //                               </Typography>
// //                           </Box>
// //                       </Box>

// //                       {/* Company Name and Last Entry Date headers */}
// //                       <Box sx={{
// //                           display: 'flex',
// //                           padding: '16px 16px 0',
// //                           backgroundColor: 'white'
// //                       }}>
// //                           <Box sx={{ flex: 1 }}>
// //                               <Typography sx={{
// //                                   fontSize: '12px',
// //                                   color: '#0066cc',
// //                                   fontWeight: 'bold'
// //                               }}>
// //                                   NAME OF COMPANY
// //                               </Typography>
// //                           </Box>
// //                           <Box sx={{ flex: 1 }}>
// //                               <Typography sx={{
// //                                   fontSize: '12px',
// //                                   color: '#0066cc',
// //                                   fontWeight: 'bold'
// //                               }}>
// //                                   DATE OF LAST ENTRY
// //                               </Typography>
// //                           </Box>
// //                       </Box>

// //                       {/* Company Name and Last Entry Date values */}
// //                       <Box sx={{
// //                           display: 'flex',
// //                           padding: '8px 16px 16px',
// //                           backgroundColor: 'white'
// //                       }}>
// //                           <Box sx={{ flex: 1 }}>
// //                               <Typography sx={{ fontSize: '14px' }}>
// //                                   lhub
// //                               </Typography>
// //                           </Box>
// //                           <Box sx={{ flex: 1 }}>
// //                               <Typography sx={{ fontSize: '14px' }}>
// //                                   1-Apr-24
// //                               </Typography>
// //                           </Box>
// //                       </Box>
// //                   </Box>

// //                   {/* Right side - Gateway of Tally Menu */}
// //                   <Box sx={{
// //                       width: '30%',
// //                       height: '100%',
// //                       display: 'flex',
// //                       justifyContent: 'center',
// //                       alignItems: 'flex-start',
// //                       padding: '24px 8px 0 8px',
// //                       backgroundColor: '#e6f2ff'
// //                   }}>
// //                       <Box sx={{
// //                           width: '280px',
// //                           backgroundColor: '#e6f2ff',
// //                           border: '1px solid #a0a0a0',
// //                           display: 'flex',
// //                           flexDirection: 'column',
// //                           overflow: 'hidden'
// //                       }}>
// //                           {/* Header */}
// //                           <Box sx={{
// //                               backgroundColor: '#4682B4',
// //                               color: 'white',
// //                               padding: '6px 0',
// //                               textAlign: 'center',
// //                               fontWeight: 'bold',
// //                               fontSize: '16px'
// //                           }}>
// //                               Gateway of Tally
// //                           </Box>

// //                           {/* MASTERS Section */}
// //                           <Box sx={{
// //                               backgroundColor: '#e6f2ff',
// //                               color: '#666',
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               fontSize: '12px'
// //                           }}>
// //                               MASTERS
// //                           </Box>

// //                           <Box
// //                               sx={{
// //                                   backgroundColor: '#FFD700',
// //                                   padding: '4px 0',
// //                                   textAlign: 'center',
// //                                   cursor: 'pointer',
// //                                   '&:hover': { backgroundColor: '#e0e0e0' }
// //                               }}
// //                               onClick={handleOpenDialog}
// //                           >
// //                               <Typography sx={{ fontSize: '14px' }}>Create</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Alter</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Chart of Accounts</Typography>
// //                           </Box>

// //                           {/* TRANSACTIONS Section */}
// //                           <Box sx={{
// //                               backgroundColor: '#e6f2ff',
// //                               color: '#666',
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               fontSize: '12px'
// //                           }}>
// //                               TRANSACTIONS
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Vouchers</Typography>
// //                           </Box>

// //                           {/* New Saved Vouchers Option */}
// //                           <Box
// //                               sx={{
// //                                   padding: '4px 0',
// //                                   textAlign: 'center',
// //                                   cursor: 'pointer',
// //                                   '&:hover': { backgroundColor: '#f5f5f5' }
// //                               }}
// //                               onClick={() => router.push('/vouchertype')} // Navigate to /voucher
// //                           >
// //                               <Typography sx={{ fontSize: '14px' }}>Saved Vouchers</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Day Book</Typography>
// //                           </Box>

// //                           {/* UTILITIES Section */}
// //                           <Box sx={{
// //                               backgroundColor: '#e6f2ff',
// //                               color: '#666',
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               fontSize: '12px'
// //                           }}>
// //                               UTILITIES
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Banking</Typography>
// //                           </Box>

// //                           {/* REPORTS Section */}
// //                           <Box sx={{
// //                               backgroundColor: '#e6f2ff',
// //                               color: '#666',
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               fontSize: '12px'
// //                           }}>
// //                               REPORTS
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Balance Sheet</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Profit & Loss A/c</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Stock Summary</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Ratio Analysis</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Display More Reports</Typography>
// //                           </Box>

// //                           <Box sx={{
// //                               padding: '4px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Dashboard</Typography>
// //                           </Box>

// //                           <Box sx={{ flexGrow: 1 }}></Box>

// //                           <Box sx={{
// //                               padding: '6px 0',
// //                               textAlign: 'center',
// //                               cursor: 'pointer',
// //                               '&:hover': { backgroundColor: '#f5f5f5' }
// //                           }}>
// //                               <Typography sx={{ fontSize: '14px' }}>Quit</Typography>
// //                           </Box>
// //                       </Box>
// //                   </Box>

// //                   {/* Right side keyboard shortcuts */}
// //                   <Box sx={{
// //                       position: 'absolute',
// //                       top: 0,
// //                       right: 0,
// //                       backgroundColor: '#e6f2ff',
// //                       border: '1px solid #a0a0a0',
// //                       borderTop: 'none',
// //                       borderRight: 'none'
// //                   }}>
// //                       <Box sx={{
// //                           display: 'flex',
// //                           flexDirection: 'column'
// //                       }}>
// //                           <Box sx={{
// //                               display: 'flex',
// //                               padding: '2px 4px',
// //                               alignItems: 'center',
// //                               borderBottom: '1px solid #a0a0a0'
// //                           }}>
// //                               <Typography sx={{
// //                                   fontSize: '12px',
// //                                   fontWeight: 'bold',
// //                                   marginRight: '8px'
// //                               }}>
// //                                   F2:
// //                               </Typography>
// //                               <Typography sx={{
// //                                   fontSize: '12px'
// //                               }}>
// //                                   Date
// //                               </Typography>
// //                           </Box>
// //                           <Box sx={{
// //                               display: 'flex',
// //                               padding: '2px 4px',
// //                               alignItems: 'center'
// //                           }}>
// //                               <Typography sx={{
// //                                   fontSize: '12px',
// //                                   fontWeight: 'bold',
// //                                   marginRight: '8px'
// //                               }}>
// //                                   F3:
// //                               </Typography>
// //                               <Typography sx={{
// //                                   fontSize: '12px'
// //                               }}>
// //                                   Company
// //                               </Typography>
// //                           </Box>
// //                       </Box>
// //                   </Box>
// //               </Box>
// //           </Box>

// //           {/* Modified Master Creation Dialog */}
// //           <Dialog
// //               open={openDialog}
// //               onClose={handleCloseDialog}
// //               PaperProps={{
// //                   style: {
// //                       maxWidth: '450px',
// //                       width: '100%',
// //                       borderRadius: 0,
// //                       height: 'auto',
// //                   },
// //               }}
// //           >
// //               {/* Master Creation Header */}
// //               <Box sx={{ 
// //                   bgcolor: '#3b71c6', 
// //                   color: 'white', 
// //                   p: 1, 
// //                   textAlign: 'center',
// //                   position: 'relative'
// //               }}>
// //                   <Typography variant="subtitle1">Master Creation</Typography>
// //                   <IconButton
// //                       aria-label="close"
// //                       onClick={handleCloseDialog}
// //                       sx={{
// //                           position: 'absolute',
// //                           right: 8,
// //                           top: 5,
// //                           color: 'white',
// //                       }}
// //                   >
// //                       <CloseIcon />
// //                   </IconButton>
// //               </Box>

// //               {/* Action Buttons (Moved to Top) */}
// //               <Box sx={{
// //                   display: 'flex',
// //                   justifyContent: 'flex-end',
// //                   p: 0.5,
// //                   bgcolor: '#e6f0ff',
// //                   borderBottom: '1px solid #a0a0a0'
// //               }}>
// //                   <Button size="small" sx={{ color: '#1976d2', textTransform: 'none', fontWeight: 'normal' }}>
// //                       Change Company
// //                   </Button>
// //                   <Button size="small" sx={{ color: '#1976d2', textTransform: 'none', fontWeight: 'normal' }}>
// //                       Show More
// //                   </Button>
// //               </Box>

// //               {/* List of Masters Header */}
// //               <Box sx={{
// //                   bgcolor: '#e6f0ff',
// //                   color: 'black',
// //                   p: 0.7,
// //                   textAlign: 'center',
// //                   borderBottom: '1px solid #a0a0a0'
// //               }}>
// //                   <Typography variant="subtitle2">List of Masters</Typography>
// //               </Box>

// //               {/* Masters List - Fixed height, non-scrollable */}
// //               <Box sx={{ 
// //                   bgcolor: '#e6f0ff', 
// //                   height: 'auto',
// //                   display: 'flex',
// //                   flexDirection: 'column',
// //               }}>
// //                   {Object.keys(mastersData).map((category) => (
// //                       <Box key={category}>
// //                           <Box sx={{
// //                               bgcolor: '#e6f0ff',
// //                               color: 'black',
// //                               fontWeight: 'bold',
// //                               py: 0.5,
// //                               pl: 2,
// //                               textTransform: 'uppercase',
// //                               fontSize: '14px'
// //                           }}>
// //                               {mastersData[category].title}
// //                           </Box>
// //                           {mastersData[category].items.map((item) => (
// //                               <Box
// //                                   key={item}
// //                                   onClick={() => handleItemClick(item)} // Updated to handle navigation
// //                                   sx={{
// //                                       bgcolor: selectedItem === item ? '#ffcc00' : '#e6f0ff',
// //                                       '&:hover': {
// //                                           bgcolor: selectedItem === item ? '#ffcc00' : '#d1e0ff',
// //                                       },
// //                                       py: 0.3,
// //                                       pl: 4,
// //                                       cursor: 'pointer'
// //                                   }}
// //                               >
// //                                   <Typography sx={{
// //                                       fontSize: '14px',
// //                                       fontWeight: selectedItem === item ? 'medium' : 'normal'
// //                                   }}>
// //                                       {item}
// //                                   </Typography>
// //                               </Box>
// //                           ))}
// //                       </Box>
// //                   ))}
// //               </Box>
// //           </Dialog>
// //       </>
// //   );
// // };

// // export default TallyUi;
// "use client";

// import {
//   Box,
//   Typography,
//   Paper,
//   Dialog,
//   DialogContent,
//   TextField,
//   List,
//   ListItemButton,
//   ListItemText,
//   ListSubheader,
//   Button,
//   IconButton,
// } from "@mui/material";
// import { useRouter } from "next/navigation";
// import Navbar from "../../components/navbar";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import React, { useState } from "react";

// // Styled Dialog
// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(1),
//   },
// }));

// function BootstrapDialogTitle(props) {
//   const { children, onClose, ...other } = props;

//   return (
//     <Box
//       sx={{ m: 0, p: 2, bgcolor: "#3b71c6", color: "white", fontWeight: "bold" }}
//       {...other}
//     >
//       <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//         {children}
//       </Typography>
//       {onClose ? (
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: "white",
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </Box>
//   );
// }

// const TallyUi = () => {
//   const router = useRouter();
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedItem, setSelectedItem] = useState("Group");
//   const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);

//   // Data structure for the master lists
//   const mastersData = {
//     accounting: {
//       title: "Accounting Masters",
//       items: ["Group", "Ledger", "Currency", "Voucher Type"],
//     },
//     inventory: {
//       title: "Inventory Masters",
//       items: ["Stock Group", "Stock Category", "Stock Item", "Unit", "Location"],
//     },
//     payroll: {
//       title: "Payroll Masters",
//       items: [
//         "Employee Group",
//         "Employee",
//         "Units (Work)",
//         "Attendance/Production Type",
//         "Pay Heads",
//         "Payroll Voucher Type",
//       ],
//     },
//     statutory: {
//       title: "Statutory Masters",
//       items: ["GST Registration", "GST Classification"],
//     },
//     statutoryDetails: {
//       title: "Statutory Details",
//       items: ["Company GST Details", "PAN/CIN Details"],
//     },
//   };

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//     if (item === "Voucher Type") {
//       router.push("/vouchertype");
//       handleCloseDialog();
//     }
//   };

//   const handleOpenVoucherDialog = () => {
//     setVoucherDialogOpen(true);
//   };

//   const handleCloseVoucherDialog = () => {
//     setVoucherDialogOpen(false);
//   };

//   const handleOrderVouchersClick = () => {
//     router.push("/goto");
//     handleCloseVoucherDialog();
//   };

//   const handleFunctionKeyClick = (key) => {
//     if (key === "F10") {
//       router.push("/goto"); // Navigate to /goto when F10 (Other Vouchers) is clicked
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <Box
//         sx={{
//           width: "100%",
//           height: "calc(100vh - 64px)",
//           backgroundColor: "#e6f2ff",
//           position: "relative",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Top bar with Gateway of Tally text and close button */}
//         <Box
//           sx={{
//             width: "100%",
//             height: "30px",
//             backgroundColor: "#e6f2ff",
//             borderBottom: "1px solid #a0a0a0",
//             display: "flex",
//             alignItems: "center",
//             paddingLeft: "8px",
//             paddingRight: "8px",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: "14px",
//               fontWeight: "bold",
//               color: "#000",
//             }}
//           >
//             Gateway of Tally
//           </Typography>
//           <Typography
//             sx={{
//               fontSize: "16px",
//               fontWeight: "bold",
//               cursor: "pointer",
//             }}
//           >
//             ✕
//           </Typography>
//         </Box>
//         {/* Main content area */}
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             position: "relative",
//           }}
//         >
//           {/* Left side - Company Info Panel */}
//           <Box
//             sx={{
//               width: "50%",
//               height: "100%",
//               backgroundColor: "white",
//               border: "1px solid #ccc",
//               borderTop: "none",
//               borderRight: "none",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {/* Current Period and Date Section */}
//             <Box
//               sx={{
//                 display: "flex",
//                 borderBottom: "1px solid #ccc",
//                 padding: "8px 16px",
//                 backgroundColor: "white",
//               }}
//             >
//               <Box sx={{ flex: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     color: "#0066cc",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   CURRENT PERIOD
//                 </Typography>
//                 <Typography sx={{ fontSize: "14px" }}>
//                   1-Apr-24 to 31-Mar-25
//                 </Typography>
//               </Box>
//               <Box sx={{ flex: 1, textAlign: "right" }}>
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     color: "#0066cc",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   CURRENT DATE
//                 </Typography>
//                 <Typography sx={{ fontSize: "14px" }}>
//                   Monday, 1-Apr-2024
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Company Name and Last Entry Date headers */}
//             <Box
//               sx={{
//                 display: "flex",
//                 padding: "16px 16px 0",
//                 backgroundColor: "white",
//               }}
//             >
//               <Box sx={{ flex: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     color: "#0066cc",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   NAME OF COMPANY
//                 </Typography>
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     color: "#0066cc",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   DATE OF LAST ENTRY
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Company Name and Last Entry Date values */}
//             <Box
//               sx={{
//                 display: "flex",
//                 padding: "8px 16px 16px",
//                 backgroundColor: "white",
//               }}
//             >
//               <Box sx={{ flex: 1 }}>
//                 <Typography sx={{ fontSize: "14px" }}>lhub</Typography>
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Typography sx={{ fontSize: "14px" }}>1-Apr-24</Typography>
//               </Box>
//             </Box>
//           </Box>

//           {/* Right side - Gateway of Tally Menu */}
//           <Box
//             sx={{
//               width: "30%",
//               height: "100%",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "flex-start",
//               padding: "24px 8px 0 8px",
//               backgroundColor: "#e6f2ff",
//             }}
//           >
//             <Box
//               sx={{
//                 width: "280px",
//                 backgroundColor: "#e6f2ff",
//                 border: "1px solid #a0a0a0",
//                 display: "flex",
//                 flexDirection: "column",
//                 overflow: "hidden",
//               }}
//             >
//               {/* Header */}
//               <Box
//                 sx={{
//                   backgroundColor: "#4682B4",
//                   color: "white",
//                   padding: "6px 0",
//                   textAlign: "center",
//                   fontWeight: "bold",
//                   fontSize: "16px",
//                 }}
//               >
//                 Gateway of Tally
//               </Box>

//               {/* MASTERS Section */}
//               <Box
//                 sx={{
//                   backgroundColor: "#e6f2ff",
//                   color: "#666",
//                   padding: "4px 0",
//                   textAlign: "center",
//                   fontSize: "12px",
//                 }}
//               >
//                 MASTERS
//               </Box>

//               <Box
//                 sx={{
//                   backgroundColor: "#FFD700",
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#e0e0e0" },
//                 }}
//                 onClick={handleOpenDialog}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Create</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Alter</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Chart of Accounts</Typography>
//               </Box>

//               {/* TRANSACTIONS Section */}
//               <Box
//                 sx={{
//                   backgroundColor: "#e6f2ff",
//                   color: "#666",
//                   padding: "4px 0",
//                   textAlign: "center",
//                   fontSize: "12px",
//                 }}
//               >
//                 TRANSACTIONS
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//                 onClick={() => router.push("/goto")}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Vouchers</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//                 onClick={() => router.push("/vouchertype")}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Saved Vouchers</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Day Book</Typography>
//               </Box>

//               {/* UTILITIES Section */}
//               <Box
//                 sx={{
//                   backgroundColor: "#e6f2ff",
//                   color: "#666",
//                   padding: "4px 0",
//                   textAlign: "center",
//                   fontSize: "12px",
//                 }}
//               >
//                 UTILITIES
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Banking</Typography>
//               </Box>

//               {/* REPORTS Section */}
//               <Box
//                 sx={{
//                   backgroundColor: "#e6f2ff",
//                   color: "#666",
//                   padding: "4px 0",
//                   textAlign: "center",
//                   fontSize: "12px",
//                 }}
//               >
//                 REPORTS
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Balance Sheet</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Profit & Loss A/c</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Stock Summary</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Ratio Analysis</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Display More Reports</Typography>
//               </Box>

//               <Box
//                 sx={{
//                   padding: "4px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Dashboard</Typography>
//               </Box>

//               <Box sx={{ flexGrow: 1 }}></Box>

//               <Box
//                 sx={{
//                   padding: "6px 0",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//               >
//                 <Typography sx={{ fontSize: "14px" }}>Quit</Typography>
//               </Box>
//             </Box>
//           </Box>

//           {/* Rightmost - Function Key Panel (Expanded to fill remaining space) */}
//           <Box
//             sx={{
//               width: "20%", // Adjusted to take remaining space
//               height: "100%",
//               backgroundColor: "#e6f2ff",
//               borderLeft: "1px solid #a0a0a0",
//               borderTop: "none",
//               borderRight: "none",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 height: "100%",
//                 borderTop: "1px solid #a0a0a0",
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                   bgcolor: "#1976d2",
//                   color: "white",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F2:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Date</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F3:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Company</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F4:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Contra</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F5:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Payment</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F6:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Receipt</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F7:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Journal</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F8:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Sales</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F9:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Purchase</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: "#f5f5f5" },
//                 }}
//                 onClick={() => handleFunctionKeyClick("F10")}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F10:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Other Vouchers</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   I:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>More Details</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   O:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Related Reports</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   L:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Optional</Typography>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderBottom: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   W:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Pre-Close Order</Typography>
//               </Box>
//               <Box sx={{ flexGrow: 1 }}></Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   padding: "2px 4px",
//                   alignItems: "center",
//                   borderTop: "1px solid #a0a0a0",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginRight: "8px",
//                   }}
//                 >
//                   F12:
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px" }}>Configure</Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* Master Creation Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         PaperProps={{
//           style: {
//             maxWidth: "450px",
//             width: "100%",
//             borderRadius: 0,
//             height: "auto",
//           },
//         }}
//       >
//         <BootstrapDialogTitle onClose={handleCloseDialog}>
//           Master Creation
//         </BootstrapDialogTitle>
//         <DialogContent>
//           <Box sx={{ bgcolor: "#e6f0ff", display: "flex", flexDirection: "column" }}>
//             {Object.keys(mastersData).map((category) => (
//               <Box key={category}>
//                 <Box
//                   sx={{
//                     bgcolor: "#e6f0ff",
//                     color: "black",
//                     fontWeight: "bold",
//                     py: 0.5,
//                     pl: 2,
//                     textTransform: "uppercase",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {mastersData[category].title}
//                 </Box>
//                 {mastersData[category].items.map((item) => (
//                   <Box
//                     key={item}
//                     onClick={() => handleItemClick(item)}
//                     sx={{
//                       bgcolor: selectedItem === item ? "#ffcc00" : "#e6f0ff",
//                       "&:hover": {
//                         bgcolor: selectedItem === item ? "#ffcc00" : "#d1e0ff",
//                       },
//                       py: 0.3,
//                       pl: 4,
//                       cursor: "pointer",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "14px",
//                         fontWeight: selectedItem === item ? "medium" : "normal",
//                       }}
//                     >
//                       {item}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             ))}
//           </Box>
//         </DialogContent>
//       </Dialog>

//       {/* Voucher Dialog (for Other Vouchers) */}
//       <Dialog
//         open={voucherDialogOpen}
//         onClose={handleCloseVoucherDialog}
//         PaperProps={{
//           style: {
//             maxWidth: "450px",
//             width: "100",
//             borderRadius: 0,
//             height: "auto",
//           },
//         }}
//       >
//         <BootstrapDialogTitle onClose={handleCloseVoucherDialog}>
//           Other Vouchers
//         </BootstrapDialogTitle>
//         <DialogContent>
//           <Box sx={{ bgcolor: "#e6f0ff", display: "flex", flexDirection: "column" }}>
//             <Box
//               onClick={handleOrderVouchersClick}
//               sx={{
//                 bgcolor: "#FFD700",
//                 padding: "8px 16px",
//                 cursor: "pointer",
//                 "&:hover": { backgroundColor: "#e0e0e0" },
//               }}
//             >
//               <Typography sx={{ fontSize: "14px" }}>Order Vouchers</Typography>
//             </Box>
//             {/* Add more voucher types as needed */}
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default TallyUi;
import React from "react";
import TallyUi from "./components/TallyUi";

const Page = () => {
  return <TallyUi />;
};

export default Page;