export default class Debug {
    static writeTrace(msg: String) {
        console.log(`[SPA Trace]: ${msg}`);
    }

    static writeError(msg: String) {
        console.error(`[SPA Error]: ${msg}`);
    }
}