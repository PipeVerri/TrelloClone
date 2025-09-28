import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "__tests__/",
	testMatch: ["**/*.spec.ts"],
	use: {
		headless: true, // open a to real browser window
		launchOptions: { slowMo: 250 }, // slow down so you can see steps
		trace: "on", // record a trace for replay
		video: "off", // record a video
		screenshot: "only-on-failure",
	},
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
	},
});
