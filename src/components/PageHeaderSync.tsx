"use client"

import { useEffect } from "react"
import { usePageHeader } from "@/components/PageHeaderProvider"

export default function PageHeaderSync({ title, subtitle }: { title: string; subtitle: string }) {
  const { setHeaderInfo } = usePageHeader()

  useEffect(() => {
    setHeaderInfo({ title, subtitle })
    return () => setHeaderInfo(null)
  }, [title, subtitle, setHeaderInfo])

  return null
}
