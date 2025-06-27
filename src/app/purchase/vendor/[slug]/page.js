// "use client";
// import { useEffect, useState } from "react";
// import {
//   Toolbar,
//   Button,
//   Menu,
//   MenuItem,
//   IconButton,
//   Box,
//   Divider,
//   Grid,
// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { AddOutlined } from "@mui/icons-material";
// import FilterMenu from "../../../common/filterDropDown";
// import SearchModal from "../../../common/searchModal";
// // import SideBarTable from "../../../common/userManagementInterface";
// import SideBarTable from "../../../common/ContactSideTable"
// import { useRouter } from "next/navigation";
// import CustomProfileView from "../../../common/view/view";
// import apiService from "@/src/services/axiosService";

// const dummyFavorites = [
//   {
//     default_customview_id: "2375679000000057003",
//     is_favorite: true,
//     title: "All Vendors",
//     value: "Status.All",
//     key: "All Vendors",
//     empty_msg: "There are no Vendors",
//     column_orientation_type: "wrap",
//   },
//   {
//     default_customview_id: "2375679000000057004",
//     is_favorite: true,
//     title: "Active Vendors",
//     value: "Status.Active",
//     key: "Active Vendors",
//     empty_msg: "There are no active Vendors",
//     column_orientation_type: "wrap",
//   },
// ];

// const dummyDefaultFilters = [
//   {
//     default_customview_id: "2375679000000057003",
//     is_favorite: true,
//     title: "All Vendors",
//     value: "Status.All",
//     key: "All Vendors",
//     empty_msg: "There are no Vendors",
//     column_orientation_type: "wrap",
//   },
//   {
//     default_customview_id: "2375679000000057005",
//     is_favorite: false,
//     title: "Inactive Vendors",
//     value: "Status.Inactive",
//     key: "Inactive Vendors",
//     empty_msg: "There are no inactive Vendors",
//     column_orientation_type: "wrap",
//   },
//   {
//     default_customview_id: "2375679000000057006",
//     is_favorite: false,
//     title: "Overdue Vendors",
//     value: "Status.Overdue",
//     key: "Overdue Vendors",
//     empty_msg: "There are no overdue Vendors",
//     column_orientation_type: "wrap",
//   },
// ];

// const menuItems = [
//   "Sort by",
//   "Import Vendors",
//   "Export Vendors",
//   "Export Current View",
//   "Preferences",
//   "Refresh List",
//   "Reset Column Width",
// ];

// const Vendor = () => {
//   const [selectedType, setSelectedType] = useState("All Vendors");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//   const [selected, setSelected] = useState([]);
//   const [openSearchDialog, setOpenSearchDialog] = useState(false);
//   const [filterBy, setFilterBy] = useState("Status.All");
//   const [vendorList, setVendorList] = useState([]);
//   const [uniqueId, setUniqueId] = useState(null);
//   const [vendorData, setVendorData] = useState(null);
//   const router = useRouter();

//   const handleRowClick = (row) => {
//     router.push(`/purchase/vendor/${row.contact_id}`);
//   };
//   const handleSelectRow = (key) => {
//     setSelected((prev) =>
//       prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
//     );
//   };

//   const handleSelect = (type, value) => {
//     setSelectedType(type);
//     setFilterBy(value);
//     fetchVendorList(value);
//     setAnchorEl(null);
//   };

//   useEffect(() => {
//     fetchVendorList(filterBy);
//     const path = window.location.pathname;
//     const segments = path.split("/");
//     const id = segments[segments.length - 1]; // Get the last part of the path
//     setUniqueId(id);
//     getVendor(id);
//   }, []);

//   const getVendor = (id) => {
//     getVendorData(id);
//   };
//   const organization_id = localStorage.getItem("organization_id");

//   const fetchVendorList = async (filterValue = "") => {
//     try {
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/vendors`,
//         params: {
//           filter_by: filterValue,
//           page: 1,
//           per_page: 50,
//           sort_column: "contact_name",
//           sort_order: "A",
//           organization_id: `${organization_id}`,
//         },
//         file: false,
//       });
//       const { data } = response.data;
//       setVendorList(data);
//     } catch (error) {
//       console.error("Failed to fetch vendor list:", error);
//     }
//   };

//   const getVendorData = async (uniqueId) => {
//     if (!uniqueId) return; // Early exit if uniqueId is missing

//     try {
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/contact/${uniqueId}`,
//         params: {
//           organization_id: `${organization_id}`,
//         },
//         file: false,
//       });

