//
//  .eslintrc.js
//
//  Created by David Rowe on 24 Nov 2020.
//  Copyright 2020 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

module.exports = {

    root: true,

    parser: "@typescript-eslint/parser",
    parserOptions: {
        "tsconfigRootDir": __dirname,
        "project": ["./tsconfig.json"],
        "ecmaVersion": 2020,
        "sourceType": "module"
    },

    plugins: [
        "@typescript-eslint",
        "eslint-plugin-jest"
    ],

    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:jest/recommended",  // eslint-plugin-jest
        "plugin:jest/style"  // eslint-plugin-jest
    ],

    env: {
        "es2020": true,
        "browser": true,
        "worker": true,
        "node": true
    },

    settings: {
        "jest": {
            "version": 27
        }
    },

    rules: {

        /* eslint-disable @typescript-eslint/no-magic-numbers */

        // typescript-eslint 4.28.3
        // TODO: Review rules.
        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
        "brace-style": "off",
        "@typescript-eslint/brace-style": ["error"],
        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": ["error", "never"],
        "comma-spacing": "off",
        "@typescript-eslint/comma-spacing": ["error"],
        "default-param-last": "off",
        "@typescript-eslint/default-param-last": ["error"],
        "dot-notation": "off",
        "@typescript-eslint/dot-notation": ["error", { "allowKeywords": false }],
        "func-call-spacing": "off",
        "@typescript-eslint/func-call-spacing": ["error", "never"],
        "indent": "off",
        // Warning: https://github.com/typescript-eslint/typescript-eslint/issues/1824
        "@typescript-eslint/indent": ["error", 4, { "SwitchCase": 1, "outerIIFEBody": 1 }],
        "init-declarations": "off",
        "@typescript-eslint/init-declarations": ["error", "always"],
        "keyword-spacing": "off",
        "@typescript-eslint/keyword-spacing": ["error"],
        "lines-between-class-members": "off",
        "@typescript-eslint/lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": ["error"],
        "no-dupe-class-members": "off",
        "@typescript-eslint/no-dupe-class-members": ["error"],
        "no-duplicate-imports": "off",
        "@typescript-eslint/no-duplicate-imports": ["error"],
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": ["error"],
        "no-extra-parens": "off",
        "@typescript-eslint/no-extra-parens": ["error"],
        "no-extra-semi": "off",
        "@typescript-eslint/no-extra-semi": ["error"],
        "@typescript-eslint/no-floating-promises": ["error", { "ignoreIIFE": true }],
        "no-implied-eval": "off",
        "@typescript-eslint/no-implied-eval": ["error"],
        "no-invalid-this": "off",
        "@typescript-eslint/no-invalid-this": ["error"],
        "no-loop-func": "off",
        "@typescript-eslint/no-loop-func": ["error"],
        "no-loss-of-precision": "off",
        "@typescript-eslint/no-loss-of-precision": ["error"],
        "no-magic-numbers": "off",
        "@typescript-eslint/no-magic-numbers": [
            "error",
            {
                "ignore": [-1, 0, 1, 2],
                "ignoreEnums": true,
                "ignoreNumericLiteralTypes": true,
                "ignoreReadonlyClassProperties": true
            }
        ],
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": [
            "error",
            {
                "builtinGlobals": false,
                "ignoreDeclarationMerge": true
            }
        ],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": [
            "error",
            {
                "builtinGlobals": false,
                "ignoreTypeValueShadow": true,
                "ignoreFunctionTypeParameterNameValueShadow": true
            }
        ],
        "no-throw-literal": "off",
        "@typescript-eslint/no-throw-literal": ["error"],
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": ["error"],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error"],
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": ["error"],
        "object-curly-spacing": "off",
        "@typescript-eslint/object-curly-spacing": ["error", "always"],
        "quotes": "off",
        "@typescript-eslint/quotes": ["error", "double", { "allowTemplateLiterals": true }],
        "require-await": "off",
        "@typescript-eslint/require-await": ["error"],
        "no-return-await": "off",
        "@typescript-eslint/return-await": ["error"],
        "semi": "off",
        "@typescript-eslint/semi": ["error", "always"],
        "space-before-function-paren": "off",
        "@typescript-eslint/space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "never",
                "asyncArrow": "always"
            }
        ],
        "space-infix-ops": "off",
        "@typescript-eslint/space-infix-ops": ["error", { "int32Hint": false }],
        "@typescript-eslint/type-annotation-spacing": ["error"],


        // eslint 6.8
        // Excluding TypeScript extension rules that replace desired ESLint rules.
        // TODO: Review rules and update to eslint 7.30.0.
        // https://eslint.org/docs/rules/

        // "no-extra-semi": "error",  // TypeScript extension overrides.

        // Possible errors.
        "no-await-in-loop": "error",
        // "no-console": "error",
        // "no-extra-parens": ["error", "functions"],  // TypeScript extension overrides.
        // "no-loss-of-precision": "error",  // TypeScript extension overrides.
        "no-promise-executor-return": "error",
        "no-template-curly-in-string": "error",
        "no-unreachable-loop": "error",
        "no-unsafe-optional-chaining": "error",
        "no-useless-backreference": "error",
        "require-atomic-updates": "error",

        // Best practices.
        // "accessor-pairs": "error",  //  There are many places where there are not pairs.
        "array-callback-return": "error",
        "block-scoped-var": "error",
        "class-methods-use-this": "error",
        "consistent-return": "error",
        "curly": "error",
        "default-case": "error",
        "default-case-last": "error",
        // "default-param-last": "error",  // TypeScript extension overrides.
        "dot-location": ["error", "property"],
        // "dot-notation": ["error", { "allowKeywords": false }],  // TypeScript extension overrides.
        "eqeqeq": "error",
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "no-caller": "error",
        "no-constructor-return": "error",
        "no-else-return": ["error", { allowElseIf: false }],
        // "no-empty-function": "error",  // TypeScript extension overrides.
        "no-eval": ["error"],
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        // "no-implied-eval": ["error"],  // TypeScript extension overrides.
        // "no-invalid-this": "error",  // TypeScript extension overrides.
        "no-iterator": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        // "no-loop-func": "error",  // TypeScript extension overrides.
        // "no-magic-numbers": ["error", { "ignore": [-1, 0, 1, 2] }],  // TypeScript extension overrides.
        "no-multi-spaces": ["error", { ignoreEOLComments: true }],
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-return-assign": "error",
        // "no-return-await": "error",  // TypeScript extension overrides.
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        // "no-throw-literal": "error",  // TypeScript extension overrides.
        "no-unmodified-loop-condition": "error",
        // "no-unused-expressions": "error",  // TypeScript extension overrides.
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-void": ["error", { "allowAsStatement": true }],
        "prefer-named-capture-group": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": "error",
        "radix": "error",
        // "require-await": "error",  // TypeScript extension overrides.
        "require-unicode-regexp": "error",
        "vars-on-top": "error",
        "wrap-iife": ["error", "outside"],
        // "yoda": "error",  // Want to use ranges without needing extra parentheses.

        // Strict mode.
        "strict": ["error", "safe"],

        // Variables
        // "init-declarations": ["error", "always"],  // TypeScript extension overrides.
        "no-label-var": "error",
        "no-restricted-globals": ["error", "event", "fdescribe"],
        // "no-shadow": ["error", { "builtinGlobals": false }],  // TypeScript extension overrides.
        // "no-use-before-define": "error",  // TypeScript extension overrides.

        // Stylistic issues.
        "array-bracket-newline": ["error", { "multiline": true }],
        "array-bracket-spacing": ["error", "never"],
        "array-element-newline": ["error", "consistent"],
        "block-spacing": "error",
        // "brace-style": "error",  // TypeScript extension overrides.
        "camelcase": "error",
        // "comma-dangle": ["error", "never"],  // TypeScript extension overrides.
        // "comma-spacing": "error",  // TypeScript extension overrides.
        "comma-style": "error",
        "computed-property-spacing": "error",
        "consistent-this": ["error", "self"],
        "eol-last": "error",
        // "func-call-spacing": ["error", "never"],  // TypeScript extension overrides.
        "func-style": ["error", "declaration", { "allowArrowFunctions": true }],
        "implicit-arrow-linebreak": ["error", "beside"],
        // "indent": ["error", 4, { "SwitchCase": 1, "outerIIFEBody": 1 }],  // TypeScript extension overrides.
        "jsx-quotes": ["error", "prefer-double"],
        "key-spacing": "error",
        // "keyword-spacing": "error",  // TypeScript extension overrides.
        "max-len": ["error", { "code": 128, "tabWidth": 4 }],
        "multiline-ternary": ["error", "always-multiline"],
        "new-cap": "error",
        "new-parens": "error",
        "newline-per-chained-call": ["error", { "ignoreChainWithDepth": 2 }],
        // "no-array-constructor": "error",  // TypeScript extension overrides.
        "no-continue": "error",
        "no-lonely-if": "error",
        "no-multiple-empty-lines": ["error", { "max": 2, "maxBOF": 0, "maxEOF": 0 }],
        "no-nested-ternary": "error",
        "no-new-object": "error",
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "no-unneeded-ternary": "error",
        "no-whitespace-before-property": "error",
        "object-curly-newline": "error",
        // "object-curly-spacing": ["error", "always"],  // TypeScript extension overrides.
        "one-var": ["error", "never"],
        "operator-linebreak": ["error", "before"],
        "prefer-exponentiation-operator": "error",
        "prefer-object-spread": "error",
        // "quotes": ["error", "double", { "allowTemplateLiterals": true }],  // TypeScript extension overrides.
        // "semi": ["error", "always"],
        "semi-spacing": "error",
        "semi-style": "error",
        "space-before-blocks": "error",
        // "space-before-function-paren": [
        //     "error", {
        //         "anonymous": "always",
        //         "named": "never",
        //         "asyncArrow": "always"
        //     }
        // ],  // TypeScript extension overrides.
        "space-in-parens": "error",
        // "space-infix-ops": "error",  // TypeScript extension overrides.
        "space-unary-ops": [
            "error", {
                "words": true,
                "nonwords": false
            }
        ],
        "spaced-comment": ["error", "always", { "exceptions": ["@devdoc", "@sdkdoc"] }],
        "switch-colon-spacing": "error",
        "template-tag-spacing": "error",
        "unicode-bom": "error",
        "wrap-regex": "error",

        // ECMAScript 6
        "arrow-body-style": ["error", "always"],
        "arrow-parens": "error",
        "arrow-spacing": "error",
        "generator-star-spacing": "error",
        "no-confusing-arrow": "error",
        // "no-duplicate-imports": "error",  // TypeScript extension overrides.
        "no-useless-computed-key": "error",
        // "no-useless-constructor": "error",  // TypeScript extension overrides.
        "no-useless-rename": "error",
        "no-var": "error",
        "object-shorthand": ["error", "properties"],
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "rest-spread-spacing": "error",
        "symbol-description": "error",
        "template-curly-spacing": "error",
        "yield-star-spacing": "error",


        // eslint-plugin-jest
        // Rules extra or exceptions to those in plugin:jest/recommended and plugin:jest/style.
        // https://www.npmjs.com/package/eslint-plugin-jest
        // TODO: Review rules.
        "jest/no-done-callback": "off"

    }
};
