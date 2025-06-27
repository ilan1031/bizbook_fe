"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  ClickAwayListener,
  Popper,
  TableRow,
  Paper,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const COLORS = {
  primary: "#408dfb",
  error: "#F44336",
  textPrimary: "#333333",
  textSecondary: "#66686b",
  borderColor: "#c4c4c4",
  hoverBg: "#f0f7ff",
  bgLight: "#f8f8f8",
};

const StyledTextField = styled("input")(({ error }) => ({
  height: "35px",
  width: "100%",
  padding: "6px 12px",
  border: `1px solid ${error ? COLORS.error : COLORS.borderColor}`,
  borderRadius: "7px",
  fontSize: "14px",
  backgroundColor: "#fff",
  "&:hover": {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.7px rgba(97, 160, 255, 0.3)`,
  },
  "&:focus": {
    outline: "none",
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 0.2rem rgba(97, 160, 255, 0.3)`,
  },
  "&::placeholder": {
    color: COLORS.textSecondary,
    opacity: 1,
  },
  /* Add these lines directly to the component styling */
  "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  /* For Firefox */
  "-moz-appearance": "textfield",
}));

const commonTextareaStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "7px",
  padding: "6px 12px",
  fontFamily: "inherit",
  fontSize: "14px",
  resize: "vertical",
  minHeight: "60px",
  maxHeight: "80px",
  lineHeight: "1.6",
  width: "100%",
  "&:hover": {
    borderColor: "#408dfb",
    boxShadow: "0 0 0 .7px #86b7fe",
  },
  "&:focus": {
    outline: "none",
    borderColor: "#408dfb",
    boxShadow: "0 0 0 0.2rem rgba(97, 160, 255, 0.3)",
  },
  "&::placeholder": {
    color: "#66686b",
    opacity: 1,
  },
};

const StyledTextarea = styled("textarea")({
  ...commonTextareaStyle,
});

