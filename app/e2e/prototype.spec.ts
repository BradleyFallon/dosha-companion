import { expect, test, type Page } from '@playwright/test'

async function reachAssessment(page: Page) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Create account' }).click()
  await page.getByLabel('Email').fill('prototype@example.com')
  await page.getByLabel('Password').fill('not-stored')
  await page.getByLabel(/I accept the prototype terms/).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Preferred name').fill('Alex')
  await page.getByLabel('Age band').selectOption({ label: 'Prefer not to say' })
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Country or region').fill('United States')
  await page.getByRole('button', { name: 'Continue' }).click()
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
