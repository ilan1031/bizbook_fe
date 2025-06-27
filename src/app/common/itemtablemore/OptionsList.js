"use client";

import { useState } from "react";
import { Paper, Box, List, ListItem, ListItemText, Divider } from "@mui/material";

const OptionsList = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        elevation={2}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          boxShadow: 2,
          width: 200,
        }}
      >
        <List sx={{ py: 0 }}>
          {/* First Two Items with Divider */}
          {["Show Additional Information", "Clone"].map((option, index) => (
            <div key={option}>
              <ListItem
                button
                sx={{
                  py: 1.5,
                  bgcolor: selectedIndex === index ? "#408dfb" : "transparent",
                  "&:hover": { bgcolor: "#408dfb" },
                  "& .MuiTypography-root": {
                    color: selectedIndex === index ? "white" : "#4a5568",
                  },
                  "&:hover .MuiTypography-root": {
                    color: "white",
                    
                  },
                }}
                onClick={() => setSelectedIndex(index)}
              >
                <ListItemText primary={option} />
              </ListItem>
              <Divider />
            </div>
          ))}

          {/* Remaining Three Items Inside a Container */}
          <Box sx={{ p: 1 }}>
            {["Insert New Row", "Insert Items in Bulk", "Insert New Header"].map((option, index) => (
              <ListItem
                button
                key={option}
                sx={{
                  py: 1.5,
                  bgcolor: selectedIndex === index + 2 ? "#408dfb" : "transparent",
                  "&:hover": { bgcolor: "#408dfb" },
                  "& .MuiTypography-root": {
                    color: selectedIndex === index + 2 ? "white" : "#4a5568",
                  },
                  "&:hover .MuiTypography-root": {
                    color: "white",
                  },
                }}
                onClick={() => setSelectedIndex(index + 2)}
              >
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </Box>
        </List>
      </Paper>
    </Box>
  );
};

export default OptionsList;
