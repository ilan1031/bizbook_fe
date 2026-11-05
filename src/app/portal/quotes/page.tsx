"use client";

import apiService from "../portalApi";
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

const QuotesTable = (_props?: any) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [quoteList, setQuoteList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [welcomPg, setWelcomPg] = useState<boolean>(false);
  const [dotsAndSkeleton, setDotsAndSkeleton] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0); // MUI TablePagination is 0-based
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const limit = useRef<number>(10);
  const [loadError, setLoadError] = useState<any>("");
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
    const newRowsPerPage = parseInt((event.target as any).value, 10);
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
    setLoadError("");
    try {
      // The server takes the customer and organisation from the portal login.
      const response = await apiService({
        method: "GET",
        params: {
          filter: filterValue,
          page: pageArg + 1, // API is 1-based
          per_page: perPageArg,
          limit: perPageArg,
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
      setQuoteList([]);
      setTotalCount(0);
      setLoadError(error?.message || "Couldn't load your quotes. Please try again.");
      setDotsAndSkeleton(false);
    }
  };

  useEffect(() => {
    const initialFilter = tabValue === 0 ? "open" : "all";
    fetchQuoteList(initialFilter, 0, rowsPerPage);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 300000);
    return () => clearTimeout(timeoutId);
  }, []);

  const getColor = (status) => {
    if (status === "accepted") {
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
              iconPosition="end"
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
                {loadError ? (
                  <TableRow>
                    <TableCell sx={{ borderBottom: "none" }} colSpan={5} align="center">
                      <Typography variant="body2" color="error" role="alert">
                        {loadError}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : welcomPg ? (
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
                  <TableRow>
                    <TableCell sx={{ borderBottom: "none" }} colSpan={5} align="center">
                      <DotLoader />
                    </TableCell>
                  </TableRow>
                ) : (
                  !dotsAndSkeleton &&
                  quoteList.map((quote) => (
                    <TableRow
                      key={quote.quote_id}
                      onClick={() => handleView(quote.quote_id)}
                    >
                      <TableCell sx={{ cursor: "pointer" as const }} align="left">
                        <Typography color="#58ade5">
                          {quote.estimate_number}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" as const }} align="left">
                        {quote.reference_number}
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" as const }} align="right">
                        {quote.date_formatted}
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" as const }} align="right">
                        {quote.total_formatted}
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" as const }} align="right">
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

const Quotes = (_props?: any) => {
  return (
    <Box p={2}>
      <QuotesTable />
    </Box>
  );
};

export default Quotes;
