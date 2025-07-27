import { BaseRender } from "./base";

export class AlertsRender extends BaseRender {
    private static readonly SELECTOR = ".alerts";

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
        const alerts = this.parent.querySelector(AlertsRender.SELECTOR);
        if (!alerts) {
            throw new Error(
                `Element with query selector ${AlertsRender.SELECTOR} not found.`
            );
        }

        // Remove exisitng alerts on report refresh.
        alerts.replaceChildren();

        this.report.alerts?.features.forEach((alert) => {
            console.log(alert.properties.parameters.AWIPSidentifier);
            const div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add(alert.properties.severity.toLowerCase());
            div.innerText = `${
                alert.properties.event
            } in effect from ${this.format(
                alert.properties.onset
            )} until ${this.format(alert.properties.ends)}`;

            const link = document.createElement("a");
            link.onclick = () => console.log(alert);
            link.appendChild(div);
            alerts.appendChild(link);
        });
    }

    private format(timestamp: string): string {
        return this.timestampFormat
            .format(new Date(timestamp))
            .replace(" at ", ", ");
    }
}
