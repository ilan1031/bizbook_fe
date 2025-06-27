import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const CustomFilterMenu = ({
  anchorEl,
  handleClose,
  favoritesData,
  filtersData,
  onSelect,
  onFavoriteToggle,
  selectedType,
}) => {
  const [filters, setFilters] = useState(filtersData);
  const [favorites, setFavorites] = useState(favoritesData);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFavorites = useMemo(() => {
    return favoritesData.filter((fav) =>
      fav.label?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [searchTerm, favoritesData]);

  const filteredFilters = useMemo(() => {
    return filtersData.filter((filter) =>
      filter.label?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [searchTerm, filtersData]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // ✅ Updates state correctly
  };

  const handleToggleFavorite = (filter) => {
    const updatedFilters = filteredFilters.map((f) =>
      f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
    );

    setFilters(updatedFilters);

    // Update favorites
    const updatedFilter = updatedFilters.find((f) => f.id === filter.id);
    if (updatedFilter.isFavorite) {
      setFavorites([...filteredFavorites, updatedFilter]);
    } else {
      setFavorites(filteredFavorites.filter((f) => f.id !== filter.id));
    }

    onFavoriteToggle(filter);
  };

  const handleFilterSelect = (filter) => {
    onSelect(filter.label, filter.value,filter.key);
    handleClose();
  };

  return (
    <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
  PaperProps={{
    style: {
      width: '220px',
      maxHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
    },
  }}
  MenuListProps={{
    style: {
      padding: 0,
      flexGrow: 1,
    },
  }}
>
  <Box>
    {/* Search Bar */}
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        p: 1.5,
      }}
    >
      <InputBase
        placeholder="Search..."
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{
          border: '1px solid #ddd',
          px: 1,
          py: 0.5,
          fontSize: '0.75rem',
          '&:hover': { borderColor: 'primary.main' },
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: '#aaa' }} />
          </InputAdornment>
        }
      />
    </Box>

    {/* Favorites Section */}
    {filteredFavorites.length > 0 && (
      <Box>
        <Typography variant="subtitle2" sx={{ p: 1, pl: 1.5, color: '#666', fontSize: '0.75rem', backgroundColor: '#f9f9f9' }}>
          FAVORITES
        </Typography>
        <List disablePadding sx={{ maxHeight: '150px', overflow: 'auto' }}>
          {filteredFavorites.map((filter) => (
            <ListItem 
              key={`fav-${filter.default_customview_id}`}
              dense
              // button
              onClick={() => handleFilterSelect(filter)}
              sx={{ py: 0.5, pl: 1.5,cursor: "pointer", backgroundColor: selectedType === filter.label ? '#f0f7ff' : 'inherit', '&:hover': { backgroundColor: '#f5f5f5' }}}
            >
              <ListItemText 
                primary={filter.label} 
                primaryTypographyProps={{ fontSize: '0.85rem', color: selectedType === filter.label ? 'primary.main' : 'menu.text.default', fontWeight: selectedType === filter.label ? 'bold' : 'normal' }} 
              />
              <IconButton 
                edge="end" 
                size="small" 
                onClick={(e) => { e.stopPropagation(); handleToggleFavorite(filter); }}
                sx={{ padding: '2px' }}
              >
                <StarIcon fontSize="small" sx={{ color: '#f3cf00' }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    )}

    {/* Filters Section */}
    <Typography variant="subtitle2" sx={{ p: 1, pl: 1.5, color: '#666', fontSize: '0.75rem', backgroundColor: '#f9f9f9' }}>
      DEFAULT FILTERS
    </Typography>
    <List disablePadding sx={{ flexGrow: 1, overflow: 'auto' }}>
      {filteredFilters.map((filter) => (
        <ListItem 
          key={filter.default_customview_id}
          dense
          // button
          onClick={() => handleFilterSelect(filter)}
          sx={{ py: 0.5, pl: 1.5,cursor: "pointer", backgroundColor: selectedType === filter.label ? '#f0f7ff' : 'inherit', '&:hover': { backgroundColor: '#f5f5f5' }}}
        >
          <ListItemText 
            primary={filter.label} 
            primaryTypographyProps={{ fontSize: '0.85rem', color: selectedType === filter.label ? 'primary.main' : 'menu.text.default', fontWeight: selectedType === filter.label ? 'bold' : 'normal' }} 
          />
          <IconButton 
            edge="end" 
            size="small" 
            onClick={(e) => { e.stopPropagation(); handleToggleFavorite(filter); }}
            sx={{ padding: '2px' }}
          >
            {filter.isFavorite ? <StarIcon fontSize="small" sx={{ color: '#f3cf00' }} /> : <StarBorderIcon fontSize="small" sx={{ color: '#aaa' }} />}
          </IconButton>
        </ListItem>
      ))}
    </List>

    {/* Footer */}
    <ListItem 
      // button
      alignItems="center"
      sx={{ py: 1.5, px: 2, position: 'sticky', bottom: 0, borderTop: '1px solid #f0f0f0', backgroundColor: '#fff', '&:hover': { backgroundColor: '#f5f5f5' }, zIndex: 10 }}
    >
      <IconButton
        size="small"
        sx={{ mr: 2, bgcolor: 'transparent', color: 'primary.main', '&:hover': { bgcolor: 'transparent' } }}
      >
        <AddCircleOutlinedIcon fontSize="inherit" />
      </IconButton>
      <Typography variant="subtitle2" color="primary">
        New Custom View
      </Typography>
    </ListItem>
  </Box>
</Menu>

  );
};

export default CustomFilterMenu;
