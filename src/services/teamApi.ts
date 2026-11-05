// Typed client for the team API (bizbook_be/controllers/teamController.js and
// teamAdminController.js). The server owns every rule (limits, roles within the
// admin's own access, single-use invites); these types describe what it sends.
import apiService from "./axiosService";

export type TeamAction = "view" | "create" | "edit" | "delete" | "convert";
export type PagePermissions = Record<string, TeamAction[]>;
export type MemberStatus = "invited" | "active" | "disabled";

export interface GridPage {
  key: string;
  label: string;
  group: string;
  actions: TeamAction[];
}

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  preset: boolean;
  permissions: PagePermissions;
  members?: number;
}

export interface TeamMember {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: MemberStatus;
  invited_at: string;
  invite_expires_at: string | null;
  invite_expired: boolean;
  accepted_at?: string;
  disabled_at?: string;
}

export interface TeamOverview {
  organization: { organization_id: number; name: string };
  limit: number;
  seats_used: number;
  members: TeamMember[];
  roles: TeamRole[];
  grid: GridPage[];
  ceiling: PagePermissions;
  team_switch: boolean;
}

export interface AuditRow {
  _id: string;
  action: string;
  actor: string;
  actor_type: string;
  target: string;
  target_name: string;
  details: string;
  at: string;
}

export interface AdminTeam {
  _id: string;
  organization_id: number;
  org_name: string;
  owner: { _id: string; email: string; status: string; role: string } | null;
  team_switch: boolean;
  limit: number;
  seats_used: number;
  members: TeamMember[];
  roles: TeamRole[];
}

// One page of the superadmin's organisation list.
export interface AdminTeamsPage {
  status: boolean;
  data: AdminTeam[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface InviteInfo {
  organization_name: string;
  email: string;
  name: string;
  role_name: string;
  needs_password: boolean;
  expires_at: string;
}

export interface MailResult {
  ok: boolean;
  error?: string;
}

// What the server sends back for a successful call.
interface Ok<T = undefined> {
  status: boolean;
  message?: string;
  data?: T;
  email?: MailResult;
}

// An error from the server is the JSON body (message, code) plus httpStatus.
export interface TeamApiError {
  message: string;
  code?: string;
  httpStatus?: number;
}

export const errorText = (e: unknown, fallback = "Something went wrong"): string => {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return fallback;
};

export const errorCode = (e: unknown): string | undefined =>
  e && typeof e === "object" && "code" in e && typeof (e as { code: unknown }).code === "string"
    ? (e as { code: string }).code
    : undefined;

export const currentOrgId = (): string =>
  typeof window !== "undefined" ? localStorage.getItem("organization_id") || "" : "";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

async function call<T>(
  method: Method,
  url: string,
  options: { params?: Record<string, string | number>; data?: unknown } = {}
): Promise<T> {
  const res = await apiService({ method, url, params: options.params, data: options.data, file: undefined, customBaseUrl: undefined });
  return res.data as T;
}

// Organisation admin (Settings > Users & Roles)
export const teamApi = {
  overview: (org: string) => call<Ok<TeamOverview>>("GET", "api/v1/team", { params: { organization_id: org } }),
  audit: (org: string) => call<Ok<AuditRow[]>>("GET", "api/v1/team/audit", { params: { organization_id: org } }),
  invite: (org: string, input: { name: string; email: string; role_id: string }) =>
    call<Ok<{ _id: string }>>("POST", "api/v1/team/members", { data: { organization_id: org, ...input } }),
  updateMember: (org: string, id: string, input: { role_id?: string; status?: "active" | "disabled" }) =>
    call<Ok>("PATCH", `api/v1/team/members/${id}`, { data: { organization_id: org, ...input } }),
  resend: (org: string, id: string) => call<Ok>("POST", `api/v1/team/members/${id}/resend`, { data: { organization_id: org } }),
  remove: (org: string, id: string) => call<Ok>("DELETE", `api/v1/team/members/${id}`, { params: { organization_id: org } }),
  createRole: (org: string, input: { name: string; description: string; permissions: PagePermissions }) =>
    call<Ok<{ id: string }>>("POST", "api/v1/team/roles", { data: { organization_id: org, ...input } }),
  updateRole: (org: string, id: string, input: { name?: string; description?: string; permissions?: PagePermissions }) =>
    call<Ok>("PATCH", `api/v1/team/roles/${id}`, { data: { organization_id: org, ...input } }),
  deleteRole: (org: string, id: string) => call<Ok>("DELETE", `api/v1/team/roles/${id}`, { params: { organization_id: org } }),
};

// Public invite link
export const inviteApi = {
  info: (token: string) => call<Ok<InviteInfo>>("GET", "api/v1/team/invite", { params: { token } }),
  accept: (token: string, password?: string) =>
    call<Ok>("POST", "api/v1/team/accept-invite", { data: password === undefined ? { token } : { token, password } }),
};

// Superadmin (Users & Access > Teams)
export const adminTeamApi = {
  // One page of organisations, newest first (the server caps the page size).
  list: (page = 1, limit = 25) =>
    call<AdminTeamsPage>("GET", "api/v1/admin/teams", { params: { page, limit } }),
  updateTeam: (orgId: number, input: { team_users?: boolean; team_max_members?: number }) =>
    call<Ok>("PATCH", `api/v1/admin/teams/${orgId}`, { data: input }),
  updateMember: (id: string, input: { role_id?: string; status?: "active" | "disabled" }) =>
    call<Ok>("PATCH", `api/v1/admin/team-members/${id}`, { data: input }),
  resend: (id: string) => call<Ok>("POST", `api/v1/admin/team-members/${id}/resend`),
  remove: (id: string) => call<Ok>("DELETE", `api/v1/admin/team-members/${id}`),
};
