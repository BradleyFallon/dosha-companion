import type { ComponentType } from 'react'
import type { LearningArticle } from '../generated/contentCatalog'
import {
  AyurvedaIcon,
  BalanceIcon,
  CurrentBalanceIcon,
  DailyRoutineIcon,
  FoodIcon,
  GuidedHelpIcon,
  KaphaIcon,
  NatureIcon,
  PittaIcon,
  QuestionsIcon,
  VataIcon,
  type IconProps,
} from './icons'

export type ArticleIconTone = 'vata' | 'pitta' | 'kapha' | 'neutral'

export interface ArticleIconSelection {
  Icon: ComponentType<IconProps>
  tone: ArticleIconTone
}

export function selectArticleIcon(
  article: Pick<LearningArticle, 'category' | 'tags'>,
): ArticleIconSelection {
  const doshaTags = ['vata', 'pitta', 'kapha'].filter((tag) => article.tags.includes(tag))

  if (doshaTags.length === 1) {
    if (doshaTags[0] === 'vata') return { Icon: VataIcon, tone: 'vata' }
    if (doshaTags[0] === 'pitta') return { Icon: PittaIcon, tone: 'pitta' }
    return { Icon: KaphaIcon, tone: 'kapha' }
  }

  if (article.tags.includes('nature')) return { Icon: NatureIcon, tone: 'neutral' }
  if (article.tags.includes('current-balance')) return { Icon: CurrentBalanceIcon, tone: 'neutral' }
  if (article.tags.includes('food')) return { Icon: FoodIcon, tone: 'neutral' }

  const categoryIcons: Record<string, ComponentType<IconProps>> = {
    foundations: AyurvedaIcon,
    doshas: BalanceIcon,
    assessment: QuestionsIcon,
    'daily-practice': DailyRoutineIcon,
    'using-the-app': GuidedHelpIcon,
  }

  return { Icon: categoryIcons[article.category] ?? AyurvedaIcon, tone: 'neutral' }
}
