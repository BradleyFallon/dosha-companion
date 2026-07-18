import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/Layout'
import { PrototypeProvider, usePrototype } from './prototype/PrototypeContext'
import {
  FoodProfileScreen,
  NameProfileScreen,
  WelcomeScreen,
} from './screens/Onboarding'
import { nextResumePath } from './prototype/resume'
import { AssessmentIntroScreen, QuestionScreen, TransitionScreen } from './screens/Assessment'
import { ResultScreen } from './screens/Results'
import { TodayScreen } from './screens/Today'
import { AssessmentManagementScreen, BalanceScreen, CheckInHistoryScreen, QuestionsScreen } from './screens/Secondary'
import { SettingsScreen } from './screens/Settings'
import { ArticleScreen, GlossaryScreen, LearnScreen } from './screens/Learn'
import { CheckInScreen, NewCheckInScreen } from './screens/CheckIns'
import { getProfileReadiness } from './profile/readiness'
import { ChatHomeScreen, ChatThreadScreen, NewChatScreen } from './screens/Chat'

const LocationProfileScreen = lazy(() =>
  import('./screens/LocationProfile').then((module) => ({
    default: module.LocationProfileScreen,
  })),
)

function Guard({ allowed, redirect, children }: { allowed: boolean; redirect: string; children: ReactNode }) {
  return allowed ? children : <Navigate to={redirect} replace />
}

function PrototypeRoutes() {
  const { state } = usePrototype()
  const resumePath = nextResumePath(state)
  const readiness = getProfileReadiness(state.profile)

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/create-account" element={<Navigate to="/profile/name" replace />} />
        <Route path="/profile/name" element={<NameProfileScreen />} />
        <Route path="/profile/location" element={<Guard allowed={readiness.nameReady} redirect={resumePath}><Suspense fallback={<section className="screen"><p role="status">Loading location options…</p></section>}><LocationProfileScreen /></Suspense></Guard>} />
        <Route path="/profile/food" element={<Guard allowed={readiness.nameReady && readiness.locationReady} redirect={resumePath}><FoodProfileScreen /></Guard>} />
        <Route path="/assessment" element={<Guard allowed={readiness.onboardingReady && state.profileCompleted} redirect={resumePath}><AssessmentIntroScreen /></Guard>} />
        <Route path="/assessment/question/:id" element={<Guard allowed={readiness.onboardingReady && state.assessmentStarted} redirect={resumePath}><QuestionScreen /></Guard>} />
        <Route path="/assessment/transition" element={<Guard allowed={readiness.onboardingReady && state.assessmentStarted} redirect={resumePath}><TransitionScreen /></Guard>} />
        <Route path="/results" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><ResultScreen /></Guard>} />
        <Route path="/today" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><TodayScreen /></Guard>} />
        <Route path="/questions" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><QuestionsScreen /></Guard>} />
        <Route path="/questions/history" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><CheckInHistoryScreen /></Guard>} />
        <Route path="/questions/assessment" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><AssessmentManagementScreen /></Guard>} />
        <Route path="/questions/check-in/new" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><NewCheckInScreen /></Guard>} />
        <Route path="/questions/check-in/:id" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><CheckInScreen /></Guard>} />
        <Route path="/balance" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><BalanceScreen /></Guard>} />
        <Route path="/balance/:domain" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><BalanceScreen /></Guard>} />
        <Route path="/learn" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><LearnScreen /></Guard>} />
        <Route path="/learn/glossary" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><GlossaryScreen /></Guard>} />
        <Route path="/learn/:articleId" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><ArticleScreen /></Guard>} />
        <Route path="/assistant" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><ChatHomeScreen /></Guard>} />
        <Route path="/chat/new" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><NewChatScreen /></Guard>} />
        <Route path="/chat/:threadId" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><ChatThreadScreen /></Guard>} />
        <Route path="/settings" element={<Guard allowed={readiness.coreReady && state.resultsReached} redirect={resumePath}><SettingsScreen /></Guard>} />
        <Route path="*" element={<Navigate to={resumePath} replace />} />
      </Routes>
    </AppShell>
  )
}

export function AppRoutes() {
  return <PrototypeRoutes />
}

export default function App() {
  return (
    <PrototypeProvider>
      <BrowserRouter>
        <PrototypeRoutes />
      </BrowserRouter>
    </PrototypeProvider>
  )
}
