export class Template {
    public static createElement(templateId: string): Element {
        const template = document.getElementById(
            templateId
        ) as HTMLTemplateElement;
        if (!template) {
            throw new Error(`Template with ID "${templateId}" not found.`);
        }

        const fragment = template.content.cloneNode(true) as DocumentFragment;
        if (!fragment.firstElementChild) {
            throw new Error(
                `Template with ID "${templateId}" missing root child.`
            );
        }
        return fragment.firstElementChild;
    }
}
