
// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   MenuItem,
//   Button,
//   IconButton,
//   Menu,
//   ListItemText,
//   Divider,
//   Collapse,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ReplayIcon from "@mui/icons-material/Replay";
// import ShareIcon from "@mui/icons-material/Share";
// import { MenuIcon, Settings2 } from "lucide-react";
// import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
// import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
// import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import apiService from "../../../services/axiosService";
// import config from "../../../services/config";
// import dayjs from "dayjs";
// import html2pdf from "html2pdf.js";
// // Import your Account Transactions component
// import AccountTransactions from "./ProfitandLossIndividual"; // Adjust the path as needed

// const ProfitAndLoss = () => {
//   const [exportAnchorEl, setExportAnchorEl] = useState(null);
//   const exportMenuOpen = Boolean(exportAnchorEl);
//   const [dateValue, setDateValue] = useState("This Month");
//   const [dateAnchorEl, setDateAnchorEl] = useState(null);
//   const dateMenuOpen = Boolean(dateAnchorEl);
//   const [reportBasis, setReportBasis] = useState("Cash");
//   const [reportBasisAnchorEl, setReportBasisAnchorEl] = useState(null);
//   const reportBasisMenuOpen = Boolean(reportBasisAnchorEl);
//   const [profitLossData, setProfitLossData] = useState({});
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [organizationData, setOrganizationData] = useState();
//   const [showDetails, setShowDetails] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // New state for navigation
//   const [showAccountTransactions, setShowAccountTransactions] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);

//   // New state for expanding COA details
//   const [expandedSections, setExpandedSections] = useState({
//     operatingIncome: false,
//     costOfGoodsSold: false,
//     operatingExpense: false,
//     nonOperatingIncome: false,
//     nonOperatingExpense: false,
//   });

//   const fetchProfitLossData = async () => {
//     const organization_id = localStorage.getItem("organization_id");
//     setLoading(true);

//     try {
//       // Convert date format from DD-MM-YYYY to YYYY-MM-DD for API
//       let apiFromDate, apiToDate;
      
//       // Check if dates are valid and convert properly
//       if (fromDate && dayjs(fromDate, "DD-MM-YYYY", true).isValid()) {
//         apiFromDate = dayjs(fromDate, "DD-MM-YYYY").format("YYYY-MM-DD");
//       } else {
//         // Fallback to current month start if invalid
//         apiFromDate = dayjs().startOf("month").format("YYYY-MM-DD");
//       }
      
//       if (toDate && dayjs(toDate, "DD-MM-YYYY", true).isValid()) {
//         apiToDate = dayjs(toDate, "DD-MM-YYYY").format("YYYY-MM-DD");
//       } else {
//         // Fallback to current month end if invalid
//         apiToDate = dayjs().endOf("month").format("YYYY-MM-DD");
//       }

//       console.log("Date conversion:", { fromDate, toDate, apiFromDate, apiToDate });

//       const response = await apiService({
//         method: "GET",
//         url: `api/v1/reports/profit-loss/bill-invoice?organization_id=${organization_id}&from=${apiFromDate}&to=${apiToDate}`,
//         customBaseUrl: config.apiBaseUrl,
//       });

//       console.log("The P&L Bill/Invoice Data:", response);
//       setProfitLossData(response.data.data || {});
//       setShowDetails(true);
//     } catch (error) {
//       console.error("Error fetching P&L data:", error);
//       setProfitLossData({});
//       setShowDetails(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrganization = async () => {
//     const org_id = localStorage.getItem("organization_id");

//     try {
//       const response = await apiService({
//         method: "GET",
//         url: `api/v1/organization/${org_id}`,
//         customBaseUrl: config.apiBaseUrl,
//       });

//       console.log("The Organization Data:", response.data.data);
//       setOrganizationData(response.data.data);
//     } catch (error) {
//       console.error("Error fetching organization data:", error);
//     }
//   };

//   useEffect(() => {
//     const today = dayjs();
//     let from, to;

//     from = today.startOf("month");
//     to = today.endOf("month");

//     // Set dates with proper validation
//     const formattedFromDate = from.format("DD-MM-YYYY");
//     const formattedToDate = to.format("DD-MM-YYYY");
    
//     setFromDate(formattedFromDate);
//     setToDate(formattedToDate);

//     console.log("Initial dates set:", { 
//       from: formattedFromDate, 
//       to: formattedToDate,
//       fromObj: from.toDate(),
//       toObj: to.toDate()
//     });

//     fetchOrganization();
//   }, []);

//   const handleDateRangeSelection = (label) => {
//     const today = dayjs();
//     let from, to;

//     switch (label) {
//       case "Today":
//         from = to = today;
//         break;
//       case "Yesterday":
//         from = to = today.subtract(1, "day");
//         break;
//       case "This Week":
//         from = today.startOf("week");
//         to = today.endOf("week");
//         break;
//       case "Previous Week":
//         from = today.subtract(1, "week").startOf("week");
//         to = today.subtract(1, "week").endOf("week");
//         break;
//       case "This Month":
//         from = today.startOf("month");
//         to = today.endOf("month");
//         break;
//       case "Previous Month":
//         from = today.subtract(1, "month").startOf("month");
//         to = today.subtract(1, "month").endOf("month");
//         break;
//       case "This Quarter": {
//         const quarter = Math.floor(today.month() / 3);
//         from = dayjs(new Date(today.year(), quarter * 3, 1));
//         to = from.endOf("quarter");
//         break;
//       }
//       case "Previous Quarter": {
//         const quarter = Math.floor(today.month() / 3) - 1;
//         const year = quarter < 0 ? today.year() - 1 : today.year();
//         const adjustedQuarter = (quarter + 4) % 4;
//         from = dayjs(new Date(year, adjustedQuarter * 3, 1));
//         to = from.endOf("quarter");
//         break;
//       }
//       case "This Year":
//         from = today.startOf("year");
//         to = today.endOf("year");
//         break;
//       case "Previous Year":
//         from = today.subtract(1, "year").startOf("year");
//         to = today.subtract(1, "year").endOf("year");
//         break;
//       default:
//         // Default to current month if unknown label
//         from = today.startOf("month");
//         to = today.endOf("month");
//     }

//     // Ensure we have valid dayjs objects and format them properly
//     const formattedFromDate = from && from.isValid() ? from.format("DD-MM-YYYY") : today.startOf("month").format("DD-MM-YYYY");
//     const formattedToDate = to && to.isValid() ? to.format("DD-MM-YYYY") : today.endOf("month").format("DD-MM-YYYY");

//     setFromDate(formattedFromDate);
//     setToDate(formattedToDate);

//     console.log("Date range selected:", { 
//       label, 
//       from: formattedFromDate, 
//       to: formattedToDate 
//     });
//   };

//   const handleClose = () => {
//     setDateAnchorEl(null);
//     setExportAnchorEl(null);
//     setReportBasisAnchorEl(null);
//   };

//   const handleExportClick = (event) => {
//     setExportAnchorEl(event.currentTarget);
//   };

//   const handleRunReport = () => {
//     fetchProfitLossData();
//   };

