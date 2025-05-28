export class Videos {
    constructor(
        parentId: string,
        private readonly urls: string[]
    ) {
        const container = document.getElementById(parentId);
        if (!container) {
            throw new Error(`Element with ID "${parentId}" not found.`);
        }

        this.urls.forEach((url) => {
            container.appendChild(new Video(url).element);
        });
    }
}

class Video {
    public readonly element: HTMLDivElement;

    constructor(private readonly url: string) {
        this.element = this.createElement();
    }

    private createElement(): HTMLDivElement {
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
            },
            true
        );

        wrapper.appendChild(iframe);
        return wrapper;
    }
}
