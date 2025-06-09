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

import { NationalWeatherService } from "./nws.js";
import { Geometry, QuantitativeValue } from "./types";

abstract class BaseGridpointForecast<T> extends NationalWeatherService<T> {
    constructor(
        protected readonly gridId: string = "BGM",
        protected readonly gridX: number = 34,
        protected readonly gridY: number = 56
    ) {
        super();
    }

    protected abstract get endpoint(): string;

    protected get resource(): string {
        return `/gridpoints/${this.gridId}/${this.gridX},${this.gridY}/${this.endpoint}`;
    }
}

export class DailyForecast extends BaseGridpointForecast<GridpointDailyForecast> {
    protected get endpoint(): string {
        return "forecast";
    }
}

export class HourlyForecast extends BaseGridpointForecast<GridpointHourlyForecast> {
    protected get endpoint(): string {
        return "forecast/hourly";
    }
}

type GridpointDailyForecast = Forecast<GridpointDailyForecastPeriod>;
type GridpointHourlyForecast = Forecast<GridpointHourlyForecastPeriod>;

interface Forecast<P extends ForecastPeriod> {
    type: string;
    geometry: Geometry;
    properties: GridpointForecast<P>;
}

interface GridpointForecast<P extends ForecastPeriod> {
    units: string;
    forecastGenerator: string;
    generatedAt: Date;
    updateTime: Date;
    validTimes: string;
    elevation: QuantitativeValue;
    periods: P[];
}

interface ForecastPeriod {
    number: number;
    name: string;
    startTime: Date;
    endTime: Date;
    isDaytime: boolean;
    temperature: number;
    temperatureTrend: string;
    windSpeed: string;
    windDirection: string;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
    probabilityOfPrecipitation: QuantitativeValue;
}

interface GridpointDailyForecastPeriod extends ForecastPeriod {}

interface GridpointHourlyForecastPeriod extends ForecastPeriod {
    dewpoint: QuantitativeValue;
    relativeHumidity: QuantitativeValue;
}
