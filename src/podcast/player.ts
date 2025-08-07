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
import { PODCAST_1024x1024_JPG } from "./image";
import { MetaData, Podcast } from "./podcast";
import { DateTime } from "luxon";

export class Player {
    private static readonly SAVED_STATE_KEY = "adonix.player.resume";

    private readonly podcast = new Podcast();
    private readonly selectSeason: HTMLSelectElement;
    private readonly audioPlayer: HTMLAudioElement;
    private readonly episodeList: HTMLDivElement;

    private playlist?: MetaData[];
    private episodeIndex = 0;
    private currentTime = 0;
    private focusIndex = 0;

    public static async create(): Promise<Player> {
        return await new Player().init();
    }

    private constructor() {
        this.selectSeason = getElement(".select-season");
        this.episodeList = getElement(".select-episode");
        this.audioPlayer = getElement(".audio-player");
    }

    private async init(): Promise<Player> {
        const playerState = this.loadState();

        this.selectEvents();
        this.clickEvents();
        this.scrollEvents();
        this.audioEvents();
        this.mediaEvents();
        this.keyboardEvents();
        this.copyEvents();

        await this.loadSeasons();
        this.selectSeason.selectedIndex = playerState.season;

        await this.loadSeason();
        this.episodeIndex = playerState.episode;
        this.focusIndex = this.episodeIndex;

        this.newTrack();
        this.audioPlayer.currentTime = playerState.seconds;

        getElement(".podcast-player").classList.add("loaded");

        return this;
    }

    private selectEvents(): void {
        this.selectSeason.addEventListener("change", async () => {
            await this.loadSeason();
            this.episodeIndex = 0;
            this.focusIndex = 0;
            this.newTrack();
            this.audioPlayer.pause();
        });
    }

    private clickEvents(): void {
        this.episodeList.addEventListener("click", (e) => {
            if (e.target && e.target instanceof Element) {
                this.selectTrack(e.target.closest(".episode-row"));
            }
        });
    }

