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

import { ForecastPeriod, WeatherReport, Units } from "@adonix.org/nws-report";
import { BaseRender, IconRender, TextRender } from "./base";
import { Template } from "../../template";

const TEXT_SELECTORS = {
    name: ".period-name",
    temp: ".period-temp",
    desc: ".period-desc",
} as const;
type TextSelector = typeof TEXT_SELECTORS;

const ICON_SELECTORS = {
    icon: ".period-icon",
} as const;
type IconSelector = typeof ICON_SELECTORS;

interface PeriodRenderClass {
    new (
        parent: Element,
        report: WeatherReport,
        period: ForecastPeriod
    ): BaseRender;
}

export class ForecastRender extends BaseRender {
    private static readonly TEMPLATE_ID = "forecast-period-template";
    private static readonly SELECTOR = ".forecast";

    public override render(): void {
        const forecast = this.getElement(ForecastRender.SELECTOR);

        // Remove existing forecast on report refresh.
        forecast.replaceChildren();

        const periods = this.report.forecast?.properties.periods || [];
        for (let i = 0; i < Math.min(9, periods.length); i++) {
            const period = periods[i];
            if (!period) continue;

            const element = Template.createElement(ForecastRender.TEMPLATE_ID);
            forecast.appendChild(element);

            const renderers: PeriodRenderClass[] = [
                PeriodIcon,
                PeriodName,
                PeriodTemp,
                PeriodDesc,
            ];
            for (const RenderClass of renderers) {
                new RenderClass(element, this.report, period).render();
            }
        }
    }
}

abstract class Text extends TextRender<TextSelector> {
    public constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport,
        protected readonly period: ForecastPeriod
    ) {
        super(parent, report);
    }
}

abstract class Icon extends IconRender<IconSelector> {
    public constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport,
        protected readonly period: ForecastPeriod
    ) {
        super(parent, report);
    }
}

class PeriodIcon extends Icon {
    public override render(): void {
        this.set(
            ICON_SELECTORS.icon,
            this.period.icon,
            this.period.shortForecast,
            "medium"
        );
    }
}

class PeriodName extends Text {
    public override render(): void {
        this.set(TEXT_SELECTORS.name, this.period.name, "Missing");
    }
}

class PeriodTemp extends Text {
    protected override format(temperature: number): string {
        return `${Math.round(Units.c_to_f(temperature))}°F`;
    }

    public override render(): void {
        this.set(
            TEXT_SELECTORS.temp,
            Units.to_number(this.period.temperature),
            "--°F"
        );
    }
}

class PeriodDesc extends Text {
    protected override format(forecast: string): string {
        // Unbreakable hyphen on words like T-Storm.
        return this.abbreviate(forecast).replace(/-/g, "\u2011");
    }

    protected abbreviate(forecast: string): string {
        return forecast
            .replace(/\bThunderstorms\b/gi, "T-Storms")
            .replace(/\bThunderstorm\b/gi, "T-Storm");
    }

    public override render(): void {
        this.set(TEXT_SELECTORS.desc, this.period.shortForecast, "Missing");
    }
}
