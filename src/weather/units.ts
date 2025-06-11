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

import { QuantitativeValue } from "./common";

export class Units {
    public static to_value(
        quant: QuantitativeValue | undefined
    ): number | undefined {
        if (quant && quant.value) {
            return quant.value;
        }
        return undefined;
    }

    public static c_to_f(celsius: number): number {
        return Math.round((celsius * 9) / 5 + 32);
    }

    public static meters_to_miles(meters: number): number {
        return meters / 1609.344;
    }

    public static degree_to_cardinal(degree: number): string {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const index = Math.round((degree % 360) / 45) % 8;
        return directions[index] ?? "?";
    }

    public static kmh_to_mph(kmh: number): number {
        return kmh * 0.621371;
    }
}
