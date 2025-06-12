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
import { WeatherLocation } from "./location.js";
import { WeatherRenderer } from "./render.js";

const positions: Position[] = [
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

const progress = new Progress();
let current = 0;
for (const coordinate of positions) {
    try {
        const weather = await WeatherLocation.create(
            coordinate[0],
            coordinate[1]
        );
        new WeatherRenderer("weather-grid", weather);
    } catch (err) {
        console.error(err);
    }
    current++;
    progress.percent = Progress.calculate(current, positions.length).percent;
}
progress.complete();
