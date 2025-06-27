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
//   Typography,
//   Select,
//   FormControl,
//   Grid,
//   CircularProgress,

// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { AddOutlined } from "@mui/icons-material";
// import SideBarTable from "../../../common/userManagementInterface";
// import InvoiceViewComponent from "../../../../../src/app/sales/invoices/InvoiceViewComponent"; // Importing InvoiceViewComponent
// import CustomFilterMenu from "../../../common/customFilterMenu";
// import apiService from "../../../../../src/services/axiosService";
// import config from "../../../../../src/services/config";
// import SearchModal from "../../../common/searchModal";
// import { useRouter } from "next/navigation";
// import SalesSideTable from "../../../../../src/app/common/SalesSideTable";
// import DotLoader from "../../../../components/DotLoader";
// import RecordPayment from "../../../common/payment/page";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// const dummyFavorites = [];
// const dummyDefaultFilters = [
//   {
//     id: "1",
//     isFavorite: false,
//     label: "All Invoices",
//     value: "Status.All",
//     key: "All",
//     empty_msg: "There are no items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "2",
//     isFavorite: false,
//     label: "Draft",
//     value: "Status.Draft",
//     key: "Draft ",
//     empty_msg: "There are no draft items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "3",
//     isFavorite: false,
//     label: "Locked",
//     value: "Status.Locked",
//     key: "Locked invoices",
//     empty_msg: "There are no locked items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "4",
//     isFavorite: false,
//     label: "Pending Approval",
//     value: "Status.Pending",
//     key: "Pending Approval invoices",
//     empty_msg: "There are no pending approval items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "5",
//     isFavorite: false,
//     label: "Approved",
//     value: "Status.Approved",
//     key: "Approved invoices",
//     empty_msg: "There are no approved items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "6",
//     isFavorite: false,
//     label: "Customer Viewed",
//     value: "Status.Viewed",
//     key: "Customer Viewed invoices",
//     empty_msg: "There are no customer viewed items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "7",
//     isFavorite: false,
//     label: "Partially Paid",
//     value: "Status.Paid",
//     key: "Partially Paid invoices",
//     empty_msg: "There are no partially paid items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "8",
//     isFavorite: false,
//     label: "Unpaid",
//     value: "Status.Unpaid",
//     key: "Unpaid invoices",
//     empty_msg: "There are no unpaid items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "9",
//     isFavorite: false,
//     label: "Overdue",
//     value: "Status.Overdue",
//     key: "Overdue invoices",
//     empty_msg: "There are no overdue items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "10",
//     isFavorite: false,
//     label: "Payment Initiated",
//     value: "Status.PaymentInitiated",
//     key: "Payment Initiated invoices",
//     empty_msg: "There are no payment initiated items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "11",
//     isFavorite: false,
//     label: "Paid",
//     value: "Status.Paid",
//     key: "Paid invoices",
//     empty_msg: "There are no paid items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "12",
//     isFavorite: false,
//     label: "Void",
//     value: "Status.Void",
//     key: "Void invoices",
//     empty_msg: "There are no void items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "13",
//     isFavorite: false,
//     label: "Debit Note",
//     value: "Status.DebitNote",
//     key: "Debit Note invoices",
//     empty_msg: "There are no debit note items for this filter",
//     column_orientation_type: "wrap",
//   },
//   {
//     id: "14",
//     isFavorite: false,
//     label: "Write Off",
//     value: "Status.WriteOff",
//     key: "Write Off invoices",
//     empty_msg: "There are no write off items for this filter",
//     column_orientation_type: "wrap",
//   },

// ];

// const menuItems = [
//   "Sort by",
//   "Import Invoices",
//   "Export Invoices",
//   "Export Current View",
//   "Import Debit Notes",
//   "Preferences",
//   "Manage Custom Fields",
//   "Configure Online Payments",
//   "Refresh List",
//   "Refresh Custom Width",
// ];

// const columns = [
//   { key: "name", label: "NAME" },
//   { key: "company", label: "COMPANY NAME" },
//   { key: "email", label: "EMAIL" },
//   { key: "phone", label: "PHONE" },
//   { key: "gstTreatment", label: "GST TREATMENT" },
//   { key: "receivables", label: "RECEIVABLES" },
//   { key: "receivablesBCY", label: "RECEIVABLES (BCY)" },
// ];