//   // Function to handle account row clicks
//   const handleAccountClick = (accountName, accountType) => {
//     setSelectedAccount({ name: accountName, type: accountType });
//     setShowAccountTransactions(true);
//   };

//   // Function to go back to P&L
//   const handleBackToPL = () => {
//     setShowAccountTransactions(false);
//     setSelectedAccount(null);
//   };

//   // Function to toggle COA sections
//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   // Navigation function for COA accounts
//   const handleCOANavigation = (type) => {
//     if (type === 'invoices') {
//       window.location.href = '/sales/invoices';
//     } else if (type === 'bills') {
//       window.location.href = '/purchases/bills';
//     }
//   };

//   const generatePdfSimple = () => {
//     setTimeout(() => {
//       try {
//         const element = document.getElementById("pdf-print");

//         if (!element) {
//           console.error("P&L Report PDF element not found");
//           return;
//         }

//         const options = {
//           filename: `Profit-Loss-Report-${new Date().toISOString().split("T")[0]}.pdf`,
//           image: { type: "jpeg", quality: 1 },
//           html2canvas: {
//             scale: 2,
//             useCORS: true,
//             allowTaint: true,
//             backgroundColor: "#ffffff",
//           },
//           jsPDF: {
//             unit: "mm",
//             format: "a4",
//             orientation: "portrait",
//           },
//           margin: [10, 10, 10, 10],
//         };

//         html2pdf()
//           .from(element)
//           .set(options)
//           .save()
//           .then(() => {
//             console.log("P&L Report PDF generated successfully");
//           })
//           .catch((error) => {
//             console.error("Error generating PDF:", error);
//           });
//       } catch (error) {
//         console.error("Error in PDF generation:", error);
//       }
//     }, 500);
//   };

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(Math.abs(amount));
//   };

//   const AmountDisplay = ({ amount }) => (
//     <Typography
//       sx={{
//         fontSize: "14px",
//         fontWeight: "400",
//         color: "#000000",
//         textAlign: "right",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       {formatAmount(amount)}
//     </Typography>
//   );

//   const PLAccountRow = ({ 
//     name, 
//     amount, 
//     accountCode = "", 
//     isSubItem = false, 
//     isTotal = false,
//     onExpand = null,
//     isExpanded = false,
//     onClick = null,
//     showCOABreakdown = false,
//     coaData = null,
//     navigationType = null
//   }) => {
//     const isClickable = onClick !== null;

//     return (
//       <>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             py: 1,
//             px: 2,
//             pl: isSubItem ? 4 : 2,
//             bgcolor: isTotal ? "#f9f9f9" : "transparent",
//             borderBottom: "1px solid #f0f0f0",
//             cursor: (isClickable || onExpand) ? "pointer" : "default",
//             "&:hover": (isClickable || onExpand) ? {
//               backgroundColor: "#f5f5f5",
//             } : {},
//           }}
//           onClick={onExpand || onClick}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Typography
//               sx={{
//                 fontSize: "14px",
//                 fontWeight: isTotal ? "600" : "400",
//                 color: "#000000",
//                 fontFamily: "Arial, sans-serif",
//                 textDecoration: isClickable ? "underline" : "none",
//               }}
//             >
//               {name}
//             </Typography>
//             {accountCode && (
//               <Typography
//                 sx={{
//                   fontSize: "12px",
//                   color: "#666666",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 {accountCode}
//               </Typography>
//             )}
//             {onExpand && (
//               <IconButton size="small">
//                 {isExpanded ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}
//               </IconButton>
//             )}
//           </Box>
//           <AmountDisplay amount={amount} />
//         </Box>

//         {/* COA Breakdown Collapse */}
//         {showCOABreakdown && coaData && (
//           <Collapse in={isExpanded}>
//             <Box sx={{ bgcolor: "#fafafa", py: 1 }}>
//               <Box 
//                 sx={{ 
//                   px: 4, 
//                   py: 0.5,
//                   cursor: navigationType ? "pointer" : "default",
//                   "&:hover": navigationType ? {
//                     backgroundColor: "#e3f2fd",
//                   } : {}
//                 }}
//                 onClick={() => navigationType && handleCOANavigation(navigationType)}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: "600",
//                     color: navigationType ? "#1976d2" : "#666666",
//                     fontFamily: "Arial, sans-serif",
//                     textDecoration: navigationType ? "underline" : "none",
//                   }}
//                 >
//                   {navigationType ? "→ View detailed transactions" : "Account breakdown"}
//                 </Typography>
//               </Box>
//               {Object.entries(coaData).map(([accountId, accountData]) => {
//                 // Filter out AC_051 account
//                 if (accountId === "AC_051") return null;
                
//                 return (
//                   <Box
//                     key={accountId}
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       py: 0.5,
//                       px: 4,
//                       borderLeft: "3px solid #e3f2fd",
//                     }}
//                   >
//                     <Box>
//                       <Typography
//                         sx={{
//                           fontSize: "13px",
//                           fontWeight: "400",
//                           color: "#424242",
//                           fontFamily: "Arial, sans-serif",
//                         }}
//                       >
//                         {accountData.account_name} ({accountId})
//                       </Typography>
//                       <Typography
//                         sx={{
//                           fontSize: "11px",
//                           color: "#666666",
//                           fontFamily: "Arial, sans-serif",
//                         }}
//                       >
//                         Transactions: {accountData.transaction_count}
//                       </Typography>
//                     </Box>
//                     <AmountDisplay amount={accountData.total_amount} />
//                   </Box>
//                 );
//               })}
//             </Box>
//           </Collapse>
//         )}
//       </>
//     );
//   };

//   // Calculate derived values
//   const operatingIncome = profitLossData.invoices?.netAmount || 0;
//   const costOfGoodsSold = profitLossData.bills?.netAmount || 0;
//   const grossProfit = operatingIncome - costOfGoodsSold;
//   const operatingExpense = 0; // You can add this from your data if available
//   const operatingProfit = grossProfit - operatingExpense;
//   const nonOperatingIncome = 0; // You can add this from your data if available
//   const nonOperatingExpense = 0; // You can add this from your data if available
//   const netProfitLoss = operatingProfit + nonOperatingIncome - nonOperatingExpense;

//   // Conditional rendering - show Account Transactions or P&L
//   if (showAccountTransactions) {
//     return (
//       <Box>
//         {/* Header with back button */}
//         <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
//           <Button
//             onClick={handleBackToPL}
//             sx={{ mb: 2 }}
//             variant="outlined"
//             size="small"
//           >
//             ← Back to Profit & Loss
//           </Button>
//           <Typography variant="h6">
//             Account Transactions - {selectedAccount?.name}
//           </Typography>
//         </Box>
//         <AccountTransactions />
//       </Box>
//     );
//   }

