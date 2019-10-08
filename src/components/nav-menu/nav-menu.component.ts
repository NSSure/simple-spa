import SPAComponent from "../../../core/component/SPAComponent";
import Component from "../../../core/decorators/component.decorator";

@Component('nav-menu')
export default class NavMenuComponent extends SPAComponent {
    constructor() {
        super();
        this.templateUrl = './src/components/nav-menu/nav-menu.component.html';
    }
}