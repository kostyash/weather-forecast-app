export interface CurrentWeather {
    location: string;
    desc: string;
    temperature: number;
    humidity: number;
    condition: string;
    image: string;
    date: string;
}

export interface DayForeCast {    
    minTemperature: number;
    maxTemperature: number;
    condition: string;
    image: string;
    date: string;   
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
