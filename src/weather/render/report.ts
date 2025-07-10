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

import { WeatherReport } from "@adonix.org/nws-report";
import { BaseRender, RenderClass } from "./base.js";
import { ForecastRender } from "./forecast.js";
import { ObservationRender } from "./observation.js";
import { Template } from "./template.js";

export class ReportRender extends BaseRender {
    private static readonly TEMPLATE_ID = "weather-template";
    private readonly child: Element;

    constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport
    ) {
        super(parent, report);

        this.child = Template.createElement(ReportRender.TEMPLATE_ID);
        parent.appendChild(this.child);
    }

    public override render(): void {
        const renderers: RenderClass[] = [ObservationRender, ForecastRender];
        for (const RenderClass of renderers) {
            new RenderClass(this.child, this.report).render();
        }
    }
}
