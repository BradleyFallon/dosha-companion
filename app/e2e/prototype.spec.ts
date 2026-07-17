import { expect, test, type Page } from '@playwright/test'

async function mockLocationServices(page: Page) {
  await page.route('**/nominatim.openstreetmap.org/reverse**', (route) => route.fulfill({ json: { display_name: 'Portland, Oregon, United States', address: { city: 'Portland', state: 'Oregon', country: 'United States', country_code: 'us', 'ISO3166-2-lvl4': 'OR' } } }))
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', (route) => route.fulfill({ json: { results: [{ id: 1, name: 'Portland', latitude: 45.523, longitude: -122.676, country_code: 'US', country: 'United States', admin1: 'Oregon', admin1_id: 4100, timezone: 'America/Los_Angeles' }] } }))
  await page.route('**/api.open-meteo.com/v1/forecast**', (route) => route.fulfill({ json: { timezone: 'America/Los_Angeles', current: { temperature_2m: 72, apparent_temperature: 70, weather_code: 1 }, daily: { time: ['2026-07-17'], temperature_2m_max: [78], temperature_2m_min: [58], precipitation_probability_max: [20], sunrise: ['2026-07-17T05:40'], sunset: ['2026-07-17T20:55'] } } }))
}

async function reachLocation(page: Page) {
  await mockLocationServices(page)
  await page.goto('/')
  await page.getByRole('link', { name: 'Get started' }).click()
  await page.getByLabel('Preferred name').fill('Alex')
  await page.getByLabel('Year of birth').fill('1990')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('heading', { name: 'Food preferences and exclusions' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}').state?.profile?.preferredName)).toBe('Alex')
  await page.goto('/profile/location')
}

async function reachAssessment(page: Page, short = true) {
  await mockLocationServices(page)
  await page.goto('/')
  await page.getByRole('link', { name: 'Get started' }).click()
  await page.getByLabel('Preferred name').fill('Alex')
  await page.getByLabel('Year of birth').fill('1990')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('heading', { name: 'Food preferences and exclusions' })).toBeVisible()
  await expect(page.getByRole('progressbar')).toHaveAttribute('max', '2')
  await page.getByLabel('Dietary pattern').selectOption('Omnivore')
  await page.getByRole('group', { name: 'Do you have food allergies?' }).getByLabel('No').check()
  await page.getByRole('group', { name: 'Do you avoid any foods for other reasons?' }).getByLabel('No').check()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  if (short) await page.getByRole('link', { name: 'Switch to short mode' }).click()
  await page.getByRole('button', { name: 'Begin assessment' }).click()
}

async function reachToday(page: Page) {
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
  await page.getByRole('link', { name: 'View complete sample' }).click()
  await page.getByRole('button', { name: 'Continue to Today' }).click()
  await expect(page.getByRole('group', { name: 'Recommendation actions' })).toBeVisible()
}

async function loadExampleProfile(page: Page) {
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Local data' }).click()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Load example profile' }).click()
  await page.goto('/today')
  await expect(page.locator('.weather-essentials')).toBeVisible()
}

async function reachTodayWithFullAssessment(page: Page) {
  await reachAssessment(page, false)
  for (let index = 0; index < 19; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await page.getByRole('button', { name: 'Continue' }).click()
  for (let index = 19; index < 27; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Your assessment summary' })).toBeVisible()
  await page.getByRole('button', { name: 'Go to Today' }).click()
}

test('discusses a Today recommendation in a persistent focused conversation', async ({ page }) => {
  await reachToday(page)
  await page.getByRole('link', { name: 'Ask about this recommendation' }).click()
  const contextControl = page.getByRole('button', { name: /Show context for/ })
  await expect(contextControl).toBeVisible()
  await expect(page.getByText('Discussing')).not.toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).not.toBeVisible()

  for (const viewport of [{ width: 390, height: 844 }, { width: 390, height: 667 }, { width: 360, height: 640 }]) {
    await page.setViewportSize(viewport)
    const composer = page.getByRole('textbox', { name: 'Ask a follow-up' })
    const composerBox = await composer.boundingBox()
    expect(composerBox).not.toBeNull()
    expect((composerBox?.y ?? 0) + (composerBox?.height ?? 0)).toBeLessThanOrEqual(viewport.height)
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true)
  }

  await page.getByRole('textbox', { name: 'Ask a follow-up' }).fill('Why might consistency help me today?')
  await page.keyboard.press('Enter')
  await expect(page.getByText(/deterministic guidance rules/)).toBeVisible()
  const citedArticle = page.locator('.chat-citations a[href^="/learn/"]').first()
  await expect(citedArticle).toBeVisible()
  await citedArticle.click()
  await expect(page.locator('.article-body')).toBeVisible()
  await page.goBack()
  await expect(page.getByText(/deterministic guidance rules/)).toBeVisible()
  await page.reload()
  await expect(page.getByText(/deterministic guidance rules/)).toBeVisible()
})

