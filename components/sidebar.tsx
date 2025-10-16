"use client"

import { Layers, FlaskConical, Ruler, ImageIcon, Mountain, Gem, Palette, Box, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  { label: "Lithology", icon: Layers },
  { label: "Alteration", icon: FlaskConical },
  { label: "Structure", icon: Ruler },
  { label: "Samples", icon: FlaskConical },
  { label: "Photos", icon: ImageIcon },
  { label: "Depth Strat", icon: Mountain },
  { label: "Depth Vein", icon: Gem },
  { label: "Depth Mineral", icon: Gem },
  { label: "Depth Alteration", icon: Palette },
  { label: "Depth Conglomerate", icon: Box },
]

export function Sidebar({ activeSection, onSectionChange, isOpen = true, onClose }: SidebarProps) {
  const handleSectionClick = (section: string) => {
    onSectionChange(section)
    if (onClose && window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {isOpen && onClose && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-64 md:w-56 lg:w-52 xl:w-56 bg-gray-900 text-gray-200 p-3 border-r-2 border-gray-700 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {onClose && (
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-100">Sections</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => handleSectionClick(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                  activeSection === item.label ? "bg-emerald-500 text-white" : "hover:bg-gray-800 text-gray-300",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
