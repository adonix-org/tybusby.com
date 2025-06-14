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

import { NWSError } from "./error.js";
import { LatestObservation } from "./observation.js";
import { Products } from "./products.js";

const hazard = await new Products("HWO", "BGMX").get();

console.log(hazard ?? "Product Not Found");

try {
    const observation = await new LatestObservation("KELMX").get();
    console.log(observation);
} catch (error) {
    if (error instanceof NWSError) {
        console.log(error.problem?.title);
    }
    console.error(error);
}
