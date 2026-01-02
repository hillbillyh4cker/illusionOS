"use client"

import { useState } from "react"
import { Save, FileDown, Trash2 } from 'lucide-react'

export default function Notepad() {
  const [content, setContent] = useState("")
  const [fileName, setFileName] = useState("Untitled.txt")

  const handleSave = () => {
    alert(`Saved ${fileName} successfully!`)
  }

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all content?")) {
      setContent("")
    }
  }

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-gray-300">
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="px-2 py-1 text-sm border rounded border-gray-300 bg-white"
        />

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            <FileDown className="h-4 w-4 mr-1" />
            Export
          </button>
          <button
            onClick={handleClear}
            className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none p-4 border-0 outline-none bg-white"
        placeholder="Start typing..."
      />

      <div className="p-2 text-xs text-gray-500 border-t border-gray-300">
        {content.length} characters | {content.split(/\s+/).filter(Boolean).length} words
      </div>
    </div>
  )
}
