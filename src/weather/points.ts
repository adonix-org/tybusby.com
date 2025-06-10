import { Point } from "geojson";
import { QuantitativeValue } from "./common.js";
import { NationalWeatherService } from "./nws.js";

export class Points extends NationalWeatherService<Gridpoint> {
    constructor(
        private readonly latitude: number,
        private readonly longitude: number
    ) {
        super();
    }
    protected get resource(): string {
        return `/points/${this.latitude},${this.longitude}`;
    }
}

export interface Gridpoint {
    id: string;
    type: string;
    geometry: Point;
    properties: GridpointProperties;
}

interface GridpointProperties {
    "@id": string;
    "@type": string;
    cwa: string;
    forecastOffice: string;
    gridId: string;
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
