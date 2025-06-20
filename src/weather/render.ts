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

type ValueRenderConstructor = new (e: Element, r: WeatherReport) => ValueRender;

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
        const stationId = this.report.station?.properties?.stationIdentifier;
        const location = this.element.querySelector(".location");
        if (stationId && location) {
            location.id = stationId;
        }

        const icon = this.report.current?.properties.icon;
        IconRender.render(this.element, ".current-icon", icon, "large");

        const renderers: ValueRenderConstructor[] = [
            Station,
            ObservationText,
            CurrentTemperatureF,
            CurrentTemperatureC,
            Humidity,
            Wind,
            Pressure,
            Dewpoint,
            Visibility,
            LatestTimestamp,
        ];
        for (const RenderClass of renderers) {
            new RenderClass(this.element, this.report);
        }
    }
}

class IconRender {
    public static render(
        parent: Element,
        selector: string,
        icon: string | undefined,
        size: "small" | "medium" | "large" = "medium"
    ): string {
        const image = parent.querySelector(selector) as HTMLImageElement;
        if (!image) {
            throw new Error(
                `Image element with query selector "${selector}" not found.`
            );
        }

        image.src = icon
            ? (() => {
                  const url = new URL(icon);
                  url.searchParams.set("size", size);
                  return url.toString();
              })()
            : "img/missing.png";

        return image.src;
    }
}

abstract class ValueRender {
    constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport
    ) {
        this.render();
    }

    protected abstract render(): void;

    protected format(value: string | number): string {
        return String(value);
    }

    protected setValue(
        selector: string,
        value: string | number | undefined,
        fallback: string = "?"
    ) {
        const element = this.parent.querySelector(selector);
        if (!element) {
            throw new Error(
                `Element with query selector ${selector} not found.`
            );
        }
        element.textContent =
            value === undefined ? fallback : this.format(value);
        return value;
    }
}

class CurrentTemperatureC extends ValueRender {
    protected override format(temperature: number): string {
        return `${Math.round(temperature)}°C`;
    }

    protected render(): void {
        const temp = Units.to_number(
            this.report.current?.properties.temperature
        );
        this.setValue(".current-temp-c", temp, "--°C");
    }
}

class CurrentTemperatureF extends ValueRender {
    protected override format(temperature: number): string {
        return `${Units.c_to_f(temperature)}°F`;
    }

    protected render(): void {
        const temp = Units.to_number(
            this.report.current?.properties.temperature
        );
        this.setValue(".current-temp-f", temp, "--°F");
    }
}

class Dewpoint extends ValueRender {
    protected override format(dewpoint: number): string {
        return `${Units.c_to_f(dewpoint)}°F (${Math.round(dewpoint)}°C)`;
    }

    protected render(): void {
        const dewpoint = Units.to_number(
            this.report.current?.properties.dewpoint
        );
        this.setValue(".dewpoint", dewpoint, "--°F (--°C)");
    }
}

class ObservationText extends ValueRender {
    protected render(): void {
        this.setValue(
            ".observation-text",
            this.report.current?.properties.textDescription
        );
    }
}

class Humidity extends ValueRender {
    protected override format(humidity: number): string {
        return `${Math.round(humidity)}%`;
    }

    protected render(): void {
        const humidity = Units.to_number(
            this.report.current?.properties.relativeHumidity
        );
        this.setValue(".humidity", humidity, "--%");
    }
}

class Wind extends ValueRender {
    protected render(): void {
        const windSpeed = Units.to_number(
            this.report.current?.properties?.windSpeed
        );
        const windDirection = Units.to_number(
            this.report.current?.properties?.windDirection
        );
        if (windSpeed) {
            this.setValue(
                ".wind-speed",
                `${
                    windDirection
                        ? `${Units.degrees_to_cardinal(windDirection)} `
                        : ""
                }${Math.round(Units.kmh_to_mph(windSpeed))} mph`
            );
        } else {
            this.setValue(".wind-speed", "Calm");
        }
    }
}

class Pressure extends ValueRender {
    protected override format(pressure: number): string {
        return `${Units.pascals_to_inches(pressure).toFixed(
            2
        )} in (${Units.pascals_to_mb(pressure).toFixed(1)} mb)`;
    }

    protected render(): void {
        const pressure = Units.to_number(
            this.report.current?.properties?.barometricPressure
        );
        this.setValue(".pressure", pressure, "--.-- in (----.- mb)");
    }
}

class Visibility extends ValueRender {
    protected override format(visibility: number): string {
        return `${Units.meters_to_miles(visibility).toFixed(2)} miles`;
    }

    protected render(): void {
        const visibility = Units.to_number(
            this.report.current?.properties?.visibility
        );
        this.setValue(".visibility", visibility, "--.-- mi");
    }
}

class Station extends ValueRender {
    protected render(): void {
        const station = this.report.station?.properties;
        this.setValue(
            ".station-name",
            `${station?.name} (${station?.stationIdentifier})`
        );
    }
}

class LatestTimestamp extends ValueRender {
    protected override format(timestamp: string): string {
        return new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short",
        }).format(new Date(timestamp));
    }

    protected render(): void {
        const timestamp = this.report.current?.properties?.timestamp;
        this.setValue(".last-update", timestamp);
    }
}