//   return (
//     //The Main Box
//     <Box>
//       {/*The Sticky Box*/}
//       <Box sx={{ position: "sticky", top: 0, bgcolor: "white", zIndex: 9 }}>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             p: 2,
//             justifyContent: "space-between",
//           }}
//         >
//           {/*Left Box*/}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "#e9e9e9",
//                 padding: "4px",
//                 borderRadius: "6px",
//                 width: "30px",
//                 height: "30px",
//               }}
//             >
//               <IconButton size="small" sx={{ color: "#333", padding: "2px" }}>
//                 <MenuIcon fontSize="small" sx={{ fontsize: "8px" }} />
//               </IconButton>
//             </Box>
//             <Box>
//               <Box>
//                 <Typography
//                   sx={{ fontSize: "12px", fontWeight: "500", color: "#4C526C" }}
//                 >
//                   Accountant
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
//                     Profit and Loss
//                   </Typography>
//                   <Typography
//                     sx={{ ml: 1, fontSize: "12px", fontWeight: "400" }}
//                   >
//                     {" "}
//                     • From {fromDate} To {toDate}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </Box>

//           {/*Right Box*/}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <IconButton size="small">
//               <Settings2 sx={{ fontSize: "16px" }} height="20px" />
//             </IconButton>

//             <Box
//               display="flex"
//               alignItems="center"
//               border={1}
//               borderColor="grey.400"
//               borderRadius={1}
//               overflow="hidden"
//               width="fit-content"
//               sx={{ borderRadius: "6px" }}
//             >
//               <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
//                 <IconButton size="small">
//                   <ReplayIcon sx={{ fontSize: "16px" }} />
//                 </IconButton>
//               </Box>

//               <Box width="1px" height="24px" bgcolor="grey.400" />

//               <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
//                 <IconButton size="small">
//                   <ShareIcon sx={{ fontSize: "16px" }} />
//                 </IconButton>
//               </Box>
//             </Box>

//             <Button
//               variant="outlined"
//               size="small"
//               sx={{
//                 bgcolor: "#f5f5f5",
//                 fontSize: "13px",
//                 fontWeight: "400",
//                 color: "black",
//                 borderColor: "#dddddd",
//               }}
//               onClick={handleExportClick}
//             >
//               Export
//             </Button>

//             {/*Export Menu*/}
//             <Menu
//               anchorEl={exportAnchorEl}
//               open={exportMenuOpen}
//               onClose={handleClose}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "right",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//               sx={{
//                 borderRadius: "6px",
//               }}
//             >
//               <Box
//                 sx={{
//                   color: "#838195",
//                   fontSize: "12px",
//                   fontWeight: "600",
//                   p: 1,
//                   width: "200px",
//                 }}
//               >
//                 EXPORT AS
//               </Box>
//               <MenuItem
//                 sx={{
//                   borderRadius: "6px",
//                   "&:hover": {
//                     backgroundColor: "#187c19",
//                     color: "white",
//                   },
//                 }}
//                 onClick={() => {
//                   generatePdfSimple();
//                 }}
//               >
//                 <ListItemText
//                   primaryTypographyProps={{
//                     fontSize: "13px",
//                     fontWeight: 400,
//                   }}
//                   primary="PDF"
//                 />
//               </MenuItem>
//             </Menu>

//             <IconButton
//               size="small"
//               sx={{
//                 color: "#d32f2f",
//                 "&:hover": {
//                   backgroundColor: "rgba(211, 47, 47, 0.04)",
//                 },
//               }}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         </Box>
//         <Divider />
//       </Box>

//       {/*The Filters*/}
//       <Box sx={{ borderBottom: "1px solid #dddddd", boxShadow: 6 }}>
//         <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
//           <FilterAltOutlinedIcon sx={{ fontSize: "20px", color: "#495569" }} />
//           <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
//             Filters :
//           </Typography>

//           {/*Date Range*/}
//           <Box
//             sx={{
//               display: "flex",
//               border: "1px solid #dddddd",
//               borderRadius: "6px",
//               py: 0.5,
//               px: 1,
//               bgcolor: "#f6f6fa",
//               ml: 1,
//               alignItems: "center",
//             }}
//           >
//             <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
//               Date Range :
//             </Typography>
//             <Box
//               sx={{
//                 ml: 1,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 fontSize: "13px",
//                 fontWeight: "400",
//               }}
//               onClick={(event) => {
//                 setDateAnchorEl(event.currentTarget);
//               }}
//             >
//               {dateValue}
//               {dateAnchorEl ? (
//                 <KeyboardArrowUpOutlinedIcon sx={{ fontSize: "20px" }} />
//               ) : (
//                 <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px" }} />
//               )}
//             </Box>
//           </Box>

//           {/*Date Range Popup*/}
//           <Menu
//             anchorEl={dateAnchorEl}
//             open={dateMenuOpen}
//             onClose={handleClose}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "left",
//             }}
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "left",
//             }}
//             sx={{
//               borderRadius: "6px",
//               mt: 1,
//             }}
//           >
//             {[
//               "Today",
//               "This Week",
//               "This Month",
//               "This Quarter",
//               "This Year",
//               "Yesterday",
//               "Previous Week",
//               "Previous Month",
//               "Previous Quarter",
//               "Previous Year",
//             ].map((label) => (
//               <MenuItem
//                 key={label}
//                 onClick={() => {
//                   handleDateRangeSelection(label);
//                   setDateValue(label);
//                   handleClose();
//                 }}
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: 400,
//                   borderRadius: "6px",
//                   width: "180px",
//                 }}
//               >
//                 {label}
//               </MenuItem>
//             ))}
//           </Menu>

//           {/*Filter Accrual*/}
//           <Box
//             sx={{
//               display: "flex",
//               border: "1px solid #dddddd",
//               borderRadius: "6px",
//               py: 0.5,
//               px: 1,
//               bgcolor: "#f6f6fa",
//               ml: 1,
//               alignItems: "center",
//             }}
//           >
//             <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
//               Report Basis :
//             </Typography>
//             <Box
//               sx={{
//                 ml: 1,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 fontSize: "13px",
//                 fontWeight: "400",
//               }}
//               onClick={(event) => {
//                 setReportBasisAnchorEl(event.currentTarget);
//               }}
//             >
//               {reportBasis}
//               {reportBasisAnchorEl ? (
//                 <KeyboardArrowUpOutlinedIcon sx={{ fontSize: "20px" }} />
//               ) : (
//                 <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px" }} />
//               )}
//             </Box>

//             {/*Dropdown For Report Basis*/}
//             <Menu
//               anchorEl={reportBasisAnchorEl}
//               open={reportBasisMenuOpen}
//               onClose={handleClose}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "left",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "left",
//               }}
//               sx={{
//                 borderRadius: "6px",
//                 mt: 1,
//               }}
//             >
//               <MenuItem
//                 onClick={() => {
//                   setReportBasis("Accrual");
//                   handleClose();
//                 }}
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: 400,
//                   borderRadius: "6px",
//                   width: "180px",
//                 }}
//               >
//                 Accrual
//               </MenuItem>

//               <MenuItem
//                 onClick={() => {
//                   setReportBasis("Cash");
//                   handleClose();
//                 }}
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: 400,
//                   borderRadius: "6px",
//                   width: "180px",
//                 }}
//               >
//                 Cash
//               </MenuItem>
//             </Menu>
//           </Box>

