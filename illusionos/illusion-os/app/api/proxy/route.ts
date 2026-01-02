import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url")

  if (!target) {
    return new Response(JSON.stringify({ error: "Missing url param" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  try {
    // Always fetch fresh content – no caching.
    const res = await fetch(target, { cache: "no-store", redirect: "follow" })
    const html = await res.text()

    return new Response(JSON.stringify({ content: html }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (err) {
    console.error("Proxy fetch error:", err)
    return new Response(JSON.stringify({ error: "Proxy request failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
