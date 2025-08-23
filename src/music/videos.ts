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

export class VideoGroup extends EventEmitter<VideoGroupEvents> {
    private readonly parent: HTMLElement;
    private readonly videos: YouTubeVideo[] = [];
    private readonly elementMap = new WeakMap<HTMLElement, Video>();

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
        // Render all previews
        const videoInstances = this.videos.map((v) => new Video(v));
        videoInstances.forEach((v) => {
            this.parent.appendChild(v.element);
            this.elementMap.set(v.element, v);
        });

        // IntersectionObserver to load iframe when visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const video = this.elementMap.get(
                            entry.target as HTMLElement
                        );
                        if (video) {
                            video.loadIframe();
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.25 }
        );

        videoInstances.forEach((v) => observer.observe(v.element));

        return this;
    }
}

class Video extends EventEmitter<VideoEvents> {
    private _element: HTMLElement;
    private _iframeLoaded = false;
    private _previewImg: HTMLImageElement;

    constructor(private readonly video: YouTubeVideo) {
        super();

        this._element = document.createElement("div");
        this._element.classList.add("video-frame");
        this._element.style.position = "relative"; // make container relative for absolute iframe

        // Preview image
        this._previewImg = document.createElement("img");
        this._previewImg.classList.add("video-preview");
        this._previewImg.src = this.video.preview;
        this._previewImg.style.display = "block";
        this._previewImg.style.width = "100%";

        // Overlay & play button
        const overlay = document.createElement("div");
        overlay.classList.add("video-overlay-top");

        const play = document.createElement("div");
        play.classList.add("play-button");

        this._element.appendChild(this._previewImg);
        this._element.appendChild(overlay);
        this._element.appendChild(play);

        // click to autoplay
        this._element.addEventListener("click", () => {
            if (!this._iframeLoaded) this.loadIframe(true);
        });
    }

    public get element() {
        return this._element;
    }

    public loadIframe(autoplay = false) {
        if (this._iframeLoaded) return;
        this._iframeLoaded = true;

        const iframe = document.createElement("iframe");
        iframe.src = `${this.video.video}?enablejsapi=1${
            autoplay ? "&autoplay=1" : ""
        }`;
        iframe.title = "YouTube video player";
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        // initially hidden and absolutely positioned on top of preview
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.display = "none";

        // once loaded, show iframe
        iframe.addEventListener("load", () => {
            iframe.style.display = "block"; // seamlessly covers preview
        });

        this._element.appendChild(iframe);
    }
}
