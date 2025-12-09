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

import { BasicWorker, cache, CopyResponse, GET, RouteTable } from "@adonix.org/cloud-spark";

export class PodcastProxy extends BasicWorker {
    private static readonly PODCAST_API_BASE = "https://podcast.adonix.org";
    private static readonly PROXY_PATH = "/proxy/podcast";

    public static readonly ROUTES: RouteTable = [
        [GET, `${PodcastProxy.PROXY_PATH}/*splat`, PodcastProxy],
    ];

    protected override init(): void {
        this.use(cache());
    }

    constructor(request: Request, env: Env, ctx: ExecutionContext) {
        const headers = new Headers(request.headers);
        headers.set("cf-access-client-id", env.PODCAST_CLIENT_ID);
        headers.set("cf-access-client-secret", env.PODCAST_CLIENT_SECRET);

        const source = new URL(request.url);
        const path = source.pathname.replace(PodcastProxy.PROXY_PATH, "");
        const target = new URL(path, PodcastProxy.PODCAST_API_BASE);
        super(new Request(target, { headers, method: request.method }), env, ctx);
    }

    protected override async get(): Promise<Response> {
        const response = await fetch(this.request);
        const copy = new CopyResponse(response);
        copy.headers.delete("set-cookie");
        return copy.response();
    }
}
