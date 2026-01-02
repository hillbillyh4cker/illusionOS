"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface FileSystemNode {
  name: string
  type: "file" | "directory"
  content?: string
  children?: { [key: string]: FileSystemNode }
  permissions?: string
  size?: number
  modified?: Date
}

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
  timestamp: Date
}

const initialFileSystem: { [key: string]: FileSystemNode } = {
  home: {
    name: "home",
    type: "directory",
    children: {
      user: {
        name: "user",
        type: "directory",
        children: {
          "welcome.txt": {
            name: "welcome.txt",
            type: "file",
            content:
              "Welcome to the IllusionOS Terminal!\nThis is a simulated Linux environment.\n\nRemember: Control is an illusion, but commands are real.\n\nTry these commands:\n- ls (list files)\n- cd (change directory)\n- pwd (print working directory)\n- cat (read file)\n- mkdir (create directory)\n- touch (create file)\n- rm (remove file/directory)\n- help (show all commands)",
            size: 320,
            modified: new Date(),
          },
          Documents: {
            name: "Documents",
            type: "directory",
            children: {
              "notes.txt": {
                name: "notes.txt",
                type: "file",
                content:
                  "My personal notes\n\n- Remember to backup files\n- Terminal shortcuts: Ctrl+C, Ctrl+L\n- Use 'history' to see command history",
                size: 120,
                modified: new Date(),
              },
            },
          },
          Downloads: {
            name: "Downloads",
            type: "directory",
            children: {},
          },
          Pictures: {
            name: "Pictures",
            type: "directory",
            children: {},
          },
          Desktop: {
            name: "Desktop",
            type: "directory",
            children: {},
          },
        },
      },
    },
  },
  etc: {
    name: "etc",
    type: "directory",
    children: {
      hosts: {
        name: "hosts",
        type: "file",
        content: "127.0.0.1 localhost\n::1 localhost",
        size: 32,
        modified: new Date(),
      },
    },
  },
  var: {
    name: "var",
    type: "directory",
    children: {
      log: {
        name: "log",
        type: "directory",
        children: {},
      },
    },
  },
}

