"use client";
import React, { useState } from "react";
import {
  Box, TextField, Typography, Button, InputAdornment, Paper, List, 
  ListItemText, Dialog, DialogTitle, DialogContent, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, 
  Select, FormControl, FormControlLabel, Checkbox, Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter } from "next/navigation";
import { Settings as SettingsIcon } from "lucide-react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const TCStax = () => {
  // State variables
  const [searchValue, setSearchValue] = useState("");
  const [projects] = useState([]);
  const [openTcsDialog, setOpenTcsDialog] = useState(false);
  const [openNewTcsDialog, setOpenNewTcsDialog] = useState(false);
  const router = useRouter();
  
  // Form states
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [natureOfCollection, setNatureOfCollection] = useState("");
  const [isHigherRate, setIsHigherRate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Handler functions
  const handleSearchChange = (e) => setSearchValue(e.target.value);
  const handleOpenTcsDialog = () => setOpenTcsDialog(true);
  const handleCloseTcsDialog = () => setOpenTcsDialog(false);
  const handleOpenNewTcsDialog = () => setOpenNewTcsDialog(true);
  const handleCloseNewTcsDialog = () => setOpenNewTcsDialog(false);
  const handleSaveNewTcs = () => handleCloseNewTcsDialog();
    
  return (
    <>
      {/* Project Selector */}
      <Box sx={{ position: "relative", width: "100%", maxWidth: 340 }}>
        <Paper elevation={3} sx={{  boxShadow: "3", overflow: "hidden" }}>
          {/* Search Input */}
          <Box sx={{ padding: "8px" }}>
            <TextField
              fullWidth size="small" placeholder="Search"
              value={searchValue} onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#757575", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Results Area */}
          <Box sx={{ maxHeight: "200px", overflowY: "auto", padding: "8px 16px", borderTop: "1px solid #f0f0f0" }}>
            {projects.length === 0 ? (
              <Typography sx={{ color: "#757575", textAlign: "center", fontSize: "14px" }}>
                NO RESULTS FOUND
              </Typography>
            ) : (
              <List dense disablePadding>
                {projects.map((project) => (
                  <ListItemText key={project.id} primary={project.name} />
                ))}
              </List>
            )}
          </Box>

          {/* Manage TCS Button */}
          <Box sx={{ borderTop: "1px solid #f0f0f0", padding: "3px" }}>
            <Button
              startIcon={<SettingsIcon size={20} color="#2196f3" />}
              sx={{ textTransform: "none", color: "#2196f3", width: "100%" }}
              onClick={handleOpenTcsDialog}
            >
              Manage TCS
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* TCS Management Dialog */}
      <Dialog open={openTcsDialog} onClose={handleCloseTcsDialog} maxWidth="md">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="h6">Manage TCS</Typography>
          <IconButton onClick={handleCloseTcsDialog}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: 0 }}>
          <Box sx={{ padding: "16px 24px" }}>
            <Typography variant="subtitle1" sx={{ marginBottom: "16px" }}>TCS taxes</Typography>

            {/* New TCS Tax Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <Button variant="contained" onClick={handleOpenNewTcsDialog}>+ New TCS Tax</Button>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>TAX NAME</TableCell>
                    <TableCell>RATE (%)</TableCell>
                    <TableCell>NATURE OF COLLECTION</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" sx={{ color: "#757575" }}>
                        No TCS Taxes to show
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>

      {/* New TCS Tax Dialog */}
      <Dialog open={openNewTcsDialog} onClose={handleCloseNewTcsDialog} maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="h6">New TCS</Typography>
          <IconButton onClick={handleCloseNewTcsDialog}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: "24px" }}>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {/* Tax Name and Rate */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Box sx={{ width: "50%" }}> 
                <Typography component="label" htmlFor="tax-name" sx={{ display: "block", mb: 0.5, color: "#DC2626" }}>
                  Tax Name*
                </Typography>
                <TextField id="tax-name" fullWidth size="small" value={taxName} onChange={(e) => setTaxName(e.target.value)} />
              </Box>
              <Box sx={{ width: "50%" }}>
                <Typography component="label" htmlFor="tax-rate" sx={{ display: "block", mb: 0.5, color: "#DC2626" }}>
                  Rate (%)*  
                </Typography>
                <TextField id="tax-rate" fullWidth size="small" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
              </Box>
            </Box>

            {/* Nature of Collection */}
            <Box sx={{ mb: 3, width: "50%" }}>
              <Typography component="label" sx={{ display: "block", mb: 0.5, color: "#DC2626" }}>
                Nature of Collection*
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={natureOfCollection}
                  onChange={(e) => setNatureOfCollection(e.target.value)}
                  size="small"
                  displayEmpty
                  renderValue={(selected) => !selected ? "Select a Tax Type..." : selected}
                >
                  <MenuItem value="Type 1">6CF - Parking lots</MenuItem>
                  <MenuItem value="Type 2">6CE - Scrap</MenuItem>
                  <MenuItem value="Type 3">6CG - Toll plaza</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Default Account Info */}
            <Box sx={{ display: "flex", mb: 3, py: 1.5, backgroundColor: "#f5f5f5", px: 2, borderRadius: "4px" }}>
              <Box sx={{ backgroundColor: "#1976D2", color: "white", borderRadius: "50%", mr: 1.5, mt: 0.3 }}>i</Box>
              <Box>
                <Typography sx={{ fontSize: "14px" }}>
                  By default, TCS will be tracked under <strong>TCS Payable</strong> and <strong>TCS Receivable</strong> accounts.
                </Typography>
                <Button startIcon={<EditOutlinedIcon />} sx={{ color: "#1976D2", p: 0 }}>Edit</Button>
              </Box>
            </Box>

            {/* Higher TCS Rate Checkbox */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Checkbox checked={isHigherRate} onChange={(e) => setIsHigherRate(e.target.checked)} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>This is a Higher TCS Rate</Typography>
                    <Tooltip title="Information about Higher TCS Rate">
                      <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </Box>
                }
              />
              {isHigherRate && (
                <Box sx={{ mt: 2 }}>
                  <Typography component="label" sx={{ display: "block", mb: 0.5, color: "#DC2626" }}>
                    Reason for Higher TCS Rate*
                  </Typography>
                  <TextField fullWidth size="small" value={reason} onChange={(e) => setReason(e.target.value)} />
                </Box>
              )}
            </Box>

            {/* Applicable Period */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography>Applicable Period</Typography>
                  <Tooltip title="Information about Applicable Period">
                    <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography component="label" sx={{ display: "block", mb: 0.5 }}>Start Date</Typography>
                    <DatePicker value={startDate} onChange={(newValue) => setStartDate(newValue)} 
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography component="label" sx={{ display: "block", mb: 0.5 }}>End Date</Typography>
                    <DatePicker value={endDate} onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
                  </Box>
                </Box>
              </Box>
            </LocalizationProvider>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
              <Button variant="contained" onClick={handleSaveNewTcs}>Save</Button>
              <Button variant="outlined" onClick={handleCloseNewTcsDialog}>Cancel</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TCStax;