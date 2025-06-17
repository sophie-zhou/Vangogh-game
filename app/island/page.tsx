"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sun, Moon, Plus, Expand, CloudRain, Snowflake, Flower2, Leaf } from "lucide-react"
import Link from "next/link"

interface IslandItem {
  id: string
  type: "animal" | "decoration" | "building"
  name: string
  component: React.ComponentType<{ size: number; season: string; weather: string }>
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  owned: boolean
  isDragging?: boolean
}

interface WeatherEffect {
  type: "sunny" | "rainy" | "snowy" | "windy"
  intensity: number
}

type Season = "spring" | "summer" | "autumn" | "winter"

// Van Gogh style components
const VanGoghCat: React.FC<{ size: number; season: string; weather: string }> = ({ size }) => (
  <div className="relative animate-bounce-gentle" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      {/* Cat body - Van Gogh swirling style */}
      <ellipse cx="50" cy="60" rx="25" ry="20" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />
      <path d="M25 60 Q30 45 50 50 Q70 45 75 60" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />

      {/* Van Gogh swirl patterns */}
      <path d="M35 55 Q40 50 45 55 Q50 60 45 65" fill="none" stroke="#2d3748" strokeWidth="1" />
      <path d="M55 55 Q60 50 65 55 Q70 60 65 65" fill="none" stroke="#2d3748" strokeWidth="1" />

      {/* Cat head */}
      <circle cx="50" cy="35" r="18" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />

      {/* Ears with Van Gogh style */}
      <path d="M35 25 Q40 15 45 25" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />
      <path d="M55 25 Q60 15 65 25" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />

      {/* Eyes - Van Gogh style */}
      <ellipse cx="43" cy="32" rx="3" ry="4" fill="#fbbf24" />
      <ellipse cx="57" cy="32" rx="3" ry="4" fill="#fbbf24" />
      <circle cx="43" cy="32" r="1.5" fill="#1f2937" />
      <circle cx="57" cy="32" r="1.5" fill="#1f2937" />

      {/* Nose and mouth */}
      <path d="M48 38 L52 38 L50 42 Z" fill="#ec4899" />
      <path d="M50 42 Q45 45 40 43" fill="none" stroke="#2d3748" strokeWidth="1.5" />
      <path d="M50 42 Q55 45 60 43" fill="none" stroke="#2d3748" strokeWidth="1.5" />

      {/* Whiskers */}
      <line x1="25" y1="35" x2="35" y2="33" stroke="#2d3748" strokeWidth="1" />
      <line x1="25" y1="40" x2="35" y2="38" stroke="#2d3748" strokeWidth="1" />
      <line x1="65" y1="33" x2="75" y2="35" stroke="#2d3748" strokeWidth="1" />
      <line x1="65" y1="38" x2="75" y2="40" stroke="#2d3748" strokeWidth="1" />

      {/* Tail with Van Gogh swirls */}
      <path d="M75 65 Q85 55 90 70 Q85 80 80 75" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />
    </svg>
  </div>
)

