"use client"

import { useState } from "react"
import { Grid2X2, List, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Image {
  id: string
  src: string
  title: string
  date: string
}

const initialImages: Image[] = [
  { id: "1", src: "/placeholder.svg?height=400&width=600&text=Mountain", title: "Mountain View", date: "June 12, 2023" },
  { id: "2", src: "/placeholder.svg?height=400&width=600&text=Beach", title: "Beach Sunset", date: "May 28, 2023" },
  { id: "3", src: "/placeholder.svg?height=400&width=600&text=Forest", title: "Forest Trail", date: "April 15, 2023" },
  { id: "4", src: "/placeholder.svg?height=400&width=600&text=City", title: "City Skyline", date: "March 22, 2023" }
]

export default function Gallery() {
  const [images] = useState<Image[]>(initialImages)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredImages = images.filter(image => 
    image.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openImage = (image: Image) => setSelectedImage(image)
  const closeImage = () => setSelectedImage(null)

  const navigateImage = (direction: "next" | "prev") => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
    let newIndex = direction === "next" 
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[newIndex])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search images..."
            className="pl-8 pr-4 py-1 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openImage(image)}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="p-2">
                  <div className="font-medium truncate">{image.title}</div>
                  <div className="text-xs text-gray-500">{image.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => openImage(image)}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-medium">{image.title}</div>
                  <div className="text-sm text-gray-500">{image.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white hover:bg-gray-800/50 p-2 rounded"
            onClick={closeImage}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-800/50 p-2 rounded"
            onClick={() => navigateImage("prev")}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="max-w-4xl max-h-[80vh]">
            <img
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-white text-center">
              <div className="text-xl font-medium">{selectedImage.title}</div>
              <div className="text-gray-400">{selectedImage.date}</div>
            </div>
          </div>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-800/50 p-2 rounded"
            onClick={() => navigateImage("next")}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  )
}
