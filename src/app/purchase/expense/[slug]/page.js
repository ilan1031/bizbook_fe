// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Toolbar,
//   Menu,
//   MenuItem,
//   IconButton,
//   Box,
//   Divider,
//   Typography,
//   ListItemText,
//   ListItemIcon,
// } from "@mui/material";
// import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
// import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import apiService from "../../../../services/axiosService";
// import config from "../../../../services/config";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import StarIcon from "@mui/icons-material/Star";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { AddOutlined } from "@mui/icons-material";
// import Link from "next/link";
// import AddIcon from "@mui/icons-material/Add";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import SideBarTable from "../../SideBarList";
// import { usePathname, useRouter } from "next/navigation";
// import ExpenseViewComponent from "./ExpenseViewComponent";

// const expenseStatusOptions = [
//   {
//     id: "1",
//     default_customview_id: "2375679000000057003",
//     is_favorite: true,
//     title: "All",
//     value: "Status.Inactive",
//     key: "All",
//     empty_msg: "There are no Expense",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "2",
//     default_customview_id: "2375679000000057004",
//     is_favorite: true,
//     title: "Unbilled",
//     value: "Status.Inactive",
//     key: "Unbilled",
//     empty_msg: "There are no Unbilled",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "3",
//     default_customview_id: "2375679000000057005",
//     is_favorite: false,
//     title: "Invoiced",
//     value: "Status.Inactive",
//     key: "Invoiced ",
//     empty_msg: "There are no Invoiced",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "4",
//     default_customview_id: "2375679000000057005",
//     is_favorite: false,
//     title: "Reimbursed",
//     value: "Status.Inactive",
//     key: "Invoiced ",
//     empty_msg: "There are no Reimbursed",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "5",
//     default_customview_id: "2375679000000057005",
//     is_favorite: false,
//     title: "Billable",
//     value: "Status.Inactive",
//     key: "Billable ",
//     empty_msg: "There are no Billable",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "6",
//     default_customview_id: "2375679000000057005",
//     is_favorite: false,
//     title: "Non-Billable",
//     value: "Status.Inactive",
//     key: "Non-Billable ",
//     empty_msg: "There are no Non-Billable",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "7",
//     default_customview_id: "2375679000000057005",
//     is_favorite: false,
//     title: "With Receipts",
//     value: "Status.Inactive",
//     key: "With Receipts ",
//     empty_msg: "There are no With Receipts",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "8",
//     default_customview_id: "2375679000000057005",
//     is_favorite: false,
//     title: "Without Receipts",
//     value: "Status.Inactive",
//     key: "Without Receipts ",
//     empty_msg: "There are no Without Receipts",
//     column_orientation_type: "wrap",
//   },
// ];

// const menuItems = [
//   {
//     text: "Sort by",
//     icon: (
//       <KeyboardArrowRightIcon
//         sx={{ fontSize: 14, color: "#408dfb", marginLeft: "-50px" }}
//       />
//     ),
//     iconPosition: "right",
//   },
//   {
//     text: "Import Expenses",
//     icon: <FileDownloadOutlinedIcon sx={{ fontSize: 14, color: "#4285F4" }} />,
//   },
//   {
//     text: "Export Expenses",
//     icon: <FileUploadOutlinedIcon sx={{ fontSize: 14, color: "#408dfb" }} />,
//   },
//   {
//     text: "Export Current View",
//     icon: <FileUploadOutlinedIcon sx={{ fontSize: 14, color: "#408dfb" }} />,
//   },
//   {
//     text: "Import Credit Notes",
//     icon: <FileDownloadOutlinedIcon sx={{ fontSize: 14, color: "#408dfb" }} />,
//   },
//   {
//     text: "Preferences",
//     icon: <SettingsOutlinedIcon sx={{ fontSize: 14, color: "#408dfb" }} />,
//   },
//   {
//     text: "Refresh List",
//     icon: <RefreshOutlinedIcon sx={{ fontSize: 14, color: "#408dfb" }} />,
//   },
// ];

