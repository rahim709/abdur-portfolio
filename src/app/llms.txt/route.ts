import { NextResponse } from "next/server"
import { siteMetadata } from "@/data/metadata"
import { getAllProjects, getAllWorkItems } from "@/lib/mdx"
import { formatDateRange } from "@/lib/utils"

export async function GET() {
  const base = siteMetadata.siteUrl
  const [projects, work] = await Promise.all([getAllProjects(), getAllWorkItems()])

  const projectsSection = projects
    .map(p => {
      const period =
        p.startDate && p.endDate ? formatDateRange(p.startDate, p.endDate) : "Ongoing"
      const tech = p.techStack.join(", ")
      return `- [${p.title}](${base}/projects/${p.slug}) (${period}, ${tech}): ${p.description}`
    })
    .join("\n")

  const workSection = work
    .map(w => {
      const period = formatDateRange(w.start, w.end)
      return `- [${w.company}](${base}/work/${w.slug}): ${w.title}, ${period}. ${w.description}`
    })
    .join("\n")

  const content = `# ${siteMetadata.title}

> ${siteMetadata.description}

## Projects

${projectsSection}

## Work Experience

${workSection}

## Site

- [Home](${base}): Introduction and previews of recent activity.
- [Projects](${base}/projects): All projects.
- [Work](${base}/work): Full work history.
`

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
