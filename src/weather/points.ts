import { Point } from "geojson";
import { QuantitativeValue } from "./common.js";
import { NationalWeatherService } from "./nws.js";

export class Points extends NationalWeatherService<GeoJsonPoint> {
    constructor(
        private readonly latitude: number = 42.1971677,
        private readonly longitude: number = -76.8028933
    ) {
        super();
    }
    protected get resource(): string {
        return `/points/${this.latitude},${this.longitude}`;
    }
}

export interface GeoJsonPoint {
    id: string;
    type: string;
    geometry: Point;
    properties: PointProperties;
}

interface PointProperties {
    "@id": string;
    "@type": string;
    cwa: string;
    forecastOffice: string;
    gridID: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: RelativeLocation;
    forecastZone: string;
    county: string;
    fireWeatherZone: string;
    timeZone: string;
    radarStation: string;
}

interface RelativeLocation {
    type: string;
    geometry: Point;
    properties: RelativeLocationProperties;
}

interface RelativeLocationProperties {
    city: string;
    state: string;
    distance: QuantitativeValue;
    bearing: QuantitativeValue;
}
