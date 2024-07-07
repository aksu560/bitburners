import { crawler } from "../crawler/crawler";
import { needle } from "../needle/needle";
import { plexer } from "../plexer/plexer";
import { parseConfig } from "./config-parse";

export async function main(ns) {
    
    const config = parseConfig(ns);

    if (!config) {
        return;
    }

    for (const index in config) {
        if (config[index].skip) {
            ns.print("Skipping step " + index);
            continue;
        }
        ns.print("Step " + index);
        const phase = config[index];
        const type = phase.type;
        const payload = phase.payload;
        const host = phase.host;
        const args = JSON.stringify(phase['payload-args']);
        const payload_files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);
        const main_file = 'aksu/jinx/payloads/' + payload + '/' + payload + '.js';
        const delay = phase.delay;
        const max_dep = phase.max_depth;
        const exclude = phase.exclude;

        let threads = phase.threads;


        if (type == "needle") {
            if (threads == "auto") {
                const remaining_ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
                threads = Math.floor(remaining_ram / ns.getScriptRam(main_file));
            }
            if (threads > 0) {
                await needle(ns, host, main_file, payload_files, args, threads, delay);
            }
        }
        if (type == "plexer") {
            await plexer(ns, host, main_file, payload_files, args, delay, max_dep, 0, host, [], exclude)
        }
        if (type == "crawler") {
            await crawler(ns, main_file, payload_files, args, threads, max_dep, 0, host, [], delay, exclude)
        }
    }

    ns.toast("Flow command successful!");

}