import { bfs, parsePayloadArgs } from "../../lib";
import { needle } from "../needle/needle";

export async function main(ns) {
    const flags = ns.flags([
        ['payload', 'ping'],
        ['payload-args', ''],
        ['max-depth', 0],
        ['delay', 50],
        ['exclude', ['home']],
        ['host', 'home']
    ]);

    const payload_files = ns.ls(ns.getHostname(), flags['payload']);
    const main_file = 'aksu/jinx/payloads/' + flags['payload'] + '/' + flags['payload'] + '.js';
    const payload_args = flags['payload-args'];
    const max_dep = flags['max-depth'];
    const delay = flags['delay'];
    const exclude = flags['exclude'];
    const host = flags['host'];

    await plexer(ns, host, main_file, payload_files, payload_args, delay, exclude)
}

export async function plexer(ns, host, main_file, payload_files, payload_args, delay, exclude) {
    const unvisited = bfs(ns, host).servers.filter(n => !exclude.includes(n)).filter(n => !(n == host));
    const args = parsePayloadArgs([payload_args]);
    let execs = [];

    for (const server of unvisited) {
        args.target = server;
        execs.push(await needle(ns, host, main_file, payload_files, JSON.stringify(args), 1, delay));
    }

    return execs;
}