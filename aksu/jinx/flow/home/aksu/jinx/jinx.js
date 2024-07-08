// servers/home/aksu/jinx/jinx.txt
var jinx_default = `        ____  ____  _____   ______                   \r
       |    ||    ||\\    \\ |\\     \\  _____      _____\r
       |    ||    | \\\\    \\| \\     \\ \\    \\    /    /\r
       |    ||    |  \\|    \\  \\     | \\    \\  /    / \r
 ____  |    ||    |   |     \\  |    |  \\____\\/____/  \r
|    | |    ||    |   |      \\ |    |  /    /\\    \\  \r
|    | |    ||    |   |    |\\ \\|    | /    /  \\    \\ \r
|\\____\\|____||____|   |____||\\_____/|/____/ /\\ \\____\\\r
| |    |    ||    |   |    |/ \\|   |||    |/  \\|    |\r
 \\|____|____||____|   |____|   |___|/|____|    |____|\r
                                                     \r
\r
Jinx is framework for deploying and managing exploits in bitburner.\r
\r
Fundamentally, it is just a standardized interface for exploit elements to\r
interact (but not communicate) with eachother\r
\r
It is a simplistic system. There is no interprocess communication for example.\r
\r
It exists to function as a baseline for exploits and tools, and it is designed\r
to be easily included in other more involved frameworks that I may develop in\r
the future(tm).\r
\r
\r
\r
Standards:\r
\r
main() is the entry point for any exploit. main will only take "ns" as an\r
argument in code. Everything else shall be passed in via CLI arguments.\r
\r
main() will exit with 0 on success and 1 on failure. It is up to the developer\r
to decide what constitutes a failure. No other exit codes are defined.\r
\r
It is recommended that exec() or run() be used for deploying jinx scripts, however this\r
is not strictly necessary, and can be diverged from if necessary.\r
\r
If a jinx script must be killed externally, it is to be done externally with the\r
kill command. There is no SIGINT or similar.\r
\r
When transfering files, the structure of the jinx framework must stay intact.\r
Jinx root directory must be located in "/aksu/jinx/".\r
\r
\r
\r
Payloads:\r
\r
A payload is a script that runs on the target machine. There are no strict\r
standards on what a payload is and how it should behave, as long as it sticks\r
to the defined interface.\r
\r
Payloads are to be stored under "aksu/jinx/payloads/"\r
\r
A payload will take a single object\r
\r
A payloads main() MUST be in a file in the root directory, named the same as\r
the payload. Eg. "aksu/jinx/payloads/foo/foo.js:main()"\r
\r
A payload takes a single argument, which is a json object, with all of the\r
configuration necessary.\r
\r
This directory should contain a directory for each payload separately. No loose\r
scripts.\r
\r
With the exception of lib.js (see below), ALL files for a payload MUST be stored\r
within its own directory. This is to facilitate ease of filetransfer via scp.\r
This way, if you transfer the payload directory, and lib.js, you know your\r
script WILL run. This means that there are no external dependencies allowed.\r
Either copy paste the function, or if the functionality is widely applicable,\r
add it to lib.js.\r
\r
A reference payload, roughly similar to Hello World, can be found from\r
payloads/ping/\r
\r
\r
\r
Tools:\r
\r
A tool is any jinx script that is NOT a payload.\r
\r
Tools shall never be deployed to targeted machines.\r
\r
Tools are to be stored under "aksu/jinx/tools/"\r
\r
Unlike payloads, tools MAY have external dependecies, however they CANNOT have\r
dependecies external to jinx as a whole. This effectively means they can depend\r
on payloads, other tools and lib.js but nothing else.\r
\r
A tools main() MUST be in a file in the root directory, named the same as the\r
tool. Eg. "aksu/jinx/tools/bar/bar.js:main()"\r
\r
Tools have no defined exit values, but don't be a shitter about it.\r
\r
A reference tool, needle, can be found from "tools/needle/". It can be used to\r
deploy payloads to servers directly. To try it out, execute:\r
"run aksu/jinx/tools/needle/needle.js --target n00dles --payload ping"\r
\r
\r
lib.js:\r
\r
lib.js is a shared library file stored in the jinxs root directory\r
("aksu/jinx/lib.js").\r
\r
lib.js exists to share behaviour common in jinx scripts.\r
\r
lib.js may be extended.\r
\r
Functions in lib.js CAN be deprecated, but may never be removed. This is to\r
guarantee backwards compatability with payloads, no matter how ancient.\r
Deprecation warnings may be added, but the function must still behave as\r
expected.\r
\r
lib.js MUST be deployed alongside every jinx script. This includes payloads,\r
auxiliary tools etc.\r
\r
It is the responsibility of the DEPLOYER to make sure that lib.js is present.\r
Scripts must be able to blindly assume the file is located in\r
"aksu/jinx/lib.js", without having to check, or pull it from an external source.\r
\r
\r
\r
- aksu 2024`;
export {
  jinx_default as default
};
