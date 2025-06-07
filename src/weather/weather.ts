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

import { Observation } from "./observation.js";

const response = await fetch(
    // Newport News, VA KPHF
    "https://api.weather.gov/stations/KELM/observations/latest",
    {
        method: "GET",
        headers: {
            "User-Agent": "www.tybusby.com (tybusby@gmail.com)",
            Accept: "application/geo+json",
        },
    }
);

if (response.ok) {
    const observation: Observation = await response.json();
    console.log(observation);
    const presentWeather = observation.properties.presentWeather;
    presentWeather.forEach((value) => {
        console.log(value.weather);
    });
}
