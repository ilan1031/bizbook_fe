"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Skeleton,
  IconButton,
  Box,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  MoreHoriz,
} from "@mui/icons-material";
import CustomizedTable from "../../common/table";
import SearchModal from "../../common/searchModal";
import apiService from "../../../../src/services/axiosService";
import WelcomePage from "./homepage/page";
import config from "../../../../src/services/config";
import { useRouter } from "next/navigation";
import DotLoader from "../../../components/DotLoader";
import CustomFilterMenu from "../../common/customFilterMenu";
import ExportModal from "../../common/export/ExportModal";
import { ChevronRight, Download, RefreshCcw, Upload } from "lucide-react";

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All",
    value: "Status.All",
    key: "Recurring Bills",
    empty_msg: "There are no recurring Bills",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Active",
    value: "Status.Active",
    key: "Recurring Bills Active",
    empty_msg: "There are no active recurring Bills",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Stopped",
    value: "Status.Stopped",
    key: "Recurring Bills Stopped",
    empty_msg: "There are no stopped recurring Bills",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Expired",
    value: "Status.Expired",
    key: "Recurring Bills Expired",
    empty_msg: "There are no expired recurring bills",
    column_orientation_type: "wrap",
  },
];

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [];

// Updated menuItems with icons
const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "createdAt", label: "Created Time", order: "D" },
      {
        key: "vendor_name",
        label: "Vendor Name",
        order: "D",
      },
      { key: "recurrence_name", label: "Profile Name", order: "D" },
      { key: "next_bill_date", label: "Next Bill Date", order: "D" },
      { key: "total", label: "Amount", order: "D" },
    ],
  },
  {
    text: "Import Recurring Bills",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Exports",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
    submenu: [
      { key: "createdAt", label: "Export Recurring Bills", order: "D" },
      {
        key: "vendor_name",
        label: "Export Current View",
      },
    ],
  },
  {
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "vendor_name", label: "VENDOE NAME" },
  { key: "recurrence_name", label: "PROFILE NAME" },
  { key: "recurrence_frequency", label: "FREQUENCY" },
  { key: "last_sent_date", label: "LAST BILL DATE" },
  { key: "next_bill_date", label: "NEXT BILL DATE" },
  { key: "status_type", label: "STATUS" },
  { key: "total_formatted", label: "AMOUNT" },
];

