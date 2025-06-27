"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiService from "../../../../src/services/axiosService";

const TaxModal = ({ onClose, taxType = 'TDS' }) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newTax, setNewTax] = useState({ name: '', rate: '', section: '', nature: '' });
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const organization_id = localStorage.getItem("organization_id");

  useEffect(() => {
    fetchTaxRates();
  }, [taxType]);

  const fetchTaxRates = async () => {
    setLoading(true);
    try {
      const endpoint = taxType === 'TDS' 
        ? `/api/v1/tax/tds/details?organization_id=${organization_id}`
        : `/api/v1/tax/tcs/details?organization_id=${organization_id}`;

      const response = await apiService({
        method: "GET",
        url: endpoint
      });

      const fetchedRates = response.data?.message || [];
      setTaxRates(fetchedRates.map(rate => ({
        id: rate._id,
        name: rate.name,
        rate: rate.rate,
        section: rate.section,
        nature: rate.nature,
        status: rate.status || 'Active'
      })));
    } catch (error) {
      console.error(`Error fetching ${taxType} rates:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTax = async () => {
    try {
      const endpoint = taxType === 'TDS' 
        ? `/api/v1/tax/tds/create`
        : `/api/v1/tax/tcs/create`;

      await apiService({
        method: "POST",
        url: endpoint,
        data: {
          organization_id,
          name: newTax.name,
          rate: newTax.rate,
          ...(taxType === 'TDS' ? { section: newTax.section } : { nature: newTax.nature })
        }
      });

      setOpenAddDialog(false);
      setNewTax({ name: '', rate: '', section: '', nature: '' });
      fetchTaxRates(); // Refresh the list
    } catch (error) {
      console.error(`Error adding ${taxType}:`, error);
    }
  };

  const handleDeleteTax = async (id) => {
    try {
      const endpoint = taxType === 'TDS' 
        ? `/api/v1/tax/tds/delete/${id}`
        : `/api/v1/tax/tcs/delete/${id}`;

      await apiService({
        method: "DELETE",
        url: endpoint,
        data: { organization_id }
      });

      fetchTaxRates(); // Refresh the list
    } catch (error) {
      console.error(`Error deleting ${taxType}:`, error);
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        p: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Manage {taxType}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ color: '#ef4444' }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {taxType} taxes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              textTransform: 'none',
              bgcolor: '#3b82f6',
              '&:hover': {
                bgcolor: '#2563eb'
              }
            }}
          >
            New {taxType} Tax
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>TAX NAME</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>RATE (%)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>
                  {taxType === 'TDS' ? 'SECTION' : 'NATURE OF COLLECTION'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : taxRates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No {taxType} rates found</TableCell>
                </TableRow>
              ) : (
                taxRates.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell>{tax.name}</TableCell>
                    <TableCell>{tax.rate}</TableCell>
                    <TableCell>{tax.section || tax.nature}</TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: '#10b981',
                          bgcolor: '#f0fdf4',
                          px: 2,
                          py: 0.5,
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}
                      >
                        {tax.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#3b82f6' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#ef4444' }}
                        onClick={() => handleDeleteTax(tax.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add New Tax Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New {taxType} Rate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tax Name"
            fullWidth
            value={newTax.name}
            onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Rate (%)"
            fullWidth
            value={newTax.rate}
            onChange={(e) => setNewTax({ ...newTax, rate: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={taxType === 'TDS' ? 'Section' : 'Nature of Collection'}
            fullWidth
            value={taxType === 'TDS' ? newTax.section : newTax.nature}
            onChange={(e) => setNewTax({ 
              ...newTax, 
              [taxType === 'TDS' ? 'section' : 'nature']: e.target.value 
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button onClick={handleAddTax} variant="contained" sx={{ bgcolor: '#3b82f6' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaxModal; 