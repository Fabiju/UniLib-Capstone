import { describe, expect, it } from "vitest"
import {
  isValidWorkId,
  safeRedirectPath,
  sanitizeText,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "./validation"

describe("sanitizeText", () => {
  it("quita < > y espacios repetidos", () => {
    expect(sanitizeText("  <script>alert(1)</script>   Ana  ")).toBe("scriptalert(1)/script Ana")
  })
})

describe("validateEmail", () => {
  it("acepta correos válidos", () => expect(validateEmail("ana@uni.edu.bo")).toBeNull())
  it("rechaza correos inválidos", () => {
    expect(validateEmail("")).not.toBeNull()
    expect(validateEmail("ana@")).not.toBeNull()
    expect(validateEmail("ana uni@x.com")).not.toBeNull()
  })
})

describe("validatePassword", () => {
  it("exige largo, letra y número", () => {
    expect(validatePassword("abc123")).not.toBeNull()
    expect(validatePassword("sololetras")).not.toBeNull()
    expect(validatePassword("12345678")).not.toBeNull()
    expect(validatePassword("clave1234")).toBeNull()
  })
})

describe("validateName / confirm", () => {
  it("valida nombre", () => {
    expect(validateName("A")).not.toBeNull()
    expect(validateName("Aja")).toBeNull()
  })
  it("valida confirmación", () => {
    expect(validateConfirmPassword("clave1234", "otra1234")).not.toBeNull()
    expect(validateConfirmPassword("clave1234", "clave1234")).toBeNull()
  })
})

describe("safeRedirectPath / isValidWorkId", () => {
  it("bloquea open redirect", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/")
    expect(safeRedirectPath("https://evil.com")).toBe("/")
    expect(safeRedirectPath("/catalogo")).toBe("/catalogo")
  })
  it("valida IDs de Open Library", () => {
    expect(isValidWorkId("OL45883W")).toBe(true)
    expect(isValidWorkId("../etc/passwd")).toBe(false)
    expect(isValidWorkId(undefined)).toBe(false)
  })
})
