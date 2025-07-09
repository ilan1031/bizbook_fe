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
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "../../../../../src/components/SnackbarProvider";
import apiService from "../../../../services/axiosService";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import WarningIcon from "../../../../assets/icons/warning-img.png";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { ArrowDropDown } from "@mui/icons-material";
import Overview from "./overview";
import History from "./history";
import NextBill from "./nextBill";
import config from "../../../../services/config";
const menuItemStyles = {
  "&:hover": {
    backgroundColor: "#4285F4",
    color: "#fff",
    "& .MuiListItemIcon-root": {
      color: "#4285F4",
    },
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

export default function View({
  details,
  callViewAPI,
  uniqueId,
  page,
  limit,
  childLoading,
  setFilterStatus,
  filterStatus,
  journalId,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromURL = searchParams.get("tab");
  const [tabValue, setTabValue] = useState(
    tabFromURL ? parseInt(tabFromURL) : 0
  );

  const organization_id = localStorage.getItem("organization_id");
  const { showMessage } = useSnackbar();
  const [openDialog, setOpenDialog] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [type, setType] = useState("delete");

  const handleClickOpen = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    router.push(`?tab=${newValue}`);
  };

  // const handleEdit = () => router.push(`/sales/customer/edit/${uniqueId}`);
  const handleEdit = () => {
    router.push(
      `/purchase/recurringbills/newRecurringBill?recurring_bill_id=${details.recurring_bill_id}`
    );
  };
  const handleClose = () => {
    router.push(`/purchase/vendor`);
  };

  const handleApi = (pageValue) => {
    callViewAPI(details?.recurring_bill_id, pageValue);
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

      window.location.href = `/sales/customer/${data.contact_id}`;
    } catch (err) {
      console.error("Failed to fetch tax exemptions:", err);
    }
  };

  const handleDelete = async () => {
    try {
      console.log(journalId,"journalIdjournalIdjournalIdjournalIdjournalIdjournalId")
      const response = await apiService({
        method: "DELETE",
        url: `/api/v1/recurring-bill/${uniqueId}?organization_id=${organization_id}&journal_id=${journalId}`,
        customBaseUrl: config.PO_Base_url,
      });
      const data = response.data;
      showMessage(data.message, "success");
      setOpenDialog(false);
      router.push(`/purchase/recurringbills`);
    } catch (err) {
      console.error(`Failed to delete :`, err);
    }
  };
  const statusChange = async () => {
    try {
      setAnchorEl(null);
      const response = await apiService({
        method: "PUT",
        url: `/api/v1/recurring-bill/update-status/${
          details?.status_type === "active" ? "stop" : "resume"
        }?recurring_bill_id=${
          details.recurring_bill_id
        }&organization_id=${organization_id}`,
        customBaseUrl: config.PO_Base_url,
      });

      callViewAPI(details.recurring_bill_id, page);
    } catch (error) {
      console.log("Error in status Change FE Api", error);
    }
  };

  const handleDialog = () => {
    type === "delete"
      ? handleDelete()
      : router.push(`/purchase/bills/create?recurring_bill_id=${uniqueId}`);
  };

  const isNextBillVisible =
    details?.status_type !== "stopped" && details?.status_type !== "expired";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Customer Profile - {details?.recurrence_name}</title>
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
            <Typography variant="h6">
              {details?.recurrence_name
                ? details.recurrence_name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : ""}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <>
                <IconButton
                  onClick={handleEdit}
                  variant="outlined"
                  size="small"
                  sx={{
                    mr: 1,
                    width: "37px",
                    borderRadius: "20% !important",
                  }}
                  title="Edit"
                  className="bulk-update-btn"
                >
                  <Pencil width={"16px"} />
                </IconButton>
                <Button
                  variant="outlined"
                  className="bulk-update-btn"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setType("createBill");
                    handleClickOpen();
                  }}
                >
                  Create Bill
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    mr: 1,
                    width: "30px",
                    "& .MuiButton-endIcon": {
                      marginLeft: "0px",
                    },
                  }}
                  onClick={handleClick}
                  endIcon={
                    <ArrowDropDown
                      sx={{ marginLeft: "0px" }}
                      className="button-more-svg"
                    />
                  }
                  className="bulk-update-btn"
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
                  PaperProps={{
                    sx: { width: "113px" },
                  }}
                >
                  <Box>
                    {details?.status_type !== "expired" && (
                      <MenuItem sx={menuItemStyles} onClick={statusChange}>
                        <ListItemText
                          className="menu-text"
                          primary={
                            details?.status_type === "active"
                              ? "Stop"
                              : "Resume"
                          }
                        />
                      </MenuItem>
                    )}

                    <MenuItem
                      sx={menuItemStyles}
                      onClick={() => {
                        handleClickOpen();
                        setType("delete");
                      }}
                    >
                      <ListItemText className="menu-text" primary="Delete" />
                    </MenuItem>
                  </Box>
                </Popover>
              </>
              <IconButton size="small" onClick={() => handleClose()}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Dialog
              fullWidth="sm"
              open={openDialog}
              maxWidth="sm"
              sx={{
                "& .MuiPaper-root.MuiDialog-paper": {
                  width: "436px",
                  margin: 0,
                  top: "20px", // push it towards the top
                  position: "absolute",
                  transform: "none", // disable vertical centering
                },
              }}
              onClose={handleDialogClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogContent sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src={WarningIcon}
                  alt="warning"
                  style={{ width: "20px", height: "20px" }}
                  priority
                />
                <DialogContentText
                  sx={{ ml: 1, fontSize: "12px", color: "#212529" }}
                >
                  Are you sure about{" "}
                  {type === "delete"
                    ? "deleting the"
                    : "creating a bill for this"}{" "}
                  recurring bill?
                </DialogContentText>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ justifyContent: "flex-start" }}>
                <Button
                  sx={{ ml: 1, width: "10px" }}
                  autoFocus
                  variant="outlined"
                  className="button-submit"
                  onClick={() => handleDialog()}
                >
                  Ok
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDialogClose}
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
              sx={{ textTransform: "none" }}
            >
              <Tab
                label="Overview"
                id="overview-tab-0"
                aria-controls="overview-tabpanel-0"
                sx={{ textTransform: "none" }}
              />
              {isNextBillVisible && (
                <Tab
                  label="Next Bill"
                  id="next-bill-tab-1"
                  aria-controls="next-bill-tabpanel-1"
                  sx={{ textTransform: "none" }}
                />
              )}
              <Tab
                label="Recent Activities"
                id="recent-activities-tab"
                aria-controls="recent-activities-tabpanel"
                sx={{ textTransform: "none" }}
              />
            </Tabs>
          </Box>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            marginTop: "4px",
            overflowY: "auto",
            height: "73vh",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Overview
              loading={childLoading}
              details={details}
              page={page}
              limit={limit}
              callBack={handleApi}
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
            />
          </TabPanel>

          {/* next invoice Tab */}
          {isNextBillVisible && (
            <TabPanel value={tabValue} index={1}>
              <NextBill details={details} />
            </TabPanel>
          )}

          {/* recent activities Tab */}
          <TabPanel value={tabValue} index={isNextBillVisible ? 2 : 1}>
            <History details={details} />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
