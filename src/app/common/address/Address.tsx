// "use client";

// import React from "react";
// import {
//   Box,
//   Typography,
//   StyledTextField,
//   Grid,
//   Button,
//   MenuItem,
//   FormControl,
//   Select,
//   FormHelperText,
// } from "@mui/material";

// // Sample countries data
// const countries = [
//   { code: "US", name: "United States" },
//   { code: "CA", name: "Canada" },
//   { code: "UK", name: "United Kingdom" },
//   { code: "AU", name: "Australia" },
// ];

// const AddressFormClient = ({ formik }: any) => {
//   const copyBillingToShipping = () => {
//     // Copy billing address data to shipping address
//     formik.setFieldValue("shippingAttention", formik.values.billing_address.attention);
//     formik.setFieldValue("shippingCountry", formik.values.billing_address.country);
//     formik.setFieldValue("shippingAddress1", formik.values.billing_address.street1);
//     formik.setFieldValue("shippingAddress2", formik.values.billing_address.street2);
//     formik.setFieldValue("shippingCity", formik.values.billing_address.city);
//     formik.setFieldValue("shippingState", formik.values.billing_address.state);
//     formik.setFieldValue("shippingPinCode", formik.values.billing_address.zip);
//     formik.setFieldValue("shippingPhone", formik.values.billing_address.phone);
//     formik.setFieldValue("shippingFax", formik.values.billing_address.fax);
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 1500, margin: "0 auto" }}>
//       <Grid container spacing={10}>
//         {/* Billing Address Section */}
//         <Grid item xs={12} md={6}>
//           <Typography
//             variant="h6"
//             component="h2"
//             sx={{
//               mb: 4,
//               fontWeight: "" as const,
//               color: "#000",
//             }}
//           >
//             Billing Address
//           </Typography>

//           {/* Billing Fields */}
//           <Grid container spacing={2}>
//             {/* Attention */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingAttention"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Attention
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billingAttention"
//                 name="billing_address.attention"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.attention}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billingAttention &&
//                   Boolean((formik.errors.billingAttention as any))
//                 }
//                 helperText={
//                   formik.touched.billingAttention &&
//                   (formik.errors.billingAttention as any)
//                 }
//               />
//             </Grid>

//             {/* Country/Region */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingCountry"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.billingCountry as any) &&
//                     formik.touched.billingCountry
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 Country/Region
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.billingCountry &&
//                   Boolean((formik.errors.billingCountry as any))
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="billing_address.country"
//                   name="billing_address.country"
//                   displayEmpty
//                   value={formik.values.billing_address.country}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">Select</Typography>
//                       );
//                     }
//                     const country = countries.find((c) => c.code === selected);
//                     return country ? country.name : selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select</em>
//                   </MenuItem>
//                   {countries.map((country) => (
//                     <MenuItem key={country.code} value={country.code}>
//                       {country.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {formik.touched.billingCountry &&
//                   (formik.errors.billingCountry as any) && (
//                     <FormHelperText>
//                       {(formik.errors.billingCountry as any)}
//                     </FormHelperText>
//                   )}
//               </FormControl>
//             </Grid>

//             {/* Address */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingAddress1"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Address
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billing_address.street1"
//                 name="billing_address.street1"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Street 1"
//                 size="small"
//                 value={formik.values.billing_address.street1}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billingAddress1 &&
//                   Boolean((formik.errors.billingAddress1 as any))
//                 }
//                 helperText={
//                   formik.touched.billingAddress1 &&
//                   (formik.errors.billingAddress1 as any)
//                 }
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 id="billing_address.street1"
//                 name="billing_address.street1"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Street 2"
//                 size="small"
//                 value={formik.values.billing_address.street1}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billingAddress2 &&
//                   Boolean((formik.errors.billingAddress2 as any))
//                 }
//                 helperText={
//                   formik.touched.billingAddress2 &&
//                   (formik.errors.billingAddress2 as any)
//                 }
//               />
//             </Grid>

//             {/* City */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingCity"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 City
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billing_address.city"
//                 name="billing_address.city"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.city}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billingCity &&
//                   Boolean((formik.errors.billingCity as any))
//                 }
//                 helperText={
//                   formik.touched.billingCity && (formik.errors.billingCity as any)
//                 }
//               />
//             </Grid>

//             {/* State */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingState"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.billingState as any) && formik.touched.billingState
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 State
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.billingState &&
//                   Boolean((formik.errors.billingState as any))
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="billing_address.state"
//                   name="billing_address.state"
//                   displayEmpty
//                   value={formik.values.billing_address.state}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">
//                           Select or type to add
//                         </Typography>
//                       );
//                     }
//                     return selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select or type to add</em>
//                   </MenuItem>
//                   <MenuItem value="AL">Alabama</MenuItem>
//                   <MenuItem value="AK">Alaska</MenuItem>
//                   <MenuItem value="AZ">Arizona</MenuItem>
//                 </Select>
//                 {formik.touched.billingState && (formik.errors.billingState as any) && (
//                   <FormHelperText>{(formik.errors.billingState as any)}</FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>

//             {/* Pin Code */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingPinCode"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Pin Code
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billing_address.zip"
//                 name="billing_address.zip"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.zip}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billingPinCode &&
//                   Boolean((formik.errors.billingPinCode as any))
//                 }
//                 helperText={
//                   formik.touched.billingPinCode && (formik.errors.billingPinCode as any)
//                 }
//               />
//             </Grid>

//             {/* Phone */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingPhone"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Phone
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billing_address.phone"
//                 name="billing_address.phone"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.phone}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billingPhone &&
//                   Boolean((formik.errors.billingPhone as any))
//                 }
//                 helperText={
//                   formik.touched.billingPhone && (formik.errors.billingPhone as any)
//                 }
//               />
//             </Grid>

//             {/* Fax Number */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingFax"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Fax Number
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billing_address.fax"
//                 name="billing_address.fax"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.fax}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billingFax && Boolean((formik.errors.billingFax as any))
//                 }
//                 helperText={
//                   formik.touched.billingFax && (formik.errors.billingFax as any)
//                 }
//               />
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Shipping Address Section */}
//         <Grid item xs={12} md={6}>

