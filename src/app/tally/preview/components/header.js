// export default function QuotationHeader() {
//   return (
//     <>
//       <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
//         QUOTATION
//       </Typography>

//       {/* Seller and Company Details Section */}
//       <Box sx={{ display: 'flex', mb: 2 }}>
//         <SellerDetails />
//         <CompanyDetails />
//       </Box>

//       {/* Buyer Details */}
//       <BuyerDetails />
//     </>
//   );
// }

// function SellerDetails() {
//   return (
//     <Box sx={{ width: '50%', pr: 1, border: '1px solid #ccc' }}>
//       <Box sx={{ p: 1 }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           VVV and Co (Complete Modules)
//         </Typography>
//         <Typography variant="body2">
//           #14 Synergy Temple Street Narayana Setty Pet
//         </Typography>
//         <Typography variant="body2">
//           Bengaluru 560002
//         </Typography>
//         <Typography variant="body2">
//           GSTIN/UIN: 29AAACC7727M2ZU
//         </Typography>
//         <Typography variant="body2">
//           State Name: Karnataka, Code: 29
//         </Typography>
//         <Typography variant="body2">
//           E-Mail: info@gmail.com
//         </Typography>
//         <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
//           Consignee (Ship to)
//         </Typography>
//         <Typography variant="body2">
//           Amazon Gift Voucher
//         </Typography>
//         <Typography variant="body2">
//           State Name: Karnataka, Code: 29
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// function CompanyDetails() {
//   return (
//     <Box sx={{ width: '50%', pl: 1 }}>
//       <DetailRow
//         leftTitle="Quotation No:"
//         leftContent="1"
//         rightTitle="Dated:"
//         rightContent="1-Jul-21"
//       />
//       <DetailRow
//         leftTitle="Mode/Terms of Payment:"
//         leftContent=""
//         rightTitle=""
//         rightContent=""
//         hasBorderTop={false}
//       />
//       <DetailRow
//         leftTitle="Buyer's Ref./Order No:"
//         leftContent=""
//         rightTitle="Other References:"
//         rightContent=""
//         hasBorderTop={false}
//       />
//       <DetailRow
//         leftTitle="Dispatched through:"
//         leftContent=""
//         rightTitle="Destination:"
//         rightContent=""
//         hasBorderTop={false}
//       />
//       <SingleDetailRow
//         title="Terms of Delivery:"
//         content=""
//         hasBorderTop={false}
//       />
//     </Box>
//   );
// }

// function DetailRow({ leftTitle, leftContent, rightTitle, rightContent, hasBorderTop = true }) {
//   return (
//     <Box sx={{
//       display: 'flex',
//       border: '1px solid #ccc',
//       borderTop: hasBorderTop ? '1px solid #ccc' : 'none'
//     }}>
//       <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #ccc' }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           {leftTitle}
//         </Typography>
//         <Typography variant="body2">
//           {leftContent}
//         </Typography>
//       </Box>
//       <Box sx={{ width: '50%', p: 1 }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           {rightTitle}
//         </Typography>
//         <Typography variant="body2">
//           {rightContent}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// function SingleDetailRow({ title, content, hasBorderTop = true }) {
//   return (
//     <Box sx={{
//       display: 'flex',
//       border: '1px solid #ccc',
//       borderTop: hasBorderTop ? '1px solid #ccc' : 'none'
//     }}>
//       <Box sx={{ p: 1 }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           {title}
//         </Typography>
//         <Typography variant="body2">
//           {content}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// function BuyerDetails() {
//   return (
//     <Box sx={{ border: '1px solid #ccc', mb: 2 }}>
//       <Box sx={{ p: 1 }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Buyer (Bill to)
//         </Typography>
//         <Typography variant="body2">
//           Amazon Gift Voucher
//         </Typography>
//         <Typography variant="body2">
//           State Name: Karnataka, Code: 29
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// components/QuotationHeader.jsx
// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// export default function QuotationHeader() {
//   return (
//     <Paper elevation={0} sx={{ width: '100%', mb: 3 }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         INVOICE
//       </Typography>

//       {/* Main header grid */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000' }}>
//         {/* First row */}
//         <Box sx={{ display: 'flex' }}>
//           <SellerBox />
//           <InvoiceDetailsBox />
//         </Box>

//         {/* Second row - Consignee */}
//         <ConsigneeBox />

//         {/* Third row - References and shipping details */}
//         <ShippingDetailsBox />

//         {/* Fourth row - Buyer */}
//         <BuyerBox />
//       </Box>
//     </Paper>
//   );
// }

// function SellerBox() {
//   return (
//     <Box sx={{
//       width: '50%',
//       p: 1,
//       borderRight: '1px solid #000',
//     }}>
//       <Typography variant="body2" sx={{ fontWeight: 'bold',fontSize:20 }}>
//         Shree
//       </Typography>
//       <Typography variant="body2">
//         State Name: Tamil Nadu, Code: 33
//       </Typography>
//     </Box>
//   );
// }

