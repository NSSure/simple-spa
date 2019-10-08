import SPAComponent from "../../../core/component/SPAComponent";
import Component from "../../../core/decorators/component.decorator";

@Component('binding-example')
export default class BindingExampleComponent extends SPAComponent {
    constructor() {
        super();
        this.template = `Binding Example Component`;
    }
}