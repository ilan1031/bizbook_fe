
"use client";
import React from 'react';
import { 
  Typography,
  TextField,
  IconButton,
  Button,
  Divider,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function NewItemDialog() {
  return (
    <Paper sx={{ 
      width: '100%', 
      maxWidth: '600px', 
      borderRadius: '4px',
      boxShadow: 'none',
      p: 2,
      backgroundColor: '#ffffff'
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",      overflow: 'hidden',
 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', fontSize: '18px' }}>
          New Item
        </Typography>
        {/* <IconButton size="small" sx={{ color: '#ff0000' }}>
          <CloseIcon />
        </IconButton> */}
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Type */}
      <Typography variant="body2" sx={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
        Type <InfoOutlinedIcon sx={{ fontSize: '16px', ml: 0.5, color: '#757575' }} />
      </Typography>
      <RadioGroup row defaultValue="goods">
        <FormControlLabel value="goods" control={<Radio size="small" />} label="Goods" />
        <FormControlLabel value="service" control={<Radio size="small" />} label="Service" />
      </RadioGroup>

      {/* Name */}
      <Typography variant="body2" sx={{ fontSize: '14px', mt: 2, color: 'error.main' }}>
        Name*
      </Typography>
      <TextField fullWidth size="small" />

      {/* Unit */}
      <Typography variant="body2" sx={{ fontSize: '14px', mt: 2, display: 'flex', alignItems: 'center' }}>
        Unit <InfoOutlinedIcon sx={{ fontSize: '16px', ml: 0.5, color: '#757575' }} />
      </Typography>
      <Select fullWidth size="small" displayEmpty>
        <MenuItem value=""><em>Select or type to add</em></MenuItem>
        <MenuItem value="pcs">Pieces</MenuItem>
        <MenuItem value="box">Box</MenuItem>
        <MenuItem value="kg">Kilogram</MenuItem>
      </Select>

      <Divider sx={{ my: 2 }} />

      {/* Sales & Purchase Information */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Sales */}
        <div style={{ flex: 1 }}>
          <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Sales Information" />
          <Typography variant="body2" sx={{ fontSize: '14px', mt: 1, color: 'error.main' }}>
            Selling Price*
          </Typography>
          <TextField fullWidth size="small" type="number" />

          <Typography variant="body2" sx={{ fontSize: '14px', mt: 2, color: 'error.main' }}>
            Account*
          </Typography>
          <Select fullWidth size="small" defaultValue="Sales">
            <MenuItem value="Sales">Sales</MenuItem>
          </Select>

          <Typography variant="body2" sx={{ fontSize: '14px', mt: 2 }}>
            Description
          </Typography>
          <TextField fullWidth size="small" multiline rows={2} />
        </div>

        {/* Purchase */}
        <div style={{ flex: 1 }}>
          <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Purchase Information" />
          <Typography variant="body2" sx={{ fontSize: '14px', mt: 1, color: 'error.main' }}>
            Cost Price*
          </Typography>
          <TextField fullWidth size="small" type="number" />

          <Typography variant="body2" sx={{ fontSize: '14px', mt: 2, color: 'error.main' }}>
            Account*
          </Typography>
          <Select fullWidth size="small" defaultValue="Cost of Goods Sold">
            <MenuItem value="Cost of Goods Sold">Cost of Goods Sold</MenuItem>
          </Select>

          <Typography variant="body2" sx={{ fontSize: '14px', mt: 2 }}>
            Description
          </Typography>
          <TextField fullWidth size="small" multiline rows={2} />

          <Typography variant="body2" sx={{ fontSize: '14px', mt: 2 }}>
            Preferred Vendor
          </Typography>
          <Select fullWidth size="small" displayEmpty>
            <MenuItem value=""><em>None</em></MenuItem>
          </Select>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Track Inventory */}
      <FormControlLabel control={<Checkbox size="small" />} label="Track Inventory for this item" />
      <Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
        You cannot enable/disable inventory tracking once you&apos;ve created transactions for this item
      </Typography>

      {/* Note */}
      <div style={{ padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px', marginTop: '15px' }}>
        <Typography variant="body2" sx={{ fontSize: '14px', color: '#795548' }}>
          Note: You can configure the opening stock and stock tracking for this item under the Items module.
        </Typography>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button variant="contained" sx={{ backgroundColor: '#2196f3', textTransform: 'none' }}>Save</Button>
        <Button variant="text" sx={{ textTransform: 'none' }}>Cancel</Button>
      </div>
    </Paper>
  );
}
