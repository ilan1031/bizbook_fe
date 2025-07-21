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
//   TableSortLabel,
//   Checkbox,
//   IconButton,
//   Menu,
//   MenuItem,
//   Typography,
//   CircularProgress,
//   Collapse,
//   Tooltip,
//   Modal,
//   Button,
//   TextField,
//   Divider,
//   ListItemIcon,
//   ListItemText,
//   Popover,
// } from "@mui/material";

// import {
//   Settings2,
//   Table2,
//   WrapText,
//   Search as SearchIcon,
//   Folder as FolderIcon,
//   FolderOpen as FolderOpenIcon,
//   FileText as DescriptionIcon,
//   Lock,
//   Search,
//   Settings,
// } from "lucide-react";

// import {
//   KeyboardArrowRight as KeyboardArrowRightIcon,
//   KeyboardArrowDown as KeyboardArrowDownIcon,
//   ModeOutlined as ModeOutlinedIcon,
//   MailOutline as MailOutlineIcon,
//   ExpandCircleDown as ExpandCircleDownIcon,
//   ChevronLeft as ChevronLeftIcon,
//   ChevronRight as ChevronRightIcon,
//   EmailOutlined as EmailOutlinedIcon,
//   ArrowDropUp as ArrowDropUpIcon,
//   ArrowDropDown as ArrowDropDownIcon,
//   Close,
//   DragIndicator,
// } from "@mui/icons-material";

// import { useTheme } from "@mui/material/styles";

// export default function CustomizedTable({
//   // Props from first component
//   staticData = [],
//   columnList = [],
//   loading = false,
//   showPagination = false,
//   value = '',
//   selectedType = '',
//   columns = [],
//   allSelected = false,
//   selected = [],
//   hoveredRow = null,
//   menuAnchorEl = null,
//   sortColumn = '',
//   sortOrder = 'A',
//   theme = {},
  
//   // Props from second component
//   handleSelectAll = () => {},
//   handleSelect = () => {},
//   handleSelectRow = () => {},
//   handleSettingsClick = () => {},
//   handleOpenSearchDialog = () => {},
//   onRowClick = () => {},
//   callBackAPI = () => {},
//   hasMore = false,
//   totalCount = 0,
//   page = 1,
//   limit = () => {},
//   limitValue = 10,
//   handleSort = () => {},
  
//   // Additional props
//   setHoveredRow = () => {},
//   setMenuAnchorEl = () => {},
//   handleColumnModal = () => {},
//   getSortData = () => {},
//   getColor = () => 'inherit',
  
//   // New props for hierarchy
//   isHierarchical = false,
//   hierarchyConfig = {
//     idField: 'account_id',
//     parentIdField: 'parent_account_id',
//     nameField: 'account_name',
//   }
// }) {
//   const [expandedItems, setExpandedItems] = useState(new Set());
//   const [localHoveredRow, setLocalHoveredRow] = useState(null);
//   const [actionAnchorEl, setActionAnchorEl] = useState(null);
//   const [rowsPerPage, setRowsPerPage] = useState(limitValue);
//   const [showCount, setShowCount] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [localMenuAnchorEl, setLocalMenuAnchorEl] = useState(null);
//   const [localColumnList, setLocalColumnList] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [filteredColumns, setFilteredColumns] = useState([]);
  
//   const muiTheme = useTheme();
//   const currentHoveredRow = hoveredRow !== null ? hoveredRow : localHoveredRow;
//   const currentMenuAnchorEl = menuAnchorEl !== null ? menuAnchorEl : localMenuAnchorEl;
//   const currentColumnList = columnList.length > 0 ? columnList : localColumnList;

//   // Organize data into hierarchical structure if needed
//   const hierarchicalData = useMemo(() => {
//     if (!staticData || staticData.length === 0) return [];
    
//     if (isHierarchical) {
//       // For hierarchical data like chart of accounts
//       const accountsData = staticData[0]?.chart_of_accounts || staticData;
//       return organizeHierarchicalData(accountsData);
//     } else {
//       // For flat data, just return as is
//       return staticData.map(item => ({
//         ...item,
//         level: 0,
//         isVisible: true,
//         hasChildren: false,
//         children: [],
//         isExpanded: false,
//       }));
//     }
//   }, [staticData, isHierarchical]);

//   // Update expanded state in the hierarchical data
//   const updateExpandedState = (data) => {
//     return data.map(item => ({
//       ...item,
//       isExpanded: expandedItems.has(item[hierarchyConfig.idField]),
//       children: item.children ? updateExpandedState(item.children) : [],
//     }));
//   };

//   // Get flattened data for rendering
//   const flattenedData = useMemo(() => {
//     if (isHierarchical) {
//       const updatedData = updateExpandedState(hierarchicalData);
//       return flattenHierarchy(updatedData);
//     } else {
//       return hierarchicalData;
//     }
//   }, [hierarchicalData, expandedItems, isHierarchical]);

//   // Handle expand/collapse
//   const handleToggleExpand = (itemId, hasChildren) => {
//     if (!hasChildren) return;
    
//     setExpandedItems(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemId)) {
//         newSet.delete(itemId);
//       } else {
//         newSet.add(itemId);
//       }
//       return newSet;
//     });
//   };

//   // Color coding function
//   const getColorValue = (key, value) => {
//     if (getColor && typeof getColor === 'function') {
//       return getColor(key, value);
//     }
    
//     // Default color logic
//     if (
//       value === "Closed" ||
//       value === "REIMBURSED" ||
//       value === "CLOSED" ||
//       value === "Paid" ||
//       value === "PAID" ||
//       value === "Invoiced" ||
//       value === "Accepted" ||
//       value === "Reimbursed" ||
//       value === "Partially Paid" ||
//       value === "Delivered" ||
//       value === "Active" ||
//       value === "active"
//     ) {
//       return "#22c1c6 !important";
//     } else if (
//       value === "Sent" ||
//       value === "Confirmed" ||
//       key === "billNumber" ||
//       key === "name" ||
//       key === "bill_number" ||
//       key === "account_name" ||
//       key === "purchase_number" ||
//       key === "invoice_number" ||
//       key === "invoice_date" ||
//       key === "estimate_number" ||
//       key === "salesorder_number" ||
//       key === "deliverychallan_number" ||
//       key === "payment_id" ||
//       key === "contact_name" ||
//       key === "account_name" ||
//       value === "Open" ||
//       value === "OPEN" ||
//       value === "PARTIALLY PAID" ||
//       value === "ISSUED" ||
//       key === "recurrence_name"
//     ) {
//       return "#408dfb !important";
//     } else if (
//       value === "Declined" ||
//       value === "Stopped" ||
//       value === "stopped"
//     ) {
//       return "#f76831 !important";
//     } else if (value === "INVOICED") {
//       return "#f770af !important";
//     } else if (value === "UNBILLED" || value === "⏲") {
//       return "#a696a4 !important";
//     } else if (value === "Draft" || value === "Void" || value === "Expired") {
//       return "#879697 !important";
//     } else if (value === "DRAFT" || value === "VOID" || value === "UNBILLED") {
//       return "#879697 !important";
//     } else if (value === "Returned" || value === "Not Invoiced") {
//       return "#777 !important";
//     } else if (value === "Overdue") {
//       return "#F76831 !important";
//     } else {
//       return "#222 !important";
//     }
//   };

//   // Render hierarchical cell content
//   const renderHierarchicalCell = (row, column) => {
//     const indentSize = 20; // pixels per level
//     const indent = row.level * indentSize;
    
//     if (column.key === hierarchyConfig.nameField && isHierarchical) {
//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: `${indent}px` }}>
//           {row.hasChildren ? (
//             <IconButton
//               size="small"
//               onClick={() => handleToggleExpand(row[hierarchyConfig.idField], row.hasChildren)}
//               sx={{ marginRight: 1, padding: 0.5 }}
//             >
//               {row.isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
//             </IconButton>
//           ) : (
//             <Box sx={{ width: 24, marginRight: 1 }} />
//           )}
          
