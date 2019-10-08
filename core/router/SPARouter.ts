import Route from "./Route";
import Debug from "../debug/Debug";
import SPApplication from "../SPApplication";
import TemplateEngine from "../binding/TemplateEngine";

export default class SPARouter {
    routes: Array<Route> = new Array<Route>();
    currentRoute: Route = undefined;

    constructor(routes: Array<Route>) {
        if (routes) {
            this.routes = routes;

            window.onpopstate = function(event: PopStateEvent) {
                console.log("location: " + document.location.pathname + ", state: " + JSON.stringify(event.state));

                let path = document.location.pathname;

                if (path === '/') {
                    path = ''
                }

                SPApplication.router.goByUrl(path);
            };
        }
    }

    bootstrap(): void {
        Debug.writeTrace('Bootstrapping router.');

        let defaultRouteCount = this.routes.filter(x => x.displayUrl === '').length;

        if (defaultRouteCount === 0)
        {
            Debug.writeError('No default route configured.');
        }
        else if (defaultRouteCount > 1) {
            Debug.writeError('More than one default route configured.');
        }
        else
        {
            let defaultRoute: Route = this.routes.find(x => x.displayUrl === '');

            // let component = new defaultRoute.component();
            // SPApplication.root.innerHTML = component.template;

            TemplateEngine.loadTemplate(new defaultRoute.component());
            this.finalizeRoutingChange(defaultRoute, null);
        }
    }

    goByName = (name: string, params?: any) => {
        this.initializeRoutingChange('name', name, params);
    }

    goByUrl = (url: string, params?: any) => {
        this.initializeRoutingChange('displayUrl', url, params)
    }

    initializeRoutingChange(property: string, value: any, params: string) {
        // If we find the route here we have a top level route and need to change the application root html.
        let route = this.routes.find((x: any) => x[property] === value);

        if (route) {
            TemplateEngine.loadTemplate(new route.component());
            this.finalizeRoutingChange(route, null);
        }
    }

    finalizeRoutingChange(route: Route, params: any) {
        if (params) {
            for (let property in params) {
                route.displayUrl = route.displayUrl.replace(`:${property}`, params[property]);
            }
        }

        this.currentRoute = route;

        // Title is currently ignored by Firefox. Need to figure out how we want to set title.
        history.pushState({}, '', route.displayUrl);
    }
}