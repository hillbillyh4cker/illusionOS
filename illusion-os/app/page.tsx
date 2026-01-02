"use client"

import { useState, useEffect } from "react"
import Desktop from "@/components/desktop"
import Taskbar from "@/components/taskbar"
import { WindowsProvider } from "@/components/windows-provider"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <WindowsProvider>
      <div className="h-screen w-screen overflow-hidden bg-slate-800 flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <Desktop />
        </div>
        <Taskbar />
      </div>
    </WindowsProvider>
  )
}