// function InvoiceDetailsBox() {
//   return (
//     <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
//       <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//         <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Invoice No.
//           </Typography>
//           <Typography variant="body2">
//             1
//           </Typography>
//         </Box>
//         <Box sx={{ width: '50%', p: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Dated
//           </Typography>
//           <Typography variant="body2">
//             1-07-21
//           </Typography>
//         </Box>
//       </Box>
//       <Box sx={{ display: 'flex' }}>
//         <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Delivery Note
//           </Typography>
//         </Box>
//         <Box sx={{ width: '50%', p: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Mode/Terms of Payment
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function ConsigneeBox() {
//   return (
//     <Box sx={{
//       display: 'flex',
//       borderTop: '1px solid #000',
//     }}>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//         borderRight: '1px solid #000',
//       }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Consignee (Ship to)
//         </Typography>
//         <Typography variant="body2">
//           ABC
//         </Typography>
//         <Typography variant="body2">
//           6-A Ramanujam Koil Street, Subramaniyam, Cbe
//         </Typography>
//         <Typography variant="body2">
//           State Name: Tamil Nadu, Code: 33
//         </Typography>
//       </Box>
//       <Box sx={{ width: '50%' }}>
//         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Reference No. & Date
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Other References
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer's Order No.
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Dated
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function ShippingDetailsBox() {
//   return (
//     <Box sx={{
//       display: 'flex',
//       borderTop: '1px solid #000',
//     }}>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//         borderRight: '1px solid #000',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         <Box sx={{ mb: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Dispatch Doc No.
//           </Typography>
//           <Typography variant="body2">
//             1-07-21
//           </Typography>
//         </Box>
//         <Box>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Dispatched through
//           </Typography>
//           <Typography variant="body2">
//             Sales Quote
//           </Typography>
//         </Box>
//       </Box>
//       <Box sx={{ width: '50%' }}>
//         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Delivery Note Date
//             </Typography>
//             <Typography variant="body2">
//               1-07-21
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Destination
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display: 'flex' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Bill of Lading/LR No.
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Motor Vehicle No.
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function BuyerBox() {
//   return (
//     <Box sx={{
//       display: 'flex',
//       borderTop: '1px solid #000',
//     }}>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//         borderRight: '1px solid #000',
//       }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Buyer (Bill to)
//         </Typography>
//         <Typography variant="body2">
//           ABC
//         </Typography>
//         <Typography variant="body2">
//           6-A Ramanujam Koil Street, Subramaniyam, Cbe
//         </Typography>
//         <Typography variant="body2">
//           State Name: Tamil Nadu, Code: 33
//         </Typography>
//       </Box>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//       }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Terms of Delivery
//         </Typography>
//       </Box>
//     </Box>
//   );
// }
// ------------------------------
// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// export default function QuotationHeader() {
//   return (
//     <Paper elevation={0} sx={{ width: '100%', mb: 3 }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         INVOICE
//       </Typography>

//       {/* Main header grid */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000' }}>
//         {/* First row */}
//         <Box sx={{ display: 'flex' }}>
//           <SellerBox />
//           <InvoiceDetailsBox />
//         </Box>

//         {/* Second row - Consignee */}
//         <ConsigneeBox />

//         {/* Third row - References and shipping details */}
//         <ShippingDetailsBox />

//         {/* Fourth row - Buyer */}
//         <BuyerBox />
//       </Box>

//       {/* Table Section - Moved from Print.js */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 2, mt: 2 }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Sl<br/>No.</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">per</Typography>
//           </Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Amount</Typography>
//           </Box>
//         </Box>

//         {/* First data row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">1</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}>
//             <Typography variant="body2">Container</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">₹1,800.00</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">3,600.00</Typography>
//           </Box>
//         </Box>

//         {/* Empty data area - Only vertical lines, no horizontal lines */}
//         <Box sx={{ display: 'flex', width: '100%', height: '180px', position: 'relative' }}>
//           {/* Left column - Sl No. */}
//           <Box sx={{
//             width: '40px',
//             borderLeft: '1px solid black',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Description column */}
//           <Box sx={{
//             flex: 1,
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* HSN/SAC column */}
//           <Box sx={{
//             width: '80px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Quantity column */}
//           <Box sx={{
//             width: '70px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Rate column */}
//           <Box sx={{
//             width: '80px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Per column */}
//           <Box sx={{
//             width: '40px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Amount column */}
//           <Box sx={{
//             width: '100px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: 'calc(40px + 100%)',
//             flex: 1,
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right',
//             fontWeight: 'bold'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{
//             width: '80px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '100px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹ 3,600.00</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ mb: 2, p: 0.8, border: '1px solid black' }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Amount Chargeable (in words)
//         </Typography>
//         <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'blue' }}>
//           INR Three Thousand Six Hundred Only
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
//         <Box sx={{ border: '1px solid black', p: 0.8, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', p: 0.8, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%', mb: 1 }}>E. & O.E</Typography>
//             <Typography variant="body2" sx={{ mt: 1 }}>for Shree</Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// function SellerBox() {
//   return (
//     <Box sx={{
//       width: '50%',
//       p: 1,
//       borderRight: '1px solid #000',
//     }}>
//       <Typography variant="body2" sx={{ fontWeight: 'bold',fontSize:20 }}>
//         Shree
//       </Typography>
//       <Typography variant="body2">
//         State Name: Tamil Nadu, Code: 33
//       </Typography>
//     </Box>
//   );
// }

// function InvoiceDetailsBox() {
//   return (
//     <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
//       <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//         <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Invoice No.
//           </Typography>
//           <Typography variant="body2">
//             1
//           </Typography>
//         </Box>
//         <Box sx={{ width: '50%', p: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Dated
//           </Typography>
//           <Typography variant="body2">
//             1-07-21
//           </Typography>
//         </Box>
//       </Box>
//       <Box sx={{ display: 'flex' }}>
//         <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Delivery Note
//           </Typography>
//         </Box>
//         <Box sx={{ width: '50%', p: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Mode/Terms of Payment
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function ConsigneeBox() {
//   return (
//     <Box sx={{
//       display: 'flex',
//       borderTop: '1px solid #000',
//     }}>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//         borderRight: '1px solid #000',
//       }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Consignee (Ship to)
//         </Typography>
//         <Typography variant="body2">
//           ABC
//         </Typography>
//         <Typography variant="body2">
//           6-A Ramanujam Koil Street, Subramaniyam, Cbe
//         </Typography>
//         <Typography variant="body2">
//           State Name: Tamil Nadu, Code: 33
//         </Typography>
//       </Box>
//       <Box sx={{ width: '50%' }}>
//         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Reference No. & Date
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Other References
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer's Order No.
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Dated
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function ShippingDetailsBox() {
//   return (
//     <Box sx={{
//       display: 'flex',
//       borderTop: '1px solid #000',
//     }}>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//         borderRight: '1px solid #000',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         <Box sx={{ mb: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Dispatch Doc No.
//           </Typography>
//           <Typography variant="body2">
//             1-07-21
//           </Typography>
//         </Box>
//         <Box>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Dispatched through
//           </Typography>
//           <Typography variant="body2">
//             Sales Quote
//           </Typography>
//         </Box>
//       </Box>
//       <Box sx={{ width: '50%' }}>
//         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Delivery Note Date
//             </Typography>
//             <Typography variant="body2">
//               1-07-21
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Destination
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display: 'flex' }}>
//           <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Bill of Lading/LR No.
//             </Typography>
//           </Box>
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Motor Vehicle No.
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function BuyerBox() {
//   return (
//     <Box sx={{
//       display: 'flex',
//       borderTop: '1px solid #000',
//     }}>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//         borderRight: '1px solid #000',
//       }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Buyer (Bill to)
//         </Typography>
//         <Typography variant="body2">
//           ABC
//         </Typography>
//         <Typography variant="body2">
//           6-A Ramanujam Koil Street, Subramaniyam, Cbe
//         </Typography>
//         <Typography variant="body2">
//           State Name: Tamil Nadu, Code: 33
//         </Typography>
//       </Box>
//       <Box sx={{
//         width: '50%',
//         p: 1,
//       }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Terms of Delivery
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// export default function QuotationHeader() {
//   return (
//     <Paper elevation={0} sx={{ width: '100%', mb: 3 }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         INVOICE
//       </Typography>

//       {/* Main header grid - updated to match the image layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000' }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 18 }}>
//               Shree
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Invoice No.
//                 </Typography>
//                 <Typography variant="body2">
//                   1
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   1-07-21
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Reference details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2">
//               ABC
//             </Typography>
//             <Typography variant="body2">
//               6-A Ramanujam Koil Street, Subramaniyam, Cbe
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* References */}
//           <Box sx={{ width: '50%' }}>
//             {/* Reference No and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Buyer's Order and Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Dispatch details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Dispatch Doc No. and Dispatched through */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Box sx={{ mb: 1 }}>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                 Dispatch Doc No.
//               </Typography>
//               <Typography variant="body2">
//                 1-07-21
//               </Typography>
//             </Box>
//             <Box>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                 Dispatched through
//               </Typography>
//               <Typography variant="body2">
//                 Sales Quote
//               </Typography>
//             </Box>
//           </Box>

//           {/* Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Delivery Note Date and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   1-07-21
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Vehicle No */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR No.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Fourth row - Buyer */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2">
//               ABC
//             </Typography>
//             <Typography variant="body2">
//               6-A Ramanujam Koil Street, Subramaniyam, Cbe
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Rest of the code remains unchanged... */}
//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 2,  }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Sl<br/>No.</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">per</Typography>
//           </Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Amount</Typography>
//           </Box>
//         </Box>

//         {/* First data row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">1</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}>
//             <Typography variant="body2">Box</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">₹1,800.00</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">3,600.00</Typography>
//           </Box>
//         </Box>

//         {/* Empty data area - Only vertical lines, no horizontal lines */}
//         <Box sx={{ display: 'flex', width: '100%', height: '180px', position: 'relative' }}>
//           {/* Left column - Sl No. */}
//           <Box sx={{
//             width: '40px',
//             borderLeft: '1px solid black',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Description column */}
//           <Box sx={{
//             flex: 1,
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* HSN/SAC column */}
//           <Box sx={{
//             width: '80px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Quantity column */}
//           <Box sx={{
//             width: '70px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Rate column */}
//           <Box sx={{
//             width: '80px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Per column */}
//           <Box sx={{
//             width: '40px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Amount column */}
//           <Box sx={{
//             width: '100px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: 'calc(40px + 100%)',
//             flex: 1,
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right',
//             fontWeight: 'bold'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{
//             width: '80px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '100px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹ 3,600.00</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ mb: 2, p: 0.8, border: '1px solid black' }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Amount Chargeable (in words)
//         </Typography>
//         <Typography variant="body2" sx={{ textAlign: 'right', width: '100%', mb: 1 }}>E. & O.E</Typography>
//         <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'blue' }}>
//           INR Three Thousand Six Hundred Only
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
//         <Box sx={{ border: '1px solid black', p: 0.8, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', p: 0.8, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>

