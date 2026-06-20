/**
 * Tiny, dependency-free request validation helpers.
 * Routes use these to reject malformed input with a clear 400 instead of
 * throwing 500s or silently coercing bad data into the database.
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (body == null || typeof body !== "object" || Array.isArray(body)) {
      throw new ValidationError("Request body must be a JSON object.");
    }
    return body as Record<string, unknown>;
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    throw new ValidationError("Invalid JSON body.");
  }
}

export function requireString(
  value: unknown,
  field: string,
  { min = 1, max = 10_000, trim = true }: { min?: number; max?: number; trim?: boolean } = {}
): string {
  if (typeof value !== "string") {
    throw new ValidationError(`"${field}" is required.`);
  }
  const v = trim ? value.trim() : value;
  if (v.length < min) {
    throw new ValidationError(
      min === 1 ? `"${field}" is required.` : `"${field}" must be at least ${min} characters.`
    );
  }
  if (v.length > max) {
    throw new ValidationError(`"${field}" must be at most ${max} characters.`);
  }
  return v;
}

export function optionalString(value: unknown, max = 10_000): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return null;
  return value.trim().slice(0, max);
}

export function toInt(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.floor(n);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireEmail(value: unknown): string {
  const email = requireString(value, "email").toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    throw new ValidationError("Please enter a valid email address.");
  }
  return email;
}
