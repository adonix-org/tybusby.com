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

import { WeatherLocation } from "./location.js";
import { Units } from "./units.js";

export class WeatherRenderer {
    private static readonly TEMPLATE_ID = "weather-template";
    private readonly clone: DocumentFragment;

    constructor(parentId: string, private readonly weather: WeatherLocation) {
        const parent = document.getElementById(parentId);
        if (!parent) {
            throw new Error(`Element with ID "${parentId}" not found.`);
        }
        const template = document.getElementById(
            WeatherRenderer.TEMPLATE_ID
        ) as HTMLTemplateElement;
        if (!template) {
            throw new Error(
                `Template with ID "${WeatherRenderer.TEMPLATE_ID}" not found.`
            );
        }
        this.clone = template.content.cloneNode(true) as DocumentFragment;
        this.render();
        parent.appendChild(this.clone);
    }

    private render(): void {
        const station = this.weather.station?.properties;
        this.setValue(
            ".station-name",
            `${station?.name} (${station?.stationIdentifier})`
        );

        const current = this.weather.current?.properties;
        this.setValue(".text-description", current?.textDescription);

        const temp = Units.getValue(current?.temperature);
        if (temp) {
            this.setValue(".current-temp-f", `${Units.to_f(temp)}°F`);
            this.setValue(".current-temp-c", `${Math.round(temp)}°C`);
        }
        this.setImage(".current-icon", "large", current?.icon);
    }

    private setValue(
        selector: string,
        value: number | string | undefined | null,
        fallback: string = "?"
    ): string {
        const element = this.clone.querySelector(selector);
        if (!element) {
            throw new Error(
                `Element with query selector ${selector} not found`
            );
        }
        element.textContent = value != null ? String(value) : fallback;
        return element.textContent;
    }

    private setImage(
        selector: string,
        size: "small" | "medium" | "large",
        url: string | undefined
    ): void {
        const image = this.clone.querySelector(selector) as HTMLImageElement;
        if (!image) {
            throw new Error(
                `Image element with query selector ${selector} not found`
            );
        }
        if (url) {
            image.src = url.replace(/\?size=medium$/, `?size=${size}`);
        }
    }
}
