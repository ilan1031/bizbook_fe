// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
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
//   ListItemText,
//   Divider,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ReplayIcon from "@mui/icons-material/Replay";
// import ShareIcon from "@mui/icons-material/Share";
// import { MenuIcon, Settings2 } from "lucide-react";
// import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
// import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
// import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
// import apiService from "../../../services/axiosService";
// import config from "../../../services/config";
// import dayjs from "dayjs";
// import html2pdf from "html2pdf.js";

// const JournalReport = () => {
//   const [exportAnchorEl, setExportAnchorEl] = useState(null);
//   const exportMenuOpen = Boolean(exportAnchorEl);
//   const [dateValue, setDateValue] = useState("This Month");
//   const [dateAnchorEl, setDateAnchorEl] = useState(null);
//   const dateMenuOpen = Boolean(dateAnchorEl);
//   const [reportBasis, setReportBasis] = useState("Cash");
//   const [reportBasisAnchorEl, setReportBasisAnchorEl] = useState(null);
//   const reportBasisMenuOpen = Boolean(reportBasisAnchorEl);
//   const [journalData, setJournalData] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [organizationData, setOrganizationData] = useState();

//   const fetchJournals = async () => {
//     const org_id = localStorage.getItem("organization_id");

//     const response = await apiService({
//       method: "GET",
//       url: `api/v1/get-journal?org_id=${org_id}&from=${fromDate}&to=${toDate}`,
//       customBaseUrl: config.apiBaseUrl,
//     });

//     console.log("The Journal Data in the frontend", response);
//     setJournalData(response.data.data);
//   };

//   const fetchOrganization = async () => {
//     const org_id = localStorage.getItem("organization_id");

//     const response = await apiService({
//       method: "GET",
//       url: `api/v1/organization/${org_id}`,
//       customBaseUrl: config.apiBaseUrl,
//     });

//     console.log("The Organization Data in the frontend", response.data.data);
//     setOrganizationData(response.data.data);
//   };

//   useEffect(() => {
//     const today = dayjs();
//     let from, to;

//     from = today.startOf("month");
//     to = today.endOf("month");

//     setFromDate(from.format("DD-MM-YYYY"));
//     setToDate(to.format("DD-MM-YYYY"));

//     console.log(from, to, "The Formatted Date");

//     fetchJournals();
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
//         const quarter = Math.floor(dayjs().month() / 3); // 0-based quarter
//         from = dayjs()
//           .startOf("year")
//           .add(quarter * 3, "month"); // Start of the quarter
//         to = dayjs(from).endOf("quarter"); // End of the quarter
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
//         from = to = "";
//     }

//     setFromDate(from.format("DD-MM-YYYY"));
//     setToDate(to.format("DD-MM-YYYY"));
//   };

//   const handleClose = () => {
//     setDateAnchorEl(null);
//     setExportAnchorEl(null);
//     setReportBasisAnchorEl(null);
//   };

//   const handleExportClick = (event) => {
//     setExportAnchorEl(event.currentTarget);
//   };

//   const generatePdfSimple = () => {
//     setTimeout(() => {
//       try {
//         const element = document.getElementById("pdf-print");

//         if (!element) {
//           console.error("Journal Report PDF element not found");
//           return;
//         }

//         const options = {
//           filename: `Journal-Report-${
//             new Date().toISOString().split("T")[0]
//           }.pdf`,
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
//             console.log("Journal Report PDF generated successfully");
//           })
//           .catch((error) => {
//             console.error("Error generating PDF:", error);
//           });
//       } catch (error) {
//         console.error("Error in PDF generation:", error);
//       }
//     }, 500);
//   };

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
//                     Journal Report
//                   </Typography>
//                   <Typography
//                     sx={{ ml: 1, fontSize: "12px", fontWeight: "400" }}
//                   >
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

//             {/*The Popup*/}
//             {/* Export Menu */}
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
//               {exportAnchorEl ? (
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
//               // "Custom",
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

