import { prisma } from "@/lib/prisma"
import TitlesList from "@/components/TitlesList"

export default async function TitlesPage() {
  const initialTitles = await prisma.title.findMany({
    take: 20,
    orderBy: { id: "asc" },
  })

  return <TitlesList initialTitles={initialTitles} />
}
