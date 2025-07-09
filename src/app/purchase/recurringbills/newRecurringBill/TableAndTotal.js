// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   InputAdornment,
//   Divider,
//   Menu,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   ClickAwayListener,
//   Popper,
//   TableRow,
//   Paper,
//   styled,
//   TextField,
// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
// import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
// import apiService from "../../../../services/axiosService";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import CloseIcon from "@mui/icons-material/Close";
// import SearchIcon from "@mui/icons-material/Search";
// import { useTheme } from "@mui/material/styles";

// const options = ["At Transaction Level", "At Line Item Level"];

// const DiscountAccount = [
//   {
//     label: "Expense",
//     accounts: [
//       "Advertising And Marketing",
//       "Automobile Expense",
//       "Bad Debt",
//       "Bank Fees and Charges",
//       "Consultant Expense",
//       "Contract Assets",
//       "Credit Card Charges",
//       "Depreciation And Amortisation",
//       "Depreciation Expense",
//       "IT and Internet Expenses",
//       "Janitorial Expense",
//       "Lodging",
//       "Meals and Entertainment",
//       "Merchandise",
//       "Office Supplies",
//       "Other Expenses",
//       "Postage",
//       "Printing and Stationery",
//       "Purchase Discounts",
//       "Raw Materials And Consumables",
//       "Rent Expense",
//       "Repairs and Maintenance",
//       "Salaries and Employee Wages",
//       "Telephone Expense",
//       "Transportation Expense",
//       "Travel Expense",
//       "Uncategorized",
//     ],
//   },
//   {
//     label: "Cost of Goods Sold",
//     accounts: [
//       "Cost of Goods Sold",
//       "Job Costing",
//       "Labor",
//       "Materials",
//       "Subcontractor",
//     ],
//   },
// ];



// const TDS_OPTIONS = [
//   { label: "Commission or Brokerage", rate: 2 },
//   { label: "Commission or Brokerage (Reduced)", rate: 3.75 },
//   { label: "Dividend", rate: 10 },
//   { label: "Dividend (Reduced)", rate: 7.5 },
//   { label: "Other Interest than securities", rate: 10 },
//   { label: "Other Interest than securities (Reduced)", rate: 7.5 },
//   { label: "Payment of contractors for Others", rate: 2 },
//   { label: "Payment of contractors for Others (Reduced)", rate: 1.5 },
//   { label: "Payment of contractors HUF/Indiv", rate: 1 },
//   { label: "Payment of contractors HUF/Indiv (Reduced)", rate: 0.75 },
//   { label: "Professional Fees", rate: 10 },
//   { label: "Professional Fees (Reduced)", rate: 7.5 },
//   { label: "Rent on land or furniture etc", rate: 10 },
//   { label: "Rent on land or furniture etc (Reduced)", rate: 7.5 },
//   { label: "Technical Fees (2%)", rate: 2 },
// ];

// const COLORS = {
//   primary: "#408dfb",
//   error: "#F44336",
//   textPrimary: "#333333",
//   textSecondary: "#66686b",
//   borderColor: "#c4c4c4",
//   hoverBg: "#f0f7ff",
//   bgLight: "#f8f8f8",
// };

// const StyledTextField = styled("input")(({ error }) => ({
//   height: "35px",
//   width: "100%",
//   padding: "6px 12px",
//   border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
//   borderRadius: "7px",
//   fontSize: "14px",
//   backgroundColor: "#fff",
//   "&:hover": {
//     borderColor: COLORS.primary,
//     boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
//   },
//   "&:focus": {
//     outline: "none",
//     borderColor: COLORS.primary,
//     boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
//   },
//   "&::placeholder": {
//     color: COLORS.textSecondary,
//     opacity: 1,
//   },
//   "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
//     "-webkit-appearance": "none",
//     margin: 0,
//   },
//   "-moz-appearance": "textfield",
// }));

// const TableAndTotal = ({ formik }) => {
//   const theme = useTheme();

//   const [discountAnchorEl, setDiscountAnchorEl] = useState(null);
//   const [disAccount, setDisAccount] = useState(null);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [itemAnchorEl, setItemAnchorEl] = useState(null);
//   const [itemList, setItemList] = useState([]);
//   const [listExpenseAnchorEl, setListExpenseAnchorEl] = useState(null);
//   const [tdsAnchorEl, setTdsAnchorEl] = useState(null);
//   const [totalBoxDisAcc, setTotalBoxDisAcc] = useState(null);
//   const totalDisAcc = Boolean(totalBoxDisAcc);

