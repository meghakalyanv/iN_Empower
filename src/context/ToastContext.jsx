import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // type: 'success' | 'error' | 'info' (info: no icon, the message brings its own); ms: how long it stays
  const addToast = useCallback((message, type = 'success', ms = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id))
    }, ms)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} fade-in`}>
            {toast.type === 'success' ? '✅ ' : toast.type === 'error' ? '❌ ' : ''}{toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
