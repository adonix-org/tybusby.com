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

export interface MetaData {
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

export class HTTPError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly body: string,
        public readonly url: string
    ) {
        super(body);
        this.name = new.target.name;
    }
}

export class Podcast {
    private static readonly BASE = new URL("https://podcast.adonix.org");

    public async getSeasons(): Promise<string[]> {
        return await this.get<string[]>();
    }

    public async getPlaylist(season: string): Promise<MetaData[]> {
        const url = new URL(Podcast.BASE.toString());
        url.searchParams.set("season", season);
        return await this.get<MetaData[]>(url);
    }

    protected async get<T>(url: URL = Podcast.BASE): Promise<T> {
        let response: Response;
        try {
            response = await fetch(url, {
                method: "GET",
            });
        } catch (cause) {
            if (cause instanceof Error) {
                throw cause;
            }
            throw new Error(`${String(cause)} ${url.toString()}`, {
                cause,
            });
        }

        if (response.ok) {
            return (await response.json()) as T;
        }

        const text = await response.text();
        throw new HTTPError(
            response.status,
            response.statusText,
            text,
            url.toString()
        );
    }
}