//           <Button
//             variant="contained"
//             size="small"
//             sx={{ ml: 3, borderRadius: "6px", zIndex: 0 }}
//             onClick={handleRunReport}
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Run Report"}
//           </Button>
//         </Box>
//       </Box>

//       {/*The Main Content - Standard P&L Format*/}
//       <Box
//         sx={{
//           bgcolor: "#f4f4f9",
//           p: 4,
//           overflowY: "auto",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <Box
//           id="pdf-print"
//           sx={{
//             bgcolor: "white",
//             borderRadius: "6px",
//             width: "100%",
//             minWidth: "700px",
//           }}
//         >
//           <Box
//             sx={{ width: "80%", margin: "0 auto", justifyContent: "center" }}
//           >
//             {/* Header */}
//             <Box sx={{ textAlign: "center", py: 3 }}>
//               <Typography
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: "400",
//                   color: "#666666",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 {organizationData?.organization_name?.toUpperCase() || "IHUB"}
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: "20px",
//                   fontWeight: "600",
//                   my: 1,
//                   color: "#000000",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 Profit and Loss
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: "400",
//                   color: "#666666",
//                   mb: 1,
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 Basis : {reportBasis}
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: "400",
//                   color: "#666666",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 From {fromDate} To {toDate}
//               </Typography>
//             </Box>

//             {/* Table Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 py: 1.5,
//                 px: 2,
//                 bgcolor: "#f5f5f5",
//                 borderTop: "1px solid #e0e0e0",
//                 borderBottom: "1px solid #e0e0e0",
//                 mb: 2,
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#000000",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 ACCOUNT
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#000000",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 ACCOUNT CODE
//               </Typography>
//               <Typography
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   color: "#000000",
//                   fontFamily: "Arial, sans-serif",
//                 }}
//               >
//                 TOTAL
//               </Typography>
//             </Box>

//             {/* Content */}
//             {!showDetails ? (
//               // Show message when no report is run
//               <Box
//                 sx={{
//                   textAlign: "center",
//                   fontSize: "14px",
//                   fontWeight: "400",
//                   py: 6,
//                   fontFamily: "Arial, sans-serif",
//                   color: "#666666",
//                 }}
//               >
//                 Click `Run Report` to generate your Profit & Loss statement
//               </Box>
//             ) : (
//               // Show traditional P&L format
//               <>
//                 {Object.keys(profitLossData).length === 0 ? (
//                   <Box
//                     sx={{
//                       textAlign: "center",
//                       fontSize: "14px",
//                       fontWeight: "400",
//                       py: 3,
//                       fontFamily: "Arial, sans-serif",
//                     }}
//                   >
//                     There are no transactions during the selected date range.
//                   </Box>
//                 ) : (
//                   <>
//                     {/* Operating Income Section */}
//                     <PLAccountRow
//                       name="Operating Income"
//                       amount={0}
//                       onExpand={() => toggleSection('operatingIncome')}
//                       isExpanded={expandedSections.operatingIncome}
//                       showCOABreakdown={true}
//                       coaData={profitLossData.invoices?.coa_accounts}
//                       navigationType="invoices"
//                     />
                    
//                     <PLAccountRow
//                       name="Total for Operating Income"
//                       amount={operatingIncome}
//                       isTotal={true}
//                     />

//                     {/* Cost of Goods Sold Section */}
//                     <PLAccountRow
//                       name="Cost of Goods Sold"
//                       amount={0}
//                       onExpand={() => toggleSection('costOfGoodsSold')}
//                       isExpanded={expandedSections.costOfGoodsSold}
//                       showCOABreakdown={true}
//                       coaData={profitLossData.bills?.coa_accounts}
//                       navigationType="bills"
//                     />
                    
//                     <PLAccountRow
//                       name="Total for Cost of Goods Sold"
//                       amount={costOfGoodsSold}
//                       isTotal={true}
//                     />

//                     {/* Gross Profit */}
//                     <PLAccountRow
//                       name="Gross Profit"
//                       amount={grossProfit}
//                       isTotal={true}
//                     />

//                     {/* Operating Expense Section */}
//                     <PLAccountRow
//                       name="Operating Expense"
//                       amount={0}
//                       onExpand={() => toggleSection('operatingExpense')}
//                       isExpanded={expandedSections.operatingExpense}
//                     />
                    
//                     <PLAccountRow
//                       name="Total for Operating Expense"
//                       amount={operatingExpense}
//                       isTotal={true}
//                     />

//                     {/* Operating Profit */}
//                     <PLAccountRow
//                       name="Operating Profit"
//                       amount={operatingProfit}
//                       isTotal={true}
//                     />

//                     {/* Non Operating Income Section */}
//                     <PLAccountRow
//                       name="Non Operating Income"
//                       amount={0}
//                       onExpand={() => toggleSection('nonOperatingIncome')}
//                       isExpanded={expandedSections.nonOperatingIncome}
//                     />
                    
//                     <PLAccountRow
//                       name="Total for Non Operating Income"
//                       amount={nonOperatingIncome}
//                       isTotal={true}
//                     />

//                     {/* Non Operating Expense Section */}
//                     <PLAccountRow
//                       name="Non Operating Expense"
//                       amount={0}
//                       onExpand={() => toggleSection('nonOperatingExpense')}
//                       isExpanded={expandedSections.nonOperatingExpense}
//                     />
                    
//                     <PLAccountRow
//                       name="Total for Non Operating Expense"
//                       amount={nonOperatingExpense}
//                       isTotal={true}
//                     />

//                     {/* Net Profit/Loss */}
//                     <Box
//                       sx={{
//                         bgcolor: netProfitLoss >= 0 ? "#e8f5e8" : "#ffeaea",
//                         borderRadius: "4px",
//                         mt: 2,
//                       }}
//                     >
//                       <PLAccountRow
//                         name="Net Profit/Loss"
//                         amount={netProfitLoss}
//                         isTotal={true}
//                       />
//                     </Box>

//                     {/* Summary Section */}
//                     <Box sx={{ mt: 4, p: 3, bgcolor: "#f8f9fa", borderRadius: "8px" }}>
//                       <Typography
//                         sx={{
//                           fontSize: "16px",
//                           fontWeight: "600",
//                           color: "#000000",
//                           fontFamily: "Arial, sans-serif",
//                           mb: 2,
//                           textAlign: "center",
//                         }}
//                       >
//                         Summary
//                       </Typography>
                      
//                       <Box sx={{ display: "flex", justifyContent: "space-around", gap: 2 }}>
//                         <Box sx={{ textAlign: "center" }}>
//                           <Typography
//                             sx={{
//                               fontSize: "12px",
//                               fontWeight: "600",
//                               color: "#1976d2",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             INVOICES
//                           </Typography>
//                           <Typography
//                             sx={{
//                               fontSize: "14px",
//                               fontWeight: "600",
//                               color: "#1976d2",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             {profitLossData.invoices?.count || 0}
//                           </Typography>
//                           <Typography
//                             sx={{
//                               fontSize: "12px",
//                               color: "#666666",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             ₹{formatAmount(operatingIncome)}
//                           </Typography>
//                         </Box>

