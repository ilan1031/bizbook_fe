"use client";

import apiService, { portalGet, savePortalSession, clearPortalSession, portalLoginPath, decodeJwt } from "../portalApi";
import config from "../../../services/config";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DotLoader from "../../../components/DotLoader";
import { useRouter } from "next/navigation";

const QuotesTable = () => {
  const [tabValue, setTabValue] = useState(0);
  const [quoteList, setQuoteList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [welcomPg, setWelcomPg] = useState(false);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState(true);
  const [page, setPage] = useState(0); // MUI TablePagination is 0-based
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const limit = useRef(10);
  const [organization_id, setOrganizationId] = useState(null);
  const [customer_id, setCustomerId] = useState(null);
  // const organization_id = portalGet("orgId");
  // const customer_id = portalGet("clientId");
  // eslint-disable-next-line react-hooks/refs
  const showPagination = totalCount > limit.current;
  const route = useRouter();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const filterBy = newValue === 0 ? "open" : "all";
    fetchQuoteList(filterBy, 0, rowsPerPage);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const filterBy = tabValue === 0 ? "open" : "all";
    fetchQuoteList(filterBy, newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    limit.current = newRowsPerPage;
    const filterBy = tabValue === 0 ? "open" : "all";
    fetchQuoteList(filterBy, 0, newRowsPerPage);
  };

  const fetchQuoteList = async (
    filterValue = "",
    pageArg = page,
    perPageArg = rowsPerPage
  ) => {
    setDotsAndSkeleton(true);
    setWelcomPg(false);
    try {
      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: pageArg + 1, // API is 1-based
          per_page: perPageArg,
          customer_id: customer_id,
          limit: perPageArg,
          organization_id: organization_id,
        },
        url: `/api/v1/clientestimates`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      const data = response.data.estimates;
      if (data.length === 0) {
        setWelcomPg(true);
      }
      setDotsAndSkeleton(false);
      setQuoteList(data);
      setTotalCount(response.data.totalCount);
      setHasMore(response.data.page_context.has_more_page);
    } catch (error) {
      console.error("Failed to fetch quote list:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Browser-only session values.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrganizationId(portalGet("orgId"));
      setCustomerId(portalGet("clientId"));
    }
    const initialFilter = tabValue === 0 ? "open" : "all";
    fetchQuoteList(initialFilter, 0, rowsPerPage);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 300000);
    return () => clearTimeout(timeoutId);
  }, []);

  const getColor = (status) => {
    console.log(status, "---status---");
    if (status === "acepted") {
      return "#2e7d32d4 !important";
    } else if (status === "open") {
      return "#58ade5 !important";
    } else if (status === "declined") {
      return "#df7508 !important";
    }
  };

  const handleView = (id) => {
    route.push(`/portal/quotes/${id}`);
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" p={6}>
          <DotLoader />
        </Box>
      ) : (
        <Box width="100%">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Quotes Tabs"
          >
            <Tab label="Open Quotes" />
            <Tab
              label="All Quotes"
              icon={<ArrowDropDownIcon sx={{ width: 20, ml: 0.8 }} />}
              iconPosition="right"
            />
          </Tabs>

          <Box overflow="auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Quote #</TableCell>
                  <TableCell align="left">Reference#</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {welcomPg ? (
                  <TableRow>
                    <TableCell
                      sx={{ borderBottom: "none" }}
                      colSpan={5}
                      align="center"
                    >
                      <Box p={2}>
                        <Typography variant="body2">
                          No quotes available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : dotsAndSkeleton ? (
                  <DotLoader />
                ) : (
                  !dotsAndSkeleton &&
                  quoteList.map((quote) => (
                    <TableRow
                      key={quote.estimate_number}
                      onClick={() => handleView(quote.quote_id)}
                    >
                      <TableCell sx={{ cursor: "pointer" }} align="left">
                        <Typography color="#58ade5">
                          {quote.estimate_number}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" }} align="left">
                        {quote.reference_number}
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" }} align="right">
                        {quote.date_formatted}
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" }} align="right">
                        {quote.total_formatted}
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" }} align="right">
                        <Typography
                          color={
                            quote.status === "open"
                              ? "primary"
                              : quote.status === "accepted"
                              ? "success.main"
                              : "#df7508"
                          }
                        >
                          {quote.status_formatted}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>

          {showPagination && (
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100, 200]}
            />
          )}
        </Box>
      )}
    </>
  );
};

const Quotes = () => {
  return (
    <Box p={2}>
      <QuotesTable />
    </Box>
  );
};

export default Quotes;