//           {row.hasChildren ? (
//             row.isExpanded ? <FolderOpenIcon size={16} /> : <FolderIcon size={16} />
//           ) : (
//             <DescriptionIcon size={16} />
//           )}
          
//           <Typography
//             variant="body2"
//             sx={{ 
//               marginLeft: 1,
//               color: getColorValue(column.key, row[column.key]),
//               cursor: 'pointer'
//             }}
//             onClick={() => onRowClick(row)}
//           >
//             {row[column.key]}
//           </Typography>
//         </Box>
//       );
//     }
    
//     // Regular cell rendering
//     return (
//       <Typography
//         variant="body2"
//         sx={{ 
//           color: getColorValue(column.key, row[column.key]),
//           cursor: 'pointer'
//         }}
//         onClick={() => onRowClick(row)}
//       >
//         {row[column.key]}
//       </Typography>
//     );
//   };

//   // Handle sorting
//   const handleSortClick = (columnValue) => {
//     if (getSortData && typeof getSortData === 'function') {
//       getSortData(columnValue);
//     } else if (handleSort && typeof handleSort === 'function') {
//       if (sortColumn === columnValue) {
//         let sort_order = sortOrder === "D" ? "A" : "D";
//         handleSort(columnValue, sort_order);
//       } else {
//         handleSort(columnValue, "A");
//       }
//     }
//   };

//   // Handle menu clicks
//   const handleMenuClick = (event) => {
//     const currentSetMenuAnchorEl = setMenuAnchorEl || setLocalMenuAnchorEl;
//     currentSetMenuAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     const currentSetMenuAnchorEl = setMenuAnchorEl || setLocalMenuAnchorEl;
//     currentSetMenuAnchorEl(null);
//   };

//   // Handle hover
//   const handleRowHover = (rowIndex) => {
//     const currentSetHoveredRow = setHoveredRow || setLocalHoveredRow;
//     currentSetHoveredRow(rowIndex);
//   };

//   const handleRowLeave = () => {
//     const currentSetHoveredRow = setHoveredRow || setLocalHoveredRow;
//     currentSetHoveredRow(null);
//   };

//   // Filter columns for search
//   useEffect(() => {
//     if (searchText) {
//       const filtered = currentColumnList.filter(
//         (column) =>
//           column.key.toLowerCase().includes(searchText.toLowerCase()) ||
//           column.value.toLowerCase().includes(searchText.toLowerCase())
//       );
//       setFilteredColumns(filtered);
//     } else {
//       setFilteredColumns(currentColumnList);
//     }
//   }, [searchText, currentColumnList]);

//   // Pagination calculations
//   const totalPages = Math.ceil(totalCount / rowsPerPage);
//   const startItem = totalCount === 0 ? 0 : (page - 1) * rowsPerPage + 1;
//   const endItem = Math.min(page * rowsPerPage, totalCount);
//   const shouldShowPagination = showPagination || totalCount > limitValue;

// // Helper function to organize data into hierarchical structure
// const organizeHierarchicalData = (data) => {
//   const itemMap = new Map();
//   const rootItems = [];
  
//   // First pass: create map of all items
//   data.forEach(item => {
//     itemMap.set(item.account_id, {
//       ...item,
//       children: [],
//       isExpanded: false,
//     });
//   });
  
//   // Second pass: organize into hierarchy
//   data.forEach(item => {
//     const currentItem = itemMap.get(item.account_id);
    
//     if (item.parent_account_id && itemMap.has(item.parent_account_id)) {
//       // This is a child item
//       const parent = itemMap.get(item.parent_account_id);
//       parent.children.push(currentItem);
//     } else {
//       // This is a root item
//       rootItems.push(currentItem);
//     }
//   });
  
//   return rootItems;
// };

// // Recursive function to flatten hierarchy for rendering
// const flattenHierarchy = (items, level = 0, parentExpanded = true) => {
//   const result = [];
  
//   items.forEach(item => {
//     // Add the current item
//     result.push({
//       ...item,
//       level,
//       isVisible: parentExpanded,
//       hasChildren: item.children && item.children.length > 0,
//     });
    
//     // Add children if expanded
//     if (item.isExpanded && item.children && item.children.length > 0) {
//       result.push(...flattenHierarchy(item.children, level + 1, parentExpanded && item.isExpanded));
//     }
//   });
  
//   return result;
// };

// const menuItemStyles = {
//   "&:hover": {
//     backgroundColor: "primary.main",
//     color: "menu.text.normal",
//     "& .MuiListItemIcon-root": {
//       color: "menu.text.normal",
//     },
//   },
//   "&:hover .MuiListItemIcon-root svg": {
//     color: "menu.text.normal",
//   },
//   "& .MuiListItemIcon-root svg": {
//     color: "primary.main",
//   },
// };



//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//       </Box>
//     );
//   }
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "calc(100vh - 100px)",
//       }}
//     >
//       {/* Scrollable Table Container */}
//       <Box
//       sx={{
//         flexGrow: 1,
//         position: "relative",
//         paddingBottom: showPagination ? "80px" : "0px",
//       }}
//     >
//       <TableContainer
//         component={Paper}
//         sx={{
//           boxShadow: "none",
//           width: "100%",
//           borderRadius: "0px",
//           overflow:
//             columnList.filter((col) => col.is_default_select_column).length > 8
//               ? "auto"
//               : "visible",
//           position: "relative",
//         }}
//       >
//         <Table
//           size="small"
//           sx={{
//             tableLayout:
//               columnList.filter((col) => col.is_default_select_column).length > 8
//                 ? "auto"
//                 : "fixed",
//             minWidth: "100%",
//             marginLeft: "10px",
//           }}
//         >
//           {/* Fixed Table Header */}
//           <TableHead
//             sx={{
//               position: "sticky",
//               top: 0,
//               zIndex: 2,
//               backgroundColor: "#fff",
//             }}
//           >
//             <TableRow sx={{ height: 32, backgroundColor: "#6c718a" }}>
//               {/* Fixed checkbox column */}
//               <TableCell
//                 sx={{
//                   p: 0.5,
//                   width: 60,
//                   position: "sticky",
//                   left: 0,
//                   zIndex: 3,
//                   backgroundColor: "#6c718a",
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <Box
//                     sx={{
//                       width: 10,
//                       display: "flex",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {!allSelected ? (
//                       <>
//                         <IconButton
//                           onClick={(e) => setMenuAnchorEl(e.currentTarget)}
//                           size="small"
//                         >
//                           <Settings2
//                             style={{
//                               width: 16,
//                               height: 16,
//                               color: theme.palette?.primary?.main || '#1976d2',
//                             }}
//                           />
//                         </IconButton>
//                         <Menu
//                           anchorEl={menuAnchorEl}
//                           open={Boolean(menuAnchorEl)}
//                           onClose={() => setMenuAnchorEl(null)}
//                           PaperProps={{
//                             sx: {
//                               fontSize: "11px",
//                               boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
//                               borderRadius: "8px",
//                               mt: 1,
//                               ml: 1,
//                             },
//                           }}
//                         >
//                           <MenuItem
//                             onClick={handleColumnModal}
//                             sx={{
//                               backgroundColor: "transparent",
//                               "&:hover": {
//                                 backgroundColor: "primary.main",
//                                 color: "menu.text.normal",
//                                 borderRadius: "6px",
//                                 ".menu-icon": {
//                                   color: "menu.text.normal !important",
//                                 },
//                               },
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 width: "100%",
//                                 justifyContent: "space-between",
//                               }}
//                             >
//                               <Box sx={{ display: "flex", alignItems: "center" }}>
//                                 <Table2
//                                   className="menu-icon"
//                                   sx={{
//                                     color: "primary.main",
//                                     width: 20,
//                                     height: 20,
//                                   }}
//                                 />
//                                 <Typography
//                                   sx={{
//                                     ml: 1,
//                                     fontSize: "13px",
//                                     fontWeight: 400,
//                                   }}
//                                 >
//                                   Customize Columns
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </MenuItem>
//                           <MenuItem
//                             sx={{
//                               backgroundColor: "transparent",
//                               transition: "background-color 0.2s ease",
//                               "&:hover": {
//                                 backgroundColor: "primary.main",
//                                 color: (theme) => theme.palette?.menu?.text?.normal,
//                                 borderRadius: "6px",
//                                 ".menu-icon": {
//                                   color: (theme) => theme.palette?.menu?.text?.normal,
//                                 },
//                               },
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 width: "100%",
//                                 justifyContent: "space-between",
//                               }}
//                             >
//                               <Box sx={{ display: "flex", alignItems: "center" }}>
//                                 <WrapText
//                                   className="menu-icon"
//                                   sx={{
//                                     color: (theme) => theme.palette?.menu?.text?.normal,
//                                     transition: "color 0.2s ease",
//                                   }}
//                                 />
//                                 <Typography
//                                   sx={{
//                                     ml: 1,
//                                     fontSize: "13px",
//                                     fontWeight: 400,
//                                   }}
//                                 >
//                                   Clip Text
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </MenuItem>
//                         </Menu>
//                       </>
//                     ) : (
//                       <Box sx={{ width: 16 }} />
//                     )}
//                   </Box>
//                   {value !== "deliverychallan" && (
//                     <Checkbox
//                       checked={allSelected}
//                       onChange={handleSelectAll}
//                       indeterminate={selected.length > 0 && !allSelected}
//                       size="small"
//                       sx={{ ml: 0.5 }}
//                     />
//                   )}
//                 </Box>
//               </TableCell>

