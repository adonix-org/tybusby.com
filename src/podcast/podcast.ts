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

export interface MetaTrack {
    url: string;
    filename: string;
    title: string;
    description: string;
    artist: string;
    artists: string[];
    album: string;
    year: number;
    date: string;
    seconds: number;
    genre: string[];
    channels: number;
}

export interface MetaPodcast {
    name: string;
    artwork: string;
    copyright: string;
    seasons: string[];
}

export interface ErrorJson {
    status: number;
    error: string;
    details: string;
}

export class HTTPError extends Error implements ErrorJson {
    constructor(
        public status: number,
        public error: string,
        public details: string,
        public url: string,
        options?: { cause?: unknown }
    ) {
        super(`${status} ${error} for ${url}`, options);
        this.name = new.target.name;
    }
}

export class Podcast {
    private static readonly VERSION = "v1";
    private readonly api: URL;

    constructor(private readonly base: string = "https://podcast.adonix.org") {
        this.api = new URL(`${this.base}/api/${Podcast.VERSION}/seasons`);
    }

    public async getPodcast(): Promise<MetaPodcast> {
        return await this.get<MetaPodcast>();
    }

    public async getSeason(season: string): Promise<MetaTrack[]> {
        const url = new URL(`${this.api.toString()}/${season}`);
        return await this.get<MetaTrack[]>(url);
    }

    protected async get<T>(url: URL = this.api): Promise<T> {
        let response: Response;
        try {
            response = await fetch(url, { method: "GET" });
        } catch (cause) {
            throw new Error(
                `Network error fetching ${url.toString()}: ${String(cause)}`,
                { cause }
            );
        }

        const text = await response.text();

        if (response.ok) {
            if (!text) return {} as T;
            return JSON.parse(text) as T;
        }

        let json: ErrorJson;
        try {
            json = JSON.parse(text);
        } catch (error) {
            throw new HTTPError(
                response.status,
                response.statusText,
                text,
                url.toString(),
                { cause: error }
            );
        }
        throw new HTTPError(
            json.status,
            json.error,
            json.details,
            url.toString()
        );
    }
}
