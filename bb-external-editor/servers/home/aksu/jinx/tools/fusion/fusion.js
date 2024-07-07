export async function main(ns) {
    const flags = ns.flags([
        ['name', ''],
        ['payloads', '{}'],
        ['payload-args', '{}'],
        ['fusion-rules', '{}'],
        ['delay', 100]
    ]);

    const name = flags['name'];
    const payloads = JSON.parse(flags['payloads']);
    const args = JSON.parse(flags['payload-args']);
    const rules = JSON.parse(flags['fusion-rules']);
    const delay = flags['delay']

    if (!name) {
        ns.tprint("Please enter a name for the fusion payload.");
        return 1;
    }

    if (payloads.length < 1) {
        ns.tprint("Fusion needs at least 1 payload.");
        return 1;
    }

    if (Object.keys(args).length != Object.keys(payloads).length) {
        ns.tprint("Mismatched number of arguments to payloads.")
        return 1;
    }

    if (Object.keys(rules).length != Object.keys(payloads).length) {
        ns.tprint("Mismatched number of rules to payloads.")
        return 1;
    }

    await fusion(ns, name, payloads, args, rules, delay);
    return 0;
}


export async function fusion(ns, name, payloads, args, rules, delay) {
    const cwd = "aksu/jinx/payloads/" + name + "/";
    const main_file_path = cwd + name + ".js";

    await copy_file(ns, "aksu/jinx/lib.js", cwd + "lib.js")
    
    let main_file =
`
export async function main(ns) {
`;

    for (const i in payloads) {
        const payload = payloads[i];
        const payload_file = cwd + "payloads/" +  payload + "/" + payload + ".js";
        const arg = JSON.stringify(args[i]);
        ns.tprint(arg);
        const rule = rules[i];

        const files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);

        for (const y in files) {
            const file = files[y];
            let dest = file.split('/');
            dest.splice(0, 2);
            dest = ['aksu', 'jinx', 'payloads', name].concat(dest).join('/');
            copy_file(ns, file, dest);
        }

        main_file += 
`
await ns.run("${payload_file}", 1, '${arg}');
await ns.sleep(${delay});
`

    }  


    main_file +=
`
}
`
    ns.tprint(main_file);
    ns.write(main_file_path, main_file, 'w');
    return name;
}

function copy_file(ns, source, dest) {
    const file = ns.read(source);
    ns.write(dest, file, 'w');
    return 0;
}