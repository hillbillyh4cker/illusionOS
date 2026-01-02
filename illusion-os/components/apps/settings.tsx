"use client"

import { useState } from "react"
import { Monitor, Moon, Sun, Palette } from 'lucide-react'

export default function Settings() {
  const [theme, setTheme] = useState("system")

  const wallpapers = [
    "/wallpapers/elliot.jpg",
    "/placeholder.svg?height=1080&width=1920&text=Mountain+Landscape",
    "/placeholder.svg?height=1080&width=1920&text=Ocean+View", 
    "/placeholder.svg?height=1080&width=1920&text=Forest+Scene",
    "/placeholder.svg?height=1080&width=1920&text=Desert+Sunset",
    "/placeholder.svg?height=1080&width=1920&text=City+Lights",
    "/placeholder.svg?height=1080&width=1920&text=Space+Galaxy"
  ]

  const handleWallpaperChange = (wallpaper: string) => {
    const event = new CustomEvent("wallpaper-change", { detail: { wallpaper } })
    window.dispatchEvent(event)
  }

  return (
    <div className="h-full p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              className={`flex flex-col items-center justify-center h-24 border-2 rounded-lg ${
                theme === "light" ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-8 w-8 mb-2" />
              <span>Light</span>
            </button>
            <button
              className={`flex flex-col items-center justify-center h-24 border-2 rounded-lg ${
                theme === "dark" ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-8 w-8 mb-2" />
              <span>Dark</span>
            </button>
            <button
              className={`flex flex-col items-center justify-center h-24 border-2 rounded-lg ${
                theme === "system" ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-8 w-8 mb-2" />
              <span>System</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Wallpaper</h3>
          <div className="grid grid-cols-3 gap-4">
            {wallpapers.map((wallpaper, index) => (
              <div
                key={index}
                className="h-24 rounded-md overflow-hidden cursor-pointer border-2 hover:border-blue-500 transition-colors"
                onClick={() => handleWallpaperChange(wallpaper)}
              >
                <img
                  src={wallpaper || "/placeholder.svg"}
                  alt={`Wallpaper ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">System Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Version:</span>
              <span>IllusionOS v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Platform:</span>
              <span>Web Browser</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Runtime:</span>
              <span>Next.js 14.0.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
