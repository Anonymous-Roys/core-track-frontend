"use client"

import { useEffect, useRef, useState } from "react"

interface CoreSection {
  id: string
  depth_from: number
  depth_to: number
  lithology: string
  imageUrl: string
}

interface CoreImageSidebarProps {
  coreSections: CoreSection[]
}

export function CoreImageSidebar({ coreSections }: CoreImageSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [totalHeight, setTotalHeight] = useState(0)

  useEffect(() => {
    if (sidebarRef.current) {
      setTotalHeight(sidebarRef.current.scrollHeight)
    }
  }, [coreSections])

  // Calculate the maximum depth for ruler scaling
  const maxDepth = coreSections.length > 0 ? Math.max(...coreSections.map((section) => section.depth_to)) : 100

  // Generate ruler markings based on max depth
  const generateRulerMarkings = () => {
    const markings = []
    const interval = maxDepth > 100 ? 10 : 5 // Use 10m intervals for deep holes, 5m for shallow

    for (let depth = 0; depth <= maxDepth; depth += interval) {
      markings.push(depth)
    }

    return markings
  }

  const rulerMarkings = generateRulerMarkings()

  // Abbreviate long lithology names
  const abbreviateLithology = (litho: string): string => {
    if (litho.length <= 12) return litho

    const abbreviations: { [key: string]: string } = {
      Conglomerate: "Conglom.",
      Sandstone: "Sndst.",
      Mudstone: "Mdst.",
      Limestone: "Lmst.",
      Granite: "Grnt.",
      Basalt: "Bslt.",
      Dolerite: "Dolr.",
      Rhyolite: "Rhyl.",
      Andesite: "Anst.",
      Gabbro: "Gbbr.",
      Diorite: "Dior.",
      Quartzite: "Qtzite",
      Schist: "Schst.",
      Gneiss: "Gnss.",
      Phyllite: "Phyl.",
      Slate: "Slt.",
    }

    return abbreviations[litho] || litho.substring(0, 10) + "."
  }

  return (
    <div className="flex h-full bg-gray-50 border-r border-gray-300">
      <div className="relative w-12 sm:w-16 bg-gray-100 border-r border-gray-300 flex-shrink-0">
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {rulerMarkings.map((depth, index) => (
            <div key={depth} className="relative flex items-center">
              {/* Major tick mark */}
              <div className="absolute right-0 w-2 sm:w-3 h-px bg-gray-700"></div>
              <span className="absolute right-3 sm:right-4 text-[10px] sm:text-xs font-medium text-gray-700 -translate-y-1/2">
                {depth}m
              </span>

              {/* Minor tick marks between major marks */}
              {index < rulerMarkings.length - 1 && (
                <>
                  <div className="absolute right-0 top-1/4 w-1 sm:w-2 h-px bg-gray-500"></div>
                  <div className="absolute right-0 top-1/2 w-1 sm:w-2 h-px bg-gray-500"></div>
                  <div className="absolute right-0 top-3/4 w-1 sm:w-2 h-px bg-gray-500"></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Core Sections */}
      <div ref={sidebarRef} className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {coreSections.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-xs sm:text-sm px-2 sm:px-4 text-center">
              No core images available. Add logging data to see core sections.
            </div>
          ) : (
            coreSections.map((section) => {
              const intervalHeight = (section.depth_to - section.depth_from) * 40 // 40px per meter
              const minHeight = 80 // Minimum height for readability
              const sectionHeight = Math.max(intervalHeight, minHeight)

              return (
                <div
                  key={section.id}
                  className="border-b border-gray-300 bg-white flex flex-col"
                  style={{ minHeight: `${sectionHeight}px` }}
                >
                  <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 border-b border-gray-200">
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                      {section.depth_from.toFixed(1)} - {section.depth_to.toFixed(1)}m
                    </span>
                  </div>

                  {/* Core Image and Lithology */}
                  <div className="flex-1 flex items-center justify-center p-1 sm:p-2 relative">
                    {/* Core Image */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded border border-gray-200 overflow-hidden">
                      <img
                        src={section.imageUrl || "/placeholder.svg"}
                        alt={`Core ${section.depth_from}-${section.depth_to}m`}
                        className="w-full h-full object-cover"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 bg-gray-900/80 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      <p className="text-[10px] sm:text-xs font-medium text-white text-center truncate">
                        {abbreviateLithology(section.lithology || "Unknown")}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