// const Page = () => {
//   const [statusOptions, setStatusOptions] = useState(expenseStatusOptions);
//   const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
//   const [expenseList, setExpenseList] = useState([]);
//   const [theFilteredArray, setTheFilteredArray] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const pathname = usePathname();
//   const router = useRouter();
//   const [selectedValue, setSelectedValue] = useState(null);

//   useEffect(() => {
//     getExpenses();
//   }, []);

//   const getExpenses = async () => {
//     setLoading(true);
//     let OrgId = localStorage.getItem("organization_id");
//     let params = {
//       method: "GET",
//       url: `api/v1/expense/get-expense?org_id=${OrgId}`,
//       customBaseUrl: config.PO_Base_url,
//     };
//     try {
//       const response = await apiService(params);
//       if (response.statusCode === 200) {
//         const expenses = response.data.data;
//         if (expenses.length == 0) {
//         }
//         setExpenseList(expenses);
//         setTheFilteredArray(expenses);
//         console.log(expenses, "The Status of our data");
//       }
//     } catch (error) {
//       console.error("Error fetching purchase orders", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDropdownClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelectStatus = (status) => {
//     setSelectedStatus(status);
//     setAnchorEl(null);

//     if (expenseList && expenseList.length > 0) {
//       let filtered = [];

//       switch (status.title) {
//         case "All Expenses":
//           filtered = [...expenseList];
//           break;
//         case "Billable Expenses":
//           filtered = expenseList.filter(
//             (expense) => expense.status_type === "Billable"
//           );
//           break;
//         case "Non-Billable Expenses":
//           filtered = expenseList.filter(
//             (expense) => expense.status_type === "Non-Billable"
//           );
//           break;
//         case "Invoiced Expenses":
//           filtered = expenseList.filter(
//             (expense) => expense.status_type === "Invoiced"
//           );
//           break;
//         default:
//           filtered = [...expenseList];
//       }

//       setTheFilteredArray(filtered);
//     }
//   };

//   const toggleFavorite = (id) => {
//     const updatedOptions = statusOptions.map((option) =>
//       option.id === id
//         ? { ...option, is_favorite: !option.is_favorite }
//         : option
//     );
//     setStatusOptions(updatedOptions);
//   };

//   const handleNewCustomView = () => {
//     setAnchorEl(null);
//   };

//   const handleSelectRow = (key) => {

//     const activeID = pathname.split("/")[3];

//     // Ensure we create a new array to avoid mutating state
//     const newArray = theFilteredArray.map((item) => ({
//       ...item,
//       isActive: item.bill_number === activeID ? true : item.isActive,
//     }));
//     // return;
//     router.push(`/purchase/expense/${key._id}`);
//   };

//   const handleRowClick = (row) => {
//     return;
//   };

//   const favoriteOptions = statusOptions.filter((opt) => opt.is_favorite);
//   const defaultOptions = statusOptions.filter((opt) => !opt.is_favorite);

//   {/*Html Element Starts Here*/}

//   return (
//     <Box>
//       <Box sx={{ display: "flex", width: "100%", height: "90vh" }}>
//         <Box
//           sx={{
//             width: "340px",
//             backgroundColor: "white",
//             flexShrink: 0,
//             display: "flex",
//             flexDirection: "column",
//             height: "100%",
//           }}
//         >
//           {/* SideBarHeader */}

//           <Toolbar
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               padding: "0px",
//               position: "sticky",
//               top: 0,
//               zIndex: 1000,
//               backgroundColor: "white",
//               borderBottom: "1px solid #e0e0e0",
//             }}
//           >
//             <Typography
//               onClick={handleDropdownClick}
//               style={{
//                 fontWeight: 600,
//                 fontSize: "15px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               {selectedStatus.title.length > 15
//                 ? `${selectedStatus.title.slice(0, 15)}...`
//                 : selectedStatus.title}
//               <KeyboardArrowDownIcon
//                 color="primary"
//                 sx={{
//                   fontWeight: 600,
//                   fontSize: "30px",
//                   marginLeft: "1px",
//                 }}
//               />
//             </Typography>

