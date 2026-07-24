import Link from "next/link"
import { footerConfig, socialIconMap } from "@/data/content"
import { cn } from "@/lib/utils"

function SocialLinks() {
  return (
    <>
      {Object.entries(footerConfig.socialLinks)
        .filter(([_, url]) => url && url.trim() !== "")
        .map(([platform, url]) => {
          const platformKey = platform as keyof typeof socialIconMap
          const { icon: Icon, label } = socialIconMap[platformKey]

          // Add mailto: prefix for email if not already present
          const href = platform === "email" && !url.startsWith("mailto:") ? `mailto:${url}` : url

          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("mailto") ? "_blank" : undefined}
              className={cn(
                "group relative flex items-center justify-center w-11 h-11",
                "rounded-lg border border-gray-300 dark:border-gray-700",
                "bg-gray-100 dark:bg-gray-800",
                "text-gray-700 dark:text-gray-300",
                "hover:border-accent-500 dark:hover:border-accent-400",
                "hover:bg-accent-500/10 dark:hover:bg-accent-500/10",
                "hover:text-accent-600 dark:hover:text-accent-400",
                "transition-all duration-200",
                "hover:scale-110 hover:shadow-md",
                "active:scale-95",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
              )}
            >
              {Icon && <Icon className="w-5 h-5" />}
            </Link>
          )
        })}
    </>
  )
}

export default function Footer() {
  return (
    <footer
      className={cn(
        "relative mt-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400",
        "px-4 border-t border-gray-200 dark:border-gray-900",
        "bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm",
        "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0",
        "before:h-px before:bg-linear-to-r before:from-transparent",
        "before:via-gray-500/30 before:to-transparent"
      )}
      id="footerPortfolio"
    >
      {/* Social Links Grid */}
      <div className="flex justify-center flex-wrap gap-4 mb-4">
        <SocialLinks />
      </div>

      {/* Divider */}
      <div className="max-w-xs mx-auto mb-4 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

      {/* Copyright */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} {footerConfig.copyrightName}. All rights reserved.
      </p>
    </footer>
  )
}