//             <Typography variant="body2" sx={{ mt: 1 }}>for Shree</Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }
// --------------------------------------
// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// export default function QuotationHeader() {
//   return (
//     <Paper elevation={0} sx={{ width: '100%', mb: 3 }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         INVOICE
//       </Typography>

//       {/* Main header grid - updated to match the image layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000' }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 18 }}>
//               Shree
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Invoice No.
//                 </Typography>
//                 <Typography variant="body2">
//                   1
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   1-07-21
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Reference details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2">
//               ABC
//             </Typography>
//             <Typography variant="body2">
//               6-A Ramanujam Koil Street, Subramaniyam, Cbe
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* References */}
//           <Box sx={{ width: '50%' }}>
//             {/* Reference No and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Buyer's Order and Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 3, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 3 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Dispatch details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Dispatch Doc No. and Dispatched through */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Box sx={{ mb: 1 }}>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                 Dispatch Doc No.
//               </Typography>
//               <Typography variant="body2">
//                 1-07-21
//               </Typography>
//             </Box>
//             <Box>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                 Dispatched through
//               </Typography>
//               <Typography variant="body2">
//                 Sales Quote
//               </Typography>
//             </Box>
//           </Box>

//           {/* Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Delivery Note Date and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   1-07-21
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Vehicle No */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 2, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR No.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Fourth row - Buyer */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2">
//               ABC
//             </Typography>
//             <Typography variant="body2">
//               6-A Ramanujam Koil Street, Subramaniyam, Cbe
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section - REMOVED mt: 2 to attach directly to header */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 0 }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Sl<br/>No.</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '86px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">per</Typography>
//           </Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Amount</Typography>
//           </Box>
//         </Box>

//         {/* First data row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">1</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}>
//             <Typography variant="body2">Box</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">₹1,800.00</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">3,600.00</Typography>
//           </Box>
//         </Box>

//         {/* Empty data area - Only vertical lines, no horizontal lines */}
//         <Box sx={{ display: 'flex', width: '100%', height: '180px', position: 'relative' }}>
//           {/* Left column - Sl No. */}
//           <Box sx={{
//             width: '40px',
//             borderLeft: '1px solid black',
//             borderRight: '1px solid black',
//             height: '119%'
//           }}></Box>

//           {/* Description column */}
//           <Box sx={{
//              width: '40 px',
//             flex: 1,
//             borderRight: '1px solid black',
//             height: '119%'
//           }}></Box>

//           {/* HSN/SAC column */}
//           <Box sx={{
//             width: '80px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Quantity column */}
//           <Box sx={{
//             width: '70px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Rate column */}
//           <Box sx={{
//             width: '80px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Per column */}
//           <Box sx={{
//             width: '40px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>

//           {/* Amount column */}
//           <Box sx={{
//             width: '100px',
//             borderRight: '1px solid black',
//             height: '100%'
//           }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: 'calc(40px + 100%)',
//             flex: 1,
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right',
//             fontWeight: 'bold'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{
//             width: '80px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '100px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹ 3,600.00</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words - REMOVED mb: 2 to attach to the next section */}
//       <Box sx={{ p: 0.8, border: '1px solid black', borderTop: 'none' }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Amount Chargeable (in words)
//         </Typography>
//         <Typography variant="body2" sx={{ textAlign: 'right', width: '100%', mb: 1 }}>E. & O.E</Typography>
//         <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'blue' }}>
//           INR Three Thousand Six Hundred Only
//         </Typography>
//       </Box>

//       {/* Declaration and Signature - REMOVED mb: 2 */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.8, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>

//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
//             <Typography variant="body2" sx={{ mt: 1 }}>for Shree</Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }
// -------------
// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// export default function QuotationHeader() {
//   return (
//     <Paper elevation={0} sx={{ width: '100%', mb: 3 }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         INVOICE
//       </Typography>

//       {/* Main header grid with dynamic height */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000' }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 18 }}>
//               Shree
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Invoice No.
//                 </Typography>
//                 <Typography variant="body2">
//                   1
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   1-07-21
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Reference details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2">
//               ABC
//             </Typography>
//             <Typography variant="body2">
//               6-A Ramanujam Koil Street, Subramaniyam, Cbe
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* References */}
//           <Box sx={{ width: '50%' }}>
//             {/* Reference No and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Buyer's Order and Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 2, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 3 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Dispatch details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Dispatch Doc No. and Dispatched through */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Box sx={{ mb: 1 }}>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                 Dispatch Doc No.
//               </Typography>
//               <Typography variant="body2">
//                 1-07-21
//               </Typography>
//             </Box>
//             <Box>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                 Dispatched through
//               </Typography>
//               <Typography variant="body2">
//                 Sales Quote
//               </Typography>
//             </Box>
//           </Box>

//           {/* Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Delivery Note Date and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 1, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   1-07-21
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Vehicle No */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 2, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold'}}>
//                   Bill of Lading/LR No.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 1 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Fourth row - Buyer */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 1,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2">
//               ABC
//             </Typography>
//             <Typography variant="body2">
//               6-A Ramanujam Koil Street, Subramaniyam, Cbe
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section with dynamic content */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 0 }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Sl<br/>No.</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '86px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">per</Typography>
//           </Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">Amount</Typography>
//           </Box>
//         </Box>

//         {/* Single item row with Box */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">1</Typography>
//           </Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}>
//             <Typography variant="body2">Box</Typography>
//           </Box>
//           <Box sx={{ width: '86px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'center' }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">₹1,800.00</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8 }}></Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, textAlign: 'right' }}>
//             <Typography variant="body2">3,600.00</Typography>
//           </Box>
//         </Box>

//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '180px' }}>
//           <Box sx={{ width: '40px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ flex: 1, border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '86px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '80px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '100px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: 'calc(40px + 100%)',
//             flex: 1,
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right',
//             fontWeight: 'bold'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{
//             width: '80px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8
//           }}></Box>
//           <Box sx={{
//             width: '100px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.8,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹ 3,600.00</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ p: 0.8, border: '1px solid black', borderTop: 'none' }}>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           Amount Chargeable (in words)
//         </Typography>
//         <Typography variant="body2" sx={{ textAlign: 'right', width: '100%', mb: 1 }}>E. & O.E</Typography>
//         <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'blue' }}>
//           INR Three Thousand Six Hundred Only
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.8, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>

//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.8, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
//             <Typography variant="body2" sx={{ mt: 1 }}>for Shree</Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }
// -----------

// 'use client';
// import { Box, Typography, Paper,TableBody } from '@mui/material';

// export default function QuotationHeader({ data, callViewAPI }) {
//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//        QUOTATION
//       </Typography>

//       {/* Main header table with compact layout matching image */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             {data?.customer_name}
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Quotation No.
//                 </Typography>
//                 <Typography variant="body2">
//                 {data?.estimate_number}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                 {data?.date}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   1
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date.
//                   <Typography variant="body2">
//                 {data?.reference_number}
//                 </Typography>

//                 </Typography>

//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             {data?.shipping_address?.attention}
//             </Typography>
//             <Typography variant="body2">
//             {data?.shipping_address?.address}  {data?.shipping_address?.city}
//             </Typography>
//             <Typography variant="body2">
//             {data?.shipping_address?.zip}   {data?.shipping_address?.state}  {data?.shipping_address?.country}
//             </Typography>
//           </Box>

//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   {/* Dispatch Doc No. */}Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">

//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   {/* Delivery Note Date */} Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   1-Apr-24
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   Sales Quote
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   Exprices in 5 Days
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   Chennai
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Buyer's Order No and Dated - Moved here */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                 Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   1
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>

//                 <Typography variant="body2">
//                   1-Apr-24
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             {data?.shipping_address?.attention}
//             </Typography>
//             <Typography variant="body2">
//              {data?.billing_address?.address} {data?.biling_address?.zip}
//             </Typography>
//             <Typography variant="body2">
//           {data?.billing_address?.city}{data?.billing_address?.state} {data?.billing_address?.country}
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section with proportions matching the image - NO MARGIN between sections */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>

