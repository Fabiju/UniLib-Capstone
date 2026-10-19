import { describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useFetch } from "../hooks/useFetch"

describe("useFetch", () => {
  it("devuelve los datos después de una carga exitosa", async () => {

    const fakeFetch = vi.fn().mockResolvedValue({ message: "Success!" })

    const { result } = renderHook(() => useFetch(fakeFetch, []))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual({ message: "Success!" })
    expect(result.current.error).toBeNull()
  })

  it("devuelve un error cuando la petición falla", async () => {
    const fakeFetch = vi.fn().mockRejectedValue(new Error("No se pudieron obtener los libros"))

    const { result } = renderHook(() => useFetch(fakeFetch, []))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe("No se pudieron obtener los libros")
    expect(result.current.data).toBeNull()
  })
})
