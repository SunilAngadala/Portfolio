// Vercel serverless proxy — keeps Umami credentials server-side only
// Plain CommonJS to avoid ESM/TypeScript compilation issues

const UMAMI_BASE = process.env.UMAMI_BASE
const UMAMI_USER = process.env.UMAMI_USERNAME
const UMAMI_PASS = process.env.UMAMI_PASSWORD

let cachedToken = null
let tokenExpiry = 0

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const res = await fetch(`${UMAMI_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: UMAMI_USER, password: UMAMI_PASS }),
  })
  if (!res.ok) throw new Error(`Umami auth failed: ${res.status}`)
  const data = await res.json()
  cachedToken = data.token
  tokenExpiry = Date.now() + 20 * 60 * 1000
  return cachedToken
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Vary', 'Origin')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { endpoint, ...params } = req.query

  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint param' })

  // Basic shape check — must be a /websites/.../... path
  if (!/^\/websites\/[a-f0-9-]{36}\//.test(endpoint)) {
    return res.status(400).json({ error: 'Invalid endpoint' })
  }

  try {
    const token = await getToken()
    const url = new URL(`${UMAMI_BASE}/api${endpoint}`)
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v)
    }

    const upstream = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (upstream.status === 401) {
      cachedToken = null
      const freshToken = await getToken()
      const retry = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${freshToken}` },
      })
      const data = await retry.json()
      return res.status(retry.status).json(data)
    }

    const data = await upstream.json()
    const isActive = endpoint.endsWith('/active')
    res.setHeader('Cache-Control', `s-maxage=${isActive ? 30 : 60}, stale-while-revalidate`)
    return res.status(upstream.status).json(data)
  } catch (err) {
    console.error('Analytics proxy error:', err)
    return res.status(500).json({ error: 'Proxy error' })
  }
}
