"use client"

import { useState } from "react"
import { Gamepad2 } from 'lucide-react'

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const games = [
    { id: "snake", name: "Snake", description: "Classic snake game", icon: "🐍" },
    { id: "tetris", name: "Tetris", description: "Block puzzle game", icon: "🧩" },
    { id: "pong", name: "Pong", description: "Classic arcade game", icon: "🏓" },
    { id: "breakout", name: "Breakout", description: "Brick breaking game", icon: "🧱" }
  ]

  if (selectedGame) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold mb-4">Game Loading...</h2>
        <p className="text-gray-600 mb-6">
          {games.find(g => g.id === selectedGame)?.name} would load here
        </p>
        <button
          onClick={() => setSelectedGame(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Games
        </button>
      </div>
    )
  }

  return (
    <div className="h-full p-6">
      <div className="text-center mb-8">
        <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-blue-500" />
        <h1 className="text-3xl font-bold mb-2">IllusionOS Game Center</h1>
        <p className="text-gray-600">Choose a game to play - but remember, winning is just an illusion</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white border rounded-lg p-6 hover:shadow-lg cursor-pointer transition-shadow"
            onClick={() => setSelectedGame(game.id)}
          >
            <div className="text-4xl mb-3 text-center">{game.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-center">{game.name}</h3>
            <p className="text-gray-600 text-sm text-center">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
