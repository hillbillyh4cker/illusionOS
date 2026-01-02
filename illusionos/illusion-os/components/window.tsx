"use client"

import { useState, useRef, useEffect } from "react"
import { useWindows } from "@/components/windows-provider"
import { X, Minus, Square, Maximize2 } from 'lucide-react'
import { clsx } from "clsx"
import Calculator from "@/components/apps/calculator"
import Notepad from "@/components/apps/notepad"
import Files from "@/components/apps/files"
import Settings from "@/components/apps/settings"
import Gallery from "@/components/apps/gallery"
import Terminal from "@/components/apps/terminal"
import Games from "@/components/apps/games"
import Browser from "@/components/apps/browser"

interface WindowProps {
  window: {
    id: string
    appId: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    isMinimized: boolean
    isFocused: boolean
  }
}

export default function Window({ window }: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, windows } = useWindows()
  const [isMaximized, setIsMaximized] = useState(false)
  const [position, setPosition] = useState(window.position)
  const [size, setSize] = useState(window.size)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, isMaximized])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!window.isFocused) {
      focusWindow(window.id)
    }
    
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 })
      setSize({ width: window.innerWidth, height: window.innerHeight - 48 })
    } else {
      setPosition(window.position)
      setSize(window.size)
    }
  }

  const renderApp = () => {
    switch (window.appId) {
      case "browser": return <Browser />
      case "calculator": return <Calculator />
      case "notepad": return <Notepad />
      case "files": return <Files />
      case "settings": return <Settings />
      case "gallery": return <Gallery />
      case "terminal": return <Terminal />
      case "games": return <Games />
      default: return <div className="p-4">App not found</div>
    }
  }

  const getAppTitle = () => {
    const titles = {
      browser: "Browser",
      calculator: "Calculator", 
      notepad: "Notepad",
      files: "Files",
      settings: "Settings",
      gallery: "Gallery",
      terminal: "Terminal",
      games: "Games"
    }
    return titles[window.appId as keyof typeof titles] || "Application"
  }

  if (window.isMinimized) return null

  const zIndex = windows.findIndex((w) => w.id === window.id) + 10

  return (
    <div
      ref={windowRef}
      className={clsx(
        "absolute rounded-lg overflow-hidden shadow-xl border border-gray-700 flex flex-col bg-gray-900",
        window.isFocused ? "shadow-2xl" : "shadow-lg opacity-90"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: isMaximized ? '100vw' : size.width,
        height: isMaximized ? 'calc(100vh - 48px)' : size.height,
        zIndex
      }}
    >
      {/* Title Bar */}
      <div 
        className="h-10 bg-gray-800 flex items-center justify-between px-4 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="text-white font-medium">{getAppTitle()}</div>
        <div className="flex items-center space-x-2">
          <button
            className="h-6 w-6 hover:bg-gray-700 rounded-full flex items-center justify-center"
            onClick={() => minimizeWindow(window.id)}
          >
            <Minus className="h-3 w-3 text-white" />
          </button>
          <button
            className="h-6 w-6 hover:bg-gray-700 rounded-full flex items-center justify-center"
            onClick={handleMaximize}
          >
            {isMaximized ? <Square className="h-3 w-3 text-white" /> : <Maximize2 className="h-3 w-3 text-white" />}
          </button>
          <button
            className="h-6 w-6 hover:bg-red-700 rounded-full flex items-center justify-center"
            onClick={() => closeWindow(window.id)}
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        {renderApp()}
      </div>
    </div>
  )
}
