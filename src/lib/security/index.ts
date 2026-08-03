/**
 * Librería única de autenticación, autorización y errores de API.
 *
 * Flujo canónico:
 *   authenticate() → authorize() → assertUserBelongsToTeam() → endpoint
 */
export {
  authenticate,
  authenticateForProduction,
  authorize,
  assertUserBelongsToTeam,
  profileFromAuthUser,
  isServerProduction,
  type AuthContext,
  type AuthenticatedContext,
  type AuthorizedContext,
} from '@/lib/security/auth';

export { getAccessibleTeamIds } from '@/lib/security/assert-team-access';

export {
  apiError,
  unauthorized,
  forbidden,
  badRequest,
  logApiError,
  type ApiErrorCode,
  type ApiErrorBody,
} from '@/lib/security/api-error';
