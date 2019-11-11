export default class Route {
    constructor(tagName: string, displayUrl: string, component: any) {
        this.tagName = tagName;
        this.displayUrl = displayUrl;
        this.component = component;
    }

    tagName: string;
    displayUrl: string;
    component: any;
}