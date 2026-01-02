"use client"

import { useWindows } from "@/components/windows-provider"
import { Calculator, FileText, FolderOpen, ImageIcon, Settings, MenuIcon, Terminal, Gamepad2, Globe } from 'lucide-react'
import { useState } from "react"
import { clsx } from "clsx"

export default function Taskbar() {
  const { windows, openWindow, focusWindow } = useWindows()
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  const apps = [
    { id: "browser", icon: Globe, name: "Browser" },
    { id: "notepad", icon: FileText, name: "Notepad" },
    { id: "calculator", icon: Calculator, name: "Calculator" },
    { id: "files", icon: FolderOpen, name: "Files" },
    { id: "terminal", icon: Terminal, name: "Terminal" },
    { id: "games", icon: Gamepad2, name: "Games" },
    { id: "settings", icon: Settings, name: "Settings" },
    { id: "gallery", icon: ImageIcon, name: "Gallery" }
  ]

  return (
    <div className="h-12 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex items-center px-2 z-50">
      {/* Start Button */}
      <button
        className={clsx(
          "h-10 w-10 rounded-full mr-2 flex items-center justify-center hover:bg-gray-700",
          startMenuOpen && "bg-gray-700"
        )}
        onClick={() => setStartMenuOpen(!startMenuOpen)}
      >
        <MenuIcon className="h-5 w-5 text-white" />
      </button>

      <div className="h-10 w-[1px] bg-gray-700 mx-2" />

      {/* App Icons */}
      <div className="flex items-center space-x-1">
        {apps.map((app) => {
          const isOpen = windows.some((w) => w.appId === app.id)
          const isFocused = windows.some((w) => w.appId === app.id && w.isFocused)
          const Icon = app.icon

          return (
            <button
              key={app.id}
              className={clsx(
                "h-10 w-10 relative flex items-center justify-center rounded hover:bg-gray-700",
                isOpen && "bg-gray-700/50",
                isFocused && "bg-gray-700"
              )}
              onClick={() => {
                if (isOpen) {
                  const windowToFocus = windows.find((w) => w.appId === app.id)
                  if (windowToFocus) focusWindow(windowToFocus.id)
                } else {
                  openWindow(app.id)
                }
              }}
            >
              <Icon className="h-5 w-5 text-white" />
              {isOpen && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Clock */}
      <div className="ml-auto text-white text-sm">
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="absolute bottom-12 left-0 w-80 bg-gray-900/95 backdrop-blur-md rounded-t-lg shadow-2xl border border-gray-800 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">U</span>
              </div>
              <div>
                <div className="text-white font-medium">User</div>
                <div className="text-gray-400 text-sm">Desktop OS</div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-1 gap-1">
              {apps.map((app) => {
                const Icon = app.icon
                return (
                  <button
                    key={app.id}
                    className="flex items-center space-x-3 p-3 text-white hover:bg-gray-800 rounded"
                    onClick={() => {
                      openWindow(app.id)
                      setStartMenuOpen(false)
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{app.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
