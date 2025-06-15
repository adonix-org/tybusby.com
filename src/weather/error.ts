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

export class NWSError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly url: string,
        public readonly problem: NWSProblem
    ) {
        super(`${status} ${statusText}: ${url}`);
        this.name = "NWSError";
    }
}

export interface NWSProblem {
    correlationId: string;
    title: string;
    type: string;
    status: number;
    detail: string;
    instance: string;
}
