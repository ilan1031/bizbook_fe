import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Popover, 
  Paper, 
  InputAdornment,
  Divider,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Styled components
const SearchTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#bdbdbd',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 10px',
    fontSize: '14px',
  },
});

const CustomListItem = styled(ListItem)(({ theme, selected }) => ({
  padding: '8px 16px',
  cursor: 'pointer',
  backgroundColor: selected ? '#1976d2' : 'transparent',
  color: selected ? 'white' : 'inherit',
  '&:hover': {
    backgroundColor: selected ? '#1976d2' : '#f5f5f5',
  },
}));

const DropdownHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 16px',
  color: '#666',
  fontSize: '14px',
  fontWeight: 500,
});

const DropdownComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('Employee Advance');

  // Options matching the image
  const options = [
    'Advance Tax',
    'Employee Advance',
    'Input Tax Credits',
    'Input CGST',
    'Input IGST',
    'Input SGST',
    'Prepaid Expenses'
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ width: '220px' }}>
      <Box
        onClick={handleClick}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: 'white',
          height: '36px',
          '&:hover': {
            borderColor: '#bdbdbd',
          }
        }}
      >
        <Box sx={{ color: '#1976d2', fontWeight: 500, fontSize: '14px' }}>
          {selectedOption}
        </Box>
        <KeyboardArrowDownIcon sx={{ color: '#666' }} />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { 
            width: '220px',
            maxHeight: '300px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            marginTop: '4px'
          }
        }}
      >
        <Box sx={{ p: 1 }}>
          <SearchTextField
            fullWidth
            placeholder="Search"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#999' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Divider />
        
        <List sx={{ p: 0 }}>
          {filteredOptions.map((option, index) => (
            <CustomListItem 
              key={index}
              selected={option === selectedOption}
              onClick={() => handleOptionSelect(option)}
            >
              <ListItemText 
                primary={option} 
                primaryTypographyProps={{ 
                  fontSize: '14px',
                  fontWeight: option === selectedOption ? 500 : 400 
                }} 
              />
              {option === selectedOption && (
                <CheckIcon sx={{ fontSize: 18 }} />
              )}
            </CustomListItem>
          ))}
        </List>
      </Popover>
    </Box>
  );
};

export default DropdownComponent;