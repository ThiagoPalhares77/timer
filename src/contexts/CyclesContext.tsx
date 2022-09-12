import { createContext, ReactNode, useState, useReducer } from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutsAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  markCurrentCycleAsFinished: () => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycles) => cycles.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())

    function createNewCycle(data: CreateCycleData) {
      const id = String(new Date().getTime())

      const newCycle: Cycle = {
        id,
        task: data.task,
        minutesAmount: data.minutsAmount,
        startDate: new Date()
      }

      dispatch(addNewCycleAction(newCycle))

      setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
      dispatch(interruptCurrentCycleAction())
    }

    return (
      <CyclesContext.Provider
        value={{
          cycles,
          activeCycle,
          activeCycleId,
          markCurrentCycleAsFinished,
          amountSecondsPassed,
          setSecondsPassed,
          createNewCycle,
          interruptCurrentCycle
        }}
      >
        {children}
      </CyclesContext.Provider>
    )
  }
}
