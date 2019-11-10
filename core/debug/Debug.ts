export default class Debug {
    static writeTrace(msg: string) {
        console.log(`[SPA Trace]: ${msg}`);
    }

    static writeError(msg: string) {
        console.error(`[SPA Error]: ${msg}`);
        throw new Error(msg);
    }
}