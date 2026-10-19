import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function useRequireAuth() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname + location.search

  return useCallback(
    <A extends unknown[]>(action: (...args: A) => void) =>
      (...args: A) => {
        if (!user) {
          navigate("/login", { state: { from } })
          return
        }
        action(...args)
      },
    [user, navigate, from]
  )
}
