// "use client";

// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Paper,
//   Container,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Grid,
// } from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import PrintIcon from "@mui/icons-material/Print";
// import DownloadIcon from "@mui/icons-material/Download";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import EmailIcon from "@mui/icons-material/Email";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

// const HomePage = ({ details }) => {
//   // Format the billing address for display
//   const formatBillingAddress = () => {
//     if (!details || !details.billing_address) return "";

//     const addr = details.billing_address;
//     return `${addr.attention || ""}
// ${addr.address || ""}${addr.street2 ? "\n" + addr.street2 : ""}
// ${addr.city || ""}, ${addr.state || ""} ${addr.zip || ""}
// ${addr.country || ""}
// ${addr.phone || ""}`;
//   };

//   // Format the organization address for display
//   const formatOrgAddress = () => {
//     if (!details || !details.organization) return "";

//     const org = details.organization;
//     return `${org.org_name || ""}
// ${org.first_street || ""}${org.second_street ? "\n" + org.second_street : ""}
// ${org.city || ""}, ${org.state || ""} ${org.zip || ""}
// ${org.country || ""}
// ${org.phone || ""}${details.gst_no ? "\nGSTIN: " + details.gst_no : ""}`;
//   };

//   // Create a formatted balance amount
//   const formatAmount = (amount) => {
//     if (!details || !details.organization || !details.organization.currency_symbol) {
//       return `$${parseFloat(amount || 0).toFixed(2)}`;
//     }
//     return `${details.organization.currency_symbol}${parseFloat(amount || 0).toFixed(2)}`;
//   };

//   // Getting the current date and formatting it
//   const getCurrentDate = () => {
//     const date = new Date();
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   // Calculating the default 30 days from now for toDate (if not provided)
//   const getDefaultToDate = () => {
//     const date = new Date();
//     date.setDate(date.getDate() + 30);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   const [activeTab, setActiveTab] = useState(3);

//   // Create a dummy transaction for opening balance
//   const openingBalanceTransaction = {
//     date: getCurrentDate(),
//     transactionType: "Opening Balance",
//     details: "",
//     amount: formatAmount(details?.opening_balance_amount || 0),
//     payments: "",
//     balance: formatAmount(details?.opening_balance_amount || 0),
//   };

//   // Create account summary based on opening balance
//   const accountSummary = {
//     openingBalance: formatAmount(details?.opening_balance_amount || 0),
//     billedAmount: formatAmount(0),
//     amountPaid: formatAmount(0),
//     balanceDue: formatAmount(details?.opening_balance_amount || 0),
//   };

//   const generatePDF = () => {
//     try {
//       // Validate that details object exists
//       if (!details) {
//         console.error("Details object is undefined");
//         alert("Unable to generate PDF: Missing customer information");
//         return;
//       }

//       // Create a new PDF document
//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       // Set standard margins and dimensions
//       const margin = 15;
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const contentWidth = pageWidth - margin * 2;

//       // Add title and date range (centered)
//       doc.setFontSize(16);
//       doc.setFont("helvetica", "bold");
//       doc.text(
//         "Customer Statement for " + (details.contact_name || "Customer"),
//         pageWidth / 2,
//         margin + 10,
//         { align: "center" }
//       );
//       doc.setFontSize(12);
//       doc.setFont("helvetica", "normal");
//       doc.text(
//         `${getCurrentDate()} to ${getDefaultToDate()}`,
//         pageWidth / 2,
//         margin + 18,
//         { align: "center" }
//       );

//       // Add statement content with styling
//       doc.setDrawColor(200, 200, 200);
//       doc.setFillColor(255, 255, 255);
//       doc.roundedRect(margin, margin + 25, contentWidth, 240, 2, 2, "F");

//       // Customer section (left)
//       doc.setFontSize(10);
//       doc.text("To", margin + 10, margin + 35);
//       doc.setFont("helvetica", "bold");
//       doc.text(details.contact_name || "Customer", margin + 10, margin + 40);
//       doc.setFont("helvetica", "normal");

//       const customerAddressLines = formatBillingAddress().split("\n");
//       let yPos = margin + 45;
//       doc.setFontSize(9);
//       customerAddressLines.forEach((line) => {
//         doc.text(line, margin + 10, yPos);
//         yPos += 5;
//       });

//       // Company details (right)
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "bold");
//       doc.text(
//         details.organization?.org_name || "Company",
//         pageWidth - margin - 10,
//         margin + 35,
//         { align: "right" }
//       );
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(9);

//       const companyAddressLines = formatOrgAddress().split("\n");
//       let yCompanyPos = margin + 40;
//       companyAddressLines.forEach((line) => {
//         doc.text(line, pageWidth - margin - 10, yCompanyPos, { align: "right" });
//         yCompanyPos += 5;
//       });

//       // Statement title (right aligned)
//       const statementTitleY = Math.max(yPos, yCompanyPos) + 15;
//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text(
//         "Statement of Accounts",
//         pageWidth - margin - 10,
//         statementTitleY,
//         { align: "right" }
//       );

//       // Date range under title with borders
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");
//       const dateRangeText = `${getCurrentDate()} to ${getDefaultToDate()}`;
//       doc.text(dateRangeText, pageWidth - margin - 10, statementTitleY + 10, {
//         align: "right",
//       });

//       // Add lines above and below date range
//       const dateTextWidth = doc.getTextWidth(dateRangeText);
//       doc.setLineWidth(0.3);
//       doc.line(
//         pageWidth - margin - 10 - dateTextWidth,
//         statementTitleY + 7,
//         pageWidth - margin - 10,
//         statementTitleY + 7
//       );
//       doc.line(
//         pageWidth - margin - 10 - dateTextWidth,
//         statementTitleY + 13,
//         pageWidth - margin - 10,
//         statementTitleY + 13
//       );

//       // Account Summary Box (right)
//       const summaryBoxY = statementTitleY + 20;
//       const summaryBoxWidth = 85;
//       const summaryBoxX = pageWidth - margin - 10 - summaryBoxWidth;

//       // Account Summary title
//       doc.setFillColor(240, 240, 240);
//       doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, 8, "F");
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "bold");
//       doc.text("Account Summary", summaryBoxX + 5, summaryBoxY + 5.5);
//       doc.setFont("helvetica", "normal");

//       // Summary data
//       const summaryData = [
//         ["Opening Balance", accountSummary.openingBalance],
//         ["Billed Amount", accountSummary.billedAmount],
//         ["Amount Paid", accountSummary.amountPaid],
//         ["Balance Due", accountSummary.balanceDue],
//       ];

//       doc.setFontSize(9);
//       let summaryTextY = summaryBoxY + 15;

