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
    private readonly _parent: HTMLElement;
    constructor(parentId: string, private readonly _urls: string[]) {
        super();
        const parent = document.getElementById(parentId);
        if (!parent) {
            throw new Error(`Element with ID "${parentId}" not found.`);
        }
        this._parent = parent;
    }

    public load(): void {
        this.emit("loading");
        let current = 0;
        this.emit("progress", this.getProgress(0));
        this._urls.forEach((url) => {
            const video = new Video(url);
            this._parent.appendChild(video.element);
            video.on("load", () => {
                current += 1;
                this.emit("progress", this.getProgress(current));
                console.log(`${url} loaded.`);
            });
        });
        this.emit("loaded");
    }

    private getProgress(currentCount: number): VideoGroupProgress {
        return {
            count: currentCount,
            total: this._urls.length,
            percent: Math.round((currentCount / this._urls.length) * 100.0),
        };
    }
}

class Video extends EventEmitter<VideoEvents> {
    private readonly _element: HTMLElement;

    constructor(private readonly _url: string) {
        super();
        this._element = this.createElement();
    }

    public get element(): HTMLElement {
        return this._element;
    }

    private createElement(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.classList.add("video-frame", "loading");

        const iframe = document.createElement("iframe");
        iframe.src = this._url;
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";

        iframe.addEventListener(
            "load",
            () => {
                wrapper.classList.remove("loading");
                iframe.classList.add("loaded");
                this.emit("load", this._url);
            },
            true
        );

        wrapper.appendChild(iframe);
        return wrapper;
    }
}
