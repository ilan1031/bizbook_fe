// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Select,
//   MenuItem,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Menu,
//   ListItemIcon,
//   ListItemText,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ReplayIcon from "@mui/icons-material/Replay";
// import ShareIcon from "@mui/icons-material/Share";
// import CloseIcon from "@mui/icons-material/Close";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import TableViewIcon from "@mui/icons-material/TableView";
// import PrintIcon from "@mui/icons-material/Print";
// import { Bold, MenuIcon, Settings2 } from "lucide-react";
// import apiService from "../../../services/axiosService";
// import config from "../../../services/config";

// export default function ProfitLossStatement() {
//   const [dateRange, setDateRange] = useState("This Month");
//   const [reportBasis, setReportBasis] = useState("Accrual");
//   const [compareWith, setCompareWith] = useState("None");
//   const [filterAccounts, setFilterAccounts] = useState(
//     "Accounts Without Zero Balance"
//   );
//   const [exportAnchorEl, setExportAnchorEl] = useState(null);
//   const exportMenuOpen = Boolean(exportAnchorEl);
//   // const [jsPDF, setJsPDF] = useState(null);
//   const [billsData, setBillsData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dateRangeText, setDateRangeText] = useState("");
//   const [orgId, setOrgId] = useState("100000");

//   // Load jsPDF dynamically
//   // useEffect(() => {
//   //   const loadJsPDF = async () => {
//   //     try {
//   //       const { jsPDF: JsPDFClass } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
//   //       setJsPDF(() => JsPDFClass);
//   //     } catch (error) {
//   //       console.error('Failed to load jsPDF:', error);
//   //     }
//   //   };
//   //   loadJsPDF();
//   // }, []);

//   // Get org_id from localStorage on component mount
//   useEffect(() => {
//     const storedOrgId = localStorage.getItem('org_id') || '100000';
//     setOrgId(storedOrgId);
//   }, []);

//   // Fetch bills data when component mounts or date range changes
//   useEffect(() => {
//     fetchBillsData();
//   }, [dateRange, orgId]);

//   // Helper function to get date range
//   const getDateRange = () => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     let startDate, endDate;

//     switch (dateRange) {
//       case "Today":
//         startDate = new Date(today);
//         endDate = new Date(today);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "This Week":
//         const startOfWeek = new Date(today);
//         startOfWeek.setDate(today.getDate() - today.getDay());
//         startDate = startOfWeek;
//         endDate = new Date(startOfWeek);
//         endDate.setDate(startOfWeek.getDate() + 6);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "This Month":
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//         endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "This Quarter":
//         const quarter = Math.floor(now.getMonth() / 3);
//         startDate = new Date(now.getFullYear(), quarter * 3, 1);
//         endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "Year To Date":
//         startDate = new Date(now.getFullYear(), 0, 1);
//         endDate = new Date(today);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "Yesterday":
//         startDate = new Date(today);
//         startDate.setDate(today.getDate() - 1);
//         endDate = new Date(startDate);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "Previous Week":
//         const prevWeekStart = new Date(today);
//         prevWeekStart.setDate(today.getDate() - today.getDay() - 7);
//         startDate = prevWeekStart;
//         endDate = new Date(prevWeekStart);
//         endDate.setDate(prevWeekStart.getDate() + 6);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "Previous Month":
//         startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         endDate = new Date(now.getFullYear(), now.getMonth(), 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "Previous Quarter":
//         const prevQuarter = Math.floor(now.getMonth() / 3) - 1;
//         const year = prevQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
//         const quarter_num = prevQuarter < 0 ? 3 : prevQuarter;
//         startDate = new Date(year, quarter_num * 3, 1);
//         endDate = new Date(year, quarter_num * 3 + 3, 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case "Previous Year":
//         startDate = new Date(now.getFullYear() - 1, 0, 1);
//         endDate = new Date(now.getFullYear() - 1, 11, 31);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       default:
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//         endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//         endDate.setHours(23, 59, 59, 999);
//     }

//     return { startDate, endDate };
//   };

