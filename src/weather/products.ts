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

import { NationalWeatherService } from "./nws.js";

export class Products extends NationalWeatherService<Product | undefined> {
    constructor(
        private readonly typeId: string,
        private readonly locationId: string
    ) {
        super();
    }

    public override async get(): Promise<Product | undefined> {
        const product = await super.get();
        if (!product?.id) {
            return undefined;
        }
        return product;
    }

    protected get resource(): string {
        return `/products/types/${this.typeId}/locations/${this.locationId}/latest`;
    }
}

interface Product {
    id: string;
    wmoCollectiveID: string;
    issuingOffice: string;
    issuanceTime: string;
    productCode: string;
    productName: string;
    productText: string;
}
