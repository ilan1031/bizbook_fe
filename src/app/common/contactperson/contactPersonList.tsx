import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ContactPersonPopup from "../ContactPersonPopup";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import apiService from "../../../services/axiosService";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { PORTAL_STATE, portalStateOf } from "./portalStatus";

const ContactPersonList = ({
  contactPersons,
  handleDelete,
  handleInvite,
  handleAPI,
}: any) => {
  const [contactMenuAnchorEl, setContactMenuAnchorEl] = React.useState<any>(null);
  const [selectedContact, setSelectedContact] = React.useState<any>(null);
  const [editingContact, setEditingContact] = React.useState<any>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<any>(null);
  const [isContactPersonPopupOpen, setContactPersonPopupOpen] =
    React.useState<boolean>(false);
  const router = useRouter();
  const { showMessage } = useSnackbar();

  const menuItemStyles = {
    "&:hover": {
      backgroundColor: "#4285F4",
      color: "#fff",
      "& .MuiListItemIcon-root": {
        color: "#4285F4",
      },
    },
  };
  const handleOpenContactMenu = (event, contact) => {
    event.stopPropagation();
    setContactMenuAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleCloseContactMenu = () => {
    setContactMenuAnchorEl(null);
    setSelectedContact(null);
  };

  const handleOpenContactPersonPopup = (contactToEdit = null) => {
    setEditingContact(contactToEdit);
    setContactPersonPopupOpen(true);
  };

  const handleCloseContactPersonPopup = (id) => {
    setContactPersonPopupOpen(false);
    setEditingContact(null);
    handleAPI(id);
  };
  const nonPrimaryContacts = contactPersons.filter(
    (contact) => contact.is_primary_contact === false
  );
  const organization_id = localStorage.getItem("organization_id");

  const handleMarkAsPrimary = async (contactPerson) => {
    try {
      const payload = {
        organization_id : organization_id,
        contact_id: contactPerson.contact_id,
      }
      await apiService({
        method: "PUT",
        url: `/api/v1/contact-person/${contactPerson.contact_person_id}/make-primary`,
        data: payload,
      });
      showMessage("This contact person has been marked as your primary contact person.", "success");
      handleAPI(contactPerson.contact_id);
    } catch (err) {
      showMessage(err?.message || "Couldn't mark this person as primary.", "error");
    }
  }

  const handleMenuOption = (action) => {
    if (!selectedContact) return;
    switch (action) {
      case "edit":
        handleOpenContactPersonPopup(selectedContact);
        break;
      case "delete":
        setConfirmDelete(selectedContact);
        break;
      case "reInvite":
        handleInvite(selectedContact);
        break;
      case "primary":
        handleMarkAsPrimary(selectedContact);
        break;
      default:
        break;
    }
    handleCloseContactMenu();
  };
  return (
    <>
      {nonPrimaryContacts.length > 0 ? (
        nonPrimaryContacts.map((contact) => (
          <Box sx={{ display: "flex" as const, mb: 1 }} key={contact.contact_person_id}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: 2,
                bgcolor: "#E0E0E0",
                fontSize: "14px",
              }}
              variant="rounded"
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "13px", mb: 0.5, fontWeight: 600 }}
              >
                {contact?.salutation} {contact?.first_name} {contact?.last_name}
              </Typography>
              {contact?.email && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex" as const,
                    alignItems: "center" as const,
                    fontSize: "13px",
                  }}
                >
                  {contact?.email}
                </Typography>
              )}
              {contact?.designation && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex" as const,
                    alignItems: "center" as const,
                    fontSize: "13px",
                  }}
                >
                  {contact?.designation}
                </Typography>
              )}
              {contact?.department && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex" as const,
                    alignItems: "center" as const,
                    fontSize: "13px",
                  }}
                >
                  {contact?.department}
                </Typography>
              )}
              {contact?.phone && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex" as const,
                    alignItems: "center" as const,
                    fontSize: "13px",
                  }}
                >
                  <LocalPhoneOutlinedIcon className="button-more-svg" sx={true as any} />
                  {contact?.phone}
                </Typography>
              )}
              {contact?.mobile && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex" as const,
                    alignItems: "center" as const,
                    fontSize: "13px",
                  }}
                >
                  <PhoneAndroidIcon className="button-more-svg" sx={true as any} />
                  {contact?.mobile}
                </Typography>
              )}

              <Typography
                variant="body2"
                sx={{
                  color: PORTAL_STATE[portalStateOf(contact)].color,
                  mb: 0.5,
                  display: "flex" as const,
                  alignItems: "center" as const,
                  fontSize: "11px",
                }}
              >
                {PORTAL_STATE[portalStateOf(contact)].label}
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                p: 0.5,
                color: "#757575",
                height: "fit-content",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={(e) => handleOpenContactMenu(e, contact)}
            >
              <Settings className="set-menu-icon" />
            </IconButton>

          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ fontSize: "13px", color: "#757575" }}>
          No contact persons added yet.
        </Typography>
      )}

      {/* One edit dialog for the person being edited */}
      {isContactPersonPopupOpen && (
        <ContactPersonPopup
          open={isContactPersonPopupOpen}
          onClose={() => handleCloseContactPersonPopup(editingContact?.contact_id)}
          initialData={editingContact}
          contact_id={editingContact?.contact_id}
        />
      )}

      {/* Delete asks first */}
      <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ fontSize: "14px" }}>
          Delete contact person{" "}
          <b>{[confirmDelete?.first_name, confirmDelete?.last_name].filter(Boolean).join(" ") || confirmDelete?.email}</b>?
          This can&apos;t be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)} sx={{ textTransform: "none" as const }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            sx={{ textTransform: "none" as const }}
            onClick={() => {
              const id = confirmDelete.contact_person_id;
              setConfirmDelete(null);
              handleDelete(id);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Menu */}
      <Menu
        anchorEl={contactMenuAnchorEl}
        open={Boolean(contactMenuAnchorEl)}
        onClose={handleCloseContactMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem sx={menuItemStyles} onClick={() => handleMenuOption("edit")}>
          <ListItemText className="menu-text" primary="Edit" />
        </MenuItem>
        <MenuItem
          sx={menuItemStyles}
          onClick={() => handleMenuOption("primary")}
        >
          <ListItemText className="menu-text" primary="Mark as Primary" />
        </MenuItem>
        {selectedContact?.email && (
  <MenuItem
    onClick={() => {
      handleCloseContactMenu();
      const orgId = localStorage.getItem("organization_id") || "";
      const contactId = selectedContact?.contact_id || "";
      const url = `/common/customerEmail?org_id=${orgId}&contact_id=${contactId}&email_type=Contact`;
      window.location.href = url; // or use router.push(url) if using Next.js
    }}
    sx={{
      ...menuItemStyles,
      fontSize: "13px",
      fontWeight: 500,
    }}
  >
    Send Email
  </MenuItem>
)}


{PORTAL_STATE[portalStateOf(selectedContact)].action && (
  <MenuItem
    sx={{ ...menuItemStyles, fontSize: "13px", fontWeight: 400 }}
    onClick={() => {
      handleCloseContactMenu();
      handleInvite(selectedContact);
    }}
  >
    {PORTAL_STATE[portalStateOf(selectedContact)].action}
  </MenuItem>
)}


<MenuItem
  sx={menuItemStyles}
  onClick={() => {
    setConfirmDelete(selectedContact);
    handleCloseContactMenu();
  }}
>
  <ListItemText className="menu-text" primary="Delete" />
</MenuItem>
      </Menu>
    </>
  );
};

export default ContactPersonList;
