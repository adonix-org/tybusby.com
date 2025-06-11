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
    private readonly element: DocumentFragment;

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
        this.element = template.content.cloneNode(true) as DocumentFragment;
        this.render();
        parent.appendChild(this.element);
    }

    private render(): void {
        const station = this.weather.station?.properties;
        this.setValue(
            ".station-name",
            `${station?.name} (${station?.stationIdentifier})`
        );

        const current = this.weather.current?.properties;
        this.setValue(".text-description", current?.textDescription);

        const temp = Units.to_number(current?.temperature);
        if (temp) {
            this.setValue(".current-temp-f", `${Units.c_to_f(temp)}°F`, "--°F");
            this.setValue(".current-temp-c", `${Math.round(temp)}°C`, "--°C");
        }

        this.setIcon(".current-icon", "large", current?.icon);

        const humidity = Units.to_number(current?.relativeHumidity);
        if (humidity) {
            this.setValue(".humidity", `${Math.round(humidity)}%`, "--%");
        }

        const windSpeed = Units.to_number(current?.windSpeed);
        const windDirection = Units.to_number(current?.windDirection);
        if (windSpeed) {
            this.setValue(
                ".wind-speed",
                `${
                    windDirection
                        ? `${Units.degrees_to_cardinal(windDirection)} `
                        : ""
                }${Math.round(Units.kmh_to_mph(windSpeed))} mph`,
                "-- mph"
            );
        } else {
            this.setValue(".wind-speed", "Calm");
        }

        const pressure = Units.to_number(current?.barometricPressure);
        if (pressure) {
            this.setValue(
                ".pressure",
                `${Units.pascals_to_inches(pressure).toFixed(
                    2
                )} in (${Units.pascals_to_mb(pressure).toFixed(1)} mb)`,
                "--.-- in (----.- mb)"
            );
        }

        const dewpoint = Units.to_number(current?.dewpoint);
        if (dewpoint) {
            this.setValue(
                ".dewpoint",
                `${Math.round(Units.c_to_f(dewpoint))}°F (${Math.round(
                    dewpoint
                )}°C)`,
                "--°F (--°C)"
            );
        }

        const visibility = Units.to_number(current?.visibility);
        if (visibility) {
            this.setValue(
                ".visibility",
                `${Units.meters_to_miles(visibility).toFixed(2)} miles`,
                "--.-- mi"
            );
        }

        if (current?.timestamp) {
            this.setValue(
                ".last-update",
                new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZoneName: "short",
                }).format(new Date(current?.timestamp))
            );
        }
    }

    private setValue(
        selector: string,
        value: string | undefined,
        fallback: string = "?"
    ): string {
        const element = this.element.querySelector(selector);
        if (!element) {
            throw new Error(
                `Element with query selector ${selector} not found.`
            );
        }
        element.textContent = value ? String(value) : fallback;
        return element.textContent;
    }

    private setIcon(
        selector: string,
        size: "small" | "medium" | "large",
        icon: string | undefined
    ): string {
        const image = this.element.querySelector(selector) as HTMLImageElement;
        if (!image) {
            throw new Error(
                `Image element with query selector ${selector} not found.`
            );
        }
        if (icon) {
            const url = new URL(icon);
            url.searchParams.set("size", size);
            image.src = url.toString();
        } else {
            image.src = "img/missing.png";
        }
        return image.src;
    }
}
