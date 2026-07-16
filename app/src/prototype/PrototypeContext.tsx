import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react'
import {
  defaultState,
  createDemoState,
  persistState,
  prototypeReducer,
  removePersistedState,
  restoreState,
  serializeState,
  type PrototypeAction,
  type PrototypeState,
} from './state'

interface PrototypeContextValue {
  state: PrototypeState
  dispatch: Dispatch<PrototypeAction>
  resetPrototype: () => void
  dismissRestoreNotice: () => void
  seedDemo: () => void
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null)

function initialPrototypeState(provided?: PrototypeState) {
  if (provided) return provided
  const restored = restoreState()
  return {
    ...restored.state,
    restoreNotice: restored.notice,
  }
}

export function PrototypeProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: PrototypeState
}) {
  const [state, dispatch] = useReducer(
    prototypeReducer,
    initialState,
    initialPrototypeState,
  )
  const lastAttemptedSnapshot = useRef(serializeState(state))

  useEffect(() => {
    const snapshot = serializeState(state)
    if (snapshot === lastAttemptedSnapshot.current) return

    lastAttemptedSnapshot.current = snapshot
    const result = persistState(state)
    dispatch({ type: 'set-save-status', status: result.ok ? 'saved' : 'not-saved' })
  }, [state])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      resetPrototype: () => {
        const result = removePersistedState()
        lastAttemptedSnapshot.current = serializeState(defaultState)
        dispatch({
          type: 'reset',
          status: result.ok ? 'saved' : 'not-saved',
          notice: result.error,
        })
      },
      dismissRestoreNotice: () => dispatch({ type: 'clear-restore-notice' }),
      seedDemo: () => dispatch({ type: 'replace-state', state: createDemoState() }),
    }),
    [state],
  )

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
}

export function usePrototype() {
  const value = useContext(PrototypeContext)
  if (!value) throw new Error('usePrototype must be used inside PrototypeProvider')
  return value
}
