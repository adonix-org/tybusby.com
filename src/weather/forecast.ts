/*
 * Copyright (C) 2025 Ty Busby
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NationalWeatherService } from "./nws";
import { Geometry, QuantitativeValue } from "./types";

export class DailyForecaster extends NationalWeatherService<DailyForecast> {
    constructor(
        private readonly gridId: string = "BGM",
        private readonly gridX: number = 34,
        private readonly gridY: number = 56
    ) {
        super();
    }

    protected get resource(): string {
        return `/gridpoints/${this.gridId}/${this.gridX},${this.gridY}/forecast`;
    }
}

export class HourlyForecaster extends NationalWeatherService<HourlyForecast> {
    constructor(
        private readonly gridId: string = "BGM",
        private readonly gridX: number = 34,
        private readonly gridY: number = 56
    ) {
        super();
    }

    protected get resource(): string {
        return `/gridpoints/${this.gridId}/${this.gridX},${this.gridY}/forecast/hourly`;
    }
}

type Period = Gridpoint12hForecastPeriod | GridpointHourlyForecastPeriod;

interface DailyForecast {
    type: string;
    geometry: Geometry;
    properties: GridpointForecast<Gridpoint12hForecastPeriod>;
}

interface HourlyForecast {
    type: string;
    geometry: Geometry;
    properties: GridpointForecast<GridpointHourlyForecastPeriod>;
}

interface GridpointForecast<P extends Period> {
    units: string;
    forecastGenerator: string;
    generatedAt: Date;
    updateTime: Date;
    validTimes: string;
    elevation: QuantitativeValue;
    periods: P[];
}

interface Gridpoint12hForecastPeriod {
    number: number;
    name: string;
    startTime: Date;
    endTime: Date;
    isDaytime: boolean;
    temperature: number;
    temperatureTrend: string;
    probabilityOfPrecipitation: QuantitativeValue;
    windSpeed: string;
    windDirection: string;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
}

interface GridpointHourlyForecastPeriod extends Gridpoint12hForecastPeriod {
    dewpoint: QuantitativeValue;
    relativeHumidity: QuantitativeValue;
}
