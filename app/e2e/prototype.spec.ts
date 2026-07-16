import { expect, test, type Page } from '@playwright/test'

async function reachLocation(page: Page) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Get started' }).click()
  await page.getByLabel('Preferred name').fill('Alex')
  await page.getByLabel('Year of birth').fill('1990')
  await page.getByRole('button', { name: 'Continue' }).click()
}

async function reachAssessment(page: Page, short = true) {
  await reachLocation(page)
  await page.getByRole('button', { name: 'Choose on map' }).click()
  await page.getByRole('button', { name: 'Use this location' }).click()
  await page.getByLabel('Dietary pattern').selectOption('Omnivore')
  await page.getByRole('group', { name: 'Do you have food allergies?' }).getByLabel('No').check()
  await page.getByRole('group', { name: 'Do you avoid any foods for other reasons?' }).getByLabel('No').check()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  if (short) await page.getByRole('link', { name: 'Switch to short mode' }).click()
  await page.getByRole('button', { name: 'Begin assessment' }).click()
}

test('completes the short mobile vertical slice', async ({ page }) => {
  await reachAssessment(page)

  const continueButton = page.getByRole('button', { name: 'Continue' })
  const continueBox = await continueButton.boundingBox()
  const viewport = page.viewportSize()
  expect(continueBox).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect((continueBox?.y ?? 0) + (continueBox?.height ?? 0)).toBeLessThanOrEqual(viewport?.height ?? 0)
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true)

  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('radio').first()).toBeChecked()
  await page.keyboard.press('Enter')

  for (let index = 1; index < 3; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }

  await expect(page.getByRole('heading', { name: /how you’ve been feeling recently/i })).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()

  for (let index = 0; index < 2; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 4))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }

  await expect(page.getByRole('heading', { name: 'A little more information is needed' })).toBeVisible()
  await page.getByRole('link', { name: 'View complete sample' }).click()
  await expect(page.getByRole('heading', { name: 'Profile overview' })).toBeVisible()
  await expect(page.getByText('Vata–Pitta')).toBeVisible()
  await page.getByRole('button', { name: 'Continue to Today' }).click()
  await expect(page.getByText('For today')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
})

test('completes the full assessment with coverage-ready but unavailable scoring', async ({ page }) => {
  await reachAssessment(page, false)

  for (let index = 0; index < 19; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await expect(page.getByRole('heading', { name: /how you’ve been feeling recently/i })).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()

  for (let index = 19; index < 27; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: 'Continue' }).click()
  }

  await expect(page.getByRole('heading', { name: 'Your assessment summary' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dosha scoring is not available yet' })).toBeVisible()
  await expect(page.getByText('Vata–Pitta')).not.toBeVisible()
  await page.getByRole('button', { name: 'Go to Today' }).click()
  await expect(page.getByText('Assessment coverage · ready')).toBeVisible()
  await page.getByRole('button', { name: 'Why this was chosen' }).click()
  await expect(page.getByText('No dosha score was calculated or used.')).toBeVisible()
})

test('reloads and resumes submitted assessment progress', async ({ page }) => {
  await reachAssessment(page)
  await page.getByRole('radio').first().check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2')

  await page.reload()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2')
  await page.getByRole('link', { name: 'Save and exit' }).click()
  await page.getByRole('link', { name: 'Resume' }).click()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2')
})

test('uses a one-shot device location and persists only a coarse position', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['geolocation'], {
    origin: 'http://127.0.0.1:4173',
  })
  await context.setGeolocation({ latitude: 45.5231, longitude: -122.6765, accuracy: 25 })
  await reachLocation(page)

  await page.getByRole('button', { name: 'Use my current location' }).click()
  await expect(page.getByRole('heading', { name: 'Approximate device location' })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Map showing an adjustable location pin' })).toBeVisible()
  await page.getByRole('button', { name: 'Use this location' }).click()
  await expect(page.getByRole('heading', { name: 'Food preferences and exclusions' })).toBeVisible()

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const snapshot = JSON.parse(
          localStorage.getItem('dosha-companion-prototype-state') ?? '{}',
        )
        return snapshot.state?.profile?.location
      }),
    )
    .toMatchObject({
      source: 'device',
      latitude: 45.5,
      longitude: -122.7,
      accuracyMeters: 10_000,
      areaId: 'grid-v1:45.5:-122.7',
      precisionKm: 10,
    })
})

