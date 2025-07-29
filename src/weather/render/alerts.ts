import { AlertFeature } from "@adonix.org/nws-report";
import { BaseRender } from "./base";
import { formatIsoDate, isIsoDatePast } from "./datetime";

export class AlertsRender extends BaseRender {
    private static readonly DATE_TIME_FORMAT = "LLLL d, hh:mm a ZZZZ";
    private static readonly SELECTOR = ".alerts";

    public render(): void {
        const alerts = this.parent.querySelector(AlertsRender.SELECTOR);
        if (!alerts) {
            throw new Error(
                `Element with query selector ${AlertsRender.SELECTOR} not found.`
            );
        }

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
                product?.segments.forEach((segment) => {
                    console.log([product?.headline, segment.body].join("\n\n"));
                });
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
        if (isIsoDatePast(feature.properties.onset)) {
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
