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
//   Button,
//   Modal,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
// import apiService from "../../services/axiosService";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import CloseIcon from "@mui/icons-material/Close";
// import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutline";
// import NewItemForm from "../common/Addbulkitems/AddItemsInBulkDialog";
// import { usePathname } from "next/navigation";

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

// const tdsOptions = [
//   {
//     id: "commission_brokerage",
//     name: "Commission or Brokerage",
//     rate: 2,
//     section: "Section 194 H",
//   },
//   {
//     id: "commission_brokerage_reduced",
//     name: "Commission or Brokerage (Reduced)",
//     rate: 3.75,
//     section: "Section 194 H",
//   },
//   { id: "dividend", name: "Dividend", rate: 10, section: "Section 194" },
//   {
//     id: "dividend_reduced",
//     name: "Dividend (Reduced)",
//     rate: 7.5,
//     section: "Section 194",
//   },
//   {
//     id: "interest",
//     name: "Other Interest than securities",
//     rate: 10,
//     section: "Section 194 A",
//   },
//   {
//     id: "interest_reduced",
//     name: "Other Interest than securities (Reduced)",
//     rate: 7.5,
//     section: "Section 194 A",
//   },
//   {
//     id: "contractor_others",
//     name: "Payment of contractors for Others",
//     rate: 2,
//     section: "Section 194 C",
//   },
//   {
//     id: "contractor_others_reduced",
//     name: "Payment of contractors for Others (Reduced)",
//     rate: 1.5,
//     section: "Section 194 C",
//   },
//   {
//     id: "contractor_individual",
//     name: "Payment of contractors HUF/Indiv",
//     rate: 1,
//     section: "Section 194 C",
//   },
//   {
//     id: "contractor_individual_reduced",
//     name: "Payment of contractors HUF/Indiv (Reduced)",
//     rate: 0.75,
//     section: "Section 194 C",
//   },
//   {
//     id: "professional",
//     name: "Professional Fees",
//     rate: 10,
//     section: "Section 194 J",
//   },
//   {
//     id: "professional_reduced",
//     name: "Professional Fees (Reduced)",
//     rate: 7.5,
//     section: "Section 194 J",
//   },
//   {
//     id: "rent",
//     name: "Rent on land or furniture etc",
//     rate: 10,
//     section: "Section 194 I",
//   },
//   {
//     id: "rent_reduced",
//     name: "Rent on land or furniture etc (Reduced)",
//     rate: 7.5,
//     section: "Section 194 I",
//   },
//   {
//     id: "technical",
//     name: "Technical Fees",
//     rate: 2,
//     section: "Section 194 C",
//   },
// ];

// const tcsOptions = [
//   { id: "sample", name: "sample", rate: 20, nature: "206C(6CA)" },
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
//     borderColor: "transparent",
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
//   const [discountAnchorEl, setDiscountAnchorEl] = useState(null);
//   const [disAccount, setDisAccount] = useState(null);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [itemAnchorEl, setItemAnchorEl] = useState(null);
//   const [itemList, setItemList] = useState([]);
//   const [listExpenseAnchorEl, setListExpenseAnchorEl] = useState(null);
//   const [tdsAnchorEl, setTdsAnchorEl] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [openItemDialog, setOpenItemDialog] = useState(false);
//   const pathname = usePathname();

//   const discountOpen = Boolean(discountAnchorEl);
//   const disOpen = Boolean(disAccount);
//   const itemOpen = Boolean(itemAnchorEl);
//   const listExpenseOpen = Boolean(listExpenseAnchorEl);
//   const tdsOpen = Boolean(tdsAnchorEl);

//   const getPathEntity = () => {
//     const pathSegments = pathname.split("/");
//     return pathSegments[2];
//   };

//   // Get selected items from line items
//   const getSelectedItems = () => {
//     return formik.values.line_items
//       .filter((item) => item.item_id && item.name) // Only include items with valid IDs and names
//       .map((item) => ({
//         id: item.item_id,
//         name: item.name,
//         rate: parseFloat(item.rate) || 0,
//         quantity: parseFloat(item.quantity) || 1,
//         description: item.description || "",
//         unit: item.unit || "",
//         selected: true, // Mark as selected
//       }));
//   };

//   const handleClose = () => {
//     fetchItemList();
//     setOpenItemDialog(false);
//   };

//   const handleBulkItemsSelect = (items) => {
//     // Get existing line items that were added through "Add New Row"
//     const existingManualItems = formik.values.line_items.filter(
//       (item) => !item.item_id || !item.name
//     );

//     // Convert selected items to line items format
//     const newLineItems = items.map((item) => ({
//       item_id: item.id,
//       name: item.name,
//       description: item.description || "",
//       quantity: item.quantity || 1,
//       rate: parseFloat(item.rate) || 0,
//       tax_percentage: 0,
//       unit: item.unit || "",
//       amount: (parseFloat(item.quantity) || 1) * (parseFloat(item.rate) || 0),
//     }));

//     // Combine existing manual items with new bulk items
//     formik.setFieldValue("line_items", [
//       ...existingManualItems,
//       ...newLineItems,
//     ]);
//     calculateTotals();
//   };

//   const fetchItemList = async () => {
//     if (itemList.length > 0) return;
//     try {
//       const organization_id = localStorage.getItem("organization_id");
//       if (!organization_id) {
//         console.error("Organization ID not found in local storage");
//         return;
//       }
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/item/item/details?organization_id=${organization_id}`,
//       });
//       const fetchedItems = response.data?.message || [];
//       const itemsWithIds = fetchedItems.map((item) => ({
//         ...item,
//         id:
//           item._id ||
//           `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       }));
//       setItemList(itemsWithIds);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchItemList();
//   }, []);

//   useEffect(() => {
//     CalculateTotal();
//   }, [formik.values.line_items]);

//   const handleExpenseAccClose = () => {
//     setListExpenseAnchorEl(null);
//   };

//   const handleExpenseAccSelect = (option) => {
//     formik.setFieldValue(`line_items[${selectedIndex}].account`, option);
//     handleExpenseAccClose();
//   };

//   const handleExpenseAccClick = (event, index) => {
//     setListExpenseAnchorEl(event.currentTarget);
//     setSelectedIndex(index);
//   };

// //   const handleItemSelect = (list) => {
// //     formik.setFieldValue(`line_items[${selectedIndex}].name`, list.name);
// //     formik.setFieldValue(`line_items[${selectedIndex}].item_id`, list.id);
// //     formik.setFieldValue(`line_items[${selectedIndex}].description`, list.description);

//     const rate = list.rate.toFixed(2);
//     formik.setFieldValue(`line_items[${selectedIndex}].rate`, rate);
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

// //   const formatItemValue = (item) => {
// //     console.log(item,"itemitemitem")
// //     const name = item.name || "";
// //     const description = item.description || "";
// //     return `${name} - ${description}`;
// //   };

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
//     // Add new row while preserving existing items
//     formik.setFieldValue("line_items", [...formik.values.line_items, newRow]);
//   };

//   const handleRemoveLineItem = (indexToRemove) => {
//     const updatedItems = formik.values.line_items.filter(
//       (_, index) => index !== indexToRemove
//     );
//     formik.setFieldValue("line_items", updatedItems);
//     calculateTotals(); // Recalculate totals after removal
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
//     if (discountOpen) {
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

//   const handleDisSelect = (value) => {
//     formik.setFieldValue("discount_account", value);
//     handleClose();
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
//     formik.setFieldValue("tds_option", option.id); // Changed from option.label to option.id

//     const afterDiscountAmount =
//       formik.values.sub_total - formik.values.discount_amount;
//     const taxAmount = (afterDiscountAmount * option.rate) / 100;
//     formik.setFieldValue("tax_amount", taxAmount.toFixed(2));

//     let subtotal = parseFloat(formik.values.sub_total);
//     const discount_amount = parseFloat(formik.values.discount_amount);
//     const adjustmentAmount = parseFloat(formik.values.adjustment);

//     calculateFinalTotal(subtotal, discount_amount, taxAmount, adjustmentAmount);
//     handleTdsClose();
//   };

// //     // useEffect(() => {
// //     //   calculateFinalTotal(formik.values.sub_total,formik.values.discount_amount,formik.values.tax_amount,formik.values.adjustment);
// //     // }, [
// //     //   formik.values.line_items,
// //     // ]);

//   const calculateFinalTotal = (
//     subtotal,
//     discount_amount,
//     taxAmount,
//     adjustmentAmount
//   ) => {
//     const afterDiscount = subtotal - discount_amount;

//     let finalTotal;
//     if (formik.values.tax_type === "TDS") {
//       // TDS: Subtract tax from total
//       finalTotal = afterDiscount - taxAmount + (adjustmentAmount || 0);
//     } else if (formik.values.tax_type === "TCS") {
//       // TCS: Add tax to total
//       finalTotal = afterDiscount + taxAmount + (adjustmentAmount || 0);
//     } else {
//       finalTotal = afterDiscount + (adjustmentAmount || 0);
//     }

//     formik.setFieldValue("total_amount", finalTotal.toFixed(2));
//     formik.setFieldValue("total", finalTotal.toFixed(2));
//   };

//   const handleDiscount = (e) => {
//     let discountRate = parseFloat(e.target.value) || 0;
//     formik.setFieldValue("discount_percent", discountRate);
//     let total = parseFloat(formik.values.sub_total) || 0;
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

//     let discountRate = parseFloat(formik.values.discount_percent) || 0;
//     handleBoxAmount(total, discountRate);
//   };

//   const handleBoxAmount = (total, discountRate) => {
//     let discount_amount = (total * discountRate) / 100;
//     formik.setFieldValue("discount_amount", discount_amount.toFixed(2));

// //     // Recalculate TDS if TDS percentage exists
// //     if (formik.values.tds_option) {
// //       let selectOptions = formik.values.tax_type === "TDS" ? tdsOptions : tcsOptions;
// //       const selectedTds = selectOptions.find(
// //         (option) => option.id === formik.values.tds_option
// //       );
// //       if (selectedTds) {
// //         const afterDiscountAmount = total - discount_amount;
// //         const tdsAmount = (afterDiscountAmount * selectedTds.rate) / 100;
// //         formik.setFieldValue("tax_amount", tdsAmount.toFixed(2));

//         const adjustmentAmount = parseFloat(formik.values.adjustment) || 0;

//         // Calculate final total
//         calculateFinalTotal(
//           total,
//           discount_amount,
//           tdsAmount,
//           adjustmentAmount
//         );
//       }
//     } else {
//       const tdsAmount = parseFloat(formik.values.tax_amount) || 0;
//       const adjustmentAmount = parseFloat(formik.values.adjustment) || 0;

//       // Calculate final total
//       calculateFinalTotal(total, discount_amount, tdsAmount, adjustmentAmount);
//     }
//   };

//   const handleAdjustAmount = (e) => {
//     let adjust_amount = parseFloat(e.target.value) || 0;
//     formik.setFieldValue("adjustment", adjust_amount);

//     const subtotal = parseFloat(formik.values.sub_total) || 0;
//     const discount_amount = parseFloat(formik.values.discount_amount) || 0;
//     const tdsAmount = parseFloat(formik.values.tax_amount) || 0;

//     // Calculate final total
//     calculateFinalTotal(subtotal, discount_amount, tdsAmount, adjust_amount);
//   };

//   const handleTaxMethodChange = (event) => {
//     const method = event.target.value;
//     formik.setFieldValue("tax_type", method);
//     formik.setFieldValue("tax_percentage", "");
//     formik.setFieldValue("tds_option", "");
//     formik.setFieldValue("tax_amount", 0);
//     calculateFinalTotal(
//       formik.values.sub_total,
//       formik.values.discount_amount,
//       0,
//       formik.values.adjustment
//     );
//   };

//   return (
//     <Box>
//       {/*Table transaction Level*/}

//       <Box sx={{ display: "flex", alignItems: "center" }}>
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
//                     fontSize: "13px !important",
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
//                 {/* <TableCell
//                   sx={{ textAlign: "right", color: "black !important" }}
//                 >
//                   BulkActions
//                 </TableCell> */}
//               </TableRow>
//               <TableCell
//                 size="small"
//                 sx={{
//                   width: "40% !important",
//                   color: "black !important",
//                   padding: "6px",
//                   pl: 3,
//                   bgcolor: "white !important",
//                   borderRight: "1px solid #ebeaf2 !important",
//                 }}
//               >
//                 ITEM DETAILS
//               </TableCell>
//               <TableCell
//                 sx={{
//                   textAlign: "right",
//                   color: "black !important",
//                   padding: "6px",
//                   bgcolor: "white !important",
//                   borderRight: "1px solid #ebeaf2 !important",
//                 }}
//               >
//                 QUANTITY
//               </TableCell>
//               <TableCell
//                 sx={{
//                   textAlign: "right",
//                   color: "black !important",
//                   padding: "6px",
//                   bgcolor: "white !important",
//                   borderRight: "1px solid #ebeaf2 !important",
//                 }}
//               >
//                 RATE
//               </TableCell>
//               <TableCell
//                 sx={{
//                   textAlign: "right",
//                   color: "black !important",
//                   padding: "6px",
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
//                   <TableCell
//                     sx={{
//                       borderRight: "1px solid #ebeaf2 !important",
//                       padding: 1,
//                       pl: 1.5,
//                     }}
//                   >
//                     <StyledTextField
//                       readOnly
//                       name={`line_items[${index}].name`}
//                       placeholder="Select Item"
//                       error={
//                         formik.touched.line_items?.[index]?.name &&
//                         Boolean(formik.errors.line_items?.[index]?.name)
//                       }
//                       value={item.name} // Dynamically format the value
//                       onClick={(event) => {
//                         handleItemClick(event, index);
//                       }}
//                       sx={{
//                         cursor: "pointer",
//                         border: "none !important",
//                         whiteSpace: "pre-wrap", // Enable line breaks
//                         wordBreak: "break-word", // Ensure long words wrap properly
//                       }}
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

