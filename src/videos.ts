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

import { EventEmitter } from "./event.js";
import { Progress, ProgressData } from "./progress.js";

interface VideoGroupEvents {
    start: void;
    progress: ProgressData;
    complete: void;
}

interface VideoEvents {
    loaded: string;
    timeout: void;
}

export class VideoGroup extends EventEmitter<VideoGroupEvents> {
    private readonly parent: HTMLElement;

    constructor(parentId: string, private readonly urls: string[]) {
        super();
        const element = document.getElementById(parentId);
        if (!element) {
            throw new Error(`Element with ID "${parentId}" not found.`);
        }
        this.parent = element;
    }

    public load(): this {
        this.emit("start");

        let current = 0;
        const total = this.urls.length;

        const progress = () => {
            current += 1;
            this.emit("progress", Progress.calculate(current, total));
            if (current >= total) {
                this.emit("complete");
            }
        };

        this.emit("progress", Progress.calculate(0, total));
        this.urls.forEach((url) => {
            const video = new Video(url);
            this.parent.appendChild(video.element);
            video.on("loaded", progress);
            video.on("timeout", progress);
        });
        return this;
    }
}

class Video extends EventEmitter<VideoEvents> {
    private static readonly TIMEOUT = 30_000;
    private readonly video: HTMLElement;
    private completed = false;

    constructor(private readonly url: string) {
        super();
        this.video = this.createElement();
    }

    public get element(): HTMLElement {
        return this.video;
    }

    private createElement(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.classList.add("video-frame");

        const iframe = document.createElement("iframe");
        iframe.src = this.url;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        const handleLoad = () => {
            if (this.completed) return;
            this.completed = true;

            clearTimeout(timeoutId);
            iframe.removeEventListener("load", handleLoad, true);
            wrapper.classList.add("loaded");
            iframe.classList.add("loaded");
            this.emit("loaded", this.url);
        };

        iframe.addEventListener("load", handleLoad, true);

        const timeoutId = setTimeout(() => {
            if (this.completed) return;
            this.completed = true;

            iframe.removeEventListener("load", handleLoad, true);
            wrapper.classList.add("timeout");
            this.emit("timeout");
            console.error(`Timeout loading: ${this.url}`);
        }, Video.TIMEOUT);

        wrapper.appendChild(iframe);
        return wrapper;
    }
}
