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

import path from "path";
import fs from "fs";
import crypto from "crypto";

import type { ResolvedConfig } from "vite";

export function generateHeaders() {
    let projectRoot: string;
    let outDir: string;

    return {
        name: "vite-generate-headers",

        // Capture Vite config once resolved
        configResolved(resolvedConfig: ResolvedConfig) {
            projectRoot = resolvedConfig.root;
            outDir = resolvedConfig.build.outDir;
        },

        // Run after build
        closeBundle() {
            if (!projectRoot || !outDir) {
                console.warn(
                    "Project root or outDir not set, skipping _headers generation."
                );
                return;
            }

            const distDir = path.resolve(projectRoot, outDir); // absolute path to build folder
            const headersPath = path.join(distDir, "_headers");

            // Get all HTML files (non-recursive; can be extended)
            const files = fs
                .readdirSync(distDir)
                .filter((f) => f.endsWith(".html"));

            const headers = files
                .map((file) => {
                    const filePath = `/${file}`;
                    const noExtPath = `/${file.replace(/\.html$/, "")}`;

                    const content = fs.readFileSync(path.join(distDir, file));
                    const hash = crypto
                        .createHash("sha1")
                        .update(content)
                        .digest("hex");
                    const etag = `"${hash}"`;

                    const paths = [filePath, noExtPath];
                    if (file === "index.html") {
                        paths.push(`/`);
                    }

                    return paths
                        .map((p) => `${p}\n  ETag: ${etag}`)
                        .join("\n\n");
                })
                .join("\n\n");

            fs.writeFileSync(headersPath, headers);
            console.log(
                `_headers file created for ${files.length} HTML file(s)`
            );
        },
    };
}
