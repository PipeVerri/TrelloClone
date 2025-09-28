// tests/dragging.spec.ts
import {expect, Page, test} from "@playwright/test";

test.beforeAll(async () => {
    const response = await fetch("http://localhost:8000/boards/getAllBoards");
    const data = await response.json()
    for (let board of data) {
        await fetch("http://localhost:8000/boards/deleteBoard", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: board.id,
            })
        });
    }
})

test.beforeEach(async ({ page }) => {
    // Inject your click visualizer for every test in this file
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
                setTimeout(() => { m.style.opacity = "0"; }, 150);
                setTimeout(() => m.remove(), 800);
            },
            true
        );
    });
});

const createBoard = async (title: string) => {
    let response = await fetch("http://localhost:8000/boards/getAllBoards");
    let data = await response.json()

    for (let board of data) {
        if (board.title === title) {
            return board.id
        }
    }

    // If it doesn't exist
    response = await fetch("http://localhost:8000/boards/createBoard", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title: title,
        }),
    });
    data = await response.json()
    console.log(data)
    return data.id
}

const deleteBoard = async (title: string) => {
    const response = await fetch("http://localhost:8000/boards/getAllBoards");
    const data = await response.json()
    for (let board of data) {
        if (board.title === title) {
            await fetch("http://localhost:8000/boards/deleteBoard", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: board.id,
                })
            });
        }
    }
}

test.describe("Boards", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/boards");
    })

    test("Board creation", async ({page}) => {
        await deleteBoard("testBoard");

        // Locate the input
        const input = page.locator('input[placeholder="New board name..."]');
        await expect(input).toBeVisible();

        // Create testBoard
        await input.fill("testBoard");
        await input.press("Enter");

        // Check its existence
        const label = page.locator('p:text-is("testBoard")');
        await expect(label).toBeVisible();
    })

    test("Board deletion", async ({page}) => {
        await createBoard("testBoard");
        await createBoard("secondTestBoard");

        // Locate the deletion button
        const deleteButton = page.locator('p:text-is("testBoard") + button')
        await expect(deleteButton).toBeVisible();

        // Click it and cancel the deletion
        page.once("dialog", async dialog => {await dialog.dismiss()})
        await deleteButton.click();

        // Check that testBoard still exists
        const testBoard = page.locator('p:text-is("testBoard")');
        await expect(testBoard).toBeVisible();

        // Now delete it
        page.once("dialog", async dialog => {await dialog.accept()})
        await deleteButton.click();

        // Check that testBoard does not exist, and secondTestBoard does
        await expect(testBoard).not.toBeVisible();
        const secondTestBoard = page.locator('p:text-is("secondTestBoard")');
        await expect(secondTestBoard).toBeVisible();
    })
})

test.describe("Board edition", () => {
    test.beforeEach(async ({page}) => {
        await deleteBoard("testBoard");
        const id = await createBoard("testBoard");
        await page.goto(`http://localhost:3000/boards/${id}`);
    })

    test("Card edition", async ({page}) => {
        // Get the first container's card's input
        const input = page.getByTestId("container0").locator("input").first()
        await expect(input).toBeVisible();

        // Edit it, reload, and check the changes
        await input.fill("testValue");
        await page.reload();
        await expect(input).toHaveValue("testValue");
    })

    test("Container edition", async ({page}) => {
        // Get the container edition input
        const containerInput = page.getByTestId("container0").locator("input").first()
        await expect(containerInput).toBeVisible();

        // Edit it, reload, and check
        await containerInput.clear();
        await containerInput.fill("testValue");
        await expect(containerInput).toHaveValue("testValue");
        await page.reload();
        await expect(containerInput).toHaveValue("testValue");
    })

    test("Card deletion", async ({page}) => {
        // Locate the first card
        const cardInput = page.getByTestId("container0").getByPlaceholder("Titulo...");
        const cardDraggable = cardInput.locator("..").getByTestId("drag-button");

        // Rename it so that I know what card is it
        await cardInput.clear();
        await cardInput.fill("deletionCard");

        // Start dragging it
        const cardBox = await cardDraggable.boundingBox();
        if (!cardBox) throw new Error("Could not compute card box");
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();

        // Look for the trash can slot
        const trashSlot = page.getByTestId("deleteSlot")
        await expect(trashSlot).toBeVisible();

        // Drag the card to it
        const trashBox = await trashSlot.boundingBox();
        if (!trashBox) throw new Error("Could not compute trash box");
        await page.mouse.move(trashBox.x + trashBox.width / 2, trashBox.y + trashBox.height / 2);
        await page.mouse.up();

        // Check that the card doesn't exist anymore
        await expect(cardInput).not.toBeVisible();
        await expect(trashSlot).not.toBeVisible();
    })

    test("Container deletion", async ({page}) => {
        // Find the button
        const container = page.getByTestId("container0")
        const containerDeleteButton = container.getByTestId("deleteButton");
        await expect(containerDeleteButton).toBeVisible()

        // Click it and don't confirm
        page.once("dialog", async dialog => {await dialog.dismiss()})
        await containerDeleteButton.click();
        await expect(container).toBeVisible();

        // Now confirm
        page.once("dialog", async dialog => {await dialog.accept()})
        await containerDeleteButton.click();
        await expect(container).not.toBeVisible();

        // Reload
        await page.reload()
        await expect(container).not.toBeVisible();
    })
})

test.describe.serial("Card dragging", () => {
    let boardId: string

    test.beforeAll(async () => {
        await deleteBoard("testBoard");
        boardId = await createBoard("testBoard");
    })

    test.beforeEach(async ({page}) => {
        await page.goto(`http://localhost:3000/boards/${boardId}`);
    })

    test("Container creation", async ({page}) => {
        // Get the container creation button
        const createButton = page.getByTestId("createContainer")
        await expect(createButton).toBeVisible();

        // Click it and check for a new container
        await createButton.click();
        const secondContainer = page.getByTestId("container1")
        await expect(secondContainer).toBeVisible();

        // Reload and recheck
        await page.reload()
        await expect(secondContainer).toBeVisible();
    })

    test("Card creation", async ({page}) => {
        // Get the add button
        const addButton = page.getByTestId("container0").getByLabel("add")
        await expect(addButton).toBeVisible();

        // Click it and check if a new card does exist
        await addButton.click();
        const newCard = page.getByPlaceholder("Titulo...")
        await expect(newCard).toHaveCount(2); // The first and new cards

        // Reload and check if it still exists
        await page.reload();
        await expect(newCard).toHaveCount(2);
    })

    test("Card dragging", async ({ page }) => {
        // Locate the input
        const input = page.getByPlaceholder("Titulo...").last()
        await expect(input).toBeVisible();

        // Get draggable button
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

        // Assert the card is now inside container1, and reload to check
        const container1Card = page.getByTestId("container1").getByPlaceholder("Titulo...")
        await expect(container1Card).toBeVisible();
        await page.reload();
        await expect(container1Card).toBeVisible();
    });
})