//           {/*Filter Accural*/}

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
//                   setReportBasis("Accural");
//                   handleClose();
//                 }}
//                 sx={{
//                   fontSize: "14px",
//                   fontWeight: 400,
//                   borderRadius: "6px",
//                   width: "180px",
//                 }}
//               >
//                 Accural
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
//             onClick={() => {
//               fetchJournals();
//             }}
//           >
//             Run Report
//           </Button>
//         </Box>
//       </Box>

//       {/*The Main Content*/}

//       <Box
//         sx={{ bgcolor: "#f4f4f9", p: 2, maxHeight: "72vh", overflowY: "auto" }}
//       >
//         {/*Heading Box*/}

//         <Box id="pdf-print" sx={{ bgcolor: "white", borderRadius: "6px" }}>
//           <Box sx={{ textAlign: "center" }}>
//             <Typography
//               sx={{
//                 fontSize: "13px",
//                 fontWeight: "400",
//                 color: "#6C718A",
//                 py: 2,
//               }}
//             >
//               {organizationData?.organization_name.toUpperCase()}
//             </Typography>
//             <Typography sx={{ fontSize: "20px", fontWeight: "550" }}>
//               Journal Report
//             </Typography>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography
//                 sx={{ fontSize: "13px", fontWeight: "400", color: "#6C718A" }}
//               >
//                 From
//               </Typography>
//               <Typography sx={{ fontSize: "14px", fontWeight: "400", px: 1 }}>
//                 {fromDate}
//               </Typography>
//               <Typography
//                 sx={{ fontSize: "13px", fontWeight: "400", color: "#6C718A" }}
//               >
//                 To
//               </Typography>
//               <Typography sx={{ fontSize: "14px", fontWeight: "400", px: 1 }}>
//                 {toDate}
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 py: 2,
//               }}
//             >
//               <Typography
//                 sx={{ fontSize: "13px", fontWeight: "400", color: "#6C718A" }}
//               >
//                 Basis :
//               </Typography>
//               <Typography sx={{ ml: 1, fontSize: "13px", fontWeight: "400" }}>
//                 {reportBasis}
//               </Typography>
//             </Box>
//           </Box>

//           {/*The Table Content*/}

//           {journalData.length == 0 ? (
//             <Box
//               sx={{
//                 textAlign: "center",
//                 fontSize: "13px",
//                 fontWeight: "400",
//                 py: 1,
//               }}
//             >
//               There are no transactions during the selected date range.
//             </Box>
//           ) : (
//             <>
//               {journalData.map((data, index) => (
//                 <TableContainer
//                   key={index}
//                   component={Paper}
//                   elevation={0}
//                   sx={{ mb: 2 }}
//                 >
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ width: "60%" }}>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <Typography
//                               sx={{
//                                 fontSize: "12px !important",
//                                 fontWeight: "600 !important",
//                               }}
//                             >
//                               {data.journal_date_formatted}
//                             </Typography>
//                             <Typography
//                               sx={{
//                                 fontSize: "12px !important",
//                                 fontWeight: "600 !important",
//                                 ml: 0.5,
//                               }}
//                             >
//                               - {data.type}
//                             </Typography>
//                             <Typography
//                               sx={{
//                                 fontSize: "12px !important",
//                                 fontWeight: "600 !important",
//                                 ml: 1,
//                                 color: "black",
//                               }}
//                             >
                            
//                             </Typography>
//                             <Typography
//                               sx={{
//                                 fontSize: "12px !important",
//                                 fontWeight: "600 !important",
//                                 ml: 1,
//                                 color: "#1b6de0",
//                               }}
//                             >
//                               ({data?.vendor_name || data?.customer_name})
//                             </Typography>
//                           </Box>
//                         </TableCell>
//                         <TableCell align="right" sx={{ width: "20%" }}>
//                           DEBIT
//                         </TableCell>
//                         <TableCell align="right" sx={{ pr: 5, width: "20%" }}>
//                           CREDIT
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>