    private scrollEvents(): void {
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

    private keyboardEvents(): void {
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

                case "ArrowUp":
                    e.preventDefault();
                    this.focusIndex--;
                    this.setTrackFocus();
                    break;

                case "ArrowDown":
                    e.preventDefault();
                    this.focusIndex++;
                    this.setTrackFocus();
                    break;
            }
        });
    }

    private audioEvents(): void {
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
                this.saveState();
            }
        };
        this.audioPlayer.onloadedmetadata = () => {
            const track = this.getCurrentTrack();
            if (track) {
                const duration = getElement(".episode-length", track);
                duration.textContent = `${this.formatDuration(
                    this.audioPlayer.duration
                )}`;
            }
        };
    }

    private copyEvents(): void {
        document.addEventListener("copy", (event) => {
            const state: SaveState = this.getState(); // however you get it
            const url = new URL(location.href);
            url.searchParams.set("season", String(state.season));
            url.searchParams.set("episode", String(state.episode));
            url.searchParams.set("seconds", String(state.seconds));

            const shareUrl = url.toString();

            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", shareUrl);
                event.preventDefault();
            }
        });
    }

    private mediaEvents(): void {
        if ("mediaSession" in navigator) {
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

    private setMetaData(track: MetaData) {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                album: this.formatAlbum(track),
                artist: track.artist,
                artwork: [
                    {
                        src: `data:image/jpeg;base64,${PODCAST_1024x1024_JPG}`,
                        sizes: "1024x1024",
                        type: "image/jpeg",
                    },
                ],
            });
        }
    }

    private setTrackFocus() {
        if (!this.playlist) return;

        const tracks = Array.from(document.querySelectorAll(".episode-row"));
        if (this.focusIndex < 0) {
            this.focusIndex = this.playlist.length - 1;
        } else if (this.focusIndex >= this.playlist.length) {
            this.focusIndex = 0;
        }

        const track = tracks[this.focusIndex];
        if (track instanceof HTMLElement) {
            track.focus();
        }
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
            this.audioPlayer.pause();
            this.episodeIndex = parseInt(track.dataset.index || "0");
            this.newTrack();
            this.audioPlayer.play();

            this.focusIndex = this.episodeIndex;
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
            this.audioPlayer.load();
            this.setMetaData(track);
            this.saveState();
        }
    }

    private togglePlayback(): void {
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
        } else {
            this.audioPlayer.pause();
        }
    }

    private showCurrentTrack(): void {
        const currentTrack = this.getCurrentTrack();
        if (currentTrack) {
            currentTrack.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
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

    private changeTrack(offset: number): void {
        const length = this.playlist?.length ?? 0;
        if (length === 0) return;

        this.episodeIndex = (this.episodeIndex + offset + length) % length;
        this.newTrack();
        this.audioPlayer.play();
    }

    private nextTrack(): void {
        this.changeTrack(1);
    }

    private previousTrack(): void {
        this.changeTrack(-1);
    }

    private async loadSeason(): Promise<void> {
        const season = this.selectSeason.value;
        this.playlist = await this.podcast.getPlaylist(season);
        this.episodeList.innerHTML = "";
        this.playlist.forEach((track, i) => {
            const row = getTemplateRoot("episode-template");
            getElement(".episode-title", row).textContent = track.title;
            getElement(".episode-album", row).textContent =
                this.formatAlbum(track);
            getElement(".episode-length", row).textContent =
                this.formatDuration(track.seconds);
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

    private getState(): SaveState {
        return {
            season: this.selectSeason.selectedIndex,
            episode: this.episodeIndex,
            seconds: this.audioPlayer.currentTime,
        };
    }

    private saveState(): void {
        localStorage.setItem(
            Player.SAVED_STATE_KEY,
            JSON.stringify(this.getState())
        );
    }

    private loadState(): SaveState {
        const fallback: SaveState = {
            season: 0,
            episode: 0,
            seconds: 0,
        };

        let state = this.loadStateUrl();
        if (state) {
            history.replaceState({}, "", location.pathname);
            return state;
        }

        const raw = localStorage.getItem(Player.SAVED_STATE_KEY);
        if (!raw) return fallback;

        try {
            const parsed = JSON.parse(raw);
            if (
                typeof parsed === "object" &&
                parsed !== null &&
                typeof parsed.season === "number" &&
                typeof parsed.episode === "number" &&
                typeof parsed.seconds === "number"
            ) {
                return parsed as SaveState;
            } else {
                localStorage.removeItem(Player.SAVED_STATE_KEY);
                return fallback;
            }
        } catch {
            localStorage.removeItem(Player.SAVED_STATE_KEY);
            return fallback;
        }
    }

    private loadStateUrl(): SaveState | null {
        const url = new URL(document.URL);

        const seasonStr = url.searchParams.get("season");
        const episodeStr = url.searchParams.get("episode");
        const secondsStr = url.searchParams.get("seconds");

        if (!seasonStr || !episodeStr || !secondsStr) {
            return null;
        }

        const season = parseInt(seasonStr, 10);
        const episode = parseInt(episodeStr, 10);
        const seconds = parseInt(secondsStr, 10);

        if (isNaN(season) || isNaN(episode) || isNaN(seconds)) {
            return null;
        }

        return { season, episode, seconds };
    }

    private formatAlbum(track: MetaData): string {
        return `${track.album} · ${DateTime.fromISO(track.date).toFormat(
            "MMM d, yyyy"
        )}`;
    }

    private formatDuration(seconds: number): string {
        if (seconds == 0) {
            return `⏱️ --:--`;
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds) % 60;
        return `⏱️ ${minutes}:${secs.toString().padStart(2, "0")}`;
    }
}

interface SaveState {
    season: number;
    episode: number;
    seconds: number;
}