//       summaryData.forEach((item, index) => {
//         if (index === summaryData.length - 1) {
//           doc.setDrawColor(180, 180, 180);
//           doc.setLineWidth(0.3);
//           doc.line(
//             summaryBoxX,
//             summaryTextY - 3,
//             summaryBoxX + summaryBoxWidth,
//             summaryTextY - 3
//           );
//         }

//         doc.text(item[0], summaryBoxX + 5, summaryTextY);
//         doc.text(item[1], summaryBoxX + summaryBoxWidth - 5, summaryTextY, {
//           align: "right",
//         });

//         if (index === summaryData.length - 1) {
//           doc.setFont("helvetica", "bold");
//         }

//         summaryTextY += 7;
//         doc.setFont("helvetica", "normal");
//       });

//       // Transactions Table
//       const tableStartY = summaryTextY + 10;
//       const transactions = [openingBalanceTransaction];
//       const tableData = transactions.map((t) => [
//         t.date,
//         t.transactionType,
//         t.details,
//         t.amount,
//         t.payments,
//         t.balance,
//       ]);

//       doc.autoTable({
//         startY: tableStartY,
//         head: [
//           [
//             "Date",
//             "Transaction Type",
//             "Details",
//             "Amount",
//             "Payments",
//             "Balance",
//           ],
//         ],
//         body: tableData,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//           lineWidth: 0.1,
//           lineColor: [80, 80, 80],
//         },
//         headStyles: {
//           fillColor: [60, 61, 58],
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//         },
//         columnStyles: {
//           0: { cellWidth: 25 },
//           1: { cellWidth: 35 },
//           2: { cellWidth: 25 },
//           3: { cellWidth: 25, halign: "right" },
//           4: { cellWidth: 25, halign: "right" },
//           5: { cellWidth: 25, halign: "right" },
//         },
//         alternateRowStyles: {
//           fillColor: [249, 249, 249],
//         },
//         margin: { left: margin, right: margin },
//       });

//       // Final Balance Due section
//       const finalY = doc.lastAutoTable.finalY + 10;
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "bold");
//       doc.text("Balance Due", pageWidth - margin - 55, finalY);
//       doc.text(accountSummary.balanceDue, pageWidth - margin - 10, finalY, {
//         align: "right",
//       });

//       // Add footer with page number
//       const totalPages = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= totalPages; i++) {
//         doc.setPage(i);
//         doc.setFontSize(8);
//         doc.setFont("helvetica", "normal");
//         doc.text(
//           `Page ${i} of ${totalPages}`,
//           pageWidth / 2,
//           doc.internal.pageSize.height - 10,
//           { align: "center" }
//         );
//       }

//       // Create a safe filename
//       const safeContactName = (details.contact_name || "Customer")
//         .replace(/[^a-zA-Z0-9_\-\s]/g, "")
//         .replace(/\s+/g, "_");
//       const timestamp = new Date().getTime();
//       const filename = `Statement_${safeContactName}_${timestamp}.pdf`;

//       // Save the PDF
//       doc.save(filename);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("An error occurred while generating the PDF. Please try again.");
//     }
//   };

//   const handleSendEmail = () => {
//     console.log("Send email functionality");
//   };

//   const handlePrint = () => {
//     try {
//       // Use the same PDF generation but open in a new window for printing
//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       // Reuse the same PDF generation code...
//       // Set standard margins and dimensions
//       const margin = 15;
//       const pageWidth = 210;
//       const contentWidth = pageWidth - margin * 2;

//       // Add title and date range (centered)
//       doc.setFontSize(16);
//       doc.setFont(undefined, "bold");
//       doc.text(
//         "Customer Statement for " + (details.contact_name || "Customer"),
//         pageWidth / 2,
//         margin + 10,
//         {
//           align: "center",
//         }
//       );
//       doc.setFontSize(12);
//       doc.setFont(undefined, "normal");
//       doc.text(
//         `${getCurrentDate()} to ${getDefaultToDate()}`,
//         pageWidth / 2,
//         margin + 18,
//         { align: "center" }
//       );

//       // Add statement content with styling to match the UI
//       doc.setDrawColor(200, 200, 200);
//       doc.setFillColor(255, 255, 255);
//       doc.roundedRect(margin, margin + 25, contentWidth, 240, 2, 2, "F");

//       // Customer section (left)
//       doc.setFontSize(10);
//       doc.text("To", margin + 10, margin + 35);
//       doc.setFont(undefined, "bold");
//       doc.text(details.contact_name || "Customer", margin + 10, margin + 40);
//       doc.setFont(undefined, "normal");

//       const customerAddressLines = formatBillingAddress().split("\n");
//       let yPos = margin + 45;
//       doc.setFontSize(9);
//       customerAddressLines.forEach((line) => {
//         doc.text(line, margin + 10, yPos);
//         yPos += 5;
//       });

//       // Company details (right)
//       doc.setFontSize(10);
//       doc.setFont(undefined, "bold");
//       doc.text(
//         details.organization?.org_name || "Company",
//         pageWidth - margin - 10,
//         margin + 35,
//         {
//           align: "right",
//         }
//       );
//       doc.setFont(undefined, "normal");
//       doc.setFontSize(9);

//       const companyAddressLines = formatOrgAddress().split("\n");
//       let yCompanyPos = margin + 40;
//       companyAddressLines.forEach((line) => {
//         doc.text(line, pageWidth - margin - 10, yCompanyPos, {
//           align: "right",
//         });
//         yCompanyPos += 5;
//       });

//       // Statement title (right aligned as in UI)
//       const statementTitleY = Math.max(yPos, yCompanyPos) + 15;
//       doc.setFontSize(14);
//       doc.setFont(undefined, "bold");
//       doc.text(
//         "Statement of Accounts",
//         pageWidth - margin - 10,
//         statementTitleY,
//         {
//           align: "right",
//         }
//       );

//       // Date range under title with borders (like in UI)
//       doc.setFontSize(10);
//       doc.setFont(undefined, "normal");
//       const dateRangeText = `${getCurrentDate()} to ${getDefaultToDate()}`;
//       doc.text(dateRangeText, pageWidth - margin - 10, statementTitleY + 10, {
//         align: "right",
//       });

//       // Add lines above and below date range (like in UI)
//       const dateTextWidth = doc.getTextWidth(dateRangeText);
//       doc.setLineWidth(0.3);
//       doc.line(
//         pageWidth - margin - 10 - dateTextWidth,
//         statementTitleY + 7,
//         pageWidth - margin - 10,
//         statementTitleY + 7
//       );
//       doc.line(
//         pageWidth - margin - 10 - dateTextWidth,
//         statementTitleY + 13,
//         pageWidth - margin - 10,
//         statementTitleY + 13
//       );

