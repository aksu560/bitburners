import { howManyPortsCanOpen, parsePayloadArgs } from "../../lib";

export async function main(ns) {
    let args = ''
    if (ns.args.length > 0) {
        args = ns.args
    }
    let data = parsePayloadArgs(args);
    try { ns.brutessh(data.target); } catch {}
    try { ns.httpworm(data.target); } catch {}
    try { ns.relaysmtp(data.target); } catch {}
    try { ns.sqlinject(data.target); } catch {}
    try { ns.ftpcrack(data.target); } catch {}

    if (ns.getServerNumPortsRequired(data.target) <= howManyPortsCanOpen(ns)) {
        ns.nuke(data.target);
    }
    return true;
}