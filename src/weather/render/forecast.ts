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

import { ForecastPeriod } from "../forecast";
import { WeatherReport } from "../report.js";
import { Units } from "../units.js";
import { BaseRender, IconRender, TextRender } from "./base.js";
import { Template } from "./template.js";

abstract class Text extends TextRender<TextSelector> {}
type TextSelector = ".period-name" | ".period-temp" | ".period-short";

type IconSelector = ".period-icon";

interface PeriodRenderClass {
    new (
        parent: Element,
        report: WeatherReport,
        period: ForecastPeriod
    ): BaseRender;
}

export class ForecastRender extends BaseRender {
    private static readonly TEMPLATE_ID = "forecast-period-template";
    private static readonly FORECAST_CLASS = ".forecast";

    public override render(): void {
        const forecast = this.parent.querySelector(
            ForecastRender.FORECAST_CLASS
        );
        if (!forecast) {
            throw new Error(
                `Element with query selector ${ForecastRender.FORECAST_CLASS} not found.`
            );
        }
        const periods = this.report.forecast?.properties.periods || [];
        for (let i = 0; i < Math.min(9, periods.length); i++) {
            const period = periods[i];
            if (!period) continue;

            const element = Template.createElement(ForecastRender.TEMPLATE_ID);
            forecast.appendChild(element);

            const renderers: PeriodRenderClass[] = [
                PeriodIconRender,
                PeriodName,
                PeriodTemp,
                PeriodShortForecast,
            ];
            for (const RenderClass of renderers) {
                new RenderClass(element, this.report, period).render();
            }
        }
    }
}

abstract class PeriodTextRender extends Text {
    public constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport,
        protected readonly period: ForecastPeriod
    ) {
        super(parent, report);
    }
}

class PeriodIconRender extends IconRender<IconSelector> {
    public constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport,
        protected readonly period: ForecastPeriod
    ) {
        super(parent, report);
    }

    public override render(): void {
        this.set(
            ".period-icon",
            this.period.icon,
            this.period.shortForecast,
            "medium"
        );
    }
}

class PeriodName extends PeriodTextRender {
    public override render(): void {
        this.set(".period-name", this.period.name, "Missing");
    }
}

class PeriodTemp extends PeriodTextRender {
    protected override format(temperature: number): string {
        return `${Math.round(Units.c_to_f(temperature))}°F`;
    }

    public override render(): void {
        this.set(
            ".period-temp",
            Units.to_number(this.period.temperature),
            "--°F"
        );
    }
}

class PeriodShortForecast extends PeriodTextRender {
    protected override format(forecast: string): string {
        // Unbreakable hyphen on words like T-Storm.
        return forecast.replace("-", "\u2011");
    }

    public override render(): void {
        this.set(".period-short", this.period.shortForecast, "Missing");
    }
}
