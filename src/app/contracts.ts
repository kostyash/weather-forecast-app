export interface CurrentWeather {
    location: string;
    desc: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    condition: string;
    image: string;
    date: string;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    uvIndex: number;
    visibility: number;
    cloud: number;
}

export interface DayForeCast {
    minTemperature: number;
    maxTemperature: number;
    condition: string;
    image: string;
    date: string;
    chanceOfRain: number;
    maxWind: number;
    avgHumidity: number;
    uvIndex: number;
}

export interface Forecast {
    location: string;
    days: DayForeCast[]
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface LocationState{
    city: string;
}

export interface LocationSuggestion {
    name: string;
    region: string;
    country: string;
}

export interface Loading {
    state: "loading";
}

export interface Loaded<T> {
    state: "loaded";
    data: T;
}

export interface Errored {
    state: "error";
    error: Error;
}

export type LoadingState<T = unknown> = Loading | Loaded<T> | Errored;
