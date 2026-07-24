"use client"

import { createContext, ReactNode, useContext, useState } from "react"

export interface PageHeaderInfo {
  title: string
  subtitle: string
}

interface PageHeaderContextValue {
  headerInfo: PageHeaderInfo | null
  setHeaderInfo: (info: PageHeaderInfo | null) => void
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null)

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [headerInfo, setHeaderInfo] = useState<PageHeaderInfo | null>(null)

  return (
    <PageHeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext)
  if (!context) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider")
  }
  return context
}
