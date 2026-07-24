import { NextRequest, NextResponse } from "next/server"
import { getLeetCodeActivity } from "@/lib/leetcode"

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") ?? "CoderRahim"

  try {
    const activity = await getLeetCodeActivity(username)
    if (!activity) {
      return NextResponse.json({ error: "LeetCode profile not found" }, { status: 404 })
    }
    return NextResponse.json(activity)
  } catch (err) {
    console.error("LeetCode API route failed:", err)
    return NextResponse.json({ error: "Failed to fetch LeetCode activity" }, { status: 500 })
  }
}
