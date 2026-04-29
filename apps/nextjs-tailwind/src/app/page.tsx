export const dynamic = 'force-dynamic'

// SSR fetches hit the backend directly — they bypass the /api/pikku proxy
// route because they're already running on the server. If you add auth that
// relies on browser cookies, forward them explicitly here (cookies/headers
// flow through the proxy automatically for client-side calls).
async function fetchHello() {
  const url = `${process.env.PIKKU_API_URL ?? 'http://localhost:4003'}/hello`
  try {
    const res = await fetch(url, { method: 'POST', cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as { message: string; timestamp: string }
  } catch (err) {
    return { message: 'Hello, World!', timestamp: `error: ${(err as Error).message}` }
  }
}

export default async function Home() {
  const data = await fetchHello()
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold" data-testid="hello-message">{data.message}</h1>
      <p className="mt-2 text-gray-600" data-testid="hello-source">ssr:nextjs</p>
      <code data-testid="hello-timestamp" className="mt-3 block rounded bg-gray-100 px-2 py-1 text-sm">{data.timestamp}</code>
    </main>
  )
}
