import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { sanitizeText, validateEmail, validateName, validatePassword } from "../utils/validation"

export interface User {
  id: string
  name: string
  email: string
}

interface StoredUser extends User {
  salt: string
  passwordHash: string
}

interface Session {
  userId: string
  expiresAt: number
}

interface AttemptEntry {
  count: number
  lockedUntil: number
}

export type AuthResult = { ok: true } | { ok: false; error: string }

const USERS_KEY = "unilib-users"
const SESSION_KEY = "unilib-session"
const ATTEMPTS_KEY = "unilib-login-attempts"
const SESSION_HOURS = 8
const MAX_ATTEMPTS = 5
const LOCK_MS = 60_000

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    
  }
}

function randomHex(bytes: number): string {
  const array = new Uint8Array(bytes)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  if (globalThis.crypto?.subtle) {
    const buffer = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("")
  }
  let hash = 5381
  for (let i = 0; i < data.length; i++) {
    hash = Math.imul(hash, 33) ^ data[i]
  }
  return (hash >>> 0).toString(16)
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

function toPublicUser(stored: StoredUser): User {
  return { id: stored.id, name: stored.name, email: stored.email }
}

function loadSession(): User | null {
  const session = readJSON<Session | null>(SESSION_KEY, null)
  if (!session || typeof session.expiresAt !== "number" || session.expiresAt < Date.now()) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
  const stored = readJSON<StoredUser[]>(USERS_KEY, []).find((u) => u.id === session.userId)
  return stored ? toPublicUser(stored) : null
}

function startSession(userId: string) {
  const session: Session = { userId, expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000 }
  writeJSON(SESSION_KEY, session)
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<AuthResult>
  register: (name: string, email: string, password: string) => Promise<AuthResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession)

  const login = useCallback(async (emailRaw: string, password: string): Promise<AuthResult> => {
    const email = emailRaw.trim().toLowerCase()
    const attempts = readJSON<Record<string, AttemptEntry>>(ATTEMPTS_KEY, {})
    const entry = attempts[email]

    if (entry && entry.lockedUntil > Date.now()) {
      const seconds = Math.ceil((entry.lockedUntil - Date.now()) / 1000)
      return { ok: false, error: `Demasiados intentos fallidos. Intenta de nuevo en ${seconds} segundos.` }
    }

    const found = readJSON<StoredUser[]>(USERS_KEY, []).find((u) => u.email === email)

    const hash = await hashPassword(password, found?.salt ?? "sin-usuario")

    if (!found || !safeEqual(hash, found.passwordHash)) {
      const count = (entry?.count ?? 0) + 1
      attempts[email] =
        count >= MAX_ATTEMPTS ? { count: 0, lockedUntil: Date.now() + LOCK_MS } : { count, lockedUntil: 0 }
      writeJSON(ATTEMPTS_KEY, attempts)

      return { ok: false, error: "Correo o contraseña incorrectos." }
    }

    delete attempts[email]
    writeJSON(ATTEMPTS_KEY, attempts)
    startSession(found.id)
    setUser(toPublicUser(found))
    return { ok: true }
  }, [])

  const register = useCallback(
    async (nameRaw: string, emailRaw: string, password: string): Promise<AuthResult> => {

      const problem = validateName(nameRaw) ?? validateEmail(emailRaw) ?? validatePassword(password)
      if (problem) return { ok: false, error: problem }

      const email = emailRaw.trim().toLowerCase()
      const users = readJSON<StoredUser[]>(USERS_KEY, [])
      if (users.some((u) => u.email === email)) {
        return { ok: false, error: "Ya existe una cuenta con ese correo." }
      }

      const salt = randomHex(16)
      const stored: StoredUser = {
        id: randomHex(8),
        name: sanitizeText(nameRaw),
        email,
        salt,
        passwordHash: await hashPassword(password, salt),
      }

      writeJSON(USERS_KEY, [...users, stored])
      startSession(stored.id)
      setUser(toPublicUser(stored))
      return { ok: true }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
