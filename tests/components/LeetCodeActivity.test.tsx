import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import LeetCodeActivity from "@/components/home/LeetCodeActivity"

const baseActivity = {
  totalSolved: 700,
  easySolved: 250,
  mediumSolved: 350,
  hardSolved: 100,
  ranking: 4548,
  contestRating: 1850,
  attendedContests: 12,
  totalSubmissions: 1200,
  currentStreak: 7,
  longestStreak: 21,
  weeks: [
    {
      days: [
        { date: "2024-01-01", count: 0, level: 0 as const },
        { date: "2024-01-02", count: 3, level: 2 as const },
      ],
    },
  ],
}

describe("LeetCodeActivity", () => {
  it("renders the fallback message when activity is null", () => {
    render(<LeetCodeActivity activity={null} />)
    expect(screen.getByText("LeetCode Activity")).toBeDefined()
    expect(screen.getByText(/LeetCode API is unreachable/i)).toBeDefined()
  })

  it("renders all stat cards and solved breakdown when activity is provided", () => {
    render(<LeetCodeActivity activity={baseActivity} />)
    expect(screen.getByText("LeetCode Activity")).toBeDefined()
    expect(screen.getAllByText("700").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("250")).toBeDefined()
    expect(screen.getByText("350")).toBeDefined()
    expect(screen.getByText("100")).toBeDefined()
    expect(screen.getByText("1,200")).toBeDefined()
    expect(screen.getByText("7")).toBeDefined()
    expect(screen.getByText("21")).toBeDefined()
    expect(screen.getByText("4,548")).toBeDefined()
    expect(screen.getByText("1,850")).toBeDefined()
    expect(screen.getByText("12")).toBeDefined()
    expect(screen.getAllByText("Total Solved").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("Easy")).toBeDefined()
    expect(screen.getByText("Medium")).toBeDefined()
    expect(screen.getByText("Hard")).toBeDefined()
    expect(screen.getByText("Total Submissions")).toBeDefined()
    expect(screen.getByText("Current Streak")).toBeDefined()
    expect(screen.getByText("Longest Streak")).toBeDefined()
    expect(screen.getByText("Global Ranking")).toBeDefined()
    expect(screen.getByText("Contest Rating")).toBeDefined()
    expect(screen.getByText("Contests Attended")).toBeDefined()
  })

  it("renders a link to the LeetCode profile", () => {
    render(<LeetCodeActivity activity={null} />)
    const link = screen.getByText("@CoderRahim").closest("a")
    expect(link?.getAttribute("href")).toBe("https://leetcode.com/u/CoderRahim/")
  })
})
