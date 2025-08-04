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
import { BaseRender, RenderClass } from "./base";
import { ForecastRender } from "./forecast";
import { ObservationRender } from "./observation";
import { getTemplate } from "../../elements";
import { AlertsRender } from "./alerts";
import { ProductsRender } from "./products";

export class ReportRender extends BaseRender {
    private static readonly TEMPLATE_ID = "weather-template";
    private readonly child: Element;

    constructor(
        protected readonly parent: Element,
        protected readonly report: WeatherReport
    ) {
        super(parent, report);

        this.child = getTemplate(ReportRender.TEMPLATE_ID);
        parent.appendChild(this.child);
    }

    public override render(): void {
        const renderers: RenderClass[] = [
            ProductsRender,
            AlertsRender,
            ObservationRender,
            ForecastRender,
        ];
        for (const RenderClass of renderers) {
            new RenderClass(this.child, this.report).render();
        }
    }

    public async refresh(): Promise<void> {
        await this.report.refresh();
        this.render();
    }
}
