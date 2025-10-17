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
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [pixelsPerMeter, setPixelsPerMeter] = useState<number>(40)
  const [totalHeight, setTotalHeight] = useState(0)

  useEffect(() => {
    if (scrollAreaRef.current) {
      setTotalHeight(scrollAreaRef.current.scrollHeight)
    }
  }, [coreSections, pixelsPerMeter])

  // Calculate the maximum depth for ruler scaling
  const maxDepth = coreSections.length > 0 ? Math.max(...coreSections.map((section) => section.depth_to)) : 100

  // Generate ruler markings based on max depth
  const generateRulerMarkings = () => {
    const markings: number[] = []
    const intervalMeters = maxDepth > 100 ? 10 : 5
    for (let depth = 0; depth <= maxDepth; depth += intervalMeters) {
      markings.push(depth)
    }
    return { markings, intervalMeters }
  }

  const { markings: rulerMarkings, intervalMeters } = generateRulerMarkings()

  const zoomIn = () => setPixelsPerMeter((v) => Math.min(160, Math.round(v * 1.25)))
  const zoomOut = () => setPixelsPerMeter((v) => Math.max(10, Math.round(v / 1.25)))
  const resetZoom = () => setPixelsPerMeter(40)

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Ctrl+wheel zooms, normal wheel scrolls
    if (e.ctrlKey) {
      e.preventDefault()
      if (e.deltaY < 0) zoomIn()
      if (e.deltaY > 0) zoomOut()
    }
  }

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
    <div className="relative flex h-full bg-gray-50 border-r border-gray-300">
      {/* Zoom controls */}
      <div className="absolute z-10 right-2 top-2 bg-white/90 border border-gray-200 rounded shadow-sm flex items-center gap-1 p-1">
        <button onClick={zoomOut} className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200">-</button>
        <span className="px-2 text-[10px] text-gray-600">{pixelsPerMeter}px/m</span>
        <button onClick={zoomIn} className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200">+</button>
        <button onClick={resetZoom} className="ml-1 px-2 py-1 text-[10px] bg-gray-100 rounded border border-gray-200">Reset</button>
      </div>

      {/* Shared scroll container so ruler moves with images */}
      <div ref={scrollAreaRef} onWheel={handleWheel} className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Ruler */}
          <div className="w-12 sm:w-16 bg-gray-100 border-r border-gray-300 flex-shrink-0">
            <div className="py-4">
              {rulerMarkings.map((depth, index) => {
                const blockHeight = intervalMeters * pixelsPerMeter
                const isLast = index === rulerMarkings.length - 1
                return (
                  <div key={depth} className="relative" style={{ height: `${blockHeight}px` }}>
                    <div className="absolute right-0 top-0 w-2 sm:w-3 h-px bg-gray-700"></div>
                    <span className="absolute right-3 sm:right-4 top-0 -translate-y-1/2 text-[10px] sm:text-xs font-medium text-gray-700">{depth}m</span>
                    {!isLast && (
                      <>
                        <div className="absolute right-0" style={{ top: `${blockHeight * 0.25}px` }}>
                          <div className="w-1 sm:w-2 h-px bg-gray-500"></div>
                        </div>
                        <div className="absolute right-0" style={{ top: `${blockHeight * 0.5}px` }}>
                          <div className="w-1 sm:w-2 h-px bg-gray-500"></div>
                        </div>
                        <div className="absolute right-0" style={{ top: `${blockHeight * 0.75}px` }}>
                          <div className="w-1 sm:w-2 h-px bg-gray-500"></div>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Core sections */}
          <div className="flex-1">
            <div className="flex flex-col">
              {coreSections.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500 text-xs sm:text-sm px-2 sm:px-4 text-center">
                  No core images available. Add logging data to see core sections.
                </div>
              ) : (
                coreSections.map((section) => {
                  const intervalHeight = (section.depth_to - section.depth_from) * pixelsPerMeter
                  const minHeight = 80
                  const sectionHeight = Math.max(intervalHeight, minHeight)
                  const imageScale = pixelsPerMeter / 40

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

                      <div className="flex-1 flex items-center justify-center p-1 sm:p-2 relative">
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded border border-gray-200 overflow-hidden">
                          <div className="w-full h-full" style={{ transform: `scale(${imageScale})`, transformOrigin: "top center", willChange: "transform" }}>
                            <img
                              src={section.imageUrl || "/placeholder.svg"}
                              alt={`Core ${section.depth_from}-${section.depth_to}m`}
                              className="w-full h-full object-cover"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
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
      </div>
    </div>
  )
}
