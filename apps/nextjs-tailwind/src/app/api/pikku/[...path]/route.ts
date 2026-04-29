const BACKEND_URL = process.env.PIKKU_API_URL ?? 'http://localhost:4003'

// Hop-by-hop headers (RFC 7230 §6.1) plus content/transfer framing fields
// that fetch will recompute on its own. Stripped from both directions.
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
])
const RESPONSE_STRIP = new Set([...HOP_BY_HOP, 'content-encoding'])

function filterHeaders(src: Headers, drop: Set<string>): Headers {
  const out = new Headers()
  src.forEach((value, key) => {
    if (!drop.has(key.toLowerCase())) out.append(key, value)
  })
  return out
}

async function proxy(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const url = new URL(req.url)
  const target = `${BACKEND_URL}/${path.join('/')}${url.search}`

  const init: RequestInit = {
    method: req.method,
    headers: filterHeaders(req.headers, HOP_BY_HOP),
    redirect: 'manual',
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Stream the body through to avoid buffering large uploads in memory.
    // Node's fetch requires duplex: 'half' for ReadableStream bodies.
    init.body = req.body
    ;(init as RequestInit & { duplex: 'half' }).duplex = 'half'
  }

  const upstream = await fetch(target, init)
  const respHeaders = filterHeaders(upstream.headers, RESPONSE_STRIP)
  // Preserve every Set-Cookie individually — combining via a comma-joined
  // single header corrupts cookie pairs in several runtimes.
  respHeaders.delete('set-cookie')
  for (const cookie of upstream.headers.getSetCookie()) {
    respHeaders.append('set-cookie', cookie)
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  })
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as HEAD,
  proxy as OPTIONS,
}
