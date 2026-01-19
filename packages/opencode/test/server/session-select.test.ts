// Set test password BEFORE importing modules (Flag reads env at import time)
process.env.OPENCODE_SERVER_PASSWORD = "test-password-for-tests"

import { describe, expect, test } from "bun:test"
import path from "path"
import { Session } from "../../src/session"
import { Log } from "../../src/util/log"
import { Instance } from "../../src/project/instance"
import { Server } from "../../src/server/server"

const projectRoot = path.join(__dirname, "../..")
Log.init({ print: false })

// Test credentials for authentication
const TEST_USERNAME = "opencode"
const TEST_PASSWORD = "test-password-for-tests"
const authHeader = `Basic ${Buffer.from(`${TEST_USERNAME}:${TEST_PASSWORD}`).toString("base64")}`

// Set test password for Server.App()
Server.setTestPassword(TEST_PASSWORD)

describe("tui.selectSession endpoint", () => {
  test("should return 200 when called with valid session", async () => {
    await Instance.provide({
      directory: projectRoot,
      fn: async () => {
        // #given
        const session = await Session.create({})

        // #when
        const app = Server.App()
        const response = await app.request("/tui/select-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader,
          },
          body: JSON.stringify({ sessionID: session.id }),
        })

        // #then
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body).toBe(true)

        await Session.remove(session.id)
      },
    })
  })

  test("should return 404 when session does not exist", async () => {
    await Instance.provide({
      directory: projectRoot,
      fn: async () => {
        // #given
        const nonExistentSessionID = "ses_nonexistent123"

        // #when
        const app = Server.App()
        const response = await app.request("/tui/select-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader,
          },
          body: JSON.stringify({ sessionID: nonExistentSessionID }),
        })

        // #then
        expect(response.status).toBe(404)
      },
    })
  })

  test("should return 400 when session ID format is invalid", async () => {
    await Instance.provide({
      directory: projectRoot,
      fn: async () => {
        // #given
        const invalidSessionID = "invalid_session_id"

        // #when
        const app = Server.App()
        const response = await app.request("/tui/select-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader,
          },
          body: JSON.stringify({ sessionID: invalidSessionID }),
        })

        // #then
        expect(response.status).toBe(400)
      },
    })
  })
})
