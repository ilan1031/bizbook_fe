"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Container,
  Fab,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { parse, isValid, format } from 'date-fns';
import apiService from "../../../src/services/axiosService";
import config from "../../../src/services/config";

const theme = createTheme({
  palette: {
    primary: { main: '#10b981', dark: '#059669', light: '#34d399' },
    secondary: { main: '#0f766e' },
    background: { default: '#f8fafc' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } } },
  },
});

const TableDisplay = ({ tableData }) => {
  if (!tableData || !tableData.isTable) return null;
  
  // Function to convert table data to CSV format
  const convertToCSV = () => {
    // Convert headers to CSV row
    const headerRow = tableData.headers.join(',');
    
    // Convert each data row to CSV
    const csvRows = tableData.rows.map(row => 
      row.map(cell => {
        // Handle cells that contain commas by wrapping them in quotes
        if (String(cell).includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    );
    
    // Combine headers and rows
    return [headerRow, ...csvRows].join('\n');
  };
  
  // Function to download CSV
  const downloadCSV = () => {
    const csv = convertToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'table-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Display the actual number of records that match the date filter
  const recordCount = tableData.rows.length;
  
  // If there are more than 5 entries, only show the download button
  if (recordCount > 5) {
    return (
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, border: '1px dashed rgba(224, 224, 224, 1)', borderRadius: '4px' }}>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {recordCount} customer records available
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{backgroundColor: "#408dfb", color:"white"}}
          onClick={downloadCSV}
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" color='white' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          }
        >
          Download CSV
        </Button>
      </Box>
    );
  }
  
  // Otherwise, show the table with a download icon
  return (
    <Box sx={{ my: 2, overflow: 'auto', maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {recordCount} {recordCount === 1 ? 'record' : 'records'} found
        </Typography>
        <IconButton 
          size="small" 
          onClick={downloadCSV} 
          color="primary"
          sx={{ 
            ml: 1, 
            '&:hover': { 
              backgroundColor: 'rgba(16, 185, 129, 0.1)' 
            } 
          }}
          aria-label="Download CSV"
          title="Download as CSV"
        >
          <svg xmlns="http://www.w3.org/2000/svg" color='#408dfb' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </IconButton>
      </Box>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        border: '1px solid rgba(224, 224, 224, 1)',
        borderRadius: '4px',
      }}>
        <thead>
          <tr>
            {tableData.headers.map((header, index) => (
              <th key={index} style={{ 
                padding: '8px 16px',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                textAlign: 'left',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ 
                  padding: '8px 16px',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  textAlign: 'left'
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};
export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: "Hello! I'm your SNS Finance assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [options, setOptions] = useState(["General Invoice Summary", "Specific invoice details", "Others"]);
  const [conversationState, setConversationState] = useState('default');
  const [selectedDate, setSelectedDate] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  };

  const convertToApiDateFormat = (dateStr) => {
    try {
      // Handle case where dateStr is already a Date object
      if (dateStr instanceof Date) {
        return format(dateStr, 'yyyy-MM-dd');
      }
      
      // Normalize the date string format
      const normalizedDate = dateStr.replace(/(\d{1,2}),(\d{4})/, '$1, $2');
      const parsedDate = parse(normalizedDate, 'MMMM dd, yyyy', new Date());
      if (!isValid(parsedDate)) {
        console.error(`Invalid date string: ${dateStr}`);
        return null;
      }
      return format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error(`Error converting date ${dateStr}:`, error);
      return null;
    }
  };
  
  const sendMessage = (content, role = 'user', tableData = null) => {
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      tableData: tableData
    }]);
  };

  // Process invoice questions using the API
  const askInvoiceQuestion = async (question) => {
    try {
      setIsTyping(true);
      const token = localStorage.getItem('token');
      if (!token) {
        sendMessage("Please log in to access this feature.", 'assistant');
        setIsTyping(false);
        return;
      }

      const response = await apiService({
        method: 'POST',
        url: '/api/v1/ask',
        customBaseUrl: config.SO_Base_url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: { question },
      });

      console.log("API response for invoice question:", response.data);
      if (response.data.answer) {
        sendMessage(response.data.answer, 'assistant', response.data.tableData || null);
      } else {
        sendMessage("I couldn't find information about that. Please try a different question or contact support.", 'assistant');
      }
    } catch (error) {
      console.error("Error asking invoice question:", error);
      sendMessage("Sorry, I encountered an error while processing your question. Please try again later.", 'assistant');
    } finally {
      setIsTyping(false);
      // Show options again after providing an answer
      setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
      setShowOptions(true);
      setConversationState('default');
    }
  };

  const fetchSummary = async (date) => {
    try {
      setIsTyping(true);
      const token = localStorage.getItem('token');
      if (!token) {
        sendMessage("Please log in to access this feature.", 'assistant');
        setIsTyping(false);
        return;
      }
  
      let question;
      let displayDate;
      let apiDate = null;
  
      if (date === "All") {
        question = "Summarize all invoice data with total count and amounts";
        displayDate = "all dates";
      } else {
        apiDate = convertToApiDateFormat(date);
        if (!apiDate) {
          sendMessage("Invalid date format. Please try again.", 'assistant');
          setIsTyping(false);
          setConversationState('awaiting-retry-date');
          setOptions(["Yes", "No"]);
          setShowOptions(true);
          return;
        }
        displayDate = typeof date === 'string' ? date : formatDate(date);
        question = `Summarize invoice data for ${displayDate}`;
      }
  
      setSelectedDate(displayDate);
      
      const response = await apiService({
        method: 'POST',
        url: '/api/v1/ask',
        customBaseUrl: config.SO_Base_url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: { 
          question,
          dateFilter: apiDate // Added dateFilter parameter
        },
      });
  
      // Rest of the function remains the same...
      console.log("API response from /api/v1/ask:", response.data);
      const { answer } = response.data;
      
      if (answer) {
        sendMessage(`Invoice summary for ${displayDate}:\n${answer}`, 'assistant', response.data.tableData || null);
        sendMessage("What would you like to see next?", 'assistant');
        setOptions(["Invoice Lists"]);
        setShowOptions(true);
        setConversationState('awaiting-post-summary-choice');
      } else {
        // ... rest of the existing code
      }
    } catch (error) {
      // ... existing error handling
    } finally {
      setIsTyping(false);
    }
  };

  // Improved fetchCustomerNames function
  // Improved fetchCustomerNames function
// Modify the fetchCustomerNames function to respect the selected date
const fetchCustomerNames = async () => {
  try {
    setIsTyping(true);
    const token = localStorage.getItem('token');
    if (!token) {
      sendMessage("Please log in to access this feature.", 'assistant');
      setIsTyping(false);
      return;
    }

    // Enhance the query to respect current date context if available
    let question;
    if (selectedDate) {
      // If a date is selected, only get customers from that date
      question = `List unique customer names from invoices for ${selectedDate}`;
    } else {
      // Otherwise get all customers
      question = "List all unique customer names from invoices";
    }
    
    console.log("Sending question to API for customer names:", question);

    const response = await apiService({
      method: 'POST',
      url: '/api/v1/ask',
      customBaseUrl: config.SO_Base_url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: { 
        question,
        // Include the date filter if available
        ...(selectedDate && { dateFilter: convertToApiDateFormat(selectedDate) })
      },
    });

    console.log("API response for customer names:", response.data);
    let answer = response.data.answer;
    let customerNames = [];

    // Parse the response to extract customer names
    if (answer) {
      if (typeof answer === 'string') {
        try {
          // First try to parse as JSON
          const jsonData = JSON.parse(answer);
          if (Array.isArray(jsonData)) {
            customerNames = jsonData.map(item => {
              // Try different possible property names
              return item.customerName || item.customer_name || item.name || item;
            }).filter(Boolean);
          } else {
            // If it's not an array, split by common separators
            customerNames = answer.split(/,|\n|;/).map(name => name.trim()).filter(name => name);
          }
        } catch (e) {
          // Not valid JSON, split by common separators
          customerNames = answer.split(/,|\n|;/).map(name => name.trim()).filter(name => name);
        }
      } else if (Array.isArray(answer)) {
        // Direct array response
        customerNames = answer.map(item => {
          if (typeof item === 'object') {
            return item.customerName || item.customer_name || item.name || JSON.stringify(item);
          }
          return item;
        }).filter(Boolean);
      } else if (typeof answer === 'object') {
        // Single object response
        const name = answer.customerName || answer.customer_name || answer.name;
        if (name) customerNames.push(name);
      }
    }

    // Remove duplicates and display the result
    const uniqueNames = [...new Set(customerNames)];
    
    if (uniqueNames.length > 0) {
      // Create a table data structure with only customer names
      const tableData = {
        isTable: true,
        headers: ["Customer Name"],
        rows: uniqueNames.map(name => [name])
      };
      
      const messagePrefix = selectedDate 
        ? `Customer Names List for ${selectedDate} (${uniqueNames.length} customers found):`
        : `Customer Names List (${uniqueNames.length} customers found):`;
      
      sendMessage(messagePrefix, 'assistant', tableData);
    } else {
      const messagePrefix = selectedDate 
        ? `No customer names found for ${selectedDate}.`
        : "No customer names found.";
        
      sendMessage(
        `${messagePrefix} Please try a different query or contact support.`,
        'assistant'
      );
    }

    // Provide next options
    sendMessage("What would you like to do next?", 'assistant');
    setOptions(["Return to main menu"]);
    setShowOptions(true);
    setConversationState('awaiting-return-choice');
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    sendMessage(
      `Error fetching customer names: ${error.response?.data?.error || "Please try again."}`,
      'assistant'
    );
    // After error, provide options
    setOptions(["Return to main menu"]);
    setShowOptions(true);
    setConversationState('awaiting-return-choice');
  } finally {
    setIsTyping(false);
  }
};
// Add this function to fetch invoice lists respecting date filters
// Add this function to fetch invoice lists respecting date filters
const fetchInvoicesList = async () => {
  try {
    setIsTyping(true);
    const token = localStorage.getItem('token');
    if (!token) {
      sendMessage("Please log in to access this feature.", 'assistant');
      setIsTyping(false);
      return;
    }

    // Create appropriate question based on date context
    let question;
    let apiDateFilter = null;
    
    if (selectedDate && selectedDate !== "all dates") {
      // Convert the selected date to API format
      apiDateFilter = convertToApiDateFormat(selectedDate);
      if (!apiDateFilter) {
        console.error("Invalid date format for filtering:", selectedDate);
        sendMessage("There was an issue with the date filter. Showing all invoices instead.", 'assistant');
      } else {
        console.log("Filtering invoices by date:", selectedDate, "API format:", apiDateFilter);
        question = `List all invoices for ${selectedDate} with invoice number, customer name, amount, and status`;
      }
    } else {
      question = "List all invoices with invoice number, customer name, amount, and status";
    }

    console.log("Sending question to API:", question, "With date filter:", apiDateFilter);

    const response = await apiService({
      method: 'POST',
      url: '/api/v1/ask',
      customBaseUrl: config.SO_Base_url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: { 
        question,
        dateFilter: apiDateFilter // Make sure this is properly passed
      },
    });

    console.log("API response for invoice list:", response.data);
    
    // Process the response
    if (response.data.tableData) {
      // If the API already sent a formatted table, use it directly
      const message = (selectedDate && selectedDate !== "all dates")
        ? `Invoice list for ${selectedDate}:` 
        : "Complete invoice list:";
      
      sendMessage(message, 'assistant', response.data.tableData);
    } else if (response.data.answer) {
      // Try to format the answer into a table
      let invoiceData = [];
      try {
        // First try to parse as JSON if it's a string
        if (typeof response.data.answer === 'string') {
          try {
            invoiceData = JSON.parse(response.data.answer);
          } catch (e) {
            // If it's not valid JSON, split by lines and try to parse each line
            invoiceData = response.data.answer.split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .map(line => {
                // Try to extract invoice data from the line
                const invoiceMatch = line.match(/invoice(?:Number|_number|#)?\s*[=:]\s*["']?([^"',\s]+)["']?/i);
                const customerMatch = line.match(/customer(?:Name|_name)?\s*[=:]\s*["']?([^"']+?)["']?(?:,|\s+\w+\s*[=:])/i);
                const amountMatch = line.match(/amount\s*[=:]\s*["']?(\d+(?:\.\d+)?)["']?/i);
                const statusMatch = line.match(/status\s*[=:]\s*["']?([^"',\s]+)["']?/i);
                
                return {
                  invoiceNumber: invoiceMatch ? invoiceMatch[1] : "Unknown",
                  customerName: customerMatch ? customerMatch[1].trim() : "Unknown",
                  amount: amountMatch ? parseFloat(amountMatch[1]) : 0,
                  status: statusMatch ? statusMatch[1] : "Unknown"
                };
              });
          }
        } else if (Array.isArray(response.data.answer)) {
          // If it's already an array, use it directly
          invoiceData = response.data.answer;
        }
        
        // Convert to table format
        if (Array.isArray(invoiceData) && invoiceData.length > 0) {
          const tableData = {
            isTable: true,
            headers: ["Invoice Number", "Customer Name", "Amount", "Status"],
            rows: invoiceData.map(inv => [
              inv.invoiceNumber || inv.invoice_number || inv.InvoiceNumber || "N/A",
              inv.customerName || inv.customer_name || inv.CustomerName || "N/A",
              typeof inv.amount === 'number' ? `$${inv.amount.toFixed(2)}` : (inv.amount || "N/A"),
              inv.status || inv.Status || "N/A"
            ])
          };
          
          const message = (selectedDate && selectedDate !== "all dates")
            ? `Invoice list for ${selectedDate} (${invoiceData.length} invoices):` 
            : `Complete invoice list (${invoiceData.length} invoices):`;
          
          sendMessage(message, 'assistant', tableData);
        } else {
          const message = (selectedDate && selectedDate !== "all dates")
            ? `No invoices found for ${selectedDate}.` 
            : "No invoices found.";
          
          sendMessage(message, 'assistant');
        }
      } catch (parseError) {
        console.error("Error parsing invoice data:", parseError);
        // Fallback to just showing the text response
        sendMessage(response.data.answer, 'assistant');
      }
    } else {
      const message = (selectedDate && selectedDate !== "all dates")
        ? `No invoices found for ${selectedDate}.` 
        : "No invoices found.";
      
      sendMessage(message, 'assistant');
    }

    // After showing results, provide options to continue
    sendMessage("What would you like to do next?", 'assistant');
    setOptions(["Return to main menu"]);
    setShowOptions(true);
    setConversationState('awaiting-return-choice');
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    sendMessage(
      `Error fetching invoice list: ${error.response?.data?.error || "Please try again."}`,
      'assistant'
    );
    // After error, provide options
    setOptions(["Return to main menu"]);
    setShowOptions(true);
    setConversationState('awaiting-return-choice');
  } finally {
    setIsTyping(false);
  }
};

const fetchPendingInvoices = async () => {
  try {
    setIsTyping(true);
    const token = localStorage.getItem('token');
    if (!token) {
      sendMessage("Please log in to access this feature.", 'assistant');
      setIsTyping(false);
      return;
    }

    // Modified query to be more explicit
    const question = "List all invoices with status containing 'pending', 'Pending', 'draft', or 'Draft', and show their invoice numbers and status values";
    
    const response = await apiService({
      method: 'POST',
      url: '/api/v1/ask',
      customBaseUrl: config.SO_Base_url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: { question },
    });

    console.log("API response for pending/draft invoices:", response.data);
    let answer = response.data.answer;
    let pendingInvoices = [];

    // Enhanced parsing logic
    if (answer) {
      if (typeof answer === 'string') {
        try {
          // First try to parse as JSON
          const jsonData = JSON.parse(answer);
          if (Array.isArray(jsonData)) {
            pendingInvoices = jsonData.filter(item => {
              const status = ((item.status || item.Status || "") + "").toLowerCase();
              return status.includes("pending") || status.includes("draft");
            }).map(item => ({
              invoiceNumber: item.invoiceNumber || item.invoice_number || item.InvoiceNumber || "N/A",
              status: item.status || item.Status || "Unknown"
            }));
          }
        } catch (e) {
          // Not valid JSON, try to extract from text
          const lines = answer.split('\n').filter(line => line.trim());
          pendingInvoices = lines.map(line => {
            // Try to extract invoice number and status from line
            const invoiceMatch = line.match(/invoice(?:Number|_number|number|#)?\s*[=:]\s*["']?([^"',\s]+)["']?/i);
            const statusMatch = line.match(/status\s*[=:]\s*["']?([^"',\s]+)["']?/i);
            
            return {
              invoiceNumber: invoiceMatch ? invoiceMatch[1] : "Unknown",
              status: statusMatch ? statusMatch[1] : "Unknown"
            };
          }).filter(item => {
            const status = item.status.toLowerCase();
            return status.includes("pending") || status.includes("draft");
          });
        }
      } else if (Array.isArray(answer)) {
        // Process array response
        pendingInvoices = answer.filter(item => {
          const status = ((item.status || item.Status || "") + "").toLowerCase();
          return status.includes("pending") || status.includes("draft");
        }).map(item => ({
          invoiceNumber: item.invoiceNumber || item.invoice_number || item.InvoiceNumber || "N/A",
          status: item.status || item.Status || "Unknown"
        }));
      }
    }

    // Display results or try fallback
    if (pendingInvoices.length > 0) {
      const tableData = {
        isTable: true,
        headers: ["Invoice Number", "Status"],
        rows: pendingInvoices.map(inv => [inv.invoiceNumber, inv.status])
      };
      
      sendMessage(
        `Found ${pendingInvoices.length} invoices with Pending or Draft status:`, 
        'assistant',
        tableData
      );
    } else {
      // Make a direct API call as fallback
      try {
        const directResponse = await apiService({
          method: 'GET',
          url: '/api/v1/invoices',
          customBaseUrl: config.SO_Base_url,
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const invoices = directResponse.data?.invoices || [];
        const filteredInvoices = invoices.filter(inv => {
          const status = ((inv.status || inv.Status || "") + "").toLowerCase();
          return status.includes("pending") || status.includes("draft");
        });
        
        if (filteredInvoices.length > 0) {
          const tableData = {
            isTable: true,
            headers: ["Invoice Number", "Status"],
            rows: filteredInvoices.map(inv => [
              inv.invoice_number || inv.invoiceNumber || inv.InvoiceNumber || "N/A",
              inv.status || inv.Status || "N/A"
            ])
          };
          
          sendMessage(
            `Found ${filteredInvoices.length} invoices with Pending or Draft status:`, 
            'assistant',
            tableData
          );
        } else {
          sendMessage("No pending or draft invoices found in the system.", 'assistant');
        }
      } catch (directError) {
        console.error("Direct API error:", directError);
        sendMessage("No pending or draft invoices detected.", 'assistant');
      }
    }

    // Return to main menu after showing results
    setConversationState('default');
    setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
    setShowOptions(true);
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    sendMessage(
      `Error fetching pending invoices: ${error.response?.data?.error || "Please try again."}`,
      'assistant'
    );
    setConversationState('default');
    setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
    setShowOptions(true);
  } finally {
    setIsTyping(false);
  }
};

  const isValidDate = (dateStr) => {
    const regex = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}, ?\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const normalizedDate = dateStr.replace(/(\d{1,2}),(\d{4})/, '$1, $2');
    const parsedDate = parse(normalizedDate, 'MMMM dd, yyyy', new Date());
    return isValid(parsedDate);
  };

  const handleSubmit = async (e, customInput) => {
    e?.preventDefault?.();
    const currentInput = customInput || input.trim();
    if (!currentInput) return;

    sendMessage(currentInput, 'user');
    setInput('');
    setIsTyping(true);
    setShowOptions(false);

    // Check for general greeting patterns
    if (["hi", "hello", "hey"].includes(currentInput.toLowerCase())) {
      sendMessage("Hi! How can I assist you today? Please choose an option below:", 'assistant');
      setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
      setShowOptions(true);
      setIsTyping(false);
      return;
    }

    // Handle "Return to main menu" option which can appear in various states
    if (currentInput === "Return to main menu") {
      sendMessage("Returning to main menu.", 'assistant');
      setConversationState('default');
      setSelectedDate(null);
      setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
      setShowOptions(true);
      setIsTyping(false);
      return;
    }

    // Handle main menu options
    if (conversationState === 'default') {
      if (currentInput === "General Invoice Summary") {
        sendMessage("Please select the date range:", 'assistant');
        setOptions(["Today", "Other"]);
        setShowOptions(true);
        setConversationState('awaiting-date-range');
        setIsTyping(false);
        return;
      }

      if (currentInput === "Specific invoice details") {
        sendMessage("What would you like to know?", 'assistant');
        setOptions(["Customer Name lists", "Invoice pending lists"]);
        setShowOptions(true);
        setConversationState('awaiting-about-details');
        setIsTyping(false);
        return;
      }

      if (currentInput === "Others") {
        sendMessage("What would you like to know?", 'assistant');
        setOptions(["Return to main menu"]);
        setShowOptions(false); // Set this to false to enable the text input
        setConversationState('awaiting-others-selection');
        setIsTyping(false);
        return;
      }
    }
    
    // Handle Others category selections
    if (conversationState === 'awaiting-others-selection') {
      if (currentInput === "Return to main menu") {
        sendMessage("Returning to main menu.", 'assistant');
        setConversationState('default');
        setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
        setShowOptions(true);
        setIsTyping(false);
        return;
      } else {
        // Process the selected question directly through the backend
        await askInvoiceQuestion(currentInput);
        return;
      }
    }
    
    // Handle date range selection
    if (conversationState === 'awaiting-date-range') {
      if (currentInput === "Today") {
        const today = new Date();
        const formatted = formatDate(today);
        setSelectedDate(formatted);
        await fetchSummary(today);
        return;
      } else if (currentInput === "Other") {
        sendMessage("Please enter the date in MMMM dd, yyyy format (e.g., January 01, 2025).", 'assistant');
        setConversationState('awaiting-custom-date');
        setIsTyping(false);
        return;
      }
    }

    // Handle custom date input
    if (conversationState === 'awaiting-custom-date') {
      const normalizedInput = currentInput.replace(/(\d{1,2}),(\d{4})/, '$1, $2');
      if (!isValidDate(normalizedInput)) {
        sendMessage("Invalid date format. Please use MMMM dd, yyyy (e.g., January 01, 2025).", 'assistant');
        setIsTyping(false);
        return;
      }
      const apiDate = convertToApiDateFormat(normalizedInput);
      if (!apiDate) {
        sendMessage("Invalid date. Please ensure the date is valid (e.g., January 01, 2025).", 'assistant');
        setIsTyping(false);
        return;
      }
      setSelectedDate(normalizedInput);
      await fetchSummary(normalizedInput);
      return;
    }

    // Handle specific detail selection for invoices
    if (conversationState === 'awaiting-summary-details') {
      const detailOptions = [
        "status",
        "createdAt",
        "dueDate",
        "taxTotal",
        "invoiceNumber",
        "referenceNumber",
        "shippingAddress",
        "billingAddress"
      ];
      
      if (detailOptions.includes(currentInput)) {
        await fetchDetail(currentInput, selectedDate);
        // Keep the state as 'awaiting-summary-details' to allow for more detail selections
        // The fetchDetail function will update the options to show remaining details
        return;
      }
      
      // If we're here, it wasn't a recognized detail option
      if (currentInput === "Return to main menu") {
        sendMessage("Returning to main menu.", 'assistant');
        setConversationState('default');
        setSelectedDate(null);
        setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
        setShowOptions(true);
        setIsTyping(false);
        return;
      }
    }
    
    // Handle Others category selections
    if (conversationState === 'awaiting-others-selection') {
      if (currentInput === "Return to main menu") {
        sendMessage("Returning to main menu.", 'assistant');
        setConversationState('default');
        setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
        setShowOptions(true);
        setIsTyping(false);
        return;
      } else {
        // Process the selected question directly through the backend
        await askInvoiceQuestion(currentInput);
        return;
      }
    }
    
    // Handle date range selection
    if (conversationState === 'awaiting-date-range') {
      if (currentInput === "Today") {
        const today = new Date();
        const formatted = formatDate(today);
        setSelectedDate(formatted);
        await fetchSummary(today);
        return;
      } else if (currentInput === "Other") {
        sendMessage("Please enter the date in MMMM dd, yyyy format (e.g., January 01, 2025).", 'assistant');
        setConversationState('awaiting-custom-date');
        setIsTyping(false);
        return;
      }
    }

    // Handle custom date input
    if (conversationState === 'awaiting-custom-date') {
      const normalizedInput = currentInput.replace(/(\d{1,2}),(\d{4})/, '$1, $2');
      if (!isValidDate(normalizedInput)) {
        sendMessage("Invalid date format. Please use MMMM dd, yyyy (e.g., January 01, 2025).", 'assistant');
        setIsTyping(false);
        return;
      }
      const apiDate = convertToApiDateFormat(normalizedInput);
      if (!apiDate) {
        sendMessage("Invalid date. Please ensure the date is valid (e.g., January 01, 2025).", 'assistant');
        setIsTyping(false);
        return;
      }
      setSelectedDate(normalizedInput);
      await fetchSummary(normalizedInput);
      return;
    }

    // Handle specific detail selection for invoices
    if (conversationState === 'awaiting-summary-details') {
      const detailOptions = [
        "status",
        "createdAt",
        "dueDate",
        "taxTotal",
        "invoiceNumber",
        "referenceNumber",
        "shippingAddress",
        "billingAddress"
      ];
      if (detailOptions.includes(currentInput)) {
        await fetchDetail(currentInput, selectedDate);
        setConversationState('default');
        setSelectedDate(null);
        setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
        setShowOptions(true);
        return;
      }
    }

    // Handle retry date selection
    if (conversationState === 'awaiting-retry-date') {
      if (currentInput === "Yes") {
        sendMessage("Please enter the date in MMMM dd, yyyy format (e.g., January 01, 2025).", 'assistant');
        setConversationState('awaiting-custom-date');
        setIsTyping(false);
        return;
      } else if (currentInput === "No") {
        sendMessage("Returning to main menu.", 'assistant');
        setConversationState('default');
        setSelectedDate(null);
        setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
        setShowOptions(true);
        setIsTyping(false);
        return;
      }
    }

    // Handle specific detail options
   // Handle specific detail options
// Handle specific detail options
if (conversationState === 'awaiting-about-details') {
  if (currentInput === "customer name lists") {
    await fetchCustomerNames();
    // Note: We're now setting conversation state in the fetchCustomerNames function
    return;
  }
  
  if (currentInput === "Invoice pending lists") {
    await fetchPendingInvoices();
    setConversationState('default');
    setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
    setShowOptions(true);
    return;
  }
  
  if (currentInput === "Invoices lists") {
    await fetchInvoicesList();
    setConversationState('default');
    setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
    setShowOptions(true);
    return;
  }
}

if (conversationState === 'awaiting-return-choice') {
  if (currentInput === "Return to main menu") {
    sendMessage("Returning to main menu.", 'assistant');
    setConversationState('default');
    setOptions(["General Invoice Summary", "Specific invoice details", "Others"]);
    setShowOptions(true);
    setIsTyping(false);
    return;
  } else if (currentInput === "General Invoice Summary") {
    sendMessage("Please select the date range:", 'assistant');
    setOptions(["Today", "Other"]);
    setShowOptions(true);
    setConversationState('awaiting-date-range');
    setIsTyping(false);
    return;
  }
}

    // If we get here, we need to handle the question dynamically
    await askInvoiceQuestion(currentInput);
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Card sx={{ width: '100%', height: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ background: '#408dfb', borderTopLeftRadius: theme.shape.borderRadius, borderTopRightRadius: theme.shape.borderRadius, padding: theme.spacing(2), color: 'white' }}>
            <Typography variant="h6" align="center" fontWeight="bold">
              SNS Finance Assistant
            </Typography>
          </Box>

          <CardContent sx={{ p: 0, flexGrow: 1, overflow: 'hidden' }}>
            <Box ref={messagesContainerRef} sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: theme.spacing(2) }}>
              {messages.map((message) => (
                <Box key={message.id} sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                  {message.role === 'assistant' && (
                    <Avatar sx={{ mr: 1, bgcolor: '#408dfb', width: 32, height: 32 }}>
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                  )}

                  <Box sx={{ maxWidth: '80%' }}>
                  <Paper sx={{ padding: theme.spacing(1.5), backgroundColor: message.role === 'user' ? '#408dfb' : 'background.paper', color: message.role === 'user' ? 'white' : 'text.primary', borderRadius: 2, borderTopRightRadius: message.role === 'user' ? 0 : 2, borderTopLeftRadius: message.role === 'assistant' ? 0 : 2 }}>
  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
    {message.content}
  </Typography>
  {message.tableData && <TableDisplay tableData={message.tableData} />}
</Paper>
              
              
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: message.role === 'user' ? 'right' : 'left', color: 'text.secondary' }}>
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>

                  {message.role === 'user' && (
                    <Avatar sx={{ ml: 1, bgcolor: 'grey.700', width: 32, height: 32 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))}

              {showOptions && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  {options.map((option, index) => (
                    <Button key={index} variant="outlined" onClick={(e) => handleSubmit(e, option)} sx={{ textTransform: 'none',borderColor:"#408dfb !important",color:"#408dfb !important" }}>
                      {option}
                    </Button>
                  ))}
                </Box>
              )}
              {isTyping && (
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Avatar sx={{ mr: 1, bgcolor: '#408dfb', width: 32, height: 32 }}>
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                  <Paper sx={{ padding: theme.spacing(1) }}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: theme.spacing(0.5), 
                      '& > div': { 
                        width: 8, 
                        height: 8, 
                        backgroundColor: theme.palette.grey[400], 
                        borderRadius: '50%', 
                        animation: 'bounce 1.4s infinite ease-in-out both' 
                      }, 
                      '@keyframes bounce': { 
                        '0%, 80%, 100%': { transform: 'scale(0)' }, 
                        '40%': { transform: 'scale(1)' } 
                      } 
                    }}>
                      <div></div>
                      <div></div>
                      <div></div>
                    </Box>
                  </Paper>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>
          </CardContent>

          <CardActions sx={{ padding: theme.spacing(1.5), justifyContent: 'space-between' }}>
          <TextField
  variant="outlined"
  fullWidth
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
  placeholder={
    conversationState === 'awaiting-custom-date'
      ? "Enter date (e.g., January 01, 2025)"
      : showOptions
      ? "Please choose an option above"
      : "Type your message..."
  }
  disabled={showOptions && conversationState !== 'awaiting-custom-date'}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor:'#408dfb',
      },
      '&:hover fieldset': {
        borderColor: '#408dfb',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#408dfb',
      },
    },
  }}
/>

            <Fab
              color="primary"
              size="small"
              onClick={handleSubmit}
              disabled={showOptions && conversationState !== 'awaiting-custom-date'}
              sx={{ backgroundColor: '#408dfb', '&:hover': { backgroundColor: '#408dfb' , } }}
            >
              <SendIcon />
            </Fab>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>
  );
}