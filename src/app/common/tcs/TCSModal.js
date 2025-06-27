"use client";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from "@mui/material";

const natureOfCollectionOptions = [
  { value: "6CA", label: "6CA - Alcoholic liquor for human consumption" },
  { value: "6CB", label: "6CB - Timber obtained under forest lease" },
  { value: "6CC", label: "6CC - Timber obtained by any mode other than a forest lease" },
  { value: "6CD", label: "6CD - Any other forest produce (not being tendu leaves)" },
  { value: "6CE", label: "6CE - Scrap" },
  { value: "6CI", label: "6CI - Tendu leaves" },
  { value: "6CJ", label: "6CJ - Sale of minerals, being coal or lignite or iron ore" },
  { value: "6CK", label: "6CK - Cash sale of bullion and jewellery" },
  { value: "6CF", label: "6CF - Parking lots" },
  { value: "6CG", label: "6CG - Toll plaza" },
  { value: "6CH", label: "6CH - Mine or quarry" },
  { value: "6CL", label: "6CL - Sale of motor vehicle" },
  { value: "6CO", label: "6CO - Purchase of overseas tour program package" },
  { value: "6CP", label: "6CP - Educational loan taken from financial institution mentioned in section 80E" },
  { value: "6CQ", label: "6CQ - Remittance under LRS for purpose other than for purchase of overseas tour package or for educational loan taken from financial institution" },
  { value: "6CR", label: "6CR - Sale of goods" }
];

const higherTCSReasons = [
  { value: "non_pan", label: "Non-furnishing of PAN" },
  { value: "higher_rate_206CC", label: "Collection is at a higher rate under section 206CC on account of non-furnishing of PAN/Aadhaar by the collectee" },
  { value: "non_filing", label: "Non-filing of return of income" },
  { value: "higher_rate_206CCA", label: "Collection is at a higher rate in view of section 206CCA" }
];

const TCSModal = ({ open, handleClose, addTCS }) => {
  const [taxName, setTaxName] = useState("");
  const [rate, setRate] = useState("");
  const [natureOfCollection, setNatureOfCollection] = useState("");
  const [higherTCS, setHigherTCS] = useState(false);
  const [higherTCSReason, setHigherTCSReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = () => {
    if (!taxName || !rate || !natureOfCollection || !startDate || !endDate) {
      alert("Please fill all required fields!");
      return;
    }

    addTCS({
      taxName,
      rate,
      natureOfCollection,
      status: "Active", 
      higherTCS: higherTCS ? "Higher Rate" : "",
      higherTCSReason,
      startDate,
      endDate
    });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New TCS</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Tax Name" required value={taxName} onChange={(e) => setTaxName(e.target.value)} margin="normal" />
        <TextField fullWidth label="Rate (%)" required type="number" value={rate} onChange={(e) => setRate(e.target.value)} margin="normal" />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Nature of Collection</InputLabel>
          <Select value={natureOfCollection} onChange={(e) => setNatureOfCollection(e.target.value)}>
            {natureOfCollectionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Checkbox checked={higherTCS} onChange={(e) => setHigherTCS(e.target.checked)} />}
          label="This is a Higher TCS Rate"
        />

        {higherTCS && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Reason for Higher TCS Rate</InputLabel>
            <Select value={higherTCSReason} onChange={(e) => setHigherTCSReason(e.target.value)}>
              {higherTCSReasons.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} margin="normal" />
        <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TCSModal;
