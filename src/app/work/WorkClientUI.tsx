"use client"

import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { FaDownload, FaFrown } from "react-icons/fa"
import ActiveFilterChips from "@/components/ActiveFilterChips"
import FilterDropdown from "@/components/FilterDropdown"
import PaginationControls from "@/components/PaginationControls"
import SortDropdown from "@/components/SortDropdown"
import WorkItem from "@/components/WorkItem"
import { WorkItemProps } from "@/lib/types"

export default function WorkClientUI({
  uniqueCompanies,
  selectedCompanies,
  sortOrder,
  filteredWorkItems,
  paginatedWorkItems,
  currentPage,
  totalPages,
  baseUrl,
}: {
  uniqueCompanies: { company: string; count: number }[]
  selectedCompanies: string[]
  sortOrder: "newest" | "oldest"
  filteredWorkItems: WorkItemProps[]
  paginatedWorkItems: WorkItemProps[]
  currentPage: number
  totalPages: number
  baseUrl: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Draft state for company selection
  const [companyDrafts, setCompanyDrafts] = useState<string[]>(selectedCompanies)
  useEffect(() => {
    setCompanyDrafts(selectedCompanies)
  }, [selectedCompanies])

  // Handlers for filter/sort UI
  const handleToggleCompany = (company: string) => {
    setCompanyDrafts(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    )
  }

  // Apply filters by updating URL params
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (companyDrafts.length > 0) {
      params.set("company", companyDrafts.join(","))
    } else {
      params.delete("company")
    }
    params.delete("page") // Reset to page 1
    router.push(`${baseUrl}${params.toString() ? "?" + params.toString() : ""}`)
  }

  // Clear all filters from URL params
  const handleClearFilters = () => {
    setCompanyDrafts([])
    const params = new URLSearchParams(searchParams.toString())
    params.delete("company")
    params.delete("page")
    router.push(`${baseUrl}${params.toString() ? "?" + params.toString() : ""}`)
  }

  // Handle sort order change
  const handleSortChange = (order: "newest" | "oldest" | "desc" | "asc") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", order)
    params.delete("page")
    router.push(`${baseUrl}${params.toString() ? "?" + params.toString() : ""}`)
  }

  // Remove a single company filter
  const handleRemoveCompany = (company: string) => {
    // Remove company from draft and apply immediately
    const newDrafts = companyDrafts.filter(c => c !== company)
    setCompanyDrafts(newDrafts)
    const params = new URLSearchParams(searchParams.toString())
    if (newDrafts.length > 0) {
      params.set("company", newDrafts.join(","))
    } else {
      params.delete("company")
    }
    params.delete("page") // Reset to page 1
    router.push(`${baseUrl}${params.toString() ? "?" + params.toString() : ""}`)
  }

  // Clear all company filters
  const handleClearAllCompanies = () => {
    handleClearFilters()
  }

  return (
    <section className="px-4 max-w-4xl mx-auto">
      {/* Resume Download */}
      <div className="mb-8">
        <Link
          href="/work/Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-accent-500 dark:hover:border-accent-400 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200"
        >
          <FaDownload className="w-4 h-4" />
          <span className="font-medium">Download Resume</span>
        </Link>
      </div>

      <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">
        {/* Company Filter Dropdown - Left */}
        <div className="relative grow md:grow-0">
          <Suspense fallback={null}>
            <FilterDropdown
              items={uniqueCompanies.map(({ company, count }) => ({ name: company, count }))}
              selectedItems={companyDrafts}
              onToggle={handleToggleCompany}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              placeholder="Filter by Company"
              resultCount={filteredWorkItems.length}
            />
          </Suspense>
        </div>

        {/* Sort Order Dropdown - Right */}
        <div className="relative grow md:grow-0 z-20">
          <Suspense fallback={null}>
            <SortDropdown
              sortOrder={sortOrder}
              onChange={handleSortChange}
              options={[
                { label: "Newest First", value: "newest" },
                {
                  label: "Oldest First",
                  value: "oldest",
                },
              ]}
            />
          </Suspense>
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilterChips
        filters={selectedCompanies}
        onRemove={handleRemoveCompany}
        onClearAll={selectedCompanies.length > 1 ? handleClearAllCompanies : undefined}
      />

      {/* Work Items List or No Results Message */}
      <AnimatePresence mode="wait">
        {filteredWorkItems.length > 0 ? (
          <motion.div
            key="work-items"
            className="space-y-6 grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {paginatedWorkItems.map(item => (
              <WorkItem key={item.slug} {...item} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300 mt-12 px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <FaFrown className="text-4xl md:text-5xl mb-3 text-gray-400 dark:text-gray-500" />
            <p className="text-lg md:text-xl lg:text-2xl font-semibold">No work items found</p>
            <p className="text-sm md:text-base lg:text-lg mt-2 max-w-2xl">
              The combination of selected company filters didn&apos;t match any work items. Try
              changing or clearing your filters.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
        searchParams={Object.fromEntries(searchParams.entries())}
      />
    </section>
  )
}