//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               PaperProps={{
//                 elevation: 3,
//                 sx: {
//                   width: 250,
//                   // height: "360px",
//                   marginLeft: "-10px",
//                   maxHeight: 500,
//                   overflowY: "auto", // Scrollable content
//                   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Smooth shadow
//                   borderRadius: "8px",
//                   mt: 1,
//                   "&::-webkit-scrollbar": {
//                     width: "6px",
//                   },
//                   "&::-webkit-scrollbar-thumb": {
//                     backgroundColor: "#888",
//                     borderRadius: "10px",
//                   },
//                   "&::-webkit-scrollbar-thumb:hover": {
//                     backgroundColor: "#555",
//                   },
//                   "& .MuiList-root": {
//                     padding: "0px",
//                   },
//                 },
//               }}
//             >
//               <Box
//                 sx={{
//                   maxHeight: "310px", // Limit scroll height
//                   overflowY: "auto",
//                   "&::-webkit-scrollbar": {
//                     width: "6px",
//                   },
//                   "&::-webkit-scrollbar-thumb": {
//                     backgroundColor: "#888",
//                     borderRadius: "10px",
//                   },
//                 }}
//               >
//                 {favoriteOptions.length > 0 && (
//                   <>
//                     <Typography
//                       sx={{
//                         fontSize: "13px",
//                         fontWeight: 600,
//                         color: "black",
//                         px: 2,
//                         py: 1,
//                       }}
//                     >
//                       FAVORITES
//                     </Typography>
//                     <Divider />
//                     {favoriteOptions.map((option) => (
//                       <MenuItem
//                         key={option.id}
//                         onClick={() => handleSelectStatus(option)}
//                         sx={{
//                           backgroundColor:
//                             selectedStatus.id === option.id
//                               ? "#E6F1FF"
//                               : "transparent",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           px: 2,
//                           py: 1,
//                           "&:hover": {
//                             backgroundColor: "#408dfb", // Hover effect color
//                             color: "white",
//                           },
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "14px",
//                             fontWeight:
//                               selectedStatus.id === option.id ? 600 : 400,
//                             color:
//                               selectedStatus.id === option.id
//                                 ? "#4285F4"
//                                 : "inherit",
//                           }}
//                         >
//                           {option.title}
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleFavorite(option.id);
//                           }}
//                           sx={{ padding: 0 }}
//                         >
//                           <StarIcon
//                             sx={{
//                               fontSize: 18,
//                               color: "orange",
//                             }}
//                           />
//                         </IconButton>
//                       </MenuItem>
//                     ))}
//                     {favoriteOptions.length > 0 &&
//                       defaultOptions.length > 0 && <Divider />}
//                   </>
//                 )}

//                 {defaultOptions.length > 0 && (
//                   <>
//                     <Typography
//                       sx={{
//                         fontSize: "13px",
//                         fontWeight: 600,
//                         color: "black",
//                         px: 2,
//                         py: 1,
//                       }}
//                     >
//                       DEFAULT FILTERS
//                     </Typography>
//                     <Divider />
//                     {defaultOptions.map((option) => (
//                       <MenuItem
//                         key={option.id}
//                         onClick={() => handleSelectStatus(option)}
//                         sx={{
//                           backgroundColor:
//                             selectedStatus.id === option.id
//                               ? "#E6F1FF"
//                               : "transparent",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           px: 2,
//                           py: 1,
//                           "&:hover": {
//                             backgroundColor: "#408dfb", // Hover effect color
//                             color: "white",
//                           },
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "14px",
//                             fontWeight:
//                               selectedStatus.id === option.id ? 600 : 400,
//                             color:
//                               selectedStatus.id === option.id
//                                 ? "#4285F4"
//                                 : "inherit",
//                           }}
//                         >
//                           {option.title}
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleFavorite(option.id);
//                           }}
//                           sx={{ padding: 0 }}
//                         >
//                           {option.is_favorite ? (
//                             <StarIcon
//                               sx={{
//                                 fontSize: 18,
//                                 color: "#4285F4",
//                               }}
//                             />
//                           ) : (
//                             <StarBorderIcon
//                               sx={{
//                                 fontSize: 18,
//                                 color: "#888",
//                               }}
//                             />
//                           )}
//                         </IconButton>
//                       </MenuItem>
//                     ))}
//                   </>
//                 )}
//               </Box>

