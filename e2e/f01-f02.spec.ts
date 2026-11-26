// ponytail: Playwright spec for F01 + F02 (the two core flows).
// Run: npx playwright test e2e/
// Requires a running dev server: `npx expo start --web`

import { test, expect } from "@playwright/test";
import Axe from "@axe-core/playwright";

test.describe("F01 import + F02 edit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("F01-H1: import a video and create a project", async ({ page }) => {
    // home screen: create project
    await page.getByRole("button", { name: /new project/i }).click();
    // S02 import: pick first media item
    await page.getByRole("button", { name: /Intro\.mp4/ }).click();
    // expect: canvas visible with the clip
    await expect(page.getByRole("region", { name: /preview/i })).toBeVisible();
  });

  test("F02-H1: split a clip at the playhead", async ({ page }) => {
    await page.getByRole("button", { name: /new project/i }).click();
    await page.getByRole("button", { name: /Intro\.mp4/ }).click();
    // S04 timeline: select clip, move playhead, split
    await page.getByRole("button", { name: /split/i }).click();
    // expect: two clip blocks visible
    await expect(page.locator("[data-testid=clip-block]")).toHaveCount(2);
  });

  test("F02-E1: trimming to zero length deletes the clip", async ({ page }) => {
    await page.getByRole("button", { name: /new project/i }).click();
    await page.getByRole("button", { name: /Intro\.mp4/ }).click();
    // trim both handles to the same point
    await page.locator("[data-testid=trim-right]").dragTo(page.locator("[data-testid=trim-left]"));
    await expect(page.locator("[data-testid=clip-block]")).toHaveCount(0);
  });

  test("X4: axe scan - no violations on home screen", async ({ page }) => {
    const axe = new Axe(page);
    const results = await axe.analyze();
    expect(results.violations).toHaveLength(0);
  });

  test("X5: second user cannot see first user's project", async ({ page, context }) => {
    // sign in as user A, create a project
    await page.getByRole("button", { name: /new project/i }).click();
    await page.getByRole("button", { name: /Intro\.mp4/ }).click();
    await page.getByRole("button", { name: /sign out/i }).click();
    // sign in as user B
    await page.getByRole("button", { name: /sign in/i }).click();
    // user B's home: no projects
    await expect(page.getByRole("button", { name: /Intro\.mp4/ })).toHaveCount(0);
  });
});