//           <Box
//             sx={{
//               display: "flex" as const,
//               alignItems: "center" as const,
//               justifyContent: "space-between" as const,
//               mb: 2,
//             }}
//           >
//             <Typography
//               variant="h6"
//               component="h2"
//               sx={{
//                 fontWeight: "" as const,
//                 color: "#000",
//                 marginTop: "-15px",
//               }}
//             >
//               Shipping Address
//             </Typography>
//             <Button
//               variant={"text" as any}
//               color="primary"
//               startIcon={<span style={{ color: "#2196f3" }}>→</span>}
//               sx={{ fontSize: "0.75rem" }}
//               onClick={copyBillingToShipping}
//             >
//               Copy billing address
//             </Button>
//           </Box>

//           {/* Shipping Fields */}
//           <Grid container spacing={2}>
//             {/* Attention */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingAttention"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Attention
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shipping_address.attention"
//                 name="shipping_address.attention"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.attention}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shippingAttention &&
//                   Boolean((formik.errors.shippingAttention as any))
//                 }
//                 helperText={
//                   formik.touched.shippingAttention &&
//                   (formik.errors.shippingAttention as any)
//                 }
//               />
//             </Grid>

//             {/* Country/Region */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingCountry"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.shippingCountry as any) &&
//                     formik.touched.shippingCountry
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 Country/Region
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.shippingCountry &&
//                   Boolean((formik.errors.shippingCountry as any))
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="shipping_address.country"
//                   name="shipping_address.country"
//                   displayEmpty
//                   value={formik.values.shipping_address.country}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">Select</Typography>
//                       );
//                     }
//                     const country = countries.find((c) => c.code === selected);
//                     return country ? country.name : selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select</em>
//                   </MenuItem>
//                   {countries.map((country) => (
//                     <MenuItem key={country.code} value={country.code}>
//                       {country.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {formik.touched.shippingCountry &&
//                   (formik.errors.shippingCountry as any) && (
//                     <FormHelperText>
//                       {(formik.errors.shippingCountry as any)}
//                     </FormHelperText>
//                   )}
//               </FormControl>
//             </Grid>

//             {/* Address */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingAddress1"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Address
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shipping_address.street1"
//                 name="shipping_address.street1"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Street 1"
//                 size="small"
//                 value={formik.values.shipping_address.street1}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shippingAddress1 &&
//                   Boolean((formik.errors.shippingAddress1 as any))
//                 }
//                 helperText={
//                   formik.touched.shippingAddress1 &&
//                   (formik.errors.shippingAddress1 as any)
//                 }
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 id="shipping_address.street2"
//                 name="shipping_address.street2"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Street 2"
//                 size="small"
//                 value={formik.values.shipping_address.street2}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shippingAddress2 &&
//                   Boolean((formik.errors.shippingAddress2 as any))
//                 }
//                 helperText={
//                   formik.touched.shippingAddress2 &&
//                   (formik.errors.shippingAddress2 as any)
//                 }
//               />
//             </Grid>

//             {/* City */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingCity"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 City
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shipping_address.city"
//                 name="shipping_address.city"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.city}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shippingCity &&
//                   Boolean((formik.errors.shippingCity as any))
//                 }
//                 helperText={
//                   formik.touched.shippingCity && (formik.errors.shippingCity as any)
//                 }
//               />
//             </Grid>

//             {/* State */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingState"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.shippingState as any) && formik.touched.shippingState
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 State
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.shippingState &&
//                   Boolean((formik.errors.shippingState as any))
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="shipping_address.state"
//                   name="shipping_address.state"
//                   displayEmpty
//                   value={formik.values.shipping_address.state}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">
//                           Select or type to add
//                         </Typography>
//                       );
//                     }
//                     return selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select or type to add</em>
//                   </MenuItem>
//                   <MenuItem value="AL">Alabama</MenuItem>
//                   <MenuItem value="AK">Alaska</MenuItem>
//                   <MenuItem value="AZ">Arizona</MenuItem>
//                 </Select>
//                 {formik.touched.shippingState &&
//                   (formik.errors.shippingState as any) && (
//                     <FormHelperText>
//                       {(formik.errors.shippingState as any)}
//                     </FormHelperText>
//                   )}
//               </FormControl>
//             </Grid>

//             {/* Pin Code */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingPinCode"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Pin Code
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shipping_address.zip"
//                 name="shipping_address.zip"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.zip}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shippingPinCode &&
//                   Boolean((formik.errors.shippingPinCode as any))
//                 }
//                 helperText={
//                   formik.touched.shippingPinCode &&
//                   (formik.errors.shippingPinCode as any)
//                 }
//               />
//             </Grid>

//             {/* Phone */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingPhone"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Phone
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shipping_address.phone"
//                 name="shipping_address.phone"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.phone}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shippingPhone &&
//                   Boolean((formik.errors.shippingPhone as any))
//                 }
//                 helperText={
//                   formik.touched.shippingPhone && (formik.errors.shippingPhone as any)
//                 }
//               />
//             </Grid>

//             {/* Fax Number */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingFax"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Fax Number
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shipping_address.fax"
//                 name="shipping_address.fax"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.fax}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shippingFax &&
//                   Boolean((formik.errors.shippingFax as any))
//                 }
//                 helperText={
//                   formik.touched.shippingFax && (formik.errors.shippingFax as any)
//                 }
//               />
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default AddressFormClient;

// "use client";

// import React from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Grid,
//   Button,
//   MenuItem,
//   FormControl,
//   Select,
//   FormHelperText,
//   TextareaAutosize,
// } from "@mui/material";
// import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';

// // Sample countries data
// const countries = [
//   { code: "US", name: "United States" },
//   { code: "CA", name: "Canada" },
//   { code: "UK", name: "United Kingdom" },
//   { code: "AU", name: "Australia" },
// ];

// const AddressFormClient = ({ formik }: any) => {
//   const copyBillingToShipping = () => {
//     // Copy billing address data to shipping address using the correct field structure
//     formik.setFieldValue("shipping_address.attention", formik.values.billing_address.attention);
//     formik.setFieldValue("shipping_address.country", formik.values.billing_address.country);
//     formik.setFieldValue("shipping_address.country_code", formik.values.billing_address.country_code);
//     formik.setFieldValue("shipping_address.address", formik.values.billing_address.address);
//     formik.setFieldValue("shipping_address.street2", formik.values.billing_address.street2);
//     formik.setFieldValue("shipping_address.city", formik.values.billing_address.city);
//     formik.setFieldValue("shipping_address.state", formik.values.billing_address.state);
//     formik.setFieldValue("shipping_address.state_code", formik.values.billing_address.state_code);
//     formik.setFieldValue("shipping_address.zip", formik.values.billing_address.zip);
//     formik.setFieldValue("shipping_address.phone", formik.values.billing_address.phone);
//     formik.setFieldValue("shipping_address.fax", formik.values.billing_address.fax);
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 1500, margin: "0 auto" }}>
//       <Grid container spacing={10}>
//         {/* Billing Address Section */}
//         <Grid item xs={12} md={6}>
//           <Typography
//             variant="h6"
//             component="h2"
//             sx={{
//               mb: 4,
//               fontWeight: "600" as const,
//               fontSize:"15px",
//               color: "#000",
//             }}
//           >
//             Billing Address
//           </Typography>