//   // Format date for display
//   const formatDateForDisplay = (date) => {
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }).replace(/\//g, '/');
//   };

//   // Fetch bills data from API
//  const fetchBillsData = async () => {
//   setLoading(true);
//   setError(null);

//   try {
//     const { startDate, endDate } = getDateRange();
//     const organisation_id = localStorage.getItem("organization_id") || "1";

//     // Format date range text for UI
//     setDateRangeText(
//       `From ${formatDateForDisplay(startDate)} To ${formatDateForDisplay(endDate)}`
//     );

//     // Convert dates to ISO string for API
//     const startDateISO = startDate.toISOString();
//     const endDateISO = endDate.toISOString();

//     // Make the API request using apiService (assumed to be Axios)
//     const response = await apiService({
//       method: "GET",
//       url: `api/v1/bills/get-bills`,
//       customBaseUrl: config.PO_Base_url,
//       params: {
//         org_id: organisation_id,
//         start_date: startDateISO,
//         end_date: endDateISO,
//       },
//     });

//     // Axios automatically parses JSON, no need for .json()
//     const bills = response.data?.data || response.data; // Adjust based on actual API response structure

//     // Update state with fetched data
//     setBillsData(bills);
//   } catch (err) {
//     setError(`Failed to fetch bills data: ${err.message}`);
//     console.error("Error fetching bills:", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   // Calculate totals from bills data
//   const calculateTotals = () => {
//     if (!billsData.length) {
//       return {
//         totalAmount: 0,
//         totalDiscount: 0,
//         costOfGoodsSold: 0,
//         grossProfit: 0,
//         operatingExpense: 0,
//         operatingProfit: 0,
//         netProfit: 0
//       };
//     }

//     const totalAmount = billsData.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
//     const totalDiscount = billsData.reduce((sum, bill) => sum + (parseFloat(bill.discount) || 0), 0);

//     const costOfGoodsSold = totalAmount;
//     const grossProfit = -costOfGoodsSold; // Negative because it's an expense
//     const operatingExpense = totalDiscount;
//     const operatingProfit = totalAmount - totalDiscount;
//     const netProfit = totalAmount - totalDiscount;

//     return {
//       totalAmount,
//       totalDiscount,
//       costOfGoodsSold,
//       grossProfit,
//       operatingExpense,
//       operatingProfit,
//       netProfit
//     };
//   };

//   const totals = calculateTotals();

//  // Number formatting function
//   const formatAmount = (amount) => {
//     if (amount === 0 || amount === "0.00") return "0.00";
//     return new Intl.NumberFormat('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(Math.abs(amount));
//   };

//   // Generate Profit Loss Data with formatted values
//   const profitLossData = [
//     { account: "Operating Income", code: "", total: "", isHeader: true },
//     {
//       account: "Total for Operating Income",
//       code: "",
//       total: "0.00",
//       isTotal: true,
//     },
//     { account: "Cost of Goods Sold", code: "", total: "", isHeader: true },
//     {
//       account: "Total for Cost of Goods Sold",
//       code: "",
//       total: formatAmount(totals.costOfGoodsSold),
//       isTotal: true,
//     },
//     {
//       account: "Gross Profit",
//       code: "",
//       total: formatAmount(totals.grossProfit),
//       isProfit: true
//     },
//     { account: "Operating Expense", code: "", total: "", isHeader: true },
//     {
//       account: "Total for Operating Expense",
//       code: "",
//       total: formatAmount(totals.operatingExpense),
//       isTotal: true,
//     },
//     {
//       account: "Operating Profit",
//       code: "",
//       total: formatAmount(totals.operatingProfit),
//       isProfit: true
//     },
//     { account: "Non Operating Income", code: "", total: "", isHeader: true },
//     {
//       account: "Total for Non Operating Income",
//       code: "",
//       total: "0.00",
//       isTotal: true,
//     },
//     { account: "Non Operating Expense", code: "", total: "", isHeader: true },
//     {
//       account: "Total for Non Operating Expense",
//       code: "",
//       total: "0.00",
//       isTotal: true,
//     },
//     {
//       account: "Net Profit/Loss",
//       code: "",
//       total: formatAmount(totals.netProfit),
//       isNetProfit: true
//     },
//   ];

//   // Filtered data based on user selections
//   const filteredData = profitLossData.filter((row) => {
//     if (
//       filterAccounts === "Accounts Without Zero Balance" &&
//       row.total === "0.00"
//     ) {
//       return false;
//     }
//     return true;
//   });

//   // Handle export menu
//   const handleExportClick = (event) => {
//     setExportAnchorEl(event.currentTarget);
//   };

//   const handleExportClose = () => {
//     setExportAnchorEl(null);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const csvRows = [];

//     // Add header
//     csvRows.push(["ACCOUNT", "ACCOUNT CODE", "TOTAL"].join(","));

//     // Add rows
//     filteredData.forEach((row) => {
//       csvRows.push([`"${row.account}"`, `"${row.code}"`, `"${row.total}"`].join(","));
//     });

//     // Download CSV
//     const csvString = csvRows.join("\n");
//     const blob = new Blob([csvString], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.setAttribute("hidden", "");
//     a.setAttribute("href", url);
//     a.setAttribute("download", "profit_loss_report.csv");
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     handleExportClose();
//   };

//   // Export to PDF using jsPDF
//   // const exportToPDF = () => {
//   //   if (!jsPDF) {
//   //     alert('PDF library is still loading. Please try again in a moment.');
//   //     return;
//   //   }

//   //   try {
//   //     const doc = new jsPDF();

//   //     // Set document properties
//   //     doc.setProperties({
//   //       title: 'Profit and Loss Statement',
//   //       subject: 'Financial Report',
//   //       author: 'three & co',
//   //       creator: 'Business Application'
//   //     });

//   //     // Company Header
//   //     doc.setFontSize(16);
//   //     doc.setTextColor(100, 100, 100);
//   //     doc.text('three & co', 105, 20, { align: 'center' });

//   //     doc.setFontSize(18);
//   //     doc.setTextColor(0, 0, 0);
//   //     doc.text('Profit and Loss', 105, 30, { align: 'center' });

//   //     doc.setFontSize(12);
//   //     doc.setTextColor(100, 100, 100);
//   //     doc.text(`Basis: ${reportBasis}`, 105, 38, { align: 'center' });
//   //     doc.text('From 01/06/2025 To 30/06/2025', 105, 45, { align: 'center' });
//       // doc.setFontSize(12);
//       // doc.setTextColor(100, 100, 100);
//       // doc.text(`Basis: ${reportBasis}`, 105, 38, { align: 'center' });
//       // doc.text(dateRangeText, 105, 45, { align: 'center' });

//   //     // Table headers
//   //     const startY = 60;
//   //     let currentY = startY;

//   //     // Draw table header
//   //     doc.setFillColor(245, 245, 245);
//   //     doc.rect(20, currentY - 5, 170, 10, 'F');

//   //     doc.setFontSize(10);
//   //     doc.setTextColor(0, 0, 0);
//   //     doc.setFont(undefined, 'bold');
//   //     doc.text('ACCOUNT', 25, currentY);
//   //     doc.text('ACCOUNT CODE', 105, currentY, { align: 'center' });
//   //     doc.text('TOTAL', 185, currentY, { align: 'right' });

//   //     currentY += 15;

//   //     // Draw table rows
//   //     profitLossData.forEach((row, index) => {
//   //       // Check if we need a new page
//   //       if (currentY > 270) {
//   //         doc.addPage();
//   //         currentY = 20;
//   //       }

//   //       // Set font style based on row type
//   //       if (row.isHeader) {
//   //         doc.setFont(undefined, 'bold');
//   //         doc.setTextColor(25, 118, 210); // Blue color for headers
//   //       } else if (row.isTotal || row.isNetProfit) {
//   //         doc.setFont(undefined, 'bold');
//   //         doc.setTextColor(0, 0, 0);
//   //       } else {
//   //         doc.setFont(undefined, 'normal');
//   //         doc.setTextColor(0, 0, 0);
//   //       }

//   //       // Add special line for Net Profit
//   //       if (row.isNetProfit) {
//   //         doc.setLineWidth(0.5);
//   //         doc.line(20, currentY - 3, 190, currentY - 3);
//   //       }

//   //       // Account name (with indentation)
//   //       const indent = row.isHeader ? 25 : 35;
//   //       doc.text(row.account, indent, currentY);

//   //       // Account code
//   //       if (row.code) {
//   //         doc.text(row.code, 105, currentY, { align: 'center' });
//   //       }

//   //       // Total amount
//   //       if (row.total) {
//   //         doc.text(row.total, 185, currentY, { align: 'right' });
//   //       }

//   //       currentY += 8;
//   //     });

//   //     // Add footer note
//   //     currentY += 10;
//   //     doc.setFont(undefined, 'normal');
//   //     doc.setFontSize(8);
//   //     doc.setTextColor(100, 100, 100);
//   //     doc.text('**Amount is displayed in your base currency (INR)', 20, currentY);

//   //     // Save the PDF
//   //     doc.save('profit_loss_report.pdf');

//   //   } catch (error) {
//   //     console.error('Error generating PDF:', error);
//   //     alert('Error generating PDF. Please try again.');
//   //   }

//   //   handleExportClose();
//   // };

//   // Print function
//   const handlePrint = () => {
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Profit and Loss Statement</title>
//         <style>
//           @media print {
//             body { margin: 0; }
//             .no-print { display: none; }
//           }
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           .header { text-align: center; margin-bottom: 30px; }
//           .company-name { font-size: 18px; color: #666; margin-bottom: 5px; }
//           .report-title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
//           .report-details { font-size: 12px; color: #666; margin-bottom: 5px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; border: 1px solid #ddd; }
//           td { padding: 10px; border: 1px solid #ddd; }
//           .header-row { font-weight: bold; color: #1976d2; }
//           .total-row { font-weight: bold; }
//           .net-profit { font-weight: bold; border-top: 2px solid #333; }
//           .currency-note { margin-top: 20px; font-size: 12px; color: #666; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <div class="company-name">three & co</div>
//           <div class="report-title">Profit and Loss</div>
//           <div class="report-details">Basis: ${reportBasis}</div>
//           <div class="report-details">${dateRangeText}</div>
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>ACCOUNT</th>
//               <th style="text-align: center;">ACCOUNT CODE</th>
//               <th style="text-align: right;">TOTAL</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${profitLossData.map(row => `
//               <tr class="${row.isHeader ? 'header-row' : ''} ${row.isTotal ? 'total-row' : ''} ${row.isNetProfit ? 'net-profit' : ''}">
//                 <td style="padding-left: ${row.isHeader ? '16px' : '32px'};">${row.account}</td>
//                 <td style="text-align: center;">${row.code}</td>
//                 <td style="text-align: right;">${row.total}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
//         <div class="currency-note">
//           **Amount is displayed in your base currency (INR)
//         </div>
//       </body>
//       </html>
//     `;

//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(htmlContent);
//     printWindow.document.close();

//     // Wait for content to load then print
//     printWindow.onload = () => {
//       printWindow.print();
//     };

//     handleExportClose();
//   };

//   // Handle close button click
//   const handleClose = () => {
//     console.log("Close button clicked");
//   };

//   // Handle run report
//   const handleRunReport = () => {
//     fetchBillsData();
//   };

//   // Sticky AppBar Styles
//   const appBarStyles = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "8px 24px",
//     backgroundColor: "#ffffff",
//     borderBottom: "1px solid #e0e0e0",
//     position: "sticky",
//     top: 0,
//     zIndex: 100,
//   };

//   return (
//     <Box sx={{ flexGrow: 1, backgroundColor: "#fFFFFF", padding: 1 }}>
//       {/* Sticky App Bar */}
//       <Box sx={appBarStyles}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "#e9e9e9",
//               padding: "4px",
//               borderRadius: "6px",
//             }}
//           >
//             <IconButton size="small" sx={{ color: "#333", padding: "2px" }}>
//               <MenuIcon fontSize="small" sx={{ fontsize: "8px" }}  />
//             </IconButton>
//           </Box>

//           <Box>
//             <Typography
//               variant="body2"
//               sx={{ color: "#333", fontSize: "12px" }}
//             >
//               Business Overview
//             </Typography>

//             <Typography variant="body2">
//               <Box component="span" fontWeight={600} color="#000" fontSize="15px">
//                 Profit and Loss
//               </Box>
//               <Box component="span" color="text.secondary" fontSize="12px">
//                 {" • " + dateRangeText}
//               </Box>
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 1,  }}>
//           <IconButton size="small" >
//             <Settings2 fontSize="small" height="20px" />
//           </IconButton>

