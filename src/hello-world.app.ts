import SPApplication from "../core/SPApplication";
import SPARouter from "../core/router/SPARouter";
import Route from "../core/router/Route";
import HelloWorldComponent from "./components/hello-world/hello-world.component";
import BindingExampleComponent from "./components/binding-example/binding-example.component";

let routes: Array<Route> = [
    {
        name: 'hello-world',
        displayUrl: '',
        component: HelloWorldComponent
    },
    {
        name: 'binding-example',
        displayUrl: '/binding-example',
        component: BindingExampleComponent
    }
];

let router = new SPARouter(routes);

SPApplication.init('spa-root', router);