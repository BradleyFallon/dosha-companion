import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataRoot = path.resolve(appRoot, '../data/quiz')
const outputPath = path.join(appRoot, 'src/generated/initialAssessment.ts')
const PATTERN_KEY_FORMAT = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/

function readCsv(fileName) {
  const filePath = path.join(dataRoot, fileName)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Quiz generation failed: missing canonical file ${filePath}`)
  }

  const parsed = Papa.parse(fs.readFileSync(filePath, 'utf8'), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  if (parsed.errors.length > 0) {
    const details = parsed.errors
      .map((error) => `${fileName} row ${error.row ?? '?'}: ${error.message}`)
      .join('\n')
    throw new Error(`Quiz generation failed while parsing CSV:\n${details}`)
  }

  return parsed.data
}

function required(row, field, source) {
  const value = row[field]?.trim()
  if (!value) {
    throw new Error(`Quiz generation failed: ${source} has a blank ${field}`)
  }
  return value
}

function integer(value, label) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed)) {
    throw new Error(`Quiz generation failed: ${label} must be an integer, received "${value}"`)
  }
  return parsed
}

function number(value, label) {
  const parsed = Number(value)
  if (value?.trim() === '' || !Number.isFinite(parsed)) {
    throw new Error(`Quiz generation failed: ${label} must be a number, received "${value}"`)
  }
  return parsed
}

function boolean(value, label) {
  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`Quiz generation failed: ${label} must be true or false, received "${value}"`)
}

function assertUnique(rows, key, source) {
  const seen = new Set()
  for (const row of rows) {
    const id = required(row, key, source)
    if (seen.has(id)) {
      throw new Error(`Quiz generation failed: duplicate ${key} "${id}" in ${source}`)
    }
    seen.add(id)
  }
}

export function validateAnswerMetadata(answer, question, checkControlled) {
  const source = `answer ${answer.answer_id}`
  const shortLabel = answer.short_label?.trim() || null
  const iconKey = answer.icon_key?.trim() || null
  const patternKey = answer.pattern_key?.trim() || null

  if (shortLabel && shortLabel.length > 60) {
    throw new Error(`Quiz generation failed: ${source} short_label must be 60 characters or fewer`)
  }
  if (iconKey) checkControlled('balance_icon_key', iconKey, source)
  if (patternKey && !PATTERN_KEY_FORMAT.test(patternKey)) {
    throw new Error(`Quiz generation failed: ${source} has malformed pattern_key "${patternKey}"`)
  }
  if (patternKey && !shortLabel) {
    throw new Error(`Quiz generation failed: ${source} has pattern_key but no short_label`)
  }
  if (question.assessment_type === 'current' && answer.answer_kind === 'ordinary' && !shortLabel) {
    throw new Error(`Quiz generation failed: ordinary current ${source} has a blank short_label`)
  }
  if (answer.answer_kind !== 'ordinary' && patternKey && patternKey !== 'uncertain') {
    throw new Error(`Quiz generation failed: fallback ${source} must use pattern_key "uncertain" or leave it blank`)
  }

  return { shortLabel, iconKey, patternKey }
}

export function validateScoreRow(score, answer, question, checkControlled) {
  const source = `score for answer ${answer.answer_id}`
  const modelVersion = required(score, 'scoring_model_version', 'answer-scores.csv')
  const target = required(score, 'score_target', 'answer-scores.csv')
  checkControlled('score_target', target, source)
  const weights = {
    vata: number(score.vata_weight, `${source} vata_weight`),
    pitta: number(score.pitta_weight, `${source} pitta_weight`),
    kapha: number(score.kapha_weight, `${source} kapha_weight`),
  }
  const reliability = number(score.reliability_weight, `${source} reliability_weight`)
  const values = [...Object.values(weights), reliability]
  if (values.some((value) => value < 0 || value > 1)) {
    throw new Error(`Quiz generation failed: ${source} weights must be between 0 and 1`)
  }
  const weightTotal = weights.vata + weights.pitta + weights.kapha
  if (weightTotal > 1) {
    throw new Error(`Quiz generation failed: ${source} assigns more than one prototype direction`)
  }
  if (target === 'none' && (weightTotal !== 0 || reliability !== 0)) {
    throw new Error(`Quiz generation failed: non-scoring ${source} must use zero weights and reliability`)
  }
  if (target !== 'none') {
    if (answer.answer_kind !== 'ordinary') {
      throw new Error(`Quiz generation failed: fallback ${source} cannot contribute to scoring`)
    }
    if (target !== question.assessment_type) {
      throw new Error(`Quiz generation failed: ${source} target ${target} does not match ${question.assessment_type} question`)
    }
    if (reliability === 0) {
      throw new Error(`Quiz generation failed: scoring ${source} must have positive reliability`)
    }
  }

  return { modelVersion, target, weights, reliability }
}

export function generate() {
  const questions = readCsv('questions.csv')
  const answerOptions = readCsv('answer-options.csv')
  const answerScores = readCsv('answer-scores.csv')
  const questionSets = readCsv('question-sets.csv')
  const setItems = readCsv('question-set-items.csv')
  const controlledValues = readCsv('controlled-values.csv')

  assertUnique(questions, 'question_id', 'questions.csv')
  assertUnique(answerOptions, 'answer_id', 'answer-options.csv')
  assertUnique(answerScores, 'answer_id', 'answer-scores.csv')

  const initialSet = questionSets.find(
    (row) => row.question_set_id === 'initial_assessment' && row.set_version === '1',
  )
  if (!initialSet) {
    throw new Error('Quiz generation failed: initial_assessment version 1 is missing from question-sets.csv')
  }

  const activeItems = setItems
    .filter(
      (row) =>
        row.question_set_id === 'initial_assessment' &&
        row.set_version === '1' &&
        row.active === 'true',
    )
    .sort((left, right) =>
      integer(left.default_order, `order for ${left.question_id}`) -
      integer(right.default_order, `order for ${right.question_id}`),
    )

  if (activeItems.length !== 27) {
    throw new Error(
      `Quiz generation failed: expected 27 active initial_assessment v1 items, found ${activeItems.length}`,
    )
  }

  const orderValues = activeItems.map((row) => row.default_order)
  if (new Set(orderValues).size !== orderValues.length) {
    throw new Error('Quiz generation failed: initial_assessment v1 contains duplicate default_order values')
  }

  const allowed = new Map()
  for (const row of controlledValues.filter((row) => row.active === 'true')) {
    const group = required(row, 'value_group', 'controlled-values.csv')
    const values = allowed.get(group) ?? new Set()
    values.add(required(row, 'value', 'controlled-values.csv'))
    allowed.set(group, values)
  }

  function checkControlled(group, value, label) {
    if (!allowed.get(group)?.has(value)) {
      throw new Error(`Quiz generation failed: ${label} uses unknown ${group} value "${value}"`)
    }
  }

  const questionById = new Map(questions.map((question) => [question.question_id, question]))
  const scoreByAnswerId = new Map(answerScores.map((score) => [score.answer_id, score]))
  const answersByQuestion = new Map()

  for (const answer of answerOptions) {
    const questionId = required(answer, 'question_id', 'answer-options.csv')
    if (!questionById.has(questionId)) {
      throw new Error(`Quiz generation failed: answer ${answer.answer_id} references unknown question ${questionId}`)
    }
    checkControlled('answer_kind', answer.answer_kind, `answer ${answer.answer_id}`)
    const list = answersByQuestion.get(questionId) ?? []
    list.push(answer)
    answersByQuestion.set(questionId, list)
  }

  const generatedQuestions = activeItems.map((item) => {
    const question = questionById.get(item.question_id)
    if (!question) {
      throw new Error(`Quiz generation failed: question-set item references unknown question ${item.question_id}`)
    }
    if (question.question_version !== item.question_version) {
      throw new Error(
        `Quiz generation failed: ${item.question_id} version mismatch (${item.question_version} in set, ${question.question_version} in questions.csv)`,
      )
    }

    checkControlled('assessment_type', question.assessment_type, `question ${question.question_id}`)
    checkControlled('question_category', question.category, `question ${question.question_id}`)
    checkControlled('response_type', question.response_type, `question ${question.question_id}`)
    checkControlled('time_window', question.time_window, `question ${question.question_id}`)
    checkControlled('editorial_status', question.status, `question ${question.question_id}`)

    const answers = (answersByQuestion.get(question.question_id) ?? [])
      .filter((answer) => answer.question_version === question.question_version)
      .sort(
        (left, right) =>
          integer(left.default_order, `answer order for ${left.answer_id}`) -
          integer(right.default_order, `answer order for ${right.answer_id}`),
      )
      .map((answer) => {
        const metadata = validateAnswerMetadata(answer, question, checkControlled)
        const scoreRow = scoreByAnswerId.get(answer.answer_id)
        if (!scoreRow) {
          throw new Error(`Quiz generation failed: answer ${answer.answer_id} has no answer-scores.csv row`)
        }
        const score = validateScoreRow(scoreRow, answer, question, checkControlled)
        return {
          id: required(answer, 'answer_id', 'answer-options.csv'),
          version: integer(answer.answer_version, `answer version for ${answer.answer_id}`),
          text: required(answer, 'text', `answer ${answer.answer_id}`),
          shortLabel: metadata.shortLabel,
          iconKey: metadata.iconKey,
          patternKey: metadata.patternKey,
          defaultOrder: integer(answer.default_order, `answer order for ${answer.answer_id}`),
          kind: required(answer, 'answer_kind', `answer ${answer.answer_id}`),
          exclusive: boolean(answer.exclusive, `exclusive for ${answer.answer_id}`),
          status: required(answer, 'status', `answer ${answer.answer_id}`),
          score,
        }
      })

    if (answers.length === 0) {
      throw new Error(`Quiz generation failed: ${question.question_id} has no answer options`)
    }

    return {
      id: required(question, 'question_id', 'questions.csv'),
      version: integer(question.question_version, `question version for ${question.question_id}`),
      slug: required(question, 'slug', `question ${question.question_id}`),
      text: required(question, 'text', `question ${question.question_id}`),
      helpText: question.help_text?.trim() || null,
      assessmentType: required(question, 'assessment_type', `question ${question.question_id}`),
      category: required(question, 'category', `question ${question.question_id}`),
      responseType: required(question, 'response_type', `question ${question.question_id}`),
      timeWindow: required(question, 'time_window', `question ${question.question_id}`),
      skippable: boolean(question.skippable, `skippable for ${question.question_id}`),
      sensitive: boolean(question.sensitive, `sensitive for ${question.question_id}`),
      randomizeAnswers: boolean(question.randomize_answers, `randomize_answers for ${question.question_id}`),
      status: required(question, 'status', `question ${question.question_id}`),
      defaultOrder: integer(item.default_order, `order for ${question.question_id}`),
      priority: integer(item.priority, `priority for ${question.question_id}`),
      requiredForCompletion: boolean(item.required_for_completion, `required_for_completion for ${question.question_id}`),
      requiredForResult: boolean(item.required_for_result, `required_for_result for ${question.question_id}`),
      minimumCategoryCoverage: boolean(item.minimum_category_coverage, `minimum_category_coverage for ${question.question_id}`),
      answers,
    }
  })

  const scoringModelVersions = [...new Set(answerScores.map((score) => score.scoring_model_version))]
  if (scoringModelVersions.length !== 1 || !scoringModelVersions[0]) {
    throw new Error('Quiz generation failed: answer-scores.csv must contain exactly one scoring_model_version')
  }

  const payload = {
    id: initialSet.question_set_id,
    version: integer(initialSet.set_version, 'initial assessment set version'),
    label: initialSet.label,
    description: initialSet.description,
    estimatedMinutes: integer(initialSet.estimated_minutes, 'initial assessment estimated minutes'),
    status: initialSet.status,
    scoringModelVersion: scoringModelVersions[0],
    questions: generatedQuestions,
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  const iconKeys = [...(allowed.get('balance_icon_key') ?? [])]
  const source = `/* eslint-disable */\n// GENERATED FILE — DO NOT EDIT. Run \`npm run generate:quiz\` from app/.\n// Source: ../data/quiz/{questions,answer-options,answer-scores,question-sets,question-set-items,controlled-values}.csv\n\nexport const balanceIconKeys = ${JSON.stringify(iconKeys)} as const\nexport type BalanceIconKey = typeof balanceIconKeys[number]\n\nexport const initialAssessment = ${JSON.stringify(payload, null, 2)} as const\n\nexport type InitialAssessment = typeof initialAssessment\nexport type QuizQuestion = InitialAssessment['questions'][number]\nexport type QuizAnswer = QuizQuestion['answers'][number]\n`
  fs.writeFileSync(outputPath, source)
  console.log(`Generated ${generatedQuestions.length} questions at ${path.relative(appRoot, outputPath)}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    generate()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
