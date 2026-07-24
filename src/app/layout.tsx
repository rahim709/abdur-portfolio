import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Gabarito } from "next/font/google"
import { ThemeProvider } from "next-themes"
import React, { ReactNode } from "react"
import { AccentThemeProvider } from "@/components/AccentThemeProvider"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { PageHeaderProvider } from "@/components/PageHeaderProvider"
import { siteMetadata } from "@/data/metadata"
import { cn } from "@/lib/utils"

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export { metadata } from "@/data/metadata"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme={siteMetadata.theme}
      className={`${gabarito.className} ${gabarito.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`antialiased flex flex-col min-h-screen transition-colors overscroll-none ${gabarito.className} ${gabarito.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <AccentThemeProvider>
            <PageHeaderProvider>
              {/* Dot Background Layer */}
              <div
                className={cn(
                  "fixed inset-0 -z-10",
                  "bg-[radial-gradient(circle,#d1d5db_1px,transparent_1px)]",
                  "dark:bg-[radial-gradient(circle,#3f3f46_1px,transparent_1px)]",
                  "bg-size-[30px_30px]",
                  "mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
                )}
              />
              <Header />
              <main className="grow container mx-auto px-4 py-6">
                {children}
                <Analytics />
                <SpeedInsights />
              </main>
              <Footer />
            </PageHeaderProvider>
          </AccentThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
