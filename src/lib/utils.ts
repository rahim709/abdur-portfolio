import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PRESENT } from "@/lib/constants"
import type { ProjectProps, WorkItemProps } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
}

function parseFlexibleDate(dateStr: string): Date {
  if (dateStr.toLowerCase().includes("present") || dateStr.toLowerCase().includes("current")) {
    return new Date()
  }

  // Format: "Jan 2020", "January 2020"
  const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (monthYearMatch) {
    return new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`)
  }

  // Format: "2020-01-15", "2020/1/15", "2020-01-5"
  const dayMatch = dateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (dayMatch) {
    return new Date(parseInt(dayMatch[1]), parseInt(dayMatch[2]) - 1, parseInt(dayMatch[3]))
  }

  // Format: "2020-01", "2020/01", "2020-1"
  const dashMatch = dateStr.match(/^(\d{4})[-/](\d{1,2})$/)
  if (dashMatch) {
    return new Date(parseInt(dashMatch[1]), parseInt(dashMatch[2]) - 1, 1)
  }

  // Fallback to Date constructor
  return new Date(dateStr)
}

function isDayLevelDate(dateStr: string): boolean {
  return /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(dateStr)
}

export function formatDateRange(start: string, end: string): string {
  const startIsPresent = start.toLowerCase() === PRESENT.toLowerCase()
  const endIsPresent = end.toLowerCase() === PRESENT.toLowerCase()

  if (startIsPresent && endIsPresent) {
    return PRESENT
  }

  const startDate = parseFlexibleDate(start)
  const endDate = parseFlexibleDate(end)

  if (!startIsPresent && Number.isNaN(startDate.getTime())) {
    throw new Error(`formatDateRange: invalid start date "${start}"`)
  }
  if (!endIsPresent && Number.isNaN(endDate.getTime())) {
    throw new Error(`formatDateRange: invalid end date "${end}"`)
  }
  if (!startIsPresent && !endIsPresent && startDate.getTime() > endDate.getTime()) {
    throw new Error(`formatDateRange: start date "${start}" is after end date "${end}"`)
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const startMonthYear = startIsPresent ? PRESENT : formatMonthYear(startDate)

  if (endIsPresent) {
    return `${startMonthYear} - ${PRESENT}`
  }

  const endMonthYear = formatMonthYear(endDate)
  if (startMonthYear === endMonthYear) {
    return startMonthYear
  }

  return `${startMonthYear} - ${endMonthYear}`
}

export function formatDuration(start: string, end: string): string {
  const startIsPresent = start.toLowerCase() === PRESENT.toLowerCase()
  const endIsPresent = end.toLowerCase() === PRESENT.toLowerCase()

  if (startIsPresent && endIsPresent) {
    return PRESENT
  }

  const startDate = parseFlexibleDate(start)
  const endDate = parseFlexibleDate(end)

  if (!startIsPresent && Number.isNaN(startDate.getTime())) {
    throw new Error(`formatDuration: invalid start date "${start}"`)
  }
  if (!endIsPresent && Number.isNaN(endDate.getTime())) {
    throw new Error(`formatDuration: invalid end date "${end}"`)
  }

  const startDayLevel = !startIsPresent && isDayLevelDate(start)
  const endDayLevel = !endIsPresent && isDayLevelDate(end)
  const useDayLevel = startDayLevel || endDayLevel

  const formatDayMonth = (date: Date) => {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  const formatDayMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short" })
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  if (endIsPresent) {
    if (useDayLevel) {
      return `${formatDayMonthYear(startDate)} - ${PRESENT}`
    }
    return `${formatMonthYear(startDate)} - ${PRESENT}`
  }

  if (startIsPresent) {
    if (useDayLevel) {
      return `${PRESENT} - ${formatDayMonthYear(endDate)}`
    }
    return `${PRESENT} - ${formatMonthYear(endDate)}`
  }

  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()
  const startMonth = startDate.getMonth()
  const endMonth = endDate.getMonth()

  if (startYear === endYear && startMonth === endMonth) {
    if (useDayLevel) {
      return `${formatDayMonth(startDate)} - ${formatDayMonth(endDate)} ${startYear}`
    }
    return formatMonthYear(startDate)
  }

  if (startYear === endYear) {
    if (useDayLevel) {
      return `${formatDayMonth(startDate)} - ${formatDayMonth(endDate)} ${startYear}`
    }
    return `${formatMonth(startDate)} - ${formatMonth(endDate)} ${startYear}`
  }

  if (useDayLevel) {
    return `${formatDayMonthYear(startDate)} - ${formatDayMonthYear(endDate)}`
  }

  return `${formatMonthYear(startDate)} - ${formatMonthYear(endDate)}`
}

export function calculateDuration(start: string, end: string): string {
  const startDate = parseFlexibleDate(start)
  const endDate = parseFlexibleDate(end)

  // Calculate difference in months
  const yearDiff = endDate.getFullYear() - startDate.getFullYear()
  const monthDiff = endDate.getMonth() - startDate.getMonth()
  const totalMonths = yearDiff * 12 + monthDiff

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0 && months === 0) {
    return "1 mo"
  } else if (years === 0) {
    return `${months} mo${months > 1 ? "s" : ""}`
  } else if (months === 0) {
    return `${years} yr${years > 1 ? "s" : ""}`
  } else {
    return `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`
  }
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function normalizeTechName(techName: string): string {
  return techName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[._]/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function diceCoefficient(a: string, b: string): number {
  if (!a.length || !b.length) return 0
  if (a === b) return 1

  const bigrams = (str: string) => {
    const s = str.toLowerCase()
    const pairs: string[] = []
    for (let i = 0; i < s.length - 1; i++) {
      pairs.push(s.slice(i, i + 2))
    }
    return pairs
  }

  const pairsA = bigrams(a)
  const pairsB = bigrams(b)
  if (pairsA.length === 0 || pairsB.length === 0) return 0

  const setB = new Set(pairsB)
  let matches = 0
  for (const pair of pairsA) {
    if (setB.has(pair)) matches++
  }
  return (2 * matches) / (pairsA.length + pairsB.length)
}

export function filterByValues<T>(
  items: T[],
  selected: string[],
  getValues: (item: T) => string[] | undefined
): T[] {
  if (selected.length === 0) return items
  return items.filter(item => {
    const values = getValues(item)
    return values ? selected.some(s => values.includes(s)) : false
  })
}

export function filterWorkItems(
  work: WorkItemProps[],
  selectedCompanies: string[]
): WorkItemProps[] {
  return filterByValues(work, selectedCompanies, item => [item.company])
}

export function filterProjects(
  projects: ProjectProps[],
  selectedTechStack: string[]
): ProjectProps[] {
  return filterByValues(projects, selectedTechStack, project => project.techStack)
}

export function sortByPresentAwareDate<T>(
  items: T[],
  sortOrder: "newest" | "oldest",
  getStart: (item: T) => string,
  getEnd: (item: T) => string,
  getLabel: (item: T) => string
): T[] {
  return [...items].sort((a, b) => {
    if (sortOrder === "newest") {
      const aIsPresent = getEnd(a) === PRESENT
      const bIsPresent = getEnd(b) === PRESENT
      if (aIsPresent && !bIsPresent) return -1
      if (!aIsPresent && bIsPresent) return 1
      if (aIsPresent && bIsPresent) return getLabel(a).localeCompare(getLabel(b))
      const endDiff = new Date(getEnd(b) || "").getTime() - new Date(getEnd(a) || "").getTime()
      if (endDiff !== 0) return endDiff
      return getLabel(a).localeCompare(getLabel(b))
    }
    return new Date(getStart(a) || "").getTime() - new Date(getStart(b) || "").getTime()
  })
}

export function sortWorkItems(
  work: WorkItemProps[],
  sortOrder: "newest" | "oldest"
): WorkItemProps[] {
  return sortByPresentAwareDate(
    work,
    sortOrder,
    item => item.start,
    item => item.end,
    item => item.company
  )
}

export function sortProjects(
  projects: ProjectProps[],
  sortOrder: "newest" | "oldest"
): ProjectProps[] {
  return [...projects].sort((a, b) => {
    // Explicit order takes highest precedence
    const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.order ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }

    // Both have the same explicit order — fall back to present-aware date sorting
    const aEnd = a.endDate ?? ""
    const bEnd = b.endDate ?? ""
    const aStart = a.startDate ?? ""
    const bStart = b.startDate ?? ""

    if (sortOrder === "newest") {
      const aIsPresent = aEnd.toLowerCase() === PRESENT.toLowerCase()
      const bIsPresent = bEnd.toLowerCase() === PRESENT.toLowerCase()
      if (aIsPresent && !bIsPresent) return -1
      if (!aIsPresent && bIsPresent) return 1
      if (aIsPresent && bIsPresent) return a.title.localeCompare(b.title)

      const aEndTime = aEnd ? parseFlexibleDate(aEnd).getTime() : 0
      const bEndTime = bEnd ? parseFlexibleDate(bEnd).getTime() : 0
      if (!Number.isNaN(aEndTime) && !Number.isNaN(bEndTime) && aEndTime !== bEndTime) {
        return bEndTime - aEndTime
      }
      return a.title.localeCompare(b.title)
    }

    const aStartTime = aStart ? parseFlexibleDate(aStart).getTime() : 0
    const bStartTime = bStart ? parseFlexibleDate(bStart).getTime() : 0
    if (!Number.isNaN(aStartTime) && !Number.isNaN(bStartTime) && aStartTime !== bStartTime) {
      return aStartTime - bStartTime
    }
    return a.title.localeCompare(b.title)
  })
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number } {
  const totalPages = Math.ceil(items.length / pageSize)
  if (page < 1) {
    return { items: [], totalPages }
  }
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), totalPages }
}