// //                   {/*Quantiy*/}
// //                   <TableCell
// //                     sx={{
// //                       borderRight: "1px solid #ebeaf2 !important",
// //                       padding: 0,
// //                     }}
// //                   >
// //                     <Box
// //                       sx={{
// //                         display: "flex",
// //                         justifyContent: "flex-end",
// //                         flexDirection: "column",
// //                         alignItems: "end",
// //                       }}
// //                     >
// //                       <StyledTextField
// //                         name={`line_items[${index}].quantity`}
// //                         type="number"
// //                         value={formik.values.line_items[index].quantity}
// //                         onChange={(e) => {
// //                           handleLineQuantity(e, index);
// //                         }}
// //                         error={
// //                           formik.touched.line_items?.[index]?.quantity &&
// //                           Boolean(formik.errors.line_items?.[index]?.quantity)
// //                         }
// //                         onBlur={formik.handleBlur}
// //                         sx={{
// //                           width: "120px",
// //                           border:"none !important",
// //                           textAlign: "right",
// //                           "& input": {
// //                             "&::placeholder": {
// //                               color: "#978195",
// //                               fontWeight: "normal",
// //                             },
// //                           },
// //                         }}
// //                       />

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

// //                   {/*Rate*/}
// //                   <TableCell
// //                     sx={{
// //                       borderRight: "1px solid #ebeaf2 !important",
// //                       padding: 0,
// //                     }}
// //                   >
// //                     <Box
// //                       sx={{
// //                         display: "flex",
// //                         justifyContent: "flex-end",
// //                         flexDirection: "column",
// //                         alignItems: "end",
// //                       }}
// //                     >
// //                       <StyledTextField
// //                         name={`line_items[${index}].rate`}
// //                         type="number"
// //                         value={formik.values.line_items[index].rate}
// //                         onChange={(e) => {
// //                           handleLineRate(e, index);
// //                         }}
// //                         error={
// //                           formik.touched.line_items?.[index]?.rate &&
// //                           Boolean(formik.errors.line_items?.[index]?.rate)
// //                         }
// //                         onBlur={formik.handleBlur}
// //                         sx={{
// //                           width: "150px",
// //                           textAlign: "right",
// //                           border:"none !important",
// //                           "& input": {
// //                             "&::placeholder": {
// //                               color: "#978195",
// //                               fontWeight: "normal",
// //                             },
// //                           },
// //                         }}
// //                       />
// //                       {formik.touched.line_items?.[index]?.rate &&
// //                         formik.errors.line_items?.[index]?.rate && (
// //                           <Typography
// //                             sx={{
// //                               textAlign: "left",
// //                               pl: 2,
// //                               fontSize: "0.75rem",
// //                               color: COLORS.error,
// //                             }}
// //                           >
// //                             {formik.errors.line_items[index].rate}
// //                           </Typography>
// //                         )}
// //                     </Box>
// //                   </TableCell>

//                   {/*Amount*/}
//                   <TableCell
//                     sx={{
//                       padding: 0,
//                     }}
//                   >
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
//                           border: "none !important",
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
//                       borderBottom: "0px solid #ddd",
//                       borderRight: "none",
//                       textAlign: "center",
//                       padding: 0,
//                     }}
//                   >
//                     {formik.values.line_items.length > 1 && (
//                       <Box sx={{ cursor: "pointer" }}>
//                         <CloseIcon
//                           sx={{ color: "#d91439", width: "20px" }}
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

// //         {/*Item Dropdown*/}
// //         <Popper
// //           open={itemOpen}
// //           anchorEl={itemAnchorEl}
// //           placement="bottom-start"
// //           sx={{
// //             zIndex: 1,
// //             overflowY: "auto",
// //             height: 250,
// //             width: "300px",
// //             bgcolor: "white",
// //             boxShadow: 3,
// //           }}
// //         >
// //           <ClickAwayListener onClickAway={handleItemClick}>
// //             <Paper>
// //               <Box>
// //                 {itemList.map((list, index) => (
// //                   <Box
// //                     key={index}
// //                     sx={{ p: 1, pl: 2, cursor: "pointer" }}
// //                     onClick={() => handleItemSelect(list)}
// //                   >
// //                     <Typography
// //                       sx={{
// //                         fontSize: "14px",
// //                         fontWeight: "400",
// //                         color: "#4C526C",
// //                       }}
// //                     >
// //                       {list.name}
// //                     </Typography>
// //                     <Typography
// //                       sx={{
// //                         fontSize: "12px",
// //                         fontWeight: "400",
// //                         color: "#4C526C",
// //                       }}
// //                     >
// //                       Rate:₹{list.rate.toFixed(2)}
// //                     </Typography>
// //                   </Box>
// //                 ))}
// //               </Box>
// //             </Paper>
// //           </ClickAwayListener>
// //         </Popper>
// //       </Paper>

// //       <Box sx={{ display: "flex", my: 3, justifyContent: "space-between" }}>
// //         {/*Add New Row Button and Add Items in Bulk Button*/}
// //         <Box sx={{ display: "flex", gap: 1.5, ml: 3 }}>
// //           <Button
// //             onClick={handleAddRow}
// //             startIcon={
// //               <AddCircleOutlineIcon
// //                 sx={{ color: "#408dfb", fontSize: "14px" }}
// //               />
// //             }
// //             sx={{
// //               bgcolor: "#f1f1fa",
// //               fontSize: "13px",
// //               fontWeight: "400",
// //               color: "black",
// //               borderRadius: "5px",
// //               padding: "4px 10px",
// //               textTransform: "none",
// //               width: { xs: "100%", sm: "auto" },
// //               "&:hover": {
// //                 bgcolor: "#e9e9f3",
// //               },
// //               whiteSpace: "nowrap",
// //               flexShrink: 0,
// //               height: "34px",
// //               minWidth: "auto",
// //             }}
// //           >
// //             Add New Row
// //           </Button>

//           <Button
//             variant="text"
//             startIcon={
//               <AddCircleOutlinedIcon
//                 sx={{ color: "#3b82f6", fontSize: "14px" }}
//               />
//             }
//             sx={{
//               color: "black",
//               textTransform: "none",
//               fontWeight: 400,
//               fontSize: "13px",
//               bgcolor: "#f1f1fa",
//               borderRadius: "5px",
//               padding: "4px 10px",
//               height: "34px",
//               "&:hover": {
//                 bgcolor: "#e9e9f3",
//               },
//               flexShrink: 0,
//               whiteSpace: "nowrap",
//             }}
//             onClick={() => setOpen(true)}
//           >
//             Add Items in Bulk
//           </Button>

//           {open && (
//             <NewItemForm
//               open={open}
//               onClose={() => setOpen(false)}
//               itemList={itemList}
//               formik={formik}
//               initialSelectedItems={getSelectedItems()}
//               onItemsSelect={handleBulkItemsSelect}
//             />
//           )}
//         </Box>
//         {/*Total Calculation Box*/}
//         <Box sx={{ bgcolor: "#f9f9fb", borderRadius: 3, width: "420px" }}>
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
//                 sx={{ fontSize: "13px", fontWeight: "400", width: "39%" }}
//               >
//                 Discount
//               </Typography>
//               <Box sx={{ width: "45%" }}>
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
//                       <InputAdornment
//                         sx={{ bgcolor: "#ddd", p: 1 }}
//                         position="end"
//                       >
//                         %
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

// //             {/* TDS / TCS & Adjustment Section */}
// //               {formik.values.tax_type === "TCS" ? (
// //                 <>
// //                   {/* Adjustment */}
// //                   <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
// //                     <Box sx={{ width: "35%" }}>
// //                       <StyledTextField
// //                         name={"adjustment_description"}
// //                         value={formik.values.adjustment_description}
// //                         onChange={formik.handleChange}
// //                         error={
// //                           formik.touched.adjustment_description &&
// //                           Boolean(formik.errors.adjustment_description)
// //                         }
// //                         onBlur={formik.handleBlur}
// //                         sx={{
// //                           width: "120px",
// //                           border: "1px dotted #978195",
// //                           padding: "8px !important",
// //                           "& input": {
// //                             "&::placeholder": {
// //                               color: "#978195",
// //                               fontWeight: "normal",
// //                             },
// //                           },
// //                         }}
// //                       />
// //                     </Box>

// //                     <Box sx={{ width: "35%" }}>
// //                       <StyledTextField
// //                         name={"adjustment"}
// //                         type="number"
// //                         value={formik.values.adjustment}
// //                         onChange={(e) => {
// //                           handleAdjustAmount(e);
// //                         }}
// //                         error={
// //                           formik.touched.adjustment &&
// //                           Boolean(formik.errors.adjustment)
// //                         }
// //                         onBlur={formik.handleBlur}
// //                         sx={{
// //                           width: "140px",
// //                           textAlign: "right",
// //                           "& input": {
// //                             "&::placeholder": {
// //                               color: "#978195",
// //                               fontWeight: "normal",
// //                             },
// //                           },
// //                         }}
// //                       />
// //                     </Box>
// //                     <Typography
// //                       sx={{
// //                         width: "30%",
// //                         textAlign: "right",
// //                         fontSize: "13px",
// //                         fontWeight: "400",
// //                       }}
// //                     >
// //                       {formik.values.adjustment
// //                         ? formik.values.adjustment >= 0
// //                           ? formik.values.adjustment
// //                           : formik.values.adjustment
// //                         : "0.00"}
// //                     </Typography>
// //                   </Box>

// //                   {/* TDS/TCS Selector */}
// //                   <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
// //                     <RadioGroup
// //                       row
// //                       name="tax_type"
// //                       value={formik.values.tax_type || "TDS"}
// //                       onChange={handleTaxMethodChange}
// //                       sx={{ width: "35%" }}
// //                     >
// //                       <FormControlLabel
// //                         value="TDS"
// //                         control={
// //                           <Radio
// //                             size="20px"
// //                             sx={{
// //                               color: "#3b82f6",
// //                               padding: "4px",
// //                               "&.Mui-checked": { color: "#3b82f6" },
// //                             }}
// //                           />
// //                         }
// //                         label={<Typography variant="body2">TDS</Typography>}
// //                         sx={{ mr: 2, fontSize: "10px" }}
// //                       />
// //                       <FormControlLabel
// //                         value="TCS"
// //                         control={
// //                           <Radio
// //                             size="20px"
// //                             sx={{
// //                               color: "#3b82f6",
// //                               padding: "4px",
// //                               "&.Mui-checked": { color: "#3b82f6" },
// //                             }}
// //                           />
// //                         }
// //                         label={<Typography variant="body2">TCS</Typography>}
// //                       />
// //                     </RadioGroup>
// //                     <Box sx={{ width: "40%" }}>
// //                       <StyledTextField
// //                         readOnly
// //                         name={"tds_option"}
// //                         placeholder={`Select ${formik.values.tax_type}`}
// //                         error={
// //                           formik.touched.tds_option &&
// //                           Boolean(formik.errors.tds_option)
// //                         }
// //                         value={formik.values.tds_option}
// //                         onClick={handleTdsClick}
// //                         sx={{
// //                           cursor: "pointer",
// //                           width: "140px",
// //                           border: "1px solid #dd",
// //                         }}
// //                       />
// //                     </Box>
// //                     <Box
// //                       sx={{
// //                         display: "flex",
// //                         justifyContent: "flex-end",
// //                         alignItems: "end",
// //                         width: "25%",
// //                       }}
// //                     >
// //                       <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
// //                         {formik.values.tax_type === "TDS" ? "-" : ""}
// //                         {formik.values.tax_amount
// //                           ? `(${formik.values.tax_amount})`
// //                           : "0.00"}
// //                       </Typography>
// //                     </Box>
// //                   </Box>
// //                 </>
// //               ) : (
// //                 <>
// //                   {/* Existing Order for TDS */}
// //                   <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
// //                     <RadioGroup
// //                       row
// //                       name="tax_type"
// //                       value={formik.values.tax_type || "TDS"}
// //                       onChange={handleTaxMethodChange}
// //                       sx={{ width: "35%" }}
// //                     >
// //                       <FormControlLabel
// //                         value="TDS"
// //                         control={
// //                           <Radio
// //                             size="20px"
// //                             sx={{
// //                               color: "#3b82f6",
// //                               padding: "4px",
// //                               "&.Mui-checked": { color: "#3b82f6" },
// //                             }}
// //                           />
// //                         }
// //                         label={<Typography variant="body2">TDS</Typography>}
// //                         sx={{ mr: 2, fontSize: "10px" }}
// //                       />
// //                       <FormControlLabel
// //                         value="TCS"
// //                         control={
// //                           <Radio
// //                             size="20px"
// //                             sx={{
// //                               color: "#3b82f6",
// //                               padding: "4px",
// //                               "&.Mui-checked": { color: "#3b82f6" },
// //                             }}
// //                           />
// //                         }
// //                         label={<Typography variant="body2">TCS</Typography>}
// //                       />
// //                     </RadioGroup>
// //                     <Box sx={{ width: "40%" }}>
// //                       <StyledTextField
// //                         readOnly
// //                         name={"tds_option"}
// //                         placeholder={`Select ${formik.values.tax_type}`}
// //                         error={
// //                           formik.touched.tds_option &&
// //                           Boolean(formik.errors.tds_option)
// //                         }
// //                         value={formik.values.tds_option}
// //                         onClick={handleTdsClick}
// //                         sx={{
// //                           cursor: "pointer",
// //                           width: "140px",
// //                           border: "1px solid #dd",
// //                         }}
// //                       />
// //                     </Box>
// //                     <Box
// //                       sx={{
// //                         display: "flex",
// //                         justifyContent: "flex-end",
// //                         alignItems: "end",
// //                         width: "25%",
// //                       }}
// //                     >
// //                       <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>
// //                         {formik.values.tax_type === "TDS" ? "-" : ""}
// //                         {formik.values.tax_amount
// //                           ? `(${formik.values.tax_amount})`
// //                           : "0.00"}
// //                       </Typography>
// //                     </Box>
// //                   </Box>

