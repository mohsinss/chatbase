# Comprehensive Testing Strategy

This document outlines the testing strategy for the Authentic application.

## Core Testing Principles & Scope

1. **Test Critical Paths First:** Prioritize core user journeys over exhaustive coverage
2. **Balance Coverage:** Target 80% coverage on critical paths
3. **Right Tool for Job:** Match test type to scenario
4. **Fail Fast:** Catch issues early in development
5. **Real-World Testing:** Simulate actual user environments
6. **TDD When Appropriate:** Consider test-first for complex features

**Note:** The application does not support multiple languages, so internationalization testing is not in scope.

## Test Types

### Unit Tests
- **Focus:** Individual functions/utilities (Jest)
- **Location:** `src/__tests__/unit/` and co-located with implementation
- **Next.js Specific:** Mock hooks and context providers

### Component Tests
- **Focus:** React components (React Testing Library)
- **Next.js Specific:**
  - Server Components: Test rendering and data passing
  - Client Components: Test interactivity and state management
  - Test `"use client"` directive usage

### Integration Tests
- **Focus:** Module interactions, data flow patterns (SWR/React Query)

### API Tests
- **Focus:** Endpoints and data flow (Supertest + Jest)
- **Next.js Specific:** Test route handlers with `next-test-api-route-handler`

### End-to-End Tests
- **Tool:** Playwright (recommended for better cross-browser support)
- **Focus:** Critical user journeys and workflows

### Specialized Tests
- **Accessibility, Performance, Visual Regression**

## Test Organization

Tests should mirror the app directory structure:

```
src/app/(main)/profile/__tests__/
  ├── page.test.tsx  # Tests for page.tsx
  └── layout.test.tsx  # Tests for layout.tsx
```

## Test Environments

1. **JSDOM environment** (`npm test`): For component and UI tests
2. **Node.js environment** (`npm run test:node`): For API and database tests

## Mocking Strategies

### Prisma Mocking (Example)
```typescript
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      // Other methods...
    },
  }
}));
```

For comprehensive Prisma mocking, the centralized mock (`src/__tests__/mocks/mockPrisma.ts`) provides:
- Typed mocks for all models
- Auto-reset between tests
- Simulated relationships between models

```typescript
// Example usage
import { setupMockData } from '@/__tests__/mocks/mockPrisma';

beforeEach(() => {
  setupMockData({
    user: [{ id: 'user1', username: 'testuser' }],
    content: [{ id: 'content1', userId: 'user1' }]
  });
});
```

### Other Mocking Areas
- **External:** S3 storage, auth services, third-party APIs
- **Browser:** MediaDevices, Canvas, File API, Service Workers
- **Next.js:** Router, Head, Image component, App Router hooks

## Essential Environment Variables

For testing, ensure these are set in `.env.test`:
- `DATABASE_URL` and `DATABASE_URL_UNPOOLED`
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- `WASABI_ACCESS_KEY`, `WASABI_SECRET_KEY`, `WASABI_BUCKET`

## Next.js Specific Testing

### App Router Components
- Test Server and Client Components differently
- Test layouts with various children
- Verify metadata and SEO tags
- Test middleware redirects and auth logic

### Testing Route Handlers
```typescript
import { GET } from '../route';
import { NextRequest } from 'next/server';

test('GET returns users', async () => {
  const request = new NextRequest('http://localhost:3000/api/users');
  const response = await GET(request);
  expect(response.status).toBe(200);
});
```

### Other Next.js Concerns
- Reset cache between tests using `jest.resetModules()`
- Test loading states, error boundaries, and suspense
- Test dynamic imports and code splitting

## Cross-Platform & Performance

- **Target browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions), Mobile Safari (iOS 14+), Chrome Android
- **Performance metrics:** Core Web Vitals (FCP, LCP, CLS), bundle size, server response times
- **PWA features:** Service worker, offline functionality, push notifications

## Test Priorities

1. **Critical Paths:** Auth, media upload, follower functionality, core UI, storage
2. **Edge Cases:** Network interruptions, permissions, file validation, error recovery
3. **Cross-Platform:** Mobile/desktop compatibility, browser support, PWA features

## Best Practices

1. **Test Isolation:** Prevent interference between tests
2. **Clear Naming:** Descriptive test names
3. **AAA Pattern:** Arrange-Act-Assert
4. **Reset State:** Clean teardown after tests
5. **Reset Caches:** Be aware of Next.js caching between tests
6. **Realistic Data:** Use representative test data
7. **Focus on User Journeys:** Test from user perspective

## Continuous Integration & Pre-build Tests

- Unit/component tests on every PR
- Integration/E2E tests on schedule
- Coverage thresholds enforced

```bash
npm run pre-build  # Runs typechecking, tests, and build verification
```

## Feature-Specific Focus

- **Media:** Upload, processing, expiration, formats
- **Content:** Display, access controls, responsiveness
- **Auth:** Login flows, tokens, permissions
- **Social:** Follow requests, privacy, notifications

## Success Metrics

- 80%+ coverage on critical paths
- Fast test execution (<5min for PR builds)
- Low flakiness (<2%)
- Minimal production bugs 