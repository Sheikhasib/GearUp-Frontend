import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import jwt from "jsonwebtoken"

const { setMock, deleteMock, redirectMock } = vi.hoisted(() => ({
  setMock: vi.fn(),
  deleteMock: vi.fn(),
  redirectMock: vi.fn((url: string): never => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: setMock,
    delete: deleteMock,
  })),
}))

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}))

import {
  loginAction,
  registerAction,
  logoutAction,
  googleAuthAction,
  demoLoginAction,
} from "./authActions"

const signToken = (role: string) =>
  jwt.sign({ role }, "test-secret", {
    expiresIn: "1h",
  })

const apiUrl = "https://api.test.test"

beforeEach(() => {
  redirectMock.mockClear()
  setMock.mockClear()
  deleteMock.mockClear()
  process.env.BACKEND_API_URL = apiUrl
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const fetchSuccess = (body: unknown) =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: () => body }))

describe("loginAction", () => {
  it("returns validation errors for an invalid email", async () => {
    const formData = new FormData()
    formData.set("email", "not-an-email")
    formData.set("password", "1234")

    const result = await loginAction(
      "",
      { success: false, message: "" },
      formData
    )

    expect(result.success).toBe(false)
    expect(result.errors?.email).toBeDefined()
  })

  it("returns the backend message on failed login", async () => {
    fetchSuccess({ success: false, message: "Invalid credentials" })

    const formData = new FormData()
    formData.set("email", "user@example.com")
    formData.set("password", "1234")

    const result = await loginAction(
      "",
      { success: false, message: "" },
      formData
    )

    expect(result.success).toBe(false)
    expect(result.message).toBe("Invalid credentials")
    expect(setMock).not.toHaveBeenCalled()
  })

  it("sets auth cookies and redirects by role on success", async () => {
    const accessToken = signToken("ADMIN")
    fetchSuccess({ success: true, data: { accessToken, refreshToken: "rt" } })

    const formData = new FormData()
    formData.set("email", "admin@example.com")
    formData.set("password", "1234")

    await expect(
      loginAction("", { success: false, message: "" }, formData)
    ).rejects.toThrow("NEXT_REDIRECT:/admin-dashboard")

    expect(setMock).toHaveBeenCalledWith(
      "accessToken",
      accessToken,
      expect.any(Object)
    )
    expect(setMock).toHaveBeenCalledWith(
      "accessTokenClient",
      accessToken,
      expect.any(Object)
    )
    expect(deleteMock).not.toHaveBeenCalled()
  })

  it("redirects to a safe relative redirectTo before role-based redirect", async () => {
    const accessToken = signToken("CUSTOMER")
    fetchSuccess({ success: true, data: { accessToken, refreshToken: "rt" } })

    const formData = new FormData()
    formData.set("email", "user@example.com")
    formData.set("password", "1234")

    await expect(
      loginAction("/gear", { success: false, message: "" }, formData)
    ).rejects.toThrow("NEXT_REDIRECT:/gear")
  })

  it("ignores non-safe redirectTo targets (e.g. for the role-based redirect)", async () => {
    const accessToken = signToken("PROVIDER")
    fetchSuccess({ success: true, data: { accessToken, refreshToken: "rt" } })

    const formData = new FormData()
    formData.set("email", "provider@example.com")
    formData.set("password", "1234")

    await expect(
      loginAction(
        "https://evil.example.com",
        { success: false, message: "" },
        formData
      )
    ).rejects.toThrow("NEXT_REDIRECT:/provider-dashboard")
  })

  it("redirects to the customer dashboard for a CUSTOMER role", async () => {
    const accessToken = signToken("CUSTOMER")
    fetchSuccess({ success: true, data: { accessToken, refreshToken: "rt" } })

    const formData = new FormData()
    formData.set("email", "customer@example.com")
    formData.set("password", "1234")

    await expect(
      loginAction("", { success: false, message: "" }, formData)
    ).rejects.toThrow("NEXT_REDIRECT:/customer-dashboard")
  })
})

