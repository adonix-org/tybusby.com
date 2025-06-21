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

import { Position } from "geojson";
import { Progress } from "../progress.js";
import { WeatherReport } from "./report.js";
import { WeatherRenderer } from "./render.js";
import { Spinner } from "../spinner.js";

/**
 * GeoJson coordinates are [ lon, lat ].
 */
const positions: Position[] = [
    // Horseheads, NY
    [-76.8358, 42.1762],

    // Waynesboro, VA
    [-78.9125, 38.0762],

    // Yorktown, VA
    [-76.5065, 37.2367],

    // Waverly, IA
    [-92.4781, 42.7382],

    // Sheldon, IA
    [-95.8418, 43.1828],
];

const promises = positions.map(([lon, lat]) =>
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

Promise.all(promises).then((results) => {
    results.forEach((result, index) => {
        if (result instanceof Error) {
            console.group(`positions[${index}]: ${result.message}`);
            console.error(result);
            console.dir(result);
            console.groupEnd();
        } else {
            new WeatherRenderer(result).render();
        }
    });
});

let completed = 0;

const progress = new Progress();
const spinner = new Spinner();
spinner.start();

function updateStatus(current: number) {
    progress.percent = Progress.calculate(current, positions.length).percent;
    if (current >= positions.length) {
        console.log("dev-header", localStorage.getItem("dev-headers"));
        progress.complete();
        spinner.stop();
    }
}
