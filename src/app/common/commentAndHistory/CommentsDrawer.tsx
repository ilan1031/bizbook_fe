"use client";

import { useEffect, useState } from "react";
import { Drawer, Box, IconButton, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "draft-js/dist/Draft.css";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import apiService from "../../../../src/services/axiosService";
import config from "../../../../src/services/config";

const CommentsDrawer = ({ open, onClose, module, ID, recordActors }: any) => {
  let org_id = localStorage.getItem("organization_id");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [comments, setComments] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(module, "module from history", ID);

  const handleEditorChange = (newState) => {
    setEditorState(newState);
  };

  const applyStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleAddComment = () => {
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) return;
    const rawContent = convertToRaw(contentState);
    setComments([...comments, { content: rawContent, date: new Date() }]);
    setEditorState(EditorState.createEmpty());
  };

  useEffect(() => {
    if (ID) {
      console.log(ID, "ascsac");
      getHistory(ID, org_id);
    }
  }, [ID]);

  const getHistory = async (ID, ORG_ID) => {
    setLoading(true);
    console.log("paramsv");
    try {
      let url;
      let configURL;
      if (module == "Bills") {
        url = `api/v1/bills/get-history?org_id=${ORG_ID}&bill_id=${ID}`;
        configURL = config.PO_Base_url;
      }

      let params = {
        url,
        method: "get",
        customBaseUrl: configURL,
      };
      let resposne = await apiService(params);
      if (resposne.statusCode == 200) {
        console.log("resposne.data.data", resposne.data.data);
        setComments(resposne.data.data);
      }
      console.log("resposne", resposne);
    } catch (error) {
      console.error("Error fetching purchase orders", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ height: "100%" }}
    >
      <Box
        sx={{
          width: 400,
          p: 2,
          display: "flex" as const,
          flexDirection: "column" as const,
          height: "100vh",
        }}
      >
        {/* Close Button on Top Left */}
        <Box
          sx={{
            display: "flex" as const,
            justifyContent: "space-between" as const,
            alignItems: "center" as const,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "400" as const, fontSize: "17px" }}>
            Comments & Historyss
          </Typography>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{ alignSelf: "flex-end" as const }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {(recordActors?.created || recordActors?.lastChanged) && (
          <Box sx={{ mt: 1 }}>
            {recordActors.created && (
              <Typography variant="body2" sx={{ color: "gray" }}>
                Created by {recordActors.created}
              </Typography>
            )}
            {recordActors.lastChanged && (
              <Typography variant="body2" sx={{ color: "gray" }}>
                Last changed by {recordActors.lastChanged}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ border: "1px solid #ccc", borderRadius: 1, mt: 2 }}>
          <Box
            sx={{
              display: "flex" as const,
              borderBottom: "1px solid #ccc",
              p: 1,
              backgroundColor: "#f3f4f8",
            }}
          >
            <Button
              size="small"
              onClick={() => applyStyle("BOLD")}
              color="secondary"
              sx={{ minWidth: 0, mx: 0.5, color: "black" }}
            >
              <b>B</b>
            </Button>
            <Button
              size="small"
              onClick={() => applyStyle("ITALIC")}
              color="secondary"
              sx={{ minWidth: 0, mx: 0.5, color: "black" }}
            >
              <i>I</i>
            </Button>
            <Button
              size="small"
              onClick={() => applyStyle("UNDERLINE")}
              color="secondary"
              sx={{ minWidth: 0, mx: 0.5, color: "black" }}
            >
              <u>U</u>
            </Button>
          </Box>
          <Box sx={{ minHeight: 80, p: 1 }}>
            <Editor editorState={editorState} onChange={handleEditorChange} />
          </Box>
        </Box>

        <Button
          sx={{
            mt: 1.5,
            alignSelf: "flex-start" as const,
            fontSize: "11px",
            fontWeight: "400" as const,
          }}
          variant="outlined"
          color={"#e3e3ea" as any}
          onClick={handleAddComment}
        >
          Add Comment
        </Button>

        <Typography
          variant="subtitle1"
          sx={{
            mt: 3,
            fontWeight: "600" as const,
            display: "flex" as const,
            alignItems: "center" as const,
            fontSize: "15px",
          }}
        >
          ALL COMMENTS{" "}
          <Box
            sx={{
              bgcolor: "#408dfb",
              color: "white",
              ml: 1,
              px: 1,
              borderRadius: "50%",
              fontSize: "12px",
              fontWeight: "600" as const,
            }}
          >
            {comments.length}
          </Box>
        </Typography>

        <Box sx={{ mt: 2, flexGrow: 1, overflowY: "auto" as const, px: 1 }}>
          {comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                mt: 2,
                display: "flex" as const,
                flexDirection: "column" as const,
                gap: 0.5,
                p: 1.5,
                bgcolor: "#fafafa",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              {/* Header Row: Name + Dot + Date */}
              <Box
                sx={{
                  display: "flex" as const,
                  alignItems: "center" as const,
                  gap: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" as const }}>
                  {comment.commented_by}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  •
                </Typography>
                <Typography variant="caption" sx={{ color: "gray" }}>
                  {comment.date_formatted}
                </Typography>
              </Box>

              {/* Comment Description */}
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  whiteSpace: "pre-wrap" as const,
                  wordBreak: "break-word" as const,
                }}
              >
                {comment.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CommentsDrawer;