//       // Account Summary Box (right)
//       const summaryBoxY = statementTitleY + 20;
//       const summaryBoxWidth = 85;
//       const summaryBoxHeight = 42;
//       const summaryBoxX = pageWidth - margin - 10 - summaryBoxWidth;

//       // Account Summary title
//       doc.setFillColor(240, 240, 240);
//       doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, 8, "F");
//       doc.setFontSize(10);
//       doc.setFont(undefined, "bold");
//       doc.text("Account Summary", summaryBoxX + 5, summaryBoxY + 5.5);
//       doc.setFont(undefined, "normal");

//       // Summary data
//       const summaryData = [
//         ["Opening Balance", accountSummary.openingBalance],
//         ["Billed Amount", accountSummary.billedAmount],
//         ["Amount Paid", accountSummary.amountPaid],
//         ["Balance Due", accountSummary.balanceDue],
//       ];

//       doc.setFontSize(9);
//       let summaryTextY = summaryBoxY + 15;

//       summaryData.forEach((item, index) => {
//         if (index === summaryData.length - 1) {
//           doc.setDrawColor(180, 180, 180);
//           doc.setLineWidth(0.3);
//           doc.line(
//             summaryBoxX,
//             summaryTextY - 3,
//             summaryBoxX + summaryBoxWidth,
//             summaryTextY - 3
//           );
//         }

//         doc.text(item[0], summaryBoxX + 5, summaryTextY);
//         doc.text(item[1], summaryBoxX + summaryBoxWidth - 5, summaryTextY, {
//           align: "right",
//         });

//         if (index === summaryData.length - 1) {
//           doc.setFont(undefined, "bold");
//         }

//         summaryTextY += 7;
//         doc.setFont(undefined, "normal");
//       });

//       // Transactions Table - match the UI appearance
//       const tableStartY = summaryTextY + 10;

//       // Use opening balance transaction as default if no transactions exist
//       const transactions = [openingBalanceTransaction];
//       const tableData = transactions.map((t) => [
//         t.date,
//         t.transactionType,
//         t.details,
//         t.amount,
//         t.payments,
//         t.balance,
//       ]);

//       doc.autoTable({
//         startY: tableStartY,
//         head: [
//           [
//             "Date",
//             "Transaction Type",
//             "Details",
//             "Amount",
//             "Payments",
//             "Balance",
//           ],
//         ],
//         body: tableData,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//           lineWidth: 0.1,
//           lineColor: [80, 80, 80],
//         },
//         headStyles: {
//           fillColor: [60, 61, 58], // Dark gray to match UI (#3C3D3A)
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//         },
//         columnStyles: {
//           0: { cellWidth: 25 },
//           1: { cellWidth: 35 },
//           2: { cellWidth: 25 },
//           3: { cellWidth: 25, halign: "right" },
//           4: { cellWidth: 25, halign: "right" },
//           5: { cellWidth: 25, halign: "right" },
//         },
//         alternateRowStyles: {
//           fillColor: [249, 249, 249], // Light gray for odd rows (#f9f9f9)
//         },
//         margin: { left: margin, right: margin },
//       });

//       // Final Balance Due section at bottom - matches UI styling
//       const finalY = doc.lastAutoTable.finalY + 10;
//       doc.setFontSize(10);
//       doc.setFont(undefined, "bold");
//       doc.text("Balance Due", pageWidth - margin - 55, finalY);
//       doc.text(accountSummary.balanceDue, pageWidth - margin - 10, finalY, {
//         align: "right",
//       });

//       // Add footer with page number
//       const totalPages = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= totalPages; i++) {
//         doc.setPage(i);
//         doc.setFontSize(8);
//         doc.setFont(undefined, "normal");
//         doc.text(
//           `Page ${i} of ${totalPages}`,
//           pageWidth / 2,
//           doc.internal.pageSize.height - 10,
//           { align: "center" }
//         );
//       }

//       // Open PDF in new window for printing
//       try {
//         const pdfData = doc.output("datauristring");
//         const newWindow = window.open();
//         if (!newWindow) {
//           alert("Please allow pop-ups to print the statement.");
//           return;
//         }
//         newWindow.document.write(`
//           <html>
//             <head>
//               <title>Print Statement - ${details.contact_name || 'Customer'}</title>
//               <style>
//                 body { margin: 0; }
//                 iframe { width: 100%; height: 100%; border: none; }
//               </style>
//               <script>
//                 document.addEventListener('DOMContentLoaded', function() {
//                   setTimeout(function() { window.print(); }, 500);
//                 });
//               </script>
//             </head>
//             <body>
//               <iframe src="${pdfData}"></iframe>
//             </body>
//           </html>
//         `);
//       } catch (error) {
//         console.error("Error opening print window:", error);
//         alert("Unable to open print dialog. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error preparing document for printing:", error);
//       alert("An error occurred while preparing the document for printing.");
//     }
//   };

//   const handleViewPDF = () => {
//     try {
//       // Generate PDF and open in new tab for viewing
//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       // Reuse the same PDF generation code as in generatePDF
//       // Set standard margins and dimensions
//       const margin = 15;
//       const pageWidth = 210;
//       const contentWidth = pageWidth - margin * 2;

//       // Add title and date range (centered)
//       doc.setFontSize(16);
//       doc.setFont(undefined, "bold");
//       doc.text(
//         "Customer Statement for " + (details.contact_name || "Customer"),
//         pageWidth / 2,
//         margin + 10,
//         {
//           align: "center",
//         }
//       );
//       doc.setFontSize(12);
//       doc.setFont(undefined, "normal");
//       doc.text(
//         `${getCurrentDate()} to ${getDefaultToDate()}`,
//         pageWidth / 2,
//         margin + 18,
//         { align: "center" }
//       );

//       // Add statement content with styling to match the UI
//       doc.setDrawColor(200, 200, 200);
//       doc.setFillColor(255, 255, 255);
//       doc.roundedRect(margin, margin + 25, contentWidth, 240, 2, 2, "F");

//       // Customer section (left)
//       doc.setFontSize(10);
//       doc.text("To", margin + 10, margin + 35);
//       doc.setFont(undefined, "bold");
//       doc.text(details.contact_name || "Customer", margin + 10, margin + 40);
//       doc.setFont(undefined, "normal");

//       const customerAddressLines = formatBillingAddress().split("\n");
//       let yPos = margin + 45;
//       doc.setFontSize(9);
//       customerAddressLines.forEach((line) => {
//         doc.text(line, margin + 10, yPos);
//         yPos += 5;
//       });

//       // Company details (right)
//       doc.setFontSize(10);
//       doc.setFont(undefined, "bold");
//       doc.text(
//         details.organization?.org_name || "Company",
//         pageWidth - margin - 10,
//         margin + 35,
//         {
//           align: "right",
//         }
//       );
//       doc.setFont(undefined, "normal");
//       doc.setFontSize(9);

