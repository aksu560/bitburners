import { parsePayloadArgs } from "../../lib";

export async function main(ns) {
    let args = ''
    if (ns.args.length > 0) {
        args = ns.args
    }
    let data = parsePayloadArgs(args);

    const target = data.target;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    
    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else {
            await ns.grow(target);
        }
    }
}