test('edits profile settings, preserves answers, and recalculates Today', async ({ page }) => {
  await reachAssessment(page)
  for (let index = 0; index < 3; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await page.getByRole('button', { name: 'Continue' }).click()
  for (let index = 0; index < 2; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 4))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await page.getByRole('link', { name: 'View complete sample' }).click()
  await page.getByRole('button', { name: 'Continue to Today' }).click()
  await page.getByRole('link', { name: 'Open profile settings' }).click()

  await page.getByLabel('Preferred name').fill('Jordan')
  await page.getByLabel(/Dietary pattern/).selectOption('Vegan')
  await page.getByLabel(/Allergies/).fill('Tree nuts')
  await page.getByRole('button', { name: 'Save profile changes' }).click()
  await expect(page.getByText('Saved on this device').first()).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Preferred name')).toHaveValue('Jordan')
  await page.getByRole('link', { name: 'Today' }).first().click()
  await expect(page.getByRole('heading', { name: /Good (morning|afternoon|evening), Jordan/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Food suggestion withheld' })).toBeVisible()

  const submittedCount = await page.evaluate(() => {
    const snapshot = JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}')
    return Object.keys(snapshot.state?.submittedAnswers ?? {}).length
  })
  expect(submittedCount).toBe(5)
})

test('uses every post-assessment destination in the mobile demo', async ({ page }) => {
  test.setTimeout(60_000)
  await reachAssessment(page)
  for (let index = 0; index < 3; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await page.getByRole('button', { name: 'Continue' }).click()
  for (let index = 0; index < 2; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 4))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await page.getByRole('link', { name: 'View complete sample' }).click()
  await page.getByRole('button', { name: 'Continue to Today' }).click()

  await page.getByRole('button', { name: 'Mark complete' }).click()
  await expect(page.getByText('Marked complete for today.')).toBeVisible()
  await page.getByRole('button', { name: 'Show another' }).click()

  await page.getByRole('link', { name: 'Questions' }).click()
  await expect(page.getByRole('heading', { name: 'Questions' })).toBeVisible()
  await page.getByRole('link', { name: 'Start current check-in' }).click()
  for (let index = 0; index < 5; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: index === 4 ? 'Complete check-in' : 'Continue' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Your recent answers were saved' })).toBeVisible()
  await page.getByRole('link', { name: 'View check-in history' }).click()
  await expect(page.getByText(/Completed · 5 answers/)).toBeVisible()

  await page.getByRole('link', { name: 'My Balance' }).click()
  await expect(page.getByText('1 completed')).toBeVisible()
  await page.getByRole('link', { name: 'Learn', exact: true }).click()
  await page.getByLabel('Search articles').fill('routine')
  await page.getByRole('link', { name: /Routine and consistency/i }).click()
  await expect(page.getByRole('heading', { name: 'Routine and consistency' })).toBeVisible()
  await page.getByRole('link', { name: 'Learn' }).first().click()
  await page.getByRole('link', { name: 'Search with guided help' }).click()
  await page.getByRole('button', { name: 'What is Vata?' }).click()
  await expect(page.getByRole('heading', { name: 'Matching content' })).toBeVisible()

  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Today', exact: true }).click()
  await page.getByRole('link', { name: 'Open profile settings' }).click()
  await expect(page.getByText('Browser localStorage')).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export local data as JSON' }).click()
  expect((await downloadPromise).suggestedFilename()).toMatch(/dosha-companion-local-data/)
})
