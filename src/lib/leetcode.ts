export interface LeetCodeActivityData {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  ranking: number | null
  contestRating: number | null
  attendedContests: number | null
  totalSubmissions: number
  currentStreak: number
  longestStreak: number
  weeks: LeetCodeWeek[]
}

export interface LeetCodeDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface LeetCodeWeek {
  days: LeetCodeDay[]
}

interface LeetCodeSubmitStats {
  difficulty: string
  count: number
  submissions: number
}

interface RawCalendar {
  activeYears: number[]
  streak: number
  totalActiveDays: number
  submissionCalendar: string
}

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

function buildWeeks(dayMap: Record<string, number>): LeetCodeWeek[] {
  const dates = Object.keys(dayMap).sort()
  if (dates.length === 0) return []

  const startDate = new Date(dates[0])
  const endDate = new Date(dates[dates.length - 1])

  const startDay = startDate.getDay()
  const alignedStart = new Date(startDate)
  alignedStart.setDate(startDate.getDate() - startDay)

  const days: LeetCodeDay[] = []
  const current = new Date(alignedStart)

  while (current <= endDate) {
    const dateKey = current.toISOString().split("T")[0]
    const count = dayMap[dateKey] ?? 0
    days.push({ date: dateKey, count, level: getLevel(count) })
    current.setDate(current.getDate() + 1)
  }

  const weeks: LeetCodeWeek[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push({ days: days.slice(i, i + 7) })
  }

  return weeks
}

function calculateStreaks(dayMap: Record<string, number>) {
  const today = new Date().toISOString().split("T")[0]
  const sortedDates = Object.keys(dayMap)
    .filter(d => d <= today)
    .sort()

  let currentStreak = 0
  let longestStreak = 0
  let activeStreak = 0

  for (const date of sortedDates) {
    if (dayMap[date] > 0) {
      activeStreak++
      if (activeStreak > longestStreak) {
        longestStreak = activeStreak
      }
    } else {
      activeStreak = 0
    }
  }

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    if (dayMap[sortedDates[i]] > 0) {
      currentStreak++
    } else {
      break
    }
  }

  return { currentStreak, longestStreak }
}

async function fetchProfile(username: string): Promise<{
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  ranking: number | null
}> {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
        }
      }
    }
  `

  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 21600 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch LeetCode profile")
  }

  const json = (await response.json()) as {
    data?: {
      matchedUser?: {
        submitStats?: {
          acSubmissionNum: LeetCodeSubmitStats[]
        }
        profile?: {
          ranking?: number
        }
      }
    }
    errors?: unknown[]
  }

  if (json.errors || !json.data?.matchedUser) {
    throw new Error("LeetCode profile not found")
  }

  const submissionStats = json.data.matchedUser.submitStats?.acSubmissionNum ?? []
  return {
    totalSolved: submissionStats.find(s => s.difficulty === "All")?.count ?? 0,
    easySolved: submissionStats.find(s => s.difficulty === "Easy")?.count ?? 0,
    mediumSolved: submissionStats.find(s => s.difficulty === "Medium")?.count ?? 0,
    hardSolved: submissionStats.find(s => s.difficulty === "Hard")?.count ?? 0,
    ranking: json.data.matchedUser.profile?.ranking ?? null,
  }
}

async function fetchContest(username: string): Promise<{
  contestRating: number | null
  attendedContests: number | null
}> {
  const query = `
    query userContestRanking($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
      }
    }
  `

  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 21600 },
  })

  if (!response.ok) {
    return { contestRating: null, attendedContests: null }
  }

  const json = (await response.json()) as {
    data?: {
      userContestRanking?: {
        attendedContestsCount: number
        rating: number
        globalRanking: number
        topPercentage: number
      } | null
    }
    errors?: unknown[]
  }

  if (json.errors || !json.data?.userContestRanking) {
    return { contestRating: null, attendedContests: null }
  }

  return {
    contestRating: json.data.userContestRanking.rating ?? null,
    attendedContests: json.data.userContestRanking.attendedContestsCount ?? null,
  }
}

async function fetchCalendarYear(username: string, year: number): Promise<RawCalendar | null> {
  const query = `
    query userProfileCalendar($username: String!, $year: Int!) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
        }
      }
    }
  `

  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({ query, variables: { username, year } }),
    next: { revalidate: 21600 },
  })

  if (!response.ok) {
    return null
  }

  const json = (await response.json()) as {
    data?: {
      matchedUser?: {
        userCalendar?: RawCalendar
      }
    }
    errors?: unknown[]
  }

  if (json.errors || !json.data?.matchedUser?.userCalendar) {
    return null
  }

  return json.data.matchedUser.userCalendar
}

export async function getLeetCodeActivity(username: string): Promise<LeetCodeActivityData | null> {
  try {
    const [profile, contest] = await Promise.all([fetchProfile(username), fetchContest(username)])

    const currentYear = new Date().getFullYear()
    const currentCalendar = await fetchCalendarYear(username, currentYear)

    if (!currentCalendar) {
      return {
        ...profile,
        ...contest,
        totalSubmissions: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeks: [],
      }
    }

    const activeYears =
      currentCalendar.activeYears.length > 0 ? currentCalendar.activeYears : [currentYear]
    const dayMap: Record<string, number> = {}

    for (const year of activeYears) {
      const calendar =
        year === currentYear ? currentCalendar : await fetchCalendarYear(username, year)
      if (!calendar) continue

      const submissions = JSON.parse(calendar.submissionCalendar) as Record<string, number>
      for (const [date, count] of Object.entries(submissions)) {
        dayMap[date] = (dayMap[date] ?? 0) + count
      }
    }

    const weeks = buildWeeks(dayMap)
    const totalSubmissions = Object.values(dayMap).reduce((sum, count) => sum + count, 0)
    const { currentStreak, longestStreak } = calculateStreaks(dayMap)

    return {
      ...profile,
      ...contest,
      totalSubmissions,
      currentStreak,
      longestStreak,
      weeks,
    }
  } catch {
    return null
  }
}
