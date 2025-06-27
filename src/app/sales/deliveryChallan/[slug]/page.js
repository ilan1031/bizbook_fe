"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Select as MuiSelect,
  Typography,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddOutlined, ArrowDownward, ArrowUpward, ListAlt } from "@mui/icons-material";
import SalesSideTable from "../../../common/SalesSideTable";
import DeliverychallanViewComponent from "../DeliverychallanViewComponent";
import CustomFilterMenu from "../../../common/customFilterMenu";
import SearchModal from "../../../common/searchModal";
import { useRouter } from "next/navigation";
import apiService from "../../../../services/axiosService";
import config from "../../../../services/config";
import DotLoader from "../../../../components/DotLoader";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExportModal from "../../../common/export/ExportModal";
import { ChevronRight, RefreshCcw, RotateCcw, Settings, Upload } from "lucide-react";

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
    id: "6",
    isFavorite: false,
    label: "Partially Invoiced",
    value: "Status.PartiallyInvoiced",
    key: "Delivery Challan Partially Invoiced",
    empty_msg: "There are no Partially Invoiced Delivery Challan",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    isFavorite: false,
    label: "Invoiced",
    value: "Status.Invoiced",
    key: "Delivery Challan Invoiced",
    empty_msg: "There are no Invoiced Delivery Challan",
    column_orientation_type: "wrap",
  },
];

// Updated dummyFavorites as an empty array that will be populated
const dummyFavorites = [];

const menuItems = [
  {
    text: "Sort by",
    icon: null, hasArrow: true, border:true ,iconPosition: "right",
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
    border:true,
  },
  {
    text: "Preferences",
    icon: <Settings className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border:false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAlt className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border:true,
  },{
    text: "Refresh List",
    icon: <RefreshCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border:false,
  },
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border:false
  },
];

const DeliveryChallanPage = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [loadingView, setLoadingView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challanList, setChallanList] = useState([]);
  const [challanData, setChallanData] = useState(null);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [totalCount, setTotalCount] = useState(0);
  const [organizationData, setOrganizationData] = useState(null);
  const page = useRef(1);
  const limit = useRef(10);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const allSelected =
  challanList.length > 0 && selected.length === challanList.length;
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const someSelected = selected.length > 0 && !allSelected;
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (row) => {
    router.push(`/sales/deliveryChallan/${row.deliverychallan_id}`);
  };

  const handleSelectRow = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const handleClose = () => {
    setOpen(false);
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(challanList.map((row) => row._id));
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchChallanList(filterBy,sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchChallanList(filterBy,sortColumn, sortOrder);
  };

  const handleSelect = (type, value, key) => {
    setSelectedType(type);
    setFilterBy(value);
    page.current = 1;
    limit.current = 10;
    fetchChallanList(value,sortColumn, sortOrder);
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item) => {
    if (item === "Export Delivery Challans") {
      setOpen(true);
    }else if (item === "Refresh List") {
      fetchChallanList(filterBy,sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    fetchChallanList(filterBy,sortColumn, sortOrder);
    const path = window.location.pathname;
    const segments = path.split("/");
    const id = segments[segments.length - 1]; // Get the last part of the path
    setUniqueId(id);
    getChallan(id);
  }, []);

  const getChallan = (id) => {
    getChallanData(id);
  };

  const organization_id = localStorage.getItem("organization_id");

  const fetchChallanList = async (filterValue = "",sort_column,sort_order) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/deliverychallans`,
        params: {
          filter: filterValue,
          page: page.current,
          per_page: limit.current, // Fetch more at once for client-side pagination
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current, // Increased to support client-side pagination
          organization_id: organization_id,
        },
        customBaseUrl: config.SO_Base_url,
      });
      setChallanList(response.data.deliverychallans);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching delivery challan list:", error);
      setChallanList([]); // Ensure challanList remains an array
      setLoading(false);
    }
  };

  const getChallanData = async (id) => {
    setLoadingView(true);
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/delivery-challans/${id}`,
        params: { organization_id: organization_id },
      });
      setChallanData(response.data.data);
       setOrganizationData(response.data.organizationData);
      setLoadingView(false);
    } catch (error) {
      console.error("Error fetching delivery challan data:", error);
      setLoadingView(false);
    }
  };

  const callChallanApis = (id) => {
    fetchChallanList(filterBy,sortColumn, sortOrder);
    getChallanData(id);
  };

  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "90vh",
          overflow: "hidden",
        }}
      >
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
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={
                <KeyboardArrowDownIcon color="primary" sx={{ fontWeight: 600 }} />
              }
              color="black"
              style={{
                fontWeight: 600,
                fontSize: "15px",
                textTransform: "none",
              }}
            >
              {selectedType}
            </Button>
            {/* Custom Filter Menu */}
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
                const updatedFavorites = updatedFilters.filter((f) => f.isFavorite);
                setFavorites(updatedFavorites);
              }}
              selectedType={selectedType}
            />
            <Box>
              <IconButton
                className="button-icon"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover":{
                    backgroundColor: "primary.main",
                  }
                }}
                onClick={() => router.push("/sales/deliveryChallan/new")}
              >
                <AddOutlined className="button-svg" />
              </IconButton>
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
                                  fetchChallanList(
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
                                    fetchChallanList(
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
                  <ExportModal open={open} moduleName="Delivery Challans" onClose={handleClose} />
            </Box>
          </Toolbar>
          <Divider />
          <SalesSideTable
              staticData={challanList} // Use paginated data instead of full list
              selected={selected}
              handleSelectRow={handleSelectRow}
              handleSelectAll={handleSelectAll}
              allSelected={allSelected}
              someSelected={someSelected} 
              selectedType={selectedType}
              onRowClick={handleRowClick}
              uniqueId={uniqueId}
              getData={getChallan}
              loading={loading}
              module="deliveryChallan"
              callBackAPI={handleFetchTable} // pagination key
              page={page.current} // pagination key
              limit={limitSet} // pagination key
              limitValue={limit.current} // pagination key
              hasMore={hasMore} // pagination key
              totalCount={totalCount} // pagination key
            />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {challanData ? (
            <DeliverychallanViewComponent
              data={challanData}
              callViewAPI={callChallanApis}
              organizationData={organizationData}
            />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
              <CircularProgress size="30px" />
            </Box>
          )}
          {loadingView && <DotLoader />}
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

export default DeliveryChallanPage;