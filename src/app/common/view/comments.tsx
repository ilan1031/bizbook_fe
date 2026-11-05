import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, Typography, Divider, Button, CircularProgress, Avatar } from "@mui/material";
import { usePathname } from "next/navigation";
import apiService from "../../../../src/services/axiosService"; // Adjust path as needed

// Older comments were saved as HTML from a rich-text box. Show only their
// text: parsing in an inert document runs no scripts and loads nothing.
const commentText = (value) => {
  const raw = String(value ?? "");
  if (!/[<&]/.test(raw) || typeof DOMParser === "undefined") return raw;
  const doc = new DOMParser().parseFromString(raw.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(div|p)>/gi, "\n"), "text/html");
  return (doc.body.textContent || "").trim();
};

const Comments = ({details}: any) => {
  const editorRef = useRef<any>(null);
  const pathname = usePathname()!;
  const [error, setError] = useState<any>("");
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [vendorId, setVendorId] = useState<any>(null);
  const [comments, setComments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  // Extract vendor_id from pathname and set state
  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      if (pathParts.length >= 4) {
        const id = pathParts[3];
        setVendorId(id);
        
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
      
      
      const response = await apiService({
        method: "GET",
        url: `/api/v1/vendors/comments?contact_id=${id}&organization_id=${organizationId}`
      });
      
      
      if (response.data?.status === true) {
        const fetchedComments = response.data.data || [];
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


  // Function to check if content is empty
  const handleInput = () => {
    const content = editorRef.current.innerText.trim();
    setIsEmpty(content === "");
  };

  const handleAddComment = async () => {
    // Comments are plain text: what was typed, never markup.
    const description = (editorRef.current?.innerText || "").trim();

    if (!description || !vendorId) return;

    setIsSubmitting(true);
    setError("");
    try {
      const organizationId = localStorage.getItem("organization_id");
      if (!organizationId) {
        setError("Choose an organisation first.");
        return;
      }
      // One comment is added on the server; the others are left alone.
      await apiService({
        method: "POST",
        url: `/api/v1/contact/comments?contact_id=${encodeURIComponent(vendorId)}&organization_id=${organizationId}`,
        data: { description },
      });
      editorRef.current.innerText = "";
      setIsEmpty(true);
      fetchComments(vendorId);
    } catch (err) {
      setError(err?.message || "Couldn't add the comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              overflowY: "auto" as const,
            }}
          ></Box>

          {error && (
            <Typography role="alert" sx={{ color: "#d32f2f", fontSize: "13px", mb: 1 }}>
              {error}
            </Typography>
          )}
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
              textTransform: "none" as const,
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
          textTransform: "uppercase" as const,
        }}
      >
        All Comments
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {isLoading ? (
        <Box sx={{ display: "flex" as const, justifyContent: "center" as const, p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : comments.length > 0 ? (
        <Box>
          {comments.map((comment) => {
            // Parse and format the date and time
            const formattedDateTime = formatDateTime(comment.date);
            
            return (
              <Box key={comment.comment_id || comment._id || comment.date} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex" as const, alignItems: "flex-start" as const }}>
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
                    <Box sx={{ display: "flex" as const, justifyContent: "space-between" as const, mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                        {comment.commented_by || "Unknown User"}
                      </Typography>
                      <Typography sx={{ color: "#757575", fontSize: "12px" }}>
                        {(formattedDateTime as any).date} {(formattedDateTime as any).time}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: "#f5f7fa", 
                        borderRadius: "8px",
                        fontSize: "14px",
                        whiteSpace: "pre-wrap" as const,
                        wordBreak: "break-word" as const,
                        "& a": { color: "#1976d2", textDecoration: "none" as const }
                      }}
                    >
                      {commentText(comment.description)}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex" as const,
            justifyContent: "center" as const,
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