"use client";

import { useState } from "react";
import {
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const filterDropDown = ({
  anchorEl,
  handleClose,
  favoritesData = [] as any[],
  filtersData = [] as any[],
  onSelect, // callback for selecting item
  onFavoriteToggle, // callback for toggling favorite
  selectedType, // to show selected item
}) => {
  const [favoritesVisible, setFavoritesVisible] = useState<boolean>(true);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: "310px",
          maxHeight: "400px",
          marginLeft:"-15PX",
          marginTop:"10PX",
          padding: "0",
          display: "flex" as const,
          flexDirection: "column" as const,
          overflow: "hidden" as const,
        },
      }}
    >
      {/* Scrollable Content */}
      <div style={{ overflowY: "auto" as const, maxHeight: "340px", borderRadius:'20px' }}>
        {/* Favorites Section */}
        <MenuItem
          style={{
            fontSize: "0.75rem",
            justifyContent: "space-between" as const,
            height: "32px",
            backgroundColor: !favoritesVisible ? "#fff" : "#f5f5f5",
          }}
          onClick={() => setFavoritesVisible(!favoritesVisible)}
        >
          <span style={{ display: "flex" as const, alignItems: "center" as const, gap: "6px", fontWeight: "600" as const }}>
            <KeyboardArrowDownIcon
              style={{
                transform: favoritesVisible ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "0.2s",
                fontSize: "1rem",
              }}
            />
            FAVORITES
          </span>
          <span style={{
            fontSize: "10px",
            background: "#408DFB",
            padding: "2px 6px",
            color: "#fff",
            borderRadius: "10px",
          }}>
            {favoritesData.length}
          </span>
        </MenuItem>

        {/* Favorites List */}
        {favoritesVisible && favoritesData.map((fav) => (
          <MenuItem
            key={fav.key}
            onClick={() => onSelect(fav.title,fav.value)}
            style={{
              fontSize: "14px",
              justifyContent: "space-between" as const,
              height: "32px",
              color: "#333850",
              paddingLeft: "38px",
              fontWeight: "400" as const,
            }}
          >
            <span>{fav.title}</span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(fav);
              }}
            >
              <StarOutlinedIcon color="warning" fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}

        {/* Default Filters Section */}
        <MenuItem
          style={{
            fontSize: "0.75rem",
            justifyContent: "space-between" as const,
            height: "32px",
            backgroundColor: !filtersVisible ? "#fff" : "#f5f5f5",
          }}
          onClick={() => setFiltersVisible(!filtersVisible)}
        >
          <span style={{ display: "flex" as const, alignItems: "center" as const, gap: "6px", fontWeight: "bold" as const }}>
            <KeyboardArrowDownIcon
              style={{
                transform: filtersVisible ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "0.2s",
                fontSize: "1rem",
              }}
            />
            DEFAULT FILTERS
          </span>
          <span style={{
            fontSize: "10px",
            background: "#408DFB",
            padding: "2px 6px",
            color: "#fff",
            borderRadius: "10px",
          }}>
            {filtersData.length}
          </span>
        </MenuItem>

        {/* Default Filters List */}
        {filtersVisible && filtersData.map((filter) => (
          <MenuItem
            key={filter.key}
            onClick={() => onSelect(filter.title,filter.value)}
            style={{
              fontSize: "14px",
              color: "#333850",
              justifyContent: "space-between" as const,
              height: "32px",
              paddingLeft: "38px",
              fontWeight: "400" as const,
            }}
          >
            <span>{filter.title}</span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(filter);
              }}
            >
              {filter.is_favorite ? (
                <StarOutlinedIcon color="warning" fontSize="small" />
              ) : (
                <StarOutlineOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </MenuItem>
        ))}
      </div>

      {/* Sticky Footer */}
      <Divider />
      <div style={{ padding: "8px 13px 0px 18px", display: "flex" as const, alignItems: "center" as const, height: "25px" }}>
        <AddCircleOutlinedIcon fontSize="small" color="primary" style={{ width: "15px" }} />
        <span style={{ marginLeft: "8px", fontSize: "0.80rem", cursor: "pointer" as const }}>
          New Custom View
        </span>
      </div>
    </Menu>
  );
};

export default filterDropDown;
