export default class Route {
    constructor(name: string, displayUrl: string, component: any) {
        this.name = name;
        this.displayUrl = displayUrl;
        this.component = component;
    }

    name: string;
    displayUrl: string;
    component: any;
}