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
    private readonly dialog: HTMLDialogElement;
    private readonly dialogText: HTMLDivElement;
    private readonly dialogTitle: HTMLSpanElement;

    constructor() {
        this.dialog = this.getElement(".product-dialog", HTMLDialogElement);
        this.dialog.addEventListener("click", (event) => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });

        const closeButton = this.getElement(
            ".close-button",
            HTMLButtonElement,
            this.dialog
        );
        closeButton.addEventListener("click", () => this.dialog.close());

        this.dialogTitle = this.getElement(
            ".dialog-title",
            HTMLSpanElement,
            this.dialog
        );

        this.dialogText = this.getElement(
            ".product-text",
            HTMLDivElement,
            this.dialog
        );
    }

    public getElement<T extends Element>(
        selector: string,
        type: { new (): T },
        parent: ParentNode = document
    ): T {
        const element = parent.querySelector(selector);
        if (!element || !(element instanceof type)) {
            throw new Error(
                `${type.name} element with query selector "${selector}" not found.`
            );
        }
        return element;
    }

    public show(title: string, text: string): void {
        // Normalize the end of every display string.
        this.dialogText.textContent = text.replace(/\n*$/, "\n\n");
        this.dialogTitle.textContent = title;

        if (!this.dialog.open) {
            this.dialog.showModal();
        }

        requestAnimationFrame(() => {
            this.dialogText.scrollTop = 0;
            this.dialogText.focus();
        });
    }

    public hide(): void {
        this.dialog.close();
    }
}

export const productDialog = new ProductDialog();
