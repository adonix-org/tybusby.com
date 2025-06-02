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
    loading: void;
    progress: ProgressData;
    loaded: void;
}

interface VideoEvents {
    loaded: string;
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

    public load(): void {
        this.emit("loading");

        let current = 0;
        const total = this.urls.length;

        this.emit("progress", Progress.calculate(current, total));
        this.urls.forEach((url) => {
            const video = new Video(url);
            this.parent.appendChild(video.element);
            video.on("loaded", () => {
                current += 1;
                this.emit("progress", Progress.calculate(current, total));
                if (current === total) {
                    this.emit("loaded");
                }
            });
        });
    }
}

class Video extends EventEmitter<VideoEvents> {
    private readonly video: HTMLElement;

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
        wrapper.tabIndex = -1;

        const iframe = document.createElement("iframe");
        iframe.tabIndex = 0;
        iframe.src = this.url;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        iframe.addEventListener(
            "load",
            () => {
                wrapper.classList.add("loaded");
                iframe.classList.add("loaded");
                this.emit("loaded", this.url);
            },
            true
        );

        wrapper.appendChild(iframe);
        return wrapper;
    }
}
