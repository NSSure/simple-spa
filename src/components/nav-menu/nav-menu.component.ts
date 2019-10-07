import SPAComponent from "../../../core/component/SPAComponent";

export default class NavMenuComponent extends SPAComponent {
    constructor() {
        super();

        this.tagName = 'nav-menu';
        this.template = 
        `
            <ul>
                <li><a>Home</a></li>
                <li><a>List</a></li>
            </ul>
        `;
    }
}