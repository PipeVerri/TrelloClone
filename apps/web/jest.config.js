/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from "next/jest.js";
const config = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    testMatch: ["**/*.test.tsx"],
};
const createJestConfig = nextJest({
    dir: "./",
});
export default createJestConfig(config);
