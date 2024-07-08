export const config = {
    "0": {
        "skip": false,
        "type": "needle",
        "host": "home",
        "payload": "ping",
        "args": { "greeting": "needle from" },
        "threads": 1,
        "delay": 100
    },
    "1": {
        "skip": false,
        "type": "plexer",
        "host": "home",
        "payload": "ping",
        "args": { "greeting": "plexer from" },
        "threads": "auto",
        "delay": 100,
        "exclude": []
    },
    "2": {
        "skip": true,
        "type": "crawler",
        "host": "n00dles",
        "payload": "ping",
        "args": { "greeting": "crawler from" },
        "threads": "auto",
        "exclude": [],
        "delay": 100
    },
    "3": {
        "type": "save_exit",
        "variable": "last_exit",
    },
    "4": {
        "type": "print",
        "variable": "last_exit",
        "delay": "${last_exit}"
    }
};