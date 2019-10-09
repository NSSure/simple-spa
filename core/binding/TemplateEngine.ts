import SPApplication from "../SPApplication";
import IComponent from "../interfaces/IComponent";
import Debug from "../debug/Debug";

export default class TemplateEngine {
    static loadDefaultTemplate(defaultComponentInstance: IComponent) {
        TemplateEngine.loadTemplate(defaultComponentInstance, (defaultComponentFragment) => {
            SPApplication.root.appendChild(defaultComponentFragment);
        });
    }

    static loadTemplate(componentInstance: IComponent, templateLoadedCallback: (templateFragment: DocumentFragment) => void): void {
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
                templateLoadedCallback(TemplateEngine.formatTemplate(componentInstance.template))
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
                            templateLoadedCallback(TemplateEngine.formatTemplate(xhttp.responseText));
                        }
                    }
                }
    
                xhttp.open('GET', url, true);
                xhttp.send();
            }
            else {
                Debug.writeError(`Component '${componentInstance.tagName}' does not have a template or templateUrl configured.`);
            }
        }
    }

    private static formatTemplate(templateContent: string): DocumentFragment {
        const componentRoot: HTMLElement = document.createElement('div');
        componentRoot.style.height = "100%";
        componentRoot.innerHTML = templateContent;

        let templateFragment: DocumentFragment = document.createDocumentFragment();
        templateFragment.appendChild(componentRoot);

        return templateFragment;
    }
}