test('keeps Today actions calm and usable at supported mobile sizes', async ({ page }) => {
  await reachToday(page)
  await loadExampleProfile(page)

  await expect(page.getByRole('button', { name: 'Show recommendation details' })).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('button', { name: 'Dismiss for today' })).not.toBeVisible()
  const actionRow = page.getByRole('group', { name: 'Recommendation actions' })
  await expect(actionRow.getByText('Done', { exact: true })).toBeVisible()
  await expect(actionRow.getByText('Another', { exact: true })).toBeVisible()
  await expect(actionRow.getByText('Ask', { exact: true })).toBeVisible()

  for (const viewport of [{ width: 390, height: 844 }, { width: 390, height: 667 }, { width: 360, height: 640 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport)
    const controls = [
      page.getByRole('button', { name: 'Mark recommendation complete' }),
      page.getByRole('button', { name: 'Show another recommendation' }),
      page.getByRole('link', { name: 'Ask about this recommendation' }),
    ]
    const boxes = await Promise.all(controls.map((control) => control.boundingBox()))
    boxes.forEach((box) => {
      expect(box).not.toBeNull()
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44)
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
    })
    expect(Math.max(...boxes.map((box) => box?.y ?? 0)) - Math.min(...boxes.map((box) => box?.y ?? 0))).toBeLessThan(2)
    const layout = await page.evaluate(() => {
      const title = document.querySelector('.today-header > div')?.getBoundingClientRect()
      const settings = document.querySelector('.today-header .icon-control')?.getBoundingClientRect()
      const weather = document.querySelector<HTMLElement>('.weather-essentials')
      const navigation = document.querySelector('.bottom-nav')?.getBoundingClientRect()
      const actions = document.querySelector<HTMLElement>('.recommendation-icon-actions')
      return {
        noHorizontalOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        headerDoesNotCollide: Boolean(title && settings && title.right <= settings.left),
        weatherFits: Boolean(weather && weather.scrollWidth <= weather.clientWidth),
        navigationFits: Boolean(navigation && navigation.left >= 0 && navigation.right <= window.innerWidth),
        actionRowFits: Boolean(actions && actions.scrollWidth <= actions.clientWidth),
      }
    })
    expect(layout).toEqual({
      noHorizontalOverflow: true,
      headerDoesNotCollide: true,
      weatherFits: true,
      navigationFits: true,
      actionRowFits: true,
    })
  }

  await page.setViewportSize({ width: 320, height: 568 })
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  const scaledLabelBoxes = await page.locator('.recommendation-action-control > span').evaluateAll((labels) =>
    labels.map((label) => {
      const box = label.getBoundingClientRect()
      return { left: box.left, right: box.right, height: box.height }
    }),
  )
  expect(scaledLabelBoxes).toHaveLength(3)
  expect(scaledLabelBoxes.every((box) => box.height > 0)).toBe(true)
  expect(scaledLabelBoxes[0].right).toBeLessThanOrEqual(scaledLabelBoxes[1].left)
  expect(scaledLabelBoxes[1].right).toBeLessThanOrEqual(scaledLabelBoxes[2].left)
  await page.evaluate(() => { document.documentElement.style.removeProperty('font-size') })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('button', { name: 'Mark recommendation complete' }).click()
  await expect(page.getByRole('status')).toHaveText('Complete for today')
  await expect(page.locator('.daily-focus')).toHaveClass(/recommendation-just-completed/)
  await expect(page.getByRole('button', { name: 'Show another recommendation' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ask about this recommendation' })).toBeVisible()
  const reducedCompletionMotion = await page.locator('.primary-recommendation-action').evaluate((control) => ({
    halo: getComputedStyle(control, '::after').animationName,
    icon: getComputedStyle(control.querySelector('svg')!).animationName,
    note: getComputedStyle(document.querySelector('.daily-focus .completion-note')!).animationName,
  }))
  expect(reducedCompletionMotion).toEqual({ halo: 'none', icon: 'none', note: 'none' })
  expect(await page.evaluate(() => {
    const actions = document.querySelector<HTMLElement>('.recommendation-icon-actions')
    return Boolean(actions && actions.scrollWidth <= actions.clientWidth && document.documentElement.scrollWidth <= window.innerWidth + 1)
  })).toBe(true)

  await page.getByRole('button', { name: 'Show recommendation details' }).click()
  await expect(page.getByRole('button', { name: 'Dismiss for today' })).toBeVisible()
})

test('keeps representative daylight-theme contrast above WCAG thresholds', async ({ page }) => {
  await reachToday(page)
  await loadExampleProfile(page)
  await page.getByRole('button', { name: 'Mark recommendation complete' }).click()
  await expect(page.getByRole('status')).toHaveText('Complete for today')

  for (const phase of ['midday', 'sunset', 'twilight', 'night']) {
    await page.goto(`/today?daylight=${phase}`)
    const frame = page.locator('.app-frame')
    await expect(frame).toHaveAttribute('data-daylight-override', phase)
    await expect(page.locator('.weather-summary')).toBeVisible()
    await expect(page.locator('.daily-focus')).toHaveClass(/recommendation-complete/)
    await expect(page.locator('.daily-focus')).not.toHaveClass(/recommendation-just-completed/)
    await expect(page.getByRole('status')).toHaveText('Complete for today')
    await expect(page.getByRole('group', { name: 'Recommendation actions' }).getByText('Another', { exact: true })).toBeVisible()

    const ratios = await page.evaluate(() => {
      const appFrame = document.querySelector<HTMLElement>('.app-frame')!
      const feature = document.querySelector<HTMLElement>('.daily-focus')!
      const weather = document.querySelector<HTMLElement>('.weather-summary')!
      const navigation = document.querySelector<HTMLElement>('.bottom-nav')!
      const probes = document.createElement('div')
      probes.innerHTML = `
        <a class="contrast-accent" href="#">Accent link</a>
        <button class="button primary" type="button">Primary action</button>
        <p class="completion-note">Complete for today</p>
        <div class="global-notice">Restored notice</div>
        <div class="global-save-error">Not saved</div>
      `
      appFrame.append(probes)

      const parseColor = (value: string) => {
        const channels = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0]
        return [channels[0], channels[1], channels[2], channels[3] ?? 1] as const
      }
      const blend = (
        foreground: readonly [number, number, number, number],
        background: readonly [number, number, number, number],
      ) => {
        const alpha = foreground[3] + background[3] * (1 - foreground[3])
        return [
          (foreground[0] * foreground[3] + background[0] * background[3] * (1 - foreground[3])) / alpha,
          (foreground[1] * foreground[3] + background[1] * background[3] * (1 - foreground[3])) / alpha,
          (foreground[2] * foreground[3] + background[2] * background[3] * (1 - foreground[3])) / alpha,
          alpha,
        ] as const
      }
      const luminance = (color: readonly [number, number, number, number]) => {
        const channels = color.slice(0, 3).map((channel) => {
          const value = channel / 255
          return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
        })
        return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2]
      }
      const contrast = (foreground: string, background: string, backdrop = 'rgb(255, 255, 255)') => {
        const opaqueBackdrop = parseColor(backdrop)
        const opaqueBackground = blend(parseColor(background), opaqueBackdrop)
        const opaqueForeground = blend(parseColor(foreground), opaqueBackground)
        const foregroundLuminance = luminance(opaqueForeground)
        const backgroundLuminance = luminance(opaqueBackground)
        return (Math.max(foregroundLuminance, backgroundLuminance) + .05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + .05)
      }
      const style = (selector: string) => getComputedStyle(document.querySelector<HTMLElement>(selector)!)
      const frameStyle = getComputedStyle(appFrame)
      const featureStyle = getComputedStyle(feature)
      const weatherStyle = getComputedStyle(weather)
      const navStyle = getComputedStyle(navigation)
      const settings = document.querySelector<HTMLElement>('.today-header .icon-control')!
      settings.focus()
      const paperFocus = getComputedStyle(settings).outlineColor
      const recommendationInfo = document.querySelector<HTMLElement>('.recommendation-info-control')!
      recommendationInfo.focus()
      const featureFocus = getComputedStyle(recommendationInfo).outlineColor

      const values = {
        mainText: contrast(style('.today-header h1').color, frameStyle.backgroundColor),
        mutedText: contrast(style('.today-date').color, frameStyle.backgroundColor),
        supportingText: contrast(style('.recommendation-action').color, featureStyle.backgroundColor),
        actionLabel: contrast(style('.recommendation-action-control > span').color, featureStyle.backgroundColor),
        accentLink: contrast(style('.contrast-accent').color, frameStyle.backgroundColor),
        primaryAction: contrast(style('.button.primary').color, style('.button.primary').backgroundColor),
        weatherText: contrast(style('.weather-primary span').color, weatherStyle.backgroundColor),
        navigationActive: contrast(style('.bottom-nav a.active').color, style('.bottom-nav a.active').backgroundColor),
        navigationInactive: contrast(style('.bottom-nav a:not(.active)').color, navStyle.backgroundColor, frameStyle.backgroundColor),
        completionStatus: contrast(style('.completion-note').color, style('.completion-note').backgroundColor),
        notice: contrast(style('.global-notice').color, style('.global-notice').backgroundColor),
        error: contrast(style('.global-save-error').color, style('.global-save-error').backgroundColor),
        focusOnPaper: contrast(paperFocus, frameStyle.backgroundColor),
        focusOnFeature: contrast(featureFocus, featureStyle.backgroundColor),
      }
      probes.remove()
      return values
    })

    for (const [name, ratio] of Object.entries(ratios)) {
      expect(ratio, `${phase} ${name}`).toBeGreaterThanOrEqual(name.startsWith('focus') ? 3 : 4.5)
    }
  }
})