//           <Box
//             display="flex"
//             alignItems="center"
//             border={1}
//             borderColor="grey.400"
//             borderRadius={1}
//             overflow="hidden"
//             width="fit-content"
//           >
//             <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
//               <IconButton size="small" onClick={handleRunReport}>
//                 <ReplayIcon fontSize="small" />
//               </IconButton>
//             </Box>

//             <Box width="1px" height="24px" bgcolor="grey.400" />

//             <Box px={1} display="flex" alignItems="center" bgcolor="#f5f5f5">
//               <IconButton size="small">
//                 <ShareIcon fontSize="small" />
//               </IconButton>
//             </Box>
//           </Box>

//           <Button
//             variant="outlined"
//             size="small"
//             onClick={handleExportClick}
//             sx={{
//               bgcolor: "#e0fef",
//               fontSize: "12px",
//               padding: "4px 12px",
//               borderRadius:"4px",
//               "&:hover": { bgcolor: "#e0fef" },
//             }}
//           >
//             Export
//           </Button>

//           {/* Export Menu */}
//           <Menu
//             anchorEl={exportAnchorEl}
//             open={exportMenuOpen}
//             onClose={handleExportClose}
//             anchorOrigin={{
//               vertical: 'bottom',
//               horizontal: 'right',
//             }}
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//           >
//             <MenuItem onClick={exportToCSV}>
//               <ListItemIcon>
//                 <TableViewIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Export as CSV" />
//             </MenuItem>
//             {/* <MenuItem onClick={exportToPDF}>
//               <ListItemIcon>
//                 <PictureAsPdfIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Export as PDF" />
//             </MenuItem> */}
//             <MenuItem onClick={handlePrint}>
//               <ListItemIcon>
//                 <PrintIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Print" />
//             </MenuItem>
//           </Menu>

