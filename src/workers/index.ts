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

import { BasicWorker, StatusCodes } from "@adonix.org/cloud-spark";

class Intercept extends BasicWorker {
    protected override async get(): Promise<Response> {
        const response = await this.env.ASSETS.fetch(this.request);

        if (response.status === StatusCodes.NOT_FOUND) {
            return this.env.ASSETS.fetch(
                new URL("/404.html", this.request.url)
            );
        }

        return response;
    }
}

export default Intercept.ignite();
