export type pageParams = Promise<{ slug: string }>

export interface ProjectProps {
  slug: string
  title: string
  image: string
  description: string
  startDate: string
  endDate: string
  techStack: string[]
  teamSize?: number
  role?: string
  githubUrl?: string
  paperUrl?: string
}

export type { ProjectFrontmatter } from "@/lib/schemas"

export interface WorkItemProps {
  slug: string
  company: string
  title: string
  start: string
  end: string
  description: string
  locations: string[]
  logoUrl?: string
  companyUrl?: string
  techStack?: string[]
}

export type { WorkItemFrontmatter } from "@/lib/schemas"

export type tagPageParams = Promise<{ tag: string }>

export type Theme =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "rose"
  | "teal"
  | "indigo"
  | "amber"
  | "cyan"
  | "violet"

export interface SiteMetadata {
  theme: Theme
  title: string
  description: string
  keywords: string[]
  author: {
    name: string
    url: string
  }
  siteUrl: string
  social?: {
    twitter?: string
  }
  ogImage: string | null
}
