// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Chip,
//   Grid,
//   Card,
//   CardContent,
//   CircularProgress,
//   Alert,
//   Toolbar,
//   AppBar,
//   IconButton,
//   Stack,
// } from "@mui/material";
// import {
//   FilterList as FilterListIcon,
//   GetApp as GetAppIcon,
//   Today as TodayIcon,
// } from "@mui/icons-material";
// import apiService from "../../../services/axiosService";
// import config from "../../../services/config";
// import { ArrowBigDown, ArrowBigLeft, Banknote, RefreshCcwDot } from "lucide-react";
// import { useRouter } from "next/navigation";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// const APAgingBillReport = () => {
//   // State management
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateFilter, setDateFilter] = useState("All Time");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const router = useRouter();

//   // Fetch bills data
//   const fetchBills = async () => {
//     try {
//       setLoading(true);
//       const organisation_id = localStorage.getItem("organization_id") || "100000"; // Fallback value
//       const response = await apiService({
//         method: "GET",
//         url: `api/v1/bills/get-bills?org_id=${organisation_id}`,
//         customBaseUrl: config.PO_Base_url,
//       });

//       // Based on your response structure - access the bills array
//       const bills = response.data.data || response.data;

//       // Filter out bills with status 'draft'
//       const filteredBills = bills.filter(
//         (bill) => bill.status_type !== "DRAFT"
//       );

//       setBills(filteredBills);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching bills:", err);
//       setError("Failed to fetch bills. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Date filtering utility functions
//   const isToday = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     return date.toDateString() === today.toDateString();
//   };

//   const isWithinDays = (dateString, days) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = now - date;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays <= days && diffDays >= 0;
//   };

//   const isThisWeek = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
//     const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6)); // Saturday
//     return date >= startOfWeek && date <= endOfWeek;
//   };

//   // Filter bills based on date and status
//   const filteredBills = useMemo(() => {
//     let filtered = bills;

