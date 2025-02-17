import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page")) || 1

  const titles = await prisma.title.findMany({
    skip: (page - 1) * 20,
    take: 20,
    orderBy: { id: "asc" },
  })

  return NextResponse.json(titles)
}