//         {/* Items - Add borders to maintain consistency with the empty space */}

//         {/* <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2">1</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//             <Typography variant="body2"> {data?.line_items?.name} </Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2">2.0 </Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//             <Typography variant="body2">₹1,800.00</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2">₹</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//             <Typography variant="body2">3,600.00</Typography>
//           </Box>
//         </Box> */}

// {data?.line_items?.map((row, index) => (
//   <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//     <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2">{index + 1}</Typography>
//     </Box>
//     <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//       <Typography variant="body2">{row?.name}</Typography>
//       <Typography variant="caption">{row?.description}</Typography>
//     </Box>
//     <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}></Box>
//     <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2">{row?.quantity}</Typography>
//     </Box>
//     <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//       <Typography variant="body2">{row?.rate}</Typography>
//     </Box>
//     <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2"></Typography>
//     </Box>
//     <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//       <Typography variant="body2">{row?.item_total}</Typography>
//     </Box>
//   </Box>
// ))}

//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: '325px', /* 45px + 280px */
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.5,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '55px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">2.0 ₹</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '90px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2"></Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words - directly connected to table above */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Amount Chargeable (in words)
//           </Typography>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           INR Three Thousand Six Hundred Only
//         </Typography>
//       </Box>

//       {/* Declaration and Signature - directly connected to section above */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>for  {data?.customer_name}</Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* Computer Generated Invoice footer */}
//       <Box sx={{ width: '100%', textAlign: 'center', mt: 1 }}>
//         {/* <Typography variant="body2"></Typography> */}
//       </Box>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

//   if (num === 0) return 'Zero';

//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };

//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));

//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;

//   return word.trim() + ' Only';
// };

// export default function QuotationHeader({ data, callViewAPI }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));

//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         QUOTATION
//       </Typography>

//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//               State Name: Tamil Nadu, Code: 33
//             </Typography>
//             <Typography variant="body2">
//               GSTIN: {data?.gstin || '33XXXXXXXXXXXX'}
//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Quotation No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || 'N/A'}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || 'N/A'}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note || '1'}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || 'N/A'}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.reference_number || 'N/A'}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || 'N/A'}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || 'N/A'}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no || 'N/A'}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date || '1-Apr-24'}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || 'Sales Quote'}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination || 'Expires in 5 Days'}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || 'Chennai'}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || 'N/A'}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || '1'}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || '1-Apr-24'}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention || 'N/A'}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery || 'N/A'}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>

//         {/* Items */}
//         {data?.line_items?.map((row, index) => (
//           <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//             <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{index + 1}</Typography>
//             </Box>
//             <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//               <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//               <Typography variant="caption">{row?.description || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.quantity || '0'}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//             </Box>
//             <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.unit || '₹'}</Typography>
//             </Box>
//             <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//             </Box>
//           </Box>
//         ))}

//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: '325px', /* 45px + 280px */
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.5,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '55px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">{totalQuantity.toFixed(1)}</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '90px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹{totalAmount.toFixed(2)}</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Amount Chargeable (in words)
//           </Typography>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           INR {amountInWords}
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

//   if (num === 0) return 'Zero';

//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };

//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));

//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;

//   return word.trim() + ' Only';
// };

// // export default function QuotationHeader({ data, callViewAPI,heading }) {
// //   // Calculate total from line_items
// //   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
// //   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
// //   const amountInWords = numberToWords(Math.floor(totalAmount));

// //   return (
// //     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
// //       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
// //       {heading}
// //       </Typography>

// export default function QuotationHeader({ data, callViewAPI, heading }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));

//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         {heading}
//       </Typography>

//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//             {data?.billing_address?.state}
//             </Typography>
//             <Typography variant="body2">

//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Quotation No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || "" }
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.reference_number || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention ||""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery ||""}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>

//         {/* Items */}
//         {data?.line_items?.map((row, index) => (
//           <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//             <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{index + 1}</Typography>
//             </Box>
//             <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//               <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//               <Typography variant="caption">{row?.description || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.quantity || '0'}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//             </Box>
//             <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.unit || '₹'}</Typography>
//             </Box>
//             <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//             </Box>
//           </Box>
//         ))}

//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: '325px', /* 45px + 280px */
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.5,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '55px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">{totalQuantity.toFixed(1)}</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '90px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹{totalAmount.toFixed(2)}</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Amount Chargeable (in words)
//           </Typography>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           INR {amountInWords}
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

//   if (num === 0) return 'Zero';

//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };

//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));

//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;

//   return word.trim() + ' Only';
// };

// export default function QuotationHeader({ data, callViewAPI }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));

//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         QUOTATION
//       </Typography>

//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//             {data?.billing_address?.state}
//             </Typography>
//             <Typography variant="body2">

//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Quotation No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || "" }
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.reference_number || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention ||""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery ||""}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>

//         {/* Items */}
//         {data?.line_items?.map((row, index) => (
//           <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//             <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{index + 1}</Typography>
//             </Box>
//             <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//               <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//               <Typography variant="caption">{row?.description || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.quantity || '0'}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//             </Box>
//             <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.unit || '₹'}</Typography>
//             </Box>
//             <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//             </Box>
//           </Box>
//         ))}

//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: '325px', /* 45px + 280px */
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.5,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '55px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">{totalQuantity.toFixed(1)}</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '90px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹{totalAmount.toFixed(2)}</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Amount Chargeable (in words)
//           </Typography>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           INR {amountInWords}
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

//   if (num === 0) return 'Zero';

//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };

//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));

//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;

//   return word.trim() + ' Only';
// };

// export default function QuotationHeader({ data, callViewAPI }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));

//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         QUOTATION
//       </Typography>

//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//             {data?.billing_address?.state}
//             </Typography>
//             <Typography variant="body2">

//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Quotation No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || "" }
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.reference_number || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention ||""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery ||""}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>

//         {/* Items */}
//         {data?.line_items?.map((row, index) => (
//           <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//             <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{index + 1}</Typography>
//             </Box>
//             <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//               <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//               <Typography variant="caption">{row?.description || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.quantity || '0'}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//             </Box>
//             <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.unit || '₹'}</Typography>
//             </Box>
//             <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//             </Box>
//           </Box>
//         ))}

//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: '325px', /* 45px + 280px */
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.5,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '55px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">{totalQuantity.toFixed(1)}</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '90px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹{totalAmount.toFixed(2)}</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Amount Chargeable (in words)
//           </Typography>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           INR {amountInWords}
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

//   if (num === 0) return 'Zero';

//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };

//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));

//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;

//   return word.trim() + ' Only';
// };

// // export default function QuotationHeader({ data, callViewAPI,heading }) {
// //   // Calculate total from line_items
// //   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
// //   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
// //   const amountInWords = numberToWords(Math.floor(totalAmount));

// //   return (
// //     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
// //       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
// //       {heading}
// //       </Typography>

// export default function QuotationHeader({ data, callViewAPI, heading, lable }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));

//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         {heading}
//       </Typography>

//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//             {data?.billing_address?.state}
//             </Typography>
//             <Typography variant="body2">

//             </Typography>
//           </Box>

//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   {lable}
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || data?.invoice_number|| data?.salesorder_number }
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.reference_number || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no ||""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination ||""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention ||""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>

//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery ||""}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>

//         {/* Items */}
//         {data?.line_items?.map((row, index) => (
//           <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//             <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{index + 1}</Typography>
//             </Box>
//             <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//               <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//               <Typography variant="caption">{row?.description || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.quantity || '0'}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//             </Box>
//             <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.unit || '₹'}</Typography>
//             </Box>
//             <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//             </Box>
//           </Box>
//         ))}

//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>

