export function sanitizeText(value: string): string {
  return value
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join("")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(raw: string): string | null {
  const value = sanitizeText(raw)
  if (!value) return "El nombre es obligatorio."
  if (value.length < 2) return "El nombre debe tener al menos 2 caracteres."
  if (value.length > 60) return "El nombre no puede superar los 60 caracteres."
  return null
}

export function validateEmail(raw: string): string | null {
  const value = raw.trim()
  if (!value) return "El correo es obligatorio."
  if (value.length > 254 || !EMAIL_REGEX.test(value)) return "Ingresa un correo válido (ej. nombre@correo.com)."
  return null
}

export function validatePassword(value: string): string | null {
  if (!value) return "La contraseña es obligatoria."
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres."
  if (value.length > 64) return "La contraseña no puede superar los 64 caracteres."
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "La contraseña debe incluir al menos una letra y un número."
  }
  return null
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return "Confirma tu contraseña."
  if (password !== confirm) return "Las contraseñas no coinciden."
  return null
}

export function safeRedirectPath(value: unknown): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value
  }
  return "/"
}

export function isValidWorkId(value: string | undefined): value is string {
  return typeof value === "string" && /^OL\d+W$/.test(value)
}
