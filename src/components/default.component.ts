import Component from "../../core/decorators/component.decorator";
import ILifeCycle from "../../core/interfaces/ILifeCycle";
import IComponent from "../../core/interfaces/IComponent";

@Component({
    tagName: 'default',
    template: '',
    templateUrl: './src/components/default.component.html'
})
export default class DefaultComponent implements IComponent, ILifeCycle {
    message: string = 'Test Message';

    onAppearing(): void {
        
    }    
    
    onDisappearing(): void {
        
    }
}