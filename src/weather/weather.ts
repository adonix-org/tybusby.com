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

import { EventEmitter } from "../event.js";
import { NationalWeatherService, NWSResource } from "./nws.js";
import { Observation } from "./observation.js";

interface ObserverEvents {
    success: Observation;
    error: Error;
}

class Observer extends EventEmitter<ObserverEvents> implements NWSResource {
    constructor(private readonly station: string) {
        super();
        NationalWeatherService.fetch<Observation>(this)
            .then((observation) => {
                this.emit("success", observation);
            })
            .catch((error) => {
                this.emit("error", error);
            });
    }

    public get resource(): string {
        return `/stations/${this.station}/observations/latest`;
    }
}

new Observer("KELM")
    .once("success", (observation) => {
        console.log(observation);
    })
    .on("error", (error) => {
        console.log(error);
    });

new Observer("KPHF")
    .once("success", (observation) => {
        console.log(observation);
    })
    .on("error", (error) => {
        console.log(error);
    });
