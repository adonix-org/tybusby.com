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

import { NWSError } from "./error.js";

export abstract class NationalWeatherService<T> {
    private static readonly API_URL = "https://api.weather.gov";

    protected readonly headers = new Headers({
        "User-Agent": "www.tybusby.com (tybusby@gmail.com)",
        Accept: "application/geo+json",
    });

    public async get(): Promise<T> {
        const url = `${NationalWeatherService.API_URL}${this.resource}`;
        const response = await fetch(url, {
            headers: this.headers,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new NWSError(data, response.status, url);
        }
        return data as T;
    }

    protected abstract get resource(): string;
}