//       const { data } = response.data;
//       // console.log(data,"-------");

//       setVendorData(data);
//     } catch (error) {
//       console.error("Failed to fetch vendor data:", error);
//     }
//   };

//   const handleCloseSearchDialog = () => setOpenSearchDialog(false);

//   return (
//     <Grid container>
//       <Grid bgcolor="white" items md={2.5}>
//         <Toolbar
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "0px",
//             position: "sticky",
//             top: 0,
//             zIndex: 1000,
//             backgroundColor: "white",
//           }}
//         >
//           <Button
//             onClick={(e) => setAnchorEl(e.currentTarget)}
//             endIcon={
//               <KeyboardArrowDownIcon color="primary" sx={{ fontWeight: 600 }} />
//             }
//             color="black"
//             style={{
//               fontWeight: 600,
//               fontSize: "15px",
//               textTransform: "none",
//             }}
//           >
//             {selectedType.length > 10
//               ? `${selectedType.slice(0, 10)}...`
//               : selectedType}
//           </Button>

//           <FilterMenu
//             anchorEl={anchorEl}
//             handleClose={() => setAnchorEl(null)}
//             favoritesData={dummyFavorites}
//             filtersData={dummyDefaultFilters}
//             onSelect={handleSelect}
//             selectedType={selectedType}
//           />

//           <Box>
//             <IconButton className="button-icon">
//               <AddOutlined className="button-svg" />
//             </IconButton>

//             <IconButton
//               className="more-icon"
//               onClick={(e) => setMenuAnchorEl(e.currentTarget)}
//             >
//               <MoreVertIcon className="button-more-svg" />
//             </IconButton>
//             <Menu
//               anchorEl={menuAnchorEl}
//               open={Boolean(menuAnchorEl)}
//               onClose={() => setMenuAnchorEl(null)}
//             >
//               {menuItems.map((item) => (
//                 <MenuItem key={item}>{item}</MenuItem>
//               ))}
//             </Menu>
//           </Box>
//         </Toolbar>

//         <Divider />

//         <SideBarTable
//           staticData={vendorList}
//           selected={selected}
//           handleSelectRow={handleSelectRow}
//           selectedType={selectedType}
//           onRowClick={handleRowClick}
//           uniqueId={uniqueId}
//           getCustomer={getVendor}
//         />
//       </Grid>
//       <Grid items sm={6} md={9.5}>
//         {vendorData && (
//           <CustomProfileView details={vendorData} moduleKey="Vendor" callViewAPI={getVendorData} />
//         )}
//       </Grid>

//       <SearchModal
//         open={openSearchDialog}
//         onClose={handleCloseSearchDialog}
//         onSearch={(searchData) => console.log("Search:", searchData)}
//       />
//     </Grid>
//   );
// };

// export default Vendor;

"use client";
import { useEffect, useRef, useState } from "react";
import {
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Grid,
  Typography,
  ListItemText,
  ListItemIcon,
  Button,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  Height,
} from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import SearchModal from "../../../common/searchModal";
import SideBarTable from "../../../common/ContactSideTable";
import { useRouter } from "next/navigation";
import apiService from "../../../../services/axiosService";
import Link from "next/link";
import CustomProfileView from "../../../common/view/view";
// import Button from "../../../common/btn/Button";

