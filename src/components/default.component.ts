import SPAComponent from "../../core/component/SPAComponent";
import Component from "../../core/decorators/component.decorator";

@Component('default')
export default class DefaultComponent extends SPAComponent {
    constructor() {
        super();
        this.templateUrl = './src/components/default.component.html';
    }
}