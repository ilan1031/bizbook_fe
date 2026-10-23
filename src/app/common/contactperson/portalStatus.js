// Where a contact person stands with the customer portal: not invited yet,
// invited (waiting for them to accept), or accepted (they can sign in).
export const portalStateOf = (person) =>
  person?.is_portal_invitation_accepted
    ? "accepted"
    : person?.is_added_in_portal || person?.can_invite
      ? "invited"
      : "none";

// label: shown under the contact; action: the invite link's text (none once accepted).
export const PORTAL_STATE = {
  none: { label: "Portal not enabled", color: "#8a6d3b", action: "Invite to Portal" },
  invited: { label: "Portal invitation sent, not accepted yet", color: "#d9822b", action: "Re-invite" },
  accepted: { label: "Portal invitation accepted", color: "#1b7a2f", action: null },
};