//       const companyAddressLines = formatOrgAddress().split("\n");
//       let yCompanyPos = margin + 40;
//       companyAddressLines.forEach((line) => {
//         doc.text(line, pageWidth - margin - 10, yCompanyPos, {
//           align: "right",
//         });
//         yCompanyPos += 5;
//       });

//       // Statement title (right aligned as in UI)
//       const statementTitleY = Math.max(yPos, yCompanyPos) + 15;
//       doc.setFontSize(14);
//       doc.setFont(undefined, "bold");
//       doc.text(
//         "Statement of Accounts",
//         pageWidth - margin - 10,
//         statementTitleY,
//         {
//           align: "right",
//         }
//       );

//       // Date range under title with borders (like in UI)
//       doc.setFontSize(10);
//       doc.setFont(undefined, "normal");
//       const dateRangeText = `${getCurrentDate()} to ${getDefaultToDate()}`;
//       doc.text(dateRangeText, pageWidth - margin - 10, statementTitleY + 10, {
//         align: "right",
//       });

//       // Add lines above and below date range (like in UI)
//       const dateTextWidth = doc.getTextWidth(dateRangeText);
//       doc.setLineWidth(0.3);
//       doc.line(
//         pageWidth - margin - 10 - dateTextWidth,
//         statementTitleY + 7,
//         pageWidth - margin - 10,
//         statementTitleY + 7
//       );
//       doc.line(
//         pageWidth - margin - 10 - dateTextWidth,
//         statementTitleY + 13,
//         pageWidth - margin - 10,
//         statementTitleY + 13
//       );

//       // Account Summary Box (right)
//       const summaryBoxY = statementTitleY + 20;
//       const summaryBoxWidth = 85;
//       const summaryBoxHeight = 42;
//       const summaryBoxX = pageWidth - margin - 10 - summaryBoxWidth;

//       // Account Summary title
//       doc.setFillColor(240, 240, 240);
//       doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, 8, "F");
//       doc.setFontSize(10);
//       doc.setFont(undefined, "bold");
//       doc.text("Account Summary", summaryBoxX + 5, summaryBoxY + 5.5);
//       doc.setFont(undefined, "normal");

//       // Summary data
//       const summaryData = [
//         ["Opening Balance", accountSummary.openingBalance],
//         ["Billed Amount", accountSummary.billedAmount],
//         ["Amount Paid", accountSummary.amountPaid],
//         ["Balance Due", accountSummary.balanceDue],
//       ];

//       doc.setFontSize(9);
//       let summaryTextY = summaryBoxY + 15;

//       summaryData.forEach((item, index) => {
//         if (index === summaryData.length - 1) {
//           doc.setDrawColor(180, 180, 180);
//           doc.setLineWidth(0.3);
//           doc.line(
//             summaryBoxX,
//             summaryTextY - 3,
//             summaryBoxX + summaryBoxWidth,
//             summaryTextY - 3
//           );
//         }

//         doc.text(item[0], summaryBoxX + 5, summaryTextY);
//         doc.text(item[1], summaryBoxX + summaryBoxWidth - 5, summaryTextY, {
//           align: "right",
//         });

//         if (index === summaryData.length - 1) {
//           doc.setFont(undefined, "bold");
//         }

//         summaryTextY += 7;
//         doc.setFont(undefined, "normal");
//       });

//       // Transactions Table - match the UI appearance
//       const tableStartY = summaryTextY + 10;

//       // Use opening balance transaction as default if no transactions exist
//       const transactions = [openingBalanceTransaction];
//       const tableData = transactions.map((t) => [
//         t.date,
//         t.transactionType,
//         t.details,
//         t.amount,
//         t.payments,
//         t.balance,
//       ]);

//       doc.autoTable({
//         startY: tableStartY,
//         head: [
//           [
//             "Date",
//             "Transaction Type",
//             "Details",
//             "Amount",
//             "Payments",
//             "Balance",
//           ],
//         ],
//         body: tableData,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//           lineWidth: 0.1,
//           lineColor: [80, 80, 80],
//         },
//         headStyles: {
//           fillColor: [60, 61, 58], // Dark gray to match UI (#3C3D3A)
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//         },
//         columnStyles: {
//           0: { cellWidth: 25 },
//           1: { cellWidth: 35 },
//           2: { cellWidth: 25 },
//           3: { cellWidth: 25, halign: "right" },
//           4: { cellWidth: 25, halign: "right" },
//           5: { cellWidth: 25, halign: "right" },
//         },
//         alternateRowStyles: {
//           fillColor: [249, 249, 249], // Light gray for odd rows (#f9f9f9)
//         },
//         margin: { left: margin, right: margin },
//       });

//       // Final Balance Due section at bottom - matches UI styling
//       const finalY = doc.lastAutoTable.finalY + 10;
//       doc.setFontSize(10);
//       doc.setFont(undefined, "bold");
//       doc.text("Balance Due", pageWidth - margin - 55, finalY);
//       doc.text(accountSummary.balanceDue, pageWidth - margin - 10, finalY, {
//         align: "right",
//       });

//       // Add footer with page number
//       const totalPages = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= totalPages; i++) {
//         doc.setPage(i);
//         doc.setFontSize(8);
//         doc.setFont(undefined, "normal");
//         doc.text(
//           `Page ${i} of ${totalPages}`,
//           pageWidth / 2,
//           doc.internal.pageSize.height - 10,
//           { align: "center" }
//         );
//       }

