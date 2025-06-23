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
import { RenderClass } from "./base.js";
import { ObservationRender } from "./observation.js";

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
        const renderers: RenderClass[] = [ObservationRender];
        for (const RenderClass of renderers) {
            new RenderClass(this.element, this.report);
        }
    }
}
