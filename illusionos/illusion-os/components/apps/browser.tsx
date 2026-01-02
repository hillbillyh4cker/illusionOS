"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, RotateCcw, Home, Star, Plus, X, Search, Lock, Globe, Menu, BookmarkIcon, ExternalLink, AlertTriangle, Shield } from 'lucide-react'

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isLoading: boolean
  content?: string
  error?: string
}

interface Bookmark {
  id: string
  title: string
  url: string
  favicon?: string
}

interface WebPage {
  url: string
  title: string
  content: React.ReactNode
}

export default function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "New Tab",
      url: "desktop://home",
      isLoading: false,
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [addressBarValue, setAddressBarValue] = useState("")
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "1", title: "Home", url: "desktop://home", favicon: "🏠" },
    { id: "2", title: "Search", url: "desktop://search", favicon: "🔍" },
    { id: "3", title: "News", url: "desktop://news", favicon: "📰" },
    { id: "4", title: "Weather", url: "desktop://weather", favicon: "🌤️" },
    { id: "5", title: "Wikipedia", url: "https://en.wikipedia.org", favicon: "📚" },
    { id: "6", title: "GitHub", url: "https://api.github.com", favicon: "🐙" },
  ])
  const [history, setHistory] = useState<string[]>(["desktop://home"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showBookmarks, setShowBookmarks] = useState(true)

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  useEffect(() => {
    if (activeTab) {
      setAddressBarValue(activeTab.url)
    }
  }, [activeTab])

  // --- helper: fetch external HTML safely ---
  const fetchWebContent = async (url: string): Promise<{ content: string; title: string; error?: string }> => {
    // 1️⃣  try our first-party proxy (no CORS)
    try {
      const local = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
      if (local.ok) {
        const json = await local.json()
        if (json.content) {
          return processFetchedHtml(url, json.content)
        }
      }
    } catch (e) {
      console.warn("Local proxy failed, falling back → AllOrigins", e)
    }

    // 2️⃣  fall back to the public AllOrigins proxy
    try {
      const backup = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      const data = await backup.json()
      if (data?.contents) {
        return processFetchedHtml(url, data.contents)
      }
    } catch (e) {
      console.error("AllOrigins fallback failed:", e)
    }

    // 3️⃣  give up – bubble a readable error
    return {
      content: "",
      title: "Error",
      error: "Failed to fetch webpage. The site may block proxies or there is a network error.",
    }
  }

  // --- tiny utility so the logic above stays clean ---
  const processFetchedHtml = (url: string, rawHtml: string): { content: string; title: string } => {
    const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1] : new URL(url).hostname

    // absolute-ify links + add overlay (same code as before)
    const content = rawHtml
      .replace(/href="\/([^"]*?)"/g, `href="${new URL(url).origin}/$1"`)
      .replace(/src="\/([^"]*?)"/g, `src="${new URL(url).origin}/$1"`)
      .replace(/<head[^>]*>/i, `<head><base href="${url}">`)
      .replace(
        /<head[^>]*>/i,
        `<head>
         <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src * data:;">
         <style>
           body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif !important; }
           .desktop-browser-overlay{
             position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,.8);
             color:white;padding:8px;text-align:center;font-size:12px;z-index:9999;
           }
         </style>`,
      )
      .replace(
        /<body[^>]*>/i,
        `<body><div class="desktop-browser-overlay">🌐 Viewing ${new URL(url).hostname} via Desktop OS Browser</div>`,
      )

    return { content, title }
  }

  // Built-in web pages
  const getWebPageContent = (url: string): WebPage => {
    switch (url) {
      case "desktop://home":
        return {
          url,
          title: "Desktop OS - Home",
          content: (
            <div className="max-w-4xl mx-auto p-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">IllusionOS Browser</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">Your gateway to the web</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">Search</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Search the web and find information</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToUrl("desktop://search")}
                    className="w-full"
                  >
                    Open Search
                  </Button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold mb-2">Wikipedia</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Browse the free encyclopedia</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToUrl("https://en.wikipedia.org")}
                    className="w-full"
                  >
                    Visit Wikipedia
                  </Button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-4">📰</div>
                  <h3 className="text-lg font-semibold mb-2">News</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Read the latest news</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToUrl("desktop://news")}
                    className="w-full"
                  >
                    Read News
                  </Button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-4">🌤️</div>
                  <h3 className="text-lg font-semibold mb-2">Weather</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Check the weather forecast</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToUrl("desktop://weather")}
                    className="w-full"
                  >
                    View Weather
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-200 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Web Proxy Enabled
                </h3>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  This browser can now load external websites using a proxy service! Try visiting:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToUrl("https://en.wikipedia.org")}
                    className="text-left justify-start"
                  >
                    📚 Wikipedia
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToUrl("https://httpbin.org/html")}
                    className="text-left justify-start"
                  >
                    🧪 Test Page
                  </Button>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                  Note: Some sites may not work due to security restrictions or anti-proxy measures.
                </p>
              </div>
            </div>
          ),
        }

      case "desktop://search":
        return {
          url,
          title: "Desktop Search",
          content: <SearchPage onNavigate={navigateToUrl} />,
        }

      case "desktop://news":
        return {
          url,
          title: "Desktop News",
          content: <NewsPage />,
        }

      case "desktop://weather":
        return {
          url,
          title: "Weather",
          content: <WeatherPage />,
        }

      default:
        return {
          url,
          title: "Page Not Found",
          content: <NotFoundPage url={url} />,
        }
    }
  }

  const createNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "New Tab",
      url: "desktop://home",
      isLoading: false,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return

    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== tabId)
      if (tabId === activeTabId && filtered.length > 0) {
        setActiveTabId(filtered[filtered.length - 1].id)
      }
      return filtered
    })
  }

  const navigateToUrl = async (url: string) => {
    if (!url.trim()) return

    let finalUrl = url

    // Handle different URL types
    if (!url.startsWith("desktop://") && !url.startsWith("http://") && !url.startsWith("https://")) {
      if (url.includes(".") && !url.includes(" ")) {
        finalUrl = `https://${url}`
      } else {
        finalUrl = `desktop://search?q=${encodeURIComponent(url)}`
      }
    }

    // Set loading state
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              url: finalUrl,
              isLoading: true,
              title: "Loading...",
              content: undefined,
              error: undefined,
            }
          : tab,
      ),
    )

    // Add to history
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), finalUrl])
    setHistoryIndex(historyIndex + 1)

    try {
      if (finalUrl.startsWith("desktop://")) {
        // Handle built-in pages
        const pageInfo = getWebPageContent(finalUrl)
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? {
                  ...tab,
                  isLoading: false,
                  title: pageInfo.title,
                }
              : tab,
          ),
        )
      } else {
        // Handle external URLs
        const webContent = await fetchWebContent(finalUrl)
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? {
                  ...tab,
                  isLoading: false,
                  title: webContent.title,
                  content: webContent.content,
                  error: webContent.error,
                }
              : tab,
          ),
        )
      }
    } catch (error) {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                isLoading: false,
                title: "Error",
                error: "Failed to load page",
              }
            : tab,
        ),
      )
    }
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const url = history[newIndex]
      navigateToUrl(url)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const url = history[newIndex]
      navigateToUrl(url)
    }
  }

  const refresh = () => {
    if (activeTab) {
      navigateToUrl(activeTab.url)
    }
  }

  const goHome = () => {
    navigateToUrl("desktop://home")
  }

  const addBookmark = () => {
    if (activeTab && activeTab.url !== "desktop://home") {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        title: activeTab.title,
        url: activeTab.url,
        favicon: "🔖",
      }
      setBookmarks((prev) => [...prev, newBookmark])
    }
  }

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId))
  }

  const openBookmark = (url: string) => {
    navigateToUrl(url)
  }

  const handleAddressBarSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToUrl(addressBarValue)
  }

  const renderContent = () => {
    if (!activeTab) return null

    if (activeTab.isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading webpage...</p>
          </div>
        </div>
      )
    }

    if (activeTab.error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Failed to Load Page</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{activeTab.error}</p>
            <div className="space-y-2">
              <Button onClick={refresh} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.open(activeTab.url, "_blank")} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Main Browser
              </Button>
            </div>
          </div>
        </div>
      )
    }

    if (activeTab.url.startsWith("desktop://")) {
      const pageInfo = getWebPageContent(activeTab.url)
      return pageInfo.content
    }

    if (activeTab.content) {
      return (
        <iframe
          srcDoc={activeTab.content}
          className="w-full h-full border-0"
          title="Web Content"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        />
      )
    }

    return null
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 max-w-xs px-3 py-2 border-r border-gray-300 dark:border-gray-700 cursor-pointer ${
                tab.id === activeTabId
                  ? "bg-white dark:bg-gray-900 text-black dark:text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <div className="flex items-center min-w-0 flex-1">
                {tab.isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
                ) : tab.error ? (
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />
                ) : (
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                )}
                <span className="truncate text-sm">{tab.title}</span>
              </div>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 mx-2" onClick={createNewTab}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-1 mr-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack} disabled={historyIndex <= 0}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refresh}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goHome}>
            <Home className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleAddressBarSubmit} className="flex-1 flex items-center">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {activeTab?.url.startsWith("https://") ? (
                <Lock className="h-4 w-4 text-green-600" />
              ) : activeTab?.url.startsWith("desktop://") ? (
                <Shield className="h-4 w-4 text-blue-600" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <Input
              value={addressBarValue}
              onChange={(e) => setAddressBarValue(e.target.value)}
              placeholder="Search or enter address"
              className="pl-10 pr-4 h-9 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>
        </form>

        <div className="flex items-center space-x-1 ml-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={addBookmark}
            disabled={!activeTab || activeTab.url === "desktop://home"}
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBookmarks(!showBookmarks)}>
            <BookmarkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      {showBookmarks && (
        <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
          {bookmarks.map((bookmark) => (
            <Button
              key={bookmark.id}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 mr-2 text-sm whitespace-nowrap"
              onClick={() => openBookmark(bookmark.url)}
            >
              <span>{bookmark.favicon}</span>
              <span>{bookmark.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation()
                  removeBookmark(bookmark.id)
                }}
              >
                <X className="h-2 w-2" />
              </Button>
            </Button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">{renderContent()}</div>
    </div>
  )
}

// Search page component
function SearchPage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Navigate to the search query
    if (query.includes(".") && !query.includes(" ")) {
      onNavigate(`https://${query}`)
    } else {
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(query)}`)
    }
  }

  const quickLinks = [
    { title: "Wikipedia", url: "https://en.wikipedia.org", icon: "📚" },
    { title: "GitHub", url: "https://github.com", icon: "🐙" },
    { title: "Stack Overflow", url: "https://stackoverflow.com", icon: "💻" },
    { title: "MDN Docs", url: "https://developer.mozilla.org", icon: "📖" },
  ]

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">IllusionOS Search</h1>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web or enter a URL..."
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quickLinks.map((link, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex items-center space-x-3 p-4 h-auto"
            onClick={() => onNavigate(link.url)}
          >
            <span className="text-2xl">{link.icon}</span>
            <span>{link.title}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

function NewsPage() {
  const news = [
    {
      title: "IllusionOS Browser Now Supports External Websites",
      summary: "The browser can now load external websites using a proxy service.",
      time: "1 hour ago",
    },
    {
      title: "Control is an Illusion - New Desktop Theme",
      summary: "New philosophical desktop wallpaper added to IllusionOS.",
      time: "3 hours ago",
    },
    {
      title: "Browser Security Updates",
      summary: "Enhanced security measures for web browsing in IllusionOS.",
      time: "5 hours ago",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">IllusionOS News</h1>
      <div className="space-y-6">
        {news.map((article, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{article.summary}</p>
            <div className="text-sm text-gray-500">{article.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeatherPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Weather</h1>
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-8 text-white text-center">
        <div className="text-6xl mb-4">☀️</div>
        <h2 className="text-2xl font-bold mb-2">Sunny</h2>
        <div className="text-4xl font-bold mb-4">72°F</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold">Humidity</div>
            <div>45%</div>
          </div>
          <div>
            <div className="font-semibold">Wind</div>
            <div>8 mph</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WebCalculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (memory === null) {
      setMemory(inputValue)
    } else if (operation) {
      const currentValue = memory || 0
      let newValue: number

      switch (operation) {
        case "+":
          newValue = currentValue + inputValue
          break
        case "-":
          newValue = currentValue - inputValue
          break
        case "×":
          newValue = currentValue * inputValue
          break
        case "÷":
          newValue = currentValue / inputValue
          break
        default:
          newValue = inputValue
      }

      setMemory(newValue)
      setDisplay(String(newValue))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = () => {
    if (memory !== null && operation) {
      performOperation("=")
      setMemory(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Web Calculator</h1>
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="text-right text-white text-2xl font-mono">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={clear} className="col-span-2">
          Clear
        </Button>
        <Button onClick={() => performOperation("÷")}>÷</Button>
        <Button onClick={() => performOperation("×")}>×</Button>
        <Button onClick={() => inputDigit("7")}>7</Button>
        <Button onClick={() => inputDigit("8")}>8</Button>
        <Button onClick={() => inputDigit("9")}>9</Button>
        <Button onClick={() => performOperation("-")}>-</Button>
        <Button onClick={() => inputDigit("4")}>4</Button>
        <Button onClick={() => inputDigit("5")}>5</Button>
        <Button onClick={() => inputDigit("6")}>6</Button>
        <Button onClick={() => performOperation("+")}>+</Button>
        <Button onClick={() => inputDigit("1")}>1</Button>
        <Button onClick={() => inputDigit("2")}>2</Button>
        <Button onClick={() => inputDigit("3")}>3</Button>
        <Button onClick={calculate} className="row-span-2">
          =
        </Button>
        <Button onClick={() => inputDigit("0")} className="col-span-2">
          0
        </Button>
        <Button onClick={() => inputDigit(".")}>.</Button>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">About IllusionOS</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">IllusionOS Browser</h2>
          <p className="text-gray-600 dark:text-gray-400">
            A modern web browser built for the IllusionOS environment. Features include tabbed browsing, bookmarks,
            history, and built-in web applications.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Version</h2>
          <p className="text-gray-600 dark:text-gray-400">IllusionOS Browser v1.0.0</p>
        </div>
      </div>
    </div>
  )
}

function ExternalLinkPage({ url }: { url: string }) {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="text-6xl mb-6">🌐</div>
      <h1 className="text-2xl font-bold mb-4">External Website</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        This browser cannot directly load external websites due to security restrictions.
      </p>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <code className="text-sm break-all">{url}</code>
      </div>
      <Button onClick={() => window.open(url, "_blank")} className="flex items-center space-x-2 mx-auto">
        <ExternalLink className="h-4 w-4" />
        <span>Open in main browser</span>
      </Button>
    </div>
  )
}

function NotFoundPage({ url }: { url: string }) {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <code className="text-sm break-all">{url}</code>
      </div>
    </div>
  )
}
