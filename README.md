# GPUprice — The Internet's Cheapest GPU Marketplace

**Compute shouldn't cost a kidney.**

GPUprice shows you the real prices — not the marked-up, middleman-inflated nonsense the industry pushes. Track, compare, and deploy GPUs with pure transparency.

## Features

### 🎯 Market Overview
- **Real-time KPI Dashboard**: Track lowest price, average price, total providers, and asset options
- **Live Price Feeds**: Aggregated pricing from decentralized networks, bare-metal datacenters, cloud providers, and community suppliers
- **Transparent Pricing**: No middleman markups, just real market data

### 📊 Asset Price Comparison Table
- **Advanced Search & Filters**: Search by asset or provider, filter by type, provider, and popular models
- **Smart Sorting**: Sort by asset type, provider, VRAM, or price
- **Pricing Unit Toggle**: Switch between "Per Stock" and "Per GB VRAM" views
- **Pagination**: Navigate through results with configurable rows per page
- **Marketplace Badges**: Distinguish between stable Cloud providers and variable Marketplace providers

### 🔄 Live Price Integration
- **TensorDock API**: Real-time marketplace pricing
- **Prime Intellect API**: Official cloud provider pricing
- **Lambda Labs**: Public API integration
- **Smart Merge Strategy**: Combines live and static data for optimal performance

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/prakarshpathak/gpuburnnext.git
cd gpuburnnext
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
PRIME_INTELLECT_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gpuburnnext/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── cron/
│   │   │       └── refresh-prices/
│   │   │           └── route.ts      # API endpoint for live price fetching
│   │   ├── page.tsx                  # Main dashboard page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── AssetPriceComparisonTable.tsx  # Main comparison table
│   │   ├── MarketOverview.tsx              # KPI cards
│   │   ├── ConfigurationPanel.tsx           # Configuration controls
│   │   ├── KPIGrid.tsx                     # KPI grid layout
│   │   ├── SavingsCard.tsx                 # Savings comparison card
│   │   ├── MarketTable.tsx                 # Legacy market table
│   │   └── ui/                             # shadcn/ui components
│   └── lib/
│       ├── data.ts                         # Static GPU data
│       ├── types.ts                        # TypeScript type definitions
│       └── utils.ts                        # Utility functions
└── README.md
```

## API Integrations

### Supported Providers

1. **TensorDock** - Marketplace API for decentralized GPU networks
2. **Prime Intellect** - Official cloud provider API
3. **Lambda Labs** - Public instance types API
4. **Vultr** - Cloud provider API

### Adding New Providers

To add a new provider, update `src/app/api/cron/refresh-prices/route.ts`:

```typescript
try {
  const response = await axios.get('YOUR_API_ENDPOINT');
  // Process response and add to results array
  results.push({
    provider: 'Your Provider',
    model: 'GPU Model',
    price: pricePerHour
  });
} catch (e) {
  console.error("Provider fetch failed", e.message);
}
```

## GPU Data Structure

GPUs are defined with the following structure:

```typescript
{
  id: string | number;
  model: string;
  provider: string;
  price: number;           // Price per hour in USD
  vram: number;            // VRAM in GB
  type: 'High-End' | 'Mid-Range' | 'Budget';
  providerType?: 'Cloud' | 'Marketplace';
  lastUpdated?: Date;
}
```

## Features in Development

- 🔔 **GPUprice Alerts**: Get notified when prices drop or new regions appear
- 📈 **Predictive Price Modeling**: Forecast price trends
- 🔄 **GPU Arbitrage Engine**: Find and exploit price differences
- 🚀 **Automated Workload Routing**: Intelligent deployment recommendations
- 💰 **Intelligent Spend Analyzer**: Track and optimize GPU spending

## Use Cases

- **AI Teams**: Save budget, deploy faster
- **Researchers**: Run experiments without massive bills
- **Startups**: Extend runway and scale cheaply
- **Enterprises**: Use real data to negotiate real contracts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Built With

- Transparency
- Speed
- Zero bullshit

---

**GPUprice** — compute without the cloud tax.
