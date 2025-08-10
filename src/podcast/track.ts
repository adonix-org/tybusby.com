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
    private readonly _element: HTMLElement;

    constructor(parent: Element, private readonly data: MetaData) {
        this._element = getTemplateRoot(Track.TEMPLATE_ID);

        elementToTrack.set(this.element, this);
        this.setTitle().setAlbum().setDuration();
        parent.appendChild(this.element);
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public static fromElement(element?: Element): Track | undefined {
        return element ? elementToTrack.get(element) : undefined;
    }

    public get index(): number {
        return Array.from(this.element.parentElement?.children ?? []).indexOf(
            this.element
        );
    }

    public show(): void {
        this.element.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }

    public getUrl(): string {
        return this.data.url;
    }

    public setTitle(title: string = this.data.title): Track {
        getElement(".track-title", this.element).textContent = title;
        return this;
    }

    public setAlbum(album: string = this.data.album): Track {
        getElement(".track-album", this.element).textContent =
            this.formatAlbum(album);
        return this;
    }

    public setDuration(seconds: number = this.data.seconds): Track {
        getElement(".track-length", this.element).textContent =
            this.formatDuration(seconds);
        return this;
    }

    private formatAlbum(album: string): string {
        return `${album} · ${DateTime.fromISO(this.data.date).toFormat(
            "MMM d, yyyy"
        )}`;
    }

    private formatDuration(seconds: number): string {
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
            album: this.formatAlbum(this.data.album),
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
