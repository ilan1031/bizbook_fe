
// "use client";
// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   IconButton,
//   Button,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import CreateNewItem from "../CreateItemTable/newitem/page";

// const InventoryScreen = () => {
//   const [openItem, setOpenItem] = useState(false);
  
//   const handleOpenItem = () => {
//     setOpenItem(true);
//   };

//   const handleCloseItem = () => {
//     setOpenItem(false);
//   };

//   const items = [
//     { id: 1, name: "Apple Mobiles", rate: "₹60,000.00", stock: null },
//     { id: 2, name: "HP Laptops", rate: "₹50,000.00", stock: null },
//     { id: 3, name: "Pen", rate: "₹15.00", stock: { amount: "1,000.00", unit: "box" } },
//     { id: 4, name: "Pencil", rate: "₹12.00", stock: null },
//     { id: 5, name: "Samsung Galaxy S10 Plus", rate: "₹100.00", stock: null },
//   ];

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "60vh", padding: 2 ,boxshadow:"2"}}>
//       <List sx={{ width: "100%", maxWidth: 300 }}>
//         {items.map((item) => (
//           <ListItem key={item.id} sx={{ backgroundColor: "transparent", transition: "background-color 0.3s", padding: "8px 16px", "&:hover": { backgroundColor: "#2196f3", color: "#fff" } }}>
//             <ListItemText
//               primary={<Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "inherit" }}>{item.name}</Typography>}
//               secondary={<Typography variant="body2" sx={{ color: "inherit" }}>Rate: {item.rate}</Typography>}
//             />
//             {item.stock && <Chip label={`Stock: ${item.stock.amount} ${item.stock.unit}`} size="small" color="success" sx={{ ml: "auto", color: "inherit" }} />}
//           </ListItem>
//         ))}
//       </List>
//       <Button startIcon={<AddCircleOutlineIcon />} sx={{ marginTop: 2 }} onClick={handleOpenItem}>
//         Add New Item
//       </Button>
//       <Dialog open={openItem} onClose={handleCloseItem}>
//         <DialogContent>
//           <CreateNewItem onClose={handleCloseItem} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseItem} color="primary">Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default InventoryScreen;
"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateNewItem from "../CreateItemTable/newitem/page";

const items = [
  { id: 1, name: "Apple Mobiles", rate: "₹60,000.00", stock: { amount: "6,000.00", unit: "box" } },
  { id: 2, name: "HP Laptops", rate: "₹50,000.00", stock: null },
  { id: 3, name: "Pen", rate: "₹15.00", stock: { amount: "1,000.00", unit: "box"} },
  { id: 4, name: "Pencil", rate: "₹12.00", stock: null },
  { id: 5, name: "Samsung Galaxy S10 Plus", rate: "₹100.00", stock: null },
];

const CustomDialog = ({ open, onClose, children }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
);

const InventoryScreen = () => {
  const [openItem, setOpenItem] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "50vh", padding: 2, overflowY: "auto" }}>
      <List sx={{ width: "100%", maxWidth: 600, maxHeight: "20vh", overflowY: "auto" }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              backgroundColor: "transparent",
              transition: "background-color 0.3s",
              padding: "8px 16px",
              "&:hover": { backgroundColor: "#2196f3", color: "#fff" },
            }}
          >
            <ListItemText
              primary={<Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "inherit" }}>{item.name}</Typography>}
              secondary={<Typography variant="body2" sx={{ color: "inherit" }}>Rate: {item.rate}</Typography>}
            />
            {item.stock && <Chip label={`Stock: ${item.stock.amount} ${item.stock.unit}`} size="small" color="success" sx={{ ml: "auto", color: "inherit" }} />}
          </ListItem>
        ))}
      </List>
      <Button startIcon={<AddCircleOutlineIcon />} sx={{ marginTop: 2 }} onClick={() => setOpenItem(true)}>
        Add New Item
      </Button>
      <CustomDialog open={openItem} onClose={() => setOpenItem(false)}>
        <CreateNewItem onClose={() => setOpenItem(false)} />
      </CustomDialog>
    </Box>
  );
};

export default InventoryScreen;
