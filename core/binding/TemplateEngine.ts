import SPApplication from "../SPApplication";
import IComponent from "../interfaces/IComponent";
import Debug from "../debug/Debug";
import BindingBase from "./BindingBase";

export default class TemplateEngine {
    static loadDefaultTemplate(defaultComponentInstance: IComponent) {
        TemplateEngine.loadTemplate(defaultComponentInstance, (content) => {
            SPApplication.defaultBindingContext = new BindingBase(defaultComponentInstance, SPApplication.root, content);
        });
    }

    static loadTemplate(componentInstance: any, templateLoadedCallback: (content: string) => void): void {
        if (!componentInstance) {
            Debug.writeError(`Cannot load undefined or null component instance.`);
        }
        else {
            Debug.writeTrace(`Fetching template for '${componentInstance.tagName}' component.`);

            if (componentInstance.template && componentInstance.templateUrl) {
                Debug.writeError(`Component '${componentInstance.tagName}' cannot defined both a template and templateUrl.`);
            }
            else if (componentInstance.template) {
                // Loading template content directly.
                templateLoadedCallback(componentInstance.template)
            }
            else if (componentInstance.templateUrl) {
                // Loading template through external template url.
                var url = componentInstance.templateUrl;
                var xhttp = new XMLHttpRequest();
                var loaded = false;

                xhttp.onreadystatechange = () => {
                    if (xhttp.readyState === 4 && xhttp.status === 200) {
                        if (!loaded) {
                            loaded = true;
                            templateLoadedCallback(xhttp.responseText);
                        }
                    }
                }
    
                xhttp.open('GET', url, true);
                xhttp.send();
            }
            else {
                let errorMsg = `Component '${componentInstance.tagName}' does not have a template or templateUrl configured.`;
                Debug.writeError(errorMsg);
                throw new Error(errorMsg)
            }
        }
    }

    public static formatTemplate(templateContent: string): DocumentFragment {
        const componentRoot: HTMLElement = document.createElement('div');
        componentRoot.style.height = "100%";
        componentRoot.innerHTML = templateContent;

        let templateFragment: DocumentFragment = document.createDocumentFragment();
        templateFragment.appendChild(componentRoot);

        return templateFragment;
    }
}