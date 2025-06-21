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

import { WeatherReport } from "./report.js";
import { Units } from "./units.js";

type RenderClass = new (e: Element, r: WeatherReport) => BaseRender;

export class WeatherRenderer {
    private static readonly TEMPLATE_ID = "weather-template";
    private readonly element: Element;

    constructor(
        private readonly report: WeatherReport,
        parentId: string = "weather-grid"
    ) {
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

        const fragment = template.content.cloneNode(true) as DocumentFragment;
        if (!fragment.firstElementChild) {
            throw new Error(
                `Template with ID "${WeatherRenderer.TEMPLATE_ID}" missing root child.`
            );
        }

        this.element = fragment.firstElementChild;
        parent.appendChild(this.element);
    }

    public render(): void {
        const renderers: RenderClass[] = [
            CurrentWeatherIcon,
            Station,
            ObservationText,
            CurrentTemperatureF,
            CurrentTemperatureC,
            Humidity,
            Wind,
            Pressure,
            Dewpoint,
            Visibility,
            LastUpdate,
        ];
        for (const RenderClass of renderers) {
            new RenderClass(this.element, this.report);
        }
    }
}

abstract class BaseRender {
    constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport
    ) {
        this.render();
    }

    protected abstract render(): void;
}

abstract class IconRender extends BaseRender {
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

abstract class TextRender extends BaseRender {
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

class CurrentWeatherIcon extends IconRender {
    protected override render(): void {
        const alt =
            this.report.current?.properties.textDescription?.trim() ||
            "No Data";
        const icon = this.report.current?.properties.icon;
        this.set(".current-icon", icon, alt, "large");
    }
}

class CurrentTemperatureC extends TextRender {
    protected override format(temperature: number): string {
        return `${Math.round(temperature)}°C`;
    }

    protected override render(): void {
        const temp = Units.to_number(
            this.report.current?.properties.temperature
        );
        this.set(".current-temp-c", temp, "--°C");
    }
}

class CurrentTemperatureF extends TextRender {
    protected override format(temperature: number): string {
        return `${Math.round(Units.c_to_f(temperature))}°F`;
    }

    protected override render(): void {
        const temp = Units.to_number(
            this.report.current?.properties.temperature
        );
        this.set(".current-temp-f", temp, "--°F");
    }
}

class Dewpoint extends TextRender {
    protected override format(dewpoint: number): string {
        const f = Math.round(Units.c_to_f(dewpoint));
        const c = Math.round(dewpoint);
        return `${f}°F (${c}°C)`;
    }

    protected override render(): void {
        const dewpoint = Units.to_number(
            this.report.current?.properties.dewpoint
        );
        this.set(".dewpoint", dewpoint, "--°F (--°C)");
    }
}

class ObservationText extends TextRender {
    protected override render(): void {
        this.set(
            ".observation-text",
            this.report.current?.properties.textDescription
        );
    }
}

class Humidity extends TextRender {
    protected override format(humidity: number): string {
        return `${Math.round(humidity)}%`;
    }

    protected override render(): void {
        const humidity = Units.to_number(
            this.report.current?.properties.relativeHumidity
        );
        this.set(".humidity", humidity, "--%");
    }
}

class Wind extends TextRender {
    protected override render(): void {
        const windSpeed = Units.to_number(
            this.report.current?.properties?.windSpeed
        );
        const windDirection = Units.to_number(
            this.report.current?.properties.windDirection
        );
        if (windSpeed) {
            this.set(
                ".wind-speed",
                `${
                    windDirection
                        ? `${Units.degrees_to_cardinal(windDirection)} `
                        : ""
                }${Math.round(Units.kmh_to_mph(windSpeed))} mph`
            );
        } else {
            this.set(".wind-speed", "Calm");
        }
    }
}

class Pressure extends TextRender {
    protected override format(pressure: number): string {
        const inches = Units.pascals_to_inches(pressure).toFixed(2);
        const mb = Units.pascals_to_mb(pressure).toFixed(1);
        return `${inches} in (${mb} mb)`;
    }

    protected override render(): void {
        const pressure = Units.to_number(
            this.report.current?.properties.barometricPressure
        );
        this.set(".pressure", pressure, "--.-- in (----.- mb)");
    }
}

class Visibility extends TextRender {
    protected override format(visibility: number): string {
        return `${Units.meters_to_miles(visibility).toFixed(2)} miles`;
    }

    protected override render(): void {
        const visibility = Units.to_number(
            this.report.current?.properties?.visibility
        );
        this.set(".visibility", visibility, "--.-- mi");
    }
}

class Station extends TextRender {
    protected override render(): void {
        const station = this.report.station?.properties;
        this.set(
            ".station-name",
            `${station?.name} (${station?.stationIdentifier})`
        );
    }
}

class LastUpdate extends TextRender {
    protected static readonly TIMESTAMP_FORMAT = new Intl.DateTimeFormat(
        undefined,
        {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short",
        }
    );

    protected override format(timestamp: string): string {
        return LastUpdate.TIMESTAMP_FORMAT.format(new Date(timestamp));
    }

    protected override render(): void {
        const timestamp = this.report.current?.properties.timestamp;
        this.set(".last-update", timestamp);
    }
}
