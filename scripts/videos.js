export class Videos {
    constructor(grid, urls) {
        this.grid = grid;
        this.urls = urls;
        const _grid = document.getElementById(grid);
        urls.forEach((url) => {
            const iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.allowFullscreen = true;
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.title = "YouTube video player";
            _grid.appendChild(iframe);
        });
    }
}
