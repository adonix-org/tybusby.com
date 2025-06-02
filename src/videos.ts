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
