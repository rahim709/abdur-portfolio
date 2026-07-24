import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { getGitHubActivity } from "@/lib/github"

describe("getGitHubActivity", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    delete process.env.GITHUB_TOKEN
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it("returns null when GITHUB_TOKEN is not set", async () => {
    const result = await getGitHubActivity("rahim709")
    expect(result).toBeNull()
  })

  it("returns parsed contribution data, streaks, and repo count on success", async () => {
    process.env.GITHUB_TOKEN = "test-token"

    const today = new Date().toISOString()

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            user: {
              createdAt: today,
              repositories: { totalCount: 42 },
            },
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            user: {
              contributionsCollection: {
                contributionCalendar: {
                  totalContributions: 10,
                  weeks: [
                    {
                      contributionDays: [
                        { contributionCount: 0, date: "2024-01-01", contributionLevel: "NONE" },
                        {
                          contributionCount: 5,
                          date: "2024-01-02",
                          contributionLevel: "THIRD_QUARTILE",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        }),
      })

    const result = await getGitHubActivity("rahim709")

    expect(result).not.toBeNull()
    expect(result?.totalContributions).toBe(10)
    expect(result?.totalRepos).toBe(42)
    expect(result?.currentStreak).toBe(1)
    expect(result?.longestStreak).toBe(1)
    expect(result?.weeks).toHaveLength(1)
    expect(result?.weeks[0].days).toHaveLength(2)
    expect(result?.weeks[0].days[0]).toEqual({ date: "2024-01-01", count: 0, level: 0 })
    expect(result?.weeks[0].days[1]).toEqual({ date: "2024-01-02", count: 5, level: 3 })
  })

  it("calculates current streak correctly", async () => {
    process.env.GITHUB_TOKEN = "test-token"

    const today = new Date().toISOString()
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0]

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            user: {
              createdAt: today,
              repositories: { totalCount: 10 },
            },
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            user: {
              contributionsCollection: {
                contributionCalendar: {
                  totalContributions: 3,
                  weeks: [
                    {
                      contributionDays: [
                        {
                          contributionCount: 1,
                          date: twoDaysAgo,
                          contributionLevel: "FIRST_QUARTILE",
                        },
                        {
                          contributionCount: 2,
                          date: yesterday,
                          contributionLevel: "FIRST_QUARTILE",
                        },
                        {
                          contributionCount: 3,
                          date: today.split("T")[0],
                          contributionLevel: "SECOND_QUARTILE",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        }),
      })

    const result = await getGitHubActivity("rahim709")

    expect(result).not.toBeNull()
    expect(result?.currentStreak).toBe(3)
    expect(result?.longestStreak).toBe(3)
  })

  it("returns null when the user response is not ok", async () => {
    process.env.GITHUB_TOKEN = "test-token"

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    })

    const result = await getGitHubActivity("rahim709")
    expect(result).toBeNull()
  })

  it("returns null when the user response contains errors", async () => {
    process.env.GITHUB_TOKEN = "test-token"

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ errors: [{ message: "Bad credentials" }] }),
    })

    const result = await getGitHubActivity("rahim709")
    expect(result).toBeNull()
  })

  it("returns null when fetch throws", async () => {
    process.env.GITHUB_TOKEN = "test-token"

    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

    const result = await getGitHubActivity("rahim709")
    expect(result).toBeNull()
  })
})
