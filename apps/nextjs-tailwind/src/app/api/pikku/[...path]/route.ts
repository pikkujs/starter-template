const BACKEND_URL = process.env.PIKKU_API_URL ?? 'http://localhost:4003'

async function proxy(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const url = new URL(req.url)
  const target = `${BACKEND_URL}/${path.join('/')}${url.search}`

  const headers = new Headers(req.headers)
  headers.delete('host')
  headers.delete('connection')

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'manual',
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer()
  }

  const upstream = await fetch(target, init)
  const respHeaders = new Headers(upstream.headers)
  respHeaders.delete('content-encoding')
  respHeaders.delete('transfer-encoding')

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  })
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as HEAD, proxy as OPTIONS }
