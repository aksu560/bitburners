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

    if (payload_files.length == 0) {
        ns.tprintf('Could not find payload "' + flags['payload'] + '"');
        return 1;
    }

    ns.tprintf("Found %d files for payload %s", payload_files.length, flags['payload']);
    
    ns.scp(payload_files, flags['target']);

    ns.scp('aksu/jinx/lib.js', flags['target']);

    if (flags['delay'] > 0) {
        ns.tprintf('Waiting for %d seconds', flags['delay']);
    }
    await ns.sleep(flags['delay'] * 1000);

    ns.exec(main_file, flags['target'], flags['threads'], flags['payload-args']);

    ns.tprint('Payload executed');
    return 0;
}
