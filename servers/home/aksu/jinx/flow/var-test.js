export const config = {
    "0": {
        "skip": false,
        "type": "set_var",
        "variables": [["foo", "bar"]]
    },
    "1": {
        "type": "toast",
        "message": "${foo}"
    }
};