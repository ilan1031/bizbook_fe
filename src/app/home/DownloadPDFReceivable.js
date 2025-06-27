"use client";

import React from "react";
import { Button, Box } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const DownloadPDF = ({ data = [] }) => {
  const today = new Date().toISOString().split("T")[0];

    const formatCurrency = (amount) => {
    return `${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };


  const handleDownload = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text("Receivables Report", 105, 20, { align: "center" });

      // Prepare table data
      const tableData = data.map((item) => [
        item.contact_name,
        item.invoice_numbers ? item.invoice_numbers.join(",\n") : "",
        item.phone,
        formatCurrency(item.total_invoice_amount),
        formatCurrency(item.amount_received),
      ]);

      // Calculate totals
      const totalBillAmount = data.reduce(
        (sum, item) => sum + (item.total_invoice_amount || 0),
        0
      );
      const totalReceivedAmount = data.reduce(
        (sum, item) => sum + (item.amount_received || 0),
        0
      );

      // Add total row
      tableData.push([
        "Total", 
        "", 
        "", 
        `${formatCurrency(totalBillAmount)}`, 
        `${formatCurrency(totalReceivedAmount)}`
      ]);

      // Create the table using autoTable function
      autoTable(doc, {
        head: [["Contact Name", "Invoices", "Phone Number", "Total Amount", "Amount Received"]],
        body: tableData,
        startY: 30,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        didParseCell: function (data) {
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [236, 240, 241];
          }
        },
      });

      // Save the PDF
      doc.save(`Receivables_Report-${today}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box
        onClick={handleDownload}
        size="small"
        sx={{
          fontSize: "14px",
          color: "#2196f3",
          border: "1px solid #2196f3",
          padding: "2px",
          cursor: "pointer",
          textAlign: "center",
          width: "80px",
          borderRadius: "5px",
          "&:hover": { backgroundColor: "#e3f2fd" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <FileCopyIcon sx={{ fontSize: "18px" }} /> Reports
      </Box>
    </div>
  );
};

export default DownloadPDF;