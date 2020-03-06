module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "es6": true,
    },
    "extends": ['eslint:recommended', 'plugin:react/recommended'],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
       "react/prop-types": 0,
       "react/display-name": 0,
    }
};
