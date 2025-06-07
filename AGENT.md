# Travla Dashboard - Agent Instructions

## Development Commands

### Main Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - Run TypeScript type checking

### Deployment
- `vercel` - Deploy to preview
- `vercel --prod` - Deploy to production

## Project Structure

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (including shadcn/ui)
- `src/lib/` - Utilities, types, and business logic
- `scripts/` - Database seeding and utility scripts

### Important Files
- `src/lib/rules.ts` - Leading indicators rule engine
- `src/lib/types.ts` - TypeScript type definitions
- `src/lib/supabase.ts` - Database client configuration
- `database.sql` - Database schema and initial data
- `scripts/seed.ts` - Database seeding script

## Tech Stack

### Frontend
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for components
- Recharts for data visualization
- SWR for data fetching with polling

### Backend & Database
- Supabase for PostgreSQL database
- Edge API routes for serverless functions
- Mock data for development (see `/api/metrics`)

### Testing & Quality
- Vitest for unit testing
- React Testing Library for component tests
- ESLint for code quality (temporarily disabled during builds)

## Key Features

### Dashboard Components
1. **Portfolio Overview** (`/`) - KPI cards, occupancy heatmap, alerts
2. **Properties** (`/properties`) - Property cards with metrics
3. **Property Details** (`/properties/[id]`) - Detailed drill-down with tabs
4. **Insights Feed** (`/insights`) - AI-powered recommendations
5. **Settings** (`/settings`) - Configuration and preferences

### Rule Engine
- Booking pace calculation (24h vs 4-week average)
- RevPAR momentum tracking (7-day vs last year)
- Walk-in trend analysis (3-day vs 14-day average)
- Staffing optimization alerts
- Guest sentiment monitoring

## Development Notes

### Environment Variables
Required for production:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_PUSHER_APP_ID=your-pusher-app-id
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_SECRET=your-pusher-secret
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster
```

### Mock Data
- Currently using mock data in `/api/metrics`
- Replace with real Supabase queries when database is configured
- Seed script available in `scripts/seed.ts`

### Performance Optimizations
- Server Components for initial rendering
- SWR with 3-second polling for real-time updates
- Image optimization with Next.js
- Tailwind CSS for minimal bundle size

### Code Quality
- TypeScript strict mode enabled
- Vitest for unit tests (17 tests currently passing)
- ESLint configured (temporarily disabled during builds)
- Prettier formatting (recommended)

### Known Issues & TODOs
- Real-time Pusher integration pending
- Authentication/RBAC not yet implemented
- Some ESLint warnings need cleanup
- Additional chart components could be added

## Deployment Checklist

1. ✅ Project builds successfully
2. ✅ All tests pass
3. ✅ Environment variables configured
4. ✅ Vercel configuration ready
5. ⏳ Database setup and seeding
6. ⏳ Real-time functionality
7. ⏳ Authentication setup

## Development Workflow

1. **Feature Development**
   - Create feature branch
   - Add components in `src/components/`
   - Add types in `src/lib/types.ts`
   - Add business logic in `src/lib/`
   - Write tests in `*.test.ts` files

2. **Testing**
   - Unit tests for business logic (especially rules engine)
   - Component tests for UI components
   - Integration tests for API routes

3. **Quality Assurance**
   - Type check with `npm run type-check`
   - Test with `npm run test`
   - Build check with `npm run build`
   - Manual testing in browser

4. **Deployment**
   - Push to main branch
   - Vercel auto-deploys from main
   - Monitor build logs and deployment
