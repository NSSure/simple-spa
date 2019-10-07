  
import IComponent from "../interfaces/IComponent";
import SPApplication from "../SPApplication";
import Debug from "../debug/Debug";

export default class BindingBase {
    component: IComponent;
    templateFragment: DocumentFragment;
    proxy: any;

    sourceTextNodes: any = {}; // Contains the source of the expressions.
    virtualTextNodes: any = {}; // Contains results of the process expressions.

    expressions: Array<any> = new Array();

    handler = {
        get(target: any, name: string) {
            return target[name];
        },
        set(target: any, name: string, value: any) {
            target[name] = value;
            SPApplication.currentBindingBase.updateOneWayBinding(name, value);
            return true;
        }
    }

    constructor(component: IComponent, templateFragment: DocumentFragment) {
        this.component = component;
        this.templateFragment = templateFragment;

        this.proxy = new Proxy(this.component, this.handler);
        this.component = this.proxy;
    }

    bootstrapBindings() {
        this.queryAttributes();
        this.queryTextNodes();
    }

    queryAttributes() {
        this.queryBindings();
        this.queryIterators();
        this.queryEvents();
        this.queryNavigationLinks();
    }

    queryBindings() {
        const bindableElements = this.templateFragment.querySelectorAll('[s-bind]');

        bindableElements.forEach((bindableElement: any) => {
            const bindableProperty = bindableElement.getAttribute('s-bind');

            let dotNotationComponents = bindableProperty.split('.');
            let defaultValue: any = undefined;

            dotNotationComponents.forEach((dotNotationComponent: string) => {
                if (defaultValue) {
                    defaultValue = defaultValue[dotNotationComponent];
                }
                else {
                    defaultValue = this.component[dotNotationComponent];
                }
            });

            if (defaultValue) {
                bindableElement.value = defaultValue;
            }

            bindableElement.onkeyup = () => this.updateOneWayBinding(bindableProperty, bindableElement.value);
        });
    }

    updateOneWayBinding(bindableProperty: string, value: any) {
        let dotNotationComponents = bindableProperty.split('.');
        let object: any = undefined;
        let accessor: string = undefined;

        /**
         * If we have a one way expresssion like so {{location.city}} we need to access this.proxy like so this.proxy['location']
         * and then use that reference access the city property by string.
         */
        dotNotationComponents.forEach((dotNotationComponent: string) => {
            if (object) {
                if (typeof object[dotNotationComponent] === 'object') {
                    object = object[dotNotationComponent];
                }
                else {
                    accessor = dotNotationComponent;
                }
            }
            else {
                object = this.proxy[dotNotationComponent];
            }
        });

        // Update any text node with the one way expression i.e {{location.city}}.
        let pendingExpressionUpdate = this.sourceTextNodes[bindableProperty].cloneNode(true);
        pendingExpressionUpdate.nodeValue = pendingExpressionUpdate.nodeValue.replace(/{{(.*?)}}/, value);
        this.virtualTextNodes[bindableProperty].nodeValue = pendingExpressionUpdate.nodeValue;

        if (typeof object === 'object') {
            // Update the component proxy property. The component might have a location object with city property so 'object' would be equal to 'location'
            // and the 'accessor' would a string of 'city'.
            object[accessor] = value;
        }
        // else {
        //     this.proxy[bindableProperty] = value;
        // }
    }

    queryIterators() {
        // console.log('[Querying iterators]');

        const iterableElements = this.templateFragment.querySelectorAll('[s-for]');

        if (iterableElements) {
            iterableElements.forEach((iterableElement: HTMLElement) => {
                // Remove the element that was used to define the s-for template with.
                const parentNode = iterableElement.parentNode;
                parentNode.removeChild(iterableElement);

                // Get the s-for attribute value.  This get the string is the following format ('item of items').
                const iterableProperty = iterableElement.getAttribute('s-for');
                const expression = iterableProperty.split(' in ');
                const iterableItem = expression[0].trim();
                const iterableBase = expression[1].trim();

                const virtualFragment = document.createDocumentFragment();

                this.component[iterableBase].forEach((item: any, index: number) => {
                    const element = iterableElement.cloneNode(true);

                    // TODO: Figure out how to integrate two way data binding here as well as with the query text nodes function.
                    const textWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
                    var textNode = null;

                    while (textNode = textWalker.nextNode()) {
                        if (textNode.nodeValue.trim()) {
                            const expression = textNode.nodeValue.trim();
                            const property = expression.substring(expression.lastIndexOf("{") + 1, expression.lastIndexOf("}}")).split('.')[1];
                            textNode.nodeValue = item[property];
                        }
                    }

                    virtualFragment.appendChild(element);
                });

                parentNode.appendChild(virtualFragment);
            });
        }
    }

    // TODO: This some how needs to communicate with the component instance created by the router.
    queryEvents() {
        // console.log('[Querying events]');

        const eventElements = this.templateFragment.querySelectorAll('[s-click]');

        eventElements.forEach((eventElement: HTMLElement) => {
            const clickProperty = eventElement.getAttribute('s-click');

            const parameter = clickProperty.substring(clickProperty.lastIndexOf("(") + 1, clickProperty.lastIndexOf(")"));
            const functionDeclaration = clickProperty.split('(')[0];

            eventElement.addEventListener('click', () => {
                // TODO: Figure out how to add this this[parameter] back into the line below.
                Function(this.component[functionDeclaration]());
            });
        });
    }

    queryTextNodes() {
        const textWalker = document.createTreeWalker(this.templateFragment, NodeFilter.SHOW_TEXT, null, false);

        var textNode = null;

        while (textNode = textWalker.nextNode()) {
            if (textNode.nodeValue.trim()) {
                const expression = textNode.nodeValue.trim();
                const oneWayBindingExpression = expression.substring(expression.lastIndexOf("{") + 1, expression.lastIndexOf("}}"));

                if (oneWayBindingExpression) {
                    // Keep a copy of the reference to the text node with the orignal expression (Hello, {{message}})).
                    this.sourceTextNodes[oneWayBindingExpression] = textNode.cloneNode(true);

                    let dotNotationComponents = oneWayBindingExpression.split('.');
                    let defaultValue: any = undefined;

                    this.expressions.push(oneWayBindingExpression);

                    dotNotationComponents.forEach((dotNotationComponent) => {
                        if (defaultValue) {
                            defaultValue = defaultValue[dotNotationComponent];
                        }
                        else {
                            defaultValue = this.component[dotNotationComponent];
                        }
                    });

                    textNode.nodeValue = textNode.nodeValue.replace(/{{(.*?)}}/, defaultValue);
                    this.virtualTextNodes[oneWayBindingExpression] = textNode;
                }
            }
        }

        // this.proxy.value = 'proxy value updated';
    }

    queryNavigationLinks() {
        let navigationLinks = this.templateFragment.querySelectorAll('[s-ref]');

        navigationLinks.forEach((navigationLink: HTMLElement) => {
            navigationLink.addEventListener('click', () => {
                const navigationState = navigationLink.getAttribute('s-ref');
                Debug.writeTrace(`Navigation ${navigationState}`);
                SPApplication.router.goByUrl(navigationState);
            });
        })
    }
}