import IComponent from "../interfaces/IComponent";

export default class SPAComponent implements IComponent {
    [key: string]: any;
    message: string;
    tagName: string;
    template: string;
    templateUrl: string;

    onAppearing(): void {

    }

    onDisapparing(): void {

    }
}