//               {/* New Custom View Fixed at Bottom */}
//               <Divider />
//               <MenuItem
//                 onClick={handleNewCustomView}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   px: 2,
//                   py: 1,
//                   mt: "5px",
//                   position: "sticky",
//                   bottom: 0,
//                   backgroundColor: "white", // Ensure it stays on top
//                   zIndex: 1,
//                   "&:hover": {
//                     backgroundColor: "#E6F1FF",
//                   },
//                 }}
//               >
//                 <IconButton
//                   size="small"
//                   sx={{
//                     backgroundColor: "#4285F4",
//                     width: 20,
//                     height: 20,
//                     borderRadius: "50%",
//                     marginRight: 1,
//                   }}
//                 >
//                   <AddIcon
//                     sx={{
//                       fontSize: 14,
//                       color: "white",
//                     }}
//                   />
//                 </IconButton>
//                 <Typography
//                   sx={{
//                     fontSize: "14px",
//                     color: "#4285F4",
//                   }}
//                 >
//                   New Custom View
//                 </Typography>
//               </MenuItem>
//             </Menu>

//             <Box>
//               <Link href="/purchase/expense/newexpense">
//                 <IconButton
//                   sx={{
//                     backgroundColor: "#4285F4",
//                     color: "white",
//                     borderRadius: "4px",
//                     "&:hover": {
//                       backgroundColor: "#3367d6",
//                     },
//                     height: "32px",
//                   }}
//                 >
//                   <AddOutlined sx={{ fontSize: 18 }} />
//                   <Typography
//                     sx={{
//                       color: "white",
//                       fontSize: "12px",
//                       paddingLeft: "4px",
//                       paddingRight: "8px",
//                     }}
//                   >
//                     New
//                   </Typography>
//                 </IconButton>
//               </Link>

//               <IconButton
//                 onClick={(e) => setMenuAnchorEl(e.currentTarget)}
//                 sx={{
//                   color: "#555",
//                   marginLeft: "4px",
//                 }}
//               >
//                 <MoreVertIcon />
//               </IconButton>

//               <Menu
//                 anchorEl={menuAnchorEl}
//                 open={Boolean(menuAnchorEl)}
//                 onClose={() => setMenuAnchorEl(null)}
//                 PaperProps={{
//                   elevation: 3,
//                   sx: {
//                     mt: "10px",
//                     ml: "-170px",
//                     borderRadius: "8px",
//                     padding: "4px",
//                     fontSize: "13px",
//                     minWidth: "210px",
//                     "& .MuiList-root": {
//                       padding: "4px",
//                     },
//                   },
//                 }}
//               >
//                 {menuItems.map((item) => (
//                   <MenuItem
//                     key={item.text}
//                     onClick={() => setMenuAnchorEl(null)}
//                     sx={{
//                       borderRadius: "6px",
//                       fontSize: "13px",
//                       paddingRight: "20px",
//                       margin: "1px 0",
//                       padding: "8px 8px",
//                       width: "155px",
//                       color: "black",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       "&:hover": {
//                         width: "200px",
//                         backgroundColor: "#408dfb",
//                         color: "white",
//                         "& .MuiSvgIcon-root": {
//                           color: "white !important",
//                         },
//                       },
//                     }}
//                   >
//                     {item.iconPosition !== "right" && (
//                       <ListItemIcon sx={{ minWidth: "28px" }}>
//                         {item.icon}
//                       </ListItemIcon>
//                     )}
//                     <ListItemText
//                       primaryTypographyProps={{ fontSize: "13px" }}
//                       primary={item.text}
//                     />
//                     {item.iconPosition === "right" && (
//                       <ListItemIcon sx={{ minWidth: 0 }}>
//                         {item.icon}
//                       </ListItemIcon>
//                     )}
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>
//           </Toolbar>

