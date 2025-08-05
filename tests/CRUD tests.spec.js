const { test, expect } = require("@playwright/test");

test("tworzenie projektu, story, tworzenie usuwanie zadania, usuwanie projektu", async ({
  page,
}) => {
  const uuid = Date.now();
  const projectName = `Projekt testowy ${uuid}`;
  const editedProjectName = `${projectName} edit`;
  const storyName = `Testowe story ${uuid}`;
  const editedStoryName = `Testowe story edit ${uuid}`;
  const taskName = `Testowy task ${uuid}`;
  const editedTaskName = `Testowy task edit ${uuid}`;

  // 1. tworzenie i edycja projektu
  await page.goto("http://localhost:3000");
  await page.getByTestId("create-project-name").fill(projectName);
  await page
    .getByTestId("create-project-desc")
    .fill(`Opis testowy projektu ${uuid}`);
  await page.getByRole("button", { name: "Utwórz" }).click();

  await expect(page.locator(`text=${projectName}`)).toBeVisible();
  await expect(
    page.locator(`text=Opis testowy projektu ${uuid}`)
  ).toBeVisible();

  await page.getByTestId(`edit-button-${projectName}`).click();
  await page.getByTestId("edit-project-name").fill(editedProjectName);
  await page
    .getByTestId("edit-project-desc")
    .fill(`Opis testowy projektu edit ${uuid}`);
  await page.getByTestId(`save-button-${editedProjectName}`).click();

  await expect(page.locator(`text=${editedProjectName}`)).toBeVisible();
  await expect(
    page.locator(
      `div:has-text("${editedProjectName}") >> text=Opis testowy projektu edit ${uuid}`
    )
  ).toBeVisible();

  // 2. tworzenie i edycja historii
  await page.goto("http://localhost:3000/projects");
  await page.locator(`text=${editedProjectName}`).click();
  await page.getByRole("button", { name: "Dodaj nową historię" }).click();

  await page.getByLabel("Nazwa").fill(storyName);
  await page.getByLabel("Opis").fill(`Testowy opis story ${uuid}`);
  await page.getByLabel("Priorytet").selectOption("średni");
  await page.getByLabel("Stan").selectOption("todo");
  await page
    .getByLabel("Właściciel")
    .selectOption("Mariusz Trynalski - developer");
  await page.getByRole("button", { name: "Utwórz" }).click();

  await expect(page.locator(`text=${storyName}`)).toBeVisible();
  await expect(
    page.locator(
      `div:has-text("${storyName}") >> text=Testowy opis story ${uuid}`
    )
  ).toBeVisible();
  await expect(
    page.locator(`div:has-text("${storyName}") >> text=średni`)
  ).toBeVisible();
  await expect(
    page.locator(`div:has-text("${storyName}") >> text=Stan: todo`)
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mariusz Trynalski" })
  ).toBeVisible();

  await page.getByTestId(`edit-story-${storyName}`).click();
  await page.getByLabel("Nazwa").fill(editedStoryName);
  await page.getByRole("button", { name: "Zapisz" }).click();

  await expect(page.locator(`text=${editedStoryName}`)).toBeVisible();

  // 3. tworzenie i edycja zadania
  await page.goto("http://localhost:3000/tasks");

  await page.getByRole("button", { name: "Dodaj zadanie" }).click();

  await page.getByLabel("Nazwa").fill(taskName);
  await page.getByLabel("Opis").fill(`Testowy opis task ${uuid}`);

  const storySelect = page.getByTestId("story-select");
  await storySelect.waitFor({ state: "visible" });

  const options = await storySelect.locator("option").allTextContents();

  if (options.includes(editedStoryName)) {
    await page.getByLabel("Story").selectOption({ label: editedStoryName });
  }
  //  else {
  //   await page.reload({ waitUntil: "networkidle" });
  //   await page.getByLabel("Story").selectOption({ label: editedStoryName });
  // }

  await page.getByLabel("Przewidywany czas (h)").fill("8");
  await page.getByLabel("Priorytet").selectOption("wysoki");
  await page.getByLabel("Stan").selectOption("todo");
  await page.getByRole("button", { name: "Utwórz" }).click();

  await expect(page.getByTestId(`task-name-${taskName}`)).toBeVisible();

  await page.getByRole("list").getByText(taskName).click();
  await page.getByRole("button", { name: "Edytuj" }).click();
  await page.getByLabel("Nazwa").fill(editedTaskName);
  await page.getByRole("button", { name: "Zapisz" }).click();

  await expect(page.getByTestId(`task-name-${editedTaskName}`)).toBeVisible();
  await page.getByRole("button", { name: "Usuń" }).click();
  await expect(
    page.getByTestId(`task-name-${editedTaskName}`)
  ).not.toBeVisible();

  // 4. usuwanie projektu wraz ze story do niego przypisanych
  await page.goto("http://localhost:3000");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByTestId(`delete-button-${editedProjectName}`).click();

  await expect(page.locator(`text=${editedProjectName}`)).not.toBeVisible();
  await expect(
    page.locator(
      `div:has-text("${editedProjectName}") >> text=Opis testowy projektu edit ${uuid}`
    )
  ).not.toBeVisible();
});
