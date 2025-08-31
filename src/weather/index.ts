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
    AlertAdminMessage,
    NationalWeatherService,
    WeatherReport,
} from "@adonix.org/nws-report";
import { ReportRender } from "./render/report";
import { Progress } from "../progress";
import { Spinner } from "../spinner";
import { getElementById } from "../elements";
import { Message } from "../message";

NationalWeatherService.origin = "https://nws.adonix.org";

/**
 * latitude, longitude
 */
type Coordinate = [number, number];

const coordinates: Coordinate[] = [
    // Horseheads, NY
    [42.1762, -76.8358],

    // Waynesboro, VA
    [38.0762, -78.9125],

    // Yorktown, VA
    [37.2367, -76.5065],

    // Waverly, IA
    [42.7382, -92.4781],
];

const REPORT_PARENT_ID = "weather-grid";
const REFRESH_RATE = 1000 * 60 * 5;

const promises = coordinates.map(([lat, lon]) =>
    WeatherReport.create(lat, lon)
        .catch((error: unknown) => {
            if (error instanceof Error) {
                return error;
            }
            return new Error(`Unexpected error: ${String(error)}`, {
                cause: error,
            });
        })
        .finally(() => updateStatus(++completed))
);

Promise.all(promises).then((results) => {
    const parent = getElementById(REPORT_PARENT_ID);
    results.forEach((result, index) => {
        if (result instanceof Error) {
            new Message(result.message).show();
            console.group(`coordinates[${index}]: ${result.message}`);
            console.error(result);
            console.dir(result);
            console.groupEnd();
        } else {
            const reportRenderer = new ReportRender(parent, result);
            reportRenderer.render();
            const staggerDelay = (index + 1) * 1000 * 60;
            startStaggeredRefresh(
                reportRenderer,
                result.station?.properties.stationIdentifier ??
                    `station-${index}`,
                staggerDelay
            );
        }
    });
});

let completed = 0;

const progress = new Progress();
const spinner = new Spinner();
spinner.start();

try {
    const alertProduct = await new AlertAdminMessage().get();
    console.log(alertProduct?.productText);
} catch (err) {
    new Message(String(err)).show();
    console.error("Failed to get alert admin product:", err);
}

function updateStatus(current: number) {
    progress.percent = Progress.calculate(current, coordinates.length).percent;
    if (current >= coordinates.length) {
        progress.complete();
        spinner.stop();
    }
}

function startStaggeredRefresh(
    reportRenderer: ReportRender,
    stationId: string,
    delayMs: number
) {
    setTimeout(function scheduleRefresh() {
        (async () => {
            try {
                console.log(
                    `refreshing ${stationId} at ${new Date().toLocaleTimeString()}`
                );
                await reportRenderer.refresh();
            } catch (err) {
                new Message(
                    `Error refreshing ${stationId}: ${String(err)}`
                ).show();
                console.error(`Error refreshing ${stationId}:`, err);
            } finally {
                setTimeout(scheduleRefresh, REFRESH_RATE);
            }
        })();
    }, delayMs);
}
