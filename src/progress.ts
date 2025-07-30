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

import { getElementById } from "./elements";

export interface ProgressData {
    count: number;
    total: number;
    percent: number;
}

export class Progress {
    private _element: HTMLElement;
    private _percent: number = 0;

    constructor(id: string = "progress") {
        this._element = getElementById(id, HTMLElement);
    }

    /**
     * The activity for this progress bar finished.
     *
     * @param holdMs - number of milliseconds the progress
     * will be shown at 100% before resetting to zero.
     */
    public complete(holdMs: number = 500): void {
        this.percent = 100;
        setTimeout(() => (this.percent = 0), Math.max(0, holdMs));
    }

    public set percent(percent: number) {
        this._percent = Math.max(0, Math.min(100, percent));
        this.refresh();
    }

    public get percent(): number {
        return this._percent;
    }

    private refresh(): void {
        this._element.style.width = `${this._percent}%`;
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
