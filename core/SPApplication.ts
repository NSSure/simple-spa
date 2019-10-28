import SPARouter from "./router/SPARouter";
import Debug from "./debug/Debug";
import BindingBase from "./binding/BindingBase";
import TemplateEngine from "./binding/TemplateEngine";
import IComponent from "./interfaces/IComponent";

export default class SPApplication {
    static root: HTMLElement;
    static router: SPARouter;
    static components: Array<any>;
    static defaultComponentInstance: any;
    static defaultBindingContext: BindingBase;
    static currentBindingContext: BindingBase;

    static init(root: string, defaultComponent: any, components: Array<IComponent>, router?: SPARouter): void {
        try {
            Debug.writeTrace(`Application initializing (root = ${root})`);

            SPApplication.root = document.getElementById(root);
            SPApplication.components = components;

            this.defaultComponentInstance = new defaultComponent();
            TemplateEngine.loadDefaultTemplate(this.defaultComponentInstance);
            
            if (router) {
                // TODO: Implement search for router-outlet element when using the router.
                // SPApplication.router = router;
                // SPApplication.router.bootstrap();
            }
        }
        catch(ex) {
            let errorNode = document.createElement('div');

            errorNode.innerHTML = 
            `
                <div style="color: white;">
                    <h1 style="color: #DA4B3E;">Compile Error</h1>
                    <div>
                        <span style="font-size: 1.50rem; color: #DA4B3E;">${ex}</span><br><br>
                        <span style="font-size: 1.25rem; color: #FFCD42;">${ex.stack}</span>
                    </div>
                </div>
            `;

            console.log(ex);

            errorNode.style.backgroundColor = '#282828';
            errorNode.style.color = '#DA4B3E';
            errorNode.style.position = 'absolute';
            errorNode.style.top = '0';
            errorNode.style.bottom = '0';
            errorNode.style.left = '0';
            errorNode.style.right = '0';
            errorNode.style.padding = '50px';

            document.body.appendChild(errorNode);
        }
    }
}