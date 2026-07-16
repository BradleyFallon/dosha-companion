import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataRoot = path.resolve(appRoot, '../data/quiz')
const outputPath = path.join(appRoot, 'src/generated/initialAssessment.ts')

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

function generate() {
  const questions = readCsv('questions.csv')
  const answerOptions = readCsv('answer-options.csv')
  const questionSets = readCsv('question-sets.csv')
  const setItems = readCsv('question-set-items.csv')
  const controlledValues = readCsv('controlled-values.csv')

  assertUnique(questions, 'question_id', 'questions.csv')
  assertUnique(answerOptions, 'answer_id', 'answer-options.csv')

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
      .map((answer) => ({
        id: required(answer, 'answer_id', 'answer-options.csv'),
        version: integer(answer.answer_version, `answer version for ${answer.answer_id}`),
        text: required(answer, 'text', `answer ${answer.answer_id}`),
        defaultOrder: integer(answer.default_order, `answer order for ${answer.answer_id}`),
        kind: required(answer, 'answer_kind', `answer ${answer.answer_id}`),
        exclusive: boolean(answer.exclusive, `exclusive for ${answer.answer_id}`),
        status: required(answer, 'status', `answer ${answer.answer_id}`),
      }))

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

  const payload = {
    id: initialSet.question_set_id,
    version: integer(initialSet.set_version, 'initial assessment set version'),
    label: initialSet.label,
    description: initialSet.description,
    estimatedMinutes: integer(initialSet.estimated_minutes, 'initial assessment estimated minutes'),
    status: initialSet.status,
    questions: generatedQuestions,
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  const source = `/* eslint-disable */\n// GENERATED FILE — DO NOT EDIT. Run \`npm run generate:quiz\` from app/.\n// Source: ../data/quiz/{questions,answer-options,question-sets,question-set-items,controlled-values}.csv\n\nexport const initialAssessment = ${JSON.stringify(payload, null, 2)} as const\n\nexport type InitialAssessment = typeof initialAssessment\nexport type QuizQuestion = InitialAssessment['questions'][number]\nexport type QuizAnswer = QuizQuestion['answers'][number]\n`
  fs.writeFileSync(outputPath, source)
  console.log(`Generated ${generatedQuestions.length} questions at ${path.relative(appRoot, outputPath)}`)
}

try {
  generate()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
