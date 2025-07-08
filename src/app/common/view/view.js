"use client";

import React, { useState } from "react";

import Head from "next/head";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  IconButton,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Popover,
  MenuItem,
  ListItemText,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CommentsTab from "./comments";
import TransactionsTab from "./transactions";
import MailsTab from "./mails";
import StatementsTab from "./statements";
import OverviewTab from "./overview";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter, useSearchParams } from "next/navigation";

import { useSnackbar } from "../../../../src/components/SnackbarProvider";
import apiService from "../../../../src/services/axiosService";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import WarningIcon from "../../../../src/assets/icons/warning-img.png";
import Image from "next/image";
import { EmailComposer } from "./customerEmail";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3174F1",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#FAFAFA",
    },
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h5: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          minWidth: "auto",
          padding: "12px 16px",
          fontSize: "14px",
          "&.Mui-selected": {
            color: "#3174F1",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#3174F1",
          height: "3px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "4px",
        },
        outlined: {
          borderColor: "#E0E0E0",
          color: "#616161",
        },
        contained: {
          backgroundColor: "#3174F1",
          color: "white",
          "&:hover": {
            backgroundColor: "#2160D9",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #E0E0E0",
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E0E0E0",
          minHeight: "48px",
          "&.Mui-expanded": {
            minHeight: "48px",
          },
        },
        content: {
          margin: "12px 0",
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#F5F5F5",
          color: "#616161",
          fontWeight: 500,
          fontSize: "12px",
        },
        root: {
          padding: "8px 16px",
          borderBottom: "1px solid #E0E0E0",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#E0E0E0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          border: "1px solid #E0E0E0",
        },
      },
    },
  },
});
const menuItemStyles = {
  "&:hover": {
    borderRadius: "5px",                             
    backgroundColor:theme.palette.hover?.background || "",
    color: theme.palette.hover?.text || "",
  },
};
// TabPanel component to handle tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
      style={{ paddingTop: "20px" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function View({ details, moduleKey, callViewAPI, uniqueId }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromURL = searchParams.get("tab");
  const [tabValue, setTabValue] = useState(
    tabFromURL ? parseInt(tabFromURL) : 0
  );

  const organization_id = localStorage.getItem("organization_id");
  const { showMessage } = useSnackbar();
  const [openDelete, setOpenDelete] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setAnchorEl(null);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    router.push(`?tab=${newValue}`);
  };

  // const handleEdit = () => router.push(`/sales/customer/edit/${uniqueId}`);
  const handleEdit = () => {
    if (moduleKey === "Customer") {
      router.push(`/sales/customer/edit/${uniqueId}`);
    } else {
      router.push(`/purchase/vendor/edit/${uniqueId}`);
    }
  };
  const handleClose = () => {
    if (moduleKey === "Customer") {
      router.push(`/sales/customer`);
    } else {
      router.push(`/purchase/vendor`);
    }
  };

  const handleApi = (id) => {
    callViewAPI(id);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePop = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleStatus = async () => {
    try {
      const response = await apiService({
        method: "PATCH",
        url: `/api/v1/contact/status?organization_id=${organization_id}&contact_id=${uniqueId}`,
      });
      const data = response.data;
      showMessage(data.message, "success");

      if (moduleKey === "Customer") {
        window.location.href = `/sales/customer/${data.contact_id}`;
      } else {
        window.location.href = `/purchase/vendor/${data.contact_id}`;
      }
    } catch (err) {
      console.error("Failed to fetch tax exemptions:", err);
    }
  };

  const handleEmail = () => {
    router.push(
      `/common/customerEmail?org_id=${organization_id}&contact_id=${uniqueId}&email_type=${
        moduleKey || "Customer"
      }`
    );
  };

  const handleClone = () => {
    if (moduleKey === "Customer") {
      router.push(`/sales/customer/create?clone_id=${uniqueId}`);
    } else if (moduleKey === "Vendor") {
      router.push(`/purchase/vendor/createvendor?clone_id=${uniqueId}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/contact?organization_id=${organization_id}&contact_id=${uniqueId}`,
      });
      const data = response.data;
      showMessage(data.message, "success");
      setOpenDelete(false);
      if (moduleKey === "Customer") {
        window.location.href = `/sales/customer`;
      } else {
        window.location.href = `/sales/vendor`;
      }
    } catch (err) {
      console.error(`Failed to delete ${moduleKey} :`, err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Customer Profile - {details?.contact_name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderLeft: "1px solid #ddd",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
              p: 2,
            }}
          >
            <Typography variant="h5">
              {details.contact_name.toUpperCase()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {details.status === "active" ? (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="contained"
                    size="small"
                    sx={{
                      mr: 1,
                      width: "30px",
                    }}
                  >
                    Edit
                  </Button>
                  {/* <Button
                    variant="contained"
                    size="small"
                    endIcon={
                      <KeyboardArrowDownIcon
                        sx={{ marginLeft: "0px" }}
                        className="button-more-svg"
                      />
                    }
                    sx={{ mr: 1 }}
                  >
                    New Transaction
                  </Button> */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mr: 1,
                    }}
                    onClick={handleClick}
                    endIcon={
                      <KeyboardArrowDownIcon
                        sx={{ marginLeft: "0px" }}
                        className="button-more-svg"
                      />
                    }
                  >
                    More
                  </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePop}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    sx={{
                      top: "14px",
                    }}
                  >
                    <Box>
                      <MenuItem sx={menuItemStyles} onClick={handleEmail}>
                        <ListItemText
                          className="menu-text"
                          primary="Email Customer"
                        />
                      </MenuItem>
                      <MenuItem sx={menuItemStyles} onClick={handleClone}>
                        <ListItemText className="menu-text" primary="Clone" />
                      </MenuItem>
                      <MenuItem sx={menuItemStyles} onClick={handleStatus}>
                        <ListItemText
                          className="menu-text"
                          primary="Mark as Inactive"
                        />
                      </MenuItem>
                      <MenuItem sx={menuItemStyles} onClick={handleClickOpen}>
                        <ListItemText className="menu-text" primary="Delete" />
                      </MenuItem>
                    </Box>
                  </Popover>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mr: 1,
                    }}
                    onClick={handleStatus}
                  >
                    Mark as Active
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mr: 1,
                      width: "30px",
                    }}
                    onClick={handleClickOpen}
                  >
                    Delete
                  </Button>
                </>
              )}

              <IconButton size="small" onClick={() => handleClose()}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Dialog
              fullWidth="sm"
              open={openDelete}
              maxWidth="sm"
              sx={{
                "& .MuiPaper-root.MuiDialog-paper": { width: "436px" },
              }}
              onClose={handleDeleteClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogContent sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src={WarningIcon}
                  alt="warning"
                  style={{ width: "30px", height: "30px" }}
                  priority
                />
                <DialogContentText
                  sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
                >
                  Do you want to delete this contact?
                </DialogContentText>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ justifyContent: "flex-start" }}>
                <Button
                  sx={{ ml: 1, width: "20px" }}
                  autoFocus
                  variant="outlined"
                  className="button-submit"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDeleteClose}
                  autoFocus
                  className="bulk-update-btn"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="customer tabs"
              sx={{
                textTransform: "none",
                "& .MuiTabs-flexContainer": {
                  height: "48px",
                },
              }}
            >
              <Tab
                label="Overview"
                id="overview-tab-0"
                aria-controls="overview-tabpanel-0"
                sx={{ textTransform: "none" }}
              />
              <Tab
                label="Comments"
                id="comments-tab-1"
                aria-controls="comments-tabpanel-1"
                sx={{ textTransform: "none" }}
              />
              <Tab
                label="Transactions"
                id="transaction-tab-2"
                aria-controls="transaction-tabpanel-2"
                sx={{ textTransform: "none" }}
              />
              <Tab
                label="Mails"
                id="mails-tab-3"
                aria-controls="mails-tabpanel-3"
                sx={{ textTransform: "none" }}
              />
              <Tab
                label="Statement"
                id="statement-tab-4"
                aria-controls="statement-tabpanel-4"
                sx={{ textTransform: "none" }}
              />
              {/* </Tabs> */}
              {/* <Tab
                label="customerMail"
                id="customermail-tab-5"
                aria-controls="customermail-tabpanel-5"
                sx={{textTransform: "none"}}
              /> */}
            </Tabs>
          </Box>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            marginTop: "4px",
            height: "80vh", // Full viewport height
            overflow: "auto", // Enables vertical scrolling
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <OverviewTab
              details={details}
              callAPI={handleApi}
              moduleKey={moduleKey}
            />
          </TabPanel>

          {/* Comments Tab */}
          <TabPanel value={tabValue} index={1}>
            <CommentsTab details={details} />
          </TabPanel>

          {/* Transactions Tab */}
          <TabPanel value={tabValue} index={2}>
            <TransactionsTab
              customerId={details?.contact_id}
              moduleKey={moduleKey}
            />
          </TabPanel>

          {/* Mails Tab */}
          <TabPanel value={tabValue} index={3}>
            <MailsTab details={details} />
          </TabPanel>

          {/* Statement */}
          <TabPanel value={tabValue} index={4}>
            <StatementsTab details={details} />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
