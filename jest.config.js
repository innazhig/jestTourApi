/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  //preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'localhost:8001/api/v1',
  },
  roots: ['<rootDir>/specs'],
  reporters: [
    "default", ["jest-junit", { outputDirectory: "reports" }],
    ["jest-html-reporters", { publicPath: "./reports" }]
  ],
};