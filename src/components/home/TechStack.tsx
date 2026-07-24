"use client"

import { motion } from "framer-motion"
import TechBadge from "@/components/TechBadge"
import { cn } from "@/lib/utils"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"

const techCategories = [
  {
    title: "Languages",
    items: ["C", "C++", "JavaScript", "TypeScript", "HTML"],
  },
  {
    title: "Frontend",
    items: ["Next.js", "React.js", "Tailwind CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"],
  },
  {
    title: "Database",
    items: ["MongoDB", "MySQL", "Supabase", "Redis"],
  },
  {
    title: "Cloud / DevOps",
    items: ["Git", "AWS", "Linux"],
  },
]

export default function TechStack() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeUpVariants}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Tech Stack</h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={staggerContainerVariants}
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {techCategories.map(category => (
          <motion.div
            key={category.title}
            variants={staggerItemVariants}
            className={cn(
              "rounded-xl border border-gray-300 dark:border-gray-700",
              "bg-white dark:bg-black",
              "p-5 shadow-sm",
              "hover:border-accent-500 dark:hover:border-accent-500",
              "hover:shadow-lg hover:shadow-accent-500/10",
              "transition-[border-color,box-shadow] duration-200"
            )}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map(tech => (
                <TechBadge key={tech} techName={tech} variant="small" />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
