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

import { BaseRender } from "./base";

export class ProductsRender extends BaseRender {
    private static readonly SELECTOR = ".products";

    public render(): void {
        const products = this.parent.querySelector(ProductsRender.SELECTOR);
        if (!products) {
            throw new Error(
                `Element with query selector ${ProductsRender.SELECTOR} not found.`
            );
        }

        // Remove exisitng products on report refresh.
        products.replaceChildren();

        this.report.products.forEach((product) => {
            product.segments.forEach((segment) => {
                const div = document.createElement("div");
                div.classList.add("product");
                div.classList.add(product.product.productCode.toLowerCase());
                div.innerText = product.product.productName;

                const link = document.createElement("a");
                link.onclick = () =>
                    console.log([product.headline, segment.body].join("\n\n"));
                link.appendChild(div);
                products.appendChild(link);
            });
        });
    }
}