//         {/* Total row */}
//         <Box sx={{ display: 'flex', width: '100%' }}>
//           <Box sx={{
//             width: '325px', /* 45px + 280px */
//             border: '1px solid black',
//             borderTop: 'none',
//             p: 0.5,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{
//             width: '55px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'center'
//           }}>
//             <Typography variant="body2">{totalQuantity.toFixed(1)}</Typography>
//           </Box>
//           <Box sx={{
//             width: '70px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '40px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5
//           }}></Box>
//           <Box sx={{
//             width: '90px',
//             border: '1px solid black',
//             borderLeft: 'none',
//             borderTop: 'none',
//             p: 0.5,
//             textAlign: 'right'
//           }}>
//             <Typography variant="body2">₹{totalAmount.toFixed(2)}</Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Amount in Words */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//             Amount Chargeable (in words)
//           </Typography>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>
//         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//           INR {amountInWords}
//         </Typography>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';
// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
//   if (num === 0) return 'Zero';
//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };
//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));
//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;
//   return word.trim() + ' Only';
// };
// export default function QuotationHeader({ data, callViewAPI, heading, lable }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));
//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         {heading}
//       </Typography>
//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.state}
//             </Typography>
//             <Typography variant="body2">
//             </Typography>
//           </Box>
//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   {lable}
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || data?.invoice_number || data?.salesorder_number}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography >
//                 <Typography variant="body2">
//                   {data?.reference_number || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>
//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || ""}
//                 </Typography>
//               </Box>
//             </Box>
//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>
//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery || ""}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>
//         {/* Items */}
//         {data?.line_items?.map((row, index) => (
//           <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//             <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{index + 1}</Typography>
//             </Box>
//             <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//               <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//               <Typography variant="caption">{row?.description || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.quantity || '0'}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//             </Box>
//             <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.unit || '₹'}</Typography>
//             </Box>
//             <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//             </Box>
//           </Box>
//         ))}
//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>
//         {/* Total row */}

//       </Box>
//       {/* Amount Breakdown Section */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//       <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
//           <Box sx={{ width: '200px' }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//               <Typography variant="body2">Sub Total</Typography>
//               <Typography variant="body2">{data?.sub_total_formatted || `₹${totalAmount.toFixed(2)}`}</Typography>
//             </Box>
//             {data?.tax_total_formatted && parseFloat(data?.tax_total) !== 0 && (
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                 <Typography variant="body2">
//                   Amount Withheld (Section 194 H)
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: data?.tax_type === 'TDS' ? 'red' : 'inherit' }}>
//                   {data?.tax_type === 'TDS' ? `(-)${data?.tax_total_formatted}` : data?.tax_total_formatted}
//                 </Typography>
//               </Box>
//             )}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 0.5, borderTop: '1px solid #000' }}>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{data?.total_formatted || `₹${totalAmount.toFixed(2)}`}</Typography>
//             </Box>
//           </Box>
//         </Box>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Amount Chargeable (in words)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               INR {amountInWords}
//             </Typography>
//           </Box>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>

//       </Box>
//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
//   if (num === 0) return 'Zero';
//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };
//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));
//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;
//   return word.trim() + ' Only';
// };

// export default function QuotationHeader({ data, callViewAPI, heading, lable }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));

//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         {heading}
//       </Typography>
//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.state}
//             </Typography>
//             <Typography variant="body2">
//             </Typography>
//           </Box>
//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   {lable}
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || data?.invoice_number || data?.salesorder_number}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography >
//                 <Typography variant="body2">
//                   {data?.reference_number || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant-winwords="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>
//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || ""}
//                 </Typography>
//               </Box>
//             </Box>
//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>
//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery || ""}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//       {/* Table Section */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//         {/* Table Header */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Sl.No</Typography>
//           </Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Description of Goods</Typography>
//           </Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>HSN/SAC</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Quantity</Typography>
//           </Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Rate</Typography>
//           </Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>per</Typography>
//           </Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
//             <Typography variant="body2" noWrap>Amount</Typography>
//           </Box>
//         </Box>
//         {/* Items */}
//         {data?.line_items?.map((row, index) => (
//           <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//             <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{index + 1}</Typography>
//             </Box>
//             <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
//               <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//               <Typography variant="caption">{row?.description || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.quantity || '0'}</Typography>
//             </Box>
//             <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//             </Box>
//             <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
//               <Typography variant="body2">{row?.unit || '₹'}</Typography>
//             </Box>
//             <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
//               <Typography variant="body2">₹{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//             </Box>
//           </Box>
//         ))}
//         {/* Empty space with borders */}
//         <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//           <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//           <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', height: '100%' }}></Box>
//         </Box>
//       </Box>

//       {/* Amount Breakdown Section - UPDATED */}
//       <Box sx={{ p: 0.5, border: '1px solid black', borderTop: 'none' }}>
//         {/* First row - Sub Total */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', borderRight: '1px solid black' }}></Box>
//           <Box sx={{ width: '280px', borderRight: '1px solid black' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Sub Total</Typography>
//           </Box>
//           <Box sx={{ width: '325px', textAlign: 'right' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹21000.00</Typography>
//           </Box>
//         </Box>

//         {/* Second row - Amount Withheld */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', borderRight: '1px solid black' }}></Box>
//           <Box sx={{ width: '280px', borderRight: '1px solid black' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Amount Withheld</Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>(Section 194 H)</Typography>
//           </Box>
//           <Box sx={{ width: '325px', textAlign: 'right' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'red' }}>(-)</Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'red' }}>₹2100.00</Typography>
//           </Box>
//         </Box>

//         {/* Third row - Total */}
//         <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//           <Box sx={{ width: '45px', borderRight: '1px solid black' }}></Box>
//           <Box sx={{ width: '280px', borderRight: '1px solid black' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total</Typography>
//           </Box>
//           <Box sx={{ width: '325px', textAlign: 'right' }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹18900.00</Typography>
//           </Box>
//         </Box>

//         {/* Amount in words and E. & O.E */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
//           <Box>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Amount Chargeable (in words)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               INR Twenty One Thousand Only
//             </Typography>
//           </Box>
//           <Typography variant="body2">E. & O.E</Typography>
//         </Box>
//       </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for Ms. Divya Bharathi
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* Computer Generated Quote text */}
//       <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
//         This is a Computer Generated Quote
//       </Typography>
//     </Paper>
//   );
// }

// 'use client';
// import { Box, Typography, Paper } from '@mui/material';

// // Function to convert number to words (INR format)
// const numberToWords = (num) => {
//   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
//   if (num === 0) return 'Zero';
//   const convert = (n) => {
//     if (n < 10) return units[n];
//     if (n < 20) return teens[n - 10];
//     if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
//     if (n < 1000) return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
//     return '';
//   };
//   let word = '';
//   let crore = Math.floor(num / 10000000);
//   let lakh = Math.floor((num % 10000000) / 100000);
//   let thousand = Math.floor((num % 100000) / 1000);
//   let hundred = Math.floor((num % 1000));
//   if (crore > 0) word += `${convert(crore)} Crore `;
//   if (lakh > 0) word += `${convert(lakh)} Lakh `;
//   if (thousand > 0) word += `${convert(thousand)} Thousand `;
//   if (hundred > 0) word += `${convert(hundred)}`;
//   return word.trim() + ' Only';
// };

// export default function QuotationHeader({ data, callViewAPI, heading, lable }) {
//   // Calculate total from line_items
//   const totalAmount = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
//   const totalQuantity = data?.line_items?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
//   const amountInWords = numberToWords(Math.floor(totalAmount));

