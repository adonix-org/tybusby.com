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
import { getTemplateRoot } from "../elements";
import { PODCAST_256X256_JPG } from "./image";
import { MetaData, Podcast } from "./podcast";

export class Player {
    private readonly podcast: Podcast = new Podcast();
    private readonly selectSeason: HTMLSelectElement;
    private readonly audioPlayer: HTMLAudioElement;
    private readonly episodeList: HTMLDivElement;
    private episodeIndex = 0;
    private currentTime = 0;
    private playlist?: MetaData[];
    private isPlaying = false;

    public static async create() {
        return await new Player().init();
    }

    private constructor() {
        this.selectSeason = getElement(".select-season");
        this.episodeList = getElement(".select-episode");
        this.audioPlayer = getElement(".audio-player");
    }

    private async init(): Promise<Player> {
        const playerState = this.loadState();

        this.selectSeason.addEventListener("change", async () => {
            await this.loadSeason();
            this.episodeIndex = 0;
            this.selectTrack();
        });

        this.audioPlayer.addEventListener("timeupdate", () => {
            const currentTime = Math.floor(this.audioPlayer.currentTime);
            if (
                currentTime > this.currentTime + 1 ||
                currentTime < this.currentTime
            ) {
                this.currentTime = currentTime;
                this.saveState(this.audioPlayer.currentTime);
            }
        });

        let scrollTimeout: number | undefined;
        let returnTimeout: number | undefined;
        this.episodeList.addEventListener("scroll", () => {
            clearTimeout(scrollTimeout);
            clearTimeout(returnTimeout);

            scrollTimeout = window.setTimeout(() => {
                returnTimeout = window.setTimeout(() => {
                    this.showCurrentTrack();
                }, 5000);
            }, 200);
        });

        this.audioPlayer.addEventListener("ended", () => {
            this.nextTrack();
        });

        const seasons = await this.podcast.getSeasons();
        for (const season of seasons) {
            const option = document.createElement("option");
            option.textContent = season;
            option.value = season;
            this.selectSeason.appendChild(option);
        }
        this.selectSeason.selectedIndex = playerState.season;

        await this.loadSeason();

        this.episodeList.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const episode = target.closest(".episode-row") as HTMLElement;
            if (!episode) return;

            const newIndex = parseInt(episode.dataset.index || "0");

            // Toggle Play/Pause
            if (this.episodeIndex === newIndex) {
                this.toggle();
                return;
            }

            this.episodeIndex = newIndex;
            this.selectTrack();
        });

        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    const target = e.target;
                    if (
                        target instanceof HTMLElement &&
                        target.classList.contains("episode-row")
                    ) {
                        const newIndex = parseInt(target.dataset.index || "0");
                        if (newIndex !== this.episodeIndex) {
                            // A different track had focus on Enter
                            this.episodeIndex = newIndex;
                            this.selectTrack();
                            return;
                        }
                    }

                    if (this.getCurrentTrack()) {
                        this.toggle();
                    }

                    break;

                case "Escape":
                    e.preventDefault();
                    this.showCurrentTrack();
                    break;

                case "ArrowRight":
                    e.preventDefault();
                    this.audioPlayer.currentTime += 30;
                    break;

                case "ArrowLeft":
                    e.preventDefault();
                    this.audioPlayer.currentTime -= 30;
                    break;
            }
        });

        this.episodeIndex = playerState.episode;
        this.selectTrack();
        this.audioPlayer.currentTime = playerState.time;
        this.audioPlayer.onplaying = () => {
            this.isPlaying = true;
        };
        this.audioPlayer.onpause = () => {
            this.isPlaying = false;
        };

        getElement(".podcast-player").classList.add("loaded");

        return this;
    }

    private toggle(): void {
        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.isPlaying = false;
        } else {
            this.audioPlayer.play();
        }
    }

    private showCurrentTrack() {
        const currentTrack = this.getCurrentTrack();
        if (currentTrack) {
            currentTrack.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
            requestAnimationFrame(() => {
                currentTrack.focus({ preventScroll: true });
            });
        }
    }

    private getCurrentTrack(): HTMLDivElement | undefined {
        try {
            return getElement(".selected", this.episodeList, HTMLDivElement);
        } catch (error) {
            return undefined;
        }
    }

    private nextTrack() {
        const length = this.playlist?.length;
        if (length && this.episodeIndex + 1 < length) {
            this.episodeIndex = this.episodeIndex + 1;
        } else {
            this.episodeIndex = 0;
        }
        this.selectTrack();
    }

    private previousTrack() {
        if (this.episodeIndex - 1 > 0) {
            this.episodeIndex = this.episodeIndex - 1;
        } else {
            this.episodeIndex = 0;
        }
        this.selectTrack();
    }

    public selectTrack(): void {
        const existingSelection = this.getCurrentTrack();
        if (existingSelection) {
            existingSelection.classList.remove("selected");
        }
        const newSelection = getElement(
            `.episode-row[data-index="${this.episodeIndex}"]`,
            this.episodeList
        );
        if (newSelection) {
            newSelection.classList.add("selected");
            this.showCurrentTrack();
        }

        const episode = this.playlist?.[this.episodeIndex];
        if (episode) {
            this.audioPlayer.src = episode.url;
            this.setMetaData(episode);
        }
    }

    private async loadSeason(): Promise<void> {
        const season = this.selectSeason.value;
        this.playlist = await this.podcast.getPlaylist(season);
        this.episodeList.innerHTML = "";
        this.playlist.forEach((track, i) => {
            const row = getTemplateRoot("episode-template");
            getElement(".episode-title", row).textContent = track.title;
            getElement(".episode-album", row).textContent = formatAlbum(
                track.album
            );
            getElement(".episode-length", row).textContent =
                track.seconds === 0 ? "--:--" : formatTime(track.seconds);
            row.dataset.index = String(i);
            this.episodeList.appendChild(row);
        });
    }

    private setMetaData(data: MetaData): void {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: data.title,
                artist: data.artist ?? "Unknown Artist",
                album: data.album ?? "Podcast",
                artwork: [
                    {
                        src: `data:image/jpeg;base64,${PODCAST_256X256_JPG}`,
                        sizes: "256x256",
                        type: "image/png",
                    },
                ],
            });

            navigator.mediaSession.setActionHandler("play", () => {
                this.audioPlayer.play();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                this.audioPlayer.pause();
            });
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                this.nextTrack();
            });
            navigator.mediaSession.setActionHandler("previoustrack", () => {
                this.previousTrack();
            });
        }
    }

    private saveState(currentTime: number) {
        const state: SaveState = {
            season: this.selectSeason.selectedIndex,
            episode: this.episodeIndex,
            time: currentTime,
        };
        localStorage.setItem("playlist-state", JSON.stringify(state));
    }

    private loadState(): SaveState {
        const state = localStorage.getItem("playlist-state");
        if (state) {
            return JSON.parse(state) as SaveState;
        }
        return {
            season: 0,
            episode: 0,
            time: 0,
        };
    }
}

interface SaveState {
    season: number;
    episode: number;
    time: number;
}

function formatAlbum(album: string): string {
    const carMatch = album.match(/\bCar Talk\b( .+)?/);
    if (!carMatch) return album;

    let result = "Car Talk";
    if (carMatch[1]) {
        result += " ·" + carMatch[1];
    }
    return result.trim();
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds) % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
