# Weather Forecast App

An Angular 20 weather forecast application featuring current weather conditions and 3-day forecasts using the WeatherAPI.

## Features

- Current weather display with detailed conditions
- 3-day weather forecast
- Location autocomplete search
- Geolocation support
- Dark theme UI
- HTTP response caching

## Tech Stack

- **Angular 20** with standalone components
- **NgRx** for state management
- **Angular Material** for UI components
- **Jest** for unit testing

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn

### Installation

```bash
yarn install
```

### Development

```bash
npm start
```

Navigate to `http://localhost:4200/`

### Build

```bash
npm run build
```

### Testing

```bash
npm run test              # Single run
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

## Architecture

The app follows a **container/presentational component pattern**:

- **Container components** (`*-container/`) handle state and data fetching via NgRx
- **Presentational components** receive data via `input()` signals and render UI

### State Management

NgRx store manages the selected city. Components select from store and services fetch weather data accordingly.

### Caching

HTTP GET requests to WeatherAPI are cached for 10 minutes via `CachingInterceptor`.