// //                   {/* Adjustment */}
// //                   <Box sx={{ display: "flex", alignItems: "center", pb: 2 }}>
// //                     <Box sx={{ width: "35%" }}>
// //                       <StyledTextField
// //                         name={"adjustment_description"}
// //                         value={formik.values.adjustment_description}
// //                         onChange={formik.handleChange}
// //                         error={
// //                           formik.touched.adjustment_description &&
// //                           Boolean(formik.errors.adjustment_description)
// //                         }
// //                         onBlur={formik.handleBlur}
// //                         sx={{
// //                           width: "120px",
// //                           border: "1px dotted #978195",
// //                           padding: "8px !important",
// //                           "& input": {
// //                             "&::placeholder": {
// //                               color: "#978195",
// //                               fontWeight: "normal",
// //                             },
// //                           },
// //                         }}
// //                       />
// //                     </Box>

// //                     <Box sx={{ width: "35%" }}>
// //                       <StyledTextField
// //                         name={"adjustment"}
// //                         type="number"
// //                         value={formik.values.adjustment}
// //                         onChange={(e) => {
// //                           handleAdjustAmount(e);
// //                         }}
// //                         error={
// //                           formik.touched.adjustment &&
// //                           Boolean(formik.errors.adjustment)
// //                         }
// //                         onBlur={formik.handleBlur}
// //                         sx={{
// //                           width: "140px",
// //                           textAlign: "right",
// //                           "& input": {
// //                             "&::placeholder": {
// //                               color: "#978195",
// //                               fontWeight: "normal",
// //                             },
// //                           },
// //                         }}
// //                       />
// //                     </Box>
// //                     <Typography
// //                       sx={{
// //                         width: "30%",
// //                         textAlign: "right",
// //                         fontSize: "13px",
// //                         fontWeight: "400",
// //                       }}
// //                     >
// //                       {formik.values.adjustment
// //                         ? formik.values.adjustment >= 0
// //                           ? formik.values.adjustment
// //                           : formik.values.adjustment
// //                         : "0.00"}
// //                     </Typography>
// //                   </Box>
// //                 </>
// //               )}
// //           </Box>

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

// //       {/* TDS DROPDOWN MENU */}
// //       <Menu
// //         anchorEl={tdsAnchorEl}
// //         open={tdsOpen}
// //         onClose={handleTdsClose}
// //         anchorOrigin={{
// //           vertical: "bottom",
// //           horizontal: "left",
// //         }}
// //         transformOrigin={{
// //           vertical: "top",
// //           horizontal: "left",
// //         }}
// //         sx={{ maxHeight: "300px", width: "250px" }}
// //       >
// //         <Typography
// //           sx={{
// //             color: "#4C526C",
// //             fontSize: "13px",
// //             fontWeight: "600",
// //             pl: 1.5,
// //             py: 1,
// //           }}
// //         >
// //           Select TDS Type
// //         </Typography>
// //         {(formik.values.tax_type === "TDS" ? tdsOptions : tcsOptions).map(
// //           (option, index) => (
// //             <MenuItem
// //               key={index}
// //               onClick={() => handleTdsSelect(option)}
// //               selected={formik.values.tds_option === option.id} // Compare by id now
// //               sx={{
// //                 m: 0.5,
// //                 fontSize: "13px",
// //                 fontWeight: "400",
// //                 borderRadius: 1,
// //                 backgroundColor:
// //                   formik.values.tds_option === option.id
// //                     ? "#408dfb !important"
// //                     : "transparent",
// //                 color:
// //                   formik.values.tds_option === option.id ? "white" : "inherit",
// //                 "&:hover": {
// //                   backgroundColor:
// //                     formik.values.tds_option === option.id
// //                       ? "#408dfb !important"
// //                       : "#f0f0f0",
// //                 },
// //               }}
// //             >
// //               <Box>
// //                 <Typography sx={{ fontSize: "13px" }}>
// //                   {option.name || option.label}
// //                 </Typography>
// //                 <Typography
// //                   sx={{ fontSize: "13px", fontWeight: "400", opacity: 0.7 }}
// //                 >
// //                   [{option.rate}%]
// //                 </Typography>
// //               </Box>
// //             </MenuItem>
// //           )
// //         )}
// //       </Menu>

//       {/* Modal for Add Items in Bulk */}
//       <Modal open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             borderRadius: 2,
//             height: "100vh",
//             overflowY: "scroll",
//             paddingLeft: "50px",
//             width: "60%",
//           }}
//         >
//           <Box>
//             <NewItemForm
//               open={openItemDialog}
//               onClose={handleClose}
//               itemList={itemList || []}
//               formik={formik}
//               initialSelectedItems={getSelectedItems()}
//               onItemsSelect={handleBulkItemsSelect}
//             />
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default TableAndTotal;

//first used table
"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
  Select,
  MenuItem,
  Menu,
  TextareaAutosize,
  InputAdornment,
  Grid,
  Popover,
  Autocomplete,
  Dialog,
  DialogContent,
  Modal,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import AddBulkItems from "../common/Addbulkitems/AddBulkItems"; // BUTTON
import TCStax from "../common/Tax/TcsModal"; // TCS Modal
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import apiService from "../../../src/services/axiosService";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TaxModal from "../common/Tax/TcsModal"; // Tax Modal
import NewItemForm from "../common/newitem/page";
import { usePathname } from "next/navigation";

