"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextareaAutosize,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  DialogTitle,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { Download, FileMinus2 } from "lucide-react";
import apiService, { portalGet, savePortalSession, clearPortalSession, portalLoginPath, decodeJwt } from "../../portalApi";
import config from "../../../../services/config";
import DotLoader from "../../../../components/DotLoader";
import { numberToWords as toWords } from "../../../../services/amountInWords";
import html2pdf from "html2pdf.js";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { ErrorOutline, Warning } from "@mui/icons-material";
import { parse, formatDistanceToNowStrict } from "date-fns";

const QuoteView = () => {
  const route = useRouter();
  const [quoteData, setQuoteData] = useState(null);
  const organization_id = portalGet("orgId");
  const customer_id = portalGet("clientId");
  const [loading, setLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { showMessage } = useSnackbar();
  const [openDeclined, setOpenDeclined] = useState(false);
  const [openDeclinedForm, setOpenDeclinedForm] = useState(false);
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [visibleComment, setVisibleComment] = useState(true);
  useEffect(() => {
    // The quote id is the last part of the URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const path = window.location.pathname; // "/sales/invoices/365756"
    const segments = path.split("/");
    const id = segments[segments.length - 1]; // Get the last part of the path
    // eslint-disable-next-line react-hooks/immutability
    fetchQuoteData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const numberToWords = (amount) => {
    const number = Math.floor(amount);
    const paise = Math.round((amount - number) * 100);

    let formattedWords = toWords(number).replace(/\b\w/g, (l) =>
      l.toUpperCase()
    );

    return `${formattedWords} Rupees${
      paise > 0
        ? ` and ${toWords(paise).replace(/\b\w/g, (l) =>
            l.toUpperCase()
          )} Paise`
        : ""
    } Only`;
  };

  const getColor = (status) => {
    if (status === "draft") {
      return "#94a5a6"; // Grey
    } else if (status === "accepted" || status === "invoiced") {
      return "#28a745"; // Green
    } else if (status === "declined") {
      return "#f59d00"; // Orange
    } else if (status === "sent") {
      return "#2098FF"; // Blue
    }
  };

  const fetchQuoteData = async (id) => {
    try {
      const response = await apiService({
        method: "GET",
        params: {
          customer_id: customer_id,
          organization_id: organization_id,
        },
        url: `/api/v1/clientestimates/${id}`,
        customBaseUrl: config.SO_Base_url,
        file: false,
      });
      const data = response.data.data;
      const commentsList = data?.comments?.filter(
        (comment) => comment.comment_type === "client"
      )?.length;
      if (commentsList > 0) {
        setShowComments(true);
        setVisibleComment(false);
      }
      setQuoteData(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch quote list:", error);
    }
  };

  const generatePDF = () => {
    setIsPdfGenerating(true); // Show loading state

    // Wait for the DOM to update
    setTimeout(() => {
      try {
        const element = document.getElementById("pdf-view-container");
        if (!element) {
          console.error("PDF view element not found");
          setIsPdfGenerating(false);
          return;
        }

        // Hide elements you don't want in the PDF (e.g., buttons, icons)
        const hiddenElements = [];
        const statusBadgeElements = element.querySelectorAll("*");
        statusBadgeElements.forEach((el) => {
          if (el.textContent && el.textContent.trim() === "Some Status Text") {
            hiddenElements.push({
              element: el,
              originalDisplay: el.style.display,
            });
            el.style.display = "none";
          }
        });

        // PDF options
        const options = {
          filename: `QT-${quoteData.quote_id || "document"}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // Generate and download the PDF
        html2pdf()
          .from(element)
          .set(options)
          .save()
          .then(() => {
            console.log("PDF generation complete");
            // Restore hidden elements
            hiddenElements.forEach((item) => {
              item.element.style.display = item.originalDisplay;
            });
            setIsPdfGenerating(false); // Hide loading state
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
            // Restore hidden elements in case of error
            hiddenElements.forEach((item) => {
              item.element.style.display = item.originalDisplay;
            });
            setIsPdfGenerating(false); // Hide loading state
          });
      } catch (error) {
        console.error("Error in PDF generation process:", error);
        setIsPdfGenerating(false); // Hide loading state
      }
    }, 500); // Small delay to ensure the DOM updates
  };

  const handleStatus = async (status) => {
    try {
      const response = await apiService({
        method: "PUT",
        params: {
          customer_id: customer_id,
          organization_id: organization_id,
          quote_id: quoteData.quote_id,
        },
        url: `/api/v1/clientestimates/${status}`,
        customBaseUrl: config.SO_Base_url,
        data: {
          description: description,
        },
        file: false,
      });
      showMessage(response.data.message, "success");
      setLoading(false);
      setOpenDeclinedForm(false);
      fetchQuoteData(quoteData.quote_id);
    } catch (error) {
      console.log(error, "Something went wrong");
      showMessage(error.message, "error");
    }
  };

  const handleComments = async () => {
    try {
      if (comments === "") {
        return;
      }
      const response = await apiService({
        method: "PUT",
        params: {
          customer_id: customer_id,
          organization_id: organization_id,
        },
        url: `/api/v1/clientestimates/comment/${quoteData?.quote_id}`,
        customBaseUrl: config.SO_Base_url,
        data: {
          description: comments,
        },
        file: false,
      });
      showMessage(response.data.message, "success");
      setComments("");
      fetchQuoteData(quoteData.quote_id);
    } catch (error) {
      console.log(error, "Something went wrong");
      showMessage(error.message, "error");
    }
  };
  return (
    <>
      {loading ? (
        <DotLoader />
      ) : (
        <Box p={2}>
          {/* Header Section */}
          <Grid container>
            <Grid item>
              <Box
                mb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  variant="text"
                  onClick={() => route.push("/portal/quotes")}
                >
                  Back
                </Button>
                <Box display="flex" gap={2}>
                  {quoteData?.status === "accepted" &&
                    quoteData?.invoices.length === 0 && (
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#c6c6c6",
                          color: "#333 !important",
                          fontSize: "12px",
                          height: "30px",
                          textTransform: "none",
                        }}
                        onClick={() => setOpenDeclined(true)}
                      >
                        Decline
                      </Button>
                    )}

                  {quoteData?.status !== "accepted" &&
                    quoteData?.invoices.length === 0 && (
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#c6c6c6",
                          color: "#333 !important",
                          fontSize: "12px",
                          height: "30px",
                          textTransform: "none",
                        }}
                        onClick={() => handleStatus("accepted")}
                      >
                        Accept
                      </Button>
                    )}

                  <Box
                    classNameName="icon-button-view"
                    onClick={() => generatePDF()}
                    sx={{ cursor: "pointer" }}
                  >
                    <Download width="15px" />
                  </Box>
                </Box>
              </Box>

              {/* Comment Section */}
              <Box mt={4} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                {visibleComment && (
                  <>
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Enter your comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "1px solid #9e9e9e",
                        fontSize: "16px",
                        resize: "vertical",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        marginBottom: "16px",
                      }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        background: "#408dfb",
                        fontSize: "12px",
                        width: "15%",
                        height: "28px",
                        boxShadow: "none",
                      }}
                      onClick={() => handleComments()}
                    >
                      Add Comment
                    </Button>
                  </>
                )}

                {showComments && (
                  <Box>
                    {" "}
                    {!visibleComment && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            my: 2,
                            color: "#5d678a !important",
                            fontWeight: "600",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          Comments (
                          {
                            quoteData?.comments?.filter((comment) => {
                              return comment.comment_type === "client";
                            }).length
                          }
                          )
                        </Box>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "#c6c6c6",
                            color: "#333 !important",
                            fontSize: "12px",
                            height: "30px",
                            textTransform: "none",
                          }}
                          onClick={() => setVisibleComment(true)}
                        >
                          + Add Comments
                        </Button>
                      </div>
                    )}
                    {!visibleComment && <Divider />}
                    {quoteData?.comments
                      ?.filter((comment) => comment.comment_type === "client")
                      .sort((a, b) => {
                        const dateA = parse(
                          a.date_formatted,
                          "dd/MM/yyyy hh:mm a",
                          new Date()
                        );
                        const dateB = parse(
                          b.date_formatted,
                          "dd/MM/yyyy hh:mm a",
                          new Date()
                        );
                        return dateB - dateA; // Descending
                      })
                      .map((comment, index) => {
                        const parsedDate = parse(
                          comment.date_formatted,
                          "dd/MM/yyyy hh:mm a",
                          new Date()
                        );
                        const relativeTime = formatDistanceToNowStrict(
                          parsedDate,
                          { addSuffix: true }
                        );

                        return (
                          <Grid container key={index} my={1}>
                            <Grid item xs={12}>
                              <Typography
                                sx={{ fontSize: "13px", color: "#5D678A" }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    minWidth: "100px",
                                  }}
                                >
                                  {relativeTime}
                                </span>
                                <span style={{ color: "#000" }}>
                                  {comment.description}
                                </span>
                                <span
                                  style={{
                                    fontStyle: "italic",
                                    marginLeft: "4px",
                                  }}
                                >
                                  by {comment.commented_by}
                                </span>
                              </Typography>
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Box>
                )}
              </Box>

              {/* Pdf View Design */}
              <div
                className="pdf-container d-none d-md-block"
                id="pdf-view-container"
              >
                <div className="ribbon">
                  <div className="ribbon-inner ribbon-accepted">Accepted</div>
                </div>
                <div className="pcs-template">
                  <div className="pcs-template-header pcs-header-content">
                    <div className="pcs-template-fill-emptydiv"></div>
                  </div>
                </div>
                <div className="pcs-template-body">
                  <div className="pcs-template-bodysection">
                    <table
                      style={{
                        width: "100%",
                        borderBottom: "1px solid #9e9e9e",
                      }}
                    >
                      <tbody style={{ fontSize: "13px" }}>
                        <tr>
                          <td
                            style={{
                              width: "50%",
                              padding: "2px 10px",
                              verticalAalign: "middle",
                            }}
                          >
                            <div>
                              <span
                                style={{ fontWeight: "bold" }}
                                className="pcs-orgname"
                              >
                                Divyas & SK
                                <br />
                              </span>
                              <span
                                style={{ whiteSpace: "pre-wrap" }}
                                id="tmp_org_address"
                              >
                                Andaman and Nicobar Islands <br />
                                India
                                <br />
                                7449035414
                                <br />
                                divya.s.ihub@snsgroups.com <br />
                                GSTIN: 35AAACI1681G1ZS
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              width: "40%",
                              //   padding: "5px",
                              verticalAlign: "bottom",
                              fontSize: "16px",
                            }}
                            align="right"
                          >
                            <div className="pcs-entity-title">QUOTE</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <Box width="100%" sx={{ fontSize: "15px", pt: 0 }}>
                      <Table
                        sx={{
                          width: "100%",
                          tableLayout: "fixed",
                          wordWrap: "break-word",
                        }}
                        className="invoice-detailstable"
                      >
                        <TableBody>
                          <TableRow>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #9e9e9e",
                                pb: "10px",
                              }}
                            >
                              <Typography
                                component="span"
                                sx={{ fontSize: "13px", fontWeight: "bold" }}
                              >
                                #
                              </Typography>
                              <Typography
                                component="span"
                                sx={{ fontSize: "13px", fontWeight: 600 }}
                                id="tmp_entity_number"
                              >
                                : {quoteData?.estimate_number}
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                sx={{ fontSize: "13px", fontWeight: 600 }}
                                id="tmp_entity_date"
                              >
                                : {quoteData?.date_formatted}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ pb: "10px" }}>
                              <Typography
                                component="span"
                                sx={{ fontSize: "13px" }}
                              >
                                Place Of Supply
                              </Typography>
                              <Typography
                                component="span"
                                sx={{ fontSize: "13px", fontWeight: 600 }}
                              >
                                : {quoteData?.place_of_supply}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                    <div style={{ clear: "both" }}></div>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderRight: "1px solid #9e9e9e",
                              // borderTop: '1px solid #9e9e9e',
                              width: "50%",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ mb: 0, display: "block" }}
                            >
                              <b>Bill To</b>
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              // borderTop: '1px solid #9e9e9e',
                              width: "50%",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ mb: 0, display: "block" }}
                            >
                              <b>Ship To</b>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderRight: "1px solid #9e9e9e",
                              paddingBottom: "10px",
                              whiteSpace: "pre-wrap",
                              lineHeight: "15px",
                              fontSize: "13px",
                              verticalAlign: "top",
                            }}
                          >
                            {quoteData?.billing_address?.attention && (
                              <Typography
                                fontWeight="bold"
                                fontSize="13px"
                                className="pcs-customer-name"
                                id="zb-pdf-customer-detail"
                              >
                                {quoteData?.billing_address?.attention}
                              </Typography>
                            )}
                            {quoteData?.billing_address?.address && (
                              <>
                                {quoteData?.billing_address?.address} <br />
                              </>
                            )}
                            {quoteData?.billing_address?.street2 && (
                              <>
                                {quoteData?.billing_address?.street2} <br />
                              </>
                            )}
                            {quoteData?.billing_address?.city && (
                              <>
                                {quoteData?.billing_address?.city} <br />
                              </>
                            )}
                            {quoteData?.billing_address?.state && (
                              <>
                                {quoteData?.billing_address?.zip}
                                {quoteData?.billing_address?.state} <br />
                              </>
                            )}
                            {quoteData?.billing_address?.country && (
                              <>
                                {quoteData?.billing_address?.country} <br />
                              </>
                            )}
                            {quoteData?.billing_address?.phone && (
                              <>
                                {quoteData?.billing_address?.phone} <br />
                              </>
                            )}
                            {quoteData?.billing_address?.fax && (
                              <>
                                {quoteData?.billing_address?.fax} <br />
                              </>
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ paddingBottom: "10px", fontSize: "13px" }}
                          >
                            <Box
                              sx={{
                                whiteSpace: "pre-wrap",
                                lineHeight: "15px",
                              }}
                            >
                              {quoteData?.shipping_address?.attention && (
                                <Typography
                                  fontWeight="bold"
                                  fontSize="13px"
                                  className="pcs-customer-name"
                                  id="zb-pdf-customer-detail"
                                >
                                  {quoteData?.shipping_address?.attention}
                                </Typography>
                              )}
                              {quoteData?.shipping_address?.address && (
                                <>
                                  {quoteData?.shipping_address?.address} <br />
                                </>
                              )}
                              {quoteData?.shipping_address?.street2 && (
                                <>
                                  {quoteData?.shipping_address?.street2} <br />
                                </>
                              )}
                              {quoteData?.shipping_address?.city && (
                                <>
                                  {quoteData?.shipping_address?.city} <br />
                                </>
                              )}
                              {quoteData?.shipping_address?.state && (
                                <>
                                  {quoteData?.shipping_address?.zip}
                                  {quoteData?.shipping_address?.state} <br />
                                </>
                              )}
                              {quoteData?.shipping_address?.country && (
                                <>
                                  {quoteData?.shipping_address?.country} <br />
                                </>
                              )}
                              {quoteData?.shipping_address?.phone && (
                                <>
                                  {quoteData?.shipping_address?.phone} <br />
                                </>
                              )}
                              {quoteData?.shipping_address?.fax && (
                                <>
                                  {quoteData?.shipping_address?.fax} <br />
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div style={{ clear: "both" }}></div>
                    <Table size="small" borderAxis="both">
                      <TableHead>
                        <TableRow sx={{ height: 17 }}>
                          <TableCell
                            align="center"
                            rowSpan={2}
                            sx={{
                              padding: "5px 5px 2px 5px",
                              width: "5%",
                              fontSize: "13px",
                              borderBottom: "1px solid #9e9e9e",
                            }}
                          >
                            <b>#</b>
                          </TableCell>
                          <TableCell
                            rowSpan={2}
                            sx={{
                              padding: "5px 7px 2px 7px",
                              textAlign: "left",
                              fontSize: "13px",
                              borderBottom: "1px solid #9e9e9e",
                            }}
                          >
                            <b>Item &amp; Description</b>
                          </TableCell>
                          <TableCell
                            align="right"
                            rowSpan={2}
                            sx={{
                              padding: "5px 7px 2px 7px",
                              width: "11%",
                              fontSize: "13px",
                              borderBottom: "1px solid #9e9e9e",
                            }}
                          >
                            <b>Qty</b>
                          </TableCell>
                          <TableCell
                            align="right"
                            rowSpan={2}
                            sx={{
                              padding: "5px 7px 2px 7px",
                              width: "11%",
                              fontSize: "13px",
                              borderBottom: "1px solid #9e9e9e",
                            }}
                          >
                            <b>Rate</b>
                          </TableCell>
                          <TableCell
                            align="right"
                            rowSpan={2}
                            sx={{
                              padding: "5px 7px 2px 7px",
                              width: "13%",
                              fontSize: "13px",
                              borderBottom: "1px solid #9e9e9e",
                            }}
                          >
                            <b>Amount</b>
                          </TableCell>
                        </TableRow>
                        <TableRow />
                      </TableHead>

                      <TableBody>
                        {quoteData?.line_items?.map((item, index) => (
                          <TableRow key={index} sx={{ height: 20 }}>
                            <TableCell
                              align="center"
                              sx={{ verticalAlign: "top" }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell sx={{ verticalAlign: "top" }}>
                              <Typography
                                id="tmp_item_name"
                                sx={{
                                  wordWrap: "break-word",
                                  fontSize: "13px",
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                className="pcs-item-desc"
                                id="tmp_item_description"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                  fontSize: "13px",
                                }}
                              >
                                {item.description}
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ verticalAlign: "top", fontSize: "13px" }}
                            >
                              {item?.quantity}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ verticalAlign: "top", fontSize: "13px" }}
                            >
                              {item?.rate}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ verticalAlign: "top", fontSize: "13px" }}
                            >
                              {item?.item_total}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Box
                      sx={{
                        width: "100%",
                        mt: "1px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Left Section: Total In Words + Notes */}
                      <Box sx={{ width: "50%", p: "4px 4px 3px 7px" }}>
                        <Box sx={{ my: "10px", fontSize: "13px" }}>
                          <Box sx={{ pr: "10px" }}>Total In Words</Box>
                          <Typography
                            component="span"
                            fontWeight="bold"
                            fontSize="13px"
                            fontStyle="italic"
                          >
                            {quoteData?.total &&
                              numberToWords(quoteData?.total)}
                          </Typography>
                        </Box>

                        <Box sx={{ pt: "10px", fontSize: "13px" }}>
                          <Typography
                            id="tmp_notes_label"
                            className="pcs-label"
                            fontSize="13px"
                          >
                            Notes
                          </Typography>
                          <Typography
                            className="pcs-notes"
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              fontSize: "13px",
                            }}
                          >
                            Looking forward for your business.
                          </Typography>
                        </Box>

                        <Box sx={{ mt: "20px" }} />
                      </Box>

                      {/* Right Section: Totals Table */}
                      <Box sx={{ width: "43.6%" }} className="pcs-totals">
                        <TableContainer
                          component={Paper}
                          elevation={0}
                          sx={{ borderLeft: "1px solid #9e9e9e" }}
                        >
                          <Table size="small" sx={{ width: "100%" }}>
                            <TableBody>
                              <TableRow>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontSize: "13px",
                                    borderBottom: "0px solid #9e9e9e",
                                  }}
                                >
                                  Sub Total
                                </TableCell>
                                <TableCell
                                  id="tmp_subtotal"
                                  align="right"
                                  sx={{
                                    width: "110px",
                                    borderBottom: "0px solid #9e9e9e",
                                  }}
                                >
                                  {quoteData?.sub_total}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontSize: "13px",
                                    borderBottom: "0px solid #9e9e9e",
                                  }}
                                >
                                  Discount({quoteData?.discount_percent})
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontSize: "13px",
                                    width: "110px",
                                    textAlign: "right",
                                    borderBottom: "0px solid #9e9e9e",
                                  }}
                                >
                                  (-) {quoteData?.discount_amount}
                                </TableCell>
                              </TableRow>
                              <TableRow
                                sx={{ fontSize: "13px", height: "10px" }}
                              >
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontSize: "13px",
                                    borderBottom: "0px solid #9e9e9e",
                                  }}
                                >
                                  Amount Withheld
                                  <Typography
                                    sx={{
                                      fontSize: "11px",
                                      textAlign: "right",
                                    }}
                                  >
                                    (Section 194 H)
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    color: "red",
                                    width: "110px",
                                    borderBottom: "0px solid #9e9e9e",
                                  }}
                                >
                                  {quoteData?.tax_type === "TDS"
                                    ? "(-)"
                                    : "(+)"}{" "}
                                  {quoteData?.tax_total
                                    ? quoteData?.tax_total
                                    : 0.0}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  align="right"
                                  sx={{ borderBottom: "0px solid #9e9e9e" }}
                                >
                                  <b>Total</b>
                                </TableCell>
                                <TableCell
                                  id="tmp_total"
                                  align="right"
                                  sx={{
                                    width: "110px",
                                    borderBottom: "0px solid #9e9e9e",
                                  }}
                                >
                                  <b>{quoteData?.total_formatted}</b>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  sx={{ borderBottom: "0px solid #9e9e9e" }}
                                />
                              </TableRow>
                            </TableBody>

                            <TableBody>
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  sx={{
                                    textAlign: "center",
                                    pt: "5px",
                                    minHeight: "75px",
                                  }}
                                />
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  sx={{ textAlign: "center" }}
                                >
                                  <Typography
                                    className="pcs-totals"
                                    sx={{ fontSize: "13px", mb: 0 }}
                                  >
                                    Authorized Signature
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Box>
                  </div>
                </div>
                <div
                  style={{ marginTop: "15px" }}
                  className="pcs-template-footer"
                >
                  <div></div>
                  <div style={{ direction: "ltr" }}></div>
                </div>
              </div>
              {/* invoices table */}
              {quoteData?.invoices?.length > 0 && (
                <>
                  <Box
                    sx={{
                      p: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600", fontSize: "13px", ml: 1 }}
                    >
                      Invoices
                    </Typography>
                  </Box>
                  <Box>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ height: 20 }}>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Invoice#
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Date
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                              align="right"
                            >
                              Total
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Balance Due
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quoteData?.invoices?.map((row) => (
                            <>
                              <TableRow sx={{ height: 20 }}>
                                <TableCell
                                  align="left"
                                  sx={{ color: "#408dfb !important" }}
                                  onClick={() => handleInvoice(row.invoice_id)}
                                >
                                  {row?.invoice_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ color: "black !important" }}
                                >
                                  {row?.date_formatted}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: "black !important" }}
                                >
                                  {row?.total_formatted}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: "black !important" }}
                                >
                                  {row?.balance_formatted}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  color={getColor(row?.status)}
                                >
                                  {row?.status_formatted}
                                </TableCell>
                              </TableRow>
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      {isPdfGenerating && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Generating PDF...</Typography>
        </Box>
      )}
      <Dialog
        fullWidth="sm"
        open={openDeclined}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            width: "436px",
            position: "absolute", // Ensure absolute positioning
            top: 0, // Position at the top of the screen
            margin: "16px",
          },
        }}
        onClose={() => setOpenDeclined(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent sx={{ display: "flex", alignItems: "center" }}>
          <ErrorOutline
            sx={{ color: "#fb9750", width: "30px", height: "30px" }}
          />
          <DialogContentText sx={{ ml: 1, fontSize: "12px", color: "#212529" }}>
            You are trying to decline an quote that you had accepted. Are you
            sure you want to decline?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "start", ml: 6, mb: 3 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              background: "#408dfb",
              height: "30px",
            }}
            onClick={() => {
              setOpenDeclined(false);
              setOpenDeclinedForm(true);
            }}
          >
            Decline
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#c6c6c6",
              color: "#333 !important",
              fontSize: "12px",
              height: "30px",
              textTransform: "none",
            }}
            onClick={() => setOpenDeclined(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth="sm"
        open={openDeclinedForm}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            position: "absolute", // Ensure absolute positioning
            top: 0, // Position at the top of the screen
            margin: "16px",
          },
        }}
        onClose={() => setOpenDeclinedForm(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ background: "#f5f5f5" }}>
          Decline - {quoteData?.estimate_number}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: "flex", alignItems: "center" }}>
          <TextareaAutosize
            minRows={4}
            placeholder="Enter a reason for declining"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #9e9e9e",
              fontSize: "16px",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
              marginBottom: "16px",
            }}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "start", m: 2 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              background: "#408dfb",
              height: "35px",
            }}
            onClick={() => handleStatus("declined")}
          >
            Decline
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#c6c6c6",
              color: "#333 !important",
              fontSize: "12px",
              height: "35px",
              textTransform: "none",
            }}
            onClick={() => setOpenDeclinedForm(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuoteView;
