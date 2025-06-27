// "use client";
// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Radio,
//   TextField,
//   Button,
//   IconButton,
//   Dialog,
// } from "@mui/material";
// import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// // Close Icon Component with Click Handler
// const CloseIcon = ({ onClick }) => (
//   <IconButton onClick={onClick} sx={{ color: "#DB4437", cursor: "pointer" }}>
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20">
//       <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
//     </svg>
//   </IconButton>
// );

// export default function QuoteNumberPreferencesPage() {
//   const [open, setOpen] = useState(true); // Control popup visibility
//   const [autoGenerate, setAutoGenerate] = useState(true);
//   const [prefix, setPrefix] = useState("QT-");
//   const [nextNumber, setNextNumber] = useState("000004");

//   return (
//     <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//       <Box
//         sx={{
//           bgcolor: "#ffffff",
//           borderRadius: "4px",
//           boxShadow:
//             "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: "12px 12px",
//             borderBottom: "1px solid #EBEBEB",
//           }}
//         >
//           <Typography sx={{ fontWeight: 500, fontSize: "16px", color: "#000" }}>
//             Configure Quote Number Preferences
//           </Typography>
//           <CloseIcon onClick={() => setOpen(false)} />
//         </Box>

//         {/* Dialog Content */}
//         <Box sx={{ p: "16px 24px" }}>
//           <Box sx={{ display: "flex", mb: 3 }}>
//             <Box
//               sx={{
//                 backgroundColor: "#f5f5f5",
//                 borderRadius: "50%",
//                 width: "40px",
//                 height: "40px",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 mr: 2,
//                 flexShrink: 0,
//               }}
//             >
//               <BuildCircleOutlinedIcon sx={{ fontSize: 30, color: "#5F6368" }} />
//             </Box>
//             <Typography
//               variant="body2"
//               sx={{
//                 fontSize: "14px",
//                 lineHeight: "1.4",
//                 color: "#5F6368",
//                 flexGrow: 1,
//                 mt: 0.5,
//               }}
//             >
//               Configure multiple transaction number series to auto-generate transaction
//               numbers with unique prefixes according to your business needs.
//             </Typography>
//             <Button
//               variant="text"
//               sx={{
//                 color: "#4285F4",
//                 textTransform: "none",
//                 fontWeight: 500,
//                 fontSize: "14px",
//                 minWidth: "auto",
//                 p: "0 8px",
//                 ml: 2,
//                 height: "36px",
//               }}
//             >
//               Configure →
//             </Button>
//           </Box>

//           {/* Auto-Generate Radio Buttons */}
//           <Typography sx={{ mb: 2, fontSize: "14px", color: "#202124" }}>
//             Your quote numbers are set on auto-generate mode to save your time.
//             Are you sure about changing this setting?
//           </Typography>

//           <Box sx={{ mb: 1.5 }}>
//             <Box sx={{ display: "flex", mb: 1 }}>
//               <Radio
//                 checked={autoGenerate}
//                 onChange={() => setAutoGenerate(true)}
//                 size="small"
//                 sx={{ p: 0.5, mr: 1 }}
//               />
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Typography sx={{ fontSize: "14px" }}>
//                   Continue auto-generating quote numbers
//                 </Typography>
//                 <InfoOutlinedIcon fontSize="medium" sx={{ padding: "4px" }} />
//               </Box>
//             </Box>

//             {/* Show Inputs If Auto-Generate is Selected */}
//             {autoGenerate && (
//               <Box sx={{ ml: 4, mb: 2 }}>
//                 <Box sx={{ display: "flex", mb: 1 }}>
//                   <Box sx={{ mr: 2 }}>
//                     <Typography sx={{ fontSize: "14px", color: "#5F6368", mb: 0.5 }}>
//                       Prefix
//                     </Typography>
//                     <TextField
//                       value={prefix}
//                       onChange={(e) => setPrefix(e.target.value)}
//                       variant="outlined"
//                       size="small"
//                       inputProps={{ style: { fontSize: "14px", padding: "8px 10px" } }}
//                       sx={{ width: "90px", "& .MuiOutlinedInput-root": { borderRadius: "4px" } }}
//                     />
//                   </Box>

//                   <Box>
//                     <Typography sx={{ fontSize: "14px", color: "#5F6368", mb: 0.5 }}>
//                       Next Number
//                     </Typography>
//                     <TextField
//                       value={nextNumber}
//                       onChange={(e) => setNextNumber(e.target.value)}
//                       variant="outlined"
//                       size="small"
//                       inputProps={{ style: { fontSize: "14px", padding: "8px 10px" } }}
//                       sx={{ width: "220px", "& .MuiOutlinedInput-root": { borderRadius: "4px" } }}
//                     />
//                   </Box>
//                 </Box>
//               </Box>
//             )}

//             {/* Manual Entry Option */}
//             <Box sx={{ display: "flex" }}>
//               <Radio
//                 checked={!autoGenerate}
//                 onChange={() => setAutoGenerate(false)}
//                 size="small"
//                 sx={{ p: 0.5, mr: 1 }}
//               />
//               <Typography sx={{ fontSize: "14px" }}>Enter quote numbers manually</Typography>
//             </Box>
//           </Box>

