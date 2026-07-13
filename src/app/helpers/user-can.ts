/**
 * Central permission check for gating UI elements (buttons, actions, sections).
 *
 * Authorities are computed once at login from the user's role(s) — the same
 * fine-grained permission model that already gates API access on the backend
 * (see AuthorizationFilter) — and stored on the user's profile in localStorage
 * under the MNM_USER key (see AuthService.persistSession).
 *
 * A missing/unparsable profile, or one with no authorities, always yields false
 * (fail closed): an element gated on userCan() stays hidden rather than shown.
 *
 * @param permission The exact authority name required (e.g. 'ORGANISATION_UNIT_CREATE').
 */
export function userCan(permission: string): boolean {
  if (!permission) {
    return false;
  }

  const raw = localStorage.getItem('MNM_USER');
  if (!raw) {
    return false;
  }

  try {
    const user = JSON.parse(raw);
    const authorities: string[] = user?.authorities ?? [];
    return Array.isArray(authorities) && authorities.includes(permission);
  } catch {
    return false;
  }
}
