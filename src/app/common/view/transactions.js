"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Link,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import apiService from "../../../../src/services/axiosService";
import config from "../../../../src/services/config";
import { usePathname, useRouter } from "next/navigation";
import { AddCircle, KeyboardArrowDown } from "@mui/icons-material";

const Transactions = ({ customerId, moduleKey }) => {
  const [expanded, setExpanded] = useState({
    invoices: false,
    purchaseorder: false,
    quotes: false,
    retainerInvoices: false,
    salesOrder: false,
    deliveryChallan: false,
  });
  const organization_id = localStorage.getItem("organization_id");
  const [invoiceList, setInvoiceList] = useState([]);
  const [quotesList, setQuoteList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [visibleQuotes, setVisibleQuotes] = useState(false);
  const [visible, setVisible] = useState(false);
  const [salesOrderList, setSalesOrderList] = useState([]);
  const [visibleSalesOrder, setVisibleSalesOrder] = useState(false);
  const [loadingSalesOrder, setLoadingSalesOrder] = useState(false);
  const [deliveryChallanList, setDeliveryChallanList] = useState([]);
  const [visibleDeliveryChallan, setVisibleDeliveryChallan] = useState(false);
  const [loadingDeliveryChallan, setLoadingDeliveryChallan] = useState(false);
  const [bill_ID, setBill_ID] = useState("");
  const [billsDetail, setBillsDetail] = useState([]);
  const [purchaseOrderDetail, setPurchaseOrderDetail] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  const fetchInvoiceList = async (filterValue) => {
    setLoading(true);
    const response = await apiService({
      method: "GET",
      url: `/api/v1/invoices?organization_id=${organization_id}&page=1&limit=25&sort_column=created_time&sort_order=D&customer_id=${customerId}`,
      customBaseUrl: config.SO_Base_url,
      file: false,
    });
    const data = response.data.invoices;
    setInvoiceList(data);
    setLoading(false);
  };

  const handleView = (key) => {
    if (key === "invoices") {
      setVisible(true);
    } else if (key === "quotes") {
      setVisibleQuotes(true);
    } else if (key === "salesOrder") {
      setVisibleSalesOrder(true);
    } else if (key === "deliveryChallan") {
      setVisibleDeliveryChallan(true);
    }
  };
  const handleInvoice = (id) => {
    router.push(`/sales/invoices/${id}`);
  };
  const fetchQuotesList = async (filterValue = "") => {
    setLoadingQuotes(true);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: 1,
          per_page: 50,
          sort_column: "created_time",
          sort_order: "D",
          limit: 25,
          organization_id: organization_id,
          customer_id: customerId,
        },
        url: `/api/v1/estimates`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      const data = response.data.estimates;
      setQuoteList(data);
      setLoadingQuotes(false);
    } catch (error) {
      console.error("Failed to fetch customer list:", error);
      setLoadingQuotes(false);
    }
  };
  //salesorder

  const fetchSalesOrderList = async (filterValue = "") => {
    setLoadingSalesOrder(true);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: 1,
          per_page: 50,
          sort_column: "created_time",
          sort_order: "D",
          limit: 25,
          organization_id: organization_id,
          customer_id: customerId,
        },
        url: `/api/v1/salesorders`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      const data = response.data.salesorders; // Fixed to match expected API response
      setSalesOrderList(data || []); // Ensure `salesOrderList` is always an array
      setLoadingSalesOrder(false);
    } catch (error) {
      console.error("Failed to fetch sales order list:", error);
      setLoadingSalesOrder(false);
    }
  };

  const fetchDeliveryChallanList = async (filterValue = "") => {
    setLoadingDeliveryChallan(true);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: 1,
          per_page: 50,
          sort_column: "created_time",
          sort_order: "D",
          limit: 25,
          organization_id: organization_id,
          customer_id: customerId,
        },
        url: `/api/v1/deliverychallans`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      const data = response.data.deliverychallans; // Fixed to match expected API response
      setDeliveryChallanList(data || []); // Ensure `salesOrderList` is always an array
      setLoadingDeliveryChallan(false);
    } catch (error) {
      console.error("Failed to fetch sales order list:", error);
      setLoadingDeliveryChallan(false);
    }
  };

  // Handle individual accordion toggle
  const handleChange = (panel) => (event, isExpanded) => {
    if (panel === "invoices") {
      fetchInvoiceList("Status.All");
    } else if (panel === "quotes") {
      fetchQuotesList("Status.All");
    } else if (panel === "salesOrder") {
      fetchSalesOrderList("Status.All");
    } else if (panel === "deliveryChallan") {
      fetchDeliveryChallanList("Status.All");
    }
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  const handleNew = (event, key) => {
    event.stopPropagation();
    if (key === "invoices") {
      router.push(`/sales/invoices/new?contact_id=${customerId}`);
    } else if (key === "salesOrder") {
      router.push(`/sales/salesOrder/new?contact_id=${customerId}`);
    } else if (key === "quotes") {
      router.push(`/sales/quotes/new?contact_id=${customerId}`);
    } else if (key === "deliveryChallan") {
      router.push(`/sales/deliveryChallan/new?contact_id=${customerId}`);
    }
  };

  const getColor = (key) => {
    if (
      key === "Paid" ||
      key === "Invoiced" ||
      key === "Closed" ||
      key === "Delivered" ||
      key === "Accepted"
    ) {
      return "#22b378 !important";
    } else if (key === "Sent" || key === "Confirmed") {
      return "#408dfb !important";
    } else if (key === "Overdue" || key === "Declined") {
      return "#f76831!important";
    } else {
      return "#879697 !important";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    let po_id = pathname.split("/")[3];
    setBill_ID(po_id);
    getBills(po_id, organization_id);
    getPurchaseOrder(po_id, organization_id);
  }, [pathname]);

  const getBills = async (PO_ID, ORG_ID) => {
    try {
      let params = {
        url: `api/v1/vendor/get-all-bills?org_id=${ORG_ID}&vendor_id=${PO_ID}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      const response = await apiService(params);
      if (response.statusCode === 200) {
        setBillsDetail(response.data.data);
        console.log(response.data.data, "Bills from BE");
      } else {
        console.log("The Error", response.data.message);
      }
    } catch (error) {
      console.log("Error in getBills", error);
    }
  };
  const getPurchaseOrder = async (PO_ID, ORG_ID) => {
    console.log(PO_ID, ORG_ID, "PO_ID, ORG_ID");
    try {
      let params = {
        url: `api/v1/vendor/get-all-purchase-orders?org_id=${ORG_ID}&vendor_id=${PO_ID}`,
        method: "GET",
        customBaseUrl: config.PO_Base_url,
      };
      const response = await apiService(params);
      console.log(response, "PO from BE---------------------");
      if (response.statusCode === 200) {
        setPurchaseOrderDetail(response.data.data);
      } else {
        console.log("The Error", response.data.message);
      }
    } catch (error) {
      console.log("Error in getBills", error);
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#ffffff", borderRadius: "16px" }}>
      {/* Global Expand/Collapse Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Button
          endIcon={<KeyboardArrowDown />}
          // variant="outlined"
          size="small"
          sx={{
            fontSize: "16px",
            px: 2,
            py: 0.5,
            color: "#21263c",
            "&:hover": {
              background: "transparent",
            },
            "& svg": {
              color: "#408dfb",
            },
            // borderColor: "#1976d2",
            textTransform: "none",
          }}
        >
          Go to transactions
        </Button>
      </Box>

      {moduleKey === "Customer" && (
        <>
          {/* Invoices */}
          <Accordion
            expanded={expanded.invoices}
            onChange={handleChange("invoices")}
            sx={{
              mb: 2,
              mt: 2,
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded.invoices ? "#1976d2" : "#616161",
                    fontSize: "18px",
                  }}
                />
              }
              sx={{
                px: 2,
                minHeight: "48px",
                flexDirection: "row-reverse",
                backgroundColor: "#f9f9fb",
                "& .MuiAccordionSummary-content": {
                  margin: "10px 0",
                  flexGrow: 1,
                  justifyContent: "space-between",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}
                  onClick={() => handleInvoice(row.invoice_id)} // Pass the row object here
                >
                  Invoices
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Divider orientation="vertical" flexItem />
                <Button
                  startIcon={
                    <AddCircle style={{ width: "15px", color: "#408dfb" }} />
                  }
                  size="small"
                  onClick={(event) => handleNew(event, "invoices")}
                  sx={{
                    fontSize: "12px",
                    color: "#000",
                    textTransform: "none",
                  }}
                >
                  New
                </Button>
                {/* {expanded.invoices && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "18px", color: "#616161" }}
                />
                <Typography sx={{ fontSize: "13px", color: "#616161" }}>
                  Status: All
                </Typography>
                <ArrowDropDownIcon sx={{ color: "#616161" }} />
              </Box>
            )} */}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small" className="transaction">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#f5f5f5",
                        borderTop: "1px solid #e0e0e0",
                        color: "#222 !important",
                      }}
                    >
                      <TableCell align="left">DATE</TableCell>
                      <TableCell align="left">INVOICE NUMBER</TableCell>
                      <TableCell align="left">ORDER NUMBER</TableCell>
                      <TableCell align="right">AMOUNT</TableCell>
                      <TableCell align="right">BALANCE DUE</TableCell>
                      <TableCell align="left">STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceList.length > 0 &&
                      invoiceList.map((invoice, idx) => (
                        <React.Fragment key={invoice.invoice_id}>
                          {idx === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {invoice?.date_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                color: "#408dfb !important",
                                fontSize: "13px",
                              }}
                            >
                              <Link
                                href={`/sales/invoices/${invoice.invoice_id}`}
                                underline="none"
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {invoice?.invoice_number}
                              </Link>
                            </TableCell>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {invoice?.order_number || "-"}
                            </TableCell>
                            <TableCell
                              align="right"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {invoice?.total_formatted}
                            </TableCell>
                            <TableCell
                              align="right"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {invoice?.balance_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                fontSize: "13px",
                                color: getColor(invoice?.status_formatted),
                              }}
                            >
                              {invoice?.status_formatted}
                            </TableCell>
                          </TableRow>
                          {idx < invoiceList.length - 1 && (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    {!loading && invoiceList.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7} // Adjust dynamically based on actual column count
                          align="center"
                          sx={{
                            borderBottom: "none",
                            height: 100,
                            textAlign: "center", // Ensures text and content are centered
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "13px", fontWeight: 500 }}
                          >
                            There are no invoices -{" "}
                            <span
                              style={{
                                color: "#408dfb",
                                fontSize: "12px",
                                fontWeight: 400,
                              }}
                              onClick={(event) => handleNew(event, "invoices")}
                            >
                              Add New
                            </span>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {loading && invoiceList.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7} // Adjust dynamically based on actual column count
                          align="center"
                          sx={{
                            borderBottom: "none",
                            height: 100,
                            textAlign: "center", // Ensures text and content are centered
                          }}
                        >
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <CircularProgress size="30px" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {invoiceList.length > 0 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" fontSize="13px">
                    Total Count :{" "}
                    {!visible ? (
                      <span
                        onClick={() => handleView("invoices")}
                        style={{ color: "#408dfb", cursor: "pointer" }}
                      >
                        view
                      </span>
                    ) : (
                      invoiceList.length
                    )}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Quotes */}
          <Accordion
            expanded={expanded.quotes}
            onChange={handleChange("quotes")}
            sx={{
              mb: 2,
              mt: 2,
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded.quotes ? "#1976d2" : "#616161",
                    fontSize: "18px",
                  }}
                />
              }
              sx={{
                px: 2,
                minHeight: "48px",
                flexDirection: "row-reverse",
                backgroundColor: "#f9f9fb",
                "& .MuiAccordionSummary-content": {
                  margin: "10px 0",
                  flexGrow: 1,
                  justifyContent: "space-between",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}
                >
                  Quotes
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Divider orientation="vertical" flexItem />
                <Button
                  startIcon={
                    <AddCircle style={{ width: "15px", color: "#408dfb" }} />
                  }
                  size="small"
                  sx={{
                    fontSize: "12px",
                    color: "#000",
                    textTransform: "none",
                  }}
                  onClick={(event) => handleNew(event, "quotes")}
                >
                  New
                </Button>
                {/* {expanded.quotes && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "18px", color: "#616161" }}
                />
                <Typography sx={{ fontSize: "13px", color: "#616161" }}>
                  Status: All
                </Typography>
                <ArrowDropDownIcon sx={{ color: "#616161" }} />
              </Box>
            )} */}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small" className="transaction">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#f5f5f5",
                        borderTop: "1px solid #e0e0e0",
                        color: "#222 !important",
                      }}
                    >
                      <TableCell align="left">DATE</TableCell>
                      <TableCell align="left">QUOTE#</TableCell>
                      <TableCell align="left">REFERENCE NUMBER</TableCell>
                      <TableCell align="right">AMOUNT</TableCell>
                      <TableCell align="left">STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotesList.length > 0 &&
                      quotesList.map((quote, idx) => (
                        <React.Fragment key={quote.quote_id}>
                          {idx === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {quote?.date_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                color: "#408dfb !important",
                                fontSize: "13px",
                              }}
                            >
                              <Link
                                href={`/sales/quotes/${quote?.quote_id} `}
                                underline="none"
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {quote?.estimate_number}
                              </Link>
                            </TableCell>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {quote?.reference_number}
                            </TableCell>
                            <TableCell
                              align="right"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {quote?.total_formatted}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                fontSize: "13px",
                                color: getColor(quote?.status_formatted),
                              }}
                            >
                              {quote?.status_formatted}
                            </TableCell>
                          </TableRow>
                          {idx < quotesList.length - 1 && (
                            <TableRow>
                              <TableCell colSpan={5} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    {!loadingQuotes && quotesList.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7} // Adjust dynamically based on actual column count
                          align="center"
                          sx={{
                            borderBottom: "none",
                            height: 100,
                            textAlign: "center", // Ensures text and content are centered
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "13px", fontWeight: 500 }}
                          >
                            There are no quotes -{" "}
                            <span
                              style={{
                                color: "#408dfb",
                                fontSize: "12px",
                                fontWeight: 400,
                              }}
                              onClick={(event) => handleNew(event, "quotes")}
                            >
                              Add New
                            </span>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {loadingQuotes && (
                      <TableRow>
                        <TableCell
                          colSpan={7} // Adjust dynamically based on actual column count
                          align="center"
                          sx={{
                            borderBottom: "none",
                            height: 100,
                            textAlign: "center", // Ensures text and content are centered
                          }}
                        >
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <CircularProgress size="30px" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {invoiceList.length > 0 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" fontSize="13px">
                    Total Count :{" "}
                    {!visibleQuotes ? (
                      <span
                        onClick={() => handleView("quotes")}
                        style={{ color: "#408dfb", cursor: "pointer" }}
                      >
                        view
                      </span>
                    ) : (
                      quotesList.length
                    )}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* salesorder */}
          <Accordion
            expanded={expanded.salesOrder}
            onChange={handleChange("salesOrder")} // Fixed to match state key
            sx={{
              mb: 2,
              mt: 2,
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded.salesOrder ? "#1976d2" : "#616161",
                    fontSize: "18px",
                  }}
                />
              }
              sx={{
                px: 2,
                minHeight: "48px",
                flexDirection: "row-reverse",
                backgroundColor: "#f9f9fb",
                "& .MuiAccordionSummary-content": {
                  margin: "10px 0",
                  flexGrow: 1,
                  justifyContent: "space-between",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}
                >
                  Sales Orders
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Divider orientation="vertical" flexItem />
                <Button
                  startIcon={
                    <AddCircle style={{ width: "15px", color: "#408dfb" }} />
                  }
                  size="small"
                  sx={{
                    fontSize: "12px",
                    color: "#000",
                    textTransform: "none",
                  }}
                  onClick={(event) => handleNew(event, "salesOrder")}
                >
                  New
                </Button>
                {/* {expanded.salesOrder && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "18px", color: "#616161" }}
                />
                <Typography sx={{ fontSize: "13px", color: "#616161" }}>
                  Status: All
                </Typography>
                <ArrowDropDownIcon sx={{ color: "#616161" }} />
              </Box>
            )} */}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small" className="transaction">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#f5f5f5",
                        borderTop: "1px solid #e0e0e0",
                        color: "#222 !important",
                      }}
                    >
                      <TableCell align="left">DATE</TableCell>
                      <TableCell align="left">SALES ORDER#</TableCell>
                      <TableCell align="left">REFERENCE NUMBER</TableCell>

                      <TableCell align="left">SHIPMENT DATE</TableCell>
                      <TableCell align="right">AMOUNT</TableCell>
                      <TableCell align="left">STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesOrderList.length > 0 &&
                      salesOrderList.map((salesorder, idx) => (
                        <React.Fragment key={salesorder.salesorder_id}>
                          {idx === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {salesorder?.date_formatted}{" "}
                            </TableCell>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              <Link
                                href={`/sales/salesOrder/${salesorder?.salesorder_id} `}
                                underline="none"
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {salesorder?.salesorder_number}
                              </Link>
                            </TableCell>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {salesorder?.reference_number || "-"}
                            </TableCell>

                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {salesorder?.shipment_date_formatted || "-"}
                              {/* Fixed field name */}
                            </TableCell>
                            <TableCell
                              align="right"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {salesorder?.total_formatted}{" "}
                              {/* Fixed field name */}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                fontSize: "13px",
                                color: getColor(salesorder?.status_formatted),
                              }}
                            >
                              {salesorder?.status_formatted}
                            </TableCell>
                          </TableRow>
                          {idx < salesOrderList.length - 1 && (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    {!loadingSalesOrder && salesOrderList.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={{
                            borderBottom: "none",
                            height: 100,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "13px", fontWeight: 500 }}
                          >
                            There are no sales order -{" "}
                            <span
                              style={{
                                color: "#408dfb",
                                fontSize: "12px",
                                fontWeight: 400,
                              }}
                              onClick={(event) =>
                                handleNew(event, "salesOrder")
                              }
                            >
                              Add New
                            </span>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {loadingSalesOrder && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={{
                            borderBottom: "none",
                            height: 100,
                            textAlign: "center",
                          }}
                        >
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <CircularProgress size="30px" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {salesOrderList.length > 0 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" fontSize="13px">
                    Total Count :{" "}
                    {!visibleSalesOrder ? (
                      <span
                        onClick={() => handleView("salesOrder")}
                        style={{ color: "#408dfb", cursor: "pointer" }}
                      >
                        view
                      </span>
                    ) : (
                      salesOrderList.length
                    )}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* DeliveryChallan */}
          <Accordion
            expanded={expanded.deliveryChallan}
            onChange={handleChange("deliveryChallan")} // Fixed to match state key
            sx={{
              mb: 2,
              mt: 2,
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded.deliveryChallan ? "#1976d2" : "#616161",
                    fontSize: "18px",
                  }}
                />
              }
              sx={{
                px: 2,
                minHeight: "48px",
                flexDirection: "row-reverse",
                backgroundColor: "#f9f9fb",
                "& .MuiAccordionSummary-content": {
                  margin: "10px 0",
                  flexGrow: 1,
                  justifyContent: "space-between",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}
                >
                  Delivery Challan
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Divider orientation="vertical" flexItem />
                <Button
                  startIcon={
                    <AddCircle style={{ width: "15px", color: "#408dfb" }} />
                  }
                  size="small"
                  onClick={(event) => handleNew(event, "deliveryChallan")}
                  sx={{
                    fontSize: "12px",
                    color: "#000",
                    textTransform: "none",
                  }}
                >
                  New
                </Button>
                {/* {expanded.deliveryChallan && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "18px", color: "#616161" }}
                />
                <Typography sx={{ fontSize: "13px", color: "#616161" }}>
                  Status: All
                </Typography>
                <ArrowDropDownIcon sx={{ color: "#616161" }} />
              </Box>
            )} */}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small" className="transaction">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#f5f5f5",
                        borderTop: "1px solid #e0e0e0",
                        color: "#222 !important",
                      }}
                    >
                      <TableCell align="left">DATE</TableCell>
                      <TableCell align="left">DELIVERY CHALLAN#</TableCell>
                      <TableCell align="left">REFERENCE NUMBER</TableCell>
                      <TableCell align="right">AMOUNT</TableCell>
                      <TableCell align="left">STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryChallanList.length > 0 &&
                      deliveryChallanList.map((deliveryChallan, idx) => (
                        <React.Fragment key={deliveryChallan.deliverychallan_id}>
                          {idx === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {deliveryChallan?.date_formatted}{" "}
                            </TableCell>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              <Link
                                href={`/sales/deliveryChallan/${deliveryChallan?.deliverychallan_id} `}
                                underline="none"
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {deliveryChallan?.deliverychallan_number}
                              </Link>
                            </TableCell>
                            <TableCell
                              align="left"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {deliveryChallan?.reference_number || "-"}
                            </TableCell>

                            <TableCell
                              align="right"
                              className="trans-td"
                              sx={{ fontSize: "13px" }}
                            >
                              {deliveryChallan?.total_formatted}{" "}
                              {/* Fixed field name */}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                fontSize: "13px",
                                color: getColor(
                                  deliveryChallan?.status_formatted
                                ),
                              }}
                            >
                              {deliveryChallan?.status_formatted}
                            </TableCell>
                          </TableRow>
                          {idx < deliveryChallanList.length - 1 && (
                            <TableRow>
                              <TableCell colSpan={5} sx={{ border: 0, padding: 0, background: 'transparent' }}>
                                <Box sx={{ height: 12, background: 'transparent' }} />
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    {!loadingDeliveryChallan &&
                      deliveryChallanList.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            align="center"
                            sx={{
                              borderBottom: "none",
                              height: 100,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "13px", fontWeight: 500 }}
                            >
                              There are no delivery challan -{" "}
                              <span
                                style={{
                                  color: "#408dfb",
                                  fontSize: "12px",
                                  fontWeight: 400,
                                }}
                                onClick={(event) =>
                                  handleNew(event, "deliveryChallan")
                                }
                              >
                                Add New
                              </span>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    {loadingDeliveryChallan && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={{
                            borderBottom: "none",
                            height: 100,
                            textAlign: "center",
                          }}
                        >
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <CircularProgress size="30px" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {deliveryChallanList.length > 0 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" fontSize="13px">
                    Total Count :{" "}
                    {!visibleDeliveryChallan ? (
                      <span
                        onClick={() => handleView("deliveryChallan")}
                        style={{ color: "#408dfb", cursor: "pointer" }}
                      >
                        view
                      </span>
                    ) : (
                      deliveryChallanList.length
                    )}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </>
      )}
      {/*Bills*/}
      {/* <Accordion
        expanded={expanded.bills}
        onChange={handleChange("bills")}
        sx={{
          mb: 2,
          mt: 2,
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          borderRadius: "16px",
          overflow: "hidden",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: expanded.bills ? "#1976d2" : "#616161",
              }}
            />
          }
          sx={{
            px: 2,
            minHeight: "48px",
            flexDirection: "row-reverse",
            backgroundColor: "#f9f9fb",
            "& .MuiAccordionSummary-content": {
              margin: "10px 0",
              flexGrow: 1,
              justifyContent: "space-between",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, color: "#616161" }}
            >
              Bills
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              startIcon={<AddCircle width="10px" />}
              size="small"
              sx={{
                fontSize: "13px",
                color: "#1976d2",
                textTransform: "none",
              }}
            >
              New
            </Button>
            {expanded.bills && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "18px", color: "#616161" }}
                />
                <Typography sx={{ fontSize: "13px", color: "#616161" }}>
                  Status: All
                </Typography>
                <ArrowDropDownIcon sx={{ color: "#616161" }} />
              </Box>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#616161",
                      py: 1.5,
                      pl: 2,
                    }}
                  >
                    DATE
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "12px", fontWeight: 500, color: "#616161" }}
                  >
                    BILLS NUMBER
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "12px", fontWeight: 500, color: "#616161" }}
                  >
                    REFERENCE NUMBER
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "12px", fontWeight: 500, color: "#616161" }}
                  >
                    BILLS MODE
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "12px", fontWeight: 500, color: "#616161" }}
                  >
                    AMOUNT RECEIVED
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "12px", fontWeight: 500, color: "#616161" }}
                  >
                    UNUSED AMOUNT
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4, color: "#212121", fontSize: "14px" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ color: "#212121", fontWeight: 500 }}>
                        No bills have been received or recorded yet.
                      </Typography>
                      <Typography
                        sx={{
                          ml: 1,
                          color: "#1976d2",
                          fontWeight: 400,
                          fontSize: "13px",
                        }}
                      >
                        - Add New
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion> */}

      {/* Purchase Order */}
      {/* <Accordion
        expanded={expanded.purchaseorder}
        onChange={handleChange("purchaseorder")}
        sx={{
          mb: 2,
          mt: 2,
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          overflow: "hidden",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: expanded.purchaseorder ? "#1976d2" : "#616161",
              }}
            />
          }
          sx={{
            px: 2,
            minHeight: "48px",
            flexDirection: "row-reverse",
            backgroundColor: "#f9f9fb",
            "& .MuiAccordionSummary-content": {
              margin: "10px 0",
              flexGrow: 1,
              justifyContent: "space-between",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 500, color: "#616161" }}
            >
              Purchase order
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              startIcon={<AddCircle width="10px" />}
              size="small"
              sx={{
                fontSize: "13px",
                color: "#1976d2",
                textTransform: "none",
              }}
            >
              New
            </Button>
            {expanded.purchaseorder && (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "18px", color: "#616161" }}
                />
                <Typography sx={{ fontSize: "13px", color: "#616161" }}>
                  Status: All
                </Typography>
                <ArrowDropDownIcon sx={{ color: "#616161" }} />
              </Box>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3, textAlign: "center" }}>
          <Typography sx={{ color: "#757575", fontSize: "14px" }}>
            No PO links found.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
      {moduleKey !== "Customer" && (
        <>
          <Accordion
            expanded={expanded.bills}
            onChange={handleChange("bills")}
            sx={{
              mb: 2,
              mt: 2,
              boxShadow: "none",
              border: "1px solid #E0E0E0",
              borderRadius: "16px",
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded.bills ? "#1976D2" : "#616161",
                    fontSize: "18px",
                  }}
                />
              }
              sx={{
                px: 2,
                minHeight: "48px",
                flexDirection: "row-reverse",
                backgroundColor: "#F9F9FB",
                "& .MuiAccordionSummary-content": {
                  margin: "10px 0",
                  flexGrow: 1,
                  justifyContent: "space-between",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}
                >
                  Bills
                </Typography>
              </Box>
              <Link
                href="/purchase/bills/create"
                style={{ textDecoration: "none" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Divider orientation="vertical" flexItem />
                  <Button
                    startIcon={
                      <AddCircle style={{ width: "15px", color: "#408dfb" }} />
                    }
                    size="small"
                    sx={{
                      fontSize: "12px",
                      color: "#000",
                      textTransform: "none",
                    }}
                  >
                    New
                  </Button>
                </Box>
              </Link>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {billsDetail.length < 1 ? (
                <Typography
                  sx={{
                    color: "#757575",
                    fontSize: "14px",
                    textAlign: "center",
                    p: 3,
                  }}
                >
                  There are no purchase order created for this vendor.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#F5F5F5" }}>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                            py: 1.5,
                            pl: 2,
                            textAlign: "center",
                          }}
                        >
                          DATE
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          BILL NUMBER
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          DUE DATE
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          STATUS
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          AMOUNT
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {billsDetail.map((bill, index) => (
                      <TableBody key={index}>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ py: 2, color: "#212121", fontSize: "14px" }}
                          >
                            {/* <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Typography sx={{ color: "#212121", fontWeight: 500 }}>
                        No bills have been received or recorded yet.
                      </Typography>
                      <Typography sx={{ ml: 1, color: "#1976D2", fontWeight: 400, fontSize: "13px" }}>
                        - Add New
                      </Typography>
                    </Box> */}
                            {formatDate(bill.createdAt)}
                          </TableCell>
                          <TableCell
                          align="left"
                              sx={{
                                color: "#408dfb !important",
                                fontSize: "13px",
                              }}
                            >
                           <Link
                                href={`/purchase/bills/${bill?.bill_number} `}
                                underline="none"
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {bill.bill_number}
                              </Link>
                           
                            </TableCell>
                          <TableCell>{formatDate(bill.due_date)}</TableCell>
                          <TableCell>{bill.status_type}</TableCell>
                          <TableCell>{bill.total}</TableCell>
                        </TableRow>
                        {billsDetail.length > 1 && <Divider />}
                      </TableBody>
                    ))}
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
          </Accordion>
          {/* Purchase Order */}
          <Accordion
            expanded={expanded.purchaseorder}
            onChange={handleChange("purchaseorder")}
            sx={{
              mb: 2,
              mt: 2,
              boxShadow: "none",
              border: "1px solid #E0E0E0",
              borderRadius: "12px",
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded.purchaseorder ? "#1976D2" : "#616161",
                    fontSize: "18px",
                  }}
                />
              }
              sx={{
                px: 2,
                minHeight: "48px",
                flexDirection: "row-reverse",
                backgroundColor: "#F9F9FB",
                "& .MuiAccordionSummary-content": {
                  margin: "10px 0",
                  flexGrow: 1,
                  justifyContent: "space-between",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{ fontSize: "13px", fontWeight: 600, color: "#212529" }}
                >
                  Purchase order
                </Typography>
              </Box>
              <Link
                href="/purchase/purchaseorder/create"
                style={{ textDecoration: "none" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Divider orientation="vertical" flexItem />
                  <Button
                    startIcon={
                      <AddCircle style={{ width: "15px", color: "#408dfb" }} />
                    }
                    size="small"
                    sx={{
                      fontSize: "12px",
                      color: "#000",
                      textTransform: "none",
                    }}
                  >
                    New
                  </Button>
                </Box>
              </Link>
            </AccordionSummary>
            <AccordionDetails sx={{ textAlign: "center", p: 0 }}>
              {purchaseOrderDetail.length < 1 ? (
                <Typography sx={{ p: 3, color: "#757575", fontSize: "14px" }}>
                  There are no purchase order created for this vendor.
                </Typography>
              ) : (
                <TableContainer sx={{ p: 0, m: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#F5F5F5" }}>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                            textAlign: "center",
                            py: 1.5,
                            pl: 2,
                          }}
                        >
                          DATE
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          BILL NUMBER
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          DUE DATE
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          STATUS
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#616161",
                          }}
                        >
                          AMOUNT
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {purchaseOrderDetail.map((bill, index) => (
                      <TableBody key={index}>
                        <TableRow>
                          <TableCell
                            align="center"
                            sx={{ py: 2, color: "#212121", fontSize: "14px" }}
                          >
                            {formatDate(bill.createdAt)}
                          </TableCell>
                          <TableCell
                           align="left"
                           sx={{
                             color: "#408dfb !important",
                             fontSize: "13px",
                           }}
                         >
                             <Link
                                href={`/purchase/purchaseorder/${bill?.purchase_number} `}
                                underline="none"
                                color="primary"
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                              {bill.purchase_number}
                              </Link>
                            
                            
                            
                            </TableCell>
                          <TableCell>{formatDate(bill.due_date)}</TableCell>
                          <TableCell>{bill.status_type}</TableCell>
                          <TableCell>{bill.total}</TableCell>
                        </TableRow>
                        {purchaseOrderDetail.length > 1 && <Divider />}
                      </TableBody>
                    ))}
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};

export default Transactions;
