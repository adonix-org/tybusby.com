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

import {
    NWSResponseError,
    NWSFetchError,
    NWSParseError,
    NWSProblemDetails,
} from "./error.js";

export abstract class NationalWeatherService<T> {
    private static readonly API_URL = "https://api.weather.gov";

    protected readonly headers = new Headers({
        "User-Agent": "www.tybusby.com (tybusby@gmail.com)",
        Accept: "application/geo+json",
    });

    public async get(): Promise<T> {
        const url = `${NationalWeatherService.API_URL}${this.resource}`;

        let response: Response;
        try {
            response = await fetch(url, {
                method: "GET",
                headers: this.headers,
            });
        } catch (cause) {
            throw new NWSFetchError(url, cause);
        }

        const text = await response.text();
        let json: T | NWSProblemDetails;
        try {
            json = JSON.parse(text);
        } catch (cause) {
            throw new NWSParseError(url, text, cause);
        }

        if (response.ok) {
            return json as T;
        }

        const details = json as NWSProblemDetails;
        throw new NWSResponseError(
            response.status,
            details.title,
            url,
            details
        );
    }

    protected abstract get resource(): string;
}
