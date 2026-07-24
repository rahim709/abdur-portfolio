import { IconType } from "react-icons"
import {
  FaMapMarkerAlt,
  FaCode,
  FaLanguage,
  FaGamepad,
  FaUniversity,
  FaSkiing,
  FaBuilding,
  FaTools,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaBriefcase,
  FaServer,
  FaDatabase,
  FaDesktop,
  FaLightbulb,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import LeetCodeIcon from "@/components/icons/LeetCodeIcon"

export const homeIntroConfig = {
  name: "Abdur Rahim",

  shortName: "Abdur Rahim",

  introParagraphs: [
    "4th-year CS student and full-stack developer. Passionate about turning complex ideas into performant web apps. Active problem solver dedicated to crafting meaningful software."
  ],

  facts: {
    company: "",
    education: "",
    location: "",
    languages: "",
    role: "",
  },

  additionalFacts: [
    { icon: FaCode, label: "Full-Stack Developer" },
    { icon: FaBriefcase, label: "Freelancer" },
    { icon: FaServer, label: "MERN Developer" },
    { icon: FaDatabase, label: "Backend Developer" },
    { icon: FaDesktop, label: "Frontend Developer" },
    { icon: FaLightbulb, label: "Problem Solver" },
    { icon: FaGithub, label: "Open Source Contributor" },
  ] as Array<{ icon: IconType; label: string }>,

  workItemsToShow: 3,

  projectsToShow: 4,
}

export const paginationConfig = {
  workItemsPerPage: 6,

  projectsPerPage: 6,
}

export const footerConfig = {
  copyrightName: "Abdur Rahim",

  socialLinks: {
    github: "https://github.com/rahim709",
    linkedin: "https://www.linkedin.com/in/abdur-rahim-422a83271/",
    twitter: "https://x.com/abdur_rahim88",
    leetcode: "https://leetcode.com/u/CoderRahim/",
    email: "abdurrahimer2004@gmail.com",
  },
}

export const factIconMap: Record<keyof typeof homeIntroConfig.facts, IconType> = {
  company: FaBuilding,
  education: FaUniversity,
  location: FaMapMarkerAlt,
  languages: FaLanguage,
  role: FaTools,
}

export const socialIconMap: Record<
  keyof typeof footerConfig.socialLinks,
  { icon?: IconType; label: string }
> = {
  github: { icon: FaGithub, label: "GitHub" },
  linkedin: { icon: FaLinkedin, label: "LinkedIn" },
  twitter: { icon: FaXTwitter, label: "X" },
  leetcode: { icon: LeetCodeIcon, label: "LeetCode" },
  email: { icon: FaEnvelope, label: "Email" },
}
