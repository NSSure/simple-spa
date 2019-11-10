
import IComponent from "../interfaces/IComponent";
import SPApplication from "../SPApplication";
import Debug from "../debug/Debug";
import TemplateEngine from "./TemplateEngine";

export default class BindingBase {
    public templateFragment: DocumentFragment;

    private component: IComponent;
    private proxy: any;

    private sourceTextNodes: any = {}; // Contains the source of the expressions.
    private virtualTextNodes: any = {}; // Contains results of the process expressions.

    private expressions: Array<any> = new Array();

    private expressionTokenRegex: RegExp = /{{(.*?)}}/;

    private children: Array<BindingBase> = new Array();

    handler = {
        get(target: any, name: string) {
            return target[name];
        },
        set(target: any, name: string, value: any) {
            target[name] = value;
            SPApplication.currentBindingContext.updateOneWayBinding(name, value);
            return true;
        }
    }

    constructor(component: any, componentHTMLSlot: HTMLElement, content?: string) {
        this.component = component;

        this.proxy = new Proxy(this.component, this.handler);
        this.component = this.proxy;

        if (!content) {
            // Load the template for this binding context.
            TemplateEngine.loadTemplate(component, (content: string) => {
                try {
                    this.templateFragment = TemplateEngine.formatTemplate(content);
                    this.bootstrapBindings();
                    componentHTMLSlot.parentNode.replaceChild(this.templateFragment, componentHTMLSlot);
                }
                catch (ex) {
                    throw ex;
                }
            });
        }
        else {
            this.templateFragment = TemplateEngine.formatTemplate(content);
            this.bootstrapBindings();
            componentHTMLSlot.parentNode.replaceChild(this.templateFragment, componentHTMLSlot);
        }
    }

    bootstrapBindings() {
        this.queryComponents();
        this.queryBindings();
        this.queryIterators();
        this.queryEvents();
        this.queryNavigationLinks();
        this.queryTextNodes();
    }

    private queryComponents() {
        SPApplication.components.forEach((component) => {
            if (this.component.tagName !== component.prototype.tagName) {
                let componentTags = this.templateFragment.querySelectorAll(component.prototype.tagName);

                if (componentTags.length > 0) {
                    for (let i = 0; i < componentTags.length; i++) {
                        let componentHTMLSlot: HTMLElement = componentTags[i];

                        // If we find a registered component in the current template fragment for the binding context we need to initialize that component and it to the DOM.
                        if (componentHTMLSlot) {
                            let componentInstance = new component();
                            this.children.push(new BindingBase(componentInstance, componentHTMLSlot));
                        }
                    }
                }
            }
        });
    }

    private queryBindings() {
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

    private queryIterators() {
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
    private queryEvents() {
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

    private queryTextNodes() {
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

                    textNode.nodeValue = textNode.nodeValue.replace(this.expressionTokenRegex, defaultValue);
                    this.virtualTextNodes[oneWayBindingExpression] = textNode;
                }
            }
        }

        // this.proxy.value = 'proxy value updated';
    }

    private queryNavigationLinks() {
        let navigationLinks = this.templateFragment.querySelectorAll('[s-ref]');

        navigationLinks.forEach((navigationLink: HTMLElement) => {
            navigationLink.addEventListener('click', () => {
                const navigationState = navigationLink.getAttribute('s-ref');
                Debug.writeTrace(`Navigation ${navigationState}`);
                SPApplication.router.goByUrl(navigationState);
            });
        })
    }

    private updateOneWayBinding(bindableProperty: string, value: any) {
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
        pendingExpressionUpdate.nodeValue = pendingExpressionUpdate.nodeValue.replace(this.expressionTokenRegex, value);
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
}