import { EventEmitter } from "./event.js";

interface VideoEvents {
    load: void;
}

interface VideoGroupEvents {
    loading: void;
    progress: { count: number; total: number; percent: number };
    error: Error;
    loaded: void;
}

export class VideoGroup extends EventEmitter<VideoGroupEvents> {
    private readonly _parent: HTMLElement | null;
    constructor(parentId: string, private readonly _urls: string[]) {
        super();
        this._parent = document.getElementById(parentId);
        if (!this._parent) {
            this.emit(
                "error",
                new Error(`Element with ID "${parentId}" not found.`)
            );
            return;
        }
    }

    public load(): void {
        this.emit("loading");
        this.emit("progress", {
            count: 0,
            total: this._urls.length,
            percent: 100.0,
        });
        this._urls.forEach((url) => {
            const video = new Video(url);
            this._parent!.appendChild(video.element);
            video.on("load", () => {
                console.log(`${url} loaded.`);
            });
        });
        this.emit("loaded");
    }
}

class Video extends EventEmitter<VideoEvents> {
    private readonly _element: HTMLElement;

    constructor(private readonly url: string) {
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
                this.emit("load");
            },
            true
        );

        wrapper.appendChild(iframe);
        return wrapper;
    }
}
