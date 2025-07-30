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

import { getElementById } from "../../elements";

export class Template {
    public static createElement(templateId: string): Element {
        const template = getElementById(templateId, HTMLTemplateElement);
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        if (!fragment.firstElementChild) {
            throw new Error(
                `Template with ID "${templateId}" missing root child.`
            );
        }
        return fragment.firstElementChild;
    }
}
