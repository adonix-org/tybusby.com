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

import { Message } from "../message";
import { Spinner } from "../spinner";
import { Player } from "./player";

const spinner = new Spinner();
spinner.start();

try {
    await Player.create();
} catch (error) {
    new Message(String(error), "critical");
    new Message(String(error));
    new Message(
        `...HEAT ADVISORY REMAINS IN EFFECT FROM NOON TODAY TO 8 PM CDT THIS 
EVENING...

* WHAT...Heat index values up to 105 expected.

* WHERE...Portions of northwest and west central Iowa, northeast 
  Nebraska, and south central and southeast South Dakota.

* WHEN...From noon today to 8 PM CDT this evening.

* IMPACTS...Hot temperatures and high humidity may cause heat 
  illnesses.

PRECAUTIONARY/PREPAREDNESS ACTIONS...

Drink plenty of fluids, stay in an air-conditioned room, stay out of 
the sun, and check up on relatives and neighbors.

Do not leave young children and pets in unattended vehicles. Car 
interiors will reach lethal temperatures in a matter of minutes.

To reduce risk during outdoor work, the Occupational Safety and
Health Administration recommends scheduling frequent rest breaks in 
shaded or air conditioned environments. Anyone overcome by heat 
should be moved to a cool and shaded location. Heat stroke is an 
emergency! Call 9 1 1.

&&

$$

IG`,
        "success"
    );
    new Message(String(error), "warning");
    new Message(String(error), "info");
    new Message(String(error), "tip");
    new Message(String(error), "debug");
} finally {
    spinner.stop();
}
