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
import apiService from "../../portalApi";
import config from "../../../../services/config";
import DotLoader from "../../../../components/DotLoader";
import DocumentTemplate, { toTemplateDoc } from "../../../common/templates/DocumentTemplate";
import html2pdf from "html2pdf.js";
import { useSnackbar } from "../../../../components/SnackbarProvider";
import { ErrorOutline, Warning } from "@mui/icons-material";
import { parse, formatDistanceToNowStrict } from "date-fns";

const QuoteView = (_props?: any) => {
  const route = useRouter();
  const [quoteData, setQuoteData] = useState<any>(null);
  const [portalDoc, setPortalDoc] = useState<any>({ organization: {} as any, customer: {} as any, template: null });
  const [loadError, setLoadError] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const { showMessage } = useSnackbar();
  const [openDeclined, setOpenDeclined] = useState<boolean>(false);
  const [openDeclinedForm, setOpenDeclinedForm] = useState<boolean>(false);
  const [description, setDescription] = useState<any>("");
  const [comments, setComments] = useState<any>("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [visibleComment, setVisibleComment] = useState<boolean>(true);
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
      // The server takes the customer and organisation from the portal login.
      const response = await apiService({
        method: "GET",
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
      setPortalDoc({
        organization: response.data.organization || {},
        customer: response.data.customer || {},
        template: response.data.template || null,
      });
      setLoadError("");
      setLoading(false);
    } catch (error) {
      setLoadError(error?.message || "Couldn't load this quote.");
      setLoading(false);
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
        const hiddenElements: any[] = [];
        const statusBadgeElements = element.querySelectorAll<HTMLElement>("*");
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
      setDescription("");
      fetchQuoteData(quoteData.quote_id);
    } catch (error) {
      showMessage(error?.message || "Something went wrong. Please try again.", "error");
    }
  };

  const handleComments = async () => {
    try {
      if (comments.trim() === "") {
        showMessage("Enter a comment.", "error");
        return;
      }
      const response = await apiService({
        method: "PUT",
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
      showMessage(error?.message || "Something went wrong. Please try again.", "error");
    }
  };

  // An open quote can be accepted or declined; an accepted one (not yet
  // invoiced) can still be declined, and a declined one accepted.
  const notInvoiced = (quoteData?.invoices?.length || 0) === 0;
  const canAccept = notInvoiced && ["open", "declined"].includes(quoteData?.status);
  const canDecline = notInvoiced && ["open", "accepted"].includes(quoteData?.status);
  const startDecline = () => {
    if (quoteData?.status === "accepted") setOpenDeclined(true);
    else setOpenDeclinedForm(true);
  };

  if (loadError && !quoteData) {
    return (
      <Box p={3}>
        <Button startIcon={<ArrowBackIcon />} variant={"text" as any} onClick={() => route.push("/portal/quotes")}>
          Back
        </Button>
        <Typography role="alert" color="error" sx={{ mt: 2 }}>
          {loadError}
        </Typography>
      </Box>
    );
  }
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
                  variant={"text" as any}
                  onClick={() => route.push("/portal/quotes")}
                >
                  Back
                </Button>
                <Box display="flex" gap={2}>
                  {canDecline && (
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#c6c6c6",
                        color: "#333 !important",
                        fontSize: "12px",
                        height: "30px",
                        textTransform: "none" as const,
                      }}
                      onClick={startDecline}
                    >
                      Decline
                    </Button>
                  )}

                  {canAccept && (
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#c6c6c6",
                        color: "#333 !important",
                        fontSize: "12px",
                        height: "30px",
                        textTransform: "none" as const,
                      }}
                      onClick={() => handleStatus("accepted")}
                    >
                      Accept
                    </Button>
                  )}

                  <Box
                    className="icon-button-view"
                    onClick={() => generatePDF()}
                    sx={{ cursor: "pointer" as const }}
                  >
                    <Download width="15px" />
                  </Box>
                </Box>
              </Box>

              {/* Comment Section */}
              <Box mt={4} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                {visibleComment && !openDeclinedForm && (
                  <>
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Enter your comments"
                      value={comments}
                      onChange={(e) => setComments((e.target as any).value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "1px solid #9e9e9e",
                        fontSize: "16px",
                        resize: "vertical" as const,
                        fontFamily: "inherit" as const,
                        boxSizing: "border-box" as const,
                        marginBottom: "16px",
                      }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none" as const,
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
                          display: "flex" as const,
                          justifyContent: "space-between" as const,
                        }}
                      >
                        <Box
                          sx={{
                            my: 2,
                            color: "#5d678a !important",
                            fontWeight: "600" as const,
                            fontSize: "14px",
                            textTransform: "uppercase" as const,
                            letterSpacing: "1px" as const,
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
                            textTransform: "none" as const,
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
                        return (dateB as any) - (dateA as any); // Descending
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
                                    display: "inline-block" as const,
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
                                    fontStyle: "italic" as const,
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

              {/* The quote in the organisation's own template (seller, Bill To, GST) */}
              <Box sx={{ mt: 3, overflowX: "auto" as const }}>
                <div id="pdf-view-container" style={{ width: "fit-content", margin: "0 auto" }}>
                  {quoteData && (
                    <DocumentTemplate
                      doc={toTemplateDoc("quote", quoteData)}
                      org={portalDoc.organization}
                      customer={portalDoc.customer}
                      settings={portalDoc.template || {}}
                    />
                  )}
                </div>
              </Box>
              {/* invoices table */}
              {quoteData?.invoices?.length > 0 && (
                <>
                  <Box
                    sx={{
                      p: 1,
                      display: "flex" as const,
                      justifyContent: "space-between" as const,
                      alignItems: "center" as const,
                      cursor: "pointer" as const,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600" as const, fontSize: "13px", ml: 1 }}
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
                                fontWeight: "bold" as const,
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Invoice#
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold" as const,
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Date
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold" as const,
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
                                fontWeight: "bold" as const,
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Balance Due
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "bold" as const,
                                fontSize: "12px !important",
                                backgroundColor: "white !important",
                              }}
                            >
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quoteData?.invoices?.map((row, idx) => (
                            <React.Fragment key={idx}>
                              <TableRow sx={{ height: 20 }}>
                                <TableCell
                                  align="left"
                                  sx={{ color: "#408dfb !important" }}
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
                                  sx={{ color: getColor(row?.status) }}
                                >
                                  {row?.status_formatted}
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
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
            position: "fixed" as const,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex" as const,
            justifyContent: "center" as const,
            alignItems: "center" as const,
          }}
        >
          <Typography variant="h6">Generating PDF...</Typography>
        </Box>
      )}
      <Dialog
        fullWidth={"sm" as any}
        open={openDeclined}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            width: "436px",
            position: "absolute" as const, // Ensure absolute positioning
            top: 0, // Position at the top of the screen
            margin: "16px",
          },
        }}
        onClose={() => setOpenDeclined(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent sx={{ display: "flex" as const, alignItems: "center" as const }}>
          <ErrorOutline
            sx={{ color: "#fb9750", width: "30px", height: "30px" }}
          />
          <DialogContentText sx={{ ml: 1, fontSize: "12px", color: "#212529" }}>
            You are trying to decline an quote that you had accepted. Are you
            sure you want to decline?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "start" as const, ml: 6, mb: 3 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none" as const,
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
              textTransform: "none" as const,
            }}
            onClick={() => setOpenDeclined(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={"sm" as any}
        open={openDeclinedForm}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            position: "absolute" as const, // Ensure absolute positioning
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
        <DialogContent sx={{ display: "flex" as const, alignItems: "center" as const }}>
          <TextareaAutosize
            minRows={4}
            placeholder="Enter a reason for declining"
            value={description}
            onChange={(e) => setDescription((e.target as any).value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #9e9e9e",
              fontSize: "16px",
              resize: "vertical" as const,
              fontFamily: "inherit" as const,
              boxSizing: "border-box" as const,
              marginBottom: "16px",
            }}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "start" as const, m: 2 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none" as const,
              background: "#408dfb",
              height: "35px",
            }}
            disabled={!description.trim()}
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
              textTransform: "none" as const,
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
