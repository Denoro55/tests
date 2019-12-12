module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest": true
    },
    "extends": "standard",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "semi": [2, "always"],
        "no-tabs": 0,
        "indent": ["error", "tab"],
        "eol-last": 0
    }
};