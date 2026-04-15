import { useEffect, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './AnalyticsPage.css'

const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID as string
const API_TOKEN = import.meta.env.VITE_UMAMI_API_TOKEN as string
const BASE = 'https://api.umami.is/v1'

type RangeKey = 'live' | 7 | 30 | 90

interface UmamiStats {
  pageviews: number
  visitors: number
  visits: number
  bounces: number
  totaltime: number
  comparison?: {
    pageviews: number
    visitors: number
    visits: number
    bounces: number
    totaltime: number
  }
}

interface Metric {
  x: string
  y: number
}

interface TimePoint {
  x: string
  y: number
}

interface PageviewData {
  pageviews: TimePoint[]
  sessions: TimePoint[]
}

interface ChartPoint {
  date: string
  pageviews: number
  sessions: number
}

const RANGE_OPTIONS: { label: string; key: RangeKey }[] = [
  { label: 'Live', key: 'live' },
  { label: '7 days', key: 7 },
  { label: '30 days', key: 30 },
  { label: '90 days', key: 90 },
]

async function umamiGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  })
  if (!res.ok) throw new Error(`Umami API returned ${res.status}`)
  return res.json() as Promise<T>
}

function getRange(key: RangeKey): { startAt: string; endAt: string; unit: string } {
  const endAt = Date.now()
  if (key === 'live') {
    return { startAt: String(endAt - 60 * 60 * 1000), endAt: String(endAt), unit: 'hour' }
  }
  return { startAt: String(endAt - key * 24 * 60 * 60 * 1000), endAt: String(endAt), unit: 'day' }
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '—'
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function formatLabel(isoString: string, unit: string): string {
  const d = new Date(isoString)
  if (unit === 'hour') {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Delta({ current, prev }: { current: number; prev: number }) {
  if (prev === 0) return null
  const pct = Math.round(((current - prev) / prev) * 100)
  const up = pct >= 0
  return (
    <span className={`stat-delta ${up ? 'delta-up' : 'delta-down'}`}>
      {up ? '↑' : '↓'} {Math.abs(pct)}%
    </span>
  )
}

function MetricList({ items, label }: { items: Metric[]; label: string }) {
  const max = items[0]?.y ?? 1
  return (
    <div>
      <p className="metric-list-label">{label}</p>
      {items.length === 0 && <p className="metric-empty">No data yet</p>}
      {items.map((item) => (
        <div className="metric-row" key={item.x}>
          <div className="metric-info">
            <span className="metric-name" title={item.x}>
              {item.x || '(direct)'}
            </span>
            <span className="metric-count">{item.y.toLocaleString()}</span>
          </div>
          <div className="metric-bar-track">
            <div
              className="metric-bar-fill"
              style={{ width: `${(item.y / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>(30)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeVisitors, setActiveVisitors] = useState<number | null>(null)

  const [stats, setStats] = useState<UmamiStats | null>(null)
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [topPages, setTopPages] = useState<Metric[]>([])
  const [countries, setCountries] = useState<Metric[]>([])
  const [referrers, setReferrers] = useState<Metric[]>([])
  const [devices, setDevices] = useState<Metric[]>([])
  const [browsers, setBrowsers] = useState<Metric[]>([])
  const [events, setEvents] = useState<Metric[]>([])

  const abortRef = useRef<AbortController | null>(null)

  // Poll active visitors every 30s when on Live tab
  useEffect(() => {
    if (range !== 'live') {
      setActiveVisitors(null)
      return
    }
    async function fetchActive() {
      try {
        const data = await umamiGet<{ visitors: number }>(
          `/websites/${WEBSITE_ID}/active`,
          {},
        )
        setActiveVisitors(typeof data?.visitors === 'number' ? data.visitors : 0)
      } catch {
        // silently ignore active poll errors
      }
    }
    void fetchActive()
    const interval = setInterval(() => void fetchActive(), 30_000)
    return () => clearInterval(interval)
  }, [range])

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const { startAt, endAt, unit } = getRange(range)
    setLoading(true)
    setError(null)

    async function fetchAll() {
      try {
        const [statsData, pvData, pagesData, countriesData, referrersData, devicesData, browsersData, eventsData] =
          await Promise.all([
            umamiGet<UmamiStats>(`/websites/${WEBSITE_ID}/stats`, { startAt, endAt }),
            umamiGet<PageviewData>(`/websites/${WEBSITE_ID}/pageviews`, {
              startAt,
              endAt,
              unit,
              timezone: 'UTC',
            }),
            umamiGet<Metric[]>(`/websites/${WEBSITE_ID}/metrics`, {
              startAt,
              endAt,
              type: 'path',
              limit: '10',
            }),
            umamiGet<Metric[]>(`/websites/${WEBSITE_ID}/metrics`, {
              startAt,
              endAt,
              type: 'country',
              limit: '10',
            }),
            umamiGet<Metric[]>(`/websites/${WEBSITE_ID}/metrics`, {
              startAt,
              endAt,
              type: 'referrer',
              limit: '8',
            }),
            umamiGet<Metric[]>(`/websites/${WEBSITE_ID}/metrics`, {
              startAt,
              endAt,
              type: 'device',
            }),
            umamiGet<Metric[]>(`/websites/${WEBSITE_ID}/metrics`, {
              startAt,
              endAt,
              type: 'browser',
              limit: '6',
            }),
            umamiGet<Metric[]>(`/websites/${WEBSITE_ID}/metrics`, {
              startAt,
              endAt,
              type: 'event',
            }),
          ])

        if (controller.signal.aborted) return

        setStats(statsData)
        setChartData(
          pvData.pageviews.map((point, i) => ({
            date: formatLabel(point.x, unit),
            pageviews: point.y,
            sessions: pvData.sessions[i]?.y ?? 0,
          })),
        )
        setTopPages(pagesData)
        setCountries(countriesData)
        setReferrers(referrersData)
        setDevices(devicesData)
        setBrowsers(browsersData)
        setEvents(eventsData)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load analytics')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void fetchAll()
    return () => controller.abort()
  }, [range])

  const avgDuration =
    stats && stats.visits > 0
      ? formatDuration(Math.round(stats.totaltime / stats.visits))
      : '—'

  const bounceRate =
    stats && stats.visits > 0
      ? `${Math.round((stats.bounces / stats.visits) * 100)}%`
      : '—'

  return (
    <div className="route-shell analytics-route">
      <div className="analytics-header reveal reveal-delay-1">
        <div>
          <p className="eyebrow">Site metrics</p>
          <h1 className="section-title">Analytics</h1>
        </div>
        <div className="range-tabs" role="group" aria-label="Date range">
          {RANGE_OPTIONS.map(({ label, key }) => (
            <button
              key={key}
              className={`range-tab${range === key ? ' range-tab-active' : ''}${key === 'live' ? ' range-tab-live' : ''}`}
              onClick={() => setRange(key)}
              type="button"
            >
              {key === 'live' && <span className={`live-dot${range === 'live' ? ' live-dot-active' : ''}`} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="analytics-error reveal">
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <div className={`analytics-body${loading ? ' analytics-loading' : ''}`}>
        {/* ── Stats row ── */}
        <div className="stats-grid reveal reveal-delay-1">
          {([
            ...(range === 'live'
              ? [
                  {
                    label: 'Active right now',
                    value: activeVisitors !== null ? String(activeVisitors) : '—',
                    delta: <span className="stat-delta delta-up live-pulse">● live</span>,
                  },
                ]
              : []),
            {
              label: range === 'live' ? 'Visitors (1h)' : 'Unique visitors',
              value: (stats?.visitors ?? 0).toLocaleString(),
              delta:
                stats != null ? (
                  <Delta current={stats.visitors} prev={stats.comparison?.visitors ?? 0} />
                ) : null,
            },
            {
              label: range === 'live' ? 'Page views (1h)' : 'Page views',
              value: (stats?.pageviews ?? 0).toLocaleString(),
              delta:
                stats != null ? (
                  <Delta current={stats.pageviews} prev={stats.comparison?.pageviews ?? 0} />
                ) : null,
            },
            {
              label: 'Avg session',
              value: avgDuration,
              delta: null,
            },
            {
              label: 'Bounce rate',
              value: bounceRate,
              delta: null,
            },
          ] as { label: string; value: string; delta: React.ReactNode }[]
          ).map(({ label, value, delta }) => (
            <div className="stat-card" key={label}>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
              {delta}
            </div>
          ))}
        </div>

        {/* ── Pageviews chart ── */}
        <div className="chart-card reveal reveal-delay-2">
          <div className="chart-legend">
            <span className="chart-legend-item">
              <span className="legend-dot" style={{ background: '#f47848' }} />
              Pageviews
            </span>
            <span className="chart-legend-item">
              <span className="legend-dot" style={{ background: '#7092ff' }} />
              Sessions
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f47848" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#f47848" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7092ff" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#7092ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.055)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#98a2c3', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: '#98a2c3', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#111522',
                  border: '1px solid rgba(255,255,255,0.11)',
                  borderRadius: 8,
                  color: '#f5f7ff',
                  fontSize: '0.84rem',
                }}
                cursor={{ stroke: 'rgba(255,255,255,0.09)' }}
              />
              <Area
                type="monotone"
                dataKey="pageviews"
                stroke="#f47848"
                strokeWidth={2}
                fill="url(#pvGrad)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#7092ff"
                strokeWidth={2}
                fill="url(#sessGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Top pages + countries ── */}
        <div className="metrics-grid-2 reveal reveal-delay-3">
          <div className="metric-card">
            <MetricList items={topPages} label="Top pages" />
          </div>
          <div className="metric-card">
            <MetricList items={countries} label="Visitors by country" />
          </div>
        </div>

        {/* ── Referrers + devices + browsers ── */}
        <div className="metrics-grid-3 reveal reveal-delay-4">
          <div className="metric-card">
            <MetricList items={referrers} label="Referrers" />
          </div>
          <div className="metric-card">
            <MetricList items={devices} label="Devices" />
          </div>
          <div className="metric-card">
            <MetricList items={browsers} label="Browsers" />
          </div>
        </div>

        {/* ── Interactions / custom events ── */}
        <div className="metric-card reveal reveal-delay-5">
          <MetricList items={events} label="Interactions (clicks & downloads)" />
        </div>
      </div>
    </div>
  )
}