//           <IconButton
//             size="small"
//             onClick={handleClose}
//             sx={{
//               color: "#d32f2f",
//               "&:hover": {
//                 backgroundColor: "rgba(211, 47, 47, 0.04)"
//               }
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ margin: "16px 24px" }}>
//           {error}
//         </Alert>
//       )}

//       {/* Filters Section */}
//       <Box
//         elevation={1}
//         sx={{ padding: "16px 24px", borderTop: "1px solid #FFFFFF" }}
//       >
//         {/* Primary Filters Row */}
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <Typography
//             variant="body2"
//             sx={{ fontSize: "13px", fontWeight: 500 }}
//           >
//             Filters:
//           </Typography>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Typography variant="body2" sx={{ fontSize: "12px" }}>
//               Date Range:
//             </Typography>
//             <Select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               size="small"
//               sx={{ minWidth: 130, fontSize: "12px" }}
//               MenuProps={{
//                 PaperProps: {
//                   sx: {
//                     maxHeight: 200,
//                   },
//                 },
//               }}
//             >
//               <MenuItem value="Today" sx={{ fontSize: "12px" }}>
//                 Today
//               </MenuItem>
//               <MenuItem value="This Week" sx={{ fontSize: "12px" }}>
//                 This Week
//               </MenuItem>
//               <MenuItem value="This Month" sx={{ fontSize: "12px" }}>
//                 This Month
//               </MenuItem>
//               <MenuItem value="This Quarter" sx={{ fontSize: "12px" }}>
//                 This Quarter
//               </MenuItem>
//               <MenuItem value="Year To Date" sx={{ fontSize: "12px" }}>
//                 Year To Date
//               </MenuItem>
//               <MenuItem value="Yesterday" sx={{ fontSize: "12px" }}>
//                 Yesterday
//               </MenuItem>
//               <MenuItem value="Previous Week" sx={{ fontSize: "12px" }}>
//                 Previous Week
//               </MenuItem>
//               <MenuItem value="Previous Month" sx={{ fontSize: "12px" }}>
//                 Previous Month
//               </MenuItem>
//               <MenuItem value="Previous Quarter" sx={{ fontSize: "12px" }}>
//                 Previous Quarter
//               </MenuItem>
//               <MenuItem value="Previous Year" sx={{ fontSize: "12px" }}>
//                 Previous Year
//               </MenuItem>
//               <MenuItem value="Custom" sx={{ fontSize: "12px" }}>
//                 Custom
//               </MenuItem>
//             </Select>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Typography variant="body2" sx={{ fontSize: "12px" }}>
//               Report Basis:
//             </Typography>
//             <Select
//               value={reportBasis}
//               onChange={(e) => setReportBasis(e.target.value)}
//               size="small"
//               sx={{ minWidth: 80, fontSize: "12px" }}
//             >
//               <MenuItem value="Accrual" sx={{fontSize:"12px"}}>Accrual</MenuItem>
//               <MenuItem value="Cash" sx={{fontSize:"12px"}}>Cash</MenuItem>
//             </Select>
//           </Box>

