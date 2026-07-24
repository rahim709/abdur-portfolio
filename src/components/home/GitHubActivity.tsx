"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"
import type { GitHubActivityData } from "@/lib/github"

interface GitHubActivityProps {
  activity: GitHubActivityData | null
}

// GitHub contribution colors adapted for both light and dark backgrounds
const levelClasses: Record<number, string> = {
  0: "bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-[#ffffff0d]",
  1: "bg-[#0e4429]",
  2: "bg-[#006d32]",
  3: "bg-[#26a641]",
  4: "bg-[#39d353]",
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 px-4 py-4 transition-colors hover:border-gray-300 dark:hover:border-gray-700">
      <span className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
        {value.toLocaleString()}
      </span>
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-1 font-medium">
        {label}
      </span>
    </div>
  )
}

export default function GitHubActivity({ activity }: GitHubActivityProps) {
  // Calculate weekly totals for the graph
  const weeklyTotals =
    activity?.weeks.map(week => week.days.reduce((sum, day) => sum + day.count, 0)) || []

  const maxWeeklyTotal = Math.max(...weeklyTotals, 1) // Prevent division by zero

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeUpVariants}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20 mb-16 w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">GitHub Activity</h2>
        <Link
          href="https://github.com/rahim709"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            "text-gray-600 dark:text-gray-400",
            "hover:text-accent-600 dark:hover:text-accent-400",
            "transition-colors duration-200"
          )}
        >
          <FaGithub className="w-4 h-4" />
          @rahim709
        </Link>
      </div>

      {!activity ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8 text-center shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">
            GitHub activity data is currently unavailable. Add a{" "}
            <code className="rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-1.5 py-0.5 text-sm text-gray-700 dark:text-gray-300">
              GITHUB_TOKEN
            </code>{" "}
            to your environment to enable this section.
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainerVariants}
          viewport={{ once: true }}
          className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5 sm:p-7 shadow-sm w-full overflow-hidden hover:border-accent-500 dark:hover:border-accent-500 hover:shadow-lg hover:shadow-accent-500/10 transition-[border-color,box-shadow] duration-200"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard label="Total Contributions" value={activity.totalContributions} />
            <StatCard label="Current Streak" value={activity.currentStreak} />
            <StatCard label="Longest Streak" value={activity.longestStreak} />
            <StatCard label="Total Repositories" value={activity.totalRepos} />
          </div>

          {/* Calendar Grid */}
          <div className="w-full overflow-hidden">
            <div className="flex gap-1 flex-row-reverse justify-start">
              {[...activity.weeks].reverse().map((week, weekIndex) => (
                <motion.div
                  key={`week-${weekIndex}`}
                  variants={staggerItemVariants}
                  className="flex flex-col gap-1 shrink-0"
                >
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date || "this day"}`}
                      className={cn(
                        "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] shrink-0 cursor-pointer",
                        levelClasses[day.level],
                        "transition-all duration-200",
                        "hover:ring-1 hover:ring-gray-400 dark:hover:ring-white hover:z-10 relative"
                      )}
                    />
                  ))}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly Volume Graph (Aligned with Grid) */}
          <div className="w-full overflow-hidden mt-6 pt-6 border-t border-gray-200 dark:border-gray-800/50">
            <div className="flex justify-between items-center mb-3 text-xs text-gray-600 dark:text-gray-500 font-medium">
              <span>Weekly Volume</span>
              <span>Max: {maxWeeklyTotal}</span>
            </div>

            <div className="flex gap-1 flex-row-reverse justify-start items-end h-20">
              {[...weeklyTotals].reverse().map((total, index) => {
                const heightPercentage = total > 0 ? (total / maxWeeklyTotal) * 100 : 0

                return (
                  <motion.div
                    key={`graph-bar-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{
                      height: `${Math.max(heightPercentage, 4)}%`, // 4% minimum height so empty weeks show a tiny bump
                      opacity: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.01 }}
                    className={cn(
                      "w-3 sm:w-3.5 shrink-0 rounded-t-[2px] relative group cursor-crosshair",
                      total > 0
                        ? "bg-gradient-to-t from-[#006d32] to-[#39d353]"
                        : "bg-gray-100 dark:bg-[#161b22]"
                    )}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 hidden group-hover:block bg-gray-800 dark:bg-gray-900 text-white text-[10px] px-2 py-1 rounded border border-gray-600 dark:border-gray-700 whitespace-nowrap shadow-xl">
                      {total} contributions
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-6 text-xs text-gray-600 dark:text-gray-400">
            <span className="hidden sm:inline-block text-gray-500 dark:text-gray-500">
              Automatically tracking latest activity
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <span>Less</span>
              <div className="flex gap-1 items-center mx-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} className={cn("w-3 h-3 rounded-[2px]", levelClasses[level])} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