//       // Open PDF in new tab for viewing
//       try {
//         const pdfBlob = doc.output("blob");
//         const blobUrl = URL.createObjectURL(pdfBlob);
//         window.open(blobUrl, "_blank");
//       } catch (error) {
//         console.error("Error opening PDF in new tab:", error);
//         alert("Unable to open PDF for viewing. Please try downloading instead.");
//         // Fallback to download if viewing fails
//         doc.save(`Statement_${details.contact_name || "Customer"}.pdf`);
//       }
//     } catch (error) {
//       console.error("Error generating PDF for viewing:", error);
//       alert("An error occurred while generating the PDF for viewing.");
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       {/* Top Action Bar */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//         <Button variant="outlined" size="small" endIcon={<ArrowDropDownIcon />}>
//           {" "}
//           THIS MONTH{" "}
//         </Button>
//         <Box>
//           <IconButton size="small" onClick={handlePrint}>
//             <PrintIcon />
//           </IconButton>
//           <IconButton size="small" onClick={generatePDF}>
//             {" "}
//             <DownloadIcon />
//           </IconButton>
//           <IconButton size="small" onClick={handleViewPDF}>
//             <PictureAsPdfIcon />
//           </IconButton>
//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             startIcon={<EmailIcon />}
//             onClick={handleSendEmail}
//           >
//             SEND EMAIL
//           </Button>
//         </Box>
//       </Box>

//       <Box sx={{ mb: 3, textAlign: "center", p: 2 }}>
//         <Typography sx={{ fontSize: "16px" }}>
//           Customer Statement for {details?.contact_name || "Customer"}
//         </Typography>
//         <Typography sx={{ fontSize: "16px" }}>
//           {getCurrentDate()} to {getDefaultToDate()}
//         </Typography>
//       </Box>

//       {/* Statement Content */}
//       <Paper elevation={4} sx={{ p: 3, pb: 3 }}>
//         <Grid container spacing={3}>
//           {/* Logo and Customer Info (Left Side) */}
//           <Grid item xs={12} md={6} sx={{ fontSize: "13px" }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 fontSize: "13px",
//               }}
//             >
//               <Typography variant="body1">To</Typography>
//               <Typography
//                 variant="body1"
//                 sx={{ fontWeight: "bold", fontSize: "13px" }}
//               >
//                 {details?.contact_name || "Customer"}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ whiteSpace: "pre-line", fontSize: "13px" }}
//               >
//                 {formatBillingAddress()}
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Company Info (Right Side) */}
//           <Grid item xs={12} md={6} sx={{ fontSize: "13px" }}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "flex-end",
//               }}
//             >
//               <Typography
//                 variant="body1"
//                 sx={{ fontWeight: "bold", fontSize: "13px" }}
//               >
//                 {details?.organization?.org_name || "Company"}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   whiteSpace: "pre-line",
//                   textAlign: "right",
//                   fontSize: "13px",
//                 }}
//               >
//                 {formatOrgAddress()}
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Statement Title (Centered) */}
//           <Grid item xs={12} sx={{ mt: 1 }}>
//             <Box sx={{ textAlign: "right" }}>
//               <Typography
//                 gutterBottom
//                 sx={{
//                   fontSize: "21px",
//                   display: "inline-block",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Statement of Accounts
//               </Typography>
//               <br />
//               <Typography
//                 gutterBottom
//                 sx={{
//                   display: "inline-block",
//                   borderTop: "1px solid black",
//                   borderBottom: "1px solid black",
//                   padding: "5px 0px",
//                   mt: 1,
//                   fontSize: "16px",
//                 }}
//               >
//                 {getCurrentDate()} to {getDefaultToDate()}
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Account Summary (Right Side) */}
//           <Grid item xs={12}>
//             <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
//               <Box elevation={1} sx={{ padding: "0px 5px", width: "350px" }}>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     fontWeight: "bold",
//                     mb: 1,
//                     bgcolor: "#f0f0f0",
//                     padding: "4px 0px",
//                   }}
//                 >
//                   Account Summary
//                 </Typography>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     my: 1,
//                     fontSize: "12px",
//                   }}
//                 >
//                   <Typography variant="body2" sx={{ fontSize: "12px" }}>
//                     Opening Balance
//                   </Typography>
//                   <Typography variant="body2">
//                     {accountSummary.openingBalance}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     my: 1,
//                   }}
//                 >
//                   <Typography variant="body2" sx={{ fontSize: "12px" }}>
//                     Billed Amount
//                   </Typography>
//                   <Typography variant="body2">
//                     {accountSummary.billedAmount}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     my: 1,
//                   }}
//                 >
//                   <Typography variant="body2" sx={{ fontSize: "12px" }}>
//                     Amount Paid
//                   </Typography>
//                   <Typography variant="body2">
//                     {accountSummary.amountPaid}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mt: 1,
//                     pt: 1,
//                     borderTop: "1px solid #aaa",
//                   }}
//                 >
//                   <Typography variant="body2" sx={{ fontSize: "12px" }}>
//                     Balance Due
//                   </Typography>
//                   <Typography variant="body2">
//                     {accountSummary.balanceDue}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </Grid>

//           {/* Transactions Table */}
//           <Grid item xs={12}>
//             <TableContainer sx={{ mt: 3 }}>
//               <Table sx={{ minWidth: 650 }} size="small">
//                 <TableHead sx={{ backgroundColor: "#3C3D3A !important" }}>
//                   <TableRow sx={{ backgroundColor: "#3C3D3A" }}>
//                     <TableCell
//                       sx={{
//                         color: "white !important",
//                         fontWeight: "bold",
//                         backgroundColor: "#3C3D3A !important",
//                       }}
//                     >
//                       Date
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white !important",
//                         fontWeight: "bold",
//                         backgroundColor: "#3C3D3A !important",
//                       }}
//                     >
//                       Transaction Type
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white !important",
//                         fontWeight: "bold",
//                         backgroundColor: "#3C3D3A !important",
//                       }}
//                     >
//                       Details
//                     </TableCell>
//                     <TableCell
//                       align="right"
//                       sx={{
//                         color: "white !important",
//                         fontWeight: "bold",
//                         backgroundColor: "#3C3D3A !important",
//                       }}
//                     >
//                       Amount
//                     </TableCell>
//                     <TableCell
//                       align="right"
//                       sx={{
//                         color: "white !important",
//                         fontWeight: "bold",
//                         backgroundColor: "#3C3D3A !important",
//                       }}
//                     >
//                       Payments
//                     </TableCell>
//                     <TableCell
//                       align="right"
//                       sx={{
//                         color: "white !important",
//                         fontWeight: "bold",
//                         backgroundColor: "#3C3D3A !important",
//                       }}
//                     >
//                       Balance
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   <TableRow
//                     sx={{
//                       "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
//                     }}
//                   >
//                     <TableCell>{openingBalanceTransaction.date}</TableCell>
//                     <TableCell>
//                       {openingBalanceTransaction.transactionType}
//                     </TableCell>
//                     <TableCell>{openingBalanceTransaction.details}</TableCell>
//                     <TableCell align="right">
//                       {openingBalanceTransaction.amount}
//                     </TableCell>
//                     <TableCell align="right">
//                       {openingBalanceTransaction.payments}
//                     </TableCell>
//                     <TableCell align="right">
//                       {openingBalanceTransaction.balance}
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Grid>

//           {/* Balance Due at Bottom */}
//           <Grid item xs={12}>
//             <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 1 }}>
//               <Box sx={{ width: "250px" }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mt: 1,
//                   }}
//                 >
//                   <Typography
//                     variant="body1"
//                     sx={{ fontWeight: "bold", fontSize: "12px" }}
//                   >
//                     Balance Due
//                   </Typography>
//                   <Typography variant="body1" sx={{ fontSize: "12px" }}>
//                     {accountSummary.balanceDue}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Container>
//   );
// };

