"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Volume2, VolumeX, Maximize2 } from "lucide-react"

declare global {
  interface Window {
    Dos: any
    emulators: any
  }
}

export default function Doom() {
  const dosRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ciRef = useRef<any>(null)

  useEffect(() => {
    const loadDoom = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load js-dos
        // keep a local ref so we can check parentNode later
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/js-dos@6.22.59/dist/js-dos.js"
        script.onload = async () => {
          try {
            if (dosRef.current && window.Dos) {
              // Initialize DOS emulator
              const ci = await window.Dos(dosRef.current, {
                wdosboxUrl: "https://cdn.jsdelivr.net/npm/js-dos@6.22.59/dist/wdosbox.js",
              })

              ciRef.current = ci

              // Load DOOM shareware
              const main = await ci.main(["-c", "mount c .", "-c", "c:", "-c", "doom.exe"])

              // You would need to provide the DOOM WAD file
              // For now, we'll show a message about needing the game files
              setError("DOOM game files not found. You need to provide doom.wad or doom1.wad file.")
              setIsLoading(false)
            }
          } catch (err) {
            console.error("Error initializing DOOM:", err)
            setError("Failed to initialize DOOM emulator")
            setIsLoading(false)
          }
        }

        script.onerror = () => {
          setError("Failed to load DOS emulator")
          setIsLoading(false)
        }

        document.head.appendChild(script)

        /* ---------- CLEAN-UP ----------
         * hot reloads / fast refresh can trigger Effect
         * clean-ups in rapid succession.  Make sure we
         * try to detach the <script> element only when it
         * is still a child of something to avoid
         * “removeChild … is not a child of this node”.
         */
        return () => {
          /* remove only if the element is still in <head> */
          if (script.parentElement === document.head) {
            document.head.removeChild(script)
          }
        }
      } catch (err) {
        console.error("Error loading DOOM:", err)
        setError("Failed to load DOOM")
        setIsLoading(false)
      }
    }

    loadDoom()

    return () => {
      // ensure emulator is shut down
      if (ciRef.current) {
        try {
          ciRef.current.exit()
        } catch (err) {
          console.error("Error cleaning up DOOM:", err)
        }
      }
    }
  }, [])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Implement mute functionality with DOS emulator
  }

  const resetGame = () => {
    if (ciRef.current) {
      try {
        ciRef.current.exit()
        // Reinitialize
        window.location.reload()
      } catch (err) {
        console.error("Error resetting DOOM:", err)
      }
    }
  }

  const toggleFullscreen = () => {
    if (dosRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        dosRef.current.requestFullscreen()
      }
    }
  }

  if (error) {
    return (
      <div className="h-full bg-black text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="text-red-500 font-bold">DOOM (1993)</div>
          </div>
        </div>

        {/* Error Message */}
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">💀</div>
            <div className="text-2xl font-bold text-red-500 mb-4">DOOM Not Available</div>
            <div className="text-gray-400 mb-6">{error}</div>
            <div className="text-sm text-gray-500 mb-4">
              To play the original DOOM, you need:
              <ul className="list-disc list-inside mt-2 text-left">
                <li>DOOM.WAD or DOOM1.WAD file</li>
                <li>A proper DOS emulator setup</li>
                <li>Game files hosted on your server</li>
              </ul>
            </div>
            <div className="text-xs text-gray-600">
              The original DOOM is copyrighted by id Software. You must own a legal copy to play.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-black text-white flex flex-col">
      {/* Game Header */}
      <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="text-red-500 font-bold">DOOM (1993)</div>
          {isLoading && <div className="text-sm text-yellow-500">Loading...</div>}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetGame}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* DOS Emulator Container */}
      <div className="flex-1 bg-black relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <div className="text-xl font-bold text-red-500 mb-2">Loading DOOM...</div>
              <div className="text-sm text-gray-400">Initializing DOS emulator</div>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              </div>
            </div>
          </div>
        )}

        <div
          ref={dosRef}
          className="w-full h-full"
          style={{
            minHeight: "400px",
            background: "#000",
          }}
        />
      </div>

      {/* Game Info */}
      <div className="p-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-semibold mb-1">Controls:</div>
            <div>Arrow Keys - Move</div>
            <div>Ctrl - Fire</div>
            <div>Space - Open doors</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Game:</div>
            <div>Original DOOM (1993)</div>
            <div>id Software</div>
          </div>
        </div>
      </div>
    </div>
  )
}
