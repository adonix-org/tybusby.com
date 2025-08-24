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

interface YouTubeVideo {
    id: string;
    preview: string;
    video: string;
}

export class VideoGroup {
    private readonly parent: HTMLElement;
    private readonly videos: YouTubeVideo[] = [];
    private readonly elementMap = new WeakMap<HTMLElement, Video>();

    constructor(parentId: string, ids: string[]) {
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
        const videoInstances = this.videos.map((v) => new Video(v));
        videoInstances.forEach((v) => {
            this.parent.appendChild(v.element);
            this.elementMap.set(v.element, v);
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const video = this.elementMap.get(
                            entry.target as HTMLElement
                        );
                        if (video) {
                            video.load();
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

class Video {
    public readonly element: HTMLElement;
    private loaded = false;

    constructor(private readonly video: YouTubeVideo) {

        this.element = document.createElement("div");
        this.element.classList.add("video-frame");

        const preview = document.createElement("img");
        preview.classList.add("video-preview");
        preview.src = this.video.preview;

        const overlay = document.createElement("div");
        overlay.classList.add("video-overlay-top");

        const play = document.createElement("div");
        play.classList.add("play-button");

        this.element.appendChild(preview);
        this.element.appendChild(overlay);
        this.element.appendChild(play);
    }

    public load() {
        if (this.loaded) return;
        this.loaded = true;

        const iframe = document.createElement("iframe");
        iframe.classList.add("youtube-video");
        iframe.src = this.video.video;
        iframe.title = "YouTube Video Player";
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        iframe.addEventListener("load", () => {
            setTimeout(() => {
                iframe.classList.add("loaded");
            }, 500);
        });

        this.element.appendChild(iframe);
    }
}