const VanGoghDog: React.FC<{ size: number; season: string; weather: string }> = ({ size }) => (
  <div className="relative animate-wag-tail" style={{ width: size, height: size }}>
    <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
      {/* Dog body */}
      <ellipse cx="60" cy="65" rx="35" ry="25" fill="#d97706" stroke="#92400e" strokeWidth="2" />

      {/* Van Gogh texture strokes */}
      <path d="M30 60 Q40 55 50 60 Q60 65 50 70" fill="none" stroke="#92400e" strokeWidth="1" />
      <path d="M70 60 Q80 55 90 60 Q100 65 90 70" fill="none" stroke="#92400e" strokeWidth="1" />
      <path d="M35 70 Q45 65 55 70 Q65 75 55 80" fill="none" stroke="#92400e" strokeWidth="1" />

      {/* Dog head */}
      <ellipse cx="60" cy="40" rx="22" ry="18" fill="#d97706" stroke="#92400e" strokeWidth="2" />

      {/* Ears */}
      <ellipse cx="45" cy="30" rx="8" ry="15" fill="#b45309" stroke="#92400e" strokeWidth="2" />
      <ellipse cx="75" cy="30" rx="8" ry="15" fill="#b45309" stroke="#92400e" strokeWidth="2" />

      {/* Eyes */}
      <circle cx="53" cy="37" r="4" fill="#1f2937" />
      <circle cx="67" cy="37" r="4" fill="#1f2937" />
      <circle cx="54" cy="36" r="1" fill="#ffffff" />
      <circle cx="68" cy="36" r="1" fill="#ffffff" />

      {/* Nose and mouth */}
      <ellipse cx="60" cy="45" rx="3" ry="2" fill="#1f2937" />
      <path d="M60 47 Q55 50 50 48" fill="none" stroke="#1f2937" strokeWidth="1.5" />
      <path d="M60 47 Q65 50 70 48" fill="none" stroke="#1f2937" strokeWidth="1.5" />

      {/* Legs */}
      <rect x="40" y="85" width="6" height="15" fill="#d97706" stroke="#92400e" strokeWidth="1" />
      <rect x="52" y="85" width="6" height="15" fill="#d97706" stroke="#92400e" strokeWidth="1" />
      <rect x="62" y="85" width="6" height="15" fill="#d97706" stroke="#92400e" strokeWidth="1" />
      <rect x="74" y="85" width="6" height="15" fill="#d97706" stroke="#92400e" strokeWidth="1" />

      {/* Tail */}
      <path
        d="M95 60 Q105 50 110 65 Q105 75 100 70"
        fill="#d97706"
        stroke="#92400e"
        strokeWidth="2"
        className="animate-wag"
      />
    </svg>
  </div>
)

const VanGoghTree: React.FC<{ size: number; season: string; weather: string }> = ({ size, season }) => {
  const getSeasonalColors = () => {
    switch (season) {
      case "spring":
        return { leaves: "#22c55e", accent: "#16a34a" }
      case "summer":
        return { leaves: "#15803d", accent: "#166534" }
      case "autumn":
        return { leaves: "#ea580c", accent: "#dc2626" }
      case "winter":
        return { leaves: "#6b7280", accent: "#4b5563" }
      default:
        return { leaves: "#22c55e", accent: "#16a34a" }
    }
  }

  const colors = getSeasonalColors()

  return (
    <div className="relative animate-sway-tree" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
        {/* Trunk with Van Gogh texture */}
        <rect x="45" y="80" width="10" height="40" fill="#92400e" stroke="#7c2d12" strokeWidth="1" />
        <path d="M45 85 Q50 82 55 85" fill="none" stroke="#7c2d12" strokeWidth="1" />
        <path d="M45 95 Q50 92 55 95" fill="none" stroke="#7c2d12" strokeWidth="1" />
        <path d="M45 105 Q50 102 55 105" fill="none" stroke="#7c2d12" strokeWidth="1" />

        {/* Van Gogh style swirling foliage */}
        <path
          d="M50 80 Q30 60 25 40 Q30 20 50 25 Q70 20 75 40 Q70 60 50 80"
          fill={colors.leaves}
          stroke={colors.accent}
          strokeWidth="2"
        />

        {/* Swirling texture patterns */}
        <path
          d="M35 45 Q40 40 45 45 Q50 50 45 55 Q40 60 35 55 Q30 50 35 45"
          fill="none"
          stroke={colors.accent}
          strokeWidth="1"
        />
        <path
          d="M55 35 Q60 30 65 35 Q70 40 65 45 Q60 50 55 45 Q50 40 55 35"
          fill="none"
          stroke={colors.accent}
          strokeWidth="1"
        />
        <path
          d="M40 60 Q45 55 50 60 Q55 65 50 70 Q45 75 40 70 Q35 65 40 60"
          fill="none"
          stroke={colors.accent}
          strokeWidth="1"
        />

        {/* Additional seasonal elements */}
        {season === "autumn" && (
          <>
            <circle cx="35" cy="85" r="2" fill="#ea580c" className="animate-fall-leaf" />
            <circle
              cx="65"
              cy="90"
              r="1.5"
              fill="#dc2626"
              className="animate-fall-leaf"
              style={{ animationDelay: "1s" }}
            />
          </>
        )}

        {season === "spring" && (
          <>
            <circle cx="40" cy="35" r="3" fill="#fbbf24" />
            <circle cx="60" cy="45" r="2.5" fill="#f59e0b" />
            <circle cx="45" cy="55" r="2" fill="#fbbf24" />
          </>
        )}
      </svg>
    </div>
  )
}

