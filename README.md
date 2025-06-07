# Travla Dashboard 🏨

A clean, minimal real-time dashboard for hotel group management that operates along Australia's eastern seaboard. Built with Next.js 14, TypeScript, and shadcn/ui.

## ✨ Features

### 📊 Portfolio Overview
- **KPI Cards**: Today's pick-up, 7-day velocity, RevPAR deltas, OTA ratios, NPS scores
- **Occupancy Heatmap**: 30-day forecast visualization with color-coded alerts
- **Real-time Updates**: 3-second polling with optimistic UI updates
- **Critical Alerts**: Automated banner alerts for flash sale opportunities

### 🏨 Property Management
- **Property Cards**: Individual performance metrics with trend indicators
- **Detailed Drill-down**: Tabbed views for bookings, revenue, sentiment, and operations
- **Interactive Charts**: Line charts, area charts, and sparklines using Recharts
- **Quick Actions**: Direct access to price calendars, staff rosters, campaigns

### 💡 Insights Feed
- **AI-Powered Alerts**: Rule engine generates actionable recommendations
- **Infinite Scroll**: Timeline of insights with filtering and search
- **Severity Classification**: High/medium/low priority with color coding
- **Contextual CTAs**: Direct links to relevant management actions

### ⚙️ Leading Indicators Engine
- **Booking Pace**: 24h bookings vs 4-week same-day average
- **RevPAR Momentum**: 7-day forward vs last year comparison
- **Walk-in Trends**: 3-day vs 14-day moving averages
- **Staffing Optimization**: Hours scheduled vs occupancy load
- **Sentiment Tracking**: 7-day review score deltas

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with dark mode support
- **shadcn/ui** component library
- **Recharts** for data visualization
- **SWR** for data fetching with real-time polling

### Backend & Data
- **Supabase** for PostgreSQL database and real-time subscriptions
- **Edge API Routes** for serverless functions
- **TypeScript** schema definitions with full type safety

### Development
- **ESLint + Prettier** for code quality
- **Vitest** for unit testing
- **Turbopack** for fast development builds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/travladashboard.git
cd travladashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Pusher credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Database Setup

The project includes SQL schema and seed data:

```bash
# Set up Supabase database
# 1. Create a new project at https://supabase.com
# 2. Copy the database URL and anon key to .env.local
# 3. Run the SQL schema in the Supabase SQL editor:

cat database.sql
```

## 📁 Project Structure

```
travladashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── properties/        # Property management pages
│   │   ├── insights/          # Insights feed page
│   │   └── settings/          # Settings configuration
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── portfolio-overview.tsx
│   │   ├── properties-list.tsx
│   │   ├── property-detail.tsx
│   │   ├── insights-feed.tsx
│   │   └── navigation.tsx
│   └── lib/                   # Utilities and configurations
│       ├── types.ts          # TypeScript definitions
│       ├── rules.ts          # Leading indicators engine
│       ├── supabase.ts       # Database client
│       └── utils.ts          # Helper functions
├── scripts/
│   └── seed.ts               # Database seeding script
├── database.sql              # Database schema
└── README.md
```

## 🧮 Leading Indicators & Rules Engine

The dashboard implements a sophisticated rule engine that monitors key performance indicators and generates actionable insights:

### Booking Pace Algorithm
```typescript
// Compare today's bookings vs same weekday 4-week average
const pace = todayBookings / avgSameWeekdayBookings
if (pace < 0.8) {
  generateAlert("Flash sale recommended", "high")
}
```

### RevPAR Momentum
```typescript
// 7-day forward vs last year comparison
const revparDelta = (currentRevPAR - lastYearRevPAR) / lastYearRevPAR * 100
if (revparDelta < -5) {
  generateAlert("Pricing review needed", "medium")
}
```

### Staffing Optimization
```typescript
// Staff hours vs occupancy load analysis
const staffingLoad = scheduledHours / expectedOccupancy
if (occupancy > 80 && staffingLoad < 0.7) {
  generateAlert("Call casual staff", "high")
}
```

## 🎨 Design System

The dashboard follows Vercel's design system principles:

- **Typography**: Inter font family with consistent hierarchy
- **Spacing**: 4px grid system with responsive breakpoints
- **Colors**: Neutral palette with semantic color coding
- **Components**: shadcn/ui for consistency and accessibility
- **Layout**: Max-width containers with appropriate padding

### Color Coding
- 🔴 **Red**: High priority alerts, revenue warnings
- 🟡 **Yellow**: Medium priority, operational notices  
- 🔵 **Blue**: Low priority, informational insights
- 🟢 **Green**: Positive trends, targets met

## 📱 Responsive Design

- **Mobile First**: Stacked cards on small screens
- **Tablet**: 2-column grid layout
- **Desktop**: 4-column grid with sidebar details
- **Breakpoints**: Tailwind's default system (sm, md, lg, xl)

## ⚡ Performance

- **LCP Target**: < 1.5s on 4G connections
- **Server Components**: Minimize client-side JavaScript
- **SWR Caching**: Intelligent data fetching with background updates
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Webpack Bundle Analyzer integration

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- Rule engine algorithms
- Component rendering
- API endpoint responses
- Data transformation utilities

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Required for production:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Pusher (for real-time)
NEXT_PUBLIC_PUSHER_APP_ID=your-pusher-app-id
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_SECRET=your-pusher-secret
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster

# Environment
NODE_ENV=production
```

## 🔧 Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server  
npm start

# Lint code
npm run lint

# Run tests
npm run test

# Type check
npm run type-check
```

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Portfolio overview dashboard
- ✅ Property management interface
- ✅ Insights feed with filtering
- ✅ Rule engine for alerts
- ✅ Responsive design

### Phase 2 (Next)
- 🔄 Real-time Pusher integration
- 🔄 Authentication with RBAC
- 🔄 Advanced analytics
- 🔄 Export functionality

### Phase 3 (Future)
- 📅 Web push notifications
- 📅 Slack webhook integration
- 📅 OTA Insight API integration
- 📅 Map view with Leaflet
- 📅 Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For questions or support:
- 📧 Email: dev@travla.com
- 💬 Slack: #travla-dashboard
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/travladashboard/issues)

---

Built with ❤️ by the Travla team for hotel management excellence.
