export function parseConfig(ns) {
    const flags = ns.flags([
        ['file', ''],
    ]);

    if (!flags['file']) {
        ns.tprint("Please provide a flow file");
        return false;
    }

    const config_file_location = 'aksu/jinx/flow/' + flags['file'] + '.js';
    // Mitä vittua?
    const config_file = ns.read(config_file_location).split('=')[1].split(';')[0];
    const config = JSON.parse(config_file);
    
    return config;
}