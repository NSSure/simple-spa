import SPApplication from "../core/SPApplication";
import SPARouter from "../core/router/SPARouter";
import Route from "../core/router/Route";
import DefaultComponent from "./components/default.component";
import NavMenuComponent from "./components/nav-menu/nav-menu.component";
import IComponent from "../core/interfaces/IComponent";
import DashboardComponent from "./components/dashboard/dashboard.component";
import HelloWorldComponent from "./components/hello-world/hello-world.component";

let components: Array<IComponent> = [
    DefaultComponent,
    DashboardComponent,
    NavMenuComponent
]

let routes: Array<Route> = [
    {
        tagName: 'dashboard',
        displayUrl: '',
        component: DashboardComponent
    },
    {
        tagName: 'hello-world',
        displayUrl: '/hello-world',
        component: HelloWorldComponent
    }
];

let router = new SPARouter(routes);

SPApplication.init('spa-root', DefaultComponent, components, router);