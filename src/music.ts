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

import { Progress } from "./progress";
import { Spinner } from "./spinner";
import { VideoGroup } from "./videos";

const YOUTUBE = "https://www.youtube-nocookie.com/embed";

const URLS = [
    `${YOUTUBE}/vmDDOFXSgAs`, // Dave Brubeck - Take Five
    `${YOUTUBE}/ag6KMH0UlVM`, // Sting - I Burn For You
    `${YOUTUBE}/KHR6HkHySWY`, // Ray Charles - It's Not Easy Being Green
    `${YOUTUBE}/xTgKRCXybSM`, // A Perfect Circle - Judith
    `${YOUTUBE}/cRyKCJUXehM`, // Colin Hay - Land Down Under
    `${YOUTUBE}/4N82TLB03Vk`, // David Gilmour - Fender Guitar 50th Anniversary
    `${YOUTUBE}/wwXeSk2Helo`, // Doris Day - Autumn Leaves
    `${YOUTUBE}/8uxt-FnNy2I`, // Coldplay - Don't Panic
    `${YOUTUBE}/Rc7_lCfbQP0`, // Bobby Darin - Beyond The Sea
    `${YOUTUBE}/2SF1iLXSQto`, // Tom Petty - It's Good To Be King
    `${YOUTUBE}/Fb77jRwSky8`, // Frou Frou - Flicks
    `${YOUTUBE}/ggGzE5KfCio`, // Ray Charles - Georgia On My Mind
    `${YOUTUBE}/rPOlakkBlj8`, // Ella Fitzgerald - Misty
    `${YOUTUBE}/fXmEJLMgY8M`, // Björk - Play Dead
    `${YOUTUBE}/PYD-DIggB2k`, // Simon and Garfunkle - April Come She Will
    `${YOUTUBE}/DeumyOzKqgI`, // Adele - Skyfall
];

const spinner = new Spinner();
const progress = new Progress();

new VideoGroup("music-video-grid", URLS)
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
