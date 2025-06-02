export interface ProgressData {
    count: number;
    total: number;
    percent: number;
}

export class Progress {
    private progress: HTMLElement;

    constructor(id: string = "progress") {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with ID "${id}" not found.`);
        }
        this.progress = element;
    }

    public complete(): void {
        this.progress.style.width = `100%`;
        setTimeout(() => {
            this.progress.style.width = `0%`;
        }, 500);
    }

    public setProgress(data: ProgressData): void {
        this.progress.style.width = `${data.percent}%`;
    }

    public static getProgress(current: number, total: number): ProgressData {
        return total === 0
            ? { count: 0, total: 0, percent: 0 }
            : {
                  count: current,
                  total: total,
                  percent: Math.round((current / total) * 100),
              };
    }
}
