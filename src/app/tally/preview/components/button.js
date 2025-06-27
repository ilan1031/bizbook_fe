// // components/ButtonComponents.jsx
// 'use client';
// import { Button } from '@mui/material';
// import { styled } from '@mui/system';

// export const NavButton = styled(Button)({
//   margin: '0 5px',
//   padding: '5px 10px',
//   fontSize: '12px',
//   backgroundColor: '#ffff00',
//   color: '#000',
//   '&:hover': {
//     backgroundColor: '#e6e600',
//   },
// });

// export const DownloadButton = styled(Button)({
//   backgroundColor: '#3498db',
//   color: '#fff',
//   fontWeight: 'bold',
//   borderRadius: '4px',
//   padding: '8px 16px',
//   '&:hover': {
//     backgroundColor: '#2980b9',
//   },
// });
// components/ButtonComponents.jsx
"use client"
import { Button } from "@mui/material"
import { styled } from "@mui/system"

export const NavButton = styled(Button)({
  margin: "0 5px",
  padding: "5px 10px",
  fontSize: "12px",
  backgroundColor: "#ffff00",
  color: "#000",
  "&:hover": {
    backgroundColor: "#e6e600",
  },
  minWidth: "auto",
  borderRadius: "2px",
  border: "1px solid #000",
})

export const DownloadButton = styled(Button)({
  backgroundColor: "#3498db",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "4px",
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "#2980b9",
  },
})
