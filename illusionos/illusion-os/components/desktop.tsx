"use client"

import { useState, useEffect } from "react"
import { useWindows } from "@/components/windows-provider"
import DesktopIcon from "@/components/desktop-icon"
import Window from "@/components/window"
import { Calculator, FileText, FolderOpen, ImageIcon, Settings, Terminal, Gamepad2, Globe } from 'lucide-react'

export default function Desktop() {
  const { windows, openWindow } = useWindows()
  const [wallpaper, setWallpaper] = useState("/wallpapers/elliot.jpg")

  useEffect(() => {
    const handleWallpaperChange = (event: CustomEvent) => {
      setWallpaper(event.detail.wallpaper)
    }

    window.addEventListener("wallpaper-change", handleWallpaperChange as EventListener)
    return () => {
      window.removeEventListener("wallpaper-change", handleWallpaperChange as EventListener)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${wallpaper})` }}>
      {/* Desktop Icons */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 p-4">
        <DesktopIcon
          icon={<Globe className="h-10 w-10 text-blue-600" />}
          label="Browser"
          onClick={() => openWindow("browser")}
        />
        <DesktopIcon
          icon={<FileText className="h-10 w-10 text-blue-500" />}
          label="Notepad"
          onClick={() => openWindow("notepad")}
        />
        <DesktopIcon
          icon={<Calculator className="h-10 w-10 text-green-500" />}
          label="Calculator"
          onClick={() => openWindow("calculator")}
        />
        <DesktopIcon
          icon={<FolderOpen className="h-10 w-10 text-yellow-500" />}
          label="Files"
          onClick={() => openWindow("files")}
        />
        <DesktopIcon
          icon={<Terminal className="h-10 w-10 text-red-500" />}
          label="Terminal"
          onClick={() => openWindow("terminal")}
        />
        <DesktopIcon
          icon={<Gamepad2 className="h-10 w-10 text-orange-500" />}
          label="Games"
          onClick={() => openWindow("games")}
        />
        <DesktopIcon
          icon={<Settings className="h-10 w-10 text-gray-500" />}
          label="Settings"
          onClick={() => openWindow("settings")}
        />
        <DesktopIcon
          icon={<ImageIcon className="h-10 w-10 text-purple-500" />}
          label="Gallery"
          onClick={() => openWindow("gallery")}
        />
      </div>

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}
    </div>
  )
}
