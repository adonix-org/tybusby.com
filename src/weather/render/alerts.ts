import { BaseRender } from "./base";

export class AlertsRender extends BaseRender {
    private static readonly ALERTS_CLASS = ".alerts";

    protected readonly timestampFormat = new Intl.DateTimeFormat(undefined, {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
        timeZone: this.report.point?.properties.timeZone,
    });

    public render(): void {
        const alerts = this.parent.querySelector(AlertsRender.ALERTS_CLASS);
        if (!alerts) {
            throw new Error(
                `Element with query selector ${AlertsRender.ALERTS_CLASS} not found.`
            );
        }
        alerts.replaceChildren();
        this.report.alerts?.features.forEach((alert) => {
            const div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add(alert.properties.severity.toLowerCase());
            div.innerText = `${
                alert.properties.event
            } in effect from ${this.timestampFormat
                .format(new Date(alert.properties.onset))
                .replace(" at ", ", ")} until ${this.timestampFormat
                .format(new Date(alert.properties.ends))
                .replace(" at ", ", ")}`;

            const link = document.createElement("a");
            link.onclick = () => console.log(alert);
            link.appendChild(div);
            alerts.appendChild(link);
        });
    }
}
