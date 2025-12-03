# cheapestGPU - The Internet's Cheapest GPU Marketplace

GPUprice is a real-time data dashboard that aggregates and compares GPU cloud pricing from multiple providers. It helps AI engineers, researchers, and startups find the most cost-effective compute resources by tracking prices across bare-metal clouds and decentralized marketplaces.

## 🚀 Features

### Real-Time Price Tracking
- **Multi-Provider Aggregation**: Fetches live pricing from **Prime Intellect, Lambda Labs, Vultr, TensorDock, RunPod, and Vast.ai**.
- **Smart Merging**: Dynamically merges live API data with static fallback data to ensure the dashboard is always populated.
- **Parallel Fetching**: Optimized API route fetches data from all providers concurrently for fast load times.

### Data Visualization & Analysis
- **Market Overview**: Instant insights into the lowest global price, average market price, total active providers, and available asset configurations.
- **Asset Price Comparison**: A powerful, sortable, and filterable table to compare GPUs by Model, Provider, VRAM, and Price/Hour.
- **Burn Rate Calculator**: Estimate monthly costs based on GPU count and usage hours.
- **Savings Calculator**: Compare cloud provider costs against buying hardware (ROI analysis).

### User Experience
- **Dark/Light Mode**: Fully responsive UI with theme support.
- **Responsive Design**: Optimized for desktop and mobile viewing.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks (`useGPUPrices`)
- **API Client**: Axios

## 🚦 Current Status

### ✅ Working
- **Live API Integration**: Successfully fetching and displaying data from:
    - Vast.ai (Marketplace, includes VRAM data)
    - RunPod (GraphQL API)
    - TensorDock (Marketplace API)
    - Prime Intellect
    - Lambda Labs
    - Vultr
- **Data Accuracy**: VRAM and GPU Types (High-End/Mid-Range/Budget) are correctly inferred and displayed.
- **Performance**: API requests are parallelized using `Promise.allSettled`.
- **UI Components**: All calculators, tables, and charts are functional.

### ⚠️ Limitations / In Progress
- **Spheron Integration**: Currently uses static pricing data. API integration requires an organization context/API key which is pending.
- **Historical Data**: Price history is currently ephemeral or static. A database integration (e.g., Supabase/Postgres) is needed to persist historical trends.
- **API Rate Limits**: Heavy usage may trigger rate limits from public APIs (Lambda, Vultr).

## 📦 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prakarshpathak/gpuburnnext.git
   cd gpuburn-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file and add your API keys:
   ```env
   PRIME_INTELLECT_API_KEY=your_key_here
   TENSORDOCK_API_KEY=your_key_here
   RUNPOD_API_KEY=your_key_here
   # Vast.ai key is currently hardcoded for demo purposes but should be moved here.
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit `http://localhost:3000` to see the dashboard.

## 📂 Project Structure

- `src/app/page.tsx`: Main dashboard view.
- `src/hooks/useGPUPrices.ts`: Custom hook for centralized data fetching and state management.
- `src/app/api/cron/refresh-prices/route.ts`: Backend API route that scrapes/fetches data from providers.
- `src/components/`: UI components (MarketOverview, AssetPriceComparisonTable, Calculators).
- `src/lib/data.ts`: Static fallback data and utility functions.
