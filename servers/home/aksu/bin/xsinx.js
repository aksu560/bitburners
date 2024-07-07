import { xsinx } from "../jinx/lib";

/** @param {NS} ns **/
export async function main(ns) {

    ns.tprintf(xsinx(ns));
    return 0;
}