export default function InvoiceItemTable({formik}) {
  const [customerNotes, setCustomerNotes] = useState(
    "Looking forward for your business."
  );
  const [useForAllCustomers, setUseForAllCustomers] = useState(false);
  const [symbolAnchorEl, setSymbolAnchorEl] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState("%");
  const [open, setOpen] = useState(false); // State to track visibility
  const [isTcsPopoverOpen, setIsTcsPopoverOpen] = useState(false); // State for TCS popover
  const [tcsPopoverAnchorEl, setTcsPopoverAnchorEl] = useState(null); // Anchor for TCS popover
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [isChallan,setIsChallan] = useState(false);
  const options = [...filteredItems, { id: "add_new", name: "Add New Item" }];
  const pathname = usePathname();
  // TDS options
  const tdsOptions = [
    { id: 'commission_brokerage', name: 'Commission or Brokerage', rate: 2, section: 'Section 194 H' },
    { id: 'commission_brokerage_reduced', name: 'Commission or Brokerage (Reduced)', rate: 3.75, section: 'Section 194 H' },
    { id: 'dividend', name: 'Dividend', rate: 10, section: 'Section 194' },
    { id: 'dividend_reduced', name: 'Dividend (Reduced)', rate: 7.5, section: 'Section 194' },
    { id: 'interest', name: 'Other Interest than securities', rate: 10, section: 'Section 194 A' },
    { id: 'interest_reduced', name: 'Other Interest than securities (Reduced)', rate: 7.5, section: 'Section 194 A' },
    { id: 'contractor_others', name: 'Payment of contractors for Others', rate: 2, section: 'Section 194 C' },
    { id: 'contractor_others_reduced', name: 'Payment of contractors for Others (Reduced)', rate: 1.5, section: 'Section 194 C' },
    { id: 'contractor_individual', name: 'Payment of contractors HUF/Indiv', rate: 1, section: 'Section 194 C' },
    { id: 'contractor_individual_reduced', name: 'Payment of contractors HUF/Indiv (Reduced)', rate: 0.75, section: 'Section 194 C' },
    { id: 'professional', name: 'Professional Fees', rate: 10, section: 'Section 194 J' },
    { id: 'professional_reduced', name: 'Professional Fees (Reduced)', rate: 7.5, section: 'Section 194 J' },
    { id: 'rent', name: 'Rent on land or furniture etc', rate: 10, section: 'Section 194 I' },
    { id: 'rent_reduced', name: 'Rent on land or furniture etc (Reduced)', rate: 7.5, section: 'Section 194 I' },
    { id: 'technical', name: 'Technical Fees', rate: 2, section: 'Section 194 C' }
  ];
  const tcsOptions = [
    { id: 'sample', name: 'sample', rate: 20, nature: '206C(6CA)' }
  ];

  const getPathEntity = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[2];
  };

  useEffect(()=>{
    const value = getPathEntity();
    if(value === "deliveryChallan"){
      setIsChallan(true);
    }
  },[pathname])

  const handleSymbolMenuOpen = (event) => {
    setSymbolAnchorEl(event.currentTarget);
  };

  const handleSymbolMenuClose = () => {
    setSymbolAnchorEl(null);
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    handleSymbolMenuClose();
  };

  const fetchItemList = async () => {
    if (allItems.length > 0) return;
    try {
      const organization_id = localStorage.getItem("organization_id");
      if (!organization_id) {
        console.error("Organization ID not found in local storage");
        return;
      }
      const response = await apiService({
        method: "GET",
        url: `/api/v1/item/item/details?organization_id=${organization_id}`,
      });
      const fetchedItems = response.data?.message || [];
      const itemsWithIds = fetchedItems.map((item) => ({
        ...item,
        id: item._id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));
      setAllItems(itemsWithIds);
      setFilteredItems(itemsWithIds);
    } catch (error) {
      console.error("Error fetching items:", error);
      setFilteredItems([]);
    }
  };

  useEffect(() => {
    fetchItemList();

  }, []);
 console.log(formik.values.discount_percent,"discount_percent");

  const handleClose = () => {
    fetchItemList();
    setOpenItemDialog(false);
  }

  useEffect(() => {
    if (!formik.values.line_items) {
      formik.setFieldValue('line_items', [{
        item_id: "",
        name: "",
        description: "",
        quantity: 1,
        rate: 0,
        tax_percentage: 0,
        unit: "",
      }]);
    }

    if (!formik.values.tax_type) {
      formik.setFieldValue('tax_type', 'TDS');
    }
  }, []);

  const commonInputFieldStyle = {
    width: "80px",
    "& .MuiOutlinedInput-root": {
      height: "36px",
      backgroundColor: "white",
    },
    "& .MuiOutlinedInput-input": {
      textAlign: "right",
      p: "8px 12px",
    },
  };

  const handleSelectItem = (newValue, index) => {
    if (newValue && newValue.id !== "add_new") {
      const currentItems = [...formik.values.line_items];
      const quantity = parseFloat(currentItems[index].quantity) || 1;
      const rate = parseFloat(newValue.rate) || 0;
      const amount = quantity * rate;

      currentItems[index] = {
        ...currentItems[index],
        item_id: newValue.id,
        name: newValue.name,
        rate: rate,
        amount: amount
      };

      formik.setFieldValue('line_items', currentItems);
      calculateTotals();
    }
  };

  const calculateTotals = () => {
    const items = formik.values.line_items || [];

    // Calculate subtotal from line items
    const subTotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const amount = quantity * rate;
      return sum + amount;
    }, 0);

    // Set subtotal values
    formik.setFieldValue('sub_total', subTotal);
    formik.setFieldValue('sub_total_formatted', `₹${subTotal.toFixed(2)}`);

    // Calculate discount on subtotal
    const discountPercentage = parseFloat(formik.values.discount_percent) || 0;
    const discountAmount = (subTotal * discountPercentage) / 100;
    const subTotalAfterDiscount = subTotal - discountAmount;

    // Set discount values
    // formik.setFieldValue('discount_percent', discountPercentage);
    formik.setFieldValue('discount_amount', discountAmount);
    formik.setFieldValue('discount_amount_formatted', `₹${discountAmount.toFixed(2)}`);

    // Calculate tax amount based on TDS/TCS selection
    const taxPercentage = parseFloat(formik.values.tax_percentage) || 0;
    const taxAmount = (subTotalAfterDiscount * taxPercentage) / 100;

    // Set tax amount values
    formik.setFieldValue('tax_total', taxAmount);
    formik.setFieldValue('tax_total_formatted', `₹${taxAmount.toFixed(2)}`);

    // Calculate total with adjustment
    const adjustment = parseFloat(formik.values.adjustment) || 0;
    let total;

    if (formik.values.tax_type === 'TCS') {
      // For TCS, add tax amount
      total = subTotalAfterDiscount + taxAmount + adjustment;
    } else {
      // For TDS, subtract tax amount
      total = subTotalAfterDiscount - taxAmount + adjustment;
    }

    // Set all total values in formik
    formik.setFieldValue('total', total);
    formik.setFieldValue('total_formatted', `₹${total.toFixed(2)}`);
    formik.setFieldValue('total_amount', total);
    formik.setFieldValue('total_amount_formatted', `₹${total.toFixed(2)}`);

    // Set tax IDs based on selection
    if (formik.values.tax_type === 'TDS') {
      formik.setFieldValue('tds_id', formik.values.tds_option);
      formik.setFieldValue('tcs_id', '');
    } else {
      formik.setFieldValue('tcs_id', formik.values.tds_option);
      formik.setFieldValue('tds_id', '');
    }
  };

  const handleTaxMethodChange = (event) => {
    const method = event.target.value;
    
    // Update formik fields with proper error handling
    try {
      formik.setFieldValue('tax_type', method);
      formik.setFieldValue('tax_percentage', '');
      formik.setFieldValue('tds_option', '');
      
      // Clear related tax fields
      formik.setFieldValue('tax_total', 0);
      formik.setFieldValue('tax_total_formatted', '₹0.00');
      
      // Recalculate totals after a brief delay to ensure formik updates
      setTimeout(() => {
        calculateTotals();
      }, 0);
    } catch (error) {
      console.error('Error updating tax method:', error);
    }
  };

  const handleTdsOptionChange = (event) => {
    const selectedId = event.target.value;
    const options = formik.values.tax_type === 'TDS' ? tdsOptions : tcsOptions;
    const selected = options.find(opt => opt.id === selectedId);

    if (selected) {
      formik.setFieldValue('tds_option', selectedId);
      formik.setFieldValue('tax_percentage', selected.rate);
      calculateTotals();
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...formik.values.line_items];
    const quantity = parseFloat(value) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    const amount = quantity * rate;

    updatedItems[index] = {
      ...updatedItems[index],
      quantity: quantity,
      amount: amount
    };

    formik.setFieldValue('line_items', updatedItems);
    calculateTotals();
  };

  const handleRateChange = (index, value) => {
    const updatedItems = [...formik.values.line_items];
    const rate = parseFloat(value) || 0;
    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const amount = quantity * rate;

    updatedItems[index] = {
      ...updatedItems[index],
      rate: rate,
      amount: amount
    };

    formik.setFieldValue('line_items', updatedItems);
    calculateTotals();
  };

  const handleDiscountChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue('discount_percent', value);
    calculateTotals();
  };

  const addNewRow = () => {
    const newLineItems = [...formik.values.line_items];
    newLineItems.push({
      item_id: "",
      name: "",
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      tax_percentage: 0,
      unit: "",
    });
    formik.setFieldValue("line_items", newLineItems);
  };

  const removeRow = (index) => {
    if (formik.values.line_items.length > 1) {
      const newLineItems = formik.values.line_items.filter((_, i) => i !== index);
      formik.setFieldValue("line_items", newLineItems);
    }
  };

  const calculateDiscount = () => {
    const subtotal = parseFloat(formik.values.sub_total) || 0;
    const discountValue = parseFloat(formik.values.discount_percent) || 0;
    const discountAmount = (subtotal * discountValue) / 100;
    return `${discountAmount.toFixed(2)}`;
  };

  const calculateItemTotal = (item) => {
    if (!item) return "0.00";
    const quantity = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discount = parseFloat(item.discount) || 0;
    const amount = quantity * rate * (1 - discount/100);
    item.amount = amount; // Update the item's amount
    return amount.toFixed(2);
  };

  const InvoiceRow = ({ item, canDelete, index }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e2e8f0",
        "& > div:not(:last-child)": {
          borderRight: "1px solid #e2e8f0",
        },
      }}
    >
      <Box sx={{ flex: 4, p: 2, color: "#94a3b8" }}>
        <Autocomplete
          options={options}
          value={formik.values.line_items[index]}
          getOptionLabel={(option) => option.name || ""}
          onChange={(_, newValue) => {
            if (newValue?.id === "add_new") {
              setOpenItemDialog(true);
            } else {
              handleSelectItem(newValue, index);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={formik.touched.line_items?.[index]?.name && Boolean(formik.errors.line_items?.[index]?.name)}
              helperText={formik.touched.line_items?.[index]?.name && formik.errors.line_items?.[index]?.name}
              placeholder="Type or click to select an item"
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#86b7fe",
                    boxShadow: "0 0 0 2px rgba(97, 160, 255, 0.3)",
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d32f2f",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#475569",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                },
                "& .MuiFormHelperText-root": {
                  color: "#d32f2f",
                  marginLeft: 0,
                  fontSize: "0.75rem",
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            if (option.id === "add_new") {
              return (
                <MenuItem {...props} key="add_new">
                  <Divider />
                  <Button
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      justifyContent: "flex-start",
                      color: "#2196f3",
                      textTransform: "none",
                      fontSize: "14px",
                    }}
                    onClick={() => setOpenItemDialog(true)}
                  >
                    Add New Item
                  </Button>
                </MenuItem>
              );
            }
            return (
              <MenuItem {...props} key={option.id}>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "inherit" }}>
                    {option.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "inherit" }}>
                    Rate: ₹{option.rate}
                  </Typography>
                </Box>
              </MenuItem>
            );
          }}
        />
        {/* <CustomDialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}> */}
          {/* <CreateNewItem onClose={() => setOpenItemDialog(false)} />
           */}
        {/* </CustomDialog> */}
        <Modal open={openItemDialog} onClose={() => setOpenItemDialog(false)}>

<Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    height: "100vh",
    overflowY: "scroll",
    paddingLeft: "50px",
    width: "60%",
  }}
>
  {/* <Button
    onClick={handleClose}
    sx={{ position: "absolute", top: 10, right: 10, color: "RED" }}
    data-testid="close-new-item-modal"
  >
    <CloseIcon />
  </Button> */}
  <Box >
  <NewItemForm onClose={handleClose} />
  </Box>
