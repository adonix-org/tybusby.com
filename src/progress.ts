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

    /**
     * The activity for this progress bar has finished.
     * @param holdMs - The number of milliseconds the progress
     * will be shown as full before resetting to zero.
     */
    public complete(holdMs: number = 500): void {
        const delay = Math.max(0, holdMs);
        this.percent = 100;
        setTimeout(() => (this.percent = 0), delay);
    }

    public set data(data: ProgressData) {
        this.percent = data.percent;
    }

    public set percent(percent: number) {
        percent = Math.max(0, Math.min(100, percent));
        this.progress.style.width = `${percent}%`;
    }

    public static calculate(current: number, total: number): ProgressData {
        if (total === 0) return { count: 0, total: 0, percent: 0 };

        const count = Math.min(current, total);
        return {
            count,
            total,
            percent: Math.round((count / total) * 100),
        };
    }
}
