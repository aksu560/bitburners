import { ansi, capitalize, centerString, getExtendedServerData } from "../jinx/lib";

let off_color = true;

export function main(ns) {
    ns.ui.clearTerminal();

    const data = {
        padding: 1,
        column_titles: [],
        column_keys: [],
        column_lengths: [],
        border_rl:  '═',
        border_rd:  '╔',
        border_dl:  '╗',
        border_ud:  '║',
        border_ur:  '╚',
        border_ul:  '╝',
        border_rdl: '╤',
        inner_ud:   '│',
        inner_urdl: '┼',
        border_url: '╧',
        inner_rl:   '─',
        border_udl: '╢',
        border_urd: '╟',
        final: false,
        server_data: getExtendedServerData(ns)
    }

    let server_strings = data.server_data.map(s => {
        return {
            ...s, 
            ps: s.ps.length, 
            max_ram: ns.formatRam(s.max_ram),
            used_ram: ns.formatRam(s.used_ram)
        }
    });

    server_strings = server_strings.map(({connections, route, parent, ...keepAttrs}) => keepAttrs)

    server_strings = server_strings.map(n => {
        let transformed = {};
        for (let key in n) {
            if (n.hasOwnProperty(key)) {
                transformed[key] = n[key].toString();
            }
        }
        return transformed;
    });

    Object.keys(server_strings[0]).forEach((key) => {
        data.column_keys.push(key)
        if (key == 'base_security') {
            key = 'B.Sec';
        }
        if (key == 'min_security') {
            key = 'M.Sec';
        }
        data.column_titles.push(key.split('_').map(n => capitalize(n)).join(' '));
        data.column_lengths.push(server_strings.reduce((a = 0, b) => {
            return a > Math.max(String(b[key]).length, key.length) ? a : Math.max(String(b[key]).length, key.length)
        }));
    });

    let output = [];

    // Top Bar
    let top_bar = []
    for (const num of data.column_lengths) {
        top_bar.push(data.border_rl.repeat(num + (data.padding * 2)));
    }
    addToOutput(top_bar, output, data);

    // Header
    addToOutput(data.column_titles, output, data);

    // Servers
    for (const server of server_strings) {
        let server_line = [];
        for (const key of data.column_keys) {
            server_line.push(server[key]);
        }
        addToOutput(server_line, output, data);
    }

    let bottom_text = []
    // Bottom Text
    for (const num of data.column_lengths) {
        bottom_text.push(data.border_rl.repeat(num + (data.padding * 2)));
    }
    data.final = true;
    addToOutput(bottom_text, output, data);

    // Print that shit
    ns.tprintf(output.join('\n'))

}

function addToOutput(input, output, data) {

    input = input.map((n, i) => {
        return centerString(n, data.column_lengths[i] + (2 * data.padding));
    });

    let delim = data.inner_ud;
    let edges = [data.border_ud, data.border_ud]


    if (output.length == 0) {
        delim = data.border_rdl;
        edges = [data.border_rd, data.border_dl]
    } else if (data.final) {
        delim = data.border_url;
        edges = [data.border_ur, data.border_ul];
    }

    input = input.flatMap(
        (value, index, array) =>
            array.length - 1 !== index
                ? [value, delim]
                : value
    );

    input.length = findWhereArrayGoesOver(input)

    input.unshift(edges[0]);
    input[input.length - 1] = edges[1]
    output.push(input.join(''));
    
    return output;
}


function findWhereArrayGoesOver(arr) {
    // 10 worked for me. Adjust up or down based on your preference. Its not perfect, but it wont overflow.
    const CHAR_LIMIT = Math.floor(eval('document').querySelector('#terminal').clientWidth / 10);
    let charCount = 0;

    for(let i = 0; i < arr.length; i++) {
        let current = arr[i];
        if(charCount + current.length > CHAR_LIMIT) {
            return i;
        }
        
        charCount += current.length;
    }
    return arr.length
}