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
    load: string;
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
        this.emit("progress", Progress.getProgress(current, this.urls.length));
        this.urls.forEach((url) => {
            const video = new Video(url);
            this.parent.appendChild(video.element);
            video.on("load", () => {
                current += 1;
                this.emit(
                    "progress",
                    Progress.getProgress(current, this.urls.length)
                );
                if (current === this.urls.length) {
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
        wrapper.classList.add("video-frame", "loading");

        const iframe = document.createElement("iframe");
        iframe.src = this.url;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        iframe.addEventListener(
            "load",
            () => {
                wrapper.classList.remove("loading");
                iframe.classList.add("loaded");
                this.emit("load", this.url);
            },
            true
        );

        wrapper.appendChild(iframe);
        return wrapper;
    }
}