</Box>
</Modal>
      </Box>
      <Box sx={{ flex: 1, p: 2, textAlign: "center" }}>
        <TextField
          size="small"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(index, e.target.value)}
          error={formik.touched.line_items?.[index]?.quantity && Boolean(formik.errors.line_items?.[index]?.quantity)}
          helperText={formik.touched.line_items?.[index]?.quantity && formik.errors.line_items?.[index]?.quantity}
          variant="outlined"
          sx={{
            ...commonInputFieldStyle,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
          InputProps={{
            inputProps: { style: { textAlign: "right" } },
          }}
        />
      </Box>
      <Box sx={{ flex: 1, p: 2, textAlign: "center" }}>
        <TextField
          size="small"
          value={item.rate}
          onChange={(e) => handleRateChange(index, e.target.value)}
          error={formik.touched.line_items?.[index]?.rate && Boolean(formik.errors.line_items?.[index]?.rate)}
          helperText={formik.touched.line_items?.[index]?.rate && formik.errors.line_items?.[index]?.rate}
          sx={{
            ...commonInputFieldStyle,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
          InputProps={{
            inputProps: { style: { textAlign: "right" } },
          }}
        />
      </Box>
      <Box sx={{ flex: 1, p: 2, textAlign: "right", fontWeight: 500 }}>
      {calculateItemTotal(item)}
      </Box>
      <Box sx={{ width: "40px", display: "flex", justifyContent: "center" }}>
        {canDelete && (
          <IconButton size="small" onClick={() => removeRow(index)}>
            <CloseIcon fontSize="small" sx={{ color: "#ef4444" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  // Update useEffect to trigger calculations when values change
  useEffect(() => {
    calculateTotals();
  }, [
    formik.values.line_items,
    formik.values.tax_percentage,
    formik.values.tax_type,
    formik.values.adjustment,
    formik.values.discount_percent
  ]);

  const handleManageTaxClick = (event) => {
    event.stopPropagation(); // Prevent the Select from opening/closing
    setOpenTaxModal(true);
  };

  // Add refs and state for truncation
  const tdsSelectRef = useRef(null);
  const [isTdsTruncated, setIsTdsTruncated] = useState(false);
  // Helper to get full label for selected TDS option
  const getTdsFullLabel = () => {
    const options = formik.values.tax_type === 'TDS' ? tdsOptions : tcsOptions;
    const selected = options.find(opt => opt.id === formik.values.tds_option);
    if (!selected) return '';
    return `${selected.name || selected.label} [${selected.rate}%]`;
  };
  useEffect(() => {
    if (tdsSelectRef.current) {
      setTimeout(() => {
        setIsTdsTruncated(
          tdsSelectRef.current.scrollWidth > tdsSelectRef.current.clientWidth
        );
      }, 50); // Wait for DOM update
    }
  }, [formik.values.tds_option, formik.values.tax_type]);

  return (
    <Box
      sx={{
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        p: 2,
        mr: 17,
        ml: 1,
      }}
    >
      {/* Item Table */}
      <Box
        sx={{
          borderRadius: "4px",
          mb: 2,
          backgroundColor: "#fff",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e2e8f0",
            borderTop: "1px solid #e2e8f0",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "16px", p: 2 }}>
            Item Table
          </Typography>
          <Button
            variant="text"
            startIcon={<CheckCircleOutlineIcon sx={{ color: "#3b82f6" }} />}
            sx={{
              color: "#3b82f6",
              textTransform: "none",
              fontWeight: 400,
              p: 2,
            }}
          >
            Bulk Actions
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid #E2E8F0",
            "& > div:not(:last-child)": { borderRight: ".5px solid #E2E8F0" },
            mt: -2,
          }}
        >
          <Box
            sx={{
              flex: 4,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            ITEM DETAILS
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              textAlign: "center",
            }}
          >
            QUANTITY
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            RATE
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                ml: 0.5,
                border: "1px solid #CBD5E1",
                p: 0.2,
                borderRadius: 0.5,
                fontSize: "11px",
                lineHeight: 1,
              }}
            >
              ₹
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              textAlign: "center",
            }}
          >
            AMOUNT
          </Box>
          <Box sx={{ width: "40px" }}></Box>
        </Box>

        {/* Table Rows */}
        {formik.values.line_items.map((item, index) => (
          <InvoiceRow
            key={index}
            item={item}
            index={index}
            canDelete={formik.values.line_items.length > 1 || index === formik.values.line_items.length - 1}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
        {/* Left Column - Buttons and Notes */}
        <Box
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Buttons Row */}
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#f0f4ff",
                borderRadius: "7px",
                position: "relative",
              }}
            >
              <Button
                variant="text"
                startIcon={<AddCircleOutlinedIcon sx={{ color: "#3b82f6" }} />}
                onClick={() => addNewRow()}
                sx={{
                  color: "black",
                  textTransform: "none",
                  fontWeight: 400,
                }}
              >
                Add New Row
              </Button>
              <IconButton
                size="small"
                sx={{
                  ml: -1,
                }}
              >
                <KeyboardArrowDownIcon
                  sx={{ color: "#3b82f6", fontSize: "18px" }}
                />
              </IconButton>
            </Box>
            {/* Button to open the popup */}
            <Button
              variant="text"
              startIcon={<AddCircleOutlinedIcon sx={{ color: "#3b82f6" }} />}
              sx={{
                color: "black",
                textTransform: "none",
                ml: 2,
                fontWeight: 400,
                bgcolor: "#f0f4ff",
                borderRadius: "7px",
                "&:hover": { bgcolor: "#e0e7ff" },
              }}
              onClick={() => setOpen(true)} // Open popup on click
            >
              Add Items in Bulk
            </Button>
            {/* Render the popup conditionally */}
            {open && <AddBulkItems open={open} onClose={() => setOpen(false)} itemList={allItems} formik={formik} />}
          </Box>
          {/* Customer Notes Section */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1 ,fontSize:"14px"}}>Customer Notes</Typography>
            <TextareaAutosize
              id="customerNotes"
              minRows={3}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontFamily: "inherit",
                fontSize: "inherit",
                backgroundColor: "white",
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={useForAllCustomers}
                  onChange={(e) => setUseForAllCustomers(e.target.checked)}
                  sx={{
                    color: "#3b82f6",
                    padding: "4px",
                    "&.Mui-checked": { color: "#3b82f6" },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  Use this in future for all quotes of all customers.
                </Typography>
              }
            />
          </Box>
        </Box>
       {/* Right Column - Summary Section */}
      {/* Right Column - Summary Section */}
<Box sx={{ width: "55%", bgcolor: "#f1f5f9", p: 3, borderRadius: 1 }}>
  {/* Sub Total */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
      Sub Total
    </Typography>
    <Typography variant="body2">{formik.values.sub_total}</Typography>
  </Box>
  {/* Discount */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Typography variant="body2">Discount</Typography>
    <Grid
      item
      sx={{
        Width: "50%",
        bgcolor: "white",
        borderRadius: "7px",
      }}
    >
      <TextField
        type={selectedSymbol === "%" ? "number" : "text"}
        placeholder="0"
        value={formik.values.discount_percent}
        onChange={handleDiscountChange}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                // onClick={handleSymbolMenuOpen}
                sx={{
                  bgcolor: "action.hover",
                  px: 1,
                  borderLeft: "1px solid",
                  borderColor: "divider",
                  height: "100%",
                  borderRadius: 0,
                }}
              >
                {selectedSymbol}
                {/* <ArrowDropDown fontSize="small" /> */}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            pr: 0,
            height: 36,
            borderRadius: "7px", // Added border radius
            "& input": {
              textAlign: "right",
              pr: 1,
              fontSize: "0.875rem",
              py: 0.5,
              width: "60px", // Constrain input width
            },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            pl: 1,
            height: 36,
            borderRadius: "7px", // Ensure radius applies
            overflow: "hidden", // Keep radius intact
          },
        }}
      />
      <Menu
        anchorEl={symbolAnchorEl}
        open={Boolean(symbolAnchorEl)}
        onClose={handleSymbolMenuClose}
      >
        <MenuItem onClick={() => handleSymbolSelect("%")}>
          % Percentage
        </MenuItem>
        <MenuItem onClick={() => handleSymbolSelect("₹")}>
          ₹ Rupee
        </MenuItem>
      </Menu>
    </Grid>
    <Typography variant="body2">{calculateDiscount()}</Typography>
  </Box>

{!isChallan && (
  formik.values.tax_type === "TDS" ? (
    <>
      {/* TDS/TCS Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <RadioGroup
            row
            name="tax_type"
            value={formik.values.tax_type || 'TDS'}
            onChange={handleTaxMethodChange}
          >
            <FormControlLabel
              value="TDS"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#3b82f6",
                    padding: "4px",
                    "&.Mui-checked": { color: "#3b82f6" },
                  }}
                />
              }
              label={<Typography variant="body2">TDS</Typography>}
              sx={{ mr: 2 }}
            />
            <FormControlLabel
              value="TCS"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#3b82f6",
                    padding: "4px",
                    "&.Mui-checked": { color: "#3b82f6" },
                  }}
                />
              }
              label={<Typography variant="body2">TCS</Typography>}
            />
          </RadioGroup>
          <Box sx={{ display: "flex", alignItems: "center", ml: 8 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Select
                value={formik.values.tds_option || ""}
                onChange={handleTdsOptionChange}
                displayEmpty
                IconComponent={KeyboardArrowDownIcon}
                renderValue={() => (
                  <Box
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {getTdsFullLabel()}
                  </Box>
                )}
                sx={{
                  height: "35px",
                  fontSize: "13px",
                  width: "180px",
                  backgroundColor: "white",
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      width: "350px",
                      fontSize: "13px",
                      '& .MuiMenuItem-root': {
                        padding: '8px 16px',
                        fontSize: "13px",
                        '&:hover': {
                          backgroundColor: '#f0f4ff'
                        }
                      }
                    }
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  }
                }}
                inputProps={{
                  ref: tdsSelectRef,
                  style: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    display: 'block',
                  },
                }}
              >
                <MenuItem value="" disabled sx={{color:"#838195"}}>Select a Tax</MenuItem>
                {(formik.values.tax_type === 'TDS' ? tdsOptions : tcsOptions).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} [{option.rate}%]
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem
                  onClick={handleManageTaxClick}
                  sx={{
                    color: '#3b82f6',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                    Manage {formik.values.tax_type}
                  </Box>
                </MenuItem>
              </Select>
              <Typography
                variant="caption"
                sx={{
                  color: '#444',
                  mt: 0.5,
                  fontSize: '12px',
                  width: '180px',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  display: 'block'
                }}
              >
                {getTdsFullLabel()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2">
          {formik.values.tax_type === 'TDS' ? '- ' : ' '}{formik.values.tax_total_formatted}
        </Typography>
      </Box>
      {/* Adjustment Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#cbd5e1",
              color: "#475569",
              bgcolor: "white",
              textTransform: "none",
              borderStyle: "dashed",
              height: "36px",
              px: 2,
              borderRadius: "7px",
              maxWidth: 150,
            }}
          >
            Adjustment
          </Button>
        </Box>
        <TextField
          size="small"
          value={formik.values.adjustment || "0"}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            formik.setFieldValue('adjustment', value);
            calculateTotals();
          }}
          sx={{
            width: "120px",
            ml: 2.3,
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              height: "36px",
              fontSize:"13px !important",
              borderRadius: "7px",
            },
          }}
        />
        <IconButton size="small" sx={{  }}>
          <HelpOutlineIcon fontSize="small" sx={{ color: "#94a3b8" }} />
        </IconButton>
        <Typography variant="body2">{(formik.values.adjustment || 0).toFixed(2)}</Typography>
      </Box>
    </>
  ) : (
    <>
      {/* Adjustment Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#cbd5e1",
              color: "#475569",
              bgcolor: "white",
              textTransform: "none",
              borderStyle: "dashed",
              height: "36px",
              px: 2,
              borderRadius: "7px",
              maxWidth: 150,
            }}
          >
            Adjustment
          </Button>
        </Box>
        <TextField
          size="small"
          value={formik.values.adjustment || "0"}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            formik.setFieldValue("adjustment", value);
            calculateTotals();
          }}
          sx={{
            width: "120px",
            ml: 2.3,
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              height: "36px",
              fontSize:"13px !important",
              borderRadius: "7px",
            },
          }}
        />
        <IconButton size="small" sx={{ ml: 0.5 }}>
          <HelpOutlineIcon fontSize="small" sx={{ color: "#94a3b8" }} />
        </IconButton>
        <Typography variant="body2">{(formik.values.adjustment || 0).toFixed(2)}</Typography>
      </Box>
      {/* TDS/TCS Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <RadioGroup
            row
            name="tax_type"
            value={formik.values.tax_type || "TDS"}
            onChange={handleTaxMethodChange}
          >
            <FormControlLabel
              value="TDS"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#3b82f6",
                    padding: "4px",
                    "&.Mui-checked": { color: "#3b82f6" },
                  }}
                />
              }
              label={<Typography variant="body2">TDS</Typography>}
              sx={{ mr: 2 }}
            />
            <FormControlLabel
              value="TCS"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#3b82f6",
                    padding: "4px",
                    "&.Mui-checked": { color: "#3b82f6" },
                  }}
                />
              }
              label={<Typography variant="body2">TCS</Typography>}
            />
          </RadioGroup>
          <Box sx={{ display: "flex", alignItems: "center", ml: 8 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Select
                value={formik.values.tds_option || ""}
                onChange={handleTdsOptionChange}
                displayEmpty
                IconComponent={KeyboardArrowDownIcon}
                renderValue={() => (
                  <Box
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {getTdsFullLabel()}
                  </Box>
                )}
                sx={{
                  height: "35px",
                  fontSize: "13px",
                  width: "180px",
                  backgroundColor: "white",
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      width: "350px",
                      fontSize: "13px",
                      '& .MuiMenuItem-root': {
                        padding: '8px 16px',
                        fontSize: "13px",
                        '&:hover': {
                          backgroundColor: '#f0f4ff'
                        }
                      }
                    }
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  }
                }}
                inputProps={{
                  ref: tdsSelectRef,
                  style: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    display: 'block',
                  },
                }}
              >
                <MenuItem value="" disabled>Select {formik.values.tax_type}</MenuItem>
                {(formik.values.tax_type === 'TDS' ? tdsOptions : tcsOptions).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} [{option.rate}%]
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem
                  onClick={handleManageTaxClick}
                  sx={{
                    color: '#3b82f6',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                    Manage {formik.values.tax_type}
                  </Box>
                </MenuItem>
              </Select>
              <Typography
                variant="caption"
                sx={{
                  color: '#444',
                  mt: 0.5,
                  fontSize: '12px',
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block'
                }}
              >
                {getTdsFullLabel()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2">
          {formik.values.tax_type === 'TDS' ? '- ' : '+ '}{formik.values.tax_total_formatted}
        </Typography>
      </Box>
    </>
  )
)}

{isChallan && (
   <Box
   sx={{
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
     mb: 2,
   }}
 >
   <Box sx={{ display: "flex", alignItems: "center" }}>
     <TextField
       variant="outlined"
       size="small"
       value={formik.values.adjustment_description || ""}
       onChange={(e) => {
        const value = e.target.value || "";
        formik.setFieldValue('adjustment_description', value);
      }}
       sx={{
         color: "#475569",
         bgcolor: "white",
         border: "none",
         fontSize:"12px !important",
         textTransform: "none",
         height: "36px",
         "& .MuiOutlinedInput-root": {
          bgcolor: "white",
          fontSize:"13px !important",
          border: "1px dashed #cbd5e1",
          height: "36px",
          borderRadius: "7px",
        },
        "& .MuiOutlinedInput-notchedOutline":{
          border: "0 !important",
        },
        "&:hover":{
          border: "none",
        },
         borderRadius: "7px",
         maxWidth: 150,
       }}
     >
       Adjustment
     </TextField>
   </Box>
   <TextField
     size="small"
     value={formik.values.adjustment || "0"}
     onChange={(e) => {
       const value = parseFloat(e.target.value) || 0;
       formik.setFieldValue('adjustment', value);
       calculateTotals();
     }}
     sx={{
       width: "120px",
       ml: 2.3,
       "& .MuiOutlinedInput-root": {
         bgcolor: "white",
         height: "36px",
         fontSize:"13px !important",
         borderRadius: "7px",
       },
     }}
   />
   <IconButton size="small" sx={{  }}>
     <HelpOutlineIcon fontSize="small" sx={{ color: "#94a3b8" }} />
   </IconButton>
   <Typography variant="body2">{(formik.values.adjustment || 0).toFixed(2)}</Typography>
 </Box>
)}

  <Divider sx={{ my: 2 }} />

  {/* Total */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography sx={{ fontWeight: 600 }}>Total ( ₹ )</Typography>
    <Typography sx={{ fontWeight: 600 }}>{(formik.values.total_amount)?.toFixed(2) || (formik.values.total)?.toFixed(2)}</Typography>
  </Box>
</Box>

{/* TCS Popover */}
<Popover
  open={isTcsPopoverOpen}
  anchorEl={tcsPopoverAnchorEl}
  onClose={() => {
    setIsTcsPopoverOpen(false);
    setTcsPopoverAnchorEl(null);
  }}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "left",
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "left",
  }}
>
    <TCStax />
</Popover>

<Dialog
  open={openTaxModal}
  onClose={() => setOpenTaxModal(false)}
  maxWidth="md"
  fullWidth
>
  <DialogContent>
    <TaxModal
      onClose={() => setOpenTaxModal(false)}
      taxType={formik.values.tax_type}
    />
  </DialogContent>
</Dialog>
      </Box>
      </Box>
  );
}


// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   IconButton,
//   Checkbox,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Button,
//   Divider,
//   Select,
//   MenuItem,
//   Menu,
//   TextareaAutosize,
//   InputAdornment,
//   Grid,
//   Popover,
//   Autocomplete,
//   Dialog,
//   DialogContent,
//   Modal,
// } from "@mui/material";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
// import CloseIcon from "@mui/icons-material/Close";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
// import AddBulkItems from "../common/Addbulkitems/AddBulkItems"; // BUTTON
// import TCStax from "../common/Tax/TCStax"; // TCS Modal
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import apiService from "../../../src/services/axiosService";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import TaxModal from "../common/Tax/TcsModal"; // Tax Modal
// import NewItemForm from "../common/Addbulkitems/AddBulkItems";
// import { usePathname } from "next/navigation";

// export default function InvoiceItemTable({ formik }) {
//   // const [customerNotes, setCustomerNotes] = useState(
//   //   "Looking forward for your business."
//   // );
//   const [useForAllCustomers, setUseForAllCustomers] = useState(false);
//   const [symbolAnchorEl, setSymbolAnchorEl] = useState(null);
//   const [selectedSymbol, setSelectedSymbol] = useState("%");
//   const [open, setOpen] = useState(false); // State to track visibility
//   const [isTcsPopoverOpen, setIsTcsPopoverOpen] = useState(false); // State for TCS popover
//   const [tcsPopoverAnchorEl, setTcsPopoverAnchorEl] = useState(null); // Anchor for TCS popover
//   const [allItems, setAllItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [openItemDialog, setOpenItemDialog] = useState(false);
//   const [openTaxModal, setOpenTaxModal] = useState(false);
//   const [isChallan, setIsChallan] = useState(false);
//   const options = [...filteredItems, { id: "add_new", name: "Add New Item" }];
//   const pathname = usePathname();
//   // TDS options
//   const tdsOptions = [
//     {
//       id: "commission_brokerage",
//       name: "Commission or Brokerage",
//       rate: 2,
//       section: "Section 194 H",
//     },
//     {
//       id: "commission_brokerage_reduced",
//       name: "Commission or Brokerage (Reduced)",
//       rate: 3.75,
//       section: "Section 194 H",
//     },
//     { id: "dividend", name: "Dividend", rate: 10, section: "Section 194" },
//     {
//       id: "dividend_reduced",
//       name: "Dividend (Reduced)",
//       rate: 7.5,
//       section: "Section 194",
//     },
//     {
//       id: "interest",
//       name: "Other Interest than securities",
//       rate: 10,
//       section: "Section 194 A",
//     },
//     {
//       id: "interest_reduced",
//       name: "Other Interest than securities (Reduced)",
//       rate: 7.5,
//       section: "Section 194 A",
//     },
//     {
//       id: "contractor_others",
//       name: "Payment of contractors for Others",
//       rate: 2,
//       section: "Section 194 C",
//     },
//     {
//       id: "contractor_others_reduced",
//       name: "Payment of contractors for Others (Reduced)",
//       rate: 1.5,
//       section: "Section 194 C",
//     },
//     {
//       id: "contractor_individual",
//       name: "Payment of contractors HUF/Indiv",
//       rate: 1,
//       section: "Section 194 C",
//     },
//     {
//       id: "contractor_individual_reduced",
//       name: "Payment of contractors HUF/Indiv (Reduced)",
//       rate: 0.75,
//       section: "Section 194 C",
//     },
//     {
//       id: "professional",
//       name: "Professional Fees",
//       rate: 10,
//       section: "Section 194 J",
//     },
//     {
//       id: "professional_reduced",
//       name: "Professional Fees (Reduced)",
//       rate: 7.5,
//       section: "Section 194 J",
//     },
//     {
//       id: "rent",
//       name: "Rent on land or furniture etc",
//       rate: 10,
//       section: "Section 194 I",
//     },
//     {
//       id: "rent_reduced",
//       name: "Rent on land or furniture etc (Reduced)",
//       rate: 7.5,
//       section: "Section 194 I",
//     },
//     {
//       id: "technical",
//       name: "Technical Fees",
//       rate: 2,
//       section: "Section 194 C",
//     },
//   ];
//   const tcsOptions = [
//     { id: "sample", name: "sample", rate: 20, nature: "206C(6CA)" },
//   ];

//   const getPathEntity = () => {
//     const pathSegments = pathname.split("/");
//     return pathSegments[2];
//   };

//   useEffect(() => {
//     const value = getPathEntity();
//     if (value === "deliveryChallan") {
//       setIsChallan(true);
//     }
//   }, [pathname]);

//   const handleSymbolMenuOpen = (event) => {
//     setSymbolAnchorEl(event.currentTarget);
//   };

//   const handleSymbolMenuClose = () => {
//     setSymbolAnchorEl(null);
//   };

//   const handleSymbolSelect = (symbol) => {
//     setSelectedSymbol(symbol);
//     handleSymbolMenuClose();
//   };

//   const fetchItemList = async () => {
//     if (allItems.length > 0) return;
//     try {
//       const organization_id = localStorage.getItem("organization_id");
//       if (!organization_id) {
//         console.error("Organization ID not found in local storage");
//         return;
//       }
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/item/item/details?organization_id=${organization_id}`,
//       });
//       const fetchedItems = response.data?.message || [];
//       const itemsWithIds = fetchedItems.map((item) => ({
//         ...item,
//         id:
//           item._id ||
//           `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       }));
//       setAllItems(itemsWithIds);
//       setFilteredItems(itemsWithIds);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//       setFilteredItems([]);
//     }
//   };

