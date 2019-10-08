import SPApplication from "../core/SPApplication";
import SPARouter from "../core/router/SPARouter";
import Route from "../core/router/Route";
import BindingExampleComponent from "./components/binding-example/binding-example.component";
import DefaultComponent from "./components/default.component";
import NavMenuComponent from "./components/nav-menu/nav-menu.component";
import IComponent from "../core/interfaces/IComponent";

let components: Array<IComponent> = [
    DefaultComponent,
    BindingExampleComponent,
    NavMenuComponent
]

let routes: Array<Route> = [
    {
        name: 'default',
        displayUrl: '',
        component: DefaultComponent
    },
    {
        name: 'binding-example',
        displayUrl: '/binding-example',
        component: BindingExampleComponent
    }
];

let router = new SPARouter(routes);

SPApplication.init('spa-root', DefaultComponent, components, router);