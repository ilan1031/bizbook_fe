// "use client";
// import { useEffect, useRef, useState } from "react";
// import {
//   Toolbar,
//   Button,
//   Menu,
//   MenuItem,
//   IconButton,
//   Box,
//   Divider,
//   Typography,
//   Skeleton,
// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import {
//   AddOutlined,
//   ArrowDownward,
//   ArrowUpward,
//   ListAlt,
// } from "@mui/icons-material";
// import SalesSideTable from "../../../../../src/app/common/SalesSideTable";
// import ViewComponent from "../../../../../src/app/sales/salesOrder/viewComponent";
// import CustomFilterMenu from "../../../common/customFilterMenu";
// import SearchModal from "../../../common/searchModal";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import apiService from "../../../../../src/services/axiosService";
// import config from "../../../../../src/services/config";
// import DotLoader from "../../../../components/DotLoader";
// import {
//   ChevronRight,
//   Download,
//   RefreshCcw,
//   Settings,
//   Upload,
// } from "lucide-react";
// import ExportModal from "../../../common/export/ExportModal";
// import SideBarTable from "../../SideBarList";
// import View from "../view/view";

// const dummyDefaultFilters = [
//   {
//     id: "1",
//     isFavorite: false,
//     label: "All",
//     value: "Status.All",
//     key: "Recurring Bills",
//     empty_msg: "There are no recurring Bills",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "2",
//     isFavorite: false,
//     label: "Active",
//     value: "Status.Active",
//     key: "Recurring Bills Active",
//     empty_msg: "There are no active recurring Bills",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "3",
//     isFavorite: false,
//     label: "Stopped",
//     value: "Status.Stopped",
//     key: "Recurring Bills Stopped",
//     empty_msg: "There are no stopped recurring Bills",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "4",
//     isFavorite: false,
//     label: "Expired",
//     value: "Status.Expired",
//     key: "Recurring Bills Expired",
//     empty_msg: "There are no expired recurring bills",
//     column_orientation_type: "wrap",
//   },
// ];

// // Updated dummyFavorites as an empty array that will be populated
// const dummyFavorites = [];

// const menuItems = [
//   {
//     text: "Sort by",
//     icon: null,
//     hasArrow: true,
//     border: true,
//     iconPosition: "right",
//     submenu: [
//       { key: "createdAt", label: "Created Time", order: "D" },
//       {
//         key: "vendor_name",
//         label: "Vendor Name",
//         order: "D",
//       },
//       { key: "recurrence_name", label: "Profile Name", order: "D" },
//       { key: "next_bill_date", label: "Next Bill Date", order: "D" },
//       { key: "total", label: "Amount", order: "D" },
//     ],
//   },
//   {
//     text: "Import Recurring Bills",
//     icon: <Download className="menu-icon" />,
//     hasArrow: false,
//     primary: false,
//     border: false,
//   },
//   {
//     text: "Exports",
//     icon: <Upload className="menu-icon" />,
//     hasArrow: false,
//     primary: false,
//     border: true,
//     submenu: [
//       { key: "createdAt", label: "Export Recurring Bills", order: "D" },
//       {
//         key: "vendor_name",
//         label: "Export Current View",
//       },
//     ],
//   },
//   {
//     text: "Refresh List",
//     icon: <RefreshCcw className="menu-icon" />,
//     hasArrow: false,
//     primary: false,
//     border: false,
//   },
// ];

// const SideBarSkeleton = () => {
//   const paymentListColumns = [
//     { width: "40%" }, // Payment number/ID
//     { width: "30%" }, // Amount
//     { width: "30%" }, // Date
//   ];

//   return (
//     <Box sx={{ width: "100%", p: 1 }}>
//       {/* Generate 10 skeleton rows */}
//       {[...Array(10)].map((_, rowIndex) => (
//         <Box key={rowIndex} sx={{ p: 1, mb: 1 }}>
//           {/* First row in each item */}
//           <Box
//             sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
//           >
//             {paymentListColumns.map((col, colIndex) => (
//               <Skeleton
//                 key={colIndex}
//                 variant="text"
//                 width={col.width}
//                 height={24}
//                 animation="wave"
//               />
//             ))}
//           </Box>