export default function Terminal() {
  const [fileSystem, setFileSystem] = useState<{ [key: string]: FileSystemNode }>(initialFileSystem)
  const [currentPath, setCurrentPath] = useState(["/", "home", "user"])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentCommand, setCurrentCommand] = useState("")
  const [output, setOutput] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "IllusionOS Terminal v1.0.0",
      timestamp: new Date(),
    },
    {
      type: "output",
      content: "Type 'help' for available commands. Remember: Control is an illusion.",
      timestamp: new Date(),
    },
  ])

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  // Auto-focus terminal input
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    // Focus on mount
    focusInput()

    // Re-focus when clicking anywhere in the terminal
    const handleClick = () => {
      focusInput()
    }

    const terminalElement = scrollRef.current?.parentElement
    if (terminalElement) {
      terminalElement.addEventListener("click", handleClick)
      return () => {
        terminalElement.removeEventListener("click", handleClick)
      }
    }
  }, [])

  const getCurrentDirectory = (): FileSystemNode | null => {
    let current: FileSystemNode | { [key: string]: FileSystemNode } = fileSystem

    for (let i = 1; i < currentPath.length; i++) {
      const segment = currentPath[i]
      if (current && typeof current === "object" && "children" in current && current.children) {
        current = current.children[segment]
      } else if (current && typeof current === "object" && segment in current) {
        current = current[segment]
      } else {
        return null
      }
    }

    return current as FileSystemNode
  }

  const resolvePath = (path: string): string[] => {
    if (path.startsWith("/")) {
      const segments = path.split("/").filter(Boolean)
      return ["/", ...segments]
    } else {
      const segments = path.split("/").filter(Boolean)
      const newPath = [...currentPath]

      for (const segment of segments) {
        if (segment === "..") {
          if (newPath.length > 1) {
            newPath.pop()
          }
        } else if (segment !== ".") {
          newPath.push(segment)
        }
      }

      return newPath
    }
  }

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    // Add to history
    setCommandHistory((prev) => [...prev, trimmedCommand])
    setHistoryIndex(-1)

    // Add command to output
    const newOutput: TerminalLine = {
      type: "command",
      content: `${currentPath.join("/")} $ ${trimmedCommand}`,
      timestamp: new Date(),
    }

    const parts = trimmedCommand.split(" ")
    const cmd = parts[0]
    const args = parts.slice(1)

    const result: TerminalLine[] = [newOutput]

    switch (cmd) {
      case "help":
        result.push({
          type: "output",
          content: `Available commands:
ls [path]          - list directory contents
cd [path]          - change directory
pwd               - print working directory
cat [file]        - display file contents
mkdir [name]      - create directory
touch [name]      - create empty file
rm [name]         - remove file or directory
clear             - clear terminal
history           - show command history
whoami            - display current user
date              - show current date and time
echo [text]       - display text
tree              - show directory tree
find [name]       - find files/directories`,
          timestamp: new Date(),
        })
        break

      case "ls":
        const lsPath = args[0] ? resolvePath(args[0]) : currentPath
        const lsDir = getCurrentDirectoryAtPath(lsPath)

        if (!lsDir || lsDir.type !== "directory") {
          result.push({
            type: "error",
            content: `ls: cannot access '${args[0] || "."}': No such file or directory`,
            timestamp: new Date(),
          })
        } else {
          const items = Object.values(lsDir.children || {})
          const output = items
            .map((item) => {
              const prefix = item.type === "directory" ? "d" : "-"
              const permissions = item.permissions || (item.type === "directory" ? "rwxr-xr-x" : "rw-r--r--")
              const size = item.size || 0
              const modified = item.modified?.toLocaleDateString() || new Date().toLocaleDateString()
              return `${prefix}${permissions} 1 user user ${size.toString().padStart(8)} ${modified} ${item.name}`
            })
            .join("\n")

          result.push({
            type: "output",
            content: output || "total 0",
            timestamp: new Date(),
          })
        }
        break

      case "cd":
        const cdPath = args[0] || "/home/user"
        const newPath = resolvePath(cdPath)
        const targetDir = getCurrentDirectoryAtPath(newPath)

        if (!targetDir || targetDir.type !== "directory") {
          result.push({
            type: "error",
            content: `cd: ${cdPath}: No such file or directory`,
            timestamp: new Date(),
          })
        } else {
          setCurrentPath(newPath)
        }
        break

      case "pwd":
        result.push({
          type: "output",
          content: currentPath.join("/"),
          timestamp: new Date(),
        })
        break

      case "cat":
        if (!args[0]) {
          result.push({
            type: "error",
            content: "cat: missing file operand",
            timestamp: new Date(),
          })
        } else {
          const filePath = resolvePath(args[0])
          const file = getCurrentDirectoryAtPath(filePath)

          if (!file) {
            result.push({
              type: "error",
              content: `cat: ${args[0]}: No such file or directory`,
              timestamp: new Date(),
            })
          } else if (file.type !== "file") {
            result.push({
              type: "error",
              content: `cat: ${args[0]}: Is a directory`,
              timestamp: new Date(),
            })
          } else {
            result.push({
              type: "output",
              content: file.content || "",
              timestamp: new Date(),
            })
          }
        }
        break

      case "mkdir":
        if (!args[0]) {
          result.push({
            type: "error",
            content: "mkdir: missing operand",
            timestamp: new Date(),
          })
        } else {
          const success = createDirectory(args[0])
          if (!success) {
            result.push({
              type: "error",
              content: `mkdir: cannot create directory '${args[0]}': File exists or invalid path`,
              timestamp: new Date(),
            })
          }
        }
        break

      case "touch":
        if (!args[0]) {
          result.push({
            type: "error",
            content: "touch: missing file operand",
            timestamp: new Date(),
          })
        } else {
          const success = createFile(args[0])
          if (!success) {
            result.push({
              type: "error",
              content: `touch: cannot create file '${args[0]}': File exists or invalid path`,
              timestamp: new Date(),
            })
          }
        }
        break

      case "rm":
        if (!args[0]) {
          result.push({
            type: "error",
            content: "rm: missing operand",
            timestamp: new Date(),
          })
        } else {
          const success = removeItem(args[0])
          if (!success) {
            result.push({
              type: "error",
              content: `rm: cannot remove '${args[0]}': No such file or directory`,
              timestamp: new Date(),
            })
          }
        }
        break

      case "clear":
        setOutput([])
        return

      case "history":
        result.push({
          type: "output",
          content: commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n"),
          timestamp: new Date(),
        })
        break

      case "whoami":
        result.push({
          type: "output",
          content: "user",
          timestamp: new Date(),
        })
        break

      case "date":
        result.push({
          type: "output",
          content: new Date().toString(),
          timestamp: new Date(),
        })
        break

      case "echo":
        result.push({
          type: "output",
          content: args.join(" "),
          timestamp: new Date(),
        })
        break

      case "tree":
        result.push({
          type: "output",
          content: generateTree(getCurrentDirectory(), ""),
          timestamp: new Date(),
        })
        break

      case "find":
        if (!args[0]) {
          result.push({
            type: "error",
            content: "find: missing search term",
            timestamp: new Date(),
          })
        } else {
          const found = findItems(args[0])
          result.push({
            type: "output",
            content: found.length > 0 ? found.join("\n") : `find: '${args[0]}' not found`,
            timestamp: new Date(),
          })
        }
        break

      default:
        result.push({
          type: "error",
          content: `${cmd}: command not found`,
          timestamp: new Date(),
        })
    }

    setOutput((prev) => [...prev, ...result])
  }

  const getCurrentDirectoryAtPath = (path: string[]): FileSystemNode | null => {
    let current: FileSystemNode | { [key: string]: FileSystemNode } = fileSystem

    for (let i = 1; i < path.length; i++) {
      const segment = path[i]
      if (current && typeof current === "object" && "children" in current && current.children) {
        current = current.children[segment]
      } else if (current && typeof current === "object" && segment in current) {
        current = current[segment]
      } else {
        return null
      }
    }

    return current as FileSystemNode
  }

  const createDirectory = (name: string): boolean => {
    const currentDir = getCurrentDirectory()
    if (!currentDir || currentDir.type !== "directory" || !currentDir.children) return false

    if (currentDir.children[name]) return false

    setFileSystem((prev) => {
      const newFS = JSON.parse(JSON.stringify(prev))
      let current = newFS

      for (let i = 1; i < currentPath.length; i++) {
        const segment = currentPath[i]
        if (current[segment]) {
          current = current[segment].children || current[segment]
        }
      }

      if (current.children) {
        current.children[name] = {
          name,
          type: "directory",
          children: {},
          modified: new Date(),
        }
      }

      return newFS
    })

    return true
  }

  const createFile = (name: string): boolean => {
    const currentDir = getCurrentDirectory()
    if (!currentDir || currentDir.type !== "directory" || !currentDir.children) return false

    if (currentDir.children[name]) return false

    setFileSystem((prev) => {
      const newFS = JSON.parse(JSON.stringify(prev))
      let current = newFS

      for (let i = 1; i < currentPath.length; i++) {
        const segment = currentPath[i]
        if (current[segment]) {
          current = current[segment].children || current[segment]
        }
      }

      if (current.children) {
        current.children[name] = {
          name,
          type: "file",
          content: "",
          size: 0,
          modified: new Date(),
        }
      }

      return newFS
    })

    return true
  }

  const removeItem = (name: string): boolean => {
    const currentDir = getCurrentDirectory()
    if (!currentDir || currentDir.type !== "directory" || !currentDir.children) return false

    if (!currentDir.children[name]) return false

    setFileSystem((prev) => {
      const newFS = JSON.parse(JSON.stringify(prev))
      let current = newFS

      for (let i = 1; i < currentPath.length; i++) {
        const segment = currentPath[i]
        if (current[segment]) {
          current = current[segment].children || current[segment]
        }
      }

      if (current.children) {
        delete current.children[name]
      }

      return newFS
    })

    return true
  }

  const generateTree = (node: FileSystemNode | null, prefix: string): string => {
    if (!node || node.type !== "directory" || !node.children) return ""

    const items = Object.values(node.children)
    let result = ""

    items.forEach((item, index) => {
      const isLast = index === items.length - 1
      const connector = isLast ? "└── " : "├── "
      result += prefix + connector + item.name + "\n"

      if (item.type === "directory" && item.children) {
        const newPrefix = prefix + (isLast ? "    " : "│   ")
        result += generateTree(item, newPrefix)
      }
    })

    return result
  }

  const findItems = (searchTerm: string): string[] => {
    const results: string[] = []

    const search = (node: FileSystemNode | { [key: string]: FileSystemNode }, path: string) => {
      if ("children" in node && node.children) {
        Object.values(node.children).forEach((child) => {
          const childPath = path + "/" + child.name
          if (child.name.includes(searchTerm)) {
            results.push(childPath)
          }
          if (child.type === "directory" && child.children) {
            search(child, childPath)
          }
        })
      } else if (typeof node === "object") {
        Object.values(node).forEach((child) => {
          const childPath = path + "/" + child.name
          if (child.name.includes(searchTerm)) {
            results.push(childPath)
          }
          if (child.type === "directory" && child.children) {
            search(child, childPath)
          }
        })
      }
    }

    search(fileSystem, "")
    return results
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand)
      setCurrentCommand("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentCommand("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentCommand(commandHistory[newIndex])
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion for directories
      const currentDir = getCurrentDirectory()
      if (currentDir && currentDir.children) {
        const matches = Object.keys(currentDir.children).filter((name) =>
          name.startsWith(currentCommand.split(" ").pop() || ""),
        )
        if (matches.length === 1) {
          const parts = currentCommand.split(" ")
          parts[parts.length - 1] = matches[0]
          setCurrentCommand(parts.join(" "))
        }
      }
    }
  }

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-800 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-300 text-xs">user@illusion-os: {currentPath.join("/")}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOutput([])}
          className="text-gray-400 hover:text-white hover:bg-gray-700 text-xs px-2 py-1 h-6"
        >
          Clear
        </Button>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-auto p-2 bg-black" ref={scrollRef}>
        <div className="space-y-0">
          {output.map((line, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap font-mono text-sm leading-tight ${
                line.type === "command" ? "text-white" : line.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {line.content}
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Input */}
      <div className="px-2 py-1 bg-black border-t border-gray-800">
        <div className="flex items-center">
          <span className="text-green-400 font-mono text-sm mr-1">user@illusion-os:{currentPath.join("/")}$</span>
          <input
            ref={inputRef}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-black text-green-400 font-mono text-sm border-none outline-none focus:outline-none focus:ring-0 p-0 m-0"
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
            }}
            autoFocus
            spellCheck={false}
          />
          <span className="text-green-400 font-mono text-sm animate-pulse">█</span>
        </div>
      </div>
    </div>
  )
}
