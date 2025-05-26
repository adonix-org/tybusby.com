export class Videos {
    constructor(
        private readonly grid: string,
        private readonly urls: string[]
    ) {
        const _grid = document.getElementById(grid) as HTMLDivElement;
        urls.forEach((url) => {
            const iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.title = "YouTube video player";
            _grid.appendChild(iframe);
        });
    }
}
