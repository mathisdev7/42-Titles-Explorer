import { prisma } from "@/lib/prisma"
import TitlesList from "@/components/TitlesList"

export default async function TitlesPage() {
  const titles = await prisma.title.findMany()

  return <TitlesList initialTitles={titles} />
}
