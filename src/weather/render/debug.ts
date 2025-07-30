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

export {};

const body = `MDZ003>006-503-505-507-VAZ025>031-036>040-050-051-501-502-505>508-
526-WVZ050>053-055-300915-
Washington-Frederick MD-Carroll-Northern Baltimore-
Northwest Montgomery-Northwest Howard-Northwest Harford-Augusta-
Rockingham-Shenandoah-Frederick VA-Page-Warren-Clarke-Nelson-
Albemarle-Greene-Madison-Rappahannock-Orange-Culpeper-
Northern Fauquier-Southern Fauquier-Western Loudoun-
Eastern Loudoun-Northern Virginia Blue Ridge-
Central Virginia Blue Ridge-Northwest Prince William-Hampshire-
Morgan-Berkeley-Jefferson-Hardy-
506 AM EDT Tue Jul 29 2025

This Hazardous Weather Outlook is for portions of eastern West
Virginia, northern and central Virginia, and central and western
Maryland.

.DAY ONE...Today and Tonight

No hazardous weather is expected at this time.

.DAYS TWO THROUGH SEVEN...Wednesday through Monday

Hot and humid conditions continue Wednesday. Heat index values of
105 to 109 are possible east of the Blue Ridge, and 100 to 104 
west of the Blue Ridge during the afternoon hours. 

Scattered instances of flash flooding are possible Thursday
afternoon and evening.

.SPOTTER INFORMATION STATEMENT...

Spotter activation is not expected at this time.

$$`;

function hwoFilter(body: string): boolean {
    const noHazardRegex = /no hazardous weather is expected at this time/i;
    const dayOneRegex = /\.DAY ONE[\s\S]*?(?=\.DAYS? TWO|\Z)/;
    const match = body.match(dayOneRegex);

    if (!match) {
        return true;
    }
    return !noHazardRegex.test(match[0]);
}

console.log(hwoFilter(body));