//           {/* Billing Fields */}
//           <Grid container spacing={2}>
//             {/* Attention */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingAttention"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Attention
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billingAttention"
//                 name="billing_address.attention"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.attention || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billing_address?.attention &&
//                   Boolean((formik.errors.billing_address as any)?.attention)
//                 }
//                 helperText={
//                   formik.touched.billing_address?.attention &&
//                   (formik.errors.billing_address as any)?.attention
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//             </Grid>

//             {/* Country/Region */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingCountry"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.billing_address as any)?.country &&
//                     formik.touched.billing_address?.country
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 Country/Region
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.billing_address?.country &&
//                   Boolean((formik.errors.billing_address as any)?.country)
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="billingCountry"
//                   name="billing_address.country"
//                   displayEmpty
//                   size="small"

//                   value={formik.values.billing_address.country || ""}
//                   onChange={(e) => {
//                     formik.handleChange(e);
//                     // Find country code and set it
//                     const selectedCountry = countries.find(c => c.code === (e.target as any).value);
//                     if (selectedCountry) {
//                       formik.setFieldValue("billing_address.country_code", selectedCountry.code);
//                     }
//                   }}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">Select</Typography>
//                       );
//                     }
//                     const country = countries.find((c) => c.code === selected);
//                     return country ? country.name : selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select</em>
//                   </MenuItem>
//                   {countries.map((country) => (
//                     <MenuItem key={country.code} value={country.code}>
//                       {country.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {formik.touched.billing_address?.country &&
//                   (formik.errors.billing_address as any)?.country && (
//                     <FormHelperText>
//                       {formik.errors.billing_address.country}
//                     </FormHelperText>
//                   )}
//               </FormControl>
//             </Grid>

//             {/* Address */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingAddress"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Address
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billingAddress"
//                 name="billing_address.address"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Street 1"
//                 size="small"
//                 value={formik.values.billing_address.address || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billing_address?.address &&
//                   Boolean((formik.errors.billing_address as any)?.address)
//                 }
//                 helperText={
//                   formik.touched.billing_address?.address &&
//                   (formik.errors.billing_address as any)?.address
//                 }
//                 sx={{ mb: 2 }}
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//               <TextField
//                 id="billingStreet2"
//                 name="billing_address.street2"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Street 2"
//                 size="small"
//                 value={formik.values.billing_address.street2 || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billing_address?.street2 &&
//                   Boolean((formik.errors.billing_address as any)?.street2)
//                 }
//                 helperText={
//                   formik.touched.billing_address?.street2 &&
//                   (formik.errors.billing_address as any)?.street2
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//             </Grid>

//             {/* City */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingCity"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 City
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billingCity"
//                 name="billing_address.city"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.city || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billing_address?.city &&
//                   Boolean((formik.errors.billing_address as any)?.city)
//                 }
//                 helperText={
//                   formik.touched.billing_address?.city &&
//                   (formik.errors.billing_address as any)?.city
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//             </Grid>

//             {/* State */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingState"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.billing_address as any)?.state &&
//                     formik.touched.billing_address?.state
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 State
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.billing_address?.state &&
//                   Boolean((formik.errors.billing_address as any)?.state)
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="billingState"
//                   name="billing_address.state"
//                   displayEmpty
//                   size="small"
//                   InputLabelProps={{ sx: { fontSize: "13px" } }}
//                   InputProps={{ sx: { fontSize: "13px" } }}
//                   value={formik.values.billing_address.state || ""}
//                   onChange={(e) => {
//                     formik.handleChange(e);
//                     // Set state_code to the same value as state
//                     formik.setFieldValue("billing_address.state_code", (e.target as any).value);
//                   }}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">
//                           Select or type to add
//                         </Typography>
//                       );
//                     }
//                     return selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select or type to add</em>
//                   </MenuItem>
//                   <MenuItem value="AL">Alabama</MenuItem>
//                   <MenuItem value="AK">Alaska</MenuItem>
//                   <MenuItem value="AZ">Arizona</MenuItem>
//                 </Select>
//                 {formik.touched.billing_address?.state &&
//                   (formik.errors.billing_address as any)?.state && (
//                     <FormHelperText>
//                       {formik.errors.billing_address.state}
//                     </FormHelperText>
//                   )}
//               </FormControl>
//             </Grid>

//             {/* Pin Code */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingPinCode"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Pin Code
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billingPinCode"
//                 name="billing_address.zip"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.zip || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billing_address?.zip &&
//                   Boolean((formik.errors.billing_address as any)?.zip)
//                 }
//                 helperText={
//                   formik.touched.billing_address?.zip &&
//                   (formik.errors.billing_address as any)?.zip
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//             </Grid>

//             {/* Phone */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingPhone"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Phone
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billingPhone"
//                 name="billing_address.phone"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.phone || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billing_address?.phone &&
//                   Boolean((formik.errors.billing_address as any)?.phone)
//                 }
//                 helperText={
//                   formik.touched.billing_address?.phone &&
//                   (formik.errors.billing_address as any)?.phone
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//             </Grid>

//             {/* Fax Number */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="billingFax"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Fax Number
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="billingFax"
//                 name="billing_address.fax"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.billing_address.fax || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.billing_address?.fax &&
//                   Boolean((formik.errors.billing_address as any)?.fax)
//                 }
//                 helperText={
//                   formik.touched.billing_address?.fax &&
//                   (formik.errors.billing_address as any)?.fax
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Shipping Address Section */}
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               display: "flex" as const,
//               alignItems: "center" as const,
//               justifyContent: "space-between" as const,
//               mb: 2,
//             }}
//           >
//             <Typography
//               variant="h6"
//               component="h2"
//               sx={{
//                 mb: 2,
//                 fontWeight: "600" as const,
//                 fontSize:"15px",
//                 color: "#000",
//               }}
//             >
//               Shipping Address <span style= {{color:"#408dfb",fontSize: "14px"}}> (<SouthOutlinedIcon color="#408dfb" fontSize="10px" />  Copy billing address)</span>
//             </Typography>
//             {/* <Button
//               variant={"text" as any}
//               color="primary"
//               startIcon={<span style={{ color: "#2196f3" }}>→</span>}
//               sx={{ fontSize: "0.75rem" }}
//               onClick={copyBillingToShipping}
//             >

