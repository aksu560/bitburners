import { parsePayloadArg } from "../../lib";

export async function main(ns) {
    let args = ''
    if (ns.args > 0) {
        args = ns.args
    }
    let data = parsePayloadArg(args)
    ns.tprint(data);
    if (!data) {
        data = {};
    }

    let greeting = 'Hello from ';

    if (Object.keys(data).includes('greeting')) {
        greeting = data.greeting;
    }

    await ns.toast(greeting + ' ' + ns.getHostname());
    return 0;
}