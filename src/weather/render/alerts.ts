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

import { AlertFeature } from "@adonix.org/nws-report";
import { BaseRender } from "./base";
import { formatIsoDate, isIsoDatePast } from "./datetime";
import { productDialog } from "./dialog";

export class AlertsRender extends BaseRender {
    private static readonly DATE_TIME_FORMAT = "LLLL d, hh:mm a ZZZZ";
    private static readonly SELECTOR = ".alerts";

    public render(): void {
        const alerts = this.getElement(AlertsRender.SELECTOR);

        // Remove existing alerts on report refresh.
        alerts.replaceChildren();

        this.report.alerts?.features.forEach((feature) => {
            const div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add(feature.properties.severity.toLowerCase());
            div.innerText = this.getHeadline(feature);

            const link = document.createElement("a");

            const product = feature.product;
            link.onclick = () => {
                let text = "";
                product?.segments.forEach((segment) => {
                    text += [product?.headline, segment.body].join("\n\n");
                });
                console.log(text);
                productDialog.show(feature.properties.event, text);
            };
            link.appendChild(div);
            alerts.appendChild(link);
        });
    }

    private getHeadline(feature: AlertFeature): string {
        const event = feature.properties.event;
        const timeZone = this.report.point?.properties.timeZone;

        if (!feature.properties.ends) {
            return event;
        }

        const end = formatIsoDate(
            feature.properties.ends,
            AlertsRender.DATE_TIME_FORMAT,
            timeZone
        );
        if (
            !feature.properties.onset ||
            isIsoDatePast(feature.properties.onset)
        ) {
            return `${event} until ${end}`;
        }

        const start = formatIsoDate(
            feature.properties.onset,
            AlertsRender.DATE_TIME_FORMAT,
            timeZone
        );
        return `${event} in effect from ${start} until ${end}`;
    }
}
