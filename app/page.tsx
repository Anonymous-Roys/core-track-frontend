"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { LoggingTable } from "@/components/logging-table"
import { CoreImageSidebar } from "@/components/core-image-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Camera, ChevronDown, ChevronUp } from "lucide-react"

export default function DrillHoleLogger() {
  const searchParams = useSearchParams()
  const [projectId, setProjectId] = useState("")
  const [holeId, setHoleId] = useState("")
  const [activeSection, setActiveSection] = useState("Lithology")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [corePanelOpen, setCorePanelOpen] = useState(false)
  const { toast } = useToast()

  const mockCoreSections = [
    {
      id: "1",
      depth_from: 0,
      depth_to: 2.5,
      lithology: "Granite",
      imageUrl: "/granite-core-sample.jpg",
    },
    {
      id: "2",
      depth_from: 2.5,
      depth_to: 5.8,
      lithology: "Sandstone",
      imageUrl: "/sandstone-core-sample.jpg",
    },
    {
      id: "3",
      depth_from: 5.8,
      depth_to: 9.2,
      lithology: "Conglomerate",
      imageUrl: "/conglomerate-core-sample.jpg",
    },
    {
      id: "4",
      depth_from: 9.2,
      depth_to: 12.0,
      lithology: "Mudstone",
      imageUrl: "/mudstone-core-sample.jpg",
    },
    {
      id: "5",
      depth_from: 12.0,
      depth_to: 15.5,
      lithology: "Basalt",
      imageUrl: "/basalt-core-sample.jpg",
    },
  ]

  useEffect(() => {
    const holeIdFromUrl = searchParams.get("holeId")
    if (holeIdFromUrl) {
      setHoleId(holeIdFromUrl)
      if (!projectId) {
        setProjectId("PROJ-001")
      }
      toast({
        title: "Hole data loaded",
        description: `Loading data for hole ${holeIdFromUrl}`,
      })
    }
  }, [searchParams])

  const handleProjectIdChange = (value: string) => {
    setProjectId(value)
    setHoleId("")
    if (value) {
      toast({
        title: "Project loaded",
        description: `Fetching holes for project ${value}`,
      })
    }
  }

  const handleHoleIdChange = (value: string) => {
    setHoleId(value)
    if (value) {
      toast({
        title: "Hole data loaded",
        description: `Loading data for hole ${value}`,
      })
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        projectId={projectId}
        holeId={holeId}
        onProjectIdChange={handleProjectIdChange}
        onHoleIdChange={handleHoleIdChange}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="sm:hidden bg-gray-800 px-3 py-2 border-b border-gray-700 space-y-2">
        <div className="text-xs text-gray-400">Project: {projectId || "Not selected"}</div>
        <div className="text-xs text-gray-400">Hole: {holeId || "Not selected"}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
            <h2 className="text-sm font-semibold text-gray-700">{activeSection} Logging</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCorePanelOpen(!corePanelOpen)}
              className="flex items-center gap-2 min-h-[44px]"
            >
              {corePanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Core Photos</span>
            </Button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {corePanelOpen && (
              <div className="w-full lg:w-64 flex-shrink-0 border-r border-gray-200 overflow-auto lg:block">
                <CoreImageSidebar coreSections={mockCoreSections} />
              </div>
            )}

            <main className="flex-1 overflow-auto">
              <LoggingTable key={activeSection} projectId={projectId} holeId={holeId} section={activeSection} />
            </main>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
