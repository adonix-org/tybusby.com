/*
 * Copyright (C) 2025 Ty Busby
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { WeatherReport } from "../report.js";

export type RenderClass = new (
    parent: Element,
    report: WeatherReport
) => BaseRender;

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