//                         <Box sx={{ textAlign: "center" }}>
//                           <Typography
//                             sx={{
//                               fontSize: "12px",
//                               fontWeight: "600",
//                               color: "#f57c00",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             BILLS
//                           </Typography>
//                           <Typography
//                             sx={{
//                               fontSize: "14px",
//                               fontWeight: "600",
//                               color: "#f57c00",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             {profitLossData.bills?.count || 0}
//                           </Typography>
//                           <Typography
//                             sx={{
//                               fontSize: "12px",
//                               color: "#666666",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             ₹{formatAmount(costOfGoodsSold)}
//                           </Typography>
//                         </Box>

//                         <Box sx={{ textAlign: "center" }}>
//                           <Typography
//                             sx={{
//                               fontSize: "12px",
//                               fontWeight: "600",
//                               color: netProfitLoss >= 0 ? "#388e3c" : "#d32f2f",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             {netProfitLoss >= 0 ? "PROFIT" : "LOSS"}
//                           </Typography>
//                           <Typography
//                             sx={{
//                               fontSize: "14px",
//                               fontWeight: "600",
//                               color: netProfitLoss >= 0 ? "#388e3c" : "#d32f2f",
//                               fontFamily: "Arial, sans-serif",
//                             }}
//                           >
//                             ₹{formatAmount(Math.abs(netProfitLoss))}
//                           </Typography>
//                           <Typography
//                             sx={{
//                               fontSize: "11px",
//                               color: "#666666",
//                               fontFamily: "Arial, sans-serif",
//                               fontStyle: "italic",
//                             }}
//                           >
//                             Revenue - Expenses
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Box>
//                   </>
//                 )}
//               </>
//             )}

//             {/* Footer */}
//             <Box
//               sx={{
//                 px: 3,
//                 pt: 4,
//                 pb: 7,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: "12px",
//                   fontWeight: "400",
//                   fontFamily: "Arial, sans-serif",
//                   color: "#666666",
//                 }}
//               >
//                 **Amount is displayed in your base currency
//               </Typography>
//               <Box
//                 sx={{
//                   width: "40px",
//                   color: "white",
//                   bgcolor: "#388a10",
//                   fontSize: "10px",
//                   fontWeight: "600",
//                   ml: 1,
//                   p: 0.5,
//                   textAlign: "center",
//                   borderRadius: "2px",
//                 }}
//               >
//                 INR
//               </Box>
//             </Box>

//             {/* Date Range Display for PDF */}
//             {profitLossData.dateRange && (
//               <Box sx={{ textAlign: "center", pb: 2 }}>
//                 <Typography
//                   sx={{
//                     fontSize: "11px",
//                     color: "#999999",
//                     fontFamily: "Arial, sans-serif",
//                   }}
//                 >
//                   Report generated for: {profitLossData.dateRange.from} to {profitLossData.dateRange.to}
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ProfitAndLoss;



"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Button,
  IconButton,
  Menu,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import ShareIcon from "@mui/icons-material/Share";
import { MenuIcon, Settings2 } from "lucide-react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";
// Import your Account Transactions component
import AccountTransactions from "./ProfitandLossIndividual"; // Adjust the path as needed

