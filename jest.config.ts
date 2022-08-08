import path from "path";

module.exports = {
  preset: "ts-jest",
  setupFiles: [
    path.resolve("__tests__", "setup-env.ts"),
  ],
  setupFilesAfterEnv: [
    path.resolve("__tests__", "setup-lib-mocks.ts"),
  ],
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/*.test.ts",
  ],
  collectCoverage: true,
  coverageThreshold: {
    src: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
