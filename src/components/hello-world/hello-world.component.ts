import SPAComponent from "../../../core/component/SPAComponent";

export default class HelloWorldComponent extends SPAComponent {
    recipient: string = 'World';
    message: string = 'Welcome to the SPA demo project.';
    counter: number = 0;

    constructor() {
        super();

        this.tagName = 'hello-world';
        this.templateUrl = './src/components/hello-world/hello-world.component.html';
    }

    fire() {
        this.counter++;
    }
}