//               {/* Dynamic width columns */}
//               {columnList
//                 .filter((col) => col.is_default_select_column)
//                 .map((col, index) => (
//                   <TableCell
//                     key={col.value}
//                     sortDirection="asc"
//                     align={
//                       col.value === "invoiced_status_formatted" && value === "salesorder"
//                         ? "center"
//                         : col.value === "total_formatted" || col.value === "balance_formatted"
//                         ? "right"
//                         : "left"
//                     }
//                     sx={{
//                       p: 0.5,
//                       color: "#fff",
//                       fontSize: "12px",
//                       paddingLeft: "20px",
//                       whiteSpace: "nowrap",
//                       minWidth:
//                         columnList.filter((col) => col.is_default_select_column).length > 8
//                           ? "100px"
//                           : "auto",
//                       width:
//                         columnList.filter((col) => col.is_default_select_column).length <= 8
//                           ? `${100 / columnList.filter((col) => col.is_default_select_column).length}%`
//                           : "auto",
//                     }}
//                   >
//                     <TableSortLabel
//                       active={col.is_sortable}
//                       direction={
//                         sortColumn === col.value
//                           ? sortOrder === "D"
//                             ? "desc"
//                             : "asc"
//                           : "asc"
//                       }
//                       onClick={() => (col.is_sortable ? getSortData(col.value) : null)}
//                       IconComponent={() => null}
//                       sx={{
//                         "& .MuiTableSortLabel-icon": {
//                           display: "none",
//                         },
//                         "&.Mui-active": {
//                           color: "inherit",
//                         },
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "0px",
//                         cursor: col.is_sortable ? "pointer" : "default",
//                       }}
//                     >
//                       <span style={{ display: "inline-block" }}>{col.key}</span>
//                       <span
//                         style={{
//                           display: "inline-flex",
//                           flexDirection: "column",
//                           marginLeft: "2px",
//                           height: "15px",
//                           lineHeight: 0,
//                         }}
//                       >
//                         {sortColumn === col.value && (
//                           <>
//                             <ArrowDropUpIcon
//                               sx={{
//                                 fill: (theme) =>
//                                   sortOrder === "A"
//                                     ? `${theme.palette?.primary?.main || '#1976d2'} !important`
//                                     : "#21263c",
//                                 width: "15px",
//                                 height: "10px",
//                                 mb: "-4px",
//                               }}
//                             />
//                             <ArrowDropDownIcon
//                               sx={{
//                                 fill: (theme) =>
//                                   sortOrder === "D"
//                                     ? `${theme.palette?.primary?.main || '#1976d2'} !important`
//                                     : "#21263c",
//                                 width: "15px",
//                                 height: "10px",
//                                 mt: 0,
//                               }}
//                             />
//                           </>
//                         )}
//                       </span>
//                     </TableSortLabel>
//                   </TableCell>
//                 ))}

