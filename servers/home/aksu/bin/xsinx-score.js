import { calculate_xsinx } from "../jinx/lib";

/** @param {NS} ns **/
export async function main(ns) {

    ns.tprintf(calculate_xsinx(ns, ns.args[0]));
    return 0;
}