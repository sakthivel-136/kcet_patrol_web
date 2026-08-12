/**
 * sanitize.ts
 * Input sanitization utility — prevents XSS and SQL injection patterns
 * from being submitted via forms. Use on ALL user-facing text inputs.
 */

// ── SQL injection keywords / operators to block ──
const SQL_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|REPLACE|MERGE)\b)/gi,
  /(--|;|\/\*|\*\/|xp_|0x[0-9a-f]+)/gi,
  /(\bOR\b\s+['"\d]|AND\s+['"\d])/gi,
  /(['"];\s*(SELECT|INSERT|DROP|UPDATE))/gi,
  /(\bWAITFOR\b|\bSLEEP\b|\bBENCHMARK\b)/gi,
]

// ── XSS patterns to block ──
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /<[^>]*\s(on\w+)\s*=/gi,
  /data\s*:\s*text\/html/gi,
  /<iframe|<object|<embed|<applet/gi,
]

/** Remove HTML special chars to prevent XSS */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/** Strip dangerous characters and trim whitespace */
export function sanitize(value: string): string {
  if (typeof value !== 'string') return ''
  // Trim and collapse multiple spaces
  let clean = value.trim().replace(/\s{2,}/g, ' ')
  // Remove null bytes
  clean = clean.replace(/\0/g, '')
  return clean
}

/**
 * Validate that an input contains no SQL injection or XSS patterns.
 * Returns null if clean, or an error message string if suspicious.
 */
export function validateInput(value: string, fieldName = 'Field'): string | null {
  const cleaned = sanitize(value)

  for (const pattern of SQL_PATTERNS) {
    pattern.lastIndex = 0
    if (pattern.test(cleaned)) {
      return `${fieldName} contains invalid characters`
    }
  }

  for (const pattern of XSS_PATTERNS) {
    pattern.lastIndex = 0
    if (pattern.test(cleaned)) {
      return `${fieldName} contains invalid content`
    }
  }

  return null
}

/**
 * Validate length constraints.
 * Returns null if valid, error message if not.
 */
export function validateLength(
  value: string,
  fieldName: string,
  min = 1,
  max = 255
): string | null {
  if (value.length < min) return `${fieldName} must be at least ${min} character(s)`
  if (value.length > max) return `${fieldName} must be at most ${max} characters`
  return null
}

/**
 * Alphanumeric + underscore/dash only (for IDs, codes).
 */
export function validateAlphanumericId(value: string, fieldName: string): string | null {
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    return `${fieldName} must contain only letters, numbers, underscores or dashes`
  }
  return null
}

/**
 * Validate a name field — letters, spaces, dots, hyphens only.
 */
export function validateName(value: string, fieldName: string): string | null {
  if (!/^[a-zA-Z0-9\s.\-',]+$/.test(value)) {
    return `${fieldName} contains unsupported characters`
  }
  return null
}

/**
 * Convenience: run all checks (sanitize + SQL/XSS + length) at once.
 * Returns the first error found, or null if all pass.
 */
export function fullValidate(
  value: string,
  fieldName: string,
  options?: { min?: number; max?: number; alphanumericId?: boolean; nameOnly?: boolean }
): string | null {
  const cleaned = sanitize(value)

  const lenErr = validateLength(cleaned, fieldName, options?.min ?? 1, options?.max ?? 255)
  if (lenErr) return lenErr

  const injErr = validateInput(cleaned, fieldName)
  if (injErr) return injErr

  if (options?.alphanumericId) {
    const idErr = validateAlphanumericId(cleaned, fieldName)
    if (idErr) return idErr
  }

  if (options?.nameOnly) {
    const nameErr = validateName(cleaned, fieldName)
    if (nameErr) return nameErr
  }

  return null
}
