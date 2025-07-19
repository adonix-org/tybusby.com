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

import { NationalWeatherService, WeatherReport } from "@adonix.org/nws-report";
import { ReportRender } from "./render/report";
import { Progress } from "../progress";
import { Spinner } from "../spinner";

NationalWeatherService.origin = "https://nws.tybusby.com";

/**
 * Order is latitude, longitude.
 */
type Coordinate = [number, number];

const coordinates: Coordinate[] = [
    // Horseheads, NY
    [42.1762, -76.8358],

    // Waynesboro, VA
    [38.0762, -78.9125],

    // Yorktown, VA
    [37.2367, -76.5065],

    // Waverly, IA
    [42.7382, -92.4781],

    // Sheldon, IA
    [43.1828, -95.8418],
];

const promises = coordinates.map(([lat, lon]) =>
    WeatherReport.create(lat, lon)
        .catch((error: unknown) => {
            if (error instanceof Error) {
                return error;
            }
            return new Error(`Unexpected error: ${String(error)}`, {
                cause: error,
            });
        })
        .finally(() => updateStatus(++completed))
);

const REPORT_PARENT_ID = "weather-grid";
const REFRESH_RATE = 1000 * 60 * 2; // 2 minutes

Promise.all(promises).then((results) => {
    const parent = document.getElementById(REPORT_PARENT_ID);
    if (!parent) {
        throw new Error(`Element with ID "${REPORT_PARENT_ID}" not found.`);
    }
    results.forEach((result, index) => {
        if (result instanceof Error) {
            console.group(`positions[${index}]: ${result.message}`);
            console.error(result);
            console.dir(result);
            console.groupEnd();
        } else {
            const reportRenderer = new ReportRender(parent, result);
            reportRenderer.render();
            setInterval(() => {
                reportRenderer.refresh();
                console.log(
                    `refreshing ${result.station?.properties.stationIdentifier} at ${new Date().toLocaleTimeString()}`
                );
            }, REFRESH_RATE);
        }
    });
});

let completed = 0;

const progress = new Progress();
const spinner = new Spinner();
spinner.start();

function updateStatus(current: number) {
    progress.percent = Progress.calculate(current, coordinates.length).percent;
    if (current >= coordinates.length) {
        progress.complete();
        spinner.stop();
    }
}
