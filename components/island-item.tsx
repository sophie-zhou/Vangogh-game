"use client"

import type React from "react"

import { useState } from "react"

interface IslandItemProps {
  id: string
  sprite: string
  name: string
  x: number
  y: number
  size: number
  animation?: string
  isSelected?: boolean
  onClick?: () => void
  onMove?: (x: number, y: number) => void
}

export function IslandItem({ id, sprite, name, x, y, size, animation, isSelected, onClick, onMove }: IslandItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMove) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - x, y: e.clientY - y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && onMove) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      onMove(newX, newY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
        isSelected ? "ring-4 ring-yellow-400 ring-opacity-75 scale-110 selected-item" : ""
      } ${animation ? `animate-${animation}` : ""} island-item`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}px`,
        zIndex: isSelected ? 100 : 10,
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      title={name}
    >
      <span className="drop-shadow-lg select-none">{sprite}</span>
      {isSelected && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap border border-yellow-400/50">
          {name}
        </div>
      )}
    </div>
  )
}