//   const open = Boolean(discountAnchorEl);
//   const disOpen = Boolean(disAccount);
//   const itemOpen = Boolean(itemAnchorEl);
//   const listExpenseOpen = Boolean(listExpenseAnchorEl);
//   const tdsOpen = Boolean(tdsAnchorEl);
//   const organization_id = localStorage.getItem("organization_id");

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await apiService({
//           method: "GET",
//           url: `/api/v1/item/getitems?organization_id=${organization_id}`,
//         });

//         console.log(response.data.data, "Table customers got");
//         setItemList(response.data.data);
//       } catch (error) {
//         console.log("Error in fetching the items for Recurring Bill", error);
//       }
//     };

//     fetchItems();
//   }, []);

//   useEffect(() => {
//     CalculateTotal();
//   }, [formik.values.line_items]);

//   const handleItemSelect = (list) => {
//     formik.setFieldValue(`line_items[${selectedIndex}.name]`, list.name);

//     const rate = list.rate.toFixed(2);
//     formik.setFieldValue(`line_items[${selectedIndex}.rate]`, rate);
//     const index = selectedIndex;
//     const quantity = formik.values.line_items[index].quantity;

//     CalculateLineTotal(index, rate, quantity);

//     handleItemClick();
//   };

//   const handleItemClick = (event, index) => {
//     if (itemAnchorEl == null) {
//       setItemAnchorEl(event.currentTarget);
//       setSelectedIndex(index);
//     } else {
//       setItemAnchorEl(null);
//     }
//   };

//   const handleAddRow = () => {
//     const newRow = {
//       item_id: "",
//       name: "",
//       account: "",
//       quantity: 1,
//       rate: 0,
//       tax: "",
//       discount: 0,
//       amount: 0,
//     };
//     formik.setFieldValue("line_items", [...formik.values.line_items, newRow]);
//   };

//   const handleRemoveLineItem = (indexToRemove) => {
//     const updatedItems = formik.values.line_items.filter(
//       (_, index) => index !== indexToRemove
//     );
//     formik.setFieldValue("line_items", updatedItems);
//   };

//   const CalculateLineTotal = (index, rate, quantity) => {
//     if (!rate || !quantity) {
//       return 0;
//     }
//     const total = rate * quantity;
//     const newTotal = total.toFixed(2);
//     console.log(total, "The Calculated Total ra ");
//     formik.setFieldValue(`line_items[${index}].amount`, newTotal);
//   };

//   const handleLineQuantity = (e, index) => {
//     formik.setFieldValue(`line_items[${index}].quantity`, e.target.value);
//     const quantity = parseFloat(e.target.value);
//     const rate = parseFloat(formik.values.line_items[index].rate);
//     CalculateLineTotal(index, rate, quantity);
//   };

//   const handleLineRate = (e, index) => {
//     const rate = parseFloat(e.target.value);
//     formik.setFieldValue(`line_items[${index}].rate`, rate);
//     const quantity = parseFloat(formik.values.line_items[index].quantity);
//     CalculateLineTotal(index, rate, quantity);
//   };

//   const handleClick = (event) => {
//     if (open) {
//       setDiscountAnchorEl(null);
//     } else {
//       setDiscountAnchorEl(event.currentTarget);
//     }
//   };

//   const handleDisClick = (event) => {
//     if (disOpen) {
//       setDisAccount(null);
//     } else {
//       setDisAccount(event.currentTarget);
//     }
//   };

//   const handleClose = () => {
//     setDisAccount(null);
//   };

//   const handleCloseDisAccount = () => {
//     setDiscountAnchorEl(null);
//   };

//   const handleDisSelect = (value) => {
//     formik.setFieldValue("discount_account", value);
//     handleCloseDisAccount();
//   };

//   const handleSelect = (value) => {
//     formik.setFieldValue("discount_level", value);
//     handleClose();
//   };

//   const handleTdsClick = (event) => {
//     if (tdsOpen) {
//       setTdsAnchorEl(null);
//     } else {
//       setTdsAnchorEl(event.currentTarget);
//     }
//   };

//   const handleTdsClose = () => {
//     setTdsAnchorEl(null);
//   };

//   const handleTdsSelect = (option) => {
//     formik.setFieldValue("tax_percentage", option.rate);
//     formik.setFieldValue("tds_option", option.label);

//     // Calculate TDS amount
//     const afterDiscountAmount =
//       formik.values.sub_total - formik.values.discount_amount;
//     const tdsAmount = (afterDiscountAmount * option.rate) / 100;
//     formik.setFieldValue("tax_amount", tdsAmount.toFixed(2));

//     let subtotal = parseFloat(formik.values.sub_total);
//     const discount_amount = parseFloat(formik.values.discount_amount);
//     const adjustmentAmount = parseFloat(formik.values.adjustment);

//     // Calculate final total
//     calculateFinalTotal(subtotal, discount_amount, tdsAmount, adjustmentAmount);

//     handleTdsClose();
//   };

//   const calculateFinalTotal = (
//     subtotal,
//     discount_amount,
//     tdsAmount,
//     adjustmentAmount
//   ) => {
//     const finalTotal =
//       subtotal - discount_amount - tdsAmount + adjustmentAmount;
//     formik.setFieldValue("total", finalTotal.toFixed(2));
//   };

//   const handleDiscount = (e) => {
//     let discountRate = e.target.value;
//     formik.setFieldValue("discount_percent", discountRate);
//     let total = formik.values.sub_total;
//     handleBoxAmount(total, discountRate);
//   };

//   const CalculateTotal = () => {
//     let total = 0;
//     formik.values.line_items.forEach((item) => {
//       if (item.amount !== null && item.amount !== "") {
//         total = Number(total) + Number(item.amount);
//       }
//     });
//     formik.setFieldValue("sub_total", total.toFixed(2));

//     let discountRate = formik.values.discount_percent || 0;
//     handleBoxAmount(total, discountRate);
//   };

//   const handleBoxAmount = (total, discountRate) => {
//     let discount_amount = (total * discountRate) / 100;
//     formik.setFieldValue("discount_amount", discount_amount.toFixed(2));

//     // Recalculate TDS if TDS percentage exists
//     if (formik.values.tds_option) {
//       const selectedTds = TDS_OPTIONS.find(
//         (option) => option.label === formik.values.tds_option
//       );
//       if (selectedTds) {
//         const afterDiscountAmount = total - discount_amount;
//         const tdsAmount = (afterDiscountAmount * selectedTds.rate) / 100;
//         formik.setFieldValue("tax_amount", tdsAmount.toFixed(2));

//         const adjustmentAmount = parseFloat(formik.values.adjustment);

//         // Calculate final total
//         calculateFinalTotal(
//           total,
//           discount_amount,
//           tdsAmount,
//           adjustmentAmount
//         );
//       }
//     } else {
//       const tdsAmount = parseFloat(formik.values.tax_amount);
//       const adjustmentAmount = parseFloat(formik.values.adjustment);

//       // Calculate final total
//       calculateFinalTotal(total, discount_amount, tdsAmount, adjustmentAmount);
//     }
//   };

//   const handleAdjustAmount = (e) => {
//     let adjust_amount = parseFloat(e.target.value) || 0;
//     formik.setFieldValue("adjustment", adjust_amount);

//     const subtotal = parseFloat(formik.values.sub_total);
//     const discount_amount = parseFloat(formik.values.discount_amount);
//     const tdsAmount = parseFloat(formik.values.tax_amount);

//     // Calculate final total
//     calculateFinalTotal(subtotal, discount_amount, tdsAmount, adjust_amount);
//   };

//   // Account Types
//   const [expenseAccAnchorEl, setExpenseAccAnchorEl] = useState(null);
//   const expenseAccOpen = Boolean(expenseAccAnchorEl);
//   const [expenseAccSearchTerm, setExpenseAccSearchTerm] = useState("");
//   const [expenseAccCategories, setExpenseAccCategories] = useState([]);
//   useEffect(() => {
//     const get_COA_api = async () => {
//       try {
//         const response = await apiService({
//           method: "GET",
//           url: `/api/v1/COA/get-coa-list?org_id=${organization_id}`,
//         });
//         if (response.statusCode === 200 && Array.isArray(response.data.data)) {
//           console.log(response.data.data, "Fetched COA list");
//           setExpenseAccCategories(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching COA list:", error);
//       }
//     };

//     if (organization_id) {
//       get_COA_api();
//     }
//   }, [organization_id]);
//   // Filter options based on search term
//   const filteredExpenseAccOptions = Array.isArray(expenseAccCategories)
//     ? expenseAccCategories
//         .map((group) => ({
//           category: group?._id || "Uncategorized",
//           options: Array.isArray(group?.accounts)
//             ? group.accounts.filter((acc) =>
//                 acc?.account_name
//                   ?.toLowerCase()
//                   .includes(expenseAccSearchTerm.toLowerCase())
//               )
//             : [],
//         }))
//         .filter((group) => group.options.length > 0)
//     : [];

//   // Custom dropdown handlers
//   const handleExpenseAccClick = (event) => {
//     // console.log(event, "event");
//     setExpenseAccAnchorEl(event.currentTarget);
//   };

//   const handleExpenseAccClose = () => {
//     setExpenseAccAnchorEl(null);
//     setExpenseAccSearchTerm("");
//   };

//   const handleExpenseAccSelect = (option) => {
//     console.log(option, "option sacascas");
//     formik.setFieldValue("lineItems[0].account_name", option.account_name);
//     formik.setFieldValue("lineItems[0].account_id", option.account_id);
//     handleExpenseAccClose();
//   };

//   const handleExpenseAccSearch = (e) => {
//     setExpenseAccSearchTerm(e.target.value);
//   };

//   return (
//     <Box>
//       {/*Table transaction Level*/}

//       <Box sx={{ display: "flex", alignItems: "center" }}>
//         {/*At Transaction Level*/}
//         <Box
//           sx={{
//             display: "flex",
//             gap: 1.5,
//             cursor: "pointer",
//             width: "210px",
//             ml: 3,
//             py: 0.5,
//             my: 1.5,
//             alignItems: "center",
//             borderRight: "1px solid  #ccc",
//           }}
//           onClick={handleClick}
//         >
//           <ScatterPlotIcon />

//           <Box sx={{ fontSize: "12px" }}>{formik.values.discount_level}</Box>

//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </Box>

//           <Menu
//             anchorEl={discountAnchorEl}
//             open={open}
//             onClose={handleClose}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "center",
//             }}
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "center",
//             }}
//           >
//             <Typography
//               sx={{
//                 color: "#4C526C",
//                 fontSize: "13px",
//                 fontWeight: "600",
//                 pl: 1.5,
//               }}
//             >
//               Discount Type
//             </Typography>
//             {options.map((option) => (
//               <MenuItem
//                 key={option}
//                 onClick={() => handleSelect(option)}
//                 selected={formik.values.discount_level === option}
//                 sx={{
//                   m: 0.5,
//                   fontSize: "13px",
//                   fontWeight: "400",
//                   borderRadius: 1,
//                   backgroundColor:
//                     formik.values.discount_level === option
//                       ? "#408dfb !important"
//                       : "transparent",
//                   color:
//                     formik.values.discount_level === option
//                       ? "white"
//                       : "inherit",
//                   "&:hover": {
//                     backgroundColor:
//                       formik.values.discount_level === option
//                         ? "#408dfb !important"
//                         : "#f0f0f0",
//                   },
//                 }}
//               >
//                 {option}
//               </MenuItem>
//             ))}
//           </Menu>
//         </Box>

//         {/*Discount Account Selection*/}
//         {formik.values.discount_level === "At Line Item Level" && (
//           <Box
//             sx={{
//               display: "flex",
//               gap: 1.5,
//               cursor: "pointer",
//               width: "210px",
//               ml: 3,
//               py: 0.5,
//               my: 1.5,
//               alignItems: "center",
//             }}
//             onClick={handleDisClick}
//           >
//             <BusinessCenterIcon />
//             <Box sx={{ fontSize: "12px" }}>
//               {formik.values.discount_account
//                 ? formik.values.discount_account.length > 20
//                   ? formik.values.discount_account.slice(0, 20) + "..."
//                   : formik.values.discount_account
//                 : "Select Discount Account"}
//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               {disOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//             </Box>

//             <Menu
//               anchorEl={disAccount}
//               open={disOpen}
//               onClose={handleCloseDisAccount}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "center",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "center",
//               }}
//               sx={{ height: "350px" }}
//             >
//               {DiscountAccount.map((option) => (
//                 <>
//                   <Typography
//                     sx={{
//                       fontSize: "13px",
//                       color: "#4C526C",
//                       p: 1,
//                       fontWeight: "600",
//                     }}
//                   >
//                     {option.label}
//                   </Typography>
//                   {option.accounts.map((option) => (
//                     <MenuItem
//                       key={option}
//                       onClick={() => handleDisSelect(option)}
//                       selected={formik.values.discount_account === option}
//                       sx={{
//                         m: 0.5,
//                         fontSize: "13px",
//                         fontWeight: "400",
//                         borderRadius: 1,
//                         backgroundColor:
//                           formik.values.discount_account === option
//                             ? "#408dfb !important"
//                             : "transparent",
//                         color:
//                           formik.values.discount_account === option
//                             ? "white"
//                             : "inherit",
//                         "&:hover": {
//                           backgroundColor:
//                             formik.values.discount_account === option
//                               ? "#408dfb !important"
//                               : "#f0f0f0",
//                         },
//                       }}
//                     >
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </>
//               ))}
//             </Menu>
//           </Box>
//         )}
//       </Box>

//       {/*Table Box Content*/}

//       <Paper elevation={0}>
//         <TableContainer sx={{ ml: 3, borderRadius: 2 }}>
//           <Table sx={{ borderCollapse: "collapse" }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     fontSize: "12px !important",
//                     color: "black !important",
//                     borderBottom: "1px solid #ddd",
//                     borderRight: "none",
//                     fontWeight: "550 !important",
//                     padding: "5px !important",
//                     pl: "25px !important",
//                   }}
//                   colSpan={4}
//                 >
//                   Item Table
//                 </TableCell>
//                 <TableCell
//                   sx={{ textAlign: "right", color: "black !important" }}
//                 >
//                   BulkActions
//                 </TableCell>
//               </TableRow>
//               <TableCell
//                 sx={{
//                   width: "30% !important",
//                   color: "black !important",
//                   bgcolor: "white !important",
//                 }}
//               >
//                 ITEM DETAILS
//               </TableCell>
//               <TableCell
//                 sx={{
//                   width: "25% !important",
//                   color: "black !important",
//                   bgcolor: "white !important",
//                 }}
//               >
//                 ACCOUNT
//               </TableCell>
//               <TableCell
//                 sx={{
//                   textAlign: "right",
//                   color: "black !important",
//                   bgcolor: "white !important",
//                 }}
//               >
//                 QUANTITY
//               </TableCell>
//               <TableCell
//                 sx={{
//                   textAlign: "right",
//                   color: "black !important",
//                   bgcolor: "white !important",
//                 }}
//               >
//                 RATE
//               </TableCell>
//               <TableCell
//                 sx={{
//                   textAlign: "right",
//                   color: "black !important",
//                   bgcolor: "white !important",
//                 }}
//               >
//                 AMOUNT
//               </TableCell>
//             </TableHead>

//             <TableBody>
//               {formik.values.line_items.map((item, index) => (
//                 <TableRow key={index} sx={{ borderBottom: "none" }}>
//                   {/*Item Detail*/}

//                   <TableCell>
//                     <StyledTextField
//                       readOnly
//                       name={`line_items[${index}].name`}
//                       placeholder="Select Item"
//                       error={
//                         formik.touched.line_items?.[index]?.name &&
//                         Boolean(formik.errors.line_items?.[index]?.name)
//                       }
//                       value={item.name}
//                       onClick={(event) => {
//                         handleItemClick(event, index);
//                       }}
//                       sx={{ cursor: "pointer", width: 300 }}
//                     />
//                     {formik.touched.line_items?.[index]?.name &&
//                       formik.errors.line_items?.[index]?.name && (
//                         <Typography
//                           sx={{
//                             fontSize: "0.75rem",
//                             color: COLORS.error,
//                             pl: 1,
//                           }}
//                         >
//                           {formik.errors.line_items[index].name}
//                         </Typography>
//                       )}
//                   </TableCell>

//                   {/* Account */}

//                   <TableCell
//                     align="center"
//                     sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
//                   >
//                     {/* Custom dropdown trigger */}
//                     <Box sx={{ position: "relative", width: "200px" }}>
//                       <Box
//                         onClick={handleExpenseAccClick}
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           height: "35px",
//                           width: "200px",
//                           justifyContent: "space-between",
//                           border:
//                             formik.touched.lineItems?.[0]?.account_name &&
//                             Boolean(formik.errors.lineItems?.[0]?.account_name)
//                               ? "1px solid #d32f2f"
//                               : "1px solid #c4c4c4",
//                           borderRadius: "7px",
//                           padding: "8px 14px",
//                           cursor: "pointer",
//                           backgroundColor: "white",
//                           color: "gray",
//                           "&:hover": {
//                             borderColor: "#408dfb",
//                           },
//                         }}
//                       >
//                         <Typography
//                           sx={{
//                             fontSize: "13px",
//                             color: formik.values.lineItems?.[0]?.account_name
//                               ? "gray"
//                               : "#aaa",
//                           }}
//                         >
//                           {formik.values.lineItems?.[0]?.account_name ||
//                             "Select expense account"}
//                         </Typography>
//                         <KeyboardArrowDownIcon
//                           sx={{ fontSize: "22px", marginRight: "-10px" }}
//                         />
//                       </Box>
//                     </Box>

//                     {/* Expense Account Option */}
//                     <Popper
//                       open={expenseAccOpen}
//                       anchorEl={expenseAccAnchorEl}
//                       placement="bottom-start"
//                       style={{ width: "350px", zIndex: 1 }}
//                     >
//                       <ClickAwayListener onClickAway={handleExpenseAccClose}>
//                         <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
//                           <Box>
//                             <TextField
//                               placeholder="Search account..."
//                               variant="outlined"
//                               size="small"
//                               fullWidth
//                               onClick={(e) => e.stopPropagation()}
//                               value={expenseAccSearchTerm}
//                               onChange={handleExpenseAccSearch}
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <SearchIcon
//                                       sx={{
//                                         fontSize: "16px",
//                                         color: "#757575",
//                                       }}
//                                     />
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                   minHeight: "30px",
//                                   "& input": {
//                                     padding: "4px 8px",
//                                     fontSize: "13px",
//                                   },
//                                   "& fieldset": {
//                                     borderColor: "#e0e0e0",
//                                   },
//                                   "&:hover fieldset": {
//                                     borderColor: "#408dfb",
//                                   },
//                                   "&.Mui-focused fieldset": {
//                                     borderColor: "#408dfb",
//                                   },
//                                 },
//                               }}
//                             />

//                             {filteredExpenseAccOptions?.length === 0 ? (
//                               <Box sx={{ p: 1 }}>No options found</Box>
//                             ) : (
//                               filteredExpenseAccOptions.map(
//                                 (group, groupIndex) => (
//                                   <Box key={groupIndex} sx={{ mb: 1 }}>
//                                     <Typography
//                                       sx={{
//                                         fontSize: "13px",
//                                         fontWeight: "600",
//                                         p: 1,
//                                         backgroundColor: COLORS.bgLight,
//                                       }}
//                                     >
//                                       {group.category}
//                                     </Typography>

//                                     {group.options.map((option, index) => (
//                                       <MenuItem
//                                         key={`${option.account_id}`}
//                                         onClick={() =>
//                                           handleExpenseAccSelect(option)
//                                         }
//                                         sx={{
//                                           fontSize: "13px",
//                                           color: "#66686b",
//                                           "&:hover": {
//                                             borderRadius: "5px",
//                                             backgroundColor:
//                                               theme.palette.hover?.background ||
//                                               "",
//                                             color:
//                                               theme.palette.hover?.text || "",
//                                           },
//                                           maxWidth: "380px",
//                                           overflow: "hidden",
//                                         }}
//                                       >
//                                         {option.account_name}
//                                       </MenuItem>
//                                     ))}
//                                   </Box>
//                                 )
//                               )
//                             )}
//                           </Box>
//                         </Paper>
//                       </ClickAwayListener>
//                     </Popper>
//                   </TableCell>

//                   {/*Quantiy*/}

//                   <TableCell>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         flexDirection: "column",
//                         alignItems: "end",
//                       }}
//                     >
//                       <StyledTextField
//                         name={`line_items[${index}].quantity`}
//                         type="number"
//                         value={formik.values.line_items[index].quantity}
//                         onChange={(e) => {
//                           handleLineQuantity(e, index);
//                         }}
//                         error={
//                           formik.touched.line_items?.[index]?.quantity &&
//                           Boolean(formik.errors.line_items?.[index]?.quantity)
//                         }
//                         onBlur={formik.handleBlur}
//                         sx={{
//                           width: "120px",
//                           textAlign: "right",
//                           "& input": {
//                             "&::placeholder": {
//                               color: "#978195",
//                               fontWeight: "normal",
//                             },
//                           },
//                         }}
//                       />

//                       {formik.touched.line_items?.[index]?.quantity &&
//                         formik.errors.line_items?.[index]?.quantity && (
//                           <Typography
//                             sx={{
//                               textAlign: "left",
//                               pl: 2,
//                               fontSize: "0.75rem",
//                               color: COLORS.error,
//                             }}
//                           >
//                             {formik.errors.line_items[index].quantity}
//                           </Typography>
//                         )}
//                     </Box>
//                   </TableCell>

//                   {/*Rate*/}

//                   <TableCell>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         flexDirection: "column",
//                         alignItems: "end",
//                       }}
//                     >
//                       <StyledTextField
//                         name={`line_items[${index}].rate`}
//                         type="number"
//                         value={formik.values.line_items[index].rate}
//                         onChange={(e) => {
//                           handleLineRate(e, index);
//                         }}
//                         error={
//                           formik.touched.line_items?.[index]?.rate &&
//                           Boolean(formik.errors.line_items?.[index]?.rate)
//                         }
//                         onBlur={formik.handleBlur}
//                         sx={{
//                           width: "150px",
//                           textAlign: "right",
//                           "& input": {
//                             "&::placeholder": {
//                               color: "#978195",
//                               fontWeight: "normal",
//                             },
//                           },
//                         }}
//                       />
//                       {formik.touched.line_items?.[index]?.rate &&
//                         formik.errors.line_items?.[index]?.rate && (
//                           <Typography
//                             sx={{
//                               textAlign: "left",
//                               pl: 2,
//                               fontSize: "0.75rem",
//                               color: COLORS.error,
//                             }}
//                           >
//                             {formik.errors.line_items[index].rate}
//                           </Typography>
//                         )}
//                     </Box>
//                   </TableCell>

//                   {/*Amount*/}

//                   <TableCell>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         flexDirection: "column",
//                         alignItems: "end",
//                       }}
//                     >
//                       <StyledTextField
//                         name={`line_items[${index}].amount`}
//                         type="number"
//                         value={formik.values.line_items[index].amount}
//                         error={
//                           formik.touched.line_items?.[index]?.amount &&
//                           Boolean(formik.errors.line_items?.[index]?.rate)
//                         }
//                         onBlur={formik.handleBlur}
//                         sx={{
//                           width: "120px",
//                           textAlign: "right",
//                           "& input": {
//                             "&::placeholder": {
//                               color: "#978195",
//                               fontWeight: "normal",
//                             },
//                           },
//                         }}
//                       />
//                     </Box>
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontSize: "12px !important",
//                       color: "#6c78a3 !important",
//                       borderBottom: "1px solid #ddd",
//                       borderRight: "none",
//                       textAlign: "center",
//                       padding: "8px 0px 40px 20px !important",
//                       width: "70px",
//                     }}
//                   >
//                     {formik.values.line_items.length > 1 && (
//                       <Box sx={{ cursor: "pointer" }}>
//                         <CloseIcon
//                           sx={{ color: "#d91439" }}
//                           onClick={() => handleRemoveLineItem(index)}
//                         />
//                       </Box>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/*Item Dropdown*/}

//         <Popper
//           open={itemOpen}
//           anchorEl={itemAnchorEl}
//           placement="bottom-start"
//           sx={{
//             zIndex: 1,
//             overflowY: "auto",
//             height: 250,
//             width: "300px",
//             bgcolor: "white",
//             boxShadow: 3,
//           }}
//         >
//           <ClickAwayListener onClickAway={handleItemClick}>
//             <Paper>
//               <Box>
//                 {itemList.map((list, index) => (
//                   <Box
//                     key={index}
//                     sx={{ p: 1, pl: 2, cursor: "pointer" }}
//                     onClick={() => handleItemSelect(list)}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: "14px",
//                         fontWeight: "400",
//                         color: "#4C526C",
//                       }}
//                     >
//                       {list.name}
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontSize: "12px",
//                         fontWeight: "400",
//                         color: "#4C526C",
//                       }}
//                     >
//                       Purchase Rate:₹{list.rate.toFixed(2)}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Paper>
//           </ClickAwayListener>
//         </Popper>

//         {/*Account Dropdown*/}

//         {/* <Popper
//           open={listExpenseOpen}
//           anchorEl={listExpenseAnchorEl}
//           placement="bottom-start"
//           style={{ width: "260px", zIndex: 1 }}
//         >
//           <ClickAwayListener onClickAway={handleExpenseAccClose}>
//             <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
//               <Box>
//                 {expenseAccCategories.map((group, groupIndex) => (
//                   <Box key={groupIndex} sx={{ mb: 1 }}>
//                     <Typography
//                       sx={{
//                         fontSize: "13px",
//                         fontWeight: "600",
//                         p: 1,
//                         backgroundColor: COLORS.bgLight,
//                       }}
//                     >
//                       {group.category}
//                     </Typography>

//                     {group.options.map((option, index) => (
//                       <Box
//                         key={`${groupIndex}-${index}`}
//                         sx={{
//                           p: 1,
//                           pl: 2,
//                           fontSize: "13px",
//                           cursor: "pointer",
//                           "&:hover": {
//                             backgroundColor: COLORS.hoverBg,
//                           },
//                         }}
//                         onClick={() => handleExpenseAccSelect(option)}
//                       >
//                         {option}
//                       </Box>
//                     ))}
//                   </Box>
//                 ))}
//               </Box>
//             </Paper>
//           </ClickAwayListener>
//         </Popper> */}
//       </Paper>

//       <Box sx={{ display: "flex", gap: 60, my: 3 }}>
//         {/*Add New Row Button*/}
//         <Box>
//           <Box
//             onClick={handleAddRow}
//             sx={{
//               bgcolor: "#f1f1fa",
//               fontSize: "13px",
//               fontWeight: "400",
//               color: "BLACK",
//               borderRadius: "5px",
//               padding: "5px 10px",
//               display: "flex",
//               gap: 1,
//               alignItems: "center",
//               cursor: "pointer",
//               width: "150px",
//               textAlign: "center",
//               mx: 2,
//               p: 1,
//               ml: 3,
//             }}
//           >
//             <AddCircleOutlineIcon sx={{ color: "#408dfb", fontSize: "20px" }} />{" "}
//             <Box s>Add New Row</Box>
//           </Box>
//         </Box>

//         {/*Total Calculation Box*/}

//         <Box
//           sx={{ bgcolor: "#f9f9fb", width: "500px", ml: 3, borderRadius: 3 }}
//         >
//           {/*Sub Total*/}
//           <Box
//             sx={{
//               display: "flex",
//               py: 2,
//               pl: 3,
//               pr: 4,
//               justifyContent: "space-between",
//             }}
//           >
//             <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
//               Sub Total
//             </Typography>
//             <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
//               {formik.values.sub_total}
//             </Typography>
//           </Box>

//           {/*Discount, Tds, adjust*/}

//           <Box sx={{ pl: 3, pr: 4 }}>
//             {/*Discount*/}
//             <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
//               <Typography
//                 sx={{ fontSize: "13px", fontWeight: "400", width: "35%" }}
//               >
//                 Discount
//               </Typography>
//               <Box sx={{ width: "35%" }}>
//                 <TextField
//                   name="discount_percent"
//                   type="number"
//                   value={formik.values.discount_percent}
//                   onChange={(e) => {
//                     handleDiscount(e);
//                   }}
//                   onBlur={formik.handleBlur}
//                   error={
//                     formik.touched.discount_percent &&
//                     Boolean(formik.errors.discount_percent)
//                   }
//                   sx={{
//                     height: "35px",
//                     width: "140px",
//                     "& .MuiInputBase-root": {
//                       height: "35px",
//                       borderRadius: "7px",
//                       fontSize: "14px",
//                       backgroundColor: "#fff",
//                       border: `1px solid ${
//                         formik.touched.discount_percent &&
//                         formik.errors.discount_percent
//                           ? "#f44336"
//                           : "#D0D5DD"
//                       }`,
//                       paddingRight: "4px",
//                       paddingLeft: "4px",
//                       "&:hover": {
//                         borderColor: "#61A0FF",
//                         boxShadow: "0 0 0 0.7px rgba(97, 160, 255, 0.3)",
//                       },
//                       "&.Mui-focused": {
//                         borderColor: "#61A0FF",
//                         boxShadow: "0 0 0 0.2rem rgba(97, 160, 255, 0.3)",
//                       },
//                     },
//                     "& input": {
//                       padding: "6px 12px",
//                       textAlign: "right",
//                       "&::placeholder": {
//                         color: "#978195",
//                         opacity: 1,
//                         fontWeight: "normal",
//                       },
//                       // Remove number spinners
//                       "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
//                         {
//                           "-webkit-appearance": "none",
//                           margin: 0,
//                         },
//                       "-moz-appearance": "textfield",
//                     },
//                   }}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <Box
//                           sx={{
//                             bgcolor: "#f5f5f5",
//                             px: 1,
//                             height: "100%",
//                             borderRadius: "4px",
//                             fontSize: "14px",
//                             color: "#333",
//                           }}
//                         >
//                           %
//                         </Box>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   alignItems: "end",
//                   width: "30%",
//                 }}
//               >
//                 <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
//                   {formik.values.discount_amount}
//                 </Typography>
//               </Box>
//             </Box>

//             {/*Discount Account*/}
//             {formik.values.discount_percent > 0 && (
//               <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
//                 <Typography
//                   sx={{
//                     fontSize: "13px",
//                     fontWeight: "400",
//                     width: "35%",
//                     color: "#D6141D",
//                   }}
//                 >
//                   Discount Account*
//                 </Typography>
//                 <Box sx={{ width: "35%" }}>
//                   <StyledTextField
//                     name={"discount_account"}
//                     placeholder="Select an account"
//                     error={
//                       formik.touched.discount_account &&
//                       Boolean(formik.errors.discount_account)
//                     }
//                     value={formik.values.discount_account}
//                     onClick={(e) => setTotalBoxDisAcc(e.currentTarget)}
//                     sx={{ cursor: "pointer", width: "140px" }}
//                   />
//                   {formik.touched.discount_account &&
//                     formik.errors.discount_account && (
//                       <Typography
//                         sx={{
//                           fontSize: "0.75rem",
//                           color: COLORS.error,
//                           pl: 1,
//                         }}
//                       >
//                         {formik.errors.discount_account}
//                       </Typography>
//                     )}
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     alignItems: "end",
//                     width: "30%",
//                   }}
//                 >
//                   <Typography
//                     sx={{ fontSize: "13px", fontWeight: "400" }}
//                   ></Typography>
//                 </Box>
//               </Box>
//             )}

//             {/*TDS*/}

//             <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
//               <Typography
//                 sx={{ fontSize: "13px", fontWeight: "400", width: "35%" }}
//               >
//                 TDS
//               </Typography>
//               <Box sx={{ width: "35%" }}>
//                 <StyledTextField
//                   readOnly
//                   name={"tds_option"}
//                   placeholder="Select TDS"
//                   error={
//                     formik.touched.tds_option &&
//                     Boolean(formik.errors.tds_option)
//                   }
//                   value={formik.values.tds_option}
//                   onClick={handleTdsClick}
//                   sx={{ cursor: "pointer", width: "140px" }}
//                 />
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   alignItems: "end",
//                   width: "30%",
//                 }}
//               >
//                 <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
//                   {formik.values.tax_amount
//                     ? `(-${formik.values.tax_amount})`
//                     : "0.00"}
//                 </Typography>
//               </Box>
//             </Box>

//             {/*Adjustment*/}

//             <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
//               <Box sx={{ width: "35%" }}>
//                 <StyledTextField
//                   name={"adjustment_description"}
//                   value={formik.values.adjustment_description}
//                   onChange={formik.handleChange}
//                   error={
//                     formik.touched.adjustment_description &&
//                     Boolean(formik.errors.adjustment_description)
//                   }
//                   onBlur={formik.handleBlur}
//                   sx={{
//                     width: "120px",
//                     border: "1px dotted #978195",
//                     textAlign: "center",
//                     "& input": {
//                       "&::placeholder": {
//                         color: "#978195",
//                         fontWeight: "normal",
//                       },
//                     },
//                   }}
//                 />
//               </Box>

//               <Box sx={{ width: "35%" }}>
//                 <StyledTextField
//                   name={"adjustment"}
//                   type="number"
//                   value={formik.values.adjustment}
//                   onChange={(e) => {
//                     handleAdjustAmount(e);
//                   }}
//                   error={
//                     formik.touched.adjustment &&
//                     Boolean(formik.errors.adjustment)
//                   }
//                   onBlur={formik.handleBlur}
//                   sx={{
//                     width: "140px",
//                     textAlign: "right",
//                     "& input": {
//                       "&::placeholder": {
//                         color: "#978195",
//                         fontWeight: "normal",
//                       },
//                     },
//                   }}
//                 />
//               </Box>
//               <Typography
//                 sx={{
//                   width: "30%",
//                   textAlign: "right",
//                   fontSize: "13px",
//                   fontWeight: "400",
//                 }}
//               >
//                 {formik.values.adjustment
//                   ? formik.values.adjustment >= 0
//                     ? formik.values.adjustment
//                     : formik.values.adjustment
//                   : "0.00"}
//               </Typography>
//             </Box>
//           </Box>

//           <Divider sx={{ ml: 3, mr: 4, my: 2.5 }} />

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               pl: 3,
//               pr: 4,
//               pb: 2.5,
//             }}
//           >
//             <Typography>Total</Typography>
//             <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
//               {formik.values.total}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* TDS DROPDOWN MENU */}
//       <Menu
//         anchorEl={tdsAnchorEl}
//         open={tdsOpen}
//         onClose={handleTdsClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "left",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "left",
//         }}
//         sx={{ maxHeight: "300px", width: "250px" }}
//       >
//         <Typography
//           sx={{
//             color: "#4C526C",
//             fontSize: "13px",
//             fontWeight: "600",
//             pl: 1.5,
//             py: 1,
//           }}
//         >
//           Select TDS Type
//         </Typography>
//         {TDS_OPTIONS.map((option, index) => (
//           <MenuItem
//             key={index}
//             onClick={() => handleTdsSelect(option)}
//             selected={formik.values.tds_option === option.label}
//             sx={{
//               m: 0.5,
//               fontSize: "13px",
//               fontWeight: "400",
//               borderRadius: 1,
//               backgroundColor:
//                 formik.values.tds_option === option.label
//                   ? "#408dfb !important"
//                   : "transparent",
//               color:
//                 formik.values.tds_option === option.label ? "white" : "inherit",
//               "&:hover": {
//                 backgroundColor:
//                   formik.values.tds_option === option.label
//                     ? "#408dfb !important"
//                     : "#f0f0f0",
//               },
//             }}
//           >
//             <Box>
//               <Typography sx={{ fontSize: "13px" }}>{option.label}</Typography>
//               <Typography
//                 sx={{ fontSize: "13px", fontWeight: "400", opacity: 0.7 }}
//               >
//                 [{option.rate}%]
//               </Typography>
//             </Box>
//           </MenuItem>
//         ))}
//       </Menu>

//       <Popper
//         open={totalDisAcc}
//         anchorEl={totalBoxDisAcc}
//         placement="bottom-start"
//         style={{ width: "260px", zIndex: 1 }}
//       >
//         <ClickAwayListener onClickAway={() => setTotalBoxDisAcc(null)}>
//           <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
//             <Box>
//               {DiscountAccount.map((group, groupIndex) => (
//                 <Box key={groupIndex} sx={{ mb: 1 }}>
//                   <Typography
//                     sx={{
//                       fontSize: "13px",
//                       fontWeight: "600",
//                       p: 1,
//                       backgroundColor: COLORS.bgLight,
//                     }}
//                   >
//                     {group.label}
//                   </Typography>

//                   {group.accounts.map((option, index) => (
//                     <Box
//                       key={`${groupIndex}-${index}`}
//                       sx={{
//                         p: 1,
//                         pl: 2,
//                         fontSize: "13px",
//                         cursor: "pointer",
//                         "&:hover": {
//                           backgroundColor: COLORS.hoverBg,
//                         },
//                       }}
//                       onClick={() =>
//                         formik.setFieldValue("discount_account", option)
//                       }
//                     >
//                       {option}
//                     </Box>
//                   ))}
//                 </Box>
//               ))}
//             </Box>
//           </Paper>
//         </ClickAwayListener>
//       </Popper>
//     </Box>
//   );
// };

// export default TableAndTotal;



"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  Divider,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  ClickAwayListener,
  Popper,
  TableRow,
  Paper,
  styled,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import apiService from "../../../../services/axiosService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";

const options = ["At Transaction Level", "At Line Item Level"];

const DiscountAccount = [
  {
    label: "Expense",
    accounts: [
      "Advertising And Marketing",
      "Automobile Expense",
      "Bad Debt",
      "Bank Fees and Charges",
      "Consultant Expense",
      "Contract Assets",
      "Credit Card Charges",
      "Depreciation And Amortisation",
      "Depreciation Expense",
      "IT and Internet Expenses",
      "Janitorial Expense",
      "Lodging",
      "Meals and Entertainment",
      "Merchandise",
      "Office Supplies",
      "Other Expenses",
      "Postage",
      "Printing and Stationery",
      "Purchase Discounts",
      "Raw Materials And Consumables",
      "Rent Expense",
      "Repairs and Maintenance",
      "Salaries and Employee Wages",
      "Telephone Expense",
      "Transportation Expense",
      "Travel Expense",
      "Uncategorized",
    ],
  },
  {
    label: "Cost of Goods Sold",
    accounts: [
      "Cost of Goods Sold",
      "Job Costing",
      "Labor",
      "Materials",
      "Subcontractor",
    ],
  },
];

const TDS_OPTIONS = [
  { label: "Commission or Brokerage", rate: 2 },
  { label: "Commission or Brokerage (Reduced)", rate: 3.75 },
  { label: "Dividend", rate: 10 },
  { label: "Dividend (Reduced)", rate: 7.5 },
  { label: "Other Interest than securities", rate: 10 },
  { label: "Other Interest than securities (Reduced)", rate: 7.5 },
  { label: "Payment of contractors for Others", rate: 2 },
  { label: "Payment of contractors for Others (Reduced)", rate: 1.5 },
  { label: "Payment of contractors HUF/Indiv", rate: 1 },
  { label: "Payment of contractors HUF/Indiv (Reduced)", rate: 0.75 },
  { label: "Professional Fees", rate: 10 },
  { label: "Professional Fees (Reduced)", rate: 7.5 },
  { label: "Rent on land or furniture etc", rate: 10 },
  { label: "Rent on land or furniture etc (Reduced)", rate: 7.5 },
  { label: "Technical Fees (2%)", rate: 2 },
];

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const StyledTextField = styled("input")(({ error }) => ({
  height: "35px",
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
  borderRadius: "7px",
  fontSize: "14px",
  backgroundColor: "#fff",
  "&:hover": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&:focus": {
    outline: "none",
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
  "&::placeholder": {
    color: COLORS.textSecondary,
    opacity: 1,
  },
  "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "-moz-appearance": "textfield",
}));

const TableAndTotal = ({ formik }) => {
  const theme = useTheme();

  const [discountAnchorEl, setDiscountAnchorEl] = useState(null);
  const [disAccount, setDisAccount] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [itemAnchorEl, setItemAnchorEl] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [tdsAnchorEl, setTdsAnchorEl] = useState(null);
  const [totalBoxDisAcc, setTotalBoxDisAcc] = useState(null);
  
  // Account selection states
  const [expenseAccAnchorEl, setExpenseAccAnchorEl] = useState(null);
  const [expenseAccSearchTerm, setExpenseAccSearchTerm] = useState("");
  const [expenseAccCategories, setExpenseAccCategories] = useState([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);

  const open = Boolean(discountAnchorEl);
  const disOpen = Boolean(disAccount);
  const itemOpen = Boolean(itemAnchorEl);
  const tdsOpen = Boolean(tdsAnchorEl);
  const totalDisAcc = Boolean(totalBoxDisAcc);
  const expenseAccOpen = Boolean(expenseAccAnchorEl);
  
  const organization_id = localStorage.getItem("organization_id");

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/item/getitems?organization_id=${organization_id}`,
        });

        console.log(response.data.data, "Table items fetched");
        setItemList(response.data.data || []);
      } catch (error) {
        console.log("Error in fetching the items for Recurring Bill", error);
      }
    };

    if (organization_id) {
      fetchItems();
    }
  }, [organization_id]);

  // Fetch Chart of Accounts
  useEffect(() => {
    const get_COA_api = async () => {
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/COA/get-coa-list?org_id=${organization_id}`,
        });
        if (response.statusCode === 200 && Array.isArray(response.data.data)) {
          console.log(response.data.data, "Fetched COA list");
          setExpenseAccCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching COA list:", error);
      }
    };

    if (organization_id) {
      get_COA_api();
    }
  }, [organization_id]);

  // Calculate totals when line items change
  useEffect(() => {
    CalculateTotal();
  }, [formik.values.line_items]);

  const handleItemSelect = (list) => {
    if (selectedIndex !== null) {
      formik.setFieldValue(`line_items[${selectedIndex}].name`, list.name);
      formik.setFieldValue(`line_items[${selectedIndex}].item_id`, list.id || list._id || "");

      const rate = parseFloat(list.rate || 0).toFixed(2);
      formik.setFieldValue(`line_items[${selectedIndex}].rate`, rate);
      
      const quantity = formik.values.line_items[selectedIndex].quantity;
      CalculateLineTotal(selectedIndex, rate, quantity);
    }
    handleItemClick();
  };

  const handleItemClick = (event, index) => {
    if (itemAnchorEl == null) {
      setItemAnchorEl(event?.currentTarget);
      setSelectedIndex(index);
    } else {
      setItemAnchorEl(null);
      setSelectedIndex(null);
    }
  };

  const handleAddRow = () => {
    const newRow = {
      item_id: "",
      name: "",
      account: "",
      account_id: "",
      quantity: 1,
      rate: 0,
      tax: "",
      discount: 0,
      amount: 0,
    };
    formik.setFieldValue("line_items", [...formik.values.line_items, newRow]);
  };

  const handleRemoveLineItem = (indexToRemove) => {
    const updatedItems = formik.values.line_items.filter(
      (_, index) => index !== indexToRemove
    );
    formik.setFieldValue("line_items", updatedItems);
  };

  const CalculateLineTotal = (index, rate, quantity) => {
    if (!rate || !quantity) {
      formik.setFieldValue(`line_items[${index}].amount`, 0);
      return 0;
    }
    const total = parseFloat(rate) * parseFloat(quantity);
    const newTotal = total.toFixed(2);
    console.log(total, "The Calculated Total");
    formik.setFieldValue(`line_items[${index}].amount`, newTotal);
    return newTotal;
  };

  const handleLineQuantity = (e, index) => {
    const quantity = parseFloat(e.target.value) || 0;
    formik.setFieldValue(`line_items[${index}].quantity`, quantity);
    const rate = parseFloat(formik.values.line_items[index].rate) || 0;
    CalculateLineTotal(index, rate, quantity);
  };

  const handleLineRate = (e, index) => {
    const rate = parseFloat(e.target.value) || 0;
    formik.setFieldValue(`line_items[${index}].rate`, rate);
    const quantity = parseFloat(formik.values.line_items[index].quantity) || 0;
    CalculateLineTotal(index, rate, quantity);
  };

  const handleClick = (event) => {
    if (open) {
      setDiscountAnchorEl(null);
    } else {
      setDiscountAnchorEl(event.currentTarget);
    }
  };

  const handleDisClick = (event) => {
    if (disOpen) {
      setDisAccount(null);
    } else {
      setDisAccount(event.currentTarget);
    }
  };

  const handleClose = () => {
    setDisAccount(null);
  };

  const handleCloseDisAccount = () => {
    setDiscountAnchorEl(null);
  };

  const handleDisSelect = (value) => {
    formik.setFieldValue("discount_account", value);
    handleCloseDisAccount();
  };

  const handleSelect = (value) => {
    formik.setFieldValue("discount_level", value);
    handleClose();
  };

  const handleTdsClick = (event) => {
    if (tdsOpen) {
      setTdsAnchorEl(null);
    } else {
      setTdsAnchorEl(event.currentTarget);
    }
  };

  const handleTdsClose = () => {
    setTdsAnchorEl(null);
  };

  const handleTdsSelect = (option) => {
    formik.setFieldValue("tax_percentage", option.rate);
    formik.setFieldValue("tds_option", option.label);

    // Calculate TDS amount
    const afterDiscountAmount =
      formik.values.sub_total - formik.values.discount_amount;
    const tdsAmount = (afterDiscountAmount * option.rate) / 100;
    formik.setFieldValue("tax_amount", tdsAmount.toFixed(2));

    let subtotal = parseFloat(formik.values.sub_total);
    const discount_amount = parseFloat(formik.values.discount_amount);
    const adjustmentAmount = parseFloat(formik.values.adjustment);

    // Calculate final total
    calculateFinalTotal(subtotal, discount_amount, tdsAmount, adjustmentAmount);

    handleTdsClose();
  };

  const calculateFinalTotal = (
    subtotal,
    discount_amount,
    tdsAmount,
    adjustmentAmount
  ) => {
    const finalTotal =
      subtotal - discount_amount - tdsAmount + adjustmentAmount;
    formik.setFieldValue("total", finalTotal.toFixed(2));
  };

  const handleDiscount = (e) => {
    let discountRate = parseFloat(e.target.value) || 0;
    formik.setFieldValue("discount_percent", discountRate);
    let total = parseFloat(formik.values.sub_total) || 0;
    handleBoxAmount(total, discountRate);
  };

  const CalculateTotal = () => {
    let total = 0;
    formik.values.line_items.forEach((item) => {
      if (item.amount !== null && item.amount !== "") {
        total = Number(total) + Number(item.amount);
      }
    });
    formik.setFieldValue("sub_total", total.toFixed(2));

    let discountRate = parseFloat(formik.values.discount_percent) || 0;
    handleBoxAmount(total, discountRate);
  };

  const handleBoxAmount = (total, discountRate) => {
    let discount_amount = (total * discountRate) / 100;
    formik.setFieldValue("discount_amount", discount_amount.toFixed(2));

    // Recalculate TDS if TDS percentage exists
    if (formik.values.tds_option) {
      const selectedTds = TDS_OPTIONS.find(
        (option) => option.label === formik.values.tds_option
      );
      if (selectedTds) {
        const afterDiscountAmount = total - discount_amount;
        const tdsAmount = (afterDiscountAmount * selectedTds.rate) / 100;
        formik.setFieldValue("tax_amount", tdsAmount.toFixed(2));

        const adjustmentAmount = parseFloat(formik.values.adjustment) || 0;

        // Calculate final total
        calculateFinalTotal(
          total,
          discount_amount,
          tdsAmount,
          adjustmentAmount
        );
      }
    } else {
      const tdsAmount = parseFloat(formik.values.tax_amount) || 0;
      const adjustmentAmount = parseFloat(formik.values.adjustment) || 0;

      // Calculate final total
      calculateFinalTotal(total, discount_amount, tdsAmount, adjustmentAmount);
    }
  };

  const handleAdjustAmount = (e) => {
    let adjust_amount = parseFloat(e.target.value) || 0;
    formik.setFieldValue("adjustment", adjust_amount);

    const subtotal = parseFloat(formik.values.sub_total) || 0;
    const discount_amount = parseFloat(formik.values.discount_amount) || 0;
    const tdsAmount = parseFloat(formik.values.tax_amount) || 0;

    // Calculate final total
    calculateFinalTotal(subtotal, discount_amount, tdsAmount, adjust_amount);
  };

  // Filter options based on search term
  const filteredExpenseAccOptions = Array.isArray(expenseAccCategories)
    ? expenseAccCategories
        .map((group) => ({
          category: group?._id || "Uncategorized",
          options: Array.isArray(group?.accounts)
            ? group.accounts.filter((acc) =>
                acc?.account_name
                  ?.toLowerCase()
                  .includes(expenseAccSearchTerm.toLowerCase())
              )
            : [],
        }))
        .filter((group) => group.options.length > 0)
    : [];

  // Custom dropdown handlers for account selection
  const handleExpenseAccClick = (event, index) => {
    setExpenseAccAnchorEl(event.currentTarget);
    setSelectedAccountIndex(index);
  };

  const handleExpenseAccClose = () => {
    setExpenseAccAnchorEl(null);
    setExpenseAccSearchTerm("");
    setSelectedAccountIndex(null);
  };

  const handleExpenseAccSelect = (option) => {
    if (selectedAccountIndex !== null) {
      formik.setFieldValue(`line_items[${selectedAccountIndex}].account`, option.account_name);
      formik.setFieldValue(`line_items[${selectedAccountIndex}].account_id`, option.account_id);
    }
    handleExpenseAccClose();
  };

  const handleExpenseAccSearch = (e) => {
    setExpenseAccSearchTerm(e.target.value);
  };

  return (
    <Box>
      {/*Table transaction Level*/}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/*At Transaction Level*/}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            cursor: "pointer",
            width: "210px",
            ml: 3,
            py: 0.5,
            my: 1.5,
            alignItems: "center",
            borderRight: "1px solid  #ccc",
          }}
          onClick={handleClick}
        >
          <ScatterPlotIcon />
          <Box sx={{ fontSize: "12px" }}>{formik.values.discount_level}</Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Box>

          <Menu
            anchorEl={discountAnchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Typography
              sx={{
                color: "#4C526C",
                fontSize: "13px",
                fontWeight: "600",
                pl: 1.5,
              }}
            >
              Discount Type
            </Typography>
            {options.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleSelect(option)}
                selected={formik.values.discount_level === option}
                sx={{
                  m: 0.5,
                  fontSize: "13px",
                  fontWeight: "400",
                  borderRadius: 1,
                  backgroundColor:
                    formik.values.discount_level === option
                      ? "#408dfb !important"
                      : "transparent",
                  color:
                    formik.values.discount_level === option
                      ? "white"
                      : "inherit",
                  "&:hover": {
                    backgroundColor:
                      formik.values.discount_level === option
                        ? "#408dfb !important"
                        : "#f0f0f0",
                  },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/*Discount Account Selection*/}
        {formik.values.discount_level === "At Line Item Level" && (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              cursor: "pointer",
              width: "210px",
              ml: 3,
              py: 0.5,
              my: 1.5,
              alignItems: "center",
            }}
            onClick={handleDisClick}
          >
            <BusinessCenterIcon />
            <Box sx={{ fontSize: "12px" }}>
              {formik.values.discount_account
                ? formik.values.discount_account.length > 20
                  ? formik.values.discount_account.slice(0, 20) + "..."
                  : formik.values.discount_account
                : "Select Discount Account"}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {disOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Box>

            <Menu
              anchorEl={disAccount}
              open={disOpen}
              onClose={handleCloseDisAccount}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{ height: "350px" }}
            >
              {DiscountAccount.map((option, groupIndex) => (
                <div key={groupIndex}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#4C526C",
                      p: 1,
                      fontWeight: "600",
                    }}
                  >
                    {option.label}
                  </Typography>
                  {option.accounts.map((account) => (
                    <MenuItem
                      key={account}
                      onClick={() => handleDisSelect(account)}
                      selected={formik.values.discount_account === account}
                      sx={{
                        m: 0.5,
                        fontSize: "13px",
                        fontWeight: "400",
                        borderRadius: 1,
                        backgroundColor:
                          formik.values.discount_account === account
                            ? "#408dfb !important"
                            : "transparent",
                        color:
                          formik.values.discount_account === account
                            ? "white"
                            : "inherit",
                        "&:hover": {
                          backgroundColor:
                            formik.values.discount_account === account
                              ? "#408dfb !important"
                              : "#f0f0f0",
                        },
                      }}
                    >
                      {account}
                    </MenuItem>
                  ))}
                </div>
              ))}
            </Menu>
          </Box>
        )}
      </Box>

      {/*Table Box Content*/}
      <Paper elevation={0}>
        <TableContainer sx={{ ml: 3, borderRadius: 2 }}>
          <Table sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: "12px !important",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    borderRight: "none",
                    fontWeight: "550 !important",
                    padding: "5px !important",
                    pl: "25px !important",
                  }}
                  colSpan={4}
                >
                  Item Table
                </TableCell>
                <TableCell
                  sx={{ textAlign: "right", color: "black !important" }}
                >
                  BulkActions
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    width: "30% !important",
                    color: "black !important",
                    bgcolor: "white !important",
                  }}
                >
                  ITEM DETAILS
                </TableCell>
                <TableCell
                  sx={{
                    width: "25% !important",
                    color: "black !important",
                    bgcolor: "white !important",
                  }}
                >
                  ACCOUNT
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    color: "black !important",
                    bgcolor: "white !important",
                  }}
                >
                  QUANTITY
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    color: "black !important",
                    bgcolor: "white !important",
                  }}
                >
                  RATE
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    color: "black !important",
                    bgcolor: "white !important",
                  }}
                >
                  AMOUNT
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {formik.values.line_items.map((item, index) => (
                <TableRow key={index} sx={{ borderBottom: "none" }}>
                  {/*Item Detail*/}
                  <TableCell>
                    <StyledTextField
                      readOnly
                      name={`line_items[${index}].name`}
                      placeholder="Select Item"
                      error={
                        formik.touched.line_items?.[index]?.name &&
                        Boolean(formik.errors.line_items?.[index]?.name)
                      }
                      value={item.name || ""}
                      onClick={(event) => {
                        handleItemClick(event, index);
                      }}
                      sx={{ cursor: "pointer", width: 300 }}
                    />
                    {formik.touched.line_items?.[index]?.name &&
                      formik.errors.line_items?.[index]?.name && (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: COLORS.error,
                            pl: 1,
                          }}
                        >
                          {formik.errors.line_items[index].name}
                        </Typography>
                      )}
                  </TableCell>

                  {/* Account */}
                  <TableCell
                    align="center"
                    sx={{ py: 1.5, borderRight: "1px solid #E0E0E0" }}
                  >
                    <Box sx={{ position: "relative", width: "200px" }}>
                      <Box
                        onClick={(event) => handleExpenseAccClick(event, index)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "35px",
                          width: "200px",
                          justifyContent: "space-between",
                          border:
                            formik.touched.line_items?.[index]?.account &&
                            Boolean(formik.errors.line_items?.[index]?.account)
                              ? "1px solid #d32f2f"
                              : "1px solid #c4c4c4",
                          borderRadius: "7px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          backgroundColor: "white",
                          color: "gray",
                          "&:hover": {
                            borderColor: "#408dfb",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: formik.values.line_items?.[index]?.account
                              ? "gray"
                              : "#aaa",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "150px",
                          }}
                        >
                          {formik.values.line_items?.[index]?.account ||
                            "Select expense account"}
                        </Typography>
                        <KeyboardArrowDownIcon
                          sx={{ fontSize: "22px", marginRight: "-10px" }}
                        />
                      </Box>
                    </Box>
                    {formik.touched.line_items?.[index]?.account &&
                      formik.errors.line_items?.[index]?.account && (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: COLORS.error,
                            pl: 1,
                            textAlign: "left",
                          }}
                        >
                          {formik.errors.line_items[index].account}
                        </Typography>
                      )}
                  </TableCell>

                  {/*Quantity*/}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexDirection: "column",
                        alignItems: "end",
                      }}
                    >
                      <StyledTextField
                        name={`line_items[${index}].quantity`}
                        type="number"
                        value={formik.values.line_items[index].quantity || ""}
                        onChange={(e) => {
                          handleLineQuantity(e, index);
                        }}
                        error={
                          formik.touched.line_items?.[index]?.quantity &&
                          Boolean(formik.errors.line_items?.[index]?.quantity)
                        }
                        onBlur={formik.handleBlur}
                        sx={{
                          width: "120px",
                          textAlign: "right",
                          "& input": {
                            textAlign: "right",
                            "&::placeholder": {
                              color: "#978195",
                              fontWeight: "normal",
                            },
                          },
                        }}
                      />

                      {formik.touched.line_items?.[index]?.quantity &&
                        formik.errors.line_items?.[index]?.quantity && (
                          <Typography
                            sx={{
                              textAlign: "left",
                              pl: 2,
                              fontSize: "0.75rem",
                              color: COLORS.error,
                            }}
                          >
                            {formik.errors.line_items[index].quantity}
                          </Typography>
                        )}
                    </Box>
                  </TableCell>

                  {/*Rate*/}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexDirection: "column",
                        alignItems: "end",
                      }}
                    >
                      <StyledTextField
                        name={`line_items[${index}].rate`}
                        type="number"
                        value={formik.values.line_items[index].rate || ""}
                        onChange={(e) => {
                          handleLineRate(e, index);
                        }}
                        error={
                          formik.touched.line_items?.[index]?.rate &&
                          Boolean(formik.errors.line_items?.[index]?.rate)
                        }
                        onBlur={formik.handleBlur}
                        sx={{
                          width: "150px",
                          textAlign: "right",
                          "& input": {
                            textAlign: "right",
                            "&::placeholder": {
                              color: "#978195",
                              fontWeight: "normal",
                            },
                          },
                        }}
                      />
                      {formik.touched.line_items?.[index]?.rate &&
                        formik.errors.line_items?.[index]?.rate && (
                          <Typography
                            sx={{
                              textAlign: "left",
                              pl: 2,
                              fontSize: "0.75rem",
                              color: COLORS.error,
                            }}
                          >
                            {formik.errors.line_items[index].rate}
                          </Typography>
                        )}
                    </Box>
                  </TableCell>

                  {/*Amount*/}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexDirection: "column",
                        alignItems: "end",
                      }}
                    >
                      <StyledTextField
                        name={`line_items[${index}].amount`}
                        type="number"
                        value={formik.values.line_items[index].amount || ""}
                        readOnly
                        error={
                          formik.touched.line_items?.[index]?.amount &&
                          Boolean(formik.errors.line_items?.[index]?.amount)
                        }
                        onBlur={formik.handleBlur}
                        sx={{
                          width: "120px",
                          textAlign: "right",
                          backgroundColor: "#f5f5f5",
                          "& input": {
                            textAlign: "right",
                            "&::placeholder": {
                              color: "#978195",
                              fontWeight: "normal",
                            },
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  
                  {/* Action Column */}
                  <TableCell
                    sx={{
                      fontSize: "12px !important",
                      color: "#6c78a3 !important",
                      borderBottom: "1px solid #ddd",
                      borderRight: "none",
                      textAlign: "center",
                      padding: "8px 0px 40px 20px !important",
                      width: "70px",
                    }}
                  >
                    {formik.values.line_items.length > 1 && (
                      <Box sx={{ cursor: "pointer" }}>
                        <CloseIcon
                          sx={{ color: "#d91439" }}
                          onClick={() => handleRemoveLineItem(index)}
                        />
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/*Item Dropdown*/}
        <Popper
          open={itemOpen}
          anchorEl={itemAnchorEl}
          placement="bottom-start"
          sx={{
            zIndex: 1300,
            overflowY: "auto",
            maxHeight: 250,
            width: "300px",
            bgcolor: "white",
            boxShadow: 3,
          }}
        >
          <ClickAwayListener onClickAway={() => handleItemClick()}>
            <Paper>
              <Box>
                {itemList && itemList.length > 0 ? (
                  itemList.map((list, index) => (
                    <Box
                      key={list.id || list._id || index}
                      sx={{ 
                        p: 1, 
                        pl: 2, 
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                      onClick={() => handleItemSelect(list)}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "400",
                          color: "#4C526C",
                        }}
                      >
                        {list.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#4C526C",
                        }}
                      >
                        Purchase Rate: ₹{parseFloat(list.rate || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography sx={{ fontSize: "14px", color: "#666" }}>
                      No items found
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* Expense Account Dropdown */}
        <Popper
          open={expenseAccOpen}
          anchorEl={expenseAccAnchorEl}
          placement="bottom-start"
          style={{ width: "350px", zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={handleExpenseAccClose}>
            <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
              <Box>
                <TextField
                  placeholder="Search account..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={(e) => e.stopPropagation()}
                  value={expenseAccSearchTerm}
                  onChange={handleExpenseAccSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{
                            fontSize: "16px",
                            color: "#757575",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    m: 1,
                    "& .MuiOutlinedInput-root": {
                      minHeight: "30px",
                      "& input": {
                        padding: "4px 8px",
                        fontSize: "13px",
                      },
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#408dfb",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#408dfb",
                      },
                    },
                  }}
                />

                {filteredExpenseAccOptions?.length === 0 ? (
                  <Box sx={{ p: 1 }}>No options found</Box>
                ) : (
                  filteredExpenseAccOptions.map((group, groupIndex) => (
                    <Box key={groupIndex} sx={{ mb: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: "600",
                          p: 1,
                          backgroundColor: COLORS.bgLight,
                        }}
                      >
                        {group.category}
                      </Typography>

                      {group.options.map((option, index) => (
                        <MenuItem
                          key={`${option.account_id}`}
                          onClick={() => handleExpenseAccSelect(option)}
                          sx={{
                            fontSize: "13px",
                            color: "#66686b",
                            "&:hover": {
                              borderRadius: "5px",
                              backgroundColor: COLORS.hoverBg,
                              color: "#333",
                            },
                            maxWidth: "380px",
                            overflow: "hidden",
                          }}
                        >
                          {option.account_name}
                        </MenuItem>
                      ))}
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Paper>

      <Box sx={{ display: "flex", gap: 60, my: 3 }}>
        {/*Add New Row Button*/}
        <Box>
          <Box
            onClick={handleAddRow}
            sx={{
              bgcolor: "#f1f1fa",
              fontSize: "13px",
              fontWeight: "400",
              color: "BLACK",
              borderRadius: "5px",
              padding: "5px 10px",
              display: "flex",
              gap: 1,
              alignItems: "center",
              cursor: "pointer",
              width: "150px",
              textAlign: "center",
              mx: 2,
              p: 1,
              ml: 3,
              "&:hover": {
                backgroundColor: "#e0e0fa",
              },
            }}
          >
            <AddCircleOutlineIcon sx={{ color: "#408dfb", fontSize: "20px" }} />
            <Box>Add New Row</Box>
          </Box>
        </Box>

        {/*Total Calculation Box*/}
        <Box
          sx={{ bgcolor: "#f9f9fb", width: "500px", ml: 3, borderRadius: 3 }}
        >
          {/*Sub Total*/}
          <Box
            sx={{
              display: "flex",
              py: 2,
              pl: 3,
              pr: 4,
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              Sub Total
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: "600" }}>
              ₹{formik.values.sub_total || "0.00"}
            </Typography>
          </Box>

          {/*Discount, TDS, Adjustment*/}
          <Box sx={{ pl: 3, pr: 4 }}>
            {/*Discount*/}
            <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
              <Typography
                sx={{ fontSize: "13px", fontWeight: "400", width: "35%" }}
              >
                Discount
              </Typography>
              <Box sx={{ width: "35%" }}>
                <TextField
                  name="discount_percent"
                  type="number"
                  value={formik.values.discount_percent || ""}
                  onChange={(e) => {
                    handleDiscount(e);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.discount_percent &&
                    Boolean(formik.errors.discount_percent)
                  }
                  sx={{
                    height: "35px",
                    width: "140px",
                    "& .MuiInputBase-root": {
                      height: "35px",
                      borderRadius: "7px",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                      border: `1px solid ${
                        formik.touched.discount_percent &&
                        formik.errors.discount_percent
                          ? "#f44336"
                          : "#D0D5DD"
                      }`,
                      paddingRight: "4px",
                      paddingLeft: "4px",
                      "&:hover": {
                        borderColor: "#61A0FF",
                        boxShadow: "0 0 0 0.7px rgba(97, 160, 255, 0.3)",
                      },
                      "&.Mui-focused": {
                        borderColor: "#61A0FF",
                        boxShadow: "0 0 0 0.2rem rgba(97, 160, 255, 0.3)",
                      },
                    },
                    "& input": {
                      padding: "6px 12px",
                      textAlign: "right",
                      "&::placeholder": {
                        color: "#978195",
                        opacity: 1,
                        fontWeight: "normal",
                      },
                      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                        {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                      "-moz-appearance": "textfield",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          sx={{
                            bgcolor: "#f5f5f5",
                            px: 1,
                            height: "100%",
                            borderRadius: "4px",
                            fontSize: "14px",
                            color: "#333",
                          }}
                        >
                          %
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "end",
                  width: "30%",
                }}
              >
                <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
                  ₹{formik.values.discount_amount || "0.00"}
                </Typography>
              </Box>
            </Box>

            {/*Discount Account*/}
            {formik.values.discount_percent > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "400",
                    width: "35%",
                    color: "#D6141D",
                  }}
                >
                  Discount Account*
                </Typography>
                <Box sx={{ width: "35%" }}>
                  <StyledTextField
                    name={"discount_account"}
                    placeholder="Select an account"
                    error={
                      formik.touched.discount_account &&
                      Boolean(formik.errors.discount_account)
                    }
                    value={formik.values.discount_account || ""}
                    onClick={(e) => setTotalBoxDisAcc(e.currentTarget)}
                    readOnly
                    sx={{ cursor: "pointer", width: "140px" }}
                  />
                  {formik.touched.discount_account &&
                    formik.errors.discount_account && (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: COLORS.error,
                          pl: 1,
                        }}
                      >
                        {formik.errors.discount_account}
                      </Typography>
                    )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "end",
                    width: "30%",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: "400" }}
                  ></Typography>
                </Box>
              </Box>
            )}

            {/*TDS*/}
            <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
              <Typography
                sx={{ fontSize: "13px", fontWeight: "400", width: "35%" }}
              >
                TDS
              </Typography>
              <Box sx={{ width: "35%" }}>
                <StyledTextField
                  readOnly
                  name={"tds_option"}
                  placeholder="Select TDS"
                  error={
                    formik.touched.tds_option &&
                    Boolean(formik.errors.tds_option)
                  }
                  value={formik.values.tds_option || ""}
                  onClick={handleTdsClick}
                  sx={{ cursor: "pointer", width: "140px" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "end",
                  width: "30%",
                }}
              >
                <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
                  {formik.values.tax_amount
                    ? `(-₹${formik.values.tax_amount})`
                    : "₹0.00"}
                </Typography>
              </Box>
            </Box>

            {/*Adjustment*/}
            <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
              <Box sx={{ width: "35%" }}>
                <StyledTextField
                  name={"adjustment_description"}
                  value={formik.values.adjustment_description || ""}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.adjustment_description &&
                    Boolean(formik.errors.adjustment_description)
                  }
                  onBlur={formik.handleBlur}
                  sx={{
                    width: "120px",
                    border: "1px dotted #978195",
                    textAlign: "center",
                    "& input": {
                      textAlign: "center",
                      "&::placeholder": {
                        color: "#978195",
                        fontWeight: "normal",
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ width: "35%" }}>
                <StyledTextField
                  name={"adjustment"}
                  type="number"
                  value={formik.values.adjustment || ""}
                  onChange={(e) => {
                    handleAdjustAmount(e);
                  }}
                  error={
                    formik.touched.adjustment &&
                    Boolean(formik.errors.adjustment)
                  }
                  onBlur={formik.handleBlur}
                  sx={{
                    width: "140px",
                    textAlign: "right",
                    "& input": {
                      textAlign: "right",
                      "&::placeholder": {
                        color: "#978195",
                        fontWeight: "normal",
                      },
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  width: "30%",
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "400",
                }}
              >
                {formik.values.adjustment
                  ? formik.values.adjustment >= 0
                    ? `₹${formik.values.adjustment}`
                    : `₹${formik.values.adjustment}`
                  : "₹0.00"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ ml: 3, mr: 4, my: 2.5 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pl: 3,
              pr: 4,
              pb: 2.5,
            }}
          >
            <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
              Total
            </Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
              ₹{formik.values.total || "0.00"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* TDS DROPDOWN MENU */}
      <Menu
        anchorEl={tdsAnchorEl}
        open={tdsOpen}
        onClose={handleTdsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ maxHeight: "300px", width: "250px" }}
      >
        <Typography
          sx={{
            color: "#4C526C",
            fontSize: "13px",
            fontWeight: "600",
            pl: 1.5,
            py: 1,
          }}
        >
          Select TDS Type
        </Typography>
        {TDS_OPTIONS.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleTdsSelect(option)}
            selected={formik.values.tds_option === option.label}
            sx={{
              m: 0.5,
              fontSize: "13px",
              fontWeight: "400",
              borderRadius: 1,
              backgroundColor:
                formik.values.tds_option === option.label
                  ? "#408dfb !important"
                  : "transparent",
              color:
                formik.values.tds_option === option.label ? "white" : "inherit",
              "&:hover": {
                backgroundColor:
                  formik.values.tds_option === option.label
                    ? "#408dfb !important"
                    : "#f0f0f0",
              },
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "13px" }}>{option.label}</Typography>
              <Typography
                sx={{ fontSize: "12px", fontWeight: "400", opacity: 0.7 }}
              >
                [{option.rate}%]
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Discount Account Dropdown for Total Box */}
      <Popper
        open={totalDisAcc}
        anchorEl={totalBoxDisAcc}
        placement="bottom-start"
        style={{ width: "260px", zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setTotalBoxDisAcc(null)}>
          <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
            <Box>
              {DiscountAccount.map((group, groupIndex) => (
                <Box key={groupIndex} sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "600",
                      p: 1,
                      backgroundColor: COLORS.bgLight,
                    }}
                  >
                    {group.label}
                  </Typography>

                  {group.accounts.map((option, index) => (
                    <Box
                      key={`${groupIndex}-${index}`}
                      sx={{
                        p: 1,
                        pl: 2,
                        fontSize: "13px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: COLORS.hoverBg,
                        },
                      }}
                      onClick={() => {
                        formik.setFieldValue("discount_account", option);
                        setTotalBoxDisAcc(null);
                      }}
                    >
                      {option}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default TableAndTotal;