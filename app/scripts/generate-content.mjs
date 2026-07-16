import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

const appRoot = process.cwd()
const repoRoot = path.resolve(appRoot, '..')
const contentRoot = path.join(repoRoot, 'content')
const outputPath = path.join(appRoot, 'src/generated/contentCatalog.ts')

const statuses = new Set(['provisional', 'approved'])
const publicationStatuses = new Set(['draft', 'published', 'withdrawn'])
const articleCategories = new Set(['foundations', 'doshas', 'assessment', 'daily-practice', 'using-the-app'])
const recommendationCategories = new Set(['safety', 'routine', 'transitions', 'rest', 'check-in', 'food'])
const tags = new Set([
  'ayurveda', 'basics', 'safety', 'doshas', 'vata', 'pitta', 'kapha', 'assessment',
  'nature', 'current-balance', 'check-ins', 'coverage', 'routine', 'consistency',
  'rest', 'transitions', 'recommendations', 'provisional', 'food',
])
const contexts = new Set(['physical-change', 'travel', 'life-event', 'insufficient-current', 'general'])
const times = new Set(['morning', 'day', 'evening', 'any'])
const diets = new Set(['all', 'omnivore', 'vegetarian', 'vegan', 'pescatarian', 'other', 'unspecified'])
const exclusionPolicies = new Set(['general-only', 'requires-empty-allergies-and-exclusions'])

function fail(message) {
  throw new Error(`Content validation failed: ${message}`)
}

function readJson(relativePath) {
  const filePath = path.join(contentRoot, relativePath)
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    fail(`${relativePath} is not valid JSON (${error.message})`)
  }
}

function requireText(value, field, source) {
  if (typeof value !== 'string' || !value.trim()) fail(`${source}: ${field} is required`)
  return value.trim()
}

function requireId(value, field, source) {
  const id = requireText(value, field, source)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail(`${source}: ${field} must be a lowercase kebab-case ID`)
  return id
}

function requireArray(value, field, source) {
  if (!Array.isArray(value)) fail(`${source}: ${field} must be an array`)
  return value
}

function validateStatus(item, source) {
  if (!statuses.has(item.status)) fail(`${source}: invalid status ${item.status}`)
  if (!publicationStatuses.has(item.publicationStatus)) fail(`${source}: invalid publicationStatus ${item.publicationStatus}`)
  if (item.status === 'approved' && item.publicationStatus === 'published' && !item.approvedBy) {
    fail(`${source}: approved published content requires approvedBy`)
  }
}

function validateTags(values, source) {
  const result = requireArray(values, 'tags', source).map((value) => requireText(value, 'tag', source))
  for (const tag of result) if (!tags.has(tag)) fail(`${source}: unknown tag ${tag}`)
  return result
}

function parseArticle(fileName) {
  const source = `learn/${fileName}`
  const raw = fs.readFileSync(path.join(contentRoot, source), 'utf8').replace(/\r\n/g, '\n')
  const match = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/)
  if (!match) fail(`${source}: expected JSON metadata between --- lines`)
  let metadata
  try {
    metadata = JSON.parse(match[1])
  } catch (error) {
    fail(`${source}: metadata is not valid JSON (${error.message})`)
  }
  const id = requireId(metadata.id, 'id', source)
  const body = requireText(match[2], 'body', source)
  const category = requireText(metadata.category, 'category', source)
  if (!articleCategories.has(category)) fail(`${source}: invalid category ${category}`)
  validateStatus(metadata, source)
  return {
    id,
    title: requireText(metadata.title, 'title', source),
    summary: requireText(metadata.summary, 'summary', source),
    category,
    tags: validateTags(metadata.tags, source),
    status: metadata.status,
    publicationStatus: metadata.publicationStatus,
    relatedArticleIds: requireArray(metadata.relatedArticleIds, 'relatedArticleIds', source),
    body,
  }
}

const articleFiles = fs.readdirSync(path.join(contentRoot, 'learn')).filter((file) => file.endsWith('.md')).sort()
const articles = articleFiles.map(parseArticle)
const recommendations = readJson('recommendations/recommendations.json')
const glossary = readJson('glossary/glossary.json')
const checkInSets = readJson('check-ins/check-in-sets.json')
const seasonalProduce = readJson('seasonal-produce/produce.json')

function assertUnique(items, label) {
  const seen = new Set()
  for (const item of items) {
    const id = requireId(item.id, 'id', `${label} item`)
    if (seen.has(id)) fail(`${label}: duplicate ID ${id}`)
    seen.add(id)
  }
  return seen
}

const articleIds = assertUnique(articles, 'articles')
const recommendationIds = assertUnique(recommendations, 'recommendations')
const glossaryIds = assertUnique(glossary, 'glossary')
const checkInSetIds = assertUnique(checkInSets, 'check-in sets')
assertUnique(seasonalProduce, 'seasonal produce')
void recommendationIds
void glossaryIds

for (const article of articles) {
  for (const relatedId of article.relatedArticleIds) {
    if (!articleIds.has(relatedId)) fail(`article ${article.id}: unknown relatedArticleId ${relatedId}`)
  }
}

const questionRows = Papa.parse(fs.readFileSync(path.join(repoRoot, 'data/quiz/questions.csv'), 'utf8'), {
  header: true,
  skipEmptyLines: true,
}).data
const currentQuestionIds = new Set(questionRows.filter((row) => row.assessment_type === 'current').map((row) => row.question_id))