const TableExpenses = ({ formik, expenseAccCategories, CalculateTax }) => {
  const [listExpenseAnchorEl, setListExpenseAnchorEl] = useState(null);
  const listExpenseOpen = Boolean(listExpenseAnchorEl);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleExpenseAccClick = (event, index) => {
    setListExpenseAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleExpenseAccClose = () => {
    setListExpenseAnchorEl(null);
  };

  const handleExpenseAccSelect = (option) => {
    formik.setFieldValue(
      `lineItems[${selectedIndex}].account_name`,
      option.account_name
    );
    formik.setFieldValue(
      `lineItems[${selectedIndex}].account_id`,
      option.account_id
    );
    handleExpenseAccClose();
  };

  const handleAddRow = () => {
    const newRow = {
      line_item_id: "",
      account_id: "",
      account_name: "",
      description: "",
      amount: "",
    };
    formik.setFieldValue("lineItems", [...formik.values.lineItems, newRow]);
  };

  const calculateTotalAmount = () => {
    let total = "0.00";

    formik.values.lineItems.forEach((item) => {
      if (item.amount !== null && item.amount !== "") {
        total = Number(total) + Number(item.amount);
      }
    });
    formik.setFieldValue("tot_amount", total);

    const entered_amount = parseFloat(total);
    const match = formik.values.expense_tax_percent.match(/\[(\d+)%\]/);
    const entered_percent = match ? parseFloat(match[1]) : 0;
    const inclusive_exclusive = formik.values.inclusive_exclusive;

    if (entered_amount && (entered_percent || entered_percent === 0)) {
      console.log("Running CalculateTax function");
      CalculateTax(entered_amount, entered_percent, inclusive_exclusive);
    } else {
      console.log("the required data is not available for calculate task");
    }
  };

  const handleRemoveLineItem = (indexToRemove) => {
    const updatedItems = formik.values.lineItems.filter(
      (_, index) => index !== indexToRemove
    );
    formik.setFieldValue("lineItems", updatedItems);
  };

  const handleAmountChange = (e, index) => {
    formik.setFieldValue(`lineItems[${index}].amount`, e.target.value);
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [formik.values.lineItems]);

  return (
    <Box>
      <Paper elevation={0}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            border: "1px solid #ddd",
            borderRight: "none",
            borderLeft: "none",
            borderBottom: "none",
            borderRadius: 2,
            boxShadow: "none",
            mb: 2,
          }}
        >
          <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell
                  sx={{
                    fontSize: "12px !important",
                    color: "#d61439 !important",
                    borderBottom: "1px solid #ddd",
                    borderRight: "none",
                    fontWeight: "550 !important",
                    padding: "5px !important",
                    pl: "25px !important",
                    width: "40% !important",
                  }}
                >
                  EXPENSE ACCOUNT
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "12px !important",
                    color: "#6c78a3 !important",
                    borderBottom: "1px solid #ddd",
                    borderRight: "none",
                    fontWeight: "550 !important",
                    padding: "0px 0px 0px 10px !important",
                  }}
                >
                  NOTES
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "12px !important",
                    color: "#d61439 !important",
                    borderBottom: "1px solid #ddd",
                    borderRight: "none",
                    textAlign: "right",
                    fontWeight: "550 !important",
                    padding: "0px 10px 0px 10px !important",
                  }}
                >
                  AMOUNT
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "11px !important",
                    color: "black !important",
                    borderBottom: "1px solid #ddd",
                    borderRight: "none",
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body with dynamic rows  */}

            <TableBody>
              {formik.values.lineItems.map((item, index) => (
                <TableRow key={index} sx={{ borderBottom: "none" }}>
                  <TableCell
                    sx={{
                      fontSize: "12px !important",
                      color: "#6c78a3 !important",
                      borderBottom: "1px solid #ddd",
                      borderRight: "none",
                      padding: "10px 20px 40px 20px !important",
                    }}
                  >
                    <StyledTextField
                      readOnly
                      name={`lineItems[${index}].account_name`}
                      placeholder="Select expense account"
                      error={
                        formik.touched.lineItems?.[index]?.account_id &&
                        Boolean(formik.errors.lineItems?.[index]?.account_id)
                      }
                      value={item.account_name}
                      onClick={(event) => {
                        handleExpenseAccClick(event, index);
                      }}
                      sx={{ cursor: "pointer" }}
                    />
                    {formik.touched.lineItems?.[index]?.account_id &&
                      formik.errors.lineItems?.[index]?.account_id && (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: COLORS.error,
                            pl: 1,
                          }}
                        >
                          {formik.errors.lineItems[index].account_id}
                        </Typography>
                      )}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "12px !important",
                      color: "#6c78a3 !important",
                      borderBottom: "1px solid #ddd",
                      borderRight: "none",
                      padding: "10px 0px 10px 5px !important",
                      width: "220px",
                    }}
                  >
                    <StyledTextarea
                      name={`lineItems[${index}].description`}
                      maxLength={500}
                      placeholder="Max. 500 characters"
                      value={formik.values.lineItems[index].description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.lineItems?.[index]?.description &&
                        Boolean(formik.errors.lineItems?.[index]?.description)
                      }
                      sx={{
                        width: "200px",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "12px !important",
                      color: "#6c78a3 !important",
                      borderBottom: "1px solid #ddd",
                      borderRight: "none",
                      textAlign: "right",
                      padding: "10px 0px 40px 20px !important",
                      width: "160px",
                    }}
                  >
                    {/* The Amount Field */}

                    <StyledTextField
                      name={`lineItems[${index}].amount`}
                      type="number"
                      value={formik.values.lineItems[index].amount}
                      onChange={(e) => handleAmountChange(e, index)}
                      error={
                        formik.touched.lineItems?.[index]?.amount &&
                        Boolean(formik.errors.lineItems?.[index]?.amount)
                      }
                      onBlur={formik.handleBlur}
                      sx={{
                        width: "150px",
                        "& input": {
                          "&::placeholder": {
                            color: "#978195",
                            fontWeight: "normal",
                          },
                        },
                      }}
                    />

                    {formik.touched.lineItems?.[index]?.amount &&
                      formik.errors.lineItems?.[index]?.amount && (
                        <Typography
                          sx={{
                            textAlign: "left",
                            pl: 2,
                            fontSize: "0.75rem",
                            color: COLORS.error,
                          }}
                        >
                          {formik.errors.lineItems[index].amount}
                        </Typography>
                      )}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "12px !important",
                      color: "#6c78a3 !important",
                      borderBottom: "1px solid #ddd",
                      borderRight: "none",
                      textAlign: "center",
                      padding: "8px 0px 40px 20px !important",
                      width: "70px",
                    }}
                  >
                    {formik.values.lineItems.length > 1 && (
                      <Box sx={{ cursor: "pointer" }}>
                        <CloseIcon
                          sx={{ color: "#d91439" }}
                          onClick={() => handleRemoveLineItem(index)}
                        />
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Below The Table */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            pt: 2,
          }}
        >
          <Box
            onClick={handleAddRow}
            sx={{
              bgcolor: "#f1f1fa",
              fontSize: "13px",
              fontWeight: "400",
              color: "BLACK",
              borderRadius: "5px",
              padding: "5px 10px",
              display: "flex",
              gap: 1,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <AddCircleOutlineIcon sx={{ color: "#408dfb", fontSize: "20px" }} />{" "}
            <Box s>Add New Row</Box>
          </Box>

          <Typography sx={{ fontSize: "16px", fontWeight: "600", mt: -2 }}>
            Expense Total ( ₹ )
          </Typography>

          <Typography sx={{ fontSize: "16px", fontWeight: "600", mt: -2 }}>
            {formik.values.tot_amount}
          </Typography>
        </Box>

        <Popper
          open={listExpenseOpen}
          anchorEl={listExpenseAnchorEl}
          placement="bottom-start"
          style={{ width: "350px", zIndex: 1 }}
        >
          <ClickAwayListener onClickAway={handleExpenseAccClose}>
            <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
              <Box>
                {expenseAccCategories.map((group, groupIndex) => (
                  <Box key={groupIndex} sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        p: 1,
                        backgroundColor: COLORS.bgLight,
                      }}
                    >
                      {group.category}
                    </Typography>

                    {group.options.map((option, index) => (
                      <Box
                        key={`${option.account_id}`}
                        sx={{
                          p: 1,
                          pl: 2,
                          fontSize: "13px",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: COLORS.hoverBg,
                          },
                        }}
                        onClick={() => handleExpenseAccSelect(option)}
                      >
                        {option.account_name}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Paper>
    </Box>
  );
};

export default TableExpenses;
