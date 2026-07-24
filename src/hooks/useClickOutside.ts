"use client"

import { useEffect, useRef } from "react"
import type { RefObject } from "react"

interface UseClickOutsideOptions {
  enabled?: boolean
  closeOnEscape?: boolean
}

export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  onOutside: () => void,
  { enabled = true, closeOnEscape = true }: UseClickOutsideOptions = {}
) {
  const onOutsideRef = useRef(onOutside)
  useEffect(() => {
    onOutsideRef.current = onOutside
  })

  useEffect(() => {
    if (!enabled) return

    const refList = Array.isArray(refs) ? refs : [refs]

    const handleClickOutside = (e: MouseEvent) => {
      const isInside = refList.some(ref => ref.current?.contains(e.target as Node))
      if (!isInside) onOutsideRef.current()
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOutsideRef.current()
    }

    document.addEventListener("mousedown", handleClickOutside)
    if (closeOnEscape) document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (closeOnEscape) document.removeEventListener("keydown", handleEscape)
    }
  }, [enabled, closeOnEscape])
}
