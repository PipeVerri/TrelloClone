// tests/dragging.spec.ts
import { expect, test } from "@playwright/test";

test.describe("dragging", () => {
	test("card dragging (Playwright)", async ({ page }) => {
		// 1) Run your app locally before this test
		await page.goto("http://localhost:3000");

		// (Optional) Visualize clicks — helps see where actions happen
		await page.addInitScript(() => {
			window.addEventListener(
				"click",
				(e) => {
					const m = document.createElement("div");
					Object.assign(m.style, {
						position: "fixed",
						left: `${e.clientX - 6}px`,
						top: `${e.clientY - 6}px`,
						width: "12px",
						height: "12px",
						borderRadius: "50%",
						border: "2px solid red",
						zIndex: "2147483647",
						pointerEvents: "none",
						transition: "opacity .6s",
					});
					document.body.appendChild(m);
					setTimeout(() => {
						m.style.opacity = "0";
					}, 150);
					setTimeout(() => m.remove(), 800);
				},
				true,
			);
		});

		// 2) Locate the input
		const input = page.locator('input[value="test1"]');
		await expect(input).toBeVisible();

		// Get draggable card
		const card = input.locator("..").getByTestId("drag-button"); // parent element

		// Destination: screen.getByTestId("container1").children[0]
		const container1 = page.getByTestId("container1");
		await expect(container1).toBeVisible();
		const destSlot = container1.locator(":scope > *").first();

		// manual mouse drag (works for mousemove/mousedown listeners)
		const sourceBox = await card.boundingBox();
		const targetBox = await destSlot.boundingBox();
		if (!sourceBox || !targetBox) throw new Error("Could not compute drag boxes");

		await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
		await page.mouse.down();
		await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 20 });
		await page.mouse.up();

		// (Optional) Pause to step through in the Inspector
		//await page.pause();

		// 5) Assert the card is now inside container1
		// Equivalent to your waitFor + debug: we check DOM state explicitly.
		await expect(page.getByTestId("container1").locator("input[value=test1]")).toBeVisible();

		// (Optional) Screenshot the resulting container for quick visual confirmation
		await container1.screenshot({ path: "test-results/container1-after.png" });
	});
});
