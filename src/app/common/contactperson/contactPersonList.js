import {
  Avatar,
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

const ContactPersonList = ({
  contactPersons,
  handleDelete,
  handleInvite,
  handleAPI,
}) => {
  const [contactMenuAnchorEl, setContactMenuAnchorEl] = React.useState(null);
  const [selectedContact, setSelectedContact] = React.useState(null);
  const [editingContact, setEditingContact] = React.useState(null);
  const [isContactPersonPopupOpen, setContactPersonPopupOpen] =
    React.useState(false);
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
      console.error("Failed to delete contact person:", err);
    }
  }

  const handleMenuOption = (action) => {
    if (!selectedContact) return;
    switch (action) {
      case "edit":
        handleOpenContactPersonPopup(selectedContact);
        break;
      case "delete":
        handleDelete(selectedContact.contact_person_id);
      case "reInvite":
        handleInvite(selectedContact);
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
          <Box sx={{ display: "flex", mb: 1 }} key={contact.contact_person_id}>
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
                    display: "flex",
                    alignItems: "center",
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
                    display: "flex",
                    alignItems: "center",
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
                    display: "flex",
                    alignItems: "center",
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
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <LocalPhoneOutlinedIcon className="button-more-svg" sx />
                  {contact?.phone}
                </Typography>
              )}
              {contact?.mobile && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#363636",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <PhoneAndroidIcon className="button-more-svg" sx />
                  {contact?.mobile}
                </Typography>
              )}

              {!contact?.can_invite ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#8a6d3b",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "11px",
                  }}
                >
                  Portal not enabled
                </Typography>
              ) : !contact?.is_added_in_portal ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#8a6d3b",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "11px",
                  }}
                >
                  Portal invitation not accepted
                </Typography>
              ) : (
                <></>
              )}
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

            {isContactPersonPopupOpen && (
              <ContactPersonPopup
                open={isContactPersonPopupOpen}
                onClose={() =>
                  handleCloseContactPersonPopup(contact?.contact_id)
                }
                initialData={editingContact}
                contact_id={contact?.contact_id}
              />
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ fontSize: "13px", color: "#757575" }}>
          No contact persons added yet.
        </Typography>
      )}

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


{!selectedContact?.is_added_in_portal && !selectedContact?.can_invite ? (
  <MenuItem
    sx={{ ...menuItemStyles, fontSize: "13px", fontWeight: 400}}
    onClick={() => handleInvite(selectedContact)}
  >
    Invite to Portal
  </MenuItem>
) : !selectedContact?.is_added_in_portal &&
  selectedContact?.can_invite &&
  !selectedContact?.is_portal_invitation_accepted ? (
  <MenuItem
    sx={{ ...menuItemStyles, fontSize: "13px", fontWeight: 400 }}
    onClick={() => handleInvite(selectedContact)}
  >
    Re-invite
  </MenuItem>
) : (
  <MenuItem
    sx={{ ...menuItemStyles, fontSize: "13px", fontWeight: 400 }}
    onClick={() => handleInvite(selectedContact)}
  >
    Resend Portal Link
  </MenuItem>
)}


<MenuItem
  sx={menuItemStyles}
  onClick={() => handleDelete(selectedContact.contact_person_id)}
>
  <ListItemText className="menu-text" primary="Delete" />
</MenuItem>
      </Menu>
    </>
  );
};

export default ContactPersonList;
