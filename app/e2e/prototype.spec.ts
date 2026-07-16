import { expect, test, type Page } from '@playwright/test'

async function reachLocation(page: Page) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Create account' }).click()
  await page.getByLabel('Email').fill('prototype@example.com')
  await page.getByLabel('Password').fill('not-stored')
  await page.getByLabel(/I accept the prototype terms/).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Preferred name').fill('Alex')
  await page.getByLabel('Age band').selectOption({ label: 'Prefer not to say' })
  await page.getByRole('button', { name: 'Continue' }).click()
}

async function reachAssessment(page: Page) {
  await reachLocation(page)
  await page.getByRole('button', { name: 'Skip for now' }).click()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await page.getByRole('link', { name: 'Switch to short mode' }).click()
  await page.getByRole('button', { name: 'Begin assessment' }).click()
}

test('completes the short mobile vertical slice', async ({ page }) => {
  await reachAssessment(page)

  for (let index = 0; index < 3; index += 1) {
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

  await expect(page.getByRole('heading', { name: 'Your starting profile' })).toBeVisible()
  await expect(page.getByText('Vata–Pitta')).toBeVisible()
  await page.getByRole('button', { name: 'Go to Today' }).click()
  await expect(page.getByText('Choose one consistent time for your next meal or short break.')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
})

test('reloads and resumes submitted assessment progress', async ({ page }) => {
  await reachAssessment(page)
  await page.getByRole('radio').first().check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2')

  await page.reload()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2')
  await page.getByRole('link', { name: 'Save and exit' }).click()
  await page.getByRole('link', { name: 'Resume prototype' }).click()
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
      latitude: 45.52,
      longitude: -122.68,
      accuracyMeters: 1000,
    })
})
