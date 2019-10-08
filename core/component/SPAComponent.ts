import IComponent from "../interfaces/IComponent";

export default class SPAComponent implements IComponent {
    [key: string]: any;
    message: string;
    template: string;
    templateUrl: string;

    onAppearing(): void {

    }

    onDisapparing(): void {

    }
}