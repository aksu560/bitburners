import { parsePayloadArgs } from "../../lib";

export async function main(ns) {
    let args = ''
    if (ns.args.length > 0) {
        args = ns.args
    }
    let data = parsePayloadArgs(args);
    let port_count = 0;

    if (ns.ls('home', 'BruteSSH.exe').length > 0) {
        port_count ++;
        ns.brutessh(data.target);
    }

    if (ns.ls('home', 'FTPCrack.exe').length > 0) {
        port_count ++;
        ns.ftpcrack(data.target);
    }

    if (ns.ls('home', 'relaySMTP.exe').length > 0) {
        port_count ++;
        ns.httpworm(data.target);
    }

    if (ns.ls('home', 'HTTPWorm.exe').length > 0) {
        port_count ++;
        ns.relaysmtp(data.target);
    }

    if (ns.ls('home', 'SQLInject.exe').length > 0) {
        port_count ++;
        ns.sqlinject(data.target);
    }

    if (ns.getServerNumPortsRequired(data.target) <= port_count && 
        ns.getServerRequiredHackingLevel(data.target) <= ns.getHackingLevel()
    )
    ns.nuke(data.target);
    return true;
}