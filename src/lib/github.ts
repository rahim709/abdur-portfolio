export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface ContributionWeek {
  days: ContributionDay[]
}

export interface GitHubActivityData {
  totalContributions: number
  totalRepos: number
  currentStreak: number
  longestStreak: number
  weeks: ContributionWeek[]
}

interface RawDay {
  contributionCount: number
  date: string
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE"
}

interface RawWeek {
  contributionDays: RawDay[]
}

const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

function normalizeWeeks(weeks: RawWeek[]): ContributionWeek[] {
  return weeks.map(week => ({
    days: week.contributionDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: levelMap[day.contributionLevel] ?? 0,
    })),
  }))
}

function calculateStreaks(days: ContributionDay[]) {
  let currentStreak = 0
  let longestStreak = 0
  let activeStreak = 0

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      activeStreak++
      if (activeStreak > longestStreak) {
        longestStreak = activeStreak
      }
    } else {
      activeStreak = 0
    }
  }

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++
    } else {
      break
    }
  }

  return { currentStreak, longestStreak }
}

async function fetchCalendar(
  username: string,
  token: string,
  from: Date,
  to: Date
): Promise<{ totalContributions: number; weeks: RawWeek[] } | null> {
  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
    next: { revalidate: 21600 },
  })

  if (!response.ok) {
    return null
  }

  const json = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions: number
            weeks: RawWeek[]
          }
        }
      }
    }
    errors?: unknown[]
  }

  if (json.errors || !json.data?.user?.contributionsCollection?.contributionCalendar) {
    return null
  }

  return json.data.user.contributionsCollection.contributionCalendar
}

export async function getGitHubActivity(username: string): Promise<GitHubActivityData | null> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return null
  }

  try {
    const userQuery = `
      query($login: String!) {
        user(login: $login) {
          createdAt
          repositories(ownerAffiliations: OWNER) {
            totalCount
          }
        }
      }
    `

    const userResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userQuery, variables: { login: username } }),
      next: { revalidate: 21600 },
    })

    if (!userResponse.ok) {
      return null
    }

    const userJson = (await userResponse.json()) as {
      data?: {
        user?: {
          createdAt: string
          repositories: { totalCount: number }
        }
      }
      errors?: unknown[]
    }

    if (userJson.errors || !userJson.data?.user) {
      return null
    }

    const createdAt = new Date(userJson.data.user.createdAt)
    const totalRepos = userJson.data.user.repositories.totalCount
    const now = new Date()

    const ranges: { from: Date; to: Date }[] = []
    let current = new Date(createdAt.getFullYear(), 0, 1)
    while (current <= now) {
      const from = new Date(current)
      const to = new Date(current.getFullYear(), 11, 31, 23, 59, 59)
      if (to > now) {
        to.setTime(now.getTime())
      }
      ranges.push({ from, to })
      current = new Date(current.getFullYear() + 1, 0, 1)
    }

    let totalContributions = 0
    const allWeeks: RawWeek[] = []

    for (const range of ranges) {
      const calendar = await fetchCalendar(username, token, range.from, range.to)
      if (!calendar) {
        return null
      }
      totalContributions += calendar.totalContributions
      allWeeks.push(...calendar.weeks)
    }

    const weeks = normalizeWeeks(allWeeks)
    const days = weeks.flatMap(week => week.days)
    const { currentStreak, longestStreak } = calculateStreaks(days)

    return {
      totalContributions,
      totalRepos,
      currentStreak,
      longestStreak,
      weeks,
    }
  } catch {
    return null
  }
}
