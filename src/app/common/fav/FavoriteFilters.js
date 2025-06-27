"use client";

import { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  InputBase,
  InputAdornment,
  Button,
  Collapse,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const dummyDefaultFilters = [
  { id: 1, label: "All Invoices", isFavorite: false },
  { id: 2, label: "Draft", isFavorite: false },
  { id: 3, label: "Locked", isFavorite: false },
  { id: 4, label: "Pending Approval", isFavorite: false },
  { id: 5, label: "Approved", isFavorite: false },
  { id: 6, label: "Customer Viewed", isFavorite: false },
  { id: 7, label: "Partially Paid", isFavorite: false },
  { id: 8, label: "Unpaid", isFavorite: false },
  { id: 9, label: "Overdue", isFavorite: false },
  { id: 10, label: "Payment Initiated", isFavorite: false },
  { id: 11, label: "Paid", isFavorite: false },
  { id: 12, label: "Void", isFavorite: false },
  { id: 13, label: "Debit Note", isFavorite: false },
  { id: 14, label: "Write Off", isFavorite: false },
];

const FavoriteFilters = ({ onSelect }) => {
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");

  const [showFavorites, setShowFavorites] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const handleToggleFavorite = (filter) => {
    const updatedFilters = filters.map((f) =>
      f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
    );
    setFilters(updatedFilters);

    const updatedFilter = updatedFilters.find((f) => f.id === filter.id);
    if (updatedFilter.isFavorite) {
      setFavorites([...favorites, updatedFilter]);
    } else {
      setFavorites(favorites.filter((f) => f.id !== filter.id));
    }
  };

  const filteredFilters = filters.filter((filter) =>
    filter.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: 300, height: "50vh", display: "flex", flexDirection: "column", border: "1px solid #ddd" }}>
      {/* Sticky Search Bar */}
      <Box sx={{ p: 1.5, backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #ddd" }}>
        <InputBase
          placeholder="Search..."
          fullWidth
          sx={{ fontSize: "14px", border: "1px solid #ddd", px: 1, py: 0.5, borderRadius: 1 }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "#aaa" }} />
            </InputAdornment>
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* Filter List */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5 }}>
        {favorites.length > 0 && (
          <>
            {/* Favorites Section Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                p: 1,
                backgroundColor: "#f9f9f9",
              }}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <Typography variant="subtitle2" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                FAVORITES
              </Typography>
              {showFavorites ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            {/* Favorites List */}
            <Collapse in={showFavorites}>
              <List>
                {favorites.map((filter) => (
                  <ListItem
                    key={filter.id}
                    button
                    onClick={() => onSelect(filter.label)}
                    sx={{
                      "&:hover": { backgroundColor: "#408dfb ", color: "white" },
                      fontSize: "14px",
                    }}
                  >
                    <ListItemText primary={filter.label} sx={{ fontSize: "12px" }} />
                    <IconButton onClick={() => handleToggleFavorite(filter)}>
                      <StarIcon sx={{ color: "#FFD700" }} /> {/* Yellow Star */}
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Filters Section Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            p: 1,
            backgroundColor: "#f9f9f9",
          }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Typography variant="subtitle2" sx={{ fontSize: "12px", fontWeight: "bold" }}>
            DEFAULT FILTERS
          </Typography>
          {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>

        {/* Filters List */}
        <Collapse in={showFilters}>
          <List>
            {filteredFilters.map((filter) => (
             <ListItem
             key={filter.id}
             button
             onClick={() => onSelect(filter.label)}
             sx={{
               "&:hover": { backgroundColor: "#408dfb ", color: "white" }, // Blue BG, White Text
               fontSize: "14px",
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
             }}
           >
             <ListItemText primary={filter.label} sx={{ fontSize: "12px" }} />
             <IconButton
               onClick={() => handleToggleFavorite(filter)}
               sx={{
                 "&:hover svg": { color: "#FFFFFF" }, // White Star on Hover ⭐
               }}
             >
               {filter.isFavorite ? (
                 <StarIcon sx={{ color: "#FFD700" }} /> // Yellow Star 🌟
               ) : (
                 <StarBorderIcon sx={{ color: "#aaa" }} /> // Default Grey Star
               )}
             </IconButton>
           </ListItem>
           
            ))}
          </List>
        </Collapse>
      </Box>

      {/* Sticky Footer */}
      <Box
  sx={{
    p: 1.5,
    backgroundColor: "#fff",
    position: "sticky",
    bottom: 0,
    borderTop: "1px solid #ddd",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    cursor: "pointer",
  }}
>
  <AddCircleOutlinedIcon color="primary" fontSize="small" />
  <Typography variant="body2" color="primary">
    New Custom View
  </Typography>
</Box>
    </Box>
  );
};

export default FavoriteFilters;