const VanGoghSunflowers: React.FC<{ size: number; season: string; weather: string }> = ({ size, season }) => (
  <div className="relative animate-sway-gentle" style={{ width: size, height: size }}>
    <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
      {/* Stems */}
      <line x1="30" y1="90" x2="30" y2="60" stroke="#16a34a" strokeWidth="3" />
      <line x1="60" y1="95" x2="60" y2="50" stroke="#16a34a" strokeWidth="3" />
      <line x1="90" y1="90" x2="90" y2="65" stroke="#16a34a" strokeWidth="3" />

      {/* Van Gogh style sunflower heads */}
      <g transform="translate(30,60)">
        <circle r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <circle r="4" fill="#92400e" />
        {/* Petals with Van Gogh brush strokes */}
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M0,0 Q${12 * Math.cos((i * Math.PI) / 4)},${12 * Math.sin((i * Math.PI) / 4)} ${15 * Math.cos((i * Math.PI) / 4)},${15 * Math.sin((i * Math.PI) / 4)}`}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>

      <g transform="translate(60,50)">
        <circle r="15" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <circle r="5" fill="#92400e" />
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M0,0 Q${15 * Math.cos((i * Math.PI) / 4)},${15 * Math.sin((i * Math.PI) / 4)} ${18 * Math.cos((i * Math.PI) / 4)},${18 * Math.sin((i * Math.PI) / 4)}`}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>

      <g transform="translate(90,65)">
        <circle r="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <circle r="3" fill="#92400e" />
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M0,0 Q${10 * Math.cos((i * Math.PI) / 4)},${10 * Math.sin((i * Math.PI) / 4)} ${13 * Math.cos((i * Math.PI) / 4)},${13 * Math.sin((i * Math.PI) / 4)}`}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>

      {/* Leaves */}
      <ellipse cx="25" cy="75" rx="8" ry="4" fill="#16a34a" transform="rotate(-30 25 75)" />
      <ellipse cx="65" cy="70" rx="6" ry="3" fill="#16a34a" transform="rotate(45 65 70)" />
    </svg>
  </div>
)

const VanGoghHouse: React.FC<{ size: number; season: string; weather: string }> = ({ size, season }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      {/* House base */}
      <rect x="20" y="50" width="60" height="40" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />

      {/* Van Gogh style brush stroke texture */}
      <path d="M25 55 Q35 52 45 55 Q55 58 45 62" fill="none" stroke="#f59e0b" strokeWidth="1" />
      <path d="M55 60 Q65 57 75 60 Q85 63 75 67" fill="none" stroke="#f59e0b" strokeWidth="1" />
      <path d="M25 70 Q35 67 45 70 Q55 73 45 77" fill="none" stroke="#f59e0b" strokeWidth="1" />
      <path d="M55 75 Q65 72 75 75 Q85 78 75 82" fill="none" stroke="#f59e0b" strokeWidth="1" />

      {/* Roof with Van Gogh swirls */}
      <path d="M15 50 L50 25 L85 50 Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
      <path d="M25 45 Q35 40 45 45" fill="none" stroke="#b91c1c" strokeWidth="1" />
      <path d="M55 45 Q65 40 75 45" fill="none" stroke="#b91c1c" strokeWidth="1" />

      {/* Door */}
      <rect x="42" y="65" width="16" height="25" fill="#92400e" stroke="#7c2d12" strokeWidth="1" />
      <circle cx="54" cy="77" r="1" fill="#fbbf24" />

      {/* Windows */}
      <rect x="28" y="58" width="10" height="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
      <rect x="62" y="58" width="10" height="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
      <line x1="33" y1="58" x2="33" y2="66" stroke="#1d4ed8" strokeWidth="0.5" />
      <line x1="28" y1="62" x2="38" y2="62" stroke="#1d4ed8" strokeWidth="0.5" />
      <line x1="67" y1="58" x2="67" y2="66" stroke="#1d4ed8" strokeWidth="0.5" />
      <line x1="62" y1="62" x2="72" y2="62" stroke="#1d4ed8" strokeWidth="0.5" />

      {/* Chimney */}
      <rect x="65" y="30" width="8" height="20" fill="#7c2d12" stroke="#92400e" strokeWidth="1" />

      {/* Smoke with Van Gogh swirls */}
      <path
        d="M69 30 Q72 25 69 20 Q66 15 69 10"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        className="animate-smoke"
      />
    </svg>
  </div>
)

export default function IslandPage() {
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day")
  const [season, setSeason] = useState<Season>("spring")
  const [weather, setWeather] = useState<WeatherEffect>({ type: "sunny", intensity: 0.8 })
  const [selectedItem, setSelectedItem] = useState<IslandItem | null>(null)
  const [isPlacingMode, setIsPlacingMode] = useState(false)
  const [draggedItem, setDraggedItem] = useState<IslandItem | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [islandExpansion, setIslandExpansion] = useState(1) // 1 = basic, 2 = expanded, 3 = large
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const islandRef = useRef<HTMLDivElement>(null)

  // Island items that user owns
  const [islandItems, setIslandItems] = useState<IslandItem[]>([
    {
      id: "cat-1",
      type: "animal",
      name: "Van Gogh Cat",
      component: VanGoghCat,
      x: 25,
      y: 65,
      width: 40,
      height: 40,
      zIndex: 10,
      owned: true,
    },
    {
      id: "dog-1",
      type: "animal",
      name: "Artistic Dog",
      component: VanGoghDog,
      x: 70,
      y: 45,
      width: 45,
      height: 45,
      zIndex: 10,
      owned: true,
    },
    {
      id: "sunflowers-1",
      type: "decoration",
      name: "Sunflower Field",
      component: VanGoghSunflowers,
      x: 40,
      y: 75,
      width: 60,
      height: 30,
      zIndex: 5,
      owned: true,
    },
    {
      id: "tree-1",
      type: "decoration",
      name: "Cypress Tree",
      component: VanGoghTree,
      x: 80,
      y: 25,
      width: 50,
      height: 70,
      zIndex: 15,
      owned: true,
    },
    {
      id: "house-1",
      type: "building",
      name: "Artist Studio",
      component: VanGoghHouse,
      x: 15,
      y: 35,
      width: 60,
      height: 50,
      zIndex: 20,
      owned: true,
    },
  ])

  // Available items to place
  const availableItems: IslandItem[] = [
    {
      id: "tree-new",
      type: "decoration",
      name: "New Cypress Tree",
      component: VanGoghTree,
      x: 0,
      y: 0,
      width: 50,
      height: 70,
      zIndex: 15,
      owned: false,
    },
    {
      id: "sunflowers-new",
      type: "decoration",
      name: "New Sunflower Field",
      component: VanGoghSunflowers,
      x: 0,
      y: 0,
      width: 60,
      height: 30,
      zIndex: 5,
      owned: false,
    },
  ]

  // Get seasonal colors for the island
  const getSeasonalIslandColors = () => {
    switch (season) {
      case "spring":
        return {
          primary: timeOfDay === "day" ? "#22c55e" : "#166534",
          secondary: timeOfDay === "day" ? "#16a34a" : "#14532d",
          water: timeOfDay === "day" ? "#0ea5e9" : "#1e40af",
          beach: timeOfDay === "day" ? "#fbbf24" : "#92400e",
        }
      case "summer":
        return {
          primary: timeOfDay === "day" ? "#15803d" : "#14532d",
          secondary: timeOfDay === "day" ? "#166534" : "#052e16",
          water: timeOfDay === "day" ? "#0284c7" : "#1e3a8a",
          beach: timeOfDay === "day" ? "#f59e0b" : "#78350f",
        }
      case "autumn":
        return {
          primary: timeOfDay === "day" ? "#ea580c" : "#9a3412",
          secondary: timeOfDay === "day" ? "#dc2626" : "#7f1d1d",
          water: timeOfDay === "day" ? "#0369a1" : "#1e3a8a",
          beach: timeOfDay === "day" ? "#d97706" : "#92400e",
        }
      case "winter":
        return {
          primary: timeOfDay === "day" ? "#6b7280" : "#374151",
          secondary: timeOfDay === "day" ? "#4b5563" : "#1f2937",
          water: timeOfDay === "day" ? "#1e40af" : "#1e3a8a",
          beach: timeOfDay === "day" ? "#9ca3af" : "#4b5563",
        }
      default:
        return {
          primary: timeOfDay === "day" ? "#22c55e" : "#166534",
          secondary: timeOfDay === "day" ? "#16a34a" : "#14532d",
          water: timeOfDay === "day" ? "#0ea5e9" : "#1e40af",
          beach: timeOfDay === "day" ? "#fbbf24" : "#92400e",
        }
    }
  }

  const colors = getSeasonalIslandColors()

  // Handle mouse movement for drag and drop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (islandRef.current) {
        const rect = islandRef.current.getBoundingClientRect()
        const newX = ((e.clientX - rect.left) / rect.width) * 100
        const newY = ((e.clientY - rect.top) / rect.height) * 100
        
        setMousePosition({ x: newX, y: newY })

        // Handle dragging existing items
        if (isDragging && selectedItem) {
          const adjustedX = Math.max(0, Math.min(95, newX - dragOffset.x))
          const adjustedY = Math.max(15, Math.min(85, newY - dragOffset.y))
          
          setIslandItems(prev => 
            prev.map(item => 
              item.id === selectedItem.id 
                ? { ...item, x: adjustedX, y: adjustedY, isDragging: true }
                : item
            )
          )
        }
      }
    }

    const handleMouseUp = () => {
      if (isDragging && selectedItem) {
        setIslandItems(prev => 
          prev.map(item => 
            item.id === selectedItem.id 
              ? { ...item, isDragging: false }
              : item
          )
        )
        setIsDragging(false)
        setSelectedItem(null)
      }
    }

    if (draggedItem || isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedItem, isDragging, selectedItem, dragOffset])

  // Handle item click for selection and dragging
  const handleItemMouseDown = (item: IslandItem, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (islandRef.current) {
      const rect = islandRef.current.getBoundingClientRect()
      const clickX = ((e.clientX - rect.left) / rect.width) * 100
      const clickY = ((e.clientY - rect.top) / rect.height) * 100
      
      setSelectedItem(item)
      setIsDragging(true)
      setDragOffset({
        x: clickX - item.x,
        y: clickY - item.y
      })
    }
  }

  // Handle island click for placement
  const handleIslandClick = (e: React.MouseEvent) => {
    if (!draggedItem) {
      setSelectedItem(null)
      return
    }

    const rect = islandRef.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (isValidPlacement(x, y)) {
      const newItem = {
        ...draggedItem,
        x: Math.max(0, Math.min(95, x - draggedItem.width / 4)),
        y: Math.max(15, Math.min(85, y - draggedItem.height / 4)),
        id: `${draggedItem.type}-${Date.now()}`,
        owned: true,
      }

      setIslandItems((prev) => [...prev, newItem])
      setDraggedItem(null)
      setIsPlacingMode(false)
    }
  }

  // Check if placement position is valid based on island expansion
  const isValidPlacement = (x: number, y: number): boolean => {
    const centerX = 50
    const centerY = 50
    const baseRadiusX = 35 + (islandExpansion - 1) * 10
    const baseRadiusY = 25 + (islandExpansion - 1) * 8

    const normalizedX = (x - centerX) / baseRadiusX
    const normalizedY = (y - centerY) / baseRadiusY

    return normalizedX * normalizedX + normalizedY * normalizedY <= 1
  }

  // Start dragging a new item
  const startDragging = (item: IslandItem) => {
    setDraggedItem(item)
    setIsPlacingMode(true)
  }

  // Remove item from island
  const removeItem = (itemId: string) => {
    setIslandItems((prev) => prev.filter((item) => item.id !== itemId))
    setSelectedItem(null)
  }

  const toggleTimeOfDay = () => {
    setTimeOfDay(timeOfDay === "day" ? "night" : "day")
  }

  const expandIsland = () => {
    if (islandExpansion < 3) {
      setIslandExpansion(prev => prev + 1)
    }
  }

  // Weather particles component
  const WeatherParticles = () => {
    if (weather.type === "rainy") {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-4 bg-blue-400 opacity-60 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )
    }

    if (weather.type === "snowy") {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-80 animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        timeOfDay === "day"
          ? "bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500"
          : "bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900"
      } p-4 relative overflow-hidden`}
    >
      {/* Weather Effects */}
      <WeatherParticles />

      {/* Van Gogh style animated clouds */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-60 animate-float-cloud ${
              timeOfDay === "day" ? "bg-white" : "bg-gray-700"
            }`}
            style={{
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              top: `${10 + i * 15}%`,
              left: `${i * 25}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Select value={season} onValueChange={(value: Season) => setSeason(value)}>
              <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring">
                  <div className="flex items-center gap-2">
                    <Flower2 className="w-4 h-4" />
                    Spring
                  </div>
                </SelectItem>
                <SelectItem value="summer">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Summer
                  </div>
                </SelectItem>
                <SelectItem value="autumn">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    Autumn
                  </div>
                </SelectItem>
                <SelectItem value="winter">
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-4 h-4" />
                    Winter
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={weather.type} onValueChange={(value: any) => setWeather({ type: value, intensity: 0.8 })}>
              <SelectTrigger className="w-32 bg-white/20 backdrop-blur-sm border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunny">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Sunny
                  </div>
                </SelectItem>
                <SelectItem value="rainy">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4" />
                    Rainy
                  </div>
                </SelectItem>
                <SelectItem value="snowy">
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-4 h-4" />
                    Snowy
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={toggleTimeOfDay}
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/30"
            >
              {timeOfDay === "day" ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
              {timeOfDay === "day" ? "Night" : "Day"}
            </Button>

            <Button
              onClick={expandIsland}
              disabled={islandExpansion >= 3}
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/30"
            >
              <Expand className="w-4 h-4 mr-2" />
              Expand ({islandExpansion}/3)
            </Button>

            <Badge className="bg-yellow-600 text-white px-4 py-2">Van Gogh Island</Badge>
          </div>
        </div>

        {/* Main Island Container */}
        <div className="relative">
          {/* Island View */}
          <div
            ref={islandRef}
            className="relative w-full h-[600px] mx-auto cursor-crosshair"
            onClick={handleIslandClick}
            style={{
              background: `radial-gradient(ellipse ${70 + islandExpansion * 10}% ${50 + islandExpansion * 8}% at 50% 50%, 
                ${colors.primary} 0%, 
                ${colors.secondary} 40%, 
                ${colors.water} 70%, 
                ${colors.water} 100%)`,
              borderRadius: "50%",
              transform: "perspective(800px) rotateX(20deg)",
              boxShadow: `0 20px 40px ${timeOfDay === "day" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.6)"}`,
            }}
          >
            {/* Van Gogh style water animation */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 animate-wave-vangogh opacity-30"
                style={{
                  background: `radial-gradient(ellipse ${75 + islandExpansion * 10}% ${55 + islandExpansion * 8}% at 50% 50%, transparent 60%, ${colors.water} 70%)`,
                }}
              />
            </div>

            {/* Van Gogh style sun/moon */}
            <div
              className={`absolute top-8 right-12 w-16 h-16 rounded-full transition-all duration-1000 ${
                timeOfDay === "day"
                  ? "bg-gradient-radial from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-400/50"
                  : "bg-gradient-radial from-gray-100 to-gray-300 shadow-lg shadow-gray-200/30"
              } animate-pulse-slow`}
            >
              {/* Van Gogh style brush strokes on sun/moon */}
              <div className="absolute inset-2 rounded-full">
                {timeOfDay === "day" ? (
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <path d="M10 20 Q15 15 20 20 Q25 25 20 30 Q15 35 10 30 Q5 25 10 20" fill="none" stroke="#f59e0b" strokeWidth="1" />
                    <path d="M30 10 Q35 15 30 20 Q25 25 30 30 Q35 35 30 40" fill="none" stroke="#f59e0b" strokeWidth="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle cx="12" cy="8" r="2" fill="#9ca3af" />
                    <circle cx="28" cy="15" r="1.5" fill="#9ca3af" />
                    <circle cx="18" cy="25" r="3" fill="#9ca3af" />
                  </svg>
                )}
              </div>
            </div>

            {/* Stars for night mode with Van Gogh swirls */}
            {timeOfDay === "night" && (
              <>
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-twinkle-vangogh"
                    style={{
                      top: `${10 + Math.random() * 40}%`,
                      left: `${10 + Math.random() * 80}%`,
                      animationDelay: `${Math.random() * 3}s`,
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <path d="M4 0 Q6 2 4 4 Q2 6 4 8 Q6 6 8 4 Q6 2 4 0" fill="white" />
                    </svg>
                  </div>
                ))}
              </>
            )}

            {/* Beach/Sand Ring with Van Gogh texture */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(ellipse ${65 + islandExpansion * 10}% ${45 + islandExpansion * 8}% at 50% 50%, transparent 50%, ${colors.beach} 55%, transparent 65%)`,
                opacity: 0.6,
              }}
            />

            {/* User's Island Items */}
            {islandItems
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((item) => {
                const ItemComponent = item.component
                return (
                  <div
                    key={item.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move transition-all duration-200 ${
                      selectedItem?.id === item.id ? "ring-4 ring-yellow-400 ring-opacity-75 scale-110 z-50" : "hover:scale-105"
                    } ${item.isDragging ? "z-50" : ""}`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      zIndex: selectedItem?.id === item.id ? 100 : item.zIndex,
                    }}
                    onMouseDown={(e) => handleItemMouseDown(item, e)}
                    title={item.name}
                  >
                    <ItemComponent 
                      size={Math.max(item.width, item.height)} 
                      season={season} 
                      weather={weather.type} 
                    />
                    {selectedItem?.id === item.id && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap border border-yellow-400/50">
                        {item.name} - Drag to move
                      </div>
                    )}
                  </div>
                )
              })}

            {/* Dragged Item Preview */}
            {draggedItem && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70 animate-bounce z-50"
                style={{
                  left: `${mousePosition.x}%`,
                  top: `${mousePosition.y}%`,
                }}
              >
                <draggedItem.component 
                  size={Math.max(draggedItem.width, draggedItem.height)} 
                  season={season} 
                  weather={weather.type} 
                />
              </div>
            )}

            {/* Placement Guide */}
            {isPlacingMode && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0 rounded-full border-4 border-dashed border-yellow-400 opacity-50 animate-pulse"
                  style={{
                    background: `radial-gradient(ellipse ${70 + islandExpansion * 10}% ${50 + islandExpansion * 8}% at 50% 50%, transparent 60%, rgba(34, 197, 94, 0.1) 70%)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Item Controls */}
          {selectedItem && !isDragging && (
            <Card className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border-yellow-400/50 z-50">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-2">{selectedItem.name}</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeItem(selectedItem.id)}
                    className="bg-red-600/20 border-red-400 text-red-400 hover:bg-red-600/40"
                  >
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    className="bg-gray-600/20 border-gray-400 text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Available Items to Place */}
        {availableItems.length > 0 && (
          <Card className="mt-8 bg-black/40 backdrop-blur-sm border-white/30">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Van Gogh Decorations
              </h3>
              <div className="flex gap-4">
                {availableItems.map((item) => {
                  const ItemComponent = item.component
                  return (
                    <div
                      key={item.id}
                      className="bg-black/20 rounded-lg p-4 text-center cursor-pointer hover:bg-black/40 transition-all duration-200 border border-white/20 hover:border-yellow-400/50"
                      onClick={() => startDragging(item)}
                    >
                      <div className="mb-2">
                        <ItemComponent size={60} season={season} weather={weather.type} />
                      </div>
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Click to place
                      </Badge>
                    </div>
                  )
                })}
              </div>
              {isPlacingMode && (
                <div className="mt-4 text-center">
                  <p className="text-yellow-400 text-sm mb-2">Click on the island to place your Van Gogh decoration!</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDraggedItem(null)
                      setIsPlacingMode(false)
                    }}
                    className="bg-gray-600/20 border-gray-400 text-gray-400"
                  >
                    Cancel Placement
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Island Stats */}
          <div className="grid md:grid-cols-5 gap-4 mt-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/30">
              <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="text-white font-semibold text-sm">Animals</h3>
              <p className="text-xl font-bold text-yellow-400">
                {islandItems.filter((item) => item.type === "animal").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🌸</div>
              <h3 className="text-white font-semibold text-sm">Decorations</h3>
              <p className="text-xl font-bold text-green-400">
                {islandItems.filter((item) => item.type === "decoration").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="text-white font-semibold text-sm">Buildings</h3>
              <p className="text-xl font-bold text-blue-400">
                {islandItems.filter((item) => item.type === "building").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏝️</div>
              <h3 className="text-white font-semibold text-sm">Island Size</h3>
              <p className="text-xl font-bold text-purple-400">Level {islandExpansion}</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="text-white font-semibold text-sm">Art Score</h3>
              <p className="text-xl font-bold text-orange-400">{islandItems.length * 10 + islandExpansion * 50}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
