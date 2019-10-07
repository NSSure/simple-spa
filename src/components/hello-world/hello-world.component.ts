import SPAComponent from "../../../core/component/SPAComponent";

export default class HelloWorldComponent extends SPAComponent {
    recipient: string = 'World';
    message: string = 'Welcome to the SPA demo project.';
    counter: number = 0;

    items: Array<any> = [
        { name: 'Item #1', description: 'The first item in the list.' },
        { name: 'Item #2', description: 'The first item in the list.' }
    ]

    constructor() {
        super();

        this.tagName = 'hello-world';
        this.templateUrl = './src/components/hello-world/hello-world.component.html';
    }

    incrementCounter() {
        this.counter++;
    }

    itemClicked(item: any) {
        console.log(item);
    }
}