import HomeContent from "@/components/home/HomeContent"
import { footerConfig, homeIntroConfig } from "@/data/content"
import { siteMetadata } from "@/data/metadata"
import { getGitHubActivity } from "@/lib/github"
import { getLeetCodeActivity } from "@/lib/leetcode"
import { getAllProjects, getAllWorkItems } from "@/lib/mdx"
import type { Person, WithContext } from "schema-dts"

export default async function Home() {
  const [work, projects, githubActivity, leetCodeActivity] = await Promise.all([
    getAllWorkItems(),
    getAllProjects(),
    getGitHubActivity("rahim709"),
    getLeetCodeActivity("CoderRahim"),
  ])

  const sameAs = Object.values(footerConfig.socialLinks).filter(url => url && url !== "/")

  const jsonLd: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteMetadata.author.name,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
    jobTitle: homeIntroConfig.facts.role,
    ...(sameAs.length > 0 && { sameAs }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeContent
        work={work}
        projects={projects}
        githubActivity={githubActivity}
        leetCodeActivity={leetCodeActivity}
      />
    </>
  )
}
