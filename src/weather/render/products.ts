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

import { ProductSegment, SegmentedProduct } from "@adonix.org/nws-report";
import { BaseRender } from "./base";
import { productDialog } from "./dialog";

export class ProductsRender extends BaseRender {
    private static readonly SELECTOR = ".products";

    public render(): void {
        const products = this.parent.querySelector(ProductsRender.SELECTOR);
        if (!products) {
            throw new Error(
                `Element with query selector ${ProductsRender.SELECTOR} not found.`
            );
        }

        // Remove existing products on report refresh.
        products.replaceChildren();

        this.report.products.forEach((segmented) => {
            const segments = this.getDisplaySegments(segmented);
            segments.forEach((segment) => {
                const div = document.createElement("div");
                div.classList.add("product");
                div.classList.add(segmented.product.productCode.toLowerCase());
                div.innerText = segmented.product.productName;

                const link = document.createElement("a");
                link.addEventListener("click", () => {
                    productDialog.show(
                        segmented.product.productName,
                        [segmented.headline, segment.body].join("\n\n")
                    );
                    console.log(
                        [segmented.headline, segment.body].join("\n\n")
                    );
                });
                link.appendChild(div);
                products.appendChild(link);
            });
        });
    }

    protected getDisplaySegments(
        segmented: SegmentedProduct
    ): ProductSegment[] {
        // Hazardous Weather Outlook
        if (segmented.product.productCode === "HWO") {
            return segmented.segments.filter(this.hwoFilter);
        }
        return segmented.segments;
    }

    protected hwoFilter(segment: ProductSegment): boolean {
        const noHazardRegex = /no hazardous weather is expected at this time/i;
        const dayOneRegex = /\.DAY[\s\S]*?(?=\.DAY|\Z)/;
        const match = segment.body.match(dayOneRegex);

        if (!match) {
            return true;
        }
        return !noHazardRegex.test(match[0]);
    }
}