//   useEffect(() => {
//     fetchItemList();
//   }, []);
//   // console.log(formik.values.discount_percent, "discount_percent");

//   const handleClose = () => {
//     fetchItemList();
//     setOpenItemDialog(false);
//   };

//   useEffect(() => {
//     if (!formik.values.line_items) {
//       formik.setFieldValue("line_items", [
//         {
//           item_id: "",
//           name: "",
//           description: "",
//           quantity: 1,
//           rate: 0,
//           tax_percentage: 0,
//           unit: "",
//         },
//       ]);
//     }

//     if (!formik.values.tax_type) {
//       formik.setFieldValue("tax_type", "TDS");
//     }
//   }, []);

//   const commonInputFieldStyle = {
//     width: "80px",
//     "& .MuiOutlinedInput-root": {
//       height: "36px",
//       backgroundColor: "white",

//     },
//     "& .MuiOutlinedInput-input": {
//       textAlign: "right",
//       p: "6px 10px",
//     },
//   };

//   const handleSelectItem = (newValue, index) => {
//     if (newValue && newValue.id !== "add_new") {
//       const currentItems = [...formik.values.line_items];
//       const quantity = parseFloat(currentItems[index].quantity) || 1;
//       const rate = parseFloat(newValue.rate) || 0;
//       const amount = quantity * rate;

//       currentItems[index] = {
//         ...currentItems[index],
//         item_id: newValue.id,
//         name: newValue.name,
//         rate: rate,
//         amount: amount,
//       };

//       formik.setFieldValue("line_items", currentItems);
//       calculateTotals();
//     }
//   };

//   const calculateTotals = () => {
//     const items = formik.values.line_items || [];

//     // Calculate subtotal from line items
//     const subTotal = items.reduce((sum, item) => {
//       const quantity = parseFloat(item.quantity) || 0;
//       const rate = parseFloat(item.rate) || 0;
//       const amount = quantity * rate;
//       return sum + amount;
//     }, 0);

//     // Set subtotal values
//     formik.setFieldValue("sub_total", subTotal);
//     formik.setFieldValue("sub_total_formatted", `₹${subTotal.toFixed(2)}`);

//     // Calculate discount on subtotal
//     const discountPercentage = parseFloat(formik.values.discount_percent) || 0;
//     const discountAmount = (subTotal * discountPercentage) / 100;
//     const subTotalAfterDiscount = subTotal - discountAmount;

//     // Set discount values
//     // formik.setFieldValue('discount_percent', discountPercentage);
//     formik.setFieldValue("discount_amount", discountAmount);
//     formik.setFieldValue(
//       "discount_amount_formatted",
//       `₹${discountAmount.toFixed(2)}`
//     );

//     // Calculate tax amount based on TDS/TCS selection
//     const taxPercentage = parseFloat(formik.values.tax_percentage) || 0;
//     const taxAmount = (subTotalAfterDiscount * taxPercentage) / 100;

//     // Set tax amount values
//     formik.setFieldValue("tax_total", taxAmount);
//     formik.setFieldValue("tax_total_formatted", `₹${taxAmount.toFixed(2)}`);

//     // Calculate total with adjustment
//     const adjustment = parseFloat(formik.values.adjustment) || 0;
//     let total;

//     if (formik.values.tax_type === "TCS") {
//       // For TCS, add tax amount
//       total = subTotalAfterDiscount + taxAmount + adjustment;
//     } else {
//       // For TDS, subtract tax amount
//       total = subTotalAfterDiscount - taxAmount + adjustment;
//     }

//     // Set all total values in formik
//     formik.setFieldValue("total", total);
//     formik.setFieldValue("total_formatted", `₹${total.toFixed(2)}`);
//     formik.setFieldValue("total_amount", total);
//     formik.setFieldValue("total_amount_formatted", `₹${total.toFixed(2)}`);

//     // Set tax IDs based on selection
//     if (formik.values.tax_type === "TDS") {
//       formik.setFieldValue("tds_id", formik.values.tds_option);
//       formik.setFieldValue("tcs_id", "");
//     } else {
//       formik.setFieldValue("tcs_id", formik.values.tds_option);
//       formik.setFieldValue("tds_id", "");
//     }
//   };

//   const handleTaxMethodChange = (event) => {
//     const method = event.target.value;
//     formik.setFieldValue("tax_type", method);
//     formik.setFieldValue("tax_percentage", "");
//     formik.setFieldValue("tds_option", "");
//     calculateTotals();
//   };

//   const handleTdsOptionChange = (event) => {
//     const selectedId = event.target.value;
//     const options = formik.values.tax_type === "TDS" ? tdsOptions : tcsOptions;
//     const selected = options.find((opt) => opt.id === selectedId);

//     if (selected) {
//       formik.setFieldValue("tds_option", selectedId);
//       formik.setFieldValue("tax_percentage", selected.rate);
//       calculateTotals();
//     }
//   };

//   const handleQuantityChange = (index, value) => {
//     const updatedItems = [...formik.values.line_items];
//     const quantity = parseFloat(value) || 0;
//     const rate = parseFloat(updatedItems[index].rate) || 0;
//     const amount = quantity * rate;

//     updatedItems[index] = {
//       ...updatedItems[index],
//       quantity: quantity,
//       amount: amount,
//     };

//     formik.setFieldValue("line_items", updatedItems);
//     calculateTotals();
//   };

//   const handleRateChange = (index, value) => {
//     const updatedItems = [...formik.values.line_items];
//     const rate = parseFloat(value) || 0;
//     const quantity = parseFloat(updatedItems[index].quantity) || 0;
//     const amount = quantity * rate;

//     updatedItems[index] = {
//       ...updatedItems[index],
//       rate: rate,
//       amount: amount,
//     };

//     formik.setFieldValue("line_items", updatedItems);
//     calculateTotals();
//   };

//   const handleDiscountChange = (event) => {
//     const value = event.target.value;
//     formik.setFieldValue("discount_percent", value);
//     calculateTotals();
//   };

//   const addNewRow = () => {
//     const newLineItems = [...formik.values.line_items];
//     newLineItems.push({
//       item_id: "",
//       name: "",
//       description: "",
//       quantity: 1,
//       rate: 0,
//       discount: 0,
//       tax_percentage: 0,
//       unit: "",
//     });
//     formik.setFieldValue("line_items", newLineItems);
//   };

//   const removeRow = (index) => {
//     if (formik.values.line_items.length > 1) {
//       const newLineItems = formik.values.line_items.filter(
//         (_, i) => i !== index
//       );
//       formik.setFieldValue("line_items", newLineItems);
//     }
//   };

//   const calculateDiscount = () => {
//     const subtotal = parseFloat(formik.values.sub_total) || 0;
//     const discountValue = parseFloat(formik.values.discount_percent) || 0;
//     const discountAmount = (subtotal * discountValue) / 100;
//     return `${discountAmount.toFixed(2)}`;
//   };

//   const calculateItemTotal = (item) => {
//     if (!item) return "0.00";
//     const quantity = parseFloat(item.quantity) || 0;
//     const rate = parseFloat(item.rate) || 0;
//     const discount = parseFloat(item.discount) || 0;
//     const amount = quantity * rate * (1 - discount / 100);
//     item.amount = amount; // Update the item's amount
//     return amount.toFixed(2);
//   };

