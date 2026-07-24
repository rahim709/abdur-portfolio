import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { getLeetCodeActivity } from "@/lib/leetcode"

describe("getLeetCodeActivity", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  function profileResponse() {
    return {
      ok: true,
      json: async () => ({
        data: {
          matchedUser: {
            submitStats: {
              acSubmissionNum: [
                { difficulty: "All", count: 700, submissions: 1200 },
                { difficulty: "Easy", count: 250, submissions: 400 },
                { difficulty: "Medium", count: 350, submissions: 600 },
                { difficulty: "Hard", count: 100, submissions: 200 },
              ],
            },
            profile: {
              ranking: 4548,
            },
          },
        },
      }),
    }
  }

  function contestResponse() {
    return {
      ok: true,
      json: async () => ({
        data: {
          userContestRanking: {
            attendedContestsCount: 12,
            rating: 1850,
            globalRanking: 5000,
            topPercentage: 10.5,
          },
        },
      }),
    }
  }

  function calendarResponse(submissionCalendar: Record<string, number>) {
    const currentYear = new Date().getFullYear()
    return {
      ok: true,
      json: async () => ({
        data: {
          matchedUser: {
            userCalendar: {
              activeYears: [currentYear],
              streak: 5,
              totalActiveDays: 100,
              submissionCalendar: JSON.stringify(submissionCalendar),
            },
          },
        },
      }),
    }
  }

  it("returns parsed LeetCode stats, calendar, and streaks on success", async () => {
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(profileResponse())
      .mockResolvedValueOnce(contestResponse())
      .mockResolvedValueOnce(
        calendarResponse({
          [yesterday]: 2,
          [today]: 5,
        })
      )

    const result = await getLeetCodeActivity("CoderRahim")

    expect(result).not.toBeNull()
    expect(result?.totalSolved).toBe(700)
    expect(result?.easySolved).toBe(250)
    expect(result?.mediumSolved).toBe(350)
    expect(result?.hardSolved).toBe(100)
    expect(result?.ranking).toBe(4548)
    expect(result?.contestRating).toBe(1850)
    expect(result?.attendedContests).toBe(12)
    expect(result?.totalSubmissions).toBe(7)
    expect(result?.currentStreak).toBe(2)
    expect(result?.longestStreak).toBe(2)
    expect(result?.weeks.length).toBeGreaterThan(0)
  })

  it("returns null when the profile response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    })

    const result = await getLeetCodeActivity("CoderRahim")
    expect(result).toBeNull()
  })

  it("returns null when the profile response contains errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ errors: [{ message: "User not found" }] }),
    })

    const result = await getLeetCodeActivity("CoderRahim")
    expect(result).toBeNull()
  })

  it("returns null when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

    const result = await getLeetCodeActivity("CoderRahim")
    expect(result).toBeNull()
  })

  it("handles missing contest data gracefully", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            matchedUser: {
              submitStats: {
                acSubmissionNum: [{ difficulty: "All", count: 100, submissions: 200 }],
              },
              profile: {
                ranking: 10000,
              },
            },
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            userContestRanking: null,
          },
        }),
      })
      .mockResolvedValueOnce(
        calendarResponse({
          [new Date().toISOString().split("T")[0]]: 1,
        })
      )

    const result = await getLeetCodeActivity("CoderRahim")

    expect(result).not.toBeNull()
    expect(result?.totalSolved).toBe(100)
    expect(result?.contestRating).toBeNull()
    expect(result?.attendedContests).toBeNull()
  })
})
