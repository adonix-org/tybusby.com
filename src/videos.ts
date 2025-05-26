export class Videos {
    constructor(
        private readonly grid: string,
        private readonly urls: string[]
    ) {
        const _grid = document.getElementById(grid) as HTMLElement;
        urls.forEach((url) => {
            const gridCell = document.createElement("div");
            gridCell.classList.add("grid-cell", "loading");
            _grid.appendChild(gridCell);

            const video = document.createElement("iframe");
            video.src = url;
            video.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            video.allowFullscreen = true;
            video.referrerPolicy = "strict-origin-when-cross-origin";

            gridCell.appendChild(video);

            video.addEventListener(
                "load",
                () => {
                    gridCell.classList.remove("loading");
                    video.classList.add("loaded");
                },
                true
            );
        });
    }
}