//               <TableCell
//                 sx={{
//                   p: 0.5,
//                   minWidth: 40,
//                   width:
//                     columnList.filter((col) => col.is_default_select_column).length <= 8
//                       ? "40px"
//                       : "auto",
//                 }}
//               >
//                 <IconButton onClick={handleOpenSearchDialog} size="small">
//                   <SearchIcon fontSize="small" sx={{ color: "#fff" }} />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           {/* Scrollable Table Body */}
//           <TableBody>
//             {!loading && flattenedData.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   sx={{ textAlign: "center", borderBottom: "none" }}
//                   colSpan={columns.length + 2}
//                 >
//                   <Typography variant="subtitle2" sx={{ padding: "25px" }}>
//                     There are no {selectedType}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ) : !loading && flattenedData.length > 0 ? (
//               <>
//                 {columnList.length > 0 &&
//                   flattenedData
//                     .filter(row => row.isVisible)
//                     .map((row) => (
//                       <TableRow
//                         key={row.account_id || row._id}
//                         sx={{
//                           height: 40,
//                           "&:hover": { backgroundColor: "#f9f9fb" },
//                           backgroundColor: row.hasChildren ? "#fafafa" : "inherit",
//                         }}
//                         onMouseEnter={() => setHoveredRow(row.account_id || row._id)}
//                         onMouseLeave={() => setHoveredRow(null)}
//                       >
//                         {/* Fixed checkbox column */}
//                         <TableCell
//                           sx={{
//                             p: 0.5,
//                             width: 60,
//                             position:
//                               columnList.filter((col) => col.is_default_select_column).length > 8
//                                 ? "sticky"
//                                 : "static",
//                             left: 0,
//                             zIndex: 1,
//                             backgroundColor:
//                               hoveredRow === (row.account_id || row._id) ? "#f9f9fb" : 
//                               row.hasChildren ? "#fafafa" : "#fff",
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             {value !== "deliverychallan" && (
//                               <Checkbox
//                                 checked={selected.includes(row.account_id || row._id)}
//                                 onChange={() => handleSelectRow(row.account_id || row._id)}
//                                 size="small"
//                                 sx={{ ml: "14px", mr: 1 }}
//                               />
//                             )}
//                           </Box>
//                         </TableCell>

//                         {/* Dynamic width data columns */}
//                         {columnList
//                           .filter((col) => col.is_default_select_column)
//                           .map((col, index) => (
//                             <TableCell
//                               key={col.value}
//                               align={
//                                 col.value === "invoiced_status_formatted" && value === "salesorder"
//                                   ? "left"
//                                   : col.value === "total_formatted" || col.value === "balance_formatted"
//                                   ? "right"
//                                   : "left"
//                               }
//                               sx={{
//                                 p: 0.5,
//                                 fontSize: "13.2px !important",
//                                 color: getColor(col.value, row[col.value]) || "inherit",
//                                 whiteSpace: "nowrap",
//                                 width:
//                                   columnList.filter((col) => col.is_default_select_column).length <= 8
//                                     ? `${100 / columnList.filter((col) => col.is_default_select_column).length}%`
//                                     : "auto",
//                                 maxWidth:
//                                   columnList.filter((col) => col.is_default_select_column).length > 8
//                                     ? "300px"
//                                     : "none",
//                                 paddingLeft: col.value === "account_name" ? "8px" : "20px",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                               onClick={() => onRowClick(row)}
//                             >
//                               {col.value === "account_name" 
//                                 ? renderAccountName(row)
//                                 : row[col.value] || "-"
//                               }
//                             </TableCell>
//                           ))}

//                         <TableCell
//                           sx={{
//                             p: 0,
//                             position: "relative",
//                             textAlign: "center",
//                             width:
//                               columnList.filter((col) => col.is_default_select_column).length <= 8
//                                 ? "40px"
//                                 : "auto",
//                           }}
//                         >
//                           {/* Action buttons can be added here if needed */}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//               </>
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length + 3}
//                   align="center"
//                   sx={{
//                     borderBottom: "none",
//                     height: 100,
//                     textAlign: "center",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", justifyContent: "center" }}>
//                     <CircularProgress size="30px" />
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>

//       {/* Pagination Component - Fixed Footer */}
//       {showPagination && (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: 2,
//             height: "64px", // or match actual height
//             position: "sticky",
//             bottom: 0,
//             backgroundColor: "#fff", // to avoid bleed-through
//             zIndex: 1,
//             boxShadow: "0px -1px 4px rgba(0,0,0,0.05)",
//           }}
//         >
//           {/* Total Count with View toggle */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Typography variant="body2" sx={{ color: "#21263c" }}>
//               Total Count:{" "}
//               {showCount ? (
//                 totalCount
//               ) : (
//                 <span
//                   style={{ color: "#206ddc", cursor: "pointer" }}
//                   onClick={() => setShowCount(true)}
//                 >
//                   View
//                 </span>
//               )}
//             </Typography>
//           </Box>

//           {/* Pagination Controls - Right Side */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//             }}
//           >
//             {/* Items Per Page Selector */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "4px 12px",
//                 cursor: "pointer",
//                 backgroundColor: "#f5f7fa",
//                 color: "#838195",
//                 "& svg": {
//                   color: "#838195",
//                 },
//                 "&:hover": {
//                   color: "#2485e8",
//                   "& svg": {
//                     color: "#2485e8",
//                   },
//                 },
//               }}
//               onClick={handleClick}
//             >
//               <Settings width="16px" style={{ marginRight: "5px" }} />
//               <Typography variant="body2" sx={{ fontSize: "14px" }}>
//                 {rowsPerPage} per page
//               </Typography>
//             </Box>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleClose}
//               MenuListProps={{ dense: true }}
//               PaperProps={{
//                 sx: {
//                   mt: 1,
//                   width: 150,
//                   boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//                   borderRadius: "6px",
//                 },
//               }}
//             >
//               {[10, 25, 50, 100, 200].map((value) => (
//                 <MenuItem
//                   key={value}
//                   selected={rowsPerPage === value}
//                   onClick={() => handleChangeRowsPerPage({ target: { value } })}
//                 >
//                   {value} per page
//                 </MenuItem>
//               ))}
//             </Menu>

//             <Divider orientation="vertical" flexItem />
//             {/* Page Navigation */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 overflow: "hidden",
//                 backgroundColor: "menu.text.normal",
//               }}
//             >
//               <IconButton
//                 disabled={page === 1}
//                 onClick={() => handleChangePage(page - 1)}
//                 size="small"
//                 sx={{
//                   color: page === 1 ? "#ccc" : "#408dfb",
//                   cursor: page === 1 ? "not-allowed" : "pointer",
//                   borderRadius: 0,
//                   height: "100%",
//                 }}
//               >
//                 <ChevronLeftIcon style={{ width: "18px" }} />
//               </IconButton>

//               <Typography
//                 variant="body2"
//                 sx={{
//                   fontWeight: "normal",
//                   color: "#000",
//                   fontSize: "14px",
//                 }}
//               >
//                 {startItem} - {endItem}
//               </Typography>

//               <IconButton
//                 disabled={!hasMore}
//                 onClick={() => handleChangePage(page + 1)}
//                 size="small"
//                 sx={{
//                   color: !hasMore ? "#ccc" : "#408dfb",
//                   cursor: !hasMore ? "not-allowed" : "pointer",
//                   borderRadius: 0,
//                   height: "100%",
//                 }}
//               >
//                 <ChevronRightIcon style={{ width: "18px" }} />
//               </IconButton>
//             </Box>
//           </Box>
//         </Box>
//       )}

//       {openModal && (
//         <Modal open={openModal} onClose={() => setOpenModal(false)}>
//           <Box
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               bgcolor: "background.paper",
//               width: 600,
//               maxWidth: "90%",
//               maxHeight: "90vh",
//               borderRadius: 1,
//               boxShadow: 24,
//               display: "flex",
//               borderBottom: "none !important",
//               flexDirection: "column",
//             }}
//           >
//             {/* Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 p: 2,
//                 // borderBottom: '1px solid #e0e0e0',
//                 bgcolor: "#f5f5f5",
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 display="flex"
//                 alignItems="center"
//                 fontSize="18px"
//                 component="div"
//               >
//                 <Settings2 width="20px" style={{ marginRight: "10px" }} />{" "}
//                 Customize Columns
//               </Typography>
//               <Box display="flex" alignItems="center">
//                 <Typography variant="body2" sx={{ mr: 1 }}>
//                   {selectedCount} of {columnList.length} Selected
//                 </Typography>
//                 <IconButton size="small" onClick={() => setOpenModal(false)}>
//                   <Close />
//                 </IconButton>
//               </Box>
//             </Box>

//             {/* Search Box */}
//             <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
//               <TextField
//                 fullWidth
//                 placeholder="Search"
//                 variant="outlined"
//                 size="small"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 InputProps={{
//                   sx: { fontSize: "13px" },
//                   startAdornment: (
//                     <Search
//                       style={{
//                         color: "#838195",
//                         width: "15px",
//                         marginRight: "10px",
//                       }}
//                     />
//                   ),
//                 }}
//               />
//             </Box>

//             {/* Column List */}
//             <Box
//               sx={{
//                 overflowY: "auto",
//                 flex: 1,
//                 "&::-webkit-scrollbar": {
//                   width: "8px",
//                 },
//                 "&::-webkit-scrollbar-thumb": {
//                   backgroundColor: "#bdbdbd",
//                   borderRadius: "4px",
//                 },
//               }}
//             >
//               {filteredColumns.map((column) => (
//                 <Box
//                   key={column._id}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     mx: 3,
//                     my: 1,
//                     py: 0.5,
//                     bgcolor: "#f9f9fb",
//                     "&:hover": {
//                       bgcolor: "#f9f9f9",
//                       cursor: column.is_mandatory ? "pointer" : "grab", // 👈 Set cursor based on mandatory status
//                     },
//                   }}
//                 >
//                   {column.is_default_select_column}
//                   <DragIndicator
//                     fontSize="small"
//                     sx={{ color: "#bdbdbd", mr: 1 }}
//                   />
//                   {column.is_mandatory ? (
//                     <Lock
//                       style={{
//                         width: "13px",
//                         marginLeft: "10px",
//                         marginRight: "12px",
//                         color: "#9e9e9e",
//                       }}
//                     />
//                   ) : (
//                     <Checkbox
//                       sx={{ fontSize: "16px" }}
//                       checked={column.is_default_select_column}
//                       onChange={() => handleCheckboxChange(column.value)}
//                       // disabled={column.is_mandatory}
//                       size="small"
//                     />
//                   )}
//                   <Typography variant="body2" fontSize="13px" sx={{ ml: 1 }}>
//                     {column.key}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>

//             {/* Footer */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 p: 2.5,
//                 borderTop: "1px solid #e0e0e0",
//               }}
//             >
//               <Button
//                 variant="contained"
//                 onClick={() => handleUpdateColumn(columnList)}
//                 // sx={{ mr: 1, bgcolor: '#4285f4', '&:hover': { bgcolor: '#3367d6' } }}
//                 sx={{
//                   ...commonButtonStyle,
//                   marginRight: "8px",
//                   color: "menu.text.normal",
//                   bgcolor: "#408dfb",
//                   fontSize: "12px",
//                   height: "30px",
//                   boxShadow: "none",
//                   "&:hover": {
//                     bgcolor: "#408dfb",
//                     boxShadow: "none",
//                   },
//                 }}
//               >
//                 Save
//               </Button>
//               <Button
//                 variant="outlined"
//                 sx={{
//                   ...commonButtonStyle,
//                   height: "30px",
//                   color: "#000",
//                   fontSize: "12px",
//                   marginRight: "8px",
//                 }}
//                 onClick={() => setOpenModal(false)}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Modal>
//       )}
//     </Box>
//   );
// }


"use client";
import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Checkbox,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
  CircularProgress,
  Divider,
  Menu,
  Modal,
  Button,
  TextField,
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useRouter } from "next/navigation";
import {
  Lock,
  Search,
  Settings,
  Settings2,
  Table2,
  WrapText,
} from "lucide-react";
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";
import { Close, DragIndicator } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useTheme } from "@mui/material/styles";

