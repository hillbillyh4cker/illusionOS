"use client"

import { useState } from "react"
import { FolderOpen, File, ImageIcon, FileText, Music, Video, ChevronRight, ChevronDown } from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: "file" | "folder" | "image" | "document" | "audio" | "video"
  size?: string
  modified?: string
  children?: FileItem[]
}

const initialFiles: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    modified: "2023-06-15",
    children: [
      { id: "1-1", name: "Resume.pdf", type: "document", size: "245 KB", modified: "2023-06-10" },
      { id: "1-2", name: "Project Notes.txt", type: "document", size: "12 KB", modified: "2023-06-12" }
    ]
  },
  {
    id: "2", 
    name: "Images",
    type: "folder",
    modified: "2023-06-14",
    children: [
      { id: "2-1", name: "Vacation.jpg", type: "image", size: "1.2 MB", modified: "2023-06-05" },
      { id: "2-2", name: "Profile.png", type: "image", size: "450 KB", modified: "2023-06-08" }
    ]
  },
  { id: "3", name: "Notes.txt", type: "document", size: "8 KB", modified: "2023-06-11" }
]

export default function Files() {
  const [files] = useState<FileItem[]>(initialFiles)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder": return <FolderOpen className="h-5 w-5 text-yellow-500" />
      case "image": return <ImageIcon className="h-5 w-5 text-purple-500" />
      case "document": return <FileText className="h-5 w-5 text-blue-500" />
      case "audio": return <Music className="h-5 w-5 text-green-500" />
      case "video": return <Video className="h-5 w-5 text-red-500" />
      default: return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const renderFileItem = (file: FileItem, depth = 0) => {
    const isFolder = file.type === "folder"
    const isExpanded = expandedFolders[file.id]

    return (
      <div key={file.id}>
        <div
          className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => isFolder && toggleFolder(file.id)}
        >
          {isFolder && (
            <div className="mr-1">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          )}
          <div className="mr-2">{getFileIcon(file.type)}</div>
          <div className="flex-1 truncate">{file.name}</div>
          {file.size && <div className="text-sm text-gray-500 mr-4">{file.size}</div>}
          <div className="text-sm text-gray-500">{file.modified}</div>
        </div>

        {isFolder && isExpanded && file.children && (
          <div>{file.children.map(child => renderFileItem(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Files</h2>
        <input
          type="text"
          placeholder="Search files..."
          className="px-3 py-1 border rounded"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex items-center p-2 font-medium text-sm border-b">
          <div className="w-5" />
          <div className="w-5" />
          <div className="flex-1">Name</div>
          <div className="w-24 text-right">Size</div>
          <div className="w-32 text-right">Date Modified</div>
        </div>

        <div className="mt-2">
          {files.map(file => renderFileItem(file))}
        </div>
      </div>
    </div>
  )
}
