import Component from "../../../core/decorators/component.decorator";
import IComponent from "../../../core/interfaces/IComponent";

@Component({
    tagName: 'dashboard',
    template: '',
    templateUrl: './src/components/dashboard/dashboard.component.html'
})
export default class DashboardComponent implements IComponent {

}