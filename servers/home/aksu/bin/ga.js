export function main(ns) {
    const bin = ns.ls(ns.getHostname(), "aksu/bin/");
    const jinx_tools = ns.ls(ns.getHostname(), "aksu/jinx/tools");
    
    ns.tprintf(`        
 ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗███████╗██████╗      █████╗ ██╗     ██╗ █████╗ ███████╗
██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗    ██╔══██╗██║     ██║██╔══██╗██╔════╝
██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   █████╗  ██║  ██║    ███████║██║     ██║███████║███████╗
██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██╔══╝  ██║  ██║    ██╔══██║██║     ██║██╔══██║╚════██║
╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ███████╗██████╔╝    ██║  ██║███████╗██║██║  ██║███████║
 ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝     ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
                                                                                                                   
 `);
    let out_string = ''
    const programs = bin.concat(jinx_tools);
    for (const i in programs) {
        const program = programs[i];
        const prog_name = program.split(".")[0].split("/").at(-1);
        const command = "alias -g " + prog_name + "=\"" + program + "\";";
        out_string += command
    }

    try {
        const terminalInput = eval('document').getElementById("terminal-input");
        terminalInput.value = out_string;
        const handler = Object.keys(terminalInput)[1];
        terminalInput[handler].onChange({ target: terminalInput });
        terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
    }
    catch { }
    return 0;
}