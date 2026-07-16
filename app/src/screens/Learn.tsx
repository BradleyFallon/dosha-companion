import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { BackLink, Screen } from '../components/Layout'
import { MarkdownBody } from '../components/MarkdownBody'
import { getGlossaryEntries, getLearningArticle, getLearningArticles } from '../content/repository'
import { selectArticleIcon } from '../ui/articleIcons'
import {
  ForwardIcon,
  GlossaryIcon,
  GuidedHelpIcon,
  LearnIcon,
  SearchIcon,
} from '../ui/icons'

export function LearnScreen() {
  const articles = getLearningArticles()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const categories = [...new Set(articles.map((article) => article.category))]
  const filtered = useMemo(() => articles.filter((article) => {
    const matchesCategory = category === 'all' || article.category === category
    const haystack = `${article.title} ${article.summary} ${article.tags.join(' ')}`.toLowerCase()
    return matchesCategory && haystack.includes(query.trim().toLowerCase())
  }), [articles, category, query])

  return (
    <Screen>
      <p className="eyebrow">Editable learning library</p>
      <h1 tabIndex={-1}>Learn</h1>
      <p className="lede">Browse conservative draft education. Every published item is visibly provisional until expert approval.</p>
      <div className="content-filters">
        <label className="icon-label" htmlFor="learn-search"><SearchIcon aria-hidden="true" className="icon-leading" focusable="false" />Search articles</label>
        <input id="learn-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try routine or Vata" />
        <label htmlFor="learn-category">Category</label>
        <select id="learn-category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((value) => <option key={value} value={value}>{formatCategory(value)}</option>)}
        </select>
      </div>
      <p role="status">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</p>
      <div className="learn-list">
        {filtered.map((article) => {
          const { Icon, tone } = selectArticleIcon(article)
          return (
            <Link className="content-card" key={article.id} to={`/learn/${article.id}`}>
              <span className="content-card-header">
                <Icon aria-hidden="true" className={`card-icon article-icon article-icon-${tone}`} focusable="false" weight="duotone" />
                <span className="provisional-badge">{article.status === 'approved' ? 'Approved' : 'Provisional · not expert-approved'}</span>
              </span>
              <strong>{article.title}</strong>
              <span>{article.summary}</span>
            </Link>
          )
        })}
      </div>
      {filtered.length === 0 ? <p className="empty-state">No articles match those filters.</p> : null}
      <Link className="button secondary icon-label" to="/learn/glossary"><GlossaryIcon aria-hidden="true" className="icon-leading" focusable="false" />Open glossary</Link>
      <Link className="button secondary icon-label" to="/assistant"><GuidedHelpIcon aria-hidden="true" className="icon-leading" focusable="false" />Search with guided help</Link>
    </Screen>
  )
}

export function ArticleScreen() {
  const { articleId } = useParams()
  const article = articleId ? getLearningArticle(articleId) : null
  if (!article) return <Navigate to="/learn" replace />
  const related = article.relatedArticleIds.flatMap((id) => {
    const item = getLearningArticle(id)
    return item ? [item] : []
  })
  return (
    <Screen>
      <BackLink to="/learn" label="Learn" />
      <p className="provisional-badge">{article.status === 'approved' ? 'Approved' : 'Provisional · not expert-approved'}</p>
      <p className="eyebrow">{formatCategory(article.category)}</p>
      <h1 tabIndex={-1}>{article.title}</h1>
      <p className="lede">{article.summary}</p>
      <MarkdownBody markdown={article.body} />
      {related.length > 0 ? <section className="related-content" aria-labelledby="related-title"><h2 className="section-title-with-icon" id="related-title"><LearnIcon aria-hidden="true" className="icon-leading" focusable="false" />Related reading</h2>{related.map((item) => <Link className="icon-label" key={item.id} to={`/learn/${item.id}`}>{item.title}<ForwardIcon aria-hidden="true" className="icon-trailing" focusable="false" /></Link>)}</section> : null}
      <p className="boundary-note">Educational content only. This article does not provide a diagnosis or treatment plan.</p>
    </Screen>
  )
}

export function GlossaryScreen() {
  const entries = getGlossaryEntries()
  const [query, setQuery] = useState('')
  const filtered = entries.filter((entry) => `${entry.term} ${entry.aliases.join(' ')} ${entry.definition}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <Screen>
      <BackLink to="/learn" label="Learn" />
      <p className="eyebrow">Reference</p><h1 tabIndex={-1}>Glossary</h1>
      <label className="icon-label" htmlFor="glossary-search"><SearchIcon aria-hidden="true" className="icon-leading" focusable="false" />Search terms</label>
      <input id="glossary-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      <dl className="glossary-list">{filtered.map((entry) => <div id={entry.id} key={entry.id}><dt>{entry.term}</dt><dd>{entry.definition} <Link to={`/learn/${entry.relatedArticleId}`}>Read more</Link></dd></div>)}</dl>
      {filtered.length === 0 ? <p className="empty-state">No glossary terms match.</p> : null}
    </Screen>
  )
}

function formatCategory(value: string) {
  return value.split('-').map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`).join(' ')
}
