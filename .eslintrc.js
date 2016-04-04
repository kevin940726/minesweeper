module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            0,
            "tab"
        ],
        "linebreak-style": [
            0,
            "unix"
        ],
        "quotes": [
            0,
            "double"
        ],
        "semi": [
            2,
            "always"
        ],
        "no-unused-vars": 0,
        "no-console": 0
    }
};
