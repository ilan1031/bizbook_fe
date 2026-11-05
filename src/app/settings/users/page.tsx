"use client";

// Settings > Users & Roles: the organisation's team (needs Team users switched
// on by the superadmin; the server enforces that too).
import React from "react";
import TeamManager from "../../../components/team/TeamManager";
import { currentOrgId } from "../../../services/teamApi";

export default function UsersAndRolesPage(_props?: any) {
  return <TeamManager orgId={currentOrgId()} />;
}
