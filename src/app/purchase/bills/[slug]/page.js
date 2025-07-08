
"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Button,
  Grid,
  Typography,
  ListItemText,
  ListItemIcon,
  List,
  ListItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import SearchModal from "../../../common/searchModal";
import SideBarTable from "../../SideBarList";
import BillViewComponent from "../../bills/BillViewComponent";
import { usePathname, useRouter } from "next/navigation";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";

const billsStatusOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Bills",
    value: "Status.All",
    key: "All Customers",
    empty_msg: "There are no Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "Draft Bills",
    value: "Status.Active",
    key: "Active Customers",
    empty_msg: "There are no active Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Open Bills",
    value: "Status.Inactive",
    key: "Inactive Customers",
    empty_msg: "There are no inactive Customers",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Void Bills",
    value: "Status.Inactive",
    key: "Void Bills",
    empty_msg: "There are no Void Bills",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    iconPosition: "right",
    border: true,
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "date", label: "Date", order: "D" },
      { key: "bill_number", label: "Bill#", order: "D" },
      {
        key: "vendor_name",
        label: "Vendor Name",
        order: "D",
      },
      { key: "total", label: "Amount", order: "D" },
      { key: "due_date", label: "Delivery Date", order: "D" },
      { key: "updatedAt", label: "Last Modified Time", order: "D" },
    ],
  },
  {
    text: "Import Bills",
    icon: <Download className="menu-icon" />,
    route: "/import-files",
    query: { type: "bills" },
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Bills",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Export Current View",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Import Credit Notes",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const Customer = () => {
  const [statusOptions, setStatusOptions] = useState(billsStatusOptions);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [billsList, setBillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [journalId, setJournalId] = useState(""); // This will be set when a bill is selected
  const [openNewView, setOpenNewView] = useState(false);
  const [theFilteredArray, setTheFilteredArray] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("vendor_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const page = useRef(1);
  const limit = useRef(10);
  const [filterBy, setFilterBy] = useState("Status.All");

  const getBills = async (filter, sort_column, sort_order) => {
    setLoading(true);
    let OrgId = localStorage.getItem("organization_id");
    let params = {
      method: "GET",
      url: `api/v1/bills/get-bills?org_id=${OrgId}&limit=50`,
      customBaseUrl: config.PO_Base_url,
      params: {
        page: page.current,
        limit: limit.current,
        sort_column: sort_column,
        sort_order: sort_order,
        filter: filter,
      },
    };

    try {
      const response = await apiService(params);
      if (response.statusCode === 200) {
        console.log("📋 Bills list response:", response.data.data);
        setBillsList(response.data.data);
        setTheFilteredArray(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bills", error);
    } finally {
      setLoading(false);
    }
  };

  const getBillData = async (billId) => {
    if (!billId) {
      console.log("❌ No billId provided to getBillData");
      return;
    }
    try {
      const orgId = localStorage.getItem("organization_id");
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.PO_Base_url,
        url: `/api/v1/bills/get-individual-bill?org_id=${orgId}&bill_id=${billId}`,
      });

      if (response.statusCode === 200) {
        console.log("✅ Individual bill response:", response.data.data);
        console.log("🆔 Journal ID from bill:", response.data.data.journal_id);

        // Set the journal_id from the individual bill data
        setJournalId(response.data.data.journal_id || "");
      } else {
        console.log(
          "❌ Failed to fetch bill data, status:",
          response.statusCode
        );
        setJournalId("");
      }
    } catch (error) {
      console.error("💥 Error fetching individual bill:", error);
      setJournalId(""); // Clear journal_id on error
    }
  };

  useEffect(() => {
    // Load bills list
    getBills(filterBy, sortColumn, sortOrder);
    // Check if we're on a specific bill page and load its journal_id
    const billIdFromUrl = pathname.split("/")[3];
    if (billIdFromUrl && billIdFromUrl !== "create") {
      console.log("🌐 Loading bill from URL:", billIdFromUrl);
      getBillData(billIdFromUrl);
    } else {
      console.log("📝 Not on a specific bill page, clearing journalId");
      setJournalId(""); // Clear journal_id when not on a specific bill
    }
  }, [pathname]); // Re-run when URL changes

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleFavorite = (id) => {
    const updatedOptions = statusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setStatusOptions(updatedOptions);
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setAnchorEl(null);

    if (billsList && billsList.length > 0) {
      let filtered = [];

      switch (status.title) {
        case "All Bills":
          filtered = [...billsList];
          break;
        case "Open Bills":
          filtered = billsList.filter((bill) => bill.status_type === "OPEN");
          break;
        case "Draft Bills":
          filtered = billsList.filter((bill) => bill.status_type === "DRAFT");
          break;
        case "Void Bills":
          filtered = billsList.filter((bill) => bill.status_type === "VOID");
          break;
        default:
          filtered = [...billsList];
      }

      setTheFilteredArray(filtered);
    }
  };

  const handleRowClick = (row) => {
    return;
  };

  // ✅ UPDATED: Modified handleSelectRow to get journal_id when bill is selected
  const handleSelectRow = (key) => {
    console.log("🎯 Bill selected:", key.bill_number);

    const activeID = pathname.split("/")[3];
    const newArray = theFilteredArray.map((item) => ({
      ...item,
      isActive: item.bill_number === activeID ? true : item.isActive,
    }));

    // Navigate to the bill page
    router.push(`/purchase/bills/${key.bill_number}`);

    // Get the individual bill data to fetch journal_id
    getBillData(key.bill_number);
  };

  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleNewCustomView = () => {
    setOpenNewView(true);
    setAnchorEl(null);
  };

  // Handle menu item clicks
  const handleMenuItemClick = (item) => {
    if (item.route) {
      router.push(
        item.route +
          (item.query ? `?${new URLSearchParams(item.query).toString()}` : "")
      );
    }
    setMenuAnchorEl(null);
  };

  // Group options by favorite status
  const favoriteOptions = statusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = statusOptions.filter((opt) => !opt.is_favorite);

  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%", height: "90vh" }}>
        <Box
          sx={{
            width: "340px",
            backgroundColor: "white",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
            }}
          >
            <Typography
              onClick={handleDropdownClick}
              style={{
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {selectedStatus.title.length > 15
                ? `${selectedStatus.title.slice(0, 15)}...`
                : selectedStatus.title}
              <KeyboardArrowDownIcon
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontSize: "30px",
                  marginLeft: "1px",
                }}
              />
            </Typography>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: 250,
                  marginLeft: "-10px",
                  maxHeight: 500,
                  overflowY: "auto",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  mt: 1,
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                  "& .MuiList-root": {
                    padding: "0px",
                  },
                },
              }}
            >
              <Box
                sx={{
                  maxHeight: "310px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                }}
              >
                {favoriteOptions.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "black",
                        px: 2,
                        py: 1,
                      }}
                    >
                      FAVORITES
                    </Typography>
                    <Divider />
                    {favoriteOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        onClick={() => handleSelectStatus(option)}
                        sx={{
                          backgroundColor:
                            selectedStatus.id === option.id
                              ? "primary.main"
                              : "transparent",
                          color:
                            selectedStatus.id === option.id
                              ? "menu.text.normal"
                              : "menu.text.default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "primary.main",
                            "& .MuiTypography-root": {
                              color: "menu.text.normal",
                            },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              selectedStatus.id === option.id ? 500 : 400,
                            color:
                              selectedStatus.id === option.id
                                ? "menu.text.normal"
                                : "menu.text.default",
                          }}
                        >
                          {option.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(option.id, e)}
                          sx={{ padding: 0 }}
                        >
                          <StarIcon
                            fontSize="small"
                            sx={{ color: "#f3cf00" }}
                          />
                        </IconButton>
                      </MenuItem>
                    ))}
                    {favoriteOptions.length > 0 &&
                      defaultOptions.length > 0 && <Divider />}
                  </>
                )}

                {defaultOptions.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "black",
                        px: 2,
                        py: 1,
                      }}
                    >
                      DEFAULT FILTERS
                    </Typography>
                    <Divider />
                    {defaultOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        onClick={() => handleSelectStatus(option)}
                        sx={{
                          backgroundColor:
                            selectedStatus.id === option.id
                              ? "primary.main"
                              : "transparent",
                          color:
                            selectedStatus.id === option.id
                              ? "menu.text.normal"
                              : "menu.text.default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 2,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "primary.main",
                            "& .MuiTypography-root": {
                              color: "menu.text.normal",
                            },
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              selectedStatus.id === option.id ? 500 : 400,
                            color:
                              selectedStatus.id === option.id
                                ? "menu.text.normal"
                                : "menu.text.default",
                          }}
                        >
                          {option.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => toggleFavorite(option.id, e)}
                          sx={{ padding: 0 }}
                        >
                          {option.is_favorite ? (
                            <StarIcon
                              sx={{
                                fontSize: 18,
                                color: "#4285F4",
                              }}
                            />
                          ) : (
                            <StarBorderIcon
                              sx={{
                                fontSize: 18,
                                color: "#888",
                              }}
                            />
                          )}
                        </IconButton>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Box>

              <Divider />
              <MenuItem
                onClick={handleNewCustomView}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "white",
                  zIndex: 1,
                  "&:hover": {
                    backgroundColor: "#E6F1FF",
                  },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "primary.main",
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    marginRight: 1,
                  }}
                >
                  <AddIcon
                    sx={{
                      fontSize: 10,
                      color: "menu.text.normal",
                    }}
                  />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "primary.main",
                  }}
                >
                  New Custom View
                </Typography>
              </MenuItem>
            </Menu>

            <Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  width: "30px",
                  height: "30px",
                  minWidth: "20px",
                  padding: 0,
                  marginRight: "10px",
                  borderRadius: "5px",
                }}
                onClick={() => router.push("/purchase/bills/create")}
              >
                <AddOutlined sx={{ fontSize: "16px" }} />
              </Button>

              <IconButton
                className="more-icon"
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon className="button-more-svg" />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: "10px",
                    ml: "-170px",
                    borderRadius: "8px",
                    padding: "4px",
                    fontSize: "13px",
                    minWidth: "210px",
                    "& .MuiList-root": {
                      padding: "4px",
                    },
                  },
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onMouseEnter={(e) => {
                      if (item.submenu) {
                        setSubmenuAnchorEl(e.currentTarget);
                      } else {
                        setSubmenuAnchorEl(null);
                      }
                    }}
                    onMouseLeave={(e) => {
                      setSubmenuAnchorEl(null);
                    }}
                    onClick={() => {
                      if (!item.submenu) handleMenuItemClick(item);
                    }}
                    sx={{
                      backgroundColor:
                        menuAnchorEl && item.submenu
                          ? "primary.main"
                          : "transparent",
                      color:
                        menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                      borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
                      "& .menu-icon": {
                        color:
                          menuAnchorEl &&
                          item.submenu &&
                          "menu.text.normal !important",
                      },
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "menu.text.normal",
                        borderRadius: "5px",
                        "& .menu-icon": {
                          color: "menu.text.normal !important",
                        },
                      },
                      borderBottom: item.border ? "1px solid #ddd" : "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {item.icon}
                        <Typography
                          sx={{
                            ml: item.iconPosition === "right" ? 0 : 2,
                            fontSize: "13px",
                            fontWeight: item.hasArrow ? 500 : 400,
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                      {item.hasArrow && <ChevronRight className="menu-icon" />}
                    </Box>
                    {item.submenu && (
                      <Menu
                        anchorEl={submenuAnchorEl}
                        open={Boolean(
                          submenuAnchorEl &&
                            submenuAnchorEl.textContent.includes(item.text)
                        )}
                        onClose={() => setSubmenuAnchorEl(null)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        PaperProps={{
                          onMouseEnter: () => {
                            clearTimeout(submenuCloseTimeout.current);
                            setSubmenuHover(true);
                          },
                          onMouseLeave: () => {
                            setSubmenuHover(false);
                            submenuCloseTimeout.current = setTimeout(() => {
                              setSubmenuAnchorEl(null);
                            }, 200);
                          },
                          sx: {
                            ml: "",
                            fontSize: "12px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
                          },
                        }}
                      >
                        {item.submenu.map((subItem) => (
                          <MenuItem
                            key={subItem.key}
                            onClick={() => {
                              setSubmenuAnchorEl(null);
                              setMenuAnchorEl(null);
                              setSortColumn(subItem.key);
                              getBills(filterBy, subItem.key, subItem.order);
                            }}
                            selected={sortColumn === subItem.key}
                            sx={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 1,
                              "&:hover": {
                                backgroundColor: "primary.main !important",
                                color: "menu.text.default",
                                "& .sort-icon": {
                                  color: "menu.text.default",
                                },
                              },
                              backgroundColor:
                                sortColumn === subItem.key
                                  ? "primary.main !important"
                                  : "transparent",
                              color:
                                sortColumn === subItem.key
                                  ? "menu.text.default !important"
                                  : "",
                              fontWeight:
                                sortColumn === subItem.key ? 600 : 400,
                            }}
                          >
                            <Typography sx={{ fontSize: "12px" }}>
                              {subItem.label}
                            </Typography>

                            <Box
                              onClick={(e) => {
                                e.stopPropagation();
                                const newOrder =
                                  subItem.order === "D" ? "A" : "D";
                                subItem.order = newOrder;
                                setSortOrder(newOrder);
                                setSortColumn(subItem.key);
                                setSubmenuAnchorEl(null);
                                setMenuAnchorEl(null);
                                getBills(filterBy, subItem.key, newOrder);
                              }}
                              sx={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {subItem.order === "D" ? (
                                <ArrowDownward
                                  fontSize="inherit"
                                  className="sort-icon"
                                />
                              ) : (
                                <ArrowUpward
                                  fontSize="inherit"
                                  className="sort-icon"
                                />
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>

          <Divider />
          {loading ? (
            <></>
          ) : (
            <Box sx={{ overflow: "auto", height: "100%", flexGrow: 1 }}>
              <SideBarTable
                staticData={theFilteredArray}
                selected={selected}
                handleSelectRow={handleSelectRow}
                onRowClick={handleRowClick}
                type={"Bills"}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ flexGrow: 1, height: "100%", overflow: "auto" }}>
          {/* ✅ PASSING journalId to BillViewComponent */}
          <BillViewComponent journalId={journalId} />
        </Box>
      </Box>

      <SearchModal
        open={openSearchDialog}
        onClose={handleCloseSearchDialog}
        onSearch={(searchData) => console.log("Search:", searchData)}
      />
    </Box>
  );
};

export default Customer;
