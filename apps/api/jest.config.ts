import type { Config } from "jest";

const config: Config = {
	testEnvironment: "node",
	testMatch: ["**/tests/**/*.spec.ts"],
	clearMocks: true,
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
				diagnostics: true,
			},
		],
	},
	collectCoverageFrom: ["src/**/*.{ts,tsx}"],
	coverageProvider: "v8",
};

export default config;