for (const set of checkInSets) {
  const source = `check-in set ${set.id}`
  requireText(set.title, 'title', source)
  requireText(set.summary, 'summary', source)
  validateStatus(set, source)
  const questionIds = requireArray(set.questionIds, 'questionIds', source)
  if (questionIds.length === 0) fail(`${source}: at least one question is required`)
  if (new Set(questionIds).size !== questionIds.length) fail(`${source}: duplicate question ID`)
  for (const questionId of questionIds) {
    if (!currentQuestionIds.has(questionId)) fail(`${source}: ${questionId} is not a canonical current question`)
  }
}

for (const item of recommendations) {
  const source = `recommendation ${item.id}`
  requireText(item.title, 'title', source)
  requireText(item.summary, 'summary', source)
  requireText(item.guidance, 'guidance', source)
  requireText(item.action, 'action', source)
  requireText(item.rationale, 'rationale', source)
  validateStatus(item, source)
  if (!recommendationCategories.has(item.category)) fail(`${source}: invalid category ${item.category}`)
  validateTags(item.tags, source)
  for (const context of requireArray(item.contexts, 'contexts', source)) if (!contexts.has(context)) fail(`${source}: invalid context ${context}`)
  for (const time of requireArray(item.times, 'times', source)) if (!times.has(time)) fail(`${source}: invalid time ${time}`)
  for (const diet of requireArray(item.dietaryApplicability, 'dietaryApplicability', source)) if (!diets.has(diet)) fail(`${source}: invalid dietary applicability ${diet}`)
  if (!exclusionPolicies.has(item.exclusionPolicy)) fail(`${source}: invalid exclusionPolicy ${item.exclusionPolicy}`)
  if (!articleIds.has(item.relatedArticleId)) fail(`${source}: unknown relatedArticleId ${item.relatedArticleId}`)
  if (item.checkInSetId !== null && !checkInSetIds.has(item.checkInSetId)) fail(`${source}: unknown checkInSetId ${item.checkInSetId}`)
}

for (const item of glossary) {
  const source = `glossary ${item.id}`
  requireText(item.term, 'term', source)
  requireText(item.definition, 'definition', source)
  requireArray(item.aliases, 'aliases', source)
  validateStatus(item, source)
  if (!articleIds.has(item.relatedArticleId)) fail(`${source}: unknown relatedArticleId ${item.relatedArticleId}`)
}

for (const item of seasonalProduce) {
  const source = `seasonal produce ${item.id}`
  requireText(item.name, 'name', source)
  requireArray(item.produceRegionIds, 'produceRegionIds', source).forEach((value) => requireText(value, 'produceRegionId', source))
  requireArray(item.months, 'months', source).forEach((value) => { if (!Number.isInteger(value) || value < 1 || value > 12) fail(`${source}: invalid month ${value}`) })
  requireArray(item.diets, 'diets', source).forEach((value) => { if (!diets.has(value)) fail(`${source}: invalid diet ${value}`) })
  if (!articleIds.has(item.articleId)) fail(`${source}: unknown articleId ${item.articleId}`)
}

const generated = `// This file is generated by scripts/generate-content.mjs. Do not edit directly.\n\n` +
`export type ContentStatus = 'provisional' | 'approved'\n` +
`export type PublicationStatus = 'draft' | 'published' | 'withdrawn'\n\n` +
`export interface LearningArticle { id: string; title: string; summary: string; category: string; tags: string[]; status: ContentStatus; publicationStatus: PublicationStatus; relatedArticleIds: string[]; body: string }\n` +
`export interface RecommendationContent { id: string; title: string; summary: string; guidance: string; action: string; category: string; contexts: string[]; times: string[]; tags: string[]; status: ContentStatus; publicationStatus: PublicationStatus; relatedArticleId: string; checkInSetId: string | null; dietaryApplicability: string[]; exclusionPolicy: string; rationale: string }\n` +
`export interface GlossaryEntry { id: string; term: string; definition: string; aliases: string[]; relatedArticleId: string; status: ContentStatus; publicationStatus: PublicationStatus }\n` +
`export interface CheckInQuestionSet { id: string; title: string; summary: string; questionIds: string[]; status: ContentStatus; publicationStatus: PublicationStatus }\n\n` +
`export interface SeasonalProduceItem { id: string; name: string; produceRegionIds: string[]; months: number[]; diets: string[]; articleId: string }\n\n` +
`export const learningArticles: LearningArticle[] = ${JSON.stringify(articles, null, 2)}\n\n` +
`export const recommendationCatalog: RecommendationContent[] = ${JSON.stringify(recommendations, null, 2)}\n\n` +
`export const glossaryEntries: GlossaryEntry[] = ${JSON.stringify(glossary, null, 2)}\n\n` +
`export const checkInQuestionSets: CheckInQuestionSet[] = ${JSON.stringify(checkInSets, null, 2)}\n\n` +
`export const seasonalProduceCatalog: SeasonalProduceItem[] = ${JSON.stringify(seasonalProduce, null, 2)}\n`

fs.writeFileSync(outputPath, generated)
console.log(`Generated ${articles.length} articles, ${recommendations.length} recommendations, ${glossary.length} glossary entries, ${checkInSets.length} check-in sets, and ${seasonalProduce.length} seasonal produce items at src/generated/contentCatalog.ts`)
