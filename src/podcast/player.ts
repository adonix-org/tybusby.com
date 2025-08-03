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

import { getElement } from "../elements";
import { Podcast } from "./podcast";

export class Player {
    private readonly podcast: Podcast = new Podcast();
    private readonly selectSeason: HTMLSelectElement;
    private readonly selectEpisode: HTMLDivElement;

    public static async create() {
        return await new Player().init();
    }

    private constructor() {
        this.selectSeason = getElement(".select-season");
        this.selectEpisode = getElement(".select-episode");

        this.selectSeason.addEventListener("change", async () => {
            await this.loadEpisodes();
        });
    }

    private async init(): Promise<Player> {
        const list = await this.podcast.getSeasons();
        for (const season of list.seasons) {
            const option = document.createElement("option");
            option.label = season;
            option.value = season;
            this.selectSeason.add(option);
        }
        await this.loadEpisodes();
        return this;
    }

    private async loadEpisodes(): Promise<void> {
        const season = this.selectSeason.value;
        const episodes = await this.podcast.getPlaylist(season);
        this.selectEpisode.innerHTML = "";
        episodes.playlist.forEach((episode, i) => {
            const option = document.createElement("div");
            option.classList.add("episode");
            option.innerText = episode.title;
            option.dataset.index = String(i);
            this.selectEpisode.appendChild(option);
        });
        this.selectSeason.style.width = `${this.selectEpisode.offsetWidth}px`;
    }
}
