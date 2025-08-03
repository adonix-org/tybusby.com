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
import { Playlist, Podcast } from "./podcast";

export class Player {
    private readonly podcast: Podcast = new Podcast();
    private readonly selectSeason: HTMLSelectElement;
    private readonly audioPlayer: HTMLAudioElement;
    private readonly episodeList: HTMLDivElement;
    private playlist?: Playlist;

    public static async create() {
        return await new Player().init();
    }

    private constructor() {
        this.selectSeason = getElement(".select-season");
        this.episodeList = getElement(".select-episode");
        this.audioPlayer = getElement(".audio-player");

        this.selectSeason.addEventListener("change", async () => {
            await this.loadEpisodes();
        });

        const observer = new ResizeObserver(() => {
            this.selectSeason.style.width = `${this.episodeList.offsetWidth}px`;
            this.audioPlayer.style.width = `${this.episodeList.offsetWidth}px`;
        });

        observer.observe(this.episodeList);
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

        const episodeList = getElement(".select-episode");
        episodeList.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const episode = target.closest(".episode") as HTMLElement;
            if (!episode) return;

            const index = parseInt(episode.dataset.index || "0");
            this.selectEpisode(index);
        });
        return this;
    }

    public selectEpisode(index: number): void {
        const previouslySelected = this.episodeList.querySelector(".selected");
        if (previouslySelected) {
            previouslySelected.classList.remove("selected");
        }
        const episode = getElement(`.episode[data-index="${index}"]`);
        if (episode) {
            episode.classList.add("selected");
            episode.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }

        this.playEpisode(index);
    }

    public playEpisode(index: number): void {
        if (!this.playlist) {
            return;
        }

        const url = this.playlist.playlist[index]?.url;
        if (url) {
            this.audioPlayer.src = url;
            this.audioPlayer.play();
        }
    }

    private async loadEpisodes(): Promise<void> {
        const season = this.selectSeason.value;
        this.playlist = await this.podcast.getPlaylist(season);
        this.episodeList.innerHTML = "";
        this.playlist.playlist.forEach((episode, i) => {
            const option = document.createElement("div");
            option.classList.add("episode");
            option.innerText = episode.title;
            option.dataset.index = String(i);
            this.episodeList.appendChild(option);
        });
    }
}
