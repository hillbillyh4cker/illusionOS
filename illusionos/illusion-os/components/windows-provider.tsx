"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface Window {
  id: string
  appId: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isFocused: boolean
}

interface WindowsContextType {
  windows: Window[]
  openWindow: (appId: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  focusWindow: (id: string) => void
}

const WindowsContext = createContext<WindowsContextType | undefined>(undefined)

export function WindowsProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([])

  const getDefaultSize = (appId: string) => {
    const sizes = {
      browser: { width: 1000, height: 700 },
      calculator: { width: 300, height: 400 },
      notepad: { width: 500, height: 400 },
      files: { width: 700, height: 500 },
      terminal: { width: 800, height: 500 },
      games: { width: 800, height: 600 },
      settings: { width: 600, height: 500 },
      gallery: { width: 800, height: 600 }
    }
    return sizes[appId as keyof typeof sizes] || { width: 500, height: 400 }
  }

  const openWindow = useCallback((appId: string) => {
    const existingWindow = windows.find((w) => w.appId === appId && !w.isMinimized)
    
    if (existingWindow) {
      focusWindow(existingWindow.id)
      return
    }

    const offset = windows.length * 30
    const newWindow: Window = {
      id: `${appId}-${Date.now()}`,
      appId,
      position: { x: 100 + offset, y: 100 + offset },
      size: getDefaultSize(appId),
      isMinimized: false,
      isFocused: true,
    }

    setWindows((prev) => [...prev.map((w) => ({ ...w, isFocused: false })), newWindow])
  }, [windows])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => ({
        ...w,
        isMinimized: w.id === id ? true : w.isMinimized,
        isFocused: w.id === id ? false : w.isFocused,
      }))
    )
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const windowToFocus = prev.find((w) => w.id === id)
      if (!windowToFocus) return prev

      const otherWindows = prev.filter((w) => w.id !== id)
      return [...otherWindows.map((w) => ({ ...w, isFocused: false })), { ...windowToFocus, isFocused: true, isMinimized: false }]
    })
  }, [])

  return (
    <WindowsContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, focusWindow }}>
      {children}
    </WindowsContext.Provider>
  )
}

export function useWindows() {
  const context = useContext(WindowsContext)
  if (context === undefined) {
    throw new Error("useWindows must be used within a WindowsProvider")
  }
  return context
}
