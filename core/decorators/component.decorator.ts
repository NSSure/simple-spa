export default function Component(tagName: string) {
    console.log('-- decorator factory invoked --');
    return function (constructor: Function) {
        console.log('-- decorator invoked --');
        constructor.prototype.tagName = tagName;
    }
}