//                     <TableBody>
//                       {data.line_items.map((item, index) => (
//                         <TableRow key={index}>
//                           <TableCell sx={{ borderRight: "1px solid #dddddd" }}>
//                             {item.coa_account_name}
//                           </TableCell>
//                           <TableCell
//                             align="right"
//                             sx={{ borderRight: "1px solid #dddddd" }}
//                           >
//                             {item.creditOrDebit === "Debit"
//                               ? item.amount_formatted
//                               : "₹0.00"}
//                           </TableCell>
//                           <TableCell align="right" sx={{ pr: 5 }}>
//                             {item.creditOrDebit === "Credit"
//                               ? item.amount_formatted
//                               : "₹0.00"}
//                           </TableCell>
//                         </TableRow>
//                       ))}

//                       {/*The Total*/}

//                       <TableRow>
//                         <TableCell
//                           sx={{
//                             borderRight: "1px solid #dddddd",
//                             bgcolor: "#f6f6fa !important",
//                           }}
//                         ></TableCell>
//                         <TableCell
//                           align="right"
//                           sx={{
//                             borderRight: "1px solid #dddddd",
//                             bgcolor: "#f6f6fa",
//                             color: "#3f6de0 !important",
//                           }}
//                         >
//                           {data?.total_amount_formatted}
//                         </TableCell>
//                         <TableCell
//                           align="right"
//                           sx={{
//                             bgcolor: "#f6f6fa",
//                             pr: 5,
//                             color: "#3f6de0 !important",
//                           }}
//                         >
//                           {data?.total_amount_formatted}
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               ))}
//             </>
//           )}

//           {/*The Footer Below the Table*/}
//           <Box
//             sx={{ px: 3, pt: 2, pb: 7, display: "flex", alignItems: "center" }}
//           >
//             <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>
//               **Amount is displayed in your base currency
//             </Typography>
//             <Box
//               sx={{
//                 width: "40px",
//                 color: "white",
//                 bgcolor: "#388a10",
//                 fontSize: "10px",
//                 fontWeight: "600",
//                 ml: 1,
//                 p: 0.5,
//                 textAlign: "center",
//               }}
//             >
//               INR
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default JournalReport;


"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  ListItemText,
  Divider,
  Pagination,
  Select,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import ShareIcon from "@mui/icons-material/Share";
import { MenuIcon, Settings2, ChevronLeft, ChevronRight } from "lucide-react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import apiService from "../../../services/axiosService";
import config from "../../../services/config";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

