import Route from "../router/Route";
import SPApplication from "../SPApplication";
import BindingBase from "./BindingBase";
import IComponent from "../interfaces/IComponent";
import Debug from "../debug/Debug";

export default class TemplateEngine {
    static loadRootTemplate(route: Route, params: any) {
        this.fetchTemplate(route, params, true);
    }

    static loadChildTemplate(route: Route, params: any) {
        this.fetchTemplate(route, params, false);
    }

    static fetchTemplate(route: Route, params: any, isRootRoute: boolean) {
        // Create an instance of the component associated with the route.
        const routeComponent = route.component;
        const componentInstance = new routeComponent();

        Debug.writeTrace(`Fetching template for '${componentInstance.tagName}' component.`);

        if (componentInstance.template && componentInstance.templateUrl) {
            Debug.writeError(`Component '${componentInstance.tagName}' cannot defined both a template and templateUrl.`);
        }
        else if (componentInstance.template) {
            // Loading template content directly.
            TemplateEngine.procecssTemplate(route, params, componentInstance, componentInstance.template);
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
                        TemplateEngine.procecssTemplate(route, params, componentInstance, xhttp.responseText);
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

    static procecssTemplate(route: Route, params: any, componentInstance: IComponent, templateContent: string) {
        // TODO: Make sure this the proper way to clear out the component template from the router root.
        console.log(SPApplication.root);

        SPApplication.root.innerHTML = "";

        const componentRoot: HTMLElement = document.createElement('div');
        componentRoot.style.height = "100%";
        componentRoot.innerHTML = templateContent;

        let templateFragment: DocumentFragment = document.createDocumentFragment();
        templateFragment.appendChild(componentRoot);
        
        let routerOutlet = templateFragment.querySelector("#router-outlet");

        SPApplication.currentBindingBase = new BindingBase(componentInstance, templateFragment);
        SPApplication.currentBindingBase.bootstrapBindings();

        // Add the processed template html to the routers root element.
        SPApplication.root.appendChild(templateFragment);

        // Once the template is rendered on the page fire the lifecycle event 'onAppearing'.
        if (typeof componentInstance.onAppearing == 'function') {
            componentInstance.onAppearing();
        }

        // TODO: Maybe move this back into the SPARouter class.
        SPApplication.router.finalizeRoutingChange(route, params);
    }
}