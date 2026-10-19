import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"
import { useAuth } from "./AuthContext"
import { isReadingStatus, type ReadingStatus } from "../types/book"

export interface Loan {
  bookKey: string
  dueDate: string
}

interface LibraryState {
  loans: Loan[]
  statuses: Record<string, ReadingStatus>
  titles: Record<string, string>
}

const LOAN_DAYS = 14

function storageKey(userId: string) {
  return `unilib-library:${userId}`
}

function defaultDueDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + LOAN_DAYS)
  return date.toISOString()
}

function loadInitialState(userId: string): LibraryState {
  const empty: LibraryState = { loans: [], statuses: {}, titles: {} }
  try {
    const saved = localStorage.getItem(storageKey(userId))
    if (!saved) return empty
    const parsed = JSON.parse(saved)

    const loans: Loan[] = Array.isArray(parsed.loans)
      ? parsed.loans.filter(
          (l: unknown): l is Loan =>
            typeof l === "object" &&
            l !== null &&
            typeof (l as Loan).bookKey === "string" &&
            typeof (l as Loan).dueDate === "string"
        )
      : []

    const statuses: Record<string, ReadingStatus> = {}
    if (parsed.statuses && typeof parsed.statuses === "object") {
      for (const [key, value] of Object.entries(parsed.statuses)) {
        if (isReadingStatus(value)) statuses[key] = value
      }
    }

    const titles: Record<string, string> = {}
    if (parsed.titles && typeof parsed.titles === "object") {
      for (const [key, value] of Object.entries(parsed.titles)) {
        if (typeof value === "string") titles[key] = value
      }
    }

    return { loans, statuses, titles }
  } catch {
    return empty
  }
}

type LibraryAction =
  | { type: "BORROW_BOOK"; bookKey: string; title: string; dueDate: string }
  | { type: "RETURN_BOOK"; bookKey: string }
  | { type: "SET_STATUS"; bookKey: string; status: ReadingStatus | null; title?: string }

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {
    case "BORROW_BOOK":
      if (state.loans.some((loan) => loan.bookKey === action.bookKey)) return state
      return {
        ...state,
        loans: [...state.loans, { bookKey: action.bookKey, dueDate: action.dueDate }],
        titles: { ...state.titles, [action.bookKey]: action.title },
      }

    case "RETURN_BOOK":
      return { ...state, loans: state.loans.filter((loan) => loan.bookKey !== action.bookKey) }

    case "SET_STATUS": {
      const statuses = { ...state.statuses }
      if (action.status === null) {
        delete statuses[action.bookKey]
      } else {
        statuses[action.bookKey] = action.status
      }
      const titles = action.title
        ? { ...state.titles, [action.bookKey]: action.title }
        : state.titles
      return { ...state, statuses, titles }
    }

    default:
      throw new Error("Accion desconocida en libraryReducer")
  }
}

interface LibraryContextValue {
  loans: Loan[]
  wishlist: string[]
  statuses: Record<string, ReadingStatus>
  borrowBook: (bookKey: string, title: string) => void
  returnBook: (bookKey: string) => void
  addToWishlist: (bookKey: string, title: string) => void
  removeFromWishlist: (bookKey: string) => void
  setReadingStatus: (bookKey: string, status: ReadingStatus | null, title?: string) => void
  getStatus: (bookKey: string) => ReadingStatus | undefined
  getTitle: (bookKey: string) => string
  isBorrowed: (bookKey: string) => boolean
  isInWishlist: (bookKey: string) => boolean
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

function LibraryStore({ userId, children }: { userId: string; children: ReactNode }) {
  const [state, dispatch] = useReducer(libraryReducer, userId, loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(state))
    } catch {
      // sin espacio / bloqueado
    }
  }, [state, userId])

  const borrowBook = useCallback((bookKey: string, title: string) => {
    dispatch({ type: "BORROW_BOOK", bookKey, title, dueDate: defaultDueDate() })
  }, [])
  const returnBook = useCallback((bookKey: string) => dispatch({ type: "RETURN_BOOK", bookKey }), [])
  const setReadingStatus = useCallback(
    (bookKey: string, status: ReadingStatus | null, title?: string) =>
      dispatch({ type: "SET_STATUS", bookKey, status, title }),
    []
  )
  const addToWishlist = useCallback(
    (bookKey: string, title: string) =>
      dispatch({ type: "SET_STATUS", bookKey, status: "wishlist", title }),
    []
  )
  const removeFromWishlist = useCallback(
    (bookKey: string) => dispatch({ type: "SET_STATUS", bookKey, status: null }),
    []
  )

  const wishlist = useMemo(
    () => Object.keys(state.statuses).filter((key) => state.statuses[key] === "wishlist"),
    [state.statuses]
  )

  const value = useMemo<LibraryContextValue>(
    () => ({
      loans: state.loans,
      wishlist,
      statuses: state.statuses,
      borrowBook,
      returnBook,
      addToWishlist,
      removeFromWishlist,
      setReadingStatus,
      getStatus: (bookKey) => state.statuses[bookKey],
      getTitle: (bookKey) => state.titles[bookKey] ?? bookKey,
      isBorrowed: (bookKey) => state.loans.some((loan) => loan.bookKey === bookKey),
      isInWishlist: (bookKey) => state.statuses[bookKey] === "wishlist",
    }),
    [state, wishlist, borrowBook, returnBook, addToWishlist, removeFromWishlist, setReadingStatus]
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? "guest"
  return (
    <LibraryStore key={userId} userId={userId}>
      {children}
    </LibraryStore>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error("useLibrary debe usarse dentro de un LibraryProvider")
  }
  return context
}