const JournalReport = () => {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportMenuOpen = Boolean(exportAnchorEl);
  const [dateValue, setDateValue] = useState("This Month");
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const dateMenuOpen = Boolean(dateAnchorEl);
  const [reportBasis, setReportBasis] = useState("Cash");
  const [reportBasisAnchorEl, setReportBasisAnchorEl] = useState(null);
  const reportBasisMenuOpen = Boolean(reportBasisAnchorEl);
  const [journalData, setJournalData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [organizationData, setOrganizationData] = useState();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchJournals = async (page = 1, limit = recordsPerPage) => {
    setLoading(true);
    try {
      const org_id = localStorage.getItem("organization_id");

      const response = await apiService({
        method: "GET",
        url: `api/v1/get-journal?org_id=${org_id}&from=${fromDate}&to=${toDate}&page=${page}&limit=${limit}`,
        customBaseUrl: config.apiBaseUrl,
      });

      console.log("The Journal Data in the frontend", response);
      
      if (response.data.status) {
        setJournalData(response.data.data);
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
          setTotalRecords(response.data.pagination.totalRecords);
        }
      }
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (fromDate && toDate) {
      fetchJournals(1, recordsPerPage);
      setCurrentPage(1);
    }
  }, [fromDate, toDate, recordsPerPage]);

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
        const quarter = Math.floor(dayjs().month() / 3);
        from = dayjs()
          .startOf("year")
          .add(quarter * 3, "month");
        to = dayjs(from).endOf("quarter");
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

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchJournals(page, recordsPerPage);
  };

  const handleRecordsPerPageChange = (event) => {
    const newLimit = event.target.value;
    setRecordsPerPage(newLimit);
    setCurrentPage(1);
  };

  const generatePdfSimple = () => {
    setTimeout(() => {
      try {
        const element = document.getElementById("pdf-print");

        if (!element) {
          console.error("Journal Report PDF element not found");
          return;
        }

        const options = {
          filename: `Journal-Report-${
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
            console.log("Journal Report PDF generated successfully");
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
          });
      } catch (error) {
        console.error("Error in PDF generation:", error);
      }
    }, 500);
  };

  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
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
                    Journal Report
                  </Typography>
                  <Typography
                    sx={{ ml: 1, fontSize: "12px", fontWeight: "400" }}
                  >
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
                <IconButton size="small" onClick={() => fetchJournals(currentPage, recordsPerPage)}>
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
                  setReportBasis("Accural");
                  handleClose();
                }}
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  borderRadius: "6px",
                  width: "180px",
                }}
              >
                Accural
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
            onClick={() => {
              fetchJournals(1, recordsPerPage);
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Run Report"}
          </Button>
        </Box>
      </Box>

      {/*The Main Content*/}
      <Box
        sx={{ bgcolor: "#f4f4f9", p: 2, maxHeight: "72vh", overflowY: "auto" }}
      >
        {/*Heading Box*/}
        <Box id="pdf-print" sx={{ bgcolor: "white", borderRadius: "6px" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "400",
                color: "#6C718A",
                py: 2,
              }}
            >
              {organizationData?.organization_name?.toUpperCase()}
            </Typography>
            <Typography sx={{ fontSize: "20px", fontWeight: "550" }}>
              Journal Report
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "13px", fontWeight: "400", color: "#6C718A" }}
              >
                From
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: "400", px: 1 }}>
                {fromDate}
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: "400", color: "#6C718A" }}
              >
                To
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: "400", px: 1 }}>
                {toDate}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 2,
              }}
            >
              <Typography
                sx={{ fontSize: "13px", fontWeight: "400", color: "#6C718A" }}
              >
                Basis :
              </Typography>
              <Typography sx={{ ml: 1, fontSize: "13px", fontWeight: "400" }}>
                {reportBasis}
              </Typography>
            </Box>
          </Box>

          {/*The Table Content*/}
          {loading ? (
            <Box
              sx={{
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "400",
                py: 4,
              }}
            >
              Loading journal entries...
            </Box>
          ) : journalData.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "400",
                py: 4,
              }}
            >
              There are no transactions during the selected date range.
            </Box>
          ) : (
            <>
              {journalData.map((data, index) => (
                <TableContainer
                  key={index}
                  component={Paper}
                  elevation={0}
                  sx={{ mb: 2 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "60%" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontSize: "12px !important",
                                fontWeight: "600 !important",
                              }}
                            >
                              {data.journal_date_formatted}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px !important",
                                fontWeight: "600 !important",
                                ml: 0.5,
                              }}
                            >
                              - {data.type}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px !important",
                                fontWeight: "600 !important",
                                ml: 1,
                                color: "#1b6de0",
                              }}
                            >
                              ({data?.vendor_name || data?.customer_name})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ width: "20%" }}>
                          DEBIT
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 5, width: "20%" }}>
                          CREDIT
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.line_items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ borderRight: "1px solid #dddddd" }}>
                            {item.coa_account_name}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ borderRight: "1px solid #dddddd" }}
                          >
                            {item.creditOrDebit === "Debit"
                              ? item.amount_formatted
                              : "₹0.00"}
                          </TableCell>
                          <TableCell align="right" sx={{ pr: 5 }}>
                            {item.creditOrDebit === "Credit"
                              ? item.amount_formatted
                              : "₹0.00"}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/*The Total*/}
                      <TableRow>
                        <TableCell
                          sx={{
                            borderRight: "1px solid #dddddd",
                            bgcolor: "#f6f6fa !important",
                          }}
                        ></TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderRight: "1px solid #dddddd",
                            bgcolor: "#f6f6fa",
                            color: "#3f6de0 !important",
                          }}
                        >
                          {data?.total_amount_formatted}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            bgcolor: "#f6f6fa",
                            pr: 5,
                            color: "#3f6de0 !important",
                          }}
                        >
                          {data?.total_amount_formatted}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ))}
            </>
          )}

          {/*Pagination Section*/}
          {totalRecords > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderTop: "1px solid #e0e0e0",
                bgcolor: "#f9f9f9",
              }}
            >
              {/* Left side - Records info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "13px", color: "#666" }}>
                    Show
                  </Typography>
                  <FormControl size="small">
                    <Select
                      value={recordsPerPage}
                      onChange={handleRecordsPerPageChange}
                      sx={{
                        fontSize: "13px",
                        minWidth: "60px",
                        height: "32px",
                        "& .MuiSelect-select": {
                          padding: "8px 12px",
                        },
                      }}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography sx={{ fontSize: "13px", color: "#666" }}>
                    entries
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "13px", color: "#666" }}>
                  Showing {startRecord} to {endRecord} of {totalRecords} entries
                </Typography>
              </Box>

              {/* Right side - Pagination controls */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(null, currentPage - 1)}
                  sx={{
                    width: "32px",
                    height: "32px",
                    border: "1px solid #e0e0e0",
                    bgcolor: currentPage === 1 ? "#f5f5f5" : "white",
                    "&:hover": {
                      bgcolor: currentPage === 1 ? "#f5f5f5" : "#f0f0f0",
                    },
                  }}
                >
                  <ChevronLeft size={16} />
                </IconButton>

                {/* Page numbers */}
                {(() => {
                  const pageNumbers = [];
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  // Show first page if not in range
                  if (startPage > 1) {
                    pageNumbers.push(
                      <Button
                        key={1}
                        variant={currentPage === 1 ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handlePageChange(null, 1)}
                        sx={{
                          minWidth: "32px",
                          height: "32px",
                          fontSize: "13px",
                          bgcolor: currentPage === 1 ? "#1976d2" : "white",
                          color: currentPage === 1 ? "white" : "#333",
                          border: "1px solid #e0e0e0",
                          "&:hover": {
                            bgcolor: currentPage === 1 ? "#1565c0" : "#f0f0f0",
                          },
                        }}
                      >
                        1
                      </Button>
                    );
                    if (startPage > 2) {
                      pageNumbers.push(
                        <Typography key="ellipsis1" sx={{ px: 1, fontSize: "13px" }}>
                          ...
                        </Typography>
                      );
                    }
                  }

                  // Show page numbers in range
                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handlePageChange(null, i)}
                        sx={{
                          minWidth: "32px",
                          height: "32px",
                          fontSize: "13px",
                          bgcolor: currentPage === i ? "#1976d2" : "white",
                          color: currentPage === i ? "white" : "#333",
                          border: "1px solid #e0e0e0",
                          "&:hover": {
                            bgcolor: currentPage === i ? "#1565c0" : "#f0f0f0",
                          },
                        }}
                      >
                        {i}
                      </Button>
                    );
                  }

                  // Show last page if not in range
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pageNumbers.push(
                        <Typography key="ellipsis2" sx={{ px: 1, fontSize: "13px" }}>
                          ...
                        </Typography>
                      );
                    }
                    pageNumbers.push(
                      <Button
                        key={totalPages}
                        variant={currentPage === totalPages ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handlePageChange(null, totalPages)}
                        sx={{
                          minWidth: "32px",
                          height: "32px",
                          fontSize: "13px",
                          bgcolor: currentPage === totalPages ? "#1976d2" : "white",
                          color: currentPage === totalPages ? "white" : "#333",
                          border: "1px solid #e0e0e0",
                          "&:hover": {
                            bgcolor: currentPage === totalPages ? "#1565c0" : "#f0f0f0",
                          },
                        }}
                      >
                        {totalPages}
                      </Button>
                    );
                  }

                  return pageNumbers;
                })()}

                <IconButton
                  size="small"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(null, currentPage + 1)}
                  sx={{
                    width: "32px",
                    height: "32px",
                    border: "1px solid #e0e0e0",
                    bgcolor: currentPage === totalPages ? "#f5f5f5" : "white",
                    "&:hover": {
                      bgcolor: currentPage === totalPages ? "#f5f5f5" : "#f0f0f0",
                    },
                  }}
                >
                  <ChevronRight size={16} />
                </IconButton>
              </Box>
            </Box>
          )}

          {/*The Footer Below the Table*/}
          <Box
            sx={{ px: 3, pt: 2, pb: 7, display: "flex", alignItems: "center" }}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>
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
              }}
            >
              INR
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JournalReport;
