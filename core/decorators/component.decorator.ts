import IComponentConfig from "../interfaces/IComponentConfig";

// export default function Component(tagName: string) {
//     return function (constructor: Function) {
//         constructor.prototype.tagName = tagName;
//     }
// }

export default function Component(config: IComponentConfig) {
    return function (constructor: Function) {
        constructor.prototype.tagName = config.tagName;
        constructor.prototype.template = config.template;
        constructor.prototype.templateUrl = config.templateUrl;
    }
}