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

import {
    NWSFetchError,
    NWSResponseError,
    NWSJsonError,
} from "@adonix.org/nws-report";

export function formatNWSError(err: unknown): string {
    if (err instanceof NWSFetchError) {
        console.error("NWSFetchError:", err);
        if (err.cause) console.error("Cause:", err.cause);

        const causeMsg =
            err.cause instanceof Error ? ` (${err.cause.message})` : "";
        return `Network error while fetching ${err.url}${causeMsg}`;
    }

    if (err instanceof NWSResponseError) {
        console.error("NWSResponseError:", err);
        console.log("NWS Problem Details:", err.details);
        const detailsJson = JSON.stringify(err.details, null, 4);
        return `Server returned ${err.status} for ${err.url}:\n${detailsJson}`;
    }

    if (err instanceof NWSJsonError) {
        console.error("NWSJsonError:", err);
        if (err.cause) console.error("Cause:", err.cause);
        return `Invalid JSON from ${err.url}:\n${JSON.stringify(
            err.json,
            null,
            2
        )}`;
    }

    console.error("Unknown error:", err);
    if (err instanceof Error && err.stack) console.error(err.stack);
    return err instanceof Error ? err.message : String(err);
}