//             </Button> */}
//           </Box>

//           {/* Shipping Fields */}
//           <Grid container spacing={2}>
//             {/* Attention */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingAttention"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Attention
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shippingAttention"
//                 name="shipping_address.attention"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.attention || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shipping_address?.attention &&
//                   Boolean((formik.errors.shipping_address as any)?.attention)
//                 }
//                 helperText={
//                   formik.touched.shipping_address?.attention &&
//                   (formik.errors.shipping_address as any)?.attention
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//               />
//             </Grid>

//             {/* Country/Region */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingCountry"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.shipping_address as any)?.country &&
//                     formik.touched.shipping_address?.country
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 Country/Region
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.shipping_address?.country &&
//                   Boolean((formik.errors.shipping_address as any)?.country)
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="shippingCountry"
//                   name="shipping_address.country"
//                   displayEmpty
//                   size="small"
//                   InputLabelProps={{ sx: { fontSize: "13px" } }}
//                   InputProps={{ sx: { fontSize: "13px" } }}
//                   value={formik.values.shipping_address.country || ""}
//                   onChange={(e) => {
//                     formik.handleChange(e);
//                     // Find country code and set it
//                     const selectedCountry = countries.find(c => c.code === (e.target as any).value);
//                     if (selectedCountry) {
//                       formik.setFieldValue("shipping_address.country_code", selectedCountry.code);
//                     }
//                   }}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">Select</Typography>
//                       );
//                     }
//                     const country = countries.find((c) => c.code === selected);
//                     return country ? country.name : selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select</em>
//                   </MenuItem>
//                   {countries.map((country) => (
//                     <MenuItem key={country.code} value={country.code}>
//                       {country.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {formik.touched.shipping_address?.country &&
//                   (formik.errors.shipping_address as any)?.country && (
//                     <FormHelperText>
//                       {formik.errors.shipping_address.country}
//                     </FormHelperText>
//                   )}
//               </FormControl>
//             </Grid>

//             {/* Address */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingAddress"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Address
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shippingAddress"
//                 name="shipping_address.address"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Address"
//                 size="small"
//                 value={formik.values.shipping_address.address || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shipping_address?.address &&
//                   Boolean((formik.errors.shipping_address as any)?.address)
//                 }
//                 helperText={
//                   formik.touched.shipping_address?.address &&
//                   (formik.errors.shipping_address as any)?.address
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 id="shippingStreet2"
//                 name="shipping_address.street2"
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={2}
//                 placeholder="Street 2"
//                 size="small"
//                 value={formik.values.shipping_address.street2 || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shipping_address?.street2 &&
//                   Boolean((formik.errors.shipping_address as any)?.street2)
//                 }
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//                 helperText={
//                   formik.touched.shipping_address?.street2 &&
//                   (formik.errors.shipping_address as any)?.street2
//                 }
//               />
//             </Grid>

//             {/* City */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingCity"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 City
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shippingCity"
//                 name="shipping_address.city"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//                 value={formik.values.shipping_address.city || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shipping_address?.city &&
//                   Boolean((formik.errors.shipping_address as any)?.city)
//                 }
//                 helperText={
//                   formik.touched.shipping_address?.city &&
//                   (formik.errors.shipping_address as any)?.city
//                 }
//               />
//             </Grid>

//             {/* State */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingState"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                   color:
//                     (formik.errors.shipping_address as any)?.state &&
//                     formik.touched.shipping_address?.state
//                       ? "error.main"
//                       : "inherit",
//                 }}
//               >
//                 State
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <FormControl
//                 fullWidth
//                 error={
//                   formik.touched.shipping_address?.state &&
//                   Boolean((formik.errors.shipping_address as any)?.state)
//                 }
//                 size="small"
//               >
//                 <Select
//                   id="shippingState"
//                   name="shipping_address.state"
//                   displayEmpty
//                   size="small"
//                   InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//                   value={formik.values.shipping_address.state || ""}
//                   onChange={(e) => {
//                     formik.handleChange(e);
//                     // Set state_code to the same value as state
//                     formik.setFieldValue("shipping_address.state_code", (e.target as any).value);
//                   }}
//                   onBlur={formik.handleBlur}
//                   renderValue={(selected: any) => {
//                     if (!selected) {
//                       return (
//                         <Typography color="text.secondary">
//                           Select or type to add
//                         </Typography>
//                       );
//                     }
//                     return selected;
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     <em>Select or type to add</em>
//                   </MenuItem>
//                   <MenuItem value="AL">Alabama</MenuItem>
//                   <MenuItem value="AK">Alaska</MenuItem>
//                   <MenuItem value="AZ">Arizona</MenuItem>
//                 </Select>
//                 {formik.touched.shipping_address?.state &&
//                   (formik.errors.shipping_address as any)?.state && (
//                     <FormHelperText>
//                       {formik.errors.shipping_address.state}
//                     </FormHelperText>
//                   )}
//               </FormControl>
//             </Grid>

//             {/* Pin Code */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingPinCode"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Pin Code
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shippingPinCode"
//                 name="shipping_address.zip"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.zip || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//                 error={
//                   formik.touched.shipping_address?.zip &&
//                   Boolean((formik.errors.shipping_address as any)?.zip)
//                 }
//                 helperText={
//                   formik.touched.shipping_address?.zip &&
//                   (formik.errors.shipping_address as any)?.zip
//                 }
//               />
//             </Grid>

//             {/* Phone */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingPhone"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Phone
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shippingPhone"
//                 name="shipping_address.phone"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.phone || ""}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//                 error={
//                   formik.touched.shipping_address?.phone &&
//                   Boolean((formik.errors.shipping_address as any)?.phone)
//                 }
//                 helperText={
//                   formik.touched.shipping_address?.phone &&
//                   (formik.errors.shipping_address as any)?.phone
//                 }
//               />
//             </Grid>

