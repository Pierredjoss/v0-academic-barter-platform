"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  NotebookPen,
  Package,
} from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  "file-text": FileText,
  "flask-conical": FlaskConical,
  "graduation-cap": GraduationCap,
  "notebook-pen": NotebookPen,
  "package": Package,
}

interface Category {
  id: string
  name: string
  name_fr: string
  icon: string
  color: string
}

interface ExploreFiltersProps {
  categories: Category[]
  currentParams: {
    category?: string
    search?: string
    condition?: string
    sort?: string
  }
}

export function ExploreFilters({ categories, currentParams }: ExploreFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/explore?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/explore")
  }

  const hasActiveFilters = currentParams.category || currentParams.search || currentParams.condition

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search listings..."
            className="h-11 pl-10"
            defaultValue={currentParams.search}
            onChange={(e) => {
              const value = e.target.value
              if (value) {
                updateParams("search", value)
              } else {
                updateParams("search", null)
              }
            }}
          />
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Button
          variant={!currentParams.category ? "default" : "outline"}
          size="sm"
          className="shrink-0"
          onClick={() => updateParams("category", null)}
        >
          All
        </Button>
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon] || Package
          const isActive = currentParams.category === category.name
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn("shrink-0 gap-1.5", isActive && "bg-primary")}
              onClick={() => updateParams("category", isActive ? null : category.name)}
            >
              <Icon className="h-4 w-4" />
              {category.name_fr}
            </Button>
          )
        })}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={clearFilters}
          >
            Clear all
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
