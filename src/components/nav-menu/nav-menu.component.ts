import Component from "../../../core/decorators/component.decorator";
import IComponent from "../../../core/interfaces/IComponent";

@Component({
    tagName: 'nav-menu',
    template: '',
    templateUrl: './src/components/nav-menu/nav-menu.component.html'
})
export default class NavMenuComponent implements IComponent {

}