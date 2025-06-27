// components/QuotationFooter.jsx
'use client';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

// Assuming NavButton is properly imported from '../components/button'
import { NavButton } from '../components/button';

export function QuotationAmount() {
  return (
    <>
      <Box sx={{ border: '1px solid #ccc', p: 1, mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Amount Chargeable (in words)</Typography>
        <Typography variant="body2">INR Thirty Five Thousand Four Hundred Only</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>₹ 35,400.00</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Typography variant="body2">E.&O.E</Typography>
      </Box>
    </>
  );
}

export function QuotationSignature() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
      <Box sx={{ width: '200px', textAlign: 'center' }}>
        <Typography variant="body2">for VVV and Co (Complete Modules)</Typography>
        <Box sx={{ mt: 4 }}></Box>
        <Typography variant="body2" sx={{ mt: 2 }}>Authorised Signatory</Typography>
      </Box>
    </Box>
  );
}

export function DocumentFooter() {
  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Typography variant="caption">This is a Computer Generated Document</Typography>
    </Box>
  );
}

export function NavigationBar() {
  return (
    <Box sx={{ position: 'absolute', bottom: 0, left: '20px', right: 0, backgroundColor: '#ffff00', p: 1, display: 'flex', justifyContent: 'space-between', height: '40px' }}>
      <Box>
        <NavButton variant="contained">PgUp</NavButton>
        <NavButton variant="contained">PgDn</NavButton>
        <NavButton variant="contained">PgRight »</NavButton>
        <NavButton variant="contained">PgLeft «</NavButton>
      </Box>
      <Box>
        <NavButton variant="contained">Home</NavButton>
        <NavButton variant="contained">End</NavButton>
        <NavButton variant="contained">Zoom</NavButton>
        <NavButton variant="contained">Mail</NavButton>
        <NavButton variant="contained">Esc</NavButton>
      </Box>
    </Box>
  );
}

export function PageInfo() {
  return (
    <Box>
      <Typography variant="caption" sx={{ position: 'absolute', bottom: '0.5px', left: '25px' }}>
        Page: 1 of 1
      </Typography>
      <Typography variant="caption" sx={{ position: 'absolute', bottom: '0.5px', left: '80px' }}>
        Invoice Date: 1-Apr-24 | Invoice No: 001
      </Typography>
    </Box>
  );
}

export function CompanyDetails() {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Seller Details:</Typography>
      <Typography variant="body2">Company Name: Ihub Solutions</Typography>
      <Typography variant="body2">Address: 123 Business Street, Tech City, India</Typography>
      <Typography variant="body2">GSTIN: 29ABCDE1234F2Z5</Typography>
      <Typography variant="body2">Phone: +91-9876543210</Typography>
    </Box>
  );
}

export function BuyerDetails() {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Buyer Details:</Typography>
      <Typography variant="body2">Client Name: John Doe</Typography>
      <Typography variant="body2">Address: 456 Client Lane, Metro City, India</Typography>
      <Typography variant="body2">GSTIN: 29XYZPQ7890G3H6</Typography>
      <Typography variant="body2">Phone: +91-9123456789</Typography>
    </Box>
  );
}

export function InvoiceTable() {
  return (
    <Table size="small" sx={{ mt: 2, mb: 2 }}>
      <TableHead>
        <TableRow>
          <TableCell>S.No</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Unit Price</TableCell>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>Product A</TableCell>
          <TableCell>5</TableCell>
          <TableCell>100.00</TableCell>
          <TableCell>500.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>Product B</TableCell>
          <TableCell>3</TableCell>
          <TableCell>150.00</TableCell>
          <TableCell>450.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export function InvoiceSummary() {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2">Subtotal: 950.00</Typography>
      <Typography variant="body2">Tax (18%): 171.00</Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Amount: 1121.00</Typography>
    </Box>
  );
}
