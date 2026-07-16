import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import {
  persistState,
  prototypeReducer,
  restoreState,
  STORAGE_KEY,
  type PrototypeAction,
  type PrototypeState,
} from './state'

interface PrototypeContextValue {
  state: PrototypeState
  dispatch: Dispatch<PrototypeAction>
  resetPrototype: () => void
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null)

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
    (provided) => provided ?? restoreState(),
  )

  useEffect(() => {
    persistState(state)
  }, [state])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      resetPrototype: () => {
        window.localStorage.removeItem(STORAGE_KEY)
        dispatch({ type: 'reset' })
      },
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