//           {/* Action Buttons */}
//           <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
//             <Button
//               variant="contained"
//               sx={{
//                 textTransform: "none",
//                 bgcolor: "#4285F4",
//                 "&:hover": { bgcolor: "#3367D6" },
//                 borderRadius: "4px",
//                 boxShadow: "none",
//                 fontSize: "14px",
//                 py: 1,
//                 px: 3,
//               }}
//             >
//               Save
//             </Button>
//             <Button
//               variant="outlined"
//               sx={{
//                 textTransform: "none",
//                 color: "#5F6368",
//                 borderColor: "#DADCE0",
//                 "&:hover": { borderColor: "#DADCE0", bgcolor: "#F8F9FA" },
//                 borderRadius: "4px",
//                 boxShadow: "none",
//                 fontSize: "14px",
//                 py: 1,
//                 px: 3,
//               }}
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Dialog>
//   );
// }
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import Next.js Router
import {
  Box,
  Typography,
  Radio,
  TextField,
  Button,
  IconButton,
  Dialog,
} from "@mui/material";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const CloseIcon = ({ onClick }) => (
  <IconButton onClick={onClick} sx={{ color: "#DB4437", cursor: "pointer" }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20">
      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
    </svg>
  </IconButton>
);

export default function QuoteNumberPreferencesPage() {
  const router = useRouter(); // ✅ Initialize Router
  const [open, setOpen] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [prefix, setPrefix] = useState("QT-");
  const [nextNumber, setNextNumber] = useState("000004");

  // ✅ Close & Navigate function
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderRadius: "4px",
          boxShadow:
            "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: "12px 12px",
            borderBottom: "1px solid #EBEBEB",
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: "16px", color: "#000" }}>
            Configure Quote Number Preferences
          </Typography>
          <CloseIcon onClick={handleClose} /> {/* ✅ Close & Redirect */}
        </Box>

        {/* Dialog Content */}
        <Box sx={{ p: "16px 24px" }}>
          <Box sx={{ display: "flex", mb: 3 }}>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mr: 2,
                flexShrink: 0,
              }}
            >
              <BuildCircleOutlinedIcon sx={{ fontSize: 30, color: "#5F6368" }} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                lineHeight: "1.4",
                color: "#5F6368",
                flexGrow: 1,
                mt: 0.5,
              }}
            >
              Configure multiple transaction number series to auto-generate transaction
              numbers with unique prefixes according to your business needs.
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#4285F4",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "14px",
                minWidth: "auto",
                p: "0 8px",
                ml: 2,
                height: "36px",
              }}
            >
              Configure →
            </Button>
          </Box>

          {/* Auto-Generate Radio Buttons */}
          <Typography sx={{ mb: 2, fontSize: "14px", color: "#202124" }}>
            Your quote numbers are set on auto-generate mode to save your time.
            Are you sure about changing this setting?
          </Typography>

          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Radio
                checked={autoGenerate}
                onChange={() => setAutoGenerate(true)}
                size="small"
                sx={{ p: 0.5, mr: 1 }}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "14px" }}>
                  Continue auto-generating quote numbers
                </Typography>
                <InfoOutlinedIcon fontSize="medium" sx={{ padding: "4px" }} />
              </Box>
            </Box>

            {/* Show Inputs If Auto-Generate is Selected */}
            {autoGenerate && (
              <Box sx={{ ml: 4, mb: 2 }}>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Box sx={{ mr: 2 }}>
                    <Typography sx={{ fontSize: "14px", color: "#5F6368", mb: 0.5 }}>
                      Prefix
                    </Typography>
                    <TextField
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ style: { fontSize: "14px", padding: "8px 10px" } }}
                      sx={{ width: "90px", "& .MuiOutlinedInput-root": { borderRadius: "4px" } }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#5F6368", mb: 0.5 }}>
                      Next Number
                    </Typography>
                    <TextField
                      value={nextNumber}
                      onChange={(e) => setNextNumber(e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ style: { fontSize: "14px", padding: "8px 10px" } }}
                      sx={{ width: "220px", "& .MuiOutlinedInput-root": { borderRadius: "4px" } }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Manual Entry Option */}
            <Box sx={{ display: "flex" }}>
              <Radio
                checked={!autoGenerate}
                onChange={() => setAutoGenerate(false)}
                size="small"
                sx={{ p: 0.5, mr: 1 }}
              />
              <Typography sx={{ fontSize: "14px" }}>Enter quote numbers manually</Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "#4285F4",
                "&:hover": { bgcolor: "#3367D6" },
                borderRadius: "4px",
                boxShadow: "none",
                fontSize: "14px",
                py: 1,
                px: 3,
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#5F6368",
                borderColor: "#DADCE0",
                "&:hover": { borderColor: "#DADCE0", bgcolor: "#F8F9FA" },
                borderRadius: "4px",
                boxShadow: "none",
                fontSize: "14px",
                py: 1,
                px: 3,
              }}
              onClick={handleClose} // ✅ Close & Redirect
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