// const Invoice = () => {
//   const [customerList, setQuoteList] = useState([]);
//   const [selectedType, setSelectedType] = useState("All Invoices");
//   const [selectedKey, setSelectedKey] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//   const [selected, setSelected] = useState([]);
//   const [openSearchDialog, setOpenSearchDialog] = useState(false);
//   const [uniqueId, setUniqueId] = useState(null);
//   const [filterBy, setFilterBy] = useState("Status.All");
//   const [loadingView, setLoadingView] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [invoiceList, setInvoiceList] = useState([]);
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [favorites, setFavorites] = useState(dummyFavorites);
//   const [filters, setFilters] = useState(dummyDefaultFilters);
//   const router = useRouter();
//   const [visibleView, setVisibleView] = useState(true);

//   const allSelected =
//   customerList.length > 0 && selected.length === customerList.length;
// // Compute whether some rows are selected but not all
// const someSelected = selected.length > 0 && !allSelected;

//   const handleRowClick = (row) => {
//     router.push(`/sales/invoices/${row.invoice_id}`);
//   };

//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelected([]);
//     } else {
//       setSelected(customerList.map((row) => row.key));
//     }
//   };

//   const handleSelectRow = (id, event) => {
//     // Prevent row click event when clicking on the checkbox
//     if (event) {
//       event.stopPropagation();
//     }

//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   const handleSelect = (type, value,key) => {
//     setSelectedType(type);
//     setSelectedKey(key);
//     fetchInvoiceList(value);
//     setFilterBy(value);
//     setAnchorEl(null);
//   };

//   useEffect(() => {
//     fetchInvoiceList(filterBy);
//     const path = window.location.pathname; // "/sales/invoices/365756"
//     const segments = path.split("/");
//     const id = segments[segments.length - 1]; // Get the last part of the path
//     setUniqueId(id);
//     getInvoice(id);
//   }, []);

//   const getInvoice = (id) => {
//     getInvoiceData(id);
//   };

//   const organization_id = localStorage.getItem("organization_id");

//   const fetchInvoiceList = async (filterValue = "") => {
//     setLoading(true);
//     try {
//       const response = await apiService({
//         method: "GET",
//         url: `/api/v1/invoices`,
//         params: {
//           filter_by: filterValue,
//           page: 1,
//           per_page: 50,
//           sort_column: "created_time",
//           sort_order: "D",
//           limit: 25,
//           organization_id: organization_id,
//         },
//         customBaseUrl: config.SO_Base_url,
//       });
//       setInvoiceList(response.data.invoices);
//       setLoading(false);
//     } catch (error) {
//       console.error(
//         "Error fetching invoice list:",
//         error.response?.data || error.message
//       );
//       setInvoiceList([]); // Ensure invoiceList remains an array
//       setLoading(false);
//     }
//   };

//   const getInvoiceData = async (id) => {
//     setLoadingView(true);
//     try {
//       const response = await apiService({
//         method: "GET",
//         customBaseUrl: config.SO_Base_url,
//         url: `/api/v1/invoices/${id}`,
//         params: { organization_id: organization_id },
//       }); setInvoiceData(response.data.invoice);

//       setLoadingView(false);
//     } catch (error) {
//       console.error(
//         "Error fetching invoice data:",
//         error.response?.data || error.message
//       );
//       setLoadingView(false);
//     }
//   };

//   const handleCloseSearchDialog = () => setOpenSearchDialog(false);

//   return (
//     <Box>
//       <Box sx={{ display: "flex", width: "100%", height: "90vh",overflow: "hidden" }}>
//         <Box
//           sx={{
//             width: "340px",
//             backgroundColor: "white",
//             flexShrink: 0,
//             display: "flex",
//             flexDirection: "column",
//             height: "100%",
//           }}
//         >
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