const ProfitAndLoss = () => {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportMenuOpen = Boolean(exportAnchorEl);
  const [dateValue, setDateValue] = useState("This Month");
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const dateMenuOpen = Boolean(dateAnchorEl);
  const [reportBasis, setReportBasis] = useState("Cash");
  const [reportBasisAnchorEl, setReportBasisAnchorEl] = useState(null);
  const reportBasisMenuOpen = Boolean(reportBasisAnchorEl);
  const [profitLossData, setProfitLossData] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [organizationData, setOrganizationData] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // New state for navigation
  const [showAccountTransactions, setShowAccountTransactions] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // New state for expanding COA details
  const [expandedSections, setExpandedSections] = useState({
    operatingIncome: false,
    costOfGoodsSold: false,
    operatingExpense: false,
    nonOperatingIncome: false,
    nonOperatingExpense: false,
  });

  const fetchProfitLossData = async () => {
    const organization_id = localStorage.getItem("organization_id");
    setLoading(true);

    try {
      // Convert date format from DD-MM-YYYY to YYYY-MM-DD for API
      let apiFromDate, apiToDate;
      
      // Check if dates are valid and convert properly
      if (fromDate && dayjs(fromDate, "DD-MM-YYYY", true).isValid()) {
        apiFromDate = dayjs(fromDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      } else {
        // Fallback to current month start if invalid
        apiFromDate = dayjs().startOf("month").format("YYYY-MM-DD");
      }
      
      if (toDate && dayjs(toDate, "DD-MM-YYYY", true).isValid()) {
        apiToDate = dayjs(toDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      } else {
        // Fallback to current month end if invalid
        apiToDate = dayjs().endOf("month").format("YYYY-MM-DD");
      }

      console.log("Date conversion:", { fromDate, toDate, apiFromDate, apiToDate });

      const response = await apiService({
        method: "GET",
        url: `api/v1/reports/profit-loss/bill-invoice?organization_id=${organization_id}&from=${apiFromDate}&to=${apiToDate}`,
        customBaseUrl: config.apiBaseUrl,
      });

      console.log("The P&L Bill/Invoice/Expense Data:", response);
      
      // Check if response has any meaningful data
      const responseData = response.data.data || {};
      setProfitLossData(responseData);
      
      // Always set showDetails to true after API call completes (even if empty data)
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching P&L data:", error);
      setProfitLossData({});
      // Still show details even on error to display empty state
      setShowDetails(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganization = async () => {
    const org_id = localStorage.getItem("organization_id");

    try {
      const response = await apiService({
        method: "GET",
        url: `api/v1/organization/${org_id}`,
        customBaseUrl: config.apiBaseUrl,
      });

      console.log("The Organization Data:", response.data.data);
      setOrganizationData(response.data.data);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  useEffect(() => {
    const today = dayjs();
    let from, to;

    from = today.startOf("month");
    to = today.endOf("month");

    // Set dates with proper validation
    const formattedFromDate = from.format("DD-MM-YYYY");
    const formattedToDate = to.format("DD-MM-YYYY");
    
    setFromDate(formattedFromDate);
    setToDate(formattedToDate);

    console.log("Initial dates set:", { 
      from: formattedFromDate, 
      to: formattedToDate,
      fromObj: from.toDate(),
      toObj: to.toDate()
    });

    fetchOrganization();
    // Remove auto-load data on mount - only load after Run Report is clicked
  }, []);

  // Remove auto-refresh when date filters change
  // useEffect(() => {
  //   if (fromDate && toDate && showDetails) {
  //     fetchProfitLossData();
  //   }
  // }, [fromDate, toDate]);

  const handleDateRangeSelection = (label) => {
    const today = dayjs();
    let from, to;

    switch (label) {
      case "Today":
        from = to = today;
        break;
      case "Yesterday":
        from = to = today.subtract(1, "day");
        break;
      case "This Week":
        from = today.startOf("week");
        to = today.endOf("week");
        break;
      case "Previous Week":
        from = today.subtract(1, "week").startOf("week");
        to = today.subtract(1, "week").endOf("week");
        break;
      case "This Month":
        from = today.startOf("month");
        to = today.endOf("month");
        break;
      case "Previous Month":
        from = today.subtract(1, "month").startOf("month");
        to = today.subtract(1, "month").endOf("month");
        break;
      case "This Quarter": {
        const quarter = Math.floor(today.month() / 3);
        from = dayjs(new Date(today.year(), quarter * 3, 1));
        to = from.endOf("quarter");
        break;
      }
      case "Previous Quarter": {
        const quarter = Math.floor(today.month() / 3) - 1;
        const year = quarter < 0 ? today.year() - 1 : today.year();
        const adjustedQuarter = (quarter + 4) % 4;
        from = dayjs(new Date(year, adjustedQuarter * 3, 1));
        to = from.endOf("quarter");
        break;
      }
      case "This Year":
        from = today.startOf("year");
        to = today.endOf("year");
        break;
      case "Previous Year":
        from = today.subtract(1, "year").startOf("year");
        to = today.subtract(1, "year").endOf("year");
        break;
      default:
        // Default to current month if unknown label
        from = today.startOf("month");
        to = today.endOf("month");
    }

    // Ensure we have valid dayjs objects and format them properly
    const formattedFromDate = from && from.isValid() ? from.format("DD-MM-YYYY") : today.startOf("month").format("DD-MM-YYYY");
    const formattedToDate = to && to.isValid() ? to.format("DD-MM-YYYY") : today.endOf("month").format("DD-MM-YYYY");

    setFromDate(formattedFromDate);
    setToDate(formattedToDate);

    console.log("Date range selected:", { 
      label, 
      from: formattedFromDate, 
      to: formattedToDate 
    });
  };

  const handleClose = () => {
    setDateAnchorEl(null);
    setExportAnchorEl(null);
    setReportBasisAnchorEl(null);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleRunReport = () => {
    // Reset showDetails to false first to show loading state
    setShowDetails(false);
    fetchProfitLossData();
  };

  // Function to handle account row clicks
  const handleAccountClick = (accountName, accountType) => {
    setSelectedAccount({ name: accountName, type: accountType });
    setShowAccountTransactions(true);
  };

  // Function to go back to P&L
  const handleBackToPL = () => {
    setShowAccountTransactions(false);
    setSelectedAccount(null);
  };

  // Function to toggle COA sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Navigation function for COA accounts
  const handleCOANavigation = (type) => {
    if (type === 'invoices') {
      window.location.href = '/sales/invoices';
    } else if (type === 'bills') {
      window.location.href = '/purchases/bills';
    } else if (type === 'expenses') {
      window.location.href = '/purchase/expense';
    }
  };

  const generatePdfSimple = () => {
    setTimeout(() => {
      try {
        const element = document.getElementById("pdf-print");

        if (!element) {
          console.error("P&L Report PDF element not found");
          return;
        }

        const options = {
          filename: `Profit-Loss-Report-${new Date().toISOString().split("T")[0]}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          margin: [10, 10, 10, 10],
        };

        html2pdf()
          .from(element)
          .set(options)
          .save()
          .then(() => {
            console.log("P&L Report PDF generated successfully");
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
          });
      } catch (error) {
        console.error("Error in PDF generation:", error);
      }
    }, 500);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const AmountDisplay = ({ amount }) => (
    <Typography
      sx={{
        fontSize: "14px",
        fontWeight: "400",
        color: "#000000",
        textAlign: "right",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {formatAmount(amount)}
    </Typography>
  );

  const PLAccountRow = ({ 
    name, 
    amount, 
    accountCode = "", 
    isSubItem = false, 
    isTotal = false,
    onExpand = null,
    isExpanded = false,
    onClick = null,
    showCOABreakdown = false,
    coaData = null,
    navigationType = null
  }) => {
    const isClickable = onClick !== null;

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            px: 2,
            pl: isSubItem ? 4 : 2,
            bgcolor: isTotal ? "#f9f9f9" : "transparent",
            borderBottom: "1px solid #f0f0f0",
            cursor: (isClickable || onExpand) ? "pointer" : "default",
            "&:hover": (isClickable || onExpand) ? {
              backgroundColor: "#f5f5f5",
            } : {},
          }}
          onClick={onExpand || onClick}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: isTotal ? "600" : "400",
                color: "#000000",
                fontFamily: "Arial, sans-serif",
                textDecoration: isClickable ? "underline" : "none",
              }}
            >
              {name}
            </Typography>
            {accountCode && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#666666",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {accountCode}
              </Typography>
            )}
            {onExpand && (
              <IconButton size="small">
                {isExpanded ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}
              </IconButton>
            )}
          </Box>
          <AmountDisplay amount={amount} />
        </Box>

        {/* COA Breakdown Collapse */}
        {showCOABreakdown && coaData && (
          <Collapse in={isExpanded}>
            <Box sx={{ bgcolor: "#fafafa", py: 1 }}>
              <Box 
                sx={{ 
                  px: 4, 
                  py: 0.5,
                  cursor: navigationType ? "pointer" : "default",
                  "&:hover": navigationType ? {
                    backgroundColor: "#e3f2fd",
                  } : {}
                }}
                onClick={() => navigationType && handleCOANavigation(navigationType)}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: navigationType ? "#1976d2" : "#666666",
                    fontFamily: "Arial, sans-serif",
                    textDecoration: navigationType ? "underline" : "none",
                  }}
                >
                  {navigationType ? "→ View detailed transactions" : "Account breakdown"}
                </Typography>
              </Box>
              {Object.entries(coaData).map(([accountId, accountData]) => {
                // Filter out AC_051 account
                if (accountId === "AC_051") return null;
                
                return (
                  <Box
                    key={accountId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 0.5,
                      px: 4,
                      borderLeft: "3px solid #e3f2fd",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "#424242",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {accountData.account_name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#666666",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        Transactions: {accountData.transaction_count}
                      </Typography>
                    </Box>
                    <AmountDisplay amount={accountData.total_amount} />
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        )}
      </>
    );
  };

  // Calculate derived values with expenses
  const operatingIncome = profitLossData.invoices?.netAmount || 0;
  const costOfGoodsSold = profitLossData.bills?.netAmount || 0;
  const grossProfit = operatingIncome - costOfGoodsSold;
  const operatingExpense = profitLossData.expenses?.netAmount || 0; // Updated to use expenses data
  const operatingProfit = grossProfit - operatingExpense;
  const nonOperatingIncome = 0; // You can add this from your data if available
  const nonOperatingExpense = 0; // You can add this from your data if available
  const netProfitLoss = operatingProfit + nonOperatingIncome - nonOperatingExpense;

  // Conditional rendering - show Account Transactions or P&L
  if (showAccountTransactions) {
    return (
      <Box>
        {/* Header with back button */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Button
            onClick={handleBackToPL}
            sx={{ mb: 2 }}
            variant="outlined"
            size="small"
          >
            ← Back to Profit & Loss
          </Button>
          <Typography variant="h6">
            Account Transactions - {selectedAccount?.name}
          </Typography>
        </Box>
        <AccountTransactions />
      </Box>
    );
  }

  return (
    //The Main Box
    <Box>
      {/*The Sticky Box*/}
      <Box sx={{ position: "sticky", top: 0, bgcolor: "white", zIndex: 9 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            justifyContent: "space-between",
          }}
        >
          {/*Left Box*/}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e9e9e9",
                padding: "4px",
                borderRadius: "6px",
                width: "30px",
                height: "30px",
              }}
            >
              <IconButton size="small" sx={{ color: "#333", padding: "2px" }}>
                <MenuIcon fontSize="small" sx={{ fontsize: "8px" }} />
              </IconButton>
            </Box>
            <Box>
              <Box>
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "500", color: "#4C526C" }}
                >
                  Accountant
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                    Profit and Loss
                  </Typography>
                  <Typography
                    sx={{ ml: 1, fontSize: "12px", fontWeight: "400" }}
                  >
                    {" "}
                    • From {fromDate} To {toDate}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/*Right Box*/}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton size="small">
              <Settings2 sx={{ fontSize: "16px" }} height="20px" />
            </IconButton>

            <Box
              display="flex"
              alignItems="center"
              border={1}
              borderColor="grey.400"
              borderRadius={1}
              overflow="hidden"
              width="fit-content"
              sx={{ borderRadius: "6px" }}
            >
              <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
                <IconButton size="small">
                  <ReplayIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>

              <Box width="1px" height="24px" bgcolor="grey.400" />

              <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
                <IconButton size="small">
                  <ShareIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>
            </Box>

            <Button
              variant="outlined"
              size="small"
              sx={{
                bgcolor: "#f5f5f5",
                fontSize: "13px",
                fontWeight: "400",
                color: "black",
                borderColor: "#dddddd",
              }}
              onClick={handleExportClick}
            >
              Export
            </Button>

            {/*Export Menu*/}
            <Menu
              anchorEl={exportAnchorEl}
              open={exportMenuOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                borderRadius: "6px",
              }}
            >
              <Box
                sx={{
                  color: "#838195",
                  fontSize: "12px",
                  fontWeight: "600",
                  p: 1,
                  width: "200px",
                }}
              >
                EXPORT AS
              </Box>
              <MenuItem
                sx={{
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#187c19",
                    color: "white",
                  },
                }}
                onClick={() => {
                  generatePdfSimple();
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight: 400,
                  }}
                  primary="PDF"
                />
              </MenuItem>
            </Menu>

            <IconButton
              size="small"
              sx={{
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Divider />
      </Box>

      {/*The Filters*/}
      <Box sx={{ borderBottom: "1px solid #dddddd", boxShadow: 6 }}>
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <FilterAltOutlinedIcon sx={{ fontSize: "20px", color: "#495569" }} />
          <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
            Filters :
          </Typography>

          {/*Date Range*/}
          <Box
            sx={{
              display: "flex",
              border: "1px solid #dddddd",
              borderRadius: "6px",
              py: 0.5,
              px: 1,
              bgcolor: "#f6f6fa",
              ml: 1,
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
              Date Range :
            </Typography>
            <Box
              sx={{
                ml: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                fontWeight: "400",
              }}
              onClick={(event) => {
                setDateAnchorEl(event.currentTarget);
              }}
            >
              {dateValue}
              {dateAnchorEl ? (
                <KeyboardArrowUpOutlinedIcon sx={{ fontSize: "20px" }} />
              ) : (
                <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px" }} />
              )}
            </Box>
          </Box>

          {/*Date Range Popup*/}
          <Menu
            anchorEl={dateAnchorEl}
            open={dateMenuOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            sx={{
              borderRadius: "6px",
              mt: 1,
            }}
          >
            {[
              "Today",
              "This Week",
              "This Month",
              "This Quarter",
              "This Year",
              "Yesterday",
              "Previous Week",
              "Previous Month",
              "Previous Quarter",
              "Previous Year",
            ].map((label) => (
              <MenuItem
                key={label}
                onClick={() => {
                  handleDateRangeSelection(label);
                  setDateValue(label);
                  handleClose();
                }}
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  borderRadius: "6px",
                  width: "180px",
                }}
              >
                {label}
              </MenuItem>
            ))}
          </Menu>

          {/*Filter Accrual*/}
          <Box
            sx={{
              display: "flex",
              border: "1px solid #dddddd",
              borderRadius: "6px",
              py: 0.5,
              px: 1,
              bgcolor: "#f6f6fa",
              ml: 1,
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
              Report Basis :
            </Typography>
            <Box
              sx={{
                ml: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                fontWeight: "400",
              }}
              onClick={(event) => {
                setReportBasisAnchorEl(event.currentTarget);
              }}
            >
              {reportBasis}
              {reportBasisAnchorEl ? (
                <KeyboardArrowUpOutlinedIcon sx={{ fontSize: "20px" }} />
              ) : (
                <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px" }} />
              )}
            </Box>

            {/*Dropdown For Report Basis*/}
            <Menu
              anchorEl={reportBasisAnchorEl}
              open={reportBasisMenuOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                borderRadius: "6px",
                mt: 1,
              }}
            >
              <MenuItem
                onClick={() => {
                  setReportBasis("Accrual");
                  handleClose();
                }}
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  borderRadius: "6px",
                  width: "180px",
                }}
              >
                Accrual
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setReportBasis("Cash");
                  handleClose();
                }}
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  borderRadius: "6px",
                  width: "180px",
                }}
              >
                Cash
              </MenuItem>
            </Menu>
          </Box>

          <Button
            variant="contained"
            size="small"
            sx={{ ml: 3, borderRadius: "6px", zIndex: 0 }}
            onClick={handleRunReport}
            disabled={loading}
          >
            {loading ? "Loading..." : "Run Report"}
          </Button>
        </Box>
      </Box>

      {/*The Main Content - Standard P&L Format*/}
      <Box
        sx={{
          bgcolor: "#f4f4f9",
          p: 4,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          id="pdf-print"
          sx={{
            bgcolor: "white",
            borderRadius: "6px",
            width: "100%",
            minWidth: "700px",
          }}
        >
          <Box
            sx={{ width: "80%", margin: "0 auto", justifyContent: "center" }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#666666",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {organizationData?.organization_name?.toUpperCase() || "IHUB"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "600",
                  my: 1,
                  color: "#000000",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Profit and Loss
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#666666",
                  mb: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Basis : {reportBasis}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#666666",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                From {fromDate} To {toDate}
              </Typography>
            </Box>

            {/* Table Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                px: 2,
                bgcolor: "#f5f5f5",
                borderTop: "1px solid #e0e0e0",
                borderBottom: "1px solid #e0e0e0",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#000000",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ACCOUNT
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#000000",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                ACCOUNT CODE
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#000000",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                TOTAL
              </Typography>
            </Box>

            {/* Content - Show data only after Run Report is clicked */}
            {!showDetails ? (
              // Show message when no report is run
              <Box
                sx={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "400",
                  py: 6,
                  fontFamily: "Arial, sans-serif",
                  color: "#666666",
                }}
              >
                {/* Click "Run Report" to generate your Profit & Loss statement */}
              </Box>
            ) : loading ? (
              // Show loading state
              <Box
                sx={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "400",
                  py: 6,
                  fontFamily: "Arial, sans-serif",
                  color: "#666666",
                }}
              >
                Loading your Profit & Loss data...
              </Box>
            ) : Object.keys(profitLossData).length === 0 || 
                (!profitLossData.invoices && !profitLossData.bills && !profitLossData.expenses) ? (
              <Box
                sx={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "400",
                  py: 3,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                There are no transactions during the selected date range.
                <br />
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#999999",
                    fontFamily: "Arial, sans-serif",
                    mt: 1,
                  }}
                >
                  Try selecting a different date range or check if you have any transactions for {dateValue}.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Operating Income Section */}
                <PLAccountRow
                  name="Operating Income"
                  amount={0}
                  onExpand={() => toggleSection('operatingIncome')}
                  isExpanded={expandedSections.operatingIncome}
                  showCOABreakdown={true}
                  coaData={profitLossData.invoices?.coa_accounts}
                  navigationType="invoices"
                />
                
                <PLAccountRow
                  name="Total for Operating Income"
                  amount={operatingIncome}
                  isTotal={true}
                />

                {/* Cost of Goods Sold Section */}
                <PLAccountRow
                  name="Cost of Goods Sold"
                  amount={0}
                  onExpand={() => toggleSection('costOfGoodsSold')}
                  isExpanded={expandedSections.costOfGoodsSold}
                  showCOABreakdown={true}
                  coaData={profitLossData.bills?.coa_accounts}
                  navigationType="bills"
                />
                
                <PLAccountRow
                  name="Total for Cost of Goods Sold"
                  amount={costOfGoodsSold}
                  isTotal={true}
                />

                {/* Gross Profit */}
                <PLAccountRow
                  name="Gross Profit"
                  amount={grossProfit}
                  isTotal={true}
                />

                {/* Operating Expense Section */}
                <PLAccountRow
                  name="Operating Expense"
                  amount={0}
                  onExpand={() => toggleSection('operatingExpense')}
                  isExpanded={expandedSections.operatingExpense}
                  showCOABreakdown={true}
                  coaData={profitLossData.expenses?.coa_accounts}
                  navigationType="expenses"
                />
                
                <PLAccountRow
                  name="Total for Operating Expense"
                  amount={operatingExpense}
                  isTotal={true}
                />

                {/* Operating Profit */}
                <PLAccountRow
                  name="Operating Profit"
                  amount={operatingProfit}
                  isTotal={true}
                />

                {/* Non Operating Income Section */}
                <PLAccountRow
                  name="Non Operating Income"
                  amount={0}
                  onExpand={() => toggleSection('nonOperatingIncome')}
                  isExpanded={expandedSections.nonOperatingIncome}
                />
                
                <PLAccountRow
                  name="Total for Non Operating Income"
                  amount={nonOperatingIncome}
                  isTotal={true}
                />

                {/* Non Operating Expense Section */}
                <PLAccountRow
                  name="Non Operating Expense"
                  amount={0}
                  onExpand={() => toggleSection('nonOperatingExpense')}
                  isExpanded={expandedSections.nonOperatingExpense}
                />
                
                <PLAccountRow
                  name="Total for Non Operating Expense"
                  amount={nonOperatingExpense}
                  isTotal={true}
                />

                {/* Net Profit/Loss */}
                <Box
                  sx={{
                    bgcolor: netProfitLoss >= 0 ? "#e8f5e8" : "#ffeaea",
                    borderRadius: "4px",
                    mt: 2,
                  }}
                >
                  <PLAccountRow
                    name="Net Profit/Loss"
                    amount={netProfitLoss}
                    isTotal={true}
                  />
                </Box>

                {/* Enhanced Summary Section with Expenses */}
                <Box sx={{ mt: 4, p: 3, bgcolor: "#f8f9fa", borderRadius: "8px" }}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#000000",
                      fontFamily: "Arial, sans-serif",
                      mb: 2,
                      textAlign: "center",
                    }}
                  >
                    Summary
                  </Typography>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-around", gap: 2 }}>
                    {/* Invoices Card */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#1976d2",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        INVOICES
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1976d2",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {profitLossData.invoices?.count || 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#666666",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        ₹{formatAmount(operatingIncome)}
                      </Typography>
                    </Box>

                    {/* Bills Card */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#f57c00",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        BILLS
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#f57c00",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {profitLossData.bills?.count || 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#666666",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        ₹{formatAmount(costOfGoodsSold)}
                      </Typography>
                    </Box>

                    {/* Expenses Card - NEW */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#9c27b0",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        EXPENSES
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#9c27b0",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {profitLossData.expenses?.count || 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#666666",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        ₹{formatAmount(operatingExpense)}
                      </Typography>
                    </Box>

                    {/* Profit/Loss Card */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: netProfitLoss >= 0 ? "#388e3c" : "#d32f2f",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {netProfitLoss >= 0 ? "PROFIT" : "LOSS"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: netProfitLoss >= 0 ? "#388e3c" : "#d32f2f",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        ₹{formatAmount(Math.abs(netProfitLoss))}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#666666",
                          fontFamily: "Arial, sans-serif",
                          fontStyle: "italic",
                        }}
                      >
                        Revenue - COGS - Expenses
                      </Typography>
                    </Box>
                  </Box>

                  {/* Calculation Breakdown */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: "#ffffff", borderRadius: "4px", border: "1px solid #e0e0e0" }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#666666",
                        fontFamily: "Arial, sans-serif",
                        mb: 1,
                      }}
                    >
                      CALCULATION BREAKDOWN:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#424242",
                        fontFamily: "Arial, sans-serif",
                        lineHeight: 1.5,
                      }}
                    >
                      Operating Income: ₹{formatAmount(operatingIncome)}<br/>
                      - Cost of Goods Sold: ₹{formatAmount(costOfGoodsSold)}<br/>
                      = Gross Profit: ₹{formatAmount(grossProfit)}<br/>
                      - Operating Expenses: ₹{formatAmount(operatingExpense)}<br/>
                      = <strong>Net Profit/Loss: ₹{formatAmount(Math.abs(netProfitLoss))} {netProfitLoss >= 0 ? "(Profit)" : "(Loss)"}</strong>
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {/* Footer */}
            <Box
              sx={{
                px: 3,
                pt: 4,
                pb: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "400",
                  fontFamily: "Arial, sans-serif",
                  color: "#666666",
                }}
              >
                **Amount is displayed in your base currency
              </Typography>
              <Box
                sx={{
                  width: "40px",
                  color: "white",
                  bgcolor: "#388a10",
                  fontSize: "10px",
                  fontWeight: "600",
                  ml: 1,
                  p: 0.5,
                  textAlign: "center",
                  borderRadius: "2px",
                }}
              >
                INR
              </Box>
            </Box>

            {/* Date Range Display for PDF */}
            {profitLossData.dateRange && (
              <Box sx={{ textAlign: "center", pb: 2 }}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#999999",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Report generated for: {profitLossData.dateRange.from} to {profitLossData.dateRange.to}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfitAndLoss;