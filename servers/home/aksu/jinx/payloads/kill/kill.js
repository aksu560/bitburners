// Kills every process on server

import { parsePayloadArgs } from "../../lib";
export async function main(ns) {
    let args = ''
    if (ns.args.length > 0) {
        args = ns.args
    }
    const target = parsePayloadArgs(args).target;
   
    ns.killall(target);
    return true;
}