const TableSkeleton = () => {
  return (
    <Box sx={{ width: "100%", p: 1 }}>
      {/* Header Row */}
      <Box sx={{ display: "flex", mb: 1 }}>
        <Skeleton variant="rectangular" width={28} height={24} sx={{ mr: 1 }} />
        {columns.map((column, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={`${100 / (columns.length + 1)}%`}
            height={40}
            sx={{ mr: 1 }}
          />
        ))}
      </Box>

      {/* Data Rows - Generate 5 skeleton rows */}
      {[...Array(5)].map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex", mb: 1 }}>
          <Skeleton
            variant="rectangular"
            width={28}
            height={24}
            sx={{ mr: 1 }}
          />
          {columns.map((column, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / (columns.length + 1)}%`}
              height={40}
              sx={{ mr: 1 }}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const SelectionToolbar = ({ selectedCount, onClearSelection }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        bgcolor: "#f5f5f5", // Grey background
        borderBottom: "1px solid #e0e0e0",
        px: 2,
        py: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none",
            borderColor: "#ddd",
            color: "#333",
            mr: 1,
            bgcolor: "white",
            "&:hover": { bgcolor: "#f8f8f8" },
          }}
        >
          Bulk Update
        </Button>

        <IconButton
          size="small"
          sx={{ bgcolor: "white", border: "1px solid #ddd" }}
        >
          <MoreHoriz />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "primary.main",
            fontWeight: 500,
            "& .dot": {
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              mr: 1,
            },
          }}
        >
          <span className="dot"></span>
          <Typography variant="body2" fontWeight={500}>
            {selectedCount} Selected
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const RecurringBills = () => {
  // Existing state variables and functions
  const [recurringBillList, setRecurringBillList] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedKey, setSelectedKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [loading, setLoading] = useState(false);
  const [welcomePg, setWelcomPg] = useState(false);
  const [open, setOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("recurrence_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const router = useRouter();

  // Compute whether all rows are selected
  const allSelected =
    recurringBillList.length > 0 &&
    selected.length === recurringBillList.length;
  // Compute whether some rows are selected but not all
  const someSelected = selected.length > 0 && !allSelected;

  const handleRowClick = (data) => {
    router.push(`/purchase/recurringbills/${data.recurring_bill_id}`);
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchRecurringBillList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchRecurringBillList(filterBy, sortColumn, sortOrder);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(recurringBillList.map((row) => row._id));
    }
  };

  // Handle individual row checkbox
  const handleSelectRow = (id, event) => {
    console.log("id, event", id, event);
    // Prevent row click event when clicking on the checkbox
    if (event) {
      event.stopPropagation();
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelected([]);
  };

  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const handleSelect = (type, value, key) => {
    // console.log("ype, value, key",type, value, key)
    setSelectedType(type);
    setSelectedKey(key);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchRecurringBillList(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    if (item === "Export Recurring Bills") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchRecurringBillList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchRecurringBillList(filterBy, sortColumn, sortOrder);
  }, []);

  const organization_id = localStorage.getItem("organization_id");
  const handleSort = (sortCol, sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchRecurringBillList(filterBy, sortCol, sortOrd);
  };

  const fetchRecurringBillList = async (
    filterValue = "",
    sort_column,
    sort_order
  ) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: page.current,
          per_page: limit.current,
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current,
          organization_id: organization_id,
        },
        url: `/api/v1/recurring-bill`,
        customBaseUrl: config.PO_Base_url,
        file: false,
      });
      const data = response.data.recurring_bills;
      if (filterValue === "Status.All" && data.length === 0) {
        setWelcomPg(true);
      }
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      setRecurringBillList(data);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && dotsAndSkeleton === 0 ? (
        <DotLoader />
      ) : (
        <Grid container>
          <Grid bgcolor="white" items md={12}>
            {welcomePg ? (
              <></>
            ) : (
              <>
                {selected.length > 0 ? (
                  // Show selection toolbar when items are selected
                  <SelectionToolbar
                    selectedCount={selected.length}
                    onClearSelection={handleClearSelection}
                  />
                ) : (
                  // <></>
                  // Show regular toolbar when no items are selected
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
                    <Button
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      endIcon={
                        <KeyboardArrowDownIcon
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        />
                      }
                      color="black"
                      style={{
                        fontWeight: 700,
                        fontSize: "large",
                        textTransform: "none",
                      }}
                    >
                      {selectedType} Recurring Bill
                    </Button>
                    <CustomFilterMenu
                      anchorEl={anchorEl}
                      handleClose={() => setAnchorEl(null)}
                      favoritesData={favorites}
                      filtersData={filters}
                      onSelect={handleSelect}
                      onFavoriteToggle={(filter) => {
                        const updatedFilters = filters.map((f) =>
                          f.id === filter.id
                            ? { ...f, isFavorite: !f.isFavorite }
                            : f
                        );

                        setFilters(updatedFilters);

                        const updatedFavorites = updatedFilters.filter(
                          (f) => f.isFavorite
                        );
                        setFavorites(updatedFavorites);
                      }}
                      selectedType={selectedType}
                    />
                    <Box>
                      <Button
                        variant="contained"
                        className="button-submit"
                        startIcon={<AddOutlined />}
                        sx={{ mr: 1 }}
                        onClick={() =>
                          router.push(
                            "/purchase/recurringbills/newRecurringBill"
                          )
                        }
                      >
                        New
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
                          sx: {
                            width: "190px",
                            height: "165px",
                            fontSize: "11px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: "8px",
                            mt: 1,
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
                              if (!item.submenu) handleMenuItemClick(item.text);
                            }}
                            sx={{
                              //   backgroundColor:
                              //     menuAnchorEl && item.submenu
                              //       ? "#408dfb"
                              //       : "transparent",
                              //   color: menuAnchorEl && item.submenu ? "white" : "",
                              borderRadius:
                                menuAnchorEl && item.submenu ? "5px" : "",
                              //   "& .menu-icon": {
                              //     color:
                              //       menuAnchorEl &&
                              //       item.submenu &&
                              //       "white !important",
                              //   },
                              "&:hover": {
                                backgroundColor: "primary.main !important",
                                color: "menu.text.normal",
                                borderRadius: "5px",
                                "& .menu-icon": {
                                  color: "menu.text.normal !important",
                                },
                              },
                              borderBottom: item.border
                                ? "1px solid #ddd"
                                : "none",
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
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
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
                              {item.hasArrow && (
                                <ChevronRight className="menu-icon" />
                              )}
                            </Box>
                            {/* Submenu */}
                            {item.submenu && (
                              <Menu
                                anchorEl={submenuAnchorEl}
                                open={Boolean(
                                  submenuAnchorEl &&
                                    submenuAnchorEl.textContent.includes(
                                      item.text
                                    )
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
                                    submenuCloseTimeout.current = setTimeout(
                                      () => {
                                        setSubmenuAnchorEl(null);
                                      },
                                      200
                                    );
                                  },
                                  sx: {
                                    ml: "-195px",
                                    fontSize: "12px",
                                    boxShadow:
                                      "0px 2px 8px rgba(0, 0, 0, 0.15)",
                                    borderRadius: "8px",
                                  },
                                }}
                              >
                                {item.submenu.map((subItem) => (
                                  <MenuItem
                                    key={subItem.key}
                                    onClick={() => {
                                      if (item.text === "Exports") {
                                        handleMenuItemClick(subItem.label);
                                      } else {
                                        setSubmenuAnchorEl(null);
                                        setMenuAnchorEl(null);
                                        setSortColumn(subItem.key);
                                        fetchVendorList(
                                          filterBy,
                                          subItem.key,
                                          subItem.order
                                        ); // default order
                                      }
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
                                        subItem.order = newOrder; // mutate local config or handle externally
                                        setSortOrder(newOrder);
                                        setSortColumn(subItem.key);
                                        setSubmenuAnchorEl(null);
                                        setMenuAnchorEl(null);
                                        fetchVendorList(
                                          filterBy,
                                          subItem.key,
                                          newOrder
                                        );
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
                      <ExportModal
                        open={open}
                        moduleName="Recurring Bills"
                        onClose={handleClose}
                      />
                      <IconButton
                        sx={{
                          backgroundColor: "#ff9800",
                          color: "white",
                          borderRadius: 1,
                          "&:hover": { backgroundColor: "#e68900" },
                          fontSize: "13px",
                          width: "31px",
                          fontWeight: 800,
                        }}
                      >
                        ?
                      </IconButton>
                    </Box>
                  </Toolbar>
                )}
                <Divider />
              </>
            )}
            {/* Use the existing CustomizedTable component with updated props */}
            {!welcomePg ? (
              <>
                {loading ? (
                  dotsAndSkeleton > 1 && <TableSkeleton columns={columns} />
                ) : (
                  <CustomizedTable
                    columns={columns}
                    staticData={recurringBillList}
                    selected={selected}
                    handleSelectAll={handleSelectAll}
                    handleSelectRow={handleSelectRow}
                    allSelected={allSelected}
                    settingsAnchorEl={settingsAnchorEl}
                    handleSettingsClick={handleSettingsClick}
                    handleSettingsClose={handleSettingsClose}
                    selectedMenuItem={selectedMenuItem}
                    onRowClick={handleRowClick}
                    setSelectedMenuItem={setSelectedMenuItem}
                    handleOpenSearchDialog={handleOpenSearchDialog}
                    value="recurring_bill"
                    selectedType={selectedKey}
                    someSelected={someSelected}
                    loading={loading}
                    callBackAPI={handleFetchTable}
                    page={page.current}
                    limit={limitSet}
                    limitValue={limit.current}
                    hasMore={hasMore}
                    totalCount={totalCount}
                    sortColumn={sortColumn} //sortby
                    sortOrder={sortOrder} //sortby
                    handleSort={handleSort} //sortby
                  />
                )}
              </>
            ) : (
              <WelcomePage />
            )}
          </Grid>
          <SearchModal
            open={openSearchDialog}
            onClose={handleCloseSearchDialog}
            onSearch={(searchData) => console.log("Search:", searchData)}
          />
        </Grid>
      )}
    </>
  );
};
export default RecurringBills;
