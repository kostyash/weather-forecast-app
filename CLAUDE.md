# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Install dependencies
yarn install

# Start development server (http://localhost:4200)
npm start

# Build for production
npm run build

# Run tests
npm run test                  # Single run
npm run test:watch           # Watch mode
npm run test:coverage        # With coverage report
```

## Architecture Overview

This is an **Angular 20** weather forecast application using **standalone components** (no NgModules), **NgRx** for state management, and **Angular Material** for UI.

### Smart/Dumb Component Pattern

The app follows a container/presentational component architecture:

- **Container components** (`*-container/`) handle state, services, and data fetching via NgRx selectors and service calls
- **Presentational components** receive data via `input()` signals and emit events via `@Output()`

Data flow: `SearchForm` dispatches `setCity` action -> NgRx store updates -> Container components select city from store -> Services fetch weather data -> Presentational components render

### State Management (NgRx)

Located in `src/app/state/`:
- `actions.ts` - `setCity` action for updating selected city
- `reducer.ts` - manages `LocationState` (city string)
- `selectors.ts` - `selectCity` selector

### Loading State Pattern

`src/app/loading-state-utils.ts` provides `LoadingState<T>` type with three states: `loading`, `loaded`, `error`. Use `toLoadingStateStream()` operator to wrap observables for consistent loading/error handling in templates.

### HTTP Caching

`CachingInterceptor` + `CacheService` cache GET requests to weatherapi.com for 600 seconds (10 minutes).

### Key Interfaces

Defined in `src/app/contracts.ts`: `CurrentWeather`, `Forecast`, `DayForeCast`, `GeoLocation`, `LocationState`

## Testing

Jest is configured (not Karma despite README). Tests use:
- `TestBed.configureTestingModule()` for DI setup
- `provideMockStore()` for NgRx store mocking
- `HttpTestingController` for HTTP mocking
- `fakeAsync()`/`tick()` for async operations

## Key Files

| Purpose | Location |
|---------|----------|
| Routes | `src/app/app.routes.ts` |
| App providers config | `src/app/app.config.ts` |
| NgRx state | `src/app/state/` |
| Weather API calls | `src/app/meteo.service.ts` |
| Cache configuration | `src/app/cache.service.ts` |
| Loading state utility | `src/app/loading-state-utils.ts` |
| Type definitions | `src/app/contracts.ts` |