test('starts an article conversation from Learn and uses a suggestion', async ({ page }) => {
  await reachToday(page)
  await page.getByRole('link', { name: 'Learn', exact: true }).click()
  await expect(page.getByText(/An educational overview of qualities commonly associated with Vata/i)).not.toBeVisible()
  await page.locator('a[href="/learn/vata"]').click()
  await page.getByRole('link', { name: 'Ask about this article' }).click()
  await expect(page.getByRole('heading', { name: 'Vata' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Show context for Vata' })).toBeVisible()
  await expect(page.getByText('Learning article')).not.toBeVisible()
  await page.getByRole('button', { name: 'Can you explain this more simply?' }).click()
  await expect(page.getByText(/educational organizing concepts rather than diagnoses/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Vata', exact: true })).toBeVisible()
})

test('anchors seasonal-food chat to the saved regional context', async ({ page }) => {
  await reachToday(page)
  await page.getByRole('link', { name: 'Add my location' }).click()
  await page.getByRole('button', { name: 'Choose on map' }).click()
  await page.getByRole('button', { name: 'Use this regional location' }).click()
  await expect(page.getByRole('heading', { name: 'In season near you' })).toBeVisible()
  const food = page.locator('.seasonal-food-list li').first()
  const name = (await food.locator('strong').textContent()) ?? ''
  await food.getByRole('link', { name: `Ask about ${name}` }).click()
  await expect(page.getByRole('heading', { name })).toBeVisible()
  await page.getByRole('button', { name: `Show context for ${name}` }).click()
  await expect(page.getByText(/Portland, Oregon, United States/)).toBeVisible()
  await page.getByRole('button', { name: 'Why is this shown as seasonal?' }).click()
  await expect(page.getByText(/currently listed as seasonal/)).toBeVisible()
})

test('talks through a completed check-in with recent-answer context', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await reachToday(page)
  await page.getByRole('link', { name: 'Check In', exact: true }).click()
  await page.getByRole('link', { name: 'Start check-in' }).click()
  for (let index = 0; index < 5; index += 1) {
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: index === 4 ? 'Complete check-in' : 'Continue' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Check-in saved' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Done' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Talk through .* check-in/ })).toBeVisible()
  await expect(page.locator('.check-in-completion-mark')).toBeVisible()
  const reducedMotion = await page.locator('.check-in-completion-mark').evaluate((mark) => ({
    halo: getComputedStyle(mark, '::before').animationName,
    icon: getComputedStyle(mark.querySelector('.check-in-complete-icon')!).animationName,
  }))
  expect(reducedMotion).toEqual({ halo: 'none', icon: 'none' })
  for (const viewport of [{ width: 390, height: 844 }, { width: 390, height: 667 }, { width: 360, height: 640 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  }
  await expect(page.getByText('About this check-in').locator('..')).not.toHaveAttribute('open')
  await page.getByRole('link', { name: /Talk through .* check-in/ }).click()
  await page.getByRole('button', { name: /Show context for/ }).click()
  await expect(page.getByText(/5 recent answers saved separately/)).toBeVisible()
  await page.getByRole('button', { name: 'What should I keep observing?' }).click()
  await expect(page.getByText(/temporary pattern to observe/)).toBeVisible()
})

test('explores graphical My Balance patterns without implied scoring', async ({ page }) => {
  test.setTimeout(60_000)
  await reachTodayWithFullAssessment(page)
  await page.getByRole('link', { name: 'Check In', exact: true }).click()
  await page.getByRole('link', { name: 'Start check-in' }).click()
  for (let index = 0; index < 5; index += 1) {
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: index === 4 ? 'Complete check-in' : 'Continue' }).click()
  }
  await page.getByRole('link', { name: 'Check In' }).click()
  await page.getByRole('link', { name: 'My Balance' }).click()

  await expect(page.getByRole('link', { name: 'Usual pattern: 19 of 19 areas represented' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Recent pattern: 5 of 7 areas represented' })).toBeVisible()
  await expect(page.getByText('Coverage ready')).not.toBeVisible()
  await expect(page.getByText(/usable answers/)).not.toBeVisible()
  await expect(page.getByText('No dosha result calculated')).not.toBeVisible()

  for (const viewport of [{ width: 390, height: 844 }, { width: 390, height: 667 }, { width: 360, height: 640 }]) {
    await page.setViewportSize(viewport)
    const domains = page.locator('.balance-domain-control')
    await expect(domains).toHaveCount(6)
    for (let index = 0; index < 6; index += 1) {
      const box = await domains.nth(index).boundingBox()
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44)
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
    }
    const action = page.locator('.balance-primary-action')
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight }))
    const actionBox = await action.boundingBox()
    const navigationBox = await page.getByRole('navigation', { name: 'Primary navigation' }).boundingBox()
    expect((actionBox?.y ?? 0) + (actionBox?.height ?? 0)).toBeLessThanOrEqual(viewport.height)
    expect((actionBox?.y ?? 0) + (actionBox?.height ?? 0)).toBeLessThanOrEqual(navigationBox?.y ?? viewport.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
  }

  await page.getByRole('link', { name: 'Sleep: close to usual' }).click()
  await expect(page.getByRole('heading', { name: 'Sleep' })).toBeVisible()
  await expect(page.getByText('Light and interrupted')).toBeVisible()
  await expect(page.getByText('Light and variable')).toBeVisible()
  await expect(page.locator('.balance-comparison-label')).toContainText('Close to usual')
  await expect(page.getByText('View response details').locator('..')).not.toHaveAttribute('open')
  await page.getByRole('link', { name: 'Ask about this' }).click()
  await expect(page.getByRole('button', { name: 'Show context for Sleep' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to My Balance' }).click()
  await expect(page.getByRole('heading', { name: 'Sleep' })).toBeVisible()
  await page.getByRole('link', { name: /Open check-in from/ }).click()
  await expect(page.getByText('5 answers')).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Sleep' })).toBeVisible()
})

test('completes the short mobile vertical slice', async ({ page }) => {
  let weatherRequests = 0
  page.on('request', (request) => { if (request.url().includes('api.open-meteo.com/v1/forecast')) weatherRequests += 1 })
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
  await expect(page.getByRole('group', { name: 'Recommendation actions' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'See what supports you where you live' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Local weather' })).not.toBeVisible()
  await expect(page.getByRole('heading', { name: 'In season near you' })).not.toBeVisible()
  expect(weatherRequests).toBe(0)
  await page.getByRole('link', { name: 'Add my location' }).click()
  await expect(page.getByRole('heading', { name: 'Choose your general area' })).toBeVisible()
  await page.getByRole('button', { name: 'Choose on map' }).click()
  await page.getByRole('button', { name: 'Use this regional location' }).click()
  await expect(page.getByRole('group', { name: 'Recommendation actions' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Local weather' })).toBeVisible()
  await expect(page.getByText('72°F')).toBeVisible()
  await expect(page.getByText('78°F / 58°F')).toBeVisible()
  await expect(page.getByText('20%')).toBeVisible()
  await expect(page.getByText('Feels like')).not.toBeVisible()
  await page.getByRole('button', { name: 'Show weather details' }).click()
  await expect(page.getByText('Feels like')).toBeVisible()
  await expect(page.getByText('70°F')).toBeVisible()
  await expect(page.getByText('Portland, Oregon, United States')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'In season near you' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'See what supports you where you live' })).not.toBeVisible()
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
  await page.getByRole('button', { name: 'Show recommendation details' }).click()
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
  await expect(page.getByRole('heading', { name: 'Approximate device area' })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Map showing an adjustable regional pin' })).toBeVisible()
  await page.getByRole('button', { name: 'Use this regional location' }).click()
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
      areaId: 'grid-v1:45.5:-122.7',
      precisionKm: 10,
      displayName: 'Portland, Oregon, United States',
      countryCode: 'US',
      admin1Code: 'OR',
      produceRegionId: 'us-pacific-northwest',
    })
  const location = await page.evaluate(() => JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}').state?.profile?.location)
  expect(location).not.toHaveProperty('units')
})

test('resolves a city search to a normalized regional location', async ({ page }) => {
  await reachLocation(page)
  await page.getByLabel('Search for your city').fill('Portland')
  await page.getByRole('button', { name: 'Search cities' }).click()
  await page.getByRole('button', { name: /Portland.*Oregon/i }).click()
  await page.getByRole('button', { name: 'Use this regional location' }).click()
  await expect(page.getByRole('heading', { name: 'Food preferences and exclusions' })).toBeVisible()
  const location = await page.evaluate(() => JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}').state?.profile?.location)
  expect(location).toMatchObject({ source: 'city', areaId: 'grid-v1:45.5:-122.7', countryCode: 'US', produceRegionId: 'us-pacific-northwest' })
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
  await page.getByRole('link', { name: 'Open settings' }).click()
  const settingsRowBox = await page.getByRole('button', { name: 'Profile' }).boundingBox()
  expect(settingsRowBox?.height ?? 0).toBeGreaterThanOrEqual(44)

  await page.getByRole('button', { name: 'Profile' }).click()
  await page.getByLabel('Preferred name').fill('Jordan')
  await page.getByLabel(/Dietary pattern/).selectOption('Vegan')
  await page.getByRole('group', { name: 'Food allergies?' }).getByLabel('Yes').check()
  await page.getByLabel('Food allergies').fill('Tree nuts')
  await page.getByRole('button', { name: 'Save profile' }).click()
  await expect(page.getByText('Profile saved.')).toBeVisible()
  await page.getByRole('button', { name: 'Location' }).click()
  await expect(page.getByRole('link', { name: 'Add regional location' })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Temperature units' })).not.toBeVisible()
  await page.getByRole('link', { name: 'Add regional location' }).click()
  await page.getByRole('button', { name: 'Choose on map' }).click()
  await page.getByRole('button', { name: 'Use this regional location' }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await page.getByRole('button', { name: 'Location' }).click()
  await expect(page.getByRole('link', { name: 'Change regional location' })).toBeVisible()
  await page.getByRole('button', { name: 'Units' }).click()
  await expect(page.getByRole('group', { name: 'Temperature units' })).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Profile' }).click()
  await expect(page.getByLabel('Preferred name')).toHaveValue('Jordan')
  await page.getByRole('link', { name: 'Today' }).first().click()
  await expect(page.getByRole('heading', { name: /Good (morning|afternoon|evening), Jordan/ })).toBeVisible()
  await page.getByRole('button', { name: 'Show recommendation details' }).click()
  await expect(page.getByRole('heading', { name: 'Why it was chosen' })).toBeVisible()

  const savedState = await page.evaluate(() => {
    const snapshot = JSON.parse(localStorage.getItem('dosha-companion-prototype-state') ?? '{}')
    return {
      submittedCount: Object.keys(snapshot.state?.submittedAnswers ?? {}).length,
      dietaryPattern: snapshot.state?.profile?.dietaryPattern,
      allergies: snapshot.state?.profile?.allergies,
    }
  })
  expect(savedState).toEqual({ submittedCount: 5, dietaryPattern: 'Vegan', allergies: 'Tree nuts' })
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

  await page.getByRole('button', { name: 'Mark recommendation complete' }).click()
  await expect(page.getByText('Complete for today')).toBeVisible()
  await page.getByRole('button', { name: 'Show another recommendation' }).click()

  await page.getByRole('link', { name: 'Check In', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Check In' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start check-in' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Detailed check-in' })).not.toBeVisible()
  await page.getByRole('link', { name: 'Start check-in' }).click()
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).not.toBeVisible()
  for (const viewport of [{ width: 390, height: 844 }, { width: 390, height: 667 }, { width: 360, height: 640 }]) {
    await page.setViewportSize(viewport)
    const action = page.getByRole('button', { name: 'Continue' })
    const actionBox = await action.boundingBox()
    const closeBox = await page.getByRole('link', { name: 'Finish later' }).boundingBox()
    const answerBox = await page.getByRole('radio').first().locator('..').boundingBox()
    expect(actionBox).not.toBeNull()
    expect(closeBox).not.toBeNull()
    expect(answerBox).not.toBeNull()
    expect((actionBox?.y ?? 0) + (actionBox?.height ?? 0)).toBeLessThanOrEqual(viewport.height)
    expect(answerBox?.height ?? 0).toBeGreaterThanOrEqual(44)
    expect(closeBox?.width ?? 0).toBeGreaterThanOrEqual(44)
    expect(closeBox?.height ?? 0).toBeGreaterThanOrEqual(44)
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true)
  }
  for (let index = 0; index < 5; index += 1) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(index + 1))
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: index === 4 ? 'Complete check-in' : 'Continue' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Check-in saved' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Done' })).toBeVisible()
  await expect(page.getByText('About this check-in').locator('..')).not.toHaveAttribute('open')
  await page.getByRole('link', { name: 'Check In' }).click()
  await expect(page.getByRole('link', { name: /Review .* check-in/ }).first()).toBeVisible()

  await page.getByRole('link', { name: 'My Balance' }).click()
  await expect(page.getByRole('link', { name: /Recent pattern:/ })).toBeVisible()
  await page.getByRole('link', { name: 'Learn', exact: true }).click()
  await page.getByLabel('Search articles').fill('routine')
  await page.getByRole('link', { name: /Routine and consistency/i }).click()
  await expect(page.getByRole('heading', { name: 'Routine and consistency' })).toBeVisible()
  await page.getByRole('link', { name: 'Learn' }).first().click()
  await page.getByRole('link', { name: 'Ask Dosha Companion' }).click()
  await page.getByRole('button', { name: 'What is Vata?' }).click()
  await expect(page.getByText(/closest match in the app’s learning catalog/)).toBeVisible()

  await page.getByRole('link', { name: 'Back to Today' }).click()
  await page.getByRole('link', { name: 'Open settings' }).click()
  await expect(page.getByRole('button', { name: 'Local data' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Export local data' })).not.toBeVisible()
  await page.getByRole('button', { name: 'Local data' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export local data' }).click()
  expect((await downloadPromise).suggestedFilename()).toMatch(/dosha-companion-local-data/)
})