//     // Apply date filter
//     if (dateFilter === "Today") {
//       filtered = filtered.filter((bill) => isToday(bill.created_time));
//     } else if (dateFilter === "Last 7 Days") {
//       filtered = filtered.filter((bill) =>
//         isWithinDays(bill.created_time, 7)
//       );
//     } else if (dateFilter === "Last 30 Days") {
//       filtered = filtered.filter((bill) =>
//         isWithinDays(bill.created_time, 30)
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== "All") {
//       filtered = filtered.filter((bill) => bill.status === statusFilter);
//     }

//     return filtered;
//   }, [bills, dateFilter, statusFilter]);

//   // Calculate totals
//   const totals = useMemo(() => {
//     const totalAmount = filteredBills.reduce(
//       (sum, bill) => sum + (bill.totals || 0),
//       0
//     );
//     const totalBalance = filteredBills.reduce(
//       (sum, bill) => sum + (bill.amount || 0),
//       0
//     );
//     const paidAmount = totalAmount - totalBalance;

//     return { totalAmount, totalBalance, paidAmount };
//   }, [filteredBills]);

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "PAID":
//         return "success";
//       case "PARTIALLY PAID":
//         return "warning";
//       case "OPEN":
//         return "default";
//       default:
//         return "default";
//     }
//   };

//   // Export to PDF using jsPDF
//   const exportToPDF = async () => {
//     try {
//       // Dynamic import for Next.js compatibility
//       const { jsPDF } = await import("jspdf");
//       const { autoTable } = await import("jspdf-autotable");

//       const doc = new jsPDF();

//       // Title
//       doc.setFontSize(16);
//       doc.setTextColor(25, 118, 210); // Blue color
//       doc.text("AP Aging Details by Bill Due Date", 20, 20);

//       // Generated on date
//       doc.setFontSize(10);
//       doc.setTextColor(100);
//       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

//       // Applied filters
//       doc.setFontSize(12);
//       doc.setTextColor(0);

//       // Table headers and data
//       const tableHeaders = ["Date", "Transaction#", "Status", "Vendor Name", "Amount", "Balance Due"];
//       const tableData = filteredBills.map((bill) => [
//         bill.date_formatted ||
//           (bill.created_time ? new Date(bill.created_time).toLocaleDateString() : "N/A"),
//         bill.bill_number || "N/A",
//         bill.status_formatted || bill.status || "N/A",
//         bill.vendor_name || "N/A",
//         bill.total || 0,
//         bill.amount || 0,
//       ]);

//       // Generate table
//       autoTable(doc, {
//         head: [tableHeaders],
//         body: tableData,
//         startY: 50,
//         styles: {
//           fontSize: 8,
//           cellPadding: 3,
//         },
//         headStyles: {
//           fillColor: [25, 118, 210],
//           textColor: 255,
//           fontStyle: "bold",
//         },
//         alternateRowStyles: {
//           fillColor: [249, 249, 249],
//         },
//         columnStyles: {
//           4: { halign: "right" }, // Amount column
//           5: { halign: "right" }, // Balance Due column
//         },
//       });

//       // Summary section
//       const finalY = doc.lastAutoTable.finalY + 20;
//       doc.setFontSize(14);
//       doc.setTextColor(0);
//       doc.text("Summary", 20, finalY);
//       doc.setFontSize(10);
//       const summaryData = [
//         `Total Amount: ${formatCurrency(totals.totalAmount)}`,
//         `Total Balance Due: ${formatCurrency(totals.totalBalance)}`,
//       ];
//       summaryData.forEach((item, index) => {
//         doc.text(item, 20, finalY + 15 + index * 8);
//       });

//       // Save the PDF
//       const fileName = `AP_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
//       doc.save(fileName);
//       console.log("PDF generated successfully");
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("Failed to generate PDF. Please check the console for details.");
//     }
//   };

//   // Handle pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchBills();
//   }, []);

//   return (
//     <Box sx={{ width: "100%", bgcolor: "background.default" }}>
//       <Box position="static" sx={{ height: "40px", alignItems: "center" }}>
//         <Toolbar>
//           <TodayIcon sx={{ mr: 2 }} />
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{ flexGrow: 1, fontSize: "13px" }}
//           >
//             Payable Bill
//           </Typography>
//           <Typography variant="body2" sx={{ fontSize: "13px" }}>
//             As of {new Date().toLocaleDateString()}
//           </Typography>
//         </Toolbar>
//       </Box>

//       <Box sx={{ p: 3 }}>
//         {/* Filters */}
//         <Card sx={{ mb: 2 }}>
//           <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
//             <Stack
//               direction="row"
//               alignItems="center"
//               justifyContent="space-between"
//               gap="15px"
//               sx={{ flexWrap: "wrap" }}
//             >
//               <Grid sx={{ display: "flex", gap: "20px" }}>
//                 <FormControl
//                   size="small"
//                   sx={{ minWidth: 180, height: "40px", fontSize: "13px" }}
//                 >
//                   <InputLabel sx={{ fontSize: "13px" }}>Date Filter</InputLabel>
//                   <Select
//                     value={dateFilter}
//                     label="Date Filter"
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     sx={{ fontSize: "13px" }}
//                   >
//                     <MenuItem value="Today" sx={{ fontSize: "13px" }}>
//                       Today
//                     </MenuItem>
//                     <MenuItem value="Last 7 Days" sx={{ fontSize: "13px" }}>
//                       Last 7 Days
//                     </MenuItem>
//                     <MenuItem value="Last 30 Days" sx={{ fontSize: "13px" }}>
//                       Last 30 Days
//                     </MenuItem>
//                     <MenuItem value="All Time" sx={{ fontSize: "13px" }}>
//                       All Time
//                     </MenuItem>
//                   </Select>
//                 </FormControl>

