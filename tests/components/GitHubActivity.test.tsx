import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import GitHubActivity from "@/components/home/GitHubActivity"

const baseActivity = {
  totalContributions: 1234,
  totalRepos: 42,
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

describe("GitHubActivity", () => {
  it("renders the fallback message when activity is null", () => {
    render(<GitHubActivity activity={null} />)
    expect(screen.getByText("GitHub Activity")).toBeDefined()
    expect(screen.getByText(/GITHUB_TOKEN/i)).toBeDefined()
  })

  it("renders all stat cards when activity is provided", () => {
    render(<GitHubActivity activity={baseActivity} />)
    expect(screen.getByText("GitHub Activity")).toBeDefined()
    expect(screen.getByText("1,234")).toBeDefined()
    expect(screen.getByText("42")).toBeDefined()
    expect(screen.getByText("7")).toBeDefined()
    expect(screen.getByText("21")).toBeDefined()
    expect(screen.getByText("Total Contributions")).toBeDefined()
    expect(screen.getByText("Total Repositories")).toBeDefined()
    expect(screen.getByText("Current Streak")).toBeDefined()
    expect(screen.getByText("Longest Streak")).toBeDefined()
  })

  it("renders a link to the GitHub profile", () => {
    render(<GitHubActivity activity={null} />)
    const link = screen.getByText("@rahim709").closest("a")
    expect(link?.getAttribute("href")).toBe("https://github.com/rahim709")
  })
})
