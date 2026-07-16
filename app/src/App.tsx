import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/Layout'
import { PrototypeProvider, usePrototype } from './prototype/PrototypeContext'
import {
  AccountScreen,
  FoodProfileScreen,
  LocationProfileScreen,
  NameProfileScreen,
  WelcomeScreen,
} from './screens/Onboarding'
import { nextResumePath } from './prototype/resume'
import { AssessmentIntroScreen, QuestionScreen, TransitionScreen } from './screens/Assessment'
import { ResultScreen } from './screens/Results'
import { TodayScreen } from './screens/Today'
import { AssistantScreen, BalanceScreen, LearnScreen, QuestionsScreen } from './screens/Secondary'

function Guard({ allowed, redirect, children }: { allowed: boolean; redirect: string; children: ReactNode }) {
  return allowed ? children : <Navigate to={redirect} replace />
}

function PrototypeRoutes() {
  const { state } = usePrototype()
  const resumePath = nextResumePath(state)

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/create-account" element={<AccountScreen />} />
        <Route path="/profile/name" element={<Guard allowed={state.accountCreated} redirect="/create-account"><NameProfileScreen /></Guard>} />
        <Route path="/profile/location" element={<Guard allowed={state.accountCreated && Boolean(state.profile.preferredName)} redirect={resumePath}><LocationProfileScreen /></Guard>} />
        <Route path="/profile/food" element={<Guard allowed={state.accountCreated && Boolean(state.profile.country)} redirect={resumePath}><FoodProfileScreen /></Guard>} />
        <Route path="/assessment" element={<Guard allowed={state.profileCompleted} redirect={resumePath}><AssessmentIntroScreen /></Guard>} />
        <Route path="/assessment/question/:id" element={<Guard allowed={state.assessmentStarted} redirect={resumePath}><QuestionScreen /></Guard>} />
        <Route path="/assessment/transition" element={<Guard allowed={state.assessmentStarted} redirect={resumePath}><TransitionScreen /></Guard>} />
        <Route path="/results" element={<Guard allowed={state.resultsReached} redirect={resumePath}><ResultScreen /></Guard>} />
        <Route path="/today" element={<Guard allowed={state.resultsReached} redirect={resumePath}><TodayScreen /></Guard>} />
        <Route path="/questions" element={<Guard allowed={state.resultsReached} redirect={resumePath}><QuestionsScreen /></Guard>} />
        <Route path="/balance" element={<Guard allowed={state.resultsReached} redirect={resumePath}><BalanceScreen /></Guard>} />
        <Route path="/learn" element={<Guard allowed={state.resultsReached} redirect={resumePath}><LearnScreen /></Guard>} />
        <Route path="/assistant" element={<Guard allowed={state.resultsReached} redirect={resumePath}><AssistantScreen /></Guard>} />
        <Route path="*" element={<Navigate to={state.accountCreated ? resumePath : '/'} replace />} />
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