//   const InvoiceRow = ({ item, canDelete, index }) => (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         borderBottom: "1px solid #e2e8f0",
//         "& > div:not(:last-child)": {
//           borderRight: "1px solid #e2e8f0",
//         },
//       }}
//     >
//       <Box sx={{ flex: 4, padding:"5px 17px", color: "#94a3b8" }}>
//         <Autocomplete
//           options={options}
//           value={formik.values.line_items[index]}
//           getOptionLabel={(option) => option.name || ""}
//           onChange={(_, newValue) => {
//             if (newValue?.id === "add_new") {
//               setOpenItemDialog(true);
//             } else {
//               handleSelectItem(newValue, index);
//             }
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               error={
//                 formik.touched.line_items?.[index]?.name &&
//                 Boolean(formik.errors.line_items?.[index]?.name)
//               }
//               helperText={
//                 formik.touched.line_items?.[index]?.name &&
//                 formik.errors.line_items?.[index]?.name
//               }
//               placeholder="Type or click to select an item"
//               fullWidth
//               variant="outlined"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   "&:hover .MuiOutlinedInput-notchedOutline": {
//                     borderColor: "#e2e8f0",
//                   },
//                   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                     borderColor: "#86b7fe",
//                     boxShadow: "0 0 0 2px rgba(97, 160, 255, 0.3)",
//                   },
//                   "&.Mui-error .MuiOutlinedInput-notchedOutline": {
//                     borderColor: "#d32f2f",
//                   },
//                 },
//                 "& .MuiInputBase-input": {
//                   color: "#475569",
//                   fontSize: "13px",
//                   padding: "6px 8px",
//                 },
//                 "& .MuiFormHelperText-root": {
//                   color: "#d32f2f",
//                   marginLeft: 0,
//                   fontSize: "0.75rem",
//                 },
//               }}
//             />
//           )}
//           renderOption={(props, option) => {
//             if (option.id === "add_new") {
//               return (
//                 <MenuItem {...props} key="add_new">
//                   <Divider />
//                   {/* <Button
//                     fullWidth
//                     startIcon={<AddCircleOutlineIcon />}
//                     sx={{
//                       justifyContent: "flex-start",
//                       color: "#2196f3",
//                       textTransform: "none",
//                       fontSize: "12px",
//                     }}
//                     onClick={() => setOpenItemDialog(true)}
//                   >
//                     Add New Item
//                   </Button> */}
//                 </MenuItem>
//               );
//             }
//             return (
//               <MenuItem {...props} key={option.id}>
//                 <Box sx={{ width: "100%" }}>
//                   <Typography
//                     variant="subtitle1"
//                     sx={{ fontWeight: "medium", color: "inherit",fontSize:"13px" }}
//                   >
//                     {option.name}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "inherit",fontSize:"13px" }}>
//                     Rate: ₹{option.rate}
//                   </Typography>
//                 </Box>
//               </MenuItem>
//             );
//           }}
//         />
//         {/* <CustomDialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}> */}
//         {/* <CreateNewItem onClose={() => setOpenItemDialog(false)} />
//          */}
//         {/* </CustomDialog> */}
//         {/* <Modal open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
//           <Box
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               bgcolor: "background.paper",
//               boxShadow: 24,
//               borderRadius: 2,
//               height: "100vh",
//               overflowY: "scroll",
//               paddingLeft: "50px",
//               width: "60%",
//             }}
//           >
//             <Box>
//               <NewItemForm />
//             </Box>
//           </Box>
//         </Modal> */}
//       </Box>
//       <Box sx={{ flex: 1, p: 2, textAlign: "center" , fontSize:"13px" }}>
//         <TextField
//           size="small"
//           value={item.quantity}
//           onChange={(e) => handleQuantityChange(index, e.target.value)}
//           error={
//             formik.touched.line_items?.[index]?.quantity &&
//             Boolean(formik.errors.line_items?.[index]?.quantity)
//           }
//           helperText={formik.touched.line_items?.[index]?.quantity && formik.errors.line_items?.[index]?.quantity}
//           variant="outlined"
//           sx={{
//             ...commonInputFieldStyle,
//             "& .MuiOutlinedInput-root": {
//               backgroundColor: "white",
//             },
//           }}
//           InputProps={{
//             inputProps: { style: { textAlign: "right" } },
//           }}
//         />
//       </Box>
//       <Box sx={{ flex: 1, p: 2, textAlign: "center", fontSize:"13px"  }}>
//         <TextField
//           size="small"
//           value={item.rate}
//           onChange={(e) => handleRateChange(index, e.target.value)}
//           error={
//             formik.touched.line_items?.[index]?.rate &&
//             Boolean(formik.errors.line_items?.[index]?.rate)
//           }
//           helperText={formik.touched.line_items?.[index]?.rate && formik.errors.line_items?.[index]?.rate}
//           sx={{
//             ...commonInputFieldStyle,
//             "& .MuiOutlinedInput-root": {
//               backgroundColor: "white",
//             },
//           }}
//           InputProps={{
//             inputProps: { style: { textAlign: "right" } },
//           }}
//         />
//       </Box>
//       <Box sx={{ flex: 1, p: 2, textAlign: "right", fontWeight: 500, fontSize:"13px" }}>
//         {calculateItemTotal(item)}
//       </Box>
//       <Box sx={{ width: "40px", display: "flex", justifyContent: "center" }}>
//         {canDelete && (
//           <IconButton size="small" onClick={() => removeRow(index)}>
//             <CloseIcon fontSize="small" sx={{ color: "#ef4444" }} />
//           </IconButton>
//         )}
//       </Box>
//     </Box>
//   );

//   // Update useEffect to trigger calculations when values change
//   useEffect(() => {
//     calculateTotals();
//   }, [
//     formik.values.line_items,
//     formik.values.tax_percentage,
//     formik.values.tax_type,
//     formik.values.adjustment,
//     formik.values.discount_percent,
//   ]);

//   const handleManageTaxClick = (event) => {
//     event.stopPropagation(); // Prevent the Select from opening/closing
//     setOpenTaxModal(true);
//   };

//   return (
//     <Box
//       sx={{
//         fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//         p: 2,
//         mr: 17,
//         ml: 1,
//       }}
//     >
//       {/* Item Table */}
//       <Box
//         sx={{
//           borderRadius: "4px",
//           mb: 2,
//           backgroundColor: "#fff",
//           overflow: "hidden",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             backgroundColor: "#f8f9fa",
//             borderBottom: "1px solid #e2e8f0",
//             borderTop: "1px solid #e2e8f0",
//             justifyContent: "space-between",
//             alignItems: "center",
//             height:"45px",
//             mb: 2,
//           }}
//         >
//           <Typography sx={{ fontWeight: 600, fontSize: "14px", p: 2 }}>
//             Item Table
//           </Typography>
//           <Button
//             variant="text"
//             startIcon={<CheckCircleOutlineIcon sx={{ color: "#3b82f6" }} />}
//             sx={{
//               color: "#3b82f6",
//               textTransform: "none",
//               fontWeight: 400,
//               fontSize: "13px",
//               p: 2,
//             }}
//           >
//             Bulk Actions
//           </Button>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             height:"40px",
//             alignItems:"center",
//             borderBottom: "1px solid #E2E8F0",
//             "& > div:not(:last-child)": { borderRight: ".5px solid #E2E8F0" },
//             mt: -1.5,
//           }}
//         >
//           <Box
//             sx={{
//               flex: 4,
//               p: 2,
//               fontSize: "11px",
//               fontWeight: 600,
//               color: "#475569",
//             }}
//           >
//             ITEM DETAILS
//           </Box>
//           <Box
//             sx={{
//               flex: 1,
//               p: 2,
//               fontSize: "11px",
//               fontWeight: 600,
//               color: "#475569",
//               textAlign: "center",
//             }}
//           >
//             QUANTITY
//           </Box>
//           <Box
//             sx={{
//               flex: 1,
//               p: 2,
//               fontSize: "11px",
//               fontWeight: 600,
//               color: "#475569",
//               textAlign: "center",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             RATE
//             <Box
//               component="span"
//               sx={{
//                 display: "inline-flex",
//                 ml: 0.5,
//                 border: "1px solid #CBD5E1",
//                 p: 0.2,
//                 borderRadius: 0.5,
//                 fontSize: "11px",
//                 lineHeight: 1,
//               }}
//             >
//               ₹
//             </Box>
//           </Box>
//           <Box
//             sx={{
//               flex: 1,
//               p: 2,
//               fontSize: "11px",
//               fontWeight: 600,
//               color: "#475569",
//               textAlign: "center",
//             }}
//           >
//             AMOUNT
//           </Box>
//           <Box sx={{ width: "40px" }}></Box>
//         </Box>

//         {/* Table Rows */}
//         {formik.values.line_items.map((item, index) => (
//           <InvoiceRow
//             key={index}
//             item={item}
//             index={index}
//             canDelete={
//               formik.values.line_items.length > 1 ||
//               index === formik.values.line_items.length - 1
//             }
//           />
//         ))}
//       </Box>

//       <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
//         {/* Left Column - Buttons and Notes */}
//         <Box
//           sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}
//         >
//           {/* Buttons Row */}
//           <Box sx={{ display: "flex" }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 bgcolor: "#f0f4ff",
//                 borderRadius: "7px",
//                 position: "relative",
//               }}
//             >
//               <Button
//                 variant="text"
//                 startIcon={<AddCircleOutlinedIcon sx={{ color: "#3b82f6" }} />}
//                 onClick={() => addNewRow()}
//                 sx={{
//                   color: "black",
//                   textTransform: "none",
//                   fontWeight: 400,
//                 }}
//               >
//                 Add New Row
//               </Button>
//               <IconButton
//                 size="small"
//                 sx={{
//                   ml: -1,
//                 }}
//               >
//                 <KeyboardArrowDownIcon
//                   sx={{ color: "#3b82f6", fontSize: "18px" }}
//                 />
//               </IconButton>
//             </Box>
//             {/* Button to open the popup */}
//             <Button
//               variant="text"
//               startIcon={<AddCircleOutlinedIcon sx={{ color: "#3b82f6" }} />}
//               sx={{
//                 color: "black",
//                 textTransform: "none",
//                 ml: 2,
//                 fontWeight: 400,
//                 bgcolor: "#f0f4ff",
//                 borderRadius: "7px",
//                 "&:hover": { bgcolor: "#e0e7ff" },
//               }}
//               onClick={() => setOpen(true)} // Open popup on click
//             >
//               Add Items in Bulk
//             </Button>
//             {/* Render the popup conditionally */}
//             {open && (
//               <AddBulkItems
//                 open={open}
//                 onClose={() => setOpen(false)}
//                 itemList={allItems}
//                 formik={formik}
//               />
//             )}
//           </Box>
//           {/* Customer Notes Section */}
//           <Box sx={{ flex: 1 }}>
//             <Typography sx={{ mb: 1, fontSize: "13px" }}>
//               Customer Notes
//             </Typography>
//             <TextareaAutosize
//               id="customerNotes"
//               placeholder="Looking forward for your business."
//               minRows={3}
//               // value={customerNotes}
//               onChange={(e) => setCustomerNotes(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 border: "1px solid #ccc",
//                 borderRadius: "4px",
//                 fontFamily: "inherit",
//                 fontSize: "13px",
//                 backgroundColor: "white",
//                 minWidth: "358px",
//                 maxWidth: "360px",
//                 maxHeight: "350px",
//               }}
//             />
//             {/* <FormControlLabel
//               control={
//                 <Checkbox
//                   size="small"
//                   checked={useForAllCustomers}
//                   onChange={(e) => setUseForAllCustomers(e.target.checked)}
//                   sx={{
//                     color: "#3b82f6",
//                     padding: "4px",

//                     "&.Mui-checked": { color: "#3b82f6" },
//                   }}
//                 />
//               }
//               label={
//                 <Typography variant="body2" sx={{fontSize:"13px"}}>
//                   Use this in future for all quotes of all customers.
//                 </Typography>
//               }
//             /> */}
//           </Box>
//         </Box>
//         {/* Right Column - Summary Section */}
//         {/* Right Column - Summary Section */}
//         <Box sx={{ width: "55%", bgcolor: "#f1f5f9", p: 3, borderRadius: 1 }}>
//           {/* Sub Total */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//               Sub Total
//             </Typography>
//             <Typography variant="body2">{formik.values.sub_total}</Typography>
//           </Box>
//           {/* Discount */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <Typography variant="body2">Discount</Typography>
//             <Grid
//               item
//               sx={{
//                 Width: "50%",
//                 bgcolor: "white",
//                 borderRadius: "7px",
//               }}
//             >
//               <TextField
//                 type={selectedSymbol === "%" ? "number" : "text"}
//                 placeholder="0"
//                 value={formik.values.discount_percent}
//                 onChange={handleDiscountChange}
//                 variant="outlined"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         size="small"
//                         // onClick={handleSymbolMenuOpen}
//                         sx={{
//                           bgcolor: "action.hover",
//                           px: 1,
//                           borderLeft: "1px solid",
//                           borderColor: "divider",
//                           height: "100%",
//                           borderRadius: 0,
//                         }}
//                       >
//                         {selectedSymbol}
//                         {/* <ArrowDropDown fontSize="small" /> */}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                   sx: {
//                     pr: 0,
//                     height: 36,
//                     borderRadius: "7px", // Added border radius
//                     "& input": {
//                       textAlign: "right",
//                       pr: 1,
//                       fontSize: "0.875rem",
//                       py: 0.5,
//                       width: "105px", // Constrain input width
//                     },
//                   },
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     pl: 1,
//                     height: 36,
//                     borderRadius: "7px", // Ensure radius applies
//                     overflow: "hidden", // Keep radius intact
//                   },
//                 }}
//               />
//               <Menu
//                 anchorEl={symbolAnchorEl}
//                 open={Boolean(symbolAnchorEl)}
//                 onClose={handleSymbolMenuClose}
//               >
//                 <MenuItem onClick={() => handleSymbolSelect("%")}>
//                   % Percentage
//                 </MenuItem>
//                 <MenuItem onClick={() => handleSymbolSelect("₹")}>
//                   ₹ Rupee
//                 </MenuItem>
//               </Menu>
//             </Grid>
//             <Typography variant="body2">{calculateDiscount()}</Typography>
//           </Box>

//           {!isChallan && (
//             (formik.values.tax_type === "TDS" ? (
//               <>
//                 {/* TDS/TCS Section */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 2,
//                     ml:0.5
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center",fontSize:"13px" }}>
//                     <RadioGroup
//                       row
//                       name="tax_type"
//                       value={formik.values.tax_type || "TDS"}
//                       onChange={handleTaxMethodChange}
//                       sx={{fontSize:"12px"}}
//                     >
//                       <FormControlLabel
//                         value="TDS"
//                         control={
//                           <Radio
//                             size="small"
//                             sx={{
//                               color: "#3b82f6",
//                               padding: "4px",
//                               "&.Mui-checked": { color: "#3b82f6" },
//                             }}
//                           />
//                         }
//                         label={<Typography variant="body2" sx={{fontSize:"13px"}}>TDS</Typography>}
//                         sx={{ mr: 2 }}
//                       />
//                       <FormControlLabel
//                         value="TCS"
//                         control={
//                           <Radio
//                             size="small"
//                             sx={{
//                               color: "#3b82f6",
//                               padding: "4px",
//                               "&.Mui-checked": { color: "#3b82f6" },
//                             }}
//                           />
//                         }
//                         label={<Typography variant="body2" sx={{fontSize:"13px"}}>TCS</Typography>}
//                       />
//                     </RadioGroup>
//                     <Box sx={{ display: "flex", alignItems: "center", ml: 8 }}>
//                       <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
//                         <Select
//                           value={formik.values.tds_option || ""}
//                           onChange={handleTdsOptionChange}
//                           displayEmpty
//                           IconComponent={KeyboardArrowDownIcon}
//                           sx={{
//                             height: "35px",
//                             fontSize: "13px",
//                             width: "180px",
//                             backgroundColor: "white",
//                             '& .MuiSelect-select': {
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '8px',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                             }
//                           }}
//                           MenuProps={{
//                             PaperProps: {
//                               sx: {
//                                 maxHeight: 300,
//                                 width: "350px",
//                                 fontSize: "13px",
//                                 '& .MuiMenuItem-root': {
//                                   padding: '8px 16px',
//                                   fontSize: "13px",
//                                   '&:hover': {
//                                     backgroundColor: '#f0f4ff'
//                                   }
//                                 }
//                               }
//                             },
//                             anchorOrigin: {
//                               vertical: 'bottom',
//                               horizontal: 'left',
//                             },
//                             transformOrigin: {
//                               vertical: 'top',
//                               horizontal: 'left',
//                             }
//                           }}
//                           inputProps={{
//                             ref: tdsSelectRef,
//                             style: {
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                               width: '100%',
//                               display: 'block',
//                             },
//                           }}
//                         >
//                           <MenuItem value="" disabled sx={{color:"#838195"}}>Select a Tax</MenuItem>
//                           {(formik.values.tax_type === 'TDS' ? tdsOptions : tcsOptions).map((option) => (
//                             <MenuItem key={option.id} value={option.id}>
//                               {option.name} [{option.rate}%]
//                             </MenuItem>
//                           ))}
//                           <Divider />
//                           <MenuItem
//                             onClick={handleManageTaxClick}
//                             sx={{
//                               color: "#3b82f6",
//                               fontSize:"13px",