//                 <FormControl size="small" sx={{ minWidth: 180 }}>
//                   <InputLabel>Status Filter</InputLabel>
//                   <Select
//                     value={statusFilter}
//                     label="Status Filter"
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     sx={{ fontSize: "13px" }}
//                   >
//                     <MenuItem value="All" sx={{ fontSize: "13px" }}>
//                       All Status
//                     </MenuItem>
//                     <MenuItem value="PAID" sx={{ fontSize: "13px" }}>
//                       Paid
//                     </MenuItem>
//                     <MenuItem value="PARTIALLY PAID" sx={{ fontSize: "13px" }}>
//                       Partially Paid
//                     </MenuItem>
//                     <MenuItem value="OPEN" sx={{ fontSize: "13px" }}>
//                       Open
//                     </MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid sx={{ display: "flex", gap: "20px" }}>
//                 <IconButton
//                   onClick={fetchBills}
//                   color="success"
//                   size="small"
//                   sx={{
//                     height: 30,
//                     width: 30,
//                   }}
//                 >
//                   <RefreshCcwDot size={18} />
//                 </IconButton>

//                 <Button
//                   color="success"
//                   size="small"
//                   startIcon={<GetAppIcon />}
//                   onClick={exportToPDF}
//                   disabled={filteredBills.length === 0}
//                   sx={{
//                     minWidth: 120,
//                     height: 35,
//                     border: "1px solid green",
//                     fontSize: "13px",
//                   }}
//                 >
//                   Export PDF
//                 </Button>
//               </Grid>
//             </Stack>
//           </CardContent>
//         </Card>

//         {/* Error Alert */}
//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {/* Loading */}
//         {loading ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight="300px"
//           >
//             <CircularProgress />
//           </Box>
//         ) : (
//           <>
//             {/* Totals */}
//             <Grid sx={{ mb: 2 }}>
//               <CardContent sx={{ py: 1.5, "&:last-child": { pb: 0.5 } }}>
//                 <Grid
//                   container
//                   spacing={2}
//                   sx={{ display: "flex", justifyContent: "space-evenly" }}
//                 >
//                   <Grid
//                     item
//                     xs={12}
//                     sm={6}
//                     md={3}
//                     sx={{ padding: "15px 25px" }}
//                   >
//                     <Box textAlign="center">
//                       <Typography
//                         variant="h5"
//                         color="primary"
//                         sx={{ fontSize: "18px", mb: 0.5 }}
//                       >
//                         {filteredBills.length}
//                       </Typography>

//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ fontSize: "16px", fontWeight: 600 }}
//                       >
//                         Total Bills
//                       </Typography>
//                     </Box>
//                   </Grid>
//                   <Grid
//                     item
//                     xs={12}
//                     sm={6}
//                     md={3}
//                     sx={{ padding: "15px 25px" }}
//                   >
//                     <Box textAlign="center">
//                       <Typography
//                         variant="h5"
//                         color="primary"
//                         sx={{ fontSize: "18px", mb: 0.5 }}
//                       >
//                         {formatCurrency(totals.paidAmount)}
//                       </Typography>

//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ fontSize: "16px", fontWeight: 600 }}
//                       >
//                         Paid Amount
//                       </Typography>
//                     </Box>
//                   </Grid>
//                   <Grid
//                     item
//                     xs={12}
//                     sm={6}
//                     md={3}
//                     sx={{ padding: "15px 25px" }}
//                   >
//                     <Box textAlign="center">
//                       <Typography
//                         variant="h5"
//                         color="success.main"
//                         sx={{ fontSize: "18px", mb: 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}
//                       >
//                         <ArrowBigDown style={{ height: "30px", marginRight: "5px",color:"red",rotate:"220deg" }} />
//                         {formatCurrency(totals.totalAmount)}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ fontSize: "16px", fontWeight: 600 }}
//                       >
//                         Total Outstanding Payables
//                       </Typography>
//                     </Box>
//                   </Grid>
//                   <Grid
//                     item
//                     xs={12}
//                     sm={6}
//                     md={3}
//                     sx={{ padding: "15px 25px" }}
//                   >
//                     <Box textAlign="center">
//                       <Typography
//                         variant="h5"
//                         color="warning.main"
//                         sx={{ fontSize: "18px", mb: 0.5 }}
//                       >
//                         {formatCurrency(totals.totalBalance)}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ fontSize: "16px", fontWeight: 600 }}
//                       >
//                         Overdue Bill
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Grid>

