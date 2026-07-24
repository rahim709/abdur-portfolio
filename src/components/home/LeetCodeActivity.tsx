"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LeetCodeIcon from "@/components/icons/LeetCodeIcon"
import { cn } from "@/lib/utils"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"
import type { LeetCodeActivityData } from "@/lib/leetcode"

const levelClasses: Record<number, string> = {
  0: "bg-gray-200 dark:bg-[#222222] border border-gray-300 dark:border-[#333333]",
  1: "bg-[#004b23] border border-[#004b23]",
  2: "bg-[#007200] border border-[#007200]",
  3: "bg-[#38b000] border border-[#38b000]",
  4: "bg-[#70e000] border border-[#70e000]",
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number | null
  accent?: "green" | "yellow" | "red" | "orange"
}) {
  const accentClasses = {
    green: "border-l-4 border-l-[#00B8A3]",
    yellow: "border-l-4 border-l-[#FFC01E]",
    red: "border-l-4 border-l-[#FF375F]",
    orange: "border-l-4 border-l-[#FFA116]",
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg bg-gray-100 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 px-4 py-4 transition-colors hover:border-gray-300 dark:hover:border-gray-700",
        accent && accentClasses[accent]
      )}
    >
      <span className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
        {value === null ? "-" : value.toLocaleString()}
      </span>
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-1 font-medium">
        {label}
      </span>
    </div>
  )
}

interface LeetCodeActivityProps {
  activity: LeetCodeActivityData | null
  username?: string
}

export default function LeetCodeActivity({
  activity,
  username = "CoderRahim",
}: LeetCodeActivityProps) {
  const total = activity?.totalSolved || 1
  const easyPct = ((activity?.easySolved || 0) / total) * 100
  const medPct = ((activity?.mediumSolved || 0) / total) * 100
  const hardPct = ((activity?.hardSolved || 0) / total) * 100

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeUpVariants}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20 mb-16 w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">LeetCode Activity</h2>
        <Link
          href={`https://leetcode.com/u/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            "text-gray-600 dark:text-gray-400",
            "hover:text-accent-600 dark:hover:text-accent-400",
            "transition-colors duration-200"
          )}
        >
          <LeetCodeIcon className="w-4 h-4" />
          @{username}
        </Link>
      </div>

      {!activity ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8 text-center shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">
            LeetCode API is unreachable. Activity data will appear once the LeetCode profile can be
            fetched.
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
          {/* Solved breakdown */}
          <div className="mb-8 rounded-lg bg-gray-100 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Solved
              </span>
              <span className="text-2xl font-bold text-black dark:text-white">
                {activity.totalSolved}
              </span>
            </div>

            <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${easyPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-[#00B8A3] h-full"
                title={`Easy: ${activity.easySolved}`}
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${medPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="bg-[#FFC01E] h-full"
                title={`Medium: ${activity.mediumSolved}`}
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${hardPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="bg-[#FF375F] h-full"
                title={`Hard: ${activity.hardSolved}`}
              />
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-8 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-[#00B8A3]" />
                Easy <span className="text-gray-500 ml-1">{activity.easySolved}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-[#FFC01E]" />
                Medium <span className="text-gray-500 ml-1">{activity.mediumSolved}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-[#FF375F]" />
                Hard <span className="text-gray-500 ml-1">{activity.hardSolved}</span>
              </div>
            </div>
          </div>

          {/* Core metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard label="Total Solved" value={activity.totalSolved} accent="green" />
            <StatCard label="Total Submissions" value={activity.totalSubmissions} />
            <StatCard label="Current Streak" value={activity.currentStreak} />
            <StatCard label="Longest Streak" value={activity.longestStreak} />
            <StatCard label="Global Ranking" value={activity.ranking} />
            <StatCard label="Contest Rating" value={activity.contestRating} accent="orange" />
            <StatCard label="Contests Attended" value={activity.attendedContests} accent="yellow" />
          </div>

          {/* Submission calendar */}
          <div className="w-full overflow-hidden pb-2">
            <div className="flex gap-[5px] flex-row-reverse justify-start">
              {[...activity.weeks].reverse().map((week, weekIndex) => (
                <motion.div
                  key={`lc-week-${weekIndex}`}
                  variants={staggerItemVariants}
                  className="flex flex-col gap-[5px] shrink-0"
                >
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      title={`${day.count} submission${day.count === 1 ? "" : "s"} on ${day.date}`}
                      className={cn(
                        "w-[14px] h-[14px] rounded-[3px] shrink-0 cursor-pointer",
                        levelClasses[day.level],
                        "transition-all duration-150",
                        "hover:scale-110 hover:z-10 relative"
                      )}
                    />
                  ))}
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </motion.div>
  )
}
