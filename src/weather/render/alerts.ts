import { BaseRender } from "./base";

export class AlertsRender extends BaseRender {
    private static readonly ALERTS_CLASS = ".alerts";
    public render(): void {
        const alerts = this.parent.querySelector(AlertsRender.ALERTS_CLASS);
        if (!alerts) {
            throw new Error(
                `Element with query selector ${AlertsRender.ALERTS_CLASS} not found.`
            );
        }
        this.report.alerts?.features.forEach((alert) => {
            const div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add(alert.properties.severity.toLowerCase());
            div.innerText = alert.properties.headline;

            const link = document.createElement("a");
            link.onclick = () => console.log(alert);
            link.appendChild(div);
            alerts.appendChild(link);
        });
    }
}