//           {/* Custom Filter Menu */}
//           <CustomFilterMenu
//             anchorEl={anchorEl}
//             handleClose={() => setAnchorEl(null)}
//             favoritesData={favorites}
//             filtersData={filters}
//             onSelect={handleSelect}
//             onFavoriteToggle={(filter) => {
//               const updatedFilters = filters.map((f) =>
//                 f.id === filter.id ? { ...f, isFavorite: !f.isFavorite } : f
//               );
//               setFilters(updatedFilters);

//               const updatedFilter = updatedFilters.find(
//                 (f) => f.id === filter.id
//               );
//               if (updatedFilter.isFavorite) {
//                 setFavorites([...favorites, updatedFilter]);
//               } else {
//                 setFavorites(favorites.filter((f) => f.id !== filter.id));
//               }
//             }}
//             selectedType={selectedType}
//           />

//           <Box>
//           <IconButton
//               className="button-icon"
//               onClick={() => router.push("/sales/invoices/new")}
//             >
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
//         <Box sx={{ overflow: "auto", height: "100%", flexGrow: 1 }}>
//         <SalesSideTable
//           staticData={invoiceList}
//           selected={selected}
//           handleSelectRow={handleSelectRow}
//           selectedType={selectedType}
//           onRowClick={handleRowClick}
//           uniqueId={uniqueId}
//           getData={getInvoice}
//           loading={loading}
//           module="invoice"
//         />
//         </Box>
//      </Box>
//       <Box sx={{ flexGrow: 1}}>

//         {(invoiceData && visibleView) ? (
//           <InvoiceViewComponent
//             data={invoiceData}
//             callViewAPI={getInvoiceData}
//             callRecordPay={() => setVisibleView(false)}
//           />
//         ) : !visibleView ? (
//           <RecordPayment onCancel = {() => setVisibleView(true)} />
//         ) : (
//           <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
//             <CircularProgress size="30px" />
//           </Box>
//         )}
//         {loadingView && (
//            <DotLoader />
//         )}
//       </Box>
//       </Box>
//       <SearchModal
//         open={openSearchDialog}
//         onClose={handleCloseSearchDialog}
//         onSearch={(searchData) => console.log("Search:", searchData)}
//       />
//     </Box>
//   );
// };

