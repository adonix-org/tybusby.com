export class Videos {
    constructor(
        private readonly parentId: string,
        private readonly urls: string[]
    ) {
        const parent = document.getElementById(parentId) as HTMLElement;
        urls.forEach((url) => {
            const videoFrame = document.createElement("div");
            videoFrame.classList.add("video-frame", "loading");
            parent.appendChild(videoFrame);

            const video = document.createElement("iframe");
            video.src = url;
            video.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            video.allowFullscreen = true;
            video.referrerPolicy = "strict-origin-when-cross-origin";

            videoFrame.appendChild(video);

            video.addEventListener(
                "load",
                () => {
                    videoFrame.classList.remove("loading");
                    video.classList.add("loaded");
                },
                true
            );
        });
    }
}
