"use client"

import { useEffect, useRef, useState } from "react"
import { useTitleStore } from "@/store/title-store"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card"
import { Title } from "@prisma/client"
import { ExternalLink, Search } from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { redirectToRandomUser } from "@/components/actions/redirectToRandomUser"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface TitlesListProps {
  initialTitles: Title[]
}

export default function TitlesList({ initialTitles }: TitlesListProps) {
  const { page, incrementPage } = useTitleStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [hasMore, setHasMore] = useState(true)
  const [titles, setTitles] = useState(initialTitles)
  const [expandedTitles, setExpandedTitles] = useState<Record<string, boolean>>(
    {}
  )
  const [hasDescription, setHasDescription] = useState(false)
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([])
  const [hasLogin, setHasLogin] = useState(false)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const allCampuses = Array.from(
    new Set(titles.flatMap((title) => title.campuses))
  ).sort()

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const newTitles = await loadMoreTitles(page + 1)
          if (newTitles.length === 0) {
            setHasMore(false)
          } else {
            setTitles((prev) => [...prev, ...newTitles])
            incrementPage()
          }
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [page, hasMore])

  const filteredTitles = titles.filter((title) => {
    const matchesSearch = title.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesDescription =
      !hasDescription || (title.description && title.description.length > 0)
    const matchesCampuses =
      selectedCampuses.length === 0 ||
      title.campuses.some((campus) => selectedCampuses.includes(campus))
    const matchesLogin = title.name.includes("%login")

    return (
      matchesSearch && matchesDescription && matchesCampuses && matchesLogin
    )
  })

  const toggleExpand = (id: number) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleCampus = (campus: string) => {
    setSelectedCampuses((prev) =>
      prev.includes(campus)
        ? prev.filter((c) => c !== campus)
        : [...prev, campus]
    )
  }

  const loadMoreTitles = async (page: number) => {
    try {
      const response = await fetch(`/api/titles?page=${page}`)
      return await response.json()
    } catch (error) {
      console.error("Error loading more titles:", error)
      return []
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="mb-4 text-center font-anton text-4xl text-primary md:text-5xl">
          EXPLORE 42 TITLES
        </h1>
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search titles..."
            className="w-full rounded-xl border border-gray-200 bg-white p-5 pl-12 shadow-lg transition-all focus:border-primary focus:ring-2 focus:ring-primary dark:border-gray-800 dark:bg-gray-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasDescription"
              checked={hasDescription}
              onChange={(e) => setHasDescription(e.target.checked)}
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="hasDescription"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Official titles only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasLogin"
              checked={hasLogin}
              onChange={(e) => setHasLogin(e.target.checked)}
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="hasLogin"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              %login inside
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Campuses:
            </span>
            {allCampuses.map((campus) => (
              <div key={campus} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={campus}
                  checked={selectedCampuses.includes(campus)}
                  onChange={() => toggleCampus(campus)}
                  className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={campus}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {campus}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTitles.map((title) => {
          const isExpanded = expandedTitles[title.id] || false
          const maxCampusesToShow = 3

          return (
            <Card
              key={title.id}
              className={`flex max-w-[400px] flex-col rounded-xl border transition-transform duration-200 hover:scale-105 ${
                isExpanded ? "min-h-[250px]" : ""
              }`}
            >
              <CardHeader className="flex gap-3">
                <Icons.fortytwo className="size-8 dark:text-white" />
                <div className="flex flex-col">
                  <p className="text-md">{title.name}</p>
                </div>
              </CardHeader>
              <hr className="z-50 text-gray-500 dark:text-gray-400" />
              <CardBody className="grow">
                {title.description
                  ? title.description.join(" / ").trim()
                  : "This is a custom title granted by tutors or staff. No specific achievement required."}
                <p className="text-sm text-gray-500">
                  {title.campuses.length > maxCampusesToShow && !isExpanded
                    ? `${title.campuses
                        .slice(0, maxCampusesToShow)
                        .join(", ")}...`
                    : title.campuses.join(", ") || "🌍 Available worldwide"}
                </p>
                {title.campuses.length > maxCampusesToShow && (
                  <Button
                    variant="ghost"
                    className="mt-2 text-blue-500 hover:underline"
                    onClick={() => toggleExpand(title.id)}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </Button>
                )}
              </CardBody>
              <hr className="z-50 text-gray-500 dark:text-gray-400" />
              <CardFooter>
                <Button
                  variant="default"
                  className="mt-2 border border-gray-200 bg-background text-primary hover:bg-gray-50 dark:border-gray-800  dark:hover:bg-gray-800"
                  onClick={async () => {
                    toast({
                      title: "Redirecting to random user...",
                      description: "This may take some seconds...",
                    })
                    const res = await redirectToRandomUser(title.id)
                    if (res) {
                      toast({
                        title: `Redirected to ${res.split("/").pop()}`,
                      })
                      const isMobile = /Mobi|Android|iPhone/i.test(
                        navigator.userAgent
                      )
                      if (isMobile) {
                        window.location.href = res
                      } else {
                        const a = document.createElement("a")
                        a.href = res
                        a.target = "_blank"
                        a.rel = "noopener noreferrer"
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                      }
                    }
                  }}
                >
                  Go to Random User
                  <ExternalLink className="mb-px ml-2 size-4" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      {hasMore && (
        <div ref={loaderRef} className="col-span-full flex justify-center py-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}