// export default HomePage;


"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EmailIcon from "@mui/icons-material/Email";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DownloadIcon from "@mui/icons-material/Download";


const HomePage = ({ details }) => {
  // Format the billing address for display
  const formatBillingAddress = () => {
    if (!details || !details.billing_address) return "";

    const addr = details.billing_address;
    return `${addr.attention || ""}
${addr.address || ""}${addr.street2 ? "\n" + addr.street2 : ""}
${addr.city || ""}, ${addr.state || ""} ${addr.zip || ""}
${addr.country || ""}
${addr.phone || ""}`;
  };

  // Format the organization address for display
  const formatOrgAddress = () => {
    if (!details || !details.organization) return "";

    const org = details.organization;
    return `${org.org_name || ""}
${org.first_street || ""}${org.second_street ? "\n" + org.second_street : ""}
${org.city || ""}, ${org.state || ""} ${org.zip || ""}
${org.country || ""}
${org.phone || ""}${details.gst_no ? "\nGSTIN: " + details.gst_no : ""}`;
  };

  // Create a formatted balance amount
  const formatAmount = (amount) => {
    if (!details || !details.organization || !details.organization.currency_symbol) {
      return `$${parseFloat(amount || 0).toFixed(2)}`;
    }
    return `${details.organization.currency_symbol}${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Getting the current date and formatting it
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculating the default 30 days from now for toDate (if not provided)
  const getDefaultToDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const [activeTab, setActiveTab] = useState(3);

  // Create a dummy transaction for opening balance
  const openingBalanceTransaction = {
    date: getCurrentDate(),
    transactionType: "Opening Balance",
    details: "",
    amount: formatAmount(details?.opening_balance_amount || 0),
    payments: "",
    balance: formatAmount(details?.opening_balance_amount || 0),
  };

  // Create account summary based on opening balance
  const accountSummary = {
    openingBalance: formatAmount(details?.opening_balance_amount || 0),
    billedAmount: formatAmount(0),
    amountPaid: formatAmount(0),
    balanceDue: formatAmount(details?.opening_balance_amount || 0),
  };

  // const generatePDF = () => {
  //   try {
  //     // Validate that details object exists
  //     if (!details) {
  //       console.error("Details object is undefined");
  //       alert("Unable to generate PDF: Missing customer information");
  //       return;
  //     }
      
      

  //     // Initialize PDF document
  //     const doc = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     // Set margins and page dimensions
  //     const margin = 15;
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const contentWidth = pageWidth - margin * 2;

  //     // Add title
  //     doc.setFontSize(16);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(
  //       `Customer Statement for ${details.contact_name || "Customer"}`,
  //       pageWidth / 2,
  //       margin + 10,
  //       { align: "center" }
  //     );

  //     // Add date range
  //     doc.setFontSize(12);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(
  //       `${getCurrentDate()} to ${getDefaultToDate()}`,
  //       pageWidth / 2,
  //       margin + 18,
  //       { align: "center" }
  //     );

  //     // Add content background
  //     doc.setDrawColor(200, 200, 200);
  //     doc.setFillColor(255, 255, 255);
  //     doc.roundedRect(margin, margin + 25, contentWidth, 240, 2, 2, "F");

  //     // Customer information (left side)
  //     doc.setFontSize(10);
  //     doc.text("To", margin + 10, margin + 35);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(details.contact_name || "Customer", margin + 10, margin + 40);
  //     doc.setFont("helvetica", "normal");

  //     let yPos = margin + 45;
  //     doc.setFontSize(9);
  //     formatBillingAddress().split("\n").forEach(line => {
  //       doc.text(line, margin + 10, yPos);
  //       yPos += 5;
  //     });

  //     // Company information (right side)
  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(
  //       details.organization?.org_name || "Company",
  //       pageWidth - margin - 10,
  //       margin + 35,
  //       { align: "right" }
  //     );
  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(9);

  //     let yCompanyPos = margin + 40;
  //     formatOrgAddress().split("\n").forEach(line => {
  //       doc.text(line, pageWidth - margin - 10, yCompanyPos, { align: "right" });
  //       yCompanyPos += 5;
  //     });

  //     // Statement title
  //     const statementTitleY = Math.max(yPos, yCompanyPos) + 15;
  //     doc.setFontSize(14);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(
  //       "Statement of Accounts",
  //       pageWidth - margin - 10,
  //       statementTitleY,
  //       { align: "right" }
  //     );

  //     // Date range with borders
  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "normal");
  //     const dateRangeText = `${getCurrentDate()} to ${getDefaultToDate()}`;
  //     doc.text(dateRangeText, pageWidth - margin - 10, statementTitleY + 10, {
  //       align: "right",
  //     });

  //     const dateTextWidth = doc.getTextWidth(dateRangeText);
  //     doc.setLineWidth(0.3);
  //     doc.line(
  //       pageWidth - margin - 10 - dateTextWidth,
  //       statementTitleY + 7,
  //       pageWidth - margin - 10,
  //       statementTitleY + 7
  //     );
  //     doc.line(
  //       pageWidth - margin - 10 - dateTextWidth,
  //       statementTitleY + 13,
  //       pageWidth - margin - 10,
  //       statementTitleY + 13
  //     );

  //     // Account summary box
  //     const summaryBoxY = statementTitleY + 20;
  //     const summaryBoxWidth = 85;
  //     const summaryBoxX = pageWidth - margin - 10 - summaryBoxWidth;

  //     doc.setFillColor(240, 240, 240);
  //     doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, 8, "F");
  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Account Summary", summaryBoxX + 5, summaryBoxY + 5.5);
  //     doc.setFont("helvetica", "normal");

  //     const summaryData = [
  //       ["Opening Balance", accountSummary.openingBalance],
  //       ["Billed Amount", accountSummary.billedAmount],
  //       ["Amount Paid", accountSummary.amountPaid],
  //       ["Balance Due", accountSummary.balanceDue],
  //     ];

  //     let summaryTextY = summaryBoxY + 15;
  //     doc.setFontSize(9);

  //     summaryData.forEach((item, index) => {
  //       if (index === summaryData.length - 1) {
  //         doc.setDrawColor(180, 180, 180);
  //         doc.setLineWidth(0.3);
  //         doc.line(
  //           summaryBoxX,
  //           summaryTextY - 3,
  //           summaryBoxX + summaryBoxWidth,
  //           summaryTextY - 3
  //         );
  //       }

  //       doc.text(item[0], summaryBoxX + 5, summaryTextY);
  //       doc.text(item[1], summaryBoxX + summaryBoxWidth - 5, summaryTextY, {
  //         align: "right",
  //       });

  //       if (index === summaryData.length - 1) {
  //         doc.setFont("helvetica", "bold");
  //       }

  //       summaryTextY += 7;
  //       doc.setFont("helvetica", "normal");
  //     });

  //     // Transactions table
  //     const tableStartY = summaryTextY + 10;
  //     const transactions = [openingBalanceTransaction];
  //     const tableData = transactions.map(t => [
  //       t.date,
  //       t.transactionType,
  //       t.details,
  //       t.amount,
  //       t.payments,
  //       t.balance,
  //     ]);

  //     autoTable(doc, {
  //       startY: tableStartY,
  //       head: [
  //         ["Date", "Transaction Type", "Details", "Amount", "Payments", "Balance"]
  //       ],
  //       body: tableData,
  //       theme: "grid",
  //       styles: {
  //         fontSize: 9,
  //         cellPadding: 3,
  //         lineWidth: 0.1,
  //         lineColor: [80, 80, 80],
  //       },
  //       headStyles: {
  //         fillColor: [60, 61, 58],
  //         textColor: [255, 255, 255],
  //         fontStyle: "bold",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 25 },
  //         1: { cellWidth: 35 },
  //         2: { cellWidth: 25 },
  //         3: { cellWidth: 25, halign: "right" },
  //         4: { cellWidth: 25, halign: "right" },
  //         5: { cellWidth: 25, halign: "right" },
  //       },
  //       alternateRowStyles: {
  //         fillColor: [249, 249, 249],
  //       },
  //       margin: { left: margin, right: margin },
  //     });

  //     // Balance due at bottom
  //     const finalY = doc.lastAutoTable.finalY + 10;
  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Balance Due", pageWidth - margin - 55, finalY);
  //     doc.text(accountSummary.balanceDue, pageWidth - margin - 10, finalY, {
  //       align: "right",
  //     });

  //     // Add page numbers
  //     const totalPages = doc.internal.getNumberOfPages();
  //     for (let i = 1; i <= totalPages; i++) {
  //       doc.setPage(i);
  //       doc.setFontSize(8);
  //       doc.setFont("helvetica", "normal");
  //       doc.text(
  //         `Page ${i} of ${totalPages}`,
  //         pageWidth / 2,
  //         doc.internal.pageSize.height - 10,
  //         { align: "center" }
  //       );
  //     }

  //     // Generate filename and save
  //     const safeContactName = (details.contact_name || "Customer")
  //       .replace(/[^a-zA-Z0-9_\-\s]/g, "")
  //       .replace(/\s+/g, "_");
  //     const filename = `Statement_${safeContactName}_${new Date().getTime()}.pdf`;

  //     doc.save(filename);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     alert("An error occurred while generating the PDF. Please try again.");
  //   }
  // };
  const generatePDF = () => {
    try {
      if (!details) {
        console.error("Details object is undefined");
        alert("Unable to generate PDF: Missing customer information");
        return;
      }
  
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - margin * 2;
  
      // Header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Customer Statement for ${details.contact_name || "Customer"}`, pageWidth / 2, margin + 10, { align: "center" });
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const dateRange = `${getCurrentDate()} to ${getDefaultToDate()}`;
      doc.text(dateRange, pageWidth / 2, margin + 18, { align: "center" });
  
      // Rounded background
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, margin + 25, contentWidth, 240, 2, 2, "F");
  
      // Customer Address (left)
      let yPos = margin + 45;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("To", margin + 10, yPos);
      doc.text(details.contact_name || "Customer", margin + 10, yPos + 5);
      doc.setFont("helvetica", "normal");
  
      let billingY = yPos + 10;
      formatBillingAddress().split("\n").forEach(line => {
        const wrapped = doc.splitTextToSize(line, 70);
        doc.text(wrapped, margin + 10, billingY);
        billingY += wrapped.length * 5;
      });
  
      // Company Address (right)
      let companyY = margin + 45;
      doc.setFont("helvetica", "bold");
      doc.text(details.organization?.org_name || "Company", pageWidth - margin - 10, companyY, { align: "right" });
      doc.setFont("helvetica", "normal");
  
      companyY += 5;
      formatOrgAddress().split("\n").forEach(line => {
        const wrapped = doc.splitTextToSize(line, 70);
        doc.text(wrapped, pageWidth - margin - 10, companyY, { align: "right" });
        companyY += wrapped.length * 5;
      });
  
      const nextBlockStart = Math.max(billingY, companyY) + 10;
  
      // Title
