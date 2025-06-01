import { EventEmitter } from "./event.js";

interface VideoGroupEvents {
    loading: void;
    progress: VideoGroupProgress;
    loaded: void;
}

interface VideoGroupProgress {
    count: number;
    total: number;
    percent: number;
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
        this.emit("progress", this.getProgress(0));
        this.urls.forEach((url) => {
            const video = new Video(url);
            this.parent.appendChild(video.element);
            video.on("load", () => {
                current += 1;
                this.emit("progress", this.getProgress(current));
            });
        });
        this.emit("loaded");
    }

    private getProgress(currentCount: number): VideoGroupProgress {
        return {
            count: currentCount,
            total: this.urls.length,
            percent: Math.round((currentCount / this.urls.length) * 100),
        };
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
        iframe.referrerPolicy = "no-referrer";

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
