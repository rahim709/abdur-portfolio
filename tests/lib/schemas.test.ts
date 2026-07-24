import { describe, it, expect } from "vitest"
import { WorkItemFrontmatterSchema, ProjectFrontmatterSchema } from "@/lib/schemas"

describe("WorkItemFrontmatterSchema", () => {
  const valid = {
    company: "Acme Corp",
    title: "Software Engineer",
    start: "Jan 2022",
    end: "Present",
    description: "Built scalable systems.",
    locations: ["Remote"],
  }

  it("parses valid frontmatter", () => {
    expect(WorkItemFrontmatterSchema.parse(valid)).toMatchObject(valid)
  })

  it("parses all optional fields", () => {
    const withOptionals = {
      ...valid,
      logoUrl: "/logo.svg",
      companyUrl: "https://acme.com",
      techStack: ["React", "Node.js"],
    }
    expect(WorkItemFrontmatterSchema.parse(withOptionals)).toEqual(withOptionals)
  })

  const requiredFields = ["company", "title", "start", "end", "description", "locations"] as const
  requiredFields.forEach(field => {
    it(`rejects missing ${field}`, () => {
      const { [field]: _f, ...rest } = valid as Record<string, unknown>
      expect(WorkItemFrontmatterSchema.safeParse(rest).success).toBe(false)
    })
  })

  it("rejects non-array locations", () => {
    expect(WorkItemFrontmatterSchema.safeParse({ ...valid, locations: "Remote" }).success).toBe(
      false
    )
  })

  it("rejects non-string location items", () => {
    expect(WorkItemFrontmatterSchema.safeParse({ ...valid, locations: [42] }).success).toBe(false)
  })

  it("rejects non-array techStack", () => {
    expect(WorkItemFrontmatterSchema.safeParse({ ...valid, techStack: "React" }).success).toBe(
      false
    )
  })
})

describe("ProjectFrontmatterSchema", () => {
  const valid = {
    title: "My App",
    image: "/img.png",
    description: "A cool project.",
    startDate: "2023-01",
    endDate: "2023-12",
    techStack: ["React", "TypeScript"],
  }

  it("parses valid frontmatter", () => {
    expect(ProjectFrontmatterSchema.parse(valid)).toMatchObject(valid)
  })

  it("parses all optional fields", () => {
    const withOptionals = {
      ...valid,
      teamSize: 3,
      role: "Lead Developer",
      githubUrl: "https://github.com/x/y",
      paperUrl: "https://arxiv.org/abs/1234",
    }
    expect(ProjectFrontmatterSchema.parse(withOptionals)).toEqual(withOptionals)
  })

  const requiredFields = [
    "title",
    "image",
    "description",
    "startDate",
    "endDate",
    "techStack",
  ] as const
  requiredFields.forEach(field => {
    it(`rejects missing ${field}`, () => {
      const { [field]: _f, ...rest } = valid as Record<string, unknown>
      expect(ProjectFrontmatterSchema.safeParse(rest).success).toBe(false)
    })
  })

  it("rejects non-array techStack", () => {
    expect(ProjectFrontmatterSchema.safeParse({ ...valid, techStack: "React" }).success).toBe(false)
  })

  it("rejects non-string techStack items", () => {
    expect(ProjectFrontmatterSchema.safeParse({ ...valid, techStack: [1, 2] }).success).toBe(false)
  })

  it("rejects non-number teamSize", () => {
    expect(ProjectFrontmatterSchema.safeParse({ ...valid, teamSize: "three" }).success).toBe(false)
  })
})
