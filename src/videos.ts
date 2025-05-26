export class Videos {
    constructor(
        private readonly grid: string,
        private readonly urls: string[]
    ) {
        const _grid = document.getElementById(grid) as HTMLDivElement;
        urls.forEach((url) => {
            const gridCell = document.createElement("div");
            gridCell.classList.add("grid-cell", "loading");
            _grid.appendChild(gridCell);

            requestAnimationFrame(() => {
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
                    },
                    true
                );
            });
        });
    }
}
