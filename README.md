# MCP Leaderboard

Track adoption metrics for Payment, Commerce, and Crypto MCP servers in real-time.

![MCP Leaderboard Dashboard](https://img.shields.io/badge/MCPs_Tracked-15-blue) ![npm downloads](https://img.shields.io/badge/Weekly_Downloads-36k+-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## Quick Start

```bash
git clone https://github.com/csmoove530/mcp-leaderboard.git
cd mcp-leaderboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see live MCP rankings.

---

## What You Get

| Feature | Description |
|---------|-------------|
| **Live Rankings** | MCPs ranked by npm weekly downloads |
| **Trend Charts** | 7-day sparklines + 30-day detailed graphs |
| **Category Filters** | Payments, Commerce, Crypto |
| **GitHub Metrics** | Stars, forks, issues, last commit |
| **Auto-Refresh** | Data updates hourly via ISR |

---

## API

### Get All MCPs

```bash
curl http://localhost:3000/api/mcps
```

**Response**

```json
[
  {
    "id": "stripe-agent-toolkit",
    "name": "Stripe Agent Toolkit",
    "category": "payments",
    "npmPackage": "@stripe/agent-toolkit",
    "githubRepo": "stripe/agent-toolkit",
    "metrics": {
      "npmDownloadsWeekly": 16289,
      "npmDownloadsChange": -17,
      "githubStars": 1271,
      "githubForks": 202,
      "openIssues": 17,
      "lastCommit": "2024-02-12T18:37:31Z"
    },
    "trend": [1490, 2410, 2574, 2483, 2595, 2636, 2101],
    "rank": 1
  }
]
```

### Filter by Category

```bash
# Payments only
curl "http://localhost:3000/api/mcps?category=payments"

# Commerce only
curl "http://localhost:3000/api/mcps?category=commerce"

# Crypto only
curl "http://localhost:3000/api/mcps?category=crypto"
```

### Get Download Trends

```bash
curl http://localhost:3000/api/trends/@stripe%2Fagent-toolkit
```

**Response**

```json
{
  "package": "@stripe/agent-toolkit",
  "trend": [1490, 2410, 2574, 2483, 2595, 2636, 2101]
}
```

---

## Add a New MCP

Edit `lib/mcps.ts`:

```typescript
{
  id: 'your-mcp',
  name: 'Your MCP Name',
  category: 'payments', // or 'commerce' or 'crypto'
  npmPackage: 'your-npm-package',
  githubRepo: 'owner/repo',
  description: 'What it does',
}
```

Restart the dev server. Your MCP appears in the leaderboard.

---

## Project Structure

```
mcp-leaderboard/
├── app/
│   ├── api/
│   │   ├── mcps/route.ts      # Main API endpoint
│   │   └── trends/[package]/  # Trend data endpoint
│   ├── page.tsx               # Dashboard page
│   └── layout.tsx             # Root layout
├── components/
│   ├── Leaderboard.tsx        # Main table
│   ├── MCPCard.tsx            # Expandable card
│   ├── TrendChart.tsx         # Recharts graphs
│   └── CategoryFilter.tsx     # Filter buttons
├── lib/
│   ├── mcps.ts                # MCP registry
│   ├── types.ts               # TypeScript types
│   └── data-sources/
│       ├── npm.ts             # npm API client
│       ├── github.ts          # GitHub API client
│       └── cache.ts           # In-memory cache
```

---

## Data Sources

| Source | What | Rate Limit |
|--------|------|------------|
| [npm Registry API](https://github.com/npm/registry/blob/master/docs/download-counts.md) | Weekly downloads, trends | 1000/min |
| [GitHub REST API](https://docs.github.com/en/rest) | Stars, forks, issues | 60/hr (unauth) |

### Add GitHub Token (Optional)

For higher rate limits, create `.env.local`:

```bash
GITHUB_TOKEN=ghp_your_token_here
```

---

## Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/csmoove530/mcp-leaderboard)

### Docker

```bash
docker build -t mcp-leaderboard .
docker run -p 3000:3000 mcp-leaderboard
```

### Manual

```bash
npm run build
npm start
```

---

## MCPs Tracked

### Payments
- **Stripe Agent Toolkit** — `@stripe/agent-toolkit`
- **Stripe MCP** — `@stripe/mcp`
- **PayPal MCP** — `@anthropic/paypal-mcp`
- **Square MCP** — `square/square-mcp`

### Commerce
- **Shopify Dev MCP** — `@shopify/dev-mcp`
- **Shopify MCP** — `shopify-mcp`
- **Shopify Storefront MCP** — `@wolfielabs/shopify-storefront-mcp-server`

### Crypto
- **x402 MCP** — `x402-mcp`
- **MCPay** — `mcpay`
- **NEAR MCP** — `near-mcp`
- **Coinbase CDP** — `coinbase/cdp-mcp`

---

## Configuration

### Caching

Data is cached for 1 hour. Modify in `lib/data-sources/cache.ts`:

```typescript
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour
```

### ISR Revalidation

Page revalidates hourly. Change in `app/page.tsx`:

```typescript
export const revalidate = 3600; // seconds
```

---

## Tech Stack

- **Next.js 14** — App Router, Server Components
- **Tailwind CSS** — Styling
- **Recharts** — Charts
- **SWR** — Client-side revalidation

---

## Contributing

1. Fork the repo
2. Add your MCP to `lib/mcps.ts`
3. Submit a PR

PRs for new MCPs are welcome.

---

## License

MIT
