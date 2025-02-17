"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRightIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import AnimatedShinyText from "@/components/magicui/animated-shiny-text"
import RetroGrid from "@/components/magicui/retro-grid"

export default function IndexPage() {
  const router = useRouter()
  return (
    <section className="container mx-auto mt-20 grid items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="retro-theme relative flex max-w-[980px] flex-col items-center gap-6">
        <div
          onClick={() => {
            router.push("/titles")
          }}
          className={cn(
            "group z-10 rounded-full border border-gray-200 bg-gray-200 text-sm transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <AnimatedShinyText className="z-10 inline-flex items-center justify-center px-4 py-1 text-neutral-600 transition ease-out hover:text-black hover:duration-300 dark:text-neutral-200 hover:dark:text-black">
            <span>🎮 Explore 42 Intra Achievements</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
        <h1 className="z-10 text-center font-[Anton] text-3xl font-bold leading-tight tracking-wider text-accent-foreground sm:text-3xl md:text-4xl lg:text-6xl">
          HAVE YOU EVER WONDERED HOW TO
          <p className="z-10 mt-0 underline decoration-gray-400 decoration-4 underline-offset-2 sm:mt-0 md:mt-0 lg:mt-3">
            UNLOCK ALL 42 TITLES? 🏆
          </p>
        </h1>
        <p className="z-10 max-w-[700px] text-center text-lg text-accent-foreground sm:text-xl">
          Discover every hidden achievement across 42 campuses, track your
          progress, and join the elite ranks of title collectors worldwide.
        </p>
      </div>
      <RetroGrid className="absolute inset-0 z-0 max-w-[1000]" />
      <div className="flex justify-center gap-4 p-2">
        <Link
          href="/titles"
          className={cn(
            buttonVariants(),
            "bg-gradient-to-r from-primary to-purple-500 p-3 text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
          )}
        >
          Browse Titles
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
    </section>
  )
}
