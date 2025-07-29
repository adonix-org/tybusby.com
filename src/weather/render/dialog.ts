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

    constructor() {
        this.dialog = document.createElement("dialog");
        this.dialog.classList.add("product-dialog");

        const closeButton = document.createElement("button");
        closeButton.textContent = "CLOSE";
        closeButton.className = "close-button";
        closeButton.addEventListener("click", () => this.dialog.close());

        const dialogContentDiv = document.createElement("div");
        dialogContentDiv.className = "dialog-content";

        this.productTextDiv = document.createElement("div");
        this.productTextDiv.className = "product-text";

        dialogContentDiv.appendChild(closeButton);
        dialogContentDiv.appendChild(this.productTextDiv);

        const bottomFadeDiv = document.createElement("div");
        bottomFadeDiv.classList.add("bottom-fade");

        this.dialog.append(dialogContentDiv);
        this.dialog.append(bottomFadeDiv);
        
        document.body.appendChild(this.dialog);

        // Optional: click outside to close
        this.dialog.addEventListener("click", (event) => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });
    }

    public show(text: string) {
        this.productTextDiv.textContent = text;

        requestAnimationFrame(() => {
            this.productTextDiv.scrollTop = 0;
        });

        if (!this.dialog.open) {
            this.dialog.showModal();
        }
    }

    public hide() {
        this.dialog.close();
    }
}

export const productDialog = new ProductDialog();