//           <Button variant="outlined" size="small">
//             More Filters
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             color="primary"
//             onClick={handleRunReport}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={16} /> : "Run Report"}
//           </Button>
//         </Box>
//         <Box
//           sx={{ borderTop: "1px solid #FFFFFF", marginTop: 2, paddingTop: 2 }}
//         ></Box>
//       </Box>

//       {/* Loading indicator */}
//       {loading && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Company Header */}
//       <Box elevation={1} sx={{ padding: "0px 20px", textAlign: "center" }}>
//         <Typography variant="body2" color="textSecondary">
//           {/* {bills?.} */}
//         </Typography>
//         <Typography variant="subtitle1" fontWeight={800} fontSize="18px">
//           Profit and Loss
//         </Typography>
//         <Typography variant="body2" color="textSecondary" fontSize="13px">
//           Basis: {reportBasis}
//         </Typography>
//         <Typography variant="body2" color="textSecondary" mt="5px">
//           {dateRangeText}
//         </Typography>
//       </Box>

//       {/* Main Table */}
//       <TableContainer component={Paper} elevation={0} sx={{ marginTop: 2,border:"none",width:"55%",margin:"0 auto " }}>
//         <Table>
//           <TableHead sx={{height:"30px",lineHeight:"20px"}}>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell sx={{ fontWeight: 600, fontSize: "11px"}}>
//                 ACCOUNT
//               </TableCell>
//               <TableCell
//                 align="right"
//                 sx={{ fontWeight: 600, fontSize: "11px" }}
//               >
//                 TOTAL
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredData.map((row, index) => (
//               <TableRow
//                 key={index}
//               >
//                 <TableCell
//                   sx={{
//                     fontSize: "14px",
//                     paddingLeft: row.isHeader ? "6px" : "22px",
//                     fontWeight: row.isHeader || row.isTotal || row.isNetProfit ? 800 : 600,
//                     color: row.isHeader ? "#1976d2" : "inherit",

//                   }}
//                 >
//                   {row.account}
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     fontSize: "12px",
//                     fontWeight: row.isTotal || row.isNetProfit ? 600 : 400,
//                   }}
//                 >
//                   {row.total}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Footer Note */}
//       <Box sx={{ marginTop: 3, paddingX: 2 }}>
//         <Typography variant="caption" color="textSecondary">
//           **Amount is displayed in your base currency (INR)
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import ShareIcon from "@mui/icons-material/Share";
import { MenuIcon, Settings2 } from "lucide-react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
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

  // New state for navigation
  const [showAccountTransactions, setShowAccountTransactions] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Sample data structure - replace with your API data
  const defaultProfitLossData = {
    operatingIncome: {
      sales: -55000.0,
      total: -55000.0,
    },
    costOfGoodsSold: {
      costOfGoodsSold: 455055.0,
      jobCosting: 11000.0,
      total: 466055.0,
    },
    grossProfit: -521055.0,
    operatingExpense: {
      fuelMileageExpenses: 100000.0,
      total: 100000.0,
    },
    operatingProfit: -621055.0,
    nonOperatingIncome: {
      total: 0.0,
    },
    nonOperatingExpense: {
      total: 0.0,
    },
    netProfitLoss: -621055.0,
  };

  const fetchProfitLossData = async () => {
    const org_id = localStorage.getItem("organization_id");

    try {
      const response = await apiService({
        method: "GET",
        url: `api/v1/profit-loss?org_id=${org_id}&from=${fromDate}&to=${toDate}&basis=${reportBasis}`,
        customBaseUrl: config.apiBaseUrl,
      });

      console.log("The P&L Data in the frontend", response);
      setProfitLossData(response.data.data || defaultProfitLossData);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching P&L data:", error);
      setProfitLossData(defaultProfitLossData);
      setShowDetails(true);
    }
  };

  const fetchOrganization = async () => {
    const org_id = localStorage.getItem("organization_id");

    const response = await apiService({
      method: "GET",
      url: `api/v1/organization/${org_id}`,
      customBaseUrl: config.apiBaseUrl,
    });

    console.log("The Organization Data in the frontend", response.data.data);
    setOrganizationData(response.data.data);
  };

  useEffect(() => {
    const today = dayjs();
    let from, to;

    from = today.startOf("month");
    to = today.endOf("month");

    setFromDate(from.format("DD-MM-YYYY"));
    setToDate(to.format("DD-MM-YYYY"));

    console.log(from, to, "The Formatted Date");

    fetchOrganization();
  }, []);

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
        from = to = "";
    }

    setFromDate(from.format("DD-MM-YYYY"));
    setToDate(to.format("DD-MM-YYYY"));
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
    fetchProfitLossData();
  };

  // New function to handle account row clicks
  const handleAccountClick = (accountName, accountType) => {
    // Define which accounts should be clickable
    const clickableAccounts = [
      "Sales",
      "Cost of Goods Sold",
      "Job Costing",
      "Fuel/Mileage Expenses",
    ];

    if (clickableAccounts.includes(accountName)) {
      setSelectedAccount({ name: accountName, type: accountType });
      setShowAccountTransactions(true);
    }
  };

  // Function to go back to P&L
  const handleBackToPL = () => {
    setShowAccountTransactions(false);
    setSelectedAccount(null);
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
          filename: `Profit-Loss-Report-${
            new Date().toISOString().split("T")[0]
          }.pdf`,
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

  const AmountDisplay = ({ amount, isNegative }) => (
    <Typography
      sx={{
        fontSize: "14px",
        fontWeight: "400",
        color: "#000000",
        textAlign: "right",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {isNegative ? "-" : ""}
      {formatAmount(amount)}
    </Typography>
  );

  const SectionHeader = ({ title, isMainSection = false }) => (
    <Box
      sx={{
        bgcolor: "#ffffff",
        py: 1,
        px: 2,
        borderBottom: "none",
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
        {title}
      </Typography>
    </Box>
  );

  // Updated AccountRow component with click handler
  const AccountRow = ({
    name,
    amount,
    isSubItem = false,
    isTotal = false,
    isMainTotal = false,
    onClick = null,
  }) => {
    const isClickable = onClick !== null;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 0.5,
          px: 2,
          pl: isSubItem ? 4 : 2,
          bgcolor: "transparent",
          borderBottom: "none",
          cursor: isClickable ? "pointer" : "default",
          "&:hover": isClickable
            ? {
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }
            : {},
        }}
        onClick={onClick}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: isTotal ? "600" : "400",
            color: isSubItem ? "#1976d2" : "#000000",
            fontFamily: "Arial, sans-serif",
            textDecoration: isClickable ? "underline" : "none",
          }}
        >
          {name}
        </Typography>
        <AmountDisplay amount={Math.abs(amount)} isNegative={amount < 0} />
      </Box>
    );
  };

  const data = { ...defaultProfitLossData, ...profitLossData };

  const calculateNetProfitLoss = () => {
    const operatingProfit = data.operatingProfit || 0;
    const nonOperatingIncome = data.nonOperatingIncome?.total || 0;
    const nonOperatingExpense = data.nonOperatingExpense?.total || 0;

    const netProfitLoss =
      operatingProfit + nonOperatingIncome - nonOperatingExpense;

    return data.netProfitLoss !== undefined
      ? data.netProfitLoss
      : netProfitLoss;
  };

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

            {/*The Popup*/}
            {/* Export Menu */}
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

          {/*Filter Accural*/}

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
          >
            Run Report
          </Button>
        </Box>
      </Box>

      {/*The Main Content - Updated P&L Statement*/}

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
            sx={{ width: "70%", margin: "0 auto", justifyContent: "center" }}
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
                TOTAL
              </Typography>
            </Box>

            {/* Conditional rendering based on showDetails state */}
            {!showDetails ? (
              // Collapsed view - only show main totals
              <>
                {/* Operating Income */}
                <AccountRow
                  name="Total for Operating Income"
                  amount={0}
                  isTotal
                />

                {/* Cost of Goods Sold */}
                <AccountRow
                  name="Total for Cost of Goods Sold"
                  amount={0}
                  isTotal
                />

                {/* Gross Profit */}
                <AccountRow name="Gross Profit" amount={0} isMainTotal />

                {/* Operating Expense */}
                <AccountRow
                  name="Total for Operating Expense"
                  amount={0}
                  isTotal
                />

                {/* Operating Profit */}
                <AccountRow name="Operating Profit" amount={0} isMainTotal />

                {/* Non Operating Income */}
                <AccountRow
                  name="Total for Non Operating Income"
                  amount={0}
                  isTotal
                />

                {/* Non Operating Expense */}
                <AccountRow
                  name="Total for Non Operating Expense"
                  amount={0}
                  isTotal
                />
              </>
            ) : (
              // Expanded view - show all details with click handlers
              <>
                {/* Check if there's data */}
                {Object.keys(data).length === 0 ? (
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
                  </Box>
                ) : (
                  <>
                    {/* Operating Income */}
                    <SectionHeader title="Operating Income" isMainSection />
                    {data.operatingIncome?.sales !== 0 && (
                      <AccountRow
                        name="Sales"
                        amount={data.operatingIncome?.sales || 0}
                        isSubItem
                        onClick={() =>
                          handleAccountClick("Sales", "operatingIncome")
                        }
                      />
                    )}
                    <AccountRow
                      name="Total for Operating Income"
                      amount={data.operatingIncome?.total || 0}
                      isTotal
                    />
                    <Divider sx={{ my: 2 }} />

                    {/* Cost of Goods Sold */}
                    <SectionHeader title="Cost of Goods Sold" isMainSection />
                    {data.costOfGoodsSold?.costOfGoodsSold !== 0 && (
                      <AccountRow
                        name="Cost of Goods Sold"
                        amount={data.costOfGoodsSold?.costOfGoodsSold || 0}
                        isSubItem
                        onClick={() =>
                          handleAccountClick(
                            "Cost of Goods Sold",
                            "costOfGoodsSold"
                          )
                        }
                      />
                    )}
                    {data.costOfGoodsSold?.jobCosting !== 0 && (
                      <AccountRow
                        name="Job Costing"
                        amount={data.costOfGoodsSold?.jobCosting || 0}
                        isSubItem
                        onClick={() =>
                          handleAccountClick("Job Costing", "costOfGoodsSold")
                        }
                      />
                    )}
                    <AccountRow
                      name="Total for Cost of Goods Sold"
                      amount={data.costOfGoodsSold?.total || 0}
                      isTotal
                    />
                    <Divider sx={{ my: 2 }} />

                    {/* Gross Profit */}
                    <AccountRow
                      name="Gross Profit"
                      amount={data.grossProfit || 0}
                      isMainTotal
                    />
                    <Divider sx={{ my: 2 }} />

                    {/* Operating Expense */}
                    <SectionHeader title="Operating Expense" isMainSection />
                    {data.operatingExpense?.fuelMileageExpenses !== 0 && (
                      <AccountRow
                        name="Fuel/Mileage Expenses"
                        amount={data.operatingExpense?.fuelMileageExpenses || 0}
                        isSubItem
                        onClick={() =>
                          handleAccountClick(
                            "Fuel/Mileage Expenses",
                            "operatingExpense"
                          )
                        }
                      />
                    )}
                    <AccountRow
                      name="Total for Operating Expense"
                      amount={data.operatingExpense?.total || 0}
                      isTotal
                    />
                    <Divider sx={{ my: 2 }} />

                    {/* Operating Profit */}
                    <AccountRow
                      name="Operating Profit"
                      amount={data.operatingProfit || 0}
                      isMainTotal
                    />
                    <Divider sx={{ my: 2 }} />

                    {/* Non Operating Income */}
                    <SectionHeader title="Non Operating Income" isMainSection />
                    <AccountRow
                      name="Total for Non Operating Income"
                      amount={data.nonOperatingIncome?.total || 0}
                      isTotal
                    />
                    <Divider sx={{ my: 2 }} />

                    {/* Non Operating Expense */}
                    <SectionHeader
                      title="Non Operating Expense"
                      isMainSection
                    />
                    <AccountRow
                      name="Total for Non Operating Expense"
                      amount={data.nonOperatingExpense?.total || 0}
                      isTotal
                    />
                    <Divider sx={{ my: 2 }} />

                    {/* Net Profit/Loss - Updated with calculation */}
                    <AccountRow
                      name="Net Profit/Loss"
                      amount={calculateNetProfitLoss()}
                      isTotal
                    />
                  </>
                )}
              </>
            )}

            {/* Footer */}
            <Box
              sx={{
                px: 3,
                pt: 2,
                pb: 7,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "400",
                  fontFamily: "Arial, sans-serif",
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfitAndLoss;
