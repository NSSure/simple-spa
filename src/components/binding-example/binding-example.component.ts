import SPAComponent from "../../../core/component/SPAComponent";

export default class BindingExampleComponent extends SPAComponent {
    constructor() {
        super();

        this.tagName = 'binding example';
        this.template = `Binding Example Component`;
    }
}