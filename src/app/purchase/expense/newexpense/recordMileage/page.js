"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import apiService from "../../../../../services/axiosService"; // Import your custom API service
import {
  Box,
  Typography,
  ClickAwayListener,
  Popover,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputAdornment,
  ListSubheader,
  List,
  Button,
  Paper,
  Grid,
  IconButton,
  Divider,
  Dialog,
  ListItem,
  ListItemText,
  Checkbox,
  DialogTitle,
  DialogContent,
  Popper,
  DialogActions,
  ListItemSecondaryAction,
  Alert,
} from "@mui/material";
// import { useFormik } from "formik";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NightlightIcon from "@mui/icons-material/Nightlight";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ for App Router
import config from "../../../../../services/config";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "../../../../../components/SnackbarProvider";
import Image from "next/image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTheme } from "@mui/material/styles";

// Validation schema
const validationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  // employee: Yup.string(),
  // mileageMethod: Yup.string().required("Calculation method is required"),
  // startReading: Yup.number().when("mileageMethod", {
  //   is: "odometer",
  //   then: Yup.number()
  //     .required("Start reading is required")
  //     .positive("Must be positive"),
  //   otherwise: Yup.number().notRequired(),
  // }),
  // endReading: Yup.number().when("mileageMethod", {
  //   is: "odometer",
  //   then: Yup.number()
  //     .required("End reading is required")
  //     .positive("Must be positive")
  //     .moreThan(
  //       Yup.ref("startReading"),
  //       "End reading must be greater than start reading"
  //     ),
  //   otherwise: Yup.number().notRequired(),
  // }),
  distance: Yup.number()
    .required("Distance is required")
    .positive("Distance must be positive")
    .typeError("Distance must be a number"),
  tot_amount: Yup.number()
    .required("Amount is required")
    .min(0, "Minimum is 0"),
  paid_through_account_id: Yup.string().required(
    "Paid through account is required"
  ),
  // paidThrough: Yup.string().required("Paid through account is required"),
  // paymentTerm: Yup.string(),
  // invoiceNumber: Yup.string(),
  // notes: Yup.string(),
  // customerName: Yup.string().required("Customer name is required"),
});
const paidThroughAccCategory = [
  {
    category: "Other Current Liability",
    items: ["Employee Reimbursements", "TDS Payable"],
  },
  {
    category: "Equity",
    items: [
      "Capital Stock",
      "Distributions",
      "Dividends Paid",
      "Drawings",
      "Investments",
      "Opening Balance Offset",
      "Owner's Equity",
    ],
  },
];
// Main component
const MyClientOnlyComponent = () => {
  const theme = useTheme();
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  // Vendor states
  const [vendors, setVendors] = useState([]);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");

  // Customer states
  const [customers, setCustomers] = useState([]);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [isBillable, setIsBillable] = useState(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const [manageOpen, setManageOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "" });
  const [showInput, setShowInput] = useState(false); // <- add this state
  const changeLinkRef = useRef(null);
  const [openPopover, setOpenPopover] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mileageRate, setMileageRate] = useState(10); // default rate
  const [editedRate, setEditedRate] = React.useState("10"); // example
  const searchParams = useSearchParams();
  const expense_id = searchParams.get("expense_id");
  const clone_id = searchParams.get("clone_id");

  // const mileageRate = "60"; // example
  const [openSelect, setOpenSelect] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paidThrAccAnchorEl, setPaidThrAccAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const paidThrAccOpen = Boolean(paidThrAccAnchorEl);
  const page = useRef(1);
  const limit = useRef(50);
  const [errorList, setErrorList] = useState([]);

  const handlePaidThroughAccClick = (event) => {
    setPaidThrAccAnchorEl(event.currentTarget);
  };

  const handlePaidThroughAccClose = () => {
    setPaidThrAccAnchorEl(null);
    setSearchQuery("");
  };

  const handlePaidThroughAccSelect = (option) => {
    formik.setFieldValue("paid_through_account_id", option);
    handlePaidThroughAccClose();
  };

  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return paidThroughAccCategory;
    return paidThroughAccCategory
      .map((group) => ({
        category: group.category,
        items: group.items.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const handleDropdownToggle = () => {
    setProjectDropdownOpen(!projectDropdownOpen);
  };

  const handleProjectSelection = (project) => {
    setSelectedProject(project);
    setProjectDropdownOpen(false);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setEditedRate(mileageRate);
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
    setAnchorEl(null);
  };
  const handleSaveRate = () => {
    setMileageRate(Number(editedRate));
    handleClosePopover();
    // Update amount when rate changes
    const distance = Number(formik.values.distance || 0);
    formik.setFieldValue("tot_amount", distance * Number(editedRate));
    formik.setFieldValue("mileage_rate", editedRate);
  };

  // Update amount when distance changes
  const handleDistanceChange = (e) => {
    formik.handleChange(e);
    const distance = Number(e.target.value || 0);
    formik.setFieldValue("tot_amount", distance * mileageRate);
  };

  const handleManageEmployees = () => {
    setDropdownOpen(false);
    setManageOpen(true);
  };

  const handleSaveEmployee = async () => {
    const errors = [];

    if (!newEmployee.name) {
      errors.push("Employee name is missing");
    }

    if (!newEmployee.email) {
      errors.push("Enter the email address");
    }

    if (errors.length > 0) {
      setErrorList(errors);
      return;
    }

    try {
      const requestData = {
        employee_name: newEmployee.name,
        employee_email: newEmployee.email,
      };

      const saveEmployee = await apiService({
        method: "POST",
        url: `/api/v1/employee?organization_id=${organization_id}`,
        data: requestData,
        file: false,
      });
      setSearchTerm("");
      fetchEmployee(page.current, limit.current, "");
      const data = `${newEmployee.name} [ ${newEmployee.email} ]`;
      formik.setFieldValue("employee_name", data);
      setManageOpen(false);
      setOpenSelect(false);
      setErrorList([]);
    } catch (error) {
      setErrorList([
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      ]);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/employee/${id}`,
        customBaseUrl: config.PO_Base_url,
      });
      if (response?.data?.status) {
        showMessage(
          "Employee has been deleted from the organization.",
          "success"
        );
        fetchEmployee(page.current, limit.current, searchTerm);
      }
    } catch (error) {
      showMessage("Something went wrong.", "error");
    }
  };

  const organization_id =
    typeof window !== "undefined"
      ? localStorage.getItem("organization_id")
      : null;

  // Filter customers based on customer search query
  const filteredCustomers = customers.filter((customer) =>
    customer.contact_name
      .toLowerCase()
      .includes(customerSearchQuery.toLowerCase())
  );

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/customers?organization_id=${organization_id}`,
        });
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    if (organization_id) {
      fetchCustomers();
    }
    fetchMileageData();
  }, [organization_id]);

  useEffect(() => {
    fetchEmployee(page.current, limit.current, searchTerm);
  }, []);

  useEffect(() => {
    if (organization_id && (clone_id || expense_id)) {
      fetchMileageData();
    }
    // fetchCustomers();
  }, [organization_id]);

  const fetchEmployee = async (page, limit, searchValue) => {
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/employee?organization_id=${organization_id}`,
        customBaseUrl: config.PO_Base_url,
        params: {
          page: page,
          limit: limit,
          search: searchValue,
        },
      });
      setEmployees(response?.data?.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const fetchMileageData = async () => {
    try {
      let org_id = localStorage.getItem("organization_id");
      const idToFetch = clone_id || expense_id;
      const response = await apiService({
        method: "GET",
        url: `/api/v1/expense/get-individual-expense?org_id=${org_id}&expense_id=${idToFetch}`,
        customBaseUrl: config.PO_Base_url,
      });

      let output = response.data.data;

      if (response.statusCode === 200) {
        console.log(clone_id ? "Cloning data:" : "Editing data:", output);

        formik.setFieldValue("date", new Date().toISOString().split("T")[0]); // Use today's date
        formik.setFieldValue("employee_name", output.employee_name);
        formik.setFieldValue("mileage_method", output.mileage_method);
        formik.setFieldValue(
          "odometer_start_reading",
          output.odometer_start_reading
        );
        formik.setFieldValue(
          "odometer_end_reading",
          output.odometer_end_reading
        );
        formik.setFieldValue("distance", output.distance);
        formik.setFieldValue("tot_amount", output.tot_amount);
        formik.setFieldValue(
          "paid_through_account_id",
          output.paid_through_account_id
        );
        formik.setFieldValue("vendor_id", output.vendor_id._id);
        setSelectedVendor(output.vendor_id);
        formik.setFieldValue("notes", output.notes);
        formik.setFieldValue(
          "invoice_number",
          clone_id ? "" : output.invoice_number
        ); // clear for clone
        formik.setFieldValue("customer_id", output.customer_id._id);
        setSelectedCustomer(output.customer_id);

        // File/image upload
        if (output.upload_image) {
          formik.setFieldValue("upload_image", {
            file: { name: output.upload_image },
            preview: output.upload_image,
            name: output.upload_image,
          });
        }
      }
    } catch (error) {
      console.log("Error in getting Mileage Data:", error);
    }
  };

  // Filter vendors based on vendor search query
  const filteredVendors = vendors.filter((vendor) =>
    vendor.contact_name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  );

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await apiService({
          method: "GET",
          url: `/api/v1/vendors?organization_id=${organization_id}`,
        });
        console.log(response.data, "vendor data");
        setVendors(response.data.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    if (organization_id) {
      fetchVendors();
    }
  }, [organization_id]);

  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  const formik = useFormik({
    initialValues: {
      vendor_id: "",
      employee_name: "",
      date: today,
      tot_amount: "",
      mileage_method: "",
      mileage_rate: "10",
      distance: "",
      notes: "",
      invoice_number: "",
      customer_id: "",
      mileage_type: "",
      odometer_start_reading: "",
      odometer_end_reading: "",
      paid_through_account_id: "",
      type: "mileage",
      status: 0,
      markup_percent: "",
    },
    validationSchema, // <-- ADD THIS LINE
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const organization_id = localStorage.getItem("organization_id");

        const params = {
          method: clone_id ? "POST" : expense_id ? "PUT" : "POST", // ✅ Always POST for clone
          url: clone_id
            ? `api/v1/expense/create-expense?org_id=${organization_id}`
            : expense_id
            ? `api/v1/expense/update-expense?orgId=${organization_id}&expense_id=${expense_id}`
            : `api/v1/expense/create-expense?org_id=${organization_id}`,
          data: values,
          customBaseUrl: config.PO_Base_url,
        };

        const response = await apiService(params);
        console.log("API Response:", response.data);
        showMessage(
          `Form ${expense_id ? "updated" : "submitted"}  successfully!`,
          "success"
        );
        resetForm();
        expense_id
          ? router.push(`/purchase/expense/${expense_id}`)
          : router.push("/purchase/expense");
      } catch (error) {
        console.error("Error submitting form:", error);
        showMessage("Failed to submit the form. Please try again.", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  //   if (!selectedVendor) {
  //     return;
  //   }

  //   if (values.mileageMethod === "odometer") {
  //     requestBody.start_reading = parseFloat(values.startReading);
  //     requestBody.end_reading = parseFloat(values.endReading);
  //   }

  // };

  // Handle click away to close dropdowns
  // const handleClickAway = () => {
  //   setVendorDropdownOpen(false);
  //   setCustomerDropdownOpen(false);
  // };

  return (
    <Box sx={{ width: "100%", mx: 0.5 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ pl: 2 }}>
              {expense_id && (
                <Box
                  sx={{
                    width: "100%",
                    fontSize: "22px",
                    fontWeight: "400",
                    py: 2,
                  }}
                >
                  Edit Mileage
                </Box>
              )}
              {/* Date */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 4,
                  mt: expense_id ? 3 : 10,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    minWidth: "160px",
                    whiteSpace: "nowrap",
                    color: "#d62134",
                  }}
                >
                  Date*
                </Typography>
                <TextField
                  id="date"
                  name="date"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                  placeholder="dd/MM/yyyy"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={(ref) => {
                    // Capture the input ref to trigger click programmatically
                    if (ref) {
                      ref.onclick = () => ref.showPicker && ref.showPicker(); // For modern browsers
                    }
                  }}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  sx={{
                    width: "350px",
                    height: "35px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "7px",
                    },
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc", // default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on focus
                    },
                  }}
                />
              </Box>

              {/* Employee */}
              <>
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      mt: "20px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        minWidth: "160px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Employee
                    </Typography>

                    <FormControl size="small" sx={{ width: "400px" }}>
                      <Select
                        id="employee_name"
                        name="employee_name"
                        displayEmpty
                        value={formik.values.employee_name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "__manage__") return; // prevent clearing selection
                          formik.setFieldValue("employee_name", value);
                          setOpenSelect(false);
                        }}
                        IconComponent={KeyboardArrowDownIcon}
                        onBlur={formik.handleBlur}
                        open={openSelect}
                        onOpen={() => setOpenSelect(true)}
                        onClose={() => setOpenSelect(false)}
                        sx={{
                          fontSize: "13px",
                          borderRadius: "7px",
                          width: "350px",
                          backgroundColor: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#ccc",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#409dfb",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#409dfb",
                          },
                          "& svg": {
                            fontSize: "22px",
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 350,
                            },
                          },
                        }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <span style={{ fontSize: "13px", color: "#aaa" }}>
                                Select Employee
                              </span>
                            );
                          }
                          return (
                            <span style={{ fontSize: "13px" }}>{selected}</span>
                          );
                        }}
                      >
                        {/* Search Box */}
                        <MenuItem sx={{ p: 1 }}>
                          <TextField
                            fullWidth
                            placeholder="Search"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              fetchEmployee(
                                page.current,
                                limit.current,
                                e.target.value
                              );
                            }}
                            onClick={(e) => e.stopPropagation()} // prevent closing
                            sx={{
                              fontSize: "13px",
                              "& .MuiOutlinedInput-root": {
                                height: "35px",
                                borderRadius: "7px",
                                fontSize: "13px",
                              },
                              "& .MuiInputBase-input::placeholder": {
                                fontSize: "13px",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon sx={{ fontSize: "20px" }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </MenuItem>

                        {/* No results */}
                        {employees.length === 0 && (
                          <MenuItem disabled sx={{ fontSize: "13px" }}>
                            NO RESULTS FOUND
                          </MenuItem>
                        )}

                        {/* Employee List */}
                        {employees.map((emp) => (
                          <MenuItem
                            key={emp.id}
                            value={`${emp.employee_name} [ ${emp.employee_email} ]`} // important: VALUE is NAME (EMAIL)
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              gap: "2px",
                              py: 1,
                              mx: "8px",
                              borderRadius: "5px",
                              "&.Mui-selected": {
                                backgroundColor: "#408dfb !important",
                                color: "white",
                              },
                              "&:hover": {
                                borderRadius: "5px",
                                backgroundColor:
                                  theme.palette.hover?.background || "",
                                color: theme.palette.hover?.text || "",
                              },
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "13px", fontWeight: 500 }}
                            >
                              {emp.employee_name}
                            </Typography>
                            <Typography sx={{ fontSize: "12px" }}>
                              {emp.employee_email}
                            </Typography>
                          </MenuItem>
                        ))}

                        {/* Manage Employees */}
                        <MenuItem
                          value="__manage__"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManageEmployees();
                            setOpenSelect(false);
                          }}
                          sx={{
                            borderTop: "1px solid #eee",
                            color: "#1976d2",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                            mt: 1,
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <SettingsIcon sx={{ mr: 1, fontSize: "18px" }} />
                          Manage Employees
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {/* Manage Employees Dialog */}
                    <Dialog
                      open={manageOpen}
                      onClose={() => {
                        setErrorList([]);
                        setManageOpen(false);
                      }}
                      maxWidth="sm"
                      fullWidth
                      PaperProps={{
                        sx: {
                          position: "fixed",
                          top: -10,
                          left: "50%",
                          transform: "translateX(-50%)",
                          m: 0,
                          borderRadius: 2,
                        },
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "13px",
                          p: 2,
                          height: "60px",
                          borderBottom: "1px solid #eee",
                          backgroundColor: "#f9f9fb",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "16px", fontWeight: 550, mt: "10px" }}
                        >
                          Manage Employees
                        </Typography>
                        <IconButton
                          onClick={() => {
                            setErrorList([]);
                            setManageOpen(false);
                          }}
                        >
                          <CloseIcon sx={{ fontSize: "20px", color: "red" }} />
                        </IconButton>
                      </Box>

                      {errorList.length > 0 && (
                        <Box p={2}>
                          <Alert
                            severity="error"
                            icon={false}
                            sx={{
                              fontSize: "13px",
                              "& ul": {
                                margin: 0,
                                paddingLeft: 1,
                                listStyleType: "none",
                              },
                            }}
                            onClose={() => {
                              setErrorList([]);
                            }}
                            slotProps={{
                              closeButton: { sx: { color: "#fe4242" } },
                            }}
                          >
                            <ul>
                              {errorList.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </Alert>
                        </Box>
                      )}
                      {/* Content */}
                      <Box sx={{ p: 2 }}>
                        {!showInput && (
                          <Button
                            // sx={{
                            //   color: "#1976d2",
                            //   marginBottom: "3px",
                            //   p: 0,
                            //   fontSize: "13px",
                            //   textTransform: "none",
                            // }}
                            startIcon={
                              <span style={{ fontSize: "16px" }}>+</span>
                            }
                            onClick={() => setShowInput(true)}
                          >
                            Add New Employee
                          </Button>
                        )}

                        {showInput && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              marginBottom: "7px",
                            }}
                          >
                            <TextField
                              placeholder="Email"
                              variant="outlined"
                              size="small"
                              type="email"
                              value={newEmployee.email}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  email: e.target.value,
                                })
                              }
                              sx={{ fontSize: "13px", width: "250px" }}
                              InputProps={{
                                sx: { fontSize: "13px", height: "35px" },
                              }}
                            />
                            <TextField
                              placeholder="Name"
                              variant="outlined"
                              size="small"
                              value={newEmployee.name}
                              onChange={(e) =>
                                setNewEmployee({
                                  ...newEmployee,
                                  name: e.target.value,
                                })
                              }
                              sx={{ fontSize: "13px", width: "250px" }}
                              InputProps={{
                                sx: { fontSize: "13px", height: "35px" },
                              }}
                            />
                            <Button
                              variant="contained"
                              onClick={() => {
                                handleSaveEmployee();
                                setShowInput(false);
                                setNewEmployee({ name: "", email: "" });
                              }}
                              size="small"
                            >
                              Save
                            </Button>
                          </Box>
                        )}

                        <List sx={{ borderTop: "1px solid #ebeaf2", py: 0 }}>
                          {employees.map((emp) => (
                            <ListItem
                              key={emp._id}
                              sx={{
                                px: 0,
                                fontSize: "13px",
                                borderBottom: "1px solid #ebeaf2",
                              }}
                            >
                              <ListItemText
                                primary={`${emp.employee_name} (${emp.employee_email})`}
                                primaryTypographyProps={{ fontSize: "13px" }}
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleDeleteEmployee(emp._id)}
                                >
                                  <DeleteOutlinedIcon
                                    sx={{ fontSize: "15px" }}
                                  />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Dialog>
                  </Box>
                </Box>
              </>

              {/* Mileage Method Selection */}
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    sx={{ width: "160px", fontSize: "13px", color: "#d62134" }}
                  >
                    <Box sx={{ width: "140px" }}>Calculate mileage using*</Box>
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="mileage_method"
                      value={formik.values.mileage_method}
                      onChange={(e) => {
                        const method = e.target.value;
                        formik.setFieldValue("mileage_method", method);

                        // Reset odometer fields when switching to "distance"
                        if (method === "distance") {
                          formik.setFieldValue("odometer_start_reading", "");
                          formik.setFieldValue("odometer_end_reading", "");
                          formik.setFieldValue("distance", "");
                        }
                      }}
                    >
                      <FormControlLabel
                        value="distance"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              transform: "scale(0.75)",
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: "0.9rem" }}>
                            Distance travelled
                          </Typography>
                        }
                        sx={{
                          ".MuiFormControlLabel-label": {
                            marginLeft: "4px",
                          },
                          alignItems: "center",
                          marginY: "1px",
                        }}
                      />
                      <FormControlLabel
                        value="odometer"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              transform: "scale(0.75)",
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: "0.9rem" }}>
                            Odometer reading
                          </Typography>
                        }
                        sx={{
                          ".MuiFormControlLabel-label": {
                            marginLeft: "4px",
                          },
                          alignItems: "center",
                          marginY: "1px",
                        }}
                      />
                    </RadioGroup>
                    {/* Optional Error Display */}
                    {/* <ErrorMessage name="mileage_method">
        {(msg) => (
          <Typography color="error" variant="caption">
            {msg}
          </Typography>
        )}
      </ErrorMessage> */}
                  </FormControl>
                </Box>

                {/* Odometer Reading Section (only shown when selected) */}
                {formik.values.mileage_method === "odometer" && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      sx={{
                        width: "160px",
                        fontSize: "13px",
                        color: "#d62134",
                      }}
                    >
                      Odometer reading*
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {/* Start Reading */}
                      <TextField
                        placeholder="Start reading"
                        size="small"
                        sx={{
                          width: "150px",
                          "& .MuiOutlinedInput-root": {
                            fontSize: "13px",
                            borderRadius: "7px",
                          },
                          borderRadius: "7px",
                          backgroundColor: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#ccc",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#409dfb",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#409dfb",
                          },
                          "& input[type=number]": {
                            MozAppearance: "textfield", // Firefox
                          },
                          "& input[type=number]::-webkit-outer-spin-button": {
                            WebkitAppearance: "none", // Chrome, Safari, Edge
                            margin: 0,
                          },
                          "& input[type=number]::-webkit-inner-spin-button": {
                            WebkitAppearance: "none", // Chrome, Safari, Edge
                            margin: 0,
                          },
                        }}
                        type="number"
                        value={formik.values.odometer_start_reading}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            formik.setFieldValue(
                              "odometer_start_reading",
                              value
                            );
                            if (value && formik.values.odometer_end_reading) {
                              const start = parseFloat(value);
                              const end = parseFloat(
                                formik.values.odometer_end_reading
                              );
                              if (!isNaN(start) && !isNaN(end) && end > start) {
                                formik.setFieldValue(
                                  "distance",
                                  (end - start).toString()
                                );
                                formik.setFieldValue(
                                  "tot_amount",
                                  (end - start) * Number(editedRate)
                                );
                              } else {
                                formik.setFieldValue("distance", "");
                              }
                            }
                          }
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "14px",
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        To
                      </Typography>

                      {/* End Reading */}
                      <TextField
                        placeholder="End reading"
                        size="small"
                        sx={{
                          width: "150px",
                          "& .MuiOutlinedInput-root": {
                            fontSize: "13px",
                            borderRadius: "7px",
                          },
                          borderRadius: "7px",
                          backgroundColor: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#ccc",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#409dfb",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#409dfb",
                          },
                          "& input[type=number]": {
                            MozAppearance: "textfield", // Firefox
                          },
                          "& input[type=number]::-webkit-outer-spin-button": {
                            WebkitAppearance: "none", // Chrome, Safari, Edge
                            margin: 0,
                          },
                          "& input[type=number]::-webkit-inner-spin-button": {
                            WebkitAppearance: "none", // Chrome, Safari, Edge
                            margin: 0,
                          },
                        }}
                        type="number"
                        value={formik.values.odometer_end_reading}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            formik.setFieldValue("odometer_end_reading", value);
                            if (value && formik.values.odometer_start_reading) {
                              const start = parseFloat(
                                formik.values.odometer_start_reading
                              );
                              const end = parseFloat(value);
                              if (!isNaN(start) && !isNaN(end) && end > start) {
                                formik.setFieldValue(
                                  "distance",
                                  (end - start).toString()
                                );
                                formik.setFieldValue(
                                  "tot_amount",
                                  (end - start) * Number(editedRate)
                                );
                              } else {
                                formik.setFieldValue("distance", "");
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </>

              {/* Distance */}
              <>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      width: "160px",
                      fontSize: "13px",
                      color: "#d62134",
                      pt: 1,
                    }}
                  >
                    Distance *
                  </Typography>
                  <FormControl sx={{ width: "350px" }}>
                    <TextField
                      id="distance"
                      name="distance"
                      size="small"
                      value={formik.values.distance || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        // ✅ Allow only digits (optional dot if you want decimals)
                        if (/^\d*\.?\d*$/.test(val)) {
                          handleDistanceChange(e); // your existing change handler
                        }
                      }}
                      error={
                        formik.touched.distance &&
                        Boolean(formik.errors.distance)
                      }
                      helperText={
                        formik.touched.distance && formik.errors.distance
                      }
                      sx={{
                        height: "35px",
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                          borderRadius: "7px",
                        },
                        backgroundColor: "#fff",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#409dfb",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#409dfb",
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              color="textSecondary"
                              sx={{ fontSize: "13px" }}
                            >
                              Kilometer(s)
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    marginLeft: "160px",
                    marginTop: "25px",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      fontSize: "13px",
                      pl: 1,
                    }}
                  >
                    Rate per km = ₹{mileageRate}
                    <Typography
                      sx={{
                        color: "#409dfb",
                        ml: 1,
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                      onClick={handleOpenPopover}
                      ref={changeLinkRef}
                    >
                      Change
                    </Typography>
                  </Typography>
                </Box>

                {/* Edit Mileage Rate Popover */}
                <Popover
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={handleClosePopover}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      width: 250,
                      borderRadius: 2,
                      marginLeft: "-80px",
                      mt: "10px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "13px", mt: "10px", fontWeight: 500 }}
                    >
                      Edit Mileage Rate
                    </Typography>
                    <IconButton onClick={handleClosePopover}>
                      <CloseIcon fontSize="small" sx={{ color: "red" }} />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1, mb: 3 }} />
                  <Typography sx={{ color: "red", fontSize: "13px", mb: 1 }}>
                    Mileage rate (in INR)*
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={editedRate}
                    onChange={(e) => setEditedRate(e.target.value)}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "7px",
                      },
                      // Hide number input spinner for Chrome, Safari, Edge
                      "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                        {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                      // Hide number input spinner for Firefox
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "13px",
                      },
                    }}
                  />
                  <DialogActions
                    sx={{
                      pt: 2,
                      display: "flex",
                      textAlign: "center",
                      alignItems: "center",
                      left: 0,
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      // sx={{
                      //   fontSize: "13px",
                      //   textTransform: "none",
                      //   width: "50px",
                      // }}
                      onClick={handleSaveRate}
                      fullWidth
                    >
                      Save
                    </Button>
                  </DialogActions>
                </Popover>
              </>

              {/* Amount */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  sx={{ width: "160px", fontSize: "13px", color: "#d62134" }}
                >
                  Amount *
                </Typography>
                <FormControl sx={{ width: "400px" }}>
                  <TextField
                    id="tot_amount"
                    name="tot_amount"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tot_amount}
                    size="small"
                    disabled
                    error={
                      formik.touched.tot_amount &&
                      Boolean(formik.errors.tot_amount)
                    }
                    helperText={
                      formik.touched.tot_amount && formik.errors.tot_amount
                    }
                    sx={{
                      width: "350px",
                      "& .MuiOutlinedInput-root": {
                        fontSize: "13px",
                        color: "black",
                        borderRadius: "7px",
                        "& fieldset": {
                          borderColor:
                            formik.touched.tot_amount &&
                            formik.errors.tot_amount
                              ? "#d32f2f"
                              : "green",
                        },
                        "& input": {
                          color: "black", // <-- sets the input text color
                        },
                        "&:hover fieldset": {
                          borderColor: "#409dfb",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#409dfb",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography
                            color="textSecondary"
                            sx={{ fontSize: "13px" }}
                          >
                            INR
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Box>

              {/* Paid Through */}
              <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography
                    sx={{
                      width: "160px",
                      fontSize: "13px",
                      color: "#d62134",
                      paddingTop: "10px",
                    }}
                  >
                    Paid Through *
                  </Typography>
                </Box>
                <Box
                  onClick={handlePaidThroughAccClick}
                  sx={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "350px",
                    fontSize: "13px",
                    color: "gray",
                  }}
                >
                  {formik.values.paid_through_account_id || "Select Account"}
                </Box>

                {/* Popper Dropdown */}
                <Popper
                  open={paidThrAccOpen}
                  anchorEl={paidThrAccAnchorEl}
                  placement="bottom-start"
                  style={{ width: "350px", zIndex: 1 }}
                >
                  <ClickAwayListener onClickAway={handlePaidThroughAccClose}>
                    <Paper
                      sx={{ maxHeight: 300, overflow: "auto", width: "100%" }}
                    >
                      <Box sx={{ p: 1 }}>
                        {/* Search Box */}
                        <TextField
                          placeholder="Search account"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          sx={{
                            mb: 1,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "6px",
                              fontSize: "13px",
                            },
                          }}
                        />

                        {/* Filtered Results */}
                        {filteredAccounts.length > 0 ? (
                          filteredAccounts.map((group, groupIndex) => (
                            <Box key={groupIndex} sx={{ mb: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  p: 1,
                                  // backgroundColor: COLORS.bgLight,
                                }}
                              >
                                {group.category}
                              </Typography>

                              {group.items.map((item, index) => (
                                <Box
                                  key={`${groupIndex}-${index}`}
                                  sx={{
                                    p: 1,
                                    pl: 2,
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    "&:hover": {
                                      backgroundColor: "",
                                    },
                                  }}
                                  onClick={() =>
                                    handlePaidThroughAccSelect(item)
                                  }
                                >
                                  {item}
                                </Box>
                              ))}
                            </Box>
                          ))
                        ) : (
                          <Box
                            sx={{
                              p: 2,
                              textAlign: "center",
                              fontSize: "13px",
                              color: "gray",
                            }}
                          >
                            No accounts match your search
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </ClickAwayListener>
                </Popper>

                {/* Error message */}
                {formik.touched.paid_through_account_id &&
                  formik.errors.paid_through_account_id && (
                    <Box
                      sx={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#D32F2F",
                        pl: 2,
                      }}
                    >
                      {formik.errors.paid_through_account_id}
                    </Box>
                  )}
              </Box>

              {/* Vendor Selection */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ width: "160px", fontSize: "13px" }}>
                  Vendor
                </Typography>

                <ClickAwayListener
                  onClickAway={() => setVendorDropdownOpen(false)}
                >
                  <Box sx={{ position: "relative", width: "440px" }}>
                    <Box
                      onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "35px",
                        width: "390px",
                        justifyContent: "space-between",
                        border: "1px solid #c4c4c4",
                        borderRadius: "7px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        backgroundColor: "white",
                        color: "gray",
                        "&:hover": {
                          borderColor:
                            theme.palette.primary.navbar ||
                            theme.palette.primary.dark ||
                            theme.palette.primary.main,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: selectedVendor ? "gray" : "#aaa",
                        }}
                      >
                        {selectedVendor
                          ? selectedVendor.contact_name
                          : "Select a Vendor"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {/* <Box
                          sx={{
                            marginLeft: "5px",
                            width: "10px",
                            height: "10px",
                            marginRight: "20px",
                            borderLeft: "5px solid transparent",
                            borderRight: "5px solid transparent",
                            borderTop: "5px solid #666",
                            transform: vendorDropdownOpen
                              ? "rotate(180deg)"
                              : "none",
                            "&:hover": {
                              borderColor: "#408dfb",
                            },
                          }}
                        /> */}
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: "22px",
                            color: "gray",
                            marginRight: "10px",
                          }}
                        />

                        <IconButton
                          size="small"
                          sx={{
                            height: "35px",
                            width: "40px",
                            marginRight: -2,
                            borderRadius: "0 7px 7px 0",
                            backgroundColor: theme.palette.primary.main,
                            color:
                              theme.palette.primary.contrastText || "white",
                            border: "1px solid",
                            borderColor: theme.palette.primary.main,
                            borderLeft: "none",
                            "&:hover": {
                              backgroundColor:
                                theme.palette.primary.navbar ||
                                theme.palette.primary.dark ||
                                theme.palette.primary.main,
                              borderColor:
                                theme.palette.primary.navbar ||
                                theme.palette.primary.dark ||
                                theme.palette.primary.main,
                            },
                          }}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {vendorDropdownOpen && (
                      <Paper
                        elevation={3}
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "390px",
                          borderRadius: "4px",
                          mt: 0.5,
                          zIndex: 1000,
                        }}
                      >
                        <Box sx={{ p: 1 }}>
                          <TextField
                            placeholder="Search"
                            size="small"
                            fullWidth
                            value={vendorSearchQuery}
                            onChange={(e) =>
                              setVendorSearchQuery(e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontSize: "13px",
                                borderRadius: "7px",
                              },
                            }}
                          />
                        </Box>

                        <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                          {loading ? (
                            <Box sx={{ p: 2, textAlign: "center" }}>
                              <Typography sx={{ fontSize: "13px" }}>
                                Loading...
                              </Typography>
                            </Box>
                          ) : filteredVendors.length > 0 ? (
                            filteredVendors.map((vendor) => (
                              <Box
                                key={vendor._id}
                                onClick={() => {
                                  setSelectedVendor(vendor);
                                  setVendorDropdownOpen(false);

                                  // Update Formik value for vendor_id
                                  formik.setFieldValue("vendor_id", vendor._id);
                                }}
                                sx={{
                                  display: "flex",
                                  fontSize: "13px",
                                  margin: "2px",
                                  alignItems: "center",
                                  borderRadius: "5px",
                                  margin: "5px",
                                  p: 1.2,
                                  cursor: "pointer",
                                  "&:hover": {
                                    borderRadius: "5px",
                                    margin: "1px 10px",
                                    backgroundColor:
                                      theme.palette.hover?.background || "",
                                    color: theme.palette.hover?.text || "",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    backgroundColor: "#ddd",
                                    color: "#666",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mr: 1.5,
                                    fontSize: "14px",
                                  }}
                                >
                                  {vendor.contact_name.charAt(0).toUpperCase()}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    sx={{
                                      fontSize: "13px",
                                      fontWeight: "medium",
                                    }}
                                  >
                                    {vendor.contact_name}
                                  </Typography>
                                  {vendor.email && (
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "darkgray",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        maxWidth: "250px",
                                      }}
                                    >
                                      {vendor.email}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <Box sx={{ p: 2, textAlign: "center" }}>
                              <Typography sx={{ fontSize: "13px" }}>
                                No vendors found
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box>
                          <Box
                            onClick={() =>
                              router.push("/purchase/vendor/createvendor")
                            }
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                              borderTop: "1px solid #eee",
                              cursor: "pointer",
                              "&:hover": { backgroundColor: "#f5f5f5" },
                            }}
                          >
                            <AddIcon
                              sx={{ fontSize: "16px", color: "#4d90fe", mr: 1 }}
                            />
                            <Typography
                              sx={{ fontSize: "13px", color: "#4d90fe" }}
                            >
                              New Vendor
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </ClickAwayListener>
              </Box>

              {/* Invoice Number */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                  }}
                >
                  Invoice#
                </Typography>
                {/* <Field name="invoiceNumber">
                                {({ field }) => ( */}
                <TextField
                  // {...field}
                  id="invoice_number"
                  name="invoice_number"
                  type="invoice_number"
                  onChange={formik.handleChange}
                  value={formik.values.invoice_number}
                  variant="outlined"
                  size="small"
                  // value={formik.values.invoiceNumber || ""}
                  sx={{
                    width: "350px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "7px",
                    },
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc", // default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on focus
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <SettingsIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  // error={
                  //   touched.invoiceNumber && Boolean(errors.invoiceNumber)
                  // }
                  // helperText={touched.invoiceNumber && errors.invoiceNumber}
                />
                {/* )}
                               </Field> */}
              </Box>

              {/* Notes */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                  }}
                >
                  Notes
                </Typography>
                <TextField
                  id="notes"
                  name="notes"
                  value={formik.values.notes || ""}
                  onChange={(e) => {
                    // Ensure that the text length does not exceed 500 characters
                    if (e.target.value.length <= 500) {
                      formik.handleChange(e);
                    }
                  }}
                  variant="outlined"
                  size="small"
                  placeholder="Max. 500 Characters"
                  multiline
                  rows={2}
                  maxLength={500} // Limit the input to 500 characters
                  sx={{
                    width: "350px",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      borderRadius: "7px",
                    },
                    borderRadius: "7px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc", // default border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#409dfb", // on focus
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 5, mt: 5 }} />

              {/* Customer Name Section */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ width: "160px", fontSize: "13px" }}>
                  Customer Name
                </Typography>
                <ClickAwayListener
                  onClickAway={() => setCustomerDropdownOpen(false)}
                >
                  <Box sx={{ position: "relative", width: "390px" }}>
                    <Box
                      onClick={() =>
                        setCustomerDropdownOpen(!customerDropdownOpen)
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "35px",
                        justifyContent: "space-between",
                        border: "1px solid #c4c4c4",
                        borderRadius: "7px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        backgroundColor: "white",
                        "&:hover": {
                          borderColor:
                            theme.palette.primary.navbar ||
                            theme.palette.primary.dark ||
                            theme.palette.primary.main,
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "13px", color: "#666" }}>
                        {formik.values.customer_id && selectedCustomer
                          ? selectedCustomer.contact_name
                          : "Select a Customer"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: "22px",
                            color: "gray",
                            marginRight: "10px",
                          }}
                        />

                        <IconButton
                          size="small"
                          sx={{
                            height: "35px",
                            width: "40px",
                            marginRight: -2,
                            borderRadius: "0 7px 7px 0",
                            backgroundColor: theme.palette.primary.main,
                            color:
                              theme.palette.primary.contrastText || "white",
                            border: "1px solid",
                            borderColor: theme.palette.primary.main,
                            borderLeft: "none",
                            "&:hover": {
                              backgroundColor:
                                theme.palette.primary.navbar ||
                                theme.palette.primary.dark ||
                                theme.palette.primary.main,
                              borderColor:
                                theme.palette.primary.navbar ||
                                theme.palette.primary.dark ||
                                theme.palette.primary.main,
                            },
                          }}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* DROPDOWN */}
                    {customerDropdownOpen && (
                      <Paper
                        elevation={3}
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          borderRadius: "4px",
                          mt: 0.5,
                          zIndex: 1000,
                        }}
                      >
                        <Box sx={{ p: 1 }}>
                          <TextField
                            placeholder="Search"
                            size="small"
                            fullWidth
                            value={customerSearchQuery}
                            onChange={(e) =>
                              setCustomerSearchQuery(e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontSize: "13px",
                                borderRadius: "4px",
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                          {filteredCustomers.map((customer) => (
                            <Box
                              key={customer._id}
                              onClick={() => {
                                setSelectedCustomer(customer);
                                formik.setFieldValue(
                                  "customer_id",
                                  customer._id
                                );
                                setCustomerDropdownOpen(false);
                              }}
                              sx={{
                                display: "flex",
                                fontSize: "13px",
                                margin: "5px",
                                alignItems: "center",
                                borderRadius: "5px",
                                p: 1.2,
                                cursor: "pointer",
                                "&:hover": {
                                  borderRadius: "5px",
                                  backgroundColor:
                                    theme.palette.hover?.background || "",
                                  color: theme.palette.hover?.text || "",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ddd",
                                  color: "#666",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 1.5,
                                  fontSize: "14px",
                                }}
                              >
                                {customer.contact_name.charAt(0).toUpperCase()}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: "medium",
                                  }}
                                >
                                  {customer.contact_name}
                                </Typography>
                                {customer.email && (
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      color: "lightgray",
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      maxWidth: "250px",
                                    }}
                                  >
                                    {customer.email}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </ClickAwayListener>

                {/* Show Billable Checkbox only if a customer is selected */}

                {/* {selectedCustomer && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.status === 1}
                        onChange={(e) => formik.setFieldValue("status", e.target.checked ? 1 : 0)}
                        sx={{
                          margin: "10px",
                          p: 0, // optional: removes extra padding
                          "& .MuiSvgIcon-root": {
                            fontSize: 17, // size of the checkbox icon itself
                          },
                        }}
                      />
                    }
                    label="billable"
                    sx={{
                      ml: 2,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "13px",
                      },
                    }}
                  />
                )} */}
              </Box>

              {/* {selectedCustomer && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ width: "160px", fontSize: "13px" }}>
                    Projects
                  </Typography>
                  <ClickAwayListener
                    onClickAway={() => setProjectDropdownOpen(false)}
                  >
                    <Box sx={{ position: "relative", width: "390px" }}>
                      <Box
                        onClick={handleDropdownToggle}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "35px",
                          justifyContent: "space-between",
                          border: "1px solid #c4c4c4",
                          borderRadius: "7px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          backgroundColor: "white",
                          "&:hover": { borderColor: "#408dfb" },
                        }}
                      >
                        <Typography sx={{ fontSize: "13px", color: "#666" }}>
                          {selectedProject
                            ? selectedProject.contact_name
                            : "Select a Project"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              marginLeft: "5px",
                              width: "10px",
                              height: "10px",
                              marginRight: "20px",
                              borderLeft: "5px solid transparent",
                              borderRight: "5px solid transparent",
                              borderTop: "5px solid #666",
                              transform: projectDropdownOpen
                                ? "rotate(180deg)"
                                : "none",
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              height: "35px",
                              width: "40px",
                              marginRight: -2,
                              borderRadius: "0 7px 7px 0",
                              backgroundColor: "#408dfb",
                              color: "white",
                              border: "1px solid",
                              borderColor: "#408dfb",
                              borderLeft: "none",
                              "&:hover": {
                                backgroundColor: "#3a7fe1",
                                borderColor: "#3a7fe1",
                              },
                            }}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      
                      {projectDropdownOpen && (
                        <Paper
                          elevation={3}
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            width: "100%",
                            borderRadius: "4px",
                            mt: 0.5,
                            zIndex: 1000,
                          }}
                        >
                          <Box sx={{ p: 1 }}>
                            <TextField
                              placeholder="Search"
                              size="small"
                              fullWidth
                              value={projectSearchQuery}
                              onChange={(e) =>
                                setProjectSearchQuery(e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "13px",
                                  borderRadius: "4px",
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                           <Box
                              onClick={() =>
                                handleProjectSelection({
                                  contact_name: "Sample Project",
                                })
                              }
                              sx={{
                                display: "flex",
                                fontSize: "13px",
                                margin: "5px",
                                alignItems: "center",
                                borderRadius: "5px",
                                p: 1.2,
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "#408dfb",
                                  color: "white",
                                },
                              }}
                            >
                     
                            </Box>
                          </Box>
                        </Paper>
                      )}
                    </Box>
                  </ClickAwayListener>
                </Box>
              )} */}

              {/* Show Mark up by input if billable is checked */}

              {/* {selectedCustomer && formik.values.status === 1 && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ width: "160px", fontSize: "13px" }}>
                    Mark up by
                  </Typography>
                  <TextField
                  name="markup_percent"
                  value={formik.values.markup_percent || "0"}
                  onChange={formik.handleChange}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    sx={{
                      width: "150px",
                      "& .MuiOutlinedInput-root": {
                        fontSize: "13px",
                        borderRadius: "7px",
                      },
                      borderRadius: "7px",
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc", // default border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#409dfb", // on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#409dfb", // on focus
                      },
                    }}
                  />
                </Box>
              )} */}

              <Divider sx={{ my: 4 }} />
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 10 }}>
                <Typography
                  sx={{
                    width: "160px",
                    fontSize: "13px",
                    paddingTop: "10px",
                  }}
                >
                  Reporting Tags
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    Color: "#408dfb",
                    width: "400px",
                    marginTop: "10px",
                    display: "flex",
                  }}
                >
                  <LocalOfferIcon
                    sx={{
                      fontSize: "18px",
                      marginRight: "10px",
                      mt: "2px",
                      color: "#408dfb",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "13px",
                      Color: "#408dfb",
                      width: "350px",
                      color: "#408dfb",
                    }}
                  >
                    Associated Tag
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Receipt Upload Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                mt: 12,
                ml: 4,
                borderRadius: "7px",
                border: "1.5px dashed lightgray",
                height: "350px",
                width: "250px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "transparent",
                transition: "border 0.3s ease",
                "&:hover": {
                  border: "1.5px dashed #408dfb",
                },
                "&:focus-within": {
                  border: "1.5px dashed #408dfb",
                },
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
              >
                {/* Show image preview if uploaded, otherwise show icon */}
                {formik.values.upload_image?.preview &&
                formik.values.upload_image.file.type.startsWith("image/") ? (
                  <img
                    src={formik.values.upload_image.preview}
                    alt="Preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginTop: "30px",
                      marginBottom: "20px",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: "7px",
                      overflow: "hidden",
                      mb: 3,
                      height: "50px",
                    }}
                  >
                    <Image
                      src="/Moon.jpg"
                      alt="Moon Image"
                      width={50}
                      height={50}
                    />
                  </Box>
                )}

                <Typography sx={{ fontSize: "13px", fontWeight: "500" }}>
                  Drag or Drop your Receipts
                </Typography>
                <Typography
                  sx={{ fontSize: "11px", fontWeight: "400", color: "#6C718A" }}
                >
                  Maximum file size allowed is 10MB
                </Typography>

                {/* Hidden File Input */}
                <input
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  id="upload_image"
                  name="upload_image"
                  type="file"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];

                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        showMessage("File size exceeds 10MB limit", "error");
                        return;
                      }

                      const previewUrl = URL.createObjectURL(file);
                      formik.setFieldValue("upload_image", {
                        file,
                        preview: previewUrl,
                        name: file.name,
                      });
                    }
                  }}
                />

                {/* Upload Button */}
                <label htmlFor="upload_image" style={{ marginTop: "25px" }}>
                  <Button
                    component="span"
                    variant="outlined"
                    endIcon={
                      <KeyboardArrowDownIcon
                        sx={{ marginRight: "10px", fontSize: "22px" }}
                      />
                    }
                  >
                    <FileUploadOutlinedIcon
                      sx={{
                        color: "#2e3b44 !important",
                        border: "none",
                        fontSize: "13px !important",
                        fontWeight: "200 !important",
                      }}
                    />
                    UPLOAD FILE
                  </Button>
                </label>
              </Box>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Paper
            elevation={2}
            fullWidth
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              marginTop: "20px",
              // marginLeft: "-45px",
              position: "fixed",
              left: "15%",
              bottom: 0,
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              disableElevation
              color="primary"
            >
              Save and Send
            </Button>
            <Button
              variant="outlined"
              type="button"
              onClick={() => router.push("/purchase/expense")}
            >
              Cancle
            </Button>
          </Paper>
        </Grid>
      </form>
    </Box>
  );
};
export default MyClientOnlyComponent;
