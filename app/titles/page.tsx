import TitlesList from "@/components/TitlesList"
import { prisma } from "@/lib/prisma"

interface SearchParams {
  search?: string
  description?: string
  login?: string
  campuses?: string
}

export default async function TitlesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const initialTitles = await prisma.title.findMany({
    take: 20,
    orderBy: { id: "asc" },
  })

  return <TitlesList initialTitles={initialTitles} searchParams={searchParams} />
}
