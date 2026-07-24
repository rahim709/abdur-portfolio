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

  // Format: "2020-01", "2020/01"
  const dashMatch = dateStr.match(/^(\d{4})[-/](\d{2})$/)
  if (dashMatch) {
    return new Date(parseInt(dashMatch[1]), parseInt(dashMatch[2]) - 1, 1)
  }

  // Fallback to Date constructor
  return new Date(dateStr)
}

export function formatDateRange(start: string, end: string): string {
  const startDate = parseFlexibleDate(start)
  const endDate = parseFlexibleDate(end)

  if (Number.isNaN(startDate.getTime())) {
    throw new Error(`formatDateRange: invalid start date "${start}"`)
  }
  if (Number.isNaN(endDate.getTime())) {
    throw new Error(`formatDateRange: invalid end date "${end}"`)
  }
  if (start !== end && startDate.getTime() > endDate.getTime()) {
    throw new Error(`formatDateRange: start date "${start}" is after end date "${end}"`)
  }

  return start === end ? start : `${start} – ${end}`
}

export function formatDuration(start: string, end: string): string {
  const [startYear, startMonth] = start.split("-")
  const [endYear, endMonth] = end === PRESENT ? ["", ""] : end.split("-")

  const formatMonth = (month: string) => {
    const date = new Date(2000, parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short" })
  }

  if (end === PRESENT) {
    return `${formatMonth(startMonth)} ${startYear} – ${PRESENT}`
  }

  if (start === end) {
    return `${formatMonth(startMonth)} ${startYear}`
  }

  if (startYear === endYear) {
    return `${formatMonth(startMonth)} – ${formatMonth(endMonth)} ${startYear}`
  }

  return `${formatMonth(startMonth)} ${startYear} – ${formatMonth(endMonth)} ${endYear}`
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
  return sortByPresentAwareDate(
    projects,
    sortOrder,
    item => item.startDate,
    item => item.endDate,
    item => item.title
  )
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
