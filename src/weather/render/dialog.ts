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

import { getElement } from "../../elements";

class ProductDialog {
    private readonly dialog: HTMLDialogElement;
    private readonly dialogTitle: Element;
    private readonly dialogText: HTMLElement;

    constructor() {
        this.dialog = getElement(
            ".product-dialog",
            document,
            HTMLDialogElement
        );

        // Close the dialog on click anywhere on the backdrop.
        // The dialog content intercepts all clicks on the
        // dialog itself.
        this.dialog.addEventListener("click", (event) => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });

        const closeButton = getElement(
            ".close-button",
            this.dialog,
            HTMLButtonElement
        );
        closeButton.addEventListener("click", () => this.dialog.close());

        this.dialogTitle = getElement(".dialog-title", this.dialog);
        this.dialogText = getElement(".product-text", this.dialog, HTMLElement);
    }

    public show(title: string, text: string): void {
        // Normalize the end of every display string.
        this.dialogText.innerHTML = this.linkify(text.replace(/\n*$/, "\n\n"));
        this.dialogTitle.textContent = title;

        if (!this.dialog.open) {
            this.dialog.showModal();
        }

        requestAnimationFrame(() => {
            this.dialogText.scrollTop = 0;
            this.dialogText.focus();
        });
    }

    private linkify(text: string): string {
        const regex = /(?:www\.)?weather\.gov\/[^\s.,;:!?")]+/gi;
        return text.replace(regex, (match) => {
            const href = `https://${match}`;
            return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
        });
    }

    public hide(): void {
        this.dialog.close();
    }
}

export const productDialog = new ProductDialog();
