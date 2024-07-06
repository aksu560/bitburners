export async function main(ns) {
    const flags = ns.flags([
        ['delay', 0],
        ['target', ''],
        ['payload', 'ping'],
        ['payload-args', ''],
        ['threads', 1]
    ]);

    ns

    if (!flags['target']) {
        ns.tprint('Please define a target!');
        return 1;
    }
    
    const payload_files = ns.ls(ns.getHostname(), flags['payload']);
    const main_file = 'aksu/jinx/payloads/' + flags['payload'] + '/' + flags['payload'] + '.js';
    const payload_args = flags['payload-args'];
    const threads = flags['threads'];
    const delay = flags['delay'];
    const target = flags['target'];

    if (payload_files.length == 0) {
        ns.tprintf('Could not find payload "' + flags['payload'] + '"');
        return 1;
    }

    ns.tprintf("Found %d files for payload %s", payload_files.length, flags['payload']);
    needle(ns, target, main_file, payload_files, payload_args, threads, delay);
}

export async function needle(ns, target, main_file, payload_files, payload_args, threads, delay) {
    ns.scp(payload_files, target);

    ns.scp('aksu/jinx/lib.js', target);

    if (delay > 0) {
        ns.printf('Waiting for %d seconds', delay);
        await ns.sleep(delay * 1000);
    }

    ns.exec(main_file, target, threads, payload_args);
    ns.print('Payload executed');
    return 0;
}