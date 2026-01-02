"use client"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, Info } from "lucide-react"

export default function DoomAlternative() {
  return (
    <div className="h-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="text-red-500 font-bold">DOOM (1993)</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center bg-black p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6">🔥</div>
          <div className="text-4xl font-bold text-red-500 mb-4">DOOM</div>
          <div className="text-xl text-gray-300 mb-8">The Ultimate Demon-Slaying Experience</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold text-red-400 mb-3">Play Online</h3>
              <p className="text-sm text-gray-400 mb-4">
                Experience DOOM in your browser with these web-based versions:
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-red-900 border-red-700 text-white hover:bg-red-800"
                  onClick={() => window.open("https://dos.zone/doom/", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  DOS.Zone DOOM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-red-900 border-red-700 text-white hover:bg-red-800"
                  onClick={() => window.open("https://archive.org/details/DoomsharewareEpisode", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Internet Archive
                </Button>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold text-green-400 mb-3">Modern Ports</h3>
              <p className="text-sm text-gray-400 mb-4">Enhanced versions with modern features:</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-green-900 border-green-700 text-white hover:bg-green-800"
                  onClick={() => window.open("https://github.com/chocolate-doom/chocolate-doom", "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Chocolate DOOM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-green-900 border-green-700 text-white hover:bg-green-800"
                  onClick={() => window.open("https://zdoom.org/", "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  ZDoom
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Info className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-bold text-blue-400">About DOOM</h3>
            </div>
            <div className="text-sm text-gray-400 text-left space-y-2">
              <p>
                <strong>Released:</strong> December 10, 1993
              </p>
              <p>
                <strong>Developer:</strong> id Software
              </p>
              <p>
                <strong>Genre:</strong> First-person shooter
              </p>
              <p>
                <strong>Legacy:</strong> Revolutionized 3D gaming and popularized the FPS genre. The shareware episode
                is freely available, but the full game requires purchase.
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            DOOM is a trademark of id Software LLC. This desktop app provides links to legal ways to play DOOM.
            <br />
            To embed DOOM directly, you would need proper licensing and game files.
          </div>
        </div>
      </div>
    </div>
  )
}
