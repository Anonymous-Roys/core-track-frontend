"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"
import { Toaster } from "@/components/ui/toaster"

export default function Dashboard() {
  const [projectId, setProjectId] = useState("")

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        projectId={projectId}
        holeId=""
        onProjectIdChange={setProjectId}
        onHoleIdChange={() => {}}
        showHoleId={false}
        isDashboard={true}
      />
      <main className="flex-1 overflow-auto">
        <DashboardContent selectedProject={projectId} />
      </main>
      <Toaster />
    </div>
  )
}