//           {/* Second row in each item */}
//           <Box
//             sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
//           >
//             <Skeleton variant="text" width="60%" height={20} animation="wave" />
//             <Skeleton variant="text" width="25%" height={20} animation="wave" />
//           </Box>

//           {/* Third row in each item */}
//           <Skeleton variant="text" width="40%" height={18} animation="wave" />
//           <Divider sx={{ mt: 1 }} />
//         </Box>
//       ))}
//     </Box>
//   );
// };

// const SalesOrder = () => {
//   const [selectedType, setSelectedType] = useState("All");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//   const [selected, setSelected] = useState([]);
//   const [openSearchDialog, setOpenSearchDialog] = useState(false);
//   const [recurringList, setRecurringList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uniqueId, setUniqueId] = useState(null);
//   const [filterBy, setFilterBy] = useState("Status.All");
//   const [loadingView, setLoadingView] = useState(false);
//   const [recurringData, setRecurringData] = useState(null);
//   const [favorites, setFavorites] = useState(dummyFavorites);
//   const [filters, setFilters] = useState(dummyDefaultFilters);
//   const [selectedKey, setSelectedKey] = useState("");
//   const [totalCount, setTotalCount] = useState(0);
//   const [journalId, setJournalId] = useState(""); // This will be set when a bill is selected
//   const page = useRef(1);
//   const limit = useRef(100);
//   const [hasMore, setHasMore] = useState(false);
//   const router = useRouter();
//   const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
//   const [submenuHover, setSubmenuHover] = useState(false);
//   const [sortColumn, setSortColumn] = useState("recurrence_name");
//   const [sortOrder, setSortOrder] = useState("D");
//   let submenuCloseTimeout = useRef(null);
//   const searchParams = useSearchParams();
//   const slug = searchParams.get("slug");
//   const [selectedValue, setSelectedValue] = useState(null);
//   const allSelected =
//     recurringList.length > 0 && selected.length === recurringList.length;
//   const viewPage = useRef(1);
//   const viewLimit = useRef(3);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const handleRowClick = (row) => {
//     router.push(`/purchase/recurringbills/${row.recurring_bill_id}`);
//   };
//   const [childLoading, setChildLoading] = useState(false);

//   const [open, setOpen] = useState(false);
//   const handleMenuItemClick = (item) => {
//     if (item === "Export Sales Orders") {
//       setOpen(true);
//     } else if (item === "Refresh List") {
//       fetchRecurringList(filterBy, sortColumn, sortOrder);
//     }
//     setMenuAnchorEl(null);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSelectRow = (key) => {
//     router.push(`/purchase/recurringbills/${key.recurring_bill_id}`);
//   };

//   const callRecurring = (id, pageNo) => {
//     setChildLoading(true);
//     viewPage.current = pageNo;
//     getRecurringData(id, pageNo, viewLimit.current, filterStatus);
//     fetchRecurringList(filterBy, sortColumn, sortOrder);
//   };

//   const handleFilterStatus = (value) => {
//     console.log(value, "status value");
//     setFilterStatus(value);
//     getRecurringData(uniqueId, viewPage.current, viewLimit.current, value);
//   };

//   const handleSelect = (type, value, key) => {
//     setSelectedType(type + " Recurring Bills");
//     setSelectedKey(key);
//     setFilterBy(value);
//     page.current = 1;
//     limit.current = 10;
//     fetchRecurringList(value, sortColumn, sortOrder);
//     setAnchorEl(null);
//   };

//   useEffect(() => {
//     fetchRecurringList(filterBy, sortColumn, sortOrder);
//     const path = window.location.pathname; // "/sales/invoices/365756"
//     const segments = path.split("/")[3];
//     setUniqueId(segments);
//     getRecurring(segments);
//   }, []);

//   const getRecurring = (id) => {
//     setLoadingView(true);
//     getRecurringData(id, viewPage.current, viewLimit.current, filterStatus);
//   };

//   const organization_id = localStorage.getItem("organization_id");

