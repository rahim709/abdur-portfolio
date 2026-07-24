import type { SiteMetadata } from "@/lib/types"
import type { Metadata } from "next"

export const siteMetadata: SiteMetadata = {
  theme: "blue",

  title: "Abdur Rahim | Full Stack Developer",

  description:
    "Portfolio of Abdur Rahim, a 4th-year Computer Science student and full-stack developer building scalable web apps with React, Next.js, Node.js, TypeScript, and Tailwind CSS.",

  keywords: [
    "Abdur Rahim",
    "Developer",
    "Software Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Freelancer",
    "Next.js",
    "React",
    "HTML",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "MongoDB",
    "MySQL",
    "Supabase",
    "Redis",
    "Open Source",
    "Web Development",
    "Portfolio",
  ],

  author: {
    name: "Abdur Rahim",
    url: "https://github.com/rahim709",
  },

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdurrahim.vercel.app",

  social: {},

  ogImage: null,
}

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author.name, url: siteMetadata.author.url }],
  creator: siteMetadata.author.name,
  publisher: siteMetadata.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.ico",
    apple: "/icons/favicon.ico",
  },
  metadataBase: new URL(siteMetadata.siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    ...(siteMetadata.ogImage && {
      images: [
        {
          url: siteMetadata.ogImage,
          width: 1200,
          height: 630,
          alt: siteMetadata.title,
        },
      ],
    }),
  },
  ...(siteMetadata.social?.twitter && {
    twitter: {
      card: "summary_large_image" as const,
      title: siteMetadata.title,
      description: siteMetadata.description,
      creator: siteMetadata.social.twitter,
      ...(siteMetadata.ogImage && { images: [siteMetadata.ogImage] }),
    },
  }),
  category: "technology",
}
