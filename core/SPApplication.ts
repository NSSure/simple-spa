import SPARouter from "./router/SPARouter";
import Debug from "./debug/Debug";
import BindingBase from "./binding/BindingBase";

export default class SPApplication {
    static root: HTMLElement;
    static router: SPARouter;
    static currentBindingBase: BindingBase;

    static init(root: string, router: SPARouter): void {
        Debug.writeTrace(`Application initializing (root = ${root})`);

        SPApplication.root = document.getElementById(root);
        SPApplication.router = router;
        SPApplication.router.bootstrap();
    }
}