// Kills every process on server, and removes the aksu folder
// Use git to store this :)

import { parsePayloadArgs } from "../../lib";
export async function main(ns) {
    let args = ''
    if (ns.args.length > 0) {
        args = ns.args
    }
    const target = parsePayloadArgs(args).target;
   
    ns.killall(target);

    const files = ns.ls(target, 'aksu');

    for (const i in files) {
        const file = files[i];
        ns.rm(file, target);
    }
    return true;
}