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

import { DateTime } from "luxon";
import { MetaData } from "./podcast";
import { getElement, getTemplateRoot } from "../elements";

const elementToTrack = new WeakMap<Element, Track>();

export class Track {
    private static readonly TEMPLATE_ID = "track-template";
    private readonly row: HTMLElement;

    constructor(parent: Element, private readonly data: MetaData) {
        this.row = getTemplateRoot(Track.TEMPLATE_ID);
        elementToTrack.set(this.row, this);

        getElement(".track-title", this.row).textContent = this.data.title;
        getElement(".track-album", this.row).textContent = this.formatAlbum();
        getElement(".track-length", this.row).textContent =
            this.formatDuration();

        parent.appendChild(this.row);
    }

    public get element(): HTMLElement {
        return this.row;
    }

    public static fromElement(element?: Element): Track | undefined {
        return element ? elementToTrack.get(element) : undefined;
    }

    public show(): void {
        this.row.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }

    public getUrl(): string {
        return this.data.url;
    }

    protected formatAlbum(): string {
        return `${this.data.album} · ${DateTime.fromISO(
            this.data.date
        ).toFormat("MMM d, yyyy")}`;
    }

    public formatDuration(seconds: number = this.data.seconds): string {
        if (seconds == 0) {
            return `⏱️ --:--`;
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds) % 60;
        return `⏱️ ${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    public getMetaData(): MediaMetadata {
        return new MediaMetadata({
            title: this.data.title,
            album: this.formatAlbum(),
            artist: this.data.artist,
            artwork: [
                {
                    src: "https://cartalk.adonix.org/cover-art.jpg",
                    sizes: "512x512",
                    type: "image/jpeg",
                },
            ],
        });
    }
}
