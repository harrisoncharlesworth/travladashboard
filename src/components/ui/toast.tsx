"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-96 max-w-sm rounded-lg border p-4 shadow-lg transition-all",
        "bg-background border-border",
        variant === "destructive" && "border-red-500 bg-red-50 dark:bg-red-950/20",
        variant === "success" && "border-green-500 bg-green-50 dark:bg-green-950/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {title && (
            <div className="font-semibold text-sm mb-1">{title}</div>
          )}
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Toast container for managing multiple toasts
export function ToastContainer() {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  React.useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event: CustomEvent) => {
      const toast = {
        id: Math.random().toString(36),
        ...event.detail
      }
      setToasts(prev => [...prev, toast])
    }

    window.addEventListener('show-toast', handleToast as EventListener)
    return () => window.removeEventListener('show-toast', handleToast as EventListener)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

// Helper function to show toasts
export function showToast(toast: ToastProps) {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: toast }))
}
