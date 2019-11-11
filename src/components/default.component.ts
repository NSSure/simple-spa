import Component from "../../core/decorators/component.decorator";
import ILifeCycle from "../../core/interfaces/ILifeCycle";
import IComponent from "../../core/interfaces/IComponent";

@Component({
    tagName: 'default',
    template: '',
    templateUrl: './src/components/default.component.html'
})
export default class DefaultComponent implements IComponent, ILifeCycle {
    message: string = 'This is a test message from within the default component! It is visible across all routes. Expressions are denoted by the double curly brace syntax';

    onAppearing(): void {
        
    }    
    
    onDisappearing(): void {
        
    }
}