const titleText = "Statement of Accounts";
doc.setFontSize(14);
doc.setFont("helvetica", "bold");

const titleWidth = doc.getTextWidth(titleText);
const titleXEnd = pageWidth - margin - 10;
const titleXStart = titleXEnd - titleWidth;
const titleY = nextBlockStart;

doc.text(titleText, titleXEnd, titleY, { align: "right" });

// Date Range (aligned under the title, lines matching title width)
doc.setFontSize(10);
doc.setFont("helvetica", "normal");

const dateY = titleY + 8; // spacing from title to date

// Line above date (same width as title)
doc.setLineWidth(0.3);
doc.setDrawColor(0);
doc.line(titleXStart, dateY - 5, titleXEnd, dateY - 5);

// Date text
doc.text(dateRange, titleXEnd, dateY, { align: "right" });

// Line below date (same width as title)
doc.line(titleXStart, dateY + 2, titleXEnd, dateY + 2);

      // Account Summary
      const summaryY = nextBlockStart + 20;
      const summaryWidth = 85;
      const summaryX = pageWidth - margin - 10 - summaryWidth;
  
      doc.setFillColor(240, 240, 240);
      doc.rect(summaryX, summaryY, summaryWidth, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.text("Account Summary", summaryX + 5, summaryY + 5.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
  
      const summaryData = [
        ["Opening Balance", accountSummary.openingBalance],
        ["Billed Amount", accountSummary.billedAmount],
        ["Amount Paid", accountSummary.amountPaid],
        ["Balance Due", accountSummary.balanceDue],
      ];
  
      let lineY = summaryY + 15;
      summaryData.forEach((row, index) => {
        if (index === summaryData.length - 1) {
          // Draw horizontal line above Balance Due
          doc.setDrawColor(180, 180, 180);
          doc.line(summaryX, lineY - 3, summaryX + summaryWidth, lineY - 3);
          lineY += 2; // <-- Add vertical space after line
          doc.setFont("helvetica", "bold");
        }
      
        doc.text(row[0], summaryX + 5, lineY);
        doc.text(row[1], summaryX + summaryWidth - 5, lineY, { align: "right" });
      
        lineY += 7;
        doc.setFont("helvetica", "normal");
      });
      
  
      // Transactions Table
      const tableY = lineY + 10;
      const transactions = [openingBalanceTransaction];
      const tableData = transactions.map(t => [
        t.date,
        t.transactionType,
        t.details,
        t.amount,
        t.payments,
        t.balance,
      ]);
  
      autoTable(doc, {
        startY: tableY,
        head: [["Date", "Transaction Type", "Details", "Amount", "Payments", "Balance"]],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: [80, 80, 80],
        },
        headStyles: {
          fillColor: [60, 61, 58],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [249, 249, 249],
        },
        margin: { left: margin, right: 24 }, // Keep table inside the container
        tableWidth: 'auto', // Responsive to content
      });
  
      // Balance Due
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Balance Due", pageWidth - margin - 55, finalY);
      doc.text(accountSummary.balanceDue, pageWidth - margin - 10, finalY, {
        align: "right",
      });
  
      // Page Numbers
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: "center" });
      }
  
      const safeContactName = (details.contact_name || "Customer").replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
      const filename = `Statement_${safeContactName}_${new Date().getTime()}.pdf`;
  
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };
  
  const handleSendEmail = () => {
    console.log("Send email functionality");
  };

  const handlePrint = () => {
    generatePDF(); // For now, just use the same as download
  };

  const handleViewPDF = () => {
    generatePDF(); // For now, just use the same as download
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" >
      {/* Top Action Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button variant="outlined" size="small" endIcon={<ArrowDropDownIcon />}>
          THIS MONTH
        </Button>
        <Box>
        <IconButton
  sx={{ fontSize: 20, padding: '6px' }} // smaller padding and icon size
  onClick={handlePrint}
>
  <PrintIcon sx={{ fontSize: 20 }} />
</IconButton>

<IconButton
  sx={{ fontSize: 20, padding: '6px' }}
  onClick={handleViewPDF}
>
  <DownloadIcon sx={{ fontSize: 20 }} />
</IconButton>

<Button
  variant="contained"
  color="primary"
  size="small"
  sx={{
    fontSize: '12px',      // smaller text size
    padding: '4px 10px',   // custom padding
    minWidth: 'auto',      // remove default minWidth
  }}
  startIcon={<EmailIcon sx={{ fontSize: 16 }} />} // smaller icon
  onClick={handleSendEmail}
>
  SEND EMAIL
</Button>


        </Box>
      </Box>

      <Box sx={{ mb: 3, textAlign: "center", p: 2 }}>
        <Typography sx={{ fontSize: "13px" }}>
          Customer Statement for {details?.contact_name || "Customer"}
        </Typography>
        <Typography sx={{ fontSize: "13px" }}>
          {getCurrentDate()} to {getDefaultToDate()}
        </Typography>
      </Box>

      {/* Statement Content */}
      <Paper elevation={4} sx={{ p: 3, pb: 3 ,mb:8}}>
        <Grid container spacing={3}>
          {/* Customer Info (Left Side) */}
          <Grid item xs={12} md={6} sx={{ fontSize: "13px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", fontSize: "13px" }}>
              <Typography variant="body1">To</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "13px" }}>
                {details?.contact_name || "Customer"}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", fontSize: "13px" }}>
                {formatBillingAddress()}
              </Typography>
            </Box>
          </Grid>

          {/* Company Info (Right Side) */}
          <Grid item xs={12} md={6} sx={{ fontSize: "13px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "13px" }}>
                {details?.organization?.org_name || "Company"}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", textAlign: "right", fontSize: "13px" }}>
                {formatOrgAddress()}
              </Typography>
            </Box>
          </Grid>

          {/* Statement Title */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography gutterBottom sx={{ fontSize: "16px", display: "inline-block", fontWeight: "bold" }}>
                Statement of Accounts
              </Typography>
              <br />
              <Typography gutterBottom sx={{ display: "inline-block", borderTop: "1px solid black", borderBottom: "1px solid black", padding: "5px 0px", mt: 1, fontSize: "13px" }}>
                {getCurrentDate()} to {getDefaultToDate()}
              </Typography>
            </Box>
          </Grid>

          {/* Account Summary */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Box elevation={1} sx={{ padding: "0px 5px", width: "350px" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, bgcolor: "#f0f0f0", padding: "4px 0px" }}>
                  Account Summary
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1, fontSize: "12px" }}>
                  <Typography variant="body2" sx={{ fontSize: "12px" }}>Opening Balance</Typography>
                  <Typography variant="body2">{accountSummary.openingBalance}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: "12px" }}>Billed Amount</Typography>
                  <Typography variant="body2">{accountSummary.billedAmount}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: "12px" }}>Amount Paid</Typography>
                  <Typography variant="body2">{accountSummary.amountPaid}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, pt: 1, borderTop: "1px solid #aaa" }}>
                  <Typography variant="body2" sx={{ fontSize: "12px" }}>Balance Due</Typography>
                  <Typography variant="body2">{accountSummary.balanceDue}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Transactions Table */}
          <Grid item xs={12}>
            <TableContainer sx={{ mt: 3 }}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead sx={{ backgroundColor: "#3C3D3A !important" }}>
                  <TableRow sx={{ backgroundColor: "#3C3D3A" }}>
                    <TableCell sx={{ color: "white !important", fontWeight: "bold", backgroundColor: "#3C3D3A !important" }}>Date</TableCell>
                    <TableCell sx={{ color: "white !important", fontWeight: "bold", backgroundColor: "#3C3D3A !important" }}>Transaction Type</TableCell>
                    <TableCell sx={{ color: "white !important", fontWeight: "bold", backgroundColor: "#3C3D3A !important" }}>Details</TableCell>
                    <TableCell align="right" sx={{ color: "white !important", fontWeight: "bold", backgroundColor: "#3C3D3A !important" }}>Amount</TableCell>
                    <TableCell align="right" sx={{ color: "white !important", fontWeight: "bold", backgroundColor: "#3C3D3A !important" }}>Payments</TableCell>
                    <TableCell align="right" sx={{ color: "white !important", fontWeight: "bold", backgroundColor: "#3C3D3A !important" }}>Balance</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell>{openingBalanceTransaction.date}</TableCell>
                    <TableCell>{openingBalanceTransaction.transactionType}</TableCell>
                    <TableCell>{openingBalanceTransaction.details}</TableCell>
                    <TableCell align="right">{openingBalanceTransaction.amount}</TableCell>
                    <TableCell align="right">{openingBalanceTransaction.payments}</TableCell>
                    <TableCell align="right">{openingBalanceTransaction.balance}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Balance Due at Bottom */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 1 }}>
              <Box sx={{ width: "250px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "12px" }}>Balance Due</Typography>
                  <Typography variant="body1" sx={{ fontSize: "12px" }}>{accountSummary.balanceDue}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
 
  );
};

export default HomePage;
