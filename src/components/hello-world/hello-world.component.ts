import Component from "../../../core/decorators/component.decorator";
import IComponent from "../../../core/interfaces/IComponent";

@Component({
    tagName: 'hello-world',
    template: '',
    templateUrl: './src/components/hello-world/hello-world.component.html'
})
export default class HelloWorldComponent implements IComponent {
    recipient: string = 'World';
    message: string = 'Welcome to the SPA demo project.';
    counter: number = 0;

    items: Array<any> = [
        { name: 'Item #1', description: 'The first item in the list.' },
        { name: 'Item #2', description: 'The first item in the list.' }
    ];

    incrementCounter() {
        this.counter++;
    }

    itemClicked(item: any) {
        console.log(item);
    }
}