//           {loading ? (
//             <></>
//           ) : (
//             <Box sx={{overflowY:"auto"}}>
//             <SideBarTable
//               staticData={theFilteredArray}
//               // selected={selected}
//               handleSelectRow={handleSelectRow}
//               onRowClick={handleRowClick}
//               type={"Expense"}
//               setSelectedValue={setSelectedValue}
//             />
//             </Box>
//           )}
//         </Box>

//         {/* View Component */}

//         <Box sx={{flexGrow:1}}>

//             <ExpenseViewComponent />

//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Page;

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Button,
  Typography,
  ListItemText,
  ListItemIcon,
  Skeleton,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  ListAlt,
} from "@mui/icons-material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SideBarTable from "../../SideBarList";
import { usePathname, useRouter } from "next/navigation";
import ExpenseViewComponent from "./ExpenseViewComponent";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";

// SideBarSkeleton component for the sidebar list items
const SideBarSkeleton = () => {
  const expenseListColumns = [
    { width: "40%" }, // Expense description
    { width: "30%" }, // Amount
    { width: "30%" }, // Date
  ];

  return (
    <Box sx={{ width: "100%", p: 1, overflowY: "auto" }}>
      {/* Generate 10 skeleton rows */}
      {[...Array(10)].map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ p: 1, mb: 1 }}>
          {/* First row in each item */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            {expenseListColumns.map((col, colIndex) => (
              <Skeleton
                key={colIndex}
                variant="text"
                width={col.width}
                height={24}
                animation="wave"
              />
            ))}
          </Box>

          {/* Second row in each item */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
            <Skeleton variant="text" width="25%" height={20} animation="wave" />
          </Box>

          {/* Third row in each item */}
          <Skeleton variant="text" width="40%" height={18} animation="wave" />
          <Divider sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );
};

// EmptyStateNotification component for when there's no data
const EmptyStateNotification = ({ selectedStatus }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
        height: "100%",
        minHeight: "300px",
      }}
    >
     
      <Typography
        variant="h6"
        sx={{
          color: "#666",
          fontSize: "16px",
          fontWeight: "500",
          marginBottom: "8px",
        }}
      >
        No {selectedStatus?.title || "Expenses"} Found
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#999",
          fontSize: "14px",
          maxWidth: "250px",
          lineHeight: "1.4",
        }}
      >
      </Typography>
    </Box>
  );
};

const paymentMadeOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Expenses",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no Expense",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Non-Billable Expenses",
    value: "Status.Nonbillable",
    key: "Nonbillable ",
    empty_msg: "There are no Non-Billable",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057004",
    is_favorite: false,
    title: "Unbilled Expenses",
    value: "Status.Unbilled",
    key: "Unbilled",
    empty_msg: "There are no Unbilled",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Invoiced Expenses",
    value: "Status.Invoiced",
    key: "Invoiced ",
    empty_msg: "There are no Invoiced",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Reimbursed Expenses",
    value: "Status.Reimbursed",
    key: "Reimbursed ",
    empty_msg: "There are no Reimbursed",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "With Receipts Expenses",
    value: "Status.Withreceipts",
    key: "Withreceipts ",
    empty_msg: "There are no Reimbursed",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Without Receipts Expenses",
    value: "Status.Withoutreceipts",
    key: "Withoutreceipts ",
    empty_msg: "There are no Reimbursed",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "date", label: "Date", order: "D" },
      { key: "invoice_number", label: "Reference#", order: "D" },
      {
        key: "vendor_name",
        label: "Vendor Name",
        order: "D",
      },
      { key: "paid_through_account_id", label: "Paid Through", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "tot_amount", label: "Amount", order: "D" },
      { key: "createdAt", label: "Created Time", order: "D" },
    ],
  },
  {
    text: "Import Expenses",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Expenses",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Export Current View",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAlt className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const Page = () => {
  const [statusOptions, setStatusOptions] = useState(paymentMadeOptions);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [expenseList, setExpenseList] = useState([]);
  const [theFilteredArray, setTheFilteredArray] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState("Status.All");
  const pathname = usePathname();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(null);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("vendor_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  useEffect(() => {
    getExpenses(filterBy, sortColumn, sortOrder);
  }, []);

  const getExpenses = async (filter, sort_column, sort_order) => {
    setLoading(true);
    let OrgId = localStorage.getItem("organization_id");
    let params = {
      method: "GET",
      url: `api/v1/expense/get-expense?org_id=${OrgId}`,
      customBaseUrl: config.PO_Base_url,
      params: {
        page: page.current,
        limit: limit.current,
        sort_column: sort_column,
        sort_order: sort_order,
        filter: filter,
      },
    };
    try {
      // Add a short delay to demonstrate the skeleton loader (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = await apiService(params);
      if (response.statusCode === 200) {
        const expenses = response.data.data;
        if (expenses.length == 0) {
        }
        setExpenseList(expenses);
        setTheFilteredArray(expenses);
        // console.log(expenses, "The Status of our data");
      }
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setAnchorEl(null);

    if (expenseList && expenseList.length > 0) {
      let filtered = [];

      switch (status.title) {
        case "All Expenses":
          filtered = [...expenseList];
          break;
        case "Billable Expenses":
          filtered = expenseList.filter(
            (expense) => expense.status_type === "Billable"
          );
          break;
        case "Non-Billable Expenses":
          filtered = expenseList.filter(
            (expense) => expense.status_type === "Non-Billable"
          );
          break;
        case "Invoiced Expenses":
          filtered = expenseList.filter(
            (expense) => expense.status_type === "Invoiced"
          );
          break;
        default:
          filtered = [...expenseList];
      }

      setTheFilteredArray(filtered);
    }
  };

  const toggleFavorite = (id) => {
    const updatedOptions = statusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setStatusOptions(updatedOptions);
  };

  const handleNewCustomView = () => {
    setAnchorEl(null);
  };

  const handleSelectRow = (key) => {
    const activeID = pathname.split("/")[3];

    // Ensure we create a new array to avoid mutating state
    const newArray = theFilteredArray.map((item) => ({
      ...item,
      isActive: item.bill_number === activeID ? true : item.isActive,
    }));

    router.push(`/purchase/expense/${key.unique_EX_id}`);
  };

  const handleRowClick = (row) => {
    return;
  };

  const favoriteOptions = statusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = statusOptions.filter((opt) => !opt.is_favorite);

  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%", height: "90vh" }}>
        <Box
          sx={{
            width: "340px",
            backgroundColor: "white",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* SideBarHeader */}
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              onClick={handleDropdownClick}
              style={{
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {selectedStatus.title.length > 15
                ? `${selectedStatus.title.slice(0, 15)}...`
                : selectedStatus.title}
              <KeyboardArrowDownIcon
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontSize: "30px",
                  marginLeft: "1px",
                }}
              />
            </Typography>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: 250,
                  // height: "360px",
                  marginLeft: "-10px",
                  maxHeight: 500,
                  overflowY: "auto", // Scrollable content
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Smooth shadow
                  borderRadius: "8px",
                  mt: 1,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                  "& .MuiList-root": {
                    padding: "0px",
                  },
                },
              }}
            >
              <Box
                sx={{
                  maxHeight: "310px", // Limit scroll height
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                }}
              >
                {favoriteOptions.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "black",
                        px: 2,
                        py: 1,
                      }}
                    >
                      FAVORITES
                    </Typography>
                    <Divider />
                    {favoriteOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        onClick={() => handleSelectStatus(option)}
                        sx={{
                          backgroundColor:
                            selectedStatus.id === option.id
                              ? "primary.main"
                              : "transparent",
                          color:
                            selectedStatus.id === option.id
                              ? "menu.text.normal"
                              : "menu.text.default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "primary.main",
                            "& .MuiTypography-root": {
                              color: "menu.text.normal",
                            },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              selectedStatus.id === option.id ? 500 : 400,
                            color:
                              selectedStatus.id === option.id
                                ? "menu.text.normal"
                                : "menu.text.default",
                          }}
                        >
                          {option.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(option.id, e)}
                          sx={{ padding: 0 }}
                        >
                          <StarIcon
                            fontSize="small"
                            sx={{ color: "#f3cf00" }}
                          />
                        </IconButton>
                      </MenuItem>
                    ))}
                    {favoriteOptions.length > 0 &&
                      defaultOptions.length > 0 && <Divider />}
                  </>
                )}

                {defaultOptions.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "black",
                        px: 2,
                        py: 1,
                      }}
                    >
                      DEFAULT FILTERS
                    </Typography>
                    <Divider />
                    {defaultOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        onClick={() => handleSelectStatus(option)}
                        sx={{
                          backgroundColor:
                            selectedStatus.id === option.id
                              ? "primary.main"
                              : "transparent",
                          color:
                            selectedStatus.id === option.id
                              ? "menu.text.normal"
                              : "menu.text.default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "primary.main", // Hover effect color
                            "& .MuiTypography-root": {
                              color: "menu.text.normal",
                            },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              selectedStatus.id === option.id ? 500 : 400,
                            color:
                              selectedStatus.id === option.id
                                ? "menu.text.normal"
                                : "menu.text.default",
                          }}
                        >
                          {option.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(option.id, e)}
                          sx={{ padding: 0 }}
                        >
                          {option.is_favorite ? (
                            <StarIcon
                              sx={{
                                fontSize: 18,
                                color: "#4285F4",
                              }}
                            />
                          ) : (
                            <StarBorderIcon
                              sx={{
                                fontSize: 18,
                                color: "#888",
                              }}
                            />
                          )}
                        </IconButton>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Box>

              {/* New Custom View Fixed at Bottom */}
              <Divider />
              <MenuItem
                onClick={handleNewCustomView}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "white", // Ensure it stays on top
                  zIndex: 1,
                  "&:hover": {
                    backgroundColor: "#E6F1FF",
                  },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "primary.main",
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                >
                  <AddIcon
                    sx={{
                      fontSize: 10,
                      color: "menu.text.normal",
                    }}
                  />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "primary.main",
                  }}
                >
                  New Custom View
                </Typography>
              </MenuItem>
            </Menu>

            <Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  width: "30px",
                  height: "30px",
                  minWidth: "20px", // ensures the button doesn't expand due to internal padding
                  padding: 0, // removes internal padding
                  marginRight: "10px",
                  borderRadius: "5px",
                }}
                onClick={() => router.push("/purchase/expense/newexpense")}
              >
                <AddOutlined sx={{ fontSize: "16px" }} />{" "}
              </Button>
              <IconButton
                className="more-icon"
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon className="button-more-svg" />
              </IconButton>

              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: "10px",
                    ml: "-170px",
                    borderRadius: "8px",
                    padding: "4px",
                    fontSize: "13px",
                    minWidth: "210px",
                    "& .MuiList-root": {
                      padding: "4px",
                    },
                  },
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onMouseEnter={(e) => {
                      if (item.submenu) {
                        setSubmenuAnchorEl(e.currentTarget);
                      } else {
                        setSubmenuAnchorEl(null);
                      }
                    }}
                    onMouseLeave={(e) => {
                      setSubmenuAnchorEl(null);
                    }}
                    onClick={() => {
                      if (!item.submenu) handleMenuItemClick(item.text);
                    }}
                    sx={{
                      backgroundColor:
                        menuAnchorEl && item.submenu
                          ? "primary.main"
                          : "transparent",
                      color:
                        menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                      borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
                      "& .menu-icon": {
                        color:
                          menuAnchorEl &&
                          item.submenu &&
                          "menu.text.normal !important",
                      },
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "menu.text.normal",
                        borderRadius: "5px",
                        "& .menu-icon": {
                          color: "menu.text.normal !important",
                        },
                      },
                      borderBottom: item.border ? "1px solid #ddd" : "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {item.icon}
                        <Typography
                          sx={{
                            ml: item.iconPosition === "right" ? 0 : 2,
                            fontSize: "13px",
                            fontWeight: item.hasArrow ? 500 : 400,
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                      {item.hasArrow && <ChevronRight className="menu-icon" />}
                    </Box>
                    {/* Submenu */}
                    {item.submenu && (
                      <Menu
                        anchorEl={submenuAnchorEl}
                        open={Boolean(
                          submenuAnchorEl &&
                            submenuAnchorEl.textContent.includes(item.text)
                        )}
                        onClose={() => setSubmenuAnchorEl(null)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        PaperProps={{
                          onMouseEnter: () => {
                            clearTimeout(submenuCloseTimeout.current);
                            setSubmenuHover(true);
                          },
                          onMouseLeave: () => {
                            setSubmenuHover(false);
                            submenuCloseTimeout.current = setTimeout(() => {
                              setSubmenuAnchorEl(null);
                            }, 200);
                          },
                          sx: {
                            ml: "",
                            fontSize: "12px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
                          },
                        }}
                      >
                        {item.submenu.map((subItem) => (
                          <MenuItem
                            key={subItem.key}
                            onClick={() => {
                              setSubmenuAnchorEl(null);
                              setMenuAnchorEl(null);
                              setSortColumn(subItem.key);
                              getExpenses(filterBy, subItem.key, subItem.order); // default order
                            }}
                            selected={sortColumn === subItem.key}
                            sx={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 1,
                              "&:hover": {
                                backgroundColor: "primary.main !important",
                                color: "menu.text.default",
                                "& .sort-icon": {
                                  color: "menu.text.default",
                                },
                              },
                              backgroundColor:
                                sortColumn === subItem.key
                                  ? "primary.main !important"
                                  : "transparent",
                              color:
                                sortColumn === subItem.key
                                  ? "menu.text.default !important"
                                  : "",
                              fontWeight:
                                sortColumn === subItem.key ? 600 : 400,
                            }}
                          >
                            <Typography sx={{ fontSize: "12px" }}>
                              {subItem.label}
                            </Typography>

                            <Box
                              onClick={(e) => {
                                e.stopPropagation();
                                const newOrder =
                                  subItem.order === "D" ? "A" : "D";
                                subItem.order = newOrder; // mutate local config or handle externally
                                setSortOrder(newOrder);
                                setSortColumn(subItem.key);
                                setSubmenuAnchorEl(null);
                                setMenuAnchorEl(null);
                                getExpenses(filterBy, subItem.key, newOrder);
                              }}
                              sx={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {subItem.order === "D" ? (
                                <ArrowDownward
                                  fontSize="inherit"
                                  className="sort-icon"
                                />
                              ) : (
                                <ArrowUpward
                                  fontSize="inherit"
                                  className="sort-icon"
                                />
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>

          {/* Sidebar content with skeleton loading state */}
          <Box sx={{ overflowY: "auto" }}>
            {loading ? (
              <SideBarSkeleton />
            ) : (
              <SideBarTable
                staticData={theFilteredArray}
                handleSelectRow={handleSelectRow}
                onRowClick={handleRowClick}
                type={"Expense"}
                setSelectedValue={setSelectedValue}
              />
            )}
          </Box>
        </Box>

        {/* View Component */}
        <Box sx={{ flexGrow: 1 }}>
          <ExpenseViewComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