//   return (
//     <Paper elevation={0} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
//         {heading}
//       </Typography>
//       {/* Main header table with compact layout */}
//       <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #000', mb: 0 }}>
//         {/* First row - Seller info and Invoice details */}
//         <Box sx={{ display: 'flex' }}>
//           {/* Seller info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.state}
//             </Typography>
//             <Typography variant="body2">
//             </Typography>
//           </Box>
//           {/* Invoice details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Invoice No and Date */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   {lable}
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.estimate_number || data?.invoice_number || data?.salesorder_number}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Delivery Note and Payment Mode */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Mode/Terms of Payment
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.payment_terms || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Reference No & Date and Other References */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Reference No. & Date
//                 </Typography >
//                 <Typography variant="body2">
//                   {data?.reference_number || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Other References
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.other_references || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//         {/* Second row - Consignee and Dispatch/Delivery details */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Consignee info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Consignee (Ship to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.shipping_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.address || ''} {data?.shipping_address?.city || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.shipping_address?.zip || ''} {data?.shipping_address?.state || ''} {data?.shipping_address?.country || ''}
//             </Typography>
//           </Box>
//           {/* Dispatch and Delivery details */}
//           <Box sx={{ width: '50%' }}>
//             {/* Buyer's Order No and Dated */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Buyer's Order No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dated
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.buyer_order_date || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Dispatched through and Destination */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatched through
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_through || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Destination
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.destination || ""}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Bill of Lading and Motor Vehicle No */}
//             <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Bill of Lading/LR-RR No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.bill_of_lading || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Motor Vehicle No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.motor_vehicle_no || ""}
//                 </Typography>
//               </Box>
//             </Box>
//             {/* Dispatch Doc No and Delivery Note Date */}
//             <Box sx={{ display: 'flex' }}>
//               <Box sx={{ width: '50%', p: 0.5, borderRight: '1px solid #000' }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Dispatch Doc No.
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.dispatch_doc_no || ""}
//                 </Typography>
//               </Box>
//               <Box sx={{ width: '50%', p: 0.5 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                   Delivery Note Date
//                 </Typography>
//                 <Typography variant="body2">
//                   {data?.delivery_note_date || ""}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//         {/* Third row - Buyer and Terms of Delivery */}
//         <Box sx={{ display: 'flex', borderTop: '1px solid #000' }}>
//           {/* Buyer info */}
//           <Box sx={{
//             width: '50%',
//             p: 0.5,
//             borderRight: '1px solid #000',
//           }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Buyer (Bill to)
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {data?.billing_address?.attention || ""}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.address || ''} {data?.billing_address?.zip || ''}
//             </Typography>
//             <Typography variant="body2">
//               {data?.billing_address?.city || ''} {data?.billing_address?.state || ''} {data?.billing_address?.country || ''}
//             </Typography>
//           </Box>
//           {/* Terms of Delivery */}
//           <Box sx={{ width: '50%', p: 0.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               Terms of Delivery
//             </Typography>
//             <Typography variant="body2">
//               {data?.terms_of_delivery || ""}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//       {/* Table Section */}

//       <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid black' }}>

//   <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//     <Box sx={{ width: '45px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2" noWrap>Sl.No</Typography>
//     </Box>
//     <Box sx={{ width: '280px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2" noWrap>Description of Goods</Typography>
//     </Box>
//     <Box sx={{ width: '54px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2" noWrap>HSN</Typography>
//     </Box>
//     <Box sx={{ width: '70px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2" noWrap>Quantity</Typography>
//     </Box>
//     <Box sx={{ width: '70px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2" noWrap>Rate</Typography>
//     </Box>
//     <Box sx={{ width: '40px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2" noWrap>per</Typography>
//     </Box>
//     <Box sx={{ width: '90px', p: 0.5, textAlign: 'center' }}>
//       <Typography variant="body2" noWrap>Amount</Typography>
//     </Box>
//   </Box>

//   {/* Items */}
//   {data?.line_items?.map((row, index) => (
//     <Box sx={{ display: 'flex', width: '100%' }} key={index}>
//       <Box sx={{ width: '45px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//         <Typography variant="body2">{index + 1}</Typography>
//       </Box>
//       <Box sx={{ width: '280px', borderRight: '1px solid black', p: 0.5 }}>
//         <Typography variant="body2">{row?.name || 'N/A'}</Typography>
//         <Typography variant="caption">{row?.description || ''}</Typography>
//       </Box>
//       <Box sx={{ width: '54px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//         <Typography variant="body2">{row?.hsn_sac || ''}</Typography>
//       </Box>
//       <Box sx={{ width: '70px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//         <Typography variant="body2">{row?.quantity || '0'}</Typography>
//       </Box>
//       <Box sx={{ width: '70px', borderRight: '1px solid black', p: 0.5, textAlign: 'right' }}>
//         <Typography variant="body2">{parseFloat(row?.rate || 0).toFixed(2)}</Typography>
//       </Box>
//       <Box sx={{ width: '40px', borderRight: '1px solid black', p: 0.5, textAlign: 'center' }}>
//         <Typography variant="body2">{row?.unit || '₹'}</Typography>
//       </Box>
//       <Box sx={{ width: '90px', p: 0.5, textAlign: 'right' }}>
//         <Typography variant="body2">{parseFloat(row?.item_total || 0).toFixed(2)}</Typography>
//       </Box>
//     </Box>
//   ))}

//   {/* Empty space with borders */}
//   <Box sx={{ display: 'flex', width: '100%', height: '250px' }}>
//     <Box sx={{ width: '45px', borderRight: '1px solid black', height: '100%' }}></Box>
//     <Box sx={{ width: '280px', borderRight: '1px solid black', height: '100%' }}></Box>
//     <Box sx={{ width: '54px', borderRight: '1px solid black', height: '100%' }}></Box>
//     <Box sx={{ width: '70px', borderRight: '1px solid black', height: '100%' }}></Box>
//     <Box sx={{ width: '70px', borderRight: '1px solid black', height: '100%' }}></Box>
//     <Box sx={{ width: '40px', borderRight: '1px solid black', height: '100%' }}></Box>
//     <Box sx={{ width: '90px', height: '100%' }}></Box>
//   </Box>
// </Box>

//       {/* Amount Breakdown Section */}
//       {/* Amount Breakdown Section */}
// <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid black', borderTop: 'none' }}>
//   {/* Sub Total */}
//   <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//     <Box sx={{ width: '45px', borderRight: '1px solid black' }}></Box>
//     <Box sx={{ width: '280px', borderRight: '1px solid black', p: 0.5 }}>
//       <Typography variant="body2">Sub Total</Typography>
//     </Box>
//     <Box sx={{ width: '325px', p: 0.5, textAlign: 'right' }}>
//       <Typography variant="body2">₹21000.00</Typography>
//     </Box>
//   </Box>

//   {/* Amount Withheld */}
//   <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//     <Box sx={{ width: '45px', borderRight: '1px solid black' }}></Box>
//     <Box sx={{ width: '280px', borderRight: '1px solid black', p: 0.5 }}>
//       <Typography variant="body2">Amount Withheld</Typography>
//       <Typography variant="body2">(Section 194 H)</Typography>
//     </Box>
//     <Box sx={{ width: '325px', p: 0.5, textAlign: 'right' }}>
//       <Typography variant="body2" sx={{ color: 'red' }}>(-)</Typography>
//       <Typography variant="body2" sx={{ color: 'red' }}>₹2100.00</Typography>
//     </Box>
//   </Box>

//   {/* Total */}
//   <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
//     <Box sx={{ width: '45px', borderRight: '1px solid black' }}></Box>
//     <Box sx={{ width: '280px', borderRight: '1px solid black', p: 0.5 }}>
//       <Typography variant="body2">Total</Typography>
//     </Box>
//     <Box sx={{ width: '325px', p: 0.5, textAlign: 'right' }}>
//       <Typography variant="body2">₹18900.00</Typography>
//     </Box>
//   </Box>

//   {/* Amount in words and E. & O.E */}
//   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
//     <Box sx={{ width: '280px', borderRight: '' }}>
//       <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//         Amount Chargeable (in words)
//       </Typography>
//       <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//         INR {amountInWords}
//       </Typography>
//     </Box>
//     <Box sx={{ width: '135px', textAlign: 'right' }}>
//       <Typography variant="body2">E. & O.E</Typography>
//     </Box>
//   </Box>
// </Box>

