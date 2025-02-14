export const config = {
    "0": {
        "skip": false,
        "type": "plexer",
        "host": "home",
        "payload": "battering-ram",
        "args": {},
        "threads": 1,
        "delay": 0,
        'max-depth': -1,
        'exclude': ['home']
    },
    "2": {
        "skip": false,
        "type": "crawler",
        "host": "home",
        "payload": "mcafee",
        "args": { "target": "harakiri-sushi" },
        "threads": "auto",
        "delay": 100,
        "exclude": ['home'],
        'max-depth': -1
    }
};