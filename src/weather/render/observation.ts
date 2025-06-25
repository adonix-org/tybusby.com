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

import { Units } from "../units.js";
import { BaseRender, IconRender, RenderClass, TextRender } from "./base.js";

abstract class Text extends TextRender<TextSelector> {}
type TextSelector =
    | ".current-temp-c"
    | ".current-temp-f"
    | ".dewpoint"
    | ".description-text"
    | ".humidity"
    | ".wind-speed"
    | ".pressure"
    | ".visibility"
    | ".station-name"
    | ".last-update";

abstract class Icon extends IconRender<IconSelector> {}
type IconSelector = ".current-icon";

export class ObservationRender extends BaseRender {
    public override render(): void {
        const renderers: RenderClass[] = [
            Station,
            CurrentWeatherIcon,
            DescriptionText,
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
            new RenderClass(this.parent, this.report).render();
        }
    }
}

class CurrentWeatherIcon extends Icon {
    public override render(): void {
        const alt =
            this.report.current?.properties.textDescription?.trim() ||
            "No Data";
        const icon = this.report.current?.properties.icon;
        this.set(".current-icon", icon, alt, "large");
    }
}

class CurrentTemperatureC extends Text {
    protected override format(temperature: number): string {
        return `${Math.round(temperature)}°C`;
    }

    public override render(): void {
        const temp = Units.to_number(
            this.report.current?.properties.temperature
        );
        this.set(".current-temp-c", temp, "--°C");
    }
}

class CurrentTemperatureF extends Text {
    protected override format(temperature: number): string {
        return `${Math.round(Units.c_to_f(temperature))}°F`;
    }

    public override render(): void {
        const temp = Units.to_number(
            this.report.current?.properties.temperature
        );
        this.set(".current-temp-f", temp, "--°F");
    }
}

class Dewpoint extends Text {
    protected override format(dewpoint: number): string {
        const f = Math.round(Units.c_to_f(dewpoint));
        const c = Math.round(dewpoint);
        return `${f}°F (${c}°C)`;
    }

    public override render(): void {
        const dewpoint = Units.to_number(
            this.report.current?.properties.dewpoint
        );
        this.set(".dewpoint", dewpoint, "--°F (--°C)");
    }
}

class DescriptionText extends Text {
    public override render(): void {
        this.set(
            ".description-text",
            this.report.current?.properties.textDescription
        );
    }
}

class Humidity extends Text {
    protected override format(humidity: number): string {
        return `${Math.round(humidity)}%`;
    }

    public override render(): void {
        const humidity = Units.to_number(
            this.report.current?.properties.relativeHumidity
        );
        this.set(".humidity", humidity, "--%");
    }
}

class Wind extends Text {
    public override render(): void {
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

class Pressure extends Text {
    protected override format(pressure: number): string {
        const inches = Units.pascals_to_inches(pressure).toFixed(2);
        const mb = Units.pascals_to_mb(pressure).toFixed(1);
        return `${inches} in (${mb} mb)`;
    }

    public override render(): void {
        const pressure = Units.to_number(
            this.report.current?.properties.barometricPressure
        );
        this.set(".pressure", pressure, "--.-- in (----.- mb)");
    }
}

class Visibility extends Text {
    protected override format(visibility: number): string {
        return `${Units.meters_to_miles(visibility).toFixed(2)} miles`;
    }

    public override render(): void {
        const visibility = Units.to_number(
            this.report.current?.properties?.visibility
        );
        this.set(".visibility", visibility, "--.-- mi");
    }
}

class Station extends Text {
    public override render(): void {
        const station = this.report.station?.properties;
        this.set(
            ".station-name",
            `${station?.name} (${station?.stationIdentifier})`
        );
    }
}

class LastUpdate extends Text {
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

    public override render(): void {
        const timestamp = this.report.current?.properties.timestamp;
        this.set(".last-update", timestamp);
    }
}