import {
  ChevronRight,
  Download,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";

const vendorStatusOptions = [
  {
    id: "1",
    default_customview_id: "2375679000000057003",
    is_favorite: true,
    title: "All Vendors",
    value: "Status.All",
    key: "All Vendors",
    empty_msg: "There are no Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    default_customview_id: "2375679000000057004",
    is_favorite: true,
    title: "Active Vendors",
    value: "Status.Active",
    key: "Active Vendors",
    empty_msg: "There are no active Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    default_customview_id: "2375679000000057005",
    is_favorite: false,
    title: "Inactive Vendors",
    value: "Status.Inactive",
    key: "Inactive Vendors",
    empty_msg: "There are no inactive Vendors",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    default_customview_id: "2375679000000057006",
    is_favorite: false,
    title: "Duplicate Vendors",
    value: "Status.Overdue",
    key: "Duplicate Vendors",
    empty_msg: "There are no overdue Vendors",
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
      { key: "contact_name", label: "Name", order: "D" },
      { key: "company_name", label: "Company Name", order: "D" },
      { key: "email", label: "Email", order: "D" },
      {
        key: "outstanding_payable_amount_bcy",
        label: "Payables (BCY)",
        order: "D",
      },
      {
        key: "unused_credits_payable_amount_bcy",
        label: "Unused Credits (BCY)",
        order: "D",
      },
      { key: "createdAt", label: "Created Time", order: "D" },
      { key: "updatedAt", label: "Last Modified Time", order: "D" },
    ],
  },
  {
    text: "Import Vendors",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Vendors",
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
  {
    text: "Reset Column Width",
    icon: <RotateCcw className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];
const Vendor = () => {
  useEffect(() => {
    fetchVendorList(filterBy, sortColumn, sortOrder);
    const path = window.location.pathname;
    const segments = path.split("/");
    const id = segments[segments.length - 1]; // Get the last part of the path
    setUniqueId(id);
    getVendor(id);

    // Load favorites from localStorage
    const savedStatusOptions = localStorage.getItem("vendorStatusOptions");
    if (savedStatusOptions) {
      setStatusOptions(JSON.parse(savedStatusOptions));
    }
  }, []);

  const [statusOptions, setStatusOptions] = useState(vendorStatusOptions);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [uniqueId, setUniqueId] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(true);
  const [openNewView, setOpenNewView] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("contact_name");
  const [sortOrder, setSortOrder] = useState("D");
  let submenuCloseTimeout = useRef(null);
  const [filterBy, setFilterBy] = useState("Status.All");

  const router = useRouter();
  const organization_id = localStorage.getItem("organization_id");

  const handleRowClick = (row) => {
    router.push(`/purchase/vendor/${row.contact_id}`);
  };

  const handleSelectRow = (key) => {
    router.push(`/purchase/vendor/${key.contact_id}`);
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleFavorite = (id, e) => {
    if (e) {
      e.stopPropagation();
    }
    const updatedOptions = statusOptions.map((option) =>
      option.id === id
        ? { ...option, is_favorite: !option.is_favorite }
        : option
    );
    setStatusOptions(updatedOptions);
    // Save to localStorage
    localStorage.setItem("vendorStatusOptions", JSON.stringify(updatedOptions));
  };

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
    setAnchorEl(null);

    if (vendorList && vendorList.length > 0) {
      let filtered = [];

      switch (status.title) {
        case "All Vendors":
          filtered = [...vendorList];
          break;
        case "Active Vendors":
          filtered = vendorList.filter((bill) => bill.status_type === "ACTIVE");
          break;
        case "Inactive Vendors":
          filtered = vendorList.filter(
            (bill) => bill.status_type === "INACTIVE"
          );
          break;
        case "Duplicate Vendors":
          filtered = vendorList.filter((bill) => bill.status_type === "VOID");
          break;
        default:
          filtered = [...vendorList];
      }
      setFilteredData(filtered);
    }
  };

  const getVendor = (id) => {
    getVendorData(id);
  };

  const fetchVendorList = async (
    filterValue = "Status.All",
    sort_column,
    sort_order
  ) => {
    setListLoading(true);
    try {
      // Add artificial delay of 200ms for better UX with loading state
      await new Promise((resolve) => setTimeout(resolve, 200));

      const response = await apiService({
        method: "GET",
        url: `/api/v1/vendors`,
        params: {
          filter_by: filterValue,
          page: 1,
          per_page: 50,
          sort_column: sort_column,
          sort_order: sort_order,
          organization_id: `${organization_id}`,
        },
        file: false,
      });
      const { data } = response.data;
      setVendorList(data || []);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch vendor list:", error);
      setVendorList([]);
    } finally {
      setListLoading(false);
    }
  };

  const getVendorData = async (uniqueId) => {
    if (!uniqueId) {
      setDetailLoading(false);
      return; // Early exit if uniqueId is missing
    }

    setDetailLoading(true);
    try {
      // Add artificial delay of 200ms for better UX with loading state
      await new Promise((resolve) => setTimeout(resolve, 200));

      const response = await apiService({
        method: "GET",
        url: `/api/v1/contact/${uniqueId}`,
        params: {
          organization_id: `${organization_id}`,
        },
        file: false,
      });

      const { data } = response.data;
      setVendorData(data);
    } catch (error) {
      console.error("Failed to fetch vendor data:", error);
      setVendorData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseSearchDialog = () => setOpenSearchDialog(false);

  const handleNewCustomView = () => {
    setOpenNewView(true);
    setAnchorEl(null);
  };

  // Group options by favorite status
  const favoriteOptions = statusOptions.filter((opt) => opt.is_favorite);
  const defaultOptions = statusOptions.filter((opt) => !opt.is_favorite);

  // Skeleton loaders
  const ToolbarSkeleton = () => (
    <>
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
        <Skeleton variant="text" width={120} height={36} />
        <Box>
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            sx={{ display: "inline-block", mx: 0.5 }}
          />
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            sx={{ display: "inline-block", mx: 0.5 }}
          />
        </Box>
      </Toolbar>
      <Divider />
    </>
  );

  const SidebarTableSkeleton = () => (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={36}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      {[...Array(8)].map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            p: 1,
            borderRadius: 1,
          }}
        >
          <Skeleton variant="circular" width={36} height={36} sx={{ mr: 1 }} />
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  const ProfileViewSkeleton = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}>
        <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
        <Box sx={{ width: "100%" }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={24} />

          <Box sx={{ display: "flex", mt: 2 }}>
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              sx={{ borderRadius: 1, mr: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              sx={{ borderRadius: 1, mr: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={80}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {[...Array(3)].map((_, index) => (
          <Box key={index} sx={{ width: "33%", mb: 3, pr: 2 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="15%" height={24} sx={{ mb: 1 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </Box>
  );

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
          {listLoading ? (
            <>
              <ToolbarSkeleton />
              <SidebarTableSkeleton />
            </>
          ) : (
            <>
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
                      // height: "360px",
                      marginLeft: "-10px",
                      maxHeight: 500,
                      overflowY: "auto", // Scrollable content
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Smooth shadow
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
                      maxHeight: "310px", // Limit scroll height
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
                                backgroundColor: "primary.main", // Hover effect color
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

                  {/* New Custom View Fixed at Bottom */}
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
                      backgroundColor: "white", // Ensure it stays on top
                      zIndex: 1,
                      "&:hover": {
                        backgroundColor: "#E6F1FF",
                      },
                    }}
                  >
                    <Button
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
                    </Button>
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
                      minWidth: "20px", // ensures the button doesn't expand due to internal padding
                      padding: 0, // removes internal padding
                      marginRight: "10px",
                      borderRadius: "5px",
                    }}
                    onClick={() => router.push("/purchase/vendor/createvendor")}
                  >
                    <AddOutlined sx={{ fontSize: "16px" }} />{" "}
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
                          if (!item.submenu) handleMenuItemClick(item.text);
                        }}
                        sx={{
                          backgroundColor:
                            menuAnchorEl && item.submenu
                              ? "primary.main"
                              : "transparent",
                          color:
                            menuAnchorEl && item.submenu
                              ? "menu.text.normal"
                              : "",
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
                                  fetchVendorList(
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
                </Box>
              </Toolbar>

              <Divider />
              <Box sx={{ overflow: "auto", height: "100%", flexGrow: 1 }}>
                <SideBarTable
                  staticData={filteredData}
                  selected={selected}
                  handleSelectRow={handleSelectRow}
                  onRowClick={handleRowClick}
                  uniqueId={uniqueId}
                  getData={getVendor}
                  type={"Vendors"}
                />
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {detailLoading ? (
            <ProfileViewSkeleton />
          ) : vendorData ? (
            <CustomProfileView
              details={vendorData}
              moduleKey="Vendor"
              uniqueId={uniqueId}
              callViewAPI={getVendorData}
            />
          ) : null}
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

export default Vendor;
