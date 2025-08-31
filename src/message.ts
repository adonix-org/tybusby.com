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

import { getElement } from "./elements";

type MessageType =
    | "success"
    | "tip"
    | "info"
    | "warning"
    | "error"
    | "critical"
    | "debug";

const emojis: Record<MessageType, string> = {
    success: "✅",
    tip: "💡",
    info: "ℹ️",
    warning: "⚠️",
    error: "⛔",
    critical: "🚨",
    debug: "🔧",
} as const;

export class Message {
    public element: HTMLDivElement;

    constructor(
        private readonly text: string,
        private readonly type: MessageType = "error",
        private readonly parent: ParentNode = document
    ) {
        this.element = this.createElement();
    }

    private createElement(): HTMLDivElement {
        const container = getElement(".messages", this.parent);

        const message = document.createElement("div");
        message.classList.add("message", this.type);

        const messageIcon = document.createElement("div");
        messageIcon.classList.add("message-icon");
        messageIcon.innerText = emojis[this.type];

        const messageType = document.createElement("div");
        messageType.classList.add("message-type");
        messageType.innerText = `${this.type}:`;

        const messageText = document.createElement("div");
        messageText.classList.add("message-text");
        messageText.innerHTML = this.text;

        const closeButton = document.createElement("button");
        closeButton.classList.add("message-close");
        closeButton.textContent = "✖️";
        closeButton.addEventListener("click", () => this.dismiss());

        message.append(messageIcon, messageType, messageText, closeButton);
        container.appendChild(message);

        return message;
    }

    public show(): void {
        this.element.style.display = "block";
    }

    public dismiss(): void {
        const container = this.element.parentElement;
        if (container) container.removeChild(this.element);
    }
}