//   const fetchRecurringList = async (
//     filterValue = "",
//     sort_column,
//     sort_order
//   ) => {
//     setLoading(true);
//     try {
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/recurring-bill`,
//         params: {
//           filter: filterValue,
//           page: page.current,
//           per_page: limit.current, // Fetch more at once for client-side pagination
//           sort_column: sort_column,
//           sort_order: sort_order,
//           limit: limit.current, // Increased to support client-side pagination
//           organization_id: organization_id,
//         },
//         customBaseUrl: config.PO_Base_url,
//         file: false,
//       });
//       setRecurringList(response.data.recurring_bills);
//       setTotalCount(response.data.totalCount);
//       setHasMore(response.data.page_context.has_more_page);
//       setLoading(false);
//     } catch (error) {
//       console.error(
//         "Error fetching quotes list:",
//         error.response?.data || error.message
//       );
//       setRecurringList([]); // Ensure recurringList remains an array
//       setLoading(false);
//     }
//   };

//   const getRecurringData = async (id, page, limit, filterValue) => {
//     try {
//       setRecurringData([]);
//       const response = await apiService({
//         method: "GET",
//         customBaseUrl: config.PO_Base_url,
//         params: {
//           page: page,
//           limit: limit,
//           filter_status: filterValue,
//         },
//         url: `/api/v1/recurring-bill/${id}?org_id=${organization_id}`,
//       });
//       setRecurringData(response.data.data);
//       setLoadingView(false);
//       setChildLoading(false);
//     } catch (error) {
//       console.error(
//         "Error fetching sales data:",
//         error.response?.data || error.message
//       );
//       setLoadingView(false);
//       setChildLoading(false);
//     }
//   };

//   const handleCloseSearchDialog = () => setOpenSearchDialog(false);

//   return (
//     <Box>
//       <Box
//         sx={{
//           display: "flex",
//           width: "100%",
//           height: "90vh",
//           overflow: "hidden",
//         }}
//       >
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
//           <Toolbar
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               padding: "0px",
//               position: "sticky",
//               top: 0,
//               zIndex: 1000,
//               backgroundColor: "white",
//             }}
//           >
//             <Button
//               onClick={(e) => setAnchorEl(e.currentTarget)}
//               endIcon={
//                 <KeyboardArrowDownIcon
//                   color="primary"
//                   sx={{ fontWeight: 600 }}
//                 />
//               }
//               color="black"
//               style={{
//                 fontWeight: 600,
//                 fontSize: "15px",
//                 textTransform: "none",
//               }}
//             >
//               {selectedType.length > 10
//                 ? `${selectedType.slice(0, 15)}...`
//                 : selectedType}
//             </Button>
//             {/* Custom Filter Menu */}
//             <CustomFilterMenu
//               anchorEl={anchorEl}
//               handleClose={() => setAnchorEl(null)}
//               favoritesData={favorites}
//               filtersData={filters}
//               onSelect={handleSelect}
//               onFavoriteToggle={(filter) => {
//                 const updatedFilters = filters.map((f) =>
//                   f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
//                 );
//                 setFilters(updatedFilters);
//                 const updatedFavorites = updatedFilters.filter(
//                   (f) => f.isFavorite
//                 );
//                 setFavorites(updatedFavorites);
//               }}
//               selectedType={selectedType}
//             />
//             <Box>
//               <Button
//                 variant="contained"
//                 size="small"
//                 sx={{
//                   width: "30px",
//                   height: "30px",
//                   minWidth: "20px", // ensures the button doesn't expand due to internal padding
//                   padding: 0, // removes internal padding
//                   marginRight: "10px",
//                   borderRadius: "5px",
//                 }}
//                 onClick={() =>
//                   router.push("/purchase/recurringBills/newRecurringBill")
//                 }
//               >
//                 <AddOutlined sx={{ fontSize: "16px" }} />{" "}
//               </Button>
//               <IconButton
//                 className="more-icon"
//                 onClick={(e) => setMenuAnchorEl(e.currentTarget)}
//               >
//                 <MoreVertIcon className="button-more-svg" />
//               </IconButton>
//               <Menu
//                 anchorEl={menuAnchorEl}
//                 open={Boolean(menuAnchorEl)}
//                 onClose={() => setMenuAnchorEl(null)}
//                 PaperProps={{
//                   sx: {
//                     width: "190px",
//                     height: "165px",
//                     fontSize: "11px",
//                     boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
//                     borderRadius: "8px",
//                     mt: 1,
//                   },
//                 }}
//               >
//                 {menuItems.map((item) => (
//                   <MenuItem
//                     key={item.text}
//                     onMouseEnter={(e) => {
//                       if (item.submenu) {
//                         setSubmenuAnchorEl(e.currentTarget);
//                       } else {
//                         setSubmenuAnchorEl(null);
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       setSubmenuAnchorEl(null);
//                     }}
//                     onClick={() => {
//                       if (!item.submenu) handleMenuItemClick(item.text);
//                     }}
//                     sx={{
//                       //   backgroundColor:
//                       //     menuAnchorEl && item.submenu
//                       //       ? "#408dfb"
//                       //       : "transparent",
//                       //   color: menuAnchorEl && item.submenu ? "white" : "",
//                       borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
//                       //   "& .menu-icon": {
//                       //     color:
//                       //       menuAnchorEl &&
//                       //       item.submenu &&
//                       //       "white !important",
//                       //   },
//                       "&:hover": {
//                         backgroundColor: "primary.main !important",
//                         color: "menu.text.normal",
//                         borderRadius: "5px",
//                         "& .menu-icon": {
//                           color: "menu.text.normal !important",
//                         },
//                       },
//                       borderBottom: item.border ? "1px solid #ddd" : "none",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         width: "100%",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         {item.icon}
//                         <Typography
//                           sx={{
//                             ml: item.iconPosition === "right" ? 0 : 2,
//                             fontSize: "13px",
//                             fontWeight: item.hasArrow ? 500 : 400,
//                           }}
//                         >
//                           {item.text}
//                         </Typography>
//                       </Box>
//                       {item.hasArrow && <ChevronRight className="menu-icon" />}
//                     </Box>
//                     {/* Submenu */}
//                     {item.submenu && (
//                       <Menu
//                         anchorEl={submenuAnchorEl}
//                         open={Boolean(
//                           submenuAnchorEl &&
//                             submenuAnchorEl.textContent.includes(item.text)
//                         )}
//                         onClose={() => setSubmenuAnchorEl(null)}
//                         anchorOrigin={{
//                           vertical: "top",
//                           horizontal: "right",
//                         }}
//                         transformOrigin={{
//                           vertical: "top",
//                           horizontal: "left",
//                         }}
//                         PaperProps={{
//                           onMouseEnter: () => {
//                             clearTimeout(submenuCloseTimeout.current);
//                             setSubmenuHover(true);
//                           },
//                           onMouseLeave: () => {
//                             setSubmenuHover(false);
//                             submenuCloseTimeout.current = setTimeout(() => {
//                               setSubmenuAnchorEl(null);
//                             }, 200);
//                           },
//                           sx: {
//                             ml: "",
//                             fontSize: "12px",
//                             boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
//                             borderRadius: "8px",
//                           },
//                         }}
//                       >
//                         {item.submenu.map((subItem) => (
//                           <MenuItem
//                             key={subItem.key}
//                             onClick={() => {
//                               if (item.text === "Exports") {
//                                 handleMenuItemClick(subItem.label);
//                               } else {
//                                 setSubmenuAnchorEl(null);
//                                 setMenuAnchorEl(null);
//                                 setSortColumn(subItem.key);
//                                 fetchRecurringList(
//                                   filterBy,
//                                   subItem.key,
//                                   subItem.order
//                                 ); // default order
//                               }
//                             }}
//                             selected={sortColumn === subItem.key}
//                             sx={{
//                               fontSize: "12px",
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               gap: 1,
//                               "&:hover": {
//                                 backgroundColor: "primary.main !important",
//                                 color: "menu.text.default",
//                                 "& .sort-icon": {
//                                   color: "menu.text.default",
//                                 },
//                               },
//                               backgroundColor:
//                                 sortColumn === subItem.key
//                                   ? "primary.main !important"
//                                   : "transparent",
//                               color:
//                                 sortColumn === subItem.key
//                                   ? "menu.text.default !important"
//                                   : "",
//                               fontWeight:
//                                 sortColumn === subItem.key ? 600 : 400,
//                             }}
//                           >
//                             <Typography sx={{ fontSize: "12px" }}>
//                               {subItem.label}
//                             </Typography>

//                             <Box
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 const newOrder =
//                                   subItem.order === "D" ? "A" : "D";
//                                 subItem.order = newOrder; // mutate local config or handle externally
//                                 setSortOrder(newOrder);
//                                 setSortColumn(subItem.key);
//                                 setSubmenuAnchorEl(null);
//                                 setMenuAnchorEl(null);
//                                 fetchRecurringList(
//                                   filterBy,
//                                   subItem.key,
//                                   newOrder
//                                 );
//                               }}
//                               sx={{
//                                 cursor: "pointer",
//                                 display: "flex",
//                                 alignItems: "center",
//                               }}
//                             >
//                               {subItem.order === "D" ? (
//                                 <ArrowDownward
//                                   fontSize="inherit"
//                                   className="sort-icon"
//                                 />
//                               ) : (
//                                 <ArrowUpward
//                                   fontSize="inherit"
//                                   className="sort-icon"
//                                 />
//                               )}
//                             </Box>
//                           </MenuItem>
//                         ))}
//                       </Menu>
//                     )}
//                   </MenuItem>
//                 ))}
//               </Menu>
//               <ExportModal
//                 open={open}
//                 moduleName="Sales Order"
//                 onClose={handleClose}
//               />
//             </Box>
//           </Toolbar>
//           <Divider />
//           <Box sx={{ overflowY: "auto" }}>
//             {loading ? (
//               <SideBarSkeleton />
//             ) : recurringList.length > 0 ? (
//               <SideBarTable
//                 staticData={recurringList}
//                 handleSelectRow={handleSelectRow}
//                 onRowClick={handleRowClick}
//                 type={"RecurringBills"}
//                 setSelectedValue={setSelectedValue}
//               />
//             ) : (
//               <Box sx={{ my: 12, textAlign: "center" }}>
//                 {" "}
//                 There are no {selectedType}
//               </Box>
//             )}
//           </Box>
//         </Box>
//         <Box sx={{ flexGrow: 1 }}>
//           {recurringData && !loadingView && (
//             <View
//               details={recurringData}
//               childLoading={childLoading}
//               callViewAPI={callRecurring}
//               uniqueId={uniqueId}
//               page={viewPage.current}
//               limit={viewLimit.current}
//               setFilterStatus={handleFilterStatus}
//               filterStatus={filterStatus}
//               journalId={journalId}
//             />
//           )}
//           {loadingView && <DotLoader />}
//         </Box>
//       </Box>
//       <SearchModal
//         open={openSearchDialog}
//         onClose={handleCloseSearchDialog}
//         onSearch={(searchData) => console.log("Search:", searchData)}
//       />
//     </Box>
//   );
// };

// export default SalesOrder;




"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Typography,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  ListAlt,
} from "@mui/icons-material";
import SalesSideTable from "../../../../../src/app/common/SalesSideTable";
import ViewComponent from "../../../../../src/app/sales/salesOrder/viewComponent";
import CustomFilterMenu from "../../../common/customFilterMenu";
import SearchModal from "../../../common/searchModal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import apiService from "../../../../../src/services/axiosService";
import config from "../../../../../src/services/config";
import DotLoader from "../../../../components/DotLoader";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../../common/export/ExportModal";
import SideBarTable from "../../SideBarList";
import View from "../view/view";

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All",
    value: "Status.All",
    key: "Recurring Bills",
    empty_msg: "There are no recurring Bills",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Active",
    value: "Status.Active",
    key: "Recurring Bills Active",
    empty_msg: "There are no active recurring Bills",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Stopped",
    value: "Status.Stopped",
    key: "Recurring Bills Stopped",
    empty_msg: "There are no stopped recurring Bills",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Expired",
    value: "Status.Expired",
    key: "Recurring Bills Expired",
    empty_msg: "There are no expired recurring bills",
    column_orientation_type: "wrap",
  },
];

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      {
        key: "vendor_name",
        label: "Vendor Name",
        order: "D",
      },
      { key: "recurrence_name", label: "Profile Name", order: "D" },
      { key: "next_bill_date", label: "Next Bill Date", order: "D" },
      { key: "total", label: "Amount", order: "D" },
    ],
  },
  {
    text: "Import Recurring Bills",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Exports",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
    submenu: [
      { key: "createdAt", label: "Export Recurring Bills", order: "D" },
      {
        key: "vendor_name",
        label: "Export Current View",
      },
    ],
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const SideBarSkeleton = () => {
  const paymentListColumns = [
    { width: "40%" }, // Payment number/ID
    { width: "30%" }, // Amount
    { width: "30%" }, // Date
  ];

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      {/* Generate 10 skeleton rows */}
      {[...Array(10)].map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ p: 1, mb: 1 }}>
          {/* First row in each item */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            {paymentListColumns.map((col, colIndex) => (
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

const SalesOrder = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [recurringList, setRecurringList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [loadingView, setLoadingView] = useState(false);
  const [recurringData, setRecurringData] = useState(null);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [selectedKey, setSelectedKey] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [journalId, setJournalId] = useState(""); // This will be set when a bill is selected
  const page = useRef(1);
  const limit = useRef(100);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("recurrence_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [selectedValue, setSelectedValue] = useState(null);
  const allSelected =
    recurringList.length > 0 && selected.length === recurringList.length;
  const viewPage = useRef(1);
  const viewLimit = useRef(3);
  const [filterStatus, setFilterStatus] = useState("all");
  const handleRowClick = (row) => {
    router.push(`/purchase/recurringbills/${row.recurring_bill_id}`);
  };
  const [childLoading, setChildLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleMenuItemClick = (item) => {
    if (item === "Export Sales Orders") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchRecurringList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectRow = (key) => {
    router.push(`/purchase/recurringbills/${key.recurring_bill_id}`);
  };

  const callRecurring = (id, pageNo) => {
    setChildLoading(true);
    viewPage.current = pageNo;
    getRecurringData(id, pageNo, viewLimit.current, filterStatus);
    fetchRecurringList(filterBy, sortColumn, sortOrder);
  };

  const handleFilterStatus = (value) => {
    console.log(value, "status value");
    setFilterStatus(value);
    getRecurringData(uniqueId, viewPage.current, viewLimit.current, value);
  };

  const handleSelect = (type, value, key) => {
    setSelectedType(type + " Recurring Bills");
    setSelectedKey(key);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchRecurringList(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchRecurringList(filterBy, sortColumn, sortOrder);
    const path = window.location.pathname; // "/sales/invoices/365756"
    const segments = path.split("/")[3];
    setUniqueId(segments);
    getRecurring(segments);
  }, []);

  const getRecurring = (id) => {
    setLoadingView(true);
    getRecurringData(id, viewPage.current, viewLimit.current, filterStatus);
  };

  const organization_id = localStorage.getItem("organization_id");

  const fetchRecurringList = async (
    filterValue = "",
    sort_column,
    sort_order
  ) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/recurring-bill`,
        params: {
          filter: filterValue,
          page: page.current,
          per_page: limit.current, // Fetch more at once for client-side pagination
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current, // Increased to support client-side pagination
          organization_id: organization_id,
        },
        customBaseUrl: config.PO_Base_url,
        file: false,
      });
      setRecurringList(response.data.recurring_bills);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching quotes list:",
        error.response?.data || error.message
      );
      setRecurringList([]); // Ensure recurringList remains an array
      setLoading(false);
    }
  };

  const getRecurringData = async (id, page, limit, filterValue) => {
    try {
      setRecurringData([]);
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.PO_Base_url,
        params: {
          page: page,
          limit: limit,
          filter_status: filterValue,
        },
        url: `/api/v1/recurring-bill/${id}?org_id=${organization_id}`,
      });
      
      // Set the recurring data
      setRecurringData(response.data.data);
      
      // Extract and set journal_id from the response
      if (response.data.data && response.data.data.journal_id) {
        setJournalId(response.data.data.journal_id);
        console.log("Journal ID extracted:", response.data.data.journal_id);
      } else {
        // Handle case where journal_id might be null or undefined
        setJournalId("");
        console.log("No journal ID found in response");
      }
      
      setLoadingView(false);
      setChildLoading(false);
    } catch (error) {
      console.error(
        "Error fetching sales data:",
        error.response?.data || error.message
      );
      setLoadingView(false);
      setChildLoading(false);
      // Reset journal ID on error
      setJournalId("");
    }
  };

  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "90vh",
          overflow: "hidden",
        }}
      >
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
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
            }}
          >
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={
                <KeyboardArrowDownIcon
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              }
              color="black"
              style={{
                fontWeight: 600,
                fontSize: "15px",
                textTransform: "none",
              }}
            >
              {selectedType.length > 10
                ? `${selectedType.slice(0, 15)}...`
                : selectedType}
            </Button>
            {/* Custom Filter Menu */}
            <CustomFilterMenu
              anchorEl={anchorEl}
              handleClose={() => setAnchorEl(null)}
              favoritesData={favorites}
              filtersData={filters}
              onSelect={handleSelect}
              onFavoriteToggle={(filter) => {
                const updatedFilters = filters.map((f) =>
                  f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
                );
                setFilters(updatedFilters);
                const updatedFavorites = updatedFilters.filter(
                  (f) => f.isFavorite
                );
                setFavorites(updatedFavorites);
              }}
              selectedType={selectedType}
            />
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
                onClick={() =>
                  router.push("/purchase/recurringBills/newRecurringBill")
                }
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
                  sx: {
                    width: "190px",
                    height: "165px",
                    fontSize: "11px",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px",
                    mt: 1,
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
                      //   backgroundColor:
                      //     menuAnchorEl && item.submenu
                      //       ? "#408dfb"
                      //       : "transparent",
                      //   color: menuAnchorEl && item.submenu ? "white" : "",
                      borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
                      //   "& .menu-icon": {
                      //     color:
                      //       menuAnchorEl &&
                      //       item.submenu &&
                      //       "white !important",
                      //   },
                      "&:hover": {
                        backgroundColor: "primary.main !important",
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
                              if (item.text === "Exports") {
                                handleMenuItemClick(subItem.label);
                              } else {
                                setSubmenuAnchorEl(null);
                                setMenuAnchorEl(null);
                                setSortColumn(subItem.key);
                                fetchRecurringList(
                                  filterBy,
                                  subItem.key,
                                  subItem.order
                                ); // default order
                              }
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
                                fetchRecurringList(
                                  filterBy,
                                  subItem.key,
                                  newOrder
                                );
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
              <ExportModal
                open={open}
                moduleName="Sales Order"
                onClose={handleClose}
              />
            </Box>
          </Toolbar>
          <Divider />
          <Box sx={{ overflowY: "auto" }}>
            {loading ? (
              <SideBarSkeleton />
            ) : recurringList.length > 0 ? (
              <SideBarTable
                staticData={recurringList}
                handleSelectRow={handleSelectRow}
                onRowClick={handleRowClick}
                type={"RecurringBills"}
                setSelectedValue={setSelectedValue}
              />
            ) : (
              <Box sx={{ my: 12, textAlign: "center" }}>
                {" "}
                There are no {selectedType}
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {recurringData && !loadingView && (
            <View
              details={recurringData}
              childLoading={childLoading}
              callViewAPI={callRecurring}
              uniqueId={uniqueId}
              page={viewPage.current}
              limit={viewLimit.current}
              setFilterStatus={handleFilterStatus}
              filterStatus={filterStatus}
              journalId={journalId}
            />
          )}
          {loadingView && <DotLoader />}
        </Box>
      </Box>
      <SearchModal
        open={openSearchDialog}
        onClose={handleCloseSearchDialog}
        onSearch={(searchData) => console.log("Search:", searchData)}
      />
    </Box>
  );
};

export default SalesOrder;