//             {/* Fax Number */}
//             <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
//               <Typography
//                 component="label"
//                 htmlFor="shippingFax"
//                 sx={{
//                   fontWeight: "medium" as const,
//                   fontSize: "0.875rem",
//                 }}
//               >
//                 Fax Number
//               </Typography>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 id="shippingFax"
//                 name="shipping_address.fax"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={formik.values.shipping_address.fax || ""}
//                 onChange={formik.handleChange}
//                 InputLabelProps={{ sx: { fontSize: "13px" } }}
//                 InputProps={{ sx: { fontSize: "13px" } }}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.shipping_address?.fax &&
//                   Boolean((formik.errors.shipping_address as any)?.fax)
//                 }
//                 helperText={
//                   formik.touched.shipping_address?.fax &&
//                   (formik.errors.shipping_address as any)?.fax
//                 }
//               />
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default AddressFormClient;

"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  FormControl,
  Select,
  styled,
  InputAdornment,
  FormHelperText,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import countriesList from "country-list";
import { State } from "country-state-city";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { domProps } from "../../../services/styledDom";

// Sample countries data
const countries = countriesList.getData().map((c) => ({
  code: c.code,
  label: c.name,
}));

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const StyledSelect = styled(Select)({
  height: "35px", // Changed from 36px to 35px
  "& .MuiSelect-select": {
    padding: "6px 12px",
    fontSize: "14px", // 13px
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "7px", // Changed from default to 7px
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: COLORS.primary,
    border: ".1px solid #408dfb",
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
});

const StyledTextField = styled("input", domProps)<any>(({ error }) => ({
  height: "35px",
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
  borderRadius: "7px", // Changed from 4px to 7px
  fontSize: "14px", // 13px
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
}));

const AddressFormClient = ({ formik }: any) => {
    const theme = useTheme();
  
  const copyBillingToShipping = () => {
    // Copy billing address data to shipping address using the correct field structure
    formik.setFieldValue(
      "shipping_address.attention",
      formik.values.billing_address.attention
    );
    formik.setFieldValue(
      "shipping_address.country",
      formik.values.billing_address.country
    );
    formik.setFieldValue(
      "shipping_address.country_code",
      formik.values.billing_address.country_code
    );
    formik.setFieldValue(
      "shipping_address.address",
      formik.values.billing_address.address
    );
    formik.setFieldValue(
      "shipping_address.street2",
      formik.values.billing_address.street2
    );
    formik.setFieldValue(
      "shipping_address.city",
      formik.values.billing_address.city
    );
    formik.setFieldValue(
      "shipping_address.state",
      formik.values.billing_address.state
    );
    formik.setFieldValue(
      "shipping_address.state_code",
      formik.values.billing_address.state_code
    );
    formik.setFieldValue(
      "shipping_address.zip",
      formik.values.billing_address.zip
    );
    formik.setFieldValue(
      "shipping_address.phone",
      formik.values.billing_address.phone
    );
    formik.setFieldValue(
      "shipping_address.fax",
      formik.values.billing_address.fax
    );
  };

  const [stateOptions, setStateOptions] = useState<any>([]);
  const [stateOptions1, setStateOptions1] = useState<any>([]);
  const [countrySearch, setCountrySearch] = useState<any>("");
  const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);

  // Filtered list using useMemo
  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      country.label.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch, countries]);

  const handleCountrySearchKeyDown = (event) => {
    event.stopPropagation(); // Prevent Select default behavior
    if (event.key === "Escape") {
      setIsCountryOpen(false);
      setCountrySearch("");
    }
  };
  const [stateSearch, setStateSearch] = useState<any>("");
  const [isStateOpen, setIsStateOpen] = useState<boolean>(false);

  // Filter the state list based on search input
  const filteredStates = useMemo(() => {
    return stateOptions.filter((state) =>
      state.label.toLowerCase().includes(stateSearch.toLowerCase())
    );
  }, [stateSearch, stateOptions]);

  const handleStateSearchKeyDown = (event) => {
    event.stopPropagation(); // Prevent Select auto jump
    if (event.key === "Escape") {
      setIsStateOpen(false);
      setStateSearch("");
    }
  };
  const [shippingCountrySearch, setShippingCountrySearch] = useState<any>("");
  const [isShippingCountryOpen, setIsShippingCountryOpen] = useState<boolean>(false);
  const filteredShippingCountries = useMemo(() => {
    return countries.filter((country) =>
      country.label.toLowerCase().includes(shippingCountrySearch.toLowerCase())
    );
  }, [shippingCountrySearch, countries]);

  const handleShippingCountrySearchKeyDown = (event) => {
    event.stopPropagation(); // Prevent Select default behavior
    if (event.key === "Escape") {
      setIsShippingCountryOpen(false);
      setShippingCountrySearch("");
    }
  };
  const [shippingStateSearch, setShippingStateSearch] = useState<any>("");
  const [isShippingStateOpen, setIsShippingStateOpen] = useState<boolean>(false);
  const filteredShippingStates = useMemo(() => {
    return stateOptions1.filter((state) =>
      state.label.toLowerCase().includes(shippingStateSearch.toLowerCase())
    );
  }, [shippingStateSearch, stateOptions1]);

  const handleShippingStateSearchKeyDown = (event) => {
    event.stopPropagation(); // Prevent Select default behavior
    if (event.key === "Escape") {
      setIsShippingStateOpen(false);
      setShippingStateSearch("");
    }
  };
  useEffect(() => {
    if (formik.values.billing_address.country_code) {
      const states = State.getStatesOfCountry(
        formik.values.billing_address.country_code
      );
      setStateOptions(
        states.map((s) => ({
          code: s.isoCode,
          label: s.name,
        }))
      );
    } else {
      setStateOptions([]);
    }
  }, [formik.values.billing_address.country_code]);

  useEffect(() => {
    if (formik.values.shipping_address.country_code) {
      const states = State.getStatesOfCountry(
        formik.values.shipping_address.country_code
      );
      setStateOptions1(
        states.map((s) => ({
          code: s.isoCode,
          label: s.name,
        }))
      );
    } else {
      setStateOptions1([]);
    }
  }, [formik.values.shipping_address.country_code]);

  return (
    <Box sx={{ p: 3, maxWidth: 1500, mb: "100px" }}>
      <Grid container spacing={10}>
        {/* Billing Address Section */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 4,
              fontWeight: "600" as const,
              fontSize: "15px",
              color: "#000",
            }}
          >
            Billing Address
          </Typography>

          {/* Billing Fields */}
          <Grid container spacing={2}>
            {/* Attention */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingAttention"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Attention
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="billingAttention"
                name="billing_address.attention"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.billing_address.attention || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billing_address?.attention &&
                  Boolean((formik.errors.billing_address as any)?.attention)
                }
                helperText={
                  formik.touched.billing_address?.attention &&
                  (formik.errors.billing_address as any)?.attention
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
            </Grid>

            {/* Country/Region */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingCountry"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                  color:
                    (formik.errors.billing_address as any)?.country &&
                    formik.touched.billing_address?.country
                      ? "error.main"
                      : "inherit",

                }}
              >
                Country/Region
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <FormControl
                fullWidth
                error={
                  formik.touched.billing_address?.country &&
                  Boolean((formik.errors.billing_address as any)?.country)
                }
                size="small"
              >
                <StyledSelect
                  id="billingCountry"
                  name="billing_address.country"
                  displayEmpty
                  open={isCountryOpen}
                  onOpen={() => setIsCountryOpen(true)}
                  onClose={() => {
                    setIsCountryOpen(false);
                    setCountrySearch("");
                  }}
                  value={formik.values.billing_address.country || ""}
                  onChange={(e) => {
                    const selected = countries.find(
                      (c) => c.code === (e.target as any).value
                    );
                    if (selected) {
                      formik.setFieldValue(
                        "billing_address.country",
                        selected.label
                      );
                      formik.setFieldValue(
                        "billing_address.country_code",
                        selected.code
                      );
                    }
                  }}
                  onBlur={formik.handleBlur}
                  renderValue={(selected: any) =>
                    selected ? (
                      <Typography sx={{ fontSize: "14px" }}>
                        {selected}
                      </Typography>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: "14px" }}
                      >
                        Select
                      </Typography>
                    )
                  }
                  IconComponent={KeyboardArrowDown}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300, width: 250 },
                    },
                    MenuListProps: {
                      disablePadding: true,
                    },
                  }}
                  sx={{ fontSize: "14px" }}
                >
                  {/* Search Box */}
                  <MenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{ cursor: "default" as const, p: 0 }}
                  >
                    <Box
                      sx={{
                        p: 0.75,
                        position: "sticky" as const,
                        // top: 0,
                        bgcolor: "background.paper",
                        zIndex: 1,
                        width: "100%",
                      }}
                    >
                      <TextField
                        autoFocus
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={handleCountrySearchKeyDown}
                        value={countrySearch}
                        onChange={(e) => setCountrySearch((e.target as any).value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon
                                sx={{ fontSize: "16px", color: "#757575" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
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
                    </Box>
                  </MenuItem>

                  <Divider />

                  {/* Filtered Country List */}
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <MenuItem
                        key={country.code}
                        value={country.code}
                        sx={{
                          fontSize: "13px",
                          minHeight: "30px",
                          padding: "4px 10px",
                          "&:hover": {
                            borderRadius: "5px",                             
                            backgroundColor:theme.palette.hover?.background || "",
                            color: theme.palette.hover?.text || "",
                          },
                        }}
                      >
                        {country.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ fontSize: "13px" }}>
                      No results found
                    </MenuItem>
                  )}
                </StyledSelect>

                {formik.touched.billing_address?.country &&
                  (formik.errors.billing_address as any)?.country && (
                    <FormHelperText>
                      {formik.errors.billing_address.country}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Address */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingAddress"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Address
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="billingAddress"
                name="billing_address.address"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                placeholder="Street 1"
                size="small"
                value={formik.values.billing_address.address || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billing_address?.address &&
                  Boolean((formik.errors.billing_address as any)?.address)
                }
                helperText={
                  formik.touched.billing_address?.address &&
                  (formik.errors.billing_address as any)?.address
                }
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
              <StyledTextField
                id="billingStreet2"
                name="billing_address.street2"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                placeholder="Street 2"
                size="small"
                value={formik.values.billing_address.street2 || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billing_address?.street2 &&
                  Boolean((formik.errors.billing_address as any)?.street2)
                }
                helperText={
                  formik.touched.billing_address?.street2 &&
                  (formik.errors.billing_address as any)?.street2
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
            </Grid>

            {/* City */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingCity"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                City
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="billingCity"
                name="billing_address.city"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.billing_address.city || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billing_address?.city &&
                  Boolean((formik.errors.billing_address as any)?.city)
                }
                helperText={
                  formik.touched.billing_address?.city &&
                  (formik.errors.billing_address as any)?.city
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
            </Grid>

            {/* State */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingState"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                  color:
                    (formik.errors.billing_address as any)?.state &&
                    formik.touched.billing_address?.state
                      ? "error.main"
                      : "inherit",
                }}
              >
                State
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl
                fullWidth
                error={
                  formik.touched.billing_address?.state &&
                  Boolean((formik.errors.billing_address as any)?.state)
                }
                size="small"
              >
                <StyledSelect
                  id="billingState"
                  name="billing_address.state_code"
                  displayEmpty
                  open={isStateOpen}
                  onOpen={() => setIsStateOpen(true)}
                  onClose={() => {
                    setIsStateOpen(false);
                    setStateSearch("");
                  }}
                  value={formik.values.billing_address.state || ""}
                  onChange={(e) => {
                    const selectedState = stateOptions.find(
                      (s) => s.code === (e.target as any).value
                    );
                    if (selectedState) {
                      formik.setFieldValue(
                        "billing_address.state",
                        selectedState.label
                      );
                      formik.setFieldValue(
                        "billing_address.state_code",
                        selectedState.code
                      );
                    }
                  }}
                  IconComponent={KeyboardArrowDown}
                  onBlur={formik.handleBlur}
                  renderValue={(selected: any) =>
                    selected ? (
                      <Typography sx={{ fontSize: "13px" }}>
                        {selected}
                      </Typography>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: "13px" }}
                      >
                        Select or type to add
                      </Typography>
                    )
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: "250px",
                        width: "220px",
                        overflowY: "auto" as const,
                      },
                    },
                  }}
                  sx={{
                    fontSize: "13px",
                    "& .MuiSelect-select": {
                      fontSize: "13px",
                    },
                  }}
                >
                  {/* Search Box */}
                  <MenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{ cursor: "default" as const, p: 0 }}
                  >
                    <Box
                      sx={{
                        p: 0.75,
                        position: "sticky" as const,
                        bgcolor: "background.paper",
                        zIndex: 1,
                        width: "100%",
                      }}
                    >
                      <TextField
                        autoFocus
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={handleStateSearchKeyDown}
                        value={stateSearch}
                        onChange={(e) => setStateSearch((e.target as any).value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon
                                sx={{ fontSize: "16px", color: "#757575" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
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
                    </Box>
                  </MenuItem>

                  <Divider />

                  {/* Filtered list */}
                  {filteredStates.length > 0 ? (
                    filteredStates.map((state) => (
                      <MenuItem
                        key={state.code}
                        value={state.code}
                        sx={{
                          fontSize: "13px",
                          minHeight: "30px",
                          padding: "4px 10px",
                          "&:hover": {
                            borderRadius: "5px",                             
                            backgroundColor:theme.palette.hover?.background || "",
                            color: theme.palette.hover?.text || "",
                          },
                        }}
                      >
                        {state.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ fontSize: "13px" }}>
                      No results found
                    </MenuItem>
                  )}
                </StyledSelect>

                {formik.touched.billing_address?.state_code &&
                  (formik.errors.billing_address as any)?.state_code && (
                    <FormHelperText>
                      {formik.errors.billing_address.state_code}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Pin Code */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingPinCode"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Pin Code
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="billingPinCode"
                name="billing_address.zip"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.billing_address.zip || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billing_address?.zip &&
                  Boolean((formik.errors.billing_address as any)?.zip)
                }
                helperText={
                  formik.touched.billing_address?.zip &&
                  (formik.errors.billing_address as any)?.zip
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingPhone"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Phone
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="billingPhone"
                name="billing_address.phone"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.billing_address.phone || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billing_address?.phone &&
                  Boolean((formik.errors.billing_address as any)?.phone)
                }
                helperText={
                  formik.touched.billing_address?.phone &&
                  (formik.errors.billing_address as any)?.phone
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
            </Grid>

            {/* Fax Number */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="billingFax"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Fax Number
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="billingFax"
                name="billing_address.fax"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.billing_address.fax || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.billing_address?.fax &&
                  Boolean((formik.errors.billing_address as any)?.fax)
                }
                helperText={
                  formik.touched.billing_address?.fax &&
                  (formik.errors.billing_address as any)?.fax
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Shipping Address Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex" as const,
              alignItems: "center" as const,
              justifyContent: "space-between" as const,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                mb: 2,
                fontWeight: "600" as const,
                fontSize: "15px",
                color: "#000",
              }}
            >
              Shipping Address{" "}
              <span
                style={{
                  color: "#408dfb",
                  fontSize: "14px",
                  cursor: "pointer" as const,
                }}
                onClick={copyBillingToShipping}
              >
                {" "}
                (<SouthOutlinedIcon color={"#408dfb" as any} fontSize={"10px" as any} /> Copy
                billing address)
              </span>
            </Typography>
            {/* <Button
              variant={"text" as any}
              color="primary"
              startIcon={<span style={{ color: "#2196f3" }}>→</span>}
              sx={{ fontSize: "0.75rem" }}
              onClick={copyBillingToShipping}
            >
             
            </Button> */}
          </Box>

          {/* Shipping Fields */}
          <Grid container spacing={2}>
            {/* Attention */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingAttention"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Attention
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="shippingAttention"
                name="shipping_address.attention"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.shipping_address.attention || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.shipping_address?.attention &&
                  Boolean((formik.errors.shipping_address as any)?.attention)
                }
                helperText={
                  formik.touched.shipping_address?.attention &&
                  (formik.errors.shipping_address as any)?.attention
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
              />
            </Grid>

            {/* Country/Region */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingCountry"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                  color:
                    (formik.errors.shipping_address as any)?.country &&
                    formik.touched.shipping_address?.country
                      ? "error.main"
                      : "inherit",
                }}
              >
                Country/Region
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl
                fullWidth
                error={
                  formik.touched.shipping_address?.country &&
                  Boolean((formik.errors.shipping_address as any)?.country)
                }
                size="small"
              >
                <StyledSelect
                  id="shippingCountry"
                  name="shipping_address.country"
                  displayEmpty
                  open={isShippingCountryOpen}
                  onOpen={() => setIsShippingCountryOpen(true)}
                  onClose={() => {
                    setIsShippingCountryOpen(false);
                    setShippingCountrySearch("");
                  }}
                  value={formik.values.shipping_address.country || ""}
                  onChange={(e) => {
                    const selected = countries.find(
                      (c) => c.code === (e.target as any).value
                    );
                    if (selected) {
                      formik.setFieldValue(
                        "shipping_address.country",
                        selected.label
                      );
                      formik.setFieldValue(
                        "shipping_address.country_code",
                        selected.code
                      );
                    }
                  }}
                  onBlur={formik.handleBlur}
                  renderValue={(selected: any) =>
                    selected ? (
                      <Typography sx={{ fontSize: "13px" }}>
                        {selected}
                      </Typography>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: "13px" }}
                      >
                        Select
                      </Typography>
                    )
                  }
                  IconComponent={KeyboardArrowDown}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300, width: 250 },
                    },
                    MenuListProps: {
                      disablePadding: true,
                    },
                  }}
                  sx={{ fontSize: "13px" }}
                >
                  {/* Search Box */}
                  <MenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{ cursor: "default" as const, p: 0 }}
                  >
                    <Box
                      sx={{
                        p: 0.75,
                        position: "sticky" as const,
                        bgcolor: "background.paper",
                        zIndex: 1,
                        width: "100%",
                      }}
                    >
                      <TextField
                        autoFocus
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={handleShippingCountrySearchKeyDown}
                        value={shippingCountrySearch}
                        onChange={(e) =>
                          setShippingCountrySearch((e.target as any).value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon
                                sx={{ fontSize: "16px", color: "#757575" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
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
                    </Box>
                  </MenuItem>

                  <Divider />

                  {/* Filtered Countries */}
                  {filteredShippingCountries.length > 0 ? (
                    filteredShippingCountries.map((country) => (
                      <MenuItem
                        key={country.code}
                        value={country.code}
                        sx={{
                          fontSize: "13px",
                          minHeight: "30px",
                          padding: "4px 10px",
                          "&:hover": {
                            borderRadius: "5px",                             
                            backgroundColor:theme.palette.hover?.background || "",
                            color: theme.palette.hover?.text || "",
                          },
                        }}
                      >
                        {country.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ fontSize: "13px" }}>
                      No results found
                    </MenuItem>
                  )}
                </StyledSelect>

                {formik.touched.shipping_address?.country &&
                  (formik.errors.shipping_address as any)?.country && (
                    <FormHelperText>
                      {formik.errors.shipping_address.country}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Address */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingAddress"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Address
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="shippingAddress"
                name="shipping_address.address"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                placeholder="Address"
                size="small"
                value={formik.values.shipping_address.address || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.shipping_address?.address &&
                  Boolean((formik.errors.shipping_address as any)?.address)
                }
                helperText={
                  formik.touched.shipping_address?.address &&
                  (formik.errors.shipping_address as any)?.address
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
                sx={{ mb: 2 }}
              />
              <StyledTextField
                id="shippingStreet2"
                name="shipping_address.street2"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                placeholder="Street 2"
                size="small"
                value={formik.values.shipping_address.street2 || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.shipping_address?.street2 &&
                  Boolean((formik.errors.shipping_address as any)?.street2)
                }
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
                helperText={
                  formik.touched.shipping_address?.street2 &&
                  (formik.errors.shipping_address as any)?.street2
                }
              />
            </Grid>

            {/* City */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingCity"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                City
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="shippingCity"
                name="shipping_address.city"
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
                value={formik.values.shipping_address.city || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.shipping_address?.city &&
                  Boolean((formik.errors.shipping_address as any)?.city)
                }
                helperText={
                  formik.touched.shipping_address?.city &&
                  (formik.errors.shipping_address as any)?.city
                }
              />
            </Grid>

            {/* State */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingState"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                  color:
                    (formik.errors.shipping_address as any)?.state &&
                    formik.touched.shipping_address?.state
                      ? "error.main"
                      : "inherit",
                }}
              >
                State
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl
                fullWidth
                error={
                  formik.touched.shipping_address?.state &&
                  Boolean((formik.errors.shipping_address as any)?.state)
                }
                size="small"
              >
                <StyledSelect
                  id="shippingState"
                  name="shipping_address.state"
                  displayEmpty
                  open={isShippingStateOpen}
                  onOpen={() => setIsShippingStateOpen(true)}
                  onClose={() => {
                    setIsShippingStateOpen(false);
                    setShippingStateSearch("");
                  }}
                  value={formik.values.shipping_address.state || ""}
                  onChange={(e) => {
                    const selectedState = stateOptions1.find(
                      (c) => c.code === (e.target as any).value
                    );
                    if (selectedState) {
                      formik.setFieldValue(
                        "shipping_address.state",
                        selectedState.label
                      );
                      formik.setFieldValue(
                        "shipping_address.state_code",
                        selectedState.code
                      );
                    }
                  }}
                  IconComponent={KeyboardArrowDown}
                  onBlur={formik.handleBlur}
                  renderValue={(selected: any) => {
                    return selected ? (
                      <Typography sx={{ fontSize: "13px" }}>
                        {selected}
                      </Typography>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: "13px" }}
                      >
                        Select
                      </Typography>
                    );
                  }}
                  sx={{
                    fontSize: "13px",
                    "& .MuiSelect-select": {
                      fontSize: "13px",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300, width: 250 },
                    },
                    MenuListProps: {
                      disablePadding: true,
                    },
                  }}
                >
                  {/* Search Input */}
                  <MenuItem
                    disableRipple
                    disableTouchRipple
                    sx={{ cursor: "default" as const, p: 0 }}
                  >
                    <Box
                      sx={{
                        p: 0.75,
                        bgcolor: "background.paper",
                        zIndex: 1,
                        width: "100%",
                      }}
                    >
                      <TextField
                        autoFocus
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={handleShippingStateSearchKeyDown}
                        value={shippingStateSearch}
                        onChange={(e) => setShippingStateSearch((e.target as any).value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon
                                sx={{ fontSize: "16px", color: "#757575" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
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
                    </Box>
                  </MenuItem>

                  <Divider />

                  {/* Filtered Country List */}
                  {filteredShippingStates.length > 0 ? (
                    filteredShippingStates.map((state) => (
                      <MenuItem
                        key={state.code}
                        value={state.code}
                        sx={{
                          fontSize: "13px",
                          minHeight: "30px",
                          padding: "4px 10px",
                          "&:hover": {
                            borderRadius: "5px",                             
                            backgroundColor:theme.palette.hover?.background || "",
                            color: theme.palette.hover?.text || "",
                          },
                        }}
                      >
                        {state.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ fontSize: "13px" }}>
                      No results found
                    </MenuItem>
                  )}
                </StyledSelect>

                {formik.touched.shipping_address?.state &&
                  (formik.errors.shipping_address as any)?.state && (
                    <FormHelperText>
                      {formik.errors.shipping_address.state}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>

            {/* Pin Code */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingPinCode"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Pin Code
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="shippingPinCode"
                name="shipping_address.zip"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.shipping_address.zip || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
                error={
                  formik.touched.shipping_address?.zip &&
                  Boolean((formik.errors.shipping_address as any)?.zip)
                }
                helperText={
                  formik.touched.shipping_address?.zip &&
                  (formik.errors.shipping_address as any)?.zip
                }
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingPhone"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Phone
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="shippingPhone"
                name="shipping_address.phone"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.shipping_address.phone || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
                error={
                  formik.touched.shipping_address?.phone &&
                  Boolean((formik.errors.shipping_address as any)?.phone)
                }
                helperText={
                  formik.touched.shipping_address?.phone &&
                  (formik.errors.shipping_address as any)?.phone
                }
              />
            </Grid>

            {/* Fax Number */}
            <Grid item xs={4} sx={{ display: "flex" as const, alignItems: "center" as const }}>
              <Typography
                component="label"
                htmlFor="shippingFax"
                sx={{
                  fontWeight: "medium" as const,
                  fontSize: "0.875rem",
                }}
              >
                Fax Number
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <StyledTextField
                id="shippingFax"
                name="shipping_address.fax"
                fullWidth
                variant="outlined"
                size="small"
                value={formik.values.shipping_address.fax || ""}
                onChange={formik.handleChange}
                InputLabelProps={{ sx: { fontSize: "13px" } }}
                InputProps={{ sx: { fontSize: "13px" } }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.shipping_address?.fax &&
                  Boolean((formik.errors.shipping_address as any)?.fax)
                }
                helperText={
                  formik.touched.shipping_address?.fax &&
                  (formik.errors.shipping_address as any)?.fax
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressFormClient;
