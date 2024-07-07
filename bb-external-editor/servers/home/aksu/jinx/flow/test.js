export const config = {
    "0": {
      "skip": true,
      "type": "needle",
      "host": "home",
      "payload": "ping",
      "payload-args": {"greeting": "needle from"},
      "threads": 1,
      "delay": 100
    },
    "1": {
      "skip": false,
      "type": "plexer",
      "host": "home",
      "payload": "ping",
      "payload-args": {"greeting": "plexer from"},
      "threads": "auto",
      "delay": 100,
      "exclude": []
    },
   "2": {
      "skip": true,
      "type": "crawler",
      "host": "n00dles",
      "payload": "ping",
      "payload-args": {"greeting": "crawler from"},
      "threads": "auto",
      "exclude": [],
      "delay": 100
    } 
};