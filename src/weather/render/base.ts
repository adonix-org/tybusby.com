import { WeatherReport } from "../report.js";

export type RenderClass = new (e: Element, r: WeatherReport) => BaseRender;

export abstract class BaseRender {
    constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport
    ) {
        this.render();
    }

    protected abstract render(): void;
}

export abstract class TextRender extends BaseRender {
    protected format(value: string | number): string {
        return String(value);
    }

    protected set(
        selector: string,
        value: string | number | undefined,
        fallback: string = "?"
    ): void {
        const element = this.parent.querySelector(selector);
        if (!element) {
            throw new Error(
                `Element with query selector ${selector} not found.`
            );
        }
        element.textContent =
            value === undefined ? fallback : this.format(value);
    }
}

export abstract class IconRender extends BaseRender {
    protected set(
        selector: string,
        icon: string | undefined,
        alt: string,
        size: "small" | "medium" | "large" = "medium"
    ): void {
        const image = this.parent.querySelector(selector);
        if (!image || !(image instanceof HTMLImageElement)) {
            throw new Error(
                `Image element with query selector "${selector}" not found.`
            );
        }

        image.alt = alt;
        if (!icon || icon.trim() === "") {
            image.src = "img/missing.png";
            return;
        }

        const url = new URL(icon);
        url.searchParams.set("size", size);
        image.src = url.toString();
    }
}
