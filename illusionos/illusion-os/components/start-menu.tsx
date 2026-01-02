"use client"

import { Button } from "@/components/ui/button"
import { useWindows } from "@/components/windows-provider"
import { Calculator, FileText, FolderOpen, ImageIcon, Settings, LogOut, User, Moon, Sun, Terminal, Gamepad2, Globe } from 'lucide-react'
import { useTheme } from "next-themes"

interface StartMenuProps {
  onClose: () => void
}

export default function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow } = useWindows()
  const { theme, setTheme } = useTheme()

  const handleAppClick = (appId: string) => {
    openWindow(appId)
    onClose()
  }

  return (
    <div className="absolute bottom-12 left-0 w-80 bg-gray-900/95 backdrop-blur-md rounded-t-lg shadow-2xl border border-gray-800 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-white font-medium">User</div>
            <div className="text-gray-400 text-sm">IllusionOS</div>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="grid grid-cols-1 gap-1">
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("browser")}
          >
            <Globe className="h-5 w-5 mr-3 text-blue-600" />
            Browser
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("notepad")}
          >
            <FileText className="h-5 w-5 mr-3 text-blue-500" />
            Notepad
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("calculator")}
          >
            <Calculator className="h-5 w-5 mr-3 text-green-500" />
            Calculator
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("files")}
          >
            <FolderOpen className="h-5 w-5 mr-3 text-yellow-500" />
            Files
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("gallery")}
          >
            <ImageIcon className="h-5 w-5 mr-3 text-purple-500" />
            Gallery
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("settings")}
          >
            <Settings className="h-5 w-5 mr-3 text-gray-500" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("terminal")}
          >
            <Terminal className="h-5 w-5 mr-3 text-red-500" />
            Terminal
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => handleAppClick("doom")}
          >
            <Gamepad2 className="h-5 w-5 mr-3 text-orange-500" />
            DOOM
          </Button>
        </div>
      </div>

      <div className="p-2 border-t border-gray-800">
        <div className="grid grid-cols-1 gap-1">
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-gray-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5 mr-3 text-yellow-500" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 mr-3 text-blue-300" />
                Dark Mode
              </>
            )}
          </Button>
          <Button variant="ghost" className="justify-start text-white hover:bg-gray-800">
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