describe("registerAction", () => {
  it("returns validation errors when passwords do not match", async () => {
    const formData = new FormData()
    formData.set("name", "Jane Doe")
    formData.set("email", "jane@example.com")
    formData.set("password", "1234")
    formData.set("confirmPassword", "5678")
    formData.set("role", "CUSTOMER")

    const result = await registerAction(
      { success: false, message: "" },
      formData
    )

    expect(result.success).toBe(false)
    expect(result.errors?.confirmPassword).toBeDefined()
  })

  it("sends the payload without confirmPassword and redirects on success", async () => {
    let requestBody: unknown
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_url: string, init: RequestInit) => {
        requestBody = JSON.parse(String(init.body))
        return Promise.resolve({ json: () => ({ success: true }) })
      })
    )

    const formData = new FormData()
    formData.set("name", "Jane Doe")
    formData.set("email", "jane@example.com")
    formData.set("password", "1234")
    formData.set("confirmPassword", "1234")
    formData.set("role", "CUSTOMER")

    await expect(
      registerAction({ success: false, message: "" }, formData)
    ).rejects.toThrow("NEXT_REDIRECT:/login?registered=true")

    expect(requestBody).not.toHaveProperty("confirmPassword")
    expect(requestBody).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      role: "CUSTOMER",
    })
  })

  it("returns the backend message when registration fails", async () => {
    fetchSuccess({ success: false, message: "Email already in use" })

    const formData = new FormData()
    formData.set("name", "Jane Doe")
    formData.set("email", "jane@example.com")
    formData.set("password", "1234")
    formData.set("confirmPassword", "1234")
    formData.set("role", "CUSTOMER")

    const result = await registerAction(
      { success: false, message: "" },
      formData
    )

    expect(result.success).toBe(false)
    expect(result.message).toBe("Email already in use")
  })
})

describe("logoutAction", () => {
  it("deletes the auth cookies and redirects home", async () => {
    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT:/")

    expect(deleteMock).toHaveBeenCalledWith("accessToken")
    expect(deleteMock).toHaveBeenCalledWith("accessTokenClient")
    expect(deleteMock).toHaveBeenCalledWith("refreshToken")
  })
})

describe("googleAuthAction", () => {
  it("sets auth cookies and redirects by role on success", async () => {
    const accessToken = signToken("CUSTOMER")
    fetchSuccess({ success: true, data: { accessToken, refreshToken: "rt" } })

    await expect(googleAuthAction("id-token")).rejects.toThrow(
      "NEXT_REDIRECT:/customer-dashboard"
    )

    expect(setMock).toHaveBeenCalledWith(
      "refreshToken",
      "rt",
      expect.any(Object)
    )
  })

  it("returns the backend message when Google sign-in fails", async () => {
    fetchSuccess({ success: false, message: "Google sign-in failed" })

    const result = await googleAuthAction("id-token")

    expect(result.success).toBe(false)
    expect(result.message).toBe("Google sign-in failed")
  })
})

describe("demoLoginAction", () => {
  it("returns a message when the demo role is not configured", async () => {
    delete process.env.DEMO_CUSTOMER_EMAIL
    delete process.env.DEMO_CUSTOMER_PASSWORD

    const result = await demoLoginAction("CUSTOMER")

    expect(result.success).toBe(false)
    expect(result.message).toContain("not configured")
  })

  it("logs in with the demo credentials and redirects by role", async () => {
    process.env.DEMO_CUSTOMER_EMAIL = "demo@example.com"
    process.env.DEMO_CUSTOMER_PASSWORD = "secret"
    const accessToken = signToken("CUSTOMER")

    let requestedBody: unknown
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_url: string, init: RequestInit) => {
        requestedBody = init.body
        return Promise.resolve({
          json: () => ({
            success: true,
            data: { accessToken, refreshToken: "rt" },
          }),
        })
      })
    )

    await expect(demoLoginAction("CUSTOMER")).rejects.toThrow(
      "NEXT_REDIRECT:/customer-dashboard"
    )

    expect(JSON.parse(String(requestedBody))).toEqual({
      email: "demo@example.com",
      password: "secret",
    })
  })
})
