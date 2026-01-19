// Set test password BEFORE importing modules (Flag reads env at import time)
process.env.OPENCODE_SERVER_PASSWORD = "test-password-for-tests"

import { describe, expect, test } from "bun:test"
import path from "path"
import { Instance } from "../../src/project/instance"
import { Server } from "../../src/server/server"
import { Session } from "../../src/session"
import { Log } from "../../src/util/log"

const projectRoot = path.join(__dirname, "../..")
Log.init({ print: false })

// Test credentials for authentication
const TEST_USERNAME = "opencode"
const TEST_PASSWORD = "test-password-for-tests"
const authHeader = `Basic ${Buffer.from(`${TEST_USERNAME}:${TEST_PASSWORD}`).toString("base64")}`

// Set test password for Server.App()
Server.setTestPassword(TEST_PASSWORD)

describe("session.list", () => {
  test("filters by directory", async () => {
    await Instance.provide({
      directory: projectRoot,
      fn: async () => {
        const app = Server.App()

        const first = await Session.create({})

        const otherDir = path.join(projectRoot, "..", "__session_list_other")
        const second = await Instance.provide({
          directory: otherDir,
          fn: async () => Session.create({}),
        })

        const response = await app.request(`/session?directory=${encodeURIComponent(projectRoot)}`, {
          headers: {
            "Authorization": authHeader,
          },
        })
        expect(response.status).toBe(200)

        const body = (await response.json()) as unknown[]
        const ids = body
          .map((s) => (typeof s === "object" && s && "id" in s ? (s as { id: string }).id : undefined))
          .filter((x): x is string => typeof x === "string")

        expect(ids).toContain(first.id)
        expect(ids).not.toContain(second.id)
      },
    })
  })
})
