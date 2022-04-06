/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  moduleNameMapper:{
    "^@Base/(.*)$": "<rootDir>/src/$1",
    "^@Entities/(.*)$": "<rootDir>/src/Entities/$1",
    "^@Tools/(.*)$": "<rootDir>/src/Tools/$1",
    "^@Route-Tools/(.*)$": "<rootDir>/src/route-tools/$1"
  }
};
