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
                    const filePath = path.join(distDir, file);
                    const lastModified = new Date().toUTCString();

                    const hash = crypto
                        .createHash("md5")
                        .update(fs.readFileSync(filePath))
                        .digest("hex")
                        .slice(0, 12);
                    const etag = `\n  ETag: "${hash}"`;

                    return `/${file}
  Last-Modified: ${lastModified}${etag}`;
                })
                .join("\n\n");

            fs.writeFileSync(headersPath, headers);
            console.log(
                `_headers file created for ${files.length} HTML file(s)`
            );
        },
    };
}