// export default Invoice;

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
  CircularProgress,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  ListAlt,
} from "@mui/icons-material";
import InvoiceViewComponent from "../../../../../src/app/sales/invoices/InvoiceViewComponent";
import CustomFilterMenu from "../../../common/customFilterMenu";
import apiService from "../../../../../src/services/axiosService";
import config from "../../../../../src/services/config";
import SearchModal from "../../../common/searchModal";
import { useParams, useRouter } from "next/navigation";
import SalesSideTable from "../../../../../src/app/common/SalesSideTable";
import DotLoader from "../../../../components/DotLoader";
import RecordPayment from "../../../common/payment/PaymentForm";
import {
  ChevronRight,
  Download,
  MonitorCog,
  RefreshCcw,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";
import ExportModal from "../../../common/export/ExportModal";

const dummyFavorites = [];
const dummyDefaultFilters = [
  {
    id: "1",
    isFavorite: false,
    label: "All Invoices",
    value: "Status.All",
    key: "All",
    empty_msg: "There are no items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "2",
    isFavorite: false,
    label: "Draft",
    value: "Status.Draft",
    key: "Draft ",
    empty_msg: "There are no draft items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "3",
    isFavorite: false,
    label: "Locked",
    value: "Status.Locked",
    key: "Locked invoices",
    empty_msg: "There are no locked items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "4",
    isFavorite: false,
    label: "Pending Approval",
    value: "Status.Pending",
    key: "Pending Approval invoices",
    empty_msg: "There are no pending approval items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "5",
    isFavorite: false,
    label: "Approved",
    value: "Status.Approved",
    key: "Approved invoices",
    empty_msg: "There are no approved items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "6",
    isFavorite: false,
    label: "Customer Viewed",
    value: "Status.Viewed",
    key: "Customer Viewed invoices",
    empty_msg: "There are no customer viewed items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "7",
    isFavorite: false,
    label: "Partially Paid",
    value: "Status.Paid",
    key: "Partially Paid invoices",
    empty_msg: "There are no partially paid items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "8",
    isFavorite: false,
    label: "Unpaid",
    value: "Status.Unpaid",
    key: "Unpaid invoices",
    empty_msg: "There are no unpaid items for this filter",
    column_orientation_type: "wrap",
  },
  // {
  //   id: "9",
  //   isFavorite: false,
  //   label: "Overdue",
  //   value: "Status.Overdue",
  //   key: "Overdue invoices",
  //   empty_msg: "There are no overdue items for this filter",
  //   column_orientation_type: "wrap",
  // },
  {
    id: "10",
    isFavorite: false,
    label: "Payment Initiated",
    value: "Status.PaymentInitiated",
    key: "Payment Initiated invoices",
    empty_msg: "There are no payment initiated items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "11",
    isFavorite: false,
    label: "Paid",
    value: "Status.Paid",
    key: "Paid invoices",
    empty_msg: "There are no paid items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "12",
    isFavorite: false,
    label: "Void",
    value: "Status.Void",
    key: "Void invoices",
    empty_msg: "There are no void items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "13",
    isFavorite: false,
    label: "Debit Note",
    value: "Status.DebitNote",
    key: "Debit Note invoices",
    empty_msg: "There are no debit note items for this filter",
    column_orientation_type: "wrap",
  },
  {
    id: "14",
    isFavorite: false,
    label: "Write Off",
    value: "Status.WriteOff",
    key: "Write Off invoices",
    empty_msg: "There are no write off items for this filter",
    column_orientation_type: "wrap",
  },
];

const menuItems = [
  {
    text: "Sort by",
    icon: null,
    hasArrow: true,
    border: true,
    iconPosition: "right",
    submenu: [
      { key: "date", label: "Date", order: "D" },
      { key: "invoice_number", label: "Invoice#", order: "D" },
      { key: "reference_number", label: "Order Number", order: "D" },
      {
        key: "customer_name",
        label: "Customer Name",
        order: "D",
      },
      { key: "due_date", label: "Due Date", order: "D" },
      { key: "total", label: "Invoice Amount", order: "D" },
      { key: "balance", label: "Balance", order: "D" },
    ],
  },
  {
    text: "Import Invoices",
    icon: <Download className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export Invoices",
    icon: <Upload className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Export as E-way Bill",
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
    text: "Import Debit Notes",
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
    border: false,
  },
  {
    text: "Manage Custom Fields",
    icon: <ListAlt className="menu-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
  {
    text: "Configure Online Payments",
    icon: <MonitorCog className="menu-icon" />,
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
    icon: <RotateCcw className="menuZ-icon" />,
    hasArrow: false,
    primary: false,
    border: false,
  },
];

const Invoice = () => {
  const [customerList, setQuoteList] = useState([]);
  const [selectedType, setSelectedType] = useState("All Invoices");
  const [selectedKey, setSelectedKey] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [filterBy, setFilterBy] = useState("Status.All");
  const [loadingView, setLoadingView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [favorites, setFavorites] = useState(dummyFavorites);
  const [filters, setFilters] = useState(dummyDefaultFilters);
  const [visibleView, setVisibleView] = useState(true);
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);
  const page = useRef(1);
  const limit = useRef(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [journalId,setJournalId] = useState("");
  const params = useParams();
  const slug = params.slug;
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuHover, setSubmenuHover] = useState(false);
  const [sortColumn, setSortColumn] = useState("customer_name");
  const [sortOrder, setSortOrder] = useState("D");
  const [organizationData, setOrganizationData] = useState(null);
  let submenuCloseTimeout = useRef(null);

  const handleMenuItemClick = (item) => {
    if (item === "Export Invoices") {
      setOpen(true);
    } else if (item === "Refresh List") {
      fetchInvoiceList(filterBy, sortColumn, sortOrder);
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const allSelected =
    invoiceList.length > 0 && selected.length === invoiceList.length;

  const someSelected = selected.length > 0 && !allSelected;

  const handleRowClick = (row) => {
    router.push(`/sales/invoices/${row.invoice_id}`);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(invoiceList.map((row) => row._id));
    }
  };

  const handleFetchTable = (pageNo) => {
    page.current = pageNo;
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
  };

  const limitSet = (value) => {
    limit.current = value;
    page.current = 1;
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
  };

  const handleSelectRow = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelect = (type, value, key) => {
    setSelectedType(type);
    setSelectedKey(key);
    fetchInvoiceList(value, sortColumn, sortOrder);
    page.current = 1;
    limit.current = 10;
    setFilterBy(value);
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
    const path = window.location.pathname; // "/sales/invoices/365756"
    const segments = path.split("/");
    const id = segments[segments.length - 1]; // Get the last part of the path
    setUniqueId(id);
    getInvoice(id);
  }, []);

  const getInvoice = (id) => {
    getInvoiceData(id);
  };

  const callViewAPI = () => {
    fetchInvoiceList(filterBy, sortColumn, sortOrder);
    getInvoice(slug);
    setVisibleView(true);
  };

  const organization_id = localStorage.getItem("organization_id");

  const fetchInvoiceList = async (
    filterValue = "",
    sort_column,
    sort_order
  ) => {
    setLoading(true);
    try {
      const response = await apiService({
        method: "GET",
        url: `/api/v1/invoices`,
        params: {
          filter_by: filterValue,
          page: page.current,
          per_page: limit.current, // Fetch more at once for client-side pagination
          sort_column: sort_column,
          sort_order: sort_order,
          limit: limit.current, // Increased to support client-side pagination
          organization_id: organization_id,
        },
        customBaseUrl: config.SO_Base_url,
      });
      setInvoiceList(response.data.invoices);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching invoice list:",
        error.response?.data || error.message
      );
      setInvoiceList([]); // Ensure invoiceList remains an array
      setLoading(false);
    }
  };

  const getInvoiceData = async (id) => {
    setLoadingView(true);
    try {
      const response = await apiService({
        method: "GET",
        customBaseUrl: config.SO_Base_url,
        url: `/api/v1/invoices/${id}`,
        params: { organization_id: organization_id },
      });

      setInvoiceData(response.data.invoice);
      setJournalId(response.data.invoice.journal_id);
      // console.log(response.data.invoice,"response.data.invoiceresponse.data.invoice")
      setOrganizationData(response.data.organization);
      setLoadingView(false);
    } catch (error) {
      console.error(
        "Error fetching invoice data:",
        error.response?.data || error.message
      );
      setLoadingView(false);
    }
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
                <KeyboardArrowDownIcon
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              }
              color="primary"
              style={{
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {selectedType.length > 10
                ? `${selectedType.slice(0, 10)}...`
                : selectedType}
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
                const updatedFavorites = updatedFilters.filter(
                  (f) => f.isFavorite
                );
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
                onClick={() => router.push("/sales/invoices/new")}
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
                    height: "350px",
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
                      borderRadius: menuAnchorEl && item.submenu ? "5px" : "",
                      "& .menu-icon": {
                        color:
                          menuAnchorEl && item.submenu && "menu.text.normal !important",
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
                              fetchInvoiceList(
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
                                fetchInvoiceList(
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
                moduleName="Invoices"
                onClose={handleClose}
              />
            </Box>
          </Toolbar>
          <Divider />
          <SalesSideTable
            staticData={invoiceList} // Use paginated data instead of full list
            selected={selected}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            allSelected={allSelected}
            someSelected={someSelected}
            selectedType={selectedKey}
            onRowClick={handleRowClick}
            uniqueId={uniqueId}
            getData={getInvoice}
            loading={loading}
            module="invoice"
            callBackAPI={handleFetchTable} // pagination key
            page={page.current} // pagination key
            limit={limitSet} // pagination key
            limitValue={limit.current} // pagination key
            hasMore={hasMore} // pagination key
            totalCount={totalCount} // pagination key
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {invoiceData && visibleView ? (
            <InvoiceViewComponent
              data={invoiceData}
              callViewAPI={getInvoiceData}
              organizationData={organizationData}
              callRecordPay={() => setVisibleView(false)}
              journalId={journalId}
            />
          ) : !visibleView ? (
            <RecordPayment
              callViewAPI={callViewAPI}
              onCancel={() => setVisibleView(true)}
              invoiceData={invoiceData}
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

export default Invoice;
