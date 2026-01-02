"use client"

import type React from "react"

interface DesktopIconProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export default function DesktopIcon({ icon, label, onClick }: DesktopIconProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-gray-900/50 backdrop-blur-sm mb-1">
        {icon}
      </div>
      <span className="text-white text-xs text-center font-medium px-1 py-0.5 rounded bg-black/30 backdrop-blur-sm">
        {label}
      </span>
    </div>
  )
}
