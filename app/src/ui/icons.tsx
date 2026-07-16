import type { HTMLAttributes } from 'react'
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  BookOpenText,
  Books,
  BowlFood,
  CheckCircle,
  CirclesThree,
  DeviceMobile,
  Drop,
  Export,
  Fingerprint,
  Fire,
  FlowerLotus,
  ListChecks,
  MagnifyingGlass,
  MapPinArea,
  QuestionMark,
  ShieldCheck,
  SlidersHorizontal,
  Spiral,
  Sun,
  SunHorizon,
  Trash,
  UserCircle,
  WarningCircle,
  Waves,
  XCircle,
  type IconProps,
} from '@phosphor-icons/react'

function doshaClassName(className?: string) {
  return ['dosha-icon', className].filter(Boolean).join(' ')
}

export function VataIcon({ className, weight = 'duotone', ...props }: IconProps) {
  return <Spiral className={doshaClassName(className)} weight={weight} {...props} />
}

export function PittaIcon({ className, weight = 'duotone', ...props }: IconProps) {
  return <Fire className={doshaClassName(className)} weight={weight} {...props} />
}

export function KaphaIcon({ className, weight = 'duotone', ...props }: IconProps) {
  return <Drop className={doshaClassName(className)} weight={weight} {...props} />
}

export function DoshaTrioMark({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={['brand-mark', className].filter(Boolean).join(' ')}
      {...props}
    >
      <VataIcon className="dosha-icon-vata" focusable="false" />
      <PittaIcon className="dosha-icon-pitta" focusable="false" />
      <KaphaIcon className="dosha-icon-kapha" focusable="false" />
    </div>
  )
}

// Concepts
export const NatureIcon = Fingerprint
export const CurrentBalanceIcon = Waves
export const DailyRoutineIcon = SunHorizon
export const AyurvedaIcon = FlowerLotus
export const FoodIcon = BowlFood

// Primary navigation
export const TodayIcon = Sun
export const QuestionsIcon = ListChecks
export const BalanceIcon = CirclesThree
export const LearnIcon = BookOpenText
export const GuidedHelpIcon = MagnifyingGlass
export const SettingsIcon = SlidersHorizontal

// Actions and utility
export const CompleteIcon = CheckCircle
export const DismissIcon = XCircle
export const ShowAnotherIcon = ArrowsClockwise
export const WhyIcon = QuestionMark
export const SearchIcon = MagnifyingGlass
export const GlossaryIcon = Books
export const BackIcon = ArrowLeft
export const ForwardIcon = ArrowRight
export const LocationIcon = MapPinArea
export const ProfileIcon = UserCircle
export const ExportDataIcon = Export
export const ClearDataIcon = Trash
export const ResetIcon = ArrowCounterClockwise
export const PrivacyIcon = ShieldCheck
export const StorageIcon = DeviceMobile
export const WarningIcon = WarningCircle

export type { IconProps }
