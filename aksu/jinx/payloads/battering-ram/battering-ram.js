import { parsePayloadArgs } from "../../lib";

export async function main(ns) {
    let args = ''
    if (ns.args.length > 0) {
        args = ns.args
    }
    let data = parsePayloadArgs(args);

    // Uncomment these as you get them
    //ns.brutessh(data.target);
    //ns.ftpcrack(data.target);
    // ns.httpworm(data.target);
    // ns.relaysmtp(data.target);
    // ns.sqlinject(data.target);

    // This is how many ports you can open at this point in the game.
    // Increase this value when you unlock more programs
    const PORT_COUNT = 0
    if (ns.getServerNumPortsRequired(data.target) <= PORT_COUNT && 
        ns.getServerRequiredHackingLevel(data.target) <= ns.getHackingLevel()
    )
    ns.nuke(data.target);
    return 0;
}