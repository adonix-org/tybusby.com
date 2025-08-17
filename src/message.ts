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

type MessageType = "success" | "tip" | "info" | "warning" | "error" | "debug";

const emojis: Record<MessageType, string> = {
    success: "✅",
    tip: "💡",
    info: "ℹ️",
    warning: "⚠️",
    error: "⛔",
    debug: "🔧",
} as const;

export class Message {
    constructor(
        text: string,
        type: MessageType = "error",
        parent: ParentNode = document
    ) {
        const element = getElement(".messages", parent);

        const message = document.createElement("div");
        message.classList.add("message");
        message.classList.add(type);

        const messageIcon = document.createElement("div");
        messageIcon.classList.add("message-icon");
        messageIcon.innerText = emojis[type];

        const messageType = document.createElement("div");
        messageType.classList.add("message-type");
        messageType.innerText = `${type}:`;

        const messageText = document.createElement("div");
        messageText.classList.add("message-text");
        messageText.innerText = text;

        const closeButton = document.createElement("button");
        closeButton.classList.add("message-close");
        closeButton.textContent = "✖️";
        closeButton.addEventListener("click", () => {
            element.removeChild(message);
        });

        message.appendChild(messageIcon);
        message.appendChild(messageType);
        message.appendChild(messageText);
        message.appendChild(closeButton);
        element.appendChild(message);
    }
}
