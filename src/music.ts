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

import { Progress } from "./progress.js";
import { VideoGroup } from "./videos.js";

const YT_BASE_URL = "https://www.youtube-nocookie.com/embed";

const URLS = [
    `${YT_BASE_URL}/vmDDOFXSgAs`, // Dave Brubeck - Take Five
    `${YT_BASE_URL}/ag6KMH0UlVM`, // Sting - I Burn For You
    `${YT_BASE_URL}/KHR6HkHySWY`, // Ray Charles - It's Not Easy Being Green
    `${YT_BASE_URL}/xTgKRCXybSM`, // A Perfect Circle - Judith
    `${YT_BASE_URL}/cRyKCJUXehM`, // Colin Hay - Land Down Under
    `${YT_BASE_URL}/4N82TLB03Vk`, // David Gilmour - Fender Guitar 50th Anniversary
    `${YT_BASE_URL}/wwXeSk2Helo`, // Doris Day - Autumn Leaves
    `${YT_BASE_URL}/8uxt-FnNy2I`, // Coldplay - Don't Panic
    `${YT_BASE_URL}/Rc7_lCfbQP0`, // Bobby Darin - Beyond The Sea
    `${YT_BASE_URL}/2SF1iLXSQto`, // Tom Petty - It's Good To Be King
    `${YT_BASE_URL}/ggGzE5KfCio`, // Ray Charles - Georgia On My Mind
    `${YT_BASE_URL}/rPOlakkBlj8`, // Ella Fitzgerald - Misty
    `${YT_BASE_URL}/ivdh3zvoQGw`, // Bjork - Heirloom
    `${YT_BASE_URL}/PYD-DIggB2k`, // Simon and Garfunkle - April Come She Will
    `${YT_BASE_URL}/DeumyOzKqgI`, // Adele - Skyfall
];

const progress = new Progress();

new VideoGroup("music-video-grid", URLS)
    .on("progress", (data) => {
        progress.percent = data.percent;
        console.log(progress.percent);
    })
    .on("loading", () => {
        console.log("Loading...");
    })
    .on("loaded", () => {
        progress.complete();
        console.log("Loaded.");
    })
    .load();
