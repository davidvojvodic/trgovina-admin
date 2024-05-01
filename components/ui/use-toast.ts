import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes[keyof typeof actionTypes]

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: ToasterToast["id"]
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: ToasterToast["id"]
    }

type State = {
  toasts: ReadonlyArray<Readonly<ToasterToast>>
}

const toastTimeouts = new Map<string, NodeJS.Timeout>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const ToastContext = React.createContext<
  | {
      state: State
      dispatch: React.Dispatch<Action>
      toast: (props: Omit<ToasterToast, "id">) => {
        id: string
        dismiss: () => void
        update: (props: ToasterToast) => void
      }
      dismiss: (toastId?: string) => void
    }
  | undefined
>(undefined)

const useToastContext = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}

const ToastProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  })

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = genId()

    const update = React.useCallback(
      (props: ToasterToast) =>
        dispatch({
          type: "UPDATE_TOAST",
          toast: { ...props, id },
        }),
      [id]
    )
    const dismiss = React.useCallback(() => dispatch({ type: "DISMISS_TOAST", toastId: id }), [id])

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss()
        },
      },
    })

    return {
      id: id,
      dismiss,
      update,
    }
  }

  React.useEffect(() => {
    const listener = (newState: State) => {
      memoryState = newState
    }
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  const value = {
    state,
    dispatch,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

const { Provider: ToastProvider, Consumer: ToastConsumer } = ToastContext

let memoryState: State = { toasts: [] }
const listeners = new Set<(state: State) => void>()

export { ToastProvider, ToastConsumer, useToastContext }
