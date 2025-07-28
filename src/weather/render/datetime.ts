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

import { DateTime } from "luxon";

export function formatIsoDate(
    isoDateString: string,
    format: string,
    timeZone?: string
): string {
    let dt = DateTime.fromISO(isoDateString);
    if (!dt.isValid) {
        throw new Error(`Invalid DateTime: ${isoDateString}`);
    }
    if (timeZone) {
        dt = dt.setZone(timeZone);
        if (!dt.isValid) {
            throw new Error(`Invalid TimeZone: ${timeZone}`);
        }
    }
    return dt.toFormat(format);
}

export function isIsoDatePast(isoDateString: string) {
    const dt = DateTime.fromISO(isoDateString);
    if (!dt.isValid) {
        throw new Error(`Invalid DateTime: ${isoDateString}`);
    }
    return dt < DateTime.now();
}
