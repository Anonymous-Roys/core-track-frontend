"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, FileText, Menu, Bell, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface HeaderProps {
  projectId: string
  holeId: string
  onProjectIdChange: (value: string) => void
  onHoleIdChange: (value: string) => void
  showHoleId?: boolean
  isDashboard?: boolean
  onMenuClick?: () => void
}

export function Header({
  projectId,
  holeId,
  onProjectIdChange,
  onHoleIdChange,
  showHoleId = true,
  isDashboard = false,
  onMenuClick,
}: HeaderProps) {
  const [newHoleId, setNewHoleId] = useState("")

  const handleAddHoleId = () => {
    if (!newHoleId.trim() || !projectId) return
    onHoleIdChange(newHoleId.trim())
    setNewHoleId("")
  }

  const handleNewHoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddHoleId()
    }
  }
  return (
    <header className="flex items-center justify-between bg-gray-800 px-3 sm:px-5 py-3 border-b-2 border-gray-600">
      <div className="flex items-center gap-2 sm:gap-6">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-gray-300 hover:text-gray-100 hover:bg-gray-700 p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Core Track Logo" width={28} height={28} className="object-contain" />
          <h1 className="text-gray-100 text-lg sm:text-2xl font-bold">CoreTrack</h1>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant={isDashboard ? "secondary" : "ghost"}
              size="sm"
              className={
                isDashboard ? "bg-gray-700 text-gray-100" : "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
              }
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant={!isDashboard ? "secondary" : "ghost"}
              size="sm"
              className={
                !isDashboard ? "bg-gray-700 text-gray-100" : "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Logging
            </Button>
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Label htmlFor="project-id" className="text-gray-100 text-sm hidden lg:block">
            Project ID
          </Label>
          <Select value={projectId} onValueChange={onProjectIdChange}>
            <SelectTrigger id="project-id" className="w-32 lg:w-56 bg-gray-100 border-gray-400">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROJ-001">PROJ-001</SelectItem>
              <SelectItem value="PROJ-002">PROJ-002</SelectItem>
              <SelectItem value="PROJ-003">PROJ-003</SelectItem>
              <SelectItem value="PROJ-004">PROJ-004</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showHoleId && (
          <div className="hidden sm:flex items-center gap-2">
            <Label htmlFor="hole-id" className="text-gray-100 text-sm hidden lg:block">
              Hole ID
            </Label>
            <Select value={holeId} onValueChange={onHoleIdChange} disabled={!projectId}>
              <SelectTrigger id="hole-id" className="w-32 lg:w-56 bg-gray-100 border-gray-400 disabled:opacity-50">
                <SelectValue placeholder="Select Hole" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DH-001">DH-001</SelectItem>
                <SelectItem value="DH-002">DH-002</SelectItem>
                <SelectItem value="DH-003">DH-003</SelectItem>
                <SelectItem value="DH-004">DH-004</SelectItem>
                <SelectItem value="DH-005">DH-005</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden md:flex items-center gap-2">
              <Input
                id="new-hole-id"
                value={newHoleId}
                onChange={(e) => setNewHoleId(e.target.value)}
                onKeyDown={handleNewHoleKeyDown}
                placeholder="Add Hole ID"
                className="w-28 lg:w-40 h-9 bg-gray-100 border-gray-400"
                disabled={!projectId}
              />
              <Button
                variant="secondary"
                size="sm"
                className="h-9"
                onClick={handleAddHoleId}
                disabled={!projectId || !newHoleId.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-gray-100 hover:bg-gray-700 p-2">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-gray-100 hover:bg-gray-700 p-2">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