const menuItemStyles = {
  "&:hover": {
    backgroundColor: "primary.main",
    color: "menu.text.normal",
    "& .MuiListItemIcon-root": {
      color: "menu.text.normal",
    },
  },
  "&:hover .MuiListItemIcon-root svg": {
    color: "menu.text.normal",
  },
  "& .MuiListItemIcon-root svg": {
    color: "primary.main",
  },
};

export default function CustomizedTable({
  columns = [],
  staticData,
  selected,
  handleSelectAll,
  handleSelect,
  handleSelectRow,
  allSelected,
  handleSettingsClick,
  handleOpenSearchDialog,
  onRowClick,
  selectedType,
  value,
  callBackAPI,
  loading,
  hasMore,
  totalCount,
  page,
  limit,
  limitValue,
  sortColumn,
  sortOrder,
  handleSort,
  getStatusColor,
  getStatusText,
  handleStatusChange,
}) {
  console.log("=== CUSTOMIZED TABLE RENDERED ===");
  console.log("CustomizedTable - onRowClick prop:", onRowClick);
  console.log("CustomizedTable - staticData length:", staticData?.length);
  console.log("CustomizedTable - staticData:", staticData);

  const [hoveredRow, setHoveredRow] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  // Pagination states
  const [rowsPerPage, setRowsPerPage] = useState(limitValue);
  const [showCount, setShowCount] = useState(false);
  // const totalCount = staticData?.length || 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const { showMessage } = useSnackbar();
  const organization_id = localStorage.getItem("organization_id");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [columnList, setColumnList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredColumns, setFilteredColumns] = useState([]);
  const theme = useTheme();
  // Optional safeguard:
  const selectedCount =
    columnList && columnList.length > 0
      ? columnList.filter((col) => col && col.is_default_select_column).length
      : 0;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      callBackAPI(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    limit(newLimit);
    setRowsPerPage(newLimit);
    page.current = 1; // Reset to first page when changing rows per page
    handleClose();
  };

  const router = useRouter();

  const back = (data) => {
    if (value === "customer") {
      router.push(`/sales/customer/edit/${data.contact_id}`);
    }
    if (value === "vendor") {
      router.push(`/purchase/vendor/edit/${data.contact_id}`);
    }
    if (value === "recurring_invoice") {
      router.push(`/sales/recurringInvoice/${data.recurringinvoice_id}`);
    }
  };

  const handleStatus = async (id) => {
    try {
      const response = await apiService({
        method: "PATCH",
        url: `/api/v1/contact/status?organization_id=${organization_id}&contact_id=${id}`,
      });
      const data = response.data;
      showMessage(data.message, "success");
      callBackAPI();
    } catch (err) {
      console.error("Failed to fetch tax exemptions:", err);
    }
  };

  const getColor = (key, value) => {
    if (
      value === "Closed" ||
      value === "REIMBURSED" ||
      value === "CLOSED" ||
      value === "Paid" ||
      value === "PAID" ||
      value === "Invoiced" ||
      value === "Accepted" ||
      value === "Reimbursed" ||
      value === "Partially Paid" ||
      value === "Delivered" ||
      value === "Active" ||
      value === "active"
    ) {
      return "#22c1c6 !important";
    } else if (
      value === "Sent" ||
      value === "Confirmed" ||
      key === "billNumber" ||
      key === "name" ||
      key === "bill_number" ||
      key === "account_name" ||
      key === "purchase_number" ||
      key === "invoice_number" ||
      key === "invoice_date" ||
      key === "estimate_number" ||
      key === "salesorder_number" ||
      key === "deliverychallan_number" ||
      key === "payment_id" ||
      key === "contact_name" ||
      key === "account_name" ||
      value === "Open" ||
      value === "OPEN" ||
      value === "PARTIALLY PAID" ||
      value === "ISSUED" ||
      key === "recurrence_name"
    ) {
      return "#408dfb !important";
    } else if (
      value === "Declined" ||
      value === "Stopped" ||
      value === "stopped"
    ) {
      return "#f76831 !important";
    } else if (value === "INVOICED") {
      return "#f770af !important";
    } else if (value === "	UNBILLED" || value === "⏲") {
      return "#a696a4 !important";
    } else if (value === "Draft" || value === "Void" || value === "Expired") {
      return "#879697 !important";
    } else if (value === "DRAFT" || value === "VOID" || value === "UNBILLED") {
      return "#879697 !important";
    } else if (value === "Returned" || value === "Not Invoiced") {
      return "#777 !important";
    } else if (value === "Overdue") {
      return "#F76831 !important";
    } else {
      return "#222 !important";
    }
  };

  useEffect(() => {
    if (searchText) {
      const filtered = columnList.filter(
        (column) =>
          column.key.toLowerCase().includes(searchText.toLowerCase()) ||
          column.value.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredColumns(filtered);
    } else {
      setFilteredColumns(columnList);
    }
  }, [searchText, columnList]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startItem = totalCount === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, totalCount);
  const showPagination = totalCount > limitValue;
  // Missing handleActionClick function - adding it
  const handleActionClick = (event, rowId) => {
    setActionAnchorEl(event.currentTarget);
  };

  const handleColumnModal = () => {
    handleGetColumn();
    setMenuAnchorEl(null);
    setOpenModal(true);
  };

  const handleGetColumn = async () => {
    try {
      const response = await apiService({
        method: "GET",
        params: {
          organization_id: organization_id,
        },
        url: `/api/v1/columns`,
      });
      const data = response.data.data;
      if (data) {
        const header = data?.column_headers;
        console.log(header[value], "header");
        setColumnList(header[value]);
      }
    } catch (error) {
      console.error("Failed to fetch column list:", error);
    }
  };

  useEffect(() => {
    handleGetColumn();
  }, []);

  const handleCheckboxChange = (colValue) => {
    const updatedColumns = columnList.map((col) => {
      if (col.value === colValue) {
        return {
          ...col,
          is_default_select_column: !col.is_default_select_column,
        };
      }
      return col;
    });

    setColumnList(updatedColumns);
  };

  const formLabelStyle = {
    fontSize: "0.875rem",
    minWidth: "120px",
    whiteSpace: "nowrap",
    color: "error.main", // Red color for required fields
  };

  const formLabelBlackStyle = {
    ...formLabelStyle,
    color: "text.primary", // Using theme's primary text color
  };

  // Common Button Styles
  const commonButtonStyle = {
    ...formLabelBlackStyle, // Match formLabelBlackStyle
    fontFamily: "inherit",
    textTransform: "none",
    padding: "6px 10px", // Consistent padding
    lineHeight: 1.5,
    borderRadius: "7px",
    bgcolor: "rgba(71, 71, 71, 0.07)",
    borderColor: "rgba(78, 78, 78, 0.15)",
    "&:hover": {
      bgcolor: "rgba(71, 71, 71, 0.1)",
      borderColor: "rgba(24, 13, 13, 0.2)",
    },
    minWidth: "auto", // Allow width to fit content
  };

  const handleUpdateColumn = async (list) => {
    try {
      const response = await apiService({
        method: "PUT",
        params: {
          organization_id: organization_id,
          type: value,
        },
        data: { colList: list },
        url: `/api/v1/columns`,
      });

      if (response.data?.status) {
        handleGetColumn();
        showMessage("Column has been updated", "success");
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Failed to fetch column list:", error);
    }
  };

  // Correct handleSort implementation
  const getSortData = (columnValue) => {
    if (sortColumn === columnValue) {
      let sort_order = sortOrder === "D" ? "A" : "D";
      handleSort(sortColumn, sort_order);
    } else {
      handleSort(columnValue, "A");
    }
  };

  const getIconColor = (theme, condition) =>
    condition ? theme.palette.primary.main : "#21263c";

 

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
      }}
    >
      {/* Scrollable Table Container */}
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          paddingBottom: showPagination ? "80px" : "0px",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            width: "100%",
            borderRadius: "0px",
            // Make table scrollable only if there are more than 8 columns
            overflow:
              (columnList.length > 0 
                ? columnList.filter((col) => col.is_default_select_column)
                : columns
              ).length > 8
                ? "auto"
                : "visible",
            position: "relative", // Required for fixed columns
          }}
        >
          <Table
            size="small"
            sx={{
              // Use fixed layout when not scrolling, auto when scrolling
              tableLayout:
                (columnList.length > 0 
                  ? columnList.filter((col) => col.is_default_select_column)
                  : columns
                ).length > 8
                  ? "auto"
                  : "fixed",
              minWidth: "100%",
              marginLeft: "10px",
            }}
          >
            {/* Fixed Table Header */}
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: "#fff",
              }}
            >
              <TableRow sx={{ height: 32, backgroundColor: "#6c718a" }}>
                {/* Fixed checkbox column */}
                <TableCell
                  sx={{
                    p: 0.5,
                    width: 60, // Fixed width for checkbox column
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    backgroundColor: "#6c718a", // Match the header background
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {!allSelected ? (
                        <>
                          <IconButton
                            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                            size="small"
                          >
                            <Settings2
                              style={{
                                width: 16,
                                height: 16,
                                color: theme.palette.primary.main, // Directly reference the theme
                              }}
                            />
                          </IconButton>
                          <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={() => setMenuAnchorEl(null)}
                            PaperProps={{
                              sx: {
                                fontSize: "11px",
                                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                                borderRadius: "8px",
                                mt: 1,
                                ml: 1,
                              },
                            }}
                          >
                            <MenuItem
                              onClick={handleColumnModal}
                              sx={{
                                backgroundColor: "transparent",
                                "&:hover": {
                                  backgroundColor: "primary.main",
                                  color: "menu.text.normal",
                                  borderRadius: "6px",
                                  // Apply style to icon with .menu-icon inside this MenuItem on hover
                                  ".menu-icon": {
                                    color: "menu.text.normal !important",
                                  },
                                },
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
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  {/* Use sx prop instead of inline style */}
                                  <Table2
                                    className="menu-icon"
                                    sx={{
                                      color: "primary.main", // Default icon color from theme
                                      width: 20,
                                      height: 20,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      ml: 1,
                                      fontSize: "13px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    Customize Columns
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                            <MenuItem
                              sx={{
                                backgroundColor: "transparent",
                                transition: "background-color 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "primary.main",
                                  color: (theme) =>
                                    theme.palette.menu.text.normal,
                                  borderRadius: "6px",
                                  ".menu-icon": {
                                    color: (theme) =>
                                      theme.palette.menu.text.normal,
                                  },
                                },
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
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <WrapText
                                    className="menu-icon"
                                    sx={{
                                      color: (theme) =>
                                        theme.palette.menu.text.normal, // Default icon color
                                      transition: "color 0.2s ease",
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      ml: 1,
                                      fontSize: "13px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    Clip Text
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          </Menu>
                        </>
                      ) : (
                        <Box sx={{ width: 16 }} />
                      )}
                    </Box>
                    {value !== "deliverychallan" && (
                      <Checkbox
                        checked={allSelected}
                        onChange={handleSelectAll}
                        indeterminate={selected.length > 0 && !allSelected}
                        size="small"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                  </Box>
                </TableCell>

                {/* Dynamic width columns - will adjust to content */}
                {(columnList.length > 0 
                  ? columnList.filter((col) => col.is_default_select_column)
                  : columns
                ).map((col, index) => (
                    <TableCell
                      key={col.value}
                      sortDirection="asc"
                      align={
                        col.value === "invoiced_status_formatted" &&
                        value === "salesorder"
                          ? "center"
                          : col.value === "total_formatted" ||
                            col.value === "balance_formatted"
                          ? "right"
                          : "left"
                      }
                      sx={{
                        p: 0.5,
                        color: "#fff",
                        fontSize: "12px",
                        paddingLeft: "20px",
                        whiteSpace: "nowrap", // Prevents text wrapping
                        // Conditional width based on column count
                        minWidth:
                          (columnList.length > 0 
                            ? columnList.filter((col) => col.is_default_select_column)
                            : columns
                          ).length > 8
                            ? "100px"
                            : "auto",
                        // When not scrolling, distribute width evenly
                        width:
                          (columnList.length > 0 
                            ? columnList.filter((col) => col.is_default_select_column)
                            : columns
                          ).length <= 8
                            ? `${
                                100 /
                                (columnList.length > 0 
                                  ? columnList.filter((col) => col.is_default_select_column)
                                  : columns
                                ).length
                              }%`
                            : "auto",
                      }}
                    >
                      <TableSortLabel
                        active={col.is_sortable}
                        direction={
                          sortColumn === col.value
                            ? sortOrder === "D"
                              ? "desc"
                              : "asc"
                            : "asc"
                        }
                        onClick={() =>
                          col.is_sortable ? getSortData(col.value) : null
                        }
                        IconComponent={() => null} // Disable default MUI sort icon
                        sx={{
                          "& .MuiTableSortLabel-icon": {
                            display: "none", // Hide default sort icon
                          },
                          "&.Mui-active": {
                            color: "inherit", // Prevent color change when active
                          },
                          display: "flex",
                          alignItems: "center",
                          gap: "0px",
                          cursor: col.is_sortable ? "pointer" : "default",
                        }}
                      >
                        <span style={{ display: "inline-block" }}>
                          {col.key}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            flexDirection: "column",
                            marginLeft: "2px",
                            height: "15px",
                            lineHeight: 0,
                          }}
                        >
                          {sortColumn === col.value && (
                            <>
                              <ArrowDropUpIcon
                                sx={{
                                  fill: (theme) =>
                                    sortOrder === "A"
                                      ? `${theme.palette.primary.main} !important`
                                      : "#21263c",
                                  width: "15px",
                                  height: "10px",
                                  mb: "-4px", // Negative margin to reduce space between icons
                                }}
                              />
                              <ArrowDropDownIcon
                                sx={{
                                  fill: (theme) =>
                                    sortOrder === "D"
                                      ? `${theme.palette.primary.main} !important`
                                      : "#21263c",
                                  width: "15px",
                                  height: "10px",
                                  mt: 0, // Use number instead of string for consistency
                                }}
                              />
                            </>
                          )}
                        </span>
                      </TableSortLabel>
                    </TableCell>
                  ))}

                <TableCell
                  sx={{
                    p: 0.5,
                    minWidth: 40,
                    // When not scrolling, give this cell a fixed width
                    width:
                      (columnList.length > 0 
                        ? columnList.filter((col) => col.is_default_select_column)
                        : columns
                      ).length <= 8
                        ? "40px"
                        : "auto",
                  }}
                >
                  <IconButton onClick={handleOpenSearchDialog} size="small">
                    <SearchIcon fontSize="small" sx={{ color: "#fff" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Scrollable Table Body */}
            <TableBody>
              {!loading && staticData.length === 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ textAlign: "center", borderBottom: "none" }}
                    colSpan={columns.length + 2}
                  >
                    <Typography variant="subtitle2" sx={{ padding: "25px" }}>
                      There are no {selectedType}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : !loading && staticData.length > 0 ? (
                <>
                  {(() => {
                    console.log("staticData:", staticData);
                    return null;
                  })()}
                  {(columnList.length > 0 || columns.length > 0) &&
                    staticData.map((row) => (
                      <TableRow
                          key={row._id || row.id || row.item_id || Math.random()}
                        sx={{
                          height: 40,
                          "&:hover": { backgroundColor: "#f9f9fb" },
                        }}
                        onMouseEnter={() => setHoveredRow(row._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {/* Fixed checkbox column */}

                        <TableCell
                          sx={{
                            p: 0.5,
                            width: 60, // Fixed width for checkbox column
                            // Only make it sticky when there's horizontal scrolling
                            position:
                              (columnList.length > 0 
                                ? columnList.filter((col) => col.is_default_select_column)
                                : columns
                              ).length > 8
                                ? "sticky"
                                : "static",
                            left: 0,
                            zIndex: 1,
                            backgroundColor:
                              hoveredRow === row._id ? "#f9f9fb" : "#fff", // Match row background
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {value !== "deliverychallan" && (
                              <Checkbox
                                checked={selected.includes(row._id)}
                                onChange={() => handleSelectRow(row._id)}
                                size="small"
                                sx={{ ml: "14px", mr: 1 }}
                              />
                            )}
                          </Box>
                        </TableCell>

                        {/* Dynamic width data columns */}
                        {(columnList.length > 0 
                          ? columnList.filter((col) => col.is_default_select_column)
                          : columns
                        ).map((col, index) => (
                            <TableCell
                              key={col.value}
                              align={
                                col.value === "invoiced_status_formatted" &&
                                value === "salesorder"
                                  ? "left"
                                  : col.value === "total_formatted" ||
                                    col.value === "balance_formatted"
                                  ? "right"
                                  : "left"
                              }
                              sx={{
                                p: 0.5,
                                fontSize:
                                  col.value === "status_formatted"
                                    ? "12.0px !important"
                                    : "13.2px !important",
                                color:
                                  row.status_formatted === "Inactive"
                                    ? "#6c718a !important"
                                    : col.value === "status_formatted" ||
                                      col.value === "order_status_formatted" ||
                                      col.value ===
                                        "invoiced_status_formatted" ||
                                      col.value === "status_text" ||
                                      col.value === "account_name" ||
                                      col.value === "payment_id" ||
                                      col.value === "name" ||
                                      col.value === "contact_name" ||
                                      col.value === "purchase_number" ||
                                      col.value === "bill_number" ||
                                      col.value === "account_name" ||
                                      col.value === "status" ||
                                      col.value === "status_type" ||
                                      col.value === "invoice_number" ||
                                      col.value === "estimate_number" ||
                                      col.value === "salesorder_number" ||
                                      col.value === "deliverychallan_number" ||
                                      col.value === "recurrence_name"
                                    ? (getStatusColor && value === "vendor_payment" && col.value === "status_formatted" 
                                        ? getStatusColor(row[col.value]) 
                                        : getColor(col.value, row[col.value]))
                                    : "inherit",
                                textTransform:
                                  col.value === "order_status_formatted" ||
                                  col.value === "invoiced_status_formatted" ||
                                  col.value === "status_formatted" ||
                                  col.value === "status"
                                    ? "uppercase"
                                    : "",
                                whiteSpace: "nowrap", // Prevents text wrapping
                                // Conditional sizing based on column count
                                width:
                                  (columnList.length > 0 
                                    ? columnList.filter((col) => col.is_default_select_column)
                                    : columns
                                  ).length <= 8
                                    ? `${
                                        100 /
                                        (columnList.length > 0 
                                          ? columnList.filter((col) => col.is_default_select_column)
                                          : columns
                                        ).length
                                      }%`
                                    : "auto",
                                maxWidth:
                                  (columnList.length > 0 
                                    ? columnList.filter((col) => col.is_default_select_column)
                                    : columns
                                  ).length > 8
                                    ? "300px"
                                    : "none",
                                paddingLeft: "20px",
                                overflow: "hidden",
                                textOverflow: "ellipsis", // Show ellipsis for text that overflows
                              }}
                              onClick={() => {
                                console.log("CUSTOMIZED TABLE - Row clicked - row data:", row);
                                console.log("CUSTOMIZED TABLE - Row keys:", Object.keys(row || {}));
                                console.log("CUSTOMIZED TABLE - onRowClick function:", onRowClick);
                                if (row && onRowClick) {
                                  console.log("CUSTOMIZED TABLE - Calling onRowClick with row:", row);
                                  onRowClick(row);
                                } else {
                                  console.error("CUSTOMIZED TABLE - Row is undefined or onRowClick is not a function!");
                                }
                              }}
                            >
                              {col.value === "invoiced_status_formatted" &&
                              value === "salesorder" ? (
                                <span
                                  title={row[col.value]}
                                  style={{
                                    fontSize: "25px",
                                    color:
                                      row[col.value] === "Invoiced"
                                        ? "#408dfb"
                                        : "#eee",
                                  }}
                                >
                                  &#8226;{" "}
                                </span>
                              ) : value === "customer_payment" &&
                                col.value === "invoices" ? (
                                <>
                                  {row[col.value]?.map((data, index) => (
                                    <span key={index}>
                                      {data.invoice_number}
                                      {row[col.value].length !== index + 1
                                        ? ","
                                        : ""}
                                      <br />
                                    </span>
                                  ))}
                                </>
                              ) : (col.value === "status_formatted" ||
                                  col.value === "order_status_formatted") &&
                                value === "salesorder" ? (
                                <>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {row[col.value]}
                                    <Box title={row[col.value]}>
                                      {row?.is_emailed && (
                                        <>
                                          <Tooltip
                                            title="Sales Order sent via mail"
                                            placement="right"
                                            arrow
                                          >
                                            <EmailOutlinedIcon
                                              style={{
                                                color: "#6C718A",
                                                fontSize: "15px",
                                                marginLeft: "5px",
                                              }}
                                            />
                                          </Tooltip>
                                        </>
                                      )}
                                    </Box>
                                  </Box>
                                </>
                              ) : value === "invoice" ? (
                                col.value === "status_formatted" &&
                                (row[col.value] === "Overdue" ||
                                  row[col.value] === "Sent") ? (
                                  row.due_days
                                ) : col.value === "amount_formatted" ||
                                  col.value === "total_formatted" ||
                                  col.value === "amount" ? (
                                  typeof row[col.value] === "number" ? (
                                    `₹${row[col.value].toFixed(2)}`
                                  ) : (
                                    row[col.value]
                                  )
                                ) : (
                                  row[col.value]
                                )
                              ) : col.value === "amount_formatted" ||
                                col.value === "total_formatted" ||
                                col.value === "due_amt" ||
                                col.value === "total" ||
                                col.value === "rate_formatted" ||
                                col.value === "amount" ? (
                                typeof row[col.value] === "number" ? (
                                  `₹${row[col.value].toFixed(2)}`
                                ) : (
                                  row[col.value]
                                )
                              ) : (
                                row[col.value]
                              )}
                            </TableCell>
                          ))}

                        <TableCell
                          sx={{
                            p: 0,
                            position: "relative",
                            textAlign: "center",
                            width:
                              columnList.filter(
                                (col) => col.is_default_select_column
                              ).length <= 8
                                ? "40px"
                                : "auto",
                          }}
                        >
                          {hoveredRow === row._id &&
                            (value === "invoice" ||
                              value === "customer" ||
                              value === "vendor" ||
                              value === "recurring_invoice" ||
                              value === "vendor_payment") && (
                              <>
                                <IconButton
                                  onClick={(e) => handleActionClick(e, row._id)}
                                  size="small"
                                >
                                  <ExpandCircleDownIcon
                                    fontSize="small"
                                    sx={{
                                      width: 25,
                                      height: 25,
                                    }}
                                    color="primary"
                                  />
                                </IconButton>
                                <Popover
                                  open={Boolean(actionAnchorEl)}
                                  anchorEl={actionAnchorEl}
                                  onClose={() => setActionAnchorEl(null)}
                                  sx={{ marginTop: "32px" }}
                                  PaperProps={{
                                    sx: {
                                      borderRadius: 1,
                                      p: 0.5,
                                      minWidth: 130,
                                      boxShadow:
                                        "0px 4px 16px rgba(0,0,0,0.12)",
                                    },
                                  }}
                                >
                                  <Box>
                                    {row?.status === "active" ? (
                                      <>
                                        <MenuItem
                                          sx={menuItemStyles}
                                          onClick={() => {
                                            setActionAnchorEl(null);
                                            back(row);
                                          }}
                                        >
                                          <ListItemIcon>
                                            <ModeOutlinedIcon
                                              fontSize="13px"
                                              color="#408dfb"
                                            />
                                          </ListItemIcon>
                                          <ListItemText
                                            className="menu-text"
                                            primary="Edit"
                                          />
                                        </MenuItem>
                                        {value !== "recurring_invoice" && (
                                          <MenuItem
                                            sx={menuItemStyles}
                                            onClick={() =>
                                              router.push(
                                                `/common/customerEmail?org_id=${organization_id}&contact_id=${
                                                  row?.contact_id
                                                }&email_type=${
                                                  value || "customer"
                                                }`
                                              )
                                            }
                                          >
                                            <ListItemIcon>
                                              <MailOutlineIcon
                                                fontSize="13px"
                                                color="#408dfb"
                                              />
                                            </ListItemIcon>
                                            <ListItemText
                                              className="menu-text"
                                              primary="Email Customer"
                                            />
                                          </MenuItem>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <MenuItem
                                          sx={menuItemStyles}
                                          onClick={() => {
                                            setActionAnchorEl(null);
                                            handleStatus(row.contact_id);
                                          }}
                                        >
                                          <ListItemText
                                            className="menu-text"
                                            primary="Mark as active"
                                          />
                                        </MenuItem>
                                      </>
                                    )}
                                  </Box>
                                </Popover>
                              </>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 3}
                    align="center"
                    sx={{
                      borderBottom: "none",
                      height: 100,
                      textAlign: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <CircularProgress size="30px" />
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination Component - Fixed Footer */}
      {showPagination && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            height: "64px", // or match actual height
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff", // to avoid bleed-through
            zIndex: 1,
            boxShadow: "0px -1px 4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Total Count with View toggle */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#21263c" }}>
              Total Count:{" "}
              {showCount ? (
                totalCount
              ) : (
                <span
                  style={{ color: "#206ddc", cursor: "pointer" }}
                  onClick={() => setShowCount(true)}
                >
                  View
                </span>
              )}
            </Typography>
          </Box>

          {/* Pagination Controls - Right Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {/* Items Per Page Selector */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "4px 12px",
                cursor: "pointer",
                backgroundColor: "#f5f7fa",
                color: "#838195",
                "& svg": {
                  color: "#838195",
                },
                "&:hover": {
                  color: "#2485e8",
                  "& svg": {
                    color: "#2485e8",
                  },
                },
              }}
              onClick={handleClick}
            >
              <Settings width="16px" style={{ marginRight: "5px" }} />
              <Typography variant="body2" sx={{ fontSize: "14px" }}>
                {rowsPerPage} per page
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{ dense: true }}
              PaperProps={{
                sx: {
                  mt: 1,
                  width: 150,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                },
              }}
            >
              {[10, 25, 50, 100, 200].map((value) => (
                <MenuItem
                  key={value}
                  selected={rowsPerPage === value}
                  onClick={() => handleChangeRowsPerPage({ target: { value } })}
                >
                  {value} per page
                </MenuItem>
              ))}
            </Menu>

            <Divider orientation="vertical" flexItem />
            {/* Page Navigation */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                backgroundColor: "menu.text.normal",
              }}
            >
              <IconButton
                disabled={page === 1}
                onClick={() => handleChangePage(page - 1)}
                size="small"
                sx={{
                  color: page === 1 ? "#ccc" : "#408dfb",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  borderRadius: 0,
                  height: "100%",
                }}
              >
                <ChevronLeftIcon style={{ width: "18px" }} />
              </IconButton>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: "normal",
                  color: "#000",
                  fontSize: "14px",
                }}
              >
                {startItem} - {endItem}
              </Typography>

              <IconButton
                disabled={!hasMore}
                onClick={() => handleChangePage(page + 1)}
                size="small"
                sx={{
                  color: !hasMore ? "#ccc" : "#408dfb",
                  cursor: !hasMore ? "not-allowed" : "pointer",
                  borderRadius: 0,
                  height: "100%",
                }}
              >
                <ChevronRightIcon style={{ width: "18px" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}

      {openModal && (
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              width: 600,
              maxWidth: "90%",
              maxHeight: "90vh",
              borderRadius: 1,
              boxShadow: 24,
              display: "flex",
              borderBottom: "none !important",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                // borderBottom: '1px solid #e0e0e0',
                bgcolor: "#f5f5f5",
              }}
            >
              <Typography
                variant="h6"
                display="flex"
                alignItems="center"
                fontSize="18px"
                component="div"
              >
                <Settings2 width="20px" style={{ marginRight: "10px" }} />{" "}
                Customize Columns
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {selectedCount} of {columnList.length} Selected
                </Typography>
                <IconButton size="small" onClick={() => setOpenModal(false)}>
                  <Close />
                </IconButton>
              </Box>
            </Box>

            {/* Search Box */}
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
              <TextField
                fullWidth
                placeholder="Search"
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  sx: { fontSize: "13px" },
                  startAdornment: (
                    <Search
                      style={{
                        color: "#838195",
                        width: "15px",
                        marginRight: "10px",
                      }}
                    />
                  ),
                }}
              />
            </Box>

            {/* Column List */}
            <Box
              sx={{
                overflowY: "auto",
                flex: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bdbdbd",
                  borderRadius: "4px",
                },
              }}
            >
              {filteredColumns.map((column) => (
                <Box
                  key={column._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mx: 3,
                    my: 1,
                    py: 0.5,
                    bgcolor: "#f9f9fb",
                    "&:hover": {
                      bgcolor: "#f9f9f9",
                      cursor: column.is_mandatory ? "pointer" : "grab", // 👈 Set cursor based on mandatory status
                    },
                  }}
                >
                  {column.is_default_select_column}
                  <DragIndicator
                    fontSize="small"
                    sx={{ color: "#bdbdbd", mr: 1 }}
                  />
                  {column.is_mandatory ? (
                    <Lock
                      style={{
                        width: "13px",
                        marginLeft: "10px",
                        marginRight: "12px",
                        color: "#9e9e9e",
                      }}
                    />
                  ) : (
                    <Checkbox
                      sx={{ fontSize: "16px" }}
                      checked={column.is_default_select_column}
                      onChange={() => handleCheckboxChange(column.value)}
                      // disabled={column.is_mandatory}
                      size="small"
                    />
                  )}
                  <Typography variant="body2" fontSize="13px" sx={{ ml: 1 }}>
                    {column.key}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                p: 2.5,
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <Button
                variant="contained"
                onClick={() => handleUpdateColumn(columnList)}
                // sx={{ mr: 1, bgcolor: '#4285f4', '&:hover': { bgcolor: '#3367d6' } }}
                sx={{
                  ...commonButtonStyle,
                  marginRight: "8px",
                  color: "menu.text.normal",
                  bgcolor: "#408dfb",
                  fontSize: "12px",
                  height: "30px",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#408dfb",
                    boxShadow: "none",
                  },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{
                  ...commonButtonStyle,
                  height: "30px",
                  color: "#000",
                  fontSize: "12px",
                  marginRight: "8px",
                }}
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
}
