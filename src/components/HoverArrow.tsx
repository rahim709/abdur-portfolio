"use client"

import { motion } from "framer-motion"

interface HoverArrowProps {
  direction?: "left" | "right"
  offset?: number
  className?: string
}

export default function HoverArrow({
  direction = "right",
  offset = 4,
  className,
}: HoverArrowProps) {
  return (
    <motion.span
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      whileHover={{ x: direction === "right" ? offset : -offset }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={className}
    >
      {direction === "right" ? "→" : "←"}
    </motion.span>
  )
}
