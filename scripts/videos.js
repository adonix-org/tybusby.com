var Videos = /** @class */ (function () {
    function Videos(grid, urls) {
        this.grid = grid;
        this.urls = urls;
        var _grid = document.getElementById(grid);
        urls.forEach(function (url) {
            var iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.allowFullscreen = true;
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.title = "YouTube video player";
            _grid.appendChild(iframe);
        });
    }
    return Videos;
}());
export { Videos };
