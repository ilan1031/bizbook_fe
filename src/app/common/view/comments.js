import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, Typography, Divider, Button, CircularProgress, Avatar } from "@mui/material";
import { usePathname } from "next/navigation";
import apiService from "../../../../src/services/axiosService"; // Adjust path as needed

const Comments = ({details}) => {
  const editorRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const pathname = usePathname();
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendorId, setVendorId] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const commandedname = details.contact_name;

  // Extract vendor_id from pathname and set state
  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      if (pathParts.length >= 4) {
        const id = pathParts[3];
        setVendorId(id);
        console.log("Vendor ID set:", id);
        
        // Fetch comments when we have the vendorId
        if (id) {
          fetchComments(id);
        }
      }
    }
  }, [pathname]);

  // Function to fetch comments
  const fetchComments = async (id) => {
    setIsLoading(true);
    try {
      const organizationId = localStorage.getItem("organization_id");
      
      if (!organizationId) {
        console.error("Organization ID not found in localStorage");
        return;
      }
      
      console.log(`Fetching comments for vendor_id: ${id}, org_id: ${organizationId}`);
      
      const response = await apiService({
        method: "GET",
        url: `/api/v1/vendors/comments?contact_id=${id}&organization_id=${organizationId}`
      });
      
      console.log("Comments API response:", response.data);
      
      if (response.data?.status === true) {
        const fetchedComments = response.data.data || [];
        console.log("Fetched comments count:", fetchedComments.length);
        console.log("Fetched comments:", fetchedComments);
        setComments(fetchedComments);
      } else {
        console.error("Failed to fetch comments:", response.data);
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to apply formatting and update state
  const handleFormat = (command, stateSetter) => {
    document.execCommand(command, false, null);
    stateSetter((prev) => !prev); // Toggle active state for button highlight
  };

  // Function to check if content is empty
  const handleInput = () => {
    const content = editorRef.current.innerText.trim();
    setIsEmpty(content === "");
  };

  const handleAddComment = async () => {
    const description = editorRef.current.innerHTML;
    
    // Don't proceed if content is empty or vendorId is not set
    if (isEmpty || !vendorId) {
      if (!vendorId) {
        console.error("Vendor ID not available");
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get organization ID from localStorage
      const organizationId = localStorage.getItem("organization_id");
      
      if (!organizationId) {
        console.error("Organization ID not found in localStorage");
        return;
      }
      
      // Create new comment object with timestamp
      const newComment = {
        description: description,
        commented_by_id: vendorId,
        commented_by: commandedname,
        date: new Date().toISOString(), // Add current timestamp
      };

      // Combine existing comments with the new comment
      const updatedComments = [...comments, newComment];
      
      // Send all comments (existing + new) to the backend
      const commentData = {
        comments: updatedComments
      };

      console.log("Existing comments count:", comments.length);
      console.log("New comment:", newComment);
      console.log("Updated comments count:", updatedComments.length);
      console.log("Sending comment with data:", commentData);
      
      // Try to add comment using a more specific endpoint first
      let response;
      try {
        // First, try to use a dedicated comment endpoint if it exists
        response = await apiService({
          method: "POST", 
          url: `/api/v1/vendors/comments?contact_id=${vendorId}&organization_id=${organizationId}`,
          data: newComment
        });
      } catch (error) {
        console.log("Dedicated comment endpoint failed, trying PUT method...");
        // Fallback to the original PUT method
        response = await apiService({
          method: "PUT", 
          url: `/api/v1/contact?contact_id=${vendorId}&organization_id=${organizationId}`,
          data: commentData
        });
      }
      
      // Check if the request was successful
      if (response.status === 200 || response.data?.status === true) {
        console.log("Comment added successfully");
        
        // Clear editor
        editorRef.current.innerHTML = ""; 
        
        // Reset button states
        setIsEmpty(true); 
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
        
        // Refresh comments
        fetchComments(vendorId);

      } else {
        console.error("Failed to add comment:", response.data);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deselect formatting buttons on mouse up
  useEffect(() => {
    const handleSelectionChange = () => {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
      setIsUnderline(document.queryCommandState("underline"));
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to format the comment date
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    
    const date = new Date(dateTimeString);
    
    // Format time (extracting only the time part)
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const timeString = `${formattedHours}:${minutes} ${ampm}`;
    
    // Format date in MM/DD/YYYY format
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const dateString = `${month}/${day}/${year}`;
    
    return { date: dateString, time: timeString };
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "#F8F9FC",
            borderRadius: "8px",
            borderColor: "#E0E0E0",
          }}
        >
          {/* Formatting Buttons */}
          <Box sx={{ mb: 1 }}>
            <Button
              size="small"
              variant={isBold ? "contained" : "text"}
              color={isBold ? "primary" : "inherit"}
              sx={{ minWidth: "30px", p: 0.5, mr: 0.5, fontWeight: "bold" }}
              onClick={() => handleFormat("bold", setIsBold)}
            >
              B
            </Button>
            <Button
              size="small"
              variant={isItalic ? "contained" : "text"}
              color={isItalic ? "primary" : "inherit"}
              sx={{ minWidth: "30px", p: 0.5, mr: 0.5, fontStyle: "italic" }}
              onClick={() => handleFormat("italic", setIsItalic)}
            >
              I
            </Button>
            <Button
              size="small"
              variant={isUnderline ? "contained" : "text"}
              color={isUnderline ? "primary" : "inherit"}
              sx={{ minWidth: "30px", p: 0.5, textDecoration: "underline" }}
              onClick={() => handleFormat("underline", setIsUnderline)}
            >
              U
            </Button>
          </Box>

          {/* Editable Comment Box */}
          <Box
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning={true}
            onInput={handleInput}
            sx={{
              minHeight: "100px",
              border: "1px solid #E0E0E0",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "14px",
              backgroundColor: "#fff",
              mb: 2,
              overflowY: "auto",
            }}
          ></Box>

          <Divider sx={{ mb: 2 }} />

          {/* Add Comment Button */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 1,
              fontSize: "13px",
              px: 2,
              py: 0.5,
              textTransform: "none",
              bgcolor: isEmpty ? "#fff" : "#408dfb",
              color: isEmpty ? "#9E9E9E" : "#fff",
              "&:hover": {
                bgcolor: isEmpty ? "#F1F1F1" : "#408dfb",
              },
            }}
            disabled={isEmpty || isSubmitting || !vendorId}
            onClick={handleAddComment}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                Sending...
              </>
            ) : (
              "Add Comment"
            )}
          </Button>
        </Paper>
      </Box>

      {/* Comments Section */}
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1,
          fontSize: "14px",
          fontWeight: 600,
          color: "#344767",
          textTransform: "uppercase",
        }}
      >
        All Comments
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : comments.length > 0 ? (
        <Box>
          {comments.map((comment) => {
            // Parse and format the date and time
            const formattedDateTime = formatDateTime(comment.date);
            
            return (
              <Box key={comment.comment_id} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: "#1976d2",
                      fontSize: "14px",
                      mr: 1.5
                    }}
                  >
                    {getInitials(comment.commented_by)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                        {comment.commented_by || "Unknown User"}
                      </Typography>
                      <Typography sx={{ color: "#757575", fontSize: "12px" }}>
                        {formattedDateTime.date} {formattedDateTime.time}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: "#f5f7fa", 
                        borderRadius: "8px",
                        fontSize: "14px",
                        "& a": { color: "#1976d2", textDecoration: "none" }
                      }}
                      dangerouslySetInnerHTML={{ __html: comment.description }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 4,
            color: "#757575",
          }}
        >
          <Typography sx={{ fontSize: "14px" }}>
            No comments yet.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Comments;