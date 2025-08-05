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
    private readonly podcast = new Podcast();
    private readonly selectSeason: HTMLSelectElement;
    private readonly audioPlayer: HTMLAudioElement;
    private readonly episodeList: HTMLDivElement;
    private playlist?: MetaData[];
    private episodeIndex = 0;
    private currentTime = 0;
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

        this.selectEvent();
        this.clickEvent();
        this.scrollEvent();
        this.audioEvents();
        this.keyboardEvents();

        await this.loadSeasons();
        this.selectSeason.selectedIndex = playerState.season;

        await this.loadSeason();
        this.episodeIndex = playerState.episode;

        this.newTrack();
        this.audioPlayer.currentTime = playerState.time;

        getElement(".podcast-player").classList.add("loaded");

        return this;
    }

    private selectEvent() {
        this.selectSeason.addEventListener("change", async () => {
            await this.loadSeason();
            this.episodeIndex = 0;
            this.newTrack();
        });
    }

    private clickEvent() {
        this.episodeList.addEventListener("click", (e) => {
            if (e.target && e.target instanceof Element) {
                this.selectTrack(e.target.closest(".episode-row"));
            }
        });
    }

    private scrollEvent() {
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
    }

    private keyboardEvents() {
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    let track = this.getCurrentTrack();
                    if (
                        e.target instanceof HTMLElement &&
                        e.target.classList.contains("episode-row")
                    ) {
                        track = e.target;
                    }
                    this.selectTrack(track);
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
    }

    private audioEvents() {
        this.audioPlayer.onplaying = () => {
            this.isPlaying = true;
        };
        this.audioPlayer.onpause = () => {
            this.isPlaying = false;
        };
        this.audioPlayer.onended = () => {
            this.nextTrack();
        };
        this.audioPlayer.ontimeupdate = () => {
            const currentTime = Math.floor(this.audioPlayer.currentTime);
            if (
                currentTime > this.currentTime + 1 ||
                currentTime < this.currentTime
            ) {
                this.currentTime = currentTime;
                this.saveState(this.audioPlayer.currentTime);
            }
        };
        this.audioPlayer.onloadedmetadata = () => {
            const track = this.getCurrentTrack();
            if (track) {
                const duration = getElement(".episode-length", track);
                duration.textContent = formatTime(this.audioPlayer.duration);
            }
        };
    }

    private selectTrack(track: Element | EventTarget | null) {
        if (
            track &&
            track instanceof HTMLElement &&
            track.classList.contains("episode-row")
        ) {
            const currentTrack = this.getCurrentTrack();
            if (currentTrack && currentTrack === track) {
                this.togglePlayback();
                return;
            }

            // A new track was selected
            const newIndex = parseInt(track.dataset.index || "0");
            this.episodeIndex = newIndex;
            this.newTrack();
        }
    }

    private newTrack(): void {
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
        const track = this.playlist?.[this.episodeIndex];
        if (track) {
            this.audioPlayer.src = track.url;
            this.setMetaData(track);
        }
    }

    private togglePlayback(): void {
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

    private getCurrentTrack(): HTMLElement | null {
        try {
            return getElement(".selected", this.episodeList, HTMLElement);
        } catch (error) {
            return null;
        }
    }

    private nextTrack() {
        const length = this.playlist?.length;
        if (length && this.episodeIndex + 1 < length) {
            this.episodeIndex = this.episodeIndex + 1;
        } else {
            this.episodeIndex = 0;
        }
        this.newTrack();
    }

    private previousTrack() {
        if (this.episodeIndex - 1 > 0) {
            this.episodeIndex = this.episodeIndex - 1;
        } else {
            this.episodeIndex = 0;
        }
        this.newTrack();
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

    private async loadSeasons(): Promise<void> {
        const seasons = await this.podcast.getSeasons();
        for (const season of seasons) {
            const option = document.createElement("option");
            option.textContent = season;
            option.value = season;
            this.selectSeason.appendChild(option);
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
