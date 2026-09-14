import jwt from "jsonwebtoken"

/**
 * The admin signing secret. There is deliberately NO fallback.
 *
 * This used to read `process.env.JWT_SECRET || "your-secret-key-change-in-production"`,
 * and that default string is committed in a public repository. Any deploy that
 * forgot to set JWT_SECRET was therefore signing and accepting tokens under a
 * secret anyone can read: `{admin: true}` could be minted at will, reaching every
 * route behind `isAuthenticated` — approving repositories, dispatching
 * verification runs, and writing site content.
 *
 * Returning null instead fails CLOSED. With no secret configured nobody can
 * authenticate, including the real admin, which is the correct trade: an admin
 * locked out sets an environment variable, whereas attestations published under a
 * forged token cannot be untangled after the fact. It is read lazily rather than
 * at import time so a missing variable disables auth without breaking the build
 * for the public pages that never touch it.
 */
function secret(): string | null {
  const value = process.env.JWT_SECRET
  if (!value) {
    console.error(
      "JWT_SECRET is not set — admin authentication is disabled. Set it in the deployment environment."
    )
    return null
  }
  return value
}

/** Sign an admin token. Throws when no secret is configured, so callers can 503. */
export function signAdminToken(
  payload: object,
  // A day at most. The token sits in the admin's localStorage with no way to
  // revoke it, so its lifetime is the whole exposure window if it leaks.
  expiresIn: jwt.SignOptions["expiresIn"] = "12h"
): string {
  const key = secret()
  if (!key) throw new Error("JWT_SECRET is not configured")
  return jwt.sign(payload, key, { expiresIn })
}

export function verifyToken(token: string) {
  const key = secret()
  if (!key) return null
  try {
    // The algorithm is pinned so a token cannot pick its own (the library
    // defaults to accepting any HMAC variant when the secret is a string).
    return jwt.verify(token, key, { algorithms: ["HS256"] })
  } catch (error) {
    return null
  }
}

export function isAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  return decoded !== null
}
