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
        if (current > total) {
            current = total;
        }
        return total === 0
            ? { count: 0, total: 0, percent: 0 }
            : {
                  count: current,
                  total: total,
                  percent: Math.round((current / total) * 100),
              };
    }
}
