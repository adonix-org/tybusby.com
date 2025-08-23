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

import { getElementById } from "../elements";
import { EventEmitter } from "../event";
import { ProgressData } from "../progress";
import { Spinner } from "../spinner";

interface YouTubeVideo {
    id: string;
    preview: string;
    video: string;
}

interface VideoGroupEvents {
    start: void;
    progress: ProgressData;
    complete: void;
}

interface VideoEvents {
    loaded: string;
    timeout: void;
}

const spinner = new Spinner();

export class VideoGroup extends EventEmitter<VideoGroupEvents> {
    private readonly parent: HTMLElement;
    private readonly videos: YouTubeVideo[] = [];

    constructor(parentId: string, ids: string[]) {
        super();
        this.parent = getElementById(parentId);
        ids.forEach((id) => {
            this.videos.push({
                id,
                preview: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
                video: `https://www.youtube-nocookie.com/embed/${id}`,
            });
        });
    }

    public load(): this {
        this.videos.forEach((v) => {
            const video = new Video(v);
            this.parent.appendChild(video.element);
        });
        return this;
    }
}

class Video extends EventEmitter<VideoEvents> {
    private _element: HTMLElement;
    constructor(private readonly video: YouTubeVideo) {
        super();
        this._element = document.createElement("div");
        this.element.classList.add("video-frame");
        this.element.addEventListener("click", () => this.onclick());

        const preview = document.createElement("img");
        preview.classList.add("video-preview");
        preview.src = this.video.preview;

        const overlay = document.createElement("div");
        overlay.classList.add("video-overlay-top");

        const title = document.createElement("div");
        title.classList.add("video-title");
        title.innerText = "Dave Brubeck - Take Five";

        const play = document.createElement("div");
        play.classList.add("play-button");

        this.element.appendChild(overlay);
        this.element.appendChild(title);
        this.element.appendChild(preview);
        this.element.appendChild(play);
    }

    public get element() {
        return this._element;
    }

    private onclick() {
        spinner.start();
        console.log("CLICKED! " + this.video.video);

        const iframe = document.createElement("iframe");
        iframe.src = `${this.video.video}?autoplay=true`;
        iframe.title = "YouTube video player";
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        iframe.style.display = "none"; // hide until loaded
        this.element.appendChild(iframe);

        iframe.addEventListener("load", () => {
            iframe.style.display = "block";
            spinner.stop();
        });
    }
}
