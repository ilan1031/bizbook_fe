"use client";

import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  ThemeProvider,
  Paper,
  createTheme,
} from "@mui/material";
import MileageExpenseForm from "./recordMileage/page";
import RecordExpense from "./recordExpense/page";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`expense-tabpanel-${index}`}
      aria-labelledby={`expense-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ExpenseTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    // <ThemeProvider theme={theme}>
    // </ThemeProvider>
    <Box sx={{ width: "100%", backgroundColor: "white" }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          width: "100%",
          paddingLeft: "20px",
          position: "fixed",
          width: "100%",
          pt: 3,
          zIndex: 100,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="expense tabs"
          // sx={{
          //   minHeight: "48px",
          //   "& .MuiTabs-flexContainer": {
          //     gap: 0,
          //   },
          //   "& .MuiTabs-indicator": {
          //     top: 0,
          //     bottom: "auto",
          //   },
          // }}
          TabIndicatorProps={{
            style: {
              top: 0,
              bottom: "auto",
              marginLeft: 0,
            },
          }}
        >
          <Tab label="Record Expense" id="expense-tab-0" />
          <Tab label="Record Mileage" id="expense-tab-1" />
        </Tabs>
      </Paper>

      <Box>
        <TabPanel value={value} index={0}>
          <RecordExpense />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <MileageExpenseForm />
        </TabPanel>
      </Box>
    </Box>
  );
}
