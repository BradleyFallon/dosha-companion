import { expect, test, type Page } from '@playwright/test'

async function mockRegionalServices(page: Page) {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', (route) =>
    route.fulfill({
      json: {
        results: [{
          id: 1,
          name: 'Portland',
          latitude: 45.523,
          longitude: -122.676,
          country_code: 'US',
          country: 'United States',
          admin1: 'Oregon',
          admin1_id: 4100,
          timezone: 'America/Los_Angeles',
        }],
      },
    }),
  )
  await page.route('**/api.open-meteo.com/v1/forecast**', (route) =>
    route.fulfill({
      json: {
        timezone: 'America/Los_Angeles',
        current: { temperature_2m: 72, apparent_temperature: 70, weather_code: 1 },
        daily: {
          time: ['2026-07-17'],
          temperature_2m_max: [78],
          temperature_2m_min: [58],
          precipitation_probability_max: [20],
          sunrise: ['2026-07-17T05:40'],
          sunset: ['2026-07-17T20:55'],
        },
      },
    }),
  )
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

test('uses the clean production onboarding and all 27 questions without development shortcuts', async ({ page }) => {
  test.setTimeout(90_000)
  await mockRegionalServices(page)
  await page.goto('/')
  expect(await page.evaluate(() => localStorage.getItem('dosha-companion-prototype-state'))).toBeNull()
  await expect(page.getByRole('link', { name: 'Switch to short mode' })).toHaveCount(0)

  await page.getByRole('link', { name: 'Get started' }).click()
  await page.getByLabel('Preferred name').fill('Alex')
  await page.getByLabel('Year of birth').fill('1990')
  await page.getByRole('button', { name: 'Continue' }).click()

  await expect(page.getByRole('heading', { name: 'Choose your general area' })).toBeVisible()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2')
  await expect(page.getByRole('progressbar')).toHaveAttribute('max', '3')
  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page.getByRole('heading', { name: 'Let’s personalize the experience' })).toBeVisible()
  await expect(page.getByLabel('Preferred name')).toHaveValue('Alex')
  await expect(page.getByLabel('Year of birth')).toHaveValue('1990')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Search for your city').fill('Portland')
  await page.getByRole('button', { name: 'Search cities' }).click()
  await page.getByRole('button', { name: /Portland.*Oregon/i }).click()
  await page.getByRole('button', { name: 'Use this regional location' }).click()

  await expect(page.getByRole('heading', { name: 'Food preferences and exclusions' })).toBeVisible()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '3')
  await page.getByLabel('Dietary pattern').selectOption('Omnivore')
  await page.getByRole('group', { name: 'Do you have food allergies?' }).getByLabel('No').check()
  await page.getByRole('group', { name: 'Do you avoid any foods for other reasons?' }).getByLabel('No').check()
  await page.getByRole('button', { name: 'Save and continue' }).click()

  await expect(page.getByRole('heading', { name: 'Before the assessment' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Switch to short mode' })).toHaveCount(0)
  await page.goto('/assessment?demo=short')
  await expect(page.getByRole('link', { name: 'Switch to short mode' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Begin assessment' }).click()

  await page.setViewportSize({ width: 320, height: 700 })
  await expect(page.getByRole('progressbar')).toHaveAttribute('max', '27')
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1')
  await expectNoHorizontalOverflow(page)
  await page.getByRole('radio').first().check()
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.setViewportSize({ width: 360, height: 760 })
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2')
  await page.getByRole('button', { name: 'Back' }).click()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1')
  await expect(page.getByRole('radio').first()).toBeChecked()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expectNoHorizontalOverflow(page)

  await page.setViewportSize({ width: 390, height: 844 })
  for (let index = 1; index < 19; index += 1) {
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
  await expect(page.getByRole('link', { name: 'View complete sample' })).toHaveCount(0)
  await expect(page.getByText('Vata–Pitta')).toHaveCount(0)
  await page.getByRole('button', { name: 'Go to Today' }).click()
  await expect(page.getByRole('group', { name: 'Recommendation actions' })).toBeVisible()
})