//             {/* Data Table */}
//             <Paper sx={{ width: "100%", overflow: "hidden" }}>
//               <TableContainer
//                 sx={{
//                   maxHeight: 600,
//                   borderRadius: 2,
//                   border: "1px solid #eee",
//                 }}
//               >
//                 <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#f9f9f9", height: 36 }}>
//                       <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
//                         Date
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
//                         Transaction#
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
//                         Type
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
//                         Status
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
//                         Vendor Name
//                       </TableCell>
//                       <TableCell
//                         sx={{ fontWeight: 600, fontSize: "13px" }}
//                         align="right"
//                       >
//                         Amount
//                       </TableCell>
//                       <TableCell
//                         sx={{ fontWeight: 600, fontSize: "13px" }}
//                         align="right"
//                       >
//                         Balance Due
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {filteredBills
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((bill) => (
//                         <TableRow key={bill._id} hover sx={{ height: 40 }}>
//                           <TableCell sx={{ fontSize: "13px" }}>
//                             {bill.date_formatted ||
//                               new Date(
//                                 bill.created_time
//                               ).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell sx={{ fontSize: "13px" }}>
//                             <Button
//                               variant="text"
//                               size="small"
//                               onClick={() =>
//                                 router.push(
//                                   `/purchase/bills/${bill.bill_number}`
//                                 )
//                               }
//                               sx={{
//                                 textTransform: "none",
//                                 fontSize: "13px",
//                                 fontWeight: 500,
//                                 color: "#1976d2",
//                                 padding: 0,
//                                 minWidth: "auto",
//                                 "&:hover": {
//                                   backgroundColor: "transparent",
//                                   textDecoration: "underline",
//                                 },
//                               }}
//                             >
//                               {bill.bill_number}
//                             </Button>
//                           </TableCell>
//                           <TableCell sx={{ fontSize: "13px" }}>
//                             Bill
//                           </TableCell>
//                           <TableCell>
//                             <Typography
//                               sx={{ color: "green", fontSize: "13px" }}
//                             >
//                               {bill.status_formatted || bill.status_type}
//                             </Typography>
//                           </TableCell>
//                           <TableCell sx={{ fontSize: "13px" }}>
//                             {bill.vendor_name}
//                           </TableCell>
//                           <TableCell sx={{ fontSize: "13px",color:"blue" }} align="right">
//                             {formatCurrency(bill.totals || 0)}
//                           </TableCell>
//                           <TableCell sx={{ fontSize: "13px" }} align="right">
//                             {formatCurrency(bill.amount || 0)}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Pagination */}
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 component="div"
//                 count={filteredBills.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//               />
//             </Paper>
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default APAgingBillReport;
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Toolbar,
  AppBar,
  IconButton,
  Stack,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import {
  ArrowBigDown,
  ArrowBigLeft,
  Banknote,
  RefreshCcwDot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";

const APAgingBillReport = () => {
  // State management
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("All Time");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

  // Fetch bills data
  const fetchBills = async () => {
    try {
      setLoading(true);
      const organisation_id =
        localStorage.getItem("organization_id") || "100000"; // Fallback value
      const response = await apiService({
        method: "GET",
        url: `api/v1/bills/get-bills?org_id=${organisation_id}`,
        customBaseUrl: config.PO_Base_url,
      });
      const bills = response.data.data || response.data;
      const filteredBills = bills.filter(
        (bill) => bill.status_type !== "DRAFT"
      );
      setBills(filteredBills);
      setError(null);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError("Failed to fetch bills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Date filtering utility functions
  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWithinDays = (dateString, days) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays >= 0;
  };

  const isThisWeek = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return date >= startOfWeek && date <= endOfWeek;
  };

  // Filter bills based on date and status
  const filteredBills = useMemo(() => {
    let filtered = [...bills];

    // Apply date filter
    if (dateFilter === "Today") {
      filtered = filtered.filter((bill) => isToday(bill.created_time));
    } else if (dateFilter === "Last 7 Days") {
      filtered = filtered.filter((bill) => isWithinDays(bill.created_time, 7));
    } else if (dateFilter === "Last 30 Days") {
      filtered = filtered.filter((bill) => isWithinDays(bill.created_time, 30));
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (bill) =>
          bill.status_type?.toUpperCase() === statusFilter?.toUpperCase()
      );
    }

    return filtered;
  }, [bills, dateFilter, statusFilter]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalAmount = filteredBills.reduce(
      (sum, bill) => sum + (bill.totals || 0),
      0
    );
    const totalBalance = filteredBills.reduce(
      (sum, bill) => sum + (bill.amount || 0),
      0
    );
    const paidAmount = totalAmount - totalBalance;
    return { totalAmount, totalBalance, paidAmount };
  }, [filteredBills]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PARTIALLY PAID":
        return "warning";
      case "OPEN":
        return "default";
      default:
        return "default";
    }
  };

  // Export to PDF using jsPDF
 const exportToPDF = async () => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  try {
    // Dynamic import for Next.js compatibility
    const { jsPDF } = await import("jspdf");
    const { autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("AP Aging Details by Bill Due Date", 105, 20, {
      align: "center",
    });

    // Generated on date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Prepare table data with corrected paid calculation
    const tableData = filteredBills.map((bill) => {
      const totalAmount = parseFloat(bill.totals) || 0;
      const balanceDue = parseFloat(bill.amount) || 0;
      const paidAmount = totalAmount - balanceDue; // Amount - Balance Due = Paid

      return [
        bill.date_formatted ||
          (bill.created_time
            ? new Date(bill.created_time).toLocaleDateString()
            : "N/A"),
        bill.bill_number || "N/A",
        bill.status_type || bill.status || "N/A",
        bill.vendor_name || "N/A",
        formatCurrency(totalAmount),
        formatCurrency(paidAmount),
        formatCurrency(balanceDue),
      ];
    });

    // Calculate totals
    const totalAmount = filteredBills.reduce(
      (sum, bill) => sum + (parseFloat(bill.totals) || 0),
      0
    );
    const totalBalance = filteredBills.reduce(
      (sum, bill) => sum + (parseFloat(bill.amount) || 0),
      0
    );
    const totalPaid = totalAmount - totalBalance; // Total Amount - Total Balance = Total Paid

    // Add total row
    tableData.push([
      "Total",
      "",
      "",
      "",
      formatCurrency(totalAmount),
      formatCurrency(totalPaid),
      formatCurrency(totalBalance),
    ]);

    // Create the table using autoTable function
    autoTable(doc, {
      head: [
        [
          "Date",
          "Transaction#",
          "Status",
          "Vendor Name",
          "Amount",
          "Paid",
          "Balance Due",
        ],
      ],
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        4: { halign: "right" }, // Amount column
        5: { halign: "right" }, // Paid column
        6: { halign: "right" }, // Balance Due column
      },
      didParseCell: function (data) {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [236, 240, 241];
        }
      },
    });

    // Save the PDF
    const today = new Date().toISOString().split("T")[0];
    doc.save(`AP_Report_${today}.pdf`);

    console.log("PDF generated successfully");
  } catch (error) {
    console.error("PDF generation error:", error);
  }
};

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <Box sx={{ width: "100%", bgcolor: "background.default" }}>
      <Box position="static" sx={{ height: "40px", alignItems: "center" }}>
        <Toolbar>
          <TodayIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "13px" }}
          >
            Payable Bill
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "13px" }}>
            As of {new Date().toLocaleDateString()}
          </Typography>
        </Toolbar>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Filters */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
            {" "}
            {/*  Filter out bills with status 'draft' */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap="15px"
              sx={{ flexWrap: "wrap" }}
            >
              <Grid sx={{ display: "flex", gap: "20px" }}>
                <FormControl
                  size="small"
                  sx={{ minWidth: 180, height: "40px", fontSize: "13px" }}
                >
                  <InputLabel sx={{ fontSize: "14px" }}>Date Filter</InputLabel>
                  <Select
                    value={dateFilter}
                    label="Date Filter"
                    onChange={(e) => setDateFilter(e.target.value)}
                    sx={{ fontSize: "13px" }}
                  >
                    <MenuItem value="Today" sx={{ fontSize: "13px" }}>
                      Today
                    </MenuItem>
                    <MenuItem value="Last 7 Days" sx={{ fontSize: "13px" }}>
                      Last 7 Days
                    </MenuItem>
                    <MenuItem value="Last 30 Days" sx={{ fontSize: "13px" }}>
                      Last 30 Days
                    </MenuItem>
                    <MenuItem value="All Time" sx={{ fontSize: "13px" }}>
                      All Time
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth sx={{ minWidth: 180 }}>
                  <InputLabel sx={{ fontSize: "14px" }} >Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ fontSize: "13px" }}
                  >
                    <MenuItem value="All" sx={{ fontSize: "13px" }}>
                      All Status
                    </MenuItem>
                    <MenuItem value="PAID" sx={{ fontSize: "13px" }}>
                      Paid
                    </MenuItem>
                    <MenuItem value="PARTIALLY PAID" sx={{ fontSize: "13px" }}>
                      Partially Paid
                    </MenuItem>
                    <MenuItem value="OPEN" sx={{ fontSize: "13px" }}>
                      Open
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ display: "flex", gap: "20px" }}>
                <IconButton
                  onClick={fetchBills}
                  color="success"
                  size="small"
                  sx={{
                    height: 30,
                    width: 30,
                  }}
                >
                  <RefreshCcwDot size={18} />
                </IconButton>
                <Button
                  color="success"
                  startIcon={<GetAppIcon />}
                  onClick={exportToPDF}
                  disabled={filteredBills.length === 0}
                  sx={{
                    minWidth: 120,
                    height: 35,
                    border: "1px solid green",
                    fontSize: "13px",
                  }}
                >
                  Export PDF
                </Button>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <Grid sx={{ mb: 2 }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 0.5 } }}>
                <Grid
                  container
                  spacing={2}
                  sx={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="primary"
                        sx={{ fontSize: "18px", mb: 0.5 }}
                      >
                        {filteredBills.length}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Total Bills
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="primary"
                        sx={{ fontSize: "18px", mb: 0.5 }}
                      >
                        {formatCurrency(totals.paidAmount)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Paid Amount
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="success.main"
                        sx={{
                          fontSize: "18px",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowBigDown
                          style={{
                            height: "30px",
                            marginRight: "5px",
                            color: "red",
                            rotate: "220deg",
                          }}
                        />
                        {formatCurrency(totals.totalAmount)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Total Outstanding Payables
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ padding: "15px 25px" }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h5"
                        color="warning.main"
                        sx={{ fontSize: "18px", mb: 0.5 }}
                      >
                        {formatCurrency(totals.totalBalance)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Overdue Bill
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>

            {/* Data Table */}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Transaction#</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Vendor Name</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Balance Due</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBills
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((bill) => (
                        <TableRow key={bill._id} hover sx={{ height: 40 }}>
                          <TableCell sx={{ fontSize: "13px" }}>
                            {bill.date_formatted ||
                              new Date(bill.created_time).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() =>
                                router.push(
                                  `/purchase/bills/${bill.bill_number}`
                                )
                              }
                              variant="text"
                              size="small"
                              sx={{
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {bill.bill_number}
                            </Button>
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }}>Bill</TableCell>
                          <TableCell>
                            <Typography
                              sx={{ color: "green", fontSize: "12px" }}
                            >
                              {bill.status_formatted || bill.status_type}
                            </Typography>
                          </TableCell>
                          <TableCell>{bill.vendor_name}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(bill.totals)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: "13px", color: "blue" }}
                            align="right"
                          >
                            {formatCurrency(bill.totals || 0)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }} align="right">
                            {formatCurrency(bill.amount || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredBills.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

export default APAgingBillReport;
