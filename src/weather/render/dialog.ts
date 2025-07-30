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

class ProductDialog {
    private dialog: HTMLDialogElement;
    private productTextDiv: HTMLDivElement;
    private dialogTitleSpan: HTMLSpanElement;

    constructor() {
        this.dialog = document.createElement("dialog");
        this.dialog.classList.add("product-dialog");

        // Close Button
        const closeButton = document.createElement("button");
        closeButton.className = "close-button";
        closeButton.addEventListener("click", () => this.dialog.close());
        closeButton.tabIndex = 0;

        // Close Button Title and X to close.
        this.dialogTitleSpan = document.createElement("span");
        this.dialogTitleSpan.classList.add("dialog-title");
        const closeIconSpan = document.createElement("span");
        closeIconSpan.classList.add("close-icon");
        closeIconSpan.textContent = "✖️";

        closeButton.appendChild(this.dialogTitleSpan);
        closeButton.appendChild(closeIconSpan);

        // Dialog Content
        const dialogContentDiv = document.createElement("div");
        dialogContentDiv.className = "dialog-content";

        this.productTextDiv = document.createElement("div");
        this.productTextDiv.className = "product-text";
        this.productTextDiv.tabIndex = 0;

        dialogContentDiv.appendChild(closeButton);
        dialogContentDiv.appendChild(this.productTextDiv);

        // Bottom Fade
        const bottomFadeDiv = document.createElement("div");
        bottomFadeDiv.classList.add("bottom-fade");

        this.dialog.append(dialogContentDiv);
        this.dialog.append(bottomFadeDiv);

        // Append Dialog
        document.body.appendChild(this.dialog);

        this.dialog.addEventListener("click", (event) => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });
    }

    public show(title: string, text: string): void {
        // Normalize the end of every display string.
        this.productTextDiv.textContent = text.replace(/\n*$/, "\n\n");
        this.dialogTitleSpan.textContent = title;

        if (!this.dialog.open) {
            this.dialog.showModal();
        }

        requestAnimationFrame(() => {
            this.productTextDiv.scrollTop = 0;
            this.productTextDiv.focus();
        });
    }

    public hide(): void {
        this.dialog.close();
    }
}

export const productDialog = new ProductDialog();
