"use client"

import { motion, MotionConfig } from "framer-motion"
import Image from "next/image"
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/home/animations"
import GitHubActivity from "@/components/home/GitHubActivity"
import LeetCodeActivity from "@/components/home/LeetCodeActivity"
import ProjectsPreview from "@/components/home/ProjectsPreview"
import QuickFacts from "@/components/home/QuickFacts"
import TechStack from "@/components/home/TechStack"
import WorkPreview from "@/components/home/WorkPreview"
import { footerConfig, homeIntroConfig } from "@/data/content"
import { ProjectProps, WorkItemProps } from "@/lib/types"
import type { GitHubActivityData } from "@/lib/github"
import type { LeetCodeActivityData } from "@/lib/leetcode"

interface HomeContentProps {
  work: WorkItemProps[]
  projects: ProjectProps[]
  githubActivity: GitHubActivityData | null
  leetCodeActivity: LeetCodeActivityData | null
}

export default function HomeContent({
  work,
  projects,
  githubActivity,
  leetCodeActivity,
}: HomeContentProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="px-4 max-w-4xl mx-auto">
        {/* Intro Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainerVariants}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-12 mb-16"
        >
          <div className="relative flex flex-col items-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 shadow-sm">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">Available for Work</span>
            </div>
            <motion.div
              variants={staggerItemVariants}
              className="w-full max-w-[260px] md:w-[260px] aspect-square rounded-2xl bg-gray-200 dark:bg-[#151515] flex-shrink-0 shadow-sm overflow-hidden"
            >
              <Image
                src="/icons/img.jpg"
                alt={homeIntroConfig.name}
                width={260}
                height={260}
                priority
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Text Content & Buttons */}
          <div className="flex-1 flex flex-col items-start text-left">
            <motion.div 
              variants={staggerItemVariants}
              className="flex items-center text-[#e5b370] dark:text-[#f2c98a] font-medium text-lg mb-2"
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                className="inline-block mr-2 text-xl"
              >
                👋
              </motion.span>
              <span className="text-gray-600 dark:text-gray-400">Hello, I Am</span>
            </motion.div>

            <motion.h1 
              variants={staggerItemVariants}
              className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight"
            >
              {homeIntroConfig.shortName || homeIntroConfig.name}
            </motion.h1>

            <motion.div
              variants={staggerItemVariants}
              className="space-y-4 mb-8"
            >
              {homeIntroConfig.introParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={staggerItemVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href={`mailto:${footerConfig.socialLinks.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-gray-900 dark:text-gray-200 rounded-xl font-semibold border border-gray-300 dark:border-gray-700 hover:border-accent-500 dark:hover:border-accent-500 hover:shadow-md hover:shadow-accent-500/10 transition-[border-color,box-shadow] duration-200 text-sm uppercase tracking-wider"
              >
                <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Me
              </a>
            </motion.div>
          </div>
        </motion.div>

        <QuickFacts />
        <WorkPreview work={work} />
        <TechStack />
        <ProjectsPreview projects={projects} />
        <GitHubActivity activity={githubActivity} />
        <LeetCodeActivity activity={leetCodeActivity} />
      </section>
    </MotionConfig>
  )
}