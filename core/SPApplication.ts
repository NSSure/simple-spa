import SPARouter from "./router/SPARouter";
import Debug from "./debug/Debug";
import BindingBase from "./binding/BindingBase";
import TemplateEngine from "./binding/TemplateEngine";
import IComponent from "./interfaces/IComponent";

export default class SPApplication {
    static root: HTMLElement;
    static router: SPARouter;
    static components: Array<IComponent>;
    static currentBindingBase: BindingBase;

    static init(root: string, defaultComponent: any, components: Array<IComponent>, router?: SPARouter): void {
        Debug.writeTrace(`Application initializing (root = ${root})`);

        SPApplication.root = document.getElementById(root);

        SPApplication.components = components;

        console.log(SPApplication.components);

        TemplateEngine.loadTemplate(new defaultComponent());
        
        if (router) {
            SPApplication.router = router;
            // SPApplication.router.bootstrap();
        }
    }
}