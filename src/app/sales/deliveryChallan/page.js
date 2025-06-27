"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Skeleton,
  Box,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CustomizedTable from "../../common/table";
import SearchModal from "../../common/searchModal";
import apiService from "../../../../src/services/axiosService";
// import WelcomePage from "./homepage/page";
import config from "../../../../src/services/config";
import { useRouter } from "next/navigation";
import DotLoader from "../../../components/DotLoader";
import CustomFilterMenu from "../../common/customFilterMenu";
import ExportModal from "../../common/export/ExportModal";
import {
  ChevronRight,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import DeliveryChallanPage from "./homepage/page";

const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All",
    value: "Status.All",
    key: "Delivery Challan",
    empty_msg: "There are no Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Draft",
    value: "Status.Draft",
    key: "Delivery Challan Draft",
    empty_msg: "There are no Draft Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Open",
    value: "Status.Open",
    key: "Delivery Challan Open",
    empty_msg: "There are no Open Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Delivered",
    value: "Status.Delivered",
    key: "Delivery Challan Delivered",
    empty_msg: "There are no Delivered Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Returned",
    value: "Status.Returned",
    key: "Delivery Challan Returned",
    empty_msg: "There are no Returned Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Partially Invoiced",
    value: "Status.PartiallyInvoiced",
    key: "Delivery Challan Partially Invoiced",
    empty_msg: "There are no Partially Invoiced Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Invoiced",
    value: "Status.Invoiced",
    key: "Delivery Challan Invoiced",
    empty_msg: "There are no Invoiced Delivery Challan",
    column_orientation_type: "wrap",
  },
];

const TableSkeleton = () => {
  const columns = [
    { key: "date_formatted", label: "DATE" },
    { key: "account_name", label: "EXPENSE ACCOUNT" },
    { key: "invoice_number", label: "REFERENCE#" },
    { key: "vendor_name", label: "VENDOR NAME" },
    { key: "paid_through_account_id", label: "PAID THROUGH" },
    { key: "client_name", label: "CUSTOMER NAME" },
    { key: "status_text", label: "STATUS" },
    { key: "amount_formatted", label: "AMOUNT" },
  ];

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
      { key: "date", label: "Date", order: "D" },
      { key: "deliverychallan_number", label: "Delivery Challan#", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "total", label: "Amount", order: "D" },
    ],
  },
  {
    text: "Export Delivery Challans",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAltIcon className="menu-icon" />,
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
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const columns = [
  { key: "date", label: "DATE" },
  { key: "deliverychallan_number", label: "DELIVERY CHALLAN#" },
  // { key: "reference_number", label: "REFERENCE#" },
  { key: "customer_name", label: "CUSTOMER NAME" },
  { key: "status_formatted", label: "Status" },
  { key: "invoiced_status_formatted", label: "INVOICE STATUS" },
  { key: "total_formatted", label: "AMOUNT" },
];

const DeliveryChallan = () => {
  // Existing state variables and functions
  const [deliveryList, setDeliveryList] = useState([]);
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
  const router = useRouter();
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);

  // Compute whether all rows are selected
  const allSelected =
    deliveryList.length > 0 && selected.length === deliveryList.length;
  // Compute whether some rows are selected but not all
  const someSelected = selected.length > 0 && !allSelected;

  const handleRowClick = (customer) => {
    router.push(`/sales/deliveryChallan/${customer.deliverychallan_id}`);
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(deliveryList.map((row) => row._id));
    }
  };

  // Handle individual row checkbox
  const handleSelectRow = (id, event) => {
    // Prevent row click event when clicking on the checkbox
    if (event) {
      event.stopPropagation();
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSettingsClick = (event) =>
    setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const handleSelect = (type, value, key) => {
    setSelectedType(type);
    setSelectedKey(key);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchChallans(value, sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleMenuItemClick = (item) => {
    if (item === "Export Delivery Challans") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchChallans(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchChallans(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchChallans(filterBy, sortColumn, sortOrder);
  };

  useEffect(() => {
    fetchChallans(filterBy,sortColumn, sortOrder);
  }, []);

  const handleSort = (sortCol,sortOrd) => {
    setSortColumn(sortCol);
    setSortOrder(sortOrd);
    fetchChallans(filterBy,sortCol,sortOrd);
  }

  const organization_id = localStorage.getItem("organization_id");
  const fetchChallans = async (filterValue = "",sort_column,sort_order) => {
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
        url: `/api/v1/deliverychallans`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      const data = response.data.deliverychallans;
      if (filterValue === "Status.All" && data.length === 0) {
        setWelcomPg(true);
      }
      setDotsAndSkeleton(dotsAndSkeleton + 1);
      setDeliveryList(data);
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
             {welcomePg ? (<></>):(<>
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
                {selectedType} Delivery Challan
              </Button>
              <CustomFilterMenu
                anchorEl={anchorEl}
                handleClose={() => setAnchorEl(null)}
                favoritesData={favorites}
                filtersData={filters}
                onSelect={handleSelect}
                onFavoriteToggle={(filter) => {
                  const updatedFilters = filters.map((f) =>
                    f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
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
                  onClick={() => router.push("/sales/deliveryChallan/new")}
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
                      width: "200px",
                      height: "245px",
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
                          backgroundColor:
                            menuAnchorEl && item.submenu
                              ? "primary.main"
                              : "transparent",
                          color: menuAnchorEl && item.submenu ? "menu.text.normal" : "",
                          borderRadius:
                            menuAnchorEl && item.submenu ? "5px" : "",
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
                                ml: "-195px",
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
                                  fetchChallans(
                                    filterBy,
                                    subItem.key,
                                    subItem.order
                                  ); // default order
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
                                    fetchChallans(
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
                  moduleName="Delivery Challans"
                  onClose={handleClose}
                />
              </Box>
            </Toolbar>
            <Divider />
             </>)}
            {/* Use the existing CustomizedTable component with updated props */}
            {!welcomePg ? (
              <>
                {loading ? (
                  dotsAndSkeleton > 1 && <TableSkeleton columns={columns} />
                ) : (
                  <CustomizedTable
                    columns={columns}
                    staticData={deliveryList}
                    hasMore={hasMore} // pagination key
                    totalCount={totalCount} // pagination key
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
                    value="deliverychallan"
                    selectedType={selectedKey}
                    callBackAPI={handleFetchTable} // pagination key
                    someSelected={someSelected} // Pass this additional prop
                    page={page.current} // pagination key
                    limit={limitSet} // pagination key
                    limitValue={limit.current} // pagination key
                    loading={loading}
                    sortColumn={sortColumn} //sortby
                    sortOrder={sortOrder} //sortby
                    handleSort={handleSort} //sortby
                  />
                )}
              </>
            ) : (
              <DeliveryChallanPage />
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
export default DeliveryChallan;