//                               "&:hover": {
//                                 backgroundColor: "transparent",
//                               },
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                               }}
//                             >
//                               <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
//                               Manage {formik.values.tax_type}
//                             </Box>
//                           </MenuItem>
//                         </Select>
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             color: '#444',
//                             mt: 0.5,
//                             ml: 0.5,
//                             fontSize: '12px',
//                             maxWidth: '180px',
//                             overflow: 'hidden',
//                             textOverflow: 'ellipsis',
//                             whiteSpace: 'nowrap',
//                             display: 'block'
//                           }}
//                         >
//                           {getTdsFullLabel()}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Typography variant="body2" sx={{fontSize:"13px"}}>
//                       {formik.values.tax_type === "TDS" ? "- " : " "}
//                       {formik.values.tax_total_formatted}
//                     </Typography>
//                   </Box>
//                   {/* Adjustment Section */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       mb: 2,
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                           borderColor: "#cbd5e1",
//                           color: "#475569",
//                           bgcolor: "white",
//                           textTransform: "none",
//                           borderStyle: "dashed",
//                           height: "36px",
//                           px: 2,
//                           borderRadius: "7px",
//                           maxWidth: 150,
//                           fontSize:"13px"
//                         }}
//                       >
//                         Adjustment
//                       </Button>
//                     </Box>
//                     <TextField
//                       size="small"
//                       value={formik.values.adjustment || "0"}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0;
//                         formik.setFieldValue("adjustment", value);
//                         calculateTotals();
//                       }}
//                       sx={{
//                         width: "135px",
//                         ml: 2.3,
//                         "& .MuiOutlinedInput-root": {
//                           bgcolor: "white",
//                           height: "36px",
//                           fontSize: "13px !important",
//                           borderRadius: "4px",
//                         },
//                       }}
//                     />
//                     <IconButton size="small" sx={{}}>
//                       <HelpOutlineIcon
//                         fontSize="small"
//                         sx={{ color: "#94a3b8" }}
//                       />
//                     </IconButton>
//                     <Typography variant="body2" sx={{fontSize:"13px"}}>
//                       {(formik.values.adjustment || 0).toFixed(2)}
//                     </Typography>
//                   </Box>
//                 </>
//               ) : (
//                 <>
//                   {/* Adjustment Section */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       mb: 2,
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                           borderColor: "#cbd5e1",
//                           color: "#475569",
//                           bgcolor: "white",
//                           textTransform: "none",
//                           borderStyle: "dashed",
//                           height: "36px",
//                           px: 2,
//                           borderRadius: "7px",
//                           maxWidth: 150,
//                         }}
//                       >
//                         Adjustment
//                       </Button>
//                     </Box>
//                     <TextField
//                       size="small"
//                       value={formik.values.adjustment || "0"}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0;
//                         formik.setFieldValue("adjustment", value);
//                         calculateTotals();
//                       }}
//                       sx={{
//                         width: "120px",
//                         ml: 2.3,
//                         "& .MuiOutlinedInput-root": {
//                           bgcolor: "white",
//                           height: "36px",
//                           fontSize: "13px !important",
//                           borderRadius: "7px",
//                         },
//                       }}
//                     />
//                     <IconButton size="small" sx={{ ml: 0.5 }}>
//                       <HelpOutlineIcon
//                         fontSize="small"
//                         sx={{ color: "#94a3b8" }}
//                       />
//                     </IconButton>
//                     <Typography variant="body2">
//                       {(formik.values.adjustment || 0).toFixed(2)}
//                     </Typography>
//                   </Box>
//                   {/* TDS/TCS Section */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       mb: 2,
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <RadioGroup
//                         row
//                         name="tax_type"
//                         value={formik.values.tax_type || "TDS"}
//                         onChange={handleTaxMethodChange}
//                       >
//                         <FormControlLabel
//                           value="TDS"
//                           control={
//                             <Radio
//                               size="small"
//                               sx={{
//                                 color: "#3b82f6",
//                                 padding: "4px",
//                                 "&.Mui-checked": { color: "#3b82f6" },
//                               }}
//                             />
//                           }
//                           label={<Typography variant="body2">TDS</Typography>}
//                           sx={{ mr: 2 }}
//                         />
//                         <FormControlLabel
//                           value="TCS"
//                           control={
//                             <Radio
//                               size="small"
//                               sx={{
//                                 color: "#3b82f6",
//                                 padding: "4px",
//                                 "&.Mui-checked": { color: "#3b82f6" },
//                               }}
//                             />
//                           }
//                           label={<Typography variant="body2">TCS</Typography>}
//                         />
//                       </RadioGroup>
//                       <Box sx={{ display: "flex", alignItems: "center", ml: 8 }}>
//                         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
//                           <Select
//                             value={formik.values.tds_option || ""}
//                             onChange={handleTdsOptionChange}
//                             displayEmpty
//                             IconComponent={KeyboardArrowDownIcon}
//                             sx={{
//                               height: "35px",
//                               fontSize: "13px",
//                               width: "180px",
//                               backgroundColor: "white",
//                               '& .MuiSelect-select': {
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '8px',
//                                 overflow: 'hidden',
//                                 textOverflow: 'ellipsis',
//                                 whiteSpace: 'nowrap',
//                               }
//                             }}
//                             MenuProps={{
//                               PaperProps: {
//                                 sx: {
//                                   maxHeight: 300,
//                                   width: "350px",
//                                   fontSize: "13px",
//                                   '& .MuiMenuItem-root': {
//                                     padding: '8px 16px',
//                                     fontSize: "13px",
//                                     '&:hover': {
//                                       backgroundColor: '#f0f4ff'
//                                     }
//                                   }
//                                 }
//                               },
//                               anchorOrigin: {
//                                 vertical: 'bottom',
//                                 horizontal: 'left',
//                               },
//                               transformOrigin: {
//                                 vertical: 'top',
//                                 horizontal: 'left',
//                               }
//                             }}
//                             inputProps={{
//                               ref: tdsSelectRef,
//                               style: {
//                                 overflow: 'hidden',
//                                 textOverflow: 'ellipsis',
//                                 whiteSpace: 'nowrap',
//                                 width: '100%',
//                                 display: 'block',
//                               },
//                             }}
//                           >
//                             <MenuItem value="" disabled>Select {formik.values.tax_type}</MenuItem>
//                             {(formik.values.tax_type === "TDS"
//                               ? tdsOptions
//                               : tcsOptions
//                             ).map((option) => (
//                               <MenuItem key={option.id} value={option.id}>
//                                 {option.name} [{option.rate}%]
//                               </MenuItem>
//                             ))}
//                             <Divider />
//                             <MenuItem
//                               onClick={handleManageTaxClick}
//                               sx={{
//                                 color: "#3b82f6",
//                                 "&:hover": {
//                                   backgroundColor: "transparent",
//                                 },
//                               }}
//                             >
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: 1,
//                                 }}
//                               >
//                                 <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
//                                 Manage {formik.values.tax_type}
//                               </Box>
//                             </MenuItem>
//                           </Select>
//                           <Typography
//                             variant="caption"
//                             sx={{
//                               color: '#444',
//                               mt: 0.5,
//                               ml: 0.5,
//                               fontSize: '12px',
//                               maxWidth: '180px',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                               display: 'block'
//                             }}
//                           >
//                             {getTdsFullLabel()}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Typography variant="body2">
//                         {formik.values.tax_type === "TDS" ? "- " : "+ "}
//                         {formik.values.tax_total_formatted}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </>
//               ))}

//           {isChallan && (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <TextField
//                   variant="outlined"
//                   size="small"
//                   value={formik.values.adjustment_description || ""}
//                   onChange={(e) => {
//                     const value = e.target.value || "";
//                     formik.setFieldValue("adjustment_description", value);
//                   }}
//                   sx={{
//                     color: "#475569",
//                     bgcolor: "white",
//                     border: "none",
//                     fontSize: "12px !important",
//                     textTransform: "none",
//                     height: "36px",
//                     "& .MuiOutlinedInput-root": {
//                       bgcolor: "white",
//                       fontSize: "13px !important",
//                       border: "1px dashed #cbd5e1",
//                       height: "36px",
//                       borderRadius: "7px",
//                     },
//                     "& .MuiOutlinedInput-notchedOutline": {
//                       border: "0 !important",
//                     },
//                     "&:hover": {
//                       border: "none",
//                     },
//                     borderRadius: "7px",
//                     maxWidth: 150,
//                   }}
//                 >
//                   Adjustment
//                 </TextField>
//               </Box>
//               <TextField
//                 size="small"
//                 value={formik.values.adjustment || "0"}
//                 onChange={(e) => {
//                   const value = parseFloat(e.target.value) || 0;
//                   formik.setFieldValue("adjustment", value);
//                   calculateTotals();
//                 }}
//                 sx={{
//                   width: "120px",
//                   ml: 2.3,
//                   "& .MuiOutlinedInput-root": {
//                     bgcolor: "white",
//                     height: "36px",
//                     fontSize: "13px !important",
//                     borderRadius: "7px",
//                   },
//                 }}
//               />
//               <IconButton size="small" sx={{}}>
//                 <HelpOutlineIcon fontSize="small" sx={{ color: "#94a3b8" }} />
//               </IconButton>
//               <Typography variant="body2">
//                 {(formik.values.adjustment || 0).toFixed(2)}
//               </Typography>
//             </Box>
//           )}

//           <Divider sx={{ my: 2 }} />

//           {/* Total */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Typography sx={{ fontWeight: 600 , fontSize:"16px" }}>Total ( ₹ )</Typography>
//             <Typography sx={{ fontWeight: 600 }}>
//               {formik.values.total_amount?.toFixed(2) ||
//                 formik.values.total?.toFixed(2)}
//             </Typography>
//           </Box>
//         </Box>

//         {/* TCS Popover */}
//         <Popover
//           open={isTcsPopoverOpen}
//           anchorEl={tcsPopoverAnchorEl}
//           onClose={() => {
//             setIsTcsPopoverOpen(false);
//             setTcsPopoverAnchorEl(null);
//           }}
//           anchorOrigin={{
//             vertical: "bottom",
//             horizontal: "left",
//           }}
//           transformOrigin={{
//             vertical: "top",
//             horizontal: "left",
//           }}
//         >
//           <TCStax />
//         </Popover>

//         <Dialog
//           open={openTaxModal}
//           onClose={() => setOpenTaxModal(false)}
//           maxWidth="md"
//           fullWidth
//         >
//           <DialogContent>
//             <TaxModal
//               onClose={() => setOpenTaxModal(false)}
//               taxType={formik.values.tax_type}
//             />
//           </DialogContent>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// }

