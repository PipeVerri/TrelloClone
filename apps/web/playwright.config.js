import { defineConfig } from "@playwright/test";
export default defineConfig({
    testDir: "tests/",
    testMatch: ["**/*.spec.ts"],
    use: {
        headless: false, // open a to real browser window
        launchOptions: { slowMo: 250 }, // slow down so you can see steps
        trace: "on", // record a trace for replay
        video: "off", // record a video
        screenshot: "only-on-failure",
    },
});