//       {/* Declaration and Signature */}
//       <Box sx={{ display: 'flex', width: '100%' }}>
//         <Box sx={{ border: '1px solid black', borderTop: 'none', p: 0.5, flex: 2 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Declaration</Typography>
//           <Typography variant="body2">
//             We declare that this invoice shows the actual price of the
//             goods described and that all particulars are true and
//             correct.
//           </Typography>
//         </Box>
//         <Box sx={{ border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, flex: 1 }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
//             <Typography variant="body2" sx={{ textAlign: 'right', width: '100%' }}>
//               for {data?.customer_name || 'Customer Name'}
//             </Typography>
//             <Box sx={{ borderTop: '1px solid black', width: '80%', mt: 1 }}>
//               <Typography variant="body2" sx={{ textAlign: 'center' }}>Authorised Signatory</Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* Computer Generated Quote text */}
//       <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
//         This is a Computer Generated Quote
//       </Typography>
//     </Paper>
//   );
// }
"use client";
import { Box, Typography, Paper } from "@mui/material";

// Function to convert number to words (INR format)
const numberToWords = (num) => {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero";

  const convert = (n) => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
    if (n < 1000)
      return `${units[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
    return "";
  };

  let word = "";
  let crore = Math.floor(num / 10000000);
  let lakh = Math.floor((num % 10000000) / 100000);
  let thousand = Math.floor((num % 100000) / 1000);
  let hundred = Math.floor(num % 1000);

  if (crore > 0) word += `${convert(crore)} Crore `;
  if (lakh > 0) word += `${convert(lakh)} Lakh `;
  if (thousand > 0) word += `${convert(thousand)} Thousand `;
  if (hundred > 0) word += `${convert(hundred)}`;

  return word.trim() + " Only";
};

export default function QuotationHeader({ data, callViewAPI,isStatus, heading, lable }) {
  // Calculate total from line_items for fallbacks
  const totalAmount = (data?.line_items || data?.items)?.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0) || 0;
  const totalQuantity = (data?.line_items || data?.items)?.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) || 0;
  // Use total or totalAmount for amount in words
  const amountInWords = numberToWords(Math.floor(data?.total || totalAmount));

  return (
    <Paper
      elevation={0}
      sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        {heading}
      </Typography>

      {/* Main header table with compact layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #000",
          mb: 0,
        }}
      >
        {/* First row - Seller info and Invoice details */}
        <Box sx={{ display: "flex" }}>
          {/* Seller info */}
          <Box sx={{ 
            width: '50%', 
            p: 0.5, 
            borderRight: '1px solid #000',
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {(isStatus === "Bill"||"PurchaseOrder" & isStatus !== "Quote") ? ''|| data?.organization.org_name :data?.customer_name || data?.billing_address?.[0]?.attention || ''}
            </Typography>
            <Typography variant="body2">
              {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote") ? ''|| data?.organization.state :data?.billing_address?.state || ''|| data?.billing_address?.[0]?.state }
            </Typography>
            <Typography variant="body2">
              {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote") ? ''|| data?.organization.country  :data?.billing_address?.country || ''|| data?.billing_address?.[0]?.country}
            </Typography>
          </Box>

          {/* Invoice details */}
          <Box sx={{ width: "50%" }}>
            {/* Invoice No and Date */}
            <Box sx={{ display: "flex", borderBottom: "1px solid #000" }}>
              <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #000" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {lable}
                </Typography>
                <Typography variant="body2">
                  {data?.estimate_number || data?.invoice_number || data?.salesorder_number || data?.purchase_number|| data?.bill_number|| ''}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Dated
                </Typography>
                <Typography variant="body2">
                  {data?.date_formatted || new Date(data?.billDate || data?.date).toLocaleDateString("en-GB") || ''}
                </Typography>
              </Box>
            </Box>

            {/* Delivery Note and Payment Mode */}
            <Box sx={{ display: "flex", borderBottom: "1px solid #000" }}>
              <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #000" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Delivery Note
                </Typography>
                <Typography variant="body2">
                  {data?.delivery_note || ""}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Mode/Terms of Payment
                </Typography>
                <Typography variant="body2">
                  {data?.payment_terms_label || data?.payment_terms || ""}
                </Typography>
              </Box>
            </Box>

            {/* Reference No & Date and Other References */}
            <Box sx={{ display: "flex", borderBottom: "1px solid #000" }}>
              <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #000" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Reference No. & Date
                </Typography>
                <Typography variant="body2">
                  {data?.reference_number || ""}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Other References
                </Typography>
                <Typography variant="body2">
                  {data?.other_references || ""}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Second row - Consignee and Dispatch/Delivery details */}
        <Box sx={{ display: "flex", borderTop: "1px solid #000" }}>
          {/* Consignee info */}
          <Box
            sx={{
              width: "50%",
              p: 0.5,
              borderRight: "1px solid #000",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Consignee (Ship to)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote") ? ''||data?.organization.org_name  :data?.shipping_address?.attention || ''}
            </Typography>
            <Typography variant="body2">
              {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote") ? ''|| data?.organization.first_street :data?.shipping_address?.address|| ''} 
            </Typography>
            <Typography variant="body2">
            {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote") ? ''|| data?.organization.city :data?.shipping_address?.city|| ''} - {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote") ? ''|| data?.organization.zip :data?.shipping_address?.zip|| ''} {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote")? ''|| data?.organization.state :data?.shipping_address?.state || '' } {(isStatus === "Bill"||"PurchaseOrder"& isStatus !== "Quote") ? ''|| data?.organization.country : data?.shipping_address?.country || ''}
            </Typography>
          </Box>

          {/* Dispatch and Delivery details */}
          <Box sx={{ width: "50%" }}>
            {/* Buyer's Order No and Dated */}
            <Box sx={{ display: "flex", borderBottom: "1px solid #000" }}>
              <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #000" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Buyer&apos;s Order No.
                </Typography>
                <Typography variant="body2">
                  {data?.buyer_order_no || ""}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Dated
                </Typography>
                <Typography variant="body2">
                  {data?.buyer_order_date || ""}
                </Typography>
              </Box>
            </Box>

            {/* Dispatched through and Destination */}
            <Box sx={{ display: "flex", borderBottom: "1px solid #000" }}>
              <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #000" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Dispatched through
                </Typography>
                <Typography variant="body2">
                  {data?.dispatch_through || ""}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Destination
                </Typography>
                <Typography variant="body2">
                  {data?.destination || ""}
                </Typography>
              </Box>
            </Box>

            {/* Bill of Lading and Motor Vehicle No */}
            <Box sx={{ display: "flex", borderBottom: "1px solid #000" }}>
              <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #000" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Bill of Lading/LR-RR No.
                </Typography>
                <Typography variant="body2">
                  {data?.bill_of_lading || ""}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Motor Vehicle No.
                </Typography>
                <Typography variant="body2">
                  {data?.motor_vehicle_no || ""}
                </Typography>
              </Box>
            </Box>

            {/* Dispatch Doc No and Delivery Note Date */}
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #000" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Dispatch Doc No.
                </Typography>
                <Typography variant="body2">
                  {data?.dispatch_doc_no || ""}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", p: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Delivery Note Date
                </Typography>
                <Typography variant="body2">
                  {data?.delivery_note_date || ""}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Third row - Buyer and Terms of Delivery */}
        <Box sx={{ display: "flex", borderTop: "1px solid #000" }}>
          {/* Buyer info */}
          <Box
            sx={{
              width: "50%",
              p: 0.5,
              borderRight: "1px solid #000",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Buyer (Bill to)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {data?.billing_address?.attention || data?.billing_address?.[0]?.attention || ''}
            </Typography>
            <Typography variant="body2">
              {data?.billing_address?.address || data?.billing_address?.[0]?.address || ''} {data?.billing_address?.zip || data?.billing_address?.[0]?.zip || ''}
            </Typography>
            <Typography variant="body2">
              {data?.billing_address?.city || data?.billing_address?.[0]?.city || ''} {data?.billing_address?.state || data?.billing_address?.[0]?.state || ''} {data?.billing_address?.country || data?.billing_address?.[0]?.country || ''}
            </Typography>
          </Box>

          {/* Terms of Delivery */}
          <Box sx={{ width: "50%", p: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Terms of Delivery
            </Typography>
            <Typography variant="body2">
              {data?.terms_of_delivery || ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Table Section */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {/* Table Header */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            borderBottom: "1px solid black",
          }}
        >
          <Box
            sx={{
              width: "45px",
              border: "1px solid black",
              borderBottom: "none",
              p: 0.5,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" noWrap>
              Sl.No
            </Typography>
          </Box>
          <Box
            sx={{
              width: "280px",
              border: "1px solid black",
              borderLeft: "none",
              borderBottom: "none",
              p: 0.5,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" noWrap>
              Description of Goods
            </Typography>
          </Box>
          <Box
            sx={{
              width: "55px",
              border: "1px solid black",
              borderLeft: "none",
              borderBottom: "none",
              p: 0.5,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" noWrap>
              HSN
            </Typography>
          </Box>
          <Box
            sx={{
              width: "70px",
              border: "1px solid black",
              borderLeft: "none",
              borderBottom: "none",
              p: 0.5,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" noWrap>
              Quantity
            </Typography>
          </Box>
          <Box
            sx={{
              width: "70px",
              border: "1px solid black",
              borderLeft: "none",
              borderBottom: "none",
              p: 0.5,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" noWrap>
              Rate
            </Typography>
          </Box>
          <Box
            sx={{
              width: "40px",
              border: "1px solid black",
              borderLeft: "none",
              borderBottom: "none",
              p: 0.5,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" noWrap>
              per
            </Typography>
          </Box>
          <Box
            sx={{
              width: "90px",
              border: "1px solid black",
              borderLeft: "none",
              borderBottom: "none",
              p: 0.5,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" noWrap>
              Amount
            </Typography>
          </Box>
        </Box>

        {/* Items */}
        {(data?.line_items || data?.items)?.map((row, index) => (
          <Box sx={{ display: 'flex', width: '100%' }} key={index}>
            <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', p: 0.5, textAlign: 'center' }}>
              <Typography variant="body2">{index + 1}</Typography>
            </Box>
            <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5 }}>
              <Typography variant="body2">{row?.name || row?.details|| 'N/A'}</Typography>
              <Typography variant="caption">{row?.description || ''}</Typography>
            </Box>
            <Box
              sx={{
                width: "55px",
                border: "1px solid black",
                borderLeft: "none",
                borderTop: "none",
                p: 0.5,
                textAlign: "center",
              }}
            >
              <Typography variant="body2">{row?.hsn_sac || ""}</Typography>
            </Box>
            <Box
              sx={{
                width: "70px",
                border: "1px solid black",
                borderLeft: "none",
                borderTop: "none",
                p: 0.5,
                textAlign: "center",
              }}
            >
              <Typography variant="body2">{row?.quantity || "0"}</Typography>
            </Box>
            <Box
              sx={{
                width: "70px",
                border: "1px solid black",
                borderLeft: "none",
                borderTop: "none",
                p: 0.5,
                textAlign: "right",
              }}
            >
              <Typography variant="body2">
                {parseFloat(row?.rate || 0).toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                width: "40px",
                border: "1px solid black",
                borderLeft: "none",
                borderTop: "none",
                p: 0.5,
                textAlign: "center",
              }}
            >
              <Typography variant="body2">{row?.unit || "₹"}</Typography>
            </Box>
            <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', p: 0.5, textAlign: 'right' }}>
              <Typography variant="body2">{parseFloat(row?.item_total || row?.amount || 0).toFixed(2)}</Typography>
            </Box>
          </Box>
        ))}

        {/* Empty space with borders */}
        <Box sx={{ display: "flex", width: "100%", height: "250px" }}>
          <Box
            sx={{
              width: "45px",
              border: "1px solid black",
              borderTop: "none",
              height: "100%",
            }}
          ></Box>
          <Box
            sx={{
              width: "280px",
              border: "1px solid black",
              borderLeft: "none",
              borderTop: "none",
              height: "100%",
            }}
          ></Box>
          <Box
            sx={{
              width: "55px",
              border: "1px solid black",
              borderLeft: "none",
              borderTop: "none",
              height: "100%",
            }}
          ></Box>
          <Box
            sx={{
              width: "70px",
              border: "1px solid black",
              borderLeft: "none",
              borderTop: "none",
              height: "100%",
            }}
          ></Box>
          <Box
            sx={{
              width: "70px",
              border: "1px solid black",
              borderLeft: "none",
              borderTop: "none",
              height: "100%",
            }}
          ></Box>
          <Box
            sx={{
              width: "40px",
              border: "1px solid black",
              borderLeft: "none",
              borderTop: "none",
              height: "100%",
            }}
          ></Box>
          <Box
            sx={{
              width: "90px",
              border: "1px solid black",
              borderLeft: "none",
              borderTop: "none",
              height: "100%",
            }}
          ></Box>
        </Box>

        {/* Amount Breakdown Section */}
        {/* Amount Breakdown Section */}
{/* Amount Breakdown Section */}
<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
  {/* Sub Total */}
  <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
    <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}>
      <Typography variant="body2">Sub Total</Typography>
    </Box>
    <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
      <Typography variant="body2">{totalQuantity.toFixed(1)}</Typography>
    </Box>
    <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5, textAlign: 'right' }}>
      <Typography variant="body2">₹{data?.sub_total || data?.subtotal || totalAmount.toFixed(2)}</Typography>
    </Box>
  </Box>

  {/* Amount Withheld (Conditional) */}
  {(data?.tax_total || data?.tax_amount) !== 0 && (
    <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
      <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
      <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}>
        <Typography variant="body2">Amount Withheld (Section 194 H)</Typography>
      </Box>
      <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
      <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}></Box>
      <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
      <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
      <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ color: data?.tax_type === 'TDS' ? 'red' : 'inherit' }}>
          {(data?.tax_type || data?.tds_tcs) === 'TDS' ? `(-)${data?.tax_total || data?.tax_amount}` : data?.tax_total}
        </Typography>
      </Box>
    </Box>
  )}

  {/* Total */}
  <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid black' }}>
    <Box sx={{ width: '45px', border: '1px solid black', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '280px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}>
      <Typography variant="body2">Total</Typography>
    </Box>
    <Box sx={{ width: '55px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5, textAlign: 'center' }}>
      <Typography variant="body2">{totalQuantity.toFixed(1)}</Typography>
    </Box>
    <Box sx={{ width: '70px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '40px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5 }}></Box>
    <Box sx={{ width: '90px', border: '1px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', p: 0.5, textAlign: 'right' }}>
      <Typography variant="body2">₹{data?.total_formatted || data?.total|| totalAmount.toFixed(2)}</Typography>
    </Box>
  </Box>
</Box>
      </Box>

      {/* Amount in Words */}
      <Box sx={{ p: 0.5, border: "1px solid black", borderTop: "none" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Amount Chargeable (in words)
          </Typography>
          <Typography variant="body2">E. & O.E</Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          INR {amountInWords}
        </Typography>
      </Box>

      {/* Declaration and Signature */}
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box
          sx={{ border: "1px solid black", borderTop: "none", p: 0.5, flex: 2 }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Declaration
          </Typography>
          <Typography variant="body2">
            We declare that this invoice shows the actual price of the goods
            described and that all particulars are true and correct.
          </Typography>
        </Box>
        <Box
          sx={{
            border: "1px solid black",
            borderLeft: "none",
            borderTop: "none",
            p: 0.5,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{ textAlign: "right", width: "100%" }}
            >
              for {data?.customer_name || ""}
            </Typography>
            <Box sx={{ borderTop: "1px solid black", width: "80%", mt: 1 }}>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Authorised Signatory
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Computer Generated Quote text */}
    </Paper>
  );
}
