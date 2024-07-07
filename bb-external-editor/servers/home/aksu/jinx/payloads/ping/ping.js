import { parsePayloadArgs } from "../../lib";

export async function main(ns) {
    let data = parsePayloadArgs(ns.args)
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