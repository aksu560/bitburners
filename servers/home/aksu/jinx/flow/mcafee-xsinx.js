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
  "1": {
    "type": "xsinx"
  },
  "2": {
    "type": "save_exit",
    "variable": "target"
  },
  "3": {
    "skip": false,
    "type": "crawler",
    "host": "home",
    "payload": "mcafee",
    "args": {"target": "${target}"},
    "threads": "auto",
    "delay": 0,
    "exclude": [],
    'max-depth': -1
  },
  "4": {
    "type": "toast",
    "message": "McAfee cluster spun up against ${target}"
  }
};