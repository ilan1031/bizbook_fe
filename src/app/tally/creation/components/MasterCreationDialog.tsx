import React from "react";
import { 
  Box, 
  Dialog, 
  DialogContent, 
  IconButton, 
  Typography 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

// Styled Dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <Box
      sx={{ m: 0, p: 2, bgcolor: "#3b71c6", color: "white", fontWeight: "bold" as const }}
      {...other}
    >
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute" as const,
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </Box>
  );
}

const MasterCreationDialog = ({ open, onClose, mastersData, selectedItem, onItemClick }: any) => {
  return (
    <BootstrapDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          maxWidth: "450px",
          width: "100%",
          borderRadius: 0,
          height: "auto",
        },
      }}
    >
      <BootstrapDialogTitle onClose={onClose}>
        Master Creation
      </BootstrapDialogTitle>
      <DialogContent>
        <Box sx={{ bgcolor: "#e6f0ff", display: "flex" as const, flexDirection: "column" as const }}>
          {Object.keys(mastersData).map((category) => (
            <Box key={category}>
              <Box
                sx={{
                  bgcolor: "#e6f0ff",
                  color: "black",
                  fontWeight: "bold" as const,
                  py: 0.5,
                  pl: 2,
                  textTransform: "uppercase" as const,
                  fontSize: "14px",
                }}
              >
                {mastersData[category].title}
              </Box>
              {mastersData[category].items.map((item) => (
                <Box
                  key={item}
                  onClick={() => onItemClick(item)}
                  sx={{
                    bgcolor: selectedItem === item ? "#ffcc00" : "#e6f0ff",
                    "&:hover": {
                      bgcolor: selectedItem === item ? "#ffcc00" : "#d1e0ff",
                    },
                    py: 0.3,
                    pl: 4,
                    cursor: "pointer" as const,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: selectedItem === item ? "medium" : "normal",
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default MasterCreationDialog;