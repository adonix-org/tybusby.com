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

import { DailyForecast, GridpointDailyForecast } from "./forecast.js";
import { LatestObservation, Observation } from "./observation.js";
import { Gridpoint, Points } from "./points.js";
import { Station, StationCollection, Stations } from "./stations.js";

class Weather {
    private point: Gridpoint | undefined;
    private stations: StationCollection | undefined;
    private station: Station | undefined;
    private current: Observation | undefined;
    private forecast: GridpointDailyForecast | undefined;

    public static async create(
        latitude?: number,
        longitude?: number
    ): Promise<Weather> {
        const instance = new Weather(latitude, longitude);
        await instance.update();
        return instance;
    }

    private constructor(
        private readonly latitude: number = 42.176212,
        private readonly longitude: number = -76.835879
    ) {}

    public getStation() {
        return this.station;
    }

    public getCurrent() {
        return this.current;
    }

    public getForecast() {
        return this.forecast;
    }

    public async update(): Promise<boolean> {
        try {
            this.point = await new Points(this.latitude, this.longitude).get();
            this.stations = await new Stations(this.point).get();

            const station = this.stations.features.at(0);
            if (station) {
                this.station = station;
                this.current = await new LatestObservation(
                    this.station.properties.stationIdentifier
                ).get();
            }
            this.forecast = await new DailyForecast(this.point).get();
            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

const weather = await Weather.create();
console.log(weather.getCurrent());
