import TitlesList from "@/components/TitlesList"
import { prisma } from "@/lib/prisma"
import { Suspense } from "react"

export default async function TitlesPage() {
  const initialTitles = await prisma.title.findMany({
    take: 20,
    orderBy: { id: "asc" },
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TitlesList initialTitles={initialTitles} />
    </Suspense>
  )
}
