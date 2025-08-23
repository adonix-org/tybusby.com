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

import { Progress } from "../progress";
import { Spinner } from "../spinner";
import { VideoGroup } from "./videos";

const IDS = [
    `vmDDOFXSgAs`, // Dave Brubeck - Take Five
    `ag6KMH0UlVM`, // Sting - I Burn For You
    `KHR6HkHySWY`, // Ray Charles - It's Not Easy Being Green
    `xTgKRCXybSM`, // A Perfect Circle - Judith
    `cRyKCJUXehM`, // Colin Hay - Land Down Under
    `4N82TLB03Vk`, // David Gilmour - Fender Guitar 50th Anniversary
    `wwXeSk2Helo`, // Doris Day - Autumn Leaves
    `8uxt-FnNy2I`, // Coldplay - Don't Panic
    `Rc7_lCfbQP0`, // Bobby Darin - Beyond The Sea
    `2SF1iLXSQto`, // Tom Petty - It's Good To Be King
    `Fb77jRwSky8`, // Frou Frou - Flicks
    `ggGzE5KfCio`, // Ray Charles - Georgia On My Mind
    `rPOlakkBlj8`, // Ella Fitzgerald - Misty
    `fXmEJLMgY8M`, // Björk - Play Dead
    `PYD-DIggB2k`, // Simon and Garfunkle - April Come She Will
    `DeumyOzKqgI`, // Adele - Skyfall
    `VjfvBwYRRzM`, // ANÚNA: Suantraí/Lullaby
];

const spinner = new Spinner();
const progress = new Progress();

new VideoGroup("music-video-grid", IDS)
    .on("progress", (data) => {
        progress.percent = data.percent;
    })
    .once("start", () => {
        spinner.start();
    })
    .once("complete", function () {
        progress.complete();
        spinner.stop();
    })
    .load();
