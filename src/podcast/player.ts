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
import { Track } from "./track";

export class Player {
    private static readonly SAVED_STATE_KEY = "adonix.player.resume";

    private readonly podcast = new Podcast();
    private readonly selectSeason: HTMLSelectElement;
    private readonly audioPlayer: HTMLAudioElement;
    private readonly trackList: HTMLDivElement;

    private currentTime = 0;

    public static async create(): Promise<Player> {
        return await new Player().init();
    }

    private constructor() {
        this.selectSeason = getElement(".select-season");
        this.trackList = getElement(".select-track");
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
        this.newTrack(this.getTrack(playerState.episode));

        this.audioPlayer.currentTime = playerState.seconds;

        getElement(".podcast-player").classList.add("loaded");

        return this;
    }

    private selectEvents(): void {
        this.selectSeason.addEventListener("change", async () => {
            await this.loadSeason();
            this.newTrack(this.getTrack(0));
            this.audioPlayer.pause();
        });
    }

    private clickEvents(): void {
        this.trackList.addEventListener("click", (e) => {
            if (e.target && e.target instanceof Element) {
                this.selectTrack(
                    Track.fromElement(
                        e.target.closest(".track-row") ?? undefined
                    )
                );
            }
        });
    }

    private scrollEvents(): void {
        let scrollTimeout: number | undefined;
        let returnTimeout: number | undefined;
        this.trackList.addEventListener("scroll", () => {
            clearTimeout(scrollTimeout);
            clearTimeout(returnTimeout);

            scrollTimeout = window.setTimeout(() => {
                returnTimeout = window.setTimeout(() => {
                    const track = this.getCurrentTrack();
                    if (track) {
                        track.element.focus({ preventScroll: true });
                        track.show();
                    }
                }, 5000);
            }, 200);
        });
    }

    private keyboardEvents(): void {
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "Enter":
                    e.preventDefault();
                    if (
                        e.target instanceof HTMLElement &&
                        e.target.classList.contains("track-row")
                    ) {
                        this.selectTrack(Track.fromElement(e.target));
                    } else {
                        // Accept Enter even without focus
                        this.selectTrack(this.getCurrentTrack());
                    }
                    break;

                case "Escape":
                    e.preventDefault();
                    this.getCurrentTrack()?.show();
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
                    this.setTrackFocus(-1);
                    break;

                case "ArrowDown":
                    e.preventDefault();
                    this.setTrackFocus(1);
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
            this.getCurrentTrack()?.setDuration(this.audioPlayer.duration);
        };
    }

    private copyEvents(): void {
        document.addEventListener("copy", (e) => {
            const state: SaveState = this.getState(); // however you get it
            const url = new URL(location.href);
            url.searchParams.set("season", String(state.season));
            url.searchParams.set("episode", String(state.episode));
            url.searchParams.set("seconds", String(state.seconds));

            const shareUrl = url.toString();

            if (e.clipboardData) {
                e.preventDefault();
                e.clipboardData.setData("text/plain", shareUrl);
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

    private setTrackFocus(
        offset: number,
        preventScroll: boolean = false
    ): void {
        let element = this.getCurrentElement();
        const active = document.activeElement;
        if (
            active &&
            active instanceof HTMLElement &&
            active.classList.contains("track-row")
        ) {
            element = active;
        }

        const track = Track.fromElement(element);
        if (track) {
            const rows = this.getRows();
            const index =
                (((track.index + offset) % rows.length) + rows.length) %
                rows.length;
            rows[index]?.focus({ preventScroll });
        }
    }

    private selectTrack(track: Track | undefined): void {
        if (!track) return;

        // The same track was selected.
        if (track === this.getCurrentTrack()) {
            this.togglePlayback();
            return;
        }

        // A new track was selected
        this.audioPlayer.pause();
        this.newTrack(track);
        this.audioPlayer.play();
    }

    private newTrack(track: Track | undefined): void {
        if (!track) return;

        let currentTrack = this.getCurrentTrack();
        if (currentTrack) {
            currentTrack.element.classList.remove("selected");
        }

        track.element.classList.add("selected");
        track.show();

        this.audioPlayer.src = track.getUrl();
        this.audioPlayer.load();
        this.setMetaData(track);
        this.saveState();
    }

    private setMetaData(track: Track) {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = track.getMetaData();
        }
    }

    private togglePlayback(): void {
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
        } else {
            this.audioPlayer.pause();
        }
    }

    private getRows(): HTMLElement[] {
        return Array.from(this.trackList.querySelectorAll(".track-row"));
    }

    private getRow(index: number): HTMLElement | undefined {
        return this.getRows()[index];
    }

    private getTrack(index: number): Track | undefined {
        return Track.fromElement(this.getRow(index));
    }

    private getCurrentTrack(): Track | undefined {
        const current = this.getCurrentElement();
        if (current) {
            return Track.fromElement(current);
        }
        return undefined;
    }

    private getCurrentElement(): HTMLElement | undefined {
        const current = this.trackList.querySelector(".selected");
        if (current && current instanceof HTMLElement) {
            return current;
        }
        return undefined;
    }

    private changeTrack(offset: number): void {
        const rows = this.getRows();
        if (rows.length === 0) return;

        const current = this.getCurrentTrack();
        if (current) {
            const newIndex =
                (current.index + offset + rows.length) % rows.length;
            this.newTrack(this.getTrack(newIndex));
            this.audioPlayer.play();
        }
    }

    private nextTrack(): void {
        this.changeTrack(1);
    }

    private previousTrack(): void {
        this.changeTrack(-1);
    }

    private async loadSeason(): Promise<void> {
        const season = this.selectSeason.value;
        const playlist = await this.podcast.getPlaylist(season);

        this.trackList.innerHTML = "";

        playlist.forEach((episode) => {
            new Track(this.trackList, episode);
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
            episode: this.getCurrentTrack()?.index ?? 0,
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
}

interface SaveState {
    season: number;
    episode: number;
    seconds: number;
}
